// absensi/backend/models/absensiModels.js

import { DataTypes } from "sequelize";
import db from "../config/database.js";
import UsersMahasiswa from "./userMahasiswaModels.js";
import Matakuliah from "./matakuliahModels.js";

const Absensi = db.define(
  "absensi",
  {
    id_absen: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    nim: {
      type: DataTypes.STRING(20),
      allowNull: false,
      references: { model: UsersMahasiswa, key: "nim" },
      onDelete: "CASCADE", 
    },
    id_matakuliah: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: Matakuliah, key: "id_matakuliah" },
    },
    waktu_absen: { type: DataTypes.DATE, allowNull: false },
    status: {
      type: DataTypes.ENUM("Hadir", "Tidak Hadir", "Izin", "Sakit"),
      allowNull: false,
    },
    keterangan: { type: DataTypes.TEXT, allowNull: true },
    createdAt: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
    updatedAt: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
  },
  { freezeTableName: true, timestamps: true }
);

Absensi.belongsTo(UsersMahasiswa, { foreignKey: "nim", as: "Usersmahasiswa" });
Absensi.belongsTo(Matakuliah, { foreignKey: "id_matakuliah", as: "Matakuliah" });

export default Absensi;