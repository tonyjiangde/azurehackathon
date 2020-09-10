Ext.require('Ext.chart.*');
Ext.require(['Ext.layout.container.Fit', 'Ext.window.MessageBox']);
Ext.require([
             'Ext.grid.*',
             'Ext.data.*',
             'Ext.util.*',
             'Ext.tip.QuickTipManager',
         ]); 



Ext.define('myTreeModel', {
    extend: 'Ext.data.Model',
    proxy: {
        type: 'memory'
    },
    fields: [
             { name: 'id', type: 'string'},
             { name: 'text',  type: 'string'},
             { name: 'details',  type: 'string'}
    ]
});


Ext.define('threadmodel', {
    extend: 'Ext.data.Model',
    fields: [{
            name: 'name',
            type: 'string'
        }, {
            name: 'prio',
            type: 'long'
        }, {
            name: 'tid',
            type: 'long'
        }, {
            name: 'nid',
            type: 'long'
        }, 
        {
            name: 'state',
            type: 'string'
        },
        {
            name: 'details',
            type: 'string'
        }
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
var selectedType = null;
var selectedPK = null;
var attributesdata = null;
var languages = null;
var dumpfileuploaded =false;
var dumfilecontent =null;
var allthreads=null;
var threadswaitingformonitors=null;
var threadssleepingonmonitors=null;
var threadslockingmonitors=null;
var monitorswithlockingthread=null;
var monitorwithoutlockingthread=null;
var allmonitors=null;
var sp =null;
var filename=null;
var threadsize=null;
var monitors=null;
var twfmsize=null;
var tlmsize=null;
var tsomsize=null;
var deadlocks=null;
var deadlockstree=null;
var mwlt=null;
var foldername=null;
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
var deadlocktreenodes=null;

Ext.define('hybrisDesktop.ThreadDumpAnalyzer', {
    extend: 'Ext.ux.desktop.Module',

    requires: [
        'Ext.data.ArrayStore',
        'Ext.util.Format',
        'Ext.grid.Panel',
        'Ext.grid.RowNumberer'
    ],

    id: 'ThreadDumpAnalyzer-win',

    init: function() {
        this.launcher = {
            text: 'ThreadDumpAnalyzer',
            iconCls: 'icon-threaddump'
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
        var win = desktop.getWindow('ThreadDumpAnalyzer-win');
        if (!win) {
        	
        	 function renderItems(value, metaData,record, rowIdx,colIdx,store){
	            	value = Ext.String.htmlEncode(value);
	            	metaData.tdAttr='data-qtip="<xmp>'+Ext.String.htmlEncode(value)+'</xmp>"';
	            	return value;
	            };
	            function renderStates(value, metaData,record, rowIdx,colIdx,store){
	            	value = Ext.String.htmlEncode(value);
	            	var color = '#006400';
	            	if(value.toUpperCase().match('WAITING')){
	            		color='#B8860B';
	            	}
	            	if(value.toUpperCase().match('TIMED_WAITING')){
	            		color='#808000';
	            	}
	            	if(value.toUpperCase().match('BLOCKED')){
	            		color='#8B0000';
	            	}
	            	metaData.tdAttr='data-qtip="<xmp>'+Ext.String.htmlEncode(value)+'</xmp>"';
	            	return '<div style="background-color:'+ color+'">'+value+'</div>';
	            };
	            var cellEditing = Ext.create('Ext.grid.plugin.CellEditing', {
	                clicksToEdit: 1
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
                 },
                 {
                	    id: 'ThreadDumpAnalyzer-parsertype',
                	    xtype: 'radiogroup',
                	    //fieldLabel: 'Single Column',
                	    // Arrange radio buttons into three columns, distributed vertically
                	    columns:2,
                	    vertical: false,
                	    items: [
                	        {boxLabel: 'JSTACK', name: 'type', inputValue: 'jstack'},
                	        {boxLabel: 'HAC', name: 'type', inputValue: 'hac', checked: true}
                	        
                	    ]
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
                        	 var url2 = 'services/uploadthreaddump/'+Ext.getCmp("ThreadDumpAnalyzer-parsertype").getValue()['type'];
                        	 //alert(url2);
                             formPanel.getForm().submit({
                                 url: url2,
                                 method: 'POST',
                                 headers: {'enctype':'multipart/form-data'},
                                 waitMsg: 'Uploading file...',
                                 success: function(form,action){
                                	 
                                	 //alert(this.response.responseText);
                                	 var responsejson = Ext.decode(this.response.responseText);
                                	 foldername=responsejson.folder;
                                	 var dataObj;
                                	 var tda = responsejson.tda;
                                	 var filechildren=[];
                                	 threadswaitingformonitors={};
                                	 threadssleepingonmonitors={};
                                	 threadslockingmonitors={};
                                	 monitorswithlockingthread={};
                                	 monitorwithoutlockingthread={};
                                	 allmonitors={};
                                	 filename={};
                                	 dumfilecontent={};
                                	 allthreads={};
                                	 
                                	 threadsize={};
                                	 monitors={};
                                	 twfmsize={};
                                	 tlmsize={};
                                	 tsomsize={};
                                	 deadlocktreenodes={};
                                	 deadlocks={};
                                	 mwlt={};
                                	 for(var k=0;k<tda.length;k++){
                                		 dataObj=tda[k];
                                		 var threads = dataObj.threaddatas;
                                    	 var threadsarray =[];
                                    	 
                                    	 for(var index in threads)
                                    	 {
                                    	       var mapKey = index;
                                    	       threadsarray.push(threads[mapKey]);
                                    	 }
                                		 
                                    	 var twfm = dataObj.twfm;
                                    	 var tsom = dataObj.tsom;
                                    	 var tlm = dataObj.tlm;
                                    	 
                                    	 allmonitors[k] = dataObj.allmonitors;
                                    	 dumpfileuploaded =true;
                                    	 filename[k]=dataObj.filename;
                                    	 dumfilecontent[k] =dataObj.logfile;
                                    	 allthreads[k]=threadsarray;
                                    	 
                                    	 var ams = dataObj.allmonitorsState;
                                    	 var count = 1;
                                    	 var monitorswlt =[];
                                 		 var monitorswithoutlt=[];
                                     	 for(var mapKey in ams)
                                    	 {
                                     		 var stats = ams[mapKey];
                                     		 var ch =[];
                                     		var s=0;
                                       	    var w=0;
                                       	    var l=0;
                                     		 for(var i=0;i<stats.length;i++){
                                     			
                                     			if(stats[i].length>0){
                                     				for(var j=0;j<stats[i].length;j++){
                                     					if(i==0){
                                         					//var text = "sleeping on monitor: "+stats[i];
                                     						s=stats[i].length;
                                         					var n = {
                                         							id: k+'_'+count,
                                    						        text: 'sleeping on monitor: "'+threads[stats[i][j]].name+'" prio='+threads[stats[i][j]].prio+' tid='+threads[stats[i][j]].tid+' nid='+threads[stats[i][j]].nid+' -'+threads[stats[i][j]].state,
                                    						        leaf: true,
                                    						        details: threads[stats[i][j]].details
                                         					}
                                         					ch.push(n);
                                         					count = count+1;
                                         				}else if(i==1){
                                         					w=stats[i].length;
                                         					var n = {
                                         							id: k+'_'+count,
                                    						        text: 'waiting on monitor: "'+threads[stats[i][j]].name+'" prio='+threads[stats[i][j]].prio+' tid='+threads[stats[i][j]].tid+' nid='+threads[stats[i][j]].nid+' -'+threads[stats[i][j]].state,
                                    						        leaf: true,
                                    						        details: threads[stats[i][j]].details
                                         					}
                                         					ch.push(n);
                                         					count = count+1;
                                         				}else if(i==2){
                                         					l=stats[i].length;
                                         					var n = {
                                         							id: k+'_'+count,
                                    						        text: 'locked by: "'+threads[stats[i][j]].name+'" prio='+threads[stats[i][j]].prio+' tid='+threads[stats[i][j]].tid+' nid='+threads[stats[i][j]].nid+' -'+threads[stats[i][j]].state,
                                    						        leaf: true,
                                    						        details: threads[stats[i][j]].details
                                         					}
                                         					ch.push(n);
                                         					count = count+1;
                                         				}
                                     				}
                                     				
                                     			}
                                     		 }
                                     		 var mycls = 'mygreennode';
                                     		 if(s>=5 || w>=5 || l>=5) mycls = 'myrednode';
                                     		 var mo ={
                                     				id: k+'_'+count,
                    						        text: '['+mapKey+'] (a '+allmonitors[k][mapKey]+'): '+s+' Thread(s) sleeping,'+w+' Thread(s) waiting,'+l+' Thread(s) locking',
                    						        leaf: false,
                    						        cls: mycls,
                    						        children: ch
                                     		 }
                                     		 
                                     		 if(Ext.Array.contains(dataObj.monitorsLocked, mapKey)){
                                     			monitorswlt.push(mo);
                                     		 }else{
                                     			monitorswithoutlt.push(mo);
                                     		 }
                                     		
                                     		count=count+1;
                                    	 }
                                     	monitorswithlockingthread[k]=monitorswlt;
                                 		monitorwithoutlockingthread[k]=monitorswithoutlt;
                                 		var threadswfm =[];
                                 		for(var i=0;i<twfm.length;i++){
                                 			threadswfm.push(threads[twfm[i]]);
	                                   	 }
                                 		threadswaitingformonitors[k]=threadswfm;
                                 		var threadssom=[];
	                                   	 for(var i=0;i<tsom.length;i++){
	                                   		threadssom.push(threads[tsom[i]]);
	                                   	 }
	                                   	threadssleepingonmonitors[k]=threadssom;
	                                   	var threadskm=[];
	                                   	 for(var i=0;i<tlm.length;i++){
	                                   		threadskm.push(threads[tlm[i]]);
	                                   	 }
	                                   	threadslockingmonitors[k]=threadskm;
	                                   	
	                                   	threadsize[k]=dataObj.threadsize;
	                                	 monitors[k]=dataObj.monitors;
	                                	 twfmsize[k]=dataObj.twfmsize;
	                                	 tlmsize[k]=dataObj.tlmsize;
	                                	 tsomsize[k]=dataObj.tsomsize;
	                                   	
	                                	 var dltnodes=[];
	                                	 var dll = dataObj.deadlocklist;
	                                	 deadlocks[k]=dll.length;
	                                	 count = count+1;
	                                	 for(var index in dll)
	                                   	 {
	                                    		 var dl = dll[index];
	                                    		 var ch =[];
	                                    		 var dlnodedetails ='';
	                                    		 for(var index2 in dl)
	                                        	 {
	                                    			 var n = {
	                              							id: k+'_'+count,
	                         						        text: 'involved in the deadlok: "'+threads[dl[index2]].name+'" prio='+threads[dl[index2]].prio+' tid='+threads[dl[index2]].tid+' nid='+threads[dl[index2]].nid+' -'+threads[dl[index2]].state,
	                         						        leaf: true,
	                         						        details: threads[dl[index2]].details
	                              					}
	                                    			 dlnodedetails= dlnodedetails+ threads[dl[index2]].details+'\n\n';
	                              					ch.push(n);
	                              					count = count+1;
	                                        	 }
	                                    		 var dlnode ={
	                                        			id: k+'_'+count,
	                       						        text: 'DeadLock['+index+']',
	                       						        leaf: false,
	                       						        details: dlnodedetails,
	                       						        children: ch
	                                        	}
	                                    		 count = count+1;
	                                    		 dltnodes.push(dlnode);
	                                    }
	                                	 deadlocktreenodes[k]=dltnodes;
	                                	 mwlt[k]=dataObj.mwlt;
	                                	 
	                                	 
	                                	 var child = {
	                                              	text: "file: "+ dataObj.filename,
	                                             	id: k+'_0',
	                                             	expanded: true,
	                                             	children:[{
	                                             		 id: k+'_1',
	                                             		 text: 'Logfile',
	                             					        leaf: true
	                                             	},{
	                             						text: 'Dump around '+ dataObj.timestamp,
	                             						id:k+'_2',
	                             						expanded: true,
	                             						children: [
	                             						    {
	                             						    	id:k+'_3',
	                             						        text: 'Threads ('+ dataObj.threadsize+' Threads overall)',
	                             						        leaf: true
	                             						    },
	                             						    {
	                             						    	id:k+'_4',
	                             						        text: 'Threads waiting for Monitors('+ dataObj.twfmsize+' Threads waiting)',
	                             						        leaf: true
	                             						    },
	                             						    {
	                             						    	id:k+'_5',
	                             						        text: 'Threads sleeping on Monitors('+ dataObj.tsomsize+' Threads sleeping)',
	                             						        leaf: true
	                             						    },
	                             						    {
	                             						    	id:k+'_6',
	                             						        text: 'Threads locking Monitors('+ dataObj.tlmsize+' Threads locking)',
	                             						        leaf: true
	                             						    },
	                             						    {
	                             						    	id:k+'_7',
	                             						        text: 'Monitors with locking thread('+ dataObj.mhlt+'/'+dataObj.monitors+' Monitors)',
	                             						        leaf: true
	                             						    },
	                             						    {
	                             						    	id:k+'_8',
	                             						        text: 'Monitors without locking thread('+ dataObj.mwlt+'/'+dataObj.monitors+' Monitors)',
	                             						        leaf: true
	                             						    },
	                             						    {
	                             						    	id:k+'_9',
	                             						        text: 'DeadLocks('+ deadlocks[k]+')',
	                             						        leaf: true
	                             						    }
	                             						]
	                                             	}]
	                                             };
	                                		 filechildren.push(child);
                                	 }
                                	
                                	 var rootnode = {
                                           	text: 'Thread dump files',
                                         	id: 'root',
                                         	expanded: true,
                                         	children:filechildren
                                         	};
                                	 Ext.getCmp('ThreadDumpAnalyzer-west').setRootNode(rootnode);
                                	 
                                	 
                                	 
                                	
                                	 
                                	 Ext.getCmp('ThreadDumpAnalyzer-west').setDisabled(false);
                                	 Ext.getCmp('ThreadDumpAnalyzer-south').setDisabled(false);
                                	 Ext.getCmp('ThreadDumpAnalyzer-center').setDisabled(false);
//                                	 var threads = dataObj.threaddatas;
//                                	 var threadsarray =[];
//                                	 
//                                	 for(var index in threads)
//                                	 {
//                                	       var mapKey = index;
//                                	       //test2 =test2+"|"+threads[mapKey];
//                                	       threadsarray.push(threads[mapKey]);
//                                	       /*for(i = 0 ; i < threads[mapKey].length ; i++)
//                                	       {
//                                	    	  
//                                	              var mapKeyVal = threads[mapKey];
//                                	       }*/
//                                	 }
//                                	 
//                                	 var twfm = dataObj.twfm;
//                                	 var tsom = dataObj.tsom;
//                                	 var tlm = dataObj.tlm;
//                                	 
//                                	 threadswaitingformonitors=[];
//                                	 threadssleepingonmonitors=[];
//                                	 threadslockingmonitors=[];
//                                	 
//                                	 monitorswithlockingthread=[];
//                                	 monitorwithoutlockingthread=[];
//                                	 allmonitors = dataObj.allmonitors;
//                                	 dumpfileuploaded =true;
//                                	 filename=dataObj.filename;
//                                	 dumfilecontent =dataObj.logfile;
//                                	 allthreads=threadsarray;
//                                	 
//                                	 
//                                	 
//                                	 
//                                	 var ams = dataObj.allmonitorsState;
//                                	 var count = 1;
//                                	 
//                                 	 for(var mapKey in ams)
//                                	 {
//                                 		// test=test+"--"+allmonitors[mapKey];
//                                 		 var stats = ams[mapKey];
//                                 		 var ch =[];
//                                 		var s=0;
//                                   	    var w=0;
//                                   	    var l=0;
//                                 		 for(var i=0;i<stats.length;i++){
//                                 			
//                                 			if(stats[i].length>0){
//                                 				for(var j=0;j<stats[i].length;j++){
//                                 					if(i==0){
//                                     					//var text = "sleeping on monitor: "+stats[i];
//                                 						s=stats[i].length;
//                                     					var n = {
//                                     							id: count,
//                                						        text: 'sleeping on monitor: "'+threads[stats[i][j]].name+'" prio='+threads[stats[i][j]].prio+' tid='+threads[stats[i][j]].tid+' nid='+threads[stats[i][j]].nid+' -'+threads[stats[i][j]].state,
//                                						        leaf: true,
//                                						        details: threads[stats[i][j]].details
//                                     					}
//                                     					ch.push(n);
//                                     					count = count+1;
//                                     				}else if(i==1){
//                                     					w=stats[i].length;
//                                     					var n = {
//                                     							id: count,
//                                						        text: 'waiting on monitor: "'+threads[stats[i][j]].name+'" prio='+threads[stats[i][j]].prio+' tid='+threads[stats[i][j]].tid+' nid='+threads[stats[i][j]].nid+' -'+threads[stats[i][j]].state,
//                                						        leaf: true,
//                                						        details: threads[stats[i][j]].details
//                                     					}
//                                     					ch.push(n);
//                                     					count = count+1;
//                                     				}else if(i==2){
//                                     					l=stats[i].length;
//                                     					var n = {
//                                     							id: count,
//                                						        text: 'locked by: "'+threads[stats[i][j]].name+'" prio='+threads[stats[i][j]].prio+' tid='+threads[stats[i][j]].tid+' nid='+threads[stats[i][j]].nid+' -'+threads[stats[i][j]].state,
//                                						        leaf: true,
//                                						        details: threads[stats[i][j]].details
//                                     					}
//                                     					ch.push(n);
//                                     					count = count+1;
//                                     				}
//                                 				}
//                                 				
//                                 			}
//                                 		 }
//                                 		 var mo ={
//                                 				id: count,
//                						        text: '['+mapKey+'] (a '+allmonitors[mapKey]+'): '+s+' Thread(s) sleeping,'+w+' Thread(s) waiting,'+l+' Thread(s) locking',
//                						        leaf: false,
//                						        children: ch
//                                 		 }
//                                 		
//                                 		 if(Ext.Array.contains(dataObj.monitorsLocked, mapKey)){
//                                 			monitorswithlockingthread.push(mo);
//                                 		 }else{
//                                 			monitorwithoutlockingthread.push(mo);
//                                 		 }
//                                 		
//                                 		count=count+1;
//                                	 }
//                                	 for(var i=0;i<twfm.length;i++){
//                                		 threadswaitingformonitors.push(threads[twfm[i]]);
//                                	 }
//                                	 for(var i=0;i<tsom.length;i++){
//                                		 threadssleepingonmonitors.push(threads[tsom[i]]);
//                                	 }
//                                	 for(var i=0;i<tlm.length;i++){
//                                		 threadslockingmonitors.push(threads[tlm[i]]);
//                                	 }
//                                	 
//                                	 threadsize=dataObj.threadsize;
//                                	 monitors=dataObj.monitors;
//                                	 twfmsize=dataObj.twfmsize;
//                                	 tlmsize=dataObj.tlmsize;
//                                	 tsomsize=dataObj.tsomsize;
//                                	 
//                                	 deadlocktreenodes=[];
//                                	 var dll = dataObj.deadlocklist;
//                                	 deadlocks=dll.length;
//                                	 count = count+1;
//                                	 for(var index in dll)
//                                	 {
//                                		 
//                                		 var dl = dll[index];
//                                		 var ch =[];
//                                		 var dlnodedetails ='';
//                                		 for(var index2 in dl)
//                                    	 {
//                                			 var n = {
//                          							id: count,
//                     						        text: 'involved in the deadlok: "'+threads[dl[index2]].name+'" prio='+threads[dl[index2]].prio+' tid='+threads[dl[index2]].tid+' nid='+threads[dl[index2]].nid+' -'+threads[dl[index2]].state,
//                     						        leaf: true,
//                     						        details: threads[dl[index2]].details
//                          					}
//                                			 dlnodedetails= dlnodedetails+ threads[dl[index2]].details+'\n\n';
//                          					ch.push(n);
//                          					count = count+1;
//                                    	 }
//                                		 var dlnode ={
//                                    			id: count,
//                   						        text: 'DeadLock['+index+']',
//                   						        leaf: false,
//                   						        details: dlnodedetails,
//                   						        children: ch
//                                    	}
//                                		 count = count+1;
//                                		 deadlocktreenodes.push(dlnode);
//                                	 }
//                                	 
//                                	
//                                	 
//                                	 
//                                	 mwlt=dataObj.mwlt;
//                                	// threadswaitingformonitors = threadsarray;
//                                	 var n = Ext.getCmp('ThreadDumpAnalyzer-west').getStore().getNodeById('0');
//                                	 n.set("text", "file: "+ dataObj.filename);
//                                	 n.commit();
//                                	 
//                                	 n = Ext.getCmp('ThreadDumpAnalyzer-west').getStore().getNodeById('2');
//                                	 n.set("text", "Dump around "+ dataObj.timestamp);
//                                	 n.commit();
//                                	 
//                                	 n = Ext.getCmp('ThreadDumpAnalyzer-west').getStore().getNodeById('3');
//                                	 n.set("text", "Threads ("+ dataObj.threadsize+" Threads overall)");
//                                	 n.commit();
//                                	
//                                	 n = Ext.getCmp('ThreadDumpAnalyzer-west').getStore().getNodeById('4');
//                                	 n.set("text", "Threads waiting for Monitors("+ dataObj.twfmsize+" Threads waiting)");
//                                	 n.commit();
//                                	 
//                                	 n = Ext.getCmp('ThreadDumpAnalyzer-west').getStore().getNodeById('5');
//                                	 n.set("text", "Threads sleeping on Monitors("+ dataObj.tsomsize+" Threads sleeping)");
//                                	 n.commit();
//                                	 
//                                	 n = Ext.getCmp('ThreadDumpAnalyzer-west').getStore().getNodeById('6');
//                                	 n.set("text", "Threads locking Monitors("+ dataObj.tlmsize+" Threads locking)");
//                                	 n.commit();
//                                	 
//                                	 n = Ext.getCmp('ThreadDumpAnalyzer-west').getStore().getNodeById('7');
//                                	 n.set("text", "Monitors with locking thread("+ dataObj.mhlt+"/"+dataObj.monitors+" Monitors)");
//                                	 n.commit();
//                                	 
//                                	 n = Ext.getCmp('ThreadDumpAnalyzer-west').getStore().getNodeById('8');
//                                	 n.set("text", "Monitors without locking thread("+ dataObj.mwlt+"/"+dataObj.monitors+" Monitors)");
//                                	 n.commit();
//                                	 
//                                	 n = Ext.getCmp('ThreadDumpAnalyzer-west').getStore().getNodeById('9');
//                                	 n.set("text", "DeadLocks("+ deadlocks+")");
//                                	 n.commit();
//                                	 
//                                	 Ext.getCmp('ThreadDumpAnalyzer-west').setDisabled(false);
//                                	 Ext.getCmp('ThreadDumpAnalyzer-south').setDisabled(false);
//                                	 Ext.getCmp('ThreadDumpAnalyzer-center').setDisabled(false);
                                 },
                                 failure: function() {
                                     Ext.Msg.alert("Error", this.response.responseText);
                                 }
                             });
                         }
                     }
                 },{
                     text: 'HAC ThreadDump',
                     handler: function(){
                         if(formPanel.getForm().isValid()){
                        	 Ext.Ajax.request({ 
     	            		    url:'services/gethacthreaddump', 
     	            		    failure: function(response, options) {
     	            		    	Ext.Msg.alert('Error', response.responseText);
     	            		    }, 
     	            		    success: function(response, options) { 
     	            		    	 var responsejson = Ext.decode(response.responseText);
     	            		    	foldername=responsejson.folder;
                                	 var dataObj;
                                	 var tda = responsejson.tda;
                                	 var filechildren=[];
                                	 threadswaitingformonitors={};
                                	 threadssleepingonmonitors={};
                                	 threadslockingmonitors={};
                                	 monitorswithlockingthread={};
                                	 monitorwithoutlockingthread={};
                                	 allmonitors={};
                                	 filename={};
                                	 dumfilecontent={};
                                	 allthreads={};
                                	 
                                	 threadsize={};
                                	 monitors={};
                                	 twfmsize={};
                                	 tlmsize={};
                                	 tsomsize={};
                                	 deadlocktreenodes={};
                                	 deadlocks={};
                                	 mwlt={};
                                	 for(var k=0;k<tda.length;k++){
                                		 dataObj=tda[k];
                                		 var threads = dataObj.threaddatas;
                                    	 var threadsarray =[];
                                    	 
                                    	 for(var index in threads)
                                    	 {
                                    	       var mapKey = index;
                                    	       threadsarray.push(threads[mapKey]);
                                    	 }
                                		 
                                    	 var twfm = dataObj.twfm;
                                    	 var tsom = dataObj.tsom;
                                    	 var tlm = dataObj.tlm;
                                    	 
                                    	 allmonitors[k] = dataObj.allmonitors;
                                    	 dumpfileuploaded =true;
                                    	 filename[k]=dataObj.filename;
                                    	 dumfilecontent[k] =dataObj.logfile;
                                    	 allthreads[k]=threadsarray;
                                    	 
                                    	 var ams = dataObj.allmonitorsState;
                                    	 var count = 1;
                                    	 var monitorswlt =[];
                                 		 var monitorswithoutlt=[];
                                     	 for(var mapKey in ams)
                                    	 {
                                     		 var stats = ams[mapKey];
                                     		 var ch =[];
                                     		var s=0;
                                       	    var w=0;
                                       	    var l=0;
                                     		 for(var i=0;i<stats.length;i++){
                                     			
                                     			if(stats[i].length>0){
                                     				for(var j=0;j<stats[i].length;j++){
                                     					if(i==0){
                                         					//var text = "sleeping on monitor: "+stats[i];
                                     						s=stats[i].length;
                                         					var n = {
                                         							id: k+'_'+count,
                                    						        text: 'sleeping on monitor: "'+threads[stats[i][j]].name+'" prio='+threads[stats[i][j]].prio+' tid='+threads[stats[i][j]].tid+' nid='+threads[stats[i][j]].nid+' -'+threads[stats[i][j]].state,
                                    						        leaf: true,
                                    						        details: threads[stats[i][j]].details
                                         					}
                                         					ch.push(n);
                                         					count = count+1;
                                         				}else if(i==1){
                                         					w=stats[i].length;
                                         					var n = {
                                         							id: k+'_'+count,
                                    						        text: 'waiting on monitor: "'+threads[stats[i][j]].name+'" prio='+threads[stats[i][j]].prio+' tid='+threads[stats[i][j]].tid+' nid='+threads[stats[i][j]].nid+' -'+threads[stats[i][j]].state,
                                    						        leaf: true,
                                    						        details: threads[stats[i][j]].details
                                         					}
                                         					ch.push(n);
                                         					count = count+1;
                                         				}else if(i==2){
                                         					l=stats[i].length;
                                         					var n = {
                                         							id: k+'_'+count,
                                    						        text: 'locked by: "'+threads[stats[i][j]].name+'" prio='+threads[stats[i][j]].prio+' tid='+threads[stats[i][j]].tid+' nid='+threads[stats[i][j]].nid+' -'+threads[stats[i][j]].state,
                                    						        leaf: true,
                                    						        details: threads[stats[i][j]].details
                                         					}
                                         					ch.push(n);
                                         					count = count+1;
                                         				}
                                     				}
                                     				
                                     			}
                                     		 }
                                     		var mycls = 'mygreennode';
                                    		 if(s>=5 || w>=5) mycls = 'myrednode';
                                     		 var mo ={
                                     				id: k+'_'+count,
                    						        text: '['+mapKey+'] (a '+allmonitors[k][mapKey]+'): '+s+' Thread(s) sleeping,'+w+' Thread(s) waiting,'+l+' Thread(s) locking',
                    						        leaf: false,
                    						        cls: mycls,
                    						        children: ch
                                     		 }
                                     		 
                                     		 if(Ext.Array.contains(dataObj.monitorsLocked, mapKey)){
                                     			monitorswlt.push(mo);
                                     		 }else{
                                     			monitorswithoutlt.push(mo);
                                     		 }
                                     		
                                     		count=count+1;
                                    	 }
                                     	monitorswithlockingthread[k]=monitorswlt;
                                 		monitorwithoutlockingthread[k]=monitorswithoutlt;
                                 		var threadswfm =[];
                                 		for(var i=0;i<twfm.length;i++){
                                 			threadswfm.push(threads[twfm[i]]);
	                                   	 }
                                 		threadswaitingformonitors[k]=threadswfm;
                                 		var threadssom=[];
	                                   	 for(var i=0;i<tsom.length;i++){
	                                   		threadssom.push(threads[tsom[i]]);
	                                   	 }
	                                   	threadssleepingonmonitors[k]=threadssom;
	                                   	var threadskm=[];
	                                   	 for(var i=0;i<tlm.length;i++){
	                                   		threadskm.push(threads[tlm[i]]);
	                                   	 }
	                                   	threadslockingmonitors[k]=threadskm;
	                                   	
	                                   	threadsize[k]=dataObj.threadsize;
	                                	 monitors[k]=dataObj.monitors;
	                                	 twfmsize[k]=dataObj.twfmsize;
	                                	 tlmsize[k]=dataObj.tlmsize;
	                                	 tsomsize[k]=dataObj.tsomsize;
	                                   	
	                                	 var dltnodes=[];
	                                	 var dll = dataObj.deadlocklist;
	                                	 deadlocks[k]=dll.length;
	                                	 count = count+1;
	                                	 for(var index in dll)
	                                   	 {
	                                    		 var dl = dll[index];
	                                    		 var ch =[];
	                                    		 var dlnodedetails ='';
	                                    		 for(var index2 in dl)
	                                        	 {
	                                    			 var n = {
	                              							id: k+'_'+count,
	                         						        text: 'involved in the deadlok: "'+threads[dl[index2]].name+'" prio='+threads[dl[index2]].prio+' tid='+threads[dl[index2]].tid+' nid='+threads[dl[index2]].nid+' -'+threads[dl[index2]].state,
	                         						        leaf: true,
	                         						        details: threads[dl[index2]].details
	                              					}
	                                    			 dlnodedetails= dlnodedetails+ threads[dl[index2]].details+'\n\n';
	                              					ch.push(n);
	                              					count = count+1;
	                                        	 }
	                                    		 var dlnode ={
	                                        			id: k+'_'+count,
	                       						        text: 'DeadLock['+index+']',
	                       						        leaf: false,
	                       						        details: dlnodedetails,
	                       						        children: ch
	                                        	}
	                                    		 count = count+1;
	                                    		 dltnodes.push(dlnode);
	                                    }
	                                	 deadlocktreenodes[k]=dltnodes;
	                                	 mwlt[k]=dataObj.mwlt;
	                                	 
	                                	 
	                                	 var child = {
	                                              	text: "file: "+ dataObj.filename,
	                                             	id: k+'_0',
	                                             	expanded: true,
	                                             	children:[{
	                                             		 id: k+'_1',
	                                             		 text: 'Logfile',
	                             					        leaf: true
	                                             	},{
	                             						text: 'Dump around '+ dataObj.timestamp,
	                             						id:k+'_2',
	                             						expanded: true,
	                             						children: [
	                             						    {
	                             						    	id:k+'_3',
	                             						        text: 'Threads ('+ dataObj.threadsize+' Threads overall)',
	                             						        leaf: true
	                             						    },
	                             						    {
	                             						    	id:k+'_4',
	                             						        text: 'Threads waiting for Monitors('+ dataObj.twfmsize+' Threads waiting)',
	                             						        leaf: true
	                             						    },
	                             						    {
	                             						    	id:k+'_5',
	                             						        text: 'Threads sleeping on Monitors('+ dataObj.tsomsize+' Threads sleeping)',
	                             						        leaf: true
	                             						    },
	                             						    {
	                             						    	id:k+'_6',
	                             						        text: 'Threads locking Monitors('+ dataObj.tlmsize+' Threads locking)',
	                             						        leaf: true
	                             						    },
	                             						    {
	                             						    	id:k+'_7',
	                             						        text: 'Monitors with locking thread('+ dataObj.mhlt+'/'+dataObj.monitors+' Monitors)',
	                             						        leaf: true
	                             						    },
	                             						    {
	                             						    	id:k+'_8',
	                             						        text: 'Monitors without locking thread('+ dataObj.mwlt+'/'+dataObj.monitors+' Monitors)',
	                             						        leaf: true
	                             						    },
	                             						    {
	                             						    	id:k+'_9',
	                             						        text: 'DeadLocks('+ deadlocks[k]+')',
	                             						        leaf: true
	                             						    }
	                             						]
	                                             	}]
	                                             };
	                                		 filechildren.push(child);
                                	 }
                                	
                                	 var rootnode = {
                                           	text: 'Thread dump files',
                                         	id: 'root',
                                         	expanded: true,
                                         	children:filechildren
                                         	};
                                	 Ext.getCmp('ThreadDumpAnalyzer-west').setRootNode(rootnode);
                                	 
                                	 
                                	 
                                	
                                	 
                                	 Ext.getCmp('ThreadDumpAnalyzer-west').setDisabled(false);
                                	 Ext.getCmp('ThreadDumpAnalyzer-south').setDisabled(false);
                                	 Ext.getCmp('ThreadDumpAnalyzer-center').setDisabled(false);
     	            		    }
     	            		});
                         }
                     }
                 }]
             });
        	 var np = Ext.create('Ext.panel.Panel', {
                 region: 'north',
                 collapsible: true,
                 id: 'ThreadDumpAnalyzer-north',
                 layout: 'fit',
                 autoScroll: true,
                 border: 0,
                 items: [formPanel],
                 //title: "<img border='0' src='images/favicon.ico' height='16' width='16' />Attributes",
                 split: true,
                 //width: '60%',
                 //minWidth: 100,
                 //itemId: 'cp',
                 height:150,
                 minHeight: 130,
                 //bodyPadding: 10,
                 //stateId: 'centerRegion',
                 //stateful: true,
                 //html: 'center'
             });
            var cp = Ext.create('Ext.panel.Panel', {
                region: 'center',
                collapsible: false,
                id: 'ThreadDumpAnalyzer-center',
                layout: 'fit',
                autoScroll: true,
                disabled :true,
                border: 0,
                items: [],
                //title: "<img border='0' src='images/favicon.ico' height='16' width='16' />Attributes",
                split: true,
                width: '70%',
                minWidth: 100,
                itemId: 'cp',
                minHeight: 160,
            });
            
           var wp= Ext.create('Ext.tree.Panel', {
        	   id: 'ThreadDumpAnalyzer-west',
        	   title: 'TheadDump file:',
        	   region: 'west',
        	   layout: 'fit',
                width: '30%',
                height: '100%',
                minWidth: 150,
                itemId: 'wp',
                collapsible: true,
                disabled :true,
                border: 0,
                split: true,
                rootVisible: false,
                autoScroll: true,
                root: {
                	text: 'file',
                	id: '0',
                	expanded: true,
                	children:[{
                		 id: '1',
                		 text: 'Logfile',
					        leaf: true
                	},{
						text: 'Dump around',
						id:'2',
						expanded: true,
						children: [
						    {
						    	id:'3',
						        text: 'Threads',
						        leaf: true
						    },
						    {
						    	id:'4',
						        text: 'Thread waiting for Monitors',
						        leaf: true
						    },
						    {
						    	id:'5',
						        text: 'Thread sleeping on Monitors',
						        leaf: true
						    },
						    {
						    	id:'6',
						        text: 'Thread locking Monitors',
						        leaf: true
						    },
						    {
						    	id:'7',
						        text: 'Monitors with locking thread',
						        leaf: true
						    },
						    {
						    	id:'8',
						        text: 'Monitors without locking thread',
						        leaf: true
						    },
						    {
						    	id:'9',
						        text: 'DeadLocks',
						        leaf: true
						    }
						]
                	}
           			]
                },
                listeners: { itemclick: function (view, record, item, index, e, eOpts) {
                		var id = record.get('id').split('_');
                        if(id[1] == '1'){
                        	if(dumpfileuploaded ==true){
                        		var formPaneleast = Ext.create('Ext.form.Panel', {
                                    frame: true,
                                    //value: dumfilecontent,
                                    autoScroll: false,
                                    bodyPadding: '0 0 0 0',

                                    fieldDefaults: {
                                        labelAlign: 'top',
                                        msgTarget: 'side',
                                        anchor: '100%'
                                    },

                                    items: [{
                                        xtype: 'textareafield',
                                        id:'impex-value'+id[0],
                                        grow: true,
                                        name: 'Logfile',
                                        readOnly: true,
                                        value: dumfilecontent[id[0]],
                                        //style:{overflow:'scroll'},
                                        //fieldLabel: 'ImpexQuery',
                                        anchor: '100%, 100%',
                                        autoScroll: true
                                    }]
                                });
                            	Ext.getCmp('ThreadDumpAnalyzer-center').removeAll();
                            	Ext.getCmp('ThreadDumpAnalyzer-center').add(formPaneleast);
                        	}
                        	
                        	
                        }else if(id[1] == '2'){
                        	 
                        	var overview = "Overall Thread Count:     "+threadsize[id[0]]+"\nOverall Monitor Count:     "+monitors[id[0]]+"\nNumber of threads waiting for a monitor:     "+twfmsize[id[0]]+
                        	"\nNumber of threads locking a monitor:     "+tlmsize[id[0]]+"\nNumber of threads sleeping on a monitor:     "+tsomsize[id[0]]+"\nNumber of deadlocks:     "+deadlocks[id[0]]+"\nNumber of Monitors without locking threads:     "+mwlt[id[0]];
                        	overview = overview+"\n\n"+parseInt(100*tsomsize[id[0]]/threadsize[id[0]])+"% of all threads are sleeping on a monitor.\nThis might indicate they are waiting for some external resource (e.g. database) which is overloaded or not available or are just waiting to get to do something (idle threads). You should check the sleeping threads with a filter excluding all idle threads";
                        	if(mwlt[id[0]]>0){
                        		overview = overview+"\n\nThis thread dump contains monitors without a locking thread information. This means, the monitor is hold by a system thread or some external resource.You should check the monitors without locking threads for more information.";
                        	}
                        	if(deadlocks[id[0]]>0){
                        		overview= overview+ "\n\nThis thread dump contains deadlock which describes a situation where two or more threads are blocked forever, waiting for each other. Once we analyze the deadlock situation and found out the threads which are causing deadlock, we need to make code changes to avoid deadlock situation.";
                        	}
                        	var overviewPanel = Ext.create('Ext.form.Panel', {
                                frame: true,
                                //value: dumfilecontent,
                                autoScroll: false,
                                bodyPadding: '0 0 0 0',
                                border: 0,
                                fieldDefaults: {
                                    labelAlign: 'top',
                                    msgTarget: 'side'
                                   
                                },

                                items: [{
                                    xtype: 'textareafield',
                                    id:'ThreadDumpAnalyzer-overview'+id[0],
                                    grow: true,
                                    name: 'info',
                                    border: 0,
                                    readOnly: true,
                                    value: overview,
                                    //style:{overflow:'scroll'},
                                    //fieldLabel: 'ImpexQuery',
                                    anchor: '100%, 100%',
                                    autoScroll: true
                                }]
                            });
                        	
                        	Ext.getCmp('ThreadDumpAnalyzer-center').removeAll();
                        	Ext.getCmp('ThreadDumpAnalyzer-center').add(overviewPanel);
                        	
                        	
                        	
                        }
                        else if(id[1] == '3'){
                        	
                        	var threadDumpStore = Ext.create('Ext.data.Store', {
                    	        model: 'threadmodel',
                    	        data : allthreads[id[0]],
                    	        proxy: {
                    	            type: 'memory',
                    	            reader: {
                    	                type: 'json',
                    	            }
                    	        }
                    		});
                        	
                        	var grid = Ext.create('Ext.ux.LiveSearchGridPanel', {
                    	        height: '100%',
                    	        width: '100%',
                    	        id:'ThreadDumpAnalyzer-Threads'+id[0],
                                store: threadDumpStore,
                                viewConfig: {
                                    stripeRows: true
                                },
                                columns:[{
                                    text: "Name",
                                    dataIndex: 'name',
                                    flex:8,
                                    sortable: true,
                                    renderer: renderItems
                                },{
                                    text: "Prio",
                                    dataIndex: 'prio',
                                    flex: 8,
                                    sortable: true,
                                    renderer: renderItems
                                },{
                                    text: "Thread-ID",
                                    dataIndex: 'tid',
                                    flex: 8,
                                    sortable: true,
                                    renderer: renderItems
                                },{
                                    text: "Native-ID",
                                    dataIndex: 'nid',
                                    flex: 8,
                                    sortable: true,
                                    renderer: renderItems
                                },{
                                    text: "State",
                                    dataIndex: 'state',
                                    flex: 8,
                                    sortable: true,
                                    renderer: renderStates
                                }],
                                listeners : {
                    	        	itemclick: function(dv, record, item, index, e) {
                    	        		Ext.getCmp('ThreadDumpAnalyzer-info').setValue(record.get('details'));
                    	        		if(sp.getCollapsed( ) != false){
                    	        			sp.expand();
                    	        		}
                    	            }
                    	        }
                            });
                        	
                        	Ext.getCmp('ThreadDumpAnalyzer-center').removeAll();
                        	Ext.getCmp('ThreadDumpAnalyzer-center').add(grid);
                        	
                        	
                        }else if(id[1] == '4'){
                        	var threadDumpStore = Ext.create('Ext.data.Store', {
                    	        model: 'threadmodel',
                    	        data : threadswaitingformonitors[id[0]],
                    	        proxy: {
                    	            type: 'memory',
                    	            reader: {
                    	                type: 'json',
                    	            }
                    	        }
                    		});
                        	
                        	var grid = Ext.create('Ext.ux.LiveSearchGridPanel', {
                    	        height: '100%',
                    	        width: '100%',
                    	        id:'ThreadDumpAnalyzer-twfm'+id[0],
                                store: threadDumpStore,
                                viewConfig: {
                                    stripeRows: true
                                },
                                columns:[{
                                    text: "Name",
                                    dataIndex: 'name',
                                    flex:8,
                                    sortable: true,
                                    renderer: renderItems
                                },{
                                    text: "Prio",
                                    dataIndex: 'prio',
                                    flex: 8,
                                    sortable: true,
                                    renderer: renderItems
                                },{
                                    text: "Thread-ID",
                                    dataIndex: 'tid',
                                    flex: 8,
                                    sortable: true,
                                    renderer: renderItems
                                },{
                                    text: "Native-ID",
                                    dataIndex: 'nid',
                                    flex: 8,
                                    sortable: true,
                                    renderer: renderItems
                                },{
                                    text: "State",
                                    dataIndex: 'state',
                                    flex: 8,
                                    sortable: true,
                                    renderer: renderStates
                                }],
                                listeners : {
                    	        	itemclick: function(dv, record, item, index, e) {
                    	        		Ext.getCmp('ThreadDumpAnalyzer-info').setValue(record.get('details'));
                    	        		if(sp.getCollapsed( ) != false){
                    	        			sp.expand();
                    	        		}
                    	            }
                    	        }
                            });
                        	
                        	Ext.getCmp('ThreadDumpAnalyzer-center').removeAll();
                        	Ext.getCmp('ThreadDumpAnalyzer-center').add(grid);
                        	
                        	
                        }else if(id[1] == '5'){

                        	var threadDumpStore = Ext.create('Ext.data.Store', {
                    	        model: 'threadmodel',
                    	        data : threadssleepingonmonitors[id[0]],
                    	        proxy: {
                    	            type: 'memory',
                    	            reader: {
                    	                type: 'json',
                    	            }
                    	        }
                    		});
                        	
                        	var grid = Ext.create('Ext.ux.LiveSearchGridPanel', {
                    	        height: '100%',
                    	        width: '100%',
                    	        id:'ThreadDumpAnalyzer-tsom'+id[0],
                                store: threadDumpStore,
                                viewConfig: {
                                    stripeRows: true
                                },
                                columns:[{
                                    text: "Name",
                                    dataIndex: 'name',
                                    flex:8,
                                    sortable: true,
                                    renderer: renderItems
                                },{
                                    text: "Prio",
                                    dataIndex: 'prio',
                                    flex: 8,
                                    sortable: true,
                                    renderer: renderItems
                                },{
                                    text: "Thread-ID",
                                    dataIndex: 'tid',
                                    flex: 8,
                                    sortable: true,
                                    renderer: renderItems
                                },{
                                    text: "Native-ID",
                                    dataIndex: 'nid',
                                    flex: 8,
                                    sortable: true,
                                    renderer: renderItems
                                },{
                                    text: "State",
                                    dataIndex: 'state',
                                    flex: 8,
                                    sortable: true,
                                    renderer: renderStates
                                }],
                                listeners : {
                    	        	itemclick: function(dv, record, item, index, e) {
                    	        		Ext.getCmp('ThreadDumpAnalyzer-info').setValue(record.get('details'));
                    	        		if(sp.getCollapsed( ) != false){
                    	        			sp.expand();
                    	        		}
                    	            }
                    	        }
                            });
                        	
                        	Ext.getCmp('ThreadDumpAnalyzer-center').removeAll();
                        	Ext.getCmp('ThreadDumpAnalyzer-center').add(grid);
                        	
                        	
                        }else if(id[1] == '6'){

                        	var threadDumpStore = Ext.create('Ext.data.Store', {
                    	        model: 'threadmodel',
                    	        data : threadslockingmonitors[id[0]],
                    	        proxy: {
                    	            type: 'memory',
                    	            reader: {
                    	                type: 'json',
                    	            }
                    	        }
                    		});
                        	
                        	var grid = Ext.create('Ext.ux.LiveSearchGridPanel', {
                    	        height: '100%',
                    	        width: '100%',
                    	        id:'ThreadDumpAnalyzer-tsom'+id[0],
                                store: threadDumpStore,
                                viewConfig: {
                                    stripeRows: true
                                },
                                columns:[{
                                    text: "Name",
                                    dataIndex: 'name',
                                    flex:8,
                                    sortable: true,
                                    renderer: renderItems
                                },{
                                    text: "Prio",
                                    dataIndex: 'prio',
                                    flex: 8,
                                    sortable: true,
                                    renderer: renderItems
                                },{
                                    text: "Thread-ID",
                                    dataIndex: 'tid',
                                    flex: 8,
                                    sortable: true,
                                    renderer: renderItems
                                },{
                                    text: "Native-ID",
                                    dataIndex: 'nid',
                                    flex: 8,
                                    sortable: true,
                                    renderer: renderItems
                                },{
                                    text: "State",
                                    dataIndex: 'state',
                                    flex: 8,
                                    sortable: true,
                                    renderer: renderStates
                                }],
                                listeners : {
                    	        	itemclick: function(dv, record, item, index, e) {
                    	        		Ext.getCmp('ThreadDumpAnalyzer-info').setValue(record.get('details'));
                    	        		if(sp.getCollapsed( ) != false){
                    	        			sp.expand();
                    	        		}
                    	            }
                    	        }
                            });
                        	
                        	Ext.getCmp('ThreadDumpAnalyzer-center').removeAll();
                        	Ext.getCmp('ThreadDumpAnalyzer-center').add(grid);
                        	
                        }else if(id[1] == '7'){
                        	
                        	var rootNode = {
                        		id: id[0]+'_0',
                        		text: 'Monitors',
                        		expanded: true,
                        		children: JSON.parse(JSON.stringify(monitorswithlockingthread[id[0]]))
                        	};
                        	
                        	
                        	var treestore = Ext.create('Ext.data.TreeStore', {
                                model: 'myTreeModel',
                                root: rootNode
                                });
                        	var monitorstree= Ext.create('Ext.tree.Panel', {
                         	   id: 'ThreadDumpAnalyzer-monitors'+id[0],
                         	   layout: 'fit',
                               width: '100%',
                               height: '100%',
                               border: 0,
                               split: true,
                               autoScroll: true,
                               rootVisible: false,
                               store: treestore,
                               //root:rootNode,
                               listeners: { 
                            	   itemclick: function (view, record, item, index, e, eOpts) {
                            		   if(record.get('leaf')){
                            			   //var t = record.get('text').split('tid=');
                            			   //var t2 = t[1].split(' ');
                            			   Ext.getCmp('ThreadDumpAnalyzer-info').setValue(record.get('details'));
                       	        			if(sp.getCollapsed( ) != false){
                       	        				sp.expand();
                       	        			}
                            		   }else{
                            			   var t = record.get('text');
                            			   var swl = t.slice(t.indexOf(':')+1).split(",");
                            			   
                            			   Ext.getCmp('ThreadDumpAnalyzer-info').setValue(swl[0].trim()+'\n'+swl[1].trim()+'\n'+swl[2].trim());
                       	        			if(sp.getCollapsed( ) != false){
                       	        				sp.expand();
                       	        			}
                            		   }
                              		},
                              		itemcontextmenu: function(view, rec, node, index, e) {
                    	                e.stopEvent();
                    	                contextMenu.showAt(e.getXY());
                    	                return false;
                    	            }
                              }
                        	});
                        	var expandAction = Ext.create('Ext.Action', {
                        		text: 'Expand all nodes',
                        	    handler: function(widget, event) {
                        	    	monitorstree.expandAll();
                        	        
                        	    }
                        	   
                        	});
                        	var collapseAction = Ext.create('Ext.Action', {
                        		text: 'Collapse all nodes',
                        	    handler: function(widget, event) {
                        	    	monitorstree.collapseAll();
                        	        
                        	    }
                        	   
                        	});
                            var contextMenu = Ext.create('Ext.menu.Menu', {
                        	    items: [
                        	            expandAction,
                        	            collapseAction
                        	    ]
                        	});
                        	Ext.getCmp('ThreadDumpAnalyzer-center').removeAll();
                        	Ext.getCmp('ThreadDumpAnalyzer-center').add(monitorstree);
                        	
                        }else if(id[1] == '8'){
                        	
                        	var rootNode = {
                        		id: id[0]+'_0',
                        		text: 'Monitors',
                        		expanded: true,
                        		children: JSON.parse(JSON.stringify(monitorwithoutlockingthread[id[0]]))
                        	};
                        	
                        	
                        	var treestore = Ext.create('Ext.data.TreeStore', {
                                model: 'myTreeModel',
                                root: rootNode
                                });
                        	var monitorstree= Ext.create('Ext.tree.Panel', {
                         	   id: 'ThreadDumpAnalyzer-monitors'+id[0],
                         	   layout: 'fit',
                               width: '100%',
                               height: '100%',
                               border: 0,
                               split: true,
                               rootVisible: false,
                               autoScroll: true,
                               store: treestore,
                               //root:rootNode,
                               listeners: { 
                            	   itemclick: function (view, record, item, index, e, eOpts) {
                            		   if(record.get('leaf')){
                            			   //var t = record.get('text').split('tid=');
                            			   //var t2 = t[1].split(' ');
                            			   Ext.getCmp('ThreadDumpAnalyzer-info').setValue(record.get('details'));
                       	        			if(sp.getCollapsed( ) != false){
                       	        				sp.expand();
                       	        			}
                            		   }else{
                            			   var t = record.get('text');
                            			   var swl = t.slice(t.indexOf(':')+1).split(",");
                            			   
                            			   Ext.getCmp('ThreadDumpAnalyzer-info').setValue(swl[0].trim()+'\n'+swl[1].trim()+'\n'+swl[2].trim());
                       	        			if(sp.getCollapsed( ) != false){
                       	        				sp.expand();
                       	        			}
                            		   }
                              		},
                              		itemcontextmenu: function(view, rec, node, index, e) {
                    	                e.stopEvent();
                    	                contextMenu.showAt(e.getXY());
                    	                return false;
                    	            }
                              }
                        	});
                        	var expandAction = Ext.create('Ext.Action', {
                        		text: 'Expand all nodes',
                        	    handler: function(widget, event) {
                        	    	monitorstree.expandAll();
                        	        
                        	    }
                        	   
                        	});
                        	var collapseAction = Ext.create('Ext.Action', {
                        		text: 'Collapse all nodes',
                        	    handler: function(widget, event) {
                        	    	monitorstree.collapseAll();
                        	        
                        	    }
                        	   
                        	});
                            var contextMenu = Ext.create('Ext.menu.Menu', {
                        	    items: [
                        	            expandAction,
                        	            collapseAction
                        	    ]
                        	});
                        	Ext.getCmp('ThreadDumpAnalyzer-center').removeAll();
                        	Ext.getCmp('ThreadDumpAnalyzer-center').add(monitorstree);
                        	
                        }else if(id[1] == '9'){
                        	
                        	var rootNode = {
                        		id: id[0]+'_0',
                        		text: 'DeadLocks',
                        		expanded: true,
                        		children: JSON.parse(JSON.stringify(deadlocktreenodes[id[0]]))
                        	};
                        	
                        	
                        	var treestore = Ext.create('Ext.data.TreeStore', {
                                model: 'myTreeModel',
                                root: rootNode
                                });
                        	var monitorstree= Ext.create('Ext.tree.Panel', {
                         	   id: 'ThreadDumpAnalyzer-monitors'+id[0],
                         	   layout: 'fit',
                               width: '100%',
                               height: '100%',
                               border: 0,
                               split: true,
                               rootVisible: false,
                               autoScroll: true,
                               store: treestore,
                               //root:rootNode,
                               listeners: { 
                            	   itemclick: function (view, record, item, index, e, eOpts) {
                            		   //if(record.get('leaf')){
                            			   //var t = record.get('text').split('tid=');
                            			   //var t2 = t[1].split(' ');
                            			   Ext.getCmp('ThreadDumpAnalyzer-info').setValue(record.get('details'));
                       	        			if(sp.getCollapsed( ) != false){
                       	        				sp.expand();
                       	        			}
                            		   //}else{
                            			   
                            		   //}
                              		},
                              		itemcontextmenu: function(view, rec, node, index, e) {
                    	                e.stopEvent();
                    	                contextMenu.showAt(e.getXY());
                    	                return false;
                    	            }
                              }
                        	});
                        	var expandAction = Ext.create('Ext.Action', {
                        		text: 'Expand all nodes',
                        	    handler: function(widget, event) {
                        	    	monitorstree.expandAll();
                        	        
                        	    }
                        	   
                        	});
                        	var collapseAction = Ext.create('Ext.Action', {
                        		text: 'Collapse all nodes',
                        	    handler: function(widget, event) {
                        	    	monitorstree.collapseAll();
                        	        
                        	    }
                        	   
                        	});
                            var contextMenu = Ext.create('Ext.menu.Menu', {
                        	    items: [
                        	            expandAction,
                        	            collapseAction
                        	    ]
                        	});
                        	Ext.getCmp('ThreadDumpAnalyzer-center').removeAll();
                        	Ext.getCmp('ThreadDumpAnalyzer-center').add(monitorstree);
                        	
                        }
                        
                }
                },
            });
           var formPanelsouth = Ext.create('Ext.form.Panel', {
               frame: true,
               //value: dumfilecontent,
               autoScroll: false,
               bodyPadding: '0 0 0 0',
               border: 0,
               fieldDefaults: {
                   labelAlign: 'top',
                   msgTarget: 'side'
                  
               },

               items: [{
                   xtype: 'textareafield',
                   id:'ThreadDumpAnalyzer-info',
                   grow: true,
                   name: 'info',
                   border: 0,
                   readOnly: true,
                   value: dumfilecontent,
                   //style:{overflow:'scroll'},
                   //fieldLabel: 'ImpexQuery',
                   anchor: '100%, 100%',
                   autoScroll: true
               }]
           });
            sp = Ext.create('Ext.panel.Panel', {
                region: 'south',
                id: 'ThreadDumpAnalyzer-south',
                collapsible: true,
                collapsed: true,
                disabled :true,
                layout: 'fit',
                border: 0,
                title: 'Info',
                items: [formPanelsouth],
                split: true,
                width: '100%',
                //minWidth: 100,
                itemId: 'sp',
                height: 160,
                //bodyPadding: 10,
                
            });
            win = desktop.createWindow({
                id: 'ThreadDumpAnalyzer-win',
                title: 'ThreadDumpAnalyzer',
                width: 940,
                height: 480,
                iconCls: 'icon-threaddump',
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
                    np,wp,cp,sp//, ep
                ],
                tools:[
    	        {
    	        	type:'help',
    	        	tooltip: 'Readme',
    	        	handler: function(event, toolEl, panel){
    	        		function showResult(btn){
    	        			var w = new Ext.Window({
        	        			  autoLoad: {
        	        			    url: "howtotheaddumps2.html",
        	        			    text: "Loading...",
        	        			    timeout: 60,
        	        			    scripts: false 
        	        			  },
        	        			  closeAction:'destroy',
        	        			  autoScroll: true,
        	          	          maximizable: true,
        	        			  height: 600,
        	        			  width: 800
        	        			});
        	        		w.center();
        	        		w.show();
    	        	    };
    	        		Ext.MessageBox.show({
    	                    title: 'Any problems?',
    	                    msg: 'please contact tao.jiang02@sap.com. You can upload a dumpfile or ziped dumpfiles which could be created by using HAC or JSTACK',
    	                    buttons: Ext.MessageBox.YES,
    	                    buttonText:{ 
    	                        yes: "Got it!", 
    	                    },
    	                    fn: showResult
    	                });
    	        		
    	        		
    	        	}
    	        }],
                tbar: [{
                    text: 'Show TGW Report',
                    tooltip: 'TGW Integreted, JAVA 1.8 required!And it seems to only work for HAC dump file!!',
                    iconCls: 'option',
                    handler: function() {
                    	
                    	if(dumpfileuploaded && filename!=null){
                    		if(foldername ==null || foldername==''){
                    			var url = window.location.href;
                        		var type = Ext.getCmp("ThreadDumpAnalyzer-parsertype").getValue()['type'];
                            	url= url.substring(0, url.indexOf("hybrisShanghai")+14)+"/services/tdw?filename="+filename[0]+"&type="+type+"&mode=test";
                            	new Ext.Window({
                            	    title : "TGW Report",
                            	    width : 1000,
                            	    height: 800,
                            	    closeAction:'destroy',
                            	    maximizable: true,
                            	    layout : 'fit',
                            	    items : [{
                            	        xtype : "component",
                            	        autoEl : {
                            	            tag : "iframe",
                            	            src : url
                            	        }
                            	    }]
                            	}).show();
                    		}else{
                    			var url = window.location.href;
                        		var type = Ext.getCmp("ThreadDumpAnalyzer-parsertype").getValue()['type'];
                            	url= url.substring(0, url.indexOf("hybrisShanghai")+14)+"/services/tdw?filename="+foldername+"&type="+type+"&mode=test";
                            	new Ext.Window({
                            	    title : "TGW Report",
                            	    width : 1000,
                            	    height: 800,
                            	    closeAction:'destroy',
                            	    maximizable: true,
                            	    layout : 'fit',
                            	    items : [{
                            	        xtype : "component",
                            	        autoEl : {
                            	            tag : "iframe",
                            	            src : url
                            	        }
                            	    }]
                            	}).show();
                    		}
                    		
                    		
                        	
                    	}
                    	
                    }
                }]
            });
        }
        return win;
    }
});