from django.db.models import Q
from django.db.models.functions import Coalesce
from rest_framework import viewsets
from rest_framework.parsers import FormParser, JSONParser, MultiPartParser

from .models import Order, Product
from .permissions import AdminTokenForListOrReadCreate, AdminTokenOrReadOnly
from .serializers import OrderCreateSerializer, OrderSerializer, ProductSerializer


class ProductViewSet(viewsets.ModelViewSet):
    serializer_class = ProductSerializer
    permission_classes = [AdminTokenOrReadOnly]

    def get_queryset(self):
        queryset = Product.objects.prefetch_related("colors", "sizes").all()
        category = self.request.query_params.get("category")
        sale = self.request.query_params.get("sale")
        q = self.request.query_params.get("q")
        sort = self.request.query_params.get("sort")

        if category:
            queryset = queryset.filter(category=category)
        if sale:
            queryset = queryset.filter(sale_price__isnull=False)
        if q:
            queryset = queryset.filter(Q(name__icontains=q) | Q(description__icontains=q))
        if sort == "low":
            queryset = queryset.annotate(effective_price=Coalesce("sale_price", "price")).order_by("effective_price")
        elif sort == "high":
            queryset = queryset.annotate(effective_price=Coalesce("sale_price", "price")).order_by("-effective_price")

        return queryset


class OrderViewSet(viewsets.ModelViewSet):
    queryset = Order.objects.prefetch_related("items").all()
    permission_classes = [AdminTokenForListOrReadCreate]
    http_method_names = ["get", "post", "patch", "head", "options"]
    parser_classes = [JSONParser, MultiPartParser, FormParser]

    def get_serializer_class(self):
        if self.action == "create":
            return OrderCreateSerializer
        return OrderSerializer
