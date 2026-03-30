function createImage(src) {
  const image = document.createElement('img');
  image.src = src;
  image.draggable = false;
  return image;
}

const albumView = document.querySelector('#album-view');
const modalView = document.querySelector('#modal-view');
const modalStage = document.querySelector('#modal-stage');
const previousButton = document.querySelector('#previous-button');
const nextButton = document.querySelector('#next-button');

let currentIndex = -1;
let activeImage = null;
let pointerId = null;
let originX = 0;
let deltaX = 0;
let dragging = false;
const SWIPE_THRESHOLD = 90;

for (let i = 0; i < PHOTO_LIST.length; i++) {
  const photoSrc = PHOTO_LIST[i];
  const image = createImage(photoSrc);
  image.alt = 'Pizza thumbnail ' + (i + 1);
  image.dataset.index = i;
  image.addEventListener('click', onThumbnailClick);
  albumView.appendChild(image);
}

function showImage(index, direction = 'none') {
  currentIndex = (index + PHOTO_LIST.length) % PHOTO_LIST.length;

  const image = createImage(PHOTO_LIST[currentIndex]);
  image.alt = 'Pizza photo ' + (currentIndex + 1);

  if (direction === 'next') {
    image.classList.add('slide-in-from-right');
  } else if (direction === 'previous') {
    image.classList.add('slide-in-from-left');
  }

  modalStage.innerHTML = '';
  modalStage.appendChild(image);
  activeImage = image;

  activeImage.addEventListener('pointerdown', onPointerDown);
  activeImage.addEventListener('pointermove', onPointerMove);
  activeImage.addEventListener('pointerup', onPointerUp);
  activeImage.addEventListener('pointercancel', onPointerCancel);
}

function openModal(index, direction = 'none') {
  document.body.classList.add('no-scroll');
  modalView.style.top = window.pageYOffset + 'px';
  modalView.classList.remove('hidden');
  modalView.setAttribute('aria-hidden', 'false');
  showImage(index, direction);
}

function closeModal() {
  document.body.classList.remove('no-scroll');
  modalView.classList.add('hidden');
  modalView.setAttribute('aria-hidden', 'true');
  modalStage.innerHTML = '';
  activeImage = null;
  currentIndex = -1;
  pointerId = null;
  originX = 0;
  deltaX = 0;
  dragging = false;
}

function onThumbnailClick(event) {
  const index = Number(event.currentTarget.dataset.index);
  openModal(index);
}

function onModalClick(event) {
  if (event.target === modalView) {
    closeModal();
  }
}

function showNext() {
  if (currentIndex === -1) {
    return;
  }
  showImage(currentIndex + 1, 'next');
}

function showPrevious() {
  if (currentIndex === -1) {
    return;
  }
  showImage(currentIndex - 1, 'previous');
}

function onKeyUp(event) {
  if (modalView.classList.contains('hidden')) {
    return;
  }

  if (event.key === 'Escape') {
    closeModal();
  } else if (event.key === 'ArrowRight') {
    showNext();
  } else if (event.key === 'ArrowLeft') {
    showPrevious();
  }
}

function onPointerDown(event) {
  event.preventDefault();
  pointerId = event.pointerId;
  originX = event.clientX;
  deltaX = 0;
  dragging = true;

  event.currentTarget.setPointerCapture(pointerId);
  event.currentTarget.classList.add('dragging');
}

function onPointerMove(event) {
  if (!dragging || event.pointerId !== pointerId) {
    return;
  }

  event.preventDefault();
  deltaX = event.clientX - originX;
  event.currentTarget.style.transform = 'translateX(' + deltaX + 'px)';
}

function onPointerUp(event) {
  if (!dragging || event.pointerId !== pointerId) {
    return;
  }

  dragging = false;
  event.currentTarget.classList.remove('dragging');

  if (deltaX <= -SWIPE_THRESHOLD) {
    showNext();
  } else if (deltaX >= SWIPE_THRESHOLD) {
    showPrevious();
  } else {
    event.currentTarget.classList.add('snap-back');
    event.currentTarget.style.transform = 'translateX(0px)';

    window.setTimeout(() => {
      if (event.currentTarget) {
        event.currentTarget.classList.remove('snap-back');
        event.currentTarget.style.transform = '';
      }
    }, 200);
  }

  pointerId = null;
  originX = 0;
  deltaX = 0;
}

function onPointerCancel(event) {
  dragging = false;
  pointerId = null;
  originX = 0;
  deltaX = 0;

  event.currentTarget.classList.remove('dragging');
  event.currentTarget.classList.add('snap-back');
  event.currentTarget.style.transform = 'translateX(0px)';

  window.setTimeout(() => {
    if (event.currentTarget) {
      event.currentTarget.classList.remove('snap-back');
      event.currentTarget.style.transform = '';
    }
  }, 200);
}

previousButton.addEventListener('click', (event) => {
  event.stopPropagation();
  showPrevious();
});

nextButton.addEventListener('click', (event) => {
  event.stopPropagation();
  showNext();
});

modalView.addEventListener('click', onModalClick);
document.addEventListener('keyup', onKeyUp);
