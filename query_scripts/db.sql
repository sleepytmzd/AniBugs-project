CREATE DATABASE anime_test;

CREATE SEQUENCE anime_id_seq START 3001;
CREATE TABLE anime(
    id INTEGER DEFAULT nextval('anime_id_seq') PRIMARY KEY,
    romaji_title VARCHAR(100),
    english_title VARCHAR(100),
    description VARCHAR(3000),
    status VARCHAR(15),
    season VARCHAR(20),
    episodes INTEGER,
    duration INTEGER,
    start_date DATE,
    end_date DATE,
    visibility INTEGER,
    imagelink VARCHAR(1000)
);

CREATE SEQUENCE manga_id_seq START 172000;
CREATE TABLE manga(
    id INTEGER DEFAULT nextval('manga_id_seq') PRIMARY KEY,
    romaji_title VARCHAR(100),
    english_title VARCHAR(100),
    description VARCHAR(3000),
    status VARCHAR(15),
    volumes INTEGER,
    chapters INTEGER,
    start_date DATE,
    end_date DATE,
    imagelink VARCHAR(1000)
);

CREATE SEQUENCE character_id_seq START 330000;
CREATE TABLE "character"(
    id INTEGER DEFAULT nextval('character_id_seq') PRIMARY KEY,
    name VARCHAR(80),
    gender VARCHAR(10),
    description VARCHAR(9200),
    imagelink VARCHAR(1000)
);

CREATE SEQUENCE studio_id_seq START 7500;
CREATE TABLE studio(
    id INTEGER DEFAULT nextval('studio_id_seq') PRIMARY KEY,
    name VARCHAR(50)
);

CREATE SEQUENCE user_id_seq START 1001;
CREATE TABLE "user"(
    id INTEGER DEFAULT nextval('user_id_seq') PRIMARY KEY,
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    email VARCHAR(100),
    gender VARCHAR(15),
    joined DATE,
    avatarlink VARCHAR(500)
);


----------------------------------------------------------------------------------------------------------------


CREATE TABLE anime_manga(
    anime_id INTEGER REFERENCES anime(id),
    manga_id INTEGER REFERENCES manga(id),
    PRIMARY KEY (animeID, mangaID)
);

CREATE TABLE anime_character(
    anime_id INTEGER REFERENCES anime(id),
    character_id INTEGER REFERENCES "character"(id),
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
