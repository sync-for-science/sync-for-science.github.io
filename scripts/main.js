$(function () {
	var $button = $('<a href="#" class="pull-right">make request</a>');

  function parseHttpRequest(string) {
    var HEADER_FORMAT = /^(GET|POST) (.+) HTTP\/1.1$/;
    var PART_FORMAT = /^(\S+): (.+)$/;
    var parts = string.trim('\n').split('\n');
    var header = parts.shift().match(HEADER_FORMAT);
    var fields = {}

    parts.forEach(function (part) {
      var match = part.match(PART_FORMAT);
      fields[match[1]] = match[2];
    });

    return {
      'url': 'https://' + fields['Host'] + header[2],
      'method': header[1],
      'headers': {
        'Accept': fields['Accept']
      }
    };
  }

  $('code.language-HTTP').each(function (index, element) {
    var $el = $(element);
    var $parent = $el.closest('pre');
    var $toggle = $button.clone();
    var $header = $parent.prev('h6');

    // Highlight HTTP
    hljs.highlightBlock(element);

    // Only toggle elements that are preceded by an h6
    if ($header.length < 1) {
      return;
    }

    // Allow users to modify the request
    $el.prop('contenteditable', true);

    // Add the toggle button
    $header.prepend($toggle);

    // Add the make request behavior
    $toggle.on('click', function (event) {
      // Don't follow the link
      event.preventDefault();

      var $canvas = $parent.next().next();
      $canvas.html('Loading...');

      // Make the request
      $.ajax(parseHttpRequest($el.text()))
      .done(function (data) {
        // Render it all pretty
        var $code = $('<code />').text(JSON.stringify(data, null, 4));

        $canvas.html($code);
        hljs.highlightBlock($code.get(0));
      })
      .fail(function (jqXHR, textStatus, errorThrown) {
        $canvas.html(textStatus + ': ' + errorThrown);
      });
    });
  });
});
