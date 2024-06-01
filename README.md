# BE 
This is full stack Trello official with Express, MongoDB. Skip the tedious part and get straight to developing your app.
## Features
- Server
  - User and Boards models with `1:N` relation
  - Board and Columns models with `1:N` relation
  - Column and Cards models with `1:N` relation
  - Full CRUD REST API operations for User, Board, Column, Card models
  - NextAuth authentication with local `email/password`, Google OAuth strategies
  - `Member` and `Admin` roles
  - NodeJS server with Babel for new JS syntax unified with React client
  - `async/await` syntax across whole app
  - Joi server side validation of user's input
  - Single `.env` file configuration
  - Image upload with Multer (storage: `google-cloud/storage`)
  - Database seed
## Installation
Read on on how to set up this for development. Clone the repo.
```
$ git clone https://github.com/hoangnoproo2k3/trello-official-api.git
$ cd trello-official-api
```
#### .env file
MONGODB_URL = ''
DATABASE_NAME=''
APP_HOST='localhost'
APP_PORT=8024
AUTHOR = ''
GOOGLE_APPLICATION_CREDENTIALS = 'key.json'

### Server
Just install the dependencies and run the dev server. App will load on `https://localhost:8024`.

```
$ npm install
$ npm run dev
```
