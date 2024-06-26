const { test, after, before, beforeEach, describe } = require("node:test");
const assert = require("node:assert");
const mongoose = require("mongoose");
const supertest = require("supertest");
const bcrypt = require('bcrypt');
const app = require("../app");
const Note = require("../models/note");
const User = require('../models/user');
const helper = require("./test_helper");

const api = supertest(app);

describe("when there is initially some notes saved", () => {

    let token;
    let userId;

    before(async () => {
        await User.deleteMany({});

        const username = "root";
        const password = "sekret";
    
        const passwordHash = await bcrypt.hash(password, 10);
        const user = new User({ username, passwordHash });

        userId = user._id;

        await user.save();

        const result = await api
            .post("/api/login")
            .send({ username, password })
            .expect(200)
            .expect('Content-Type', /application\/json/);

        token = result.body.token;
    });

    beforeEach(async () => {
        await Note.deleteMany({});
        await User.updateOne({ _id: userId }, { $set: { notes: [] } });
        for (const initialNote of helper.initialNotes) {
            await api
                .post("/api/notes")
                .set("Authorization", `Bearer ${token}`)
                .send(initialNote)
                .expect(201)
                .expect("Content-Type", /application\/json/);
        }
    });

    test("notes are returned as json", async () => {
        await api
            .get("/api/notes")
            .expect(200)
            .expect("Content-Type", /application\/json/);
    });

    test("all notes are returned", async () => {
        const response = await api.get("/api/notes");
        assert.strictEqual(response.body.length, helper.initialNotes.length);
    });

    test("a specific note is within the returned notes", async () => {
        const response = await api.get("/api/notes");
        const contents = response.body.map(r => r.content);
        assert(contents.includes("Browser can execute only JavaScript"));
    });

    describe("viewing a specific note", () => {

        test("succeeds with a valid id", async () => {
            const notesAtStart = await helper.notesInDb();
        
            const noteToView = {...notesAtStart[0], user: notesAtStart[0].user.toString()};
        
            const resultNote = await api
                .get(`/api/notes/${noteToView.id}`)
                .expect(200)
                .expect("Content-Type", /application\/json/);

            assert.deepStrictEqual(resultNote.body, noteToView);
        });

        test("fails with statuscode 404 if note does not exist", async () => {

            const validNonexistingId = await helper.nonExistingId();
        
            await api
                .get(`/api/notes/${validNonexistingId}`)
                .expect(404);
        });

        test("fails with statuscode 400 id is invalid", async () => {

            const invalidId = "jsdkljaskldjklasd";
        
            await api
                .get(`/api/notes/${invalidId}`)
                .expect(400);
        });

    });

    describe("addition of a new note", () => {

        test("succeeds with valid data", async () => {

            const newNote = {
                content: "async/await simplifies making async calls",
                important: true,
            };
        
            await api
                .post("/api/notes")
                .set("Authorization", `Bearer ${token}`)
                .send(newNote)
                .expect(201)
                .expect("Content-Type", /application\/json/);
        
            const notesAtEnd = await helper.notesInDb();
        
            assert.strictEqual(notesAtEnd.length, helper.initialNotes.length + 1);
        
            const contents = notesAtEnd.map(r => r.content);
        
            assert(contents.includes("async/await simplifies making async calls"));
        });

        test("fails with status code 400 if data invalid", async () => {
            const newNote = {
                important: true,
            };
        
            await api
                .post("/api/notes")
                .set("Authorization", `Bearer ${token}`)
                .send(newNote)
                .expect(400)
            
            const notesAtEnd = await helper.notesInDb();
        
            assert.strictEqual(notesAtEnd.length, helper.initialNotes.length);
        });

    });

    describe("deletion of a note", () => {

        test("succeeds with status code 204 if id is valid", async () => {
            const notesAtStart = await helper.notesInDb();
            
            const noteToDelete = notesAtStart[0];
        
            await api
                .delete(`/api/notes/${noteToDelete.id}`)
                .set("Authorization", `Bearer ${token}`)
                .expect(204);
        
            const notesAtEnd = await helper.notesInDb();
        
            const contentsAtEnd = notesAtEnd.map(r => r.content);
            
            assert(!contentsAtEnd.includes(noteToDelete.content));
        
            assert.strictEqual(notesAtEnd.length, helper.initialNotes.length - 1);
        });

    });

});

describe('when there is initially one user in db', () => {
    
    beforeEach(async () => {
        await User.deleteMany({});
    
        const passwordHash = await bcrypt.hash('sekret', 10);
        const user = new User({ username: 'root', passwordHash });
    
        await user.save();
    });
  
    test('creation succeeds with a fresh username', async () => {
        const usersAtStart = await helper.usersInDb();
    
        const newUser = {
            username: 'mluukkai',
            name: 'Matti Luukkainen',
            password: 'salainen',
        };
    
        await api
            .post('/api/users')
            .send(newUser)
            .expect(201)
            .expect('Content-Type', /application\/json/);
    
        const usersAtEnd = await helper.usersInDb();
        assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1);
    
        const usernames = usersAtEnd.map(u => u.username);
        assert(usernames.includes(newUser.username));
    });
      
    test('creation fails with proper statuscode and message if username already taken', async () => {
        const usersAtStart = await helper.usersInDb();
    
        const newUser = {
            username: 'root',
            name: 'Superuser',
            password: 'salainen',
        };
    
        const result = await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
            .expect('Content-Type', /application\/json/);
    
        const usersAtEnd = await helper.usersInDb();
        assert(result.body.error.includes('expected `username` to be unique'));
    
        assert.strictEqual(usersAtEnd.length, usersAtStart.length);
    });

});

after(async () => {
  await mongoose.connection.close();
});
