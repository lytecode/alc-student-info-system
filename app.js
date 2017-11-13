let express = require('express');
let mongoose = require('mongoose');
let bodyParser = require('body-parser');
let cors = require('cors');
let path = require('path');
let Student = require('./models/student');

//create express app
let app = express();
//set our port
let port = 3500;

//View Engine
//app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//Set Static folder for all the Angular stuffs
app.use(express.static(__dirname +'/views/css'));

//connect to mongodb
mongoose.connect('mongodb://alc:12345@ds257485.mlab.com:57485/student-record');//('mongodb://localhost:27017/studentrecord');

//mongoose on connect
mongoose.connection.on('connected', function(){
	console.log('Connected successfully to mongodb @ 57485');
});

mongoose.connection.on('error', function(err){
	console.log('Error connecting to mongodb '+err);
});


//setup middlewares -cors
app.use(cors());

let urlencodedParser = bodyParser.urlencoded({ extended: false });


//retrieve all students: used to be /students
app.get('/', function(req, res){
	//find all students in the DB
	Student.find(function(err, students){
		if(err){
			res.send(err);
		}
		else{
			let data = students;
			//console.log('students data', data);
			res.render('index', {students: data});
		}
	});
});


//get the form
app.get('/student', function(req, res){
	res.render('addStudent'); 
});

//add a student
app.post('/student', urlencodedParser, function(req, res){

	let data = req.body;

	let student = new Student();

    //we set the Student properties that came from the POST data
    student.firstname = data.firstname;
    student.lastname =  data.lastname;
    student.regno = data.regno;
    student.email = data.email;
    student.dept = data.dept;     
    student.sex = data.sex;

    //save the student data
    student.save(function(err, student){
        if(err){
            res.send(err);
        }
        else{
        	res.render('student-success');
    	}
	});
});



//get one student
app.get('/student/:id', function(req, res){
	Student.findById(req.params.id, function(err, student){
		if(err)
			res.send(err)

		res.render(student);
	});
});


//update srudent's record
app.put('/student/:id', (req, res)=> {
	Student.findById(req.params.id, (err, student)=> {
		if(err)
			res.json(err);

		//update student data
		student.firstname = req.body.firstname;
	    student.lastname =  req.body.lastname;
	    student.regno = req.body.regno;
	    student.email = req.body.email;
	    student.dept = req.body.dept;
	    student.sex = req.body.sex;

	    student.save((err) => {
	    	if(err)
	    		res.json(err);

	    	res.json(student);
	    });

	});
});


//delete student
app.delete('/student/:id', function(req, res, next){
	Student.findByIdAndRemove(req.params.id, (err, student)=> {
		if(err)
			res.json(err);

		res.json({message: 'Student records deleted sucessfully'})
	})
	
});



app.listen(port, ()=> {
	console.log('App started on port '+port);
});