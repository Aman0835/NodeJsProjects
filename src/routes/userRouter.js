const express = require("express");

const { userauth } = require("../middleware/userauth");
const { ConnectionRequest } = require("../modles/request");
const User = require("../modles/user");

const userRouter = express.Router();

const safeDataFields = "firstName lastName gender about";

userRouter.get("/user/requests/received", userauth, async (req, res) => {
  try {
    const loggedInUserId = req.user;

    const requests = await ConnectionRequest.find({
      toUserId: loggedInUserId._id,
      status: "interested",
    }).populate("fromUserId", safeDataFields);

    if (requests.length === 0) {
      return res.status(404).json({ message: "no connection requests found" });
    }

    res.status(200).json({
      message: "Connection requests fetched successfully",
      data: requests,
    });
  } catch (error) {
    res.status(500).json({ message: "something went wrong :" + error.message });
  }
});

userRouter.get("/user/requests/sent", userauth, async (req, res) => {
  try {
    const loggedInUserId = req.user;
    const requests = await ConnectionRequest.find({
      fromUserId: loggedInUserId._id,
      status: "interested",
    }).populate("toUserId", safeDataFields);

    res.json({
      message: "Connection requests fetched successfully",
      data: requests,
    });
  } catch (error) {
    res.status(400).json({ message: "something went wrong :" + error.message });
  }
});

userRouter.get("/user/connections", userauth, async (req, res) => {
  try {
    const loggedInUserId = req.user;

    const connections = await ConnectionRequest.find({
      $or: [
        { fromUserId: loggedInUserId._id, status: "accepted" },
        { toUserId: loggedInUserId._id, status: "accepted" },
      ],
    })
      .populate("fromUserId", safeDataFields)
      .populate("toUserId", safeDataFields);

    if (connections.length === 0) {
      return res.status(404).json({ message: "no connections found" });
    }

    const data = connections.map((row) => {
      if (row.fromUserId._id.equals(loggedInUserId._id)) {
        return row.toUserId;
      }
      return row.fromUserId;
    });

    res.status(200).json({
      message: "Connections fetched successfully",
      data,
    });
  } catch (error) {
    res.status(500).json({ message: "something went wrong :" + error.message });
  }
});

userRouter.get("/feed", userauth, async (req, res) => {
  try {
    const loggedInUserId = req.user;

    let limit = parseInt(req.query.limit) || 0;
    limit = limit > 20 ? 20 : limit;
    const page = parseInt(req.query.page) || 1;
    const skip = (page - 1) * limit;

    const connections = await ConnectionRequest.find({
      $or: [
        { fromUserId: loggedInUserId._id },
        { toUserId: loggedInUserId._id },
      ],
    }).select("fromUserId toUserId");

    const hideUserFeed = new Set();

    connections.forEach((req) => {
      hideUserFeed.add(req.fromUserId.toString());
      hideUserFeed.add(req.toUserId.toString());
    });

    const allUsers = await User.find({
      $and: [
        { _id: { $nin: Array.from(hideUserFeed) } },
        { _id: { $ne: loggedInUserId._id } },
      ],
    })
      .select(safeDataFields)
      .skip(skip)
      .limit(limit);

    res.json({ message: "Feed fetched successfully", data: allUsers });
  } catch (error) {
    res.status(400).json({ message: "something went wrong :" + error.message });
  }
});

module.exports = { userRouter };
