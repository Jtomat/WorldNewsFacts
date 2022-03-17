import tensorflow as tf
import nltk
import re
import io
from nltk.tokenize import RegexpTokenizer
from nltk.stem.snowball import SnowballStemmer
import math
from googletrans import Translator
from google_images_search import GoogleImagesSearch

class Generator:
    model = None
    real_words= None
    names = None
    translator = None
    stemmer = None
    gis = None
    
    def __init__(self):
       self.real_words = set(nltk.corpus.words.words() )
       self.names = set(nltk.corpus.names.words())
       self.stemmer = SnowballStemmer(language="english")
       self.model = tf.saved_model.load('C:\\Users\\kosro\\Documents\\GitHub\\WordNews\\News\\one_step')
       self.translator = Translator()
       self.gis = GoogleImagesSearch('AIzaSyBohnBtAzlJ07U2jM5-POXuMD7Xw9wWAQU', 'f23c4ea05cbfb47f2')
       
    def getNews(self, charsLenght: int, words = ''):
        text = self.generateBy(words, charsLenght)
        article = self.getArticle(text)
        keys = self.getKeyWords(text)
        # preview = self.findImg(article)
        preview = "https://img-9gag-fun.9cache.com/photo/aRrgE7B_460s.jpg"
        return {'text': text, 'article':article, 'keyWords':keys, 'preview':preview}
       
    def generateBy(self, startWords: str, charsLenght: int):
        states = None
        next_char = tf.constant([startWords+' '])
        result = [next_char]
        for n in range(charsLenght):
          next_char, states = self.model.generate_one_step(next_char, states=states)
          result.append(next_char)
          self.print_progress((n+1)/charsLenght*100)
        print()
        return self.refactorText(tf.strings.join(result)[0].numpy().decode("utf-8"))

    def refactorText(self, prefab: str):
        text = prefab.replace('.',' . ').replace(',',' , ')
        text = self.setUpNames(text)
        text = self.clearSpaces(text)
        text = self.removeDublPunct(text)
        text = self.setEndOfSentence(text)
        # if (len(text)<3000):
        #     text = self.fixGrammar(str(text))
        # else:
        #     chunks, chunk_size = len(text), 3000
        #     subs = [text[i:i+chunk_size] for i in range(0, chunks, chunk_size)]
        #     res = ''
        #     for sub in subs:
        #         res += self.fixGrammar(str(sub))
        #     text = res
        text = text.replace('trump', 'Trump')
        return text
    
    def setUpNames(self, prefab: str):
        text = prefab
        words = text.split(' ')
        for word in words:
            if(word.capitalize() in self.names and word !='will' and word!='way' and word!='say' and word !='says'):
                text = text.replace(word, word.capitalize())
        return text
    
    def removeDublPunct(self, prefab: str):
        return re.sub('\,{2,}', ',', re.sub('\.{2,}', '.', prefab))
    
    def setEndOfSentence(self, prefab: str):
        text = prefab
        if (text.rfind('.')<10):
            text = text[:len(text)-text.rfind('.')]
        else:
            text = text + '.'
        text = re.sub("(^|[.?!])\s*([a-zA-Z])", lambda p: p.group(0).upper(), str(text))
        return text
    
    def getKeyWords(self, text):
        tokenizer = RegexpTokenizer(r'([\w]+|\.|\,|\:|\")')
        words = tokenizer.tokenize(text)
        keyWords = {}
        for t in words:
            stem = self.getWords(t)
            if stem != None and len(stem)>4:
               keyWords[stem] = text.count(t)
        keyWords = dict(sorted(keyWords.items(), key=lambda item: item[1]))
        return list(keyWords)[-5:]
    
    def has_numbers(self, inputString):
        return any(char.isdigit() for char in inputString)
    
    def findImg(self, text: str):
        self.gis.search({'q':str(text), 'num': 1})
        bytesData = io.BytesIO()
        bytesData.seek(0)
        if (len(self.gis.results()) > 0):
            img = self.gis.results()[0]._url
        else:
            img = None
        return img
    
    def getWords(self, string:str):
        if (string == '.' or string ==','):
            return None
        stemmed_w = self.stemmer.stem(string)
        if stemmed_w != '' and not string.isdigit() and not self.has_numbers(string):
            if string.capitalize() in self.names:
                return stemmed_w.capitalize()
            else: 
                if stemmed_w in self.real_words:
                    return stemmed_w   
        else:
            return None
    
    def getArticle(self, text:str):
        return text[:text.find('.')]
    
    def fixGrammar(self, text:str):
        return self.translator.translate(str(text)).text

    def clearSpaces(self, prefab: str):
        return re.sub('[ ]{2,}', ' ', str(prefab)).replace(' . ', '. ').replace(' , ', ', ').replace('. .', '.')
    
    def print_progress(self, percent: float):
        percent_dat =math.floor(percent/5)
        st = ("\rTotal progress: ["+"#"*percent_dat+"-"*(20-percent_dat)+"] - {:10.2f}%")
        print(st.format(percent), end='\r')