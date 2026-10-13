# Project Management Workspace Bug Removal & Stability Implementation Plan

Enhance the Project Management module by eliminating existing runtime bugs, ensuring robust project creation stability without strict mentor/member prerequisites, introducing inline error banners for clear diagnostic feedback, and hardening API error handling across all full-lifecycle operations.

---

## User Review & Critical Decisions

> [!IMPORTANT]
> The following decisions were confirmed during Phase 1 clarification:
> - **Primary Focus**: Project creation stability and API error handling.
> - **Flexible Setup**: Admin can create projects without selecting mentors or members upfront. Team assignments can be adjusted anytime afterwards.
> - **Error Presentation**: Inline banner alerts displayed directly above the workspace (with retry capabilities) rather than transient toasts or modals.
> - **Scope Discipline**: Zero UI redesign. Retain existing workspace visual theme, tabs, modals, dark/light posture, and workflow structure.

---

## 1. Overview & Core Concept

- **What It Does**: Hardens the KGEC Robotics Project Management module to guarantee seamless project creation, phase progression tracking, deliverable submissions, and team management without unexpected 404/401 API failures or blocking modal validation.
- **Target Audience / Persona**: Society Admins (full project control & creation), Mentors (project guidance, phase updates, work reviews), and Members (assigned task execution, deliverable submissions).
- **Key Value**: Provides a smooth, error-resilient workspace experience with real-time inline status banners so members and admins can track and manage robotics projects with complete clarity.

---

## 2. User Experience & Visual Design

- **Inline Banner Alert Area**:
  - Positioned directly below the Project Management workspace header and above the main content tabs/cards.
  - *Types*:
    - **Error Banner**: Soft red background (`bg-red-500/10 border-red-500/20 text-red-400`), warning icon, descriptive message, and an inline "Retry" button.
    - **Warning / Auth Banner**: Amber background (`bg-amber-500/10 border-amber-500/20 text-amber-400`), lock/shield icon, explaining missing role permissions or session expiration with a direct action button.
    - **Success Banner**: Emerald background (`bg-emerald-500/10 border-emerald-500/20 text-emerald-400`), check icon, auto-dismissible after 5 seconds.

- **Flexible Project Creation Modal**:
  - Modal title remains "Create New Robotics Project".
  - Mentor and Member multi-select dropdowns become optional fields with helpful micro-copy ("Optional: You can assign mentors and members now or later from project settings").
  - Submit button enables as long as "Project Title" is non-empty.

- **Workspace Continuity & Theme**:
  - Preserves exact existing dark (`#0B0F19`) / light UI styling, status pill badges (Active, Completed, In Progress, Locked), phase progression bars, and tab panels.

---

## 3. Key Product Decisions & Trade-Offs

- **Decision 1: Flexible Team Assignments at Creation**
  - *Chosen Approach*: Allow Admins to create a project with only a Title and optional Description. Mentors and Members can be assigned later.
  - *Why*: Admins frequently initiate new R&D or competition project shells before final team allocation. Requiring upfront assignments blocked workflow execution.
  - *Alternatives Considered*: Requiring at least one mentor. Passed over because it causes creation failures when member lists are loading or empty.

- **Decision 2: Inline Error Banners vs. Toast Notifications**
  - *Chosen Approach*: Persistent inline banners above the workspace with explicit error messages and retry actions.
  - *Why*: Inline banners keep context visible while the user troubleshoots or retries an action, unlike transient toasts that disappear quickly.

- **Decision 3: Server & Client Header Synchronization**
  - *Chosen Approach*: Explicitly pass `x-user-id`, `x-user-role`, and `x-user-name` headers on all client-side `fetch` calls to `/api/pm/*`, backed by defensive fallbacks in `server.ts`.
  - *Why*: Fixes intermittent 401/404 errors caused by missing actor context during serverless or proxy rewrites.

---

## 4. Technical Architecture & Data Strategy

```
┌────────────────────────────────────────────────────────────────────────┐
│                        ProjectManagementPage                           │
│                                                                        │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │                    Inline Banner Alert System                    │  │
│  │  [Icon] Error / Status Message            [Retry]  [Dismiss X]   │  │
│  └──────────────────────────────────────────────────────────────────┘  │
│                                                                        │
│  ┌────────────────────────┐         ┌───────────────────────────────┐  │
│  │  Project List / Search │         │  Project Detail & Phase Tabs  │  │
│  │  - Active Filter       │         │  - Phase Tracker (R&D, Proto) │  │
│  │  - Admin Create Modal  │         │  - Deliverables & Submissions │  │
│  └───────────┬────────────┘         └───────────────┬───────────────┘  │
└──────────────┼──────────────────────────────────────┼──────────────────┘
               │                                      │
               │ HTTP GET / POST / PUT / DELETE        │
               │ Headers: x-user-id, x-user-role       │
               ▼                                      ▼
┌────────────────────────────────────────────────────────────────────────┐
│                          Express App (server.ts)                       │
│  - /api/pm/projects             (GET all, POST create)               │
│  - /api/pm/projects/:id         (GET single, PUT details, DELETE)    │
│  - /api/pm/projects/:id/team    (PUT team assignments)               │
│  - /api/pm/projects/:id/phases  (PUT phase requirements)            │
│  - /api/pm/projects/:id/submit  (POST submission)                    │
│  - /api/pm/projects/:id/review  (POST review)                        │
└──────────────────────────────────┬─────────────────────────────────────┘
                                   │
                                   ▼
┌────────────────────────────────────────────────────────────────────────┐
│                      Project Management Store                          │
│                      (src/server/projectsDb.ts)                        │
│  - inMemoryProjects / projects_pm.json                                 │
│  - inMemoryPhases   / phases_pm.json                                   │
│  - inMemoryActivities / activities_pm.json                            │
└────────────────────────────────────────────────────────────────────────┘
```

### Data Model & State Updates
- **Client State**:
  - `bannerAlert`: `{ type: 'error' | 'warning' | 'success'; message: string; action?: { label: string; onClick: () => void } } | null`
  - `isCreatingProject`: boolean loader state during POST.
  - `projects`: `RoboticsProject[]` state with optimistic UI updates and server fallback reconciliation.
- **Server Store (`projectsDb.ts`)**:
  - `createProject`: Accepts `title` (required), `description` (optional), `mentorIds` (defaults to `[]`), `memberIds` (defaults to `[]`). Automatically initializes standard 3 phases (R&D, Prototyping, Documentation).
