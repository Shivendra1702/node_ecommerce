# Link : https://ecommerce-api-1wi2.onrender.com/api/v1

# E-Commerce API Readme

This README provides an overview of the E-Commerce API endpoints, their functionality, and how to use them.

## Table of Contents

- [Introduction](#introduction)
- [Getting Started](#getting-started)
- [API Routes](#api-routes)
  - [User Routes](#user-routes)
  - [Product Routes](#product-routes)
  - [Order Routes](#order-routes)
  - [Payment Routes](#payment-routes)
- [Authentication](#authentication)
- [Error Handling](#error-handling)
- [Contributing](#contributing)

## Introduction

The E-Commerce API is designed to provide backend functionality for an e-commerce application. It includes routes for managing users, products, orders, and payments. The API is built using Node.js, Express.js, and MongoDB.

## Getting Started

To get started with this API, follow these steps:

1. Clone the repository: `git clone <repository-url>`
2. Install dependencies: `npm install`
3. Set up environment variables:
   - Create a `.env` file in the project root directory.
   - Add the following environment variables:
     - `MONGO_URL`: Your MongoDB connection URL.
     - `JWT_SECRET`: Your JSON Web Token secret key.
     - `STRIPE_API_KEY`: Your Stripe API key.
     - `RAZORPAY_API_KEY`: Your Razorpay API key.
     - (Add any other environment variables specific to your setup)
4. Start the server: `npm start`

## API Routes

### User Routes

- `POST /api/v1/users/signup`: Create a new user.
- `POST /api/v1/users/signin`: Authenticate and sign in a user.
- `POST /api/v1/users/logout`: Log out a user.
- `POST /api/v1/users/forgotpassword`: Send a reset password email.
- `PUT /api/v1/users/resetpassword/:token`: Reset user password.
- `GET /api/v1/users/me`: Get user details.
- `PUT /api/v1/users/me/updatepassword`: Update user password.
- `PUT /api/v1/users/me/updateprofile`: Update user profile details.
- `GET /api/v1/users/admin/users`: Get all users (Admin only).
- `GET /api/v1/users/admin/users/:id`: Get a single user (Admin only).
- `PUT /api/v1/users/admin/users/:id`: Update user details (Admin only).
- `DELETE /api/v1/users/admin/users/:id`: Delete a user (Admin only).

### Product Routes

- `POST /api/v1/products/addproduct`: Add a new product (Manager only).
- `GET /api/v1/products/getproducts`: Get all products.
- `GET /api/v1/products/getproduct/:id`: Get a single product.
- `POST /api/v1/products/addreview/:id`: Add a product review.
- `DELETE /api/v1/products/deletereview/:id`: Delete a product review (Owner only)..
- `GET /api/v1/products/admin/products`: Get all products (Admin only).
- `PUT /api/v1/products/admin/products/:id`: Update product details (Admin only).
- `DELETE /api/v1/products/admin/products/:id`: Delete a product (Admin only).

### Order Routes

- `POST /api/v1/orders/create`: Create a new order.
- `GET /api/v1/orders/getorder/:id`: Get a single order (User).
- `GET /api/v1/orders/userorders`: Get all user orders.
- `GET /api/v1/orders/admin/orders`: Get all orders (Admin only).
- `PUT /api/v1/orders/admin/orders/:id`: Update order status (Admin only).
- `DELETE /api/v1/orders/admin/orders/:id`: Delete an order (Admin only).

### Payment Routes

- `GET /api/v1/payment/stripekey`: Get Stripe API key.
- `POST /api/v1/payment/stripepayment`: Capture a payment using Stripe.
- `GET /api/v1/payment/razorpaykey`: Get Razorpay API key.
- `POST /api/v1/payment/razorpaypayment`: Capture a payment using Razorpay.

## Authentication

- User authentication is required for routes that involve user-specific data.
- Admin authentication is required for routes that require admin-level access.
- Generate a JSON Web Token (JWT) by signing in, and include it in the `Authorization` header as `Bearer <token>` for protected routes.

## Error Handling

The API provides detailed error messages for various scenarios, including validation errors, authentication errors, and database errors. Please refer to the error messages in the API responses for troubleshooting.

## Contributing

If you'd like to contribute to this project, please follow the standard GitHub Fork and Pull Request workflow. Contributions are welcome!
