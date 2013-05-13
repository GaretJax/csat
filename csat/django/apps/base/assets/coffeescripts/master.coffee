(($) ->
	$ ->
		$('.flip-box').click(->
			if not $(this).hasClass('inactive')
				$(this).flipBoxFlip()
		)
		$(':file').filestyle({
			icon: true,
		})
)(jQuery)
