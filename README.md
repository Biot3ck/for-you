# For You

Website ulang tahun pribadi berbahasa Turki dengan tema bunga lily dan warna lembut.

## Teknologi

HTML, CSS, dan JavaScript murni, dengan animasi SVG dan Canvas. Tidak memerlukan framework, npm, atau proses build.

## Menjalankan secara lokal

Buka terminal di folder ini, kemudian jalankan:

```sh
python3 -m http.server 8080
```

Buka `http://localhost:8080` di browser. Untuk menghentikan server, tekan `Ctrl+C`.

## Struktur

- `index.html`: halaman, isi ucapan, kode akses, dan sebagian interaksi.
- `assets/opening-scene.*`: halaman hati dan pohon pembuka.
- `assets/opening-celebration.*`: perayaan setelah hati ditekan.
- `assets/garden-growth.*`: taman lily yang tumbuh saat disentuh.
- `assets/video-inspired.*`: kotak kenangan dan kartu foto.
- `assets/final-keepsake.*`: buket penutup dan kartu yang dapat diunduh.
- `assets/shared-atmosphere.*`: latar animasi bersama.
- `assets/playful.*`, `assets/portrait.css`, dan berkas CSS lainnya: tampilan dan detail interaksi.
- `assets/fonts/`: font lokal.
- `assets/memory-*.jpg`, `assets/birthday-sticker.png`: foto dan ilustrasi pribadi.
- `assets/Happy Birthday.mp3`: musik latar.

## Alur

Kode akses → layar hati → tekan hati → animasi perayaan → pohon hati → halaman utama.

Halaman utama berisi surat, kotak foto dengan catatan, taman lily interaktif, partikel hati yang berubah menjadi nama, amplop ucapan, kue harapan, buket lily, dan kartu kenangan yang dapat disimpan.

## Mengubah isi

Ucapan, kode akses, dan referensi aset ada di `index.html`. Beberapa catatan dan animasi berada di berkas JavaScript terkait di `assets/`. Kode akses hanya diperiksa di browser; kode ini bukan autentikasi server.

## Hosting statis

Unggah seluruh isi folder ini, termasuk `index.html` dan folder `assets/`. Jika layanan hosting meminta pengaturan build, biarkan perintah build kosong dan gunakan akar repository sebagai direktori keluaran.

Simpan repository sebagai **private** karena memuat foto, musik, dan ucapan pribadi.
