# LiveScore

En Vue.js-applikation  visar live-resultat och matchinformation för fotbollsmatcher för top 5 ligor Europa. Komponenten använder en sig av [Football-data API](https://www.football-data.org/). 
Tillåter även dig som användare att spara dina favoritlag. 

## Installation
* Klona detta repository.

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


## Demo
_TODO_

## Varför Vue.js?
Se [jämförelsen här](jämförelse.md)

## Teknologier som används
* [Vue.js](https://vuejs.org/)
* [axios](https://github.com/axios/axios)
* [Football-data API](https://www.football-data.org/)
* [Bootstrap 5.2](https://getbootstrap.com/docs/5.3/getting-started/introduction/)



## Licens
Det här projektet är licensierat under Apache License 2.0. Se [LICENSE](LICENSE) för mer information.
