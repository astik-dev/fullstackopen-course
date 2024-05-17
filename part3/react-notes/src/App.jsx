import { useEffect, useState } from "react";

const baseUrl = '/api/notes';

const newNoteInitialValue = {
    content: "",
    important: false,
};

function App() {
    const [notes, setNotes] = useState([]);
    const [notesLoaded, setNotesLoaded] = useState(false);
    const [newNote, setNewNote] = useState(newNoteInitialValue);

    useEffect(() => {
        fetch(baseUrl)
            .then(res => res.json())
            .then(data => {
                setNotes(data);
                setNotesLoaded(true);
            });
    }, []);

    function saveNewNote() {
        if (newNote.content == "") return;

        fetch(baseUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                ...newNote,
                id: notes.length + 1,
            }),
        })
            .then(res => res.json())
            .then(data => {
                setNotes(notes.concat(data));
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
                            {note.id} - {note.content}
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
            <button onClick={saveNewNote}>Save</button>

        </div>
    )
}

export default App
