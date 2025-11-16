const mongoose = require("mongoose");

const ConnectionRequestSchema = new mongoose.Schema(
  {
    fromUserId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    toUserId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    status: {
      type: String,
      enum: {
        values: ["interested", "accepeted", "rejected", "ignored"],
        message: `{VALUE} is not supported`,
      },
    },
  },
  {
    timestamps: true,
  }
);

ConnectionRequestSchema.index({ fromUserId: 1, toUserId: 1 });

ConnectionRequestSchema.pre("save", function (next) {
  if (ConnectionRequest.fromUserId.equals(ConnectionRequest.toUserId)) {
    throw new Error("you can not send request to yourself");
  }
  next();//allways call next to proceed
});

const ConnectionRequest = mongoose.model(
  "ConnectionRequestModel",
  ConnectionRequestSchema
);

module.exports = { ConnectionRequest };
