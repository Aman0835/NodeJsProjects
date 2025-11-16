const express = require("express");
const connectDB = require("./config/dataBase");
const app = express();

const cookieParser = require("cookie-parser");

app.use(express.json());
app.use(cookieParser());


const { authRouter } = require("./routes/auth");
const { profileRouter } = require("./routes/profile");
const { requestRouter } = require("./routes/request");


app.use("/",authRouter);
app.use("/",profileRouter);
app.use("/",requestRouter);




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
