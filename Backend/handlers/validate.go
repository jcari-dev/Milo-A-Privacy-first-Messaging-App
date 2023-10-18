package handlers

import (
	"net/http"
	"strings"
	"unicode"

	"github.com/gin-gonic/gin"
	"github.com/go-playground/validator/v10"
)

type InputValue struct {
	Field string `json:"field"`
	Value string `json:"value"`
}

func passwordValidation(fl validator.FieldLevel) bool {
	password := fl.Field().String()
	hasLower := false
	hasUpper := false
	hasSpecial := false
	specialChars := "!@#$%^&*()-_+=<>?"
	for _, char := range password {
		if unicode.IsLower(char) {
			hasLower = true
		}
		if unicode.IsUpper(char) {
			hasUpper = true
		}
		if strings.ContainsRune(specialChars, char) {
			hasSpecial = true
		}
	}
	return hasLower && hasUpper && hasSpecial
}

func Validate(c *gin.Context) {
	var input InputValue
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	validate := validator.New()
	validate.RegisterValidation("passwordvalidation", passwordValidation)

	if input.Field == "email" {
		if err := validate.Var(input.Value, "required,email"); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid email"})
			return
		}
	} else if input.Field == "username" {
		if err := validate.Var(input.Value, "required"); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid username"})
			return
		}
	} else if input.Field == "password" {
		if err := validate.Var(input.Value, "required,passwordvalidation,min=8"); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid password"})
			return
		}
	} else {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid field"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Validation passed"})
}
