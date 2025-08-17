export const CMS_FAQ_EXAMPLES = `
Q: Bagaimana cara menampilkan hasil di Preview?
A: Pastikan setidaknya satu root node terhubung ke node dengan id 'preview' (edge: source=<root>, target='preview').

Q: Urutan anak di dalam parent ditentukan oleh apa?
A: Ditentukan oleh nilai position.x anak secara ascending (semakin kiri, semakin dulu dirender).

Q: Kapan memakai row vs column?
A: row untuk menyusun secara horizontal; column untuk susunan vertikal. Kombinasikan sesuai kebutuhan.

Q: Bagaimana memberi style kustom?
A: Gunakan props.className (Tailwind/kelas) dan props.styleJson (string JSON, mis. {"border":"1px solid #eee"}).

Q: Apa saja size untuk button?
A: size: sm | md | lg (dipetakan ke ukuran shadcn).

Q: Apa perbedaan 'type' dan 'rfType' di schema?
A: 'rfType' adalah ReactFlow node.type (mis. 'component'). 'data.type' adalah jenis komponen CMS (section, text, dll).
`.trim()
