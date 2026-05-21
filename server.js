const express = require('express');
const cors = require('cors');
const fs = require('fs');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

// File to store shipments
const DATA_FILE = 'data.json';

// Ensure data file exists
if (!fs.existsSync(DATA_FILE)) {
  fs.writeFileSync(DATA_FILE, JSON.stringify([]));
}

// Read data
function readData() {
  return JSON.parse(fs.readFileSync(DATA_FILE));
}

// Write data
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

// ✅ Home route (important for Render)
app.get('/', (req, res) => {
  res.send("Backend is running 🚀");
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
