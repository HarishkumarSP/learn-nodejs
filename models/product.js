const fs = require("fs");
const path = require("path");
const Cart = require("./cart");

const p = path.join(
	path.dirname(process.mainModule.filename),
	"data",
	"products.json"
);

const getProductsFromFile = cb => {
	fs.readFile(p, (err, fileContent) => {
		if (err) {
			cb([]);
		} else {
			cb(JSON.parse(fileContent));
		}
	});
};

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
		getProductsFromFile((products = []) => {
			if (this.id) {
				const existingProductIndex = products.findIndex(
					prod => prod.id === this.id
				);
				const updatedProducts = [...products];
				updatedProducts[existingProductIndex] = this;
				fs.writeFile(p, JSON.stringify(updatedProducts), err => {
					console.log(err);
				});
			} else {
				this.id = Math.random().toString();
				products.push(this);
				fs.writeFile(p, JSON.stringify(products), err => {
					console.log(err);
				});
			}
		});
	}

	static fetchAll(cb) {
		getProductsFromFile(cb);
	}

	static findById(id, cb) {
		getProductsFromFile(products => {
			const product = products.find(p => p.id === id);
			cb(product);
		});
	}

	static deleteById(id) {
		getProductsFromFile(products => {
			const product = products.find(prod => prod.id === id);
			const updatedProduct = products.filter(prod => prod.id !== id);
			fs.writeFile(p, JSON.stringify(updatedProduct), err => {
				if (!err) {
					Cart.deleteProduct(id, product.price);
				}
			});
		});
	}
};
