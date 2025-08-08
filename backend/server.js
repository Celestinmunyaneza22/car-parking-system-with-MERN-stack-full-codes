const express = require("express");
const dotenv = require("dotenv").config();
const bodyParser = require("body-parser");
const cors = require("cors");
const connectDB = require("./config/db");

const PORT = process.env.PORT || 5000;

connectDB();

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/cars", require("./routes/carRoutes"));

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});