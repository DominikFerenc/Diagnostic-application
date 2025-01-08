from .models import Device
from rest_framework import serializers

class DeviceSerializer(serializers.ModelSerializer):
    class Meta: 
        model = Device
        fields = ['id', 'name', 'ip_address', 'added_by'] 
        read_only_fields = ['added_by'] 