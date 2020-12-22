"""

--- LeafSheets ---

Serializers — Accounts

Created on Wednesday, Oct 2, 2019
~ satyameva_jayate
"""

# Imports

from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.contrib.auth import authenticate

# User

User = get_user_model()

# Serializers

# User Serializer
class UserSerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = ('id', 'email', 'avatar', 'full_name', 'phone', 'position',\
                  'ownership')

# Register Serializers
class RegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'email', 'password')
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = User.objects.create_user(
            validated_data['email'],
            validated_data['password'])
        return user

# Login Serializers
class LoginSerializer(serializers.Serializer):
    email = serializers.CharField()
    password = serializers.CharField()

    def validate(self, data):
        user = authenticate(**data)
        if user and user.is_active:
            return user
        raise serializers.ValidationError("Incorrect Credentials")