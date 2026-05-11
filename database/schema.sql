CREATE DATABASE IF NOT EXISTS TodoApp;
CREATE USER IF NOT EXISTS "root"@"localhost" IDENTIFIED BY "1234";
GRANT ALL PRIVILEGES ON TodoApp.* TO "root"@"localhost";

USE TodoApp;

CREATE TABLE IF NOT EXISTS User (
    user_id INT PRIMARY KEY AUTO_INCREMENT, 
    user_name VARCHAR(256) ,
    email VARCHAR(256) NOT NULL,
    password VARCHAR(256) NOT NULL
);

CREATE TABLE IF NOT EXISTS Todos (
    todo_id INT  PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    task_name VARCHAR(256),
    priority ENUM('Later','Normal','Important','Urgent'),
    description TEXT,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN  KEY (user_id) REFERENCES User(user_id)
);