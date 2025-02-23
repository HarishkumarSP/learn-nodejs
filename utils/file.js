const { unlink } = require("fs");

const deleteFile = filePath => {
	unlink(filePath, err => {
		if (err) {
			throw err;
		}
	});
};
module.exports = { deleteFile };
