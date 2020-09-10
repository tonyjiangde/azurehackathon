/*!
 * Ext JS Library 4.0
 * Copyright(c) 2006-2011 Sencha Inc.
 * licensing@sencha.com
 * http://www.sencha.com/license
 */

Ext.define('hybrisDesktop.App', {
    extend: 'Ext.ux.desktop.App',

    requires: [
        'Ext.window.MessageBox',
        'Ext.ux.desktop.ShortcutModel',
        'hybrisDesktop.TypeBrowser',
        'hybrisDesktop.ImpexHelper',
        'hybrisDesktop.JDBCLogAnalyzer',
        'hybrisDesktop.ThreadDumpAnalyzer',
        'hybrisDesktop.DatahubVirtualizer',
        'hybrisDesktop.Settings'
    ],

    init: function() {
        // custom logic before getXYZ methods get called...

        this.callParent();

        // now ready...
    },

    getModules : function(){
        return [
            new hybrisDesktop.TypeBrowser(),
            new hybrisDesktop.ImpexHelper(),
            new hybrisDesktop.DatahubVirtualizer(),
            new hybrisDesktop.JDBCLogAnalyzer(),
            new hybrisDesktop.ThreadDumpAnalyzer()
        ];
    },

    getDesktopConfig: function () {
        var me = this, ret = me.callParent();

        return Ext.apply(ret, {

            contextMenuItems: [
                { text: 'Change Settings', handler: me.onSettings, scope: me }
            ],

            shortcuts: Ext.create('Ext.data.Store', {
                model: 'Ext.ux.desktop.ShortcutModel',
                data: [
                    { name: 'TypeBrowser', iconCls: 'typebrowser-shortcut', module: 'TypeBrowser-win' },
                    { name: 'ImpexHelper', iconCls: 'grid-shortcut', module: 'ImpexHelper-win' },
                    { name: 'DatahubVirtualizer', iconCls: 'datahub-shortcut', module: 'DatahubVirtualizer-win' },
                    { name: 'JDBCLogAnalyzer', iconCls: 'jdbc-shortcut', module: 'JDBCLogAnalyzer-win' },
                    { name: 'ThreadDumpAnalyzer', iconCls: 'thread-shortcut', module: 'ThreadDumpAnalyzer-win' }
                ]
            }),

            wallpaper: 'wallpapers/hybris1.png',
            wallpaperStretch: true
        });
    },

    // config for the start menu
    getStartConfig : function() {
        var me = this, ret = me.callParent();

        return Ext.apply(ret, {
            title: 'hybris',
            iconCls: 'user',
            height: 300,
            toolConfig: {
                width: 100,
                items: [
                    {
                        text:'Settings',
                        iconCls:'settings',
                        handler: me.onSettings,
                        scope: me
                    },
                    '-',
                    {
                        text:'Logout',
                        iconCls:'logout',
                        handler: me.onLogout,
                        scope: me
                    }
                ]
            }
        });
    },

    getTaskbarConfig: function () {
        var ret = this.callParent();

        return Ext.apply(ret, {
            quickStart: [
                { name: 'TypeBrowser', iconCls: 'icon-typebrowser', module: 'TypeBrowser-win' },
                { name: 'ImpexHelper', iconCls: 'icon-grid', module: 'ImpexHelper-win' },
                { name: 'DatahubVirtualizer', iconCls: 'icon-datahub', module: 'DatahubVirtualizer-win' },
                { name: 'JDBCLogAnalyzer', iconCls: 'icon-jdbc', module: 'JDBCLogAnalyzer-win' },
                { name: 'ThreadDumpAnalyzer', iconCls: 'icon-threaddump', module: 'ThreadDumpAnalyzer-win' }
            ],
            trayItems: [
                { xtype: 'trayclock', flex: 1 }
            ]
        });
    },

    onLogout: function () {
        Ext.Msg.confirm('Logout', 'Are you sure you want to logout?');
    },

    onSettings: function () {
        var dlg = new hybrisDesktop.Settings({
            desktop: this.desktop
        });
        dlg.show();
    }
});
