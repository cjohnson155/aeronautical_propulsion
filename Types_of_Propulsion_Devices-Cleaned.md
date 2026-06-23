# Types of Propulsion Devices — Cleaned Transcript & Fact-Check

*Filler words removed and obvious transcription errors corrected. Where a number or word was clearly mis-transcribed (units, "nacelle," "Otto," "ion"), I corrected it inline and noted it. The two genuine factual slips are flagged inline with a ✻ and explained in the Fact-Check section at the end.*

---

## Cleaned Transcript

### Introduction

Now that we've gone over the basics of the laws of motion and propulsive thrust force, let's look at how aeronautical propulsion devices operate in the real world. We're going to talk about eight different systems — propulsive systems that work in water, air, and space. We'll see different types of propulsion devices: some that use propellers, some that simply eject mass. We'll think about the different ways these applications generate thrust in a way that's appropriate for each.

### 1. Cargo ship propeller

Let's start with a container ship or cargo ship: a huge amount of mass sitting in the water, with a buoyancy force keeping it afloat. All we need to do is generate forward motion with our propulsion system, so typically a large-diameter propeller pushes the ship forward. It has to generate a huge amount of force because there's so much mass on these ships. A typical thrust for a big cargo ship is on the order of **500 kilonewtons** *(transcript said "500 Newtons")*. The thrust is generated largely by the area of the propeller — you can see on the right the huge diameter of this propeller and how much mass it can throw behind it. In terms of propulsive efficiency (which we'll define later, but use as a comparison metric for now), we get about 60–70% at cruise. The key design tradeoff: the bigger the propeller, the lower the ship has to sit in the water to submerge the full propeller diameter. Sitting lower means more of the hull contacts the water, which adds resistance. So it's a tradeoff between how you generate the force and how much drag you get in return.

### 2. Commercial turbofan

If you flew here from somewhere in the United States — Boston, perhaps — you most likely flew on a commercial jet, and 99% of the time that jet uses a turbofan engine. So what is a turbofan? On the right you can see a large nozzle with all the blades that make up the fan. Just as the ship's propeller pushes from aft, the turbofan's fan — essentially an enclosed, multi-bladed propeller — sucks air in from the front and pushes it out the rear. Typical thrust for a commercial turbofan is about **100–350 kilonewtons** *(transcript said "Newton")* — a fifth to a half of what those cargo ships generate. The key thrust driver is again mass flow rate, the amount of mass thrown behind us; specifically, the bypass mass flow (the air that goes around the core rather than through it) generates much of the thrust. We get about 60–75% cruise efficiency. The key tradeoff: we want a large diameter to ingest a lot of air, but that requires a bigger housing — the **nacelle** *(transcript said "nice cell" / "in itself")* that surrounds the fan — and its drag and weight penalize a larger diameter.

### 3. Turboprop

Now a simpler turboprop engine. I say simpler, but it's essentially a turbofan with the fan unhoused — the "fan" is just a propeller (here, four blades) that isn't enclosed in a nacelle. We'll learn why this is done; it's mainly due to tip speed — how fast the blade tips move as they rotate and the air flows over them. The key thrust driver is again the mass thrown behind us, by increasing the propeller area or diameter. Turboprops get very good efficiency — about 80–85% propulsive efficiency at their design speed — which is why they still exist; they're well suited to certain ranges and missions, like shorter regional flights. The tradeoff here is propeller efficiency versus the tip-compressibility limit (related to tip speed), which we'll discuss later. These also generate a good bit less thrust: about **20–50 kilonewtons**, again roughly a fifth to a half of the turbofan.

### 4. Reciprocating propeller plane

Let's look back at the very first reciprocating, propeller-driven planes. The propulsive device is still a propeller, but instead of an engine where air flows through a core, we have a reciprocating engine — like your car engine, operating on the **Otto cycle** *(transcript said "auto cycle")*. It's still air-breathing, but it doesn't pull air through a core axially; it uses piston-cylinder motion. This is where the history of flight began — these are the kinds of planes used in World War II. Thrust is much smaller: about **2–15 kilonewtons**. Like turboprops, propeller-driven systems have pretty good propulsive efficiency, which is one reason they're still around.

### 5. Quadcopter

Quadcopters are a much smaller application. We've gone from huge cargo ships, to commercial aircraft (turbofan), to regional aircraft (turboprop), to the single- or double-passenger reciprocating piston planes of the WWII / 1930s era — and now smaller still, to a quadcopter. You might ask how this goes forward. It does, but it generates thrust in a unique way. Quadcopters and helicopters are set up primarily to hover, so their propellers generate most or all of the lift force. To generate thrust, they change the relative speed of their **fore versus aft** propellers *(transcript garbled this as "rear versus for or aft versus for")*, or tilt their rotors (as helicopters do) to angle some of the lift force forward. The thrust of a typical store-bought drone is about **5–40 newtons** — we've gone from ~500 kilonewtons for the cargo ship down to a few newtons. The key thrust driver is again disk area and how fast the rotor spins. Propulsive efficiency for hovering is actually quite low. The key tradeoff is vehicle weight versus battery weight and how long it can stay airborne — its hover endurance.

### 6. Military turbojet

Now a very different application: something that needs to go extremely fast, with high maneuverability, where you care less about propulsive efficiency. The goal isn't to move people cheaply and safely across the country; it's to outrun and outmaneuver an opponent and generate huge thrust very quickly and responsively. Here we get about **50–100 kilonewtons** *(transcript said "killer Newtons")*, up to ~150 kilonewtons with afterburners. The commercial turbofan was 100–350 kilonewtons — so a similar amount of thrust, or even less. The difference, which we'll see later, is how fast you can actually fly. Thrust is proportional to the rate of change of momentum: a fighter wants to change its momentum in a very short time, while a commercial jet is mostly cruising and wants to maximize efficiency at cruise (flying fast enough to sell tickets, but not so fast it incurs shock losses near the sound barrier). For a turbojet — typically found on fighter aircraft — you don't care about efficiency as much; you want maximum speed in a short time and high maneuverability. Here the key thrust driver is not the *amount* of mass but the *speed* at which you throw it: accelerating a smaller mass to high velocity. If you're cruising supersonically with a turbojet, propulsive efficiency is only about 25–40% — very low. You're trading propulsive efficiency and fuel burn (thrust-specific fuel consumption, a key performance parameter for air-breathing propulsion) for the ability to generate thrust quickly and sustain high speed and maneuverability in aerial combat.

> ✻ Note: modern fighters mostly use *low-bypass turbofans* rather than pure turbojets. See Fact-Check.

### 7. Chemical rocket

Now we move from air-breathing (or "ocean-breathing") devices to the vacuum of space, where we can't take in air — we have to carry all our propellant mass with us. This is where chemical rocket engines come in. How much thrust do they generate? About **1 to 9 meganewtons** *(transcript garbled this as "1.129 mega newtons")*. Why so much? Because we have to overcome Earth's gravity to insert objects into orbit. Rockets might fly to the Moon or Mars, but most often they go to low-Earth orbit to deploy satellites. The key thrust driver is exhaust velocity: the large bell-shaped nozzle accelerates the gas from subsonic to high-supersonic Mach numbers, and accelerating a relatively small mass flow to that exhaust velocity drives the thrust. Like turbojets, rockets prioritize thrust over efficiency, and they have low efficiency — in fact, terrible efficiency. We don't use the same propulsive-efficiency measure as for air-breathing devices; instead we use specific impulse. The key tradeoff is thrust versus specific impulse.

> ✻ Note: the claim that this is "a thousand times" the turbofan is an overstatement — it's closer to tens to a few hundred times. See Fact-Check.

### 8. Ion thruster

Finally, the ion thruster — a relatively new concept developed to fill a gap. We want to send low-mass things into space (because rockets must generate enormous thrust relative to the mass they lift), and we want those things to operate for a long time, since de-orbiting and re-launching is expensive. An ion thruster throws a tiny amount of mass — microscopic **ions** *(transcript said "iron")* — behind it at very high velocity. Accelerating those ions to enormous exit speeds is what generates thrust. The thrust is tiny: about **0.1 to 250 millinewtons** *(transcript said "million newtons")* — thousandths of a newton. But because the mass being accelerated is so small, the spacecraft can keep accelerating almost indefinitely, building up to very high speeds over time.

### Wrap-up

Going back to basic physics: thrust equals mass flow rate times change in velocity (or mass times acceleration). Propellers on giant cargo ships throw huge amounts of mass at a low change in velocity; ion thrusters throw tiny amounts of mass at enormous velocity. Different applications trade off the drag and resistance they must overcome, the weight the propulsion device must carry and move, and efficiency. In a propulsion career you might work with meganewtons (rockets) or millinewtons (ion thrusters); with air-breathing devices that ingest large mass flows (turboprops, turbofans); or with devices that accelerate a smaller mass flow to higher velocities (turbojets). It's a wide breadth of applications, but the governing principle behind all of them is the same: the thrust force that moves us forward.

---

## Fact-Check Notes

### A. Unit errors (the big one)

Almost every thrust figure in the original is missing its metric prefix. The numbers themselves are mostly reasonable — they're just stated in the wrong unit. The internal logic of the lecture confirms this: the turboprop is given correctly in "kilonewtons" and described as "a fifth to a half" of the turbofan, which forces the turbofan (and the cargo ship before it) into kilonewtons too.

1. **Cargo ship: "500 Newtons" → ~500 kilonewtons.** 500 N is roughly the weight of a 50 kg object — nowhere near enough to move a loaded container ship. Large ships need hundreds of kN; the very largest are into the low meganewtons. 500 kN is a fair "big ship" figure.
2. **Commercial turbofan: "100–350 Newton" → 100–350 kilonewtons.** Correct order of magnitude per engine (e.g., a narrowbody engine ≈ 120 kN; large widebody engines exceed 350 kN). Stated in newtons, it's off by 1,000×.
3. **"killer Newtons" / "killing Newtons" → kilonewtons (kN).** This appears for the turbojet (50–100 kN, +150 kN afterburner), turboprop (20–50 kN), and reciprocating engine (2–15 kN). The numbers are fine; only the word was mis-heard.
4. **Ion thruster: "0.1 to 250 million newtons" → 0.1 to 250 millinewtons (mN).** "Million" should be "milli." This is off by a factor of a billion. Real ion/Hall thrusters produce on the order of tenths of a millinewton up to a couple hundred millinewtons, so 0.1–250 mN is right.
5. **Rocket: "1.129 mega newtons" → "1 to 9 meganewtons."** This is a garbled reading of "1 to 9." A range of 1–9 MN per engine is reasonable for large chemical engines.

### B. Substantive factual slips

6. **"Rockets generate a thousand times what a turbofan does at cruise."** Overstated. Rocket ≈ 1–9 MN; turbofan ≈ 100–350 kN at takeoff (less at cruise). That's roughly tens to a few hundred times, not a thousand. The qualitative point (rockets produce far more thrust) is correct; the multiplier is too high.
7. **"An ion thruster's thrust [a thousandth of a newton] is on the order of what we saw for quadcopters."** Incorrect. Quadcopters were just given as 5–40 newtons. An ion thruster (≈ 0.0001–0.25 N) produces *far less* — by a factor of roughly hundreds to hundreds of thousands. Ion thrusters are not comparable to quadcopters in thrust; that's the whole point of contrasting tiny thrust over very long durations. (I removed the false comparison in the cleaned version.)

### C. Other mis-transcribed words

8. **"nice cell" / "in itself" → nacelle** — the housing around a turbofan.
9. **"auto cycle" → Otto cycle** — the thermodynamic cycle of a spark-ignition piston engine (the speaker actually self-corrects to "Otto" right after).
10. **"iron charged particles" → ion** — ion thrusters accelerate ions (commonly xenon), not iron.
11. **"commercial chat" → commercial jet.**
12. **"rear versus for or aft versus for" → fore versus aft** — the front-vs-rear rotor speed difference that tilts a multirotor forward.

### D. Things that check out

- ~99% of commercial airliners use turbofans. ✓
- Most of a high-bypass turbofan's thrust comes from the bypass stream. ✓
- Turboprop propulsive efficiency ≈ 80–85% at its design point. ✓
- Supersonic turbojet propulsive efficiency is low (~25–40% range). ✓
- Rockets are measured by specific impulse rather than the air-breathing definition of propulsive efficiency. ✓
- A converging–diverging (bell) nozzle accelerates exhaust from subsonic to supersonic. ✓
- Thrust = ṁ·Δv (or m·a). ✓
- The marine-propeller efficiency figure (60–70%) is reasonable; turbofan cruise efficiency (60–75%) is fine, if slightly conservative for the newest high-bypass engines.

### One terminology caveat

The fighter section calls the engines "turbojets." That's a useful teaching label, but most modern fighters actually fly on **low-bypass turbofans**. The lesson's logic still holds (low bypass, high exhaust velocity, speed and responsiveness prioritized over efficiency) — just note that "pure turbojet" fighters are mostly older designs.
