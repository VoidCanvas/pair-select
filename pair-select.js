/*
##Plugin Details##
	Plugin Name: Pair Select
	Version: 1.0.0
    Plugin by: Void Canvas
    Website: www.voidcanvas.com
    Author: Paul Shan
    License: MIT License

##Example##
==HTML==
	<select id="MasterSelectBox" multiple>
		<option value="1">First value</option>
		<option value="2">Second value</option>
	</select>

	<button id="btnAdd">Add</button>
	<button id="btnRemove">Remove</button>

	<select id="PairedSelectBox" multiple>
	</select>

==Javascript==
	$('#MasterSelectBox').pairMaster();

	$('#btnAdd').click(function(){
		$('#MasterSelectBox').addSelected('#PairedSelectBox');
	});

	$('#btnRemove').click(function(){
		$('#PairedSelectBox').removeSelected('#MasterSelectBox'); 
	});
*/
//==============================================================================================================================================================//
//==============================================================================================================================================================//

(function($) {    
    // Creating the master object. It will work like a handler
    function PairSelect(el, options) {
				
        //defaults are the object where the default values are stored
        this.defaults = {
            attribute: 'value' //the attribute is the key according to which the matching will be done. Defaultly it's 'value', but it can be anything. Like: class, id etc.
        };

        this.opts = $.extend({}, this.defaults, options); //extending the properties in a common property named 'opts'
        this.$el = $(el);
        this.items = new Array();
    };

    PairSelect.prototype = {
        init: function() {
            var _this = this;
			//to store all the given options of the selectbox in the PairSelect object
            $('option', this.$el).each(function(i, obj) {
                var $el = $(obj);
                $el.data('status', 'enabled');
                _this.items.push({
                    attribute: $el.attr(_this.opts.attribute),
                    $el: $el
                });
            });
        },
        
		//This is used to move an option item from our master selectbox
        transferElement: function(item){
			var key=$(item).attr($(this)[0].opts.attribute)
            $.each(this.items, function(i, item){
                if(item.attribute == key ){
                     item.$el.remove();
                     item.$el.data('status', 'disabled'); 
                } 
            });
        },
		
		//This is used to bring back an option element to our master selectbox
        bringBackElement: function(item){
            var _this = this;			
			var key=$(item).attr($(this)[0].opts.attribute)
            $.each(this.items, function(i, item){
                if(item.attribute == key){
                     
                    var t = i + 1; 
                    while(true)
                    {
                        if(t < _this.items.length) {   
                            if(_this.items[t].$el.data('status') == 'enabled')  {
                                _this.items[t].$el.before(item.$el);
                                item.$el.data('status', 'enabled');
                                break;
                            }
                            else {
                               t++;
                            }   
                        }
                        else {
							_this.$el.append(item.$el);
                            item.$el.data('status', 'enabled');
                            break;
                        }                   
                    }
                } 
            });     
        }
    };

	//This is sort of an init function for the whole pare-select plugin.
	//This is basically used with the master selectbox.
	//Eg: $('#MasterSelectBox').pairMaster({ attribute: 'value' });
	//Eg: $('#MasterSelectBox').pairMaster();
    $.fn.pairMaster = function(options) {
        if (this.length) {
            this.each(function() {
                var rev = new PairSelect(this, options);
                rev.init();
                $(this).data('pairselect', rev);
            });
        }
    };
	
	//This is to add the selected items of our MasterSelectBox to a paired selectbox
	//once any add or similar button is clicked or any other add event is raised you've to place the following code
	//$('#MasterSelectBox').addSelected('#PairedSelectBox');
	$.fn.addSelected=function(to){
		var allSelected=$(this).find(':selected');
		var from=this;
		$.each(allSelected,function(index,item){
			$(from).data('pairselect').transferElement(item);
			if(to){
				$(to).append(item)
			}
		});
		
	}

	//This is to remove the selected items of a paired selectbox and add them back to our MasterSelectBox
	//once any remove, back or similar buttons are clicked or any other remove event is raised you've to place the following code
	//$('#PairedSelectBox').removeSelected('#MasterSelectBox');	
	$.fn.removeSelected=function(to){
		var allSelected=$(this).find(':selected');
		$.each(allSelected,function(index,item){
			$(item).remove();
			if(to){
				$(to).data('pairselect').bringBackElement(item);
			}
		});
		
	}
	
})(jQuery);