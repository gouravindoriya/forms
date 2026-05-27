const { Client } = require('pg');

const client = new Client({
  connectionString: 'postgresql://postgres:postgres@localhost:5432/dev'
});

client.connect((err) => {
  if (err) {
    console.error('Connection error:', err);
    process.exit(1);
  } else {
    console.log('Connected successfully!');
    client.end();
  }
});
