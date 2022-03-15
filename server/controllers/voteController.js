const { Vote } = require("../models/models");

class VoteController {
    async votesForUser(req, res) {
        const { user, result } = req.body;
        const votes = Vote.findAll({
            where: { user_email: user, result }
        });
        return res.json(votes);
    }

    async votesForNews(req, res) {
        // specify the news, the result, if there is proof attached in the query. The news param is required, others are optional
        const { news, result, user } = req.body;
        const votes = Vote.findAll({
            where: { user_email: user, result, news }
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
        const vote = await Vote.create({ user_email: user, result, proof, news });
        return res.json(vote);
    }

    async deleteVote(req, res) {
        const { id } = req.body;

        const vote = await Vote.findByPk(id);
        await vote.destroy();
        return id;
    }
}

module.exports = new VoteController();