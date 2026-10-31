# NeighbourNet 3D — Society & Community Safety Management System

> **Tagline:** *Your neighbourhood. Your voice. Your safety.*  
> **Archetype:** 24-Hour Hackathon High-Reliability MVP  
> **Interface Paradigm:** 2D / Isometric Interactive Vector Canvas with Spatial Depth (Campus $\rightarrow$ Building $\rightarrow$ Floor)

---

## 1. System Overview

**NeighbourNet 3D** replaces chaotic WhatsApp group chats and lost maintenance calls with an interactive, location-anchored society management platform.

Every maintenance issue, utility fault, or safety report is tied to a specific building and floor in **Green Valley Residency** through an intuitive vector schematic with complete timeline auditing.

### Key Architectural Pillars
* **100% Deterministic (Zero-AI):** No chatbots, external ML APIs, or automated suspicion scoring. Triage and duplicate matching are completely rule-based and transparent.
* **Dual-Mode Engine (Zero-Config Demo Mode):** Operates seamlessly offline out-of-the-box using browser `localStorage` and a local reactive event bus. Connects to Firebase Cloud when `VITE_USE_FIREBASE="true"`.
* **Privacy by Design (PII Masking):** Public maps and community feeds never expose resident names, phone numbers, or private flat numbers.
* **Atomic Sequential IDs:** Tickets consistently receive unique identifiers in the format `NN-YYYY-NNNN` (e.g., `NN-2026-0001`).

---

## 2. Quick Start & Execution

### Prerequisites
* Node.js 18+ and npm / pnpm / yarn

### Installation
```bash
# Navigate to project directory
cd neighbournet-3d

# Install dependencies
npm install

# Start local development server
npm run dev
```

Visit `http://localhost:3000` to launch the application.

---

## 3. Demo Personas & Pre-Configured Test Credentials

For fast, zero-typing evaluation during judge presentations, one-touch login buttons are available directly on the login portal:

| Persona | Email | Password | Role | Assigned Flat & Location |
|---|---|---|---|---|
| **Resident** | `resident@demo.com` | `Demo@1234` | `resident` | Building A, Flat A-203 (Phone: +91 98201 22334) |
| **Administrator** | `admin@demo.com` | `Admin@1234` | `admin` | Facility Office, Clubhouse (Phone: +91 98111 99887) |

---

## 4. 15-Step Hackathon Demonstration Script (3 Minutes)

1. **Landing Page (`/`):** Open home page. Verify the green **"Demo Mode Active"** badge is illuminated in the top navigation.
2. **Resident Quick Login (`/login`):** Click the one-touch *"Sign in as Resident (Kavita Sharma)"* button.
3. **Explore Campus Map (`/map`):** Showcase the Green Valley Residency campus map. Hover over **Building A** to reveal the 3 active issues and color-coded status badge.
4. **Inspect Building A:** Click Building A to open the Building Inspector drawer showing the 5-floor breakdown.
5. **Drill Down to Floor 2:** Click *"Second Floor"*.
6. **Floor Blueprint View:** Point out the floor schematic with existing pins (Water Leakage and Corridor Light). Click the leaking water pipe pin to view quick details (`NN-2026-0001`).
7. **Initiate New Complaint:** Click `"+ Report Issue on this Floor"`. Building A and Second Floor are pre-selected automatically.
8. **Trigger Duplicate Interceptor:** Select category *"Electricity Failure"*, zone *"Corridor"*, and type *"Corridor light flickering and sparking"*. Click Submit.
9. **Duplicate Warning Modal:** The deterministic duplicate detector intercepts submission and displays `NN-2026-0002`. Click *"Continue with New Report"*.
10. **Atomic Sequential ID:** Submit report. Observe newly generated sequential ID `NN-2026-0009`.
11. **Switch to Admin Persona:** Click the persona switcher in the top navigation to switch to *Major Vikram Rathore (`admin@demo.com`)*.
12. **Admin Operations Hub (`/admin`):** Review Recharts telemetry, high-priority ticket count, and the *"Needs Immediate Attention"* triage queue.
13. **Triage & Dispatch (`/admin/review/NN-2026-0009`):** Open the ticket. Click *"Approve"*, set priority to `High`, and assign to `Plumbing & Water Works`.
14. **Set ETA & Progress:** Move ticket to `IN_PROGRESS`, specify an ETA in the future, and add a dispatch remark.
15. **Resident Real-Time Verification:** Switch persona back to Resident. Observe the notification bell with live unread counter, the status badge updated to `IN_PROGRESS`, and the timeline updated in real time without refreshing.

---

## 5. Security & Authorization Rules

Production security rules are located in the repository root:
* [`firestore.rules`](file:///C:/Users/harshita/.gemini/antigravity/scratch/neighbournet-3d/firestore.rules) (Restricts resident mutations to `PENDING_VERIFICATION`, guards private tickets, and enforces append-only audit logs)
* [`storage.rules`](file:///C:/Users/harshita/.gemini/antigravity/scratch/neighbournet-3d/storage.rules) (Restricts attachments to 2MB and enforces image MIME types)

---

## 6. Project Architecture

```
neighbournet-3d/
├── firestore.rules
├── storage.rules
├── src/
│   ├── types/index.ts                 # Full domain TypeScript contracts
│   ├── services/
│   │   ├── eventEmitter.ts          # Reactive browser pub/sub
│   │   ├── demoDataService.ts       # Local repository & atomic counter
│   │   ├── complaintService.ts      # Dual Firebase/LocalStorage provider
│   │   └── authService.ts           # Hybrid auth & demo switcher
│   ├── context/
│   │   ├── AuthContext.tsx          # User session container
│   │   └── DataContext.tsx          # Real-time state container
│   ├── components/
│   │   ├── common/                  # Badges, Buttons, Emergency Banners
│   │   ├── map/                     # CampusSvgMap & FloorSchematic
│   │   └── layout/                  # Navbar, Footer, ProtectedRoute
│   └── pages/                       # 15 Complete, routed application screens
```
