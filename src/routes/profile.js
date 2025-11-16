const express = require("express");
const profileRouter = express.Router();
const { userauth } = require("../middleware/userauth");
const { validateuserdata } = require("../helpers/validation");

profileRouter.get("/profile/view", userauth, async (req, res) => {
  try {
    const userProfile = req.user;
    res.json(userProfile);
  } catch (err) {
    res.status(400).send("some thing went wrong " + err.message);
  }
});

profileRouter.patch("/profile/edit", userauth, async (req, res) => {
  try {
    if (!validateuserdata(req)) {
      throw new Error("invalid updates request");
    }

    const loggedInUser = req.user;
    console.log(loggedInUser);

    Object.keys(req.body).forEach((key) => {
      loggedInUser[key] = req.body[key];
    });
    console.log(loggedInUser);
    await loggedInUser.save();

    res.json({
      message: `${loggedInUser.firstName} your profile updated successfully`,
      data: loggedInUser,
    });
  } catch (error) {
    res.status(400).send("some thing went wrong :" + error.message);
  }
});

module.exports = { profileRouter };
