"""

--- LeafSheets ---

API

Created on Wednesday, Oct 2, 2019
~ satyameva_jayate
"""

# Imports

from rest_framework import serializers
from rest_framework import generics, views, viewsets, permissions
from rest_framework.response import Response
from rest_framework.parsers import FileUploadParser, JSONParser
from rest_framework.status import (
    HTTP_200_OK,
    HTTP_400_BAD_REQUEST,
    HTTP_500_INTERNAL_SERVER_ERROR
    )
from rest_framework.decorators import action

from leafsheets.documents import calc_provided_input_counts
from leafsheets.models import Company, Sheet
from leafsheets.serializers import (
    CompanySerializer,
    SheetSerializer,
    UserSheetReadSerializer,
    UserSheetWriteSerializer,
    )

# API

# Sheets

class SheetListView(generics.ListAPIView):
    permission_classes = [permissions.AllowAny]
    serializer_class = SheetSerializer
    queryset = Sheet.objects.all()

class SheetView(generics.RetrieveAPIView):
    permission_classes = [permissions.AllowAny]
    serializer_class = SheetSerializer
    queryset = Sheet.objects.all()

class UserSheetViewSet(viewsets.ModelViewSet):
    
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = UserSheetReadSerializer

    user_variable_pdf = serializers.SerializerMethodField()

    def get_user_variable_pdf(self, obj):
        return obj.get_pdf_download_url()

    def get_queryset(self):
        return self.request.user.user_sheets.all()

    def perform_create(self, serializer):
        return serializer.save(user=self.request.user)

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(
            instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        if getattr(instance, '_prefetched_objects_cache', None):
            instance._prefetched_objects_cache = {}
        return Response(UserSheetReadSerializer(
                self.request.user.user_sheets,
                many=True).data, status=HTTP_200_OK)

    def perform_update(self, serializer):
        user_variable_dict = serializer.validated_data.get('user_variable_dict', None)
        completed_input_count, completed_required_input_count = calc_provided_input_counts(user_variable_dict)
        serializer.save(completed_input_count=completed_input_count, completed_required_input_count=completed_required_input_count)

    @action(methods=['GET'], detail=True, url_path='generate', url_name='generate_user_sheet')
    def generate(self, request, pk=None):
        instance = self.get_object()
        instance.save_document()
        instance.generate_pdf()
        serializer = self.get_serializer(instance)
        return Response(serializer.data, status=HTTP_200_OK)

# Companies

class CompanyViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = CompanySerializer

    def get_queryset(self):
        return self.request.user.companies.all()

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(
            instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        if getattr(instance, '_prefetched_objects_cache', None):
            instance._prefetched_objects_cache = {}
        return Response(CompanySerializer(
                self.request.user.companies,
                many=True).data, status=HTTP_200_OK)

