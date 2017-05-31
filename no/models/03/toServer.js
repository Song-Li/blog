function toServer(WebGL, inc, gpu, hash, dataurl){ //send messages to server and receive messages from server
    postData = {WebGL: WebGL, inc: inc, gpu: gpu, hash: hash, dataurl: dataurl};
    $.ajax({
        url:"http://52.91.166.42:8888",  
        dataType:"text",
        type: 'POST',
        data:postData,
        success:function(data) {
            console.log(data.toString());
        }
    }); 
}
