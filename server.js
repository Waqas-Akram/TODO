// jshint esversion:6
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');
const app = express();

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(express.static(__dirname+"/public"));
app.set('view engine', 'ejs');
mongoose.connect('mongodb://localhost:27017/todo_DB',{useNewUrlParser:true , useUnifiedTopology: true  });
const listSchema = new mongoose.Schema(
    {
        item_name:String
    }
);
const Item = mongoose.model("Item",listSchema);
app.get("/", function (req, res) {
    let today = new Date();

    let options = {
        weekday: "long",
        day: "numeric",
        month: "long"
    };
    let day = today.toLocaleDateString("en-US", options);
    Item.find({},function(err,items){
        if(err){
            console.log(err);
        }
        else{
            res.render("list", {
                kindOfDay: day,
                pushedHere: items
            });
        }
    });
   
});
    app.post("/", function (req, res) {
       let text = req.body.menuName;
       const itemName = new Item(
           {
               item_name:text
           }
       );
       itemName.save();
        res.redirect("/");


    });
    app.post("/deleteItems" ,function(req,res){
        const checkbox = req.body.deleteCheck;
        Item.findByIdAndRemove(checkbox,function(err){
            if(err){
            console.log(err);
        }
        else{
            console.log('item deleted');
            res.redirect('/');
        }
    });
});
app.get('/instructions' , function(req,res){
    res.render('instructions');
});
app.get('/contact',function(req,res){
    res.render('contact');
});
app.post("/contact" ,function(req,res){
    let name = req.body.yourName;
    let email = req.body.yourEmail;
    let message = req.body.yourMessage;
    let transporter = nodemailer.createTransport({
      service:'Outlook',
      auth: {
        user: 'your email',
        pass: <your mail password>
      }
    });
    let mailOptions = {
      from : 'Waqas Akram <waqasakram512@outlook.com>',
      to: 'waqasakram512@outlook.com',
      subject:'Website Submission',
      text: "You have the submission with the following details...Name :"+ name+'Email :'+email+' Message :'+message,
      html: 'You have the submission with the following details...<p><ul><li>Name :'+name+'</li><li>Email : '+email+'</li><li>Message : '+message+'</li></ul> </p>'
    };
    transporter.sendMail(mailOptions,function(error , info){
      if(error){
      //  res.redirect('/failure');
        console.log(error);
        
      }
      else{
        res.redirect('/success');
        console.log("Message Sent"+info.response);
        
      }
  
    });
  });
  app.get('/success',function(req,res){
      res.render('success');
  });
  app.post('/success/send',function(req,res){
      res.redirect('/');
  });
app.listen(3000, function () {
    console.log("server is started on port 3000");
});
