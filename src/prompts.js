// required libraries
const Inquirer = require('inquirer');
const Query = require('./queries');

// Add a new department to the database
function addDepartment() {

    Inquirer.prompt(
        [
            {
                // What is the name of the department?
                name: "deptName",
                type: "input",
                message: "What is the name of the department?: "
            }
        ]
    ).then( (answer) => {

        // Add the new department
        Query.addDepartment(answer.deptName);
        start(); // Back to main menu
    });
}

// Add a new role to the database
async function addRole() {

    // Get a list of all the departments, for use in Inquirer(list)
    let depts = await Query.toArray(`SELECT * FROM departments`, "name");

    Inquirer.prompt(
        [
            // What is the name of the role?
            {
                name: "roleName",
                type: "input",
                message: "What is the title of the role?: "
            },

            // What is the salary?
            {
                name: "salary",
                type: "input",
                message: "What is the salary paid to the role?: "
            },

            // What department does this role belong to?
            {
                name: "roleDept",
                type: "list",
                message: "What department does the role belong to?: ",
                choices: depts,
                default: 0
            }
        ]
    ).then( async (answers) => {

        // Get the ID associated with the selected department
        let dept = await Query.toArray(`SELECT (id) FROM departments WHERE name = '${answers.roleDept}'`,"id");

        // If the salary is a number
        if (!answers.salary.isNaN) {

            // Add the new role
            Query.addRole(answers.roleName, answers.salary, dept[0]);
        }

        // Back to main menu
        start();
    });
}

// Add a new employee to the database
async function addEmployee() {

    // Get a list of all employees, for use in Inquirer(list) manager prompt
    let currentEmployees = await Query.toArray(`SELECT CONCAT (first_name, " ", last_name) AS name FROM employees`, "name");
    currentEmployees.push("None"); // Add the option to set null

    // Get a list of all roles, for use in Inquirer(list) job title prompt
    let roles = await Query.toArray(`SELECT * FROM roles`, "title");

    Inquirer.prompt(
        [
                // What is their first name?
                {
                    name: "fName",
                    type: "input",
                    message: "What is the employee's first name?: "
                },
                // What is their last name?
                {
                    name: "lName",
                    type: "input",
                    message: "What is the employee's last name?: "
                },
                // What is their role?
                {
                    name: "roleName",
                    type: "list",
                    message: "What is the employee's job title?: ",
                    choices: roles,
                    default: 0
                },
                // Who is their manager?
                {
                    name: "manager",
                    type: "list",
                    message: "Who is the employee's manager?: ",
                    choices: currentEmployees,
                    default: 0
                }
        ]
    ).then( async (answer) => {

        // Get the ID associated with the selected role
        let roleID = await Query.toArray(`SELECT (id) FROM roles WHERE title = '${answer.roleName}'`,"id");

        // Get the ID associated with the selected manager
        let managerID = await Query.toArray(`SELECT (id) FROM employees WHERE CONCAT (first_name, " ", last_name) = '${answer.manager}'`,"id");

        // Add the new employee
        Query.addEmployee(answer.fName, answer.lName, roleID[0], managerID[0]);

        // Back to main menu
        start();
    });
}

// Update functions
async function updateEmployeeRole() {

    // Get a list of all employees, for use in Inquirer(list) employee prompt
    let currentEmployees = await Query.toArray(`SELECT CONCAT (first_name, " ", last_name) AS name FROM employees`, "name");
    
    // Get a list of all roles, for use in Inquirer(list) job title prompt
    let roles = await Query.toArray(`SELECT * FROM roles`, "title");

    // Copy the employee list onto a container for a manager list
    let manager = currentEmployees;
    manager.push("None"); // Add the option for null manager

    Inquirer.prompt(
        [
            // Who do you wish to update?
            {
                name: "employee",
                type: "list",
                message: "Which employee do you wish to update?: ",
                choices: currentEmployees,
                default: 0
            },
            // What is their new role?
            {
                name: "roleName",
                type: "list",
                message: "What is the employee's new role?: ",
                choices: roles,
                default: 0
            },
            // Did they change managers?
            {
                name: "changedManagers",
                type: "confirm",
                message: "Will the employee be changing managers?: "
            },
            // Who is their manager?
            {
                name: "manager",
                type: "list",
                message: "Who is the employee's new manager?: ",
                choices: currentEmployees,
                default: 0,

                // Only show this prompt if the user confirmed the last prompt
                when: (res) => res.changedManagers === true
            }
        ]
    ).then( async (answers) => {

        // Get the ID associated with the selected role
        let roleID = await Query.toArray(`SELECT (id) FROM roles WHERE title = '${answers.roleName}'`,"id");

        // Get the ID associated with the selected manager
        let managerID = await Query.toArray(`SELECT (id) FROM employees WHERE CONCAT (first_name, " ", last_name) = '${answers.manager}'`,"id");

        // If the user did not select a manager, ensure it is NULL
        if (managerID.length === 0) managerID = null;

        // Update the employee
        Query.genericQuery(
            `UPDATE employees
             SET role_id = ${roleID[0]}
             ${answers.changedManagers ? ', manager_id = ' + managerID : ''}
             WHERE CONCAT (first_name, " ", last_name) = '${answers.employee}'`
        );

        // Back to main menu
        start();
    });
}

// Initial function
function start() {

    Inquirer.prompt(
        [
            // Main menu
            {
                name: "mainMenu",
                type: "list",
                message: "What would you like to do?: ",
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
    ).then( async (answer) => {

        switch (answer.mainMenu) {

            case "View all Departments":
                // Display a table of the departments to the screen
                let deptPrint = await Query.genericQuery(`SELECT * FROM departments`);
                console.table(deptPrint[0]);
                start();
                break;
            
            case "View all Roles":
                // Display a table of roles, with their department, to the screen
                let rolePrint = await Query.genericQuery(`
                SELECT
                roles.id,
                roles.title AS role_title,
                roles.salary AS role_salary,
                departments.name AS department_name
                    FROM roles

                INNER JOIN departments
                ON roles.department_id = departments.id`);
                console.table(rolePrint[0]);
                start();
                break;

            case "View all Employees":
                // Display a table of employees, with their job title, department, salary,
                // and manager, to the screen
                let empPrint = await Query.genericQuery(`
                SELECT
                all_emp.id,
                all_emp.first_name,
                all_emp.last_name,
                roles.title AS job_title,
                departments.name AS department_name,
                roles.salary,
                CONCAT (man.first_name, " ", man.last_name) AS manager
                    FROM
                    employees all_emp

                INNER JOIN roles
                ON all_emp.role_id = roles.id

                INNER JOIN departments
                ON roles.department_id = departments.id

                LEFT JOIN employees man
                ON all_emp.manager_id = man.id;
                `);

                console.table(empPrint[0]);
                start();
                break;

            case "Add a Department":
                // Prompt the user for a new department
                addDepartment();
                break;

            case "Add a Role":
                // Prompt the user for a new role
                addRole();
                break;

            case "Add an Employee":
                // Prompt the user for a new employee
                addEmployee();
                break;

            case "Update Employee Role":
                // Prompt the user to update an employee
                updateEmployeeRole();
                break;

            case "Quit":
                // Exit
                process.exit(1);
        }
    });
}

// Exported functions
module.exports = {
    start: start
};