parseIds = (id, onlyLast=false) ->
    tokens = id.split('::')

    if onlyLast
        parseInt(tokens[tokens.length-1].replace(/^n|g|d|e/, ''))
    else
        tokens.map((el) ->
            parseInt(el.replace(/^n|g|d|e/, ''))
        )

class Node
    constructor: (@model, @domain, id, @attributes) ->
        this.fqid = parseIds(id)
        this.id = this.fqid[this.fqid.length - 1]

class Edge
    constructor: (@model, @id, @src, @dst, @attributes) ->

class Domain
    constructor: (@model, id, @attributes) ->
        this.id = parseIds(id, true)
        this.nodes = []

    addNode: (el) ->
        attrs = this.model._getAttributes(el)
        node = new Node(this.model, this, el.attr('id'), attrs)
        this.nodes[node.id] = node
        return node

class GraphModel
    @fromGraphML: (data) ->
        xml = $(data)
        graph = new GraphModel()
        $('graphml > key', xml).each((i) ->
            graph.addAttribute($(this))
        )
        $('graphml > graph > node', xml).each((i) ->
            domain = graph.addDomain($(this))
            $('> graph > node', this).each(->
                domain.addNode($(this))
            )
        )
        $('edge', xml).each(->
            graph.addEdge($(this))
        )
        return graph

    constructor: ->
        this.nextNodeId = 0
        this.nextEdgeId = 0
        this.domains = []
        this.nodes = []
        this.edges = []
        this.attributes = {
            node: {},
            graph: {},
            edge: {},
            all: {},
            _by_id: {},
        }

    _getAttributes: (el) ->
        data = {}
        attrs = this.attributes._by_id
        $('> data', el).each(->
            el = $(this)
            data[attrs[el.attr('key')].name] = el.text()
        )
        return data

    addAttribute: (el) ->
        id = el.attr('id')
        name = el.attr('attr.name')
        type = el.attr('attr.type')
        domain = el.attr('for')
        def = {
            name: name,
            type: type,
            domain: domain,
        }
        this.attributes._by_id[id] = def
        this.attributes[domain][name] = def

    addDomain: (el) ->
        domain = new Domain(this, el.attr('id'), this._getAttributes(el))
        this.domains[domain.id] = domain

    addEdge: (el) ->
        attrs = this._getAttributes(el)
        src = parseIds(el.attr('source'))
        dst = parseIds(el.attr('target'))

        src = this.domains[src[0]].nodes[src[1]]
        dst = this.domains[dst[0]].nodes[dst[1]]

        edge = new Edge(this, '', src, dst, el.attr('id'), attrs)
        this.edges.push(edge)
        return edge

    numNodes: ->
        total = 0
        for d in this.domains
            total += d.nodes.length
        return total
