# Elective Subject Registration System

A comprehensive full-stack web application for managing elective subject registrations in educational institutions. Built with React, Node.js, Express, and MongoDB.

## 🚀 Features

### Admin Features
- **Secure Admin Login** - Dedicated admin authentication system
- **Elective Management** - Full CRUD operations for elective subjects
- **Student Registration Monitoring** - View all student registrations
- **Excel Report Generation** - Two types of reports:
  - Multi-sheet Excel file with all electives and summary
  - Individual Excel files per elective
- **Semester-based Organization** - Filter electives by semester and odd/even type

### Student Features
- **Student Registration** - Easy account creation with roll number
- **Smart Elective Filtering** - Students only see electives relevant to their semester and academic type
- **One-time Registration** - Students can register for only one elective
- **Dashboard View** - Clean interface to view available electives and registration status

## 🛠️ Tech Stack

### Frontend
- **React 19** - Modern React with hooks
- **React Router** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Axios** - HTTP client for API calls
- **Vite** - Fast build tool and dev server

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - JSON Web Tokens for authentication
- **bcrypt** - Password hashing
- **ExcelJS** - Excel file generation

## 📋 Prerequisites

Before running the application, make sure you have:

- **Node.js** (v16 or higher)
- **MongoDB** (local installation or MongoDB Atlas)
- **npm** or **yarn** package manager

## 🔧 Installation & Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd elective-subject-system
```

### 2. Backend Setup
```bash
cd backend
npm install
```

Create a `.env` file in the backend directory:
```env
MONGO_URI=mongodb://localhost:27017/elective_subject_system
JWT_SECRET=your_jwt_secret_key_here_make_it_long_and_secure
PORT=5000
```

### 3. Frontend Setup
```bash
cd frontend
npm install
```

### 4. Database Setup
Make sure MongoDB is running on your system. The application will automatically create the necessary collections and a default admin user.

## 🚀 Running the Application

### Start the Backend Server
```bash
cd backend
npm run dev
```
The backend will run on `http://localhost:5000`

### Start the Frontend Development Server
```bash
cd frontend
npm run dev
```
The frontend will run on `http://localhost:5173`

## 👤 Default Admin Credentials

The system creates a default admin user on first run:
- **Roll Number:** admin001
- **Password:** admin123

## 📊 Database Schema

### Users Collection
```javascript
{
  rollNo: String (unique),
  name: String,
  semester: Number,
  oddEven: String (enum: ["odd", "even"]),
  password: String (hashed),
  role: String (enum: ["student", "admin"]),
  timestamps: true
}
```

### Electives Collection
```javascript
{
  name: String,
  code: String (unique),
  description: String,
  semester: Number,
  oddEven: String (enum: ["odd", "even"]),
  timestamps: true
}
```

### Registrations Collection
```javascript
{
  student: ObjectId (ref: "User"),
  elective: ObjectId (ref: "Elective"),
  timestamps: true
}
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - Student registration
- `POST /api/auth/login` - User login

### Electives
- `GET /api/electives` - Get all electives (with optional filters)
- `GET /api/electives/my` - Get electives for logged-in student
- `POST /api/electives` - Add new elective (admin only)
- `PUT /api/electives/:id` - Update elective (admin only)
- `DELETE /api/electives/:id` - Delete elective (admin only)

### Registrations
- `POST /api/registrations` - Register for an elective
- `GET /api/registrations/me` - Get student's registration
- `GET /api/registrations` - Get all registrations (admin only)

### Reports
- `GET /api/reports/multi-sheet` - Download comprehensive Excel report
- `GET /api/reports/per-elective?electiveId=xxx` - Download individual elective report

## 🎨 User Interface

### Landing Page
- Modern gradient design with glassmorphism effects
- Clear role selection (Student/Admin)
- Feature highlights and navigation

### Student Dashboard
- Semester-specific elective filtering
- Clean card-based elective display
- Registration status tracking
- Responsive design for all devices

### Admin Dashboard
- Tabbed interface for different functions
- Comprehensive elective management
- Detailed registration monitoring
- Excel report generation with multiple options

## 🔐 Security Features

- **JWT Authentication** - Secure token-based authentication
- **Password Hashing** - bcrypt for secure password storage
- **Role-based Access Control** - Separate admin and student permissions
- **Input Validation** - Server-side validation for all inputs
- **CORS Configuration** - Proper cross-origin resource sharing

## 📱 Responsive Design

The application is fully responsive and works seamlessly on:
- Desktop computers
- Tablets
- Mobile phones

## 🧪 Testing

To test the application:

1. **Register as a Student:**
   - Go to the landing page
   - Click "Register as Student"
   - Fill in your details
   - Login with your credentials

2. **Admin Testing:**
   - Use the default admin credentials
   - Add some electives
   - View student registrations
   - Generate Excel reports

3. **Student Flow:**
   - Register and login as a student
   - View available electives (filtered by your semester)
   - Register for an elective
   - View your registration status

## 🚀 Deployment

### Backend Deployment
1. Set up environment variables in your hosting platform
2. Deploy to platforms like Heroku, Railway, or DigitalOcean
3. Ensure MongoDB connection string is properly configured

### Frontend Deployment
1. Build the production version: `npm run build`
2. Deploy to platforms like Vercel, Netlify, or GitHub Pages
3. Update API base URL in `frontend/src/services/api.js`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

## 🆘 Support

If you encounter any issues or have questions:
1. Check the console for error messages
2. Ensure MongoDB is running
3. Verify environment variables are set correctly
4. Check network connectivity between frontend and backend

## 🔮 Future Enhancements

- Email notifications for registration confirmations
- Bulk student import functionality
- Advanced reporting with charts and analytics
- Mobile app development
- Integration with existing student information systems
- Multi-language support
- Advanced user roles and permissions

---

**Built with ❤️ for educational institutions**
