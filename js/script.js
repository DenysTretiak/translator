
const sourceTextField = document.querySelector('.source-text-column__text');
const targetTextField = document.querySelector('.target-text-column__text');
const tranButton = document.querySelector('.button');
const map = document.querySelector('#map');
let options;
let array;

function makeSelectors(){
  const select_source_lang = document.createElement('select');

  select_source_lang.classList.add('source-text-column__select-lang');
  select_source_lang.classList.add('select');

  const values = ['auto', 'en', 'ua', 'ru', 'fr', 'it', 'pl', 'pt', 'cs', 'de', 'es'];
  const innerText = ['Определить язык', 'Английский', 'Украинский', 'Русский',
  'Французкий', 'Итальянский', 'Польский', 'Португальский', 'Чешский', 'Немецкий', 'Испанский'];

   values.forEach((item, i)=>{
     const option = document.createElement('option');

     option.value = item;
     option.innerHTML = innerText[i];
     select_source_lang.appendChild(option);
   });

   const select_target_lang = select_source_lang.cloneNode(true);

   select_target_lang.className = 'target-text-column__select-lang';
   select_target_lang.classList.add('select');
   select_target_lang.removeChild(select_target_lang.childNodes[0]);
   sourceTextField.parentNode.insertBefore(select_source_lang, sourceTextField);
   targetTextField.parentNode.insertBefore(select_target_lang, targetTextField);
}

makeSelectors();


const sourceLangSelect = document.querySelector('.source-text-column__select-lang');
const targetLangSelect = document.querySelector('.target-text-column__select-lang');
const search = window.location.search.substr(1);

let keys = [];
search.split('&').forEach(function(item) {
	item = item.split('=');
	keys[item[0]] = item[1];
});
let {text, sourceLn, targetLn} = keys;
if(text){
  text = text.replace(/\%20/g, ' ');
}

function getTranslation(lang){
  const sourceText = text || sourceTextField.value;
  const sourceLang = sourceLn || sourceLangSelect.value;
  const targetLang = targetLn || lang || targetLangSelect.value;
  if(text){
    sourceTextField.value = text;
  }
  if(sourceLn){
    sourceLangSelect.value = sourceLn;
  }
  if(targetLn){
    targetLangSelect.value = targetLn
  }
  if(sourceText === 'Lviv' ){
    map.innerHTML = '';
    let json_obj = JSON.parse(Get('https://nominatim.openstreetmap.org/search.php?q=Lviv&format=json&polygon_geojson=1'));
    array = json_obj[0].geojson.coordinates[0];
    createMap(49.837982, 24.024593)
  }
  if(sourceText === 'Kiev'){
    map.innerHTML = '';
    let json_obj = JSON.parse(Get('https://nominatim.openstreetmap.org/search.php?q=Kiev&format=json&polygon_geojson=1'));
    array = json_obj[1].geojson.coordinates[0];
    createMap(50.4546, 30.5238)
  }
  const url = "https://translate.googleapis.com/translate_a/single?client=gtx&sl="
     + sourceLang + "&tl=" + targetLang + "&dt=t&q=" + encodeURI(sourceText);
   fetch(url)
  .then(response => response.json())
  .then((data) => {
     let res = '';
    data[0].forEach((item)=>{
      res += item[0];
    })
    targetTextField.value = res;
  }
  )
  .catch( console.log );
  text = undefined;
  sourceLn = undefined;
  targetLn = undefined;
};
function createMap(lat, lng, array){
  options = {
     zoom: 10,
     center:{lat:lat, lng:lng}
   }
  const script = document.createElement('script');
  script.src= 'https://maps.googleapis.com/maps/api/js?key=AIzaSyCKAFBP-aGu1miUPP6-T9x66lr4JKtQFVc&callback=initMap';
  document.body.appendChild(script);
}

tranButton.addEventListener('click', function () {
  getTranslation();
}, false )



function Get(yourUrl){
    var Httpreq = new XMLHttpRequest(); // a new request
    Httpreq.open("GET",yourUrl,false);
    Httpreq.send(null);
    return Httpreq.responseText;
}


function initMap(){

  const myMap = new google.maps.Map(map, options);
  const cityCoordinates = [];
        array.forEach((item)=>{
            let obj = {};
            obj.lat = item[1];
            obj.lng = item[0];
            cityCoordinates.push(obj);
        });
        var city = new google.maps.Polygon({
          paths: cityCoordinates,
          strokeColor: '#FF0000',
          strokeOpacity: 0.8,
          strokeWeight: 2,
          fillColor: '#FF0000',
          fillOpacity: 0.35
        });
        city.setMap(myMap);
}

sourceTextField.addEventListener('keydown', (e)=>{
  setTimeout(function(){
   getTranslation()
  }, 100);
}, false);

targetLangSelect.addEventListener('click', ()=>{
   getTranslation(this.value)
}, false);
