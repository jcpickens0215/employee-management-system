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

// Queries defined here as functions

// Query.allDepartments();
function allDepartmentsNames() {

    console.log("attempting...");

    return new Promise((resolve, reject) => {

        db.query('SELECT * FROM departments;', (err, results) => {

            if (err) reject(err);
    
            // let deptStrings = [];
    
            // Object.keys(results).forEach(function(key) {
            //     var row = results[key];
            //     deptStrings.push(row.name);
            //     // console.log(deptStrings);
            // });
    
            resolve(results);
        });
    });
}

// Query.allDepartments();
function allDepartments() {

    db.query(`SELECT (name) FROM departments`, (err, results) => {

        if (err) console.log(err);

        console.table(results);
        return;
    });
}

function getDepartmentID(department) {

    db.query(`SELECT (id) FROM departments WHERE name = ?`, department, (err, result) => {

        if (err) console.log(err);

        return result[0].id;
    });
}

// Query.allRoles(opt department);
// Query.allEmployees(opt department, opt role);

function addDepartment(department) {

    db.query(`INSERT INTO departments (name) VALUES (?)`, department, (err) => {

        if (err) console.log(err);
    });
}

function addRole(name, salary, dept) {

    db.query(`INSERT INTO roles (name, salary, department) VALUES (?, ?, ?)`, [name, salary, dept], (err) => {

        if (err) console.log(err);
    });

}
// Query.addEmployee(answers.first, answers.last, answers.role, answers.manager);

// Query.updateEmployeeRole(answers.who, answers.role, answers.manager);

// Export functions
module.exports = {
    // Exported functions
    allDepartmentsNames: allDepartmentsNames,
    allDepartments: allDepartments,
    getDepartmentID: getDepartmentID,
    addDepartment: addDepartment,
    addRole: addRole
};