import { Sequelize } from "sequelize";

const connection = new Sequelize('blog_insano', 'root', 'ga29052007@#$', {
    host:'localhost',
    dialect: "mysql",
    timezone: '-03:00'
});

export default connection;

