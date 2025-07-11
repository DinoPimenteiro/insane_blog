/* Feito para organizar as rotas relacionadas ao campo categories
da aplicação. */

import express from 'express';
import Category from '../categories/Category.js';
import Article from './Article.js';
import slugify from 'slugify';
import adminAuth from "../middlewares/adminAuth.js";

const articleController = express.Router()//Como se fosse um app, mas somente pra definir as rotas

articleController.get('/admin/articles', adminAuth,(req, res) => {
    Article.findAll({
        include: [{model: Category}] //Fazendo um join
    }).then(articles => {
        res.render('admin/articles/index', {articles: articles});
    });
});

articleController.get('/admin/articles/new', adminAuth,(req, res) => {
    Category.findAll().then(categories => {
        res.render('admin/articles/new', {categories: categories});
    })
});

articleController.post('/articles/save', (req, res) => {
    var title = req.body.title;
    var body = req.body.body;
    var category = req.body.category;

    Article.create({
        title: title,
        slug: slugify(title),
        body: body,
        categoryId: category
        
    }).then(() => {
        res.redirect('/admin/articles');
    }).catch(error => {
        res.send(error);
    })

});

articleController.post('/articles/delete', (req, res) => {
    var ID = req.body.id;

    if (ID != undefined) {
        if (!isNaN(ID)) {
            Article.destroy({
                where: { id: ID }
            }).then(() => {
                res.redirect('/admin/articles')
            }).catch(error => {
                res.send(error);
            })
        } else {
            res.redirect('/admin/articles')
        }

    } else {
        res.redirect('/admin/articles')
    }
});

articleController.get("/admin/articles/edit/:id", adminAuth,(req, res) => {
    var ID = parseInt(req.params.id);

    if(ID != undefined){
        if(!isNaN(ID)){
            Article.findOne({
                where: {id: ID},
                include: [{model: Category}]
            }).then(article => {
               Category.findAll().then(categories => {
                 res.render("admin/articles/edit", {article: article, categories: categories})
               })
            })
        } else {
            res.redirect("/admin/articles")
        }
    }else{
        res.redirect("/admin/articles")
    }

})

articleController.post("/articles/update/:id", (req, res) => {
    var ID = req.params.id;

    var title = req.body.title;
    var body = req.body.body;
    var category = req.body.category;


    if(ID != undefined){
        if(!isNaN(ID)){
            Article.update(
                {title: title, 
                 slug: slugify(title),
                 body: body,
                 categoryId: category},

                {where : {id: ID}}
            ).then(() => {
                res.redirect("/admin/articles")
            }).catch(err => {
                res.send(err)
            })
        } else {
            res.redirect("/admin/articles")
        }
    } else {
        res.redirect("/admin/article")
    }
})

// SISTEMA DE PAGINAÇÃO;
articleController.get("/articles/page/:num", (req, res) => { 
    var page = req.params.num;
    var offset = 0;

    if(isNaN(page) || page <= 1){
        offset = 0;
        page = 1;
    } else {
        offset = (parseInt(page) - 1 ) * 4;
    }
    //Retorna todos os artigos e a quantidade deles, dois tipos de dados.
    Article.findAndCountAll({
        limit: 4, // Limite de 4 por página
        offset: offset,
        order: [
            ['id', 'DESC']
        ] // Determina a partir de qual artigo será mostrado
    }).then(articles => {
        var next;

        if (offset + 4 >= articles.count){
            next = false;
        } else {
            next = true;
        }

        var result = {
            page: parseInt(page),
            next: next,
            articles: articles
        }

        Category.findAll().then(categories => {
            res.render("admin/articles/page", {categories: categories, result: result})
        });
    }) 
})



export default articleController;
