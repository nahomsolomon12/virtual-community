import { useEffect, useState } from "react";
import "./App.css";

const apiBaseUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";

function App() {
  const [events, setEvents] = useState([]);
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    async function loadEvents() {
      try {
        setStatus("loading");
        setError("");

        const response = await fetch(`${apiBaseUrl}/events`, {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`);
        }

        const data = await response.json();
        setEvents(Array.isArray(data) ? data : []);
        setStatus("ready");
      } catch (fetchError) {
        if (fetchError.name === "AbortError") {
          return;
        }

        setError(fetchError.message || "Failed to load events");
        setStatus("error");
      }
    }

    loadEvents();

    return () => controller.abort();
  }, []);

  return (
    <main className="app-shell">
      <section className="hero-panel">
        <div className="eyebrow">Render Postgres</div>
        <h1>Live events from the database</h1>
        <p className="lede">
          This client reads the Express API at {apiBaseUrl} and renders the raw
          rows returned from <code>/events</code>.
        </p>

        <div className="status-row">
          <span className={`status-pill status-${status}`}>{status}</span>
          <span className="muted">Database-backed fetch</span>
        </div>

        {error ? <p className="error-box">{error}</p> : null}
      </section>

      <section className="events-panel">
        <div className="panel-header">
          <h2>Events</h2>
          <span className="count">{events.length}</span>
        </div>

        {status === "loading" ? (
          <p className="muted">Loading events...</p>
        ) : null}

        {status === "ready" && events.length === 0 ? (
          <p className="muted">No rows came back from the query yet.</p>
        ) : null}

        <div className="event-grid">
          {events.map((event, index) => (
            <article className="event-card" key={event.id ?? index}>
              <pre>{JSON.stringify(event, null, 2)}</pre>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}

export default App;
