// userController.js

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const secretKey = process.env.SECRET_KEY || "defaultSecretKey";
const { User } = require("../models/userModel");

const UserController = {
  getAllUsers: async (req, res) => {
    try {
      // Récupérer la liste de tous les utilisateurs depuis la base de données
      const users = await User.find({}, { password: 0 }); // Exclure le champ du mot de passe

      res.json(users);
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ message: "Erreur lors de la récupération des utilisateurs." });
    }
  },

  register: async (req, res) => {
    try {
      const { email, password } = req.body;

      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: "L'utilisateur existe déjà." });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = new User({
        email,
        password: hashedPassword,
      });

      await newUser.save();

      res.status(201).json({ message: "Inscription réussie." });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Erreur lors de l'inscription." });
    }
  },

  login: async (req, res) => {
    try {
      const { email, password } = req.body;

      const user = await User.findOne({ email });
      if (!user) {
        return res.status(401).json({ message: "Identifiants invalides." });
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: "Identifiants invalides." });
      }

      // Générer un token JWT
      const token = jwt.sign(
        { userId: user._id, email: user.email },
        secretKey,
        { expiresIn: "1h" }
      );

      // Renvoyer le token
      res.json({ token });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Erreur lors de la connexion." });
    }
  },

  getUsers: async (req, res) => {
    try {
      // Récupérer la liste des utilisateurs depuis la base de données
      const users = await User.find({}, { password: 0 }); // Exclure le champ du mot de passe

      // Renvoyer la liste des utilisateurs
      res.json(users);
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ message: "Erreur lors de la récupération des utilisateurs." });
    }
  },
};


module.exports = {
  UserController,
};
