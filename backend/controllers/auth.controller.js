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
        OR: [{ email }, { username }],
      },
    });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // HASH the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Assign admin if it's the special account
    const isAdmin = username === "Yash0408" && email === "Yash@123gmail.com";

    // Create and save user in DB
    const newUser = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
        isAdmin,
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

export const login = async (req, res) => {
  const { username, password } = req.body;

  try {
    if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required" });
    }

    const user = await prisma.user.findUnique({ where: { username } });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) return res.status(401).json({ message: "Invalid credentials" });

    // ✅ Check if user is admin
    const isAdmin = user.isAdmin;

    const age = 1000 * 60 * 60 * 24 * 7;
    const token = jwt.sign(
      {
        id: user.id,
        isAdmin,
      },
      process.env.JWT_SECRET,
      { expiresIn: age }
    );

    const { password: userPassword, ...userInfo } = user;

    res
      .cookie("token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "None",
        maxAge: age,
      })
      .status(200)
      .json({ ...userInfo, isAdmin }); // Send admin flag to frontend
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to login. Something went wrong" });
  }
};


// Logout a User
export const logout = (req, res) => {
  res.clearCookie("token").status(200).json({ message: "Logout successful" });
};
