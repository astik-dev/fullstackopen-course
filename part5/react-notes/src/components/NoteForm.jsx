import { useState } from "react";

const newNoteInitialValue = {
    content: "",
    important: false,
};

const NoteForm = ({ createNote }) => {
    
    const [newNote, setNewNote] = useState(newNoteInitialValue);

    return (
        <form
            onSubmit={e => createNote(e, newNote).then(() => setNewNote(newNoteInitialValue))}
        >
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
            <button type="submit">Save</button>
        </form>
    )
};

export default NoteForm;
