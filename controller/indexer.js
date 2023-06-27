const path = require('path');
const fs = require('fs');
const { Queue } = require('../utils/dataStructures');
function convertData(term,weight,url){
    term = term.toLowerCase();
    if(term.slice(-1)==','||term.slice(-1)=='.'||term.slice(-1)=='?'||term.slice(-1)=='!'||term.slice (-1)=='"'||term.slice (-1)=="'"){
        term = term.slice(0, -1);
    }
    if(term.slice(0)=='.'||term.slice(0)=='"'||term.slice(0)=="'"){
        term = term.slice(1,term.length-1);
    }
    return {word: term, weight: weight, url: url}
}
function indexer(data, url){
    let queue = new Queue();
    queue = data;
    let words = [];
    while(queue.peak()){
        let {tagName,content} = queue.dequeue();
        let keywords;
        switch(tagName){
            case '<meta-keywords>': 
                keywords = content.split(' '||','||'_'||'/');
                keywords.forEach((term)=>{
                    words.push(convertData(term,100,url));
                });
            break;
            case '<title>':
                keywords = content.split(' '||','||'_'||'/');
                keywords.forEach((term)=>{
                    words.push(convertData(term,80,url));
                });
            break;
            case '<h1>':
                keywords = content.split(' '||','||'_'||'/');
                keywords.forEach((term)=>{
                    words.push(convertData(term,70,url));
                });
            break;
            case '<h2>':
                keywords = content.split(' '||','||'_'||'/');
                keywords.forEach((term)=>{
                    words.push(convertData(term,50,url));
                });
            break;
            case '<h3>':
                keywords = content.split(' '||','||'_'||'/');
                keywords.forEach((term)=>{
                    words.push(convertData(term,40,url));
                });
            break;
            case '<h4>':
                keywords = content.split(' '||','||'_'||'/');
                keywords.forEach((term)=>{
                    words.push(convertData(term,30,url));
                });
            break;
            case '<h5>':
                keywords = content.split(' '||','||'_'||'/');
                keywords.forEach((term)=>{
                    words.push(convertData(term,20,url));
                });
            break;
            case '<h6>':
                keywords = content.split(' '||','||'_'||'/');
                keywords.forEach((term)=>{
                    words.push(convertData(term,10,url));
                });
            break;
            case '<p>':
                keywords = content.split(' '||','||'_'||'/');
                keywords.forEach((term)=>{
                    words.push(convertData(term,35,url));
                });
            break;
            case '<b>': keywords = content.split(' '||','||'_'||'/');
            keywords.forEach((term)=>{
                words.push(convertData(term,70,url));
            });
        break;
            default:  keywords = content.split(' '||','||'_'||'/');
            keywords.forEach((term)=>{
                words.push(convertData(term,5,url));
            });
        break;
        }
    }

    let groupedObjects = words.reduce((groups, obj) => {
        // if (!groups[obj.word] || obj.weight > groups[obj.word].weight) {
        if (!groups[obj.word]) {
          groups[obj.word] = {...obj,count:1};
        }
        else{
            let newWeight = groups[obj.word].weight + obj.weight;
            groups[obj.word].weight = newWeight;
            groups[obj.word].count += 1;
        }
        return groups;
      }, {});
      words = Object.values(groupedObjects);

    return words;
}
function filterStopwords(words){
    let {stopwords} = JSON.parse(fs.readFileSync(path.join(__dirname, '../utils/stopwords2.json'),'utf-8'));
    let flag = true;
    let filteredWords = [];
    for(let i=0; i<words.length; i++){
        flag = true;
        for(let j=0; j<stopwords.length; j++){
            if(words[i].word==stopwords[j]){
                flag=false;
                break;
            }
        }
        if(flag&&!isStringMadeOfSpecialCharacters(words[i].word)&&!doesStringContainNumber(words[i].word))  filteredWords.push(words[i]);
    }
    let filterWordsQueue = new Queue();
    for(let i=0; i<filteredWords.length; i++) {
        filterWordsQueue.enqueue(filteredWords[i]);
    }
    return filterWordsQueue;
}

function isStringMadeOfSpecialCharacters(str) {
    return /^[^a-zA-Z]+$/.test(str);
}

function doesStringContainNumber(str) {
    return /\d/.test(str);
  }

module.exports = { indexer, filterStopwords };