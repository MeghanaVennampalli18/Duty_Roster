from .models import *
from .serializers import *
from rest_framework.decorators import api_view
from django.http import HttpResponse,JsonResponse
from rest_framework.response import Response
from rest_framework import status
from json.decoder import JSONDecodeError
import jwt,datetime
from django.shortcuts import render, redirect
from datetime import datetime, timedelta
from datetime import timedelta
from rest_framework.authtoken.serializers import AuthTokenSerializer
from rest_framework.exceptions import AuthenticationFailed



@api_view(['GET'])
def fetch_All(request):
    auth_header = request.headers.get('Authorization')
    if not auth_header:
        raise AuthenticationFailed('unauthenticated')
    token = auth_header.split(' ')[1]
    try:
        payload = jwt.decode(token,settings.SECRET_KEY,algorithms=['HS256'])
    except jwt.ExpiredSignatureError:
        return Response({'error':'token_expired'},status=status.HTTP_401_UNAUTHORIZED)
    except jwt.DecodeError:
        return Response({'error':'token_invalid'},status=status.HTTP_401_UNAUTHORIZED)
    except:
        return Response({'error':'token_invalid'},status=status.HTTP_403_FORBIDDEN)
    user = todoList.objects.filter(user_id = payload['id'])
    serializer = todoSerializer(user,many = True)
    return Response(serializer.data)
    # todos = todoList.objects.all()
    # todoserializer = todoSerializer(todos,many=True)
    # return Response(todoserializer.data)


@api_view(['POST'])
def add_Work(request):
    auth_header = request.headers.get('Authorization')
    if not auth_header:
        raise AuthenticationFailed('unauthenticated')
    token = auth_header.split(' ')[1]
    try:
        payload = jwt.decode(token,settings.SECRET_KEY,algorithms=['HS256'])
    except jwt.ExpiredSignatureError:
        return Response({'error':'token_expired'},status=status.HTTP_401_UNAUTHORIZED)
    except jwt.DecodeError:
        return Response({'error':'token_invalid'},status=status.HTTP_401_UNAUTHORIZED)
    except:
        return Response({'error':'token_invalid'},status=status.HTTP_403_FORBIDDEN)
    try:
        data = request.data
        # token = data.get('token')
        # print(token)
        # payload = jwt.decode(token,settings.SECRET_KEY, algorithms=['HS256'])
        user_id = payload['id']
        data['user_id']=user_id
        serializer = todoSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data,status=status.HTTP_201_CREATED)
        if not serializer.is_valid():
            return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)
    except JSONDecodeError as e:
        return Response({'error':'invalid json', 'details':str(e)},status=status.HTTP_400_BAD_REQUEST)
    
@api_view(['PUT'])
def edit_Work(request,id):
    try:
        todo = todoList.objects.get(pk=id)
    except todoList.DoesNotExist:
        return Response({"message": "Work not found."}, status=status.HTTP_404_NOT_FOUND)
    serializer = todoSerializer(todo, data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_200_OK)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['DELETE'])
def delete_Work(request,id):
    try:
        todo = todoList.objects.get(pk=id)
    except todoList.DoesNotExist:
        return Response({"message": "Work not found."}, status=status.HTTP_404_NOT_FOUND)
    todo.delete()
    return Response(status=status.HTTP_200_OK) 


@api_view(['DELETE'])
def delete_All(request):
    auth_header = request.headers.get('Authorization')
    if not auth_header:
        raise AuthenticationFailed('unauthenticated')
    token = auth_header.split(' ')[1]
    try:
        payload = jwt.decode(token,settings.SECRET_KEY,algorithms=['HS256'])
        print(token)
        print(payload)
    except jwt.ExpiredSignatureError:
        return Response({'error':'token_expired'},status=status.HTTP_401_UNAUTHORIZED)
    except jwt.DecodeError:
        return Response({'error':'token_invalid'},status=status.HTTP_401_UNAUTHORIZED)
    except:
        return Response({'error':'token_invalid'},status=status.HTTP_403_FORBIDDEN)
    
    todoList.objects.filter(user_id = payload['id']).delete()
    return Response(status=status.HTTP_200_OK)
    # except:
    #     return Response({'error':'cannot clear all items'},status=status.HTTP_400_BAD_REQUEST)
    # todo.delete()
    # return Response(status=status.HTTP_200_OK)


@api_view(['POST'])
def register_User(request):
    serializer = RegisterSerializer(data=request.data)
    password = request.data.get('password')
    email = request.data.get('email')
    confirmpassword = request.data.get('confirmpassword')
    if password == confirmpassword:
        if registration.objects.filter(email=email).exists():
            return Response({'user with this email exists'},status=status.HTTP_403_FORBIDDEN)
        else:
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data,status=status.HTTP_201_CREATED)
            if not serializer.is_valid():
                return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)
    else:
        return Response({'password mismatch'},status=status.HTTP_403_FORBIDDEN)    

@api_view(['POST'])
def login_User(request):
    try:
        email = request.data.get('email')
        password = request.data.get('password') 
    except KeyError:
        error_message = {'error': 'Both email and password are required.'}
        return Response(error_message, status=400) 
    user = registration.objects.filter(email=email).first()
    if user is None:
        return Response({'error':'user not found'},status=status.HTTP_401_UNAUTHORIZED) 
    if password!=user.password:
        return Response({'error':'incorrect password'},status=status.HTTP_401_UNAUTHORIZED)
    
    payload = {'id':str(user.register_id),
               'username':user.username, 
               'exp':datetime.utcnow()+timedelta(minutes=60),
               'iat':datetime.utcnow()
               }
    token = jwt.encode(payload,settings.SECRET_KEY,algorithm='HS256')
    response = Response()
    response.data={'jwt': token}
    return response
    # return Response({'user_id': user.register_id}, status=status.HTTP_200_OK)


@api_view(['GET'])
def validate_User(request):
    auth_header = request.headers.get('Authorization')
    if not auth_header:
        raise AuthenticationFailed('unauthenticated')
    token = auth_header.split(' ')[1]
    # token = request.COOKIES.get('jwt')
    # if not token:
    #     raise AuthenticationFailed('unauthenticated')
    try:
        payload = jwt.decode(token,settings.SECRET_KEY,algorithms=['HS256'])
    except jwt.ExpiredSignatureError:
        return Response({'error':'token_expired'},status=status.HTTP_401_UNAUTHORIZED)
    except jwt.DecodeError:
        return Response({'error':'token_invalid'},status=status.HTTP_401_UNAUTHORIZED)
    except:
        return Response({'error':'token_invalid'},status=status.HTTP_403_FORBIDDEN)
    user = registration.objects.filter(username = payload['username'],register_id = payload['id']).first()
    serializer = RegisterSerializer(user)
    return Response(serializer.data)


# def home_Page(request):
#     return render(request, 'home.html', {})


   
    




