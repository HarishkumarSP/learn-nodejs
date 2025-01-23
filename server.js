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
	User.findById("678f7eece991411bc4a29b42")
		//  User.findById("678d1cf33418c8f56fb5ed16")
		.then(user => {
			req.user = user;
			next();
		})
		.catch(err => console.log(err));
});

app.use("/admin", adminRoutes);
app.use(shopRoutes);

app.use(get404);

mongoConnect(() => {
	User.findOne().then(user => {
		if (!user) {
			const user = new User({
				name: "Harish",
				email: "harish@gamil.com",
				cart: { items: [] },
			});
			user.save();
		}
	});
	app.listen(4000, () => {
		console.log("App is running on 4000");
	});
});
