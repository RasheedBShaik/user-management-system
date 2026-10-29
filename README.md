
# 👥 User Management System

A full-stack user management application built with Next.js, React, Tailwind CSS, Node.js, Express.js, and MongoDB.

🌐 **Live Demo:** [Open User Management System](https://user-management-system-phi-lyart.vercel.app/)

---

## 📌 Overview

The User Management System is a web application designed to provide separate access for administrators and regular users. It demonstrates user authentication and account management through a modern web interface backed by a Node.js API and MongoDB database.

## ✨ Features

- 🔐 Admin and user authentication
- 👤 Separate administrator and user accounts
- 🛡️ Role-based access
- 📋 User management
- 🔄 Account administration
- 🌐 Full-stack web application
- 📱 Responsive user interface

## 🛠️ Tech Stack

### Frontend
- **Next.js** — React-based web framework
- **React.js** — User interface development
- **Tailwind CSS** — Utility-first styling

### Backend
- **Node.js** — JavaScript runtime
- **Express.js** — Backend API framework
- **Mongoose** — MongoDB object modeling

### Database
- **MongoDB** — NoSQL database for application data

### Hosting
- **Vercel** — Frontend deployment and hosting
- **Render** — Backend deployment and hosting

## 🌐 Live Demo

Try the deployed application:

[**Launch User Management System →**](https://user-management-system-phi-lyart.vercel.app/)

## 🔑 Demo Credentials

Use the following accounts to test the application, provided they are configured and active in the deployed environment.

### 👨‍💼 Admin Account

- **Email:** `admin@test.com`
- **Password:** `123456`

### 👤 Regular User Account

- **Email:** `test@gmail.com`
- **Password:** `test`

> **Security notice:** These credentials are publicly visible in this README. Use them only for dedicated demo accounts without sensitive data or privileged production access. Never publish real production credentials.

## ⚙️ Getting Started

### Prerequisites

- Node.js
- npm
- MongoDB database
- Git

### Installation

**1. Clone the repository**

```bash
git clone https://github.com/RasheedBShaik/user-management-system.git
```

**2. Navigate to the project directory**

```bash
cd user-management-system
```

**3. Install frontend dependencies**

```bash
cd frontend
npm install
```

**4. Install backend dependencies**

Open a second terminal from the project root and run:

```bash
cd backend
npm install
```

**5. Configure environment variables**

Configure the required environment variables for the frontend and backend, including the MongoDB connection string and any authentication secrets.

Keep all secrets in environment variables. Do not commit `.env` files containing private credentials to GitHub.

**6. Start the applications**

Run the frontend and backend using the development scripts defined in their respective `package.json` files.

The exact commands and environment variable names depend on your project configuration.

## 📁 Project Structure

```text
user-management-system/
├── frontend/          # Next.js, React, and Tailwind CSS
├── backend/           # Node.js and Express.js API
└── README.md          # Project documentation
```

## 🔐 Security Considerations

- Restrict administrative functionality to authorized users.
- Validate permissions on the backend.
- Store passwords securely using password hashing.
- Validate incoming API requests.
- Keep database credentials and authentication secrets private.
- Use dedicated demo accounts for public demonstrations.

## 💡 Future Improvements

Potential enhancements include:

- User search and filtering
- Profile management
- User creation, editing, and deletion
- Account activation and deactivation
- Enhanced role-based permissions
- Improved form validation and error handling
- Audit logs and activity tracking

## 👨‍💻 Author

**Shaik Rasheed Basha**

- GitHub: [@RasheedBShaik](https://github.com/RasheedBShaik)
