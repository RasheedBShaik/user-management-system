export const updateProject = async (req, res) => {
  try {
    const { projectName, teamLead, team } = req.body;

    // 1. Fetch the project first to check who the current Lead is
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    // 2. PERMISSION CHECK
    // Check if the person making the request is the current Lead or an Admin
    const isCurrentLead = project.teamLead.toString() === req.user.id;
    const isAdmin = req.user.role === 'admin';

    if (!isCurrentLead && !isAdmin) {
      return res.status(403).json({ 
        message: "Permission Denied: Only the Team Lead or Admin can update this project." 
      });
    }

    // 3. UPDATE DATA
    // We use the same update logic, but now it's protected by the check above
    const updatedProject = await Project.findByIdAndUpdate(
      req.params.id,
      { 
        projectName, 
        teamLead, 
        team 
      },
      { new: true, runValidators: true }
    )
    .populate("teamLead", "name email")    // Added 'email' here
    .populate("team.member", "name email"); // Added 'email' here

    res.json(updatedProject);
  } catch (error) {
    console.error("Update Error:", error);
    res.status(500).json({ message: "Server Error: " + error.message });
  }
};