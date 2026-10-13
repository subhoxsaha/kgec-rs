# Project Management Workspace Refinement & Full Lifecycle Integration

A production-ready, deployment-safe Project Management page for the KGEC Robotics Society web portal. This update refines full lifecycle project execution—including project creation, phase transitions, task tracking, team/mentor assignments, and role-based action controls—while maintaining clean access controls so guest visitors only see member features when authenticated.

> [!IMPORTANT] Confirmed Decisions
> - **Confirmed Scope**: Full lifecycle management covering project creation, phase progression, task tracking, and team/mentor assignments.
> - **Confirmed Access Control**: Admins maintain full project authority (creation, deletion, team assignment, phase override), while assigned members and mentors get task & phase update capabilities. Guest/unverified visitors are kept seamlessly in guest mode with public project showcases only.
> - **Zero Mock Data Policy**: All state is driven by live API and backend DB routes (`/api/pm/projects`, `/api/pm/tasks`, `/api/pm/team`), with clean error handling and zero fake/stub data.

---

## 1. Overview & Core Concept

- **What It Does**: Provides a dedicated, full-screen Project Management page (`/projects/manage` or dedicated workspace route) where verified society members and admins manage sequential engineering workflows (R&D, Prototyping, Documentation, Testing).
- **Target Audience / Persona**: KGEC Robotics Society admins, team leads, mentors, and accepted student engineers.
- **Key Value**: Streamlines sequential engineering workflows with real-time status updates, task assignment, phase sign-offs, and team composition tracking—strictly protected behind member authentication.

---

## 2. User Experience & Visual Design

- **Key User Flows**:
  1. **Workspace Navigation**: Verified users click "Project Management" in the navigation drawer or top bar to navigate directly to the dedicated workspace page. Unauthenticated visitors see public project showcases and registration triggers.
  2. **Project Lifecycle Execution**:
     - Admins click "Create Project" (title mandatory; mentors and team members optional at creation time).
     - Admins, assigned mentors, and team members view project cards with sequential engineering phase indicators (R&D -> Prototyping -> Testing -> Documentation -> Complete).
     - Users interact with phase progress controls, task creation, status toggles, and team assignment dialogs.
  3. **Task & Team Management**:
     - Expand project details to view active task boards (To Do, In Progress, Completed).
     - Add tasks, assign team members, update progress, and attach repository/documentation links.
- **Visual Identity & Theme**:
  - *Aesthetic Direction*: Dark slate industrial precision theme matching the KGEC Robotics brand (`#0F172A` neutral canvas with `#1E293B` structural surfaces and cobalt blue / emerald accent tokens).
  - *Typography*: Clean display sans headings (`Plus Jakarta Sans`) paired with readable body text (`DM Sans`), with tabular numeric formatting (`font-mono tabular-nums`) for timestamps, task counts, and phase progress percentages.
  - *Component Styling*: Flat single-elevation cards with subtle 1px hairline borders (`border-slate-800`), unboxed typographic metadata separators (`·`), and responsive action toolbars.
- **Interactive Feedback & State Handling**:
  - Instant optimistic updates on task check-offs and phase changes with subtle status toasts.
  - Skeletons for initial API loads and inline error alerts with retry triggers if a network request fails.

---

## 3. Key Product Decisions & Trade-Offs

- **Decision 1: Full Page Workspace over Popup Modals**
  - *Chosen Approach*: Render Project Management as its own dedicated route/page with clean full-screen layout.
  - *Why*: Eliminates modal overflow, provides space for detailed task lists and team rosters, and improves deep-linking/bookmarking for members.
  - *Alternatives Considered*: Nested modals inside cards (rejected due to cramped UI and poor mobile ergonomics).

- **Decision 2: Flexible Team & Mentor Selection on Project Creation**
  - *Chosen Approach*: Project Title is the only strictly required field during project creation; mentor/member lists default to empty arrays `[]` and can be assigned later anytime.
  - *Why*: Allows admins to quick-bootstrap new project ideas before team rosters are finalized.

- **Decision 3: Server & Vercel API Route Normalization**
  - *Chosen Approach*: Maintain URL normalization middleware in `api/index.ts` and `server.ts` to ensure `/api/pm/projects` and related POST/GET endpoints resolve seamlessly across local dev and Vercel serverless environments.
  - *Why*: Prevents 404/308 redirects caused by serverless route prefix stripping.

---

## 4. Technical Architecture & Data Strategy

```
┌─────────────────────────────────────────────────────────────────────────┐
│                          KGEC Robotics Web App                          │
└────────────────────────────────────┬────────────────────────────────────┘
                                     │
           ┌─────────────────────────┴─────────────────────────┐
           ▼                                                   ▼
┌─────────────────────────┐                         ┌─────────────────────┐
│  Navbar & Drawer Nav    │                         │  Auth Context       │
│  (Member-Only Button)   │                         │  (Role & Token)     │
└──────────┬──────────────┘                         └──────────┬──────────┘
           │                                                   │
           ▼                                                   │
┌──────────────────────────────────────────────────────────────▼──────────┐
│                     ProjectManagementPage Component                     │
│ ┌─────────────────────────────────────────────────────────────────────┐ │
│ │ Header & Filter Bar (All / My Projects / Phase Filter / Search)    │ │
│ ├─────────────────────────────────────────────────────────────────────┤ │
│ │ Project Grid (Cards with Phase Steppers, Task Counters, Team Badges)│ │
│ ├─────────────────────────────────────────────────────────────────────┤ │
│ │ Drawer / Modal Dialogs (Create Project, Manage Team, Task Board)    │ │
│ └─────────────────────────────────────────────────────────────────────┘ │
└────────────────────────────────────┬────────────────────────────────────┘
                                     │ API Requests (Bearer Token)
                                     ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                   Express API Router / Vercel Serverless                │
│  GET /api/pm/projects  │  POST /api/pm/projects  │  PUT /api/pm/projects  │
│  POST /api/pm/tasks    │  PUT /api/pm/tasks      │  GET /api/pm/members   │
└────────────────────────────────────┬────────────────────────────────────┘
                                     │
                                     ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                      Persistent Database Store                          │
│               (Projects, Phases, Tasks, Member Roles)                   │
└─────────────────────────────────────────────────────────────────────────┘
```

- **Data Models & State Mapping**:
  - `RoboticsProject`: `id`, `title`, `description`, `domain`, `phase` (R&D | Prototyping | Testing | Documentation | Complete), `mentorIds`, `memberIds`, `repoUrl`, `docUrl`, `createdAt`, `updatedAt`.
  - `ProjectTask`: `id`, `projectId`, `title`, `status` (todo | in_progress | completed), `assigneeId`, `priority`, `dueDate`.
  - `MemberProfile`: `id`, `name`, `email`, `role` (admin | mentor | member), `avatarUrl`.
- **Interactive Component & State Mapping**:
  - `ProjectManagementPage`: Controls project fetch, search, filter state, and active project selection.
  - `CreateProjectModal`: Simple form validating title input and sending `POST /api/pm/projects`.
  - `TaskBoardModal`: Live list of tasks with checkbox state mutation sending `PUT /api/pm/tasks/:id`.
  - `TeamAssignmentModal`: Multi-select checkbox dropdown for assigned members/mentors sending `PUT /api/pm/projects/:id`.
