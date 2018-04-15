const express= require('express')
const router= express.Router();
const {ensureAuthenticated}=require('../helpers/auth');

const Idea= require('../models/Idea');

//Add idea form
router.get('/add',ensureAuthenticated,function(req,res){
  res.render('ideas/add');
});

// Edit Idea form
router.get('/edit/:id',ensureAuthenticated,function(req,res){
  Idea.findOne({
    _id:req.params.id
  })
  .then(function(idea){
  if(idea.user != req.user.id){
req.flash('error_msg','Not authenticated');
res.redirect('/ideas');
}else{
    res.render('ideas/edit',{
      idea:idea
    });
}
  });
});

// Display Idea
router.get('/',ensureAuthenticated,function(req,res){
  Idea.find({user:req.user.id})
  .sort({date:'desc'})
    .then(function(ideas){
      res.render('ideas/index',{ideas:ideas});
    })
});

// Process form
router.post('/',ensureAuthenticated,function(req,res){
   console.log(req.body);
   let error=[];
   if(!req.body.title){
     error.push({text:"Please add title"})
   }
   if(!req.body.details){
     error.push({text:"Please add details"})
   }
   if(error.length >0){
     res.render('ideas/add',{
       errors:error,
       title:req.body.title,
       details:req.body.details,
     })
   } else{
     var newuser={
       title:req.body.title,
       details:req.body.details,
       user:req.user.id
     }
   Idea(newuser).save()
     .then(function(idea){
       console.log(idea);
       res.redirect('/ideas');
     })
   }
});

router.get('/about', function(req,res){
  res.render('about',{ title:title});
});

// Delte ideas
router.delete('/:id',function(req,res){
  Idea.remove({_id:req.params.id})
  .then(function(){
    req.flash('success_msg','Idea deleted successfully');
    res.redirect('/ideas');
  })
})

// put request
router.put('/:id',ensureAuthenticated,function(req,res){
  Idea.findOne({
    _id:req.params.id
  })
  .then(function(idea){
    idea.title= req.body.title;
    idea.details=req.body.details;
     Idea(idea).save()
     .then(function(idea){
       res.redirect('/ideas');
     })
     .catch(function(err){
       console.log('********',err);
     })
  })
  .catch(function(err){
    console.log('*************',err);
  })
});



module.exports=router;
