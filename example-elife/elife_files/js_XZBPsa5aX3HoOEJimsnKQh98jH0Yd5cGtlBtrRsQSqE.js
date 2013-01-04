/**
 * Highwire AT Symbol
 *
 * Copyright (c) 2010-2011 Board of Trustees, Leland Stanford Jr. University
 * This software is open-source licensed under the GNU Public License Version 2 or later
 * The full license is available in the LICENSE.TXT file at the root of this repository
 */
(function ($) {
  Drupal.behaviors.myCustomJS = {
    attach: function(context, settings) {
      $('.highwire-markup .em-addr', context).each(function() {
        var replaced = $(this).html().replace('\{at\}','@');
        var replaced = "<a href='mailto:" + replaced + "'>" + replaced + "</a>";
        $(this).html(replaced);
      });
    }
  };
})(jQuery);
;
/**
 * eLife Article References pop up
 *
 * Copyright (c) 2010-2011 Board of Trustees, Leland Stanford Jr. University
 * This software is open-source licensed under the GNU Public License Version 2 or later
 * The full license is available in the LICENSE.TXT file at the root of this repository
 */
(function ($) {
  Drupal.behaviors.eLifeArticleFigures = {
    attach: function(context, settings) {
      // Fit the images to their frame
      $('.elife-fig-slider-img', context).each(function() {
        var $image = $('img', this);
        var size = $(this).height();
        
        if ($image.height() > $image.width()) {
          $image.css('width', size);
        }
        else {
          $image.css('height', size);
        }
      });
      
      // Carousel
      $('.elife-fig-slider-wrapper', context).once('eLifeArticleFiguresSlider', function() {
        var $wrapper = $(this);
        var numItems = $('.elife-fig-slider-secondary', $wrapper).length;
        
        $('.figure-carousel', $wrapper).css('overflow', 'hidden');
        var numPer = 4; // Number of items per carousel-slide
        if (numItems > numPer) {
        
          var scrollTarget;
          var sliderIndex = 1;
          var pages = Math.ceil(numItems / numPer);
          var height = $('.figure-carousel', $wrapper).outerHeight();
          var partHeight = $('.elife-fig-slider-secondary').outerHeight();
          
          $('.figure-carousel-inner-wrapper', $wrapper).prepend('<div class="button-disabled figure-carousel-up"></div>');
          $('.figure-carousel-inner-wrapper', $wrapper).append ('<div class="figure-carousel-down"></div>');
          
          $('.figure-carousel-up, .figure-carousel-down', $wrapper).click(function() {
            
            $('.figure-carousel-down', $wrapper).removeClass('button-disabled');
            $('.figure-carousel-up', $wrapper).removeClass('button-disabled');
            
            if ($(this).hasClass('figure-carousel-down')) {
              sliderIndex++;
            }
            else {
              sliderIndex--;
            }
            
            // Clamp the slide-index and apply disabled class if needed
            if (sliderIndex <= 1) {
              $('.figure-carousel-up', $wrapper).addClass('button-disabled');
              sliderIndex = 1;
            }
            if (sliderIndex >= pages) {
              $('.figure-carousel-down', $wrapper).addClass('button-disabled');
              sliderIndex = pages;
            }
            
            // Set the scroll target
            if ($(this).hasClass('figure-carousel-down')) {
              if (sliderIndex == pages) {
                scrollTarget = 'max';
              }
              else {
                scrollTarget = (height*(sliderIndex-1)) + 'px';
              }
            }
            else {
              if (sliderIndex == 1){
                scrollTarget = '0px';
              }
              else {
                scrollTarget = (height*(sliderIndex-1)) + 'px';
              }
            }
            
            // Move the carousel
            $('.figure-carousel', $wrapper).scrollTo(scrollTarget, 500);
          });
        }
      });
      
      // Image switcher
      $('.fig-inline-img-set', context).each(function() {
        var set = this;
        $('.highwire-markup', set).hide();
        $('.highwire-markup:first', set).show();
        
        $('.elife-fig-slider-img img', set).hover(function() {
          $('.elife-fig-slider-img').removeClass('active-icon');
          $(this).parent().addClass('active-icon');
          $('.highwire-markup', set).hide();
          $('.highwire-markup[data-fragment-nid=' + $(this).data('fragment-nid') + ']', set).show();
        });
        
        $('.elife-fig-slider-img:first', set).addClass('active-icon');
      });
      
      // Anchor triggers for image-switcher
      $('a.xref-fig').click(function() {
        var nid = $(this).data('fragment-nid');
        var $target = $($(this).attr('href'));
        $('.figure-icon-fragment-nid-' + nid).each(function() {
          $(this).trigger('mouseover');
        });
        $(window).scrollTop($target.offset().top - 43);
        return false;
      });
      
      // Colorbox modifications
      $(document).bind('cbox_complete', function(){
        if ($.colorbox.element().hasClass('figure-expand-popup')) {        
          // Disable the current trigger that shows the figure description
          $('#cboxContent #cboxLoadedContent img').unbind('mouseover').unbind('mouseout');
          $('#cboxOverlay').unbind('mouseover');
          
          // Decode the caption as it is in the data attribute and put it in the caption area
          $('#cboxContent #cboxTitle').css('display','none');
          var captionRaw = $.colorbox.element().data('figure-caption');
          var caption = $("<div/>").html(captionRaw).text();
          $('#cboxContent #cboxTitle').html(caption);
          
          var href = $.colorbox.element().attr('href');
          var ppt  = $.colorbox.element().data('powerpoint-url');
          
          $('#cboxContent #cboxCurrent .highwire-cboxfigure-link-wrapper').remove();
          
          var $links = $('<span class="highwire-cboxfigure-link-wrapper"/>');
          
          $links.append('<span class="highwire-cboxfigure-link highwire-cboxfigure-desc first"><a href="##">View caption</a><span> | ');
          $links.append('<span class="highwire-cboxfigure-link highwire-cboxfigure-wind"><a href="' + href + '" target="_blank">Open in new window</a><span> | ');
          $links.append('<span class="highwire-cboxfigure-link highwire-cboxfigure-down"><a href="' + href + '?download=true">Download figure</a><span> | ');
          $links.append('<span class="highwire-cboxfigure-link highwire-cboxfigure-pptd"><a href="' + ppt + '">Powerpoint</a><span>');
          
          $('#cboxContent #cboxCurrent').append($links);
          $('#cboxContent #cboxCurrent').show();
                  
          $('.highwire-cboxfigure-desc a').click(function() {
            $('#cboxContent #cboxTitle').toggle();
          });
        }
      });
      
      $(document).bind('cbox_cleanup', function(){
        $('#cboxContent #cboxTitle').empty();
      });
    }
  };
})(jQuery);

;
/**
 * Copyright (c) 2007-2012 Ariel Flesler - aflesler(at)gmail(dot)com | http://flesler.blogspot.com
 * Dual licensed under MIT and GPL.
 * @author Ariel Flesler
 * @version 1.4.4
 */
;(function($){var h=$.scrollTo=function(a,b,c){$(window).scrollTo(a,b,c)};h.defaults={axis:'xy',duration:parseFloat($.fn.jquery)>=1.3?0:1,limit:true};h.window=function(a){return $(window)._scrollable()};$.fn._scrollable=function(){return this.map(function(){var a=this,isWin=!a.nodeName||$.inArray(a.nodeName.toLowerCase(),['iframe','#document','html','body'])!=-1;if(!isWin)return a;var b=(a.contentWindow||a).document||a.ownerDocument||a;return/webkit/i.test(navigator.userAgent)||b.compatMode=='BackCompat'?b.body:b.documentElement})};$.fn.scrollTo=function(e,f,g){if(typeof f=='object'){g=f;f=0}if(typeof g=='function')g={onAfter:g};if(e=='max')e=9e9;g=$.extend({},h.defaults,g);f=f||g.duration;g.queue=g.queue&&g.axis.length>1;if(g.queue)f/=2;g.offset=both(g.offset);g.over=both(g.over);return this._scrollable().each(function(){if(e==null)return;var d=this,$elem=$(d),targ=e,toff,attr={},win=$elem.is('html,body');switch(typeof targ){case'number':case'string':if(/^([+-]=)?\d+(\.\d+)?(px|%)?$/.test(targ)){targ=both(targ);break}targ=$(targ,this);if(!targ.length)return;case'object':if(targ.is||targ.style)toff=(targ=$(targ)).offset()}$.each(g.axis.split(''),function(i,a){var b=a=='x'?'Left':'Top',pos=b.toLowerCase(),key='scroll'+b,old=d[key],max=h.max(d,a);if(toff){attr[key]=toff[pos]+(win?0:old-$elem.offset()[pos]);if(g.margin){attr[key]-=parseInt(targ.css('margin'+b))||0;attr[key]-=parseInt(targ.css('border'+b+'Width'))||0}attr[key]+=g.offset[pos]||0;if(g.over[pos])attr[key]+=targ[a=='x'?'width':'height']()*g.over[pos]}else{var c=targ[pos];attr[key]=c.slice&&c.slice(-1)=='%'?parseFloat(c)/100*max:c}if(g.limit&&/^\d+$/.test(attr[key]))attr[key]=attr[key]<=0?0:Math.min(attr[key],max);if(!i&&g.queue){if(old!=attr[key])animate(g.onAfterFirst);delete attr[key]}});animate(g.onAfter);function animate(a){$elem.animate(attr,f,g.easing,a&&function(){a.call(this,e,g)})}}).end()};h.max=function(a,b){var c=b=='x'?'Width':'Height',scroll='scroll'+c;if(!$(a).is('html,body'))return a[scroll]-$(a)[c.toLowerCase()]();var d='client'+c,html=a.ownerDocument.documentElement,body=a.ownerDocument.body;return Math.max(html[scroll],body[scroll])-Math.min(html[d],body[d])};function both(a){return typeof a=='object'?a:{top:a,left:a}}})(jQuery);;
/**
 * eLife Article References pop up
 *
 * Copyright (c) 2010-2011 Board of Trustees, Leland Stanford Jr. University
 * This software is open-source licensed under the GNU Public License Version 2 or later
 * The full license is available in the LICENSE.TXT file at the root of this repository
 */
(function ($) {
  Drupal.behaviors.eLifearticleRef = {
    attach: function(context, settings) {
      $('a.xref-bibr', context).each(function() {
        $(this).attr('rel', $(this).attr('href'));
      });

      $('a.xref-bibr').cluetip({
        local: true,
        cursor: 'pointer',
        showTitle: false,
        width: '450px',
        arrows: true,
        hideLocal: false,
        sticky: true, 
        mouseOutClose: 'both',
        closePosition: 'none',
        positionBy: 'topBottom',
        snapToEdge: true, 
        dropShadow: false
      });
    }
  };
})(jQuery);
;
/**
 * Highwire AT Symbol
 *
 * Copyright (c) 2010-2011 Board of Trustees, Leland Stanford Jr. University
 * This software is open-source licensed under the GNU Public License Version 2 or later
 * The full license is available in the LICENSE.TXT file at the root of this repository
 */
(function ($) {
  Drupal.behaviors.highwireTablesMarkupProcessor = {
    attach: function(context, settings) {
      $('a.table-expand-inline', context).each(function() {
        var $caption, captionHTML;
        var self = this;
        var toggle = true;
          
        $(self).click(function() {
          if (toggle) {
            toggle = false;
            $caption = $(self).closest('.table').find('.table-caption');
            captionHTML = $caption.html();
            $caption.load($(this).data('table-url'), function () {
              $(self).html('Collapse Inline');
              Drupal.attachBehaviors($caption);
            });
          }
          else {
            $caption.html(captionHTML);
            toggle = true;
            $(self).html('View Inline');
          }
        });
      });
    }
  };
})(jQuery);
;
(function ($) {
  Drupal.behaviors.elifeRefLinks = {
    attach: function (context, settings) {
      $(function() {
        $('.elife-reflinks-sort-tabs li a', context).click(function() {
          if ($(this).attr('class') == '') {
            sort_by = 'asc'
            sort_by_change = 'desc';
            sortRefLinks.sortBy($(this), sort_by);
            $(this).data('sort', sort_by);
            $(this).parent().addClass(sort_by);
            $(this).parent().removeClass(sort_by_change);
            $(this).addClass(sort_by);
            $(this).removeClass(sort_by_change);
          }
          else {
            if ($(this).hasClass('active')) {
              sort_by = $(this).data('sort');
              sort_by_change = sort_by == 'asc' ? 'desc' : 'asc';
              sortRefLinks.sortBy($(this), sort_by_change);
              $(this).data('sort', sort_by_change);
              $(this).parent().addClass($(this).data('sort'));
              $(this).parent().removeClass(sort_by);
              $(this).addClass(sort_by_change);
              $(this).removeClass(sort_by);
            }
            else {
              sort_by = $(this).data('sort');
              sort_by_change = sort_by == 'asc' ? 'desc' : 'asc';
              sortRefLinks.sortBy($(this), sort_by);
              $(this).data('sort', sort_by);
              $(this).parent().addClass($(this).data('sort'));
              $(this).parent().removeClass(sort_by_change);
              $(this).addClass(sort_by);
              $(this).removeClass(sort_by_change);
            }
          }
          $('.elife-reflinks-sort-tabs span.selected', context).removeClass('selected').addClass('not-selected');
          $(this).parents('span').addClass('selected').removeClass('not-selected');
          $('.elife-reflinks-sort-tabs a.active', context).removeClass('active');
          $('.elife-reflinks-sort-tabs a.previous', context).removeClass('previous');
          $(this).addClass('active');
          $(this).addClass('previous');
        });
      });
      var sortRefLinks = {
        sortBy: function(sortByField, order) {
          var sort_by_field = sortByField.data('ref');
          var data_type = sortByField.data('type');
          $($('.elife-reflinks-links > article').toArray().sort(function(a, b) {
            if (data_type == 'date' || data_type == 'int') {
              var contentA = parseInt($(a).data(sort_by_field));
              var contentB = parseInt($(b).data(sort_by_field));
            }
            else {
              var contentA = $(a).data(sort_by_field);
              var contentB = $(b).data(sort_by_field);
            }
            if (order == 'asc')
              return (contentA < contentB) ? -1 : (contentA > contentB) ? 1 : 0;
            else
              return (contentA > contentB) ? -1 : (contentA < contentB) ? 1 : 0;
          })).appendTo('.elife-reflinks-links');
        },
      };
    }
  };
})(jQuery);
;
jQuery(document).ready(function($) {
  var url = Drupal.settings.elife_article_toolbox.url;
  $('.st_reddit').after('<span class="st-mendeley"><a class="stButton" target="_blank" href="http://www.mendeley.com/import/?' + url + '"><span class="chicklets mendeley">Mendeley</span></a></span>');
  $('.sharethis-wrapper').hide();

  $('.api_button').click(function(){
    $('#api_box').toggle('fast');
    return false;
  });
  $('#cite').click(function() {
    $('#citations_options').toggle('fast');
    $('#cite .icon').toggleClass('open');
    return false;
  });

  $('.share').click(function() {
    $('.sharethis-wrapper').toggle('fast');
    $('.share .icon').toggleClass('open');
    return false;
  });

$('.print').click(function() {
    $('.ctools-collapsible-content').show();
    window.print();
    return false;
  });

$(".article-text-size",this).once('article-text-size-once',function(){
    $('.increaseFont', this).click(function() {
     if ($('.panel-region-main-content').hasClass('text-small')) {
       $('.panel-region-main-content').removeClass('text-small');
       $('.decreaseFont').removeClass('active');
     }
     else {
       $('.panel-region-main-content').removeClass('text-default');
       $('.resetFont').removeClass('active');
     }
     $('.panel-region-main-content').addClass('text-large');
     $(this).addClass('active');
     return false;
  });
  $('.decreaseFont', this).click(function() {
     if ($('.panel-region-main-content').hasClass('text-large')) {
       $('.panel-region-main-content').removeClass('text-large');
       $('.increaseFont').removeClass('active');
     }
     else {
       $('.panel-region-main-content').removeClass('text-default');
       $('.resetFont').removeClass('active');
     }
     $('.panel-region-main-content').addClass('text-small');
     $(this).addClass('active');
     return false;
  });
  $('.resetFont', this).click(function() {
     if ($('.panel-region-main-content').hasClass('text-large')) {
       $('.panel-region-main-content').removeClass('text-large');
       $('.increaseFont').removeClass('active');
     }
     else {
       $('.panel-region-main-content').removeClass('text-small');
       $('.decreaseFont').removeClass('active');
     }
     $('.panel-region-main-content').addClass('text-default');
     $(this).addClass('active');
     return false;
  });


 });
});
;
(function ($) {
  Drupal.behaviors.elifeJumpLinks = {
    attach: function (context, settings) {
      $(function() {
        // Function that opens a section if it's collapsed
        var deCollapse = function($section) {
          if ($('.ctools-toggle.ctools-toggle-collapsed', $section).length) {
            $('.ctools-collapsible-handle', $section).trigger('click');
          }
        };
        
        var linkClicked = function($link) {
          var target_id = $link.attr('href');
          var $section = $(target_id);
          var panelTaget = $link.data('panel-ajax-tab');

          // The "#article" target is special, we always just trigger a click
          if (target_id === '#article') {
            $('a.panels-ajax-tab-tab[data-panel-name="' + panelTaget + '"]').trigger('click');
            $(window).scrollTop($section.offset().top - 43);
            return false;
          }
          else if ($section.length > 0) {
            deCollapse($section);
            $(window).scrollTop($section.offset().top - 43);
            return false;
          }
          else {
            $('a.panels-ajax-tab-tab[data-panel-name="' + panelTaget + '"]').panels_ajax_tabs_trigger(function() {
              $section = $(target_id);
              deCollapse($section);
              $(window).scrollTop($section.offset().top - 43);

              //@@TODO: This is hack until the disqus module stops crapping-out on AJAX
              //@@TOOD: Patch the disqus module properly
              DISQUS.reset({
                reload: true,
                config: function () {  
                  this.page.identifier = Drupal.settings.disqus.identifier;  
                  this.page.url = Drupal.settings.disqus.url + "#!newthread";
                }
              });            
              return false;
            });
          }
        };

        $('a.elife-article-jumplink', context).click(function() {
          linkClicked($(this));
          return false;
        });
        
        // Duplicate the sidebar into the floating region
        var $jumpLinks = $('.pane-elife-article-jumpto');
        var $jumpBlock = $('#article-jumplinks-anchor-region');
        var $jumpBlockContent = $('#jump-links-anchor-container');
        
        $jumpBlockContent.html('').html($jumpLinks.html());
        $jumpBlockContent.width($jumpLinks.width());
        $jumpBlockContent.height($jumpLinks.height());
        $jumpBlock.hide();

        $('a.elife-article-jumplink', $jumpBlock).click(function() {
          linkClicked($(this));
          return false;
        });
        
        // Sidebar floating functionality
        var past = false;
        var scroll_pos_test = $('.sidebar-wrapper').outerHeight() + $('.sidebar-wrapper').offset().top;        
        if ($('body').hasClass('admin-menu')) {
        	var topOffset = 58;
        }
        else {
        	var topOffset = 43;
        }
        $(window).scroll(function() {
          var y_scroll_pos = window.pageYOffset;
          var currentLayout = Drupal.omega.getCurrentLayout();
          
          if (currentLayout != 'mobile') {        
  	        if(!past && y_scroll_pos > (scroll_pos_test - 28)) {
  	          past = true;
  	          $jumpBlock.css('position', 'fixed').css('top', topOffset).css('left', $('.sidebar-wrapper').offset().left);
  	          $jumpBlock.fadeIn(400);
  	        }
  	
  	        if(past && y_scroll_pos < (scroll_pos_test - 28)) {
  	          past = false;
  	          $jumpBlock.fadeOut(200);
  	        }
  	      }
        });
      
        $(window).resize(function(){
        	var currentLayout = Drupal.omega.getCurrentLayout();
        	
        	if (currentLayout != 'mobile') {
        		if (past) {
        			$jumpBlock.css('left', $('.sidebar-wrapper').offset().left + 'px');
        		}
        	}
        	
        	$('body').bind('responsivelayout', function(e, d) {
        		if (d.to == 'mobile') {
  			    	$jumpBlock.hide();
        		}
        		if (d.from == 'mobile' && past) {
        			$jumpBlock.fadeIn(400);
        		}
  			    if(d.from != d.to) {
  			      $jumpBlockContent.width($jumpLinks.width());
  			      $jumpBlockContent.height($jumpLinks.height());
  			    }
  			  });
        });
      });
    }
  };
})(jQuery);
;
