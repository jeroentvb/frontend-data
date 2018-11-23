# frontend-data 📊
🎓 A repo for an interactive datavisualisation made with d3

## Usage
To use the application enter the following commands in your terminal:
```
git clone https://github.com/jeroentvb/frontend-data.git
cd frontend-data
```
Open [index.html](index.html) to view the data visualisation.  
If you also want to get data from the OBA also enter the following commands.
```
cd data
npm install
echo PUBLIC_KEY=public key here >> .env
echo SECRET_KEY=private key here >> .env
```
Change the genres array in [index.js](./data/index.js) with the genres you want to get info for.

# Proces
*The following is all in dutch*

## Concept 1
De volgende schetsen zijn mijn eerste ideeën.
![schetsen 1](/doc/img/schetsen1.jpg)
Deze schetsen hebben allemaal ongeveer hetzelfde concept in een andere visualisatievorm, namelijk het aantal boeken in genres per jaar. Als er op een genre geklikt zou worden zou extra informatie in een 2e datavisualisatie verschijnen. Bij de eerste welke schrijvers er allemaal dat jaar een boek gepubliceerd hebben. Bij de tweede de verdeling tussen genres in dat jaar.
![schetsen 2](/doc/img/schetsen2.jpg)
Mijn 2e pagina conceptschetsen hadden als idee om te kijken 'hoe dik een auteur' is, in boeken. Dit bleek alleen vrij lastig interessant/interactief te maken  

Na de feedbackronde met Bas, Sterre en Laurens bleek dat ik nog eens beter moest nadenken over wat interessant zou zijn om aan de gebruiker te laten zien.

## Concept 2
Vervolgens heb ik al mijn eerste schetsen aan de kant gelegd en een compleet nieuw concept verzonnen.
Ik was van plan een wordcloud te maken met de meest voorkomende woorden in de titels van boeken uit een genre. Ook was ik van plan bij het klikken op een woord een 2e visualisatie te tonen van allen titels die het woord bevatten, met de schrijvers erbij. Mijn eerste idee was om dat in een pie chart te doen. Maar daar heb ik verder geen aandacht aan besteed omdat ik eerst de hoofdvisualisatie af wilde hebben.
![concept 2](/doc/img/concept2.jpg)

## Concept 2.5
Nadat ik data had opgehaald heb ik het concept verfijnd. Ik had besloten een bubble chart te maken i.p.v. een wordcloud omdat daar meerdere woorden uit verschillende genres in passen.
Echter nadat ik de data voor het eerst in mijn visualisatievorm had bleek dat een paar woorden zoveel voorkwamen dat de anderen daar onleesbaar van werden.
![concept 2.5](/doc/img/concept2.5.jpg)

## Data ophalen
Deze code is deels hetzelfde/gerecycled van functional-programming. Het enige verschil is het omvormen van data (wat neer komt op ongeveer 50%).

## Data visualiseren
Dit proces was veel ingewikkelder dan gehoopt.

### Lokaal project
Ik heb als voorbeeld de [bubble chart van Mike Bostock](https://beta.observablehq.com/@mbostock/d3-bubble-chart) op Observable gekozen en ben die in een lokaal bestand gaan zetten.
Dit bleek ingewikkelder dan gedacht. Ten eerste vond ik de code van deze visualisatie ingewikkelder dan de scatterplot die ik voor functional programming had gemaakt. Maar wat het vooral ingewikkeld maakte was dat er een aantal functies werden gebruikt die niet in de browser zitten, maar wel in Observable. Een voorbeeld is `DOM.uid()`. Deze zitten in een Observable library genaamd [observablehq/notebook-stdlib](https://github.com/observablehq/notebook-stdlib/tree/master/src/dom).

### Data omvormen
Vervolgens heb ik met `fetch` mijn JSON bestand vanaf github ingeladen. Het format van mijn data bleek totaal niet te werken.
Er werd in de voorbeeldcode van Mike best wel veel gedaan te worden met de data om die geschikt te maken voor de visualisatie. Het meeste van het omvormen gebeurt nu in de [formatData](https://github.com/jeroentvb/frontend-data/blob/67d2ec74b06c15fd97be89c6641f7e1a70697af8/assets/js/script.js#L34-L61) functie. Ik heb eerst moeten uitzoeken hoe het precies werd omgevormd en toen mijn eigen data daar op aan moeten passen.
Dit duurde allemaal best lang waardoor ik in mijn optiek wat tijd ben verloren.

### Data visualiseren
Het weergeven van de data was niet zo ingewikkeld. Wat wel erg lastig was, was het updaten van data.
Het was de bedoeling dat je een genre kon selecteren en dat de data zou aanpassen met het enter, update en exit principe.
Ik heb op zijn minst een dag tijd eraan besteed en toen lukte het me nog steeds niet. [Dit](https://github.com/jeroentvb/frontend-data/blob/37cdd0f9a980a043c9e888610d8d299d5be00bd6/assets/js/script.js#L186-L207) is hoe ver ik daarmee ben gekomen.
Op gegeven moment heb ik het opgegeven en heb ik een [clear](https://github.com/jeroentvb/frontend-data/blob/37cdd0f9a980a043c9e888610d8d299d5be00bd6/assets/js/script.js#L182-L184) functie gemaakt die de svg leeg maakt, waarna ik de [render]() functie opnieuw aanroep om de svg op te bouwen met nieuwe data.

### kleine toevoegingen
Vervolgens heb ik een tooltip toegevoegd zodat de gebruiker kan zien hoeveel keer het woord voorkomt in titels van een genre.
Daarnaast heb ik een `.on('click')` toegevoegd die de titels en auteurs met het woord in een lijst onder de visualisatie zetten. Dit had een aparte visualisatie moeten worden maar daar had ik geen tijd meer voor.

## Nawoord
Ik vind het jammer dat ik niet alles af heb kunnen maken zoals ik dat had willen doen door gebrek aan tijd.
Alles wat ik nog had willen doen is terug te vinden in de [issues](https://github.com/jeroentvb/frontend-data/issues).
