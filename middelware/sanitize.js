const sanitize = require('mongo-sanitize')

module.exports = (req, res, next) => {
    try {
        req.body = sanitize(req.body);
        next();
    }catch(error) {
        res.status(500).json({error})
    }
}