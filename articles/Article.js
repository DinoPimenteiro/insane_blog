import { Sequelize, DataTypes } from "sequelize";
import connection from "../database/database.js";
import Category from "../categories/Category.js";

const Article = connection.define('articles', {
    title: {
        type: DataTypes.STRING,
        allowNull: false
    }, 
    slug: {
        type: DataTypes.STRING,
        allowNull: false
    },
    body: {
        type: DataTypes.TEXT,
        allowNull: false
    }
});

// Expressando um relacionamento no Sequelize
/*Isto após definir o tipo de relação. Se ela é um pra muitos, um pra um ou muitos pra muitos */
Category.hasMany(Article); // Representação de relacionamento UM para MUITOS ("Uma categoria tem vários artigos")
Article.belongsTo(Category); // Expressão de relacionamento UM para UM ("Todo artigo pertence a uma Categoria") 

// Article.sync({})
/*De maneira prática, esses são os relacionamentos com chaves estrangeiras. */

export default Article;