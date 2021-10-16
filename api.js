const categories = require('./categories')('banco.sqlite3')
const products = require('./products')('banco.sqlite3')

//funcao para testar os métodos
const test = async ()=>{
    //chamando a categoria com os [dados]
//    await categories.create([9, 'Informática'])
  // return await categories.findall()
//  await categories.remove(2)
// await categories.update( 3,['Elétro-domésticos'])
// return await categories.findallPaginated({pageSize: 2, currentPage:3})


// await products.create([4, 'Computador', 1200.0])
// await products.addImage(2, [4,'Outra imagem da bicicleta', '<url>'] )
// return await products.findallPaginated({pageSize: 1, currentPage:2})
// await products.update( 9, ['Computador', 1.400])
// await products.remove(1)
// return await products.findall()

// await products.updateCategories( 3, [3,7])

console.log(await products.findAllByCategories(3))
}

// test().then(e=>{
//     console.log(e)
// })

test()