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
change the genres array in [index.js](./data/index.js) with the genres you want to get info for.
