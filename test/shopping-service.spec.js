const ShoppingService = require('../src/shopping-list-service');
const knex = require('knex');

describe('Shopping List Service Object', () => {
    let db;
    let testItems = [
        {
            id: 1,
            name: 'Fish tricks',
            price: '13.10',
            date_added: new Date('2029-01-22T16:28:32.615Z'),
            checked: false,
            category: 'Main',
        },
        {
            id: 2,
            name: 'Not Dogs',
            price: '4.99',
            date_added: new Date('2029-01-22T16:28:32.615Z'),
            checked: false,
            category: 'Snack',
        },
        {
            id: 3,
            name: 'Buffalo Wings',
            price: '5.50',
            date_added: new Date('2029-01-22T16:28:32.615Z'),
            checked: false,
            category: 'Snack',
        }
    ]

    before(() => {
        db = knex({
            client: 'pg',
            connection: process.env.TEST_DB_URL,
        })
    })

    before(() => db('shopping_list').truncate())

    afterEach(() => db('shopping_list').truncate())

    after(() => db.destroy())

    context(`Given shopping_list has data`, () => {
        beforeEach(() => {
            return db
              .into('shopping_list')
              .insert(testItems)
        })

        it(`getAllItems() resolves all items from shopping_list`, () => {
            return ShoppingService.getAllItems(db)
                .then(actual => {
                    expect(actual).to.eql(testItems)
                })
        })

        it(`getById() resolves an item with given Id`, () => {
            const thirdId = 3
            const thirdItem = testItems[thirdId - 1]

            return ShoppingService.getById(db, thirdId)
                .then(actual => {
                    expect(actual).to.eql({
                        id: thirdId,
                        name: thirdItem.name,
                        price: thirdItem.price,
                        date_added: thirdItem.date_added,
                        checked: thirdItem.checked,
                        category: thirdItem.category,
                    })
                })
        })

        it(`deleteItem() removes an item with given Id`, () => {
            const thirdId = 3
            
            return ShoppingService.deleteItem(db, thirdId)
                .then(() => ShoppingService.getAllItems(db))
                .then(allItems => {
                    const expected = testItems.filter(item => item.id !== thirdId)
                    expect(allItems).to.eql(expected)
                })
        })

        it(`updateItem() updates an item with given Id`, () => {
            const idToUpdate = 3
            const newItemData = {
                name: 'Updated Fish',
                price: '15.10',
                date_added: new Date('2029-01-22T16:28:32.615Z'),
                checked: false,
                category: 'Snack',
            }

            return ShoppingService.updateItem(db, idToUpdate, newItemData)
                .then(() => ShoppingService.getById(db, idToUpdate))
                .then(actual => {
                    expect(actual).to.eql({
                        id: idToUpdate,
                        ...newItemData
                    })
                })
        })
    })

    context(`Given shopping_list has no data`, () => {
        it(`getAllItems() resolves an empty array`, () => {
            return ShoppingService.getAllItems(db)
                .then(actual => {
                    expect(actual).to.eql([])
                })
        })

        it(`insertItem() inserts an item and resolves the item with id`, () => {
            const newItem = {
                    id: 1,
                    name: 'Fish tricks',
                    price: '13.10',
                    date_added: new Date('2029-01-22T16:28:32.615Z'),
                    checked: false,
                    category: 'Main',
            }
            
            return ShoppingService.insertItem(db, newItem)
                .then(actual => {
                    expect(actual).to.eql({
                        id: 1,
                        name: newItem.name,
                        price: newItem.price,
                        date_added: newItem.date_added,
                        checked: newItem.checked,
                        category: newItem.category,
                    })
                })
        })
    })
})