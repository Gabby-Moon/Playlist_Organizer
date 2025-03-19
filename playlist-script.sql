CREATE DATABASE playlist;
USE playlist;

DROP TABLE IF EXISTS songs;

CREATE TABLE songs (
    id INT(5) AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    artist VARCHAR(255) NOT NULL,
    genre VARCHAR(50) NOT NULL,
    playlist VARCHAR(50) NOT NULL,
    timestamp DATETIME DEFAULT NOW()
);

INSERT INTO songs (title, artist, genre, playlist)
VALUES ('Baptized In Fear', 'The Weekend', 'Pop', 'Workout');

