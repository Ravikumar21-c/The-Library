
// ----- CONFIG: change this to the library owner's phone number in international format (no + or dashes)
const ownerWhatsApp = '918877043973'; // <-- REPLACE with real number

const seatMap = document.getElementById('seatMap');
const summary = document.getElementById('summary');
const serviceSelect = document.getElementById('service');
const dateInput = document.getElementById('date');
const timeInput = document.getElementById('time');
const nameInput = document.getElementById('name');
const phoneInput = document.getElementById('phone');
const whatsappBtn = document.getElementById('whatsappBtn');
const resetBtn = document.getElementById('resetBtn');
const ownerLink = document.getElementById('ownerLink');

const occupied = new Set(['A3', 'B6']);

const rows = ['A', 'B'];
const cols = 12;

function buildSeats() {
    seatMap.innerHTML = '';
    for (let r = 0; r < rows.length; r++) {
        for (let c = 1; c <= cols; c++) {
            const id = rows[r] + c;
            const div = document.createElement('div');
            div.className = 'seat';
            div.textContent = rows[r] + c; // show full seat id instead of only number
            div.dataset.seat = id;
            if (occupied.has(id)) div.classList.add('occupied');
            div.addEventListener('click', () => toggleSeat(div));
            seatMap.appendChild(div);
        }
    }
}

function toggleSeat(el) {
    if (el.classList.contains('occupied')) return;
    el.classList.toggle('selected');
    updateSummary();
}

function selectedSeats() {
    return Array.from(document.querySelectorAll('.seat.selected')).map(s => s.dataset.seat);
}

function updateSummary() {
    const seats = selectedSeats();
    const pricePer = Number(serviceSelect.selectedOptions[0].dataset.price || 0);
    const total = seats.length * pricePer;
    summary.textContent = seats.length ? `${seats.length} seat(s): ${seats.join(', ')} • Total ₹${total}` : 'No seats selected • Total ₹0';
}

serviceSelect.addEventListener('change', updateSummary);

whatsappBtn.addEventListener('click', () => {
    const seats = selectedSeats();
    const serviceText = serviceSelect.selectedOptions[0].textContent;
    const date = dateInput.value;
    const time = timeInput.value;
    const name = nameInput.value.trim();
    const phone = phoneInput.value.trim();

    if (!ownerWhatsApp || ownerWhatsApp.length < 6) {
        alert('Please set the ownerWhatsApp variable in the code to the library owner\'s phone number (international format, no +).');
        return;
    }

    const pricePer = Number(serviceSelect.selectedOptions[0].dataset.price || 0);
    const total = seats.length * pricePer;

    let msg = `Hello! I would like to book from The Library.%0A`;
    msg += `Service: ${serviceText}%0A`;
    msg += `Date: ${date || 'Not specified'} Time: ${time || 'Not specified'}%0A`;
    msg += `Seats: ${seats.length ? seats.join(', ') : 'None selected'}%0A`;
    msg += `Total: ₹${total}%0A`;
    msg += `Name: ${name || '-'}%0APhone: ${phone || '-'}%0A`;
    msg += `Please confirm availability and next steps.`;

    const url = `https://wa.me/${ownerWhatsApp}?text=${msg}`;
    window.open(url, '_blank');
});

resetBtn.addEventListener('click', () => {
    document.querySelectorAll('.seat.selected').forEach(s => s.classList.remove('selected'));
    dateInput.value = '';
    timeInput.value = '';
    nameInput.value = '';
    phoneInput.value = '';
    serviceSelect.value = 'reading';
    updateSummary();
});

function setupOwnerLink() {
    if (ownerWhatsApp && ownerWhatsApp.length > 6) {
        ownerLink.href = `https://wa.me/${ownerWhatsApp}`;
        ownerLink.target = '_blank';
    } else {
        ownerLink.href = '#';
    }
}

buildSeats();
updateSummary();
setupOwnerLink();

(() => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    dateInput.value = `${yyyy}-${mm}-${dd}`;
})();

