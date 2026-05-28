from django.conf import settings
from rest_framework.permissions import BasePermission, SAFE_METHODS


class AdminTokenOrReadOnly(BasePermission):
    def has_permission(self, request, view) -> bool:
        if request.method in SAFE_METHODS:
            return True
        return request.headers.get("X-Admin-Token") == settings.ADMIN_API_TOKEN


class AdminTokenForListOrReadCreate(BasePermission):
    def has_permission(self, request, view) -> bool:
        if request.method == "POST":
            return True
        return request.headers.get("X-Admin-Token") == settings.ADMIN_API_TOKEN
