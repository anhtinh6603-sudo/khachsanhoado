// ---------- Photo load / fallback handling ----------
document.querySelectorAll('.photo').forEach(wrap => {
  const img = wrap.querySelector('.photo-img');
  const label = wrap.querySelector('.ph-label');
  if (label) label.textContent = wrap.dataset.label || '';
  if (!img) return;
  if (img.complete && img.naturalWidth > 0) {
    wrap.classList.add('loaded');
  } else {
    img.addEventListener('load', () => wrap.classList.add('loaded'));
    img.addEventListener('error', () => {
      wrap.classList.add('missing');
      img.style.display = 'none';
    });
  }
});

// ---------- Mobile nav ----------
const hamburger = document.getElementById('hamburger');
const mainNav = document.getElementById('mainNav');

hamburger.addEventListener('click', () => {
  mainNav.classList.toggle('open');
});

mainNav.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    mainNav.querySelectorAll('a').forEach(a => a.classList.remove('active'));
    link.classList.add('active');
    mainNav.classList.remove('open');
  });
});

// ---------- Sticky header shadow ----------
const siteHeader = document.getElementById('siteHeader');
window.addEventListener('scroll', () => {
  siteHeader.classList.toggle('scrolled', window.scrollY > 10);
});

// ---------- Booking bar defaults + steppers ----------
const checkIn = document.getElementById('checkIn');
const checkOut = document.getElementById('checkOut');

function toISODate(date) {
  return date.toISOString().split('T')[0];
}

if (checkIn && checkOut) {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  checkIn.value = toISODate(today);
  checkOut.value = toISODate(tomorrow);
  checkIn.min = toISODate(today);
  checkOut.min = toISODate(tomorrow);

  checkIn.addEventListener('change', () => {
    const nextDay = new Date(checkIn.value);
    nextDay.setDate(nextDay.getDate() + 1);
    checkOut.min = toISODate(nextDay);
    if (new Date(checkOut.value) <= new Date(checkIn.value)) {
      checkOut.value = toISODate(nextDay);
    }
  });
}

document.querySelectorAll('.stepper').forEach(stepper => {
  const targetId = stepper.dataset.target;
  const display = document.getElementById(targetId);
  const min = targetId === 'adults' ? 1 : 0;

  stepper.querySelectorAll('.step-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      let value = parseInt(display.textContent, 10);
      value += btn.dataset.action === 'inc' ? 1 : -1;
      value = Math.max(min, Math.min(value, 10));
      display.textContent = value;
    });
  });
});

// ---------- Booking bar submit -> cuon toi form dat phong ----------
const bookingBar = document.getElementById('bookingBar');
if (bookingBar) {
  bookingBar.addEventListener('submit', (e) => {
    e.preventDefault();
    document.getElementById('contact').scrollIntoView({ behavior: 'smooth' });
  });
}

// ---------- Contact form -> day sang Zalo ca nhan de xac nhan ----------
const ZALO_PHONE = '84977600599'; // Zalo ca nhan Nguyen The Anh (dinh dang quoc te, khong dau +)
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('cfName').value.trim();
    const phone = document.getElementById('cfPhone').value.trim();
    const rooms = document.getElementById('cfRooms').value.trim();
    const note = document.getElementById('cfMessage').value.trim();

    if (!name || !phone || !rooms) return; // required, HTML5 validation da chan truoc do

    const message =
      `📋 YÊU CẦU ĐẶT PHÒNG - Khách Sạn Hoa Đô\n` +
      `Họ tên: ${name}\n` +
      `SĐT: ${phone}\n` +
      `Số phòng cần đặt: ${rooms}` +
      (note ? `\nGhi chú: ${note}` : '');

    let copied = false;
    try {
      await navigator.clipboard.writeText(message);
      copied = true;
    } catch (err) {
      copied = false;
    }

    window.open(`https://zalo.me/${ZALO_PHONE}`, '_blank', 'noopener');

    const cfNote = document.getElementById('cfSentNote');
    if (cfNote) {
      cfNote.textContent = copied
        ? 'Đã sao chép thông tin đặt phòng — vui lòng dán (Ctrl+V hoặc giữ để dán) vào khung chat Zalo vừa mở và bấm Gửi để chúng tôi xác nhận nhanh nhất.'
        : `Đã mở Zalo — vui lòng nhắn lại thông tin: ${message}`;
      cfNote.style.display = 'block';
    }
    contactForm.reset();
    document.getElementById('cfRooms').value = 1;
  });
}

// ---------- Footer year ----------
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();
