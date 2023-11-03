from rest_framework import serializers
from .models import todoList,registration

class todoSerializer(serializers.ModelSerializer):
    class Meta:
        model = todoList
        fields = ['id','work','user_id','date']
class RegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = registration  
        fields = ['register_id','username','password','email']     

class LoginSerializer(serializers.ModelSerializer):
    class Meta:
        model = registration
        fields = ['register_id','email','password']  


