# Admin Login Setup Guide

## Frontend Admin Login Page Created ✅

The admin login page is now available at `http://localhost:5174/admin`

### Features:
- Email & password authentication
- Error handling
- Loading state
- Token storage in localStorage
- Responsive design with Tailwind CSS
- Demo credentials for development

---

## Next Steps: Create Backend API

### 1. Create Node.js/Express Backend

```bash
cd ..
mkdir backend
cd backend
npm init -y
npm install express mongoose bcryptjs jsonwebtoken cors dotenv
```

### 2. Create `.env` file

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/o2herbal
JWT_SECRET=your_secret_key_here
ADMIN_EMAIL=admin@o2herbal.com
ADMIN_PASSWORD=admin123
```

### 3. Create Admin Route (backend/routes/admin.js)

```javascript
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const router = express.Router();

// Admin login endpoint
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // TODO: Fetch admin from database or use environment variables
    const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
    const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
    
    if (email !== ADMIN_EMAIL) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    // In production, hash passwords with bcrypt
    if (password !== ADMIN_PASSWORD) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    // Generate JWT token
    const token = jwt.sign(
      { email, role: 'admin' },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );
    
    res.json({ token, message: 'Login successful' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
```

### 4. Create Server Entry Point (backend/server.js)

```javascript
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const adminRoutes = require('./routes/admin');

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/admin', adminRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

### 5. Run the Backend

```bash
node server.js
```

---

## Test Login

1. Navigate to `http://localhost:5174/admin`
2. Use demo credentials:
   - Email: `admin@o2herbal.com`
   - Password: `admin123`
3. Click "Login"

---

## MongoDB Integration (Optional)

If you want to store admin credentials in MongoDB:

```javascript
const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
  email: String,
  password: String, // Hash this with bcrypt!
  role: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Admin', adminSchema);
```

---

## Security Notes

⚠️ **For Production:**
- Hash passwords with bcrypt
- Use environment variables for sensitive data
- Implement token expiration
- Add HTTPS
- Use secure cookies
- Add rate limiting
- Validate all inputs
