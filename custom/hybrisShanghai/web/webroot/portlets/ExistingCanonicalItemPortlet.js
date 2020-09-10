 Ext.define('CanonicalItem', {
        extend: 'Ext.data.Model',
        fields: [
	        {name: 'canonicalattribute', type: 'string',mapping:'name'},
	        {name: 'type', type: 'string'},
	        {name: 'primaryKey', type: 'boolean',defaultValue: false,mapping:'isPrimaryKey'},
	        {name: 'secured', type: 'boolean',defaultValue: false,mapping:'isSecured'},
	        {name: 'localizable', type: 'boolean',defaultValue: false,mapping:'isLocalizable'},
	        {name: 'collection', type: 'boolean',defaultValue: false,mapping:'isCollection'}
	        //{name: 'rawattribute', type: 'string'}
        ]
    });
 
 Ext.define('CI', {
     extend: 'Ext.data.Model',
     fields: [
	       {name: 'name', type: 'string'},
	       {name: 'description', type: 'string'}
     ]
 });
 Ext.require(['Ext.app.CellDragDrop','Ext.tab.*']);
Ext.define('Ext.app.ExistingCanonicalItemGrid', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.existingCanonicalItemGrid',
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
	
    //title: 'new RawItem',
    initComponent: function(){

    	if(!this.xstore){
    		this.xstore=  Ext.create('Ext.data.Store', {
                // destroy the store if the grid is destroyed
                autoDestroy: true,
                model: 'CanonicalItem',
                proxy: {
                    type: 'memory'
                }
            });
    	}
        
        var rowEditing = Ext.create('Ext.grid.plugin.RowEditing', {
            clicksToMoveEditor: 1,
            autoCancel: false
        });
        function getRandomColor() {
            var letters = '0123456789ABCDEF'.split('');
            var color = '#';
            for (var i = 0; i < 6; i++ ) {
                color += letters[Math.floor(Math.random() * 16)];
            }
            return color;
        };
        Ext.apply(this, {
            //height: 300,
            height: this.height,
            store: this.xstore,
            stripeRows: true,
            columnLines: true,
            plugins: [rowEditing],
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

        });
        if(this.gdata){
     		//this.store.data = this.gdata;
     		this.store.loadData(this.gdata);
     	} ;
        this.callParent(arguments);
    }
});
Ext.define('Ext.app.ExistingCanonicalItemPortlet', {
	extend: 'Ext.panel.Panel',
	alias: 'widget.existingCanonicalItemPortlet',
	height: 300,
	initComponent: function(){
		
		var me=this;
		var itemcombo = Ext.create('Ext.form.field.ComboBox', {
            name: 'type',
            fieldLabel: 'Type',
            //anchor: '100%',
            itemId: 'type',
            forceSelection: true,
            allowBlank: false,
            tooltip: 'Select a Type',
            store: createStore({
                proxy: {
                    type: 'ajax',
                    url: 'services/httpg.do?url='+me.url+'item-classes/canonical/item-types.json',
                    reader: {
                        type: 'json'

                    }
                },
                autoLoad: true,
                model: 'CI',
            }),
            displayField: 'name',
            queryMode: 'local',
            typeAhead: true,
            enableRegEx: true,
            emptyText: 'please select',
            readOnly: false,
            scope: this,
            listeners: {
                'select': function(combo, record, index) {
                    var value = combo.getValue();
                    var rec = combo.findRecord(combo.valueField || combo.displayField, value);
                    var ind = combo.store.indexOf(rec);
                    //alert(rec.get('description'));
                    simple.down('#description').setValue(rec.get('description'));
                    me.remove(me.down('existingCanonicalItemGrid'));
                    me.add({
		            	xtype: 'existingCanonicalItemGrid',
		                region: 'center',
		                xstore: createStore({
		                    proxy: {
		                        type: 'ajax',
		                        url: 'services/httpg.do?url='+me.url+'item-classes/canonical/item-types/'+value+'/attributes.json',
		                        reader: {
		                            type: 'json'

		                        }
		                    },
		                    autoLoad: true,
		                    model: 'CanonicalItem',
		                }),
                    });
                    
                }
            }



        });
		
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
		        items: [itemcombo,{
		        	itemId:'description',
		            fieldLabel: 'description',
		            name: 'description',
		            allowBlank: false,
		            tooltip: 'Enter a description'
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
            	xtype: 'existingCanonicalItemGrid',
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
