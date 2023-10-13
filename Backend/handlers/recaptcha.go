package handlers

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"net/url"

	"github.com/gin-gonic/gin"
)

type ReCaptchaResponse struct {
	Success bool    `json:"success"`
	Score   float64 `json:"score"`
}

func Verify(c *gin.Context) {

	token := c.PostForm("token")
	secretKey := ""

	response, err := http.PostForm("https://www.google.com/recaptcha/api/siteverify",
		url.Values{"secret": {secretKey}, "response": {token}})
	if err != nil {
		fmt.Println("Error verifying call")
	}

	defer response.Body.Close()
	body, err := io.ReadAll(response.Body)
	if err != nil {
		fmt.Println("Something wen't wrong with the body.")

	}

	var captchaResp ReCaptchaResponse
	json.Unmarshal(body, &captchaResp)
	fmt.Println(captchaResp.Score, captchaResp)
	if captchaResp.Score >= 0.5 {
		c.JSON(http.StatusOK, gin.H{"status": "Success"})
	} else {
		c.JSON(http.StatusUnauthorized, gin.H{"status": "Failed"})
	}

}
