# HMS Backend

Express.js backend for the Hostel Management System (HMS).

## Overview

This repository provides the server-side API for managing users, students, rooms, notices, payments, complaints, food menus and attendance, and SMS notifications.

## Tech stack

- Node.js
- Express
- MongoDB (Mongoose)

## Requirements

- Node.js >= 14
- npm
- MongoDB (URI)

## Environment variables

Create a `.env` file in the project root with at least the following variables:

- `PORT` — port to run the server (default: 3000)
- `MONGO_URI` — MongoDB connection string
- `JWT_SECRET` — secret for JWT tokens
- `TWILIO_ACCOUNT_SID` — (optional) for SMS integration
- `TWILIO_AUTH_TOKEN` — (optional) for SMS integration
- `TWILIO_FROM` — (optional) sender number for SMS

Adjust names to match the variables used in `server.js` and `utils/sendSMS.js` if necessary.

## Installation

1. Install dependencies

```
npm install
```

2. Add your `.env` file (see Environment variables)

3. Start the server

```
npm start
# or for development with nodemon (if available):
npm run dev
```

## API routes (overview)

The project exposes several route groups (see `routes/`):

- `/api/auth` — authentication (login, register)
- `/api/admin` — admin actions
- `/api/complaints` — add/view complaints
- `/api/food` — food menu management
- `/api/food-attendance` — food attendance
- `/api/notices` — notices management
- `/api/payments` — payment records
- `/api/rooms` — room allocation and queries
- `/api/sms` — send SMS (integration)
- `/api/students` — student CRUD operations

Refer to the individual route files in the `routes/` directory for details.

## Folder structure

- `controllers/` — route handlers
- `models/` — Mongoose models
- `routes/` — Express routers
- `middleware/` — auth and request middleware
- `utils/` — helper utilities such as `sendSMS.js`

## Development notes

- Validate that the `.env` variables match what's expected by `middleware/auth.js` and controllers.
- Seed data can be added by creating scripts or via a REST client once the server is running.

## Contributing

Feel free to open issues or PRs. Keep changes small and include tests where relevant.

## License

MIT (or update as appropriate)
