const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 10000;

// ✅ Tell Express to trust Render's proxy
app.set("trust proxy", true);

// Serve static files from the "public" folder
app.use(express.static("public"));

// ✅ Middleware to log IP and User-Agent
app.use((req, res, next) => {
  const ip = req.headers["x-forwarded-for"]?.split(",")[0] || req.socket.remoteAddress;
  const userAgent = req.headers["user-agent"] || "Unknown";

  const logEntry = `${new Date().toISOString()} - ${ip} - ${userAgent}\n`;

  fs.appendFile("ips.txt", logEntry, (err) => {
    if (err) {
      console.error("Error writing to ips.txt:", err);
    }
  });

  next();
});

// Optional route to view the IP log file
app.get("/view-logs", (req, res) => {
  const filePath = path.join(__dirname, "ips.txt");
  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      res.status(500).send("Error reading IP log.");
    } else {
      res.type("text/plain").send(data);
    }
  });
});

app.listen(PORT, () => {
  console.log(`IP Logger running on port ${PORT}`);
});
