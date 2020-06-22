# Two Buyer

Scribble protocol specification under 
`TwoBuyer.scr`.

## Set up and run Seller
```bash
cd S
npm install
npm run-script devStart
```

## Set up and run Buyer A
```bash
cd buyer-a
npm install
npm start
```

The development server will likely be on
http://localhost:3000

## Set up and run Buyer B
```bash
cd buyer-b
npm install
npm start
```

The development server will likely be on
http://localhost:3001

## Run the protocol
Open the URL of the development servers
on a web browser and execute the transaction.

## Dependencies
* Express.js web server
* React Context API for state management