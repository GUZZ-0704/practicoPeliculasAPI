module.exports = (sequelize, Sequelize) => {
    const People = sequelize.define("people", {
        name: {
            type: Sequelize.STRING
        },
        birthdate: {
            type: Sequelize.DATE
        }
    });
    return People;
}
