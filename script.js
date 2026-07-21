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

// ---------- Booking bar submit -> mo Zalo dat phong ----------
const bookingBar = document.getElementById('bookingBar');
if (bookingBar) {
  bookingBar.addEventListener('submit', (e) => {
    e.preventDefault();
    window.open('https://zalo.me/g/kcggzz594', '_blank', 'noopener');
  });
}

// ---------- Contact form -> mailto ----------
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('cfName').value;
    const phone = document.getElementById('cfPhone').value;
    const subject = document.getElementById('cfSubject').value;
    const message = document.getElementById('cfMessage').value;
    const body = `Họ tên: ${name}\nSĐT: ${phone}\n\n${message}`;
    window.location.href = `mailto:anhtinh6603@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  });
}

// ---------- Footer year ----------
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();
