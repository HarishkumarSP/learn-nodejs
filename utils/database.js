const SequelizeRoot = require("sequelize");

const sequelize = new SequelizeRoot.Sequelize(
	"node-complete",
	"root",
	"sql123",
	{
		dialect: "mysql",
		host: "localhost",
	}
);

module.exports = { sequelize, SequelizeRoot };
