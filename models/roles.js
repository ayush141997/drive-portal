const sequelize = require('../database/mysql').sequelize
const Sequelize = require('../database/mysql').Sequelize
const Model = Sequelize.Model;
class Roles extends Model { }

Roles.init({
  // attributes
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  role_name: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true
  },
  created_by: {
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
    modelName: 'role',
    timestamps: false

  });

// Roles.sync({ alter: true });

module.exports = {
  Roles
}
