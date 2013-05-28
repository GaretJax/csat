class Viewer
    constructor: (@container) ->
        viewer = this
        $('.sidebar .layout .btn').click(->
            func = viewer[$(this).data('action')]
            func.apply(viewer)
        )
        $('.sidebar .layout .slider').on('slide', ->
            slider = $(this).data('slider')
            if slider
                viewer.graphRenderer.layout.interval = slider.getValue()
        )
        console.log 'New viewer instance created'

    load: (@url) ->
        console.log "Loading graph data from #{url}"
        div = $('<div/>').append($.spinner())
        p = $('<p>Loading graph data...</p>').appendTo(div)
        this._overlay(div)
        $.ajax(
            url: this.url,
            datatType: 'xml',
            progress: (e) ->
                if (e.lengthComputable)
                    pct = (e.loaded / e.total)
                    p.text("Loading graph data, #{Math.round(pct * 100)}% completed...")
                else
                    console.warn('Content Length not reported!')
            success: (data) =>
                p.text('Data received, preparing graph...')
                this._loadFromData(data)
                p.text('Graph creation complete, preparing scene...')
                $('.overlay', this.container).addClass('scene-only')
                this._prepareScene()
        )

    _loadFromData: (data) ->
        this.model = GraphModel.fromGraphML(data)
        domains = this.model.domains.length
        nodes = this.model.numNodes()
        edges = this.model.edges.length
        console.log("Graph loaded: #{domains} domains, #{nodes} nodes, #{edges} edges.")
        $('.sidebar .basic .info-source', this.container).html($('<code/>').text(this.url))
        $('.sidebar .basic .info-domains', this.container).text(domains)
        $('.sidebar .basic .info-nodes', this.container).text(nodes)
        $('.sidebar .basic .info-edges', this.container).text(edges)
        for d in this.model.domains
            this._addDomain(d)

    _prepareScene: ->
        # This is the HTML element which contains the canvas element used by
        # WebGL
        container = $('.viewport', this.container)

        camera = new THREE.PerspectiveCamera(
            1000,
            1,
            0.1,
            1000
        )
        controls = new THREE.OrbitControls(camera, container.get(0))
        controls.userRotateSpeed = -1.0
        controls.userZoomSpeed = -1.0

        # The vieport is a point of view of the scene.
        viewport = new Viewport({
            x: 0, y: 0,
            width: 1, height: 1,
            camera: camera,
            controls: controls,
        })

        # The scene is the drawing board provided by WebGL. It is used by the
        # graph renderer to draw the graph.
        scene = this.scene = new THREE.Scene()
        light = new THREE.DirectionalLight(0xffffff)
        light.position.set(200, 200, 0)
        scene.add(light)

        # The model view offers a view of the graph model by exposing a
        # filtering interface which does not modify the underlying model.
        #modelView = new GraphModelView(this.model)

        # The layout defines how the nodes and edges have to be laid out in
        # the plane (2D) or space (3D). Simply put, defines the positions.
        #layout = new FruchtermanReingoldLayout()
        layouts = []
        for i in this.model.domains
            layouts.push(new FruchtermanReingoldLayout({
                k: 10,
                iterations: 500,
                initialTemperature: 2,
                radius: 400,
            }))

        # The graph rendered is responsible to populate the scene with objects
        # representing the graph nodes and edges by respecting the imposed
        # layout.
        this.graphRenderer = new GraphRenderer(this.model, layouts[0])
        this._graphRenderer = new PartitionedGraphRenderer(this.model, layouts,
            new FruchtermanReingoldLayout({
                k: 10,
                iterations: 500,
                initialTemperature: 6,
                radius: 1500,
            }))
        #60
        #500: 200
        #1000
        #2000
        this.graphRenderer.draw(scene)

        # The viewport renderer takes a scene and actually displays it in the
        # document.
        viewportRenderer = new MultipleViewportsRenderer(
            container, scene, [viewport])

        #graphRenderer.runLayout()
        this.graphRenderer.runLayoutStep()
        viewportRenderer.animate()
        this._overlay()

    _addDomain: (domain) ->
        info = $('<span/>').addClass('muted').text(" — #{domain.nodes.length} nodes")
        $("<li/>")
            .text(domain.attributes.domain)
            .append(info)
            .appendTo($('.domains ul', this.container))

    _overlay: (el, sceneOnly=false) ->
        overlay = $('.overlay', this.container)
        if el?
            if sceneOnly
                overlay.addClass('scene-only')
            else
                overlay.removeClass('scene-only')
            $('> *', overlay).remove()
            overlay.append(el)
            overlay.twostepsShow()
        else
            overlay.twostepsHide(->
                $('*', this).remove()
            )

    toggleRunLayout: ->
        if this.graphRenderer.isLayoutRunning()
            this.graphRenderer.pauseLayout()
        else
            this.graphRenderer.runLayout()

    runLayoutStep: ->
        this.graphRenderer.runLayoutStep()

    resetLayout: ->
        #if this.graphRenderer.isLayoutRunning()
        #    this.graphRenderer.pauseLayout()
        this.graphRenderer.resetLayout()
        this.graphRenderer.runLayoutStep()


(($) ->
    $ ->
        container = $('.graph-viewer')
        if container.size() != 1
            console.error("Incorrect number of graph viewer containers "
                          "found: #{container.size()}")
            return

        viewer = new Viewer(container)
        viewer.load($.urlParam('url'))
)(jQuery)
