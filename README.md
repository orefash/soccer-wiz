
# Soccerwiz (Soccer Trivia Game) Backend

This is the codebase for REST Endpoints built for a Soccer trivia Game.



### Tech Stack

**Database:** MongoDB, Redis

**Server:** Node, Express

### API Documentation

The postman JSON link can be found [here](https://elements.getpostman.com/redirect?entityId=20674887-d38c79a8-d106-4d15-99b0-422aa8af5f4f&entityType=collection)

To authenticate endpoints
- Choose the 'staging' environment from the environment dropdown
- Create preferred user type via the Register User/ Register Admin endpoints
- Login with user/admin credentials via the Auth/User Login or Admin login endpoints to generate a token
- Replace current value in the environmnents token field with token string generated in admin login
- Replace current value in the environmnents user_token field with token string generated in user login