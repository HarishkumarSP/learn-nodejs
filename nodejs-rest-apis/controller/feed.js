exports.getPosts = (req, res, next) => {
	res.status(200).json({
		posts: [{ title: "first post" }],
	});
};

exports.createPost = (req, res, next) => {
	res.status(201).json({
		message: "Post created successfully",
		post: {
			id: new Date().toISOString(),
			title: req.body.title,
			content: req.body.content,
		},
	});
};
