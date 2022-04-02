/*const express = require('express');
const app = express();

const host = process.env.HOST || "http://localhost"
const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
	res.send('Welcome, this is the developer of BhieBot.')
});

app.listen(port, () => {
	console.log(`Your app is listening a ${host}:${port}`)
});*/
const unnamed = require("unnamed-js")

const server = unnamed({
	port: process.env.PORT | 3000,
	init: () => {
		console.log("Credits to Mart Anthony Salazar")
	}
})

server.GET("/", (a, b) => {
	b.send("Sample")
})
