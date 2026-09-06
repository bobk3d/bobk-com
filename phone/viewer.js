(() => {
  const cfg = window.GALLERY_CONFIG;
  if (!cfg || !Array.isArray(cfg.images) || cfg.images.length === 0) {
    document.body.innerHTML = '<p style="padding:2rem;color:white;background:black">Gallery configuration is missing.</p>';
    return;
  }

  const landing = document.getElementById('landing');
  const viewer = document.getElementById('viewer');
  const viewBtn = document.getElementById('viewBtn');
  const backBtn = document.getElementById('backBtn');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const image = document.getElementById('photo');
  const title = document.getElementById('title');
  const counter = document.getElementById('counter');
  const controls = document.getElementById('controls');
  const landingName = document.getElementById('landingName');
  const landingText = document.getElementById('landingText');

  landingName.textContent = cfg.name || '3D Photos';
  landingText.textContent = cfg.intro || 'Turn your phone sideways and place it in the viewer. Swipe left or right to move through the photos.';

  let index = 0;
  let startX = 0;
  let startY = 0;
  let touching = false;

  function basename(file) {
    return file.replace(/\.[^.]+$/, '');
  }

  function preload(i) {
    if (i < 0 || i >= cfg.images.length) return;
    const p = new Image();
    p.src = cfg.images[i];
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
  }

  function openViewer() {
    landing.classList.remove('active');
    viewer.classList.add('active');
    showImage(index);
  }

  function closeViewer() {
    viewer.classList.remove('active');
    landing.classList.add('active');
  }

  viewBtn.addEventListener('click', openViewer);
  backBtn.addEventListener('click', closeViewer);
  prevBtn.addEventListener('click', () => showImage(index - 1));
  nextBtn.addEventListener('click', () => showImage(index + 1));

  image.addEventListener('click', () => {
    controls.classList.toggle('hidden');
  });

  viewer.addEventListener('touchstart', (e) => {
    if (!e.touches || e.touches.length !== 1) return;
    touching = true;
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
  }, { passive: true });

  viewer.addEventListener('touchend', (e) => {
    if (!touching || !e.changedTouches || e.changedTouches.length !== 1) return;
    touching = false;
    const dx = e.changedTouches[0].clientX - startX;
    const dy = e.changedTouches[0].clientY - startY;
    if (Math.abs(dx) < 50 || Math.abs(dx) < Math.abs(dy)) return;
    if (dx < 0) showImage(index + 1);
    else showImage(index - 1);
  }, { passive: true });

  document.addEventListener('keydown', (e) => {
    if (!viewer.classList.contains('active')) return;
    if (e.key === 'ArrowRight') showImage(index + 1);
    if (e.key === 'ArrowLeft') showImage(index - 1);
    if (e.key === 'Escape') closeViewer();
  });

  showImage(0);
})();
