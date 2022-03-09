//create the model for the students table from the school_records database
const { Sequelize }= require('sequelize');
const config = require('./../config');

//table model
const Student = config.define('Student', {
     id: {
         type: Sequelize.INTEGER,
         autoIncrement: true,
         allowNull: false,
         primaryKey: true
     },
     name: {
         type: Sequelize.STRING,
         allowNull: false
     },
     section: {
         type: Sequelize.STRING,
         allowNull: false
     },
     gpa: {
         type: Sequelize.DECIMAL,
         allowNull: false
     },
     nationality: {
         type: Sequelize.STRING,
         allowNull: false
     }
 }, {timestamps: false});
 
 module.exports = Student; 