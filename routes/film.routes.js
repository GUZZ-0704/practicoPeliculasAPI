
module.exports = app => {
    let router = require("express").Router();
    const controller =
        require("../controllers/film.controller.js");

    router.get('/', controller.listFilm);
    router.get('/:id', controller.getFilmById);
    router.get('/:id/cast', controller.getActorsByFilm);
    router.post('/', controller.createFilm);
    router.put('/:id', controller.updateFilmPut);
    router.patch('/:id', controller.updateFilmPatch);
    router.delete('/:id', controller.deleteFilm);
    router.post('/:id/photo', controller.uploadPicture);
    app.use('/film', router);

};