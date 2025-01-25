const { mongooseSchema, mongooseRoot } = require("../utils/database");

const userSchema = new mongooseSchema({
	name: {
		type: String,
		required: true,
	},
	email: {
		type: String,
		required: true,
	},
	cart: {
		items: [
			{
				productId: {
					type: mongooseSchema.Types.ObjectId,
					required: true,
					ref: "Product",
				},
				quantity: {
					type: Number,
					required: true,
				},
			},
		],
	},
});

function addToCart(product) {
	const cartItemIndex = this.cart.items.findIndex(
		cp => cp.productId.toString() === product._id.toString()
	);
	const updatedCartItems = [...this.cart.items];
	let newQuantity = 1;
	if (cartItemIndex >= 0) {
		newQuantity = this.cart.items[cartItemIndex].quantity + 1;
		updatedCartItems[cartItemIndex].quantity = newQuantity;
	} else {
		updatedCartItems.push({
			productId: product._id,
			quantity: newQuantity,
		});
	}
	const updatedCart = {
		items: updatedCartItems,
	};
	this.cart = updatedCart;
	return this.save();
}

function deleteCartItem(productId) {
	const updatedCartItem = this.cart.items.filter(
		item => item.productId.toString() !== productId.toString()
	);
	this.cart.items = updatedCartItem;
	return this.save();
}

function clearCart() {
	this.cart = { items: [] };
	return this.save();
}

userSchema.methods.addToCart = addToCart;
userSchema.methods.deleteCartItem = deleteCartItem;
userSchema.methods.clearCart = clearCart;

module.exports = mongooseRoot.model("User", userSchema);
