CREATE DATABASE anime_test;

CREATE TABLE anime(
    id INTEGER PRIMARY KEY,
    romaji_title VARCHAR(100),
    english_title VARCHAR(100),
    description VARCHAR(3000),
    status VARCHAR(15),
    season VARCHAR(20),
    episodes INTEGER,
    duration INTEGER,
    start_date DATE,
    end_date DATE,
    visibility INTEGER
);

ALTER TABLE anime 
ADD COLUMN imagelink VARCHAR(1000);

CREATE TABLE manga(
    id INTEGER PRIMARY KEY,
    romaji_title VARCHAR(100),
    english_title VARCHAR(100),
    description VARCHAR(3000),
    status VARCHAR(15),
    volumes INTEGER,
    chapters INTEGER,
    start_date DATE,
    end_date DATE
);

CREATE TABLE "character"(
    id INTEGER PRIMARY KEY,
    name VARCHAR(80),
    gender VARCHAR(10),
    description VARCHAR(9200)
);

CREATE TABLE studio(
    id INTEGER PRIMARY KEY,
    name VARCHAR(50)
);

CREATE SEQUENCE user_id_seq START 1001;

CREATE TABLE "user"(
    id INTEGER DEFAULT nextval('user_id_seq') PRIMARY KEY,
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    email VARCHAR(100),
    gender VARCHAR(15),
    joined DATE
);

ALTER TABLE "user"
ADD COLUMN avatarlink VARCHAR(500);





CREATE TABLE anime_manga(
    anime_id INTEGER REFERENCES anime(id),
    manga_id INTEGER REFERENCES manga(id),
    PRIMARY KEY (animeID, mangaID)
);

CREATE TABLE anime_character(
    anime_id INTEGER REFERENCES anime(id),
    character_id INTEGER REFERENCES character(id),
    PRIMARY KEY (anime_id, character_id)
);

CREATE TABLE anime_studio(
    anime_id INTEGER REFERENCES anime(id),
    studio_id INTEGER REFERENCES studio(id),
    price INTEGER,
    PRIMARY KEY (anime_id, studio_id)
);

CREATE TABLE anime_genre(
    anime_id INTEGER REFERENCES anime(id),
    genre VARCHAR(20),
    PRIMARY KEY (anime_id, genre)
);

CREATE TABLE purchase(
    user_id INTEGER REFERENCES "user"(id),
    anime_id INTEGER REFERENCES anime(id),
    watched BOOLEAN,
    PRIMARY KEY (user_id, anime_id)
);

CREATE TABLE bookmarks(
    user_id INTEGER REFERENCES "user"(id),
    anime_id INTEGER REFERENCES anime(id),
    PRIMARY KEY (user_id, anime_id)
);




SELECT S.id, S."name", A.id, A.romaji_title, A.english_title, SUM(SA.price), COUNT(P.user_id)
FROM studio S JOIN anime_studio SA
ON S.id = SA.studio_id
JOIN anime A
ON SA.anime_id = A.id
JOIN purchase P
ON SA.anime_id = P.anime_id
WHERE S.id = 1
GROUP BY S.id, S."name", A.id, A.romaji_title, A.english_title
ORDER BY A.visibility DESC;

SELECT S."name", A.romaji_title, A.english_title, SA.price
FROM studio S JOIN anime_studio SA
ON S.id = SA.studio_id
JOIN anime A
ON SA.anime_id = A.id
WHERE S.id = 1
ORDER BY A.visibility DESC;