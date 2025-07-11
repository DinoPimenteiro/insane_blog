/* Feito para organizar as rotas relacionadas ao campo categories
da aplicação. */
import express from 'express';
import slugify from 'slugify';
import Category from './Category.js';
import adminAuth from "../middlewares/adminAuth.js";

const categoriesController = express.Router();//Como se fosse um app, mas somente pra definir as rotas


categoriesController.get('/admin/categories/new', adminAuth,(req, res) => {
    res.render('admin/categories/new');
});

categoriesController.post('/categories/save', (req, res) => {
    var title = req.body.title;

    if (title && title.trim() !== "") {
        Category.create({
            title: title,
            slug: slugify(title)
        }).then(() => {
            res.redirect("/admin/categories");
        })

    } else {
        res.redirect("/admin/categories/new")
    }
});

categoriesController.get("/admin/categories", adminAuth,(req, res) => {
    Category.findAll()
    .then((categories) => {
        res.render('admin/categories/index',{
            categories: categories //Passando para o frontend
        });
    });
});
categoriesController.post("/categories/delete", (req, res) => {
    var ID = req.body.id;

    if (ID != undefined) {
        if (!isNaN(ID)) {
            Category.destroy({
                where: {
                    id: ID // Deletar a categoria onde, na coluna id, seja igual  a variável id;
                }
            }).then(() => {
                res.redirect('/admin/categories');
            })
        } else {
            res.redirect('/admin/categories');
        }

    } else {
        res.redirect("/admin/categories");
    }
});

categoriesController.get("/admin/categories/edit/:id", adminAuth,(req, res) => {
    var id = parseInt(req.params.id);

    if (isNaN(id)){
        return res.redirect("/admin/categories");
    }

    Category.findByPk(id).then(category => {
        if(category != undefined){
            res.render("admin/categories/edit", {category: category});

        }else{
            res.redirect("/admin/categories");

        }
    }).catch(erro => {
        res.redirect("/admin/categories");
    })
});

categoriesController.post("/categories/update/:id", (req, res) => {
    var id = req.params.id;
    var title = req.body.title;

    Category.update(
        {title: title, slug: slugify(title)}, 
        {where : {id: id}
    }).then(() => {
        res.redirect("/admin/categories");
    }).catch(erro => {
        res.send(erro);
    })
});

export default categoriesController;
