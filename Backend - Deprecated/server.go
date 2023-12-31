package main

import (
	"context"
	"fmt"
	"log"
	"milo/handlers"
	"net/http"
	"os"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
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
	errEnv := godotenv.Load() // Load .env file
	if errEnv != nil {
		log.Fatal("Error loading .env file")
	}

	client := connectDB()

	if client != nil {
		log.Println("MongoDB Connected")
	}
	collection := client.Database("testDB2").Collection("users")

	// Index Models
	indexes := []mongo.IndexModel{
		{Keys: map[string]interface{}{"_id": 1}},
		{Keys: map[string]interface{}{"username": 1}},
		{Keys: map[string]interface{}{"password": 1}},
		{Keys: map[string]interface{}{"active": 1}},
		{Keys: map[string]interface{}{"token": 1}},
		{Keys: map[string]interface{}{"tokents": 1}},
	}

	// Create indexes
	_, err := collection.Indexes().CreateMany(context.TODO(), indexes)
	if err != nil {
		log.Fatal("Could not create index:", err)
	}

	r := gin.Default()
	r.LoadHTMLGlob("templates/*")
	r.Static("/images", "./images")
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

	// Login route
	r.POST("/authenticate", func(c *gin.Context) {
		handlers.AuthenticateHandler(c, collection)
	})

	r.GET("/verify/:token", func(c *gin.Context) {
		handlers.VerifyHandler(c, collection)

	})
	// Currently using reCaptcha in this route, that needs to be reworked.
	// r.POST("/verify", func(c *gin.Context) {
	// 	handlers.Verify(c)

	// })

	r.POST("/session", func(c *gin.Context) {
		fmt.Println(os.Getwd())
		handlers.GenerateSessionURL()
	})

	r.POST("/validate", func(c *gin.Context) {
		handlers.Validate(c)

	})

	r.Run(":8080")
}
