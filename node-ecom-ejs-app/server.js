const express = require("express");
const bodyParser = require("body-parser");
require("dotenv").config(); // To read .env files
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const csrf = require("csurf")();
const flash = require("connect-flash")();
const multer = require("multer");

const app = express();

const mongodbUserName = process.env.MONGODB_USERNAME;
const mongodbPassword = process.env.MONGODB_PASSWORD;

const store = new MongoDBStore({
	uri: `mongodb+srv://${mongodbUserName}:${mongodbPassword}@cluster0.l94ca.mongodb.net/shop?retryWrites=true&w=majority&appName=Cluster0`,
	collection: "sessions",
});

const fileStorage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, "images");
	},
	filename: (req, file, cb) => {
		const fileName = Math.random() + "-" + file.originalname;
		console.log({ fileName });
		cb(null, fileName);
	},
});
const fileFilter = (req, file, cb) => {
	if (file.mimetype === "image/png" || file.mimetype === "image/jpg" || file.mimetype === "image/jpeg") {
		cb(null, true);
	} else {
		cb(null, false);
	}
};

app.set("view engine", "ejs");

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const authRoutes = require("./routes/auth");
const { get404, get500 } = require("./controllers/error");

const { mongoConnect } = require("./utils/database");
const User = require("./models/user");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(multer({ storage: fileStorage, fileFilter }).single("image"));
app.use(express.static("public"));
app.use("/images", express.static("images"));
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

// setting up common data in res.locals to be accessible on every route
app.use((req, res, next) => {
	res.locals.isAuthenticated = req.session.isLoggedIn;
	res.locals.csrfToken = req.csrfToken();
	next();
});

app.use((req, res, next) => {
	if (!req.session.user) {
		return next();
	}
	User.findById(req.session.user._id)
		.then((user) => {
			if (!user) {
				return next();
			}
			req.user = user;
			next();
		})
		.catch((err) => {
			next(new Error(err));
		});
});

app.use("/admin", adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);
app.get("/500", get500);
app.use(get404);

app.use((error, req, res, next) => {
	console.log({ error });
	res.status(500).render("500", {
		pageTitle: "Error",
		path: "/500",
		isAuthenticated: req.session.isLoggedIn,
	});
});

mongoConnect(() => {
	app.listen(5000, () => {
		console.log("App is running on 5000");
	});
});
