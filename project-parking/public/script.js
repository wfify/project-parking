document.addEventListener('DOMContentLoaded', () => {
  const formMasuk = document.getElementById('form-masuk');
  const tabelAktif = document.querySelector('#tabel-aktif tbody');
  const tabelRiwayat = document.querySelector('#tabel-riwayat tbody');

  formMasuk.addEventListener('submit', async (e) => {
    e.preventDefault();
    const plat_nomor = document.getElementById('plat_nomor').value;
    const jenis_kendaraan = document.getElementById('jenis_kendaraan').value;

    await fetch('/api/parkir/masuk', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ plat_nomor, jenis_kendaraan })
    });

    formMasuk.reset();
    loadData();
  });

  async function loadData() {
    const aktifRes = await fetch('/api/parkir/aktif');
    const aktifData = await aktifRes.json();

    tabelAktif.innerHTML = '';
    aktifData.forEach(item => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${item.id}</td>
        <td>${item.plat_nomor}</td>
        <td>${item.jenis_kendaraan}</td>
        <td>${new Date(item.waktu_masuk).toLocaleString()}</td>
        <td><button class="keluar-btn" data-plat="${item.plat_nomor}">Keluar</button></td>
      `;
      tabelAktif.appendChild(tr);
    });

    const riwayatRes = await fetch('/api/parkir/riwayat');
    const riwayatData = await riwayatRes.json();

    tabelRiwayat.innerHTML = '';
    riwayatData.forEach(item => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${item.id}</td>
        <td>${item.plat_nomor}</td>
        <td>${item.jenis_kendaraan}</td>
        <td>${new Date(item.waktu_masuk).toLocaleString()}</td>
        <td>${new Date(item.waktu_keluar).toLocaleString()}</td>
        <td>Rp ${item.tarif}</td>
      `;
      tabelRiwayat.appendChild(tr);
    });
  }

  document.addEventListener('click', async (e) => {
    if (e.target.classList.contains('keluar-btn')) {
      const plat_nomor = e.target.dataset.plat;
      await fetch('/api/parkir/keluar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plat_nomor })
      });
      loadData();
    }
  });

  loadData();
});
