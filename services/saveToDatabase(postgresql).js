const { Pool } = require('pg');

const configuration = {
    host: 'localhost',
    port: 5432,
    user: 'Kapil',
    password: 'Kapil@123',
    database: 'demoDB'

};

const pool = new Pool(configuration);

function insertIntoTable(word,url,weight,count) {
    console.log(weight, word, url, count);
    pool.connect(async(err, client, done) => {
        if (!err) {
            try {
                const text = 'INSERT INTO "indexTable"(word,url,weight,occurrence) VALUES($1,$2,$3,$4)';
                const values = [word, url,weight,count];
                const result = await client.query(text, values);
            } catch (error) {
                console.error('Error executing INSERT query:', error);
            } finally {
                done();
            }
        }
    });
}

function saveToDatabase(list) {
    let intervalID = setInterval(()=>{
        if(list.peak()){
            let item = list.dequeue();
            insertIntoTable(item.word,item.url,item.weight,item.count);
        }
        else{
            console.log('Data saved to database');
            pool.end();
            clearInterval(intervalID);
        }
    },10);
}

async function getURLs(word) {
    const client = await pool.connect();
    try {
      const text = `SELECT url FROM "indexTable" WHERE word = $1 ORDER BY weight DESC`;
      const values = [word];
      const result = await client.query(text, values);
      // console.log(result.rows);
      return result.rows;
    } catch (error) {
      console.error('Error executing SELECT query:', error);
    } finally {
      client.release();
    }
}

module.exports = {saveToDatabase, getURLs};