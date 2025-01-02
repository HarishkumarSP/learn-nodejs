const fs = require("fs");
const path = require("path");

const filePath = path.join("data", "products.json");
const getProductFromFile = cb => {
	fs.readFile(filePath, (err, fileContent) => {
		if (err) {
			return cb([]);
		}
		cb(JSON.parse(fileContent));
	});
};

class Product {
	constructor(title) {
		this.title = title;
	}
	save() {
		getProductFromFile(products => {
			products.push(this);
			fs.writeFile(filePath, JSON.stringify(products, null, 2), err => {
				console.log(err);
			});
		});
	}
	static fetchAll(cb) {
		getProductFromFile(cb);
	}
}

module.exports = Product;
