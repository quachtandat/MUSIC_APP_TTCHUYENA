CREATE DATABASE APP_MUSIC;

CREATE TABLE Users (
    UserID INT PRIMARY KEY IDENTITY(1,1) ,
    Username VARCHAR(255) UNIQUE NOT NULL,
    Password VARCHAR(255) NOT NULL,
    FullName VARCHAR(255),
    Email VARCHAR(255) UNIQUE
);

CREATE TABLE Songs (
    SongID INT PRIMARY KEY IDENTITY(1,1),
    Title VARCHAR(255) NOT NULL,
    Artist VARCHAR(255),
    Author VARCHAR(255),
    FilePath VARCHAR(255) NOT NULL
);

CREATE TABLE Playlist (
    PlaylistID INT PRIMARY KEY IDENTITY(1,1),
    UserID INT,
    PlaylistName VARCHAR(255),
    SongID INT,
    FOREIGN KEY (UserID) REFERENCES Users(UserID),
    FOREIGN KEY (SongID) REFERENCES Songs(SongID)
);

CREATE TABLE User_Songs (
    UserID INT,
    SongID INT,
    PRIMARY KEY (UserID, SongID),
    FOREIGN KEY (UserID) REFERENCES Users(UserID),
    FOREIGN KEY (SongID) REFERENCES Songs(SongID)
);