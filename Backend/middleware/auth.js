const jwt = require('jsonwebtoken');
// Validation userId en comparaison avec le token
module.exports = (req, res, next) => {
    try { //nous extrayons le token du header Authorization de la requête entrante.
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET'); //decoder le token
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