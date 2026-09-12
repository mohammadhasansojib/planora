# Planora

A project management SaaS platform for organizing teams, projects, sprints, tasks, subtasks, comments, attachments, and payments.

## Features

* User authentication

  * Register
  * Login
  * Refresh token
* Organization management

  * Create organizations
  * View user's organizations
  * Add organization members
  * Organization roles
* Team management

  * Create teams
  * Add team members
  * Team roles
* Project management

  * Create projects
  * Add project members
  * Project roles
* Sprint management

  * Create sprints
  * Assign tasks to sprints
* Task management

  * Create tasks
  * Task descriptions
  * Assign tasks to sprints
* Subtasks
* Comments
* Task attachments

  * Image upload with Cloudinary
* bKash payment integration

  * Create payment
  * Execute payment
  * Store successful payment information

## Tech Stack

### Backend

* Node.js
* Express.js
* TypeScript
* PostgreSQL
* Prisma ORM
* Zod
* JWT
* bcrypt
* Cloudinary
* bKash Payment Gateway

### Tools

* Git & GitHub
* Postman

## Project Structure

```text
planora-backend/
├── src/
│   ├── app/
│   ├── config/
│   ├── middlewares/
│   ├── modules/
│   └── utils/
├── prisma/
│   ├── schema/
│   └── migrations/
├── .env.example
├── package.json
└── README.md
```

## Database Structure

```text
User
 └── Organization
      ├── Organization Members
      └── Teams
           └── Projects
                ├── Sprints
                │    └── Tasks
                │         ├── Subtasks
                │         ├── Comments
                │         ├── Attachments
                │         └── Activities
```

## Getting Started

### Prerequisites

* Node.js
* PostgreSQL
* npm

### Installation

```bash
git clone <repository-url>

cd planora-backend

npm install
```

### Environment Variables

Create a `.env` file based on `.env.example`.

```env
PORT=
DATABASE_URL=

BCRYPT_SALT_ROUNDS=
ACCESS_TOKEN_SECRET=
ACCESS_TOKEN_EXPIRE=
REFRESH_TOKEN_SECRET=
REFRESH_TOKEN_EXPIRE=

BKASH_BASE_URL=
BKASH_USERNAME=
BKASH_PASSWORD=
BKASH_APP_KEY=
BKASH_APP_SECRET=
BKASH_CALLBACK_URL=

CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

### Database Setup

```bash
npx prisma migrate dev
npx prisma generate
```

### Run Development Server

```bash
npm run dev
```

## API Documentation

- Postman API documentation: https://documenter.getpostman.com/view/48233467/2sBYAyt8nt
- API Docs: [API.md](./docs/API.md)

## Demo Credentials

```text
Email: hasan@mail.com
Password: 12345678
Role: Organization Owner
```

The demo account is a regular user who owns a demo organization and can access the main platform features.


## Deployment

### Backend

Live API URL: 

### Repository

Repository URL: https://github.com/mohammadhasansojib/planora

## Future Improvements

* Activity tracking
* Advanced role-based permissions
* Real-time notifications
* File deletion
* Payment history and refunds
* Advanced dashboard and analytics
* Production-ready payment security and webhook handling