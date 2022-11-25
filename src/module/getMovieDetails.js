import Swal from 'sweetalert2';
import postComment from './postComment';
import getComments from './comments';

const getMovieDetails = async (movieId) => {
  const response = await fetch(`https://api.tvmaze.com/shows/${movieId}`);
  const movieDetails = await response.json(); // extract JSON from the http response
  // do something with myJson
  const popupContainer = document.querySelector('.popup-container');
  const movieName = movieDetails.name;
  const { summary } = movieDetails;
  const { image } = movieDetails;

  let imageSrc = 'https://static.tvmaze.com/uploads/images/original_untouched/53/133615.jpg';

  if (image !== 'null') {
    if (image.original !== 'null') {
      imageSrc = movieDetails.image.original;
    } else {
      imageSrc = movieDetails.image.medium;
    }
  }
  const comments = await getComments(movieId);
  let totalComment = 0;
  if (comments.length > 0) {
    totalComment = comments.length;
  }
  const firstPart = `
    <div class="popup-movie-banner">
          <img
            class="popup-movie-banner-img"
            src="${imageSrc}"
            alt="${movieName} Banner"
          />
        </div>
        <div class="popup-details">
          <div class="popup-title">
            <h2>${movieName}</h2>
          </div>
          <div class="popup-description">
            ${summary}
          </div>

          <div class="popup-comments">
            <h2 class="popup-comments-title">
              Comments<span id="commentConter">(<span id="totalComment">${totalComment}</span>)</span>
            </h2>
            <div class="popu-comments-container">
              <ul class="comment-description">
              `;

  let commentList = '';
  for (let k = 0; k < comments.length; k += 1) {
    const temp = `<li>${comments[k].creation_date} ${comments[k].username}: ${comments[k].comment}</li>`;
    commentList += temp;
  }
  const secondPart = `
              </ul>
            </div>
          </div>

          <div class="add-comment-form">
            <h2 class="popup-comments-title">
              Add Comments<span id="addCOmment"></span>
            </h2>
            <form id="addComment">
            <input type="text" placeholder="Name" name="name" />
            <input type="hidden" placeholder="Name" name="movieId" value="${movieId}" />
            <textarea
                name="comment"
                id="comment"
                cols="30"
                rows="8"
                placeholder="Comment"
                name="comment"
              >
              </textarea>
              <input type="submit" value="Submit" />
            </form>
          </div>
        </div>`;

  popupContainer.innerHTML = firstPart + commentList + secondPart;

  const addComment = document.querySelector('#addComment');

  addComment.addEventListener('submit', (event) => {
    event.preventDefault();
    const name = addComment.querySelector('input[name="name"]').value;
    const comment = addComment.querySelector('textarea[name="comment"]').value;
    const movieId = addComment.querySelector('input[name="movieId"]').value;

    postComment(movieId, name, comment);
    Swal.fire({
      title: 'Success!',
      text: 'Your comment has been added',
      icon: 'success',
      confirmButtonText: 'Cool',
    });
    const d = new Date();
    const commentDescription = document.querySelector('.comment-description');
    const commentConter = document.querySelector('#totalComment');

    const ye = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(d);
    const mo = new Intl.DateTimeFormat('en', { month: '2-digit' }).format(d);
    const da = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(d);
    commentDescription.innerHTML += `<li>${ye}-${mo}-${da} ${name}: ${comment}</li>`;
    commentConter.innerHTML = Number(commentConter.innerHTML) + 1;
  });
};

export default getMovieDetails;
