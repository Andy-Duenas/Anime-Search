/* eslint-disable no-console */
/* eslint-disable eqeqeq */
/* eslint-disable no-undef */
var genreList = {
  action: 1,
  adventure: 2,
  cars: 3,
  comedy: 4,
  dementia: 5,
  demons: 6,
  mystery: 7,
  drama: 8,
  fantasy: 10,
  game: 11,
  historical: 13,
  horror: 14,
  kids: 15,
  magic: 16,
  martialarts: 17,
  mecha: 18,
  music: 19,
  parody: 20,
  samurai: 21,
  romance: 22,
  school: 23,
  scifi: 24,
  shoujo: 25,
  shounen: 27,
  space: 29,
  sports: 30,
  superpowers: 31,
  vampire: 32,
  sliceoflife: 36,
  supernatural: 37,
  military: 38,
  police: 39,
  psychological: 40,
  thriller: 41
};

var $topMainList = document.querySelector('.top-list');
var $randomMainList = document.querySelector('.random-list');
var $homeButton = document.querySelector('.home-button');
var $randomButton = document.querySelector('.random-button');
var $rankButton = document.querySelector('.top-button');
var $topAnimeHeader = document.querySelector('.top-header');
var $randomAnimeHeader = document.querySelector('.random-header');
var $searchBar = document.querySelector('form');

checkPage();

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

function searchAnime(searchFor, type) {
  var xhr = new XMLHttpRequest();
  if (type === 'genre') {
    xhr.open('GET', 'https://api.jikan.moe/v3/search/anime?q=&page=1&genre=' + searchFor + '&order_by=score&sort=desc');
  }
  xhr.responseType = 'json';
  xhr.addEventListener('load', function () {
    setTopRated(xhr.response.results, 12);
  });
  xhr.send();
}

function checkPage(text) {
  if (info.page === 'home') {
    removeAllChildren($topMainList);
    removeAllChildren($randomMainList);
    $topAnimeHeader.textContent = 'Top Anime';
    $topAnimeHeader.className = 'top-header';
    $randomAnimeHeader.className = 'random-header';
    getTopRated(3, 4);
  } else if (info.page === 'random') {
    removeAllChildren($topMainList);
    removeAllChildren($randomMainList);
    $topAnimeHeader.textContent = 'Top Anime';
    $topAnimeHeader.className = 'hidden';
    $randomAnimeHeader.className = 'random-header';
    getTopRated(0, 12);
  } else if (info.page === 'rank') {
    removeAllChildren($topMainList);
    removeAllChildren($randomMainList);
    $topAnimeHeader.textContent = 'Top Anime';
    $topAnimeHeader.className = 'top-header';
    $randomAnimeHeader.className = 'hidden';
    getTopRated(12, 0);
  }
  if (info.page === 'search') {
    removeAllChildren($topMainList);
    removeAllChildren($randomMainList);
    $topAnimeHeader.textContent = 'Search: ' + text;
    $topAnimeHeader.className = 'top-header';
    $randomAnimeHeader.className = 'hidden';
    info.page = 'home';
  }
}

function removeAllChildren(parent) {
  while (parent.firstChild) {
    parent.removeChild(parent.firstChild);
  }
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
  var isIN = false;

  while (numOfAnime !== arrayOfRandomAnime.length) {
    var a = Math.random() * animeList.length;
    a = Math.floor(a);

    isIN = checkPrevNum(arrayOfRandomAnime, a);

    if (isIN === false) {
      arrayOfRandomAnime.push(animeList[a]);
    }
  }
  return arrayOfRandomAnime;
}

function checkPrevNum(array, a) {
  for (var i = 0; i < array.length; i++) {
    if (a === array[i].rank - 1) {

      return true;
    }
  }

  return false;
}

function handleHomeButton(event) {
  info.page = 'home';
  checkPage();
}

$homeButton.addEventListener('click', handleHomeButton);

function handleRandomButton(event) {
  info.page = 'random';
  checkPage();
}

$randomButton.addEventListener('click', handleRandomButton);

function handleRankButton(event) {
  info.page = 'rank';
  checkPage();
}

$rankButton.addEventListener('click', handleRankButton);

function checkListOfGenre(value) {
  var animeType = {};
  value = value.toLowerCase();
  console.log(genreList[deleteSpaces(value)]);
  animeType.genre = genreList[deleteSpaces(value)];
  animeType.isIn = true;
  return animeType;

}

function deleteSpaces(string) {
  var lowerCaseString = string.toLowerCase();
  var returnResult = '';
  returnResult = lowerCaseString.replace(/\s+/g, '');
  return returnResult;
}

function handleSearchBar(event) {
  event.preventDefault();
  var genre = checkListOfGenre(event.srcElement[0].value);
  if (genre.isIn) {
    info.page = 'search';
    checkPage(event.srcElement[0].value);
    searchAnime(genre.genre, 'genre');
  }
  $searchBar.reset();
}
$searchBar.addEventListener('submit', handleSearchBar);
