import './css/style.css';
// import logo from './images/logo.png';

const showMovies = document.querySelector('#show-movies');
const totalMovies = document.querySelector('#totalMovies');
const popupClose = document.querySelector('#popup-close');
const popup = document.querySelector('.popup');

popupClose.addEventListener('click', () => {
  popup.classList.add('hide');
});

let randomString = (length) => {
  var result = '';
  var characters = 'abcdefghijklmnopqrstuvwxyz';
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

const loadApi = async () => {
  const response = await fetch(
    'https://api.tvmaze.com/search/shows?q=' + randomString(1)
  );
  const myJson = await response.json(); //extract JSON from the http response

  //Add the total number of movies to the DOM
  totalMovies.insertAdjacentHTML('afterend', '(' + myJson.length + ')');

  for (let i = 0; i < myJson.length; i += 1) {
    let name = myJson[i].show.name;
    let movieId = myJson[i].show.id;
    if (name.length > 15) name = name.substring(0, 15) + '...';

    let image = JSON.stringify(myJson[i].show.image);
    let imageSrc =
      'https://static.tvmaze.com/uploads/images/medium_portrait/206/515082.jpg';

    if (image !== 'null') {
      imageSrc = myJson[i].show.image.medium;
    }

    showMovies.innerHTML +=
      `
  <!-- Single Movie Banner -->
  <div class="single-movies card">
    <div class="movie-banner">
      <img
        class="movie-banner-img"
        src="` +
      imageSrc +
      `"
        alt="movieName"
      />
    </div>
    <div class="title-rection">
      <h3 id="title">` +
      name +
      `</h3>
      <i class="fa-regular fa-heart"></i>
    </div>
    <div class="movie-likes">
      <p id="likes">5 likes</p>
    </div>
    <div class="action-btns">
    <form class="submit-btns postReservation">
      <input type="hidden" value="` +
      movieId +
      `" id="movieId">
      <button class="btn btn-secondary">Reservations</button>
      </form>
      <form class="submit-btns postComment">
      <input type="hidden" value="` +
      movieId +
      `" id="movieId">
      <button class="btn btn-primary">Comments</button>
      </form>
    </div>
  </div>
  <!-- Single Movie Banner End-->
`;
  }
};

loadApi();
