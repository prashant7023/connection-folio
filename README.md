# Connection-folio

Student profile management system with email notifications for account status changes.

## Setup Instructions

### Prerequisites
- Node.js (v14+)
- MongoDB (local or Atlas)
- Git
- npm

### Clone the Repository
```bash
git clone https://github.com/your-username/connection-folio.git
cd connection-folio
```

### Server Setup
1. Install server dependencies:
```bash
cd server
npm install
```

2. Configure environment variables by creating `.env` file in the server directory:
```
PORT=5000
MONGO_URI=mongodb+srv://youruser:yourpassword@yourcluster.mongodb.net/
JWT_SECRET=your_jwt_secret_key
ADMIN_EMAIL=admin@example.com
GMAIL_USER=your-email@gmail.com
GMAIL_PASS=your-app-password
```

3. Start the server:
```bash
node server.js
```
The server will run on http://localhost:5000

### Client Setup
1. Open a new terminal and install client dependencies:
```bash
cd client
npm install
```

2. **Important: Update API URLs**
   Before running the client, make sure to update all API endpoints in the client code to use localhost:
   - Open `client/src/app/login/page.jsx` and change the API URL to `http://localhost:5000/api/students/login`
   - Open `client/src/app/signup/page.jsx` and change the API URL to `http://localhost:5000/api/students/register`
   - Open `client/src/app/admin/page.jsx` and change any API URLs to use `http://localhost:5000`

3. Start the client application:
```bash
npm run dev
```
The client will run on http://localhost:3000

### Using the Application

1. Create a student account by signing up
2. Admin can approve student registrations
3. Students receive email notifications when their status changes
4. Admin dashboard shows all students with options to approve/reject

### Admin Access
Only authorized emails can register as admin accounts. These are configured in the Admin model.