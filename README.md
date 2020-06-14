# Todo-App

This Project was built as a simple backend task that would allow me to earn the opertuninty of doing a co-op training with 
a company, the main objective of this task was to assess how much I can finish
and learn given time constraint.

## Task Requiremnts:
- User should be able to list all objects in the platform. No login required.
- User should be able to read a specific object in full detail. No login required.
- User should be able to search all objects using any of the fields in that object (title, body). No login required.
- User should be able to sign-up via email and password.
- User should be able to login. 
- Logged-in User should be able to create a todo.
- Logged-in User should be able to edit his todos.
- Logged-in User should be able to delete his todos.
- Logged-in User can verify his email
- Logged-in User can verify his phone number

# API documentation:
All API End points and documentation can be found at:
[Postman documntation](https://documenter.getpostman.com/view/11503824/SzzheeQf?version=latest).

The following is just a simple list of the api end points:
# Todo CRUD

>POST  /todo

>GET   /todo

>GET   /todo/:id

>GET   /todo/user/:id

>PATCH /todo/:id

>DEL   /todo/:id

# Authentication 

>POST /user/sign-up

>POST /user/login

>GET  /user/me

>PATCH /user/me

>POST /user/logout

>POST /user/logout-all

# Account Verification

>POST   /user/email/verify

>PATCH  /user/email/confirm/:verifyToken

>POST   /user/phonenumber/vertify

>PATCH  /user/phonenumber/confirm/:code

Install the dependencies and start the server to test the Api.

```sh
npm run start
npm run dev
```

## Todos
 - Add more features
 - implement a front-page for the todo
 - add unit testing
