# NeighbourNet 3D — Digital Society & Community Safety Management

> **Tagline:** *Your neighbourhood. Your voice. Your safety.*  
> **Project Type:** Interactive 2D/Isometric Society Management Platform  
> **Target Audience:** Gated Communities, Apartment Associations, Facility Management Committees, Residents

---

## 1. The Real-World Problem (What Residents & Societies Face Today)

In most residential societies and high-rise apartments, issue reporting and maintenance follow chaotic, informal channels (WhatsApp groups, phone calls, paper complaint registers, or word-of-mouth with security guards). This creates widespread frustration:

| Current Problem | What Actually Happens | Impact on Residents & Management |
|---|---|---|
| **Lost & Buried Messages** | Maintenance requests get buried under casual conversation, greeting messages, and debates in society WhatsApp groups. | Residents wait days or weeks for simple plumbing or electrical repairs, feeling ignored. |
| **Duplicate Reports** | When an elevator halts or corridor lighting fails, 10–15 residents report the identical issue separately. | Society management desk gets overwhelmed by redundant complaints; technicians are dispatched multiple times. |
| **No Location Precision** | Reports mention vague locations like *"water dripping near the stairs"* without specifying tower, floor, or zone. | Technicians waste hours searching corridors, or inspect the wrong tower entirely. |
| **Lack of Transparency & Audit Trail** | Once reported, residents have zero visibility into who was assigned, when work started, or estimated resolution times. | Residents repeatedly call the estate manager demanding updates; management has no defensible record of action. |
| **Privacy & Safety Violations** | Sensitive reports (theft, suspicious activity, harassment) posted to group chats expose the resident's name, phone, and flat number. | Residents fear retaliation or embarrassment, leading to critical safety hazards going unreported. |
| **False Alarms & Ghost Closures** | Tickets are marked "closed" by office staff without verified on-site confirmation or resident validation. | Unresolved hazards persist, damaging trust between residents and the managing committee. |

---

## 2. What People Get with NeighbourNet 3D (The Solution)

**NeighbourNet 3D** introduces spatial clarity, zero-AI deterministic duplicate detection, and end-to-end accountability by anchoring every report to an interactive vector map:

```
[Society Campus (Level 1)] ──▶ [Building Tower (Level 2)] ──▶ [Floor Schematic & Micro-Zones (Level 3)]
```

### Key Resident & Society Outcomes:

### 1. Spatial Precision (Campus $\rightarrow$ Building $\rightarrow$ Floor)
* **Interactive Campus SVG Map:** Residents select their specific tower (A, B, C, D) and floor (Ground to 4th) on an interactive vector schematic.
* **Micro-Zone Anchoring:** Complaints pin to 5 distinct zones: `Flat Door Area`, `Central Corridor`, `Elevator Lobby`, `Staircase (Fire Exit)`, or `Utility Shaft`. Technicians know the exact spot before stepping into the building.
* **Collision-Free Jitter Engine:** Multiple issues in the same zone dynamically offset so pins never obscure each other.

### 2. Zero-AI Duplicate Interception
* **Instant Smart Warning:** Before submitting a report, deterministic lexical and zone analysis checks for existing active issues in that location.
* **Reduces Redundancy:** Residents see the existing report and can choose to **"View Existing Complaint"** rather than cluttering the queue. If they still wish to proceed, both tickets link without auto-rejection.

### 3. Complete Transparency (Immutable Timeline Stepper)
* **Real-Time Audit Trail:** Every status change (`PENDING_VERIFICATION` $\rightarrow$ `APPROVED` $\rightarrow$ `ASSIGNED` $\rightarrow$ `IN_PROGRESS` $\rightarrow$ `RESOLVED`) appends a vertical audit log with actor identity, timestamp, and technician remarks.
* **Accountability:** Residents can track assigned maintenance teams (Plumbing, Electrical, Lift, Security) and see future expected resolution times (ETA).

### 4. Privacy by Design (PII Protection)
* **Public Feed Protection:** Community feeds and campus maps display only the Tower and Floor. The reporting resident's name, phone number, and specific flat unit remain strictly private.
* **Confidential Safety Reports:** Sensitive categories (*Theft, Suspicious Activity, Security Concerns*) default to private status accessible only by security admins.
* **Emergency Hotlines:** High-risk safety reports automatically present persistent advisories with direct emergency numbers (112 / 101 / 100).

### 5. Community Validation & Real Resident Voice
* **Live Confirmation Voting:** On public issues, fellow residents can vote **"Issue Still Exists"** or **"Issue Resolved"** to give administrators grounded field feedback without algorithmic bias.
* **Zero-Config Offline Demo Mode:** Operates with 100% offline local resilience, pre-seeded with sample data so operations never fail due to network drops.

---

## 3. Before vs. After Summary

```
BEFORE NEIGHBOURNET 3D:
[Chaotic WhatsApp Group] ──▶ [Buried Complaint] ──▶ [10 Duplicate Calls] ──▶ [No ETA] ──▶ [Unverified Closure]

AFTER NEIGHBOURNET 3D:
[Interactive Campus Map] ──▶ [Precise Floor Pin] ──▶ [Duplicate Intercepted] ──▶ [Live ETA & Stepper] ──▶ [Verified Fix]
```

---

## 4. Quick Access & Demonstration Links

* **Live Standalone Application:** [`standalone.html`](file:///C:/Users/harshita/.gemini/antigravity/scratch/neighbournet-3d/standalone.html)
* **Complete ZIP Archive:** [`neighbournet-3d.zip`](file:///C:/Users/harshita/.gemini/antigravity/scratch/neighbournet-3d.zip)
* **Detailed Technical Documentation:** [`README.md`](file:///C:/Users/harshita/.gemini/antigravity/scratch/neighbournet-3d/README.md)
