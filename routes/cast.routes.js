module.exports = app => {
    let router = require("express").Router();
    const controller =
        require("../controllers/cast.controller.js");

    router.get('/', controller.listCasts);
    router.get('/:id', controller.getCastById);
    router.post('/', controller.createCast);
    router.post('/:id', controller.createCastFromFilm);
    router.put('/:id', controller.updateCastPut);
    router.patch('/:id', controller.updateCastPatch);
    router.delete('/:id', controller.deleteCast);
    router.delete('/:id/actor/:actorId', controller.deleteCastFromFilmandActor);
    app.use('/cast', router);

};