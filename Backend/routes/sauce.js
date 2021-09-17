//routeur Express
const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');

const sauceCtrl = require('../controllers/sauce');

//Ajouter une sauce avec et avec "auth" on protege toute les route
router.post('/', auth, multer, sauceCtrl.createSauce);

//Récupérer toutes les sauces
router.get('/', auth, sauceCtrl.getAllSauces);

//Récupérer toutes une sauces
router.get('/:id', auth, sauceCtrl.getOneSauce);

router.put('/:id', auth, multer, sauceCtrl.modifySauce);
//Supprimée une sauce déterminée
router.delete('/:id', auth, sauceCtrl.deleteSauce);

router.post('/:id/like', auth, sauceCtrl.likeSauce);


module.exports = router;