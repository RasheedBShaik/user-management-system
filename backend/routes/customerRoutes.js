import express from 'express';
import Customer from '../models/Customer.js';
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const data = await Customer.find().sort({ createdAt: -1 });
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const fresh = new Customer(req.body);
    await fresh.save();
    res.status(201).json(fresh);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const updated = await Customer.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

export default router;