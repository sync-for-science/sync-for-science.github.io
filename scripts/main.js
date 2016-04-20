$(function () {
	var $button = $('<a class="pull-right">show/hide</a>');

	$('pre').each(function (index, element) {
		var $el = $(element);
		var $code = $el.find('code');
		var $toggle = $button.clone();
		var $header = $el.closest('div').prev('h6');

		// Only toggle elements that are preceded by an h6
		if ($header.length < 1) {
			return;
		}

		$toggle.on('click', function (event) {
			$code.slideToggle();
		});

		$header.prepend($toggle);
		$toggle.trigger('click');
	});
});
