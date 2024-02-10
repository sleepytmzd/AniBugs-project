CREATE DATABASE anime_test;

CREATE SEQUENCE anime_id_seq START 14000;
CREATE TABLE anime(
    id INTEGER DEFAULT nextval('anime_id_seq') PRIMARY KEY,
    romaji_title VARCHAR(200),
    english_title VARCHAR(200),
    description VARCHAR(3000),
    status VARCHAR(15),
    season VARCHAR(20),
    episodes INTEGER,
    duration INTEGER,
    start_date DATE,
    end_date DATE,
    imagelink VARCHAR(1000),
    bannerlink VARCHAR(1000),
    visibility INTEGER
);

CREATE SEQUENCE manga_id_seq START 172000;
CREATE TABLE manga(
    id INTEGER DEFAULT nextval('manga_id_seq') PRIMARY KEY,
    romaji_title VARCHAR(200),
    english_title VARCHAR(200),
    description VARCHAR(3000),
    status VARCHAR(15),
    volumes INTEGER,
    chapters INTEGER,
    start_date DATE,
    end_date DATE,
    imagelink VARCHAR(1000),
    bannerlink VARCHAR(1000)
);

CREATE SEQUENCE character_id_seq START 330000;
CREATE TABLE "character"(
    id INTEGER DEFAULT nextval('character_id_seq') PRIMARY KEY,
    name VARCHAR(80),
    gender VARCHAR(30),
    description VARCHAR(10000),
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

CREATE TABLE forum_post(
    id SERIAL PRIMARY KEY,
    anime_id INTEGER REFERENCES anime(id),
    character_id INTEGER REFERENCES "character"(id),
    title VARCHAR(1000),
    body VARCHAR(100000),
    date_posted DATE,
    topic VARCHAR(20)
);

CREATE TABLE forum_comment(
    id SERIAL PRIMARY KEY,
    post_id INTEGER REFERENCES forum_post(id),
    user_id INTEGER REFERENCES "user"(id),
    body VARCHAR(2000),
    date_commented DATE
);

CREATE TABLE anime_review(
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES "user"(id),
    anime_id INTEGER REFERENCES anime(id),
    rating INTEGER,
    body VARCHAR(5000),
    date_posted DATE
);

CREATE TABLE character_review(
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES "user"(id),
    character_id INTEGER REFERENCES "character"(id),
    rating INTEGER,
    body VARCHAR(5000),
    date_posted DATE
);

CREATE TABLE episode(
    id SERIAL PRIMARY KEY,
    anime_id INTEGER REFERENCES anime(id),
    episode_number INTEGER,
    link VARCHAR(1000)
);

CREATE TABLE episode_comment(
    id SERIAL PRIMARY KEY,
    episode_id INTEGER REFERENCES episode(id),
    body VARCHAR(2000),
    date_commented DATE
);

CREATE TABLE follow(
    user_id INTEGER REFERENCES "user"(id),
    studio_id INTEGER REFERENCES studio(id),
    date_followed DATE,
    PRIMARY KEY (user_id, studio_id)
);

CREATE TABLE anime_manga(
    anime_id INTEGER REFERENCES anime(id),
    manga_id INTEGER REFERENCES manga(id),
    PRIMARY KEY (anime_id, manga_id)
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

DROP TABLE anime_genre;
DROP TABLE anime_manga;
DROP TABLE anime_studio;
DROP TABLE anime_character;
DROP TABLE purchase;
DROP TABLE bookmarks;