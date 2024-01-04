const { Router } = require("express");
const express = require("express");
const router = Router();
const jwt = require("jsonwebtoken");
const zod = require("zod");

const userMiddleware = require("../middleware/user");
const { User, Course, PurchasedCourse } = require("../db/index");

const userDetailsSchema = zod.string().min(3);
router.use(express.json());

// User Routes
router.post("/signup", async (req, res) => {
  let username = req.body.username;
  let password = req.body.password;

  const existingUser = await User.findOne({ username: username });

  if (
    !userDetailsSchema.safeParse(username).sucess &&
    userDetailsSchema.safeParse(password)
  ) {
    return res.status(404).json({
      err: "Check User details again",
    });
  }

  if (!existingUser) {
    await User.create({
      username: username,
      password: password,
    });
    res.status(200).json({
      message: "User added succesfully",
    });
  } else {
    res.status(404).json({
      err: "User already exists",
    });
  }
});

router.post("/signin", async function (req, res) {
  let username = req.body.username;
  let password = req.body.password;

  if (
    !userDetailsSchema.safeParse(username).success &&
    userDetailsSchema.safeParse(password).success
  ) {
    return res.status(404).json({
      err: "Check Admin Details Again",
    });
  }

  let token = jwt.sign({ username: username }, process.env.JWTPass);
  res.status(200).json({
    token: token,
  });
});

router.get("/courses", userMiddleware, async (req, res) => {
  const allCourses = await Course.find({});

  if (!allCourses.length > 0) {
    return res.status(404).json({
      err: "No Courses Found",
    });
  }

  res.status(200).json({ courses: allCourses });
});

router.post("/courses/:courseId", userMiddleware, async (req, res) => {
  const courseToBeAdded = await Course.findById(req.params.courseId);
  const user = await User.findOne({ username: req.userDetails.username }); //Using middleware req body for fetching the username
  const existingUser = await PurchasedCourse.findOne({
    "userDetails.username": req.userDetails.username,
  });

  if (existingUser) {
    let existingCourse = existingUser.Courses.find(
      (course) => course._id == req.params.courseId
    );

    if (existingCourse) {
      return res
        .status(404)
        .json({ message: "Course already exists for user" });
    } else {
      existingUser.Courses.push(courseToBeAdded);
      await existingUser.save();
    }
  } else {
    await PurchasedCourse.create({
      userDetails: user,
      Courses: [courseToBeAdded],
    });
  }
  res.status(200).json({ message: "Course Added Successfully" });
});

router.get("/purchasedCourses", userMiddleware, async (req, res) => {
  const existingUser = await PurchasedCourse.findOne({
    "userDetails.username": req.userDetails.username,
  });

  if (existingUser) {
    existingUser.Courses.length > 0
      ? res.status(200).json(existingUser.Courses)
      : res.status(404).json({
          message: "No course added for this user",
        });
  } else {
    res.status(404).json({
      err: "User does not exist",
    });
  }
});

router.use((err, req, res, next) => {
  res.json({
    err: "Something up with the server",
  });
});

module.exports = router;
