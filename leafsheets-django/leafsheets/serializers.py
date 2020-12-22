"""

--- LeafSheets ---

Serialzers

Created on Wednesday, Oct 2, 2019
~ satyameva_jayate
"""

# Imports 

from rest_framework import serializers

from leafsheets.models import (
    Company,
    Sheet,
    UserSheet,
    Document
    )

# Helper Validators

def valid_sheet_pk(value):
    try:
        Sheet.objects.get(pk=value)
    except Sheet.DoesNotExist:
        raise serializers.ValidationError('Not a valid PK')

# Serializers

class SheetSerializer(serializers.ModelSerializer):

    use_case = serializers.SerializerMethodField()
    price = serializers.SerializerMethodField()

    class Meta:
        model = Sheet
        fields = '__all__'
        read_only_fields = ('__all__',)

    def get_price(self, obj):
        return obj.item.price
    
    def get_item_id(self, obj):
        return obj.item.pk

    def get_use_case(self, obj):
        return obj.get_use_case_display()
        

class DocSerializer(serializers.ModelSerializer):

    class Meta:
        model = Document
        exclude = ('sheet', 'template_doc', 'variable_doc')
        read_only_fields = ('__all__',)
        depth = 2

class UserSheetReadSerializer(serializers.ModelSerializer):

    sheet = SheetSerializer()

    class Meta:
        model = UserSheet
        exclude = ('user', 'doc')
        read_only_fields = ('__all__',)
        depth = 2

class UserSheetWriteSerializer(serializers.Serializer):
    
    sheet_pk = serializers.CharField(max_length=100, validators=[valid_sheet_pk])  

    def create(self, validated_data):
        user = validated_data['user']
        sheet = Sheet.objects.get(pk=validated_data['sheet_pk'])
        user_sheet = UserSheet.objects.new(
            user=user, sheet=sheet
            )
        return user_sheet

class CompanySerializer(serializers.ModelSerializer):

    icon_url = serializers.SerializerMethodField()

    class Meta:
        model = Company
        read_only_fields = ['created_at', 'updated_at']
        exclude = ('icon',)

    def get_icon_url(self, instance):
        if instance.icon:
            return instance.icon.url
        else:
            return None