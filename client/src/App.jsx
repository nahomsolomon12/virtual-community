import { useEffect, useState } from "react";
import "./App.css";

const apiBaseUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";

function App() {
  const [events, setEvents] = useState([]);
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState("");
  const [selectedVenue, setSelectedVenue] = useState("all");

  const venues = [
    ...new Set(events.map((event) => event.location).filter(Boolean)),
  ];

  const filteredEvents =
    selectedVenue === "all"
      ? events
      : events.filter((event) => event.location === selectedVenue);

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
        <div className="eyebrow">React | Express | PostgreSQL/Render</div>
        <h1>2026 | Events of the Year</h1>
        <p className="lede">
          This page fetches data from a PostgreSQL database hosted on Render.
          The server is built with Express and connects to the database using
          the `pg` library. The database is initialized with a simple table and
          some sample data using a script that runs before the server starts.
          You can see all the code in this project to understand how it works!
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
          <span className="count">{filteredEvents.length}</span>
        </div>

        <div className="filter-row">
          <label className="filter-label" htmlFor="venue-filter">
            Filter by venue
          </label>
          <select
            id="venue-filter"
            className="venue-filter"
            value={selectedVenue}
            onChange={(event) => setSelectedVenue(event.target.value)}
          >
            <option value="all">All venues</option>
            {venues.map((venue) => (
              <option key={venue} value={venue}>
                {venue}
              </option>
            ))}
          </select>
        </div>

        {status === "loading" ? (
          <p className="muted">Loading events...</p>
        ) : null}

        {status === "ready" && filteredEvents.length === 0 ? (
          <p className="muted">No rows came back from the query yet.</p>
        ) : null}

        <div className="event-grid">
          {filteredEvents.map((event, index) => (
            <article className="event-card" key={event.id ?? index}>
              <div className="event-header">
                <h3 className="event-title">{event.name}</h3>
                <span className="event-id">#{event.id}</span>
              </div>
              {event.description && (
                <p className="event-description">{event.description}</p>
              )}
              <div className="event-meta">
                {event.location ? (
                  <span className="event-location">{event.location}</span>
                ) : null}
                <span className="event-date">
                  {new Date(
                    event.event_date || event.created_at,
                  ).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </span>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}

export default App;
