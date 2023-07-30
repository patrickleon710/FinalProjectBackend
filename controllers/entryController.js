const Entry = require("../models/entries");
const User = require("../models/User");


// getting all entries

const getEntries = async (req, res) => {
  

  try {
    const entries = await Entry.find().lean().exec();
    if (!entries?.length) {
      return res.status(400).json({ message: "No journal entries found" });
    }

    res.json(entries);
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch entries" });
  }
};

// getting one entry

const getSingleEntry = async (req, res) => {
  const { id } = req.params;

  
  try {
    const entry = await Entry.findById(id).exec();

    if (!entry) {
      return res.status(404).json({ message: "There is no such entry" });
    }
    res.status(200).json(entry);

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Server error'})
  }

};

// creating an entry

const createEntry = async (req, res) => {
  const { title, content } = req.body;

  

  console.log("work");

 

  if (!title || !content) {
    return res.status(400).json({ message: "Please write fill in all fields" });
  }

  const entry = await Entry.create({ title, content  });

  if (entry) {
    return res.status(200).json({ message: "New entry created" });
  } else {
    return res.status(400).json({ message: "Failed to create entry" });
  }
};

// updating an entry

const updateEntry = async (req, res) => {
  const {  id } = req.params
  const {title, content } = req.body;

  if (!title || !content) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const entry = await Entry.findById(id).exec();

  if (!entry) {
    return res.status(404).json({ message: "There is no such entry" });
  }

  entry.title = title;
  entry.content = content;

  const updatedEntry = await entry.save();

  res.json(`'${updatedEntry.title}' updated`);
};

// delete an entry

const deleteEntry = async (req, res) => {
  const { entryId } = req.params;

  if (!entryId) {
    return res.status(400).json({ message: "No such entry found" });
  }

  const entry = await Entry.findById(entryId).exec();

  if (!entry) {
    return res.status(400).json({ message: "No such entry found" });
  }

  const result = await entry.deleteOne();

  const response = `Note deleted`;

  res.status(200).json(response);
};

module.exports = {
  getEntries,
  getSingleEntry,
  createEntry,
  updateEntry,
  deleteEntry,
};


