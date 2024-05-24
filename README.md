## Steps

#### NodeJs project with MySQL db with Sequelize ORM:

1. npm init -y
2. npm install express sequelize mysql2 body-parser
3. mkdir models config
4. npx sequelize-cli init
5. npx sequelize-cli model:generate --name User --attributes firstName:string,lastName:string,email:string
6. npx sequelize-cli db:migrate
7. node index.js

#### TO-DO api's

[ ] Pagination in Posts and Users
[ ] Like and Unlike a Post
[ ] Follow and Unfollow users
[ ] Account freez and unfreez
[ ] Account delete
[x] Account signup and login
[x] JWT authentication
[ ] Search Users
[x] Delete Post
[x] Update Post
[x] Update User
[ ] Delete Comment
[ ] Save or Unsave Posts
[ ] Suggested Users or Posts
