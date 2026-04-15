import Customer from "../models/Customer.js";

export const updateCustomer = async (req, res) => {
  try {
    const { id } = req.params;
    // findByIdAndUpdate(id, data, options)
    const updated = await Customer.findByIdAndUpdate(id, req.body, { 
      new: true,           // Return the updated doc
      runValidators: true  // Ensure it follows the schema rules
    });

    if (!updated) return res.status(404).json({ message: "Entry not found" });
    
    res.status(200).json(updated);
  } catch (err) {
    res.status(400).json({ message: "Update Rejected", error: err.message });
  }
};