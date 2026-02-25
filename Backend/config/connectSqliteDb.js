const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("./blacklist.db", (err) => {
  if (err) {
    console.error("SQLite connection error:", err);
  } else {
    console.log("Connected to SQLite");
  }
});

// Create blacklist table once
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS tokens (
      token TEXT PRIMARY KEY,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);
});

module.exports = db;