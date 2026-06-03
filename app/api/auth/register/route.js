import { User } from "@/lib/models/User";
import { connectDB } from "@/lib/mongoose";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import fileSystem from "node:fs/promises";

// Register using fileSystem
export const _POST = async (request) => {
  try {
    const {
      firstName,
      lastName,
      maidenName,
      email,
      username,
      password,
      confirmPassword,
    } = await request.json();

    if (
      !firstName ||
      !lastName ||
      !email ||
      !username ||
      !password ||
      !confirmPassword
    ) {
      return NextResponse.json(
        { error: "All required fields must have a valid value." },
        { status: 406 },
      );
    }

    if (password !== confirmPassword) {
      return NextResponse.json(
        { error: "Password and Confirm Password value does not matched." },
        { status: 406 },
      );
    }

    // get the list of user
    const userData = await fileSystem.readFile("./db/user.json", {
      encoding: "utf8",
    });

    const users = JSON.parse(userData);
    const ids = users.users.map((user) => user.id);
    const next_user_id = ids[ids.length - 1] + 1;

    // encrypt password using bcrypt
    const salt = await bcrypt.genSalt(10);
    const hashedPass = await bcrypt.hash(password, salt);

    const newUserObj = {
      id: next_user_id,
      firstName: firstName,
      lastName: lastName,
      maidenName: maidenName,
      email: email,
      username: username,
      password: hashedPass,
    };

    users.users.push(newUserObj);

    fileSystem.writeFile("./db/user.json", JSON.stringify(users, null, 2), {
      encoding: "utf8",
    });

    return NextResponse.json({ register: "success" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 401 });
  }
};

// Register new User using MongoDB
export const POST = async (request) => {
  try {
    await connectDB();
    const {
      firstName,
      lastName,
      maidenName,
      email,
      username,
      password,
      confirmPassword,
    } = await request.json();

    if (
      !firstName ||
      !lastName ||
      !email ||
      !username ||
      !password ||
      !confirmPassword
    ) {
      return NextResponse.json(
        { error: "All required fields must have a valid value." },
        { status: 406 },
      );
    }

    // Check user email if already in use
    const userEmailExist = await User.findOne({ email: email });

    if (userEmailExist) {
      return NextResponse.json(
        { success: false, error: "Email is already in use." },
        { status: 409 },
      );
    }

    // Confirm user password
    if (password !== confirmPassword) {
      return NextResponse.json(
        {
          success: false,
          error: "Password and Confirm Password value does not matched.",
        },
        { status: 406 },
      );
    }

    // encrypt user password using bcrypt
    const salt = await bcrypt.genSalt(10);
    const hashedPass = await bcrypt.hash(password, salt);

    // create new user object
    const newUserObj = {
      firstName: firstName,
      lastName: lastName,
      maidenName: maidenName,
      email: email,
      username: username,
      password: hashedPass,
    };

    const newUser = await User.create(newUserObj);

    return NextResponse.json(
      { success: true, message: "User successfully created." },
      { status: 201 },
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 401 },
    );
  }
};
