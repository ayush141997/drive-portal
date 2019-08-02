const Sequelize = require('../database/mysql').Sequelize
const sequelize = require('../database/mysql').sequelize
const Model = Sequelize.Model;

class Drive extends Model { }
Drive.init({
  // attributes
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  name: {
    type: Sequelize.STRING
  },
  location: {
    type: Sequelize.STRING,
    allowNull: false
  }, 
  date: {
    type: Sequelize.DATEONLY,
    allowNull: false
  },
  status: {
    type: Sequelize.ENUM(['Started', 'Paused', 'Ended']),
    allowNull: false,
    defaultValue: 'Started'
  },
  started_by: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  modified_by: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  created_at: {
    type: Sequelize.DATE,
    allowNull: false
  },
  modified_at: {
    type: Sequelize.DATE,
    allowNull: false
  }
},
  {
    sequelize,
    modelName: 'drive',
    timestamps: false

  });

  // Drive.sync({alter:true})

module.exports = {
  Drive
}

//Drive.sync();
// sequelize.sync()
//   .then(() => Drive.create({

//   }))