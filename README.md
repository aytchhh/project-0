# Northcoders News API

## Project Setup
To connect to the databases, you will need to create two **.env** files within the project root directory.<br><br> 
type the following commands in your terminal: 
<br>
**touch .env.test**
<br>
**touch .env.development**

Within these files, add **PGDATABASE=databaseName**, with the correct database name for that environment.
<br>
(see /db/setup.sql for the database names)
<br>

## Endpoints
The **endpoints.json** file contains details about all the existing endpoints in the database, it **requires updating** whenever a new endpoint is added. 

Refer to the file for guidance on adding new endpoints.