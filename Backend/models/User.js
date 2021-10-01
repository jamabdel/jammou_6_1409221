const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
// Création du model User pour le stockage dans la base de données
const userSchema = mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true //s'assurera qu'aucun utilisateurs ne peut partager la même adresse e-mail.
    },
    password: {
        type: String,
        required: true
    }
});

userSchema.plugin(uniqueValidator); //UniqueValidator vérifie les données et renvoie des érreur comprehensives.

module.exports = mongoose.model('User', userSchema);