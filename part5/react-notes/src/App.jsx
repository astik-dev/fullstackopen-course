import { useEffect, useRef, useState } from "react";
import noteService from "./services/notes";
import LoginForm from "./components/LoginForm";
import loginService from "./services/login";
import Notification from "./components/Notification";
import NoteForm from "./components/NoteForm";
import Togglable from "./components/Togglable";

function App() {
    const [notes, setNotes] = useState([]);
    const [notesLoaded, setNotesLoaded] = useState(false);
    const [errorMessage, setErrorMessage] = useState(null);
    const [user, setUser] = useState(null);

    const noteFormRef = useRef();

    useEffect(() => {
        noteService
            .getAll()
            .then(initialNotes => {
                setNotes(initialNotes);
                setNotesLoaded(true);
            })
    }, []);

    useEffect(() => {
        const loggedUserJSON = window.localStorage.getItem("loggedNoteappUser");
        if (loggedUserJSON) {
            const loggedUser = JSON.parse(loggedUserJSON);
            setUser(loggedUser);
            noteService.setToken(loggedUser.token);
        }
    }, []);

    function createNote(event, newNote) {
        event.preventDefault();
        noteFormRef.current.toggleVisibility();
        return noteService
            .create({...newNote})
            .then(returnedNote => {
                setNotes(notes.concat(returnedNote));
            });
    }

    async function handleLogin(event, username, password) {
        event.preventDefault();
        
        try {
            const user = await loginService.login({username, password});
            setUser(user);
            window.localStorage.setItem(
                "loggedNoteappUser", JSON.stringify(user)
            );
            noteService.setToken(user.token);
        } catch (exception) {
            setErrorMessage("Wrong credentials");
            setTimeout(() => {
                setErrorMessage(null);
            }, 5000);
        }
    }

    function handleLogout() {
        window.localStorage.removeItem("loggedNoteappUser");
        setUser(null);
        noteService.setToken(null);
    }

    return (
        <div>

            <Notification message={errorMessage} />

            {user == null
                ?
                <Togglable buttonLabel="login">
                    <LoginForm {...{handleLogin}} />
                </Togglable>
                :
                <div>
                    <p>
                        {user.username} logged-in
                        <button
                            onClick={handleLogout}
                        >
                            Log out
                        </button>
                    </p>
                    <Togglable buttonLabel="new note" ref={noteFormRef}>
                        <NoteForm {...{createNote}} />
                    </Togglable>
                </div>
            }

            {notesLoaded
                ?
                <ul>
                    {notes.map(note =>
                        <li key={note.id}>
                            {note.content}
                        </li>
                    )}
                </ul>
                :
                <p>Loading...</p>
            }

        </div>
    )
}

export default App
