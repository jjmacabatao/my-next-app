import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "./lib/mongoose";
import { User } from "./lib/models/User";

export const { handlers, auth, signIn, signOut } = NextAuth({
  trustHost: true,
  secret: process.env.AUTH_SECRET,
  session: {
    strategy: "jwt",
    maxAge: 30 * 60,
  },
  pages: {
    signIn: "/auth",
  },
  providers: [
    Credentials({
      credentials: {
        email: {},
        password: {},
      },

      async authorize(credentials) {
        try {
          await connectDB();
          const { email, password, csrfToken } = credentials ?? {};

          if (!email || !password) {
            throw new Error("Both email and password are required.");
          }

          const userExist = await User.findOne({
            email: email,
          });
          if (!userExist) {
            console.log("User not found.");
            return null;
          } else {
            // Check password
            const validPassword = await bcrypt.compare(
              password,
              userExist.password,
            );
            console.log("valid Password: ".validPassword);
            if (!validPassword) {
              console.log("Invalid account.");
              return null;
            }
          }

          return {
            name: {
              id: userExist.id,
              firstName: userExist.firstName,
              lastName: userExist.lastName,
              username: userExist.username,
            },
            email: userExist.email,
          };
        } catch (error) {
          return NextResponse.json({ error: error.message }, { status: 400 });
        }

        return null;
      },
    }),
  ],
});

// using filesystem
// async authorize(credentials) {
//   try {
//     const { email, password, csrfToken } = credentials ?? {};
//     console.log("AUTHORIZE RUNNING");
//     console.log(csrfToken);
//     if (!email || !password) {
//       throw new Error("Both email and password are required.");
//     }

//     // check if the user exist
//     const userFound = users.filter(
//       (user) =>
//         user.email === email &&
//         bcrypt.compareSync(password, user.password),
//     );
//     console.log(userFound);
//     if (userFound.length !== 1) {
//       return null;
//     }

//     return {
//       name: {
//         id: userFound[0].id,
//         firstName: userFound[0].firstName,
//         lastName: userFound[0].lastName,
//       },
//       email: userFound[0].email,
//     };
//   } catch (error) {
//     return NextResponse.json({ error: error.message }, { status: 400 });
//   }

//   console.log(email, password);
//   return null;
// }
