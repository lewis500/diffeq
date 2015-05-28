(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';
var angular, app, behavior, cartButtonsDer, cartSimDer, d3, d3Der, datum, derivativeDer, dotBDer, dotDer, horAxis, looper, material, plotADer, plotBDer, regularDer, shifter, verAxis;

angular = require('angular');

d3 = require('d3');

datum = require('./directives/datum');

dotDer = require('./directives/dot');

horAxis = require('./directives/xAxis');

verAxis = require('./directives/yAxis');

behavior = require('./directives/behavior');

cartSimDer = require('./components/cart/cartSim');

cartButtonsDer = require('./components/cart/cartButtons');

shifter = require('./directives/shifter');

material = require('angular-material');

plotADer = require('./components/plot/plotA');

plotBDer = require('./components/plot/plotB');

d3Der = require('./directives/d3Der');

regularDer = require('./components/regular/regular');

derivativeDer = require('./components/derivative/derivative');

dotBDer = require('./directives/dotB');

app = angular.module('mainApp', [material]).directive('horAxisDer', horAxis).directive('verAxisDer', verAxis).directive('cartSimDer', cartSimDer).directive('cartButtonsDer', cartButtonsDer).directive('shifter', shifter).directive('plotADer', plotADer).directive('behavior', behavior).directive('dotDer', dotDer).directive('datum', datum).directive('d3Der', d3Der).directive('plotBDer', plotBDer).directive('regularDer', regularDer).directive('derivativeDer', derivativeDer).directive('dotBDer', dotBDer).directive('cartPlotDer', require('./components/cart/cartPlot'));

looper = function() {
  return setTimeout(function() {
    d3.selectAll('circle.dot.large').transition('grow').duration(500).ease('cubic-out').attr('transform', 'scale( 1.34)').transition('shrink').duration(500).ease('cubic-out').attr('transform', 'scale( 1.0)');
    return looper();
  }, 1000);
};

looper();



},{"./components/cart/cartButtons":2,"./components/cart/cartPlot":4,"./components/cart/cartSim":5,"./components/derivative/derivative":6,"./components/plot/plotA":7,"./components/plot/plotB":8,"./components/regular/regular":10,"./directives/behavior":11,"./directives/d3Der":12,"./directives/datum":13,"./directives/dot":14,"./directives/dotB":15,"./directives/shifter":16,"./directives/xAxis":17,"./directives/yAxis":18,"angular":undefined,"angular-material":undefined,"d3":undefined}],2:[function(require,module,exports){
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
    Cart.paused = true;
    d3.timer.flush();
    this.cart.restart();
    Cart.paused = false;
    return setTimeout((function(_this) {
      return function() {
        var last;
        last = 0;
        return d3.timer(function(elapsed) {
          _this.cart.increment((elapsed - last) / 1000);
          last = elapsed;
          if (_this.cart.v < .01) {
            Cart.paused = true;
          }
          _this.scope.$evalAsync();
          return Cart.paused;
        });
      };
    })(this));
  };

  Ctrl.prototype.pause = function() {
    return Cart.paused = true;
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
    this.t = 0;
    this.trajectory = [];
    this.move(0);
    return this.paused = true;
  };

  Cart.prototype.set_t = function(t) {
    this.t = t;
    return this.move(t);
  };

  Cart.prototype.increment = function(dt) {
    this.t += dt;
    return this.move(this.t);
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
var Cart, Ctrl, _, angular, d3, der, template,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

angular = require('angular');

d3 = require('d3');

require('../../helpers');

_ = require('lodash');

Cart = require('./cartData');

template = '<svg ng-init=\'vm.resize()\' width=\'100%\' ng-attr-height=\'{{vm.svg_height}}\'>\n	<defs>\n		<clippath id=\'sol\'>\n			<rect ng-attr-width=\'{{vm.width}}\' ng-attr-height=\'{{vm.height}}\'></rect>\n		</clippath>\n	</defs>\n	<g class=\'boilerplate\' shifter=\'[vm.mar.left, vm.mar.top]\'>\n		<rect class=\'background\' ng-attr-width=\'{{vm.width}}\' ng-attr-height=\'{{vm.height}}\' ng-mousemove=\'vm.move($event)\' />\n		<g ver-axis-der width=\'vm.width\' scale=\'vm.V\' fun=\'vm.verAxFun\'></g>\n		<g hor-axis-der height=\'vm.height\' scale=\'vm.T\' fun=\'vm.horAxFun\' shifter=\'[0,vm.height]\'></g>\n		<foreignObject width=\'30\' height=\'30\' y=\'17\' shifter=\'[vm.width/2, vm.height]\'>\n			<text class=\'label\' >$t$</text>\n		</foreignObject>\n		<foreignObject width=\'30\' height=\'30\' shifter=\'[-31, vm.height/2-8]\'>\n				<text class=\'label\' >$v$</text>\n		</foreignObject>\n	</g>\n	<g class=\'main\' clip-path="url(#sol)" shifter=\'[vm.mar.left, vm.mar.top]\'>\n		<line class=\'zero-line\' d3-der="{x1: 0 , x2: vm.width, y1: vm.V(0), y2: vm.V(0)}" /> \n		<line class=\'zero-line\' d3-der="{x1: vm.T(0) , x2: vm.T(0), y1: 0, y2: vm.height}" /> \n		<line class=\'tri v\'  ng-attr-x1=\'{{vm.T(vm.Cart.t)}}\' ng-attr-x2=\'{{vm.T(vm.Cart.t)}}\' ng-attr-y1=\'{{vm.V(0)}}\' ng-attr-y2=\'{{vm.V(vm.Cart.v)}}\' />\n\n		<path ng-attr-d=\'{{vm.lineFun(vm.data)}}\' class=\'fun v\' />\n		<circle r=\'3px\' shifter=\'[vm.T(vm.Cart.t), vm.V(vm.Cart.v)]\' class=\'Cart\'/>\n	</g>\n</svg>';

Ctrl = (function() {
  function Ctrl(scope, el, window) {
    var vFun;
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
    this.V = d3.scale.linear().domain([-.1, 5]);
    this.T = d3.scale.linear().domain([-.1, 5]);
    this.Cart = Cart;
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
    vFun = function(t) {
      return 4 * Math.exp(-t);
    };
    this.data = _.range(0, 5, 1 / 60).map(function(t) {
      var res;
      return res = {
        v: vFun(t),
        t: t
      };
    });
    angular.element(this.window).on('resize', this.resize);
    this.move = (function(_this) {
      return function(event) {
        var rect, t;
        if (!Cart.paused) {
          return;
        }
        rect = event.target.getBoundingClientRect();
        t = _this.T.invert(event.x - rect.left);
        t = Math.max(0, t);
        Cart.set_t(t);
        return _this.scope.$evalAsync();
      };
    })(this);
  }

  Ctrl.property('svg_height', {
    get: function() {
      return this.height + this.mar.top + this.mar.bottom;
    }
  });

  Ctrl.prototype.resize = function() {
    this.width = this.el[0].clientWidth - this.mar.left - this.mar.right;
    this.height = this.width * .7 - this.mar.left - this.mar.right;
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



},{"../../helpers":19,"./cartData":3,"angular":undefined,"d3":undefined,"lodash":undefined}],5:[function(require,module,exports){
var Cart, Ctrl, _, d3, der, min, template,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

_ = require('lodash');

d3 = require('d3');

min = Math.min;

Cart = require('./cartData');

require('../../helpers');

template = '<svg ng-init=\'vm.resize()\' width=\'100%\' ng-attr-height=\'{{vm.svg_height}}\'>\n	<g shifter=\'{{::[vm.mar.left, vm.mar.top]}}\'>\n		<rect ng-attr-width=\'{{vm.width}}\' ng-attr-height=\'{{vm.height}}\' class=\'background\'/>\n		<g hor-axis-der height=\'vm.height\' scale=\'vm.X\' fun=\'vm.axisFun\' shifter=\'[0,vm.height]\'></g>\n\n		<foreignObject width=\'30\' height=\'30\' y=\'20\' shifter=\'[vm.width/2, vm.height]\'>\n				<text class=\'label\' >$t$</text>\n		</foreignObject>\n		<g class=\'g-cart\'>\n			<rect class=\'cart\' ng-attr-y=\'{{vm.height/3}}\' ng-attr-width=\'{{vm.height/3}}\' ng-attr-height=\'{{vm.height/3}}\'/>\n		</g>\n	</g>\n</svg>';

Ctrl = (function() {
  function Ctrl(scope, el, window) {
    var cart, sel;
    this.scope = scope;
    this.el = el;
    this.window = window;
    this.resize = bind(this.resize, this);
    this.cart = Cart;
    this.mar = {
      left: 30,
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



},{"../../helpers":19,"./cartData":3,"d3":undefined,"lodash":undefined}],6:[function(require,module,exports){
var _, angular, d3, der, math, template, triCtrl,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

angular = require('angular');

d3 = require('d3');

require('../../helpers');

math = require('mathjs');

_ = require('lodash');

template = '<svg ng-init=\'vm.resize()\' width=\'100%\' ng-attr-height=\'{{vm.svg_height}}\'>\n	<defs>\n		<clippath id=\'reg\'>\n			<rect ng-attr-width=\'{{vm.width}}\' ng-attr-height=\'{{vm.height}}\'></rect>\n		</clippath>\n	</defs>\n	<g class=\'boilerplate\' shifter=\'[vm.mar.left, vm.mar.top]\'>\n		<rect class=\'background\' ng-attr-width=\'{{vm.width}}\' ng-attr-height=\'{{vm.height}}\' ng-mousemove=\'vm.move($event)\' />\n		<g ver-axis-der width=\'vm.width\' scale=\'vm.V\' fun=\'vm.verAxFun\'></g>\n		<g hor-axis-der height=\'vm.height\' scale=\'vm.T\' fun=\'vm.horAxFun\' shifter=\'[0,vm.height]\'></g>\n		<foreignObject width=\'30\' height=\'30\' y=\'17\' shifter=\'[vm.width/2, vm.height]\'>\n				<text class=\'label\' >$t$</text>\n		</foreignObject>\n	</g>\n	<g class=\'main\' clip-path="url(#reg)" shifter=\'[vm.mar.left, vm.mar.top]\'>\n		<line class=\'zero-line\' x1=\'0\' ng-attr-x2=\'{{vm.width}}\' ng-attr-y1=\'{{vm.V(0)}}\' ng-attr-y2=\'{{vm.V(0)}}\' />\n		<path ng-attr-d=\'{{vm.lineFun(vm.data)}}\' class=\'fun v\' />\n		<path ng-attr-d=\'{{vm.triangleData()}}\' class=\'tri\' />\n		<foreignObject width=\'30\' height=\'30\' shifter=\'[(vm.T(vm.point.t) - 16), vm.sthing]\' style=\'font-size: 13px; font-weight: 100;\'>\n				<text class=\'label\' font-size=\'13px\'>$\\dot{v}$</text>\n		</foreignObject>\n		<path ng-attr-d=\'{{vm.lineFun([vm.point, {v: vm.point.dv + vm.point.v, t: vm.point.t}])}}\' class=\'tri fun dv\' />\n		<path ng-attr-d=\'{{vm.lineFun([{v: vm.point.dv, t: vm.point.t}, {v: 0, t: vm.point.t}])}}\' class=\'fun dv\' style=\'opacity: .4;\'/>\n		<path ng-attr-d=\'{{vm.lineFun2(vm.data)}}\' class=\'fun dv\' style=\'opacity: .3\' />\n		<circle r=\'3px\'  shifter=\'[vm.T(vm.point.t), vm.V(vm.point.v)]\' class=\'point\'/>\n	</g>\n</svg>';

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

  triCtrl.property('sthing', {
    get: function() {
      return this.V(this.point.dv / 2 + this.point.v) - 7;
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



},{"../../helpers":19,"angular":undefined,"d3":undefined,"lodash":undefined,"mathjs":undefined}],7:[function(require,module,exports){
var Ctrl, Data, angular, d3, der, template,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

angular = require('angular');

d3 = require('d3');

Data = require('./plotData');

require('../../helpers');

template = '<h3>Plot A</h3>\n<svg ng-init=\'vm.resize()\' width=\'100%\' ng-attr-height=\'{{vm.svg_height}}\'>\n	<defs>\n		<clippath id=\'plotA\'>\n			<rect ng-attr-width=\'{{vm.width}}\' ng-attr-height=\'{{vm.height}}\'></rect>\n		</clippath>\n	</defs>\n	<g class=\'boilerplate\' shifter=\'[vm.mar.left, vm.mar.top]\'>\n		<rect class=\'background\' ng-attr-width=\'{{vm.width}}\' ng-attr-height=\'{{vm.height}}\' behavior=\'vm.drag_rect\'></rect>\n		<g ver-axis-der width=\'vm.width\' scale=\'vm.V\' fun=\'vm.verAxFun\'></g>\n		<g hor-axis-der height=\'vm.height\' scale=\'vm.T\' fun=\'vm.horAxFun\' shifter=\'[0,vm.height]\'></g>\n		<g hor-axis-der height=\'vm.height\' scale=\'vm.T\' fun=\'vm.horAxFun\' shifter=\'[0,vm.height]\'></g>\n		<foreignObject width=\'30\' height=\'30\' shifter=\'[-31, vm.height/2]\'>\n				<text class=\'label\'>$v$</text>\n		</foreignObject>\n		<foreignObject width=\'30\' height=\'30\' y=\'20\' shifter=\'[vm.width/2, vm.height]\'>\n				<text class=\'label\' >$t$</text>\n		</foreignObject>\n	</g>\n	<g class=\'main\' clip-path="url(#plotA)" shifter=\'[vm.mar.left, vm.mar.top]\'>\n		<line class=\'zero-line\' x1=\'0\' ng-attr-x2=\'{{vm.width}}\' ng-attr-y1=\'{{vm.V(0)}}\' ng-attr-y2=\'{{vm.V(0)}}\' />\n		<line class=\'zero-line\' d3-der="{x1: vm.T(0), x2: vm.T(0), y1: vm.height, y2: 0}" />\n		<g ng-class=\'{hide: !vm.Data.show}\' >\n			<line class=\'tri v\' ng-attr-x1=\'{{vm.T(0)}}\' ng-attr-x2=\'{{vm.T(0)}}\' ng-attr-y1=\'{{vm.V(0)}}\' ng-attr-y2=\'{{vm.V(vm.Data.selected.v)}}\' />\n			<path ng-attr-d=\'{{vm.triangleData()}}\' class=\'tri\' />\n			<path ng-attr-d=\'{{vm.lineFun([vm.point, {v: vm.point.dv + vm.point.v, t: vm.point.t}])}}\' class=\'tri dv\' />\n		</g>\n		<path ng-attr-d=\'{{vm.lineFun(vm.Data.dots)}}\' class=\'fun v\' />\n		<g ng-repeat=\'dot in vm.dots track by dot.id\' datum=dot shifter=\'[vm.T(dot.t),vm.V(dot.v)]\' behavior=\'vm.drag\' dot-der ></g>\n		<circle class=\'dot small\' r=\'4\' shifter=\'[vm.T(vm.Data.first.t),vm.V(vm.Data.first.v)]\' />\n	</g>\n</svg>';

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



},{"../../helpers":19,"./plotData":9,"angular":undefined,"d3":undefined}],8:[function(require,module,exports){
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



},{"../../helpers":19,"./plotData":9,"angular":undefined,"d3":undefined}],9:[function(require,module,exports){
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



},{"lodash":undefined}],10:[function(require,module,exports){
var _, angular, d3, der, math, regCtrl, template,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

angular = require('angular');

d3 = require('d3');

require('../../helpers');

math = require('mathjs');

_ = require('lodash');

template = '<svg ng-init=\'vm.resize()\' width=\'100%\' ng-attr-height=\'{{vm.svg_height}}\'>\n	<defs>\n		<clippath id=\'reg\'>\n			<rect ng-attr-width=\'{{vm.width}}\' ng-attr-height=\'{{vm.height}}\'></rect>\n		</clippath>\n	</defs>\n	<g class=\'boilerplate\' shifter=\'[vm.mar.left, vm.mar.top]\'>\n		<rect class=\'background\' ng-attr-width=\'{{vm.width}}\' ng-attr-height=\'{{vm.height}}\' ng-mousemove=\'vm.move($event)\' />\n		<g ver-axis-der width=\'vm.width\' scale=\'vm.V\' fun=\'vm.verAxFun\'></g>\n		<g hor-axis-der height=\'vm.height\' scale=\'vm.T\' fun=\'vm.horAxFun\' shifter=\'[0,vm.height]\'></g>\n		<foreignObject width=\'30\' height=\'30\' y=\'17\' shifter=\'[vm.width/2, vm.height]\'>\n			<text class=\'label\' >$t$</text>\n		</foreignObject>\n	</g>\n	<g class=\'main\' clip-path="url(#reg)" shifter=\'[vm.mar.left, vm.mar.top]\'>\n		<line class=\'zero-line\' ng-class=\'{"correct": vm.correct}\' x1=\'0\' ng-attr-x2=\'{{vm.width}}\' ng-attr-y1=\'{{vm.V(0)}}\' ng-attr-y2=\'{{vm.V(0)}}\' />\n		<line class=\'tri v\' ng-attr-x1=\'{{vm.T(vm.point.t)}}\' ng-attr-x2=\'{{vm.T(vm.point.t)}}\' ng-attr-y1=\'{{vm.V(0)}}\' ng-attr-y2=\'{{vm.V(vm.point.v)}}\' />\n\n		<path ng-attr-d=\'{{vm.lineFun(vm.data)}}\' class=\'fun v\' />\n		<circle r=\'3px\' shifter=\'[vm.T(vm.point.t), vm.V(vm.point.v)]\' class=\'point\'/>\n	</g>\n</svg>';

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



},{"../../helpers":19,"angular":undefined,"d3":undefined,"lodash":undefined,"mathjs":undefined}],11:[function(require,module,exports){
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



},{}],12:[function(require,module,exports){
var angular, d3, der;

d3 = require('d3');

angular = require('angular');

der = function($parse) {
  var directive;
  return directive = {
    restrict: 'A',
    link: function(scope, el, attr) {
      var sel;
      sel = d3.select(el[0]);
      return scope.$watch(function() {
        return $parse(attr.d3Der)(scope);
      }, function(v) {
        return sel.attr(v);
      }, true);
    }
  };
};

module.exports = der;



},{"angular":undefined,"d3":undefined}],13:[function(require,module,exports){
module.exports = function($parse) {
  return function(scope, el, attr) {
    return d3.select(el[0]).datum($parse(attr.datum)(scope));
  };
};



},{}],14:[function(require,module,exports){
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



},{}],15:[function(require,module,exports){
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



},{}],16:[function(require,module,exports){
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



},{"d3":undefined}],17:[function(require,module,exports){
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



},{"angular":undefined,"d3":undefined}],18:[function(require,module,exports){
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



},{"angular":undefined,"d3":undefined}],19:[function(require,module,exports){
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvbGV3aXMvUmVzZWFyY2gvZGlmZkVRX25ldy9hcHAvYXBwLmNvZmZlZSIsIi9Vc2Vycy9sZXdpcy9SZXNlYXJjaC9kaWZmRVFfbmV3L2FwcC9jb21wb25lbnRzL2NhcnQvY2FydEJ1dHRvbnMuY29mZmVlIiwiL1VzZXJzL2xld2lzL1Jlc2VhcmNoL2RpZmZFUV9uZXcvYXBwL2NvbXBvbmVudHMvY2FydC9jYXJ0RGF0YS5jb2ZmZWUiLCIvVXNlcnMvbGV3aXMvUmVzZWFyY2gvZGlmZkVRX25ldy9hcHAvY29tcG9uZW50cy9jYXJ0L2NhcnRQbG90LmNvZmZlZSIsIi9Vc2Vycy9sZXdpcy9SZXNlYXJjaC9kaWZmRVFfbmV3L2FwcC9jb21wb25lbnRzL2NhcnQvY2FydFNpbS5jb2ZmZWUiLCIvVXNlcnMvbGV3aXMvUmVzZWFyY2gvZGlmZkVRX25ldy9hcHAvY29tcG9uZW50cy9kZXJpdmF0aXZlL2Rlcml2YXRpdmUuY29mZmVlIiwiL1VzZXJzL2xld2lzL1Jlc2VhcmNoL2RpZmZFUV9uZXcvYXBwL2NvbXBvbmVudHMvcGxvdC9wbG90QS5jb2ZmZWUiLCIvVXNlcnMvbGV3aXMvUmVzZWFyY2gvZGlmZkVRX25ldy9hcHAvY29tcG9uZW50cy9wbG90L3Bsb3RCLmNvZmZlZSIsIi9Vc2Vycy9sZXdpcy9SZXNlYXJjaC9kaWZmRVFfbmV3L2FwcC9jb21wb25lbnRzL3Bsb3QvcGxvdERhdGEuY29mZmVlIiwiL1VzZXJzL2xld2lzL1Jlc2VhcmNoL2RpZmZFUV9uZXcvYXBwL2NvbXBvbmVudHMvcmVndWxhci9yZWd1bGFyLmNvZmZlZSIsIi9Vc2Vycy9sZXdpcy9SZXNlYXJjaC9kaWZmRVFfbmV3L2FwcC9kaXJlY3RpdmVzL2JlaGF2aW9yLmNvZmZlZSIsIi9Vc2Vycy9sZXdpcy9SZXNlYXJjaC9kaWZmRVFfbmV3L2FwcC9kaXJlY3RpdmVzL2QzRGVyLmNvZmZlZSIsIi9Vc2Vycy9sZXdpcy9SZXNlYXJjaC9kaWZmRVFfbmV3L2FwcC9kaXJlY3RpdmVzL2RhdHVtLmNvZmZlZSIsIi9Vc2Vycy9sZXdpcy9SZXNlYXJjaC9kaWZmRVFfbmV3L2FwcC9kaXJlY3RpdmVzL2RvdC5jb2ZmZWUiLCIvVXNlcnMvbGV3aXMvUmVzZWFyY2gvZGlmZkVRX25ldy9hcHAvZGlyZWN0aXZlcy9kb3RCLmNvZmZlZSIsIi9Vc2Vycy9sZXdpcy9SZXNlYXJjaC9kaWZmRVFfbmV3L2FwcC9kaXJlY3RpdmVzL3NoaWZ0ZXIuY29mZmVlIiwiL1VzZXJzL2xld2lzL1Jlc2VhcmNoL2RpZmZFUV9uZXcvYXBwL2RpcmVjdGl2ZXMveEF4aXMuY29mZmVlIiwiL1VzZXJzL2xld2lzL1Jlc2VhcmNoL2RpZmZFUV9uZXcvYXBwL2RpcmVjdGl2ZXMveUF4aXMuY29mZmVlIiwiL1VzZXJzL2xld2lzL1Jlc2VhcmNoL2RpZmZFUV9uZXcvYXBwL2hlbHBlcnMuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUEsWUFBQSxDQUFBO0FBQUEsSUFBQSxpTEFBQTs7QUFBQSxPQUNBLEdBQVUsT0FBQSxDQUFRLFNBQVIsQ0FEVixDQUFBOztBQUFBLEVBRUEsR0FBSyxPQUFBLENBQVEsSUFBUixDQUZMLENBQUE7O0FBQUEsS0FHQSxHQUFRLE9BQUEsQ0FBUSxvQkFBUixDQUhSLENBQUE7O0FBQUEsTUFJQSxHQUFTLE9BQUEsQ0FBUSxrQkFBUixDQUpULENBQUE7O0FBQUEsT0FLQSxHQUFVLE9BQUEsQ0FBUSxvQkFBUixDQUxWLENBQUE7O0FBQUEsT0FNQSxHQUFVLE9BQUEsQ0FBUSxvQkFBUixDQU5WLENBQUE7O0FBQUEsUUFPQSxHQUFXLE9BQUEsQ0FBUSx1QkFBUixDQVBYLENBQUE7O0FBQUEsVUFRQSxHQUFhLE9BQUEsQ0FBUSwyQkFBUixDQVJiLENBQUE7O0FBQUEsY0FTQSxHQUFpQixPQUFBLENBQVEsK0JBQVIsQ0FUakIsQ0FBQTs7QUFBQSxPQVVBLEdBQVUsT0FB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SyxDQUFDLE1BQU4sQ0FBYSxtQkFBYixFQUFrQyxNQUFsQyxFQUEyQyxJQUEzQyxDQVpBLENBQUE7YUFhQSxLQUFLLENBQUMsTUFBTixDQUFhLGtCQUFiLEVBQWlDLE1BQWpDLEVBQTBDLElBQTFDLEVBZEs7SUFBQSxDQVROO0lBRkk7QUFBQSxDQUhOLENBQUE7O0FBQUEsTUErQk0sQ0FBQyxPQUFQLEdBQWlCLEdBL0JqQixDQUFBOzs7OztBQ0FBLFlBQUEsQ0FBQTtBQUFBLE1BRU0sQ0FBQyxPQUFPLENBQUMsT0FBZixHQUF5QixTQUFDLEdBQUQsRUFBTSxJQUFOLEdBQUE7U0FDdkIsRUFBRSxDQUFDLEtBQUgsQ0FBUyxDQUFBLFNBQUEsS0FBQSxHQUFBO1dBQUEsU0FBQSxHQUFBO0FBQ1IsTUFBQSxHQUFBLENBQUEsQ0FBQSxDQUFBO2FBQ0EsS0FGUTtJQUFBLEVBQUE7RUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQVQsRUFHQyxJQUhELEVBRHVCO0FBQUEsQ0FGekIsQ0FBQTs7QUFBQSxRQVNRLENBQUEsU0FBRSxDQUFBLFFBQVYsR0FBcUIsU0FBQyxJQUFELEVBQU8sSUFBUCxHQUFBO1NBQ25CLE1BQU0sQ0FBQyxjQUFQLENBQXNCLElBQUMsQ0FBQSxTQUF2QixFQUFrQyxJQUFsQyxFQUF3QyxJQUF4QyxFQURtQjtBQUFBLENBVHJCLENBQUEiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiJ3VzZSBzdHJpY3QnXG5hbmd1bGFyID0gcmVxdWlyZSAnYW5ndWxhcidcbmQzID0gcmVxdWlyZSAnZDMnXG5kYXR1bSA9IHJlcXVpcmUgJy4vZGlyZWN0aXZlcy9kYXR1bSdcbmRvdERlciA9IHJlcXVpcmUgJy4vZGlyZWN0aXZlcy9kb3QnXG5ob3JBeGlzID0gcmVxdWlyZSAnLi9kaXJlY3RpdmVzL3hBeGlzJ1xudmVyQXhpcyA9IHJlcXVpcmUgJy4vZGlyZWN0aXZlcy95QXhpcydcbmJlaGF2aW9yID0gcmVxdWlyZSAnLi9kaXJlY3RpdmVzL2JlaGF2aW9yJ1xuY2FydFNpbURlciA9IHJlcXVpcmUgJy4vY29tcG9uZW50cy9jYXJ0L2NhcnRTaW0nXG5jYXJ0QnV0dG9uc0RlciA9IHJlcXVpcmUgJy4vY29tcG9uZW50cy9jYXJ0L2NhcnRCdXR0b25zJ1xuc2hpZnRlciA9IHJlcXVpcmUgJy4vZGlyZWN0aXZlcy9zaGlmdGVyJ1xubWF0ZXJpYWwgPSByZXF1aXJlICdhbmd1bGFyLW1hdGVyaWFsJ1xucGxvdEFEZXIgPSByZXF1aXJlICcuL2NvbXBvbmVudHMvcGxvdC9wbG90QSdcbnBsb3RCRGVyID0gcmVxdWlyZSAnLi9jb21wb25lbnRzL3Bsb3QvcGxvdEInXG5kM0RlciA9IHJlcXVpcmUgJy4vZGlyZWN0aXZlcy9kM0RlcidcbnJlZ3VsYXJEZXIgPSByZXF1aXJlICcuL2NvbXBvbmVudHMvcmVndWxhci9yZWd1bGFyJ1xuZGVyaXZhdGl2ZURlciAgPSByZXF1aXJlICcuL2NvbXBvbmVudHMvZGVyaXZhdGl2ZS9kZXJpdmF0aXZlJ1xuZG90QkRlciA9IHJlcXVpcmUgJy4vZGlyZWN0aXZlcy9kb3RCJ1xuYXBwID0gYW5ndWxhci5tb2R1bGUgJ21haW5BcHAnLCBbbWF0ZXJpYWxdXG5cdC5kaXJlY3RpdmUgJ2hvckF4aXNEZXInLCBob3JBeGlzXG5cdC5kaXJlY3RpdmUgJ3ZlckF4aXNEZXInLCB2ZXJBeGlzXG5cdC5kaXJlY3RpdmUgJ2NhcnRTaW1EZXInLCBjYXJ0U2ltRGVyXG5cdC5kaXJlY3RpdmUgJ2NhcnRCdXR0b25zRGVyJywgY2FydEJ1dHRvbnNEZXJcblx0LmRpcmVjdGl2ZSAnc2hpZnRlcicgLCBzaGlmdGVyXG5cdC5kaXJlY3RpdmUgJ3Bsb3RBRGVyJywgcGxvdEFEZXJcblx0LmRpcmVjdGl2ZSAnYmVoYXZpb3InLCBiZWhhdmlvclxuXHQuZGlyZWN0aXZlICdkb3REZXInLCBkb3REZXJcblx0LmRpcmVjdGl2ZSAnZGF0dW0nLCBkYXR1bVxuXHQuZGlyZWN0aXZlICdkM0RlcicsIGQzRGVyXG5cdC5kaXJlY3RpdmUgJ3Bsb3RCRGVyJyAsIHBsb3RCRGVyXG5cdC5kaXJlY3RpdmUgJ3JlZ3VsYXJEZXInLCByZWd1bGFyRGVyXG5cdC5kaXJlY3RpdmUgJ2Rlcml2YXRpdmVEZXInLCBkZXJpdmF0aXZlRGVyXG5cdC5kaXJlY3RpdmUgJ2RvdEJEZXInLCBkb3RCRGVyXG5cdC5kaXJlY3RpdmUgJ2NhcnRQbG90RGVyJywgcmVxdWlyZSAnLi9jb21wb25lbnRzL2NhcnQvY2FydFBsb3QnXG5cbmxvb3BlciA9IC0+XG4gICAgc2V0VGltZW91dCggKCktPlxuICAgIFx0XHRcdGQzLnNlbGVjdEFsbCAnY2lyY2xlLmRvdC5sYXJnZSdcbiAgICBcdFx0XHRcdC50cmFuc2l0aW9uICdncm93J1xuICAgIFx0XHRcdFx0LmR1cmF0aW9uIDUwMFxuICAgIFx0XHRcdFx0LmVhc2UgJ2N1YmljLW91dCdcbiAgICBcdFx0XHRcdC5hdHRyICd0cmFuc2Zvcm0nLCAnc2NhbGUoIDEuMzQpJ1xuICAgIFx0XHRcdFx0LnRyYW5zaXRpb24gJ3NocmluaydcbiAgICBcdFx0XHRcdC5kdXJhdGlvbiA1MDBcbiAgICBcdFx0XHRcdC5lYXNlICdjdWJpYy1vdXQnXG4gICAgXHRcdFx0XHQuYXR0ciAndHJhbnNmb3JtJywgJ3NjYWxlKCAxLjApJ1xuICAgIFx0XHRcdGxvb3BlcigpXG4gICAgXHRcdCwgMTAwMClcblxubG9vcGVyKClcbiIsIl8gPSByZXF1aXJlICdsb2Rhc2gnXG57ZXhwLCBzcXJ0LCBhdGFufSA9IE1hdGhcbkNhcnQgPSByZXF1aXJlICcuL2NhcnREYXRhJ1xuXG50ZW1wbGF0ZSA9ICcnJ1xuXHQ8ZGl2IGZsZXggbGF5b3V0PSdyb3cnPlxuXHRcdDxtZC1idXR0b24gZmxleCBjbGFzcz1cIm1kLXJhaXNlZFwiIG5nLWNsaWNrPSd2bS5wbGF5KCknPlBsYXk8L21kLWJ1dHRvbj5cblx0XHQ8bWQtYnV0dG9uIGZsZXggY2xhc3M9XCJtZC1yYWlzZWRcIiBuZy1jbGljaz0ndm0ucGF1c2UoKSc+UGF1c2U8L21kLWJ1dHRvbj5cblx0PC9kaXY+XG4nJydcblxuY2xhc3MgQ3RybFxuXHRjb25zdHJ1Y3RvcjogKEBzY29wZSktPlxuXHRcdEBjYXJ0ID0gQ2FydFxuXG5cdHBsYXk6IC0+XG5cdFx0Q2FydC5wYXVzZWQgPSB0cnVlXG5cdFx0ZDMudGltZXIuZmx1c2goKVxuXHRcdEBjYXJ0LnJlc3RhcnQoKVxuXHRcdENhcnQucGF1c2VkID0gZmFsc2Vcblx0XHRzZXRUaW1lb3V0ID0+XG5cdFx0XHRsYXN0ID0gMFxuXHRcdFx0ZDMudGltZXIgKGVsYXBzZWQpPT5cblx0XHRcdFx0QGNhcnQuaW5jcmVtZW50IChlbGFwc2VkIC0gbGFzdCkvMTAwMFxuXHRcdFx0XHRsYXN0ID0gZWxhcHNlZFxuXHRcdFx0XHRpZiAoQGNhcnQudiA8IC4wMSkgdGhlbiBDYXJ0LnBhdXNlZCA9IHRydWVcblx0XHRcdFx0QHNjb3BlLiRldmFsQXN5bmMoKVxuXHRcdFx0XHRDYXJ0LnBhdXNlZFxuXG5cdHBhdXNlOiAtPlxuXHRcdENhcnQucGF1c2VkID0gdHJ1ZVxuXG5kZXIgPSAoKS0+XG5cdGRpcmVjdGl2ZSA9IFxuXHRcdGNvbnRyb2xsZXJBczogJ3ZtJ1xuXHRcdCMgcmVzdHJpY3Q6ICdFJ1xuXHRcdHNjb3BlOiB7fVxuXHRcdGNvbnRyb2xsZXI6IFsnJHNjb3BlJywgQ3RybF1cblx0XHR0ZW1wbGF0ZTogdGVtcGxhdGVcblxubW9kdWxlLmV4cG9ydHMgPSBkZXIiLCJfID0gcmVxdWlyZSAnbG9kYXNoJ1xue2V4cCwgc3FydCwgYXRhbn0gPSBNYXRoXG5cbmNsYXNzIENhcnRcblx0Y29uc3RydWN0b3I6IChAb3B0aW9ucyktPlxuXHRcdHtAeDAsIEB2MCwgQGJ9ID0gQG9wdGlvbnNcblx0XHRAcmVzdGFydCgpXG5cdHJlc3RhcnQ6IC0+XG5cdFx0QHQgPSAwXG5cdFx0QHRyYWplY3RvcnkgPSBbXVxuXHRcdEBtb3ZlKDApXG5cdFx0QHBhdXNlZCA9IHRydWVcblx0c2V0X3Q6ICh0KS0+XG5cdFx0QHQgPSB0XG5cdFx0QG1vdmUgdFxuXHRpbmNyZW1lbnQ6IChkdCktPlxuXHRcdEB0Kz1kdFxuXHRcdEBtb3ZlIEB0XG5cdG1vdmU6ICh0KS0+XG5cdFx0QHYgPSBAdjAgKiBleHAoLUBiICogdClcblx0XHRAeCA9IEB4MCArIEB2MC9AYiAqICgxLWV4cCgtQGIqdCkpXG5cdFx0QHRyYWplY3RvcnkucHVzaCB7dDogdCwgdjogQHYsIHg6IEB4fVxuXG5tb2R1bGUuZXhwb3J0cyA9IG5ldyBDYXJ0IHt4MDogMCwgdjA6IDQsIGI6IDF9IiwiYW5ndWxhciA9IHJlcXVpcmUgJ2FuZ3VsYXInXG5kMyA9IHJlcXVpcmUgJ2QzJ1xucmVxdWlyZSAnLi4vLi4vaGVscGVycydcbl8gPSByZXF1aXJlICdsb2Rhc2gnXG5DYXJ0ID0gcmVxdWlyZSAnLi9jYXJ0RGF0YSdcbnRlbXBsYXRlID0gJycnXG5cdDxzdmcgbmctaW5pdD0ndm0ucmVzaXplKCknIHdpZHRoPScxMDAlJyBuZy1hdHRyLWhlaWdodD0ne3t2bS5zdmdfaGVpZ2h0fX0nPlxuXHRcdDxkZWZzPlxuXHRcdFx0PGNsaXBwYXRoIGlkPSdzb2wnPlxuXHRcdFx0XHQ8cmVjdCBuZy1hdHRyLXdpZHRoPSd7e3ZtLndpZHRofX0nIG5nLWF0dHItaGVpZ2h0PSd7e3ZtLmhlaWdodH19Jz48L3JlY3Q+XG5cdFx0XHQ8L2NsaXBwYXRoPlxuXHRcdDwvZGVmcz5cblx0XHQ8ZyBjbGFzcz0nYm9pbGVycGxhdGUnIHNoaWZ0ZXI9J1t2bS5tYXIubGVmdCwgdm0ubWFyLnRvcF0nPlxuXHRcdFx0PHJlY3QgY2xhc3M9J2JhY2tncm91bmQnIG5nLWF0dHItd2lkdGg9J3t7dm0ud2lkdGh9fScgbmctYXR0ci1oZWlnaHQ9J3t7dm0uaGVpZ2h0fX0nIG5nLW1vdXNlbW92ZT0ndm0ubW92ZSgkZXZlbnQpJyAvPlxuXHRcdFx0PGcgdmVyLWF4aXMtZGVyIHdpZHRoPSd2bS53aWR0aCcgc2NhbGU9J3ZtLlYnIGZ1bj0ndm0udmVyQXhGdW4nPjwvZz5cblx0XHRcdDxnIGhvci1heGlzLWRlciBoZWlnaHQ9J3ZtLmhlaWdodCcgc2NhbGU9J3ZtLlQnIGZ1bj0ndm0uaG9yQXhGdW4nIHNoaWZ0ZXI9J1swLHZtLmhlaWdodF0nPjwvZz5cblx0XHRcdDxmb3JlaWduT2JqZWN0IHdpZHRoPSczMCcgaGVpZ2h0PSczMCcgeT0nMTcnIHNoaWZ0ZXI9J1t2bS53aWR0aC8yLCB2bS5oZWlnaHRdJz5cblx0XHRcdFx0PHRleHQgY2xhc3M9J2xhYmVsJyA+JHQkPC90ZXh0PlxuXHRcdFx0PC9mb3JlaWduT2JqZWN0PlxuXHRcdFx0PGZvcmVpZ25PYmplY3Qgd2lkdGg9JzMwJyBoZWlnaHQ9JzMwJyBzaGlmdGVyPSdbLTMxLCB2bS5oZWlnaHQvMi04XSc+XG5cdFx0XHRcdFx0PHRleHQgY2xhc3M9J2xhYmVsJyA+JHYkPC90ZXh0PlxuXHRcdFx0PC9mb3JlaWduT2JqZWN0PlxuXHRcdDwvZz5cblx0XHQ8ZyBjbGFzcz0nbWFpbicgY2xpcC1wYXRoPVwidXJsKCNzb2wpXCIgc2hpZnRlcj0nW3ZtLm1hci5sZWZ0LCB2bS5tYXIudG9wXSc+XG5cdFx0XHQ8bGluZSBjbGFzcz0nemVyby1saW5lJyBkMy1kZXI9XCJ7eDE6IDAgLCB4Mjogdm0ud2lkdGgsIHkxOiB2bS5WKDApLCB5Mjogdm0uVigwKX1cIiAvPiBcblx0XHRcdDxsaW5lIGNsYXNzPSd6ZXJvLWxpbmUnIGQzLWRlcj1cInt4MTogdm0uVCgwKSAsIHgyOiB2bS5UKDApLCB5MTogMCwgeTI6IHZtLmhlaWdodH1cIiAvPiBcblx0XHRcdDxsaW5lIGNsYXNzPSd0cmkgdicgIG5nLWF0dHIteDE9J3t7dm0uVCh2bS5DYXJ0LnQpfX0nIG5nLWF0dHIteDI9J3t7dm0uVCh2bS5DYXJ0LnQpfX0nIG5nLWF0dHIteTE9J3t7dm0uVigwKX19JyBuZy1hdHRyLXkyPSd7e3ZtLlYodm0uQ2FydC52KX19JyAvPlxuXG5cdFx0XHQ8cGF0aCBuZy1hdHRyLWQ9J3t7dm0ubGluZUZ1bih2bS5kYXRhKX19JyBjbGFzcz0nZnVuIHYnIC8+XG5cdFx0XHQ8Y2lyY2xlIHI9JzNweCcgc2hpZnRlcj0nW3ZtLlQodm0uQ2FydC50KSwgdm0uVih2bS5DYXJ0LnYpXScgY2xhc3M9J0NhcnQnLz5cblx0XHQ8L2c+XG5cdDwvc3ZnPlxuJycnXG5cbmNsYXNzIEN0cmxcblx0Y29uc3RydWN0b3I6IChAc2NvcGUsIEBlbCwgQHdpbmRvdyktPlxuXHRcdEBtYXIgPSBcblx0XHRcdGxlZnQ6IDMwXG5cdFx0XHR0b3A6IDIwXG5cdFx0XHRyaWdodDogMjBcblx0XHRcdGJvdHRvbTogMzVcblxuXHRcdEBWID0gZDMuc2NhbGUubGluZWFyKCkuZG9tYWluIFstLjEsNV1cblx0XHRcdCMgLmNsYW1wIHRydWVcblx0XHRAVCA9IGQzLnNjYWxlLmxpbmVhcigpLmRvbWFpbiBbLS4xLDVdXG5cdFx0XHQjIC5jbGFtcCB0cnVlXG5cblx0XHRAQ2FydCA9IENhcnRcblxuXHRcdEBob3JBeEZ1biA9IGQzLnN2Zy5heGlzKClcblx0XHRcdC5zY2FsZSBAVFxuXHRcdFx0LnRpY2tzIDVcblx0XHRcdC5vcmllbnQgJ2JvdHRvbSdcblxuXHRcdEB2ZXJBeEZ1biA9IGQzLnN2Zy5heGlzKClcblx0XHRcdC5zY2FsZSBAVlxuXHRcdFx0LnRpY2tzIDVcblx0XHRcdC5vcmllbnQgJ2xlZnQnXG5cdFx0XG5cdFx0QGxpbmVGdW4gPSBkMy5zdmcubGluZSgpXG5cdFx0XHQueSAoZCk9PiBAViBkLnZcblx0XHRcdC54IChkKT0+IEBUIGQudFxuXG5cdFx0dkZ1biA9ICh0KS0+IDQqTWF0aC5leHAgLXRcblxuXHRcdEBkYXRhID0gXy5yYW5nZSAwICwgNSAsIDEvNjBcblx0XHRcdC5tYXAgKHQpLT5cblx0XHRcdFx0cmVzID0gXG5cdFx0XHRcdFx0djogdkZ1biB0XG5cdFx0XHRcdFx0dDogdFxuXG5cdFx0YW5ndWxhci5lbGVtZW50IEB3aW5kb3dcblx0XHRcdC5vbiAncmVzaXplJywgQHJlc2l6ZVxuXG5cdFx0QG1vdmUgPSAoZXZlbnQpID0+XG5cdFx0XHRpZiBub3QgQ2FydC5wYXVzZWQgdGhlbiByZXR1cm5cblx0XHRcdHJlY3QgPSBldmVudC50YXJnZXQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KClcblx0XHRcdHQgPSBAVC5pbnZlcnQgZXZlbnQueCAtIHJlY3QubGVmdFxuXHRcdFx0dCA9IE1hdGgubWF4IDAgLCB0XG5cdFx0XHRDYXJ0LnNldF90IHRcblx0XHRcdEBzY29wZS4kZXZhbEFzeW5jKClcblxuXHRAcHJvcGVydHkgJ3N2Z19oZWlnaHQnLCBnZXQ6IC0+IEBoZWlnaHQgKyBAbWFyLnRvcCArIEBtYXIuYm90dG9tXG5cblx0cmVzaXplOiAoKT0+XG5cdFx0QHdpZHRoID0gQGVsWzBdLmNsaWVudFdpZHRoIC0gQG1hci5sZWZ0IC0gQG1hci5yaWdodFxuXHRcdEBoZWlnaHQgPSBAd2lkdGgqLjcgLSBAbWFyLmxlZnQgLSBAbWFyLnJpZ2h0XG5cdFx0QFYucmFuZ2UgW0BoZWlnaHQsIDBdXG5cdFx0QFQucmFuZ2UgWzAsIEB3aWR0aF1cblx0XHRAc2NvcGUuJGV2YWxBc3luYygpXG5cbmRlciA9ICgpLT5cblx0ZGlyZWN0aXZlID0gXG5cdFx0Y29udHJvbGxlckFzOiAndm0nXG5cdFx0c2NvcGU6IHt9XG5cdFx0dGVtcGxhdGU6IHRlbXBsYXRlXG5cdFx0dGVtcGxhdGVOYW1lc3BhY2U6ICdzdmcnXG5cdFx0Y29udHJvbGxlcjogWyckc2NvcGUnLCckZWxlbWVudCcsICckd2luZG93JywgQ3RybF1cblxubW9kdWxlLmV4cG9ydHMgPSBkZXJcbiIsIl8gPSByZXF1aXJlICdsb2Rhc2gnXG5kMz0gcmVxdWlyZSAnZDMnXG57bWlufSA9IE1hdGhcbkNhcnQgPSByZXF1aXJlICcuL2NhcnREYXRhJ1xucmVxdWlyZSAnLi4vLi4vaGVscGVycydcblxudGVtcGxhdGUgPSAnJydcblx0PHN2ZyBuZy1pbml0PSd2bS5yZXNpemUoKScgd2lkdGg9JzEwMCUnIG5nLWF0dHItaGVpZ2h0PSd7e3ZtLnN2Z19oZWlnaHR9fSc+XG5cdFx0PGcgc2hpZnRlcj0ne3s6Olt2bS5tYXIubGVmdCwgdm0ubWFyLnRvcF19fSc+XG5cdFx0XHQ8cmVjdCBuZy1hdHRyLXdpZHRoPSd7e3ZtLndpZHRofX0nIG5nLWF0dHItaGVpZ2h0PSd7e3ZtLmhlaWdodH19JyBjbGFzcz0nYmFja2dyb3VuZCcvPlxuXHRcdFx0PGcgaG9yLWF4aXMtZGVyIGhlaWdodD0ndm0uaGVpZ2h0JyBzY2FsZT0ndm0uWCcgZnVuPSd2bS5heGlzRnVuJyBzaGlmdGVyPSdbMCx2bS5oZWlnaHRdJz48L2c+XG5cblx0XHRcdDxmb3JlaWduT2JqZWN0IHdpZHRoPSczMCcgaGVpZ2h0PSczMCcgeT0nMjAnIHNoaWZ0ZXI9J1t2bS53aWR0aC8yLCB2bS5oZWlnaHRdJz5cblx0XHRcdFx0XHQ8dGV4dCBjbGFzcz0nbGFiZWwnID4kdCQ8L3RleHQ+XG5cdFx0XHQ8L2ZvcmVpZ25PYmplY3Q+XG5cdFx0XHQ8ZyBjbGFzcz0nZy1jYXJ0Jz5cblx0XHRcdFx0PHJlY3QgY2xhc3M9J2NhcnQnIG5nLWF0dHIteT0ne3t2bS5oZWlnaHQvM319JyBuZy1hdHRyLXdpZHRoPSd7e3ZtLmhlaWdodC8zfX0nIG5nLWF0dHItaGVpZ2h0PSd7e3ZtLmhlaWdodC8zfX0nLz5cblx0XHRcdDwvZz5cblx0XHQ8L2c+XG5cdDwvc3ZnPlxuJycnXG5cbmNsYXNzIEN0cmxcblx0Y29uc3RydWN0b3I6IChAc2NvcGUsIEBlbCwgQHdpbmRvdyktPlxuXHRcdEBjYXJ0ID0gQ2FydFxuXHRcdEBtYXIgPSBcblx0XHRcdGxlZnQ6IDMwXG5cdFx0XHRyaWdodDogMTBcblx0XHRcdHRvcDogMTBcblx0XHRcdGJvdHRvbTogMThcblx0XHRAWCA9IGQzLnNjYWxlLmxpbmVhcigpLmRvbWFpbiBbLS4yNSw1XSBcblx0XHRzZWwgID0gZDMuc2VsZWN0IEBlbFswXVxuXHRcdGNhcnQgPSBzZWwuc2VsZWN0ICcuZy1jYXJ0J1xuXG5cdFx0QGF4aXNGdW4gPSBkMy5zdmcuYXhpcygpXG5cdFx0XHQuc2NhbGUgQFhcblx0XHRcdC50aWNrcyA1XG5cdFx0XHQub3JpZW50ICdib3R0b20nXG5cblx0XHRAc2NvcGUuJHdhdGNoICd2bS5jYXJ0LngnLCAoeCk9PlxuXHRcdFx0eFB4ID0gQFgoeClcblx0XHRcdGNhcnRcblx0XHRcdFx0LnRyYW5zaXRpb24oKVxuXHRcdFx0XHQuZHVyYXRpb24gMTVcblx0XHRcdFx0LmVhc2UgJ2xpbmVhcidcblx0XHRcdFx0LmF0dHIgJ3RyYW5zZm9ybScsIFwidHJhbnNsYXRlKCN7eFB4fSwwKVwiXG5cblx0XHRhbmd1bGFyLmVsZW1lbnQgQHdpbmRvd1xuXHRcdFx0Lm9uICdyZXNpemUnICwgKCk9PkByZXNpemUoKVxuXG5cdEBwcm9wZXJ0eSAnc3ZnX2hlaWdodCcgLCBnZXQ6LT4gQGhlaWdodCArIEBtYXIudG9wICsgQG1hci5ib3R0b21cblxuXHRyZXNpemU6ICgpPT5cblx0XHRAd2lkdGggPSBAZWxbMF0uY2xpZW50V2lkdGggLSBAbWFyLmxlZnQgLSBAbWFyLnJpZ2h0XG5cdFx0QGhlaWdodCA9IEB3aWR0aCouMyAtIEBtYXIudG9wIC0gQG1hci5ib3R0b21cblx0XHRAWC5yYW5nZShbMCwgQHdpZHRoXSlcblx0XHRAc2NvcGUuJGV2YWxBc3luYygpXG5cbmRlciA9ICgpLT5cblx0ZGlyZWN0aXZlID0gXG5cdFx0dGVtcGxhdGU6IHRlbXBsYXRlXG5cdFx0c2NvcGU6IHt9XG5cdFx0cmVzdHJpY3Q6ICdBJ1xuXHRcdGJpbmRUb0NvbnRyb2xsZXI6IHRydWVcblx0XHR0ZW1wbGF0ZU5hbWVzcGFjZTogJ3N2Zydcblx0XHRjb250cm9sbGVyOiBbJyRzY29wZScsICckZWxlbWVudCcsICckd2luZG93JywgQ3RybF1cblx0XHRjb250cm9sbGVyQXM6ICd2bSdcblxubW9kdWxlLmV4cG9ydHMgPSBkZXJcbiIsImFuZ3VsYXIgPSByZXF1aXJlICdhbmd1bGFyJ1xuZDMgPSByZXF1aXJlICdkMydcbnJlcXVpcmUgJy4uLy4uL2hlbHBlcnMnXG5tYXRoID0gcmVxdWlyZSAnbWF0aGpzJ1xuXyA9IHJlcXVpcmUgJ2xvZGFzaCdcbnRlbXBsYXRlID0gJycnXG5cdDxzdmcgbmctaW5pdD0ndm0ucmVzaXplKCknIHdpZHRoPScxMDAlJyBuZy1hdHRyLWhlaWdodD0ne3t2bS5zdmdfaGVpZ2h0fX0nPlxuXHRcdDxkZWZzPlxuXHRcdFx0PGNsaXBwYXRoIGlkPSdyZWcnPlxuXHRcdFx0XHQ8cmVjdCBuZy1hdHRyLXdpZHRoPSd7e3ZtLndpZHRofX0nIG5nLWF0dHItaGVpZ2h0PSd7e3ZtLmhlaWdodH19Jz48L3JlY3Q+XG5cdFx0XHQ8L2NsaXBwYXRoPlxuXHRcdDwvZGVmcz5cblx0XHQ8ZyBjbGFzcz0nYm9pbGVycGxhdGUnIHNoaWZ0ZXI9J1t2bS5tYXIubGVmdCwgdm0ubWFyLnRvcF0nPlxuXHRcdFx0PHJlY3QgY2xhc3M9J2JhY2tncm91bmQnIG5nLWF0dHItd2lkdGg9J3t7dm0ud2lkdGh9fScgbmctYXR0ci1oZWlnaHQ9J3t7dm0uaGVpZ2h0fX0nIG5nLW1vdXNlbW92ZT0ndm0ubW92ZSgkZXZlbnQpJyAvPlxuXHRcdFx0PGcgdmVyLWF4aXMtZGVyIHdpZHRoPSd2bS53aWR0aCcgc2NhbGU9J3ZtLlYnIGZ1bj0ndm0udmVyQXhGdW4nPjwvZz5cblx0XHRcdDxnIGhvci1heGlzLWRlciBoZWlnaHQ9J3ZtLmhlaWdodCcgc2NhbGU9J3ZtLlQnIGZ1bj0ndm0uaG9yQXhGdW4nIHNoaWZ0ZXI9J1swLHZtLmhlaWdodF0nPjwvZz5cblx0XHRcdDxmb3JlaWduT2JqZWN0IHdpZHRoPSczMCcgaGVpZ2h0PSczMCcgeT0nMTcnIHNoaWZ0ZXI9J1t2bS53aWR0aC8yLCB2bS5oZWlnaHRdJz5cblx0XHRcdFx0XHQ8dGV4dCBjbGFzcz0nbGFiZWwnID4kdCQ8L3RleHQ+XG5cdFx0XHQ8L2ZvcmVpZ25PYmplY3Q+XG5cdFx0PC9nPlxuXHRcdDxnIGNsYXNzPSdtYWluJyBjbGlwLXBhdGg9XCJ1cmwoI3JlZylcIiBzaGlmdGVyPSdbdm0ubWFyLmxlZnQsIHZtLm1hci50b3BdJz5cblx0XHRcdDxsaW5lIGNsYXNzPSd6ZXJvLWxpbmUnIHgxPScwJyBuZy1hdHRyLXgyPSd7e3ZtLndpZHRofX0nIG5nLWF0dHIteTE9J3t7dm0uVigwKX19JyBuZy1hdHRyLXkyPSd7e3ZtLlYoMCl9fScgLz5cblx0XHRcdDxwYXRoIG5nLWF0dHItZD0ne3t2bS5saW5lRnVuKHZtLmRhdGEpfX0nIGNsYXNzPSdmdW4gdicgLz5cblx0XHRcdDxwYXRoIG5nLWF0dHItZD0ne3t2bS50cmlhbmdsZURhdGEoKX19JyBjbGFzcz0ndHJpJyAvPlxuXHRcdFx0PGZvcmVpZ25PYmplY3Qgd2lkdGg9JzMwJyBoZWlnaHQ9JzMwJyBzaGlmdGVyPSdbKHZtLlQodm0ucG9pbnQudCkgLSAxNiksIHZtLnN0aGluZ10nIHN0eWxlPSdmb250LXNpemU6IDEzcHg7IGZvbnQtd2VpZ2h0OiAxMDA7Jz5cblx0XHRcdFx0XHQ8dGV4dCBjbGFzcz0nbGFiZWwnIGZvbnQtc2l6ZT0nMTNweCc+JFxcXFxkb3R7dn0kPC90ZXh0PlxuXHRcdFx0PC9mb3JlaWduT2JqZWN0PlxuXHRcdFx0PHBhdGggbmctYXR0ci1kPSd7e3ZtLmxpbmVGdW4oW3ZtLnBvaW50LCB7djogdm0ucG9pbnQuZHYgKyB2bS5wb2ludC52LCB0OiB2bS5wb2ludC50fV0pfX0nIGNsYXNzPSd0cmkgZnVuIGR2JyAvPlxuXHRcdFx0PHBhdGggbmctYXR0ci1kPSd7e3ZtLmxpbmVGdW4oW3t2OiB2bS5wb2ludC5kdiwgdDogdm0ucG9pbnQudH0sIHt2OiAwLCB0OiB2bS5wb2ludC50fV0pfX0nIGNsYXNzPSdmdW4gZHYnIHN0eWxlPSdvcGFjaXR5OiAuNDsnLz5cblx0XHRcdDxwYXRoIG5nLWF0dHItZD0ne3t2bS5saW5lRnVuMih2bS5kYXRhKX19JyBjbGFzcz0nZnVuIGR2JyBzdHlsZT0nb3BhY2l0eTogLjMnIC8+XG5cdFx0XHQ8Y2lyY2xlIHI9JzNweCcgIHNoaWZ0ZXI9J1t2bS5UKHZtLnBvaW50LnQpLCB2bS5WKHZtLnBvaW50LnYpXScgY2xhc3M9J3BvaW50Jy8+XG5cdFx0PC9nPlxuXHQ8L3N2Zz5cbicnJ1xuXHRcdFx0XG5jbGFzcyB0cmlDdHJsXG5cdGNvbnN0cnVjdG9yOiAoQHNjb3BlLCBAZWwsIEB3aW5kb3cpLT5cblx0XHRAbWFyID0gXG5cdFx0XHRsZWZ0OiAzMFxuXHRcdFx0dG9wOiAyMFxuXHRcdFx0cmlnaHQ6IDIwXG5cdFx0XHRib3R0b206IDM1XG5cblx0XHRAViA9IGQzLnNjYWxlLmxpbmVhcigpLmRvbWFpbiBbLTIsMl1cblx0XHRAVCA9IGQzLnNjYWxlLmxpbmVhcigpLmRvbWFpbiBbMCw4XVxuXG5cdFx0QGhvckF4RnVuID0gZDMuc3ZnLmF4aXMoKVxuXHRcdFx0LnNjYWxlIEBUXG5cdFx0XHQub3JpZW50ICdib3R0b20nXG5cblx0XHRAdmVyQXhGdW4gPSBkMy5zdmcuYXhpcygpXG5cdFx0XHQuc2NhbGUgQFZcblx0XHRcdC50aWNrcyA1XG5cdFx0XHQub3JpZW50ICdsZWZ0J1xuXG5cdFx0QGxpbmVGdW4gPSBkMy5zdmcubGluZSgpXG5cdFx0XHQueSAoZCk9PiBAViBkLnZcblx0XHRcdC54IChkKT0+IEBUIGQudFxuXHRcdEBsaW5lRnVuMiA9IGQzLnN2Zy5saW5lKClcblx0XHRcdC55IChkKT0+IEBWIGQuZHZcblx0XHRcdC54IChkKT0+IEBUIGQudFxuXG5cdFx0cGFyc2VyID0gbWF0aC5wYXJzZXIoKVxuXHRcdHBhcnNlci5ldmFsICd2KHQpID0gc2luKHQpJ1xuXHRcdHBhcnNlci5ldmFsICdkdih0KSA9IGNvcyh0KSdcblx0XHR2ID0gcGFyc2VyLmdldCAndidcblx0XHRkdiA9IHBhcnNlci5nZXQgJ2R2J1xuXG5cdFx0QGRhdGEgPSBfLnJhbmdlIDAgLCA4ICwgMS81MFxuXHRcdFx0Lm1hcCAodCktPlxuXHRcdFx0XHRyZXMgPSBcblx0XHRcdFx0XHRkdjogZHYgdFxuXHRcdFx0XHRcdHY6IHYgdFxuXHRcdFx0XHRcdHQ6IHRcblxuXHRcdEBwb2ludCA9IF8uc2FtcGxlIEBkYXRhXG5cblx0XHRhbmd1bGFyLmVsZW1lbnQgQHdpbmRvd1xuXHRcdFx0Lm9uICdyZXNpemUnLCBAcmVzaXplXG5cblx0XHRAbW92ZSA9IChldmVudCkgPT5cblx0XHRcdHJlY3QgPSBldmVudC50YXJnZXQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KClcblx0XHRcdHQgPSBAVC5pbnZlcnQgKGV2ZW50LnggLSByZWN0LmxlZnQpXG5cdFx0XHRAcG9pbnQgPSBcblx0XHRcdFx0dDogdFxuXHRcdFx0XHR2OiB2IHRcblx0XHRcdFx0ZHY6IGR2IHRcblx0XHRcdEBzY29wZS4kZXZhbEFzeW5jKClcblxuXHRAcHJvcGVydHkgJ3N2Z19oZWlnaHQnLCBnZXQ6IC0+IEBoZWlnaHQgKyBAbWFyLnRvcCArIEBtYXIuYm90dG9tXG5cblx0QHByb3BlcnR5ICdzdGhpbmcnLCBnZXQ6LT5cblx0XHRAVihAcG9pbnQuZHYvMiArIEBwb2ludC52KSAtIDdcblxuXG5cdHRyaWFuZ2xlRGF0YTotPlxuXHRcdEBsaW5lRnVuIFt7djogQHBvaW50LnYsIHQ6IEBwb2ludC50fSwge3Y6QHBvaW50LmR2ICsgQHBvaW50LnYsIHQ6IEBwb2ludC50KzF9LCB7djogQHBvaW50LmR2ICsgQHBvaW50LnYsIHQ6IEBwb2ludC50fV1cblxuXHRyZXNpemU6ICgpPT5cblx0XHRAd2lkdGggPSBAZWxbMF0uY2xpZW50V2lkdGggLSBAbWFyLmxlZnQgLSBAbWFyLnJpZ2h0XG5cdFx0QGhlaWdodCA9IEBlbFswXS5wYXJlbnRFbGVtZW50LmNsaWVudEhlaWdodCAtIEBtYXIubGVmdCAtIEBtYXIucmlnaHRcblx0XHRAVi5yYW5nZSBbQGhlaWdodCwgMF1cblx0XHRAVC5yYW5nZSBbMCwgQHdpZHRoXVxuXHRcdEBzY29wZS4kZXZhbEFzeW5jKClcblxuZGVyID0gKCktPlxuXHRkaXJlY3RpdmUgPSBcblx0XHRjb250cm9sbGVyQXM6ICd2bSdcblx0XHRzY29wZToge31cblx0XHR0ZW1wbGF0ZTogdGVtcGxhdGVcblx0XHR0ZW1wbGF0ZU5hbWVzcGFjZTogJ3N2Zydcblx0XHRjb250cm9sbGVyOiBbJyRzY29wZScsJyRlbGVtZW50JywgJyR3aW5kb3cnLCB0cmlDdHJsXVxuXG5tb2R1bGUuZXhwb3J0cyA9IGRlclxuIiwiYW5ndWxhciA9IHJlcXVpcmUgJ2FuZ3VsYXInXG5kMyA9IHJlcXVpcmUgJ2QzJ1xuRGF0YSA9IHJlcXVpcmUgJy4vcGxvdERhdGEnXG5yZXF1aXJlICcuLi8uLi9oZWxwZXJzJ1xudGVtcGxhdGUgPSAnJydcblx0PGgzPlBsb3QgQTwvaDM+XG5cdDxzdmcgbmctaW5pdD0ndm0ucmVzaXplKCknIHdpZHRoPScxMDAlJyBuZy1hdHRyLWhlaWdodD0ne3t2bS5zdmdfaGVpZ2h0fX0nPlxuXHRcdDxkZWZzPlxuXHRcdFx0PGNsaXBwYXRoIGlkPSdwbG90QSc+XG5cdFx0XHRcdDxyZWN0IG5nLWF0dHItd2lkdGg9J3t7dm0ud2lkdGh9fScgbmctYXR0ci1oZWlnaHQ9J3t7dm0uaGVpZ2h0fX0nPjwvcmVjdD5cblx0XHRcdDwvY2xpcHBhdGg+XG5cdFx0PC9kZWZzPlxuXHRcdDxnIGNsYXNzPSdib2lsZXJwbGF0ZScgc2hpZnRlcj0nW3ZtLm1hci5sZWZ0LCB2bS5tYXIudG9wXSc+XG5cdFx0XHQ8cmVjdCBjbGFzcz0nYmFja2dyb3VuZCcgbmctYXR0ci13aWR0aD0ne3t2bS53aWR0aH19JyBuZy1hdHRyLWhlaWdodD0ne3t2bS5oZWlnaHR9fScgYmVoYXZpb3I9J3ZtLmRyYWdfcmVjdCc+PC9yZWN0PlxuXHRcdFx0PGcgdmVyLWF4aXMtZGVyIHdpZHRoPSd2bS53aWR0aCcgc2NhbGU9J3ZtLlYnIGZ1bj0ndm0udmVyQXhGdW4nPjwvZz5cblx0XHRcdDxnIGhvci1heGlzLWRlciBoZWlnaHQ9J3ZtLmhlaWdodCcgc2NhbGU9J3ZtLlQnIGZ1bj0ndm0uaG9yQXhGdW4nIHNoaWZ0ZXI9J1swLHZtLmhlaWdodF0nPjwvZz5cblx0XHRcdDxnIGhvci1heGlzLWRlciBoZWlnaHQ9J3ZtLmhlaWdodCcgc2NhbGU9J3ZtLlQnIGZ1bj0ndm0uaG9yQXhGdW4nIHNoaWZ0ZXI9J1swLHZtLmhlaWdodF0nPjwvZz5cblx0XHRcdDxmb3JlaWduT2JqZWN0IHdpZHRoPSczMCcgaGVpZ2h0PSczMCcgc2hpZnRlcj0nWy0zMSwgdm0uaGVpZ2h0LzJdJz5cblx0XHRcdFx0XHQ8dGV4dCBjbGFzcz0nbGFiZWwnPiR2JDwvdGV4dD5cblx0XHRcdDwvZm9yZWlnbk9iamVjdD5cblx0XHRcdDxmb3JlaWduT2JqZWN0IHdpZHRoPSczMCcgaGVpZ2h0PSczMCcgeT0nMjAnIHNoaWZ0ZXI9J1t2bS53aWR0aC8yLCB2bS5oZWlnaHRdJz5cblx0XHRcdFx0XHQ8dGV4dCBjbGFzcz0nbGFiZWwnID4kdCQ8L3RleHQ+XG5cdFx0XHQ8L2ZvcmVpZ25PYmplY3Q+XG5cdFx0PC9nPlxuXHRcdDxnIGNsYXNzPSdtYWluJyBjbGlwLXBhdGg9XCJ1cmwoI3Bsb3RBKVwiIHNoaWZ0ZXI9J1t2bS5tYXIubGVmdCwgdm0ubWFyLnRvcF0nPlxuXHRcdFx0PGxpbmUgY2xhc3M9J3plcm8tbGluZScgeDE9JzAnIG5nLWF0dHIteDI9J3t7dm0ud2lkdGh9fScgbmctYXR0ci15MT0ne3t2bS5WKDApfX0nIG5nLWF0dHIteTI9J3t7dm0uVigwKX19JyAvPlxuXHRcdFx0PGxpbmUgY2xhc3M9J3plcm8tbGluZScgZDMtZGVyPVwie3gxOiB2bS5UKDApLCB4Mjogdm0uVCgwKSwgeTE6IHZtLmhlaWdodCwgeTI6IDB9XCIgLz5cblx0XHRcdDxnIG5nLWNsYXNzPSd7aGlkZTogIXZtLkRhdGEuc2hvd30nID5cblx0XHRcdFx0PGxpbmUgY2xhc3M9J3RyaSB2JyBuZy1hdHRyLXgxPSd7e3ZtLlQoMCl9fScgbmctYXR0ci14Mj0ne3t2bS5UKDApfX0nIG5nLWF0dHIteTE9J3t7dm0uVigwKX19JyBuZy1hdHRyLXkyPSd7e3ZtLlYodm0uRGF0YS5zZWxlY3RlZC52KX19JyAvPlxuXHRcdFx0XHQ8cGF0aCBuZy1hdHRyLWQ9J3t7dm0udHJpYW5nbGVEYXRhKCl9fScgY2xhc3M9J3RyaScgLz5cblx0XHRcdFx0PHBhdGggbmctYXR0ci1kPSd7e3ZtLmxpbmVGdW4oW3ZtLnBvaW50LCB7djogdm0ucG9pbnQuZHYgKyB2bS5wb2ludC52LCB0OiB2bS5wb2ludC50fV0pfX0nIGNsYXNzPSd0cmkgZHYnIC8+XG5cdFx0XHQ8L2c+XG5cdFx0XHQ8cGF0aCBuZy1hdHRyLWQ9J3t7dm0ubGluZUZ1bih2bS5EYXRhLmRvdHMpfX0nIGNsYXNzPSdmdW4gdicgLz5cblx0XHRcdDxnIG5nLXJlcGVhdD0nZG90IGluIHZtLmRvdHMgdHJhY2sgYnkgZG90LmlkJyBkYXR1bT1kb3Qgc2hpZnRlcj0nW3ZtLlQoZG90LnQpLHZtLlYoZG90LnYpXScgYmVoYXZpb3I9J3ZtLmRyYWcnIGRvdC1kZXIgPjwvZz5cblx0XHRcdDxjaXJjbGUgY2xhc3M9J2RvdCBzbWFsbCcgcj0nNCcgc2hpZnRlcj0nW3ZtLlQodm0uRGF0YS5maXJzdC50KSx2bS5WKHZtLkRhdGEuZmlyc3QudildJyAvPlxuXHRcdDwvZz5cblx0PC9zdmc+XG4nJydcblxuXG5jbGFzcyBDdHJsXG5cdGNvbnN0cnVjdG9yOiAoQHNjb3BlLCBAZWwsIEB3aW5kb3cpLT5cblx0XHRAbWFyID0gXG5cdFx0XHRsZWZ0OiAzMFxuXHRcdFx0dG9wOiAxMFxuXHRcdFx0cmlnaHQ6IDIwXG5cdFx0XHRib3R0b206IDM3XG5cblx0XHRAViA9IGQzLnNjYWxlLmxpbmVhcigpLmRvbWFpbiBbLS4yNSw1XVxuXG5cdFx0QFQgPSBkMy5zY2FsZS5saW5lYXIoKS5kb21haW4gWy0uMjUsNV1cblxuXHRcdEBEYXRhID0gRGF0YVxuXG5cdFx0QGhvckF4RnVuID0gZDMuc3ZnLmF4aXMoKVxuXHRcdFx0LnNjYWxlIEBUXG5cdFx0XHQudGlja3MgNVxuXHRcdFx0Lm9yaWVudCAnYm90dG9tJ1xuXG5cdFx0QHZlckF4RnVuID0gZDMuc3ZnLmF4aXMoKVxuXHRcdFx0LnNjYWxlIEBWXG5cdFx0XHQudGlja3MgNVxuXHRcdFx0Lm9yaWVudCAnbGVmdCdcblx0XHRcblx0XHRAbGluZUZ1biA9IGQzLnN2Zy5saW5lKClcblx0XHRcdC55IChkKT0+IEBWIGQudlxuXHRcdFx0LnggKGQpPT4gQFQgZC50XG5cblx0XHRAZHJhZ19yZWN0ID0gZDMuYmVoYXZpb3IuZHJhZygpXG5cdFx0XHQub24gJ2RyYWdzdGFydCcsICgpPT5cblx0XHRcdFx0RGF0YS5zaG93PSB0cnVlXG5cdFx0XHRcdGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpXG5cdFx0XHRcdGlmIGV2ZW50LndoaWNoIGlzIDNcblx0XHRcdFx0XHRyZXR1cm4gZXZlbnQucHJldmVudERlZmF1bHQoKVxuXHRcdFx0XHRyZWN0ID0gZXZlbnQudG9FbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpXG5cdFx0XHRcdHQgPSBAVC5pbnZlcnQgZXZlbnQueCAtIHJlY3QubGVmdFxuXHRcdFx0XHR2ICA9IEBWLmludmVydCBldmVudC55IC0gcmVjdC50b3Bcblx0XHRcdFx0RGF0YS5hZGRfZG90IHQgLCB2XG5cdFx0XHRcdEBzY29wZS4kZXZhbEFzeW5jKClcblx0XHRcdC5vbiAnZHJhZycsID0+IEBvbl9kcmFnKERhdGEuc2VsZWN0ZWQpXG5cdFx0XHQub24gJ2RyYWdlbmQnLCA9PiBcblx0XHRcdFx0RGF0YS5zaG93ID0gZmFsc2Vcblx0XHRcdFx0QHNjb3BlLiRldmFsQXN5bmMoKVxuXG5cdFx0QGRyYWcgPSBkMy5iZWhhdmlvci5kcmFnKClcblx0XHRcdC5vbiAnZHJhZ3N0YXJ0JywgKGRvdCk9PlxuXHRcdFx0XHREYXRhLnNob3cgPSB0cnVlXG5cdFx0XHRcdGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpXG5cdFx0XHRcdGlmIGV2ZW50LndoaWNoIGlzIDNcblx0XHRcdFx0XHREYXRhLnJlbW92ZV9kb3QgZG90XG5cdFx0XHRcdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKVxuXHRcdFx0XHRcdEBzY29wZS4kZXZhbEFzeW5jKClcblx0XHRcdC5vbiAnZHJhZycsIEBvbl9kcmFnXG5cdFx0XHQub24gJ2RyYWdlbmQnLCA9PiBcblx0XHRcdFx0RGF0YS5zaG93ID0gZmFsc2Vcblx0XHRcdFx0QHNjb3BlLiRldmFsQXN5bmMoKVxuXG5cdFx0YW5ndWxhci5lbGVtZW50IEB3aW5kb3dcblx0XHRcdC5vbiAncmVzaXplJywgQHJlc2l6ZVxuXG5cdEBwcm9wZXJ0eSAnc3ZnX2hlaWdodCcsIGdldDogLT4gQGhlaWdodCArIEBtYXIudG9wICsgQG1hci5ib3R0b21cblxuXHRAcHJvcGVydHkgJ2RvdHMnLCBnZXQ6LT4gXG5cdFx0cmVzID0gRGF0YS5kb3RzLmZpbHRlciAoZCktPlxuXHRcdFx0ZC5pZCAhPSAnZmlyc3QnXG5cblx0b25fZHJhZzogKGRvdCk9PiBcblx0XHRcdGlmIGV2ZW50LndoaWNoIGlzIDNcblx0XHRcdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKVxuXHRcdFx0XHRyZXR1cm5cblx0XHRcdERhdGEudXBkYXRlX2RvdCBkb3QsIEBULmludmVydChkMy5ldmVudC54KSwgQFYuaW52ZXJ0KGQzLmV2ZW50LnkpXG5cdFx0XHRAc2NvcGUuJGV2YWxBc3luYygpXG5cblx0QHByb3BlcnR5ICdwb2ludCcsIGdldDogLT4gRGF0YS5zZWxlY3RlZFxuXG5cdHRyaWFuZ2xlRGF0YTotPlxuXHRcdHBvaW50ID0gRGF0YS5zZWxlY3RlZFxuXHRcdEBsaW5lRnVuIFt7djogcG9pbnQudiwgdDogcG9pbnQudH0sIHt2OnBvaW50LmR2ICsgcG9pbnQudiwgdDogcG9pbnQudCsxfSwge3Y6IHBvaW50LmR2ICsgcG9pbnQudiwgdDogcG9pbnQudH1dXG5cblx0cmVzaXplOiAoKT0+XG5cdFx0QHdpZHRoID0gQGVsWzBdLmNsaWVudFdpZHRoIC0gQG1hci5sZWZ0IC0gQG1hci5yaWdodFxuXHRcdEBoZWlnaHQgPSBAd2lkdGggKiAuN1xuXHRcdEBWLnJhbmdlIFtAaGVpZ2h0LCAwXVxuXHRcdEBULnJhbmdlIFswLCBAd2lkdGhdXG5cdFx0QHNjb3BlLiRldmFsQXN5bmMoKVxuXG5cbmRlciA9ICgpLT5cblx0ZGlyZWN0aXZlID0gXG5cdFx0Y29udHJvbGxlckFzOiAndm0nXG5cdFx0c2NvcGU6IHt9XG5cdFx0dGVtcGxhdGU6IHRlbXBsYXRlXG5cdFx0dGVtcGxhdGVOYW1lc3BhY2U6ICdzdmcnXG5cdFx0Y29udHJvbGxlcjogWyckc2NvcGUnLCckZWxlbWVudCcsICckd2luZG93JywgQ3RybF1cblxubW9kdWxlLmV4cG9ydHMgPSBkZXJcbiIsIkRhdGEgPSByZXF1aXJlICcuL3Bsb3REYXRhJ1xuYW5ndWxhciA9IHJlcXVpcmUgJ2FuZ3VsYXInXG5kMyA9IHJlcXVpcmUgJ2QzJ1xucmVxdWlyZSAnLi4vLi4vaGVscGVycydcblxudGVtcGxhdGUgPSAnJydcblx0PGgzPlBsb3QgQjwvaDM+XG5cdDxzdmcgbmctaW5pdD0ndm0ucmVzaXplKCknICB3aWR0aD0nMTAwJScgbmctYXR0ci1oZWlnaHQ9J3t7dm0uc3ZnX2hlaWdodH19Jz5cblx0XHQ8ZGVmcz5cblx0XHRcdDxjbGlwcGF0aCBpZD0ncGxvdEInPlxuXHRcdFx0XHQ8cmVjdCBuZy1hdHRyLXdpZHRoPSd7e3ZtLndpZHRofX0nIG5nLWF0dHItaGVpZ2h0PSd7e3ZtLmhlaWdodH19Jz48L3JlY3Q+XG5cdFx0XHQ8L2NsaXBwYXRoPlxuXHRcdDwvZGVmcz5cblx0XHQ8ZyBjbGFzcz0nYm9pbGVycGxhdGUnIHNoaWZ0ZXI9J1t2bS5tYXIubGVmdCwgdm0ubWFyLnRvcF0nPlxuXHRcdFx0PHJlY3QgY2xhc3M9J2JhY2tncm91bmQnIG5nLWF0dHItd2lkdGg9J3t7dm0ud2lkdGh9fScgbmctYXR0ci1oZWlnaHQ9J3t7dm0uaGVpZ2h0fX0nPjwvcmVjdD5cblx0XHRcdDxnIHZlci1heGlzLWRlciB3aWR0aD0ndm0ud2lkdGgnIHNjYWxlPSd2bS5EVicgZnVuPSd2bS52ZXJBeEZ1bic+PC9nPlxuXHRcdFx0PGcgaG9yLWF4aXMtZGVyIGhlaWdodD0ndm0uaGVpZ2h0JyBzY2FsZT0ndm0uVicgZnVuPSd2bS5ob3JBeEZ1bicgc2hpZnRlcj0nWzAsdm0uaGVpZ2h0XSc+PC9nPlxuXHRcdFx0PGZvcmVpZ25PYmplY3Qgd2lkdGg9JzMwJyBoZWlnaHQ9JzMwJyBzaGlmdGVyPSdbLTMxLCB2bS5oZWlnaHQvMl0nPlxuXHRcdFx0XHRcdDx0ZXh0IGNsYXNzPSdsYWJlbCc+JFxcXFxkb3R7dn0kPC90ZXh0PlxuXHRcdFx0PC9mb3JlaWduT2JqZWN0PlxuXHRcdFx0PGZvcmVpZ25PYmplY3Qgd2lkdGg9JzMwJyBoZWlnaHQ9JzMwJyB5PScyMCcgc2hpZnRlcj0nW3ZtLndpZHRoLzIsIHZtLmhlaWdodF0nPlxuXHRcdFx0XHRcdDx0ZXh0IGNsYXNzPSdsYWJlbCcgPiR2JDwvdGV4dD5cblx0XHRcdDwvZm9yZWlnbk9iamVjdD5cblx0XHQ8L2c+XG5cdFx0PGcgY2xhc3M9J21haW4nIGNsaXAtcGF0aD1cInVybCgjcGxvdEIpXCIgc2hpZnRlcj0nW3ZtLm1hci5sZWZ0LCB2bS5tYXIudG9wXSc+XG5cdFx0XHQ8bGluZSBjbGFzcz0nemVyby1saW5lJyB4MT0nMCcgbmctYXR0ci14Mj0ne3t2bS53aWR0aH19JyBuZy1hdHRyLXkxPSd7e3ZtLkRWKDApfX0nIG5nLWF0dHIteTI9J3t7dm0uRFYoMCl9fScgLz5cblx0XHRcdDxsaW5lIGNsYXNzPSd6ZXJvLWxpbmUnIHkxPScwJyBuZy1hdHRyLXkyPSd7e3ZtLmhlaWdodH19JyBuZy1hdHRyLXgxPSd7e3ZtLlYoMCl9fScgbmctYXR0ci14Mj0ne3t2bS5WKDApfX0nIC8+XG5cdFx0XHQ8cGF0aCBuZy1hdHRyLWQ9J3t7dm0ubGluZUZ1bih2bS5EYXRhLnRhcmdldF9kYXRhKX19JyBjbGFzcz0nZnVuIHRhcmdldCcgLz5cblx0XHRcdDxnIG5nLWNsYXNzPSd7aGlkZTogIXZtLkRhdGEuc2hvd30nID5cblx0XHRcdFx0PGxpbmUgY2xhc3M9J3RyaSB2JyBuZy1hdHRyLXkxPSd7e3ZtLkRWKDApfX0nIG5nLWF0dHIteTI9J3t7dm0uRFYoMCl9fScgbmctYXR0ci14MT0ne3t2bS5WKDApfX0nIG5nLWF0dHIteDI9J3t7dm0uVih2bS5EYXRhLnNlbGVjdGVkLnYpfX0nIC8+XG5cdFx0XHRcdDxsaW5lIGNsYXNzPSd0cmkgZHYnIG5nLWF0dHIteDE9J3t7dm0uVigwKX19JyBuZy1hdHRyLXgyPSd7e3ZtLlYoMCl9fScgbmctYXR0ci15MT0ne3t2bS5EVigwKX19JyBuZy1hdHRyLXkyPSd7e3ZtLkRWKHZtLkRhdGEuc2VsZWN0ZWQuZHYpfX0nIC8+XG5cdFx0XHRcdDxwYXRoIG5nLWF0dHItZD0ne3t2bS5saW5lRnVuKHZtLkRhdGEudGFyZ2V0X2RhdGEpfX0nIGNsYXNzPSdmdW4gY29ycmVjdCcgbmctY2xhc3M9J3toaWRlOiAhdm0uRGF0YS5jb3JyZWN0fScgLz5cblx0XHRcdDwvZz5cblx0XHRcdDxwYXRoIG5nLWF0dHItZD0ne3t2bS5saW5lRnVuKHZtLmRvdHMpfX0nIGNsYXNzPSdmdW4gZHYnIC8+XG5cdFx0XHQ8ZyBuZy1yZXBlYXQ9J2RvdCBpbiB2bS5kb3RzIHRyYWNrIGJ5IGRvdC5pZCcgc2hpZnRlcj0nW3ZtLlYoZG90LnYpLHZtLkRWKGRvdC5kdildJyBkb3QtYi1kZXI+PC9nPlxuXHRcdDwvZz5cblx0PC9zdmc+XG4nJydcblxuY2xhc3MgQ3RybFxuXHRjb25zdHJ1Y3RvcjogKEBzY29wZSwgQGVsLCBAd2luZG93KS0+XG5cdFx0QG1hciA9IFxuXHRcdFx0bGVmdDogMzBcblx0XHRcdHRvcDogMTBcblx0XHRcdHJpZ2h0OiAyMFxuXHRcdFx0Ym90dG9tOiAzN1xuXG5cdFx0QERWID0gZDMuc2NhbGUubGluZWFyKCkuZG9tYWluIFstNSwgLjI1XVxuXG5cdFx0QFYgPSBkMy5zY2FsZS5saW5lYXIoKS5kb21haW4gWy0uMjUsNF1cblxuXHRcdEBob3JBeEZ1biA9IGQzLnN2Zy5heGlzKClcblx0XHRcdC5zY2FsZSBAVlxuXHRcdFx0LnRpY2tzIDRcblx0XHRcdC5vcmllbnQgJ2JvdHRvbSdcblxuXHRcdEB2ZXJBeEZ1biA9IGQzLnN2Zy5heGlzKClcblx0XHRcdC5zY2FsZSBARFZcblx0XHRcdC50aWNrcyA1XG5cdFx0XHQub3JpZW50ICdsZWZ0J1xuXG5cdFx0QERhdGEgPSBEYXRhXG5cblx0XHRAbGluZUZ1biA9IGQzLnN2Zy5saW5lKClcblx0XHRcdC55IChkKT0+IEBEViBkLmR2XG5cdFx0XHQueCAoZCk9PiBAViBkLnZcblxuXHRcdGFuZ3VsYXIuZWxlbWVudCBAd2luZG93XG5cdFx0XHQub24gJ3Jlc2l6ZScsIEByZXNpemVcblxuXHRAcHJvcGVydHkgJ3N2Z19oZWlnaHQnLCBnZXQ6IC0+IEBoZWlnaHQgKyBAbWFyLnRvcCArIEBtYXIuYm90dG9tXG5cblx0QHByb3BlcnR5ICdkb3RzJywgZ2V0Oi0+XG5cdFx0RGF0YS5kb3RzXG5cdFx0XHQuZmlsdGVyIChkKS0+IGQuaWQgIT0nZmlyc3QnXG5cblx0aGlsaXRlOiAodiktPlxuXHRcdGQzLnNlbGVjdCB0aGlzXG5cdFx0XHQudHJhbnNpdGlvbigpXG5cdFx0XHQuZHVyYXRpb24gMTAwXG5cdFx0XHQuZWFzZSAnY3ViaWMnXG5cdFx0XHQuYXR0ciAncicgLCBpZiB2IHRoZW4gNiBlbHNlIDRcblxuXHRyZXNpemU6ICgpPT5cblx0XHRAd2lkdGggPSBAZWxbMF0uY2xpZW50V2lkdGggLSBAbWFyLmxlZnQgLSBAbWFyLnJpZ2h0XG5cdFx0QGhlaWdodCA9IEB3aWR0aCAqIC43XG5cdFx0QERWLnJhbmdlIFtAaGVpZ2h0LCAwXVxuXHRcdEBWLnJhbmdlIFswLCBAd2lkdGhdIFxuXHRcdEBzY29wZS4kZXZhbEFzeW5jKClcblxuXG5kZXIgPSAoKS0+XG5cdGRpcmVjdGl2ZSA9IFxuXHRcdGNvbnRyb2xsZXJBczogJ3ZtJ1xuXHRcdHNjb3BlOiB7fVxuXHRcdHRlbXBsYXRlOiB0ZW1wbGF0ZVxuXHRcdHRlbXBsYXRlTmFtZXNwYWNlOiAnc3ZnJ1xuXHRcdGNvbnRyb2xsZXI6IFsnJHNjb3BlJywnJGVsZW1lbnQnLCckd2luZG93JywgQ3RybF1cblxubW9kdWxlLmV4cG9ydHMgPSBkZXJcbiIsIl8gPSByZXF1aXJlICdsb2Rhc2gnXG57ZXhwLCBzcXJ0LCBhdGFuLCBtaW4sIG1heH0gPSBNYXRoXG5cbmNsYXNzIERvdFxuXHRjb25zdHJ1Y3RvcjogKEB0LCBAdiktPlxuXHRcdEBpZCA9IF8udW5pcXVlSWQgJ2RvdCdcblx0XHRAaGlsaXRlZCA9IGZhbHNlXG5cbmNsYXNzIFNlcnZpY2Vcblx0Y29uc3RydWN0b3I6ICgpLT5cblx0XHRmaXJzdERvdCA9IG5ldyBEb3QgMCAsIDRcblx0XHRmaXJzdERvdC5pZCA9ICdmaXJzdCdcblx0XHRAZG90cyA9IFsgZmlyc3REb3QsIFxuXHRcdFx0bmV3IERvdCAuMywgNCpleHAoLS4zKVxuXHRcdCBdXG5cdFx0QGNvcnJlY3QgPSBmYWxzZVxuXG5cdFx0QGZpcnN0ID0gZmlyc3REb3RcblxuXHRcdEBzZWxlY3RlZCA9IGZpcnN0RG90XG5cdFx0QHNob3cgPSBmYWxzZVxuXHRcdEB0YXJnZXRfZGF0YSA9IF8ucmFuZ2UgMCwgOCwgMS81MFxuXHRcdFx0Lm1hcCAodCktPiBcblx0XHRcdFx0cmVzICA9IFxuXHRcdFx0XHRcdHQ6IHRcblx0XHRcdFx0XHR2OiA0KiBleHAoLXQpXG5cdFx0XHRcdFx0ZHY6IC00ICogZXhwKC10KVxuXHRcdEB1cGRhdGVfZG90cygpXG5cblx0YWRkX2RvdDogKHQsIHYpLT5cblx0XHRAc2VsZWN0ZWQgPSBuZXcgRG90IHQsdlxuXHRcdEBkb3RzLnB1c2ggQHNlbGVjdGVkXG5cdFx0QHVwZGF0ZV9kb3QoQHNlbGVjdGVkLCB0LCB2KVxuXG5cdHJlbW92ZV9kb3Q6IChkb3QpLT5cblx0XHRAZG90cy5zcGxpY2UgQGRvdHMuaW5kZXhPZihkb3QpLCAxXG5cblx0dXBkYXRlX2RvdHM6IC0+IFxuXHRcdEBkb3RzLnNvcnQgKGEsYiktPiBhLnQgLSBiLnRcblx0XHRAZG90cy5mb3JFYWNoIChkb3QsIGksIGspLT5cblx0XHRcdHByZXYgPSBrW2ktMV1cblx0XHRcdGRvdC5kdiA9IGlmIHByZXYgdGhlbiAoZG90LnYgLSBwcmV2LnYpL21heChkb3QudCAtIHByZXYudCwgLjAxKSBlbHNlIDBcblxuXHR1cGRhdGVfZG90OiAoZG90LCB0LCB2KS0+XG5cdFx0aWYgZG90LmlkID09ICdmaXJzdCdcblx0XHRcdHJldHVyblxuXHRcdEBzZWxlY3RlZCA9IGRvdFxuXHRcdGRvdC50ID0gdFxuXHRcdGRvdC52ID0gdlxuXHRcdEB1cGRhdGVfZG90cygpXG5cdFx0QGNvcnJlY3QgPSBNYXRoLmFicyhAc2VsZWN0ZWQudiArIEBzZWxlY3RlZC5kdikgPCAwLjFcblxuc2VydmljZSA9IG5ldyBTZXJ2aWNlXG5cbm1vZHVsZS5leHBvcnRzID0gc2VydmljZSIsImFuZ3VsYXIgPSByZXF1aXJlICdhbmd1bGFyJ1xuZDMgPSByZXF1aXJlICdkMydcbnJlcXVpcmUgJy4uLy4uL2hlbHBlcnMnXG5tYXRoID0gcmVxdWlyZSAnbWF0aGpzJ1xuXyA9IHJlcXVpcmUgJ2xvZGFzaCdcbnRlbXBsYXRlID0gJycnXG5cdDxzdmcgbmctaW5pdD0ndm0ucmVzaXplKCknIHdpZHRoPScxMDAlJyBuZy1hdHRyLWhlaWdodD0ne3t2bS5zdmdfaGVpZ2h0fX0nPlxuXHRcdDxkZWZzPlxuXHRcdFx0PGNsaXBwYXRoIGlkPSdyZWcnPlxuXHRcdFx0XHQ8cmVjdCBuZy1hdHRyLXdpZHRoPSd7e3ZtLndpZHRofX0nIG5nLWF0dHItaGVpZ2h0PSd7e3ZtLmhlaWdodH19Jz48L3JlY3Q+XG5cdFx0XHQ8L2NsaXBwYXRoPlxuXHRcdDwvZGVmcz5cblx0XHQ8ZyBjbGFzcz0nYm9pbGVycGxhdGUnIHNoaWZ0ZXI9J1t2bS5tYXIubGVmdCwgdm0ubWFyLnRvcF0nPlxuXHRcdFx0PHJlY3QgY2xhc3M9J2JhY2tncm91bmQnIG5nLWF0dHItd2lkdGg9J3t7dm0ud2lkdGh9fScgbmctYXR0ci1oZWlnaHQ9J3t7dm0uaGVpZ2h0fX0nIG5nLW1vdXNlbW92ZT0ndm0ubW92ZSgkZXZlbnQpJyAvPlxuXHRcdFx0PGcgdmVyLWF4aXMtZGVyIHdpZHRoPSd2bS53aWR0aCcgc2NhbGU9J3ZtLlYnIGZ1bj0ndm0udmVyQXhGdW4nPjwvZz5cblx0XHRcdDxnIGhvci1heGlzLWRlciBoZWlnaHQ9J3ZtLmhlaWdodCcgc2NhbGU9J3ZtLlQnIGZ1bj0ndm0uaG9yQXhGdW4nIHNoaWZ0ZXI9J1swLHZtLmhlaWdodF0nPjwvZz5cblx0XHRcdDxmb3JlaWduT2JqZWN0IHdpZHRoPSczMCcgaGVpZ2h0PSczMCcgeT0nMTcnIHNoaWZ0ZXI9J1t2bS53aWR0aC8yLCB2bS5oZWlnaHRdJz5cblx0XHRcdFx0PHRleHQgY2xhc3M9J2xhYmVsJyA+JHQkPC90ZXh0PlxuXHRcdFx0PC9mb3JlaWduT2JqZWN0PlxuXHRcdDwvZz5cblx0XHQ8ZyBjbGFzcz0nbWFpbicgY2xpcC1wYXRoPVwidXJsKCNyZWcpXCIgc2hpZnRlcj0nW3ZtLm1hci5sZWZ0LCB2bS5tYXIudG9wXSc+XG5cdFx0XHQ8bGluZSBjbGFzcz0nemVyby1saW5lJyBuZy1jbGFzcz0ne1wiY29ycmVjdFwiOiB2bS5jb3JyZWN0fScgeDE9JzAnIG5nLWF0dHIteDI9J3t7dm0ud2lkdGh9fScgbmctYXR0ci15MT0ne3t2bS5WKDApfX0nIG5nLWF0dHIteTI9J3t7dm0uVigwKX19JyAvPlxuXHRcdFx0PGxpbmUgY2xhc3M9J3RyaSB2JyBuZy1hdHRyLXgxPSd7e3ZtLlQodm0ucG9pbnQudCl9fScgbmctYXR0ci14Mj0ne3t2bS5UKHZtLnBvaW50LnQpfX0nIG5nLWF0dHIteTE9J3t7dm0uVigwKX19JyBuZy1hdHRyLXkyPSd7e3ZtLlYodm0ucG9pbnQudil9fScgLz5cblxuXHRcdFx0PHBhdGggbmctYXR0ci1kPSd7e3ZtLmxpbmVGdW4odm0uZGF0YSl9fScgY2xhc3M9J2Z1biB2JyAvPlxuXHRcdFx0PGNpcmNsZSByPSczcHgnIHNoaWZ0ZXI9J1t2bS5UKHZtLnBvaW50LnQpLCB2bS5WKHZtLnBvaW50LnYpXScgY2xhc3M9J3BvaW50Jy8+XG5cdFx0PC9nPlxuXHQ8L3N2Zz5cbicnJ1xuXG5jbGFzcyByZWdDdHJsXG5cdGNvbnN0cnVjdG9yOiAoQHNjb3BlLCBAZWwsIEB3aW5kb3cpLT5cblx0XHRAbWFyID0gXG5cdFx0XHRsZWZ0OiAzMFxuXHRcdFx0dG9wOiAyMFxuXHRcdFx0cmlnaHQ6IDIwXG5cdFx0XHRib3R0b206IDM1XG5cblx0XHRAViA9IGQzLnNjYWxlLmxpbmVhcigpLmRvbWFpbiBbLTEsMV1cblx0XHRAVCA9IGQzLnNjYWxlLmxpbmVhcigpLmRvbWFpbiBbMCwzXVxuXG5cdFx0QGhvckF4RnVuID0gZDMuc3ZnLmF4aXMoKVxuXHRcdFx0LnNjYWxlIEBUXG5cdFx0XHQudGlja1ZhbHVlcyBbMCwxLDIsM11cblx0XHRcdC5vcmllbnQgJ2JvdHRvbSdcblxuXHRcdEB2ZXJBeEZ1biA9IGQzLnN2Zy5heGlzKClcblx0XHRcdC5zY2FsZSBAVlxuXHRcdFx0LnRpY2tzIDVcblx0XHRcdC5vcmllbnQgJ2xlZnQnXG5cdFx0XG5cdFx0QGxpbmVGdW4gPSBkMy5zdmcubGluZSgpXG5cdFx0XHQueSAoZCk9PiBAViBkLnZcblx0XHRcdC54IChkKT0+IEBUIGQudFxuXG5cdFx0cGFyc2VyID0gbWF0aC5wYXJzZXIoKVxuXHRcdHBhcnNlci5ldmFsICd2KHQpID0gNSogKHQtLjUpICogKHQtMSkgKiAodC0yKV4yJ1xuXHRcdHZGdW4gPSBwYXJzZXIuZ2V0ICd2J1xuXG5cdFx0QGRhdGEgPSBfLnJhbmdlIDAgLCAzICwgMS81MFxuXHRcdFx0Lm1hcCAodCktPlxuXHRcdFx0XHRyZXMgPSBcblx0XHRcdFx0XHR2OiB2RnVuKHQpXG5cdFx0XHRcdFx0dDogdFxuXG5cdFx0QHBvaW50ID0gXy5zYW1wbGUgQGRhdGFcblxuXHRcdEBjb3JyZWN0ID0gZmFsc2VcblxuXHRcdGFuZ3VsYXIuZWxlbWVudCBAd2luZG93XG5cdFx0XHQub24gJ3Jlc2l6ZScsIEByZXNpemVcblxuXHRcdEBtb3ZlID0gKGV2ZW50KSA9PlxuXHRcdFx0cmVjdCA9IGV2ZW50LnRhcmdldC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKVxuXHRcdFx0dCA9IEBULmludmVydCBldmVudC54IC0gcmVjdC5sZWZ0XG5cdFx0XHR2ID0gdkZ1biB0XG5cdFx0XHRAcG9pbnQgPSBcblx0XHRcdFx0dDogdFxuXHRcdFx0XHR2OiB2XG5cdFx0XHRAY29ycmVjdCA9IE1hdGguYWJzKEBwb2ludC52KSA8PSAwLjA1IFxuXHRcdFx0QHNjb3BlLiRldmFsQXN5bmMoKVxuXG5cdEBwcm9wZXJ0eSAnc3ZnX2hlaWdodCcsIGdldDogLT4gQGhlaWdodCArIEBtYXIudG9wICsgQG1hci5ib3R0b21cblxuXHRyZXNpemU6ICgpPT5cblx0XHRAd2lkdGggPSBAZWxbMF0uY2xpZW50V2lkdGggLSBAbWFyLmxlZnQgLSBAbWFyLnJpZ2h0XG5cdFx0QGhlaWdodCA9IEBlbFswXS5wYXJlbnRFbGVtZW50LmNsaWVudEhlaWdodCAtIEBtYXIubGVmdCAtIEBtYXIucmlnaHRcblx0XHRAVi5yYW5nZSBbQGhlaWdodCwgMF1cblx0XHRAVC5yYW5nZSBbMCwgQHdpZHRoXVxuXHRcdEBzY29wZS4kZXZhbEFzeW5jKClcblxuZGVyID0gKCktPlxuXHRkaXJlY3RpdmUgPSBcblx0XHRjb250cm9sbGVyQXM6ICd2bSdcblx0XHRzY29wZToge31cblx0XHR0ZW1wbGF0ZTogdGVtcGxhdGVcblx0XHR0ZW1wbGF0ZU5hbWVzcGFjZTogJ3N2Zydcblx0XHRjb250cm9sbGVyOiBbJyRzY29wZScsJyRlbGVtZW50JywgJyR3aW5kb3cnLCByZWdDdHJsXVxuXG5tb2R1bGUuZXhwb3J0cyA9IGRlclxuIiwiZHJhZyA9ICgkcGFyc2UpLT5cblx0ZGlyZWN0aXZlID0gXG5cdFx0bGluazogKHNjb3BlLGVsLGF0dHIpLT5cblx0XHRcdHNlbCA9IGQzLnNlbGVjdChlbFswXSlcblx0XHRcdHNlbC5jYWxsKCRwYXJzZShhdHRyLmJlaGF2aW9yKShzY29wZSkpXG5cbm1vZHVsZS5leHBvcnRzID0gZHJhZyIsImQzID0gcmVxdWlyZSAnZDMnXG5hbmd1bGFyID0gcmVxdWlyZSAnYW5ndWxhcidcblxuZGVyID0gKCRwYXJzZSktPiAjZ29lcyBvbiBhIHN2ZyBlbGVtZW50XG5cdGRpcmVjdGl2ZSA9IFxuXHRcdHJlc3RyaWN0OiAnQSdcblx0XHRsaW5rOiAoc2NvcGUsIGVsLCBhdHRyKS0+XG5cdFx0XHRzZWwgPSBkMy5zZWxlY3QgZWxbMF1cblx0XHRcdHNjb3BlLiR3YXRjaCAtPlxuXHRcdFx0XHRcdCRwYXJzZShhdHRyLmQzRGVyKShzY29wZSlcblx0XHRcdFx0LCAodiktPlxuXHRcdFx0XHRcdHNlbC5hdHRyIHZcblx0XHRcdFx0LCB0cnVlXG5cbm1vZHVsZS5leHBvcnRzID0gZGVyIiwibW9kdWxlLmV4cG9ydHMgPSAoJHBhcnNlKS0+XG5cdChzY29wZSwgZWwsIGF0dHIpLT5cblx0XHRkMy5zZWxlY3QoZWxbMF0pLmRhdHVtICRwYXJzZShhdHRyLmRhdHVtKShzY29wZSkiLCJcbnRlbXBsYXRlID0gJycnXG5cdDxjaXJjbGUgY2xhc3M9J2RvdCBsYXJnZSc+PC9jaXJjbGU+XG5cdDxjaXJjbGUgY2xhc3M9J2RvdCBzbWFsbCcgcj0nNCc+PC9jaXJjbGU+XG4nJydcblxuZGVyID0gKCktPlxuXHRkaXJlY3RpdmUgPSBcblx0XHR0ZW1wbGF0ZTogdGVtcGxhdGVcblx0XHRyZXN0cmljdDogJ0EnXG5cdFx0bGluazogKHNjb3BlLGVsLGF0dHIpLT5cblx0XHRcdHJhZCA9IDEwICN0aGUgcmFkaXVzIG9mIHRoZSBsYXJnZSBjaXJjbGUgbmF0dXJhbGx5XG5cdFx0XHRzZWwgPSBkMy5zZWxlY3QgZWxbMF1cblx0XHRcdGJpZyA9IHNlbC5zZWxlY3QgJ2NpcmNsZS5kb3QubGFyZ2UnXG5cdFx0XHRcdC5hdHRyICdyJywgcmFkXG5cdFx0XHRjaXJjID0gc2VsLnNlbGVjdCAnY2lyY2xlLmRvdC5zbWFsbCdcblxuXHRcdFx0bW91c2VvdmVyID0gKCktPlxuXHRcdFx0XHRzY29wZS5kb3QuaGlsaXRlZCA9IHRydWVcblx0XHRcdFx0c2NvcGUudm0uRGF0YS5zZWxlY3RlZCA9IHNjb3BlLmRvdFxuXHRcdFx0XHRzY29wZS52bS5EYXRhLnNob3cgPSB0cnVlXG5cdFx0XHRcdHNjb3BlLiRldmFsQXN5bmMoKVxuXHRcdFx0XHRiaWcudHJhbnNpdGlvbiAnZ3Jvdydcblx0XHRcdFx0XHQuZHVyYXRpb24gMTUwXG5cdFx0XHRcdFx0LmVhc2UgJ2N1YmljLW91dCdcblx0XHRcdFx0XHQuYXR0ciAncicgLCByYWQgKiAxLjVcblx0XHRcdFx0XHQudHJhbnNpdGlvbigpXG5cdFx0XHRcdFx0LmR1cmF0aW9uIDE1MFxuXHRcdFx0XHRcdC5lYXNlICdjdWJpYy1pbidcblx0XHRcdFx0XHQuYXR0ciAncicgLCByYWQgKiAxLjNcblx0XHRcdFx0XHRcblx0XHRcdGJpZy5vbiAnbW91c2VvdmVyJywgbW91c2VvdmVyXG5cdFx0XHRcdC5vbiAnY29udGV4dG1lbnUnLCAtPiBldmVudC5wcmV2ZW50RGVmYXVsdCgpXG5cdFx0XHRcdC5vbiAnbW91c2Vkb3duJywgLT5cblx0XHRcdFx0XHRiaWcudHJhbnNpdGlvbiAnZ3Jvdydcblx0XHRcdFx0XHRcdC5kdXJhdGlvbiAxNTBcblx0XHRcdFx0XHRcdC5lYXNlICdjdWJpYydcblx0XHRcdFx0XHRcdC5hdHRyICdyJywgcmFkKjEuN1xuXHRcdFx0XHQub24gJ21vdXNldXAnLCAoKS0+XG5cdFx0XHRcdFx0YmlnLnRyYW5zaXRpb24gJ2dyb3cnXG5cdFx0XHRcdFx0XHQuZHVyYXRpb24gMTUwXG5cdFx0XHRcdFx0XHQuZWFzZSAnY3ViaWMtaW4nXG5cdFx0XHRcdFx0XHQuYXR0ciAncicsIHJhZCoxLjNcblx0XHRcdFx0Lm9uICdtb3VzZW91dCcgLCAoKS0+XG5cdFx0XHRcdFx0c2NvcGUuZG90LmhpbGl0ZWQgPSBmYWxzZVxuXHRcdFx0XHRcdHNjb3BlLnZtLkRhdGEuc2hvdyA9IGZhbHNlXG5cdFx0XHRcdFx0c2NvcGUuJGV2YWxBc3luYygpXG5cdFx0XHRcdFx0YmlnLnRyYW5zaXRpb24gJ3Nocmluaydcblx0XHRcdFx0XHRcdC5kdXJhdGlvbiAzNTBcblx0XHRcdFx0XHRcdC5lYXNlICdib3VuY2Utb3V0J1xuXHRcdFx0XHRcdFx0LmF0dHIgJ3InICwgcmFkXG5cblx0XHRcdHNjb3BlLiR3YXRjaCAnZG90LmhpbGl0ZWQnICwgKHYpLT5cblx0XHRcdFx0aWYgdlxuXHRcdFx0XHRcdGNpcmMudHJhbnNpdGlvbigpXG5cdFx0XHRcdFx0XHQuZHVyYXRpb24gMTUwXG5cdFx0XHRcdFx0XHQuZWFzZSAnY3ViaWMtb3V0J1xuXHRcdFx0XHRcdFx0LnN0eWxlXG5cdFx0XHRcdFx0XHRcdCdzdHJva2Utd2lkdGgnOiAyLjVcblx0XHRcdFx0XHRcdFx0c3Ryb2tlOiAnIzIyMidcblx0XHRcdFx0ZWxzZSBcblx0XHRcdFx0XHRjaXJjLnRyYW5zaXRpb24oKVxuXHRcdFx0XHRcdFx0LmR1cmF0aW9uIDEwMFxuXHRcdFx0XHRcdFx0LmVhc2UgJ2N1YmljJ1xuXHRcdFx0XHRcdFx0LnN0eWxlXG5cdFx0XHRcdFx0XHRcdCdzdHJva2Utd2lkdGgnOiAxLjZcblx0XHRcdFx0XHRcdFx0c3Ryb2tlOiAnd2hpdGUnXG5cblxubW9kdWxlLmV4cG9ydHMgPSBkZXJcbiIsInRlbXBsYXRlID0gJycnXG5cdDxjaXJjbGUgY2xhc3M9J2RvdCBzbWFsbCcgcj0nNCc+PC9jaXJjbGU+XG4nJydcblxuZGVyID0gKCktPlxuXHRkaXJlY3RpdmUgPSBcblx0XHR0ZW1wbGF0ZTogdGVtcGxhdGVcblx0XHRyZXN0cmljdDogJ0EnXG5cdFx0bGluazogKHNjb3BlLGVsLGF0dHIpLT5cblx0XHRcdHNlbCA9IGQzLnNlbGVjdCBlbFswXVxuXHRcdFx0Y2lyYyA9IHNlbC5zZWxlY3QgJ2NpcmNsZS5kb3Quc21hbGwnXG5cblx0XHRcdHNjb3BlLiR3YXRjaCAnZG90LmhpbGl0ZWQnICwgKHYpLT5cblx0XHRcdFx0aWYgdlxuXHRcdFx0XHRcdGNpcmMudHJhbnNpdGlvbigpXG5cdFx0XHRcdFx0XHQuZHVyYXRpb24gMTUwXG5cdFx0XHRcdFx0XHQuZWFzZSAnY3ViaWMtb3V0J1xuXHRcdFx0XHRcdFx0LnN0eWxlXG5cdFx0XHRcdFx0XHRcdCdzdHJva2Utd2lkdGgnOiAyLjVcblx0XHRcdFx0XHRcdFx0c3Ryb2tlOiAnIzIyMidcblx0XHRcdFx0ZWxzZSBcblx0XHRcdFx0XHRjaXJjLnRyYW5zaXRpb24oKVxuXHRcdFx0XHRcdFx0LmR1cmF0aW9uIDEwMFxuXHRcdFx0XHRcdFx0LmVhc2UgJ2N1YmljJ1xuXHRcdFx0XHRcdFx0LnN0eWxlXG5cdFx0XHRcdFx0XHRcdCdzdHJva2Utd2lkdGgnOiAxLjZcblx0XHRcdFx0XHRcdFx0c3Ryb2tlOiAnd2hpdGUnXG5cbm1vZHVsZS5leHBvcnRzID0gZGVyXG4iLCJkMyA9IHJlcXVpcmUgJ2QzJ1xuXG5kZXIgPSAoJHBhcnNlKS0+XG5cdGRpcmVjdGl2ZSA9XG5cdFx0bGluazogKHNjb3BlLCBlbCwgYXR0ciktPlxuXHRcdFx0cmVzaGlmdCA9ICh2KS0+IFxuXHRcdFx0XHRkMy5zZWxlY3QgZWxbMF1cblx0XHRcdFx0XHQuYXR0ciAndHJhbnNmb3JtJyAsIFwidHJhbnNsYXRlKCN7dlswXX0sI3t2WzFdfSlcIlxuXG5cdFx0XHRzY29wZS4kd2F0Y2ggKCktPlxuXHRcdFx0XHRcdCRwYXJzZShhdHRyLnNoaWZ0ZXIpKHNjb3BlKVxuXHRcdFx0XHQsIHJlc2hpZnRcblx0XHRcdFx0LCB0cnVlXG5cbm1vZHVsZS5leHBvcnRzID0gZGVyIiwiZDMgPSByZXF1aXJlICdkMydcbmFuZ3VsYXIgPSByZXF1aXJlICdhbmd1bGFyJ1xuXG5kZXIgPSAoJHdpbmRvdyktPlxuXHRkaXJlY3RpdmUgPSBcblx0XHRjb250cm9sbGVyOiBhbmd1bGFyLm5vb3Bcblx0XHRjb250cm9sbGVyQXM6ICd2bSdcblx0XHRiaW5kVG9Db250cm9sbGVyOiB0cnVlXG5cdFx0cmVzdHJpY3Q6ICdBJ1xuXHRcdHRlbXBsYXRlTmFtZXNwYWNlOiAnc3ZnJ1xuXHRcdHNjb3BlOiBcblx0XHRcdHNjYWxlOiAnPSdcblx0XHRcdGhlaWdodDogJz0nXG5cdFx0XHRmdW46ICc9J1xuXHRcdGxpbms6IChzY29wZSwgZWwsIGF0dHIsIHZtKS0+XG5cdFx0XHR4QXhpc0Z1biA9IHZtLmZ1biA/IChkMy5zdmcuYXhpcygpXG5cdFx0XHRcdFx0XHRcdC5zY2FsZSB2bS5zY2FsZVxuXHRcdFx0XHRcdFx0XHQub3JpZW50ICdib3R0b20nKVxuXG5cdFx0XHRzZWwgPSBkMy5zZWxlY3QgZWxbMF1cblx0XHRcdFx0LmNsYXNzZWQgJ3ggYXhpcycsIHRydWVcblxuXHRcdFx0dXBkYXRlID0gKCk9PlxuXHRcdFx0XHR4QXhpc0Z1bi50aWNrU2l6ZSAtdm0uaGVpZ2h0XG5cdFx0XHRcdHNlbC5jYWxsIHhBeGlzRnVuXG5cdFx0XHRcdFxuXHRcdFx0dXBkYXRlKClcblx0XHRcdFx0XG5cdFx0XHRzY29wZS4kd2F0Y2ggJ3ZtLnNjYWxlLmRvbWFpbigpJywgdXBkYXRlICwgdHJ1ZVxuXHRcdFx0c2NvcGUuJHdhdGNoICd2bS5zY2FsZS5yYW5nZSgpJywgdXBkYXRlICwgdHJ1ZVxuXHRcdFx0c2NvcGUuJHdhdGNoICd2bS5oZWlnaHQnLCB1cGRhdGUgLCB0cnVlXG5cbm1vZHVsZS5leHBvcnRzID0gZGVyIiwiZDMgPSByZXF1aXJlICdkMydcbmFuZ3VsYXIgPSByZXF1aXJlICdhbmd1bGFyJ1xuXG5kZXIgPSAoJHdpbmRvdyktPlxuXHRkaXJlY3RpdmUgPSBcblx0XHRjb250cm9sbGVyOiBhbmd1bGFyLm5vb3Bcblx0XHRjb250cm9sbGVyQXM6ICd2bSdcblx0XHRiaW5kVG9Db250cm9sbGVyOiB0cnVlXG5cdFx0cmVzdHJpY3Q6ICdBJ1xuXHRcdHRlbXBsYXRlTmFtZXNwYWNlOiAnc3ZnJ1xuXHRcdHNjb3BlOiBcblx0XHRcdHNjYWxlOiAnPSdcblx0XHRcdHdpZHRoOiAnPSdcblx0XHRcdGZ1bjogJz0nXG5cdFx0bGluazogKHNjb3BlLCBlbCwgYXR0ciwgdm0pLT5cblx0XHRcdHlBeGlzRnVuID0gdm0uZnVuID8gZDMuc3ZnLmF4aXMoKVxuXHRcdFx0XHQuc2NhbGUgdm0uc2NhbGVcblx0XHRcdFx0Lm9yaWVudCAnbGVmdCdcblxuXHRcdFx0c2VsID0gZDMuc2VsZWN0KGVsWzBdKS5jbGFzc2VkKCd5IGF4aXMnLCB0cnVlKVxuXG5cdFx0XHR1cGRhdGUgPSAoKT0+XG5cdFx0XHRcdHlBeGlzRnVuLnRpY2tTaXplKCAtdm0ud2lkdGgpXG5cdFx0XHRcdHNlbC5jYWxsKHlBeGlzRnVuKVxuXG5cdFx0XHR1cGRhdGUoKVxuXHRcdFx0XHRcblx0XHRcdHNjb3BlLiR3YXRjaCAndm0uc2NhbGUuZG9tYWluKCknLCB1cGRhdGUgLCB0cnVlXG5cdFx0XHRzY29wZS4kd2F0Y2ggJ3ZtLnNjYWxlLnJhbmdlKCknLCB1cGRhdGUgLCB0cnVlXG5cdFx0XHQjIHNjb3BlLiR3YXRjaCAndm0ud2lkdGgnLCB1cGRhdGVcblxubW9kdWxlLmV4cG9ydHMgPSBkZXIiLCIndXNlIHN0cmljdCdcblxubW9kdWxlLmV4cG9ydHMudGltZW91dCA9IChmdW4sIHRpbWUpLT5cblx0XHRkMy50aW1lcigoKT0+XG5cdFx0XHRmdW4oKVxuXHRcdFx0dHJ1ZVxuXHRcdCx0aW1lKVxuXG5cbkZ1bmN0aW9uOjpwcm9wZXJ0eSA9IChwcm9wLCBkZXNjKSAtPlxuICBPYmplY3QuZGVmaW5lUHJvcGVydHkgQHByb3RvdHlwZSwgcHJvcCwgZGVzYyJdfQ==
