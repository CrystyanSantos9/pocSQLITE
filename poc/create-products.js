const sqlite = require('sqlite3').verbose()

const initDB = databasefile => new Promise((resolve, reject)=>{
    const db = new sqlite.Database(databasefile, (err)=>{
        if(err){
            reject(err)
        }
        resolve(db)
    })
})


// const run = (db, query, values) => new Promise((resolve, reject)=>{
//     db.run(query, values, err =>{
//         if(err){
//             reject(err)
//         }
//         resolve()
//     })
// })

const run = (db, query, values) => new Promise((resolve, reject)=>{
    // o método para trazer as linhas será o ALL
    //mudamos o nosso calback pois o retorno do método será as Linhas (rows) ou um erro
    db.all(query, values, (err, rows) =>{
        if(err){
            reject(err)
        }
        resolve(rows)
    })
})

const createProducts = async() =>{
    const db = await initDB('banco.sqlite3')
    await run(db, `INSERT INTO products (id, product) values (?, ?)`, [7 , ' Novo produto criado'])
    await run(db, `INSERT INTO categories_products (category_id, product_id ) values (?, ?)`, [2 , 7])
    console.log('Data registered!')
}

// const listProducts = async() =>{
//     const db = await initDB('banco.sqlite3')
//     const products = await run(db, `SELECT * FROM products`)
//     console.log('Data  read done!', products)
// }

const listProducts = async() =>{
    const db = await initDB('banco.sqlite3')
    const catId = 2
    const products = await run(db, `SELECT * FROM products where id in (select product_id from categories_products where category_id=?)`, [catId])
    console.log('Data  read done!', products)
}

const updateProdutcs = async() =>{
    const db = await initDB('banco.sqlite3')
    await run(db, `UPDATE products SET product=? WHERE id=?`, ['Produto 8 foi atualizado', 8])
    console.log('Data updated!')
}

const removeProducts = async() =>{
    const db = await initDB('banco.sqlite3')
    //Primeiro devemos remover a relação de produtos e categorias 
    await run(db, `DELETE FROM categories_products WHERE product_id=?`, [8])
    await run(db, `DELETE FROM products WHERE id=?`, [8])
    console.log('Data removed!')
}


// createProducts()
listProducts()





