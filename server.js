const dotnev = require("dotenv");

const express = require("express");
const morgan = require("morgan");
const http = require("http");
const socketIo = require("socket.io");


// SECURITY
// CORS
const cors = require("cors");

const colors = require("colors");
colors.enable();

const fileUpload = require("express-fileupload");
const cookieParser = require("cookie-parser");

// LOAD ENV
dotnev.config({ path: "./config/config.env" });

// Use basic routing middleware
// Express
const app = express();

// Body parser
app.use(express.json());
// Url encoded
app.use(express.urlencoded({ extended: true }));
// Cookie parser
app.use(cookieParser());
// Log Middleware in Dev
if (process.env.NODE_ENV === "development") {
	app.use(morgan("dev"));
};

// File upload
app.use(fileUpload());

// Enable cors
app.use(cors());

// ROUTING
app.post("/emit/:data", async (req, res) => {
	try {

		res.status(200).send({
			success: true,
			message: 'Data received'
		});

	} catch (err) {

	}
});

const server = http.createServer(app);
const io = socketIo(server);
// SOCKET IO INITIATE
io.on('connection', (socket) => {
	console.log("New client connected");

	socket.on('stmdata', (msg, response) => {
		console.log(msg);
		response({
			success: true
		});
	})
});



const PORT = process.env.PORT || 5001;
server.listen(
	PORT,
	console.log(
		`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold
	)
);

// Handle unhandled promise rejections
process.on("unhandledRejection", (err, promise) => {
	console.log(`Error: ${err.message}`.red);
	// Close server & exit process
	// server.close(() => process.exit(1));
});
