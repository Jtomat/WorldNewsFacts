from flask import request
from flask import Flask
from flask import jsonify
from generator import Generator
from newsLoader import NewsPortalConfig
from newsLoader import NewsLoader

newsGenerator = Generator() 
url = NewsPortalConfig('https://news.yahoo.com/', [r'href=\"\/([\w\d\-\.]*)\"', 'caas-body', 'caas-img has-preview'], True)
url2 = NewsPortalConfig('https://www.nbcnews.com/', [r'href=\"([\:\.\/\w\-\d]*)\"', 'article-body__content', 'article-hero__main-image'], False)
loader = NewsLoader([url,url2], newsGenerator)

app = Flask(__name__)

@app.route('/generate')
def gen():
    length = int(request.args.get('len'))
    words = request.args.get('words')
    return jsonify(newsGenerator.getNews(length, words))

@app.route('/parse')
def parse():
    length = int(request.args.get('len'))
    return jsonify(loader.parseRandom(length))

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5000, debug=False)