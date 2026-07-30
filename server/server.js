import dns from "node:dns";

// Forces Node to use Google's public DNS instead of your OS/ISP default.
// This fixes ONE specific cause of MongoDB Atlas "mongodb+srv://" hangs:
// when your network's default DNS can't resolve the special SRV record
// Atlas uses. If your connection is still failing after this fix, the
// cause is something else (see the checklist logged in config/db.js).
dns.setServers(["8.8.8.8", "8.8.4.4"]);

import dotenv from "dotenv";
dotenv.config();

import connectDB from "./config/db.js";
import app from "./app.js";

const PORT = process.env.PORT || 5000;

// IMPORTANT: start listening on the port immediately, independent of MongoDB.
// This is the fix for "backend not running" — previously app.listen() only
// ran inside connectDB().then(), so if Mongo failed or hung, the server
// never bound to the port at all, and the frontend had nothing to reach.
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`   Try it: http://localhost:${PORT}/api/health`);
});

connectDB();
