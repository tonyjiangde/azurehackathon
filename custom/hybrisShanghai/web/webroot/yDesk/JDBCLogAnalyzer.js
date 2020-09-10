Ext.require('Ext.chart.*');
Ext.require(['Ext.layout.container.Fit', 'Ext.window.MessageBox']);
Ext.require([
             'Ext.grid.*',
             'Ext.data.*',
             'Ext.util.*',
             'Ext.tip.QuickTipManager',
         ]); 
Ext.define('analysis', {
    extend: 'Ext.data.Model',
    fields: [{
            name: 'count',
            type: 'long'
        }, {
            name: 'percentcount',
            type: 'double'
        }, {
            name: 'totaltime',
            type: 'long'
        }, {
            name: 'percenttime',
            type: 'double'
        }, 
        {
            name: 'min',
            type: 'long'
        },
        {
            name: 'max',
            type: 'long'
        },
        {
            name: 'average',
            type: 'long'
        }, {
            name: 'standarddeviation',
            type: 'long'
        }, {
            name: 'query',
            type: 'string'
        },
        {name:'exceptions',
        	type: 'string'}

    ]
});
Ext.define('ExceptionModel', {
    extend: 'Ext.data.Model',
    fields: [{
        type: 'string',
        name: 'timestamp'
    }, {
        type: 'long',
        name: 'time'
    }, {
        type: 'string',
        name: 'details'
    }]
});
var selectedType = null;
var selectedPK = null;
var attributesdata = null;
var languages = null;
var msg = function(title, msg) {
    Ext.Msg.show({
        title: title,
        msg: msg,
        minWidth: 200,
        modal: true,
        icon: Ext.Msg.INFO,
        buttons: Ext.Msg.OK
    });
};
var chartswindow =null;
var chartswindow2 =null;
var exceptionsswindow=null;
function createStore(cfg) {
    return Ext.create('Ext.data.Store', Ext.apply({
        autoDestroy: true,
        model: 'analysis',
        data: null
    }, cfg || {}));
};
var storedata=null;
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
var JDBCLogAnalyzerStore =null;
function myclone(obj) {
	var outpurArr = new Array();
	for (var i in obj) {
		outpurArr[i] = typeof (obj[i]) == 'object' ? this.clone(obj[i]) : obj[i];
	}
	return outpurArr;
};
Ext.define('hybrisDesktop.JDBCLogAnalyzer', {
    extend: 'Ext.ux.desktop.Module',

    requires: [
        'Ext.data.ArrayStore',
        'Ext.util.Format',
        'Ext.grid.Panel',
        'Ext.grid.RowNumberer'
    ],

    id: 'JDBCLogAnalyzer-win',

    init: function() {
        this.launcher = {
            text: 'JDBCLogAnalyzer',
            iconCls: 'icon-jdbc'
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
        var win = desktop.getWindow('JDBCLogAnalyzer-win');
        if (!win) {
        	
        	JDBCLogAnalyzerStore = Ext.create('Ext.data.Store', {
    			//pageSize: 50,
    			//remoteSort: true,
    	        model: 'analysis',
    	        data : [],//[{"count":1,"percentcount":2,"totaltime":3,"percenttime":4,"average":5,"standarddeviation":6,"query":"You successfully uploaded"}],
    	        proxy: {
    	            type: 'memory',
    	            reader: {
    	                type: 'json',
    	               //root: 'result'
    	            }
    	        }
    		});
        	 function renderItems(value, metaData,record, rowIdx,colIdx,store){
	            	value = Ext.String.htmlEncode(value);
	            	metaData.tdAttr='data-qtip="<xmp>'+Ext.String.htmlEncode(value)+'</xmp>"';
	            	return value;
	            };
	            function renderPercent(value, metaData,record, rowIdx,colIdx,store){
	            	value = Ext.String.htmlEncode(value);
	            	metaData.tdAttr='data-qtip="<xmp>'+Ext.String.htmlEncode(value)+'</xmp>"';
	            	return value+"%";
	            }; 
	            var cellEditing = Ext.create('Ext.grid.plugin.CellEditing', {
	                clicksToEdit: 1
	            });
        	var grid = Ext.create('Ext.grid.Panel', {
        		//columnLines: true,
    	        height: '100%',
    	        width: '100%',
    	        id:'JDBCLogAnalyzerresult',
                store: JDBCLogAnalyzerStore,
                flex: 3,
                viewConfig: {
                    stripeRows: true
                    
                },
                plugins: [cellEditing],
                selModel: {
                    selType: 'cellmodel'
                },
                listeners : {
                    itemdblclick: function(dv, record, item, index, e) {
                        //alert(record.get('exceptions'));
                    	var query = record.get('query');
                    	var ex = Ext.decode(record.get('exceptions'))
                        if(exceptionsswindow ==null){
                        	function renderItems(value, metaData,record, rowIdx,colIdx,store){
            	            	value = Ext.String.htmlEncode(value);
            	            	metaData.tdAttr='data-qtip="<xmp>'+Ext.String.htmlEncode(value)+'</xmp>"';
            	            	return value;
            	            };
            	            var cellEditing2 = Ext.create('Ext.grid.plugin.CellEditing', {
            	                clicksToEdit: 1
            	            });
            	            
                            var s = Ext.create('Ext.data.Store', {
                    			//pageSize: 50,
                    			//remoteSort: true,
                    	        model: 'ExceptionModel',
                    	        data : ex,
                    	        proxy: {
                    	            type: 'memory',
                    	            reader: {
                    	                type: 'json',
                    	                
                    	            }
                    	        }
                    		});
                            
                            var exceptionsgp = Ext.create('Ext.grid.Panel', {
                    	        id:'jdbcloganalyzerexceptions',
                            	store: s,
                    	        columnLines: true,
                    	        plugins: [cellEditing2],
                                selModel: {
                                    selType: 'cellmodel'
                                },
                    	        columns: [{
                                    text: "timestamp",
                                    dataIndex: 'timestamp',
                                    flex:30,
                                    sortable: true,
                                    renderer: renderItems
                                },{
                                    text: "time",
                                    dataIndex: 'time',
                                    flex: 10,
                                    sortable: true,
                                    renderer: renderItems
                                },{
                                    text: "details",
                                    dataIndex: 'details',
                                    flex: 60,
                                    sortable: true,
                                    editor: {
                                        xtype: 'textfield'
                                    },
                                    renderer: renderItems
                                    
                                }],
                    	        height: '100%',
                    	        width: '100%',
                    	        viewConfig: {
                    	            stripeRows: true
                    	        }
                    		});
                        	exceptionsswindow = Ext.create('Ext.Window', {
                    	        title: query,
                    	        width: 800,
                    	        height: 300,
                    	        modal:true,
                    	        closeAction:'hide',
                    	        maximizable: true,
                    	        //plain: true,
                    	        //headerPosition: 'left',
                    	        layout: 'fit',
                    	        
                    	        items: [
                    	                exceptionsgp
                    	        ]
                    	        
                    	    });
                        	exceptionsswindow.setPosition(e.getXY());
                        	exceptionsswindow.show();
                    		
                    	}else{
                    		exceptionsswindow.setTitle(query);
                    		//alert(pkstring);
                    		//exceptionsswindow.removeAll();
                    		//exceptionsswindow.add(exceptionsgp);
                    		exceptionsswindow.down('#jdbcloganalyzerexceptions').getStore().loadData(ex,false);
                    		exceptionsswindow.setPosition(e.getXY());
                    		exceptionsswindow.doLayout();
                    		exceptionsswindow.show();
                    	}
                    }
                },
                // grid columns
                columns:[{
                    text: "count",
                    dataIndex: 'count',
                    flex:8,
                    sortable: true,
                    renderer: renderItems
                },{
                    text: "percent count",
                    dataIndex: 'percentcount',
                    flex: 8,
                    sortable: true,
                    renderer: renderPercent
                },{
                    text: "totaltime",
                    dataIndex: 'totaltime',
                    flex: 8,
                    sortable: true,
                    renderer: renderItems
                },{
                    text: "percent time",
                    dataIndex: 'percenttime',
                    flex: 8,
                    sortable: true,
                    renderer: renderPercent
                },{
                    text: "min",
                    dataIndex: 'min',
                    flex: 8,
                    sortable: true,
                    renderer: renderItems
                },{
                    text: "max",
                    dataIndex: 'max',
                    flex: 8,
                    sortable: true,
                    renderer: renderItems
                },{
                    text: "average",
                    dataIndex: 'average',
                    flex: 8,
                    sortable: true,
                    renderer: renderItems
                },{
                    text: "standard deviation",
                    dataIndex: 'standarddeviation',
                    flex: 8,
                    sortable: true,
                    renderer: renderItems
                },{
                    text: "query",
                    dataIndex: 'query',
                    flex: 36,
                    sortable: true,
                    editor: {
                        xtype: 'textfield'
                    },
                    renderer: renderItems
                }]
            });
        	 var formPanel = Ext.create('Ext.form.Panel', {
                 frame: true,
                 //flex: 1,
                 //title: 'Form Fields',
                 autoScroll: true,
                 bodyPadding: '0 0 0 0',
                 anchor: '100%',
                 height:100,
                 fieldDefaults: {
                     labelAlign: 'top',
                     msgTarget: 'side',
                     anchor: '100%',
                     
                 },

                 items: [{
                     xtype: 'filefield',
                     name: 'file',
                     fieldLabel: 'File upload'
                 }],
                 /*
                  * {
                     xtype: 'textareafield',
                     id:'impex-value',
                     grow: true,
                     name: 'ImpexQuery',
                     //fieldLabel: 'ImpexQuery',
                     anchor: '100%, 100%',
                     autoScroll: true
                 }
                  */
                 buttons: [{
                     text: 'Upload',
                     handler: function(){
                         if(formPanel.getForm().isValid()){
                        	 var url2 = 'services/upload/'+Ext.getCmp('minPercentage').getValue()+'/'+Ext.getCmp('minTime').getValue()+'/'+Ext.getCmp('minCount').getValue();
                        	 //alert(url2);
                             formPanel.getForm().submit({
                                 url: url2,
                                 method: 'POST',
                                 headers: {'enctype':'multipart/form-data'},
                                 waitMsg: 'Uploading file...',
                                 success: function(form,action){
                                	 //alert(this.response.responseText);
                                	 if(exceptionsswindow!=null){
                                		 exceptionsswindow.destroy();
                                    	 exceptionsswindow=null; 
                                	 }
                                	 
                                	 var dataObj = Ext.decode(this.response.responseText);
                                	 storedata=dataObj.analyzerresultlines;
                                	 //Ext.getCmp('JDBCLogAnalyzerresult').getStore().removeAll();
                                	 //Ext.getCmp('JDBCLogAnalyzerresult').getStore().add(dataObj.analyzerresultlines);
                                	 JDBCLogAnalyzerStore.loadData(dataObj.analyzerresultlines,false);
                                	 //JDBCLogAnalyzerStore.removeAll();
                                	 //JDBCLogAnalyzerStore.add(dataObj.analyzerresultlines);
                                	 //alert(Ext.encode(dataObj.result));
                                	 Ext.getCmp('jdbc-file').setText(dataObj.filename);
                                	 Ext.getCmp('jdbc-status').setText("totaltime:"+dataObj.totaltime+"  totalqeries:"+dataObj.totalqeries);
                                     msg('Success', "jdbc log has been upload and processed!");
                                 },
                                 failure: function() {
                                     Ext.Msg.alert("Error", this.response.responseText);
                                 }
                             });
                         }
                     }
                 }]
             });
        	 var np = Ext.create('Ext.panel.Panel', {
                 region: 'north',
                 collapsible: true,
                 id: 'JDBCLogAnalyzer-north',
                 layout: 'fit',
                 autoScroll: true,
                 border: 0,
                 items: [formPanel],
                 //title: "<img border='0' src='images/favicon.ico' height='16' width='16' />Attributes",
                 split: true,
                 //width: '60%',
                 //minWidth: 100,
                 //itemId: 'cp',
                 height:130,
                 minHeight: 130,
                 //bodyPadding: 10,
                 //stateId: 'centerRegion',
                 //stateful: true,
                 //html: 'center'
             });
            var cp = Ext.create('Ext.panel.Panel', {
                region: 'center',
                collapsible: false,
                id: 'JDBCLogAnalyzer-center',
                layout: 'anchor',
                autoScroll: true,
                border: 0,
                items: [grid],
                //title: "<img border='0' src='images/favicon.ico' height='16' width='16' />Attributes",
                split: true,
                width: '60%',
                minWidth: 100,
                itemId: 'cp',
                minHeight: 160,
                //bodyPadding: 10,
                stateId: 'centerRegion',
                stateful: true,
                //html: 'center'
            });

            var ep = Ext.create('Ext.panel.Panel', {
                region: 'east',
                id: 'JDBCLogAnalyzer-east',
                collapsible: true,
                collapsed: true,
                layout: 'fit',
                border: 0,
                title: 'ImpexQuery',
                items: [],
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
                id: 'JDBCLogAnalyzer-win',
                title: 'JDBCLogAnalyzer',
                width: 940,
                height: 480,
                iconCls: 'icon-jdbc',
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
                    np,cp//, ep
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
                    text: 'Draw Charts',
                    tooltip: 'Present the statitics as charts',
                    iconCls: 'option',
                    handler: function() {
                    	if(storedata!=null){
                    		var store1 = Ext.create('Ext.data.Store', {
                    			//pageSize: 50,
                    			//remoteSort: true,
                    	        model: 'analysis',
                    	        data : null,
                    	        proxy: {
                    	            type: 'memory',
                    	            reader: {
                    	                type: 'json',
                    	               //root: 'result'
                    	            }
                    	        }
                    		});
                    		var store2 = Ext.create('Ext.data.Store', {
                    			//pageSize: 50,
                    			//remoteSort: true,
                    	        model: 'analysis',
                    	        data : null,
                    	        proxy: {
                    	            type: 'memory',
                    	            reader: {
                    	                type: 'json',
                    	               //root: 'result'
                    	            }
                    	        }
                    		});
                    		var data = [];
                    		var i;
                    		var max =10<storedata.length?10:storedata.length;
                    		
                    		for (i = 0; i < max; i++) {
                                data.push(storedata[i]);
                            }
                    		//alert(Ext.encode(storedata));
                    		store1.loadData(data);
                    		store2.loadData(data);
                    		/*var store1 = Ext.create('Ext.data.JsonStore', {
                    	        fields: ['name', 'data1', 'data2', 'data3', 'data4', 'data5', 'data6', 'data7', 'data9', 'data9'],
                    	        data: null
                    	    });
                    		
                    		var data = [],
                            p = (Math.random() *  11) + 1,
                            i;
                        for (i = 0; i < 6; i++) {
                            data.push({
                                name: Ext.Date.monthNames[i % 12],
                                data1: 20,
                                data2: Math.floor(((Math.random() - 0.5) * 100), 20),
                                data3: Math.floor(((Math.random() - 0.5) * 100), 20),
                                data4: Math.floor(((Math.random() - 0.5) * 100), 20),
                                data5: Math.floor(((Math.random() - 0.5) * 100), 20),
                                data6: Math.floor(((Math.random() - 0.5) * 100), 20),
                                data7: Math.floor(((Math.random() - 0.5) * 100), 20),
                                data8: Math.floor(((Math.random() - 0.5) * 100), 20),
                                data9: Math.floor(((Math.random() - 0.5) * 100), 20)
                            });
                        }
                        store1.loadData(data);*/
                    		var chart = Ext.create('Ext.chart.Chart', {
                    	        xtype: 'chart',
                    	        animate: true,
                    	        store: store1,
                    	        shadow: true,
                    	        height: '100%',
                    	        legend: {
                    	            position: 'right'
                    	        },
                    	        insetPadding: 60,
                    	        theme: 'Base:gradients',
                    	        series: [{
                    	            type: 'pie',
                    	            field: 'totaltime',
                    	            showInLegend: true,
                    	            donut: false,
                    	            tips: {
                    	                trackMouse: true,
                    	                width:500,
                    	                height:200,
                    	                //autoHide:false,
                    	                //closable:true,
                    	                //draggable:true,
                    	                //autoScroll : true,
                    	                renderer: function(storeItem, item) {
                    	                    var ti = storeItem.get('query') + ': ' + storeItem.get('percenttime') + '%';
                    	                    this.setTitle(ti.replace(/(.{65})/g,'$1<br>'));
                    	                }
                    	            },
                    	            highlight: {
                    	                segment: {
                    	                    margin: 20
                    	                }
                    	            },
                    	            label: {
                    	                field: 'totaltime',
                    	                display: 'rotate',
                    	                contrast: true,
                    	                font: '18px Arial'//,
                    	               // renderer:function(v) { return v+"!!!"; }
                    	            }
                    	        }]
                    	    });
                    		var chart2 = Ext.create('Ext.chart.Chart', {
                    	        xtype: 'chart',
                    	        animate: true,
                    	        store: store2,
                    	        shadow: true,
                    	        height: '100%',
                    	        legend: {
                    	            position: 'right'
                    	        },
                    	        insetPadding: 60,
                    	        theme: 'Base:gradients',
                    	        series: [{
                    	            type: 'pie',
                    	            field: 'count',
                    	            showInLegend: true,
                    	            donut: false,
                    	            tips: {
                    	                trackMouse: true,
                    	                width:500,
                    	                height:200,
                    	                //autoHide:false,
                    	                //closable:true,
                    	                //draggable:true,
                    	                //autoScroll : true,
                    	                renderer: function(storeItem, item) {
                    	                    var ti = storeItem.get('query') + ': ' + storeItem.get('percenttime') + '%';
                    	                    this.setTitle(ti.replace(/(.{65})/g,'$1<br>'));
                    	                }
                    	            },
                    	            highlight: {
                    	                segment: {
                    	                    margin: 20
                    	                }
                    	            },
                    	            label: {
                    	                field: 'count',
                    	                display: 'rotate',
                    	                contrast: true,
                    	                font: '18px Arial'
                    	            }
                    	        }]
                    	    });
                      /*  var chart = Ext.create('Ext.chart.Chart', {
                            xtype: 'chart',
                            animate: true,
                            store: store1,
                            shadow: true,
                            legend: {
                                position: 'right'
                            },
                            insetPadding: 60,
                            theme: 'Base:gradients',
                            series: [{
                                type: 'pie',
                                field: 'data1',
                                showInLegend: true,
                                donut: false,
                                tips: {
                                    trackMouse: true,
                                    width: 300,
                                    renderer: function(storeItem, item) {
                                        //calculate percentage.
                                        var total = 0;
                                        store1.each(function(rec) {
                                            total += rec.get('data1');
                                        });
                                        this.setTitle(storeItem.get('name') + ': ' + Math.round(storeItem.get('data1') / total * 100) + '%');
                                    }
                                },
                                highlight: {
                                    segment: {
                                        margin: 20
                                    }
                                },
                                label: {
                                    field: 'name',
                                    display: 'rotate',
                                    contrast: true,
                                    font: '18px Arial'
                                }
                            }]
                        });*/
                    		/*var panel1 = Ext.create('widget.panel', {
                    	        //width: 800,
                    	        //height: 400,
                    			anchor:'100%,100%',
                    	        layout: 'anchor',
                    	        items: [{
			                        xtype: 'container',
			                        anchor:'100%,50%',
			                        layout: 'fit',
			                        items: chart
                    	        },{
			                        xtype: 'container',
			                        anchor:'100%,50%',
			                        layout: 'fit',
			                        items: chart2
                    	        }]
                    	    });*/
                    		if(chartswindow ==null){
                        		
                        		
                        		chartswindow = Ext.create('Ext.Window', {
                        	        title: 'Totaltime Charts',
                        	        width: 800,
                        	        height: 800,
                        	        modal:false,
                        	        closeAction:'hide',
                        	        maximizable: true,
                        	        //plain: true,
                        	        //headerPosition: 'left',
                        	        layout: 'fit',
                        	        
                        	        items: [
                        	                chart
                        	        ]
                        	        
                        	    });
                        		chartswindow.center();
                        		chartswindow.show();
                        		chartswindow.doLayout();
                        		
                        		chartswindow2 = Ext.create('Ext.Window', {
                        	        title: 'Count Charts',
                        	        width: 800,
                        	        height: 800,
                        	        modal:false,
                        	        closeAction:'hide',
                        	        maximizable: true,
                        	        //plain: true,
                        	        //headerPosition: 'left',
                        	        layout: 'fit',
                        	        
                        	        items: [
                        	                chart2
                        	        ]
                        	        
                        	    });
                        		chartswindow2.center();
                        		
                        		chartswindow2.show();
                        		chartswindow2.setX(chartswindow.getX()+80);
                        		chartswindow2.setY(chartswindow.getY()+80);
                        		chartswindow2.doLayout();
                        		
                        		
                        	}else{
                        		
                        		chartswindow.removeAll();
                        		chartswindow.add(chart);
                        		chartswindow.center();
                        		chartswindow.show();
                        		chartswindow.doLayout();
                        		
                        		chartswindow2.removeAll();
                        		chartswindow2.add(chart2);
                        		chartswindow2.center();
                        		
                        		chartswindow2.show();
                        		chartswindow2.setX(chartswindow.getX()+80);
                        		chartswindow2.setY(chartswindow.getY()+80);
                        		chartswindow2.doLayout();
                        	}
                    	}
                    	
                    	
                    }
                }, '-', {
                    text: 'Options',
                    tooltip: 'Modify options',
                    iconCls: 'option'
                },'-',{ xtype: 'tbtext',id: 'jdbc-file', text: 'file:' },'-',{ xtype: 'tbtext',id: 'jdbc-status', text: 'Info:' },'-','minPercentTime:',
                {
                    emptyText:'please enter a int value',
                    value:'0',
                    id: 'minPercentage',
                    //tooltip: 'Modify options',
                    xtype: 'textfield',
                    width: 30
                    //handler: this.searchform_handler
                    },
                    '-','minTime:',
                    {
                        emptyText:'please enter a int value',
                        value:'200', 
                        xtype: 'textfield',
                        id: 'minTime',
                        width: 40
                        //handler: this.searchform_handler
                        },'-','minCount:',
                        {
                            emptyText:'please enter a int value',
                            value:'0',
                            id:'minCount',
                            xtype: 'textfield',
                            width: 30
                            //handler: this.searchform_handler
                            }]
            });
        }
        return win;
    }
});