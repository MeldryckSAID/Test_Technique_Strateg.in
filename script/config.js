const mongoose = require("mongoose");
// const connection = mongoose.connection("said.jmiwduc.mongodb.net/st_in")

// connection.then(()=>{
//   console.log("On est connecter avec succes tu peux avancer");
// }).catch(()=>
// console.log("Non pa cette fois la prochaine c'est la bonne")
// )

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

const collection = new mongoose.model("test-user", userSchema);

module.exports=collection;

