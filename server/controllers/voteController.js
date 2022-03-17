const { Vote, User, News } = require("../models/models");
const { where } = require("sequelize");

class VoteController {
    async votesForUser(req, res) {
        const { user, result } = req.query;
        const votes = await Vote.findAll({
            where: result ? { user_email: user, result } : { user_email: user }
        });
        return res.json(votes);
    }

    async votesForNews(req, res) {
        // specify the news, the result, if there is proof attached in the query. The news param is required, others are optional
        const { news, result, user } = req.query;
        let where = {
            news_id: news
        };
        if (result) {
            where.result = result;
        }
        if (user) {
            where.user_email = user;
        }
        const votes = await Vote.findAll({
            where
        });
        return res.json(votes);
    }

    async voteById(req, res) {
        const { id } = req.params;

        const user = await Vote.findByPk(id);
        return res.json(user);
    }

    async newVote(req, res) {
        const { user, result, proof, news } = req.body;
        const vote = await Vote.create({ user_email: user, result, proof, news_id: news });

        const userInstance = await User.findOne({ where: { email: user } });
        await User.update({ votes: userInstance.votes + 1 }, {
            where: {
                email: user
            }
        });

        const newsInstance = await News.findOne({ where: { id: news } });

        if (result === newsInstance.legit) {
            await User.update({ correct: userInstance.correct + 1 }, {
                where: {
                    email: user
                }
            });
        }

        return res.json(vote);
    }

    async deleteVote(req, res) {
        const { id } = req.body;

        const vote = await Vote.findByPk(id);
        await vote.destroy();
        return id;
    }
}

module
    .exports = new VoteController();