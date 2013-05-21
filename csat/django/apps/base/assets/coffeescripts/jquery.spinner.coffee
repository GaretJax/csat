(($) ->
    $.spinner = (ticks=50) ->
        spinner = $('<span/>').addClass('spinner')
        for i in [0...ticks]
            $('<span/>').appendTo(spinner)
        return spinner
)(jQuery)
