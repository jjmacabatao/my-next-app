NextAuth API for authentication:
Login:
endpoint: http://localhost:3000/api/auth/callback/credentials
method: POST

## Twitter-Clone Endpoints

### User Registration:

- endpoint: http://localhost:3000/api/auth/register
- method: POST
- content-type: application/json
- body(json):
  {
  "firstName": "Fname",
  "lastName": "Lname",
  "maidenName": "Optional",
  "email": "test@text.com",
  "username": "test",
  "password": "encrypted password here",
  "confirmPassword": "encrypted password here"
  }

### Tweets [api/tweets]

---
