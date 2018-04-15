const express= require('express');
const exphbs= require('express-handlebars')
const path= require('path');
const app= express();
const bodyparser=require('body-parser');
const methodOverride= require('method-override')
const flash= require('connect-flash');
const session= require('express-session');
const ideas= require('./routes/ideas');
const users= require('./routes/users');
const passport= require('passport');

require('./mongoose').connect()
.then(function(){
  console.log('connected');
})
.catch(function(err){
  console.log(err)
})

//Passport config
require('./config/passport')(passport);


app.engine('handlebars',exphbs({defaultLayout:'main'}));
app.set('view engine', 'handlebars');
app.set('views',path.join(__dirname,'./views'));

// body parser middleware
app.use(bodyparser.urlencoded({extended:false}));
app.use(bodyparser.json());

// for static file
app.use(express.static(path.join(__dirname,'public')));
// method override middleware
app.use(methodOverride('_method'));

// session middleware
app.use(session({
  secret: 'secret',
  resave:true,
  saveUninitialized:true
}));

//passport middleware
app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

// Global variables
app.use(function(req,res,next){
  res.locals.success_msg=req.flash('success_msg');
  res.locals.error_msg=req.flash('error_msg');
  res.locals.error=req.flash('error');
  res.locals.user=req.user|| null;
  next();
})

var title="Welcome";
app.get('/', function(req,res){
  res.render('index',{ title:title});
});

//user login route



app.use('/ideas',ideas);
app.use('/users',users);


app.listen(5050,()=>{
  console.log('listening');
});
