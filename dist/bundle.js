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

template = '<svg ng-init=\'vm.resize()\' width=\'100%\' ng-attr-height=\'{{vm.svg_height}}\'>\n	<defs>\n		<clippath id=\'reg\'>\n			<rect ng-attr-width=\'{{vm.width}}\' ng-attr-height=\'{{vm.height}}\'></rect>\n		</clippath>\n	</defs>\n	<g class=\'boilerplate\' shifter=\'[vm.mar.left, vm.mar.top]\'>\n		<rect class=\'background\' ng-attr-width=\'{{vm.width}}\' ng-attr-height=\'{{vm.height}}\' ng-mousemove=\'vm.move($event)\' />\n		<g ver-axis-der width=\'vm.width\' scale=\'vm.V\' fun=\'vm.verAxFun\'></g>\n		<g hor-axis-der height=\'vm.height\' scale=\'vm.T\' fun=\'vm.horAxFun\' shifter=\'[0,vm.height]\'></g>\n		<foreignObject width=\'30\' height=\'30\' y=\'17\' shifter=\'[vm.width/2, vm.height]\'>\n				<text class=\'label\' >$t$</text>\n		</foreignObject>\n	</g>\n	<g class=\'main\' clip-path="url(#reg)" shifter=\'[vm.mar.left, vm.mar.top]\'>\n		<line class=\'zero-line\' x1=\'0\' ng-attr-x2=\'{{vm.width}}\' ng-attr-y1=\'{{vm.V(0)}}\' ng-attr-y2=\'{{vm.V(0)}}\' />\n		<path ng-attr-d=\'{{vm.lineFun(vm.data)}}\' class=\'fun v\' />\n		<path ng-attr-d=\'{{vm.triangleData()}}\' class=\'tri\' />\n		<path ng-attr-d=\'{{vm.lineFun([vm.point, {v: vm.point.dv + vm.point.v, t: vm.point.t}])}}\' class=\'tri fun dv\' />\n		<path ng-attr-d=\'{{vm.lineFun([{v: vm.point.dv, t: vm.point.t}, {v: 0, t: vm.point.t}])}}\' class=\'fun dv\' style=\'opacity: .4;\'/>\n		<path ng-attr-d=\'{{vm.lineFun2(vm.data)}}\' class=\'fun dv\' style=\'opacity: .3\' />\n		<circle r=\'3px\'  shifter=\'[vm.T(vm.point.t), vm.V(vm.point.v)]\' class=\'point\'/>\n	</g>\n</svg>';

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
      bottom: 35
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

template = '<h3>Plot A</h3>\n<svg ng-init=\'vm.resize()\' width=\'100%\' ng-attr-height=\'{{vm.svg_height}}\'>\n	<defs>\n		<clippath id=\'plotA\'>\n			<rect ng-attr-width=\'{{vm.width}}\' ng-attr-height=\'{{vm.height}}\'></rect>\n		</clippath>\n	</defs>\n	<g class=\'boilerplate\' shifter=\'[vm.mar.left, vm.mar.top]\'>\n		<rect class=\'background\' ng-attr-width=\'{{vm.width}}\' ng-attr-height=\'{{vm.height}}\' behavior=\'vm.drag_rect\'></rect>\n		<g ver-axis-der width=\'vm.width\' scale=\'vm.V\' fun=\'vm.verAxFun\'></g>\n		<g hor-axis-der height=\'vm.height\' scale=\'vm.T\' fun=\'vm.horAxFun\' shifter=\'[0,vm.height]\'></g>\n		<g hor-axis-der height=\'vm.height\' scale=\'vm.T\' fun=\'vm.horAxFun\' shifter=\'[0,vm.height]\'></g>\n		<foreignObject width=\'30\' height=\'30\' shifter=\'[-31, vm.height/2]\'>\n				<text class=\'label\'>$v$</text>\n		</foreignObject>\n		<foreignObject width=\'30\' height=\'30\' y=\'20\' shifter=\'[vm.width/2, vm.height]\'>\n				<text class=\'label\' >$t$</text>\n		</foreignObject>\n	</g>\n	<g class=\'main\' clip-path="url(#plotA)" shifter=\'[vm.mar.left, vm.mar.top]\'>\n		<line class=\'zero-line\' x1=\'0\' ng-attr-x2=\'{{vm.width}}\' ng-attr-y1=\'{{vm.V(0)}}\' ng-attr-y2=\'{{vm.V(0)}}\' />\n		<line class=\'zero-line\' y1=\'0\' ng-attr-y2=\'{{vm.height}}\' ng-attr-x1=\'{{vm.T(0)}}\' ng-attr-x2=\'{{vm.T(0)}}\' />\n		<g ng-class=\'{hide: !vm.Data.show}\' >\n			<line class=\'tri v\' ng-attr-x1=\'{{vm.T(0)}}\' ng-attr-x2=\'{{vm.T(0)}}\' ng-attr-y1=\'{{vm.V(0)}}\' ng-attr-y2=\'{{vm.V(vm.Data.selected.v)}}\' />\n			<path ng-attr-d=\'{{vm.triangleData()}}\' class=\'tri\' />\n			<path ng-attr-d=\'{{vm.lineFun([vm.point, {v: vm.point.dv + vm.point.v, t: vm.point.t}])}}\' class=\'tri dv\' />\n		</g>\n		<path ng-attr-d=\'{{vm.lineFun(vm.Data.dots)}}\' class=\'fun v\' />\n		<g ng-repeat=\'dot in vm.dots track by dot.id\' datum=dot shifter=\'[vm.T(dot.t),vm.V(dot.v)]\' behavior=\'vm.drag\' dot-der ></g>\n		<circle class=\'dot small\' r=\'4\' shifter=\'[vm.T(vm.Data.first.t),vm.V(vm.Data.first.v)]\' />\n	</g>\n</svg>';

Ctrl = (function() {
  function Ctrl(scope, el, window) {
    this.scope = scope;
    this.el = el;
    this.window = window;
    this.resize = bind(this.resize, this);
    this.on_drag = bind(this.on_drag, this);
    this.mar = {
      left: 30,
      top: 10,
      right: 20,
      bottom: 37
    };
    this.V = d3.scale.linear().domain([-.25, 5]);
    this.T = d3.scale.linear().domain([-.25, 5]);
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
        Data.show = true;
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
        Data.show = false;
        return _this.scope.$evalAsync();
      };
    })(this));
    this.drag = d3.behavior.drag().on('dragstart', (function(_this) {
      return function(dot) {
        Data.show = true;
        event.stopPropagation();
        if (event.which === 3) {
          Data.remove_dot(dot);
          event.preventDefault();
          return _this.scope.$evalAsync();
        }
      };
    })(this)).on('drag', this.on_drag).on('dragend', (function(_this) {
      return function() {
        Data.show = false;
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

template = '<h3>Plot B</h3>\n<svg ng-init=\'vm.resize()\'  width=\'100%\' ng-attr-height=\'{{vm.svg_height}}\'>\n	<defs>\n		<clippath id=\'plotB\'>\n			<rect ng-attr-width=\'{{vm.width}}\' ng-attr-height=\'{{vm.height}}\'></rect>\n		</clippath>\n	</defs>\n	<g class=\'boilerplate\' shifter=\'[vm.mar.left, vm.mar.top]\'>\n		<rect class=\'background\' ng-attr-width=\'{{vm.width}}\' ng-attr-height=\'{{vm.height}}\'></rect>\n		<g ver-axis-der width=\'vm.width\' scale=\'vm.DV\' fun=\'vm.verAxFun\'></g>\n		<g hor-axis-der height=\'vm.height\' scale=\'vm.V\' fun=\'vm.horAxFun\' shifter=\'[0,vm.height]\'></g>\n		<foreignObject width=\'30\' height=\'30\' shifter=\'[-31, vm.height/2]\'>\n				<text class=\'label\'>$\\dot{v}$</text>\n		</foreignObject>\n		<foreignObject width=\'30\' height=\'30\' y=\'20\' shifter=\'[vm.width/2, vm.height]\'>\n				<text class=\'label\' >$v$</text>\n		</foreignObject>\n	</g>\n	<g class=\'main\' clip-path="url(#plotB)" shifter=\'[vm.mar.left, vm.mar.top]\'>\n		<line class=\'zero-line\' x1=\'0\' ng-attr-x2=\'{{vm.width}}\' ng-attr-y1=\'{{vm.DV(0)}}\' ng-attr-y2=\'{{vm.DV(0)}}\' />\n		<line class=\'zero-line\' y1=\'0\' ng-attr-y2=\'{{vm.height}}\' ng-attr-x1=\'{{vm.V(0)}}\' ng-attr-x2=\'{{vm.V(0)}}\' />\n		<path ng-attr-d=\'{{vm.lineFun(vm.Data.target_data)}}\' class=\'fun target\' />\n		<g ng-class=\'{hide: !vm.Data.show}\' >\n			<line class=\'tri v\' ng-attr-y1=\'{{vm.DV(0)}}\' ng-attr-y2=\'{{vm.DV(0)}}\' ng-attr-x1=\'{{vm.V(0)}}\' ng-attr-x2=\'{{vm.V(vm.Data.selected.v)}}\' />\n			<line class=\'tri dv\' ng-attr-x1=\'{{vm.V(0)}}\' ng-attr-x2=\'{{vm.V(0)}}\' ng-attr-y1=\'{{vm.DV(0)}}\' ng-attr-y2=\'{{vm.DV(vm.Data.selected.dv)}}\' />\n			<path ng-attr-d=\'{{vm.lineFun(vm.Data.target_data)}}\' class=\'fun correct\' ng-class=\'{hide: !vm.Data.correct}\' />\n		</g>\n		<path ng-attr-d=\'{{vm.lineFun(vm.dots)}}\' class=\'fun dv\' />\n		<g ng-repeat=\'dot in vm.dots track by dot.id\' shifter=\'[vm.V(dot.v),vm.DV(dot.dv)]\' dot-b-der></g>\n	</g>\n</svg>';

Ctrl = (function() {
  function Ctrl(scope, el, window) {
    this.scope = scope;
    this.el = el;
    this.window = window;
    this.resize = bind(this.resize, this);
    this.mar = {
      left: 30,
      top: 10,
      right: 20,
      bottom: 37
    };
    this.DV = d3.scale.linear().domain([-5, .25]);
    this.V = d3.scale.linear().domain([-.25, 4]);
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
    this.dots = [firstDot, new Dot(.3, 4 * exp(-.3))];
    this.correct = false;
    this.first = firstDot;
    this.selected = firstDot;
    this.show = false;
    this.target_data = _.range(0, 8, 1 / 50).map(function(t) {
      var res;
      return res = {
        t: t,
        v: 4 * exp(-t),
        dv: -4 * exp(-t)
      };
    });
    this.update_dots();
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
    this.update_dots();
    return this.correct = Math.abs(this.selected.v + this.selected.dv) < 0.1;
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

template = '<svg ng-init=\'vm.resize()\' width=\'100%\' ng-attr-height=\'{{vm.svg_height}}\'>\n	<defs>\n		<clippath id=\'reg\'>\n			<rect ng-attr-width=\'{{vm.width}}\' ng-attr-height=\'{{vm.height}}\'></rect>\n		</clippath>\n	</defs>\n	<g class=\'boilerplate\' shifter=\'[vm.mar.left, vm.mar.top]\'>\n		<rect class=\'background\' ng-attr-width=\'{{vm.width}}\' ng-attr-height=\'{{vm.height}}\' ng-mousemove=\'vm.move($event)\' />\n		<g ver-axis-der width=\'vm.width\' scale=\'vm.V\' fun=\'vm.verAxFun\'></g>\n		<g hor-axis-der height=\'vm.height\' scale=\'vm.T\' fun=\'vm.horAxFun\' shifter=\'[0,vm.height]\'></g>\n		<foreignObject width=\'30\' height=\'30\' y=\'17\' shifter=\'[vm.width/2, vm.height]\'>\n				<text class=\'label\' >$t$</text>\n		</foreignObject>\n	</g>\n	<g class=\'main\' clip-path="url(#reg)" shifter=\'[vm.mar.left, vm.mar.top]\'>\n		<line class=\'zero-line\' ng-class=\'{"correct": vm.correct}\' x1=\'0\' ng-attr-x2=\'{{vm.width}}\' ng-attr-y1=\'{{vm.V(0)}}\' ng-attr-y2=\'{{vm.V(0)}}\' />\n		<line class=\'tri v\' ng-attr-x1=\'{{vm.T(vm.point.t)}}\' ng-attr-x2=\'{{vm.T(vm.point.t)}}\' ng-attr-y1=\'{{vm.V(0)}}\' ng-attr-y2=\'{{vm.V(vm.point.v)}}\' />\n		<path ng-attr-d=\'{{vm.lineFun(vm.data)}}\' class=\'fun v\' />\n		<circle r=\'3px\' shifter=\'[vm.T(vm.point.t), vm.V(vm.point.v)]\' class=\'point\'/>\n	</g>\n</svg>';

regCtrl = (function() {
  function regCtrl(scope, el, window) {
    var parser, vFun;
    this.scope = scope;
    this.el = el;
    this.window = window;
    this.resize = bind(this.resize, this);
    this.mar = {
      left: 30,
      top: 20,
      right: 20,
      bottom: 35
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
    vFun = parser.get('v');
    this.data = _.range(0, 3, 1 / 50).map(function(t) {
      var res;
      return res = {
        v: vFun(t),
        t: t
      };
    });
    this.point = _.sample(this.data);
    this.correct = false;
    angular.element(this.window).on('resize', this.resize);
    this.move = (function(_this) {
      return function(event) {
        var rect, t, v;
        rect = event.target.getBoundingClientRect();
        t = _this.T.invert(event.x - rect.left);
        v = vFun(t);
        _this.point = {
          t: t,
          v: v
        };
        _this.correct = Math.abs(_this.point.v) <= 0.05;
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
        scope.vm.Data.selected = scope.dot;
        scope.vm.Data.show = true;
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
        scope.vm.Data.show = false;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvbGV3aXMvUmVzZWFyY2gvZGlmZkVRX25ldy9hcHAvYXBwLmNvZmZlZSIsIi9Vc2Vycy9sZXdpcy9SZXNlYXJjaC9kaWZmRVFfbmV3L2FwcC9jb21wb25lbnRzL2NhcnQvY2FydEJ1dHRvbnMuY29mZmVlIiwiL1VzZXJzL2xld2lzL1Jlc2VhcmNoL2RpZmZFUV9uZXcvYXBwL2NvbXBvbmVudHMvY2FydC9jYXJ0RGF0YS5jb2ZmZWUiLCIvVXNlcnMvbGV3aXMvUmVzZWFyY2gvZGlmZkVRX25ldy9hcHAvY29tcG9uZW50cy9jYXJ0L2NhcnRQbG90LmNvZmZlZSIsIi9Vc2Vycy9sZXdpcy9SZXNlYXJjaC9kaWZmRVFfbmV3L2FwcC9jb21wb25lbnRzL2Rlcml2YXRpdmUvZGVyaXZhdGl2ZS5jb2ZmZWUiLCIvVXNlcnMvbGV3aXMvUmVzZWFyY2gvZGlmZkVRX25ldy9hcHAvY29tcG9uZW50cy9wbG90L3Bsb3RBLmNvZmZlZSIsIi9Vc2Vycy9sZXdpcy9SZXNlYXJjaC9kaWZmRVFfbmV3L2FwcC9jb21wb25lbnRzL3Bsb3QvcGxvdEIuY29mZmVlIiwiL1VzZXJzL2xld2lzL1Jlc2VhcmNoL2RpZmZFUV9uZXcvYXBwL2NvbXBvbmVudHMvcGxvdC9wbG90RGF0YS5jb2ZmZWUiLCIvVXNlcnMvbGV3aXMvUmVzZWFyY2gvZGlmZkVRX25ldy9hcHAvY29tcG9uZW50cy9yZWd1bGFyL3JlZ3VsYXIuY29mZmVlIiwiL1VzZXJzL2xld2lzL1Jlc2VhcmNoL2RpZmZFUV9uZXcvYXBwL2RpcmVjdGl2ZXMvYmVoYXZpb3IuY29mZmVlIiwiL1VzZXJzL2xld2lzL1Jlc2VhcmNoL2RpZmZFUV9uZXcvYXBwL2RpcmVjdGl2ZXMvZGF0dW0uY29mZmVlIiwiL1VzZXJzL2xld2lzL1Jlc2VhcmNoL2RpZmZFUV9uZXcvYXBwL2RpcmVjdGl2ZXMvZG90LmNvZmZlZSIsIi9Vc2Vycy9sZXdpcy9SZXNlYXJjaC9kaWZmRVFfbmV3L2FwcC9kaXJlY3RpdmVzL2RvdEIuY29mZmVlIiwiL1VzZXJzL2xld2lzL1Jlc2VhcmNoL2RpZmZFUV9uZXcvYXBwL2RpcmVjdGl2ZXMvbGluZS5jb2ZmZWUiLCIvVXNlcnMvbGV3aXMvUmVzZWFyY2gvZGlmZkVRX25ldy9hcHAvZGlyZWN0aXZlcy9zaGlmdGVyLmNvZmZlZSIsIi9Vc2Vycy9sZXdpcy9SZXNlYXJjaC9kaWZmRVFfbmV3L2FwcC9kaXJlY3RpdmVzL3hBeGlzLmNvZmZlZSIsIi9Vc2Vycy9sZXdpcy9SZXNlYXJjaC9kaWZmRVFfbmV3L2FwcC9kaXJlY3RpdmVzL3lBeGlzLmNvZmZlZSIsIi9Vc2Vycy9sZXdpcy9SZXNlYXJjaC9kaWZmRVFfbmV3L2FwcC9oZWxwZXJzLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBLFlBQUEsQ0FBQTtBQUFBLElBQUEsb0xBQUE7O0FBQUEsT0FDQSxHQUFVLE9BQUEsQ0FBUSxTQUFSLENBRFYsQ0FBQTs7QUFBQSxFQUVBLEdBQUssT0FBQSxDQUFRLElBQVIsQ0FGTCxDQUFBOztBQUFBLEtBTUEsR0FBUSxPQUFBLENBQVEsb0JBQVIsQ0FOUixDQUFBOztBQUFBLE1BT0EsR0FBUyxPQUFBLENBQVEsa0JBQVIsQ0FQVCxDQUFBOztBQUFBLE9BUUEsR0FBVSxPQUFBLENBQVEsb0JBQVIsQ0FSVixDQUFBOztBQUFBLE9BU0EsR0FBVSxPQUFBLENBQVEsb0JBQVIsQ0FUVixDQUFBOztBQUFBLFFBVUEsR0FBVyxPQUFBLENBQVEsdUJBQVIsQ0FWWCxDQUFBOztBQUFBLFdBV0EsR0FBYyxPQUFBLENBQVEsNEJBQVIsQ0FYZCxDQUFBOztBQUFBLGNBWUEsR0FBaUIsT0FBQSxDQUFRLCtCQUFSLENBWmpCLENBQUE7O0FBQUEsT0FhQSxHQUFVLE9BQUEsQ0FBUSxzQkFBUixDQWJWLENBQUE7O0FBQUEsUUFjQSxHQUFXLE9BQUEsQ0FBUSxrQkFBUixDQWRYLENBQUE7O0FBQUEs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QUEsQ0FBQTthQUNBLEtBRlE7SUFBQSxFQUFBO0VBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFULEVBR0MsSUFIRCxFQUR1QjtBQUFBLENBRnpCLENBQUE7O0FBQUEsUUFTUSxDQUFBLFNBQUUsQ0FBQSxRQUFWLEdBQXFCLFNBQUMsSUFBRCxFQUFPLElBQVAsR0FBQTtTQUNuQixNQUFNLENBQUMsY0FBUCxDQUFzQixJQUFDLENBQUEsU0FBdkIsRUFBa0MsSUFBbEMsRUFBd0MsSUFBeEMsRUFEbUI7QUFBQSxDQVRyQixDQUFBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIid1c2Ugc3RyaWN0J1xuYW5ndWxhciA9IHJlcXVpcmUgJ2FuZ3VsYXInXG5kMyA9IHJlcXVpcmUgJ2QzJ1xuIyB0aGlyZExlZnQgPSByZXF1aXJlICcuL2NvbXBvbmVudHMvdGhpcmQvdGhpcmRMZWZ0J1xuIyB0aGlyZEJpZyA9IHJlcXVpcmUgJy4vY29tcG9uZW50cy90aGlyZC90aGlyZEJpZydcbiMgeUF4aXMgPSByZXF1aXJlICcuL2RpcmVjdGl2ZXMveUF4aXMnXG5kYXR1bSA9IHJlcXVpcmUgJy4vZGlyZWN0aXZlcy9kYXR1bSdcbmRvdERlciA9IHJlcXVpcmUgJy4vZGlyZWN0aXZlcy9kb3QnXG5ob3JBeGlzID0gcmVxdWlyZSAnLi9kaXJlY3RpdmVzL3hBeGlzJ1xudmVyQXhpcyA9IHJlcXVpcmUgJy4vZGlyZWN0aXZlcy95QXhpcydcbmJlaGF2aW9yID0gcmVxdWlyZSAnLi9kaXJlY3RpdmVzL2JlaGF2aW9yJ1xuY2FydFBsb3REZXIgPSByZXF1aXJlICcuL2NvbXBvbmVudHMvY2FydC9jYXJ0UGxvdCdcbmNhcnRCdXR0b25zRGVyID0gcmVxdWlyZSAnLi9jb21wb25lbnRzL2NhcnQvY2FydEJ1dHRvbnMnXG5zaGlmdGVyID0gcmVxdWlyZSAnLi9kaXJlY3RpdmVzL3NoaWZ0ZXInXG5tYXRlcmlhbCA9IHJlcXVpcmUgJ2FuZ3VsYXItbWF0ZXJpYWwnXG5wbG90QURlciA9IHJlcXVpcmUgJy4vY29tcG9uZW50cy9wbG90L3Bsb3RBJ1xucGxvdEJEZXIgPSByZXF1aXJlICcuL2NvbXBvbmVudHMvcGxvdC9wbG90QidcbmxpbmVEZXIgPSByZXF1aXJlICcuL2RpcmVjdGl2ZXMvbGluZSdcbnJlZ3VsYXJEZXIgPSByZXF1aXJlICcuL2NvbXBvbmVudHMvcmVndWxhci9yZWd1bGFyJ1xuZGVyaXZhdGl2ZURlciAgPSByZXF1aXJlICcuL2NvbXBvbmVudHMvZGVyaXZhdGl2ZS9kZXJpdmF0aXZlJ1xuZG90QkRlciA9IHJlcXVpcmUgJy4vZGlyZWN0aXZlcy9kb3RCJ1xuYXBwID0gYW5ndWxhci5tb2R1bGUgJ21haW5BcHAnLCBbbWF0ZXJpYWxdXG5cdC5kaXJlY3RpdmUgJ2hvckF4aXNEZXInLCBob3JBeGlzXG5cdC5kaXJlY3RpdmUgJ3ZlckF4aXNEZXInLCB2ZXJBeGlzXG5cdC5kaXJlY3RpdmUgJ2NhcnRQbG90RGVyJywgY2FydFBsb3REZXJcblx0LmRpcmVjdGl2ZSAnY2FydEJ1dHRvbnNEZXInLCBjYXJ0QnV0dG9uc0RlclxuXHQuZGlyZWN0aXZlICdzaGlmdGVyJyAsIHNoaWZ0ZXJcblx0LmRpcmVjdGl2ZSAncGxvdEFEZXInLCBwbG90QURlclxuXHQuZGlyZWN0aXZlICdiZWhhdmlvcicsIGJlaGF2aW9yXG5cdC5kaXJlY3RpdmUgJ2RvdERlcicsIGRvdERlclxuXHQuZGlyZWN0aXZlICdkYXR1bScsIGRhdHVtXG5cdC5kaXJlY3RpdmUgJ2xpbmVEZXInLCBsaW5lRGVyXG5cdC5kaXJlY3RpdmUgJ3Bsb3RCRGVyJyAsIHBsb3RCRGVyXG5cdC5kaXJlY3RpdmUgJ3JlZ3VsYXJEZXInLCByZWd1bGFyRGVyXG5cdC5kaXJlY3RpdmUgJ2Rlcml2YXRpdmVEZXInLCBkZXJpdmF0aXZlRGVyXG5cdC5kaXJlY3RpdmUgJ2RvdEJEZXInLCBkb3RCRGVyXG5cbmxvb3BlciA9IC0+XG4gICAgc2V0VGltZW91dCggKCktPlxuICAgIFx0XHRcdGQzLnNlbGVjdEFsbCAnY2lyY2xlLmRvdC5sYXJnZSdcbiAgICBcdFx0XHRcdC50cmFuc2l0aW9uICdncm93J1xuICAgIFx0XHRcdFx0LmR1cmF0aW9uIDUwMFxuICAgIFx0XHRcdFx0LmVhc2UgJ2N1YmljLW91dCdcbiAgICBcdFx0XHRcdC5hdHRyICd0cmFuc2Zvcm0nLCAnc2NhbGUoIDEuMzQpJ1xuICAgIFx0XHRcdFx0LnRyYW5zaXRpb24gJ3NocmluaydcbiAgICBcdFx0XHRcdC5kdXJhdGlvbiA1MDBcbiAgICBcdFx0XHRcdC5lYXNlICdjdWJpYy1vdXQnXG4gICAgXHRcdFx0XHQuYXR0ciAndHJhbnNmb3JtJywgJ3NjYWxlKCAxLjApJ1xuICAgIFx0XHRcdGxvb3BlcigpXG4gICAgXHRcdCwgMTAwMClcblxubG9vcGVyKClcbiIsIl8gPSByZXF1aXJlICdsb2Rhc2gnXG57ZXhwLCBzcXJ0LCBhdGFufSA9IE1hdGhcbkNhcnQgPSByZXF1aXJlICcuL2NhcnREYXRhJ1xuXG50ZW1wbGF0ZSA9ICcnJ1xuXHQ8ZGl2IGZsZXggbGF5b3V0PSdyb3cnPlxuXHRcdDxtZC1idXR0b24gZmxleCBjbGFzcz1cIm1kLXJhaXNlZFwiIG5nLWNsaWNrPSd2bS5wbGF5KCknPlBsYXk8L21kLWJ1dHRvbj5cblx0XHQ8bWQtYnV0dG9uIGZsZXggY2xhc3M9XCJtZC1yYWlzZWRcIiBuZy1jbGljaz0ndm0ucGF1c2UoKSc+UGF1c2U8L21kLWJ1dHRvbj5cblx0PC9kaXY+XG4nJydcblxuY2xhc3MgQ3RybFxuXHRjb25zdHJ1Y3RvcjogKEBzY29wZSktPlxuXHRcdEBjYXJ0ID0gQ2FydFxuXG5cdHBsYXk6IC0+XG5cdFx0QHBhdXNlZCA9IHRydWVcblx0XHRkMy50aW1lci5mbHVzaCgpXG5cdFx0QHBhdXNlZCA9IGZhbHNlXG5cdFx0c2V0VGltZW91dCA9PlxuXHRcdFx0ZDMudGltZXIgKHQpPT5cblx0XHRcdFx0QGNhcnQubW92ZSB0LzEwMDBcblx0XHRcdFx0QHNjb3BlLiRldmFsQXN5bmMoKVxuXHRcdFx0XHRpZiAoQGNhcnQudiA8IC4wMSkgdGhlbiBAcGF1c2VkID0gdHJ1ZVxuXHRcdFx0XHRpZiBAcGF1c2VkIHRoZW4gY29uc29sZS5sb2cgJ2xlYXZpbmcnXG5cdFx0XHRcdEBwYXVzZWRcblxuXHRwYXVzZTogLT5cblx0XHRAcGF1c2VkID0gdHJ1ZVxuXG5kZXIgPSAoKS0+XG5cdGRpcmVjdGl2ZSA9IFxuXHRcdGNvbnRyb2xsZXJBczogJ3ZtJ1xuXHRcdCMgcmVzdHJpY3Q6ICdFJ1xuXHRcdHNjb3BlOiB7fVxuXHRcdGNvbnRyb2xsZXI6IFsnJHNjb3BlJywgQ3RybF1cblx0XHR0ZW1wbGF0ZTogdGVtcGxhdGVcblxubW9kdWxlLmV4cG9ydHMgPSBkZXIiLCJfID0gcmVxdWlyZSAnbG9kYXNoJ1xue2V4cCwgc3FydCwgYXRhbn0gPSBNYXRoXG5cbmNsYXNzIENhcnRcblx0Y29uc3RydWN0b3I6IChAb3B0aW9ucyktPlxuXHRcdHtAeDAsIEB2MCwgQGJ9ID0gQG9wdGlvbnNcblx0XHRAcmVzdGFydCgpXG5cdHJlc3RhcnQ6IC0+XG5cdFx0QHRyYWplY3RvcnkgPSBbXVxuXHRcdEBtb3ZlKDApXG5cdG1vdmU6ICh0KS0+XG5cdFx0QHYgPSBAdjAgKiBleHAoLUBiICogdClcblx0XHRAeCA9IEB4MCArIEB2MC9AYiAqICgxLWV4cCgtQGIqdCkpXG5cdFx0QHRyYWplY3RvcnkucHVzaCB7dDogdCwgdjogQHYsIHg6IEB4fVxuXG5tb2R1bGUuZXhwb3J0cyA9IG5ldyBDYXJ0IHt4MDogMCwgdjA6IDQsIGI6IDF9IiwiXyA9IHJlcXVpcmUgJ2xvZGFzaCdcbmQzPSByZXF1aXJlICdkMydcbnttaW59ID0gTWF0aFxuQ2FydCA9IHJlcXVpcmUgJy4vY2FydERhdGEnXG5yZXF1aXJlICcuLi8uLi9oZWxwZXJzJ1xuXG50ZW1wbGF0ZSA9ICcnJ1xuXHQ8c3ZnIG5nLWluaXQ9J3ZtLnJlc2l6ZSgpJyB3aWR0aD0nMTAwJScgbmctYXR0ci1oZWlnaHQ9J3t7dm0uc3ZnX2hlaWdodH19Jz5cblx0XHQ8ZyBzaGlmdGVyPSd7ezo6W3ZtLm1hci5sZWZ0LCB2bS5tYXIudG9wXX19Jz5cblx0XHRcdDxyZWN0IG5nLWF0dHItd2lkdGg9J3t7dm0ud2lkdGh9fScgbmctYXR0ci1oZWlnaHQ9J3t7dm0uaGVpZ2h0fX0nIGNsYXNzPSdiYWNrZ3JvdW5kJy8+XG5cdFx0XHQ8ZyBob3ItYXhpcy1kZXIgaGVpZ2h0PSd2bS5oZWlnaHQnIHNjYWxlPSd2bS5YJyBmdW49J3ZtLmF4aXNGdW4nIHNoaWZ0ZXI9J1swLHZtLmhlaWdodF0nPjwvZz5cblx0XHRcdDxnIGNsYXNzPSdnLWNhcnQnPlxuXHRcdFx0XHQ8cmVjdCBjbGFzcz0nY2FydCcgbmctYXR0ci15PSd7e3ZtLmhlaWdodC8zfX0nIG5nLWF0dHItd2lkdGg9J3t7dm0uaGVpZ2h0LzN9fScgbmctYXR0ci1oZWlnaHQ9J3t7dm0uaGVpZ2h0LzN9fScvPlxuXHRcdFx0PC9nPlxuXHRcdDwvZz5cblx0PC9zdmc+XG4nJydcblxuY2xhc3MgQ3RybFxuXHRjb25zdHJ1Y3RvcjogKEBzY29wZSwgQGVsLCBAd2luZG93KS0+XG5cdFx0QGNhcnQgPSBDYXJ0XG5cdFx0QG1hciA9IFxuXHRcdFx0bGVmdDogMTBcblx0XHRcdHJpZ2h0OiAxMFxuXHRcdFx0dG9wOiAxMFxuXHRcdFx0Ym90dG9tOiAxOFxuXHRcdEBYID0gZDMuc2NhbGUubGluZWFyKCkuZG9tYWluIFstLjI1LDVdIFxuXHRcdHNlbCAgPSBkMy5zZWxlY3QgQGVsWzBdXG5cdFx0Y2FydCA9IHNlbC5zZWxlY3QgJy5nLWNhcnQnXG5cblx0XHRAYXhpc0Z1biA9IGQzLnN2Zy5heGlzKClcblx0XHRcdC5zY2FsZSBAWFxuXHRcdFx0LnRpY2tzIDVcblx0XHRcdC5vcmllbnQgJ2JvdHRvbSdcblxuXHRcdEBzY29wZS4kd2F0Y2ggJ3ZtLmNhcnQueCcsICh4KT0+XG5cdFx0XHR4UHggPSBAWCh4KVxuXHRcdFx0Y2FydFxuXHRcdFx0XHQudHJhbnNpdGlvbigpXG5cdFx0XHRcdC5kdXJhdGlvbiAxNVxuXHRcdFx0XHQuZWFzZSAnbGluZWFyJ1xuXHRcdFx0XHQuYXR0ciAndHJhbnNmb3JtJywgXCJ0cmFuc2xhdGUoI3t4UHh9LDApXCJcblxuXHRcdGFuZ3VsYXIuZWxlbWVudCBAd2luZG93XG5cdFx0XHQub24gJ3Jlc2l6ZScgLCAoKT0+QHJlc2l6ZSgpXG5cblx0IyBAcHJvcGVydHkgXG5cblx0QHByb3BlcnR5ICdzdmdfaGVpZ2h0JyAsIGdldDotPiBAaGVpZ2h0ICsgQG1hci50b3AgKyBAbWFyLmJvdHRvbVxuXG5cdHJlc2l6ZTogKCk9PlxuXHRcdEB3aWR0aCA9IEBlbFswXS5jbGllbnRXaWR0aCAtIEBtYXIubGVmdCAtIEBtYXIucmlnaHRcblx0XHRAaGVpZ2h0ID0gQHdpZHRoKi4zIC0gQG1hci50b3AgLSBAbWFyLmJvdHRvbVxuXHRcdEBYLnJhbmdlKFswLCBAd2lkdGhdKVxuXHRcdEBzY29wZS4kZXZhbEFzeW5jKClcblxuZGVyID0gKCktPlxuXHRkaXJlY3RpdmUgPSBcblx0XHR0ZW1wbGF0ZTogdGVtcGxhdGVcblx0XHRzY29wZToge31cblx0XHRyZXN0cmljdDogJ0EnXG5cdFx0YmluZFRvQ29udHJvbGxlcjogdHJ1ZVxuXHRcdHRlbXBsYXRlTmFtZXNwYWNlOiAnc3ZnJ1xuXHRcdGNvbnRyb2xsZXI6IFsnJHNjb3BlJywgJyRlbGVtZW50JywgJyR3aW5kb3cnLCBDdHJsXVxuXHRcdGNvbnRyb2xsZXJBczogJ3ZtJ1xuXG5tb2R1bGUuZXhwb3J0cyA9IGRlclxuIiwiYW5ndWxhciA9IHJlcXVpcmUgJ2FuZ3VsYXInXG5kMyA9IHJlcXVpcmUgJ2QzJ1xucmVxdWlyZSAnLi4vLi4vaGVscGVycydcbm1hdGggPSByZXF1aXJlICdtYXRoanMnXG5fID0gcmVxdWlyZSAnbG9kYXNoJ1xudGVtcGxhdGUgPSAnJydcblx0PHN2ZyBuZy1pbml0PSd2bS5yZXNpemUoKScgd2lkdGg9JzEwMCUnIG5nLWF0dHItaGVpZ2h0PSd7e3ZtLnN2Z19oZWlnaHR9fSc+XG5cdFx0PGRlZnM+XG5cdFx0XHQ8Y2xpcHBhdGggaWQ9J3JlZyc+XG5cdFx0XHRcdDxyZWN0IG5nLWF0dHItd2lkdGg9J3t7dm0ud2lkdGh9fScgbmctYXR0ci1oZWlnaHQ9J3t7dm0uaGVpZ2h0fX0nPjwvcmVjdD5cblx0XHRcdDwvY2xpcHBhdGg+XG5cdFx0PC9kZWZzPlxuXHRcdDxnIGNsYXNzPSdib2lsZXJwbGF0ZScgc2hpZnRlcj0nW3ZtLm1hci5sZWZ0LCB2bS5tYXIudG9wXSc+XG5cdFx0XHQ8cmVjdCBjbGFzcz0nYmFja2dyb3VuZCcgbmctYXR0ci13aWR0aD0ne3t2bS53aWR0aH19JyBuZy1hdHRyLWhlaWdodD0ne3t2bS5oZWlnaHR9fScgbmctbW91c2Vtb3ZlPSd2bS5tb3ZlKCRldmVudCknIC8+XG5cdFx0XHQ8ZyB2ZXItYXhpcy1kZXIgd2lkdGg9J3ZtLndpZHRoJyBzY2FsZT0ndm0uVicgZnVuPSd2bS52ZXJBeEZ1bic+PC9nPlxuXHRcdFx0PGcgaG9yLWF4aXMtZGVyIGhlaWdodD0ndm0uaGVpZ2h0JyBzY2FsZT0ndm0uVCcgZnVuPSd2bS5ob3JBeEZ1bicgc2hpZnRlcj0nWzAsdm0uaGVpZ2h0XSc+PC9nPlxuXHRcdFx0PGZvcmVpZ25PYmplY3Qgd2lkdGg9JzMwJyBoZWlnaHQ9JzMwJyB5PScxNycgc2hpZnRlcj0nW3ZtLndpZHRoLzIsIHZtLmhlaWdodF0nPlxuXHRcdFx0XHRcdDx0ZXh0IGNsYXNzPSdsYWJlbCcgPiR0JDwvdGV4dD5cblx0XHRcdDwvZm9yZWlnbk9iamVjdD5cblx0XHQ8L2c+XG5cdFx0PGcgY2xhc3M9J21haW4nIGNsaXAtcGF0aD1cInVybCgjcmVnKVwiIHNoaWZ0ZXI9J1t2bS5tYXIubGVmdCwgdm0ubWFyLnRvcF0nPlxuXHRcdFx0PGxpbmUgY2xhc3M9J3plcm8tbGluZScgeDE9JzAnIG5nLWF0dHIteDI9J3t7dm0ud2lkdGh9fScgbmctYXR0ci15MT0ne3t2bS5WKDApfX0nIG5nLWF0dHIteTI9J3t7dm0uVigwKX19JyAvPlxuXHRcdFx0PHBhdGggbmctYXR0ci1kPSd7e3ZtLmxpbmVGdW4odm0uZGF0YSl9fScgY2xhc3M9J2Z1biB2JyAvPlxuXHRcdFx0PHBhdGggbmctYXR0ci1kPSd7e3ZtLnRyaWFuZ2xlRGF0YSgpfX0nIGNsYXNzPSd0cmknIC8+XG5cdFx0XHQ8cGF0aCBuZy1hdHRyLWQ9J3t7dm0ubGluZUZ1bihbdm0ucG9pbnQsIHt2OiB2bS5wb2ludC5kdiArIHZtLnBvaW50LnYsIHQ6IHZtLnBvaW50LnR9XSl9fScgY2xhc3M9J3RyaSBmdW4gZHYnIC8+XG5cdFx0XHQ8cGF0aCBuZy1hdHRyLWQ9J3t7dm0ubGluZUZ1bihbe3Y6IHZtLnBvaW50LmR2LCB0OiB2bS5wb2ludC50fSwge3Y6IDAsIHQ6IHZtLnBvaW50LnR9XSl9fScgY2xhc3M9J2Z1biBkdicgc3R5bGU9J29wYWNpdHk6IC40OycvPlxuXHRcdFx0PHBhdGggbmctYXR0ci1kPSd7e3ZtLmxpbmVGdW4yKHZtLmRhdGEpfX0nIGNsYXNzPSdmdW4gZHYnIHN0eWxlPSdvcGFjaXR5OiAuMycgLz5cblx0XHRcdDxjaXJjbGUgcj0nM3B4JyAgc2hpZnRlcj0nW3ZtLlQodm0ucG9pbnQudCksIHZtLlYodm0ucG9pbnQudildJyBjbGFzcz0ncG9pbnQnLz5cblx0XHQ8L2c+XG5cdDwvc3ZnPlxuJycnXG5cdFx0XHRcbmNsYXNzIHRyaUN0cmxcblx0Y29uc3RydWN0b3I6IChAc2NvcGUsIEBlbCwgQHdpbmRvdyktPlxuXHRcdEBtYXIgPSBcblx0XHRcdGxlZnQ6IDMwXG5cdFx0XHR0b3A6IDIwXG5cdFx0XHRyaWdodDogMjBcblx0XHRcdGJvdHRvbTogMzVcblxuXHRcdEBWID0gZDMuc2NhbGUubGluZWFyKCkuZG9tYWluIFstMiwyXVxuXHRcdEBUID0gZDMuc2NhbGUubGluZWFyKCkuZG9tYWluIFswLDhdXG5cblx0XHRAaG9yQXhGdW4gPSBkMy5zdmcuYXhpcygpXG5cdFx0XHQuc2NhbGUgQFRcblx0XHRcdC5vcmllbnQgJ2JvdHRvbSdcblxuXHRcdEB2ZXJBeEZ1biA9IGQzLnN2Zy5heGlzKClcblx0XHRcdC5zY2FsZSBAVlxuXHRcdFx0LnRpY2tzIDVcblx0XHRcdC5vcmllbnQgJ2xlZnQnXG5cblx0XHRAbGluZUZ1biA9IGQzLnN2Zy5saW5lKClcblx0XHRcdC55IChkKT0+IEBWIGQudlxuXHRcdFx0LnggKGQpPT4gQFQgZC50XG5cdFx0QGxpbmVGdW4yID0gZDMuc3ZnLmxpbmUoKVxuXHRcdFx0LnkgKGQpPT4gQFYgZC5kdlxuXHRcdFx0LnggKGQpPT4gQFQgZC50XG5cblx0XHRwYXJzZXIgPSBtYXRoLnBhcnNlcigpXG5cdFx0cGFyc2VyLmV2YWwgJ3YodCkgPSBzaW4odCknXG5cdFx0cGFyc2VyLmV2YWwgJ2R2KHQpID0gY29zKHQpJ1xuXHRcdHYgPSBwYXJzZXIuZ2V0ICd2J1xuXHRcdGR2ID0gcGFyc2VyLmdldCAnZHYnXG5cblx0XHRAZGF0YSA9IF8ucmFuZ2UgMCAsIDggLCAxLzUwXG5cdFx0XHQubWFwICh0KS0+XG5cdFx0XHRcdHJlcyA9IFxuXHRcdFx0XHRcdGR2OiBkdiB0XG5cdFx0XHRcdFx0djogdiB0XG5cdFx0XHRcdFx0dDogdFxuXG5cdFx0QHBvaW50ID0gXy5zYW1wbGUgQGRhdGFcblxuXHRcdGFuZ3VsYXIuZWxlbWVudCBAd2luZG93XG5cdFx0XHQub24gJ3Jlc2l6ZScsIEByZXNpemVcblxuXHRcdEBtb3ZlID0gKGV2ZW50KSA9PlxuXHRcdFx0cmVjdCA9IGV2ZW50LnRhcmdldC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKVxuXHRcdFx0dCA9IEBULmludmVydCAoZXZlbnQueCAtIHJlY3QubGVmdClcblx0XHRcdEBwb2ludCA9IFxuXHRcdFx0XHR0OiB0XG5cdFx0XHRcdHY6IHYgdFxuXHRcdFx0XHRkdjogZHYgdFxuXHRcdFx0QHNjb3BlLiRldmFsQXN5bmMoKVxuXG5cdEBwcm9wZXJ0eSAnc3ZnX2hlaWdodCcsIGdldDogLT4gQGhlaWdodCArIEBtYXIudG9wICsgQG1hci5ib3R0b21cblxuXHR0cmlhbmdsZURhdGE6LT5cblx0XHRAbGluZUZ1biBbe3Y6IEBwb2ludC52LCB0OiBAcG9pbnQudH0sIHt2OkBwb2ludC5kdiArIEBwb2ludC52LCB0OiBAcG9pbnQudCsxfSwge3Y6IEBwb2ludC5kdiArIEBwb2ludC52LCB0OiBAcG9pbnQudH1dXG5cblx0cmVzaXplOiAoKT0+XG5cdFx0QHdpZHRoID0gQGVsWzBdLmNsaWVudFdpZHRoIC0gQG1hci5sZWZ0IC0gQG1hci5yaWdodFxuXHRcdEBoZWlnaHQgPSBAZWxbMF0ucGFyZW50RWxlbWVudC5jbGllbnRIZWlnaHQgLSBAbWFyLmxlZnQgLSBAbWFyLnJpZ2h0XG5cdFx0QFYucmFuZ2UgW0BoZWlnaHQsIDBdXG5cdFx0QFQucmFuZ2UgWzAsIEB3aWR0aF1cblx0XHRAc2NvcGUuJGV2YWxBc3luYygpXG5cbmRlciA9ICgpLT5cblx0ZGlyZWN0aXZlID0gXG5cdFx0Y29udHJvbGxlckFzOiAndm0nXG5cdFx0c2NvcGU6IHt9XG5cdFx0dGVtcGxhdGU6IHRlbXBsYXRlXG5cdFx0dGVtcGxhdGVOYW1lc3BhY2U6ICdzdmcnXG5cdFx0Y29udHJvbGxlcjogWyckc2NvcGUnLCckZWxlbWVudCcsICckd2luZG93JywgdHJpQ3RybF1cblxubW9kdWxlLmV4cG9ydHMgPSBkZXJcbiIsImFuZ3VsYXIgPSByZXF1aXJlICdhbmd1bGFyJ1xuZDMgPSByZXF1aXJlICdkMydcbkRhdGEgPSByZXF1aXJlICcuL3Bsb3REYXRhJ1xucmVxdWlyZSAnLi4vLi4vaGVscGVycydcbnRlbXBsYXRlID0gJycnXG5cdDxoMz5QbG90IEE8L2gzPlxuXHQ8c3ZnIG5nLWluaXQ9J3ZtLnJlc2l6ZSgpJyB3aWR0aD0nMTAwJScgbmctYXR0ci1oZWlnaHQ9J3t7dm0uc3ZnX2hlaWdodH19Jz5cblx0XHQ8ZGVmcz5cblx0XHRcdDxjbGlwcGF0aCBpZD0ncGxvdEEnPlxuXHRcdFx0XHQ8cmVjdCBuZy1hdHRyLXdpZHRoPSd7e3ZtLndpZHRofX0nIG5nLWF0dHItaGVpZ2h0PSd7e3ZtLmhlaWdodH19Jz48L3JlY3Q+XG5cdFx0XHQ8L2NsaXBwYXRoPlxuXHRcdDwvZGVmcz5cblx0XHQ8ZyBjbGFzcz0nYm9pbGVycGxhdGUnIHNoaWZ0ZXI9J1t2bS5tYXIubGVmdCwgdm0ubWFyLnRvcF0nPlxuXHRcdFx0PHJlY3QgY2xhc3M9J2JhY2tncm91bmQnIG5nLWF0dHItd2lkdGg9J3t7dm0ud2lkdGh9fScgbmctYXR0ci1oZWlnaHQ9J3t7dm0uaGVpZ2h0fX0nIGJlaGF2aW9yPSd2bS5kcmFnX3JlY3QnPjwvcmVjdD5cblx0XHRcdDxnIHZlci1heGlzLWRlciB3aWR0aD0ndm0ud2lkdGgnIHNjYWxlPSd2bS5WJyBmdW49J3ZtLnZlckF4RnVuJz48L2c+XG5cdFx0XHQ8ZyBob3ItYXhpcy1kZXIgaGVpZ2h0PSd2bS5oZWlnaHQnIHNjYWxlPSd2bS5UJyBmdW49J3ZtLmhvckF4RnVuJyBzaGlmdGVyPSdbMCx2bS5oZWlnaHRdJz48L2c+XG5cdFx0XHQ8ZyBob3ItYXhpcy1kZXIgaGVpZ2h0PSd2bS5oZWlnaHQnIHNjYWxlPSd2bS5UJyBmdW49J3ZtLmhvckF4RnVuJyBzaGlmdGVyPSdbMCx2bS5oZWlnaHRdJz48L2c+XG5cdFx0XHQ8Zm9yZWlnbk9iamVjdCB3aWR0aD0nMzAnIGhlaWdodD0nMzAnIHNoaWZ0ZXI9J1stMzEsIHZtLmhlaWdodC8yXSc+XG5cdFx0XHRcdFx0PHRleHQgY2xhc3M9J2xhYmVsJz4kdiQ8L3RleHQ+XG5cdFx0XHQ8L2ZvcmVpZ25PYmplY3Q+XG5cdFx0XHQ8Zm9yZWlnbk9iamVjdCB3aWR0aD0nMzAnIGhlaWdodD0nMzAnIHk9JzIwJyBzaGlmdGVyPSdbdm0ud2lkdGgvMiwgdm0uaGVpZ2h0XSc+XG5cdFx0XHRcdFx0PHRleHQgY2xhc3M9J2xhYmVsJyA+JHQkPC90ZXh0PlxuXHRcdFx0PC9mb3JlaWduT2JqZWN0PlxuXHRcdDwvZz5cblx0XHQ8ZyBjbGFzcz0nbWFpbicgY2xpcC1wYXRoPVwidXJsKCNwbG90QSlcIiBzaGlmdGVyPSdbdm0ubWFyLmxlZnQsIHZtLm1hci50b3BdJz5cblx0XHRcdDxsaW5lIGNsYXNzPSd6ZXJvLWxpbmUnIHgxPScwJyBuZy1hdHRyLXgyPSd7e3ZtLndpZHRofX0nIG5nLWF0dHIteTE9J3t7dm0uVigwKX19JyBuZy1hdHRyLXkyPSd7e3ZtLlYoMCl9fScgLz5cblx0XHRcdDxsaW5lIGNsYXNzPSd6ZXJvLWxpbmUnIHkxPScwJyBuZy1hdHRyLXkyPSd7e3ZtLmhlaWdodH19JyBuZy1hdHRyLXgxPSd7e3ZtLlQoMCl9fScgbmctYXR0ci14Mj0ne3t2bS5UKDApfX0nIC8+XG5cdFx0XHQ8ZyBuZy1jbGFzcz0ne2hpZGU6ICF2bS5EYXRhLnNob3d9JyA+XG5cdFx0XHRcdDxsaW5lIGNsYXNzPSd0cmkgdicgbmctYXR0ci14MT0ne3t2bS5UKDApfX0nIG5nLWF0dHIteDI9J3t7dm0uVCgwKX19JyBuZy1hdHRyLXkxPSd7e3ZtLlYoMCl9fScgbmctYXR0ci15Mj0ne3t2bS5WKHZtLkRhdGEuc2VsZWN0ZWQudil9fScgLz5cblx0XHRcdFx0PHBhdGggbmctYXR0ci1kPSd7e3ZtLnRyaWFuZ2xlRGF0YSgpfX0nIGNsYXNzPSd0cmknIC8+XG5cdFx0XHRcdDxwYXRoIG5nLWF0dHItZD0ne3t2bS5saW5lRnVuKFt2bS5wb2ludCwge3Y6IHZtLnBvaW50LmR2ICsgdm0ucG9pbnQudiwgdDogdm0ucG9pbnQudH1dKX19JyBjbGFzcz0ndHJpIGR2JyAvPlxuXHRcdFx0PC9nPlxuXHRcdFx0PHBhdGggbmctYXR0ci1kPSd7e3ZtLmxpbmVGdW4odm0uRGF0YS5kb3RzKX19JyBjbGFzcz0nZnVuIHYnIC8+XG5cdFx0XHQ8ZyBuZy1yZXBlYXQ9J2RvdCBpbiB2bS5kb3RzIHRyYWNrIGJ5IGRvdC5pZCcgZGF0dW09ZG90IHNoaWZ0ZXI9J1t2bS5UKGRvdC50KSx2bS5WKGRvdC52KV0nIGJlaGF2aW9yPSd2bS5kcmFnJyBkb3QtZGVyID48L2c+XG5cdFx0XHQ8Y2lyY2xlIGNsYXNzPSdkb3Qgc21hbGwnIHI9JzQnIHNoaWZ0ZXI9J1t2bS5UKHZtLkRhdGEuZmlyc3QudCksdm0uVih2bS5EYXRhLmZpcnN0LnYpXScgLz5cblx0XHQ8L2c+XG5cdDwvc3ZnPlxuJycnXG5jbGFzcyBDdHJsXG5cdGNvbnN0cnVjdG9yOiAoQHNjb3BlLCBAZWwsIEB3aW5kb3cpLT5cblx0XHRAbWFyID0gXG5cdFx0XHRsZWZ0OiAzMFxuXHRcdFx0dG9wOiAxMFxuXHRcdFx0cmlnaHQ6IDIwXG5cdFx0XHRib3R0b206IDM3XG5cblx0XHRAViA9IGQzLnNjYWxlLmxpbmVhcigpLmRvbWFpbiBbLS4yNSw1XVxuXG5cdFx0QFQgPSBkMy5zY2FsZS5saW5lYXIoKS5kb21haW4gWy0uMjUsNV1cblxuXHRcdEBEYXRhID0gRGF0YVxuXG5cdFx0QGhvckF4RnVuID0gZDMuc3ZnLmF4aXMoKVxuXHRcdFx0LnNjYWxlIEBUXG5cdFx0XHQudGlja3MgNVxuXHRcdFx0Lm9yaWVudCAnYm90dG9tJ1xuXG5cdFx0QHZlckF4RnVuID0gZDMuc3ZnLmF4aXMoKVxuXHRcdFx0LnNjYWxlIEBWXG5cdFx0XHQudGlja3MgNVxuXHRcdFx0Lm9yaWVudCAnbGVmdCdcblx0XHRcblx0XHRAbGluZUZ1biA9IGQzLnN2Zy5saW5lKClcblx0XHRcdC55IChkKT0+IEBWIGQudlxuXHRcdFx0LnggKGQpPT4gQFQgZC50XG5cblx0XHRAZHJhZ19yZWN0ID0gZDMuYmVoYXZpb3IuZHJhZygpXG5cdFx0XHQub24gJ2RyYWdzdGFydCcsICgpPT5cblx0XHRcdFx0RGF0YS5zaG93PSB0cnVlXG5cdFx0XHRcdGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpXG5cdFx0XHRcdGlmIGV2ZW50LndoaWNoIGlzIDNcblx0XHRcdFx0XHRyZXR1cm4gZXZlbnQucHJldmVudERlZmF1bHQoKVxuXHRcdFx0XHRyZWN0ID0gZXZlbnQudG9FbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpXG5cdFx0XHRcdHQgPSBAVC5pbnZlcnQgZXZlbnQueCAtIHJlY3QubGVmdFxuXHRcdFx0XHR2ICA9IEBWLmludmVydCBldmVudC55IC0gcmVjdC50b3Bcblx0XHRcdFx0RGF0YS5hZGRfZG90IHQgLCB2XG5cdFx0XHRcdEBzY29wZS4kZXZhbEFzeW5jKClcblx0XHRcdC5vbiAnZHJhZycsID0+IEBvbl9kcmFnKERhdGEuc2VsZWN0ZWQpXG5cdFx0XHQub24gJ2RyYWdlbmQnLCA9PiBcblx0XHRcdFx0RGF0YS5zaG93ID0gZmFsc2Vcblx0XHRcdFx0QHNjb3BlLiRldmFsQXN5bmMoKVxuXG5cdFx0QGRyYWcgPSBkMy5iZWhhdmlvci5kcmFnKClcblx0XHRcdC5vbiAnZHJhZ3N0YXJ0JywgKGRvdCk9PlxuXHRcdFx0XHREYXRhLnNob3cgPSB0cnVlXG5cdFx0XHRcdGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpXG5cdFx0XHRcdGlmIGV2ZW50LndoaWNoIGlzIDNcblx0XHRcdFx0XHREYXRhLnJlbW92ZV9kb3QgZG90XG5cdFx0XHRcdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKVxuXHRcdFx0XHRcdEBzY29wZS4kZXZhbEFzeW5jKClcblx0XHRcdC5vbiAnZHJhZycsIEBvbl9kcmFnXG5cdFx0XHQub24gJ2RyYWdlbmQnLCA9PiBcblx0XHRcdFx0RGF0YS5zaG93ID0gZmFsc2Vcblx0XHRcdFx0QHNjb3BlLiRldmFsQXN5bmMoKVxuXG5cdFx0YW5ndWxhci5lbGVtZW50IEB3aW5kb3dcblx0XHRcdC5vbiAncmVzaXplJywgQHJlc2l6ZVxuXG5cdEBwcm9wZXJ0eSAnc3ZnX2hlaWdodCcsIGdldDogLT4gQGhlaWdodCArIEBtYXIudG9wICsgQG1hci5ib3R0b21cblxuXHRAcHJvcGVydHkgJ2RvdHMnLCBnZXQ6LT4gXG5cdFx0cmVzID0gRGF0YS5kb3RzLmZpbHRlciAoZCktPlxuXHRcdFx0ZC5pZCAhPSAnZmlyc3QnXG5cblx0b25fZHJhZzogKGRvdCk9PiBcblx0XHRcdGlmIGV2ZW50LndoaWNoIGlzIDNcblx0XHRcdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKVxuXHRcdFx0XHRyZXR1cm5cblx0XHRcdERhdGEudXBkYXRlX2RvdCBkb3QsIEBULmludmVydChkMy5ldmVudC54KSwgQFYuaW52ZXJ0KGQzLmV2ZW50LnkpXG5cdFx0XHRAc2NvcGUuJGV2YWxBc3luYygpXG5cblx0QHByb3BlcnR5ICdwb2ludCcsIGdldDogLT4gRGF0YS5zZWxlY3RlZFxuXG5cdHRyaWFuZ2xlRGF0YTotPlxuXHRcdHBvaW50ID0gRGF0YS5zZWxlY3RlZFxuXHRcdEBsaW5lRnVuIFt7djogcG9pbnQudiwgdDogcG9pbnQudH0sIHt2OnBvaW50LmR2ICsgcG9pbnQudiwgdDogcG9pbnQudCsxfSwge3Y6IHBvaW50LmR2ICsgcG9pbnQudiwgdDogcG9pbnQudH1dXG5cblx0cmVzaXplOiAoKT0+XG5cdFx0QHdpZHRoID0gQGVsWzBdLmNsaWVudFdpZHRoIC0gQG1hci5sZWZ0IC0gQG1hci5yaWdodFxuXHRcdEBoZWlnaHQgPSBAd2lkdGggKiAuN1xuXHRcdEBWLnJhbmdlIFtAaGVpZ2h0LCAwXVxuXHRcdEBULnJhbmdlIFswLCBAd2lkdGhdXG5cdFx0QHNjb3BlLiRldmFsQXN5bmMoKVxuXG5cbmRlciA9ICgpLT5cblx0ZGlyZWN0aXZlID0gXG5cdFx0Y29udHJvbGxlckFzOiAndm0nXG5cdFx0c2NvcGU6IHt9XG5cdFx0dGVtcGxhdGU6IHRlbXBsYXRlXG5cdFx0dGVtcGxhdGVOYW1lc3BhY2U6ICdzdmcnXG5cdFx0Y29udHJvbGxlcjogWyckc2NvcGUnLCckZWxlbWVudCcsICckd2luZG93JywgQ3RybF1cblxubW9kdWxlLmV4cG9ydHMgPSBkZXJcbiIsIkRhdGEgPSByZXF1aXJlICcuL3Bsb3REYXRhJ1xuYW5ndWxhciA9IHJlcXVpcmUgJ2FuZ3VsYXInXG5kMyA9IHJlcXVpcmUgJ2QzJ1xucmVxdWlyZSAnLi4vLi4vaGVscGVycydcblxudGVtcGxhdGUgPSAnJydcblx0PGgzPlBsb3QgQjwvaDM+XG5cdDxzdmcgbmctaW5pdD0ndm0ucmVzaXplKCknICB3aWR0aD0nMTAwJScgbmctYXR0ci1oZWlnaHQ9J3t7dm0uc3ZnX2hlaWdodH19Jz5cblx0XHQ8ZGVmcz5cblx0XHRcdDxjbGlwcGF0aCBpZD0ncGxvdEInPlxuXHRcdFx0XHQ8cmVjdCBuZy1hdHRyLXdpZHRoPSd7e3ZtLndpZHRofX0nIG5nLWF0dHItaGVpZ2h0PSd7e3ZtLmhlaWdodH19Jz48L3JlY3Q+XG5cdFx0XHQ8L2NsaXBwYXRoPlxuXHRcdDwvZGVmcz5cblx0XHQ8ZyBjbGFzcz0nYm9pbGVycGxhdGUnIHNoaWZ0ZXI9J1t2bS5tYXIubGVmdCwgdm0ubWFyLnRvcF0nPlxuXHRcdFx0PHJlY3QgY2xhc3M9J2JhY2tncm91bmQnIG5nLWF0dHItd2lkdGg9J3t7dm0ud2lkdGh9fScgbmctYXR0ci1oZWlnaHQ9J3t7dm0uaGVpZ2h0fX0nPjwvcmVjdD5cblx0XHRcdDxnIHZlci1heGlzLWRlciB3aWR0aD0ndm0ud2lkdGgnIHNjYWxlPSd2bS5EVicgZnVuPSd2bS52ZXJBeEZ1bic+PC9nPlxuXHRcdFx0PGcgaG9yLWF4aXMtZGVyIGhlaWdodD0ndm0uaGVpZ2h0JyBzY2FsZT0ndm0uVicgZnVuPSd2bS5ob3JBeEZ1bicgc2hpZnRlcj0nWzAsdm0uaGVpZ2h0XSc+PC9nPlxuXHRcdFx0PGZvcmVpZ25PYmplY3Qgd2lkdGg9JzMwJyBoZWlnaHQ9JzMwJyBzaGlmdGVyPSdbLTMxLCB2bS5oZWlnaHQvMl0nPlxuXHRcdFx0XHRcdDx0ZXh0IGNsYXNzPSdsYWJlbCc+JFxcXFxkb3R7dn0kPC90ZXh0PlxuXHRcdFx0PC9mb3JlaWduT2JqZWN0PlxuXHRcdFx0PGZvcmVpZ25PYmplY3Qgd2lkdGg9JzMwJyBoZWlnaHQ9JzMwJyB5PScyMCcgc2hpZnRlcj0nW3ZtLndpZHRoLzIsIHZtLmhlaWdodF0nPlxuXHRcdFx0XHRcdDx0ZXh0IGNsYXNzPSdsYWJlbCcgPiR2JDwvdGV4dD5cblx0XHRcdDwvZm9yZWlnbk9iamVjdD5cblx0XHQ8L2c+XG5cdFx0PGcgY2xhc3M9J21haW4nIGNsaXAtcGF0aD1cInVybCgjcGxvdEIpXCIgc2hpZnRlcj0nW3ZtLm1hci5sZWZ0LCB2bS5tYXIudG9wXSc+XG5cdFx0XHQ8bGluZSBjbGFzcz0nemVyby1saW5lJyB4MT0nMCcgbmctYXR0ci14Mj0ne3t2bS53aWR0aH19JyBuZy1hdHRyLXkxPSd7e3ZtLkRWKDApfX0nIG5nLWF0dHIteTI9J3t7dm0uRFYoMCl9fScgLz5cblx0XHRcdDxsaW5lIGNsYXNzPSd6ZXJvLWxpbmUnIHkxPScwJyBuZy1hdHRyLXkyPSd7e3ZtLmhlaWdodH19JyBuZy1hdHRyLXgxPSd7e3ZtLlYoMCl9fScgbmctYXR0ci14Mj0ne3t2bS5WKDApfX0nIC8+XG5cdFx0XHQ8cGF0aCBuZy1hdHRyLWQ9J3t7dm0ubGluZUZ1bih2bS5EYXRhLnRhcmdldF9kYXRhKX19JyBjbGFzcz0nZnVuIHRhcmdldCcgLz5cblx0XHRcdDxnIG5nLWNsYXNzPSd7aGlkZTogIXZtLkRhdGEuc2hvd30nID5cblx0XHRcdFx0PGxpbmUgY2xhc3M9J3RyaSB2JyBuZy1hdHRyLXkxPSd7e3ZtLkRWKDApfX0nIG5nLWF0dHIteTI9J3t7dm0uRFYoMCl9fScgbmctYXR0ci14MT0ne3t2bS5WKDApfX0nIG5nLWF0dHIteDI9J3t7dm0uVih2bS5EYXRhLnNlbGVjdGVkLnYpfX0nIC8+XG5cdFx0XHRcdDxsaW5lIGNsYXNzPSd0cmkgZHYnIG5nLWF0dHIteDE9J3t7dm0uVigwKX19JyBuZy1hdHRyLXgyPSd7e3ZtLlYoMCl9fScgbmctYXR0ci15MT0ne3t2bS5EVigwKX19JyBuZy1hdHRyLXkyPSd7e3ZtLkRWKHZtLkRhdGEuc2VsZWN0ZWQuZHYpfX0nIC8+XG5cdFx0XHRcdDxwYXRoIG5nLWF0dHItZD0ne3t2bS5saW5lRnVuKHZtLkRhdGEudGFyZ2V0X2RhdGEpfX0nIGNsYXNzPSdmdW4gY29ycmVjdCcgbmctY2xhc3M9J3toaWRlOiAhdm0uRGF0YS5jb3JyZWN0fScgLz5cblx0XHRcdDwvZz5cblx0XHRcdDxwYXRoIG5nLWF0dHItZD0ne3t2bS5saW5lRnVuKHZtLmRvdHMpfX0nIGNsYXNzPSdmdW4gZHYnIC8+XG5cdFx0XHQ8ZyBuZy1yZXBlYXQ9J2RvdCBpbiB2bS5kb3RzIHRyYWNrIGJ5IGRvdC5pZCcgc2hpZnRlcj0nW3ZtLlYoZG90LnYpLHZtLkRWKGRvdC5kdildJyBkb3QtYi1kZXI+PC9nPlxuXHRcdDwvZz5cblx0PC9zdmc+XG4nJydcblxuY2xhc3MgQ3RybFxuXHRjb25zdHJ1Y3RvcjogKEBzY29wZSwgQGVsLCBAd2luZG93KS0+XG5cdFx0QG1hciA9IFxuXHRcdFx0bGVmdDogMzBcblx0XHRcdHRvcDogMTBcblx0XHRcdHJpZ2h0OiAyMFxuXHRcdFx0Ym90dG9tOiAzN1xuXG5cdFx0QERWID0gZDMuc2NhbGUubGluZWFyKCkuZG9tYWluIFstNSwgLjI1XVxuXG5cdFx0QFYgPSBkMy5zY2FsZS5saW5lYXIoKS5kb21haW4gWy0uMjUsNF1cblxuXHRcdEBob3JBeEZ1biA9IGQzLnN2Zy5heGlzKClcblx0XHRcdC5zY2FsZSBAVlxuXHRcdFx0LnRpY2tzIDRcblx0XHRcdC5vcmllbnQgJ2JvdHRvbSdcblxuXHRcdEB2ZXJBeEZ1biA9IGQzLnN2Zy5heGlzKClcblx0XHRcdC5zY2FsZSBARFZcblx0XHRcdC50aWNrcyA1XG5cdFx0XHQub3JpZW50ICdsZWZ0J1xuXG5cdFx0QERhdGEgPSBEYXRhXG5cblx0XHRAbGluZUZ1biA9IGQzLnN2Zy5saW5lKClcblx0XHRcdC55IChkKT0+IEBEViBkLmR2XG5cdFx0XHQueCAoZCk9PiBAViBkLnZcblxuXHRcdGFuZ3VsYXIuZWxlbWVudCBAd2luZG93XG5cdFx0XHQub24gJ3Jlc2l6ZScsIEByZXNpemVcblxuXHRAcHJvcGVydHkgJ3N2Z19oZWlnaHQnLCBnZXQ6IC0+IEBoZWlnaHQgKyBAbWFyLnRvcCArIEBtYXIuYm90dG9tXG5cblx0QHByb3BlcnR5ICdkb3RzJywgZ2V0Oi0+XG5cdFx0RGF0YS5kb3RzLmZpbHRlciAoZCktPlxuXHRcdFx0ZC5pZCAhPSdmaXJzdCdcblxuXHRoaWxpdGU6ICh2KS0+XG5cdFx0ZDMuc2VsZWN0IHRoaXNcblx0XHRcdC50cmFuc2l0aW9uKClcblx0XHRcdC5kdXJhdGlvbiAxMDBcblx0XHRcdC5lYXNlICdjdWJpYydcblx0XHRcdC5hdHRyICdyJyAsIGlmIHYgdGhlbiA2IGVsc2UgNFxuXG5cdHJlc2l6ZTogKCk9PlxuXHRcdEB3aWR0aCA9IEBlbFswXS5jbGllbnRXaWR0aCAtIEBtYXIubGVmdCAtIEBtYXIucmlnaHRcblx0XHRAaGVpZ2h0ID0gQHdpZHRoICogLjdcblx0XHRARFYucmFuZ2UgW0BoZWlnaHQsIDBdXG5cdFx0QFYucmFuZ2UgWzAsIEB3aWR0aF0gXG5cdFx0QHNjb3BlLiRldmFsQXN5bmMoKVxuXG5cbmRlciA9ICgpLT5cblx0ZGlyZWN0aXZlID0gXG5cdFx0Y29udHJvbGxlckFzOiAndm0nXG5cdFx0c2NvcGU6IHt9XG5cdFx0dGVtcGxhdGU6IHRlbXBsYXRlXG5cdFx0dGVtcGxhdGVOYW1lc3BhY2U6ICdzdmcnXG5cdFx0Y29udHJvbGxlcjogWyckc2NvcGUnLCckZWxlbWVudCcsJyR3aW5kb3cnLCBDdHJsXVxuXG5tb2R1bGUuZXhwb3J0cyA9IGRlclxuIiwiXyA9IHJlcXVpcmUgJ2xvZGFzaCdcbntleHAsIHNxcnQsIGF0YW4sIG1pbiwgbWF4fSA9IE1hdGhcblxuY2xhc3MgRG90XG5cdGNvbnN0cnVjdG9yOiAoQHQsIEB2KS0+XG5cdFx0QGlkID0gXy51bmlxdWVJZCAnZG90J1xuXHRcdEBoaWxpdGVkID0gZmFsc2VcblxuY2xhc3MgU2VydmljZVxuXHRjb25zdHJ1Y3RvcjogKCktPlxuXHRcdGZpcnN0RG90ID0gbmV3IERvdCAwICwgNFxuXHRcdGZpcnN0RG90LmlkID0gJ2ZpcnN0J1xuXHRcdEBkb3RzID0gWyBmaXJzdERvdCwgXG5cdFx0XHRuZXcgRG90IC4zLCA0KmV4cCgtLjMpXG5cdFx0IF1cblx0XHRAY29ycmVjdCA9IGZhbHNlXG5cblx0XHRAZmlyc3QgPSBmaXJzdERvdFxuXG5cdFx0QHNlbGVjdGVkID0gZmlyc3REb3Rcblx0XHRAc2hvdyA9IGZhbHNlXG5cdFx0QHRhcmdldF9kYXRhID0gXy5yYW5nZSAwLCA4LCAxLzUwXG5cdFx0XHQubWFwICh0KS0+IFxuXHRcdFx0XHRyZXMgID0gXG5cdFx0XHRcdFx0dDogdFxuXHRcdFx0XHRcdHY6IDQqIGV4cCgtdClcblx0XHRcdFx0XHRkdjogLTQgKiBleHAoLXQpXG5cdFx0QHVwZGF0ZV9kb3RzKClcblxuXHRhZGRfZG90OiAodCwgdiktPlxuXHRcdEBzZWxlY3RlZCA9IG5ldyBEb3QgdCx2XG5cdFx0QGRvdHMucHVzaCBAc2VsZWN0ZWRcblx0XHRAdXBkYXRlX2RvdChAc2VsZWN0ZWQsIHQsIHYpXG5cblx0cmVtb3ZlX2RvdDogKGRvdCktPlxuXHRcdEBkb3RzLnNwbGljZSBAZG90cy5pbmRleE9mKGRvdCksIDFcblxuXHR1cGRhdGVfZG90czogLT4gXG5cdFx0QGRvdHMuc29ydCAoYSxiKS0+IGEudCAtIGIudFxuXHRcdEBkb3RzLmZvckVhY2ggKGRvdCwgaSwgayktPlxuXHRcdFx0cHJldiA9IGtbaS0xXVxuXHRcdFx0ZG90LmR2ID0gaWYgcHJldiB0aGVuIChkb3QudiAtIHByZXYudikvbWF4KGRvdC50IC0gcHJldi50LCAuMDEpIGVsc2UgMFxuXG5cdHVwZGF0ZV9kb3Q6IChkb3QsIHQsIHYpLT5cblx0XHRpZiBkb3QuaWQgPT0gJ2ZpcnN0J1xuXHRcdFx0cmV0dXJuXG5cdFx0QHNlbGVjdGVkID0gZG90XG5cdFx0ZG90LnQgPSB0XG5cdFx0ZG90LnYgPSB2XG5cdFx0QHVwZGF0ZV9kb3RzKClcblx0XHRAY29ycmVjdCA9IE1hdGguYWJzKEBzZWxlY3RlZC52ICsgQHNlbGVjdGVkLmR2KSA8IDAuMVxuXG5zZXJ2aWNlID0gbmV3IFNlcnZpY2VcblxubW9kdWxlLmV4cG9ydHMgPSBzZXJ2aWNlIiwiYW5ndWxhciA9IHJlcXVpcmUgJ2FuZ3VsYXInXG5kMyA9IHJlcXVpcmUgJ2QzJ1xucmVxdWlyZSAnLi4vLi4vaGVscGVycydcbm1hdGggPSByZXF1aXJlICdtYXRoanMnXG5fID0gcmVxdWlyZSAnbG9kYXNoJ1xudGVtcGxhdGUgPSAnJydcblx0PHN2ZyBuZy1pbml0PSd2bS5yZXNpemUoKScgd2lkdGg9JzEwMCUnIG5nLWF0dHItaGVpZ2h0PSd7e3ZtLnN2Z19oZWlnaHR9fSc+XG5cdFx0PGRlZnM+XG5cdFx0XHQ8Y2xpcHBhdGggaWQ9J3JlZyc+XG5cdFx0XHRcdDxyZWN0IG5nLWF0dHItd2lkdGg9J3t7dm0ud2lkdGh9fScgbmctYXR0ci1oZWlnaHQ9J3t7dm0uaGVpZ2h0fX0nPjwvcmVjdD5cblx0XHRcdDwvY2xpcHBhdGg+XG5cdFx0PC9kZWZzPlxuXHRcdDxnIGNsYXNzPSdib2lsZXJwbGF0ZScgc2hpZnRlcj0nW3ZtLm1hci5sZWZ0LCB2bS5tYXIudG9wXSc+XG5cdFx0XHQ8cmVjdCBjbGFzcz0nYmFja2dyb3VuZCcgbmctYXR0ci13aWR0aD0ne3t2bS53aWR0aH19JyBuZy1hdHRyLWhlaWdodD0ne3t2bS5oZWlnaHR9fScgbmctbW91c2Vtb3ZlPSd2bS5tb3ZlKCRldmVudCknIC8+XG5cdFx0XHQ8ZyB2ZXItYXhpcy1kZXIgd2lkdGg9J3ZtLndpZHRoJyBzY2FsZT0ndm0uVicgZnVuPSd2bS52ZXJBeEZ1bic+PC9nPlxuXHRcdFx0PGcgaG9yLWF4aXMtZGVyIGhlaWdodD0ndm0uaGVpZ2h0JyBzY2FsZT0ndm0uVCcgZnVuPSd2bS5ob3JBeEZ1bicgc2hpZnRlcj0nWzAsdm0uaGVpZ2h0XSc+PC9nPlxuXHRcdFx0PGZvcmVpZ25PYmplY3Qgd2lkdGg9JzMwJyBoZWlnaHQ9JzMwJyB5PScxNycgc2hpZnRlcj0nW3ZtLndpZHRoLzIsIHZtLmhlaWdodF0nPlxuXHRcdFx0XHRcdDx0ZXh0IGNsYXNzPSdsYWJlbCcgPiR0JDwvdGV4dD5cblx0XHRcdDwvZm9yZWlnbk9iamVjdD5cblx0XHQ8L2c+XG5cdFx0PGcgY2xhc3M9J21haW4nIGNsaXAtcGF0aD1cInVybCgjcmVnKVwiIHNoaWZ0ZXI9J1t2bS5tYXIubGVmdCwgdm0ubWFyLnRvcF0nPlxuXHRcdFx0PGxpbmUgY2xhc3M9J3plcm8tbGluZScgbmctY2xhc3M9J3tcImNvcnJlY3RcIjogdm0uY29ycmVjdH0nIHgxPScwJyBuZy1hdHRyLXgyPSd7e3ZtLndpZHRofX0nIG5nLWF0dHIteTE9J3t7dm0uVigwKX19JyBuZy1hdHRyLXkyPSd7e3ZtLlYoMCl9fScgLz5cblx0XHRcdDxsaW5lIGNsYXNzPSd0cmkgdicgbmctYXR0ci14MT0ne3t2bS5UKHZtLnBvaW50LnQpfX0nIG5nLWF0dHIteDI9J3t7dm0uVCh2bS5wb2ludC50KX19JyBuZy1hdHRyLXkxPSd7e3ZtLlYoMCl9fScgbmctYXR0ci15Mj0ne3t2bS5WKHZtLnBvaW50LnYpfX0nIC8+XG5cdFx0XHQ8cGF0aCBuZy1hdHRyLWQ9J3t7dm0ubGluZUZ1bih2bS5kYXRhKX19JyBjbGFzcz0nZnVuIHYnIC8+XG5cdFx0XHQ8Y2lyY2xlIHI9JzNweCcgc2hpZnRlcj0nW3ZtLlQodm0ucG9pbnQudCksIHZtLlYodm0ucG9pbnQudildJyBjbGFzcz0ncG9pbnQnLz5cblx0XHQ8L2c+XG5cdDwvc3ZnPlxuJycnXG5cbmNsYXNzIHJlZ0N0cmxcblx0Y29uc3RydWN0b3I6IChAc2NvcGUsIEBlbCwgQHdpbmRvdyktPlxuXHRcdEBtYXIgPSBcblx0XHRcdGxlZnQ6IDMwXG5cdFx0XHR0b3A6IDIwXG5cdFx0XHRyaWdodDogMjBcblx0XHRcdGJvdHRvbTogMzVcblxuXHRcdEBWID0gZDMuc2NhbGUubGluZWFyKCkuZG9tYWluIFstMSwxXVxuXHRcdEBUID0gZDMuc2NhbGUubGluZWFyKCkuZG9tYWluIFswLDNdXG5cblx0XHRAaG9yQXhGdW4gPSBkMy5zdmcuYXhpcygpXG5cdFx0XHQuc2NhbGUgQFRcblx0XHRcdC50aWNrVmFsdWVzIFswLDEsMiwzXVxuXHRcdFx0Lm9yaWVudCAnYm90dG9tJ1xuXG5cdFx0QHZlckF4RnVuID0gZDMuc3ZnLmF4aXMoKVxuXHRcdFx0LnNjYWxlIEBWXG5cdFx0XHQudGlja3MgNVxuXHRcdFx0Lm9yaWVudCAnbGVmdCdcblx0XHRcblx0XHRAbGluZUZ1biA9IGQzLnN2Zy5saW5lKClcblx0XHRcdC55IChkKT0+IEBWIGQudlxuXHRcdFx0LnggKGQpPT4gQFQgZC50XG5cblx0XHRwYXJzZXIgPSBtYXRoLnBhcnNlcigpXG5cdFx0cGFyc2VyLmV2YWwgJ3YodCkgPSA1KiAodC0uNSkgKiAodC0xKSAqICh0LTIpXjInXG5cdFx0dkZ1biA9IHBhcnNlci5nZXQgJ3YnXG5cblx0XHRAZGF0YSA9IF8ucmFuZ2UgMCAsIDMgLCAxLzUwXG5cdFx0XHQubWFwICh0KS0+XG5cdFx0XHRcdHJlcyA9IFxuXHRcdFx0XHRcdHY6IHZGdW4odClcblx0XHRcdFx0XHR0OiB0XG5cblx0XHRAcG9pbnQgPSBfLnNhbXBsZSBAZGF0YVxuXG5cdFx0QGNvcnJlY3QgPSBmYWxzZVxuXG5cdFx0YW5ndWxhci5lbGVtZW50IEB3aW5kb3dcblx0XHRcdC5vbiAncmVzaXplJywgQHJlc2l6ZVxuXG5cdFx0QG1vdmUgPSAoZXZlbnQpID0+XG5cdFx0XHRyZWN0ID0gZXZlbnQudGFyZ2V0LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpXG5cdFx0XHR0ID0gQFQuaW52ZXJ0IGV2ZW50LnggLSByZWN0LmxlZnRcblx0XHRcdHYgPSB2RnVuIHRcblx0XHRcdEBwb2ludCA9IFxuXHRcdFx0XHR0OiB0XG5cdFx0XHRcdHY6IHZcblx0XHRcdEBjb3JyZWN0ID0gTWF0aC5hYnMoQHBvaW50LnYpIDw9IDAuMDUgXG5cdFx0XHRAc2NvcGUuJGV2YWxBc3luYygpXG5cblx0QHByb3BlcnR5ICdzdmdfaGVpZ2h0JywgZ2V0OiAtPiBAaGVpZ2h0ICsgQG1hci50b3AgKyBAbWFyLmJvdHRvbVxuXG5cdHJlc2l6ZTogKCk9PlxuXHRcdEB3aWR0aCA9IEBlbFswXS5jbGllbnRXaWR0aCAtIEBtYXIubGVmdCAtIEBtYXIucmlnaHRcblx0XHRAaGVpZ2h0ID0gQGVsWzBdLnBhcmVudEVsZW1lbnQuY2xpZW50SGVpZ2h0IC0gQG1hci5sZWZ0IC0gQG1hci5yaWdodFxuXHRcdEBWLnJhbmdlIFtAaGVpZ2h0LCAwXVxuXHRcdEBULnJhbmdlIFswLCBAd2lkdGhdXG5cdFx0QHNjb3BlLiRldmFsQXN5bmMoKVxuXG5kZXIgPSAoKS0+XG5cdGRpcmVjdGl2ZSA9IFxuXHRcdGNvbnRyb2xsZXJBczogJ3ZtJ1xuXHRcdHNjb3BlOiB7fVxuXHRcdHRlbXBsYXRlOiB0ZW1wbGF0ZVxuXHRcdHRlbXBsYXRlTmFtZXNwYWNlOiAnc3ZnJ1xuXHRcdGNvbnRyb2xsZXI6IFsnJHNjb3BlJywnJGVsZW1lbnQnLCAnJHdpbmRvdycsIHJlZ0N0cmxdXG5cbm1vZHVsZS5leHBvcnRzID0gZGVyXG4iLCJkcmFnID0gKCRwYXJzZSktPlxuXHRkaXJlY3RpdmUgPSBcblx0XHRsaW5rOiAoc2NvcGUsZWwsYXR0ciktPlxuXHRcdFx0c2VsID0gZDMuc2VsZWN0KGVsWzBdKVxuXHRcdFx0c2VsLmNhbGwoJHBhcnNlKGF0dHIuYmVoYXZpb3IpKHNjb3BlKSlcblxubW9kdWxlLmV4cG9ydHMgPSBkcmFnIiwibW9kdWxlLmV4cG9ydHMgPSAoJHBhcnNlKS0+XG5cdChzY29wZSwgZWwsIGF0dHIpLT5cblx0XHRkMy5zZWxlY3QoZWxbMF0pLmRhdHVtICRwYXJzZShhdHRyLmRhdHVtKShzY29wZSkiLCJcbnRlbXBsYXRlID0gJycnXG5cdDxjaXJjbGUgY2xhc3M9J2RvdCBsYXJnZSc+PC9jaXJjbGU+XG5cdDxjaXJjbGUgY2xhc3M9J2RvdCBzbWFsbCcgcj0nNCc+PC9jaXJjbGU+XG4nJydcblxuZGVyID0gKCktPlxuXHRkaXJlY3RpdmUgPSBcblx0XHR0ZW1wbGF0ZTogdGVtcGxhdGVcblx0XHRyZXN0cmljdDogJ0EnXG5cdFx0bGluazogKHNjb3BlLGVsLGF0dHIpLT5cblx0XHRcdHJhZCA9IDEwICN0aGUgcmFkaXVzIG9mIHRoZSBsYXJnZSBjaXJjbGUgbmF0dXJhbGx5XG5cdFx0XHRzZWwgPSBkMy5zZWxlY3QgZWxbMF1cblx0XHRcdGJpZyA9IHNlbC5zZWxlY3QgJ2NpcmNsZS5kb3QubGFyZ2UnXG5cdFx0XHRcdC5hdHRyICdyJywgcmFkXG5cdFx0XHRjaXJjID0gc2VsLnNlbGVjdCAnY2lyY2xlLmRvdC5zbWFsbCdcblxuXHRcdFx0bW91c2VvdmVyID0gKCktPlxuXHRcdFx0XHRzY29wZS5kb3QuaGlsaXRlZCA9IHRydWVcblx0XHRcdFx0c2NvcGUudm0uRGF0YS5zZWxlY3RlZCA9IHNjb3BlLmRvdFxuXHRcdFx0XHRzY29wZS52bS5EYXRhLnNob3cgPSB0cnVlXG5cdFx0XHRcdHNjb3BlLiRldmFsQXN5bmMoKVxuXHRcdFx0XHRiaWcudHJhbnNpdGlvbiAnZ3Jvdydcblx0XHRcdFx0XHQuZHVyYXRpb24gMTUwXG5cdFx0XHRcdFx0LmVhc2UgJ2N1YmljLW91dCdcblx0XHRcdFx0XHQuYXR0ciAncicgLCByYWQgKiAxLjVcblx0XHRcdFx0XHQudHJhbnNpdGlvbigpXG5cdFx0XHRcdFx0LmR1cmF0aW9uIDE1MFxuXHRcdFx0XHRcdC5lYXNlICdjdWJpYy1pbidcblx0XHRcdFx0XHQuYXR0ciAncicgLCByYWQgKiAxLjNcblx0XHRcdFx0XHRcblx0XHRcdGJpZy5vbiAnbW91c2VvdmVyJywgbW91c2VvdmVyXG5cdFx0XHRcdC5vbiAnY29udGV4dG1lbnUnLCAtPiBldmVudC5wcmV2ZW50RGVmYXVsdCgpXG5cdFx0XHRcdC5vbiAnbW91c2Vkb3duJywgLT5cblx0XHRcdFx0XHRiaWcudHJhbnNpdGlvbiAnZ3Jvdydcblx0XHRcdFx0XHRcdC5kdXJhdGlvbiAxNTBcblx0XHRcdFx0XHRcdC5lYXNlICdjdWJpYydcblx0XHRcdFx0XHRcdC5hdHRyICdyJywgcmFkKjEuN1xuXHRcdFx0XHQub24gJ21vdXNldXAnLCAoKS0+XG5cdFx0XHRcdFx0YmlnLnRyYW5zaXRpb24gJ2dyb3cnXG5cdFx0XHRcdFx0XHQuZHVyYXRpb24gMTUwXG5cdFx0XHRcdFx0XHQuZWFzZSAnY3ViaWMtaW4nXG5cdFx0XHRcdFx0XHQuYXR0ciAncicsIHJhZCoxLjNcblx0XHRcdFx0Lm9uICdtb3VzZW91dCcgLCAoKS0+XG5cdFx0XHRcdFx0c2NvcGUuZG90LmhpbGl0ZWQgPSBmYWxzZVxuXHRcdFx0XHRcdHNjb3BlLnZtLkRhdGEuc2hvdyA9IGZhbHNlXG5cdFx0XHRcdFx0c2NvcGUuJGV2YWxBc3luYygpXG5cdFx0XHRcdFx0YmlnLnRyYW5zaXRpb24gJ3Nocmluaydcblx0XHRcdFx0XHRcdC5kdXJhdGlvbiAzNTBcblx0XHRcdFx0XHRcdC5lYXNlICdib3VuY2Utb3V0J1xuXHRcdFx0XHRcdFx0LmF0dHIgJ3InICwgcmFkXG5cblx0XHRcdHNjb3BlLiR3YXRjaCAnZG90LmhpbGl0ZWQnICwgKHYpLT5cblx0XHRcdFx0aWYgdlxuXHRcdFx0XHRcdGNpcmMudHJhbnNpdGlvbigpXG5cdFx0XHRcdFx0XHQuZHVyYXRpb24gMTUwXG5cdFx0XHRcdFx0XHQuZWFzZSAnY3ViaWMtb3V0J1xuXHRcdFx0XHRcdFx0LnN0eWxlXG5cdFx0XHRcdFx0XHRcdCdzdHJva2Utd2lkdGgnOiAyLjVcblx0XHRcdFx0XHRcdFx0c3Ryb2tlOiAnIzIyMidcblx0XHRcdFx0ZWxzZSBcblx0XHRcdFx0XHRjaXJjLnRyYW5zaXRpb24oKVxuXHRcdFx0XHRcdFx0LmR1cmF0aW9uIDEwMFxuXHRcdFx0XHRcdFx0LmVhc2UgJ2N1YmljJ1xuXHRcdFx0XHRcdFx0LnN0eWxlXG5cdFx0XHRcdFx0XHRcdCdzdHJva2Utd2lkdGgnOiAxLjZcblx0XHRcdFx0XHRcdFx0c3Ryb2tlOiAnd2hpdGUnXG5cblxubW9kdWxlLmV4cG9ydHMgPSBkZXJcbiIsInRlbXBsYXRlID0gJycnXG5cdDxjaXJjbGUgY2xhc3M9J2RvdCBzbWFsbCcgcj0nNCc+PC9jaXJjbGU+XG4nJydcblxuZGVyID0gKCktPlxuXHRkaXJlY3RpdmUgPSBcblx0XHR0ZW1wbGF0ZTogdGVtcGxhdGVcblx0XHRyZXN0cmljdDogJ0EnXG5cdFx0bGluazogKHNjb3BlLGVsLGF0dHIpLT5cblx0XHRcdHNlbCA9IGQzLnNlbGVjdCBlbFswXVxuXHRcdFx0Y2lyYyA9IHNlbC5zZWxlY3QgJ2NpcmNsZS5kb3Quc21hbGwnXG5cblx0XHRcdHNjb3BlLiR3YXRjaCAnZG90LmhpbGl0ZWQnICwgKHYpLT5cblx0XHRcdFx0aWYgdlxuXHRcdFx0XHRcdGNpcmMudHJhbnNpdGlvbigpXG5cdFx0XHRcdFx0XHQuZHVyYXRpb24gMTUwXG5cdFx0XHRcdFx0XHQuZWFzZSAnY3ViaWMtb3V0J1xuXHRcdFx0XHRcdFx0LnN0eWxlXG5cdFx0XHRcdFx0XHRcdCdzdHJva2Utd2lkdGgnOiAyLjVcblx0XHRcdFx0XHRcdFx0c3Ryb2tlOiAnIzIyMidcblx0XHRcdFx0ZWxzZSBcblx0XHRcdFx0XHRjaXJjLnRyYW5zaXRpb24oKVxuXHRcdFx0XHRcdFx0LmR1cmF0aW9uIDEwMFxuXHRcdFx0XHRcdFx0LmVhc2UgJ2N1YmljJ1xuXHRcdFx0XHRcdFx0LnN0eWxlXG5cdFx0XHRcdFx0XHRcdCdzdHJva2Utd2lkdGgnOiAxLjZcblx0XHRcdFx0XHRcdFx0c3Ryb2tlOiAnd2hpdGUnXG5cbm1vZHVsZS5leHBvcnRzID0gZGVyXG4iLCJkMyA9IHJlcXVpcmUgJ2QzJ1xue2VsZW1lbnR9PSByZXF1aXJlICdhbmd1bGFyJ1xuXG5kZXIgPSAoKS0+ICNnb2VzIG9uIGEgcGF0aCBlbGVtZW50XG5cdGRpcmVjdGl2ZSA9IFxuXHRcdGNvbnRyb2xsZXI6ICgpLT5cblx0XHRjb250cm9sbGVyQXM6ICd2bSdcblx0XHRiaW5kVG9Db250cm9sbGVyOiB0cnVlXG5cdFx0cmVzdHJpY3Q6ICdBJ1xuXHRcdHRlbXBsYXRlTmFtZXNwYWNlOiAnc3ZnJ1xuXHRcdHNjb3BlOlxuXHRcdFx0ZGF0YTogJz0nXG5cdFx0XHRsaW5lRnVuOiAnPSdcblx0XHRcdHdhdGNoOiAnPSdcblx0XHRsaW5rOiAoc2NvcGUsIGVsLCBhdHRyLCB2bSktPlxuXHRcdFx0c2VsID0gZDMuc2VsZWN0KGVsWzBdKVxuXHRcdFx0dXBkYXRlID0gKCktPiBcblx0XHRcdFx0c2VsLmF0dHIgJ2QnLCB2bS5saW5lRnVuIHZtLmRhdGFcblxuXHRcdFx0c2NvcGUuJHdhdGNoICd2bS53YXRjaCdcblx0XHRcdFx0LCB1cGRhdGVcblx0XHRcdFx0LCB0cnVlXG5cdFx0XHRlbGVtZW50KHdpbmRvdykub24gJ3Jlc2l6ZScsIHVwZGF0ZVxuXG5tb2R1bGUuZXhwb3J0cyA9IGRlciIsImQzID0gcmVxdWlyZSAnZDMnXG5cbmRlciA9ICgkcGFyc2UpLT5cblx0ZGlyZWN0aXZlID1cblx0XHRsaW5rOiAoc2NvcGUsIGVsLCBhdHRyKS0+XG5cdFx0XHRyZXNoaWZ0ID0gKHYpLT4gXG5cdFx0XHRcdGQzLnNlbGVjdCBlbFswXVxuXHRcdFx0XHRcdC5hdHRyICd0cmFuc2Zvcm0nICwgXCJ0cmFuc2xhdGUoI3t2WzBdfSwje3ZbMV19KVwiXG5cblx0XHRcdHNjb3BlLiR3YXRjaCAoKS0+XG5cdFx0XHRcdFx0JHBhcnNlKGF0dHIuc2hpZnRlcikoc2NvcGUpXG5cdFx0XHRcdCwgcmVzaGlmdFxuXHRcdFx0XHQsIHRydWVcblxubW9kdWxlLmV4cG9ydHMgPSBkZXIiLCJkMyA9IHJlcXVpcmUgJ2QzJ1xuYW5ndWxhciA9IHJlcXVpcmUgJ2FuZ3VsYXInXG5cbmRlciA9ICgkd2luZG93KS0+XG5cdGRpcmVjdGl2ZSA9IFxuXHRcdGNvbnRyb2xsZXI6IGFuZ3VsYXIubm9vcFxuXHRcdGNvbnRyb2xsZXJBczogJ3ZtJ1xuXHRcdGJpbmRUb0NvbnRyb2xsZXI6IHRydWVcblx0XHRyZXN0cmljdDogJ0EnXG5cdFx0dGVtcGxhdGVOYW1lc3BhY2U6ICdzdmcnXG5cdFx0c2NvcGU6IFxuXHRcdFx0c2NhbGU6ICc9J1xuXHRcdFx0aGVpZ2h0OiAnPSdcblx0XHRcdGZ1bjogJz0nXG5cdFx0bGluazogKHNjb3BlLCBlbCwgYXR0ciwgdm0pLT5cblx0XHRcdHhBeGlzRnVuID0gdm0uZnVuID8gKGQzLnN2Zy5heGlzKClcblx0XHRcdFx0XHRcdFx0LnNjYWxlIHZtLnNjYWxlXG5cdFx0XHRcdFx0XHRcdC5vcmllbnQgJ2JvdHRvbScpXG5cblx0XHRcdHNlbCA9IGQzLnNlbGVjdCBlbFswXVxuXHRcdFx0XHQuY2xhc3NlZCAneCBheGlzJywgdHJ1ZVxuXG5cdFx0XHR1cGRhdGUgPSAoKT0+XG5cdFx0XHRcdHhBeGlzRnVuLnRpY2tTaXplIC12bS5oZWlnaHRcblx0XHRcdFx0c2VsLmNhbGwgeEF4aXNGdW5cblx0XHRcdFx0XG5cdFx0XHR1cGRhdGUoKVxuXHRcdFx0XHRcblx0XHRcdHNjb3BlLiR3YXRjaCAndm0uc2NhbGUuZG9tYWluKCknLCB1cGRhdGUgLCB0cnVlXG5cdFx0XHRzY29wZS4kd2F0Y2ggJ3ZtLnNjYWxlLnJhbmdlKCknLCB1cGRhdGUgLCB0cnVlXG5cdFx0XHRzY29wZS4kd2F0Y2ggJ3ZtLmhlaWdodCcsIHVwZGF0ZSAsIHRydWVcblxubW9kdWxlLmV4cG9ydHMgPSBkZXIiLCJkMyA9IHJlcXVpcmUgJ2QzJ1xuYW5ndWxhciA9IHJlcXVpcmUgJ2FuZ3VsYXInXG5cbmRlciA9ICgkd2luZG93KS0+XG5cdGRpcmVjdGl2ZSA9IFxuXHRcdGNvbnRyb2xsZXI6IGFuZ3VsYXIubm9vcFxuXHRcdGNvbnRyb2xsZXJBczogJ3ZtJ1xuXHRcdGJpbmRUb0NvbnRyb2xsZXI6IHRydWVcblx0XHRyZXN0cmljdDogJ0EnXG5cdFx0dGVtcGxhdGVOYW1lc3BhY2U6ICdzdmcnXG5cdFx0c2NvcGU6IFxuXHRcdFx0c2NhbGU6ICc9J1xuXHRcdFx0d2lkdGg6ICc9J1xuXHRcdFx0ZnVuOiAnPSdcblx0XHRsaW5rOiAoc2NvcGUsIGVsLCBhdHRyLCB2bSktPlxuXHRcdFx0eUF4aXNGdW4gPSB2bS5mdW4gPyBkMy5zdmcuYXhpcygpXG5cdFx0XHRcdC5zY2FsZSB2bS5zY2FsZVxuXHRcdFx0XHQub3JpZW50ICdsZWZ0J1xuXG5cdFx0XHRzZWwgPSBkMy5zZWxlY3QoZWxbMF0pLmNsYXNzZWQoJ3kgYXhpcycsIHRydWUpXG5cblx0XHRcdHVwZGF0ZSA9ICgpPT5cblx0XHRcdFx0eUF4aXNGdW4udGlja1NpemUoIC12bS53aWR0aClcblx0XHRcdFx0c2VsLmNhbGwoeUF4aXNGdW4pXG5cblx0XHRcdHVwZGF0ZSgpXG5cdFx0XHRcdFxuXHRcdFx0c2NvcGUuJHdhdGNoICd2bS5zY2FsZS5kb21haW4oKScsIHVwZGF0ZSAsIHRydWVcblx0XHRcdHNjb3BlLiR3YXRjaCAndm0uc2NhbGUucmFuZ2UoKScsIHVwZGF0ZSAsIHRydWVcblx0XHRcdCMgc2NvcGUuJHdhdGNoICd2bS53aWR0aCcsIHVwZGF0ZVxuXG5tb2R1bGUuZXhwb3J0cyA9IGRlciIsIid1c2Ugc3RyaWN0J1xuXG5tb2R1bGUuZXhwb3J0cy50aW1lb3V0ID0gKGZ1biwgdGltZSktPlxuXHRcdGQzLnRpbWVyKCgpPT5cblx0XHRcdGZ1bigpXG5cdFx0XHR0cnVlXG5cdFx0LHRpbWUpXG5cblxuRnVuY3Rpb246OnByb3BlcnR5ID0gKHByb3AsIGRlc2MpIC0+XG4gIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSBAcHJvdG90eXBlLCBwcm9wLCBkZXNjIl19
