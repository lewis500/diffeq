(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';
var angular, app, behavior, cartButtonsDer, cartPlotDer, d3, datum, derivativeDer, dotBDer, dotDer, horAxis, lineDer, looper, material, plotADer, plotBDer, regularDer, shifter, verAxis;

angular = require('angular');

d3 = require('d3');

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

regularDer = require('./components/regular/regular');

derivativeDer = require('./components/derivative/derivative');

dotBDer = require('./directives/dotB');

app = angular.module('mainApp', [material]).directive('horAxisDer', horAxis).directive('verAxisDer', verAxis).directive('cartPlotDer', cartPlotDer).directive('cartButtonsDer', cartButtonsDer).directive('shifter', shifter).directive('plotADer', plotADer).directive('behavior', behavior).directive('dotDer', dotDer).directive('datum', datum).directive('lineDer', lineDer).directive('plotBDer', plotBDer).directive('regularDer', regularDer).directive('derivativeDer', derivativeDer).directive('dotBDer', dotBDer);

looper = function() {
  return setTimeout(function() {
    d3.selectAll('circle.dot.large').transition('grow').duration(500).ease('cubic-out').attr('transform', 'scale( 1.34)').transition('shrink').duration(500).ease('cubic-out').attr('transform', 'scale( 1.0)');
    return looper();
  }, 1000);
};

looper();



},{"./components/cart/cartButtons":2,"./components/cart/cartPlot":4,"./components/derivative/derivative":5,"./components/plot/plotA":6,"./components/plot/plotB":7,"./components/regular/regular":9,"./directives/behavior":10,"./directives/datum":11,"./directives/dot":12,"./directives/dotB":13,"./directives/line":14,"./directives/shifter":15,"./directives/xAxis":16,"./directives/yAxis":17,"angular":undefined,"angular-material":undefined,"d3":undefined}],2:[function(require,module,exports){
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



},{"../../helpers":18,"./cartData":3,"d3":undefined,"lodash":undefined}],5:[function(require,module,exports){
var _, angular, d3, der, math, template, triCtrl,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

angular = require('angular');

d3 = require('d3');

require('../../helpers');

math = require('mathjs');

_ = require('lodash');

template = '<svg ng-init=\'vm.resize()\' width=\'100%\' ng-attr-height=\'{{vm.svg_height}}\'>\n	<defs>\n		<clippath id=\'reg\'>\n			<rect ng-attr-width=\'{{vm.width}}\' ng-attr-height=\'{{vm.height}}\'></rect>\n		</clippath>\n	</defs>\n	<g class=\'boilerplate\' shifter=\'[vm.mar.left, vm.mar.top]\'>\n		<rect class=\'background\' ng-attr-width=\'{{vm.width}}\' ng-attr-height=\'{{vm.height}}\' ng-mousemove=\'vm.move($event)\' />\n		<g ver-axis-der width=\'vm.width\' scale=\'vm.V\' fun=\'vm.verAxFun\'></g>\n		<g hor-axis-der height=\'vm.height\' scale=\'vm.T\' fun=\'vm.horAxFun\' shifter=\'[0,vm.height]\'></g>\n	</g>\n	<g class=\'main\' clip-path="url(#reg)" shifter=\'[vm.mar.left, vm.mar.top]\'>\n		<line class=\'zero-line\' x1=\'0\' ng-attr-x2=\'{{vm.width}}\' ng-attr-y1=\'{{vm.V(0)}}\' ng-attr-y2=\'{{vm.V(0)}}\' />\n		<path ng-attr-d=\'{{vm.lineFun(vm.data)}}\' class=\'fun v\' />\n		<path ng-attr-d=\'{{vm.triangleData()}}\' class=\'tri\' />\n		<path ng-attr-d=\'{{vm.lineFun([vm.point, {v: vm.point.dv + vm.point.v, t: vm.point.t}])}}\' class=\'fun dv\' />\n		<path ng-attr-d=\'{{vm.lineFun([{v: vm.point.dv, t: vm.point.t}, {v: 0, t: vm.point.t}])}}\' class=\'fun dv\' style=\'opacity: .4;\'/>\n		<path ng-attr-d=\'{{vm.lineFun2(vm.data)}}\' class=\'fun dv\' style=\'opacity: .3\' />\n		<circle r=\'3px\'  shifter=\'[vm.T(vm.point.t), vm.V(vm.point.v)]\' class=\'point\'/>\n	</g>\n</svg>';

triCtrl = (function() {
  function triCtrl(scope, el, window) {
    var dv, parser, v;
    this.scope = scope;
    this.el = el;
    this.window = window;
    this.resize = bind(this.resize, this);
    this.mar = {
      left: 30,
      top: 20,
      right: 20,
      bottom: 25
    };
    this.V = d3.scale.linear().domain([-2, 2]);
    this.T = d3.scale.linear().domain([0, 8]);
    this.horAxFun = d3.svg.axis().scale(this.T).orient('bottom');
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
    this.lineFun2 = d3.svg.line().y((function(_this) {
      return function(d) {
        return _this.V(d.dv);
      };
    })(this)).x((function(_this) {
      return function(d) {
        return _this.T(d.t);
      };
    })(this));
    parser = math.parser();
    parser["eval"]('v(t) = sin(t)');
    parser["eval"]('dv(t) = cos(t)');
    v = parser.get('v');
    dv = parser.get('dv');
    this.data = _.range(0, 8, 1 / 50).map(function(t) {
      var res;
      return res = {
        dv: dv(t),
        v: v(t),
        t: t
      };
    });
    this.point = _.sample(this.data);
    angular.element(this.window).on('resize', this.resize);
    this.move = (function(_this) {
      return function(event) {
        var rect, t;
        rect = event.target.getBoundingClientRect();
        t = _this.T.invert(event.x - rect.left);
        _this.point = {
          t: t,
          v: v(t),
          dv: dv(t)
        };
        return _this.scope.$evalAsync();
      };
    })(this);
  }

  triCtrl.property('svg_height', {
    get: function() {
      return this.height + this.mar.top + this.mar.bottom;
    }
  });

  triCtrl.prototype.triangleData = function() {
    return this.lineFun([
      {
        v: this.point.v,
        t: this.point.t
      }, {
        v: this.point.dv + this.point.v,
        t: this.point.t + 1
      }, {
        v: this.point.dv + this.point.v,
        t: this.point.t
      }
    ]);
  };

  triCtrl.prototype.resize = function() {
    this.width = this.el[0].clientWidth - this.mar.left - this.mar.right;
    this.height = this.el[0].parentElement.clientHeight - this.mar.left - this.mar.right;
    this.V.range([this.height, 0]);
    this.T.range([0, this.width]);
    return this.scope.$evalAsync();
  };

  return triCtrl;

})();

der = function() {
  var directive;
  return directive = {
    controllerAs: 'vm',
    scope: {},
    template: template,
    templateNamespace: 'svg',
    controller: ['$scope', '$element', '$window', triCtrl]
  };
};

module.exports = der;



},{"../../helpers":18,"angular":undefined,"d3":undefined,"lodash":undefined,"mathjs":undefined}],6:[function(require,module,exports){
var Ctrl, Data, angular, d3, der, template,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

angular = require('angular');

d3 = require('d3');

Data = require('./plotData');

require('../../helpers');

template = '<h3>Plot A</h3>\n<svg ng-init=\'vm.resize()\' width=\'100%\' ng-attr-height=\'{{vm.svg_height}}\'>\n	<defs>\n		<clippath id=\'plotA\'>\n			<rect ng-attr-width=\'{{vm.width}}\' ng-attr-height=\'{{vm.height}}\'></rect>\n		</clippath>\n	</defs>\n	<g class=\'boilerplate\' shifter=\'[vm.mar.left, vm.mar.top]\'>\n		<rect class=\'background\' ng-attr-width=\'{{vm.width}}\' ng-attr-height=\'{{vm.height}}\' behavior=\'vm.drag_rect\'></rect>\n		<g ver-axis-der width=\'vm.width\' scale=\'vm.V\' fun=\'vm.verAxFun\'></g>\n		<g hor-axis-der height=\'vm.height\' scale=\'vm.T\' fun=\'vm.horAxFun\' shifter=\'[0,vm.height]\'></g>\n	</g>\n	<g class=\'main\' clip-path="url(#plotA)" shifter=\'[vm.mar.left, vm.mar.top]\'>\n		<line class=\'zero-line\' x1=\'0\' ng-attr-x2=\'{{vm.width}}\' ng-attr-y1=\'{{vm.V(0)}}\' ng-attr-y2=\'{{vm.V(0)}}\' />\n		<line class=\'zero-line\' y1=\'0\' ng-attr-y2=\'{{vm.height}}\' ng-attr-x1=\'{{vm.T(0)}}\' ng-attr-x2=\'{{vm.T(0)}}\' />\n		<g ng-class=\'{hide: !vm.show}\' >\n			<path ng-attr-d=\'{{vm.triangleData()}}\' class=\'tri\' />\n			<path ng-attr-d=\'{{vm.lineFun([vm.point, {v: vm.point.dv + vm.point.v, t: vm.point.t}])}}\' class=\'fun dv\' />\n		</g>\n		<path ng-attr-d=\'{{vm.lineFun(vm.Data.dots)}}\' class=\'fun v\' />\n		<g ng-repeat=\'dot in vm.dots track by dot.id\' datum=dot shifter=\'[vm.T(dot.t),vm.V(dot.v)]\' behavior=\'vm.drag\' dot-der ></g>\n		<circle class=\'dot small\' r=\'4\' shifter=\'[vm.T(vm.Data.first.t),vm.V(vm.Data.first.v)]\' />\n	</g>\n</svg>';

Ctrl = (function() {
  function Ctrl(scope, el, window) {
    this.scope = scope;
    this.el = el;
    this.window = window;
    this.resize = bind(this.resize, this);
    this.on_drag = bind(this.on_drag, this);
    this.mar = {
      left: 25,
      top: 10,
      right: 20,
      bottom: 25
    };
    this.V = d3.scale.linear().domain([-.25, 5]);
    this.T = d3.scale.linear().domain([-.5, 6]);
    this.show = false;
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
        _this.show = true;
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
    })(this)).on('dragend', (function(_this) {
      return function() {
        _this.show = false;
        return _this.scope.$evalAsync();
      };
    })(this));
    this.drag = d3.behavior.drag().on('dragstart', (function(_this) {
      return function(dot) {
        _this.show = true;
        event.stopPropagation();
        if (event.which === 3) {
          Data.remove_dot(dot);
          event.preventDefault();
          return _this.scope.$evalAsync();
        }
      };
    })(this)).on('drag', this.on_drag).on('dragend', (function(_this) {
      return function() {
        _this.show = false;
        return _this.scope.$evalAsync();
      };
    })(this));
    angular.element(this.window).on('resize', this.resize);
  }

  Ctrl.property('svg_height', {
    get: function() {
      return this.height + this.mar.top + this.mar.bottom;
    }
  });

  Ctrl.property('dots', {
    get: function() {
      var res;
      return res = Data.dots.filter(function(d) {
        return d.id !== 'first';
      });
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

  Ctrl.property('point', {
    get: function() {
      return Data.selected;
    }
  });

  Ctrl.prototype.triangleData = function() {
    var point;
    point = Data.selected;
    return this.lineFun([
      {
        v: point.v,
        t: point.t
      }, {
        v: point.dv + point.v,
        t: point.t + 1
      }, {
        v: point.dv + point.v,
        t: point.t
      }
    ]);
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



},{"../../helpers":18,"./plotData":8,"angular":undefined,"d3":undefined}],7:[function(require,module,exports){
var Ctrl, Data, angular, d3, der, template,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

Data = require('./plotData');

angular = require('angular');

d3 = require('d3');

require('../../helpers');

template = '<h3>Plot B</h3>\n<svg ng-init=\'vm.resize()\'  width=\'100%\' ng-attr-height=\'{{vm.svg_height}}\'>\n	<defs>\n		<clippath id=\'plotB\'>\n			<rect ng-attr-width=\'{{vm.width}}\' ng-attr-height=\'{{vm.height}}\'></rect>\n		</clippath>\n	</defs>\n	<g class=\'boilerplate\' shifter=\'[vm.mar.left, vm.mar.top]\'>\n		<rect class=\'background\' ng-attr-width=\'{{vm.width}}\' ng-attr-height=\'{{vm.height}}\'></rect>\n		<g ver-axis-der width=\'vm.width\' scale=\'vm.DV\' fun=\'vm.verAxFun\'></g>\n		<g hor-axis-der height=\'vm.height\' scale=\'vm.V\' fun=\'vm.horAxFun\' shifter=\'[0,vm.height]\'></g>\n	</g>\n	<g class=\'main\' clip-path="url(#plotB)" shifter=\'[vm.mar.left, vm.mar.top]\'>\n		<line class=\'zero-line\' x1=\'0\' ng-attr-x2=\'{{vm.width}}\' ng-attr-y1=\'{{vm.DV(0)}}\' ng-attr-y2=\'{{vm.DV(0)}}\' />\n		<line class=\'zero-line\' y1=\'0\' ng-attr-y2=\'{{vm.height}}\' ng-attr-x1=\'{{vm.V(0)}}\' ng-attr-x2=\'{{vm.V(0)}}\' />\n		<path ng-attr-d=\'{{vm.lineFun(vm.Data.target_data)}}\' class=\'fun target\' />\n		<path ng-attr-d=\'{{vm.lineFun(vm.dots)}}\' class=\'fun dv\' />\n		<g ng-repeat=\'dot in vm.dots track by dot.id\' shifter=\'[vm.V(dot.v),vm.DV(dot.dv)]\' dot-b-der></g>\n	</g>\n</svg>';

Ctrl = (function() {
  function Ctrl(scope, el, window) {
    this.scope = scope;
    this.el = el;
    this.window = window;
    this.resize = bind(this.resize, this);
    this.mar = {
      left: 25,
      top: 10,
      right: 20,
      bottom: 25
    };
    this.DV = d3.scale.linear().domain([-5, 1]);
    this.V = d3.scale.linear().domain([-.5, 4]);
    this.horAxFun = d3.svg.axis().scale(this.V).ticks(4).orient('bottom');
    this.verAxFun = d3.svg.axis().scale(this.DV).ticks(5).orient('left');
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

  Ctrl.property('dots', {
    get: function() {
      return Data.dots.filter(function(d) {
        return d.id !== 'first';
      });
    }
  });

  Ctrl.prototype.hilite = function(v) {
    return d3.select(this).transition().duration(100).ease('cubic').attr('r', v ? 6 : 4);
  };

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



},{"../../helpers":18,"./plotData":8,"angular":undefined,"d3":undefined}],8:[function(require,module,exports){
var Dot, Service, _, atan, exp, max, min, service, sqrt;

_ = require('lodash');

exp = Math.exp, sqrt = Math.sqrt, atan = Math.atan, min = Math.min, max = Math.max;

Dot = (function() {
  function Dot(t1, v1) {
    this.t = t1;
    this.v = v1;
    this.id = _.uniqueId('dot');
    this.hilited = false;
  }

  return Dot;

})();

Service = (function() {
  function Service() {
    var firstDot;
    firstDot = new Dot(0, 4);
    firstDot.id = 'first';
    this.dots = [firstDot, new Dot(1, 4 * exp(-1))];
    this.first = firstDot;
    this.selected = firstDot;
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
      return dot.dv = prev ? (dot.v - prev.v) / max(dot.t - prev.t, .01) : 0;
    });
  };

  Service.prototype.update_dot = function(dot, t, v) {
    if (dot.id === 'first') {
      return;
    }
    this.selected = dot;
    dot.t = t;
    dot.v = v;
    return this.update_dots();
  };

  return Service;

})();

service = new Service;

module.exports = service;



},{"lodash":undefined}],9:[function(require,module,exports){
var _, angular, d3, der, math, regCtrl, template,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

angular = require('angular');

d3 = require('d3');

require('../../helpers');

math = require('mathjs');

_ = require('lodash');

template = '<svg ng-init=\'vm.resize()\' width=\'100%\' ng-attr-height=\'{{vm.svg_height}}\'>\n	<defs>\n		<clippath id=\'reg\'>\n			<rect ng-attr-width=\'{{vm.width}}\' ng-attr-height=\'{{vm.height}}\'></rect>\n		</clippath>\n	</defs>\n	<g class=\'boilerplate\' shifter=\'[vm.mar.left, vm.mar.top]\'>\n		<rect class=\'background\' ng-attr-width=\'{{vm.width}}\' ng-attr-height=\'{{vm.height}}\' ng-mousemove=\'vm.move($event)\' />\n		<g ver-axis-der width=\'vm.width\' scale=\'vm.V\' fun=\'vm.verAxFun\'></g>\n		<g hor-axis-der height=\'vm.height\' scale=\'vm.T\' fun=\'vm.horAxFun\' shifter=\'[0,vm.height]\'></g>\n	</g>\n	<g class=\'main\' clip-path="url(#reg)" shifter=\'[vm.mar.left, vm.mar.top]\'>\n		<line class=\'zero-line\' x1=\'0\' ng-attr-x2=\'{{vm.width}}\' ng-attr-y1=\'{{vm.V(0)}}\' ng-attr-y2=\'{{vm.V(0)}}\' />\n		<path ng-attr-d=\'{{vm.lineFun(vm.data)}}\' class=\'fun v\' />\n		<circle r=\'3px\' shifter=\'[vm.T(vm.point.t), vm.V(vm.point.v)]\' class=\'point\'/>\n	</g>\n</svg>';

regCtrl = (function() {
  function regCtrl(scope, el, window) {
    var parser, v;
    this.scope = scope;
    this.el = el;
    this.window = window;
    this.resize = bind(this.resize, this);
    this.mar = {
      left: 30,
      top: 20,
      right: 20,
      bottom: 25
    };
    this.V = d3.scale.linear().domain([-1, 1]);
    this.T = d3.scale.linear().domain([0, 3]);
    this.horAxFun = d3.svg.axis().scale(this.T).tickValues([0, 1, 2, 3]).orient('bottom');
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
    parser = math.parser();
    parser["eval"]('v(t) = 5* (t-.5) * (t-1) * (t-2)^2');
    v = parser.get('v');
    this.data = _.range(0, 3, 1 / 50).map(function(t) {
      var res;
      return res = {
        v: v(t),
        t: t
      };
    });
    this.point = _.sample(this.data);
    angular.element(this.window).on('resize', this.resize);
    this.move = (function(_this) {
      return function(event) {
        var rect, t;
        rect = event.target.getBoundingClientRect();
        t = _this.T.invert(event.x - rect.left);
        _this.point = {
          t: t,
          v: v(t)
        };
        return _this.scope.$evalAsync();
      };
    })(this);
  }

  regCtrl.property('svg_height', {
    get: function() {
      return this.height + this.mar.top + this.mar.bottom;
    }
  });

  regCtrl.prototype.resize = function() {
    this.width = this.el[0].clientWidth - this.mar.left - this.mar.right;
    this.height = this.el[0].parentElement.clientHeight - this.mar.left - this.mar.right;
    this.V.range([this.height, 0]);
    this.T.range([0, this.width]);
    return this.scope.$evalAsync();
  };

  return regCtrl;

})();

der = function() {
  var directive;
  return directive = {
    controllerAs: 'vm',
    scope: {},
    template: template,
    templateNamespace: 'svg',
    controller: ['$scope', '$element', '$window', regCtrl]
  };
};

module.exports = der;



},{"../../helpers":18,"angular":undefined,"d3":undefined,"lodash":undefined,"mathjs":undefined}],10:[function(require,module,exports){
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



},{}],11:[function(require,module,exports){
module.exports = function($parse) {
  return function(scope, el, attr) {
    return d3.select(el[0]).datum($parse(attr.datum)(scope));
  };
};



},{}],12:[function(require,module,exports){
var der, template;

template = '<circle class=\'dot large\'></circle>\n<circle class=\'dot small\' r=\'4\'></circle>';

der = function() {
  var directive;
  return directive = {
    template: template,
    restrict: 'A',
    link: function(scope, el, attr) {
      var big, circ, mouseover, rad, sel;
      rad = 10;
      sel = d3.select(el[0]);
      big = sel.select('circle.dot.large').attr('r', rad);
      circ = sel.select('circle.dot.small');
      mouseover = function() {
        scope.dot.hilited = true;
        scope.$evalAsync();
        return big.transition('grow').duration(150).ease('cubic-out').attr('r', rad * 1.5).transition().duration(150).ease('cubic-in').attr('r', rad * 1.3);
      };
      big.on('mouseover', mouseover).on('contextmenu', function() {
        return event.preventDefault();
      }).on('mousedown', function() {
        return big.transition('grow').duration(150).ease('cubic').attr('r', rad * 1.7);
      }).on('mouseup', function() {
        return big.transition('grow').duration(150).ease('cubic-in').attr('r', rad * 1.3);
      }).on('mouseout', function() {
        scope.dot.hilited = false;
        scope.$evalAsync();
        return big.transition('shrink').duration(350).ease('bounce-out').attr('r', rad);
      });
      return scope.$watch('dot.hilited', function(v) {
        if (v) {
          return circ.transition().duration(150).ease('cubic-out').style({
            'stroke-width': 2.5,
            stroke: '#222'
          });
        } else {
          return circ.transition().duration(100).ease('cubic').style({
            'stroke-width': 1.6,
            stroke: 'white'
          });
        }
      });
    }
  };
};

module.exports = der;



},{}],13:[function(require,module,exports){
var der, template;

template = '<circle class=\'dot small\' r=\'4\'></circle>';

der = function() {
  var directive;
  return directive = {
    template: template,
    restrict: 'A',
    link: function(scope, el, attr) {
      var circ, sel;
      sel = d3.select(el[0]);
      circ = sel.select('circle.dot.small');
      return scope.$watch('dot.hilited', function(v) {
        if (v) {
          return circ.transition().duration(150).ease('cubic-out').style({
            'stroke-width': 2.5,
            stroke: '#222'
          });
        } else {
          return circ.transition().duration(100).ease('cubic').style({
            'stroke-width': 1.6,
            stroke: 'white'
          });
        }
      });
    }
  };
};

module.exports = der;



},{}],14:[function(require,module,exports){
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



},{"angular":undefined,"d3":undefined}],15:[function(require,module,exports){
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



},{"d3":undefined}],16:[function(require,module,exports){
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
      scope.$watch('vm.scale.range()', update, true);
      return scope.$watch('vm.height', update, true);
    }
  };
};

module.exports = der;



},{"angular":undefined,"d3":undefined}],17:[function(require,module,exports){
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
      fun: '='
    },
    link: function(scope, el, attr, vm) {
      var ref, sel, update, yAxisFun;
      yAxisFun = (ref = vm.fun) != null ? ref : d3.svg.axis().scale(vm.scale).orient('left');
      sel = d3.select(el[0]).classed('y axis', true);
      update = (function(_this) {
        return function() {
          yAxisFun.tickSize(-vm.width);
          return sel.call(yAxisFun);
        };
      })(this);
      update();
      scope.$watch('vm.scale.domain()', update, true);
      return scope.$watch('vm.scale.range()', update, true);
    }
  };
};

module.exports = der;



},{"angular":undefined,"d3":undefined}],18:[function(require,module,exports){
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvbGV3aXMvUmVzZWFyY2gvZGlmZkVRX25ldy9hcHAvYXBwLmNvZmZlZSIsIi9Vc2Vycy9sZXdpcy9SZXNlYXJjaC9kaWZmRVFfbmV3L2FwcC9jb21wb25lbnRzL2NhcnQvY2FydEJ1dHRvbnMuY29mZmVlIiwiL1VzZXJzL2xld2lzL1Jlc2VhcmNoL2RpZmZFUV9uZXcvYXBwL2NvbXBvbmVudHMvY2FydC9jYXJ0RGF0YS5jb2ZmZWUiLCIvVXNlcnMvbGV3aXMvUmVzZWFyY2gvZGlmZkVRX25ldy9hcHAvY29tcG9uZW50cy9jYXJ0L2NhcnRQbG90LmNvZmZlZSIsIi9Vc2Vycy9sZXdpcy9SZXNlYXJjaC9kaWZmRVFfbmV3L2FwcC9jb21wb25lbnRzL2Rlcml2YXRpdmUvZGVyaXZhdGl2ZS5jb2ZmZWUiLCIvVXNlcnMvbGV3aXMvUmVzZWFyY2gvZGlmZkVRX25ldy9hcHAvY29tcG9uZW50cy9wbG90L3Bsb3RBLmNvZmZlZSIsIi9Vc2Vycy9sZXdpcy9SZXNlYXJjaC9kaWZmRVFfbmV3L2FwcC9jb21wb25lbnRzL3Bsb3QvcGxvdEIuY29mZmVlIiwiL1VzZXJzL2xld2lzL1Jlc2VhcmNoL2RpZmZFUV9uZXcvYXBwL2NvbXBvbmVudHMvcGxvdC9wbG90RGF0YS5jb2ZmZWUiLCIvVXNlcnMvbGV3aXMvUmVzZWFyY2gvZGlmZkVRX25ldy9hcHAvY29tcG9uZW50cy9yZWd1bGFyL3JlZ3VsYXIuY29mZmVlIiwiL1VzZXJzL2xld2lzL1Jlc2VhcmNoL2RpZmZFUV9uZXcvYXBwL2RpcmVjdGl2ZXMvYmVoYXZpb3IuY29mZmVlIiwiL1VzZXJzL2xld2lzL1Jlc2VhcmNoL2RpZmZFUV9uZXcvYXBwL2RpcmVjdGl2ZXMvZGF0dW0uY29mZmVlIiwiL1VzZXJzL2xld2lzL1Jlc2VhcmNoL2RpZmZFUV9uZXcvYXBwL2RpcmVjdGl2ZXMvZG90LmNvZmZlZSIsIi9Vc2Vycy9sZXdpcy9SZXNlYXJjaC9kaWZmRVFfbmV3L2FwcC9kaXJlY3RpdmVzL2RvdEIuY29mZmVlIiwiL1VzZXJzL2xld2lzL1Jlc2VhcmNoL2RpZmZFUV9uZXcvYXBwL2RpcmVjdGl2ZXMvbGluZS5jb2ZmZWUiLCIvVXNlcnMvbGV3aXMvUmVzZWFyY2gvZGlmZkVRX25ldy9hcHAvZGlyZWN0aXZlcy9zaGlmdGVyLmNvZmZlZSIsIi9Vc2Vycy9sZXdpcy9SZXNlYXJjaC9kaWZmRVFfbmV3L2FwcC9kaXJlY3RpdmVzL3hBeGlzLmNvZmZlZSIsIi9Vc2Vycy9sZXdpcy9SZXNlYXJjaC9kaWZmRVFfbmV3L2FwcC9kaXJlY3RpdmVzL3lBeGlzLmNvZmZlZSIsIi9Vc2Vycy9sZXdpcy9SZXNlYXJjaC9kaWZmRVFfbmV3L2FwcC9oZWxwZXJzLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBLFlBQUEsQ0FBQTtBQUFBLElBQUEsb0xBQUE7O0FBQUEsT0FDQSxHQUFVLE9BQUEsQ0FBUSxTQUFSLENBRFYsQ0FBQTs7QUFBQSxFQUVBLEdBQUssT0FBQSxDQUFRLElBQVIsQ0FGTCxDQUFBOztBQUFBLEtBTUEsR0FBUSxPQUFBLENBQVEsb0JBQVIsQ0FOUixDQUFBOztBQUFBLE1BT0EsR0FBUyxPQUFBLENBQVEsa0JBQVIsQ0FQVCxDQUFBOztBQUFBLE9BUUEsR0FBVSxPQUFBLENBQVEsb0JBQVIsQ0FSVixDQUFBOztBQUFBLE9BU0EsR0FBVSxPQUFBLENBQVEsb0JBQVIsQ0FUVixDQUFBOztBQUFBLFFBVUEsR0FBVyxPQUFBLENBQVEsdUJBQVIsQ0FWWCxDQUFBOztBQUFBLFdBV0EsR0FBYyxPQUFBLENBQVEsNEJBQVIsQ0FYZCxDQUFBOztBQUFBLGNBWUEsR0FBaUIsT0FBQSxDQUFRLCtCQUFSLENBWmpCLENBQUE7O0FBQUEsT0FhQSxHQUFVLE9BQUEsQ0FBUSxzQkFBUixDQWJWLENBQUE7O0FBQUEsUUFjQSxHQUFXLE9BQUEsQ0FBUSxrQkFBUixDQWRYLENBQUE7O0FBQUEs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a0MsTUFBbEMsRUFBMkMsSUFBM0MsQ0FaQSxDQUFBO2FBYUEsS0FBSyxDQUFDLE1BQU4sQ0FBYSxrQkFBYixFQUFpQyxNQUFqQyxFQUEwQyxJQUExQyxFQWRLO0lBQUEsQ0FUTjtJQUZJO0FBQUEsQ0FITixDQUFBOztBQUFBLE1BK0JNLENBQUMsT0FBUCxHQUFpQixHQS9CakIsQ0FBQTs7Ozs7QUNBQSxZQUFBLENBQUE7QUFBQSxNQUVNLENBQUMsT0FBTyxDQUFDLE9BQWYsR0FBeUIsU0FBQyxHQUFELEVBQU0sSUFBTixHQUFBO1NBQ3ZCLEVBQUUsQ0FBQyxLQUFILENBQVMsQ0FBQSxTQUFBLEtBQUEsR0FBQTtXQUFBLFNBQUEsR0FBQTtBQUNSLE1BQUEsR0FBQSxDQUFBLENBQUEsQ0FBQTthQUNBLEtBRlE7SUFBQSxFQUFBO0VBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFULEVBR0MsSUFIRCxFQUR1QjtBQUFBLENBRnpCLENBQUE7O0FBQUEsUUFTUSxDQUFBLFNBQUUsQ0FBQSxRQUFWLEdBQXFCLFNBQUMsSUFBRCxFQUFPLElBQVAsR0FBQTtTQUNuQixNQUFNLENBQUMsY0FBUCxDQUFzQixJQUFDLENBQUEsU0FBdkIsRUFBa0MsSUFBbEMsRUFBd0MsSUFBeEMsRUFEbUI7QUFBQSxDQVRyQixDQUFBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIid1c2Ugc3RyaWN0J1xuYW5ndWxhciA9IHJlcXVpcmUgJ2FuZ3VsYXInXG5kMyA9IHJlcXVpcmUgJ2QzJ1xuIyB0aGlyZExlZnQgPSByZXF1aXJlICcuL2NvbXBvbmVudHMvdGhpcmQvdGhpcmRMZWZ0J1xuIyB0aGlyZEJpZyA9IHJlcXVpcmUgJy4vY29tcG9uZW50cy90aGlyZC90aGlyZEJpZydcbiMgeUF4aXMgPSByZXF1aXJlICcuL2RpcmVjdGl2ZXMveUF4aXMnXG5kYXR1bSA9IHJlcXVpcmUgJy4vZGlyZWN0aXZlcy9kYXR1bSdcbmRvdERlciA9IHJlcXVpcmUgJy4vZGlyZWN0aXZlcy9kb3QnXG5ob3JBeGlzID0gcmVxdWlyZSAnLi9kaXJlY3RpdmVzL3hBeGlzJ1xudmVyQXhpcyA9IHJlcXVpcmUgJy4vZGlyZWN0aXZlcy95QXhpcydcbmJlaGF2aW9yID0gcmVxdWlyZSAnLi9kaXJlY3RpdmVzL2JlaGF2aW9yJ1xuY2FydFBsb3REZXIgPSByZXF1aXJlICcuL2NvbXBvbmVudHMvY2FydC9jYXJ0UGxvdCdcbmNhcnRCdXR0b25zRGVyID0gcmVxdWlyZSAnLi9jb21wb25lbnRzL2NhcnQvY2FydEJ1dHRvbnMnXG5zaGlmdGVyID0gcmVxdWlyZSAnLi9kaXJlY3RpdmVzL3NoaWZ0ZXInXG5tYXRlcmlhbCA9IHJlcXVpcmUgJ2FuZ3VsYXItbWF0ZXJpYWwnXG5wbG90QURlciA9IHJlcXVpcmUgJy4vY29tcG9uZW50cy9wbG90L3Bsb3RBJ1xucGxvdEJEZXIgPSByZXF1aXJlICcuL2NvbXBvbmVudHMvcGxvdC9wbG90QidcbmxpbmVEZXIgPSByZXF1aXJlICcuL2RpcmVjdGl2ZXMvbGluZSdcbnJlZ3VsYXJEZXIgPSByZXF1aXJlICcuL2NvbXBvbmVudHMvcmVndWxhci9yZWd1bGFyJ1xuZGVyaXZhdGl2ZURlciAgPSByZXF1aXJlICcuL2NvbXBvbmVudHMvZGVyaXZhdGl2ZS9kZXJpdmF0aXZlJ1xuZG90QkRlciA9IHJlcXVpcmUgJy4vZGlyZWN0aXZlcy9kb3RCJ1xuYXBwID0gYW5ndWxhci5tb2R1bGUgJ21haW5BcHAnLCBbbWF0ZXJpYWxdXG5cdC5kaXJlY3RpdmUgJ2hvckF4aXNEZXInLCBob3JBeGlzXG5cdC5kaXJlY3RpdmUgJ3ZlckF4aXNEZXInLCB2ZXJBeGlzXG5cdC5kaXJlY3RpdmUgJ2NhcnRQbG90RGVyJywgY2FydFBsb3REZXJcblx0LmRpcmVjdGl2ZSAnY2FydEJ1dHRvbnNEZXInLCBjYXJ0QnV0dG9uc0RlclxuXHQuZGlyZWN0aXZlICdzaGlmdGVyJyAsIHNoaWZ0ZXJcblx0LmRpcmVjdGl2ZSAncGxvdEFEZXInLCBwbG90QURlclxuXHQuZGlyZWN0aXZlICdiZWhhdmlvcicsIGJlaGF2aW9yXG5cdC5kaXJlY3RpdmUgJ2RvdERlcicsIGRvdERlclxuXHQuZGlyZWN0aXZlICdkYXR1bScsIGRhdHVtXG5cdC5kaXJlY3RpdmUgJ2xpbmVEZXInLCBsaW5lRGVyXG5cdC5kaXJlY3RpdmUgJ3Bsb3RCRGVyJyAsIHBsb3RCRGVyXG5cdC5kaXJlY3RpdmUgJ3JlZ3VsYXJEZXInLCByZWd1bGFyRGVyXG5cdC5kaXJlY3RpdmUgJ2Rlcml2YXRpdmVEZXInLCBkZXJpdmF0aXZlRGVyXG5cdC5kaXJlY3RpdmUgJ2RvdEJEZXInLCBkb3RCRGVyXG5cbmxvb3BlciA9IC0+XG4gICAgc2V0VGltZW91dCggKCktPlxuICAgIFx0XHRcdGQzLnNlbGVjdEFsbCAnY2lyY2xlLmRvdC5sYXJnZSdcbiAgICBcdFx0XHRcdC50cmFuc2l0aW9uICdncm93J1xuICAgIFx0XHRcdFx0LmR1cmF0aW9uIDUwMFxuICAgIFx0XHRcdFx0LmVhc2UgJ2N1YmljLW91dCdcbiAgICBcdFx0XHRcdC5hdHRyICd0cmFuc2Zvcm0nLCAnc2NhbGUoIDEuMzQpJ1xuICAgIFx0XHRcdFx0LnRyYW5zaXRpb24gJ3NocmluaydcbiAgICBcdFx0XHRcdC5kdXJhdGlvbiA1MDBcbiAgICBcdFx0XHRcdC5lYXNlICdjdWJpYy1vdXQnXG4gICAgXHRcdFx0XHQuYXR0ciAndHJhbnNmb3JtJywgJ3NjYWxlKCAxLjApJ1xuICAgIFx0XHRcdGxvb3BlcigpXG4gICAgXHRcdCwgMTAwMClcblxubG9vcGVyKClcbiIsIl8gPSByZXF1aXJlICdsb2Rhc2gnXG57ZXhwLCBzcXJ0LCBhdGFufSA9IE1hdGhcbkNhcnQgPSByZXF1aXJlICcuL2NhcnREYXRhJ1xuXG50ZW1wbGF0ZSA9ICcnJ1xuXHQ8ZGl2IGZsZXggbGF5b3V0PSdyb3cnPlxuXHRcdDxtZC1idXR0b24gZmxleCBjbGFzcz1cIm1kLXJhaXNlZFwiIG5nLWNsaWNrPSd2bS5wbGF5KCknPlBsYXk8L21kLWJ1dHRvbj5cblx0XHQ8bWQtYnV0dG9uIGZsZXggY2xhc3M9XCJtZC1yYWlzZWRcIiBuZy1jbGljaz0ndm0ucGF1c2UoKSc+UGF1c2U8L21kLWJ1dHRvbj5cblx0PC9kaXY+XG4nJydcblxuY2xhc3MgQ3RybFxuXHRjb25zdHJ1Y3RvcjogKEBzY29wZSktPlxuXHRcdEBjYXJ0ID0gQ2FydFxuXG5cdHBsYXk6IC0+XG5cdFx0QHBhdXNlZCA9IHRydWVcblx0XHRkMy50aW1lci5mbHVzaCgpXG5cdFx0QHBhdXNlZCA9IGZhbHNlXG5cdFx0c2V0VGltZW91dCA9PlxuXHRcdFx0ZDMudGltZXIgKHQpPT5cblx0XHRcdFx0QGNhcnQubW92ZSB0LzEwMDBcblx0XHRcdFx0QHNjb3BlLiRldmFsQXN5bmMoKVxuXHRcdFx0XHRpZiAoQGNhcnQudiA8IC4wMSkgdGhlbiBAcGF1c2VkID0gdHJ1ZVxuXHRcdFx0XHRpZiBAcGF1c2VkIHRoZW4gY29uc29sZS5sb2cgJ2xlYXZpbmcnXG5cdFx0XHRcdEBwYXVzZWRcblxuXHRwYXVzZTogLT5cblx0XHRAcGF1c2VkID0gdHJ1ZVxuXG5kZXIgPSAoKS0+XG5cdGRpcmVjdGl2ZSA9IFxuXHRcdGNvbnRyb2xsZXJBczogJ3ZtJ1xuXHRcdCMgcmVzdHJpY3Q6ICdFJ1xuXHRcdHNjb3BlOiB7fVxuXHRcdGNvbnRyb2xsZXI6IFsnJHNjb3BlJywgQ3RybF1cblx0XHR0ZW1wbGF0ZTogdGVtcGxhdGVcblxubW9kdWxlLmV4cG9ydHMgPSBkZXIiLCJfID0gcmVxdWlyZSAnbG9kYXNoJ1xue2V4cCwgc3FydCwgYXRhbn0gPSBNYXRoXG5cbmNsYXNzIENhcnRcblx0Y29uc3RydWN0b3I6IChAb3B0aW9ucyktPlxuXHRcdHtAeDAsIEB2MCwgQGJ9ID0gQG9wdGlvbnNcblx0XHRAcmVzdGFydCgpXG5cdHJlc3RhcnQ6IC0+XG5cdFx0QHRyYWplY3RvcnkgPSBbXVxuXHRcdEBtb3ZlKDApXG5cdG1vdmU6ICh0KS0+XG5cdFx0QHYgPSBAdjAgKiBleHAoLUBiICogdClcblx0XHRAeCA9IEB4MCArIEB2MC9AYiAqICgxLWV4cCgtQGIqdCkpXG5cdFx0QHRyYWplY3RvcnkucHVzaCB7dDogdCwgdjogQHYsIHg6IEB4fVxuXG5tb2R1bGUuZXhwb3J0cyA9IG5ldyBDYXJ0IHt4MDogMCwgdjA6IDQsIGI6IDF9IiwiXyA9IHJlcXVpcmUgJ2xvZGFzaCdcbmQzPSByZXF1aXJlICdkMydcbnttaW59ID0gTWF0aFxuQ2FydCA9IHJlcXVpcmUgJy4vY2FydERhdGEnXG5yZXF1aXJlICcuLi8uLi9oZWxwZXJzJ1xuXG50ZW1wbGF0ZSA9ICcnJ1xuXHQ8c3ZnIG5nLWluaXQ9J3ZtLnJlc2l6ZSgpJyB3aWR0aD0nMTAwJScgbmctYXR0ci1oZWlnaHQ9J3t7dm0uc3ZnX2hlaWdodH19Jz5cblx0XHQ8ZyBzaGlmdGVyPSd7ezo6W3ZtLm1hci5sZWZ0LCB2bS5tYXIudG9wXX19Jz5cblx0XHRcdDxyZWN0IG5nLWF0dHItd2lkdGg9J3t7dm0ud2lkdGh9fScgbmctYXR0ci1oZWlnaHQ9J3t7dm0uaGVpZ2h0fX0nIGNsYXNzPSdiYWNrZ3JvdW5kJy8+XG5cdFx0XHQ8ZyBob3ItYXhpcy1kZXIgaGVpZ2h0PSd2bS5oZWlnaHQnIHNjYWxlPSd2bS5YJyBmdW49J3ZtLmF4aXNGdW4nIHNoaWZ0ZXI9J1swLHZtLmhlaWdodF0nPjwvZz5cblx0XHRcdDxnIGNsYXNzPSdnLWNhcnQnPlxuXHRcdFx0XHQ8cmVjdCBjbGFzcz0nY2FydCcgbmctYXR0ci15PSd7e3ZtLmhlaWdodC8zfX0nIG5nLWF0dHItd2lkdGg9J3t7dm0uaGVpZ2h0LzN9fScgbmctYXR0ci1oZWlnaHQ9J3t7dm0uaGVpZ2h0LzN9fScvPlxuXHRcdFx0PC9nPlxuXHRcdDwvZz5cblx0PC9zdmc+XG4nJydcblxuY2xhc3MgQ3RybFxuXHRjb25zdHJ1Y3RvcjogKEBzY29wZSwgQGVsLCBAd2luZG93KS0+XG5cdFx0QGNhcnQgPSBDYXJ0XG5cdFx0QG1hciA9IFxuXHRcdFx0bGVmdDogMTBcblx0XHRcdHJpZ2h0OiAxMFxuXHRcdFx0dG9wOiAxMFxuXHRcdFx0Ym90dG9tOiAxOFxuXHRcdEBYID0gZDMuc2NhbGUubGluZWFyKCkuZG9tYWluIFstLjI1LDVdIFxuXHRcdHNlbCAgPSBkMy5zZWxlY3QgQGVsWzBdXG5cdFx0Y2FydCA9IHNlbC5zZWxlY3QgJy5nLWNhcnQnXG5cblx0XHRAYXhpc0Z1biA9IGQzLnN2Zy5heGlzKClcblx0XHRcdC5zY2FsZSBAWFxuXHRcdFx0LnRpY2tzIDVcblx0XHRcdC5vcmllbnQgJ2JvdHRvbSdcblxuXHRcdEBzY29wZS4kd2F0Y2ggJ3ZtLmNhcnQueCcsICh4KT0+XG5cdFx0XHR4UHggPSBAWCh4KVxuXHRcdFx0Y2FydFxuXHRcdFx0XHQudHJhbnNpdGlvbigpXG5cdFx0XHRcdC5kdXJhdGlvbiAxNVxuXHRcdFx0XHQuZWFzZSAnbGluZWFyJ1xuXHRcdFx0XHQuYXR0ciAndHJhbnNmb3JtJywgXCJ0cmFuc2xhdGUoI3t4UHh9LDApXCJcblxuXHRcdGFuZ3VsYXIuZWxlbWVudCBAd2luZG93XG5cdFx0XHQub24gJ3Jlc2l6ZScgLCAoKT0+QHJlc2l6ZSgpXG5cblx0IyBAcHJvcGVydHkgXG5cblx0QHByb3BlcnR5ICdzdmdfaGVpZ2h0JyAsIGdldDotPiBAaGVpZ2h0ICsgQG1hci50b3AgKyBAbWFyLmJvdHRvbVxuXG5cdHJlc2l6ZTogKCk9PlxuXHRcdEB3aWR0aCA9IEBlbFswXS5jbGllbnRXaWR0aCAtIEBtYXIubGVmdCAtIEBtYXIucmlnaHRcblx0XHRAaGVpZ2h0ID0gQHdpZHRoKi4zIC0gQG1hci50b3AgLSBAbWFyLmJvdHRvbVxuXHRcdEBYLnJhbmdlKFswLCBAd2lkdGhdKVxuXHRcdEBzY29wZS4kZXZhbEFzeW5jKClcblxuZGVyID0gKCktPlxuXHRkaXJlY3RpdmUgPSBcblx0XHR0ZW1wbGF0ZTogdGVtcGxhdGVcblx0XHRzY29wZToge31cblx0XHRyZXN0cmljdDogJ0EnXG5cdFx0YmluZFRvQ29udHJvbGxlcjogdHJ1ZVxuXHRcdHRlbXBsYXRlTmFtZXNwYWNlOiAnc3ZnJ1xuXHRcdGNvbnRyb2xsZXI6IFsnJHNjb3BlJywgJyRlbGVtZW50JywgJyR3aW5kb3cnLCBDdHJsXVxuXHRcdGNvbnRyb2xsZXJBczogJ3ZtJ1xuXG5tb2R1bGUuZXhwb3J0cyA9IGRlclxuIiwiYW5ndWxhciA9IHJlcXVpcmUgJ2FuZ3VsYXInXG5kMyA9IHJlcXVpcmUgJ2QzJ1xucmVxdWlyZSAnLi4vLi4vaGVscGVycydcbm1hdGggPSByZXF1aXJlICdtYXRoanMnXG5fID0gcmVxdWlyZSAnbG9kYXNoJ1xudGVtcGxhdGUgPSAnJydcblx0PHN2ZyBuZy1pbml0PSd2bS5yZXNpemUoKScgd2lkdGg9JzEwMCUnIG5nLWF0dHItaGVpZ2h0PSd7e3ZtLnN2Z19oZWlnaHR9fSc+XG5cdFx0PGRlZnM+XG5cdFx0XHQ8Y2xpcHBhdGggaWQ9J3JlZyc+XG5cdFx0XHRcdDxyZWN0IG5nLWF0dHItd2lkdGg9J3t7dm0ud2lkdGh9fScgbmctYXR0ci1oZWlnaHQ9J3t7dm0uaGVpZ2h0fX0nPjwvcmVjdD5cblx0XHRcdDwvY2xpcHBhdGg+XG5cdFx0PC9kZWZzPlxuXHRcdDxnIGNsYXNzPSdib2lsZXJwbGF0ZScgc2hpZnRlcj0nW3ZtLm1hci5sZWZ0LCB2bS5tYXIudG9wXSc+XG5cdFx0XHQ8cmVjdCBjbGFzcz0nYmFja2dyb3VuZCcgbmctYXR0ci13aWR0aD0ne3t2bS53aWR0aH19JyBuZy1hdHRyLWhlaWdodD0ne3t2bS5oZWlnaHR9fScgbmctbW91c2Vtb3ZlPSd2bS5tb3ZlKCRldmVudCknIC8+XG5cdFx0XHQ8ZyB2ZXItYXhpcy1kZXIgd2lkdGg9J3ZtLndpZHRoJyBzY2FsZT0ndm0uVicgZnVuPSd2bS52ZXJBeEZ1bic+PC9nPlxuXHRcdFx0PGcgaG9yLWF4aXMtZGVyIGhlaWdodD0ndm0uaGVpZ2h0JyBzY2FsZT0ndm0uVCcgZnVuPSd2bS5ob3JBeEZ1bicgc2hpZnRlcj0nWzAsdm0uaGVpZ2h0XSc+PC9nPlxuXHRcdDwvZz5cblx0XHQ8ZyBjbGFzcz0nbWFpbicgY2xpcC1wYXRoPVwidXJsKCNyZWcpXCIgc2hpZnRlcj0nW3ZtLm1hci5sZWZ0LCB2bS5tYXIudG9wXSc+XG5cdFx0XHQ8bGluZSBjbGFzcz0nemVyby1saW5lJyB4MT0nMCcgbmctYXR0ci14Mj0ne3t2bS53aWR0aH19JyBuZy1hdHRyLXkxPSd7e3ZtLlYoMCl9fScgbmctYXR0ci15Mj0ne3t2bS5WKDApfX0nIC8+XG5cdFx0XHQ8cGF0aCBuZy1hdHRyLWQ9J3t7dm0ubGluZUZ1bih2bS5kYXRhKX19JyBjbGFzcz0nZnVuIHYnIC8+XG5cdFx0XHQ8cGF0aCBuZy1hdHRyLWQ9J3t7dm0udHJpYW5nbGVEYXRhKCl9fScgY2xhc3M9J3RyaScgLz5cblx0XHRcdDxwYXRoIG5nLWF0dHItZD0ne3t2bS5saW5lRnVuKFt2bS5wb2ludCwge3Y6IHZtLnBvaW50LmR2ICsgdm0ucG9pbnQudiwgdDogdm0ucG9pbnQudH1dKX19JyBjbGFzcz0nZnVuIGR2JyAvPlxuXHRcdFx0PHBhdGggbmctYXR0ci1kPSd7e3ZtLmxpbmVGdW4oW3t2OiB2bS5wb2ludC5kdiwgdDogdm0ucG9pbnQudH0sIHt2OiAwLCB0OiB2bS5wb2ludC50fV0pfX0nIGNsYXNzPSdmdW4gZHYnIHN0eWxlPSdvcGFjaXR5OiAuNDsnLz5cblx0XHRcdDxwYXRoIG5nLWF0dHItZD0ne3t2bS5saW5lRnVuMih2bS5kYXRhKX19JyBjbGFzcz0nZnVuIGR2JyBzdHlsZT0nb3BhY2l0eTogLjMnIC8+XG5cdFx0XHQ8Y2lyY2xlIHI9JzNweCcgIHNoaWZ0ZXI9J1t2bS5UKHZtLnBvaW50LnQpLCB2bS5WKHZtLnBvaW50LnYpXScgY2xhc3M9J3BvaW50Jy8+XG5cdFx0PC9nPlxuXHQ8L3N2Zz5cbicnJ1xuXHRcdFx0XG5jbGFzcyB0cmlDdHJsXG5cdGNvbnN0cnVjdG9yOiAoQHNjb3BlLCBAZWwsIEB3aW5kb3cpLT5cblx0XHRAbWFyID0gXG5cdFx0XHRsZWZ0OiAzMFxuXHRcdFx0dG9wOiAyMFxuXHRcdFx0cmlnaHQ6IDIwXG5cdFx0XHRib3R0b206IDI1XG5cblx0XHRAViA9IGQzLnNjYWxlLmxpbmVhcigpLmRvbWFpbiBbLTIsMl1cblx0XHRAVCA9IGQzLnNjYWxlLmxpbmVhcigpLmRvbWFpbiBbMCw4XVxuXG5cdFx0QGhvckF4RnVuID0gZDMuc3ZnLmF4aXMoKVxuXHRcdFx0LnNjYWxlIEBUXG5cdFx0XHQub3JpZW50ICdib3R0b20nXG5cblx0XHRAdmVyQXhGdW4gPSBkMy5zdmcuYXhpcygpXG5cdFx0XHQuc2NhbGUgQFZcblx0XHRcdC50aWNrcyA1XG5cdFx0XHQub3JpZW50ICdsZWZ0J1xuXG5cdFx0QGxpbmVGdW4gPSBkMy5zdmcubGluZSgpXG5cdFx0XHQueSAoZCk9PiBAViBkLnZcblx0XHRcdC54IChkKT0+IEBUIGQudFxuXHRcdEBsaW5lRnVuMiA9IGQzLnN2Zy5saW5lKClcblx0XHRcdC55IChkKT0+IEBWIGQuZHZcblx0XHRcdC54IChkKT0+IEBUIGQudFxuXG5cdFx0cGFyc2VyID0gbWF0aC5wYXJzZXIoKVxuXHRcdHBhcnNlci5ldmFsICd2KHQpID0gc2luKHQpJ1xuXHRcdHBhcnNlci5ldmFsICdkdih0KSA9IGNvcyh0KSdcblx0XHR2ID0gcGFyc2VyLmdldCAndidcblx0XHRkdiA9IHBhcnNlci5nZXQgJ2R2J1xuXG5cdFx0QGRhdGEgPSBfLnJhbmdlIDAgLCA4ICwgMS81MFxuXHRcdFx0Lm1hcCAodCktPlxuXHRcdFx0XHRyZXMgPSBcblx0XHRcdFx0XHRkdjogZHYgdFxuXHRcdFx0XHRcdHY6IHYgdFxuXHRcdFx0XHRcdHQ6IHRcblxuXHRcdEBwb2ludCA9IF8uc2FtcGxlIEBkYXRhXG5cblx0XHRhbmd1bGFyLmVsZW1lbnQgQHdpbmRvd1xuXHRcdFx0Lm9uICdyZXNpemUnLCBAcmVzaXplXG5cblx0XHRAbW92ZSA9IChldmVudCkgPT5cblx0XHRcdHJlY3QgPSBldmVudC50YXJnZXQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KClcblx0XHRcdHQgPSBAVC5pbnZlcnQgKGV2ZW50LnggLSByZWN0LmxlZnQpXG5cdFx0XHRAcG9pbnQgPSBcblx0XHRcdFx0dDogdFxuXHRcdFx0XHR2OiB2IHRcblx0XHRcdFx0ZHY6IGR2IHRcblx0XHRcdEBzY29wZS4kZXZhbEFzeW5jKClcblxuXHRAcHJvcGVydHkgJ3N2Z19oZWlnaHQnLCBnZXQ6IC0+IEBoZWlnaHQgKyBAbWFyLnRvcCArIEBtYXIuYm90dG9tXG5cblx0dHJpYW5nbGVEYXRhOi0+XG5cdFx0QGxpbmVGdW4gW3t2OiBAcG9pbnQudiwgdDogQHBvaW50LnR9LCB7djpAcG9pbnQuZHYgKyBAcG9pbnQudiwgdDogQHBvaW50LnQrMX0sIHt2OiBAcG9pbnQuZHYgKyBAcG9pbnQudiwgdDogQHBvaW50LnR9XVxuXG5cdHJlc2l6ZTogKCk9PlxuXHRcdEB3aWR0aCA9IEBlbFswXS5jbGllbnRXaWR0aCAtIEBtYXIubGVmdCAtIEBtYXIucmlnaHRcblx0XHRAaGVpZ2h0ID0gQGVsWzBdLnBhcmVudEVsZW1lbnQuY2xpZW50SGVpZ2h0IC0gQG1hci5sZWZ0IC0gQG1hci5yaWdodFxuXHRcdEBWLnJhbmdlIFtAaGVpZ2h0LCAwXVxuXHRcdEBULnJhbmdlIFswLCBAd2lkdGhdXG5cdFx0QHNjb3BlLiRldmFsQXN5bmMoKVxuXG5kZXIgPSAoKS0+XG5cdGRpcmVjdGl2ZSA9IFxuXHRcdGNvbnRyb2xsZXJBczogJ3ZtJ1xuXHRcdHNjb3BlOiB7fVxuXHRcdHRlbXBsYXRlOiB0ZW1wbGF0ZVxuXHRcdHRlbXBsYXRlTmFtZXNwYWNlOiAnc3ZnJ1xuXHRcdGNvbnRyb2xsZXI6IFsnJHNjb3BlJywnJGVsZW1lbnQnLCAnJHdpbmRvdycsIHRyaUN0cmxdXG5cbm1vZHVsZS5leHBvcnRzID0gZGVyXG4iLCJhbmd1bGFyID0gcmVxdWlyZSAnYW5ndWxhcidcbmQzID0gcmVxdWlyZSAnZDMnXG5EYXRhID0gcmVxdWlyZSAnLi9wbG90RGF0YSdcbnJlcXVpcmUgJy4uLy4uL2hlbHBlcnMnXG50ZW1wbGF0ZSA9ICcnJ1xuXHQ8aDM+UGxvdCBBPC9oMz5cblx0PHN2ZyBuZy1pbml0PSd2bS5yZXNpemUoKScgd2lkdGg9JzEwMCUnIG5nLWF0dHItaGVpZ2h0PSd7e3ZtLnN2Z19oZWlnaHR9fSc+XG5cdFx0PGRlZnM+XG5cdFx0XHQ8Y2xpcHBhdGggaWQ9J3Bsb3RBJz5cblx0XHRcdFx0PHJlY3QgbmctYXR0ci13aWR0aD0ne3t2bS53aWR0aH19JyBuZy1hdHRyLWhlaWdodD0ne3t2bS5oZWlnaHR9fSc+PC9yZWN0PlxuXHRcdFx0PC9jbGlwcGF0aD5cblx0XHQ8L2RlZnM+XG5cdFx0PGcgY2xhc3M9J2JvaWxlcnBsYXRlJyBzaGlmdGVyPSdbdm0ubWFyLmxlZnQsIHZtLm1hci50b3BdJz5cblx0XHRcdDxyZWN0IGNsYXNzPSdiYWNrZ3JvdW5kJyBuZy1hdHRyLXdpZHRoPSd7e3ZtLndpZHRofX0nIG5nLWF0dHItaGVpZ2h0PSd7e3ZtLmhlaWdodH19JyBiZWhhdmlvcj0ndm0uZHJhZ19yZWN0Jz48L3JlY3Q+XG5cdFx0XHQ8ZyB2ZXItYXhpcy1kZXIgd2lkdGg9J3ZtLndpZHRoJyBzY2FsZT0ndm0uVicgZnVuPSd2bS52ZXJBeEZ1bic+PC9nPlxuXHRcdFx0PGcgaG9yLWF4aXMtZGVyIGhlaWdodD0ndm0uaGVpZ2h0JyBzY2FsZT0ndm0uVCcgZnVuPSd2bS5ob3JBeEZ1bicgc2hpZnRlcj0nWzAsdm0uaGVpZ2h0XSc+PC9nPlxuXHRcdDwvZz5cblx0XHQ8ZyBjbGFzcz0nbWFpbicgY2xpcC1wYXRoPVwidXJsKCNwbG90QSlcIiBzaGlmdGVyPSdbdm0ubWFyLmxlZnQsIHZtLm1hci50b3BdJz5cblx0XHRcdDxsaW5lIGNsYXNzPSd6ZXJvLWxpbmUnIHgxPScwJyBuZy1hdHRyLXgyPSd7e3ZtLndpZHRofX0nIG5nLWF0dHIteTE9J3t7dm0uVigwKX19JyBuZy1hdHRyLXkyPSd7e3ZtLlYoMCl9fScgLz5cblx0XHRcdDxsaW5lIGNsYXNzPSd6ZXJvLWxpbmUnIHkxPScwJyBuZy1hdHRyLXkyPSd7e3ZtLmhlaWdodH19JyBuZy1hdHRyLXgxPSd7e3ZtLlQoMCl9fScgbmctYXR0ci14Mj0ne3t2bS5UKDApfX0nIC8+XG5cdFx0XHQ8ZyBuZy1jbGFzcz0ne2hpZGU6ICF2bS5zaG93fScgPlxuXHRcdFx0XHQ8cGF0aCBuZy1hdHRyLWQ9J3t7dm0udHJpYW5nbGVEYXRhKCl9fScgY2xhc3M9J3RyaScgLz5cblx0XHRcdFx0PHBhdGggbmctYXR0ci1kPSd7e3ZtLmxpbmVGdW4oW3ZtLnBvaW50LCB7djogdm0ucG9pbnQuZHYgKyB2bS5wb2ludC52LCB0OiB2bS5wb2ludC50fV0pfX0nIGNsYXNzPSdmdW4gZHYnIC8+XG5cdFx0XHQ8L2c+XG5cdFx0XHQ8cGF0aCBuZy1hdHRyLWQ9J3t7dm0ubGluZUZ1bih2bS5EYXRhLmRvdHMpfX0nIGNsYXNzPSdmdW4gdicgLz5cblx0XHRcdDxnIG5nLXJlcGVhdD0nZG90IGluIHZtLmRvdHMgdHJhY2sgYnkgZG90LmlkJyBkYXR1bT1kb3Qgc2hpZnRlcj0nW3ZtLlQoZG90LnQpLHZtLlYoZG90LnYpXScgYmVoYXZpb3I9J3ZtLmRyYWcnIGRvdC1kZXIgPjwvZz5cblx0XHRcdDxjaXJjbGUgY2xhc3M9J2RvdCBzbWFsbCcgcj0nNCcgc2hpZnRlcj0nW3ZtLlQodm0uRGF0YS5maXJzdC50KSx2bS5WKHZtLkRhdGEuZmlyc3QudildJyAvPlxuXHRcdDwvZz5cblx0PC9zdmc+XG4nJydcbmNsYXNzIEN0cmxcblx0Y29uc3RydWN0b3I6IChAc2NvcGUsIEBlbCwgQHdpbmRvdyktPlxuXHRcdEBtYXIgPSBcblx0XHRcdGxlZnQ6IDI1XG5cdFx0XHR0b3A6IDEwXG5cdFx0XHRyaWdodDogMjBcblx0XHRcdGJvdHRvbTogMjVcblxuXHRcdEBWID0gZDMuc2NhbGUubGluZWFyKCkuZG9tYWluIFstLjI1LDVdXG5cblx0XHRAVCA9IGQzLnNjYWxlLmxpbmVhcigpLmRvbWFpbiBbLS41LDZdXG5cblx0XHRAc2hvdyA9IGZhbHNlXG5cblx0XHRARGF0YSA9IERhdGFcblxuXHRcdEBob3JBeEZ1biA9IGQzLnN2Zy5heGlzKClcblx0XHRcdC5zY2FsZSBAVFxuXHRcdFx0LnRpY2tzIDVcblx0XHRcdC5vcmllbnQgJ2JvdHRvbSdcblxuXHRcdEB2ZXJBeEZ1biA9IGQzLnN2Zy5heGlzKClcblx0XHRcdC5zY2FsZSBAVlxuXHRcdFx0LnRpY2tzIDVcblx0XHRcdC5vcmllbnQgJ2xlZnQnXG5cdFx0XG5cdFx0QGxpbmVGdW4gPSBkMy5zdmcubGluZSgpXG5cdFx0XHQueSAoZCk9PiBAViBkLnZcblx0XHRcdC54IChkKT0+IEBUIGQudFxuXG5cdFx0QGRyYWdfcmVjdCA9IGQzLmJlaGF2aW9yLmRyYWcoKVxuXHRcdFx0Lm9uICdkcmFnc3RhcnQnLCAoKT0+XG5cdFx0XHRcdEBzaG93PSB0cnVlXG5cdFx0XHRcdGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpXG5cdFx0XHRcdGlmIGV2ZW50LndoaWNoIGlzIDNcblx0XHRcdFx0XHRyZXR1cm4gZXZlbnQucHJldmVudERlZmF1bHQoKVxuXHRcdFx0XHRyZWN0ID0gZXZlbnQudG9FbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpXG5cdFx0XHRcdHQgPSBAVC5pbnZlcnQgZXZlbnQueCAtIHJlY3QubGVmdFxuXHRcdFx0XHR2ICA9IEBWLmludmVydCBldmVudC55IC0gcmVjdC50b3Bcblx0XHRcdFx0RGF0YS5hZGRfZG90IHQgLCB2XG5cdFx0XHRcdEBzY29wZS4kZXZhbEFzeW5jKClcblx0XHRcdC5vbiAnZHJhZycsID0+IEBvbl9kcmFnKERhdGEuc2VsZWN0ZWQpXG5cdFx0XHQub24gJ2RyYWdlbmQnLCA9PiBcblx0XHRcdFx0QHNob3cgPSBmYWxzZVxuXHRcdFx0XHRAc2NvcGUuJGV2YWxBc3luYygpXG5cblx0XHRAZHJhZyA9IGQzLmJlaGF2aW9yLmRyYWcoKVxuXHRcdFx0Lm9uICdkcmFnc3RhcnQnLCAoZG90KT0+XG5cdFx0XHRcdEBzaG93ID0gdHJ1ZVxuXHRcdFx0XHRldmVudC5zdG9wUHJvcGFnYXRpb24oKVxuXHRcdFx0XHRpZiBldmVudC53aGljaCBpcyAzXG5cdFx0XHRcdFx0RGF0YS5yZW1vdmVfZG90IGRvdFxuXHRcdFx0XHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KClcblx0XHRcdFx0XHRAc2NvcGUuJGV2YWxBc3luYygpXG5cdFx0XHQub24gJ2RyYWcnLCBAb25fZHJhZ1xuXHRcdFx0Lm9uICdkcmFnZW5kJywgPT4gXG5cdFx0XHRcdEBzaG93ID0gZmFsc2Vcblx0XHRcdFx0QHNjb3BlLiRldmFsQXN5bmMoKVxuXG5cdFx0YW5ndWxhci5lbGVtZW50IEB3aW5kb3dcblx0XHRcdC5vbiAncmVzaXplJywgQHJlc2l6ZVxuXG5cdEBwcm9wZXJ0eSAnc3ZnX2hlaWdodCcsIGdldDogLT4gQGhlaWdodCArIEBtYXIudG9wICsgQG1hci5ib3R0b21cblxuXHRAcHJvcGVydHkgJ2RvdHMnLCBnZXQ6LT4gXG5cdFx0cmVzID0gRGF0YS5kb3RzLmZpbHRlciAoZCktPlxuXHRcdFx0ZC5pZCAhPSAnZmlyc3QnXG5cblx0b25fZHJhZzogKGRvdCk9PiBcblx0XHRcdGlmIGV2ZW50LndoaWNoIGlzIDNcblx0XHRcdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKVxuXHRcdFx0XHRyZXR1cm5cblx0XHRcdERhdGEudXBkYXRlX2RvdCBkb3QsIEBULmludmVydChkMy5ldmVudC54KSwgQFYuaW52ZXJ0KGQzLmV2ZW50LnkpXG5cdFx0XHRAc2NvcGUuJGV2YWxBc3luYygpXG5cblx0QHByb3BlcnR5ICdwb2ludCcsIGdldDogLT4gRGF0YS5zZWxlY3RlZFxuXG5cdHRyaWFuZ2xlRGF0YTotPlxuXHRcdHBvaW50ID0gRGF0YS5zZWxlY3RlZFxuXHRcdEBsaW5lRnVuIFt7djogcG9pbnQudiwgdDogcG9pbnQudH0sIHt2OnBvaW50LmR2ICsgcG9pbnQudiwgdDogcG9pbnQudCsxfSwge3Y6IHBvaW50LmR2ICsgcG9pbnQudiwgdDogcG9pbnQudH1dXG5cblx0cmVzaXplOiAoKT0+XG5cdFx0QHdpZHRoID0gQGVsWzBdLmNsaWVudFdpZHRoIC0gQG1hci5sZWZ0IC0gQG1hci5yaWdodFxuXHRcdEBoZWlnaHQgPSBAd2lkdGggKiAuN1xuXHRcdEBWLnJhbmdlIFtAaGVpZ2h0LCAwXVxuXHRcdEBULnJhbmdlIFswLCBAd2lkdGhdXG5cdFx0QHNjb3BlLiRldmFsQXN5bmMoKVxuXG5cbmRlciA9ICgpLT5cblx0ZGlyZWN0aXZlID0gXG5cdFx0Y29udHJvbGxlckFzOiAndm0nXG5cdFx0c2NvcGU6IHt9XG5cdFx0dGVtcGxhdGU6IHRlbXBsYXRlXG5cdFx0dGVtcGxhdGVOYW1lc3BhY2U6ICdzdmcnXG5cdFx0Y29udHJvbGxlcjogWyckc2NvcGUnLCckZWxlbWVudCcsICckd2luZG93JywgQ3RybF1cblxubW9kdWxlLmV4cG9ydHMgPSBkZXJcbiIsIkRhdGEgPSByZXF1aXJlICcuL3Bsb3REYXRhJ1xuYW5ndWxhciA9IHJlcXVpcmUgJ2FuZ3VsYXInXG5kMyA9IHJlcXVpcmUgJ2QzJ1xucmVxdWlyZSAnLi4vLi4vaGVscGVycydcblxudGVtcGxhdGUgPSAnJydcblx0PGgzPlBsb3QgQjwvaDM+XG5cdDxzdmcgbmctaW5pdD0ndm0ucmVzaXplKCknICB3aWR0aD0nMTAwJScgbmctYXR0ci1oZWlnaHQ9J3t7dm0uc3ZnX2hlaWdodH19Jz5cblx0XHQ8ZGVmcz5cblx0XHRcdDxjbGlwcGF0aCBpZD0ncGxvdEInPlxuXHRcdFx0XHQ8cmVjdCBuZy1hdHRyLXdpZHRoPSd7e3ZtLndpZHRofX0nIG5nLWF0dHItaGVpZ2h0PSd7e3ZtLmhlaWdodH19Jz48L3JlY3Q+XG5cdFx0XHQ8L2NsaXBwYXRoPlxuXHRcdDwvZGVmcz5cblx0XHQ8ZyBjbGFzcz0nYm9pbGVycGxhdGUnIHNoaWZ0ZXI9J1t2bS5tYXIubGVmdCwgdm0ubWFyLnRvcF0nPlxuXHRcdFx0PHJlY3QgY2xhc3M9J2JhY2tncm91bmQnIG5nLWF0dHItd2lkdGg9J3t7dm0ud2lkdGh9fScgbmctYXR0ci1oZWlnaHQ9J3t7dm0uaGVpZ2h0fX0nPjwvcmVjdD5cblx0XHRcdDxnIHZlci1heGlzLWRlciB3aWR0aD0ndm0ud2lkdGgnIHNjYWxlPSd2bS5EVicgZnVuPSd2bS52ZXJBeEZ1bic+PC9nPlxuXHRcdFx0PGcgaG9yLWF4aXMtZGVyIGhlaWdodD0ndm0uaGVpZ2h0JyBzY2FsZT0ndm0uVicgZnVuPSd2bS5ob3JBeEZ1bicgc2hpZnRlcj0nWzAsdm0uaGVpZ2h0XSc+PC9nPlxuXHRcdDwvZz5cblx0XHQ8ZyBjbGFzcz0nbWFpbicgY2xpcC1wYXRoPVwidXJsKCNwbG90QilcIiBzaGlmdGVyPSdbdm0ubWFyLmxlZnQsIHZtLm1hci50b3BdJz5cblx0XHRcdDxsaW5lIGNsYXNzPSd6ZXJvLWxpbmUnIHgxPScwJyBuZy1hdHRyLXgyPSd7e3ZtLndpZHRofX0nIG5nLWF0dHIteTE9J3t7dm0uRFYoMCl9fScgbmctYXR0ci15Mj0ne3t2bS5EVigwKX19JyAvPlxuXHRcdFx0PGxpbmUgY2xhc3M9J3plcm8tbGluZScgeTE9JzAnIG5nLWF0dHIteTI9J3t7dm0uaGVpZ2h0fX0nIG5nLWF0dHIteDE9J3t7dm0uVigwKX19JyBuZy1hdHRyLXgyPSd7e3ZtLlYoMCl9fScgLz5cblx0XHRcdDxwYXRoIG5nLWF0dHItZD0ne3t2bS5saW5lRnVuKHZtLkRhdGEudGFyZ2V0X2RhdGEpfX0nIGNsYXNzPSdmdW4gdGFyZ2V0JyAvPlxuXHRcdFx0PHBhdGggbmctYXR0ci1kPSd7e3ZtLmxpbmVGdW4odm0uZG90cyl9fScgY2xhc3M9J2Z1biBkdicgLz5cblx0XHRcdDxnIG5nLXJlcGVhdD0nZG90IGluIHZtLmRvdHMgdHJhY2sgYnkgZG90LmlkJyBzaGlmdGVyPSdbdm0uVihkb3Qudiksdm0uRFYoZG90LmR2KV0nIGRvdC1iLWRlcj48L2c+XG5cdFx0PC9nPlxuXHQ8L3N2Zz5cbicnJ1xuXG5jbGFzcyBDdHJsXG5cdGNvbnN0cnVjdG9yOiAoQHNjb3BlLCBAZWwsIEB3aW5kb3cpLT5cblx0XHRAbWFyID0gXG5cdFx0XHRsZWZ0OiAyNVxuXHRcdFx0dG9wOiAxMFxuXHRcdFx0cmlnaHQ6IDIwXG5cdFx0XHRib3R0b206IDI1XG5cblx0XHRARFYgPSBkMy5zY2FsZS5saW5lYXIoKS5kb21haW4gWy01LCAxXVxuXG5cdFx0QFYgPSBkMy5zY2FsZS5saW5lYXIoKS5kb21haW4gWy0uNSw0XVxuXG5cdFx0QGhvckF4RnVuID0gZDMuc3ZnLmF4aXMoKVxuXHRcdFx0LnNjYWxlIEBWXG5cdFx0XHQudGlja3MgNFxuXHRcdFx0Lm9yaWVudCAnYm90dG9tJ1xuXG5cdFx0QHZlckF4RnVuID0gZDMuc3ZnLmF4aXMoKVxuXHRcdFx0LnNjYWxlIEBEVlxuXHRcdFx0LnRpY2tzIDVcblx0XHRcdC5vcmllbnQgJ2xlZnQnXG5cblx0XHRARGF0YSA9IERhdGFcblxuXHRcdEBsaW5lRnVuID0gZDMuc3ZnLmxpbmUoKVxuXHRcdFx0LnkgKGQpPT4gQERWIGQuZHZcblx0XHRcdC54IChkKT0+IEBWIGQudlxuXG5cdFx0YW5ndWxhci5lbGVtZW50IEB3aW5kb3dcblx0XHRcdC5vbiAncmVzaXplJywgQHJlc2l6ZVxuXG5cdEBwcm9wZXJ0eSAnc3ZnX2hlaWdodCcsIGdldDogLT4gQGhlaWdodCArIEBtYXIudG9wICsgQG1hci5ib3R0b21cblxuXHRAcHJvcGVydHkgJ2RvdHMnLCBnZXQ6LT5cblx0XHREYXRhLmRvdHMuZmlsdGVyIChkKS0+XG5cdFx0XHRkLmlkICE9J2ZpcnN0J1xuXG5cdGhpbGl0ZTogKHYpLT5cblx0XHRkMy5zZWxlY3QgdGhpc1xuXHRcdFx0LnRyYW5zaXRpb24oKVxuXHRcdFx0LmR1cmF0aW9uIDEwMFxuXHRcdFx0LmVhc2UgJ2N1YmljJ1xuXHRcdFx0LmF0dHIgJ3InICwgaWYgdiB0aGVuIDYgZWxzZSA0XG5cblx0cmVzaXplOiAoKT0+XG5cdFx0QHdpZHRoID0gQGVsWzBdLmNsaWVudFdpZHRoIC0gQG1hci5sZWZ0IC0gQG1hci5yaWdodFxuXHRcdEBoZWlnaHQgPSBAd2lkdGggKiAuN1xuXHRcdEBEVi5yYW5nZSBbQGhlaWdodCwgMF1cblx0XHRAVi5yYW5nZSBbMCwgQHdpZHRoXSBcblx0XHRAc2NvcGUuJGV2YWxBc3luYygpXG5cblxuZGVyID0gKCktPlxuXHRkaXJlY3RpdmUgPSBcblx0XHRjb250cm9sbGVyQXM6ICd2bSdcblx0XHRzY29wZToge31cblx0XHR0ZW1wbGF0ZTogdGVtcGxhdGVcblx0XHR0ZW1wbGF0ZU5hbWVzcGFjZTogJ3N2Zydcblx0XHRjb250cm9sbGVyOiBbJyRzY29wZScsJyRlbGVtZW50JywnJHdpbmRvdycsIEN0cmxdXG5cbm1vZHVsZS5leHBvcnRzID0gZGVyXG4iLCJfID0gcmVxdWlyZSAnbG9kYXNoJ1xue2V4cCwgc3FydCwgYXRhbiwgbWluLCBtYXh9ID0gTWF0aFxuXG5jbGFzcyBEb3Rcblx0Y29uc3RydWN0b3I6IChAdCwgQHYpLT5cblx0XHRAaWQgPSBfLnVuaXF1ZUlkICdkb3QnXG5cdFx0QGhpbGl0ZWQgPSBmYWxzZVxuXG5jbGFzcyBTZXJ2aWNlXG5cdGNvbnN0cnVjdG9yOiAoKS0+XG5cdFx0Zmlyc3REb3QgPSBuZXcgRG90IDAgLCA0XG5cdFx0Zmlyc3REb3QuaWQgPSAnZmlyc3QnXG5cdFx0QGRvdHMgPSBbIGZpcnN0RG90LCBcblx0XHRcdG5ldyBEb3QgMSwgNCpleHAoLTEpXG5cdFx0IF1cblx0XHQgXG5cdFx0QGZpcnN0ID0gZmlyc3REb3RcblxuXHRcdEBzZWxlY3RlZCA9IGZpcnN0RG90XG5cblx0XHRAdGFyZ2V0X2RhdGEgPSBfLnJhbmdlIDAsIDgsIDEvNTBcblx0XHRcdC5tYXAgKHQpLT4gXG5cdFx0XHRcdHJlcyAgPSBcblx0XHRcdFx0XHR0OiB0XG5cdFx0XHRcdFx0djogNCogZXhwKC10KVxuXHRcdFx0XHRcdGR2OiAtNCAqIGV4cCgtdClcblxuXHRhZGRfZG90OiAodCwgdiktPlxuXHRcdEBzZWxlY3RlZCA9IG5ldyBEb3QgdCx2XG5cdFx0QGRvdHMucHVzaCBAc2VsZWN0ZWRcblx0XHRAdXBkYXRlX2RvdChAc2VsZWN0ZWQsIHQsIHYpXG5cblx0cmVtb3ZlX2RvdDogKGRvdCktPlxuXHRcdEBkb3RzLnNwbGljZSBAZG90cy5pbmRleE9mKGRvdCksIDFcblxuXHR1cGRhdGVfZG90czogLT4gXG5cdFx0QGRvdHMuc29ydCAoYSxiKS0+IGEudCAtIGIudFxuXHRcdEBkb3RzLmZvckVhY2ggKGRvdCwgaSwgayktPlxuXHRcdFx0cHJldiA9IGtbaS0xXVxuXHRcdFx0ZG90LmR2ID0gaWYgcHJldiB0aGVuIChkb3QudiAtIHByZXYudikvbWF4KGRvdC50IC0gcHJldi50LCAuMDEpIGVsc2UgMFxuXG5cdHVwZGF0ZV9kb3Q6IChkb3QsIHQsIHYpLT5cblx0XHRpZiBkb3QuaWQgPT0gJ2ZpcnN0J1xuXHRcdFx0cmV0dXJuXG5cdFx0QHNlbGVjdGVkID0gZG90XG5cdFx0ZG90LnQgPSB0XG5cdFx0ZG90LnYgPSB2XG5cdFx0QHVwZGF0ZV9kb3RzKClcblxuc2VydmljZSA9IG5ldyBTZXJ2aWNlXG5cbm1vZHVsZS5leHBvcnRzID0gc2VydmljZSIsImFuZ3VsYXIgPSByZXF1aXJlICdhbmd1bGFyJ1xuZDMgPSByZXF1aXJlICdkMydcbnJlcXVpcmUgJy4uLy4uL2hlbHBlcnMnXG5tYXRoID0gcmVxdWlyZSAnbWF0aGpzJ1xuXyA9IHJlcXVpcmUgJ2xvZGFzaCdcbnRlbXBsYXRlID0gJycnXG5cdDxzdmcgbmctaW5pdD0ndm0ucmVzaXplKCknIHdpZHRoPScxMDAlJyBuZy1hdHRyLWhlaWdodD0ne3t2bS5zdmdfaGVpZ2h0fX0nPlxuXHRcdDxkZWZzPlxuXHRcdFx0PGNsaXBwYXRoIGlkPSdyZWcnPlxuXHRcdFx0XHQ8cmVjdCBuZy1hdHRyLXdpZHRoPSd7e3ZtLndpZHRofX0nIG5nLWF0dHItaGVpZ2h0PSd7e3ZtLmhlaWdodH19Jz48L3JlY3Q+XG5cdFx0XHQ8L2NsaXBwYXRoPlxuXHRcdDwvZGVmcz5cblx0XHQ8ZyBjbGFzcz0nYm9pbGVycGxhdGUnIHNoaWZ0ZXI9J1t2bS5tYXIubGVmdCwgdm0ubWFyLnRvcF0nPlxuXHRcdFx0PHJlY3QgY2xhc3M9J2JhY2tncm91bmQnIG5nLWF0dHItd2lkdGg9J3t7dm0ud2lkdGh9fScgbmctYXR0ci1oZWlnaHQ9J3t7dm0uaGVpZ2h0fX0nIG5nLW1vdXNlbW92ZT0ndm0ubW92ZSgkZXZlbnQpJyAvPlxuXHRcdFx0PGcgdmVyLWF4aXMtZGVyIHdpZHRoPSd2bS53aWR0aCcgc2NhbGU9J3ZtLlYnIGZ1bj0ndm0udmVyQXhGdW4nPjwvZz5cblx0XHRcdDxnIGhvci1heGlzLWRlciBoZWlnaHQ9J3ZtLmhlaWdodCcgc2NhbGU9J3ZtLlQnIGZ1bj0ndm0uaG9yQXhGdW4nIHNoaWZ0ZXI9J1swLHZtLmhlaWdodF0nPjwvZz5cblx0XHQ8L2c+XG5cdFx0PGcgY2xhc3M9J21haW4nIGNsaXAtcGF0aD1cInVybCgjcmVnKVwiIHNoaWZ0ZXI9J1t2bS5tYXIubGVmdCwgdm0ubWFyLnRvcF0nPlxuXHRcdFx0PGxpbmUgY2xhc3M9J3plcm8tbGluZScgeDE9JzAnIG5nLWF0dHIteDI9J3t7dm0ud2lkdGh9fScgbmctYXR0ci15MT0ne3t2bS5WKDApfX0nIG5nLWF0dHIteTI9J3t7dm0uVigwKX19JyAvPlxuXHRcdFx0PHBhdGggbmctYXR0ci1kPSd7e3ZtLmxpbmVGdW4odm0uZGF0YSl9fScgY2xhc3M9J2Z1biB2JyAvPlxuXHRcdFx0PGNpcmNsZSByPSczcHgnIHNoaWZ0ZXI9J1t2bS5UKHZtLnBvaW50LnQpLCB2bS5WKHZtLnBvaW50LnYpXScgY2xhc3M9J3BvaW50Jy8+XG5cdFx0PC9nPlxuXHQ8L3N2Zz5cbicnJ1xuXG5jbGFzcyByZWdDdHJsXG5cdGNvbnN0cnVjdG9yOiAoQHNjb3BlLCBAZWwsIEB3aW5kb3cpLT5cblx0XHRAbWFyID0gXG5cdFx0XHRsZWZ0OiAzMFxuXHRcdFx0dG9wOiAyMFxuXHRcdFx0cmlnaHQ6IDIwXG5cdFx0XHRib3R0b206IDI1XG5cblx0XHRAViA9IGQzLnNjYWxlLmxpbmVhcigpLmRvbWFpbiBbLTEsMV1cblx0XHRAVCA9IGQzLnNjYWxlLmxpbmVhcigpLmRvbWFpbiBbMCwzXVxuXG5cdFx0QGhvckF4RnVuID0gZDMuc3ZnLmF4aXMoKVxuXHRcdFx0LnNjYWxlIEBUXG5cdFx0XHQudGlja1ZhbHVlcyBbMCwxLDIsM11cblx0XHRcdC5vcmllbnQgJ2JvdHRvbSdcblxuXHRcdEB2ZXJBeEZ1biA9IGQzLnN2Zy5heGlzKClcblx0XHRcdC5zY2FsZSBAVlxuXHRcdFx0LnRpY2tzIDVcblx0XHRcdC5vcmllbnQgJ2xlZnQnXG5cdFx0XG5cdFx0QGxpbmVGdW4gPSBkMy5zdmcubGluZSgpXG5cdFx0XHQueSAoZCk9PiBAViBkLnZcblx0XHRcdC54IChkKT0+IEBUIGQudFxuXG5cdFx0cGFyc2VyID0gbWF0aC5wYXJzZXIoKVxuXHRcdHBhcnNlci5ldmFsICd2KHQpID0gNSogKHQtLjUpICogKHQtMSkgKiAodC0yKV4yJ1xuXHRcdHYgPSBwYXJzZXIuZ2V0ICd2J1xuXG5cblx0XHRAZGF0YSA9IF8ucmFuZ2UgMCAsIDMgLCAxLzUwXG5cdFx0XHQubWFwICh0KS0+XG5cdFx0XHRcdHJlcyA9IFxuXHRcdFx0XHRcdHY6IHYodClcblx0XHRcdFx0XHR0OiB0XG5cblx0XHRAcG9pbnQgPSBfLnNhbXBsZSBAZGF0YVxuXG5cdFx0YW5ndWxhci5lbGVtZW50IEB3aW5kb3dcblx0XHRcdC5vbiAncmVzaXplJywgQHJlc2l6ZVxuXG5cdFx0QG1vdmUgPSAoZXZlbnQpID0+XG5cdFx0XHRyZWN0ID0gZXZlbnQudGFyZ2V0LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpXG5cdFx0XHR0ID0gQFQuaW52ZXJ0IChldmVudC54IC0gcmVjdC5sZWZ0KVxuXHRcdFx0QHBvaW50ID0gXG5cdFx0XHRcdHQ6IHRcblx0XHRcdFx0djogdih0KVxuXHRcdFx0QHNjb3BlLiRldmFsQXN5bmMoKVxuXG5cdEBwcm9wZXJ0eSAnc3ZnX2hlaWdodCcsIGdldDogLT4gQGhlaWdodCArIEBtYXIudG9wICsgQG1hci5ib3R0b21cblxuXHRyZXNpemU6ICgpPT5cblx0XHRAd2lkdGggPSBAZWxbMF0uY2xpZW50V2lkdGggLSBAbWFyLmxlZnQgLSBAbWFyLnJpZ2h0XG5cdFx0QGhlaWdodCA9IEBlbFswXS5wYXJlbnRFbGVtZW50LmNsaWVudEhlaWdodCAtIEBtYXIubGVmdCAtIEBtYXIucmlnaHRcblx0XHRAVi5yYW5nZSBbQGhlaWdodCwgMF1cblx0XHRAVC5yYW5nZSBbMCwgQHdpZHRoXVxuXHRcdEBzY29wZS4kZXZhbEFzeW5jKClcblxuZGVyID0gKCktPlxuXHRkaXJlY3RpdmUgPSBcblx0XHRjb250cm9sbGVyQXM6ICd2bSdcblx0XHRzY29wZToge31cblx0XHR0ZW1wbGF0ZTogdGVtcGxhdGVcblx0XHR0ZW1wbGF0ZU5hbWVzcGFjZTogJ3N2Zydcblx0XHRjb250cm9sbGVyOiBbJyRzY29wZScsJyRlbGVtZW50JywgJyR3aW5kb3cnLCByZWdDdHJsXVxuXG5tb2R1bGUuZXhwb3J0cyA9IGRlclxuIiwiZHJhZyA9ICgkcGFyc2UpLT5cblx0ZGlyZWN0aXZlID0gXG5cdFx0bGluazogKHNjb3BlLGVsLGF0dHIpLT5cblx0XHRcdHNlbCA9IGQzLnNlbGVjdChlbFswXSlcblx0XHRcdHNlbC5jYWxsKCRwYXJzZShhdHRyLmJlaGF2aW9yKShzY29wZSkpXG5cbm1vZHVsZS5leHBvcnRzID0gZHJhZyIsIm1vZHVsZS5leHBvcnRzID0gKCRwYXJzZSktPlxuXHQoc2NvcGUsIGVsLCBhdHRyKS0+XG5cdFx0ZDMuc2VsZWN0KGVsWzBdKS5kYXR1bSAkcGFyc2UoYXR0ci5kYXR1bSkoc2NvcGUpIiwiXG50ZW1wbGF0ZSA9ICcnJ1xuXHQ8Y2lyY2xlIGNsYXNzPSdkb3QgbGFyZ2UnPjwvY2lyY2xlPlxuXHQ8Y2lyY2xlIGNsYXNzPSdkb3Qgc21hbGwnIHI9JzQnPjwvY2lyY2xlPlxuJycnXG5cbmRlciA9ICgpLT5cblx0ZGlyZWN0aXZlID0gXG5cdFx0dGVtcGxhdGU6IHRlbXBsYXRlXG5cdFx0cmVzdHJpY3Q6ICdBJ1xuXHRcdGxpbms6IChzY29wZSxlbCxhdHRyKS0+XG5cdFx0XHRyYWQgPSAxMCAjdGhlIHJhZGl1cyBvZiB0aGUgbGFyZ2UgY2lyY2xlIG5hdHVyYWxseVxuXHRcdFx0c2VsID0gZDMuc2VsZWN0IGVsWzBdXG5cdFx0XHRiaWcgPSBzZWwuc2VsZWN0ICdjaXJjbGUuZG90LmxhcmdlJ1xuXHRcdFx0XHQuYXR0ciAncicsIHJhZFxuXHRcdFx0Y2lyYyA9IHNlbC5zZWxlY3QgJ2NpcmNsZS5kb3Quc21hbGwnXG5cblx0XHRcdG1vdXNlb3ZlciA9ICgpLT5cblx0XHRcdFx0c2NvcGUuZG90LmhpbGl0ZWQgPSB0cnVlXG5cdFx0XHRcdHNjb3BlLiRldmFsQXN5bmMoKVxuXHRcdFx0XHRiaWcudHJhbnNpdGlvbiAnZ3Jvdydcblx0XHRcdFx0XHQuZHVyYXRpb24gMTUwXG5cdFx0XHRcdFx0LmVhc2UgJ2N1YmljLW91dCdcblx0XHRcdFx0XHQuYXR0ciAncicgLCByYWQgKiAxLjVcblx0XHRcdFx0XHQudHJhbnNpdGlvbigpXG5cdFx0XHRcdFx0LmR1cmF0aW9uIDE1MFxuXHRcdFx0XHRcdC5lYXNlICdjdWJpYy1pbidcblx0XHRcdFx0XHQuYXR0ciAncicgLCByYWQgKiAxLjNcblx0XHRcdFx0XHRcblx0XHRcdGJpZy5vbiAnbW91c2VvdmVyJywgbW91c2VvdmVyXG5cdFx0XHRcdC5vbiAnY29udGV4dG1lbnUnLCAtPiBldmVudC5wcmV2ZW50RGVmYXVsdCgpXG5cdFx0XHRcdC5vbiAnbW91c2Vkb3duJywgLT5cblx0XHRcdFx0XHRiaWcudHJhbnNpdGlvbiAnZ3Jvdydcblx0XHRcdFx0XHRcdC5kdXJhdGlvbiAxNTBcblx0XHRcdFx0XHRcdC5lYXNlICdjdWJpYydcblx0XHRcdFx0XHRcdC5hdHRyICdyJywgcmFkKjEuN1xuXHRcdFx0XHQub24gJ21vdXNldXAnLCAoKS0+XG5cdFx0XHRcdFx0YmlnLnRyYW5zaXRpb24gJ2dyb3cnXG5cdFx0XHRcdFx0XHQuZHVyYXRpb24gMTUwXG5cdFx0XHRcdFx0XHQuZWFzZSAnY3ViaWMtaW4nXG5cdFx0XHRcdFx0XHQuYXR0ciAncicsIHJhZCoxLjNcblx0XHRcdFx0Lm9uICdtb3VzZW91dCcgLCAoKS0+XG5cdFx0XHRcdFx0c2NvcGUuZG90LmhpbGl0ZWQgPSBmYWxzZVxuXHRcdFx0XHRcdHNjb3BlLiRldmFsQXN5bmMoKVxuXHRcdFx0XHRcdGJpZy50cmFuc2l0aW9uICdzaHJpbmsnXG5cdFx0XHRcdFx0XHQuZHVyYXRpb24gMzUwXG5cdFx0XHRcdFx0XHQuZWFzZSAnYm91bmNlLW91dCdcblx0XHRcdFx0XHRcdC5hdHRyICdyJyAsIHJhZFxuXG5cdFx0XHRzY29wZS4kd2F0Y2ggJ2RvdC5oaWxpdGVkJyAsICh2KS0+XG5cdFx0XHRcdGlmIHZcblx0XHRcdFx0XHRjaXJjLnRyYW5zaXRpb24oKVxuXHRcdFx0XHRcdFx0LmR1cmF0aW9uIDE1MFxuXHRcdFx0XHRcdFx0LmVhc2UgJ2N1YmljLW91dCdcblx0XHRcdFx0XHRcdC5zdHlsZVxuXHRcdFx0XHRcdFx0XHQnc3Ryb2tlLXdpZHRoJzogMi41XG5cdFx0XHRcdFx0XHRcdHN0cm9rZTogJyMyMjInXG5cdFx0XHRcdGVsc2UgXG5cdFx0XHRcdFx0Y2lyYy50cmFuc2l0aW9uKClcblx0XHRcdFx0XHRcdC5kdXJhdGlvbiAxMDBcblx0XHRcdFx0XHRcdC5lYXNlICdjdWJpYydcblx0XHRcdFx0XHRcdC5zdHlsZVxuXHRcdFx0XHRcdFx0XHQnc3Ryb2tlLXdpZHRoJzogMS42XG5cdFx0XHRcdFx0XHRcdHN0cm9rZTogJ3doaXRlJ1xuXG5cbm1vZHVsZS5leHBvcnRzID0gZGVyXG4iLCJ0ZW1wbGF0ZSA9ICcnJ1xuXHQ8Y2lyY2xlIGNsYXNzPSdkb3Qgc21hbGwnIHI9JzQnPjwvY2lyY2xlPlxuJycnXG5cbmRlciA9ICgpLT5cblx0ZGlyZWN0aXZlID0gXG5cdFx0dGVtcGxhdGU6IHRlbXBsYXRlXG5cdFx0cmVzdHJpY3Q6ICdBJ1xuXHRcdGxpbms6IChzY29wZSxlbCxhdHRyKS0+XG5cdFx0XHRzZWwgPSBkMy5zZWxlY3QgZWxbMF1cblx0XHRcdGNpcmMgPSBzZWwuc2VsZWN0ICdjaXJjbGUuZG90LnNtYWxsJ1xuXG5cdFx0XHRzY29wZS4kd2F0Y2ggJ2RvdC5oaWxpdGVkJyAsICh2KS0+XG5cdFx0XHRcdGlmIHZcblx0XHRcdFx0XHRjaXJjLnRyYW5zaXRpb24oKVxuXHRcdFx0XHRcdFx0LmR1cmF0aW9uIDE1MFxuXHRcdFx0XHRcdFx0LmVhc2UgJ2N1YmljLW91dCdcblx0XHRcdFx0XHRcdC5zdHlsZVxuXHRcdFx0XHRcdFx0XHQnc3Ryb2tlLXdpZHRoJzogMi41XG5cdFx0XHRcdFx0XHRcdHN0cm9rZTogJyMyMjInXG5cdFx0XHRcdGVsc2UgXG5cdFx0XHRcdFx0Y2lyYy50cmFuc2l0aW9uKClcblx0XHRcdFx0XHRcdC5kdXJhdGlvbiAxMDBcblx0XHRcdFx0XHRcdC5lYXNlICdjdWJpYydcblx0XHRcdFx0XHRcdC5zdHlsZVxuXHRcdFx0XHRcdFx0XHQnc3Ryb2tlLXdpZHRoJzogMS42XG5cdFx0XHRcdFx0XHRcdHN0cm9rZTogJ3doaXRlJ1xuXG5tb2R1bGUuZXhwb3J0cyA9IGRlclxuIiwiZDMgPSByZXF1aXJlICdkMydcbntlbGVtZW50fT0gcmVxdWlyZSAnYW5ndWxhcidcblxuZGVyID0gKCktPiAjZ29lcyBvbiBhIHBhdGggZWxlbWVudFxuXHRkaXJlY3RpdmUgPSBcblx0XHRjb250cm9sbGVyOiAoKS0+XG5cdFx0Y29udHJvbGxlckFzOiAndm0nXG5cdFx0YmluZFRvQ29udHJvbGxlcjogdHJ1ZVxuXHRcdHJlc3RyaWN0OiAnQSdcblx0XHR0ZW1wbGF0ZU5hbWVzcGFjZTogJ3N2Zydcblx0XHRzY29wZTpcblx0XHRcdGRhdGE6ICc9J1xuXHRcdFx0bGluZUZ1bjogJz0nXG5cdFx0XHR3YXRjaDogJz0nXG5cdFx0bGluazogKHNjb3BlLCBlbCwgYXR0ciwgdm0pLT5cblx0XHRcdHNlbCA9IGQzLnNlbGVjdChlbFswXSlcblx0XHRcdHVwZGF0ZSA9ICgpLT4gXG5cdFx0XHRcdHNlbC5hdHRyICdkJywgdm0ubGluZUZ1biB2bS5kYXRhXG5cblx0XHRcdHNjb3BlLiR3YXRjaCAndm0ud2F0Y2gnXG5cdFx0XHRcdCwgdXBkYXRlXG5cdFx0XHRcdCwgdHJ1ZVxuXHRcdFx0ZWxlbWVudCh3aW5kb3cpLm9uICdyZXNpemUnLCB1cGRhdGVcblxubW9kdWxlLmV4cG9ydHMgPSBkZXIiLCJkMyA9IHJlcXVpcmUgJ2QzJ1xuXG5kZXIgPSAoJHBhcnNlKS0+XG5cdGRpcmVjdGl2ZSA9XG5cdFx0bGluazogKHNjb3BlLCBlbCwgYXR0ciktPlxuXHRcdFx0cmVzaGlmdCA9ICh2KS0+IFxuXHRcdFx0XHRkMy5zZWxlY3QgZWxbMF1cblx0XHRcdFx0XHQuYXR0ciAndHJhbnNmb3JtJyAsIFwidHJhbnNsYXRlKCN7dlswXX0sI3t2WzFdfSlcIlxuXG5cdFx0XHRzY29wZS4kd2F0Y2ggKCktPlxuXHRcdFx0XHRcdCRwYXJzZShhdHRyLnNoaWZ0ZXIpKHNjb3BlKVxuXHRcdFx0XHQsIHJlc2hpZnRcblx0XHRcdFx0LCB0cnVlXG5cbm1vZHVsZS5leHBvcnRzID0gZGVyIiwiZDMgPSByZXF1aXJlICdkMydcbmFuZ3VsYXIgPSByZXF1aXJlICdhbmd1bGFyJ1xuXG5kZXIgPSAoJHdpbmRvdyktPlxuXHRkaXJlY3RpdmUgPSBcblx0XHRjb250cm9sbGVyOiBhbmd1bGFyLm5vb3Bcblx0XHRjb250cm9sbGVyQXM6ICd2bSdcblx0XHRiaW5kVG9Db250cm9sbGVyOiB0cnVlXG5cdFx0cmVzdHJpY3Q6ICdBJ1xuXHRcdHRlbXBsYXRlTmFtZXNwYWNlOiAnc3ZnJ1xuXHRcdHNjb3BlOiBcblx0XHRcdHNjYWxlOiAnPSdcblx0XHRcdGhlaWdodDogJz0nXG5cdFx0XHRmdW46ICc9J1xuXHRcdGxpbms6IChzY29wZSwgZWwsIGF0dHIsIHZtKS0+XG5cdFx0XHR4QXhpc0Z1biA9IHZtLmZ1biA/IChkMy5zdmcuYXhpcygpXG5cdFx0XHRcdFx0XHRcdC5zY2FsZSB2bS5zY2FsZVxuXHRcdFx0XHRcdFx0XHQub3JpZW50ICdib3R0b20nKVxuXG5cdFx0XHRzZWwgPSBkMy5zZWxlY3QgZWxbMF1cblx0XHRcdFx0LmNsYXNzZWQgJ3ggYXhpcycsIHRydWVcblxuXHRcdFx0dXBkYXRlID0gKCk9PlxuXHRcdFx0XHR4QXhpc0Z1bi50aWNrU2l6ZSAtdm0uaGVpZ2h0XG5cdFx0XHRcdHNlbC5jYWxsIHhBeGlzRnVuXG5cdFx0XHRcdFxuXHRcdFx0dXBkYXRlKClcblx0XHRcdFx0XG5cdFx0XHRzY29wZS4kd2F0Y2ggJ3ZtLnNjYWxlLmRvbWFpbigpJywgdXBkYXRlICwgdHJ1ZVxuXHRcdFx0c2NvcGUuJHdhdGNoICd2bS5zY2FsZS5yYW5nZSgpJywgdXBkYXRlICwgdHJ1ZVxuXHRcdFx0c2NvcGUuJHdhdGNoICd2bS5oZWlnaHQnLCB1cGRhdGUgLCB0cnVlXG5cbm1vZHVsZS5leHBvcnRzID0gZGVyIiwiZDMgPSByZXF1aXJlICdkMydcbmFuZ3VsYXIgPSByZXF1aXJlICdhbmd1bGFyJ1xuXG5kZXIgPSAoJHdpbmRvdyktPlxuXHRkaXJlY3RpdmUgPSBcblx0XHRjb250cm9sbGVyOiBhbmd1bGFyLm5vb3Bcblx0XHRjb250cm9sbGVyQXM6ICd2bSdcblx0XHRiaW5kVG9Db250cm9sbGVyOiB0cnVlXG5cdFx0cmVzdHJpY3Q6ICdBJ1xuXHRcdHRlbXBsYXRlTmFtZXNwYWNlOiAnc3ZnJ1xuXHRcdHNjb3BlOiBcblx0XHRcdHNjYWxlOiAnPSdcblx0XHRcdHdpZHRoOiAnPSdcblx0XHRcdGZ1bjogJz0nXG5cdFx0bGluazogKHNjb3BlLCBlbCwgYXR0ciwgdm0pLT5cblx0XHRcdHlBeGlzRnVuID0gdm0uZnVuID8gZDMuc3ZnLmF4aXMoKVxuXHRcdFx0XHQuc2NhbGUgdm0uc2NhbGVcblx0XHRcdFx0Lm9yaWVudCAnbGVmdCdcblxuXHRcdFx0c2VsID0gZDMuc2VsZWN0KGVsWzBdKS5jbGFzc2VkKCd5IGF4aXMnLCB0cnVlKVxuXG5cdFx0XHR1cGRhdGUgPSAoKT0+XG5cdFx0XHRcdHlBeGlzRnVuLnRpY2tTaXplKCAtdm0ud2lkdGgpXG5cdFx0XHRcdHNlbC5jYWxsKHlBeGlzRnVuKVxuXG5cdFx0XHR1cGRhdGUoKVxuXHRcdFx0XHRcblx0XHRcdHNjb3BlLiR3YXRjaCAndm0uc2NhbGUuZG9tYWluKCknLCB1cGRhdGUgLCB0cnVlXG5cdFx0XHRzY29wZS4kd2F0Y2ggJ3ZtLnNjYWxlLnJhbmdlKCknLCB1cGRhdGUgLCB0cnVlXG5cdFx0XHQjIHNjb3BlLiR3YXRjaCAndm0ud2lkdGgnLCB1cGRhdGVcblxubW9kdWxlLmV4cG9ydHMgPSBkZXIiLCIndXNlIHN0cmljdCdcblxubW9kdWxlLmV4cG9ydHMudGltZW91dCA9IChmdW4sIHRpbWUpLT5cblx0XHRkMy50aW1lcigoKT0+XG5cdFx0XHRmdW4oKVxuXHRcdFx0dHJ1ZVxuXHRcdCx0aW1lKVxuXG5cbkZ1bmN0aW9uOjpwcm9wZXJ0eSA9IChwcm9wLCBkZXNjKSAtPlxuICBPYmplY3QuZGVmaW5lUHJvcGVydHkgQHByb3RvdHlwZSwgcHJvcCwgZGVzYyJdfQ==
