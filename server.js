const express = require("express");
const path = require("path");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const app = express();
const uri = `mongodb+srv://meldryck:XGDOuT79lEVIZgkE@said.jmiwduc.mongodb.net/st_in`;
const collection = require("./script/config");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(express.static("public"));

async function connect() {
  try {
    await mongoose.connect(uri);
    console.log("Connected to Mongoose");
  } catch (error) {
    console.log(error);
  }
}
connect();
app.listen(3000, () => {
  console.log(`Serveur en cours d'exécution sur le port 3000`);
});

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/home.html");
});

//Inscription
app.get("/register", (req, res) => {
  res.sendFile(__dirname + "/view/register.html");
});
app.post("/register", async (req, res) => {
  const data = {
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  };
  const existingUser = await collection.findOne({ email: data.email });
  if (existingUser) {
    res.send("Le mail utilisé est déja présent pour un autre compte. Sorry");
  } else {
    res.redirect("/");
    const userdata = await collection.insertMany(data);
    console.log(userdata);
  }
});
//Connexion
app.get("/login", (req, res) => {
  res.sendFile(__dirname + "/view/login.html");
});
app.post("/login", async (req, res) => {
 
  try {
    const check = await collection.findOne({ email: req.body.email });
    if (!check) {
      return res.status(401).json({ error: "Utilisateur inconnu" });
    }
    const isPasswordMatch = await bcrypt.compare(
      req.body.password,
      check.password
    );
    if (isPasswordMatch) {
      res.redirect("/");
    } else {
      req.send("Mauvais Password");
    }
  } catch {
    res.send("Erreur lors de la connexion");
    console.log(collection);
  }
});

//Lise User
app.get("/user", (req, res) => {
  res.sendFile(__dirname + "/view/user.html");
});
