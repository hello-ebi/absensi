// absensi/backend/models/absensiModels.js

import { DataTypes } from "sequelize";
import db from "../config/database.js";

const Dosen = db.define(
  "dosen",
  {
    id_dosen: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nama_dosen: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    email_dosen: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
    },
    nomor_dosen: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: true,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    freezeTableName: true,
    timestamps: true,
  }
);

export default Dosen;