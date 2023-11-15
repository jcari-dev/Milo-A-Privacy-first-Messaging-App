from rest_framework import serializers
from .models import ExtendedUser
import re
from django.contrib.auth.hashers import make_password


class ExtendedUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = ExtendedUser
        fields = ['username', 'email', 'verification_token', 'password',
                  'token_timestamp', 'is_active']

    def validate_password(self, value):
        validate_password(value)
        # Hash the password
        return make_password(value)

    def validate_email(self, value):
        validate_email(value)
        return value

    def create(self, validated_data):
        # Create a new user instance with the hashed password
        return ExtendedUser.objects.create(**validated_data)


def validate_password(password):
    if len(password) < 8:
        raise serializers.ValidationError(
            "Password must be at least 8 characters long.")

    if not re.findall('[A-Z]', password):
        raise serializers.ValidationError(
            "Password must contain at least one uppercase letter.")

    if not re.findall('[a-z]', password):
        raise serializers.ValidationError(
            "Password must contain at least one lowercase letter.")

    if not re.findall('[!@#$%^&*()-_+=<>?]', password):
        raise serializers.ValidationError(
            "Password must contain at least one special character.")


def validate_email(email):
    if ExtendedUser.objects.filter(email=email).exists():
        raise serializers.ValidationError(
            "Email is already taken."
        )


def validate_username(username):
    username = username.lower()
    username_length = len(username)

    if username_length < 3:
        if username_length > 15:
            raise serializers.ValidationError(
                "Username must not be longer than 15 characters."
            )
        raise serializers.ValidationError(
            "Username must be at least 3 characters long."
        )
    if ExtendedUser.objects.filter(username=username).exists():
        raise serializers.ValidationError(
            "Username is already taken."
        )
    if username.isdigit():
        raise serializers.ValidationError(
            "Username can't be all numeric."
        )
    # This pattern allows only letters, numbers, hyphens, and underscores.
    pattern = r'^[a-zA-Z0-9-_]+$'
    if not re.match(pattern, username):
        raise serializers.ValidationError(
            "Username should only contain alphanumeric, -, _ characters."
        )


class RegistrationFormData(serializers.Serializer):
    username = serializers.CharField(max_length=30, required=False)
    email = serializers.EmailField(required=False)
    password = serializers.CharField(max_length=30, required=False)

    def validate_password(self, value):
        # Only validate if the password is provided in the request
        if value:
            validate_password(value)
        return value

    def validate_username(self, value):
        # Only validate if the username is provided in the request
        if value:
            validate_username(value)
        return value

    def validate(self, data):
        # Check if at least one field is provided
        if not any(data.values()):
            raise serializers.ValidationError(
                "At least one field must be provided.")
        return data


class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField()
