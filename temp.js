const fs = require('fs');

function convertToLowerCase(){
    const data = fs.readFileSync('./utils/stopwords.json','utf-8');

    let newData = data.toLocaleLowerCase();

    newData = JSON.parse(newData);

    let stopwords = newData.stopwords;

    let uniqueArray = [...new Set(stopwords)];
    console.log(uniqueArray); // Output: [1, 2, 3, 4, 5]
    fs.writeFileSync('./utils/stopwords2.json', JSON.stringify({stopwords: uniqueArray}));
}

convertToLowerCase();