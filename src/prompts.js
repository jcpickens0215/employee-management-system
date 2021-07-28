const Inquirer = require('inquirer');
const Query = require('./queries');

// Add functions
function addDepartment() {

    Inquirer.prompt(
        [
            {
                // What is the name of the department?
                name: "deptName",
                type: "input"
            }
        ]
    ).then( (answer) => {
        Query.addDepartment(answer.deptName);
        start();
    });
}

const addRole = async () => {

    let depts = Query.allDepartmentsNames();

    console.log(depts);

    Inquirer.prompt(
        [
            // What is the name of the role?
            {
                name: "roleName",
                type: "input"
            },

            // What is the salary?
            {
                name: "salary",
                type: "input"
            },

            // What department does this role belong to?
            {
                name: "roleDept",
                type: "list",
                choices: depts,
                default: 0
            }
        ]
    ).then( (answers) => {

        let dept = Query.getDepartmentID(answers.roleDept);

        console.log(dept);

        // if (!answers.salary.isNaN) {

        //     Query.addRole(answers.roleName, answers.salary, dept);
        // }

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
                //      Query.allDepartments();
                //      Query.allRoles(department);
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
                //      Query.allRoles();
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

function foo() {
    console.log(Query.allDepartmentsNames());
    start();
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
                            "Debug",
                            "Quit"
                         ],
                default: 0
            }
        ]
    ).then( (answer) => {

        switch (answer.mainMenu) {

            case "View all Departments":
                Query.allDepartments();
                break;
            
            case "View all Roles":
                // Query.allRoles();
                start();
                break;
        
            case "View all Employees":
                // Query.allEmployees();
                start();
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

            case "Debug":
                foo();
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