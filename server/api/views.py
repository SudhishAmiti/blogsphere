# api/views.py

from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.reverse import reverse



@api_view(['GET'])
def api_root(request, format=None):
    """
    API root endpoint providing links to the main API endpoints.
    """
    return Response({
        'auth': {
            'login': reverse('token_obtain_pair', request=request, format=format),
            'refresh': reverse('token_refresh', request=request, format=format),
            'register': reverse('register', request=request, format=format),
            'logout': reverse('logout', request=request, format=format),
            'user': reverse('user_details', request=request, format=format),
        },
        'blog': {
            'posts': reverse('blogpost-list', request=request, format=format),
            'comments': reverse('comment-list', request=request, format=format),
        }
    })