package utils

import (
	"os"
	"time"

	"github.com/golang-jwt/jwt/v5"
)

func CreateToken(username string) (string, error) {

	expirationTime := time.Now().Add(time.Hour * 24 * 7).Unix()

	claims := &jwt.MapClaims{
		"username": username,
		"exp":      expirationTime,
		"iat":      time.Now().Unix(),
	}

	secretKey := []byte(os.Getenv("JWT_KEY"))
	token := jwt.NewWithClaims(jwt.SigningMethodES256, claims)
	tokenString, err := token.SignedString(secretKey)

	if err != nil {
		return "", err
	}

	return tokenString, nil

}
