 Ext.define('RawItem', {
        extend: 'Ext.data.Model',
        fields: [
	       {name: 'rawattribute', type: 'string',mapping:'name'},
	       {name: 'canonicalattribute', type: 'string'}
        ]
    });
 
 Ext.define('RawI', {
     extend: 'Ext.data.Model',
     fields: [
	       {name: 'name', type: 'string'},
	       {name: 'description', type: 'string'}
     ]
 });
Ext.require(['Ext.app.CellDragDrop','Ext.tab.*']);
Ext.define('Ext.app.ExistingRawItemGrid', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.existingRawItemGrid',
    scroll:'vertical',
	multiSelect: true,
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
            enableDrag:false
            //enableDrop:false
        }
    },
	
	  
    initComponent: function(){
    	if(!this.xstore){
    		this.xstore= Ext.create('Ext.data.Store', {
                // destroy the store if the grid is destroyed
                autoDestroy: true,
                model: 'RawItem',
                proxy: {
                    type: 'memory'
                }
            });
    	}
    	
        var rowEditing = Ext.create('Ext.grid.plugin.RowEditing', {
            clicksToMoveEditor: 1,
            autoCancel: false
        });
        Ext.apply(this, {
            //height: 300,
            height: this.height,
            store: this.xstore,
            stripeRows: true,
            columnLines: true,
            plugins: [rowEditing],
            //margins: '0 5 0 0',
            columns: [{
            	itemId       :'attribute',
                text   : 'Attribute',
                //width: 120,
                flex: 1,
                sortable : true,
                dataIndex: 'rawattribute',
                editor: {
                    // defaults to textfield if no xtype is supplied
                    allowBlank: false
                }
            },{
                text   : 'canonicalattribute',
                //width: 120,
                flex: 1,
                sortable : true,
                dataIndex: 'canonicalattribute',
                editor: {
                    // defaults to textfield if no xtype is supplied
                    allowBlank: true
                }
            }]
        });
        if(this.gdata){
     		//this.store.data = this.gdata;
     		this.store.loadData(this.gdata);
     	} ;
        this.callParent(arguments);
    }
});
Ext.define('Ext.app.ExistingRawItemPortlet', {
	extend: 'Ext.panel.Panel',
	alias: 'widget.existingRawItemPortlet',
	height: 300,
	initComponent: function(){
		var me=this;
		var rawitemcombo = Ext.create('Ext.form.field.ComboBox', {
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
                    url: 'services/httpg.do?url='+me.url+'item-classes/raw/item-types.json',
                    reader: {
                        type: 'json'

                    }
                },
                autoLoad: true,
                model: 'RawI',
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
                    me.remove(me.down('existingRawItemGrid'));
                    me.add({
		            	xtype: 'existingRawItemGrid',
		                region: 'center',
		                xstore: createStore({
		                    proxy: {
		                        type: 'ajax',
		                        url: 'services/httpg.do?url='+me.url+'item-classes/raw/item-types/'+value+'/attributes.json',
		                        reader: {
		                            type: 'json'

		                        }
		                    },
		                    autoLoad: true,
		                    model: 'RawItem',
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
		        items: [rawitemcombo,{
		        	itemId:'description',
		            fieldLabel: 'description',
		            name: 'description',
		            allowBlank: false,
		            tooltip: 'Enter a description'
		            
		        }],

		       
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
            	xtype: 'existingRawItemGrid',
                region: 'center'
            }]
        });
        this.callParent(arguments);
    }
});
