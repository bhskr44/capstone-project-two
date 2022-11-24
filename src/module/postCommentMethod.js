import getMovieDetails from './getMovieDetails';

const postCommentMethod = () => {
  const popup = document.querySelector('.popup');

  const postComment = document.querySelectorAll('.postComment');
  postComment.forEach((submitButton) => {
    submitButton.addEventListener('submit', (event) => {
      event.preventDefault();
      const movieId = submitButton.querySelector('#movieId').value;
      getMovieDetails(movieId);
      popup.classList.remove('hide');
    });
  });
};

export default postCommentMethod;
