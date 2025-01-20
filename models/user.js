const { getDb, mongoDb } = require("../utils/database");

class User {
	constructor(username, email, cart, id) {
		this.name = username;
		this.email = email;
		this.cart = cart; //{items:[]}
		this._id = id;
	}

	save() {
		const db = getDb();
		return db.collection("users").insertOne(this);
	}

	addToCart(product) {
		const db = getDb();
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
				productId: new mongoDb.ObjectId(product._id),
				quantity: newQuantity,
			});
		}
		const updatedCart = {
			items: updatedCartItems,
		};
		return db.collection("users").updateOne(
			{ _id: new mongoDb.ObjectId(this._id) },
			{
				$set: { cart: updatedCart },
			}
		);
	}

	getCart() {
		const db = getDb();
		const productIds = this.cart.items.map(item => item.productId);
		return db
			.collection("products")
			.find({ _id: { $in: productIds } })
			.toArray()
			.then(products => {
				// if we delete product and that product already exits in cart
				// that time we have to delete that product from cart
				if (productIds.length && !products.length) {
					db.collection("users").updateOne(
						{ _id: new mongoDb.ObjectId(this._id) },
						{
							$set: { cart: { items: [] } },
						}
					);
				}
				return products.map(product => {
					return {
						...product,
						quantity: this.cart.items.find(
							item => item.productId.toString() === product._id.toString()
						).quantity,
					};
				});
			})
			.catch(err => console.log(err));
	}

	addOrder() {
		const db = getDb();
		return this.getCart()
			.then(products => {
				const order = {
					items: products,
					user: {
						_id: new mongoDb.ObjectId(this._id),
						name: this.name,
					},
				};
				return db.collection("orders").insertOne(order);
			})
			.then(() => {
				this.cart.items = [];
				return db.collection("users").updateOne(
					{ _id: new mongoDb.ObjectId(this._id) },
					{
						$set: { cart: { items: [] } },
					}
				);
			});
	}

	getOrders() {
		const db = getDb();
		return db
			.collection("orders")
			.find({ "user._id": new mongoDb.ObjectId(this._id) })
			.toArray();
	}

	deleteCartItem(productId) {
		const db = getDb();
		const updatedCartItem = this.cart.items.filter(
			item => item.productId.toString() !== productId.toString()
		);
		return db.collection("users").updateOne(
			{ _id: new mongoDb.ObjectId(this._id) },
			{
				$set: { cart: { items: updatedCartItem } },
			}
		);
	}

	static findById(id) {
		const db = getDb();
		return db
			.collection("users")
			.find({ _id: new mongoDb.ObjectId(id) })
			.next();
	}
}

module.exports = User;
