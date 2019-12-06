

function Protocal(e) {

    //String.prototype.format = function (args) {
    //    var result = this;
    //    if (arguments.length > 0) {
    //        if (arguments.length == 1 && typeof (args) == "object") {
    //            for (var key in args) {
    //                if (args[key] != undefined) {
    //                    var reg = new RegExp("({" + key + "})", "g");
    //                    result = result.replace(reg, args[key]);
    //                }
    //            }
    //        }
    //        else {
    //            for (var i = 0; i < arguments.length; i++) {
    //                if (arguments[i] != undefined) {
    //                    //var reg = new RegExp("({[" + i + "]})", "g");//这个在索引大于9时会有问题，谢谢何以笙箫的指出
    //                    var reg = new RegExp("({)" + i + "(})", "g");
    //                    result = result.replace(reg, arguments[i]);
    //                }
    //            }
    //        }
    //    }
    //    return result;
    //}
    //String.format = function () {
    //    if (arguments.length == 0)
    //        return null;

    //    var str = arguments[0];
    //    for (var i = 1; i < arguments.length; i++) {
    //        var re = new RegExp('\\{' + (i - 1) + '\\}', 'gm');
    //        str = str.replace(re, arguments[i]);
    //    }
    //    return str;
    //}
    this.ipaddr = "";
    var that = this;
    this.setProtocalIP = function (ip) {
        that.ipaddr = ip;
    };
    this.setLocalIP = function (ip) {

        that.ipaddr = ip;
    };

    this.send = function (command) {
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

        xmlhttp.open('POST', "http://" + that.ipaddr + "/prtl.cgi?" + command, true); //xhr.open('GET', url, true);    // 也可以使用POST方式，根据接口
        //目前传递类型为arraybuffer,当传递类型为blob的时候将类型修改，并且将下面的代码取消注释
        //xmlhttp.responseType = "txt";  // 返回类型blob or arraybuffer
        // 发送ajax请求
        xmlhttp.send();
    };

    this.reciveStringValue = function (command) {//socket1接收数据的函数
        //路径/名称
        var flag = 0;
        var xmlhttp;
        try {
            if (window.XMLHttpRequest) {
                // code for IE7+, Firefox, Chrome, Opera, Safari
                xmlhttp = new XMLHttpRequest;

                //针对某些特定版本的mozillar浏览器的bug进行修正。
                if (xmlhttp.overrideMimeType) {
                    xmlhttp.overrideMimeType('text/xml');
                }
                ;

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
            xmlhttp.open('GET', "http://" + that.ipaddr + "/prtl.cgi?" + command, false);//xhr.open('GET', url, true);    // 也可以使用POST方式，根据接口
            //目前传递类型为arraybuffer,当传递类型为blob的时候将类型修改，并且将下面的代码取消注释
            // xmlhttp.responseType = "text/xml";  // 返回类型blob or arraybuffer
            // 发送ajax请求
            xmlhttp.send();
        }catch (e) {

        }

        var time = 0;
        while (flag === 0) {
            that.sleep(1);
            time++;
            if (time >= 1000) {
                console.log("!!!!!!!!!!!!reciveStringValue超时！！！");
                alert('网络请求超时，请稍候重试！（Network request timeout, please try again later!）');
                break;
            }
        }
        if (flag === 1) {
            return xmlhttp.responseText;
        } else {
            return null;
        }
    };

    this.sleep = function (delay) {
        var start = (new Date()).getTime();
        while ((new Date()).getTime() - start < delay) {
            continue;
        }
    };
    this.reciveDatas = function (cmd) {

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
        oReq.open('GET', "http://" + that.ipaddr + "/prtl.cgi?" + cmd, false);
        oReq.overrideMimeType("\'text/plain; charset=x-user-defined\'");
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
    this.reciveFileDatas = function (cmd) {

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
        var getTimestamp = new Date().getTime();
        oReq.open('GET', "http://" + that.ipaddr + "/scene.cgi?" + cmd + "&timestamp=" + getTimestamp, false);
        //oReq.overrideMimeType("text/plain; charset=x-user-defined");
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
                    var byte = c & 0xff;
                    byteArray[i] = byte;
                }
                flag = 1;

                return byteArray;
            }
        }


        // oReq.open("GET", "input_Slot.bin", true);

        //目前传递类型为arraybuffer,当传递类型为blob的时候将类型修改，并且将下面的代码取消注释
        // xmlhttp.responseType = "text/xml";  // 返回类型blob or arraybuffer
        // 发送ajax请求

        oReq.send();

        var time = 0;
        while (flag === 0) {
            that.sleep(1);
            time++;
            if (time >= 1000) {
                console.log("@@@@@@@@@@@@@@@reciveFileDatas超时！！！");
                break;
            }
        }
        if (flag === 1) {

            return byteArray;
        } else {
            return null;
        }
    };


    this.getAck = function () {


    };

    this.reciveString = function (cmd) {
        var ret = that.reciveStringValue(cmd);

        var cmdAndParam = that.get_cmd_param(ret);
        if (cmdAndParam == null) {
            return null;//error
        }
        if (cmdAndParam[0].toLowerCase() === "ack" && cmdAndParam.length >= 3) {

            return cmdAndParam[2];

        } else {
            return null;//error
        }


    };

    this.reciveList = function (cmd) {//socket1发送指令并等待
        var li = new Array();
        var ret = that.reciveStringValue(cmd);

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
    this.recive = function (cmd) {//返回int类型的值
        var li = that.reciveList(cmd);
        var ret = 0;
        if (li != null && li.length > 0) {
            ret = li[0];
        }
        return ret;
    };
    this.recivebytelist = function (cmd) {

    };



    this.initProtocalParam = function (
        msrc,
        psrc,
        pfmt
    ) {

        this.src[0] = msrc;
        this.src[1] = psrc;
        this.fmt = pfmt;
    };

    this.getSrc0 = function () {
        return src[0];
    };

    this.getSrc1 = function () {
        return src[1];
    };
    this.getSource = function (id) {
        return src[id];
    };

    this.getSourceId = function (src) {
        var i;
        for (i = 0; i < 4; i++) {
            if (this.src[i] == src) {
                return i;
            }
        }
        return i;
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


    this.setDevLink = function (param) {
        var cmd;
        cmd = String.format("/wrlink:d,%d;", param);
        that.send(cmd);
        return 0;
    };

    this.getDevLink = function () {
        var cmd;
        var ack;
        cmd = String.format("/rdlink:d,%d;", 0);
        return that.recive(cmd);
    };

    this.getProductCode = function () {//读产品型号
        var cmd;
        var ack;
        cmd = String.format("/getProductCode:d,%d;", 0);
        return that.recive(cmd);
    };

    /**
     * ******************************************************************************************************
     */
    this.inputCardRcvSenderOutClkTest = function (slot, port) {
        var cmd;
        var ack = 0;
        cmd = String.format("/inputCardOutClkTest:d,%d,%d;", slot, port);
        ack = that.recive(cmd);
        return ack;
    };

    this.inputCardRcvSenderPRBSTest = function (slot, port) {
        var cmd;
        var ack = 0;
        cmd = String.format("/inputCardPRBSTest:d,%d,%d;", slot, port);
        ack = that.recive(cmd);
        return ack;
    };

    this.inputCardRcvSenderSelfTest = function () {
        var cmd;
        var ack = 0;
        cmd = String.format("/inputCardSelfTest:d,%d;", 0);
        that.send(cmd);
        return ack;
    };
    //////////////////////////////////////////////////////////////////////////

    this.outputCardRcvSenderOutClkTest = function (slot, port) {
        var cmd;
        var ack = 0;
        cmd = String.format("/outputCardOutClkTest:d,%d,%d;", slot, port);
        ack = that.recive(cmd);
        return ack;
    };

    this.outputCardRcvSenderPRBSTest = function (slot, port) {
        var cmd;
        var ack = 0;
        cmd = String.format("/outputCardPRBSTest:d,%d,%d;", slot, port);
        ack = that.recive(cmd);
        return ack;
    };

    this.outputCardRcvSenderSelfTest = function () {
        var cmd;
        var ack = 0;
        cmd = String.format("/outputCarSelfTest:d,%d;", 0);
        that.send(cmd);
        return ack;
    };

    this.deviceRcvSenderCardPortSelfTest = function (inslot, inport, outslot, outch) {
        var cmd;
        var ack = 0;
        cmd = String.format("/deviceCardPortSelfTest:d,%d,%d,%d,%d;", inslot, inport, outslot, outch);
        ack = that.recive(cmd);
        return ack;
    };

    this.deviceRcvSenderSelfTest = function () {
        var cmd;
        var ack = 0;
        cmd = String.format("/deviceRcvSenderSelfTest:d,%d;", 0);
        that.send(cmd);
        return ack;
    };

    this.deviceRcvSenderSelfFullTest = function () {
        var cmd;
        var ack = 0;
        cmd = String.format("/deviceRcvSenderSelfFullTest:d,%d;", 0);
        that.send(cmd);
        return ack;
    };
    ////////////////////////////////////////////////////////

    this.deviceGotoWorkMode = function () {
        var cmd;
        var ack = 0;
        cmd = String.format("/deviceGotoWorkMode:d,%d;", 0);
        that.send(cmd);
        return ack;

    };

    this.theInputCardOutClkTest = function (slot) {

        var cmd;
        var ack = 0;
        cmd = String.format("/theInputCardOutClkTest:d,%d;", slot);
        ack = that.recive(cmd);
        return ack;
    };

    this.theInputCardPRBSTest = function (slot) {

        var cmd;
        var ack = 0;
        cmd = String.format("/theInputCardPRBSTest:d,%d;", slot);
        ack = that.recive(cmd);
        return ack;
    };

    this.theOutputCardOutClkTest = function (slot) {

        var cmd;
        var ack = 0;
        cmd = String.format("/theOutputCardOutClkTest:d,%d;", slot);
        ack = that.recive(cmd);
        return ack;
    };

    this.theOutputCardPRBSTest = function (slot) {

        var cmd;
        var ack = 0;
        cmd = String.format("/theOutputCardPRBSTest:d,%d;", slot);
        ack = that.recive(cmd);
        return ack;
    };

    this.TheDeviceCardPortSelfTest = function (inslot, inport, outslot) {

        var cmd;
        var ack = 0;
        cmd = String.format("/TheDeviceCardPortSelfTest:d,%d,%d,%d;", inslot, inport, outslot);
        ack = that.recive(cmd);
        return ack;
    };

    this.testDataInputSendOutputRcvTimeMs = function (outcard, outport, incard, inport, t) {

        var cmd;
        var ack = 0;
        cmd = String.format("/testDataInputSendOutputRcvTimeMs:d,%d,%d,%d,%d,%d;", outcard, outport, incard, inport, t);
        that.send(cmd);
        return ack;
    };

    this.gettestDataInputSendOutputRcvTimeMs = function () {

        var cmd;
        var ack = 0;
        cmd = String.format("/gettestDataInputSendOutputRcvTimeMs:d,1;");
        ack = that.recive(cmd);
        return ack;
    };

    this.testAllOutCardFrameDataByInputPort = function (incard, inport, t) {

        var cmd;
        var ack = 0;
        cmd = String.format("/testAllOutCardFrameDataByInputPort:d,%d,%d,%d;", incard, inport, t);
        that.send(cmd);
        return ack;
    };

    this.gettestAllOutCardFrameDataRes = function (outcard, outport) {

        var cmd;
        var ack = 0;
        cmd = String.format("/gettestAllOutCardFrameDataRes:d,%d,%d;", outcard, outport);
        ack = that.recive(cmd);
        return ack;
    };

    ///////////////////////////////////////////////////////////////////////////////////////////////
    this.InputCardddrTest = function (slot, times) {
        var cmd;
        var ack = 0;
        cmd = String.format("/InputCardddrTest:d,%d,%d;", slot, times);
        that.send(cmd);
        return ack;
    };

    this.getInputCardddrTest = function (slot) {
        var cmd;
        var ack = 0;
        cmd = String.format("/getInputCardddrTest:d,%d,%d;", slot, 0);
        ack = that.recive(cmd);
        return ack;
    };

    this.OutputCardddrTest = function (slot, times) {
        var cmd;
        var ack = 0;
        cmd = String.format("/OutputCardddrTest:d,%d,%d;", slot, times);
        that.send(cmd);//  ack = that.recive(cmd);
        return ack;
    };

    this.getOutputCardddrTest = function (slot) {
        var cmd;
        var ack = 0;
        cmd = String.format("/getOutputCardddrTest:d,%d,%d;", slot, 0);
        ack = that.recive(cmd);
        return ack;
    };

    this.CtrlCardddrTest = function (times) {
        var cmd;
        var ack = 0;
        cmd = String.format("/CtrlCardddrTest:d,%d;", times);
        that.send(cmd);
        return ack;
    };

    this.getCtrlCardddrTest = function () {
        var cmd;
        var ack = 0;
        cmd = String.format("/getCtrlCardddrTest:d,%d;", 0);
        ack = that.recive(cmd);
        return ack;
    };

    /**
     * ******************************************************************************************************
     */
    this.setWinXById = function (id, param) {
        var cmd;
        cmd = String.format("/setwinbywinx:d,%d,%d;", id, param);
        that.send(cmd);
        return 0;
    };

    this.getWinXById = function (id) {
        var cmd;
        var ack;
        cmd = String.format("/getwinbywinx:d,%d;", id);
        return that.recive(cmd);
    };

    this.setWinYById = function (id, param) {
        var cmd;
        cmd = String.format("/setwinbywiny:d,%d,%d;", id, param);
        that.send(cmd);

        return 0;
    };

    this.getWinYById = function (id) {
        var cmd;
        var ack;
        cmd = String.format("/getwinbywiny:d,%d;", id);
        return that.recive(cmd);
    };

    this.setWinWById = function (id, param) {
        var cmd;
        cmd = String.format("/setwinbywinw:d,%d,%d;", id, param);
        that.send(cmd);
        return 0;
    };

    this.getWinWById = function (id) {
        var cmd;
        var ack;
        cmd = String.format("/getwinbywinw:d,%d;", id);
        return that.recive(cmd);
    };

    this.setWinHById = function (id, param) {
        var cmd;
        cmd = String.format("/setwinbywinh:d,%d,%d;", id, param);
        that.send(cmd);
        return 0;
    };

    this.getWinHById = function (id) {
        var cmd;
        var ack;
        cmd = String.format("/getwinbywinh:d,%d;", id);
        return that.recive(cmd);
    };

    this.setWinCropXById = function (id, param) {
        var cmd;
        cmd = String.format("/setwinbycropx:d,%d,%d;", id, param);
        that.send(cmd);
        return 0;
    };

    this.getWinCropXById = function (id) {
        var cmd;
        var ack;
        cmd = String.format("/getwinbycropx:d,%d;", id);
        return that.recive(cmd);
    };

    this.setWinCropYById = function (id, param) {
        var cmd;
        cmd = String.format("/setwinbycropy:d,%d,%d;", id, param);
        that.send(cmd);

        return 0;
    };

    this.getWinCropYById = function (id) {
        var cmd;
        var ack;
        cmd = String.format("/getwinbycropy:d,%d;", id);
        return that.recive(cmd);
    };

    this.setWinCropWById = function (id, param) {
        var cmd;
        cmd = String.format("/setwinbycropw:d,%d,%d;", id, param);
        that.send(cmd);
        return 0;
    };

    this.getWinCropWById = function (id) {
        var cmd;
        var ack;
        cmd = String.format("/getwinbycropw:d,%d;", id);
        return that.recive(cmd);
    };

    this.setWinCropHById = function (id, param) {
        var cmd;
        cmd = String.format("/setwinbycroph:d,%d,%d;", id, param);
        that.send(cmd);
        return 0;
    };

    this.getWinCropHById = function (id) {
        var cmd;
        var ack;
        cmd = String.format("/getwinbycroph:d,%d;", id);
        return that.recive(cmd);
    };

    this.setWinCropEnById = function (id, param) {
        var cmd;
        cmd = String.format("/setwinbycropen:d,%d,%d;", id, param);
        that.send(cmd);
        return 0;
    };

    this.getWinCropEnById = function (id) {
        var cmd;
        var ack;
        cmd = String.format("/getwinbycropen:d,%d;", id);
        return that.recive(cmd);
    };

    this.setWinAlphaById = function (id, param) {
        var cmd;
        cmd = String.format("/setwinbyalpha:d,%d,%d;", id, param);
        that.send(cmd);
        return 0;
    };

    this.getWinAlphaById = function (id) {
        var cmd;
        var ack;
        cmd = String.format("/getwinbyalpha:d,%d;", id);
        return that.recive(cmd);
    };

    this.setWinZById = function (id, param) {
        var cmd;
        cmd = String.format("/setwinbyz:d,%d,%d;", id, param);
        that.send(cmd);
        return 0;
    };

    this.getWinZById = function (id) {
        var cmd;
        var ack;
        cmd = String.format("/getwinbyz:d,%d;", id);
        return that.recive(cmd);
    };

    this.setWinSourceById = function (id, param) {
        var cmd;
        cmd = String.format("/setwinbysource:d,%d,%d;", id, param);
        that.send(cmd);
        return 0;
    };

    this.getWinSourceById = function (id) {
        var cmd;
        var ack;
        cmd = String.format("/getwinbysource:d,%d;", id);
        return that.recive(cmd);
    };

    this.setWinSlotById = function (id, param) {
        var cmd;
        cmd = String.format("/setwinbyinslot:d,%d,%d;", id, param);
        that.send(cmd);
        return 0;
    };

    this.getWinSlotById = function (id) {
        var cmd;
        var ack;
        cmd = String.format("/getwinbyinslot:d,%d;", id);
        return that.recive(cmd);
    };

    this.setWindowById = function (ugid, id, winx, winy, winw, winh,
        cropx, cropy, cropw, croph, cropen,
        alpha, z, source, inslot, inport, freeze) {
        var cmd;
        var ack;

        cmd = String.format("/setwindow:d,%d,%d,%d,%d,%d,%d,%d,%d,%d,%d,%d,%d,%d,%d,%d,%d,%d;", ugid, id, winx, winy, winw, winh, cropx, cropy, cropw, croph, cropen, alpha, z, source, inslot, inport, freeze);

        that.send(cmd);
        return 0;
    };
    this.setWindowByIdWithRes = function (ugid, id, winx, winy, winw, winh,
        cropx, cropy, cropw, croph, cropen,
        alpha, z, source, inslot, inport, freeze) {
        var cmd;
        var ack;

        cmd = String.format("/setwindow:d,%d,%d,%d,%d,%d,%d,%d,%d,%d,%d,%d,%d,%d,%d,%d,%d,%d;/UpdateWithRelease:d,%d;", ugid, id, winx, winy, winw, winh, cropx, cropy, cropw, croph, cropen, alpha, z, source, inslot, inport, freeze, id);

        that.send(cmd);
        return 0;
    };
    this.setDefaultEDID = function (edidlist, slot, port) {
        var cmd;
        var s = new Array(18);
        for (var i = 0; i < 18; i++) {

            s[i] = edidlist[i] + ",";
            if (i == 17) {
                s[i] = edidlist[i] + ";";
            };
        };
        var slut = (slot).toString(16);
        cmd = ("/setRecommendEDID:h," + slut + "," + port + "," + s[0] + s[1] + s[2] + s[3] + s[4] + s[5] + s[6] + s[7] + s[8] + s[9] + s[10] + s[11] + s[12] + s[13] + s[14] + s[15] + s[16] + s[17]);

        that.send(cmd);
        return 0;
    };
    this.resetAllWindows = function () {
        var cmd;
        cmd = String.format("/resetallwindows:d,%d;", 0);
        that.send(cmd);
        return 0;
    };
    this.resetAllWindows = function (ugid) {
        var cmd;
        cmd = String.format("/resetallwindows:d,%d;", ugid);
        that.send(cmd);
        return 0;
    };

    this.resetAllWindowScreenChMap = function () {
        var cmd;
        cmd = String.format("/resetmap:d,%d;", 0);
        that.send(cmd);
        return 0;
    };

    this.updateSceneWidthRelease = function () {
        var cmd;
        cmd = String.format("/UpdateScene:d,%d;", 0);
        that.send(cmd);

        return 0;
    };

    this.updateWindowWidthRelease = function (winid) {
        var cmd;
        cmd = String.format("/UpdateWithRelease:d,%d;", winid);
        that.send(cmd);

        return 0;
    };

    this.readAllCardTemp = function () {
        var cmd;
        cmd = String.format("/rdAllCardtemp:d,%d;", 1);
        return that.reciveList(cmd);

    };

    this.rdInputCardtemp = function (slot) {
        var cmd;
        cmd = String.format("/rdInputCardtemp:d,%d;", slot);
        return that.reciveList(cmd);
    };

    this.rdOutputCardtemp = function (slot) {
        var cmd;
        cmd = String.format("/rdOutputCardtemp:d,%d;", slot);
        return that.reciveList(cmd);
    };

    //////////////////////////////////////////////
    this.readInputCardArmVer = function (slot) {
        var cmd;
        cmd = String.format("/rdInputArmVer:d,%d;", slot);
        return that.reciveList(cmd);

    };

    this.readInputCardChipArmVer = function (slot) {
        var cmd;
        cmd = String.format("/readInputFpgaVer:d,%d;", slot);
        return that.reciveList(cmd);

    };

    this.readInputCardFpgaVer = function (slot) {
        var cmd;
        cmd = String.format("/rdInputFpgaVer:d,%d;", slot);
        return that.reciveList(cmd);

    };

    this.readOutputCardArmVer = function (slot) {
        var cmd;
        cmd = String.format("/rdOutputArmVer:d,%d;", slot);
        return that.reciveList(cmd);

    };

    this.readOutputCardFpgaVer = function (slot) {
        var cmd;
        cmd = String.format("/rdOutputFpgaVer:d,%d;", slot);
        return that.reciveList(cmd);

    };

    this.readCtrlCardArmVer = function () {
        var cmd;
        cmd = String.format("/rdctrlArmVer:d,%d;", 1);
        return that.reciveList(cmd);

    };

    this.readCtrlCardFpgaVer = function () {
        var cmd;
        cmd = String.format("/rdctrlFpgaVer:d,%d;", 1);
        return that.reciveList(cmd);

    };

    this.readSceneEn = function () {
        var cmd;
        cmd = String.format("/ReadSceneEn:d,%d;", 1);
        return that.reciveList(cmd);

    };

    //
    //    this.=function getWindowById( id) {
    //        var cmd;
    //        cmd = String.format("/getwindow:d,%d;", id);
    //        int[]  ret = null;
    //        List<Integer> li = new ArrayList<Integer>();
    //
    //        that.send(cmd);
    //        var ack = "";
    //        var time=30;
    //        while (time!=0) {
    //
    //            if (com.getAck() == 1) {
    //                ack = that.recive();
    //                break;
    //            };
    //            time--;
    //            try {
    //                Thread.sleep(5);//括号里面的5000代表5000毫秒，也就是5秒，可以该成你需要的时间
    //            }; catch (InterruptedException e) {
    //                e.printStackTrace();
    //            };
    //        };
    //        String[] cmdAndParam =  that.get_cmd_param(ack);
    //
    //        if (cmdAndParam == null) {
    //            return null;//error
    //        };
    //
    //        if (cmdAndParam[0].equalsIgnoreCase("ack") && cmdAndParam.length >= 3) {
    //            // return Integer.
    //            for( i=2;i< cmdAndParam.length;i++){
    //            var tmp= Integer.parseInt(cmdAndParam[i]);
    //             li.add(new Integer(tmp));
    //
    //            };
    //            return li;
    //
    //        }; else {
    //            return null;//error
    //        };
    //
    //
    //    };
    this.getWindowById = function (id) {
        var cmd;
        cmd = String.format("/getwindow:d,%d;", id);
        return that.reciveList(cmd);

    };

    /**
     * ******************************************************************************************************
     */
    this.setCurOutputSlotPorttype = function (card, port, param) {
        var cmd;
        cmd = String.format("/setwinbyinslot:d,%d,%d,%d;", card, port, param);
        that.send(cmd);
        return 0;
    };

    this.setLastOutputSlotPorttype = function (card, port, param) {
        var cmd;
        cmd = String.format("/setlastOutputSlotPorttype:d,%d,%d,%d;", card, port, param);
        that.send(cmd);
        return 0;
    };

    this.setgLoadOutputSlotPorttype = function (card, port, param) {
        var cmd;
        cmd = String.format("/setgLoadOutputSlotPorttype:d,%d,%d,%d;", card, port, param);
        that.send(cmd);
        return 0;
    };

    this.getCurOutputSlotPorttype = function (card, port) {
        var cmd;
        cmd = String.format("/setwinbyinslot:d,%d,%d;", card, port);
        that.send(cmd);
        return 0;
    };

    this.getLastOutputSlotPorttype = function (card, port) {
        var cmd;
        cmd = String.format("/setlastOutputSlotPorttype:d,%d,%d;", card, port);
        that.send(cmd);
        return 0;
    };

    this.getgLoadOutputSlotPorttype = function (card, port) {
        var cmd;
        cmd = String.format("/setgLoadOutputSlotPorttype:d,%d,%d;", card, port);
        that.send(cmd);
        return 0;
    };

    this.setCurOutputSlotPortbright = function (card, port, param) {
        var cmd;
        cmd = String.format("/setCurOutputSlotPortbright:d,%d,%d,%d;", card, port, param);
        that.send(cmd);
        return 0;
    };

    this.setlastOutputSlotPortbright = function (card, port, param) {
        var cmd;
        cmd = String.format("/setlastOutputSlotPortbright:d,%d,%d,%d;", card, port, param);
        that.send(cmd);
        return 0;
    };

    this.setgLoadOutputSlotPortbright = function (card, port, param) {
        var cmd;
        cmd = String.format("/setgLoadOutputSlotPortbright:d,%d,%d,%d;", card, port, param);
        that.send(cmd);
        return 0;
    };

    this.setCurOutputSlotPortX = function (card, port, param) {
        var cmd;
        cmd = String.format("/setCurOutputSlotPortX:d,%d,%d,%d;", card, port, param);
        that.send(cmd);
        return 0;
    };

    this.setlastOutputSlotPortX = function (card, port, param) {
        var cmd;
        cmd = String.format("/setlastOutputSlotPortX:d,%d,%d,%d;", card, port, param);
        that.send(cmd);
        return 0;
    };

    this.setgLoadOutputSlotPortX = function (card, port, param) {
        var cmd;
        cmd = String.format("/setgLoadOutputSlotPortX:d,%d,%d,%d;", card, port, param);
        that.send(cmd);
        return 0;
    };

    this.setCurOutputSlotPortY = function (card, port, param) {
        var cmd;
        cmd = String.format("/setCurOutputSlotPortY:d,%d,%d,%d;", card, port, param);
        that.send(cmd);
        return 0;
    };

    this.setlastOutputSlotPortY = function (card, port, param) {
        var cmd;
        cmd = String.format("/setlastOutputSlotPortY:d,%d,%d,%d;", card, port, param);
        that.send(cmd);
        return 0;
    };

    this.setgLoadOutputSlotPortY = function (card, port, param) {
        var cmd;
        cmd = String.format("/setgLoadOutputSlotPortY:d,%d,%d,%d;", card, port, param);
        that.send(cmd);
        return 0;
    };

    this.setCurOutputSlotPortW = function (card, port, param) {
        var cmd;
        cmd = String.format("/setCurOutputSlotPortW:d,%d,%d,%d;", card, port, param);
        that.send(cmd);
        return 0;
    };

    this.setlastOutputSlotPortW = function (card, port, param) {
        var cmd;
        cmd = format("/setlastOutputSlotPortW:d,%d,%d,%d;", card, port, param);
        that.send(cmd);
        return 0;
    };

    this.setgLoadOutputSlotPortW = function (card, port, param) {
        var cmd;
        cmd = String.format("/setgLoadOutputSlotPortW:d,%d,%d,%d;", card, port, param);
        that.send(cmd);
        return 0;
    };

    this.setCurOutputSlotPortH = function (card, port, param) {
        var cmd;
        cmd = String.format("/setCurOutputSlotPortH:d,%d,%d,%d;", card, port, param);
        that.send(cmd);
        return 0;
    };

    this.setlastOutputSlotPortH = function (card, port, param) {
        var cmd;
        cmd = String.format("/setlastOutputSlotPortH:d,%d,%d,%d;", card, port, param);
        that.send(cmd);
        return 0;
    };

    this.setgLoadOutputSlotPortH = function (card, port, param) {
        var cmd;
        cmd = String.format("/setgLoadOutputSlotPortH:d,%d,%d,%d;", card, port, param);
        that.send(cmd);
        return 0;
    };

    this.setCurOutputSlotportInsert = function (card, port, param) {
        var cmd;
        cmd = String.format("/setCurOutputSlotportInsert:d,%d,%d,%d;", card, port, param);
        that.send(cmd);
        return 0;
    };

    this.setlastOutputSlotportInsert = function (card, port, param) {
        var cmd;
        cmd = String.format("/setlastOutputSlotportInsert:d,%d,%d,%d;", card, port, param);
        that.send(cmd);
        return 0;
    };

    this.setgLoadOutputSlotportInsert = function (card, port, param) {
        var cmd;
        cmd = String.format("/setgLoadOutputSlotportInsert:d,%d,%d,%d;", card, port, param);
        that.send(cmd);
        return 0;
    };

    this.setCurOutputSlotoutputnum = function (card, port, param) {
        var cmd;
        cmd = String.format("/setCurOutputSlotoutputnum:d,%d,%d,%d;", card, port, param);
        that.send(cmd);
        return 0;
    };

    this.setlastOutputSlotoutputnum = function (card, port, param) {
        var cmd;
        cmd = String.format("/setlastOutputSlotoutputnum:d,%d,%d,%d;", card, port, param);
        that.send(cmd);
        return 0;
    };

    this.setgLoadOutputSlotoutputnum = function (card, port, param) {
        var cmd;
        cmd = String.format("/setgLoadOutputSlotoutputnum:d,%d,%d,%d;", card, port, param);
        that.send(cmd);
        return 0;
    };

    this.setCurOutputSlotInsert = function (card, port, param) {
        var cmd;
        cmd = String.format("/setCurOutputSlotInsert:d,%d,%d,%d;", card, port, param);
        that.send(cmd);
        return 0;
    };

    this.setlastOutputSlotInsert = function (card, port, param) {
        var cmd;
        cmd = String.format("/setlastOutputSlotInsert:d,%d,%d,%d;", card, port, param);
        that.send(cmd);
        return 0;
    };

    this.setgLoadOutputSlotInsert = function (card, port, param) {
        var cmd;
        cmd = String.format("/setgLoadOutputSlotInsert:d,%d,%d,%d;", card, port, param);
        that.send(cmd);
        return 0;
    };

    this.getCurOutputSlotPortbright = function (card, port) {
        var cmd;
        cmd = String.format("/getCurOutputSlotPortbright:d,%d,%d;", card, port);
        that.send(cmd);
        return 0;
    };

    this.getlastOutputSlotPortbright = function (card, port) {
        var cmd;
        cmd = String.format("/getlastOutputSlotPortbright:d,%d,%d;", card, port);
        that.send(cmd);
        return 0;
    };

    this.getgLoadOutputSlotPortbright = function (card, port) {
        var cmd;
        cmd = String.format("/getgLoadOutputSlotPortbright:d,%d,%d;", card, port);
        that.send(cmd);
        return 0;
    };

    this.getCurOutputSlotPortX = function (card, port) {
        var cmd;
        cmd = String.format("/getCurOutputSlotPortX:d,%d,%d;", card, port);
        that.send(cmd);
        return 0;
    };

    this.getlastOutputSlotPortX = function (card, port) {
        var cmd;
        cmd = String.format("/getlastOutputSlotPortX:d,%d,%d;", card, port);
        that.send(cmd);
        return 0;
    };

    this.getgLoadOutputSlotPortX = function (card, port) {
        var cmd;
        cmd = String.format("/getgLoadOutputSlotPortX:d,%d,%d;", card, port);
        that.send(cmd);
        return 0;
    };

    this.getCurOutputSlotPortY = function (card, port) {
        var cmd;
        cmd = String.format("/getCurOutputSlotPortY:d,%d,%d;", card, port);
        that.send(cmd);
        return 0;
    };

    this.getlastOutputSlotPortY = function (card, port) {
        var cmd;
        cmd = String.format("/getlastOutputSlotPortY:d,%d,%d;", card, port);
        that.send(cmd);
        return 0;
    };

    this.getgLoadOutputSlotPortY = function (card, port) {
        var cmd;
        cmd = String.format("/getgLoadOutputSlotPortY:d,%d,%d;", card, port);
        that.send(cmd);
        return 0;
    };

    this.getCurOutputSlotPortW = function (card, port) {
        var cmd;
        cmd = String.format("/getCurOutputSlotPortW:d,%d,%d;", card, port);
        that.send(cmd);
        return 0;
    };

    this.getlastOutputSlotPortW = function (card, port) {
        var cmd;
        cmd = String.format("/getlastOutputSlotPortW:d,%d,%d;", card, port);
        that.send(cmd);
        return 0;
    };

    this.getgLoadOutputSlotPortW = function (card, port) {
        var cmd;
        cmd = String.format("/getgLoadOutputSlotPortW:d,%d,%d;", card, port);
        that.send(cmd);
        return 0;
    };

    this.getCurOutputSlotPortH = function (card, port) {
        var cmd;
        cmd = String.format("/getCurOutputSlotPortH:d,%d,%d;", card, port);
        that.send(cmd);
        return 0;
    };

    this.getlastOutputSlotPortH = function (card, port) {
        var cmd;
        cmd = String.format("/getlastOutputSlotPortH:d,%d,%d;", card, port);
        that.send(cmd);
        return 0;
    };

    this.getgLoadOutputSlotPortH = function (card, port) {
        var cmd;
        cmd = String.format("/getgLoadOutputSlotPortH:d,%d,%d;", card, port);
        that.send(cmd);
        return 0;
    };

    this.getCurOutputSlotportInsert = function (card, port) {
        var cmd;
        cmd = String.format("/getCurOutputSlotportInsert:d,%d,%d;", card, port);
        that.send(cmd);
        return 0;
    };

    this.getlastOutputSlotportInsert = function (card, port) {
        var cmd;
        cmd = String.format("/getlastOutputSlotportInsert:d,%d,%d;", card, port);
        that.send(cmd);
        return 0;
    };

    this.getgLoadOutputSlotportInsert = function (card, port) {
        var cmd;
        cmd = String.format("/getgLoadOutputSlotportInsert:d,%d,%d;", card, port);
        that.send(cmd);
        return 0;
    };

    this.getCurOutputSlotoutputnum = function (card, port) {
        var cmd;
        cmd = String.format("/getCurOutputSlotoutputnum:d,%d,%d;", card, port);
        that.send(cmd);
        return 0;
    };

    this.getlastOutputSlotoutputnum = function (card, port) {
        var cmd;
        cmd = String.format("/getlastOutputSlotoutputnum:d,%d,%d;", card, port);
        that.send(cmd);
        return 0;
    };

    this.getgLoadOutputSlotoutputnum = function (card, port) {
        var cmd;
        cmd = String.format("/getgLoadOutputSlotoutputnum:d,%d,%d;", card, port);
        that.send(cmd);
        return 0;
    };

    this.getCurOutputSlotInsert = function (card, port) {
        var cmd;
        cmd = String.format("/getCurOutputSlotInsert:d,%d,%d;", card, port);
        that.send(cmd);
        return 0;
    };

    this.getlastOutputSlotInsert = function (card, port) {
        var cmd;
        cmd = String.format("/getlastOutputSlotInsert:d,%d,%d;", card, port);
        that.send(cmd);
        return 0;
    };

    this.getgLoadOutputSlotInsert = function (card, port) {
        var cmd;
        cmd = String.format("/getgLoadOutputSlotInsert:d,%d,%d;", card, port);
        that.send(cmd);
        return 0;
    };
    //         /////////////////获取整体的输出//////////////////
    //         else if(isCmdStr(cmd,"getgCurOutput" ))
    //        {
    //
    //            GetOutput(cmd,&gCurOutputSlot);
    //        };
    //        else if(isCmdStr(cmd,"getglastOutput" ))
    //        {
    //           GetOutput(cmd,&gLastOutputSlot);
    //        };
    //        else if(isCmdStr(cmd,"getgLoadOutput" ))
    //        {
    //				  GetOutput(cmd,&gLoadOutputSlot);
    //        };
    //         else if(isCmdStr(cmd,"setgCurOutput" ))
    //        {
    //				  SetOutput(cmd,&gCurOutputSlot);
    //        };
    //        else if(isCmdStr(cmd,"setglastOutput" ))
    //        {
    //           SetOutput(cmd,&gLastOutputSlot);
    //        };
    //        else if(isCmdStr(cmd,"setgLoadOutput" ))
    //        {
    //					 SetOutput(cmd,&gLoadOutputSlot);
    //        };

    this.getgCurOutputCardById = function (id) {
        var cmd;
        cmd = String.format("/getgCurOutputCard:d,%d;", id);
        return that.reciveList(cmd);

    };

    /**
     * ******************************************************************************************************
     */
    //////
    this.seturtimingId = function (id) {
        var cmd;
        cmd = String.format("/setCurtimingId:d,%d,%d;", id);
        that.send(cmd);
        return 0;
    };

    this.CheckOpenWinEn = function (id) {
        var cmd;
        cmd = String.format("/isValidWindowById:d,%d;", id);
        return that.recive(cmd);
    };

    this.getCurtimingId = function (id) {
        var cmd;
        var ack;
        cmd = String.format("/getCurtimingId:d,%d;", id);
        return that.recive(cmd);
    };

    /////////
    this.settimingbytotal_pixel = function (id, param) {
        var cmd;
        cmd = String.format("/settimingbytotal_pixel:d,%d,%d;", id, param);
        that.send(cmd);
        return 0;
    };

    this.gettimingbytotal_pixel = function (id) {
        var cmd;
        var ack;
        cmd = String.format("/gettimingbytotal_pixel:d,%d;", id);
        return that.recive(cmd);
    };

    this.settimingbyH_sync_width = function (id, param) {
        var cmd;
        cmd = String.format("/settimingbyH_sync_width:d,%d,%d;", id, param);
        that.send(cmd);
        return 0;
    };

    this.gettimingbyH_sync_width = function (id) {
        var cmd;
        var ack;
        cmd = String.format("/gettimingbyH_sync_width:d,%d;", id);
        return that.recive(cmd);
    };

    this.settimingbyH_active_start = function (id, param) {
        var cmd;
        cmd = String.format("/settimingbyH_active_start:d,%d,%d;", id, param);
        that.send(cmd);
        return 0;
    };

    this.gettimingbyH_active_start = function (id) {
        var cmd;
        var ack;
        cmd = String.format("/gettimingbyH_active_start:d,%d;", id);
        return that.recive(cmd);
    };

    this.settimingbyH_active_size = function (id, param) {
        var cmd;
        cmd = String.format("/settimingbyH_active_size:d,%d,%d;", id, param);
        that.send(cmd);
        return 0;
    };

    this.gettimingbyH_active_size = function (id) {
        var cmd;
        var ack;
        cmd = String.format("/gettimingbyH_active_size:d,%d;", id);
        return that.recive(cmd);
    };

    this.settimingbyH_sync_pol = function (id, param) {
        var cmd;
        cmd = String.format("/settimingbyH_sync_pol:d,%d,%d;", id, param);
        that.send(cmd);
        return 0;
    };

    this.gettimingbyH_sync_pol = function (id) {
        var cmd;
        var ack;
        cmd = String.format("/gettimingbyH_sync_pol:d,%d;", id);
        return that.recive(cmd);
    };

    this.settimingbytotal_line = function (id, param) {
        var cmd;
        cmd = String.format("/settimingbytotal_line:d,%d,%d;", id, param);
        that.send(cmd);
        return 0;
    };

    this.gettimingbytotal_line = function (id) {
        var cmd;
        var ack;
        cmd = String.format("/gettimingbytotal_line:d,%d;", id);
        return that.recive(cmd);
    };

    this.settimingbyV_sync_width = function (id, param) {
        var cmd;
        cmd = String.format("/settimingbyV_sync_width:d,%d,%d;", id, param);
        that.send(cmd);
        return 0;
    };

    this.gettimingbyV_sync_width = function (id) {
        var cmd;
        var ack;
        cmd = String.format("/gettimingbyV_sync_width:d,%d;", id);
        return that.recive(cmd);
    };

    this.settimingbyV_active_start = function (id, param) {
        var cmd;
        cmd = String.format("/settimingbyV_active_start:d,%d,%d;", id, param);
        that.send(cmd);
        return 0;
    };

    this.gettimingbyV_active_start = function (id) {
        var cmd;
        var ack;
        cmd = String.format("/gettimingbyV_active_start:d,%d;", id);
        return that.recive(cmd);
    };

    this.settimingbyV_active_size = function (id, param) {
        var cmd;
        cmd = String.format("/settimingbyV_active_size:d,%d,%d;", id, param);
        that.send(cmd);
        return 0;
    };

    this.gettimingbyV_active_size = function (id) {
        var cmd;
        var ack;
        cmd = String.format("/gettimingbyV_active_size:d,%d;", id);
        return that.recive(cmd);
    };

    this.settimingbyV_sync_pol = function (id, param) {
        var cmd;
        cmd = String.format("/settimingbyV_sync_pol:d,%d,%d;", id, param);
        that.send(cmd);
        return 0;
    };

    this.gettimingbyV_sync_pol = function (id) {
        var cmd;
        var ack;
        cmd = String.format("/gettimingbyV_sync_pol:d,%d;", id);
        return that.recive(cmd);
    };

    this.settiming = function (id, total_pixel, H_sync_width, H_active_start, H_active_size, H_sync_pol,
        total_line, V_sync_width, V_active_start, V_active_size, V_sync_pol, rate) {
        var cmd;
        cmd = String.format("/settiming:d,%d,%d,%d,%d,%d,%d,%d,%d,%d,%d,%d,%d;",
            id, total_pixel, H_sync_width, H_active_start, H_active_size, H_sync_pol, total_line, V_sync_width, V_active_start, V_active_size, V_sync_pol, rate);

        that.send(cmd);
        return 0;
    };

    this.gettiming = function (id) {
        var cmd;
        var ack;
        cmd = String.format("/gettiming:d,%d;", id);
        return that.recive(cmd);
    };

    /**
     * ******************************************************************************************************
     */
    this.setgCurInputSlotbytype = function (card, port, param) {
        var cmd;
        cmd = String.format("/setgCurInputSlotbytype:d,%d,%d,%d;", card, port, param);
        that.send(cmd);
        return 0;
    };

    this.setgLastInputSlotbytype = function (card, port, param) {
        var cmd;
        cmd = String.format("/setgLastInputSlotbytype:d,%d,%d,%d;", card, port, param);
        that.send(cmd);
        return 0;
    };

    this.setgLoadInputSlotbytype = function (card, port, param) {
        var cmd;
        cmd = String.format("/setgLoadInputSlotbytype:d,%d,%d,%d;", card, port, param);
        that.send(cmd);
        return 0;
    };

    this.setgCurInputSlotbysigWidth = function (card, port, param) {
        var cmd;
        cmd = String.format("/setgCurInputSlotbysigWidth:d,%d,%d,%d;", card, port, param);
        that.send(cmd);
        return 0;
    };

    this.setgLastInputSlotbysigWidth = function (card, port, param) {
        var cmd;
        cmd = String.format("/setgLastInputSlotbysigWidth:d,%d,%d,%d;", card, port, param);
        that.send(cmd);
        return 0;
    };

    this.setgLoadInputSlotbysigWidth = function (card, port, param) {
        var cmd;
        cmd = String.format("/setgLoadInputSlotbysigWidth:d,%d,%d,%d;", card, port, param);
        that.send(cmd);
        return 0;
    };

    this.setgCurInputSlotbysigHeight = function (card, port, param) {
        var cmd;
        cmd = String.format("/setgCurInputSlotbysigHeight:d,%d,%d,%d;", card, port, param);
        that.send(cmd);
        return 0;
    };

    this.setgLastInputSlotbysigHeight = function (card, port, param) {
        var cmd;
        cmd = String.format("/setgLastInputSlotbysigHeight:d,%d,%d,%d;", card, port, param);
        that.send(cmd);
        return 0;
    };

    this.setgLoadInputSlotbysigHeight = function (card, port, param) {
        var cmd;
        cmd = String.format("/setgLoadInputSlotbysigHeight:d,%d,%d,%d;", card, port, param);
        that.send(cmd);
        return 0;
    };

    this.setgCurInputSlotbysigRate = function (card, port, param) {
        var cmd;
        cmd = String.format("/setgCurInputSlotbysigRate:d,%d,%d,%d;", card, port, param);
        that.send(cmd);
        return 0;
    };

    this.setgLastInputSlotbysigRate = function (card, port, param) {
        var cmd;
        cmd = String.format("/setgLastInputSlotbysigRate:d,%d,%d,%d;", card, port, param);
        that.send(cmd);
        return 0;
    };

    this.setgLoadInputSlotbysigRate = function (card, port, param) {
        var cmd;
        cmd = String.format("/setgLoadInputSlotbysigRate:d,%d,%d,%d;", card, port, param);
        that.send(cmd);
        return 0;
    };

    this.setgCurInputSlotbyfreeze = function (card, port, param) {
        var cmd;
        cmd = String.format("/setgCurInputSlotbyfreeze:d,%d,%d,%d;", card, port, param);
        that.send(cmd);
        return 0;
    };

    this.setgLastInputSlotbyfreeze = function (card, port, param) {
        var cmd;
        cmd = String.format("/setgLastInputSlotbyfreeze:d,%d,%d,%d;", card, port, param);
        that.send(cmd);
        return 0;
    };

    this.setgLoadInputSlotbyfreeze = function (card, port, param) {
        var cmd;
        cmd = String.format("/setgLoadInputSlotbyfreeze:d,%d,%d,%d;", card, port, param);
        that.send(cmd);
        return 0;
    };

    this.setgCurInputSlotbycutx = function (card, port, param) {
        var cmd;
        cmd = String.format("/setgCurInputSlotbycutx:d,%d,%d,%d;", card, port, param);
        that.send(cmd);
        return 0;
    };

    this.setgLastInputSlotbycutx = function (card, port, param) {
        var cmd;
        cmd = String.format("/setgLastInputSlotbycutx:d,%d,%d,%d;", card, port, param);
        that.send(cmd);
        return 0;
    };

    this.setgLoadInputSlotbycutx = function (card, port, param) {
        var cmd;
        cmd = String.format("/setgLoadInputSlotbycutx:d,%d,%d,%d;", card, port, param);
        that.send(cmd);
        return 0;
    };

    this.setgCurInputSlotbycuty = function (card, port, param) {
        var cmd;
        cmd = String.format("/setgCurInputSlotbycuty:d,%d,%d,%d;", card, port, param);
        that.send(cmd);
        return 0;
    };

    this.setgLastInputSlotbycuty = function (card, port, param) {
        var cmd;
        cmd = String.format("/setgLastInputSlotbycuty:d,%d,%d,%d;", card, port, param);
        that.send(cmd);
        return 0;
    };

    this.setgLoadInputSlotbycuty = function (card, port, param) {
        var cmd;
        cmd = String.format("/setgLoadInputSlotbycuty:d,%d,%d,%d;", card, port, param);
        that.send(cmd);
        return 0;
    };

    this.setgCurInputSlotbycutw = function (card, port, param) {
        var cmd;
        cmd = String.format("/setgCurInputSlotbycutw:d,%d,%d,%d;", card, port, param);
        that.send(cmd);
        return 0;
    };

    this.setgLastInputSlotbycutw = function (card, port, param) {
        var cmd;
        cmd = String.format("/setgLastInputSlotbycutw:d,%d,%d,%d;", card, port, param);
        that.send(cmd);
        return 0;
    };

    this.setgLoadInputSlotbycutw = function (card, port, param) {
        var cmd;
        cmd = String.format("/setgLoadInputSlotbycutw:d,%d,%d,%d;", card, port, param);
        that.send(cmd);
        return 0;
    };

    this.setgCurInputSlotbycuth = function (card, port, param) {
        var cmd;
        cmd = String.format("/setgCurInputSlotbycuth:d,%d,%d,%d;", card, port, param);
        that.send(cmd);
        return 0;
    };

    this.setgLastInputSlotbycuth = function (card, port, param) {
        var cmd;
        cmd = String.format("/setgLastInputSlotbycuth:d,%d,%d,%d;", card, port, param);
        that.send(cmd);
        return 0;
    };

    this.setgLoadInputSlotbycuth = function (card, port, param) {
        var cmd;
        cmd = String.format("/setgLoadInputSlotbycuth:d,%d,%d,%d;", card, port, param);
        that.send(cmd);
        return 0;
    };

    this.setgCurInputportInsert = function (card, port, param) {
        var cmd;
        cmd = String.format("/setgCurInputportInsert:d,%d,%d,%d;", card, port, param);
        that.send(cmd);
        return 0;
    };

    this.setgLastInputportInsert = function (card, port, param) {
        var cmd;
        cmd = String.format("/setgLastInputportInsert:d,%d,%d,%d;", card, port, param);
        that.send(cmd);
        return 0;
    };

    this.setgLoadInputportInsert = function (card, port, param) {
        var cmd;
        cmd = String.format("/setgLoadInputportInsert:d,%d,%d,%d;", card, port, param);
        that.send(cmd);
        return 0;
    };

    this.setgCurInputinputnum = function (card, port, param) {
        var cmd;
        cmd = String.format("/setgCurInputinputnum:d,%d,%d,%d;", card, port, param);
        that.send(cmd);
        return 0;
    };

    this.setgLastInputinputnum = function (card, port, param) {
        var cmd;
        cmd = String.format("/setgLastInputinputnum:d,%d,%d,%d;", card, port, param);
        that.send(cmd);
        return 0;
    };

    this.setgLoadInputinputnum = function (card, port, param) {
        var cmd;
        cmd = String.format("/setgLoadInputinputnum:d,%d,%d,%d;", card, port, param);
        that.send(cmd);
        return 0;
    };

    this.setgCurInputslotInsert = function (card, port, param) {
        var cmd;
        cmd = String.format("/setgCurInputslotInsert:d,%d,%d,%d;", card, port, param);
        that.send(cmd);
        return 0;
    };

    this.setgLastInputslotInsert = function (card, port, param) {
        var cmd;
        cmd = String.format("/setgLastInputslotInsert:d,%d,%d,%d;", card, port, param);
        that.send(cmd);
        return 0;
    };

    this.setgLoadInputslotInsert = function (card, port, param) {
        var cmd;
        cmd = String.format("/setgLoadInputslotInsert:d,%d,%d,%d;", card, port, param);
        that.send(cmd);
        return 0;
    };

    this.setgCurInputslotnum = function (card, port, param) {
        var cmd;
        cmd = String.format("/setgCurInputslotnum:d,%d,%d,%d;", card, port, param);
        that.send(cmd);
        return 0;
    };

    this.setgLastInputslotnum = function (card, port, param) {
        var cmd;
        cmd = String.format("/setgLastInputslotnum:d,%d,%d,%d;", card, port, param);
        that.send(cmd);
        return 0;
    };

    this.setgLoadInputslotnum = function (card, port, param) {
        var cmd;
        cmd = String.format("/setgLoadInputslotnum:d,%d,%d,%d;", card, port, param);
        that.send(cmd);
        return 0;
    };
    //

    this.getgCurInputSlotbytype = function (card, port) {
        var cmd;
        cmd = String.format("/getgCurInputSlotbytype:d,%d,%d;", card, port);
        that.send(cmd);
        return 0;
    };

    this.getgLastInputSlotbytype = function (card, port) {
        var cmd;
        cmd = String.format("/getgLastInputSlotbytype:d,%d,%d;", card, port);
        that.send(cmd);
        return 0;
    };

    this.getgLoadInputSlotbytype = function (card, port) {
        var cmd;
        cmd = String.format("/getgLoadInputSlotbytype:d,%d,%d;", card, port);
        that.send(cmd);
        return 0;
    };

    this.getgCurInputSlotbysigWidth = function (card, port) {
        var cmd;
        cmd = String.format("/getgCurInputSlotbysigWidth:d,%d,%d;", card, port);
        that.send(cmd);
        return 0;
    };

    this.getgLastInputSlotbysigWidth = function (card, port) {
        var cmd;
        cmd = String.format("/getgLastInputSlotbysigWidth:d,%d,%d;", card, port);
        that.send(cmd);
        return 0;
    };

    this.getgLoadInputSlotbysigWidth = function (card, port) {
        var cmd;
        cmd = String.format("/getgLoadInputSlotbysigWidth:d,%d,%d;", card, port);
        that.send(cmd);
        return 0;
    };

    this.getgCurInputSlotbysigHeight = function (card, port) {
        var cmd;
        cmd = String.format("/getgCurInputSlotbysigHeight:d,%d,%d;", card, port);
        that.send(cmd);
        return 0;
    };

    this.getgLastInputSlotbysigHeight = function (card, port) {
        var cmd;
        cmd = String.format("/getgLastInputSlotbysigHeight:d,%d,%d;", card, port);
        that.send(cmd);
        return 0;
    };

    this.getgLoadInputSlotbysigHeight = function (card, port) {
        var cmd;
        cmd = String.format("/getgLoadInputSlotbysigHeight:d,%d,%d;", card, port);
        that.send(cmd);
        return 0;
    };

    this.getgCurInputSlotbysigRate = function (card, port) {
        var cmd;
        cmd = String.format("/getgCurInputSlotbysigRate:d,%d,%d;", card, port);
        that.send(cmd);
        return 0;
    };

    this.getgLastInputSlotbysigRate = function (card, port) {
        var cmd;
        cmd = String.format("/getgLastInputSlotbysigRate:d,%d,%d;", card, port);
        that.send(cmd);
        return 0;
    };

    this.getgLoadInputSlotbysigRate = function (card, port) {
        var cmd;
        cmd = String.format("/getgLoadInputSlotbysigRate:d,%d,%d;", card, port);
        that.send(cmd);
        return 0;
    };

    this.getgCurInputSlotbyfreeze = function (card, port) {
        var cmd;
        cmd = String.format("/getgCurInputSlotbyfreeze:d,%d,%d;", card, port);
        that.send(cmd);
        return 0;
    };

    this.getgLastInputSlotbyfreeze = function (card, port) {
        var cmd;
        cmd = String.format("/getgLastInputSlotbyfreeze:d,%d,%d;", card, port);
        that.send(cmd);
        return 0;
    };

    this.getgLoadInputSlotbyfreeze = function (card, port) {
        var cmd;
        cmd = String.format("/getgLoadInputSlotbyfreeze:d,%d,%d;", card, port);
        that.send(cmd);
        return 0;
    };

    this.getgCurInputSlotbycutx = function (card, port) {
        var cmd;
        cmd = String.format("/getgCurInputSlotbycutx:d,%d,%d;", card, port);
        that.send(cmd);
        return 0;
    };

    this.getgLastInputSlotbycutx = function (card, port) {
        var cmd;
        cmd = String.format("/getgLastInputSlotbycutx:d,%d,%d;", card, port);
        that.send(cmd);
        return 0;
    };

    this.getgLoadInputSlotbycutx = function (card, port) {
        var cmd;
        cmd = String.format("/getgLoadInputSlotbycutx:d,%d,%d;", card, port);
        that.send(cmd);
        return 0;
    };

    this.getgCurInputSlotbycuty = function (card, port) {
        var cmd;
        cmd = String.format("/getgCurInputSlotbycuty:d,%d,%d;", card, port);
        that.send(cmd);
        return 0;
    };

    this.getgLastInputSlotbycuty = function (card, port) {
        var cmd;
        cmd = String.format("/getgLastInputSlotbycuty:d,%d,%d;", card, port);
        that.send(cmd);
        return 0;
    };

    this.getgLoadInputSlotbycuty = function (card, port) {
        var cmd;
        cmd = String.format("/getgLoadInputSlotbycuty:d,%d,%d;", card, port);
        that.send(cmd);
        return 0;
    };

    this.getgCurInputSlotbycutw = function (card, port) {
        var cmd;
        cmd = String.format("/getgCurInputSlotbycutw:d,%d,%d;", card, port);
        that.send(cmd);
        return 0;
    };

    this.getgLastInputSlotbycutw = function (card, port) {
        var cmd;
        cmd = String.format("/getgLastInputSlotbycutw:d,%d,%d;", card, port);
        that.send(cmd);
        return 0;
    };

    this.getgLoadInputSlotbycutw = function (card, port) {
        var cmd;
        cmd = String.format("/getgLoadInputSlotbycutw:d,%d,%d;", card, port);
        that.send(cmd);
        return 0;
    };

    this.getgCurInputSlotbycuth = function (card, port) {
        var cmd;
        cmd = String.format("/getgCurInputSlotbycuth:d,%d,%d;", card, port);
        that.send(cmd);
        return 0;
    };

    this.getgLastInputSlotbycuth = function (card, port) {
        var cmd;
        cmd = String.format("/getgLastInputSlotbycuth:d,%d,%d;", card, port);
        that.send(cmd);
        return 0;
    };

    this.getgLoadInputSlotbycuth = function (card, port) {
        var cmd;
        cmd = String.format("/getgLoadInputSlotbycuth:d,%d,%d;", card, port);
        that.send(cmd);
        return 0;
    };

    this.getgCurInputportInsert = function (card, port) {
        var cmd;
        cmd = String.format("/getgCurInputportInsert:d,%d,%d;", card, port);
        that.send(cmd);
        return 0;
    };

    this.getgLastInputportInsert = function (card, port) {
        var cmd;
        cmd = String.format("/getgLastInputportInsert:d,%d,%d;", card, port);
        that.send(cmd);
        return 0;
    };

    this.getgLoadInputportInsert = function (card, port) {
        var cmd;
        cmd = String.format("/getgLoadInputportInsert:d,%d,%d;", card, port);
        that.send(cmd);
        return 0;
    };

    this.getgCurInputinputnum = function (card, port) {
        var cmd;
        cmd = String.format("/getgCurInputinputnum:d,%d,%d;", card, port);
        that.send(cmd);
        return 0;
    };

    this.getgLastInputinputnum = function (card, port) {
        var cmd;
        cmd = String.format("/getgLastInputinputnum:d,%d,%d;", card, port);
        that.send(cmd);
        return 0;
    };

    this.getgLoadInputinputnum = function (card, port) {
        var cmd;
        cmd = String.format("/getgLoadInputinputnum:d,%d,%d;", card, port);
        that.send(cmd);
        return 0;
    };

    this.getgCurInputslotInsert = function (card, port) {
        var cmd;
        cmd = String.format("/getgCurInputslotInsert:d,%d,%d;", card, port);
        that.send(cmd);
        return 0;
    };

    this.getgLastInputslotInsert = function (card, port) {
        var cmd;
        cmd = String.format("/getgLastInputslotInsert:d,%d,%d;", card, port);
        that.send(cmd);
        return 0;
    };

    this.getgLoadInputslotInsert = function (card, port) {
        var cmd;
        cmd = String.format("/getgLoadInputslotInsert:d,%d,%d;", card, port);
        that.send(cmd);
        return 0;
    };

    this.getgCurInputslotnum = function (card, port) {
        var cmd;
        cmd = String.format("/getgCurInputslotnum:d,%d,%d;", card, port);
        that.send(cmd);
        return 0;
    };

    this.getgLastInputslotnum = function (card, port) {
        var cmd;
        cmd = String.format("/getgLastInputslotnum:d,%d,%d;", card, port);
        that.send(cmd);
        return 0;
    };

    this.getgLoadInputslotnum = function (card, port) {
        var cmd;
        cmd = String.format("/getgLoadInputslotnum:d,%d,%d;", card, port);
        that.send(cmd);
        return 0;
    };

    ////////////////////////////////////////////////////////////////////////////
    this.wrMainLicense = function (mainLicense) {
        that.send("/wrmainlic:s," + mainLicense + ";");
    };

    this.wrSubLicense = function (subLicense) {
        that.send("/wrsublic:s," + subLicense + ";");
    };

    this.rdMainLicense = function () {
        that.send("/wrmainlic:s,0;");
    };

    this.rdSubLicense = function () {

        var cmd;
        cmd = String.format("/rdsublic:s,%d;", 0);
        return that.reciveString(cmd);

    };
    //获取二级授权时间   /getAdminMode:d,1;

    this.rdCpusn = function () {

        var cmd;
        cmd = String.format("/rdcpusn:s,%d;", 0);
        var ret = that.reciveString(cmd);

        return ret;
    };

    this.rdExpiration = function () {

        var cmd;
        cmd = String.format("/expiration:s,%d;", 0);
        return that.reciveString(cmd);
    };

    this.rdtime = function () {

        var cmd;
        cmd = String.format("/rdtime:s,%d;", 0);
        return that.reciveString(cmd);
    };

    this.rddate = function () {

        var cmd;
        cmd = String.format("/rddate:s,%d;", 0);
        return that.reciveString(cmd);
    };

    this.rddatetime = function () {

        var cmd;
        cmd = String.format("/expiration:s,%d;", 0);
        return that.reciveString(cmd);
    };

    this.wrDateTime = function () {

        var mydate = new Date();//可以对每个时间域单独修改

        var year = mydate.getFullYear();
        var month = mydate.getMonth() + 1;
        var date = mydate.getDate();
        var hour = mydate.getHours();
        var minute = mydate.getMinutes;
        var second = mydate.getSeconds;

        that.send("/wrdatetime:d," + year + "," + month + "," + date + "," + hour + "," + minute + "," + second + ";");
    };

    /////////////////获取整体的输入//////////////////
    //         else if(isCmdStr(cmd,"getgCurInput" ))
    //        {
    //
    //            GetInput(cmd,&gCurInputSlot);
    //        };
    //        else if(isCmdStr(cmd,"getglastInput" ))
    //        {
    //           GetInput(cmd,&gLastInputSlot);
    //        };
    //        else if(isCmdStr(cmd,"getgLoadInput" ))
    //        {
    //				  GetInput(cmd,&gLoadInputSlot);
    //        };
    //         else if(isCmdStr(cmd,"setgCurInput" ))
    //        {
    //				  SetInput(cmd,&gCurInputSlot);
    //        };
    //        else if(isCmdStr(cmd,"setglastInput" ))
    //        {
    //           SetInput(cmd,&gLastInputSlot);
    //        };
    //        else if(isCmdStr(cmd,"setgLoadInput" ))
    //        {
    //			SetInput(cmd,&gLoadInputSlot);
    //        };
    this.getgCurInputCardById = function (id) {//获取指定输入卡的状态
        var cmd;
        cmd = String.format("/getgCurInputCard:d,%d;", id);
        return that.reciveList(cmd);

    };

    this.getgCurStart = function () {//查询默认启动场景
        var cmd;
        cmd = String.format("/getstart:d,%d;", 0);
        return that.reciveList(cmd);

    };

    this.setgCurStart = function (n) {//这个指令是写入默认启动场景吗？和setstartfrom有啥区别？
        var cmd;
        cmd = String.format("/setstart:d,%d;", n);
        that.send(cmd);
        return 0;

    };

    /**
     * ******************************************************************************************************
     */
    this.setgCurScreenById = function (ugid, id, outslot, outport, type, bright, Screenx, Screeny, Screenw, Screenh) {
        var i = 0;
        // var saveid = id > 0 ? id - 1 : 0;
        var cmd;
        cmd = String.format("/SetgCurScreen:d,%d,%d,%d,%d,%d,%d,%d,%d,%d,%d;", ugid, id, outslot, outport, type, bright, Screenx, Screeny, Screenw, Screenh);
        that.send(cmd);
        return i;

    };

    this.getgCurScreenById = function (id) {
        var cmd;
        cmd = String.format("/getgCurScreen:d,%d;", id);
        return that.reciveList(cmd);

    };

    this.resetAllScreens = function (ugid) {
        var cmd;
        cmd = String.format("/resetAllScreens:d,%d;", ugid);
        that.send(cmd);
        return 0;
    };

    //////////////////////////////////////////////////////////
    this.saveToDevAndStart = function (n) {
        var cmd;
        cmd = String.format("/saveandstart:d,%d;", n);
        that.send(cmd);
        return 0;
    };

    this.saveToDev = function (n) {
        var cmd;
        cmd = String.format("/save:d,%d;", n);
        that.send(cmd);
        return 0;
    };

    this.saveToDevAndCheck = function (n, flag) {
        if (flag == 1) {
            var cmd;
            cmd = String.format("/saveandstart:d,%d;", n);
            var ret = that.recive(cmd);
            return ret;
        } else {
            var cmd;
            cmd = String.format("/save:d,%d;", n);
            var ret = that.recive(cmd);
            return ret;
        }
    };

    this.deleteScene = function (n) {
        var cmd;
        cmd = String.format("/deleteScene:d,%d;", n);
        that.send(cmd);
        return 0;
    };

    this.loadFromDevAndStart = function (n) {
        var cmd;
        cmd = String.format("/loadandstart:d,%d;", n);
        that.send(cmd);
        return 0;
    };

    this.setDevStartFrom = function (n) {
        var cmd;
        cmd = String.format("/startfrom:d,%d;", n);
        that.send(cmd);
        return 0;
    };

    this.loadFromDev = function (n) {
        var cmd;
        cmd = String.format("/load:d,%d;", n);
        that.send(cmd);
        return 0;
    };

    this.setThePortBright = function (slot, port, n) {//设置当前接口的亮度值
        var cmd;
        cmd = String.format("/setbright:d,%d,%d,%d;", slot, port, n);
        that.send(cmd);
        return 0;
    };

    this.setAllPortBright = function (n) {
        var cmd;
        cmd = String.format("/setAllbright:d,%d;", n);
        that.send(cmd);
        return 0;
    };

    this.setUserAdjTime = function (y, m, d, h, min, s) {
        var cmd;
        cmd = String.format("/userAdjTime:d,%d,%d,%d,%d,%d,%d;", y, m, d, h, min, s);
        that.send(cmd);
        return 0;
    };

    this.getTimeByUserAdj = function () {
        var cmd;
        cmd = String.format("/getTimeByUserAdj:d,%d;", 1);
        return that.reciveList(cmd);

    };

    this.getCardPortBright = function (id) {
        var cmd;
        cmd = String.format("/getCardPortBright:d,%d;", id);
        return that.reciveList(cmd);

    };

    //this.readDatasFromDev = function (n) {
    //    var cmd;
    //    cmd = String.format("/readDatas:d,%d;", n);
    //    return that.reciveDatas(cmd);

    //};

    this.readCurDatasFromDev = function () {
        var cmd;
        cmd = String.format("/curDatas:d,%d;", 0);
        return that.reciveDatas(cmd);

    };
    //////////////////////////////////////////////////////////////

    this.readCurPortNameFromDev = function (n) {
        var cmd;
        cmd = String.format("/getPortName:d,%d;", n);
        return that.reciveString(cmd);

    };

    this.writeCurPortNameToDev = function (n, s) {
        try {
            var cmd;

            var tmps = utf8stringToByte(s);


            cmd = String.format("/setPortName:d,%d,%d,%d,%d,%d,%d,%d,%d,%d,%d,%d,%d,%d,%d,%d,%d,%d;",
                n,
                tmps[0], tmps[1], tmps[2], tmps[3],
                tmps[4], tmps[5], tmps[6], tmps[7],
                tmps[8], tmps[9], tmps[10], tmps[11],
                tmps[12], tmps[13], tmps[14], tmps[15]
            );
            that.send(cmd);

        } catch (ex) {
            // Logger.getLogger(Protocal.class.getName()).log(Level.SEVERE, null, ex);
        }

    };

    /////////////////////////////////////////////////////////
    this.readCurSceneNameFromDev = function (n) {
        var cmd;
        cmd = String.format("/getSceneName:d,%d;", n);
        return that.reciveString(cmd);

    };

    this.writeCurSceneNameToDev = function (n, s) {
        try {
            var cmd;


            var tmps = utf8stringToByte(s);

            cmd = String.format("/setSceneName:d,%d,%d,%d,%d,%d,%d,%d,%d,%d,%d,%d,%d,%d,%d,%d,%d,%d;",
                n,
                tmps[0], tmps[1], tmps[2], tmps[3],
                tmps[4], tmps[5], tmps[6], tmps[7],
                tmps[8], tmps[9], tmps[10], tmps[11],
                tmps[12], tmps[13], tmps[14], tmps[15]
            );
            that.send(cmd);
        } catch (ex) {
            // Logger.getLogger(Protocal.class.getName()).log(Level.SEVERE, null, ex);
        }

    };

    this.resetdev = function () {
        var cmd;
        cmd = String.format("/resetdev:d,%d;", 0);
        that.send(cmd);
    };

    this.getresetdev = function () {
        var cmd;
        cmd = String.format("/getresetdev:d,%d;", 0);
        var ret = that.recive(cmd);
        return ret;
    };

    /////////////////////////////////////////////////////////
    this.readInputFpgaCardStatus = function (slot)//当前
    {
        var cmd;
        cmd = String.format("/readInputFpgaCardStatus:d,%d;", slot);
        var ret = that.recive(cmd);
        return ret;

    };

    this.readOutputFpgaCardStatus = function (slot)//当前
    {
        var cmd;
        cmd = String.format("/readOutputFpgaCardStatus:d,%d;", slot);
        var ret = that.recive(cmd);
        return ret;

    };
    //////////////////////////////////////////////////////////////////////////////

    this.checkCtrlCardAllItem = function () {
        var cmd;
        cmd = String.format("/checkCtrlCardAllItem:d,%d;", 0);
        var ret = that.recive(cmd);
        return ret;

    };

    this.checkInCardAllItem = function (slot, ch) {//这是查输出卡
        var cmd;
        cmd = String.format("/checkInCardAllItem:d,%d,%d;", slot, ch);
        return that.reciveList(cmd);

    };

    this.checkOutCardAllItem = function (slot, ch) {
        var cmd;
        cmd = String.format("/checkOutCardAllItem:d,%d,%d;", slot, ch);
        return that.reciveList(cmd);

    };

    ///////////////////////////////////////////////////////////////////////////////
    this.readInputCardRcvSndClock = function (card) {
        var cmd;
        cmd = String.format("/readInputCardRcvSndClock:d,%d;", card);
        return that.reciveList(cmd);

    };

    this.readInputCardDisplayClock = function (card) {
        var cmd;
        cmd = String.format("/readInputCardDisplayClock:d,%d;", card);
        return that.reciveList(cmd);

    };

    this.readInputCardSyncClock = function (card) {
        var cmd;
        cmd = String.format("/readInputCardSyncClock:d,%d;", card);
        return that.reciveList(cmd);

    };

    this.readOutputCardRcvSndClock = function (card) {
        var cmd;
        cmd = String.format("/readOutputCardRcvSndClock:d,%d;", card);
        return that.reciveList(cmd);

    };

    this.readOutputCardDisplayClock = function (card) {
        var cmd;
        cmd = String.format("/readOutputCardDisplayClock:d,%d;", card);
        return that.reciveList(cmd);

    };

    this.readOutputCardDataBusClock = function (card) {
        var cmd;
        cmd = String.format("/readOutputCardDataBusClock:d,%d;", card);
        return that.reciveList(cmd);

    };

    this.readOutputCardSyncClock = function (card) {
        var cmd;
        cmd = String.format("/readOutputCardSyncClock:d,%d;", card);
        return that.reciveList(cmd);

    };
    //////////////////////////////////////////////////////////////////////////////

    this.testOutputFpgaCard = function (r, g, b, mode, en)//当前
    {
        var cmd;
        cmd = String.format("/testOutputFpgaCard:d,%d,%d,%d,%d,%d;", r, g, b, mode, en);
        that.send(cmd);
    };

    this.wrFunLicense = function (lic) {
        var cmd;
        cmd = String.format("/wrfunlic:s," + lic + ";");
        that.send(cmd);
    };

    this.getFunLicense = function () {//查询设备的授权信息 查看设备支持哪些功能
        var cmd;
        cmd = String.format("/getfunlic:d,%d;", 1);
        return that.reciveList(cmd);

    };

    this.getPreviewFirst = function () {
        var cmd;
        cmd = String.format("/previewFirst:d,%d;", 1);
        return that.reciveList(cmd);

    };

    this.getPreviewOut = function () {//预监？
        var cmd;
        cmd = String.format("/previewOut:d,%d;", 1);
        return that.reciveList(cmd);

    };

    this.setPreviewWindow = function (id, winx, winy, winw, winh,
        cropx, cropy, cropw, croph, cropen,
        alpha, z, source, inslot, inport, freeze) {
        var cmd;
        var ack;
        var saveid = id > 0 ? id - 1 : 0;
        cmd = String.format("/setPreview:d,%d,%d,%d,%d,%d,%d,%d,%d,%d,%d,%d,%d,%d,%d,%d,%d,%d;", saveid, id, winx, winy, winw, winh, cropx, cropy, cropw, croph, cropen, alpha, z, source, inslot, inport, freeze);
        that.send(cmd);
        return 0;
    };

    this.updatePreviewWindow = function (id, winx, winy, winw, winh,
        cropx, cropy, cropw, croph, cropen,
        alpha, z, source, inslot, inport, freeze) {
        var cmd;
        var ack;
        var saveid = id > 0 ? id - 1 : 0;
        cmd = String.format("/updatepreviewsave:d,%d,%d,%d,%d,%d,%d,%d,%d,%d,%d,%d,%d,%d,%d,%d,%d,%d;", saveid, id, winx, winy, winw, winh, cropx, cropy, cropw, croph, cropen, alpha, z, source, inslot, inport, freeze);
        that.send(cmd);
        return 0;
    };

    this.updatePreview = function () {
        var cmd;
        cmd = String.format("/UpdateScene:d,%d;", 0);//和函数updateSceneWidthRelease()一模一样
        that.send(cmd);

        return 0;
    };

    this.resetPreview = function () {
        var cmd;
        cmd = String.format("/resetpreview:d,%d;", 0);
        that.send(cmd);

        return 0;
    };

    this.savePreview = function () {
        var cmd;
        cmd = String.format("/savepreview:d,%d;", 0);
        that.send(cmd);

        return 0;
    };

    this.setNoSigColor = function (r, g, b) {
        var cmd;
        cmd = String.format("/setNoSigColor:d,%d,%d,%d;", r, g, b);
        that.send(cmd);

        return 0;
    };

    this.setSigTypeSwitch = function (port, type) {
        var cmd;
        cmd = String.format("/setSigTypeSwitch:d,%d,%d;", port, type);
        that.send(cmd);
        return 0;
    };

    this.setSwitchSlotPortType = function (slot, port, type) {
        var cmd;
        cmd = String.format("/switchSlotPortType:d,%d,%d,%d;", slot, port, type);
        that.send(cmd);
        return 0;
    };

    //////////////////////////////////////////////////////////////////
    this.loadSceneTask = function () {
        var cmd;
        cmd = String.format("/loadSceneTask:d,%d;", 1);
        that.send(cmd);

        return 0;
    };

    this.getSceneTaskDatas = function () {//这个是查询已保存的定时任务场景
        var cmd;
        cmd = String.format("/getSceneTaskDatas:d,%d;", 1);
        return that.reciveDatas(cmd);


    };

    this.getSceneTask = function (id) {
        var cmd;
        cmd = String.format("/getSceneTask:d,%d;", id);

        return that.reciveList(cmd);

    };

    this.sveSceneTask = function (id, h, m, s, task, onoff) {
        var cmd;
        cmd = String.format("/sveSceneTask:d,%d,%d,%d,%d,%d,%d;", id, h, m, s, task, onoff);
        that.send(cmd);

        return 0;
    };

    this.initAllSceneTask = function () {
        var cmd;
        cmd = String.format("/initAllSceneTask:d,%d;", 1);
        that.send(cmd);

        return 0;
    };

    this.setSigHotBack = function (mode) {
        var cmd;
        cmd = String.format("/setHotBackup:d,%d;", mode);
        that.send(cmd);
    };
    //////////////////////////////////////////////////////////////////开关

    this.WriteTaskListEn = function (en) {
        var cmd;
        cmd = String.format("/WriteTaskListEn:d,%d;", en);
        that.send(cmd);
        return 0;
    };

    this.ReadTaskListEn = function () {
        var cmd;
        cmd = String.format("/ReadTaskListEn:d,%d;", 1);
        var ret = that.recive(cmd);
        return ret;
    };

    this.WriteHotBackupEn = function (en) {
        var cmd;
        cmd = String.format("/WriteHotBackupEn:d,%d;", en);
        that.send(cmd);
        return 0;
    };

    this.ReadHotBackupEn = function () {
        var cmd;
        cmd = String.format("/ReadHotBackupEn:d,%d;", 1);
        var ret = that.recive(cmd);
        return ret;
    };

    this.WriteCaroListEn = function (en) {
        var cmd;
        cmd = String.format("/WriteCaroListEn:d,%d;", en);
        that.send(cmd);
        return 0;
    };

    this.ReadCaroListEn = function () {
        var cmd;
        cmd = String.format("/ReadCaroListEn:d,%d;", 1);
        var ret = that.recive(cmd);
        return ret;
    };

    //////////////////////////////////////////////////////////////////任务轮播器
    this.loadSceneCaro = function () {
        var cmd;

        cmd = String.format("/loadSceneCaro:d,%d;", 1);
        that.send(cmd);

        return 0;
    };

    this.getSceneCaroDatas = function () {//这个是查询已保存的定时任务场景
        var cmd;
        cmd = String.format("/getSceneCaroDatas:d,%d;", 1);
        return that.reciveDatas(cmd);
    };

    this.getSceneCaro = function (id) {
        var cmd;
        cmd = String.format("/getSceneCaro:d,%d;", id);

        return that.reciveList(cmd);

    };

    this.sveSceneCaro = function (id, h, m, s, Caro, onoff) {
        var cmd;
        cmd = String.format("/sveSceneCaro:d,%d,%d,%d,%d,%d,%d;", id, h, m, s, Caro, onoff);
        that.send(cmd);

        return 0;
    };

    this.initAllSceneCaro = function () {
        var cmd;
        cmd = String.format("/initAllSceneCaro:d,%d;", 1);
        that.send(cmd);

        return 0;
    };

    this.setSigHotBackMap = function (selslot, selport, bakslot, bakport) {
        var cmd;
        cmd = String.format("/setHotBackMap:d,%d,%d,%d,%d;", selslot, selport, bakslot, bakport);
        that.send(cmd);
    };

    this.setSigHotBackMapClearAll = function () {
        var cmd;
        cmd = String.format("/setHotBackMapClear:d,1;");
        that.send(cmd);
    };

    this.setSigHotBackMapAll = function (
        bakslot1, bakport1,
        bakslot2, bakport2,
        bakslot3, bakport3,
        bakslot4, bakport4,
        bakslot5, bakport5,
        bakslot6, bakport6,
        bakslot7, bakport7,
        bakslot8, bakport8,
        bakslot9, bakport9,
        bakslot10, bakport10,
        bakslot11, bakport11,
        bakslot12, bakport12,
        bakslot13, bakport13,
        bakslot14, bakport14,
        bakslot15, bakport15,
        bakslot16, bakport16,
        bakslot17, bakport17,
        bakslot18, bakport18,
        bakslot19, bakport19,
        bakslot20, bakport20,
        bakslot21, bakport21,
        bakslot22, bakport22,
        bakslot23, bakport23,
        bakslot24, bakport24
    ) {
        var cmd;
        cmd = String.format("/setHotBackMapAll:d,"
            + "%d,%d,%d,%d,"
            + "%d,%d,%d,%d,"
            + "%d,%d,%d,%d,"
            + "%d,%d,%d,%d,"
            + "%d,%d,%d,%d,"
            + "%d,%d,%d,%d,"
            + "%d,%d,%d,%d,"
            + "%d,%d,%d,%d,"
            + "%d,%d,%d,%d,"
            + "%d,%d,%d,%d,"
            + "%d,%d,%d,%d,"
            + "%d,%d,%d,%d;",
            bakslot1, bakport1,
            bakslot2, bakport2,
            bakslot3, bakport3,
            bakslot4, bakport4,
            bakslot5, bakport5,
            bakslot6, bakport6,
            bakslot7, bakport7,
            bakslot8, bakport8,
            bakslot9, bakport9,
            bakslot10, bakport10,
            bakslot11, bakport11,
            bakslot12, bakport12,
            bakslot13, bakport13,
            bakslot14, bakport14,
            bakslot15, bakport15,
            bakslot16, bakport16,
            bakslot17, bakport17,
            bakslot18, bakport18,
            bakslot19, bakport19,
            bakslot20, bakport20,
            bakslot21, bakport21,
            bakslot22, bakport22,
            bakslot23, bakport23,
            bakslot24, bakport24
        );
        that.send(cmd);
    };

    this.setcolorspace = function (slot, port, type, mode) {//转换为RGB
        var cmd;
        cmd = String.format("/setcolorspace:d,%d,%d,%d,%d;", slot, port, type, mode);
        that.send(cmd);
    };

    this.setInputVgaPortAuto = function (slot, port, mode) {
        var cmd;
        cmd = String.format("/setInputVgaPortAuto:d,%d,%d,%d;", slot, port, mode);
        that.send(cmd);
    };

    this.setsubtitlesConfig = function (totwidth, totheight, wordpixel, wordspreline, lines,
        fr, fg, fb, br, bg, bb, alpha, roll, mask, onoff) {
        var cmd;
        cmd = String.format("/setsubtitlesConfig:d,%d,%d,%d,%d,%d,%d,%d,%d,%d,%d,%d,%d,%d,%d,%d;",
            totwidth, totheight, wordpixel, wordspreline, lines,
            fr, fg, fb, br, bg, bb, alpha, roll, mask, onoff);
        that.send(cmd);
    };

    this.setsubtitlesdatas = function (datas, len) {
        var cmd = "/setsubtitlesdatas:d," + len;
        for (i = 0; i < len; i++) {
            cmd += "," + datas[i];
        };
        cmd += ";\r\n";
        that.send(cmd);
    };

    this.setsubtitlespacketdatas = function (id, datas, len) {
        var cmd = "/setsubtitlesdatas:d," + id;
        for (i = 0; i < len; i++) {
            cmd += "," + datas[i];
        };
        cmd += ";\r\n";
        cmd += "";
        that.send(cmd);
    };

    this.setsubtitlesReset = function () {
        var cmd = "/setsubtitlesReset:d,1;";

        that.send(cmd);
    };

    this.setsubtitlesWindow = function () {
        var cmd = "/setsubtitlesWindow:d,1;";
        that.send(cmd);
    };

    this.SetPRESET = function (n) {
        var cmd = "/SetPRESET:d," + n + ";";
        that.send(cmd);
    };

    /////////////////////////////////////////////////////////
    this.getSubtitlesWords = function (n) {
        var cmd;
        cmd = String.format("/getSubtitlesWords:d,%d;", n);
        return that.reciveString(cmd);

    };

    this.setSubtitlesWords = function (n, s) {
        try {
            var cmd;

            var tmps = utf8stringToByte(s);


            cmd = String.format("/setSubtitlesWords:d,%d,"
                + "%d,%d,%d,%d,%d,%d,%d,%d,"
                + "%d,%d,%d,%d,%d,%d,%d,%d;",
                n,
                tmps[0], tmps[1], tmps[2], tmps[3],
                tmps[4], tmps[5], tmps[6], tmps[7],
                tmps[8], tmps[9], tmps[10], tmps[11],
                tmps[12], tmps[13], tmps[14], tmps[15]
            );

            that.send(cmd);

        } catch (ex) {
            // Logger.getLogger(Protocal.class.getName()).log(Level.SEVERE, null, ex);
        }

    };

    this.getSubtitlesConfig = function (id) {
        var cmd;
        cmd = String.format("/getSubtitlesConfig:d,%d;", id);
        return that.reciveList(cmd);

    };
    /////////////////////////////////////////////////////////////////////////////////

    this.spitest = function (times, mode) {
        var cmd;
        cmd = String.format("/spitest:d,%d,%d;", times, mode);
        that.send(cmd);//return that.recive(cmd);

    };

    this.InputCardSpiTest = function (id, times, mode) {
        var cmd;
        cmd = String.format("/InputCardSpiTest:d,%d,%d,%d;", id, times, mode);
        that.send(cmd);// return that.recive(cmd);

    };

    this.OutputCardSpiTest = function (id, times, mode) {
        var cmd;
        cmd = String.format("/OutputCardSpiTest:d,%d,%d,%d;", id, times, mode);
        that.send(cmd);//return that.recive(cmd);

    };

    this.InputCardSpiReadTest = function (id, times, mode) {
        var cmd;
        cmd = String.format("/InputCardSpiReadTest:d,%d,%d,%d;", id, times, mode);
        that.send(cmd);//return that.recive(cmd);

    };

    this.OutputCardSpiReadTest = function (id, times, mode) {
        var cmd;
        cmd = String.format("/OutputCardSpiReadTest:d,%d,%d,%d;", id, times, mode);
        that.send(cmd);//return that.recive(cmd);

    };

    this.getspitest = function () {
        var cmd;
        cmd = String.format("/getspitest:d,%d;", 1);
        return that.recive(cmd);

    };

    //////////////////////////////////////////////////////////////////////////////
    this.setd3dSync = function (phase, rev) {
        var cmd = "/setd3dSync:d," + phase + "," + rev + ";";
        that.send(cmd);
    };

    this.setd3dmode = function (n) {
        var cmd = "/setd3dmode:d," + n + ";";
        that.send(cmd);
    };

    this.setWin3dmode = function (id, mode, reversal) {
        var cmd;
        cmd = String.format("/setWin3dmode:d,%d,%d,%d;", id, mode, reversal);
        that.send(cmd);
    };

    ////////////////////////////////////////////////////
    this.isAdminLogin = function () {
        var cmd;
        cmd = String.format("/isAdminLogin:d,%d;", 1);
        return that.recive(cmd);
    };

    this.AdminLogin = function (s) {
        try {
            var cmd = "/AdminLogin:s," + s + ";";
            that.send(cmd);
        } catch (ex) {

        }
    };
    this.AdminNewPsw = function (s) {

        try {


            var cmd = "/AdminNewPsw:s," + s + ";";
            that.send(cmd);
        } catch (ex) {

        }
    };

    this.setAdminMode = function (y, m, d, on) {

        var cmd = String.format("/setAdminMode:d,%d,%d,%d,%d;", y, m, d, on);
        that.send(cmd);

    };

    this.getAdminMode = function () {
        var cmd;
        cmd = String.format("/getAdminMode:d,%d;", 0);
        return that.reciveList(cmd);

    };

    /////////////////////////////////////////////////////////////////////
    this.setGateway_IP = function (y, m, d, on) {
        var cmd = String.format("/setGateway_IP:d,%d,%d,%d,%d;\r\n", y, m, d, on);
        that.send(cmd);

    };

    this.rdGatewayIP = function () {
        var cmd;
        cmd = String.format("/rdGatewayIP:d,1;", 1);
        return that.reciveList(cmd);

    };

    this.setSub_Mask = function (y, m, d, on) {
        var cmd = String.format("/setSub_Mask:d,%d,%d,%d,%d;\r\n", y, m, d, on);
        that.send(cmd);

    };

    this.rdSubMask = function () {
        var cmd;
        cmd = String.format("/rdSubMask:d,1;\r\n", 1);
        return that.reciveList(cmd);

    };



    this.setIP_Addr = function (y, m, d, on) {
        var cmd = String.format("/setIP_Addr:d,%d,%d,%d,%d;\r\n", y, m, d, on);
        that.send(cmd);

    };

    this.rdIPAddr = function () {
        var cmd;
        cmd = String.format("/rdIPAddr:d,1;\r\n", 1);
        return that.reciveList(cmd);

    };

    this.SetS0_Port = function (y, m) {

        var cmd = String.format("/SetS0_Port:d,%d,%d;\r\n", y, m);
        that.send(cmd);

    };

    this.rdS0Port = function () {
        var cmd;
        cmd = String.format("/rdS0Port:d,1;\r\n", 1);
        return that.reciveList(cmd);
    };
    this.setPhy_Addr = function (y, m, d, on, s, x) {
        var cmd = String.format("/setPhy_Addr:h,%x,%x,%x,%x,%x,%x;\r\n", y, m, d, on, s, x);
        that.send(cmd);

    };


    this.rdPhyAddr = function () {
        var cmd;
        cmd = String.format("/rdPhyAddr:d,1;\r\n", 1);
        return that.reciveList(cmd);
    };
    this.restoreSubtitlesDatas = function () {
        var cmd = String.format("/restoreSubtitlesDatas:d,%d;\r\n", 1);
        that.send(cmd);
    };

    this.setsubtitlesConfig = function (fr, fg, fb, br, bg, bb, reverse, alpha, rollmode, rollstep,
        totwidth, totheight) {
        var cmd;
        cmd = String.format("/setsubtitlesConfig:d,%d,%d,%d,%d,%d,%d,%d,%d,%d,%d,%d,%d;",
            fr, fg, fb, br, bg, bb, reverse, alpha, rollmode, rollstep,
            totwidth, totheight);
        that.send(cmd);
    };

    /////////////////////////////////////////////////////////////////////
    this.SetIPCGateway = function (slot, port, ip1, ip2, ip3, ip4) {

        var cmd = String.format("/SetIPCGateway:d,%d,%d,%d,%d,%d,%d;", slot, port, ip1, ip2, ip3, ip4);
        that.send(cmd);

    };

    this.getIPCGateway = function (slot, port) {
        var cmd;
        cmd = String.format("/getIPCGateway:d,%d,%d;\r\n", slot, port);
        return that.reciveList(cmd);

    };

    this.setIPCMask = function (slot, port, ip1, ip2, ip3, ip4) {

        var cmd = String.format("/setIPCMask:d,%d,%d,%d,%d,%d,%d;\r\n", slot, port, ip1, ip2, ip3, ip4);
        that.send(cmd);

    };

    this.getIPCMask = function (slot, port) {
        var cmd;
        cmd = String.format("/getIPCMask:d,%d,%d;\r\n", slot, port);
        return that.reciveList(cmd);

    };

    this.SetIPCPhy = function (slot, port, ip1, ip2, ip3, ip4, ip5, ip6) {

        var cmd = String.format("/SetIPCPhy:d,%d,%d,%d,%d,%d,%d,%d,%d;\r\n", slot, port, ip1, ip2, ip3, ip4, ip5, ip6);
        that.send(cmd);

    };

    this.getIPCPhy = function (slot, port) {
        var cmd;
        cmd = String.format("/getIPCPhy:d,%d,%d;\r\n", slot, port);
        return that.reciveList(cmd);
    };

    this.SetIPCIP = function (slot, port, ip1, ip2, ip3, ip4) {

        var cmd = String.format("/SetIPCIP:d,%d,%d,%d,%d,%d,%d;\r\n", slot, port, ip1, ip2, ip3, ip4);
        that.send(cmd);

    };

    this.getIPCIP = function (slot, port) {
        var cmd;
        cmd = String.format("/getIPCIP:d,%d,%d;\r\n", slot, port);
        return that.reciveList(cmd);

    };

    this.SetIPCPort = function (slot, port, y, m) {

        var cmd = String.format("/SetIPCPort:d,%d,%d,%d,%d;\r\n", slot, port, y, m);
        that.send(cmd);

    };

    this.SetIPCPort = function (slot, port, y) {

        var cmd = String.format("/SetIPCPort:d,%d,%d,%d;\r\n", slot, port, y);
        that.send(cmd);

    };

    this.getIPCPort = function (slot, port) {
        var cmd;
        cmd = String.format("/getIPCPort:d,%d,%d;\r\n", slot, port);
        return that.reciveList(cmd);
    };

    this.getPrtlCurScene = function () {//获取当前场景的id
        var cmd;
        cmd = String.format("/getCurScene:d,1;\r\n", 1);
        return that.recive(cmd);
    };

    this.setWindow3DMode = function (id, value, reversal) {
        var cmd = String.format("/setWin3DMode:d,%d,%d,%d;\r\n", id, value, reversal);
        that.send(cmd);
    };

    this.getWindow3DMode = function (id) {
        var cmd = String.format("/getWin3DMode:d,%d;\r\n", id);
        return that.reciveList(cmd);
    };

    this.getkeyBreak = function (id) {
        var cmd = String.format("/keyBreak:d,1;:d,%d;\r\n", id);
        return that.reciveList(cmd);
    };

    this.reportInputCard = function (slot, port) {
        var cmd = String.format("/reportInputCard:d,%d,%d;\r\n;", slot, port);
        return that.reciveList(cmd);
    };

    this.isSdiInsert = function (isornot) {//查询SDI小卡是否插入
        var cmd;
        cmd = String.format("/isSdiInsert:d,%d;\r\n", isornot);
        return that.recive(cmd);
    };

    this.readVgaAuto = function (slot, port) {//查询vga自动对齐
        var cmd;
        cmd = String.format("/readVgaAuto:d,%d,%d;\r\n", slot, port);
        return that.recive(cmd);
    };

    this.SetvgaAuto = function (slot, port, openClose) {
        var cmd = String.format("/vgaAuto:d,%d,%d,%d;\r\n", slot, port, openClose);
        that.send(cmd);
    };

    this.SetvgaManual = function (slot, port) {

        var cmd = String.format("/vgaManual:d,%d,%d;\r\n", slot, port);
        that.send(cmd);
    };
    //htotal_h,htotal_l,vco,phase,clamp,sync;

    this.SetvgaSet = function (slot, port, htotal, hstart, vstart, hactive, vactive, delta, vco, phase, clamp, sync) {

        var cmd = String.format("/vgaSet:d,%d,%d,%d,%d,%d,%d,%d,%d,%d,%d,%d,%d;\r\n", slot, port, htotal, hstart, vstart, hactive, vactive, delta, vco, phase, clamp, sync);
        that.send(cmd);
    };

    this.getvgaVtotal = function (slot, port) {//获取当前场景的id
        var cmd;
        cmd = String.format("/vgaVtotal:d,%d,%d;\r\n", slot, port);
        return that.reciveList(cmd);
    };

    ///getAdvance3DById:d,id;
    this.getAdvance3DById = function (id) {//获取开关
        var cmd;
        cmd = String.format("/getAdvance3DById:d,%d;\r\n", id);
        return that.reciveList(cmd);
    };

    this.setAdvance3DById = function (id, onOrOff) {///setAdvance3DById:d,id,onoff;
        var cmd = String.format("/setAdvance3DById:d,%d,%d;\r\n", id, onOrOff);
        that.send(cmd);
    };
    ///getRightSrc:d,id;

    this.getRightSrc = function (id) {//获取右眼信息
        var cmd;
        cmd = String.format("/getRightSrc:d,%d;\r\n", id);
        return that.reciveList(cmd);
    };

    this.setRightSrc = function (id, inslot, inport, cutx, cuty) {////setRightSrc:d,id,inslot,inport,cutx,cuty;
        var cmd = String.format("/setRightSrc:d,%d,%d,%d,%d,%d;\r\n", id, inslot, inport, cutx, cuty);
        that.send(cmd);
    };

    this.updatewithrelease = function () {////setRightSrc:d,id,inslot,inport,cutx,cuty;
        var cmd = String.format("/updatewithrelease:d,1;\r\n");
        that.send(cmd);
    };

    this.checklic = function () {//add by dss 20180323
        var cmd;

        cmd = String.format("/checklic:d,%d;\r\n", 1);
        return that.recive(cmd);
    };

    ///setgroup:d,gid,en_calc,frame,clk_upper,h_sync_lower,v_sync_lower,clk_real,en_3D;
    //    this.=function setgroup( gid, en_calc, frame, clk_upper, h_sync_lower, v_sync_lower, long clk_real, en_3D, slotEn1, slotEn2, slotEn3, slotEn4, slotEn5, slotEn6, slotEn7, slotEn8, slotEn9) {////setRightSrc:d,id,inslot,inport,cutx,cuty;
    //        var cmd = String.format("/setgroup:d,%d,%d,%d,%d,%d,%d,%d,%d,%d,%d,%d,%d,%d,%d,%d,%d,%d;\r\n", gid, en_calc, frame, clk_upper, h_sync_lower, v_sync_lower, clk_real, en_3D, slotEn1, slotEn2, slotEn3, slotEn4, slotEn5, slotEn6, slotEn7, slotEn8, slotEn9);
    //        that.send(cmd);
    //    };
    //
    //    ///getGroup:d,gid;
    //    this.=function getGroup( gid) {//
    //        var cmd;
    //        cmd = String.format("/getRightSrc:d,%d;\r\n", gid);
    //        return that.reciveList(cmd);
    //    };
    ///setslotporttiming:d,gid,slot,port,
    //total_pixel,h_sync_width,h_active_start,h_active_size,h_sync_p
    //ol,
    //
    //total_line,v_sync_width,v_active_start,v_active_size,v_sync_po
    //l,
    //					frame_rate,isUsed;
    this.setslotporttiming = function (gid, tid, slot, port, total_pixel, h_sync_width, h_active_start, h_active_size, h_sync_p, total_line, v_sync_width, v_active_start, v_active_size, v_sync_po, frame_rate, intisUsed, ugid) {////setRightSrc:d,id,inslot,inport,cutx,cuty;
        var cmd = String.format("/setslotporttiming:d,%d,%d,%d,%d,%d,%d,%d,%d,%d,%d,%d,%d,%d,%d,%d,%d,%d;\r\n", gid, tid, slot, port, total_pixel,
            h_sync_width, h_active_start, h_active_size, h_sync_p, total_line,
            v_sync_width, v_active_start, v_active_size,
            v_sync_po, frame_rate, intisUsed, ugid);
        that.send(cmd);
    };
    //getSlotPortTiming:d,slot,port;

    this.getSlotPortTiming = function (slot, port) {//
        var cmd;
        cmd = String.format("/getSlotPortTiming:d,%d,%d;\r\n", slot, port);
        return that.reciveList(cmd);
    };
    ///resetAllGroupSlotPort:d,1;

    this.resetAllGroupSlotPort = function () {//复位接口时序和组参数
        var cmd = String.format("/resetAllGroupSlotPort:d,%d;\r\n", 1);
        that.send(cmd);
    };
    //setGroupClk:d,gid,clk;

    this.setGroupClk = function (gid, clk) {
        var cmd = String.format("/setGroupClk:d,%d,%d;\r\n", gid, clk);
        that.send(cmd);
    };

    this.getGroupClk = function (gid) {//
        var cmd;
        cmd = String.format("/getGroupClk:d,%d;\r\n", gid);
        return that.reciveList(cmd);
    };

    this.setgrouptiming = function (gid, tid, total_pixel, h_sync_width, h_active_start, h_active_size, h_sync_p, total_line, v_sync_width, v_active_start, v_active_size, v_sync_po, frame_rate) {////setRightSrc:d,id,inslot,inport,cutx,cuty;
        var cmd = String.format("/setgrouptiming:d,%d,%d,%d,%d,%d,%d,%d,%d,%d,%d,%d,%d,%d;\r\n", gid, tid, total_pixel, h_sync_width, h_active_start, h_active_size, h_sync_p, total_line, v_sync_width, v_active_start, v_active_size, v_sync_po, frame_rate);
        that.send(cmd);
    };
    //getSlotPortTiming:d,slot,port;

    this.getGroupTiming = function (gid) {//
        var cmd;
        cmd = String.format("/getGroupTiming:d,%d;\r\n", gid);
        return that.reciveList(cmd);
    };

    this.setSlotGroup = function (slot, gid) {
        var cmd = String.format("/setSlotGroup:d,%d,%d;\r\n", slot, gid);
        that.send(cmd);
    };

    this.getSlotGroup = function () {///ack:d,gid0,gid1,gid2,gid3,gid4,gid5,gid6,gid7,gid8;   gid0~gid8:输出卡0~8所在组的组id
        var cmd;
        cmd = String.format("/getSlotGroup:d,%d;\r\n", 1);
        return that.reciveList(cmd);
    };

    this.setGroupName = function (gid, s) {

        var cmd;

        var tmps = utf8stringToByte(s);

        cmd = String.format("/setGroupName:d,%d,%d,%d,%d,%d,%d,%d,%d,%d,%d,%d,%d,%d,%d,%d,%d,%d,%d,%d,%d,%d,%d,%d,%d;",
            gid,
            tmps[0], tmps[1], tmps[2], tmps[3],
            tmps[4], tmps[5], tmps[6], tmps[7],
            tmps[8], tmps[9], tmps[10], tmps[11],
            tmps[12], tmps[13], tmps[14], tmps[15],
            tmps[16], tmps[17], tmps[18], tmps[19],
            tmps[20], tmps[11], tmps[22]
        );
        that.send(cmd);


    };

    this.getGroupName = function (gid) {///ack:d,gid0,gid1,gid2,gid3,gid4,gid5,gid6,gid7,gid8;   gid0~gid8:输出卡0~8所在组的组id
        var cmd;///getGroupName:d,1;
        cmd = String.format("/getGroupName:d,%d;\r\n", gid);
        return that.reciveString(cmd);
    };

    //setSlotPortUsed:d,slot,port,isused;
    this.setSlotPortUsed = function (slot, port, isused) {
        var cmd = String.format("/setSlotPortUsed:d,%d,%d,%d;\r\n", slot, port, isused);
        that.send(cmd);
    };

    this.resetSlotPortUsed = function (ugid) {//关闭所有组中tid为14的组
        var cmd = String.format("/resetSlotPortUsed:d,%d;\r\n", ugid);
        that.send(cmd);
    };

    ///setgrouptimingOnScreen:d,gid,tid,total_pixel,h_sync_width,h_active_start,h_active_size,h_sync_pol,total_line,v_sync_width,v_active_start,v_active_size,v_sync_pol,frame_rate;
    //说明：在显示屏上点击右键设置组参数，发送这条命令；
    this.setgrouptimingOnScreen = function (gid, tid, total_pixel, h_sync_width, h_active_start, h_active_size, h_sync_p, total_line, v_sync_width, v_active_start, v_active_size, v_sync_po, frame_rate) {////setRightSrc:d,id,inslot,inport,cutx,cuty;
        var cmd = String.format("/setgrouptimingOnScreen:d,%d,%d,%d,%d,%d,%d,%d,%d,%d,%d,%d,%d,%d;\r\n", gid, tid, total_pixel, h_sync_width, h_active_start, h_active_size, h_sync_p, total_line, v_sync_width, v_active_start, v_active_size, v_sync_po, frame_rate);
        that.send(cmd);
    };

    this.initUserWindows = function () {
        var cmd = String.format("/initUserWindows:d,%d;\r\n", 0);
        that.send(cmd);
    };
    //获取背板切换芯片温度

    this.getSwitchTemp = function () {
        var cmd;
        cmd = String.format("/getSwitchTemp:d,1;\r\n", 1);
        return that.reciveList(cmd);
    };
    ///getInputCartPortSta:d,slot,port;

    this.getInputCartPortSta = function (slot, port) {
        var cmd;
        cmd = String.format("/getInputCartPortSta:d,%d,%d;\r\n", slot, port);
        return that.reciveList(cmd);
    };
    ///checkIncardErr:d,inslot;
    //  bit0=1: 板卡类型错误
    //bit1=1: 板卡DDR错误
    //bit2=1: 板卡clock错误

    this.checkIncardErr = function (inslot) {
        var cmd;
        cmd = String.format("/checkIncardErr:d,%d;\r\n", inslot);
        return that.reciveList(cmd);
    };
    //checkOutcardErr:d,outslot;
    //   查询输入卡的错误码（一个字节）
    //bit0=1: 板卡类型错误
    //bit1=1: 板卡DDR错误
    //bit2=1: 板卡clock错误
    //bit3=1: 板卡更新超时

    this.checkOutcardErr = function (outslot) {
        var cmd;
        cmd = String.format("/checkOutcardErr:d,%d;\r\n", outslot);
        return that.reciveList(cmd);
    };

    this.intToByteArray = function (i) {
        var result = new byte[4];
        result[0] = (byte)((i >> 24) & 0xFF);
        result[1] = (byte)((i >> 16) & 0xFF);
        result[2] = (byte)((i >> 8) & 0xFF);
        result[3] = (byte)(i & 0xFF);
        return result;
    };

    this.intToBitArray = function (i) {
        var result = new byte[4];
        result[0] = (byte)((i) & 0X01);
        result[1] = (byte)((i) & 0x02);
        result[2] = (byte)((i) & 0x04);
        result[3] = (byte)(i & 0x08);
        return result;
    };
    //rdInputFrame:d,slot,port;
    this.rdInputFrame = function (slot, port) {//获取输入接口帧率
        var cmd;
        cmd = String.format("/rdInputFrame:d,%d,%d;\r\n", slot, port);
        return that.reciveList(cmd);
    };

    //tryToLockSlotPort:d,slot,port;
    this.tryToLockSlotPort = function (slot, port) {//选择同步信号的信号源，并尝试去锁定
        var cmd = String.format("/tryToLockSlotPort:d,%d,%d;\r\n", slot, port);

        that.send(cmd);
    };
    //getTryLockParam:d,slot,port;
    //ack:d,slot,port,htotal,vtotal,m,d,div;

    this.getTryLockParam = function (slot, port) {// 获取锁定结果
        var cmd;
        cmd = String.format("/getTryLockParam:d,%d,%d;\r\n", slot, port);

        console.log("getTryLockParam方法内传出来的值为：" + that.reciveList(cmd));
        return that.reciveList(cmd);
    };
    //applyLock:d,slot,port,htotal,vtotal,m,d,div;
    //      slot:同步信号的输入槽位号
    //port:同步信号的输入接口号
    //htotal:计算后输出分辨率的总宽度
    //vtotal:计算后输出分辨率的总高度
    //m,d,div:配置PLL的参数

    this.applyLock = function (slot, port, htotal, vtotal, m, d, div) {//应用同步参数
        var cmd = String.format("/applyLock:d,%d,%d,%d,%d,%d,%d,%d;\r\n", slot, port, htotal, vtotal, m, d, div);
        that.send(cmd);
    };
    ///closeLock:d,slot,port;

    this.closeLock = function (slot, port) {//关闭同步功能
        var cmd = String.format("/closeLock:d,%d,%d;\r\n", slot, port);
        that.send(cmd);
    };
    //applyOldLock:d,1;

    this.applyOldLock = function () {//恢复之前的同步状态
        var cmd = String.format("/applyOldLock:d,%d;\r\n", 1);
        that.send(cmd);
    };
    ///getSyncResult:d,1;
    this.getSyncResult = function () {
        var cmd;
        cmd = String.format("/getSyncResult:d,%d;\r\n", 1);
        return that.reciveList(cmd);
    };
    // 获取控制卡同步参数
    //getCtrlSync:d,1;
    //    onoff:同步功能开关 1-开 0-关
    //locksta: FPGA同步状态,可能的值有5个，0表示空闲状态，1表示正在尝试锁定，2表示锁定到输入的频率上了，3表示锁定到输入的相位上了(输出场同步和输入场同步的偏差在一定范围内)，4表示曾经锁定到输入相位但由于参考信号丢失目前无法评估是否锁定了
    //pwm_duty[0]: 当前实际输出的PWM占空比，高位
    //pwm_duty[1]: 当前实际输出的PWM占空比，低位
    //pwm_com[0]: 锁定时候确定下来的PWM占空比中值，高位
    //pwm_com[1]: 锁定时候确定下来的PWM占空比中值，低位
    //phase_diff[0]: 输出与输入场同步信号之间的相位关系,bit31-bit24
    //phase_diff[1]: 输出与输入场同步信号之间的相位关系,bit23-bit16
    //phase_diff[2]: 输出与输入场同步信号之间的相位关系,bit15-bit8
    //phase_diff[3]: 输出与输入场同步信号之间的相位关系,bit7-bit0
    this.getCtrlSync = function () {
        var cmd;
        cmd = String.format("/getCtrlSync:d,%d;\r\n", 1);
        return that.reciveList(cmd);
    };
    // 读取输出卡同步计数
    // rdOutputCardSyncCnt:d,slot;
    this.rdOutputCardSyncCnt = function (slot) {
        var cmd;
        cmd = String.format("/rdOutputCardSyncCnt:d,%d;\r\n", slot);
        return that.reciveList(cmd);
    };
    //setoutd3dSync:d,phase,reverse;
    this.setoutd3dSync = function (phase, reverse) {//设置相位
        var cmd = String.format("/setoutd3dSync:d,%d,%d;\r\n", phase, reverse);
        that.send(cmd);
    };
    ///getoutd3dSync:d,1;
    this.getoutd3dSync = function () {//获取相位值和翻转的命令
        var cmd;
        cmd = String.format("/getoutd3dSync:d,%d;\r\n", 1);
        return that.reciveList(cmd);
    };
    //输入帧序列翻转
    this.setFramePhase = function (inslot, inport, type, phase) {//设置相位
        var cmd = String.format("/setFramePhase:d,%d,%d,%d,%d;\r\n", inslot, inport, type, phase);
        that.send(cmd);
    };

    //cmd  value=0~60
    this.getcurScene = function (cmd) {

        return that.reciveFileDatas(cmd);
    }
    this.setUTGroup = function (ugid, tgid) {
        var cmd = String.format("/setUGroup:d,%d,%d;\r\n", ugid, tgid);
        that.send(cmd);
    }
    this.delGroup = function (ugid) {
        var cmd = String.format("/delGroup:d,%d;\r\n", ugid);
        that.send(cmd);
    }
    this.SetWebLanguage = function (lang) {//设置网页语言，lang表示语言的编号，自己定义就行
        var cmd = String.format("/SetWebLanguage:d,%d;\r\n", lang);
        that.send(cmd);
    }
    this.getWebLanguage = function () {//获取网页语言
        var cmd = String.format("/getWebLanguage:d,1;\r\n");
        return that.recive(cmd);
    }

    this.delAllGroups = function () {//删除除第一组的所有组
        var cmd = String.format("/delAllGroups:d,%d;\r\n", 1);
        that.send(cmd);
    }
    this.updateGroup = function () {//更新组
        var cmd = String.format("/updateGroup:d,%d;\r\n", 1);
        that.send(cmd);
    }



    //多窗口修改EDID
    this.modifyEDID = function ( slot, port, edidlist){

       
    

//System.out.println("edid:"+sb.toString());
        var cmd = String.format("/setAllEDID:h,%d,%d,%s;", slot, port, edidlist);
//String cmd = String.format("/setAllEDID:h,%d,%d,%s;", slot, port,"00,FF,FF,FF,FF,FF,FF,00,4E,58,2F,04,33,32,01,01,08,15,01,03,80,37,23,78,2B,EE,91,A3,54,4C,99,26,0F,50,54,01,0B,00,B3,00,A9,40,95,00,90,40,81,80,A9,C0,D1,C0,81,C0,02,3A,80,18,71,38,2D,40,58,2C,45,00,08,22,21,00,00,1E,00,00,00,FF,00,52,4B,32,31,30,30,32,30,30,31,31,38,0A,00,00,00,FD,00,32,4B,18,52,11,00,0A,20,20,20,20,20,20,00,00,00,FC,00,53,52,58,2D,48,44,4D,49,31,2E,33,2D,32,01,DE,02,03,15,31,6d,03,0c,00,20,00,69,3c,00,00,00,00,00,00,e2,00,40,20,1C,56,86,50,00,20,30,0E,38,13,00,72,D0,10,00,00,1E,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,EE");
//System.out.println("cmd:"+cmd);
that.send(cmd);
}




    function stringToBytes(str) {

        var ch, st, re = [];
        for (var i = 0; i < str.length; i++) {
            ch = str.charCodeAt(i);  // get char
            st = [];                 // set up "stack"

            do {
                st.push(ch & 0xFF);  // push byte to stack
                ch = ch >> 8;          // shift value down by 1 byte
            }

            while (ch);
            // add stack contents to result
            // done because chars have "wrong" endianness
            re = re.concat(st.reverse());
        }
        // return an array of bytes
        return re;
    }

    //字符串转字节序列
    function utf8stringToByte(str) {
        var bytes = new Array();
        var len, c;
        len = str.length;
        for (var i = 0; i < len; i++) {
            c = str.charCodeAt(i);
            if (c >= 0x010000 && c <= 0x10FFFF) {
                bytes.push(((c >> 18) & 0x07) | 0xF0);
                bytes.push(((c >> 12) & 0x3F) | 0x80);
                bytes.push(((c >> 6) & 0x3F) | 0x80);
                bytes.push((c & 0x3F) | 0x80);
            } else if (c >= 0x000800 && c <= 0x00FFFF) {
                bytes.push(((c >> 12) & 0x0F) | 0xE0);
                bytes.push(((c >> 6) & 0x3F) | 0x80);
                bytes.push((c & 0x3F) | 0x80);
            } else if (c >= 0x000080 && c <= 0x0007FF) {
                bytes.push(((c >> 6) & 0x1F) | 0xC0);
                bytes.push((c & 0x3F) | 0x80);
            } else {
                bytes.push(c & 0xFF);
            }
        }
        return bytes;


    }


    //字节序列转ASCII码
    //[0x24, 0x26, 0x28, 0x2A] ==> "$&C*"
}
