const pool = require("../config/db");

async function getEvents(req, res) {
  try {
    const result = await pool.query("SELECT * FROM events;");
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
}

module.exports = {
  getEvents,
};
