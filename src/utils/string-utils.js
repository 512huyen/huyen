var mangchu = ['không', 'một', 'hai', 'ba', 'bốn', 'năm', 'sáu', 'bảy', 'tám', 'chín'];
var readHangChuc = function (so, daydu) {
    var chuoi = "";
    var chuc = Math.floor(so / 10);
    var donvi = so % 10;
    debugger
    if (chuc > 1) {
        chuoi = " " + mangchu[chuc] + " mươi";
        if (donvi == 1) {
            chuoi += " mốt";
        }
    } else if (chuc == 1) {
        chuoi = " mười";
        if (donvi == 1) {
            chuoi += " một";
        }
    } else if (daydu && donvi > 0) {
        chuoi = " lẻ";
    }
    if (donvi == 5 && chuc > 1) {
        chuoi += " lăm";
    } else if (donvi > 1 || (donvi == 1 && chuc == 0)) {
        chuoi += " " + mangchu[donvi];
    }
    return chuoi;
}
var readBlock = function (so, daydu) {
    var chuoi = "";
    var tram = Math.floor(so / 100);
    var so = so % 100;
    if (daydu || tram > 0) {
        chuoi = " " + mangchu[tram] + " trăm";
        chuoi += readHangChuc(so, true);
    } else {
        chuoi = readHangChuc(so, false);
    }
    return chuoi;
}
var readHangTrieu = function (so, daydu) {
    var chuoi = "";
    var trieu = Math.floor(so / 1000000);
    var so = so % 1000000;
    if (trieu > 0) {
        chuoi = readBlock(trieu, daydu) + " triệu";
        daydu = true;
    }
    var nghin = Math.floor(so / 1000);
    var so = so % 1000;
    if (nghin > 0) {
        chuoi += readBlock(nghin, daydu) + " nghìn";
        daydu = true;
    }
    if (so > 0) {
        chuoi += readBlock(so, daydu);
    }
    return chuoi;
}
Number.prototype.readPrice = function () {
    if (this == 0) return mangchu[0];
    var chuoi = "", hauto = "";
    do {
        var ty = this % 1000000000;
        var so = Math.floor(this / 1000000000);
        if (so > 0) {
            chuoi = readHangTrieu(ty, true) + hauto + chuoi;
        } else {
            chuoi = readHangTrieu(ty, false) + hauto + chuoi;
        }
        hauto = " tỷ";
    } while (so > 0);
    return chuoi.trim().charAt(0).toUpperCase() + chuoi.trim().slice(1) + " đồng.";
}
String.prototype.replaceAllText = function (strTarget, strSubString) {
    var strText = this;
    var intIndexOfMatch = strText.indexOf(strTarget);
    while (intIndexOfMatch != -1) {
        strText = strText.replace(strTarget, strSubString)
        intIndexOfMatch = strText.indexOf(strTarget);
    }
    return (strText);
}
String.prototype.replaceSpaces = function () {
    return (this.replace(/\s\s+/g, ' '));
}
String.prototype.changeNameFile = function () {
    if (this.length >= 45) {
        return (this.substring(0, 18) + "..." + this.slice(-18))
    } else {
        return this;
    }
}
String.prototype.getDateByString = function () {
    if (this.indexOf("/") != -1) {
        var parts = this.split("/");
    } else {
        var parts = this.split("-");
    }
    var date = new Date(parseInt(parts[2], 10), parseInt(parts[1], 10) - 1, parseInt(parts[0], 10));
    return date;
}
Array.prototype.getNameById = function (id, object) {
    if (this.length > 0 && id) {
        var item = this.filter((data) => {
            return object ? data[object].id == id : data.id == id;
        });
        if (item.length > 0)
            return object ? item[0][object].name : item[0].name;
        else
            return ""
    } else {
        return ""
    }
}
Date.prototype.ddmmyyyy = function () {
    var mm = this.getMonth() + 1; // getMonth() is zero-based
    var dd = this.getDate();
    return [
        (dd > 9 ? '' : '0') + dd,
        (mm > 9 ? '' : '0') + mm, this.getFullYear()
    ].join('/');
};