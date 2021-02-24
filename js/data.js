/* exported data */
var info = {
  page: 'home'
};

var prevData = localStorage.getItem('jv-local-storage');
if (prevData !== null) {
  info = JSON.parse(prevData);
}

window.addEventListener('beforeunload', function (event) {
  var dataJSON = JSON.stringify(info);
  localStorage.setItem('jv-local-storage', dataJSON);
});
