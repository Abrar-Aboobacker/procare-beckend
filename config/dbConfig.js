const mongoose =require('mongoose')

mongoose.connect(process.env.DATABASE_URL)
const db = mongoose.connection
mongoose.set('strictQuery', true);
db.on('error',error=> console.error(error));
db.once('open',()=> console.log('connected to mongoose'));

module.exports = mongoose