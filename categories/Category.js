import { DataTypes } from "sequelize";
import connection from "../database/database.js";

const Category = connection.define('categories', {
    title:{
        type: DataTypes.STRING,
        allowNull: false
    },slug:{
        type: DataTypes.STRING,
        allowNull: false
    }
});


export default Category;