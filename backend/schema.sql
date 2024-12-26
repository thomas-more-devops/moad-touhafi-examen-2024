-- Create the database
CREATE DATABASE IF NOT EXISTS eurosong;
USE eurosong;

-- Create artists table
CREATE TABLE artists (
    artist_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL
);

-- Create songs table
CREATE TABLE songs (
    song_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    artist_id INT,
    FOREIGN KEY (artist_id) REFERENCES artists(artist_id)
);

-- Create votes table
CREATE TABLE votes (
    vote_id INT PRIMARY KEY AUTO_INCREMENT,
    song_id INT,
    points INT NOT NULL,
    FOREIGN KEY (song_id) REFERENCES songs(song_id)
);

-- Insert some sample data
INSERT INTO artists (name) VALUES 
    ('Duncan Laurence'),
    ('Loreen'),
    ('Netta');

INSERT INTO songs (name, artist_id) VALUES 
    ('Arcade', 1),
    ('Tattoo', 2),
    ('Toy', 3);

INSERT INTO votes (song_id, points) VALUES 
    (1, 12),
    (2, 10),
    (3, 8);
