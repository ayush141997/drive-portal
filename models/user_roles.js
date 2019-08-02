const Sequelize = require('../database/mysql').Sequelize
const sequelize = require('../database/mysql').sequelize
const Model = Sequelize.Model;

class User_roles extends Model {}
User_roles.init({
  // attributes
  id: {
    type: Sequelize.INTEGER,
    primaryKey:true,
    autoIncrement: true,
    allowNull: false
  },
  role_name: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true
  },
  created_at:{
    type:Sequelize.DATE,
    allowNull: false
  },
  modified_at:{
    type:Sequelize.DATE,
    allowNull: false
  }
},
  {
  sequelize,
  modelName: 'user_role',
  timestamps:false
});

// User_roles.sync({alter:true})

module.exports={
  User_roles
}