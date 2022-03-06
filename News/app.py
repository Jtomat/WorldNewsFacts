from flask import request
from flask import Flask
from generator import Generator;

newsGenerator = Generator(); 
app = Flask(__name__)

@app.route('/')
def index():
    length = int(request.args.get('len'));
    words = request.args.get('words');
    return newsGenerator.getNews(length, words)

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5000, debug=False)