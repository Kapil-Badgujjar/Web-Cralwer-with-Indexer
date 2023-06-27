const fs = require('fs');
const URL = require('url');
const {Queue,Stack} = require('../utils/dataStructures');

function getLinksFromHTML(url, file, depth, queue, history){
    let temp = "";
    pattern = 'href="';
    let j=0;
    let start = file.search('body');
    let end = file.search('/body');
    const q = URL.parse(url);
    file = file.slice(start-1, end+6);
    for(let i = 0; i<file.length; i++){
        if(pattern[j] == file[i]){
            j++;
            if(j==6){
                i++;
                while(file[i]!='"'){
                        temp += file[i];
                        i++;
                }
                if(temp != "../"){
                    if(temp.slice(0,3)=="../"){
                        let the_arr = q.pathname.split('/');
                        the_arr.pop();
                        let temp2 =  the_arr.join('/');
                        temp = temp2 + temp.slice(2,temp.length);
                        // console.log(temp, url, q.pathname);
                        // process.exit(0);
                    }
                    if(temp.slice(0,5) !='https'){
                        if(temp.slice(0,4) != 'http'){
                            if(temp.slice(0,7) != '//fonts'){
                                if(q.host.slice(0,9)=='localhost'||q.host.slice(0,9)=='127.0.0.1'){
                                    temp = 'http://' + q.host + temp;
                                }else{
                                    temp = 'https://' + q.host + temp;
                                }
                            }
                            // else{
                            //     temp = temp.slice(2,temp.length-1);
                            // }
                        }
                    }
                    // if(temp == 'https://www.google.co.in../' ){
                    //     fs.writeFileSync('./ErrorFile.txt', file);
                    // }
                    //Remove forword slash (/) from the end of a url
                    if(temp.slice(-1) == '/') temp = temp.slice(0, -1);
                    if(temp[0]!='.'&&temp.slice(8,12) != 'play'&&temp.slice(8,12) != 'news'&&temp.slice(8,12) != 'mail'&& temp.slice(0,7) != '//fonts'){
                        //if url is not present in our history
                        if(history.indexOf(temp)==-1)
                        {
                            //Write to the file
                            fs.writeFile(__dirname+`../../URLs/depth-${depth}.text`,(JSON.stringify(temp)+'\n'),{ flag: 'a+'},function(err){});
                            
                            //Insert into queue
                            queue.enqueue({address: temp, depth: depth});

                            //Add to history
                            history.push(temp);
                            fs.writeFile('../../restoreLastSession/historyRestore.json', JSON.stringify({array: history}),(error)=>{
                                if(error) console.log('History not saved');
                            });
                        }
                    }
                }
                temp="";
                j=0;
            }
        }
        else{
            j=0;
        }
    }
    console.log("Linkes extracted...");
}

function htmlParser(file){
    let stack = new Stack();
    let queue = new Queue();
    let tagName = '';
    let content='';
    let metaTag = '';
    let metaKeywords = '';
    let flag = false;
    try{
    for(let i=0; i<file.length; i++){
        flag = false;
        tagName = '';
        content = '';
        if(file[i]=='<'){
            while(file[i]!='>'&&file[i]!=' '){
                tagName += file[i];
                i++;
            }
            if(file[i]==' '&&tagName=='<meta'){
                while(file[i]!='>'){
                    metaTag += file[i];
                    i++;
                }
                metaTag = metaTag.toLowerCase();
                let start = metaTag.search('keywords');
                if(start>=0){
                    start = metaTag.search('content="');
                    start+=9;
                    while(metaTag[start]!='"'){
                        metaKeywords += metaTag[start];
                        start++;
                    }
                    metaKeywords.trim();
                    if(metaKeywords.length>0)
                    queue.enqueue({tagName: '<meta-keywords>', content: metaKeywords});
                }
                metaTag='';
            }
            if(file[i]==' '){
                while(file[i]!='>') i++;
            }
            tagName += file[i];
            let x = tagName.split(' ');
            let y = stack.top();
            if(y!=undefined&&('<'+tagName.slice(2)==y.tagName)){
                let z = stack.pop();
                if(z.content.length>0) queue.enqueue(z);
            }else{
                stack.push({tagName:tagName, content:''});
                if(x[0]=='<!DOCTYPE>') stack.pop();
                if(x[0]=='<img>') stack.pop();
                if(x[0]=='<input>') stack.pop();
                if(x[0]=='<hr>') stack.pop();
                if(x[0]=='<hr/>') stack.pop();
                if(x[0]=='<br>') stack.pop();
                if(x[0]=='<br/>') stack.pop();
                if(x[0]=='<link>') stack.pop();
                if(x[0]=='<meta>') stack.pop();
                if(x[0]=='<script>' || x[0]=='<style>'){
                    stack.pop();
                    i++;
                    while(file[i]!='>') i++;
                } 
            }
        }
        else{
            while(file[i]!='<'&&file[i]!='\r'&&file[i]!='\n'&&file[i]!='\t'){
                content += file[i];
                flag=true;
                i++;
            }
            if(flag)
            i--;
            content = content.trim();
            if(content!=''){
                let element = stack.pop();
                element.content += content;
                stack.push({tagName : element.tagName, content: element.content});
            }
        }
    }
    } catch (error){
        console.log(error.message);
    }
    return queue;
}

module.exports = { getLinksFromHTML, htmlParser };