const config = require("./utils/config");
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const notesRouter = require("./controllers/notes");
const middleware = require("./utils/middleware");
const logger = require("./utils/logger");
const mongoose = require("mongoose");
const app = express();


mongoose.set("strictQuery", false);

logger.info("connecting to", config.MONGODB_URI);

mongoose.connect(config.MONGODB_URI)
    .then(() => {
        logger.info("connected to MongoDB");
    })
    .catch(error => {
        logger.error("error connecting to MongoDB:", error.message);
    });


app.use(cors());
app.use(express.static("frontend"));
app.use(express.json());

morgan.token("body", request => JSON.stringify(request.body));
app.use(morgan(":method :url :status :res[content-length] - :response-time ms :body"));

app.use('/api/notes', notesRouter)

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);


module.exports = app;
