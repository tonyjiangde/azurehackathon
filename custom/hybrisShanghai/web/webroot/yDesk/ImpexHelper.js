
Ext.define('hTypes', {
    extend: 'Ext.data.Model',
    fields: [{
            name: 'codeofsupertype',
            type: 'string'
        }, {
            name: 'textensionname',
            type: 'string'
        }, {
            name: 'code',
            type: 'string'
        }, {
            name: 'pk',
            type: 'long'
        }

    ],
});
var selectedType = null;
var selectedPK = null;
var attributesdata = null;
var languages = null;
var modifier = [
                ['alias', 'String'],
                ['allownull', 'true;false'],
                ['batchmode', 'true;false'],
                ['cacheUnique', 'true;false'],
                ['cellDecorator', 'String'],
                ['collection-delimiter', 'String'],
                ['dateformat', 'Date'],
                ['default', 'String'],
                ['forceWrite', 'true;false'],
                ['ignoreKeyCase', 'true;false'],
                ['ignorenull', 'true;false'],
                ['impex.legacy.mode', 'true;false'],
                ['key2value-delimiter', 'String'],
                //['lang', 'String'],
                ['map-delimiter', 'String'],
                ['mode', 'append;remove'],
                ['numberformat', 'String'],
                ['path-delimiter', 'String'],
                ['pos', 'Integer'],
                ['processor', 'String'],
                ['translator', 'String'],
                ['unique', 'true;false'],
                ['virtual', 'true;false'],
            ];
function createStore(cfg) {
    // The data store holding the states; shared by each of the ComboBox examples below
    return Ext.create('Ext.data.Store', Ext.apply({
        autoDestroy: true,
        model: 'hTypes',
        data: null
    }, cfg || {}));
};



/*Ext.override(Ext.form.ComboBox, {
	setValueNew : function(f, v, fireSelect){
		if (fireSelect) {
			var record = this.findRecord(f, v);
			var index = this.store.indexOf(record);
			alert(record+"+++"+index);
            this.fireEvent('select', this, record, index);
        }
        this.setValue(v);
        return this;
    }
});*/
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


Ext.define('hybrisDesktop.ImpexHelper.hybrisModifierContainer', {
    extend: 'Ext.container.Container',
    alias: 'widget.hybrisModifierContainer',
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
        this.items = [{
                        xtype: 'container',
                        flex: 1,
                        layout: 'anchor',
                        items: [{
                            xtype: 'combo',
                            name: 'modifier',
                            itemId: 'modifier',
                            fieldLabel: 'Modifier',
                            anchor: '95%',
                            labelWidth: 55,
                            store: new Ext.data.SimpleStore({
                                fields: ['modifier', 'value'],
                                data: this.modifier
                            }),
                            displayField: 'modifier',
                            valueField: 'modifier',
                            mode: 'local',
                            queryMode: 'local',
                            enableRegEx: true,
                            minChars: 1,
                            //queryDelay:1000,
                            typeAhead: true,
                            emptyText: 'please select',
                            readOnly: false,
                            editable: true,
                            scope: this,
                            listeners: {
                                'select': function(combo, record, index) {
                                    var value = combo.getValue();
                                    var rec = combo.findRecord(combo.valueField || combo.displayField, value);
                                    var ind = combo.store.indexOf(rec);
                                    var modifiervalues = rec.get('value');
                                    var modifiervaluedata =[];
                                    if(modifiervalues.indexOf(";") > -1){
                                    	var values = modifiervalues.split(";"); 
                                    	for(var i=0;i<values.length;i++){
                                    		var md = [values[i]];
                                    		modifiervaluedata.push(md);
                                    	}
                                    	this.up('hybrisModifierContainer').down('#value').removeAll();
                                    	Ext.getCmp('impex-attributes').doLayout();
                                    	 this.up('hybrisModifierContainer').down('#value').flex=1;
                                         this.up('hybrisModifierContainer').down('#value').add({
                                             xtype: 'combo',
                                             name: 'modifiervalue',
                                             itemId: 'mvalue',
                                             fieldLabel: '=',
                                             anchor: '95%',
                                             labelWidth: 7,
                                             store: new Ext.data.SimpleStore({
                                                 fields: ['value'],
                                                 data: modifiervaluedata
                                             }),
                                             displayField: 'value',
                                             valueField: 'value',
                                             mode: 'local',
                                             queryMode: 'local',
                                             enableRegEx: true,
                                             minChars: 1,
                                             //queryDelay:1000,
                                             typeAhead: true,
                                             emptyText: 'please select',
                                             readOnly: false,
                                             editable: true
                                         });
                                    }else{
                                    	this.up('hybrisModifierContainer').down('#value').removeAll();
                                    	Ext.getCmp('impex-attributes').doLayout();
                                    	this.up('hybrisModifierContainer').down('#value').flex=1;
                                        this.up('hybrisModifierContainer').down('#value').add({
                                            xtype: 'textfield',
                                            name: 'modifiervalue',
                                            itemId: 'mvalue',
                                            anchor: '95%',
                                            fieldLabel: '=',
                                            //afterLabelTextTpl: required,
                                            allowBlank: true,
                                            labelWidth: 7,
                                        });
                                    	
                                    }
                                    //alert(modifiervaluedata);
                                   
                                   // alert(this.up('hybrisModifierContainer').down('#value').xtype);
                                }
                            }
                        }]
                    }, {
                        xtype: 'container',
                        flex: 0,
                        layout: 'anchor',
                        itemId: 'value',
                        //visible:false,
                        /*items: [{
                            xtype: 'combo',
                            name: 'modifiervalue',
                            
                            fieldLabel: '=',
                            anchor: '95%',
                            labelWidth: 7,
                            store: new Ext.data.SimpleStore({
                                fields: ['modifier', 'value'],
                                data: this.modifier
                            }),
                            displayField: 'modifier',
                            valueField: 'modifier',
                            mode: 'local',
                            queryMode: 'local',
                            enableRegEx: true,
                            //minChars: 1,
                            //queryDelay:1000,
                            typeAhead: true,
                            emptyText: 'please select',
                            readOnly: false,
                            editable: false
                        }]*/
                    }, {
                        xtype: 'container',
                        layout: 'anchor',
                        items: [{
                            xtype: 'button',
                            handler: this.handler,
                            /* function() {
                                this.up('fieldset').add({
                                    xtype: 'combo',
                                    name: 'modifiervalue',
                                    fieldLabel: '=',
                                    anchor: '100%',
                                    labelWidth: 7,
                                    store: new Ext.data.SimpleStore({
                                        fields: ['modifier', 'value'],
                                        data: this.modifier
                                    }),
                                    displayField: 'modifier',
                                    valueField: 'modifier',
                                    mode: 'local',
                                    queryMode: 'local',
                                    enableRegEx: true,
                                    //minChars: 1,
                                    //queryDelay:1000,
                                    typeAhead: true,
                                    emptyText: 'please select',
                                    readOnly: false,
                                    editable: false
                                });
                            },*/
                            scope: this,
                            icon: this.buttonIcon,
                            //text: this.buttonText
                        }]
                    }];


        this.callParent(this);
    }
});
Ext.define('hybrisDesktop.ImpexHelper.hybrisMapContainer', {
    extend: 'Ext.container.Container',
    alias: 'widget.hybrisMapContainer',
    initComponent: function() {
        this.layout = 'hbox';
        this.itemId= 'subattributes';
        this.items = [{
                        xtype: 'container',
                        flex: 1,
                        layout: 'anchor',
                        items: [{
                            xtype: 'combo',
                            name: 'Key||Value',
                            itemId: 'mapkv',
                            fieldLabel: 'Key||Value',
                            anchor: '95%',
                            labelWidth: 85,
                            store: new Ext.data.SimpleStore({
                                fields: ['kv'],
                                data: [
                                       ['key'],
                                       ['value']],
                                       
                            }),
                            value: 'key',
                            displayField: 'kv',
                            valueField: 'kv',
                            forceSelection: true,
                            mode: 'local',
                            queryMode: 'local',
                            enableRegEx: true,
                            minChars: 1,
                            //queryDelay:1000,
                            typeAhead: true,
                            emptyText: 'please select',
                            readOnly: false,
                            editable: false,
                            scope: this,
                        }]
                    }, {
                        xtype: 'container',
                        flex: 1,
                        layout: 'anchor',
                        //visible:false,
                        items: [{
                            xtype: 'textfield',
                            name: 'kvvalue',
                            itemId: 'kvvalue',
                            anchor: '95%',
                            fieldLabel: '=',
                            value: 'code,itemtype(code)',
                            //afterLabelTextTpl: required,
                            allowBlank: true,
                            labelWidth: 7,
                        }]
                    }];


        this.callParent(this);
    }
});
Ext.define('hybrisDesktop.ImpexHelper.hybrisCollectionContainer', {
    extend: 'Ext.form.FieldSet',
    alias: 'widget.hybrisCollectionContainer',
    //itemId: 'hybriscollection',
    defaultType: 'textfield',
    collapsible: true,
    initComponent: function() {
        if (!this.handler) {
            this.handler = function() {
                this.up('fieldset').remove(this);
                Ext.getCmp('impex-attributes').doLayout();
            };
        }
        this.layout = 'anchor';
        this.title = 'Element',
         this.items = [{
                xtype: 'container',
                anchor: '100%',
                layout: 'hbox',
                items: [{
                    xtype: 'container',
                    flex: 2,
                    layout: 'anchor',
                    items: [{
                        xtype: 'combo',
                        name: 'attribute',
                        fieldLabel: 'Type',
                        anchor: '95%',
                        labelWidth: 80,
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
                        listeners: {
                            'select': function(combo, record, index) {
                                var value = combo.getValue();
                                var rec = combo.findRecord(combo.valueField || combo.displayField, value);
                                var ind = combo.store.indexOf(rec);
                                //alert(rec.get('attributepk'));
                                combo.labelEl.dom.innerHTML= "Type:<span style='color:red;font-weight:bold' data-qtip='"+rec.get('attributepk')+"|"+rec.get('qualifier')+"|"+rec.get('type')+"'>?</span>";
                                Ext.Ajax.request({
                                    url: 'services/searchatrributes/'+rec.get('attributepk'),
                                    method: 'GET',
                                    success: function(response, options) {
                                    	//alert(combo.up('hybrisAttributeContainer').title);
                                    	var tdata = Ext.decode(response.responseText);
                                    	if(combo.up('hybrisCollectionContainer').down('#subattributes')){
                                    		combo.up('hybrisCollectionContainer').remove(combo.up('hybrisCollectionContainer').down('#subattributes'));
                                    		Ext.getCmp('impex-attributes').doLayout();
                                    	}else{
                                    		//alert('not found');
                                    	}
                                    	combo.up('hybrisCollectionContainer').add({
                                            xtype: 'fieldset',
                                            title: 'Attributes of '+value,
                                            itemId: 'subattributes',
                                            collapsible: true,
                                            layout: 'anchor',
                                            scope:this,
                                            defaults: {
                                                anchor: '100%'
                                            },
                                            items:[{
                                                xtype: 'hybrisAttributeContainer',
                                                buttonIcon: "images/add.png",
                                                index: 1,
                                                data: tdata,
                                                modifier: modifier,
                                                nomodifier:true,
                                                selectedTypePK:rec.get('attributepk'),
                                                handler: function() {
                                                    //alert(this.up('fieldset').items.length);
                                                    this.up('#subattributes').add({
                                                        xtype: 'hybrisAttributeContainer',
                                                        buttonIcon: "images/minus.png",
                                                        index: this.up('#subattributes').items.length+1,
                                                        data: tdata,
                                                        modifier: modifier,
                                                        nomodifier:true,
                                                        selectedTypePK:rec.get('attributepk'),
                                                    });
                                                }
                                            }]
                                        });
                                    	
                                       /* Ext.getCmp('impex-attributes').removeAll();
                                        Ext.getCmp('impex-attributes').add({
                                            xtype: 'hybrisAttributeContainer',
                                            buttonIcon: "images/add.png",
                                            index: Ext.getCmp('impex-attributes').items.length + 1,
                                            data: tdata,
                                            modifier: modifier,
                                            handler: function() {
                                                //alert(this.up('fieldset').items.length);
                                                this.up('fieldset').add({
                                                    xtype: 'hybrisAttributeContainer',
                                                    buttonIcon: "images/minus.png",
                                                    index: this.up('fieldset').items.length + 1,
                                                    data: attributesdata,
                                                    modifier: modifier
                                                });
                                            }
                                        });*/

                                    },
                                    failure: function(response, options) {
                                        Ext.MessageBox.alert('Error', 'can not get attribute type:' + response.status);
                                    }
                            	});
                            }
                        },
                        displayField: 'qualifier',
                        queryMode: 'local',
                        enableRegEx: true,
                        typeAhead: true,
                        minchar:1,
                        //forceSelection: false,
                        emptyText: 'please select',
                        readOnly: false
                    }]
                }]
            }/*{
                xtype: 'fieldset',
                title: 'Modifiers',
                collapsible: true,
                layout: 'anchor',
                defaults: {
                    anchor: '100%'
                },
              	items:[{
                xtype: 'hybrisModifierContainer',
                buttonIcon: "images/add.png",
                //index: this.up('fieldset').items.length + 1,
                modifier: this.modifier,
                handler: function() {
                	//alert(this.up('fieldset').items.length);
                    this.up('fieldset').add({
                    	xtype: 'hybrisModifierContainer',
                        buttonIcon: "images/minus.png",
                        //index: this.up('fieldset').items.length + 1,
                        modifier: this.modifier
                     });
                }
             }]
            }*/
            ];


        this.callParent(this);
    },
});

Ext.define('hybrisDesktop.ImpexHelper.hybrisAttributeContainer', {
    extend: 'Ext.form.FieldSet',
    alias: 'widget.hybrisAttributeContainer',
    //itemId: 'hybrisattributes',
    style: {
        borderColor: 'red',
    },
    defaultType: 'textfield',
    collapsible: true,
    initComponent: function() {
    	
    	
        if (!this.handler) {
            this.handler = function() {
                this.up('fieldset').remove(this);
                Ext.getCmp('impex-attributes').doLayout();
            };
        }
        if (!this.index) {
            this.index = 2;
        }
        
        if (!this.nomodifier) {
            this.nomodifier = false;
        }
        this.layout = 'anchor';
        this.title = 'Attributes' + this.index;
        
        if(this.nomodifier == true){
        	this.items = [{
                xtype: 'container',
                anchor: '100%',
                layout: 'hbox',
                items: [{
                    xtype: 'container',
                    flex: 2,
                    layout: 'anchor',
                    items: [{
                        xtype: 'combo',
                        name: 'attribute',
                        fieldLabel: 'Type',
                        //afterLabelTextTpl : '<span style="color:red;font-weight:bold" data-qtip="Required">*</span>',
                        anchor: '95%',
                        labelWidth: 80,
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
                                /*  listeners: {
			                 				load: function (oStore, ayRecords, oOptions ) 
									         {
									             alert('loaded successfully: ' + ayRecords.length);
									         }
           							 }*/
                        }),
                        listeners: {
                            'select': function(combo, record, index) {
                                var value = combo.getValue();
                                var rec = combo.findRecord(combo.valueField || combo.displayField, value);
                                var ind = combo.store.indexOf(rec);

                                //var modifiervalues = rec.get('value');
                                //this.labelEl.dom.innerHTML = "Type:<span style='color:red;font-weight:bold'>Atomic</span>";
                               // combo.up().doLayout();
                                Ext.Ajax.request({
                                    url: 'services/getAtrributeType.do?typepk='+combo.up('hybrisAttributeContainer').selectedTypePK+'&qualifier='+value,
                                    method: 'GET',
                                    success: function(response, options) {

                                        var attributestypedata = Ext.decode(response.responseText);
                                        combo.labelEl.dom.innerHTML= "Type:<span style='color:red;font-weight:bold' data-qtip='"+attributestypedata.pk+"|"+attributestypedata.name+"|"+attributestypedata.itemtype+"'>?</span>";
                                        if(attributestypedata.itemtype.indexOf("Atomic")==0){
                                        	if(combo.up('hybrisAttributeContainer').down('#subattributes')){
                                        		combo.up('hybrisAttributeContainer').remove(combo.up('hybrisAttributeContainer').down('#subattributes'));
                                        		Ext.getCmp('impex-attributes').doLayout();
                                        	}
                                        }else if(attributestypedata.itemtype.indexOf("Map")==0){
                                        	if(combo.up('hybrisAttributeContainer').down('#subattributes')){
                                        		combo.up('hybrisAttributeContainer').remove(combo.up('hybrisAttributeContainer').down('#subattributes'));
                                        		Ext.getCmp('impex-attributes').doLayout();
                                        	}
                                        	
                                        	/*if(attributestypedata.name.indexOf("localized:")==0){
                                        		var cb = combo.up('hybrisAttributeContainer').down('hybrisModifierContainer').down('combo');
                                        		var record = cb.findRecord('modifier', 'lang');
                                        		var index = cb.store.indexOf(record);
                                        		cb.select(record, index);
                                                var modifiervalues = record.get('value');
                                                var modifiervaluedata =[];
                                                if(modifiervalues.indexOf(";") > -1){
                                                	var values = modifiervalues.split(";"); 
                                                	for(var i=0;i<values.length;i++){
                                                		var md = [values[i]];
                                                		modifiervaluedata.push(md);
                                                	}
                                                	cb.up('hybrisModifierContainer').down('#value').removeAll();
                                                	Ext.getCmp('impex-attributes').doLayout();
                                                	cb.up('hybrisModifierContainer').down('#value').flex=1;
                                                	cb.up('hybrisModifierContainer').down('#value').add({
                                                         xtype: 'combo',
                                                         name: 'modifiervalue',
                                                         itemId: 'mvalue',
                                                         fieldLabel: '=',
                                                         anchor: '95%',
                                                         labelWidth: 7,
                                                         store: new Ext.data.SimpleStore({
                                                             fields: ['value'],
                                                             data: modifiervaluedata
                                                         }),
                                                         displayField: 'value',
                                                         valueField: 'value',
                                                         mode: 'local',
                                                         queryMode: 'local',
                                                         enableRegEx: true,
                                                         minChars: 1,
                                                         //queryDelay:1000,
                                                         typeAhead: true,
                                                         emptyText: 'please select',
                                                         readOnly: false,
                                                         editable: true
                                                     });
                                                }else{
                                                	cb.up('hybrisModifierContainer').down('#value').removeAll();
                                                	Ext.getCmp('impex-attributes').doLayout();
                                                	cb.up('hybrisModifierContainer').down('#value').flex=1;
                                                	cb.up('hybrisModifierContainer').down('#value').add({
                                                        xtype: 'textfield',
                                                        name: 'modifiervalue',
                                                        itemId: 'mvalue',
                                                        anchor: '95%',
                                                        fieldLabel: '=',
                                                        //afterLabelTextTpl: required,
                                                        allowBlank: true,
                                                        labelWidth: 7,
                                                    });
                                                	
                                                }
                                        		
                                        	}*/
                                        	Ext.Ajax.request({
                                                url: 'services/searchatrributes/'+attributestypedata.pk,
                                                method: 'GET',
                                                success: function(response, options) {
                                                	//alert(combo.up('hybrisAttributeContainer').title);
                                                	var tdata = Ext.decode(response.responseText);
                                                	if(combo.up('hybrisAttributeContainer').down('#subattributes')){
                                                		combo.up('hybrisAttributeContainer').remove(combo.up('hybrisAttributeContainer').down('#subattributes'));
                                                		Ext.getCmp('impex-attributes').doLayout();
                                                	}else{
                                                		//alert('not found');
                                                	}
                                                	var color = 'red';
                                                	if(combo.up('hybrisAttributeContainer').style.borderColor =='red'){
                                                		color = 'blue';
                                                	}
                                                		
                                                	combo.up('hybrisAttributeContainer').add({
                                                        xtype: 'fieldset',
                                                        title: 'Attributes of '+value,
                                                        itemId: 'subattributes',
                                                        collapsible: true,
                                                        layout: 'anchor',
                                                        scope:this,
                                                        defaults: {
                                                            anchor: '100%'
                                                        },
                                                        items:[{
	                                                        xtype: 'hybrisAttributeContainer',
	                                                        buttonIcon: "images/add.png",
	                                                        index: 1,
	                                                        style: {
	                                                		    borderColor: color,
	                                                		},
	                                                        data: tdata,
	                                                        modifier: modifier,
	                                                        nomodifier:true,
	                                                        selectedTypePK:attributestypedata.pk,
	                                                        handler: function() {
	                                                            //alert(this.up('fieldset').items.length);
	                                                            this.up('#subattributes').add({
	                                                                xtype: 'hybrisAttributeContainer',
	                                                                buttonIcon: "images/minus.png",
	                                                                index: this.up('#subattributes').items.length+1,
	                                                                data: tdata,
	                                                                style: {
	    	                                                		    borderColor: color,
	    	                                                		},
	                                                                modifier: modifier,
	                                                                nomodifier:true,
	                                                                selectedTypePK:attributestypedata.pk,
	                                                            });
	                                                        }
                                                        }]
                                                    });
                                                	
                                                   /* Ext.getCmp('impex-attributes').removeAll();
                                                    Ext.getCmp('impex-attributes').add({
                                                        xtype: 'hybrisAttributeContainer',
                                                        buttonIcon: "images/add.png",
                                                        index: Ext.getCmp('impex-attributes').items.length + 1,
                                                        data: tdata,
                                                        modifier: modifier,
                                                        handler: function() {
                                                            //alert(this.up('fieldset').items.length);
                                                            this.up('fieldset').add({
                                                                xtype: 'hybrisAttributeContainer',
                                                                buttonIcon: "images/minus.png",
                                                                index: this.up('fieldset').items.length + 1,
                                                                data: attributesdata,
                                                                modifier: modifier
                                                            });
                                                        }
                                                    });*/

                                                },
                                                failure: function(response, options) {
                                                    Ext.MessageBox.alert('Error', 'can not get attribute type:' + response.status);
                                                }
                                        	});
                                        }else if(attributestypedata.itemtype.indexOf("Collection")==0){
                                        	Ext.Ajax.request({
                                                url: 'services/showcollectionelementtype.do?pk='+attributestypedata.pk,
                                                method: 'GET',
                                                success: function(response, options) {
                                                	//alert(combo.up('hybrisAttributeContainer').title);
                                                	var tdata = Ext.decode(response.responseText);
                                                	if(combo.up('hybrisAttributeContainer').down('#subattributes')){
                                                		combo.up('hybrisAttributeContainer').remove(combo.up('hybrisAttributeContainer').down('#subattributes'));
                                                		Ext.getCmp('impex-attributes').doLayout();
                                                	}else{
                                                		//alert('not found');
                                                	}
                                                	combo.up('hybrisAttributeContainer').add({
                                                        xtype: 'fieldset',
                                                        title: 'Elements of '+value,
                                                        itemId: 'subattributes',
                                                        collapsible: true,
                                                        layout: 'anchor',
                                                        scope:this,
                                                        defaults: {
                                                            anchor: '100%'
                                                        },
                                                        items:[{
	                                                        xtype: 'hybrisCollectionContainer',
	                                                        data: tdata,
	                                                        modifier: modifier,
	                                                        
                                                        }]
                                                    });
                                                },
                                                failure: function(response, options) {
                                                    Ext.MessageBox.alert('Error', 'can not get attribute type:' + response.status);
                                                }
                                        	});
                                        }else if(attributestypedata.itemtype.indexOf("Composed")==0){
                                        	Ext.Ajax.request({
                                                url: 'services/searchatrributes/'+attributestypedata.pk,
                                                method: 'GET',
                                                success: function(response, options) {
                                                	//alert(combo.up('hybrisAttributeContainer').title);
                                                	var tdata = Ext.decode(response.responseText);
                                                	if(combo.up('hybrisAttributeContainer').down('#subattributes')){
                                                		combo.up('hybrisAttributeContainer').remove(combo.up('hybrisAttributeContainer').down('#subattributes'));
                                                		Ext.getCmp('impex-attributes').doLayout();
                                                	}else{
                                                		//alert('not found');
                                                	}
                                                	var color = 'red';
                                                	if(combo.up('hybrisAttributeContainer').style.borderColor =='red'){
                                                		color = 'blue';
                                                	}
                                                		
                                                	combo.up('hybrisAttributeContainer').add({
                                                        xtype: 'fieldset',
                                                        title: 'Attributes of '+value,
                                                        itemId: 'subattributes',
                                                        collapsible: true,
                                                        layout: 'anchor',
                                                        scope:this,
                                                        defaults: {
                                                            anchor: '100%'
                                                        },
                                                        items:[{
	                                                        xtype: 'hybrisAttributeContainer',
	                                                        buttonIcon: "images/add.png",
	                                                        index: 1,
	                                                        style: {
	                                                		    borderColor: color,
	                                                		},
	                                                        data: tdata,
	                                                        modifier: modifier,
	                                                        nomodifier:true,
	                                                        selectedTypePK:attributestypedata.pk,
	                                                        handler: function() {
	                                                            //alert(this.up('fieldset').items.length);
	                                                            this.up('#subattributes').add({
	                                                                xtype: 'hybrisAttributeContainer',
	                                                                buttonIcon: "images/minus.png",
	                                                                index: this.up('#subattributes').items.length+1,
	                                                                data: tdata,
	                                                                style: {
	    	                                                		    borderColor: color,
	    	                                                		},
	                                                                modifier: modifier,
	                                                                nomodifier:true,
	                                                                selectedTypePK:attributestypedata.pk,
	                                                            });
	                                                        }
                                                        }]
                                                    });
                                                	
                                                   /* Ext.getCmp('impex-attributes').removeAll();
                                                    Ext.getCmp('impex-attributes').add({
                                                        xtype: 'hybrisAttributeContainer',
                                                        buttonIcon: "images/add.png",
                                                        index: Ext.getCmp('impex-attributes').items.length + 1,
                                                        data: tdata,
                                                        modifier: modifier,
                                                        handler: function() {
                                                            //alert(this.up('fieldset').items.length);
                                                            this.up('fieldset').add({
                                                                xtype: 'hybrisAttributeContainer',
                                                                buttonIcon: "images/minus.png",
                                                                index: this.up('fieldset').items.length + 1,
                                                                data: attributesdata,
                                                                modifier: modifier
                                                            });
                                                        }
                                                    });*/

                                                },
                                                failure: function(response, options) {
                                                    Ext.MessageBox.alert('Error', 'can not get attribute type:' + response.status);
                                                }
                                        	});
                                        	
                                        }
                                        
                                        Ext.Ajax.request({
                                            url: 'services/isAttributeLocalized.do?typepk='+combo.up('hybrisAttributeContainer').selectedTypePK+'&qualifier='+value,
                                            method: 'GET',
                                            success: function(response, options) {
                                            	if(response.responseText.trim() =='true'){
                                            		var cb = combo.up('hybrisAttributeContainer').down('hybrisModifierContainer').down('combo');
                                            		var record = cb.findRecord('modifier', 'lang');
                                            		var index = cb.store.indexOf(record);
                                            		cb.select(record, index);
                                                    var modifiervalues = record.get('value');
                                                    var modifiervaluedata =[];
                                                    if(modifiervalues.indexOf(";") > -1){
                                                    	var values = modifiervalues.split(";"); 
                                                    	for(var i=0;i<values.length;i++){
                                                    		var md = [values[i]];
                                                    		modifiervaluedata.push(md);
                                                    	}
                                                    	cb.up('hybrisModifierContainer').down('#value').removeAll();
                                                    	Ext.getCmp('impex-attributes').doLayout();
                                                    	cb.up('hybrisModifierContainer').down('#value').flex=1;
                                                    	cb.up('hybrisModifierContainer').down('#value').add({
                                                             xtype: 'combo',
                                                             name: 'modifiervalue',
                                                             itemId: 'mvalue',
                                                             fieldLabel: '=',
                                                             anchor: '95%',
                                                             labelWidth: 7,
                                                             store: new Ext.data.SimpleStore({
                                                                 fields: ['value'],
                                                                 data: modifiervaluedata
                                                             }),
                                                             displayField: 'value',
                                                             valueField: 'value',
                                                             mode: 'local',
                                                             queryMode: 'local',
                                                             enableRegEx: true,
                                                             minChars: 1,
                                                             //queryDelay:1000,
                                                             typeAhead: true,
                                                             emptyText: 'please select',
                                                             readOnly: false,
                                                             editable: true
                                                         });
                                                    }else{
                                                    	cb.up('hybrisModifierContainer').down('#value').removeAll();
                                                    	Ext.getCmp('impex-attributes').doLayout();
                                                    	cb.up('hybrisModifierContainer').down('#value').flex=1;
                                                    	cb.up('hybrisModifierContainer').down('#value').add({
                                                            xtype: 'textfield',
                                                            name: 'modifiervalue',
                                                            itemId: 'mvalue',
                                                            anchor: '95%',
                                                            fieldLabel: '=',
                                                            //afterLabelTextTpl: required,
                                                            allowBlank: true,
                                                            labelWidth: 7,
                                                        });
                                                    	
                                                    }
                                            		
                                            	}
                                            },
                                            failure: function(response, options) {
                                                Ext.MessageBox.alert('Error', 'can not get isAttributeLocalized ' + response.status);
                                            }
                                    	});
                                    },
                                    failure: function(response, options) {
                                        Ext.MessageBox.alert('Error', 'can not get attribute type:' + response.status);
                                    }
                                });
                            }
                        },
                        displayField: 'qualifier',
                        //queryParam: 'search',
                        queryMode: 'local',
                        enableRegEx: true,
                        minChars: 1,
                        //queryDelay:1000,
                        typeAhead: true,
                        emptyText: 'please select',
                        readOnly: false
                    }]
                }, {
                    xtype: 'container',
                    layout: 'anchor',
                    items: [{
                        xtype: 'button',
                        handler: this.handler,
                        scope: this,
                        icon: this.buttonIcon,
                        //text: this.buttonText
                    }]
                }]
            }
         ];
        	
        	
        }else{
        	this.items = [{
                xtype: 'container',
                anchor: '100%',
                layout: 'hbox',
                items: [{
                    xtype: 'container',
                    flex: 2,
                    layout: 'anchor',
                    items: [{
                        xtype: 'combo',
                        name: 'attribute',
                        fieldLabel: 'Type',
                        //afterLabelTextTpl : '<span style="color:red;font-weight:bold" data-qtip="Required">*</span>',
                        anchor: '95%',
                        labelWidth: 80,
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
                                /*  listeners: {
			                 				load: function (oStore, ayRecords, oOptions ) 
									         {
									             alert('loaded successfully: ' + ayRecords.length);
									         }
           							 }*/
                        }),
                        listeners: {
                            'select': function(combo, record, index) {
                                var value = combo.getValue();
                                var rec = combo.findRecord(combo.valueField || combo.displayField, value);
                                var ind = combo.store.indexOf(rec);

                                //var modifiervalues = rec.get('value');
                                //this.labelEl.dom.innerHTML = "Type:<span style='color:red;font-weight:bold'>Atomic</span>";
                               // combo.up().doLayout();
                                Ext.Ajax.request({
                                    url: 'services/getAtrributeType.do?typepk='+combo.up('hybrisAttributeContainer').selectedTypePK+'&qualifier='+value,
                                    method: 'GET',
                                    success: function(response, options) {

                                        var attributestypedata = Ext.decode(response.responseText);
                                        combo.labelEl.dom.innerHTML= "Type:<span style='color:red;font-weight:bold' data-qtip='"+attributestypedata.pk+"|"+attributestypedata.name+"|"+attributestypedata.itemtype+"'>?</span>";
                                        if(attributestypedata.itemtype.indexOf("Atomic")==0){
                                        	if(combo.up('hybrisAttributeContainer').down('#subattributes')){
                                        		combo.up('hybrisAttributeContainer').remove(combo.up('hybrisAttributeContainer').down('#subattributes'));
                                        		Ext.getCmp('impex-attributes').doLayout();
                                        	}
                                        }else if(attributestypedata.itemtype.indexOf("Map")==0){
                                        	if(combo.up('hybrisAttributeContainer').down('#subattributes')){
                                        		combo.up('hybrisAttributeContainer').remove(combo.up('hybrisAttributeContainer').down('#subattributes'));
                                        		Ext.getCmp('impex-attributes').doLayout();
                                        	}
                                        	Ext.Ajax.request({
                                                url: 'services/showmaptypes.do',
                                                method: 'GET',
                                                success: function(response, options) {
                                                	var mapdata = Ext.decode(response.responseText);
                                                	var at =null;
                                                	console.log(mapdata.length);
                                                	for (var i=0;i<mapdata.length;i++) {
                                                		//console.log(mapdata[i].pk+ "  hallo  "+attributestypedata.pk);
                                                		if(mapdata[i].pk == attributestypedata.pk){
                                                			//alert(mapdata[i].argumentType);
                                                			at = mapdata[i].argumentType;
                                                		}
                                                	}
                                                	
                                                	/*if(attributestypedata.name.indexOf("localized:")==0||at=="Language"){
                                                		var cb = combo.up('hybrisAttributeContainer').down('hybrisModifierContainer').down('combo');
                                                		var record = cb.findRecord('modifier', 'lang');
                                                		var index = cb.store.indexOf(record);
                                                		cb.select(record, index);
                                                        var modifiervalues = record.get('value');
                                                        var modifiervaluedata =[];
                                                        if(modifiervalues.indexOf(";") > -1){
                                                        	var values = modifiervalues.split(";"); 
                                                        	for(var i=0;i<values.length;i++){
                                                        		var md = [values[i]];
                                                        		modifiervaluedata.push(md);
                                                        	}
                                                        	cb.up('hybrisModifierContainer').down('#value').removeAll();
                                                        	Ext.getCmp('impex-attributes').doLayout();
                                                        	cb.up('hybrisModifierContainer').down('#value').flex=1;
                                                        	cb.up('hybrisModifierContainer').down('#value').add({
                                                                 xtype: 'combo',
                                                                 name: 'modifiervalue',
                                                                 itemId: 'mvalue',
                                                                 fieldLabel: '=',
                                                                 anchor: '95%',
                                                                 labelWidth: 7,
                                                                 store: new Ext.data.SimpleStore({
                                                                     fields: ['value'],
                                                                     data: modifiervaluedata
                                                                 }),
                                                                 displayField: 'value',
                                                                 valueField: 'value',
                                                                 mode: 'local',
                                                                 queryMode: 'local',
                                                                 enableRegEx: true,
                                                                 minChars: 1,
                                                                 //queryDelay:1000,
                                                                 typeAhead: true,
                                                                 emptyText: 'please select',
                                                                 readOnly: false,
                                                                 editable: true
                                                             });
                                                        }else{
                                                        	cb.up('hybrisModifierContainer').down('#value').removeAll();
                                                        	Ext.getCmp('impex-attributes').doLayout();
                                                        	cb.up('hybrisModifierContainer').down('#value').flex=1;
                                                        	cb.up('hybrisModifierContainer').down('#value').add({
                                                                xtype: 'textfield',
                                                                name: 'modifiervalue',
                                                                anchor: '95%',
                                                                fieldLabel: '=',
                                                                itemId: 'mvalue',
                                                                //afterLabelTextTpl: required,
                                                                allowBlank: true,
                                                                labelWidth: 7,
                                                            });
                                                        	
                                                        }
                                                	}else{
                                                		combo.up('hybrisAttributeContainer').add({
                                                            xtype: 'hybrisMapContainer'
                                                            
                                                        });
                                                	}*/
                                                },
                                                failure: function(response, options) {
                                                    Ext.MessageBox.alert('Error', 'can not get maptypes:' + response.status);
                                                }
                                        	});
                                        }else if(attributestypedata.itemtype.indexOf("Collection")==0){
                                        	Ext.Ajax.request({
                                                url: 'services/showcollectionelementtype.do?pk='+attributestypedata.pk,
                                                method: 'GET',
                                                success: function(response, options) {
                                                	//alert(combo.up('hybrisAttributeContainer').title);
                                                	var tdata = Ext.decode(response.responseText);
                                                	if(combo.up('hybrisAttributeContainer').down('#subattributes')){
                                                		combo.up('hybrisAttributeContainer').remove(combo.up('hybrisAttributeContainer').down('#subattributes'));
                                                		Ext.getCmp('impex-attributes').doLayout();
                                                	}else{
                                                		//alert('not found');
                                                	}
                                                	combo.up('hybrisAttributeContainer').add({
                                                        xtype: 'fieldset',
                                                        title: 'Elements of '+value,
                                                        itemId: 'subattributes',
                                                        collapsible: true,
                                                        layout: 'anchor',
                                                        scope:this,
                                                        defaults: {
                                                            anchor: '100%'
                                                        },
                                                        items:[{
	                                                        xtype: 'hybrisCollectionContainer',
	                                                        data: tdata,
	                                                        modifier: modifier,
	                                                        
                                                        }]
                                                    });
                                                },
                                                failure: function(response, options) {
                                                    Ext.MessageBox.alert('Error', 'can not get attribute type:' + response.status);
                                                }
                                        	});
                                        }else if (attributestypedata.itemtype.indexOf("Composed")==0){
                                        	Ext.Ajax.request({
                                                url: 'services/searchatrributes/'+attributestypedata.pk,
                                                method: 'GET',
                                                success: function(response, options) {
                                                	//alert(combo.up('hybrisAttributeContainer').title);
                                                	var tdata = Ext.decode(response.responseText);
                                                	if(combo.up('hybrisAttributeContainer').down('#subattributes')){
                                                		combo.up('hybrisAttributeContainer').remove(combo.up('hybrisAttributeContainer').down('#subattributes'));
                                                		Ext.getCmp('impex-attributes').doLayout();
                                                	}else{
                                                		//alert('not found');
                                                	}
                                                	var color = 'red';
                                                	if(combo.up('hybrisAttributeContainer').style.borderColor =='red'){
                                                		color = 'blue';
                                                	}
                                                	combo.up('hybrisAttributeContainer').add({
                                                        xtype: 'fieldset',
                                                        title: 'Attributes of '+value,
                                                        itemId: 'subattributes',
                                                        collapsible: true,
                                                        layout: 'anchor',
                                                        scope:this,
                                                        defaults: {
                                                            anchor: '100%'
                                                        },
                                                        items:[{
	                                                        xtype: 'hybrisAttributeContainer',
	                                                        buttonIcon: "images/add.png",
	                                                        index: 1,
	                                                        data: tdata,
	                                                        style: {
	                                                		    borderColor: color,
	                                                		},
	                                                        modifier: modifier,
	                                                        nomodifier:true,
	                                                        selectedTypePK:attributestypedata.pk,
	                                                        handler: function() {
	                                                            //alert(this.up('fieldset').items.length);
	                                                            this.up('#subattributes').add({
	                                                                xtype: 'hybrisAttributeContainer',
	                                                                buttonIcon: "images/minus.png",
	                                                                index: this.up('#subattributes').items.length+1,
	                                                                data: tdata,
	                                                                style: {
	    	                                                		    borderColor: color,
	    	                                                		},
	                                                                modifier: modifier,
	                                                                nomodifier:true,
	                                                                selectedTypePK:attributestypedata.pk,
	                                                            });
	                                                        }
                                                        }]
                                                    });
                                                	
                                                   /* Ext.getCmp('impex-attributes').removeAll();
                                                    Ext.getCmp('impex-attributes').add({
                                                        xtype: 'hybrisAttributeContainer',
                                                        buttonIcon: "images/add.png",
                                                        index: Ext.getCmp('impex-attributes').items.length + 1,
                                                        data: tdata,
                                                        modifier: modifier,
                                                        handler: function() {
                                                            //alert(this.up('fieldset').items.length);
                                                            this.up('fieldset').add({
                                                                xtype: 'hybrisAttributeContainer',
                                                                buttonIcon: "images/minus.png",
                                                                index: this.up('fieldset').items.length + 1,
                                                                data: attributesdata,
                                                                modifier: modifier
                                                            });
                                                        }
                                                    });*/

                                                },
                                                failure: function(response, options) {
                                                    Ext.MessageBox.alert('Error', 'can not get attribute type:' + response.status);
                                                }
                                        	});
                                        	
                                        }
                                        
                                        Ext.Ajax.request({
                                            url: 'services/isAttributeLocalized.do?typepk='+combo.up('hybrisAttributeContainer').selectedTypePK+'&qualifier='+value,
                                            method: 'GET',
                                            success: function(response, options) {
                                            	//alert(response.responseText);
                                            	if(response.responseText.trim() =='true'||at=="Language"){
                                            		var cb = combo.up('hybrisAttributeContainer').down('hybrisModifierContainer').down('combo');
                                            		var record = cb.findRecord('modifier', 'lang');
                                            		var index = cb.store.indexOf(record);
                                            		cb.select(record, index);
                                                    var modifiervalues = record.get('value');
                                                    var modifiervaluedata =[];
                                                    if(modifiervalues.indexOf(";") > -1){
                                                    	var values = modifiervalues.split(";"); 
                                                    	for(var i=0;i<values.length;i++){
                                                    		var md = [values[i]];
                                                    		modifiervaluedata.push(md);
                                                    	}
                                                    	cb.up('hybrisModifierContainer').down('#value').removeAll();
                                                    	Ext.getCmp('impex-attributes').doLayout();
                                                    	cb.up('hybrisModifierContainer').down('#value').flex=1;
                                                    	cb.up('hybrisModifierContainer').down('#value').add({
                                                             xtype: 'combo',
                                                             name: 'modifiervalue',
                                                             itemId: 'mvalue',
                                                             fieldLabel: '=',
                                                             anchor: '95%',
                                                             labelWidth: 7,
                                                             store: new Ext.data.SimpleStore({
                                                                 fields: ['value'],
                                                                 data: modifiervaluedata
                                                             }),
                                                             displayField: 'value',
                                                             valueField: 'value',
                                                             mode: 'local',
                                                             queryMode: 'local',
                                                             enableRegEx: true,
                                                             minChars: 1,
                                                             //queryDelay:1000,
                                                             typeAhead: true,
                                                             emptyText: 'please select',
                                                             readOnly: false,
                                                             editable: true
                                                         });
                                                    }else{
                                                    	cb.up('hybrisModifierContainer').down('#value').removeAll();
                                                    	Ext.getCmp('impex-attributes').doLayout();
                                                    	cb.up('hybrisModifierContainer').down('#value').flex=1;
                                                    	cb.up('hybrisModifierContainer').down('#value').add({
                                                            xtype: 'textfield',
                                                            name: 'modifiervalue',
                                                            anchor: '95%',
                                                            fieldLabel: '=',
                                                            itemId: 'mvalue',
                                                            //afterLabelTextTpl: required,
                                                            allowBlank: true,
                                                            labelWidth: 7,
                                                        });
                                                    	
                                                    }
                                            	}else{
                                            		combo.up('hybrisAttributeContainer').add({
                                                        xtype: 'hybrisMapContainer'
                                                        
                                                    });
                                            	}
                                            },
                                            failure: function(response, options) {
                                                Ext.MessageBox.alert('Error', 'can not get isAttributeLocalized ' + response.status);
                                            }
                                    	});
                                    },
                                    failure: function(response, options) {
                                        Ext.MessageBox.alert('Error', 'can not get attribute type:' + response.status);
                                    }
                                });
                            }
                        },
                        displayField: 'qualifier',
                        //queryParam: 'search',
                        queryMode: 'local',
                        enableRegEx: true,
                        minChars: 1,
                        //queryDelay:1000,
                        typeAhead: true,
                        emptyText: 'please select',
                        readOnly: false
                    }]
                }, {
                    xtype: 'container',
                    layout: 'anchor',
                    items: [{
                        xtype: 'button',
                        handler: this.handler,
                        scope: this,
                        icon: this.buttonIcon,
                        //text: this.buttonText
                    }]
                }]
            },{
                xtype: 'fieldset',
                title: 'Modifiers',
                collapsible: true,
                layout: 'anchor',
                
                defaults: {
                    anchor: '100%'
                },
              	items:[{
                xtype: 'hybrisModifierContainer',
                buttonIcon: "images/add.png",
                //index: this.up('fieldset').items.length + 1,
                modifier: this.modifier,
                handler: function() {
                	//alert(this.up('fieldset').items.length);
                    this.up('fieldset').add({
                    	xtype: 'hybrisModifierContainer',
                        buttonIcon: "images/minus.png",
                        //index: this.up('fieldset').items.length + 1,
                        modifier: this.modifier
                     });
                }
             }]
            }
            
            
            
            /*{
                xtype: 'fieldset',
                title: 'Modifiers',
                collapsible: true,
                layout: 'anchor',
                defaults: {
                    anchor: '100%'
                },
                items: [{
                    xtype: 'container',
                    anchor: '100%',
                    layout: 'hbox',
                    items: [{
                        xtype: 'container',
                        flex: 1,
                        layout: 'anchor',
                        items: [{
                            xtype: 'combo',
                            name: 'modifier',
                            fieldLabel: 'Modifier',
                            anchor: '95%',
                            labelWidth: 55,
                            store: new Ext.data.SimpleStore({
                                fields: ['modifier', 'value'],
                                data: this.modifier
                            }),
                            displayField: 'modifier',
                            valueField: 'modifier',
                            mode: 'local',
                            queryMode: 'local',
                            enableRegEx: true,
                            //minChars: 1,
                            //queryDelay:1000,
                            typeAhead: true,
                            emptyText: 'please select',
                            readOnly: false,
                            editable: false
                        }]
                    }, {
                        xtype: 'container',
                        flex: 1,
                        layout: 'anchor',
                        items: [{
                            xtype: 'combo',
                            name: 'modifiervalue',
                            fieldLabel: '=',
                            anchor: '100%',
                            labelWidth: 7,
                            store: new Ext.data.SimpleStore({
                                fields: ['modifier', 'value'],
                                data: this.modifier
                            }),
                            displayField: 'modifier',
                            valueField: 'modifier',
                            mode: 'local',
                            queryMode: 'local',
                            enableRegEx: true,
                            //minChars: 1,
                            //queryDelay:1000,
                            typeAhead: true,
                            emptyText: 'please select',
                            readOnly: false,
                            editable: false
                        }]
                    }, {
                        xtype: 'container',
                        layout: 'anchor',
                        items: [{
                            xtype: 'button',
                            handler: function() {
                                //alert(this.up('fieldset').items.length);
                                this.up('fieldset').add({
                                    xtype: 'combo',
                                    name: 'modifiervalue',
                                    fieldLabel: '=',
                                    anchor: '100%',
                                    labelWidth: 7,
                                    store: new Ext.data.SimpleStore({
                                        fields: ['modifier', 'value'],
                                        data: this.modifier
                                    }),
                                    displayField: 'modifier',
                                    valueField: 'modifier',
                                    mode: 'local',
                                    queryMode: 'local',
                                    enableRegEx: true,
                                    //minChars: 1,
                                    //queryDelay:1000,
                                    typeAhead: true,
                                    emptyText: 'please select',
                                    readOnly: false,
                                    editable: false
                                });
                            },
                            //scope: this,
                            icon: this.buttonIcon,
                            //text: this.buttonText
                        }]
                    }]
                }]
            }*/];
        	
        	
        }
            


        this.callParent(this);
    },
});

function evaluate(root,sub) {
	var attributes ="";
	var modifiers ="";
	var at = root.down('hybrisAttributeContainer');
	if(at){
		var cb = at.down('combo');
		var v = cb.getValue();
		if(v && v.length!=0){
			var subattributes = evaluate(at,true);
			if(subattributes){
				attributes=v+"("+subattributes+")";
			}else{
				if(at.down('#mapkv') && at.down('#kvvalue')){
					//alert(at.down('#mapkv').value+"!"+at.down('#kvvalue').value)
					attributes=v+"("+at.down('#mapkv').value+"("+at.down('#kvvalue').value+")"+")";
				}else{
					attributes=v;
				}
				
			}
		}else{
		 /*	if(sub){
				attributes=",";
			}else{
				attributes=";";
			}*/
		}
		if(!sub){
			var modi = at.down('hybrisModifierContainer');
			var modifiers ="[";
			while(modi){
				var m = modi.down('#modifier').getValue();
				var v=null;
				if(m){
					v = modi.down('#mvalue').getValue();
					if(modifiers=="["){
						modifiers=modifiers+m+"="+v;
					}else{
						modifiers=modifiers+","+m+"="+v;
					}
				}
				
				
				//alert(m+"!!!"+v);
				modi = modi.nextSibling('hybrisModifierContainer');
			}
			if(modifiers!="["){
				modifiers=modifiers+"]";
				attributes=attributes+modifiers;
			}
			
		}
		var sibling = at.nextSibling('hybrisAttributeContainer');
		while(sibling){
			cb = sibling.down('combo');
			v = cb.getValue();
			if(v && v.length!=0){
				var subattributes = evaluate(sibling,true);
				if(subattributes){
					if(sub){
						attributes=attributes+","+v+"("+subattributes+")";
					}else{
						attributes=attributes+";"+v+"("+subattributes+")";
					}
					
				}else{
					if(sibling.down('#mapkv') && sibling.down('#kvvalue')){
						if(sub){
							attributes=attributes+","+v+"("+sibling.down('#mapkv').value+"("+sibling.down('#kvvalue').value+")"+")";
						}else{
							attributes=attributes+";"+v+"("+sibling.down('#mapkv').value+"("+sibling.down('#kvvalue').value+")"+")";
						}
					}else{
						if(sub){
							attributes=attributes+","+v;
						}else{
							attributes=attributes+";"+v;
						}
					}
					
					
				}
				if(!sub){
					var modi = sibling.down('hybrisModifierContainer');
					var modifiers ="[";
					while(modi){
						var m = modi.down('#modifier').getValue();
						var v=null;
						if(m){
							v = modi.down('#mvalue').getValue();
							if(modifiers=="["){
								modifiers=modifiers+m+"="+v;
							}else{
								modifiers=modifiers+","+m+"="+v;
							}
						}
						
						//alert(m+"!!!"+v);
						modi = modi.nextSibling('hybrisModifierContainer');
					}
					if(modifiers!="["){
						modifiers=modifiers+"]";
						attributes=attributes+modifiers;
					}
					
				}
			}else{
				if(sub){
					attributes=attributes+",";
				}else{
					attributes=attributes+";";
				}
			}
			sibling = sibling.nextSibling('hybrisAttributeContainer');
		}
		return attributes;
	}else{
		return null;
	}
	
	
	
	
};

Ext.define('hybrisDesktop.ImpexHelper', {
    extend: 'Ext.ux.desktop.Module',

    requires: [
        'Ext.data.ArrayStore',
        'Ext.util.Format',
        'Ext.grid.Panel',
        'Ext.grid.RowNumberer'
    ],

    id: 'ImpexHelper-win',

    init: function() {
        this.launcher = {
            text: 'ImpexHelper',
            iconCls: 'icon-grid'
        };
    },

    createWindow: function() {
        //Ext.state.Manager.setProvider(Ext.create('Ext.state.CookieProvider'));

        Ext.QuickTips.init();
        Ext.apply(Ext.tip.QuickTipManager.getQuickTip(), {
            maxWidth: 800,
            minWidth: 100,
            showDelay: 50 // Show 50ms after entering target
        });
        var desktop = this.app.getDesktop();
        var win = desktop.getWindow('ImpexHelper-win');
        if (!win) {
        	Ext.Ajax.request({
                url: 'services/showlanguages.do',
                method: 'GET',
                success: function(response, options) {
                	//alert(combo.up('hybrisAttributeContainer').title);
                	languages = Ext.decode(response.responseText);
                	if(languages.length >0){
                		var x = languages[0].isocode;
                		for(var i=1;i<languages.length;i++){
                			x=x+";"+languages[i].isocode;
                		}
                		modifier.push(['lang', x]);
                	}
                	//modifier.push()
                },
                failure: function(response, options) {
                    Ext.MessageBox.alert('Error', 'can not get languages:' + response.status);
                }
        	});
            var required = '<span style="color:red;font-weight:bold" data-qtip="Required">*</span>';
            var form = Ext.widget('form', {
                layout: {
                    type: 'vbox',
                    align: 'stretch'
                },
                border: false,
                bodyPadding: 10,

                fieldDefaults: {
                    labelAlign: 'top',
                    labelWidth: 100,
                    labelStyle: 'font-weight:bold'
                },
                items: [{
                    xtype: 'fieldcontainer',
                    fieldLabel: 'Your Name',
                    labelStyle: 'font-weight:bold;padding:0;',
                    layout: 'hbox',
                    defaultType: 'textfield',

                    fieldDefaults: {
                        labelAlign: 'top'
                    },

                    items: [{
                        flex: 1,
                        name: 'firstName',
                        itemId: 'firstName',
                        afterLabelTextTpl: required,
                        fieldLabel: 'First',
                        allowBlank: false
                    }, {
                        width: 30,
                        name: 'middleInitial',
                        fieldLabel: 'MI',
                        margins: '0 0 0 5'
                    }, {
                        flex: 2,
                        name: 'lastName',
                        afterLabelTextTpl: required,
                        fieldLabel: 'Last',
                        allowBlank: false,
                        margins: '0 0 0 5'
                    }]
                }, {
                    xtype: 'textfield',
                    fieldLabel: 'Your Email Address',
                    afterLabelTextTpl: required,
                    vtype: 'email',
                    allowBlank: false
                }, {
                    xtype: 'textfield',
                    fieldLabel: 'Subject',
                    afterLabelTextTpl: required,
                    allowBlank: false
                }, {
                    xtype: 'textareafield',
                    fieldLabel: 'Message',
                    labelAlign: 'top',
                    flex: 1,
                    margins: '0',
                    afterLabelTextTpl: required,
                    allowBlank: false
                }],

                buttons: [{
                    text: 'Cancel',
                    handler: function() {
                        this.up('form').getForm().reset();
                        this.up('window').hide();
                    }
                }, {
                    text: 'Send',
                    handler: function() {
                        if (this.up('form').getForm().isValid()) {
                            // In a real application, this would submit the form to the configured url
                            // this.up('form').getForm().submit();
                            this.up('form').getForm().reset();
                            this.up('window').hide();
                            Ext.MessageBox.alert('Thank you!', 'Your inquiry has been sent. We will respond as soon as possible.');
                        }
                    }
                }]
            });

           
           
            var typecombo = Ext.create('Ext.form.field.ComboBox', {
                name: 'headertype',
                fieldLabel: 'Type',
                anchor: '100%',
                id:'impex-type',
                forceSelection: true,
                allowBlank: false,
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
                minChars: 1,
                //queryDelay:1000,
                typeAhead: true,
                enableRegEx: true,
                emptyText: 'please select',
                readOnly: false,
                scope: this,
                listeners: {
                    /*"select":function(){
                          				 selectedType = this.value; 
                          				 
                        				}*/
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
                                /*headers: {
										                    'userHeader': 'userMsg'
										                },*/
                                method: 'GET',
                                success: function(response, options) {

                                    attributesdata = Ext.decode(response.responseText);
                                    //var olditems = Ext.getCmp('impex-attributes').items;
                                    //alert(attributesdata);
                                    //for(var i=0;i< olditems.length;i++){
                                    //alert(olditems[i]);
                                    //Ext.getCmp('impex-attributes').remove[olditems[i]];
                                    //}
                                    Ext.getCmp('impex-attributes').removeAll();
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
                                    });

                                },
                                failure: function(response, options) {
                                    Ext.MessageBox.alert('Error', 'can not get attributes ' + response.status);
                                }
                            });

                        }

                        //var items = Ext.getCmp('impex-attributes').items;
                        /* for(var i=0;i<items.length;i++){ 
                    							  	items[i].items[0].items[0].clearValue();
                    							 }*/
                        //alert('selected index = ' + rec.get('pk') + ' and record.value=' + value);
                    }
                }



            });



            var formPanel = Ext.create('Ext.form.Panel', {
                frame: true,
                //title: 'Form Fields',
                autoScroll: true,
                bodyPadding: '5 5 0',

                fieldDefaults: {
                    labelAlign: 'top',
                    msgTarget: 'side',
                    anchor: '100%'
                },

                items: [{
                    xtype: 'fieldset',

                    title: 'Header',
                    defaultType: 'textfield',
                    collapsible: true,
                    layout: 'anchor',
                    defaults: {
                        anchor: '100%'
                    },
                    items: [{
                        xtype: 'container',
                        anchor: '100%',
                        layout: 'hbox',
                        items: [{
                            xtype: 'container',
                            flex: 1,
                            layout: 'anchor',
                            items: [{
                                xtype: 'combo',
                                name: 'headermode',
                                fieldLabel: 'Mode',
                                id:'impex-mode',
                                anchor: '95%',
                                forceSelection: true,
                                store: new Ext.data.SimpleStore({
                                    fields: ['mode'],
                                    data: [
                                        ['INSERT'],
                                        ['UPDATE'],
                                        ['INSERT_UPDATE'],
                                        ['REMOVE']
                                    ]
                                }),
                                displayField: 'mode',
                                valueField: 'mode',
                                mode: 'local',
                                value: 'INSERT_UPDATE',
                                emptyText: 'please select',
                                readOnly: false,
                                editable: false
                            }]
                        }, {
                            xtype: 'container',
                            flex: 1,
                            layout: 'anchor',
                            items: [typecombo]
                        }]
                    }, {
                        xtype: 'fieldset',
                        id: 'impex-attributes',
                        title: 'Attributes',
                        defaultType: 'textfield',
                        collapsible: true,
                        layout: 'anchor',
                        defaults: {
                            anchor: '100%'
                        },
                        fieldDefaults: {
                            labelAlign: 'left'

                        },
                        //items:[

                        /*{
                            xtype: 'container',
                            flex: 1,
                            layout: 'hbox',
                            items : [{
				                xtype: 'container',
				                flex: 1,
				                layout: 'anchor',
				                items: [{
	                                xtype: 'combo',
	                                name: 'attribute',
	                                fieldLabel: 'Attribute 1',
	                                forceSelection: true, 
	                                anchor:'95%',
	                                store: createStore({
	                                    proxy: {
	                                        type: 'ajax',
	                                        url: 'services/searchatrributes/8796097216594',
	                                        reader: {
	                        	                type: 'json'
	                        	                
	                        	            }
	                                    },
	                                    model: 'AttributeModel',
	                                    typeAhead:true,
	                                    autoLoad: true,
	                                    data: null
	                                }),
	                                   displayField:'qualifier',
	                                   //queryParam: 'search',
	                                   queryMode: 'local',
	                                   enableRegEx:true, 
	                                   //minChars: 1,
	                                   //queryDelay:1000, 
	                                   emptyText:'please select',
	                                   readOnly:false
						                            }]
					            }, {
					                xtype: 'container',
					                layout: 'anchor',
					                items: [{
					                    xtype: 'button',
					                    //handler: this.handler,
					                    //scope: this,
					                    icon: "images/add.png",
					                    handler: function () {
					                    	//alert(this.up('fieldset').items.length);
					                		this.up('fieldset').add({
					                    			xtype: 'hybrisAttributeContainer',
					                                buttonIcon: "images/minus.png",
					                                index: this.up('fieldset').items.length+1
					                		});
					            		}
					                }]
					            }]
                        
            			}*/

                        //]
                    }/*, {
                        xtype: 'combo',
                        name: 'headermode',
                        fieldLabel: 'Mode',
                        store: new Ext.data.SimpleStore({
                            fields: ['mode'],
                            data: [
                                ['INSERT'],
                                ['UPDATE'],
                                ['INSERT_UPDATE'],
                                ['REMOVE']
                            ]
                        }),
                        displayField: 'mode',
                        valueField: 'mode',
                        mode: 'local',
                        emptyText: 'please select',
                        readOnly: false
                    }, {
                        xtype: 'textfield',
                        name: 'textfield1',
                        fieldLabel: 'Text field',
                        value: 'Text field value'
                    }, {
                        xtype: 'hiddenfield',
                        name: 'hidden1',
                        value: 'Hidden field value'
                    }, {
                        xtype: 'textfield',
                        name: 'password1',
                        inputType: 'password',
                        fieldLabel: 'Password field'
                    }, {
                        xtype: 'filefield',
                        name: 'file1',
                        fieldLabel: 'File upload'
                    }, {
                        xtype: 'textareafield',
                        name: 'textarea1',
                        fieldLabel: 'TextArea',
                        value: 'Textarea value'
                    }, {
                        xtype: 'displayfield',
                        name: 'displayfield1',
                        fieldLabel: 'Display field',
                        value: 'Display field <span style="color:green;">value</span>'
                    }, {
                        xtype: 'numberfield',
                        name: 'numberfield1',
                        fieldLabel: 'Number field',
                        value: 5,
                        minValue: 0,
                        maxValue: 50
                    }, {
                        xtype: 'checkboxfield',
                        name: 'checkbox1',
                        fieldLabel: 'Checkbox',
                        boxLabel: 'box label'
                    }, {
                        xtype: 'radiofield',
                        name: 'radio1',
                        value: 'radiovalue1',
                        fieldLabel: 'Radio buttons',
                        boxLabel: 'radio 1'
                    }, {
                        xtype: 'radiofield',
                        name: 'radio1',
                        value: 'radiovalue2',
                        fieldLabel: '',
                        labelSeparator: '',
                        hideEmptyLabel: false,
                        boxLabel: 'radio 2'
                    }, {
                        xtype: 'datefield',
                        name: 'date1',
                        fieldLabel: 'Date Field'
                    }, {
                        xtype: 'timefield',
                        name: 'time1',
                        fieldLabel: 'Time Field',
                        minValue: '1:30 AM',
                        maxValue: '9:15 PM'
                    }*/]
                }]
            });
            var formPaneleast = Ext.create('Ext.form.Panel', {
                frame: true,
                //title: 'Form Fields',
                autoScroll: false,
                bodyPadding: '0 0 0 0',

                fieldDefaults: {
                    labelAlign: 'top',
                    msgTarget: 'side',
                    anchor: '100%'
                },

                items: [{
                    xtype: 'textareafield',
                    id:'impex-value',
                    grow: true,
                    name: 'ImpexQuery',
                    //fieldLabel: 'ImpexQuery',
                    anchor: '100%, 100%',
                    autoScroll: true
                }]
            });
            var cp = Ext.create('Ext.panel.Panel', {
                region: 'center',
                collapsible: false,
                id: 'impex-center',
                layout: 'fit',
                border: 0,
                items: [formPanel],
                //title: "<img border='0' src='images/favicon.ico' height='16' width='16' />Attributes",
                split: true,
                width: '60%',
                minWidth: 100,
                itemId: 'cp',
                minHeight: 160,
                //bodyPadding: 10,
                stateId: 'centerRegion',
                stateful: true,
                html: 'center'
            });

            var ep = Ext.create('Ext.panel.Panel', {
                region: 'east',
                id: 'impex-east',
                collapsible: true,
                collapsed: true,
                layout: 'fit',
                border: 0,
                title: 'ImpexQuery',
                items: [formPaneleast],
                split: true,
                width: '40%',
                minWidth: 100,
                itemId: 'ep',
                minHeight: 160,
                //bodyPadding: 10,
                stateId: 'eastRegion',
                stateful: true,
                html: 'east'
            });
            win = desktop.createWindow({
                id: 'ImpexHelper-win',
                title: 'ImpexHelper',
                width: 740,
                height: 480,
                iconCls: 'icon-grid',
                animCollapse: true,
                constrainHeader: false,
                layout: {
                    type: 'border',
                    padding: 0
                },
                defaults: {
                    split: true
                },
                items: [
                    cp, ep
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
                tbar: [{
                    text: 'To Impex',
                    tooltip: 'convert to impex header',
                    iconCls: 'option',
                    handler: function() {
                    	var mode =Ext.getCmp('impex-mode').getValue();
                    	var type=Ext.getCmp('impex-type').getValue();
                    	var atts="";
                    	if(!type || 0 === type.length){
                    		Ext.MessageBox.alert('Error', 'please select a type!');
                    	}else{
                    		//attributes= "";
                    		atts = evaluate(Ext.getCmp('impex-attributes'),false);
                    		/*var at = Ext.getCmp('impex-attributes').down('hybrisAttributeContainer');
                    		var cb = at.down('combo');
                    		var v = cb.getValue();
                    		if(v && v.length!=0){
                    			attributes=v;
                    		}else{
                    			attributes=";";
                    		}
                    		var sibling = at.nextSibling('hybrisAttributeContainer');
                    		while(sibling){
                    			cb = sibling.down('combo');
                    			v = cb.getValue();
                    			if(v && v.length!=0){
                    				attributes=attributes+";"+v;
                    			}else{
                    				attributes=attributes+";";
                    			}
                    			sibling = sibling.nextSibling('hybrisAttributeContainer');
                    		}*/

                    		
                    			
                    		
                        	Ext.getCmp('impex-value').setValue(mode+ ' '+type+";"+atts);
                    	}
                    	
                        //alert(mode+ '  gaga   '+type);
                    }
                }, '-', {
                    text: 'Options',
                    tooltip: 'Modify options',
                    iconCls: 'option'
                }, '-', {
                    text: 'Remove Something',
                    tooltip: 'Remove the selected item',
                    iconCls: 'remove'
                }]
            });
        }
        return win;
    }
});