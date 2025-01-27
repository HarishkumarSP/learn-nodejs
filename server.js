const express = require("express");
const bodyParser = require("body-parser");
require("dotenv").config(); // To read .env files
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const csrf = require("csurf")();
const flash = require("connect-flash")();

const app = express();

const mongodbPassword = process.env.MONGODB_PASSWORD;

const store = new MongoDBStore({
	uri: `mongodb+srv://harishkumarsp1998:${mongodbPassword}@cluster0.l94ca.mongodb.net/shop?retryWrites=true&w=majority&appName=Cluster0`,
	collection: "sessions",
});

app.set("view engine", "ejs");

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const authRoutes = require("./routes/auth");
const { get404 } = require("./controllers/error");

const { mongoConnect } = require("./utils/database");
const User = require("./models/user");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static("public"));
app.use(
	session({
		secret: "my secret",
		resave: false,
		saveUninitialized: false,
		store: store,
	})
);

app.use(csrf);
app.use(flash);

app.use((req, res, next) => {
	if (req.session.user) {
		User.findById(req.session.user._id)
			.then(user => {
				req.user = user;
				next();
			})
			.catch(err => console.log(err));
	} else {
		next();
	}
});

// setting up common data in res.locals to be accessible on every route
app.use((req, res, next) => {
	res.locals.isAuthenticated = req.session.isLoggedIn;
	res.locals.csrfToken = req.csrfToken();
	next();
});

app.use("/admin", adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);
app.use(get404);

mongoConnect(() => {
	app.listen(4000, () => {
		console.log("App is running on 4000");
	});
});
