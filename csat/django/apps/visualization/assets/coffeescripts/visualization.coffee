setup = ->
	[width, height] = [$('.scene').width(), $('.scene').height()]

	scene = new THREE.Scene()
	camera = new THREE.PerspectiveCamera(
		75,
		width / height,
		0.1,
		1000
	)
	renderer = new THREE.WebGLRenderer()
	renderer.setSize(width, height)

	$('.scene').append(renderer.domElement)

	return [scene, camera, renderer]

generateNodes = (n) ->
	material = new THREE.MeshNormalMaterial()
	group = new THREE.Object3D()
	
	minSize = 0.1
	maxSize = 1
	domains = 3
	domainSpread = 10
	domainDistance = 30
	radius = 40
	maxDegree = 3

	nodes = []
	for i in [0...domains]
		nodes[i] = []

	for i in [0...n]
		size = Math.random() * (maxSize - minSize) + minSize
		resolution = Math.floor(Math.sqrt(size) * 10)
		domain = Math.floor(Math.random() * domains)
		offset = Math.random() * domainSpread - domainSpread/2
		posz = domain * domainDistance - (domains-1)/2 * domainDistance + offset
		angle = Math.random() * 360
		distance = Math.sqrt(Math.random()) * radius
		posx = Math.sin(angle) * distance
		posy = Math.cos(angle) * distance

		geometry = new THREE.SphereGeometry(size, resolution, resolution, false)
		mesh = new THREE.Mesh(geometry, material)

		mesh.position.x = posx
		mesh.position.z = posy
		mesh.position.y = posz

		mesh.rotation.x = Math.random()
		mesh.rotation.y = Math.random()

		mesh.matrixAutoUpdate = false
		mesh.updateMatrix()
		group.add(mesh)

		nodes[domain].push(mesh)
	
	makeEdge = (src, dst) ->
		edge_seg = new THREE.Geometry(5)
		edge_seg.vertices.push(src.position)
		edge_seg.vertices.push(dst.position)
		new THREE.Line(
			edge_seg,
			new THREE.LineBasicMaterial({
				color: Math.random() * 0xffffff,
				opacity: .8,
				linewidth: 2,
			})
		)

	for domain in nodes
		for src in domain
			for j in [0...maxDegree]
				prob = Math.random()
				if prob < .25
					# Inside connection
					dst = domain[Math.floor(Math.random() * domain.length)]
					if dst == src
						continue
					group.add(makeEdge(src, dst))
				else if prob < .29
					# Outside connection
					otherdomain_i = Math.floor(Math.random() * domains)
					otherdomain = nodes[otherdomain_i]
					dst = otherdomain[Math.floor(Math.random() * otherdomain.length)]
					if dst == src
						continue
					group.add(makeEdge(src, dst))
				else
					continue

	return group

$ ->
	$('.scene').each(->
		[scene, camera, renderer] = setup()

		mouseX = 0
		mouseY = 0
		width = $('.scene').width()
		height = $('.scene').height()

		nodes = generateNodes(2000)
		scene.add(nodes)

		geometry = new THREE.CubeGeometry(10,10,10)
		material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } )
		cube = new THREE.Mesh( geometry, material )
		#scene.add( cube )

		camera.position.z = 90

		$('body').mousemove((e) ->
			mouseX = event.pageX - width/2
			mouseY = event.pageY - height/2
		)

		animate = ->
			requestAnimationFrame(animate)
			render()

		render = ->
			#camera.position.z += (mouseX * 0.1 - camera.position.z)
			camera.position.y += (mouseY * 0.2 - camera.position.y) * .06
			nodes.rotation.y += 0.005
			camera.lookAt(scene.position)
			renderer.render(scene, camera)

		animate()
	)
