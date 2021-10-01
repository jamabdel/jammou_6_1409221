//routeur Express
const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');

const sauceCtrl = require('../controllers/sauce');

//Ajouter une sauce avec et avec "auth" on protege toute les route
//Chaque route aura "Auth" qui permet d'authentifier l'utilisateur sur chaque demandes.
router.post('/', auth, multer, sauceCtrl.createSauce); //On ajoute multer ici également, pour gêrer les modifications d'images.

//Récupérer toutes les sauces
router.get('/', auth, sauceCtrl.getAllSauces);

//Récupérer toutes une sauces
router.get('/:id', auth, sauceCtrl.getOneSauce);

router.put('/:id', auth, multer, sauceCtrl.modifySauce); //On ajoute multer ici également, pour gêrer les modifications d'images.
//Supprimée une sauce déterminée
router.delete('/:id', auth, sauceCtrl.deleteSauce);//Supprimer une sauce

router.post('/:id/like', auth, sauceCtrl.likeSauce);


module.exports = router;