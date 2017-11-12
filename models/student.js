let mongoose = require('mongoose');

let StudentSchema = new mongoose.Schema({
	firstname: {type: String, required: true, trim: true},
    lastname: {type: String, required: true, trim: true},
    regno: {type: String, required: true, unique: true},
    email: {type: String, required: true, unique: true},
    dept: String,
    sex: {type: String, enum: ['Male', 'Female', 'male', 'female'], required: true}
});


module.exports = mongoose.model('Student', StudentSchema);