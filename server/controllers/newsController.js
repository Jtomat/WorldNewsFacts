const { News } = require("../models/models");
const axios = require('axios');

class NewsController {
    async parseNews(req, res) {
        axios.get(`http://${ process.env.NEWS_GENERATOR_URL }:${ process.env.NEWS_GENERATOR_PORT }/parse`, {
            params: {
                len: req.body.len
            }
        }).then((response) => {
            response.data.map((news) => {
                News.create({
                    article: news.article,
                    keyWords: news.keyWords,
                    preview: news.preview,
                    text: news.text,
                    legit: true
                });
            });
        });
        return res.status(201);
    }

    async generateNews(req, res) {
        axios.get(`${ process.env.NEWS_GENERATOR_URL }:${ process.env.NEWS_GENERATOR_PORT }/generate`, {
            params: {
                len: req.body.len,
                words: req.body.words || null
            }
        }).then((response) => {
            News.create({
                article: response.data.article,
                keyWords: response.data.keyWords,
                preview: response.data.preview,
                text: response.data.text,
                legit: false
            });
        });
        return res.status(201);
    }

    async removeNews(req, res) {
        const { id } = req.body;

        const news = await News.findByPk(id);
        await news.destroy;
        return res.json(id);
    }

    async getAll(req, res) {

        const news = await News.findAll({
            attributes: ['article', 'keyWords', 'preview']
        });

        return res.json(news);
    }

    async findNewsById(req, res) {
        const id = req.params.id;
        const news = await News.findByPk(id);
        return res.json(news);
    }
}

module.exports = new NewsController();