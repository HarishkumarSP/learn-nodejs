const { getDb, mongoDb } = require("../utils/database");

class Product {
	constructor(title, price, description, imageUrl, id, userId) {
		this.title = title;
		this.price = price;
		this.description = description;
		this.imageUrl = imageUrl;
		this._id = id ? new mongoDb.ObjectId(id) : null;
		this.userId = userId;
	}
	save() {
		const db = getDb();
		let dbOperation;
		if (this._id) {
			dbOperation = db
				.collection("products")
				.updateOne({ _id: this._id }, { $set: this });
		} else {
			dbOperation = db.collection("products").insertOne(this);
		}
		return dbOperation
			.then(result => {
				console.log(result);
			})
			.catch(err => console.log(err));
	}

	static fetchAll() {
		const db = getDb();
		return db
			.collection("products")
			.find()
			.toArray()
			.then(products => {
				console.log(products);
				return products;
			})
			.catch(err => console.log(err));
	}

	static findById(id) {
		const db = getDb();
		return db
			.collection("products")
			.find({ _id: new mongoDb.ObjectId(id) })
			.next()
			.then(product => {
				console.log(product);
				return product;
			})
			.catch(err => console.log(err));
	}
	static deleteById(id) {
		const db = getDb();
		return db
			.collection("products")
			.deleteOne({ _id: new mongoDb.ObjectId(id) })
			.then(() => {
				console.log("Deleted");
			})
			.catch(err => console.log(err));
	}
}

module.exports = Product;
