/* eslint-disable no-undef */
/* eslint-disable no-console */

var $topMainList = document.querySelector('.top-list');
var $randomMainList = document.querySelector('.random-list');
var $homeButton = document.querySelector('.home-button');
var $randomButton = document.querySelector('.random-button');

function getTopRated(numOfTop, numOfRand) {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', 'https://api.jikan.moe/v3/top/anime');
  xhr.responseType = 'json';
  xhr.addEventListener('load', function () {
    if (numOfTop !== 0) {
      setTopRated(xhr.response.top, numOfTop);
    }
    if (numOfRand !== 0) {
      var arrayOfRandomAnime = getRandomAnime(xhr.response.top, numOfRand);
      setRandomAnime(arrayOfRandomAnime, numOfRand);
    }
  });
  xhr.send();
}

function getAnime(id, index, type, objForTree) {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', 'https://api.jikan.moe/v3/anime/' + id);
  xhr.responseType = 'json';
  xhr.addEventListener('load', function () {
    setGenreRank(xhr.response, index, objForTree, type);
  });
  xhr.send();
}
if (info.page === 'home') {
  getTopRated(3, 4);
} else if (info.page === 'random') {
  console.log('hi');
}

function setGenreRank(anime, index, objForTree, type) {
  var genreList = 'Genre: ';
  for (var i = 0; i < anime.genres.length; i++) {
    if (i + 1 < anime.genres.length) {
      genreList += ' ' + anime.genres[i].name + ',';
    } else {
      genreList += ' ' + anime.genres[i].name;
    }
  }
  objForTree.rank = 'Rank: ' + anime.rank;
  objForTree.genre = genreList;
  console.log(objForTree, type);
  var topOfTree = treeMaker(objForTree, type);
  if (type === 'topAnime') { $topMainList.appendChild(topOfTree); }
  if (type === 'ranAnime') { $randomMainList.appendChild(topOfTree); }
}

function treeMaker(obj, type) {
  var firstcol = document.createElement('div');
  var imgContainer = document.createElement('div');

  firstcol.appendChild(imgContainer);
  var star = document.createElement('i');

  star.setAttribute('class', 'favorite-icon fas fa-star');
  imgContainer.appendChild(star);

  var img = document.createElement('img');
  img.setAttribute('alt', 'anime-img');
  img.setAttribute('src', obj.url);
  imgContainer.appendChild(img);

  var colInfo = document.createElement('div');
  colInfo.setAttribute('class', 'column-info');
  firstcol.appendChild(colInfo);

  var title = document.createElement('h4');
  title.textContent = obj.title;
  colInfo.appendChild(title);

  var rank = document.createElement('h4');
  rank.textContent = obj.rank;
  colInfo.appendChild(rank);

  var genre = document.createElement('h4');
  genre.textContent = obj.genre;
  colInfo.appendChild(genre);

  if (type === 'topAnime') {
    firstcol.setAttribute('class', 'column-one-third');
    imgContainer.setAttribute('class', 'img-container');
    img.setAttribute('class', 'top-rated');
    title.setAttribute('class', 'anime-title-top');
    rank.setAttribute('class', 'top-rank');
    genre.setAttribute('class', 'top-genre');
  }

  if (type === 'ranAnime') {
    firstcol.setAttribute('class', 'column-half');
    imgContainer.setAttribute('class', 'img-container big-img');
    img.setAttribute('class', 'four-rand-imgs');
    title.setAttribute('class', 'anime-title');
    rank.setAttribute('class', 'random-rank');
    genre.setAttribute('class', 'random-genre');
  }

  return firstcol;
}

function setTopRated(animeList, amount) {
  for (var i = 0; i < amount; i++) {
    var obj = {};
    obj.url = animeList[i].image_url;
    obj.title = animeList[i].title;
    getAnime(animeList[i].mal_id, i, 'topAnime', obj);
  }
}

function setRandomAnime(animeList, amount) {
  for (var i = 0; i < amount; i++) {
    var obj = {};
    obj.url = animeList[i].image_url;
    obj.title = animeList[i].title;
    getAnime(animeList[i].mal_id, i, 'ranAnime', obj);
  }
}

function getRandomAnime(animeList, numOfAnime) {
  var arrayOfRandomAnime = [];
  for (var i = 0; i < numOfAnime; i++) {
    var a = Math.random() * numOfAnime;
    a = Math.floor(a);
    arrayOfRandomAnime.push(animeList[a]);
  }
  return arrayOfRandomAnime;
}

function handleHomeButton(event) {
  info.page = 'home';
}

$homeButton.addEventListener('click', handleHomeButton);

function handleRandomButton(event) {
  info.page = 'random';
}

$randomButton.addEventListener('click', handleRandomButton);
