# Task Track 🚀

A modern, elegant task management application built with React and Node.js. Features a clean, dark-themed UI with real-time updates, task prioritization, and comprehensive task management capabilities.

## 🌟 Features

### Core Functionality
- **User Authentication**: Secure login and registration system
- **Task Management**: Create, edit, clone, and delete tasks
- **Status Tracking**: Multiple status options (Draft, In Progress, On Hold, Completed)
- **Priority Levels**: Four-tier priority system (Low, Medium, High, Urgent)
- **Due Date Management**: Set and track task deadlines
- **Task Organization**: Sort and filter tasks based on various criteria

### User Interface
- **Dark Theme**: Modern, eye-friendly dark mode interface
- **Dual Views**: 
  - Table View: Compact list of tasks with quick actions
  - Workspace View: Visual dashboard with statistics and upcoming tasks
- **Interactive Elements**: 
  - Expandable task details
  - Quick action buttons
  - Status indicators with color coding
- **Responsive Design**: Works seamlessly on desktop and mobile devices

### Advanced Features
- **Task Analytics**: Visual representation of task distribution
- **Due Date Alerts**: Automatic notifications for approaching deadlines
- **Task Cloning**: Quickly duplicate existing tasks
- **Bulk Actions**: Select and perform actions on multiple tasks
- **Real-time Updates**: Instant UI updates on task modifications

## 🛠️ Technology Stack

### Frontend
- **React**: UI library
- **Tailwind CSS**: Styling and design
- **Axios**: HTTP client
- **Date-fns**: Date manipulation
- **Recharts**: Data visualization
- **Lucide React**: Icons

### Backend
- **Node.js**: Runtime environment
- **Express**: Web framework
- **MongoDB**: Database
- **Mongoose**: ODM (Object Data Modeling)
- **JWT**: Authentication
- **Bcrypt**: Password hashing

## 📦 Installation

1. Clone the repository:
```bash
git clone https://github.com/[your-username]/task-track.git
cd task-track
```

2. Install dependencies for both frontend and backend:
```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

3. Set up environment variables:
   Create two .env files:

   ```bash
   # In backend directory, create .env file with these variables:
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   PORT=5000

   # In frontend directory, create .env file with:
   VITE_API_URL=http://localhost:5000/api
   ```

   ⚠️ **Security Note**: 
   - Never commit your .env files to version control
   - Keep your MongoDB connection string private
   - Use a strong, unique JWT secret
   - Add `.env` to your `.gitignore` file

4. Start the application:
```bash
# Start backend (from backend directory)
npm start

# Start frontend (from frontend directory)
npm run dev
```

## 🔧 Project Structure

```
task-track/
├── .gitignore          # Includes .env, node_modules, etc.
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   └── main.jsx
│   └── package.json
├── backend/
│   ├── models/
│   ├── controllers/
│   ├── middleware/
│   ├── routes/
│   ├── server.js
│   └── package.json
└── README.md
```

## 🔐 API Endpoints

The application provides secure API endpoints for task and user management:

### Tasks
- Get all tasks
- Create new task
- Update existing task
- Delete task

### Users
- Register new user
- User login
- Get user profile

All endpoints (except registration and login) require authentication.

## 👥 Authentication

The application uses JWT (JSON Web Tokens) for secure authentication. Each API request (except login and register) requires authentication headers.

## 📝 Data Models

### Task Properties
- Title
- Description
- Creation and update dates
- Due date
- Priority level
- Status
- Assignment information

### User Properties
- Username
- Securely hashed password

## 🎨 UI Components

### Main Views
- **Task List**: Primary interface for task management
- **Workspace**: Dashboard with statistics and upcoming tasks

### Task Management
- Create new tasks
- Edit existing tasks
- Clone tasks
- Delete tasks

## 🔄 State Management

The application uses React's built-in state management with hooks for efficient data handling and UI updates.

## 🛡️ Security Features

- Password hashing with bcrypt
- JWT-based authentication
- Protected API routes
- XSS protection
- CORS configuration
- Environment variables for sensitive data
- `.env` files excluded from version control

## 📱 Responsive Design

The application is fully responsive and works on:
- Desktop computers
- Tablets
- Mobile devices

## 🚀 Future Enhancements

- Team collaboration features
- File attachments
- Comment system
- Email notifications
- Task templates
- Advanced filtering
- Custom task fields
- Time tracking
- Task dependencies
- Export functionality

## 📄 License

MIT License - feel free to use this project for personal or commercial purposes.

## 👏 Acknowledgments

- Icons by Lucide React
- UI inspiration from modern design trends
- Built with React, Node.js, and MongoDB
- Styled with Tailwind CSS

---

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

Made with ❤️ and modern web technologies
