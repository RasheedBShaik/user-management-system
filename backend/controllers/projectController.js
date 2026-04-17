import Project from "../models/Project.js";

export const updateProject = async (req, res) => {
  try {
    // 1. Destructure all fields including 'status'
    const { projectName, teamLead, team, status } = req.body;

    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    // 2. Permission Check
    const currentLeadId = project.teamLead?._id?.toString() || project.teamLead?.toString();
    const requesterId = req.user?.id || req.user?._id;
    const isCurrentLead = currentLeadId === requesterId;
    const isAdmin = req.user?.role === 'admin';

    if (!isCurrentLead && !isAdmin) {
      return res.status(403).json({ 
        message: "Permission Denied: Only the Team Lead or Admin can update this project." 
      });
    }

    // 3. Sanitize Data
    const sanitizedTeam = team ? team.map(t => ({
      member: t.member?._id || t.member, 
      module: t.module,
      role: t.role
    })) : project.team;

    const sanitizedLead = teamLead?._id || teamLead || project.teamLead;

    // 4. Perform Update (Status now included)
    const updatedProject = await Project.findByIdAndUpdate(
      req.params.id,
      { 
        projectName: projectName || project.projectName, 
        teamLead: sanitizedLead, 
        team: sanitizedTeam,
        status: status || project.status // CRITICAL FIX HERE
      },
      { new: true, runValidators: true }
    )
    .populate("teamLead", "name email")
    .populate("team.member", "name email");

    res.json(updatedProject);
  } catch (error) {
    console.error("Backend Update Error:", error);
    res.status(500).json({ 
      message: "Internal Server Error", 
      error: error.message 
    });
  }
};