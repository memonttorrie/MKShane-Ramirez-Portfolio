(function(){
  var dialog = document.getElementById('gallery-lightbox'),
      image = document.getElementById('gallery-lightbox-image'),
      title = document.getElementById('gallery-lightbox-title'),
      count = document.getElementById('gallery-lightbox-count'),
      close = document.getElementById('gallery-lightbox-close'),
      previous = document.getElementById('gallery-lightbox-prev'),
      next = document.getElementById('gallery-lightbox-next'),
      activeButton = null,
      galleryButtons = [],
      currentIndex = 0;

  function showImage(index){
    currentIndex = (index + galleryButtons.length) % galleryButtons.length;
    var button = galleryButtons[currentIndex];
    image.src = button.dataset.galleryImage;
    image.alt = button.querySelector('img').alt;
    title.textContent = button.dataset.galleryTitle;
    count.textContent = (currentIndex + 1) + ' / ' + galleryButtons.length;
    previous.disabled = galleryButtons.length < 2;
    next.disabled = galleryButtons.length < 2;
  }

  function closeGallery(){
    if (dialog.hidden) return;
    dialog.hidden = true;
    document.body.classList.remove('gallery-open');
    image.removeAttribute('src');
    if (activeButton) activeButton.focus();
    activeButton = null;
    galleryButtons = [];
  }

  document.querySelectorAll('.gallery-image').forEach(function(button){
    button.addEventListener('click', function(){
      activeButton = button;
      galleryButtons = Array.prototype.slice.call(button.closest('.project-gallery').querySelectorAll('.gallery-image'));
      showImage(galleryButtons.indexOf(button));
      dialog.hidden = false;
      document.body.classList.add('gallery-open');
      close.focus();
    });
  });

  previous.addEventListener('click', function(){ showImage(currentIndex - 1); });
  next.addEventListener('click', function(){ showImage(currentIndex + 1); });
  close.addEventListener('click', closeGallery);
  dialog.addEventListener('click', function(event){
    if (event.target === dialog) closeGallery();
  });
  document.addEventListener('keydown', function(event){
    if (dialog.hidden) return;
    if (event.key === 'Escape') closeGallery();
    if (event.key === 'ArrowLeft') showImage(currentIndex - 1);
    if (event.key === 'ArrowRight') showImage(currentIndex + 1);
  });
})();
