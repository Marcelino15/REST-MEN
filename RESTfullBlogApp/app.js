
const express   = require('express'),
app         = express(),
expressSanitizer = require('express-sanitizer'),
port        = 3000,
bodyParser  = require("body-parser"),
methodOverride = require("method-override"),
mongoose    = require('mongoose');

/*--- App Config ---*/
mongoose.connect('mongodb://localhost:27017/RESTfull', {useNewUrlParser: true, useUnifiedTopology: true});
app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');
app.use(express.static("public"));
app.use(expressSanitizer());
app.use(methodOverride("_method"));


/*--- Mongoose/Model Config ---*/
var blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created: {type: Date, default: Date.now}
});
var Blog = mongoose.model("Blog", blogSchema);
// Blog.create({
//     title: "Test Blog",
//     image: "https://images.unsplash.com/photo-1517423440428-a5a00ad493e8?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=687&q=80",
//     body: "Hello this is a blog post!"
// })

/*--- Restfull Routes ---*/
// Index Route
app.get('/', (re, res) => {
    res.redirect('/blogs');
});

// Index Route
app.get('/blogs', (req, res) => {
    Blog.find({}, function(err, blogs){
        if(err){
            console.log("ERROR!");  
        }else{
            res.render("index", {blogs: blogs});
        }
    });
});

// Add Blogs Route
app.get("/blogs/new", (req, res) => {
    res.render("new");
});

// Save Blogs Route
app.post("/blogs", (req, res) => {
    console.log(req.body);
    req.body.blog.body = req.sanitize(req.body.blog.body)
    console.log("==========")
    Blog.create(req.body.blog, (err, newBlog) => {
        if(err){
            res.render("new");
        }else{
            res.redirect("/blogs");
        }
    });
});

// Show Blogs Route
app.get("/blogs/:id", (req, res) => {
    Blog.findById(req.params.id, (err, foundBlog) => {
        if(err){
            res.redirect("/blogs");
        }else{
            res.render("show", {blog: foundBlog});
        }
    });
});

// Edit Blogs Route
app.get("/blogs/:id/edit", (req, res) => {
    Blog.findById(req.params.id, (err, foundBlog) => {
        if(err){
            res.redirect("/blogs");
        }else{
            res.render("edit", {blog: foundBlog});
        }
    });
});

// Update Blogs Route
app.put("/blogs/:id",(req,res) => {
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, (err, updateBlog) => {
        if(err){
            res.redirect("/blogs");
        }else{
            res.redirect("/blogs/"+req.params.id);
        }
    });
});

// Delete Route
app.delete("/blogs/:id", (req, res) => {
    Blog.findByIdAndRemove(req.params.id, (err) => {
        if(err){
            res.redirect("/blogs");
        }else{
            res.redirect("/blogs")
        }
    });
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
});
