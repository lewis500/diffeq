(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';
var angular, app, behavior, cartButtonsDer, cartPlotDer, datum, dotDer, horAxis, lineDer, material, plotADer, plotBDer, shifter, verAxis;

angular = require('angular');

datum = require('./directives/datum');

dotDer = require('./directives/dot');

horAxis = require('./directives/xAxis');

verAxis = require('./directives/yAxis');

behavior = require('./directives/behavior');

cartPlotDer = require('./components/cart/cartPlot');

cartButtonsDer = require('./components/cart/cartButtons');

shifter = require('./directives/shifter');

material = require('angular-material');

plotADer = require('./components/plot/plotA');

plotBDer = require('./components/plot/plotB');

lineDer = require('./directives/line');

app = angular.module('mainApp', [material]).directive('horAxisDer', horAxis).directive('verAxisDer', verAxis).directive('cartPlotDer', cartPlotDer).directive('cartButtonsDer', cartButtonsDer).directive('shifter', shifter).directive('plotADer', plotADer).directive('behavior', behavior).directive('dotDer', dotDer).directive('datum', datum).directive('lineDer', lineDer).directive('plotBDer', plotBDer);



},{"./components/cart/cartButtons":2,"./components/cart/cartPlot":4,"./components/plot/plotA":5,"./components/plot/plotB":6,"./directives/behavior":8,"./directives/datum":9,"./directives/dot":10,"./directives/line":11,"./directives/shifter":12,"./directives/xAxis":13,"./directives/yAxis":14,"angular":undefined,"angular-material":undefined}],2:[function(require,module,exports){
var Cart, Ctrl, _, atan, der, exp, sqrt, template;

_ = require('lodash');

exp = Math.exp, sqrt = Math.sqrt, atan = Math.atan;

Cart = require('./cartData');

template = '<div flex layout=\'row\'>\n	<md-button flex class="md-raised" ng-click=\'vm.play()\'>Play</md-button>\n	<md-button flex class="md-raised" ng-click=\'vm.pause()\'>Pause</md-button>\n</div>';

Ctrl = (function() {
  function Ctrl(scope) {
    this.scope = scope;
    this.cart = Cart;
  }

  Ctrl.prototype.play = function() {
    this.paused = true;
    d3.timer.flush();
    this.paused = false;
    return setTimeout((function(_this) {
      return function() {
        return d3.timer(function(t) {
          _this.cart.move(t / 1000);
          _this.scope.$evalAsync();
          if (_this.cart.v < .01) {
            _this.paused = true;
          }
          if (_this.paused) {
            console.log('leaving');
          }
          return _this.paused;
        });
      };
    })(this));
  };

  Ctrl.prototype.pause = function() {
    return this.paused = true;
  };

  return Ctrl;

})();

der = function() {
  var directive;
  return directive = {
    controllerAs: 'vm',
    scope: {},
    controller: ['$scope', Ctrl],
    template: template
  };
};

module.exports = der;



},{"./cartData":3,"lodash":undefined}],3:[function(require,module,exports){
var Cart, _, atan, exp, sqrt;

_ = require('lodash');

exp = Math.exp, sqrt = Math.sqrt, atan = Math.atan;

Cart = (function() {
  function Cart(options) {
    var ref;
    this.options = options;
    ref = this.options, this.x0 = ref.x0, this.v0 = ref.v0, this.b = ref.b;
    this.restart();
  }

  Cart.prototype.restart = function() {
    this.trajectory = [];
    return this.move(0);
  };

  Cart.prototype.move = function(t) {
    this.v = this.v0 * exp(-this.b * t);
    this.x = this.x0 + this.v0 / this.b * (1 - exp(-this.b * t));
    return this.trajectory.push({
      t: t,
      v: this.v,
      x: this.x
    });
  };

  return Cart;

})();

module.exports = new Cart({
  x0: 0,
  v0: 4,
  b: 1
});



},{"lodash":undefined}],4:[function(require,module,exports){
var Cart, Ctrl, _, d3, der, min, template,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

_ = require('lodash');

d3 = require('d3');

min = Math.min;

Cart = require('./cartData');

require('../../helpers');

template = '<svg ng-init=\'vm.resize()\' width=\'100%\' ng-attr-height=\'{{vm.svg_height}}\'>\n	<g shifter=\'{{::[vm.mar.left, vm.mar.top]}}\'>\n		<rect ng-attr-width=\'{{vm.width}}\' ng-attr-height=\'{{vm.height}}\' class=\'background\'/>\n		<g hor-axis-der height=\'vm.height\' scale=\'vm.X\' fun=\'vm.axisFun\' shifter=\'[0,vm.height]\'></g>\n		<g class=\'g-cart\'>\n			<rect class=\'cart\' ng-attr-y=\'{{vm.height/3}}\' ng-attr-width=\'{{vm.height/3}}\' ng-attr-height=\'{{vm.height/3}}\'/>\n		</g>\n	</g>\n</svg>';

Ctrl = (function() {
  function Ctrl(scope, el, window) {
    var cart, sel;
    this.scope = scope;
    this.el = el;
    this.window = window;
    this.resize = bind(this.resize, this);
    this.cart = Cart;
    this.mar = {
      left: 10,
      right: 10,
      top: 10,
      bottom: 18
    };
    this.X = d3.scale.linear().domain([-.25, 5]);
    sel = d3.select(this.el[0]);
    cart = sel.select('.g-cart');
    this.axisFun = d3.svg.axis().scale(this.X).ticks(5).orient('bottom');
    this.scope.$watch('vm.cart.x', (function(_this) {
      return function(x) {
        var xPx;
        xPx = _this.X(x);
        return cart.transition().duration(15).ease('linear').attr('transform', "translate(" + xPx + ",0)");
      };
    })(this));
    angular.element(this.window).on('resize', (function(_this) {
      return function() {
        return _this.resize();
      };
    })(this));
  }

  Ctrl.property('svg_height', {
    get: function() {
      return this.height + this.mar.top + this.mar.bottom;
    }
  });

  Ctrl.prototype.resize = function() {
    this.width = this.el[0].clientWidth - this.mar.left - this.mar.right;
    this.height = this.width * .3 - this.mar.top - this.mar.bottom;
    this.X.range([0, this.width]);
    return this.scope.$evalAsync();
  };

  return Ctrl;

})();

der = function() {
  var directive;
  return directive = {
    template: template,
    scope: {},
    restrict: 'A',
    bindToController: true,
    templateNamespace: 'svg',
    controller: ['$scope', '$element', '$window', Ctrl],
    controllerAs: 'vm'
  };
};

module.exports = der;



},{"../../helpers":15,"./cartData":3,"d3":undefined,"lodash":undefined}],5:[function(require,module,exports){
var Ctrl, Data, angular, d3, der, template,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

angular = require('angular');

d3 = require('d3');

Data = require('./plotData');

require('../../helpers');

template = '<svg ng-init=\'vm.resize()\' width=\'100%\' ng-attr-height=\'{{vm.svg_height}}\'>\n	<defs>\n		<clippath id=\'plotA\'>\n			<rect ng-attr-width=\'{{vm.width}}\' ng-attr-height=\'{{vm.height}}\'></rect>\n		</clippath>\n	</defs>\n	<g class=\'boilerplate\' shifter=\'[vm.mar.left, vm.mar.top]\'>\n		<rect class=\'background\' ng-attr-width=\'{{vm.width}}\' ng-attr-height=\'{{vm.height}}\' behavior=\'vm.drag_rect\'></rect>\n		<g ver-axis-der width=\'vm.width\' scale=\'vm.V\' fun=\'vm.verAxFun\'></g>\n		<g hor-axis-der height=\'vm.height\' scale=\'vm.T\' fun=\'vm.horAxFun\' shifter=\'[0,vm.height]\'></g>\n	</g>\n	<g class=\'main\' clip-path="url(#plotA)" shifter=\'[vm.mar.left, vm.mar.top]\'>\n		<path ng-attr-d=\'{{vm.lineFun(vm.Data.dots)}}\' class=\'fun y\'></path>\n		<g ng-repeat=\'dot in vm.Data.dots track by dot.id\' datum=dot shifter=\'[vm.T(dot.t),vm.V(dot.v)]\' behavior=\'vm.drag\' dot-der>\n		</g>\n	</g>\n</svg>';

Ctrl = (function() {
  function Ctrl(scope, el, window) {
    this.scope = scope;
    this.el = el;
    this.window = window;
    this.resize = bind(this.resize, this);
    this.on_drag = bind(this.on_drag, this);
    this.mar = {
      left: 30,
      top: 20,
      right: 20,
      bottom: 30
    };
    this.V = d3.scale.linear().domain([0, 4]);
    this.T = d3.scale.linear().domain([0, 8]);
    this.Data = Data;
    this.horAxFun = d3.svg.axis().scale(this.T).ticks(5).orient('bottom');
    this.verAxFun = d3.svg.axis().scale(this.V).ticks(5).orient('left');
    this.lineFun = d3.svg.line().y((function(_this) {
      return function(d) {
        return _this.V(d.v);
      };
    })(this)).x((function(_this) {
      return function(d) {
        return _this.T(d.t);
      };
    })(this));
    this.drag_rect = d3.behavior.drag().on('dragstart', (function(_this) {
      return function() {
        var rect, t, v;
        event.stopPropagation();
        if (event.which === 3) {
          return event.preventDefault();
        }
        rect = event.toElement.getBoundingClientRect();
        t = _this.T.invert(event.x - rect.left);
        v = _this.V.invert(event.y - rect.top);
        Data.add_dot(t, v);
        return _this.scope.$evalAsync();
      };
    })(this)).on('drag', (function(_this) {
      return function() {
        return _this.on_drag(Data.selected);
      };
    })(this));
    this.drag = d3.behavior.drag().on('dragstart', (function(_this) {
      return function(dot) {
        event.stopPropagation();
        if (event.which === 3) {
          Data.remove_dot(dot);
          event.preventDefault();
          return _this.scope.$evalAsync();
        }
      };
    })(this)).on('drag', this.on_drag);
    angular.element(this.window).on('resize', this.resize);
  }

  Ctrl.property('svg_height', {
    get: function() {
      return this.height + this.mar.top + this.mar.bottom;
    }
  });

  Ctrl.prototype.on_drag = function(dot) {
    if (event.which === 3) {
      event.preventDefault();
      return;
    }
    Data.update_dot(dot, this.T.invert(d3.event.x), this.V.invert(d3.event.y));
    return this.scope.$evalAsync();
  };

  Ctrl.prototype.resize = function() {
    this.width = this.el[0].clientWidth - this.mar.left - this.mar.right;
    this.height = this.width * .7;
    this.V.range([this.height, 0]);
    this.T.range([0, this.width]);
    return this.scope.$evalAsync();
  };

  return Ctrl;

})();

der = function() {
  var directive;
  return directive = {
    controllerAs: 'vm',
    scope: {},
    template: template,
    templateNamespace: 'svg',
    controller: ['$scope', '$element', '$window', Ctrl]
  };
};

module.exports = der;



},{"../../helpers":15,"./plotData":7,"angular":undefined,"d3":undefined}],6:[function(require,module,exports){
var Ctrl, Data, angular, d3, der, template,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

Data = require('./plotData');

angular = require('angular');

d3 = require('d3');

require('../../helpers');

template = '<svg ng-init=\'vm.resize()\'  width=\'100%\' ng-attr-height=\'{{vm.svg_height}}\'>\n	<defs>\n		<clippath id=\'plotB\'>\n			<rect ng-attr-width=\'{{vm.width}}\' ng-attr-height=\'{{vm.height}}\'></rect>\n		</clippath>\n	</defs>\n	<g class=\'boilerplate\' shifter=\'[vm.mar.left, vm.mar.top]\'>\n		<rect class=\'background\' ng-attr-width=\'{{vm.width}}\' ng-attr-height=\'{{vm.height}}\'></rect>\n		<g ver-axis-der width=\'vm.width\' scale=\'vm.DV\' fun=\'vm.verAxFun\'></g>\n		<g hor-axis-der height=\'vm.height\' scale=\'vm.V\' fun=\'vm.horAxFun\' shifter=\'[0,vm.height]\'></g>\n	</g>\n	<g class=\'main\' clip-path="url(#plotB)" shifter=\'[vm.mar.left, vm.mar.top]\'>\n		<path ng-attr-d=\'{{vm.lineFun(vm.Data.dots)}}\' class=\'fun dy\'/>\n		<g ng-repeat=\'dot in vm.Data.dots track by dot.id\' datum=dot shifter=\'[vm.V(dot.v),vm.DV(dot.dv)]\' dot-der>\n		</g>\n		<path ng-attr-d=\'{{vm.lineFun(vm.Data.target_data)}}\' class=\'fun target\' />\n	</g>\n</svg>';

Ctrl = (function() {
  function Ctrl(scope, el, window) {
    this.scope = scope;
    this.el = el;
    this.window = window;
    this.resize = bind(this.resize, this);
    this.mar = {
      left: 30,
      top: 20,
      right: 20,
      bottom: 30
    };
    this.DV = d3.scale.linear().domain([-4, 0]);
    this.V = d3.scale.linear().domain([0, 4]);
    this.horAxFun = d3.svg.axis().scale(this.V).ticks(4).orient('bottom');
    this.verAxFun = d3.svg.axis().scale(this.DV).orient('left');
    this.Data = Data;
    this.lineFun = d3.svg.line().y((function(_this) {
      return function(d) {
        return _this.DV(d.dv);
      };
    })(this)).x((function(_this) {
      return function(d) {
        return _this.V(d.v);
      };
    })(this));
    angular.element(this.window).on('resize', this.resize);
  }

  Ctrl.property('svg_height', {
    get: function() {
      return this.height + this.mar.top + this.mar.bottom;
    }
  });

  Ctrl.prototype.resize = function() {
    this.width = this.el[0].clientWidth - this.mar.left - this.mar.right;
    this.height = this.width * .7;
    this.DV.range([this.height, 0]);
    this.V.range([0, this.width]);
    return this.scope.$evalAsync();
  };

  return Ctrl;

})();

der = function() {
  var directive;
  return directive = {
    controllerAs: 'vm',
    scope: {},
    template: template,
    templateNamespace: 'svg',
    controller: ['$scope', '$element', '$window', Ctrl]
  };
};

module.exports = der;



},{"../../helpers":15,"./plotData":7,"angular":undefined,"d3":undefined}],7:[function(require,module,exports){
var Dot, Service, _, atan, exp, min, service, sqrt;

_ = require('lodash');

exp = Math.exp, sqrt = Math.sqrt, atan = Math.atan, min = Math.min;

Dot = (function() {
  function Dot(t1, v1) {
    this.t = t1;
    this.v = v1;
    this.id = _.uniqueId('dot');
  }

  return Dot;

})();

Service = (function() {
  function Service() {
    this.dots = [];
    this.selected = void 0;
    this.target_data = _.range(0, 8, 1 / 50).map(function(t) {
      var res;
      return res = {
        t: t,
        v: 4 * exp(-t),
        dv: -4 * exp(-t)
      };
    });
  }

  Service.prototype.add_dot = function(t, v) {
    this.selected = new Dot(t, v);
    this.dots.push(this.selected);
    return this.update_dot(this.selected, t, v);
  };

  Service.prototype.remove_dot = function(dot) {
    return this.dots.splice(this.dots.indexOf(dot), 1);
  };

  Service.prototype.update_dots = function() {
    this.dots.sort(function(a, b) {
      return a.t - b.t;
    });
    return this.dots.forEach(function(dot, i, k) {
      var prev;
      prev = k[i - 1];
      return dot.dv = prev ? min(100, (dot.v - prev.v) / (dot.t - prev.t)) : 0;
    });
  };

  Service.prototype.update_dot = function(dot, t, v) {
    dot.t = t;
    dot.v = v;
    return this.update_dots();
  };

  return Service;

})();

service = new Service;

module.exports = service;



},{"lodash":undefined}],8:[function(require,module,exports){
var drag;

drag = function($parse) {
  var directive;
  return directive = {
    link: function(scope, el, attr) {
      var sel;
      sel = d3.select(el[0]);
      return sel.call($parse(attr.behavior)(scope));
    }
  };
};

module.exports = drag;



},{}],9:[function(require,module,exports){
module.exports = function($parse) {
  return function(scope, el, attr) {
    return d3.select(el[0]).datum($parse(attr.datum)(scope));
  };
};



},{}],10:[function(require,module,exports){
var der, template;

template = '<circle class=\'dot large\'></circle>\n<circle class=\'dot small\' r=\'4\'></circle>';

der = function() {
  var directive;
  return directive = {
    template: template,
    restrict: 'A',
    link: function(scope, el, attr) {
      var big, mouseover, rad, sel;
      rad = 10;
      sel = d3.select(el[0]);
      big = sel.select('circle.dot.large').attr('r', rad);
      mouseover = function() {
        return big.transition('grow').duration(150).ease('cubic-out').attr('r', rad * 1.5).transition().duration(150).ease('cubic-in').attr('r', rad * 1.3);
      };
      mouseover();
      return big.on('mouseover', mouseover).on('contextmenu', function() {
        return event.preventDefault();
      }).on('mousedown', function() {
        return big.transition('grow').duration(150).ease('cubic').attr('r', rad * 1.7);
      }).on('mouseup', function() {
        return big.transition('grow').duration(150).ease('cubic-in').attr('r', rad * 1.3);
      }).on('mouseout', function() {
        return big.transition('shrink').duration(350).ease('bounce-out').attr('r', rad);
      });
    }
  };
};

module.exports = der;



},{}],11:[function(require,module,exports){
var d3, der, element;

d3 = require('d3');

element = require('angular').element;

der = function() {
  var directive;
  return directive = {
    controller: function() {},
    controllerAs: 'vm',
    bindToController: true,
    restrict: 'A',
    templateNamespace: 'svg',
    scope: {
      data: '=',
      lineFun: '=',
      watch: '='
    },
    link: function(scope, el, attr, vm) {
      var sel, update;
      sel = d3.select(el[0]);
      update = function() {
        return sel.attr('d', vm.lineFun(vm.data));
      };
      scope.$watch('vm.watch', update, true);
      return element(window).on('resize', update);
    }
  };
};

module.exports = der;



},{"angular":undefined,"d3":undefined}],12:[function(require,module,exports){
var d3, der;

d3 = require('d3');

der = function($parse) {
  var directive;
  return directive = {
    link: function(scope, el, attr) {
      var reshift;
      reshift = function(v) {
        return d3.select(el[0]).attr('transform', "translate(" + v[0] + "," + v[1] + ")");
      };
      return scope.$watch(function() {
        return $parse(attr.shifter)(scope);
      }, reshift, true);
    }
  };
};

module.exports = der;



},{"d3":undefined}],13:[function(require,module,exports){
var angular, d3, der;

d3 = require('d3');

angular = require('angular');

der = function($window) {
  var directive;
  return directive = {
    controller: angular.noop,
    controllerAs: 'vm',
    bindToController: true,
    restrict: 'A',
    templateNamespace: 'svg',
    scope: {
      scale: '=',
      height: '=',
      fun: '='
    },
    link: function(scope, el, attr, vm) {
      var ref, sel, update, xAxisFun;
      xAxisFun = (ref = vm.fun) != null ? ref : d3.svg.axis().scale(vm.scale).orient('bottom');
      sel = d3.select(el[0]).classed('x axis', true);
      update = (function(_this) {
        return function() {
          xAxisFun.tickSize(-vm.height);
          return sel.call(xAxisFun);
        };
      })(this);
      update();
      scope.$watch('vm.scale.domain()', update, true);
      scope.$watch('vm.height', update, true);
      return angular.element($window).on('resize', update);
    }
  };
};

module.exports = der;



},{"angular":undefined,"d3":undefined}],14:[function(require,module,exports){
var angular, d3, der;

d3 = require('d3');

angular = require('angular');

der = function($window) {
  var directive;
  return directive = {
    controller: angular.noop,
    controllerAs: 'vm',
    bindToController: true,
    restrict: 'A',
    templateNamespace: 'svg',
    scope: {
      scale: '=',
      width: '=',
      axisFun: '='
    },
    link: function(scope, el, attr, vm) {
      var ref, sel, update, yAxisFun;
      yAxisFun = (ref = vm.axisFun) != null ? ref : d3.svg.axis().scale(vm.scale).orient('left');
      sel = d3.select(el[0]).classed('y axis', true);
      update = (function(_this) {
        return function() {
          yAxisFun.tickSize(-vm.width);
          return sel.call(yAxisFun);
        };
      })(this);
      update();
      scope.$watch('vm.scale.domain()', update, true);
      return scope.$watch('vm.width', update);
    }
  };
};

module.exports = der;



},{"angular":undefined,"d3":undefined}],15:[function(require,module,exports){
'use strict';
module.exports.timeout = function(fun, time) {
  return d3.timer((function(_this) {
    return function() {
      fun();
      return true;
    };
  })(this), time);
};

Function.prototype.property = function(prop, desc) {
  return Object.defineProperty(this.prototype, prop, desc);
};



},{}]},{},[1])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvbGV3aXMvUmVzZWFyY2gvZGlmZkVRX25ldy9hcHAvYXBwLmNvZmZlZSIsIi9Vc2Vycy9sZXdpcy9SZXNlYXJjaC9kaWZmRVFfbmV3L2FwcC9jb21wb25lbnRzL2NhcnQvY2FydEJ1dHRvbnMuY29mZmVlIiwiL1VzZXJzL2xld2lzL1Jlc2VhcmNoL2RpZmZFUV9uZXcvYXBwL2NvbXBvbmVudHMvY2FydC9jYXJ0RGF0YS5jb2ZmZWUiLCIvVXNlcnMvbGV3aXMvUmVzZWFyY2gvZGlmZkVRX25ldy9hcHAvY29tcG9uZW50cy9jYXJ0L2NhcnRQbG90LmNvZmZlZSIsIi9Vc2Vycy9sZXdpcy9SZXNlYXJjaC9kaWZmRVFfbmV3L2FwcC9jb21wb25lbnRzL3Bsb3QvcGxvdEEuY29mZmVlIiwiL1VzZXJzL2xld2lzL1Jlc2VhcmNoL2RpZmZFUV9uZXcvYXBwL2NvbXBvbmVudHMvcGxvdC9wbG90Qi5jb2ZmZWUiLCIvVXNlcnMvbGV3aXMvUmVzZWFyY2gvZGlmZkVRX25ldy9hcHAvY29tcG9uZW50cy9wbG90L3Bsb3REYXRhLmNvZmZlZSIsIi9Vc2Vycy9sZXdpcy9SZXNlYXJjaC9kaWZmRVFfbmV3L2FwcC9kaXJlY3RpdmVzL2JlaGF2aW9yLmNvZmZlZSIsIi9Vc2Vycy9sZXdpcy9SZXNlYXJjaC9kaWZmRVFfbmV3L2FwcC9kaXJlY3RpdmVzL2RhdHVtLmNvZmZlZSIsIi9Vc2Vycy9sZXdpcy9SZXNlYXJjaC9kaWZmRVFfbmV3L2FwcC9kaXJlY3RpdmVzL2RvdC5jb2ZmZWUiLCIvVXNlcnMvbGV3aXMvUmVzZWFyY2gvZGlmZkVRX25ldy9hcHAvZGlyZWN0aXZlcy9saW5lLmNvZmZlZSIsIi9Vc2Vycy9sZXdpcy9SZXNlYXJjaC9kaWZmRVFfbmV3L2FwcC9kaXJlY3RpdmVzL3NoaWZ0ZXIuY29mZmVlIiwiL1VzZXJzL2xld2lzL1Jlc2VhcmNoL2RpZmZFUV9uZXcvYXBwL2RpcmVjdGl2ZXMveEF4aXMuY29mZmVlIiwiL1VzZXJzL2xld2lzL1Jlc2VhcmNoL2RpZmZFUV9uZXcvYXBwL2RpcmVjdGl2ZXMveUF4aXMuY29mZmVlIiwiL1VzZXJzL2xld2lzL1Jlc2VhcmNoL2RpZmZFUV9uZXcvYXBwL2hlbHBlcnMuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUEsWUFBQSxDQUFBO0FBQUEsSUFBQSxvSUFBQTs7QUFBQSxPQUNBLEdBQVUsT0FBQSxDQUFRLFNBQVIsQ0FEVixDQUFBOztBQUFBLEtBS0EsR0FBUSxPQUFBLENBQVEsb0JBQVIsQ0FMUixDQUFBOztBQUFBLE1BTUEsR0FBUyxPQUFBLENBQVEsa0JBQVIsQ0FOVCxDQUFBOztBQUFBLE9BT0EsR0FBVSxPQUFBLENBQVEsb0JBQVIsQ0FQVixDQUFBOztBQUFBLE9BUUEsR0FBVSxPQUFBLENBQVEsb0JBQVIsQ0FSVixDQUFBOztBQUFBLFFBU0EsR0FBVyxPQUFBLENBQVEsdUJBQVIsQ0FUWCxDQUFBOztBQUFBLFdBVUEsR0FBYyxPQUFBLENBQVEsNEJBQVIsQ0FWZCxDQUFBOztBQUFBLGNBV0EsR0FBaUIsT0FBQSxDQUFRLCtCQUFSLENBWGpCLENBQUE7O0FBQUEsT0FZQSxHQUFVLE9BQUEsQ0FBUSxzQkFBUixDQVpWLENBQUE7O0FBQUEsUUFhQSxHQUFXLE9BQUEsQ0FBUSxrQkFBUixDQWJYLENBQUE7O0FBQUEsUUFjQSxHQUFXLE9BQUEsQ0FBUSx5QkFBUixDQWRYLENBQUE7O0FBQUEsUUFlQSxHQUFXLE9BQUEsQ0FBUSx5QkFBUixDQWZYLENBQUE7O0FBQUEsT0FnQkEsR0FBVSxPQUFBLENBQVEsbUJBQVIsQ0FoQlYsQ0FBQTs7QUFBQSxHQWtCQSxHQUFNLE9BQU8sQ0FBQyxNQUFSLENBQWUsU0FBZixFQUEwQixDQUFDLFFBQUQsQ0FBMUIsQ0FDTCxDQUFDLFNBREksQ0FDTSxZQUROLEVBQ29CLE9BRHBCLENBRUwsQ0FBQyxTQUZJLENBRU0sWUFGTixFQUVvQixP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SztJQUFBLENBVE47SUFGSTtBQUFBLENBSE4sQ0FBQTs7QUFBQSxNQThCTSxDQUFDLE9BQVAsR0FBaUIsR0E5QmpCLENBQUE7Ozs7O0FDQUEsWUFBQSxDQUFBO0FBQUEsTUFFTSxDQUFDLE9BQU8sQ0FBQyxPQUFmLEdBQXlCLFNBQUMsR0FBRCxFQUFNLElBQU4sR0FBQTtTQUN2QixFQUFFLENBQUMsS0FBSCxDQUFTLENBQUEsU0FBQSxLQUFBLEdBQUE7V0FBQSxTQUFBLEdBQUE7QUFDUixNQUFBLEdBQUEsQ0FBQSxDQUFBLENBQUE7YUFDQSxLQUZRO0lBQUEsRUFBQTtFQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBVCxFQUdDLElBSEQsRUFEdUI7QUFBQSxDQUZ6QixDQUFBOztBQUFBLFFBU1EsQ0FBQSxTQUFFLENBQUEsUUFBVixHQUFxQixTQUFDLElBQUQsRUFBTyxJQUFQLEdBQUE7U0FDbkIsTUFBTSxDQUFDLGNBQVAsQ0FBc0IsSUFBQyxDQUFBLFNBQXZCLEVBQWtDLElBQWxDLEVBQXdDLElBQXhDLEVBRG1CO0FBQUEsQ0FUckIsQ0FBQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIndXNlIHN0cmljdCdcbmFuZ3VsYXIgPSByZXF1aXJlICdhbmd1bGFyJ1xuIyB0aGlyZExlZnQgPSByZXF1aXJlICcuL2NvbXBvbmVudHMvdGhpcmQvdGhpcmRMZWZ0J1xuIyB0aGlyZEJpZyA9IHJlcXVpcmUgJy4vY29tcG9uZW50cy90aGlyZC90aGlyZEJpZydcbiMgeUF4aXMgPSByZXF1aXJlICcuL2RpcmVjdGl2ZXMveUF4aXMnXG5kYXR1bSA9IHJlcXVpcmUgJy4vZGlyZWN0aXZlcy9kYXR1bSdcbmRvdERlciA9IHJlcXVpcmUgJy4vZGlyZWN0aXZlcy9kb3QnXG5ob3JBeGlzID0gcmVxdWlyZSAnLi9kaXJlY3RpdmVzL3hBeGlzJ1xudmVyQXhpcyA9IHJlcXVpcmUgJy4vZGlyZWN0aXZlcy95QXhpcydcbmJlaGF2aW9yID0gcmVxdWlyZSAnLi9kaXJlY3RpdmVzL2JlaGF2aW9yJ1xuY2FydFBsb3REZXIgPSByZXF1aXJlICcuL2NvbXBvbmVudHMvY2FydC9jYXJ0UGxvdCdcbmNhcnRCdXR0b25zRGVyID0gcmVxdWlyZSAnLi9jb21wb25lbnRzL2NhcnQvY2FydEJ1dHRvbnMnXG5zaGlmdGVyID0gcmVxdWlyZSAnLi9kaXJlY3RpdmVzL3NoaWZ0ZXInXG5tYXRlcmlhbCA9IHJlcXVpcmUgJ2FuZ3VsYXItbWF0ZXJpYWwnXG5wbG90QURlciA9IHJlcXVpcmUgJy4vY29tcG9uZW50cy9wbG90L3Bsb3RBJ1xucGxvdEJEZXIgPSByZXF1aXJlICcuL2NvbXBvbmVudHMvcGxvdC9wbG90QidcbmxpbmVEZXIgPSByZXF1aXJlICcuL2RpcmVjdGl2ZXMvbGluZSdcblxuYXBwID0gYW5ndWxhci5tb2R1bGUgJ21haW5BcHAnLCBbbWF0ZXJpYWxdXG5cdC5kaXJlY3RpdmUgJ2hvckF4aXNEZXInLCBob3JBeGlzXG5cdC5kaXJlY3RpdmUgJ3ZlckF4aXNEZXInLCB2ZXJBeGlzXG5cdC5kaXJlY3RpdmUgJ2NhcnRQbG90RGVyJywgY2FydFBsb3REZXJcblx0LmRpcmVjdGl2ZSAnY2FydEJ1dHRvbnNEZXInLCBjYXJ0QnV0dG9uc0RlclxuXHQuZGlyZWN0aXZlICdzaGlmdGVyJyAsIHNoaWZ0ZXJcblx0LmRpcmVjdGl2ZSAncGxvdEFEZXInLCBwbG90QURlclxuXHQuZGlyZWN0aXZlICdiZWhhdmlvcicsIGJlaGF2aW9yXG5cdC5kaXJlY3RpdmUgJ2RvdERlcicsIGRvdERlclxuXHQuZGlyZWN0aXZlICdkYXR1bScsIGRhdHVtXG5cdC5kaXJlY3RpdmUgJ2xpbmVEZXInLCBsaW5lRGVyXG5cdC5kaXJlY3RpdmUgJ3Bsb3RCRGVyJyAsIHBsb3RCRGVyIiwiXyA9IHJlcXVpcmUgJ2xvZGFzaCdcbntleHAsIHNxcnQsIGF0YW59ID0gTWF0aFxuQ2FydCA9IHJlcXVpcmUgJy4vY2FydERhdGEnXG5cbnRlbXBsYXRlID0gJycnXG5cdDxkaXYgZmxleCBsYXlvdXQ9J3Jvdyc+XG5cdFx0PG1kLWJ1dHRvbiBmbGV4IGNsYXNzPVwibWQtcmFpc2VkXCIgbmctY2xpY2s9J3ZtLnBsYXkoKSc+UGxheTwvbWQtYnV0dG9uPlxuXHRcdDxtZC1idXR0b24gZmxleCBjbGFzcz1cIm1kLXJhaXNlZFwiIG5nLWNsaWNrPSd2bS5wYXVzZSgpJz5QYXVzZTwvbWQtYnV0dG9uPlxuXHQ8L2Rpdj5cbicnJ1xuXG5jbGFzcyBDdHJsXG5cdGNvbnN0cnVjdG9yOiAoQHNjb3BlKS0+XG5cdFx0QGNhcnQgPSBDYXJ0XG5cblx0cGxheTogLT5cblx0XHRAcGF1c2VkID0gdHJ1ZVxuXHRcdGQzLnRpbWVyLmZsdXNoKClcblx0XHRAcGF1c2VkID0gZmFsc2Vcblx0XHRzZXRUaW1lb3V0ID0+XG5cdFx0XHRkMy50aW1lciAodCk9PlxuXHRcdFx0XHRAY2FydC5tb3ZlIHQvMTAwMFxuXHRcdFx0XHRAc2NvcGUuJGV2YWxBc3luYygpXG5cdFx0XHRcdGlmIChAY2FydC52IDwgLjAxKSB0aGVuIEBwYXVzZWQgPSB0cnVlXG5cdFx0XHRcdGlmIEBwYXVzZWQgdGhlbiBjb25zb2xlLmxvZyAnbGVhdmluZydcblx0XHRcdFx0QHBhdXNlZFxuXG5cdHBhdXNlOiAtPlxuXHRcdEBwYXVzZWQgPSB0cnVlXG5cbmRlciA9ICgpLT5cblx0ZGlyZWN0aXZlID0gXG5cdFx0Y29udHJvbGxlckFzOiAndm0nXG5cdFx0IyByZXN0cmljdDogJ0UnXG5cdFx0c2NvcGU6IHt9XG5cdFx0Y29udHJvbGxlcjogWyckc2NvcGUnLCBDdHJsXVxuXHRcdHRlbXBsYXRlOiB0ZW1wbGF0ZVxuXG5tb2R1bGUuZXhwb3J0cyA9IGRlciIsIl8gPSByZXF1aXJlICdsb2Rhc2gnXG57ZXhwLCBzcXJ0LCBhdGFufSA9IE1hdGhcblxuY2xhc3MgQ2FydFxuXHRjb25zdHJ1Y3RvcjogKEBvcHRpb25zKS0+XG5cdFx0e0B4MCwgQHYwLCBAYn0gPSBAb3B0aW9uc1xuXHRcdEByZXN0YXJ0KClcblx0cmVzdGFydDogLT5cblx0XHRAdHJhamVjdG9yeSA9IFtdXG5cdFx0QG1vdmUoMClcblx0bW92ZTogKHQpLT5cblx0XHRAdiA9IEB2MCAqIGV4cCgtQGIgKiB0KVxuXHRcdEB4ID0gQHgwICsgQHYwL0BiICogKDEtZXhwKC1AYip0KSlcblx0XHRAdHJhamVjdG9yeS5wdXNoIHt0OiB0LCB2OiBAdiwgeDogQHh9XG5cbm1vZHVsZS5leHBvcnRzID0gbmV3IENhcnQge3gwOiAwLCB2MDogNCwgYjogMX0iLCJfID0gcmVxdWlyZSAnbG9kYXNoJ1xuZDM9IHJlcXVpcmUgJ2QzJ1xue21pbn0gPSBNYXRoXG5DYXJ0ID0gcmVxdWlyZSAnLi9jYXJ0RGF0YSdcbnJlcXVpcmUgJy4uLy4uL2hlbHBlcnMnXG5cbnRlbXBsYXRlID0gJycnXG5cdDxzdmcgbmctaW5pdD0ndm0ucmVzaXplKCknIHdpZHRoPScxMDAlJyBuZy1hdHRyLWhlaWdodD0ne3t2bS5zdmdfaGVpZ2h0fX0nPlxuXHRcdDxnIHNoaWZ0ZXI9J3t7Ojpbdm0ubWFyLmxlZnQsIHZtLm1hci50b3BdfX0nPlxuXHRcdFx0PHJlY3QgbmctYXR0ci13aWR0aD0ne3t2bS53aWR0aH19JyBuZy1hdHRyLWhlaWdodD0ne3t2bS5oZWlnaHR9fScgY2xhc3M9J2JhY2tncm91bmQnLz5cblx0XHRcdDxnIGhvci1heGlzLWRlciBoZWlnaHQ9J3ZtLmhlaWdodCcgc2NhbGU9J3ZtLlgnIGZ1bj0ndm0uYXhpc0Z1bicgc2hpZnRlcj0nWzAsdm0uaGVpZ2h0XSc+PC9nPlxuXHRcdFx0PGcgY2xhc3M9J2ctY2FydCc+XG5cdFx0XHRcdDxyZWN0IGNsYXNzPSdjYXJ0JyBuZy1hdHRyLXk9J3t7dm0uaGVpZ2h0LzN9fScgbmctYXR0ci13aWR0aD0ne3t2bS5oZWlnaHQvM319JyBuZy1hdHRyLWhlaWdodD0ne3t2bS5oZWlnaHQvM319Jy8+XG5cdFx0XHQ8L2c+XG5cdFx0PC9nPlxuXHQ8L3N2Zz5cbicnJ1xuXG5jbGFzcyBDdHJsXG5cdGNvbnN0cnVjdG9yOiAoQHNjb3BlLCBAZWwsIEB3aW5kb3cpLT5cblx0XHRAY2FydCA9IENhcnRcblx0XHRAbWFyID0gXG5cdFx0XHRsZWZ0OiAxMFxuXHRcdFx0cmlnaHQ6IDEwXG5cdFx0XHR0b3A6IDEwXG5cdFx0XHRib3R0b206IDE4XG5cdFx0QFggPSBkMy5zY2FsZS5saW5lYXIoKS5kb21haW4gWy0uMjUsNV0gXG5cdFx0c2VsICA9IGQzLnNlbGVjdCBAZWxbMF1cblx0XHRjYXJ0ID0gc2VsLnNlbGVjdCAnLmctY2FydCdcblxuXHRcdEBheGlzRnVuID0gZDMuc3ZnLmF4aXMoKVxuXHRcdFx0LnNjYWxlIEBYXG5cdFx0XHQudGlja3MgNVxuXHRcdFx0Lm9yaWVudCAnYm90dG9tJ1xuXG5cdFx0QHNjb3BlLiR3YXRjaCAndm0uY2FydC54JywgKHgpPT5cblx0XHRcdHhQeCA9IEBYKHgpXG5cdFx0XHRjYXJ0XG5cdFx0XHRcdC50cmFuc2l0aW9uKClcblx0XHRcdFx0LmR1cmF0aW9uIDE1XG5cdFx0XHRcdC5lYXNlICdsaW5lYXInXG5cdFx0XHRcdC5hdHRyICd0cmFuc2Zvcm0nLCBcInRyYW5zbGF0ZSgje3hQeH0sMClcIlxuXG5cdFx0YW5ndWxhci5lbGVtZW50IEB3aW5kb3dcblx0XHRcdC5vbiAncmVzaXplJyAsICgpPT5AcmVzaXplKClcblxuXHQjIEBwcm9wZXJ0eSBcblxuXHRAcHJvcGVydHkgJ3N2Z19oZWlnaHQnICwgZ2V0Oi0+IEBoZWlnaHQgKyBAbWFyLnRvcCArIEBtYXIuYm90dG9tXG5cblx0cmVzaXplOiAoKT0+XG5cdFx0QHdpZHRoID0gQGVsWzBdLmNsaWVudFdpZHRoIC0gQG1hci5sZWZ0IC0gQG1hci5yaWdodFxuXHRcdEBoZWlnaHQgPSBAd2lkdGgqLjMgLSBAbWFyLnRvcCAtIEBtYXIuYm90dG9tXG5cdFx0QFgucmFuZ2UoWzAsIEB3aWR0aF0pXG5cdFx0QHNjb3BlLiRldmFsQXN5bmMoKVxuXG5kZXIgPSAoKS0+XG5cdGRpcmVjdGl2ZSA9IFxuXHRcdHRlbXBsYXRlOiB0ZW1wbGF0ZVxuXHRcdHNjb3BlOiB7fVxuXHRcdHJlc3RyaWN0OiAnQSdcblx0XHRiaW5kVG9Db250cm9sbGVyOiB0cnVlXG5cdFx0dGVtcGxhdGVOYW1lc3BhY2U6ICdzdmcnXG5cdFx0Y29udHJvbGxlcjogWyckc2NvcGUnLCAnJGVsZW1lbnQnLCAnJHdpbmRvdycsIEN0cmxdXG5cdFx0Y29udHJvbGxlckFzOiAndm0nXG5cbm1vZHVsZS5leHBvcnRzID0gZGVyXG4iLCJhbmd1bGFyID0gcmVxdWlyZSAnYW5ndWxhcidcbmQzID0gcmVxdWlyZSAnZDMnXG5EYXRhID0gcmVxdWlyZSAnLi9wbG90RGF0YSdcbnJlcXVpcmUgJy4uLy4uL2hlbHBlcnMnXG50ZW1wbGF0ZSA9ICcnJ1xuXHQ8c3ZnIG5nLWluaXQ9J3ZtLnJlc2l6ZSgpJyB3aWR0aD0nMTAwJScgbmctYXR0ci1oZWlnaHQ9J3t7dm0uc3ZnX2hlaWdodH19Jz5cblx0XHQ8ZGVmcz5cblx0XHRcdDxjbGlwcGF0aCBpZD0ncGxvdEEnPlxuXHRcdFx0XHQ8cmVjdCBuZy1hdHRyLXdpZHRoPSd7e3ZtLndpZHRofX0nIG5nLWF0dHItaGVpZ2h0PSd7e3ZtLmhlaWdodH19Jz48L3JlY3Q+XG5cdFx0XHQ8L2NsaXBwYXRoPlxuXHRcdDwvZGVmcz5cblx0XHQ8ZyBjbGFzcz0nYm9pbGVycGxhdGUnIHNoaWZ0ZXI9J1t2bS5tYXIubGVmdCwgdm0ubWFyLnRvcF0nPlxuXHRcdFx0PHJlY3QgY2xhc3M9J2JhY2tncm91bmQnIG5nLWF0dHItd2lkdGg9J3t7dm0ud2lkdGh9fScgbmctYXR0ci1oZWlnaHQ9J3t7dm0uaGVpZ2h0fX0nIGJlaGF2aW9yPSd2bS5kcmFnX3JlY3QnPjwvcmVjdD5cblx0XHRcdDxnIHZlci1heGlzLWRlciB3aWR0aD0ndm0ud2lkdGgnIHNjYWxlPSd2bS5WJyBmdW49J3ZtLnZlckF4RnVuJz48L2c+XG5cdFx0XHQ8ZyBob3ItYXhpcy1kZXIgaGVpZ2h0PSd2bS5oZWlnaHQnIHNjYWxlPSd2bS5UJyBmdW49J3ZtLmhvckF4RnVuJyBzaGlmdGVyPSdbMCx2bS5oZWlnaHRdJz48L2c+XG5cdFx0PC9nPlxuXHRcdDxnIGNsYXNzPSdtYWluJyBjbGlwLXBhdGg9XCJ1cmwoI3Bsb3RBKVwiIHNoaWZ0ZXI9J1t2bS5tYXIubGVmdCwgdm0ubWFyLnRvcF0nPlxuXHRcdFx0PHBhdGggbmctYXR0ci1kPSd7e3ZtLmxpbmVGdW4odm0uRGF0YS5kb3RzKX19JyBjbGFzcz0nZnVuIHknPjwvcGF0aD5cblx0XHRcdDxnIG5nLXJlcGVhdD0nZG90IGluIHZtLkRhdGEuZG90cyB0cmFjayBieSBkb3QuaWQnIGRhdHVtPWRvdCBzaGlmdGVyPSdbdm0uVChkb3QudCksdm0uVihkb3QudildJyBiZWhhdmlvcj0ndm0uZHJhZycgZG90LWRlcj5cblx0XHRcdDwvZz5cblx0XHQ8L2c+XG5cdDwvc3ZnPlxuJycnXG5cdFx0XHQjIDxwYXRoIGNsYXNzPSdmdW4geScgbGluZS1kZXIgd2F0Y2g9J3ZtLndhdGNoJyBkYXRhPSd2bS5kb3RzJyBsaW5lLWZ1bj0ndm0ubGluZUZ1bic+PC9wYXRoPlxuXG5jbGFzcyBDdHJsXG5cdGNvbnN0cnVjdG9yOiAoQHNjb3BlLCBAZWwsIEB3aW5kb3cpLT5cblx0XHRAbWFyID0gXG5cdFx0XHRsZWZ0OiAzMFxuXHRcdFx0dG9wOiAyMFxuXHRcdFx0cmlnaHQ6IDIwXG5cdFx0XHRib3R0b206IDMwXG5cblx0XHRAViA9IGQzLnNjYWxlLmxpbmVhcigpLmRvbWFpbiBbMCw0XVxuXG5cdFx0QFQgPSBkMy5zY2FsZS5saW5lYXIoKS5kb21haW4gWzAsOF1cblxuXHRcdEBEYXRhID0gRGF0YVxuXG5cdFx0QGhvckF4RnVuID0gZDMuc3ZnLmF4aXMoKVxuXHRcdFx0LnNjYWxlIEBUXG5cdFx0XHQudGlja3MgNVxuXHRcdFx0Lm9yaWVudCAnYm90dG9tJ1xuXG5cdFx0QHZlckF4RnVuID0gZDMuc3ZnLmF4aXMoKVxuXHRcdFx0LnNjYWxlIEBWXG5cdFx0XHQudGlja3MgNVxuXHRcdFx0Lm9yaWVudCAnbGVmdCdcblx0XHRcblx0XHRAbGluZUZ1biA9IGQzLnN2Zy5saW5lKClcblx0XHRcdC55IChkKT0+IEBWIGQudlxuXHRcdFx0LnggKGQpPT4gQFQgZC50XG5cblx0XHRAZHJhZ19yZWN0ID0gZDMuYmVoYXZpb3IuZHJhZygpXG5cdFx0XHQub24gJ2RyYWdzdGFydCcsICgpPT5cblx0XHRcdFx0ZXZlbnQuc3RvcFByb3BhZ2F0aW9uKClcblx0XHRcdFx0aWYgZXZlbnQud2hpY2ggaXMgM1xuXHRcdFx0XHRcdHJldHVybiBldmVudC5wcmV2ZW50RGVmYXVsdCgpXG5cdFx0XHRcdHJlY3QgPSBldmVudC50b0VsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KClcblx0XHRcdFx0dCA9IEBULmludmVydCBldmVudC54IC0gcmVjdC5sZWZ0XG5cdFx0XHRcdHYgID0gQFYuaW52ZXJ0IGV2ZW50LnkgLSByZWN0LnRvcFxuXHRcdFx0XHREYXRhLmFkZF9kb3QgdCAsIHZcblx0XHRcdFx0QHNjb3BlLiRldmFsQXN5bmMoKVxuXHRcdFx0Lm9uICdkcmFnJywgPT4gQG9uX2RyYWcoRGF0YS5zZWxlY3RlZClcblxuXHRcdEBkcmFnID0gZDMuYmVoYXZpb3IuZHJhZygpXG5cdFx0XHQub24gJ2RyYWdzdGFydCcsIChkb3QpPT5cblx0XHRcdFx0ZXZlbnQuc3RvcFByb3BhZ2F0aW9uKClcblx0XHRcdFx0aWYgZXZlbnQud2hpY2ggaXMgM1xuXHRcdFx0XHRcdERhdGEucmVtb3ZlX2RvdCBkb3Rcblx0XHRcdFx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpXG5cdFx0XHRcdFx0QHNjb3BlLiRldmFsQXN5bmMoKVxuXHRcdFx0Lm9uICdkcmFnJywgQG9uX2RyYWdcblxuXHRcdGFuZ3VsYXIuZWxlbWVudCBAd2luZG93XG5cdFx0XHQub24gJ3Jlc2l6ZScsIEByZXNpemVcblxuXHRAcHJvcGVydHkgJ3N2Z19oZWlnaHQnLCBnZXQ6IC0+IEBoZWlnaHQgKyBAbWFyLnRvcCArIEBtYXIuYm90dG9tXG5cblx0b25fZHJhZzogKGRvdCk9PiBcblx0XHRcdGlmIGV2ZW50LndoaWNoIGlzIDNcblx0XHRcdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKVxuXHRcdFx0XHRyZXR1cm5cblx0XHRcdERhdGEudXBkYXRlX2RvdCBkb3QsIEBULmludmVydChkMy5ldmVudC54KSwgQFYuaW52ZXJ0KGQzLmV2ZW50LnkpXG5cdFx0XHRAc2NvcGUuJGV2YWxBc3luYygpXG5cblx0cmVzaXplOiAoKT0+XG5cdFx0QHdpZHRoID0gQGVsWzBdLmNsaWVudFdpZHRoIC0gQG1hci5sZWZ0IC0gQG1hci5yaWdodFxuXHRcdEBoZWlnaHQgPSBAd2lkdGggKiAuN1xuXHRcdEBWLnJhbmdlIFtAaGVpZ2h0LCAwXVxuXHRcdEBULnJhbmdlIFswLCBAd2lkdGhdXG5cdFx0QHNjb3BlLiRldmFsQXN5bmMoKVxuXG5cbmRlciA9ICgpLT5cblx0ZGlyZWN0aXZlID0gXG5cdFx0Y29udHJvbGxlckFzOiAndm0nXG5cdFx0c2NvcGU6IHt9XG5cdFx0dGVtcGxhdGU6IHRlbXBsYXRlXG5cdFx0dGVtcGxhdGVOYW1lc3BhY2U6ICdzdmcnXG5cdFx0Y29udHJvbGxlcjogWyckc2NvcGUnLCckZWxlbWVudCcsICckd2luZG93JywgQ3RybF1cblxubW9kdWxlLmV4cG9ydHMgPSBkZXJcbiIsIkRhdGEgPSByZXF1aXJlICcuL3Bsb3REYXRhJ1xuYW5ndWxhciA9IHJlcXVpcmUgJ2FuZ3VsYXInXG5kMyA9IHJlcXVpcmUgJ2QzJ1xucmVxdWlyZSAnLi4vLi4vaGVscGVycydcblxudGVtcGxhdGUgPSAnJydcblx0PHN2ZyBuZy1pbml0PSd2bS5yZXNpemUoKScgIHdpZHRoPScxMDAlJyBuZy1hdHRyLWhlaWdodD0ne3t2bS5zdmdfaGVpZ2h0fX0nPlxuXHRcdDxkZWZzPlxuXHRcdFx0PGNsaXBwYXRoIGlkPSdwbG90Qic+XG5cdFx0XHRcdDxyZWN0IG5nLWF0dHItd2lkdGg9J3t7dm0ud2lkdGh9fScgbmctYXR0ci1oZWlnaHQ9J3t7dm0uaGVpZ2h0fX0nPjwvcmVjdD5cblx0XHRcdDwvY2xpcHBhdGg+XG5cdFx0PC9kZWZzPlxuXHRcdDxnIGNsYXNzPSdib2lsZXJwbGF0ZScgc2hpZnRlcj0nW3ZtLm1hci5sZWZ0LCB2bS5tYXIudG9wXSc+XG5cdFx0XHQ8cmVjdCBjbGFzcz0nYmFja2dyb3VuZCcgbmctYXR0ci13aWR0aD0ne3t2bS53aWR0aH19JyBuZy1hdHRyLWhlaWdodD0ne3t2bS5oZWlnaHR9fSc+PC9yZWN0PlxuXHRcdFx0PGcgdmVyLWF4aXMtZGVyIHdpZHRoPSd2bS53aWR0aCcgc2NhbGU9J3ZtLkRWJyBmdW49J3ZtLnZlckF4RnVuJz48L2c+XG5cdFx0XHQ8ZyBob3ItYXhpcy1kZXIgaGVpZ2h0PSd2bS5oZWlnaHQnIHNjYWxlPSd2bS5WJyBmdW49J3ZtLmhvckF4RnVuJyBzaGlmdGVyPSdbMCx2bS5oZWlnaHRdJz48L2c+XG5cdFx0PC9nPlxuXHRcdDxnIGNsYXNzPSdtYWluJyBjbGlwLXBhdGg9XCJ1cmwoI3Bsb3RCKVwiIHNoaWZ0ZXI9J1t2bS5tYXIubGVmdCwgdm0ubWFyLnRvcF0nPlxuXHRcdFx0PHBhdGggbmctYXR0ci1kPSd7e3ZtLmxpbmVGdW4odm0uRGF0YS5kb3RzKX19JyBjbGFzcz0nZnVuIGR5Jy8+XG5cdFx0XHQ8ZyBuZy1yZXBlYXQ9J2RvdCBpbiB2bS5EYXRhLmRvdHMgdHJhY2sgYnkgZG90LmlkJyBkYXR1bT1kb3Qgc2hpZnRlcj0nW3ZtLlYoZG90LnYpLHZtLkRWKGRvdC5kdildJyBkb3QtZGVyPlxuXHRcdFx0PC9nPlxuXHRcdFx0PHBhdGggbmctYXR0ci1kPSd7e3ZtLmxpbmVGdW4odm0uRGF0YS50YXJnZXRfZGF0YSl9fScgY2xhc3M9J2Z1biB0YXJnZXQnIC8+XG5cdFx0PC9nPlxuXHQ8L3N2Zz5cbicnJ1xuXG5jbGFzcyBDdHJsXG5cdGNvbnN0cnVjdG9yOiAoQHNjb3BlLCBAZWwsIEB3aW5kb3cpLT5cblx0XHRAbWFyID0gXG5cdFx0XHRsZWZ0OiAzMFxuXHRcdFx0dG9wOiAyMFxuXHRcdFx0cmlnaHQ6IDIwXG5cdFx0XHRib3R0b206IDMwXG5cblx0XHRARFYgPSBkMy5zY2FsZS5saW5lYXIoKS5kb21haW4gWy00LCAwXVxuXG5cdFx0QFYgPSBkMy5zY2FsZS5saW5lYXIoKS5kb21haW4gWzAsNF1cblxuXHRcdEBob3JBeEZ1biA9IGQzLnN2Zy5heGlzKClcblx0XHRcdC5zY2FsZSBAVlxuXHRcdFx0LnRpY2tzIDRcblx0XHRcdC5vcmllbnQgJ2JvdHRvbSdcblxuXHRcdEB2ZXJBeEZ1biA9IGQzLnN2Zy5heGlzKClcblx0XHRcdC5zY2FsZSBARFZcblx0XHRcdCMgLnRpY2tGb3JtYXQgZDMuZm9ybWF0KCcuMGQnKVxuXHRcdFx0IyAudGlja1ZhbHVlcyBARFYudGlja3MoMylcblx0XHRcdC5vcmllbnQgJ2xlZnQnXG5cblx0XHRARGF0YSA9IERhdGFcblxuXHRcdEBsaW5lRnVuID0gZDMuc3ZnLmxpbmUoKVxuXHRcdFx0LnkgKGQpPT4gQERWIGQuZHZcblx0XHRcdC54IChkKT0+IEBWIGQudlxuXG5cdFx0YW5ndWxhci5lbGVtZW50IEB3aW5kb3dcblx0XHRcdC5vbiAncmVzaXplJywgQHJlc2l6ZVxuXG5cdEBwcm9wZXJ0eSAnc3ZnX2hlaWdodCcsIGdldDogLT4gQGhlaWdodCArIEBtYXIudG9wICsgQG1hci5ib3R0b21cblxuXHRyZXNpemU6ICgpPT5cblx0XHRAd2lkdGggPSBAZWxbMF0uY2xpZW50V2lkdGggLSBAbWFyLmxlZnQgLSBAbWFyLnJpZ2h0XG5cdFx0QGhlaWdodCA9IEB3aWR0aCAqIC43XG5cdFx0QERWLnJhbmdlIFtAaGVpZ2h0LCAwXVxuXHRcdEBWLnJhbmdlIFswLCBAd2lkdGhdIFxuXHRcdEBzY29wZS4kZXZhbEFzeW5jKClcblxuXG5kZXIgPSAoKS0+XG5cdGRpcmVjdGl2ZSA9IFxuXHRcdGNvbnRyb2xsZXJBczogJ3ZtJ1xuXHRcdHNjb3BlOiB7fVxuXHRcdHRlbXBsYXRlOiB0ZW1wbGF0ZVxuXHRcdHRlbXBsYXRlTmFtZXNwYWNlOiAnc3ZnJ1xuXHRcdGNvbnRyb2xsZXI6IFsnJHNjb3BlJywnJGVsZW1lbnQnLCckd2luZG93JywgQ3RybF1cblxubW9kdWxlLmV4cG9ydHMgPSBkZXJcbiIsIl8gPSByZXF1aXJlICdsb2Rhc2gnXG57ZXhwLCBzcXJ0LCBhdGFuLCBtaW59ID0gTWF0aFxuXG5jbGFzcyBEb3Rcblx0Y29uc3RydWN0b3I6IChAdCwgQHYpLT5cblx0XHRAaWQgPSBfLnVuaXF1ZUlkICdkb3QnIFxuXG5jbGFzcyBTZXJ2aWNlXG5cdGNvbnN0cnVjdG9yOiAoKS0+XG5cdFx0QGRvdHMgPSBbXVxuXHRcdEBzZWxlY3RlZCA9IHVuZGVmaW5lZFxuXG5cdFx0QHRhcmdldF9kYXRhID0gXy5yYW5nZSAwLCA4LCAxLzUwXG5cdFx0XHQubWFwICh0KS0+IFxuXHRcdFx0XHRyZXMgID0gXG5cdFx0XHRcdFx0dDogdFxuXHRcdFx0XHRcdHY6IDQqIGV4cCgtdClcblx0XHRcdFx0XHRkdjogLTQgKiBleHAoLXQpXG5cblx0YWRkX2RvdDogKHQsIHYpLT5cblx0XHRAc2VsZWN0ZWQgPSBuZXcgRG90IHQsdlxuXHRcdEBkb3RzLnB1c2ggQHNlbGVjdGVkXG5cdFx0QHVwZGF0ZV9kb3QoQHNlbGVjdGVkLCB0LCB2KVxuXG5cdHJlbW92ZV9kb3Q6IChkb3QpLT5cblx0XHRAZG90cy5zcGxpY2UoQGRvdHMuaW5kZXhPZihkb3QpLCAxKVxuXG5cdHVwZGF0ZV9kb3RzOiAoKS0+IFxuXHRcdEBkb3RzLnNvcnQgKGEsYiktPiBhLnQgLSBiLnRcblx0XHRAZG90cy5mb3JFYWNoIChkb3QsIGksIGspLT5cblx0XHRcdHByZXYgPSBrW2ktMV1cblx0XHRcdGRvdC5kdiA9IGlmIHByZXYgdGhlbiBtaW4oMTAwLChkb3QudiAtIHByZXYudikvKGRvdC50IC0gcHJldi50KSkgZWxzZSAwXG5cblx0dXBkYXRlX2RvdDogKGRvdCwgdCwgdiktPlxuXHRcdGRvdC50ID0gdFxuXHRcdGRvdC52ID0gdlxuXHRcdEB1cGRhdGVfZG90cygpXG5cbnNlcnZpY2UgPSBuZXcgU2VydmljZVxuXG5tb2R1bGUuZXhwb3J0cyA9IHNlcnZpY2UiLCJkcmFnID0gKCRwYXJzZSktPlxuXHRkaXJlY3RpdmUgPSBcblx0XHRsaW5rOiAoc2NvcGUsZWwsYXR0ciktPlxuXHRcdFx0c2VsID0gZDMuc2VsZWN0KGVsWzBdKVxuXHRcdFx0c2VsLmNhbGwoJHBhcnNlKGF0dHIuYmVoYXZpb3IpKHNjb3BlKSlcblxubW9kdWxlLmV4cG9ydHMgPSBkcmFnIiwibW9kdWxlLmV4cG9ydHMgPSAoJHBhcnNlKS0+XG5cdChzY29wZSwgZWwsIGF0dHIpLT5cblx0XHRkMy5zZWxlY3QoZWxbMF0pLmRhdHVtICRwYXJzZShhdHRyLmRhdHVtKShzY29wZSkiLCJcbnRlbXBsYXRlID0gJycnXG5cdDxjaXJjbGUgY2xhc3M9J2RvdCBsYXJnZSc+PC9jaXJjbGU+XG5cdDxjaXJjbGUgY2xhc3M9J2RvdCBzbWFsbCcgcj0nNCc+PC9jaXJjbGU+XG4nJydcblxuZGVyID0gKCktPlxuXHRkaXJlY3RpdmUgPSBcblx0XHR0ZW1wbGF0ZTogdGVtcGxhdGVcblx0XHRyZXN0cmljdDogJ0EnXG5cdFx0bGluazogKHNjb3BlLGVsLGF0dHIpLT5cblx0XHRcdHJhZCA9IDEwICN0aGUgcmFkaXVzIG9mIHRoZSBsYXJnZSBjaXJjbGUgbmF0dXJhbGx5XG5cdFx0XHRzZWwgPSBkMy5zZWxlY3QgZWxbMF1cblx0XHRcdGJpZyA9IHNlbC5zZWxlY3QgJ2NpcmNsZS5kb3QubGFyZ2UnXG5cdFx0XHRcdC5hdHRyICdyJywgcmFkXG5cdFx0XHRtb3VzZW92ZXIgPSAoKS0+XG5cdFx0XHRcdGJpZy50cmFuc2l0aW9uICdncm93J1xuXHRcdFx0XHQuZHVyYXRpb24gMTUwXG5cdFx0XHRcdC5lYXNlICdjdWJpYy1vdXQnXG5cdFx0XHRcdC5hdHRyICdyJyAsIHJhZCAqIDEuNVxuXHRcdFx0XHQudHJhbnNpdGlvbigpXG5cdFx0XHRcdC5kdXJhdGlvbiAxNTBcblx0XHRcdFx0LmVhc2UgJ2N1YmljLWluJ1xuXHRcdFx0XHQuYXR0ciAncicgLCByYWQgKiAxLjNcblx0XHRcdFx0XG5cdFx0XHRtb3VzZW92ZXIoKVxuXG5cdFx0XHRiaWcub24gJ21vdXNlb3ZlcicsIG1vdXNlb3ZlclxuXHRcdFx0Lm9uICdjb250ZXh0bWVudScsIC0+IGV2ZW50LnByZXZlbnREZWZhdWx0KClcblx0XHRcdC5vbiAnbW91c2Vkb3duJywgLT5cblx0XHRcdFx0YmlnLnRyYW5zaXRpb24gJ2dyb3cnXG5cdFx0XHRcdFx0LmR1cmF0aW9uIDE1MFxuXHRcdFx0XHRcdC5lYXNlICdjdWJpYydcblx0XHRcdFx0XHQuYXR0ciAncicsIHJhZCoxLjdcblx0XHRcdC5vbiAnbW91c2V1cCcsICgpLT5cblx0XHRcdFx0YmlnLnRyYW5zaXRpb24gJ2dyb3cnXG5cdFx0XHRcdFx0LmR1cmF0aW9uIDE1MFxuXHRcdFx0XHRcdC5lYXNlICdjdWJpYy1pbidcblx0XHRcdFx0XHQuYXR0ciAncicsIHJhZCoxLjNcblx0XHRcdC5vbiAnbW91c2VvdXQnICwgKCktPlxuXHRcdFx0XHRiaWcudHJhbnNpdGlvbiAnc2hyaW5rJ1xuXHRcdFx0XHRcdC5kdXJhdGlvbiAzNTBcblx0XHRcdFx0XHQuZWFzZSAnYm91bmNlLW91dCdcblx0XHRcdFx0XHQuYXR0ciAncicgLCByYWRcblxuXG5tb2R1bGUuZXhwb3J0cyA9IGRlclxuIiwiZDMgPSByZXF1aXJlICdkMydcbntlbGVtZW50fT0gcmVxdWlyZSAnYW5ndWxhcidcblxuZGVyID0gKCktPiAjZ29lcyBvbiBhIHBhdGggZWxlbWVudFxuXHRkaXJlY3RpdmUgPSBcblx0XHRjb250cm9sbGVyOiAoKS0+XG5cdFx0Y29udHJvbGxlckFzOiAndm0nXG5cdFx0YmluZFRvQ29udHJvbGxlcjogdHJ1ZVxuXHRcdHJlc3RyaWN0OiAnQSdcblx0XHR0ZW1wbGF0ZU5hbWVzcGFjZTogJ3N2Zydcblx0XHRzY29wZTpcblx0XHRcdGRhdGE6ICc9J1xuXHRcdFx0bGluZUZ1bjogJz0nXG5cdFx0XHR3YXRjaDogJz0nXG5cdFx0bGluazogKHNjb3BlLCBlbCwgYXR0ciwgdm0pLT5cblx0XHRcdHNlbCA9IGQzLnNlbGVjdChlbFswXSlcblx0XHRcdHVwZGF0ZSA9ICgpLT4gXG5cdFx0XHRcdHNlbC5hdHRyICdkJywgdm0ubGluZUZ1biB2bS5kYXRhXG5cblx0XHRcdHNjb3BlLiR3YXRjaCAndm0ud2F0Y2gnXG5cdFx0XHRcdCwgdXBkYXRlXG5cdFx0XHRcdCwgdHJ1ZVxuXHRcdFx0ZWxlbWVudCh3aW5kb3cpLm9uICdyZXNpemUnLCB1cGRhdGVcblxubW9kdWxlLmV4cG9ydHMgPSBkZXIiLCJkMyA9IHJlcXVpcmUgJ2QzJ1xuXG5kZXIgPSAoJHBhcnNlKS0+XG5cdGRpcmVjdGl2ZSA9XG5cdFx0bGluazogKHNjb3BlLCBlbCwgYXR0ciktPlxuXHRcdFx0cmVzaGlmdCA9ICh2KS0+IFxuXHRcdFx0XHRkMy5zZWxlY3QgZWxbMF1cblx0XHRcdFx0XHQuYXR0ciAndHJhbnNmb3JtJyAsIFwidHJhbnNsYXRlKCN7dlswXX0sI3t2WzFdfSlcIlxuXG5cdFx0XHRzY29wZS4kd2F0Y2ggKCktPlxuXHRcdFx0XHRcdCRwYXJzZShhdHRyLnNoaWZ0ZXIpKHNjb3BlKVxuXHRcdFx0XHQsIHJlc2hpZnRcblx0XHRcdFx0LCB0cnVlXG5cbm1vZHVsZS5leHBvcnRzID0gZGVyIiwiZDMgPSByZXF1aXJlICdkMydcbmFuZ3VsYXIgPSByZXF1aXJlICdhbmd1bGFyJ1xuXG5kZXIgPSAoJHdpbmRvdyktPlxuXHRkaXJlY3RpdmUgPSBcblx0XHRjb250cm9sbGVyOiBhbmd1bGFyLm5vb3Bcblx0XHRjb250cm9sbGVyQXM6ICd2bSdcblx0XHRiaW5kVG9Db250cm9sbGVyOiB0cnVlXG5cdFx0cmVzdHJpY3Q6ICdBJ1xuXHRcdHRlbXBsYXRlTmFtZXNwYWNlOiAnc3ZnJ1xuXHRcdHNjb3BlOiBcblx0XHRcdHNjYWxlOiAnPSdcblx0XHRcdGhlaWdodDogJz0nXG5cdFx0XHRmdW46ICc9J1xuXHRcdGxpbms6IChzY29wZSwgZWwsIGF0dHIsIHZtKS0+XG5cdFx0XHR4QXhpc0Z1biA9IHZtLmZ1biA/IChkMy5zdmcuYXhpcygpXG5cdFx0XHRcdFx0XHRcdC5zY2FsZSB2bS5zY2FsZVxuXHRcdFx0XHRcdFx0XHQub3JpZW50ICdib3R0b20nKVxuXG5cdFx0XHRzZWwgPSBkMy5zZWxlY3QgZWxbMF1cblx0XHRcdFx0LmNsYXNzZWQgJ3ggYXhpcycsIHRydWVcblxuXHRcdFx0dXBkYXRlID0gKCk9PlxuXHRcdFx0XHR4QXhpc0Z1bi50aWNrU2l6ZSAtdm0uaGVpZ2h0XG5cdFx0XHRcdHNlbC5jYWxsIHhBeGlzRnVuXG5cdFx0XHRcdFxuXHRcdFx0dXBkYXRlKClcblx0XHRcdFx0XG5cdFx0XHRzY29wZS4kd2F0Y2ggJ3ZtLnNjYWxlLmRvbWFpbigpJywgdXBkYXRlICwgdHJ1ZVxuXHRcdFx0c2NvcGUuJHdhdGNoICd2bS5oZWlnaHQnLCB1cGRhdGUgLCB0cnVlXG5cblx0XHRcdGFuZ3VsYXIuZWxlbWVudCAkd2luZG93XG5cdFx0XHRcdC5vbiAncmVzaXplJywgdXBkYXRlXG5cbm1vZHVsZS5leHBvcnRzID0gZGVyIiwiZDMgPSByZXF1aXJlICdkMydcbmFuZ3VsYXIgPSByZXF1aXJlICdhbmd1bGFyJ1xuXG5kZXIgPSAoJHdpbmRvdyktPlxuXHRkaXJlY3RpdmUgPSBcblx0XHRjb250cm9sbGVyOiBhbmd1bGFyLm5vb3Bcblx0XHRjb250cm9sbGVyQXM6ICd2bSdcblx0XHRiaW5kVG9Db250cm9sbGVyOiB0cnVlXG5cdFx0cmVzdHJpY3Q6ICdBJ1xuXHRcdHRlbXBsYXRlTmFtZXNwYWNlOiAnc3ZnJ1xuXHRcdHNjb3BlOiBcblx0XHRcdHNjYWxlOiAnPSdcblx0XHRcdHdpZHRoOiAnPSdcblx0XHRcdGF4aXNGdW46ICc9J1xuXHRcdGxpbms6IChzY29wZSwgZWwsIGF0dHIsIHZtKS0+XG5cdFx0XHR5QXhpc0Z1biA9IHZtLmF4aXNGdW4gPyBkMy5zdmcuYXhpcygpXG5cdFx0XHRcdC5zY2FsZSB2bS5zY2FsZVxuXHRcdFx0XHQub3JpZW50ICdsZWZ0J1xuXG5cdFx0XHRzZWwgPSBkMy5zZWxlY3QoZWxbMF0pLmNsYXNzZWQoJ3kgYXhpcycsIHRydWUpXG5cblx0XHRcdHVwZGF0ZSA9ICgpPT5cblx0XHRcdFx0eUF4aXNGdW4udGlja1NpemUoIC12bS53aWR0aClcblx0XHRcdFx0c2VsLmNhbGwoeUF4aXNGdW4pXG5cblx0XHRcdHVwZGF0ZSgpXG5cdFx0XHRcdFxuXHRcdFx0c2NvcGUuJHdhdGNoICd2bS5zY2FsZS5kb21haW4oKScsIHVwZGF0ZSAsIHRydWVcblx0XHRcdHNjb3BlLiR3YXRjaCAndm0ud2lkdGgnLCB1cGRhdGVcblxubW9kdWxlLmV4cG9ydHMgPSBkZXIiLCIndXNlIHN0cmljdCdcblxubW9kdWxlLmV4cG9ydHMudGltZW91dCA9IChmdW4sIHRpbWUpLT5cblx0XHRkMy50aW1lcigoKT0+XG5cdFx0XHRmdW4oKVxuXHRcdFx0dHJ1ZVxuXHRcdCx0aW1lKVxuXG5cbkZ1bmN0aW9uOjpwcm9wZXJ0eSA9IChwcm9wLCBkZXNjKSAtPlxuICBPYmplY3QuZGVmaW5lUHJvcGVydHkgQHByb3RvdHlwZSwgcHJvcCwgZGVzYyJdfQ==
