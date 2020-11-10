# Node Todo App

## Technologies and Tools

- TextEditor - Visual Studio Code
- VSCode Extensions
  - Prettier - for code formatting
- Frontend - Ejs, Bootstrap
- Backend - NodeJS(ExpressJS), MongoDB

## Usage

```sh
git clone https://github.com/skr571999/NodeTodoApp.git

# Start the mongo DB server
mongod

# import the data to the DB
mongoimport --db=test --collection=users --file=users.json
mongoimport --db=test --collection=todos --file=todos.json

npm install

npm start

```

<!--
# commands to export data
mongoexport --collection=users --db=test --out=users.json
mongoexport --collection=todos --db=test --out=todos.json
-->

<!-- ## Preview Screens -->
