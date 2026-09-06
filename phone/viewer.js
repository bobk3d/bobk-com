(() => {
  const cfg = window.GALLERY_CONFIG;
  const landing = document.getElementById('landing');
  const viewer = document.getElementById('viewer');
  const viewBtn = document.getElementById('viewBtn');
  const backBtn = document.getElementById('backBtn');
  const pauseBtn = document.getElementById('pauseBtn');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const image = document.getElementById('photo');
  const title = document.getElementById('title');
  const counter = document.getElementById('counter');
  const landingName = document.getElementById('landingName');
  const landingText = document.getElementById('landingText');

  landingName.textContent = cfg.name || '3D Photos';
  landingText.textContent = cfg.intro || 'Turn your phone sideways and swipe left or right to move through the photos.';

  const intervalMs = Number.isFinite(cfg.intervalMs) ? cfg.intervalMs : 6000;
  let index = 0, paused = false, timer = null;
  let startX = 0, startY = 0, touching = false;

  const basename = f => f.replace(/\.[^.]+$/, '');

  function preload(i) {
    if (i < 0 || i >= cfg.images.length) return;
    const p = new Image();
    p.src = cfg.images[i];
  }

  function restartTimer() {
    clearTimeout(timer);
    if (paused || !viewer.classList.contains('active')) return;
    timer = setTimeout(() => showImage(index + 1), intervalMs);
  }

  function showImage(i) {
    index = (i + cfg.images.length) % cfg.images.length;
    const file = cfg.images[index];
    image.src = file;
    image.alt = basename(file);
    title.textContent = basename(file);
    counter.textContent = `${index + 1} of ${cfg.images.length}`;
    preload(index - 1);
    preload(index + 1);
    restartTimer();
  }

  function setPaused(value) {
    paused = value;
    pauseBtn.textContent = paused ? 'Resume' : 'Pause';
    if (paused) {
      clearTimeout(timer);
    } else {
      showImage(index + 1);
    }
  }

  function openViewer() {
    landing.classList.remove('active');
    viewer.classList.add('active');
    paused = false;
    pauseBtn.textContent = 'Pause';
    showImage(index);
  }

  function closeViewer() {
    clearTimeout(timer);
    viewer.classList.remove('active');
    landing.classList.add('active');
  }

  viewBtn.addEventListener('click', openViewer);
  backBtn.addEventListener('click', closeViewer);
  pauseBtn.addEventListener('click', () => setPaused(!paused));
  prevBtn.addEventListener('click', () => showImage(index - 1));
  nextBtn.addEventListener('click', () => showImage(index + 1));

  viewer.addEventListener('touchstart', e => {
    if (e.touches.length !== 1) return;
    touching = true;
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
  }, {passive:true});

  viewer.addEventListener('touchend', e => {
    if (!touching || e.changedTouches.length !== 1) return;
    touching = false;
    const dx = e.changedTouches[0].clientX - startX;
    const dy = e.changedTouches[0].clientY - startY;
    if (Math.abs(dx) < 50 || Math.abs(dx) < Math.abs(dy)) return;
    showImage(index + (dx < 0 ? 1 : -1));
  }, {passive:true});

  showImage(0);
})();
