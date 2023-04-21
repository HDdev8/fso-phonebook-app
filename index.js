require("dotenv").config();
const assert = require("assert");
const URL = process.env.MONGODB_URI;
const PORT = process.env.PORT;
const mongoose = require("mongoose");
mongoose.set("strictQuery", false);
mongoose.connect(URL);
const Person = require("./models/Person");
const cors = require("cors");
const express = require("express");
const app = express();
const morgan = require("morgan");
morgan.token("body", (req, res) => JSON.stringify(req.body));

const requestLogger = (req, res, next) => {
	console.log("Method:", req.method);
	console.log("Path:  ", req.path);
	console.log("Body:  ", req.body);
	console.log("---");
	next();
};

app.use(cors());
app.use(express.static("dist"));
app.use(express.json());
app.use(morgan(":method :url :status :response-time ms - :res[content-length] :body - :req[content-length]"));
app.use(requestLogger);

const requestTime = (req, res, next) => {
	req.requestTime = new Date();
	next();
};
app.use(requestTime);

app.get("/", (req, res) => {
	res.json();
});

app.get("/info", (req, res) => {
	Person.find({}).then((foundPersons) => {
		res.send(`<div><div>Phonebook has info for ${foundPersons.length} people</div><div>${req.requestTime}</div></div>`);
	});
});

app.get("/api/persons", (req, res) => {
	Person.find({}).then((foundPersons) => {
		res.json(foundPersons);
	});
});

app.get("/api/persons/:id", (req, res) => {
	Person.findById(req.params.id)
		.then((person) => {
			if (person) {
				res.json(person);
			} else {
				res.status(404).end();
			}
		})
		.catch((error) => next(error));
});

app.post("/api/persons", (req, res, next) => {
	const body = req.body;
	let err;

	if (body.name === undefined || body.number === undefined) {
		return res.status(400).json({error: "name or number missing"});
	}
	const person = new Person({
		name: body.name,
		number: body.number,
	});

	person
		.save()
		.then((savedPerson) => {
			res.json(savedPerson);
		})
		.catch((error) => next(error));
});

app.put("/api/persons/:id", (req, res, next) => {
	const {name, number} = req.body;

	Person.findByIdAndUpdate(req.params.id, {name, number}, {new: true, runValidators: true, context: "query"})
		.then((updatedPerson) => {
			res.json(updatedPerson);
		})
		.catch((error) => next(error));
});

app.delete("/api/persons/:id", (req, res, next) => {
	Person.findByIdAndRemove(req.params.id)
		.then((foundPerson) => {
			res.status(204).end();
		})
		.catch((error) => next(error));
});

const unknownEndpoint = (req, res) => {
	res.status(404).send({error: "unknown endpoint"});
};

app.use(unknownEndpoint);

const errorHandler = (error, req, res, next) => {
	console.error(error.message);
	if (error.name === "CastError") {
		return res.status(400).send({error: "malformatted id"});
	} else if (error.name === "ValidationError") {
		return res.status(400).json({error: error.message});
	}
	next(error);
};

app.use(errorHandler);

app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});
