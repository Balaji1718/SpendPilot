const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

if (process.env.SP_POSTINSTALL_RUNNING) {
  // Prevent infinite recursion loops during installation
  process.exit(0);
}

process.env.SP_POSTINSTALL_RUNNING = "1";

const rootDir = path.join(__dirname, "..");

console.log("Installing backend dependencies...");
execSync("npm install", {
  cwd: path.join(rootDir, "backend"),
  stdio: "inherit",
});

console.log("Installing frontend dependencies...");
execSync("npm install --include=dev", {
  cwd: path.join(rootDir, "frontend"),
  stdio: "inherit",
});

// Verify Vite exists inside frontend/node_modules before build execution
const vitePath = path.join(rootDir, "frontend", "node_modules", ".bin", "vite");
const isVitePresent = fs.existsSync(vitePath) || fs.existsSync(vitePath + ".cmd");

if (!isVitePresent) {
  console.error("Error: vite executable was not found in frontend/node_modules/.bin!");
  process.exit(1);
}

console.log("Verification success: vite exists in frontend/node_modules/.bin");
console.log("All dependencies installed successfully.");
