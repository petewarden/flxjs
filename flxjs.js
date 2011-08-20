/****************************

 FlxJS
 http://github.com/petewarden/flxjs

 This is a collection of 2D geometry classes implementing the Flex3 interface, originally
 created to help me port OpenHeatMap from Flash to Javascript/HTML5.
 
 I tried to emulate the Adobe classes as closely as possible, so their documentation
 is the best place to start. Here are the links for the three classes I've implemented:
 http://help.adobe.com/en_US/FlashPlatform/reference/actionscript/3/flash/geom/Matrix.html
 http://help.adobe.com/en_US/FlashPlatform/reference/actionscript/3/flash/geom/Point.html
 http://help.adobe.com/en_US/FlashPlatform/reference/actionscript/3/flash/geom/Rectangle.html
 Not all of the functions are implemented, just the ones I needed for my code. If you do
 need to implement any of the missing ones, I'm happy to accept updates from github forks.

 Licensed under the 2-clause (ie no advertising requirement) BSD license,
 making it easy to reuse for commercial or GPL projects:
 
 (c) Pete Warden <pete@petewarden.com> http://petewarden.typepad.com/ Aug 19th 2011
 
 Redistribution and use in source and binary forms, with or without modification, are
 permitted provided that the following conditions are met:

   1. Redistributions of source code must retain the above copyright notice, this 
      list of conditions and the following disclaimer.
   2. Redistributions in binary form must reproduce the above copyright notice, this 
      list of conditions and the following disclaimer in the documentation and/or 
      other materials provided with the distribution.
   3. The name of the author may not be used to endorse or promote products derived 
      from this software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE AUTHOR ``AS IS'' AND ANY EXPRESS OR IMPLIED WARRANTIES,
INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS
FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY
DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, 
BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR 
PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, 
WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) 
ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY
OF SUCH DAMAGE.

*****************************/

function Matrix(a, b, c, d, tx, ty)
{
    if (typeof a === 'undefined')
    {
        a = 1; b = 0;
        c = 0; d = 1;
        tx = 0; ty = 0;
    }
    
    this.a = a;
    this.b = b;
    this.c = c;
    this.d = d;
    this.tx = tx;
    this.ty = ty;
    
    return this;
}
    
Matrix.prototype.transformPoint = function (p) {
    var result = new Point(
        (p.x*this.a)+(p.y*this.c)+this.tx,
        (p.x*this.b)+(p.y*this.d)+this.ty
    );

    return result;
};

Matrix.prototype.translate = function (x, y) {
    this.tx += x;
    this.ty += y;
    
    return this;
};

Matrix.prototype.scale = function (x, y) {

    var scaleMatrix = new Matrix(x, 0, 0, y, 0, 0);
    this.concat(scaleMatrix);
    
    return this;
};

Matrix.prototype.concat = function (m) {

    this.copy( new Matrix(
        (this.a*m.a)+(this.b*m.c), (this.a*m.b)+(this.b*m.d),
        (this.c*m.a)+(this.d*m.c), (this.c*m.b)+(this.d*m.d),
        (this.tx*m.a)+(this.ty*m.c)+m.tx, (this.tx*m.b)+(this.ty*m.d)+m.ty
    ));
    
    return this;
};

Matrix.prototype.invert = function () {

    var adbc = ((this.a*this.d)-(this.b*this.c));

    this.copy(new Matrix(
        (this.d/adbc), (-this.b/adbc),
        (-this.c/adbc), (this.a/adbc),
        (((this.c*this.ty)-(this.d*this.tx))/adbc),
        -(((this.a*this.ty)-(this.b*this.tx))/adbc)
    ));
    
    return this;
};

Matrix.prototype.clone = function () {

    var result = new Matrix(
        this.a, this.b,
        this.c, this.d,
        this.tx, this.ty
    );
    
    return result;
};

Matrix.prototype.zoomAroundPoint = function (center, zoomFactor) {
    var translateToOrigin = new Matrix();
    translateToOrigin.translate(-center.x, -center.y);
    
    var scale = new Matrix();
    scale.scale(zoomFactor, zoomFactor);
    
    var translateFromOrigin = new Matrix();
    translateFromOrigin.translate(center.x, center.y);

    var zoom = new Matrix();
    zoom.concat(translateToOrigin);
    zoom.concat(scale);
    zoom.concat(translateFromOrigin);
    
    this.concat(zoom);
    return this;
}

Matrix.prototype.copy = function(m) {
    this.a = m.a;
    this.b = m.b;
    this.c = m.c;
    this.d = m.d;
    this.tx = m.tx;
    this.ty = m.ty;
    
    return this;
}

// See http://help.adobe.com/en_US/FlashPlatform/reference/actionscript/3/flash/geom/Point.html
function Point(x, y)
{
    if (typeof x === 'undefined')
    {
        x = 0;
        y = 0;
    }
    
    this.x = (Number)(x);
    this.y = (Number)(y);
    
    return this;
}
    
Point.prototype.add = function (p) {
    var result = new Point((this.x+p.x), (this.y+p.y));
    return result;
};

Point.prototype.subtract = function (p) {
    var result = new Point((this.x-p.x), (this.y-p.y));
    return result;
};

Point.prototype.dot = function (p) {
    var result = ((this.x*p.x)+(this.y*p.y));
    return result;
};

Point.prototype.cross = function (p) {
    var result = ((this.x*p.y)-(this.y*p.x));
    return result;
};

Point.prototype.clone = function () {
    return new Point(this.x, this.y);
};

// See http://help.adobe.com/en_US/FlashPlatform/reference/actionscript/3/flash/geom/Rectangle.html
function Rectangle(x, y, width, height)
{
    if (typeof x==='undefined')
        x = 0;

    if (typeof y==='undefined')
        y = 0;
        
    if (typeof width==='undefined')
        width = 0;

    if (typeof height==='undefined')
        height = 0;

    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    
    return this;
}

Rectangle.prototype.bottom = function(newY) {
    if (typeof newY !== 'undefined')
        this.height = (newY-this.y);
    return (this.y+this.height);
};

Rectangle.prototype.bottomRight = function() {
    return new Point(this.right(), this.bottom());
};

Rectangle.prototype.left = function(newX) {
    if (typeof newX !== 'undefined')
    {
        this.width += (this.x-newX);
        this.x = newX;
    }
    return this.x;
};

Rectangle.prototype.right = function(newX) {
    if (typeof newX !== 'undefined')
        this.width = (newX-this.x);
    return (this.x+this.width);
};

Rectangle.prototype.size = function() {
    return new Point(this.width, this.height);
};

Rectangle.prototype.top = function(newY) {
    if (typeof newY !== 'undefined')
    {
        this.height += (this.y-newY);
        this.y = newY;
    }
    return this.y;
};

Rectangle.prototype.topLeft = function() {
    return new Point(this.x, this.y);
};

Rectangle.prototype.clone = function() {
    return new Rectangle(this.x, this.y, this.width, this.height);
};

Rectangle.prototype.contains = function(x, y) {
    var isInside = 
        (x>=this.x)&&
        (y>=this.y)&&
        (x<this.right())&&
        (y<this.bottom());
    return isInside;
};

Rectangle.prototype.containsPoint = function(point) {
    return this.contains(point.x, point.y);
};

Rectangle.prototype.containsRect = function(rect) {
    var isInside = 
        (rect.x>=this.x)&&
        (rect.y>=this.y)&&
        (rect.right()<=this.right())&&
        (rect.bottom()<=this.bottom());
    return isInside;    
};

Rectangle.prototype.equals = function(toCompare) {
    var isIdentical =
        (toCompare.x===this.x)&&
        (toCompare.y===this.y)&&
        (toCompare.width===this.width)&&
        (toCompare.height===this.height);
    return isIdentical;
};

Rectangle.prototype.inflate = function(dx, dy) {
    this.x -= dx;
    this.y -= dy;
    this.width += (2*dx);
    this.height += (2*dy);
};

Rectangle.prototype.inflatePoint = function(point) {
    this.inflate(point.x, point.y);
};

Rectangle.prototype.inclusiveRangeContains = function(value, min, max) {
    var isInside =
        (value>=min)&&
        (value<=max);
        
    return isInside;
};

Rectangle.prototype.intersectRange = function(aMin, aMax, bMin, bMax) {

    var maxMin = Math.max(aMin, bMin);
    if (!this.inclusiveRangeContains(maxMin, aMin, aMax)||
        !this.inclusiveRangeContains(maxMin, bMin, bMax))
        return null;
        
    var minMax = Math.min(aMax, bMax);
    
    if (!this.inclusiveRangeContains(minMax, aMin, aMax)||
        !this.inclusiveRangeContains(minMax, bMin, bMax))
        return null;

    return { min: maxMin, max: minMax };
};

Rectangle.prototype.intersection = function(toIntersect) {
    var xSpan = this.intersectRange(
        this.x, this.right(),
        toIntersect.x, toIntersect.right());
    
    if (!xSpan)
        return null;
        
    var ySpan = this.intersectRange(
        this.y, this.bottom(),
        toIntersect.y, toIntersect.bottom());
    
    if (!ySpan)
        return null;
        
    var result = new Rectangle(
        xSpan.min,
        ySpan.min,
        (xSpan.max-xSpan.min),
        (ySpan.max-ySpan.min));
    
    return result;
};

Rectangle.prototype.intersects = function(toIntersect) {
    var intersection = this.intersection(toIntersect);
    
    return (intersection !== null);
};

Rectangle.prototype.isEmpty = function() {
    return ((this.width<=0)||(this.height<=0));
};

Rectangle.prototype.offset = function(dx, dy) {
    this.x += dx;
    this.y += dy;
};

Rectangle.prototype.offsetPoint = function(point) {
    this.offset(point.x, point.y);
};

Rectangle.prototype.setEmpty = function() {
    this.x = 0;
    this.y = 0;
    this.width = 0;
    this.height = 0;
};

Rectangle.prototype.toString = function() {
    var result = '{';
    result += '"x":'+this.x+',';
    result += '"y":'+this.y+',';
    result += '"width":'+this.width+',';
    result += '"height":'+this.height+'}';
    
    return result;
};

Rectangle.prototype.union = function(toUnion) {
    var minX = Math.min(toUnion.x, this.x);
    var maxX = Math.max(toUnion.right(), this.right());
    var minY = Math.min(toUnion.y, this.y);
    var maxY = Math.max(toUnion.bottom(), this.bottom());

    var result = new Rectangle(
        minX,
        minY,
        (maxX-minX),
        (maxY-minY));
    
    return result;
};
