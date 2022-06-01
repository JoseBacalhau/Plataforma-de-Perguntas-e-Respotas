const Sequelize = require('sequelize');
const connection = new Sequelize('guiaperguntas','root','Josepokemon12318',{ // O nome, o usuario, a senha do banco de dados
    host: 'localhost',// O servidor que está rodando
    dialect: 'mysql' // O tipo de banco de dados que quer se conectar
});

module.exports = connection;// Exportação