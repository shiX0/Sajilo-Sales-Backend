<!-- Name of Project -->

# Sajilo Sales

## Overview

Sajilo Sales is a backend system for a Point of Sale (POS) application. It manages sales transactions, Products, customer data and some key metrics. The system provides a set of RESTful API endpoints to interact with the POS functionalities.

## Features

### API Endpoints

#### User

- **POST /user/register**: Register a new user
- **POST /user/login**: User login
- **POST /user/forgotpassword**: Request password reset
- **POST /user/resetpassword**: Reset password

#### Customer

- **POST /customer/create**: Create a new customer
- **GET /customer**: Retrieve a list of all customers
- **GET /customer/{id}**: Retrieve customer details by ID
- **GET /customer/analytics**: Retrieve customer analytics
- **GET /customer/search/**: Search for customers
- **PUT /customer/update/{id}**: Update customer details by ID
- **DELETE /customer/delete/{id}**: Delete customer by ID

#### Order

- **GET /order/**: Retrieve a list of all orders
- **GET /order/{id}**: Retrieve order details by ID
- **GET /order/analytics**: Retrieve order analytics
- **POST /order/create**: Create a new order
- **PUT /order/{id}**: Update order details by ID
- **DELETE /order/{id}**: Delete order by ID

#### Product

- **GET /product/**: Retrieve a list of all products
- **POST /product/create**: Create a new product
- **GET /product/{id}**: Retrieve product details by ID
- **PUT /product/{id}**: Update product details by ID
- **DELETE /product/{id}**: Delete product by ID

#### Dashboard Metrics

- **GET /metrics/**: Retrieve dashboard metrics

## Technologies

- Node.js : Javascript runtime
- Express.js : Simple web framework
- MongoDB : Dastabase based on nosql
- Mongoose : Object modeling tool to work with mongoDB
- NodeMailer : Sending mails via SMTP server

## Environment Variables

To run this project, you will need to add the following environment variables to your .env file:

- `MONGODB`: MongoDB connection string
- `PORT`: Port number for the server
- `JWT_SECRET`: Secret key for JSON Web Token (JWT) authentication
- `SMTP_*` : Secrets related to SMTP server

## Author

- **Name**: Shishir Sharma
- **ID**: 220099
