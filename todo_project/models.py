from django.db import models
import uuid
from django.conf import settings


class registration(models.Model):
    register_id = models.UUIDField(primary_key=True,default=uuid.uuid4,editable=False)
    username = models.CharField(max_length=100,blank=False)
    password = models.CharField(max_length=50,blank=False)
    email = models.EmailField(max_length=100,blank=False)

    def __unicode__(self):
        return self.register_id

class todoList(models.Model):
    id = models.UUIDField(primary_key=True,default=uuid.uuid4,editable=False)
    user_id = models.ForeignKey(registration,on_delete=models.CASCADE,default=0)
    work = models.CharField(max_length=500,blank=False)
    date = models.DateField()

    def __unicode__(self):
        return self.id

  

