# Final Project - MERN E-commerce Store

A full-stack e-commerce web application built with the MERN stack. The app includes product browsing, category filtering, search, cart and wishlist management, user authentication, checkout, reviews, and an admin dashboard for managing products, categories, orders, and users.

## Features

- User registration and login with JWT authentication
- Product listing, search, and category-based browsing
- Product details with ratings and reviews
- Shopping cart and wishlist support
- Checkout flow with form validation
- Protected user profile and order views
- Admin area for managing products, categories, orders, and users
- Responsive UI built with React and Vite

## Tech Stack

### Frontend
- React
- Vite
- React Router
- Tailwind CSS
- Axios
- React Hot Toast

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT authentication
- Multer for image uploads
- CORS and dotenv support

## Project Structure

- client/ - Vite frontend application
- server/ - Express backend API and database models
- server/routes/ - API endpoints for auth, products, cart, orders, reviews, and admin
- server/models/ - MongoDB schemas
- server/utils/ - validation, seeding, and helper utilities

## Prerequisites

Before running the project, make sure you have:

- Node.js 18+ installed
- npm installed
- A MongoDB instance running locally or a MongoDB Atlas connection string

## Environment Setup

### Server

1. Navigate to the server folder:
   ```bash
   cd server
   ```
2. Create a .env file by copying the example file:
   ```bash
   copy .env.example .env
   ```
3. Update the values in .env:
   ```env
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/mern_ecommerce
   JWT_SECRET=your_super_secret_key
   JWT_EXPIRES_IN=30d
   NODE_ENV=development
   CLIENT_URL=http://localhost:5173
   ```

### Client

The client uses Vite and does not require a separate .env file unless you want to customize the frontend URL.

## Installation

Install dependencies for both the client and server:

```bash
cd server
npm install

cd ../client
npm install
```

## Running the App

### Start the backend

```bash
cd server
npm run dev
```

The API will run at:
- http://localhost:5000
- Health check: http://localhost:5000/api/health

### Start the frontend

```bash
cd client
npm run dev
```

The client will run at:
- http://localhost:5173

## Seed Sample Data

To populate the database with sample categories and products:

```bash
cd server
npm run seed
```

## Available Scripts

### Server
- npm run dev - start the backend in watch mode
- npm start - start the backend normally
- npm run seed - seed sample data into MongoDB

### Client
- npm run dev - start the Vite development server
- npm run build - build the frontend for production
- npm run preview - preview the production build locally

## Deployment Notes

- The backend is configured for deployment with Render.
- The frontend is configured for deployment with Vercel.
- Make sure your production environment includes the same environment variables used locally.

## Notes

- Admin routes are protected and require an account with admin privileges.
- Image uploads are served from the server uploads directory.
- If MongoDB connection fails, confirm that the MONGO_URI is correct and that your network allows access to the database.

