const mongoose = require ("mongoose")

const dbConnect =async(DB_URL)=> {
    try{
        const DB_OPTIONS = {
            dbName:"passwordmanager"
        }
        await mongoose.connect(DB_URL,DB_OPTIONS)
        console.log('Database Connected Successfully')
    }catch(error){
        console.log(error)
    }
}


module.exports = dbConnect