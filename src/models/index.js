const Sequelize = require("sequelize");
require("dotenv").config();

const config = {
    username: process.env.POSTGRESQL_USERNAME,
    password: process.env.POSTGRESQL_PASSWORD,
    database: process.env.POSTGRESQL_DATABASE,
    host: process.env.POSTGRESQL_HOST,
    dialect: "postgres",
};

const db = {};

const sequelize = new Sequelize(config.database, config.username, config.password, config);

db.sequelize = sequelize;
db.Sequelize = Sequelize;
db.User = require("./user")(sequelize, Sequelize);
db.Clip = require("./clip")(sequelize, Sequelize);
db.Record = require("./record")(sequelize, Sequelize);

module.exports = db;
