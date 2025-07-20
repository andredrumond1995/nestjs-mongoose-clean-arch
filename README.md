# 📝 NestJS Mongoose Clean Architecture - TODO API

Welcome to the TODO API built with NestJS, Mongoose, and Clean Architecture!
This project provides a robust, scalable, and modern structure for task management, featuring advanced OData v4 query support for MongoDB.

---

## 🚀 Endpoints

### Base URL

```
/v1/todos
```

---

### 1. Create a TODO

- **Endpoint:** `POST /v1/todos`
- **Payload Example:**
  ```json
  {
    "title": "Buy bread",
    "description": "Go to the bakery to buy French bread",
    "completed": false,
    "due_date": "2024-06-30T12:00:00.000Z",
    "priority": "medium"
  }
  ```
- **Required fields:**
  - `title` (string)
  - `completed` (boolean, default: false)
- **Optional fields:**
  - `description` (string)
  - `due_date` (date)
  - `priority` ("low" | "medium" | "high")

---

### 2. List TODOs (with OData v4 support)

- **Endpoint:** `GET /v1/todos`
- **OData v4 Query Parameters:**
  - `$filter`: Advanced filtering (e.g., `?$filter=priority eq 'high'`)
  - `$top`: Limit items (e.g., `?$top=10`)
  - `$skip`: Pagination (e.g., `?$skip=20`)
  - `$orderby`: Sorting (e.g., `?$orderby=due_date desc`)
  - `$select`: Field selection (e.g., `?$select=title,completed`)
- **Example:**
  ```
  GET /v1/todos?$filter=priority eq 'high' and completed eq false&$top=5&$orderby=due_date desc
  ```

---

### 3. Get TODO by ID

- **Endpoint:** `GET /v1/todos/:id`
- **Example:**
  ```
  GET /v1/todos/665f1a2b3c4d5e6f7a8b9c0d
  ```

---

### 4. Update TODO

- **Endpoint:** `PUT /v1/todos/:id`
- **Payload Example:**
  ```json
  {
    "title": "Buy bread and milk",
    "completed": true,
    "priority": "high"
  }
  ```
- **Example:**
  ```
  PUT /v1/todos/665f1a2b3c4d5e6f7a8b9c0d
  ```

---

### 5. Soft Delete TODO

- **Endpoint:** `DELETE /v1/todos/:id`
- **Example:**
  ```
  DELETE /v1/todos/665f1a2b3c4d5e6f7a8b9c0d
  ```

---

### 6. Health Check

- **Endpoint:** `GET /health`
- **Description:**
  Returns the health status of the API and its dependencies (such as the database).
- **Example Response:**
  ```json
  {
    "success": true,
    "datetime": "17/07/2025 09:48:10",
    "httpMethod": "GET",
    "path": "/health",
    "data": {
      "status": "ok",
      "error": {},
      "details": {
        "test_app_db": {
          "status": "up"
        }
      }
    }
  }
  ```

---

## 🔎 OData v4 Query Support for MongoDB

This API natively supports OData v4 queries on the listing endpoint (`GET /v1/todos`).
You can filter, sort, paginate, select fields, and populate references using OData v4 standards, enabling advanced integrations and dynamic queries.

**Example OData query:**
```
GET /v1/todos?$filter=priority eq 'high' and completed eq false&$top=10&$orderby=due_date desc
```

---

## 🛠️ Technologies

- **NestJS**
- **Mongoose**
- **MongoDB**
- **Clean Architecture**
- **OData v4 Query Support**

---

## 👤 Credits

Developed by [André Drumond](https://www.linkedin.com/in/andre-drumond/)
GitHub: [andredrumond1995](https://github.com/andredrumond1995)

---

## 📦 How to Run

1. Clone the repository
2. Install dependencies
3. Configure your `.env` file
4. Start the containers with Docker Compose:
   ```
   docker-compose up --build
   ```
5. Access the API at `http://localhost:3000/v1/todos`

---

## Unit tests

To run all unit tests for the project, execute:

```
npm run test
```

---

## 📄 License

MIT