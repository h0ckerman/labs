const express = require('express');
const cors = require('cors');

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator');

const sequelize = require("./db");
const { Employee, Visit, EmployeeVisit, User } = require('./models/model');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

const authenticateUser = (req, res, next) => {
    const token = req.headers.authorization;

    if (!token) {
        return res.status(401).json({ message: 'Unauthorized: No token provided' });
    }

    jwt.verify(token, '123', (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Unauthorized: Invalid token' });
        }
        req.user = decoded;
        next();
    });
};



app.post('/employees', authenticateUser, async (req, res) => {
    try {
        const { name } = req.body;
        const employee = await Employee.create({ name });
        res.status(201).json(employee);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.get('/employees', async (req, res) => {
    try {
        const employees = await Employee.findAll();
        res.status(200).json(employees);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.get('/employees/:id', authenticateUser, async (req, res) => {
    try {
        const { id } = req.params;
        const employee = await Employee.findByPk(id);
        if (employee) {
            res.status(200).json(employee);
        } else {
            res.status(404).json({ error: 'Employee not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.put('/employees/:id', authenticateUser, async (req, res) => {
    try {
        const { id } = req.params;
        const { name } = req.body;
        const [updatedRows] = await Employee.update({ name }, { where: { id } });
        if (updatedRows > 0) {
            res.status(200).json({ message: 'Employee updated successfully' });
        } else {
            res.status(404).json({ error: 'Employee not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.delete('/employees/:id', authenticateUser, async (req, res) => {
    try {
        const { id } = req.params;
        const deletedRows = await Employee.destroy({ where: { id } });
        if (deletedRows > 0) {
            res.status(200).json({ message: 'Employee deleted successfully' });
        } else {
            res.status(404).json({ error: 'Employee not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.post('/visits', authenticateUser, async (req, res) => {
    try {
        const { title, description, employees } = req.body.data;
        const visit = await Visit.create({ title, description });

        if (employees && employees.length > 0) {
            const associatedEmployees = await Employee.findAll({
                where: {
                    id: employees,
                },
            });

            await visit.addEmployees(associatedEmployees);
        }

        res.status(201).json(visit);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.get('/visits', authenticateUser, async (req, res) => {
    try {
        const visits = await Visit.findAll({
            include: Employee,
        });
        res.status(200).json(visits);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.get('/visits/:id', authenticateUser, async (req, res) => {
    try {
        const { id } = req.params;
        const visit = await Visit.findByPk(id, {
            include: Employee,
        });
        if (visit) {
            res.status(200).json(visit);
        } else {
            res.status(404).json({ error: 'Visit not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.put('/visits/:id', authenticateUser, async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, employees } = req.body.data;

        const visit = await Visit.findByPk(id);
        if (!visit) {
            return res.status(404).json({ error: 'Visit not found' });
        }

        await visit.update({ title, description });

        if (employees && employees.length > 0) {
            const associatedEmployees = await Employee.findAll({
                where: {
                    id: {
                        [Op.in]: employees,
                    },
                },
            });

            await visit.setEmployees(associatedEmployees);
        } else {
            await visit.setEmployees([]);
        }

        res.status(200).json({ message: 'Visit updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.delete('/visits/:id', authenticateUser, async (req, res) => {
    try {
        const { id } = req.params;
        const deletedRows = await Visit.destroy({ where: { id } });
        if (deletedRows > 0) {
            res.status(200).json({ message: 'Visit deleted successfully' });
        } else {
            res.status(404).json({ error: 'Visit not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.post('/employee-visits', authenticateUser, async (req, res) => {
    try {
        const { employeeId, visitId } = req.body;

        const employee = await Employee.findByPk(employeeId);
        const visit = await Visit.findByPk(visitId);

        if (!employee || !visit) {
            return res.status(404).json({ error: 'Employee or Visit not found' });
        }

        await visit.addEmployee(employee);

        res.status(201).json({ message: 'Association created successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.get('/employee-visits', authenticateUser, async (req, res) => {
    try {
        const employeeVisits = await EmployeeVisit.findAll({
            include: [Employee, Visit],
        });

        res.status(200).json(employeeVisits);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.delete('/employee-visits', authenticateUser, authenticateUser, async (req, res) => {
    try {
        const { employeeId, visitId } = req.body;

        const deletedRows = await EmployeeVisit.destroy({
            where: {
                EmployeeId: employeeId,
                VisitId: visitId,
            },
        });

        if (deletedRows > 0) {
            res.status(200).json({ message: 'Association deleted successfully' });
        } else {
            res.status(404).json({ error: 'Association not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


// AUTH

app.post('/register', [
    check('username').notEmpty(),
    check('email').isEmail(),
    check('password').isLength({ min: 2 }),
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { username, email, password } = req.body;
        const existingUser = await User.findOne({
            where: {
                username: username,
                email: email,
            },
        });

        if (existingUser) {
            return res.status(400).json({ message: 'Username or email is already taken.' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await User.create({
            username,
            email,
            password: hashedPassword,
        });

        const token = jwt.sign({ userId: newUser.id }, '123', { expiresIn: '1h' });

        res.json({ token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
});

app.post('/login', [
    check('username').notEmpty(),
    check('password').isLength({ min: 2 }),
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { username, password } = req.body;

        const user = await User.findOne({ where: { username } });

        if (!user) {
            return res.status(401).json({ message: 'Invalid username or password.' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid username or password.' });
        }

        const token = jwt.sign({ userId: user.id, username: user.username, email: user.email }, '123', { expiresIn: '1h' });

        res.json({ token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

app.post('/changepassword', [
    check('username').notEmpty(),
    check('currentPassword').notEmpty(),
    check('newPassword').isLength({ min: 2 }),
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { username, currentPassword, newPassword } = req.body;

        const user = await User.findOne({ where: { username } });

        if (!user) {
            return res.status(401).json({ message: 'Invalid username.' });
        }

        const isPasswordValid = await bcrypt.compare(currentPassword, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid current password.' });
        }

        const hashedNewPassword = await bcrypt.hash(newPassword, 10);
        await User.update({ password: hashedNewPassword }, { where: { username } });

        res.json({ message: 'Password changed successfully.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});




const start = async () => {
    try {
        await sequelize.authenticate()
        await sequelize.sync()
        app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
    } catch (error) {
        console.log(error);
    }
}
start()