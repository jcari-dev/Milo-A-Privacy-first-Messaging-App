# views.py
from rest_framework.views import APIView
from rest_framework import status
from rest_framework.response import Response
from django.contrib.auth import authenticate

from api.models import ExtendedUser
from .serializers import ExtendedUserSerializer, RegistrationFormData, LoginSerializer


class ExtendedUserRegistration(APIView):
    def get(self, request, format=None):
        items = ExtendedUser.objects.all()
        serializer = ExtendedUserSerializer(items, many=True)
        return Response(serializer.data)

    def post(self, request, format=None):
        serializer = ExtendedUserSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)


class RegistrationValidation(APIView):
    def post(self, request):
        # Use your serializer to validate the incoming data
        serializer = RegistrationFormData(data=request.data)

        if serializer.is_valid():
            # If the data is valid, you can process it (e.g., save it to the database)
            # For now, let's just return the validated data as a response
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        # If the data is not valid, return the errors
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LoginView(APIView):
    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            user = authenticate(username=serializer.validated_data['username'],
                                password=serializer.validated_data['password'])
            if user is not None:
                # Login successful
                # You can add additional login logic here
                return Response({'message': 'Login successful'}, status=status.HTTP_200_OK)
            else:
                # Login failed
                return Response({'message': 'Invalid username or password'}, status=status.HTTP_401_UNAUTHORIZED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
