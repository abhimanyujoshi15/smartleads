# SmartLeads - Full-Stack Lead Management System

SmartLeads is a high-performance MERN stack application built with TypeScript, Tailwind CSS v4, and Mongoose. It provides secure, token-based authentication with role-based dashboard access, dynamic filtering, real-time debounced searching, and tabular data exports.

## 🚀 Live Deployments

- **Application Link:** [https://smartleads-nc0p.onrender.com]

---

## 🛠️ Tech Stack

- **Frontend:** React 18, TypeScript, Tailwind CSS v4, Lucide React, Axios
- **Backend:** Node.js, Express, TypeScript, JWT (JSON Web Tokens), BcryptJS
- **Database:** MongoDB Atlas (Cloud Cluster architecture)
- **Deployment Platform:** Render

---

## 💻 Local Development Setup

Follow these installation instructions to run the project stacks concurrently on your local workstation.

### Prerequisites
- Node.js (v18+ recommended)
- NPM or Yarn
- Active MongoDB Atlas Cluster or Local Compass Database instance

### 1. Clone the Repository
```bash
git clone [https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git](https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git)
cd YOUR_REPO_NAME
## 🛠️ Step-by-Step Local Setup

Follow these commands to configure and run the application locally.

### 1. Backend Setup
```bash
cd backend
npm install
# Create a .env file based on .env.example and populate it
npm run dev

### 2. Frontend Setup
cd ../frontend
npm install
# Create a .env file with: VITE_API_URL=http://localhost:5000/api/v1
npm run dev

#### 📖 API Documentation
```markdown
## 📡 API Documentation

All request and response payloads communicate via standardized JSON. Protected routes require a valid Bearer Token passed through the `Authorization` header.

### 🔐 Authentication Endpoints

#### 1. Register a New User
* **URL:** `/api/v1/auth/register`
* **Method:** `POST`
* **Auth Required:** No
* **Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepassword123",
  "role": "Sales User"
}

{
  "status": "success",
  "token": "eyJhbGciOiJIUzI1NiIsIn...",
  "data": {
    "user": { "id": "664b23...", "name": "John Doe", "email": "john@example.com", "role": "Sales User" }
  }
}

2. User Login
URL: /api/v1/auth/login

Method: POST

Auth Required: No

Request Body:

{
  "email": "john@example.com",
  "password": "securepassword123"
}

Lead Management Endpoints
1. Fetch All Leads (With Filters & Pagination)
URL: /api/v1/leads

Method: GET

Auth Required: Yes

Query Parameters (Optional): page=1, limit=10, search=john, status=New, source=Website, sort=Latest

Success Response (200 OK):

{
  "status": "success",
  "meta": { "currentPage": 1, "totalPages": 3, "totalResults": 24 },
  "data": { "leads": [...] }
}

2. Create a New Lead
URL: /api/v1/leads

Method: POST

Auth Required: Yes

Request Body:

{
  "name": "Jane Smith",
  "email": "jane@example.com",
  "status": "New",
  "source": "Instagram"
}

3. Update a Lead Record
URL: /api/v1/leads/:id

Method: PATCH

Auth Required: Yes

4. Delete a Lead Record
URL: /api/v1/leads/:id

Method: DELETE

Auth Required: Yes (Strictly restricted to Admin role)

5. Export Leads to CSV
URL: /api/v1/leads/export

Method: GET

Auth Required: Yes (Accepts token via Authorization header or URL query parameter ?token=...)

Response: Streams an attached .csv download file.

