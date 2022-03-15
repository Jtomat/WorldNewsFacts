const sequelize = require('../db');
const { DataTypes, BOOLEAN } = require('sequelize');

const User = sequelize.define('user', {
    email: { type: DataTypes.STRING, primaryKey: true },
    name: { type: DataTypes.STRING },
    password: { type: DataTypes.STRING },
    correct: { type: DataTypes.INTEGER },
    votes: { type: DataTypes.INTEGER },
    admin: { type: DataTypes.BOOLEAN }
});

const News = sequelize.define('news', {
    article: { type: DataTypes.STRING },
    keyWords: { type: DataTypes.JSON },
    preview: { type: DataTypes.STRING },
    text: { type: DataTypes.TEXT },
    legit: { type: DataTypes.BOOLEAN }
});

const Vote = sequelize.define('vote', {
    news_id: { type: DataTypes.INTEGER },
    user_email: { type: DataTypes.STRING },
    result: { type: DataTypes.BOOLEAN },
    proofs: { type: DataTypes.STRING }
})

Vote.belongsTo(News, {
    foreignKey: 'news_id',
    as: 'news_fk',
    onDelete: "CASCADE"
})

Vote.belongsTo(User, {
    foreignKey: 'user_email',
    as: 'user_fk',
    onDelete: 'CASCADE'
})

News.hasMany(Vote);
User.hasMany(User);


module.exports = {
    User,
    News,
    Vote
}