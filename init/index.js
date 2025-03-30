const mongoose = require("mongoose");
const initData = require("./data.js"); // Fixed path
const Listing = require("../models/listing.js");

async function main() {
  try {
    await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
    console.log("Connected to DB");
    await initDB(); // Call initDB after DB connection is established
  } catch (err) {
    console.error("Database connection error", err);
  }
}

const initDB = async () => {
    await Listing.deleteMany({}); //First delete all data 
    initData.data = initData.data.map((obj) => ({...obj, owner: "67e261ca735e16859571e02e"}));  //Owner is added in every obj
    await Listing.insertMany(initData.data); // Ensure initData.data is correctly exported
    console.log("Data was initialized");
};

main();

 // Start the process
