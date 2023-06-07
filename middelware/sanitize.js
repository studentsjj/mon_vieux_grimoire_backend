const sanitize = require('mongo-sanitize')

module.exports = (req, res, next) => {
    try {
        console.log(req.body)
        req.body = sanitize(req.body);
        console.log(req.body)
        next();
    }catch(error) {
        res.status(500).json({error})
    }
}