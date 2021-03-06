/**
 * Created by Administrator on 2016/3/4.
 */

var HttpProtobufScene = cc.Scene.extend({
    onEnter:function(){
        this._super();

        var layerGradient = new cc.LayerGradient(cc.color(255, 0, 0), cc.color(0, 0, 255));
        this.addChild(layerGradient, 0);

        this.addChild(new HttpProtobufLayer());
    }
});

XMLHttpRequest.prototype.sendAsBinary = function(datastr) {
    function byteValue(x) {
        return x.charCodeAt(0) & 0xff;
    }
    var ords = Array.prototype.map.call(datastr, byteValue);
    var ui8a = new Uint8Array(ords);
    this.send(ui8a.buffer);
};

var HttpProtobufLayer = cc.Layer.extend({
    ctor:function(){
        this._super();

        //this.postTestProtobuf();
        //this.postTestProtobuf2();
        this.postSendProtobuf();

        return true;
    },

    postTestProtobuf:function(){
        var winSize = cc.winSize;
        var xhr = cc.loader.getXMLHttpRequest();

        var statusGetLabel = new cc.LabelTTF("Status:", "Thonburi", 18);
        //statusGetLabel.setColor(cc.color(0, 255, 0));
        this.addChild(statusGetLabel, 1);
        statusGetLabel.x = winSize.width / 2;
        statusGetLabel.y = winSize.height - 100;
        statusGetLabel.setString("Status: Send Get Request to httpbin.org");

        //set arguments with <URL>?xxx=xxx&yyy=yyy
        //xhr.open("GET", "http://192.168.80.83:8077/huaTeng/userController/getUserInfo.ht?requestInfoStr={\"openid\":\"whg333\"}", true);

        xhr.open("POST", "http://192.168.90.10:8077/huaTeng/testController/protobuf.proto");

        //xhr.setRequestHeader("Access-Control-Allow-Origin", "*");
        //xhr.setRequestHeader("ht_auth_secret","003964663fccb7d9_404883");
        //xhr.setRequestHeader("ht_idf_c_key","");

        //set Content-type "text/plain;charset=UTF-8" to post plain text
        //xhr.setRequestHeader("Content-Type","text/plain;charset=UTF-8");

        //这个在用POST请求时需要指定以表单形式提交参数
        xhr.setRequestHeader("Content-Type","application/x-www-form-urlencoded;charset=UTF-8");

        //这个代表服务器返回的是原生的二进制数据
        //对应的spring mvc controller方法返回void且用response.getOutputStream()来write(testProto.toByteArray())
        xhr.setRequestHeader("Accept","application/octet-stream");

        //xhr.responseType = "blob";
        if (xhr.overrideMimeType){
            //这个是必须的，否则返回的是字符串，导致protobuf解码错误
            //具体见http://www.ruanyifeng.com/blog/2012/09/xmlhttprequest_level_2.html
            xhr.overrideMimeType('text/plain; charset=x-user-defined');
        }

        var that = this;
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4 && (xhr.status >= 200 && xhr.status <= 207)) {
                var httpStatus = xhr.statusText;

                var data = xhr.responseText;
                trace(data+" !");
                trace(typeof data);
                var response = xhr.responseText + "...";

                var ProtoBuf = dcodeIO.ProtoBuf,
                    ResponseProtocolBuffer = ProtoBuf.loadProtoFile("res/protobuf/ResponseProtoBuf.proto").build("ResponseProtocolBuffer"),
                    TestProto = ResponseProtocolBuffer.TestProto;

                var testProtoData = new TestProto({
                    id:10004,
                    name:"testProtoName测试",
                    rank:3,
                    gold:1000,
                    exp:100,
                    diamond:10
                });

                var protoResp = TestProto.decode(
                    /*data*/
                    str2bytes(data)
                    /*stringToBytes(data)*/
                    /*testProtoData.toArrayBuffer()*/
                );
                trace(JSON.stringify(protoResp));
                trace(protoResp.id);

                //var protoResp2 = TestProto.decode(
                //    /*data*/
                //    /*str2bytes(data)*/
                //    stringToBytes(data)
                //    /*testProtoData.toArrayBuffer()*/
                //);
                //trace(JSON.stringify(protoResp2));

                var responseLabel = new cc.LabelTTF("GET Response: \n" + response, "Thonburi", 16);
                //responseLabel.setColor(cc.color(0, 255, 0));
                that.addChild(responseLabel, 1);
                responseLabel.anchorX = 0;
                responseLabel.anchorY = 1;
                responseLabel.textAlign = cc.TEXT_ALIGNMENT_LEFT;

                responseLabel.x = 10;
                responseLabel.y = winSize.height / 2;
                statusGetLabel.setString("Status: Got GET response! " + httpStatus);
            }
        };

        //var data = {
        //    userName:"测试123qwer",
        //    userId:"100123",
        //};

        //var data = {
        //    userIdStr:"10004",
        //    name:"whg10333",
        //};

        var data = {
            userIdStr:"1234"
        };

        //var data = "userName=测试123qwer&userId=100123";
        //trace(data);

        //xhr.send();
        xhr.send(requestParam(data));
    },

    postTestProtobuf2:function(){
        var winSize = cc.winSize;
        var xhr = cc.loader.getXMLHttpRequest();

        var statusGetLabel = new cc.LabelTTF("Status:", "Thonburi", 18);
        //statusGetLabel.setColor(cc.color(0, 255, 0));
        this.addChild(statusGetLabel, 1);
        statusGetLabel.x = winSize.width / 2;
        statusGetLabel.y = winSize.height - 100;
        statusGetLabel.setString("Status: Send Get Request to httpbin.org");

        //set arguments with <URL>?xxx=xxx&yyy=yyy
        //xhr.open("GET", "http://192.168.80.83:8077/huaTeng/userController/getUserInfo.ht?requestInfoStr={\"openid\":\"whg333\"}", true);

        xhr.open("POST", "http://192.168.90.10:8077/huaTeng/testController/protobuf2.proto");

        //xhr.setRequestHeader("Access-Control-Allow-Origin", "*");
        //xhr.setRequestHeader("ht_auth_secret","003964663fccb7d9_404883");
        //xhr.setRequestHeader("ht_idf_c_key","");

        //set Content-type "text/plain;charset=UTF-8" to post plain text
        //xhr.setRequestHeader("Content-Type","text/plain;charset=UTF-8");

        //这个在用POST请求时需要指定以表单形式提交参数
        xhr.setRequestHeader("Content-Type","application/x-www-form-urlencoded;charset=UTF-8");

        //这个代表服务器返回的protobuf协议的数据
        //对应的spring mvc controller方法返回ResponseEntity<TestProto>且使用ResponseEntity.ok(testProto)
        xhr.setRequestHeader("Accept","application/x-protobuf");

        //xhr.responseType = "blob";
        if (xhr.overrideMimeType){
            //这个是必须的，否则返回的是字符串，导致protobuf解码错误
            //具体见http://www.ruanyifeng.com/blog/2012/09/xmlhttprequest_level_2.html
            xhr.overrideMimeType('text/plain; charset=x-user-defined');
        }

        var that = this;
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4 && (xhr.status >= 200 && xhr.status <= 207)) {
                var httpStatus = xhr.statusText;

                var data = xhr.responseText;
                trace(data+" !");
                trace(typeof data);
                var response = xhr.responseText + "...";

                var ProtoBuf = dcodeIO.ProtoBuf,
                    ResponseProtocolBuffer = ProtoBuf.loadProtoFile("res/protobuf/ResponseProtoBuf.proto").build("ResponseProtocolBuffer"),
                    TestProto = ResponseProtocolBuffer.TestProto;

                var testProtoData = new TestProto({
                    id:10004,
                    name:"testProtoName测试",
                    rank:3,
                    gold:1000,
                    exp:100,
                    diamond:10
                });

                var protoResp = TestProto.decode(
                    /*data*/
                    str2bytes(data)
                    /*stringToBytes(data)*/
                    /*testProtoData.toArrayBuffer()*/
                );
                trace(JSON.stringify(protoResp));
                trace(protoResp.id);

                //var protoResp2 = TestProto.decode(
                //    /*data*/
                //    /*str2bytes(data)*/
                //    stringToBytes(data)
                //    /*testProtoData.toArrayBuffer()*/
                //);
                //trace(JSON.stringify(protoResp2));

                var responseLabel = new cc.LabelTTF("GET Response: \n" + response, "Thonburi", 16);
                //responseLabel.setColor(cc.color(0, 255, 0));
                that.addChild(responseLabel, 1);
                responseLabel.anchorX = 0;
                responseLabel.anchorY = 1;
                responseLabel.textAlign = cc.TEXT_ALIGNMENT_LEFT;

                responseLabel.x = 10;
                responseLabel.y = winSize.height / 2;
                statusGetLabel.setString("Status: Got GET response! " + httpStatus);
            }
        };

        //var data = {
        //    userName:"测试123qwer",
        //    userId:"100123",
        //};

        //var data = {
        //    userIdStr:"10004",
        //    name:"whg10333",
        //};

        var data = {
            userIdStr:"1234"
        };

        //var data = "userName=测试123qwer&userId=100123";
        //trace(data);

        //xhr.send();
        xhr.send(requestParam(data));
    },

    postSendProtobuf:function(){
        var winSize = cc.winSize;
        var xhr = cc.loader.getXMLHttpRequest();

        var statusGetLabel = new cc.LabelTTF("Status:", "Thonburi", 18);
        //statusGetLabel.setColor(cc.color(0, 255, 0));
        this.addChild(statusGetLabel, 1);
        statusGetLabel.x = winSize.width / 2;
        statusGetLabel.y = winSize.height - 100;
        statusGetLabel.setString("Status: Send Get Request to httpbin.org");

        //set arguments with <URL>?xxx=xxx&yyy=yyy
        //xhr.open("GET", "http://192.168.80.83:8077/huaTeng/userController/getUserInfo.ht?requestInfoStr={\"openid\":\"whg333\"}", true);

        xhr.open("POST", "http://192.168.90.10:8077/huaTeng/testController/protobuf3.proto");

        //xhr.setRequestHeader("Access-Control-Allow-Origin", "*");
        //xhr.setRequestHeader("ht_auth_secret","003964663fccb7d9_404883");
        //xhr.setRequestHeader("ht_idf_c_key","");

        //set Content-type "text/plain;charset=UTF-8" to post plain text
        //xhr.setRequestHeader("Content-Type","text/plain;charset=UTF-8");

        //这个在用POST请求时需要指定以表单形式提交参数
        //xhr.setRequestHeader("Content-Type","application/x-www-form-urlencoded;charset=UTF-8");
        xhr.setRequestHeader("Content-Type","application/x-protobuf");

        //这个代表服务器返回的protobuf协议的数据
        //对应的spring mvc controller方法返回ResponseEntity<TestProto>且使用ResponseEntity.ok(testProto)
        xhr.setRequestHeader("Accept","application/x-protobuf");

        //xhr.responseType = "blob";
        if (xhr.overrideMimeType){
            //这个是必须的，否则返回的是字符串，导致protobuf解码错误
            //具体见http://www.ruanyifeng.com/blog/2012/09/xmlhttprequest_level_2.html
            xhr.overrideMimeType('text/plain; charset=x-user-defined');
        }

        var ProtoBuf = dcodeIO.ProtoBuf,
            ResponseProtocolBuffer = ProtoBuf.loadProtoFile("res/protobuf/ResponseProtoBuf.proto").build("ResponseProtocolBuffer"),
            TestProto = ResponseProtocolBuffer.TestProto;

        var testProtoData = new TestProto({
            id:10004,
            name:"testProtoName测试",
            rank:13,
            gold:23425,
            exp:9527,
            diamond:321
        });

        var that = this;
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4 && (xhr.status >= 200 && xhr.status <= 207)) {
                var httpStatus = xhr.statusText;

                var data = xhr.responseText;
                trace(data+" !");
                trace(typeof data);
                var response = xhr.responseText + "...";

                var protoResp = TestProto.decode(
                    /*data*/
                    str2bytes(data)
                    /*stringToBytes(data)*/
                    /*testProtoData.toArrayBuffer()*/
                );
                trace(JSON.stringify(protoResp));
                trace(protoResp.id);

                //var protoResp2 = TestProto.decode(
                //    /*data*/
                //    /*str2bytes(data)*/
                //    stringToBytes(data)
                //    /*testProtoData.toArrayBuffer()*/
                //);
                //trace(JSON.stringify(protoResp2));

                var responseLabel = new cc.LabelTTF("GET Response: \n" + response, "Thonburi", 16);
                //responseLabel.setColor(cc.color(0, 255, 0));
                that.addChild(responseLabel, 1);
                responseLabel.anchorX = 0;
                responseLabel.anchorY = 1;
                responseLabel.textAlign = cc.TEXT_ALIGNMENT_LEFT;

                responseLabel.x = 10;
                responseLabel.y = winSize.height / 2;
                statusGetLabel.setString("Status: Got GET response! " + httpStatus);
            }
        };

        //var data = {
        //    userName:"测试123qwer",
        //    userId:"100123",
        //};

        //var data = {
        //    userIdStr:"10004",
        //    name:"whg10333",
        //};

        var data = {
            userIdStr:"1234"
        };

        //var data = "userName=测试123qwer&userId=100123";
        //trace(data);

        //xhr.send();
        //xhr.send(requestParam(data));
        xhr.send(testProtoData.toArrayBuffer());
    }

});

function requestParam(data){
    if(typeof(data) == "string"){
        return data;
    }
    var result = [];
    for(e in data){
        result.push(e+"="+data[e]);
    }
    return result.join("&");
}

isJson = function(obj){
    var isjson = typeof(obj) == "object" && Object.prototype.toString.call(obj).toLowerCase() == "[object object]" && !obj.length;
    return isjson;
}

function stringToBytes ( str ) {
    var ch, st, re = [];
    for (var i = 0; i < str.length; i++ ) {
        ch = str.charCodeAt(i);  // get char
        st = [];                 // set up "stack"
        do {
            st.push( ch & 0xFF );  // push byte to stack
            ch = ch >> 8;          // shift value down by 1 byte
        }
        while ( ch );
        // add stack contents to result
        // done because chars have "wrong" endianness
        re = re.concat( st.reverse() );
    }
    // return an array of bytes
    return re;
}
//stringToBytes( "A/u1242B/u4123C" );  // [65, 18, 66, 66, 65, 35, 67]

function str2bytes(str){
    var bytes = [];
    //for (var i = 0; i < str.length; ++i) {
    //    bytes.push(str.charCodeAt(i));
    //}
    for (var i = 0, len = str.length; i < len; ++i) {
        var c = str.charCodeAt(i);
        var byte = c & 0xff;
        bytes.push(byte);
    }
    return bytes;
}

function printHex(){
    var result = "";
    //for(){
    //
    //}
    trace(result);
}