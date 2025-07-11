import express from 'express';
import bodyParser from 'body-parser';
import connection from './database/database.js';
import session from 'express-session';
import adminAuth from './middlewares/adminAuth.js';

import articleController from './articles/articlesController.js';
import categoriesController from './categories/categoriesController.js';
import userController from './user/userController.js';

import Article from './articles/Article.js';
import Category from './categories/Category.js';
import User from './user/User.js';

const app = express();

// Renderização
app.set('view engine', 'ejs');
app.use(express.static('public'));

//BodyParser
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// Sessions
app.use(session({
    secret: "zerovinteum", // O Cookie que armazena o ID da sessão e o máximo de tempo que ele irá durar (tempo que continuará logado)
    cookie: {maxAge: 3000000} //Milisegundos
}))

// DataBase
connection.authenticate().
    then(() => {
        console.log('Conexão realizada com sucesso!')
    }).catch((error) => {
        console.log(error);
    });

// ROTAS
 //O prefixo soma com a url já denominada naquele arquivo. Deixar vazio faz com que só com aquela url seja possível acessa-la
app.use('/', categoriesController);
app.use('/', articleController);
app.use('/', userController);

app.get("/session", (req, res) => { //Criação de sessão 

    //Aqui posso passar os dados que eu quiser criar junto com a sessão;

    req.session.username = "Gabriel"
    req.session.email = "gabrielwilliam234@gmail.com"
    req.session.doenca = "bronquite asmatica"
    req.session.dreams = {
        id: 10,
        mãe: "Fran",
        pai: "José"
    }
    res.send("Sessão gerada!")
})

app.get("/leitura", (req, res) => { //Leitura de sessão
    res.json({
        username: req.session.username,
        email: req.session.email,
        doenca: req.session.doenca,
        dreams: req.session.dreams

    })
})

app.get('/', (req, res) => {
    Article.findAll({
        order: [
            ['id', 'DESC']
        ],
        limit: 4
    }).then(articles => {
        Category.findAll().then(categories => {
            res.render("index", {articles: articles, categories: categories});
        })
        
    })
});

app.get('/:slug', (req, res) => {
    var slug = req.params.slug;

    Article.findOne({
        where: {slug: slug}
    }).then(articles => {
        if (articles != undefined) {
            Category.findAll().then(categories =>{
                res.render("article", {articles: articles, categories: categories});
            })
            
        } else {
            res.redirect("/");
        }
    }).catch(error => {
        res.redirect("/")
    })
})

app.get("/category/:slug", (req, res) => {
    var slug = req.params.slug;

    Category.findOne({
        where: {
            slug: slug
        }, include: [{model: Article}]

    }).then(category => {
        if(category != undefined){

            Category.findAll().then(categories => {
                res.render("index", {articles: category.articles, categories: categories});
            })
            
        } else {
        res.redirect("/");
        }
    }).catch(err => {
        res.send(err)
    })
})

app.listen(8080, () => {
    console.log('SERVIDOR ACESSADO');
});