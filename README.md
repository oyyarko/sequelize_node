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

1. [ ] Pagination in Posts and Users
2. [ ] Like and Unlike a Post
3. [ ] Follow and Unfollow users
4. [ ] Account freez and unfreez
5. [ ] Account delete
6. [ ] Account signup and login
7. [ ] JWT authentication
8. [ ] Search Users
9. [ ] Delete Post
10. [ ] Update Post
11. [ ] Update User
12. [ ] Delete Comment
13. [ ] Save or Unsave Posts
14. [ ] Suggested Users or Posts