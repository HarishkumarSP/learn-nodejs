const express = require("express");
const bodyParser = require("body-parser");
require("dotenv").config(); // To read .env files
const session = require('express-session')
const MongoDBStore = require('connect-mongodb-session')(session)
const app = express();

const mongodbPassword = process.env.MONGODB_PASSWORD;

const store = new MongoDBStore({
	uri: `mongodb+srv://harishkumarsp1998:${mongodbPassword}@cluster0.l94ca.mongodb.net/shop?retryWrites=true&w=majority&appName=Cluster0`,
	collection: 'sessions',
})

app.set("view engine", "ejs");

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const authRoutes = require("./routes/auth");
const { get404 } = require("./controllers/error");

const { mongoConnect } = require("./utils/database");
const User = require("./models/user");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static("public"));
app.use(session({ secret: 'my secret', resave: false, saveUninitialized: false, store: store }));

app.use((req, res, next) => {
	if (req.session.user) {
		User.findById(req.session.user._id)
			.then(user => {
				req.user = user;
				next();
			})
			.catch(err => console.log(err))
	} else {
		next();
	}
});

app.use("/admin", adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);
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
