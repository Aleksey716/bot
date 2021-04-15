const { connection } = require('./index');
var mysqlBackbone = require('mysql-backbone');

const UserSession = mysqlBackbone.Model.extend({
    connection: connection,
    tableName: 'user_sessions',
})

var UserSessions = mysqlBackbone.Collection.extend({
    model: UserSession,
    connection: connection,
    tableName: "user_sessions",
});

module.exports = {
    UserSession,
    UserSessions
}
