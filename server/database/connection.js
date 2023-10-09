const mongoose = require('mongoose')

 const connectDB = async() =>{
    try {
        const connection = await mongoose.connect(process.env.MONGO_URI,{
            useNewUrlParser: true,
            useUnifiedTopology: true,
            // useCreateIndex: true,
            // useFindAndModify: false,
        })
        console.log("Mongodb is successfully connected");
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
}

module.exports = connectDB;