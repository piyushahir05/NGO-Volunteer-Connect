# Hybrid Machine Learning Based NGO–Volunteer Matching Platform

Full-stack MERN application connecting **Volunteers** and **NGOs** through event-based volunteering opportunities.

## Tech Stack

- **Frontend:** React 18, Vite, Tailwind CSS, React Router, Context API, Socket.io client
- **Backend:** Node.js, Express.js, Mongoose
- **Database:** MongoDB
- **Auth:** JWT, bcrypt, role-based access (Volunteer / NGO)
- **APIs:** REST; optional real-time notifications via Socket.io

## Project Structure

```
PBL/
├── backend/          # Express API
│   ├── config/        # DB, Socket.io
│   ├── controllers/
│   ├── middleware/    # auth, errorHandler
│   ├── models/
│   └── routes/
├── frontend/          # React app
│   ├── public/
│   └── src/
│       ├── components/
│       ├── context/   # Auth, Notifications
│       ├── lib/       # api, socket, date
│       └── pages/
└── README.md
```

## Setup

### Prerequisites

- Node.js 18+
- MongoDB (local or Atlas)

### Backend

```bash
cd backend
cp .env.example .env   # edit .env with your MONGODB_URI and JWT_SECRET
npm install
npm run dev
```

Runs at **http://localhost:5000**. Health check: `GET /api/health`.

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Runs at **http://localhost:3000**. API and Socket.io are proxied to the backend.

### Environment (backend `.env`)

| Variable     | Description                    |
|-------------|--------------------------------|
| PORT        | Server port (default 5000)     |
| MONGODB_URI | MongoDB connection string     |
| JWT_SECRET  | Secret for JWT signing        |
| NODE_ENV    | development / production      |
| CLIENT_URL  | Frontend origin for CORS/Socket|

## Features

### Authentication

- Register as **Volunteer** or **NGO**
- Login with email/password
- JWT in `Authorization: Bearer <token>`
- Role-based protected routes

### Volunteer

- **Profile:** skills (tags), interests, availability, location
- **Opportunities:** list of NGO events with Apply
- **My Applications:** status (Pending / Accepted / Rejected)
- **Notifications:** when NGO accepts or rejects (in-app + optional Socket.io)

### NGO

- **Organization profile:** name, description
- **Events:** create volunteering opportunities (title, description, required skills, duration, location)
- **Applicants:** view per event, Accept / Reject with notification to volunteer

### Database (MongoDB)

- **users:** name, email, password, role
- **volunteerprofiles:** userId, skills[], interests, availability, location
- **ngoprofiles:** userId, organizationName, description
- **opportunities:** ngoId, title, description, requiredSkills[], duration, location, applicants[{ volunteerId, status }]
- **notifications:** recipientId, message, isRead, createdAt

## API Overview

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | /api/auth/register | - | Register (Volunteer/NGO) |
| POST | /api/auth/login | - | Login |
| GET | /api/auth/me | ✓ | Current user |
| GET/PUT | /api/volunteer/profile | Volunteer | Profile |
| GET | /api/volunteer/applications | Volunteer | My applications |
| GET/PUT | /api/ngo/profile | NGO | NGO profile |
| GET | /api/ngo/opportunities | NGO | NGO’s events |
| GET | /api/opportunities | - | List opportunities |
| GET | /api/opportunities/:id | - | One opportunity |
| POST | /api/opportunities | NGO | Create event |
| PUT | /api/opportunities/:id | NGO | Update event |
| POST | /api/opportunities/:id/apply | Volunteer | Apply |
| GET | /api/opportunities/:id/applicants | NGO | Applicants |
| PUT | /api/opportunities/:oppId/applicants/:applicantId/status | NGO | Accept/Reject |
| GET | /api/notifications | ✓ | My notifications |
| GET | /api/notifications/unread-count | ✓ | Unread count |
| PUT | /api/notifications/:id/read | ✓ | Mark read |
| PUT | /api/notifications/read-all | ✓ | Mark all read |

## Future ML Integration

The data model (skills, required skills, interests, location) is ready for:

- Match score / percentage between volunteer profile and opportunity
- Recommendation of opportunities for volunteers
- Recommendation of volunteers for NGO events

You can add a `matchScore` or similar field and compute it in the API or a separate service.

## License

MIT.
