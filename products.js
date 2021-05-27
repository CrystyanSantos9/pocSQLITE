const db = require('./db')

const init = database => {
    const create = async (data) => {
        const conn = await db.init(database)
        await db.queryWithParams(conn, `INSERT INTO products (id, product, price) values (?, ?, ?)`, data)
    }

    const findall = async () => {
        const conn = await db.init(database)
        const products =  await db.query(conn,`SELECT * FROM products` )
        const condition = products.map(product => product.id).join(',')
        const images = await db.query(conn, 'select * from images where product_id in ('+condition+')')
        const mapImages = images.reduce((imagem_antiga, imagem_atual)=>{       
            return{
                ...imagem_antiga,
                [imagem_atual.product_id]:imagem_atual
            }
        }, {})
       return products.map(product =>{
           return {
               ...product, 
               image: mapImages[product.id]
           }
       })
    }

    const findallPaginated = async ({ pageSize = 1, currentPage = 0 }) => {
        const conn = await db.init(database)
        const registers = await db.query(conn, `SELECT * FROM products limit ${currentPage * pageSize}, ${pageSize + 1}`)
        const condition = registers.map(product => product.id).join(',')
        const images = await db.query(conn, 'select * from images where product_id in ('+condition+')')
        const mapImages = images.reduce((imagem_antiga, imagem_atual)=>{       
            return{
                ...imagem_antiga,
                [imagem_atual.product_id]:imagem_atual
            }
        }, {})

     
        const hasNext = registers.length > pageSize

        if (registers.length > pageSize) {
            registers.pop()
        }
      return {
        data: registers.map(product=>{
            return {
                ...product,
                image: mapImages[product.id]
            }
        }),
        hasNext
      }
    }

    const remove = async (id) => {
        const conn = await db.init(database)
        await db.queryWithParams(conn, `delete FROM products where id = ?`, [id])
        await db.queryWithParams(conn, `delete FROM images where product_id = ?`, [id])
        await db.queryWithParams(conn, `delete FROM categories_products where product_id = ?`, [id])
    }

    const update = async (id, data) => {
        const conn = await db.init(database)
        await db.queryWithParams(conn, `UPDATE products SET product=?, price=? WHERE id=?`, [...data, id])
    }

    const updateCategories = async (id, categories) => {
        const conn = await db.init(database)
        //primeiro apagamos os relacionamentos existentes
        await db.queryWithParams(conn, `delete from categories_products where product_id = ?`, [id])
        //em seguida vamos fazer uma loop para andarmos em todas as categorias que estamos adicionando [1,2,3]
        //para inserirmos uma a uma em cada passagem do loop 
        for await ( const category  of categories){
            await   await db.queryWithParams(conn,`insert into categories_products (product_id, category_id) values ( ?, ?)`, [id,category])
        }
    }

    const addImage = async (product_id, data) => {
        const conn = await db.init(database)
        await db.queryWithParams(conn, `INSERT INTO images (id,description, url, product_id) values (?, ?, ?, ?)`, [...data, product_id])
    }

    const findAllByCategories = async (category_id) => {
        const conn = await db.init(database)
        //buscando produto por categoria = categoria_id 
        const products =  await db.query(conn,`SELECT * FROM products where id in (select product_id from categories_products where category_id =${category_id})`)
        const condition = products.map(product => product.id).join(',')
        const images = await db.query(conn, 'select * from images where product_id in ('+condition+')')
        const mapImages = images.reduce((imagem_antiga, imagem_atual)=>{       
            return{
                ...imagem_antiga,
                [imagem_atual.product_id]:imagem_atual
            }
        }, {})
      return products.map(product =>{
           return {
               ...product, 
               image: mapImages[product.id]
           }
       })
    }

    return {
        findall,
        findallPaginated,
        remove,
        create,
        update,
        addImage,
        updateCategories,
        findAllByCategories
    }
}

module.exports = init