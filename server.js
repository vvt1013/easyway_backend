// ================= USER SYSTEM =================

const USERS_FILE = 'users.json';

// Ensure users file exists
if (!fs.existsSync(USERS_FILE)) {
  fs.writeFileSync(USERS_FILE, JSON.stringify([]));
}

// Read users
function readUsers() {
  return JSON.parse(fs.readFileSync(USERS_FILE));
}

// Write users
function writeUsers(data) {
  fs.writeFileSync(USERS_FILE, JSON.stringify(data, null, 2));
}

// ✅ SIGNUP
app.post('/signup', (req, res) => {
  const users = readUsers();
  const { username, password } = req.body;

  if (!username || !password) {
    return res.json({ message: "Fill all fields" });
  }

  const existing = users.find(u => u.username === username);

  if (existing) {
    return res.json({ message: "User already exists" });
  }

  users.push({ username, password });
  writeUsers(users);

  res.json({ message: "Account created successfully" });
});

// ✅ LOGIN
app.post('/login', (req, res) => {
  const users = readUsers();
  const { username, password } = req.body;

  const user = users.find(
    u => u.username === username && u.password === password
  );

  if (!user) {
    return res.json({ message: "Invalid login" });
  }

  res.json({ message: "Login successful" });
});
