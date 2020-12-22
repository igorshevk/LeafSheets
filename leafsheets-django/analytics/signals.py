"""

--- LeafSheets ---

Analytics: Signals

Created on Thursday, June 25, 2020
~ satyameva_jayate
"""

# Imports

from django.dispatch import Signal

# Signals

object_viewed_signal = Signal(providing_args=['instance', 'request'])
