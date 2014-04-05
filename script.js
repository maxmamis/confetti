$(function () {
	var pgen = new ParticleGenerator($('#container'));
	var shift = false;

	$('body').on('mousedown', function (e) {
		pgen.location(e.pageX, e.pageY);
		pgen.beginEmitting(0, shift);
	});

	$('body').on('mousemove', function (e) {
		pgen.location(e.pageX, e.pageY);
	});

	$('body').on('mouseup', function () {
		pgen.stopEmitting();
	});

	$('body').on('keydown', function (e) {
		if (e.which == 16) {
			shift = true;
			console.log('shift');
		}
	});

	$('body').on('keyup', function (e) {
		if (e.which == 16) {
			shift = false;
		}
	});
});