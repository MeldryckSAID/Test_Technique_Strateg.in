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
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to Mongoose");
  } catch (error) {
    console.error("Error connecting to Mongoose:", error);
  }
}

connect();

app.listen(3000, () => {
  console.log(`Serveur en cours d'exécution sur le port 3000`);
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "/home.html"));
});

// Inscription
app.get("/register", (req, res) => {
  res.sendFile(path.join(__dirname, "/view/register.html"));
});
app.get("/dashboard", (req, res) => {
  res.sendFile(path.join(__dirname, "/view/dashboard.html"));
});

app.post("/register", async (req, res) => {
  const data = {
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  };

  try {
    const existingUser = await collection.findOne({ email: data.email });

    if (existingUser) {
      return res.send(
        "Le mail utilisé est déjà présent pour un autre compte. Désolé."
      );
    }

    const userdata = await collection.insertMany(data);
    console.log(userdata);

    res.redirect("/");
  } catch (error) {
    console.error("Erreur lors de l'enregistrement :", error);
    res.status(500).send("Erreur lors de l'enregistrement.");
  }
});

// Connexion
app.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "/view/login.html"));
});

app.post("/login", async (req, res) => {
  try {
    const user = await collection.findOne({ email: req.body.email });

    if (!user) {
      return res.status(401).json({ error: "Utilisateur inconnu" });
    }

    // Logs de débogage
    console.log("Mot de passe reçu :", req.body.password);
    console.log("Mot de passe en base de données :", user.password);

    // Comparaison sans hachage
    const isPasswordValid = req.body.password === user.password;

    if (isPasswordValid) {
      res.redirect("/dashboard");
    } else {
      console.log("Mauvais mot de passe pour l'utilisateur :", user.email);
      res.status(401).send("Mauvais mot de passe");
    }
  } catch (error) {
    console.error("Erreur lors de la connexion :", error);
    res.status(500).send("Erreur lors de la connexion.");
  }
});

// Liste User
app.get("/user", (req, res) => {
  res.sendFile(path.join(__dirname, "/view/user.html"));
});

//dashboard connect+ liste

app.get("/dashboard", (req, res) => {
  // Vérifiez la présence du token
  const token = req.cookies.token;

  if (!token) {
    // Rediriger vers la page de connexion si le token est absent
    return res.redirect("/login");
  }

  // Vérification et décodage du token
  jwt.verify(token, "secret", (err, decoded) => {
    if (err) {
      console.error("Erreur lors de la vérification du token :", err);
      return res.status(401).send("Token invalide");
    }

    // Le token est valide, affichez l'email dans la page
    res.sendFile(path.join(__dirname, "/view/dashboard.html"));
  });
});