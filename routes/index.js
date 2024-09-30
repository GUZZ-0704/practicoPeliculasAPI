module.exports = app => {
    require("./people.routes")(app);
    require("./film.routes")(app);
    require("./cast.routes")(app);
}