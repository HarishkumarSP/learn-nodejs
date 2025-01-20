const mongoDb = require("mongodb");

let _db;

const mongoConnect = callback => {
	const mongodbPassword = process.env.MONGODB_PASSWORD;
	mongoDb.MongoClient.connect(
		`mongodb+srv://harishkumarsp1998:${mongodbPassword}@cluster0.l94ca.mongodb.net/shop?retryWrites=true&w=majority&appName=Cluster0`
	)
		.then(client => {
			console.log("Connected!");
			_db = client.db("shop");
			callback();
		})
		.catch(err => console.log(err));
};

const getDb = () => {
	if (_db) {
		return _db;
	}
	throw "No db found";
};

module.exports = { mongoConnect, getDb, mongoDb };
