const express = require('express');
const app = express();
const { sequelize, Note, Item } = require('./models')
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
    const note = await Note.findAll({ where: { isDeleted: false }});
    res.status(201).json(note)
  } catch(err) {
    res.status(422).json({message: "error: ", err})
  }
})

app.get('/notes/:uuid', async(req, res) => {
  const uuid = req.params.uuid
  try {
    const note = await Note.findOne({ where: { uuid }, include: 'items'});
    res.status(201).json(note)
  } catch(err) {
    res.status(422).json({message: "error: ", err})
  }
})

app.put('/notes/:uuid', async(req, res) => {
  const uuid = req.params.uuid;
  const { title, description, body } = req.body;
  try {
    const note = await Note.findOne({ where: { uuid }});

    note.title = title;
    note.description = description;
    note.body = body;
    
    note.save()

    res.status(201).json(note)
  } catch(err) {
    res.status(422).json({message: "error: ", err})
  }
})

app.put('/notes/delete/:uuid', async(req, res) => {
  const uuid = req.params.uuid;
  try {
    const note = await Note.findOne({ where: { uuid }});
    note.isDeleted = true;
    note.save();
    res.status(201).json(note)
  } catch(err) {
    res.status(422).json({message: "error: ", err})
  }
})

app.post('/items', async(req, res) => {
  const { noteUuid, title, body, type, } = req.body;
  try {
    const note = await Note.findOne({ where: {uuid: noteUuid } })
    const item = await Item.create({title, body, type, noteId: note.id, checked: 0, isDeleted: 0});
    res.status(201).json({message: "Successfully created", item})
  } catch(err) {
    res.status(422).json({message: "error: ", err})
  }
})

app.get('/items', async(req, res) => {
  try {
    const item = await Item.findAll({ where: {isDeleted: false}, include: 'note'})
    res.status(201).json(item)
  } catch(err) {
    res.status(422).json({message: "error: ", err})
  }
})

app.put('/items/delete/:uuid', async(req, res) => {
  const uuid = req.params.uuid
  try {
    const item = await Item.findOne({ uuid })
    item.isDeleted = true;
    item.save()
    res.status(201).json({message: "Item successfully deleted", item})
  } catch(err) {
    res.status(422).json({message: "error: ", err})
  }
})

app.put('/items/edit/:uuid', async(req, res) => {
  const uuid = req.params.uuid
  const { title, body, type } = req.body
  try {
    const item = await Item.findOne({ uuid })
    item.title = title;
    item.body = body;
    item.type = type;
    item.save()
    res.status(201).json({message: "Item successfully updated", item})
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