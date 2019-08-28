require('dotenv').config()
const knex = require('knex')

const knexInstance = knex({
    client: 'pg',
    connection: process.env.DB_URL
  })

knexInstance
  .select('product_id', 'name', 'price', 'category')
  .from('amazong_products')
  .where({ name: 'Point of view gun' })
  .first()
  .then(result => {
    console.log(result)
  })