const path = require("path");
const express = require("express");
// const fileUpload = require("express-fileupload")
require("dotenv").config();
const session = require("express-session");
const flash = require("connect-flash");
const methodOverride = require("method-override");
const cookieParser = require("cookie-parser");
const dbConn = require("./config/db");

//org files importation
const app = express();
const userRoute = require("./Router/usersRouter");
const adminRoute = require("./Router/adminRouter");
const indexRoute = require("./Router/indexRouter");
const { checkUser } = require("./middleware/authenticate");

// invoking the database
dbConn();

//middlewares
app.use(methodOverride("_method"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());
app.use(
  session({
    secret: process.env.SECRET_GEN,
    cookie: { maxAge: 6000 },
    resave: false,
    saveUninitialized: false,
  })
);
app.use(flash());
// app.use(
//     fileUpload({
//         limits: {
//             fileSize:  3*1024*1024// 3 MB
//         },
//         abortOnLimit: true
//     })
// );

//set view engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(`${__dirname}/public`));

// app.use('/public/', express.static('./public'));

//main routes for admin and users
app.get("/", indexRoute);
app.use("/users", userRoute);
app.use("/admin", checkUser, adminRoute);

const PORT = process.env.PORT || 8000;
app.listen(PORT, console.log(`server running on port ${PORT}`));
