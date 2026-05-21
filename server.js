const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

let shipments = {};

// =======================
// CREATE SHIPMENT
// =======================
app.post('/admin/create-shipment', (req, res) => {
  const { origin, destination, sender, receiver } = req.body;

  const id = Math.random().toString(36).substring(2, 10).toUpperCase();

  shipments[id] = {
    sender,
    receiver,
    origin,
    destination,
    history: [
      {
        status: "Shipment created",
        location: origin || "Lagos",
        date: new Date().toISOString().split("T")[0]
      }
    ],
    currentLocation: origin || "Lagos"
  };

  res.json({ trackingId: id });
});

// =======================
// UPDATE SHIPMENT
// =======================
app.post('/admin/update-shipment', (req, res) => {
  const { id, status, location } = req.body;

  const shipment = shipments[id?.toUpperCase()];

  if (!shipment) {
    return res.status(404).json({ error: "Shipment not found" });
  }

  const update = {
    status: status || "In transit",
    location: location || "Unknown",
    date: new Date().toISOString().split("T")[0]
  };

  shipment.history.push(update);
  shipment.currentLocation = update.location;

  res.json({ success: true, message: "Shipment updated" });
});

// =======================
// TRACK SHIPMENT
// =======================
app.get('/track/:id', (req, res) => {
  const id = req.params.id.toUpperCase();

  const shipment = shipments[id];

  if (!shipment) {
    return res.json({
      success: false,
      message: "Tracking number not found"
    });
  }

  res.json({
    success: true,
    trackingId: id,
    origin: shipment.origin,
    destination: shipment.destination,
    currentLocation: shipment.currentLocation,
    history: shipment.history
  });
});

// =======================
// START SERVER
// =======================
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
