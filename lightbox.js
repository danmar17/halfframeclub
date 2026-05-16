(function () {
  const overlay = document.createElement('div');
  overlay.id = 'hfc-lightbox';
  overlay.innerHTML = `
    <div id="hfc-lb-bg"></div>
    <div id="hfc-lb-content">
      <img id="hfc-lb-img" src="" alt="">
      <button id="hfc-lb-close">&#215;</button>
      <button id="hfc-lb-prev">&#8249;</button>
      <button id="hfc-lb-next">&#8250;</button>
    </div>
  `;
  document.body.appendChild(overlay);

  const style = document.createElement('style');
  style.textContent = `
    #hfc-lightbox { display:none; position:fixed; inset:0; z-index:9999; align-items:center; justify-content:center; }
    #hfc-lightbox.active { display:flex; }
    #hfc-lb-bg { position:absolute; inset:0; background:rgba(10,10,10,0.92); cursor:zoom-out; }
    #hfc-lb-content { position:relative; z-index:1; max-width:90vw; max-height:90vh; display:flex; align-items:center; justify-content:center; }
    #hfc-lb-img { max-width:90vw; max-height:90vh; object-fit:contain; display:block; box-shadow:0 8px 60px rgba(0,0,0,0.6); border-top:4px solid #1A9E9E; }
    #hfc-lb-close { position:fixed; top:1.25rem; right:1.5rem; background:none; border:none; color:#E8A020; font-size:2.5rem; cursor:pointer; line-height:1; opacity:0.85; transition:opacity 0.2s; z-index:2; }
    #hfc-lb-close:hover { opacity:1; }
    #hfc-lb-prev, #hfc-lb-next { position:fixed; top:50%; transform:translateY(-50%); background:rgba(10,10,10,0.5); border:0.5px solid #E8A020; color:#E8A020; font-size:2rem; width:48px; height:64px; cursor:pointer; display:flex; align-items:center; justify-content:center; opacity:0.7; transition:opacity 0.2s; z-index:2; }
    #hfc-lb-prev { left:1rem; }
    #hfc-lb-next { right:1rem; }
    #hfc-lb-prev:hover, #hfc-lb-next:hover { opacity:1; }
    #hfc-lb-prev.hidden, #hfc-lb-next.hidden { display:none; }
  `;
  document.head.appendChild(style);

  const lbEl = document.getElementById('hfc-lightbox');
  const lbImg = document.getElementById('hfc-lb-img');
  const lbClose = document.getElementById('hfc-lb-close');
  const lbBg = document.getElementById('hfc-lb-bg');
  const lbPrev = document.getElementById('hfc-lb-prev');
  const lbNext = document.getElementById('hfc-lb-next');

  let images = [];
  let currentIndex = 0;

  // Only images inside these containers are lightboxable
  const INCLUDE = [
    '.img-slot img',
    '.img-gallery img',
    '.hero-photo img',
    '.film-img-slot img',
    '.article img',
    '.article-section img',
  ].join(', ');

  // Never open lightbox on these
  function isExcluded(img) {
    return (
      img.closest('nav') ||
      img.closest('footer') ||
      img.closest('.nav-logo') ||
      img.closest('.card-img') ||
      img.closest('.camera-card-img') ||
      img.closest('.artist-card-img') ||
      img.closest('.artist-img') ||
      img.closest('.strip-item') ||
      img.src.includes('hfc-logo') ||
      img.src.includes('logo')
    );
  }

  function collectImages() {
    images = Array.from(document.querySelectorAll(INCLUDE))
      .filter(img => !isExcluded(img) && img.src);
    return images;
  }

  function show() {
    const img = images[currentIndex];
    if (!img) return;
    lbImg.src = img.src;
    lbImg.alt = img.alt || '';
    lbEl.classList.add('active');
    document.body.style.overflow = 'hidden';
    lbPrev.classList.toggle('hidden', currentIndex === 0);
    lbNext.classList.toggle('hidden', currentIndex === images.length - 1);
  }

  function close() {
    lbEl.classList.remove('active');
    lbImg.src = '';
    document.body.style.overflow = '';
  }

  function prev() { if (currentIndex > 0) { currentIndex--; show(); } }
  function next() { if (currentIndex < images.length - 1) { currentIndex++; show(); } }

  document.addEventListener('click', function (e) {
    const img = e.target.closest('img');
    if (!img || isExcluded(img)) return;
    if (!img.matches(INCLUDE)) return;
    collectImages();
    const idx = images.indexOf(img);
    if (idx !== -1) { currentIndex = idx; show(); }
  });

  // Set zoom cursor only on lightboxable images
  function styleCursors() {
    collectImages();
    images.forEach(img => { img.style.cursor = 'zoom-in'; });
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', styleCursors);
  } else {
    styleCursors();
  }

  lbClose.addEventListener('click', close);
  lbBg.addEventListener('click', close);
  lbPrev.addEventListener('click', prev);
  lbNext.addEventListener('click', next);
  document.addEventListener('keydown', function (e) {
    if (!lbEl.classList.contains('active')) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowLeft') prev();
    if (e.key === 'ArrowRight') next();
  });
})();
