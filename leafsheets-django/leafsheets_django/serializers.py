"""

--- LeafSheets ---

Serialzers

Created on Wednesday, Jan 29, 2019
~ satyameva_jayate
"""

# Imports 

from rest_framework import serializers

# Serializers

class UploadFileSerializer(serializers.Serializer):
    
    model = serializers.CharField(max_length=100)
    field = serializers.CharField(max_length=100)
    id    = serializers.IntegerField()
    file  = serializers.FileField()