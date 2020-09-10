
 Ext.define('TargetItem', {
     extend: 'Ext.data.Model',
     fields: [
	        {name: 'name', type: 'string'},
	        {name: 'localizable', type: 'boolean',defaultValue: false},
	        {name: 'collection', type: 'boolean',defaultValue: false},
	        {name: 'canonicalattribute', type: 'string'},
	        {name: 'exportCode', type: 'string'},
	        {name: 'mandatoryInHeader', type: 'boolean',defaultValue: true}
     ]
 });
 Ext.define('AttributeModel', {
	    extend: 'Ext.data.Model',
	    fields: [{
	        type: 'string',
	        name: 'qualifier'
	    }, {
	        type: 'string',
	        name: 'attributepk'
	    }, {
	        type: 'string',
	        name: 'type'
	    }]
	});
 Ext.require(['Ext.app.CellDragDrop','Ext.tab.*']);
Ext.define('Ext.app.NewTargetSystem', {
	extend: 'Ext.panel.Panel',
	alias: 'widget.newTargetSystem',
	//height: 600,
	initComponent: function(){
		 var simple =  Ext.widget('form',{
		        collapsible: true,
		        layout: 'form',
		        //id: 'simpleForm',
		        frame: false,
		        title: 'Config',
		        fieldDefaults: {
		          //  msgTarget: 'side',
		           // labelWidth: 75
		        },
		        
		        defaultType: 'textfield',
		        items: [{
		            fieldLabel: 'Name',
		            name: 'name',
		            itemId: 'name',
		            allowBlank: false,
		            tooltip: 'Enter a name',
		            value: 'SampleTargetSystem'
		        },{
                    xtype: 'combo',
                    name: 'type',
                    fieldLabel: 'Type',
                    itemId: 'type',
                    //labelWidth: 55,
                    store: new Ext.data.SimpleStore({
                        fields: ['type'],
                        data: [
                               ['HybrisCore'],
                           ]
                    }),
                    displayField: 'type',
                    valueField: 'type',
                    mode: 'local',
                    queryMode: 'local',
                    enableRegEx: true,
                    typeAhead: true,
                    emptyText: 'please select a type',
                    value: 'HybrisCore',
                    readOnly: false,
                    editable: false,
                    scope: this,
                    tooltip: 'Select a type'
                },{
		            fieldLabel: 'exportURL',
		            name: 'exportURL',
		            itemId: 'exportURL',
		            allowBlank: false,
		            value: 'http://localhost:9001/datahubadapter',
		            tooltip: "Enter a expor tURL"
		        }, {
		            fieldLabel: 'userName',
		            name: 'userName',
		            itemId: 'userName',
		            allowBlank: false,
		            value: 'admin',
		            tooltip: 'Enter your user Name'
		        },  {
		            fieldLabel: 'password',
		            name: 'password',
		            itemId: 'password',
		            allowBlank: false,
		            inputType: 'password',
		            value: 'nimda',
		            tooltip: 'Enter your password'
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
                xtype: 'container',
                region: 'center',
                layout: 'fit',
                items: [{
                	xtype: 'targetSystemAccordion'
                }]
            }]
        });
        this.callParent(arguments);
    }
});
Ext.define('Ext.app.NewTargetSystemItem', {
	extend: 'Ext.panel.Panel',
	alias: 'widget.newTargetSystemItem',
	height: 300,
	initComponent: function(){
		var me = this;
		var typecombo = Ext.create('Ext.form.field.ComboBox', {
            name: 'exportCode',
            fieldLabel: 'exportCode',
            //anchor: '100%',
            itemId: 'exportCode',
            forceSelection: true,
            allowBlank: false,
            tooltip: 'Enter a exportCode',
            store: createStore({
                proxy: {
                    type: 'ajax',
                    url: 'services/showtypes.do',
                    reader: {
                        type: 'json'

                    }
                },
                autoLoad: true,
                data: null
            }),
            displayField: 'code',
            //queryParam: 'search',
            queryMode: 'local',
            minchar:1,
            forceSelection: false,
            //queryDelay:1000,
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

                    if (selectedPK != rec.get('pk') && value != selectedType) {
                        selectedPK = rec.get('pk').trim();
                        selectedType = value;
                        //alert(selectedPK+"   "+selectedType);
                        Ext.Ajax.request({
                            url: 'services/searchatrributes/' + selectedPK,
                            method: 'GET',
                            success: function(response, options) {

                                attributesdata = Ext.decode(response.responseText);
                                me.remove(me.down('newTargetSystemGrid'));
                                me.add({
					            	xtype: 'newTargetSystemGrid',
					                region: 'center',
					               data:attributesdata
					            });
                               // console.log(me.down('newTargetSystemGrid'));
                               /* Ext.getCmp('impex-attributes').removeAll();
                                Ext.getCmp('impex-attributes').doLayout();
                                Ext.getCmp('impex-attributes').add({
                                    xtype: 'hybrisAttributeContainer',
                                    buttonIcon: "images/add.png",
                                    index: Ext.getCmp('impex-attributes').items.length + 1,
                                    data: attributesdata,
                                    modifier: modifier,
                                    selectedTypePK:selectedPK,
                                    handler: function() {
                                        this.up('fieldset').add({
                                            xtype: 'hybrisAttributeContainer',
                                            buttonIcon: "images/minus.png",
                                            index: this.up('fieldset').items.length + 1,
                                            data: attributesdata,
                                            selectedTypePK:selectedPK,
                                            modifier: modifier
                                        });
                                    }
                                });*/

                            },
                            failure: function(response, options) {
                                Ext.MessageBox.alert('Error', 'can not get attributes ' + response.status);
                            }
                        });
                        
                       /* {
		            fieldLabel: 'exportCode',
		            name: 'exportCode',
		            itemId: 'exportCode',
		            allowBlank: false,
		            tooltip: 'Enter a exportCode',
		            value: 'SampleExportCode'
		        }*/

                    }

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
		        items: [{
		            fieldLabel: 'type',
		            name: 'type',
		            itemId: 'type',
		            allowBlank: false,
		            tooltip: 'Enter a type',
		            value: 'SampleType'
		        },typecombo,{
		            fieldLabel: 'description',
		            name: 'description',
		            itemId: 'description',
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
		        },{
		        	xtype: 'checkboxfield',
		        	itemId: 'updatable',
		        	boxLabelAlign: 'before',
                    boxLabel  : 'updatable',
                    name      : 'updatable',
                    inputValue: '1'
                },{
		        	itemId: 'cis',
		            fieldLabel: 'canonicalItemSource',
		            name: 'canonicalItemSource',
		            allowBlank: false,
		            readOnly: true,
		            
		            value: 'canonicalItemSource',
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
            	xtype: 'newTargetSystemGrid',
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
Ext.define('Ext.app.NewTargetSystemGrid', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.newTargetSystemGrid',
    //height: 300,
   	multiSelect: true,
   	scroll:'vertical',
	/*viewConfig: {
	    	copy: true,
	    plugins: {
	        ptype: 'gridviewdragdrop',
	        dragGroup: 'rawItemDD',
	        enableDrop : false
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
            enableDrag:false
        }
    },
	gdata: [
        ['Attribute0',false,false,'example Expression','exampleexportCode',true]
        
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
            model: 'TargetItem',
            proxy: {
                type: 'memory'
            }
        });
        /*var rowEditing = Ext.create('Ext.grid.plugin.RowEditing', {
            clicksToMoveEditor: 1,
            autoCancel: false
        });*/
        var cellEditing = new Ext.grid.plugin.CellEditing({
            clicksToEdit: 1
        });
        Ext.apply(this, {
            //height: 300,
            height: this.height,
            store: store,
            stripeRows: true,
            columnLines: true,
            plugins: [cellEditing],
            listeners: {
                'selectionchange': function(view, records) {
                    this.down('#removeAttribute').setDisabled(!records.length);
                }
            },
            columns: [{
                text   : 'Attribute',
                //width: 120,
                flex: 1,
                sortable : true,
                dataIndex: 'name',
                editor: {
                    // defaults to textfield if no xtype is supplied
                    allowBlank: false
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
            },{
                text   : 'TransformationExpression',
                //width: 120,
                flex: 1,
                sortable : true,
                dataIndex: 'canonicalattribute',
                editor: {
                    // defaults to textfield if no xtype is supplied
                    allowBlank: true
                }
            },{
            		
                text   : 'ExportCodes',
                //width: 120,
                flex: 1,
                sortable : true,
                dataIndex: 'exportCode',
                editor: {
                    xtype: 'combo',
                    name: 'attribute',
                    //fieldLabel: 'Type',
                    //afterLabelTextTpl : '<span style="color:red;font-weight:bold" data-qtip="Required">*</span>',
                    //anchor: '95%',
                    //labelWidth: 80,
                    scope: this,
                    store: new Ext.data.JsonStore({
                        model: 'AttributeModel',
                        data: this.data,
                        proxy: {
                            type: 'memory',
                            reader: {
                                type: 'json',

                            }
                        },
                        autoLoad: true
                    }),
                    displayField: 'qualifier',
                    queryMode: 'local',
                    enableRegEx: true,
                    minchar:1,
                    forceSelection: false,
                    typeAhead: true,
                    triggerAction: 'all',
                    //emptyText: 'please select',
                    readOnly: false
                }
            
           
            },{
            	xtype: 'checkcolumn',
                text   : 'mandatoryInHeader',
                //width: 120,
                flex: 1,
                sortable : true,
                dataIndex: 'mandatoryInHeader',
                editor: {
                    xtype: 'checkbox',
                    cls: 'x-grid-checkheader-editor'
                }
            }],
            dockedItems: [{
            	xtype: 'toolbar',
        		dock: 'top',
        	    items: [{
        	            text: 'Add',
        	            handler : function() {
        	            	cellEditing.cancelEdit();
	
	                        // Create a model instance
	                        var r = Ext.create('TargetItem', {
	                        	name: 'Attribute'+store.getCount(),
	                        	localizable: false,
	                        	collection: false,
	                        	transformationExpression: "example",
	                        	exportCode: "example",
	                        	mandatoryInHeader: true
                        });

                        store.insert(0, r);
                        //rowEditing.startEdit(0, 0);
                    }
                }, {
                    itemId: 'removeAttribute',
                    text: 'Remove',
                    scope:this,
                    handler: function() {
                        var sm = this.getSelectionModel();
                        cellEditing.cancelEdit();
                        store.remove(sm.getSelection());
                        if (store.getCount() > 0) {
                            sm.select(0);
                        }
                    },
                    disabled: true
                }
        	    ]
        	}]
        });
        if(this.gdata){
     		//this.store.data = this.gdata;
     		this.store.loadData(this.gdata);
     	} ;
     	//this.getHeader().addCls('targetItemheader');
        this.callParent(arguments);
    }
});

Ext.define('Ext.app.TargetSystemAccordion', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.targetSystemAccordion',
    requires: [
        'Ext.layout.container.Accordion',
        'Ext.grid.*',
    ],
    xtype: 'layout-accordion',
    layout: 'accordion',
    //width: 500,
    //height: 400,
    title: 'targetItems',
    
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
                	var first = me.down('newTargetSystemItem');
                	while(first){
                		console.log(first.collapsed);
                		var tmp = first.nextSibling('newTargetSystemItem');
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
                		var first = me.down('newTargetSystemItem');
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
            	xtype: 'newTargetSystemItem',
            	collapsed: false
            }],
            dockedItems: [{
            	xtype: 'toolbar',
        		dock: 'top',
        	    items: [{
        	            text: 'Add Item',
        	            handler : function() {
        	            	//alert(me.down('#item1'));
        	            	if(me.items.length>=1){
        	            		removebutton.setDisabled(false);
        	            	}
        	            	me.add({
        	            		title: 'Item '+(me.items.length),
        	                    xtype: 'newTargetSystemItem',
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
Ext.define('Ext.app.NewTargetSystemPortlet', {
    extend: 'Ext.tab.Panel',
    alias: 'widget.newTargetSystemPortlet',
    height: 600,
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
            itemId:'targetsystem-xml',
            grow: true,
            name: 'targetsystem-xml',
            //fieldLabel: 'ImpexQuery',
            anchor: '100%, 100%',
            autoScroll: true
        }]
    });
	function replaceAll(find, replace, str) {
		  return str.replace(new RegExp(find, 'g'), replace);
		};
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
		    xtype: 'newTargetSystem'
		   
		},xmlform],
		listeners:{ 
             tabchange:function(tabPanel, newCard, oldCard, eOpts ){ 
                 if(newCard.title==='XML'){
                	 var map = new Map();
                	 var s = "   ";
                	 var x ='<targetSystems>\n'+s+'<targetSystem>\n';
                	 //console.log(oldCard.down('newTargetSystem'));
                	 var config = oldCard.down('form');
                	 var configname ='<name>'+config.down('#name').value+'</name>\n';
                	 var configtype ='<type>'+config.down('#type').value+'</type>\n';
                	 var configexportURL ='<exportURL>'+config.down('#exportURL').value+'</exportURL>\n';
                	 var configuserName ='<userName>'+config.down('#userName').value+'</userName>\n';
                	 var configpassword ='<password>'+config.down('#password').value+'</password>\n';
                	 x=x+s+s+configname+s+s+configtype+s+s+configexportURL+s+s+configuserName+s+s+configpassword;
                	 x=x+s+s+'<targetItems>\n';
                	 var targetitem = oldCard.down('targetSystemAccordion').down('newTargetSystemItem');
                	 
                	 while(targetitem){
                		 var it ='<item>\n';
                		 var type ='<type>'+targetitem.down('form').down('#type').value+'</type>\n';
                		 var epc = '<exportCode>'+targetitem.down('form').down('#exportCode').value+'</exportCode>\n';
                		 var des = '<description>'+targetitem.down('form').down('#description').value+'</description>\n';
                		 var upd = '<updatable>'+targetitem.down('form').down('#updatable').value+'</updatable>\n';
                		 var cis = '<canonicalItemSource>'+targetitem.down('form').down('#cis').value+'</canonicalItemSource>\n';
                		 var status = '<status>'+targetitem.down('form').down('#status').value+'</status>\n';
                		 var ats = '<attributes>\n';
                    	 var grid = targetitem.down('newTargetSystemGrid').store;
                    	 
                    	 for(var i=0;i<grid.getCount();i++){
                    		 var ci=grid.getAt(i).get('canonicalattribute');
                    		 if(ci.indexOf("<div")==0){
                 				ci=ci.substring(ci.indexOf(">")+1,ci.lastIndexOf('<'));
							}
                    		 var at = '<attribute>\n';
                    		 at = at+s+s+s+s+s+s+'<name>'+grid.getAt(i).get('name')+'</name>\n';
                    		 at = at+s+s+s+s+s+s+'<localizable>'+grid.getAt(i).get('localizable')+'</localizable>\n';
                    		 at = at+s+s+s+s+s+s+'<collection>'+grid.getAt(i).get('collection')+'</collection>\n';
                    		 at = at+s+s+s+s+s+s+'<transformationExpression>'+replaceAll(targetitem.down('form').down('#cis').value+'.','',ci)+'</transformationExpression>\n';
                    		 at = at+s+s+s+s+s+s+'<exportCode>'+grid.getAt(i).get('exportCode')+'</exportCode>\n';
                    		 at = at+s+s+s+s+s+s+'<mandatoryInHeader>'+grid.getAt(i).get('mandatoryInHeader')+'</mandatoryInHeader>\n';
                    		 at=at+s+s+s+s+s+'</attribute>\n';
                    		 ats =ats+s+s+s+s+s+at;
                    	 }
                    	 ats =ats+s+s+s+s+'</attributes>\n';
                    	 it = it+s+s+s+s+type+s+s+s+s+epc+s+s+s+s+des+s+s+s+s+upd+s+s+s+s+cis+s+s+s+s+status+s+s+s+s+ats+s+s+s+'</item>\n';
                    	 x=x+s+s+s+it;
                    	 targetitem = targetitem.nextSibling('newTargetSystemItem');
                	 }
                	 x=x+s+s+'</targetItems>\n';
                	 x=x+s+'</targetSystem>\n'+'</targetSystems>';
                	 xmlform.down('textareafield').setValue(x);
                 }
                
             } 
         } 
		});
			
        this.callParent(arguments);
    }
});