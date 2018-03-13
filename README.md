# A simple CRUD of Students Web Server-Client

This is a simple CRUD of Students Web Server-Client. There is mydb.sql which used as backup of database. 

* Language  : javacript
* Database  : mysql
* CSS Template : bootstrap 4
* Chart     : Google Chart

Skeleton
```
╭─evania@Evanias-MacBook-Air ~/sqlku/form
╰─$ tree
.
├── app.js
├── bin
│   └── www
├── node_modules (containing 1000 more files/directory)
├── package-lock.json
├── package.json
├── public
│   ├── images
│   ├── javascripts
│   │   └── scripts.js
│   └── stylesheets
│       └── style.css
├── routes
│   ├── index.js
│   └── users.js
└── views
    ├── edit.pug
    ├── error.pug
    ├── index.pug
    ├── insert.pug
    ├── layout.pug
    └── stat.pug
```
## How To Run
1. Clone this project
```
git clone https://github.com/nhunhea/form
```
2. Import `mydb.sql`
3. To run the the project simply type
```
npm start
```
4. Access this code from browser
``` 
http://localhost:3000/students 
```
## Feature
* Validation `Every input must be filled`
* CRUD in students table
* A chart of gender comparison and A chart of date insertion of data
## Required
* npm
* mysql

## Quote of The Day
``` 
"Kesempurnaan Hanya Milik Allah SWT"
```