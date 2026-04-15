export const updateProject = async (req, res) => {
  try {
    const { projectName, teamLead, team } = req.body;

    // Use findByIdAndUpdate to replace the data
    const updatedProject = await Project.findByIdAndUpdate(
      req.params.id,
      { 
        projectName, 
        teamLead, 
        team // This updates the entire team array
      },
      { new: true, runValidators: true }
    ).populate("teamLead", "name").populate("team.member", "name");

    if (!updatedProject) {
      return res.status(404).json({ message: "Project not found" });
    }

    res.json(updatedProject);
  } catch (error) {
    console.error("Update Error:", error);
    res.status(500).json({ message: "Server Error: " + error.message });
  }
};