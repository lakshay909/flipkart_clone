# Flipkart Clone - E-Commerce Platform

![Frontend](https://img.shields.io/badge/Frontend-React.js%20%7C%20Vite-61DAFB?logo=react&logoColor=black)
![Backend](https://img.shields.io/badge/Backend-Node.js%20%7C%20Express-339933?logo=node.js&logoColor=white)
![Database](https://img.shields.io/badge/Database-PostgreSQL%20(Neon)-336791?logo=postgresql&logoColor=white)
![Deployment](https://img.shields.io/badge/Deployment-Vercel%20%7C%20Railway-000000?logo=vercel&logoColor=white)

**Live Demo**: [https://flipkart-clone-zeta-jade.vercel.app/](https://flipkart-clone-zeta-jade.vercel.app/)

## 1. Project Overview & Features

This project is a responsive, highly-functional full-stack e-commerce platform designed to replicate the core experience of major shopping applications like Flipkart. It features a modern, clean UI combined with a robust RESTful API backend, ensuring a seamless journey from casual browsing directly to final checkout.

### Key Features
- **Product Listing & Details**: Browse a catalogue of products with dynamic routing for individual item pages.
- **Cart Management**: Add products, adjust quantities dynamically, and remove items with real-time price state synchronization.
- **Multi-Step Checkout Flow**: A fluid user experience advancing predictably from cart -> delivery address input -> order summary review.
- **Order Review & Confirmation**: A dedicated pre-checkout review screen displaying the full price breakdown, shipping details, and product list to simulate a high-trust e-commerce environment before order placement.

---

## 2. Tech Stack Used

- **Frontend**: React.js, Vite, React Router, custom CSS for UI styling.
- **Backend**: Node.js, Express.js.
- **Database**: PostgreSQL (Hosted on Neon DB).
- **Deployment**: 
  - Frontend hosted on **Vercel**
  - Backend API hosted on **Railway.app**

---

## 3. Local Setup Instructions

Follow these step-by-step instructions to get the project running on your local machine.

### Step 1: Clone the repository
```bash
git clone https://github.com/your-username/flipkart_clone.git
cd flipkart_clone
```

### Step 2: Setup the Backend
Open a terminal and navigate to the `backend` directory:
```bash
cd backend
npm install
```

Create a `.env` file in the `backend` directory. You will need the following required environment variables:
```env
PORT=5001
DATABASE_URL=your_neon_postgres_connection_string
FRONTEND_URL=http://localhost:5173
```

Start the backend server:
```bash
npm run dev
# OR: node src/server.js
```

### Step 3: Setup the Frontend
Open a new terminal and navigate to the `frontend` directory:
```bash
cd frontend
npm install
```

Create a `.env` file in the `frontend` directory with the following required environment variable to connect to your local backend:
```env
VITE_API_URL=http://localhost:5001/api
```

Start the Vite development server:
```bash
npm run dev
```

The frontend will now be accessible at `http://localhost:5173`.

---

## 4. Assumptions Made

The following assumptions and design decisions were made to focus strictly on the development of the core e-commerce engine and transaction flow for this assignment:

1. **Authentication**: To focus on the core shopping mechanics, user authentication has intentionally been mocked/simulated. Actions like viewing the cart or placing an order utilize a hardcoded dummy user (`userId = 1`) at the controller level on the backend.
2. **Payments**: Real money transactions and payment gateways (such as Stripe or Razorpay) are bypassed for this phase of the assignment. The checkout flow assumes a final "Cash on Delivery" or mock payment logic.
3. **Product Data & Catalog**: The initial catalog of products is assumed to be pre-seeded into the PostgreSQL database. Admin dashboards for creating/updating products manually are considered out of scope for the current feature set.
