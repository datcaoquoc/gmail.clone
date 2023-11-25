import mysql from 'mysql2'

export const connection = mysql.createConnection({
    host: 'localhost',
    user: 'wpr',
    password: 'fit2023',
    database: 'wpr2023'
  });
