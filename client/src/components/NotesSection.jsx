import { useEffect, useState } from "react";
import axios from "axios";

export default function NotesSection({ apiBase }) {
  const [notes, setNotes] = useState([]);
  const [text, setText] = useState("");

  const fetchNotes = async () => {
    const { data } = await axios.get(`${apiBase}/notes`);
    setNotes(data);
  };

  const addNote = async (e) => {
    e.preventDefault();
    await axios.post(`${apiBase}/notes`, { text });
    setText("");
    fetchNotes();
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  return (
    <section className="section glass">
      <h2>Diary / Notes</h2>
      <form className="form" onSubmit={addNote}>
        <textarea
          placeholder="Write your daily note..."
          rows={3}
          value={text}
          onChange={(e) => setText(e.target.value)}
          required
        />
        <button type="submit">Save Note</button>
      </form>
      <div className="cards">
        {notes.map((note) => (
          <article key={note._id} className="card">
            <p>{note.text}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
