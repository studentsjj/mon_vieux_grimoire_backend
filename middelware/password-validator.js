const passwordValidator = require('password-validator');

const schema = new passwordValidator();
schema 
.is().min(15)
.is().max(50)
.has().uppercase()                           
.has().lowercase()                              
.has().digits(2) 
.has().symbols([1], ['&','(' ,')','[',']', '|'])                         
.has().not().spaces()                                        

module.exports =(req, res, next) => {
    const password = req.body.password;
    if (schema.validate(password)) {
        next();
    }else{
        return res.status(400).json({message : 'mot de passe non valide'})
    }
}