const db = require("../models");
const { isRequestValid, sendError500 } = require("../utils/request.utils");

exports.listCasts = async (req, res) => {
    try {
        const casts = await db.cast.findAll();
        res.json(casts);
    } catch (error) {
        sendError500(error, res);
    }
}

exports.getCastById = async (req, res) => {
    const id = req.params.id;
    try {
        const cast = await getCastOr404(id, res);
        if (!cast) {
            return;
        }
        res.json(cast);
    } catch (error) {
        sendError500(error, res);
    }
}

exports.createCast = async (req, res) => {

    const requiredFields = ['filmId', 'actorId'];
    if (!isRequestValid(requiredFields, req.body, res)) {
        return;
    }
    try {
        const cast = {
            filmId: req.body.email,
            actorId: req.body.actorId
        }
        const castCreada = await db.casts.create(cast);

        res.status(201).json(castCreada);
    } catch (error) {
        sendError500(error, res);
    }
}

exports.createCastFromFilm = async (req, res) => {
    const filmId = req.params.id;
    const requiredFields = ['actorId'];
    if (!isRequestValid(requiredFields, req.body, res)) {
        return;
    }
    try {
        const cast = {
            filmId: filmId,
            actorId: req.body.actorId
        }
        const castCreada = await db.cast.create(cast);

        res.status(201).json(castCreada);
    } catch (error) {
        sendError500(error, res);
    }
}

exports.updateCastPatch = async (req, res) => {
    const id = req.params.id;
    try {
        const cast = await getCastOr404(id, res);
        if (!cast) {
            return;
        }
        cast.filmId = req.body.filmId || cast.filmId;
        cast.actorId = req.body.actorId || cast.actorId;

        await cast.save();
        res.json(cast);
    } catch (error) {
        sendError500(error, res);
    }
}
exports.updateCastPut = async (req, res) => {
    const id = req.params.id;
    try {
        const cast = await getCastOr404(id, res);
        if (!cast) {
            return;
        }
        const requiredFields = ['actorId', 'filmId'];
        if (!isRequestValid(requiredFields, req.body, res)) {
            return;
        }
        cast.actorId = req.body.actorId
        cast.filmId = req.body.filmId;

        await cast.save();

        res.json(cast);
    } catch (error) {
        sendError500(error, res);
    }
}
exports.deleteCast = async (req, res) => {
    const id = req.params.id;
    try {
        const cast = await getCastOr404(id, res);
        if (!cast) {
            return;
        }
        await cast.destroy();
        res.json({
            msg: 'Cast eliminada correctamente'
        });
    } catch (error) {
        sendError500(error, res);
    }
}

exports.deleteCastFromFilmandActor = async (req, res) => {
    const filmId = req.params.id;
    const actorId = req.params.actorId;
    try {
        const cast = await db.cast.findOne({
            where: {
                filmId: filmId,
                actorId: actorId
            }
        });
        if (!cast) {
            res.status(404).json({
                msg: 'Cast no encontrado'
            });
            return;
        }
        await cast.destroy();
        res.json({
            msg: 'Cast eliminada correctamente'
        });
    } catch (error) {
        sendError500(error, res);
    }
}
async function getCastOr404(id, res) {
    const cast = await db.cast.findByPk(id);
    if (!cast) {
        res.status(404).json({
            msg: 'Cast no encontrado'
        });
        return;
    }
    return cast;
}