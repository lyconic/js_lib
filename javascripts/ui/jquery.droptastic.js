/*
 * Droptastic v0.2
 * Requires jQuery v1.32+
 * Created by Scott Greenfield
 *
 * Copyright 2010, Lyconic, Inc.
 * http://www.lyconic.com/
 *
 * Licensed under the MIT license.
 * http://www.opensource.org/licenses/mit-license.php
 *
 * Visit http://www.lyconic.com/resources/tools/droptastic for support and the most up to date version.
 *
 * Droptastic is a UI layer that replaces the <select> element with something prettier.  When an item is clicked in the droptastic menu, the change event of the hidden <select> element is triggered.
 *
 * Use droptastic like this:
 *
    $('.className').dropTastic({name: 'optionalName'}); //Name is optional and can be a value or a function.
 * 
 */
(function($){
  $.fn.dropTastic = function(options){
    var opt = $.extend({ name: 'default', maxHeight: 0 }, options);
    
    function hideUL () { 
      $('.dropTasticSelectWrapper ul').hide(); 
    }
    
    function bindings () {
      $(document).mousedown(function(e){
        if ($(e.target).parents('.dropTasticSelectWrapper').length === 0) hideUL();  //if clicking outside of the dropdown, hide unordered list
      });
      $.fn.dropTastic.isBound = true;
    }
    
    if (!$.fn.dropTastic.isBound) bindings(); //document-wide bindings done only once

    return this.each(function(index) {
      var select, ulCSS, wrapper, ul, triggerChange, openArrow, selectWidth, span, newWidth;
      
      select = $(this);
      ulCSS = {'width' : select.width()};
      
      if (select.hasClass('dropTasticHidden')) return;
      
      if (typeof opt.name==='function') opt.name = opt.name();
      if (typeof opt.maxHeight==='function') opt.maxHeight = opt.maxHeight();
      
      if (opt.name !== 'default') select.attr('name', opt.name); //if not default, then replace the name with opt.name
      if (opt.maxHeight) ulCSS.maxHeight = opt.maxHeight;
      
      wrapper = select.addClass('dropTasticHidden')
        .wrap('<div class="dropTasticSelectWrapper"></div>')
        .parent();
        //.css({zIndex: 10-index});
        
      wrapper.prepend('<div><span></span><a href="#" class="dropTasticSelectOpen"></a></div><ul></ul>');

      ul = wrapper.find('ul').css(ulCSS).hide();
      
      $('option', this).each(function(i){ //add options
        var li = $('<li><a href="#" data-index="'+ i +'">'+ $(this).html() +'</a></li>');
        ul.append(li);
      });
      
      ul.find('a').click(function(){
        wrapper.find('a.selected').removeClass('selected');
        $(this).addClass('selected');	
        select[0].selectedIndex = $(this).attr('data-index');
        wrapper.attr('data-selected-index',$(this).attr('data-index'));
        wrapper.find('span:first').text($(this).text());
        ul.hide();
        if (triggerChange) select.change();  //trigger change event
        return false;
      });

      ul.find('a:eq('+ this.selectedIndex +')').click(); //trigger click event
      
      triggerChange = true;
      
      wrapper.find('span:first').click(function(){
        wrapper.find('a.dropTasticSelectOpen').click();
      });
      
      openArrow = wrapper.find('a.dropTasticSelectOpen').click(function(){
        if (ul.css('display') == 'none') hideUL();
        if (select.attr('disabled')) return false;
        ul.show();
        return false;
      });
      
      //sets the width of the UI layer to be equal to the width of the actual <select>
      selectWidth = select.outerWidth();
      span = wrapper.find('span:first');
      newWidth = (selectWidth > span.innerWidth()) ? selectWidth + openArrow.outerWidth() : wrapper.width();
      wrapper.css('width',newWidth);
      ul.css('width', newWidth - 2);
      span.css({width:selectWidth});
    });
    
  };
})(jQuery); 