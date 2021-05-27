const { Database } = require('sqlite3')

//verbose -- expõe mais informações sobre as operações realizadas
const sqlite = require('sqlite3').verbose()

//melhorando o gerenciamento de criação e iniciação do nosso banco 
const initDB = databasefile => new Promise((resolve, reject)=>{
    //database é o documento referente ao banco de dados criado
    const db = new sqlite.Database(databasefile, (err)=>{
        //se erro, rejeitamos e retornamos o erro
        if(err){
            reject(err)
        }
        //se não devolvemos a criação do banco de dados 
        resolve(db)
    })
})

//passaremos um terceiro argumento para a função de execução
//esse terceiro argumento será um array com todos os dados que gostaríamos de armazenar
// const run = (db, query, values) => new Promise((resolve, reject)=>{
//     db.run(query, values, err =>{
//         if(err){
//             reject(err)
//         }
//         resolve()
//     })
// })

const run = (db, query) => new Promise((resolve, reject)=>{
    // o método para trazer as linhas será o ALL
    //mudamos o nosso calback pois o retorno do método será as Linhas (rows) ou um erro
    db.all(query,  (err, rows) =>{
        if(err){
            reject(err)
        }
        resolve(rows)
    })
})

const insertCategories = async() =>{
    const db = await initDB('banco.sqlite3')
    //Conforme esperado, nossa funcao de execução agora recebera:
    // A conexão DB
    // A query com um parâmetro que representa e esconde os valores inseridos 
    // Os valores em sí em um array separado
    await run(db, `INSERT INTO categories (id, category) values (?, ?)`, [3 , ' Nova category 3'])
    console.log('Data registered!')
}

const listCategories = async() =>{
    const db = await initDB('banco.sqlite3')
    const categories = await run(db, `SELECT * FROM categories`)
    console.log('Data read done!', categories)
}

const updateCategories = async() =>{
    const db = await initDB('banco.sqlite3')
   //para atualizar devemos seguir a ordem dos ? --> logo a informacao vem primeiro que o id, dentro do nosso array com os dados
    await run(db, `UPDATE categories SET category=? WHERE id=?`, ['categoria 4 acabou de ser atualizda', 4])
    console.log('Data updated!')
}

const removeCategories = async() =>{
    const db = await initDB('banco.sqlite3')
   //para atualizar devemos seguir a ordem dos ? --> logo a informacao vem primeiro que o id, dentro do nosso array com os dados
    await run(db, `DELETE FROM categories WHERE id=?`, [2])
    console.log('Data removed!')
}

listCategories()





