const { connection } = require('./index')
var mysqlBackbone = require('mysql-backbone')

const UserMessage = mysqlBackbone.Model.extend({
    connection: connection,
    tableName: 'user_messages',
})

var UserMessages = mysqlBackbone.Collection.extend({
    model: UserMessage,
    connection: connection,
    tableName: 'user_messages',
})

module.exports = {
    UserMessage,
    UserMessages,
}
