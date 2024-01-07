const {Sequelize} = require('sequelize')

module.exports = new Sequelize(
    'lab9',
    'postgres',
    'toor',
    {
        dialect: 'postgres',
        host: 'localhost',
        port: '5432'
    }

)