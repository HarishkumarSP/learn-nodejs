const express = require("express");
const bodyParser = require("body-parser");
const feedRoutes = require("./routes/feed");
// require("dotenv").config(); // To read .env files
const app = express();

// app.use(bodyParser.urlencoded({ extended: false })); // x-xxx-form-urlencoded

app.use(bodyParser.json()); // application/json

app.use((req, res, next) => {
	// res.setHeader("Access-Control-Allow-Origin", "https://cdpn.io");
	res.setHeader("Access-Control-Allow-Origin", "*");
	res.setHeader("Access-Control-Allow-Methods", "GET, POST");
	res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization"); // If we dont provide this then we cant use headers while using our api
	next();
});

app.use("/feed", feedRoutes);

app.listen(5500, () => {
	console.log("App is running on 5500");
});
