import Notiflix from 'notiflix';
import axios from 'axios';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';


let startPage = 1;
const maxPage = 40;
document
  .getElementById('search-form')
  .addEventListener('submit', async function (e) {
    e.preventDefault();

    const searchQuery = e.target.searchQuery.value.trim();

    if (searchQuery === '') {
      Notiflix.Notify.failure('Please enter a search query.');
      return;
    }

    try {
      clearGallery();
      startPage = 1;

      const KEY = '40966819-069d4ffc8b5800bec6b714221';
      const URL = `https://pixabay.com/api/?key=${KEY}&q=${searchQuery}&image_type=photo&orientation=horizontal&safesearch=true&page=${startPage}&per_page=${maxPage}`;

      const reply = await axios.get(URL);

      const { hits, totalHits } = reply.data;

      if (totalHits === 0) {
        Notiflix.Notify.warning(
          'Sorry, there are no images matching your search query. Please try again.'
        );
        return;
      }

      displayImages(hits);

      Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`);

      
    updateLightbox();
    checkImageCount(totalHits);
    smoothScroll();



      if (hits.length < maxPage) {
        hideLoadMoreButton();
        Notiflix.Notify.info(
          "We're sorry, but you've reached the end of search results."
        );
      } else {
        showLoadMoreButton();
      }
    } catch (error) {
      console.error('Error fetching images:', error);
      Notiflix.Notify.failure(
        'An error occurred while fetching images. Please try again.'
      );
    }
  });

document.addEventListener('DOMContentLoaded', function () {
  const loadMoreButton = document.getElementById('load-more');
  if (loadMoreButton) {
    loadMoreButton.addEventListener('click', async function () {
      startPage++;
      const searchQuery = document
        .getElementById('search-form')
        .searchQuery.value.trim();
      await fetchAndDisplayImages(searchQuery, startPage);
    });
  } else {
    console.error('Load more button not found.');
  }
});

async function fetchAndDisplayImages(searchQuery, page) {
  try {
    const KEY = '40966819-069d4ffc8b5800bec6b714221';
    const URL = `https://pixabay.com/api/?key=${KEY}&q=${searchQuery}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=${maxPage}`;

    const reply = await axios.get(URL);
    const { hits, totalHits } = reply.data;

    if (hits.length === 0) {
      Notiflix.Notify.warning('Sorry, there are no more images.');
      hideLoadMoreButton();
      return;
    }

 

    displayImages(hits);
    updateLightbox();
    smoothScroll();

  
    checkImageCount(totalHits);
  } catch (error) {
    console.error('Error fetching more images:', error);
    Notiflix.Notify.failure(
      'An error occurred while fetching more images. Please try again.'
    );
  }
}

function clearGallery() {
  const gallery = document.getElementById('gallery');
  if (gallery) {
    gallery.innerHTML = '';
  }
}

function displayImages(images) {
  const gallery = document.getElementById('gallery');

  if (gallery) {
    if (startPage === 1) {
      gallery.innerHTML = '';
    }

    images.forEach(image => {
      const photoCard = document.createElement('div');
      photoCard.classList.add('photo-card');

      const imgLink = document.createElement('a');
      imgLink.href = image.largeImageURL;
      imgLink.setAttribute('data-lightbox', 'gallery');

      const img = document.createElement('img');
      img.src = image.webformatURL;
      img.alt = image.tags;
      img.loading = 'lazy';

      imgLink.appendChild(img);

      const info = document.createElement('div');
      info.classList.add('info');

      const likes = document.createElement('p');
      likes.classList.add('info-item');
      likes.innerHTML = `<b>Likes:</b> ${image.likes}`;

      const views = document.createElement('p');
      views.classList.add('info-item');
      views.innerHTML = `<b>Views:</b> ${image.views}`;

      const comments = document.createElement('p');
      comments.classList.add('info-item');
      comments.innerHTML = `<b>Comments:</b> ${image.comments}`;

      const downloads = document.createElement('p');
      downloads.classList.add('info-item');
      downloads.innerHTML = `<b>Downloads:</b> ${image.downloads}`;

      info.appendChild(likes);
      info.appendChild(views);
      info.appendChild(comments);
      info.appendChild(downloads);

      photoCard.appendChild(imgLink);
      photoCard.appendChild(info);

      gallery.appendChild(photoCard);
    });
  } else {
    console.error('Gallery element not found.');
  }
}

function hideLoadMoreButton() {
  document.getElementById('load-more').style.display = 'none';
}

function showLoadMoreButton() {
  document.getElementById('load-more').style.display = 'block';
}
// SimpleLightbox для перегляду зображень
function updateLightbox() {
  const lightbox = new SimpleLightbox('.gallery a'); 
  lightbox.refresh();
}

function smoothScroll() {
  const gallery = document.querySelector('.gallery');

  if (gallery && gallery.firstElementChild) {
    const { height: cardHeight } =
      gallery.firstElementChild.getBoundingClientRect();

    window.scrollBy({
      top: cardHeight * 2,
      behavior: 'smooth',
    });
  }
}

// Функція для перевірки кількості зображень та приховання кнопки
function checkImageCount(totalHits) {
  if (totalHits <= maxPage * startPage) {
    hideLoadMoreButton();
    Notiflix.Notify.info('There are no more images.');
  }
}
