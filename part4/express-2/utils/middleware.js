const jwt = require("jsonwebtoken");
const logger = require("./logger");
const User = require("../models/user");


const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: "unknown endpoint" });
};

const errorHandler = (error, request, response, next) => {
    logger.error(error.message);

    if (error.name == "CastError") {
        return response.status(400).send({ error: "malformatted id" });
    } else if (error.name == "ValidationError") {
        return response.status(400).json({ error: error.message });
    } else if (error.name === "MongoServerError" && error.message.includes("E11000 duplicate key error")) {
        return response.status(400).json({ error: "expected `username` to be unique" });
    } else if (error.name == "JsonWebTokenError") {
        return response.status(401).json({ error: "token invalid" });
    }

    next(error);
};

const userExtractor = async (request, response, next) => {
    const authorization = request.get("authorization");
    const token = authorization && authorization.startsWith("Bearer ")
        ? authorization.replace("Bearer ", "")
        : null;

    const decodedToken = jwt.verify(token, process.env.SECRET);
    if (!decodedToken.id) {
        return response.status(401).json({ error: "token invalid" });
    }
    request.user = await User.findById(decodedToken.id);

    next();
};

const checkNoteOwnership = async (request, response, next) => {
    
    const userNotes = request.user.notes.map(n => n.toString());
    const userIsOwner = userNotes.some(id => id === request.params.id);

    if (!userIsOwner) {
        return response.status(403).json({
            error: "access to this note is not permitted"
        });
    }

    next();
};


module.exports = {
    unknownEndpoint,
    errorHandler,
    userExtractor,
    checkNoteOwnership,
}
