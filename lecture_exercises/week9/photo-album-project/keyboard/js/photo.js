function createImage(src) {
  const image = document.createElement('img');
  image.src = src;
  return image;
}

const albumView = document.querySelector('#album-view');
const modalView = document.querySelector('#modal-view');

let currentIndex = -1;

for (let i = 0; i < PHOTO_LIST.length; i++) {
  const photoSrc = PHOTO_LIST[i];
  const image = createImage(photoSrc);

  image.alt = 'Pizza thumbnail ' + (i + 1);
  image.dataset.index = i;
  image.addEventListener('click', onThumbnailClick);

  albumView.appendChild(image);
}

function openModal(index) {
  currentIndex = index;

  const image = createImage(PHOTO_LIST[currentIndex]);

  document.body.classList.add('no-scroll');
  modalView.style.top = window.pageYOffset + 'px';

  modalView.innerHTML = '';
  modalView.appendChild(image);
  modalView.classList.remove('hidden');
}

function closeModal() {
  document.body.classList.remove('no-scroll');
  modalView.classList.add('hidden');
  modalView.innerHTML = '';
  currentIndex = -1;
}

function onThumbnailClick(event) {
  const index = Number(event.currentTarget.dataset.index);
  openModal(index);
}

function onModalClick() {
  closeModal();
}

function onKeyUp(event) {
  if (modalView.classList.contains('hidden')) {
    return;
  }

  if (event.key === 'Escape') {
    closeModal();
  } else if (event.key === 'ArrowRight') {
    const nextIndex = (currentIndex + 1) % PHOTO_LIST.length;
    openModal(nextIndex);
  } else if (event.key === 'ArrowLeft') {
    const previousIndex = (currentIndex - 1 + PHOTO_LIST.length) % PHOTO_LIST.length;
    openModal(previousIndex);
  }
}

modalView.addEventListener('click', onModalClick);
document.addEventListener('keyup', onKeyUp);
