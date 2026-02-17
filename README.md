# Learning-TQ: Student Management System

A simple React application for managing student records with full CRUD (Create, Read, Update, Delete) functionality. This project demonstrates modern React practices including hooks (`useState`, `useEffect`) and API integration using `axios`.

## 🚀 Features

-   **Create**: Add new students with Name, Email, Phone, and Age.
-   **Read**: View a comprehensive list of all students.
-   **Update**: Edit existing student details.
-   **Delete**: Remove student records.
-   **Responsive UI**: Clean, dark-themed interface built for usability.
-   **Real-time Feedback**: Immediate visual updates upon successful operations.

## 🛠️ Technologies Used

-   **Frontend Framework**: [React](https://react.dev/)
-   **Build Tool**: [Vite](https://vitejs.dev/)
-   **HTTP Client**: [Axios](https://axios-http.com/)
-   **Styling**: Custom CSS
-   **Linting**: ESLint

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
-   [Node.js](https://nodejs.org/) (v16 or higher)
-   [npm](https://www.npmjs.com/) or [Bun](https://bun.sh/)

## ⚙️ Installation

1.  **Clone the repository**
    ```bash
    git clone <repository-url>
    cd Learning-TQ
    ```

2.  **Install dependencies**
    ```bash
    npm install
    # or
    bun install
    ```

## 🏃‍♂️ Running the Application

### 1. Start the Backend API
This application expects a REST API running at `http://localhost:3000/students`.

If you don't have a backend ready, you can quickly mock one using `json-server`:

```bash
# Install json-server globally
npm install -g json-server

# Create a db.json file
echo '{ "students": [] }' > db.json

# Start the server
json-server --watch db.json --port 3000
```

### 2. Start the Frontend Development Server
```bash
npm run dev
# or
bun dev
```

The application will be available at `http://localhost:5173`.

## 📡 API Endpoints

The application interacts with the following endpoints:

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/students` | Retrieve all students |
| `POST` | `/students` | Create a new student |
| `PUT` | `/students/:id` | Update an existing student |
| `DELETE` | `/students/:id` | Delete a student |

### Payload Structure
**Create/Update Student:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+1234567890",
  "age": 25,
  "created_by": 1
}
```

## 📂 Project Structure

```
Learning-TQ/
├── public/
├── src/
│   ├── assets/
│   ├── App.jsx          # Main application component
│   ├── main.jsx         # Entry point
│   ├── StudentCrud.jsx  # Student CRUD logic and UI
│   ├── StudentCrud.css  # Styles for StudentCrud component
│   └── index.css        # Global styles
├── package.json
└── README.md
```

## 🤝 Contributing

1.  Fork the repository
2.  Create your feature branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request
