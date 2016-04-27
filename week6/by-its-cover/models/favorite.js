'use strict';
module.exports = function(sequelize, DataTypes) {
  var favorite = sequelize.define('favorite', {
    title: DataTypes.STRING,
    author: DataTypes.STRING,
    isbn: DataTypes.INTEGER,
    rating: DataTypes.INTEGER,
    pageCount: DataTypes.INTEGER,
    description: DataTypes.STRING,
    image: DataTypes.TEXT
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return favorite;
};