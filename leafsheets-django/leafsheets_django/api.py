"""

--- LeafSheets ---

API

Created on Wednesday, Jan 29, 2019
~ satyameva_jayate
"""

# Imports

from django.contrib.contenttypes.models import ContentType 

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.parsers import FileUploadParser
from rest_framework.status import HTTP_200_OK, HTTP_400_BAD_REQUEST

from leafsheets_django.serializers import UploadFileSerializer

# API

# Upload API
class UploadFileAPI(APIView):

    def put(self, request, *args, **kwargs):
        # Serializer stuff.
        serializer = UploadFileSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        # Get the request data
        data = serializer.validated_data
        model_name = data.get('model')
        field_name = data.get('field')
        file = data.get('file')
        pk = int(data.get('id'))
        # Get the model.
        content_type = ContentType.objects.get(model=model_name) 
        Model = content_type.model_class()
        # Get the instance.
        try:
            instance = Model.objects.get(pk=pk)
            setattr(instance, field_name, file)
            instance.save()
        except Model.DoesNotExist:
            return Response(None, status=HTTP_400_BAD_REQUEST)
        return Response(None, status=HTTP_200_OK)