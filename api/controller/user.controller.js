import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import db from '../database/configdb.js';

const register = async (req, res) => {
    console.log("Registering user:", req.body);
    if (!req.body || !req.body.name || !req.body.email || !req.body.password) {
        return res.status(400).json({ message: 'Name, email and password are required' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(req.body.email)) {
        console.log("Invalid email format:", req.body.email);
        return res.status(400).json({ message: 'Invalid email format' });
    }

    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    if (!passwordRegex.test(req.body.password)) {
        console.error("Invalid password format:", req.body.password);
        return res.status(400).json({ message: 'Invalid password format. Password must be at least 8 characters long and include at least one letter and one number.' });
    }

    const { name, email, password } = req.body;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    try {
        const result = await db.pool.query(
            'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *',
            [name, email, hashedPassword]
        );
        console.log("User saved:", result.rows[0]);
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        if (error.code === '23505') { // Unique violation
            return res.status(400).json({ message: 'Email already exists' });
        }
        console.error("Error saving user:", error);
        return res.status(500).json({ message: `Error saving user: ${error.message}` });
    }
};

const login = async (req, res) => {
    console.log("Logging in user:", req.body);
    if (!req.body || !req.body.email || !req.body.password) {
        return res.status(400).json({ message: 'Email and password are required' });
    }

    const { email, password } = req.body;

    try {
        const result = await db.pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (result.rows.length === 0) {
            console.log("User not found with email:", email);
            return res.status(404).json({ message: 'User not found' });
        }

        const user = result.rows[0];
        const isMatch = await bcrypt.compare(password, user.password);
        console.log("Password match:", isMatch);
        if (!isMatch) {
            console.log("Invalid credentials for user:", user.email);
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        console.log("User logged in successfully", user.email);
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.status(200).json({ message: 'Login successful', token });
    } catch (error) {
        console.error("Error logging in user:", error);
        return res.status(500).json({ message: `Error logging in user: ${error.message}` });
    }
}

const getAllUsers = async (req, res) => {
    try {
        console.log("Fetching all users");
        const result = await db.pool.query('SELECT id, name, email, created_at FROM users');
        if (result.rows.length === 0) {
            console.log("No users found");
            return res.status(404).json({ message: 'No users found' });
        }
        console.log("Users found:", result.rows);
        res.status(200).json(result.rows);
    } catch (error) {
        console.error("Error fetching users:", error);
        return res.status(500).json({ message: `Error fetching users: ${error.message}` });
    }
}

export default { 
    register,
    login,
    getAllUsers
};