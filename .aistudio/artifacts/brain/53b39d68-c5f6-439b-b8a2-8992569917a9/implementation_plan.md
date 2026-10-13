# Project Management Multi-Stage Uploads & Responsive Stage Workspace

Enhance the Project Management workspace to cleanly display, track, and manage stage deliverables across all project phases with rich upload cards, submission metadata (Drive/Git links, submitters, timestamps, review notes), and seamless desktop/mobile responsive action flows.

## User Review & Critical Decisions

> [!IMPORTANT] All key visual and interactive choices have been confirmed through user clarification.

- **Confirmed Decision 1 (Stage Upload Visualization)**: Dedicated stage cards showing file/link previews, status badges, submitter identity, timestamps, and mentor review feedback notes.
- **Confirmed Decision 2 (Stage Upload Metadata)**: Google Drive links, GitHub repository URLs, submitter details, submission timestamp, approval status, and mentor notes.
- **Confirmed Decision 3 (Responsive Controls)**: Desktop inline action bars for quick upload/review and a slide-up drawer interface on mobile devices for optimal screen real estate.

---

## 1. Overview & Core Concept

- **What It Does**: Upgrades the project detail workspace from a basic phase list to an industry-grade, multi-stage project delivery tracking suite. Teams and mentors can view deliverables for each phase (e.g., CAD/Design, Prototype, Testing, Final Docs), preview uploaded Drive/Git links, inspect review history, and submit or evaluate stage work seamlessly on any device.
- **Target Audience**: Student robotics teams, project leads, assigned mentors, and workspace admins.
- **Key Value**: Eliminates ambiguity around project progress and submission status by displaying all stage assets, feedback notes, and review state in clear, responsive stage cards.

---

## 2. User Experience & Visual Design

### Desktop & Mobile Workspace Layout
- **Phase Roadmap Bar**: Clean horizontal step-indicator showing overall project stages with progress percentages and stage status tags (`Approved`, `Under Review`, `Needs Revision`, `Pending`).
- **Dedicated Stage Deliverable Cards**:
  - **Stage Header**: Stage title, required deliverable guidelines, deadline, and current status.
  - **Uploaded Deliverable Assets**: Direct Drive & Git preview cards with favicon/type icons, full truncated URL text, submitter user avatar + name, and precise formatted timestamps (`font-mono tabular-nums`).
  - **Mentor Evaluation Block**: Highlighted feedback box displaying mentor/admin review notes, score/rating (if applicable), and decision status.
- **Responsive Stage Action Controls**:
  - **Desktop (>= 1024px)**: Integrated inline action bar on each stage card containing `"Submit Work"` and `"Review Deliverable"` buttons.
  - **Mobile (< 1024px)**: Sticky bottom action bar that triggers a smooth slide-up mobile drawer with tabbed forms for uploading Drive/Git links and submitting mentor reviews.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ PROJECT MANAGEMENT WORKSPACE (1440px Desktop / Mobile Responsive)          │
├─────────────────────────────────────────────────────────────────────────────┤
│ ┌─────────────────────────────────────────────────────────────────────────┐ │
│ │ Phase 1: CAD & Design [75% Complete]  │  Phase 2: Prototype [In Progress]│ │
│ └─────────────────────────────────────────────────────────────────────────┘ │
│                                                                             │
│ ┌─────────────────────────────────────────────────────────────────────────┐ │
│ │ STAGE DELIVERABLE CARD: Phase 1 - CAD Schematics                        │ │
│ │ Status: [ Approved ] · Submitted Oct 12, 2026 by Alex Rivera            │ │
│ │                                                                         │ │
│ │ 📁 Google Drive: drive.google.com/folder/cad-v2-final                    │ │
│ │ 🔗 GitHub Repo: github.com/team-robotics/chassis-cad                     │ │
│ │                                                                         │ │
│ │ 💬 Mentor Review Notes (Dr. Sarah Chen):                                │ │
│ │ "Chassis load analysis is solid. Clear clearance for motor mounts."     │ │
│ │                                                                         │ │
│ │ [ Edit Submission ]  [ View Details ]                (Desktop Inline Bar)│ │
│ └─────────────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Key Product Decisions & Trade-Offs

- **Decision 1: Stage Cards with Embedded Feedback vs Modal Only**
  - *Chosen Approach*: Embed submission links, submitter info, and mentor feedback directly inside the stage card on the main page, using modals/drawers strictly for action inputs.
  - *Why*: Gives instant visual feedback without forcing users to open dialogs just to check links or read mentor notes.
- **Decision 2: Adaptive Mobile Drawer vs Standard Modals**
  - *Chosen Approach*: Slide-up drawer on mobile devices with touch-friendly input fields and sticky action buttons.
  - *Why*: Standard modals can overflow small mobile screens when entering URLs and long review notes; drawers maximize screen space.

---

## 4. Technical Architecture & Data Strategy

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ ProjectManagementPage.tsx (State Controller)                                │
├─────────────────────────────────────────────────────────────────────────────┤
│  │                                                                          │
│  ├── Selected Project & Active Phase State                                  │
│  ├── Submission Payload ({ driveUrl, gitUrl, notes, phaseId })             │
│  ├── Review Payload ({ status, feedback, score, phaseId })                  │
│  │                                                                          │
│  ▼                                                                          │
│ StageDeliverableCard.tsx                                                    │
│  ├── Submitter User Avatar + Identity                                       │
│  ├── Drive & Git Asset Cards with Open Link Actions                         │
│  ├── Mentor Notes & Approval Status Banner                                  │
│  └── Desktop Inline Action Bar                                              │
│                                                                             │
│  ▼ (Mobile Viewport < 1024px)                                               │
│ MobileStageActionDrawer.tsx                                                 │
│  ├── Slide-up Touch Sheet                                                   │
│  ├── Submit Work Tab (Drive / Git / Notes Inputs)                           │
│  └── Mentor Review Tab (Status Select / Feedback Textarea)                  │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Component & State Changes
1. **`src/components/projects/ProjectManagementPage.tsx`**:
   - Enhance the main workspace rendering to incorporate structured stage cards for all phases.
   - Integrate `MobileStageActionDrawer` for mobile interaction and inline action bars for desktop.
   - Refine error handling and status badge displays using clean typography (no pill clutter).
2. **`src/components/projects/StageDeliverableCard.tsx`** *(New component)*:
   - Formats uploaded Drive and Git URLs into readable deliverable tiles with click-to-open capability.
   - Renders submitter metadata (name, timestamp, role).
   - Renders mentor review status and feedback notes in an unboxed, clean card layout.
3. **`src/components/projects/MobileStageActionDrawer.tsx`** *(New component)*:
   - Responsive bottom sheet container for mobile devices.
   - Provides form inputs for submitting links or conducting mentor reviews without mobile keyboard overlap.

---

## Verification Plan

- **Compilation Check**: Run `compile_applet` to verify zero TypeScript or Vite syntax errors.
- **Responsive Layout Verification**: Verify stage cards rendered on desktop full-width layout and mobile drawer triggers properly.
- **Data Integrity**: Confirm Drive URLs, GitHub URLs, timestamps, submitter identity, and mentor feedback persist and display correctly.
