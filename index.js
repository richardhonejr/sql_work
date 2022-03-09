//create imports for express, sequelize models and set variables
const express = require('express');
const { Sequelize } = require('sequelize');
const app = express();
//config contains the info to connect to the database
const config = require('./config');
//sets up the model for the table from school_records
const Student = require('./Models/Student');


app.use(express.urlencoded({ extended: false }));
// app.use(recordsMiddleware);


//Establish a connetion to the database
config.authenticate().then(function () {
    console.log('Database is connected');
}).catch(function (err) {
    console.log(err);
});

//function to create the recordsMiddleware for counting routes used
function recordsMiddleware(req, res, next) {
    next();
    console.log('Records counting Middleware active');
    //count query requests
    console.log("the count for '/' is " + countHome);
    console.log("the count for '?id=' is " +countId);
    console.log("the count for '?section=' is " + countSection);
    //count various status codes returned
    console.log("the count for Status Code 200 is " + count200);
    console.log("the count for Status Code 404 is " + count404);
    console.log("the count for Status Code 500 is " + count500);
    console.log("=============================================");
};


//list all students in the students table from the school_records database
//find students by id using ?id=
//find students by section using ?section=

//initialize counts to 0
var countHome = 0;
var countId = 0;
var countSection = 0;
var count200 = 0;
var count404 = 0;
var count500 = 0;

app.get('/', recordsMiddleware, function (req, res) {
    let data = {
        where: {}
    };

    if (req.query.id ==undefined || req.query.section==undefined) {
        countHome++;
    };

    //find student by id
    if (req.query.id !== undefined) {
        data.where.id = req.query.id;
        countId++;
    } 

    //find student by section
    if (req.query.section !== undefined) {
        data.where.section = req.query.section;
        countSection++;
    } 

    //look at the content of the data and the query
    // console.log(req.query.id);
    // console.log(data);

    //return the results with a promise
    //watch for empty array using findAll
    Student.findAll(data).then(function (result) {
        //test for the inputs and outputs, results
        // console.log(data);
        // console.log(result);
        // console.log(result.length);

        //create the promise for the results
        //traps the empty array and enforces status 404
        if (result.length == 0) {
            count404++;
            console.log('Empty array - 404 no data, record not found');
            res.sendStatus(404);
            
        } else {
            count200++;
            res.status(200).send(result);
            
        }

    }).catch(function (err) {
        count500++;
        res.status(500).send(err);
        
    });
});


//Create a new student using post
app.post('/', function(req, res){
    Student.create(req.body).then(function(result){
        res.redirect('/'); //Redirect to the get route to display all students
    }).catch(function(err){
        res.status(500).send(err);
    });
});

//Update student name using patch
app.patch('/:student_id', function(req, res){
    let studentId = req.params.student_id;

    //Find the student 
    Student.findByPk(studentId).then(function(result){
        //Check if student was found
        if(result){
            //Update student record
            result.name = req.body.name;

            //Save changes to DB
            result.save().then(function(){
                res.redirect('/');
            }).catch(function(err){
                res.status(500).send(err);
            });
        }
        else {
            res.status(404).send('Student record not found');
        }

    }).catch(function(err){
        res.status(500).send(err);
    });
});

//Delete a student record using delete
app.delete('/:student_id', function(req, res){
    let studentId = req.params.student_id;

    //Find the student
    Student.findByPk(studentId).then(function(result){

        if(result){
            //Delete student from database
            result.destroy().then(function(){
                res.redirect('/');
            }).catch(function(err){
                res.status(500).send(err);
            });
        }
        else {
            res.status(404).send('Student record not found');
        }

    }).catch(function(err){
        res.status(500).send(err);
    });
});


//connect to the server at port 3000
app.listen(3000, function () {
    console.log('Server is running on port 3000...');
});