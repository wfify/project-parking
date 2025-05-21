const express = require('express');
const router = express.Router();

const controller = require('../controllers/parkirController');

router.post('/masuk', controller.masuk);
router.post('/keluar', controller.keluar);
router.get('/aktif', controller.daftarAktif);
router.get('/riwayat', controller.riwayat);

module.exports = router;
