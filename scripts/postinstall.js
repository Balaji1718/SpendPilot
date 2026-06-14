const { execSync } = require("child_process");
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

console.log("All dependencies installed successfully.");
