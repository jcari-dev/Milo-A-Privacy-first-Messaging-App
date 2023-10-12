// handlers/verify.go

package handlers

import (
	"context"
	"fmt"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

func VerifyHandler(c *gin.Context, collection *mongo.Collection) {

	token := c.Param("token")
	fmt.Println(token)
	filter := map[string]string{"token": token}

	var result map[string]interface{}
	err := collection.FindOne(context.TODO(), filter).Decode(&result)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"message": "Not Found 404"})
		fmt.Println("Error:", err)
		return
	}

	if result["active"] == true {
		fmt.Println("I was here")
		c.JSON(http.StatusNotFound, gin.H{"message": "Not Found 404"})
		return
	}

	tokenDateTime, _ := result["tokents"].(primitive.DateTime)

	tokenTimestamp := tokenDateTime.Time()

	if time.Since(tokenTimestamp).Minutes() > 15 {

		_, err = collection.DeleteOne(context.TODO(), filter)
		if err != nil {
			fmt.Println("Error:", err)
			return
		}
		c.JSON(http.StatusForbidden, gin.H{"message": "Token Expired."})
		return
	} else {

		update := map[string]interface{}{
			"$set": map[string]interface{}{
				"active": true,
			},
		}

		// Apply the update to the document
		_, err = collection.UpdateOne(context.TODO(), filter, update)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"message": "Internal Server Error"})
			fmt.Println("Error:", err)
			return
		}

		c.JSON(http.StatusOK, gin.H{"message": "User verified"})

	}
}
