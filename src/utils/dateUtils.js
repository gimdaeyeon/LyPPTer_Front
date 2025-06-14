export function getDate() {
    const d   = new Date();              // 현재 시각
    const yyyy = d.getFullYear();
    const mm   = String(d.getMonth() + 1).padStart(2, '0'); // 1~12
    const dd   = String(d.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
}