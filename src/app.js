const e = require("express");
const express = require("express");
const connectDB = require("./config/dataBase");
const app = express();
const { authAdmin } = require("./middleware/adminAuth");
const User = require("./modles/user");
const { validateSingupData } = require("./helpers/validation");
const bcrypt = require("bcrypt");

app.use(express.json());

//api for putting the data in the database
app.post("/signup", async (req, res) => {
  try {
    // validate the data
    validateSingupData(req);

    //hash the password
    const { password, firstName, lastName, email, gender } = req.body;
    const passwordHash = await bcrypt.hash(password, 10);

    const user = new User({
      firstName,
      lastName,
      email,
      password: passwordHash,
      gender,
    });
    const findIdByemail = await User.findOne({ email: user.email });
    if (findIdByemail) {
      throw new Error("email already exists");
    }

    await user.save();
    res.send("User created successfully");
  } catch (err) {
    res.status(400).send("some thing went wrong " + err.message);
  }
});

//login api
app.post("/login", async (req, res) => {
  try {

    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error(" Invalid credentials");
    }
    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch) {
      throw new Error("invalid cridentials");
    }
    res.send("login successful");


  } catch (err) {
    res.status(400).send("some thing went wrong " + err.message);
  }
});

// getting all the data from the database
app.get("/feed", async (req, res) => {
  try {
    const feedData = await User.find({});
    res.json(feedData);
  } catch (error) {
    res.status(400).send("some thing went wrong " + error.message);
  }
});

//get user by id
app.get("/user/find", async (req, res) => {
  try {
    console.log(req.body);
    const { email } = req.body;
    const findIdByemail = await User.findOne({ email });
    const findId = await User.findOne({ _id: findIdByemail._id });
    res.json({ _id: findId._id });
  } catch (error) {
    res.status(400).send("some thing went wrong " + error.message);
  }
});

//update user data
app.patch("/user/update", async (req, res) => {
  try {
    const data = req.body;
    const userId = req.body.userId;

    const updateUser = await User.findByIdAndUpdate(userId, data);
    res.send("user data updated successfully");
  } catch (error) {
    res.status(400).send("some thing went wrong " + error.message);
  }
});

connectDB()
  .then(() => {
    console.log("Database connected successfully");
    app.listen(3000, () => {
      console.log("the server is  runnning on port 3000....");
    });
  })
  .catch((err) => {
    console.error("Database connection has an error");
  });
