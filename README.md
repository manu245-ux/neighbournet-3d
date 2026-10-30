# 🏘️ NeighbourNet 3D
### Society & Community Safety Management System

> **Your neighbourhood. Your voice. Your safety.**

**NeighbourNet 3D** is a location-based society management platform designed to simplify residential community operations, maintenance reporting, and safety management through an interactive digital representation of a residential society.

Instead of depending on scattered WhatsApp messages, phone calls, and manual complaint registers, residents can report problems directly on a digital society map, select their building and floor, track complaint progress, and receive updates.

Administrators can review complaints, prioritize issues, assign maintenance teams, and monitor society operations through a centralized dashboard.

---

# 1. Project Overview

NeighbourNet 3D creates a digital representation of a residential society called **Green Valley Residency**.

The platform follows a hierarchical navigation structure:

**Society → Building → Floor → Location → Complaint**

Each maintenance issue, utility fault, or safety report is associated with a specific building and floor.

The system provides an interactive 2D/isometric map with spatial depth, allowing residents to navigate the society and identify the exact location of an issue.

### Our Vision

To make residential communities more organized, transparent, connected, and safer through a centralized digital management platform.

### Core Principles

- **Zero-AI Architecture:** All application operations use deterministic logic and predefined rules. No AI chatbot, external ML API, or automated suspicion scoring is used.
- **Location-Based Reporting:** Complaints are associated with specific buildings, floors, and locations.
- **Transparency:** Residents can follow the progress of their complaints through status updates and timelines.
- **Privacy by Design:** Public maps and community feeds do not expose residents' names, phone numbers, or private flat numbers.
- **Reliable Demo Mode:** The application works locally using browser LocalStorage without requiring Firebase.
- **Scalable Architecture:** A Firebase integration option is available for cloud-based data storage.

---

# 2. Problem Statement

Residential societies frequently face communication and management challenges.

### Problems We Address

1. **Scattered Communication:** Maintenance requests get lost in WhatsApp groups and personal messages.
2. **Unclear Issue Locations:** Administrators often struggle to identify the exact building, floor, or location of a reported problem.
3. **Lack of Transparency:** Residents do not know whether their complaints have been reviewed or resolved.
4. **Delayed Maintenance:** Without centralized prioritization, urgent problems may not receive timely attention.
5. **Duplicate Complaints:** Multiple residents may report the same problem without knowing that it has already been registered.
6. **Manual Record Keeping:** Tracking complaints, assignments, and maintenance history manually is inefficient.
7. **Limited Accountability:** Residents need a clear record of actions taken on their complaints.

### Our Solution

NeighbourNet 3D combines an interactive society map, structured complaint management, administrator controls, and transparent complaint timelines in one platform.

---

# 3. Key Features

## 3.1 Interactive Society Map

The application provides an interactive visual representation of Green Valley Residency.

Features include:

- Digital society campus map.
- Multiple buildings with individual identities.
- Building-level issue indicators.
- Color-coded complaint status indicators.
- Interactive building selection.
- Building inspection drawer.
- Navigation from society to building and floor.

## 3.2 Building & Floor Navigation

Each building contains multiple floors.

Residents can:

- Select a building from the society map.
- View its floor breakdown.
- Select a particular floor.
- Explore the floor blueprint.
- Identify existing maintenance issues.
- View complaint details associated with a location.

## 3.3 Location-Based Complaint Registration

Residents can report maintenance and safety problems through a structured reporting interface.

Complaint information includes:

- Complaint category.
- Building.
- Floor.
- Specific location or zone.
- Issue description.
- Priority information.
- Optional supporting attachments, where enabled.

The selected building and floor are automatically populated when a complaint is initiated from the floor view.

## 3.4 Rule-Based Duplicate Detection

NeighbourNet 3D uses deterministic rules to identify potentially duplicate complaints.

The system evaluates predefined complaint attributes instead of using AI or machine learning.

When a potential duplicate is identified:

1. The system detects a matching existing complaint.
2. A duplicate warning appears.
3. The resident can review the warning.
4. The resident can continue with a new report if appropriate.

This helps reduce unnecessary duplicate records while keeping the decision process transparent.

## 3.5 Complaint Tracking & Timeline

Every complaint receives a unique sequential ticket ID.

Format:

`NN-YYYY-NNNN`

Example:

`NN-2026-0001`

The complaint timeline maintains a history of relevant status changes and administrative actions.

Residents can monitor their complaint progress without repeatedly contacting the administrator.

## 3.6 Administrator Dashboard

The administrator dashboard provides a centralized operational view.

Features include:

- Total complaint monitoring.
- High-priority complaint count.
- Pending verification queue.
- Issues requiring immediate attention.
- Complaint review and approval.
- Priority assignment.
- Maintenance department assignment.
- Estimated resolution time.
- Dispatch remarks.
- Complaint progress monitoring.
- Operational analytics using Recharts.

## 3.7 Real-Time Updates

The application uses a reactive event-driven architecture.

In local demo mode, an event emitter and shared application state help synchronize changes between application views.

With Firebase mode enabled, cloud-backed integration can be used for data synchronization.

Residents can observe updated complaint statuses and notifications without manually refreshing the application.

## 3.8 Privacy Protection

Privacy is an important part of NeighbourNet 3D.

- Public society maps do not expose private flat numbers.
- Public community feeds mask personal information.
- Resident names and phone numbers are not displayed publicly.
- Administrator operations are separated from resident operations.
- Firebase security rules provide an additional authorization layer when cloud mode is configured.

---

# 4. User Roles & Functionalities

The application supports two primary user roles.

## 4.1 Resident

Residents can:

- Sign in to the platform.
- Explore the interactive society map.
- View buildings and floors.
- Identify reported issues.
- Register maintenance complaints.
- Review potential duplicate warnings.
- Track complaint status.
- View complaint timelines.
- Receive notifications about complaint updates.

## 4.2 Administrator

Administrators can:

- Access the administration dashboard.
- Review newly submitted complaints.
- Approve complaints.
- Assign complaint priorities.
- Allocate maintenance departments.
- Set estimated resolution times.
- Update complaint progress.
- Add dispatch remarks.
- Monitor pending and high-priority issues.
- Review operational analytics.

---

# 5. Complaint Management Workflow

The complaint management process follows a structured workflow.

### Resident Workflow

1. Resident opens the application.
2. Resident logs in.
3. Resident explores the society map.
4. Resident selects a building.
5. Resident selects a floor.
6. Resident selects a location or zone.
7. Resident submits a complaint.
8. The system checks for potential duplicates.
9. A unique complaint ID is generated.
10. The complaint becomes available for administrator review.

### Administrator Workflow

1. Administrator opens the dashboard.
2. Administrator reviews pending complaints.
3. Administrator opens a complaint.
4. Administrator approves the complaint.
5. Administrator assigns a priority.
6. Administrator selects the responsible maintenance department.
7. Administrator sets an estimated resolution time.
8. Administrator updates the complaint status.
9. Administrator adds dispatch remarks.
10. The resident can view the updated complaint timeline.

---

# 6. Complaint Status Lifecycle

The complaint management system uses status-based tracking.

| Status | Description |
|---|---|
| `PENDING_VERIFICATION` | Complaint is awaiting administrative verification. |
| `IN_PROGRESS` | Approved complaint is being handled. |
| `RESOLVED` | Complaint has been marked as resolved. |

The timeline helps maintain transparency regarding complaint progress.

---

# 7. Technology Stack

The project uses a modern web application architecture.

| Technology | Purpose |
|---|---|
| React | Frontend user interface |
| TypeScript | Type-safe application development |
| Vite | Development server and build tooling |
| CSS / SVG | Interface styling and interactive maps |
| Recharts | Dashboard analytics and visualizations |
| Firebase Authentication | Cloud authentication integration |
| Cloud Firestore | Cloud database integration |
| Firebase Storage | Attachment storage integration |
| Browser LocalStorage | Offline demo data persistence |
| Event Emitter | Reactive local event communication |

**Note:** Firebase integrations are optional and depend on the application configuration. Local demo mode is designed to work without Firebase credentials.

---

# 8. System Architecture

NeighbourNet 3D follows a modular architecture.

### Main Architectural Components

**1. Presentation Layer**
- Society map.
- Building inspector.
- Floor blueprint.
- Complaint forms.
- Resident dashboard.
- Administrator dashboard.

**2. Context Layer**
- Authentication context.
- Shared application data context.
- User session management.
- Reactive state updates.

**3. Service Layer**
- Authentication service.
- Complaint management service.
- Demo data service.
- Event emitter.
- Data persistence and synchronization.

**4. Storage Layer**
- Browser LocalStorage for demo mode.
- Firebase Firestore for cloud-backed records.
- Firebase Storage for attachments.

### Architecture Principles

- Separation of concerns.
- Reusable components.
- Centralized application state.
- Deterministic business logic.
- Modular service architecture.
- Role-based access control.
- Consistent complaint identification.

---

# 9. Demo Mode & Cloud Mode

NeighbourNet 3D supports two operating modes.

## Demo Mode

Demo mode is designed for hackathons, presentations, and local testing.

Characteristics:

- No Firebase setup required.
- Uses browser LocalStorage.
- Uses predefined demo accounts.
- Uses local reactive event communication.
- Supports complaint registration and tracking.
- Suitable for demonstrating the complete application workflow.

## Firebase Cloud Mode

Firebase integration can be enabled using:

`VITE_USE_FIREBASE="true"`

Cloud mode is intended to support:

- Firebase Authentication.
- Cloud Firestore data persistence.
- Firebase Storage attachments.
- Cloud-backed application operations.

Actual cloud functionality requires valid Firebase project configuration and security rules.

---

# 10. Security & Privacy Architecture

Security rules are included in the repository.

### Firestore Rules

`firestore.rules`

Designed to:

- Restrict resident mutations to permitted complaint states.
- Protect private complaint records.
- Enforce append-only audit log behavior.
- Separate resident and administrator permissions.

### Storage Rules

`storage.rules`

Designed to:

- Restrict attachment size to 2 MB.
- Allow supported image MIME types.
- Apply storage access restrictions.

### Privacy Considerations

The platform avoids exposing private resident information through public maps and feeds.

**Important:** Demo credentials are intended only for local testing. Production deployment requires real authentication, configured backend authorization, secure secrets management, and security-rule testing.

---

# 11. Installation & Execution

## Prerequisites

Install the following:

- Node.js 18 or later.
- npm, pnpm, or yarn.
- Visual Studio Code or another code editor.
- A modern web browser.

## Step 1: Clone or Open the Project

```bash
git clone <YOUR_REPOSITORY_URL>
cd neighbournet-3d
```

If you already have the project folder, simply open it in your terminal.

## Step 2: Install Dependencies

```bash
npm install
```

## Step 3: Start the Development Server

```bash
npm run dev
```

## Step 4: Open the Application

Open the local URL displayed in your terminal.

The configured demo URL is:

`http://localhost:3000`

**Note:** The actual development port depends on the Vite configuration.

## Step 5: Build for Production

```bash
npm run build
```

To preview the production build:

```bash
npm run preview
```

---

# 12. Demo Accounts

The project includes predefined credentials for hackathon demonstrations.

| Role | Email | Password |
|---|---|---|
| Resident | `resident@demo.com` | `Demo@1234` |
| Administrator | `admin@demo.com` | `Admin@1234` |

### Resident Demo Persona

Name: Kavita Sharma

Assigned Location: Building A, Flat A-203

### Administrator Demo Persona

Name: Major Vikram Rathore

Assigned Location: Facility Office, Clubhouse

One-touch demo login options are available on the login interface.

---

# 13. Hackathon Demonstration Scenario

The following demonstration is designed to explain the application's complete workflow within approximately three minutes.

1. Open the landing page.
2. Show the Demo Mode Active indicator.
3. Sign in using the resident demo account.
4. Open the society map.
5. Select Building A.
6. Explore the five-floor building breakdown.
7. Open the second-floor blueprint.
8. Show existing maintenance issue markers.
9. Select the water leakage complaint.
10. Create a new complaint.
11. Demonstrate the duplicate detection warning.
12. Submit a new complaint.
13. Switch to the administrator account.
14. Open the administration dashboard.
15. Review and approve the new complaint.
16. Assign a high priority and maintenance department.
17. Set the estimated resolution time.
18. Update the complaint status.
19. Switch back to the resident account.
20. Show the updated complaint status, notification, and timeline.

### What Judges Should Understand

The demonstration highlights three important capabilities:

- **Location Awareness:** Complaints are connected to actual society structures.
- **Operational Transparency:** Residents can track complaints from registration to resolution.
- **Administrative Control:** Administrators can manage, prioritize, and assign maintenance requests.

---

# 14. Project Folder Structure

```text
neighbournet-3d/
│
├── firestore.rules
├── storage.rules
│
├── src/
│   │
│   ├── types/
│   │   └── index.ts
│   │
│   ├── services/
│   │   ├── eventEmitter.ts
│   │   ├── demoDataService.ts
│   │   ├── complaintService.ts
│   │   └── authService.ts
│   │
│   ├── context/
│   │   ├── AuthContext.tsx
│   │   └── DataContext.tsx
│   │
│   ├── components/
│   │   ├── common/
│   │   ├── map/
│   │   └── layout/
│   │
│   └── pages/
│
├── package.json
├── package-lock.json
└── README.md
```

---

# 15. Current Limitations & Considerations

NeighbourNet 3D is designed as a hackathon MVP.

The following considerations are important:

- Demo mode stores data in browser LocalStorage.
- LocalStorage data is browser-specific and is not automatically shared between devices.
- Cloud synchronization requires Firebase configuration.
- Duplicate detection is rule-based and may not identify every semantically similar complaint.
- The interactive map represents a configured sample society rather than automatically importing real architectural blueprints.
- Production deployment requires additional testing of authentication, authorization, data validation, and security rules.

These limitations help define the scope of the MVP and provide a clear direction for future development.

---

# 16. Future Enhancements

Potential future improvements include:

1. **Advanced 3D Society Visualization:** More realistic buildings, floor transitions, and spatial navigation.
2. **Multi-Society Support:** Allow multiple residential societies to register and manage their own communities.
3. **Mobile Application:** Provide Android and iOS access.
4. **Enhanced Notifications:** Add push notifications and email alerts.
5. **Maintenance Analytics:** Introduce complaint trends, resolution-time reports, and department performance analysis.
6. **Advanced Complaint Filtering:** Filter complaints by building, floor, category, status, and priority.
7. **Resident Community Features:** Add announcements, polls, and society-wide updates.
8. **Cloud Deployment:** Enable secure multi-user access and centralized data synchronization.
9. **Maintenance Scheduling:** Support planned inspections and preventive maintenance.
10. **Emergency Management:** Add dedicated emergency reporting and escalation workflows.

These are proposed enhancements, not claims about currently implemented functionality.

---

# 17. Why NeighbourNet 3D?

NeighbourNet 3D is more than a traditional complaint registration portal.

It connects the physical structure of a residential society with its digital management system.

Instead of asking residents to explain where a problem exists through long messages, the platform allows them to navigate directly to the relevant building and floor.

By combining location-based reporting, structured workflows, transparent complaint tracking, and centralized administration, NeighbourNet 3D aims to make residential community management more organized and accountable.

### Our Goal

**A smarter, safer, and more connected neighbourhood — without unnecessary complexity or dependence on AI.**

---

# 18. License

Add your chosen open-source license here before publicly distributing the project.

---

**Built with ❤️ for smarter neighbourhoods.**

*NeighbourNet 3D — Your neighbourhood. Your voice. Your safety.*
