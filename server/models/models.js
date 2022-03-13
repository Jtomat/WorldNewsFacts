const sequelize = require('../db');
const {DataTypes} = require('sequelize');

const User = sequelize.define('user', {
    email: {type: DataTypes.STRING, primaryKey: true},
    name: {type: DataTypes.STRING},
    password: {type: DataTypes.STRING},
    rating: {type: DataTypes.NUMBER}
});



module.exports = {
    User
}