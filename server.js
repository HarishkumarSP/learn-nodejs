const express = require("express");
const bodyParser = require("body-parser");
// const { engine } = require('express-handlebars')

const app = express();

// to use handle bar as a engine
// app.engine('hbs', engine({ extname: 'hbs', }))
// app.set('view engine', 'hbs'y)
app.set("view engine", "ejs");

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const { get404 } = require("./controllers/error");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static("public"));

app.use("/admin", adminRoutes);
app.use(shopRoutes);

app.use(get404);

app.listen(4000, () => {
	console.log("App is running on 4000");
});
