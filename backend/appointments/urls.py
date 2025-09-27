from django.urls import path
from . import views

urlpatterns = [
    path('', views.about, name='about'),
    path('schedule/', views.schedule_appointment, name='schedule'),
    path('your-schedule/', views.your_schedule, name='your_schedule'),
    path('update-appointment/<int:appointment_id>/', views.update_appointment, name='update_appointment'),
    path('cancel-appointment/<int:appointment_id>/', views.cancel_appointment, name='cancel_appointment'),
]