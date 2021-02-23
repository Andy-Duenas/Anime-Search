/* eslint-disable no-console */

var $topRatedImgs = document.querySelectorAll('.top-rated');
var $topRatedTitles = document.querySelectorAll('.anime-title-top');
var $fourRandomTitle = document.querySelectorAll('.anime-title');
var $fourRandomImgs = document.querySelectorAll('.four-rand-imgs');

function getTopRated() {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', 'https://api.jikan.moe/v3/top/anime');
  xhr.responseType = 'json';
  xhr.addEventListener('load', function () {
    console.log('status', xhr.status);
    console.log('List', xhr.response);
    setTopRatedImgs(xhr.response.top);
    var arrayOfRandomAnime = setRandomAnime(xhr.response.top, 4);
    setFourRandomAnime(arrayOfRandomAnime);
  });
  xhr.send();
}

getTopRated();

function setTopRatedImgs(AnimeList) {
  $topRatedImgs[0].setAttribute('src', AnimeList[0].image_url);
  $topRatedImgs[1].setAttribute('src', AnimeList[1].image_url);
  $topRatedImgs[2].setAttribute('src', AnimeList[2].image_url);
  $topRatedTitles[0].textContent = AnimeList[0].title;
  $topRatedTitles[1].textContent = AnimeList[1].title;
  $topRatedTitles[2].textContent = AnimeList[2].title;
}

function setFourRandomAnime(AnimeList) {
  $fourRandomImgs[0].setAttribute('src', AnimeList[0].image_url);
  $fourRandomImgs[1].setAttribute('src', AnimeList[1].image_url);
  $fourRandomImgs[2].setAttribute('src', AnimeList[2].image_url);
  $fourRandomImgs[3].setAttribute('src', AnimeList[3].image_url);
  $fourRandomTitle[0].textContent = AnimeList[0].title;
  $fourRandomTitle[1].textContent = AnimeList[1].title;
  $fourRandomTitle[2].textContent = AnimeList[2].title;
  $fourRandomTitle[3].textContent = AnimeList[3].title;
}

function setRandomAnime(animeList, numOfAnime) {
  var arrayOfRandomAnime = [];

  for (var i = 0; i < numOfAnime; i++) {
    var a = Math.random() * 50;
    a = Math.floor(a);
    arrayOfRandomAnime.push(animeList[a]);
  }
  return arrayOfRandomAnime;
}
