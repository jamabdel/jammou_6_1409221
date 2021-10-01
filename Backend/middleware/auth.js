const jwt = require('jsonwebtoken');//Jsonwebtoken nous sert à générer et décripter des tokens.

require('dotenv').config();
//Middleware d'authentification
// Validation userId en comparaison avec le token
module.exports = (req, res, next) => {
    try { //nous extrayons le token du header Authorization de la requête entrante.
        const token = req.headers.authorization.split(' ')[1];//on split le header de la requête pour n'avoir que le token.
        const decodedToken = jwt.verify(token, process.env.SECRET_TOKEN); //decoder le token
        const userId = decodedToken.userId; //on requper l'id du user
        if (req.body.userId && req.body.userId !== userId) {
            throw 'Invalid user ID';
        } else {
            next();
        }
    } catch {
        res.status(401).json({
            error: new Error('Invalid request!')
        });
    }
};