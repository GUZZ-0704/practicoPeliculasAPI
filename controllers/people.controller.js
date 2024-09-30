const db = require("../models");
const { isRequestValid, sendError500 } = require("../utils/request.utils");
// Estados del servidor
//200 -> ok
//201 -> creado
//400 -> validaciones
//401 -> no autorizado
//403 -> prohibido
//404 -> no encontrado
//500 -> errores del servidor
exports.listPeople = async (req, res) => {
    try {
        const peoples = await db.people.findAll({
            include: [
                {
                    model: db.film,
                    through: db.cast, 
                    as: 'films',
                },
                {
                    model: db.film,
                    as: 'directedFilms',
                }
            ]
        });
        res.json(peoples);
    } catch (error) {
        sendError500(error, res);
    }
};


exports.getPeopleById = async (req, res) => {
    const id = req.params.id;
    try {
        const people = await getPeopleOr404(id, res);
        if (!people) {
            return;
        }
        res.json(people);
    } catch (error) {
        sendError500(error, res);
    }
}

exports.createPeople = async (req, res) => {

    const requiredFields = ['name', 'birthdate'];
    if (!isRequestValid(requiredFields, req.body, res)) {
        return;
    }
    try {

        const people = {
            name: req.body.name,
            birthdate: req.body.birthdate,
        }
        const peopleCreada = await db.people.create(people);

        res.status(201).json(peopleCreada);
    } catch (error) {
        sendError500(error, res);
    }
}
exports.updatePeoplePatch = async (req, res) => {
    const id = req.params.id;
    try {
        const people = await getPeopleOr404(id, res);
        if (!people) {
            return;
        }
        people.name = req.body.name || people.name;
        people.birthdate = req.body.birthdate || people.birthdate;

        await people.save();
        res.json(people);
    } catch (error) {
        sendError500(error, res);
    }
}
exports.updatePeoplePut = async (req, res) => {
    const id = req.params.id;
    try {
        const people = await getPeopleOr404(id, res);
        if (!people) {
            return;
        }
        const requiredFields = ['name', 'birthdate'];
        if (!isRequestValid(requiredFields, req.body, res)) {
            return;
        }
        people.name = req.body.name;
        people.birthdate = req.body.birthdate;

        await people.save();

        res.json(people);
    } catch (error) {
        sendError500(error, res);
    }
}
exports.deletePeople = async (req, res) => {
    const id = req.params.id;
    try {
        const people = await getPeopleOr404(id, res);
        if (!people) {
            return;
        }
        await people.destroy();
        res.json({
            msg: 'People eliminada correctamente'
        });
    } catch (error) {
        sendError500(error, res);
    }
}
exports.uploadPicture = async (req, res) => {
    const id = req.params.id;
    try {
        const people = await getPeopleOr404(id, res);
        if (!people) {
            return;
        }
        if (!req.files || !req.files.photo) {
            res.status(400).json({
                msg: 'No se ha enviado el archivo'
            });
            return;
        }
        const file = req.files.photo;
        const fileName = people.id + '.jpg';
        file.mv(`public/people/${fileName}`, async (err) => {
            if (err) {
                return res.status(500).send(err);
            }
            await people.save();
            res.json(people);
        });
    } catch (error) {
        sendError500(error, res);
    }
}
async function getPeopleOr404(id, res) {
    const people = await db.people.findByPk(id, {
        include: [
            {
                model: db.film,
                through: db.cast, 
                as: 'films',
            },
            {
                model: db.film,
                as: 'directedFilms',
            }
        ]
    });

    if (!people) {
        res.status(404).json({
            msg: 'People no encontrada'
        });
        return;
    }

    return people;
}
