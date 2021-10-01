// in controllers/stuff.js
const Sauce = require('../models/Sauce');
const fs = require('fs');

// **************Création d'une nouvelle sauce ********(routes Post)**************************//
exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce);
    delete sauceObject._id;
    const sauce = new Sauce({
        ...sauceObject,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
        likes: 0, //On met sur une valeur de base nos tableaux et nos likes/dislikes
        dislikes: 0,
        usersLiked: [' '],
        usersdisLiked: [' '],
    });
    // Enregistrement de l'objet sauce dans la base de données
    sauce.save()
        .then(() => res.status(201).json({
            message: 'Sauce enregistré !'
        }))
        .catch(error => res.status(400).json({
            error
        }));
}

// Lecture d'une sauce avec son ID ***********************routes Get***************************//
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

//********************************************* */ routes put/*************************

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

//**********************************routes delete***********************************************//

exports.deleteSauce = (req, res, next) => { // supprime une sauce
    Sauce.findOne({ //nous utilisons  la méthode findOne() dans notre modèle sauce pour 
            _id: req.params.id //trouver la sauce unique ayant le même _id que le paramètre de la requête ;
        })
        .then(sauce => {
            const filename = sauce.imageUrl.split('/images/')[1]; //on split l'Url de notre image pour obtenir le nom fichier seulement
            fs.unlink(`images/${filename}`, () => { //via ce nom, on supprime l'image de la sauce en question.
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

// ***********************routes Get***************************//

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

//********(routes Post)**************************//

exports.likeSauce = (req, res, next) => {

    let like = req.body.like //Initialiser le statut Like
    let userId = req.body.userId //Un utilisateur ne peut avoir qu'une seule valeur pour chaque sauce
    let sauceId = req.params.id //Récupération de l'id de la sauce

    if (like === 1) { //Comme indiquer sur les instructions, une valeur de "1" équivaux a un like.
        Sauce.updateOne( //On utilise 'UpdateOne()' pour mettre à jour les likes notre sauce.
                {
                    _id: sauceId
                }, //La sauce qu'on update est définie par son ID
                {
                    $inc: { //On utilise $inc de MangoDB pour incrémenter nos likes par 1
                        likes: +1
                    },
                    $push: { //On utilise $push de MangoDB pour push notre utilisateur dans le tableau.
                        usersLiked: userId
                    }
                })
            .then(() => res.status(200).json({
                message: "Sauce liké !"
            })) //On renvoie une réponse positive 200
            .catch(error => res.status(400).json({
                error
            })) //Sinon, un message d'érreur
    } else if (like === -1) { //Comme indiquer sur les instructions, une valeur de "-1" equivaux à un dislike.
        Sauce.updateOne( //On utilise 'UpdateOne()' pour mettre à jour les likes notre sauce.
                {
                    _id: sauceId
                }, //La sauce qu'on update est définie par son ID
                {
                    $inc: {
                        dislikes: +1
                    }, //On utilise $inc de MangoDB pour incrémenter nos dislikes par 1
                    $push: {
                        usersDisliked: userId
                    }
                }) //On utilise $push de MangoDB pour push notre utilisateur dans le tableau.
            .then(() => res.status(200).json({
                message: 'Sauce Disliké !'
            })) //On renvoie une réponse positive 200
            .catch(error => res.status(400).json({
                error
            })) //Sinon, un message d'érreur
    } else { //Sinon, la valeur est de 0; comme indiquer sur les instructions, cela équivaux à une annulation d'un like/dislike.
        Sauce.findOne({
                _id: sauceId
            }) //En ce cas on commence par trouver notre sauce via son ID.
            .then(sauce => {
                if (sauce.usersLiked.includes(userId)) { //Si l'utilisateur est présent dans le tableau des likes
                    Sauce.updateOne({
                                _id: sauceId
                            }, //On update la dite sauce.
                            {
                                $pull: {
                                    usersLiked: userId
                                }, //On enlève pour  l'utilisateur du tableau likes
                                $inc: {
                                    likes: -1
                                },
                            }) //et on enlève un like.
                        .then(() => res.status(200).json({
                            message: 'Like annulé !'
                        })) //On renvoie une réponse positive 200
                        .catch(error => res.status(400).json({
                            error
                        })) //Sinon, un message d'érreur.

                } else if (sauce.usersDisliked.includes(userId)) { //Sinon, si l'utilisateur est présent dans le tableu dislikes.
                    Sauce.updateOne({
                                _id: sauceId
                            }, //On update la dite sauce
                            {
                                $pull: {
                                    usersDisliked: userId
                                }, //On enlève pour commencer l'utilisateur du tableau dislikes
                                $inc: {
                                    dislikes: -1
                                },
                            }) //et on enlève un dislike
                        .then(() => res.status(200).json({
                            message: 'Dislike annulé !'
                        })) //On renvoie une réponse positive 200
                        .catch(error => res.status(400).json({
                            error
                        })) //Sinon un message d'érreur.
                }
            })
    }

};