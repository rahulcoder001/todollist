
const express = require("express");
const bodyparser = require("body-parser");
const mongoose = require('mongoose');
mongoose.set('strictQuery', true);
const _ = require("lodash");


const app = express();
app.set('view engine', 'ejs');
app.use(bodyparser.urlencoded({extended:true}));
app.use(express.static("public"));  


mongoose.connect('mongodb+srv://21012003rs:cXcdjJSvSIfwMKlL@cluster0.hvgbgrr.mongodb.net/?retryWrites=true&w=majority');


const itemsSchema = {
    name: String
  };
  
  const Item = mongoose.model("Item", itemsSchema);
  
  
  const item1 = new Item({
    name: "Welcome to your todolist!"
  });
  
  const item2 = new Item({
    name: "Hit the + button to add a new item."
  });
  
  const item3 = new Item({
    name: "<-- Hit this to delete an item."
  });
  
  const defaultItems = [item1, item2, item3];
  
  const listSchema = {
    name: String,
    items: [itemsSchema]
  };
  
  const List = mongoose.model("List", listSchema);
  
  
  app.get("/", function(req, res) {
  
    Item.find({}, function(err, foundItems){
  
      if (foundItems.length === 0) {
        Item.insertMany(defaultItems, function(err){
          if (err) {
            console.log(err);
          } else {
            console.log("Successfully savevd default items to DB.");
          }
        });
        res.redirect("/");
      } else {
        res.render("list", {listTitle: "Today", newListItems: foundItems});
      }
    });
  
  });
  
  app.get("/:customListName", function(req, res){
    const customListName = _.capitalize(req.params.customListName);
  
    List.findOne({name: customListName}, function(err, foundList){
      if (!err){
        if (!foundList){
          //Create a new list
          const list = new List({
            name: customListName,
            items: defaultItems
          });
          list.save();
          res.redirect("/" + customListName);
        } else {
          //Show an existing list
  
          res.render("list", {listTitle: foundList.name, newListItems: foundList.items});
        }
      }
    });
  
    // cXcdjJSvSIfwMKlL
  
  });
  
  app.post("/", function(req, res){
  
    const itemName = req.body.newItem;
    const listName = req.body.list;
  
    const item = new Item({
      name: itemName
    });
  
    if (listName === "Today"){
      item.save();
      res.redirect("/");
    } else {
      List.findOne({name: listName}, function(err, foundList){
        foundList.items.push(item);
        foundList.save();
        res.redirect("/" + listName);
      });
    }
  });
  
  app.post("/delete", function(req, res){
    const checkedItemId = req.body.checkbox;
    const listName = req.body.listName;
  
    if (listName === "Today") {
      Item.findByIdAndRemove(checkedItemId, function(err){
        if (!err) {
          console.log("Successfully deleted checked item.");
          res.redirect("/");
        }
      });
    } else {
      List.findOneAndUpdate({name: listName}, {$pull: {items: {_id: checkedItemId}}}, function(err, foundList){
        if (!err){
          res.redirect("/" + listName);
        }
      });
    }
  
  
  });
  
  app.get("/about", function(req, res){
    res.render("about");
  });
  
  app.listen(3000, function() {
    console.log("Server started on port 3000");
  });
  
// const express = require("express");
// const bodyparser = require("body-parser");
// const date = require(__dirname + "/date.js");
// const mongoose = require('mongoose');
// mongoose.set('strictQuery', true);
// mongoose.connect('mongodb://127.0.0.1:27017/todolistDB',{useNewUrlParser: true});


// // let items = ["Buy food","Cook food","Eat time"];
// // let workitems = [];


// const app = express();
// app.set('view engine', 'ejs');
// app.use(bodyparser.urlencoded({extended:true}));
// app.use(express.static("public"));  


// // mongoose.connect("mongodb://localhost:27017/todolistDB", {useNewUrlParser: true});


// const todolistShema = ({
//     name:String
// });
// const listSchema = ({
//     name:String,
//     itemms: [todolistShema]
// })
// const items = mongoose.model("items",todolistShema);
// const list = mongoose.model("list", listSchema);

// const item1 = new items({
//     name:"Welcome to your todo list"
// });
// const item2 = new items({
//     name:"hit the  + button to add your own list"
// });
// const item3 = new items({
//     name:"hit this to delete items"
// });


// const defaultitem = [item1,item2,item3];


// // items.insertMany(defaultitem,function(err){
// //     if(err){
// //         console.log("found error")
// //     }
// //     else{
// //         console.log("succesfully addes");
// //     }
// // });


// app.get("/", function(req,res){
//     let day = date();
//  items.find({},function(err,data){
//     res.render("list",{kindofday:day,newlistitems:data});
//  });
//    let today = new datee();
//    let options = {
//     weekday: "long",
//     day: "numeric",
//     month: "long"
//    };
//    let day = today.toLocaleDateString("en-US", options)
// let day = date();
//    if(today.getDay()== 6 || today.getDate()==0){
//     // res.send("yeyy its weeekend")
//     day = "weekend";
//    }else{
//     // res.send("shitt i have to work")
//     day = "working day"
//    }
// });


// app.post("/delete", function(req,res){
//     const checkid =  req.body.cheekbox;
//     items.findByIdAndRemove(checkid,function(err){
//         if(!err){
//             console.log("successfully deleted checked item");
//             res.redirect("/");
//         }
//     });
// });


// app.post("/",function(req,res){
//     // console.log(req.body);
//     let item = req.body.newitem;
//     // items.push(item);
//     // res.redirect("/");
//     // if (req.body.list == "working"){
//     //     // workitems.push(item);
//     //     const newitem = new items({
//     //         name: item
//     //     });
//     //     newitem.save();
//     //     res.redirect("/work");
//     // }
//     // else{
//         // }
//         const newitem = new items({
//             name: item
//         });
//         newitem.save();
//         res.redirect("/")
//    res.render("list", {newitem:item});
// });
// app.post("/",function(req,res){
//     // console.log(req.body);
//     let item = req.body.newitem;
//     // items.push(item);
//     // res.redirect("/");
//     // if (req.body.list == "working"){
//     //     // workitems.push(item);
//     //     const newitem = new items({
//     //         name: item
//     //     });
//     //     newitem.save();
//     //     res.redirect("/work");
//     // }
//     // else{
//         // }
//         const newitem = new items({
//             name: item
//         });
//         newitem.save();
//         res.redirect("/")
//    res.render("list", {newitem:item});
// });


// app.get("/:customListName", function(req,res){
//     const newrequestlist = req.params.customListName;
//     res.render("list",{kindofday:newrequestlist,newlistitems:defaultitem});
//     list.findOne({name: newrequestlist}, function(err, foundlist){
//         if(!err){
//           if(!foundlist){
//             const crlist = new list({
//                 name: newrequestlist,
//                 itemms: defaultitem
//             });
//             crlist.save();
//             res.redirect("/" + newrequestlist);
//           }
//           else{
//             res.render("list",{kindofday: foundlist.name, newlistitems:foundlist.itemms});
//           }
//         }
//     });
// });

// // app.get("/work", function(req,res){
// //    res.render("list", {kindofday:"working list", newlistitems: workitems});
// // });


// // app.post("/work",function(req,res){
// //     let item = req.body.newitem;
// //     const newitem = new items({
// //         name: item
// //     });
// //     newitem.save();
// //     res.redirect("/work");
// // //    res.render("list", {newitem:item});
// // });


// app.listen(3000,function(){
//     console.log("server is runing");
// });
// // 1J7sHa5MEtimqQQa
