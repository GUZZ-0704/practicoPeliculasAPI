module.exports = (sequelize, Sequelize) => {
    const Film = sequelize.define("film", {
        name: {
            type: Sequelize.STRING
        },
        synopsis: {
            type: Sequelize.STRING
        },
        release_date: {
            type: Sequelize.DATE
        },
        score: {
            type: Sequelize.INTEGER
        },
        trailer: {
            type: Sequelize.STRING
        },
        directorId: {
            type: Sequelize.INTEGER
        }
    });
    return Film;
}
