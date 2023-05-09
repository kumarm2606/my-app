var express = require('express')
var cors = require('cors')
var app = express()
var mysql=require('mysql')

app.use(cors())
app.use(express.json)
var db = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : 'password',
    database : 'Event'
  });
app.post("/create",(req,res)=>{
const eventname=req.body.eventname
const eventdescription=req.body.eventdescription
const startDate=req.body.startDate
db.query(
    'insert into Event.event(eventname,eventdescription,startDate) VALUES(?,?,?)'
    [eventname,eventdescription,startDate],(err,result)=>{
        if(err){
console.log(err)
        }else{
            res.send('Values inserted')
        }
    }
)
})
app.listen(3001,()=>{
    console.log("Back end server is running")
})