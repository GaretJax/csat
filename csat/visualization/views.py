from django.views.generic import list as list_view, detail, base
from django.views.decorators.csrf import csrf_exempt
from django.http import HttpResponse
from django.shortcuts import get_object_or_404

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

    def post(self, request):
        case = get_object_or_404(models.BenchCase, slug=request.POST['case'])
        iterations = int(request.POST['iterations'])
        session = models.BenchmarkSession.objects.create(
            testcase=case,
            commit=request.POST['commit'],
            data=request.POST['data'],
            iterations=iterations,
            user_agent=request.META['HTTP_USER_AGENT'],
        )

        for t in request.POST.getlist('timings[]'):
            models.BenchmarkTiming.objects.create(session=session, timing=int(t) * 1000/iterations)

        return HttpResponse('')

benchmarks = csrf_exempt(StandaloneRenderingView.as_view())


class ResultsRenderingView(detail.DetailView):
    queryset = models.BenchCase.objects.all()
    context_object_name = 'testcase'
    template_name = 'csat/visualization/benchmark_results.html'

benchmark_results = ResultsRenderingView.as_view()
