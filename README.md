# LiveScoreApp <img src="https://www.svgrepo.com/show/17072/football.svg" width=4% height=4%>
![Project Status](https://img.shields.io/badge/Status-In%20Development-yellow)

En Vue.js-applikation  visar live-resultat och matchinformation för fotbollsmatcher för top 5 ligorna i Europa. Även Champions League visas. Komponenten använder sig av [Football-data API](https://www.football-data.org/). 
Tillåter även dig som användare att spara dina favoritlag. 

## Installation
* Klona detta repository.
```bash
git clone https://github.com/PhPersson/LiveScoreApp
cd LiveScoreApp
```

* Se till att du har node.js installerat på din dator genom att köra nedan kommando i valfri terminal
```javascript
node -v
```
* Om du fick att node.js inte kunde hittas så kan du ladda ner det [här](https://nodejs.org/en/download)


* Kör nedan kommando i projektets katalog för att installera nödvändiga paket.
```javascript
npm install
``` 

* Hämta en API-nyckel [här](https://www.football-data.org/client/register)

* Byt ut DIN API-NYCKEL i filen EXAMPLE.env till din API-nyckel som du fick från förregående steg

* Döp om filen EXAMPLE.env till bara _.env.local_

* Kör sedan nedan kommando för att starta servern.
```javascript
npm run serve
```

### CORS
Vårt API tillåter endast anrop från http://localhost. Det betyder att endast lokala utvecklingsmiljöer på din dator kan kommunicera med API:et och därmed använda LiveScore.
Detta projekt är fortfarande i utvecklingsfasen. Ett användbart tilläg är [Moesif Origin & CORS Changer](https://chrome.google.com/webstore/detail/moesif-origin-cors-change/digfbfaphojjndkpccljibejjbppifbc)

## Varför Vue.js?
Se [jämförelsen här](jämförelse.md)

## Teknologier som används
* [Vue.js](https://vuejs.org/)
* [axios](https://github.com/axios/axios)
* [Football-data API](https://www.football-data.org/)
* [Bootstrap 5.2](https://getbootstrap.com/docs/5.3/getting-started/introduction/)
* [Vuetify](https://vuetifyjs.com/en/)



## Licens
Det här projektet är licensierat under Apache License 2.0. Se [LICENSE](LICENSE) för mer information.
