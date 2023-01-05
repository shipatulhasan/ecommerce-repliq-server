const express = require('express')
const cors = require('cors')
const port = process.env.PORT || 5000
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
// const jwt = require('jsonwebtoken');
const app = express()

// middleware
app.use(cors())
app.use(express.json())

app.get('/',(req,res)=>{
    res.send('bubu form node')
})


// mongodb
const client = new MongoClient(process.env.uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverApi: ServerApiVersion.v1,
  });

  const run = async()=>{
      try{
        const productsCollection = client.db("ecommerceReplciq").collection("products");
        const usersCollection = client.db("ecommerceReplciq").collection("users");

        app.post('/register',async(req,res)=>{
          const user = req.body
         
          const query = {phone:user.phone}
          const existingUser = await usersCollection.findOne(query)
          if(existingUser){
              return res.status(302).send({message:'already exist'})
          }
          const result = await usersCollection.insertOne(user)
          console.log(result)
          res.send(result)
      })
      }
      
      finally{}
  }
  run().catch(console.dir)










app.listen(port,()=>{
    console.log(`listening form ${port}`)
})