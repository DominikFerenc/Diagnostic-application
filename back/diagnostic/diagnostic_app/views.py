import json

from django.contrib.auth import authenticate, login
from django.contrib.auth.models import User
from django.http import JsonResponse
from django.shortcuts import render
from django.views.decorators.csrf import csrf_protect
from django.views.decorators.http import require_POST
from requests import Response
from .serializers import DeviceSerializer
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from drf_yasg.utils import swagger_auto_schema



class AddDevice(APIView):
    permission_classes = [IsAuthenticated]

    @swagger_auto_schema(request_body=DeviceSerializer)
    def post(self, request):
        serializer = DeviceSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(added_by=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



def register_user(request):
    if request.method == "POST":
        data = json.loads(request.body)
        username = data.get("username")
        password = data.get("password")
        email = data.get("email")

        if User.objects.filter(username=username).exists():
            return JsonResponse({"error": "User name already taken"}, status=400)

        user = User.objects.create_user(
            username=username, password=password, email=email
        )
        return JsonResponse({"message": "User create successfully"}, status=201)
    return JsonResponse({"error": "Invalid request"}, status=400)


def login_user(request):
    if request.method == "POST":
        data = json.loads(request.body)
        identifier = data.get("identifier")
        password = data.get("password")

        user = None
        if User.objects.filter(email=identifier).exists():
            user = User.objects.get(email=identifier)
            user = authenticate(username=user.username, password=password)
        else:
            user = authenticate(username=identifier, password=password)

        if user is not None:
            login(request, user)
            return JsonResponse({"token": "some-jwt-token", "username": user.username})
        else:
            return JsonResponse({"error": "Invalid credentials"}, status=401)
    return JsonResponse({"error": "Invalid request"}, status=400)


