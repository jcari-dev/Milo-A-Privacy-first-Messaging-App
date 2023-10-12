package main

import (
	"context"
	"log"
	"milo/handlers"
	"net/http"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

func connectDB() *mongo.Client {
	clientOptions := options.Client().ApplyURI("mongodb://localhost:27017")
	client, err := mongo.Connect(context.TODO(), clientOptions)
	if err != nil {
		log.Fatal(err)
	}
	return client
}

func main() {
	client := connectDB()
	collection := client.Database("testDB2").Collection("users")

	r := gin.Default()

	// Add CORS middleware
	r.Use(func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
		c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS, GET, PUT")

		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}

		c.Next()
	})

	r.GET("/", func(c *gin.Context) {
		c.String(http.StatusOK, "Hello, world!")
	})

	r.POST("/register", func(c *gin.Context) {
		handlers.RegisterHandler(c, collection)
	})
	r.POST("/authenticate", func(c *gin.Context) {
		handlers.AuthenticateHandler(c, collection)
	})

	r.GET("/verify/:token", func(c *gin.Context) {
		handlers.VerifyHandler(c, collection)

	})

	r.Run(":8080")
}
