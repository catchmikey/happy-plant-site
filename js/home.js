/* Happy Plant — home page: mascot, streaks, selfie booth, demo video */
(function () {
  // ---- console easter egg ----
  try {
    var art = [
      '        _      ',
      '      _(_)_    ',
      '    _(_)@(_)_  ',
      '      (_)      ',
      '     __|__     ',
      '    \\.....|    ',
      '     \\____|    '
    ].join('\n');
    console.log('%c' + art, 'color:#1FB870;font-weight:bold;font-size:12px;line-height:1.2');
    console.log('%cWell hello there, fellow inspector. 🌱', 'color:#12291B;background:#DBFF4A;font-size:14px;font-weight:bold;padding:4px 10px;border-radius:6px');
    console.log('%cYou inspect element. We inspect soil moisture.\nHappy Plant has been un-killing plants since 2017.\nSay hi: mike@happyplantapp.com', 'color:#1B9E61;font-size:12px;line-height:1.6');
  } catch (e) {}

  var $ = function (id) { return document.getElementById(id); };
  var mascotWrap = $('mascot-wrap');
  var bubble = $('hero-bubble');
  var streakLabel = $('streak-label');
  var pipFill = $('pip-fill');
  var pipRow = $('pip-row');
  var pips = pipRow ? Array.prototype.slice.call(pipRow.querySelectorAll('.pip')) : [];

  var state = {
    thirst: 0,
    watering: false,
    streak: loadStreak(),
    boothPhase: 'idle',
    count: 3,
    photo: null
  };
  var mounted = true, wTo = null, cd = null, stream = null;

  // preload mascot for canvas stamping
  var mascotImg = new Image();
  mascotImg.src = 'assets/happy-plant-character.svg';

  function loadStreak() {
    try {
      var raw = localStorage.getItem('hp_site_plant');
      if (!raw) return { streak: 0, last: null };
      var v = JSON.parse(raw);
      return { streak: v.streak || 0, last: v.last || null };
    } catch (e) { return { streak: 0, last: null }; }
  }

  function bumpStreak() {
    var iso = function (d) { return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); };
    var t = iso(new Date());
    var y = iso(new Date(Date.now() - 86400000));
    var cur = loadStreak();
    var s;
    if (cur.last === t) s = Math.max(1, cur.streak);
    else if (cur.last === y) s = (cur.streak || 0) + 1;
    else s = 1;
    var next = { streak: s, last: t };
    try { localStorage.setItem('hp_site_plant', JSON.stringify(next)); } catch (e) {}
    return next;
  }

  function render() {
    var t = state.thirst;
    var stage = t >= 70 ? 'wilted' : t >= 35 ? 'thirsty' : 'happy';
    var watering = state.watering;

    if (mascotWrap) {
      mascotWrap.style.transformOrigin = '50% 92%';
      mascotWrap.style.transition = 'transform 1.6s ease, filter 1.6s ease';
      mascotWrap.style.transform = watering ? 'none'
        : stage === 'wilted' ? 'rotate(7deg) translateY(10px) scale(0.97,0.92)'
        : stage === 'thirsty' ? 'rotate(3deg) translateY(4px) scale(0.99,0.97)'
        : 'none';
      mascotWrap.style.animation = watering ? 'hpBounce .9s cubic-bezier(.3,1.2,.4,1)' : 'none';
    }
    if (bubble) {
      bubble.textContent = watering ? 'AHHH that’s the good stuff'
        : stage === 'wilted' ? 'WATER. ME. (please) or i’m calling the police'
        : stage === 'thirsty' ? 'getting a lil thirsty over here…'
        : 'living my best life';
      bubble.style.background = watering ? '#DBFF4A' : stage === 'wilted' ? '#FFE3DE' : stage === 'thirsty' ? '#FFF3D6' : '#FFFFFF';
    }

    var st = state.streak || { streak: 0 };
    if (streakLabel) {
      streakLabel.textContent = st.streak > 0 ? ('Day ' + st.streak + ' watering streak. Nice.') : 'No streak yet. Fern is judging you.';
    }
    var filled = Math.min(7, st.streak || 0);
    if (pipFill) {
      pipFill.style.width = (filled <= 0 ? 0 : Math.min(100, ((filled - 0.5) / 6.5) * 100)).toFixed(1) + '%';
    }
    pips.forEach(function (pip, i) {
      var isFilled = i < filled;
      var isNewest = isFilled && i === filled - 1;
      pip.style.background = isFilled ? (isNewest ? '#DBFF4A' : '#1FB870') : 'rgba(18,41,27,.08)';
      pip.style.animation = (isNewest && watering)
        ? 'hpPipPop .55s cubic-bezier(.3,1.5,.4,1) backwards, hpPipHalo 1.6s ease-out .5s infinite'
        : 'hpPipWave 3.2s ease-in-out infinite';
      pip.style.animationDelay = (i * 0.11).toFixed(2) + 's';
    });
  }

  // ---- wilting over time ----
  setInterval(function () {
    if (document.hidden || state.boothPhase !== 'idle') return;
    state.thirst = Math.min(100, state.thirst + 0.9);
    render();
  }, 1000);

  // ---- water the plant ----
  function waterPlant() {
    var box = $('hp-mascot-stage');
    if (box && window.hpSpawnDrop) {
      var r = box.getBoundingClientRect();
      var cx = r.left + r.width / 2;
      for (var i = 0; i < 16; i++) {
        window.hpSpawnDrop(cx - 130 + Math.random() * 260, r.top + 60 + Math.random() * 90, i * 40, Math.random() > 0.45);
      }
    }
    state.streak = bumpStreak();
    state.thirst = 0;
    state.watering = true;
    render();
    clearTimeout(wTo);
    wTo = setTimeout(function () { if (mounted) { state.watering = false; render(); } }, 1000);
  }
  var mascotBtn = $('mascot-btn');
  if (mascotBtn) mascotBtn.addEventListener('click', waterPlant);

  // ---- demo video: swap cover for iframe on click ----
  var videoCover = $('video-cover');
  if (videoCover) {
    videoCover.addEventListener('click', function () {
      var box = videoCover.parentNode;
      var f = document.createElement('iframe');
      f.src = 'https://www.youtube-nocookie.com/embed/282TMJI4Aes?autoplay=1&rel=0';
      f.title = 'Happy Plant demo';
      f.allow = 'autoplay; encrypted-media; picture-in-picture';
      f.allowFullscreen = true;
      f.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;border:none';
      videoCover.remove();
      box.appendChild(f);
    });
  }

  // ---- selfie booth ----
  var booth = $('booth');
  function setPhase(phase) {
    state.boothPhase = phase;
    if (!booth) return;
    booth.hidden = phase === 'idle';
    $('booth-starting').hidden = phase !== 'starting';
    $('booth-video').hidden = !(phase === 'live' || phase === 'count');
    $('booth-badge').hidden = !(phase === 'live' || phase === 'count');
    $('booth-countwrap').hidden = phase !== 'count';
    $('booth-denied').hidden = phase !== 'denied';
    $('booth-result-img').hidden = phase !== 'result';
    $('booth-snap').hidden = phase !== 'live';
    $('booth-dl').hidden = phase !== 'result';
    $('booth-retake').hidden = phase !== 'result';
    $('booth-retry').hidden = phase !== 'denied';
  }

  function stopStream() {
    if (stream) { stream.getTracks().forEach(function (t) { t.stop(); }); stream = null; }
  }

  function openBooth() {
    setPhase('starting');
    $('booth-date').textContent = new Date().toLocaleDateString();
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) { setPhase('denied'); return; }
    navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user', width: { ideal: 1280 } }, audio: false })
      .then(function (s) {
        stream = s;
        if (!mounted || state.boothPhase === 'idle') { s.getTracks().forEach(function (t) { t.stop(); }); return; }
        setPhase('live');
        var v = $('booth-video');
        if (v) { v.muted = true; v.playsInline = true; v.autoplay = true; v.srcObject = s; v.play().catch(function () {}); }
      })
      .catch(function () { setPhase('denied'); });
  }

  function snap() {
    if (state.boothPhase !== 'live') return;
    var n = 3;
    $('booth-count').textContent = n;
    setPhase('count');
    clearInterval(cd);
    cd = setInterval(function () {
      n--;
      if (n <= 0) { clearInterval(cd); capture(); }
      else $('booth-count').textContent = n;
    }, 800);
  }

  function capture() {
    var v = $('booth-video');
    if (!v || !v.videoWidth) { setPhase('live'); return; }
    var w = v.videoWidth, h = v.videoHeight;
    var c = document.createElement('canvas');
    c.width = w; c.height = h;
    var ctx = c.getContext('2d');
    ctx.translate(w, 0); ctx.scale(-1, 1);
    ctx.drawImage(v, 0, 0, w, h);
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    var bandH = Math.round(h * 0.115);
    if (mascotImg && mascotImg.complete && mascotImg.naturalWidth > 0) {
      var mh = Math.round(h * 0.4);
      var mw = Math.round(mh * (438 / 590));
      ctx.drawImage(mascotImg, w - mw - Math.round(w * 0.02), h - bandH - mh + 6, mw, mh);
    }
    ctx.fillStyle = '#DBFF4A';
    ctx.fillRect(0, h - bandH, w, bandH);
    ctx.strokeStyle = '#12291B'; ctx.lineWidth = Math.max(2, Math.round(h * 0.005));
    ctx.beginPath(); ctx.moveTo(0, h - bandH); ctx.lineTo(w, h - bandH); ctx.stroke();
    ctx.fillStyle = '#12291B';
    ctx.font = '700 ' + Math.round(bandH * 0.42) + 'px "Baloo 2", sans-serif';
    ctx.textBaseline = 'middle';
    ctx.fillText('HAPPY PLANT SELFIE BOOTH', Math.round(w * 0.025), h - bandH / 2 + 1);
    ctx.textAlign = 'right';
    ctx.font = '400 ' + Math.round(bandH * 0.32) + 'px "DM Mono", monospace';
    ctx.fillText(new Date().toLocaleDateString(), w - Math.round(w * 0.025), h - bandH / 2 + 1);
    ctx.textAlign = 'left';
    var url = null;
    try { url = c.toDataURL('image/png'); } catch (e) {}
    stopStream();
    if (url) {
      state.photo = url;
      $('booth-result-img').src = url;
      $('booth-dl').href = url;
      setPhase('result');
    } else setPhase('denied');
  }

  function closeBooth() {
    stopStream();
    clearInterval(cd);
    setPhase('idle');
  }

  if (booth) {
    $('booth-open').addEventListener('click', openBooth);
    $('booth-snap').addEventListener('click', snap);
    $('booth-retake').addEventListener('click', openBooth);
    $('booth-retry').addEventListener('click', openBooth);
    $('booth-close').addEventListener('click', closeBooth);
    booth.addEventListener('click', function (e) { if (e.target === booth) closeBooth(); });
    window.addEventListener('keydown', function (e) { if (e.key === 'Escape' && state.boothPhase !== 'idle') closeBooth(); });
  }

  render();
})();
