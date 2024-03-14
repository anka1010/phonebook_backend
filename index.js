const express = require("express");
const morgan = require("morgan");

morgan.token("body", (req, res) => {
  return req.method === "POST" ? JSON.stringify(req.body) : "";
});
const app = express();

app.use(express.json());
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :body")
);

let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

app.get("/api/persons", (request, response) => {
  response.json(persons);
});

app.get("/api/persons/info", (request, response) => {
  response.send(
    `<p>Phonebook has info for ${persons.length}<br/>${new Date()}</p>`
  );
});

app.get("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  const person = persons.find((person) => person.id === id);

  if (person) {
    response.json(person);
  } else {
    response.status(404).end();
  }
});

app.delete("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  persons = persons.filter((person) => person.id !== id);

  response.status(204).end();
});

app.post("/api/persons", (request, response) => {
  const person = request.body;

  if (!person) return response.status(400).json({ error: `content missing` });
  if (!person.name || !person.number)
    return response.status(400).json({ error: "name or number is missing" });
  if (persons.find((p) => p.name === person.name))
    return response
      .status(400)
      .json({ error: "this person is already in the phonebook" });

  person.id = Math.floor(Math.random() * 1000000);

  persons = persons.concat(person);

  response.json(person);
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
