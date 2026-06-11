## This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

---

# Twitter clone application

A web application built with Next JS and MongoDB. This application serves as the final project in FullStack Bootcamp at ReDI.

---

## Features

- User authentication
- Creating, updating(limited to 5 times), deleting tweets.
- Commenting on and deleting comments from tweets.
- Recording user reactions, such as upvote, downvote, and views.
- Notifications
- User profiles

---

## Project Structure

```
app/
│
├── (web)/
│   ├── (protected_route)/
│   │   ├── notification/
│   │   |   └── page.jsx
│   │   |
│   │   ├── tweets/
|   |   |   ├── [slug]/
|   |   |   |   ├── loading.jsx
|   |   |   |   └── page.jsx
│   │   |   |
|   |   |   ├── loading.jsx
|   |   |   └── page.jsx
|   |   |
│   │   └── user-profile/
│   │       └── page.jsx
|   |
│   └── auth/
│       └── page.jsx
|
├── api/
│   ├── auth/
│   ├── ├──[...nextauth]/ (catch all route for NextAuth implementation)
│   │   |   └──route.js
|   |   |
│   ├── ├──register/
│   │      └── route.js
|   |
│   ├── tweets/
|   |   ├── [slug]/ (dynaminc route)
|   |   |   └── route.js
|   |   |
|   |   ├── comment/
|   |   |   └── route.js
|   |   |
|   |   ├── notification/
|   |   |   └── route.js
|   |   |
|   |   ├── reaction/
|   |   |   └── route.js
|   |   |
|   |   └── route.js
|   |
│   └── user/
|       └── route.js
|
├── error.js (is a special file-system convention used to handle runtime errors in a route segment.)
├── favicon.ico
├── globals.css
├── layout.js
├── LayoutWrapper.js
├── loading.js (is a special file-system convention used to show a loading UI while a route segment is being fetched or rendered)
├── page.js
|
features/
│   ├── auth/
│   │   ├── components/
│   │   └── contexts/
|   |
│   ├── comments/
│   │   ├── components/
│   │   └── services/
|   |
│   ├── notification/
│   │   ├── components/
│   │   ├── contexts/
│   │   └── services/
|   |
│   ├── tweets/
│   │   ├── components/
│   │   ├── contexts/
│   │   └── services/
|   |
│   ├── user-profile/
│   │   └── components/
|   |
│   └──  views/
│       ├── components/
│       └── services/
|
lib/
│   ├── models/ (Mongoose models)
|   ├── alert.js
|   ├── mongoose.js (for mongoDB connection)
|   └── utils.js
|
public/
|
shared/
│   ├── components/
│   ├── context/
│   ├── providers/
│   └── styles/
auth.js (for NextAuth implementation)
proxy.js (for NextAuth implementation)

```

## Tech Stack

- NextJS
- JavaScript (ES6+)
- Tailwind CSS
- MongoDB

---

## Installation

```bash
git clone https://github.com/jjmacabatao/my-next-app.git
cd my-next-app
npm install
```

## Create your local environment variable (env.local)

#### The app expects the following public environment variable:

- `AUTH_TRUST_HOST`=true
- `AUTH_SECRET`=your-long-random-secret-key-here
- `AUTH_URL`=<your localhost url here: e.g. http://localhost:3000>
- `MONGODB_URI`=your-mongoDB-connection-string-here
- `NEXT_PUBLIC_API_BASE_URL`=your-localhost-url-here/api/tweets
- `NEXT_PUBLIC_API_USER_BASE_URL`=your-localhost-url-here/api/user
- `NEXT_PUBLIC_API_AUTH_BASE_URL`=your-localhost-url-here/api/auth

## Available Scripts

- `npm run dev` starts the local development server.
- `npm run build` creates a production build.
- `npm run start` serves the production build.
- `npm run lint` runs ESLint.

---

## 👨‍💻 Author

### Joseph Jake Macabatao

- Github: https://github.com/jjmacabatao
- LinkedIn: https://www.linkedin.com/in/joseph-jake-macabatao/
