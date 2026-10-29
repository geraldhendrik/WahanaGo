        // Menyimpan data asli dari Laravel API
        let dataWahana = [];

        // Menyimpan pilihan sortir dan kata kunci pencarian
        let jenisSortirAktif = 'all';
        let kataKunciAktif = '';

        // Mengambil data wahana dari backend Laravel
        async function ambilWahana() {
            const daftarWahana = document.getElementById('daftar-wahana');

            try {
                const response = await fetch(
                    'http://127.0.0.1:8000/api/wahana'
                );

                if (!response.ok) {
                    throw new Error('Gagal mengambil data wahana');
                }

                const data = await response.json();

                if (!Array.isArray(data)) {
                    throw new Error('Format data API bukan array');
                }

                dataWahana = data;

                // Tampilkan semua wahana ketika halaman dibuka
                prosesDanTampilkanWahana();

                
                // Fitur pencarian langsung
                const inputSearch = document.getElementById('input-search');

                inputSearch.addEventListener('input', function () {
                    kataKunciAktif = this.value.trim();
                    prosesDanTampilkanWahana();
                });

                // Tombol Cari menjalankan pencarian
                document.getElementById('tombol-search').addEventListener(
                    'click',
                    function () {
                        kataKunciAktif = inputSearch.value.trim();
                        prosesDanTampilkanWahana();
                    }
                );

            } catch (error) {
                console.error('Terjadi kesalahan:', error);

                daftarWahana.textContent =
                    'Gagal memuat wahana. Pastikan server Laravel berjalan dan API dapat diakses.';
            }
        }

        // Menampilkan kartu wahana
        function tampilkanWahana(data) {
            const daftarWahana = document.getElementById('daftar-wahana');

            daftarWahana.innerHTML = '';

            if (data.length === 0) {
                daftarWahana.textContent = 'Wahana tidak ditemukan.';
                return;
            }

            data.forEach(item => {
                const kartu = document.createElement('div');
                kartu.className = 'kartu-wahana';

                const kategori = document.createElement('span');
                kategori.className = 'kategori-wahana';
                kategori.textContent = item.kategori ?? 'Tanpa kategori';

                const nama = document.createElement('h3');
                nama.textContent = item.nama ?? 'Wahana tanpa nama';

                const harga = document.createElement('p');
                harga.className = 'harga-wahana';
                harga.textContent =
                    'Rp' + Number(item.harga).toLocaleString('id-ID');

                // Buat tombol pilih wahana
                const tombolPilih = document.createElement('button');
                tombolPilih.type = 'button';
                tombolPilih.className = 'tombol-pilih-wahana';
                tombolPilih.textContent = 'Pilih Wahana Ini';

                tombolPilih.dataset.nama = item.nama ?? 'Wahana tanpa nama';
                tombolPilih.dataset.kategori = item.kategori ?? 'Tanpa kategori';
                tombolPilih.dataset.harga = Number(item.harga) || 0;

                const gambar = document.createElement('img');
                gambar.src = `http://127.0.0.1:8000/${item.gambar}`;
                gambar.alt = item.nama ?? 'Gambar wahana';
                gambar.className = 'gambar-wahana';
                gambar.loading = 'lazy';

                // Tampilkan gambar di dalam kartu
                kartu.appendChild(gambar);

                // Masukkan informasi wahana ke dalam kartu
                kartu.appendChild(kategori);
                kartu.appendChild(nama);
                kartu.appendChild(harga);
                kartu.appendChild(tombolPilih);

                // Masukkan kartu ke daftar wahana
                daftarWahana.appendChild(kartu);
            });
        }

        
/* =========================================
   ALGORITMA SEARCHING: LINEAR SEARCH
   ========================================= */

function linearSearchWahana(data, kataKunci, log) {
    const hasil = [];
    const kata = kataKunci.toLowerCase();

    if (kata === '') {
        log.push('Kata kunci kosong. Semua wahana ditampilkan.');
        return [...data];
    }

    log.push(`Mulai mencari nama wahana: "${kataKunci}"`);

    for (let i = 0; i < data.length; i++) {
        const nama = String(data[i].nama ?? '');

        log.push(`Memeriksa data ke-${i + 1}: ${nama}`);

        if (nama.toLowerCase().includes(kata)) {
            hasil.push(data[i]);
            log.push(`  -> "${nama}" cocok dengan kata kunci.`);
        } else {
            log.push(`  -> "${nama}" tidak cocok.`);
        }
    }

    log.push(`Pencarian selesai. Ditemukan ${hasil.length} wahana.`);

    return hasil;
}


/* =========================================
   ALGORITMA SORTING: SELECTION SORT
   ========================================= */

function selectionSortWahana(data, jenis, log) {
    const hasil = [...data];

    let pembanding;

    switch (jenis) {
        case 'harga-asc':
            pembanding = (a, b) =>
                Number(a.harga) - Number(b.harga);
            log.push('Metode: Selection Sort berdasarkan harga termurah.');
            break;

        case 'harga-desc':
            pembanding = (a, b) =>
                Number(b.harga) - Number(a.harga);
            log.push('Metode: Selection Sort berdasarkan harga termahal.');
            break;

        case 'kategori':
            pembanding = (a, b) =>
                String(a.kategori ?? '').localeCompare(
                    String(b.kategori ?? ''), 'id'
                );
            log.push('Metode: Selection Sort berdasarkan kategori A–Z.');
            break;

        case 'nama-asc':
            pembanding = (a, b) =>
                String(a.nama ?? '').localeCompare(
                    String(b.nama ?? ''), 'id'
                );
            log.push('Metode: Selection Sort berdasarkan nama A–Z.');
            break;

        case 'nama-desc':
            pembanding = (a, b) =>
                String(b.nama ?? '').localeCompare(
                    String(a.nama ?? ''), 'id'
                );
            log.push('Metode: Selection Sort berdasarkan nama Z–A.');
            break;

        default:
            return hasil;
    }

    log.push('Data awal: ' + hasil.map(w => w.nama).join(' → '));

    for (let i = 0; i < hasil.length - 1; i++) {
        let indeksTerpilih = i;

        log.push(`Langkah ${i + 1}: mencari data terbaik dari posisi ${i + 1}.`);

        for (let j = i + 1; j < hasil.length; j++) {
            log.push(
                `Membandingkan "${hasil[indeksTerpilih].nama}" dengan "${hasil[j].nama}".`
            );

            if (pembanding(hasil[j], hasil[indeksTerpilih]) < 0) {
                indeksTerpilih = j;

                log.push(
                    `Kandidat terpilih sekarang: "${hasil[indeksTerpilih].nama}".`
                );
            }
        }

        if (indeksTerpilih !== i) {
            const namaAwal = hasil[i].nama;
            const namaPengganti = hasil[indeksTerpilih].nama;

            [hasil[i], hasil[indeksTerpilih]] =
                [hasil[indeksTerpilih], hasil[i]];

            log.push(
                `Menukar "${namaAwal}" dengan "${namaPengganti}".`
            );
        } else {
            log.push(`"${hasil[i].nama}" sudah berada di posisi yang benar.`);
        }

        log.push(
            'Kondisi data: ' + hasil.map(w => w.nama).join(' → ')
        );
    }

    log.push('Sorting selesai.');
    log.push('Hasil akhir: ' + hasil.map(w => w.nama).join(' → '));

    return hasil;
}


/* =========================================
   MENGGABUNGKAN SEARCHING DAN SORTING
   ========================================= */

function prosesDanTampilkanWahana() {
    const logPencarian = [];
    const logPengurutan = [];

    // Jalankan Linear Search terlebih dahulu
    let hasil = linearSearchWahana(
        dataWahana,
        kataKunciAktif,
        logPencarian
    );

    // Jalankan Selection Sort pada hasil pencarian
    if (jenisSortirAktif !== 'all') {
        hasil = selectionSortWahana(
            hasil,
            jenisSortirAktif,
            logPengurutan
        );
    } else {
        logPengurutan.push('Menampilkan data sesuai urutan awal dari API.');
    }

    // Perbarui kartu wahana
    tampilkanWahana(hasil);

    // Tampilkan log searching
    document.getElementById('log-searching').textContent =
        logPencarian.join('\n');

    // Tampilkan log sorting
    document.getElementById('log-sorting').textContent =
        logPengurutan.join('\n');
}


        // ELEMEN MENU SORTIR
        const tombolSortir = document.getElementById('tombol-sortir');
        const pilihanSortir = document.getElementById('pilihan-sortir');
        const logSorting = document.getElementById('log-sorting');

        // Membuka dan menutup dropdown sortir
        tombolSortir.addEventListener('click', () => {
            const sedangTerbuka =
                !pilihanSortir.classList.contains('hidden');

            pilihanSortir.classList.toggle('hidden');
            tombolSortir.setAttribute(
                'aria-expanded',
                String(!sedangTerbuka)
            );
        });

        // Menjalankan pilihan sortir
        pilihanSortir.addEventListener('click', event => {
            const tombol = event.target.closest('button[data-sort]');

            if (!tombol) return;

            jenisSortirAktif = tombol.dataset.sort;

            prosesDanTampilkanWahana();

            pilihanSortir.classList.add('hidden');
            tombolSortir.setAttribute('aria-expanded', 'false');
        });


        // TIKET SAYA
        const kunciTiket = 'wahanaGoTiket';

        // Mengambil tiket yang tersimpan
        function ambilDaftarTiket() {
            try {
                const data = JSON.parse(
                    localStorage.getItem(kunciTiket) || '[]'
                );

                return Array.isArray(data) ? data : [];
            } catch (error) {
                return [];
            }
        }

        // Menyimpan tiket dan memperbarui tampilan
        function simpanDanTampilkanTiket(keranjang) {
            localStorage.setItem(
                kunciTiket,
                JSON.stringify(keranjang)
            );

            tampilkanTiketSaya();
        }

        // Menambahkan wahana ke Tiket Saya
        document.getElementById('daftar-wahana').addEventListener(
            'click',
            function (event) {
                const tombol = event.target.closest(
                    '.tombol-pilih-wahana'
                );

                if (!tombol) return;

                const keranjang = ambilDaftarTiket();
                const nama = tombol.dataset.nama;

                const tiketAda = keranjang.find(
                    tiket => tiket.nama === nama
                );

                if (tiketAda) {
                    tiketAda.jumlah += 1;
                } else {
                    keranjang.push({
                        nama: nama,
                        kategori: tombol.dataset.kategori,
                        harga: Number(tombol.dataset.harga) || 0,
                        jumlah: 1
                    });
                }

                simpanDanTampilkanTiket(keranjang);

                alert(nama + ' berhasil ditambahkan ke Tiket Saya!');
            }
        );

        // Menampilkan daftar tiket
        function tampilkanTiketSaya() {
            const daftarTiket = document.getElementById('daftar-tiket');
            const keranjang = ambilDaftarTiket();

            daftarTiket.innerHTML = '';

            let totalJumlah = 0;
            let totalHarga = 0;

            if (keranjang.length === 0) {
                daftarTiket.textContent =
                    'Belum ada tiket. Yuk, pilih wahana favoritmu!';
            }

            keranjang.forEach((tiket, index) => {
                const subtotal = tiket.harga * tiket.jumlah;

                totalJumlah += tiket.jumlah;
                totalHarga += subtotal;

                const kartu = document.createElement('div');
                kartu.className = 'item-tiket';

                const nama = document.createElement('h3');
                nama.textContent = tiket.nama;

                const kategori = document.createElement('p');
                kategori.textContent = 'Kategori: ' + tiket.kategori;

                const harga = document.createElement('p');
                harga.textContent =
                    'Harga satuan: Rp' +
                    tiket.harga.toLocaleString('id-ID');

                const subtotalText = document.createElement('p');
                subtotalText.textContent =
                    'Subtotal: Rp' +
                    subtotal.toLocaleString('id-ID');

                const kontrol = document.createElement('div');
                kontrol.className = 'kontrol-jumlah-tiket';

                // Tombol kurangi jumlah tiket
                const tombolKurangi = document.createElement('button');
                tombolKurangi.type = 'button';
                tombolKurangi.textContent = '−';
                tombolKurangi.setAttribute(
                    'aria-label',
                    'Kurangi tiket'
                );

                tombolKurangi.addEventListener('click', function () {
                    const data = ambilDaftarTiket();

                    if (data[index].jumlah > 1) {
                        data[index].jumlah -= 1;
                    } else {
                        data.splice(index, 1);
                    }

                    simpanDanTampilkanTiket(data);
                });

                // Jumlah tiket
                const jumlah = document.createElement('span');
                jumlah.textContent = tiket.jumlah + ' tiket';

                // Tombol tambah jumlah tiket
                const tombolTambah = document.createElement('button');
                tombolTambah.type = 'button';
                tombolTambah.textContent = '+';
                tombolTambah.setAttribute(
                    'aria-label',
                    'Tambah tiket'
                );

                tombolTambah.addEventListener('click', function () {
                    const data = ambilDaftarTiket();
                    data[index].jumlah += 1;
                    simpanDanTampilkanTiket(data);
                });

                // Tombol hapus tiket
                const tombolHapus = document.createElement('button');
                tombolHapus.type = 'button';
                tombolHapus.className = 'tombol-hapus-tiket';
                tombolHapus.textContent = 'Hapus';

                tombolHapus.addEventListener('click', function () {
                    const data = ambilDaftarTiket();
                    data.splice(index, 1);
                    simpanDanTampilkanTiket(data);
                });

                kontrol.appendChild(tombolKurangi);
                kontrol.appendChild(jumlah);
                kontrol.appendChild(tombolTambah);
                kontrol.appendChild(tombolHapus);

                kartu.appendChild(nama);
                kartu.appendChild(kategori);
                kartu.appendChild(harga);
                kartu.appendChild(subtotalText);
                kartu.appendChild(kontrol);

                daftarTiket.appendChild(kartu);
            });

            document.getElementById('jumlah-tiket').textContent =
                totalJumlah;

            document.getElementById('total-harga').textContent =
                'Rp' + totalHarga.toLocaleString('id-ID');
        }

        // Simulasi checkout
        document.getElementById('tombol-checkout').addEventListener(
            'click',
            function () {
                const keranjang = ambilDaftarTiket();

                if (keranjang.length === 0) {
                    alert('Pilih wahana terlebih dahulu!');
                    return;
                }

                const total = keranjang.reduce(
                    (hasil, tiket) =>
                        hasil + tiket.harga * tiket.jumlah,
                    0
                );

                const jumlahSemuaTiket = keranjang.reduce(
                    (hasil, tiket) => hasil + tiket.jumlah,
                    0
                );

                alert(
                    'Checkout simulasi berhasil dibuka!\n' +
                    'Total tiket: ' + jumlahSemuaTiket +
                    '\nTotal pembayaran: Rp' +
                    total.toLocaleString('id-ID')
                );
            }
        );

        // Tampilkan tiket tersimpan saat halaman dibuka
        tampilkanTiketSaya();

        // Ambil data wahana dari API saat halaman dibuka
        ambilWahana();

        
        
        const tombolLog = document.getElementById('tombol-log');
        const modalLog = document.getElementById('modal-log');
        const tombolTutupLog = document.getElementById('tutup-log');
        const tombolTutupBawah = document.getElementById('tombol-tutup-log');

        // Membuka jendela Log Sorting
        tombolLog.addEventListener('click', function () {
            modalLog.classList.remove('hidden');
        });

        // Menutup jendela Log Sorting
        function tutupModalLog() {
            modalLog.classList.add('hidden');
        }

        tombolTutupLog.addEventListener('click', tutupModalLog);
        tombolTutupBawah.addEventListener('click', tutupModalLog);

        // Menutup modal ketika area di luar form diklik
        modalLog.addEventListener('click', function (event) {
            if (event.target === modalLog) {
                tutupModalLog();
            }
        });

        // Menutup modal menggunakan tombol Escape
        document.addEventListener('keydown', function (event) {
            if (event.key === 'Escape') {
                tutupModalLog();
            }
        });
