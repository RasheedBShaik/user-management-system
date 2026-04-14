const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/User");

mongoose.connect("YOUR_MONGO_URI")
  .then(async () => {

    const hashed = await bcrypt.hash("123456", 10);

    await User.create({
      name: "Admin",
      email: "admin@test.com",
      password: hashed,
      role: "admin"
    });

    console.log("✅ Admin created");
    process.exit();
  })
  .catch(err => {
    console.log(err);
  });