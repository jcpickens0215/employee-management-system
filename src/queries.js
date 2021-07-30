// Required libraries
const MySQL = require('mysql2');
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

// Converts SQL results (via genericQuery) into an array
async function toArray(query, field) {

    // Store results from a generic query
    let data = await genericQuery(query);

    // Empty array to receive data
    let returnArr = [];

    // Iterate through the rows and populate the container
    data[0].forEach( (row) => {

        returnArr.push(row[field]);
    });

    // Return the array
    return returnArr;
}

// Takes a SQL string and returns the results
function genericQuery(myQuery) {

    return db.promise().query(myQuery);
}

// Add a department
function addDepartment(department) {

    db.query(`INSERT INTO departments (name) VALUES (?)`, department, (err) => {

        if (err) console.log(err);
    });
}

// Add a role
function addRole(name, salary, dept) {

    db.query(`INSERT INTO roles (title, salary, department_id) VALUES (?, ?, ?)`, [name, salary, dept], (err) => {

        if (err) console.log(err);
    });

}

// Add an Employee
function addEmployee(fName, lName, role, manager) {

    db.query(`INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)`,
             [fName, lName, role, manager], (err) => {

        if (err) console.log(err);
    });

}

// Export functions
module.exports = {
    
    toArray: toArray,
    genericQuery: genericQuery,
    addDepartment: addDepartment,
    addRole: addRole,
    addEmployee: addEmployee
};