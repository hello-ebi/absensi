// absensi/backend/models/index.js

import db from "../config/database.js";
import UsersMahasiswa from "./userMahasiswaModels.js";
import UsersAdmin from "./userAdminModels.js";
import Dosen from "./dosenModels.js";
import Prodi from "./prodiModels.js";
import Matakuliah from "./matakuliahModels.js";
import Tugas from "./tugasModels.js";
import Absensi from "./absensiModels.js";
import Notifikasi from "./notifikasiModels.js";

(async () => {
  try {
    await db.sync({ alter: true });
    console.log("All models were synchronized successfully.");
  } catch (error) {
    console.error("Error synchronizing models:", error);
  }
})();