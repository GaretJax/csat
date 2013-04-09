$ ->
	$('.available-collectors li').draggable({
		cursor: 'move',
		helper: ->
			$(this).clone(true).addClass('drag-helper')
		revert: 'invalid',
		revertDuration: 200,
		scope: 'collector-config',
		snapMode: 'inner',
		snapTolerance: 50,
	})

	# TODO: Listen on startdrag and make a single droppable <li>
	$('.configured-collectors .collector-config-placeholder').droppable({
		scope: 'collector-config',
		tolerance: 'pointer',
		activeClass: 'visible'
		over: (e, ui) ->
			$(this).addClass('active')
		out: (e, ui) ->
			$(this).removeClass('active')
		drop: (e, ui) ->
			$(this).removeClass('active').before(
				makeCollectorConfig(
					ui.helper.data('form_action')))
	})

	$('.acquisition-session-config .session-save-link').click((e)->
		e.preventDefault()
		url = $(this).attr('href')
		btn = $(this)
			.closest('.acquisition-session-config')
			.find('> .form-actions > .btn-group > *:first-child')
		saveSession(btn).done(->
			window.location = url
		)
	)

	$('.acquisition-session-config .session-save').click(->
		saveSession($(this))
	)

	saveSession = (btn) ->
		btn
			.text('Saving...')
			.attr('disabled', true)
			.next('.dropdown-toggle')
			.attr('disabled', true)

		session = btn.closest('.acquisition-session-config')

		callbacks = []

		mainform = $('> form', session)
		mainspinner = $('<div/>')
			.addClass('loading-overlay hidden')
			.append(makeSpinner())
			.appendTo(mainform)
		show = -> mainspinner.removeClass('hidden')
		setTimeout(show, 0)
	
		callbacks.push($.post(
			mainform.attr('action'),
			mainform.serialize(), (r) ->
				parent = mainform.parent()
				mainform.replaceWith(r)
				mainform = parent.find('> form')
				errors += mainform.find('.control-group.error').size()
		))

		errors = 0

		$('.collector-config form', session).each(->
			form = $(this)

			spinner = $('<div/>')
				.addClass('loading-overlay hidden')
				.append(makeSpinner())
				.insertAfter(form)

			show = -> spinner.removeClass('hidden')
			hide = -> spinner.addClass('hidden')
			remove = -> spinner.remove()
			setTimeout(show, 0)

			callbacks.push($.post(
				form.attr('action'),
				form.serialize(), (r) ->
					parent = form.parent()
					form.replaceWith(r)
					form = parent.find('> form')
					errors += form.find('.control-group.error').size()
					setTimeout(hide, 0)
					setTimeout(remove, 300)
			))
		)
		
		done = $.Deferred()
		deferred_done = =>
			$.when(callbacks...).done(->
				btn.text('Save')
					.attr('disabled', false)
					.next('.dropdown-toggle')
					.attr('disabled', false)
				
				if errors
					done.reject()
				else
					done.resolve()
			)
		# Introduce an artifical minimum time for saving operations in
		# order to let the user notice the visual feedback
		setTimeout(deferred_done, 500)
		return done

makeCollectorConfig = (form_action) ->
	src = $('<li/>')
		.addClass('collector-config flip-panel loading')
		.flipPanel({
			width: 500,
			height: 100,
		})

	front = $('<div/>')
		.addClass('front-panel')
		.append(makeSpinner())
		.appendTo(src)

	$.ajax({
		url: form_action,
	}).done((data) ->
		$('.spinner', src).remove()
		src.removeClass('loading').html(data)
	)

	return src

makeSpinner = ->
	spinner = $('<span/>').addClass('spinner')
	for i in [0...50]
		$('<span/>').appendTo(spinner)
	return spinner

makeRemoveConfirmPrompt = ->
	container = $('<div/>').addClass('confirm-overlay hidden')

	ok = $('<button/>')
		.addClass('btn btn-danger btn-small')
		.text('Remove')
		.click(->
			form = container.prev('form')
			p.remove()
			ok.remove()
			nok.remove()
			makeSpinner().appendTo(container)

			url = form.data('deleteurl')

			if not url
				form.closest('.collector-config').remove()
				return

			val = $('input:hidden[name^="csrfmiddlewaretoken"]', form).val()

			$.post(url, {csrfmiddlewaretoken: val}).done(->
				form.closest('.collector-config').remove()
			).fail(->
				# TODO
				console.log 'Failed to remove component'
			)
		)

	nok = $('<button/>')
		.addClass('btn btn-small')
		.text('Cancel')
		.click(->
			container.remove()
		)

	p = $('<p/>')
		.text('Are you sure you want to remove this collector?')

	container.append($('<div/>').append(p).append(nok).append(ok))

	show = ->
		container.removeClass('hidden')
	setTimeout(show, 0)

	return container


$ ->
	$(document).on('click', '.front-panel .remove', (e) ->
		e.preventDefault()
		makeRemoveConfirmPrompt()
			.insertAfter($(this).closest('form'))
	)

	$(document).on('click', '.front-panel .advanced', (e) ->
		e.preventDefault()
		form = $(this).closest('form')
		form.data('oldvalues', form.serializeArray())
		$(this).closest('.flip-panel').flipPanelOpen()
	)

	$(document).on('click', '.back-panel .form-actions .btn-primary', (e) ->
		e.preventDefault()
		$(this).closest('.flip-panel').flipPanelClose()
	)

	$(document).on('click', '.back-panel .form-actions :not(.btn-primary)', (e) ->
		e.preventDefault()
		$(this).closest('.flip-panel').flipPanelClose()
		form = $(this).closest('form')
		values = form.data('oldvalues')
		$.each(values, (i, val) ->
			form.find("[name^=#{val.name}]").val(val.value)
		)
	)

	$('.collector-config.loading').each(->
		src = $(this)
			.addClass('flip-panel')
			.flipPanel({
				width: 500,
				height: 100,
			})

		front = $('<div/>')
			.addClass('front-panel')
			.append(makeSpinner())
			.appendTo(src)

		$.ajax({
			url: $(this).data('loadurl'),
		}).done((data) ->
			$('.spinner', src).remove()
			src.removeClass('loading').html(data)
		)
	)

$ ->
	if not $('.task').size()
		return

	ws = $.websocket('ws://127.0.0.1:11111/', {
		open: (->
			ws.send('hello')
			ws.send('hello')
			ws.send('hello')
		),
		close: (->
			console.log "close"
		),
		events: {
			say: (->
				console.log "say received"
			)
		}
	})

