const express = require("express");
const app = express();
app.use(express.json());
const PERSONS = require("./persons");
const INFO = require("./info");
const PORT = process.env.PORT || 3001;
const morgan = require("morgan");
morgan.token("body", (req, res) => JSON.stringify(req.body));
app.use(
  morgan(
    ":method :url :status :response-time ms - :res[content-length] :body - :req[content-length]"
  )
);
const cors = require("cors");
app.use(cors());
app.use(express.static("dist"));

let persons = PERSONS.persons;

const requestTime = (req, res, next) => {
  req.requestTime = new Date();
  next();
};
app.use(requestTime);

app.get("/", (req, res) => {
  res.json();
});

app.get("/api/persons", (req, res) => {
  res.json(persons);
});

app.get("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);
  const person = persons.find((person) => person.id === id);
  if (person) {
    res.json(person);
  } else {
    res.status(404).end();
  }
});

app.delete("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);
  persons = persons.filter((person) => person.id !== id);
  res.status(204).end();
});

const generateId = () => {
  const maxId = persons.length > 0 ? Math.max(...persons.map((p) => p.id)) : 0;
  return maxId + 1;
};

app.post("/api/persons", (req, res) => {
  const body = req.body;
  if (!body.name) {
    return res.status(400).json({
      error: "name missing",
    });
  }
  const person = {
    id: generateId(),
    name: body.name,
    number: body.number,
  };

  let personEntry = persons.filter((p) => p.name === body.name);

  if (person.name.length < 1) {
    return res.status(400).json({
      error: "name missing",
    });
  } else if (person.number.length < 1) {
    return res.status(400).json({
      error: "number missing",
    });
  } else if (personEntry.length > 0) {
    return res.status(400).json({
      error: "name must be unique",
    });
  } else if (
    person.name.length > 0 &&
    person.number.length > 0 &&
    personEntry.length < 1
  ) {
    persons = persons.concat(person);
    res.json(person);
  }
});

app.put("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);
  const body = req.body;
  const person = persons.find((p) => p.name === body.name);
  const updatedPerson = {...person, number: body.number};
  const personsCopy = [...persons];
  persons = personsCopy.map((p) =>
    p.id !== updatedPerson.id ? p : updatedPerson
  );
  res.json(updatedPerson);
});

app.get("/info", (req, res) => {
  const personObj = persons;
  res.send(
    `<div><div>Phonebook has info for ${personObj.length} people</div><div>${req.requestTime}</div></div>`
  );
});

app.post("/info", (req, res) => {
  const body = req.body;
  if (!body.content) {
    return res.status(400).json({
      error: "content missing",
    });
  }
  const INFO = {
    content: body.content,
    date: body.date,
  };
  res.json(INFO);
});

const requestLogger = (req, res, next) => {
  console.log("Method:", req.method);
  console.log("Path:  ", req.path);
  console.log("Body:  ", req.body);
  console.log("---");
  next();
};
app.use(requestLogger);
const unknownEndpoint = (req, res) => {
  res.status(404).send({error: "unknown endpoint"});
};
app.use(unknownEndpoint);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
