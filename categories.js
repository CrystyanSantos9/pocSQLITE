const db = require('./db')

const init = database => {
    const create = async (data) => {
        const conn = await db.init(database)
        await db.queryWithParams(conn, `INSERT INTO categories (id, category) values (?, ?)`, data)
    }

    const findall = async () => {
        const conn = await db.init(database)
        return await db.query(conn, `SELECT * FROM categories`)
    }

    const findallPaginated = async ({ pageSize = 1, currentPage = 0 }) => {
        const conn = await db.init(database)
        const registers = await db.query(conn, `SELECT * FROM categories limit ${currentPage * pageSize}, ${pageSize + 1}`)
        const hasNext = registers.length > pageSize
        if (hasNext) {
            registers.pop()
        }
        return {
            data: registers,
            hasNext: hasNext
        }
    }

    const remove = async (category_id) => {
        const conn = await db.init(database)
        await db.queryWithParams(conn, `delete FROM categories where id=?`, [category_id])
    }

    const update = async (category_id, data) => {
        const conn = await db.init(database)
        await db.queryWithParams(conn, `UPDATE categories SET category=? WHERE id=?`, [...data, category_id])
    }
    //agora retornamos os métodos
    return {
        findall,
        findallPaginated,
        remove,
        create,
        update
    }
}

module.exports = init