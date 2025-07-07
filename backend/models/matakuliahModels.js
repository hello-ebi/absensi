// absensi/backend/models/matakuliahModels.js

import { DataTypes } from "sequelize";
import db from "../config/database.js";
import Dosen from "./dosenModels.js";
import Prodi from "./prodiModels.js";

const Matakuliah = db.define(
  "matakuliah",
  {
    id_matakuliah: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nama_matakuliah: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    id_dosen: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Dosen,
        key: "id_dosen",
      },
    },
    hari: {
      type: DataTypes.ENUM("Sabtu", "Minggu"),
      allowNull: false,
    },
    jam_mulai: {
      type: DataTypes.TIME, allowNull: false,
    },
    jam_selesai: {
      type: DataTypes.TIME, allowNull: false,
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

Matakuliah.belongsTo(Dosen, { foreignKey: "id_dosen", as: "Dosen" });
Matakuliah.belongsTo(Prodi, { foreignKey: "id_prodi", as: "Prodi" });

export default Matakuliah;