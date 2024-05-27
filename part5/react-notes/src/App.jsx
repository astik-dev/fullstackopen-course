import { useEffect, useState } from "react";
import noteService from "./services/notes";

const newNoteInitialValue = {
    content: "",
    important: false,
};

function App() {
    const [notes, setNotes] = useState([]);
    const [notesLoaded, setNotesLoaded] = useState(false);
    const [newNote, setNewNote] = useState(newNoteInitialValue);

    useEffect(() => {
        noteService
            .getAll()
            .then(initialNotes => {
                setNotes(initialNotes);
                setNotesLoaded(true);
            })
    }, []);

    function createNote() {
        noteService
            .create({...newNote})
            .then(returnedNote => {
                setNotes(notes.concat(returnedNote));
                setNewNote(newNoteInitialValue);
            });
    }

    return (
        <div>

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

            <input
                type="text"
                value={newNote.content}
                onChange={e => setNewNote({...newNote, content: e.target.value})}
            />
            <span>Important:</span>
            <input
                type="checkbox"
                checked={newNote.important}
                onChange={e => setNewNote({...newNote, important: e.target.checked})}
            />
            <button onClick={createNote}>Save</button>

        </div>
    )
}

export default App
