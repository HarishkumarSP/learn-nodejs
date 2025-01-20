const express = require("express");
const bodyParser = require("body-parser");
require("dotenv").config(); // To read .env files

const app = express();

app.set("view engine", "ejs");

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const { get404 } = require("./controllers/error");

const { mongoConnect } = require("./utils/database");
const User = require("./models/user");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static("public"));

app.use((req, res, next) => {
	User.findById("678d1cf33418c8f56fb5ed16")
		.then(user => {
			req.user = new User(user.name, user.email, user.cart, user._id);
			next();
		})
		.catch(err => console.log(err));
});

app.use("/admin", adminRoutes);
app.use(shopRoutes);

app.use(get404);

mongoConnect(() => {
	app.listen(4000, () => {
		console.log("App is running on 4000");
	});
});
