var pixels = new Uint8Array(262144);
var ven, ren;
var urls = [];
var canvas_number = 7;
var finished = 0;

function getData(gl, canvasName, id){
    var canvas = document.getElementById(canvasName);
    if(canvas.getContext('webgl'))
        WebGL = true;
    else
        WebGL = false;

    gl.readPixels(0,0,256,256,gl.RGBA, gl.UNSIGNED_BYTE, pixels);
    var pi = '[';
    var s = 256 * 256 * 4;
    for(var i = 0;i < s;++ i){
        if(i) pi += ',';
        pi += pixels[i].toString();
    }
    pi += ']';
    var debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
    if(debugInfo){
        ven = gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL);
        ren = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
    }else{
        console.log("debugInfo is not accessable");
        ven = 'No debug Info';
        ren = 'No debug Info';
    }
    if(canvasName == 'cube_no_texture')
        toServer(WebGL,ven, ren, pixels.hashCode(), 0, pi);
    else if(canvasName == 'line')
        toServer(WebGL,ven, ren, pixels.hashCode(), 1, pi);
    else if(canvasName == 'curve')
        toServer(WebGL,ven, ren, pixels.hashCode(), 2, pi);
    else if(canvasName == 'model_tiles')
        toServer(WebGL,ven, ren, pixels.hashCode(), 3, pi);
    else if(canvasName == 'model_wood')
        toServer(WebGL,ven, ren, pixels.hashCode(), 4, pi);
    else if(canvasName == 'cube_tiles')
        toServer(WebGL,ven, ren, pixels.hashCode(), 5, pi);
    else if(canvasName == 'cube_wood')
        toServer(WebGL,ven, ren, pixels.hashCode(), 6, pi);

    console.log(pixels.hashCode());
}


function toServer(WebGL, inc, gpu, hash, id, dataurl){ //send messages to server and receive messages from server
    //0 for notexture, 1 for png, 2 for jpg
    urls[id] = dataurl;
    finished ++;
    if(finished < canvas_number) return ;

    var pixels = "";
    for(var i = 0;i < canvas_number;++ i){
        pixels += urls[i];
        if(i != canvas_number - 1) pixels += ' ';
    }

    postData = {WebGL: WebGL, inc: inc, gpu: gpu, hash: hash, pixels: pixels};

    $.ajax({
        url:"http://54.85.74.36:8888",  
        dataType:"text",
        type: 'POST',
        data: JSON.stringify(postData),
        success:function(data) {
            alert(data.toString());
        }
    }); 
}

Uint8Array.prototype.hashCode = function() {
    var hash = 0, i, chr, len;
    if (this.length === 0) return hash;
    for (i = 0, len = this.length; i < len; i++) {
        chr   = this[i];
        hash  = ((hash << 5) - hash) + chr;        
        hash |= 0; // Convert to 32bit integer
    }
    return hash;
}
