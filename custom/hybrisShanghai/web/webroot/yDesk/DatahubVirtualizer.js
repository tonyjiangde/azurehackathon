var ri =2;
var ci =2;
var ti =2;
Ext.define('Ext.app.Portal', {

    extend: 'Ext.panel.Panel',
    	alias: 'widget.hybrisPortal',
    requires: ['Ext.app.PortalPanel', 'Ext.app.PortalColumn', 'Ext.app.NewRawItemPortlet', 'Ext.app.NewCanonicalItemPortlet','Ext.app.NewTargetSystemPortlet','Ext.app.ExistingRawItemPortlet','Ext.app.ExistingCanonicalItemPortlet'],

    getTools: function(){
        return [{
            xtype: 'tool',
            type: 'gear',
            handler: function(e, target, header, tool){
                var portlet = header.ownerCt;
                portlet.setLoading('Loading...');
                Ext.defer(function() {
                    portlet.setLoading(false);
                }, 2000);
            }
        }];
    },

    initComponent: function(){
        var content = '<div class="portlet-content">testtesttesttest</div>';
        var nri = Ext.create('Ext.app.NewRawItemPortlet',{
        	id : 'raw-1'
        });
        var dc =  Ext.widget('form',{
	        //collapsible: true,
	        layout: 'form',
	        //id: 'simpleForm',
	        frame: false,
	        
	        defaultType: 'textfield',
	        items: [{
	            fieldLabel: 'Url',
	            name: 'url',
	            id: 'datahuburl',
	            allowBlank: false,
	            tooltip: 'Enter the url of datahub',
	            value: 'http://localhost:8080/datahub-webapp/v1/'
	        }],

	       
	    });
        Ext.apply(this, {
            //id: 'app-viewport',
        	frame: false,
            border: 0,
            layout: {
                type: 'border',
                padding: '0 0 0 0' // pad the layout from the window edges
            },
            items: [{
                //id: 'app-header',
            	title: 'Datahub Config',
                xtype: 'panel',
                region: 'north',
                layout:'fit',
                //height: 100,
                collapsible: true,
                items:[dc]
                
            },{
                id: 'app-portal',
                xtype: 'portalpanel',
                region: 'center',
                frame: false,
                border: 0,
                items: [{
                    id: 'col-1',
                    items: [{
                        id: 'portlet-1',
                        title: 'new RawItems',
                        tools: this.getTools(),
                        items: nri,
                        listeners: {
                            'close': Ext.bind(this.onPortletClose, this)
                        }
                    },{
                        id: 'portlet-2',
                        title: 'new TargetSystem',
                        tools: this.getTools(),
                        items: Ext.create('Ext.app.NewTargetSystemPortlet',{
                        	id : 'target-1'
                        }),
                        listeners: {
                            'close': Ext.bind(this.onPortletClose, this)
                        }
                    }]
                },{
                    id: 'col-2',
                    items: [{
                        id: 'portlet-3',
                        title: 'new CanonicalItems',
                        tools: this.getTools(),
                        items: Ext.create('Ext.app.NewCanonicalItemPortlet',{
                        	id : 'cano-1'
                        }),
                        listeners: {
                            'close': Ext.bind(this.onPortletClose, this)
                        }
                    }]
                }]
            }]
        });
        this.callParent(arguments);
    },

    onPortletClose: function(portlet) {
        alert('"' + portlet.title + '" was removed');
    },
});

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
            iconCls:'icon-datahub'
        };
    },
    
    createWindow : function(){
        var desktop = this.app.getDesktop();
        var win = desktop.getWindow('DatahubVirtualizer-win');
        if(!win){
        	function onItemClick(item){
                //alert('You clicked the "'+item.text+'" menu item.' );
        		var target = Ext.getCmp('app-portal').down('#col-1');
        		console.log(Ext.getCmp('app-portal').down('#col-1').items.length+"---"+Ext.getCmp('app-portal').down('#col-2').items.length);
        		if(Ext.getCmp('app-portal').down('#col-1').items.length>Ext.getCmp('app-portal').down('#col-2').items.length){
        			target = Ext.getCmp('app-portal').down('#col-2');
        		}
                if(item.text == 'new Raw Item'){
                	target.add({
    	                title: 'new RawItems',
    	                
    	                tools:  [{
    	                    xtype: 'tool',
    	                type: 'gear',
    	                handler: function(e, target, header, tool){
    	                    var portlet = header.ownerCt;
    	                    portlet.setLoading('Loading...');
    	                    Ext.defer(function() {
    	                        portlet.setLoading(false);
    	                    }, 2000);
    	                }
    	                }],
    	                items: Ext.create('Ext.app.NewRawItemPortlet',{
    	                	id: 'raw-'+ri
                        }),
    	                listeners: {
    	                    'close': function(portlet) {
    	                    	alert('"' + portlet.title + '" was removed');
    	                	}
    	                }
                	});
                	ri=ri+1;
                }else if(item.text == 'new Canonical Item'){
                	target.add({
    	                title: 'new CanonicalItems',
    	                
    	                tools:  [{
    	                    xtype: 'tool',
    	                type: 'gear',
    	                handler: function(e, target, header, tool){
    	                    var portlet = header.ownerCt;
    	                    portlet.setLoading('Loading...');
    	                    Ext.defer(function() {
    	                        portlet.setLoading(false);
    	                    }, 2000);
    	                }
    	            }],
    	                items: Ext.create('Ext.app.NewCanonicalItemPortlet',{
                        	id : 'cano-'+ci
                        }),
    	                listeners: {
    	                    'close': function(portlet) {
    	                    	alert('"' + portlet.title + '" was removed');
    	                	}
    	                }
                	});
                	ci=ci+1;
                }else if(item.text == 'new Target Item'){
                	target.add({
    	                title: 'new TargetSystem',
    	                
    	                tools:  [{
    	                    xtype: 'tool',
    	                type: 'gear',
    	                handler: function(e, target, header, tool){
    	                    var portlet = header.ownerCt;
    	                    portlet.setLoading('Loading...');
    	                    Ext.defer(function() {
    	                        portlet.setLoading(false);
    	                    }, 2000);
    	                }
    	            }],
    	                items: Ext.create('Ext.app.NewTargetSystemPortlet',{
    	                	id: 'target-'+ti
                        }),
    	                listeners: {
    	                    'close': function(portlet) {
    	                    	alert('"' + portlet.title + '" was removed');
    	                	}
    	                }
                	});
                	ti=ti+1;
                }else if(item.text == 'existing Raw Item'){
                	target.add({
    	                title: 'existing RawItem',
    	                
    	                tools:  [{
    	                    xtype: 'tool',
    	                type: 'gear',
    	                handler: function(e, target, header, tool){
    	                    var portlet = header.ownerCt;
    	                    portlet.setLoading('Loading...');
    	                    Ext.defer(function() {
    	                        portlet.setLoading(false);
    	                    }, 2000);
    	                }
    	            }],
    	                items: Ext.create('Ext.app.ExistingRawItemPortlet',{
    	                	id: 'raw-'+ri,
    	                	url: Ext.getCmp('datahuburl').value
                        }),
    	                listeners: {
    	                    'close': function(portlet) {
    	                    	alert('"' + portlet.title + '" was removed');
    	                	}
    	                }
                	});
                	ri=ri+1;
                }else if(item.text == 'existing Canonical Item'){
                	target.add({
    	                title: 'existing CanonicalItem',
    	                
    	                tools:  [{
    	                    xtype: 'tool',
    	                type: 'gear',
    	                handler: function(e, target, header, tool){
    	                    var portlet = header.ownerCt;
    	                    portlet.setLoading('Loading...');
    	                    Ext.defer(function() {
    	                        portlet.setLoading(false);
    	                    }, 2000);
    	                }
    	            }],
    	                items: Ext.create('Ext.app.ExistingCanonicalItemPortlet',{
    	                	id : 'cano-'+ci,
    	                	url: Ext.getCmp('datahuburl').value
                        }),
    	                listeners: {
    	                    'close': function(portlet) {
    	                    	alert('"' + portlet.title + '" was removed');
    	                	}
    	                }
                	});
                	ci=ci+1;
                }
                
                
                
            };
        	var menu = Ext.create('Ext.menu.Menu', {
                id: 'dhmainMenu',
                style: {
                    overflow: 'visible'     // For the Combo popup
                },
                items: [
                   {
                        text: 'Add new items',
                        menu: {        // <-- submenu by nested config object
                            items: [
                                // stick any markup in a menu
                                //'<b class="menu-title">Choose a item</b>',
                                {
                                    text: 'new Raw Item',
                                    handler: onItemClick
                                }, {
                                    text: 'new Canonical Item',
                                    handler: onItemClick
                                }, {
                                    text: 'new Target Item',
                                    handler: onItemClick
                                }
                            ]
                        }
                   },
                   {
                       text: 'Add existing items',
                       menu: {        // <-- submenu by nested config object
                           items: [
                               // stick any markup in a menu
                               //'<b class="menu-title">Choose a item</b>',
                               {
                                   text: 'existing Raw Item',
                                   handler: onItemClick
                               }, {
                                   text: 'existing Canonical Item',
                                   handler: onItemClick
                               }, {
                                   text: 'existing Target Item',
                                   disabled:true,
                                   handler: onItemClick
                               }
                           ]
                       }
                  }
                ]
            });
            win = desktop.createWindow({
                id: 'DatahubVirtualizer-win',
                title:'Datahub Virtualizer',
                width:1024,
                height:768,
                iconCls: 'icon-datahub',
                animCollapse:false,
                constrainHeader:true,
                layout: 'fit',
                items: [{
                	xtype: 'hybrisPortal',
                	id:'hybrisportal'
                }
                ],
                tools:[
           	        {
           	        	type:'help',
           	        	tooltip: 'Readme',
           	        	handler: function(event, toolEl, panel){
           	        		function showResult(btn){
           	        			
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
                tbar:[{
                    text:'Add Items',
                    iconCls:'add',
                    menu: menu
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
    }
});

