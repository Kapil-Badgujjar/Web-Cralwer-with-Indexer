const sql = require('mssql');
// const { Queue } = require('../utils/dataStructures');
const configuration = {
    user: 'abc',    // username in the database
    password: 'abc',    // password of the user in the database
    server: 'KAPIL-PC\\SQLEXPRESS',  // database server
    database: 'WebCrawler', // database name
    options: {
        trustServerCertificate: true
    }
};

async function insertIntoTable(word, url, weight, count) {
    console.log(weight, word, url, count);
    let pool = null;
    try {
      pool = await sql.connect(configuration);
      const request = pool.request();
      request.input('word', sql.NVarChar, word);
      request.input('url', sql.NVarChar, url);
      request.input('weight', sql.Int, weight);
      request.input('count', sql.Int, count);
      await request.query('INSERT INTO index_table VALUES (@word, @url, @weight, @count)');
      console.log('Row inserted successfully');
    } catch (error) {
      console.log('Error:', error.message);
    } finally {
      if (pool) {
        await pool.close();
      }
    }
  }

function saveToDatabase(list) {
    let intervalID = setInterval(()=>{
        if(list.peak()){
            let item = list.dequeue();
            insertIntoTable(item.word,item.url,item.weight,item.count);
        }
        else{
            console.log('Data saved to database');
            clearInterval(intervalID);
        }
    },20);
}

module.exports = saveToDatabase;