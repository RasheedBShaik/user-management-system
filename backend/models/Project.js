import mongoose from "mongoose";

const projectSchema = new mongoose.Schema({
  projectName: { 
    type: String, 
    required: [true, "Project name is required"],
    trim: true 
  },
  teamLead: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: false // Changed to false to allow unassigned projects
  },
  team: [{
    member: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User' 
    },
    role: { 
      type: String, 
      // Added 'Developer' to match your frontend default
      enum: ['Frontend Developer', 'Backend Developer', 'Developer', 'Designer', 'Intern', 'QA Tester', 'Dev'],
      default: 'Developer'
    },
    module: { 
      type: String, 
      default: "General" // Made default so it doesn't crash if empty
    }
  }],
  status: { 
    type: String, 
    // Synced with your Modal dropdown options
    enum: ['Active', 'Pending', 'Closed', 'In Progress'],
    default: 'Active' 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

export default mongoose.model("Project", projectSchema);