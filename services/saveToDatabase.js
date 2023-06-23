const sql = require('mssql');
const { Queue } = require('../utils/dataStructures');
const configuration = {
    user: 'abc',    // username in the database
    password: 'abc',    // password of the user in the database
    server: 'KAPIL-PC\\SQLEXPRESS',  // database server
    database: 'Test', // database name
    options: {
        trustServerCertificate: true
    }
};

async function insertIntoTable(word,url,weight) {
    console.log(weight, word, url);
    try {
        const pool = await sql.connect(configuration);
        await pool.request().query(`INSERT INTO demo VALUES ('${word}', '${url}', ${weight} )`);
        await pool.close();
    } catch (error) {
        console.log(error.message);
        await pool.close();
    }
}

function saveToDatabase(list) {
    let intervalID = setInterval(()=>{
        if(list.peak()){
            let item = list.dequeue();
            // insertIntoTable(item.word,item.url,item.weight);
            console.log(item);
        }
        else{
            console.log('Data saved to database');
            clearInterval(intervalID);
        }
    },20);
}

module.exports = saveToDatabase;