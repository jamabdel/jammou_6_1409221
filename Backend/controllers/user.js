const bcrypt = require('bcrypt'); //Bcrypt sert à Hash (et donc sécuriser) les passwords

const jwt = require('jsonwebtoken'); //jsonwebtoken genère un token (pour que nos users ne se connectent qu'une fois)

const maskemail = require("maskemail");

const User = require('../models/User'); //on importe le schéma pour nos utilisateurs.

require('dotenv').config();


exports.signup = (req, res, next) => {
    bcrypt.hash(req.body.password, 10) //Hash du mot de passe avec bcrypt on hash le password avec un salt de 10, le salt ajout du texte aléatoire au hash.
        .then(hash => {

            const user = new User({ // Création du nouvel utilisateur
                email: maskemail(req.body.email, {
                    allowed: /@\.-/
                }),
                password: hash
            });
            // Sauvegarde du nouvel utilisateur dans la base de données
            user.save()
                .then(() => res.status(201).json({
                    message: 'Utilisateur créé !'
                }))
                .catch(error => res.status(400).json({
                    error
                }));
        })
        .catch(error => res.status(500).json({
            error
        }));
};
// Création de connexion d'utilisateur enregistré (Post login)
exports.login = (req, res, next) => {
    // Recherche d'un utilisateur dans la base de données
    User.findOne({
            email: maskemail(req.body.email)
        })
        .then(user => {
            // Si on ne trouve pas l'utilisateur
            if (!user) {
                return res.status(401).json({
                    error: 'Utilisateur non trouvé !'
                });
            }
            // On compare le mot de passe de la requete avec celui de la base de données
            bcrypt.compare(req.body.password, user.password) //avec la fonction compare de bcrypt
                .then(valid => {
                    if (!valid) { //si les deux mot de passe ne
                        return res.status(401).json({ // renvoier une erreur 401 Unauthorized
                            error: 'Mot de passe incorrect !'
                        });
                    }

                    res.status(200).json({
                        userId: user._id,
                        // Création d'un token pour sécuriser le compte de l'utilisateur
                        token: jwt.sign({
                                userId: user._id
                            },
                            process.env.SECRET_TOKEN, {
                                expiresIn: '24h'
                            }
                        )
                    });
                })
                .catch(error => res.status(500).json({
                    error
                }));
        })
        .catch(error => res.status(500).json({
            error
        }));
};