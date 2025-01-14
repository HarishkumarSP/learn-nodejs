const { SequelizeRoot, sequelize } = require("../utils/database");

const Product = sequelize.define("product", {
	id: {
		type: SequelizeRoot.INTEGER,
		autoIncrement: true,
		allowNull: false,
		primaryKey: true,
	},
	title: SequelizeRoot.STRING,
	price: {
		type: SequelizeRoot.DOUBLE,
		allowNull: false,
	},
	imageUrl: {
		type: SequelizeRoot.STRING,
		allowNull: false,
	},
	description: {
		type: SequelizeRoot.STRING,
		allowNull: false,
	},
});

module.exports = Product;
