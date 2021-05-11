const express = require('express')

const app = express()
const mongoose = require('mongoose')
const {MONGOURI} = require('./keys')
const PORT = process.env.PORT || 5000

//AjGY4GvXw5Kr8edj - Password
const cors = require('cors')
app.use(cors("http://localhost:3000/"||"https://www.beenyan.com/"))

require('./models/Deal')
require('./models/User')

mongoose.connect(MONGOURI,{
    useNewUrlParser:true,
    useUnifiedTopology: true
})
.then(() => {
    console.log("Successfully connect to MongoDB.");
  })
  .catch(err => {
    console.error("Connection error", err);
    process.exit();
  });
  const authUser = require('./routes/authUser')
  const authDeal = require('./routes/authDeal')

  app.use(express.json())
  app.use(authUser, authDeal)

app.listen(PORT,()=>{
    console.log("server running on PORT",PORT)
})

