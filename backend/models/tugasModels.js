// absensi/backend/models/tugasModels.js

import { DataTypes } from "sequelize";
import db from "../config/database.js";
import Dosen from "./dosenModels.js";
import Matakuliah from "./matakuliahModels.js";

const Tugas = db.define(
  "tugas",
  {
    id_tugas: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    judul_tugas: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    deskripsi: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    id_dosen: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Dosen,
        key: "id_dosen",
      },
    },
    id_matakuliah: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Matakuliah,
        key: "id_matakuliah",
      },
    },
    tanggal_diberikan: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    deadline: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    lampiran: {
      type: DataTypes.STRING(255),
      allowNull: true,
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

Tugas.belongsTo(Dosen, { foreignKey: "id_dosen" });
Tugas.belongsTo(Matakuliah, { foreignKey: "id_matakuliah" });

export default Tugas;