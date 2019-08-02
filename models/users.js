const Sequelize = require('../database/mysql').Sequelize
const sequelize = require('../database/mysql').sequelize
const user_roles = require('../models/user_roles').User_roles

const Model = Sequelize.Model;
class Users extends Model { }

Users.init({
  // attributes
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  user_name: {
    type: Sequelize.STRING,
    allowNull: false
  },
  role_id: {         //FK to user_roles
    type: Sequelize.INTEGER,
    references: {
      model: user_roles,
      key: 'id',
    },
    allowNull: false
  },
  email: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true
  },
  profile: {
    type: Sequelize.STRING,
    allowNull: false,
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
    modelName: 'user',
    timestamps: false
  });

// Users.sync({ alter: true })
Users.findUserWithRole = async (email, id) => {
  if(email) {
    let response = await sequelize.query(`SELECT users.id, user_roles.role_name, user_name, email, profile 
                            FROM users 
                            INNER JOIN user_roles ON users.role_id = user_roles.id 
                            WHERE users.email = '${email}'`,{type : Sequelize.QueryTypes.SELECT}
                            )
    return response
  } else {
    let response = await sequelize.query(`SELECT users.id, user_roles.role_name, user_name, email, profile 
                            FROM users 
                            INNER JOIN user_roles ON users.role_id = user_roles.id 
                            WHERE users.id = '${id}'`,{type : Sequelize.QueryTypes.SELECT}
                            )
    return response
  }
}

module.exports = {
  Users
}