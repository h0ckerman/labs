const sequelize = require('../db')
const { DataTypes } = require('sequelize')


const Employee = sequelize.define('Employee', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: {
                args: true,
                msg: 'Employee name cannot be empty.',
            },
            len: {
                args: [2, 255],
                msg: 'Employee name should be between 2 and 255 characters.',
            },
        },
    },
});

const Visit = sequelize.define('Visit', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: {
                args: true,
                msg: 'Visit title cannot be empty.',
            },
            len: {
                args: [2, 255],
                msg: 'Visit title should be between 2 and 255 characters.',
            },
        },
    },
    description: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: {
                args: true,
                msg: 'Visit description cannot be empty.',
            },
            len: {
                args: [2, 1000],
                msg: 'Visit description should be between 2 and 1000 characters.',
            },
        },
    },
});

const User = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true,
        },
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
});

const EmployeeVisit = sequelize.define('EmployeeVisit', {});

Employee.belongsToMany(Visit, { through: EmployeeVisit });
Visit.belongsToMany(Employee, { through: EmployeeVisit });

Employee.hasMany(Visit, { as: 'visits', foreignKey: 'employeeId' });
Visit.belongsTo(Employee, { as: 'employee', foreignKey: 'employeeId' });

module.exports = {
    Visit,
    Employee,
    EmployeeVisit,
    User,
    sequelize
};