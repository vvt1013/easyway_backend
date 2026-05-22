const express = require('express');
const cors = require('cors');
const fs = require('fs');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

// ================= SHIPMENT SYSTEM =================

const DATA_FILE = 'data.json';

// Ensure data file exists
if (!fs.existsSync(DATA_FILE)) {
  fs.writeFileSync(DATA_FILE, JSON.stringify([]));
}

// Read shipments
function readData() {
  return JSON.parse(fs.readFileSync(DATA_FILE));
}

// Write shipments
function writeData(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

// Generate tracking number
function generateTracking() {
  return 'TRK' + Math.floor(100000 + Math.random() * 900000);
}

// ✅ Create shipment
app.post('/create-shipment', (req, res) => {
  const data = readData();

  const newShipment = {
    trackingNumber: generateTracking(),
    sender: req.body.sender,
    receiver: req.body.receiver,
    status: "Processing",
    location: "Warehouse",
    date: new Date().toLocaleString()
  };

  data.push(newShipment);
  writeData(data);

  res.json({
    message: "Shipment created",
    trackingNumber: newShipment.trackingNumber
  });
});

// ✅ Track shipment
app.get('/track/:trackingNumber', (req, res) => {
  const data = readData();

  const shipment = data.find(
    item => item.trackingNumber === req.params.trackingNumber
  );

  if (!shipment) {
    return res.status(404).json({ message: "Tracking number not found" });
  }

  res.json(shipment);
});

// ================= USER SYSTEM =================

const USERS_FILE = 'users.json';

// Ensure users file exists
if (!fs.existsSync(USERS_FILE)) {
  fs.writeFileSync(USERS_FILE, JSON.stringify([]));
}

// Read users
function readUsers() {
  return JSON.parse(fs.readFileSync(USERS_FILE));
}

// Write users
function writeUsers(data) {
  fs.writeFileSync(USERS_FILE, JSON.stringify(data, null, 2));
}

// ✅ SIGNUP
app.post('/signup', (req, res) => {
  const users = readUsers();
  const { username, password } = req.body;

  if (!username || !password) {
    return res.json({ message: "Fill all fields" });
  }

  const existing = users.find(u => u.username === username);

  if (existing) {
    return res.json({ message: "User already exists" });
  }

  users.push({ username, password });
  writeUsers(users);

  res.json({ message: "Account created successfully" });
});

// ✅ LOGIN
app.post('/login', (req, res) => {
  const users = readUsers();
  const { username, password } = req.body;

  const user = users.find(
    u => u.username === username && u.password === password
  );

  if (!user) {
    return res.json({ message: "Invalid login" });
  }

  res.json({ message: "Login successful" });
});

// ✅ Home route
app.get('/', (req, res) => {
  res.send("Backend is running 🚀");
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
