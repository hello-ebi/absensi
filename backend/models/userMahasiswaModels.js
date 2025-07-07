// absensi/backend/models/userMahasiswaModels.js

import { DataTypes } from "sequelize";
import db from "../config/database.js";
import Prodi from "./prodiModels.js";

const UsersMahasiswa = db.define(
  "usersmahasiswa",
  {
    nim: {
      type: DataTypes.STRING(20),
      primaryKey: true,
    },
    nama: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    refresh_token: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    id_prodi: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Prodi,
        key: "id_prodi",
      },
    },
    semester: {
      type: DataTypes.INTEGER,
      allowNull: false,
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

UsersMahasiswa.belongsTo(Prodi, { foreignKey: "id_prodi" });

export default UsersMahasiswa;