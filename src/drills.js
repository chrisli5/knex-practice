require('dotenv').config()
const knex = require('knex')

const knexInstance = knex({
    client: 'pg',
    connection: process.env.DB_URL
})

function searchByName(searchTerm) {
    knexInstance
        .select('id', 'price', 'date_added', 'checked', 'category')
        .from('shopping_list')
        .where('name', 'ILIKE', `%${searchTerm}%`)
        .then(result => {
            console.log(result)
        })
}

function paginateProducts(page) {
    const productsPerPage = 10
    const offset = productsPerPage * (page - 1)
    knexInstance
        .select('id', 'price', 'date_added', 'checked', 'category')
        .from('shopping_list')
        .limit(productsPerPage)
        .offset(offset)
        .then(result => {
            console.log(result)
        })
}

function afterDate(daysAgo) {
    knexInstance
        .select('id', 'price', 'date_added', 'checked', 'category')
        .from('shopping_list')
        .where(
            'date_added',
            '>',
            knexInstance.raw(`now() - '?? days'::INTERVAL`, daysAgo)
        )
        .then(result => {
            console.log(result)
        })
}

function costByCategory() {
    knexInstance
        .select('category')
        .sum('price AS total_price')
        .from('shopping_list')
        .groupBy('category')
        .then(result => {
            console.log(result)
        })
}

costByCategory();