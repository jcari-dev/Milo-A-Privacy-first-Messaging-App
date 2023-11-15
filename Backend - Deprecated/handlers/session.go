package handlers

import (
	"encoding/json"
	"fmt"
	"io"
	"log"
	"math/rand"
	"net/http"
	"os"
	"strings"

	"github.com/gin-gonic/gin"
)

type Session struct {
	URL            string `json:"url"`
	Expire         bool   `json:"expire"`
	ExpirationDate string `json:"expiration-date"`
}

type URLData struct {
	Adjectives     []string `json:"adjectives"`
	Animals        []string `json:"animals"`
	Colors         []string `json:"colors"`
	ClothingPieces []string `json:"clothing_pieces"`
	Verbs          []string `json:"verbs"`
	Weather        []string `json:"weather"`
	Places         []string `json:"places"`
	Days           []string `json:"days"`
	FamilyMembers  []string `json:"family_members"`
	Pronouns       []string `json:"pronouns"`
}

func pickRandom(slice []string) string {
	index := rand.Intn(len(slice)) // Generates a random index
	return slice[index]
}

func GenerateSessionURL() string {
	jsonFile, err := os.Open("util/url_generator/url_data.json")

	if err != nil {
		log.Fatal("Unable to load the URL data.json")
	}

	defer jsonFile.Close()

	byteValue, err := io.ReadAll(jsonFile)
	if err != nil {
		log.Fatal("Error reading JSON file:", err)
	}
	// Unmarshal JSON data
	var urlData URLData
	err = json.Unmarshal(byteValue, &urlData)
	if err != nil {
		log.Fatal("Error unmarshalling JSON:", err)

	}

	adjective_1 := pickRandom(urlData.Adjectives)
	adjective_2 := pickRandom(urlData.Adjectives)

	for adjective_1 == adjective_2 {
		adjective_2 = pickRandom(urlData.Adjectives)
	}

	family_member_1 := pickRandom(urlData.FamilyMembers)
	family_member_2 := pickRandom(urlData.FamilyMembers)

	for family_member_1 == family_member_2 {
		family_member_2 = pickRandom(urlData.FamilyMembers)
	}

	var sessionURLBuilder strings.Builder
	sessionURLBuilder.WriteString("session/")
	sessionURLBuilder.WriteString(adjective_1)
	sessionURLBuilder.WriteString("-and-")
	sessionURLBuilder.WriteString(adjective_2)
	sessionURLBuilder.WriteString("-")
	sessionURLBuilder.WriteString(pickRandom(urlData.Colors))
	sessionURLBuilder.WriteString("-")
	sessionURLBuilder.WriteString(pickRandom(urlData.Animals))
	sessionURLBuilder.WriteString("-With-")
	sessionURLBuilder.WriteString(pickRandom(urlData.ClothingPieces))
	sessionURLBuilder.WriteString("-")
	sessionURLBuilder.WriteString(pickRandom(urlData.Verbs))
	sessionURLBuilder.WriteString("-In-")
	sessionURLBuilder.WriteString(pickRandom(urlData.Weather))
	sessionURLBuilder.WriteString("-")
	sessionURLBuilder.WriteString(pickRandom(urlData.Places))
	sessionURLBuilder.WriteString("-On-A-")
	sessionURLBuilder.WriteString(pickRandom(urlData.Days))
	sessionURLBuilder.WriteString("-with-")
	sessionURLBuilder.WriteString(pickRandom(urlData.Pronouns))
	sessionURLBuilder.WriteString("-")
	sessionURLBuilder.WriteString(family_member_1)
	sessionURLBuilder.WriteString("-and-")
	sessionURLBuilder.WriteString(family_member_2)

	sessionURL := strings.ToLower(sessionURLBuilder.String())
	fmt.Println(sessionURL)
	sessionURL = strings.Replace(sessionURL, " ", "-", -1)

	return strings.Replace(sessionURL, " ", "-", -1)
}

func GenerateSessionHandler(c *gin.Context) {
	fmt.Println(os.Getwd())
	url := GenerateSessionURL()
	fmt.Println(url)
	c.JSON(http.StatusOK, gin.H{"session-url": url})

}
