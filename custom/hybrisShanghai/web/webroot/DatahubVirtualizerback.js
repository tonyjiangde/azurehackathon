Ext.define('KitchenSink.model.dd.Simple', {
    extend: 'Ext.data.Model',
    fields: ['name', 'column1', 'column2']    
});
Ext.define('KitchenSink.view.dd.GridToGrid', {
    extend: 'Ext.container.Container',
    alias: 'widget.g2gdd',
    requires: [
        'Ext.grid.*',
        'Ext.layout.container.HBox'
        
    ],    
    xtype: 'dd-grid-to-grid',
    
    
    width: 650,
    height: 300,
    layout: {
        type: 'hbox',
        align: 'stretch',
        padding: 5
    },
    
    myData: [
        { name : 'Rec 0', column1 : '0', column2 : '0' },
        { name : 'Rec 1', column1 : '1', column2 : '1' },
        { name : 'Rec 2', column1 : '2', column2 : '2' },
        { name : 'Rec 3', column1 : '3', column2 : '3' },
        { name : 'Rec 4', column1 : '4', column2 : '4' },
        { name : 'Rec 5', column1 : '5', column2 : '5' },
        { name : 'Rec 6', column1 : '6', column2 : '6' },
        { name : 'Rec 7', column1 : '7', column2 : '7' },
        { name : 'Rec 8', column1 : '8', column2 : '8' },
        { name : 'Rec 9', column1 : '9', column2 : '9' }
    ],
    
    initComponent: function(){
    	var tb = Ext.create('Ext.toolbar.Toolbar', {
    		dock: 'top',
    	    items: ['Type',
    	        {
    	            xtype    : 'textfield',
    	            name     : 'type',
    	            emptyText: 'enter a type name'
    	        }
    	    ]
    	});
        var group1 = this.id + 'group1',
            group2 = this.id + 'group2',
            columns = [{
                text: 'Record Name', 
                flex: 1, 
                sortable: true, 
                dataIndex: 'name'
            }, {
                text: 'column1', 
                width: 80, 
                sortable: true, 
                dataIndex: 'column1'
            }, {
                text: 'column2', 
                width: 80, 
                sortable: true, 
                dataIndex: 'column2'
            }];
            
        this.items = [{
            itemId: 'grid1',
            flex: 1,
            xtype: 'grid',
            multiSelect: true,
                viewConfig: {
                	copy: true,
                plugins: {
                    ptype: 'gridviewdragdrop',
                    dragGroup: group1,
                    dropGroup: group2
                },
                listeners: {
                    drop: function(node, data, dropRec, dropPosition) {
                        var dropOn = dropRec ? ' ' + dropPosition + ' ' + dropRec.get('name') : ' on empty view';
                        alert('Drag from right to left', 'Dropped ' + data.records[0].get('name') + dropOn);
                    }
                }
            },
            dockedItems: [tb],
            store: new Ext.data.Store({
                model: KitchenSink.model.dd.Simple,
                data: this.myData
            }),
            columns: columns,
            stripeRows: true,
            title: 'First Grid',
            tools: [{
                type: 'refresh',
                tooltip: 'Reset both grids',
                scope: this,
                handler: this.onResetClick
            }],
            margins: '0 5 0 0'
        }, {
            itemId: 'grid2',
            flex: 1,
            xtype: 'grid',
            viewConfig: {
                plugins: {
                    ptype: 'gridviewdragdrop',
                    dragGroup: group2,
                    dropGroup: 'rawItemDD'
                },
                listeners: {
                    drop: function(node, data, dropRec, dropPosition) {
                        var dropOn = dropRec ? ' ' + dropPosition + ' ' + dropRec.get('name') : ' on empty view';
                        alert('Drag from left to right', 'Dropped ' + data.records[0].get('name') + dropOn);
                    }
                }
            },
            store: new Ext.data.Store({
                model: KitchenSink.model.dd.Simple
            }),
            columns: columns,
            stripeRows: true,
            title: 'Second Grid'
        },
        {
            xtype: 'rawItemGrid',
            	flex: 1,
            	gdata: [
                        { name : 'Rec 0', column1 : '0', column2 : '0' },
                        { name : 'Rec 1', column1 : '1', column2 : '1' },
                        { name : 'Rec 2', column1 : '2', column2 : '2' },
                        { name : 'Rec 3', column1 : '3', column2 : '3' },
                        { name : 'Rec 4', column1 : '4', column2 : '4' },
                        { name : 'Rec 5', column1 : '5', column2 : '5' },
                        { name : 'Rec 6', column1 : '6', column2 : '6' },
                        { name : 'Rec 7', column1 : '7', column2 : '7' },
                        { name : 'Rec 8', column1 : '8', column2 : '8' },
                        { name : 'Rec 9', column1 : '9', column2 : '9' }
                    ]
        }];

        this.callParent();
    },
    
    onResetClick: function(){
        //refresh source grid
        this.down('#grid1').getStore().loadData(this.myData);

        //purge destination grid
        this.down('#grid2').getStore().removeAll();
    }
});

Ext.define('hybrisDesktop.DatahubVirtualizer.RawItemGrid', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.rawItemGrid',
    	
         multiSelect: true,
         viewConfig: {
             	copy: true,
             plugins: {
                 ptype: 'gridviewdragdrop',
                 dragGroup: 'rawItemDD'
             }
         },
         initComponent: function(){
         	if(this.gdata){
         		//this.store.data = this.gdata;
         		this.store.loadData(this.gdata);
         	} ;
         	 this.callParent(this);
          },
        
         store: new Ext.data.Store({
             model: KitchenSink.model.dd.Simple
            
         }),
         columns: [{
             text: 'Record Name', 
             flex: 1, 
             sortable: true, 
             dataIndex: 'name'
         }, {
             text: 'column1', 
             width: 80, 
             sortable: true, 
             dataIndex: 'column1'
         }, {
             text: 'column2', 
             width: 80, 
             sortable: true, 
             dataIndex: 'column2'
         }],
         stripeRows: true,
         title: 'RatItem',
         tools: [{
             type: 'refresh',
             tooltip: 'Reset both grids',
             scope: this,
             handler: this.onResetClick
         }],
         margins: '0 5 0 0',
   
         onResetClick: function(){

         }
    
}),
Ext.define('hybrisDesktop.DatahubVirtualizer.RawItemContainer', {
    extend: 'Ext.container.Container',
    alias: 'widget.rawItemContainer',
    initComponent: function() {
        if (!this.handler) {
            this.handler = function() {
                this.up('fieldset').remove(this);
                Ext.getCmp('impex-attributes').doLayout();
            };
        }
        if (!this.index) {
            this.index = 1;
        }
        this.layout = 'hbox';
        this.id = 'ed'+this.index,
        this.items = [{
                        xtype: 'container',
                        flex: 1,
                        
                        layout: 'anchor',
                        items: [{
                        	xtype: 'textfield',
                            fieldLabel: 'name',
                            name: 'name',
                            anchor: '95%',
                            labelWidth: 55,
                            emptyText: 'please enter a name'
                        }]
                    }, {
                        xtype: 'container',
                        layout: 'anchor',
                        items: [{
                            xtype: 'button',
                            handler: this.handler,
                            scope: this,
                            icon: this.buttonIcon,
                        }]
                    }
                   ];

        
        this.callParent(this);
    }
});




function jpImportDefaults() {
		jsPlumb.importDefaults({
			Endpoint : [ "Dot", {
				radius : 2
			} ],
			HoverPaintStyle : {
				strokeStyle : "#1e8151",
				lineWidth : 2
			},
			ConnectionOverlays : [ [ "Arrow", {
				location : 1,
				id : "arrow",
				length : 14,
				foldback : 0.8
			} ], [ "Label", {
				label : "",
				id : "label",
				cssClass : "aLabel"
			} ] ]
		});
	};

	function getJpRectangle(id, name, text, object, css) {

		var graphComponent;
		graphComponent = $('<div>').attr('id', id).attr('name', name).addClass(
				'item').text(text);

		if (!object) {
			graphComponent.attr('object', object);
		}
		graphComponent.css(css);
		return graphComponent;
	};

	function getJpRhombus(id, name, text, object, css) {
		console.log(css);
		var graphComponent;
		graphComponent = $('<div>').attr('id', id).attr('name', name).addClass(
				'decision');
		if (!object) {
			graphComponent.attr('object', object);
		}
		graphComponent.css(css);
		return graphComponent;
	};
	
	function longestWord(string) {
		var str = string.split(" ");
		var longest = 0;
		var word = null;
		for ( var i = 0; i < str.length; i++) {
			var checkedLetters = "";
			for ( var j = 0; j < str[i].length; j++) {
				if (/[a-zA-Z]/.test(str[i][j])) {
					checkedLetters += str[i][j];
				}
			}
			if (longest < checkedLetters.length) {
				longest = checkedLetters.length;
				word = checkedLetters;
			}
		}
		return word.length * str.length;
	};


Ext.define('hybrisDesktop.DatahubVirtualizer', {
    extend: 'Ext.ux.desktop.Module',

    requires: [
        'Ext.data.ArrayStore',
        'Ext.util.Format',
        'Ext.grid.Panel',
        'Ext.grid.RowNumberer'
    ],

    id:'DatahubVirtualizer-win',

    init : function(){
        this.launcher = {
            text: 'Datahub Virtualizer',
            iconCls:'icon-grid'
        };
    },

    createWindow : function(){
        var desktop = this.app.getDesktop();
        var win = desktop.getWindow('DatahubVirtualizer-win');
        if(!win){
            win = desktop.createWindow({
                id: 'DatahubVirtualizer-win',
                title:'Grid Window',
                width:1024,
                height:768,
                iconCls: 'icon-grid',
                animCollapse:false,
                constrainHeader:true,
                layout: 'fit',
                items: [
                        {
                        	xtype : 'g2gdd',
                        }
                        
                    /*{
					
					title : 'ExtJS - JSPlumb : flowchart',
					html : '<div id="fccontainer"></div>',
					//html: '<div id="drag-drop-demo" class="demo drag-drop-demo"><div class="window" id="dragDropWindow1">one<br/><br/><a href="#" class="cmdLink hide" rel="dragDropWindow1">toggle connections</a><br/><a href="#" class="cmdLink drag" rel="dragDropWindow1">disable dragging</a><br/><a href="#" class="cmdLink detach" rel="dragDropWindow1">detach all</a></div><div class="window" id="dragDropWindow2">two<br/><br/><a href="#" class="cmdLink hide" rel="dragDropWindow2">toggle connections</a><br/><a href="#" class="cmdLink drag" rel="dragDropWindow2">disable dragging</a><br/><a href="#" class="cmdLink detach" rel="dragDropWindow2">detach all</a></div><div class="window" id="dragDropWindow3">three<br/><br/><a href="#" class="cmdLink hide" rel="dragDropWindow3">toggle connections</a><br/><a href="#" class="cmdLink drag" rel="dragDropWindow3">disable dragging</a><br/><a href="#" class="cmdLink detach" rel="dragDropWindow3">detach all</a></div><div class="window" id="dragDropWindow4">four<br/><br/><a href="#" class="cmdLink hide" rel="dragDropWindow4">toggle connections</a><br/><a href="#" class="cmdLink drag" rel="dragDropWindow4">disable dragging</a><br/><a href="#" class="cmdLink detach" rel="dragDropWindow4">detach all</a></div><div id="list"></div></div>',
					listeners : {
						afterrender : function(panel, eopts) {
							console.log('panel rendered');
							panel.createDatahubVirtualizer(panel);
						}
					},
					test: function(panel) {
						 var listDiv = document.getElementById("list"),

					        showConnectionInfo = function (s) {
					            listDiv.innerHTML = s;
					            listDiv.style.display = "block";
					        },
					        hideConnectionInfo = function () {
					            listDiv.style.display = "none";
					        },
					        connections = [],
					        updateConnections = function (conn, remove) {
					            if (!remove) connections.push(conn);
					            else {
					                var idx = -1;
					                for (var i = 0; i < connections.length; i++) {
					                    if (connections[i] == conn) {
					                        idx = i;
					                        break;
					                    }
					                }
					                if (idx != -1) connections.splice(idx, 1);
					            }
					            if (connections.length > 0) {
					                var s = "<span><strong>Connections</strong></span><br/><br/><table><tr><th>Scope</th><th>Source</th><th>Target</th></tr>";
					                for (var j = 0; j < connections.length; j++) {
					                    s = s + "<tr><td>" + connections[j].scope + "</td>" + "<td>" + connections[j].sourceId + "</td><td>" + connections[j].targetId + "</td></tr>";
					                }
					                showConnectionInfo(s);
					            } else
					                hideConnectionInfo();
					        };

					    jsPlumb.ready(function () {

					        var instance = jsPlumb.getInstance({
					            DragOptions: { cursor: 'pointer', zIndex: 2000 },
					            PaintStyle: { strokeStyle: '#666' },
					            EndpointHoverStyle: { fillStyle: "orange" },
					            HoverPaintStyle: { strokeStyle: "orange" },
					            EndpointStyle: { width: 20, height: 16, strokeStyle: '#666' },
					            Endpoint: "Rectangle",
					            Anchors: ["TopCenter", "TopCenter"],
					            Container: "drag-drop-demo"
					        });

					        // suspend drawing and initialise.
					        instance.batch(function () {

					            // bind to connection/connectionDetached events, and update the list of connections on screen.
					            instance.bind("connection", function (info, originalEvent) {
					                updateConnections(info.connection);
					            });
					            instance.bind("connectionDetached", function (info, originalEvent) {
					                updateConnections(info.connection, true);
					            });

					            instance.bind("connectionMoved", function (info, originalEvent) {
					                //  only remove here, because a 'connection' event is also fired.
					                // in a future release of jsplumb this extra connection event will not
					                // be fired.
					                updateConnections(info.connection, true);
					            });

					            instance.bind("click", function (component, originalEvent) {
					                alert("click!")
					            });

					            // configure some drop options for use by all endpoints.
					            var exampleDropOptions = {
					                tolerance: "touch",
					                hoverClass: "dropHover",
					                activeClass: "dragActive"
					            };

					            //
					            // first example endpoint.  it's a 25x21 rectangle (the size is provided in the 'style' arg to the Endpoint),
					            // and it's both a source and target.  the 'scope' of this Endpoint is 'exampleConnection', meaning any connection
					            // starting from this Endpoint is of type 'exampleConnection' and can only be dropped on an Endpoint target
					            // that declares 'exampleEndpoint' as its drop scope, and also that
					            // only 'exampleConnection' types can be dropped here.
					            //
					            // the connection style for this endpoint is a Bezier curve (we didn't provide one, so we use the default), with a lineWidth of
					            // 5 pixels, and a gradient.
					            //
					            // there is a 'beforeDrop' interceptor on this endpoint which is used to allow the user to decide whether
					            // or not to allow a particular connection to be established.
					            //
					            var exampleColor = "#00f";
					            var exampleEndpoint = {
					                endpoint: "Rectangle",
					                paintStyle: { width: 25, height: 21, fillStyle: exampleColor },
					                isSource: true,
					                reattach: true,
					                scope: "blue",
					                connectorStyle: {
					                    gradient: {stops: [
					                        [0, exampleColor],
					                        [0.5, "#09098e"],
					                        [1, exampleColor]
					                    ]},
					                    lineWidth: 5,
					                    strokeStyle: exampleColor,
					                    dashstyle: "2 2"
					                },
					                isTarget: true,
					                beforeDrop: function (params) {
					                    return confirm("Connect " + params.sourceId + " to " + params.targetId + "?");
					                },
					                dropOptions: exampleDropOptions
					            };

					            //
					            // the second example uses a Dot of radius 15 as the endpoint marker, is both a source and target,
					            // and has scope 'exampleConnection2'.
					            //
					            var color2 = "#316b31";
					            var exampleEndpoint2 = {
					                endpoint: ["Dot", { radius: 11 }],
					                paintStyle: { fillStyle: color2 },
					                isSource: true,
					                scope: "green",
					                connectorStyle: { strokeStyle: color2, lineWidth: 6 },
					                connector: ["Bezier", { curviness: 63 } ],
					                maxConnections: 3,
					                isTarget: true,
					                dropOptions: exampleDropOptions
					            };

					            //
					            // the third example uses a Dot of radius 17 as the endpoint marker, is both a source and target, and has scope
					            // 'exampleConnection3'.  it uses a Straight connector, and the Anchor is created here (bottom left corner) and never
					            // overriden, so it appears in the same place on every element.
					            //
					            // this example also demonstrates the beforeDetach interceptor, which allows you to intercept
					            // a connection detach and decide whether or not you wish to allow it to proceed.
					            //
					            var example3Color = "rgba(229,219,61,0.5)";
					            var exampleEndpoint3 = {
					                endpoint: ["Dot", {radius: 17} ],
					                anchor: "BottomLeft",
					                paintStyle: { fillStyle: example3Color, opacity: 0.5 },
					                isSource: true,
					                scope: 'yellow',
					                connectorStyle: {
					                    strokeStyle: example3Color,
					                    lineWidth: 4
					                },
					                connector: "Straight",
					                isTarget: true,
					                dropOptions: exampleDropOptions,
					                beforeDetach: function (conn) {
					                    return confirm("Detach connection?");
					                },
					                onMaxConnections: function (info) {
					                    alert("Cannot drop connection " + info.connection.id + " : maxConnections has been reached on Endpoint " + info.endpoint.id);
					                }
					            };

					            // setup some empty endpoints.  again note the use of the three-arg method to reuse all the parameters except the location
					            // of the anchor (purely because we want to move the anchor around here; you could set it one time and forget about it though.)
					            var e1 = instance.addEndpoint('dragDropWindow1', { anchor: [0.5, 1, 0, 1] }, exampleEndpoint2);

					            // setup some DynamicAnchors for use with the blue endpoints
					            // and a function to set as the maxConnections callback.
					            var anchors = [
					                    [1, 0.2, 1, 0],
					                    [0.8, 1, 0, 1],
					                    [0, 0.8, -1, 0],
					                    [0.2, 0, 0, -1]
					                ],
					                maxConnectionsCallback = function (info) {
					                    alert("Cannot drop connection " + info.connection.id + " : maxConnections has been reached on Endpoint " + info.endpoint.id);
					                };

					            var e1 = instance.addEndpoint("dragDropWindow1", { anchor: anchors }, exampleEndpoint);
					            // you can bind for a maxConnections callback using a standard bind call, but you can also supply 'onMaxConnections' in an Endpoint definition - see exampleEndpoint3 above.
					            e1.bind("maxConnections", maxConnectionsCallback);

					            var e2 = instance.addEndpoint('dragDropWindow2', { anchor: [0.5, 1, 0, 1] }, exampleEndpoint);
					            // again we bind manually. it's starting to get tedious.  but now that i've done one of the blue endpoints this way, i have to do them all...
					            e2.bind("maxConnections", maxConnectionsCallback);
					            instance.addEndpoint('dragDropWindow2', { anchor: "RightMiddle" }, exampleEndpoint2);

					            var e3 = instance.addEndpoint("dragDropWindow3", { anchor: [0.25, 0, 0, -1] }, exampleEndpoint);
					            e3.bind("maxConnections", maxConnectionsCallback);
					            instance.addEndpoint("dragDropWindow3", { anchor: [0.75, 0, 0, -1] }, exampleEndpoint2);

					            var e4 = instance.addEndpoint("dragDropWindow4", { anchor: [1, 0.5, 1, 0] }, exampleEndpoint);
					            e4.bind("maxConnections", maxConnectionsCallback);
					            instance.addEndpoint("dragDropWindow4", { anchor: [0.25, 0, 0, -1] }, exampleEndpoint2);

					            // make .window divs draggable
					            instance.draggable(jsPlumb.getSelector(".drag-drop-demo .window"));

					            // add endpoint of type 3 using a selector.
					            instance.addEndpoint(jsPlumb.getSelector(".drag-drop-demo .window"), exampleEndpoint3);

					            var hideLinks = jsPlumb.getSelector(".drag-drop-demo .hide");
					            instance.on(hideLinks, "click", function (e) {
					                instance.toggleVisible(this.getAttribute("rel"));
					                jsPlumbUtil.consume(e);
					            });

					            var dragLinks = jsPlumb.getSelector(".drag-drop-demo .drag");
					            instance.on(dragLinks, "click", function (e) {
					                var s = instance.toggleDraggable(this.getAttribute("rel"));
					                this.innerHTML = (s ? 'disable dragging' : 'enable dragging');
					                jsPlumbUtil.consume(e);
					            });

					            var detachLinks = jsPlumb.getSelector(".drag-drop-demo .detach");
					            instance.on(detachLinks, "click", function (e) {
					                instance.detachAllConnections(this.getAttribute("rel"));
					                jsPlumbUtil.consume(e);
					            });

					            instance.on(document.getElementById("clear"), "click", function (e) {
					                instance.detachEveryConnection();
					                showConnectionInfo("");
					                jsPlumbUtil.consume(e);
					            });
					        });

					        jsPlumb.fire("jsPlumbDemoLoaded", instance);

					    });
					},
					createDatahubVirtualizer: function(panel) {
						
						var instance = jsPlumb.getInstance({
				            DragOptions: { cursor: 'pointer', zIndex: 2000 },
				            PaintStyle: { strokeStyle: '#666' },
				            EndpointHoverStyle: { fillStyle: "orange" },
				            HoverPaintStyle: { strokeStyle: "orange" },
				            EndpointStyle: { width: 20, height: 16, strokeStyle: '#666' },
				            Endpoint: "Rectangle",
				            Anchors: ["TopCenter", "TopCenter"],
				            Container: "drag-drop-demo"
				        });
						instance.setContainer($('#fccontainer'));
						instance.ready(function () {
							var bd = $('<div>').attr('id', 'bbbb').addClass(
							'datahub');
							var bd2 = $('<div>').attr('id', 'bbbb2').addClass(
							'datahub');
							bd.css({
								'top' : 1,
								'left' : 1,
							});
				           bd2.css({
								'top' : 100,
								'left' : 100,
							});
							$('#fccontainer').append(bd);
							$('#fccontainer').append(bd2);
							 var formPanelone = Ext.create('Ext.form.Panel', {
					                frame: true,
					                title: 'Form Fields',
					                height: 300,
					                width: 300,
					                layout: 'anchor',
                                    scope:this,
                                    
                                    defaults: {
                                        anchor: '100%'
                                    },
					                id: 'DatahubVirtualizerone',
					                resizable :true,
					                autoScroll: true,
					                bodyPadding: '0 0 0 0',
					                renderTo : 'bbbb',
					                fieldDefaults: {
					                    labelAlign: 'top',
					                    msgTarget: 'side',
					                    anchor: '100%'
					                },

					                items: [{
                                        xtype: 'fieldset',
                                        title: 'Attributes',
                                        itemId: 'attributes',
                                        collapsible: true,
                                        layout: 'anchor',
                                        fieldDefaults: {
                                            labelAlign: 'left'

                                        },
                                        defaults: {
                                            anchor: '100%'
                                        },
                                        items:[{
    					                    xtype: 'rawItemContainer',
    					                    buttonIcon: "images/add.png",
    					                    handler: function() {
    					                    	var i = this.up('fieldset').items.length+1;
                                                this.up('fieldset').add({
                                                    xtype: 'rawItemContainer',
                                                    buttonIcon: "images/minus.png",
                                                    index: i
                                                });
                                                console.log(i+"!!!");
                                                var e2 = instance.addEndpoint('ed'+i, { anchor: [1, 0.5, -1, 0] }, exampleEndpoint);   
                                                
                                            }
    					                }]
                                    }]
					            });
							 var formPaneltwo = Ext.create('Ext.form.Panel', {
					                frame: true,
					                title: 'Form Fields',
					                height: 300,
					                width: 300,
					                id: 'DatahubVirtualizertwo',
					                resizable :true,
					                autoScroll: false,
					                bodyPadding: '0 0 0 0',
					                renderTo : 'bbbb2',
					                fieldDefaults: {
					                    labelAlign: 'top',
					                    msgTarget: 'side',
					                    anchor: '100%'
					                },

					                items: [{
					                    xtype: 'textareafield',
					                    grow: true,
					                    //name: 'ImpexQuery',
					                    //fieldLabel: 'ImpexQuery',
					                    anchor: '100%, 100%',
					                    autoScroll: true
					                }]
					            });
							 var exampleDropOptions = {
						                tolerance: "touch",
						                hoverClass: "dropHover",
						                activeClass: "dragActive"
						            };
							 var exampleColor = "#00f";
					           var exampleEndpoint = {
					                endpoint: "Rectangle",
					                paintStyle: { width: 25, height: 21, fillStyle: exampleColor },
					                isSource: true,
					                reattach: true,
					                scope: "blue",
					                connectorStyle: {
					                    gradient: {stops: [
					                        [0, exampleColor],
					                        [0.5, "#09098e"],
					                        [1, exampleColor]
					                    ]},
					                    lineWidth: 5,
					                    strokeStyle: exampleColor,
					                    dashstyle: "2 2"
					                },
					                isTarget: true,
					                dropOptions: exampleDropOptions
					            };
					           var exampleGreyEndpointOptions = {
										  endpoint:"Rectangle",
										  paintStyle:{ width:25, height:21, fillStyle:'green' },
										  isSource:true,
										  connectorStyle : { strokeStyle:"red" },
										  isTarget:true
										};
					           var e1 = instance.addEndpoint('ed1', { anchor: [1, 0.5, -1, 0]}, exampleEndpoint);
					           //var e2 = instance.addEndpoint('DatahubVirtualizertwo', { anchor: "TopLeft" }, exampleEndpoint);
					          
							
							 instance.draggable(bd);
							 instance.draggable(bd2);
							 
					           instance.repaint($('#fccontainer'));
						 });
						
					},
					createflowchart : function(panel) {
						console.log('Initialise function : createjsplumb');
						jsPlumb.setContainer($('#fccontainer'));
						jpImportDefaults();
						var i = 0;
						var height = 0;
						var width = 0;
						var clickSource;
						var dec1 = panel.createDecision(clickSource, i, 50, 50,true);
						i++;
						var act1 = panel.createAction(clickSource, i, 300, 50,true);
						i++;

						$('#fccontainer').bind('contextmenu', function(e) {
							console.log(e);
							clickSource = e;
							e.preventDefault();
							contextMenu.showAt(e.pageX, e.pageY);
						});

						var contextMenu = new Ext.menu.Menu({
							items : [
									{
										text : 'Decision',

										handler : function() {
											console.log('Clicked : Decision')

											height += $('#' + i).height();
											width += $('#' + i).width();
											// console.log(height);
											i++;

											panel.createDecision(clickSource,
													i, clickSource.pageX,
													clickSource.pageY);
										}
									},
									{
										text : 'Action',
										handler : function() {
											console.log('Clicked : Action')
											// source = 'action';
											i++;
											panel.createAction(clickSource, i,
													clickSource.pageX,
													clickSource.pageY);
										}
									} ]
						});

						$('#fccontainer').dblclick(function(e) {
							console.log('dbc');
							// panel.createDecision(e,i);
						});
					},
					createDecision : function(e, i, x, y, isDefault) {
						if (isDefault == true) {
							resourceName = 'Condition 1'
						} else {
							resourceName = prompt('Enter Decision Title');
						}
						if (resourceName) {
							var title = $('<div>').addClass('decisionTitle')
									.text(resourceName);
							console.log(title.text());
							var connect = $('<div>').addClass('connect');
							var titlewidth = resourceName.length;
							var lword = longestWord(resourceName);

							var css = {
								'top' : y,
								'left' : x,
								'height' : 50 + 2 * titlewidth,
								'width' : 50 + 2 * titlewidth
							}
							var decisionState = getJpRhombus(i, resourceName,
									resourceName, null, css);
							console.log(decisionState.outerHTML);
							jsPlumb.makeTarget(decisionState, {
								anchor : 'Continuous'
							});

							jsPlumb.makeSource(connect, {
								parent : decisionState,
								anchor : 'Continuous',
								connector : [ "StateMachine", {
									curviness : 20
								} ],
								connectorStyle : {
									strokeStyle : "#5c96bc",
									lineWidth : 2,
									outlineColor : "transparent",
									outlineWidth : 4
								}
							});

							decisionState.append(title);
							decisionState.append(connect);

							$('#fccontainer').append(decisionState);

							jsPlumb.draggable(decisionState, {
								containment : 'parent'
							});

							i++;

						}
					},
					createAction : function(e, i, x, y, isDefault) {
						if (isDefault == true) {
							resourceName = 'Action 1';
						} else {
							resourceName = prompt('Enter action name');
						}
						if (resourceName) {
							var css = {
								'top' : y,
								'left' : x,
								'height' : 50,
								'width' : 50
							};
							var actionState = getJpRectangle(i, resourceName,
									resourceName, null, css);

							var connect = $('<div>').addClass('connect');

							jsPlumb.makeTarget(actionState, {
								anchor : 'Continuous'
							});

							jsPlumb.makeSource(connect, {
								parent : actionState,
								anchor : 'Continuous',
								connector : [ "StateMachine", {
									curviness : 20
								} ],
								connectorStyle : {
									strokeStyle : "#5c96bc",
									lineWidth : 2,
									outlineColor : "transparent",
									outlineWidth : 4
								}
							});

							actionState.append(connect);

							$('#fccontainer').append(actionState);

							jsPlumb.draggable(actionState, {
								containment : 'parent'
							});

							actionState.dblclick(function(e) {
								jsPlumb.detachAllConnections($(this));
								$(this).remove();
								e.stopPropagation();
							});

							i++;

						}
					}
				}*/
                ],
                tbar:[{
                    text:'Add Something',
                    tooltip:'Add a new row',
                    iconCls:'add'
                }, '-', {
                    text:'Options',
                    tooltip:'Modify options',
                    iconCls:'option'
                },'-',{
                    text:'Remove Something',
                    tooltip:'Remove the selected item',
                    iconCls:'remove'
                }]
            });
        }
        return win;
    },

    statics: {
        getDummyData: function () {
            return [
                ['3m Co',71.72,0.02,0.03],
                ['Alcoa Inc',29.01,0.42,1.47],
                ['American Express Company',52.55,0.01,0.02],
                ['American International Group, Inc.',64.13,0.31,0.49],
                ['AT&T Inc.',31.61,-0.48,-1.54],
                ['Caterpillar Inc.',67.27,0.92,1.39],
                ['Citigroup, Inc.',49.37,0.02,0.04],
                ['Exxon Mobil Corp',68.1,-0.43,-0.64],
                ['General Electric Company',34.14,-0.08,-0.23],
                ['General Motors Corporation',30.27,1.09,3.74],
                ['Hewlett-Packard Co.',36.53,-0.03,-0.08],
                ['Honeywell Intl Inc',38.77,0.05,0.13],
                ['Intel Corporation',19.88,0.31,1.58],
                ['Johnson & Johnson',64.72,0.06,0.09],
                ['Merck & Co., Inc.',40.96,0.41,1.01],
                ['Microsoft Corporation',25.84,0.14,0.54],
                ['The Coca-Cola Company',45.07,0.26,0.58],
                ['The Procter & Gamble Company',61.91,0.01,0.02],
                ['Wal-Mart Stores, Inc.',45.45,0.73,1.63],
                ['Walt Disney Company (The) (Holding Company)',29.89,0.24,0.81]
            ];
        }
    }
});

