const express = require('express');
const cors = require('cors');

const sequelize = require("./db");
const { Employee, Visit, EmployeeVisit } = require('./models/model');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

app.post('/employees', async (req, res) => {
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

app.get('/employees/:id', async (req, res) => {
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

app.put('/employees/:id', async (req, res) => {
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

app.delete('/employees/:id', async (req, res) => {
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

app.post('/visits', async (req, res) => {
    try {
        const { title, description, employees } = req.body.data;
        const visit = await Visit.create({ title, description });

        if (employees && employees.length > 0) {
            const associatedEmployees = await Employee.findAll({
                where: {
                    id: {
                        [Op.in]: employees,
                    },
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

app.get('/visits', async (req, res) => {
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

app.get('/visits/:id', async (req, res) => {
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

app.put('/visits/:id', async (req, res) => {
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

app.delete('/visits/:id', async (req, res) => {
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

app.post('/employee-visits', async (req, res) => {
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

app.get('/employee-visits', async (req, res) => {
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

app.delete('/employee-visits', async (req, res) => {
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