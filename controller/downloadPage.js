const axios = require('axios');
const fs = require('fs');
function downloadPage(url, depth, fileID, flag, sessionID, filesList){
    try{
        console.log(url+`?sid=${sessionID}&depth=${depth}`, '------------------URL');
        axios.get(flag ? url+`?sid=${sessionID}&depth=${depth}` : url,{withCredentials: true, timeout: 30000})
        .then((response,reject)=>{
            if(response.status === 200){
                console.log('Connected to server...');
                fs.writeFile(__dirname+'../../restoreLastSession/fileIDRestore.json', JSON.stringify({fileID:fileID}),(error)=>{ if(error) console.log('fileID not saved!');});
                const filename = `File${fileID}_htmlCode.html`;
                // const writeFileStream = fs.createWriteStream(`./files/${filename}`);
                // writeFileStream.write(response.data);
                let file = response.data;
                if(typeof(file) == typeof({})) {  
                    file = JSON.stringify(file);
                    fs.writeFile(__dirname+`../../Ojects/${filename}`,file,()=>{
                    });
                }
                else{
                    fs.writeFile(__dirname+`../../files/${filename}`,file,()=>{
                        depth++;
                        filesList.push({filename, depth, url});
                        fs.writeFile(__dirname+`../../restoreLastSession/arrayRestore.json`,JSON.stringify({array: filesList}),()=>{});
                    });
                }
                // console.log(filename, depth, url);
                // filesList.push({filename, depth, url});
                return true;
            }
            return false;
        }).catch((reject)=>{
            console.log(reject.message);
            fs.writeFile(__dirname+'../../restoreLastSession/fileIDRestore.json', JSON.stringify({fileID:fileID}),(error)=>{ if(error) console.log('fileID not saved!');});
            const filename = `File${fileID}_failedConnectionMessage.html`;
            fs.writeFile(__dirname+`../../failedConnections/${filename}`, 'URL: '+ url + '\nMessage:\n'+ reject.message,(error)=>{ if(error) console.log('Error message not saved');});

        })
    }
    catch (error){
        // console.log(error.message);
        return false;
    }
}

module.exports = {downloadPage:downloadPage};