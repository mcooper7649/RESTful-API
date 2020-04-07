
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");    
const mongoose = require('mongoose');   //normal requirements

const app = express();   //express code
app.set('view engine', 'ejs');    //declare our view engine ext

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/wikiDB", {useNewUrlParser: true, useUnifiedTopology: true});    //mongoose server connect info

const articleSchema = {   //Schema
    title: String,
    content: String
  };

const Article = mongoose.model("Article", articleSchema);


/////////////////////Requests Targeting All Articles //////////////////////////////


app.route("articles")

.get(function(req, res){
    Article.find(function(err, foundArticles){
        if(!err){
            res.send(foundArticles)
        }else {
            res.send(err)
        }
        
    })
})

.post(function(req, res){
    const newArticle = new Article({
        title: req.body.title,
        content: req.body.content
    })

    newArticle.save(function(err){
        if(!err){
            res.send("Successfully added new article")
        }else {
            res.send(err)
        }
    })
})

.delete(function(req, res){
    Article.deleteMany(function(err) {
        if(!err){
            res.send("successfully deleted all articles")
        }else{
            res.send(err)
        }
    })
});


/////////////////////Requests Targeting A Specific Article //////////////////////////////


app.route("/articles/:articleTitle")

.get(function(req, res){
    Article.findOne({title: req.params.articleTitle}, function(err, foundArticle){
        if (foundArticle){
            res.send(foundArticle);
        }else{
            res.send("no article found")
        }
    });
})

.put(function(req, res){    //put replaces entire document, so if you are trying to change 1 value the other values will be removed if not specified
    Article.update(
        {title: req.params.articleTitle},
        {title: req.body.title, content: req.body.content},
        {overwrite: true},
        function(err){
            if (!err){
                res.send("Successfully Updated Article")
            }else {
                res.send(err)
            }
        }
    )
})

.patch(function(req, res){
    Article.update(
        {title: req.params.articleTitle},
        { $set: req.body}, 
        function(err){
            if(!err){
                res.send("Successfully updated Article")
            }else {
                res.send(err)
            }
        }
    )
})

.delete(function(req, res){
    Article.deleteOne(
        {title: req.params.articleTitle},
        function(err){
            if(!err){
                res.send("Successfully deleted Article")
            } else {
                res.send(err)
            }
        }
    )
})
      




app.listen(3000, function() {
    console.log("Server started on port 3000");
  });
  