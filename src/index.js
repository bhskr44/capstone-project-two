import './css/style.css';
// import logo from './images/logo.png';

const showMovies = document.querySelector('#show-movies');
const totalMovies = document.querySelector('#totalMovies');
const popupClose = document.querySelector('#popup-close');
const popup = document.querySelector('.popup');

popupClose.addEventListener('click', () => {
  popup.classList.add('hide');
});

const randomString = (length) => {
  // return 'space';
  let result = '';
  const characters = 'abcdefghijklmnopqrstuvwxyz';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i += 1) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

const getComments = async (movieId) => {
  const response = await fetch(
    `https://us-central1-involvement-api.cloudfunctions.net/capstoneApi/apps/V9PGHS19NclaPI0zbq7b/comments?item_id=${movieId}`,
  );
  const myJson = await response.json(); // extract JSON from the http response

  return myJson;
};

const liked = async (movieId) => {
  const mBody = JSON.parse(`{"item_id": ${movieId}}`);
  const response = await fetch(
    'https://us-central1-involvement-api.cloudfunctions.net/capstoneApi/apps/V9PGHS19NclaPI0zbq7b/likes/',
    {
      method: 'POST',
      body: JSON.stringify(mBody),
      headers: {
        'Content-Type': 'application/json',
      },
    },
  );
  await response; // extract JSON from the http response
  // do something with myJson
};

const postComment = async (movieId, name, description) => {
  const data = `{"item_id": "${movieId}", "username": "${name}", "comment": "${description}"}`;

  const mBody = JSON.parse(data);

  const response = await fetch(
    'https://us-central1-involvement-api.cloudfunctions.net/capstoneApi/apps/V9PGHS19NclaPI0zbq7b/comments/',
    {
      method: 'POST',
      body: JSON.stringify(mBody),
      headers: {
        'Content-Type': 'application/json',
      },
    },
  );
  await response; // extract JSON from the http response
  // do something with myJson
};

const getLikes = async () => {
  const response = await fetch(
    'https://us-central1-involvement-api.cloudfunctions.net/capstoneApi/apps/V9PGHS19NclaPI0zbq7b/likes/',
  );
  const myJson = await response.json(); // extract JSON from the http response
  localStorage.setItem('likes', JSON.stringify(myJson));
};

const checkForLikes = (movieId) => {
  const likes = JSON.parse(localStorage.getItem('likes'));
  let like = 0;
  likes.forEach((element) => {
    if (element.item_id === movieId) {
      like = element.likes;
      // like += 1;
    }
  });
  return like;
};

const loadApi = async () => {
  const response = await fetch(
    `https://api.tvmaze.com/search/shows?q=${randomString(1)}`,
  );
  const myJson = await response.json(); // extract JSON from the http response

  // Add the total number of movies to the DOM
  totalMovies.insertAdjacentHTML('afterend', `(${myJson.length})`);

  for (let i = 0; i < myJson.length; i += 1) {
    let { name } = myJson[i].show;
    const movieId = myJson[i].show.id;

    let like = checkForLikes(movieId);

    if (name.length > 15) name = `${name.substring(0, 15)}...`;

    const image = JSON.stringify(myJson[i].show.image);
    let imageSrc = 'https://static.tvmaze.com/uploads/images/medium_portrait/206/515082.jpg';

    if (image !== 'null') {
      imageSrc = myJson[i].show.image.medium;
    }

    showMovies.innerHTML += `
  <!-- Single Movie Banner -->
  <div class="single-movies card">
    <div class="movie-banner">
      <img
        class="movie-banner-img"
        src="${imageSrc}"
        alt="movieName"
      />
    </div>
    <div class="title-rection">
      <h3 id="title">${name}</h3>
      <i id ="${movieId}" class="liked fa-regular fa-heart"></i>
    </div>
    <div class="movie-likes">
      <p> <span id="_${movieId}">${like}</span> likes</p>
    </div>
    <div class="action-btns">
    <form class="submit-btns postReservation">
        <input type="hidden" value="${movieId}" id="movieId">
        <button class="btn btn-secondary">Reservations</button>
      </form>
      <form class="submit-btns postComment">
        <input type="hidden" value="${movieId}" id="movieId">
        <button class="btn btn-primary">Comments</button>
      </form>
    </div>
  </div>
  <!-- Single Movie Banner End-->
`;

    const likeBtn = document.querySelectorAll('.liked');
    likeBtn.forEach((btn) => {
      btn.addEventListener('click', (e) => {
        btn.classList.toggle('fa-regular');
        btn.classList.toggle('fa-solid');
        if (btn.classList.contains('fa-solid')) {
          like += 1;
          const likes = document.getElementById(`_${e.target.id}`);

          likes.innerHTML = like;

          liked(e.target.id);
        }
      });
    });
  }
};

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
              Comments<span id="commentConter">(${comments.length})</span>
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
  });
};

getLikes();
loadApi();

setTimeout(() => {
  const postComment = document.querySelectorAll('.postComment');
  postComment.forEach((submitButton) => {
    submitButton.addEventListener('submit', (event) => {
      event.preventDefault();
      const movieId = submitButton.querySelector('#movieId').value;
      getMovieDetails(movieId);
      popup.classList.remove('hide');
    });
  });
}, 1000);
