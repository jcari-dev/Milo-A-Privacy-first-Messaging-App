from django.contrib.auth.models import AbstractUser
from django.db import models
import uuid


class ExtendedUser(AbstractUser):
    verification_token = models.UUIDField(default=uuid.uuid4, editable=False)
    token_timestamp = models.DateTimeField(auto_now_add=True)

    # Override the is_active field
    # It will only be true, when the user verifies their email address.
    is_active = models.BooleanField(default=False)
