const sqlite = require('sqlite3').verbose()

const init = databasefile => new Promise((resolve, reject)=>{
    const db = new sqlite.Database(databasefile, (err)=>{
        if(err){
            reject(err)
        }
        resolve(db)
    })
})

const queryWithParams = (db, query, values) => new Promise((resolve, reject)=>{
    db.run(query, values, err =>{
        if(err){
            reject(err)
        }
        resolve()
    })
})

//crio somente uma query sem dados, apenas para leitura
const query = (db, query) => new Promise((resolve, reject)=>{
    db.all(query,  (err, rows) =>{
        if(err){
            reject(err)
        }
        resolve(rows)
    })
})

module.exports = {
    init,
    queryWithParams,
    query
}