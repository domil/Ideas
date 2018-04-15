const mongoose= require('mongoose');
const Schema=mongoose.Schema;

// Create Model
const IdeaSchema= new Schema({
  title:{
    type:String,
    required:true
  },
  details:{
    type:String,
    required:true
  },
  user:{
   type:String,
   required:true
},
  date:{
    type:Date,
    default: Date.now
  }
});

const ideas=mongoose.model('ideas',IdeaSchema);
module.exports= ideas;
