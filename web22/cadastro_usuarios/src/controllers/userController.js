const fs = require('fs');
const User = require('../models/User');

const ITEMS_PER_PAGE = 5;

exports.exportUsersCSV = async (req, res) => {
  try {
    // Recupera todos os usuários do banco de dados
    const users = await User.findAll(0, 1000); // Ajuste o limite conforme necessário

    // Cria um stream de escrita para o arquivo CSV
    const csvStream = fs.createWriteStream('./data/usuarios.csv');

    // Transforma os dados dos usuários em formato CSV e escreve no stream
    users.forEach(user => {
      const userData = `${user.nome},${user.cpf},${user.telefone},${user.email},${user.tipo}\n`;
      csvStream.write(userData);
    });

    // Finaliza o stream e envia o arquivo CSV como resposta
    csvStream.end();

    csvStream.on('finish', () => {
      res.download('./data/usuarios.csv', 'usuarios.csv', (err) => {
        if (err) {
          console.log('Erro ao baixar o arquivo CSV:', err);
          res.status(500).send('Erro ao exportar usuários como CSV');
        } else {
          console.log('Arquivo CSV exportado com sucesso');
          // Remove o arquivo CSV após o download
          fs.unlink('./data/usuarios.csv', (unlinkErr) => {
            if (unlinkErr) {
              console.log('Erro ao excluir o arquivo CSV:', unlinkErr);
            }
          });
        }
      });
    });
  } catch (error) {
    console.error('Erro ao exportar usuários como CSV:', error);
    res.status(500).send('Erro ao exportar usuários como CSV');
  }
};

/*exports.getAllUsers = async (req, res) => {
  try {
    const page = req.query.page || 1;
    const offset = (page - 1) * ITEMS_PER_PAGE;
    const users = await User.findAll(offset, ITEMS_PER_PAGE);
    const totalUsers = await User.countAll();
    const totalPages = Math.ceil(totalUsers / ITEMS_PER_PAGE);
    res.render('index', { users, totalPages, currentPage: page });
  } catch (error) {
    console.error('Erro ao recuperar usuários:', error);
    res.status(500).send('Erro ao recuperar usuários');
  }
};*/

exports.getAllUsers = async (req, res) => {
  try {
    const page = req.query.page || 1;
    const offset = (page - 1) * ITEMS_PER_PAGE;
    const users = await User.findAll(offset, ITEMS_PER_PAGE);
    const totalUsers = await User.countAll();
    const totalPages = Math.ceil(totalUsers / ITEMS_PER_PAGE);
    res.render('index', { users, totalPages, currentPage: page });
  } catch (error) {
    console.error('Erro ao recuperar usuários:', error);
    res.status(500).send('Erro ao recuperar usuários');
  }
};


exports.getAllUsersPaginated = async (req, res) => {
  try {
    const page = req.params.page || 1;
    const offset = (page - 1) * ITEMS_PER_PAGE;
    const users = await User.findAll(offset, ITEMS_PER_PAGE);
    const totalUsers = await User.countAll();
    const totalPages = Math.ceil(totalUsers / ITEMS_PER_PAGE);
    res.render('index', { users, totalPages, currentPage: page });
  } catch (error) {
    console.error('Erro ao recuperar usuários paginados:', error);
    res.status(500).send('Erro ao recuperar usuários paginados');
  }
};

exports.getUserById = async (req, res) => {
  try {
    const userId = req.params.id;
    console.log('ID do usuário solicitado:', userId);
    
    const user = await User.findById(userId);
    console.log('Dados do usuário encontrado:', user);
    
    if (!user) {
      res.status(404).send('Usuário não encontrado');
      return;
    }
    res.render('user', { user });
  } catch (error) {
    console.error('Erro ao recuperar usuário por ID:', error);
    res.status(500).send('Erro ao recuperar usuário por ID');
  }
};

/*exports.createUser = async (req, res) => {
  try {
    const { nome, cpf, telefone, email, tipo } = req.body;
    const userId = await User.create(nome, cpf, telefone, email, tipo);
    res.redirect('/');
  } catch (error) {
    console.error('Erro na criação do usuário:', error);
    res.status(500).send('Erro na criaçao do usuário');
  }
};*/

exports.createUser = async (req, res) => {
  try {
    const { nome, cpf, telefone, email, tipo } = req.body; // Remova o `id` daqui
    const userId = await User.create(nome, cpf, telefone, email, tipo); // Não inclua o `id` aqui
    res.redirect('/');
  } catch (error) {
    console.error('Erro na criação do usuário:', error);
    res.status(500).send('Erro na criação do usuário');
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { id, nome, cpf, telefone, email, tipo } = req.body;
    // Verifica se o usuário existe
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).send('Usuário não encontrado, tente novamente com outro usuario !!!');
    }

    // Atualiza o usuário no banco de dados
    let updated;
    if (user.tipo === 'client') {
      // Edita todos os campos para usuários do tipo cliente
      updated = await User.update(id, nome, cpf, telefone, email, tipo);
    } else if (user.tipo === 'admin') {
      // Edita apenas e-mail e telefone para usuários do tipo admin
      updated = await User.update(id, nome, cpf, telefone, email, user.tipo);
    }

    if (!updated) {
      return res.status(500).send('Erro na atualização do usuário');
    }

    // Redireciona para a página de detalhes do usuário
    res.redirect(`/${id}`);
  } catch (error) {
    console.log('=========================================================');
    console.error('Erro na atualização do usuário:', error);
    res.status(500).send('Erro na atualização do usuario usuário');
    console.log('=========================================================');
  }
};

exports.renderEditUserPage = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId);
    res.render('editUser', { user });
  } catch (error) {
    console.log('=========================================================');
    console.error('Erro na página de edição de usuário:', error);
    res.status(500).send('Erro na página de edição de usuário');
    console.log('=========================================================');
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;
    
    // Verifica se o usuário existe
    const user = await User.findById(userId);
    if (!user) {
      console.log('=========================================================');
      return res.status(404).send('Usuário invalido');
      console.log('=========================================================');
    }

    // Exclui o usuário do banco de dados
    const deleted = await User.delete(userId);
    if (!deleted) {
      console.log('=========================================================');
      return res.status(500).send('Erro na exclusao do usuário');
      console.log('=========================================================');
    }

    // Redireciona para a página inicial ou renderiza uma mensagem de sucesso
    res.redirect('/');
  } catch (error) {
    console.log('=========================================================');
    console.error('Erro na exclusão do usuário:', error);
    res.status(500).send('Erro na exclusão do usuário');
    console.log('=========================================================');
  }
};

exports.renderCreateUserPage = (req, res) => {
  res.render('createUser');
};
