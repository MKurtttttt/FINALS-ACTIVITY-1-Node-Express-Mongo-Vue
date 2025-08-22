import express from 'express';
import multer from 'multer';
import { fileURLToPath } from 'url';
import path from 'path';
import bodyParser from 'body-parser';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

var app = express();

// Middleware to serve static files from the 'public' folder
app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Setup multer for file uploads
var storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, 'uploads/');
  },
  filename: (req, file, callback) => {
    callback(null, Date.now() + path.extname(file.originalname));
  }
});

var upload = multer({ storage: storage }).fields([{ name: 'file', maxCount: 1 }]);

// Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/pages/home.html'));
});

app.get('/studentForm', (req, res) => {
  res.sendFile(__dirname + '/pages/studentForm.html');
});

app.get('/adminForm', (req, res) => {
  res.sendFile(__dirname + '/pages/adminForm.html');
});

// Handle Admin Form Submission and File Upload together
app.post('/postadminForm', upload, (req, res) => {
  console.log('Received request at /postadminForm');
  console.log('Request body:', req.body);
  console.log('Files:', req.files);  // Log the uploaded files

  var response = {
    adminID: req.body.adminID,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    department: req.body.department,
    file: req.files['file'] ? req.files['file'][0].path : null // Add file path if uploaded
  };

  console.log("Response is: ", response);
  
  // Send response as JSON
  res.json(response); // Send the response back as JSON
});

// Starting the server
var server = app.listen(5000, () => {
  const host = server.address().address;
  const port = server.address().port;
  console.log(`Server running at http://${host}:${port}`);
});
