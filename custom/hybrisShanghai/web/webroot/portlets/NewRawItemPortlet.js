 Ext.define('RawItem', {
        extend: 'Ext.data.Model',
        fields: [
	       {name: 'rawattribute', type: 'string'},
	       {name: 'canonicalattribute', type: 'string'}
        ]
    });
Ext.require(['Ext.app.CellDragDrop','Ext.tab.*']);
Ext.define('Ext.app.NewRawItemGrid', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.newRawItemGrid',
    //height: 300,
    scroll:'vertical',
	multiSelect: true,
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
            //enableDrop:false
        }
    },
	gdata: [
        ['Attribute0'],
        
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
            model: 'RawItem',
            proxy: {
                type: 'memory'
            }
        });
        var rowEditing = Ext.create('Ext.grid.plugin.RowEditing', {
            clicksToMoveEditor: 1,
            autoCancel: false
        });
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
            }],
            dockedItems: [{
            	xtype: 'toolbar',
        		dock: 'top',
        	    items: [{
        	            text: 'Add',
        	            handler : function() {
	                        rowEditing.cancelEdit();
	
	                        // Create a model instance
	                        var r = Ext.create('RawItem', {
	                        	rawattribute: 'Attribute'+store.getCount(),
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
Ext.define('Ext.app.NewRawItem', {
	extend: 'Ext.panel.Panel',
	alias: 'widget.newRawItem',
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
            	xtype: 'newRawItemGrid',
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
Ext.define('Ext.app.RawItemsAccordion', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.rawItemsAccordion',
    requires: [
        'Ext.layout.container.Accordion',
        'Ext.grid.*',
    ],
    xtype: 'layout-accordion',
    layout: 'accordion',
    //width: 500,
    //height: 400,
    title: 'RawItems',
    
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
                	var first = me.down('newRawItem');
                	while(first){
                		console.log(first.collapsed);
                		var tmp = first.nextSibling('newRawItem');
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
                		var first = me.down('newRawItem');
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
            	xtype: 'newRawItem',
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
        	                    xtype: 'newRawItem',
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
Ext.define('Ext.app.NewRawItemPortlet', {
    extend: 'Ext.tab.Panel',
    alias: 'widget.newRawItemPortlet',
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
            itemId:'rawitem-xml',
            grow: true,
            name: 'rawitem-xml',
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
		    xtype: 'rawItemsAccordion'
		   
		},xmlform],
		listeners:{ 
             tabchange:function(tabPanel, newCard, oldCard, eOpts ){ 
                 if(newCard.title==='XML'){
                	 var map = new Map();
                	 var s = "   ";
                	 var x ='<rawItems>\n';
                	 var rawitem = oldCard.down('newRawItem');
                	 var c = '<canonicalItems>\n';
                	 while(rawitem){
                		 var it ='<item>\n';
                		 var type ='<type>'+rawitem.down('form').down('#type').value+'</type>\n';
                		 var des = '<description>'+rawitem.down('form').down('#description').value+'</description>\n';
                		 var ats = '<attributes>\n';
                    	 var grid = rawitem.down('newRawItemGrid').store;
                    	 
                    	 for(var i=0;i<grid.getCount();i++){
                    		 
                    		 var canona = grid.getAt(i).get('canonicalattribute').split('<br>');
                    		 if(canona.length>1){
                    			 for(var k=0;k<canona.length;k++){
                    				 var ci=canona[k].split('.');
                    				 console.log(ci[0]+"!!!!"+ci[1]);
                            		 if(ci[0].indexOf("<div")==0){
                            				ci[0]=ci[0].substring(ci[0].indexOf(">")+1,ci[0].length);
                            				ci[1]=ci[1].substring(0,ci[1].indexOf("<"));
                            				
         							}
                            		 console.log(ci[0]+"!!!!"+ci[1]);
                            		 //var cit ='<item>\n';
                            		 //var ctype ='<type>'+ci[0]+'</type>\n';
                            		 if(map.containsKey(ci[0])){
                            			 map.get(ci[0]).push({
                            				 name: ci[1],
                            				 rawSource:rawitem.down('form').down('#type').value,
                            			     expression:grid.getAt(i).get('rawattribute')
                            			 });
                            		 }else{
                            			 var cat = new Array();
                            			 cat.push({
                            				 name: ci[1],
                        				     rawSource:rawitem.down('form').down('#type').value,
                        			         expression:grid.getAt(i).get('rawattribute')
                            			 });
                            			 map.put(ci[0],cat);
                            		 }
                    			 }
                    		 }else{
                    			 var ci=grid.getAt(i).get('canonicalattribute').split('.');
                        		 if(ci[0].indexOf("<div")==0){
                        				ci[0]=ci[0].substring(ci[0].indexOf(">")+1,ci[0].length);
                        				ci[1]=ci[1].substring(0,ci[1].indexOf("<"));
     							}
                        		 //var cit ='<item>\n';
                        		 //var ctype ='<type>'+ci[0]+'</type>\n';
                        		 if(map.containsKey(ci[0])){
                        			 map.get(ci[0]).push({
                        				 name: ci[1],
                        				 rawSource:rawitem.down('form').down('#type').value,
                        			     expression:grid.getAt(i).get('rawattribute')
                        			 });
                        		 }else{
                        			 var cat = new Array();
                        			 cat.push({
                        				 name: ci[1],
                    				     rawSource:rawitem.down('form').down('#type').value,
                    			         expression:grid.getAt(i).get('rawattribute')
                        			 });
                        			 map.put(ci[0],cat);
                        		 }
                    		 }
                    		 
                    		 //c=c+map;
                    		 var at = '<attribute>\n';
                    		 at = at+s+s+s+s+'<name>'+grid.getAt(i).get('rawattribute')+'</name>\n';
                    		 at=at+s+s+s+'</attribute>\n';
                    		 ats =ats+s+s+s+at;
                    	 }
                    	 ats =ats+s+s+'</attributes>\n';
                    	 it = it+s+s+type+s+s+des+s+s+ats+s+'</item>\n';
                    	 x=x+s+it;
                    	 rawitem = rawitem.nextSibling('newRawItem');
                	 }
                	 var ks = map.keys();
                	 for(var i=0;i<ks.length;i++){
                		 var cit ='<item>\n';
                		 var ctype ='<type>'+ks[i]+'</type>\n';
                		 var cats = '<attributes>\n';
                		 var cgrid=map.get(ks[i]);
                		 for(var j=0;j<cgrid.length;j++){
                			 var cat = '<attribute>\n';
                			 cat = cat+s+s+s+s+'<name>'+cgrid[j].name+'</name>\n';
                			 cat = cat+s+s+s+s+'<transformations>\n'+s+s+s+s+s+'<transformation>\n'+s+s+s+s+s+s+'<rawSource>'+cgrid[j].rawSource+'</rawSource>\n'+
                			  s+s+s+s+s+s+'<expression>'+cgrid[j].expression+'</expression>\n';
                			 cat=cat+s+s+s+s+s+'</transformation>\n'+s+s+s+s+'</transformations>\n';
                			 cat=cat+s+s+s+'</attribute>\n';
                			 cats =cats+s+s+s+cat;
                		 }
                		 cats =cats+s+s+'</attributes>\n';
                		 cit = cit+s+s+ctype+s+s+cats+s+'</item>\n';
                		 c=c+s+cit;
                	 }
                	 c=c+'</canonicalItems>\n';
                	 x=x+'</rawItems>\n';
                	 x=x+c;
                	 xmlform.down('textareafield').setValue(x);
                 }
                
             } 
         } 
		});
			
        this.callParent(arguments);
    }
});