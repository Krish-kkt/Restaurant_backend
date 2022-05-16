const express= require('express');

const path= require('path');
require ('./src/db/mongoose');

const adminUserRouter = require('./src/routers/adminUser');
const menuRouter = require('./src/routers/menu');
const categoryRouter = require('./src/routers/category');
const userRouter= require('./src/routers/user');
const cors= require('cors');

const app = express();

const port= process.env.PORT;

// app.use(
//     cors({
//         origin: ["http://localhost:3000","https://flamboyant-jepsen-c696cc.netlify.app"],
//         methods: ["GET","PATCH","POST","DELETE"],
//         credentials: true,
//     })
// )



app.use(express.json());                                //for handling/parsing form data
app.use(express.urlencoded({extended: false}));         //for handlin/parsing json data 
app.use(adminUserRouter);
app.use(menuRouter);
app.use(categoryRouter);
app.use(userRouter);

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", '*');
    res.header("Access-Control-Allow-Credentials", true);
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header("Access-Control-Allow-Headers", 'Origin,X-Requested-With,Content-Type,Accept,content-type,application/json');
    next();
  });

// app.use(cors());

app.get('/' , (req, res)=>{
    res.send('Hi');
})

app.listen(port, ()=>{
    console.log('Server is up on port '+port);
})