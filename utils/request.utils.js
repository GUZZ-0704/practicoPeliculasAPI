module.exports = {
    isRequestValid: (requiredFields, body, res) => {
        for (const field of requiredFields) {
            if (body[field] === null || body[field] === undefined) {
                res.status(400).json({
                    msg: `Falta el campo ${field}`
                });
                return false;
            }
        }
        return true;
    },
    sendError500: (error, res) => {
        console.log('Error', error);
        res.status(500).json({
            msg: 'Error en el servidor'
        });
    },
    
    getVideoId(url) {
        var videoid = url.match(/(?:https?:\/{2})?(?:w{3}\.)?youtu(?:be)?\.(?:com|be)(?:\/watch\?v=|\/)([^\s&]+)/);
        console.log(JSON.stringify(videoid));
        if (videoid != null)
            return videoid[1];
        return null;
    }
}