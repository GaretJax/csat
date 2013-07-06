var ArrayIterator, ArrayPropertyIterator, Base64Binary, BasicInfoPanel, BezierColorEditor, BezierEditor, ClusteredGraphRenderer, ClusteredStrategy, Domain, DomainEdgesDirectionObject, DomainEdgesIterator, DomainEdgesObject, DomainFRLayout2DFactory, DomainFruchtermanReingoldLayout2D, DomainLabelsObject, DomainNodesObject, DomainStrategy, DomainsPanel, E, Edge, EventDispatcher, ExportPanel, ExtrudedGraphRenderer, ExtrudedStrategy, FRLayout2DAsync, FRLayout2DAsyncFactory, FRLayout2DFactory, FRLayout3DFactory, FlattenIterator, Form, FruchtermanReingoldLayout2D, FruchtermanReingoldLayout3D, GEXFExporter, GenericOptionsPanel, GraphModel, GraphRenderer, IterativeLayout, IteratorFactory, LabelsDisplaySettings, Layout, LayoutConfigPanel, LayoutConfigurator, LayoutFactory, ModalPanel, MultipleViewportsRenderer, NeighborsIterator, Node, NodeInfoPanel, NodesDisplaySettings, ObjectControls, Panel, PartitionedGraphRenderer, RandomLayout, RandomLayoutFactory, RotatingViewport, SingleStrategy, StackedLayout, StackedLayoutFactory, StatsPanel, StopIteration, Strategy, StrategyConfigurator, ThumbnailPanel, Viewer, Viewport, VisualizationSettings, WorkerLayout, flatten, geo2line, getColor, later, makeCircle, makeCirclePlane, makePositionAxis, makePositionIndicator, makeSettingsTab, parseIds, removeSettingsTab, setattrs, today,
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

BezierEditor = (function() {

  function BezierEditor(width, height, min, max) {
    this.min = min;
    this.max = max;
    this._redraw = __bind(this._redraw, this);

    this._positionFromEvent = __bind(this._positionFromEvent, this);

    this.setMax = __bind(this.setMax, this);

    this.setMin = __bind(this.setMin, this);

    this._overscale = 2;
    this._handleRadius = 8;
    this.minY = 2;
    this.maxY = 10;
    this.padding = [20, 40, 120, 40];
    this.changed = $.Callbacks();
    this.width = width * this._overscale;
    this.height = height * this._overscale;
    this.framewidth = this.width - this.padding[1] - this.padding[3];
    this.frameheight = this.height - this.padding[0] - this.padding[2];
    this.c1 = [this.framewidth * 0.6666, this.frameheight * 0.1];
    this.c2 = [this.framewidth * 0.3333, this.frameheight * 0.9];
    this._build();
  }

  BezierEditor.prototype.setInterval = function(min, max) {
    this.min = min;
    this.max = max;
    this._redraw(this.ctx);
    this.changed.fire(this.getFunction());
    return this;
  };

  BezierEditor.prototype.getFunction = function() {
    var b_t_x, b_t_y, b_x, c1x, c1y, c2x, c2y, h, max, maxY, min, minY, w;
    w = this.framewidth;
    h = this.frameheight;
    max = this.max;
    min = this.min;
    maxY = this.maxY;
    minY = this.minY;
    c1x = this.c1[0] * 1.0 / w * (max - min) + min;
    c2x = this.c2[0] * 1.0 / w * (max - min) + min;
    c1y = this.c1[1] * 1.0 / h * (maxY - minY) + minY;
    c2y = this.c2[1] * 1.0 / h * (maxY - minY) + minY;
    b_t_y = function(t) {
      var p0, p1, p2, p3, t1, t2, t3;
      t1 = 1 - t;
      t2 = t1 * t1;
      t3 = t1 * t2;
      p0 = t3 * minY;
      p1 = 3 * t2 * t * c1y;
      p2 = 3 * t1 * t * t * c2y;
      p3 = t * t * t * maxY;
      return p0 + p1 + p2 + p3;
    };
    b_t_x = function(t) {
      var p0, p1, p2, p3, t1, t2, t3;
      t1 = 1 - t;
      t2 = t1 * t1;
      t3 = t2 * t1;
      p0 = t3 * min;
      p1 = 3 * t2 * t * c1x;
      p2 = 3 * t1 * t * t * c2x;
      p3 = t * t * t * max;
      return p0 + p1 + p2 + p3;
    };
    return b_x = function(x) {
      var e, i, t, ta, tb, xt;
      ta = 0.0;
      tb = 1.0;
      e = Infinity;
      i = 500;
      x *= 1.0;
      while (e > 0.0000001 && i > 0) {
        t = (tb + ta) / 2.0;
        xt = b_t_x(t);
        if (xt > x) {
          tb = t;
        } else {
          ta = t;
        }
        e = Math.abs(x - xt);
        i--;
      }
      return b_t_y(t);
    };
  };

  BezierEditor.prototype.setMin = function(minY) {
    this.minY = minY;
    return this.changed.fire(this.getFunction());
  };

  BezierEditor.prototype.setMax = function(maxY) {
    this.maxY = maxY;
    return this.changed.fire(this.getFunction());
  };

  BezierEditor.prototype._positionFromEvent = function(e) {
    var inside, o, x, y;
    o = this.canvas.offset();
    inside = true;
    x = (e.pageX - o.left) * this._overscale - this.padding[3];
    if (x < 0 || x > this.framewidth) {
      inside = false;
    }
    x = Math.min(this.framewidth - 2.5, x);
    x = Math.max(2.5, x);
    y = (this.height - (e.pageY - o.top) * this._overscale) - this.padding[2];
    if (y < 0 || y > this.height - this.padding[2] - this.padding[0]) {
      inside = false;
    }
    y = Math.min(this.frameheight - 2.5, y);
    y = Math.max(2.5, y);
    return [[x, y], inside];
  };

  BezierEditor.prototype._buildCanvas = function() {
    var distSq,
      _this = this;
    distSq = function(p1, p2) {
      var dx, dy;
      dx = p1[0] - p2[0];
      dy = p1[1] - p2[1];
      return dx * dx + dy * dy;
    };
    return $('<canvas/>').width(this.width / this._overscale).height(this.height / this._overscale).on('mousedown', function(e) {
      var candidate, d, d1, d2, inside, p, _ref;
      e.preventDefault();
      _ref = _this._positionFromEvent(e), p = _ref[0], inside = _ref[1];
      if (!inside) {
        return;
      }
      d1 = distSq(p, _this.c1);
      d2 = distSq(p, _this.c2);
      if (d1 < d2) {
        d = d1;
        candidate = _this.c1;
      } else {
        d = d2;
        candidate = _this.c2;
      }
      if (1 || d < Math.pow(100 * _this._overscale, 2)) {
        _this._target = candidate;
      } else {
        _this._target = void 0;
      }
      _this._target[0] = p[0], _this._target[1] = p[1];
      if (_this._target) {
        $(window).on('mousemove.bezier', function(e) {
          var _ref1;
          e.preventDefault();
          _ref1 = _this._positionFromEvent(e)[0], _this._target[0] = _ref1[0], _this._target[1] = _ref1[1];
          return _this._redraw(_this.ctx);
        }).on('mouseup.bezier', function() {
          var f;
          e.preventDefault();
          _this._target = void 0;
          _this._redraw(_this.ctx);
          $(window).off('mousemove.bezier').off('mouseup.bezier');
          f = _this.getFunction();
          return _this.changed.fire(f);
        });
        return _this._redraw(_this.ctx);
      }
    });
  };

  BezierEditor.prototype._buildForm = function() {
    var _this = this;
    return Form.makeForm('nodes-display-settings', {
      minsize: {
        label: 'Min',
        type: 'float',
        initial: this.minY,
        setter: 'setMin'
      },
      maxsize: {
        label: 'Max',
        type: 'float',
        initial: this.maxY,
        setter: 'setMax'
      }
    }, function(key, val, field) {
      return _this[field.setter](val);
    }).width(this.width / this._overscale);
  };

  BezierEditor.prototype._build = function() {
    var canvas;
    this.canvas = this._buildCanvas();
    canvas = this.canvas.get(0);
    canvas.width = this.width;
    canvas.height = this.height;
    this.ctx = canvas.getContext('2d');
    this.ctx.webkitImageSmoothingEnabled = true;
    this.form = this._buildForm();
    this.element = $('<div/>').addClass('bezier-editor').append(this.canvas).append(this.form);
    return this._redraw(this.ctx);
  };

  BezierEditor.prototype._reset = function() {
    return this.canvas.get(0).width = this.canvas.get(0).width;
  };

  BezierEditor.prototype._redraw = function(ctx) {
    var drawFrame, drawFunction, drawGrid, drawHandles, drawIndicators,
      _this = this;
    this._reset();
    drawGrid = function(ctx, x, y, w, h, min, max) {
      var col, cols, p, row, rows, xi, yi, _i, _j;
      ctx.fillStyle = "#fff";
      ctx.fillRect(x + 0.5, y + 0.5, w - 1, h - 1);
      ctx.beginPath();
      cols = 3;
      for (col = _i = 1; 1 <= cols ? _i < cols : _i > cols; col = 1 <= cols ? ++_i : --_i) {
        p = Math.round((max - min) * col / cols + min);
        xi = Math.round(col * w / cols) + x;
        ctx.moveTo(xi, y);
        ctx.lineTo(xi, y + h);
        ctx.fillStyle = '#888888';
        ctx.font = "normal " + (12 * _this._overscale) + "px menlo";
        ctx.textBaseline = 'top';
        ctx.textAlign = "center";
        ctx.fillText(p, xi, h + y + 1);
      }
      rows = 3;
      for (row = _j = 1; 1 <= rows ? _j < rows : _j > rows; row = 1 <= rows ? ++_j : --_j) {
        yi = 0.5 + Math.round(row * h / cols) + y;
        ctx.moveTo(x, yi);
        ctx.lineTo(x + w, yi);
      }
      ctx.fillStyle = '#888888';
      ctx.textAlign = "left";
      ctx.font = "normal " + (12 * _this._overscale) + "px menlo";
      ctx.fillText(min, x, y + h + 1);
      ctx.textAlign = "right";
      ctx.fillText(max, x + w, y + h + 1);
      ctx.strokeStyle = "#ddd";
      return ctx.stroke();
    };
    drawIndicators = function(ctx, x, y, w, h, height) {
      ctx.beginPath();
      ctx.moveTo(x - 8, y + h - 0.5);
      ctx.lineTo(Math.round(x / 2) - 2.5, y + h - 0.5);
      ctx.lineTo(Math.round(x / 2) - 2.5, y + h - 0.5 + height);
      ctx.lineTo(x + 8.5, y + h - 0.5 + height);
      ctx.moveTo(x + 8.5, y + h - 18.5 + height);
      ctx.lineTo(x + 8.5, y + h + 16 + height);
      ctx.moveTo(x + w + 8, y + 0.5);
      ctx.lineTo(x + w + Math.round(x / 2) + 2.5, y + 0.5);
      ctx.lineTo(x + w + Math.round(x / 2) + 2.5, y + h - 0.5 + height);
      ctx.lineTo(x + w - 8, y + h - 0.5 + height);
      ctx.moveTo(x + w - 8.5, y + h - 18.5 + height);
      ctx.lineTo(x + w - 8.5, y + h + 16 + height);
      ctx.strokeStyle = "#666";
      return ctx.stroke();
    };
    drawFrame = function(ctx, x, y, w, h) {
      ctx.strokeStyle = "#999";
      return ctx.strokeRect(x + 0.5, y + 0.5, w - 1, h - 1);
    };
    drawFunction = function(ctx, x, y, w, h, c1, c2) {
      ctx.beginPath();
      ctx.moveTo(x + 2.5, y + h - 1.5);
      ctx.bezierCurveTo(x + c1[0], y + h - c1[1], x + c2[0], y + h - c2[1], x + w - 1.5, y + 2.5);
      ctx.strokeStyle = "#2c9cd7";
      ctx.lineWidth = 5;
      return ctx.stroke();
    };
    drawHandles = function(ctx, x, y, w, h, c1, c2) {
      var drawHandle;
      drawHandle = function(x1, y1, x2, y2, active) {
        var r;
        r = active ? _this._handleRadius + 5 : _this._handleRadius;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.lineWidth = 3;
        ctx.strokeStyle = "#cccccc";
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(x2, y2);
        ctx.arc(x2, y2, r + 5, 0, 2 * Math.PI);
        ctx.closePath();
        ctx.fillStyle = '#ffffff';
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(x2, y2);
        ctx.arc(x2, y2, r + 2, 0, 2 * Math.PI);
        ctx.closePath();
        ctx.fillStyle = '#999999';
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(x2, y2);
        ctx.arc(x2, y2, r - 2, 0, 2 * Math.PI);
        ctx.closePath();
        ctx.fillStyle = '#ffffff';
        return ctx.fill();
      };
      drawHandle(x + 2.5, y + h - 1.5, x + c1[0], y + h - c1[1], _this._target === c1);
      return drawHandle(x + w - 2.5, y + 2.5, x + c2[0], y + h - c2[1], _this._target === c2);
    };
    drawGrid(ctx, this.padding[3], this.padding[0], this.framewidth, this.frameheight, this.min, this.max);
    drawFrame(ctx, this.padding[3], this.padding[0], this.framewidth, this.frameheight);
    drawIndicators(ctx, this.padding[3], this.padding[0], this.framewidth, this.frameheight, 79);
    drawFunction(ctx, this.padding[3], this.padding[0], this.framewidth, this.frameheight, this.c1, this.c2);
    return drawHandles(ctx, this.padding[3], this.padding[0], this.framewidth, this.frameheight, this.c1, this.c2);
  };

  BezierEditor.prototype.getElement = function() {
    return this.element;
  };

  return BezierEditor;

})();

BezierColorEditor = (function(_super) {

  __extends(BezierColorEditor, _super);

  function BezierColorEditor(width, height, min, max) {
    this.min = min;
    this.max = max;
    BezierColorEditor.__super__.constructor.apply(this, arguments);
    this.minY = 0;
    this.maxY = 1;
    this.c1 = [this.framewidth * 0.3333, this.frameheight * 0.3333];
    this.c2 = [this.framewidth * 0.6666, this.frameheight * 0.6666];
  }

  BezierColorEditor.prototype._buildForm = function() {
    var _this = this;
    return this.form = Form.makeForm('nodes-color-settings', {
      gradient: {
        label: 'Gradient',
        type: 'colorGradient'
      }
    }, function(key, val, field) {
      _this.g = val;
      return _this.changed.fire(_this.getFunction());
    }).width(this.width / this._overscale);
  };

  BezierColorEditor.prototype.getFunction = function() {
    var f, func, g;
    f = BezierColorEditor.__super__.getFunction.apply(this, arguments);
    g = this.g;
    if (!(g != null)) {
      g = Form.getValue(this.form, 'gradient', {
        type: 'colorGradient'
      });
    }
    return func = function(t) {
      return g(f(t));
    };
  };

  return BezierColorEditor;

})(BezierEditor);

E = function() {
  var attrs, children, doc, el, name;
  doc = arguments[0], name = arguments[1], attrs = arguments[2], children = 4 <= arguments.length ? __slice.call(arguments, 3) : [];
  el = doc.createElement(name);
  setattrs(doc, el, attrs);
  children.iter(function(c) {
    if (!(c != null)) {
      return;
    }
    if (typeof c === 'string') {
      c = doc.createTextNode(c);
    }
    return el.appendChild(c);
  });
  return el;
};

setattrs = function(doc, el, attrs) {
  var attr, key, value, _results;
  _results = [];
  for (key in attrs) {
    value = attrs[key];
    attr = doc.createAttribute(key);
    attr.value = value;
    _results.push(el.setAttributeNode(attr));
  }
  return _results;
};

GEXFExporter = (function() {

  GEXFExporter.namespace = 'http://www.gexf.net/1.2draft';

  GEXFExporter.namespaces = {
    viz: 'http://www.gexf.net/1.2draft/viz'
  };

  function GEXFExporter(model) {
    this.model = model;
    this.edgeid = 0;
  }

  GEXFExporter.prototype.nodeToXML = function(doc, node) {
    var attrs, attrset, color, el, id, key, position, value, _ref;
    attrs = E(doc, 'attvalues');
    _ref = node.attributes;
    for (key in _ref) {
      value = _ref[key];
      try {
        id = this.model.attributes.node[key].id;
      } catch (e) {
        try {
          id = this.model.attributes.all[key].id;
        } catch (e) {
          continue;
        }
      }
      attrs.appendChild(E(doc, 'attvalue', {
        "for": id,
        value: "" + value
      }));
      attrset = true;
    }
    if (!(attrset != null)) {
      attrs = void 0;
    }
    color = node.getColor();
    position = node.getAbsolutePosition();
    el = E(doc, 'node', {
      id: node.getAbsoluteID(),
      label: node.getLabel()
    }, attrs, E(doc, 'viz:color', {
      r: Math.round(color.r * 255),
      g: Math.round(color.g * 255),
      b: Math.round(color.b * 255),
      a: node.getOpacity()
    }), E(doc, 'viz:position', {
      x: position.x * 10,
      y: position.y * 10,
      z: position.z * 10
    }), E(doc, 'viz:size', {
      value: node.getSize() / 3
    }));
    return el;
  };

  GEXFExporter.prototype.edgeToXML = function(doc, e) {
    var attrs, attrset, color, id, key, value, _ref;
    attrs = E(doc, 'attvalues');
    _ref = e.attributes;
    for (key in _ref) {
      value = _ref[key];
      try {
        id = this.model.attributes.node[key].id;
      } catch (e) {
        try {
          id = this.model.attributes.all[key].id;
        } catch (e) {
          continue;
        }
      }
      attrs.appendChild(E(doc, 'attvalue', {
        "for": id,
        value: "" + value
      }));
      attrset = true;
    }
    if (!(attrset != null)) {
      attrs = void 0;
    }
    color = e.getColor();
    return E(doc, 'edge', {
      id: this.edgeid++,
      source: e.src.getAbsoluteID(),
      target: e.dst.getAbsoluteID(),
      weight: e.getWeight(),
      type: e.directed ? 'directed' : 'undirected'
    }, attrs, E(doc, 'viz:color', {
      r: Math.round(color.r * 255),
      g: Math.round(color.g * 255),
      b: Math.round(color.b * 255),
      a: e.getOpacity()
    }), E(doc, 'viz:thickness', {
      value: e.getWeight()
    }));
  };

  GEXFExporter.prototype.domainToXML = function(doc, domain) {
    var node, nodes,
      _this = this;
    nodes = E(doc, 'nodes');
    domain.nodes.iter(function(n) {
      if (n.isVisible()) {
        return nodes.appendChild(_this.nodeToXML(doc, n));
      }
    });
    node = this.nodeToXML(doc, domain);
    node.appendChild(nodes);
    return node;
  };

  GEXFExporter.prototype.toXMLDocument = function() {
    var attr, d, doc, edgeAttrs, edges, k, key, nodeAttrs, nodes, root, v, value, _ref, _ref1,
      _this = this;
    doc = document.implementation.createDocument(GEXFExporter.namespace, 'gexf', null);
    root = doc.documentElement;
    setattrs(doc, root, {
      version: '1.2'
    });
    _ref = GEXFExporter.namespaces;
    for (k in _ref) {
      v = _ref[k];
      root.setAttribute("xmlns:" + k, v);
    }
    root.appendChild(E(doc, 'meta', {
      lastmodifieddate: today()
    }, E(doc, 'creator', {}, 'CSAT'), E(doc, 'description', {}, 'Exported from CSAT')));
    nodeAttrs = E(doc, 'attributes', {
      "class": 'node'
    });
    edgeAttrs = E(doc, 'attributes', {
      "class": 'edge'
    });
    _ref1 = this.model.attributes._by_id;
    for (key in _ref1) {
      value = _ref1[key];
      attr = E(doc, 'attribute', {
        id: value.id,
        title: value.name,
        type: value.type
      });
      d = value.domain;
      if (d === 'node' || d === 'all') {
        nodeAttrs.appendChild(attr);
      }
      if (d === 'edge' || d === 'all') {
        edgeAttrs.appendChild(attr);
      }
    }
    nodes = E(doc, 'nodes');
    this.model.domains.iter(function(d) {
      if (d.isVisible()) {
        return nodes.appendChild(_this.domainToXML(doc, d));
      }
    });
    edges = E(doc, 'edges');
    this.model.edges.iter(function(e) {
      if (e.isVisible()) {
        return edges.appendChild(_this.edgeToXML(doc, e));
      }
    });
    root.appendChild(E(doc, 'graph', {
      defaultedgetype: this.model.edgedefault
    }, nodeAttrs, edgeAttrs, nodes, edges));
    return doc;
  };

  GEXFExporter.prototype.toXMLString = function() {
    var doc;
    doc = new XMLSerializer().serializeToString(this.toXMLDocument());
    return '<?xml version="1.0" encoding="utf-8" ?>\n' + doc;
  };

  GEXFExporter.prototype.toDataURL = function() {
    var data, encoding, mime;
    mime = 'application/xml';
    encoding = 'utf8';
    data = btoa(this.toXMLString());
    return "data:" + mime + ";charset=" + encoding + ";base64," + data;
  };

  return GEXFExporter;

})();

Viewport = (function() {
  /*
      An area of the renderer element which can be drawn independently. Uses
      the same global scene with independent cameras.
  */

  function Viewport(params) {
    this.getFov = __bind(this.getFov, this);
    this.x = params.x, this.y = params.y, this.width = params.width, this.height = params.height, this.camera = params.camera, this.controls = params.controls;
  }

  Viewport.prototype.prepareScene = function(scene) {
    return this.camera.lookAt(scene.position);
  };

  Viewport.prototype.getFov = function(domHeight) {
    var height;
    if (!(this.camera._ratio != null)) {
      height = Math.tan(this.camera.fov / 2) * this.camera.position.z * 2;
      this.camera._ratio = height / domHeight;
    }
    return Math.atan((domHeight * this.camera._ratio) / (2 * this.camera.position.z)) * 2 / Math.PI * 180;
  };

  Viewport.prototype.prepareRenderer = function(renderer, width, height) {
    var fov, h, w, x, y;
    fov = this.getFov(height);
    x = Math.floor(width * this.x);
    y = Math.floor(height * this.y);
    w = Math.floor(width * this.width);
    h = Math.floor(height * this.height);
    this.camera.aspect = w / h;
    this.camera.fov = fov;
    renderer.setViewport(x, y, w, h);
    renderer.setScissor(x, y, w, h);
    return renderer.enableScissorTest(true);
  };

  return Viewport;

})();

RotatingViewport = (function(_super) {

  __extends(RotatingViewport, _super);

  function RotatingViewport(params) {
    this.radius = params.radius, this.speed = params.speed, this.axis = params.axis;
    this.phi = 0;
    RotatingViewport.__super__.constructor.apply(this, arguments);
  }

  RotatingViewport.prototype.prepareRenderer = function(renderer) {
    return RotatingViewport.__super__.prepareRenderer.apply(this, arguments);
  };

  RotatingViewport.prototype.prepareScene = function(scene) {
    this.phi += this.speed;
    if (this.axis === 'x') {
      this.camera.position.x = this.radius * Math.sin(this.phi * Math.PI / 360);
      this.camera.position.z = this.radius * Math.cos(this.phi * Math.PI / 360);
    } else if (this.axis === 'z') {
      this.camera.position.y = this.radius * Math.sin(this.phi * Math.PI / 360);
      this.camera.position.z = this.radius * Math.cos(this.phi * Math.PI / 360);
    } else if (this.axis === 'y') {
      this.camera.rotation.x = this.phi;
    }
    return RotatingViewport.__super__.prepareScene.call(this, scene);
  };

  return RotatingViewport;

})(Viewport);

MultipleViewportsRenderer = (function() {

  function MultipleViewportsRenderer(container, scene, viewports, stats) {
    this.container = container;
    this.scene = scene;
    this.viewports = viewports;
    this.stats = stats;
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      preserveDrawingBuffer: true
    });
    this.renderer.setClearColor(0xffffff, 1);
    this.container.append(this.renderer.domElement);
    this.initialWidth = this.container.width();
    this.initialHeight = this.container.height();
    this.renderer.setSize(this.initialWidth, this.initialHeight);
  }

  MultipleViewportsRenderer.prototype.render = function() {
    var height, viewport, width, _i, _len, _ref, _ref1, _results;
    _ref = [this.container.width(), this.container.height()], width = _ref[0], height = _ref[1];
    this.renderer.setSize(width, height);
    width *= window.devicePixelRatio;
    height *= window.devicePixelRatio;
    _ref1 = this.viewports;
    _results = [];
    for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
      viewport = _ref1[_i];
      viewport.prepareScene(this.scene);
      viewport.prepareRenderer(this.renderer, width, height);
      viewport.camera.updateProjectionMatrix();
      _results.push(this.renderer.render(this.scene, viewport.camera));
    }
    return _results;
  };

  MultipleViewportsRenderer.prototype.animate = function() {
    var animate,
      _this = this;
    animate = function() {
      requestAnimationFrame(animate);
      _this.render();
      return _this.stats.update();
    };
    return animate();
  };

  return MultipleViewportsRenderer;

})();

geo2line = function(geo) {
  var a, b, c, d, face, geometry, i, vertices, _i, _ref;
  geometry = new THREE.Geometry();
  vertices = geometry.vertices;
  for (i = _i = 0, _ref = geo.faces.length; 0 <= _ref ? _i <= _ref : _i >= _ref; i = 0 <= _ref ? ++_i : --_i) {
    face = geo.faces[i];
    if (face instanceof THREE.Face3) {
      a = geo.vertices[face.a].clone();
      b = geo.vertices[face.b].clone();
      c = geo.vertices[face.c].clone();
      vertices.push(a, b, b, c, c, a);
    } else if (face instanceof THREE.Face4) {
      a = geo.vertices[face.a].clone();
      b = geo.vertices[face.b].clone();
      c = geo.vertices[face.c].clone();
      d = geo.vertices[face.d].clone();
      vertices.push(a, b, b, c, c, d, d, a);
    }
  }
  geometry.computeLineDistances();
  return geometry;
};

makeCircle = function(radius, opacity, axis) {
  var c1, c2, dashMaterial, geometry, i, resolution, segment, size, x, y, z, _i, _ref, _ref1, _ref2;
  geometry = new THREE.Geometry();
  dashMaterial = new THREE.LineBasicMaterial({
    color: 0x000000,
    opacity: opacity,
    dashSize: .2,
    gapSize: 5,
    transparent: true
  });
  resolution = radius * 2 * Math.PI;
  size = 360 / resolution;
  for (i = _i = 0; 0 <= resolution ? _i < resolution : _i > resolution; i = 0 <= resolution ? ++_i : --_i) {
    segment = i * size * Math.PI / 180;
    c1 = Math.cos(segment) * radius;
    c2 = Math.sin(segment) * radius;
    if (axis === 2) {
      _ref = [c1, c2, 0], x = _ref[0], y = _ref[1], z = _ref[2];
    } else if (axis === 1) {
      _ref1 = [c1, 0, c2], x = _ref1[0], y = _ref1[1], z = _ref1[2];
    } else if (axis === 0) {
      _ref2 = [0, c1, c2], x = _ref2[0], y = _ref2[1], z = _ref2[2];
    }
    geometry.vertices.push(new THREE.Vector3(x, y, z));
  }
  geometry.vertices.push(geometry.vertices[0].clone());
  return new THREE.Line(geometry, dashMaterial);
};

makeCirclePlane = function(radius, axis, step, slices) {
  var c1, c2, dashMaterial, i, obj, r, segment, seps, size, x, y, z, _i, _ref, _ref1, _ref2;
  if (step == null) {
    step = 10;
  }
  if (slices == null) {
    slices = 10;
  }
  obj = new THREE.Object3D();
  r = radius - 10;
  obj.add(makeCircle(radius, 0.2, axis));
  while (r > 0) {
    obj.add(makeCircle(r, 0.07, axis));
    r -= step;
  }
  seps = new THREE.Geometry();
  dashMaterial = new THREE.LineBasicMaterial({
    color: 0x000000,
    opacity: .07,
    dashSize: .2,
    gapSize: 5,
    transparent: true
  });
  slices = 10;
  size = 360 / slices;
  for (i = _i = 0; 0 <= slices ? _i < slices : _i > slices; i = 0 <= slices ? ++_i : --_i) {
    segment = i * size * Math.PI / 180;
    c1 = Math.cos(segment) * radius;
    c2 = Math.sin(segment) * radius;
    if (axis === 2) {
      _ref = [c1, c2, 0], x = _ref[0], y = _ref[1], z = _ref[2];
    } else if (axis === 1) {
      _ref1 = [c1, 0, c2], x = _ref1[0], y = _ref1[1], z = _ref1[2];
    } else if (axis === 0) {
      _ref2 = [0, c1, c2], x = _ref2[0], y = _ref2[1], z = _ref2[2];
    }
    seps.vertices.push(new THREE.Vector3(0, 0, 0));
    seps.vertices.push(new THREE.Vector3(x, y, z));
  }
  obj.add(new THREE.Line(seps, dashMaterial, THREE.LinePieces));
  return obj;
};

later = function(ms, cb) {
  return setTimeout(cb, ms);
};

DomainNodesObject = (function(_super) {

  __extends(DomainNodesObject, _super);

  DomainNodesObject.vertexShader = ['attribute float size;', 'attribute vec3 nodeColor;', 'varying vec3 vColor;', 'attribute float nodeOpacity;', 'varying float vOpacity;', 'attribute float nodeVisibility;', 'varying float visible;', 'void main() {', '    vColor = nodeColor;', '    vOpacity = nodeOpacity;', '    visible = nodeVisibility;', '    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);', '    gl_PointSize = size * (300.0 / length( mvPosition.xyz));', '    gl_Position = projectionMatrix * mvPosition;', '}'].join('\n');

  DomainNodesObject.fragmentShader = ['uniform vec3 color;', 'uniform sampler2D texture;', 'varying vec3 vColor;', 'varying float vOpacity;', 'varying float visible;', 'void main() {', '    if (visible == 0.0) discard;', '    gl_FragColor = vec4(vColor * color, 1.0);', '    gl_FragColor = gl_FragColor * texture2D(texture, vec2(gl_PointCoord.x, 1.0 - gl_PointCoord.y));', '    gl_FragColor.a *= vOpacity;', '}'].join('\n');

  function DomainNodesObject(model) {
    var attributes, geometry, material, uniforms,
      _this = this;
    this.model = model;
    geometry = new THREE.Geometry();
    model.setPosition(new THREE.Vector3(0, 0, 0));
    model.nodes.iter(function(node) {
      return node.updatePosition();
    });
    geometry.vertices = model.nodePositions;
    attributes = {
      size: {
        type: 'f',
        value: model.nodeSizes
      },
      nodeColor: {
        type: 'c',
        value: model.nodeColors
      },
      nodeOpacity: {
        type: 'f',
        value: model.nodeOpacity
      },
      nodeVisibility: {
        type: 'f',
        value: model.nodeVisibility
      }
    };
    uniforms = {
      color: {
        type: "c",
        value: new THREE.Color(0xffffff)
      },
      texture: {
        type: "t",
        value: model.texture
      }
    };
    material = new THREE.ShaderMaterial({
      uniforms: uniforms,
      attributes: attributes,
      vertexShader: DomainNodesObject.vertexShader,
      fragmentShader: DomainNodesObject.fragmentShader,
      transparent: true,
      combine: THREE.MixOperation
    });
    material.alphaTest = 0.5;
    material.blending = THREE.AdditiveAlphaBlending;
    THREE.ParticleSystem.call(this, geometry, material);
    this.sortParticles = true;
  }

  DomainNodesObject.prototype.updateTexture = function() {
    this.material.uniforms['texture'].value = this.model.texture;
    return this.material.uniforms['texture'].needsUpdate = true;
  };

  DomainNodesObject.prototype.updateColors = function() {
    return this.material.attributes['nodeColor'].needsUpdate = true;
  };

  return DomainNodesObject;

})(THREE.ParticleSystem);

DomainEdgesObject = (function(_super) {

  __extends(DomainEdgesObject, _super);

  DomainEdgesObject.vertexShader = ['attribute vec3 edgeColor;', 'varying vec3 color;', 'attribute float edgeOpacity;', 'varying float opacity;', 'attribute float edgeVisibility;', 'varying float visible;', 'void main() {', '    color = edgeColor;', '    opacity = edgeOpacity;', '    visible = edgeVisibility;', '    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);', '    gl_PointSize = 4.0;', '    gl_Position = projectionMatrix * mvPosition;', '}'].join('\n');

  DomainEdgesObject.fragmentShader = ['varying vec3 color;', 'varying float opacity;', 'varying float visible;', 'void main() {', '    if (visible == 0.0) discard;', '    gl_FragColor = vec4(color, opacity);', '}'].join('\n');

  function DomainEdgesObject(model) {
    var attributes, geometry, material, uniforms;
    this.model = model;
    geometry = new THREE.Geometry();
    geometry.vertices = this.model.edgeVertices;
    attributes = {
      edgeWeight: {
        type: 'f',
        value: model.edgeWeights
      },
      edgeColor: {
        type: 'c',
        value: model.edgeColors
      },
      edgeOpacity: {
        type: 'f',
        value: model.edgeOpacity
      },
      edgeVisibility: {
        type: 'f',
        value: model.edgeVisibility
      }
    };
    uniforms = {};
    material = new THREE.ShaderMaterial({
      uniforms: uniforms,
      attributes: attributes,
      vertexShader: DomainEdgesObject.vertexShader,
      fragmentShader: DomainEdgesObject.fragmentShader,
      transparent: true,
      linewidth: 1
    });
    THREE.Line.call(this, geometry, material, THREE.LinePieces);
  }

  DomainEdgesObject.prototype.update = function() {
    this.material.attributes['edgeWeight'].needsUpdate = true;
    this.material.attributes['edgeColor'].needsUpdate = true;
    this.material.attributes['edgeOpacity'].needsUpdate = true;
    return this.material.attributes['edgeVisibility'].needsUpdate = true;
  };

  return DomainEdgesObject;

})(THREE.Line);

DomainEdgesDirectionObject = (function(_super) {

  __extends(DomainEdgesDirectionObject, _super);

  function DomainEdgesDirectionObject() {
    DomainEdgesDirectionObject.__super__.constructor.apply(this, arguments);
    this.material.linewidth = this.material.linewidth * 1.5 + 1;
    this.geometry.vertices = [];
    this.updateGeometry();
  }

  DomainEdgesDirectionObject.prototype.updateGeometry = function() {
    var vs,
      _this = this;
    vs = this.geometry.vertices;
    vs.length = 0;
    this.model.edges.iter(function(e) {
      if (e.directed) {
        vs.push(_this._getDirectionStart(e.src.getAbsolutePosition(), e.dst.getAbsolutePosition(), Math.sqrt(e.dst.getSize() - 2) / 2 + 1));
        return vs.push(e.dst.getAbsolutePosition());
      }
    });
    return this.geometry.verticesNeedUpdate = true;
  };

  DomainEdgesDirectionObject.prototype._getDirectionStart = function(src, dst, l) {
    var v;
    v = dst.clone().sub(src);
    v.setLength(Math.min(l, v.length()));
    return dst.clone().sub(v);
  };

  return DomainEdgesDirectionObject;

})(DomainEdgesObject);

DomainLabelsObject = (function(_super) {

  __extends(DomainLabelsObject, _super);

  DomainLabelsObject.vertexShader = ['varying vec2 vUv;', 'varying float fontSize;', 'attribute float nodeSize;', 'attribute float char;', 'uniform float nodeSizeFactor;', 'uniform float baseSize;', 'uniform float sizeRatio;', 'uniform float widthRatio;', 'attribute float labelOpacity;', 'varying float opacity;', 'attribute float labelVisibility;', 'varying float visible;', 'void main() {', '    fontSize = nodeSize * nodeSizeFactor + baseSize * sizeRatio / 10.0;', '    float charWidth = fontSize * 0.2;', '    float charHeight = charWidth * 2.0;', '    charWidth /= widthRatio;', '    float offset = nodeSize / 23.0 / widthRatio * sizeRatio;', '    vec4 pos = projectionMatrix * modelViewMatrix * vec4(position, 1.0);', '    pos.x += offset;', '    pos.x += floor((floor(char / 2.0) + 1.0) / 2.0) * charWidth;', '    pos.y += (mod(char, 2.0) - 0.5) * charHeight;', '    visible = labelVisibility;', '    opacity = labelOpacity;', '    gl_Position = pos;', '    vUv = uv;', '}'].join('\n');

  DomainLabelsObject.fragmentShader = ['uniform vec3 color;', 'uniform sampler2D texture;', 'varying vec2 vUv;', 'varying float opacity;', 'varying float fontSize;', 'varying float visible;', 'void main() {', '    if (visible == 0.0) discard;', '    gl_FragColor = vec4(color, 1.0);', '    gl_FragColor = gl_FragColor * texture2D(texture, vUv);', '    gl_FragColor.a *= opacity;', '}'].join('\n');

  DomainLabelsObject.makeTexture = function() {
    var c, ch, ctx, fontSize, lettersPerSide, sz, texture, x, y, yOffset, _i, _j;
    fontSize = DomainLabelsObject.fontSize;
    lettersPerSide = DomainLabelsObject.lettersPerSide;
    c = document.createElement('canvas');
    c.width = c.height = sz = fontSize * lettersPerSide;
    ctx = c.getContext('2d');
    ctx.font = (fontSize - 10) + 'px menlo';
    ctx.fillStyle = "#ffffff";
    yOffset = -0.25;
    for (y = _i = 0; 0 <= lettersPerSide ? _i < lettersPerSide : _i > lettersPerSide; y = 0 <= lettersPerSide ? ++_i : --_i) {
      for (x = _j = 0; 0 <= lettersPerSide ? _j < lettersPerSide : _j > lettersPerSide; x = 0 <= lettersPerSide ? ++_j : --_j) {
        ch = String.fromCharCode(y * lettersPerSide + x);
        ctx.textAlign = "center";
        ctx.fillText(ch, (x + .5) * fontSize, (yOffset + y + 1) * fontSize);
      }
    }
    texture = new THREE.Texture(c);
    texture.needsUpdate = true;
    return texture;
  };

  DomainLabelsObject.lettersPerSide = 16;

  DomainLabelsObject.fontSize = 70;

  function DomainLabelsObject(model) {
    var attributes, chars, geometry, material, sizes, uniforms,
      _this = this;
    this.model = model;
    this.updateLabels = __bind(this.updateLabels, this);

    this.updateFromNode = __bind(this.updateFromNode, this);

    this.updateFontSize = __bind(this.updateFontSize, this);

    this.updateColor = __bind(this.updateColor, this);

    this.repopulate = __bind(this.repopulate, this);

    this.updateRatio = __bind(this.updateRatio, this);

    this.nodeSizeFactor = 0;
    this.baseSize = 10;
    this.labelOpacity = [];
    this.color = new THREE.Color(0x000000);
    this.labelVisibility = [];
    chars = this.chars = [];
    sizes = this.sizes = [];
    $(window).resize(function() {
      return _this.updateRatio();
    });
    attributes = {
      char: {
        type: 'f',
        value: this.chars
      },
      nodeSize: {
        type: 'f',
        value: this.sizes
      },
      labelOpacity: {
        type: 'f',
        value: this.labelOpacity
      },
      labelVisibility: {
        type: 'f',
        value: this.labelVisibility
      }
    };
    uniforms = {
      texture: {
        type: "t",
        value: DomainLabelsObject.makeTexture()
      },
      widthRatio: {
        type: 'f',
        value: 1.0
      },
      sizeRatio: {
        type: 'f',
        value: 1.0
      },
      nodeSizeFactor: {
        type: 'f',
        value: this.nodeSizeFactor
      },
      baseSize: {
        type: 'f',
        value: this.baseSize / window.devicePixelRatio
      },
      color: {
        type: 'c',
        value: this.color
      }
    };
    material = new THREE.ShaderMaterial({
      uniforms: uniforms,
      attributes: attributes,
      vertexShader: DomainLabelsObject.vertexShader,
      fragmentShader: DomainLabelsObject.fragmentShader,
      transparent: true,
      depthWrite: false,
      combine: THREE.MixOperation
    });
    geometry = new THREE.Geometry();
    this.repopulate(geometry);
    THREE.Mesh.call(this, geometry, material);
    this.updateRatio();
  }

  DomainLabelsObject.prototype.updateRatio = function() {
    var h, w;
    w = $('.viewport').width();
    h = $('.viewport').height();
    this.material.uniforms['widthRatio'].value = w / h;
    this.material.uniforms['widthRatio'].needsUpdate = true;
    this.material.uniforms['sizeRatio'].value = 7000 / h;
    return this.material.uniforms['sizeRatio'].needsUpdate = true;
  };

  DomainLabelsObject.prototype.repopulate = function(geometry) {
    var fontSize, globalCharIndex, lettersPerSide, oh, ow, textureCharHeight, textureCharWidth,
      _this = this;
    this.chars.length = 0;
    this.sizes.length = 0;
    geometry.vertices.length = 0;
    geometry.faces.length = 0;
    geometry.faceVertexUvs[0].length = 0;
    textureCharWidth = DomainLabelsObject.fontSize * 0.5;
    textureCharHeight = DomainLabelsObject.fontSize;
    globalCharIndex = 0;
    fontSize = DomainLabelsObject.fontSize;
    lettersPerSide = DomainLabelsObject.lettersPerSide;
    ow = textureCharWidth / (fontSize * lettersPerSide);
    oh = textureCharHeight / (fontSize * lettersPerSide);
    this.model.nodes.iter(function(n, i) {
      var char, charCode, charX, charY, j, label, op, ox, oy, p, s, show, _i, _len, _results;
      p = n.getAbsolutePosition();
      s = n.getSize();
      label = n.getLabel();
      show = n.isVisible();
      op = n.getOpacity();
      _results = [];
      for (j = _i = 0, _len = label.length; _i < _len; j = ++_i) {
        char = label[j];
        charCode = char.charCodeAt(0);
        charX = charCode % lettersPerSide;
        charY = Math.floor(charCode / lettersPerSide);
        ox = (charX + 0.5) / lettersPerSide - ow / 2.0;
        oy = (lettersPerSide - charY - .5) / lettersPerSide - oh / 2.0;
        geometry.vertices.push(p, p, p, p);
        geometry.faces.push(new THREE.Face4(globalCharIndex * 4, globalCharIndex * 4 + 1, globalCharIndex * 4 + 2, globalCharIndex * 4 + 3));
        _this.chars.push(j * 4 + 1, j * 4 + 0, j * 4 + 2, j * 4 + 3);
        _this.sizes.push(s, s, s, s);
        _this.labelOpacity.push(op, op, op, op);
        _this.labelVisibility.push(show, show, show, show);
        geometry.faceVertexUvs[0].push([new THREE.Vector2(ox, oy + oh), new THREE.Vector2(ox, oy), new THREE.Vector2(ox + ow, oy), new THREE.Vector2(ox + ow, oy + oh)]);
        _results.push(globalCharIndex++);
      }
      return _results;
    });
    geometry.verticesNeedUpdate = true;
    geometry.elementsNeedUpdate = true;
    geometry.uvsNeedUpdate = true;
    return geometry.dynamic = true;
  };

  DomainLabelsObject.prototype.updateColor = function(color) {
    this.color = new THREE.Color(color);
    this.material.uniforms['color'].value = this.color;
    return this.material.uniforms['color'].needsUpdate = true;
  };

  DomainLabelsObject.prototype.updateFontSize = function(baseSize, nodeSizeFactor) {
    this.baseSize = baseSize;
    this.nodeSizeFactor = nodeSizeFactor;
    this.material.uniforms['baseSize'].value = this.baseSize / window.devicePixelRatio;
    this.material.uniforms['baseSize'].needsUpdate = true;
    this.material.uniforms['nodeSizeFactor'].value = this.nodeSizeFactor;
    return this.material.uniforms['nodeSizeFactor'].needsUpdate = true;
  };

  DomainLabelsObject.prototype.updateFromNode = function() {
    var c,
      _this = this;
    c = 0;
    this.model.nodes.iter(function(n, i) {
      var char, l, o, s, v, _i, _len, _results;
      v = n.isVisible();
      s = n.getSize();
      o = n.getOpacity();
      l = n.getLabel();
      _results = [];
      for (_i = 0, _len = l.length; _i < _len; _i++) {
        char = l[_i];
        _this.sizes[c * 4] = s;
        _this.sizes[c * 4 + 1] = s;
        _this.sizes[c * 4 + 2] = s;
        _this.sizes[c * 4 + 3] = s;
        _this.labelVisibility[c * 4] = v;
        _this.labelVisibility[c * 4 + 1] = v;
        _this.labelVisibility[c * 4 + 2] = v;
        _this.labelVisibility[c * 4 + 3] = v;
        _this.labelOpacity[c * 4] = o;
        _this.labelOpacity[c * 4 + 1] = o;
        _this.labelOpacity[c * 4 + 2] = o;
        _this.labelOpacity[c * 4 + 3] = o;
        _results.push(c++);
      }
      return _results;
    });
    this.material.attributes['labelVisibility'].needsUpdate = true;
    this.material.attributes['nodeSize'].needsUpdate = true;
    return this.material.attributes['labelOpacity'].needsUpdate = true;
  };

  DomainLabelsObject.prototype.updateLabels = function() {
    this.repopulate(this.geometry);
    return this.material.attributes['char'].needsUpdate = true;
  };

  return DomainLabelsObject;

})(THREE.Mesh);

GraphRenderer = (function() {

  function GraphRenderer(model, viewer) {
    this.model = model;
    this.viewer = viewer;
    this._layoutStepCb = __bind(this._layoutStepCb, this);

    this.layouts = [];
    this.edgeDirectionVisible = true;
  }

  GraphRenderer.prototype.setLayout = function(layout) {
    if (this.layout) {
      if (this.layout.isRunning()) {
        this.layout.stop();
      }
      this.layout.callbacks.step.remove(this._layoutStepCb);
      this.layout.callbacks.done.remove(this._layoutStepCb);
    }
    this.layout = layout;
    this.layout.callbacks.step.add(this._layoutStepCb);
    this.layout.callbacks.done.add(this._layoutStepCb);
    return this.layouts = [this.layout];
  };

  GraphRenderer.prototype.draw = function(scene, camera) {
    var _,
      _this = this;
    this.scene = scene;
    this.camera = camera;
    this.oldDomainObjects = this.domainObjects;
    this.domainObjects = (function() {
      var _i, _len, _ref, _results;
      _ref = this.model.domains;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        _ = _ref[_i];
        _results.push({});
      }
      return _results;
    }).call(this);
    this._clear(this.scene);
    this.layouts.iter(function(l) {
      return l.setScene(_this.scene);
    });
    return this._draw();
  };

  GraphRenderer.prototype._draw = function() {
    this._drawLabels(this.scene);
    this._drawNodes(this.scene);
    return this._drawEdges(this.scene);
  };

  GraphRenderer.prototype.step = function() {
    return this.layout.runStep(this.model.nodes, this.model.edges);
  };

  GraphRenderer.prototype.run = function() {
    return this.layout.run(this.model.nodes, this.model.edges);
  };

  GraphRenderer.prototype.resume = function() {
    if (this.layout.isPaused()) {
      return this.layout.run(this.model.nodes, this.model.edges);
    }
  };

  GraphRenderer.prototype.pause = function() {
    var l, _i, _len, _ref, _results;
    _ref = this.layouts;
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      l = _ref[_i];
      _results.push(l.pause());
    }
    return _results;
  };

  GraphRenderer.prototype.stop = function() {
    var l, _i, _len, _ref, _results;
    _ref = this.layouts;
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      l = _ref[_i];
      _results.push(l.stop());
    }
    return _results;
  };

  GraphRenderer.prototype.reset = function() {
    var l, _i, _len, _ref, _results;
    _ref = this.layouts;
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      l = _ref[_i];
      _results.push(l.reset());
    }
    return _results;
  };

  GraphRenderer.prototype.isRunning = function() {
    return this.allLayoutsRunning();
  };

  GraphRenderer.prototype.allLayoutsRunning = function() {
    return this.layouts.every(function(l) {
      return l.isRunning();
    });
  };

  GraphRenderer.prototype.allLayoutsPaused = function() {
    return this.layouts.every(function(l) {
      return l.isPaused();
    });
  };

  GraphRenderer.prototype.someLayoutsRunning = function() {
    return this.layouts.some(function(l) {
      return l.isRunning();
    });
  };

  GraphRenderer.prototype.someLayoutsPaused = function() {
    return this.layouts.some(function(l) {
      return l.isPaused();
    });
  };

  GraphRenderer.prototype.setEdgeTransparency = function(enabled) {
    this.domainObjects.iter(function(d) {
      d.edges.material.transparent = enabled;
      return d.edgesDirection.material.transparent = enabled;
    });
    this.interEdges.material.transparent = enabled;
    return this.interEdgesDirection.material.transparent = enabled;
  };

  GraphRenderer.prototype._layoutStepCb = function() {
    this.domainObjects.iter(function(d) {
      d.nodes.geometry.verticesNeedUpdate = true;
      d.labels.geometry.verticesNeedUpdate = true;
      d.edges.geometry.verticesNeedUpdate = true;
      return d.edgesDirection.updateGeometry();
    });
    this.interEdges.geometry.verticesNeedUpdate = true;
    return this.interEdgesDirection.updateGeometry();
  };

  GraphRenderer.prototype._drawLabels = function(scene) {
    var _this = this;
    this.labelsObject = new THREE.Object3D();
    scene.add(this.labelsObject);
    this.domainLabelsObjects = [];
    return this.model.domains.iter(function(domain, i) {
      var object, old;
      try {
        old = _this.oldDomainObjects[i].labels;
      } catch (e) {
        old = void 0;
      }
      object = new DomainLabelsObject(domain);
      if (old) {
        object.material.uniforms['color'].value = old.material.uniforms['color'].value;
      }
      _this.labelsObject.add(object);
      return _this.domainObjects[i].labels = object;
    });
  };

  GraphRenderer.prototype._drawNodes = function(scene) {
    var viewport,
      _this = this;
    this.nodesObject = new THREE.Object3D();
    scene.add(this.nodesObject);
    this.model.domains.iter(function(domain, i) {
      var object;
      object = new DomainNodesObject(domain);
      _this.nodesObject.add(object);
      return _this.domainObjects[i].nodes = object;
    });
    viewport = $('.viewport');
    return viewport.off('mousemove.graphcbs').on('mousemove.graphcbs', function(e) {
      var candidates, direction, height, node, offset, origin, projector, r, ray, vector, width, x, y;
      if (_this.viewer.controls.disabled || _this.viewer.controls.dragging) {
        return;
      }
      ray = new THREE.Raycaster();
      offset = viewport.offset();
      width = viewport.width();
      height = viewport.height();
      x = Math.max(0, Math.min(width, e.pageX - offset.left));
      y = Math.max(0, Math.min(height, e.pageY - offset.top));
      r = _this.camera._ratio * window.devicePixelRatio;
      x = (x - width * .5) * r;
      y = -(y - height * .5) * r;
      projector = new THREE.Projector();
      vector = new THREE.Vector3(x, y, 0);
      origin = _this.camera.position;
      direction = vector.clone().sub(_this.camera.position).normalize();
      ray.threshold = 10;
      ray.set(origin, direction);
      candidates = [];
      _this.model.domains.iter(function(domain, i) {
        var intersect, n, obj, p, _i, _len, _results;
        intersect = ray.intersectObjects([_this.domainObjects[i].nodes]);
        _results = [];
        for (_i = 0, _len = intersect.length; _i < _len; _i++) {
          obj = intersect[_i];
          n = domain.nodes[obj.vertex];
          if (n.isVisible()) {
            if (obj.distance <= n.getSize() * (r + 0.05)) {
              p = n.getAbsolutePosition().clone();
              p.applyMatrix4(_this.domainObjects[i].nodes.matrixWorld);
              _results.push(candidates.push([p.z, n]));
            } else {
              _results.push(void 0);
            }
          } else {
            _results.push(void 0);
          }
        }
        return _results;
      });
      if (candidates.length) {
        candidates.sort();
        node = candidates[candidates.length - 1][1];
        if (node !== _this.hoverNode) {
          if (_this.hoverNode != null) {
            _this.model.fire('nodeout', _this.hoverNode);
          }
          _this.hoverNode = node;
          return _this.model.fire('nodehover', _this.hoverNode);
        }
      } else {
        if (_this.hoverNode != null) {
          _this.model.fire('nodeout', _this.hoverNode);
          return _this.hoverNode = void 0;
        }
      }
    }).off('click.graphcbs').on('click.graphcbs', function() {
      if (_this.viewer.controls.disabled || _this.viewer.controls.dragging) {
        return;
      }
      if (_this.hoverNode != null) {
        return _this.model.fire('nodeclick', _this.hoverNode);
      }
    });
  };

  GraphRenderer.prototype._drawEdges = function(scene) {
    var old,
      _this = this;
    this.edgesObject = new THREE.Object3D();
    scene.add(this.edgesObject);
    this.edgesDirectionObject = new THREE.Object3D();
    if (this.edgeDirectionVisible) {
      scene.add(this.edgesDirectionObject);
    }
    this.model.domains.iter(function(domain, i) {
      var object, old;
      try {
        old = _this.oldDomainObjects[i].edges;
      } catch (e) {
        old = void 0;
      }
      object = new DomainEdgesObject(domain);
      _this.edgesObject.add(object);
      _this.domainObjects[i].edges = object;
      if (old) {
        object.material.transparent = old.material.transparent;
        object.material.linewidth = old.material.linewidth;
      }
      object = new DomainEdgesDirectionObject(domain);
      _this.edgesDirectionObject.add(object);
      _this.domainObjects[i].edgesDirection = object;
      if (old) {
        object.material.transparent = old.material.transparent;
        return object.material.linewidth = old.material.linewidth * 1.5 + 1;
      }
    });
    old = this.interEdges;
    this.interEdges = new DomainEdgesObject(this.model);
    this.edgesObject.add(this.interEdges);
    if (old) {
      this.interEdges.material.transparent = old.material.transparent;
      this.interEdges.material.linewidth = old.material.linewidth;
    }
    this.interEdgesDirection = new DomainEdgesDirectionObject(this.model);
    this.edgesDirectionObject.add(this.interEdgesDirection);
    if (old) {
      this.interEdgesDirection.material.transparent = old.material.transparent;
      return this.interEdgesDirection.material.linewidth = old.material.linewidth * 1.5 + 1;
    }
  };

  GraphRenderer.prototype.setEdgeDirectionVisibility = function(edgeDirectionVisible) {
    this.edgeDirectionVisible = edgeDirectionVisible;
    if (this.edgeDirectionVisible) {
      return this.scene.add(this.edgesDirectionObject);
    } else {
      return this.scene.remove(this.edgesDirectionObject);
    }
  };

  GraphRenderer.prototype._clear = function(obj) {
    var _results;
    _results = [];
    while (obj.children.length) {
      _results.push(obj.remove(obj.children[0]));
    }
    return _results;
  };

  return GraphRenderer;

})();

DomainEdgesIterator = (function() {

  function DomainEdgesIterator(domainNodes, nodes) {
    this.domainNodes = domainNodes;
    this.nodes = nodes;
    this.nodesIter = this.nodes.__iterator__();
  }

  DomainEdgesIterator.prototype.next = function() {
    var domain, node;
    node = this.nodesIter.next();
    return domain = this.domainNodes[node.fqid[0]];
  };

  return DomainEdgesIterator;

})();

ClusteredGraphRenderer = (function(_super) {

  __extends(ClusteredGraphRenderer, _super);

  function ClusteredGraphRenderer(model, viewer) {
    var d, domainEdges, domainNodes;
    ClusteredGraphRenderer.__super__.constructor.call(this, model, viewer);
    domainNodes = (function() {
      var _i, _len, _ref, _results;
      _ref = this.model.domains;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        d = _ref[_i];
        _results.push(new Node(d.model, d, ''));
      }
      return _results;
    }).call(this);
    domainEdges = [];
    model.nodes.iter(function(n) {
      var e;
      e = new Edge(n.domain.model, n.domain, '', n, domainNodes[n.fqid[0]], {}, false);
      return domainEdges.push(e);
    });
    this.nodes = new IteratorFactory(FlattenIterator, [[model.nodes, domainNodes]]);
    this.edges = new IteratorFactory(FlattenIterator, [[model.edges, domainEdges]]);
  }

  ClusteredGraphRenderer.prototype.step = function() {
    return this.layout.runStep(this.nodes, this.edges);
  };

  ClusteredGraphRenderer.prototype.run = function() {
    return this.layout.run(this.nodes, this.edges);
  };

  ClusteredGraphRenderer.prototype.resume = function() {
    if (this.layout.isPaused()) {
      return this.layout.run(this.nodes, this.edges);
    }
  };

  return ClusteredGraphRenderer;

})(GraphRenderer);

PartitionedGraphRenderer = (function(_super) {

  __extends(PartitionedGraphRenderer, _super);

  function PartitionedGraphRenderer(model, viewer) {
    this._globalLayoutStepCb = __bind(this._globalLayoutStepCb, this);

    var _;
    PartitionedGraphRenderer.__super__.constructor.call(this, model, viewer);
    this.partitionLayouts = (function() {
      var _i, _len, _ref, _results;
      _ref = model.domains;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        _ = _ref[_i];
        _results.push(void 0);
      }
      return _results;
    })();
  }

  PartitionedGraphRenderer.prototype._allDomainsSet = function() {
    return this.globalLayout !== void 0 && this.partitionLayouts.every(function(p) {
      return p !== void 0;
    });
  };

  PartitionedGraphRenderer.prototype.setGlobalLayout = function(layout) {
    if (this.globalLayout) {
      if (this.globalLayout.isRunning()) {
        this.globalLayout.stop();
      }
      this.globalLayout.callbacks.step.remove(this._globalLayoutStepCb);
      this.globalLayout.callbacks.done.remove(this._globalLayoutStepCb);
    }
    this.globalLayout = layout;
    this.globalLayout.callbacks.step.add(this._globalLayoutStepCb);
    this.globalLayout.callbacks.done.add(this._globalLayoutStepCb);
    return this.layouts[0] = this.globalLayout;
  };

  PartitionedGraphRenderer.prototype.setPartitionLayout = function(i, layout) {
    var oldLayout, partition;
    oldLayout = this.partitionLayouts[i];
    if (oldLayout) {
      if (oldLayout.isRunning()) {
        oldLayout.stop();
      }
      oldLayout.callbacks.step.remove(this._layoutStepCb);
      oldLayout.callbacks.done.remove(this._layoutStepCb);
    }
    this.partitionLayouts[i] = layout;
    if (this.partitions) {
      partition = this.partitions[i];
      this.scene.remove(partition.scene);
      partition.layout = layout;
      partition.scene = new THREE.Object3D();
      partition.scene.position = partition.domain.getAbsolutePosition();
      this.scene.add(partition.scene);
      layout.setScene(partition.scene);
    }
    layout.callbacks.step.add(this._layoutStepCb);
    layout.callbacks.done.add(this._layoutStepCb);
    return this.layouts[i + 1] = layout;
  };

  PartitionedGraphRenderer.prototype._globalLayoutStepCb = function() {
    var n, p, _i, _j, _k, _len, _len1, _len2, _ref, _ref1, _ref2;
    _ref = this.model.domains;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      n = _ref[_i];
      n.updatePosition();
    }
    _ref1 = this.partitions;
    for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
      p = _ref1[_j];
      if (!p.layout.isRunning()) {
        _ref2 = p.domain.nodes;
        for (_k = 0, _len2 = _ref2.length; _k < _len2; _k++) {
          n = _ref2[_k];
          n.updatePosition();
        }
      }
    }
    return this._layoutStepCb();
  };

  PartitionedGraphRenderer.prototype._placePartitions = function() {
    var _this = this;
    this.partitions = [];
    this.model.domains.iter(function(domain, i) {
      var partition;
      partition = {
        domain: domain,
        scene: new THREE.Object3D(),
        layout: _this.partitionLayouts[i]
      };
      partition.scene.position = domain.getAbsolutePosition();
      _this.scene.add(partition.scene);
      return _this.partitions.push(partition);
    });
    this.edges = [];
    return this.model.superedges.iter(function(e) {
      return _this.edges.push(new Edge(e.model, void 0, '', e.src.domain, e.dst.domain, {}, false));
    });
  };

  PartitionedGraphRenderer.prototype.draw = function(scene, camera) {
    var _,
      _this = this;
    this.scene = scene;
    this.camera = camera;
    this.oldDomainObjects = this.domainObjects;
    this.domainObjects = (function() {
      var _i, _len, _ref, _results;
      _ref = this.model.domains;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        _ = _ref[_i];
        _results.push({});
      }
      return _results;
    }).call(this);
    this._clear(this.scene);
    this._placePartitions();
    this.partitions.iter(function(p) {
      return p.layout.setScene(p.scene);
    });
    return this._draw();
  };

  PartitionedGraphRenderer.prototype.step = function() {
    this.globalLayout.runStep(this.model.domains, this.edges);
    return this.partitions.iter(function(partition) {
      return partition.layout.runStep(partition.domain.nodes, partition.domain.edges);
    });
  };

  PartitionedGraphRenderer.prototype.run = function() {
    this.globalLayout.run(this.model.domains, this.edges);
    return this.partitions.iter(function(partition) {
      return partition.layout.run(partition.domain.nodes, partition.domain.edges);
    });
  };

  PartitionedGraphRenderer.prototype.runGlobal = function() {
    return this.globalLayout.run(this.model.domains, this.edges);
  };

  PartitionedGraphRenderer.prototype.runPartition = function(id) {
    var partition;
    partition = this.partitions[id];
    return partition.layout.run(partition.domain.nodes, partition.domain.edges);
  };

  PartitionedGraphRenderer.prototype.pausePartition = function(id) {
    var partition;
    partition = this.partitions[id];
    return partition.layout.pause();
  };

  PartitionedGraphRenderer.prototype.stopPartition = function(id) {
    var partition;
    partition = this.partitions[id];
    return partition.layout.stop();
  };

  PartitionedGraphRenderer.prototype.resume = function() {
    if (this.globalLayout.isPaused()) {
      this.globalLayout.run(this.model.domains, this.edges);
    }
    return this.partitions.iter(function(partition) {
      if (partition.layout.isPaused()) {
        return partition.layout.run(partition.domain.nodes, partition.domain.edges);
      }
    });
  };

  return PartitionedGraphRenderer;

})(GraphRenderer);

ExtrudedGraphRenderer = (function(_super) {

  __extends(ExtrudedGraphRenderer, _super);

  function ExtrudedGraphRenderer() {
    return ExtrudedGraphRenderer.__super__.constructor.apply(this, arguments);
  }

  ExtrudedGraphRenderer.prototype.setDomainsLayout = function(layout) {
    if (this.domainsLayout) {
      if (this.domainsLayout.isRunning()) {
        this.domainsLayout.stop();
      }
      this.domainsLayout.callbacks.step.remove(this._layoutStepCb);
      this.domainsLayout.callbacks.done.remove(this._layoutStepCb);
    }
    this.domainsLayout = layout;
    this.domainsLayout.callbacks.step.add(this._layoutStepCb);
    this.domainsLayout.callbacks.done.add(this._layoutStepCb);
    return this.layouts[0] = this.domainsLayout;
  };

  ExtrudedGraphRenderer.prototype.setNodesLayout = function(layout) {
    if (this.nodesLayout) {
      if (this.nodesLayout.isRunning()) {
        this.nodesLayout.stop();
      }
      this.nodesLayout.callbacks.step.remove(this._layoutStepCb);
      this.nodesLayout.callbacks.done.remove(this._layoutStepCb);
    }
    this.nodesLayout = layout;
    this.nodesLayout.callbacks.step.add(this._layoutStepCb);
    this.nodesLayout.callbacks.done.add(this._layoutStepCb);
    return this.layouts[1] = this.nodesLayout;
  };

  ExtrudedGraphRenderer.prototype.draw = function(scene, camera) {
    var _,
      _this = this;
    this.scene = scene;
    this.camera = camera;
    this.oldDomainObjects = this.domainObjects;
    this.domainObjects = (function() {
      var _i, _len, _ref, _results;
      _ref = this.model.domains;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        _ = _ref[_i];
        _results.push({});
      }
      return _results;
    }).call(this);
    this._clear(this.scene);
    this.edges = [];
    this.model.superedges.iter(function(e) {
      return _this.edges.push(new Edge(e.model, void 0, '', e.src.domain, e.dst.domain, {}, false));
    });
    this.layouts.iter(function(l) {
      return l.setScene(_this.scene);
    });
    return this._draw();
  };

  ExtrudedGraphRenderer.prototype.step = function() {
    this.domainsLayout.runStep(this.model.domains, this.edges);
    return this.nodesLayout.runStep(this.model.nodes, this.model.edges);
  };

  ExtrudedGraphRenderer.prototype.run = function() {
    this.domainsLayout.run(this.model.domains, this.edges);
    return this.nodesLayout.run(this.model.nodes, this.model.edges);
  };

  ExtrudedGraphRenderer.prototype.resume = function() {
    if (this.domainsLayout.isPaused()) {
      this.domainsLayout.run(this.model.domains, this.edges);
    }
    if (this.nodesLayout.isPaused()) {
      return this.nodesLayout.run(this.model.nodes, this.model.edges);
    }
  };

  return ExtrudedGraphRenderer;

})(GraphRenderer);

Form = (function() {

  function Form() {}

  Form.makeForm = function(baseId, fields, callback) {
    var panel;
    panel = $('<form/>').addClass('form-horizontal').attr('id', baseId);
    $.each(fields, function(key) {
      Form.makeInput("" + baseId + "-input-" + key, key, this, callback).appendTo(panel);
      return true;
    });
    return panel;
  };

  Form.makeInput = function(id, key, field, callback) {
    var input, label;
    label = $('<label/>').addClass('control-label').text(field.label).attr('for', id);
    input = Form["_getInput_" + field.type](field).attr('id', id).attr('name', key);
    if (callback) {
      input.change(function() {
        var el, val;
        el = $(this);
        val = Form.getValue(el.parent(), el.attr('name'), field);
        return callback(key, val, field, el);
      });
    }
    return $('<div/>').addClass('control-group').append(label).append(input);
  };

  Form.getValue = function(form, key, field) {
    var input;
    input = $("[name=" + key + "]", form);
    return Form["_getValue_" + field.type](field, input);
  };

  Form._getInput_colorGradient = function(field) {
    var ctx, input, makeColorSelector, makeStop, picker, updateGradient;
    picker = void 0;
    ctx = $('<div/>');
    input = $('<div/>').addClass('gradient-editor').append(ctx.append($('<div/>').addClass('gradient-preview')));
    makeColorSelector = function() {
      return $('<div/>').addClass('color-selector').append('');
    };
    makeStop = function(input, color, position) {
      var stop;
      stop = $('<div/>').addClass('color-stop');
      return stop.append($('<span/>').addClass('tip').css('border-bottom-color', color)).append($('<input/>').attr('type', 'text')).css({
        'background-color': color,
        'left': "" + (position * 100) + "%",
        'position': 'absolute'
      }).draggable({
        axis: 'x',
        containment: $('.gradient-preview', input),
        drag: function(e, ui) {
          var $this;
          $this = $(this);
          if ($this.hasClass('open')) {
            $('.gradient-color-picker').css({
              left: $this.offset().left
            });
          }
          return updateGradient($(this).closest('.gradient-editor'));
        }
      }).bind('contextmenu', function(e) {
        var editor;
        e.stopPropagation();
        e.preventDefault();
        editor = $(this).closest('.gradient-editor');
        if ($(this).hasClass('open')) {
          picker.hidePicker();
        }
        $(this).remove();
        return updateGradient(editor);
      }).click(function(e) {
        var c, col;
        if ($(this).hasClass('open')) {
          return;
        }
        e.stopPropagation();
        e.preventDefault();
        $('.color-stop.open').removeClass('open');
        stop = $(this).addClass('open');
        col = stop.css('background-color').replace(/[^\d ]+/g, '').split(' ');
        col = (function() {
          var _i, _len, _results;
          _results = [];
          for (_i = 0, _len = col.length; _i < _len; _i++) {
            c = col[_i];
            _results.push(parseInt(c) / 255);
          }
          return _results;
        })();
        picker = new jscolor.color($('input', stop).get(0), {
          onImmediateChange: function(e) {
            stop.css('background', "#" + (this.toString()));
            stop.find('span').css('border-bottom-color', "#" + (this.toString()));
            return updateGradient(stop.closest('.gradient-editor'));
          }
        });
        picker.fromRGB(col[0], col[1], col[2]);
        picker.showPicker();
        $(jscolor.picker.boxB).css({
          top: stop.offset().top + stop.height(),
          left: stop.offset().left
        }).addClass('color-picker gradient-color-picker').click(function(e) {
          return e.stopPropagation();
        }).mousedown(function(e) {
          return e.preventDefault();
        });
        return $('body').one('click', function() {
          stop.removeClass('open');
          $(jscolor.picker.boxB).removeClass('gradient-color-picker');
          return picker.hidePicker();
        });
      }).dblclick(function(e) {
        return e.stopPropagation();
      });
    };
    updateGradient = function(editor) {
      var c, colors, gradient, width;
      width = editor.find('> div').width();
      colors = [];
      $('.color-stop', editor).each(function() {
        var left;
        left = $(this).get(0).style.left;
        if (left.endswith('%')) {
          left = parseInt(left) / 100;
        } else if (left.endswith('px')) {
          left = parseInt(left) / width;
        }
        return colors.push([left, $(this).css('background-color')]);
      });
      colors.sort();
      colors.reverse();
      colors = (function() {
        var _i, _len, _results;
        _results = [];
        for (_i = 0, _len = colors.length; _i < _len; _i++) {
          c = colors[_i];
          _results.push("color-stop(" + c[0] + ", " + c[1] + ")");
        }
        return _results;
      })();
      gradient = "-webkit-gradient(linear, left bottom, right bottom, " + (colors.join(', ')) + ")";
      $('.gradient-preview', editor).css('background-image', gradient);
      return editor.trigger('change');
    };
    ctx.dblclick(function(e) {
      var editor, position;
      editor = $(this);
      ctx = editor.find('> div');
      position = (e.pageX - ctx.offset().left) / ctx.width();
      editor.append(makeStop(editor, 'green', position));
      return updateGradient(editor);
    });
    makeStop(input, '#1f201a', 0).appendTo(ctx);
    makeStop(input, '#41b3a5', 0.5).appendTo(ctx);
    makeStop(input, '#b4ff49', 1).appendTo(ctx);
    updateGradient(input);
    return input;
  };

  Form._getValue_colorGradient = function(field, input) {
    var colors, func, width;
    width = input.find('> div').width();
    colors = [];
    $('.color-stop', input).each(function() {
      var c, col, left;
      left = $(this).get(0).style.left;
      if (left.endswith('%')) {
        left = parseInt(left) / 100;
      } else if (left.endswith('px')) {
        left = parseInt(left) / width;
      }
      col = $(this).css('background-color').replace(/[^\d ]+/g, '').split(' ');
      col = (function() {
        var _i, _len, _results;
        _results = [];
        for (_i = 0, _len = col.length; _i < _len; _i++) {
          c = col[_i];
          _results.push(parseInt(c));
        }
        return _results;
      })();
      return colors.push([left, col]);
    });
    colors.sort();
    colors.unshift([0, colors[0][1]]);
    colors.push([1, colors[colors.length - 1][1]]);
    return func = function(p) {
      var a, b, c1, c2, i, maxiter, toHex;
      a = 0;
      b = colors.length - 1;
      if (b === 0) {
        return;
      }
      maxiter = colors.length;
      while (maxiter > 0) {
        i = Math.floor((b + a) / 2);
        if (colors[i][0] > p) {
          b = i;
        } else if (colors[i][0] < p) {
          a = i;
        } else {
          return colors[i][1];
        }
        if (b === a + 1) {
          break;
        }
        maxiter--;
      }
      if (!maxiter) {
        throw "Iteration limit reached.";
      }
      c1 = colors[a][1];
      c2 = colors[b][1];
      p = (p - colors[a][0]) / (colors[b][0] - colors[a][0]);
      toHex = function(c) {
        var hex;
        c = Math.round(c);
        c = Math.min(c, 255);
        c = Math.max(c, 0);
        hex = c.toString(16);
        if (hex.length === 1) {
          return '0' + hex;
        } else {
          return hex;
        }
      };
      return '#' + [toHex(Math.round(c1[0] + (c2[0] - c1[0]) * p)), toHex(Math.round(c1[1] + (c2[1] - c1[1]) * p)), toHex(Math.round(c1[2] + (c2[2] - c1[2]) * p))].join('');
    };
  };

  Form._getInput_color = function(field) {
    var input, picker;
    input = Form._getInput_string(field);
    picker = new jscolor.color(input.get(0), {
      onImmediateChange: function(e) {
        return input.trigger('change');
      }
    });
    input.on('focus', function() {
      return $(jscolor.picker.boxB).addClass('color-picker');
    });
    return input;
  };

  Form._getValue_color = function(field, input) {
    return parseInt(input.val(), 16);
  };

  Form._getInput_list = function(field) {
    var selector;
    selector = $('<select/>');
    $.each(field.values || [], function(i) {
      $('<option/>').val(this[0]).text(this[1]).appendTo(selector);
      return true;
    });
    if (field.values.length <= 1) {
      selector.attr('disabled', 'disabled');
    }
    return selector;
  };

  Form._getValue_list = function(field, input) {
    return Form["_getValue_" + field.valueType](field, input);
  };

  Form._getInput_boolean = function(field) {
    return $('<input/>').attr('type', 'checkbox').val(1).attr('checked', field.initial);
  };

  Form._getValue_boolean = function(field, input) {
    return input.is(':checked');
  };

  Form._getInput_integer = function(field) {
    return $('<input/>').attr('type', 'number').attr('min', field.min).attr('max', field.max).attr('step', Math.round(field.step || 1)).val(field.initial);
  };

  Form._getValue_integer = function(field, input) {
    return parseInt(input.val());
  };

  Form._getInput_string = function(field) {
    return $('<input/>').val(field.initial);
  };

  Form._getValue_string = function(field, input) {
    return input.val();
  };

  Form._getInput_float = function(field) {
    var input;
    return input = $('<input/>').attr('type', field.range ? 'range' : 'number').attr('min', field.min).attr('max', field.max).attr('step', field.step || 0.01).val(field.initial);
  };

  Form._getValue_float = function(field, input) {
    return parseFloat(input.val());
  };

  return Form;

})();

LayoutConfigurator = (function() {

  function LayoutConfigurator(factories) {
    this.factories = factories;
    this._updateConfig = __bind(this._updateConfig, this);

    this._switchConfig = __bind(this._switchConfig, this);

    this.callbacks = {
      layoutChanged: $.Callbacks()
    };
  }

  LayoutConfigurator.prototype.getForm = function() {
    var baseId, f, i, this_;
    this_ = this;
    baseId = "config-" + (Math.round(Math.random() * 10e6));
    this.container = $('<div/>').attr('id', baseId).addClass('algorithm-configurator form-horizontal');
    i = 0;
    Form.makeInput("" + baseId + "-algo", 'algo', {
      label: 'Algorithm',
      type: 'list',
      valueType: 'integer',
      values: (function() {
        var _i, _len, _ref, _results;
        _ref = this.factories;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          f = _ref[_i];
          _results.push([i++, f.getName()]);
        }
        return _results;
      }).call(this)
    }, this_._switchConfig).addClass('algorithm-select').appendTo(this_.container);
    $.each(this.factories, function(i) {
      return Form.makeForm("" + baseId + "-factory-" + i, this.getSettings(), this_._updateConfig).addClass('algorithm-config').appendTo(this_.container);
    });
    this._switchConfig('', 0, void 0, $('.algorithm-select select', this.container));
    return this.container;
  };

  LayoutConfigurator.prototype.getLayout = function() {
    var config, form, layout, selected, settings, this_;
    this_ = this;
    selected = $('.algorithm-select select', this.container).val();
    form = $('.algorithm-config', this.container).eq(selected);
    config = form.serializeArray();
    settings = this.currentFactory.getSettings();
    layout = this.currentFactory.buildLayout();
    $.each(settings, function(key) {
      var val;
      val = Form.getValue(form, key, this);
      layout[this.setter](val);
      return true;
    });
    return this.currentLayout = layout;
  };

  LayoutConfigurator.prototype._switchConfig = function(key, val, field, select) {
    this.currentFactory = this.factories[val];
    this.callbacks.layoutChanged.fire(this.currentFactory);
    return $('.algorithm-config', select.closest('.algorithm-configurator')).addClass('hidden').eq(val).removeClass('hidden');
  };

  LayoutConfigurator.prototype._updateConfig = function(key, val, field, el) {
    var form, t;
    if (!this.currentLayout) {
      return;
    }
    form = el.closest('form');
    t = form.attr('id').split('-');
    if (parseInt(t[t.length - 1]) !== this.factories.indexOf(this.currentFactory)) {
      return;
    }
    return this.currentLayout[field.setter](val);
  };

  return LayoutConfigurator;

})();

StrategyConfigurator = (function() {

  function StrategyConfigurator(strategies, viewer) {
    this.strategies = strategies;
    this.viewer = viewer;
    this._switchConfig = __bind(this._switchConfig, this);

  }

  StrategyConfigurator.prototype.getForm = function() {
    var f, i, this_;
    this_ = this;
    this.container = $('<div/>').addClass('strategy-configurator form-horizontal');
    i = 0;
    Form.makeInput("strategy", 'strategy', {
      label: 'Strategy',
      type: 'list',
      valueType: 'integer',
      values: (function() {
        var _i, _len, _ref, _results;
        _ref = this.strategies;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          f = _ref[_i];
          _results.push([i++, f.getName()]);
        }
        return _results;
      }).call(this)
    }, this_._switchConfig).addClass('strategy-select').appendTo(this_.container);
    $.each(this.strategies, function(i) {
      this.getForm().appendTo(this_.container);
      return true;
    });
    this.container.find('.strategy-config').addClass('hidden');
    return this.container;
  };

  StrategyConfigurator.prototype.enable = function() {
    return this._switchConfig('', 0, void 0, $('.strategy-select select', this.container));
  };

  StrategyConfigurator.prototype._switchConfig = function(key, val, field, select) {
    if (this.currentStrategy) {
      this.currentStrategy.deactivate();
    }
    this.currentStrategy = this.strategies[val];
    $('.strategy-config', select.closest('.strategy-configurator')).addClass('hidden').eq(val).removeClass('hidden');
    return this.viewer.setRenderer(this.currentStrategy.activate(this.viewer));
  };

  return StrategyConfigurator;

})();

LayoutFactory = (function() {

  function LayoutFactory() {}

  LayoutFactory.prototype.getName = function() {
    return '';
  };

  LayoutFactory.prototype.getSettings = function() {
    return [];
  };

  LayoutFactory.prototype.buildLayout = function() {};

  return LayoutFactory;

})();

Layout = (function() {

  function Layout() {
    this.callbacks = {
      started: $.Callbacks(),
      step: $.Callbacks(),
      done: $.Callbacks(),
      paused: $.Callbacks(),
      resumed: $.Callbacks()
    };
  }

  Layout.prototype._fire = function() {
    var args, event;
    event = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
    return this.callbacks[event].fire.apply(this, args);
  };

  Layout.prototype._run = function() {};

  Layout.prototype.run = function(nodes, edges) {
    this.nodes = nodes;
    this.edges = edges;
    this.setup();
    this._fire('started');
    this._run();
    this.teardown();
    return this._fire('done');
  };

  Layout.prototype.setScene = function(scene) {
    this.scene = scene;
  };

  Layout.prototype.runStep = function(nodes, edges) {
    return this.run(nodes, edges);
  };

  Layout.prototype.stop = function() {};

  Layout.prototype.pause = function() {
    return this.stop();
  };

  Layout.prototype.reset = function() {};

  Layout.prototype.setup = function() {};

  Layout.prototype.teardown = function() {};

  Layout.prototype.isRunning = function() {
    return false;
  };

  Layout.prototype.isPaused = function() {
    return false;
  };

  return Layout;

})();

IterativeLayout = (function(_super) {

  __extends(IterativeLayout, _super);

  function IterativeLayout() {
    IterativeLayout.__super__.constructor.apply(this, arguments);
    this._interval = 1;
    this._initialized = false;
    this._running = false;
    this._paused = false;
  }

  IterativeLayout.prototype.run = function(nodes, edges) {
    var run,
      _this = this;
    this.nodes = nodes;
    this.edges = edges;
    if (!this._initialized) {
      this.setup();
      this._initialized = true;
    }
    this._stop = false;
    this._running = true;
    if (this._paused) {
      this._paused = false;
      this._fire('resumed');
    } else {
      this._fire('started');
    }
    run = function() {
      if (_this._stop || _this._paused) {
        _this._running = false;
        if (_this._paused) {
          _this._fire('paused');
        } else {
          _this._initialized = false;
          _this._fire('done');
        }
        return;
      }
      _this.step();
      _this._fire('step');
      _this.currentIteration -= 1;
      if (_this.currentIteration <= 0) {
        _this._stop = true;
      }
      return setTimeout(run, _this._interval);
    };
    return run();
  };

  IterativeLayout.prototype.stop = function() {
    this._stop = true;
    return this._paused = false;
  };

  IterativeLayout.prototype.pause = function() {
    this._stop = true;
    return this._paused = true;
  };

  IterativeLayout.prototype.runStep = function(nodes, edges) {
    this.nodes = nodes;
    this.edges = edges;
    if (!this._initialized) {
      this.setup();
      this._initialized = true;
    }
    this.step();
    return this._fire('step');
  };

  IterativeLayout.prototype.isRunning = function() {
    return this._running;
  };

  IterativeLayout.prototype.isPaused = function() {
    return this._paused;
  };

  IterativeLayout.prototype.reset = function() {
    this.teardown();
    return this._initialized = false;
  };

  IterativeLayout.prototype.setup = function() {};

  IterativeLayout.prototype.step = function() {};

  IterativeLayout.prototype.teardown = function() {};

  return IterativeLayout;

})(Layout);

WorkerLayout = (function(_super) {

  __extends(WorkerLayout, _super);

  function WorkerLayout(implementation) {
    this.implementation = implementation;
    this.handleMessage = __bind(this.handleMessage, this);

    this.worker = new Worker(window.layoutWorkers[this.implementation]);
    this.worker.onmessage = this.handleMessage;
    WorkerLayout.__super__.constructor.apply(this, arguments);
  }

  WorkerLayout.prototype.handleMessage = function(msg) {
    var args, func, method;
    method = "remote_" + msg.data[0];
    args = msg.data.slice(1);
    func = this[method];
    if (!(func != null)) {
      throw "Invalid method: " + method;
    }
    return func.apply(this, args);
  };

  WorkerLayout.prototype.remote_started = function() {
    this._running = true;
    return this._fire('started');
  };

  WorkerLayout.prototype.remote_stopped = function(done) {
    this._paused = !done;
    this._running = false;
    if (done) {
      return this._fire('done');
    } else {
      return this._fire('paused');
    }
  };

  WorkerLayout.prototype.remote_updatePositions = function(posx, posy, posz) {
    posx = new Float32Array(posx);
    posy = new Float32Array(posy);
    posz = new Float32Array(posz);
    this.nodes.iter(function(n, i) {
      var p;
      p = new THREE.Vector3(posx[i], posy[i], posz[i]);
      return n.setPosition(p);
    });
    return this._fire('step');
  };

  WorkerLayout.prototype.sendMessage = function(method, args, transfer) {
    var msg;
    if (args == null) {
      args = [];
    }
    if (transfer == null) {
      transfer = [];
    }
    msg = args.slice(0);
    msg.unshift(method);
    return this.worker.postMessage(msg, transfer);
  };

  WorkerLayout.prototype.stop = function() {
    return this.sendMessage('stop');
  };

  WorkerLayout.prototype.pause = function() {
    return this.sendMessage('pause');
  };

  WorkerLayout.prototype.reset = function() {};

  WorkerLayout.prototype.setup = function() {
    return this.updateModel();
  };

  WorkerLayout.prototype.run = function(nodes, edges) {
    this.nodes = nodes;
    this.edges = edges;
    this._running = false;
    this._paused = false;
    this.setup();
    return this.sendMessage('run');
  };

  WorkerLayout.prototype.runStep = function(nodes, edges) {
    this.nodes = nodes;
    this.edges = edges;
    this.setup();
    return this.sendMessage('step');
  };

  WorkerLayout.prototype.teardown = function() {};

  WorkerLayout.prototype.isRunning = function() {
    return this._running;
  };

  WorkerLayout.prototype.isPaused = function() {
    return this._paused;
  };

  WorkerLayout.prototype.updateModel = function() {
    var c, dom, dst, makeArray, nodeMap, posx, posy, posz, src;
    makeArray = function(type, length) {
      var buffer;
      buffer = new ArrayBuffer(type.BYTES_PER_ELEMENT * length);
      return new type(buffer);
    };
    c = 0;
    this.nodes.iter(function() {
      return c++;
    });
    dom = makeArray(Uint8Array, c);
    posx = makeArray(Float32Array, c);
    posy = makeArray(Float32Array, c);
    posz = makeArray(Float32Array, c);
    nodeMap = {};
    this.nodes.iter(function(n, i) {
      var p;
      p = n.getPosition();
      dom[i] = n.domain.id;
      posx[i] = p.x;
      posy[i] = p.y;
      posz[i] = p.z;
      return nodeMap[n.fqid] = i;
    });
    this.sendMessage('updateNodes', [dom.buffer, posx.buffer, posy.buffer, posz.buffer], [dom.buffer, posx.buffer, posy.buffer, posz.buffer]);
    c = 0;
    this.edges.iter(function() {
      return c++;
    });
    src = makeArray(Uint32Array, c);
    dst = makeArray(Uint32Array, c);
    this.edges.iter(function(e, i) {
      src[i] = nodeMap[e.src.fqid];
      return dst[i] = nodeMap[e.dst.fqid];
    });
    return this.sendMessage('updateEdges', [src.buffer, dst.buffer], [src.buffer, dst.buffer]);
  };

  return WorkerLayout;

})(Layout);

FruchtermanReingoldLayout2D = (function(_super) {

  __extends(FruchtermanReingoldLayout2D, _super);

  function FruchtermanReingoldLayout2D() {
    return FruchtermanReingoldLayout2D.__super__.constructor.apply(this, arguments);
  }

  FruchtermanReingoldLayout2D.prototype.setup = function() {
    var _this = this;
    this.redrawArea();
    this._updateAxis();
    this.nodes.iter(function(node) {
      var o, p;
      o = new THREE.Vector3(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5);
      o.setComponent(_this.axis, 0);
      p = node.getPosition();
      p.add(o);
      return node.setPosition(p);
    });
    return this.currentIteration = this.iterations;
  };

  FruchtermanReingoldLayout2D.prototype.setTemperature = function(temperature) {
    this.temperature = temperature;
  };

  FruchtermanReingoldLayout2D.prototype.setK = function(k) {
    this.k = k;
    return this._resume();
  };

  FruchtermanReingoldLayout2D.prototype.setIterations = function(iterations) {
    this.iterations = iterations;
    return this._resume();
  };

  FruchtermanReingoldLayout2D.prototype.setAreaVisible = function(areaVisible) {
    if (!this.scene) {
      this.areaVisible = areaVisible;
      return;
    }
    if (!areaVisible) {
      this.scene.remove(this._circleObject);
    } else if (areaVisible) {
      this.scene.add(this._circleObject);
    }
    return this.areaVisible = areaVisible;
  };

  FruchtermanReingoldLayout2D.prototype.setRadius = function(radius) {
    this.radius = radius;
    this.redrawArea();
    return this._resume();
  };

  FruchtermanReingoldLayout2D.prototype.setOnlyVisible = function(onlyVisible) {
    this.onlyVisible = onlyVisible;
  };

  FruchtermanReingoldLayout2D.prototype.setScene = function(scene) {
    this.scene = scene;
    return this.redrawArea();
  };

  FruchtermanReingoldLayout2D.prototype.redrawArea = function() {
    if (this.scene && this.areaVisible && this._circleObject) {
      this.scene.remove(this._circleObject);
    }
    this._circleObject = makeCirclePlane(this.radius, this.axis);
    if (this.scene && this.areaVisible) {
      return this.scene.add(this._circleObject);
    }
  };

  FruchtermanReingoldLayout2D.prototype.setAxis = function(axis) {
    this._oldAxis = this.axis;
    this.axis = axis;
    return this.redrawArea();
  };

  FruchtermanReingoldLayout2D.prototype._resume = function() {
    return this.currentIteration = this.iterations;
  };

  FruchtermanReingoldLayout2D.prototype.step = function() {
    this.count = 0;
    this._calculateForces();
    return this._applyPositions();
  };

  FruchtermanReingoldLayout2D.prototype.run = function() {
    if (!this._paused) {
      this._resume();
    }
    FruchtermanReingoldLayout2D.__super__.run.apply(this, arguments);
    return this.redrawArea();
  };

  FruchtermanReingoldLayout2D.prototype._calculateRepulsion = function() {
    var f_r,
      _this = this;
    f_r = function(d) {
      return -_this.k * _this.k / d;
    };
    return this.nodes.iter(function(v) {
      if (_this.onlyVisible && !v.isVisible()) {
        return;
      }
      v._force = new THREE.Vector3(0, 0, 0);
      _this.nodes.iter(function(u) {
        var d, f;
        if (u === v) {
          return;
        }
        if (_this.onlyVisible && !u.isVisible()) {
          return;
        }
        d = v.getPosition().clone().sub(u.getPosition());
        if (d.length() === 0) {
          d = new THREE.Vector3(Math.random(), Math.random(), Math.random());
          d.setComponent(_this.axis, 0);
        }
        f = f_r(d.length());
        return v._force.sub(d.normalize().multiplyScalar(f));
      });
      return _this.count++;
    });
  };

  FruchtermanReingoldLayout2D.prototype._calculateAttraction = function() {
    var f_a,
      _this = this;
    f_a = function(d) {
      return d * d / _this.k;
    };
    return this.edges.iter(function(e) {
      var d, f, u, v, _ref;
      if (_this.onlyVisible && !e.isVisible()) {
        return;
      }
      _ref = [e.src, e.dst], u = _ref[0], v = _ref[1];
      d = v.getPosition().clone().sub(u.getPosition());
      if (d.length() === 0) {
        d = new THREE.Vector3(Math.random(), Math.random(), Math.random());
        d.setComponent(_this.axis, 0);
      }
      f = f_a(d.length()) * 2;
      f = d.normalize().multiplyScalar(f);
      v._force.sub(f);
      u._force.add(f);
      return _this.count++;
    });
  };

  FruchtermanReingoldLayout2D.prototype._updateAxis = function() {
    var _this = this;
    if (this._oldAxis !== void 0) {
      this.nodes.iter(function(node) {
        var p;
        p = node.getPosition();
        p.setComponent(_this._oldAxis, p.getComponent(_this.axis));
        p.setComponent(_this.axis, 0);
        return node.setPosition(p);
      });
      return this._oldAxis = void 0;
    }
  };

  FruchtermanReingoldLayout2D.prototype._calculateForces = function() {
    this._updateAxis();
    this._calculateRepulsion();
    return this._calculateAttraction();
  };

  FruchtermanReingoldLayout2D.prototype._applyPositions = function() {
    var fmax, fmax2, temp,
      _this = this;
    fmax = this.radius / 2;
    fmax2 = fmax * fmax;
    temp = this.currentIteration / this.iterations * this.temperature;
    return this.nodes.iter(function(node) {
      var d, p;
      if (_this.onlyVisible && !node.isVisible()) {
        return;
      }
      d = node._force.normalize().multiplyScalar(temp);
      if (d.lengthSq() > fmax2) {
        d.setLength(fmax);
      }
      p = node.getPosition().clone().add(d);
      if (p.lengthSq() > _this.radius * _this.radius) {
        p.setLength(_this.radius);
      }
      p.setComponent(_this.axis, 0);
      return node.setPosition(p);
    });
  };

  return FruchtermanReingoldLayout2D;

})(IterativeLayout);

FRLayout2DFactory = (function(_super) {

  __extends(FRLayout2DFactory, _super);

  function FRLayout2DFactory() {
    return FRLayout2DFactory.__super__.constructor.apply(this, arguments);
  }

  FRLayout2DFactory.prototype.getName = function() {
    return 'Fruchterman-Reingold (2D)';
  };

  FRLayout2DFactory.prototype.buildLayout = function() {
    return new FruchtermanReingoldLayout2D();
  };

  FRLayout2DFactory.prototype.getSettings = function() {
    return {
      k: {
        label: 'Optimal distance',
        type: 'integer',
        min: 1,
        initial: 10,
        setter: 'setK'
      },
      temperature: {
        label: 'Initial temperature',
        type: 'float',
        max: 1,
        min: 0,
        initial: 1,
        step: 0.01,
        setter: 'setTemperature'
      },
      iterations: {
        label: 'Iterations',
        type: 'integer',
        min: 1,
        initial: 500,
        setter: 'setIterations'
      },
      radius: {
        label: 'Maximal radius',
        type: 'integer',
        min: 1,
        initial: 150,
        setter: 'setRadius'
      },
      axis: {
        label: 'Plane',
        type: 'list',
        valueType: 'integer',
        values: [[2, 'X-Y'], [1, 'X-Z'], [0, 'Y-Z']],
        setter: 'setAxis'
      },
      area: {
        label: 'Show surface',
        type: 'boolean',
        initial: true,
        setter: 'setAreaVisible'
      },
      visible: {
        label: 'Only visible',
        type: 'boolean',
        initial: false,
        setter: 'setOnlyVisible'
      }
    };
  };

  return FRLayout2DFactory;

})(LayoutFactory);

FRLayout2DAsync = (function(_super) {

  __extends(FRLayout2DAsync, _super);

  function FRLayout2DAsync() {
    FRLayout2DAsync.__super__.constructor.call(this, 'fr2d');
  }

  FRLayout2DAsync.prototype.setK = function(k) {
    return this.sendMessage('setProperty', ['k', k]);
  };

  FRLayout2DAsync.prototype.setIterations = function(iterations) {
    return this.sendMessage('setProperty', ['iterations', iterations]);
  };

  FRLayout2DAsync.prototype.setRadius = function(radius) {
    this.radius = radius;
    this.sendMessage('setProperty', ['radius', radius]);
    return this.redrawArea();
  };

  FRLayout2DAsync.prototype.setAxis = function(axis) {
    this.axis = axis;
    this.sendMessage('setProperty', ['axis', axis]);
    return this.redrawArea();
  };

  FRLayout2DAsync.prototype.setTemperature = function(temp) {
    return this.sendMessage('setProperty', ['temperature', temp]);
  };

  FRLayout2DAsync.prototype.setScene = function(scene) {
    this.scene = scene;
    return this.redrawArea();
  };

  FRLayout2DAsync.prototype.setAreaVisible = function(areaVisible) {
    if (!this.scene) {
      this.areaVisible = areaVisible;
      return;
    }
    if (!areaVisible) {
      this.scene.remove(this._circleObject);
    } else if (areaVisible) {
      this.scene.add(this._circleObject);
    }
    return this.areaVisible = areaVisible;
  };

  FRLayout2DAsync.prototype.redrawArea = function() {
    if (this.scene && this.areaVisible && this._circleObject) {
      this.scene.remove(this._circleObject);
    }
    this._circleObject = makeCirclePlane(this.radius, this.axis);
    if (this.scene && this.areaVisible) {
      return this.scene.add(this._circleObject);
    }
  };

  return FRLayout2DAsync;

})(WorkerLayout);

FRLayout2DAsyncFactory = (function(_super) {

  __extends(FRLayout2DAsyncFactory, _super);

  function FRLayout2DAsyncFactory() {
    return FRLayout2DAsyncFactory.__super__.constructor.apply(this, arguments);
  }

  FRLayout2DAsyncFactory.prototype.getName = function() {
    return 'Fruchterman-Reingold (2D, async)';
  };

  FRLayout2DAsyncFactory.prototype.buildLayout = function() {
    return new FRLayout2DAsync();
  };

  FRLayout2DAsyncFactory.prototype.getSettings = function() {
    var settings;
    settings = $.extend({}, FRLayout2DAsyncFactory.__super__.getSettings.call(this));
    delete settings['visible'];
    return settings;
  };

  return FRLayout2DAsyncFactory;

})(FRLayout2DFactory);

DomainFruchtermanReingoldLayout2D = (function(_super) {

  __extends(DomainFruchtermanReingoldLayout2D, _super);

  function DomainFruchtermanReingoldLayout2D() {
    return DomainFruchtermanReingoldLayout2D.__super__.constructor.apply(this, arguments);
  }

  DomainFruchtermanReingoldLayout2D.prototype.setInterDomainEdgeWeight = function(w) {
    if (w > 0) {
      w *= this.k * 2;
    }
    return this.interWeight = w + 1;
  };

  DomainFruchtermanReingoldLayout2D.prototype._calculateRepulsion = function() {
    var f_r,
      _this = this;
    f_r = function(d) {
      return -_this.k * _this.k / d;
    };
    return this.nodes.iter(function(v) {
      if (_this.onlyVisible && !v.isVisible()) {
        return;
      }
      v._force = new THREE.Vector3(0, 0, 0);
      _this.nodes.iter(function(u) {
        var d, f;
        if (u === v) {
          return;
        }
        if (u.domain.id !== v.domain.id) {
          return;
        }
        if (_this.onlyVisible && !u.isVisible()) {
          return;
        }
        d = v.getPosition().clone().sub(u.getPosition());
        if (d.length() === 0) {
          d = new THREE.Vector3(Math.random(), Math.random(), Math.random());
          d.setComponent(_this.axis, 0);
        }
        f = f_r(d.length());
        return v._force.sub(d.normalize().multiplyScalar(f));
      });
      return _this.count++;
    });
  };

  DomainFruchtermanReingoldLayout2D.prototype._calculateAttraction = function() {
    var f_a,
      _this = this;
    f_a = function(d) {
      return d * d / _this.k;
    };
    return this.edges.iter(function(e) {
      var d, f, l, u, v, _ref;
      if (_this.onlyVisible && !e.isVisible()) {
        return;
      }
      _ref = [e.src, e.dst], u = _ref[0], v = _ref[1];
      d = v.getPosition().clone().sub(u.getPosition());
      l = d.length();
      if (e.src.domain.id !== e.dst.domain.id) {
        l *= _this.interWeight;
      }
      f = f_a(l) * 2;
      f = d.normalize().multiplyScalar(f);
      v._force.sub(f);
      u._force.add(f);
      return _this.count++;
    });
  };

  return DomainFruchtermanReingoldLayout2D;

})(FruchtermanReingoldLayout2D);

DomainFRLayout2DFactory = (function(_super) {

  __extends(DomainFRLayout2DFactory, _super);

  function DomainFRLayout2DFactory() {
    return DomainFRLayout2DFactory.__super__.constructor.apply(this, arguments);
  }

  DomainFRLayout2DFactory.prototype.getName = function() {
    return 'Domain Fruchterman-Reingold (2D)';
  };

  DomainFRLayout2DFactory.prototype.buildLayout = function() {
    return new DomainFruchtermanReingoldLayout2D();
  };

  DomainFRLayout2DFactory.prototype.getSettings = function() {
    var settings;
    settings = DomainFRLayout2DFactory.__super__.getSettings.call(this);
    settings.interWeight = {
      label: 'Inter-/intra-domain edge clarity tradeoff',
      type: 'float',
      initial: 0,
      range: true,
      min: -1,
      max: 1,
      setter: 'setInterDomainEdgeWeight'
    };
    return settings;
  };

  return DomainFRLayout2DFactory;

})(FRLayout2DFactory);

FruchtermanReingoldLayout3D = (function(_super) {

  __extends(FruchtermanReingoldLayout3D, _super);

  function FruchtermanReingoldLayout3D() {
    return FruchtermanReingoldLayout3D.__super__.constructor.apply(this, arguments);
  }

  FruchtermanReingoldLayout3D.prototype._wireframe = function() {
    var dashMaterial, sphereGeometry, wireframe;
    sphereGeometry = new THREE.SphereGeometry(this.radius, 20, 20);
    dashMaterial = new THREE.LineBasicMaterial({
      color: 0x000000,
      opacity: .07,
      dashSize: .2,
      gapSize: 5,
      transparent: true
    });
    wireframe = new THREE.Line(geo2line(sphereGeometry), dashMaterial, THREE.LinePieces);
    wireframe.position.set(0, 0, 0);
    return wireframe;
  };

  FruchtermanReingoldLayout3D.prototype.drawWireframe = function() {
    this._wireframeObject = this._wireframe();
    if (this.scene && this.wireframe) {
      return this.scene.add(this._wireframeObject);
    }
  };

  FruchtermanReingoldLayout3D.prototype.setup = function() {
    var _this = this;
    this.nodes.iter(function(node) {
      var p;
      p = node.getPosition();
      p.add(new THREE.Vector3(Math.random() / 1000, Math.random() / 1000, Math.random() / 1000));
      return node.setPosition(p);
    });
    return this.currentIteration = this.iterations;
  };

  FruchtermanReingoldLayout3D.prototype.setWireframe = function(wireframe) {
    this.wireframe = wireframe;
    if (!this.scene) {
      this.wireframe = wireframe;
      return;
    }
    if (!this.wireframe) {
      return this.scene.remove(this._wireframeObject);
    } else if (this.wireframe) {
      return this.scene.add(this._wireframeObject);
    }
  };

  FruchtermanReingoldLayout3D.prototype.setRadius = function(radius) {
    this.radius = radius;
    if (this.scene) {
      if (this.wireframe) {
        this.scene.remove(this._wireframeObject);
      }
      this._wireframeObject = this._wireframe();
      if (this.wireframe) {
        this.scene.add(this._wireframeObject);
      }
    }
    return this._resume();
  };

  FruchtermanReingoldLayout3D.prototype.setScene = function(scene) {
    this.scene = scene;
    return this.drawWireframe();
  };

  FruchtermanReingoldLayout3D.prototype._calculateForces = function() {
    this._calculateRepulsion();
    return this._calculateAttraction();
  };

  FruchtermanReingoldLayout3D.prototype._calculateAttraction = function() {
    var f_a,
      _this = this;
    f_a = function(d) {
      return d * d / _this.k;
    };
    return this.edges.iter(function(e) {
      var d, f, u, v, _ref;
      if (_this.onlyVisible && !e.isVisible()) {
        return;
      }
      _ref = [e.src, e.dst], u = _ref[0], v = _ref[1];
      d = v.getPosition().clone().sub(u.getPosition());
      if (d.length() === 0) {
        d = new THREE.Vector3(Math.random(), Math.random(), Math.random());
      }
      f = f_a(d.length()) * 2;
      f = d.normalize().multiplyScalar(f);
      v._force.sub(f);
      u._force.add(f);
      return _this.count++;
    });
  };

  FruchtermanReingoldLayout3D.prototype._calculateRepulsion = function() {
    var f_r,
      _this = this;
    f_r = function(d) {
      return -_this.k * _this.k / d;
    };
    return this.nodes.iter(function(v) {
      if (_this.onlyVisible && !v.isVisible()) {
        return;
      }
      v._force = new THREE.Vector3(0, 0, 0);
      _this.nodes.iter(function(u) {
        var d, f;
        if (u === v) {
          return;
        }
        if (_this.onlyVisible && !u.isVisible()) {
          return;
        }
        d = v.getPosition().clone().sub(u.getPosition());
        if (d.length() === 0) {
          d = new THREE.Vector3(Math.random(), Math.random(), Math.random());
        }
        f = f_r(d.length());
        return v._force.sub(d.normalize().multiplyScalar(f));
      });
      return _this.count++;
    });
  };

  FruchtermanReingoldLayout3D.prototype._applyPositions = function() {
    var fmax, fmax2, temp,
      _this = this;
    fmax = this.radius / 2;
    fmax2 = fmax * fmax;
    temp = this.currentIteration / this.iterations * this.temperature / this.count;
    return this.nodes.iter(function(node) {
      var d, p;
      if (_this.onlyVisible && !node.isVisible()) {
        return;
      }
      d = node._force.normalize().multiplyScalar(temp);
      if (d.lengthSq() > fmax2) {
        d.setLength(fmax);
      }
      p = node.getPosition().clone().add(d);
      if (p.lengthSq() > _this.radius * _this.radius) {
        p.setLength(_this.radius);
      }
      return node.setPosition(p);
    });
  };

  return FruchtermanReingoldLayout3D;

})(FruchtermanReingoldLayout2D);

FRLayout3DFactory = (function(_super) {

  __extends(FRLayout3DFactory, _super);

  function FRLayout3DFactory() {
    return FRLayout3DFactory.__super__.constructor.apply(this, arguments);
  }

  FRLayout3DFactory.prototype.getName = function() {
    return 'Fruchterman-Reingold (3D)';
  };

  FRLayout3DFactory.prototype.buildLayout = function() {
    return new FruchtermanReingoldLayout3D();
  };

  FRLayout3DFactory.prototype.getSettings = function() {
    return {
      k: {
        label: 'Optimal distance',
        type: 'integer',
        min: 1,
        initial: 50,
        setter: 'setK'
      },
      temperature: {
        label: 'Initial temperature',
        type: 'float',
        max: 1,
        min: 0,
        initial: 1,
        step: 0.01,
        setter: 'setTemperature'
      },
      iter: {
        label: 'Iterations',
        type: 'integer',
        min: 1,
        initial: 500,
        setter: 'setIterations'
      },
      radius: {
        label: 'Maximal radius',
        type: 'integer',
        min: 1,
        initial: 15,
        setter: 'setRadius'
      },
      wireframe: {
        label: 'Show wireframe',
        type: 'boolean',
        initial: true,
        setter: 'setWireframe'
      },
      visible: {
        label: 'Only visible',
        type: 'boolean',
        initial: false,
        setter: 'setOnlyVisible'
      }
    };
  };

  return FRLayout3DFactory;

})(LayoutFactory);

RandomLayout = (function(_super) {

  __extends(RandomLayout, _super);

  function RandomLayout() {
    return RandomLayout.__super__.constructor.apply(this, arguments);
  }

  RandomLayout.prototype.setWidth = function(width) {
    this.width = width;
    return this.redraw();
  };

  RandomLayout.prototype.setHeight = function(height) {
    this.height = height;
    return this.redraw();
  };

  RandomLayout.prototype.setDepth = function(depth) {
    this.depth = depth;
    return this.redraw();
  };

  RandomLayout.prototype.redraw = function() {
    var dashMaterial, geom;
    if (this.scene) {
      if (this.wireframe) {
        this.scene.remove(this.wireframe);
      }
      dashMaterial = new THREE.LineBasicMaterial({
        color: 0x000000,
        opacity: .15,
        dashSize: .2,
        gapSize: 5,
        transparent: true
      });
      geom = new THREE.CubeGeometry(this.width, this.height, this.depth);
      this.wireframe = new THREE.Line(geo2line(geom), dashMaterial, THREE.LinePieces);
      this.wireframe.position.set(0, 0, 0);
      if (this.showWireframe) {
        return this.scene.add(this.wireframe);
      }
    }
  };

  RandomLayout.prototype.setScene = function(scene) {
    this.scene = scene;
    return this.redraw();
  };

  RandomLayout.prototype.setWireframe = function(showWireframe) {
    this.showWireframe = showWireframe;
    if (this.scene && this.wireframe) {
      if (this.showWireframe) {
        return this.scene.add(this.wireframe);
      } else {
        return this.scene.remove(this.wireframe);
      }
    }
  };

  RandomLayout.prototype._run = function() {
    var _this = this;
    this.redraw();
    return this.nodes.iter(function(node) {
      return node.setPosition(new THREE.Vector3((Math.random() - 0.5) * _this.width, (Math.random() - 0.5) * _this.height, (Math.random() - 0.5) * _this.depth));
    });
  };

  return RandomLayout;

})(Layout);

RandomLayoutFactory = (function(_super) {

  __extends(RandomLayoutFactory, _super);

  function RandomLayoutFactory() {
    return RandomLayoutFactory.__super__.constructor.apply(this, arguments);
  }

  RandomLayoutFactory.prototype.getName = function() {
    return 'Random';
  };

  RandomLayoutFactory.prototype.buildLayout = function() {
    return new RandomLayout();
  };

  RandomLayoutFactory.prototype.getSettings = function() {
    return {
      width: {
        label: 'Width',
        type: 'integer',
        min: 0,
        initial: 60,
        max: 10000,
        setter: 'setWidth'
      },
      height: {
        label: 'Height',
        type: 'integer',
        min: 0,
        initial: 40,
        max: 10000,
        setter: 'setHeight'
      },
      depth: {
        label: 'Depth',
        type: 'integer',
        min: 0,
        initial: 30,
        max: 10000,
        setter: 'setDepth'
      },
      wireframe: {
        label: 'Show wireframe',
        type: 'boolean',
        initial: true,
        setter: 'setWireframe'
      }
    };
  };

  return RandomLayoutFactory;

})(LayoutFactory);

StackedLayout = (function(_super) {

  __extends(StackedLayout, _super);

  function StackedLayout() {
    return StackedLayout.__super__.constructor.apply(this, arguments);
  }

  StackedLayout.prototype.setX = function(x) {
    return this.x = -x;
  };

  StackedLayout.prototype.setY = function(y) {
    return this.y = -y;
  };

  StackedLayout.prototype.setZ = function(z) {
    return this.z = -z;
  };

  StackedLayout.prototype.setScene = function(scene) {
    this.scene = scene;
  };

  StackedLayout.prototype._run = function() {
    var d, h, l, w,
      _this = this;
    l = this.nodes.length;
    if (l === void 0) {
      l = 0;
      this.nodes.iter(function() {
        return l++;
      });
    }
    h = this.y * (l - 1);
    w = this.x * (l - 1);
    d = this.z * (l - 1);
    return this.nodes.iter(function(node, i) {
      return node.setPosition(new THREE.Vector3(_this.x * i - w / 2, _this.y * i - h / 2, _this.z * i - d / 2));
    });
  };

  return StackedLayout;

})(Layout);

StackedLayoutFactory = (function(_super) {

  __extends(StackedLayoutFactory, _super);

  function StackedLayoutFactory() {
    return StackedLayoutFactory.__super__.constructor.apply(this, arguments);
  }

  StackedLayoutFactory.prototype.getName = function() {
    return 'Stacked';
  };

  StackedLayoutFactory.prototype.buildLayout = function() {
    return new StackedLayout();
  };

  StackedLayoutFactory.prototype.getSettings = function() {
    return {
      xoffset: {
        label: 'X-offset',
        type: 'integer',
        min: -100,
        initial: 0,
        max: 100,
        setter: 'setX'
      },
      yoffset: {
        label: 'Y-offset',
        type: 'integer',
        min: -100,
        initial: 10,
        max: 100,
        setter: 'setY'
      },
      zoffset: {
        label: 'Z-offset',
        type: 'integer',
        min: -100,
        initial: 0,
        max: 100,
        setter: 'setZ'
      }
    };
  };

  return StackedLayoutFactory;

})(LayoutFactory);

parseIds = function(id, onlyLast) {
  var tokens;
  if (onlyLast == null) {
    onlyLast = false;
  }
  tokens = id.split('::');
  if (onlyLast) {
    return parseInt(tokens[tokens.length - 1].replace(/^n|g|d|e/, ''));
  } else {
    return tokens.map(function(el) {
      return parseInt(el.replace(/^n|g|d|e/, ''));
    });
  }
};

NeighborsIterator = (function() {

  function NeighborsIterator(node) {
    this.node = node;
    this.next = __bind(this.next, this);

    this.directed = true;
    this.index = 0;
  }

  NeighborsIterator.prototype.next = function() {
    var edge;
    if (this.directed) {
      if (this.index < this.node._outEdges.length) {
        return this.node._outEdges[this.index++].dst;
      } else {
        this.directed = false;
        this.index = 0;
      }
    }
    if (this.index < this.node._edges.length) {
      edge = this.node._edges[this.index++];
      if (edge.dst === this.node) {
        return edge.src;
      } else {
        return edge.dst;
      }
    }
    throw StopIteration;
  };

  return NeighborsIterator;

})();

Node = (function() {

  function Node(model, domain, id, attributes, _globalId) {
    this.model = model;
    this.domain = domain;
    this.attributes = attributes;
    this._globalId = _globalId;
    this.fqid = parseIds(id);
    this.id = this.fqid.last();
    this._offset = new THREE.Vector3(0, 0, 0);
    this._position = new THREE.Vector3(0, 0, 0);
    this._absPosition = new THREE.Vector3(0, 0, 0);
    this._degree = 0;
    this._inDegree = 0;
    this._outDegree = 0;
    this._size = 10;
    this._color = new THREE.Color(0xffffff);
    this._opacity = 1.0;
    this._visible = true;
    this._label = this.fqid.join(',');
    this._inEdges = [];
    this._outEdges = [];
    this._edges = [];
    this.neighbors = new IteratorFactory(NeighborsIterator, [this]);
  }

  Node.prototype.getAbsoluteID = function() {
    return this.fqid.join('::');
  };

  Node.prototype.setOffset = function(o) {
    /*
            Sets the offset to be applied to the node after its domain-relative
            position has been defined.
    */
    this._offset = o;
    return this.updatePosition();
  };

  Node.prototype.setPosition = function(p) {
    /*
            Sets the position of the node relative to the absolute coordinates of
            the domain node.
    */
    this._position.x = p.x;
    this._position.y = p.y;
    this._position.z = p.z;
    return this.updatePosition();
  };

  Node.prototype.getPosition = function() {
    /*
            Gets the position of the node relative to the domain.
    */
    return this._position;
  };

  Node.prototype.getAbsolutePosition = function() {
    /*
            Gets the position of the node relative to the origin of the coordinate
            system, by including any offset due to the domain position.
    */
    return this._absPosition;
  };

  Node.prototype.updatePosition = function() {
    /*
            Updates the absolute position of the object by applying the offset to
            the position.
    */

    var transformation, transformed;
    transformation = new THREE.Matrix4(1, 0, 0, this._offset.x, 0, 1, 0, this._offset.y, 0, 0, 1, this._offset.z, 0, 0, 0, 1);
    transformed = this._position.clone().applyMatrix4(transformation);
    return this._absPosition.copy(transformed);
  };

  Node.prototype.getSize = function() {
    return this._size;
  };

  Node.prototype.setSize = function(_size) {
    this._size = _size;
    this.domain.nodeSizes[this.id] = this._size;
    return this;
  };

  Node.prototype.getColor = function() {
    return this._color;
  };

  Node.prototype.setColor = function(color) {
    this.domain.nodeColors[this.id] = this._color = new THREE.Color(color);
    return this;
  };

  Node.prototype.getOpacity = function() {
    return this._opacity;
  };

  Node.prototype.setOpacity = function(_opacity) {
    this._opacity = _opacity;
    this.domain.nodeOpacity[this.id] = this._opacity;
    return this;
  };

  Node.prototype.getDegree = function() {
    return this._degree;
  };

  Node.prototype.getLabel = function() {
    return this._label;
  };

  Node.prototype.setLabel = function(label) {
    this._label = "" + label;
    return this;
  };

  Node.prototype.getAttr = function(key) {
    switch (key) {
      case 'domain':
        if (this.domain) {
          return this.domain.getAttr('domain');
        } else {
          return this.attributes['domain'];
        }
        break;
      case 'degree':
        return this._degree;
      case 'indegree':
        return this._inDegree;
      case 'outdegree':
        return this._outDegree;
      default:
        return this.attributes[key];
    }
  };

  Node.prototype.isVisible = function() {
    return this._visible;
  };

  Node.prototype.hide = function() {
    this._visible = false;
    this.domain.nodeVisibility[this.id] = 0.0;
    return this;
  };

  Node.prototype.show = function() {
    this._visible = true;
    this.domain.nodeVisibility[this.id] = 1.0;
    return this;
  };

  return Node;

})();

Edge = (function() {

  function Edge(model, domain, id, src, dst, attributes, real) {
    var direction;
    this.model = model;
    this.domain = domain;
    this.id = id;
    this.src = src;
    this.dst = dst;
    this.attributes = attributes;
    if (real == null) {
      real = true;
    }
    if (attributes._directed != null) {
      direction = attributes._directed;
    } else {
      if (domain != null) {
        direction = domain.edgedefault;
      } else {
        direction = model.edgedefault;
      }
    }
    switch (direction) {
      case 'true':
      case 'directed':
        this.directed = true;
        break;
      case 'false':
      case 'undirected':
        this.directed = false;
        break;
      default:
        throw "Invalid direction " + direction;
    }
    if (real) {
      if (this.directed) {
        this.src._outEdges.push(this);
        this.dst._inEdges.push(this);
      } else {
        this.src._edges.push(this);
        this.dst._edges.push(this);
      }
    }
    this._weight = 1;
    this._color = new THREE.Color(0x888888);
    this._opacity = 0.8;
    this._visible = true;
    if (!(this.domain != null)) {
      this.domain = this.model;
    }
  }

  Edge.prototype.other = function(node) {
    if (node === this.src) {
      return this.dst;
    }
    if (node === this.dst) {
      return this.src;
    }
    throw 'Node not linked by this edge';
  };

  Edge.prototype.getWeight = function() {
    return this._weight;
  };

  Edge.prototype.setWeight = function(_weight) {
    this._weight = _weight;
    this.domain.edgeWeights[this._index * 2] = this._weight;
    this.domain.edgeWeights[this._index * 2 + 1] = this._weight;
    return this;
  };

  Edge.prototype.getColor = function() {
    return this._color;
  };

  Edge.prototype.setColor = function(color) {
    this.domain.edgeColors[this._index * 2] = this._color = new THREE.Color(color);
    this.domain.edgeColors[this._index * 2 + 1] = this._color;
    return this;
  };

  Edge.prototype.getOpacity = function() {
    return this._opacity;
  };

  Edge.prototype.setOpacity = function(_opacity) {
    this._opacity = _opacity;
    this.domain.edgeOpacity[this._index * 2] = this._opacity;
    this.domain.edgeOpacity[this._index * 2 + 1] = this._opacity;
    return this;
  };

  Edge.prototype.isVisible = function() {
    return this._visible;
  };

  Edge.prototype.hide = function() {
    this._visible = false;
    this.domain.edgeVisibility[this._index * 2] = 0.0;
    this.domain.edgeVisibility[this._index * 2 + 1] = 0.0;
    return this;
  };

  Edge.prototype.show = function() {
    this._visible = true;
    this.domain.edgeVisibility[this._index * 2] = 1.0;
    this.domain.edgeVisibility[this._index * 2 + 1] = 1.0;
    return this;
  };

  return Edge;

})();

Domain = (function(_super) {

  __extends(Domain, _super);

  function Domain(model, id, attributes) {
    this.model = model;
    this.attributes = attributes;
    this.rebuildAttributeMappings = __bind(this.rebuildAttributeMappings, this);

    Domain.__super__.constructor.call(this, this.model, void 0, id, this.attributes);
    this.texture = THREE.ImageUtils.loadTexture('/static/images/node-textures/ball2.png');
    this.nodes = [];
    this.edges = [];
    this.nodeSizes = [];
    this.nodeOpacity = [];
    this.nodeColors = [];
    this.nodeVisibility = [];
    this.nodePositions = [];
    this.edgeWeights = [];
    this.edgeColors = [];
    this.edgeOpacity = [];
    this.edgeVisibility = [];
    this.edgeVertices = [];
  }

  Domain.prototype.rebuildAttributeMappings = function() {
    var _this = this;
    this.nodeSizes.length = 0;
    this.nodeColors.length = 0;
    this.nodePositions.length = 0;
    this.nodes.iter(function(n, i) {
      _this.nodeSizes[i] = n.getSize();
      _this.nodeOpacity[i] = n.getOpacity();
      _this.nodeColors[i] = n.getColor();
      _this.nodeVisibility[i] = n.isVisible();
      return _this.nodePositions[i] = n.getAbsolutePosition();
    });
    this.edgeVertices.length = 0;
    this.edgeWeights.length = 0;
    this.edgeColors.length = 0;
    this.edgeOpacity.length = 0;
    this.edgeVisibility.length = 0;
    return this.edges.iter(function(e, i) {
      _this.edgeVertices[i * 2] = e.src.getAbsolutePosition();
      _this.edgeVertices[i * 2 + 1] = e.dst.getAbsolutePosition();
      _this.edgeWeights[i * 2] = e.getWeight();
      _this.edgeWeights[i * 2 + 1] = e.getWeight();
      _this.edgeColors[i * 2] = e.getColor();
      _this.edgeColors[i * 2 + 1] = e.getColor();
      _this.edgeOpacity[i * 2] = e.getOpacity();
      _this.edgeOpacity[i * 2 + 1] = e.getOpacity();
      _this.edgeVisibility[i * 2] = e.isVisible();
      return _this.edgeVisibility[i * 2 + 1] = e.isVisible();
    });
  };

  Domain.prototype.setTexture = function(url) {
    return this.texture = THREE.ImageUtils.loadTexture(url);
  };

  Domain.prototype.addNode = function(el) {
    var attrs, node;
    attrs = this.model._getAttributes(el);
    node = new Node(this.model, this, el.attr('id'), attrs);
    this.nodes[node.id] = node;
    node.setOffset(this.getAbsolutePosition());
    return node;
  };

  Domain.prototype.addEdge = function(el) {
    var attrs, dst, edge, src;
    attrs = this.model._getAttributes(el);
    attrs._directed = el.attr('directed');
    src = parseIds(el.attr('source'));
    dst = parseIds(el.attr('target'));
    if (src[0] !== dst[0] || src[0] !== this.id) {
      throw "Invalid edge definition";
    }
    src = this.nodes[src[1]];
    dst = this.nodes[dst[1]];
    src._degree += 1;
    dst._degree += 1;
    edge = new Edge(this.model, this, el.attr('id'), src, dst, attrs);
    edge._index = this.edges.length;
    if (edge.directed) {
      src._outDegree += 1;
      dst._inDegree += 1;
    }
    this.edges.push(edge);
    return edge;
  };

  return Domain;

})(Node);

GraphModel = (function(_super) {

  __extends(GraphModel, _super);

  GraphModel.fromGraphML = function(data) {
    var graph, xml;
    xml = $(data);
    graph = new GraphModel();
    graph.edgedefault = $('graphml > graph', xml).attr('edgedefault');
    $('graphml > key', xml).each(function(i) {
      return graph.addAttribute($(this));
    });
    graph._attributes = graph._getAttributes($('graphml > graph', xml));
    $('graphml > graph > node', xml).each(function(i) {
      var domain;
      domain = graph.addDomain($(this));
      domain.edgedefault = $('> graph', this).attr('edgedefault');
      $('> graph > node', this).each(function() {
        return domain.addNode($(this));
      });
      $('> graph > edge', this).each(function() {
        return domain.addEdge($(this));
      });
      return domain.rebuildAttributeMappings();
    });
    $('graphml > graph > edge', xml).each(function() {
      return graph.addEdge($(this));
    });
    graph.rebuildAttributeMappings();
    return graph;
  };

  function GraphModel() {
    this.rebuildAttributeMappings = __bind(this.rebuildAttributeMappings, this);
    GraphModel.__super__.constructor.apply(this, arguments);
    this.nextNodeId = 0;
    this.nextEdgeId = 0;
    this.domains = [];
    this.superedges = [];
    this.attributes = {
      node: {},
      graph: {},
      edge: {},
      all: {},
      _by_id: {}
    };
    this.edgeWeights = [];
    this.edgeColors = [];
    this.edgeOpacity = [];
    this.edgeVisibility = [];
    this.edgeVertices = [];
    this.nodes = new IteratorFactory(ArrayPropertyIterator, [this.domains, 'nodes']);
    this.edges = new IteratorFactory(FlattenIterator, [[this.superedges, new IteratorFactory(ArrayPropertyIterator, [this.domains, 'edges'])]]);
  }

  GraphModel.prototype.rebuildAttributeMappings = function() {
    var _this = this;
    this.edgeVertices.length = 0;
    this.edgeWeights.length = 0;
    this.edgeColors.length = 0;
    this.edgeOpacity.length = 0;
    this.edgeVisibility.length = 0;
    return this.superedges.iter(function(e, i) {
      _this.edgeVertices[i * 2] = e.src.getAbsolutePosition();
      _this.edgeVertices[i * 2 + 1] = e.dst.getAbsolutePosition();
      _this.edgeWeights[i * 2] = e.getWeight();
      _this.edgeWeights[i * 2 + 1] = e.getWeight();
      _this.edgeColors[i * 2] = e.getColor();
      _this.edgeColors[i * 2 + 1] = e.getColor();
      _this.edgeOpacity[i * 2] = e.getOpacity();
      _this.edgeOpacity[i * 2 + 1] = e.getOpacity();
      _this.edgeVisibility[i * 2] = e.isVisible();
      return _this.edgeVisibility[i * 2 + 1] = e.isVisible();
    });
  };

  GraphModel.prototype.getNodeAttributes = function() {
    return $.extend({}, this.attributes.node, this.attributes.all);
  };

  GraphModel.prototype._getAttributes = function(el) {
    var attrs, data;
    data = {};
    attrs = this.attributes._by_id;
    $('> data', el).each(function() {
      el = $(this);
      return data[attrs[el.attr('key')].name] = el.text();
    });
    return data;
  };

  GraphModel.prototype.addAttribute = function(el) {
    var def, domain, id, name, type;
    id = el.attr('id');
    name = el.attr('attr.name');
    type = el.attr('attr.type');
    domain = el.attr('for');
    def = {
      id: id,
      name: name,
      type: type,
      domain: domain
    };
    this.attributes._by_id[id] = def;
    return this.attributes[domain][name] = def;
  };

  GraphModel.prototype.addDomain = function(el) {
    var domain;
    domain = new Domain(this, el.attr('id'), this._getAttributes(el));
    return this.domains[domain.id] = domain;
  };

  GraphModel.prototype.addEdge = function(el) {
    var attrs, dst, edge, src;
    attrs = this._getAttributes(el);
    attrs._directed = el.attr('directed');
    src = parseIds(el.attr('source'));
    dst = parseIds(el.attr('target'));
    src = this.domains[src[0]].nodes[src[1]];
    dst = this.domains[dst[0]].nodes[dst[1]];
    src._degree += 1;
    dst._degree += 1;
    edge = new Edge(this, void 0, el.attr('id'), src, dst, attrs);
    edge._index = this.superedges.length;
    this.superedges.push(edge);
    return edge;
  };

  GraphModel.prototype.numNodes = function() {
    var d, total, _i, _len, _ref;
    total = 0;
    _ref = this.domains;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      d = _ref[_i];
      total += d.nodes.length;
    }
    return total;
  };

  GraphModel.prototype.getAttr = function(name) {
    return this._attributes[name];
  };

  return GraphModel;

})(EventDispatcher);

Strategy = (function() {

  function Strategy() {}

  Strategy.prototype.getName = function() {
    return '<Abstract strategy>';
  };

  Strategy.prototype.activate = function(viewer) {
    this.viewer = viewer;
  };

  Strategy.prototype.deactivate = function() {};

  Strategy.prototype.setScene = function(scene) {
    this.scene = scene;
  };

  Strategy.prototype.getForm = function() {
    return $('<div/>').addClass('strategy-config').append($('<p class="muted">No settings for this strategy</p>'));
  };

  return Strategy;

})();

SingleStrategy = (function(_super) {

  __extends(SingleStrategy, _super);

  function SingleStrategy(layoutFactories) {
    this.layoutFactories = layoutFactories;
    this._layoutChangedCb = __bind(this._layoutChangedCb, this);

    this._layoutDoneCb = __bind(this._layoutDoneCb, this);

    this._layoutPausedCb = __bind(this._layoutPausedCb, this);

    this._layoutStartedCb = __bind(this._layoutStartedCb, this);

    this.config = new LayoutConfigurator(this.layoutFactories);
    this.config.callbacks.layoutChanged.add(this._layoutChangedCb);
  }

  SingleStrategy.prototype.getName = function() {
    return 'Single graph';
  };

  SingleStrategy.prototype.getForm = function() {
    var dropdown, menu,
      _this = this;
    this.runButton = $('<button/>').addClass('btn btn-primary').text('Run').one('click', function() {
      return _this.renderer.run();
    });
    menu = $('<ul/>').addClass('dropdown-menu');
    menu.append($('<li/>').append($('<a href="#"/>').text('Restart all').click(function() {
      _this.renderer.stop();
      return _this.renderer.run();
    })));
    dropdown = $('<div/>').addClass('btn-group').append(this.runButton).append($('<button class="btn btn-primary dropdown-toggle" data-toggle="dropdown"><span class="caret"></span></button>')).append(menu);
    this.mainStatus = $('<div/>').addClass('status').append($.spinner(20, 'small')).append($('<div/>'));
    return $('<div/>').addClass('strategy-config').append(this.config.getForm()).append($('<div/>').addClass('form-actions').append(this.mainStatus).append(dropdown));
  };

  SingleStrategy.prototype._layoutStartedCb = function() {
    var _this = this;
    this.mainStatus.addClass('running').find('div').text('Running...');
    return this.runButton.text('Pause').off('click').one('click', function() {
      return _this.renderer.pause();
    });
  };

  SingleStrategy.prototype._layoutPausedCb = function() {
    var _this = this;
    this.mainStatus.removeClass('running').find('div').text('Paused');
    return this.runButton.text('Resume').off('click').one('click', function() {
      return _this.renderer.run();
    });
  };

  SingleStrategy.prototype._layoutDoneCb = function() {
    var _this = this;
    if (this._switchingLayout) {
      this.mainStatus.removeClass('running').find('div').text('');
      this._switchingLayout = false;
    } else {
      this.mainStatus.removeClass('running').find('div').text('Done.');
    }
    return this.runButton.text('Run').off('click').one('click', function() {
      return _this.renderer.run();
    });
  };

  SingleStrategy.prototype._layoutChangedCb = function(factory) {
    if (this.renderer) {
      this._switchingLayout = true;
      if (!this.renderer.layout || !this.renderer.isRunning()) {
        this._layoutDoneCb();
      }
      this.renderer.setLayout(this._getLayout());
      this.renderer.draw(this.viewer.getCleanScene(), this.viewer.camera);
    }
  };

  SingleStrategy.prototype._getLayout = function() {
    var layout;
    layout = this.config.getLayout();
    layout.callbacks.started.add(this._layoutStartedCb);
    layout.callbacks.resumed.add(this._layoutStartedCb);
    layout.callbacks.paused.add(this._layoutPausedCb);
    layout.callbacks.done.add(this._layoutDoneCb);
    return layout;
  };

  SingleStrategy.prototype.activate = function(viewer) {
    this.viewer = viewer;
    if (!this.renderer) {
      this.renderer = new GraphRenderer(this.viewer.model, this.viewer);
      this._layoutChangedCb();
    } else {
      this.renderer.draw(this.viewer.getCleanScene(), this.viewer.camera);
    }
    this.renderer.step();
    return this.renderer;
  };

  SingleStrategy.prototype.deactivate = function() {
    if (this.renderer) {
      return this.renderer.pause();
    }
  };

  return SingleStrategy;

})(Strategy);

ClusteredStrategy = (function(_super) {

  __extends(ClusteredStrategy, _super);

  function ClusteredStrategy() {
    return ClusteredStrategy.__super__.constructor.apply(this, arguments);
  }

  ClusteredStrategy.prototype.getName = function() {
    return 'Clustered';
  };

  ClusteredStrategy.prototype.activate = function(viewer) {
    this.viewer = viewer;
    if (!this.renderer) {
      this.renderer = new ClusteredGraphRenderer(this.viewer.model, this.viewer);
      this._layoutChangedCb();
    } else {
      this.renderer.draw(this.viewer.getCleanScene(), this.viewer.camera);
    }
    this.renderer.step();
    return this.renderer;
  };

  return ClusteredStrategy;

})(SingleStrategy);

DomainStrategy = (function(_super) {

  __extends(DomainStrategy, _super);

  function DomainStrategy(domainLayoutFactories, globalLayoutFactories) {
    this.domainLayoutFactories = domainLayoutFactories;
    this.globalLayoutFactories = globalLayoutFactories;
    this._domainLayoutChangedCb = __bind(this._domainLayoutChangedCb, this);

    this._globalLayoutChangedCb = __bind(this._globalLayoutChangedCb, this);

    this._layoutDoneCb = __bind(this._layoutDoneCb, this);

    this._layoutPausedCb = __bind(this._layoutPausedCb, this);

    this._layoutStartedCb = __bind(this._layoutStartedCb, this);

    this.setupDomain = __bind(this.setupDomain, this);

    this.globalLayoutConfig = new LayoutConfigurator(this.globalLayoutFactories);
    this.globalLayoutConfig.callbacks.layoutChanged.add(this._globalLayoutChangedCb);
  }

  DomainStrategy.prototype.getName = function() {
    return 'Multi-level (per domain)';
  };

  DomainStrategy.prototype.getForm = function() {
    var config, dropdown, menu,
      _this = this;
    this.runButton = $('<button/>').addClass('btn btn-primary').text('Run').one('click', function() {
      return _this.renderer.run();
    });
    menu = $('<ul/>').addClass('dropdown-menu');
    menu.append($('<li/>').append($('<a href="#"/>').text('Restart all').click(function() {
      _this.renderer.stop();
      return _this.renderer.run();
    })));
    dropdown = $('<div/>').addClass('btn-group').append(this.runButton).append($('<button class="btn btn-primary dropdown-toggle" data-toggle="dropdown"><span class="caret"></span></button>')).append(menu);
    this.mainStatus = $('<div/>').addClass('status').append($.spinner(20, 'small')).append($('<div/>'));
    config = this.globalLayoutConfig.getForm();
    $('.algorithm-select label', config).text('Outer algorithm');
    return $('<div/>').addClass('strategy-config').append(config).append($('<p/>').addClass('muted').text('Domain-specific layout algorithms can be configured in the domain settings.')).append($('<div/>').addClass('form-actions').append(this.mainStatus).append(dropdown));
  };

  DomainStrategy.prototype.setupDomain = function(domainModel, i) {
    var actions, config, domain, el,
      _this = this;
    el = $(".sidebar .domains li:nth-child(" + (i + 1) + ")", this.viewer.container);
    config = new LayoutConfigurator(this.domainLayoutFactories);
    actions = $('<div/>').addClass('actions').append($('<a href="#"/>').append($('<i class="icon-pause"/>')).append($('<i class="icon-play"/>')).one('click', function(e) {
      e.preventDefault();
      return _this.renderer.runPartition(i);
    })).append($.spinner(20, 'mini'));
    domain = {
      id: i,
      element: el,
      config: config,
      actions: actions,
      form: config.getForm()
    };
    config.callbacks.layoutChanged.add(function(factory) {
      return _this._domainLayoutChangedCb(factory, domain);
    });
    return domain;
  };

  DomainStrategy.prototype._getGlobalLayout = function() {
    var layout;
    layout = this.globalLayoutConfig.getLayout();
    layout.callbacks.started.add(this._layoutStartedCb);
    layout.callbacks.resumed.add(this._layoutStartedCb);
    layout.callbacks.paused.add(this._layoutPausedCb);
    layout.callbacks.done.add(this._layoutDoneCb);
    return layout;
  };

  DomainStrategy.prototype._getDomainLayout = function(domain) {
    var layout,
      _this = this;
    layout = domain.config.getLayout();
    layout.callbacks.started.add(function() {
      return _this._layoutStartedCb(domain);
    });
    layout.callbacks.resumed.add(function() {
      return _this._layoutStartedCb(domain);
    });
    layout.callbacks.paused.add(function() {
      return _this._layoutPausedCb(domain);
    });
    layout.callbacks.done.add(function() {
      return _this._layoutDoneCb(domain);
    });
    return layout;
  };

  DomainStrategy.prototype._layoutStartedCb = function(domain) {
    var _this = this;
    if (domain) {
      domain.element.addClass('running').removeClass('paused');
      domain.actions.find('a').off('click').one('click', function(e) {
        e.preventDefault();
        return _this.renderer.pausePartition(domain.id);
      });
    }
    if (this.renderer.someLayoutsRunning()) {
      this.mainStatus.addClass('running').find('div').text('Running...');
      return this.runButton.text('Pause').off('click').one('click', function() {
        return _this.renderer.pause();
      });
    }
  };

  DomainStrategy.prototype._layoutPausedCb = function(domain) {
    var _this = this;
    if (domain) {
      domain.element.addClass('paused').removeClass('running');
      domain.actions.find('a').off('click').one('click', function(e) {
        e.preventDefault();
        return _this.renderer.runPartition(domain.id);
      });
    }
    if (!this.renderer.someLayoutsRunning()) {
      if (this.renderer.someLayoutsPaused()) {
        this.mainStatus.removeClass('running').find('div').text('Paused');
        return this.runButton.text('Resume').off('click').one('click', function() {
          return _this.renderer.resume();
        });
      } else {
        this.mainStatus.removeClass('running').find('div').text('Done');
        return this.runButton.text('Resume').off('click').one('click', function() {
          return _this.renderer.run();
        });
      }
    }
  };

  DomainStrategy.prototype._layoutDoneCb = function(domain) {
    var _this = this;
    if (domain) {
      domain.element.removeClass('paused').removeClass('running');
      domain.actions.find('a').off('click').one('click', function(e) {
        e.preventDefault();
        return _this.renderer.runPartition(domain.id);
      });
    }
    if (!this.renderer.someLayoutsRunning()) {
      if (!this.renderer.someLayoutsPaused()) {
        this.mainStatus.removeClass('running').find('div').text('Done.');
        return this.runButton.text('Run').off('click').one('click', function() {
          return _this.renderer.run();
        });
      } else {
        this.mainStatus.removeClass('running').find('div').text('Paused.');
        return this.runButton.text('Resume').off('click').one('click', function() {
          return _this.renderer.resume();
        });
      }
    }
  };

  DomainStrategy.prototype._globalLayoutChangedCb = function(factory) {
    var running;
    if (this.renderer) {
      running = this.renderer.globalLayout && this.renderer.globalLayout.isRunning();
      this.renderer.setGlobalLayout(this._getGlobalLayout());
      this.renderer.draw(this.viewer.getCleanScene(), this.viewer.camera);
      if (running) {
        this.renderer.runGlobal();
      }
    }
  };

  DomainStrategy.prototype._domainLayoutChangedCb = function(factory, domain) {
    var layout, running,
      _this = this;
    if (this.renderer) {
      this.renderer.stopPartition(domain.id);
      layout = this._getDomainLayout(domain);
      running = this.renderer.allLayoutsRunning();
      this.renderer.setPartitionLayout(domain.id, layout);
      if (running) {
        later(10, function() {
          return _this.renderer.runPartition(domain.id);
        });
      }
    }
  };

  DomainStrategy.prototype.activate = function(viewer) {
    var _this = this;
    this.viewer = viewer;
    if (!this.renderer) {
      this.renderer = new PartitionedGraphRenderer(this.viewer.model, this.viewer);
      this.renderer.setGlobalLayout(this._getGlobalLayout());
      this.domains = [];
      this.viewer.model.domains.iter(function(domainModel, i) {
        var domain;
        domain = _this.setupDomain(domainModel, i);
        _this.renderer.setPartitionLayout(i, _this._getDomainLayout(domain));
        return _this.domains.push(domain);
      });
      this.renderer.draw(this.viewer.getCleanScene(), this.viewer.camera);
    } else {
      this.renderer.draw(this.viewer.getCleanScene(), this.viewer.camera);
    }
    this.domains.iter(function(domain, i) {
      var settings, tab;
      domain.element.find('a.settings').before(domain.actions);
      settings = domain.element.find('.pop-out');
      tab = makeSettingsTab(settings, "layout-settings-" + i, 'Layout');
      tab.append(domain.form);
      return settings.tabs('refresh');
    });
    this.renderer.step();
    return this.renderer;
  };

  DomainStrategy.prototype.deactivate = function() {
    var _this = this;
    this.renderer.stop();
    return this.domains.iter(function(domain, i) {
      domain.actions.detach();
      domain.form.detach();
      return removeSettingsTab(domain.element.find('.pop-out'), "layout-settings-" + i);
    });
  };

  return DomainStrategy;

})(Strategy);

ExtrudedStrategy = (function(_super) {

  __extends(ExtrudedStrategy, _super);

  function ExtrudedStrategy(domainsLayoutFactories, nodesLayoutFactories) {
    this.domainsLayoutFactories = domainsLayoutFactories;
    this.nodesLayoutFactories = nodesLayoutFactories;
    this._layoutDoneCb = __bind(this._layoutDoneCb, this);

    this._layoutPausedCb = __bind(this._layoutPausedCb, this);

    this._layoutStartedCb = __bind(this._layoutStartedCb, this);

    this._nodesLayoutChangedCb = __bind(this._nodesLayoutChangedCb, this);

    this._domainsLayoutChangedCb = __bind(this._domainsLayoutChangedCb, this);

    this.domainsLayoutConfig = new LayoutConfigurator(this.domainsLayoutFactories);
    this.nodesLayoutConfig = new LayoutConfigurator(this.nodesLayoutFactories);
    this.domainsLayoutConfig.callbacks.layoutChanged.add(this._domainsLayoutChangedCb);
    this.nodesLayoutConfig.callbacks.layoutChanged.add(this._nodesLayoutChangedCb);
  }

  ExtrudedStrategy.prototype._domainsLayoutChangedCb = function(factory) {
    if (this.renderer) {
      this.renderer.domainsLayout.stop();
      this._layoutDoneCb();
      this.renderer.setDomainsLayout(this._getLayout(this.domainsLayoutConfig));
      return this.renderer.draw(this.viewer.getCleanScene(), this.viewer.camera);
    }
  };

  ExtrudedStrategy.prototype._nodesLayoutChangedCb = function(factory) {
    if (this.renderer) {
      this.renderer.nodesLayout.stop();
      this._layoutDoneCb();
      this.renderer.setNodesLayout(this._getLayout(this.nodesLayoutConfig));
      return this.renderer.draw(this.viewer.getCleanScene(), this.viewer.camera);
    }
  };

  ExtrudedStrategy.prototype._layoutStartedCb = function() {
    var _this = this;
    this.mainStatus.addClass('running').find('div').text('Running...');
    return this.runButton.text('Pause').off('click').one('click', function() {
      return _this.renderer.pause();
    });
  };

  ExtrudedStrategy.prototype._layoutPausedCb = function() {
    var _this = this;
    if (!this.renderer.someLayoutsRunning()) {
      this.mainStatus.removeClass('running').find('div').text('Paused');
      return this.runButton.text('Resume').off('click').one('click', function() {
        return _this.renderer.resume();
      });
    }
  };

  ExtrudedStrategy.prototype._layoutDoneCb = function() {
    var _this = this;
    if (this.renderer.someLayoutsPaused()) {
      this.mainStatus.removeClass('running').find('div').text('Paused.');
      return this.runButton.text('Resume').off('click').one('click', function() {
        return _this.renderer.resume();
      });
    } else if (this.renderer.someLayoutsRunning()) {
      return this.runButton.text('Pause').off('click').one('click', function() {
        return _this.renderer.pause();
      });
    } else {
      this.mainStatus.removeClass('running').find('div').text('Done.');
      return this.runButton.text('Run').off('click').one('click', function() {
        return _this.renderer.run();
      });
    }
  };

  ExtrudedStrategy.prototype._getLayout = function(config) {
    var layout;
    layout = config.getLayout();
    layout.callbacks.started.add(this._layoutStartedCb);
    layout.callbacks.resumed.add(this._layoutStartedCb);
    layout.callbacks.paused.add(this._layoutPausedCb);
    layout.callbacks.done.add(this._layoutDoneCb);
    return layout;
  };

  ExtrudedStrategy.prototype.activate = function(viewer) {
    this.viewer = viewer;
    if (!this.renderer) {
      this.renderer = new ExtrudedGraphRenderer(this.viewer.model, this.viewer);
      this.renderer.setDomainsLayout(this._getLayout(this.domainsLayoutConfig));
      this.renderer.setNodesLayout(this._getLayout(this.nodesLayoutConfig));
      this.renderer.draw(this.viewer.getCleanScene(), this.viewer.camera);
    } else {
      this.renderer.draw(this.viewer.getCleanScene(), this.viewer.camera);
    }
    this.renderer.step();
    return this.renderer;
  };

  ExtrudedStrategy.prototype.deactivate = function() {
    if (this.renderer) {
      return this.renderer.pause();
    }
  };

  ExtrudedStrategy.prototype.getName = function() {
    return 'Extruded';
  };

  ExtrudedStrategy.prototype.getForm = function() {
    var domainsConfig, dropdown, menu, nodesConfig,
      _this = this;
    this.runButton = $('<button/>').addClass('btn btn-primary').text('Run').one('click', function() {
      return _this.renderer.run();
    });
    menu = $('<ul/>').addClass('dropdown-menu');
    menu.append($('<li/>').append($('<a href="#"/>').text('Restart all').click(function() {
      _this.renderer.stop();
      return _this.renderer.run();
    })));
    dropdown = $('<div/>').addClass('btn-group').append(this.runButton).append($('<button class="btn btn-primary dropdown-toggle" data-toggle="dropdown"><span class="caret"></span></button>')).append(menu);
    this.mainStatus = $('<div/>').addClass('status').append($.spinner(20, 'small')).append($('<div/>'));
    domainsConfig = this.domainsLayoutConfig.getForm();
    $('.algorithm-select label', domainsConfig).text('Domains algorithm');
    nodesConfig = this.nodesLayoutConfig.getForm();
    $('.algorithm-select label', nodesConfig).text('Nodes algorithm');
    return $('<div/>').addClass('strategy-config extruded').append(domainsConfig).append(nodesConfig).append($('<div/>').addClass('form-actions').append(this.mainStatus).append(dropdown));
  };

  return ExtrudedStrategy;

})(Strategy);

Object.defineProperty(Array.prototype, 'last', {
  value: function() {
    return this[this.length - 1];
  },
  enumerable: false
});

Panel = (function() {

  function Panel() {
    this.expand = __bind(this.expand, this);

    this.collapse = __bind(this.collapse, this);
    this.container = $('<div/>').addClass('panel');
  }

  Panel.prototype.getTitle = function() {
    return '<Title>';
  };

  Panel.prototype.getClass = function() {};

  Panel.prototype.getContent = function() {};

  Panel.prototype.collapse = function() {
    this.container.addClass('closed');
    return this;
  };

  Panel.prototype.expand = function() {
    this.container.removeClass('closed');
    return this;
  };

  Panel.prototype.getElement = function(name) {
    var title;
    this.name = name;
    title = $('<h2/>').text(this.getTitle()).click(function() {
      return $(this).closest('.panel').toggleClass('closed');
    });
    this.contentPanel = $('<div/>').addClass('panel-content').append(this.getContent());
    this.container.addClass(this.getClass()).attr('id', "panel-" + this.name).append(title).append($('<div/>').addClass('panel-content-wrapper').append(this.contentPanel));
    return this.container;
  };

  return Panel;

})();

BasicInfoPanel = (function(_super) {

  __extends(BasicInfoPanel, _super);

  function BasicInfoPanel(viewer) {
    this.viewer = viewer;
    this._graphLoadedCb = __bind(this._graphLoadedCb, this);

    this.viewer.callbacks.graphLoaded.add(this._graphLoadedCb);
    BasicInfoPanel.__super__.constructor.apply(this, arguments);
  }

  BasicInfoPanel.prototype.getTitle = function() {
    return 'Basic information';
  };

  BasicInfoPanel.prototype.getContent = function() {
    return $('<dl/>').addClass('dl-horizontal');
  };

  BasicInfoPanel.prototype.getClass = function() {
    return 'basic';
  };

  BasicInfoPanel.prototype._graphLoadedCb = function(url, model) {
    var d, edges, nodes;
    edges = ((function() {
      var _i, _len, _ref, _results;
      _ref = model.domains;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        d = _ref[_i];
        _results.push(d.edges.length);
      }
      return _results;
    })()).reduce((function(t, s) {
      return t + s;
    }), 0);
    nodes = ((function() {
      var _i, _len, _ref, _results;
      _ref = model.domains;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        d = _ref[_i];
        _results.push(d.nodes.length);
      }
      return _results;
    })()).reduce((function(t, s) {
      return t + s;
    }), 0);
    return $('dl', this.container).empty().append($('<dt/>').text('Data source')).append($('<dd/>').html($('<code/>').text(url))).append($('<dt/>').text('Domains')).append($('<dd/>').text(model.domains.length)).append($('<dt/>').text('Nodes')).append($('<dd/>').text(nodes)).append($('<dt/>').text('Edges')).append($('<dd/>').text(model.superedges.length + edges));
  };

  return BasicInfoPanel;

})(Panel);

makeSettingsTab = function(container, id, title) {
  var num, panel, tabs, wrapper;
  tabs = $('> ul', container);
  num = tabs.find('> li').size();
  $('<li/>').append($('<a/>').text(title).attr('href', "#" + id)).appendTo(tabs);
  panel = $('<div/>').attr('id', id).appendTo(container).addClass('settings-wrapper');
  wrapper = $('<div/>').addClass('domain-settings').appendTo(panel);
  if (num === 0) {
    container.tabs({
      active: 0
    });
  } else {
    container.tabs('refresh');
  }
  return wrapper;
};

removeSettingsTab = function(container, id) {
  var tab;
  $("a[href=#" + id + "]", container).remove();
  tab = $("#" + id, container);
  tab.remove();
  if (tab.attr('aria-hidden') === 'false') {
    return container.tabs('option', 'active', 0);
  }
};

DomainsPanel = (function(_super) {

  __extends(DomainsPanel, _super);

  function DomainsPanel(viewer) {
    this.viewer = viewer;
    this._graphLoadedCb = __bind(this._graphLoadedCb, this);

    this.viewer.callbacks.graphLoaded.add(this._graphLoadedCb);
    DomainsPanel.__super__.constructor.apply(this, arguments);
  }

  DomainsPanel.prototype.getTitle = function() {
    return 'Domains';
  };

  DomainsPanel.prototype.getClass = function() {
    return 'domains';
  };

  DomainsPanel.prototype.getContent = function() {
    $('.sidebar', this.viewer.container).scroll(function() {
      var top;
      top = $(this).scrollTop();
      return $('.domains .pop-out', this).css('margin-top', -top - 62 + 'px');
    });
    return $('<ul/>');
  };

  DomainsPanel.prototype._graphLoadedCb = function(url, model) {
    var ul;
    ul = $('ul', this.container).empty();
    return model.domains.iter(function(domain, i) {
      var close, info, open, settings;
      open = function(panel) {
        panel.addClass('open');
        return $('body').one('keyup.domainconfig', function(e) {
          switch (e.keyCode) {
            case 27:
              return close(panel);
            case 37:
            case 38:
              close(panel);
              panel = panel.closest('li').prev('li').find('.pop-out');
              if (panel.size()) {
                return open(panel);
              }
              break;
            case 39:
            case 40:
              close(panel);
              panel = panel.closest('li').next('li').find('.pop-out');
              if (panel.size()) {
                return open(panel);
              }
          }
        }).on('click.domainconfig', function(e) {
          var item, t;
          t = $(e.target);
          if (t.closest('.pop-out').size()) {
            return;
          }
          close(panel);
          if (t.closest('.domains').size()) {
            item = t.closest('li');
            if (item.not(panel.closest('li')).size()) {
              return open(item.find('.pop-out'));
            }
          }
        });
      };
      close = function(panel) {
        panel.removeClass('open');
        return $('body').off('keyup.domainconfig', 'click.domainconfig');
      };
      info = $('<div/>').text(domain.attributes.domain).append($('<span/>').addClass('muted').text(" — " + domain.nodes.length + " nodes")).append($('<a class="settings" href="#"><i class="icon-wrench"/></a>').click(function(e) {
        var allPanels, panel;
        e.stopPropagation();
        e.preventDefault();
        panel = $(this).closest('li').find('.pop-out');
        allPanels = $(this).closest('ul').find('.pop-out').not(panel);
        allPanels.removeClass('open');
        if (panel.hasClass('open')) {
          return close(panel);
        } else {
          return open(panel);
        }
      }));
      settings = $('<div/>').addClass('pop-out').append($('<span/>').addClass('pointer')).append($('<ul/>'));
      return $("<li/>").append(info).append(settings).appendTo(ul);
    });
  };

  return DomainsPanel;

})(Panel);

LayoutConfigPanel = (function(_super) {

  __extends(LayoutConfigPanel, _super);

  function LayoutConfigPanel(strategyConfig) {
    this.strategyConfig = strategyConfig;
    LayoutConfigPanel.__super__.constructor.apply(this, arguments);
  }

  LayoutConfigPanel.prototype.getTitle = function() {
    return 'Layout engine';
  };

  LayoutConfigPanel.prototype.getClass = function() {
    return 'layout';
  };

  LayoutConfigPanel.prototype.getContent = function() {
    return this.strategyConfig.getForm();
  };

  return LayoutConfigPanel;

})(Panel);

GenericOptionsPanel = (function(_super) {

  __extends(GenericOptionsPanel, _super);

  function GenericOptionsPanel(viewer) {
    this.viewer = viewer;
    this._graphLoadedCb = __bind(this._graphLoadedCb, this);

    this._rendererChangedCb = __bind(this._rendererChangedCb, this);

    this.viewer.callbacks.graphRendererChanged.add(this._rendererChangedCb);
    this.viewer.callbacks.graphLoaded.add(this._graphLoadedCb);
    GenericOptionsPanel.__super__.constructor.apply(this, arguments);
  }

  GenericOptionsPanel.prototype._rendererChangedCb = function(renderer) {
    this.renderer = renderer;
    return this.viewer.getPanel('generic').element.find('input').trigger('change');
  };

  GenericOptionsPanel.prototype._graphLoadedCb = function(url, model) {
    this.model = model;
  };

  GenericOptionsPanel.prototype.getTitle = function() {
    return 'Generic options';
  };

  GenericOptionsPanel.prototype.getClass = function() {
    return 'generic';
  };

  GenericOptionsPanel.prototype.getContent = function() {
    var _this = this;
    return Form.makeForm('generic-options', {
      background: {
        label: 'Background color',
        type: 'color',
        initial: '#ffffff',
        setter: 'setBackground'
      },
      labelcolor: {
        label: 'Labels color',
        type: 'color',
        initial: '#000000',
        setter: 'setLabelColor'
      },
      edgecolor: {
        label: 'Edge color',
        type: 'color',
        initial: '#888888',
        setter: 'setEdgeColor'
      },
      direction: {
        label: 'Edge directions',
        type: 'boolean',
        initial: true,
        setter: 'setEdgeDirectionVisibility'
      },
      transparency: {
        label: 'Edge transparency',
        type: 'boolean',
        initial: true,
        setter: 'setEdgeTransparency'
      },
      thickness: {
        label: 'Edge weight',
        type: 'float',
        initial: 1.0,
        min: 1.0,
        max: 10.0,
        step: 0.1,
        setter: 'setEdgeWeight'
      },
      position: {
        label: 'Axis indicator',
        type: 'boolean',
        initial: true,
        setter: 'setAxisVisibility'
      }
    }, function(key, val, field) {
      return _this[field.setter](val);
    });
  };

  GenericOptionsPanel.prototype.setEdgeWeight = function(val) {
    this.renderer.domainObjects.iter(function(d) {
      d.edges.material.linewidth = val;
      return d.edgesDirection.material.linewidth = val * 1.5 + 1;
    });
    this.renderer.interEdges.material.linewidth = val;
    return this.renderer.interEdgesDirection.material.linewidth = val * 1.5 + 1;
  };

  GenericOptionsPanel.prototype.setLabelColor = function(val) {
    return this.renderer.domainObjects.iter(function(d) {
      return d.labels.updateColor(val);
    });
  };

  GenericOptionsPanel.prototype.setEdgeColor = function(val) {
    this.model.edges.iter(function(e) {
      return e.setColor(val);
    });
    this.renderer.domainObjects.iter(function(d) {
      d.edges.update();
      return d.edgesDirection.update();
    });
    this.renderer.interEdges.update();
    return this.renderer.interEdgesDirection.update();
  };

  GenericOptionsPanel.prototype.setAxisVisibility = function(val) {
    if (val) {
      return this.viewer.scene.add(this.viewer.positionIndicator);
    } else {
      return this.viewer.scene.remove(this.viewer.positionIndicator);
    }
  };

  GenericOptionsPanel.prototype.setBackground = function(val) {
    return this.viewer.viewportRenderer.renderer.setClearColor(val, 1);
  };

  GenericOptionsPanel.prototype.setEdgeDirectionVisibility = function(val) {
    return this.renderer.setEdgeDirectionVisibility(val);
  };

  GenericOptionsPanel.prototype.setEdgeTransparency = function(val) {
    return this.renderer.setEdgeTransparency(val);
  };

  return GenericOptionsPanel;

})(Panel);

ExportPanel = (function(_super) {

  __extends(ExportPanel, _super);

  function ExportPanel(viewer) {
    this.viewer = viewer;
    this._graphLoadedCb = __bind(this._graphLoadedCb, this);

    this.viewer.callbacks.graphLoaded.add(this._graphLoadedCb);
    ExportPanel.__super__.constructor.apply(this, arguments);
  }

  ExportPanel.prototype.getTitle = function() {
    return 'Export';
  };

  ExportPanel.prototype.getClass = function() {
    return 'export';
  };

  ExportPanel.prototype.getContent = function() {
    return [$('<a/>').attr('download', 'graph.png').addClass('btn disabled').attr('href', '#').text('Download image'), $('<a/>').attr('download', 'graph.gexf').addClass('btn disabled').attr('href', '#').text('Download GEXF')];
  };

  ExportPanel.prototype._graphLoadedCb = function(url, model) {
    var viewer;
    viewer = this.viewer;
    $('a:first-child', this.container).removeClass('disabled').click(function() {
      var canvas, data;
      canvas = $('canvas', viewer.container).get(0);
      data = canvas.toDataURL("image/png");
      return $(this).attr('href', data);
    });
    return $('a:last-child', this.container).removeClass('disabled').click(function(e) {
      var data, exporter;
      exporter = new GEXFExporter(model);
      data = exporter.toDataURL();
      return $(this).attr('href', data);
    });
  };

  return ExportPanel;

})(Panel);

StatsPanel = (function(_super) {

  __extends(StatsPanel, _super);

  function StatsPanel(viewer) {
    this.viewer = viewer;
    StatsPanel.__super__.constructor.apply(this, arguments);
  }

  StatsPanel.prototype.getTitle = function() {
    return 'Visualization statistics';
  };

  StatsPanel.prototype.getClass = function() {
    return 'stats';
  };

  StatsPanel.prototype.getContent = function() {
    var el;
    el = $(this.viewer.stats.domElement);
    $('<div/>').append(el);
    return el.attr('style', '').find('> div');
  };

  return StatsPanel;

})(Panel);

ThumbnailPanel = (function(_super) {

  __extends(ThumbnailPanel, _super);

  ThumbnailPanel.width = ThumbnailPanel.height = 200;

  ThumbnailPanel.overscale = 2;

  function ThumbnailPanel(viewer) {
    this.viewer = viewer;
    this.redraw = __bind(this.redraw, this);

    this._graphLoadedCb = __bind(this._graphLoadedCb, this);

    this._rendererChangedCb = __bind(this._rendererChangedCb, this);

    this.viewer.callbacks.graphRendererChanged.add(this._rendererChangedCb);
    this.viewer.callbacks.graphLoaded.add(this._graphLoadedCb);
    ThumbnailPanel.__super__.constructor.apply(this, arguments);
  }

  ThumbnailPanel.prototype._rendererChangedCb = function(renderer) {
    this.renderer = renderer;
  };

  ThumbnailPanel.prototype._graphLoadedCb = function(url, model) {
    var img, thumb,
      _this = this;
    this.model = model;
    thumb = this.model.getAttr('thumbnail');
    if (thumb) {
      img = new Image();
      img.src = thumb;
      return img.onload = function() {
        var context;
        context = _this.canvas.getContext('2d');
        return context.drawImage(img, 0, 0);
      };
    }
  };

  ThumbnailPanel.prototype.redraw = function() {
    var blob, context, data, formData, graphImage, h, hex, r, sh, sw, sx, sy, th, tw, url, w;
    if (!(this.canvas && this.renderer && this.model)) {
      return;
    }
    graphImage = $('canvas', this.viewer.getViewport()).get(0);
    w = graphImage.width;
    h = graphImage.height;
    r = window.devicePixelRatio;
    tw = ThumbnailPanel.width * r * ThumbnailPanel.overscale;
    th = ThumbnailPanel.height * r * ThumbnailPanel.overscale;
    this.canvas.width = this.canvas.width;
    context = this.canvas.getContext('2d');
    sx = this.selector.offset().left * r;
    sy = this.selector.offset().top * r;
    sw = this.selector.width() * r;
    sh = this.selector.height() * r;
    context.webkitImageSmoothingEnabled = true;
    context.drawImage(graphImage, sx, sy, sw, sh, 0, 0, tw, th);
    url = this.canvas.toDataURL();
    hex = url.split(',')[1];
    data = Base64Binary.decode(hex);
    blob = new Blob([data], {
      type: 'image/png'
    });
    formData = new FormData();
    formData.append('thumbnail', blob);
    return $.ajax({
      url: this.model.getAttr('thumbnail'),
      type: 'POST',
      data: formData,
      processData: false,
      contentType: false
    });
  };

  ThumbnailPanel.prototype.getTitle = function() {
    return 'Thumbnail';
  };

  ThumbnailPanel.prototype.getClass = function() {
    return 'graph-thumbnail';
  };

  ThumbnailPanel.prototype.getContent = function() {
    var canvas, h, r, w,
      _this = this;
    w = ThumbnailPanel.width;
    h = ThumbnailPanel.height;
    r = window.devicePixelRatio;
    canvas = $('<canvas/>');
    this.canvas = canvas.get(0);
    this.canvas.width = w * r * ThumbnailPanel.overscale;
    this.canvas.height = h * r * ThumbnailPanel.overscale;
    canvas.width(w).height(h);
    this.selector = $('<div/>').addClass('cropper').appendTo(this.viewer.getViewport()).draggable({
      containment: 'parent'
    }).resizable({
      containment: 'parent',
      aspectRatio: true,
      handles: 'sw, se, ne, nw'
    }).append($('<button/>').text('Set').click(function() {
      _this.viewer.controls.disabled = false;
      _this.redraw();
      return _this.selector.removeClass('active');
    })).width(w).height(h).css({
      top: (this.viewer.getViewport().height() + h) / 2 + 'px',
      left: (this.viewer.getViewport().width() + w) / 2 + 'px'
    });
    return $('<div/>').append(canvas).append($('<button/>').text('Select')).click(function() {
      _this.viewer.controls.disabled = true;
      return _this.selector.addClass('active');
    }).width(w).height(h);
  };

  return ThumbnailPanel;

})(Panel);

NodeInfoPanel = (function(_super) {

  __extends(NodeInfoPanel, _super);

  function NodeInfoPanel(viewer) {
    this.viewer = viewer;
    this.showInfo = __bind(this.showInfo, this);

    this.filterByNode = __bind(this.filterByNode, this);

    this._updateNode = __bind(this._updateNode, this);

    this._graphLoadedCb = __bind(this._graphLoadedCb, this);

    this._rendererChangedCb = __bind(this._rendererChangedCb, this);

    this.viewer.callbacks.graphRendererChanged.add(this._rendererChangedCb);
    this.viewer.callbacks.graphLoaded.add(this._graphLoadedCb);
    this.depth = 0;
    NodeInfoPanel.__super__.constructor.apply(this, arguments);
  }

  NodeInfoPanel.prototype._rendererChangedCb = function(renderer) {
    this.renderer = renderer;
  };

  NodeInfoPanel.prototype._graphLoadedCb = function(url, model) {
    var _this = this;
    this.model = model;
    return this.model.on('nodehover', function(node) {
      if (!node._active) {
        node._inactiveColor = node.getColor();
      }
      node._hover = true;
      _this._updateNode(node);
      return _this.viewer.getViewport().css('cursor', 'pointer');
    }).on('nodeout', function(node) {
      node._hover = false;
      _this._updateNode(node);
      return _this.viewer.getViewport().css('cursor', 'default');
    }).on('nodeclick', function(node) {
      if (_this._oldNode) {
        if (_this._oldNode === node) {
          _this.model.fire('activenodechanged', node, void 0);
          return _this._oldNode = void 0;
        } else {
          _this.model.fire('activenodechanged', _this._oldNode, node);
          return _this._oldNode = node;
        }
      } else {
        _this.model.fire('activenodechanged', void 0, node);
        return _this._oldNode = node;
      }
    }).on('activenodechanged', function(oldNode, newNode) {
      if (oldNode != null) {
        oldNode._active = false;
        _this._updateNode(oldNode);
      }
      if (newNode != null) {
        newNode._active = true;
        _this._updateNode(newNode);
        return _this.showInfo(newNode);
      } else {
        _this.container.find('.neighbors-filter').remove();
        return _this.contentPanel.empty().append(_this.placeholder);
      }
    }).on('activenodechanged', function(oldNode, newNode) {
      _this.selectedNode = newNode;
      return _this.filterByNode();
    });
  };

  NodeInfoPanel.prototype._updateNode = function(node) {
    if (node._active) {
      return node.setColor(0xff0000);
    } else if (node._hover) {
      return node.setColor(0x990000);
    } else {
      return node.setColor(node._inactiveColor);
    }
  };

  NodeInfoPanel.prototype.filterByNode = function() {
    var showNeighbors;
    if ((this.selectedNode != null) && this.depth > 0) {
      this.model.nodes.iter(function(n) {
        n.hide().setOpacity(1.0);
        return n.__distance = Infinity;
      });
      this.model.edges.iter(function(e) {
        return e.hide().setOpacity(1.0);
      });
      showNeighbors = function(n, distance, maxdepth) {
        var opacity;
        if (n.__distance <= distance) {
          return;
        }
        n.__distance = distance;
        opacity = 0.7 / Math.pow(2, distance) + 0.3;
        n.show().setOpacity(opacity);
        if (distance < maxdepth) {
          return flatten(n._outEdges, n._edges).iter(function(e) {
            showNeighbors(e.other(n), distance + 1, maxdepth);
            return e.show().setOpacity(opacity);
          });
        } else {
          return flatten(n._outEdges, n._edges).iter(function(e) {
            if (e.other(n).isVisible()) {
              return e.show().setOpacity(opacity);
            }
          });
        }
      };
      showNeighbors(this.selectedNode, 0, this.depth);
    } else {
      this.model.nodes.iter(function(n) {
        return n.show().setOpacity(1.0);
      });
      this.model.edges.iter(function(e) {
        return e.show().setOpacity(1.0);
      });
    }
    this.renderer.domainObjects.iter(function(d) {
      d.edges.update();
      d.edgesDirection.update();
      return d.labels.updateFromNode();
    });
    this.renderer.interEdges.update();
    return this.renderer.interEdgesDirection.update();
  };

  NodeInfoPanel.prototype.showInfo = function(node) {
    var add, btn, buttonGroup, current, div, dropdown, f, info, key, modes, t, this_, urlPattern, val, _i, _len, _ref, _ref1;
    info = $('<table/>');
    urlPattern = /(http|ftp|https):\/\/[\w-]+(\.[\w-]+)+([\w.,@?^=%&amp;:\/~+#-]*[\w@?^=%&amp;\/~+#-])?/;
    add = function(label, val) {
      var el, row;
      label = label.replace('_', ' ');
      label = label.charAt(0).toUpperCase() + label.substr(1);
      row = $('<tr/>').appendTo(info);
      row.append($('<th/>').text(label));
      if (urlPattern.test(val)) {
        el = $('<a target="_blank"/>').attr('href', val).text(val);
        return row.append($('<td/>').append(el));
      } else {
        return row.append($('<td/>').text(val));
      }
    };
    add('FQID', node.fqid);
    add('Domain', node.domain.getAttr('domain'));
    add('Degree', node.getAttr('degree'));
    add('In-degree', node.getAttr('indegree'));
    add('Out-degree', node.getAttr('outdegree'));
    _ref = node.attributes;
    for (key in _ref) {
      val = _ref[key];
      add(key, val);
    }
    this.contentPanel.empty().append($('<div class="table-wrapper">').append(info));
    modes = [[0, 'Show whole graph'], [1, 'Show 1st order neighbors'], [2, 'Show 2nd order neighbors'], [3, 'Show 3rd order neighbors']];
    buttonGroup = $('<div/>').addClass('btn-group');
    current = $('<button/>').addClass('btn dropdown-toggle').append($('<span/>').text(modes[this.depth][1])).append($('<i/>').addClass('caret')).appendTo(buttonGroup);
    dropdown = $('<ul/>').addClass('dropdown-menu').appendTo(buttonGroup);
    this_ = this;
    for (_i = 0, _len = modes.length; _i < _len; _i++) {
      _ref1 = modes[_i], f = _ref1[0], t = _ref1[1];
      btn = $('<a/>').attr('href', '#').text(t).data('filter', f).click(function() {
        this_.setFilter(parseInt($(this).data('filter')));
        return current.find('span').text($(this).text());
      });
      $('<li/>').append(btn).appendTo(dropdown);
    }
    current.dropdown();
    div = $('<div/>').addClass('neighbors-filter').append(buttonGroup);
    return this.contentPanel.append(div);
  };

  NodeInfoPanel.prototype.setFilter = function(f) {
    this.depth = f;
    return this.filterByNode();
  };

  NodeInfoPanel.prototype.getTitle = function() {
    return 'Node information';
  };

  NodeInfoPanel.prototype.getClass = function() {
    return 'nodeinfo';
  };

  NodeInfoPanel.prototype.getContent = function() {
    return this.placeholder = $('<p/>').addClass('muted').text('Click on a node to visualize additional details here.');
  };

  return NodeInfoPanel;

})(Panel);

LabelsDisplaySettings = (function() {

  function LabelsDisplaySettings(viewer) {
    this.viewer = viewer;
    this.setVisibility = __bind(this.setVisibility, this);

    this.setNodeSizeFactor = __bind(this.setNodeSizeFactor, this);

    this.setSize = __bind(this.setSize, this);

    this._graphLoadedCb = __bind(this._graphLoadedCb, this);

    this._rendererChangedCb = __bind(this._rendererChangedCb, this);

    this.viewer.callbacks.graphRendererChanged.add(this._rendererChangedCb);
    this.viewer.callbacks.graphLoaded.add(this._graphLoadedCb);
  }

  LabelsDisplaySettings.prototype._rendererChangedCb = function(renderer) {
    var forms;
    this.renderer = renderer;
    forms = this.viewer.getPanel('domains').element.find('.panel-content > ul > li .pop-out form');
    return forms.find('input, select').each(function() {
      return $(this).trigger('change');
    });
  };

  LabelsDisplaySettings.prototype._graphLoadedCb = function(url, model) {
    var attributes, domains, key, name, val, _ref,
      _this = this;
    this.model = model;
    attributes = NodesDisplaySettings.genericNodeAttributes.slice(0);
    _ref = this.model.getNodeAttributes();
    for (key in _ref) {
      val = _ref[key];
      name = key.replace('_', ' ');
      name = name.charAt(0).toUpperCase() + name.substr(1);
      attributes.push([key, name]);
    }
    domains = this.viewer.getPanel('domains').element.find('.panel-content > ul > li');
    return this.model.domains.iter(function(domain, i) {
      var labelsForm, tab;
      labelsForm = Form.makeForm("labels-" + i, {
        content: {
          label: 'Content',
          type: 'list',
          valueType: 'string',
          values: attributes,
          setter: 'setContent'
        },
        visible: {
          label: 'Show labels',
          type: 'boolean',
          initial: true,
          setter: 'setVisibility'
        },
        size: {
          label: 'Font size',
          type: 'float',
          step: '0.5',
          min: 5.0,
          max: 20.0,
          initial: 10.0,
          setter: 'setSize'
        },
        nodeSizeFactor: {
          label: 'Node size factor',
          type: 'float',
          initial: 0.0,
          step: 0.1,
          setter: 'setNodeSizeFactor'
        }
      }, function(key, val, field) {
        return _this[field.setter](i, val);
      });
      tab = makeSettingsTab(domains.eq(i).find('.pop-out'), "label-settings-" + i, 'Labels');
      return tab.append(labelsForm);
    });
  };

  LabelsDisplaySettings.prototype.setSize = function(i, size) {
    var l;
    if (this.renderer) {
      l = this.renderer.domainObjects[i].labels;
      return l.updateFontSize(size, l.nodeSizeFactor);
    }
  };

  LabelsDisplaySettings.prototype.setNodeSizeFactor = function(i, size) {
    var l;
    if (this.renderer) {
      l = this.renderer.domainObjects[i].labels;
      return l.updateFontSize(l.baseSize, size);
    }
  };

  LabelsDisplaySettings.prototype.setVisibility = function(i, visible) {
    if (this.renderer) {
      if (visible) {
        return this.renderer.labelsObject.add(this.renderer.domainObjects[i].labels);
      } else {
        return this.renderer.labelsObject.remove(this.renderer.domainObjects[i].labels);
      }
    }
  };

  LabelsDisplaySettings.prototype.setContent = function(i, p) {
    var object, old,
      _this = this;
    this.model.domains[i].nodes.iter(function(n) {
      var l;
      l = n.getAttr(p);
      return n.setLabel("" + l);
    });
    if (this.renderer) {
      old = this.renderer.domainObjects[i].labels;
      this.renderer.labelsObject.remove(old);
      object = new DomainLabelsObject(this.model.domains[i]);
      object.material.uniforms['color'].value = old.material.uniforms['color'].value;
      this.renderer.domainObjects[i].labels = object;
      return this.renderer.labelsObject.add(object);
    }
  };

  return LabelsDisplaySettings;

})();

NodesDisplaySettings = (function() {

  NodesDisplaySettings.genericNodeAttributes = [['degree', 'Degree'], ['indegree', 'In-degree'], ['outdegree', 'Out-degree']];

  NodesDisplaySettings.textures = [['/static/images/node-textures/ball2.png', 'Sphere 1'], ['/static/images/node-textures/ball.png', 'Sphere 2'], ['/static/images/node-textures/square.png', 'Plain square'], ['/static/images/node-textures/rect.png', 'Bordered square'], ['/static/images/node-textures/disc.png', 'Disc'], ['/static/images/node-textures/lego.png', 'Lego figure'], ['/static/images/node-textures/lego-brick.png', 'Lego brick']];

  function NodesDisplaySettings(viewer) {
    this.viewer = viewer;
    this._graphLoadedCb = __bind(this._graphLoadedCb, this);

    this._rendererChangedCb = __bind(this._rendererChangedCb, this);

    this.viewer.callbacks.graphRendererChanged.add(this._rendererChangedCb);
    this.viewer.callbacks.graphLoaded.add(this._graphLoadedCb);
  }

  NodesDisplaySettings.prototype._rendererChangedCb = function(renderer) {
    this.renderer = renderer;
  };

  NodesDisplaySettings.prototype._graphLoadedCb = function(url, model) {
    var attributes, domains, key, name, numerical, val, _ref,
      _this = this;
    this.model = model;
    numerical = ['int'];
    attributes = NodesDisplaySettings.genericNodeAttributes.slice(0);
    domains = this.viewer.getPanel('domains').element.find('.panel-content > ul > li');
    _ref = this.model.getNodeAttributes();
    for (key in _ref) {
      val = _ref[key];
      if ($.inArray(val.type, numerical) > -1) {
        name = key.replace('_', ' ');
        name = name.charAt(0).toUpperCase() + name.substr(1);
        attributes.push([key, name]);
      }
    }
    this.coloring = [];
    this.sizing = [];
    return this.model.domains.iter(function(domain, i) {
      var coloringEditor, coloringForm, j, max, min, sizingEditor, sizingForm, t, tab, textureForm, textures, _ref1;
      textures = (function() {
        var _i, _len, _ref1, _results;
        _ref1 = NodesDisplaySettings.textures;
        _results = [];
        for (j = _i = 0, _len = _ref1.length; _i < _len; j = ++_i) {
          t = _ref1[j];
          _results.push([j, t[1]]);
        }
        return _results;
      })();
      textureForm = Form.makeForm("nodes-texture-" + i, {
        property: {
          label: 'Texture',
          type: 'list',
          valueType: 'integer',
          values: textures
        }
      }, function(key, val, field) {
        val = NodesDisplaySettings.textures[val][0];
        _this.model.domains[i].setTexture(val);
        if (_this.renderer) {
          return _this.renderer.domainObjects[i].nodes.updateTexture();
        }
      });
      sizingForm = Form.makeForm("nodes-sizing-attribute-" + i, {
        property: {
          label: 'Sizing property',
          type: 'list',
          valueType: 'string',
          values: attributes
        }
      }, function(key, val, field) {
        var max, min, _ref1;
        _this.sizing[i].attr = val;
        _ref1 = _this.getAttrRange(i, val), min = _ref1[0], max = _ref1[1];
        return _this.sizing[i].editor.setInterval(min, max);
      });
      coloringForm = Form.makeForm("nodes-coloring-attribute-" + i, {
        property: {
          label: 'Coloring property',
          type: 'list',
          valueType: 'string',
          values: attributes
        }
      }, function(key, val, field) {
        var max, min, _ref1;
        _this.coloring[i].attr = val;
        _ref1 = _this.getAttrRange(i, val), min = _ref1[0], max = _ref1[1];
        return _this.coloring[i].editor.setInterval(min, max);
      });
      tab = makeSettingsTab(domains.eq(i).find('.pop-out'), "node-settings-" + i, 'Nodes');
      _ref1 = _this.getAttrRange(i, attributes[0][0]), min = _ref1[0], max = _ref1[1];
      sizingEditor = new BezierEditor(350, 170, min, max);
      sizingEditor.changed.add(function(f) {
        _this.sizing[i].func = f;
        return _this.setSize(i);
      });
      coloringEditor = new BezierColorEditor(350, 170, min, max);
      coloringEditor.changed.add(function(f) {
        _this.coloring[i].func = f;
        return _this.setColor(i);
      });
      tab.append(textureForm);
      tab.append(sizingForm);
      tab.append(sizingEditor.getElement());
      tab.append(coloringForm);
      tab.append(coloringEditor.getElement());
      _this.sizing.push({
        attr: attributes[0][0],
        func: void 0,
        editor: sizingEditor
      });
      _this.coloring.push({
        attr: attributes[0][0],
        func: void 0,
        editor: coloringEditor
      });
      sizingEditor.setInterval(min, max);
      return coloringEditor.setInterval(min, max);
    });
  };

  NodesDisplaySettings.prototype.getAttrRange = function(i, p) {
    var max, min;
    min = Infinity;
    max = -Infinity;
    this.model.domains[i].nodes.iter(function(n) {
      var val;
      val = n.getAttr(p);
      if (val != null) {
        min = Math.min(min, val);
        return max = Math.max(max, val);
      }
    });
    return [min, max];
  };

  NodesDisplaySettings.prototype.setColor = function(i) {
    var attr, func, _ref,
      _this = this;
    _ref = this.coloring[i], attr = _ref.attr, func = _ref.func;
    if (!this.model || !func) {
      return;
    }
    return this.model.domains[i].nodes.iter(function(n) {
      return n.setColor(func(n.getAttr(attr)));
    });
  };

  NodesDisplaySettings.prototype.setSize = function(i) {
    var attr, func, _ref,
      _this = this;
    _ref = this.sizing[i], attr = _ref.attr, func = _ref.func;
    if (!this.model || !func) {
      return;
    }
    this.model.domains[i].nodes.iter(function(n) {
      return n.setSize(func(n.getAttr(attr)));
    });
    if (this.renderer) {
      this.renderer._layoutStepCb();
      return this.renderer.domainObjects[i].labels.updateFromNode();
    }
  };

  NodesDisplaySettings.prototype.setTexture = function(id) {
    var loader,
      _this = this;
    loader = new THREE.ImageLoader();
    return loader.load(this.textures[id], function(image) {
      return _this.renderer.domains.iter(function(d) {
        d.texture.image = image;
        return d.texture.needsUpdate = true;
      });
    });
  };

  return NodesDisplaySettings;

})();

ObjectControls = (function() {

  function ObjectControls(viewer) {
    var _this = this;
    this.viewer = viewer;
    this.mousemove = __bind(this.mousemove, this);

    this.mouseup = __bind(this.mouseup, this);

    this.mousedown = __bind(this.mousedown, this);

    this.positionFromEvent = __bind(this.positionFromEvent, this);

    this.offsetFromLastEvent = __bind(this.offsetFromLastEvent, this);

    this.getViewport = __bind(this.getViewport, this);

    this.updateIndicator = __bind(this.updateIndicator, this);

    this.rotationSpeed = .3;
    this.panSpeed = .8;
    this.zoomSpeed = .1;
    this.disabled = false;
    this.getViewport().on('mousedown', function(e) {
      var offset, pos;
      if (_this.disabled) {
        return;
      }
      e.preventDefault();
      $(window).on('mousemove.controls', function(e) {
        var offset, pos;
        e.preventDefault();
        _this.dragging = true;
        pos = _this.positionFromEvent(e);
        offset = _this.offsetFromLastEvent(e);
        _this.mousemove(pos, offset);
        return _this.updateIndicator();
      }).on('mouseup.controls', function(e) {
        var pos;
        $(window).off('mousemove.controls').off('mouseup.controls');
        _this.dragging = false;
        pos = _this.positionFromEvent(e);
        _this._lastEvent = void 0;
        _this.mouseup(pos);
        return _this.updateIndicator();
      });
      if (!e.metaKey) {
        _this.action = 'pan';
      } else {
        _this.action = 'rotate';
      }
      pos = _this.positionFromEvent(e);
      offset = _this.offsetFromLastEvent(e);
      _this.mousedown(pos);
      return _this.updateIndicator();
    }).on('dblclick', function() {
      _this.reset();
      return _this.updateIndicator();
    }).on('mousewheel', function(e) {
      var direction, pos;
      pos = _this.positionFromEvent(e);
      direction = e.originalEvent.wheelDelta / 120;
      if (e.shiftKey) {
        _this.rotate(new THREE.Vector3(1 * direction * 10, 0, 0));
      } else if (e.altKey) {
        _this.rotate(new THREE.Vector3(0, 1 * direction * 10, 0));
      } else if (e.metaKey) {
        _this.rotate(new THREE.Vector3(0, 0, 1 * direction * 10));
      } else {
        _this.zoom(pos, direction);
      }
      return _this.updateIndicator();
    });
  }

  ObjectControls.prototype.updateIndicator = function() {
    return this.viewer.positionIndicator.rotation = this.viewer.getCurrentObject().rotation;
  };

  ObjectControls.prototype.getViewport = function() {
    return this.viewer.container.find('.viewport');
  };

  ObjectControls.prototype.offsetFromLastEvent = function(e) {
    var offset;
    if (this._lastEvent != null) {
      offset = new THREE.Vector3(e.pageX - this._lastEvent.pageX, e.pageY - this._lastEvent.pageY, 0);
    } else {
      offset = new THREE.Vector3(0, 0, 0);
    }
    this._lastEvent = e;
    return offset;
  };

  ObjectControls.prototype.positionFromEvent = function(e) {
    var height, offset, width, x, y;
    offset = this.getViewport().offset();
    width = this.getViewport().width();
    height = this.getViewport().height();
    x = Math.max(0, Math.min(width, e.pageX - offset.left));
    y = Math.max(0, Math.min(height, e.pageY - offset.top));
    return new THREE.Vector2(x, y);
  };

  ObjectControls.prototype.mousedown = function(pos, offset) {};

  ObjectControls.prototype.mouseup = function(pos, offset) {};

  ObjectControls.prototype.mousemove = function(pos, offset) {
    if (this.action === 'pan') {
      return this.pan(offset);
    } else {
      return this.rotate(offset);
    }
  };

  ObjectControls.prototype.reset = function() {
    this.viewer.getCurrentScene().scale = new THREE.Vector3(1, 1, 1);
    this.viewer.getCurrentObject().rotation = new THREE.Vector3(0, 0, 0);
    return this.viewer.getCurrentScene().position = new THREE.Vector3(0, 0, 0);
  };

  ObjectControls.prototype.pan = function(offset) {
    var translation;
    translation = new THREE.Matrix4();
    translation.makeTranslation(offset.x * this.panSpeed / 10, -offset.y * this.panSpeed / 10, 0);
    return this.viewer.getCurrentScene().applyMatrix(translation);
  };

  ObjectControls.prototype.zoom = function(pos, direction) {
    var ax, ay, camera, d, offset, scene, translation, tx, ty;
    camera = this.viewer.camera;
    scene = this.viewer.getCurrentScene();
    d = Math.abs(camera.position.z - scene.position.z);
    offset = -direction * this.zoomSpeed * (d / 10 + 1);
    if (d - offset >= camera.far) {
      return;
    }
    if (d - offset < 1) {
      return;
    }
    ax = pos.x - this.viewer.container.find('canvas').width() / 2;
    ay = pos.y - this.viewer.container.find('canvas').height() / 2;
    tx = ax * (offset - 1) * this.viewer.ratio;
    ty = -ay * (offset - 1) * this.viewer.ratio;
    translation = new THREE.Matrix4();
    translation.makeTranslation(0, 0, offset);
    return scene.applyMatrix(translation);
  };

  ObjectControls.prototype.rotate = function(offset) {
    var rotation, rotationX, rotationY, rotationZ;
    rotationY = new THREE.Matrix4();
    rotationY.makeRotationY(offset.x * this.rotationSpeed / 100);
    rotationX = new THREE.Matrix4();
    rotationX.makeRotationX(offset.y * this.rotationSpeed / 100);
    rotationZ = new THREE.Matrix4();
    rotationZ.makeRotationZ(offset.z * this.rotationSpeed / 100);
    rotation = new THREE.Matrix4().multiplyMatrices(rotationX, rotationY);
    rotation.multiply(rotationZ);
    return this.viewer.getCurrentObject().applyMatrix(rotation);
  };

  return ObjectControls;

})();

makePositionAxis = function(text, size, color) {
  var arrow, axis, label, labelGeometry, labelMaterial, line, material;
  axis = new THREE.Object3D();
  material = new THREE.LineBasicMaterial({
    color: color,
    linewidth: 10
  });
  line = new THREE.Mesh(new THREE.CylinderGeometry(.08, .08, size, 5, 5, false), material);
  line.position.y = size / 2;
  axis.add(line);
  arrow = new THREE.Mesh(new THREE.CylinderGeometry(0, .3, 1.2, 10, 5, false), material);
  arrow.position.y = size;
  axis.add(arrow);
  labelGeometry = new THREE.TextGeometry(text, {
    size: 1.5,
    height: .1,
    font: 'helvetiker',
    curveSegments: 10,
    bevelThickness: 10,
    bevelSize: 1.5,
    bevelEnabled: false,
    material: 0,
    extrudeMaterial: 1
  });
  labelGeometry.computeBoundingBox();
  labelGeometry.computeVertexNormals();
  labelMaterial = new THREE.MeshFaceMaterial([
    new THREE.MeshPhongMaterial({
      color: color,
      shading: THREE.FlatShading
    }), new THREE.MeshPhongMaterial({
      color: color,
      shading: THREE.SmoothShading
    })
  ]);
  label = new THREE.Mesh(labelGeometry, labelMaterial);
  label.position.y = size + 1;
  label.position.x = -.5;
  axis.add(label);
  return axis;
};

makePositionIndicator = function() {
  var position, size, sphere, sphereGeometry, wireframe, wireframeMaterial, x, y, z;
  size = 5;
  position = new THREE.Object3D();
  x = makePositionAxis('X', size, 0xff0000);
  x.rotation.z = -Math.PI / 2;
  x.rotation.x = -Math.PI / 2;
  position.add(x);
  y = makePositionAxis('Y', size, 0x00ff00);
  y.rotation.z = 0;
  position.add(y);
  z = makePositionAxis('Z', size, 0x0000ff);
  z.rotation.x = -Math.PI / 2;
  position.add(z);
  sphere = new THREE.Mesh(new THREE.SphereGeometry(.4, 20, 20), new THREE.MeshBasicMaterial({
    color: 0x000000
  }));
  position.add(sphere);
  sphereGeometry = new THREE.SphereGeometry(2, 10, 10);
  wireframeMaterial = new THREE.LineBasicMaterial({
    color: 0x000000,
    opacity: .05,
    transparent: true
  });
  wireframe = new THREE.Line(geo2line(sphereGeometry), wireframeMaterial, THREE.LinePieces);
  position.add(wireframe);
  return position;
};

Viewer = (function() {

  function Viewer(container, strategies) {
    this.container = container;
    this.strategies = strategies;
    this.getViewport = __bind(this.getViewport, this);

    this.getCurrentObject = __bind(this.getCurrentObject, this);

    this.getCurrentScene = __bind(this.getCurrentScene, this);

    this.getCleanScene = __bind(this.getCleanScene, this);

    this.stats = new Stats();
    this.stats.setMode(0);
    this.panels = {};
    this.callbacks = {
      graphLoaded: $.Callbacks(),
      graphRendererChanged: $.Callbacks()
    };
    this.scene = new THREE.Scene();
    this.strategyConfig = new StrategyConfigurator(this.strategies, this);
    this.addPanel('basic', new BasicInfoPanel(this));
    this.addPanel('generic', new GenericOptionsPanel(this)).collapse();
    this.addPanel('nodeinfo', new NodeInfoPanel(this));
    this.addPanel('domains', new DomainsPanel(this));
    this.addPanel('layout', new LayoutConfigPanel(this.strategyConfig));
    this.addPanel('stats', new StatsPanel(this)).collapse();
    this.addPanel('thumbnail', new ThumbnailPanel(this)).collapse();
    this.addPanel('export', new ExportPanel(this));
    new NodesDisplaySettings(this);
    new LabelsDisplaySettings(this);
    $('.sidebar', this.container).sortable({
      handle: '> h2',
      placeholder: 'drop-placeholder',
      forcePlaceholderSize: true,
      axis: 'y',
      start: function(e, ui) {
        return ui.placeholder.height(ui.item.height());
      }
    });
    if (document.referrer) {
      this.container.append($('<a href="#" id="backlink" class="icon-arrow-left">Back</a>').click(function(e) {
        e.preventDefault();
        return history.back();
      }));
    }
    console.log('New viewer instance created');
  }

  Viewer.prototype.setRenderer = function(graphRenderer) {
    this.graphRenderer = graphRenderer;
    return this.callbacks.graphRendererChanged.fire(this.graphRenderer);
  };

  Viewer.prototype.getCleanScene = function() {
    if (this._currentScene != null) {
      this.scene.remove(this._currentScene);
    }
    this._internalObject = new THREE.Object3D();
    this._currentScene = new THREE.Object3D();
    this._currentScene.add(this._internalObject);
    this.scene.add(this._currentScene);
    return this._internalObject;
  };

  Viewer.prototype.getCurrentScene = function() {
    return this._currentScene;
  };

  Viewer.prototype.getCurrentObject = function() {
    return this._internalObject;
  };

  Viewer.prototype.addPanel = function(name, panel) {
    if (this.panels[name]) {
      this.panels[name].element.detach();
    }
    this.panels[name] = {
      panel: panel,
      element: panel.getElement(name)
    };
    $('.sidebar', this.container).append(this.panels[name].element);
    return panel;
  };

  Viewer.prototype.getPanel = function(name) {
    return this.panels[name];
  };

  Viewer.prototype.getViewport = function() {
    return this.container.find('.viewport');
  };

  Viewer.prototype.load = function(url) {
    var div, p,
      _this = this;
    this.url = url;
    console.log("Loading graph data from " + url);
    div = $('<div/>').append($.spinner());
    p = $('<p>Loading graph data...</p>').appendTo(div);
    return $.ajax({
      url: this.url,
      datatType: 'xml',
      progress: function(e) {
        var pct;
        if (e.lengthComputable) {
          pct = e.loaded / e.total;
          return p.text("Loading graph data, " + (Math.round(pct * 100)) + "% completed...");
        } else {
          return console.warn('Content Length not reported!');
        }
      },
      success: function(data) {
        p.text('Data received, preparing graph...');
        _this._loadFromData(data);
        p.text('Graph creation complete, preparing scene...');
        _this.callbacks.graphLoaded.fire(_this.url, _this.model);
        return _this._prepareScene();
      }
    });
  };

  Viewer.prototype._loadFromData = function(data) {
    var domains, edges, nodes;
    this.model = GraphModel.fromGraphML(data);
    domains = this.model.domains.length;
    nodes = this.model.numNodes();
    edges = this.model.edges.length;
    console.log("Graph loaded: " + domains + " domains, " + nodes + " nodes, " + edges + " edges.");
    if (this.strategy) {
      return this.strategy.render(this.model);
    }
  };

  Viewer.prototype._prepareScene = function() {
    var container, height, light, setPosition, viewport,
      _this = this;
    container = $('.viewport', this.container);
    this.camera = new THREE.PerspectiveCamera(45, 1, 0.1, 2000);
    this.camera.position.z = 90;
    this.controls = new ObjectControls(this);
    light = new THREE.DirectionalLight(0xffffff, 1.2);
    light.position.set(0, 1, 1).normalize();
    this.scene.add(light);
    light = new THREE.DirectionalLight(0xffffff, 1.2);
    light.position.set(0, -1, -1).normalize();
    this.scene.add(light);
    this.positionIndicator = makePositionIndicator();
    height = Math.tan(this.camera.fov / 2) * this.camera.position.z * 2;
    this.ratio = height / container.height();
    setPosition = function() {
      return _this.positionIndicator.position = new THREE.Vector3((-container.width() / 2) * _this.ratio + 8, (-container.height() / 2) * _this.ratio + 8, 0);
    };
    setInterval(setPosition, 100);
    this.scene.add(this.positionIndicator);
    viewport = new Viewport({
      x: 0,
      y: 0,
      width: 1,
      height: 1,
      camera: this.camera,
      controls: this.controls
    });
    this.viewportRenderer = new MultipleViewportsRenderer(container, this.scene, [viewport], this.stats);
    this.viewportRenderer.animate();
    return this.strategyConfig.enable();
  };

  Viewer.prototype._overlay = function(el, sceneOnly) {
    var overlay;
    if (sceneOnly == null) {
      sceneOnly = false;
    }
    overlay = $('.overlay', this.container);
    if (el != null) {
      if (sceneOnly) {
        overlay.addClass('scene-only');
      } else {
        overlay.removeClass('scene-only');
      }
      $('> *', overlay).remove();
      overlay.append(el);
      return overlay.twostepsShow();
    } else {
      return overlay.twostepsHide(function() {
        return $('*', this).remove();
      });
    }
  };

  return Viewer;

})();

ModalPanel = (function() {

  function ModalPanel() {
    this.close = __bind(this.close, this);

    this.open = __bind(this.open, this);

  }

  ModalPanel.prototype.open = function() {};

  ModalPanel.prototype.close = function() {};

  return ModalPanel;

})();

VisualizationSettings = (function(_super) {

  __extends(VisualizationSettings, _super);

  function VisualizationSettings() {
    return VisualizationSettings.__super__.constructor.apply(this, arguments);
  }

  return VisualizationSettings;

})(ModalPanel);

(function($) {
  return $(function() {
    var container, strategies, viewer;
    $('body').click(function(e) {
      var picker;
      picker = $('.color-picker');
      if (!picker.size()) {
        return;
      }
      if ($(e.target).closest('.color-picker').size()) {
        return;
      }
      if ($(jscolor.picker.owner.valueElement).is(':focus')) {
        return;
      }
      delete jscolor.picker.owner;
      return picker.remove();
    });
    container = $('.graph-viewer');
    if (container.size() !== 1) {
      console.error("Incorrect number of graph viewer containers ", "found: " + (container.size()));
      return;
    }
    strategies = [new SingleStrategy([new RandomLayoutFactory(), new FRLayout2DAsyncFactory(), new FRLayout2DFactory(), new FRLayout3DFactory(), new DomainFRLayout2DFactory()]), new DomainStrategy([new FRLayout2DAsyncFactory(), new FRLayout2DFactory(), new FRLayout3DFactory()], [new StackedLayoutFactory(), new FRLayout2DFactory(), new FRLayout3DFactory()]), new ExtrudedStrategy([new StackedLayoutFactory(), new FRLayout2DFactory(), new FRLayout3DFactory()], [new DomainFRLayout2DFactory(), new FRLayout2DAsyncFactory(), new FRLayout2DFactory(), new FRLayout3DFactory()]), new ClusteredStrategy([new FRLayout2DAsyncFactory(), new FRLayout2DFactory(), new FRLayout3DFactory(), new DomainFRLayout2DFactory()])];
    viewer = new Viewer(container, strategies);
    return viewer.load($.urlParam('url'));
  });
})(jQuery);