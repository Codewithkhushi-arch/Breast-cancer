from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from .models import Appointment
from .forms import AppointmentForm

def about(request):
    """About page with link to schedule appointment"""
    return render(request, 'appointments/about.html')

@login_required
def schedule_appointment(request):
    """Schedule a new appointment"""
    if request.method == 'POST':
        form = AppointmentForm(request.POST)
        if form.is_valid():
            appointment = form.save(commit=False)
            appointment.user = request.user
            appointment.save()
            messages.success(request, 'Appointment scheduled successfully!')
            return redirect('your_schedule')
    else:
        form = AppointmentForm()
    
    return render(request, 'appointments/schedule.html', {'form': form})

@login_required
def your_schedule(request):
    """Display all appointments for the logged-in user"""
    appointments = Appointment.objects.filter(user=request.user)
    return render(request, 'appointments/your_schedule.html', {'appointments': appointments})

@login_required
def update_appointment(request, appointment_id):
    """Update an existing appointment"""
    appointment = get_object_or_404(Appointment, id=appointment_id, user=request.user)
    
    if request.method == 'POST':
        form = AppointmentForm(request.POST, instance=appointment)
        if form.is_valid():
            form.save()
            messages.success(request, 'Appointment updated successfully!')
            return redirect('your_schedule')
    else:
        form = AppointmentForm(instance=appointment)
    
    return render(request, 'appointments/schedule.html', {'form': form, 'appointment': appointment})

@login_required
def cancel_appointment(request, appointment_id):
    """Cancel an appointment"""
    appointment = get_object_or_404(Appointment, id=appointment_id, user=request.user)
    appointment.status = 'Cancelled'
    appointment.save()
    messages.success(request, 'Appointment cancelled successfully!')
    return redirect('your_schedule')