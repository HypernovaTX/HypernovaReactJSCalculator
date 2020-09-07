() => {
    while ($('#calc-display').width() > $('#calc-display-outer').width()) {
        $('#calc-display').css('font-size',
            (parseInt($('#calc-display').css('font-size')) - 1).toString() + "px"
        );
        $('#calc-display').width() = $('#calc-display-outer').width();
        console.log('#calc-display.width' + $('#calc-display').width().parseInt());
        console.log('#calc-display-outer.width' + $('#calc-display-outer').width().parseInt());
    }
    if ($('#calc-display').width() < $('#calc-display-outer').width()) {
        $('#calc-display').css('font-size', $('#calc-display-outer').css('font-size'));
    }
}