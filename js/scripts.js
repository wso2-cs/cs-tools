$(document).ready(function(){
    $('#btnB64Encode').click(function (){base64encode();});
    $('#btnB64Decode').click(function (){base64decode();});
    $('#btnJwtDecode').click(function (){jwtDecode();});
    $('#btnUrlEncode').click(function (){urlEncode();});
    $('#btnUrlDecode').click(function (){urlDecode();});
    $('#btnJsonFormat').click(function (){jsonFormat();});
    $('#btnXmlFormat').click(function (){xmlFormat();});
    $('#btnHtmlEncode').click(function (){htmlEncode();});
    $('#btnHtmlDecode').click(function (){htmlDecode();});
});

function base64encode(){
    get('preB64OutputCode').innerText = btoa(get('textAreaB64Input').value);
}

function base64decode(){
    var data = get('textAreaB64Input').value;
    var output="";
    try {
        data = atob(data);    
        if(isJson(data) == true){
            output= JSON.stringify(JSON.parse(data), null, 2);
        } else {
            output= data;
        }
        get('preB64OutputCode').innerText = output;
    } catch (error) {
        showError("Error: Invalid Base64 value");
    }
}

function jwtDecode(){
    try {
        var data = get('textAreaJwtInput').value;
        var output="";
        if(data.indexOf('.')!==-1){
            var arr = data.split('.');
            if(arr.length==3){
                output="Header\n";
                output += JSON.stringify(JSON.parse(atob(arr[0])), null, 2);
                output += "\n"
                output +="Payload\n";
                output += JSON.stringify(JSON.parse(atob(arr[1])), null, 2);
                output += "\n"
                output +="Signature\n";
                output += arr[2];
            }else{
                output= 'Invalid JWT';
            }
        } else {
            data = atob(data);
            if(isJson(data) == true){
                output= JSON.stringify(JSON.parse(data), null, 2);
            } else {
                output= data;
            }
        }
        get('preJwtOutputCode').innerText = output;
    } catch (error) {
        showError("Error: Invalid JWT value");
    }
}

function urlEncode(){
    get('preUrlOutputCode').innerText = encodeURIComponent(get('textAreaUrlInput').value).replace(
        /[!'()*]/g,
        (c) => `%${c.charCodeAt(0).toString(16).toUpperCase()}`
      );
}

function urlDecode(){
    try {
        get('preUrlOutputCode').innerText = decodeURIComponent(get('textAreaUrlInput').value);
    } catch (error) {
        showError("Error: Invalid URL Encoded value");
    }    
}

function jsonFormat(){
    try {
        get('preJsonOutputCode').innerText = JSON.stringify(JSON.parse(get('textAreaJsonInput').value), null, 2);
    } catch (error) {
        showError("Error: Invalid JSON Payload");
    }    
}

function xmlFormat(sourceXml){
    try{
        get('preXmlOutputCode').innerText = '';
        if(get('textAreaXmlInput').value.trim() != ''){
            var xml = new DOMParser().parseFromString(get('textAreaXmlInput').value, 'application/xml');
            var xslt = new DOMParser().parseFromString([
                '<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform">',
                '  <xsl:strip-space elements="*"/>',
                '  <xsl:template match="para[content-style][not(text())]">',
                '    <xsl:value-of select="normalize-space(.)"/>',
                '  </xsl:template>',
                '  <xsl:template match="node()|@*">',
                '    <xsl:copy><xsl:apply-templates select="node()|@*"/></xsl:copy>',
                '  </xsl:template>',
                '  <xsl:output indent="yes"/>',
                '</xsl:stylesheet>',
            ].join('\n'), 'application/xml');

            var xsltProcessor = new XSLTProcessor();    
            xsltProcessor.importStylesheet(xslt);
            var result = xsltProcessor.transformToDocument(xml);
            var formattedXml = new XMLSerializer().serializeToString(result);
            get('preXmlOutputCode').innerText = formattedXml;
        }
    } catch (error) {
        showError("Error: Invalid XML Payload");
    }
};

function htmlEncode(){
    var text = get('textAreaHtmlInput').value;
    var encoded = text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
    get('preHtmlOutputCode').innerText = encoded;
}

function htmlDecode(){
    var text = get('textAreaHtmlInput').value;
    // Uses the browser's HTML parser for decoding entities, which may handle certain edge cases differently than manual replacements.
    var parser = new DOMParser();
    var dom = parser.parseFromString(text, 'text/html');
    var decoded = dom.documentElement.textContent;
    get('preHtmlOutputCode').innerText = decoded;
}

function get(id){
    return document.getElementById(id);
}

function getAll(cssClass){
    return document.getElementsByClassName(cssClass);
}

function showError(msg){
    get('alertMessage').innerHTML = msg;
    $('#errorModal').modal();
}

function isJson(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}