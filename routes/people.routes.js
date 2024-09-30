module.exports = app => {
    let router = require("express").Router();
    const controller =
        require("../controllers/people.controller.js");

    router.get('/', controller.listPeople);
    router.get('/:id', controller.getPeopleById);
    router.post('/', controller.createPeople);
    router.put('/:id', controller.updatePeoplePut);
    router.patch('/:id', controller.updatePeoplePatch);
    router.delete('/:id', controller.deletePeople);
    router.post('/:id/photo', controller.uploadPicture);
    app.use('/people', router);

};