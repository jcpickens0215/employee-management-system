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

async function addRole() {

    let depts = await Query.toArray(`SELECT * FROM departments`, "name");

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
    ).then( async (answers) => {

        let dept = await Query.toArray(`SELECT (id) FROM departments WHERE name = '${answers.roleDept}'`,"id");

        if (!answers.salary.isNaN) {

            Query.addRole(answers.roleName, answers.salary, dept[0]);
        }

        start();
    });
}

async function addEmployee() {

    let currentEmployees = await Query.toArray(`SELECT CONCAT (first_name, " ", last_name) AS name FROM employees`, "name");
    currentEmployees.push("None");
    let roles = await Query.toArray(`SELECT * FROM roles`, "title");

    Inquirer.prompt(
        [
                // What is their first name?
                {
                    name: "fName",
                    type: "input"
                },
                // What is their last name?
                {
                    name: "lName",
                    type: "input"
                },
                // What is their role?
                {
                    name: "roleName",
                    type: "list",
                    choices: roles,
                    default: 0
                },
                // Who is their manager?
                {
                    name: "manager",
                    type: "list",
                    choices: currentEmployees,
                    default: 0
                }
        ]
    ).then( async (answer) => {

        let role = await Query.toArray(`SELECT (id) FROM roles WHERE title = '${answer.roleName}'`,"id");
        let manager = await Query.toArray(`SELECT (id) FROM employees WHERE CONCAT (first_name, " ", last_name) = '${answer.manager}'`,"id");

        Query.addEmployee(answer.fName, answer.lName, role[0], manager[0]);

        start();
    });
}

// Update functions
async function updateEmployeeRole() {

    let currentEmployees = await Query.toArray(`SELECT CONCAT (first_name, " ", last_name) AS name FROM employees`, "name");
    let roles = await Query.toArray(`SELECT * FROM roles`, "title");
    let manager = currentEmployees;
    manager.push("None");

    Inquirer.prompt(
        [
            // Did they change managers?
            // Conditional on true:
            //      Who is their new manager?
            // Who do you wish to update?
            {
                name: "employee",
                type: "list",
                choices: currentEmployees,
                default: 0
            },
            // What is their new role?
            {
                name: "roleName",
                type: "list",
                choices: roles,
                default: 0
            },
            {
                name: "changedManagers",
                type: "confirm"
            },
            // Who is their manager?
            {
                name: "manager",
                type: "list",
                choices: currentEmployees,
                default: 0,
                when: (res) => res.changedManagers === true
            }
        ]
    ).then( (answers) => {
        // Query.updateEmployeeRole(answers.who, answers.role, answers.manager);
        start();
    });
}

async function foo() {

    let currentEmployees = await Query.toArray(`SELECT CONCAT (first_name, " ", last_name) AS name FROM employees`, "name");
    console.log(currentEmployees);
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
    ).then( async (answer) => {

        switch (answer.mainMenu) {

            // Working
            case "View all Departments":
                let deptPrint = await Query.genericQuery(`SELECT (name) FROM departments`);
                console.table(deptPrint[0]);
                start();
                break;
            
            // Working
            case "View all Roles":
                let rolePrint = await Query.genericQuery(`SELECT (title) FROM roles`);
                console.table(rolePrint[0]);
                start();
                break;
        
            // Working
            case "View all Employees":
                let empPrint = await Query.genericQuery(`SELECT CONCAT (first_name, " ", last_name) AS name FROM employees`);
                console.table(empPrint[0]);
                start();
                break;

            // Working
            case "Add a Department":
                addDepartment();
                break;

            // Working
            case "Add a Role":
                addRole();
                break;

            // Working
            case "Add an Employee":
                addEmployee();
                break;

            // TODO
            case "Update Employee Role":
                updateEmployeeRole();
                break;

            // * Test
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