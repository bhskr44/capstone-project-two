import './css/style.css';
import loadApi from './module/loadApi';
import getLikes from './module/getLikes';
import postCommentMethod from './module/postCommentMethod';

getLikes();

let inSync = new Promise((resolve, reject) => {
  loadApi();
  setTimeout(() => {
    resolve('done');
  }, 500);
});

inSync.then(() => {
  postCommentMethod();
});

const popupClose = document.querySelector('#popup-close');
const popup = document.querySelector('.popup');

popupClose.addEventListener('click', () => {
  popup.classList.add('hide');
});
