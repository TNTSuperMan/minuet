CREATE TABLE IF NOT EXISTS news (
  id INTEGER PRIMARY KEY,
  stamp    TEXT NOT NULL,
  headline TEXT NOT NULL,
  url      TEXT NOT NULL,
  image    TEXT NOT NULL,
  copy     TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY,
  name TEXT UNIQUE COLLATE NOCASE NOT NULL,
  birth_month INTEGER NOT NULL,
  birth_year  INTEGER NOT NULL,
  scratchteam INTEGER NOT NULL,
  email    TEXT NOT NULL,
  password TEXT NOT NULL,
  gender   TEXT NOT NULL,
  joined   INTEGER NOT NULL,
  status   TEXT NOT NULL,
  bio      TEXT NOT NULL,
  country  TEXT NOT NULL,
  icon     BLOB
);

CREATE TABLE IF NOT EXISTS projects (
  id INTEGER PRIMARY KEY,
  author INTEGER NOT NULL,

  created INTEGER NOT NULL,
  modified INTEGER NOT NULL,
  shared INTEGER,

  title TEXT NOT NULL,
  description TEXT NOT NULL,
  instructions TEXT NOT NULL,

  comments_allowed INTEGER NOT NULL,
  public INTEGER NOT NULL,
  thumbnail BLOB,
  parent INTEGER,

  json TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS assets (
  hash BLOB PRIMARY KEY,
  type TEXT NOT NULL,
  content BLOB NOT NULL
);
