from django.db.models import ProtectedError, Q
from django.db.models.functions import Coalesce
from rest_framework import viewsets
from rest_framework.parsers import FormParser, JSONParser, MultiPartParser
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import action

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

    def destroy(self, request, *args, **kwargs):
        product = self.get_object()
        try:
            product.delete()
        except ProtectedError:
            return Response(
                {"detail": "This product has orders linked to it. Archive it or set stock to 0 instead of deleting."},
                status=status.HTTP_409_CONFLICT,
            )
        return Response(status=status.HTTP_204_NO_CONTENT)


class OrderViewSet(viewsets.ModelViewSet):
    queryset = Order.objects.prefetch_related("items").all()
    permission_classes = [AdminTokenForListOrReadCreate]
    http_method_names = ["get", "post", "patch", "delete", "head", "options"]
    parser_classes = [JSONParser, MultiPartParser, FormParser]

    def get_serializer_class(self):
        if self.action == "create":
            return OrderCreateSerializer
        return OrderSerializer

    @action(detail=False, methods=["delete"], url_path="clear")
    def clear(self, request):
        deleted_count, _ = self.get_queryset().delete()
        return Response({"deleted": deleted_count}, status=status.HTTP_200_OK)
