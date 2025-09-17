import express from 'express';
import multer from 'multer';
import { fileURLToPath } from 'url';
import path from 'path';
import cors from 'cors';
import bodyParser from 'body-parser';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Enable CORS for frontend requests (from Vue)
app.use(cors());

// Parse JSON and URL-encoded bodies
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Middleware to serve static files from 'public' folder
app.use(express.static(path.join(__dirname, 'public')));

// Setup multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage }).single('file'); // For admin form only

let students = [];

// Home route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'pages/home.html'));
});

// Admin Form
app.get('/adminForm', (req, res) => {
  res.sendFile(path.join(__dirname, 'pages/adminForm.html'));
});

// Handle Admin Form Submission and File Upload together
app.post('/postadminForm', upload, (req, res) => {
  console.log('Received request at /postadminForm');
  console.log('Request body:', req.body);
  console.log('Files:', req.file);  // Log the uploaded file

  var response = {
    adminID: req.body.adminID,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    department: req.body.department,
    file: req.file ? req.file.path : null // Add file path if uploaded
  };

  console.log("Response is: ", response);
  
  // Send response as JSON
  res.json(response); // Send the response back as JSON
});

// Get all students (for Vue to fetch)
app.get('/getstudentForm', (req, res) => {
  res.json(students);
});

// Submit student form (POST from Vue)
app.post('/poststudentForm', (req, res) => {
  const { firstName, lastName, studentID, course } = req.body;

  // Basic validation
  if (!firstName || !lastName || !studentID || !course) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  const student = { firstName, lastName, studentID, course };
  students.push(student);
  console.log('New student added:', student);

  res.json(student); // Return JSON for Vue frontend
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
