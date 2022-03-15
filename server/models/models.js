const sequelize = require('../db');
const { DataTypes } = require('sequelize');

const User = sequelize.define('user', {
    email: { type: DataTypes.STRING, primaryKey: true },
    name: { type: DataTypes.STRING },
    password: { type: DataTypes.STRING },
    rating: { type: DataTypes.NUMBER },
    admin: { type: DataTypes.BOOLEAN }
});

const News = sequelize.define('news', {
    article: { type: DataTypes.STRING },
    keyWords: { type: DataTypes.JSON },
    preview: { type: DataTypes.STRING },
    text: { type: DataTypes.TEXT },
    legit: { type: DataTypes.BOOLEAN }
});


module.exports = {
    User,
    News
}