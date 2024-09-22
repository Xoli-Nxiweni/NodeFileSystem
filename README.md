# Node.js File Manager & REST API

## Overview

This project is a simple Node.js application that serves as both a basic file manager and a REST API for managing a shopping list. It utilizes the file system to store shopping list data in a JSON format and exposes CRUD (Create, Read, Update, Delete) operations via HTTP endpoints.

## Tech Stack

- **Node.js**: JavaScript runtime for building server-side applications.
- **File System (fs)**: For data storage and file operations.
- **HTTP**: To create the REST API.

## Deployment

The application can be deployed on any server that supports Node.js. For local development, simply run the application on your machine.

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Xoli-Nxiweni/NodeFileSystem.git
   cd NodeFileSystem
   ```

2. Create a directory for data storage:
   ```bash
   mkdir data
   ```

3. Start the server:
   ```bash
   node index.js
   ```

4. The server will run on `http://localhost:3004`.

## Contact

For any inquiries or contributions, please contact me at [xolinxiweni@gmail.com](mailto:xolinxiweni@gmail.com).

## Usage

### API Endpoints

1. **Get Shopping List**
   - **Endpoint**: `GET /shopping-list`
   - **Description**: Retrieves the current shopping list.
   - **Response**: Returns an array of shopping list items.

2. **Add New Item**
   - **Endpoint**: `POST /shopping-list`
   - **Description**: Adds a new item to the shopping list.
   - **Request Body**:
     ```json
     {
         "item": "Bananas",
         "quantity": 6,
         "unit": "pieces"
     }
     ```
   - **Response**: Returns the added item with a unique ID.

3. **Delete Item**
   - **Endpoint**: `DELETE /shopping-list/{id}`
   - **Description**: Deletes an item from the shopping list by ID.
   - **Response**: Returns the deleted item or a message if not found.

For more details, visit the project repository: [Node.js File Manager & REST API](https://github.com/Xoli-Nxiweni/NodeFileSystem).
