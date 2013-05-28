from django.views.generic import list as list_view, detail, base
from . import models


class DatabaseListingView(list_view.ListView):
    template_name = 'csat/visualization/databases/list.html'
    model = models.Graph
    context_object_name = 'graphs'

    def get_context_data(self, **kwargs):
        context = super(DatabaseListingView, self).get_context_data(**kwargs)
        return context

database_list = DatabaseListingView.as_view()


class StandaloneRenderingView(base.TemplateView):
    template_name = 'csat/visualization/viewer.html'

standalone_viewer = StandaloneRenderingView.as_view()


class GraphRenderingView(detail.DetailView):
    template_name = 'csat/visualization/graph.html'
    model = models.Graph
    context_object_name = 'graph'

    def get_context_data(self, **kwargs):
        context = super(GraphRenderingView, self).get_context_data(**kwargs)
        return context

graph = GraphRenderingView.as_view()


class StandaloneRenderingView(base.TemplateView):
    template_name = 'csat/visualization/benchmarks.html'

benchmarks = StandaloneRenderingView.as_view()
