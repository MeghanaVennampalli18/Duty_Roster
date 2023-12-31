# Generated by Django 4.2.3 on 2023-11-01 20:59

from django.db import migrations, models
import uuid


class Migration(migrations.Migration):

    dependencies = [
        ('todo_project', '0002_remove_todolist_name'),
    ]

    operations = [
        migrations.CreateModel(
            name='registration',
            fields=[
                ('register_id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('username', models.CharField(max_length=100)),
                ('password', models.CharField(max_length=50)),
                ('email', models.EmailField(max_length=100)),
            ],
        ),
    ]
