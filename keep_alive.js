const express = require('express');
const app = express();

const host = process.env.HOST || "http://localhost"
const port = process.env.PORT || 3000;

app.listen(port, () => {
	console.log(`Your app is listening a ${host}:${port}`)
});

app.get('/', (req, res) => {
	//res.send('Welcome, this is the developer of JC Rios')
	res.sendFile(__dirname + "/a.html")
});

/*
const unnamed = require("unnamed-js")

const server = unnamed({
	port: 3000,
	init: () => {
		console.log("Running with port " + 3000)
		console.log("Credits to Mart Anthony Salazar")
	}
})

server.GET("/", (a, b) => {
	b.send("Krysanne Guinmods server side using UnnamedJS.")
})
*/
