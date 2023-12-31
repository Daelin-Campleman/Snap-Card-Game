# Snap (Card Game)
<br>

## Requirements
Node.js 18

## Running locally

### 1. Checkout the correct branch

Checkout the branch called `local`. <br/>
Do not checkout `main`.

### 2. Creating the databases

Create two mysql databases: one  for the game and one for authentication. <br/>
Run the following scripts to create the databases:

CREATE DATABASE SnapHistoryDB;

USE SnapHistoryDB;

-- Create the Players table <br/>
CREATE TABLE Players (
  player_id INT NOT NULL AUTO_INCREMENT,
  username VARCHAR(255),
  email VARCHAR(255),
  PRIMARY KEY (player_id)
);<br/><br/>

-- Create the Games table <br/>
CREATE TABLE Games (
  game_id INT NOT NULL AUTO_INCREMENT,
  winner_id INT,
  PRIMARY KEY (game_id),
  FOREIGN KEY (winner_id) REFERENCES Players(player_id)
); <br/><br/>

-- Create the Game_Players table <br/>
CREATE TABLE Game_Players (
  gamePlayersId INT NOT NULL AUTO_INCREMENT,
  game_id INT,
  player_id INT,
  PRIMARY KEY(gamePlayersId),
  FOREIGN KEY (game_id) REFERENCES Games(game_id),
  FOREIGN KEY (player_id) REFERENCES Players(player_id)
); <br/><br/>

CREATE DATABASE AuthServerDB;

USE AuthServerDB;

CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(255) DEFAULT NULL,
    last_name VARCHAR(255) DEFAULT NULL,
    email VARCHAR(255) UNIQUE,
    password VARCHAR(255),
    token VARCHAR(255)
);

### 3. Adding environment variables

Add an `.env` file in the `server` folder containing the following: <br/>

API_URL = http://localhost:8082 <br/> <br/>

Add an `.env` file in the `api` folder containing the following: <br/> 

  HOST: your mysql hostname<br/>
  USER: your mysql username<br/>
  PASSWORD: your mysql password<br/>
  DATABASE: database for game <br/>
  AUTH_URL= http://localhost:4001 <br/> <br/>


Add an `.env` file in the `auth-server` folder containing the following: <br/>

HOST: your mysql hostname <br/>
USER: your mysql username<br/>
PASSWORD: your mysql password<br/>
DATABASE: database for authentication <br/>
TOKEN_KEY = enter any combination of letters here (no spaces or quotations)<br/>
API_PORT=4001 <br/>
APP_URL= http://localhost:8080 <br/>
API_URL= http://localhost:8082 <br/>
SERVER_URL= http://localhost:8081 <br/>

### 4. Installing dependencies

1. Run `npm install` in the "api" directory.
2. Run `npm install` in the "server" directory.
3. Run `npm install` in the "app" directory.
4. Run `npm install` in the "auth-server" directory.
5. Run `npm start` in the "api" directory.
6. Run `npm start` in the "server" directory.
7. Run `npm start` in the "app" directory.
8. Run `npm start` in the "auth-server" directory.
9. Open browser to [http://localhost:8080/](http://localhost:8080/)

<hr>





