# Smart Leads Dashboard (Full-Stack MERN Assignment Submission)

A production-ready Full-Stack Lead Management Workspace built with strict TypeScript compliance across both application layers, featuring Role-Based Access Control (RBAC), containerized configurations, dynamic backend pagination, debounced filtering pipelines, and server-side streamed CSV reports.

## Live Application Links
- **Frontend Live Build:** [Insert Vercel/Netlify Link Here]
- **API Server Endpoint:** [Insert Render Link Here]

---

## Core Operational Features
- **Strict TypeScript Typing:** Complete verification coverage without using `any` maps to enforce strong compile-time safeguards.
- **JWT Authentication Layer:** Secure auth state tracking with bcrypt password hashing and modular validation middlewares.
- **Role-Based Access Control (RBAC):** Restricts data mutation paths (`DELETE` operations, heavy analytical CSV streaming exports) to users with the `Admin` role, while granting standard data access to `Sales Users`.
- **Advanced Query Pipelines:** Combined partial string match queries, status filtration sorting, and dynamic limit counters with structural response headers.
- **UX Layout Implementations:** Built with dynamic Tailwind styling, full theme shifting capabilities (Dark Mode), skeletons for active loading states, empty table placeholders, and clear error layouts.

---

## Technical Stack Architecture
- **Frontend Platform:** React 18, Vite bundling utility, TypeScript engine, TailwindCSS modules, Axios clients, Lucide graphics pack.
- **Backend Infrastructure:** Node.js execution layer, Express web framework, TypeScript wrapper, Mongoose ODM engines.
- **Database Engine:** MongoDB Atlas cloud cluster deployment.
- **Containerization Engines:** Docker, Docker Compose orchestration models.

---

## API Endpoint Documentation

### Authentication Base Route: `/api/v1/auth`
- `POST /register` - Registers a new user. Expects `name`, `email`, `password`, and `role` (`Admin` or `Sales User`).
- `POST /login` - Validates user credentials and returns a secure JWT token along with user data profile objects.

### Leads Resource Route: `/api/v1/leads` (Requires Valid Bearer Token)
- `GET /` - Fetches paginated leads. Accepts optional search modifiers: `?page=1&limit=10&search=john&status=New&source=Website&sort=Latest`.
- `GET /:id` - Fetches single resource metrics matching the parameters block.
- `POST /` - Appends a new lead into the dataset collection.
- `PUT /:id` - Updates mutable elements matching the target ID parameter.
- `DELETE /:id` - Deletes a record from the database. **(Admin Authorization Required)**
- `GET /export` - Streams a server-side compiled database dump directly into a clean CSV download file. **(Admin Authorization Required)**

---

## Local Setup & Installation Instructions

### Option A: Standard Manual Installation

#### 1. Configure Local Environment Files
Create a `.env` file inside the `/backend` folder:
```env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/smart_leads
JWT_SECRET=production_grade_secret_hash_key
JWT_EXPIRES_IN=1d
NODE_ENV=development