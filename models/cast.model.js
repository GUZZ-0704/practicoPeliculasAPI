module.exports = (sequelize, Sequelize) => {
    const Cast = sequelize.define("cast", {
        filmId: {
            type: Sequelize.INTEGER
        },
        actorId: {
            type: Sequelize.INTEGER
        }
    });
    return Cast;
}
