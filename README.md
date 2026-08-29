# 🏢 Society Management API

A modular backend API for managing residential society operations using Node.js, Express.js, and MongoDB. The project includes admin and resident authentication, JWT-based access control, OTP-driven password recovery, and resident management workflows.

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)
![Mongoose](https://img.shields.io/badge/Mongoose-880000?style=for-the-badge&logo=mongoose&logoColor=white)

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Authentication & Security](#authentication--security)
- [API Endpoints](#api-endpoints)
- [Admin Flow](#admin-flow)
- [Resident Flow](#resident-flow)
- [Response Format](#response-format)
- [Database Models](#database-models)
- [Middleware](#middleware)
- [Database Configuration](#database-configuration)
- [Production Security Recommendations](#production-security-recommendations)
- [Current Best Practices](#current-best-practices)
- [Future Enhancements](#future-enhancements)
- [Quick Start](#quick-start)
- [License](#license)
- [Conclusion](#conclusion)

---

## Overview

This backend provides the foundation for a society management application where an admin can manage residents, authenticate securely, and handle password reset workflows. It is organized into focused modules for routes, controllers, services, models, middleware, and utilities to keep the system maintainable and extensible.

The project currently supports:

- Admin registration and login
- Resident creation and resident login
- OTP-based password reset flow
- JWT protected routes
- Resident CRUD operations by admin
- Resident activation/deactivation and soft delete behavior
- MongoDB storage through Mongoose
- Automated email notification for admin registration

---

## Features

### Authentication

- Admin registration and login flow
- Resident login flow
- JWT-based authorization using bearer tokens
- Password hashing with bcrypt
- Login attempt tracking with timeout behavior
- OTP verification for password reset
- OTP attempt tracking and expiration rules

### Admin Management

- Admin registration
- Admin login
- Admin password reset and verification
- Resident creation by admin
- View all residents
- Fetch a single resident
- Update resident information
- Activate or deactivate resident status
- Soft-delete resident records

### Resident Management

- Resident record creation by admin
- Resident login
- Resident password recovery through OTP
- Resident password update after verification
- Resident status tracking with `isActive` and `isDelete`

### Security

- JWT verification middleware
- Role-aware access checks
- bcrypt hashed passwords
- OTP expiration logic
- Protected routes for authenticated admin access

### Communication

- HTML email sending for admin registration using nodemailer
- Welcome credential email includes portal URL, name, and temporary password

---

## Tech Stack

| Technology | Purpose |
| --- | --- |
| Node.js | JavaScript runtime for the backend server |
| Express.js | Web framework for building the API |
| MongoDB | NoSQL database for storing admin and resident data |
| Mongoose | MongoDB object modeling and schema management |
| JWT | Secure token-based authentication |
| bcrypt | Password hashing and verification |
| nodemailer | Email delivery for admin registration notifications |
| dotenv | Environment variable management |
| moment | Timestamp formatting |
| crypto | OTP generation |

---

## Project Structure

```text
society-management-api/
├── .env
├── .gitignore
├── package.json
├── package-lock.json
├── src/
│   ├── config/
│   │   └── db.config.js
│   ├── controller/
│   │   ├── admin.controller.js
│   │   └── resident.controller.js
│   ├── middleware/
│   │   ├── auth.middleware.js
│   │   └── nodemailer.middleware.js
│   ├── model/
│   │   ├── admin.model.js
│   │   └── resident.model.js
│   ├── routes/
│   │   ├── index.route.js
│   │   └── auth/
│   │       ├── auth.route.js
│   │       ├── admin/
│   │       │   └── admin.route.js
│   │       └── resident/
│   │           └── resident.route.js
│   ├── services/
│   │   ├── admin.service.js
│   │   └── resident.service.js
│   ├── utils/
│   │   ├── msg.js
│   │   ├── residentMsg.js
│   │   └── response.js
│   └── server.js
├── README.md
└── .env.example (if created separately in your environment)
```

### Key folders

- `src/server.js` — starts the Express server and mounts the main API routes
- `src/config/db.config.js` — initializes the MongoDB connection
- `src/controller/` — request handling and API logic
- `src/services/` — business logic and database operations
- `src/model/` — Mongoose schemas for admin and resident records
- `src/routes/` — route definitions for admin and resident APIs
- `src/middleware/` — authentication and mail handling
- `src/utils/` — response helpers and message constants

---

## Getting Started

### Prerequisites

Before running the project, make sure you have:

- Node.js installed (recommended version 18 or above)
- npm or yarn
- A MongoDB instance (local or MongoDB Atlas)
- A valid Gmail account for sending email notifications

### Installation

1. Clone the repository or open the backend project folder.
2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in the project root if it is not already present.

### Environment Variables

The application expects the following environment variables:

```env
PORT=8080
MONGODBURI=mongodb://localhost:27017/society-management
JWT_SECRET_KEY=your_secret_key_here
EMAIL_USER=your_email@gmail.com
EMAIL_USER_PASS=your_email_app_password
```

> Do not commit `.env` files to a public repository. Replace all sensitive values with placeholders or local-only values.

### Run the Application

#### Development mode

```bash
npm run dev
```

#### Production mode

```bash
npm start
```

The server listens on the port defined in the `.env` file. By default, it is expected to run on:

```text
http://localhost:8080
```

---

## Authentication & Security

### JWT Authentication

Protected routes require a valid JWT token in the `Authorization` header:

```http
Authorization: Bearer <token>
```

The auth middleware validates the token, identifies the role (`admin` or `resident`), and attaches the authenticated user to the request object before the route continues.

### Password Security

- Passwords are hashed using `bcrypt` before storage.
- Login attempts are tracked to limit repeated failed attempts.
- OTP generation is used for password recovery.
- OTP verification and expiration are enforced.

### Role-Based Access

The app uses role-aware authentication logic:

- `admin` role for administrative operations
- `resident` role for resident-specific access

### Soft Delete Pattern

Resident records are not physically removed. The system uses flags such as:

- `isActive`
- `isDelete`

This helps maintain data integrity and historical records.

---

## API Endpoints

The API is mounted under the base route prefix `/api`.

### Admin APIs

| Method | Endpoint | Access | Description |
| --- | --- | --- | --- |
| `POST` | `/api/auth/admin/register` | Public | Register a new admin |
| `POST` | `/api/auth/admin/login` | Public | Admin login |
| `POST` | `/api/auth/admin/forgot_password` | Public | Request OTP for admin password recovery |
| `POST` | `/api/auth/admin/verify_OTP` | Public | Verify admin OTP |
| `POST` | `/api/auth/admin/change_password` | Public | Change admin password after verification |
| `POST` | `/api/admin/create-resident` | Admin | Create a resident record |
| `GET` | `/api/admin/` | Admin | Fetch all residents |
| `GET` | `/api/admin/:id` | Admin | Fetch a single resident |
| `PATCH` | `/api/admin/:id` | Admin | Update resident details |
| `PUT` | `/api/admin/:id` | Admin | Activate or deactivate a resident |
| `DELETE` | `/api/admin/:id` | Admin | Delete a resident record (soft delete flow) |

> The same admin routes are also mounted directly under `/api/admin` in this project structure.

### Resident APIs

| Method | Endpoint | Access | Description |
| --- | --- | --- | --- |
| `POST` | `/api/auth/resident/login` | Public | Resident login |
| `POST` | `/api/auth/resident/forgot-password` | Public | Request OTP for resident password recovery |
| `POST` | `/api/auth/resident/verify-otp` | Public | Verify resident OTP |
| `POST` | `/api/auth/resident/change-password` | Public | Change resident password after verification |

---

## Admin Flow

### 1. Register admin

Request body:

```json
{
  "first_name": "Raj",
  "last_name": "Sharma",
  "email": "raj@example.com",
  "password": "Admin@123",
  "number": "9876543210"
}
```

Example response:

```json
{
  "status": 201,
  "error": false,
  "message": "Admin registered successfully.",
  "result": {
    "_id": "...",
    "first_name": "Raj",
    "last_name": "Sharma",
    "email": "raj@example.com"
  }
}
```

After registration, the backend sends an email containing login credentials and a temporary password.

### 2. Login admin

```json
{
  "email": "raj@example.com",
  "password": "Admin@123"
}
```

If valid, the API returns a JWT token for subsequent admin requests.

### 3. Forgot password / OTP

```json
{
  "email": "raj@example.com"
}
```

The API generates an OTP and stores a hashed version in the database.

### 4. Verify OTP

```json
{
  "email": "raj@example.com",
  "OTP": 123456
}
```

### 5. Change password

```json
{
  "email": "raj@example.com",
  "password": "NewPassword@123",
  "conf_password": "NewPassword@123"
}
```

---

## Resident Flow

### 1. Admin creates resident

```json
{
  "first_name": "Amit",
  "last_name": "Patel",
  "email": "amit@example.com",
  "number": "9876501234",
  "house_no": "A-101",
  "password": "Resident@123"
}
```

### 2. Resident login

```json
{
  "email": "amit@example.com",
  "password": "Resident@123"
}
```

### 3. Resident password recovery

The resident can recover access using the OTP workflow:

- `POST /api/auth/resident/forgot-password`
- `POST /api/auth/resident/verify-otp`
- `POST /api/auth/resident/change-password`

### 4. Admin resident management operations

The admin can also perform resident management operations such as:

- fetching resident records
- updating resident details
- activating or deactivating resident status
- deleting resident records using the soft delete flow

---

## Response Format

The application uses a consistent JSON response structure for both success and error results.

### Success response

```json
{
  "status": 200,
  "error": false,
  "message": "Success message",
  "result": {}
}
```

### Error response

```json
{
  "status": 400,
  "error": true,
  "message": "Invalid email or password."
}
```

### Response fields

| Field | Description |
| --- | --- |
| `status` | HTTP status code |
| `error` | Boolean flag indicating whether the request failed |
| `message` | Human-readable result or error message |
| `result` | Returned payload for successful requests |

---

## Database Models

### Admin Model

The admin schema includes the following fields:

- `first_name`
- `last_name`
- `email`
- `password`
- `number`
- `profile_image`
- `profile_image_url`
- `login_attempt`
- `login_attempt_expire_time`
- `OTP`
- `OTP_expire_time`
- `OTP_attempt`
- `OTP_attempt_expire_time`
- `verify_OTP_attempt`
- `verify_OTP_attempt_expire_time`
- `isVerified`
- `isActive`
- `isDelete`
- `created_at`
- `updated_at`
- `last_login`

### Resident Model

The resident schema includes the following fields:

- `first_name`
- `last_name`
- `email`
- `number`
- `password`
- `house_no`
- `profile_image`
- `profile_image_url`
- `OTP`
- `OTP_expire_time`
- `OTP_attempt`
- `OTP_attempt_expire_time`
- `verify_OTP_attempt`
- `verify_OTP_attempt_expire_time`
- `isVerified`
- `isActive`
- `isDelete`
- `created_at`
- `updated_at`
- `last_login`

---

## Middleware

### Auth Middleware

The authentication middleware reads the bearer token from the `Authorization` header, validates it using the JWT secret, and attaches the authenticated user to the request object. It supports both `admin` and `resident` roles and ensures the user still exists and remains active.

### Nodemailer Middleware

The nodemailer middleware sends an HTML welcome email whenever a new admin is registered. The email contains:

- society portal link
- admin name
- temporary password
- instructions to change the password immediately

---

## Database Configuration

The database connection is initialized in `src/config/db.config.js`:

```js
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODBURI).then(() => {
    console.log("Database is connected...");
}).catch(err => {
    console.log("Database is not connected...", err);
});
```

This means the app expects a valid MongoDB URI in the environment variables, provided via `MONGODBURI`.

---

## Production Security Recommendations

### Already implemented

- Password hashing using bcrypt
- JWT-based authentication
- Role-aware request handling
- OTP-based password recovery
- Login and OTP attempt counting
- Soft delete behavior with `isDelete`
- Modular API design and separation of concerns

### Recommended for production

These are not currently guaranteed by the project implementation and should be considered for a production-grade deployment:

- Rate limiting
- Input validation using Joi or express-validator
- CORS configuration
- Request logging and monitoring
- Helmet for HTTP security headers
- Environment-based configuration separation
- More granular authorization rules for additional roles
- Refresh token support
- Error monitoring and audit logging

---

## Current Best Practices

This project already demonstrates several useful engineering patterns:

- Clear separation between controllers, services, and models
- Reusable response helpers for consistent API output
- Password hashing before persistence
- JWT-based route protection
- OTP-based user recovery flow
- Modular route organization
- Structured database access through Mongoose models

---

## Future Enhancements

This backend can be extended with additional society management features such as:

- Apartment or flat management
- Notices and announcements
- Maintenance billing
- Complaints and support tickets
- Visitor tracking
- Event management
- Role-based access for security and staff members
- File upload support for profile images and documents
- Real-time notifications

---

## Quick Start

```bash
npm install
npm run dev
```

Then use the API endpoints described above with Postman, curl, or a frontend application.

---

## License

MIT License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

## Conclusion

The Society Management API is a focused backend solution for residential community administration. It combines admin and resident authentication, OTP-based recovery, JWT authorization, and resident management workflows in a modular architecture that is easy to understand and extend.

This project is a strong foundation for a society management platform and is well-suited for continued growth alongside a frontend application or additional API modules.
