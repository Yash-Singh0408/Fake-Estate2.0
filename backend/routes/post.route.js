import express from "express";
const router = express.Router();

// Example route (can be removed later)
router.get("/", (req, res) => {
  res.send("Post route is working!");
});

export default router;
