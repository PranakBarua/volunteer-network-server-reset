const express = require('express')
const bodyParser=require('body-parser')
const cors=require('cors')
require('dotenv').config()
const MongoClient = require('mongodb').MongoClient;
const ObjectId=require('mongodb').ObjectId
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.b8xwq.mongodb.net/volunteer?retryWrites=true&w=majority`;


const port = 5000
const app = express()
app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))


const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true , connectTimeoutMS: 30000 ,  keepAlive: 1});
client.connect(err => {
  const eventCollection = client.db("volunteer").collection("events");
  const adminCollection = client.db("volunteer").collection("admin");

  app.post("/addEvent",(req,res)=>{
    const newEvent=req.body
    console.log(newEvent)
    eventCollection.insertOne(newEvent)
    .then(result=>{
        res.send(result.insertedCount>0);
    })
    .catch(err=>{
        console.log(err)
    })
 })

 app.post("/addAdmin",(req,res)=>{
  const newAdmin=req.body
  console.log(newAdmin)
  adminCollection.insertOne(newAdmin)
  .then(result=>{
      res.send(result.insertedCount>0);
  })
  .catch(err=>{
      console.log(err)
  })
})

app.get('/admins',(req,res)=>{
  adminCollection.find({})
  .toArray((err,documents)=>{
      res.send(documents)
  })
  
})

  app.get("/personalEvents",(req,res)=>{
    eventCollection.find({email:req.query.email})
    .toArray((err,documents)=>{
        res.status(200).send(documents)
    })
  })

  app.delete("/delete/:id",(req,res)=>{
    const eventId=req.params.id.toString()
    console.log(eventId)
    eventCollection.deleteOne({_id:ObjectId(req.params.id)})
    .then(result=>{
      console.log(result)
      res.send(result.deletedCount>0)
    })
  })

  console.log('database connected')
});

app.get('/', (req, res) => {
    res.send('Hello World!')
  })
  
  app.listen(process.env.PORT || port)