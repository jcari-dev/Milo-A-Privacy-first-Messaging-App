package email

import (
	"bytes"
	"log"
	"net/smtp"
	"os"
	"text/template"
)

type TemplateData struct {
	Name string
	URL  string
}

func SendEmail(toEmail string, data *TemplateData) {
	// SMTP Config
	host := "smtp.gmail.com"
	port := "587"
	email := "authenticatemilo@gmail.com"
	password := os.Getenv("EMAIL")

	// Create Template
	tmpl, _ := template.New("email").Parse("Hi {{.Name}},\nClick here to activate your account: {{.URL}}")

	// Parse Template
	var tpl bytes.Buffer
	if err := tmpl.Execute(&tpl, data); err != nil {
		log.Println("Error executing template:", err)
		return
	}
	body := tpl.String()

	// Send Email
	auth := smtp.PlainAuth("", email, password, host)
	to := []string{toEmail}
	msg := []byte("Subject: Activate your account\n" + body)
	if err := smtp.SendMail(host+":"+port, auth, email, to, msg); err != nil {
		log.Println("Error sending email:", err)
	}
}
