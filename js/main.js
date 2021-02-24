var $topRatedImgs = document.querySelectorAll('.top-rated');
var $topRatedTitles = document.querySelectorAll('.anime-title-top');
var $randomTitle = document.querySelectorAll('.anime-title');
var $randomImgs = document.querySelectorAll('.four-rand-imgs');
var $topRatedGenre = document.querySelectorAll('.top-genre');
var $topRatedRank = document.querySelectorAll('.top-rank');
var $randomRank = document.querySelectorAll('.random-rank');
var $randomGenre = document.querySelectorAll('.random-genre');

function getTopRated(numOfTop, numOfRand) {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', 'https://api.jikan.moe/v3/top/anime');
  xhr.responseType = 'json';
  xhr.addEventListener('load', function () {
    setTopRated(xhr.response.top, numOfTop);
    var arrayOfRandomAnime = getRandomAnime(xhr.response.top, numOfRand);
    setRandomAnime(arrayOfRandomAnime, numOfRand);
  });
  xhr.send();
}

function getAnime(id, index, type) {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', 'https://api.jikan.moe/v3/anime/' + id);
  xhr.responseType = 'json';
  xhr.addEventListener('load', function () {
    if (type === 'topAnime') { setTopGenreRank(xhr.response, index); }
    if (type === 'ranAnime') { setRandomGenreRank(xhr.response, index); }
  });
  xhr.send();
}

getTopRated(3, 4);

function setRandomGenreRank(anime, index) {
  var genreList = 'Genre: ';
  for (var i = 0; i < anime.genres.length; i++) {
    genreList += ' ' + anime.genres[i].name + ',';
  }
  $randomRank[index].textContent = 'Rank: ' + anime.rank;
  $randomGenre[index].textContent = genreList;
}

function setTopGenreRank(anime, index) {
  var genreList = 'Genre: ';
  for (var i = 0; i < anime.genres.length; i++) {
    genreList += ' ' + anime.genres[i].name + ',';
  }
  $topRatedRank[index].textContent = 'Rank: ' + anime.rank;
  $topRatedGenre[index].textContent = genreList;
}

function setTopRated(animeList, amount) {
  for (var i = 0; i < amount; i++) {
    getAnime(animeList[i].mal_id, i, 'topAnime');
    $topRatedImgs[i].setAttribute('src', animeList[i].image_url);
    $topRatedTitles[i].textContent = animeList[i].title;
  }
}

function setRandomAnime(animeList, amount) {
  for (var i = 0; i < amount; i++) {
    getAnime(animeList[i].mal_id, i, 'ranAnime');
    $randomImgs[i].setAttribute('src', animeList[i].image_url);
    $randomTitle[i].textContent = animeList[i].title;
  }
}

function getRandomAnime(animeList, numOfAnime) {
  var arrayOfRandomAnime = [];
  for (var i = 0; i < numOfAnime; i++) {
    var a = Math.random() * 50;
    a = Math.floor(a);
    arrayOfRandomAnime.push(animeList[a]);
  }
  return arrayOfRandomAnime;
}
