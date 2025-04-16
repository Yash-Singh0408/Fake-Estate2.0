import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "../lib/prisma.js";


// Register a new User
export const register = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // Check if user already exists (by email or username)
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email: email },
          { username: username }
        ],
      },
    });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // HASH the password
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log(hashedPassword);

    // Create a user and save it in the DB
    const newUser = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
      },
    });

    console.log(newUser);
    res.status(201).json({ message: "User created successfully" });
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .json({ message: "Failed to create user. Something went wrong" });
  }
};


// Login a Existing User
export const login = async (req, res) => {
  const { username, password } = req.body;

  try {
    // ✅ Check if username and password are provided
    if (!username || !password) {
      return res
        .status(400)
        .json({ message: "Username and password are required" });
    }

    // Check if user exists
    const user = await prisma.user.findUnique({ where: { username } });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    // Check if password is correct
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) return res.status(401).json({ message: "Invalid credentials" });

    // Generate a token and send it back to the user
    const age = 1000 * 60 * 60 * 24 * 7;
    const token = jwt.sign(
      {
        id: user.id,
        isAdmin:false
      },
      process.env.JWT_SECRET,{expiresIn: age}
    );

    const {password:userPassword , ...userInfo} = user

    res
      .cookie("token", token, {
        httpOnly: true,
        secure: true,
        maxAge: age,
      })
      .status(200)
      .json(userInfo);
    console.log("Success");
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to login. Something went wrong" });
  }
};

// Logout a User
export const logout = (req, res) => {
  res.clearCookie("token").status(200).json({ message: "Logout successful" });
};
