import express from 'express';
const chatRouter = express.Router();

chatRouter.get("/", async (req, res) => {
  try {
    res.render("chat", {});
  } catch (err) {
    res.status(err.status || 500).json({
      status: "error",
      payload: err.message,
    });
  }
});

export default chatRouter;