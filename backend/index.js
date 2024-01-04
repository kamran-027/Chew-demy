const express = require("express");
const app = express();
const cors = require("cors");

const adminRouter = require("./routes/admin");
const userRouter = require("./routes/user");

// Middleware for parsing request bodies
app.use(express.json());
app.use(cors());
app.use("/admin", adminRouter);
app.use("/user", userRouter);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
