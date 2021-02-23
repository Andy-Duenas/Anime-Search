/* eslint-disable no-console */

var $topRatedImgs = document.querySelectorAll('.top-rated');
var $topRatedTitles = document.querySelectorAll('.anime-title-top');
// var $fourRandomAnime = document.querySelectorAll('.anime-title');

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

function setTopRatedImgs(imgList) {
  $topRatedImgs[0].setAttribute('src', imgList[0].image_url);
  $topRatedImgs[1].setAttribute('src', imgList[1].image_url);
  $topRatedImgs[2].setAttribute('src', imgList[2].image_url);
  $topRatedTitles[0].textContent = imgList[0].title;
  $topRatedTitles[1].textContent = imgList[1].title;
  $topRatedTitles[2].textContent = imgList[2].title;
}

function setFourRandomAnime() {

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
