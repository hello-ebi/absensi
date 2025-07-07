// backend/models/notifikasiModel.js

import { Sequelize } from "sequelize";
import db from "../config/database.js";
import Mahasiswa from "./userMahasiswaModels.js";
import Admin from "./usersAdmin.js";
import UsersMahasiswa from "./userMahasiswaModels.js";

const { DataTypes } = Sequelize;

const Notifikasi = db.define(
  "notifikasi",
  {
    id_notifikasi: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    judul: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    pesan: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("dibaca", "belum_dibaca"),
      defaultValue: "belum_dibaca",
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

export default Notifikasi;