const express = require('express');
const cors = require('cors');
const fs = require('fs').promises;
const path = require('path');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

const DATA_FILE_PATH = path.join(__dirname, '../data/data.json');
const EMPLOYEES_FILE_PATH = path.join(__dirname, '../data/employees.json');

app.get('/api/data', async (req, res) => {
    try {
        const data = await fs.readFile(DATA_FILE_PATH, 'utf-8');
        res.json(JSON.parse(data));
    } catch (error) {
        console.error('Error reading data file:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.get('/api/data/:id', async (req, res) => {
    const { id } = req.params;
    console.log(`Fetching entry with ID: ${id}`);

    try {
        const data = await fs.readFile(DATA_FILE_PATH, 'utf-8');
        const allData = JSON.parse(data);
        const entry = allData.find((item) => item.id === parseInt(id, 10));

        if (entry) {
            res.json(entry);
        } else {
            res.status(404).send('Entry not found');
        }
    } catch (error) {
        console.error('Error reading data file:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.get('/api/employee/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const employeesData = await fs.readFile(EMPLOYEES_FILE_PATH, 'utf-8');
        const employees = JSON.parse(employeesData);

        const employee = employees.find((e) => e.id === parseInt(id, 10));

        if (!employee) {
            res.status(404).json({ error: 'Employee not found' });
            return;
        }

        res.json(employee);
    } catch (error) {
        console.error('Error reading employees file:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.put('/api/employee', async (req, res) => {
    try {
        const { visitId, employeeId } = req.body;

        const data = await fs.readFile(DATA_FILE_PATH, 'utf-8');
        const jsonData = JSON.parse(data);

        const visit = jsonData.find((visit) => visit.id === visitId);

        if (!visit) {
            return res.status(404).json({ error: 'Visit not found' });
        }

        if (visit.employees.includes(employeeId)) {
            return res.status(400).json({ error: 'Employee is already assigned to the visit' });
        }

        visit.employees.push(employeeId);

        await fs.writeFile(DATA_FILE_PATH, JSON.stringify(jsonData, null, 2), 'utf-8');

        res.json({ success: true, message: 'Employee assigned successfully' });
    } catch (error) {
        console.error('Error assigning employee:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.delete('/api/employee', async (req, res) => {
    try {
        const { visitId, employeeId } = req.body;

        const data = await fs.readFile(DATA_FILE_PATH, 'utf-8');
        const jsonData = JSON.parse(data);

        const visit = jsonData.find((visit) => visit.id === visitId);

        if (!visit) {
            return res.status(404).json({ error: 'Visit not found' });
        }

        const employeeIndex = visit.employees.indexOf(employeeId);

        if (employeeIndex === -1) {
            return res.status(400).json({ error: 'Employee is not assigned to the visit' });
        }

        visit.employees.splice(employeeIndex, 1);

        await fs.writeFile(DATA_FILE_PATH, JSON.stringify(jsonData, null, 2), 'utf-8');

        res.json({ success: true, message: 'Employee deassigned successfully' });
    } catch (error) {
        console.error('Error deassigning employee:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.get('/api/employees', async (req, res) => {
    try {
        const employeesData = await fs.readFile(EMPLOYEES_FILE_PATH, 'utf-8');
        const employeesJsonData = JSON.parse(employeesData);
        res.json(employeesJsonData);
    } catch (error) {
        console.error('Error reading employees file:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.put('/api/data/:id', async (req, res) => {
    const updatedData = req.body.data;
    const idToUpdate = parseInt(req.params.id, 10);

    try {
        const currentData = await fs.readFile(DATA_FILE_PATH, 'utf-8');
        const parsedData = JSON.parse(currentData);

        const updatedEntries = parsedData.map((item) =>
            item.id === idToUpdate ? { ...item, ...updatedData } : item
        );

        await fs.writeFile(DATA_FILE_PATH, JSON.stringify(updatedEntries, null, 2));

        res.json({ success: true, data: updatedData });
    } catch (error) {
        console.error('Error updating data:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.delete('/api/data/:id', async (req, res) => {
    const idToDelete = parseInt(req.params.id, 10);

    try {
        const currentData = await fs.readFile(DATA_FILE_PATH, 'utf-8');
        const parsedData = JSON.parse(currentData);

        const updatedEntries = parsedData.filter((item) => item.id !== idToDelete);

        await fs.writeFile(DATA_FILE_PATH, JSON.stringify(updatedEntries, null, 2));

        res.json({ success: true, message: 'Data deleted successfully' });
    } catch (error) {
        console.error('Error deleting data:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.post('/api/data', async (req, res) => {
    const newData = req.body.data;

    try {
        const currentData = await fs.readFile(DATA_FILE_PATH, 'utf-8');
        const parsedData = JSON.parse(currentData);

        const lastUsedId = parsedData.reduce((maxId, entry) => Math.max(maxId, entry.id), 0);

        const newEntry = {
            id: lastUsedId + 1,
            ...newData,
        };

        const updatedData = [...parsedData, newEntry];

        await fs.writeFile(DATA_FILE_PATH, JSON.stringify(updatedData, null, 2));

        res.json({ success: true, data: newEntry });
    } catch (error) {
        console.error('Error writing data to file:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.post('/addEmployee', async (req, res) => {
    const { name } = req.body;

    if (!name) {
        return res.status(400).json({ success: false, error: 'Name is required.' });
    }

    try {
        const currentData = await fs.readFile(EMPLOYEES_FILE_PATH, 'utf-8');
        const parsedData = JSON.parse(currentData);

        const lastUsedId = parsedData.reduce((maxId, entry) => Math.max(maxId, entry.id), 0);

        const newEntry = {
            id: lastUsedId + 1,
            name,
        };

        const updatedData = [...parsedData, newEntry];

        await fs.writeFile(EMPLOYEES_FILE_PATH, JSON.stringify(updatedData, null, 2));

        res.json({ success: true, data: newEntry });
    } catch (error) {
        console.error('Error writing data to file:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.delete('/deleteEmployee/:id', async (req, res) => {
    const idToDelete = parseInt(req.params.id, 10);

    try {
        const currentData = await fs.readFile(EMPLOYEES_FILE_PATH, 'utf-8');
        const parsedData = JSON.parse(currentData);

        const updatedData = parsedData.filter((entry) => entry.id !== idToDelete);

        await fs.writeFile(EMPLOYEES_FILE_PATH, JSON.stringify(updatedData, null, 2));

        res.json({ success: true, message: `Employee with ID ${idToDelete} deleted successfully.` });
    } catch (error) {
        console.error('Error deleting data from file:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.put('/editEmployee/:id', async (req, res) => {
    const idToUpdate = parseInt(req.params.id, 10);
    const { name } = req.body;

    if (!name) {
        return res.status(400).json({ success: false, error: 'Name is required.' });
    }

    try {
        const currentData = await fs.readFile(EMPLOYEES_FILE_PATH, 'utf-8');
        const parsedData = JSON.parse(currentData);

        const updatedData = parsedData.map((entry) =>
            entry.id === idToUpdate ? { ...entry, name } : entry
        );

        await fs.writeFile(EMPLOYEES_FILE_PATH, JSON.stringify(updatedData, null, 2));

        const updatedEntry = updatedData.find((entry) => entry.id === idToUpdate);

        if (!updatedEntry) {
            return res.status(404).json({ success: false, error: 'Employee not found.' });
        }

        res.json({ success: true, data: updatedEntry });
    } catch (error) {
        console.error('Error updating data in file:', error);
        res.status(500).send('Internal Server Error');
    }
});


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});