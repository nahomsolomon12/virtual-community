const express = require("express");
const app = express();
const { Pool } = require("pg");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config(); // Loads your hidden .env variables

app.use(cors());
app.use(express.json());

// 1. Configure the connection pool using the Render URL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false, // Required by Render to allow secure cloud connections
  },
});

const port = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("API is running");
});

// 2. Write regular SQL endpoints
app.get("/events", async (req, res) => {
  try {
    // You use regular SQL commands inside pool.query()
    const result = await pool.query("SELECT * FROM events;");
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
