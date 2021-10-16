const sqlite = require('sqlite3').verbose()

//responsável por abrir a comunicação com banco 
const openDatabase =  databasefile => new Promise((resolve, reject)=>{
    const db = new sqlite.Database(databasefile, (err) =>{
        if(err){
            reject(err)
        }
        resolve(db)
    })
})

const run = (db, query ) => new Promise((resolve, reject)=>{
    db.run(query, err=>{
        if(err){
            reject(err)
        }else(resolve())
    })
})

const init = async (databasefile) =>{
    //abre a comunicação com o banco e espera ficar pronta
    const db = await openDatabase(databasefile)
    //Checar se o banco já está criado e se existe uma tabela que eu sei que precisa estar criada
    const exists = await query(db, `SELECT name from sqlite_master where type= 'table' and name='categories'`)
     if(exists.length === 0){
            await run(db, `
            CREATE TABLE categories (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                category TEXT
            );
            `)
            await run(db,  `
            CREATE TABLE  products (
                id INTEGER PRIMARY KEY AUTOINCREMENT, 
                product TEXT
                price REAL
            );
            `);
            await run(db,  `CREATE TABLE images (
                id INTEGER PRIMARY KEY AUTOINCREMENT, 
                description TEXT,
                price REAL,
                product_id INTEGER REFERENCES products(id)
                );
        ` );
        await run(db,  `CREATE TABLE categories_products (
            product_id INTEGER REFERENCES products(id),
            category_id  INTEGER REFERENCES categories(id)
            );
    ` );
     } 
    return db 
}

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