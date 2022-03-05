(function($) {
	
	$.fn.lightBox = function(settings) {
	
		settings = jQuery.extend({
		
			overlayBgColor: 		'#000',		
			overlayOpacity:			0.8,		
		    fixedNavigation:		false,		
		    imageLoading:			'images/lightbox-ico-loading.gif',		
			imageBtnPrev:			'images/lightbox-btn-prev.gif',			
			imageBtnNext:			'images/lightbox-btn-next.gif',			
			imageBtnClose:			'images/lightbox-btn-close.gif',		
			imageBlank:				'images/lightbox-blank.gif',			
	        containerBorderSize:	10,			
			containerResizeSpeed:	400,		
			txtImage:				'Image',	
			txtOf:					'of',		
	        keyToClose:				'c',		
			keyToPrev:				'p',		
            imageArray:				[],
			activeImage:			0
		},settings);
	
		var jQueryMatchedObj = this; 
		/**
	
		 *
		 * @return
		 */
		function _initialize() {
			_start(this,jQueryMatchedObj); 
			return false;
		}
		/**
		 * Start the jQuery lightBox plugin
		 *
		 * @param object objClicked The object (link) whick the user have clicked
		 * @param object jQueryMatchedObj The jQuery object with all elements matched
		 */
		function _start(objClicked,jQueryMatchedObj) {
		
			$('embed, object, select').css({ 'visibility' : 'hidden' });
	
			_set_interface();
		
			settings.imageArray.length = 0;
		
			settings.activeImage = 0;
	
			if ( jQueryMatchedObj.length == 1 ) {
				settings.imageArray.push(new Array(objClicked.getAttribute('href'),objClicked.getAttribute('title')));
			} else {
					
				for ( var i = 0; i < jQueryMatchedObj.length; i++ ) {
					settings.imageArray.push(new Array(jQueryMatchedObj[i].getAttribute('href'),jQueryMatchedObj[i].getAttribute('title')));
				}
			}
			while ( settings.imageArray[settings.activeImage][0] != objClicked.getAttribute('href') ) {
				settings.activeImage++;
			}
		
			_set_image_to_view();
		}
		
		function _set_interface() {
		
			$('body').append('<div id="jquery-overlay"></div><div id="jquery-lightbox"><div id="lightbox-container-image-box"><div id="lightbox-container-image"><img id="lightbox-image"><div style="" id="lightbox-nav"><a href="#" id="lightbox-nav-btnPrev"></a><a href="#" id="lightbox-nav-btnNext"></a></div><div id="lightbox-loading"><a href="#" id="lightbox-loading-link"><img src="' + settings.imageLoading + '"></a></div></div></div><div id="lightbox-container-image-data-box"><div id="lightbox-container-image-data"><div id="lightbox-image-details"><span id="lightbox-image-details-caption"></span><span id="lightbox-image-details-currentNumber"></span></div><div id="lightbox-secNav"><a href="#" id="lightbox-secNav-btnClose"><img src="' + settings.imageBtnClose + '"></a></div></div></div></div>');	
		
			var arrPageSizes = ___getPageSize();
		
			$('#jquery-overlay').css({
				backgroundColor:	settings.overlayBgColor,
				opacity:			settings.overlayOpacity,
				width:				arrPageSizes[0],
				height:				arrPageSizes[1]
			}).fadeIn();
		
			var arrPageScroll = ___getPageScroll();
		
			$('#jquery-lightbox').css({
				top:	arrPageScroll[1] + (arrPageSizes[3] / 10),
				left:	arrPageScroll[0]
			}).show();
		
			$('#jquery-overlay,#jquery-lightbox').click(function() {
				_finish();									
			});
		
			$('#lightbox-loading-link,#lightbox-secNav-btnClose').click(function() {
				_finish();
				return false;
			});
		
			$(window).resize(function() {
			
				var arrPageSizes = ___getPageSize();
			
				$('#jquery-overlay').css({
					width:		arrPageSizes[0],
					height:		arrPageSizes[1]
				});
				
				var arrPageScroll = ___getPageScroll();
				
				$('#jquery-lightbox').css({
					top:	arrPageScroll[1] + (arrPageSizes[3] / 10),
					left:	arrPageScroll[0]
				});
			});
		}
		
		function _set_image_to_view() { 
	
			$('#lightbox-loading').show();
			if ( settings.fixedNavigation ) {
				$('#lightbox-image,#lightbox-container-image-data-box,#lightbox-image-details-currentNumber').hide();
			} else {
		
				$('#lightbox-image,#lightbox-nav,#lightbox-nav-btnPrev,#lightbox-nav-btnNext,#lightbox-container-image-data-box,#lightbox-image-details-currentNumber').hide();
			}
	
			var objImagePreloader = new Image();
			objImagePreloader.onload = function() {
				$('#lightbox-image').attr('src',settings.imageArray[settings.activeImage][0]);
			
				_resize_container_image_box(objImagePreloader.width,objImagePreloader.height);
			
				objImagePreloader.onload=function(){};
			};
			objImagePreloader.src = settings.imageArray[settings.activeImage][0];
		};
		/**
		 * Perfomance an effect in the image container resizing it
		 *
		 * @param integer intImageWidth The image�s width that will be showed
		 * @param integer intImageHeight The image�s height that will be showed
		 */
		function _resize_container_image_box(intImageWidth,intImageHeight) {
	
			var intCurrentWidth = $('#lightbox-container-image-box').width();
			var intCurrentHeight = $('#lightbox-container-image-box').height();
	
			var intWidth = (intImageWidth + (settings.containerBorderSize * 2));
			var intHeight = (intImageHeight + (settings.containerBorderSize * 2));
	
			var intDiffW = intCurrentWidth - intWidth;
			var intDiffH = intCurrentHeight - intHeight;
	
			$('#lightbox-container-image-box').animate({ width: intWidth, height: intHeight },settings.containerResizeSpeed,function() { _show_image(); });
			if ( ( intDiffW == 0 ) && ( intDiffH == 0 ) ) {
				if ( $.browser.msie ) {
					___pause(250);
				} else {
					___pause(100);	
				}
			} 
			$('#lightbox-container-image-data-box').css({ width: intImageWidth });
			$('#lightbox-nav-btnPrev,#lightbox-nav-btnNext').css({ height: intImageHeight + (settings.containerBorderSize * 2) });
		};
		/**
		 * Show the prepared image
		 *
		 */
		function _show_image() {
			$('#lightbox-loading').hide();
			$('#lightbox-image').fadeIn(function() {
				_show_image_data();
				_set_navigation();
			});
			_preload_neighbor_images();
		};
		/**
		 * Show the image information
		 *
		 */
		function _show_image_data() {
			$('#lightbox-container-image-data-box').slideDown('fast');
			$('#lightbox-image-details-caption').hide();
			if ( settings.imageArray[settings.activeImage][1] ) {
				$('#lightbox-image-details-caption').html(settings.imageArray[settings.activeImage][1]).show();
			}
			// If we have a image set, display 'Image X of X'
			if ( settings.imageArray.length > 1 ) {
				$('#lightbox-image-details-currentNumber').html(settings.txtImage + ' ' + ( settings.activeImage + 1 ) + ' ' + settings.txtOf + ' ' + settings.imageArray.length).show();
			}		
		}
		/**
		 * Display the button navigations
		 *
		 */
		function _set_navigation() {
			$('#lightbox-nav').show();


			$('#lightbox-nav-btnPrev,#lightbox-nav-btnNext').css({ 'background' : 'transparent url(' + settings.imageBlank + ') no-repeat' });
			

			if ( settings.activeImage != 0 ) {
				if ( settings.fixedNavigation ) {
					$('#lightbox-nav-btnPrev').css({ 'background' : 'url(' + settings.imageBtnPrev + ') left 15% no-repeat' })
						.unbind()
						.bind('click',function() {
							settings.activeImage = settings.activeImage - 1;
							_set_image_to_view();
							return false;
						});
				} else {
			
					$('#lightbox-nav-btnPrev').unbind().hover(function() {
						$(this).css({ 'background' : 'url(' + settings.imageBtnPrev + ') left 15% no-repeat' });
					},function() {
						$(this).css({ 'background' : 'transparent url(' + settings.imageBlank + ') no-repeat' });
					}).show().bind('click',function() {
						settings.activeImage = settings.activeImage - 1;
						_set_image_to_view();
						return false;
					});
				}
			}
			
		
			if ( settings.activeImage != ( settings.imageArray.length -1 ) ) {
				if ( settings.fixedNavigation ) {
					$('#lightbox-nav-btnNext').css({ 'background' : 'url(' + settings.imageBtnNext + ') right 15% no-repeat' })
						.unbind()
						.bind('click',function() {
							settings.activeImage = settings.activeImage + 1;
							_set_image_to_view();
							return false;
						});
				} else {
				
					$('#lightbox-nav-btnNext').unbind().hover(function() {
						$(this).css({ 'background' : 'url(' + settings.imageBtnNext + ') right 15% no-repeat' });
					},function() {
						$(this).css({ 'background' : 'transparent url(' + settings.imageBlank + ') no-repeat' });
					}).show().bind('click',function() {
						settings.activeImage = settings.activeImage + 1;
						_set_image_to_view();
						return false;
					});
				}
			}
			// Enable keyboard navigation
			_enable_keyboard_navigation();
		}
		/**
		 * Enable a support to keyboard navigation
		 *
		 */
		function _enable_keyboard_navigation() {
			$(document).keydown(function(objEvent) {
				_keyboard_action(objEvent);
			});
		}
		/**
		 * Disable the support to keyboard navigation
		 *
		 */
		function _disable_keyboard_navigation() {
			$(document).unbind();
		}
		/**
		 * Perform the keyboard actions
		 *
		 */
		function _keyboard_action(objEvent) {
			// To ie
			if ( objEvent == null ) {
				keycode = event.keyCode;
				escapeKey = 27;
			// To Mozilla
			} else {
				keycode = objEvent.keyCode;
				escapeKey = objEvent.DOM_VK_ESCAPE;
			}
			// Get the key in lower case form
			key = String.fromCharCode(keycode).toLowerCase();
			// Verify the keys to close the ligthBox
			if ( ( key == settings.keyToClose ) || ( key == 'x' ) || ( keycode == escapeKey ) ) {
				_finish();
			}
			// Verify the key to show the previous image
			if ( ( key == settings.keyToPrev ) || ( keycode == 37 ) ) {
				// If we�re not showing the first image, call the previous
				if ( settings.activeImage != 0 ) {
					settings.activeImage = settings.activeImage - 1;
					_set_image_to_view();
					_disable_keyboard_navigation();
				}
			}
			// Verify the key to show the next image
			if ( ( key == settings.keyToNext ) || ( keycode == 39 ) ) {
				// If we�re not showing the last image, call the next
				if ( settings.activeImage != ( settings.imageArray.length - 1 ) ) {
					settings.activeImage = settings.activeImage + 1;
					_set_image_to_view();
					_disable_keyboard_navigation();
				}
			}
		}
		/**
		 * Preload prev and next images being showed
		 *
		 */
		function _preload_neighbor_images() {
			if ( (settings.imageArray.length -1) > settings.activeImage ) {
				objNext = new Image();
				objNext.src = settings.imageArray[settings.activeImage + 1][0];
			}
			if ( settings.activeImage > 0 ) {
				objPrev = new Image();
				objPrev.src = settings.imageArray[settings.activeImage -1][0];
			}
		}
		/**
		 * Remove jQuery lightBox plugin HTML markup
		 *
		 */
		function _finish() {
			$('#jquery-lightbox').remove();
			$('#jquery-overlay').fadeOut(function() { $('#jquery-overlay').remove(); });
	
			$('embed, object, select').css({ 'visibility' : 'visible' });
		}
		/**
		 / THIRD FUNCTION
		 * getPageSize() by quirksmode.com
		 *
		 * @return Array Return an array with page width, height and window width, height
		 */
		function ___getPageSize() {
			var xScroll, yScroll;
			if (window.innerHeight && window.scrollMaxY) {	
				xScroll = window.innerWidth + window.scrollMaxX;
				yScroll = window.innerHeight + window.scrollMaxY;
			} else if (document.body.scrollHeight > document.body.offsetHeight){ // all but Explorer Mac
				xScroll = document.body.scrollWidth;
				yScroll = document.body.scrollHeight;
			} else { // Explorer Mac...would also work in Explorer 6 Strict, Mozilla and Safari
				xScroll = document.body.offsetWidth;
				yScroll = document.body.offsetHeight;
			}
			var windowWidth, windowHeight;
			if (self.innerHeight) {	// all except Explorer
				if(document.documentElement.clientWidth){
					windowWidth = document.documentElement.clientWidth; 
				} else {
					windowWidth = self.innerWidth;
				}
				windowHeight = self.innerHeight;
			} else if (document.documentElement && document.documentElement.clientHeight) { // Explorer 6 Strict Mode
				windowWidth = document.documentElement.clientWidth;
				windowHeight = document.documentElement.clientHeight;
			} else if (document.body) { // other Explorers
				windowWidth = document.body.clientWidth;
				windowHeight = document.body.clientHeight;
			}	
			// for small pages with total height less then height of the viewport
			if(yScroll < windowHeight){
				pageHeight = windowHeight;
			} else { 
				pageHeight = yScroll;
			}
			// for small pages with total width less then width of the viewport
			if(xScroll < windowWidth){	
				pageWidth = xScroll;		
			} else {
				pageWidth = windowWidth;
			}
			arrayPageSize = new Array(pageWidth,pageHeight,windowWidth,windowHeight);
			return arrayPageSize;
		};
		/**
		 / THIRD FUNCTION
		 * getPageScroll() by quirksmode.com
		 *
		 * @return Array Return an array with x,y page scroll values.
		 */
		function ___getPageScroll() {
			var xScroll, yScroll;
			if (self.pageYOffset) {
				yScroll = self.pageYOffset;
				xScroll = self.pageXOffset;
			} else if (document.documentElement && document.documentElement.scrollTop) {	 // Explorer 6 Strict
				yScroll = document.documentElement.scrollTop;
				xScroll = document.documentElement.scrollLeft;
			} else if (document.body) {// all other Explorers
				yScroll = document.body.scrollTop;
				xScroll = document.body.scrollLeft;	
			}
			arrayPageScroll = new Array(xScroll,yScroll);
			return arrayPageScroll;
		};
		 /**
		  * Stop the code execution from a escified time in milisecond
		  *
		  */
		 function ___pause(ms) {
			var date = new Date(); 
			curDate = null;
			do { var curDate = new Date(); }
			while ( curDate - date < ms);
		 };
		// Return the jQuery object for chaining. The unbind method is used to avoid click conflict when the plugin is called more than once
		return this.unbind('click').click(_initialize);
	};
})(jQuery); // Call and execute the function immediately passing the jQuery object