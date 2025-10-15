import express from "express";

const app = express();
const cors = require("cors");
const port = 5000; // Or any preferred port

app.use(express.json()); // Enable JSON body parsing
app.use(cors());

app.get("/", (req, res) => {
  res.send("Hello from Express shit Backend!");
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
