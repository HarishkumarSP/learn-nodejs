const express = require("express");
const bodyParser = require("body-parser");
// const { engine } = require('express-handlebars')

const app = express();

// to use handle bar as a engine
// app.engine('hbs', engine({ extname: 'hbs', }))
// app.set('view engine', 'hbs'y)
app.set("view engine", "ejs");

const adminData = require("./routes/admin");
const shopRoutes = require("./routes/shop");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static("public"));

app.use("/admin", adminData.router);
app.use(shopRoutes);

app.use((req, res) => {
	res.status(404).render("404", { pageTitle: "Page Not Found", path: "" });
});

app.listen(4000, () => {
	console.log("App is running on 4000");
});
