# Breast Cancer Screening Backend

Django backend for breast cancer screening appointment management.

## Features

- User authentication (login/register)
- Appointment scheduling with validation
- View and manage personal appointments
- Update and cancel appointments
- SQLite database
- Bootstrap-styled responsive templates

## Setup

1. Install dependencies:
```bash
pip install -r requirements.txt
```

2. Run migrations:
```bash
python manage.py migrate
```

3. Create superuser (optional):
```bash
python manage.py createsuperuser
```

4. Run development server:
```bash
python manage.py runserver
```

## URLs

- `/` - About page with link to schedule
- `/schedule/` - Schedule new appointment (login required)
- `/your-schedule/` - View all appointments (login required)
- `/update-appointment/<id>/` - Update appointment (login required)
- `/cancel-appointment/<id>/` - Cancel appointment (login required)
- `/login/` - User login
- `/users/register/` - User registration
- `/admin/` - Django admin panel

## Workflow

1. User visits About page
2. Clicks "Schedule Your Screening" button
3. Logs in or registers if not authenticated
4. Fills appointment form and submits
5. Redirected to "Your Schedule" page showing all appointments
6. Can update or cancel appointments from the schedule page