const db = require('../database/db');

// Construtor para inicializar as propriedades de um usuário
class User {
  constructor(id, nome, cpf, telefone, email, tipo) {
    this.id = id;
    this.nome = nome;
    this.cpf = cpf;
    this.telefone = telefone;
    this.email = email;
    this.tipo = tipo;
  }

  static findAll(offset = 0, limit = 5) {
  return db.prepare('SELECT * FROM users LIMIT ? OFFSET ?').all(limit, offset);
}

static findById(id) {
  return db.prepare('SELECT * FROM users WHERE id = ?').get(id);
}


  // Método para criar um novo usuário com os dados fornecidos
  //antigo
  /*static create(nome, cpf, telefone, email, tipo) {
    const stmt = db.prepare('INSERT INTO users (nome, cpf, telefone, email, tipo) VALUES (?, ?, ?, ?, ?)');
    const info = stmt.run(nome, cpf, telefone, email, tipo);
    return info.lastInsertRowid;
  }*/

  //antigo
  /*static create(nome, cpf, telefone, email, tipo) {
  const stmt = db.prepare('INSERT INTO users (nome, cpf, telefone, email, tipo) VALUES (?, ?, ?, ?, ?)');
  const info = stmt.run(nome, cpf, telefone, email, tipo);
  return info.lastInsertRowid;
}*/

static create(nome, cpf, telefone, email, tipo) {
  const stmt = db.prepare('INSERT INTO users (nome, cpf, telefone, email, tipo) VALUES (?, ?, ?, ?, ?)');
  const info = stmt.run(nome, cpf, telefone, email, tipo);
  return info.lastInsertRowid;
}


  // Método para atualizar as informações de um usuário existente pelo ID
  static update(id, nome, cpf, telefone, email, tipo) {
    const stmt = db.prepare('UPDATE users SET nome = ?, cpf = ?, telefone = ?, email = ?, tipo = ? WHERE id = ?');
    return stmt.run(nome, cpf, telefone, email, tipo, id);
  }

  // Método para excluir um usuário pelo ID
  static delete(id) {
    const stmt = db.prepare('DELETE FROM users WHERE id = ?');
    return stmt.run(id);
  }

  // Método para contar o número total de usuários no banco de dados
  static countAll() {
    return db.prepare('SELECT COUNT(*) as count FROM users').get().count;
  }
}

module.exports = User;
