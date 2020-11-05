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
  const collection = client.db("volunteer").collection("events");
  app.post("/addEvent",(req,res)=>{
    const newEvent=req.body
    console.log(newEvent)
    collection.insertOne(newEvent)
    .then(result=>{
        res.send(result.insertedCount>0);
    })
    .catch(err=>{
        console.log(err)
    })
})

  app.get("/personalEvents",(req,res)=>{
    collection.find({email:req.query.email})
    .toArray((err,documents)=>{
        res.status(200).send(documents)
    })
  })

  app.delete("/delete/:id",(req,res)=>{
    const eventId=req.params.id.toString()
    console.log(eventId)
    collection.deleteOne({_id:ObjectId(req.params.id)})
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
  
app.listen(port)