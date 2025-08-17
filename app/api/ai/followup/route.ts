import { handleFollowup } from "@/features/agent/server/followup"
//import { CMS_FOLLOWUP_DEFAULT, CMS_FOLLOWUP_SYSTEM } from "@/features/agent/knowledge"

const FALLBACK = `
1) Apa nama brand dan deskripsi singkat bisnis Anda?
2) Siapa target audiens utama (persona/segmen/industri/lokasi)?
3) Produk/layanan inti apa yang ditawarkan? Sebutkan 3–5 fitur/keunggulan utamanya.
4) Unique Value Proposition (UVP) Anda dalam 1–2 kalimat?
5) Tujuan utama halaman ini (contoh: kumpulkan leads, penjualan langsung, booking demo, unduhan)?
6) Call-to-Action (CTA) utama: teks tombolnya apa dan mengarah ke mana (URL/aksi)?
7) Nada dan gaya bahasa (formal/santai/profesional/fun) serta bahasa yang digunakan (ID/EN/dll)?
8) Preferensi visual/brand (warna, font, guideline, logo). Apakah ada aset khusus yang harus ditampilkan?
9) Susunan konten yang diinginkan (mis. Hero → Fitur → Testimonial → Pricing → FAQ → Footer). Ada bagian wajib?
10) Bukti sosial yang tersedia (testimoni, logo klien, penghargaan, studi kasus)?
11) Struktur harga/penawaran (nama paket, harga, fitur utama, garansi/promo)?
12) Kepatuhan/ketentuan (disclaimer, privacy/terms, perizinan/lokasi, regulasi tertentu)?
13) Informasi kontak & social (email, WhatsApp, telepon, sosmed) dan jam operasional?
14) Integrasi/alat yang dibutuhkan (analytics, pixel, chat, CRM, form provider)?
15) Contoh/benchmark kompetitor atau referensi (tanpa link, cukup deskripsikan apa yang disukai)?
16) Batasan teknis (deadline, device fokus, aksesibilitas, bahasa multi/locale)?
17) Preferensi lokalisasi (mata uang, zona waktu, format tanggal)?
18) Metrik keberhasilan utama yang ingin dipantau?
`.trim()

export const dynamic = "force-dynamic"

export async function POST(req: Request) {
  return handleFollowup(req, { system: CMS_FOLLOWUP_SYSTEM, fallback: CMS_FOLLOWUP_DEFAULT })
}
