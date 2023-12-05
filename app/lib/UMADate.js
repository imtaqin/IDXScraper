const indonesianMonths = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
];

function convertToTanggalBulan(dateStr) {
    const dateObj = new Date(dateStr);
    const day = dateObj.getDate();
    const month = indonesianMonths[dateObj.getMonth()];
    const year = dateObj.getFullYear();
    return `${day} ${month} ${year}`;
}

export default convertToTanggalBulan;