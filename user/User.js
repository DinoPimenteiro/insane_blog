import { DataTypes } from "sequelize";
import connection from "../database/database.js";

const User= connection.define('users', {
    email:{
        type: DataTypes.STRING,
        allowNull: false
    },
    password:{
        type: DataTypes.STRING,
        allowNull: false
    },
    
});


export default User;