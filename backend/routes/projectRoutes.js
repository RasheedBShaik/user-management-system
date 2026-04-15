import express from "express";
import Project from "../models/Project.js";

const router = express.Router();

// 1. GET all projects
router.get("/", async (req, res) => {
  try {
    const projects = await Project.find()
      .populate("teamLead", "name")
      .populate("team.member", "name");
    res.json(projects);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 2. POST create project
router.post("/", async (req, res) => {
  try {
    const newProject = new Project(req.body);
    const savedProject = await newProject.save();
    
    const populated = await Project.findById(savedProject._id)
      .populate("teamLead", "name")
      .populate("team.member", "name");
      
    res.status(201).json(populated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// 3. PUT update project (THE MISSING LINK)
router.put("/:id", async (req, res) => {
  try {
    const updatedProject = await Project.findByIdAndUpdate(
      req.params.id,
      { $set: req.body }, // Use $set to update fields provided in the body
      { new: true, runValidators: true } // Return the NEW document and check schema rules
    )
    .populate("teamLead", "name")
    .populate("team.member", "name");

    if (!updatedProject) {
      return res.status(404).json({ message: "Project not found in mainframe." });
    }

    res.json(updatedProject);
  } catch (err) {
    console.error("Update Error:", err);
    res.status(400).json({ message: err.message });
  }
});

// 4. DELETE project
router.delete("/:id", async (req, res) => {
  try {
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