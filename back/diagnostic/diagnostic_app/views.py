import json

from django.contrib.auth import authenticate, login
from django.contrib.auth.models import User
from django.http import HttpResponse, JsonResponse
from django.shortcuts import render
from django.views.decorators.csrf import csrf_protect
from django.views.decorators.http import require_POST
from requests import Response
from django.core import serializers
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from drf_yasg.utils import swagger_auto_schema
from rest_framework_simplejwt.tokens import RefreshToken

from .serializers import DeviceSerializer




class AddDevice(APIView):
    permission_classes = [IsAuthenticated]

    @swagger_auto_schema(request_body=DeviceSerializer)
    def post(self, request):
        serializer = DeviceSerializer(data=request.data)

        if serializer.is_valid():
            device = serializer.save(added_by=request.user)
            serialized_device = serializers.serialize('json', [device])
            return JsonResponse(serialized_device, safe=False, status=status.HTTP_201_CREATED)
        return JsonResponse(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


def register_user(request):
    if request.method == "POST":
        data = json.loads(request.body)
        username = data.get("username")
        password = data.get("password")
        email = data.get("email")

        if User.objects.filter(username=username).exists():
            return JsonResponse({"error": "User name already taken"}, status=400)

        user = User.objects.create_user(username=username, password=password, email=email)
        
        refresh = RefreshToken.for_user(user)
        access_token = str(refresh.access_token)
        
        return JsonResponse({"message": "User created successfully", "token": access_token}, status=201)
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
            refresh = RefreshToken.for_user(user)
            access_token = str(refresh.access_token)
            return JsonResponse({"token": access_token, "username": user.username})
        else:
            return JsonResponse({"error": "Invalid credentials"}, status=401)
    return JsonResponse({"error": "Invalid request"}, status=400)

