const NoteForm = ({addNote, newNote, HandleNoteChange}) =>(
    <form onSubmit={addNote}>
        <textarea
        type=""
        value={newNote}
        onChange={HandleNoteChange} placeholder="Do you want write a new post?"/>
        <button type="submit" className="btn-save">save</button>
    </form>
);

export default NoteForm;