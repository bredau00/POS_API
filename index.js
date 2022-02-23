require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

// const productRouter = require("./routes/productRouter");
const userRouter = require("./routes/userRouter");

// Setting up MongoDB connection
mongoose.connect(process.env.DB_LINK, { useNewUrlParser: true });
const db = mongoose.connection;
db.on("error", (error) => console.log(error));
db.once("open", () => console.log("Connected to database"));

// Configure the Express app
const app = express();
app.set("port", process.env.PORT || 3000);
app.use(express.json());
app.use(cors());

app.get("/", (req, res, next) => {
    res.send({
      message: "Welcome to the Generic Blog API",
  });
});

app.use("/users", userRouter);
// app.use("/product", productRouter);

app.listen(app.get("port"), (server) => {
    console.info(`Server listen on port ${app.get("port")}`);
    console.info("Press CTRL + C to close the server");
  });
  