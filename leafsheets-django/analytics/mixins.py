"""

--- LeafSheets ---

Analytics: Mixins

Created on Thursday, June 25, 2020
~ satyameva_jayate
"""

# Import 

from analytics.signals import object_viewed_signal

# Mixin

class ObjectViewedMixin(object):

    def get_context_data(self, *args, **kwargs):
        context = super(ObjectViewedMixin, self).get_context_data(*args, **kwargs)
        request = self.request
        instance = context['object']
        if instance:
            object_viewed_signal.send(instance.__class__, instance=instance, request=request)
        return context