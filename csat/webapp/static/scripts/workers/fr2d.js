/**
 * @author mrdoob / http://mrdoob.com/
 * @author *kile / http://kile.stravaganza.org/
 * @author philogb / http://blog.thejit.org/
 * @author mikael emtinger / http://gomo.se/
 * @author egraether / http://egraether.com/
 * @author WestLangley / http://github.com/WestLangley
 */

Vector3 = function ( x, y, z ) {

	this.x = x || 0;
	this.y = y || 0;
	this.z = z || 0;

};

Vector3.prototype = {

	constructor: Vector3,

	set: function ( x, y, z ) {

		this.x = x;
		this.y = y;
		this.z = z;

		return this;

	},

	setX: function ( x ) {

		this.x = x;

		return this;

	},

	setY: function ( y ) {

		this.y = y;

		return this;

	},

	setZ: function ( z ) {

		this.z = z;

		return this;

	},

	setComponent: function ( index, value ) {

		switch ( index ) {

			case 0: this.x = value; break;
			case 1: this.y = value; break;
			case 2: this.z = value; break;
			default: throw new Error( "index is out of range: " + index );

		}

	},

	getComponent: function ( index ) {

		switch ( index ) {

			case 0: return this.x;
			case 1: return this.y;
			case 2: return this.z;
			default: throw new Error( "index is out of range: " + index );

		}

	},

	copy: function ( v ) {

		this.x = v.x;
		this.y = v.y;
		this.z = v.z;

		return this;

	},

	add: function ( v, w ) {

		if ( w !== undefined ) {

			console.warn( 'DEPRECATED: Vector3\'s .add() now only accepts one argument. Use .addVectors( a, b ) instead.' );
			return this.addVectors( v, w );

		}

		this.x += v.x;
		this.y += v.y;
		this.z += v.z;

		return this;

	},

	addScalar: function ( s ) {

		this.x += s;
		this.y += s;
		this.z += s;

		return this;

	},

	addVectors: function ( a, b ) {

		this.x = a.x + b.x;
		this.y = a.y + b.y;
		this.z = a.z + b.z;

		return this;

	},

	sub: function ( v, w ) {

		if ( w !== undefined ) {

			console.warn( 'DEPRECATED: Vector3\'s .sub() now only accepts one argument. Use .subVectors( a, b ) instead.' );
			return this.subVectors( v, w );

		}

		this.x -= v.x;
		this.y -= v.y;
		this.z -= v.z;

		return this;

	},

	subVectors: function ( a, b ) {

		this.x = a.x - b.x;
		this.y = a.y - b.y;
		this.z = a.z - b.z;

		return this;

	},

	multiply: function ( v, w ) {

		if ( w !== undefined ) {

			console.warn( 'DEPRECATED: Vector3\'s .multiply() now only accepts one argument. Use .multiplyVectors( a, b ) instead.' );
			return this.multiplyVectors( v, w );

		}

		this.x *= v.x;
		this.y *= v.y;
		this.z *= v.z;

		return this;

	},

	multiplyScalar: function ( s ) {

		this.x *= s;
		this.y *= s;
		this.z *= s;

		return this;

	},

	multiplyVectors: function ( a, b ) {

		this.x = a.x * b.x;
		this.y = a.y * b.y;
		this.z = a.z * b.z;

		return this;

	},

	divide: function ( v ) {

		this.x /= v.x;
		this.y /= v.y;
		this.z /= v.z;

		return this;

	},

	divideScalar: function ( s ) {

		if ( s !== 0 ) {

			this.x /= s;
			this.y /= s;
			this.z /= s;

		} else {

			this.x = 0;
			this.y = 0;
			this.z = 0;

		}

		return this;

	},

	min: function ( v ) {

		if ( this.x > v.x ) {

			this.x = v.x;

		}

		if ( this.y > v.y ) {

			this.y = v.y;

		}

		if ( this.z > v.z ) {

			this.z = v.z;

		}

		return this;

	},

	max: function ( v ) {

		if ( this.x < v.x ) {

			this.x = v.x;

		}

		if ( this.y < v.y ) {

			this.y = v.y;

		}

		if ( this.z < v.z ) {

			this.z = v.z;

		}

		return this;

	},

	clamp: function ( min, max ) {

		// This function assumes min < max, if this assumption isn't true it will not operate correctly

		if ( this.x < min.x ) {

			this.x = min.x;

		} else if ( this.x > max.x ) {

			this.x = max.x;

		}

		if ( this.y < min.y ) {

			this.y = min.y;

		} else if ( this.y > max.y ) {

			this.y = max.y;

		}

		if ( this.z < min.z ) {

			this.z = min.z;

		} else if ( this.z > max.z ) {

			this.z = max.z;

		}

		return this;

	},

	negate: function () {

		return this.multiplyScalar( - 1 );

	},

	dot: function ( v ) {

		return this.x * v.x + this.y * v.y + this.z * v.z;

	},

	lengthSq: function () {

		return this.x * this.x + this.y * this.y + this.z * this.z;

	},

	length: function () {

		return Math.sqrt( this.x * this.x + this.y * this.y + this.z * this.z );

	},

	lengthManhattan: function () {

		return Math.abs( this.x ) + Math.abs( this.y ) + Math.abs( this.z );

	},

	normalize: function () {

		return this.divideScalar( this.length() );

	},

	setLength: function ( l ) {

		var oldLength = this.length();

		if ( oldLength !== 0 && l !== oldLength  ) {

			this.multiplyScalar( l / oldLength );
		}

		return this;

	},

	lerp: function ( v, alpha ) {

		this.x += ( v.x - this.x ) * alpha;
		this.y += ( v.y - this.y ) * alpha;
		this.z += ( v.z - this.z ) * alpha;

		return this;

	},

	cross: function ( v, w ) {

		if ( w !== undefined ) {

			console.warn( 'DEPRECATED: Vector3\'s .cross() now only accepts one argument. Use .crossVectors( a, b ) instead.' );
			return this.crossVectors( v, w );

		}

		var x = this.x, y = this.y, z = this.z;

		this.x = y * v.z - z * v.y;
		this.y = z * v.x - x * v.z;
		this.z = x * v.y - y * v.x;

		return this;

	},

	crossVectors: function ( a, b ) {

		this.x = a.y * b.z - a.z * b.y;
		this.y = a.z * b.x - a.x * b.z;
		this.z = a.x * b.y - a.y * b.x;

		return this;

	},

	angleTo: function ( v ) {

		var theta = this.dot( v ) / ( this.length() * v.length() );

		// clamp, to handle numerical problems

		var clamp = function ( x, a, b ) {
			return ( x < a ) ? a : ( ( x > b ) ? b : x );
		}

		return Math.acos( clamp( theta, -1, 1 ) );

	},

	distanceTo: function ( v ) {

		return Math.sqrt( this.distanceToSquared( v ) );

	},

	distanceToSquared: function ( v ) {

		var dx = this.x - v.x;
		var dy = this.y - v.y;
		var dz = this.z - v.z;

		return dx * dx + dy * dy + dz * dz;

	},

	setEulerFromRotationMatrix: function ( m, order ) {

		// assumes the upper 3x3 of m is a pure rotation matrix (i.e, unscaled)

		// clamp, to handle numerical problems

		function clamp( x ) {

			return Math.min( Math.max( x, -1 ), 1 );

		}

		var te = m.elements;
		var m11 = te[0], m12 = te[4], m13 = te[8];
		var m21 = te[1], m22 = te[5], m23 = te[9];
		var m31 = te[2], m32 = te[6], m33 = te[10];

		if ( order === undefined || order === 'XYZ' ) {

			this.y = Math.asin( clamp( m13 ) );

			if ( Math.abs( m13 ) < 0.99999 ) {

				this.x = Math.atan2( - m23, m33 );
				this.z = Math.atan2( - m12, m11 );

			} else {

				this.x = Math.atan2( m32, m22 );
				this.z = 0;

			}

		} else if ( order === 'YXZ' ) {

			this.x = Math.asin( - clamp( m23 ) );

			if ( Math.abs( m23 ) < 0.99999 ) {

				this.y = Math.atan2( m13, m33 );
				this.z = Math.atan2( m21, m22 );

			} else {

				this.y = Math.atan2( - m31, m11 );
				this.z = 0;

			}

		} else if ( order === 'ZXY' ) {

			this.x = Math.asin( clamp( m32 ) );

			if ( Math.abs( m32 ) < 0.99999 ) {

				this.y = Math.atan2( - m31, m33 );
				this.z = Math.atan2( - m12, m22 );

			} else {

				this.y = 0;
				this.z = Math.atan2( m21, m11 );

			}

		} else if ( order === 'ZYX' ) {

			this.y = Math.asin( - clamp( m31 ) );

			if ( Math.abs( m31 ) < 0.99999 ) {

				this.x = Math.atan2( m32, m33 );
				this.z = Math.atan2( m21, m11 );

			} else {

				this.x = 0;
				this.z = Math.atan2( - m12, m22 );

			}

		} else if ( order === 'YZX' ) {

			this.z = Math.asin( clamp( m21 ) );

			if ( Math.abs( m21 ) < 0.99999 ) {

				this.x = Math.atan2( - m23, m22 );
				this.y = Math.atan2( - m31, m11 );

			} else {

				this.x = 0;
				this.y = Math.atan2( m13, m33 );

			}

		} else if ( order === 'XZY' ) {

			this.z = Math.asin( - clamp( m12 ) );

			if ( Math.abs( m12 ) < 0.99999 ) {

				this.x = Math.atan2( m32, m22 );
				this.y = Math.atan2( m13, m11 );

			} else {

				this.x = Math.atan2( - m23, m33 );
				this.y = 0;

			}

		}

		return this;

	},

	setEulerFromQuaternion: function ( q, order ) {

		// q is assumed to be normalized

		// clamp, to handle numerical problems

		function clamp( x ) {

			return Math.min( Math.max( x, -1 ), 1 );

		}

		// http://www.mathworks.com/matlabcentral/fileexchange/20696-function-to-convert-between-dcm-euler-angles-quaternions-and-euler-vectors/content/SpinCalc.m

		var sqx = q.x * q.x;
		var sqy = q.y * q.y;
		var sqz = q.z * q.z;
		var sqw = q.w * q.w;

		if ( order === undefined || order === 'XYZ' ) {

			this.x = Math.atan2( 2 * ( q.x * q.w - q.y * q.z ), ( sqw - sqx - sqy + sqz ) );
			this.y = Math.asin(  clamp( 2 * ( q.x * q.z + q.y * q.w ) ) );
			this.z = Math.atan2( 2 * ( q.z * q.w - q.x * q.y ), ( sqw + sqx - sqy - sqz ) );

		} else if ( order ===  'YXZ' ) {

			this.x = Math.asin(  clamp( 2 * ( q.x * q.w - q.y * q.z ) ) );
			this.y = Math.atan2( 2 * ( q.x * q.z + q.y * q.w ), ( sqw - sqx - sqy + sqz ) );
			this.z = Math.atan2( 2 * ( q.x * q.y + q.z * q.w ), ( sqw - sqx + sqy - sqz ) );

		} else if ( order === 'ZXY' ) {

			this.x = Math.asin(  clamp( 2 * ( q.x * q.w + q.y * q.z ) ) );
			this.y = Math.atan2( 2 * ( q.y * q.w - q.z * q.x ), ( sqw - sqx - sqy + sqz ) );
			this.z = Math.atan2( 2 * ( q.z * q.w - q.x * q.y ), ( sqw - sqx + sqy - sqz ) );

		} else if ( order === 'ZYX' ) {

			this.x = Math.atan2( 2 * ( q.x * q.w + q.z * q.y ), ( sqw - sqx - sqy + sqz ) );
			this.y = Math.asin(  clamp( 2 * ( q.y * q.w - q.x * q.z ) ) );
			this.z = Math.atan2( 2 * ( q.x * q.y + q.z * q.w ), ( sqw + sqx - sqy - sqz ) );

		} else if ( order === 'YZX' ) {

			this.x = Math.atan2( 2 * ( q.x * q.w - q.z * q.y ), ( sqw - sqx + sqy - sqz ) );
			this.y = Math.atan2( 2 * ( q.y * q.w - q.x * q.z ), ( sqw + sqx - sqy - sqz ) );
			this.z = Math.asin(  clamp( 2 * ( q.x * q.y + q.z * q.w ) ) );

		} else if ( order === 'XZY' ) {

			this.x = Math.atan2( 2 * ( q.x * q.w + q.y * q.z ), ( sqw - sqx + sqy - sqz ) );
			this.y = Math.atan2( 2 * ( q.x * q.z + q.y * q.w ), ( sqw + sqx - sqy - sqz ) );
			this.z = Math.asin(  clamp( 2 * ( q.z * q.w - q.x * q.y ) ) );

		}

		return this;

	},

	getPositionFromMatrix: function ( m ) {

		this.x = m.elements[12];
		this.y = m.elements[13];
		this.z = m.elements[14];

		return this;

	},

	getScaleFromMatrix: function ( m ) {

		var sx = this.set( m.elements[0], m.elements[1], m.elements[2] ).length();
		var sy = this.set( m.elements[4], m.elements[5], m.elements[6] ).length();
		var sz = this.set( m.elements[8], m.elements[9], m.elements[10] ).length();

		this.x = sx;
		this.y = sy;
		this.z = sz;

		return this;
	},

	getColumnFromMatrix: function ( index, matrix ) {

		var offset = index * 4;

		var me = matrix.elements;

		this.x = me[ offset ];
		this.y = me[ offset + 1 ];
		this.z = me[ offset + 2 ];

		return this;

	},

	equals: function ( v ) {

		return ( ( v.x === this.x ) && ( v.y === this.y ) && ( v.z === this.z ) );

	},

	fromArray: function ( array ) {

		this.x = array[ 0 ];
		this.y = array[ 1 ];
		this.z = array[ 2 ];

		return this;

	},

	toArray: function () {

		return [ this.x, this.y, this.z ];

	},

	clone: function () {

		return new Vector3( this.x, this.y, this.z );

	}
};

var ArrayIterator, ArrayPropertyIterator, Base64Binary, EventDispatcher, FlattenIterator, IterativeLayoutWorker, IteratorFactory, LayoutWorker, StopIteration, flatten, getColor, makeArray, today,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __slice = [].slice,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Base64Binary = (function() {

  function Base64Binary() {}

  Base64Binary._keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";

  Base64Binary.decodeArrayBuffer = function(input) {
    var ab, bytes;
    bytes = (input.length / 4) * 3;
    ab = new ArrayBuffer(bytes);
    Base64Binary.decode(input, ab);
    return ab;
  };

  Base64Binary.decode = function(input, arrayBuffer) {
    var bytes, chr1, chr2, chr3, enc1, enc2, enc3, enc4, i, j, lkey1, lkey2, uarray, _i;
    lkey1 = Base64Binary._keyStr.indexOf(input.charAt(input.length - 1));
    lkey2 = Base64Binary._keyStr.indexOf(input.charAt(input.length - 2));
    bytes = (input.length / 4) * 3;
    if (lkey1 === 64) {
      bytes--;
    }
    if (lkey2 === 64) {
      bytes--;
    }
    if (arrayBuffer) {
      uarray = new Uint8Array(arrayBuffer);
    } else {
      uarray = new Uint8Array(bytes);
    }
    input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
    j = 0;
    for (i = _i = 0; _i <= bytes; i = _i += 3) {
      enc1 = Base64Binary._keyStr.indexOf(input.charAt(j++));
      enc2 = Base64Binary._keyStr.indexOf(input.charAt(j++));
      enc3 = Base64Binary._keyStr.indexOf(input.charAt(j++));
      enc4 = Base64Binary._keyStr.indexOf(input.charAt(j++));
      chr1 = (enc1 << 2) | (enc2 >> 4);
      chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
      chr3 = ((enc3 & 3) << 6) | enc4;
      uarray[i] = chr1;
      if (enc3 !== 64) {
        uarray[i + 1] = chr2;
      }
      if (enc4 !== 64) {
        uarray[i + 2] = chr3;
      }
    }
    return uarray;
  };

  return Base64Binary;

})();

EventDispatcher = (function() {

  function EventDispatcher() {
    this.fire = __bind(this.fire, this);

    this.off = __bind(this.off, this);

    this.on = __bind(this.on, this);
    this._callbacks = {};
  }

  EventDispatcher.prototype.on = function(event, handler) {
    if (!(this._callbacks[event] != null)) {
      this._callbacks[event] = $.Callbacks();
    }
    this._callbacks[event].add(handler);
    return this;
  };

  EventDispatcher.prototype.off = function(event, handler) {
    if (this._callbacks[event] != null) {
      this._callbacks[event].remove(handler);
    }
    return this;
  };

  EventDispatcher.prototype.fire = function() {
    var args, event;
    event = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
    if (this._callbacks[event] != null) {
      this._callbacks[event].fire.apply(this, args);
    }
    return this;
  };

  return EventDispatcher;

})();

flatten = function() {
  var args;
  args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
  return new IteratorFactory(FlattenIterator, [args]);
};

today = function() {
  var d;
  d = new Date();
  return "" + (d.getFullYear()) + "-" + (d.getMonth()) + "-" + (d.getDate());
};

getColor = function(x, y, w, h, pixels) {
  var color, pixel;
  pixel = (x + y * w) * 4;
  color = [pixels.data[pixel + 0], pixels.data[pixel + 1], pixels.data[pixel + 2], pixels.data[pixel + 3]];
  return color;
};

StopIteration = (function(_super) {

  __extends(StopIteration, _super);

  function StopIteration() {
    return StopIteration.__super__.constructor.apply(this, arguments);
  }

  return StopIteration;

})(Error);

Object.defineProperty(Object.prototype, 'iter', {
  value: function(cb) {
    var i, iterator;
    iterator = this.__iterator__();
    i = 0;
    while (true) {
      try {
        cb(iterator.next(), i);
        i += 1;
      } catch (e) {
        if (e === StopIteration) {
          break;
        } else {
          throw e;
        }
      }
    }
  },
  enumerable: false
});

Object.defineProperty(String.prototype, 'endswith', {
  value: function(suffix) {
    return this.indexOf(suffix, this.length - suffix.length) !== -1;
  },
  enumerable: false
});

IteratorFactory = (function() {

  function IteratorFactory(iteratorClass, _arguments) {
    this.iteratorClass = iteratorClass;
    this["arguments"] = _arguments;
  }

  IteratorFactory.prototype.__iterator__ = function() {
    var construct;
    construct = function(iterClass, args) {
      return iterClass.apply(this, args);
    };
    construct.prototype = this.iteratorClass.prototype;
    return new construct(this.iteratorClass, this["arguments"]);
  };

  return IteratorFactory;

})();

ArrayIterator = (function() {

  function ArrayIterator(array) {
    this.array = array;
    this.index = 0;
  }

  ArrayIterator.prototype.next = function() {
    if (this.index >= this.array.length) {
      throw StopIteration;
    } else {
      return this.array[this.index++];
    }
  };

  return ArrayIterator;

})();

Object.defineProperty(Array.prototype, '__iterator__', {
  value: function() {
    return new ArrayIterator(this);
  },
  enumerable: false
});

ArrayPropertyIterator = (function() {

  function ArrayPropertyIterator(array, property) {
    this.array = array;
    this.property = property;
    this.itemIndex = 0;
    this.subitemIndex = 0;
  }

  ArrayPropertyIterator.prototype.next = function() {
    var subitems;
    while (this.itemIndex < this.array.length) {
      subitems = this.array[this.itemIndex][this.property];
      if (this.subitemIndex >= subitems.length) {
        this.itemIndex += 1;
        this.subitemIndex = 0;
      } else {
        return subitems[this.subitemIndex++];
      }
    }
    throw StopIteration;
  };

  return ArrayPropertyIterator;

})();

FlattenIterator = (function() {

  function FlattenIterator(iterators) {
    this.iterators = iterators;
    this.currentIteratorIndex = 0;
  }

  FlattenIterator.prototype.next = function() {
    while (true) {
      if (this.currentIteratorIndex >= this.iterators.length) {
        throw StopIteration;
      }
      if (!this.currentIterator) {
        this.currentIterator = this.iterators[this.currentIteratorIndex].__iterator__();
      }
      try {
        return this.currentIterator.next();
      } catch (e) {
        if (e === StopIteration) {
          this.currentIteratorIndex++;
          this.currentIterator = void 0;
          continue;
        } else {
          throw e;
        }
      }
    }
  };

  return FlattenIterator;

})();

makeArray = function(type, length) {
  var buffer;
  buffer = new ArrayBuffer(type.BYTES_PER_ELEMENT * length);
  return new type(buffer);
};

LayoutWorker = (function() {

  function LayoutWorker() {
    this.handleMessage = __bind(this.handleMessage, this);

  }

  LayoutWorker.prototype.remote_updateNodes = function(dom, posx, posy, posz) {
    var domain, domains, i, nodes, position, _i, _len;
    domains = new Uint8Array(dom);
    posx = new Float32Array(posx);
    posy = new Float32Array(posy);
    posz = new Float32Array(posz);
    nodes = [];
    for (i = _i = 0, _len = domains.length; _i < _len; i = ++_i) {
      domain = domains[i];
      position = new Vector3(posx[i], posy[i], posz[i]);
      nodes.push({
        domain: domain,
        position: position
      });
    }
    return this.nodes = nodes;
  };

  LayoutWorker.prototype.remote_updateEdges = function(src, dst) {
    var edges, i, nodes, s, _i, _len;
    src = new Uint32Array(src);
    dst = new Uint32Array(dst);
    nodes = this.nodes;
    edges = [];
    for (i = _i = 0, _len = src.length; _i < _len; i = ++_i) {
      s = src[i];
      edges.push([nodes[src[i]], nodes[dst[i]]]);
    }
    return this.edges = edges;
  };

  LayoutWorker.prototype.remote_setProperty = function(name, value) {};

  LayoutWorker.prototype.remote_run = function() {
    return this.run();
  };

  LayoutWorker.prototype.remote_pause = function() {
    return this.pause();
  };

  LayoutWorker.prototype.remote_stop = function() {
    return this.stop();
  };

  LayoutWorker.prototype.sendUpdate = function(force) {
    var nodes, posx, posy, posz;
    if (force == null) {
      force = false;
    }
    if (!force) {
      if (this.lastUpdate != null) {
        if (Date.now() - this.lastUpdate < this.minUpdateInterval) {
          return;
        }
      }
    }
    nodes = this.nodes;
    posx = makeArray(Float32Array, nodes.length);
    posy = makeArray(Float32Array, nodes.length);
    posz = makeArray(Float32Array, nodes.length);
    this.nodes.iter(function(n, i) {
      posx[i] = n.position.x;
      posy[i] = n.position.y;
      return posz[i] = n.position.z;
    });
    this.sendMessage('updatePositions', [posx.buffer, posy.buffer, posz.buffer], [posx.buffer, posy.buffer, posz.buffer]);
    return this.lastUpdate = Date.now();
  };

  LayoutWorker.prototype.handleMessage = function(msg) {
    var args, func, method;
    method = "remote_" + msg.data[0];
    args = msg.data.slice(1);
    func = this[method];
    if (!(func != null)) {
      throw "Invalid method: " + method;
    }
    return func.apply(this, args);
  };

  LayoutWorker.prototype.sendMessage = function(method, args, transfer) {
    var msg;
    if (args == null) {
      args = [];
    }
    if (transfer == null) {
      transfer = [];
    }
    msg = args.slice(0);
    msg.unshift(method);
    return postMessage(msg, transfer);
  };

  return LayoutWorker;

})();

IterativeLayoutWorker = (function(_super) {

  __extends(IterativeLayoutWorker, _super);

  function IterativeLayoutWorker() {
    IterativeLayoutWorker.__super__.constructor.apply(this, arguments);
    this.interval = 0;
    this.iterations = 100000;
    this.minUpdateInterval = 50;
  }

  IterativeLayoutWorker.prototype.run = function() {
    var runloop,
      _this = this;
    this.stopRequested = false;
    this.pauseRequested = false;
    this.iteration = 0;
    this.sendMessage('started');
    this.initialize();
    runloop = function() {
      if (_this.stopRequested) {
        return _this.sendMessage('stopped', [true]);
      } else if (_this.pauseRequested) {
        return _this.sendMessage('stopped', [false]);
      } else {
        _this.step();
        _this.iteration++;
        _this.sendUpdate();
        if (_this.iteration >= _this.iterations) {
          _this.stop();
        }
        return setTimeout(runloop, _this.interval);
      }
    };
    return runloop();
  };

  IterativeLayoutWorker.prototype.initialize = function() {};

  IterativeLayoutWorker.prototype.step = function() {};

  IterativeLayoutWorker.prototype.stop = function() {
    return this.stopRequested = true;
  };

  IterativeLayoutWorker.prototype.pause = function() {
    return this.pauseRequested = true;
  };

  IterativeLayoutWorker.prototype.remote_step = function() {
    this.initialize();
    this.iteration++;
    return this.sendUpdate();
  };

  return IterativeLayoutWorker;

})(LayoutWorker);

var FR2DWorker, onmessage,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

FR2DWorker = (function(_super) {

  __extends(FR2DWorker, _super);

  function FR2DWorker() {
    FR2DWorker.__super__.constructor.apply(this, arguments);
    this.iterations = Infinity;
    this.temperature = 1;
    this.nodes = [];
    this.edges = [];
  }

  FR2DWorker.prototype.initialize = function() {
    var _this = this;
    return this.nodes.iter(function(node) {
      return node.position.add(new Vector3(Math.random() / 1000, Math.random() / 1000, Math.random() / 1000));
    });
  };

  FR2DWorker.prototype.step = function() {
    this.count = 0;
    this.calculateForces(this.k);
    return this.applyPositions(this.radius);
  };

  FR2DWorker.prototype.remote_setProperty = function(name, value) {
    switch (name) {
      case 'k':
        return this.k = value;
      case 'iterations':
        return this.iterations = value;
      case 'radius':
        return this.radius = value;
      case 'temperature':
        return this.temperature = value;
      case 'axis':
        this.switchAxis(this.axis, value);
        return this.axis = value;
    }
  };

  FR2DWorker.prototype.switchAxis = function(oldAxis, newAxis) {
    var _this = this;
    return this.nodes.iter(function(node) {
      var p;
      p = node.position;
      p.setComponent(oldAxis, p.getComponent(newAxis));
      return p.setComponent(newAxis, 0);
    });
  };

  FR2DWorker.prototype.calculateRepulsion = function(k) {
    var _this = this;
    k = k * k;
    return this.nodes.iter(function(v) {
      var f;
      v.force = f = new Vector3(0, 0, 0);
      _this.nodes.iter(function(u) {
        var d, l;
        if (u === v) {
          return;
        }
        d = v.position.clone().sub(u.position);
        l = d.length();
        if (l === 0) {
          d = new Vector3(Math.random(), Math.random(), Math.random());
          d.setComponent(_this.axis, 0);
          l = d.length();
        }
        return f.sub(d.setLength(-k / l));
      });
      return _this.count++;
    });
  };

  FR2DWorker.prototype.calculateAttraction = function(k) {
    var _this = this;
    k = 2 / k;
    return this.edges.iter(function(_arg) {
      var d, f, l, u, v;
      u = _arg[0], v = _arg[1];
      d = v.position.clone().sub(u.position);
      l = d.length();
      f = d.setLength(l * l * k);
      v.force.sub(d);
      u.force.add(f);
      return _this.count++;
    });
  };

  FR2DWorker.prototype.calculateForces = function(k) {
    this.calculateRepulsion(k);
    return this.calculateAttraction(k);
  };

  FR2DWorker.prototype.applyPositions = function(radius) {
    var fmax, fmax2, r, temp,
      _this = this;
    r = radius * radius;
    fmax = radius / 2;
    fmax2 = Math.pow(fmax, 2);
    temp = (1 - this.iteration / this.iterations) * this.temperature / this.count;
    return this.nodes.iter(function(node) {
      var d, p;
      d = node.force.multiplyScalar(temp);
      if (d.lengthSq() > fmax2) {
        d.setLength(fmax);
      }
      p = node.position.add(d);
      if (p.lengthSq() > r) {
        p.setLength(radius);
      }
      return p.setComponent(_this.axis, 0);
    });
  };

  return FR2DWorker;

})(IterativeLayoutWorker);

onmessage = new FR2DWorker().handleMessage;
