const pool = require("../config/db");

async function initDb() {
  try {
    console.log("Creating events table...");
    await pool.query(`
      CREATE TABLE IF NOT EXISTS events (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        location VARCHAR(255),
        event_date DATE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log("✓ Events table created or already exists");

    await pool.query(`
      ALTER TABLE events
      ADD COLUMN IF NOT EXISTS location VARCHAR(255);
    `);

    await pool.query(`
      ALTER TABLE events
      ADD COLUMN IF NOT EXISTS event_date DATE;
    `);

    // Insert sample data if table is empty
    const result = await pool.query("SELECT COUNT(*) FROM events;");
    if (result.rows[0].count === "0") {
      console.log("Inserting sample events...");
    } else {
      console.log("Clearing existing events...");
      await pool.query("DELETE FROM events;");
      console.log("Inserting sample events...");
    }

    const venues = [
      "City Tech Hub",
      "Riverside Theater",
      "Downtown Hall",
      "Skyline Loft",
      "Harbor Pavilion",
    ];

    const events = [
      {
        name: "Community Meetup",
        description: "Monthly meetup for developers",
        eventDate: "2026-05-16",
      },
      {
        name: "Workshop: React Basics",
        description: "Learn React fundamentals",
        eventDate: "2026-05-28",
      },
      {
        name: "Networking Event",
        description: "Meet fellow community members",
        eventDate: "2026-06-02",
      },
      {
        name: "Tech Meetup: Web3 & Blockchain",
        description: "Explore the future of decentralized web",
        eventDate: "2026-06-08",
      },
      {
        name: "JavaScript Performance Optimization",
        description: "Tech meetup: Learn advanced JS optimization techniques",
        eventDate: "2026-06-12",
      },
      {
        name: "Music Concert: Indie Vibes",
        description: "Live performance by local indie bands",
        eventDate: "2026-06-21",
      },
      {
        name: "Tech Talk: AI & Machine Learning",
        description: "Tech meetup discussing latest AI trends",
        eventDate: "2026-06-26",
      },
      {
        name: "Electronic Music Festival",
        description: "Day-long music concert featuring electronic artists",
        eventDate: "2026-07-03",
      },
      {
        name: "DevOps & Cloud Infrastructure Meetup",
        description: "Tech meetup: Docker, Kubernetes, and cloud deployment",
        eventDate: "2026-07-09",
      },
      {
        name: "Jazz Night Live",
        description: "Smooth jazz music concert at the community hall",
        eventDate: "2026-07-16",
      },
      {
        name: "Frontend Frameworks Showdown",
        description: "Tech meetup: React vs Vue vs Svelte",
        eventDate: "2026-07-22",
      },
      {
        name: "Rock & Roll Night",
        description: "High-energy music concert with classic rock covers",
        eventDate: "2026-07-30",
      },
      {
        name: "Cybersecurity Workshop Meetup",
        description: "Tech meetup: Best practices for secure coding",
        eventDate: "2026-08-06",
      },
    ];

    const values = events
      .map((event, index) => {
        const location = venues[index % venues.length];

        return `('${event.name.replace(/'/g, "''")}', '${event.description.replace(/'/g, "''")}', '${location.replace(/'/g, "''")}', '${event.eventDate}')`;
      })
      .join(",\n        ");

    await pool.query(`
      INSERT INTO events (name, description, location, event_date) VALUES
        ${values};
    `);
    console.log("✓ Sample events inserted");

    await pool.end();
    console.log("Done!");
    process.exit(0);
  } catch (err) {
    console.error("Error initializing database:", err);
    process.exit(1);
  }
}

initDb();
