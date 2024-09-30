const db = require("../models");
const { isRequestValid, sendError500, getVideoId } = require("../utils/request.utils");
// Estados del servidor
//200 -> ok
//201 -> creado
//400 -> validaciones
//401 -> no autorizado
//403 -> prohibido
//404 -> no encontrado
//500 -> errores del servidor
exports.listFilm = async (req, res) => {
    try {
        const films = await db.film.findAll({
            include: [
                {
                    model: db.people,
                    as: 'director',
                },
                {
                    model: db.people, 
                    through: db.cast, 
                    as: 'actors', 
                }
            ]
        });
        films.sort((a, b) => {
            return b.score - a.score;
        });
        res.json(films);
    } catch (error) {
        sendError500(error, res);
    }
};



exports.getFilmById = async (req, res) => {
    const id = req.params.id;
    try {
        const film = await getFilmOr404(id, res);
        if (!film) {
            return;
        }
        res.json(film);
    } catch (error) {
        sendError500(error, res);
    }
}

exports.createFilm = async (req, res) => {

    const requiredFields = ['name', 'synopsis', 'release_date', 'score', 'trailer', 'directorId'];
    if (!isRequestValid(requiredFields, req.body, res)) {
        return;
    }

    videoId = getVideoId(req.body.trailer);
    if (!videoId) {
        res.status(400).json({
            msg: 'URL del trailer no válida'
        });
        return;
    }

    try {
        
        const film = {
            name: req.body.name,
            synopsis: req.body.synopsis,
            release_date: req.body.release_date,
            score: req.body.score,
            trailer: videoId,
            directorId: req.body.directorId
        }
        const filmCreada = await db.film.create(film);

        res.status(201).json(filmCreada);
    } catch (error) {
        sendError500(error, res);
    }
}
exports.updateFilmPatch = async (req, res) => {
    const id = req.params.id;
    try {
        const film = await getFilmOr404(id, res);
        if (!film) {
            return;
        }

        

        film.name = req.body.name || film.name;
        film.synopsis = req.body.synopsis || film.synopsis;
        film.release_date = req.body.release_date || film.release_date;
        film.score = req.body.score || film.score;
        film.trailer = req.body.trailer || film.trailer;
        film.directorId = req.body.directorId || film.directorId;

        videoId = getVideoId(req.body.trailer);
        if (!videoId) {
            res.status(400).json({
                msg: 'URL del trailer no válida'
            });
            return;
        }
        film.trailer = videoId;

        await film.save();
        res.json(film);
    } catch (error) {
        sendError500(error, res);
    }
}
exports.updateFilmPut = async (req, res) => {
    const id = req.params.id;
    try {
        const film = await getFilmOr404(id, res);
        if (!film) {
            return;
        }
        const requiredFields = ['name', 'synopsis', 'release_date', 'score', 'trailer', 'directorId'];
        if (!isRequestValid(requiredFields, req.body, res)) {
            return;
        }

        videoId = getVideoId(req.body.trailer);
        if (!videoId) {
            videoId = film.trailer;
        }



        film.name = req.body.name;
        film.synopsis = req.body.synopsis;
        film.release_date = req.body.release_date;
        film.score = req.body.score;
        film.trailer = videoId;
        film.directorId = req.body.directorId;


        await film.save();

        res.json(film);
    } catch (error) {
        sendError500(error, res);
    }
}
exports.deleteFilm = async (req, res) => {
    const id = req.params.id;
    try {
        const film = await getFilmOr404(id, res);
        if (!film) {
            return;
        }
        await film.destroy();
        res.json({
            msg: 'Film eliminada correctamente'
        });
    } catch (error) {
        sendError500(error, res);
    }
}
exports.uploadPicture = async (req, res) => {
    const id = req.params.id;
    try {
        const film = await getFilmOr404(id, res);
        if (!film) {
            return;
        }
        if (!req.files) {
            res.status(400).json({
                msg: 'No se ha enviado el archivo'
            });
            return;
        }
        const file = req.files.photo;
        const fileName = film.id + '.jpg';
        file.mv(`public/film/${fileName}`);
        await film.save();
        res.json(film);
    } catch (error) {
        sendError500(error, res);
    }
}

exports.getActorsByFilm = async (req, res) => {
    const id = req.params.id;
    try {
        const film = await getFilmOr404(id, res);
        if (!film) {
            return;
        }
        res.json(film.actors);
    } catch (error) {
        sendError500(error, res);
    }
}

async function getFilmOr404(id, res) {
    const film = await db.film.findByPk(id, {
        include: [
            {
                model: db.people, 
                as: 'director', 
            },
            {
                model: db.people,  
                through: db.cast,  
                as: 'actors',  
            }
        ]
    });

    if (!film) {
        res.status(404).json({
            msg: 'Film no encontrada'
        });
        return;
    }

    return film;
}

