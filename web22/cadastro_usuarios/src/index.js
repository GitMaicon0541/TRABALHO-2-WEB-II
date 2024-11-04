const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const userRoutes = require('./routes/userRoutes');
const methodOverride = require('method-override');

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

app.use(methodOverride('_method'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/', userRoutes);


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log('=========================================================');
  console.log(`Servidor rodando na porta... ${PORT}`);
  console.log('=========================================================');
});

// cd Trabalho\ 1\ web\ 2/cadastro_usuarios/src
// sudo npm init -y

//===========================================================
/* Caso apareca essa msg "1 moderate severity vulnerability"
usar o comando "sudo npm audit fix" */
//===========================================================

// sudo npm i express
// sudo npm i
// sudo npm install better-sqlite3
// sudo npm run start -- Projeto startado na porta 3000


