<div align="center">

# 🤝 NGO Volunteer Connect

### Hybrid ML-Based NGO–Volunteer Matching Platform

A full-stack **MERN** application that bridges the gap between **NGOs** and **Volunteers** through event-based volunteering opportunities, real-time notifications, and a data model designed for future ML-powered matching.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/Node.js-18%2B-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white)](https://react.dev/)
[![MongoDB](https://img.shields.io/badge/MongoDB-8-47A248?logo=mongodb&logoColor=white)](https://www.mongodb.com/)

</div>

---

## 📑 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [API Reference](#-api-reference)
- [Database Schema](#-database-schema)
- [Real-Time Notifications](#-real-time-notifications)
- [Future ML Integration](#-future-ml-integration)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🌟 Overview

**NGO Volunteer Connect** enables NGOs to post volunteering events and manage applicants, while volunteers can discover opportunities, apply, and track their application status — all in real time.

The platform features **role-based access control** (Volunteer vs NGO), **JWT authentication**, and **Socket.io-powered live notifications**, with a schema designed to support ML-based volunteer–opportunity matching in the future.

---

## ✨ Features

### 🔐 Authentication & Authorization
- Register as a **Volunteer** or **NGO**
- Secure login with email and password
- JWT-based authentication (`Authorization: Bearer <token>`)
- Role-based route protection

### 🙋 Volunteer
- **Profile Management** — Add skills (tags), interests, availability, and location
- **Browse Opportunities** — Explore volunteering events posted by NGOs
- **Apply** — Submit applications to events
- **Track Applications** — View real-time status (Pending / Accepted / Rejected)
- **Notifications** — Receive instant updates when an NGO accepts or rejects your application

### 🏢 NGO
- **Organization Profile** — Set up your organization name and description
- **Create Events** — Post volunteering opportunities with title, description, required skills, duration, and location
- **Manage Applicants** — View applicants per event and Accept / Reject with one click
- **Dashboard** — Overview of events and applicant statistics

### ⚡ System
- Real-time notifications via **Socket.io**
- Input validation using **express-validator**
- Indexed MongoDB queries for performance
- Vite-powered frontend with proxy to backend

---

## 🛠 Tech Stack

| Layer | Technologies |
|:------|:-------------|
| **Frontend** | React 18, Vite 5, Tailwind CSS 3, React Router 6, Context API, Framer Motion, Lucide Icons, Radix UI |
| **Backend** | Node.js, Express.js 4, Mongoose 8, express-validator 7 |
| **Database** | MongoDB (local or Atlas) |
| **Authentication** | JSON Web Tokens (jsonwebtoken), bcryptjs |
| **Real-Time** | Socket.io 4 (server + client) |
| **Dev Tools** | Nodemon, Vite dev server with API proxy |

---

## 📁 Project Structure

```
NGO-Volunteer-Connect/
│
├── backend/                   # Express REST API
│   ├── config/                # Database connection & Socket.io setup
│   ├── controllers/           # Route handlers / business logic
│   │   ├── authController.js
│   │   ├── volunteerController.js
│   │   ├── ngoController.js
│   │   ├── opportunityController.js
│   │   └── notificationController.js
│   ├── middleware/             # Auth guard & error handler
│   ├── models/                # Mongoose schemas
│   │   ├── User.js
│   │   ├── VolunteerProfile.js
│   │   ├── NGOProfile.js
│   │   ├── Opportunity.js
│   │   └── Notification.js
│   ├── routes/                # API route definitions
│   ├── server.js              # Application entry point
│   ├── .env.example           # Environment variable template
│   └── package.json
│
├── frontend/                  # React SPA
│   ├── public/
│   └── src/
│       ├── components/        # Reusable UI components
│       ├── context/           # AuthContext & NotificationContext
│       ├── lib/               # API client, Socket.io helper, utilities
│       ├── pages/             # Application pages
│       │   ├── Home.jsx
│       │   ├── Login.jsx
│       │   ├── Register.jsx
│       │   ├── VolunteerDashboard.jsx
│       │   ├── VolunteerProfile.jsx
│       │   ├── MyApplications.jsx
│       │   ├── Opportunities.jsx
│       │   ├── NGODashboard.jsx
│       │   ├── NGOProfile.jsx
│       │   ├── NGOEvents.jsx
│       │   └── EventApplicants.jsx
│       └── main.jsx           # React entry point
│
├── README.md
└── LICENSE
```
<!-- ML services -->
cd ml-service
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
# Interactive docs → http://localhost:8000/docs
---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18 or higher
- **MongoDB** — local instance or [MongoDB Atlas](https://www.mongodb.com/atlas) cluster

### 1. Clone the Repository

```bash
git clone https://github.com/piyushahir05/NGO-Volunteer-Connect.git
cd NGO-Volunteer-Connect
```

### 2. Set Up the Backend

```bash
cd backend
cp .env.example .env   # Then edit .env with your values (see table below)
npm install
npm run dev            # Starts the server at http://localhost:5000
```

> **Health check:** `GET http://localhost:5000/api/health`

### 3. Set Up the Frontend

```bash
cd frontend
npm install
npm run dev            # Starts the app at http://localhost:3000
```

The Vite dev server automatically proxies `/api` and `/socket.io` requests to the backend.

### 4. Production Build (Frontend)

```bash
cd frontend
npm run build          # Outputs optimized files to dist/
npm run preview        # Preview the production build locally
```

---

## 🔧 Environment Variables

Create a `.env` file inside the `backend/` directory using `.env.example` as a template:

| Variable | Description | Example |
|:---------|:------------|:--------|
| `PORT` | Server port | `5000` |
| `MONGODB_URI` | MongoDB connection string | `mongodb://localhost:27017/ngo-volunteer-platform` |
| `JWT_SECRET` | Secret key for signing JWTs | `my-super-secret-key` |
| `NODE_ENV` | Environment mode | `development` or `production` |
| `CLIENT_URL` | Frontend origin (for CORS & Socket.io) | `http://localhost:3000` |

---

## 📡 API Reference

### Authentication

| Method | Endpoint | Auth | Description |
|:-------|:---------|:-----|:------------|
| `POST` | `/api/auth/register` | — | Register a new Volunteer or NGO |
| `POST` | `/api/auth/login` | — | Login and receive a JWT |
| `GET` | `/api/auth/me` | ✅ | Get the current authenticated user |

### Volunteer

| Method | Endpoint | Auth | Description |
|:-------|:---------|:-----|:------------|
| `GET` | `/api/volunteer/profile` | Volunteer | Get volunteer profile |
| `PUT` | `/api/volunteer/profile` | Volunteer | Update volunteer profile |
| `GET` | `/api/volunteer/applications` | Volunteer | List my applications |
| `GET` | `/api/volunteer/dashboard-stats` | Volunteer | Dashboard statistics |

### NGO

| Method | Endpoint | Auth | Description |
|:-------|:---------|:-----|:------------|
| `GET` | `/api/ngo/profile` | NGO | Get NGO profile |
| `PUT` | `/api/ngo/profile` | NGO | Update NGO profile |
| `GET` | `/api/ngo/opportunities` | NGO | List NGO's events |
| `GET` | `/api/ngo/dashboard-stats` | NGO | Dashboard statistics |

### Opportunities

| Method | Endpoint | Auth | Description |
|:-------|:---------|:-----|:------------|
| `GET` | `/api/opportunities` | — | List all opportunities |
| `GET` | `/api/opportunities/:id` | — | Get opportunity details |
| `POST` | `/api/opportunities` | NGO | Create a new opportunity |
| `PUT` | `/api/opportunities/:id` | NGO | Update an opportunity |
| `POST` | `/api/opportunities/:id/apply` | Volunteer | Apply to an opportunity |
| `GET` | `/api/opportunities/:id/applicants` | NGO | List applicants for an opportunity |
| `PUT` | `/api/opportunities/:oppId/applicants/:applicantId/status` | NGO | Accept or reject an applicant |

### Notifications

| Method | Endpoint | Auth | Description |
|:-------|:---------|:-----|:------------|
| `GET` | `/api/notifications` | ✅ | Get my notifications |
| `GET` | `/api/notifications/unread-count` | ✅ | Get unread notification count |
| `PUT` | `/api/notifications/:id/read` | ✅ | Mark a notification as read |
| `PUT` | `/api/notifications/read-all` | ✅ | Mark all notifications as read |

---

## 🗄 Database Schema

### Users
| Field | Type | Description |
|:------|:-----|:------------|
| `name` | String | User's full name |
| `email` | String | Unique email address |
| `password` | String | Hashed with bcrypt |
| `role` | String | `Volunteer` or `NGO` |

### Volunteer Profiles
| Field | Type | Description |
|:------|:-----|:------------|
| `userId` | ObjectId | Reference to User |
| `skills` | String[] | List of skill tags |
| `interests` | String | Volunteer's interests |
| `availability` | String | Availability schedule |
| `location` | String | Volunteer's location |

### NGO Profiles
| Field | Type | Description |
|:------|:-----|:------------|
| `userId` | ObjectId | Reference to User |
| `organizationName` | String | Organization name |
| `description` | String | About the organization |

### Opportunities
| Field | Type | Description |
|:------|:-----|:------------|
| `ngoId` | ObjectId | Reference to User (NGO) |
| `title` | String | Event title |
| `description` | String | Event description |
| `requiredSkills` | String[] | Skills needed |
| `duration` | String | Event duration |
| `location` | String | Event location |
| `applicants` | Array | `[{ volunteerId, status }]` — status is Pending/Accepted/Rejected |

### Notifications
| Field | Type | Description |
|:------|:-----|:------------|
| `recipientId` | ObjectId | Reference to User |
| `message` | String | Notification text |
| `isRead` | Boolean | Read/unread status |
| `relatedOpportunityId` | ObjectId | Related opportunity |
| `relatedNgoId` | ObjectId | Related NGO |

---

## 🔔 Real-Time Notifications

The platform uses **Socket.io** for instant notifications:

1. **Connection** — Clients authenticate via JWT token in the handshake
2. **Rooms** — Each user joins a personal room based on their user ID
3. **Events** — Notifications are emitted when:
   - A volunteer applies to an opportunity
   - An NGO accepts or rejects an applicant
4. **Delivery** — Notifications are persisted to MongoDB **and** pushed in real time

---

## 🤖 Future ML Integration

The data model is purposefully structured to support machine-learning-based matching:

| Feature | Description |
|:--------|:------------|
| **Match Scoring** | Compute similarity between volunteer skills/interests and opportunity requirements |
| **Volunteer Recommendations** | Suggest best-fit opportunities to volunteers based on their profile |
| **NGO Recommendations** | Suggest top matching volunteers to NGOs for their events |

Relevant fields for ML: `skills[]`, `interests`, `location`, `requiredSkills[]`, `availability`, `duration`.

> A `matchScore` field can be added to the Opportunity applicants array and computed via the API or a dedicated ML microservice.

---

## 🤝 Contributing

Contributions are welcome! To get started:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to your branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

Please ensure your code follows the existing style and conventions.

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.
