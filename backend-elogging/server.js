const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { Pool } = require("pg");
const bcrypt = require("bcrypt");

const app = express();
const port = 3001; // Port where the server will run
const host = '0.0.0.0';  // Listen on all interfaces


// PostgreSQL connection configuration
const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "FacultyAvailabilityDB",
  password: "1234",
  port: 5432,
});

// Middleware to parse JSON request body
app.use(bodyParser.json());
app.use(cors()); // Enable CORS for all routes

// Faculty registration endpoint
app.post("/register-faculty", async (req, res) => {
  const { firstname, middle, lastname, email, password, age, rfid } = req.body;
  const fullName = `${firstname} ${middle} ${lastname}`.trim();

  if (!firstname || !lastname || !email || !password || !age || !rfid) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    // Check if the email or RFID already exists
    const emailCheckQuery = `SELECT id FROM tbl_users WHERE email = $1`;
    const emailCheckResult = await pool.query(emailCheckQuery, [email]);

    if (emailCheckResult.rows.length > 0) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const rfidCheckQuery = `SELECT id FROM tbl_faculty WHERE rfid = $1`;
    const rfidCheckResult = await pool.query(rfidCheckQuery, [rfid]);

    if (rfidCheckResult.rows.length > 0) {
      return res.status(400).json({ message: "RFID already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const userQuery = `
      INSERT INTO tbl_users (name, email, password, role_id, status, created_at)
      VALUES ($1, $2, $3, 1, 1, NOW())
      RETURNING "id";
    `;
    const userValues = [fullName, email, hashedPassword];

    const userResult = await pool.query(userQuery, userValues);
    const userID = userResult.rows[0].id;

    const facultyQuery = `
      INSERT INTO tbl_faculty (user_id, firstname, lastname, availability, status, created_at, middle, age, rfid)
      VALUES ($1, $2, $3, 2, 1, NOW(), $4, $5, $6)
      RETURNING *;
    `;
    const facultyValues = [userID, firstname, lastname, middle, age, rfid];

    const facultyResult = await pool.query(facultyQuery, facultyValues);
    const newFaculty = facultyResult.rows[0];

    res.json({ message: "Account created successfully", faculty: newFaculty });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error registering faculty" });
  }
});

// Faculty login endpoint
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  console.log('Login request received:', { email, password });

  try {
    const result = await pool.query("SELECT * FROM tbl_users WHERE email = $1", [email]);
    const user = result.rows[0];
    console.log('User found:', user);

    if (!user) {
      console.log('User not found');
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    console.log('Password valid:', isPasswordValid);

    if (!isPasswordValid) {
      console.log('Invalid password');
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const facultyResult = await pool.query("SELECT * FROM tbl_faculty WHERE user_id = $1", [user.id]);
    const faculty = facultyResult.rows[0];
    console.log('Faculty info:', faculty);

    res.status(200).json({
      message: "Login successful",
      user_id: user.id,
      name: user.name,
      email: user.email,
      facultyInfo: faculty,
    });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ message: "Error during login" });
  }
});

// Fetch all faculty members
app.get("/faculty", async (req, res) => {
  try {
    const facultyQuery = `  
      SELECT f.id, f.user_id, f.lastname, f.firstname, f.availability, f.status, f.created_at, f.rfid
      FROM tbl_faculty f;
    `;
    const facultyResult = await pool.query(facultyQuery);
    res.status(200).json(facultyResult.rows);
  } catch (error) {
    console.error("Error fetching faculty members:", error);
    res.status(500).json({ error: "Failed to fetch faculty members" });
  }
});

// Fetch faculty status counts
app.get("/faculty/status", async (req, res) => {
  try {
    const statusQuery = `
      SELECT 
        COUNT(*) FILTER (WHERE availability = 1) AS available,
        COUNT(*) FILTER (WHERE availability = 2) AS busy,
        COUNT(*) FILTER (WHERE availability = 0) AS offline
      FROM tbl_faculty;
    `;
    const statusResult = await pool.query(statusQuery);
    res.status(200).json(statusResult.rows[0]);
  } catch (error) {
    console.error("Error fetching faculty status counts:", error);
    res.status(500).json({ error: "Failed to fetch faculty status counts" });
  }
});

// Delete a faculty member
app.delete("/faculty/:id", async (req, res) => {
  const { id } = req.params;
  console.log(`Received request to delete user with id: ${id}`);

  try {
    const deleteFacultyQuery = `DELETE FROM tbl_faculty WHERE user_id = $1`;
    await pool.query(deleteFacultyQuery, [id]);

    const deleteUserQuery = `DELETE FROM tbl_users WHERE id = $1`;
    await pool.query(deleteUserQuery, [id]);

    res.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ error: "Failed to delete user" });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});



// Fetch faculty data by user_id
app.get("/faculty/:user_id", async (req, res) => {
  const { user_id } = req.params;
  console.log(`Fetching faculty data for user_id: ${user_id}`);

  try {
    const facultyQuery = `
      SELECT * FROM tbl_faculty WHERE user_id = $1;
    `;
    const facultyResult = await pool.query(facultyQuery, [user_id]);

    if (facultyResult.rows.length === 0) {
      console.log(`No faculty found for user_id: ${user_id}`);
      return res.status(404).json({ message: "Faculty not found" });
    }

    const faculty = facultyResult.rows[0];
    res.status(200).json(faculty);
  } catch (error) {
    console.error("Error fetching faculty data:", error);
    res.status(500).json({ message: "Failed to fetch faculty data" });
  }
});



app.get('/get-ip', (req, res) => {
  console.log(req.ip); // Logs the IP of the device
  res.send({ ip: req.ip });
});




// Update faculty availability
app.put("/faculty/:id/availability", async (req, res) => {
  const { id } = req.params;
  const { availability } = req.body; // New availability status

  try {
    if (![0, 1, 2].includes(availability)) {
      return res.status(400).json({ message: "Invalid availability status" });
    }

    const updateQuery = `
      UPDATE tbl_faculty
      SET availability = $1
      WHERE user_id = $2
      RETURNING *;
    `;
    const result = await pool.query(updateQuery, [availability, id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Faculty member not found" });
    }

    const updatedFaculty = result.rows[0];
    res.status(200).json({ message: "Availability updated successfully", faculty: updatedFaculty });
  } catch (error) {
    console.error("Error updating availability:", error);
    res.status(500).json({ message: "Failed to update availability" });
  }
});



// Update faculty availability
app.put("/update-availability/:facultyId", async (req, res) => {
  const { facultyId } = req.params;
  const { availability } = req.body; // Availability value passed in the request body

  if (availability === undefined) {
    return res.status(400).json({ message: "Availability is required" });
  }

  try {
    // Update the availability in the tbl_faculty table
    const query = `
      UPDATE tbl_faculty
      SET availability = $1
      WHERE id = $2
      RETURNING *;
    `;
    const result = await pool.query(query, [availability, facultyId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Faculty not found" });
    }

    const updatedFaculty = result.rows[0];
    res.status(200).json({ message: "Availability updated successfully", faculty: updatedFaculty });
  } catch (error) {
    console.error("Error updating availability:", error);
    res.status(500).json({ message: "Error updating availability" });
  }
});



// Endpoint to update availability
app.put("/update-availability/:id", async (req, res) => {
  const { id } = req.params;
  const { availability } = req.body;

  try {
    const updateQuery = `
      UPDATE tbl_faculty
      SET availability = $1
      WHERE id = $2
      RETURNING *;
    `;
    const updateValues = [availability, id];

    const result = await pool.query(updateQuery, updateValues);

    if (result.rows.length > 0) {
      res.status(200).json({ message: "Availability updated successfully", faculty: result.rows[0] });
    } else {
      res.status(404).json({ message: "Faculty not found" });
    }
  } catch (error) {
    console.error("Error updating availability:", error);
    res.status(500).json({ message: "Error updating availability" });
  }
});
