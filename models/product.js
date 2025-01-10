const db = require("../utils/database");
const Cart = require("./cart");

module.exports = class Product {
	constructor(id, title, imageUrl, description, price) {
		this.id = id;
		this.title = title;
		this.imageUrl =
			imageUrl ||
			"https://media.istockphoto.com/id/949118068/photo/books.jpg?s=2048x2048&w=is&k=20&c=84QzSRpNc21wzXu5K7t7z0lSUQ93qIFZOmS84JKdvnI=";
		this.description = description;
		this.price = price;
	}

	save() {
		return db.execute(
			"INSERT INTO products(title, price, description, imageUrl) VALUES(?, ?, ?, ?)",
			[this.title, this.price, this.description, this.imageUrl]
		);
	}

	static fetchAll(cb) {
		return db.execute("SELECT * FROM products");
	}

	static findById(id) {
		return db.execute("SELECT * FROM products WHERE products.id=?", [id]);
	}

	static deleteById(id) {}
};
