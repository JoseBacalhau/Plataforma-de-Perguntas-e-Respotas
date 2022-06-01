const Sequelize = require('sequelize');
const connection = require('./database');

const Pergunta = connection.define('perguntas',{
    titulo:{
        type: Sequelize.STRING,
        allowNull: false // NÃO VOU CONSEGUIR COLOCAR VALORES NULOS NESSE CAMPO
    },
    descricao:{
        type: Sequelize.TEXT, // ESSE CAMPO VAI SER TEXT, POIS VAI RECEBER UMA QUANTIDADE DE CARACTERES MAIOR DO QUE O TITULO
        allowNull: false
    }
});

Pergunta.sync({force: false}).then(()=>{
    console.log("Tabela Criada");
}); // VAI SINCRONIZAR Pergunta COM O BANCO DE DADOS E CASO NÃO TENHA POR EXEMPLO O titulo ELE VAI CRIAR O titulo, E O FALSE É QUE ELE NÃO VAI FORÇAR A CRIAÇÃO DA TABELA CASO ELA JÁ EXISTA

module.exports = Pergunta;