from bs4 import BeautifulSoup;
import requests;
import re;
import random;
from generator import Generator;

class NewsPortalConfig:
    utl: str;
    patterns: [];
    needOpen: bool;
    
    def __init__(self, url, patterns, needOpen):
        self.url = url;
        self.patterns = patterns;
        self.needOpen = needOpen;

class NewsLoader:
     urls = [];
     gen: Generator;
     
     def __init__(self, urls: [], gen: Generator):
         self.urls = urls;
         self.gen = gen;
         
     def parseNews(self, link: str, pattern):
         page = requests.get(link);
         content = BeautifulSoup(page.content,'lxml').find("div", {"class": pattern});
         text = '';
         if(content):
             text = str(content.text.lower());
         else:
             return None;
         text = text.replace('_','').replace('“','').replace('”','').replace(':','');
         text = text.replace('’','').replace('(','').replace(')', '').replace('|','');
         text = text.replace('"','').replace('\'','').replace('$','').replace('‘','');
         text = text.replace('/','');
         text = ''.join([i for i in text if not i.isdigit()])
         text = re.sub(r'http\S+', '', text);
         text = self.gen.refactorText(text); 
         return (text)
         
     def excractImg(self, link:str, pattern):
         page = requests.get(link);
         content = BeautifulSoup(page.content,'lxml').find("img", {"class": pattern});
         if (content == None):
             content = BeautifulSoup(page.content,'lxml').find("picture", {"class": pattern});
             if (content):
                 content = content.find('img');
                 if(content):
                     return content['src'];
         else:
            return content['src'];
         return None;
        
     def parseRandom(self, count: int):
        shuffle = self.urls;
        random.shuffle(shuffle)
        counter = 0;
        result = [];
        for portal in shuffle:
            page = requests.get(portal.url);
            content = BeautifulSoup(page.content,'lxml');
            tags = content.find_all('h3') + content.find_all('section') + content.find_all('li');
            random.shuffle(tags);
            for htag in tags:
                if (counter==count):
                    break;
                ahref = htag.find('a');
                l = re.findall(portal.patterns[0], str(ahref));
                if len(l)>0 and (l[0].count('/') > 3 or portal.needOpen):
                    link = l[0];
                    if (portal.needOpen):
                        text = self.parseNews(portal.url+link, portal.patterns[1]);
                        if (text):
                            img = self.excractImg(portal.url+link, portal.patterns[2]);
                            counter+=1;
                            if (img == None):
                                img = self.gen.findImg(self.gen.getArticle(text));
                                counter+=1;
                                result.append({'article':self.gen.getArticle(text), 'text':text, 'preview':img, 'keyWords':self.gen.getKeyWords(text)})
                    else:
                        text = self.parseNews(link, portal.patterns[1])
                        if (text):
                            img = self.excractImg(link, portal.patterns[2]);
                            if (img == None):
                                img = self.gen.findImg(self.gen.getArticle(text));
                            counter+=1;
                            result.append({'article':self.gen.getArticle(text), 'text':text, 'preview':img, 'keyWords':self.gen.getKeyWords(text)})
        return result;