const infoRouter = require("express").Router();
const Info = require("../models/info");

infoRouter.get("/", (req, res) => {
	Info.find({}).then((foundInfo) => {
		res.json(foundInfo);
	});
});

module.exports = infoRouter;
