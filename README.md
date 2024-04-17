# Northcoders News API

## Setup
To connect to the databases, you will need to create two **.env** files within the project root directory.<br><br> 
type the following commands in your terminal: 
```sh
touch .env.test
```
```sh
touch .env.development
```
<br>

Within these files, add **PGDATABASE=**, with the correct database name for that environment.
e.g.
```js
PGDATABASE=my_database
```
(see /db/setup.sql for the database names)
<br>
<br>

## Endpoints
The **endpoints.json** file contains details about all the existing endpoints on the API, it **requires updating** whenever a new endpoint is added. 

Refer to the file for examples.