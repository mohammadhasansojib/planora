# Project Brief

Planora is a Project Management Sass Product.

A multi-tenant project management SaaS where organizations can create teams and projects, break work into tasks, and manage those tasks through sprints/Kanban boards.

## Core hierarchy

```txt
User
  │
  ▼
Organization
  │
  ├── Members
  │
  ├── Teams
  │    └── Team Members
  │
  └── Projects
       │
       ├── Members
       ├── Sprints
       │
       └── Tasks
            ├── Subtasks
            ├── Comments
            ├── Labels
            ├── Attachments
            └── Activity
```

## Project Idea

1. A `User` register and login. Then create `Organization`.
2. Some members belongs to `Organization` with roles like OWNER, ADMIN, MANAGER, MEMBER, and GUEST. Also some teams belongs to `Organization`.
3. 