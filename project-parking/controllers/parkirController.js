const db = require('../db');

exports.masuk = (req, res) => {
  const { plat_nomor, jenis_kendaraan } = req.body;
  const waktu_masuk = new Date();

  const sql = `INSERT INTO parkir (plat_nomor, jenis_kendaraan, waktu_masuk)
               VALUES (?, ?, ?)`;
  db.query(sql, [plat_nomor, jenis_kendaraan, waktu_masuk], (err, result) => {
    if (err) return res.status(500).send(err);
    res.send({ message: "Kendaraan masuk dicatat.", id: result.insertId });
  });
};

exports.keluar = (req, res) => {
  const { plat_nomor } = req.body;
  const waktu_keluar = new Date();

  const selectSql = `SELECT * FROM parkir WHERE plat_nomor = ? AND waktu_keluar IS NULL LIMIT 1`;
  db.query(selectSql, [plat_nomor], (err, results) => {
    if (err || results.length === 0) return res.status(404).send({ message: "Data tidak ditemukan." });

    const masuk = new Date(results[0].waktu_masuk);
    const durasiJam = Math.ceil((waktu_keluar - masuk) / 1000 / 60 / 60);
    const tarifPerJam = results[0].jenis_kendaraan === 'mobil' ? 5000 : 2000;
    const totalTarif = durasiJam * tarifPerJam;

    const updateSql = `UPDATE parkir SET waktu_keluar = ?, tarif = ? WHERE id = ?`;
    db.query(updateSql, [waktu_keluar, totalTarif, results[0].id], (err2) => {
      if (err2) return res.status(500).send(err2);
      res.send({ message: "Kendaraan keluar", totalTarif });
    });
  });
};

exports.daftarAktif = (req, res) => {
  const sql = `SELECT * FROM parkir WHERE waktu_keluar IS NULL`;
  db.query(sql, (err, results) => {
    if (err) return res.status(500).send(err);
    res.send(results);
  });
};

exports.riwayat = (req, res) => {
  const sql = `SELECT * FROM parkir WHERE waktu_keluar IS NOT NULL ORDER BY waktu_keluar DESC`;
  db.query(sql, (err, results) => {
    if (err) return res.status(500).send(err);
    res.send(results);
  });
};
