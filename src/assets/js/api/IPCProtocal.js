function IPCProtocal(e) {
    var that = this;
    this.trans = function (ip,command) {
        var xmlhttp;
        if (window.XMLHttpRequest) {
            // code for IE7+, Firefox, Chrome, Opera, Safari
            xmlhttp = new XMLHttpRequest;

            //针对某些特定版本的mozillar浏览器的bug进行修正。
            if (xmlhttp.overrideMimeType) {
                xmlhttp.overrideMimeType('text/xml');
            };

        } else if (window.ActiveXObject) {
            // code for IE6, IE5
            xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
        }

        xmlhttp.open('POST', "http://" + ip+ "/prtl.cgi?" + command, true); //xhr.open('GET', url, true);    // 也可以使用POST方式，根据接口
        //目前传递类型为arraybuffer,当传递类型为blob的时候将类型修改，并且将下面的代码取消注释
        //xmlhttp.responseType = "txt";  // 返回类型blob or arraybuffer
        // 发送ajax请求
        xmlhttp.send();
    };
    this.transWithByte= function (ip,cmd) {

        var flag = 0;
        var oReq;
        var byteArray;
        if (window.XMLHttpRequest) {
            // code for IE7+, Firefox, Chrome, Opera, Safari
            oReq = new XMLHttpRequest;

            //针对某些特定版本的mozillar浏览器的bug进行修正。
            if (oReq.overrideMimeType) {
                oReq.overrideMimeType('text/xml');
            };

        } else if (window.ActiveXObject) {
            // code for IE6, IE5
            oReq = new ActiveXObject("Microsoft.XMLHTTP");
        }
        oReq.overrideMimeType("text/plain; charset=x-user-defined");
        oReq.open('GET', "http://" + ip + "/prtl.cgi?" + cmd, false);
        
        // oReq.responseType = "arraybuffer";
        oReq.onload = function (oEvent) {
            //展示返回值
            // console.log("oReq.readyState:" + oReq.readyState);
            //说明ajax成功的返回了，等于200时候就是要从后台把要打印出来的东西给调回前台，不一定要=200，不同浏览器值不一样 你可以这样：
            if (oReq.readyState == 4 && oReq.status == 200) {

                var binStr = this.responseText;

                byteArray = new Uint8Array(binStr.length);

                //然后自己再想方法将逐个字节还原为二进制数据
                for (var i = 0, len = binStr.length; i < len; ++i) {
                    var c = binStr.charCodeAt(i);
                    //String.fromCharCode(c & 0xff);
                    byteArray[i] = c & 0xff;
                }
                flag = 1;
                console.log("##########" + byteArray.length);
                //return byteArray;
            }
        }


        // oReq.open("GET", "input_Slot.bin", true);

        //目前传递类型为arraybuffer,当传递类型为blob的时候将类型修改，并且将下面的代码取消注释
        // xmlhttp.responseType = "text/xml";  // 返回类型blob or arraybuffer
        // 发送ajax请求

        oReq.send();

        var time = 0;
        while (flag === 0) {
            sleep(1);
            time++;
            if (time >= 1500) {
                console.log("@@@@@@@@@@@@@@@reciveDatas超时！！！");
                break;
            }
        }
        if (flag === 1) {

            return byteArray;
        } else {
            return null;
        }
    };
    this.transWithACK1 = function (ip,command) {//socket1接收数据的函数
        //路径/名称
        var flag = 0;
        var xmlhttp;
        if (window.XMLHttpRequest) {
            // code for IE7+, Firefox, Chrome, Opera, Safari
            xmlhttp = new XMLHttpRequest;

            //针对某些特定版本的mozillar浏览器的bug进行修正。
            if (xmlhttp.overrideMimeType) {
                xmlhttp.overrideMimeType('text/xml');
            };

        } else if (window.ActiveXObject) {
            // code for IE6, IE5
            xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
        }

        xmlhttp.onreadystatechange = function () {

            // alert("xhr.responseText1:" + xhr.responseText);
            if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {

                flag = 1;

                return xmlhttp.responseText;
            }
        }
        xmlhttp.open('GET', "http://" + ip + "/prtl.cgi?" + command, false);//xhr.open('GET', url, true);    // 也可以使用POST方式，根据接口
        //目前传递类型为arraybuffer,当传递类型为blob的时候将类型修改，并且将下面的代码取消注释
        // xmlhttp.responseType = "text/xml";  // 返回类型blob or arraybuffer
        // 发送ajax请求
        xmlhttp.send();

        var time = 0;
        while (flag === 0) {
            that.sleep(1);
            time++;
            if (time >= 1000) {
                console.log("!!!!!!!!!!!!reciveStringValue超时！！！");
                break;
            }
        }
        if (flag === 1) {
            return xmlhttp.responseText;
        } else {
            return null;
        }
    };
    this.transWithList = function (ip,cmd) {//socket1发送指令并等待
        var li = new Array();
        var ret = that.transWithACK1(ip,cmd);

        var cmdAndParam = that.get_cmd_param(ret);
        if (cmdAndParam == null) {
            return null;//error
        }
        if (cmdAndParam[0].toLowerCase() === "ack" && cmdAndParam.length >= 3) {
            for (var i = 2; i < cmdAndParam.length; i++) {
                var tmp = parseInt(cmdAndParam[i]);
                li.push(tmp);
            }
            return li;
        } else {
            return null;//error
        }


    };
    this.get_cmd_param = function (ret) {
        if (typeof String.prototype.startsWith != 'function') {
            String.prototype.startsWith = function (prefix) {
                return this.slice(0, prefix.length) === prefix;
            };
        }
        if (ret.indexOf("/L:d,1;") !== -1) {
            ret = str.replaceAll("/L:d,1;", "");
        }
        var sub;
        var strs = null;
        if (ret.indexOf("/") !== -1 && ret.indexOf(";") !== -1) {
            sub = ret.split(";");
            for (var i = 0; i < sub.length; i++) {
                if (sub[i].startsWith("/")) // if(sub[i].contains("/"))
                {

                    // 以多条件分割字符串时
                    var b = sub[i];//sub[i];

                    b = b.replace("/", "");
                    b = b.replace(":", ",");
                    b = b.replace(",", ",");
                    b = b.replace(";", ",");

                    strs = b.split(",");

                    break;
                }
            }
        }

        return strs;
    }
    this.selectIPWindow = function ( IP , id) {
        var args = String.format("/selectIPWindow:d,%d;\n",id);
        that.trans(IP,  args);
    }

    this.updateIPWindow = function( IP,  id) {
        var args = String.format( "/updateIPWindow:d,%d;\n",id);
        that.trans(IP,  args);
    }

    this.setIPURL = function( IP,url) {
        var args = String.format("/setIPURL:s," + url + "\n");
        that.trans(IP,  args);
    }

    this.setIPName = function( IP,    name) {
        var args = String.format("/setIPName:s," + name + "\n");
        console.log("args:" + args);
        that.trans(IP,  args);
    }

    this.setIPRemark = function( IP,   remark) {
        var args = String.format("/setIPRemark:s," + remark + "\n");
        that.trans(IP,  args);
    }
    this.getIPScene = function( IP,  id) {//id-->场景的id
        var args = String.format("/getIPScene:d,%d;\n",id);
        return that.transWithByte( IP,  args);
    }

    this.getCurIPScene = function(IP) {//id-->场景的id
        var args = String.format("/getCurIPScene:d," + 1 + ";\n");
        return that.transWithByte(IP,args);
    }

    this.setIPWindow = function( IP , id,  x,  y,  w,  h,  z) {

        var args = String.format("/setIPWindow:d,%d,%d,%d,%d,%d,%d;\n", id, x, y, w, h, z);
        that.trans(IP,  args);

    }
    this.resetIPWindows = function( IP) {//id-->场景的id
        var args = String.format("/resetIPWindows:d," + 1 + ";\n");
        that.trans(IP,  args);
    }



    this.getUrlList=function(IP) {
        var args = String.format("/getUrlList:d," + 1 + ";");
        var byteURL = that.transWithByte(IP,  args);

        var list = [];
        var temp =  new Array(2048);
        var j = 0;
        for (var i = 0; i < byteURL.length&&i<512*1024; i++) {

            temp[j] = byteURL[i];
            j++;
            if (j % 2048 == 0) {
                var id = resversByte2ToShort(temp, 0);
                var url = new Array(2000);
                for (var k = 2; k < 2048 - 46; k++) {
                    url[k - 2] = temp[k];
                }
                j = 0;
                var result =byteToUtf8String(url);
                if (id > 0) {
                    var svp = new vp();
                    svp.id=id;
                    svp.name=result;
                    list.push(svp);
                }
            }
        }
        
        return list;

    }
      
    this.detectuFileList = function (IP) {
        var args = String.format("/detectuFileList:d," + 1 + ";");
        that.trans(IP, args);

    }
    this.getFileList = function (IP) {
        var args = String.format("/getFileList:d," + 1 + ";");
        var byteURL = that.transWithByte( IP, args);
       var list = [];
        var temp = new Array(2048);
        var j = 0;
        for (var i = 0; i < byteURL.length && i < 512 * 1024; i++) {

            temp[j] = byteURL[i];
            j++;
            if (j % 2048 == 0) {
                var id = resversByte2ToShort(temp, 0);
                var url = new Array(2000);
                for (var k = 2; k < 2048 - 46; k++) {
                    url[k - 2] = temp[k];
                }
                j = 0;
                var result = byteToUtf8String(url);
                if (id > 0) {
                    var svp = new vp();
                    svp.id = id;
                    svp.name = result;
                    list.push(svp);
                }
            }
        }

        return list;

    }

    //每个窗口url的连接状态  0：未知 1：正常 2：失败  秒读一次
    this.getWindowStates = function ( IP) {
        var args = String.format("/getWindowStates:d," + 1 + ";");
        var list = that.transWithList(IP, args);
        return list;

    }

    this.addUrl = function ( IP,  url) {
        var args = String.format("/addUrlCinfig:s," + url + "\n");
        that.trans(IP, args);

    }

    this.modifyUrl = function (IP, url) {
        var args = String.format("/modifyUrlCinfig:s," + url + "\n");
        that.trans(IP, args);

    }

    this.deleteUrl = function (IP, id) {
        var args = String.format("/delUrlCinfig:d,%d;\n",id);
        that.trans(IP, args);

    }

    this.clearUrl = function ( IP) {
        var args = String.format("/clearUrlCinfig:d," + 1 + ";\n");
        that.trans(IP, args);

    }

    this.setCurrentUrlID = function (IP, id) {
        var args = String.format("/setUrlCinfigID:d,%d;\n",id);
        that.trans(IP, args);

    }
    function byteToUtf8String(arr) {
        if (typeof arr === 'string') {
            return arr;
        }
        var str = '',
            _arr = arr;
        for (var i = 0; i < _arr.length; i++) {
            var one = _arr[i].toString(2),
                v = one.match(/^1+?(?=0)/);
            if (v && one.length == 8) {
                var bytesLength = v[0].length;
                var store = _arr[i].toString(2).slice(7 - bytesLength);
                for (var st = 1; st < bytesLength; st++) {
                    store += _arr[st + i].toString(2).slice(2);
                }
                str += String.fromCharCode(parseInt(store, 2));
                i += bytesLength - 1;
            } else {
                str += String.fromCharCode(_arr[i]);
            }
        }
        return str;
    }


}