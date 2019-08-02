const Sequelize = require('sequelize');
const dbConfig =  require('../config.json').database

//Connect to database
const sequelize = new Sequelize(dbConfig.db, dbConfig.user, dbConfig.password, {
  host: dbConfig.host,
  dialect: dbConfig.dialect
},{
    timestamps: false
});

//To test the connection
sequelize
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

module.exports = {
    sequelize,
    Sequelize
}