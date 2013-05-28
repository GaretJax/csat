class Viewport
    ###
    An area of the renderer element which can be drawn independently. Uses
    the same global scene with independent cameras.
    ###
    constructor: (params) ->
        {@x, @y, @width, @height, @camera, @controls} = params
        this.camera.position.z = 90

    prepareScene: (scene) ->
        this.camera.lookAt(scene.position)

    prepareRenderer: (renderer, width, height) ->
        x = Math.floor(width * this.x)
        y = Math.floor(height * this.y)
        w = Math.floor(width * this.width)
        h = Math.floor(height * this.height)
        this.camera.aspect = w / h
        renderer.setViewport(x, y, w, h)
        renderer.setScissor(x, y, w, h)
        renderer.enableScissorTest(true)


class RotatingViewport extends Viewport
    constructor: (params) ->
        {@radius, @speed, @axis} = params
        this.phi = 0
        super

    prepareRenderer: (renderer) ->
        #renderer.setClearColor(new THREE.Color(0xffffcc))
        super

    prepareScene: (scene) ->
        this.phi += this.speed

        if @axis == 'x'
            this.camera.position.x = this.radius * Math.sin(this.phi * Math.PI / 360)
            this.camera.position.z = this.radius * Math.cos(this.phi * Math.PI / 360)
        else if @axis == 'z'
            this.camera.position.y = this.radius * Math.sin(this.phi * Math.PI / 360)
            this.camera.position.z = this.radius * Math.cos(this.phi * Math.PI / 360)
        else if @axis == 'y'
            this.camera.rotation.x = this.phi
        super(scene)


class MultipleViewportsRenderer
    constructor: (@container, @scene, @viewports) ->
        this.renderer = new THREE.WebGLRenderer({
            antialias: true,
        })
        this.container.append(this.renderer.domElement)

        this.stats = new Stats()
        this.stats.setMode(1)
        this.stats.domElement.style.position = 'absolute'
        this.stats.domElement.style.left = '0px'
        this.stats.domElement.style.top = '0px'
        $(this.stats.domElement).appendTo(this.container)

    render: ->
        [width, height] = [this.container.width(), this.container.height()]

        this.renderer.setSize(width, height)

        width *= window.devicePixelRatio
        height *= window.devicePixelRatio

        for viewport in this.viewports
            viewport.camera.updateProjectionMatrix()
            viewport.prepareScene(this.scene)
            viewport.prepareRenderer(this.renderer, width, height)
            this.renderer.render(this.scene, viewport.camera)
            if viewport.controls?
                viewport.controls.update()

    animate: ->
        animate = =>
            requestAnimationFrame(animate)
            this.render()
            this.stats.update()
        animate()
