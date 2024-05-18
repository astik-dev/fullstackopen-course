require('dotenv').config();
const express = require("express");
const morgan = require("morgan");
const cors = require('cors');
const Note = require('./models/note');


const app = express();

const requestLogger = (request, response, next) => {
    console.log('Method:', request.method);
    console.log('Path:  ', request.path);
    console.log('Body:  ', request.body);
    console.log('---');
    next();
}


app.use(express.static('frontend'));
app.use(cors());
app.use(express.json());
//app.use(requestLogger);

morgan.token("body", request => JSON.stringify(request.body));
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));



app.get("/", (request, response) => {
    response.send("<h1>Hello World!</h1>");
});

app.get("/api/notes", (request, response) => {
    Note.find({}).then(notes => {
        response.json(notes);
    });
});

app.get("/api/notes/:id", (request, response) => {
    Note.findById(request.params.id)
        .then(note => {
            if (note) {
                response.json(note);
            } else {
                response.status(404).end();
            }
        })
        .catch(error => {
            console.log(error);
            response.status(400).send({ error: 'malformatted id' });
        });
});

app.post("/api/notes", (request, response) => {
    
    const body = request.body;

    if (!body.content) {
        return response.status(400).json({
            error: "content missing"
        });
    } 

    const note = new Note({
        content: body.content,
        important: Boolean(body.important) || false,
    });

    note.save().then(savedNote => {
        response.json(savedNote);
    });
});

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' });
}

app.use(unknownEndpoint);

const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
