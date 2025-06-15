const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// ✅ Middleware to log visitor IPs
app.use((req, res, next) => {
  const forwarded = req.headers["x-forwarded-for"];
  const ip = forwarded ? forwarded.split(",")[0] : req.socket.remoteAddress;
  const logEntry = `${new Date().toISOString()} - ${ip}\n`;

  fs.appendFile("ips.txt", logEntry, (err) => {
    if (err) {
      console.error("Error writing IP:", err);
    }
  });

  next();
});

// ✅ Serve static HTML/CSS/JS from /public folder
app.use(express.static(path.join(__dirname, "public")));

// ✅ View logged IPs in the browser
app.get("/view-logs", (req, res) => {
  fs.readFile("ips.txt", "utf8", (err, data) => {
    if (err) {
      return res.send("No logs found or file not created yet.");
    }
    res.set("Content-Type", "text/plain");
    res.send(data);
  });
});

// ✅ Start the server
app.listen(PORT, () => {
  console.log(`IP Logger running on port ${PORT}`);
});
