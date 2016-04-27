'use strict';
module.exports = function(sequelize, DataTypes) {
  var favorite = sequelize.define('favorite', {
    userId: DataTypes.STRING,
    title: DataTypes.STRING,
    author: DataTypes.STRING,
    isbn: DataTypes.STRING,
    rating: DataTypes.INTEGER,
    pageCount: DataTypes.INTEGER,
    description: DataTypes.TEXT,
    image: DataTypes.TEXT
  }, {
    classMethods: {
      associate: function(models) {
        models.favorite.belongsTo(models.user);
      }
    }
  });
  return favorite;
};