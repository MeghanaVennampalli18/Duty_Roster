# Generated by Django 4.2.6 on 2023-10-16 15:02

from django.db import migrations, models
import uuid


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='todoList',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('name', models.CharField(max_length=100)),
                ('work', models.CharField(max_length=500)),
                ('date', models.DateField()),
            ],
        ),
    ]
