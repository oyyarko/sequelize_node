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

1. [x] Pagination in Posts and Users
2. [x] Like and Unlike a Post
3. [x] Follow and Unfollow users
4. [ ] Account freez and unfreez
5. [ ] Account delete
6. [x] Account signup and login
7. [x] JWT authentication
8. [ ] Search Users
9. [x] Delete Post
10. [x] Update Post
11. [x] Update User
12. [x] Delete Comment
13. [ ] Save or Unsave Posts
14. [ ] Suggested Users or Posts
15. [x] Users following/followers list
16. [ ] Message between two user [Socket.io]
17. [ ] Group Message [Socket.io]
18. [x] Nested Comment [hierarchy]
19. [ ] Share posts with other Users
20. [x] Public or Private account
21. [x] Accept/Reject Request if private account
22. [x] Display posts when private and followed, no validation for public
23. [x] Followers list only if user request is accepted and public users
24. [x] Pending Requests
25. [x] Remove User from following


#### TO-DO issue fixing

1. [x] Only owner of Post/Comment can delete it
2. [x] Nested comment debug
3. [x] Don't allow reliking