/**
 * @class Ext.app.PortalDropZone
 * @extends Ext.dd.DropTarget
 * Internal class that manages drag/drop for {@link Ext.app.PortalPanel}.
 */
Ext.define('Ext.app.PortalDropZone', {
    extend: 'Ext.dd.DropTarget',

    constructor: function(portal, cfg) {
        this.portal = portal;
        Ext.dd.ScrollManager.register(portal.body);
        Ext.app.PortalDropZone.superclass.constructor.call(this, portal.body, cfg);
        portal.body.ddScrollConfig = this.ddScrollConfig;
        this.portal.afterLayout = Ext.Function.createSequence(this.portal.afterLayout, this.getGrid, this);
        this.getGrid();
    },

    ddScrollConfig: {
        vthresh: 50,
        hthresh: -1,
        animate: true,
        increment: 200
    },

    createEvent: function(dd, e, data, col, c, pos) {
        return {
            portal: this.portal,
            panel: data.panel,
            columnIndex: col,
            column: c,
            position: pos,
            data: data,
            source: dd,
            rawEvent: e,
            status: this.dropAllowed
        };
    },

    notifyOver: function(dd, e, data) {
        var me = this,
            xy = e.getXY(),
            portal = me.portal,
            proxy = dd.proxy,
            wasOverflowing,
            isOverflowing,
            overEvent,
            scrollbarWidth = Ext.getScrollbarSize().width,
            colIndex = 0,
            colRight = 0,
            cols = me.grid.columnX,
            len = cols.length,
            cmatch = false,
            overPortlet, pos = 0,
            h = 0,
            match = false,
            overColumn,
            portlets,
            overSelf = false;

        // determine column
        for (len; colIndex < len; colIndex++) {
            colRight = cols[colIndex].x + cols[colIndex].w;
            if (xy[0] < colRight) {
                cmatch = true;
                break;
            }
        }
        // no match, fix last index
        if (!cmatch) {
            colIndex--;
        }

        // find insert position
        overColumn = portal.items.getAt(colIndex),
        portlets = overColumn.items.items,

        len = portlets.length;

        for (len; pos < len; pos++) {
            overPortlet = portlets[pos];
            h = overPortlet.el.getHeight();
            if (h === 0) {
                overSelf = true;
            } else if ((overPortlet.el.getY() + (h / 2)) > xy[1]) {
                match = true;
                break;
            }
        }

        pos = (match && overPortlet ? pos : overColumn.items.getCount()) + (overSelf ? -1 : 0);
        overEvent = me.createEvent(dd, e, data, colIndex, overColumn, pos);
        wasOverflowing = scrollbarWidth && portal.body.dom.scrollHeight > portal.body.dom.clientHeight;

        if (portal.fireEvent('validatedrop', overEvent) !== false && portal.fireEvent('beforedragover', overEvent) !== false) {

            // make sure proxy width is fluid in different width columns
            proxy.getProxy().setWidth('auto');
            if (overPortlet) {
                dd.panelProxy.moveProxy(overPortlet.el.dom.parentNode, match ? overPortlet.el.dom : null);
            } else {
                dd.panelProxy.moveProxy(overColumn.el.dom, null);
            }

            // If moving the spacer caused change in scrollbar state, then we must do a layout to accommodate the new (or lack of) scrollbars
            isOverflowing = scrollbarWidth && overColumn.el.dom.offsetHeight > portal.body.dom.clientHeight;
            if (isOverflowing !== wasOverflowing) {
                portal.updateLayout({isLayoutRoot: true});
            }

            me.lastPos = {
                c: overColumn,
                col: colIndex,
                p: overSelf || (match && overPortlet) ? pos : false
            };
            me.scrollPos = portal.body.getScroll();

            portal.fireEvent('dragover', overEvent);
            return overEvent.status;
        } else {
            return overEvent.status;
        }

    },

    notifyDrop: function(dd, e, data) {
        if (!this.lastPos) {
            return;
        }
        var c = this.lastPos.c,
            col = this.lastPos.col,
            pos = this.lastPos.p,
            panel = dd.panel,
            dropEvent = this.createEvent(dd, e, data, col, c, pos !== false ? pos : c.items.getCount());

        if (this.portal.fireEvent('validatedrop', dropEvent) !== false && 
            this.portal.fireEvent('beforedrop', dropEvent) !== false) {

            Ext.suspendLayouts();
            
            // make sure panel is visible prior to inserting so that the layout doesn't ignore it
            panel.el.dom.style.display = '';
            dd.panelProxy.hide();
            dd.proxy.hide();

            if (pos !== false) {
                c.insert(pos, panel);
            } else {
                c.add(panel);
            }

            Ext.resumeLayouts(true);

            this.portal.fireEvent('drop', dropEvent);

            // scroll position is lost on drop, fix it
            var st = this.scrollPos.top;
            if (st) {
                var d = this.portal.body.dom;
                setTimeout(function() {
                    d.scrollTop = st;
                },
                10);
            }
        }
        
        delete this.lastPos;
        return true;
    },

    // internal cache of body and column coords
    getGrid: function() {
        var box = this.grid = this.portal.body.getBox();
        box.columnX = [];
        this.portal.items.each(function(c) {
            box.columnX.push({
                x: c.el.getX(),
                w: c.el.getWidth()
            });
        });
        return box;
    },

    // unregister the dropzone from ScrollManager
    unreg: function() {
        Ext.dd.ScrollManager.unregister(this.portal.body);
        Ext.app.PortalDropZone.superclass.unreg.call(this);
        delete this.portal.afterLayout;
    }
});
