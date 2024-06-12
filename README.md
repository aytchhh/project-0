# NC News API

NC News API is a back-end interface built for modern web applications. It simplifies data management with PostgreSQL databases, enabling flexible interaction via endpoints. 

Designed to emulate real-world backend service like reddit, an efficient solution for creating and accessing application data programmatically.
<br>
<br>

## Getting Started
1. Visit [NC News](https://nc-news-hwajay.onrender.com/)
2. Make a request to an existing endpoint such as **/api**
- e.g.
`https://nc-news-hwajay.onrender.com/api`

3. Browse through the result


**Note**:
- Upon visiting the link in step 1, you will encounter a 404 message at the '/' path, which is expected.
- You can find all the existing endpoints in [this json file](./endpoints.json).
- If your data appears on one line, it can be difficult to read. Consider installing a JSON Formatter extension to your browser. For Chrome users, I recommend [this one](https://chromewebstore.google.com/detail/json-formatter/bcjindcccaagfpapjjmafapmmgkkhgoa?hl=en).

<br>

## Setting up Locally

Before setting up, make sure your system meets the following requirements:
- Node.js v21.6.1 or higher
- PostgreSQL v15.6 or higher

You can check your versions by running the following commands in your terminal:
```sh
node --version
```
```sh
psql -V
```


<br>
1. Clone the repository:

- Navigate to the folder where you want to clone the repo, then type the following commands in your terminal: 
```sh
git clone https://github.com/aytchhh/project-0.git
```
- If you are not familiar with github, check out this article: [cloning a repo](https://docs.github.com/en/repositories/creating-and-managing-repositories/cloning-a-repository).

- After cloning, open this repo in VSCode or your preferred editor.

- open the terminal within your editor. For VSCode, press **Ctrl+\`** or **Cmd+`**


2. Install dependencies:


```sh
npm install
```
3. Setup databases:
```sh
npm setup-dbs
```
```sh
npm seed
```

<br>

- To connect to the databases, you will need to create two **.env** files within the project root directory.<br><br> 
- type the following commands: 
```sh
touch .env.test
```
```sh
touch .env.development
```
<br>

- Within these files, add **PGDATABASE=**, with the correct database name for that environment.
e.g.
```js
PGDATABASE=my_database
```
(see /db/setup.sql for the database names)
<br>
<br>

- After setting up, you should be able to use **npm test** to run all JEST tests in the __test__ folder
```sh
npm test
```
<br>

## Endpoints
The [endpoints.json](./endpoints.json) file contains details about all the existing endpoints on the API, it **requires updating** whenever a new endpoint is added. 

Refer to the file for examples.
