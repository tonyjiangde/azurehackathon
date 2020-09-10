 Ext.define('CanonicalItem', {
        extend: 'Ext.data.Model',
        fields: [
	        {name: 'canonicalattribute', type: 'string'},
	        {name: 'type', type: 'string'},
	        {name: 'primaryKey', type: 'boolean',defaultValue: false},
	        {name: 'secured', type: 'boolean',defaultValue: false},
	        {name: 'localizable', type: 'boolean',defaultValue: false},
	        {name: 'collection', type: 'boolean',defaultValue: false}
	        //{name: 'rawattribute', type: 'string'}
        ]
    });
 Ext.require(['Ext.app.CellDragDrop','Ext.tab.*']);
Ext.define('Ext.app.NewCanonicalItemGrid', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.newCanonicalItemGrid',
    //height: 300,
    scroll:'vertical',
	multiSelect: true,
	/*viewConfig: {
	    	copy: true,
	    plugins: {
	        ptype: 'gridviewdragdrop',
	        dragGroup: 'canonicalItemDD'
	    }
	},*/
	viewConfig: {
        plugins: {
            ptype: 'celldragdrop',
            // remove text from source cell and replace with value of emptyText
            applyEmptyText: false,
            //dropBackgroundColor: Ext.themeName === 'neptune' ? '#a4ce6c' : 'green',
            //noDropBackgroundColor: Ext.themeName === 'neptune' ? '#d86f5d' : 'red',
            //emptyText: Ext.String.htmlEncode('<<foo>>'),
            // will only allow drops of the same type
            enforceType: true,
            enableDrop:false
        }
    },
	gdata: [
        ['Attribute0','String',false,false,false,false],
        
    ],
	  
    //title: 'new RawItem',
    initComponent: function(){

       /*) var store = Ext.create('Ext.data.ArrayStore', {
            fields: [
               {name: 'attribute'},
               {name: 'change',     type: 'float'},
               {name: 'pctChange',  type: 'float'}
            ],
            autoDestroy: true,
        });*/
        var store = Ext.create('Ext.data.Store', {
            // destroy the store if the grid is destroyed
            autoDestroy: true,
            model: 'CanonicalItem',
            proxy: {
                type: 'memory'
            }
        });
        var rowEditing = Ext.create('Ext.grid.plugin.RowEditing', {
            clicksToMoveEditor: 1,
            autoCancel: false
        });
        function getRandomColor() {
            var letters = '0123456789ABCDEF'.split('');
            var color = '#';
            for (var i = 0; i < 6; i++ ) {
                color += letters[Math.floor((Math.random() * 160))%16];
               
            }
            console.log('color: '+color);
            return color;
        };
        Ext.apply(this, {
            //height: 300,
            height: this.height,
            store: store,
            stripeRows: true,
            columnLines: true,
            plugins: [rowEditing],
            listeners: {
                'selectionchange': function(view, records) {
                    this.down('#removeAttribute').setDisabled(!records.length);
                }
            },
            //margins: '0 5 0 0',
            columns: [{
                text   : 'Attribute',
                //width: 120,
                flex: 1,
                sortable : true,
                dataIndex: 'canonicalattribute',
                editor: {
                    // defaults to textfield if no xtype is supplied
                    allowBlank: false
                },
                renderer: function (value, metaData) {
                	 //metaData.style = 'background-color:'+getRandomColor();
                     return '<div style="background-color:'+ getRandomColor()+'">'+value+'</div>';
                }
            },{
                text   : 'Type',
                //width: 120,
                flex: 1,
                sortable : true,
                dataIndex: 'type',
                editor: {
                    // defaults to textfield if no xtype is supplied
                    allowBlank: false
                }
            },{
            	xtype: 'checkcolumn',
                text   : 'PrimaryKey',
                //width: 120,
                flex: 1,
                sortable : true,
                dataIndex: 'primaryKey',
                editor: {
                    xtype: 'checkbox',
                    cls: 'x-grid-checkheader-editor'
                }
            },{
            	xtype: 'checkcolumn',
                text   : 'Secured',
                //width: 120,
                flex: 1,
                sortable : true,
                dataIndex: 'secured',
                editor: {
                    xtype: 'checkbox',
                    cls: 'x-grid-checkheader-editor'
                }
            },{
            	xtype: 'checkcolumn',
                text   : 'Localizable',
                //width: 120,
                flex: 1,
                sortable : true,
                dataIndex: 'localizable',
                editor: {
                    xtype: 'checkbox',
                    cls: 'x-grid-checkheader-editor'
                }
            },{
            	xtype: 'checkcolumn',
                text   : 'Collection',
                //width: 120,
                flex: 1,
                sortable : true,
                dataIndex: 'collection',
                editor: {
                    xtype: 'checkbox',
                    cls: 'x-grid-checkheader-editor'
                }
            }/*,{
                text   : 'RawSource',
                //width: 120,
                flex: 1,
                sortable : true,
                dataIndex: 'rawattribute',
                editor: {
                    // defaults to textfield if no xtype is supplied
                    allowBlank: false
                }
            }*/],
            dockedItems: [{
            	xtype: 'toolbar',
        		dock: 'top',
        	    items: [{
        	            text: 'Add',
        	            handler : function() {
	                        rowEditing.cancelEdit();
	
	                        // Create a model instance
	                        var r = Ext.create('CanonicalItem', {
	                        	canonicalattribute: 'Attribute'+store.getCount(),
	                        	type: 'String',
	                        	primaryKey: false,
	                        	secured: false,
	                        	localizable: false,
	                        	collection: false
                        });

                        store.insert(0, r);
                        rowEditing.startEdit(0, 0);
                    }
                }, {
                    itemId: 'removeAttribute',
                    text: 'Remove',
                    scope:this,
                    handler: function() {
                        var sm = this.getSelectionModel();
                        rowEditing.cancelEdit();
                        store.remove(sm.getSelection());
                        if (store.getCount() > 0) {
                            sm.select(0);
                        }
                    },
                    disabled: true
                }
        	    ]
        	}],
        });
        if(this.gdata){
     		//this.store.data = this.gdata;
     		this.store.loadData(this.gdata);
     	} ;
        this.callParent(arguments);
    }
});
Ext.define('Ext.app.NewCanonicalItem', {
	extend: 'Ext.panel.Panel',
	alias: 'widget.newCanonicalItem',
	height: 300,
	initComponent: function(){
		 var simple =  Ext.widget('form',{
		        collapsible: true,
		        layout: 'form',
		        //id: 'simpleForm',
		        frame: false,
		        title: 'Meta',
		        fieldDefaults: {
		        	labelWidth:150
		        },
		        
		        defaultType: 'textfield',
		        items: [{
		        	itemId:'type',
		            fieldLabel: 'type',
		            name: 'type',
		            allowBlank: false,
		            tooltip: 'Enter a type',
		            value: 'SampleType'
		        },{
		        	itemId:'description',
		            fieldLabel: 'description',
		            name: 'description',
		            allowBlank: false,
		            tooltip: 'Enter a description',
		            value: 'Sample description'
		        },{
		        	itemId:'status',
		            fieldLabel: 'status',
		            name: 'status',
		            allowBlank: false,
		            tooltip: 'Enter a status',
		            value: 'ACTIVE'
		        }
		        ],

		       
		    });
        Ext.apply(this, {
            //id: 'app-viewport',
            layout: {
                type: 'border',
                padding: '0 0 0 0' // pad the layout from the window edges
            },
            items: [{
                //id: 'app-header',
            	xtype: 'container',
                region: 'north',
                layout: 'fit',
                items: [simple]
            },{
            	xtype: 'newCanonicalItemGrid',
                region: 'center'
               /* xtype: 'container',
                region: 'center',
                layout: 'fit',
                items: [{
                	xtype: 'newTargetSystemGrid'
                }]*/
            }]
        });
        this.callParent(arguments);
    }
});
Ext.define('Ext.app.CanonicalItemsAccordion', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.canonicalItemsAccordion',
    requires: [
        'Ext.layout.container.Accordion',
        'Ext.grid.*',
    ],
    xtype: 'layout-accordion',
    layout: 'accordion',
    //width: 500,
    //height: 400,
    title: 'CanonicalItems',
    
    initComponent: function() {
    	var me = this;
    	
    	var removebutton = Ext.create('Ext.button.Button', {
        	itemId: "removeButton",
            text: 'Remove Item',
            disabled: true,
            handler: function() {
            	var l = me.items.length;
            	var removed = false;
            	if(l>=3){
            		var i =1;
                	var first = me.down('newCanonicalItem');
                	while(first){
                		console.log(first.collapsed);
                		var tmp = first.nextSibling('newCanonicalItem');
                		if(!first.collapsed && !removed){
                			console.log("remove");
                			me.remove(first);
                			removed = true;
                		}else{
                			first.setTitle('Item '+i);
                			i=i+1;
                		}
        				first= tmp;
                	}
                	if(removed){
                		var first = me.down('newCanonicalItem');
                		first.expand();
                	}
                	
            	}
                 	
    			if(l==3){
    				this.setDisabled(true);
    			}
    			//me.doLayout();
            	/*var items = me.items.length;
            	if(items>1){
            		for(var i =1;i<items+1;i++){
                		console.log(me.down('#item'+i).collapsed);
                		var a = me.down('#item'+i);
                		if(!a.collapsed){
                			me.remove(a);
                			break;
                		}
                	}
            	}*/
            	
            }
        });
        Ext.apply(this, {
            items: [{
        		xtype: 'panel', // << fake hidden panel
        		hidden: true,
        		collapsed: true
        	},{
            	title: 'Item 1',
            	xtype: 'newCanonicalItem',
            	collapsed: false
            }],
            dockedItems: [{
            	xtype: 'toolbar',
        		dock: 'top',
        	    items: [{
        	            text: 'Add Item',
        	            handler : function() {
        	            	//alert(me.down('#item1'));
        	            	if(me.items.length>=2){
        	            		removebutton.setDisabled(false);
        	            	}
        	            	me.add({
        	            		title: 'Item '+(me.items.length),
        	                    xtype: 'newCanonicalItem',
        	            	});
        	            	
                    	}
                }, 
                	removebutton
                
        	    ]
        	}],
        	bodyStyle:{"background-color":"#232d38"},
        });
        this.callParent();
    }
});
Ext.define('Ext.app.NewCanonicalItemPortlet', {
    extend: 'Ext.tab.Panel',
    alias: 'widget.newCanonicalItemPortlet',
    height: 500,
    initComponent: function(){
	var xmlform = Ext.create('Ext.form.Panel', {
        frame: true,
        title: 'XML',
        autoScroll: false,
        bodyPadding: '0 0 0 0',

        fieldDefaults: {
            labelAlign: 'top',
            msgTarget: 'side',
            anchor: '100%'
        },

        items: [{
            xtype: 'textareafield',
            itemId:'canonicalitem-xml',
            grow: true,
            name: 'canonicalitem-xml',
            //fieldLabel: 'ImpexQuery',
            anchor: '100%, 100%',
            autoScroll: true
        }]
    });
	function Map() {
	    this.elements = new Array();
	    this.size = function() {
	        return this.elements.length;
	    }
	    this.isEmpty = function() {
	        return (this.elements.length < 1);
	    }
	    this.clear = function() {
	        this.elements = new Array();
	    }
	    this.put = function(_key, _value) {
	        this.elements.push( {
	            key : _key,
	            value : _value
	        });
	    }
	    this.remove = function(_key) {
	        var bln = false;
	        try {
	            for (i = 0; i < this.elements.length; i++) {
	                if (this.elements[i].key == _key) {
	                    this.elements.splice(i, 1);
	                    return true;
	                }
	            }
	        } catch (e) {
	            bln = false;
	        }
	        return bln;
	    }
	    this.get = function(_key) {
	        try {
	            for (i = 0; i < this.elements.length; i++) {
	                if (this.elements[i].key == _key) {
	                    return this.elements[i].value;
	                }
	            }
	        } catch (e) {
	            return null;
	        }
	    }
	    this.element = function(_index) {
	        if (_index < 0 || _index >= this.elements.length) {
	            return null;
	        }
	        return this.elements[_index];
	    }
	    this.containsKey = function(_key) {
	        var bln = false;
	        try {
	            for (i = 0; i < this.elements.length; i++) {
	                if (this.elements[i].key == _key) {
	                    bln = true;
	                }
	            }
	        } catch (e) {
	            bln = false;
	        }
	        return bln;
	    }
	    this.containsValue = function(_value) {
	        var bln = false;
	        try {
	            for (i = 0; i < this.elements.length; i++) {
	                if (this.elements[i].value == _value) {
	                    bln = true;
	                }
	            }
	        } catch (e) {
	            bln = false;
	        }
	        return bln;
	    }
	    this.values = function() {
	        var arr = new Array();
	        for (i = 0; i < this.elements.length; i++) {
	            arr.push(this.elements[i].value);
	        }
	        return arr;
	    }
	    this.keys = function() {
	        var arr = new Array();
	        for (i = 0; i < this.elements.length; i++) {
	            arr.push(this.elements[i].key);
	        }
	        return arr;
	    }
	};
		Ext.apply(this, {
			activeTab: 0,
			defaults :{
			    //bodyPadding: 10
			},
		items: [{
			title: 'Grid',
		    xtype: 'canonicalItemsAccordion'
		   
		},xmlform],
		listeners:{ 
             tabchange:function(tabPanel, newCard, oldCard, eOpts ){ 
                 if(newCard.title==='XML'){
                	 var s = "   ";
                	 var x ='<canonicalItems>\n';
                	 var canonicalItem = oldCard.down('newCanonicalItem');
                	 while(canonicalItem){
                		 var it ='<item>\n';
                		 var type ='<type>'+canonicalItem.down('form').down('#type').value+'</type>\n';
                		 var des = '<description>'+canonicalItem.down('form').down('#description').value+'</description>\n';
                		 var status = '<status>'+canonicalItem.down('form').down('#status').value+'</status>\n';
                		 var ats = '<attributes>\n';
                    	 var grid = canonicalItem.down('newCanonicalItemGrid').store;
                    	 
                    	 for(var i=0;i<grid.getCount();i++){
                    		 var at = '<attribute>\n';
                    		 at = at+s+s+s+s+'<name>'+grid.getAt(i).get('canonicalattribute')+'</name>\n';
                    		 at = at+s+s+s+s+'<model>\n';
                    		 at=at+s+s+s+s+s+'<type>'+grid.getAt(i).get('type')+'</type>\n';
                    		 at=at+s+s+s+s+s+'<primaryKey>'+grid.getAt(i).get('primaryKey')+'</primaryKey>\n';
                    		 at=at+s+s+s+s+s+'<secured>'+grid.getAt(i).get('secured')+'</secured>\n';
                    		 at=at+s+s+s+s+s+'<localizable>'+grid.getAt(i).get('localizable')+'</localizable>\n';
                    		 at=at+s+s+s+s+s+'<collection>'+grid.getAt(i).get('collection')+'</collection>\n';
                    		 at = at+s+s+s+s+'</model>\n';
                    		 at=at+s+s+s+'</attribute>\n';
                    		 ats =ats+s+s+s+at;
                    	 }
                    	 ats =ats+s+s+'</attributes>\n';
                    	 it = it+s+s+type+s+s+des+s+s+status+s+s+ats+s+'</item>\n';
                    	 x=x+s+it;
                    	 canonicalItem = canonicalItem.nextSibling('newCanonicalItem');
                	 }
                	 x=x+'</canonicalItems>\n';
                	 xmlform.down('textareafield').setValue(x);
                 }
                
             } 
         } 
		});
			
        this.callParent(arguments);
    }
});