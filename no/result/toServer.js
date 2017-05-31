var case_number = 7;
var browser_number = 3;
var canvas_number = case_number * browser_number * 4;

Array.prototype.hashCode = function() {
    var hash = 0, i, chr, len;
    if (this.length === 0) return hash;
    for (i = 0, len = this.length; i < len; i++) {
        chr   = this[i];
        hash  = ((hash << 5) - hash) + chr;        
        hash |= 0; // Convert to 32bit integer
    }
    return hash;
}

function generateButton(name){
    var btn = document.createElement("BUTTON");        // Create a <button> element
    var t = document.createTextNode(name);       // Create a text node
    btn.appendChild(t);                                // Append the text to <button>
    btn.onclick = function() {
        text = this.textContent;
        toServer(text);
    }
    document.getElementById("left").appendChild(btn);                    // Append <button> to <body>
    var br = document.createElement("br");
    document.getElementById("left").appendChild(br);
    var br = document.createElement("br");
    document.getElementById("left").appendChild(br);
}

function generateCanvas(name, fatherName){
    var cvs = document.createElement("canvas");
    cvs.id = name;
    cvs.width = 256;
    cvs.height = 256;
    document.getElementById(fatherName).appendChild(cvs);
}

function generatePage(){
    document.getElementById("left").innerHTML = ""; //clear left div
    for(var i = 0;i < case_number * 2;++ i){
        document.getElementById("div" + i).innerHTML = ""; //clear right div
    }
    postData = 'Refresh';
    $.ajax({
        url:"http://54.85.74.36:9999",  
        dataType:"text",
        type: 'POST',
        data: postData,
        success:function(data) {
            var res = JSON.parse(data.toString());
            var len = res.length;
            generateButton('Refresh');
            for(var i = 0;i < len;++ i){
                generateButton(res[i]);
            }
        }
    }); 

    //generate canvases
    for(var i = 0;i < case_number * browser_number * 4;){
        for(var j = 0;j < case_number * 2;++ j){
            generateCanvas('canvas' + i, 'div' + j);
            i ++;
            generateCanvas('canvas' + i, 'div' + j);
            i ++;
        }
    }
}

function draw(name, data){// draw data to name canvas, return the hash code
    var canvas = document.getElementById(name);
    var context = canvas.getContext('2d');
    context.clearRect(0, 0, canvas.width, canvas.height);
    var imageData= context.createImageData(256, 256);
    for(var i = 0;i < data.length;++ i)
        imageData.data[i] = data[i];
    context.putImageData(imageData,0,0);
}

function clearCanvas(){
    for(var i = 0;i < canvas_number;++ i){
        var canvas = document.getElementById('canvas' + i);
        var context = canvas.getContext('2d');
        context.clearRect(0, 0, canvas.width, canvas.height);
    }

}

function subtract(id, dataurl){
    if(dataurl[0] == 'NULL') return ;
    var standard = JSON.parse(dataurl[0]);
    draw('canvas' + id.toString(),standard);
    if(dataurl[1] == 'NULL') return ;
    var picture = JSON.parse(dataurl[1]);
    draw('canvas' + (id + 1).toString(),picture);

    var subtract = new Array(picture.lengh);
    var countersubtract = new Array(picture.lengh);

    var count = 0;
    for(var i = 0;i < picture.length;++ i){
        subtract[i] = picture[i] - standard[i];
        countersubtract[i] = standard[i] - picture[i];
        if(i % 4 == 3) {
            subtract[i] = 255;
            countersubtract[i] = 255;
        }
        else{
            if(subtract[i] != 0) {
                count ++;
                subtract[i] *= 80;
            }
            if(countersubtract[i] != 0){
                count ++;
                countersubtract[i] *= 80;
            }
        }
    }
    draw('canvas' + (id + 2).toString(), subtract);
    draw('canvas' + (id + 3).toString(), countersubtract);
    console.log(id / 4 + ': ' + count + ' Hash :' + picture.hashCode());
}



function toServer(id){ //send messages to server and receive messages from server
    postData = id.toString();
    if(postData[0] == 'R'){
        generatePage();
        return ;
    }
    $.ajax({
        url:"http://54.85.74.36:9999",  
        dataType:"text",
        type: 'POST',
        data:postData,
        success:function(data) {
            clearCanvas();
            var res = JSON.parse(data.toString());
            res[0] = unescape(res[0]);
            res[1] = unescape(res[1]);
            standard = res[0].split(" ");
            picture = res[1].split(" ");
            for(var i = 0;i < case_number * browser_number;++ i){
                subtract(i * 4,[standard[i], picture[i]]);
                if(i % case_number == case_number - 1) console.log('\n');
            }
            console.log('\n');
        }
    }); 
}

