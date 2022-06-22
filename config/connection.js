const mongoClient = require('mongodb').MongoClient
const state={
    db:null
}

module.exports.connect = function(done){
    const url = 'mongodb+srv://belvinb:belvin123@cluster0.hokyz0r.mongodb.net/booking?retryWrites=true&w=majority'
    const dbname='booking'

    mongoClient.connect(url,(err,data)=>{
        if(err) return done(err)
        state.db=data.db(dbname)
        done()
    })
    
}

module.exports.get=function(){
    return state.db
}