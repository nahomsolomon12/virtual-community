const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

async function initDb() {
  try {
    console.log("Creating events table...");
    await pool.query(`
      CREATE TABLE IF NOT EXISTS events (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log("✓ Events table created or already exists");

    // Insert sample data if table is empty
    const result = await pool.query("SELECT COUNT(*) FROM events;");
    if (result.rows[0].count === "0") {
      console.log("Inserting sample events...");
      await pool.query(`
        INSERT INTO events (name, description) VALUES
        ('Community Meetup', 'Monthly meetup for developers'),
        ('Workshop: React Basics', 'Learn React fundamentals'),
        ('Networking Event', 'Meet fellow community members');
      `);
      console.log("✓ Sample events inserted");
    } else {
      console.log(`✓ Table already contains ${result.rows[0].count} events`);
    }

    await pool.end();
    console.log("Done!");
    process.exit(0);
  } catch (err) {
    console.error("Error initializing database:", err);
    process.exit(1);
  }
}

initDb();
