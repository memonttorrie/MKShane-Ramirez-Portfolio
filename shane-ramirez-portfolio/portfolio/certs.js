(function () {
  var box = document.getElementById('lightbox');
  if (!box) return;

  var thumbs = [].slice.call(document.querySelectorAll('.cert-thumb'));
  if (!thumbs.length) return;
  var pdfjs = window.pdfjsLib;
  if (!pdfjs) throw new Error('PDF.js did not load; certificate image previews are unavailable.');
  pdfjs.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

  var img = document.getElementById('lb-img'),
      title = document.getElementById('lb-title'),
      meta = document.getElementById('lb-meta'),
      closeBtn = document.getElementById('lb-close'),
      cur = 0,
      opener = null;

  thumbs.forEach(function (t) {
    var im = t.querySelector('img');
    if (!im) return;

    pdfjs.getDocument(t.dataset.pdf).promise
      .then(function (doc) {
        return doc.getPage(1).then(function (page) {
          var base = page.getViewport({ scale: 1 });
          var scale = Math.min(1600 / base.width, 1200 / base.height, 1.5);
          var viewport = page.getViewport({ scale: scale });
          var canvas = document.createElement('canvas');
          var context = canvas.getContext('2d');
          canvas.width = Math.ceil(viewport.width);
          canvas.height = Math.ceil(viewport.height);

          return page.render({ canvasContext: context, viewport: viewport }).promise
            .then(function () {
              t.dataset.full = canvas.toDataURL('image/png');
              im.src = t.dataset.full;
              t.disabled = false;
              t.classList.remove('is-loading');
              return doc.destroy();
            });
        });
      })
      .catch(function (error) {
        t.classList.remove('is-loading');
        t.classList.add('is-broken');
        console.error('Could not render certificate preview: ' + t.dataset.title, error);
      });
  });

  function show(i) {
    cur = (i + thumbs.length) % thumbs.length;
    var d = thumbs[cur].dataset;
    img.src = d.full;
    img.alt = 'Certificate: ' + d.title;
    title.textContent = d.title;
    meta.textContent = d.meta;
  }

  function open(i) {
    opener = thumbs[i];
    show(i);
    box.hidden = false;
    document.body.classList.add('lb-open');
    closeBtn.focus();
  }

  function close() {
    box.hidden = true;
    document.body.classList.remove('lb-open');
    img.removeAttribute('src');
    if (opener) opener.focus();
  }

  thumbs.forEach(function (t, i) {
    t.addEventListener('click', function () { open(i); });
  });
  closeBtn.addEventListener('click', close);
  document.getElementById('lb-prev').addEventListener('click', function () { show(cur - 1); });
  document.getElementById('lb-next').addEventListener('click', function () { show(cur + 1); });

  // Click on the dark backdrop closes; clicks on image/buttons do not
  box.addEventListener('click', function (e) { if (e.target === box) close(); });

  document.addEventListener('keydown', function (e) {
    if (box.hidden) return;
    if (e.key === 'Escape') close();
    else if (e.key === 'ArrowLeft') show(cur - 1);
    else if (e.key === 'ArrowRight') show(cur + 1);
    else if (e.key === 'Tab') { // keep focus inside the viewer
      var f = box.querySelectorAll('button, a[href]'),
          first = f[0],
          last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });
})();