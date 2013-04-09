(($) ->
	$ ->
		$('.flip-box').click(->
			if not $(this).hasClass('inactive')
				$(this).flipBoxFlip()
		)
)(jQuery)
