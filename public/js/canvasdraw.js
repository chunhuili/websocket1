function draw(copy,canvas,cobj,xobj,selectobj){
    this.copy=copy;
    this.canvas=canvas;
    this.cobj=cobj;
    this.xobj=xobj;
    this.selectobj=selectobj;
    this.bgcolor="#000";
    this.borderColor="#000";
    this.borderWidth=1;
    this.type="stroke";//控制划线还是填充
    this.shapes="line";
    this.width=canvas.width;
    this.height=canvas.height;
    this.history=[];
    this.flag=true;
}
draw.prototype= {
    init: function () {//初始化
        this.xobj.css("display", "none");
        this.selectobj.css("display", "none");
        if (this.temp) {
            this.history.push(this.cobj.getImageData(0, 0, this.width, this.height));
            this.temp = null;
        }
        this.cobj.fillStyle = this.bgcolor;
        this.cobj.strokeStyle = this.borderColor;
        this.cobj.lineWidth = this.borderWidth;
    },
    line: function (x, y, x1, y1) {
        var that = this;
        that.cobj.beginPath();
        that.cobj.moveTo(x, y);
        console.log(x,y);
        alert(33)
        that.cobj.lineTo(x1, y1);
        console.log(x1,y1);
        return false;
        that.cobj.stroke();
        that.cobj.closePath();
    },
    rect: function (x, y, x1, y1) {
        var that = this;
        that.init();
        that.cobj.beginPath();
        that.cobj.rect(x, y, x1 - x, y1 - y);
        that.cobj.closePath();
        that.cobj[that.type]();
    },
    circle: function (x, y, x1, y1) {
        var that = this;
        var r = Math.sqrt((x1 - x) * (x1 - x) + (y1 - y) * (y1 - y))
        that.init();
        that.cobj.beginPath();
        that.cobj.arc(x, y, r, 0, Math.PI * 2);//画圆
        that.cobj.closePath();
        that.cobj[that.type]();
    },
    pen: function () {
        var that = this;
        that.init();
        that.copy.onmousedown = function (e) {
            var startx = e.offsetX;
            var starty = e.offsetY;
            that.init();
            that.cobj.beginPath();
            that.cobj.moveTo(startx, starty);
            that.copy.onmousemove = function (e) {
                var endx = e.offsetX;
                var endy = e.offsetY;
                that.cobj.lineTo(endx, endy);
                that.cobj.stroke();
            };
            that.copy.onmouseup = function () {
                that.cobj.closePath();
                var data = that.cobj.getImageData(0, 0, that.width, that.height);
                that.history.push(data);
                that.copy.onmousemove = null;
                that.copy.onmouseup = null;
            }
        }
    },
    star: function (x, y, x1, y1) {
        var r = Math.sqrt((x1 - x) * (x1 - x) + (y1 - y) * (y1 - y));//外面的圆
        var r1 = r / 2;//里面的圆
        this.cobj.beginPath();
        this.cobj.moveTo(x + r, y);
        for (var i = 1; i < 10; i++) {
            if (i % 2 == 0) {
                this.cobj.lineTo(Math.cos(i * 36 * Math.PI / 180) * r + x, Math.sin(i * 36 * Math.PI / 180) * r + y)
            } else {
                this.cobj.lineTo(Math.cos(i * 36 * Math.PI / 180) * r1 + x, Math.sin(i * 36 * Math.PI / 180) * r1 + y)
            }
        }
        this.cobj.closePath();
        this.cobj[this.type]();
    },
    draw: function () {
        var that = this;
        that.copy.onmousedown = function (e) {
            var startx = e.offsetX;
            var starty = e.offsetY;
            that.init();
            that.copy.onmousemove = function (e) {
                that.cobj.clearRect(0, 0, that.width, that.height);
                if (that.history.length != 0) {
                    that.cobj.putImageData(that.history[that.history.length - 1], 0, 0);
                }

                var endx = e.offsetX;
                var endy = e.offsetY;

                that[that.shapes](startx, starty, endx, endy);//that.line()
            };
            that.copy.onmouseup = function () {
                var data = that.cobj.getImageData(0, 0, that.width, that.height);
                that.history.push(data);
                that.copy.onmousemove = null;
                that.copy.onmouseup = null;
            }
        }
    },
    xp: function (xobj, w, h) {
        var that = this;
        that.init();
        that.copy.onmousemove = function (e) {
            var ox = e.offsetX;
            var oy = e.offsetY;
            xobj.css({
                display: "block",
                width: w,
                height: h
            })
            var left = ox - w / 2;
            var top = oy - h / 2;
            if (left < 0) {
                left = 0;
            }
            if (left > that.width - w) {
                left = that.width - w;
            }
            if (top < 0) {
                top = 0;
            }
            if (top > that.height - h) {
                top = that.height - h;
            }
            xobj.css({
                left: left,
                top: top,
            })
        }
        that.copy.onmousedown = function () {
            that.init();
            that.copy.onmousemove = function (e) {
                var ox = e.offsetX;
                var oy = e.offsetY;
                var left = ox - w / 2;
                var top = oy - h / 2;
                if (left < 0) {
                    left = 0;
                }
                if (left > that.width - w) {
                    left = that.width - w;
                }
                if (top < 0) {
                    top = 0;
                }
                if (top > that.height - h) {
                    top = that.height - h;
                }
                xobj.css({
                    left: left,
                    top: top,
                    display: "block"
                })
                that.cobj.clearRect(left, top, w, h);
            }
            that.copy.onmouseup = function () {
                xobj.css({
                    display: "none"
                })
                that.history.push(that.cobj.getImageData(0, 0, that.width, that.height));
                that.copy.onmousemove = null;
                that.copy.onmouseup = null;
                that.xp(xobj, w, h);
            }
        }
    },
    select: function (selectAreaobj) {
        var that = this;
        that.init();
        that.copy.onmousedown = function (e) {
            var startx = e.offsetX;
            var starty = e.offsetY;
            var minx, miny, w, h;
            that.init();
            that.copy.onmousemove = function (e) {
                that.init();
                var endx = e.offsetX;
                var endy = e.offsetY;
                minx = startx > endx ? endx : startx;
                miny = starty > endy ? endy : starty;
                w = Math.abs(endx - startx);
                h = Math.abs(endy - starty);
                selectAreaobj.css({
                    display: "block",
                    left: minx,
                    top: miny,
                    width: w,
                    height: h
                })
            }
            that.copy.onmouseup = function (e) {
                that.copy.onmouseup = null;
                that.copy.onmousemove = null;
                that.temp = that.cobj.getImageData(minx, miny, w, h);
                that.cobj.clearRect(minx, miny, w, h)
                that.history.push(that.cobj.getImageData(0, 0, that.width, that.height))
                that.cobj.putImageData(that.temp, minx, miny);
                that.drag(minx, miny, w, h, selectAreaobj);
            }
        }
    },
    drag: function (x, y, w, h, selectAreaobj) {
        var that = this;
        that.copy.onmousemove = function (e) {
            var ox = e.offsetX;
            var oy = e.offsetY;
            if (ox > x && ox < w + x && oy > y && oy < h + y) {
                that.copy.style.cursor = "move";
            } else {
                that.copy.style.cursor = "default";
            }
        }
        that.copy.onmousedown = function (e) {
            var ox = e.offsetX;
            var oy = e.offsetY;
            //鼠标相对于div左上角的位置
            var cx = ox - x;
            var cy = oy - y;
            if (ox > x && ox < w + x && oy > y && oy < h + y) {
                that.copy.style.cursor = "move";
            } else {
                that.copy.style.cursor = "default";
                return;
            }
            that.copy.onmousemove = function (e) {
                that.cobj.clearRect(0, 0, that.width, that.height);
                if (that.history.length != 0) {
                    that.cobj.putImageData(that.history[that.history.length - 1], 0, 0)
                }
                var endx = e.offsetX;
                var endy = e.offsetY;
                var left = endx - cx;
                var top = endy - cy;
                if(left<0){
                    left=0;
                }
                if(left>that.width-w){
                    left=that.width-w
                }

                if(top<0){
                    top=0;
                }
                if(top>that.height-h){
                    top=that.height-h
                }
                selectAreaobj.css({
                    left: left,
                    top: top,
                })
                x=left;
                y=top;
                that.cobj.putImageData(that.temp, left, top);
            }
            that.copy.onmouseup = function () {
                that.copy.onmouseup = null;
                that.copy.onmousemove = null;
                that.drag(x, y, w, h, selectAreaobj)
            }
        }

    }

}