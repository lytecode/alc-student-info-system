let express = require('express');
let mongoose = require('mongoose');
let bodyParser = require('body-parser');
let cors = require('cors');
let path = require('path');
let Student = require('./models/student');

//create express app
let app = express();
//set our port
//let port = 3500;

//View Engine
//app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//Set Static folder for all the Angular stuffs
app.use(express.static(__dirname +'/views/css'));

//connect to mongodb
mongoose.connect('mongodb://alc:12345@ds257485.mlab.com:57485/student-record'); //for production
//mongoose.connect('mongodb://localhost:27017/studentrecord'); //for local

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


//retrieve all students: used to be /students {Home Page}
app.get('/', function(req, res){
	//find all students in the DB
	Student.find(function(err, students){
		if(err){
			res.send(err);
		}
		else{
			//let data = students;
			//console.log('students data', data);
			res.render('index', {students: students});
		}
	});
});


app.get('/about', function(err, res){
	if(err){
		console.log("Start the server: ", err);
	}
	res.render('about');
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



//get one student for Editing
app.get('/student/:id', function(req, res){
	Student.findById(req.params.id, function(err, student){
		if(err){
			console.log("cannot find student: ", err);
		}
		else{
			res.render('editStudent', {student: student});
		}
	});
});


//update srudent's record, after editing
app.post('/student/:id', urlencodedParser, (req, res)=> {
	Student.findByIdAndUpdate(req.params.id, 
		{$set: {
				firstname: req.body.firstname,
			    lastname:  req.body.lastname,
			    regno: req.body.regno,
			    email: req.body.email,
			    dept: req.body.dept,
			    sex: req.body.sex
			}
		},
		{new: true}, function(err, student){
			if(err){
				console.log("Error: cannot update; ", err);//res.json(err);
				res.render('editStudent', {student: req.body});
			}
	    	//console.log("student record updated successfully ");

	    	res.render('update-success');
	});
});


//delete student
app.post('/student/delete/:id',  function(req, res){
	Student.findByIdAndRemove( {_id: req.params.id}, function(err) {
		if(err){
			console.log("Delete error: ", err);
		}
		//console.log("Student deleted successful");
		res.redirect("/");
	});
	
});



app.listen(process.env.PORT || 5000, ()=> {
	console.log('App started ');
});