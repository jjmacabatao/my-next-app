import { NextResponse, NextRequest } from "next/server";
import { users } from "@/db/user";

// Login
export const POST = async (request) => {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Both email and password are required." },
        { status: 400 },
      );
    }

    const userFound = users.filter((user) => {
      if (user.email === email && user.password === password) {
        return user;
      }
    });

    console.log("user found object: ", userFound);

    if (userFound.length !== 1) {
      return NextResponse.json({ error: "User not found!" }, { status: 404 });
    }

    const loginReturn = {
      status: 200,
      message: "success",
      userObj: userFound,
    };

    return NextResponse.json(loginReturn, { status: 200 });
  } catch (error) {
    console.log(error.message);
    throw NextResponse.json({ error: error.message }, { status: 405 });
  }
};
