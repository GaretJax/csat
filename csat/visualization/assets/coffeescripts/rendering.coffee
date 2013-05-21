class NodeView
    constructor: (@node) ->
        this.position = new THREE.Vector3(0, 0, 0)
        this.force = new THREE.Vector3(0, 0, 0)
        size = .5
        radius = 40
        resolution = Math.floor(Math.sqrt(size) * 10)
        material = new THREE.MeshLambertMaterial({
            color: 0xffffff * Math.random()
        })
        this.geometry = new THREE.SphereGeometry(size, resolution, resolution, false)
        this.vertexMesh = new THREE.Mesh(this.geometry, material)
        this.vertexMesh.position = this.position
        this.vertexMesh.matrixAutoUpdate = false

        #this.forceMesh = new THREE.ArrowHelper(
        #    this.force.normalize(),
        #    this.position,
        #    this.force.length() * .5,
        #    material.color,
        #)
        #this.mesh = new THREE.Object3D()
        #this.mesh.matrixAutoUpdate = false
        #this.mesh.add(this.forceMesh)
        #this.mesh.add(this.vertexMesh)
        this.mesh = this.vertexMesh

    getMesh: ->
        return this.mesh

    update: ->
        this.mesh.position = this.position
        this.mesh.updateMatrix()
        #this.vertexMesh.
        #this.forceMesh.setLength(this.force.length() * 0.2)
        #this.forceMesh.setDirection(this.force.normalize())


class EdgeView
    @material: new THREE.LineBasicMaterial({
        color: 0x999999,
        opacity: 1,
        linewidth: 1,
    })

    constructor: (@edge, @src, @dst) ->
        seg = new THREE.Geometry(5)
        seg.vertices.push(this.src.position)
        seg.vertices.push(this.dst.position)
        this.mesh = new THREE.Line(seg, EdgeView.material)

    getMesh: ->
        return this.mesh

    update: ->
        this.mesh.geometry.vertices[0] = this.src.position
        this.mesh.geometry.vertices[1] = this.dst.position
        this.mesh.geometry.verticesNeedUpdate = true


class GraphRenderer
    constructor: (@model, @layout) ->
        this.edgeViews = []
        this.nodeViews = []

    draw: (scene) ->
        geo2line = (geo) ->
            geometry = new THREE.Geometry()
            vertices = geometry.vertices

            for i in [0..geo.faces.length]
                face = geo.faces[i]
                if face instanceof THREE.Face3
                    a = geo.vertices[ face.a ].clone()
                    b = geo.vertices[ face.b ].clone()
                    c = geo.vertices[ face.c ].clone()
                    vertices.push(a, b, b, c, c, a)
                else if face instanceof THREE.Face4
                    a = geo.vertices[ face.a ].clone()
                    b = geo.vertices[ face.b ].clone()
                    c = geo.vertices[ face.c ].clone()
                    d = geo.vertices[ face.d ].clone()
                    vertices.push( a,b, b,c, c,d, d,a )

            geometry.computeLineDistances()
            return geometry

        cubeGeometry = new THREE.CubeGeometry(50, 50, 50 )
        sphereGeometry = new THREE.SphereGeometry(50, 20, 20)

        dashMaterial = new THREE.LineBasicMaterial({
            color: 0x000000,
            opacity: .3,
            dashSize: .2,
            gapSize: 1,
        })
        lambertMaterial = new THREE.MeshLambertMaterial({
            color: 0xffffff * Math.random(),
        })
        wireframe = new THREE.Line(geo2line(sphereGeometry), dashMaterial,
                                   THREE.LinePieces)
        sphere = new THREE.Mesh(sphereGeometry, lambertMaterial)
        wireframe.position.set(0, 0, 0)
        sphere.position.set(0, 0, 0)
        #scene.add(wireframe)
        nodeViewsMap = []
        this.nodes = new THREE.Object3D()
        for domain in this.model.domains
            nodeViewsMap[domain.id] = dl = []
            for node in domain.nodes
                view = new NodeView(node)
                this.nodeViews.push(view)
                dl[node.id] = view
                this.nodes.add(view.getMesh())

        this.edges = new THREE.Object3D()

        for edge in this.model.edges
            src = nodeViewsMap[edge.src.fqid[0]][edge.src.fqid[1]]
            dst = nodeViewsMap[edge.dst.fqid[0]][edge.dst.fqid[1]]
            view = new EdgeView(edge, src, dst)
            this.edgeViews.push(view)
            this.edges.add(view.getMesh())

        scene.add(this.nodes)
        scene.add(this.edges)

        console.log scene

    runLayoutStep: ->
        this.layout.runStep(this.nodeViews, this.edgeViews, =>
            for node in this.nodeViews
                node.update()
            for edge in this.edgeViews
                edge.update()
        )

    runLayout: ->
        this.layout.run(this.nodeViews, this.edgeViews, =>
            for node in this.nodeViews
                node.update()
            for edge in this.edgeViews
                edge.update()
        )

    pauseLayout: ->
        this.layout.stop()

    resetLayout: ->
        this.layout.reset()

    isLayoutRunning: ->
        return this.layout._running
