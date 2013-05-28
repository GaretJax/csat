class Layout
    constructor: ->
        this.interval = 1
        this._initialized = false
        this._running = false

    run: (@nodeViews, @edgeViews, callback) ->
        this._stop = false
        this._running = true
        if not this._initialized
            this.setup()
            this._initialized = true
        run = =>
            if this._stop
                this._running = false
                return
            this.step()
            callback()
            setTimeout(run, this.interval)
        run()

    stop: ->
        this._stop = true

    runStep: (@nodeViews, @edgeViews, callback) ->
        if not this._initialized
            this.setup()
            this._initialized = true
        this.step()
        callback()

    reset: ->
        this.teardown()
        this._initialized = false

    setup: ->
        # This is called before the first step is executed

    step: ->
        # Implement this method in your layout algorithm

    teardown: ->
        # This is called after the last step has executed


class FruchtermanReingoldLayout extends Layout
    constructor: (params) ->
        {@k, @iterations, @initialTemperature, @radius} = params

    setup: ->
        for v in this.nodeViews
            v.position = new THREE.Vector3(
                (Math.random()-0.5) * 50,
                (Math.random()-0.5) * 50,
                (Math.random()-0.5) * 50,
            )
        this.temperature = this.initialTemperature
        this.currentIteration = this.iterations

    step: ->
        this._calculateForces()
        this._applyPositions()
        this._updateTemperature()

    _calculateForces: ->
        f_r = (d) =>
            -this.k * this.k / d

        f_a = (d) =>
            d * d / this.k

        for v in this.nodeViews
            v._force = new THREE.Vector3(0, 0, 0)
            for u in this.nodeViews
                if u == v
                    continue
                d = v.position.clone().sub(u.position)
                f = f_r(d.length())
                v._force.sub(d.normalize().multiplyScalar(f))

        for e in this.edgeViews
            [u, v] = [e.src, e.dst]
            d = v.position.clone().sub(u.position)
            f = f_a(d.length()) * 2
            f = d.normalize().multiplyScalar(f)
            v._force.sub(f)
            u._force.add(f)

    _applyPositions: ->
        for v in this.nodeViews
            d = Math.min(v._force.length(), this.temperature)
            p = v.position.clone().add(v._force.normalize().multiplyScalar(d))

            # Spherical container
            if p.lengthSq() > this.radius * this.radius
                p.setLength(this.radius)
            # Cubic container
            #[width, height, depth] = [50, 50, 50]
            #p.x = Math.min(width/2, Math.max(-width/2, p.x))
            #p.y = Math.min(height/2, Math.max(-height/2, p.y))
            #p.z = Math.min(depth/2, Math.max(-depth/2, p.z))
            v.position = p

    _updateTemperature: ->
        this.currentIteration -= 1

        A = (this.initialTemperature / Math.pow(this.iterations, 15))

        temp = (iter) ->
            A * Math.pow(iter, 15) + .05

        this.temperature = temp(this.currentIteration)
        #console.log this.temperature
        if this.currentIteration <= 0
            this.stop()
