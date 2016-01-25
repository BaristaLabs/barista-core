var Handlebars = require("handlebars");

module.exports.javascriptExceptionWithStackTrace = Handlebars.compile("<?xml version=\"1.0\" encoding=\"utf-8\"?>\
<HTML><HEAD>\
<STYLE type=\"text/css\">\
#content{ FONT-SIZE: 0.7em; PADDING-BOTTOM: 2em; MARGIN-LEFT: 30px}\
BODY{MARGIN-TOP: 0px; MARGIN-LEFT: 0px; COLOR: #000000; FONT-FAMILY: Verdana; BACKGROUND-COLOR: white}\
P{MARGIN-TOP: 0px; MARGIN-BOTTOM: 12px; COLOR: #000000; FONT-FAMILY: Verdana}\
PRE{BORDER-RIGHT: #f0f0e0 1px solid; PADDING-RIGHT: 5px; BORDER-TOP: #f0f0e0 1px solid; MARGIN-TOP: -5px; PADDING-LEFT: 5px; FONT-SIZE: 1.2em; PADDING-BOTTOM: 5px; BORDER-LEFT: #f0f0e0 1px solid; PADDING-TOP: 5px; BORDER-BOTTOM: #f0f0e0 1px solid; FONT-FAMILY: Courier New; BACKGROUND-COLOR: #e5e5cc}\
.heading1{MARGIN-TOP: 0px; PADDING-LEFT: 15px; FONT-WEIGHT: normal; FONT-SIZE: 26px; PADDING-BOTTOM: 3px; COLOR: #ffffff; PADDING-TOP: 10px; FONT-FAMILY: Tahoma; BACKGROUND-COLOR: #492B29}\
.intro{MARGIN-LEFT: -15px}</STYLE>\
<TITLE>JavaScript Error</TITLE></HEAD><BODY>\
<P class=\"heading1\">JavaScript Error</P>\
<DIV id=\"content\">\
<BR/>\
<P class=\"intro\">The JavaScript being executed on the server threw an exception ({{name}}). The exception message is '{{message}}'.</P>\
<P class=\"intro\"/>\
<P class=\"intro\">The exception stack trace is:</P>\
<P class=\"intro stackTrace\">{{{stack}}}</P>\
</DIV>\
</BODY></HTML>\
");