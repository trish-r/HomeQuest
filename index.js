var express = require("express");
var mysql = require("mysql2");
var fileuploader = require("express-fileupload");
var app = express();
const cors = require("cors");

const corsConfig = {
  origin: "*",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
};

app.options("", cors(corsConfig));
app.use(cors(corsConfig));
app.listen(2022, function () {
  console.log("Server Started");
});

const nodemailer = require("nodemailer");

app.get("/", function (req, resp) {
  resp.sendFile(process.cwd() + "/public/index.html");
});
app.use(express.static("public"));
app.use(fileuploader());

app.get("/profile-donor", function (req, resp) {
  resp.sendFile(process.cwd() + "/public/profile-donor.html");
});

app.get("/avail-med", function (req, resp) {
  resp.sendFile(process.cwd() + "/public/avail-med.html");
});

app.use(express.urlencoded(true));

//==========DataBase
var dbConfig = {
  host: "sql12.freemysqlhosting.net",
  user: "sql12748349",
  password: "YciVbQxF2j",
  database: "sql12748349",
  dateStrings: true,
};

var dbCon = mysql.createConnection(dbConfig);
dbCon.connect(function (err) {
  if (err == null)
    console.log("Connected Successfully");
  else
    console.error("Connection Error:", err); // Log error to the console
});

//======================Email Checker===========
app.get("/chk-email", function (req, resp) {
  //saving data in table


  //fixed                             //same seq. as in table
  dbCon.query("select * from user where email=?", [req.query.kuchEmail], function (err, resultTable) {
    if (err == null) {
      if (resultTable.length == 1)
        resp.send("Already Taken...");
      else
        resp.send("Available....!!!!");
    }
    else
      resp.send(err);
  })
})
//======================Sign Up=================
app.get("/chk-submit", function (req, resp) {


  dbCon.query("insert into user(email,pwd,type1,dos,status) values(?,?,?,current_date(),1)", [req.query.kuchemail, req.query.kuchpwd, req.query.kuchtype], function (err) {
    if (err == null) {
      resp.send("Record Saved successfully")
      transporter.sendMail(options, function (err, info) {
        if (err) {
          console.log(err);
          return;
        }
        else
          console.log("sent: " + info.response);

      })
    }
    else {
      resp.send(err);
    }
  })
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'gargchahat2005@gmail.com',
      pass: 'prvbaofggfhtvqly'
    }
  });

  const options = {
    from: "gargchahat2005@gmail.com", // sender ahddress
    to: req.query.kuchemail, // list of receivers
    subject: "Sign Up", // Subject line
    text: "You have successfully signed up ", // plain text body
    html: "<h1>Congrats</h1><br><b>You have successfully signed up</b><br> Login Id =" + req.query.kuchemail + "<br>Password=" + req.query.kuchpwd,

  };

})
//==================Log In================
app.get("/chk-login-submit", function (req, resp) {
  dbCon.query("select * from user where email=? && pwd=? ", [req.query.kuchemail, req.query.kuchpwd], function (err, resultJSONTable) {
    if (err == null) {
      if (resultJSONTable.length > 0) {
        if (resultJSONTable[0].status == 1) {
          resp.send(resultJSONTable[0].type1);
        }
        else {
          resp.send("USER BLOCKED");
        }
      }
      else {
        resp.send("INVALID EMAIL OR PASSWORD");
      }
    }
    else {
      resp.send(err);
    }
  });
});
// //=================Profile==========================
// //=============Submit Profile=============
// app.post("/signup",function(req,resp){
//     //  resp.send("Data Reached");
//     var fileName="nopic.jpg";
//     if(req.files!=null)
//       {
//         //console.log(process.cwd());
//          fileName=req.files.ppic.name;
//         var path=process.cwd()+"/public/upload/"+fileName;
//         req.files.ppic.mv(path);
//       }
//       console.log(req.files);
// var emailid=req.body.txtEmail;
// var name=req.body.txtname;
// var contact=req.body.txtcontact;
// var address=req.body.txtaddress;
// var city=req.body.combocity;
// var dob=req.body.dob;
// var gender=req.body.gender;
// var id=req.body.idproof;
// console.log(req.body);
// dbCon.query("insert into user2023 values(?,?,?,?,?,?,?,?,?)",[emailid,name,contact,address,city,dob,gender,id,fileName],function(err){
//     if(err==null){
//         resp.send("Record saved successfullyyyyyyy");
//     }
//     else{
//         resp.send(err);
//     }
// })
//  //resp.query("Welcome"+req.body.txtEmail +" "+"Name"+req.body.txtname+" "+" Contact"+req.body.txtcontact+" "+"Adress"+req.body.txtaddress+"City"+city+"dob"+dob+"Gender"+gender+"Id"+id+"Pic"+fileName);
// });

// //======================Delete Profile=================
// app.post("/db-delete-process-secure",function(req,resp)
// {
//      //saving data in table
//     var emailid=req.body.txtEmail;


//          //fixed                             //same seq. as in table
//     dbCon.query("delete from user2023 where emailid=?",[emailid],function(err,result)
//     {
//           if(err==null)
//           {
//             if(result.affectedRows==1)
//               resp.send("Account Removed Successssfullllyyyyyyyyyyyyyyyyyyyyyyyy!!!!!!!!!");
//             else
//               resp.send("Inavlid Email id");
//             }
//               else
//             resp.send(err);
//     })
// })
// //================Check Email===============
// app.get("/chk-email",function(req,resp)
// {
//      //saving data in table


//          //fixed                             //same seq. as in table
//     dbCon.query("select * from user2023 where emailid=?",[req.query.kuchEmail],function(err,resultTable)
//     {
//           if(err==null)
//           {
//             if(resultTable.length==1)
//               resp.send("Already Taken...");
//             else
//               resp.send("Available....!!!!");
//             }
//               else
//             resp.send(err);
//     })
// })
// //====================update Profile=====================

// app.post("/update-db-process-secure",function(req,resp){
//   var fileName;
//   if(req.files!=null)
//   {
//      // console.log(process.cwd());
//       var fileName=req.files.ppic.name;
//       var path=process.cwd()+"/public/upload/"+fileName;  // location
//        req.files.ppic.mv(path);  // move file to required path
//   }
//   else 
//   {
//     fileName=req.body.hdn;
//   }
//   var emailid=req.body.txtEmail;
// var name=req.body.txtname;
// var contact=req.body.txtcontact;
// var address=req.body.txtaddress;
// var city=req.body.combocity;
// var dob=req.body.dob;
// var gender=req.body.gender;
// var id=req.body.idproof;

//   dbCon.query("update  user2023 set name=?,contact=?,address=?,city=?,dob=?,gender=?,id=? where emailid=?",[name,contact,address,city,dob,gender,id,emailid],function(err,result){
//       if(err==null){
//           if(result.affectedRows==1){
//           resp.send("Updated Successfully..")
//           }
//           else{
//               resp.send("No such account exists");
//           }
//       }
//       else{
//           resp.send(err);
//       }

//   })
// })
// //======================search email==========================
// app.get("/get-json-record",function(req,resp)
// {
//          //fixed                             //same seq. as in table
//     dbCon.query("select * from user2023 where emailid=?",[req.query.kuchemail],function(err,resultJSONKuch)
//     {
//           if(err==null)

//             {
//               resp.send(resultJSONKuch);
//             }

//           else
//           resp.send(err);

//     })
// })

//================= Donor-Profile==========================
//=============Submit Profile=============
app.post("/submit-process", function (req, resp) {
  //  resp.send("Data Reached");
  var fileName = "nopic.jpg";
  if (req.files != null) {
    //console.log(process.cwd());
    fileName = req.files.ppic.name;
    var path = process.cwd() + "/public/upload/" + fileName;
    req.files.ppic.mv(path);
  }
  console.log(req.files);
  var emailid = req.body.txtEmail;
  var name = req.body.txtname;
  var contact = req.body.txtcontact;
  var address = req.body.txtaddress;
  var city = req.body.combocity;
  var dob = req.body.dob;
  var gender = req.body.gender;
  var id = req.body.idproof;
  var ahours = req.body.ah + "-" + req.body.bh;
  console.log(req.body);
  dbCon.query("insert into donors values(?,?,?,?,?,?,?,?,?,?)", [emailid, name, contact, address, city, dob, gender, id, fileName, ahours], function (err) {
    if (err == null) {
      resp.send("Record saved successfully");
    }
    else {
      resp.send(err);
    }
  })
  //resp.query("Welcome"+req.body.txtEmail +" "+"Name"+req.body.txtname+" "+" Contact"+req.body.txtcontact+" "+"Adress"+req.body.txtaddress+"City"+city+"dob"+dob+"Gender"+gender+"Id"+id+"Pic"+fileName);
});


//================Check Email===============
// app.get("/email",function(req,resp)
// {
//      //saving data in table


//          //fixed                             //same seq. as in table
//     dbCon.query("select * from donors where emailid=?",[req.query.kuchEmail],function(err,resultTable)
//     {
//           if(err==null)
//           {
//             if(resultTable.length==1)
//               resp.send("Already Taken...");
//             else
//               resp.send("Available....!!!!");
//             }
//               else
//             resp.send(err);
//     })
// })
//====================update Profile=====================

app.post("/update-process", function (req, resp) {
  var fileName;
  if (req.files != null) {
    // console.log(process.cwd());
    var fileName = req.files.ppic.name;
    var path = process.cwd() + "/public/upload/" + fileName;  // location
    req.files.ppic.mv(path);  // move file to required path
  }
  else {
    fileName = req.body.hdn;
  }
  var emailid = req.body.txtEmail;
  var name = req.body.txtname;
  var contact = req.body.txtcontact;
  var address = req.body.txtaddress;
  var city = req.body.combocity;
  var dob = req.body.dob;
  var gender = req.body.gender;
  var id = req.body.idproof;
  var ahours = req.body.ah + "-" + req.body.bh;

  dbCon.query("update  donors set name=?,contact=?,address=?,city=?,dob=?,gender=?,fileName=?,id=?,ahours=? where emailid=?", [name, contact, address, city, dob, gender, fileName, id, ahours, emailid], function (err, result) {
    if (err == null) {
      if (result.affectedRows == 1) {
        resp.send("Updated Successfully..")
      }
      else {
        resp.send("No such account exists");
      }
    }
    else {
      resp.send(err);
    }

  })
})
//======================search email==========================
app.get("/json-record", function (req, resp) {
  //fixed                             //same seq. as in table
  dbCon.query("select * from donors where emailid=?", [req.query.kuchemail], function (err, resultJSONKuch) {
    if (err == null) {
      resp.send(resultJSONKuch);
    }

    else
      resp.send(err);

  })
})

//======================Avail Med.=========================
//////////////////////////

app.get("/submit", function (req, resp) {

  dbCon.query("insert into medsavailable(email,med,qty,packing,expdate) values(?,?,?,?,?)", [req.query.kuchemail, req.query.kuchmed, req.query.kuchquantity, req.query.kuchpacking, req.query.kuchdoe], function (err) {
    if (err == null) {
      resp.send("Record Saved successfully")
    }
    else {
      resp.send(err);
    }
  })

})


//==========================

// connect with the smtp


//==================Settings

app.get("/setting", function (req, resp) {

  dbCon.query("update  user set pwd=? where email=? && pwd=?", [req.query.kuchnewPwd, req.query.kuchemail, req.query.kucholdPwd], function (err, result) {
    if (err == null) {
      if (result.affectedRows == 1) {
        resp.send("Updated Successfully..")
        transporter.sendMail(options, function (err, info) {
          if (err) {
            console.log(err);
            return;
          }
          else
            console.log("sent: " + info.response);

        })
      }
      else {
        resp.send("No such account exists");
      }
    }
    else {
      resp.send(err);
    }
  })
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'gargchahat2005@gmail.com',
      pass: 'prvbaofggfhtvqly'
    }
  });

  const options = {
    from: "gargchahat2005@gmail.com", // sender ahddress
    to: req.query.kuchemail, // list of receivers
    subject: "Sign Up", // Subject line
    text: "Your password is successfully updated ", // plain text body
    html: "<h1>Congrats</h1><br><b>Your password is successfully updated</b><br> Login Id =" + req.query.kuchemail + "<br>Password=" + req.query.kuchnewPwd,

  };

})
//============================needy-Profile===========================
//=============Submit Profile=============
app.post("/send_to_server", function (req, resp) {
  //  resp.send("Data Reached");
  var fileName = "nopic.jpg";
  if (req.files != null) {
    //console.log(process.cwd());
    fileName = req.files.ppic.name;
    var path = process.cwd() + "/public/upload/" + fileName;
    req.files.ppic.mv(path);
  }
  console.log(req.files);
  var emailid = req.body.txtEmail;
  var name = req.body.txtname;
  var contact = req.body.txtcontact;
  var address = req.body.txtaddress;
  var city = req.body.combocity;
  var dob = req.body.dob;
  var gender = req.body.gender;

  console.log(req.body);
  dbCon.query("insert into needy values(?,?,?,?,?,?,?,?)", [emailid, name, contact, address, city, dob, gender, fileName], function (err) {
    if (err == null) {
      resp.send("Record saved successfullyyyyyyy");
    }
    else {
      resp.send(err);
    }
  })
  //resp.query("Welcome"+req.body.txtEmail +" "+"Name"+req.body.txtname+" "+" Contact"+req.body.txtcontact+" "+"Adress"+req.body.txtaddress+"City"+city+"dob"+dob+"Gender"+gender+"Id"+id+"Pic"+fileName);
});
///////////////////////update=============
app.post("/update-to-server", function (req, resp) {
  var fileName;
  if (req.files != null) {
    // console.log(process.cwd());
    var fileName = req.files.ppic.name;
    var path = process.cwd() + "/public/upload/" + fileName;  // location
    req.files.ppic.mv(path);  // move file to required path
  }
  else {
    fileName = req.body.hdn;
  }
  var emailid = req.body.txtEmail;
  var name = req.body.txtname;
  var contact = req.body.txtcontact;
  var address = req.body.txtaddress;
  var city = req.body.combocity;
  var dob = req.body.dob;
  var gender = req.body.gender;


  dbCon.query("update  needy set name=?,contact=?,address=?,city=?,dob=?,gender=?,fileName=? where emailid=?", [name, contact, address, city, dob, gender, fileName, emailid], function (err, result) {
    if (err == null) {
      if (result.affectedRows == 1) {
        resp.send("Updated Successfully..")
      }
      else {
        resp.send("No such account exists");
      }
    }
    else {
      resp.send(err);
    }

  })
})
///////////////json========
app.get("/json", function (req, resp) {
  //fixed                             //same seq. as in table
  dbCon.query("select * from needy where emailid=?", [req.query.kuchemail], function (err, resultJSONKuch) {
    if (err == null) {
      resp.send(resultJSONKuch);
    }

    else
      resp.send(err);

  })
})
// app.get("/fetch-donor-data",function(req,resp){
//     // alert();
//     resp.sendFile(process.cwd()+"/public/panel-donors.html");
//   });
// //============
// app.get("/fetch-donor-records",function(req,resp)
// {
//          //fixed                             //same seq. as in table
//     dbCon.query("select * from donors",function(err,resultTableJSON)
//     {
//           if(err==null)
//             resp.send(resultTableJSON);
//               else
//             resp.send(err);
//     })
// });
app.get("/get-angular-all-records", function (req, resp) {
  //fixed                               //same seq. as in table
  dbCon.query("SELECT * FROM user ORDER BY type1 ASC;", function (err, resultTableJSON) {
    if (err == null)
      resp.send(resultTableJSON);
    else
      resp.send(err);
  })
})

app.get("/do-angular-delete", function (req, resp) {
  //saving data in table
  var email = req.query.emailkuch;


  //fixed                             //same seq. as in table
  dbCon.query("delete from user where email=?", [email], function (err, result) {
    if (err == null) {
      if (result.affectedRows == 1)
        resp.send("Account Removed Successssfullllyyyyyyyyyyyyyyyyyyyyyyyy!!!!!!!!!");
      else
        resp.send("Inavlid Email id");
    }
    else
      resp.send(err);
  })
})
///=================
app.get("/do-angular-block", function (req, resp) {
  var email = req.query.emailkuch;


  dbCon.query("update  user set status=0 where email=? ", [email], function (err, result) {
    if (err == null) {
      if (result.affectedRows == 1) {
        resp.send("Updated Successfully..")
      }
      else {
        resp.send("No such account exists");
      }
    }
    else {
      resp.send(err);
    }
  })

})

//===================
app.get("/do-angular-resume", function (req, resp) {
  var email = req.query.emailkuch;


  dbCon.query("update  user set status=1 where email=? ", [email], function (err, result) {
    if (err == null) {
      if (result.affectedRows == 1) {
        resp.send("Updated Successfully..")
      }
      else {
        resp.send("No such account exists");
      }
    }
    else {
      resp.send(err);
    }
  })

})
//======================donor-panel===================
app.get("/get-angular-property-records", function (req, resp) {
  //fixed                             //same seq. as in table
  dbCon.query("select * from properties where status=0", function (err, resultTableJSON) {
    if (err == null)
      resp.send(resultTableJSON);
    else
      resp.send(err);
  })
})

app.get("/get-angular-donors-records", function (req, resp) {
  //fixed                             //same seq. as in table
  dbCon.query("select * from donors", function (err, resultTableJSON) {
    if (err == null)
      resp.send(resultTableJSON);
    else
      resp.send(err);
  })
})
//======================needy-panel===================
app.get("/get-angular-needys-records", function (req, resp) {
  //fixed                             //same seq. as in table
  dbCon.query("select * from needy", function (err, resultTableJSON) {
    if (err == null)
      resp.send(resultTableJSON);
    else
      resp.send(err);
  })
})
/////////////////////////////////
app.get("/fetch-donor-med-details", function (req, resp) {
  var email = req.query.emailkuch;
  dbCon.query("select * from properties where email=?", [email], function (err, resultTableJSON) {
    if (err == null)
      resp.send(resultTableJSON);
    else
      resp.send(err);
  })
})

app.get("/do-sold", function (req, resp) {
  // Extract the serial number (srno) from query parameters
  var srno = req.query.srnokuch;

  // Update the status of the property in the table
  dbCon.query("UPDATE properties SET status = 0 WHERE srno = ?", [srno], function (err, result) {
    if (err == null) {
      if (result.affectedRows == 1)
        resp.send("Property status updated to sold successfully");
      else
        resp.send("No property found with the given serial number");
    } else {
      resp.send(err);
    }
  });
});

/////////////////////////
app.get("/get-cities", function (req, resp) {
  //fixed                             //same seq. as in table
  dbCon.query("select distinct city from properties", function (err, resultTableJSON) {
    if (err == null)
      resp.send(resultTableJSON);
    else
      resp.send(err);
  })
})

app.get("/get-PropertyType", function (req, resp) {
  //fixed                             //same seq. as in table
  dbCon.query("select distinct propertyType from properties", function (err, resultTableJSON) {
    if (err == null)
      resp.send(resultTableJSON);
    else
      resp.send(err);
  })
})

app.get("/get-rentType", function (req, resp) {
  //fixed                             //same seq. as in table
  dbCon.query("select distinct rentType from properties", function (err, resultTableJSON) {
    if (err == null)
      resp.send(resultTableJSON);
    else
      resp.send(err);
  })
})
//////////////////////////
app.get("/do-remove", function (req, resp) {
  //saving data in table



  //fixed                             //same seq. as in table
  dbCon.query("delete from medsavailable where expdate<=current_date()", function (err, result) {
    if (err == null) {
      if (result.affectedRows == 1)
        resp.send("Medicine deleted");
      else
        resp.send("No expired medicine yet");
    }
    else
      resp.send(err);
  })
})

app.get("/fetch-donors", function (req, resp) {
  // console.log(req.query);
  var propertyType = req.query.propertyKuch;
  var city = req.query.cityKuch;
  var rentType = req.query.rentKuch;

  var query = "select * from donors  inner join properties on donors.emailid= properties.email where properties.propertyType=? and properties.city=? and properties.rentType=?AND properties.status = 1";


  dbCon.query(query, [propertyType, city,rentType], function (err, resultTable) {
    // console.log(resultTable+"      "+err);
    if (err == null)
      resp.send(resultTable);
    else
      resp.send(err);
  })
})


app.post("/submit-property", function (req, resp) {
  // Default value for fileName
  var fileName = "nopic.jpg";
  
  // Check if a file was uploaded
  if (req.files != null && req.files.ppic) {
      fileName = req.files.ppic.name;
      var path = process.cwd() + "/public/upload/" + fileName;
      
      // Move the uploaded file to the server directory
      req.files.ppic.mv(path, function (err) {
          if (err) {
              return resp.status(500).send(err);
          }
      });
  }

  // Extract data from the request body
  var emailid = req.body.txtEmail;
  var address = req.body.txtAddress;
  var property = req.body.txtProperty;
  var price = req.body.txtPrice;
  var city = req.body.txtCity;
  var rentType = req.body.txtRent;
  var beds = req.body.txtBeds;
  var baths = req.body.txtBath;

  // Insert data into the database
  dbCon.query(
      "INSERT INTO properties (email, address, propertyType, price, city, rentType, beds, bath, pic, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", 
      [
          emailid, 
          address, 
          property, 
          parseInt(price), 
          city, 
          rentType, 
          parseInt(beds), 
          parseInt(baths), 
          fileName, 
          1 // Assuming 1 means 'Active'
      ],
      function (err) {
          if (err == null) {
              resp.send("Record saved successfully");
          } else {
              resp.send("Error: " + err);
          }
      }
  );
});
