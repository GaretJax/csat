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


class NodeView
    constructor: (@node) ->
        this.position = new THREE.Vector3(0, 0, 0)
        this.force = new THREE.Vector3(0, 0, 0)
        return

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

    _drawWireframe: (scene) ->
        cubeGeometry = new THREE.CubeGeometry(50, 50, 50)
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
        scene.add(wireframe)

    draw: (scene) ->
        #this._drawWireframe(scene)

        nodeViewsMap = []

        nodesPositions = new THREE.Geometry()
        for domain in this.model.domains
            nodeViewsMap[domain.id] = dl = []
            for node in domain.nodes
                view = new NodeView(node)
                this.nodeViews.push(view)
                dl[node.id] = view
                nodePositions.vertices.push(view.position)

        nodesMaterial = new THREE.ParticleBasicMaterial({
            color: 0xff0000,
            size: 2,
        })

        this.nodes = new THREE.ParticleSystem(nodesPositions, nodesMaterial)

        this.edges = new THREE.Object3D()
        for edge in this.model.edges
            src = nodeViewsMap[edge.src.fqid[0]][edge.src.fqid[1]]
            dst = nodeViewsMap[edge.dst.fqid[0]][edge.dst.fqid[1]]
            view = new EdgeView(edge, src, dst)
            this.edgeViews.push(view)
            this.edges.add(view.getMesh())

        scene.add(this.nodes)
        #scene.add(this.edges)

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


class PartitionedGraphRenderer
    constructor: (@model, @layouts, @partitionsLayout) ->
        this.partitions = []

    draw: (scene) ->
        for partition in this.model.domains
            this.partitions[partition.id] = data = {
                nodeViews: [],
                edgeViews: [],
                nodeMap: [],
                object: new THREE.Object3D(),
            }

            data.object.position = new THREE.Vector3(30 * partition.id, 30 * partition.id, 30 * partition.id)

            for node in partition.nodes
                view = new NodeView(node)
                data.nodeViews.push(view)
                data.nodeMap[node.id] = view
                data.object.add(view.getMesh())

            scene.add(data.object)

        for edge in this.model.edges
            src_partition = edge.src.fqid[0]
            dst_partition = edge.src.fqid[0]

            if src_partition == dst_partition
                partition = this.partitions[src_partition]
                src_view = partition.nodeMap[edge.src.fqid[1]]
                dst_view = partition.nodeMap[edge.dst.fqid[1]]
                if not src_view or not dst_view
                    continue
                view = new EdgeView(edge, src_view, dst_view)
                partition.object.add(view.getMesh())
                partition.edgeViews.push(view)

        nodeViews = []
        edgeViews = []
        for partition in this.partitions
            nodeViews.push(partition.object)
            for opartition in this.partitions
                if partition != opartition
                    edgeViews.push({
                        src: partition.object,
                        dst: opartition.object,
                    })

        for i in [0...100]
            this.partitionsLayout.runStep(nodeViews, edgeViews, ->
            )

    _applyLayout: (func, nodes, edges) ->
        func(nodes, edges, =>
            for node in nodes
                node.update()
            for edge in edges
                edge.update()
        )

    runLayoutStep: ->
        for id in [0...this.partitions.length]
            partition = this.partitions[id]
            layout = this.layouts[id]
            this._applyLayout(layout.runStep.bind(layout), partition.nodeViews,
                partition.edgeViews)

    runLayout: ->
        for id in [0...this.partitions.length]
            partition = this.partitions[id]
            layout = this.layouts[id]
            this._applyLayout(layout.run.bind(layout), partition.nodeViews,
                partition.edgeViews)

    pauseLayout: ->
        for layout in this.layouts
            layout.stop()

    resetLayout: ->
        for layout in this.layouts
            layout.reset()

    isLayoutRunning: ->
        return this.layouts[0]._running
