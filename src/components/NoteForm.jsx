const NoteForm = ({addNote, newNote, newAuthor, newUrl, HandleNoteChange, HandleAuthorChange, HandleUrlChange}) =>(
    <form onSubmit={addNote}>
        <textarea
        type=""
        value={newNote}
        onChange={HandleNoteChange} placeholder="Do you want write a new post?"/>
        <input type="text" placeholder="author" value={newAuthor}
        onChange={HandleAuthorChange} />
        <input type="text" placeholder="url" value={newUrl}
        onChange={HandleUrlChange} />
        <button type="submit" className="btn-save">save</button>
    </form>
);

export default NoteForm;