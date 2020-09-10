/**
 * This plugin can enable a cell to cell drag and drop operation within the same grid view.
 *
 * Note that the plugin must be added to the grid view, not to the grid panel. For example, using {@link Ext.panel.Table viewConfig}:
 *
 *      viewConfig: {
 *          plugins: {
 *              ptype: 'celldragdrop',
 *
 *              // Remove text from source cell and replace with value of emptyText.
 *              applyEmptyText: true,
 *
 *              //emptyText: Ext.String.htmlEncode('<<foo>>'),
 *
 *              // Will only allow drops of the same type.
 *              enforceType: true
 *          }
 *      }
 */
Ext.define('Ext.app.CellDragDrop', {
    extend: 'Ext.AbstractPlugin',
    alias: 'plugin.celldragdrop',

    uses: ['Ext.view.DragZone'],

    /**
     * @cfg {Boolean} enforceType
     * Set to `true` to only allow drops of the same type.
     *
     * Defaults to `false`.
     */
    enforceType: false,

    /**
     * @cfg {Boolean} applyEmptyText
     * If `true`, then use the value of {@link #emptyText} to replace the drag record's value after a node drop.
     * Note that, if dropped on a cell of a different type, it will convert the default text according to its own conversion rules.
     *
     * Defaults to `false`.
     */
    applyEmptyText: false,

    /**
     * @cfg {Boolean} emptyText
     * If {@link #applyEmptyText} is `true`, then this value as the drag record's value after a node drop.
     *
     * Defaults to an empty string.
     */
    emptyText: '',

    /**
     * @cfg {Boolean} dropBackgroundColor
     * The default background color for when a drop is allowed.
     *
     * Defaults to green.
     */
    dropBackgroundColor: 'green',

    /**
     * @cfg {Boolean} noDropBackgroundColor
     * The default background color for when a drop is not allowed.
     *
     * Defaults to red.
     */
    noDropBackgroundColor: 'red',

    //<locale>
    /**
     * @cfg {String} dragText
     * The text to show while dragging.
     *
     * Two placeholders can be used in the text:
     *
     * - `{0}` The number of selected items.
     * - `{1}` 's' when more than 1 items (only useful for English).
     */
    dragText: '{0} selected row{1}',
    //</locale>

    /**
     * @cfg {String} ddGroup
     * A named drag drop group to which this object belongs. If a group is specified, then both the DragZones and
     * DropZone used by this plugin will only interact with other drag drop objects in the same group.
     */
    ddGroup: "GridDD",

    /**
     * @cfg {Boolean} enableDrop
     * Set to `false` to disallow the View from accepting drop gestures.
     */
    enableDrop: true,

    /**
     * @cfg {Boolean} enableDrag
     * Set to `false` to disallow dragging items from the View.
     */
    enableDrag: true,

    /**
     * @cfg {Object/Boolean} containerScroll
     * True to register this container with the Scrollmanager for auto scrolling during drag operations.
     * A {@link Ext.dd.ScrollManager} configuration may also be passed.
     */
    containerScroll: false,

    init: function (view) {
        var me = this;

        view.on('render', me.onViewRender, me, {
            single: true
        });
    },

    destroy: function () {
        var me = this;

        Ext.destroy(me.dragZone, me.dropZone);
    },

    enable: function () {
        var me = this;

        if (me.dragZone) {
            me.dragZone.unlock();
        }
        if (me.dropZone) {
            me.dropZone.unlock();
        }
        me.callParent();
    },

    disable: function () {
        var me = this;

        if (me.dragZone) {
            me.dragZone.lock();
        }
        if (me.dropZone) {
            me.dropZone.lock();
        }
        me.callParent();
    },

    onViewRender: function (view) {
        var me = this,
            scrollEl;

        if (me.enableDrag) {
            if (me.containerScroll) {
                scrollEl = view.getEl();
            }

            me.dragZone = new Ext.view.DragZone({
                view: view,
                ddGroup: me.dragGroup || me.ddGroup,
                dragText: me.dragText,
                containerScroll: me.containerScroll,
                scrollEl: scrollEl,
                getDragData: function (e) {
                    var view = this.view,
                        item = e.getTarget(view.getItemSelector()),
                        record = view.getRecord(item),
                        cell = e.getTarget(view.getCellSelector()),
                        dragEl, header;

                    if (item) {
                        dragEl = document.createElement('div');
                        dragEl.className = 'x-form-text';
                        dragEl.appendChild(document.createTextNode(cell.textContent || cell.innerText));
                       // console.log( cell);
                        console.log( $(cell).find("div").find("div").attr("style"));
                        header = view.getHeaderByCell(cell);
                        return {
                            event: new Ext.EventObjectImpl(e),
                            ddel: dragEl,
                            item: e.target,
                            columnName: header.dataIndex,
                            record: record,
                            source: Ext.get(me.dragZone.id).up('.x-grid').id,
                            style: $(cell).find("div").find("div").attr("style")
                        };
                    }
                },
                onBeforeDrag: function(data, e ){
                	var view = this.view,
                    item = e.getTarget(view.getItemSelector()),
                    record = view.getRecord(item),
                    cell = e.getTarget(view.getCellSelector()),
                    dragEl, header;

                	if (item) {
                		header = view.getHeaderByCell(cell);
	                    //console.log(Ext.getCmp(Ext.get(me.dragZone.id).up('.x-grid').id).up('newCanonicalItemPortlet').id);
	                    /*if(Ext.get(me.dragZone.id).up('.x-grid').id.indexOf("raw")==0){
            				return true;
            			}else if(Ext.get(me.dragZone.id).up('.x-grid').id.indexOf("cano")==0){
            				if(header.dataIndex=='name'){
            					return true;
            				}
            			}*/
                		if(Ext.getCmp(Ext.get(me.dragZone.id).up('.x-grid').id)){
                			if(Ext.getCmp(Ext.get(me.dragZone.id).up('.x-grid').id).up('newCanonicalItemPortlet')){
                				if(Ext.getCmp(Ext.get(me.dragZone.id).up('.x-grid').id).up('newCanonicalItemPortlet').id.indexOf("cano")==0){
                    				if(header.dataIndex=='canonicalattribute'){
                    					return true;
                    				}
                    			}
                			}
                		}
                		if(Ext.getCmp(Ext.get(me.dragZone.id).up('.x-grid').id)){
                			if(Ext.getCmp(Ext.get(me.dragZone.id).up('.x-grid').id).up('existingCanonicalItemPortlet')){
                				if(Ext.getCmp(Ext.get(me.dragZone.id).up('.x-grid').id).up('existingCanonicalItemPortlet').id.indexOf("cano")==0){
                    				if(header.dataIndex=='canonicalattribute'){
                    					return true;
                    				}
                    			}
                			}
                		}
	                    
                	}
                	return false;
                },
                onInitDrag: function (x, y) {
                    var self = this,
                        data = self.dragData,
                        view = self.view,
                        selectionModel = view.getSelectionModel(),
                        record = data.record,
                        el = data.ddel;

                    // Update the selection to match what would have been selected if the user had
                    // done a full click on the target node rather than starting a drag from it.
                    if (!selectionModel.isSelected(record)) {
                        selectionModel.select(record, true);
                    }

                    self.ddel.update(el.textContent || el.innerText);
                    self.proxy.update(self.ddel.dom);
                    self.onStartDrag(x, y);
                    return true;
                }
            });
        }

        if (me.enableDrop) {
            me.dropZone = new Ext.dd.DropZone(view.el, {
                view: view,
                ddGroup: me.dropGroup || me.ddGroup,
                containerScroll: true,

                getTargetFromEvent: function (e) {
                    var self = this,
                        view = self.view,
                        cell = e.getTarget(view.cellSelector),
                        row, header;

                    // Ascertain whether the mousemove is within a grid cell.
                    if (cell) {
                        row = view.findItemByChild(cell);
                        header = view.getHeaderByCell(cell);

                        if (row && header) {
                            return {
                                node: cell,
                                record: view.getRecord(row),
                                columnName: header.dataIndex,
                                target: Ext.get(me.dropZone.id).up('.x-grid').id
                            };
                        }
                    }
                },

                // On Node enter, see if it is valid for us to drop the field on that type of column.
                onNodeEnter: function (target, dd, e, dragData) {
                    var self = this,
                        destType = target.record.fields.get(target.columnName).type.type.toUpperCase(),
                        sourceType = dragData.record.fields.get(dragData.columnName).type.type.toUpperCase();

                    delete self.dropOK;

                    // Return if no target node or if over the same cell as the source of the drag.
                    if (!target || target.node === dragData.item.parentNode) {
                        return;
                    }

                    // Check whether the data type of the column being dropped on accepts the
                    // dragged field type. If so, set dropOK flag, and highlight the target node.
                    //alert(target.columnName!==dragData.columnName);
                    //console.log(sourceType+":"+destType+"="+(destType !== sourceType)+"!!"+target.columnName+":"+dragData.columnName+"!!"+(target.columnName!==dragData.columnName)+"!!");
                    if (me.enforceType && destType !== sourceType) {
                    	
                        self.dropOK = false;

                        if (me.noDropCls) {
                            Ext.fly(target.node).addCls(me.noDropCls);
                        } else {
                            Ext.fly(target.node).applyStyles({
                                backgroundColor: me.noDropBackgroundColor
                            });
                        }

                        return false;
                    }else if(me.enforceType && destType == sourceType && target.columnName!=dragData.columnName){
                    	self.dropOK = false;

                        if (me.noDropCls) {
                            Ext.fly(target.node).addCls(me.noDropCls);
                        } else {
                            Ext.fly(target.node).applyStyles({
                                backgroundColor: me.noDropBackgroundColor
                            });
                        }

                        return false;
                    }/*else if(me.enforceType && destType == sourceType && dragData.source.indexOf("cano")==0 && target.columnName !== 'transformationExpression'){
                    	self.dropOK = false;

                        if (me.noDropCls) {
                            Ext.fly(target.node).addCls(me.noDropCls);
                        } else {
                            Ext.fly(target.node).applyStyles({
                                backgroundColor: me.noDropBackgroundColor
                            });
                        }

                        return false;
                    }*/

                    self.dropOK = true;

                    if (me.dropCls) {
                        Ext.fly(target.node).addCls(me.dropCls);
                    } else {
                        Ext.fly(target.node).applyStyles({
                            backgroundColor: me.dropBackgroundColor
                        });
                    }
                },

                // Return the class name to add to the drag proxy. This provides a visual indication
                // of drop allowed or not allowed.
                onNodeOver: function (target, dd, e, dragData) {
                    return this.dropOK ? this.dropAllowed : this.dropNotAllowed;
                },

                // Highlight the target node.
                onNodeOut: function (target, dd, e, dragData) {
                    var cls = this.dropOK ? me.dropCls : me.noDropCls;

                    if (cls) {
                        Ext.fly(target.node).removeCls(cls);
                    } else {
                        Ext.fly(target.node).applyStyles({
                            backgroundColor: ''
                        });
                    }
                },

                // Process the drop event if we have previously ascertained that a drop is OK.
                onNodeDrop: function (target, dd, e, dragData) {
                    if (this.dropOK) {
                    	//alert(target.columnName+"!!!!"+dragData.source+"!!!!!"+dragData.record);
                    	//console.log(Ext.getCmp(target.target).up('newTargetSystemItem').down('form').down('#cis').value);
                    	var canonical = Ext.getCmp(dragData.source).up('newCanonicalItem');
                    	if(!canonical){
                    		canonical = Ext.getCmp(dragData.source).up('existingCanonicalItemPortlet');
                    	}
                    	var source = canonical.down('form').down('#type').value;
                    	if(Ext.getCmp(target.target).up('newTargetSystemItem')){
                    		Ext.getCmp(target.target).up('newTargetSystemItem').down('form').down('#cis').setValue(source+"");
                    		target.record.set(target.columnName, '<div style="'+ dragData.style+'">'+source+'.'+dragData.record.get(dragData.columnName)+'</div>');
                    	}else{
                    		var old = target.record.get(target.columnName);
                    		var canona = old.split('<br>');
                    		var contains = false;
                    		for(var k=0;k<canona.length;k++){
               				 var ci=canona[k].split('.');
               				 console.log(ci[0]+"!!!!"+ci[1]);
                       		 if(ci[0].indexOf("<div")==0){
                       				ci[0]=ci[0].substring(ci[0].indexOf(">")+1,ci[0].length);
                       				ci[1]=ci[1].substring(0,ci[1].indexOf("<"));
                       				
    							}
                       		 
                       		 if(ci[0]==source && ci[1]==dragData.record.get(dragData.columnName)){
                       			console.log("contains "+ci[0]+"!!!!"+ci[1]);
                       			contains =true;
                       		 }
               			 	}
                    		
                    		if(!contains){
                    			if(old.length>0){
                            		old=old+'<br>';
                            	}
                                target.record.set(target.columnName, old+'<div style="'+ dragData.style+'">'+source+'.'+dragData.record.get(dragData.columnName)+'</div>');
                              
                    		}
                        	
                    	}
                    	  if (me.applyEmptyText) {
                            dragData.record.set(dragData.columnName, me.emptyText);
                        }
                        return true;
                    }
                },

                onCellDrop: Ext.emptyFn
            });
        }
    }
});
