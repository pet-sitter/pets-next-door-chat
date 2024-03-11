package database

import (
	"context"
	"database/sql"
	"fmt"
	"log"
	"time"
)

func init() {
	host = "db"
	port = "5455"
	user = "postgres"
	password = "postgres"
	dbname = "pets_next_door_chat_demo"
}

// Database settings
var (
	host     string
	port     string
	user     string
	password string
	dbname   string
)

func DatabaseConnection() (*sql.DB, error) {
	dsn := fmt.Sprintf("host=%s port=%s user=%s password=%s dbname=%s sslmode=disable TimeZone=Asia/Shanghai", host, port, user, password, dbname)

	db, err := sql.Open("postgres", dsn)
	if err != nil {
		log.Fatal("Failed to connect to database. \n", err)
	}

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	err = db.PingContext(ctx)
	if err != nil {
		return nil, err
	}
	return db, nil
}
