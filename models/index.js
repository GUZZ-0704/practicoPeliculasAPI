const dbConfig = require("../database/db.config.js");
const Sequelize = require("sequelize");
const sequelize = new Sequelize(
    dbConfig.DB,
    dbConfig.USER,
    dbConfig.PASSWORD,
    {
        host: dbConfig.HOST,
        port: dbConfig.PORT,
        dialect: "mysql",
    }
);
const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.people = require("./people.model.js")(sequelize, Sequelize);
db.film = require("./film.model.js")(sequelize, Sequelize);
db.cast = require("./cast.model.js")(sequelize, Sequelize);


db.film.belongsToMany(db.people, {
    through: db.cast,
    foreignKey: "filmId",
    otherKey: "actorId",
    as: "actors"
});

db.people.belongsToMany(db.film, {
    through: db.cast,
    foreignKey: "actorId",
    otherKey: "filmId",
    as: "films"
});

db.film.belongsTo(db.people, {
    foreignKey: "directorId",
    as: "director"
});
db.people.hasMany(db.film, {
    as: 'directedFilms',
    foreignKey: 'directorId' 
});

module.exports = db;