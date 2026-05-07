import { useEffect, useState } from "react";
import axios from "axios";

export default function NotesSection() {
  const [notes, setNotes] = useState([]);

  const fetchNotes = async () => {
    const { data } = await axios.get("/content/notes.json");
    setNotes(data.map((item, index) => ({ ...item, _id: `note-${index}`, text: item.content })));
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  return (
    <section className="section glass">
      <h2>Diary / Notes</h2>
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
