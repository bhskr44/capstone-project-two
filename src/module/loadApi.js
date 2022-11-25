import checkForLikes from './checkForLikes';
import randomString from './randomString';
import liked from './liked';

const loadApi = async () => {
  const response = await fetch(
    `https://api.tvmaze.com/search/shows?q=${randomString(1)}`,
  );
  const myJson = await response.json(); // extract JSON from the http response

  // Get Element TOtalMOvies
  const totalMovies = document.querySelector('#totalMovies');
  const showMovies = document.querySelector('#show-movies');

  // Add the total number of movies to the DOM
  totalMovies.insertAdjacentHTML('afterend', `(${myJson.length})`);

  for (let i = 0; i < myJson.length; i += 1) {
    let { name } = myJson[i].show;
    const movieId = myJson[i].show.id;

    const like = checkForLikes(movieId);

    if (name.length > 15) name = `${name.substring(0, 15)}...`;

    const image = JSON.stringify(myJson[i].show.image);
    let imageSrc = 'https://static.tvmaze.com/uploads/images/medium_portrait/206/515082.jpg';

    if (image !== 'null') {
      imageSrc = myJson[i].show.image.medium;
    }

    showMovies.innerHTML += `
    <!-- Single Movie Banner -->
   
    <div class="single-movies card">
    <article>
      <div class="movie-banner">
        <img
          class="movie-banner-img"
          src="${imageSrc}"
          alt="movieName"
        />
      </div>
      <div class="title-rection">
        <h3 id="title">${name}</h3>
        <i id ="${movieId}" class="liked_btn fa-regular fa-heart"></i>
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
      </article>
    </div>
   
    <!-- Single Movie Banner End-->
  `;

    const likeBtn = document.querySelectorAll('.liked_btn');
    likeBtn.forEach((btn) => {
      btn.addEventListener('click', (e) => {
        btn.classList.toggle('fa-regular');
        btn.classList.toggle('fa-solid');
        if (btn.classList.contains('fa-solid')) {
          const likes = document.getElementById(`_${e.target.id}`);
          let currentLike = Number(likes.innerHTML);
          currentLike += 1;
          likes.innerHTML = currentLike;
          liked(e.target.id);
        }
      });
    });
  }
};

export default loadApi;
