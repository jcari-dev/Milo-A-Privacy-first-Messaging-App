package handlers

import (
	"context"
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/mongo"
	"golang.org/x/crypto/bcrypt"
)

func AuthenticateHandler(c *gin.Context, collection *mongo.Collection) {

	var user User
	if err := c.ShouldBindJSON(&user); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Bad request"})
		return
	}

	filter := map[string]string{"username": user.Username}

	var result map[string]interface{}
	err := collection.FindOne(context.TODO(), filter).Decode(&result)
	if err != nil {
		log.Fatal(err)
	}

	hashedPasswordStr, _ := result["password"].(string)

	// Convert string to byte slice
	hashedPassword := []byte(hashedPasswordStr)

	// Compare hashed and plain passwords
	err = bcrypt.CompareHashAndPassword(hashedPassword, []byte(user.Password))

	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"message": "Invalid credentials"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Success"})
}
