var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var methodOverride = require("method-override");
var expressSanitizer = require("express-sanitizer");

mongoose.connect("mongodb://localhost/blog_app");


app.set("view engine","ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended : true}));
app.use(expressSanitizer());
app.use(methodOverride("_method"));



var blogSchema = new mongoose.Schema({
    title: String,
    image : String,
    body : String,
    created : {type : Date, default : Date.now}
});

var Blog = mongoose.model("Blog" , blogSchema) ;

app.get("/",function(req,res){
    res.redirect("/blogs");
});

//INDEX ROUTES
app.get("/blogs",function(req,res){
    Blog.find({},function(err,blogs){
        res.render("indexpage",{blogs : blogs});
    });
});

// NEW ROUTE 
app.get("/blogs/new",function(req,res){
    res.render("new");
});

// CREATE ROUTE
app.post("/blogs",function(req,res){
    // create blog
    console.log(req.body);
   
    console.log("===================");
    console.log(req.body);
    Blog.create(req.body.blog , function(err , newBlog){
       if(err){
           res.render("new");
       }else{
        res.redirect("/blogs");
       }
    });
});

//SHOW ROUTE
app.get("/blogs/:id" , function(req,res){
    Blog.findById(req.params.id , function(err,foundBlog){
        if(err){
            res.redirect("/blogs");
        }else{
            res.render("show" , {blog : foundBlog});
        }
    });
    
});

// EDIT ROUTE
app.get("/blogs/:id/edit",function(req,res){
    Blog.findById(req.params.id,function(err, foundBlog){
        if(err){
            res.redirect("/blogs");
        }else{
            res.render("edit", {blog : foundBlog});
        }
    });
  
});

// UPDATE ROUTE
app.put("/blogs/:id" ,function(req,res){
    req.body.blog.body = req.sanitize(req.body.blog.body)
    Blog.findByIdAndUpdate(req.params.id , req.body.blog , function(err,updatedBlog){
        if(err){
            res.redirect("/blogs");
        }else{
            res.redirect("/blogs/" + req.params.id);
        }
    });
});

// DESTROY ROUTE
app.delete("/blogs/:id",function(req,res){
    Blog.findByIdAndRemove(req.params.id , function(err){
        if(err){
            res.redirect("/blogs");
        }else{
            res.redirect("/blogs");
        }
    });
});

app.listen(3000,function(req,res){
    console.log("BLOG APP SERVER STARTED !!!");
});