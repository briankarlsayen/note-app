const express = require('express');
const app = express();
const { sequelize, Note } = require('./models')
require("dotenv").config();
const PORT = process.env.PORT;

// connect to DB
// const dbConnect = async() => {
//   try {
//     // await sequelize.authenticate();
//     // await sequelize.sync({ force: true });
//     await sequelize.sync();
//     console.log('Connection has been established successfully.');
//   } catch (error) {
//     console.error('Unable to connect to the database:', error);
//   }
// }
// dbConnect()

// middlewares
app.use(express.json())

app.post('/notes', async(req, res) => {
  const { title, description, body } = req.body;
  try {
    const note = await Note.create({title, description, body});
    res.status(201).json({message: "Successfully created", note})
  } catch(err) {
    res.status(422).json({message: "error: ", err})
  }
})
app.get('/notes', async(req, res) => {
  try {
    const note = await Note.findAll();
    res.status(201).json(note)
  } catch(err) {
    res.status(422).json({message: "error: ", err})
  }
})

app.listen(PORT, async() => {
  console.log(`port is listening to PORT: ${PORT}`)
  // await sequelize.sync();
  await sequelize.authenticate();
  console.log('Connected to database')
})