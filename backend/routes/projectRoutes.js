import express from "express";
import Project from "../models/Project.js";
import { auth } from "../middleware/auth.js"; // Ensure you import your auth middleware
import { updateProject } from "../controllers/projectController.js"; // Using the logic we fixed earlier

const router = express.Router();

// 1. GET all projects
router.get("/", async (req, res) => {
  try {
    const projects = await Project.find()
      .populate("teamLead", "name email")    // FIX: Added email
      .populate("team.member", "name email"); // FIX: Added email
    res.json(projects);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 2. POST create project
router.post("/", auth, async (req, res) => {
  try {
    const newProject = new Project(req.body);
    const savedProject = await newProject.save();
    
    const populated = await Project.findById(savedProject._id)
      .populate("teamLead", "name email")    // FIX: Added email
      .populate("team.member", "name email"); // FIX: Added email
      
    res.status(201).json(populated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// 3. PUT update project
// NOTE: We use the 'updateProject' function from the controller 
// that contains the (isLead || isAdmin) logic.
router.put("/:id", auth, updateProject); 

// 4. DELETE project
router.delete("/:id", auth, async (req, res) => {
  try {
    // Usually, only Admins should be allowed to delete
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: "Only Admins can purge projects." });
    }

    const project = await Project.findByIdAndDelete(req.params.id);
    if (!project) {
      return res.status(404).json({ message: "Project does not exist." });
    }
    res.json({ message: "Project purged successfully." });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;