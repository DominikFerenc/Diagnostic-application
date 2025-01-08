from django.db import models

class Device (models.Model):
    name = models.CharField(max_length=100)
    ip_address = models.GenericIPAddressField
    added_by = models.ForeignKey('auth.user', on_delete=models.CASCADE)
    added_at = models.DateTimeField(auto_now_add=True)


    def __str__(self):
        return f"{self.name} ({self.ip_address})"
