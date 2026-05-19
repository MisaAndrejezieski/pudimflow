console.log('Teste iniciado');
const { Client } = require('pg');
console.log('PG carregado');
const client = new Client({
    connectionString: process.env.DATABASE_URL
});
client.connect((err) => {
    if (err) {
        console.error('ERRO:', err.message);
        process.exit(1);
    }
    console.log('OK');
    client.end();
});