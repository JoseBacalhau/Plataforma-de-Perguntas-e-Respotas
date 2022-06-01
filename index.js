const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const connection = require("./database/database");
const Pergunta = require("./database/Pergunta");
const Resposta = require("./database/Resposta");

// Database
connection
    .authenticate()
    .then(() => {
        console.log("Conexão feita com o banco de dados!");
    })
    .catch((msgErro) =>{
        console.log(msgErro);
    })

// ESTOU DIZENDO PARA O EXPRESS USAR O EJS COMO VIEW ENGINE
app.set('view engine', 'ejs');

// ESTOU DIZNEDO PARA O EXPRESS USAR ALGUMA COISA 
app.use(express.static('public'));// NESSE CASO É ONDE MEUS ARQUIVOS ESTATICOS VÃO SER COLOCADOS, NA PASTA public


// BODY PARSER
// ESSE COMANDO VAI SERVIR PARA QUE AS PESSOAS ENVIEM OS DADOS DO FORMULARIO E O BODY-PARSER VAI TARDUZIR ESSES DADOS EM UMA ESTRUTURA JAVASCRIPT
app.use(bodyParser.urlencoded({extended: false}));

// ESSE COMANDO PERMITE QUE A GENTE LEIA DADOS DE FORMULARIOS ENVIADO VIA JSON
app.use(bodyParser.json());
//

// ROTAS
app.get("/",(req,res)=>{
    Pergunta.findAll({raw: true, order:[
        ['id','DESC']// ESTOU DIZENDO QUE QUERO UMA ORDEM DECRESCENTE - SE FOR CRESCENTE VOCÊ UTILIZA O ASC
    ]}).then(perguntas =>{
        res.render("index",{
            perguntas: perguntas
        });
    });// ESSE É O MÉTODO findAll É RESPONSAVEL POR PROCURAR TODAS AS PERGUNTAS NA TABELA, ESSE MÉTOD É EQUIVALENTE = SELECT * FROM perguntas
    // DENTRO DO findAll VOCÊ VAI ABRIR UM JSON E VAI COLOCAR raw: true PARA ELE PROCURAR APENAS AS INFORMAÇÕES CRUAS
    
});

app.get("/perguntar",(req,res)=>{
    res.render("perguntar");
});

// GERALMENTE SE UTILIZA A ROTA POST PARA RECEBER DADOS DO USUÁRIO, EX: UM FORMULÁRIO
app.post("/salvarpergunta",(req,res)=>{
    var titulo = req.body.titulo;
    var descricao = req.body.descricao;
    Pergunta.create({// ESSE create É O METODO RESPONSAVEL POR SALVAR NO BANCO DE DADOS, ESSE create É EQUIVALENTE A = INSERT INTO perguntas ...pergunta.
        titulo: titulo,
        descricao: descricao
    }).then(()=>{ // SE QUISER FAZER ALGUMA COIS APÓS A PERGUNTA SER CRIADA É SÓ UTILIZAR O .then
        res.redirect("/")// Aqui eu estou redirecionando para pagina inicial usando o comando redirect
    });
});

app.get("/pergunta/:id",(req,res)=>{
    var id = req.params.id;
    Pergunta.findOne({// MÉTODO QUE BUSCA NO BANCO DE DADOS UM DADO COM UMA CONDIÇÃO
        where:{id: id} // O where SERVE PARA FAZER CONDIÇÕES
    }).then(pergunta=>{// QUANDO A OPERAÇÃO DE BUSCA FOR CONCLUIDA ELE VAI CHAMAR O then e vai passar a pergunta pra gente
        if(pergunta != undefined){ // SE A PERGUNTA FOR ENCONTRADA
            Resposta.findAll({
                where: {perguntaId: pergunta.id},
                order: [
                    ['id','DESC']
                ]
            }).then(respostas => {
                res.render("pergunta", {
                    pergunta: pergunta,
                    respostas: respostas
                });
            });
        }else{// SE A PERGUNTA NÃO FOR ENCONTRADA
            res.redirect("/");
        }
    });
});



// app.get("/salvarrespota",(req,res)=>{
//     var resposta = req.body.resposta;
//     Resposta.create({
//        resposta: resposta 
//     }).then(()=>{
//         res.redirect("/pergunta")
//     });
// });

// app.get("/responder",(req,res)=>{
//     const corpo = req.body.corpo;
//     const perguntaId = req.body.perguntaId;
//     Resposta.create({
//         corpo: corpo,
//         perguntaId: perguntaId
//     }).then(()=>{
//         res.redirect("/pergunta/"+ perguntaId);// ISSO QUE DIZER A MESMA COISA QUE res.redirect("/pergunta/3"); SE O ID FOR 3, SE FOR 4 ESSE NUMERO 3 VAI MUDAR PARA O NUMERO 4
//     });
// });
app.post("/responder", (req,res) => {
    let corpo = req.body.corpo;
    let perguntaId = req.body.pergunta;

    Resposta.create({
        corpo: corpo,
        perguntaId: perguntaId
    }).then(() => {
        res.redirect("/pergunta/" + perguntaId);
    });
});

app.listen(8080,() => {console.log("App rodando!");});