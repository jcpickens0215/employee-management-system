// Library imports
const Inquirer = require('inquirer');
const MySQL = require('mysql2');
const Table = require('console.table');
require('dotenv').config(); // You'll need to create a .env file and add the following
                            // variables:
                            //      DB_USER - username for mysql
                            //      DB_PASSWORD - password for mysql

// Connect to database
const db = MySQL.createConnection(
    {
      host: 'localhost',
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: 'employees_db'
    },
    console.log(`Connected to the employees_db database.`)
);