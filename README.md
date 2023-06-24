# WebBouncingFaces

![two cartoon smiley faces on a blue background](https://www.dropbox.com/s/b9bf4eorjt796k9/BouncingFacesBackground.png?raw=1)

A web application to launch two-dimensional faces that collide with each other.
This repository holds the source files and tools to run the web application 
server. The server runs on static Express, while the client application uses the
canvas API with WebGPU to render the faces.

## Usage

### Running the Application on a Local Machine

Follow the instructions below to install and run the web application server 
from a local macOS machine. These instructions assume that the user has 
installed NodeJS, is familiar with the terminal, and understands basic web 
server functionality.

#### Cloning the Application
Clone this repository from GitHub and move into the project's root by running
the following series of commands in a terminal window.
```text
git clone https://github.com/EdwardNgg/WebBouncingFaces
cd WebBouncingFaces
```

#### Installing NodeJS Dependencies
Install the NodeJS dependencies for the project by running the following 
installation command.
```text
npm install
```

#### Building the Client Application
Build the client production JavaScript application from the source files by 
running the following build command.
```text
npm run build
```

#### Running the Web Application Server
Start the web server, which hosts the web application at the default address
`http://localhost:3000/`.
```text
npm start
```
Open a preferred web browser and head to the default
address to play with the application.