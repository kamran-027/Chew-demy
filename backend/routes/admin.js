const { Router } = require("express");
const express = require("express");
const router = Router();
const zod = require("zod");
const jwt = require("jsonwebtoken");

const adminMiddleware = require("../middleware/admin");
const { Admin, Course } = require("../db/index");

const courseValSchema = zod.object({
  title: zod.string(),
  description: zod.string(),
  price: zod.number(),
  imageLink: zod.string().url(),
});

const userDetailsSchema = zod.string().min(3);

router.use(express.json());

// Admin Routes
router.post("/signup", async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  const existingAdmin = await Admin.findOne({
    username: username,
  });

  if (
    userDetailsSchema.safeParse(username).success &&
    userDetailsSchema.safeParse(password).success
  ) {
    if (!existingAdmin) {
      await Admin.create({ username: username, password: password });
      return res.status(200).json({
        message: "Admin created succesfully",
      });
    } else {
      return res.status(404).json({ err: "Admin already exists" });
    }
  } else {
    res.status(404).json({ err: "Check Admin details again" });
  }
});

router.post("/signin", async function (req, res) {
  const usernameResp = userDetailsSchema.safeParse(req.body.username);
  const passwordResp = userDetailsSchema.safeParse(req.body.password);

  const existingAdmin = await Admin.findOne({
    username: req.body.username,
    password: req.body.password,
  });

  if (!usernameResp.success && passwordResp.success) {
    return res.status(404).json({
      err: "Check Admin Details Again",
    });
  }

  if (!existingAdmin) {
    return res.status(404).json({
      err: "Admin not found",
    });
  }

  const token = jwt.sign({ username: req.body.username }, process.env.JWTPass);

  res.status(200).json({
    token: token,
  });
});

router.post("/course", adminMiddleware, async (req, res) => {
  const resp = courseValSchema.safeParse(req.body);
  if (!resp.success) {
    return res.status(404).json({ err: resp.error });
  }

  const newCourse = await Course.create(resp.data);
  res.status(200).json({
    message: "Course added succesfully",
    courseId: newCourse._id,
  });
});

router.get("/courses", adminMiddleware, async (req, res) => {
  const allCourses = await Course.find({});

  if (!allCourses.length > 0) {
    return res.status(404).json({
      err: "No Courses Found",
    });
  }

  res.status(200).json({ courses: allCourses });
});

router.use((err, req, res, next) => {
  res.json({
    err: "Something up with the server",
  });
});

module.exports = router;
