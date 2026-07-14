const { Client } = require('pg');
const connectionString = 'postgresql://eggmarket_db_user:JrHtvo1LpBvLuhlZVI3pLioG2ITgx8OL@dpg-d8g4jelckfvc73e364e0-a.oregon-postgres.render.com/eggmarket_db?sslmode=require';

const client = new Client({
  connectionString,
  ssl: { rejectUnauthorized: false }
});

client.connect()
  .then(() => {
    console.log('Connected successfully!');
    return client.query('SELECT NOW()');
  })
  .then(res => {
    console.log(res.rows);
    client.end();
  })
  .catch(err => {
    console.error('Connection error', err.stack);
    client.end();
  });
