const express = require("express");
const bodyParser = require("body-parser");

const app = express();
const db = require("./utils/database");

app.set("view engine", "ejs");

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const { get404 } = require("./controllers/error");

db.execute("SELECT * FROM products")
	.then(result => {
		console.log(result[0], result[1]);
	})
	.catch(err => {
		console.log(err);
	});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static("public"));

app.use("/admin", adminRoutes);
app.use(shopRoutes);

app.use(get404);

app.listen(4000, () => {
	console.log("App is running on 4000");
});
