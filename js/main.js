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
    } else {
      setTopRated(xhr.response.results, 8, type);
    }
  });
  xhr.send();
}

function checkPage(text) {
  if (info.page === 'home') {
    removeAllChildren($topMainList);
    removeAllChildren($randomMainList);
    removeAllChildren($singleAnime);
    $topAnimeHeader.textContent = 'Top Anime';
    $topAnimeHeader.className = 'top-header';
    $randomAnimeHeader.className = 'random-header';
    $singleAnime.checkPage = 'hidden';
    getTopRated(6, 6);
  } else if (info.page === 'random') {
    removeAllChildren($topMainList);
    removeAllChildren($randomMainList);
    removeAllChildren($singleAnime);
    $topAnimeHeader.textContent = 'Top Anime';
    $topAnimeHeader.className = 'hidden';
    $randomAnimeHeader.className = 'random-header';
    $singleAnime.checkPage = 'hidden';
    getTopRated(0, 18);
  } else if (info.page === 'rank') {
    removeAllChildren($topMainList);
    removeAllChildren($randomMainList);
    removeAllChildren($singleAnime);
    $topAnimeHeader.textContent = 'Top Anime';
    $topAnimeHeader.className = 'top-header';
    $randomAnimeHeader.className = 'hidden';
    $singleAnime.checkPage = 'hidden';
    getTopRated(18, 0);
  } else if (info.page === 'mylist') {
    removeAllChildren($topMainList);
    removeAllChildren($randomMainList);
    removeAllChildren($singleAnime);
    $topAnimeHeader.textContent = 'My List';
    $topAnimeHeader.className = 'top-header';
    $randomAnimeHeader.className = 'hidden';
    $singleAnime.checkPage = 'hidden';
    for (var i = 0; i < info.entries.length; i++) {
      var topOfTree = treeMaker(info.entries[i], 'topAnime');
      $topMainList.appendChild(topOfTree);
    }
  } else if (info.page === 'anime') {
    removeAllChildren($topMainList);
    removeAllChildren($randomMainList);
    removeAllChildren($singleAnime);
    $topAnimeHeader.textContent = text;
    $topAnimeHeader.className = 'top-header';
    $randomAnimeHeader.className = 'hidden';
    $singleAnime.className = 'large-container';
    searchAnime(text, 'singleAnime');
    info.page = 'home';
  } else if (info.page === 'search-genre' || info.page === 'search-anime') {
    removeAllChildren($topMainList);
    removeAllChildren($randomMainList);
    removeAllChildren($singleAnime);
    $topAnimeHeader.textContent = 'Search: ' + text;
    $topAnimeHeader.className = 'top-header';
    $randomAnimeHeader.className = 'hidden';
    $singleAnime.className = 'hidden';
    info.page = 'home';
  }
}

function removeAllChildren(parent) {
  while (parent.firstChild) {
    parent.removeChild(parent.firstChild);
  }
}

function setGenreRank(anime, index, objForTree, type) {
  var genreList = '';
  for (var i = 0; i < anime.genres.length; i++) {
    if (i + 1 < anime.genres.length) {
      genreList += ' ' + anime.genres[i].name + ',';
    } else {
      genreList += ' ' + anime.genres[i].name;
    }
  }
  var studiosList = '';
  for (var a = 0; a < anime.studios.length; a++) {
    if (a + 1 < anime.studios.length) {
      studiosList += ' ' + anime.studios[a].name + ',';
    } else {
      studiosList += ' ' + anime.studios[a].name;
    }
  }
  var opThemesList = '';
  for (var q = 0; q < anime.opening_themes.length; q++) {
    if (q + 1 < anime.opening_themes.length) {
      opThemesList += ' ' + anime.opening_themes[q] + ',';
    } else {
      opThemesList += ' ' + anime.opening_themes[q];
    }
  } var endThemesList = '';
  for (var p = 0; p < anime.ending_themes.length; p++) {
    if (p + 1 < anime.ending_themes.length) {
      endThemesList += ' ' + anime.ending_themes[p] + ',';
    } else {
      endThemesList += ' ' + anime.ending_themes[p];
    }
  }
  objForTree.studios = studiosList;
  objForTree.op = opThemesList;
  objForTree.end = endThemesList;
  objForTree.synopsis = anime.synopsis;
  objForTree.score = anime.score;
  objForTree.rating = anime.rating;
  objForTree.premiered = anime.premiered;
  objForTree.duration = anime.duration;
  objForTree.episodes = anime.episodes;
  objForTree.rank = anime.rank;
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
  firstcol.setAttribute('class', 'column-one-third');

  var cardContainer = document.createElement('div');
  firstcol.appendChild(cardContainer);

  var imgContainer = document.createElement('div');
  imgContainer.setAttribute('class', 'img-container');

  cardContainer.appendChild(imgContainer);
  cardContainer.setAttribute('class', 'card-container');

  var colInfo = document.createElement('div');
  colInfo.setAttribute('class', 'column-info');
  cardContainer.appendChild(colInfo);

  var img = document.createElement('img');
  img.setAttribute('class', 'top-rated');
  img.setAttribute('alt', 'anime-img');
  img.setAttribute('src', obj.url);
  imgContainer.appendChild(img);

  var star = document.createElement('i');
  if (inList(obj.title)) {
    star.setAttribute('class', 'favorite-icon-on fas fa-star');
    if (type === 'singleAnime') {
      star.textContent = ' Favorite';
    }
  } else {
    star.setAttribute('class', 'favorite-icon fas fa-star');
    if (type === 'singleAnime') {
      star.textContent = ' Favorite';
    }
  }
  colInfo.appendChild(star);

  var title = document.createElement('div');
  title.setAttribute('class', 'anime-title');
  colInfo.appendChild(title);

  var titleFirst = document.createElement('span');
  titleFirst.setAttribute('class', 'title');
  titleFirst.textContent = obj.title;
  title.appendChild(titleFirst);

  var rank = document.createElement('div');
  rank.setAttribute('class', 'anime-rank');
  colInfo.appendChild(rank);

  var rankFirst = document.createElement('span');
  rankFirst.setAttribute('class', 'first-word');
  rankFirst.textContent = 'Rank: ';
  rank.appendChild(rankFirst);

  var rankRest = document.createElement('span');
  rankRest.setAttribute('class', 'rest-of-p');
  rankRest.textContent = obj.rank;
  rank.appendChild(rankRest);

  var genre = document.createElement('div');
  genre.setAttribute('class', 'anime-genre');
  colInfo.appendChild(genre);

  var genreFirst = document.createElement('span');
  genreFirst.setAttribute('class', 'first-word');
  genreFirst.textContent = 'Genre: ';
  genre.appendChild(genreFirst);

  var genreRest = document.createElement('span');
  genreRest.setAttribute('class', 'rest-of-p');
  genreRest.textContent = obj.genre;
  genre.appendChild(genreRest);

  if (type === 'singleAnime') {
    var secondInfo = document.createElement('div');
    secondInfo.setAttribute('class', 'large-mid-info');
    cardContainer.appendChild(secondInfo);

    var leftSide = document.createElement('div');
    leftSide.setAttribute('class', 'large-half');
    secondInfo.appendChild(leftSide);

    var rightSide = document.createElement('div');
    rightSide.setAttribute('class', 'large-half');
    secondInfo.appendChild(rightSide);

    var studio = document.createElement('div');
    studio.setAttribute('class', 'large-info-line');
    leftSide.appendChild(studio);

    var studioFirst = document.createElement('span');
    studioFirst.setAttribute('class', 'first-word');
    studioFirst.textContent = 'Studios: ';
    studio.appendChild(studioFirst);

    var studioRest = document.createElement('span');
    studioRest.setAttribute('class', 'rest-of-p');
    studioRest.textContent = obj.studios;
    studio.appendChild(studioRest);

    var scoring = document.createElement('div');
    scoring.setAttribute('class', 'large-info-line');
    leftSide.appendChild(scoring);

    var scoreFirst = document.createElement('span');
    scoreFirst.setAttribute('class', 'first-word');
    scoreFirst.textContent = 'Score: ';
    scoring.appendChild(scoreFirst);

    var scoreRest = document.createElement('span');
    scoreRest.setAttribute('class', 'rest-of-p');
    scoreRest.textContent = obj.score;
    scoring.appendChild(scoreRest);

    var rates = document.createElement('div');
    rates.setAttribute('class', 'large-info-line');
    leftSide.appendChild(rates);

    var ratesFirst = document.createElement('span');
    ratesFirst.setAttribute('class', 'first-word');
    ratesFirst.textContent = 'Rated: ';
    rates.appendChild(ratesFirst);

    var ratesRest = document.createElement('span');
    ratesRest.setAttribute('class', 'rest-of-p');
    ratesRest.textContent = obj.rating;
    rates.appendChild(ratesRest);

    var numEp = document.createElement('div');
    numEp.setAttribute('class', 'large-info-line');
    rightSide.appendChild(numEp);

    var numEpFirst = document.createElement('span');
    numEpFirst.setAttribute('class', 'first-word');
    numEpFirst.textContent = 'Episodes: ';
    numEp.appendChild(numEpFirst);

    var numEpRest = document.createElement('span');
    numEpRest.setAttribute('class', 'rest-of-p');
    numEpRest.textContent = obj.episodes;
    numEp.appendChild(numEpRest);

    var premiereDate = document.createElement('div');
    premiereDate.setAttribute('class', 'large-info-line');
    rightSide.appendChild(premiereDate);

    var premDateFirst = document.createElement('span');
    premDateFirst.setAttribute('class', 'first-word');
    premDateFirst.textContent = 'Date: ';
    premiereDate.appendChild(premDateFirst);

    var premDateRest = document.createElement('span');
    premDateRest.setAttribute('class', 'rest-of-p');
    premDateRest.textContent = obj.premiered;
    premiereDate.appendChild(premDateRest);

    var lengthEp = document.createElement('div');
    lengthEp.setAttribute('class', 'large-info-line');
    rightSide.appendChild(lengthEp);

    var lengthFirst = document.createElement('span');
    lengthFirst.setAttribute('class', 'first-word');
    lengthFirst.textContent = 'Duration: ';
    lengthEp.appendChild(lengthFirst);

    var lengthRest = document.createElement('span');
    lengthRest.setAttribute('class', 'rest-of-p');
    lengthRest.textContent = obj.duration;
    lengthEp.appendChild(lengthRest);

    var thirdInfo = document.createElement('div');
    thirdInfo.setAttribute('class', 'large-full-column');
    firstcol.appendChild(thirdInfo);

    var op = document.createElement('div');
    op.setAttribute('class', 'large-info-line');
    thirdInfo.appendChild(op);

    var opFirst = document.createElement('span');
    opFirst.setAttribute('class', 'first-word');
    opFirst.textContent = 'Opening Themes: ';
    op.appendChild(opFirst);

    var opRest = document.createElement('span');
    opRest.setAttribute('class', 'rest-of-p');
    opRest.textContent = obj.op;
    op.appendChild(opRest);

    var end = document.createElement('div');
    end.setAttribute('class', 'large-info-line');
    thirdInfo.appendChild(end);

    var endFirst = document.createElement('span');
    endFirst.setAttribute('class', 'first-word');
    endFirst.textContent = 'Ending Themes: ';
    end.appendChild(endFirst);

    var endRest = document.createElement('span');
    endRest.setAttribute('class', 'rest-of-p');
    endRest.textContent = obj.end;
    end.appendChild(endRest);

    var syn = document.createElement('div');
    syn.setAttribute('class', 'large-info-line');
    thirdInfo.appendChild(syn);

    var synFirst = document.createElement('span');
    synFirst.setAttribute('class', 'first-word');
    synFirst.textContent = 'Synopsis: ';
    syn.appendChild(synFirst);

    var synRest = document.createElement('span');
    synRest.setAttribute('class', 'rest-of-p');
    synRest.textContent = obj.synopsis;
    syn.appendChild(synRest);

    firstcol.setAttribute('class', 'large-col');
    cardContainer.setAttribute('class', 'large-top-info');
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
    if (type === 'singleAnime') {
      getAnime(animeList[i].mal_id, i, type, obj);
    } else { getAnime(animeList[i].mal_id, i, 'topAnime', obj); }

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
      objToPush.title = event.target.closest('.column-one-third').querySelector('.anime-title').textContent;
      objToPush.genre = event.target.closest('.column-one-third').querySelector('.anime-genre').textContent;
      objToPush.rank = event.target.closest('.column-one-third').querySelector('.anime-rank').textContent;
      objToPush.url = event.target.closest('.column-one-third').querySelector('.top-rated').getAttribute('src');
    } else if (event.target.closest('.large-container')) {
      objToPush.title = event.target.closest('.large-container').querySelector('.large-title').textContent;
      objToPush.genre = event.target.closest('.large-container').querySelector('.large-rank').textContent;
      objToPush.rank = event.target.closest('.large-container').querySelector('.large-genre').textContent;
      objToPush.url = event.target.closest('.large-container').querySelector('.large-img').getAttribute('src');
    }
    info.entries.unshift(objToPush);
    event.target.className = 'favorite-icon-on fas fa-star';
  } else if (event.target.className === 'favorite-icon-on fas fa-star') {
    event.target.className = 'favorite-icon fas fa-star';
    if (event.target.closest('.column-one-third')) {
      deleteFromList(event.target.closest('.column-one-third').querySelector('.anime-title').textContent);
    } else if (event.target.closest('.large-container')) {
      deleteFromList(event.target.closest('.large-container').querySelector('.large-title').textContent);
    }
    if (info.page === 'mylist') { checkPage(); }
  }
}

$topMainList.addEventListener('click', handleFavorites);
$randomMainList.addEventListener('click', handleFavorites);
$singleAnime.addEventListener('click', handleFavorites);

function handleAnime(event) {
  if (event.target.className !== 'favorite-icon fas fa-star' && event.target.className !== 'favorite-icon-on fas fa-star') {
    if (event.target.closest('.column-one-third')) {
      info.page = 'anime';
      checkPage(event.target.closest('.column-one-third').querySelector('.anime-title').textContent);
    }
  }
}

$topMainList.addEventListener('click', handleAnime);
$randomMainList.addEventListener('click', handleAnime);
