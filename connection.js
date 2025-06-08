const mongoose = require("mongoose");
async function connectToMongo(url) {
  try {
    console.log("url::",url);    
    const connectString =await mongoose.connect(url);

    return connectString;
  } catch (error) {
    console.log("error with connection of mongo");
  }
}

module.exports = connectToMongo;
