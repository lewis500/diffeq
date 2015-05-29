(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';
var angular, app, d3, looper;

angular = require('angular');

d3 = require('d3');

app = angular.module('mainApp', [require('angular-material')]).directive('horAxisDer', require('./directives/xAxis')).directive('verAxisDer', require('./directives/yAxis')).directive('cartSimDer', require('./components/cart/cartSim')).directive('cartButtonsDer', require('./components/cart/cartButtons')).directive('shifter', require('./directives/shifter')).directive('designADer', require('./components/design/designA')).directive('behavior', require('./directives/behavior')).directive('dotDer', require('./directives/dot')).directive('datum', require('./directives/datum')).directive('d3Der', require('./directives/d3Der')).directive('designBDer', require('./components/design/designB')).directive('regularDer', require('./components/regular/regular')).directive('derivativeDer', require('./components/derivative/derivative')).directive('derivativeBDer', require('./components/derivative/derivativeB')).directive('dotBDer', require('./directives/dotB')).directive('cartPlotDer', require('./components/cart/cartPlot')).directive('designCartADer', require('./components/design/designCartA')).directive('designCartBDer', require('./components/design/designCartB'));

looper = function() {
  return setTimeout(function() {
    d3.selectAll('circle.dot.large').transition('grow').duration(500).ease('cubic-out').attr('transform', 'scale( 1.34)').transition('shrink').duration(500).ease('cubic-out').attr('transform', 'scale( 1.0)');
    return looper();
  }, 1000);
};

looper();



},{"./components/cart/cartButtons":2,"./components/cart/cartPlot":4,"./components/cart/cartSim":5,"./components/derivative/derivative":6,"./components/derivative/derivativeB":7,"./components/design/designA":9,"./components/design/designB":10,"./components/design/designCartA":11,"./components/design/designCartB":12,"./components/regular/regular":14,"./directives/behavior":15,"./directives/d3Der":16,"./directives/datum":17,"./directives/dot":18,"./directives/dotB":19,"./directives/shifter":20,"./directives/xAxis":21,"./directives/yAxis":22,"angular":undefined,"angular-material":undefined,"d3":undefined}],2:[function(require,module,exports){
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
    this.dv = -this.v;
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

template = '<svg ng-init=\'vm.resize()\' width=\'100%\' ng-attr-height=\'{{vm.svg_height}}\'>\n	<defs>\n		<clippath id=\'sol\'>\n			<rect ng-attr-width=\'{{vm.width}}\' ng-attr-height=\'{{vm.height}}\'></rect>\n		</clippath>\n	</defs>\n	<g class=\'boilerplate\' shifter=\'[vm.mar.left, vm.mar.top]\'>\n		<rect class=\'background\' ng-attr-width=\'{{vm.width}}\' ng-attr-height=\'{{vm.height}}\' ng-mousemove=\'vm.move($event)\' />\n		<g ver-axis-der width=\'vm.width\' scale=\'vm.V\' fun=\'vm.verAxFun\'></g>\n		<g hor-axis-der height=\'vm.height\' scale=\'vm.T\' fun=\'vm.horAxFun\' shifter=\'[0,vm.height]\'></g>\n		<foreignObject width=\'30\' height=\'30\' y=\'17\' shifter=\'[vm.width/2, vm.height]\'>\n			<text class=\'label\' >$t$</text>\n		</foreignObject>\n		<foreignObject width=\'30\' height=\'30\' shifter=\'[-31, vm.height/2-8]\'>\n				<text class=\'label\' >$v$</text>\n		</foreignObject>\n		<line class=\'zero-line\' d3-der="{x1: 0 , x2: vm.width, y1: vm.V(0), y2: vm.V(0)}" /> \n		<line class=\'zero-line\' d3-der="{x1: vm.T(0) , x2: vm.T(0), y1: 0, y2: vm.height}" /> \n	</g>\n	<g class=\'main\' clip-path="url(#sol)" shifter=\'[vm.mar.left, vm.mar.top]\'>\n		<foreignObject width=\'30\' height=\'30\' shifter=\'[(vm.T(vm.point.t) - 16), vm.sthing]\' style=\'font-size: 13px; font-weight: 100;\'>\n				<text class=\'label\' font-size=\'13px\'>$v$</text>\n		</foreignObject>\n		<line class=\'tri v\' d3-der=\'{x1: vm.T(vm.point.t)-1, x2: vm.T(vm.point.t)-1, y1: vm.V(0), y2: vm.V(vm.point.v)}\'/>\n		<path ng-attr-d=\'{{vm.lineFun(vm.data)}}\' class=\'fun v\' />\n		<circle r=\'3px\' shifter=\'[vm.T(vm.point.t), vm.V(vm.point.v)]\' class=\'point v\'/>\n	</g>\n</svg>';

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
    this.point = Cart;
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

  Ctrl.property('sthing', {
    get: function() {
      return this.V(this.point.v / 2) - 7;
    }
  });

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



},{"../../helpers":23,"./cartData":3,"angular":undefined,"d3":undefined,"lodash":undefined}],5:[function(require,module,exports){
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



},{"../../helpers":23,"./cartData":3,"d3":undefined,"lodash":undefined}],6:[function(require,module,exports){
var Ctrl, Data, _, angular, d3, der, template,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

angular = require('angular');

d3 = require('d3');

require('../../helpers');

_ = require('lodash');

Data = require('./derivativeData');

template = '<svg ng-init=\'vm.resize()\' width=\'100%\' ng-attr-height=\'{{vm.svg_height}}\'>\n	<defs>\n		<clippath id=\'derClip\'>\n			<rect ng-attr-width=\'{{vm.width}}\' ng-attr-height=\'{{vm.height}}\'></rect>\n		</clippath>\n	</defs>\n	<g class=\'boilerplate\' shifter=\'[vm.mar.left, vm.mar.top]\'>\n		<rect class=\'background\' ng-attr-width=\'{{vm.width}}\' ng-attr-height=\'{{vm.height}}\' ng-mousemove=\'vm.move($event)\' />\n		<g ver-axis-der width=\'vm.width\' scale=\'vm.V\' fun=\'vm.verAxFun\'></g>\n		<g hor-axis-der height=\'vm.height\' scale=\'vm.T\' fun=\'vm.horAxFun\' shifter=\'[0,vm.height]\'></g>\n		<foreignObject width=\'30\' height=\'30\' y=\'17\' shifter=\'[vm.width/2, vm.height]\'>\n				<text class=\'label\' >$t$</text>\n		</foreignObject>\n	</g>\n	<g class=\'main\' clip-path="url(#derClip)" shifter=\'[vm.mar.left, vm.mar.top]\'>\n		<line class=\'zero-line hor\' d3-der=\'{x1: 0, x2: vm.width, y1: vm.V(0), y2: vm.V(0)}\'/>\n		<path ng-attr-d=\'{{vm.lineFun(vm.data)}}\' class=\'fun v\' />\n		<path ng-attr-d=\'{{vm.triangleData()}}\' class=\'tri\' />\n		<line class=\'tri dv\' d3-der=\'{x1: vm.T(vm.point.t)-1, x2: vm.T(vm.point.t)-1, y1: vm.V(vm.point.v), y2: vm.V((vm.point.v + vm.point.dv))}\'/>\n		<foreignObject width=\'30\' height=\'30\' shifter=\'[(vm.T(vm.point.t) - 16), vm.sthing]\' style=\'font-size: 13px; font-weight: 100;\'>\n				<text class=\'label\' font-size=\'13px\'>$\\dot{y}$</text>\n		</foreignObject>\n		<circle r=\'3px\'  shifter=\'[vm.T(vm.point.t), vm.V(vm.point.v)]\' class=\'point v\'/>\n	</g>\n</svg>';

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
      bottom: 35
    };
    this.V = d3.scale.linear().domain([-1.5, 1.5]);
    this.T = d3.scale.linear().domain([0, 6]);
    this.data = Data.data;
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
    angular.element(this.window).on('resize', this.resize);
    this.move = (function(_this) {
      return function(event) {
        var t;
        t = _this.T.invert(event.x - event.target.getBoundingClientRect().left);
        Data.move(t);
        return _this.scope.$evalAsync();
      };
    })(this);
  }

  Ctrl.property('svg_height', {
    get: function() {
      return this.height + this.mar.top + this.mar.bottom;
    }
  });

  Ctrl.property('sthing', {
    get: function() {
      return this.V(this.point.dv / 2 + this.point.v) - 7;
    }
  });

  Ctrl.property('point', {
    get: function() {
      return Data.point;
    }
  });

  Ctrl.prototype.triangleData = function() {
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

  Ctrl.prototype.resize = function() {
    this.width = this.el[0].clientWidth - this.mar.left - this.mar.right;
    this.height = this.el[0].clientHeight - this.mar.top - this.mar.bottom - 8;
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



},{"../../helpers":23,"./derivativeData":8,"angular":undefined,"d3":undefined,"lodash":undefined}],7:[function(require,module,exports){
var Ctrl, Data, _, angular, d3, der, template,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

angular = require('angular');

d3 = require('d3');

require('../../helpers');

_ = require('lodash');

Data = require('./derivativeData');

template = '<svg ng-init=\'vm.resize()\' width=\'100%\' ng-attr-height=\'{{vm.svg_height}}\'>\n	<defs>\n		<clippath id=\'dervativeB\'>\n			<rect ng-attr-width=\'{{vm.width}}\' ng-attr-height=\'{{vm.height}}\'></rect>\n		</clippath>\n	</defs>\n	<g class=\'boilerplate\' shifter=\'[vm.mar.left, vm.mar.top]\'>\n		<rect class=\'background\' ng-attr-width=\'{{vm.width}}\' ng-attr-height=\'{{vm.height}}\' ng-mousemove=\'vm.move($event)\' />\n		<g ver-axis-der width=\'vm.width\' scale=\'vm.DV\' fun=\'vm.verAxFun\'></g>\n		<g hor-axis-der height=\'vm.height\' scale=\'vm.T\' fun=\'vm.horAxFun\' shifter=\'[0,vm.height]\'></g>\n		<foreignObject width=\'30\' height=\'30\' y=\'17\' shifter=\'[vm.width/2, vm.height]\'>\n				<text class=\'label\' >$t$</text>\n		</foreignObject>\n	</g>\n	<g class=\'main\' clip-path="url(#dervativeB)" shifter=\'[vm.mar.left, vm.mar.top]\'>\n		<line class=\'zero-line hor\' d3-der=\'{x1: 0, x2: vm.width, y1: vm.DV(0), y2: vm.DV(0)}\'/>\n		<path ng-attr-d=\'{{vm.lineFun(vm.data)}}\' class=\'fun dv\' />\n		<line class=\'tri dv\' d3-der=\'{x1: vm.T(vm.point.t)-1, x2: vm.T(vm.point.t)-1, y1: vm.DV(0), y2: vm.DV(vm.point.dv)}\'/>\n		<foreignObject width=\'30\' height=\'30\' shifter=\'[(vm.T(vm.point.t) - 16), vm.DV(vm.point.dv*.5)-6]\' style=\'font-size: 13px; font-weight: 100;\'>\n				<text class=\'label\' font-size=\'13px\'>$\\dot{y}$</text>\n		</foreignObject>\n		<circle r=\'3px\'  shifter=\'[vm.T(vm.point.t), vm.DV(vm.point.dv)]\' class=\'point dv\'/>\n	</g>\n</svg>';

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
      bottom: 35
    };
    this.DV = d3.scale.linear().domain([-1.5, 1.5]);
    this.T = d3.scale.linear().domain([0, 6]);
    this.data = Data.data;
    this.horAxFun = d3.svg.axis().scale(this.T).ticks(5).orient('bottom');
    this.verAxFun = d3.svg.axis().scale(this.DV).ticks(5).orient('left');
    this.lineFun = d3.svg.line().y((function(_this) {
      return function(d) {
        return _this.DV(d.dv);
      };
    })(this)).x((function(_this) {
      return function(d) {
        return _this.T(d.t);
      };
    })(this));
    angular.element(this.window).on('resize', this.resize);
    this.move = (function(_this) {
      return function(event) {
        var t;
        t = _this.T.invert(event.x - event.target.getBoundingClientRect().left);
        Data.move(t);
        return _this.scope.$evalAsync();
      };
    })(this);
  }

  Ctrl.property('svg_height', {
    get: function() {
      return this.height + this.mar.top + this.mar.bottom;
    }
  });

  Ctrl.property('point', {
    get: function() {
      return Data.point;
    }
  });

  Ctrl.prototype.resize = function() {
    this.width = this.el[0].clientWidth - this.mar.left - this.mar.right;
    this.height = this.el[0].clientHeight - this.mar.top - this.mar.bottom;
    this.DV.range([this.height, 0]);
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



},{"../../helpers":23,"./derivativeData":8,"angular":undefined,"d3":undefined,"lodash":undefined}],8:[function(require,module,exports){
var Data, _, dvFun, vFun;

_ = require('lodash');

vFun = Math.sin;

dvFun = Math.cos;

Data = (function() {
  function Data() {
    this.data = _.range(0, 8, 1 / 50).map(function(t) {
      var res;
      return res = {
        dv: dvFun(t),
        v: vFun(t),
        t: t
      };
    });
    this.point = _.sample(this.data);
  }

  Data.prototype.move = function(t) {
    return this.point = {
      dv: dvFun(t),
      v: vFun(t),
      t: t
    };
  };

  return Data;

})();

module.exports = new Data;



},{"lodash":undefined}],9:[function(require,module,exports){
var Ctrl, Data, angular, d3, der, template, textures,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

angular = require('angular');

d3 = require('d3');

Data = require('./designData');

require('../../helpers');

textures = require('textures');

template = '<h3>Plot A</h3>\n<svg ng-init=\'vm.resize()\' width=\'100%\' ng-attr-height=\'{{vm.svg_height}}\'>\n	<defs>\n		<clippath id=\'plotA\'>\n			<rect ng-attr-width=\'{{vm.width}}\' ng-attr-height=\'{{vm.height}}\'></rect>\n		</clippath>\n	</defs>\n	<g class=\'boilerplate\' shifter=\'[vm.mar.left, vm.mar.top]\'>\n		<rect class=\'background\' ng-attr-width=\'{{vm.width}}\' ng-attr-height=\'{{vm.height}}\' behavior=\'vm.drag_rect\'></rect>\n		<g ver-axis-der width=\'vm.width\' scale=\'vm.V\' fun=\'vm.verAxFun\'></g>\n		<g hor-axis-der height=\'vm.height\' scale=\'vm.T\' fun=\'vm.horAxFun\' shifter=\'[0,vm.height]\'></g>\n		<g hor-axis-der height=\'vm.height\' scale=\'vm.T\' fun=\'vm.horAxFun\' shifter=\'[0,vm.height]\'></g>\n		<foreignObject width=\'30\' height=\'30\' shifter=\'[-31, vm.height/2]\'>\n				<text class=\'label\'>$v$</text>\n		</foreignObject>\n		<foreignObject width=\'30\' height=\'30\' y=\'20\' shifter=\'[vm.width/2, vm.height]\'>\n				<text class=\'label\' >$t$</text>\n		</foreignObject>\n	</g>\n	<g class=\'main\' clip-path="url(#plotA)" shifter=\'[vm.mar.left, vm.mar.top]\'>\n		<line class=\'zero-line\' d3-der=\'{x1: 0, x2: vm.width, y1: vm.V(0), y2: vm.V(0)}\' />\n		<line class=\'zero-line\' d3-der="{x1: vm.T(0), x2: vm.T(0), y1: vm.height, y2: 0}" />\n		<g ng-class=\'{hide: !vm.Data.show}\' >\n			<line class=\'tri v\' d3-der=\'{x1: vm.T(vm.point.t)-1, x2: vm.T(vm.point.t)-1, y1: vm.V(0), y2: vm.V(vm.point.v)}\'/>\n			<path ng-attr-d=\'{{vm.triangleData()}}\' class=\'tri\' />\n			<path ng-attr-d=\'{{vm.lineFun([vm.point, {v: vm.point.dv + vm.point.v, t: vm.point.t}])}}\' class=\'tri dv\' />\n		</g>\n		<path ng-attr-d=\'{{vm.lineFun(vm.Data.data)}}\' class=\'fun v\' />\n		<g ng-repeat=\'dot in vm.dots track by dot.id\' datum=dot shifter=\'[vm.T(dot.t),vm.V(dot.v)]\' behavior=\'vm.drag\' dot-der ></g>\n		<circle class=\'dot small\' r=\'4\' shifter=\'[vm.T(vm.Data.first.t),vm.V(vm.Data.first.v)]\' />\n	</g>\n</svg>';

Ctrl = (function() {
  function Ctrl(scope, el, window) {
    var t;
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
    t = textures.lines().orientation("3/8", "7/8").size(5).stroke('#E6E6E6').strokeWidth(1);
    d3.select(this.el[0]).select('svg').call(t);
    d3.select(this.el[0]).select('rect.background').style('fill', t.url());
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
        var rect, v;
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
    this.height = this.width;
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



},{"../../helpers":23,"./designData":13,"angular":undefined,"d3":undefined,"textures":undefined}],10:[function(require,module,exports){
var Ctrl, Data, angular, d3, der, template,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

Data = require('./designData');

angular = require('angular');

d3 = require('d3');

require('../../helpers');

template = '<h3>Plot B</h3>\n<svg ng-init=\'vm.resize()\'  width=\'100%\' ng-attr-height=\'{{vm.svg_height}}\'>\n	<defs>\n		<clippath id=\'plotB\'>\n			<rect ng-attr-width=\'{{vm.width}}\' ng-attr-height=\'{{vm.height}}\'></rect>\n		</clippath>\n	</defs>\n	<g class=\'boilerplate\' shifter=\'[vm.mar.left, vm.mar.top]\'>\n		<rect class=\'background\' ng-attr-width=\'{{vm.width}}\' ng-attr-height=\'{{vm.height}}\'></rect>\n		<g ver-axis-der width=\'vm.width\' scale=\'vm.DV\' fun=\'vm.verAxFun\'></g>\n		<g hor-axis-der height=\'vm.height\' scale=\'vm.V\' fun=\'vm.horAxFun\' shifter=\'[0,vm.height]\'></g>\n		<foreignObject width=\'30\' height=\'30\' shifter=\'[-31, vm.height/2]\'>\n				<text class=\'label\'>$\\dot{v}$</text>\n		</foreignObject>\n		<foreignObject width=\'30\' height=\'30\' y=\'20\' shifter=\'[vm.width/2, vm.height]\'>\n				<text class=\'label\' >$v$</text>\n		</foreignObject>\n	</g>\n	<g class=\'main\' clip-path="url(#plotB)" shifter=\'[vm.mar.left, vm.mar.top]\'>\n		<line class=\'zero-line\' d3-der=\'{x1: 0, x2: vm.width, y1: vm.DV(0), y2: vm.DV(0)}\' />\n		<line class=\'zero-line\' d3-der="{x1: vm.V(0), x2: vm.V(0), y1: vm.height, y2: 0}" />\n		<path ng-attr-d=\'{{vm.lineFun(vm.Data.target_data)}}\' class=\'fun target\' />\n		<g ng-class=\'{hide: !vm.Data.show}\' >\n			<line class=\'tri v\' d3-der=\'{x1: vm.V(0), x2: vm.V(vm.point.v), y1: vm.DV(vm.point.dv), y2: vm.DV(vm.point.dv)}\'/>\n			<line class=\'tri dv\' d3-der=\'{x1: vm.V(vm.point.v), x2: vm.V(vm.point.v), y1: vm.DV(0), y2: vm.DV(vm.point.dv)}\'/>\n			<path ng-attr-d=\'{{vm.lineFun(vm.Data.target_data)}}\' class=\'fun correct\' ng-class=\'{hide: !vm.Data.correct}\' />\n		</g>\n		<g ng-repeat=\'dot in vm.dots track by dot.id\' shifter=\'[vm.V(dot.v),vm.DV(dot.dv)]\' dot-b-der></g>\n	</g>\n</svg>';

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

  Ctrl.property('point', {
    get: function() {
      return Data.selected;
    }
  });

  Ctrl.prototype.resize = function() {
    this.width = this.el[0].clientWidth - this.mar.left - this.mar.right;
    this.height = this.width;
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



},{"../../helpers":23,"./designData":13,"angular":undefined,"d3":undefined}],11:[function(require,module,exports){
var Ctrl, Data, _, d3, der, min, template,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

_ = require('lodash');

d3 = require('d3');

min = Math.min;

Data = require('./designData');

require('../../helpers');

template = '<md-slider flex min="0" max="5" step=\'0.025\' ng-model="vm.Data.t" aria-label="red" id="red-slider"></md-slider>\n{{vm.Data.t | number: 2}}\n<svg ng-init=\'vm.resize()\' width=\'100%\' ng-attr-height=\'{{vm.svg_height}}\'>\n	<g shifter=\'{{::[vm.mar.left, vm.mar.top]}}\'>\n		<rect ng-attr-width=\'{{vm.width}}\' ng-attr-height=\'{{vm.height}}\' class=\'background\'/>\n		<g hor-axis-der height=\'vm.height\' scale=\'vm.X\' fun=\'vm.axisFun\' shifter=\'[0,vm.height]\'></g>\n		<foreignObject width=\'30\' height=\'30\' y=\'20\' shifter=\'[vm.width/2, vm.height]\'>\n				<text class=\'label\' >$t$</text>\n		</foreignObject>\n		<g class=\'g-cart\' d3-der=\'{transform: "translate(" + vm.X(vm.Data.x) + ",0)"}\' tran="vm.tran">\n			<rect class=\'cart\' x=\'-12.5\' width=\'25\' ng-attr-y=\'{{vm.height/2-12.5}}\' height=\'25\'/>\n		</g>\n	</g>\n</svg>';

Ctrl = (function() {
  function Ctrl(scope, el, window) {
    this.scope = scope;
    this.el = el;
    this.window = window;
    this.resize = bind(this.resize, this);
    this.Data = Data;
    this.mar = {
      left: 30,
      right: 10,
      top: 10,
      bottom: 18
    };
    this.X = d3.scale.linear().domain([-.25, 5]);
    this.axisFun = d3.svg.axis().scale(this.X).ticks(5).orient('bottom');
    this.scope.$watch(function() {
      return Data.maxX;
    }, (function(_this) {
      return function(v) {
        return _this.X.domain([-.25, v + 1]);
      };
    })(this));
    this.tran = function(tran) {
      return tran.ease('cubic').duration(60);
    };
    angular.element(this.window).on('resize', this.resize);
  }

  Ctrl.property('svg_height', {
    get: function() {
      return this.height + this.mar.top + this.mar.bottom;
    }
  });

  Ctrl.prototype.resize = function() {
    this.width = this.el[0].clientWidth - this.mar.left - this.mar.right;
    this.height = this.width * .1 - this.mar.top - this.mar.bottom;
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



},{"../../helpers":23,"./designData":13,"d3":undefined,"lodash":undefined}],12:[function(require,module,exports){
var Ctrl, Data, _, d3, der, min, template,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

_ = require('lodash');

d3 = require('d3');

min = Math.min;

Data = require('./designData');

require('../../helpers');

template = '<svg ng-init=\'vm.resize()\' width=\'100%\' ng-attr-height=\'{{vm.svg_height}}\'>\n	<g shifter=\'{{::[vm.mar.left, vm.mar.top]}}\'>\n		<rect ng-attr-width=\'{{vm.width}}\' ng-attr-height=\'{{vm.height}}\' class=\'background\'/>\n		<g hor-axis-der height=\'vm.height\' scale=\'vm.X\' fun=\'vm.axisFun\' shifter=\'[0,vm.height]\'></g>\n		<foreignObject width=\'30\' height=\'30\' y=\'20\' shifter=\'[vm.width/2, vm.height]\'>\n				<text class=\'label\' >$t$</text>\n		</foreignObject>\n		<g class=\'g-cart\' d3-der=\'{transform: "translate(" + vm.X(vm.Data.true_x) + ",0)"}\' tran="vm.tran">\n			<rect class=\'cart\' x=\'-12.5\' width=\'25\' ng-attr-y=\'{{vm.height/2-12.5}}\' height=\'25\'/>\n		</g>\n	</g>\n</svg>';

Ctrl = (function() {
  function Ctrl(scope, el, window) {
    this.scope = scope;
    this.el = el;
    this.window = window;
    this.resize = bind(this.resize, this);
    this.Data = Data;
    this.mar = {
      left: 30,
      right: 10,
      top: 10,
      bottom: 18
    };
    this.X = d3.scale.linear().domain([-.25, 5]);
    this.axisFun = d3.svg.axis().scale(this.X).ticks(5).orient('bottom');
    this.scope.$watch(function() {
      return Data.maxX;
    }, (function(_this) {
      return function(v) {
        return _this.X.domain([-.25, v + 1]);
      };
    })(this));
    this.tran = function(tran) {
      return tran.ease('cubic').duration(60);
    };
    angular.element(this.window).on('resize', this.resize);
  }

  Ctrl.property('svg_height', {
    get: function() {
      return this.height + this.mar.top + this.mar.bottom;
    }
  });

  Ctrl.prototype.resize = function() {
    this.width = this.el[0].clientWidth - this.mar.left - this.mar.right;
    this.height = this.width * .1 - this.mar.top - this.mar.bottom;
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



},{"../../helpers":23,"./designData":13,"d3":undefined,"lodash":undefined}],13:[function(require,module,exports){
var Dot, Service, _, atan, exp, max, min, service, sqrt, vScale, xScale;

_ = require('lodash');

require('../../helpers');

exp = Math.exp, sqrt = Math.sqrt, atan = Math.atan, min = Math.min, max = Math.max;

vScale = d3.scale.linear();

xScale = d3.scale.linear();

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
    this.t = 0;
    this.x = 0;
    firstDot = new Dot(0, 4);
    firstDot.id = 'first';
    this.dots = [firstDot, new Dot(.3, 4 * exp(-.3))];
    this.correct = false;
    this.first = firstDot;
    this.selected = firstDot;
    this.show = false;
    this.target_data = _.range(0, 5, 1 / 50).map(function(t) {
      var res;
      return res = {
        t: t,
        v: 4 * exp(-t),
        dv: -4 * exp(-t)
      };
    });
    this.data = _.range(0, 5, 1 / 50).map(function(t) {
      var res;
      return res = {
        t: t,
        v: 0,
        x: 0
      };
    });
    xScale.domain(_.pluck(this.data, 't'));
    this.update_dots();
  }

  Service.prototype.add_dot = function(t, v) {
    this.selected = new Dot(t, v);
    this.dots.push(this.selected);
    return this.update_dot(this.selected, t, v);
  };

  Service.prototype.remove_dot = function(dot) {
    this.dots.splice(this.dots.indexOf(dot), 1);
    return this.update_dots();
  };

  Service.prototype.update_dots = function() {
    var domain, range;
    this.dots.sort(function(a, b) {
      return a.t - b.t;
    });
    domain = _.pluck(this.dots, 't');
    domain.push(6.5);
    range = _.pluck(this.dots, 'v');
    range.push(this.dots[this.dots.length - 1].v);
    vScale.domain(domain).range(range);
    this.data.forEach(function(d, i, k) {
      var prev;
      d.v = vScale(d.t);
      if (i > 0) {
        prev = k[i - 1];
        return d.x = prev.x + (prev.v + d.v) / 2 * (d.t - prev.t);
      } else {
        return d.x = 0;
      }
    });
    xScale.range(_.pluck(this.data, 'x'));
    return this.dots.forEach(function(dot, i, k) {
      var dt, prev;
      prev = k[i - 1];
      if (prev) {
        dt = dot.t - prev.t;
        dot.x = prev.x + dt * (dot.v + prev.v) / 2;
        return dot.dv = (dot.v - prev.v) / max(dt, .0001);
      } else {
        dot.x = 0;
        return dot.dv = 0;
      }
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

  Service.property('x', {
    get: function() {
      var res;
      return res = xScale(this.t);
    }
  });

  Service.property('true_x', {
    get: function() {
      return 4 * (1 - Math.exp(-this.t));
    }
  });

  Service.property('maxX', {
    get: function() {
      return this.data[this.data.length - 1].x;
    }
  });

  return Service;

})();

service = new Service;

module.exports = service;



},{"../../helpers":23,"lodash":undefined}],14:[function(require,module,exports){
var Ctrl, _, angular, d3, der, template,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

angular = require('angular');

d3 = require('d3');

require('../../helpers');

_ = require('lodash');

template = '<svg ng-init=\'vm.resize()\' width=\'100%\' ng-attr-height=\'{{vm.svg_height}}\'>\n	<defs>\n		<clippath id=\'reg\'>\n			<rect ng-attr-width=\'{{vm.width}}\' ng-attr-height=\'{{vm.height}}\'></rect>\n		</clippath>\n	</defs>\n	<g class=\'boilerplate\' shifter=\'[vm.mar.left, vm.mar.top]\'>\n		<rect class=\'background\' ng-attr-width=\'{{vm.width}}\' ng-attr-height=\'{{vm.height}}\' ng-mousemove=\'vm.move($event)\' />\n		<g ver-axis-der width=\'vm.width\' scale=\'vm.V\' fun=\'vm.verAxFun\'></g>\n		<g hor-axis-der height=\'vm.height\' scale=\'vm.T\' fun=\'vm.horAxFun\' shifter=\'[0,vm.height]\'></g>\n\n		<foreignObject width=\'30\' height=\'30\' y=\'17\' shifter=\'[vm.width/2, vm.height]\'>\n			<text class=\'label\' >$t$</text>\n		</foreignObject>\n	</g>\n	<g class=\'main\' clip-path="url(#reg)" shifter=\'[vm.mar.left, vm.mar.top]\'>\n		<line class=\'zero-line hor\' ng-class=\'{"correct": vm.correct}\' d3-der=\'{x1: 0, x2: vm.width, y1: vm.V(0), y2: vm.V(0)}\'/>\n		<line class=\'tri v\' d3-der=\'{x1: vm.T(vm.point.t), x2: vm.T(vm.point.t), y1: vm.V(0), y2: vm.V(vm.point.v )}\'/>\n		<path ng-attr-d=\'{{vm.lineFun(vm.data)}}\' class=\'fun v\' />\n		<circle r=\'3px\' shifter=\'[vm.T(vm.point.t), vm.V(vm.point.v)]\' class=\'point v\'/>\n		<foreignObject width=\'30\' height=\'30\' shifter=\'[(vm.T(vm.point.t) - 16), vm.sthing]\' style=\'font-size: 13px; font-weight: 100;\'>\n				<text class=\'label\' font-size=\'13px\'>$y$</text>\n		</foreignObject>\n	</g>\n</svg>';

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
    vFun = function(t) {
      return 5 * (t - .5) * (t - 1) * Math.pow(t - 2, 2);
    };
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

  Ctrl.property('svg_height', {
    get: function() {
      return this.height + this.mar.top + this.mar.bottom;
    }
  });

  Ctrl.prototype.resize = function() {
    this.width = this.el[0].clientWidth - this.mar.left - this.mar.right;
    this.height = this.el[0].clientHeight - this.mar.left - this.mar.right - 10;
    this.V.range([this.height, 0]);
    this.T.range([0, this.width]);
    return this.scope.$evalAsync();
  };

  Ctrl.property('sthing', {
    get: function() {
      return this.V(this.point.v / 2) - 7;
    }
  });

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



},{"../../helpers":23,"angular":undefined,"d3":undefined,"lodash":undefined}],15:[function(require,module,exports){
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



},{}],16:[function(require,module,exports){
var angular, d3, der;

d3 = require('d3');

angular = require('angular');

der = function($parse) {
  var directive;
  return directive = {
    restrict: 'A',
    scope: {
      d3Der: '=',
      tran: '='
    },
    link: function(scope, el, attr) {
      var sel;
      sel = d3.select(el[0]);
      return scope.$watch('d3Der', function(v) {
        if (scope.tran) {
          return sel.transition().attr(v).call(scope.tran);
        } else {
          return sel.attr(v);
        }
      }, true);
    }
  };
};

module.exports = der;



},{"angular":undefined,"d3":undefined}],17:[function(require,module,exports){
module.exports = function($parse) {
  return function(scope, el, attr) {
    return d3.select(el[0]).datum($parse(attr.datum)(scope));
  };
};



},{}],18:[function(require,module,exports){
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



},{}],19:[function(require,module,exports){
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



},{}],20:[function(require,module,exports){
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



},{"d3":undefined}],21:[function(require,module,exports){
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



},{"angular":undefined,"d3":undefined}],22:[function(require,module,exports){
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



},{"angular":undefined,"d3":undefined}],23:[function(require,module,exports){
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvbGV3aXMvUmVzZWFyY2gvZGlmZkVRX25ldy9hcHAvYXBwLmNvZmZlZSIsIi9Vc2Vycy9sZXdpcy9SZXNlYXJjaC9kaWZmRVFfbmV3L2FwcC9jb21wb25lbnRzL2NhcnQvY2FydEJ1dHRvbnMuY29mZmVlIiwiL1VzZXJzL2xld2lzL1Jlc2VhcmNoL2RpZmZFUV9uZXcvYXBwL2NvbXBvbmVudHMvY2FydC9jYXJ0RGF0YS5jb2ZmZWUiLCIvVXNlcnMvbGV3aXMvUmVzZWFyY2gvZGlmZkVRX25ldy9hcHAvY29tcG9uZW50cy9jYXJ0L2NhcnRQbG90LmNvZmZlZSIsIi9Vc2Vycy9sZXdpcy9SZXNlYXJjaC9kaWZmRVFfbmV3L2FwcC9jb21wb25lbnRzL2NhcnQvY2FydFNpbS5jb2ZmZWUiLCIvVXNlcnMvbGV3aXMvUmVzZWFyY2gvZGlmZkVRX25ldy9hcHAvY29tcG9uZW50cy9kZXJpdmF0aXZlL2Rlcml2YXRpdmUuY29mZmVlIiwiL1VzZXJzL2xld2lzL1Jlc2VhcmNoL2RpZmZFUV9uZXcvYXBwL2NvbXBvbmVudHMvZGVyaXZhdGl2ZS9kZXJpdmF0aXZlQi5jb2ZmZWUiLCIvVXNlcnMvbGV3aXMvUmVzZWFyY2gvZGlmZkVRX25ldy9hcHAvY29tcG9uZW50cy9kZXJpdmF0aXZlL2Rlcml2YXRpdmVEYXRhLmNvZmZlZSIsIi9Vc2Vycy9sZXdpcy9SZXNlYXJjaC9kaWZmRVFfbmV3L2FwcC9jb21wb25lbnRzL2Rlc2lnbi9kZXNpZ25BLmNvZmZlZSIsIi9Vc2Vycy9sZXdpcy9SZXNlYXJjaC9kaWZmRVFfbmV3L2FwcC9jb21wb25lbnRzL2Rlc2lnbi9kZXNpZ25CLmNvZmZlZSIsIi9Vc2Vycy9sZXdpcy9SZXNlYXJjaC9kaWZmRVFfbmV3L2FwcC9jb21wb25lbnRzL2Rlc2lnbi9kZXNpZ25DYXJ0QS5jb2ZmZWUiLCIvVXNlcnMvbGV3aXMvUmVzZWFyY2gvZGlmZkVRX25ldy9hcHAvY29tcG9uZW50cy9kZXNpZ24vZGVzaWduQ2FydEIuY29mZmVlIiwiL1VzZXJzL2xld2lzL1Jlc2VhcmNoL2RpZmZFUV9uZXcvYXBwL2NvbXBvbmVudHMvZGVzaWduL2Rlc2lnbkRhdGEuY29mZmVlIiwiL1VzZXJzL2xld2lzL1Jlc2VhcmNoL2RpZmZFUV9uZXcvYXBwL2NvbXBvbmVudHMvcmVndWxhci9yZWd1bGFyLmNvZmZlZSIsIi9Vc2Vycy9sZXdpcy9SZXNlYXJjaC9kaWZmRVFfbmV3L2FwcC9kaXJlY3RpdmVzL2JlaGF2aW9yLmNvZmZlZSIsIi9Vc2Vycy9sZXdpcy9SZXNlYXJjaC9kaWZmRVFfbmV3L2FwcC9kaXJlY3RpdmVzL2QzRGVyLmNvZmZlZSIsIi9Vc2Vycy9sZXdpcy9SZXNlYXJjaC9kaWZmRVFfbmV3L2FwcC9kaXJlY3RpdmVzL2RhdHVtLmNvZmZlZSIsIi9Vc2Vycy9sZXdpcy9SZXNlYXJjaC9kaWZmRVFfbmV3L2FwcC9kaXJlY3RpdmVzL2RvdC5jb2ZmZWUiLCIvVXNlcnMvbGV3aXMvUmVzZWFyY2gvZGlmZkVRX25ldy9hcHAvZGlyZWN0aXZlcy9kb3RCLmNvZmZlZSIsIi9Vc2Vycy9sZXdpcy9SZXNlYXJjaC9kaWZmRVFfbmV3L2FwcC9kaXJlY3RpdmVzL3NoaWZ0ZXIuY29mZmVlIiwiL1VzZXJzL2xld2lzL1Jlc2VhcmNoL2RpZmZFUV9uZXcvYXBwL2RpcmVjdGl2ZXMveEF4aXMuY29mZmVlIiwiL1VzZXJzL2xld2lzL1Jlc2VhcmNoL2RpZmZFUV9uZXcvYXBwL2RpcmVjdGl2ZXMveUF4aXMuY29mZmVlIiwiL1VzZXJzL2xld2lzL1Jlc2VhcmNoL2RpZmZFUV9uZXcvYXBwL2hlbHBlcnMuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUEsWUFBQSxDQUFBO0FBQUEsSUFBQSx3QkFBQTs7QUFBQSxPQUNBLEdBQVUsT0FBQSxDQUFRLFNBQVIsQ0FEVixDQUFBOztBQUFBLEVBRUEsR0FBSyxPQUFBLENBQVEsSUFB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QixNQUFNLENBQUMsY0FBUCxDQUFzQixJQUFDLENBQUEsU0FBdkIsRUFBa0MsSUFBbEMsRUFBd0MsSUFBeEMsRUFEbUI7QUFBQSxDQVRyQixDQUFBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIid1c2Ugc3RyaWN0J1xuYW5ndWxhciA9IHJlcXVpcmUgJ2FuZ3VsYXInXG5kMyA9IHJlcXVpcmUgJ2QzJ1xuYXBwID0gYW5ndWxhci5tb2R1bGUgJ21haW5BcHAnLCBbcmVxdWlyZSAnYW5ndWxhci1tYXRlcmlhbCddXG5cdC5kaXJlY3RpdmUgJ2hvckF4aXNEZXInLCByZXF1aXJlICcuL2RpcmVjdGl2ZXMveEF4aXMnXG5cdC5kaXJlY3RpdmUgJ3ZlckF4aXNEZXInLCByZXF1aXJlICcuL2RpcmVjdGl2ZXMveUF4aXMnXG5cdC5kaXJlY3RpdmUgJ2NhcnRTaW1EZXInLCByZXF1aXJlICcuL2NvbXBvbmVudHMvY2FydC9jYXJ0U2ltJ1xuXHQuZGlyZWN0aXZlICdjYXJ0QnV0dG9uc0RlcicsIHJlcXVpcmUgJy4vY29tcG9uZW50cy9jYXJ0L2NhcnRCdXR0b25zJ1xuXHQuZGlyZWN0aXZlICdzaGlmdGVyJyAsIHJlcXVpcmUgJy4vZGlyZWN0aXZlcy9zaGlmdGVyJ1xuXHQuZGlyZWN0aXZlICdkZXNpZ25BRGVyJywgcmVxdWlyZSAnLi9jb21wb25lbnRzL2Rlc2lnbi9kZXNpZ25BJ1xuXHQuZGlyZWN0aXZlICdiZWhhdmlvcicsIHJlcXVpcmUgJy4vZGlyZWN0aXZlcy9iZWhhdmlvcidcblx0LmRpcmVjdGl2ZSAnZG90RGVyJywgcmVxdWlyZSAnLi9kaXJlY3RpdmVzL2RvdCdcblx0LmRpcmVjdGl2ZSAnZGF0dW0nLCByZXF1aXJlICcuL2RpcmVjdGl2ZXMvZGF0dW0nXG5cdC5kaXJlY3RpdmUgJ2QzRGVyJywgcmVxdWlyZSAnLi9kaXJlY3RpdmVzL2QzRGVyJ1xuXHQuZGlyZWN0aXZlICdkZXNpZ25CRGVyJyAsIHJlcXVpcmUgJy4vY29tcG9uZW50cy9kZXNpZ24vZGVzaWduQidcblx0LmRpcmVjdGl2ZSAncmVndWxhckRlcicsIHJlcXVpcmUgJy4vY29tcG9uZW50cy9yZWd1bGFyL3JlZ3VsYXInXG5cdC5kaXJlY3RpdmUgJ2Rlcml2YXRpdmVEZXInLCByZXF1aXJlICcuL2NvbXBvbmVudHMvZGVyaXZhdGl2ZS9kZXJpdmF0aXZlJ1xuXHQuZGlyZWN0aXZlICdkZXJpdmF0aXZlQkRlcicsIHJlcXVpcmUgJy4vY29tcG9uZW50cy9kZXJpdmF0aXZlL2Rlcml2YXRpdmVCJ1xuXHQuZGlyZWN0aXZlICdkb3RCRGVyJywgcmVxdWlyZSAnLi9kaXJlY3RpdmVzL2RvdEInXG5cdC5kaXJlY3RpdmUgJ2NhcnRQbG90RGVyJywgcmVxdWlyZSAnLi9jb21wb25lbnRzL2NhcnQvY2FydFBsb3QnXG5cdC5kaXJlY3RpdmUgJ2Rlc2lnbkNhcnRBRGVyJywgcmVxdWlyZSAnLi9jb21wb25lbnRzL2Rlc2lnbi9kZXNpZ25DYXJ0QSdcblx0LmRpcmVjdGl2ZSAnZGVzaWduQ2FydEJEZXInLCByZXF1aXJlICcuL2NvbXBvbmVudHMvZGVzaWduL2Rlc2lnbkNhcnRCJ1xuXG5sb29wZXIgPSAtPlxuICAgIHNldFRpbWVvdXQoICgpLT5cbiAgICBcdFx0XHRkMy5zZWxlY3RBbGwgJ2NpcmNsZS5kb3QubGFyZ2UnXG4gICAgXHRcdFx0XHQudHJhbnNpdGlvbiAnZ3JvdydcbiAgICBcdFx0XHRcdC5kdXJhdGlvbiA1MDBcbiAgICBcdFx0XHRcdC5lYXNlICdjdWJpYy1vdXQnXG4gICAgXHRcdFx0XHQuYXR0ciAndHJhbnNmb3JtJywgJ3NjYWxlKCAxLjM0KSdcbiAgICBcdFx0XHRcdC50cmFuc2l0aW9uICdzaHJpbmsnXG4gICAgXHRcdFx0XHQuZHVyYXRpb24gNTAwXG4gICAgXHRcdFx0XHQuZWFzZSAnY3ViaWMtb3V0J1xuICAgIFx0XHRcdFx0LmF0dHIgJ3RyYW5zZm9ybScsICdzY2FsZSggMS4wKSdcbiAgICBcdFx0XHRsb29wZXIoKVxuICAgIFx0XHQsIDEwMDApXG5cbmxvb3BlcigpXG4iLCJfID0gcmVxdWlyZSAnbG9kYXNoJ1xue2V4cCwgc3FydCwgYXRhbn0gPSBNYXRoXG5DYXJ0ID0gcmVxdWlyZSAnLi9jYXJ0RGF0YSdcblxudGVtcGxhdGUgPSAnJydcblx0PGRpdiBmbGV4IGxheW91dD0ncm93Jz5cblx0XHQ8bWQtYnV0dG9uIGZsZXggY2xhc3M9XCJtZC1yYWlzZWRcIiBuZy1jbGljaz0ndm0ucGxheSgpJz5QbGF5PC9tZC1idXR0b24+XG5cdFx0PG1kLWJ1dHRvbiBmbGV4IGNsYXNzPVwibWQtcmFpc2VkXCIgbmctY2xpY2s9J3ZtLnBhdXNlKCknPlBhdXNlPC9tZC1idXR0b24+XG5cdDwvZGl2PlxuJycnXG5cbmNsYXNzIEN0cmxcblx0Y29uc3RydWN0b3I6IChAc2NvcGUpLT5cblx0XHRAY2FydCA9IENhcnRcblxuXHRwbGF5OiAtPlxuXHRcdENhcnQucGF1c2VkID0gdHJ1ZVxuXHRcdGQzLnRpbWVyLmZsdXNoKClcblx0XHRAY2FydC5yZXN0YXJ0KClcblx0XHRDYXJ0LnBhdXNlZCA9IGZhbHNlXG5cdFx0c2V0VGltZW91dCA9PlxuXHRcdFx0bGFzdCA9IDBcblx0XHRcdGQzLnRpbWVyIChlbGFwc2VkKT0+XG5cdFx0XHRcdEBjYXJ0LmluY3JlbWVudCAoZWxhcHNlZCAtIGxhc3QpLzEwMDBcblx0XHRcdFx0bGFzdCA9IGVsYXBzZWRcblx0XHRcdFx0aWYgKEBjYXJ0LnYgPCAuMDEpIHRoZW4gQ2FydC5wYXVzZWQgPSB0cnVlXG5cdFx0XHRcdEBzY29wZS4kZXZhbEFzeW5jKClcblx0XHRcdFx0Q2FydC5wYXVzZWRcblxuXHRwYXVzZTogLT5cblx0XHRDYXJ0LnBhdXNlZCA9IHRydWVcblxuZGVyID0gKCktPlxuXHRkaXJlY3RpdmUgPSBcblx0XHRjb250cm9sbGVyQXM6ICd2bSdcblx0XHQjIHJlc3RyaWN0OiAnRSdcblx0XHRzY29wZToge31cblx0XHRjb250cm9sbGVyOiBbJyRzY29wZScsIEN0cmxdXG5cdFx0dGVtcGxhdGU6IHRlbXBsYXRlXG5cbm1vZHVsZS5leHBvcnRzID0gZGVyIiwiXyA9IHJlcXVpcmUgJ2xvZGFzaCdcbntleHAsIHNxcnQsIGF0YW59ID0gTWF0aFxuXG5jbGFzcyBDYXJ0XG5cdGNvbnN0cnVjdG9yOiAoQG9wdGlvbnMpLT5cblx0XHR7QHgwLCBAdjAsIEBifSA9IEBvcHRpb25zXG5cdFx0QHJlc3RhcnQoKVxuXHRyZXN0YXJ0OiAtPlxuXHRcdEB0ID0gMFxuXHRcdEB0cmFqZWN0b3J5ID0gW11cblx0XHRAbW92ZSgwKVxuXHRcdEBwYXVzZWQgPSB0cnVlXG5cdHNldF90OiAodCktPlxuXHRcdEB0ID0gdFxuXHRcdEBtb3ZlIHRcblx0aW5jcmVtZW50OiAoZHQpLT5cblx0XHRAdCs9ZHRcblx0XHRAbW92ZSBAdFxuXHRtb3ZlOiAodCktPlxuXHRcdEB2ID0gQHYwICogZXhwKC1AYiAqIHQpXG5cdFx0QHggPSBAeDAgKyBAdjAvQGIgKiAoMS1leHAoLUBiKnQpKVxuXHRcdEBkdiA9IC1AdlxuXHRcdEB0cmFqZWN0b3J5LnB1c2gge3Q6IHQsIHY6IEB2LCB4OiBAeH1cblxubW9kdWxlLmV4cG9ydHMgPSBuZXcgQ2FydCB7eDA6IDAsIHYwOiA0LCBiOiAxfSIsImFuZ3VsYXIgPSByZXF1aXJlICdhbmd1bGFyJ1xuZDMgPSByZXF1aXJlICdkMydcbnJlcXVpcmUgJy4uLy4uL2hlbHBlcnMnXG5fID0gcmVxdWlyZSAnbG9kYXNoJ1xuQ2FydCA9IHJlcXVpcmUgJy4vY2FydERhdGEnXG50ZW1wbGF0ZSA9ICcnJ1xuXHQ8c3ZnIG5nLWluaXQ9J3ZtLnJlc2l6ZSgpJyB3aWR0aD0nMTAwJScgbmctYXR0ci1oZWlnaHQ9J3t7dm0uc3ZnX2hlaWdodH19Jz5cblx0XHQ8ZGVmcz5cblx0XHRcdDxjbGlwcGF0aCBpZD0nc29sJz5cblx0XHRcdFx0PHJlY3QgbmctYXR0ci13aWR0aD0ne3t2bS53aWR0aH19JyBuZy1hdHRyLWhlaWdodD0ne3t2bS5oZWlnaHR9fSc+PC9yZWN0PlxuXHRcdFx0PC9jbGlwcGF0aD5cblx0XHQ8L2RlZnM+XG5cdFx0PGcgY2xhc3M9J2JvaWxlcnBsYXRlJyBzaGlmdGVyPSdbdm0ubWFyLmxlZnQsIHZtLm1hci50b3BdJz5cblx0XHRcdDxyZWN0IGNsYXNzPSdiYWNrZ3JvdW5kJyBuZy1hdHRyLXdpZHRoPSd7e3ZtLndpZHRofX0nIG5nLWF0dHItaGVpZ2h0PSd7e3ZtLmhlaWdodH19JyBuZy1tb3VzZW1vdmU9J3ZtLm1vdmUoJGV2ZW50KScgLz5cblx0XHRcdDxnIHZlci1heGlzLWRlciB3aWR0aD0ndm0ud2lkdGgnIHNjYWxlPSd2bS5WJyBmdW49J3ZtLnZlckF4RnVuJz48L2c+XG5cdFx0XHQ8ZyBob3ItYXhpcy1kZXIgaGVpZ2h0PSd2bS5oZWlnaHQnIHNjYWxlPSd2bS5UJyBmdW49J3ZtLmhvckF4RnVuJyBzaGlmdGVyPSdbMCx2bS5oZWlnaHRdJz48L2c+XG5cdFx0XHQ8Zm9yZWlnbk9iamVjdCB3aWR0aD0nMzAnIGhlaWdodD0nMzAnIHk9JzE3JyBzaGlmdGVyPSdbdm0ud2lkdGgvMiwgdm0uaGVpZ2h0XSc+XG5cdFx0XHRcdDx0ZXh0IGNsYXNzPSdsYWJlbCcgPiR0JDwvdGV4dD5cblx0XHRcdDwvZm9yZWlnbk9iamVjdD5cblx0XHRcdDxmb3JlaWduT2JqZWN0IHdpZHRoPSczMCcgaGVpZ2h0PSczMCcgc2hpZnRlcj0nWy0zMSwgdm0uaGVpZ2h0LzItOF0nPlxuXHRcdFx0XHRcdDx0ZXh0IGNsYXNzPSdsYWJlbCcgPiR2JDwvdGV4dD5cblx0XHRcdDwvZm9yZWlnbk9iamVjdD5cblx0XHRcdDxsaW5lIGNsYXNzPSd6ZXJvLWxpbmUnIGQzLWRlcj1cInt4MTogMCAsIHgyOiB2bS53aWR0aCwgeTE6IHZtLlYoMCksIHkyOiB2bS5WKDApfVwiIC8+IFxuXHRcdFx0PGxpbmUgY2xhc3M9J3plcm8tbGluZScgZDMtZGVyPVwie3gxOiB2bS5UKDApICwgeDI6IHZtLlQoMCksIHkxOiAwLCB5Mjogdm0uaGVpZ2h0fVwiIC8+IFxuXHRcdDwvZz5cblx0XHQ8ZyBjbGFzcz0nbWFpbicgY2xpcC1wYXRoPVwidXJsKCNzb2wpXCIgc2hpZnRlcj0nW3ZtLm1hci5sZWZ0LCB2bS5tYXIudG9wXSc+XG5cdFx0XHQ8Zm9yZWlnbk9iamVjdCB3aWR0aD0nMzAnIGhlaWdodD0nMzAnIHNoaWZ0ZXI9J1sodm0uVCh2bS5wb2ludC50KSAtIDE2KSwgdm0uc3RoaW5nXScgc3R5bGU9J2ZvbnQtc2l6ZTogMTNweDsgZm9udC13ZWlnaHQ6IDEwMDsnPlxuXHRcdFx0XHRcdDx0ZXh0IGNsYXNzPSdsYWJlbCcgZm9udC1zaXplPScxM3B4Jz4kdiQ8L3RleHQ+XG5cdFx0XHQ8L2ZvcmVpZ25PYmplY3Q+XG5cdFx0XHQ8bGluZSBjbGFzcz0ndHJpIHYnIGQzLWRlcj0ne3gxOiB2bS5UKHZtLnBvaW50LnQpLTEsIHgyOiB2bS5UKHZtLnBvaW50LnQpLTEsIHkxOiB2bS5WKDApLCB5Mjogdm0uVih2bS5wb2ludC52KX0nLz5cblx0XHRcdDxwYXRoIG5nLWF0dHItZD0ne3t2bS5saW5lRnVuKHZtLmRhdGEpfX0nIGNsYXNzPSdmdW4gdicgLz5cblx0XHRcdDxjaXJjbGUgcj0nM3B4JyBzaGlmdGVyPSdbdm0uVCh2bS5wb2ludC50KSwgdm0uVih2bS5wb2ludC52KV0nIGNsYXNzPSdwb2ludCB2Jy8+XG5cdFx0PC9nPlxuXHQ8L3N2Zz5cbicnJ1xuXHRcdFx0XHQjIDxwYXRoIG5nLWF0dHItZD0ne3t2bS50cmlhbmdsZURhdGEoKX19JyBjbGFzcz0ndHJpJyAvPlxuXHRcdFx0XHQjIDxwYXRoIG5nLWF0dHItZD0ne3t2bS5saW5lRnVuKFt2bS5wb2ludCwge3Y6IHZtLnBvaW50LmR2ICsgdm0ucG9pbnQudiwgdDogdm0ucG9pbnQudH1dKX19JyBjbGFzcz0ndHJpIGR2JyAvPlxuXG5jbGFzcyBDdHJsXG5cdGNvbnN0cnVjdG9yOiAoQHNjb3BlLCBAZWwsIEB3aW5kb3cpLT5cblx0XHRAbWFyID0gXG5cdFx0XHRsZWZ0OiAzMFxuXHRcdFx0dG9wOiAyMFxuXHRcdFx0cmlnaHQ6IDIwXG5cdFx0XHRib3R0b206IDM1XG5cblx0XHRAViA9IGQzLnNjYWxlLmxpbmVhcigpLmRvbWFpbiBbLS4xLDVdXG5cdFx0QFQgPSBkMy5zY2FsZS5saW5lYXIoKS5kb21haW4gWy0uMSw1XVxuXG5cdFx0QHBvaW50ID0gQ2FydFxuXG5cdFx0QGhvckF4RnVuID0gZDMuc3ZnLmF4aXMoKVxuXHRcdFx0LnNjYWxlIEBUXG5cdFx0XHQudGlja3MgNVxuXHRcdFx0Lm9yaWVudCAnYm90dG9tJ1xuXG5cdFx0QHZlckF4RnVuID0gZDMuc3ZnLmF4aXMoKVxuXHRcdFx0LnNjYWxlIEBWXG5cdFx0XHQudGlja3MgNVxuXHRcdFx0Lm9yaWVudCAnbGVmdCdcblx0XHRcblx0XHRAbGluZUZ1biA9IGQzLnN2Zy5saW5lKClcblx0XHRcdC55IChkKT0+IEBWIGQudlxuXHRcdFx0LnggKGQpPT4gQFQgZC50XG5cblx0XHR2RnVuID0gKHQpLT4gNCpNYXRoLmV4cCAtdFxuXG5cdFx0QGRhdGEgPSBfLnJhbmdlIDAgLCA1ICwgMS82MFxuXHRcdFx0Lm1hcCAodCktPlxuXHRcdFx0XHRyZXMgPSBcblx0XHRcdFx0XHR2OiB2RnVuIHRcblx0XHRcdFx0XHR0OiB0XG5cblx0XHRhbmd1bGFyLmVsZW1lbnQgQHdpbmRvd1xuXHRcdFx0Lm9uICdyZXNpemUnLCBAcmVzaXplXG5cblx0XHRAbW92ZSA9IChldmVudCkgPT5cblx0XHRcdGlmIG5vdCBDYXJ0LnBhdXNlZCB0aGVuIHJldHVyblxuXHRcdFx0cmVjdCA9IGV2ZW50LnRhcmdldC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKVxuXHRcdFx0dCA9IEBULmludmVydCBldmVudC54IC0gcmVjdC5sZWZ0XG5cdFx0XHR0ID0gTWF0aC5tYXggMCAsIHRcblx0XHRcdENhcnQuc2V0X3QgdFxuXHRcdFx0QHNjb3BlLiRldmFsQXN5bmMoKVxuXG5cdEBwcm9wZXJ0eSAnc3RoaW5nJywgZ2V0Oi0+XG5cdFx0QFYoQHBvaW50LnYvMikgLSA3XG5cblx0QHByb3BlcnR5ICdzdmdfaGVpZ2h0JywgZ2V0OiAtPiBAaGVpZ2h0ICsgQG1hci50b3AgKyBAbWFyLmJvdHRvbVxuXG5cdHJlc2l6ZTogKCk9PlxuXHRcdEB3aWR0aCA9IEBlbFswXS5jbGllbnRXaWR0aCAtIEBtYXIubGVmdCAtIEBtYXIucmlnaHRcblx0XHRAaGVpZ2h0ID0gQHdpZHRoKi43IC0gQG1hci5sZWZ0IC0gQG1hci5yaWdodFxuXHRcdEBWLnJhbmdlIFtAaGVpZ2h0LCAwXVxuXHRcdEBULnJhbmdlIFswLCBAd2lkdGhdXG5cdFx0QHNjb3BlLiRldmFsQXN5bmMoKVxuXG5kZXIgPSAoKS0+XG5cdGRpcmVjdGl2ZSA9IFxuXHRcdGNvbnRyb2xsZXJBczogJ3ZtJ1xuXHRcdHNjb3BlOiB7fVxuXHRcdHRlbXBsYXRlOiB0ZW1wbGF0ZVxuXHRcdHRlbXBsYXRlTmFtZXNwYWNlOiAnc3ZnJ1xuXHRcdGNvbnRyb2xsZXI6IFsnJHNjb3BlJywnJGVsZW1lbnQnLCAnJHdpbmRvdycsIEN0cmxdXG5cbm1vZHVsZS5leHBvcnRzID0gZGVyXG4iLCJfID0gcmVxdWlyZSAnbG9kYXNoJ1xuZDM9IHJlcXVpcmUgJ2QzJ1xue21pbn0gPSBNYXRoXG5DYXJ0ID0gcmVxdWlyZSAnLi9jYXJ0RGF0YSdcbnJlcXVpcmUgJy4uLy4uL2hlbHBlcnMnXG5cbnRlbXBsYXRlID0gJycnXG5cdDxzdmcgbmctaW5pdD0ndm0ucmVzaXplKCknIHdpZHRoPScxMDAlJyBuZy1hdHRyLWhlaWdodD0ne3t2bS5zdmdfaGVpZ2h0fX0nPlxuXHRcdDxnIHNoaWZ0ZXI9J3t7Ojpbdm0ubWFyLmxlZnQsIHZtLm1hci50b3BdfX0nPlxuXHRcdFx0PHJlY3QgbmctYXR0ci13aWR0aD0ne3t2bS53aWR0aH19JyBuZy1hdHRyLWhlaWdodD0ne3t2bS5oZWlnaHR9fScgY2xhc3M9J2JhY2tncm91bmQnLz5cblx0XHRcdDxnIGhvci1heGlzLWRlciBoZWlnaHQ9J3ZtLmhlaWdodCcgc2NhbGU9J3ZtLlgnIGZ1bj0ndm0uYXhpc0Z1bicgc2hpZnRlcj0nWzAsdm0uaGVpZ2h0XSc+PC9nPlxuXG5cdFx0XHQ8Zm9yZWlnbk9iamVjdCB3aWR0aD0nMzAnIGhlaWdodD0nMzAnIHk9JzIwJyBzaGlmdGVyPSdbdm0ud2lkdGgvMiwgdm0uaGVpZ2h0XSc+XG5cdFx0XHRcdFx0PHRleHQgY2xhc3M9J2xhYmVsJyA+JHQkPC90ZXh0PlxuXHRcdFx0PC9mb3JlaWduT2JqZWN0PlxuXHRcdFx0PGcgY2xhc3M9J2ctY2FydCc+XG5cdFx0XHRcdDxyZWN0IGNsYXNzPSdjYXJ0JyBuZy1hdHRyLXk9J3t7dm0uaGVpZ2h0LzN9fScgbmctYXR0ci13aWR0aD0ne3t2bS5oZWlnaHQvM319JyBuZy1hdHRyLWhlaWdodD0ne3t2bS5oZWlnaHQvM319Jy8+XG5cdFx0XHQ8L2c+XG5cdFx0PC9nPlxuXHQ8L3N2Zz5cbicnJ1xuXG5jbGFzcyBDdHJsXG5cdGNvbnN0cnVjdG9yOiAoQHNjb3BlLCBAZWwsIEB3aW5kb3cpLT5cblx0XHRAY2FydCA9IENhcnRcblx0XHRAbWFyID0gXG5cdFx0XHRsZWZ0OiAzMFxuXHRcdFx0cmlnaHQ6IDEwXG5cdFx0XHR0b3A6IDEwXG5cdFx0XHRib3R0b206IDE4XG5cdFx0QFggPSBkMy5zY2FsZS5saW5lYXIoKS5kb21haW4gWy0uMjUsNV0gXG5cdFx0c2VsICA9IGQzLnNlbGVjdCBAZWxbMF1cblx0XHRjYXJ0ID0gc2VsLnNlbGVjdCAnLmctY2FydCdcblxuXHRcdEBheGlzRnVuID0gZDMuc3ZnLmF4aXMoKVxuXHRcdFx0LnNjYWxlIEBYXG5cdFx0XHQudGlja3MgNVxuXHRcdFx0Lm9yaWVudCAnYm90dG9tJ1xuXG5cdFx0QHNjb3BlLiR3YXRjaCAndm0uY2FydC54JywgKHgpPT5cblx0XHRcdHhQeCA9IEBYKHgpXG5cdFx0XHRjYXJ0XG5cdFx0XHRcdC50cmFuc2l0aW9uKClcblx0XHRcdFx0LmR1cmF0aW9uIDE1XG5cdFx0XHRcdC5lYXNlICdsaW5lYXInXG5cdFx0XHRcdC5hdHRyICd0cmFuc2Zvcm0nLCBcInRyYW5zbGF0ZSgje3hQeH0sMClcIlxuXG5cdFx0YW5ndWxhci5lbGVtZW50IEB3aW5kb3dcblx0XHRcdC5vbiAncmVzaXplJyAsICgpPT5AcmVzaXplKClcblxuXHRAcHJvcGVydHkgJ3N2Z19oZWlnaHQnICwgZ2V0Oi0+IEBoZWlnaHQgKyBAbWFyLnRvcCArIEBtYXIuYm90dG9tXG5cblx0cmVzaXplOiAoKT0+XG5cdFx0QHdpZHRoID0gQGVsWzBdLmNsaWVudFdpZHRoIC0gQG1hci5sZWZ0IC0gQG1hci5yaWdodFxuXHRcdEBoZWlnaHQgPSBAd2lkdGgqLjMgLSBAbWFyLnRvcCAtIEBtYXIuYm90dG9tXG5cdFx0QFgucmFuZ2UoWzAsIEB3aWR0aF0pXG5cdFx0QHNjb3BlLiRldmFsQXN5bmMoKVxuXG5kZXIgPSAoKS0+XG5cdGRpcmVjdGl2ZSA9IFxuXHRcdHRlbXBsYXRlOiB0ZW1wbGF0ZVxuXHRcdHNjb3BlOiB7fVxuXHRcdHJlc3RyaWN0OiAnQSdcblx0XHRiaW5kVG9Db250cm9sbGVyOiB0cnVlXG5cdFx0dGVtcGxhdGVOYW1lc3BhY2U6ICdzdmcnXG5cdFx0Y29udHJvbGxlcjogWyckc2NvcGUnLCAnJGVsZW1lbnQnLCAnJHdpbmRvdycsIEN0cmxdXG5cdFx0Y29udHJvbGxlckFzOiAndm0nXG5cbm1vZHVsZS5leHBvcnRzID0gZGVyXG4iLCJhbmd1bGFyID0gcmVxdWlyZSAnYW5ndWxhcidcbmQzID0gcmVxdWlyZSAnZDMnXG5yZXF1aXJlICcuLi8uLi9oZWxwZXJzJ1xuXyA9IHJlcXVpcmUgJ2xvZGFzaCdcbkRhdGEgPSByZXF1aXJlICcuL2Rlcml2YXRpdmVEYXRhJ1xuXG50ZW1wbGF0ZSA9ICcnJ1xuXHQ8c3ZnIG5nLWluaXQ9J3ZtLnJlc2l6ZSgpJyB3aWR0aD0nMTAwJScgbmctYXR0ci1oZWlnaHQ9J3t7dm0uc3ZnX2hlaWdodH19Jz5cblx0XHQ8ZGVmcz5cblx0XHRcdDxjbGlwcGF0aCBpZD0nZGVyQ2xpcCc+XG5cdFx0XHRcdDxyZWN0IG5nLWF0dHItd2lkdGg9J3t7dm0ud2lkdGh9fScgbmctYXR0ci1oZWlnaHQ9J3t7dm0uaGVpZ2h0fX0nPjwvcmVjdD5cblx0XHRcdDwvY2xpcHBhdGg+XG5cdFx0PC9kZWZzPlxuXHRcdDxnIGNsYXNzPSdib2lsZXJwbGF0ZScgc2hpZnRlcj0nW3ZtLm1hci5sZWZ0LCB2bS5tYXIudG9wXSc+XG5cdFx0XHQ8cmVjdCBjbGFzcz0nYmFja2dyb3VuZCcgbmctYXR0ci13aWR0aD0ne3t2bS53aWR0aH19JyBuZy1hdHRyLWhlaWdodD0ne3t2bS5oZWlnaHR9fScgbmctbW91c2Vtb3ZlPSd2bS5tb3ZlKCRldmVudCknIC8+XG5cdFx0XHQ8ZyB2ZXItYXhpcy1kZXIgd2lkdGg9J3ZtLndpZHRoJyBzY2FsZT0ndm0uVicgZnVuPSd2bS52ZXJBeEZ1bic+PC9nPlxuXHRcdFx0PGcgaG9yLWF4aXMtZGVyIGhlaWdodD0ndm0uaGVpZ2h0JyBzY2FsZT0ndm0uVCcgZnVuPSd2bS5ob3JBeEZ1bicgc2hpZnRlcj0nWzAsdm0uaGVpZ2h0XSc+PC9nPlxuXHRcdFx0PGZvcmVpZ25PYmplY3Qgd2lkdGg9JzMwJyBoZWlnaHQ9JzMwJyB5PScxNycgc2hpZnRlcj0nW3ZtLndpZHRoLzIsIHZtLmhlaWdodF0nPlxuXHRcdFx0XHRcdDx0ZXh0IGNsYXNzPSdsYWJlbCcgPiR0JDwvdGV4dD5cblx0XHRcdDwvZm9yZWlnbk9iamVjdD5cblx0XHQ8L2c+XG5cdFx0PGcgY2xhc3M9J21haW4nIGNsaXAtcGF0aD1cInVybCgjZGVyQ2xpcClcIiBzaGlmdGVyPSdbdm0ubWFyLmxlZnQsIHZtLm1hci50b3BdJz5cblx0XHRcdDxsaW5lIGNsYXNzPSd6ZXJvLWxpbmUgaG9yJyBkMy1kZXI9J3t4MTogMCwgeDI6IHZtLndpZHRoLCB5MTogdm0uVigwKSwgeTI6IHZtLlYoMCl9Jy8+XG5cdFx0XHQ8cGF0aCBuZy1hdHRyLWQ9J3t7dm0ubGluZUZ1bih2bS5kYXRhKX19JyBjbGFzcz0nZnVuIHYnIC8+XG5cdFx0XHQ8cGF0aCBuZy1hdHRyLWQ9J3t7dm0udHJpYW5nbGVEYXRhKCl9fScgY2xhc3M9J3RyaScgLz5cblx0XHRcdDxsaW5lIGNsYXNzPSd0cmkgZHYnIGQzLWRlcj0ne3gxOiB2bS5UKHZtLnBvaW50LnQpLTEsIHgyOiB2bS5UKHZtLnBvaW50LnQpLTEsIHkxOiB2bS5WKHZtLnBvaW50LnYpLCB5Mjogdm0uVigodm0ucG9pbnQudiArIHZtLnBvaW50LmR2KSl9Jy8+XG5cdFx0XHQ8Zm9yZWlnbk9iamVjdCB3aWR0aD0nMzAnIGhlaWdodD0nMzAnIHNoaWZ0ZXI9J1sodm0uVCh2bS5wb2ludC50KSAtIDE2KSwgdm0uc3RoaW5nXScgc3R5bGU9J2ZvbnQtc2l6ZTogMTNweDsgZm9udC13ZWlnaHQ6IDEwMDsnPlxuXHRcdFx0XHRcdDx0ZXh0IGNsYXNzPSdsYWJlbCcgZm9udC1zaXplPScxM3B4Jz4kXFxcXGRvdHt5fSQ8L3RleHQ+XG5cdFx0XHQ8L2ZvcmVpZ25PYmplY3Q+XG5cdFx0XHQ8Y2lyY2xlIHI9JzNweCcgIHNoaWZ0ZXI9J1t2bS5UKHZtLnBvaW50LnQpLCB2bS5WKHZtLnBvaW50LnYpXScgY2xhc3M9J3BvaW50IHYnLz5cblx0XHQ8L2c+XG5cdDwvc3ZnPlxuJycnXG5cdFx0XHRcbmNsYXNzIEN0cmxcblx0Y29uc3RydWN0b3I6IChAc2NvcGUsIEBlbCwgQHdpbmRvdyktPlxuXHRcdEBtYXIgPSBcblx0XHRcdGxlZnQ6IDMwXG5cdFx0XHR0b3A6IDIwXG5cdFx0XHRyaWdodDogMjBcblx0XHRcdGJvdHRvbTogMzVcblxuXHRcdEBWID0gZDMuc2NhbGUubGluZWFyKCkuZG9tYWluIFstMS41LDEuNV1cblx0XHRAVCA9IGQzLnNjYWxlLmxpbmVhcigpLmRvbWFpbiBbMCw2XVxuXG5cdFx0QGRhdGEgPSBEYXRhLmRhdGFcblxuXHRcdEBob3JBeEZ1biA9IGQzLnN2Zy5heGlzKClcblx0XHRcdC5zY2FsZSBAVFxuXHRcdFx0LnRpY2tzIDVcblx0XHRcdC5vcmllbnQgJ2JvdHRvbSdcblxuXHRcdEB2ZXJBeEZ1biA9IGQzLnN2Zy5heGlzKClcblx0XHRcdC5zY2FsZSBAVlxuXHRcdFx0LnRpY2tzIDVcblx0XHRcdC5vcmllbnQgJ2xlZnQnXG5cblx0XHRAbGluZUZ1biA9IGQzLnN2Zy5saW5lKClcblx0XHRcdC55IChkKT0+IEBWIGQudlxuXHRcdFx0LnggKGQpPT4gQFQgZC50XG5cblx0XHRhbmd1bGFyLmVsZW1lbnQgQHdpbmRvd1xuXHRcdFx0Lm9uICdyZXNpemUnLCBAcmVzaXplXG5cblx0XHRAbW92ZSA9IChldmVudCkgPT5cblx0XHRcdHQgPSBAVC5pbnZlcnQgZXZlbnQueCAtIGV2ZW50LnRhcmdldC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS5sZWZ0XG5cdFx0XHREYXRhLm1vdmUgdFxuXHRcdFx0QHNjb3BlLiRldmFsQXN5bmMoKVxuXG5cdEBwcm9wZXJ0eSAnc3ZnX2hlaWdodCcsIGdldDogLT4gQGhlaWdodCArIEBtYXIudG9wICsgQG1hci5ib3R0b21cblxuXHRAcHJvcGVydHkgJ3N0aGluZycsIGdldDotPlxuXHRcdEBWKEBwb2ludC5kdi8yICsgQHBvaW50LnYpIC0gN1xuXG5cdEBwcm9wZXJ0eSAncG9pbnQnLCBnZXQ6LT5cblx0XHREYXRhLnBvaW50XG5cblx0dHJpYW5nbGVEYXRhOi0+XG5cdFx0QGxpbmVGdW4gW3t2OiBAcG9pbnQudiwgdDogQHBvaW50LnR9LCB7djpAcG9pbnQuZHYgKyBAcG9pbnQudiwgdDogQHBvaW50LnQrMX0sIHt2OiBAcG9pbnQuZHYgKyBAcG9pbnQudiwgdDogQHBvaW50LnR9XVxuXG5cdHJlc2l6ZTogKCk9PlxuXHRcdEB3aWR0aCA9IEBlbFswXS5jbGllbnRXaWR0aCAtIEBtYXIubGVmdCAtIEBtYXIucmlnaHRcblx0XHRAaGVpZ2h0ID0gQGVsWzBdLmNsaWVudEhlaWdodCAtIEBtYXIudG9wIC0gQG1hci5ib3R0b20gLSA4XG5cdFx0QFYucmFuZ2UgW0BoZWlnaHQsIDBdXG5cdFx0QFQucmFuZ2UgWzAsIEB3aWR0aF1cblx0XHRAc2NvcGUuJGV2YWxBc3luYygpXG5cbmRlciA9ICgpLT5cblx0ZGlyZWN0aXZlID0gXG5cdFx0Y29udHJvbGxlckFzOiAndm0nXG5cdFx0c2NvcGU6IHt9XG5cdFx0dGVtcGxhdGU6IHRlbXBsYXRlXG5cdFx0dGVtcGxhdGVOYW1lc3BhY2U6ICdzdmcnXG5cdFx0Y29udHJvbGxlcjogWyckc2NvcGUnLCckZWxlbWVudCcsICckd2luZG93JywgQ3RybF1cblxubW9kdWxlLmV4cG9ydHMgPSBkZXJcbiIsImFuZ3VsYXIgPSByZXF1aXJlICdhbmd1bGFyJ1xuZDMgPSByZXF1aXJlICdkMydcbnJlcXVpcmUgJy4uLy4uL2hlbHBlcnMnXG5fID0gcmVxdWlyZSAnbG9kYXNoJ1xuRGF0YSA9IHJlcXVpcmUgJy4vZGVyaXZhdGl2ZURhdGEnXG5cbnRlbXBsYXRlID0gJycnXG5cdDxzdmcgbmctaW5pdD0ndm0ucmVzaXplKCknIHdpZHRoPScxMDAlJyBuZy1hdHRyLWhlaWdodD0ne3t2bS5zdmdfaGVpZ2h0fX0nPlxuXHRcdDxkZWZzPlxuXHRcdFx0PGNsaXBwYXRoIGlkPSdkZXJ2YXRpdmVCJz5cblx0XHRcdFx0PHJlY3QgbmctYXR0ci13aWR0aD0ne3t2bS53aWR0aH19JyBuZy1hdHRyLWhlaWdodD0ne3t2bS5oZWlnaHR9fSc+PC9yZWN0PlxuXHRcdFx0PC9jbGlwcGF0aD5cblx0XHQ8L2RlZnM+XG5cdFx0PGcgY2xhc3M9J2JvaWxlcnBsYXRlJyBzaGlmdGVyPSdbdm0ubWFyLmxlZnQsIHZtLm1hci50b3BdJz5cblx0XHRcdDxyZWN0IGNsYXNzPSdiYWNrZ3JvdW5kJyBuZy1hdHRyLXdpZHRoPSd7e3ZtLndpZHRofX0nIG5nLWF0dHItaGVpZ2h0PSd7e3ZtLmhlaWdodH19JyBuZy1tb3VzZW1vdmU9J3ZtLm1vdmUoJGV2ZW50KScgLz5cblx0XHRcdDxnIHZlci1heGlzLWRlciB3aWR0aD0ndm0ud2lkdGgnIHNjYWxlPSd2bS5EVicgZnVuPSd2bS52ZXJBeEZ1bic+PC9nPlxuXHRcdFx0PGcgaG9yLWF4aXMtZGVyIGhlaWdodD0ndm0uaGVpZ2h0JyBzY2FsZT0ndm0uVCcgZnVuPSd2bS5ob3JBeEZ1bicgc2hpZnRlcj0nWzAsdm0uaGVpZ2h0XSc+PC9nPlxuXHRcdFx0PGZvcmVpZ25PYmplY3Qgd2lkdGg9JzMwJyBoZWlnaHQ9JzMwJyB5PScxNycgc2hpZnRlcj0nW3ZtLndpZHRoLzIsIHZtLmhlaWdodF0nPlxuXHRcdFx0XHRcdDx0ZXh0IGNsYXNzPSdsYWJlbCcgPiR0JDwvdGV4dD5cblx0XHRcdDwvZm9yZWlnbk9iamVjdD5cblx0XHQ8L2c+XG5cdFx0PGcgY2xhc3M9J21haW4nIGNsaXAtcGF0aD1cInVybCgjZGVydmF0aXZlQilcIiBzaGlmdGVyPSdbdm0ubWFyLmxlZnQsIHZtLm1hci50b3BdJz5cblx0XHRcdDxsaW5lIGNsYXNzPSd6ZXJvLWxpbmUgaG9yJyBkMy1kZXI9J3t4MTogMCwgeDI6IHZtLndpZHRoLCB5MTogdm0uRFYoMCksIHkyOiB2bS5EVigwKX0nLz5cblx0XHRcdDxwYXRoIG5nLWF0dHItZD0ne3t2bS5saW5lRnVuKHZtLmRhdGEpfX0nIGNsYXNzPSdmdW4gZHYnIC8+XG5cdFx0XHQ8bGluZSBjbGFzcz0ndHJpIGR2JyBkMy1kZXI9J3t4MTogdm0uVCh2bS5wb2ludC50KS0xLCB4Mjogdm0uVCh2bS5wb2ludC50KS0xLCB5MTogdm0uRFYoMCksIHkyOiB2bS5EVih2bS5wb2ludC5kdil9Jy8+XG5cdFx0XHQ8Zm9yZWlnbk9iamVjdCB3aWR0aD0nMzAnIGhlaWdodD0nMzAnIHNoaWZ0ZXI9J1sodm0uVCh2bS5wb2ludC50KSAtIDE2KSwgdm0uRFYodm0ucG9pbnQuZHYqLjUpLTZdJyBzdHlsZT0nZm9udC1zaXplOiAxM3B4OyBmb250LXdlaWdodDogMTAwOyc+XG5cdFx0XHRcdFx0PHRleHQgY2xhc3M9J2xhYmVsJyBmb250LXNpemU9JzEzcHgnPiRcXFxcZG90e3l9JDwvdGV4dD5cblx0XHRcdDwvZm9yZWlnbk9iamVjdD5cblx0XHRcdDxjaXJjbGUgcj0nM3B4JyAgc2hpZnRlcj0nW3ZtLlQodm0ucG9pbnQudCksIHZtLkRWKHZtLnBvaW50LmR2KV0nIGNsYXNzPSdwb2ludCBkdicvPlxuXHRcdDwvZz5cblx0PC9zdmc+XG4nJydcblx0XHRcdFxuY2xhc3MgQ3RybFxuXHRjb25zdHJ1Y3RvcjogKEBzY29wZSwgQGVsLCBAd2luZG93KS0+XG5cdFx0QG1hciA9IFxuXHRcdFx0bGVmdDogMzBcblx0XHRcdHRvcDogMjBcblx0XHRcdHJpZ2h0OiAyMFxuXHRcdFx0Ym90dG9tOiAzNVxuXG5cdFx0QERWID0gZDMuc2NhbGUubGluZWFyKCkuZG9tYWluIFstMS41LDEuNV1cblx0XHRAVCA9IGQzLnNjYWxlLmxpbmVhcigpLmRvbWFpbiBbMCw2XVxuXG5cdFx0QGRhdGEgPSBEYXRhLmRhdGFcblxuXHRcdEBob3JBeEZ1biA9IGQzLnN2Zy5heGlzKClcblx0XHRcdC5zY2FsZSBAVFxuXHRcdFx0LnRpY2tzIDVcblx0XHRcdC5vcmllbnQgJ2JvdHRvbSdcblxuXHRcdEB2ZXJBeEZ1biA9IGQzLnN2Zy5heGlzKClcblx0XHRcdC5zY2FsZSBARFZcblx0XHRcdC50aWNrcyA1XG5cdFx0XHQub3JpZW50ICdsZWZ0J1xuXG5cdFx0QGxpbmVGdW4gPSBkMy5zdmcubGluZSgpXG5cdFx0XHQueSAoZCk9PiBARFYgZC5kdlxuXHRcdFx0LnggKGQpPT4gQFQgZC50XG5cblx0XHRhbmd1bGFyLmVsZW1lbnQgQHdpbmRvd1xuXHRcdFx0Lm9uICdyZXNpemUnLCBAcmVzaXplXG5cblx0XHRAbW92ZSA9IChldmVudCkgPT5cblx0XHRcdHQgPSBAVC5pbnZlcnQgZXZlbnQueCAtIGV2ZW50LnRhcmdldC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS5sZWZ0XG5cdFx0XHREYXRhLm1vdmUgdFxuXHRcdFx0QHNjb3BlLiRldmFsQXN5bmMoKVxuXG5cdEBwcm9wZXJ0eSAnc3ZnX2hlaWdodCcsIGdldDogLT4gQGhlaWdodCArIEBtYXIudG9wICsgQG1hci5ib3R0b21cblxuXHRAcHJvcGVydHkgJ3BvaW50JywgZ2V0Oi0+XG5cdFx0RGF0YS5wb2ludFxuXG5cdHJlc2l6ZTogKCk9PlxuXHRcdEB3aWR0aCA9IEBlbFswXS5jbGllbnRXaWR0aCAtIEBtYXIubGVmdCAtIEBtYXIucmlnaHRcblx0XHRAaGVpZ2h0ID0gQGVsWzBdLmNsaWVudEhlaWdodCAtIEBtYXIudG9wIC0gQG1hci5ib3R0b21cblx0XHRARFYucmFuZ2UgW0BoZWlnaHQsIDBdXG5cdFx0QFQucmFuZ2UgWzAsIEB3aWR0aF1cblx0XHRAc2NvcGUuJGV2YWxBc3luYygpXG5cbmRlciA9ICgpLT5cblx0ZGlyZWN0aXZlID0gXG5cdFx0Y29udHJvbGxlckFzOiAndm0nXG5cdFx0c2NvcGU6IHt9XG5cdFx0dGVtcGxhdGU6IHRlbXBsYXRlXG5cdFx0dGVtcGxhdGVOYW1lc3BhY2U6ICdzdmcnXG5cdFx0Y29udHJvbGxlcjogWyckc2NvcGUnLCckZWxlbWVudCcsICckd2luZG93JywgQ3RybF1cblxubW9kdWxlLmV4cG9ydHMgPSBkZXJcbiIsIl8gPSByZXF1aXJlICdsb2Rhc2gnXG52RnVuID0gTWF0aC5zaW5cbmR2RnVuID0gTWF0aC5jb3NcblxuY2xhc3MgRGF0YVxuXHRjb25zdHJ1Y3RvcjogLT5cblx0XHRAZGF0YSA9IF8ucmFuZ2UgMCAsIDggLCAxLzUwXG5cdFx0XHQubWFwICh0KS0+XG5cdFx0XHRcdHJlcyA9IFxuXHRcdFx0XHRcdGR2OiBkdkZ1biB0XG5cdFx0XHRcdFx0djogdkZ1biB0XG5cdFx0XHRcdFx0dDogdFxuXG5cdFx0QHBvaW50ID0gXy5zYW1wbGUgQGRhdGFcblxuXHRtb3ZlOiAodCktPlxuXHRcdEBwb2ludCA9IFxuXHRcdFx0ZHY6IGR2RnVuIHRcblx0XHRcdHY6IHZGdW4gdFxuXHRcdFx0dDogdFxuXG5tb2R1bGUuZXhwb3J0cyA9IG5ldyBEYXRhIiwiYW5ndWxhciA9IHJlcXVpcmUgJ2FuZ3VsYXInXG5kMyA9IHJlcXVpcmUgJ2QzJ1xuRGF0YSA9IHJlcXVpcmUgJy4vZGVzaWduRGF0YSdcbnJlcXVpcmUgJy4uLy4uL2hlbHBlcnMnXG50ZXh0dXJlcyA9IHJlcXVpcmUgJ3RleHR1cmVzJ1xudGVtcGxhdGUgPSAnJydcblx0PGgzPlBsb3QgQTwvaDM+XG5cdDxzdmcgbmctaW5pdD0ndm0ucmVzaXplKCknIHdpZHRoPScxMDAlJyBuZy1hdHRyLWhlaWdodD0ne3t2bS5zdmdfaGVpZ2h0fX0nPlxuXHRcdDxkZWZzPlxuXHRcdFx0PGNsaXBwYXRoIGlkPSdwbG90QSc+XG5cdFx0XHRcdDxyZWN0IG5nLWF0dHItd2lkdGg9J3t7dm0ud2lkdGh9fScgbmctYXR0ci1oZWlnaHQ9J3t7dm0uaGVpZ2h0fX0nPjwvcmVjdD5cblx0XHRcdDwvY2xpcHBhdGg+XG5cdFx0PC9kZWZzPlxuXHRcdDxnIGNsYXNzPSdib2lsZXJwbGF0ZScgc2hpZnRlcj0nW3ZtLm1hci5sZWZ0LCB2bS5tYXIudG9wXSc+XG5cdFx0XHQ8cmVjdCBjbGFzcz0nYmFja2dyb3VuZCcgbmctYXR0ci13aWR0aD0ne3t2bS53aWR0aH19JyBuZy1hdHRyLWhlaWdodD0ne3t2bS5oZWlnaHR9fScgYmVoYXZpb3I9J3ZtLmRyYWdfcmVjdCc+PC9yZWN0PlxuXHRcdFx0PGcgdmVyLWF4aXMtZGVyIHdpZHRoPSd2bS53aWR0aCcgc2NhbGU9J3ZtLlYnIGZ1bj0ndm0udmVyQXhGdW4nPjwvZz5cblx0XHRcdDxnIGhvci1heGlzLWRlciBoZWlnaHQ9J3ZtLmhlaWdodCcgc2NhbGU9J3ZtLlQnIGZ1bj0ndm0uaG9yQXhGdW4nIHNoaWZ0ZXI9J1swLHZtLmhlaWdodF0nPjwvZz5cblx0XHRcdDxnIGhvci1heGlzLWRlciBoZWlnaHQ9J3ZtLmhlaWdodCcgc2NhbGU9J3ZtLlQnIGZ1bj0ndm0uaG9yQXhGdW4nIHNoaWZ0ZXI9J1swLHZtLmhlaWdodF0nPjwvZz5cblx0XHRcdDxmb3JlaWduT2JqZWN0IHdpZHRoPSczMCcgaGVpZ2h0PSczMCcgc2hpZnRlcj0nWy0zMSwgdm0uaGVpZ2h0LzJdJz5cblx0XHRcdFx0XHQ8dGV4dCBjbGFzcz0nbGFiZWwnPiR2JDwvdGV4dD5cblx0XHRcdDwvZm9yZWlnbk9iamVjdD5cblx0XHRcdDxmb3JlaWduT2JqZWN0IHdpZHRoPSczMCcgaGVpZ2h0PSczMCcgeT0nMjAnIHNoaWZ0ZXI9J1t2bS53aWR0aC8yLCB2bS5oZWlnaHRdJz5cblx0XHRcdFx0XHQ8dGV4dCBjbGFzcz0nbGFiZWwnID4kdCQ8L3RleHQ+XG5cdFx0XHQ8L2ZvcmVpZ25PYmplY3Q+XG5cdFx0PC9nPlxuXHRcdDxnIGNsYXNzPSdtYWluJyBjbGlwLXBhdGg9XCJ1cmwoI3Bsb3RBKVwiIHNoaWZ0ZXI9J1t2bS5tYXIubGVmdCwgdm0ubWFyLnRvcF0nPlxuXHRcdFx0PGxpbmUgY2xhc3M9J3plcm8tbGluZScgZDMtZGVyPSd7eDE6IDAsIHgyOiB2bS53aWR0aCwgeTE6IHZtLlYoMCksIHkyOiB2bS5WKDApfScgLz5cblx0XHRcdDxsaW5lIGNsYXNzPSd6ZXJvLWxpbmUnIGQzLWRlcj1cInt4MTogdm0uVCgwKSwgeDI6IHZtLlQoMCksIHkxOiB2bS5oZWlnaHQsIHkyOiAwfVwiIC8+XG5cdFx0XHQ8ZyBuZy1jbGFzcz0ne2hpZGU6ICF2bS5EYXRhLnNob3d9JyA+XG5cdFx0XHRcdDxsaW5lIGNsYXNzPSd0cmkgdicgZDMtZGVyPSd7eDE6IHZtLlQodm0ucG9pbnQudCktMSwgeDI6IHZtLlQodm0ucG9pbnQudCktMSwgeTE6IHZtLlYoMCksIHkyOiB2bS5WKHZtLnBvaW50LnYpfScvPlxuXHRcdFx0XHQ8cGF0aCBuZy1hdHRyLWQ9J3t7dm0udHJpYW5nbGVEYXRhKCl9fScgY2xhc3M9J3RyaScgLz5cblx0XHRcdFx0PHBhdGggbmctYXR0ci1kPSd7e3ZtLmxpbmVGdW4oW3ZtLnBvaW50LCB7djogdm0ucG9pbnQuZHYgKyB2bS5wb2ludC52LCB0OiB2bS5wb2ludC50fV0pfX0nIGNsYXNzPSd0cmkgZHYnIC8+XG5cdFx0XHQ8L2c+XG5cdFx0XHQ8cGF0aCBuZy1hdHRyLWQ9J3t7dm0ubGluZUZ1bih2bS5EYXRhLmRhdGEpfX0nIGNsYXNzPSdmdW4gdicgLz5cblx0XHRcdDxnIG5nLXJlcGVhdD0nZG90IGluIHZtLmRvdHMgdHJhY2sgYnkgZG90LmlkJyBkYXR1bT1kb3Qgc2hpZnRlcj0nW3ZtLlQoZG90LnQpLHZtLlYoZG90LnYpXScgYmVoYXZpb3I9J3ZtLmRyYWcnIGRvdC1kZXIgPjwvZz5cblx0XHRcdDxjaXJjbGUgY2xhc3M9J2RvdCBzbWFsbCcgcj0nNCcgc2hpZnRlcj0nW3ZtLlQodm0uRGF0YS5maXJzdC50KSx2bS5WKHZtLkRhdGEuZmlyc3QudildJyAvPlxuXHRcdDwvZz5cblx0PC9zdmc+XG4nJydcblxuXG5jbGFzcyBDdHJsXG5cdGNvbnN0cnVjdG9yOiAoQHNjb3BlLCBAZWwsIEB3aW5kb3cpLT5cblx0XHRAbWFyID0gXG5cdFx0XHRsZWZ0OiAzMFxuXHRcdFx0dG9wOiAxMFxuXHRcdFx0cmlnaHQ6IDIwXG5cdFx0XHRib3R0b206IDM3XG5cblx0XHRAViA9IGQzLnNjYWxlLmxpbmVhcigpLmRvbWFpbiBbLS4yNSw1XVxuXG5cdFx0QFQgPSBkMy5zY2FsZS5saW5lYXIoKS5kb21haW4gWy0uMjUsNV1cblx0XHR0ID0gdGV4dHVyZXMubGluZXMoKVxuXHRcdFx0Lm9yaWVudGF0aW9uKFwiMy84XCIsIFwiNy84XCIpXG5cdFx0XHQuc2l6ZSg1KVxuXHRcdFx0LnN0cm9rZSgnI0U2RTZFNicpXG5cdFx0ICAgIC5zdHJva2VXaWR0aCgxKVxuXG5cdFx0ZDMuc2VsZWN0IEBlbFswXVxuXHRcdFx0LnNlbGVjdCAnc3ZnJ1xuXHRcdFx0LmNhbGwgdFxuXG5cdFx0ZDMuc2VsZWN0IEBlbFswXVxuXHRcdFx0LnNlbGVjdCAncmVjdC5iYWNrZ3JvdW5kJ1xuXHRcdFx0LnN0eWxlICdmaWxsJywgdC51cmwoKVxuXG5cdFx0QERhdGEgPSBEYXRhXG5cblx0XHRAaG9yQXhGdW4gPSBkMy5zdmcuYXhpcygpXG5cdFx0XHQuc2NhbGUgQFRcblx0XHRcdC50aWNrcyA1XG5cdFx0XHQub3JpZW50ICdib3R0b20nXG5cblx0XHRAdmVyQXhGdW4gPSBkMy5zdmcuYXhpcygpXG5cdFx0XHQuc2NhbGUgQFZcblx0XHRcdC50aWNrcyA1XG5cdFx0XHQub3JpZW50ICdsZWZ0J1xuXHRcdFxuXHRcdEBsaW5lRnVuID0gZDMuc3ZnLmxpbmUoKVxuXHRcdFx0LnkgKGQpPT4gQFYgZC52XG5cdFx0XHQueCAoZCk9PiBAVCBkLnRcblxuXHRcdEBkcmFnX3JlY3QgPSBkMy5iZWhhdmlvci5kcmFnKClcblx0XHRcdC5vbiAnZHJhZ3N0YXJ0JywgKCk9PlxuXHRcdFx0XHREYXRhLnNob3c9IHRydWVcblx0XHRcdFx0ZXZlbnQuc3RvcFByb3BhZ2F0aW9uKClcblx0XHRcdFx0aWYgZXZlbnQud2hpY2ggaXMgM1xuXHRcdFx0XHRcdHJldHVybiBldmVudC5wcmV2ZW50RGVmYXVsdCgpXG5cdFx0XHRcdHJlY3QgPSBldmVudC50b0VsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KClcblx0XHRcdFx0dCA9IEBULmludmVydCBldmVudC54IC0gcmVjdC5sZWZ0XG5cdFx0XHRcdHYgID0gQFYuaW52ZXJ0IGV2ZW50LnkgLSByZWN0LnRvcFxuXHRcdFx0XHREYXRhLmFkZF9kb3QgdCAsIHZcblx0XHRcdFx0QHNjb3BlLiRldmFsQXN5bmMoKVxuXHRcdFx0Lm9uICdkcmFnJywgPT4gQG9uX2RyYWcoRGF0YS5zZWxlY3RlZClcblx0XHRcdC5vbiAnZHJhZ2VuZCcsID0+IFxuXHRcdFx0XHREYXRhLnNob3cgPSBmYWxzZVxuXHRcdFx0XHRAc2NvcGUuJGV2YWxBc3luYygpXG5cblx0XHRAZHJhZyA9IGQzLmJlaGF2aW9yLmRyYWcoKVxuXHRcdFx0Lm9uICdkcmFnc3RhcnQnLCAoZG90KT0+XG5cdFx0XHRcdERhdGEuc2hvdyA9IHRydWVcblx0XHRcdFx0ZXZlbnQuc3RvcFByb3BhZ2F0aW9uKClcblx0XHRcdFx0aWYgZXZlbnQud2hpY2ggaXMgM1xuXHRcdFx0XHRcdERhdGEucmVtb3ZlX2RvdCBkb3Rcblx0XHRcdFx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpXG5cdFx0XHRcdFx0QHNjb3BlLiRldmFsQXN5bmMoKVxuXHRcdFx0Lm9uICdkcmFnJywgQG9uX2RyYWdcblx0XHRcdC5vbiAnZHJhZ2VuZCcsID0+IFxuXHRcdFx0XHREYXRhLnNob3cgPSBmYWxzZVxuXHRcdFx0XHRAc2NvcGUuJGV2YWxBc3luYygpXG5cblx0XHRhbmd1bGFyLmVsZW1lbnQgQHdpbmRvd1xuXHRcdFx0Lm9uICdyZXNpemUnLCBAcmVzaXplXG5cblx0QHByb3BlcnR5ICdzdmdfaGVpZ2h0JywgZ2V0OiAtPiBAaGVpZ2h0ICsgQG1hci50b3AgKyBAbWFyLmJvdHRvbVxuXG5cdEBwcm9wZXJ0eSAnZG90cycsIGdldDotPiBcblx0XHRyZXMgPSBEYXRhLmRvdHMuZmlsdGVyIChkKS0+XG5cdFx0XHRkLmlkICE9ICdmaXJzdCdcblxuXHRvbl9kcmFnOiAoZG90KT0+IFxuXHRcdFx0aWYgZXZlbnQud2hpY2ggaXMgM1xuXHRcdFx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpXG5cdFx0XHRcdHJldHVyblxuXHRcdFx0RGF0YS51cGRhdGVfZG90IGRvdCwgQFQuaW52ZXJ0KGQzLmV2ZW50LngpLCBAVi5pbnZlcnQoZDMuZXZlbnQueSlcblx0XHRcdEBzY29wZS4kZXZhbEFzeW5jKClcblxuXHRAcHJvcGVydHkgJ3BvaW50JywgZ2V0OiAtPiBEYXRhLnNlbGVjdGVkXG5cblx0dHJpYW5nbGVEYXRhOi0+XG5cdFx0cG9pbnQgPSBEYXRhLnNlbGVjdGVkXG5cdFx0QGxpbmVGdW4gW3t2OiBwb2ludC52LCB0OiBwb2ludC50fSwge3Y6cG9pbnQuZHYgKyBwb2ludC52LCB0OiBwb2ludC50KzF9LCB7djogcG9pbnQuZHYgKyBwb2ludC52LCB0OiBwb2ludC50fV1cblxuXHRyZXNpemU6ICgpPT5cblx0XHRAd2lkdGggPSBAZWxbMF0uY2xpZW50V2lkdGggLSBAbWFyLmxlZnQgLSBAbWFyLnJpZ2h0XG5cdFx0QGhlaWdodCA9IEB3aWR0aFxuXHRcdEBWLnJhbmdlIFtAaGVpZ2h0LCAwXVxuXHRcdEBULnJhbmdlIFswLCBAd2lkdGhdXG5cdFx0QHNjb3BlLiRldmFsQXN5bmMoKVxuXG5cbmRlciA9ICgpLT5cblx0ZGlyZWN0aXZlID0gXG5cdFx0Y29udHJvbGxlckFzOiAndm0nXG5cdFx0c2NvcGU6IHt9XG5cdFx0dGVtcGxhdGU6IHRlbXBsYXRlXG5cdFx0dGVtcGxhdGVOYW1lc3BhY2U6ICdzdmcnXG5cdFx0Y29udHJvbGxlcjogWyckc2NvcGUnLCckZWxlbWVudCcsICckd2luZG93JywgQ3RybF1cblxubW9kdWxlLmV4cG9ydHMgPSBkZXJcbiIsIkRhdGEgPSByZXF1aXJlICcuL2Rlc2lnbkRhdGEnXG5hbmd1bGFyID0gcmVxdWlyZSAnYW5ndWxhcidcbmQzID0gcmVxdWlyZSAnZDMnXG5yZXF1aXJlICcuLi8uLi9oZWxwZXJzJ1xuXG50ZW1wbGF0ZSA9ICcnJ1xuXHQ8aDM+UGxvdCBCPC9oMz5cblx0PHN2ZyBuZy1pbml0PSd2bS5yZXNpemUoKScgIHdpZHRoPScxMDAlJyBuZy1hdHRyLWhlaWdodD0ne3t2bS5zdmdfaGVpZ2h0fX0nPlxuXHRcdDxkZWZzPlxuXHRcdFx0PGNsaXBwYXRoIGlkPSdwbG90Qic+XG5cdFx0XHRcdDxyZWN0IG5nLWF0dHItd2lkdGg9J3t7dm0ud2lkdGh9fScgbmctYXR0ci1oZWlnaHQ9J3t7dm0uaGVpZ2h0fX0nPjwvcmVjdD5cblx0XHRcdDwvY2xpcHBhdGg+XG5cdFx0PC9kZWZzPlxuXHRcdDxnIGNsYXNzPSdib2lsZXJwbGF0ZScgc2hpZnRlcj0nW3ZtLm1hci5sZWZ0LCB2bS5tYXIudG9wXSc+XG5cdFx0XHQ8cmVjdCBjbGFzcz0nYmFja2dyb3VuZCcgbmctYXR0ci13aWR0aD0ne3t2bS53aWR0aH19JyBuZy1hdHRyLWhlaWdodD0ne3t2bS5oZWlnaHR9fSc+PC9yZWN0PlxuXHRcdFx0PGcgdmVyLWF4aXMtZGVyIHdpZHRoPSd2bS53aWR0aCcgc2NhbGU9J3ZtLkRWJyBmdW49J3ZtLnZlckF4RnVuJz48L2c+XG5cdFx0XHQ8ZyBob3ItYXhpcy1kZXIgaGVpZ2h0PSd2bS5oZWlnaHQnIHNjYWxlPSd2bS5WJyBmdW49J3ZtLmhvckF4RnVuJyBzaGlmdGVyPSdbMCx2bS5oZWlnaHRdJz48L2c+XG5cdFx0XHQ8Zm9yZWlnbk9iamVjdCB3aWR0aD0nMzAnIGhlaWdodD0nMzAnIHNoaWZ0ZXI9J1stMzEsIHZtLmhlaWdodC8yXSc+XG5cdFx0XHRcdFx0PHRleHQgY2xhc3M9J2xhYmVsJz4kXFxcXGRvdHt2fSQ8L3RleHQ+XG5cdFx0XHQ8L2ZvcmVpZ25PYmplY3Q+XG5cdFx0XHQ8Zm9yZWlnbk9iamVjdCB3aWR0aD0nMzAnIGhlaWdodD0nMzAnIHk9JzIwJyBzaGlmdGVyPSdbdm0ud2lkdGgvMiwgdm0uaGVpZ2h0XSc+XG5cdFx0XHRcdFx0PHRleHQgY2xhc3M9J2xhYmVsJyA+JHYkPC90ZXh0PlxuXHRcdFx0PC9mb3JlaWduT2JqZWN0PlxuXHRcdDwvZz5cblx0XHQ8ZyBjbGFzcz0nbWFpbicgY2xpcC1wYXRoPVwidXJsKCNwbG90QilcIiBzaGlmdGVyPSdbdm0ubWFyLmxlZnQsIHZtLm1hci50b3BdJz5cblx0XHRcdDxsaW5lIGNsYXNzPSd6ZXJvLWxpbmUnIGQzLWRlcj0ne3gxOiAwLCB4Mjogdm0ud2lkdGgsIHkxOiB2bS5EVigwKSwgeTI6IHZtLkRWKDApfScgLz5cblx0XHRcdDxsaW5lIGNsYXNzPSd6ZXJvLWxpbmUnIGQzLWRlcj1cInt4MTogdm0uVigwKSwgeDI6IHZtLlYoMCksIHkxOiB2bS5oZWlnaHQsIHkyOiAwfVwiIC8+XG5cdFx0XHQ8cGF0aCBuZy1hdHRyLWQ9J3t7dm0ubGluZUZ1bih2bS5EYXRhLnRhcmdldF9kYXRhKX19JyBjbGFzcz0nZnVuIHRhcmdldCcgLz5cblx0XHRcdDxnIG5nLWNsYXNzPSd7aGlkZTogIXZtLkRhdGEuc2hvd30nID5cblx0XHRcdFx0PGxpbmUgY2xhc3M9J3RyaSB2JyBkMy1kZXI9J3t4MTogdm0uVigwKSwgeDI6IHZtLlYodm0ucG9pbnQudiksIHkxOiB2bS5EVih2bS5wb2ludC5kdiksIHkyOiB2bS5EVih2bS5wb2ludC5kdil9Jy8+XG5cdFx0XHRcdDxsaW5lIGNsYXNzPSd0cmkgZHYnIGQzLWRlcj0ne3gxOiB2bS5WKHZtLnBvaW50LnYpLCB4Mjogdm0uVih2bS5wb2ludC52KSwgeTE6IHZtLkRWKDApLCB5Mjogdm0uRFYodm0ucG9pbnQuZHYpfScvPlxuXHRcdFx0XHQ8cGF0aCBuZy1hdHRyLWQ9J3t7dm0ubGluZUZ1bih2bS5EYXRhLnRhcmdldF9kYXRhKX19JyBjbGFzcz0nZnVuIGNvcnJlY3QnIG5nLWNsYXNzPSd7aGlkZTogIXZtLkRhdGEuY29ycmVjdH0nIC8+XG5cdFx0XHQ8L2c+XG5cdFx0XHQ8ZyBuZy1yZXBlYXQ9J2RvdCBpbiB2bS5kb3RzIHRyYWNrIGJ5IGRvdC5pZCcgc2hpZnRlcj0nW3ZtLlYoZG90LnYpLHZtLkRWKGRvdC5kdildJyBkb3QtYi1kZXI+PC9nPlxuXHRcdDwvZz5cblx0PC9zdmc+XG4nJydcblxuY2xhc3MgQ3RybFxuXHRjb25zdHJ1Y3RvcjogKEBzY29wZSwgQGVsLCBAd2luZG93KS0+XG5cdFx0QG1hciA9IFxuXHRcdFx0bGVmdDogMzBcblx0XHRcdHRvcDogMTBcblx0XHRcdHJpZ2h0OiAyMFxuXHRcdFx0Ym90dG9tOiAzN1xuXG5cdFx0QERWID0gZDMuc2NhbGUubGluZWFyKCkuZG9tYWluIFstNSwgLjI1XVxuXG5cdFx0QFYgPSBkMy5zY2FsZS5saW5lYXIoKS5kb21haW4gWy0uMjUsNF1cblxuXHRcdEBob3JBeEZ1biA9IGQzLnN2Zy5heGlzKClcblx0XHRcdC5zY2FsZSBAVlxuXHRcdFx0LnRpY2tzIDRcblx0XHRcdC5vcmllbnQgJ2JvdHRvbSdcblxuXHRcdEB2ZXJBeEZ1biA9IGQzLnN2Zy5heGlzKClcblx0XHRcdC5zY2FsZSBARFZcblx0XHRcdC50aWNrcyA1XG5cdFx0XHQub3JpZW50ICdsZWZ0J1xuXG5cdFx0QERhdGEgPSBEYXRhXG5cblx0XHRAbGluZUZ1biA9IGQzLnN2Zy5saW5lKClcblx0XHRcdC55IChkKT0+IEBEViBkLmR2XG5cdFx0XHQueCAoZCk9PiBAViBkLnZcblxuXHRcdGFuZ3VsYXIuZWxlbWVudCBAd2luZG93XG5cdFx0XHQub24gJ3Jlc2l6ZScsIEByZXNpemVcblxuXHRAcHJvcGVydHkgJ3N2Z19oZWlnaHQnLCBnZXQ6IC0+IEBoZWlnaHQgKyBAbWFyLnRvcCArIEBtYXIuYm90dG9tXG5cblx0QHByb3BlcnR5ICdkb3RzJywgZ2V0Oi0+XG5cdFx0RGF0YS5kb3RzXG5cdFx0XHQuZmlsdGVyIChkKS0+IGQuaWQgIT0nZmlyc3QnXG5cblx0aGlsaXRlOiAodiktPlxuXHRcdGQzLnNlbGVjdCB0aGlzXG5cdFx0XHQudHJhbnNpdGlvbigpXG5cdFx0XHQuZHVyYXRpb24gMTAwXG5cdFx0XHQuZWFzZSAnY3ViaWMnXG5cdFx0XHQuYXR0ciAncicgLCBpZiB2IHRoZW4gNiBlbHNlIDRcblxuXHRAcHJvcGVydHkgJ3BvaW50JywgZ2V0OiAtPiBEYXRhLnNlbGVjdGVkXG5cblx0cmVzaXplOiAoKT0+XG5cdFx0QHdpZHRoID0gQGVsWzBdLmNsaWVudFdpZHRoIC0gQG1hci5sZWZ0IC0gQG1hci5yaWdodFxuXHRcdEBoZWlnaHQgPSBAd2lkdGhcblx0XHRARFYucmFuZ2UgW0BoZWlnaHQsIDBdXG5cdFx0QFYucmFuZ2UgWzAsIEB3aWR0aF0gXG5cdFx0QHNjb3BlLiRldmFsQXN5bmMoKVxuXG5cbmRlciA9ICgpLT5cblx0ZGlyZWN0aXZlID0gXG5cdFx0Y29udHJvbGxlckFzOiAndm0nXG5cdFx0c2NvcGU6IHt9XG5cdFx0dGVtcGxhdGU6IHRlbXBsYXRlXG5cdFx0dGVtcGxhdGVOYW1lc3BhY2U6ICdzdmcnXG5cdFx0Y29udHJvbGxlcjogWyckc2NvcGUnLCckZWxlbWVudCcsJyR3aW5kb3cnLCBDdHJsXVxuXG5tb2R1bGUuZXhwb3J0cyA9IGRlclxuIiwiXyA9IHJlcXVpcmUgJ2xvZGFzaCdcbmQzPSByZXF1aXJlICdkMydcbnttaW59ID0gTWF0aFxuRGF0YSA9IHJlcXVpcmUgJy4vZGVzaWduRGF0YSdcbnJlcXVpcmUgJy4uLy4uL2hlbHBlcnMnXG5cbnRlbXBsYXRlID0gJycnXG5cdDxtZC1zbGlkZXIgZmxleCBtaW49XCIwXCIgbWF4PVwiNVwiIHN0ZXA9JzAuMDI1JyBuZy1tb2RlbD1cInZtLkRhdGEudFwiIGFyaWEtbGFiZWw9XCJyZWRcIiBpZD1cInJlZC1zbGlkZXJcIj48L21kLXNsaWRlcj5cblx0e3t2bS5EYXRhLnQgfCBudW1iZXI6IDJ9fVxuXHQ8c3ZnIG5nLWluaXQ9J3ZtLnJlc2l6ZSgpJyB3aWR0aD0nMTAwJScgbmctYXR0ci1oZWlnaHQ9J3t7dm0uc3ZnX2hlaWdodH19Jz5cblx0XHQ8ZyBzaGlmdGVyPSd7ezo6W3ZtLm1hci5sZWZ0LCB2bS5tYXIudG9wXX19Jz5cblx0XHRcdDxyZWN0IG5nLWF0dHItd2lkdGg9J3t7dm0ud2lkdGh9fScgbmctYXR0ci1oZWlnaHQ9J3t7dm0uaGVpZ2h0fX0nIGNsYXNzPSdiYWNrZ3JvdW5kJy8+XG5cdFx0XHQ8ZyBob3ItYXhpcy1kZXIgaGVpZ2h0PSd2bS5oZWlnaHQnIHNjYWxlPSd2bS5YJyBmdW49J3ZtLmF4aXNGdW4nIHNoaWZ0ZXI9J1swLHZtLmhlaWdodF0nPjwvZz5cblx0XHRcdDxmb3JlaWduT2JqZWN0IHdpZHRoPSczMCcgaGVpZ2h0PSczMCcgeT0nMjAnIHNoaWZ0ZXI9J1t2bS53aWR0aC8yLCB2bS5oZWlnaHRdJz5cblx0XHRcdFx0XHQ8dGV4dCBjbGFzcz0nbGFiZWwnID4kdCQ8L3RleHQ+XG5cdFx0XHQ8L2ZvcmVpZ25PYmplY3Q+XG5cdFx0XHQ8ZyBjbGFzcz0nZy1jYXJ0JyBkMy1kZXI9J3t0cmFuc2Zvcm06IFwidHJhbnNsYXRlKFwiICsgdm0uWCh2bS5EYXRhLngpICsgXCIsMClcIn0nIHRyYW49XCJ2bS50cmFuXCI+XG5cdFx0XHRcdDxyZWN0IGNsYXNzPSdjYXJ0JyB4PSctMTIuNScgd2lkdGg9JzI1JyBuZy1hdHRyLXk9J3t7dm0uaGVpZ2h0LzItMTIuNX19JyBoZWlnaHQ9JzI1Jy8+XG5cdFx0XHQ8L2c+XG5cdFx0PC9nPlxuXHQ8L3N2Zz5cbicnJ1xuXG5jbGFzcyBDdHJsXG5cdGNvbnN0cnVjdG9yOiAoQHNjb3BlLCBAZWwsIEB3aW5kb3cpLT5cblx0XHRARGF0YSA9IERhdGFcblx0XHRAbWFyID0gXG5cdFx0XHRsZWZ0OiAzMFxuXHRcdFx0cmlnaHQ6IDEwXG5cdFx0XHR0b3A6IDEwXG5cdFx0XHRib3R0b206IDE4XG5cdFx0QFggPSBkMy5zY2FsZS5saW5lYXIoKS5kb21haW4gWy0uMjUsNV0gXG5cblx0XHRAYXhpc0Z1biA9IGQzLnN2Zy5heGlzKClcblx0XHRcdC5zY2FsZSBAWFxuXHRcdFx0LnRpY2tzIDVcblx0XHRcdC5vcmllbnQgJ2JvdHRvbSdcblxuXHRcdEBzY29wZS4kd2F0Y2ggLT4gXG5cdFx0XHRcdERhdGEubWF4WFxuXHRcdFx0LCAodik9PlxuXHRcdFx0XHRAWC5kb21haW4gWy0uMjUsIHYrMV1cblxuXHRcdEB0cmFuID0gKHRyYW4pLT5cblx0XHRcdHRyYW4uZWFzZSAnY3ViaWMnXG5cdFx0XHRcdC5kdXJhdGlvbiA2MFxuXG5cdFx0YW5ndWxhci5lbGVtZW50IEB3aW5kb3dcblx0XHRcdC5vbiAncmVzaXplJyAsIEByZXNpemVcblxuXHRAcHJvcGVydHkgJ3N2Z19oZWlnaHQnICwgZ2V0Oi0+IEBoZWlnaHQgKyBAbWFyLnRvcCArIEBtYXIuYm90dG9tXG5cblx0cmVzaXplOiAoKT0+XG5cdFx0QHdpZHRoID0gQGVsWzBdLmNsaWVudFdpZHRoIC0gQG1hci5sZWZ0IC0gQG1hci5yaWdodFxuXHRcdEBoZWlnaHQgPSBAd2lkdGgqLjEgLSBAbWFyLnRvcCAtIEBtYXIuYm90dG9tXG5cdFx0QFgucmFuZ2UgWzAsIEB3aWR0aF1cblx0XHRAc2NvcGUuJGV2YWxBc3luYygpXG5cbmRlciA9ICgpLT5cblx0ZGlyZWN0aXZlID0gXG5cdFx0dGVtcGxhdGU6IHRlbXBsYXRlXG5cdFx0c2NvcGU6IHt9XG5cdFx0cmVzdHJpY3Q6ICdBJ1xuXHRcdGJpbmRUb0NvbnRyb2xsZXI6IHRydWVcblx0XHR0ZW1wbGF0ZU5hbWVzcGFjZTogJ3N2Zydcblx0XHRjb250cm9sbGVyOiBbJyRzY29wZScsICckZWxlbWVudCcsICckd2luZG93JywgQ3RybF1cblx0XHRjb250cm9sbGVyQXM6ICd2bSdcblxubW9kdWxlLmV4cG9ydHMgPSBkZXJcbiIsIl8gPSByZXF1aXJlICdsb2Rhc2gnXG5kMz0gcmVxdWlyZSAnZDMnXG57bWlufSA9IE1hdGhcbkRhdGEgPSByZXF1aXJlICcuL2Rlc2lnbkRhdGEnXG5yZXF1aXJlICcuLi8uLi9oZWxwZXJzJ1xuXG50ZW1wbGF0ZSA9ICcnJ1xuXHQ8c3ZnIG5nLWluaXQ9J3ZtLnJlc2l6ZSgpJyB3aWR0aD0nMTAwJScgbmctYXR0ci1oZWlnaHQ9J3t7dm0uc3ZnX2hlaWdodH19Jz5cblx0XHQ8ZyBzaGlmdGVyPSd7ezo6W3ZtLm1hci5sZWZ0LCB2bS5tYXIudG9wXX19Jz5cblx0XHRcdDxyZWN0IG5nLWF0dHItd2lkdGg9J3t7dm0ud2lkdGh9fScgbmctYXR0ci1oZWlnaHQ9J3t7dm0uaGVpZ2h0fX0nIGNsYXNzPSdiYWNrZ3JvdW5kJy8+XG5cdFx0XHQ8ZyBob3ItYXhpcy1kZXIgaGVpZ2h0PSd2bS5oZWlnaHQnIHNjYWxlPSd2bS5YJyBmdW49J3ZtLmF4aXNGdW4nIHNoaWZ0ZXI9J1swLHZtLmhlaWdodF0nPjwvZz5cblx0XHRcdDxmb3JlaWduT2JqZWN0IHdpZHRoPSczMCcgaGVpZ2h0PSczMCcgeT0nMjAnIHNoaWZ0ZXI9J1t2bS53aWR0aC8yLCB2bS5oZWlnaHRdJz5cblx0XHRcdFx0XHQ8dGV4dCBjbGFzcz0nbGFiZWwnID4kdCQ8L3RleHQ+XG5cdFx0XHQ8L2ZvcmVpZ25PYmplY3Q+XG5cdFx0XHQ8ZyBjbGFzcz0nZy1jYXJ0JyBkMy1kZXI9J3t0cmFuc2Zvcm06IFwidHJhbnNsYXRlKFwiICsgdm0uWCh2bS5EYXRhLnRydWVfeCkgKyBcIiwwKVwifScgdHJhbj1cInZtLnRyYW5cIj5cblx0XHRcdFx0PHJlY3QgY2xhc3M9J2NhcnQnIHg9Jy0xMi41JyB3aWR0aD0nMjUnIG5nLWF0dHIteT0ne3t2bS5oZWlnaHQvMi0xMi41fX0nIGhlaWdodD0nMjUnLz5cblx0XHRcdDwvZz5cblx0XHQ8L2c+XG5cdDwvc3ZnPlxuJycnXG5cbmNsYXNzIEN0cmxcblx0Y29uc3RydWN0b3I6IChAc2NvcGUsIEBlbCwgQHdpbmRvdyktPlxuXHRcdEBEYXRhID0gRGF0YVxuXHRcdEBtYXIgPSBcblx0XHRcdGxlZnQ6IDMwXG5cdFx0XHRyaWdodDogMTBcblx0XHRcdHRvcDogMTBcblx0XHRcdGJvdHRvbTogMThcblx0XHRAWCA9IGQzLnNjYWxlLmxpbmVhcigpLmRvbWFpbiBbLS4yNSw1XSBcblxuXHRcdEBheGlzRnVuID0gZDMuc3ZnLmF4aXMoKVxuXHRcdFx0LnNjYWxlIEBYXG5cdFx0XHQudGlja3MgNVxuXHRcdFx0Lm9yaWVudCAnYm90dG9tJ1xuXG5cdFx0QHNjb3BlLiR3YXRjaCAtPiBcblx0XHRcdFx0RGF0YS5tYXhYXG5cdFx0XHQsICh2KT0+XG5cdFx0XHRcdEBYLmRvbWFpbiBbLS4yNSwgdisxXVxuXG5cdFx0QHRyYW4gPSAodHJhbiktPlxuXHRcdFx0dHJhbi5lYXNlICdjdWJpYydcblx0XHRcdFx0LmR1cmF0aW9uIDYwXG5cblx0XHRhbmd1bGFyLmVsZW1lbnQgQHdpbmRvd1xuXHRcdFx0Lm9uICdyZXNpemUnICwgQHJlc2l6ZVxuXG5cdEBwcm9wZXJ0eSAnc3ZnX2hlaWdodCcgLCBnZXQ6LT4gQGhlaWdodCArIEBtYXIudG9wICsgQG1hci5ib3R0b21cblxuXHRyZXNpemU6ICgpPT5cblx0XHRAd2lkdGggPSBAZWxbMF0uY2xpZW50V2lkdGggLSBAbWFyLmxlZnQgLSBAbWFyLnJpZ2h0XG5cdFx0QGhlaWdodCA9IEB3aWR0aCouMSAtIEBtYXIudG9wIC0gQG1hci5ib3R0b21cblx0XHRAWC5yYW5nZSBbMCwgQHdpZHRoXVxuXHRcdEBzY29wZS4kZXZhbEFzeW5jKClcblxuZGVyID0gKCktPlxuXHRkaXJlY3RpdmUgPSBcblx0XHR0ZW1wbGF0ZTogdGVtcGxhdGVcblx0XHRzY29wZToge31cblx0XHRyZXN0cmljdDogJ0EnXG5cdFx0YmluZFRvQ29udHJvbGxlcjogdHJ1ZVxuXHRcdHRlbXBsYXRlTmFtZXNwYWNlOiAnc3ZnJ1xuXHRcdGNvbnRyb2xsZXI6IFsnJHNjb3BlJywgJyRlbGVtZW50JywgJyR3aW5kb3cnLCBDdHJsXVxuXHRcdGNvbnRyb2xsZXJBczogJ3ZtJ1xuXG5tb2R1bGUuZXhwb3J0cyA9IGRlclxuIiwiXyA9IHJlcXVpcmUgJ2xvZGFzaCdcbnJlcXVpcmUgJy4uLy4uL2hlbHBlcnMnXG57ZXhwLCBzcXJ0LCBhdGFuLCBtaW4sIG1heH0gPSBNYXRoXG5cbnZTY2FsZSA9IGQzLnNjYWxlLmxpbmVhcigpXG54U2NhbGUgPSBkMy5zY2FsZS5saW5lYXIoKVxuIyB0cnVlWFNjYWxlID0gZDMuc2NhbGUubGluZWFyKClcbmNsYXNzIERvdFxuXHRjb25zdHJ1Y3RvcjogKEB0LCBAdiktPlxuXHRcdEBpZCA9IF8udW5pcXVlSWQgJ2RvdCdcblx0XHRAaGlsaXRlZCA9IGZhbHNlXG5cbmNsYXNzIFNlcnZpY2Vcblx0Y29uc3RydWN0b3I6ICgpLT5cblx0XHRAdCA9IDBcblx0XHRAeCA9IDBcblx0XHRmaXJzdERvdCA9IG5ldyBEb3QgMCAsIDRcblx0XHRmaXJzdERvdC5pZCA9ICdmaXJzdCdcblx0XHRAZG90cyA9IFsgZmlyc3REb3QsIFxuXHRcdFx0bmV3IERvdCggLjMsIDQqZXhwKC0uMykpLFxuXHRcdFx0IyBsYXN0RG90XG5cdFx0IF1cblx0XHRAY29ycmVjdCA9IGZhbHNlXG5cblx0XHRAZmlyc3QgPSBmaXJzdERvdFxuXG5cdFx0QHNlbGVjdGVkID0gZmlyc3REb3Rcblx0XHRAc2hvdyA9IGZhbHNlXG5cdFx0QHRhcmdldF9kYXRhID0gXy5yYW5nZSAwLCA1LCAxLzUwXG5cdFx0XHQubWFwICh0KS0+IFxuXHRcdFx0XHRyZXMgID0gXG5cdFx0XHRcdFx0dDogdFxuXHRcdFx0XHRcdHY6IDQqIGV4cCgtdClcblx0XHRcdFx0XHRkdjogLTQgKiBleHAoLXQpXG5cdFx0QGRhdGEgPSBfLnJhbmdlIDAsIDUsIDEvNTBcblx0XHRcdC5tYXAgKHQpLT5cblx0XHRcdFx0cmVzID0gXG5cdFx0XHRcdFx0dDogdFxuXHRcdFx0XHRcdHY6IDBcblx0XHRcdFx0XHR4OiAwXG5cdFx0eFNjYWxlLmRvbWFpbiBfLnBsdWNrIEBkYXRhLCAndCdcblx0XHRAdXBkYXRlX2RvdHMoKVxuXG5cdGFkZF9kb3Q6ICh0LCB2KS0+XG5cdFx0QHNlbGVjdGVkID0gbmV3IERvdCB0LHZcblx0XHRAZG90cy5wdXNoIEBzZWxlY3RlZFxuXHRcdEB1cGRhdGVfZG90KEBzZWxlY3RlZCwgdCwgdilcblxuXHRyZW1vdmVfZG90OiAoZG90KS0+XG5cdFx0QGRvdHMuc3BsaWNlIEBkb3RzLmluZGV4T2YoZG90KSwgMVxuXHRcdEB1cGRhdGVfZG90cygpXG5cblx0dXBkYXRlX2RvdHM6IC0+IFxuXHRcdEBkb3RzLnNvcnQgKGEsYiktPiBhLnQgLSBiLnRcblx0XHRkb21haW4gPSBfLnBsdWNrKCBAZG90cywgJ3QnKVxuXHRcdGRvbWFpbi5wdXNoKDYuNSlcblx0XHRyYW5nZSA9IF8ucGx1Y2soIEBkb3RzICwgJ3YnKVxuXHRcdHJhbmdlLnB1c2goQGRvdHNbQGRvdHMubGVuZ3RoIC0gMV0udilcblx0XHR2U2NhbGUuZG9tYWluIGRvbWFpblxuXHRcdFx0LnJhbmdlIHJhbmdlXG5cblx0XHRAZGF0YS5mb3JFYWNoIChkLGksayktPlxuXHRcdFx0ZC52ID0gdlNjYWxlIGQudFxuXHRcdFx0aWYgaSA+IDBcblx0XHRcdFx0cHJldiA9IGtbaS0xXVxuXHRcdFx0XHRkLnggPSBwcmV2LnggKyAocHJldi52ICsgZC52KS8yKihkLnQtcHJldi50KVxuXHRcdFx0ZWxzZVxuXHRcdFx0XHRkLnggPSAwXG5cblx0XHR4U2NhbGUucmFuZ2UgXy5wbHVjayBAZGF0YSwgJ3gnXG5cblx0XHRAZG90cy5mb3JFYWNoIChkb3QsIGksIGspLT5cblx0XHRcdHByZXYgPSBrW2ktMV1cblx0XHRcdGlmIHByZXZcblx0XHRcdFx0ZHQgPSBkb3QudCAtIHByZXYudFxuXHRcdFx0XHQjIGlmIDAgPCBkdCA8IC4wMDAxIHRoZW4gZG90LnQgKz0gLjAwMDFcblx0XHRcdFx0IyBpZiAtLjAwMDEgPCBkdCA8PSAwIHRoZW4gZG90LnQgLT0gLjAwMDFcblx0XHRcdFx0IyBkdCA9IGRvdC50IC0gcHJldi50XG5cdFx0XHRcdGRvdC54ID0gcHJldi54ICsgZHQgKiAoZG90LnYgKyBwcmV2LnYpLzJcblx0XHRcdFx0ZG90LmR2ID0gKGRvdC52IC0gcHJldi52KS9tYXgoZHQsIC4wMDAxKVxuXHRcdFx0ZWxzZVxuXHRcdFx0XHRkb3QueCA9IDBcblx0XHRcdFx0ZG90LmR2ID0gMFxuXG5cdHVwZGF0ZV9kb3Q6IChkb3QsIHQsIHYpLT5cblx0XHRpZiBkb3QuaWQgPT0gJ2ZpcnN0JyB0aGVuIHJldHVyblxuXHRcdEBzZWxlY3RlZCA9IGRvdFxuXHRcdGRvdC50ID0gdFxuXHRcdGRvdC52ID0gdlxuXHRcdEB1cGRhdGVfZG90cygpXG5cdFx0QGNvcnJlY3QgPSBNYXRoLmFicyhAc2VsZWN0ZWQudiArIEBzZWxlY3RlZC5kdikgPCAwLjFcblxuXHRAcHJvcGVydHkgJ3gnLCBnZXQ6IC0+XG5cdFx0cmVzID0geFNjYWxlIEB0XG5cblx0QHByb3BlcnR5ICd0cnVlX3gnLCBnZXQ6IC0+XG5cdFx0NCooMS1NYXRoLmV4cCAtQHQgKVxuXG5cdEBwcm9wZXJ0eSAnbWF4WCcsIGdldDotPlxuXHRcdEBkYXRhW0BkYXRhLmxlbmd0aCAtIDFdLnhcblxuc2VydmljZSA9IG5ldyBTZXJ2aWNlXG5cbm1vZHVsZS5leHBvcnRzID0gc2VydmljZSIsImFuZ3VsYXIgPSByZXF1aXJlICdhbmd1bGFyJ1xuZDMgPSByZXF1aXJlICdkMydcbnJlcXVpcmUgJy4uLy4uL2hlbHBlcnMnXG5fID0gcmVxdWlyZSAnbG9kYXNoJ1xudGVtcGxhdGUgPSAnJydcblx0PHN2ZyBuZy1pbml0PSd2bS5yZXNpemUoKScgd2lkdGg9JzEwMCUnIG5nLWF0dHItaGVpZ2h0PSd7e3ZtLnN2Z19oZWlnaHR9fSc+XG5cdFx0PGRlZnM+XG5cdFx0XHQ8Y2xpcHBhdGggaWQ9J3JlZyc+XG5cdFx0XHRcdDxyZWN0IG5nLWF0dHItd2lkdGg9J3t7dm0ud2lkdGh9fScgbmctYXR0ci1oZWlnaHQ9J3t7dm0uaGVpZ2h0fX0nPjwvcmVjdD5cblx0XHRcdDwvY2xpcHBhdGg+XG5cdFx0PC9kZWZzPlxuXHRcdDxnIGNsYXNzPSdib2lsZXJwbGF0ZScgc2hpZnRlcj0nW3ZtLm1hci5sZWZ0LCB2bS5tYXIudG9wXSc+XG5cdFx0XHQ8cmVjdCBjbGFzcz0nYmFja2dyb3VuZCcgbmctYXR0ci13aWR0aD0ne3t2bS53aWR0aH19JyBuZy1hdHRyLWhlaWdodD0ne3t2bS5oZWlnaHR9fScgbmctbW91c2Vtb3ZlPSd2bS5tb3ZlKCRldmVudCknIC8+XG5cdFx0XHQ8ZyB2ZXItYXhpcy1kZXIgd2lkdGg9J3ZtLndpZHRoJyBzY2FsZT0ndm0uVicgZnVuPSd2bS52ZXJBeEZ1bic+PC9nPlxuXHRcdFx0PGcgaG9yLWF4aXMtZGVyIGhlaWdodD0ndm0uaGVpZ2h0JyBzY2FsZT0ndm0uVCcgZnVuPSd2bS5ob3JBeEZ1bicgc2hpZnRlcj0nWzAsdm0uaGVpZ2h0XSc+PC9nPlxuXG5cdFx0XHQ8Zm9yZWlnbk9iamVjdCB3aWR0aD0nMzAnIGhlaWdodD0nMzAnIHk9JzE3JyBzaGlmdGVyPSdbdm0ud2lkdGgvMiwgdm0uaGVpZ2h0XSc+XG5cdFx0XHRcdDx0ZXh0IGNsYXNzPSdsYWJlbCcgPiR0JDwvdGV4dD5cblx0XHRcdDwvZm9yZWlnbk9iamVjdD5cblx0XHQ8L2c+XG5cdFx0PGcgY2xhc3M9J21haW4nIGNsaXAtcGF0aD1cInVybCgjcmVnKVwiIHNoaWZ0ZXI9J1t2bS5tYXIubGVmdCwgdm0ubWFyLnRvcF0nPlxuXHRcdFx0PGxpbmUgY2xhc3M9J3plcm8tbGluZSBob3InIG5nLWNsYXNzPSd7XCJjb3JyZWN0XCI6IHZtLmNvcnJlY3R9JyBkMy1kZXI9J3t4MTogMCwgeDI6IHZtLndpZHRoLCB5MTogdm0uVigwKSwgeTI6IHZtLlYoMCl9Jy8+XG5cdFx0XHQ8bGluZSBjbGFzcz0ndHJpIHYnIGQzLWRlcj0ne3gxOiB2bS5UKHZtLnBvaW50LnQpLCB4Mjogdm0uVCh2bS5wb2ludC50KSwgeTE6IHZtLlYoMCksIHkyOiB2bS5WKHZtLnBvaW50LnYgKX0nLz5cblx0XHRcdDxwYXRoIG5nLWF0dHItZD0ne3t2bS5saW5lRnVuKHZtLmRhdGEpfX0nIGNsYXNzPSdmdW4gdicgLz5cblx0XHRcdDxjaXJjbGUgcj0nM3B4JyBzaGlmdGVyPSdbdm0uVCh2bS5wb2ludC50KSwgdm0uVih2bS5wb2ludC52KV0nIGNsYXNzPSdwb2ludCB2Jy8+XG5cdFx0XHQ8Zm9yZWlnbk9iamVjdCB3aWR0aD0nMzAnIGhlaWdodD0nMzAnIHNoaWZ0ZXI9J1sodm0uVCh2bS5wb2ludC50KSAtIDE2KSwgdm0uc3RoaW5nXScgc3R5bGU9J2ZvbnQtc2l6ZTogMTNweDsgZm9udC13ZWlnaHQ6IDEwMDsnPlxuXHRcdFx0XHRcdDx0ZXh0IGNsYXNzPSdsYWJlbCcgZm9udC1zaXplPScxM3B4Jz4keSQ8L3RleHQ+XG5cdFx0XHQ8L2ZvcmVpZ25PYmplY3Q+XG5cdFx0PC9nPlxuXHQ8L3N2Zz5cbicnJ1xuXG5jbGFzcyBDdHJsXG5cdGNvbnN0cnVjdG9yOiAoQHNjb3BlLCBAZWwsIEB3aW5kb3cpLT5cblx0XHRAbWFyID0gXG5cdFx0XHRsZWZ0OiAzMFxuXHRcdFx0dG9wOiAyMFxuXHRcdFx0cmlnaHQ6IDIwXG5cdFx0XHRib3R0b206IDM1XG5cblx0XHRAViA9IGQzLnNjYWxlLmxpbmVhcigpLmRvbWFpbiBbLTEsMV1cblx0XHRAVCA9IGQzLnNjYWxlLmxpbmVhcigpLmRvbWFpbiBbMCwzXVxuXG5cdFx0QGhvckF4RnVuID0gZDMuc3ZnLmF4aXMoKVxuXHRcdFx0LnNjYWxlIEBUXG5cdFx0XHQudGlja1ZhbHVlcyBbMCwxLDIsM11cblx0XHRcdC5vcmllbnQgJ2JvdHRvbSdcblxuXHRcdEB2ZXJBeEZ1biA9IGQzLnN2Zy5heGlzKClcblx0XHRcdC5zY2FsZSBAVlxuXHRcdFx0LnRpY2tzIDVcblx0XHRcdC5vcmllbnQgJ2xlZnQnXG5cblx0XHRAbGluZUZ1biA9IGQzLnN2Zy5saW5lKClcblx0XHRcdC55IChkKT0+IEBWIGQudlxuXHRcdFx0LnggKGQpPT4gQFQgZC50XG5cblx0XHR2RnVuID0gKHQpLT41KiAodC0uNSkgKiAodC0xKSAqICh0LTIpKioyXG5cblx0XHRAZGF0YSA9IF8ucmFuZ2UgMCAsIDMgLCAxLzUwXG5cdFx0XHQubWFwICh0KS0+XG5cdFx0XHRcdHJlcyA9IFxuXHRcdFx0XHRcdHY6IHZGdW4gdFxuXHRcdFx0XHRcdHQ6IHRcblxuXHRcdEBwb2ludCA9IF8uc2FtcGxlIEBkYXRhXG5cblx0XHRAY29ycmVjdCA9IGZhbHNlXG5cblx0XHRhbmd1bGFyLmVsZW1lbnQgQHdpbmRvd1xuXHRcdFx0Lm9uICdyZXNpemUnLCBAcmVzaXplXG5cblx0XHRAbW92ZSA9IChldmVudCkgPT5cblx0XHRcdHJlY3QgPSBldmVudC50YXJnZXQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KClcblx0XHRcdHQgPSBAVC5pbnZlcnQgZXZlbnQueCAtIHJlY3QubGVmdFxuXHRcdFx0diA9IHZGdW4gdFxuXHRcdFx0QHBvaW50ID0gXG5cdFx0XHRcdHQ6IHRcblx0XHRcdFx0djogdlxuXHRcdFx0QGNvcnJlY3QgPSBNYXRoLmFicyhAcG9pbnQudikgPD0gMC4wNSBcblx0XHRcdEBzY29wZS4kZXZhbEFzeW5jKClcblxuXHRAcHJvcGVydHkgJ3N2Z19oZWlnaHQnLCBnZXQ6IC0+IEBoZWlnaHQgKyBAbWFyLnRvcCArIEBtYXIuYm90dG9tXG5cblx0cmVzaXplOiAoKT0+XG5cdFx0QHdpZHRoID0gQGVsWzBdLmNsaWVudFdpZHRoIC0gQG1hci5sZWZ0IC0gQG1hci5yaWdodFxuXHRcdEBoZWlnaHQgPSBAZWxbMF0uY2xpZW50SGVpZ2h0IC0gQG1hci5sZWZ0IC0gQG1hci5yaWdodCAtIDEwXG5cdFx0QFYucmFuZ2UgW0BoZWlnaHQsIDBdXG5cdFx0QFQucmFuZ2UgWzAsIEB3aWR0aF1cblx0XHRAc2NvcGUuJGV2YWxBc3luYygpXG5cblx0QHByb3BlcnR5ICdzdGhpbmcnLCBnZXQ6LT5cblx0XHRAVihAcG9pbnQudi8yKSAtIDdcblxuZGVyID0gKCktPlxuXHRkaXJlY3RpdmUgPSBcblx0XHRjb250cm9sbGVyQXM6ICd2bSdcblx0XHRzY29wZToge31cblx0XHR0ZW1wbGF0ZTogdGVtcGxhdGVcblx0XHR0ZW1wbGF0ZU5hbWVzcGFjZTogJ3N2Zydcblx0XHRjb250cm9sbGVyOiBbJyRzY29wZScsJyRlbGVtZW50JywgJyR3aW5kb3cnLCBDdHJsXVxuXG5tb2R1bGUuZXhwb3J0cyA9IGRlclxuIiwiZHJhZyA9ICgkcGFyc2UpLT5cblx0ZGlyZWN0aXZlID0gXG5cdFx0bGluazogKHNjb3BlLGVsLGF0dHIpLT5cblx0XHRcdHNlbCA9IGQzLnNlbGVjdChlbFswXSlcblx0XHRcdHNlbC5jYWxsKCRwYXJzZShhdHRyLmJlaGF2aW9yKShzY29wZSkpXG5cbm1vZHVsZS5leHBvcnRzID0gZHJhZyIsImQzID0gcmVxdWlyZSAnZDMnXG5hbmd1bGFyID0gcmVxdWlyZSAnYW5ndWxhcidcblxuZGVyID0gKCRwYXJzZSktPiAjZ29lcyBvbiBhIHN2ZyBlbGVtZW50XG5cdGRpcmVjdGl2ZSA9IFxuXHRcdHJlc3RyaWN0OiAnQSdcblx0XHRzY29wZTogXG5cdFx0XHRkM0RlcjogJz0nXG5cdFx0XHR0cmFuOiAnPSdcblx0XHRsaW5rOiAoc2NvcGUsIGVsLCBhdHRyKS0+XG5cdFx0XHRzZWwgPSBkMy5zZWxlY3QgZWxbMF1cblx0XHRcdHNjb3BlLiR3YXRjaCAnZDNEZXInXG5cdFx0XHRcdCwgKHYpLT5cblx0XHRcdFx0XHRpZiBzY29wZS50cmFuXG5cdFx0XHRcdFx0XHRzZWwudHJhbnNpdGlvbigpXG5cdFx0XHRcdFx0XHRcdC5hdHRyIHZcblx0XHRcdFx0XHRcdFx0LmNhbGwoc2NvcGUudHJhbilcblx0XHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0XHRzZWwuYXR0ciB2XG5cblx0XHRcdFx0LCB0cnVlXG5tb2R1bGUuZXhwb3J0cyA9IGRlciIsIm1vZHVsZS5leHBvcnRzID0gKCRwYXJzZSktPlxuXHQoc2NvcGUsIGVsLCBhdHRyKS0+XG5cdFx0ZDMuc2VsZWN0KGVsWzBdKS5kYXR1bSAkcGFyc2UoYXR0ci5kYXR1bSkoc2NvcGUpIiwiXG50ZW1wbGF0ZSA9ICcnJ1xuXHQ8Y2lyY2xlIGNsYXNzPSdkb3QgbGFyZ2UnPjwvY2lyY2xlPlxuXHQ8Y2lyY2xlIGNsYXNzPSdkb3Qgc21hbGwnIHI9JzQnPjwvY2lyY2xlPlxuJycnXG5cbmRlciA9ICgpLT5cblx0ZGlyZWN0aXZlID0gXG5cdFx0dGVtcGxhdGU6IHRlbXBsYXRlXG5cdFx0cmVzdHJpY3Q6ICdBJ1xuXHRcdGxpbms6IChzY29wZSxlbCxhdHRyKS0+XG5cdFx0XHRyYWQgPSAxMCAjdGhlIHJhZGl1cyBvZiB0aGUgbGFyZ2UgY2lyY2xlIG5hdHVyYWxseVxuXHRcdFx0c2VsID0gZDMuc2VsZWN0IGVsWzBdXG5cdFx0XHRiaWcgPSBzZWwuc2VsZWN0ICdjaXJjbGUuZG90LmxhcmdlJ1xuXHRcdFx0XHQuYXR0ciAncicsIHJhZFxuXHRcdFx0Y2lyYyA9IHNlbC5zZWxlY3QgJ2NpcmNsZS5kb3Quc21hbGwnXG5cblx0XHRcdG1vdXNlb3ZlciA9ICgpLT5cblx0XHRcdFx0c2NvcGUuZG90LmhpbGl0ZWQgPSB0cnVlXG5cdFx0XHRcdHNjb3BlLnZtLkRhdGEuc2VsZWN0ZWQgPSBzY29wZS5kb3Rcblx0XHRcdFx0c2NvcGUudm0uRGF0YS5zaG93ID0gdHJ1ZVxuXHRcdFx0XHRzY29wZS4kZXZhbEFzeW5jKClcblx0XHRcdFx0YmlnLnRyYW5zaXRpb24gJ2dyb3cnXG5cdFx0XHRcdFx0LmR1cmF0aW9uIDE1MFxuXHRcdFx0XHRcdC5lYXNlICdjdWJpYy1vdXQnXG5cdFx0XHRcdFx0LmF0dHIgJ3InICwgcmFkICogMS41XG5cdFx0XHRcdFx0LnRyYW5zaXRpb24oKVxuXHRcdFx0XHRcdC5kdXJhdGlvbiAxNTBcblx0XHRcdFx0XHQuZWFzZSAnY3ViaWMtaW4nXG5cdFx0XHRcdFx0LmF0dHIgJ3InICwgcmFkICogMS4zXG5cdFx0XHRcdFx0XG5cdFx0XHRiaWcub24gJ21vdXNlb3ZlcicsIG1vdXNlb3ZlclxuXHRcdFx0XHQub24gJ2NvbnRleHRtZW51JywgLT4gZXZlbnQucHJldmVudERlZmF1bHQoKVxuXHRcdFx0XHQub24gJ21vdXNlZG93bicsIC0+XG5cdFx0XHRcdFx0YmlnLnRyYW5zaXRpb24gJ2dyb3cnXG5cdFx0XHRcdFx0XHQuZHVyYXRpb24gMTUwXG5cdFx0XHRcdFx0XHQuZWFzZSAnY3ViaWMnXG5cdFx0XHRcdFx0XHQuYXR0ciAncicsIHJhZCoxLjdcblx0XHRcdFx0Lm9uICdtb3VzZXVwJywgKCktPlxuXHRcdFx0XHRcdGJpZy50cmFuc2l0aW9uICdncm93J1xuXHRcdFx0XHRcdFx0LmR1cmF0aW9uIDE1MFxuXHRcdFx0XHRcdFx0LmVhc2UgJ2N1YmljLWluJ1xuXHRcdFx0XHRcdFx0LmF0dHIgJ3InLCByYWQqMS4zXG5cdFx0XHRcdC5vbiAnbW91c2VvdXQnICwgKCktPlxuXHRcdFx0XHRcdHNjb3BlLmRvdC5oaWxpdGVkID0gZmFsc2Vcblx0XHRcdFx0XHRzY29wZS52bS5EYXRhLnNob3cgPSBmYWxzZVxuXHRcdFx0XHRcdHNjb3BlLiRldmFsQXN5bmMoKVxuXHRcdFx0XHRcdGJpZy50cmFuc2l0aW9uICdzaHJpbmsnXG5cdFx0XHRcdFx0XHQuZHVyYXRpb24gMzUwXG5cdFx0XHRcdFx0XHQuZWFzZSAnYm91bmNlLW91dCdcblx0XHRcdFx0XHRcdC5hdHRyICdyJyAsIHJhZFxuXG5cdFx0XHRzY29wZS4kd2F0Y2ggJ2RvdC5oaWxpdGVkJyAsICh2KS0+XG5cdFx0XHRcdGlmIHZcblx0XHRcdFx0XHRjaXJjLnRyYW5zaXRpb24oKVxuXHRcdFx0XHRcdFx0LmR1cmF0aW9uIDE1MFxuXHRcdFx0XHRcdFx0LmVhc2UgJ2N1YmljLW91dCdcblx0XHRcdFx0XHRcdC5zdHlsZVxuXHRcdFx0XHRcdFx0XHQnc3Ryb2tlLXdpZHRoJzogMi41XG5cdFx0XHRcdFx0XHRcdHN0cm9rZTogJyMyMjInXG5cdFx0XHRcdGVsc2UgXG5cdFx0XHRcdFx0Y2lyYy50cmFuc2l0aW9uKClcblx0XHRcdFx0XHRcdC5kdXJhdGlvbiAxMDBcblx0XHRcdFx0XHRcdC5lYXNlICdjdWJpYydcblx0XHRcdFx0XHRcdC5zdHlsZVxuXHRcdFx0XHRcdFx0XHQnc3Ryb2tlLXdpZHRoJzogMS42XG5cdFx0XHRcdFx0XHRcdHN0cm9rZTogJ3doaXRlJ1xuXG5cbm1vZHVsZS5leHBvcnRzID0gZGVyXG4iLCJ0ZW1wbGF0ZSA9ICcnJ1xuXHQ8Y2lyY2xlIGNsYXNzPSdkb3Qgc21hbGwnIHI9JzQnPjwvY2lyY2xlPlxuJycnXG5cbmRlciA9ICgpLT5cblx0ZGlyZWN0aXZlID0gXG5cdFx0dGVtcGxhdGU6IHRlbXBsYXRlXG5cdFx0cmVzdHJpY3Q6ICdBJ1xuXHRcdGxpbms6IChzY29wZSxlbCxhdHRyKS0+XG5cdFx0XHRzZWwgPSBkMy5zZWxlY3QgZWxbMF1cblx0XHRcdGNpcmMgPSBzZWwuc2VsZWN0ICdjaXJjbGUuZG90LnNtYWxsJ1xuXG5cdFx0XHRzY29wZS4kd2F0Y2ggJ2RvdC5oaWxpdGVkJyAsICh2KS0+XG5cdFx0XHRcdGlmIHZcblx0XHRcdFx0XHRjaXJjLnRyYW5zaXRpb24oKVxuXHRcdFx0XHRcdFx0LmR1cmF0aW9uIDE1MFxuXHRcdFx0XHRcdFx0LmVhc2UgJ2N1YmljLW91dCdcblx0XHRcdFx0XHRcdC5zdHlsZVxuXHRcdFx0XHRcdFx0XHQnc3Ryb2tlLXdpZHRoJzogMi41XG5cdFx0XHRcdFx0XHRcdHN0cm9rZTogJyMyMjInXG5cdFx0XHRcdGVsc2UgXG5cdFx0XHRcdFx0Y2lyYy50cmFuc2l0aW9uKClcblx0XHRcdFx0XHRcdC5kdXJhdGlvbiAxMDBcblx0XHRcdFx0XHRcdC5lYXNlICdjdWJpYydcblx0XHRcdFx0XHRcdC5zdHlsZVxuXHRcdFx0XHRcdFx0XHQnc3Ryb2tlLXdpZHRoJzogMS42XG5cdFx0XHRcdFx0XHRcdHN0cm9rZTogJ3doaXRlJ1xuXG5tb2R1bGUuZXhwb3J0cyA9IGRlclxuIiwiZDMgPSByZXF1aXJlICdkMydcblxuZGVyID0gKCRwYXJzZSktPlxuXHRkaXJlY3RpdmUgPVxuXHRcdGxpbms6IChzY29wZSwgZWwsIGF0dHIpLT5cblx0XHRcdHJlc2hpZnQgPSAodiktPiBcblx0XHRcdFx0ZDMuc2VsZWN0IGVsWzBdXG5cdFx0XHRcdFx0LmF0dHIgJ3RyYW5zZm9ybScgLCBcInRyYW5zbGF0ZSgje3ZbMF19LCN7dlsxXX0pXCJcblxuXHRcdFx0c2NvcGUuJHdhdGNoIC0+XG5cdFx0XHRcdFx0JHBhcnNlKGF0dHIuc2hpZnRlcikoc2NvcGUpXG5cdFx0XHRcdCwgcmVzaGlmdFxuXHRcdFx0XHQsIHRydWVcblxubW9kdWxlLmV4cG9ydHMgPSBkZXIiLCJkMyA9IHJlcXVpcmUgJ2QzJ1xuYW5ndWxhciA9IHJlcXVpcmUgJ2FuZ3VsYXInXG5cbmRlciA9ICgkd2luZG93KS0+XG5cdGRpcmVjdGl2ZSA9IFxuXHRcdGNvbnRyb2xsZXI6IGFuZ3VsYXIubm9vcFxuXHRcdGNvbnRyb2xsZXJBczogJ3ZtJ1xuXHRcdGJpbmRUb0NvbnRyb2xsZXI6IHRydWVcblx0XHRyZXN0cmljdDogJ0EnXG5cdFx0dGVtcGxhdGVOYW1lc3BhY2U6ICdzdmcnXG5cdFx0c2NvcGU6IFxuXHRcdFx0c2NhbGU6ICc9J1xuXHRcdFx0aGVpZ2h0OiAnPSdcblx0XHRcdGZ1bjogJz0nXG5cdFx0bGluazogKHNjb3BlLCBlbCwgYXR0ciwgdm0pLT5cblx0XHRcdHhBeGlzRnVuID0gdm0uZnVuID8gKGQzLnN2Zy5heGlzKClcblx0XHRcdFx0XHRcdFx0LnNjYWxlIHZtLnNjYWxlXG5cdFx0XHRcdFx0XHRcdC5vcmllbnQgJ2JvdHRvbScpXG5cblx0XHRcdHNlbCA9IGQzLnNlbGVjdCBlbFswXVxuXHRcdFx0XHQuY2xhc3NlZCAneCBheGlzJywgdHJ1ZVxuXG5cdFx0XHR1cGRhdGUgPSAoKT0+XG5cdFx0XHRcdHhBeGlzRnVuLnRpY2tTaXplIC12bS5oZWlnaHRcblx0XHRcdFx0c2VsLmNhbGwgeEF4aXNGdW5cblx0XHRcdFx0XG5cdFx0XHR1cGRhdGUoKVxuXHRcdFx0XHRcblx0XHRcdHNjb3BlLiR3YXRjaCAndm0uc2NhbGUuZG9tYWluKCknLCB1cGRhdGUgLCB0cnVlXG5cdFx0XHRzY29wZS4kd2F0Y2ggJ3ZtLnNjYWxlLnJhbmdlKCknLCB1cGRhdGUgLCB0cnVlXG5cdFx0XHRzY29wZS4kd2F0Y2ggJ3ZtLmhlaWdodCcsIHVwZGF0ZSAsIHRydWVcblxubW9kdWxlLmV4cG9ydHMgPSBkZXIiLCJkMyA9IHJlcXVpcmUgJ2QzJ1xuYW5ndWxhciA9IHJlcXVpcmUgJ2FuZ3VsYXInXG5cbmRlciA9ICgkd2luZG93KS0+XG5cdGRpcmVjdGl2ZSA9IFxuXHRcdGNvbnRyb2xsZXI6IGFuZ3VsYXIubm9vcFxuXHRcdGNvbnRyb2xsZXJBczogJ3ZtJ1xuXHRcdGJpbmRUb0NvbnRyb2xsZXI6IHRydWVcblx0XHRyZXN0cmljdDogJ0EnXG5cdFx0dGVtcGxhdGVOYW1lc3BhY2U6ICdzdmcnXG5cdFx0c2NvcGU6IFxuXHRcdFx0c2NhbGU6ICc9J1xuXHRcdFx0d2lkdGg6ICc9J1xuXHRcdFx0ZnVuOiAnPSdcblx0XHRsaW5rOiAoc2NvcGUsIGVsLCBhdHRyLCB2bSktPlxuXHRcdFx0eUF4aXNGdW4gPSB2bS5mdW4gPyBkMy5zdmcuYXhpcygpXG5cdFx0XHRcdC5zY2FsZSB2bS5zY2FsZVxuXHRcdFx0XHQub3JpZW50ICdsZWZ0J1xuXG5cdFx0XHRzZWwgPSBkMy5zZWxlY3QoZWxbMF0pLmNsYXNzZWQoJ3kgYXhpcycsIHRydWUpXG5cblx0XHRcdHVwZGF0ZSA9ICgpPT5cblx0XHRcdFx0eUF4aXNGdW4udGlja1NpemUoIC12bS53aWR0aClcblx0XHRcdFx0c2VsLmNhbGwoeUF4aXNGdW4pXG5cblx0XHRcdHVwZGF0ZSgpXG5cdFx0XHRcdFxuXHRcdFx0c2NvcGUuJHdhdGNoICd2bS5zY2FsZS5kb21haW4oKScsIHVwZGF0ZSAsIHRydWVcblx0XHRcdHNjb3BlLiR3YXRjaCAndm0uc2NhbGUucmFuZ2UoKScsIHVwZGF0ZSAsIHRydWVcblx0XHRcdCMgc2NvcGUuJHdhdGNoICd2bS53aWR0aCcsIHVwZGF0ZVxuXG5tb2R1bGUuZXhwb3J0cyA9IGRlciIsIid1c2Ugc3RyaWN0J1xuXG5tb2R1bGUuZXhwb3J0cy50aW1lb3V0ID0gKGZ1biwgdGltZSktPlxuXHRcdGQzLnRpbWVyKCgpPT5cblx0XHRcdGZ1bigpXG5cdFx0XHR0cnVlXG5cdFx0LHRpbWUpXG5cblxuRnVuY3Rpb246OnByb3BlcnR5ID0gKHByb3AsIGRlc2MpIC0+XG4gIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSBAcHJvdG90eXBlLCBwcm9wLCBkZXNjIl19
