const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const multer = require('multer');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Helper function to guarantee uploads directory always exists
const ensureUploadsDir = () => {
  const uploadsDir = path.join(__dirname, 'uploads');
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }
  return uploadsDir;
};

// Initial startup check
ensureUploadsDir();

// Serve uploads statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Multer storage with dynamic folder creation check on every file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadsDir = ensureUploadsDir();
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

// 1. Save Permissions JSON to uploads/permissions.txt (overwrite if exists, create if not)
app.post('/api/permissions', (req, res) => {
  try {
    const uploadsDir = ensureUploadsDir();
    const filePath = path.join(uploadsDir, 'permissions.txt');
    const permissionsData = req.body;

    const fileContent = JSON.stringify(permissionsData, null, 2);
    fs.writeFileSync(filePath, fileContent, 'utf8');

    console.log('Permissions successfully saved to uploads/permissions.txt');
    res.json({ success: true, message: 'Permissions saved successfully to uploads/permissions.txt' });
  } catch (error) {
    console.error('Error saving permissions:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// 2. Form Submissions saved to uploads/notes.txt (handles note, notes, or content properties)
app.post('/api/submit', (req, res) => {
  console.log(req.body)
  try {
    const uploadsDir = ensureUploadsDir();
    const rawNote = req.body.note || req.body.notes || req.body.content || req.body;
    const noteText = typeof rawNote === 'object' ? JSON.stringify(rawNote) : rawNote;

    const filePath = path.join(uploadsDir, 'notes.txt');
    const timestamp = new Date().toISOString();
    const logEntry = `[${timestamp}] ${noteText}\n`;
    
    fs.appendFileSync(filePath, logEntry, 'utf8');
    console.log('Form submission saved to uploads/notes.txt');
    res.json({ success: true, message: 'Saved to notes.txt' });
  } catch (error) {
    console.error('Error saving note:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// 3. Media Uploads (Screenshots & Recordings)
app.post('/api/upload', upload.single('media'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, error: 'No file uploaded' });
    }
    console.log('Media file uploaded successfully:', req.file.filename);
    res.json({ 
      success: true, 
      filename: req.file.filename,
      url: `/uploads/${req.file.filename}` 
    });
  } catch (error) {
    console.error('Error uploading media:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Inspector endpoints
app.get('/api/notes', (req, res) => {
  const uploadsDir = ensureUploadsDir();
  const filePath = path.join(uploadsDir, 'notes.txt');
  if (fs.existsSync(filePath)) {
    res.send(fs.readFileSync(filePath, 'utf8'));
  } else {
    res.send('No notes found.');
  }
});

app.get('/api/files', (req, res) => {
  const uploadsDir = ensureUploadsDir();
  const files = fs.readdirSync(uploadsDir).map(filename => ({
    filename,
    url: `/uploads/${filename}`
  }));
  res.json(files);
});

app.listen(PORT, () => {
  console.log(`Node.js server is running on http://localhost:${PORT}`);
});