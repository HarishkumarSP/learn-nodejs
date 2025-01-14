const express = require("express");
const bodyParser = require("body-parser");

const app = express();
const { sequelize } = require("./utils/database");

app.set("view engine", "ejs");

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const { get404 } = require("./controllers/error");

const Product = require("./models/product");
const User = require("./models/user");
const Cart = require("./models/cart");
const CartItem = require("./models/cartItem");
const Order = require("./models/order");
const OrderItem = require("./models/orderItem");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static("public"));

app.use((req, res, next) => {
	User.findByPk(1)
		.then(user => {
			req.user = user;
			next();
		})
		.catch(err => console.log(err));
});

app.use("/admin", adminRoutes);
app.use(shopRoutes);

app.use(get404);

// Database associations(relations)
Product.belongsTo(User, { constraints: true, onDelete: "CASCADE" });
User.hasMany(Product);
User.hasOne(Cart);
Cart.belongsTo(User);
Cart.belongsToMany(Product, { through: CartItem });
Product.belongsToMany(Cart, { through: CartItem });
Order.belongsTo(User);
User.hasMany(Order);
Order.belongsToMany(Product, { through: OrderItem });

sequelize
	.sync()
	.then(() => {
		return User.findByPk(1);
	})
	.then(user => {
		if (!user) {
			return User.create({ name: "Harish", email: "test@gmail.com" });
		}
		return user;
	})
	.then(user => {
		return user.createCart();
	})
	.then(data => {
		app.listen(4000, () => {
			console.log("App is running on 4000");
		});
	})
	.catch(err => {
		console.log(err);
	});
