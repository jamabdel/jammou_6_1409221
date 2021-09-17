// in controllers/stuff.js
const Sauce = require('../models/Sauce');
const fs = require('fs');


exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce);
    delete sauceObject._id;
    const sauce = new Sauce({
        ...sauceObject,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });
    sauce.save()
        .then(() => res.status(201).json({
            message: 'Sauce enregistré !'
        }))
        .catch(error => res.status(400).json({
            error
        }));
};


exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({
        _id: req.params.id
    }).then(
        (sauce) => {
            res.status(200).json(sauce);
        }
    ).catch(
        (error) => {
            res.status(404).json({
                error: error
            });
        }
    );
};
exports.modifySauce = (req, res, next) => {
    const sauceObject = req.file ? {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : {
        ...req.body
    };
    Sauce.updateOne({
            _id: req.params.id
        }, {
            ...sauceObject,
            _id: req.params.id
        })
        .then(() => res.status(200).json({
            message: 'Sauce modifié !'
        }))
        .catch(error => res.status(400).json({
            error
        }));
};


exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({ //nous utilisons  la méthode findOne() dans notre modèle sauce pour 
            _id: req.params.id //trouver la sauce unique ayant le même _id que le paramètre de la requête ;
        })
        .then(sauce => {
            const filename = sauce.imageUrl.split('/images/')[1];
            fs.unlink(`images/${filename}`, () => {
                Sauce.deleteOne({
                        _id: req.params.id
                    })
                    .then(() => res.status(200).json({ //cette sauce est ensuite retourné dans une Promise et envoyé au front-end ;
                        message: 'Objet supprimé !'
                    }))
                    .catch(error => res.status(400).json({ //si aucun sauce n'est trouvé ou si une erreur se produit, nous envoyons une erreur 
                        error
                    }));
            });
        })
        .catch(error => res.status(500).json({
            error
        }));
};

exports.getAllSauces = (req, res, next) => {
    Sauce.find().then(
        (sauces) => { //nous utilisons la méthode find() dans notre modèle Mongoose 
            //afin de renvoyer un tableau contenant tous les sauces dans notre base de données.
            // À présent, si vous ajoutez une sauces , 
            //elle doit s'afficher immédiatement sur votre page sauces.
            res.status(200).json(sauces);
        }
    ).catch(
        (error) => {
            res.status(400).json({
                error: error
            });
        }
    );
};

exports.likeSauce = (req, res, next) => {

    let like = req.body.like
    let userId = req.body.userId
    let sauceId = req.params.id

    console.log(req.body);

    if (like === 1) {

        Sauce.updateOne({
                _id: sauceId
            }, {
                $push: {
                    usersLiked: userId
                },
                $inc: {
                    likes: +1
                }
            })

            .then(() => res.status(200).json({
                message: 'Sauce liké !'
            }))
            .catch(error => res.status(400).json({
                error
            }));
    }

    if (like === -1) {

        Sauce.updateOne({
                _id: sauceId
            }, {
                $push: {
                    usersDisliked: userId
                },
                $inc: {
                    dislikes: +1
                }
            })

            .then(() => res.status(200).json({
                message: 'Sauce liké !'
            }))
            .catch(error => res.status(400).json({
                error
            }));
    }

    if (like === 0) {
        Sauce.findOne({
                _id: sauceId
            })
            .then((sauce) => )


    }


}