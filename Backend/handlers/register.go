package handlers

import (
	"context"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"go.mongodb.org/mongo-driver/mongo"
	"golang.org/x/crypto/bcrypt"
)

type User struct {
	Email    string    `json:"email"`
	Username string    `json:"username"`
	Password string    `json:"password"`
	Active   bool      `json:"active"`
	Token    string    `json:"token"`
	TokenTS  time.Time `json:"tokents"`
}

func RegisterHandler(c *gin.Context, collection *mongo.Collection) {

	var user User
	if err := c.ShouldBindJSON(&user); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Bad request"})
		return
	}

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(user.Password), bcrypt.DefaultCost)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Could not hash password"})
		return
	}

	user.Password = string(hashedPassword)

	user.Active = false
	user.Token = uuid.New().String()
	user.TokenTS = time.Now()

	_, err = collection.InsertOne(context.TODO(), user)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Could not insert user"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "User registered"})
}
