export const updateProject = async (req, res) => {
  try {
    const { projectName, teamLead, team } = req.body;

    // 1. Fetch the project
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    // 2. SAFE PERMISSION CHECK
    // Ensure we handle cases where teamLead might be a populated object or a simple ID
    const currentLeadId = project.teamLead._id ? project.teamLead._id.toString() : project.teamLead.toString();
    const requesterId = req.user?.id || req.user?._id; // Handle different passport/jwt naming
    
    const isCurrentLead = currentLeadId === requesterId;
    const isAdmin = req.user?.role === 'admin';

    if (!isCurrentLead && !isAdmin) {
      return res.status(403).json({ 
        message: "Permission Denied: Only the Team Lead or Admin can update this project." 
      });
    }

    // 3. CLEAN THE DATA BEFORE UPDATE
    // If teamLead was sent as an object from frontend, convert to ID string
    const sanitizedLead = teamLead?._id || teamLead;

    // 4. UPDATE DATA
    const updatedProject = await Project.findByIdAndUpdate(
      req.params.id,
      { 
        projectName, 
        teamLead: sanitizedLead, 
        team 
      },
      { new: true, runValidators: true }
    )
    .populate("teamLead", "name email")
    .populate("team.member", "name email");

    res.json(updatedProject);
  } catch (error) {
    console.error("Update Error:", error);
    // Returning the actual error message helps you debug in the browser console
    res.status(500).json({ message: "Server Error", details: error.message });
  }
};