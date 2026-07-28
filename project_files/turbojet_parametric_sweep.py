"""
turbojet_parametric_sweep.py
----------------------------
Parametric sweep wrapper around simple_turbojet.py.

Varies one design parameter at a time while holding all others fixed,
runs the pyCycle DESIGN-point model for each value, extracts total
temperature and pressure at every flow station, and produces overlay
plots saved to turbojet_plots/sweep_*.png.

Run from the pythonAnalysis folder:
    python turbojet_parametric_sweep.py

Sweep parameters (edit the lists at the bottom):
  - T4_values    : turbine inlet temperature [°R]
  - PR_values    : compressor pressure ratio
  - eta_c_values : compressor efficiency
  - eta_t_values : turbine efficiency
  - alt_values   : altitude [ft]
"""

import sys, os, time
import numpy as np
import matplotlib.pyplot as plt
import matplotlib.cm as cm
import openmdao.api as om
import pycycle.api as pyc

# ── Import the Turbojet class from simple_turbojet.py ─────────────────────────
sys.path.insert(0, os.path.dirname(__file__))
from simple_turbojet import Turbojet

STATION_NAMES = ['fc.Fl_O', 'inlet.Fl_O', 'comp.Fl_O', 'burner.Fl_O', 'turb.Fl_O', 'nozz.Fl_O']
STATION_LABELS = ['Freestream', 'Inlet', 'Compressor', 'Burner', 'Turbine', 'Nozzle']
OUTPUT_DIR = os.path.join(os.path.dirname(__file__), 'turbojet_plots')
os.makedirs(OUTPUT_DIR, exist_ok=True)

# ── Default design-point inputs ───────────────────────────────────────────────
DEFAULTS = dict(
    alt=0.0,        # ft
    MN=0.000001,
    Fn_target=11800.0,  # lbf
    T4=2370.0,      # °R
    PR=13.5,
    eta_c=0.83,
    eta_t=0.86,
)

# ── Build and setup the model once ────────────────────────────────────────────
def build_problem():
    """Create, setup, and warm-start the DESIGN-point OpenMDAO problem."""

    class SinglePoint(pyc.MPCycle):
        def setup(self):
            self.pyc_add_pnt('DESIGN', Turbojet())
            self.set_input_defaults('DESIGN.Nmech', 8070.0, units='rpm')
            self.set_input_defaults('DESIGN.inlet.MN', 0.60)
            self.set_input_defaults('DESIGN.comp.MN', 0.020)
            self.set_input_defaults('DESIGN.burner.MN', 0.020)
            self.set_input_defaults('DESIGN.turb.MN', 0.4)
            self.pyc_add_cycle_param('burner.dPqP', 0.03)
            self.pyc_add_cycle_param('nozz.Cv', 0.99)
            super().setup()

    prob = om.Problem()
    prob.model = SinglePoint()
    prob.setup(check=False)
    prob.set_solver_print(level=-1)

    # Warm-start guesses
    prob['DESIGN.balance.FAR'] = 0.0175506829934
    prob['DESIGN.balance.W']   = 168.453135137
    prob['DESIGN.balance.turb_PR'] = 4.46138725662
    prob['DESIGN.fc.balance.Pt']   = 14.6955113159
    prob['DESIGN.fc.balance.Tt']   = 518.665288153

    return prob


def set_inputs(prob, alt, MN, Fn_target, T4, PR, eta_c, eta_t):
    """Apply design-point inputs to the problem."""
    prob.set_val('DESIGN.fc.alt',              alt,       units='ft')
    prob.set_val('DESIGN.fc.MN',               MN)
    prob.set_val('DESIGN.balance.Fn_target',   Fn_target, units='lbf')
    prob.set_val('DESIGN.balance.T4_target',   T4,        units='degR')
    prob.set_val('DESIGN.comp.PR',             PR)
    prob.set_val('DESIGN.comp.eff',            eta_c)
    prob.set_val('DESIGN.turb.eff',            eta_t)


def extract_stations(prob, pt='DESIGN'):
    """Pull Tt and Pt at every flow station."""
    Tt, Pt = [], []
    for fs in STATION_NAMES:
        key = f'{pt}.{fs}'
        try:
            Tt.append(float(prob.get_val(f'{key}:tot:T', units='degR')))
            Pt.append(float(prob.get_val(f'{key}:tot:P', units='psia')))
        except Exception:
            # freestream uses stat values
            Tt.append(float(prob.get_val(f'{key}:stat:T', units='degR')))
            Pt.append(float(prob.get_val(f'{key}:stat:P', units='psia')))
    return np.array(Tt), np.array(Pt)


def extract_perf(prob, pt='DESIGN'):
    return {
        'Fn':   float(prob.get_val(f'{pt}.perf.Fn',   units='lbf')),
        'TSFC': float(prob.get_val(f'{pt}.perf.TSFC', units='lbm/(lbf*h)')),
        'OPR':  float(prob.get_val(f'{pt}.perf.OPR')),
    }


def run_sweep(prob, sweep_param, sweep_values, base=None):
    """
    Run the design point for each value in sweep_values.
    sweep_param: one of 'T4', 'PR', 'eta_c', 'eta_t', 'alt'
    Returns list of dicts with Tt, Pt arrays and perf metrics.
    """
    if base is None:
        base = DEFAULTS.copy()
    results = []
    for val in sweep_values:
        params = base.copy()
        params[sweep_param] = val
        set_inputs(prob, **params)
        try:
            prob.run_model()
            Tt, Pt = extract_stations(prob)
            perf   = extract_perf(prob)
            results.append({'val': val, 'Tt': Tt, 'Pt': Pt, **perf, 'converged': True})
            print(f"  {sweep_param}={val:8.3f}  Fn={perf['Fn']:8.1f} lbf  "
                  f"TSFC={perf['TSFC']:.5f}  OPR={perf['OPR']:.3f}")
        except Exception as e:
            print(f"  {sweep_param}={val}  FAILED: {e}")
            results.append({'val': val, 'converged': False})
    return results


# ── Plotting helpers ──────────────────────────────────────────────────────────
DARK = '#0d1117'
CARD = '#161b22'
GRID = '#21262d'
TEXT = '#f0f6fc'
MUTED= '#8b949e'

def _dark_ax(ax):
    ax.set_facecolor(CARD)
    for s in ax.spines.values(): s.set_color(GRID)
    ax.tick_params(colors=MUTED)
    ax.xaxis.label.set_color(MUTED)
    ax.yaxis.label.set_color(MUTED)
    ax.title.set_color(TEXT)
    ax.grid(True, color=GRID, linewidth=0.8)


def make_station_plots(results, sweep_param, units_label, colormap='plasma', filename=None):
    """Two-panel station plot: Tt and Pt, one line per sweep value."""
    good = [r for r in results if r.get('converged')]
    if not good:
        print("No converged points — skipping plot.")
        return

    colors = getattr(cm, colormap)(np.linspace(0.2, 0.9, len(good)))
    fig, axes = plt.subplots(1, 2, figsize=(14, 5))
    fig.patch.set_facecolor(DARK)

    for ax in axes:
        _dark_ax(ax)

    for r, c in zip(good, colors):
        lbl = f'{sweep_param} = {r["val"]:.4g} {units_label}'
        axes[0].plot(STATION_LABELS, r['Tt'], 'o-', color=c, label=lbl, lw=2, ms=6)
        axes[1].plot(STATION_LABELS, r['Pt'], 's-', color=c, label=lbl, lw=2, ms=6)

    axes[0].set_title(f'Total Temperature — sweep {sweep_param}', fontsize=12)
    axes[0].set_ylabel('Total Temperature (°R)')
    axes[0].legend(fontsize=9, facecolor=DARK, labelcolor=TEXT, edgecolor=GRID)

    axes[1].set_title(f'Total Pressure — sweep {sweep_param}', fontsize=12)
    axes[1].set_ylabel('Total Pressure (psia)')
    axes[1].legend(fontsize=9, facecolor=DARK, labelcolor=TEXT, edgecolor=GRID)

    plt.tight_layout()
    fname = filename or os.path.join(OUTPUT_DIR, f'sweep_{sweep_param}.png')
    plt.savefig(fname, dpi=150, bbox_inches='tight', facecolor=DARK)
    plt.close()
    print(f"  Saved: {fname}")


def make_ts_diagram(results, sweep_param, units_label, colormap='plasma', filename=None):
    """T-s diagram with one cycle trace per sweep value."""
    good = [r for r in results if r.get('converged')]
    if not good:
        return

    gamma, cp_btu = 1.4, 0.24
    R_btu = cp_btu * (gamma-1) / gamma

    colors = getattr(cm, colormap)(np.linspace(0.2, 0.9, len(good)))
    fig, ax = plt.subplots(figsize=(9, 6))
    fig.patch.set_facecolor(DARK)
    _dark_ax(ax)

    for r, c in zip(good, colors):
        Tt, Pt = r['Tt'], r['Pt']
        s = [0.0]
        for i in range(1, len(Tt)):
            ds = cp_btu * np.log(Tt[i]/Tt[i-1]) - R_btu * np.log(Pt[i]/Pt[i-1])
            s.append(s[-1] + ds)
        ax.plot(s, Tt, 'o-', color=c, lw=2.5, ms=7,
                label=f'{sweep_param}={r["val"]:.4g} {units_label}')
        for j, lbl in enumerate(['0','1','2','3','4','5']):
            ax.annotate(lbl, (s[j], Tt[j]), textcoords='offset points',
                        xytext=(5, 4), fontsize=8, color=c, alpha=0.7)

    ax.set_xlabel('Relative Entropy (BTU/lb·°R)', fontsize=11)
    ax.set_ylabel('Total Temperature (°R)', fontsize=11)
    ax.set_title(f'T–s Diagram — sweep {sweep_param}', fontsize=12)
    ax.legend(fontsize=9, facecolor=DARK, labelcolor=TEXT, edgecolor=GRID)
    plt.tight_layout()
    fname = filename or os.path.join(OUTPUT_DIR, f'ts_sweep_{sweep_param}.png')
    plt.savefig(fname, dpi=150, bbox_inches='tight', facecolor=DARK)
    plt.close()
    print(f"  Saved: {fname}")


def make_performance_plot(all_sweeps, filename=None):
    """Bar/line plots of Fn, TSFC, OPR across sweeps."""
    fig, axes = plt.subplots(1, 3, figsize=(15, 5))
    fig.patch.set_facecolor(DARK)
    metrics = [('Fn', 'Net Thrust (lbf)', '#06b6d4'),
               ('TSFC', 'TSFC (lbm/lbf·hr)', '#f59e0b'),
               ('OPR', 'Overall Pressure Ratio', '#a78bfa')]

    for ax, (key, ylabel, color) in zip(axes, metrics):
        _dark_ax(ax)
        for label, results in all_sweeps.items():
            good = [r for r in results if r.get('converged')]
            if not good: continue
            xs = [r['val'] for r in good]
            ys = [r[key] for r in good]
            ax.plot(xs, ys, 'o-', lw=2, ms=6, label=label, color=color)
        ax.set_ylabel(ylabel)
        ax.set_title(ylabel)
        ax.legend(fontsize=8, facecolor=DARK, labelcolor=TEXT, edgecolor=GRID)

    plt.tight_layout()
    fname = filename or os.path.join(OUTPUT_DIR, 'performance_sweep.png')
    plt.savefig(fname, dpi=150, bbox_inches='tight', facecolor=DARK)
    plt.close()
    print(f"  Saved: {fname}")


# ── Main ──────────────────────────────────────────────────────────────────────
if __name__ == '__main__':
    print("Building pyCycle model...")
    prob = build_problem()

    # ── Sweep 1: Turbine Inlet Temperature (T4) ───────────────────────────────
    T4_values = [2100, 2200, 2370, 2500, 2600]   # °R  (design = 2370)
    print(f"\nSweeping T4: {T4_values}")
    T4_results = run_sweep(prob, 'T4', T4_values)
    make_station_plots(T4_results, 'T4', '°R', colormap='plasma')
    make_ts_diagram(T4_results, 'T4', '°R', colormap='plasma')

    # ── Sweep 2: Compressor Pressure Ratio ────────────────────────────────────
    PR_values = [8, 10, 13.5, 16, 20]
    print(f"\nSweeping PR: {PR_values}")
    PR_results = run_sweep(prob, 'PR', PR_values)
    make_station_plots(PR_results, 'PR', '', colormap='cool')
    make_ts_diagram(PR_results, 'PR', '', colormap='cool')

    # ── Sweep 3: Compressor efficiency ────────────────────────────────────────
    eta_c_values = [0.75, 0.80, 0.83, 0.86, 0.90]
    print(f"\nSweeping eta_c: {eta_c_values}")
    eta_c_results = run_sweep(prob, 'eta_c', eta_c_values)
    make_station_plots(eta_c_results, 'eta_c', '', colormap='viridis')

    # ── Combined performance summary ──────────────────────────────────────────
    make_performance_plot({
        'T4 sweep': T4_results,
        'PR sweep': PR_results,
        'η_c sweep': eta_c_results,
    })

    print(f"\nAll plots saved to: {OUTPUT_DIR}")
