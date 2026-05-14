const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const depositRoutes = require("./routes/depositRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/deposit", depositRoutes);

mongoose.connect(process.env.MONGO_URI)
.then(() => {
    console.log("MongoDB Connected");
})
.catch((err) => {
    console.log(err);
});

app.get("/", (req, res) => {
    res.send("API Running");
});

app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`);
});