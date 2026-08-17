/* =========================================================
   Romex Development — общий JS для всех страниц прототипа
   Подключается на каждой странице перед закрывающим </body>
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- прозрачная шапка поверх слайдера: делаем непрозрачной при скролле ---------- */
  if (document.body.classList.contains('transparent-header') && headerElForScroll()) {
    const hEl = headerElForScroll();
    const onScroll = () => {
      if (window.scrollY > 40) hEl.classList.add('scrolled');
      else hEl.classList.remove('scrolled');
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }
  function headerElForScroll(){ return document.querySelector('header'); }

  /* ---------- мобильное меню (бургер) ---------- */
  const burger = document.querySelector('.burger');
  const headerEl = document.querySelector('header');
  if (burger && headerEl) {
    burger.addEventListener('click', () => {
      headerEl.classList.toggle('nav-open');
    });
  }

  /* ---------- слайдер в хиро-блоке (если есть на странице) ---------- */
  const heroEl = document.getElementById('hero');
  if (heroEl) {
    const slides = heroEl.querySelectorAll('.slide');
    const dotsWrap = document.getElementById('heroDots');
    let slideIndex = 0;

    if (dotsWrap) {
      slides.forEach((_, i) => {
        const d = document.createElement('button');
        if (i === 0) d.classList.add('active');
        d.addEventListener('click', () => showSlide(i));
        dotsWrap.appendChild(d);
      });
    }

    function showSlide(i) {
      slides.forEach(s => s.classList.remove('active'));
      if (dotsWrap) dotsWrap.querySelectorAll('button').forEach(b => b.classList.remove('active'));
      slideIndex = (i + slides.length) % slides.length;
      slides[slideIndex].classList.add('active');
      if (dotsWrap) dotsWrap.children[slideIndex].classList.add('active');
    }
    window.moveSlide = (dir) => showSlide(slideIndex + dir);

    if (slides.length > 1) {
      setInterval(() => window.moveSlide(1), 6000);
      let touchStartX = 0;
      heroEl.addEventListener('touchstart', e => touchStartX = e.touches[0].clientX);
      heroEl.addEventListener('touchend', e => {
        const dx = e.changedTouches[0].clientX - touchStartX;
        if (Math.abs(dx) > 40) window.moveSlide(dx < 0 ? 1 : -1);
      });
    }
  }

  /* ---------- горизонтальные карусели (акции, галереи, планировки) ---------- */
  document.querySelectorAll('[data-scroll-prev]').forEach(btn => {
    btn.addEventListener('click', () => {
      const track = document.getElementById(btn.dataset.scrollPrev);
      if (track) track.scrollBy({ left: -340, behavior: 'smooth' });
    });
  });
  document.querySelectorAll('[data-scroll-next]').forEach(btn => {
    btn.addEventListener('click', () => {
      const track = document.getElementById(btn.dataset.scrollNext);
      if (track) track.scrollBy({ left: 340, behavior: 'smooth' });
    });
  });

  /* ---------- модальные окна ---------- */
  document.querySelectorAll('[data-modal-open]').forEach(btn => {
    btn.addEventListener('click', () => {
      const modal = document.getElementById(btn.dataset.modalOpen);
      if (modal) modal.classList.add('open');
    });
  });
  document.querySelectorAll('[data-modal-close]').forEach(btn => {
    btn.addEventListener('click', () => {
      btn.closest('.modal-overlay')?.classList.remove('open');
    });
  });
  document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', e => {
      if (e.target === overlay) overlay.classList.remove('open');
    });
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') document.querySelectorAll('.modal-overlay.open').forEach(m => m.classList.remove('open'));
  });

  /* ---------- двойной слайдер диапазона (стоимость/площадь) ---------- */
  document.querySelectorAll('.range-pair').forEach(pair => {
    const minInput = pair.querySelector('.range-min');
    const maxInput = pair.querySelector('.range-max');
    const out = document.getElementById(pair.dataset.output);
    const unit = pair.dataset.unit || '';
    function fmt(v){
      const n = parseFloat(v);
      return Number.isInteger(n) ? n : n.toFixed(1).replace('.', ',');
    }
    function update(){
      let a = parseFloat(minInput.value), b = parseFloat(maxInput.value);
      if (a > b) { const t = minInput.value; minInput.value = maxInput.value; maxInput.value = t; }
      a = parseFloat(minInput.value); b = parseFloat(maxInput.value);
      if (out) out.textContent = `${fmt(a)} – ${fmt(b)}${unit}`;
    }
    minInput?.addEventListener('input', update);
    maxInput?.addEventListener('input', update);
  });

  /* ---------- переключатели-чипы (комнатность, фильтры, табы-кнопки) ---------- */
  document.querySelectorAll('.toggle-group, .room-toggle').forEach(group => {
    group.querySelectorAll('button').forEach(btn => {
      btn.addEventListener('click', () => {
        group.querySelectorAll('button').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
      });
    });
  });

  /* ---------- аккордеоны (литеры генплана, ход строительства, FAQ) ---------- */
  document.querySelectorAll('.accordion-head').forEach(head => {
    head.addEventListener('click', () => {
      head.closest('.accordion-item')?.classList.toggle('open');
    });
  });

  /* ---------- табы (год/месяц, разделы) ---------- */
  document.querySelectorAll('.tabs').forEach(tabs => {
    const buttons = tabs.querySelectorAll('.tab-btn');
    const panels = tabs.querySelectorAll('.tab-panel');
    buttons.forEach((b, i) => {
      b.addEventListener('click', () => {
        buttons.forEach(x => x.classList.remove('active'));
        panels.forEach(p => p.classList.remove('active'));
        b.classList.add('active');
        if (panels[i]) panels[i].classList.add('active');
      });
    });
  });

  /* ---------- формы: имитация успешной отправки ---------- */
  document.querySelectorAll('form[data-form]').forEach(form => {
    form.addEventListener('submit', e => {
      e.preventDefault();
      const card = form.closest('.form-card') || form.parentElement;
      const success = card ? card.querySelector('.form-success') : null;
      form.style.display = 'none';
      if (success) success.classList.add('show');
    });
  });

});

/* ---------- баннер cookies ---------- */
function dismissCookie() {
  const el = document.getElementById('cookieBanner');
  if (el) el.classList.add('hide');
}

/* ---------- «Показать ещё» / «Свернуть» ---------- */
function toggleShowMore(btn) {
  const target = document.getElementById(btn.dataset.target);
  if (!target) return;
  target.classList.toggle('show');
  btn.textContent = target.classList.contains('show')
    ? (btn.dataset.less || 'Свернуть')
    : (btn.dataset.more || 'Показать ещё');
}
