(function($) {

  function loadSchemaBySlug(slug) {
    // naming convention requires coordination between schemas.json
    var schemaUrl = './schemas/' + slug + '.schema.json',
        datasetUrl = './schemas/' + slug + '.json';

    JSV.init({
      schema : schemaUrl
    }, function() {
      //display schema version
      JSV.setVersion(tv4.getSchema(schemaUrl).version);
      //handle permalink
      if (window.jsvInitPath) {
        var node = JSV.expandNodePath(window.jsvInitPath.split('-'));

        if (node) {
          try {
            JSV.flashNode(node);
            JSV.clickTitle(node);
          } catch(e) {
            console.log('Error when selecting node', e);
          }
        } else {
          JSV.showError('Could not find node ' + window.jsvInitPath);
        }
      } else {
        JSV.resetViewer();
      }
    });

  //initialize JSV when the pagecontainer is ready
  $('body').one('pagecontainershow', function(event, ui) {
    $.getJSON('./schemas.json', function(schemas) {
      $schemaSelector = $('#schema-selector');

      schemas.forEach(function(option) {
        var $option = $('<option>').attr('value', option.value).text(option.name);
        $schemaSelector.append($option);
      });

      var slug = window.jsvLoadSchemaSlug || schemas[0].value;
      $schemaSelector.val(slug);
      $schemaSelector.selectmenu('refresh');
      loadSchemaBySlug(slug);

      $schemaSelector.on('change', function() {
        window.location.hash = '#s=' + $(this).val();
        window.location.reload();
      });
    })
  });
})(jQuery);
