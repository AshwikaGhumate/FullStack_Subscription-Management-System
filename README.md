# Subscription Management System

## Overview

The Subscription Management System is a SaaS-focused platform that allows businesses to manage their customer subscriptions efficiently. It supports key features like subscription addition, extension, termination, and revenue reporting through a clean and professional user interface. The system integrates ReactJS on the frontend with Python Flask on the backend, ensuring high performance and scalability.


## Features

### Customer and Product Management
- Display lists of customers and products dynamically from the database. 
- Easy selection of customers and products during subscription creation.
### Subscription Operations
- Add new subscriptions with validation checks for overlapping or duplicate active subscriptions.
- Extend existing subscriptions with a clear interface for selecting new dates.
- Delete subscriptions.
### Revenue Reporting
- Generate revenue reports for all the products.
- Provide insights into subscription revenue trends and product performance.


## Technology Stack

### Frontend
- ReactJS: For building a dynamic, responsive UI.
- CSS: Modular styling for individual components.
### Backend
- Python Flask: A lightweight framework for handling API requests and business logic.
- SQLite: Relational database for managing customer, product, and subscription data.

## Setup Instructions

### 1. Clone the Repository
  
       git clone https://github.com/AshwikaGhumate/FullStack_Subscription-Management-System.git
       cd FullStack_Subscription-Management-System
### 2. Install Frontend Dependencies

Navigate to the frontend directory and install the required dependencies:

       cd frontend
       npm install
Start the frontend development server:

       npm start
### 3. Install Backend Dependencies

Navigate to the backend directory and set up the Python environment:


       cd ../backend
       pip install -r requirements.txt
Start the Flask server:

       flask run
### 4. Database Setup

After executing this command in command prompt it will create all the necessary tables in the SQLite database

       curl http://127.0.0.1:5000/init-db

## Key Functionalities
### 1. Adding Subscriptions
- Select customers and products dynamically from dropdowns.
- Specify start and end dates, and define the number of users.
- Validates against duplicate or overlapping active subscriptions.
### 2. Extending Subscriptions
- Display current subscription details in a modal form.
- Allow users to input a new end date with validation.
### 3. Terminating Subscriptions
- Provides an option to delete the subscription
- Displays a confirmation modal before termination.
### 4. Revenue Reporting
- Generate reports filtered by products.
- Visualize revenue by products.

## API Endpoints
### 1. Customer Management
- GET /customers: Fetch all customers
- POST /customers: Add new customer
- DELETE /customers/id: Delete a specific customer
### 2. Product Management
- GET /products: Fetch all products
- POST /products: Add new product
- DELETE /products/name: Delete a specific product
### 3. Subscription Management
- GET /subscriptions: Fetch all subscriptions
- POST /subscriptions: Add new subscription
- PUT /subscriptions/extend: Extend a specific subscription
- DELETE /subscriptions/end: End a specific subscription

## Sample data for tables
### Customer data
    1. curl -X POST http://localhost:5000/customers -H "Content-Type: application/json" -d "{\"id\": \"CUST001\", \"name\": \"Alice Smith\", \"pan\": \"ABCPM1234A\"}"
    2. curl -X POST http://localhost:5000/customers -H "Content-Type: application/json" -d "{\"id\": \"CUST002\", \"name\": \"David Lee\", \"pan\": \"AAOPM4444L\"}"
    3. curl -X POST http://localhost:5000/customers -H "Content-Type: application/json" -d "{\"id\": \"CUST003\", \"name\": \"Alias Dsouza\", \"pan\": \"AALKM4894L\"}"
    4. curl -X POST http://localhost:5000/customers -H "Content-Type: application/json" -d "{\"id\": \"CUST004\", \"name\": \"James Miller\", \"pan\": \"AAROK6794T\"}"
    5. curl -X POST http://localhost:5000/customers -H "Content-Type: application/json" -d "{\"id\": \"CUST005\", \"name\": \"Smith Wilson\", \"pan\": \"AARIK2794R\"}"

### Product data
    1. curl -X POST http://localhost:5000/products -H "Content-Type: application/json" -d "{\"name\": \"CloudStorage Pro\", \"description\": \"It provides secure cloud storage for businesses.\", \"annual_cost\": 100.00}"
    2. curl -X POST http://localhost:5000/products -H "Content-Type: application/json" -d "{\"name\": \"TaskMaster Premium\", \"description\": \"A project management tool for businesses.\", \"annual_cost\": 120.00}"
