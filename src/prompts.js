const Inquirer = require('inquirer');
const Query = require('./queries');
const Table = require('console.table');

// Add functions
function addDepartment() {

    Inquirer.prompt(
        [
            {
                // What is the name of the department?
            }
        ]
    ).then( (answer) => {
        // Query.addDepartment(answer);
        start();
    });
}

function addRole() {

    Inquirer.prompt(
        [
            {
                // What is the name of the role?
                // What is the salary?
                // What department does this role belong to?
            }
        ]
    ).then( (answers) => {
        // Query.addRole(answers.name, answers.salary, answers.dept);
        start();
    });
}

function addEmployee() {

    Inquirer.prompt(
        [
            {
                // What is their first name?
                // What is their last name?
                // What is their role?
                // Who is their manager?
            }
        ]
    ).then( (answer) => {
        // Query.addEmployee(answers.first, answers.last, answers.role, answers.manager);
        start();
    });
}

// Update functions
function updateEmployeeRole() {

    Inquirer.prompt(
        [
            {
                // Who do you wish to update?
                // What is their new role?
                // Did they change managers?
                // Conditional on true:
                //      Who is their new manager?
            }
        ]
    ).then( (answers) => {
        // Query.updateEmployeeRole(answers.who, answers.role, answers.manager);
        start();
    });
}

// Initial function
function start() {

    Inquirer.prompt(
        [
            {
                name: "mainMenu",
                type: "list",
                choices: [
                            "View all Departments",
                            "View all Roles",
                            "View all Employees",
                            "Add a Department",
                            "Add a Role",
                            "Add an Employee",
                            "Update Employee Role",
                            "Quit"
                         ],
                default: 0
            }
        ]
    ).then( (answer) => {

        switch (answer) {

            case "View all Departments":
                // Query.allDepartments();
                break;
            
            case "View all Roles":
                // Query.allRoles();
                break;
        
            case "View all Employees":
                // Query.allEmployees();
                break;
    
            case "Add a Department":
                addDepartment();
                break;

            case "Add a Role":
                addRole();
                break;

            case "Add an Employee":
                addEmployee();
                break;

            case "Update Employee Role":
                updateEmployeeRole();
                break;

            case "Quit":
                break;
            
        }
    });

}

// Exported functions
module.exports = {
    start: start
};