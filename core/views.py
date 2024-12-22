from django.shortcuts import render
from django.http import JsonResponse
from django.core.mail import send_mail
from django.conf import settings
from django.views.decorators.csrf import ensure_csrf_cookie
from django.views.decorators.http import require_http_methods
from django.middleware.csrf import get_token
from .forms import ContactForm
import json

@ensure_csrf_cookie
def home(request):
    return render(request, 'pages/home.html')

@require_http_methods(["POST"])
def contact(request):
    try:
        data = json.loads(request.body)
        form = ContactForm(data)
        
        if form.is_valid():
            name = form.cleaned_data['name']
            email = form.cleaned_data['email']
            message = form.cleaned_data['message']
            
            try:
                # Email to yourself
                send_mail(
                    subject=f'New Contact Form Submission from {name}',
                    message=f'''
                    Name: {name}
                    Email: {email}
                    Message: {message}
                    ''',
                    from_email=settings.EMAIL_HOST_USER,
                    recipient_list=[settings.EMAIL_HOST_USER],
                    fail_silently=False,
                )
                return JsonResponse({
                    'status': 'success',
                    'message': 'Your message has been sent successfully!'
                })
            except Exception as e:
                return JsonResponse({
                    'status': 'error',
                    'message': 'Failed to send email. Please try again.'
                }, status=500)
        else:
            return JsonResponse({
                'status': 'error',
                'errors': form.errors
            }, status=400)
            
    except json.JSONDecodeError:
        return JsonResponse({
            'status': 'error',
            'message': 'Invalid JSON data'
        }, status=400)
    except Exception as e:
        return JsonResponse({
            'status': 'error',
            'message': str(e)
        }, status=500)