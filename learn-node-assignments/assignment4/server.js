const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");

const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

const addUser = require("./routes/addUser");
const userRoutes = require("./routes/users");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use(addUser.router);
app.use(userRoutes);

app.use((req, res) => {
	res.status(404).render("404", { pageTitle: "Page Not Found", path: "" });
});

app.listen(4000, () => {
	console.log("App is running on 4000");
});
