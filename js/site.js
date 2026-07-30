/* Happy Plant — shared behavior */
(function () {
  document.documentElement.classList.add('js');

  // mobile nav
  var nav = document.querySelector('.hp-nav');
  var btn = document.querySelector('.hp-menu-btn');
  if (nav && btn) {
    btn.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    document.addEventListener('click', function (e) {
      if (nav.classList.contains('open') && !nav.contains(e.target)) {
        nav.classList.remove('open');
        btn.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // scroll reveals
  var els = Array.prototype.slice.call(document.querySelectorAll('[data-reveal]'));
  if ('IntersectionObserver' in window && els.length) {
    els.forEach(function (el) {
      el.style.transitionDelay = (parseInt(el.getAttribute('data-reveal'), 10) || 0) + 'ms';
    });
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          en.target.classList.add('revealed');
          io.unobserve(en.target);
        }
      });
    }, { threshold: 0.12 });
    els.forEach(function (el) { io.observe(el); });
  } else {
    els.forEach(function (el) { el.classList.add('revealed'); });
  }

  // watering-can cursor: spawn droplets while moving over waterable zones
  function spawnDrop(x, y, delay, big) {
    var d = document.createElement('div');
    var s = big ? 30 : 20;
    d.style.cssText = 'position:fixed;left:' + x + 'px;top:' + y + 'px;width:' + s + 'px;height:' + s +
      'px;pointer-events:none;z-index:9999;border-radius:0 50% 50% 50%;background:linear-gradient(135deg,#B7EBFF,#4FC3F7);border:2px solid rgba(18,41,27,.18);animation:hpDropFall .75s cubic-bezier(.45,0,.85,.6) ' +
      (delay || 0) + 'ms forwards;opacity:0;';
    document.body.appendChild(d);
    setTimeout(function () { d.remove(); }, 950 + (delay || 0));
  }
  window.hpSpawnDrop = spawnDrop;

  var lastDrop = 0;
  document.addEventListener('mousemove', function (e) {
    var t = e.target && e.target.closest ? e.target.closest('.waterable') : null;
    if (!t) return;
    var now = performance.now();
    if (now - lastDrop < 95) return;
    lastDrop = now;
    spawnDrop(e.clientX + (Math.random() * 18 - 9), e.clientY + 8);
  }, { passive: true });

  // console easter eggs (home has its own in home.js)
  var page = document.body.getAttribute('data-page');
  try {
    if (page === 'about') {
      console.log('%cSnooping on the About page? We respect it. 🌱', 'color:#12291B;background:#DBFF4A;font-size:13px;font-weight:bold;padding:4px 10px;border-radius:6px');
      console.log('%cWant the full press kit? mike@happyplantapp.com', 'color:#1B9E61;font-size:12px');
    } else if (page === 'support') {
      console.log('%cDebugging the Support page? That’s very meta. 🌱', 'color:#12291B;background:#DBFF4A;font-size:13px;font-weight:bold;padding:4px 10px;border-radius:6px');
    }
  } catch (e) {}
})();
