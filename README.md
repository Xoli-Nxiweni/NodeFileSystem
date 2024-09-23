
---

# Node.js File Manager & REST API

## Overview

This project is a simple Node.js application that serves as both a basic file manager and a REST API for managing a shopping list. It utilizes the file system to store shopping list data in JSON format and exposes CRUD (Create, Read, Update, Delete) operations via HTTP endpoints.

## Features

- **File Storage**: Data is stored in a JSON file for persistence.
- **CRUD Operations**: Complete set of operations to manage your shopping list.
- **Lightweight**: Minimal dependencies and easy to deploy.

## Tech Stack

- **Node.js**: JavaScript runtime for building server-side applications.
- **File System (fs)**: For data storage and file operations.
- **HTTP**: To create the REST API.

## Getting Started

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Xoli-Nxiweni/NodeFileSystem.git
   cd NodeFileSystem
   ```

2. **Create a directory for data storage**:
   ```bash
   mkdir data
   ```

3. **Start the server**:
   ```bash
   node index.js
   ```

4. The server will run on `http://localhost:3004`.

## API Endpoints

### 1. Get Shopping List
- **Method**: `GET`
- **Endpoint**: `/shopping-list`
- **Description**: Retrieves the current shopping list.
- **Response**: Returns an array of shopping list items.

### 2. Add New Item
- **Method**: `POST`
- **Endpoint**: `/shopping-list`
- **Description**: Adds a new item to the shopping list.
- **Request Body**:
  ```json
  {
      "item": "MacBooks",
      "quantity": 10,
      "unit": "Machines"
  }
  ```
- **Response**: Returns the added item with a unique ID.

### 3. Update Item
- **Method**: `PATCH`
- **Endpoint**: `/shopping-list/{id}`
- **Description**: Updates an existing item in the shopping list by ID.
- **Request Body**:
  ```json
  {
      "quantity": 200
  }
  ```
- **Response**: Returns the updated item or a message if not found.

### 4. Delete Item
- **Method**: `DELETE`
- **Endpoint**: `/shopping-list/{id}`
- **Description**: Deletes an item from the shopping list by ID.
- **Response**: Returns the deleted item or a message if not found.

## Usage

You can use tools like Postman or curl to test the API endpoints. Here are some example requests:

### Example Requests

- **Get Shopping List**:
  ```bash
  curl -X GET http://localhost:3004/shopping-list
  ```

- **Add New Item**:
  ```bash
  curl -X POST http://localhost:3004/shopping-list -H "Content-Type: application/json" -d '{"item": "Bananas", "quantity": 6, "unit": "pieces"}'
  ```

- **Update Item**:
  ```bash
  curl -X PATCH http://localhost:3004/shopping-list/1 -H "Content-Type: application/json" -d '{"quantity": 10}'
  ```

- **Delete Item**:
  ```bash
  curl -X DELETE http://localhost:3004/shopping-list/1
  ```

## Deployment

The application can be deployed on any server that supports Node.js. For local development, simply run the application on your machine.

## Contact

For any inquiries or contributions, please contact me at [xolinxiweni@gmail.com](mailto:xolinxiweni@gmail.com).


---