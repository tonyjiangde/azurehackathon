Ext.require([
             'Ext.grid.*',
             'Ext.data.*',
             'Ext.util.*',
             'Ext.tip.QuickTipManager',
             'Ext.container.Viewport',
             'Ext.state.CookieProvider'
         ]); 
var cp,ep;
var typepk="";
var attributesstore;
var alsgp,lsgp;
var treewindow;
var itemswindow;
var itemdetailswindow;

Ext.define('hTypes', {
    extend: 'Ext.data.Model',
    fields: [
             {name: 'codeofsupertype',  type: 'string'},
             {name: 'textensionname', type: 'string'},
             {name: 'code',   type: 'string'},
             {name: 'pk', type: 'long'}
             
         ],
});
Ext.define('hAttributes', {
    extend: 'Ext.data.Model',
    fields: [
             {name: 'type',  type: 'String'},
             {name: 'databaseColumn',   type: 'string'},
             {name: 'qualifier',   type: 'string'},
             {name: 'attributepk', type: 'long'},
             {name: 'aextensionname', type: 'string'},
         ],
});
Ext.define('Ext.ux.statusbar.StatusBar', {
    extend: 'Ext.toolbar.Toolbar',
    alternateClassName: 'Ext.ux.StatusBar',
    alias: 'widget.statusbar',
    requires: ['Ext.toolbar.TextItem'],
    /**
     * @cfg {String} statusAlign
     * The alignment of the status element within the overall StatusBar layout.  When the StatusBar is rendered,
     * it creates an internal div containing the status text and icon.  Any additional Toolbar items added in the
     * StatusBar's {@link #cfg-items} config, or added via {@link #method-add} or any of the supported add* methods, will be
     * rendered, in added order, to the opposite side.  The status element is greedy, so it will automatically
     * expand to take up all sapce left over by any other items.  Example usage:
     *
     *     // Create a left-aligned status bar containing a button,
     *     // separator and text item that will be right-aligned (default):
     *     Ext.create('Ext.Panel', {
     *         title: 'StatusBar',
     *         // etc.
     *         bbar: Ext.create('Ext.ux.statusbar.StatusBar', {
     *             defaultText: 'Default status text',
     *             id: 'status-id',
     *             items: [{
     *                 text: 'A Button'
     *             }, '-', 'Plain Text']
     *         })
     *     });
     *
     *     // By adding the statusAlign config, this will create the
     *     // exact same toolbar, except the status and toolbar item
     *     // layout will be reversed from the previous example:
     *     Ext.create('Ext.Panel', {
     *         title: 'StatusBar',
     *         // etc.
     *         bbar: Ext.create('Ext.ux.statusbar.StatusBar', {
     *             defaultText: 'Default status text',
     *             id: 'status-id',
     *             statusAlign: 'right',
     *             items: [{
     *                 text: 'A Button'
     *             }, '-', 'Plain Text']
     *         })
     *     });
     */
    /**
     * @cfg {String} [defaultText='']
     * The default {@link #text} value.  This will be used anytime the status bar is cleared with the
     * `useDefaults:true` option.
     */
    /**
     * @cfg {String} [defaultIconCls='']
     * The default {@link #iconCls} value (see the iconCls docs for additional details about customizing the icon).
     * This will be used anytime the status bar is cleared with the `useDefaults:true` option.
     */
    /**
     * @cfg {String} text
     * A string that will be <b>initially</b> set as the status message.  This string
     * will be set as innerHTML (html tags are accepted) for the toolbar item.
     * If not specified, the value set for {@link #defaultText} will be used.
     */
    /**
     * @cfg {String} [iconCls='']
     * A CSS class that will be **initially** set as the status bar icon and is
     * expected to provide a background image.
     *
     * Example usage:
     *
     *     // Example CSS rule:
     *     .x-statusbar .x-status-custom {
     *         padding-left: 25px;
     *         background: transparent url(images/custom-icon.gif) no-repeat 3px 2px;
     *     }
     *
     *     // Setting a default icon:
     *     var sb = Ext.create('Ext.ux.statusbar.StatusBar', {
     *         defaultIconCls: 'x-status-custom'
     *     });
     *
     *     // Changing the icon:
     *     sb.setStatus({
     *         text: 'New status',
     *         iconCls: 'x-status-custom'
     *     });
     */

    /**
     * @cfg {String} cls
     * The base class applied to the containing element for this component on render.
     */
    cls : 'x-statusbar',
    /**
     * @cfg {String} busyIconCls
     * The default {@link #iconCls} applied when calling {@link #showBusy}.
     * It can be overridden at any time by passing the `iconCls` argument into {@link #showBusy}.
     */
    busyIconCls : 'x-status-busy',
    /**
     * @cfg {String} busyText
     * The default {@link #text} applied when calling {@link #showBusy}.
     * It can be overridden at any time by passing the `text` argument into {@link #showBusy}.
     */
    busyText : 'Loading...',
    /**
     * @cfg {Number} autoClear
     * The number of milliseconds to wait after setting the status via
     * {@link #setStatus} before automatically clearing the status text and icon.
     * Note that this only applies when passing the `clear` argument to {@link #setStatus}
     * since that is the only way to defer clearing the status.  This can
     * be overridden by specifying a different `wait` value in {@link #setStatus}.
     * Calls to {@link #clearStatus} always clear the status bar immediately and ignore this value.
     */
    autoClear : 5000,

    /**
     * @cfg {String} emptyText
     * The text string to use if no text has been set. If there are no other items in
     * the toolbar using an empty string (`''`) for this value would end up in the toolbar
     * height collapsing since the empty string will not maintain the toolbar height.
     * Use `''` if the toolbar should collapse in height vertically when no text is
     * specified and there are no other items in the toolbar.
     */
    emptyText : '&#160;',

    // private
    activeThreadId : 0,

    // private
    initComponent : function(){
        var right = this.statusAlign === 'right';

        this.callParent(arguments);
        this.currIconCls = this.iconCls || this.defaultIconCls;
        this.statusEl = Ext.create('Ext.toolbar.TextItem', {
            cls: 'x-status-text ' + (this.currIconCls || ''),
            text: this.text || this.defaultText || ''
        });

        if (right) {
            this.cls += ' x-status-right';
            this.add('->');
            this.add(this.statusEl);
        } else {
            this.insert(0, this.statusEl);
            this.insert(1, '->');
        }
    },

    /**
     * Sets the status {@link #text} and/or {@link #iconCls}. Also supports automatically clearing the
     * status that was set after a specified interval.
     *
     * Example usage:
     *
     *     // Simple call to update the text
     *     statusBar.setStatus('New status');
     *
     *     // Set the status and icon, auto-clearing with default options:
     *     statusBar.setStatus({
     *         text: 'New status',
     *         iconCls: 'x-status-custom',
     *         clear: true
     *     });
     *
     *     // Auto-clear with custom options:
     *     statusBar.setStatus({
     *         text: 'New status',
     *         iconCls: 'x-status-custom',
     *         clear: {
     *             wait: 8000,
     *             anim: false,
     *             useDefaults: false
     *         }
     *     });
     *
     * @param {Object/String} config A config object specifying what status to set, or a string assumed
     * to be the status text (and all other options are defaulted as explained below). A config
     * object containing any or all of the following properties can be passed:
     *
     * @param {String} config.text The status text to display.  If not specified, any current
     * status text will remain unchanged.
     *
     * @param {String} config.iconCls The CSS class used to customize the status icon (see
     * {@link #iconCls} for details). If not specified, any current iconCls will remain unchanged.
     *
     * @param {Boolean/Number/Object} config.clear Allows you to set an internal callback that will
     * automatically clear the status text and iconCls after a specified amount of time has passed. If clear is not
     * specified, the new status will not be auto-cleared and will stay until updated again or cleared using
     * {@link #clearStatus}. If `true` is passed, the status will be cleared using {@link #autoClear},
     * {@link #defaultText} and {@link #defaultIconCls} via a fade out animation. If a numeric value is passed,
     * it will be used as the callback interval (in milliseconds), overriding the {@link #autoClear} value.
     * All other options will be defaulted as with the boolean option.  To customize any other options,
     * you can pass an object in the format:
     * 
     * @param {Number} config.clear.wait The number of milliseconds to wait before clearing
     * (defaults to {@link #autoClear}).
     * @param {Boolean} config.clear.anim False to clear the status immediately once the callback
     * executes (defaults to true which fades the status out).
     * @param {Boolean} config.clear.useDefaults False to completely clear the status text and iconCls
     * (defaults to true which uses {@link #defaultText} and {@link #defaultIconCls}).
     *
     * @return {Ext.ux.statusbar.StatusBar} this
     */
    setStatus : function(o) {
        var me = this;

        o = o || {};
        Ext.suspendLayouts();
        if (Ext.isString(o)) {
            o = {text:o};
        }
        if (o.text !== undefined) {
            me.setText(o.text);
        }
        if (o.iconCls !== undefined) {
            me.setIcon(o.iconCls);
        }

        if (o.clear) {
            var c = o.clear,
                wait = me.autoClear,
                defaults = {useDefaults: true, anim: true};

            if (Ext.isObject(c)) {
                c = Ext.applyIf(c, defaults);
                if (c.wait) {
                    wait = c.wait;
                }
            } else if (Ext.isNumber(c)) {
                wait = c;
                c = defaults;
            } else if (Ext.isBoolean(c)) {
                c = defaults;
            }

            c.threadId = this.activeThreadId;
            Ext.defer(me.clearStatus, wait, me, [c]);
        }
        Ext.resumeLayouts(true);
        return me;
    },

    /**
     * Clears the status {@link #text} and {@link #iconCls}. Also supports clearing via an optional fade out animation.
     *
     * @param {Object} [config] A config object containing any or all of the following properties.  If this
     * object is not specified the status will be cleared using the defaults below:
     * @param {Boolean} config.anim True to clear the status by fading out the status element (defaults
     * to false which clears immediately).
     * @param {Boolean} config.useDefaults True to reset the text and icon using {@link #defaultText} and
     * {@link #defaultIconCls} (defaults to false which sets the text to '' and removes any existing icon class).
     *
     * @return {Ext.ux.statusbar.StatusBar} this
     */
    clearStatus : function(o) {
        o = o || {};

        var me = this,
            statusEl = me.statusEl;

        if (o.threadId && o.threadId !== me.activeThreadId) {
            // this means the current call was made internally, but a newer
            // thread has set a message since this call was deferred.  Since
            // we don't want to overwrite a newer message just ignore.
            return me;
        }

        var text = o.useDefaults ? me.defaultText : me.emptyText,
            iconCls = o.useDefaults ? (me.defaultIconCls ? me.defaultIconCls : '') : '';

        if (o.anim) {
            // animate the statusEl Ext.Element
            statusEl.el.puff({
                remove: false,
                useDisplay: true,
                callback: function() {
                    statusEl.el.show();
                    me.setStatus({
                        text: text,
                        iconCls: iconCls
                    });
                }
            });
        } else {
             me.setStatus({
                 text: text,
                 iconCls: iconCls
             });
        }
        return me;
    },

    /**
     * Convenience method for setting the status text directly.  For more flexible options see {@link #setStatus}.
     * @param {String} text (optional) The text to set (defaults to '')
     * @return {Ext.ux.statusbar.StatusBar} this
     */
    setText : function(text) {
        var me = this;
        me.activeThreadId++;
        me.text = text || '';
        if (me.rendered) {
            me.statusEl.setText(me.text);
        }
        return me;
    },

    /**
     * Returns the current status text.
     * @return {String} The status text
     */
    getText : function(){
        return this.text;
    },

    /**
     * Convenience method for setting the status icon directly.  For more flexible options see {@link #setStatus}.
     * See {@link #iconCls} for complete details about customizing the icon.
     * @param {String} iconCls (optional) The icon class to set (defaults to '', and any current icon class is removed)
     * @return {Ext.ux.statusbar.StatusBar} this
     */
    setIcon : function(cls) {
        var me = this;

        me.activeThreadId++;
        cls = cls || '';

        if (me.rendered) {
            if (me.currIconCls) {
                me.statusEl.removeCls(me.currIconCls);
                me.currIconCls = null;
            }
            if (cls.length > 0) {
                me.statusEl.addCls(cls);
                me.currIconCls = cls;
            }
        } else {
            me.currIconCls = cls;
        }
        return me;
    },

    /**
     * Convenience method for setting the status text and icon to special values that are pre-configured to indicate
     * a "busy" state, usually for loading or processing activities.
     *
     * @param {Object/String} config (optional) A config object in the same format supported by {@link #setStatus}, or a
     * string to use as the status text (in which case all other options for setStatus will be defaulted).  Use the
     * `text` and/or `iconCls` properties on the config to override the default {@link #busyText}
     * and {@link #busyIconCls} settings. If the config argument is not specified, {@link #busyText} and
     * {@link #busyIconCls} will be used in conjunction with all of the default options for {@link #setStatus}.
     * @return {Ext.ux.statusbar.StatusBar} this
     */
    showBusy : function(o){
        if (Ext.isString(o)) {
            o = { text: o };
        }
        o = Ext.applyIf(o || {}, {
            text: this.busyText,
            iconCls: this.busyIconCls
        });
        return this.setStatus(o);
    }
});

var attributesAction = Ext.create('Ext.Action', {
    text: 'Show Attributes',
    //disabled: true,
    handler: function(widget, event) {
        var rec = lsgp.getSelectionModel().getSelection()[0];
        if (rec) {
        	//var panel = Ext.getCmp('ep');
        	//panel.expand();
        	
        	typepk = rec.get('pk');
        	ep.setTitle("<img border='0' src='images/favicon.ico' height='16' width='16' /> Attributes of "+rec.get('code'));
        	//ep.title = "<img border='0' src='images/favicon.ico' height='16' width='16' /> Attributesaa of "+rec.get('code');
        	attributesstore.getProxy().url = 'services/showatrributes.do?typepk='+typepk;
        	attributesstore.load();
        	alsgp.getView().refresh();
        	if(ep.collapsed)
        		ep.expand();
        } else {
            alert('Please select a type from the grid');
        }
    }
});
var itemsAction = Ext.create('Ext.Action', {
    text: 'Show Items (without subtypes)',
    handler: function(widget, event) {
        var rec = lsgp.getSelectionModel().getSelection()[0];
        
        if (rec) {
        	var co = rec.get('code');
        	Ext.define('pagingItems', {
                extend: 'Ext.data.Model',
                fields: [
                    {name: 'Itemtype', type: 'string'},
                    {name: 'PK', type: 'string'},
                    {name: 'Model Class', type: 'string'}
                ],
                idProperty: 'PK'
            });
        	var store = Ext.create('Ext.data.Store', {
        		id: 'store',
                pageSize: 50,
                buffered: true,
                leadingBufferZone: 150,
                model: 'pagingItems',
                proxy: {
                    type: 'ajax',
                    url: 'services/showitemsp.do?code='+co+'&mode=0',
                    reader: {
                        root: 'items',
                        totalProperty: 'totalCount',
                        type: 'json'
                    },
                 // sends single sort as multi parameter
                    simpleSortMode: true,
                    filterParam: 'query',
                    encodeFilters: function(filters) {
                        return filters[0].value;
                    }
                },
                listeners: {
                    totalcountchange: onStoreSizeChange
                },
                remoteFilter: true,
                autoLoad: true,
            });
        	function onStoreSizeChange() {
                grid.down('#status').update({count: store.getTotalCount()});
            }
        	 function renderItems(value, metaData,record, rowIdx,colIdx,store){
	            	value = Ext.String.htmlEncode(value);
	            	metaData.tdAttr='data-qtip="<xmp>'+Ext.String.htmlEncode(value)+'</xmp>"';
	            	return value;
	            };
        	var grid = Ext.create('Ext.grid.Panel', {
        		//columnLines: true,
    	        height: '100%',
    	        width: '100%',
                store: store,
                //disableSelection: true,
                loadMask: true,
                dockedItems: [{
                    dock: 'top',
                    xtype: 'toolbar',
                    items: [{
                        width: 400,
                        fieldLabel: 'Search',
                        labelWidth: 50,
                        xtype: 'searchfield',
                        store: store
                    }, '->', {
                        xtype: 'component',
                        itemId: 'status',
                        tpl: 'Matching threads: {count}',
                        style: 'margin-right:5px'
                    }]
                }],
                selModel: {
                    pruneRemoved: false
                },
                viewConfig: {
                    stripeRows: true,
                    emptyText: '<h1 style="margin:20px">No matching results</h1>'
                },
                // grid columns
                columns:[{
                    text: "Itemtype",
                    dataIndex: 'Itemtype',
                    flex: 30,
                    sortable: true,
                    renderer: renderItems
                },{
                    text: "PK",
                    dataIndex: 'PK',
                    flex: 30,
                    sortable: true,
                    renderer: renderItems
                },{
                    text: "Model Class",
                    dataIndex: 'Model Class',
                    flex: 40,
                    sortable: false,
                    renderer: renderItems
                }],
                listeners : {
    	        	itemclick: function(dv, record, item, index, e) {
    	            	var pkstring = record.get('PK');
    	            	var typestring = record.get('Itemtype');
    	            	
    	            	if(pkstring && typestring){
    	            		Ext.Ajax.request({ 
    	            		    url:'services/showitemdetail.do?type='+typestring+'&pk='+pkstring, 
    	            		    //params: { foo: 'bar' }, 
    	            		    failure: function(response, options) {
    	            		    	Ext.Msg.alert('Error', response.responseText);
    	            		    }, 
    	            		    success: function(response, options) { 
    	            		    	var dataObj = Ext.decode(response.responseText); 
    	            		    	if(dataObj==null){
    	                       		 	Ext.Msg.alert('Error', 'No details are found!???');
    	            		    	}else{
    	            		    		//alert(dataObj.length);
    	            		    		if(true){
    	            		    			var item = dataObj;
    	                            		
    	                            		var n=0;
    	                            		for(var k in item){
    	                            			n++;
    	                            			//alert(n+"+++"+item[k]);
    	                            		}
    	                            		var c = new Array(n);
    	                            		var fs = new Array(n);
    	                            		var i =0;
    	                            		var f = Math.floor(100/n);
    	                            		for(var k in item){
    	                            			c[i] = {
    	                            				    text     : k, 
    	                            				    flex     : f,
    	                            				    sortable : true, 
    	                            				    renderer: function(value, metaData,record, rowIdx,colIdx,store){
    	                            		            	value = Ext.String.htmlEncode(value);
    	                            		            	metaData.tdAttr='data-qtip="<xmp>'+Ext.String.htmlEncode(value)+'</xmp>"';
    	                            		            	
    	                            		            	return value;
    	                            		            },
    	                            				    dataIndex: k
    	                            				};
    	                            			fs[i] = {
    	                            					name	: k,  
    	                            					type	: 'string'
    	                            				};
    	                            			i++;
    	                            		}
    	                            		Ext.define('deItems', {
    	                            		    extend: 'Ext.data.Model',
    	                            		    fields: fs,
    	                            		});
    	                            		
    	                            		var s = Ext.create('Ext.data.Store', {
    	                            			//pageSize: 50,
    	                            			//remoteSort: true,
    	                            	        model: 'deItems',
    	                            	        data : dataObj,
    	                            	        proxy: {
    	                            	            type: 'memory',
    	                            	            reader: {
    	                            	                type: 'json',
    	                            	                
    	                            	            }
    	                            	        }
    	                            		});
    	                            		var idlsgp = Ext.create('Ext.grid.Panel', {
    	                            	        store: s,
    	                            	        columnLines: true,
    	                            	        columns: c,
    	                            	        height: '100%',
    	                            	        width: '100%',
    	                            	        viewConfig: {
    	                            	            stripeRows: true
    	                            	        }
    	                            		});
    	                            		
    	                            		if(itemdetailswindow ==null){
    	                            			itemdetailswindow = Ext.create('Ext.Window', {
    	                                	        title: 'Item '+pkstring,
    	                                	        width: 800,
    	                                	        height: 100,
    	                                	        modal:true,
    	                                	        closeAction:'hide',
    	                                	        maximizable: true,
    	                                	        //plain: true,
    	                                	        //headerPosition: 'left',
    	                                	        layout: 'fit',
    	                                	        
    	                                	        items: [
    	                                	                idlsgp
    	                                	        ]
    	                                	        
    	                                	    });
    	                            			itemdetailswindow.setPosition(e.getXY());
    	                            			itemdetailswindow.show();
    	                                		
    	                                	}else{
    	                                		itemdetailswindow.setTitle('Item '+pkstring);
    	                                		//alert(pkstring);
    	                                		itemdetailswindow.removeAll();
    	                                		itemdetailswindow.add(idlsgp);
    	                                		itemdetailswindow.setPosition(e.getXY());
    	                                		itemdetailswindow.doLayout();
    	                                		itemdetailswindow.show();
    	                                	}
    	            		    		}else{
    	            		    			Ext.Msg.alert('Error', 'No details are found!');
    	            		    		}
    	            		    	} 
    	            		    }
    	            		});
    	                            		
    	            	}else {
    	            		Ext.Msg.alert('Error', 'Please select an Item in the Grid!');
    	            	}
    	            }
    	        },
                // paging bar on the bottom
              /*  bbar: Ext.create('Ext.PagingToolbar', {
                    store: store,
                    displayInfo: true,
                    displayMsg: 'Displaying Items {0} - {1} of {2}',
                    emptyMsg: "No Items to display"
                    
                })*/
            });
        	//store.loadPage(1);
        	if(itemswindow ==null){
            	itemswindow = Ext.create('Ext.Window', {
        	        title: 'Items',
        	        width: 800,
        	        height: 600,
        	        modal:true,
        	        closeAction:'hide',
        	        maximizable: true,
        	        //plain: true,
        	        //headerPosition: 'left',
        	        layout: 'fit',
        	       
        	        items: [
        	                grid
        	        ]
        	        
        	    });
            	itemswindow.setTitle(" Items of Type "+co+" without subtypes");
            	itemswindow.center();
            	itemswindow.show();
            	
        		
        	}else{
        		itemswindow.setTitle(" Items of Type "+co+" without subtypes");
        		itemswindow.removeAll();
        		itemswindow.add(grid);
        		itemswindow.doLayout();
        		itemswindow.show();
        	}
        } else {
            Ext.Msg.alert('Error', 'Please select a type from the grid');
            //Ext.getBody().unmask();
        }
        
    }
});

var itemsAction4 = Ext.create('Ext.Action', {
    text: 'navigate to supertype',
    handler: function(widget, event) {
        var rec = lsgp.getSelectionModel().getSelection()[0];
        
        if (rec) {
        	var co = rec.get('codeofsupertype');
        	var store = lsgp.getStore();
        	if(co != 'null'){
        		store.each(function(rec) {
            	    if(rec.get("code") == co)   
            	    {
            	    	
            	    	var row = lsgp.store.indexOf(rec);
            	    	lsgp.getSelectionModel().select(rec);
            	    	//lsgp.getView().getRow(row).scrollIntoView();
            	    	typepk = rec.get('pk');
                    	ep.setTitle("<img border='0' src='images/favicon.ico' height='16' width='16' /> Attributes of "+rec.get('code'));
                    	attributesstore.getProxy().url = 'services/showatrributes.do?typepk='+typepk;
                    	attributesstore.load();
                    	alsgp.getView().refresh();
                    	if(ep.collapsed)
                    		ep.expand();
            	    	return false;
            	    }
            	});
        	}
        	
        	
        } else {
            Ext.Msg.alert('Error', 'Please select a type from the grid');
        }
        
    }
});
/*var pkstring = view.getRecord(tip.triggerElement).get('PK');
var typestring = view.getRecord(tip.triggerElement).get('Type');
if(pkstring && typestring){
	Ext.Ajax.request({ 
	    url:'showitemdetail.do?type='+typestring+'&pk='+pkstring, 
	    //params: { foo: 'bar' }, 
	    failure: function(response, options) {}, 
	    success: function(response, options) { 
	        //dataObj = Ext.decode(response.responseText); 
	        //alert(dataObj);
	    	view.tip = Ext.create('Ext.tip.ToolTip', {
	            // The overall target element.
	            target: view.el,
	            // Each grid row causes its own seperate show and hide.
	            delegate: view.itemSelector,
	            // Moving within the row should not hide the tip.
	            trackMouse: true,
	            // Render immediately so that tip.body can be referenced prior to the first show.
	            renderTo: Ext.getBody(),
	            //autoLoad: 'flare.json'
	            listeners: {
	                // Change content dynamically depending on which element triggered the show.
	                beforeshow: function (tip) {
	                	tip.update(response.responseText);
	                
	                }
	            }
	        });
	    } 
	});  
}else {
    tip.on('show', function(){
        Ext.defer(tip.hide, 10, tip);
    }, tip, {single: true});
}
*/
function createTooltip(view) {
	
    view.tip = Ext.create('Ext.tip.ToolTip', {
        // The overall target element.
        target: view.el,
        // Each grid row causes its own seperate show and hide.
        delegate: view.itemSelector,
        // Moving within the row should not hide the tip.
        trackMouse: true,
        // Render immediately so that tip.body can be referenced prior to the first show.
        renderTo: Ext.getBody(),
        //autoLoad: 'flare.json'
        listeners: {
            // Change content dynamically depending on which element triggered the show.
            beforeshow: function (tip) {
            	
            	//++++++++++++++++++++++++++++++++++++++++
            	var pkstring = view.getRecord(view.tip.triggerElement).get('PK');
            	var typestring = view.getRecord(view.tip.triggerElement).get('Type');
            	if(pkstring && typestring){
            		Ext.Ajax.request({ 
            		    url:'services/showitemdetail.do?type='+typestring+'&pk='+pkstring, 
            		    //params: { foo: 'bar' }, 
            		    failure: function(response, options) {
            		    	tip.on('show', function(){
                                Ext.defer(tip.hide, 10, tip);
                            }, tip, {single: true});
            		    }, 
            		    success: function(response, options) { 
            		        //dataObj = Ext.decode(response.responseText); 
            		        //alert(dataObj);
            		    	view.tip = Ext.create('Ext.tip.ToolTip', {
            		            // The overall target element.
            		            target: view.el,
            		            // Each grid row causes its own seperate show and hide.
            		            delegate: view.itemSelector,
            		            // Moving within the row should not hide the tip.
            		            trackMouse: true,
            		            // Render immediately so that tip.body can be referenced prior to the first show.
            		            renderTo: Ext.getBody(),
            		            //autoLoad: 'flare.json'
            		            listeners: {
            		                // Change content dynamically depending on which element triggered the show.
            		                beforeshow: function (tip) {
            		                	tip.update(response.responseText);
            		                	/*var tooltip = view.getRecord(tip.triggerElement).get('PK');
            		                    if(tooltip){
            		                       // tip.update("<table cellpadding=\"10\" style=\"border: 1px solid blue; border-collapse:collapse;\"><tr style=\"border: 1px solid blue; border-collapse:collapse;\"><td style=\"border: 1px solid blue; border-collapse:collapse;\">"+tooltip+"</td><td>"+tooltip+"</td></tr><tr style=\"border: 1px solid blue; border-collapse:collapse;\"><td style=\"border: 1px solid blue; border-collapse:collapse;\">"+tooltip+"</td><td>"+tooltip+"</td></tr></table>");
            		                    	//tip.autoLoad('flare.json');
            		                    	tip.update(response.responseText);
            		                    } else {
            		                         tip.on('show', function(){
            		                             Ext.defer(tip.hide, 10, tip);
            		                         }, tip, {single: true});
            		                    }*/
            		                }
            		            }
            		        });
            		    } 
            		});  
            	}else {
                    tip.on('show', function(){
                        Ext.defer(tip.hide, 10, tip);
                    }, tip, {single: true});
               }
            	
            	
            	//++++++++++++++++++++++++++++++++++++++
                
            }
        }
    });
}
var itemsAction2 = Ext.create('Ext.Action', {
    text: 'Show Items (with subtypes)',
    iconCls: 'warning',
    //disabled: true,
    handler: function(widget, event) {
    	Ext.getBody().mask("Loading...");
        var rec = lsgp.getSelectionModel().getSelection()[0];
        if (rec) {
            var co = rec.get('code');
            d3.json("http://localhost:9001/typebrowser/showitems.do?code="+co+"&mode=1", function(json) {
            	if(json==null){
            		 Ext.Msg.alert('Error', 'No items are found!');
            	}else{
            		if(json.length>0){
                		var item = json[0];
                		
                		var n=0;
                		for(var k in item){
                			n++;
                			//alert(n+"+++"+item[k]);
                		}
                		var c = new Array(n);
                		var fs = new Array(n);
                		var i =0;
                		var f = Math.floor(100/n);
                		/*var rowEditing = Ext.create('Ext.grid.plugin.CellEditing', {
                	        clicksToMoveEditor: 1
                	        //autoCancel: true
                	    });*/
                		for(var k in item){
                			c[i] = {
                				    text     : k, 
                				    //width    : 35,
                				    flex     : f,
                				    sortable : true, 
                				    /*editor: {
                		                // defaults to textfield if no xtype is supplied
                		                allowBlank: false
                		            },*/
                		            renderer: function(value, metaData,record, rowIdx,colIdx,store){
                		            	value = Ext.String.htmlEncode(value);
                		            	//alert(Ext.String.htmlEncode(value));
                		            	metaData.tdAttr='data-qtip="<xmp>'+Ext.String.htmlEncode(value)+'</xmp>"';
                		            	return value;
                		            },
                				    dataIndex: k
                				};
                			fs[i] = {
                					name	: k,  
                					type	: 'string'
                				};
                			//alert(c[i].text+"==="+fs[i].name);
                			i++;
                		}
                		
                		Ext.define('hItems2', {
                		    extend: 'Ext.data.Model',
                		    fields: fs,
                		});
                		
                		var s = Ext.create('Ext.data.Store', {
                	        //autoLoad: true,
                	        //autoSync: true,
                			//pageSize: 50,
                			//remoteSort: true,
                	        model: 'hItems2',
                	        data : json,
                	        proxy: {
                	            type: 'memory',
                	            reader: {
                	                type: 'json',
                	                
                	            }
                	            //simpleSortMode: true
                	        }
                	        
                	        /*proxy: {
                	            type: 'rest',
                	            url: "showitems.do?code="+co,
                	            reader: {
                	                type: 'json'
                	                
                	            }
                	            
                	        }*/
                	    });
                		var ilsgp = Ext.create('Ext.ux.LiveSearchGridPanel', {
                	        store: s,
                	        columnLines: true,
                	        columns: c,
                	        height: '100%',
                	        width: '100%',
                	        /*bbar: Ext.create('Ext.PagingToolbar', {
                	            store: s,
                	            displayInfo: true,
                	            displayMsg: 'Displaying topics {0} - {1} of {2}',
                	            emptyMsg: "No topics to display"
                	            
                	        }),*/
                	        listeners : {
                	        	itemclick: function(dv, record, item, index, e) {
                	            	var pkstring = record.get('PK');
                	            	var typestring = record.get('Type');
                	            	if(pkstring && typestring){
                	            		Ext.Ajax.request({ 
                	            		    url:'services/showitemdetail.do?type='+typestring+'&pk='+pkstring, 
                	            		    //params: { foo: 'bar' }, 
                	            		    failure: function(response, options) {
                	            		    	Ext.Msg.alert('Error', response.responseText);
                	            		    }, 
                	            		    success: function(response, options) { 
                	            		    	dataObj = Ext.decode(response.responseText); 
                	            		    	if(dataObj==null){
                	                       		 	Ext.Msg.alert('Error', 'No details are found!???');
                	            		    	}else{
                	            		    		//alert(dataObj.length);
                	            		    		if(true){
                	            		    			var item = dataObj;
                	                            		
                	                            		var n=0;
                	                            		for(var k in item){
                	                            			n++;
                	                            			//alert(n+"+++"+item[k]);
                	                            		}
                	                            		var c = new Array(n);
                	                            		var fs = new Array(n);
                	                            		var i =0;
                	                            		var f = Math.floor(100/n);
                	                            		for(var k in item){
                	                            			c[i] = {
                	                            				    text     : k, 
                	                            				    flex     : f,
                	                            				    sortable : true, 
                	                            				    renderer: function(value, metaData,record, rowIdx,colIdx,store){
                	                            		            	value = Ext.String.htmlEncode(value);
                	                            		            	metaData.tdAttr='data-qtip="<xmp>'+Ext.String.htmlEncode(value)+'</xmp>"';
                	                            		            	return value;
                	                            		            },
                	                            				    dataIndex: k
                	                            				};
                	                            			fs[i] = {
                	                            					name	: k,  
                	                            					type	: 'string'
                	                            				};
                	                            			i++;
                	                            		}
                	                            		Ext.define('deItems', {
                	                            		    extend: 'Ext.data.Model',
                	                            		    fields: fs,
                	                            		});
                	                            		
                	                            		var s = Ext.create('Ext.data.Store', {
                	                            			//pageSize: 50,
                	                            			//remoteSort: true,
                	                            	        model: 'deItems',
                	                            	        data : dataObj,
                	                            	        proxy: {
                	                            	            type: 'memory',
                	                            	            reader: {
                	                            	                type: 'json',
                	                            	                
                	                            	            }
                	                            	        }
                	                            		});
                	                            		var idlsgp = Ext.create('Ext.grid.Panel', {
                	                            	        store: s,
                	                            	        columnLines: true,
                	                            	        columns: c,
                	                            	        height: '100%',
                	                            	        width: '100%',
                	                            	        viewConfig: {
                	                            	            stripeRows: true
                	                            	        }
                	                            		});
                	                            		
                	                            		if(itemdetailswindow ==null){
                	                            			itemdetailswindow = Ext.create('Ext.Window', {
                	                                	        title: 'Item '+pkstring,
                	                                	        width: 800,
                	                                	        height: 100,
                	                                	        modal:true,
                	                                	        closeAction:'hide',
                	                                	        maximizable: true,
                	                                	        //plain: true,
                	                                	        //headerPosition: 'left',
                	                                	        layout: 'fit',
                	                                	        
                	                                	        items: [
                	                                	                idlsgp
                	                                	        ]
                	                                	        
                	                                	    });
                	                            			itemdetailswindow.setPosition(e.getXY());
                	                            			itemdetailswindow.show();
                	                                		
                	                                	}else{
                	                                		itemdetailswindow.title = 'Item '+pkstring;
                	                                		itemdetailswindow.removeAll();
                	                                		itemdetailswindow.add(idlsgp);
                	                                		itemdetailswindow.setPosition(e.getXY());
                	                                		itemdetailswindow.show();
                	                                	}
                	            		    		}else{
                	            		    			Ext.Msg.alert('Error', 'No details are found!');
                	            		    		}
                	            		    	} 
                	            		    }
                	            		});
                	                            		
                	            	}else {
                	            		Ext.Msg.alert('Error', 'Please select an Item in the Grid!');
                	            	}
                	            }
                	        },
                	        //plugins: [rowEditing],
                	        /*listeners: {
                	            render: {
                	                fn: function(grid){
                	                	var view = grid.getView();
                	                	grid.tip = new Ext.ToolTip({
                	                		target: view.mainBody,
                	                		delegate: '.x-grid-cell',
                	                		trackMouse: true,
                	                		renderTo: document.body,
                	                		anchor:'top',
                	                		listeners:{
                	                			beforeshow: function updateTipBody(tip){
                	                				var rowIndex = view.findRowIndex(tip.triggerElement);
                	                				var cellIndex = view.findCellIndex(tip.triggerElement);
                	                				var cell = view.getCell(rowIndex,cellIndex);
                	                				tip.body.dom.innerHTML =cell.innerHTML;
                	                			}
                	                		}
                	                	});
                	                }
                	            }
                	            
                	        },*/
                	        viewConfig: {
                	            stripeRows: true
                	            /*listeners: {
                	                render: createTooltip
                	            }*/
                	        }
                	        
                	    });
                		if(itemswindow ==null){
                        	itemswindow = Ext.create('Ext.Window', {
                    	        title: 'Items',
                    	        width: 800,
                    	        height: 600,
                    	        modal:true,
                    	        closeAction:'hide',
                    	        maximizable: true,
                    	        //plain: true,
                    	        //headerPosition: 'left',
                    	        layout: 'fit',
                    	       /* tools:[
                    	               {
                    	                   type:'refresh',
                    	                   tooltip: 'Refresh',
                    	                   // hidden:true,
                    	                   handler: function(event, toolEl, panel){
                    	                	   
                    	                   }
                    	               }],*/
                    	        items: [
                    	                ilsgp
                    	        ]
                    	        
                    	    });
                        	itemswindow.setTitle(json.length+ " Items of Type "+co+" including subtypes");
                        	//itemswindow.title = json.length+ " Items of Type "+co+" including subtypes";
                        	itemswindow.center();
                        	itemswindow.show();
                    		
                    	}else{
                    		itemswindow.setTitle(json.length+ " Items of Type "+co+" including subtypes");
                    		itemswindow.removeAll();
                    		//alert(itemswindow.title);
                    		itemswindow.add(ilsgp);
                    		itemswindow.show();
                    	}
                	}else{
                		Ext.Msg.alert('Error', 'Zero items are foud!');
                	}
            	}
            	
            	
            	Ext.getBody().unmask();
          	  
          	});
            
        } else {
            Ext.Msg.alert('Error', 'Please select a type from the grid');
            Ext.getBody().unmask();
        }
        
    }
});

var itemsAction3 = Ext.create('Ext.Action', {
	text: 'Show Items (with subtypes)',
    iconCls: 'warning',
    handler: function(widget, event) {
        var rec = lsgp.getSelectionModel().getSelection()[0];
        
        if (rec) {
        	var co = rec.get('code');
        	Ext.define('pagingItems', {
                extend: 'Ext.data.Model',
                fields: [
                    {name: 'Itemtype', type: 'string'},
                    {name: 'PK', type: 'string'},
                    {name: 'Model Class', type: 'string'}
                ],
                idProperty: 'PK'
            });
        	var store = Ext.create('Ext.data.Store', {
        		id: 'store',
                pageSize: 50,
                buffered: true,
                leadingBufferZone: 150,
                model: 'pagingItems',
                proxy: {
                    type: 'ajax',
                    url: 'services/showitemsp.do?code='+co+'&mode=1',
                    reader: {
                        root: 'items',
                        totalProperty: 'totalCount',
                        type: 'json'
                    },
                 // sends single sort as multi parameter
                    simpleSortMode: true,
                    filterParam: 'query',
                    encodeFilters: function(filters) {
                        return filters[0].value;
                    }
                },
                listeners: {
                    totalcountchange: onStoreSizeChange
                },
                remoteFilter: true,
                autoLoad: true,
            });
        	function onStoreSizeChange() {
                grid.down('#status').update({count: store.getTotalCount()});
            }
        	 function renderItems(value, metaData,record, rowIdx,colIdx,store){
	            	value = Ext.String.htmlEncode(value);
	            	metaData.tdAttr='data-qtip="<xmp>'+Ext.String.htmlEncode(value)+'</xmp>"';
	            	return value;
	            };
        	var grid = Ext.create('Ext.grid.Panel', {
        		//columnLines: true,
    	        height: '100%',
    	        width: '100%',
                store: store,
                //disableSelection: true,
                loadMask: true,
                dockedItems: [{
                    dock: 'top',
                    xtype: 'toolbar',
                    items: [{
                        width: 400,
                        fieldLabel: 'Search',
                        labelWidth: 50,
                        xtype: 'searchfield',
                        store: store
                    }, '->', {
                        xtype: 'component',
                        itemId: 'status',
                        tpl: 'Matching items: {count}',
                        style: 'margin-right:5px'
                    }]
                }],
                selModel: {
                    pruneRemoved: false
                },
                viewConfig: {
                    stripeRows: true,
                    emptyText: '<h1 style="margin:20px">No matching results</h1>'
                },
                // grid columns
                columns:[{
                    text: "Itemtype",
                    dataIndex: 'Itemtype',
                    flex: 30,
                    sortable: true,
                    renderer: renderItems
                },{
                    text: "PK",
                    dataIndex: 'PK',
                    flex: 30,
                    sortable: true,
                    renderer: renderItems
                },{
                    text: "Model Class",
                    dataIndex: 'Model Class',
                    flex: 40,
                    sortable: false,
                    renderer: renderItems
                }],
                listeners : {
    	        	itemclick: function(dv, record, item, index, e) {
    	            	var pkstring = record.get('PK');
    	            	var typestring = record.get('Itemtype');
    	            	
    	            	if(pkstring && typestring){
    	            		Ext.Ajax.request({ 
    	            		    url:'services/showitemdetail.do?type='+typestring+'&pk='+pkstring, 
    	            		    //params: { foo: 'bar' }, 
    	            		    failure: function(response, options) {
    	            		    	Ext.Msg.alert('Error', response.responseText);
    	            		    }, 
    	            		    success: function(response, options) { 
    	            		    	var dataObj = Ext.decode(response.responseText); 
    	            		    	if(dataObj==null){
    	                       		 	Ext.Msg.alert('Error', 'No details are found!???');
    	            		    	}else{
    	            		    		//alert(dataObj.length);
    	            		    		if(true){
    	            		    			var item = dataObj;
    	                            		
    	                            		var n=0;
    	                            		for(var k in item){
    	                            			n++;
    	                            			//alert(n+"+++"+item[k]);
    	                            		}
    	                            		var c = new Array(n);
    	                            		var fs = new Array(n);
    	                            		var i =0;
    	                            		var f = Math.floor(100/n);
    	                            		for(var k in item){
    	                            			c[i] = {
    	                            				    text     : k, 
    	                            				    flex     : f,
    	                            				    sortable : true, 
    	                            				    renderer: function(value, metaData,record, rowIdx,colIdx,store){
    	                            		            	value = Ext.String.htmlEncode(value);
    	                            		            	metaData.tdAttr='data-qtip="<xmp>'+Ext.String.htmlEncode(value)+'</xmp>"';
    	                            		            	return value;
    	                            		            },
    	                            				    dataIndex: k
    	                            				};
    	                            			fs[i] = {
    	                            					name	: k,  
    	                            					type	: 'string'
    	                            				};
    	                            			i++;
    	                            		}
    	                            		Ext.define('deItems', {
    	                            		    extend: 'Ext.data.Model',
    	                            		    fields: fs,
    	                            		});
    	                            		
    	                            		var s = Ext.create('Ext.data.Store', {
    	                            			//pageSize: 50,
    	                            			//remoteSort: true,
    	                            	        model: 'deItems',
    	                            	        data : dataObj,
    	                            	        proxy: {
    	                            	            type: 'memory',
    	                            	            reader: {
    	                            	                type: 'json',
    	                            	                
    	                            	            }
    	                            	        }
    	                            		});
    	                            		var idlsgp = Ext.create('Ext.grid.Panel', {
    	                            	        store: s,
    	                            	        columnLines: true,
    	                            	        columns: c,
    	                            	        height: '100%',
    	                            	        width: '100%',
    	                            	        viewConfig: {
    	                            	            stripeRows: true
    	                            	        }
    	                            		});
    	                            		
    	                            		if(itemdetailswindow ==null){
    	                            			itemdetailswindow = Ext.create('Ext.Window', {
    	                                	        title: 'Item '+pkstring,
    	                                	        width: 800,
    	                                	        height: 100,
    	                                	        modal:true,
    	                                	        closeAction:'hide',
    	                                	        maximizable: true,
    	                                	        //plain: true,
    	                                	        //headerPosition: 'left',
    	                                	        layout: 'fit',
    	                                	        
    	                                	        items: [
    	                                	                idlsgp
    	                                	        ]
    	                                	        
    	                                	    });
    	                            			itemdetailswindow.setPosition(e.getXY());
    	                            			itemdetailswindow.show();
    	                                		
    	                                	}else{
    	                                		itemdetailswindow.setTitle('Item '+pkstring);
    	                                		//alert(pkstring);
    	                                		itemdetailswindow.removeAll();
    	                                		itemdetailswindow.add(idlsgp);
    	                                		itemdetailswindow.setPosition(e.getXY());
    	                                		itemdetailswindow.doLayout();
    	                                		itemdetailswindow.show();
    	                                	}
    	            		    		}else{
    	            		    			Ext.Msg.alert('Error', 'No details are found!');
    	            		    		}
    	            		    	} 
    	            		    }
    	            		});
    	                            		
    	            	}else {
    	            		Ext.Msg.alert('Error', 'Please select an Item in the Grid!');
    	            	}
    	            }
    	        },
                // paging bar on the bottom
              /*  bbar: Ext.create('Ext.PagingToolbar', {
                    store: store,
                    displayInfo: true,
                    displayMsg: 'Displaying Items {0} - {1} of {2}',
                    emptyMsg: "No Items to display"
                    
                })*/
            });
        	//store.loadPage(1);
        	if(itemswindow ==null){
            	itemswindow = Ext.create('Ext.Window', {
        	        title: 'Items',
        	        width: 800,
        	        height: 600,
        	        modal:true,
        	        closeAction:'hide',
        	        maximizable: true,
        	        //plain: true,
        	        //headerPosition: 'left',
        	        layout: 'fit',
        	       
        	        items: [
        	                grid
        	        ]
        	        
        	    });
            	itemswindow.setTitle(" Items of Type "+co+" including subtypes");
            	itemswindow.center();
            	itemswindow.show();
            	
        		
        	}else{
        		itemswindow.setTitle(" Items of Type "+co+" including subtypes");
        		itemswindow.removeAll();
        		itemswindow.add(grid);
        		itemswindow.doLayout();
        		itemswindow.show();
        	}
        } else {
            Ext.Msg.alert('Error', 'Please select a type from the grid');
            //Ext.getBody().unmask();
        }
        
    }
   
});
var contextMenu = Ext.create('Ext.menu.Menu', {
    items: [
        attributesAction,
        itemsAction4,
        itemsAction,
        itemsAction3
    ]
});

Ext.define('Ext.ux.LiveSearchGridPanel', {
    extend: 'Ext.grid.Panel',
    requires: [
        'Ext.toolbar.TextItem',
        'Ext.form.field.Checkbox',
        'Ext.form.field.Text'
        
    ],
    
    /**
     * @private
     * search value initialization
     */
    searchValue: null,
    
    /**
     * @private
     * The row indexes where matching strings are found. (used by previous and next buttons)
     */
    indexes: [],
    
    /**
     * @private
     * The row index of the first search, it could change if next or previous buttons are used.
     */
    currentIndex: null,
    
    /**
     * @private
     * The generated regular expression used for searching.
     */
    searchRegExp: null,
    
    /**
     * @private
     * Case sensitive mode.
     */
    caseSensitive: false,
    
    /**
     * @private
     * Regular expression mode.
     */
    regExpMode: false,
    
    /**
     * @cfg {String} matchCls
     * The matched string css classe.
     */
    matchCls: 'x-livesearch-match',
    
    defaultStatusText: 'Nothing Found',
    
    
    // Component initialization override: adds the top and bottom toolbars and setup headers renderer.
    initComponent: function() {
        var me = this;
        me.tbar = ['Search',{
                 xtype: 'textfield',
                 name: 'searchField',
                 hideLabel: true,
                 width: 160,
                 listeners: {
                     change: {
                         fn: me.onTextFieldChange,
                         scope: this,
                         buffer: 100
                     }
                 }
            }, {
                xtype: 'button',
                text: '&lt;',
                tooltip: 'Find Previous Row',
                handler: me.onPreviousClick,
                scope: me
            },{
                xtype: 'button',
                text: '&gt;',
                tooltip: 'Find Next Row',
                handler: me.onNextClick,
                scope: me
            }, '-', {
                xtype: 'checkbox',
                hideLabel: true,
                margin: '0 0 0 4px',
                handler: me.regExpToggle,
                scope: me                
            }, 'Regular expression', {
                xtype: 'checkbox',
                hideLabel: true,
                margin: '0 0 0 4px',
                handler: me.caseSensitiveToggle,
                scope: me
            }, 'Case sensitive'];

        me.bbar = Ext.create('Ext.ux.StatusBar', {
            defaultText: me.defaultStatusText,
            name: 'searchStatusBar'
        });
        
        me.callParent(arguments);
    },
    
    // afterRender override: it adds textfield and statusbar reference and start monitoring keydown events in textfield input 
    afterRender: function() {
        var me = this;
        me.callParent(arguments);
        me.textField = me.down('textfield[name=searchField]');
        me.statusBar = me.down('statusbar[name=searchStatusBar]');
    },
    // detects html tag
    tagsRe: /<[^>]*>/gm,
    
    // DEL ASCII code
    tagsProtect: '\x0f',
    
    // detects regexp reserved word
    regExpProtect: /\\|\/|\+|\\|\.|\[|\]|\{|\}|\?|\$|\*|\^|\|/gm,
    
    /**
     * In normal mode it returns the value with protected regexp characters.
     * In regular expression mode it returns the raw value except if the regexp is invalid.
     * @return {String} The value to process or null if the textfield value is blank or invalid.
     * @private
     */
    getSearchValue: function() {
        var me = this,
            value = me.textField.getValue();
            
        if (value === '') {
            return null;
        }
        if (!me.regExpMode) {
            value = value.replace(me.regExpProtect, function(m) {
                return '\\' + m;
            });
        } else {
            try {
                new RegExp(value);
            } catch (error) {
                me.statusBar.setStatus({
                    text: error.message,
                    iconCls: 'x-status-error'
                });
                return null;
            }
            // this is stupid
            if (value === '^' || value === '$') {
                return null;
            }
        }

        return value;
    },
    
    /**
     * Finds all strings that matches the searched value in each grid cells.
     * @private
     */
     onTextFieldChange: function() {
         var me = this,
             count = 0;

         me.view.refresh();
         // reset the statusbar
         me.statusBar.setStatus({
             text: me.defaultStatusText,
             iconCls: ''
         });

         me.searchValue = me.getSearchValue();
         me.indexes = [];
         me.currentIndex = null;

         if (me.searchValue !== null) {
             me.searchRegExp = new RegExp(me.searchValue, 'g' + (me.caseSensitive ? '' : 'i'));
             
             
             me.store.each(function(record, idx) {
                 var td = Ext.fly(me.view.getNode(idx)).down('td'),
                     cell, matches, cellHTML;
                 while(td) {
                     cell = td.down('.x-grid-cell-inner');
                     matches = cell.dom.innerHTML.match(me.tagsRe);
                     cellHTML = cell.dom.innerHTML.replace(me.tagsRe, me.tagsProtect);
                     
                     // populate indexes array, set currentIndex, and replace wrap matched string in a span
                     cellHTML = cellHTML.replace(me.searchRegExp, function(m) {
                        count += 1;
                        if (Ext.Array.indexOf(me.indexes, idx) === -1) {
                            me.indexes.push(idx);
                        }
                        if (me.currentIndex === null) {
                            me.currentIndex = idx;
                        }
                        return '<span class="' + me.matchCls + '">' + m + '</span>';
                     });
                     // restore protected tags
                     Ext.each(matches, function(match) {
                        cellHTML = cellHTML.replace(me.tagsProtect, match); 
                     });
                     // update cell html
                     cell.dom.innerHTML = cellHTML;
                     td = td.next();
                 }
             }, me);

             // results found
             if (me.currentIndex !== null) {
                 me.getSelectionModel().select(me.currentIndex);
                 me.statusBar.setStatus({
                     text: count + ' matche(s) found.',
                     iconCls: 'x-status-valid'
                 });
             }
         }

         // no results found
         if (me.currentIndex === null) {
             me.getSelectionModel().deselectAll();
         }

         // force textfield focus
         me.textField.focus();
     },
    
    /**
     * Selects the previous row containing a match.
     * @private
     */   
    onPreviousClick: function() {
        var me = this,
            idx;
            
        if ((idx = Ext.Array.indexOf(me.indexes, me.currentIndex)) !== -1) {
            me.currentIndex = me.indexes[idx - 1] || me.indexes[me.indexes.length - 1];
            me.getSelectionModel().select(me.currentIndex);
         }
    },
    
    /**
     * Selects the next row containing a match.
     * @private
     */    
    onNextClick: function() {
         var me = this,
             idx;
             
         if ((idx = Ext.Array.indexOf(me.indexes, me.currentIndex)) !== -1) {
            me.currentIndex = me.indexes[idx + 1] || me.indexes[0];
            me.getSelectionModel().select(me.currentIndex);
         }
    },
    
    /**
     * Switch to case sensitive mode.
     * @private
     */    
    caseSensitiveToggle: function(checkbox, checked) {
        this.caseSensitive = checked;
        this.onTextFieldChange();
    },
    
    /**
     * Switch to regular expression mode
     * @private
     */
    regExpToggle: function(checkbox, checked) {
        this.regExpMode = checked;
        this.onTextFieldChange();
    }
});


Ext.define('Ext.ux.LiveSearchGridPagingPanel', {
    extend: 'Ext.grid.Panel',
    requires: [
        'Ext.toolbar.TextItem',
        'Ext.form.field.Checkbox',
        'Ext.form.field.Text'
        
    ],
    
    /**
     * @private
     * search value initialization
     */
    searchValue: null,
    
    /**
     * @private
     * The row indexes where matching strings are found. (used by previous and next buttons)
     */
    indexes: [],
    
    /**
     * @private
     * The row index of the first search, it could change if next or previous buttons are used.
     */
    currentIndex: null,
    
    /**
     * @private
     * The generated regular expression used for searching.
     */
    searchRegExp: null,
    
    /**
     * @private
     * Case sensitive mode.
     */
    caseSensitive: false,
    
    /**
     * @private
     * Regular expression mode.
     */
    regExpMode: false,
    
    /**
     * @cfg {String} matchCls
     * The matched string css classe.
     */
    matchCls: 'x-livesearch-match',
    
    defaultStatusText: 'Nothing Found',
    
    
    // Component initialization override: adds the top and bottom toolbars and setup headers renderer.
    initComponent: function() {
        var me = this;
        me.tbar = ['Search',{
                 xtype: 'textfield',
                 name: 'searchField',
                 hideLabel: true,
                 width: 160,
                 listeners: {
                     change: {
                         fn: me.onTextFieldChange,
                         scope: this,
                         buffer: 100
                     }
                 }
            }, {
                xtype: 'button',
                text: '&lt;',
                tooltip: 'Find Previous Row',
                handler: me.onPreviousClick,
                scope: me
            },{
                xtype: 'button',
                text: '&gt;',
                tooltip: 'Find Next Row',
                handler: me.onNextClick,
                scope: me
            }, '-', {
                xtype: 'checkbox',
                hideLabel: true,
                margin: '0 0 0 4px',
                handler: me.regExpToggle,
                scope: me                
            }, 'Regular expression', {
                xtype: 'checkbox',
                hideLabel: true,
                margin: '0 0 0 4px',
                handler: me.caseSensitiveToggle,
                scope: me
            }, 'Case sensitive'];

       
        
        me.callParent(arguments);
    },
    
    // afterRender override: it adds textfield and statusbar reference and start monitoring keydown events in textfield input 
    afterRender: function() {
        var me = this;
        me.callParent(arguments);
        me.textField = me.down('textfield[name=searchField]');
    },
    // detects html tag
    tagsRe: /<[^>]*>/gm,
    
    // DEL ASCII code
    tagsProtect: '\x0f',
    
    // detects regexp reserved word
    regExpProtect: /\\|\/|\+|\\|\.|\[|\]|\{|\}|\?|\$|\*|\^|\|/gm,
    
    /**
     * In normal mode it returns the value with protected regexp characters.
     * In regular expression mode it returns the raw value except if the regexp is invalid.
     * @return {String} The value to process or null if the textfield value is blank or invalid.
     * @private
     */
    getSearchValue: function() {
        var me = this,
            value = me.textField.getValue();
            
        if (value === '') {
            return null;
        }
        if (!me.regExpMode) {
            value = value.replace(me.regExpProtect, function(m) {
                return '\\' + m;
            });
        } else {
            try {
                new RegExp(value);
            } catch (error) {
               
                return null;
            }
            // this is stupid
            if (value === '^' || value === '$') {
                return null;
            }
        }

        return value;
    },
    
    /**
     * Finds all strings that matches the searched value in each grid cells.
     * @private
     */
     onTextFieldChange: function() {
         var me = this,
             count = 0;

         me.view.refresh();
        

         me.searchValue = me.getSearchValue();
         me.indexes = [];
         me.currentIndex = null;

         if (me.searchValue !== null) {
             me.searchRegExp = new RegExp(me.searchValue, 'g' + (me.caseSensitive ? '' : 'i'));
             
             
             me.store.each(function(record, idx) {
                 var td = Ext.fly(me.view.getNode(idx)).down('td'),
                     cell, matches, cellHTML;
                 while(td) {
                     cell = td.down('.x-grid-cell-inner');
                     matches = cell.dom.innerHTML.match(me.tagsRe);
                     cellHTML = cell.dom.innerHTML.replace(me.tagsRe, me.tagsProtect);
                     
                     // populate indexes array, set currentIndex, and replace wrap matched string in a span
                     cellHTML = cellHTML.replace(me.searchRegExp, function(m) {
                        count += 1;
                        if (Ext.Array.indexOf(me.indexes, idx) === -1) {
                            me.indexes.push(idx);
                        }
                        if (me.currentIndex === null) {
                            me.currentIndex = idx;
                        }
                        return '<span class="' + me.matchCls + '">' + m + '</span>';
                     });
                     // restore protected tags
                     Ext.each(matches, function(match) {
                        cellHTML = cellHTML.replace(me.tagsProtect, match); 
                     });
                     // update cell html
                     cell.dom.innerHTML = cellHTML;
                     td = td.next();
                 }
             }, me);

             // results found
             if (me.currentIndex !== null) {
                 me.getSelectionModel().select(me.currentIndex);
                
             }
         }

         // no results found
         if (me.currentIndex === null) {
             me.getSelectionModel().deselectAll();
         }

         // force textfield focus
         me.textField.focus();
     },
    
    /**
     * Selects the previous row containing a match.
     * @private
     */   
    onPreviousClick: function() {
        var me = this,
            idx;
            
        if ((idx = Ext.Array.indexOf(me.indexes, me.currentIndex)) !== -1) {
            me.currentIndex = me.indexes[idx - 1] || me.indexes[me.indexes.length - 1];
            me.getSelectionModel().select(me.currentIndex);
         }
    },
    
    /**
     * Selects the next row containing a match.
     * @private
     */    
    onNextClick: function() {
         var me = this,
             idx;
             
         if ((idx = Ext.Array.indexOf(me.indexes, me.currentIndex)) !== -1) {
            me.currentIndex = me.indexes[idx + 1] || me.indexes[0];
            me.getSelectionModel().select(me.currentIndex);
         }
    },
    
    /**
     * Switch to case sensitive mode.
     * @private
     */    
    caseSensitiveToggle: function(checkbox, checked) {
        this.caseSensitive = checked;
        this.onTextFieldChange();
    },
    
    /**
     * Switch to regular expression mode
     * @private
     */
    regExpToggle: function(checkbox, checked) {
        this.regExpMode = checked;
        this.onTextFieldChange();
    }
});




Ext.define('hybrisDesktop.TypeBrowser', {
    extend: 'Ext.ux.desktop.Module',

    requires: [
        'Ext.data.ArrayStore',
        'Ext.util.Format',
        'Ext.grid.Panel',
        'Ext.grid.RowNumberer'
    ],

    id:'TypeBrowser-win',

    init : function(){
        this.launcher = {
            text: 'TypeBrowser',
            iconCls:'icon-typebrowser'
        };
    },

    createWindow : function(){
    	
    	//============================
    		console.log("hallo");
    		Ext.state.Manager.setProvider(Ext.create('Ext.state.CookieProvider'));
    		
    		Ext.QuickTips.init();
    		Ext.apply(Ext.tip.QuickTipManager.getQuickTip(), {
    		    maxWidth: 800,
    		    minWidth: 100,
    		    showDelay: 50      // Show 50ms after entering target
    		});
    	    /**
    	     * Custom function used for column renderer
    	     * @param {Object} val
    	     */
    	    function change(val){
    	        if(val > 0){
    	            return '<span style="color:green;">' + val + '</span>';
    	        }else if(val < 0){
    	            return '<span style="color:red;">' + val + '</span>';
    	        }
    	        return val;
    	    }

    	    /**
    	     * Custom function used for column renderer
    	     * @param {Object} val
    	     */
    	    function pctChange(val){
    	        if(val > 0){
    	            return '<span style="color:green;">' + val + '%</span>';
    	        }else if(val < 0){
    	            return '<span style="color:red;">' + val + '%</span>';
    	        }
    	        return val;
    	    }        
    	 // create the data store
    	    attributesstore = Ext.create('Ext.data.Store', {
    	        autoLoad: false,
    	        autoSync: true,
    	        model: 'hAttributes',
    	        proxy: {
    	            type: 'rest',
    	            url: 'services/showatrributes.do?typepk='+typepk,
    	            reader: {
    	                type: 'json'
    	                
    	            }
    	            
    	        }
    	    });
    	 // create the Grid, see Ext.
    	    alsgp = Ext.create('Ext.ux.LiveSearchGridPanel', {
    	        store: attributesstore,
    	        columnLines: true,
    	        columns: [
    				{
    				    text     : 'Type', 
    				    //width    : 35,
    				    flex     : 20,
    				    sortable : true, 
    				    dataIndex: 'type'
    				},

    	            {
    	                text     : 'Database Cloumn', 
    	                //width    : 75, 
    	                flex     : 20,
    				    sortable : true, 
    	                dataIndex: 'databaseColumn'
    	                
    	            },
    	            {
    	                text     : 'Qualifier',
    	                flex     : 20,
    	                //width    : 100, 
    	                sortable : true, 
    	                dataIndex: 'qualifier'
    	            },
    	            {
    	                text     : 'PK',
    	                flex     : 20,
    	                //width    : 100, 
    	                sortable : true, 
    	                dataIndex: 'attributepk'
    	            },
    	            {
    	                text     : 'Extension',
    	                flex     : 20,
    	                //width    : 100, 
    	                sortable : true, 
    	                dataIndex: 'aextensionname'
    	            }
    	        ],
    	        height: '100%',
    	        width: '100%',
    	        
    	        viewConfig: {
    	            stripeRows: true
    	        }
    	    });
    	    // create the data store
    	    var typestore = Ext.create('Ext.data.Store', {
    	        autoLoad: true,
    	        autoSync: true,
    	        model: 'hTypes',
    	        proxy: {
    	            type: 'rest',
    	            url: 'services/showtypes.do',
    	            reader: {
    	                type: 'json'
    	                
    	            }
    	            
    	        },
    	        listeners: {
    	        	load: function(){
    	        		cp.setTitle("<img border='0' src='images/favicon.ico' height='16' width='16' />Types ("+typestore.getCount()+")");
    	        		}
    	        	}
    	    });
    	    
    	    //===========================================
    	    var m = [2, 20, 2, 20],
    	    wdefault =6200,
    	    hdefault =6000,
    	    w = wdefault - m[1] - m[3],
    	    h = hdefault - m[0] - m[2],
    	    i = 0,
    	    scale =3,
    	    att,
    	    //zoomListener,
    	    root;

    		var tree = d3.layout.tree().size([h, w]);
    		var diagonal = d3.svg.diagonal().projection(function(d) { return [d.y, d.x]; });
    	    var panelId;
    	    
    	    var vistree;
    	    
    	    function toggle(d) {
    	  	  if (d.children) {
    	  	    d._children = d.children;
    	  	    d.children = null;
    	  	  } else {
    	  	    d.children = d._children;
    	  	    d._children = null;
    	  	  }
    	  	}
    	    
    	    function update2(source) {
    	  	  var duration = d3.event && d3.event.altKey ? 5000 : 500;

    	  	  // Compute the new tree layout.
    	  	  var nodes = tree.nodes(root).reverse();

    	  	  // Normalize for fixed-depth.
    	  	  nodes.forEach(function(d) { d.y = d.depth * 180;});

    	  	  // Update the nodes鈥�
    	  	  var node = vistree.selectAll("g.node")
    	  	      .data(nodes, function(d) { return d.id || (d.id = ++i); });
    	  	  
    	  	  
    	  	  // Enter any new nodes at the parent's previous position.
    	  	  var nodeEnter = node.enter().append("svg:g")
    	  	      .attr("class", "node")
    	  	      .attr("transform", function(d) { return "translate(" + source.y0 + "," + source.x0 + ")"; })
    	  	      .on("click", function(d) { toggle(d); update2(d); })
    		    	  .on("mouseover", function(d) {
    		    	      var g = d3.select(this); // The node
    		    	      // The class is used to remove the additional text later
    		    	      var info = g.append('text')
    		    	         .classed('info', true)
    		    	         .attr('x', 20)
    		    	         .attr('y', 10)
    		    	         .style("font-size","25px")
    		    	         .style("fill", "#CD0303")
    		    	         .text(d.name);
    		    	      
    		    	      /*var info2 = g.append('text')
    		    	         .classed('info2', true)
    		    	         .attr("transform","translate(0, 23)")
    		    	         .attr('x', 20)
    		    	         .attr('y', 10)
    		    	         .style("font-size","25px")
    		    	         .style("fill", "#CD0303")
    		    	         .text("sdfsfsdf");*/
    		    	         
    		    	  })
    		    	  .on("mouseout", function() {
    		    	      // Remove the info text on mouse out.
    		    	      d3.select(this).select('text.info').remove();
    		    	      //d3.select(this).select('text.info2').remove();
    		    	  });
    	  	     
    	  	  nodeEnter.append("svg:circle")
    	  	      .attr("r", 1e-6)
    	  	      .style("fill", function(d) { return d._children && d._children.length>0  ? "#0040FF" : "#fff"; });

    	  	  nodeEnter.append("svg:text")
    	  	      .attr("x", function(d) { return d.children || d._children ? -10 : 10; })
    	  	      .attr("dy", ".35em")
    	  	      .attr("text-anchor", function(d) { return d.children || d._children ? "end" : "start"; })
    	  	      .text(function(d) { return d.name; })
    	  	      .style("fill-opacity", 1e-6);

    	  	  // Transition nodes to their new position.
    	  	  var nodeUpdate = node.transition()
    	  	      .duration(duration)
    	  	      .attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; });

    	  	  nodeUpdate.select("circle")
    	  	      .attr("r", 4.5)
    	  	      .style("fill", function(d) { return d._children && d._children.length>0 ? "#0040FF" : "#fff"; });

    	  	  nodeUpdate.select("text")
    	  	      .style("fill-opacity", 1);

    	  	  // Transition exiting nodes to the parent's new position.
    	  	  var nodeExit = node.exit().transition()
    	  	      .duration(duration)
    	  	      .attr("transform", function(d) { return "translate(" + source.y + "," + source.x + ")"; })
    	  	      .remove();

    	  	  nodeExit.select("circle")
    	  	      .attr("r", 1e-6);

    	  	  nodeExit.select("text")
    	  	      .style("fill-opacity", 1e-6);

    	  	  // Update the links鈥�
    	  	  var link = vistree.selectAll("path.link")
    	  	      .data(tree.links(nodes), function(d) { return d.target.id; });

    	  	  // Enter any new links at the parent's previous position.
    	  	  link.enter().insert("svg:path", "g")
    	  	      .attr("class", "link")
    	  	      .attr("d", function(d) {
    	  	        var o = {x: source.x0, y: source.y0};
    	  	        return diagonal({source: o, target: o});
    	  	      })
    	  	    .transition()
    	  	      .duration(duration)
    	  	      .attr("d", diagonal);

    	  	  // Transition links to their new position.
    	  	  link.transition()
    	  	      .duration(duration)
    	  	      .attr("d", diagonal);

    	  	  // Transition exiting nodes to the parent's new position.
    	  	  link.exit().transition()
    	  	      .duration(duration)
    	  	      .attr("d", function(d) {
    	  	        var o = {x: source.x, y: source.y};
    	  	        return diagonal({source: o, target: o});
    	  	      })
    	  	      .remove();

    	  	  // Stash the old positions for transition.
    	  	  nodes.forEach(function(d) {
    	  	    d.x0 = d.x;
    	  	    d.y0 = d.y;
    	  	  });
    	  	  
    	  	  
    	  	}
    	    function update(source) {
    	    	  var duration = d3.event && d3.event.altKey ? 5000 : 500;

    	    	  // Compute the new tree layout.
    	    	  var nodes = tree.nodes(root).reverse();

    	    	  // Normalize for fixed-depth.
    	    	  nodes.forEach(function(d) { d.y = d.depth * 180; });

    	    	  // Update the nodes鈥�
    	    	  var node = vistree.selectAll("g.node")
    	    	      .data(nodes, function(d) { return d.id || (d.id = ++i); });
    	    	  
    	    	  
    	    	  // Enter any new nodes at the parent's previous position.
    	    	  var nodeEnter = node.enter().append("svg:g")
    	    	      .attr("class", "node")
    	    	      .attr("transform", function(d) { return "translate(" + source.y0 + "," + source.x0 + ")"; })
    	    	      .on("click", function(d) { toggle(d); update2(d); })
    		    	  .on("mouseover", function(d) {
    		    	      var g = d3.select(this); // The node
    		    	      // The class is used to remove the additional text later
    		    	      var info = g.append('text')
    		    	         .classed('info', true)
    		    	         .attr('x', 20)
    		    	         .attr('y', 10)
    		    	         .style("font-size","25px")
    		    	         .style("fill", "#CD0303")
    		    	         .text(d.name);
    		    	      
    		    	      /*var info2 = g.append('text')
    		    	         .classed('info2', true)
    		    	         .attr("transform","translate(0, 23)")
    		    	         .attr('x', 20)
    		    	         .attr('y', 10)
    		    	         .style("font-size","25px")
    		    	         .style("fill", "#CD0303")
    		    	         .text("sdfsfsdf");*/
    		    	         
    		    	  })
    		    	  .on("mouseout", function() {
    		    	      // Remove the info text on mouse out.
    		    	      d3.select(this).select('text.info').remove();
    		    	      //d3.select(this).select('text.info2').remove();
    		    	  });
    	    	     
    	    	  nodeEnter.append("svg:circle")
    	    	      .attr("r", 1e-6)
    	    	      .style("fill", function(d) { return d._children && d._children.length>0  ? "#0040FF" : "#fff"; });

    	    	  nodeEnter.append("svg:text")
    	    	      .attr("x", function(d) { return d.children || d._children ? -10 : 10; })
    	    	      .attr("dy", ".35em")
    	    	      .attr("text-anchor", function(d) { return d.children || d._children ? "end" : "start"; })
    	    	      .text(function(d) { return d.name; })
    	    	      .style("fill-opacity", 1e-6);

    	    	  // Transition nodes to their new position.
    	    	  var nodeUpdate = node.transition()
    	    	      .duration(duration)
    	    	      .attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; });

    	    	  nodeUpdate.select("circle")
    	    	      .attr("r", 4.5)
    	    	      .style("fill", function(d) { return d._children && d._children.length>0 ? "#0040FF" : "#fff"; });

    	    	  nodeUpdate.select("text")
    	    	      .style("fill-opacity", 1);

    	    	  // Transition exiting nodes to the parent's new position.
    	    	  var nodeExit = node.exit().transition()
    	    	      .duration(duration)
    	    	      .attr("transform", function(d) { return "translate(" + source.y + "," + source.x + ")"; })
    	    	      .remove();

    	    	  nodeExit.select("circle")
    	    	      .attr("r", 1e-6);

    	    	  nodeExit.select("text")
    	    	      .style("fill-opacity", 1e-6);

    	    	  // Update the links鈥�
    	    	  var link = vistree.selectAll("path.link")
    	    	      .data(tree.links(nodes), function(d) { return d.target.id; });

    	    	  // Enter any new links at the parent's previous position.
    	    	  link.enter().insert("svg:path", "g")
    	    	      .attr("class", "link")
    	    	      .attr("d", function(d) {
    	    	        var o = {x: source.x0, y: source.y0};
    	    	        return diagonal({source: o, target: o});
    	    	      })
    	    	    .transition()
    	    	      .duration(duration)
    	    	      .attr("d", diagonal);

    	    	  // Transition links to their new position.
    	    	  link.transition()
    	    	      .duration(duration)
    	    	      .attr("d", diagonal);

    	    	  // Transition exiting nodes to the parent's new position.
    	    	  link.exit().transition()
    	    	      .duration(duration)
    	    	      .attr("d", function(d) {
    	    	        var o = {x: source.x, y: source.y};
    	    	        return diagonal({source: o, target: o});
    	    	      })
    	    	      .remove();

    	    	  // Stash the old positions for transition.
    	    	  nodes.forEach(function(d) {
    	    	    d.x0 = d.x;
    	    	    d.y0 = d.y;
    	    	  });
    	    	  
    	    	  /*d3.select("svg")
    	          .call(d3.behavior.zoom()
    	                .scaleExtent([0.1, 5])
    	                .on("zoom", zoom));*/
    	    	}
    	    
    	    
    	    function zoom() {
    	        var scale = d3.event.scale,
    	            translation = d3.event.translate,
    	            tbound = -h * scale,
    	            bbound = h * scale,
    	            lbound = (-w + m[1]) * scale,
    	            rbound = (w - m[3]) * scale;
    	        // limit translation to thresholds
    	        translation = [
    	            Math.max(Math.min(translation[0], rbound), lbound),
    	            Math.max(Math.min(translation[1], bbound), tbound)
    	        ];
    	        d3.select(".drawarea")
    	            .attr("transform", "translate(" + translation + ")" +
    	                  " scale(" + scale + ")");
    	    }

    	    	// Toggle children.
    	    	
    	    function initCanvas(panel) {
    	    	
    	    	panelId = '#' + panel.id + '-innerCt';
    	    	vistree = d3.select(panelId).append("svg:svg")
    	        .attr("width", w + m[1] + m[3])
    	        .attr("height", h + m[0] + m[2])
    	        .style("overflow", "scroll")
    	        .attr("xmlns", "http://www.w3.org/2000/svg")
    	        .append("svg:g")
    	        .attr("class","drawarea")
    	        .append("svg:g")
    	        .attr("transform", "translate(" + m[3] + "," + m[0] + ")");
    	    	
    	    	
    	    	d3.select("svg")
    	        .call(d3.behavior.zoom()
    	              .scaleExtent([0.1, 5])
    	              .on("zoom", zoom));
    	    	
    	    	// create the zoom listener
    	    	/*zoomListener = d3.behavior.zoom()
    	    	  .scaleExtent([1, 10])
    	    	  .on("zoom", zoomHandler);*/

    	    	// function for handling zoom event
    	    	/*function zoomHandler() {
    	    		//vistree.attr("width", (w + m[1] + m[3])*d3.event.scale).attr("height", (h + m[0] + m[2])*d3.event.scale);
    	    	  vistree.attr("transform", "translate(" + m[3] + "," + m[0] + ")scale(" + d3.event.scale + ")");
    	    	  //p.doLayout();
    	    	}*/
    	    	//zoomListener(vistree);
    	        d3.json("services/showtypestree.do", function(json) {
    	        	  root = json;
    	        	  root.x0 = h / 2;
    	        	  root.y0 = 0;

    	        	  function toggleAll(d) {
    	        	    if (d.children) {
    	        	      d.children.forEach(toggleAll);
    	        	      toggle(d);
    	        	    }
    	        	  }

    	        	  // Initialize the display to show a few nodes.
    	        	  root.children.forEach(toggleAll);
    	        	  //toggle(root.children[1]);
    	        	  //toggle(root.children[1].children[2]);
    	        	  //toggle(root.children[9]);
    	        	  //toggle(root.children[9].children[0]);

    	        	  //update(root,tree,root,vis,i,diagonal);
    	        	  update(root);
    	        	 /* treewindow.addTool({
    	            	            	   xtype: 'component',
    	        	                       autoEl: {
    	        	                           tag: 'a',
    	        	                           href: 'data:application/octet-stream;base64,' + btoa(d3.select(panelId).html()),
    	        	                           html: 'Save',
    	        	                           download: "types.svg"
    	        	                       }
    	            	               });*/
    	        	});
    	    }

    	    
    	    
    	    //============================================
    	    // create the Grid, see Ext.
    	    lsgp = Ext.create('Ext.ux.LiveSearchGridPanel', {
    	        store: typestore,
    	        columnLines: true,
    	        columns: [
    	                  
    				{
    				    text     : 'Code', 
    				    //width    : 35,
    				    flex     : 25,
    				    sortable : true, 
    				    dataIndex: 'code'
    				},

    	            {
    	                text     : 'PK', 
    	                //width    : 75, 
    	                flex     : 25,
    				    sortable : true, 
    	                dataIndex: 'pk'
    	                
    	            },
    	            {
    	                text     : 'Supertype',
    	                flex     : 25,
    	                //width    : 100, 
    	                sortable : true, 
    	                dataIndex: 'codeofsupertype'
    	            },
    	            {
    	                text     : 'Extension',
    	                flex     : 25,
    	                //width    : 100, 
    	                sortable : true, 
    	                dataIndex: 'textensionname'
    	            }
    	        ],
    	        listeners: {
    	        	itemclick: function(dataview, record, item, index, e) {
    	            	//var panel = Ext.getCmp('ep');
    	            	//panel.expand();
    	        		//alert(e.getCharCode());
    	            	typepk = record.get('pk');
    	            	ep.setTitle("<img border='0' src='images/favicon.ico' height='16' width='16' /> Attributes of "+record.get('code'));
    	            	//Ext.Msg.alert('Status', typepk);
    	            	/*attributesstore = Ext.create('Ext.data.Store', {
    	                    autoLoad: true,
    	                    autoSync: true,
    	                    model: 'hAttributes',
    	                    proxy: {
    	                        type: 'rest',
    	                        url: 'showatrributes.do?typepk='+typepk,
    	                        reader: {
    	                            type: 'json'
    	                            
    	                        }
    	                        
    	                    }
    	                });*/
    	            	//alsgp.getStore().setProxy( String|Object|Ext.data.proxy.Proxy proxy);
    	            	attributesstore.getProxy().url = 'services/showatrributes.do?typepk='+typepk;
    	            	attributesstore.load();
    	            	alsgp.getView().refresh();
    	            	if(ep.collapsed)
    	            		ep.expand();
    	            },
    	            itemcontextmenu: function(view, rec, node, index, e) {
    	                e.stopEvent();
    	                contextMenu.showAt(e.getXY());
    	                return false;
    	            }
    	        }
    	        ,
    	        height: '100%',
    	        width: '100%',
    	        
    	        viewConfig: {
    	            stripeRows: true
    	        }
    	    });
    	    
    	    var p = Ext.create('Ext.Panel', {
    	        //title: 'bybris Type System',
    	        frame: false,
    	        border: true,
    	        //cls: 'cmp',
    	        //width: 1800,
    	        //height: 1200,
    	        //autoScroll: true,
    	        listeners: {
    	            afterrender: function (panel) {
    	                initCanvas(panel);
    	            }
    	        }
    	    });
    	    var s =[0.3,0.5,0.8,1,1.3,1.5,2,2.5,3];
    		cp = Ext.create('Ext.panel.Panel',{
    			region: 'center',
    	        collapsible: false,
    	        border:0,
    	        layout: 'fit',
    	        title: "<img border='0' src='images/favicon.ico' height='16' width='16' />Types",
    	        tools:[{
    	            type:'treetool',
    	            tooltip: 'Show&nbsp;Hierarchy',
    	            // hidden:true,
    	            handler: function(event, toolEl, panel){
    	            	//Ext.Msg.alert('Status', 'clicking tool');
    	            	if(treewindow ==null){
    	            		treewindow = Ext.create('Ext.Window', {
    	            	        title: 'Type Hierarchy',
    	            	        width: 600,
    	            	        height: 300,
    	            	        closeAction:'hide',
    	            	        maximizable: true,
    	            	        //plain: true,
    	            	        //headerPosition: 'left',
    	            	        layout: 'fit',
    	            	        tools:[
    	            	               {
    	            	                   type:'refresh',
    	            	                   tooltip: 'Refresh',
    	            	                   // hidden:true,
    	            	                   handler: function(event, toolEl, panel){
    	            	                	   d3.json("services/showtypestree.do", function(json) {
    	            	                     	  i=0;
    	            	                		   root = json;
    	            	                     	  root.x0 = h / 2;
    	            	                     	  root.y0 = 0;

    	            	                     	  function toggleAll(d) {
    	            	                     	    if (d.children) {
    	            	                     	      d.children.forEach(toggleAll);
    	            	                     	      toggle(d);
    	            	                     	    }
    	            	                     	  }

    	            	                     	  // Initialize the display to show a few nodes.
    	            	                     	  root.children.forEach(toggleAll);
    	            	                     	  //toggle(root.children[1]);
    	            	                     	  //toggle(root.children[1].children[2]);
    	            	                     	  //toggle(root.children[9]);
    	            	                     	  //toggle(root.children[9].children[0]);

    	            	                     	  update(root);
    	            	                     	});
    	            	                	  
    	            	                   }
    	            	               },
    	            	              {
    	            	                   type:'plus',
    	            	                   tooltip: 'Zoom-out',
    	            	                    hidden:true,
    	            	                    enable:false,
    	            	                   handler: function(event, toolEl, panel){
    	            	                	   scale=(scale+1)<9?scale+1:8;
    	            	                	   w=(wdefault - m[1] - m[3])*s[scale];
    	            	                	   h=(hdefault - m[0] - m[2])*s[scale];
    	            	                	   tree = d3.layout.tree().size([h, w]);
    	            	                	   //vistree.translate(m[3],m[0]).scale(scale);
    	            	                	   //vistree.remove();
    	            	                	   
    	            	                	 /*  tree = d3.layout.tree().size([h*scale, w*scale]);
    	            	                	   update(root);
    	            	                	   vistree.attr("transform", "translate(" + m[3] + "," + m[0] + ")scale(" + scale + ")");*/
    	            	                	   
    	            	                	   
    	            	                	   d3.select("svg").remove();
    	            	                	   initCanvas(p);
    	            	                	   //vistree.attr("transform", "translate(" + m[3] + "," + m[0] + ")scale(" + s[scale] + ")");
    	            	                	  // vistree.attr("transform", "translate(" + m[3] + "," + m[0] + ")scale(" + scale + ")");
    	            	                	   //zoomListener.scale(scale);
    	            	                	// activate the zoom event
    	            	                	// pass in the transition with duration 500ms
    	            	                	   //zoomListener.event(vistree.transition().duration(1000));
    	            	                   }
    	            	               },
    	            	               {
    	            	                   type:'minus',
    	            	                   tooltip: 'Zoom-in',
    	            	                   hidden:true,
    	            	                   enable:false,
    	            	                   handler: function(event, toolEl, panel){
    	            	                	   scale=(scale-1)>0?scale-1:0;
    	            	                	   w=(wdefault - m[1] - m[3])*s[scale];
    	            	                	   h=(hdefault - m[0] - m[2])*s[scale];
    	            	                	   tree = d3.layout.tree().size([h, w]);
    	            	                	   //vistree.translate(m[3],m[0]).scale(scale);
    	            	                	   d3.select("svg").remove();
    	            	                	   initCanvas(p);
    	            	                	// activate the zoom event
    	            	                	// pass in the transition with duration 500ms
    	            	                	  // zoomListener.event(vistree.transition().duration(1000));
    	            	                   }
    	            	               },
    	            	               {
    	            	                   type:'expand',
    	            	                   tooltip: 'Expand',
    	            	                   // hidden:true,
    	            	                   handler: function(event, toolEl, panel){
    	            	                	   
    	            	                	  d3.json("services/showtypestree.do", function(json) {
    	            	                     	  root = json;
    	            	                     	  root.x0 = h / 2;
    	            	                     	  root.y0 = 0;

    	            	                     	  
    	            	                     	  update2(root);
    	            	                     	});
    	            	                	   
    	            	                   }
    	            	               },
    	            	               {
    	            	                   type:'collapse',
    	            	                   tooltip: 'Collapse',
    	            	                   // hidden:true,
    	            	                   handler: function(event, toolEl, panel){
    	            	                	   d3.json("services/showtypestree.do", function(json) {
    	            	                     	  root = json;
    	            	                     	  root.x0 = h / 2;
    	            	                     	  root.y0 = 0;

    	            	                     	  function toggleAll(d) {
    	            	                     	    if (d.children) {
    	            	                     	      d.children.forEach(toggleAll);
    	            	                     	      toggle(d);
    	            	                     	    }
    	            	                     	  }
    	            	                     	 root.children.forEach(toggleAll);
    	            	                     	  update2(root);
    	            	                     	});
    	            	                   }
    	            	               },
    	            	               {
    	            	                   type:'save',
    	            	                   tooltip: 'Save',
    	            	                   // hidden:true,
    	            	                   handler: function(event, toolEl, panel){
    	            	                	 var svg = d3.select("svg");//document.getElementById("svg");
    	            	                	   var serializer = new XMLSerializer();
    	            	                	   var source = serializer.serializeToString(svg[0][0]);
    	            	                	   source = source.replace(/255, 255, 255/g, "0,102,255"); 
    	            	                	   source = source.replace(/\/><path/g, " stroke=\"red\" stroke-width=\"3\" fill=\"none\"/><path");
    	            	                	   source = source.replace(/\/><g/g, " stroke=\"red\" stroke-width=\"3\" fill=\"none\"/><g");
    	            	                	   
    	            	                	   var pom = document.createElement('a');
    	            	                	   
    	            	                	   pom.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(source));
    	            	                	   pom.setAttribute('download', "typetree.svg");
    	            	                	   pom.style.display = 'none';
    	            	                	   document.body.appendChild(pom);

    	            	                	   pom.click();

    	            	                	   document.body.removeChild(pom);
    	            	                	  
    	            	                   }
    	            	               }
    	            	               ],
    	            	        items: [
    	            	        	p
    	            	        ]
    	            	        
    	            	    });
    	            		treewindow.center();
    	            		treewindow.show();
    	            		
    	            	}else{
    	            		//treewindow.center();
    	            		treewindow.show();
    	            	}
    	            }
    	        },
    	        {
    	            type:'refresh',
    	            tooltip: 'Refresh',
    	            // hidden:true,
    	            handler: function(event, toolEl, panel){
    	            	lsgp.getStore().reload();
    	            }
    	        },
    	        {
    	        	type:'help',
    	        	tooltip: 'Readme',
    	        	handler: function(event, toolEl, panel){
    	        		function showResult(btn){
    	        			var w = new Ext.Window({
      	        			  autoLoad: {
      	        			    url: "Readme.htm",
      	        			    text: "Loading...",
      	        			    timeout: 60,
      	        			    scripts: false 
      	        			  },
      	        			  closeAction:'destroy',
      	        			  autoScroll: true,
      	          	          maximizable: false,
      	        			  height: 600,
      	        			  width: 800
      	        			});
      	        		w.center();
      	        		w.show();
    	        	    };
    	        		Ext.MessageBox.show({
    	                    title: 'Any problems?',
    	                    msg: 'please contact tao.jiang02@sap.com',
    	                    buttons: Ext.MessageBox.YES,
    	                    buttonText:{ 
    	                        yes: "Got it!", 
    	                    },
    	                    fn: showResult
    	                });
    	        		
    	        		
    	        	}
    	        }],
    	        items: [lsgp],
    	        split: true,
    	        width: '40%',
    	        minWidth: 100,
    	        minHeight: 160,
    	        itemId: 'cp',
    	        stateId: 'centerRegion',
    	        stateful: true,
    	        html: 'center'
    		});
    		ep = Ext.create('Ext.panel.Panel',{
    			region: 'east',
    	        collapsible: true,
    	        collapsed:true,
    	        layout: 'fit',
    	        border:0,
    	        items: [alsgp],
    	        title: "<img border='0' src='images/favicon.ico' height='16' width='16' />Attributes",
    	        tools:[
    	        {
    	            type:'refresh',
    	            tooltip: 'Refresh',
    	            // hidden:true,
    	            handler: function(event, toolEl, panel){
    	            	alsgp.getStore().reload();
    	            }
    	        }],
    	        split: true,
    	        width: '60%',
    	        minWidth: 100,
    	        itemId: 'ep',
    	        minHeight: 160,
    	        //bodyPadding: 10,
    	        stateId: 'eastRegion',
    	        stateful: true,
    	        html: 'east'
    		});

    	
    	
    	
        var desktop = this.app.getDesktop();
        var win = desktop.getWindow('TypeBrowser-win');
        if(!win){
            win = desktop.createWindow({
                id: 'TypeBrowser-win',
                title:'TypeBrowser',
                width:740,
                height:480,
                iconCls: 'icon-typebrowser',
                animCollapse:true,
                constrainHeader:true,
                layout: {
    	            type: 'border',
    	            padding: 0
    	        },
    	        defaults: {
    	            split: true
    	        },
                items: [
        	            cp,
        	            ep
        	            
        	        ]
               
            });
        }
        return win;
    }
});

