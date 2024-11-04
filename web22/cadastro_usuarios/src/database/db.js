const path = require('path');
const Database = require('better-sqlite3');

const dbPath = path.resolve(__dirname, '../data/usuarios.sqlite3');
const db = new Database(dbPath);

const initDB = () => {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT,
      cpf TEXT,
      telefone TEXT,
      email TEXT,
      tipo TEXT
    )
  `);
};

initDB();

module.exports = db;