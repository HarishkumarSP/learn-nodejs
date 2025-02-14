const mongooseRoot = require("mongoose");
const mongooseSchema = mongooseRoot.Schema;

const mongoConnect = callback => {
	const mongodbPassword = process.env.MONGODB_PASSWORD;
	mongooseRoot
		.connect(
			`mongodb+srv://harishkumarsp1998:${mongodbPassword}@cluster0.l94ca.mongodb.net/shop?retryWrites=true&w=majority&appName=Cluster0`
		)
		.then(() => {
			console.log("Connected!");
			callback();
		})
		.catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

module.exports = { mongoConnect, mongooseRoot, mongooseSchema };
