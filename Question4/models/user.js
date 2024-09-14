// models/user.js
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
});

// Hash the password before saving the user model
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare hashed password with the plain-text password
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = this.password.trim(); // Trim the password before hashing
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.comparePassword = async function (enteredPassword) {
  const isMatch = await bcrypt.compare(enteredPassword.trim(), this.password); // Trim entered password
  console.log("Entered Password:", enteredPassword);
  console.log("Stored Hashed Password:", this.password);
  console.log("Password Match:", isMatch);
  return isMatch;
};

const User = mongoose.model("User", userSchema);

module.exports = User;
