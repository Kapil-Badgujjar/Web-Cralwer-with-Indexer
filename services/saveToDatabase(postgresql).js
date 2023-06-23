const { Pool } = require('pg');

const configuration = {
    host: 'localhost',
    port: 5432,
    user: 'Kapil',
    password: 'Kapil@123',
    database: 'demoDB'

};

const pool = new Pool(configuration);

// function saveToDatabase(list) {
//     for (const item of list) {
//         insertIntoTable(item.word,item.url,item.weight);
//     }
//     pool.end();
// }

function insertIntoTable(word,url,weight) {
    pool.connect(async(err, client, done) => {
        if (!err) {
            try {
                const text = 'INSERT INTO "indexTable"(word,url,weight) VALUES($1,$2,$3)';
                const values = [word, url,weight];
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
            insertIntoTable(item.word,item.url,item.weight);
            // console.log(item);
        }
        else{
            console.log('Data saved to database');
            pool.end();
            clearInterval(intervalID);
        }
    },20);
}

module.exports = saveToDatabase;