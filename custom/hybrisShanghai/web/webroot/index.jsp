<html>
<head>
    <title>hybris Shanghai</title>
	<link rel="shortcut icon" type="image/x-icon" href="https://wiki.hybris.com/favicon.ico" media="screen" />
    <link rel="stylesheet" type="text/css" href="extjs/resources/css/ext-all-access.css" />
    <link rel="stylesheet" type="text/css" href="css/desktop.css" />
    <script type="text/javascript" src="extjs/ext-all.js"></script>
    <script type="text/javascript" src="d3.js"></script>
    <script type="text/javascript" src="extjs/SearchField.js"></script>
    <script type="text/javascript" src="jsplumb/jquery.min.js"></script> 
    <script type="text/javascript" src="jsplumb/jquery-ui.min.js"></script> 
<!-- 	<script type="text/javascript" src="jsplumb/jquery.jsPlumb-1.7.5.js"></script> -->
	<script type="text/javascript" src="jsplumb/jquery.ui.touch-punch.min.js"></script>
	<link rel="stylesheet" type="text/css" href="css/portal.css" />
<!-- 	<link rel="stylesheet" type="text/css" href="css/datahubv.css" /> -->
<!-- 	<link rel="stylesheet" type="text/css" href="css/demo.css" /> -->
    <!-- <script type="text/javascript" src="tb.js"></script> -->
    <style type="text/css">
		
		.myrednode{
color: red !important;
}

.mygreennode{
color: green !important;
}
		.node circle {
		  cursor: pointer;
		  fill: #fff;
		  stroke: steelblue;
		  stroke-width: 1.5px;
		}
		
		.node text {
		  font-size: 11px;
		  fill: white;
		}
		
		
		path.link {
		  fill: none;
		  stroke: #ccc;
		  stroke-width: 1.5px;
		}
		
		.warning { 
		    background-image: url(images/exclamation.png); 
		    }
		    
		.info {
		   	font-size :25px;
	    	fill= #CD0303;
	    	position: absolute;
    		top: 0;
		}
		.qtip-big{
max-width: 600px;
}
		.x-tool-treetool { background-image: url(images/map.png) !important; }
    </style>
    
    <script type="text/javascript">
        Ext.Loader.setPath({
            'Ext.ux.desktop': 'desk',
            'hybrisDesktop': 'yDesk',
            'Ext.app': 'portlets'
        });

        Ext.require('hybrisDesktop.App');

        var hybrisDesktopApp;
        Ext.onReady(function () {
        	hybrisDesktopApp = new hybrisDesktop.App();
        });
    </script></head>
<body>
<canvas width="960" height="500" style="display:none"></canvas></body>
</html>

