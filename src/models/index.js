const Sequelize = require("sequelize");
require("dotenv").config();

const config = {
    username: "junhyuk",
    password: "capstone2022",
    database: "mydb",
    host: "127.0.0.1",
    dialect: "postgres",
};

const db = {};

const sequelize = new Sequelize(config.database, config.username, config.password, config);

db.sequelize = sequelize;
db.Sequelize = Sequelize;
db.User = require("./user")(sequelize, Sequelize);

module.exports = db;
