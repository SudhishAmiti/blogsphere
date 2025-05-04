# blog/serializers.py

from rest_framework import serializers
from django.contrib.auth.models import User
from .models import BlogPost, Comment

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name']

class CommentSerializer(serializers.ModelSerializer):
    author = UserSerializer(read_only=True)
    author_id = serializers.IntegerField(write_only=True)
    
    class Meta:
        model = Comment
        fields = ['id', 'post', 'author', 'author_id', 'content', 'created_at']
        read_only_fields = ['id', 'created_at']

class BlogPostListSerializer(serializers.ModelSerializer):
    author = UserSerializer(read_only=True)
    comment_count = serializers.SerializerMethodField()
    
    class Meta:
        model = BlogPost
        fields = ['id', 'title', 'slug', 'author', 'featured_image', 'created_at', 'comment_count']
    
    def get_comment_count(self, obj):
        return obj.comments.count()

class BlogPostDetailSerializer(serializers.ModelSerializer):
    author = UserSerializer(read_only=True)
    comments = CommentSerializer(many=True, read_only=True)
    author_id = serializers.IntegerField(write_only=True, required=False)
    
    class Meta:
        model = BlogPost
        fields = ['id', 'title', 'slug', 'content', 'author', 'author_id', 
                 'featured_image', 'created_at', 'updated_at', 'published', 'comments']
        read_only_fields = ['id', 'created_at', 'updated_at']
    
    def create(self, validated_data):
        author_id = validated_data.pop('author_id', None)
        if author_id:
            validated_data['author_id'] = author_id
        return super().create(validated_data)