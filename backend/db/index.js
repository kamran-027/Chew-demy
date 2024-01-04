const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

// Connecting to MongoDB
mongoose.connect(process.env.MongoDB_URI);

// Define schemas
const AdminSchema = new mongoose.Schema({
  username: String,
  password: String,
});

const UserSchema = new mongoose.Schema({
  username: String,
  password: String,
});

const CourseSchema = new mongoose.Schema({
  title: String,
  description: String,
  price: Number,
  imageLink: String,
});

const PurchasedCoursesSchema = new mongoose.Schema({
  userDetails: UserSchema,
  Courses: [CourseSchema],
});

const Admin = mongoose.model("Admin", AdminSchema);
const User = mongoose.model("User", UserSchema);
const Course = mongoose.model("Course", CourseSchema);
const PurchasedCourse = mongoose.model(
  "PurchasedCourse",
  PurchasedCoursesSchema
);

module.exports = {
  Admin,
  User,
  Course,
  PurchasedCourse,
};
