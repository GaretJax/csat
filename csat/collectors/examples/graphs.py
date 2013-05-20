import abc
from csat.graphml import builder


def get_graphs():
    for k, v in globals().iteritems():
        if isinstance(v, type) and issubclass(v, Graph) and v is not Graph:
            yield v


def get_graph(key):
    for g in get_graphs():
        if g.key == key:
            return g()
    else:
        raise ValueError('Graph {!r} not found.'.format(key))


class Graph(object):

    __metaclass__ = abc.ABCMeta

    @abc.abstractproperty
    def key(self):
        pass

    @abc.abstractproperty
    def description(self):
        pass

    @abc.abstractmethod
    def build(self):
        pass

    def run(self):
        d = self.build()
        d.write_graphml = d.to_file
        return d


class GraphA(Graph):

    key = 'a'
    description = '1-4 people'

    def build(self):
        doc = builder.GraphMLDocument()
        doc.attr('node', 'domain')
        doc.attr('node', 'email')
        doc.attr('node', 'key1')
        doc.attr('edge', 'nodes')

        root = doc.graph(0)
        people_node = root.node(0, {
            'domain': 'people',
            'key1': 'data1',
        })

        people_domain = people_node.subgraph()

        people_domain.node(1, {
            'email': 'user1@example',
        })
        people_domain.node(2, {
            'email': 'user2@example',
        })
        people_domain.node(3, {
            'email': 'user3@example',
        })
        people_domain.node(4, {
            'email': 'user4@example',
        })

        people_domain.edge(1, 2, {'nodes': 'a1,2'})
        people_domain.edge(2, 3, {'nodes': 'a2,3'})
        people_domain.edge(3, 4, {'nodes': 'a3,4'})
        people_domain.edge(4, 1, {'nodes': 'a4,1'})

        return doc


class GraphB(Graph):
    key = 'b'
    description = '3-6 people'

    def build(self):
        doc = builder.GraphMLDocument()
        doc.attr('node', 'domain')
        doc.attr('node', 'email')
        doc.attr('node', 'key2')
        doc.attr('edge', 'nodes')

        root = doc.graph(0)
        people_node = root.node(0, {
            'domain': 'people',
            'key2': 'data2',
        })

        people_domain = people_node.subgraph()

        people_domain.node(1, {
            'email': 'user3@example',
            'key2': 'data2'
        })
        people_domain.node(2, {
            'email': 'user4@example',
        })
        people_domain.node(3, {
            'email': 'user5@example',
        })
        people_domain.node(4, {
            'email': 'user6@example',
        })

        people_domain.edge(1, 2, {'nodes': 'b3,4'})
        people_domain.edge(2, 3, {'nodes': 'b4,5'})
        people_domain.edge(3, 4, {'nodes': 'b5,6'})
        people_domain.edge(4, 1, {'nodes': 'b6,3'})

        return doc


class GraphC(Graph):
    key = 'c'
    description = 'Peoples + Components'

    def build(self):
        doc = builder.GraphMLDocument()
        doc.attr('node', 'domain')
        doc.attr('node', 'package')
        doc.attr('node', 'email')
        doc.attr('node', 'key2')
        doc.attr('edge', 'nodes')

        root = doc.graph(0)
        people_node = root.node(0, {
            'domain': 'components',
            'key2': 'data2',
        })

        people_domain = people_node.subgraph()

        people_domain.node(1, {
            'package': 'user3@example',
            'key2': 'data2'
        })
        people_domain.node(2, {
            'package': 'user4@example',
        })
        people_domain.node(3, {
            'package': 'user5@example',
        })
        people_domain.node(4, {
            'package': 'user6@example',
        })

        people_domain.edge(1, 2, {'nodes': 'b3,4'})
        people_domain.edge(2, 3, {'nodes': 'b4,5'})
        people_domain.edge(3, 4, {'nodes': 'b5,6'})
        people_domain.edge(4, 1, {'nodes': 'b6,3'})

        people_node = root.node(1, {
            'domain': 'people',
            'key2': 'data2',
        })

        people_domain = people_node.subgraph()

        people_domain.node(3, {
            'email': 'user5@example',
            'key2': 'data3'
        })
        people_domain.node(4, {
            'email': 'user3@example',
            #'key2': 'data3'
        })
        people_domain.node(5, {
            'email': 'user6@example',
            'key2': 'data3'
        })


        people_domain.edge(3, 4, {'nodes': 'b5,6'})


        return doc
