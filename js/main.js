/* eslint-disable no-console */
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
var $myListButton = document.querySelector('.mylist-button');
var $loading = document.querySelector('.column-load');
var $singleAnime = document.querySelector('.large-container');

var loadAnim = gsap.to('.loading', { rotate: 360, repeat: 3, duration: 0.7 });

checkPage();

function getTopRated(numOfTop, numOfRand) {
  $loading.className = 'column-load';
  loadAnim.restart();
  var xhr = new XMLHttpRequest();
  xhr.open('GET', 'https://api.jikan.moe/v3/top/anime');
  xhr.responseType = 'json';
  xhr.addEventListener('load', function () {
    loadAnim.pause();
    $loading.className = 'column-load hidden';
    if (numOfTop !== 0) {
      setTopRated(xhr.response.top, numOfTop, 'topAnime');
    }
    if (numOfRand !== 0) {
      var arrayOfRandomAnime = getRandomAnime(xhr.response.top, numOfRand);
      setRandomAnime(arrayOfRandomAnime, numOfRand);
    }
  });
  xhr.send();
}

function getAnime(id, index, type, objForTree) {
  $loading.className = 'column-load';
  loadAnim.restart();
  var xhr = new XMLHttpRequest();
  xhr.open('GET', 'https://api.jikan.moe/v3/anime/' + id);
  xhr.responseType = 'json';
  xhr.addEventListener('load', function () {
    loadAnim.pause();
    $loading.className = 'column-load hidden';
    setGenreRank(xhr.response, index, objForTree, type);
  });
  xhr.send();
}

function searchAnime(searchFor, type) {
  $loading.className = 'column-load';
  loadAnim.restart();
  var xhr = new XMLHttpRequest();
  if (type === 'genre') {
    xhr.open('GET', 'https://api.jikan.moe/v3/search/anime?q=&page=1&genre=' + searchFor + '&order_by=score&sort=desc');
  }
  if (type === 'anime') {
    xhr.open('GET', 'https://api.jikan.moe/v3/search/anime?q=' + searchFor + '&sort=desc');
  }
  if (type === 'singleAnime') {
    xhr.open('GET', 'https://api.jikan.moe/v3/search/anime?q=' + searchFor + '&sort=desc');
  }
  xhr.responseType = 'json';
  xhr.addEventListener('load', function () {
    loadAnim.pause();
    $loading.className = 'column-load hidden';
    if (type === 'singleAnime') {
      setTopRated(xhr.response.results, 1, type);
    } if (type === 'topAnime') {
      setTopRated(xhr.response.results, 12, type);
    }
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
    getTopRated(6, 8);
  } else if (info.page === 'random') {
    removeAllChildren($topMainList);
    removeAllChildren($randomMainList);
    $topAnimeHeader.textContent = 'Top Anime';
    $topAnimeHeader.className = 'hidden';
    $randomAnimeHeader.className = 'random-header';
    getTopRated(0, 20);
  } else if (info.page === 'rank') {
    removeAllChildren($topMainList);
    removeAllChildren($randomMainList);
    $topAnimeHeader.textContent = 'Top Anime';
    $topAnimeHeader.className = 'top-header';
    $randomAnimeHeader.className = 'hidden';
    getTopRated(20, 0);
  } else if (info.page === 'mylist') {
    removeAllChildren($topMainList);
    removeAllChildren($randomMainList);
    $topAnimeHeader.textContent = 'My List';
    $topAnimeHeader.className = 'top-header';
    $randomAnimeHeader.className = 'hidden';
    for (var i = 0; i < info.entries.length; i++) {
      var topOfTree = treeMaker(info.entries[i], 'topAnime');
      $topMainList.appendChild(topOfTree);
    }
  } else if (info.page === 'anime') {
    removeAllChildren($topMainList);
    removeAllChildren($randomMainList);
    $topAnimeHeader.textContent = text;
    $topAnimeHeader.className = 'top-header';
    $randomAnimeHeader.className = 'hidden';
    searchAnime(text, 'singleAnime');
    info.page = 'home';
  } else if (info.page === 'search-genre' || info.page === 'search-anime') {
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
  if (type === 'singleAnime') { $singleAnime.appendChild(topOfTree); }
}

function inList(title) {
  for (var i = 0; i < info.entries.length; i++) {
    if (title === info.entries[i].title) {
      return true;
    }
  }
  return false;
}

function treeMaker(obj, type) {
  var firstcol = document.createElement('div');
  var cardContainer = document.createElement('div');
  firstcol.appendChild(cardContainer);
  var imgContainer = document.createElement('div');

  cardContainer.appendChild(imgContainer);
  var star = document.createElement('i');
  if (inList(obj.title)) {
    star.setAttribute('class', 'favorite-icon-on fas fa-star');
  } else {
    star.setAttribute('class', 'favorite-icon fas fa-star');
  }
  imgContainer.appendChild(star);

  var img = document.createElement('img');
  img.setAttribute('alt', 'anime-img');
  img.setAttribute('src', obj.url);
  imgContainer.appendChild(img);

  var colInfo = document.createElement('div');
  cardContainer.appendChild(colInfo);

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
    cardContainer.setAttribute('class', 'card-container');
    imgContainer.setAttribute('class', 'img-container');
    img.setAttribute('class', 'top-rated');
    colInfo.setAttribute('class', 'column-info');
    title.setAttribute('class', 'anime-title-top');
    rank.setAttribute('class', 'top-rank');
    genre.setAttribute('class', 'top-genre');
  }

  if (type === 'ranAnime') {
    firstcol.setAttribute('class', 'column-half');
    cardContainer.setAttribute('class', 'card-container');
    imgContainer.setAttribute('class', 'img-container big-img');
    img.setAttribute('class', 'four-rand-imgs');
    colInfo.setAttribute('class', 'column-info');
    title.setAttribute('class', 'anime-title');
    rank.setAttribute('class', 'random-rank');
    genre.setAttribute('class', 'random-genre');
  }

  if (type === 'singleAnime') {
    firstcol.setAttribute('class', 'large-col');
    cardContainer.setAttribute('class', 'large-card-container');
    imgContainer.setAttribute('class', 'large-img-container');
    colInfo.setAttribute('class', 'large-column-info');
    img.setAttribute('class', 'large-img');
    title.setAttribute('class', 'large-title');
    rank.setAttribute('class', 'large-rank');
    genre.setAttribute('class', 'large-genre');
  }

  return firstcol;
}

function setTopRated(animeList, amount, type) {
  for (var i = 0; i < amount; i++) {
    var obj = {};
    obj.url = animeList[i].image_url;
    obj.title = animeList[i].title;
    if (type === 'topAnime') { getAnime(animeList[i].mal_id, i, type, obj); }
    if (type === 'singleAnime') { getAnime(animeList[i].mal_id, i, type, obj); }
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

function handleListButton(event) {
  info.page = 'mylist';
  checkPage();
}

$myListButton.addEventListener('click', handleListButton);

function deleteSpaces(string) {
  var lowerCaseString = string.toLowerCase();
  var returnResult = '';
  returnResult = lowerCaseString.replace(/\s+/g, '');
  return returnResult;
}

function capitalizeWords(string) {
  var lowerCaseString = string.toLowerCase();
  var returnResult = '';
  returnResult += string[0].toUpperCase();
  for (var i = 1; i < string.length; i++) {
    if (string[i] === ' ') {
      returnResult += lowerCaseString[i].toUpperCase();
      i++;
      returnResult += lowerCaseString[i].toUpperCase();
    } else {
      returnResult += lowerCaseString[i];
    }
  }
  return returnResult;
}
function checkListOfGenre(value) {
  var animeType = {};
  value = value.toLowerCase();
  animeType.value = value;
  animeType.genre = genreList[deleteSpaces(value)];
  if (!animeType.genre) {
    animeType.isIn = false;
  } else {
    animeType.isIn = true;
  }
  return animeType;
}

function handleSearchBar(event) {
  event.preventDefault();
  var genre = checkListOfGenre(event.srcElement[0].value);
  if (genre.isIn) {
    info.page = 'search-genre';
    checkPage(event.srcElement[0].value);
    searchAnime(genre.genre, 'genre');
  } else {
    info.page = 'search-anime';
    genre.value = capitalizeWords(genre.value);
    checkPage(genre.value);
    searchAnime(genre.value, 'anime');
  }
  $searchBar.reset();
}
$searchBar.addEventListener('submit', handleSearchBar);

function deleteFromList(title) {
  for (var i = 0; i < info.entries.length; i++) {
    if (title === info.entries[i].title) {
      info.entries.splice(i, 1);
    }
  }
}

function handleFavorites(event) {

  var objToPush = {};
  if (event.target.className === 'favorite-icon fas fa-star') {
    if (event.target.closest('.column-one-third')) {
      objToPush.title = event.target.closest('.column-one-third').querySelector('.anime-title-top').textContent;
      objToPush.genre = event.target.closest('.column-one-third').querySelector('.top-genre').textContent;
      objToPush.rank = event.target.closest('.column-one-third').querySelector('.top-rank').textContent;
      objToPush.url = event.target.closest('.column-one-third').querySelector('.top-rated').getAttribute('src');
    } else {
      objToPush.title = event.target.closest('.column-half').querySelector('.anime-title').textContent;
      objToPush.genre = event.target.closest('.column-half').querySelector('.random-rank').textContent;
      objToPush.rank = event.target.closest('.column-half').querySelector('.random-genre').textContent;
      objToPush.url = event.target.closest('.column-half').querySelector('.four-rand-imgs').getAttribute('src');
    }
    info.entries.unshift(objToPush);
    event.target.className = 'favorite-icon-on fas fa-star';

  } else if (event.target.className === 'favorite-icon-on fas fa-star') {
    event.target.className = 'favorite-icon fas fa-star';
    if (event.target.closest('.column-one-third')) {
      deleteFromList(event.target.closest('.column-one-third').querySelector('.anime-title-top').textContent);
    } else {
      deleteFromList(event.target.closest('.column-half').querySelector('.anime-title').textContent);
    }
    if (info.page === 'mylist') { checkPage(); }
  }
}

$topMainList.addEventListener('click', handleFavorites);
$randomMainList.addEventListener('click', handleFavorites);

function handleAnime(event) {
  if (event.target.className !== 'favorite-icon fas fa-star' && event.target.className !== 'favorite-icon-on fas fa-star') {
    if (event.target.closest('.column-one-third')) {
      console.log('third:', event.target.closest('.column-one-third').querySelector('.anime-title-top').textContent);
      info.page = 'anime';
      checkPage(event.target.closest('.column-one-third').querySelector('.anime-title-top').textContent);
    } else {
      console.log('half:', event.target.closest('.column-half').querySelector('.anime-title').textContent);
      info.page = 'anime';
      checkPage(event.target.closest('.column-half').querySelector('.anime-title').textContent);
    }
  }
}

$topMainList.addEventListener('click', handleAnime);
$randomMainList.addEventListener('click', handleAnime);
