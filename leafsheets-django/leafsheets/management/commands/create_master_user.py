"""

--- Leafsheets ---

Create Superuser

Created on Tuesday, August 11, 2020
~ satyameva_jayate
"""

# Imports


from django.contrib.auth.management.commands import createsuperuser
from django.core.management import CommandError


class Command(createsuperuser.Command):
    help = 'Crate a superuser, and allow password to be provided'

    def add_arguments(self, parser):
        super(Command, self).add_arguments(parser)
        parser.add_argument(
            '--password', dest='password', default=None,
            help='Specifies the password for the superuser.',
        )

    def handle(self, *args, **options):
        password = options.get('password')
        email = options.get('email')

        super(Command, self).handle(*args, **options)

        if password:
            user = self.UserModel._default_manager.get(email=email)
            user.set_password(password)
            user.is_staff = True
            user.save()