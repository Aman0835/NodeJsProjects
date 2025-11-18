const express = require("express");
// require the exact export name from your model file
const { ConnectionRequest } = require("../modles/request");
const { userauth } = require("../middleware/userauth");
const User = require("../modles/user");

const requestRouter = express.Router();

requestRouter.post(
  "/request/send/:status/:toUserId",
  userauth,
  async (req, res) => {
    try {
      const fromUserId = req.user._id;
      const toUserId = req.params.toUserId;
      const status = req.params.status;

      const allowedStatuses = ["interested", "rejected"];

      if (!allowedStatuses.includes(status)) {
        return res.status(400).json({ message: "Invalid status :" + status });
      }

      const toUser = await User.findById(toUserId);
      if (!toUser) {
        return res.status(404).json({ message: "user not found " });
      }

      const existingRequest = await ConnectionRequest.findOne({
        $or: [
          { fromUserId, toUserId },
          { fromUserId: toUserId, toUserId: fromUserId },
        ],
      });

      if (existingRequest) {
        return res.status(400).json({
          message: "A connection request already exists between these users.",
        });
      }

      const connectionRequest = new ConnectionRequest({
        fromUserId,
        toUserId,
        status,
      });

      const data = await connectionRequest.save();
      res.json({ message: "connection request sent successfully", data });
    } catch (error) {
      res.status(400).send("some thing went wrong :" + error.message);
    }
  }
);

requestRouter.post(
  "/request/review/:status/:requestId",
  userauth,
  async (req, res) => {
    //code to accept or reject a connection request

    try {
      const loggedInUserId = req.user._id;
      const { status, requestId } = req.params;
      const allowedStatuses = ["accepted", "rejected"];

      if (!allowedStatuses.includes(status)) {
        return res.status(400).json({ message: "Invalid status :" + status });
      }

      const connectionRequest = await ConnectionRequest.findOne({
        _id: requestId,
        toUserId: loggedInUserId,
        status: "interested",
      });
      if (!connectionRequest) {
        return res
          .status(404)
          .json({ message: "No pending connection request found." });
      }

      connectionRequest.status = status;
      const data = await connectionRequest.save();
      res.json({ message: `Connection request ${status} successfully`, data });
    } catch (error) {
      res.status(400).send("some thing went wrong :" + error.message);
    }
  }
);

module.exports = { requestRouter };
