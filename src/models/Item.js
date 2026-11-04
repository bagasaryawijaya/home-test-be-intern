import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";
import User from "./User.js";

const Item = sequelize.define("Item", {
  id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
  userId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false, field: "user_id" },
  name: { type: DataTypes.STRING(150), allowNull: false, validate: { notEmpty: true } },
  description: { type: DataTypes.TEXT, allowNull: true },
  stock: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false, validate: { min: 0 } },
  price: { type: DataTypes.DECIMAL(15, 2), allowNull: false, validate: { min: 0 } }
}, { tableName: "items", timestamps: true });

User.hasMany(Item, { foreignKey: "userId", onDelete: "CASCADE" });
Item.belongsTo(User, { foreignKey: "userId" });

export default Item;
