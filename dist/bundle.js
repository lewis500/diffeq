(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';
var angular, app, d3, looper;

angular = require('angular');

d3 = require('d3');

app = angular.module('mainApp', [require('angular-material')]).directive('horAxisDer', require('./directives/xAxis')).directive('verAxisDer', require('./directives/yAxis')).directive('cartSimDer', require('./components/cart/cartSim')).directive('cartButtonsDer', require('./components/cart/cartButtons')).directive('shifter', require('./directives/shifter')).directive('designADer', require('./components/design/designA')).directive('behavior', require('./directives/behavior')).directive('dotDer', require('./directives/dot')).directive('datum', require('./directives/datum')).directive('d3Der', require('./directives/d3Der')).directive('designBDer', require('./components/design/designB')).directive('regularDer', require('./components/regular/regular')).directive('derivativeDer', require('./components/derivative/derivative')).directive('derivativeBDer', require('./components/derivative/derivativeB')).directive('dotBDer', require('./directives/dotB')).directive('cartPlotDer', require('./components/cart/cartPlot')).directive('designCartADer', require('./components/design/designCartA')).directive('designCartBDer', require('./components/design/designCartB')).directive('textureDer', require('./directives/texture')).directive('designButtonsDer', require('./components/design/designButtons'));

looper = function() {
  return setTimeout(function() {
    d3.selectAll('circle.dot.large').transition('grow').duration(500).ease('cubic-out').attr('transform', 'scale( 1.34)').transition('shrink').duration(500).ease('cubic-out').attr('transform', 'scale( 1.0)');
    return looper();
  }, 1000);
};

looper();



},{"./components/cart/cartButtons":2,"./components/cart/cartPlot":4,"./components/cart/cartSim":5,"./components/derivative/derivative":6,"./components/derivative/derivativeB":7,"./components/design/designA":9,"./components/design/designB":10,"./components/design/designButtons":11,"./components/design/designCartA":12,"./components/design/designCartB":13,"./components/regular/regular":17,"./directives/behavior":18,"./directives/d3Der":19,"./directives/datum":20,"./directives/dot":21,"./directives/dotB":22,"./directives/shifter":23,"./directives/texture":24,"./directives/xAxis":25,"./directives/yAxis":26,"angular":undefined,"angular-material":undefined,"d3":undefined}],2:[function(require,module,exports){
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
var Cart, _, exp;

_ = require('lodash');

exp = Math.exp;

Cart = (function() {
  function Cart(options) {
    var ref;
    this.options = options;
    ref = this.options, this.v0 = ref.v0, this.k = ref.k;
    this.restart();
  }

  Cart.prototype.restart = function() {
    this.t = this.x = 0;
    this.trajectory = _.range(0, 6, 1 / 50).map((function(_this) {
      return function(t) {
        var res, v;
        v = _this.v0 * exp(-_this.k * t);
        return res = {
          v: v,
          x: _this.v0 / _this.k * (1 - exp(-_this.k * t)),
          dv: -_this.k * v,
          t: t
        };
      };
    })(this));
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
    this.v = this.v0 * exp(-this.k * t);
    this.x = this.v0 / this.k * (1 - exp(-this.k * t));
    return this.dv = -this.k * this.v;
  };

  return Cart;

})();

module.exports = new Cart({
  v0: 2,
  k: .8
});



},{"lodash":undefined}],4:[function(require,module,exports){
var Cart, Ctrl, _, angular, d3, der, template,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

angular = require('angular');

d3 = require('d3');

require('../../helpers');

_ = require('lodash');

Cart = require('./cartData');

template = '<svg ng-init=\'vm.resize()\' width=\'100%\' class=\'topChart\'>\n	<defs>\n		<clippath id=\'cartPlot\'>\n			<rect d3-der=\'{width: vm.width, height: vm.height}\' />\n		</clippath>\n	</defs>\n	<g class=\'boilerplate\' shifter=\'[vm.mar.left, vm.mar.top]\'>\n		<rect class=\'background\' d3-der=\'{width: vm.width, height: vm.height}\' />\n		<g ver-axis-der width=\'vm.width\' scale=\'vm.V\' fun=\'vm.verAxFun\'></g>\n		<g hor-axis-der height=\'vm.height\' scale=\'vm.T\' fun=\'vm.horAxFun\' shifter=\'[0,vm.height]\'></g>\n		<foreignObject width=\'30\' height=\'30\' y=\'17\' shifter=\'[vm.width/2, vm.height]\'>\n			<text class=\'label\' >$t$</text>\n		</foreignObject>\n		<foreignObject width=\'30\' height=\'30\' shifter=\'[-31, vm.height/2-8]\'>\n				<text class=\'label\' >$v$</text>\n		</foreignObject>\n		<line class=\'zero-line\' d3-der="{x1: 0 , x2: vm.width, y1: vm.V(0), y2: vm.V(0)}" /> \n		<line class=\'zero-line\' d3-der="{x1: vm.T(0) , x2: vm.T(0), y1: 0, y2: vm.height}" /> \n	</g>\n	<g class=\'main\' clip-path="url(#cartPlot)" shifter=\'[vm.mar.left, vm.mar.top]\'>\n		<foreignObject width=\'30\' height=\'30\' shifter=\'[(vm.T(vm.point.t) - 16), vm.sthing]\' style=\'font-size: 13px; font-weight: 100;\'>\n				<text class=\'label\' font-size=\'13px\'>$v$</text>\n		</foreignObject>\n		<line class=\'tri v\' d3-der=\'{x1: vm.T(vm.point.t)-1, x2: vm.T(vm.point.t)-1, y1: vm.V(0), y2: vm.V(vm.point.v)}\'/>\n		<path ng-attr-d=\'{{vm.lineFun(vm.trajectory)}}\' class=\'fun v\' />\n		<circle r=\'3px\' shifter=\'[vm.T(vm.point.t), vm.V(vm.point.v)]\' class=\'point v\'/>\n	</g>\n</svg>';

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
    this.V = d3.scale.linear().domain([-.1, 2.5]);
    this.T = d3.scale.linear().domain([-.1, 5]);
    this.point = Cart;
    this.trajectory = Cart.trajectory;
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
    this.height = this.el[0].clientHeight - this.mar.left - this.mar.right;
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



},{"../../helpers":27,"./cartData":3,"angular":undefined,"d3":undefined,"lodash":undefined}],5:[function(require,module,exports){
var Cart, Ctrl, _, d3, der, min, template,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

_ = require('lodash');

d3 = require('d3');

min = Math.min;

Cart = require('./cartData');

require('../../helpers');

template = '<svg ng-init=\'vm.resize()\' width=\'100%\' ng-attr-height=\'{{vm.svg_height}}\'>\n	<g shifter=\'{{::[vm.mar.left, vm.mar.top]}}\'>\n		<rect class=\'background\' d3-der=\'{width: vm.width, height: vm.height}\' ng-mousemove=\'vm.move($event)\' />\n		<g hor-axis-der height=\'vm.height\' scale=\'vm.X\' fun=\'vm.axisFun\' shifter=\'[0,vm.height]\'></g>\n\n		<foreignObject width=\'30\' height=\'30\' y=\'20\' shifter=\'[vm.width/2, vm.height]\'>\n				<text class=\'label\' >$t$</text>\n		</foreignObject>\n		<g class=\'g-cart\' d3-der=\'{transform: "translate(" + vm.X(vm.Cart.x) + ",0)"}\' tran=\'vm.tran\'>\n				<rect class=\'cart\' x=\'-12.5\' width=\'25\' ng-attr-y=\'{{30-12.5}}\' height=\'25\'/>\n		</g>\n	</g>\n</svg>';

Ctrl = (function() {
  function Ctrl(scope, el, window) {
    this.scope = scope;
    this.el = el;
    this.window = window;
    this.resize = bind(this.resize, this);
    this.Cart = Cart;
    this.mar = {
      left: 30,
      right: 10,
      top: 10,
      bottom: 18
    };
    this.X = d3.scale.linear().domain([-.1, 3]);
    this.axisFun = d3.svg.axis().scale(this.X).ticks(5).orient('bottom');
    angular.element(this.window).on('resize', (function(_this) {
      return function() {
        return _this.resize();
      };
    })(this));
  }

  Ctrl.prototype.tran = function(tran) {
    return tran.ease('linear').duration(60);
  };

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



},{"../../helpers":27,"./cartData":3,"d3":undefined,"lodash":undefined}],6:[function(require,module,exports){
var Ctrl, Data, _, angular, d3, der, template,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

angular = require('angular');

d3 = require('d3');

require('../../helpers');

_ = require('lodash');

Data = require('./derivativeData');

template = '<svg ng-init=\'vm.resize()\' width=\'100%\' class=\'topChart\'>\n	<defs>\n		<clippath id=\'derClip\'>\n			<rect d3-der=\'{width: vm.width, height: vm.height}\'></rect>\n		</clippath>\n	</defs>\n	<g class=\'boilerplate\' shifter=\'[vm.mar.left, vm.mar.top]\'>\n		<rect class=\'background\' d3-der=\'{width: vm.width, height: vm.height}\' ng-mousemove=\'vm.move($event)\' />\n		<g ver-axis-der width=\'vm.width\' scale=\'vm.Ver\' fun=\'vm.verAxFun\'></g>\n		<g hor-axis-der height=\'vm.height\' scale=\'vm.Hor\' fun=\'vm.horAxFun\' shifter=\'[0,vm.height]\'></g>\n		<foreignObject width=\'30\' height=\'30\' y=\'17\' shifter=\'[vm.width/2, vm.height]\'>\n				<text class=\'label\' >$t$</text>\n		</foreignObject>\n	</g>\n	<g class=\'main\' clip-path="url(#derClip)" shifter=\'[vm.mar.left, vm.mar.top]\'>\n		<line class=\'zero-line hor\' d3-der=\'{x1: 0, x2: vm.width, y1: vm.Ver(0), y2: vm.Ver(0)}\'/>\n		<path ng-attr-d=\'{{vm.lineFun(vm.data)}}\' class=\'fun v\' />\n		<path ng-attr-d=\'{{vm.triangleData}}\' class=\'tri\' />\n		<line class=\'tri dv\' d3-der=\'{x1: vm.Hor(vm.point.t)-1, x2: vm.Hor(vm.point.t)-1, y1: vm.Ver(vm.point.v), y2: vm.Ver((vm.point.v + vm.point.dv))}\'/>\n		<foreignObject width=\'30\' height=\'30\' shifter=\'[(vm.Hor(vm.point.t) - 16), vm.sthing]\'>\n				<text class=\'tri-label\' >$\\dot{y}$</text>\n		</foreignObject>\n		<circle r=\'3px\'  shifter=\'[vm.Hor(vm.point.t), vm.Ver(vm.point.v)]\' class=\'point v\'/>\n	</g>\n</svg>';

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
    this.Ver = d3.scale.linear().domain([-1.5, 1.5]);
    this.Hor = d3.scale.linear().domain([0, 6]);
    this.data = Data.data;
    this.horAxFun = d3.svg.axis().scale(this.Hor).ticks(5).orient('bottom');
    this.verAxFun = d3.svg.axis().scale(this.Ver).tickFormat(function(d) {
      if (Math.floor(d) !== d) {
        return;
      }
      return d;
    }).ticks(5).orient('left');
    this.lineFun = d3.svg.line().y((function(_this) {
      return function(d) {
        return _this.Ver(d.v);
      };
    })(this)).x((function(_this) {
      return function(d) {
        return _this.Hor(d.t);
      };
    })(this));
    angular.element(this.window).on('resize', this.resize);
    this.move = (function(_this) {
      return function(event) {
        var t;
        t = _this.Hor.invert(event.x - event.target.getBoundingClientRect().left);
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
      return this.Ver(this.point.dv / 2 + this.point.v) - 7;
    }
  });

  Ctrl.property('point', {
    get: function() {
      return Data.point;
    }
  });

  Ctrl.property('triangleData', {
    get: function() {
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
    }
  });

  Ctrl.prototype.resize = function() {
    this.width = this.el[0].clientWidth - this.mar.left - this.mar.right;
    this.height = this.el[0].clientHeight - this.mar.top - this.mar.bottom - 8;
    this.Ver.range([this.height, 0]);
    this.Hor.range([0, this.width]);
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



},{"../../helpers":27,"./derivativeData":8,"angular":undefined,"d3":undefined,"lodash":undefined}],7:[function(require,module,exports){
var Ctrl, Data, _, angular, d3, der, template,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

angular = require('angular');

d3 = require('d3');

require('../../helpers');

_ = require('lodash');

Data = require('./derivativeData');

template = '<svg ng-init=\'vm.resize()\' width=\'100%\'  class=\'topChart\'>\n	<defs>\n		<clippath id=\'dervativeB\'>\n			<rect d3-der=\'{width: vm.width, height: vm.height}\' />\n		</clippath>\n	</defs>\n	<g class=\'boilerplate\' shifter=\'[vm.mar.left, vm.mar.top]\'>\n		<rect class=\'background\' d3-der=\'{width: vm.width, height: vm.height}\' ng-mousemove=\'vm.move($event)\' />\n		<g ver-axis-der width=\'vm.width\' scale=\'vm.Ver\' fun=\'vm.verAxFun\'></g>\n		<g hor-axis-der height=\'vm.height\' scale=\'vm.Hor\' fun=\'vm.horAxFun\' shifter=\'[0,vm.height]\'></g>\n		<foreignObject width=\'30\' height=\'30\' y=\'17\' shifter=\'[vm.width/2, vm.height]\'>\n				<text class=\'label\' >$t$</text>\n		</foreignObject>\n	</g>\n	<g class=\'main\' clip-path="url(#dervativeB)" shifter=\'[vm.mar.left, vm.mar.top]\'>\n		<line class=\'zero-line hor\' d3-der=\'{x1: 0, x2: vm.width, y1: vm.Ver(0), y2: vm.Ver(0)}\'/>\n		<path d3-der=\'{d:vm.lineFun(vm.data)}\' class=\'fun dv\' />\n		<line class=\'tri dv\' d3-der=\'{x1: vm.Hor(vm.point.t)-1, x2: vm.Hor(vm.point.t)-1, y1: vm.Ver(0), y2: vm.Ver(vm.point.dv)}\'/>\n		<foreignObject width=\'30\' height=\'30\' shifter=\'[(vm.Hor(vm.point.t) - 16), vm.Ver(vm.point.dv*.5)-6]\'>\n				<text class=\'tri-label\'>$\\dot{y}$</text>\n		</foreignObject>\n		<circle r=\'3px\'  shifter=\'[vm.Hor(vm.point.t), vm.Ver(vm.point.dv)]\' class=\'point dv\'/>\n	</g>\n</svg>';

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
    this.Ver = d3.scale.linear().domain([-1.5, 1.5]);
    this.Hor = d3.scale.linear().domain([0, 6]);
    this.data = Data.data;
    this.horAxFun = d3.svg.axis().scale(this.Hor).ticks(5).orient('bottom');
    this.verAxFun = d3.svg.axis().scale(this.Ver).tickFormat(function(d) {
      if (Math.floor(d) !== d) {
        return;
      }
      return d;
    }).ticks(5).orient('left');
    this.lineFun = d3.svg.line().y((function(_this) {
      return function(d) {
        return _this.Ver(d.dv);
      };
    })(this)).x((function(_this) {
      return function(d) {
        return _this.Hor(d.t);
      };
    })(this));
    angular.element(this.window).on('resize', this.resize);
    this.move = (function(_this) {
      return function(event) {
        var t;
        t = _this.Hor.invert(event.x - event.target.getBoundingClientRect().left);
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
    this.Ver.range([this.height, 0]);
    this.Hor.range([0, this.width]);
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



},{"../../helpers":27,"./derivativeData":8,"angular":undefined,"d3":undefined,"lodash":undefined}],8:[function(require,module,exports){
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
var Ctrl, Data, angular, d3, der, template,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

angular = require('angular');

d3 = require('d3');

Data = require('./designData');

require('../../helpers');

template = '<svg ng-init=\'vm.resize()\' width=\'100%\' class=\'bottomChart\'>\n	<defs>\n		<clippath id=\'plotA\'>\n			<rect d3-der=\'{width: vm.width, height: vm.height}\'></rect>\n		</clippath>\n	</defs>\n	<g class=\'boilerplate\' shifter=\'[vm.mar.left, vm.mar.top]\'>\n		<rect class=\'background\' d3-der=\'{width: vm.width, height: vm.height}\' behavior=\'vm.drag_rect\' />\n		<g ver-axis-der width=\'vm.width\' scale=\'vm.Ver\' fun=\'vm.verAxFun\'></g>\n		<g hor-axis-der height=\'vm.height\' scale=\'vm.Hor\' fun=\'vm.horAxFun\' shifter=\'[0,vm.height]\'></g>\n		<foreignObject width=\'30\' height=\'30\' shifter=\'[-31, vm.height/2]\'>\n				<text class=\'label\'>$v$</text>\n		</foreignObject>\n		<foreignObject width=\'30\' height=\'30\' shifter=\'[vm.width/2, vm.height]\'>\n				<text class=\'label\' >$t$</text>\n		</foreignObject>\n	</g>\n	<g class=\'main\' clip-path="url(#plotA)" shifter=\'[vm.mar.left, vm.mar.top]\' >\n		<line class=\'zero-line\' d3-der=\'{x1: 0, x2: vm.width, y1: vm.Ver(0), y2: vm.Ver(0)}\' />\n		<line class=\'zero-line\' d3-der="{x1: vm.Hor(0), x2: vm.Hor(0), y1: vm.height, y2: 0}" />\n		<g ng-class=\'{hide: !vm.Data.show}\' >\n			<line class=\'tri v\' d3-der=\'{x1: vm.Hor(vm.point.t)-1, x2: vm.Hor(vm.point.t)-1, y1: vm.Ver(0), y2: vm.Ver(vm.point.v)}\'/>\n			<path ng-attr-d=\'{{vm.triangleData()}}\' class=\'tri\' />\n			<path ng-attr-d=\'{{vm.lineFun([vm.point, {v: vm.point.dv + vm.point.v, t: vm.point.t}])}}\' class=\'tri dv\' />\n		</g>\n		<path ng-attr-d=\'{{vm.lineFun(vm.Data.Cart.trajectory)}}\' class=\'fun target\' />\n		<path ng-attr-d=\'{{vm.lineFun(vm.Data.dots)}}\' class=\'fun v\' />\n		<g ng-repeat=\'dot in vm.dots track by dot.id\' datum=dot shifter=\'[vm.Hor(dot.t),vm.Ver(dot.v)]\' behavior=\'vm.drag\' dot-der ></g>\n		<circle class=\'dot small\' r=\'4\' shifter=\'[vm.Hor(vm.Data.first.t),vm.Ver(vm.Data.first.v)]\' />\n	</g>\n</svg>';

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
    this.Ver = d3.scale.linear().domain([-.1, 2.1]);
    this.Hor = d3.scale.linear().domain([-.1, 5]);
    this.Data = Data;
    this.horAxFun = d3.svg.axis().scale(this.Hor).ticks(5).orient('bottom');
    this.verAxFun = d3.svg.axis().scale(this.Ver).ticks(5).orient('left');
    this.lineFun = d3.svg.line().y((function(_this) {
      return function(d) {
        return _this.Ver(d.v);
      };
    })(this)).x((function(_this) {
      return function(d) {
        return _this.Hor(d.t);
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
        t = _this.Hor.invert(event.x - rect.left);
        v = _this.Ver.invert(event.y - rect.top);
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
        event.stopPropagation();
        event.preventDefault();
        if (event.which === 3) {
          Data.remove_dot(dot);
          return _this.scope.$evalAsync();
        } else {
          return Data.show = true;
        }
      };
    })(this)).on('drag', this.on_drag).on('dragend', (function(_this) {
      return function() {
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
      return Data.dots.filter(function(d) {
        return (d.id !== 'first') && (d.id !== 'last');
      });
    }
  });

  Ctrl.prototype.on_drag = function(dot) {
    if (event.which === 3) {
      event.preventDefault();
      return;
    }
    Data.update_dot(dot, this.Hor.invert(d3.event.x), this.Ver.invert(d3.event.y));
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
    this.height = this.el[0].clientHeight - this.mar.top - this.mar.bottom;
    this.Ver.range([this.height, 0]);
    this.Hor.range([0, this.width]);
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



},{"../../helpers":27,"./designData":14,"angular":undefined,"d3":undefined}],10:[function(require,module,exports){
var Ctrl, Data, angular, d3, der, template,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

Data = require('./designData');

angular = require('angular');

d3 = require('d3');

require('../../helpers');

template = '<svg ng-init=\'vm.resize()\'  width=\'100%\' class=\'bottomChart\'>\n	<defs>\n		<clippath id=\'plotB\'>\n			<rect d3-der=\'{width: vm.width, height: vm.height}\' />\n		</clippath>\n	</defs>\n	<g class=\'boilerplate\' shifter=\'[vm.mar.left, vm.mar.top]\'>\n		<rect class=\'background\' d3-der=\'{width: vm.width, height: vm.height}\' />\n		<g ver-axis-der width=\'vm.width\' scale=\'vm.Ver\' fun=\'vm.verAxFun\'></g>\n		<g hor-axis-der height=\'vm.height\' scale=\'vm.V\' fun=\'vm.horAxFun\' shifter=\'[0,vm.height]\'></g>\n		<foreignObject width=\'30\' height=\'30\' shifter=\'[-31, vm.height/2]\'>\n				<text class=\'label\'>$\\dot{v}$</text>\n		</foreignObject>\n		<foreignObject width=\'30\' height=\'30\' y=\'20\' shifter=\'[vm.width/2, vm.height]\'>\n				<text class=\'label\' >$v$</text>\n		</foreignObject>\n	</g>\n	<g class=\'main\' clip-path="url(#plotB)" shifter=\'[vm.mar.left, vm.mar.top]\'>\n		<line class=\'zero-line\' d3-der=\'{x1: 0, x2: vm.width, y1: vm.Ver(0), y2: vm.Ver(0)}\' />\n		<line class=\'zero-line\' d3-der="{x1: vm.Hor(0), x2: vm.Hor(0), y1: vm.height, y2: 0}" />\n		<path ng-attr-d=\'{{vm.lineFun(vm.Data.target_data)}}\' class=\'fun target\' />\n		<g ng-class=\'{hide: !vm.Data.show}\' >\n			<line class=\'tri v\' d3-der=\'{x1: vm.Hor(0), x2: vm.Hor(vm.point.v), y1: vm.Ver(vm.point.dv), y2: vm.Ver(vm.point.dv)}\'/>\n			<line class=\'tri dv\' d3-der=\'{x1: vm.Hor(vm.point.v), x2: vm.Hor(vm.point.v), y1: vm.Ver(0), y2: vm.Ver(vm.point.dv)}\'/>\n			<path d3-der=\'{d:vm.lineFun(vm.Data.target_data)}\' class=\'fun correct\' ng-class=\'{hide: !vm.Data.correct}\' />\n		</g>\n		<g ng-repeat=\'dot in vm.dots track by dot.id\' shifter=\'[vm.Hor(dot.v),vm.Ver(dot.dv)]\' dot-b-der></g>\n	</g>\n</svg>';

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
    this.Ver = d3.scale.linear().domain([-2.25, .1]);
    this.Hor = d3.scale.linear().domain([-.1, 2.1]);
    this.horAxFun = d3.svg.axis().scale(this.Hor).ticks(5).orient('bottom');
    this.verAxFun = d3.svg.axis().scale(this.Ver).ticks(5).orient('left');
    this.Data = Data;
    this.lineFun = d3.svg.line().y((function(_this) {
      return function(d) {
        return _this.Ver(d.dv);
      };
    })(this)).x((function(_this) {
      return function(d) {
        return _this.Hor(d.v);
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
        return (d.id !== 'first') && (d.id !== 'last');
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
    this.height = this.el[0].clientHeight - this.mar.top - this.mar.bottom;
    this.Ver.range([this.height, 0]);
    this.Hor.range([0, this.width]);
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



},{"../../helpers":27,"./designData":14,"angular":undefined,"d3":undefined}],11:[function(require,module,exports){
var Ctrl, Data, angular, d3, der, template;

angular = require('angular');

d3 = require('d3');

Data = require('./designData');

require('../../helpers');

template = '<mg-button ng-click=\'vm.click()\'>{{vm.paused ? \'PLAY\' : \'PAUSE\'}} </md-button>';

Ctrl = (function() {
  function Ctrl(scope, el, window) {
    this.scope = scope;
    this.el = el;
    this.window = window;
    this.Data = Data;
    this.pause();
  }

  Ctrl.prototype.click = function() {
    if (this.paused) {
      return this.play();
    } else {
      return this.pause();
    }
  };

  Ctrl.prototype.play = function() {
    this.paused = true;
    d3.timer.flush();
    this.paused = false;
    return setTimeout((function(_this) {
      return function() {
        return d3.timer(function(elapsed) {
          Data.t = elapsed / 1000;
          _this.scope.$evalAsync();
          if (elapsed > 4000) {
            _this.pause();
            setTimeout(function() {
              return _this.play();
            });
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
    template: template,
    templateNamespace: 'svg',
    controller: ['$scope', '$element', '$window', Ctrl]
  };
};

module.exports = der;



},{"../../helpers":27,"./designData":14,"angular":undefined,"d3":undefined}],12:[function(require,module,exports){
var Cart, Ctrl, _, d3, der, min, template,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

_ = require('lodash');

d3 = require('d3');

min = Math.min;

require('../../helpers');

Cart = require('./fakeCart');

template = '<svg ng-init=\'vm.resize()\' width=\'100%\' ng-attr-height=\'{{vm.svg_height}}\'>\n	<g shifter=\'{{::[vm.mar.left, vm.mar.top]}}\'>\n		<rect d3-der=\'{width: vm.width, height: vm.height}\' class=\'background\'/>\n		<g hor-axis-der height=\'vm.height\' scale=\'vm.X\' fun=\'vm.axisFun\' shifter=\'[0,vm.height]\'></g>\n		<g class=\'g-cart\' d3-der=\'{transform: "translate(" + vm.X(vm.Cart.x) + ",0)"}\' >\n			<rect class=\'cart\' x=\'-12.5\' width=\'25\' ng-attr-y=\'{{30-12.5}}\' height=\'25\'/>\n		</g>\n		<g class=\'g-cart\' ng-repeat=\'t in vm.sample\' d3-der=\'{transform: "translate(" + vm.X(vm.Cart.loc(t)) + ",0)"}\' style=\'opacity:.3;\'>\n				<rect class=\'cart\' x=\'-12.5\' width=\'25\' ng-attr-y=\'{{30-12.5}}\' height=\'25\'/>\n		</g>\n	</g>\n</svg>';

Ctrl = (function() {
  function Ctrl(scope, el, window) {
    this.scope = scope;
    this.el = el;
    this.window = window;
    this.resize = bind(this.resize, this);
    this.mar = {
      left: 10,
      right: 10,
      top: 0,
      bottom: 0
    };
    this.X = d3.scale.linear().domain([-.1, 3]);
    this.sample = _.range(0, 5, .5);
    this.Cart = Cart;
    this.axisFun = d3.svg.axis().scale(this.X).ticks(5).orient('bottom');
    this.tran = function(tran) {
      return tran.ease('linear').duration(60);
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
    this.height = 60;
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



},{"../../helpers":27,"./fakeCart":15,"d3":undefined,"lodash":undefined}],13:[function(require,module,exports){
var Cart, Ctrl, _, d3, der, min, template,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

_ = require('lodash');

d3 = require('d3');

min = Math.min;

require('../../helpers');

Cart = require('./trueCart');

template = '<svg ng-init=\'vm.resize()\' width=\'100%\' ng-attr-height=\'{{vm.svg_height}}\'>\n	<g shifter=\'{{::[vm.mar.left, vm.mar.top]}}\'>\n		<rect d3-der=\'{width: vm.width, height: vm.height}\' class=\'background\'/>\n		<g hor-axis-der height=\'vm.height\' scale=\'vm.X\' fun=\'vm.axisFun\' shifter=\'[0,vm.height]\'></g>\n		<foreignObject width=\'30\' height=\'30\' y=\'20\' shifter=\'[vm.width/2, vm.height]\'>\n				<text class=\'label\' >$x$</text>\n		</foreignObject>\n		<g class=\'g-cart\' d3-der=\'{transform: "translate(" + vm.X(vm.Cart.x) + ",0)"}\' >\n			<rect class=\'cart\' x=\'-12.5\' width=\'25\' ng-attr-y=\'{{30-12.5}}\' height=\'25\'/>\n		</g>\n		<g class=\'g-cart\' ng-repeat=\'t in vm.sample\' d3-der=\'{transform: "translate(" + vm.X(vm.Cart.loc(t)) + ",0)"}\' style=\'opacity:.3;\'>\n				<rect class=\'cart\' x=\'-12.5\' width=\'25\' ng-attr-y=\'{{30-12.5}}\' height=\'25\'/>\n		</g>\n	</g>\n</svg>';

Ctrl = (function() {
  function Ctrl(scope, el, window) {
    this.scope = scope;
    this.el = el;
    this.window = window;
    this.resize = bind(this.resize, this);
    this.mar = {
      left: 10,
      right: 10,
      top: 10,
      bottom: 15
    };
    this.X = d3.scale.linear().domain([-.1, 3]);
    this.sample = _.range(0, 5, .5);
    this.Cart = Cart;
    this.axisFun = d3.svg.axis().scale(this.X).ticks(5).orient('bottom');
    this.tran = function(tran) {
      return tran.ease('linear').duration(60);
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
    this.height = 60;
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



},{"../../helpers":27,"./trueCart":16,"d3":undefined,"lodash":undefined}],14:[function(require,module,exports){
var Cart, Data, Dot, _, d3, exp, max, min;

_ = require('lodash');

require('../../helpers');

Cart = require('../cart/cartData');

d3 = require('d3');

exp = Math.exp, min = Math.min, max = Math.max;

Dot = (function() {
  function Dot(t1, v1) {
    this.t = t1;
    this.v = v1;
    this.id = _.uniqueId('dot');
    this.hilited = false;
  }

  return Dot;

})();

Data = (function() {
  function Data() {
    var firstDot, lastDot, midDot;
    this.t = this.x = 0;
    this.Cart = Cart;
    firstDot = new Dot(0, Cart.v0);
    firstDot.id = 'first';
    midDot = new Dot(Cart.trajectory[10].t, Cart.trajectory[10].v);
    lastDot = new Dot(6, Cart.trajectory[10].v);
    lastDot.id = 'last';
    this.dots = [firstDot, midDot, lastDot];
    this.correct = this.show = false;
    this.first = this.selected = firstDot;
    this.target_data = Cart.trajectory;
    this.update_dots();
  }

  Data.prototype.add_dot = function(t, v) {
    this.selected = new Dot(t, v);
    this.dots.push(this.selected);
    return this.update_dot(this.selected, t, v);
  };

  Data.prototype.remove_dot = function(dot) {
    this.dots.splice(this.dots.indexOf(dot), 1);
    return this.update_dots();
  };

  Data.prototype.update_dots = function() {
    this.dots.sort(function(a, b) {
      return a.t - b.t;
    });
    return this.dots.forEach(function(dot, i, k) {
      var dt, prev;
      prev = k[i - 1];
      if (dot.id === 'last') {
        dot.v = prev.v;
        return;
      }
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

  Data.prototype.update_dot = function(dot, t, v) {
    if (dot.id === 'first') {
      return;
    }
    this.selected = dot;
    dot.t = t;
    dot.v = v;
    this.update_dots();
    return this.correct = Math.abs(Cart.k * this.selected.v + this.selected.dv) < 0.05;
  };

  return Data;

})();

module.exports = new Data;



},{"../../helpers":27,"../cart/cartData":3,"d3":undefined,"lodash":undefined}],15:[function(require,module,exports){
var Cart, Data, _;

Data = require('./designData');

_ = require('lodash');

Cart = (function() {
  function Cart() {}

  Cart.prototype.loc = function(t) {
    var a, dt, dv, i, ref, ref1;
    i = _.findLastIndex(Data.dots, function(d) {
      return d.t <= t;
    });
    a = Data.dots[i];
    dt = t - a.t;
    dv = (ref = (ref1 = Data.dots[i + 1]) != null ? ref1.dv : void 0) != null ? ref : 0;
    return a.x + a.v * dt + 0.5 * dv * Math.pow(dt, 2);
  };

  Cart.property('x', {
    get: function() {
      return this.loc(Data.t);
    }
  });

  return Cart;

})();

module.exports = new Cart;



},{"./designData":14,"lodash":undefined}],16:[function(require,module,exports){
var Cart, Data, Real, _;

Real = require('../cart/cartData');

Data = require('./designData');

_ = require('lodash');

require('../../helpers');

Cart = (function() {
  function Cart() {}

  Cart.prototype.loc = function(t) {
    var traj;
    return traj = _.findLast(Real.trajectory, function(d) {
      return d.t <= t;
    }).x;
  };

  Cart.property('x', {
    get: function() {
      return this.loc(Data.t);
    }
  });

  return Cart;

})();

module.exports = new Cart;



},{"../../helpers":27,"../cart/cartData":3,"./designData":14,"lodash":undefined}],17:[function(require,module,exports){
var Ctrl, _, angular, d3, der, template,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

angular = require('angular');

d3 = require('d3');

require('../../helpers');

_ = require('lodash');

template = '<svg ng-init=\'vm.resize()\' width=\'100%\' class=\'topChart\'>\n	<defs>\n		<clippath id=\'reg\'>\n			<rect d3-der=\'{width: vm.width, height: vm.height}\' />\n		</clippath>\n	</defs>\n	<g class=\'boilerplate\' shifter=\'[vm.mar.left, vm.mar.top]\'>\n		<rect class=\'background\' d3-der=\'{width: vm.width, height: vm.height}\' ng-mousemove=\'vm.move($event)\' />\n		<g ver-axis-der width=\'vm.width\' scale=\'vm.Ver\' fun=\'vm.verAxFun\'></g>\n		<g hor-axis-der height=\'vm.height\' scale=\'vm.Hor\' fun=\'vm.horAxFun\' shifter=\'[0,vm.height]\'></g>\n		<foreignObject width=\'30\' height=\'30\' y=\'17\' shifter=\'[vm.width/2, vm.height]\'>\n			<text class=\'label\'>$t$</text>\n		</foreignObject>\n	</g>\n	<g class=\'main\' clip-path="url(#reg)" shifter=\'[vm.mar.left, vm.mar.top]\'>\n		<line class=\'zero-line hor\' ng-class=\'{"correct": vm.correct}\' d3-der=\'{x1: 0, x2: vm.width, y1: vm.Ver(0), y2: vm.Ver(0)}\'/>\n		<line class=\'tri v\' d3-der=\'{x1: vm.Hor(vm.point.t), x2: vm.Hor(vm.point.t), y1: vm.Ver(0), y2: vm.Ver(vm.point.v )}\'/>\n		<circle r=\'3px\' shifter=\'[vm.Hor(vm.point.t), vm.Ver(vm.point.v)]\' class=\'point v\'/>\n		<path d3-der=\'{d:vm.lineFun(vm.data)}\' class=\'fun v\' />\n		<foreignObject width=\'30\' height=\'30\' shifter=\'[(vm.Hor(vm.point.t) - 16), vm.Ver(vm.point.v/2) - 7]\'>\n				<text class=\'tri-label\' font-size=\'13px\'>$y$</text>\n		</foreignObject>\n	</g>\n</svg>';

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
    this.Ver = d3.scale.linear().domain([-1, 1]);
    this.Hor = d3.scale.linear().domain([0, 2.5]);
    this.horAxFun = d3.svg.axis().scale(this.Hor).tickFormat(d3.format('d')).orient('bottom');
    this.verAxFun = d3.svg.axis().scale(this.Ver).ticks(5).tickFormat(function(d) {
      if (Math.floor(d) !== d) {
        return;
      }
      return d;
    }).orient('left');
    this.lineFun = d3.svg.line().y((function(_this) {
      return function(d) {
        return _this.Ver(d.v);
      };
    })(this)).x((function(_this) {
      return function(d) {
        return _this.Hor(d.t);
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
        t = _this.Hor.invert(event.x - rect.left);
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
    this.height = this.el[0].clientHeight - this.mar.left - this.mar.right;
    this.Ver.range([this.height, 0]);
    this.Hor.range([0, this.width]);
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



},{"../../helpers":27,"angular":undefined,"d3":undefined,"lodash":undefined}],18:[function(require,module,exports){
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



},{}],19:[function(require,module,exports){
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
      var sel, u;
      sel = d3.select(el[0]);
      u = 't-' + Math.random();
      return scope.$watch('d3Der', function(v) {
        if (scope.tran) {
          return sel.transition(u).attr(v).call(scope.tran);
        } else {
          return sel.attr(v);
        }
      }, true);
    }
  };
};

module.exports = der;



},{"angular":undefined,"d3":undefined}],20:[function(require,module,exports){
module.exports = function($parse) {
  return function(scope, el, attr) {
    return d3.select(el[0]).datum($parse(attr.datum)(scope));
  };
};



},{}],21:[function(require,module,exports){
var der, template;

template = '<circle class=\'dot large\'></circle>\n<circle class=\'dot small\' r=\'4\'></circle>';

der = function() {
  var directive;
  return directive = {
    template: template,
    restrict: 'A',
    link: function(scope, el, attr) {
      var big, circ, mouseover, rad, sel;
      rad = 7;
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
            'stroke-width': 2.5
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



},{}],22:[function(require,module,exports){
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
            'stroke-width': 2.5
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



},{}],23:[function(require,module,exports){
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



},{"d3":undefined}],24:[function(require,module,exports){
var Ctrl, angular, d3, der, textures;

angular = require('angular');

d3 = require('d3');

textures = require('textures');

Ctrl = (function() {
  function Ctrl(scope, el, window) {
    var t;
    this.scope = scope;
    this.el = el;
    this.window = window;
    t = textures.lines().orientation("3/8", "7/8").size(5).stroke('#E6E6E6').strokeWidth(.8);
    t.id('myTexture');
    d3.select(this.el[0]).select('svg').call(t);
  }

  return Ctrl;

})();

der = function() {
  var directive;
  return directive = {
    controllerAs: 'vm',
    scope: {},
    template: '<svg height="0px" style="position: absolute;" width="0px"></svg>',
    templateNamespace: 'svg',
    controller: ['$scope', '$element', '$window', Ctrl]
  };
};

module.exports = der;



},{"angular":undefined,"d3":undefined,"textures":undefined}],25:[function(require,module,exports){
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



},{"angular":undefined,"d3":undefined}],26:[function(require,module,exports){
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
      scope.$watch('vm.scale.range()', update, true);
      return scope.$watch('vm.scale.ticks()', update, true);
    }
  };
};

module.exports = der;



},{"angular":undefined,"d3":undefined}],27:[function(require,module,exports){
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvbGV3aXMvUmVzZWFyY2gvZGlmZkVRX25ldy9hcHAvYXBwLmNvZmZlZSIsIi9Vc2Vycy9sZXdpcy9SZXNlYXJjaC9kaWZmRVFfbmV3L2FwcC9jb21wb25lbnRzL2NhcnQvY2FydEJ1dHRvbnMuY29mZmVlIiwiL1VzZXJzL2xld2lzL1Jlc2VhcmNoL2RpZmZFUV9uZXcvYXBwL2NvbXBvbmVudHMvY2FydC9jYXJ0RGF0YS5jb2ZmZWUiLCIvVXNlcnMvbGV3aXMvUmVzZWFyY2gvZGlmZkVRX25ldy9hcHAvY29tcG9uZW50cy9jYXJ0L2NhcnRQbG90LmNvZmZlZSIsIi9Vc2Vycy9sZXdpcy9SZXNlYXJjaC9kaWZmRVFfbmV3L2FwcC9jb21wb25lbnRzL2NhcnQvY2FydFNpbS5jb2ZmZWUiLCIvVXNlcnMvbGV3aXMvUmVzZWFyY2gvZGlmZkVRX25ldy9hcHAvY29tcG9uZW50cy9kZXJpdmF0aXZlL2Rlcml2YXRpdmUuY29mZmVlIiwiL1VzZXJzL2xld2lzL1Jlc2VhcmNoL2RpZmZFUV9uZXcvYXBwL2NvbXBvbmVudHMvZGVyaXZhdGl2ZS9kZXJpdmF0aXZlQi5jb2ZmZWUiLCIvVXNlcnMvbGV3aXMvUmVzZWFyY2gvZGlmZkVRX25ldy9hcHAvY29tcG9uZW50cy9kZXJpdmF0aXZlL2Rlcml2YXRpdmVEYXRhLmNvZmZlZSIsIi9Vc2Vycy9sZXdpcy9SZXNlYXJjaC9kaWZmRVFfbmV3L2FwcC9jb21wb25lbnRzL2Rlc2lnbi9kZXNpZ25BLmNvZmZlZSIsIi9Vc2Vycy9sZXdpcy9SZXNlYXJjaC9kaWZmRVFfbmV3L2FwcC9jb21wb25lbnRzL2Rlc2lnbi9kZXNpZ25CLmNvZmZlZSIsIi9Vc2Vycy9sZXdpcy9SZXNlYXJjaC9kaWZmRVFfbmV3L2FwcC9jb21wb25lbnRzL2Rlc2lnbi9kZXNpZ25CdXR0b25zLmNvZmZlZSIsIi9Vc2Vycy9sZXdpcy9SZXNlYXJjaC9kaWZmRVFfbmV3L2FwcC9jb21wb25lbnRzL2Rlc2lnbi9kZXNpZ25DYXJ0QS5jb2ZmZWUiLCIvVXNlcnMvbGV3aXMvUmVzZWFyY2gvZGlmZkVRX25ldy9hcHAvY29tcG9uZW50cy9kZXNpZ24vZGVzaWduQ2FydEIuY29mZmVlIiwiL1VzZXJzL2xld2lzL1Jlc2VhcmNoL2RpZmZFUV9uZXcvYXBwL2NvbXBvbmVudHMvZGVzaWduL2Rlc2lnbkRhdGEuY29mZmVlIiwiL1VzZXJzL2xld2lzL1Jlc2VhcmNoL2RpZmZFUV9uZXcvYXBwL2NvbXBvbmVudHMvZGVzaWduL2Zha2VDYXJ0LmNvZmZlZSIsIi9Vc2Vycy9sZXdpcy9SZXNlYXJjaC9kaWZmRVFfbmV3L2FwcC9jb21wb25lbnRzL2Rlc2lnbi90cnVlQ2FydC5jb2ZmZWUiLCIvVXNlcnMvbGV3aXMvUmVzZWFyY2gvZGlmZkVRX25ldy9hcHAvY29tcG9uZW50cy9yZWd1bGFyL3JlZ3VsYXIuY29mZmVlIiwiL1VzZXJzL2xld2lzL1Jlc2VhcmNoL2RpZmZFUV9uZXcvYXBwL2RpcmVjdGl2ZXMvYmVoYXZpb3IuY29mZmVlIiwiL1VzZXJzL2xld2lzL1Jlc2VhcmNoL2RpZmZFUV9uZXcvYXBwL2RpcmVjdGl2ZXMvZDNEZXIuY29mZmVlIiwiL1VzZXJzL2xld2lzL1Jlc2VhcmNoL2RpZmZFUV9uZXcvYXBwL2RpcmVjdGl2ZXMvZGF0dW0uY29mZmVlIiwiL1VzZXJzL2xld2lzL1Jlc2VhcmNoL2RpZmZFUV9uZXcvYXBwL2RpcmVjdGl2ZXMvZG90LmNvZmZlZSIsIi9Vc2Vycy9sZXdpcy9SZXNlYXJjaC9kaWZmRVFfbmV3L2FwcC9kaXJlY3RpdmVzL2RvdEIuY29mZmVlIiwiL1VzZXJzL2xld2lzL1Jlc2VhcmNoL2RpZmZFUV9uZXcvYXBwL2RpcmVjdGl2ZXMvc2hpZnRlci5jb2ZmZWUiLCIvVXNlcnMvbGV3aXMvUmVzZWFyY2gvZGlmZkVRX25ldy9hcHAvZGlyZWN0aXZlcy90ZXh0dXJlLmNvZmZlZSIsIi9Vc2Vycy9sZXdpcy9SZXNlYXJjaC9kaWZmRVFfbmV3L2FwcC9kaXJlY3RpdmVzL3hBeGlzLmNvZmZlZSIsIi9Vc2Vycy9sZXdpcy9SZXNlYXJjaC9kaWZmRVFfbmV3L2FwcC9kaXJlY3RpdmVzL3lBeGlzLmNvZmZlZSIsIi9Vc2Vycy9sZXdpcy9SZXNlYXJjaC9kaWZmRVFfbmV3L2FwcC9oZWxwZXJzLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBLFlBQUEsQ0FBQTtBQUFBLElBQUEsd0JBQUE7O0FBQUEsT0FDQSxHQUFVLE9BQUEsQ0FBUSxTQUFSLENBRFYsQ0FBQTs7QUFBQSxFQUVBLEdBQUssT0FBQSxDQUFRLElBQVIsQ0FGTCxDQUFBOztBQUFBLEdBR0EsR0FBTSxPQUFPLENBQUMsTUFBUixDQUFlLFNBQWYsRUFBMEIsQ0FBQyxPQUFBLENBQVEsa0JBQVIsQ0FBRCxDQUExQixDQUNMLENBQUMsU0FESSxDQUNNLFlBRE4sRUFDb0IsT0FBQSxDQUFRLG9CQUFSLENBRHBCLENBRUwsQ0FBQyxTQUZJLENBRU0sWUFGTixFQUVvQixPQUFBLENBQVEsb0JBQVIsQ0FGcEIsQ0FHTCxDQUFDLFNBSEksQ0FHTSxZQUhOLEVBR29CLE9BQUEsQ0FBUSwyQkFBUixDQUhwQixDQUlMLENBQUMsU0FKSSxDQUlNLGdCQUpOLEVBSXdCLE9BQUEsQ0FBUSwrQkFBUixDQUp4QixDQUtMLENBQUMsU0FMSSxDQUtNLFNBTE4sRUFLa0IsT0FBQSxDQUFRLHNCQUFSLENBTGxCLENBTUwsQ0FBQyxTQU5JLENBTU0sWUFOTixFQU1vQixPQUFBLENBQVEsNkJBQVIsQ0FOcEIsQ0FPTCxDQUFDLFNBUEksQ0FPTSxVQVBOLEVBT2tCLE9BQUEsQ0FBUSx1QkFBUixDQVBsQixDQVFMLENBQUMsU0FSSSxDQVFNLFFBUk4sRUFRZ0IsT0FBQSxDQUFRLGtCQUFSLENBUmhCLENBU0wsQ0FBQyxTQVRJLENBU00sT0FUTixFQVNlLE9BQUEsQ0FBUSxvQkFBUixDQVRmLENBVUwsQ0FBQyxTQVZJLENBVU0sT0FWTixFQVVlLE9BQUEsQ0FBUSxvQkFB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Um9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiJ3VzZSBzdHJpY3QnXG5hbmd1bGFyID0gcmVxdWlyZSAnYW5ndWxhcidcbmQzID0gcmVxdWlyZSAnZDMnXG5hcHAgPSBhbmd1bGFyLm1vZHVsZSAnbWFpbkFwcCcsIFtyZXF1aXJlICdhbmd1bGFyLW1hdGVyaWFsJ11cblx0LmRpcmVjdGl2ZSAnaG9yQXhpc0RlcicsIHJlcXVpcmUgJy4vZGlyZWN0aXZlcy94QXhpcydcblx0LmRpcmVjdGl2ZSAndmVyQXhpc0RlcicsIHJlcXVpcmUgJy4vZGlyZWN0aXZlcy95QXhpcydcblx0LmRpcmVjdGl2ZSAnY2FydFNpbURlcicsIHJlcXVpcmUgJy4vY29tcG9uZW50cy9jYXJ0L2NhcnRTaW0nXG5cdC5kaXJlY3RpdmUgJ2NhcnRCdXR0b25zRGVyJywgcmVxdWlyZSAnLi9jb21wb25lbnRzL2NhcnQvY2FydEJ1dHRvbnMnXG5cdC5kaXJlY3RpdmUgJ3NoaWZ0ZXInICwgcmVxdWlyZSAnLi9kaXJlY3RpdmVzL3NoaWZ0ZXInXG5cdC5kaXJlY3RpdmUgJ2Rlc2lnbkFEZXInLCByZXF1aXJlICcuL2NvbXBvbmVudHMvZGVzaWduL2Rlc2lnbkEnXG5cdC5kaXJlY3RpdmUgJ2JlaGF2aW9yJywgcmVxdWlyZSAnLi9kaXJlY3RpdmVzL2JlaGF2aW9yJ1xuXHQuZGlyZWN0aXZlICdkb3REZXInLCByZXF1aXJlICcuL2RpcmVjdGl2ZXMvZG90J1xuXHQuZGlyZWN0aXZlICdkYXR1bScsIHJlcXVpcmUgJy4vZGlyZWN0aXZlcy9kYXR1bSdcblx0LmRpcmVjdGl2ZSAnZDNEZXInLCByZXF1aXJlICcuL2RpcmVjdGl2ZXMvZDNEZXInXG5cdC5kaXJlY3RpdmUgJ2Rlc2lnbkJEZXInICwgcmVxdWlyZSAnLi9jb21wb25lbnRzL2Rlc2lnbi9kZXNpZ25CJ1xuXHQuZGlyZWN0aXZlICdyZWd1bGFyRGVyJywgcmVxdWlyZSAnLi9jb21wb25lbnRzL3JlZ3VsYXIvcmVndWxhcidcblx0LmRpcmVjdGl2ZSAnZGVyaXZhdGl2ZURlcicsIHJlcXVpcmUgJy4vY29tcG9uZW50cy9kZXJpdmF0aXZlL2Rlcml2YXRpdmUnXG5cdC5kaXJlY3RpdmUgJ2Rlcml2YXRpdmVCRGVyJywgcmVxdWlyZSAnLi9jb21wb25lbnRzL2Rlcml2YXRpdmUvZGVyaXZhdGl2ZUInXG5cdC5kaXJlY3RpdmUgJ2RvdEJEZXInLCByZXF1aXJlICcuL2RpcmVjdGl2ZXMvZG90Qidcblx0LmRpcmVjdGl2ZSAnY2FydFBsb3REZXInLCByZXF1aXJlICcuL2NvbXBvbmVudHMvY2FydC9jYXJ0UGxvdCdcblx0LmRpcmVjdGl2ZSAnZGVzaWduQ2FydEFEZXInLCByZXF1aXJlICcuL2NvbXBvbmVudHMvZGVzaWduL2Rlc2lnbkNhcnRBJ1xuXHQuZGlyZWN0aXZlICdkZXNpZ25DYXJ0QkRlcicsIHJlcXVpcmUgJy4vY29tcG9uZW50cy9kZXNpZ24vZGVzaWduQ2FydEInXG5cdC5kaXJlY3RpdmUgJ3RleHR1cmVEZXInLCByZXF1aXJlICcuL2RpcmVjdGl2ZXMvdGV4dHVyZSdcblx0LmRpcmVjdGl2ZSAnZGVzaWduQnV0dG9uc0RlcicsIHJlcXVpcmUgJy4vY29tcG9uZW50cy9kZXNpZ24vZGVzaWduQnV0dG9ucydcblxubG9vcGVyID0gLT5cbiAgICBzZXRUaW1lb3V0KCAoKS0+XG4gICAgXHRcdFx0ZDMuc2VsZWN0QWxsICdjaXJjbGUuZG90LmxhcmdlJ1xuICAgIFx0XHRcdFx0LnRyYW5zaXRpb24gJ2dyb3cnXG4gICAgXHRcdFx0XHQuZHVyYXRpb24gNTAwXG4gICAgXHRcdFx0XHQuZWFzZSAnY3ViaWMtb3V0J1xuICAgIFx0XHRcdFx0LmF0dHIgJ3RyYW5zZm9ybScsICdzY2FsZSggMS4zNCknXG4gICAgXHRcdFx0XHQudHJhbnNpdGlvbiAnc2hyaW5rJ1xuICAgIFx0XHRcdFx0LmR1cmF0aW9uIDUwMFxuICAgIFx0XHRcdFx0LmVhc2UgJ2N1YmljLW91dCdcbiAgICBcdFx0XHRcdC5hdHRyICd0cmFuc2Zvcm0nLCAnc2NhbGUoIDEuMCknXG4gICAgXHRcdFx0bG9vcGVyKClcbiAgICBcdFx0LCAxMDAwKVxuXG5sb29wZXIoKVxuIiwiXyA9IHJlcXVpcmUgJ2xvZGFzaCdcbntleHAsIHNxcnQsIGF0YW59ID0gTWF0aFxuQ2FydCA9IHJlcXVpcmUgJy4vY2FydERhdGEnXG5cbnRlbXBsYXRlID0gJycnXG5cdDxkaXYgZmxleCBsYXlvdXQ9J3Jvdyc+XG5cdFx0PG1kLWJ1dHRvbiBmbGV4IGNsYXNzPVwibWQtcmFpc2VkXCIgbmctY2xpY2s9J3ZtLnBsYXkoKSc+UGxheTwvbWQtYnV0dG9uPlxuXHRcdDxtZC1idXR0b24gZmxleCBjbGFzcz1cIm1kLXJhaXNlZFwiIG5nLWNsaWNrPSd2bS5wYXVzZSgpJz5QYXVzZTwvbWQtYnV0dG9uPlxuXHQ8L2Rpdj5cbicnJ1xuXG5jbGFzcyBDdHJsXG5cdGNvbnN0cnVjdG9yOiAoQHNjb3BlKS0+XG5cdFx0QGNhcnQgPSBDYXJ0XG5cblx0cGxheTogLT5cblx0XHRDYXJ0LnBhdXNlZCA9IHRydWVcblx0XHRkMy50aW1lci5mbHVzaCgpXG5cdFx0QGNhcnQucmVzdGFydCgpXG5cdFx0Q2FydC5wYXVzZWQgPSBmYWxzZVxuXHRcdHNldFRpbWVvdXQgPT5cblx0XHRcdGxhc3QgPSAwXG5cdFx0XHRkMy50aW1lciAoZWxhcHNlZCk9PlxuXHRcdFx0XHRAY2FydC5pbmNyZW1lbnQgKGVsYXBzZWQgLSBsYXN0KS8xMDAwXG5cdFx0XHRcdGxhc3QgPSBlbGFwc2VkXG5cdFx0XHRcdGlmIChAY2FydC52IDwgLjAxKSB0aGVuIENhcnQucGF1c2VkID0gdHJ1ZVxuXHRcdFx0XHRAc2NvcGUuJGV2YWxBc3luYygpXG5cdFx0XHRcdENhcnQucGF1c2VkXG5cblx0cGF1c2U6IC0+XG5cdFx0Q2FydC5wYXVzZWQgPSB0cnVlXG5cbmRlciA9ICgpLT5cblx0ZGlyZWN0aXZlID0gXG5cdFx0Y29udHJvbGxlckFzOiAndm0nXG5cdFx0IyByZXN0cmljdDogJ0UnXG5cdFx0c2NvcGU6IHt9XG5cdFx0Y29udHJvbGxlcjogWyckc2NvcGUnLCBDdHJsXVxuXHRcdHRlbXBsYXRlOiB0ZW1wbGF0ZVxuXG5tb2R1bGUuZXhwb3J0cyA9IGRlciIsIl8gPSByZXF1aXJlICdsb2Rhc2gnXG57ZXhwfSA9IE1hdGhcblxuY2xhc3MgQ2FydFxuXHRjb25zdHJ1Y3RvcjogKEBvcHRpb25zKS0+XG5cdFx0e0B2MCwgQGt9ID0gQG9wdGlvbnNcblx0XHRAcmVzdGFydCgpXG5cdHJlc3RhcnQ6IC0+XG5cdFx0QHQgPSBAeCA9IDBcblx0XHRAdHJhamVjdG9yeSA9IF8ucmFuZ2UgMCAsIDYgLCAxLzUwXG5cdFx0XHQubWFwICh0KT0+XG5cdFx0XHRcdHYgPSBAdjAgKiBleHAoLUBrICogdClcblx0XHRcdFx0cmVzID0gXG5cdFx0XHRcdFx0djogdlxuXHRcdFx0XHRcdHg6IEB2MC9AayAqICgxLWV4cCgtQGsqdCkpXG5cdFx0XHRcdFx0ZHY6IC1Aayp2XG5cdFx0XHRcdFx0dDogdFxuXHRcdEBtb3ZlIDBcblx0XHRAcGF1c2VkID0gdHJ1ZVxuXHRzZXRfdDogKHQpLT5cblx0XHRAdCA9IHRcblx0XHRAbW92ZSB0XG5cdGluY3JlbWVudDogKGR0KS0+XG5cdFx0QHQrPWR0XG5cdFx0QG1vdmUgQHRcblx0bW92ZTogKHQpLT5cblx0XHRAdiA9IEB2MCAqIGV4cCggLUBrICogdClcblx0XHRAeCA9IEB2MC9AayAqICgxLWV4cCgtQGsqdCkpXG5cdFx0QGR2ID0gLUBrKkB2XG5cbm1vZHVsZS5leHBvcnRzID0gbmV3IENhcnQge3YwOiAyLCBrOiAuOH0iLCJhbmd1bGFyID0gcmVxdWlyZSAnYW5ndWxhcidcbmQzID0gcmVxdWlyZSAnZDMnXG5yZXF1aXJlICcuLi8uLi9oZWxwZXJzJ1xuXyA9IHJlcXVpcmUgJ2xvZGFzaCdcbkNhcnQgPSByZXF1aXJlICcuL2NhcnREYXRhJ1xudGVtcGxhdGUgPSAnJydcblx0PHN2ZyBuZy1pbml0PSd2bS5yZXNpemUoKScgd2lkdGg9JzEwMCUnIGNsYXNzPSd0b3BDaGFydCc+XG5cdFx0PGRlZnM+XG5cdFx0XHQ8Y2xpcHBhdGggaWQ9J2NhcnRQbG90Jz5cblx0XHRcdFx0PHJlY3QgZDMtZGVyPSd7d2lkdGg6IHZtLndpZHRoLCBoZWlnaHQ6IHZtLmhlaWdodH0nIC8+XG5cdFx0XHQ8L2NsaXBwYXRoPlxuXHRcdDwvZGVmcz5cblx0XHQ8ZyBjbGFzcz0nYm9pbGVycGxhdGUnIHNoaWZ0ZXI9J1t2bS5tYXIubGVmdCwgdm0ubWFyLnRvcF0nPlxuXHRcdFx0PHJlY3QgY2xhc3M9J2JhY2tncm91bmQnIGQzLWRlcj0ne3dpZHRoOiB2bS53aWR0aCwgaGVpZ2h0OiB2bS5oZWlnaHR9JyAvPlxuXHRcdFx0PGcgdmVyLWF4aXMtZGVyIHdpZHRoPSd2bS53aWR0aCcgc2NhbGU9J3ZtLlYnIGZ1bj0ndm0udmVyQXhGdW4nPjwvZz5cblx0XHRcdDxnIGhvci1heGlzLWRlciBoZWlnaHQ9J3ZtLmhlaWdodCcgc2NhbGU9J3ZtLlQnIGZ1bj0ndm0uaG9yQXhGdW4nIHNoaWZ0ZXI9J1swLHZtLmhlaWdodF0nPjwvZz5cblx0XHRcdDxmb3JlaWduT2JqZWN0IHdpZHRoPSczMCcgaGVpZ2h0PSczMCcgeT0nMTcnIHNoaWZ0ZXI9J1t2bS53aWR0aC8yLCB2bS5oZWlnaHRdJz5cblx0XHRcdFx0PHRleHQgY2xhc3M9J2xhYmVsJyA+JHQkPC90ZXh0PlxuXHRcdFx0PC9mb3JlaWduT2JqZWN0PlxuXHRcdFx0PGZvcmVpZ25PYmplY3Qgd2lkdGg9JzMwJyBoZWlnaHQ9JzMwJyBzaGlmdGVyPSdbLTMxLCB2bS5oZWlnaHQvMi04XSc+XG5cdFx0XHRcdFx0PHRleHQgY2xhc3M9J2xhYmVsJyA+JHYkPC90ZXh0PlxuXHRcdFx0PC9mb3JlaWduT2JqZWN0PlxuXHRcdFx0PGxpbmUgY2xhc3M9J3plcm8tbGluZScgZDMtZGVyPVwie3gxOiAwICwgeDI6IHZtLndpZHRoLCB5MTogdm0uVigwKSwgeTI6IHZtLlYoMCl9XCIgLz4gXG5cdFx0XHQ8bGluZSBjbGFzcz0nemVyby1saW5lJyBkMy1kZXI9XCJ7eDE6IHZtLlQoMCkgLCB4Mjogdm0uVCgwKSwgeTE6IDAsIHkyOiB2bS5oZWlnaHR9XCIgLz4gXG5cdFx0PC9nPlxuXHRcdDxnIGNsYXNzPSdtYWluJyBjbGlwLXBhdGg9XCJ1cmwoI2NhcnRQbG90KVwiIHNoaWZ0ZXI9J1t2bS5tYXIubGVmdCwgdm0ubWFyLnRvcF0nPlxuXHRcdFx0PGZvcmVpZ25PYmplY3Qgd2lkdGg9JzMwJyBoZWlnaHQ9JzMwJyBzaGlmdGVyPSdbKHZtLlQodm0ucG9pbnQudCkgLSAxNiksIHZtLnN0aGluZ10nIHN0eWxlPSdmb250LXNpemU6IDEzcHg7IGZvbnQtd2VpZ2h0OiAxMDA7Jz5cblx0XHRcdFx0XHQ8dGV4dCBjbGFzcz0nbGFiZWwnIGZvbnQtc2l6ZT0nMTNweCc+JHYkPC90ZXh0PlxuXHRcdFx0PC9mb3JlaWduT2JqZWN0PlxuXHRcdFx0PGxpbmUgY2xhc3M9J3RyaSB2JyBkMy1kZXI9J3t4MTogdm0uVCh2bS5wb2ludC50KS0xLCB4Mjogdm0uVCh2bS5wb2ludC50KS0xLCB5MTogdm0uVigwKSwgeTI6IHZtLlYodm0ucG9pbnQudil9Jy8+XG5cdFx0XHQ8cGF0aCBuZy1hdHRyLWQ9J3t7dm0ubGluZUZ1bih2bS50cmFqZWN0b3J5KX19JyBjbGFzcz0nZnVuIHYnIC8+XG5cdFx0XHQ8Y2lyY2xlIHI9JzNweCcgc2hpZnRlcj0nW3ZtLlQodm0ucG9pbnQudCksIHZtLlYodm0ucG9pbnQudildJyBjbGFzcz0ncG9pbnQgdicvPlxuXHRcdDwvZz5cblx0PC9zdmc+XG4nJydcblxuY2xhc3MgQ3RybFxuXHRjb25zdHJ1Y3RvcjogKEBzY29wZSwgQGVsLCBAd2luZG93KS0+XG5cdFx0QG1hciA9IFxuXHRcdFx0bGVmdDogMzBcblx0XHRcdHRvcDogMjBcblx0XHRcdHJpZ2h0OiAyMFxuXHRcdFx0Ym90dG9tOiAzNVxuXG5cdFx0QFYgPSBkMy5zY2FsZS5saW5lYXIoKS5kb21haW4gWy0uMSwyLjVdXG5cdFx0QFQgPSBkMy5zY2FsZS5saW5lYXIoKS5kb21haW4gWy0uMSw1XVxuXG5cdFx0QHBvaW50ID0gQ2FydFxuXHRcdEB0cmFqZWN0b3J5ID0gQ2FydC50cmFqZWN0b3J5XG5cblx0XHRAaG9yQXhGdW4gPSBkMy5zdmcuYXhpcygpXG5cdFx0XHQuc2NhbGUgQFRcblx0XHRcdC50aWNrcyA1XG5cdFx0XHQub3JpZW50ICdib3R0b20nXG5cblx0XHRAdmVyQXhGdW4gPSBkMy5zdmcuYXhpcygpXG5cdFx0XHQuc2NhbGUgQFZcblx0XHRcdC50aWNrcyA1XG5cdFx0XHQub3JpZW50ICdsZWZ0J1xuXHRcdFxuXHRcdEBsaW5lRnVuID0gZDMuc3ZnLmxpbmUoKVxuXHRcdFx0LnkgKGQpPT4gQFYgZC52XG5cdFx0XHQueCAoZCk9PiBAVCBkLnRcblxuXHRcdGFuZ3VsYXIuZWxlbWVudCBAd2luZG93XG5cdFx0XHQub24gJ3Jlc2l6ZScsIEByZXNpemVcblxuXHRcdEBtb3ZlID0gKGV2ZW50KSA9PlxuXHRcdFx0aWYgbm90IENhcnQucGF1c2VkIHRoZW4gcmV0dXJuXG5cdFx0XHRyZWN0ID0gZXZlbnQudGFyZ2V0LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpXG5cdFx0XHR0ID0gQFQuaW52ZXJ0IGV2ZW50LnggLSByZWN0LmxlZnRcblx0XHRcdHQgPSBNYXRoLm1heCAwICwgdFxuXHRcdFx0Q2FydC5zZXRfdCB0XG5cdFx0XHRAc2NvcGUuJGV2YWxBc3luYygpXG5cblx0QHByb3BlcnR5ICdzdGhpbmcnLCBnZXQ6LT5cblx0XHRAVihAcG9pbnQudi8yKSAtIDdcblxuXHRAcHJvcGVydHkgJ3N2Z19oZWlnaHQnLCBnZXQ6IC0+IEBoZWlnaHQgKyBAbWFyLnRvcCArIEBtYXIuYm90dG9tXG5cblx0cmVzaXplOiAoKT0+XG5cdFx0QHdpZHRoID0gQGVsWzBdLmNsaWVudFdpZHRoIC0gQG1hci5sZWZ0IC0gQG1hci5yaWdodFxuXHRcdEBoZWlnaHQgPSBAZWxbMF0uY2xpZW50SGVpZ2h0IC0gQG1hci5sZWZ0IC0gQG1hci5yaWdodFxuXHRcdEBWLnJhbmdlIFtAaGVpZ2h0LCAwXVxuXHRcdEBULnJhbmdlIFswLCBAd2lkdGhdXG5cdFx0QHNjb3BlLiRldmFsQXN5bmMoKVxuXG5kZXIgPSAoKS0+XG5cdGRpcmVjdGl2ZSA9IFxuXHRcdGNvbnRyb2xsZXJBczogJ3ZtJ1xuXHRcdHNjb3BlOiB7fVxuXHRcdHRlbXBsYXRlOiB0ZW1wbGF0ZVxuXHRcdHRlbXBsYXRlTmFtZXNwYWNlOiAnc3ZnJ1xuXHRcdGNvbnRyb2xsZXI6IFsnJHNjb3BlJywnJGVsZW1lbnQnLCAnJHdpbmRvdycsIEN0cmxdXG5cbm1vZHVsZS5leHBvcnRzID0gZGVyXG4iLCJfID0gcmVxdWlyZSAnbG9kYXNoJ1xuZDM9IHJlcXVpcmUgJ2QzJ1xue21pbn0gPSBNYXRoXG5DYXJ0ID0gcmVxdWlyZSAnLi9jYXJ0RGF0YSdcbnJlcXVpcmUgJy4uLy4uL2hlbHBlcnMnXG5cbnRlbXBsYXRlID0gJycnXG5cdDxzdmcgbmctaW5pdD0ndm0ucmVzaXplKCknIHdpZHRoPScxMDAlJyBuZy1hdHRyLWhlaWdodD0ne3t2bS5zdmdfaGVpZ2h0fX0nPlxuXHRcdDxnIHNoaWZ0ZXI9J3t7Ojpbdm0ubWFyLmxlZnQsIHZtLm1hci50b3BdfX0nPlxuXHRcdFx0PHJlY3QgY2xhc3M9J2JhY2tncm91bmQnIGQzLWRlcj0ne3dpZHRoOiB2bS53aWR0aCwgaGVpZ2h0OiB2bS5oZWlnaHR9JyBuZy1tb3VzZW1vdmU9J3ZtLm1vdmUoJGV2ZW50KScgLz5cblx0XHRcdDxnIGhvci1heGlzLWRlciBoZWlnaHQ9J3ZtLmhlaWdodCcgc2NhbGU9J3ZtLlgnIGZ1bj0ndm0uYXhpc0Z1bicgc2hpZnRlcj0nWzAsdm0uaGVpZ2h0XSc+PC9nPlxuXG5cdFx0XHQ8Zm9yZWlnbk9iamVjdCB3aWR0aD0nMzAnIGhlaWdodD0nMzAnIHk9JzIwJyBzaGlmdGVyPSdbdm0ud2lkdGgvMiwgdm0uaGVpZ2h0XSc+XG5cdFx0XHRcdFx0PHRleHQgY2xhc3M9J2xhYmVsJyA+JHQkPC90ZXh0PlxuXHRcdFx0PC9mb3JlaWduT2JqZWN0PlxuXHRcdFx0PGcgY2xhc3M9J2ctY2FydCcgZDMtZGVyPSd7dHJhbnNmb3JtOiBcInRyYW5zbGF0ZShcIiArIHZtLlgodm0uQ2FydC54KSArIFwiLDApXCJ9JyB0cmFuPSd2bS50cmFuJz5cblx0XHRcdFx0XHQ8cmVjdCBjbGFzcz0nY2FydCcgeD0nLTEyLjUnIHdpZHRoPScyNScgbmctYXR0ci15PSd7ezMwLTEyLjV9fScgaGVpZ2h0PScyNScvPlxuXHRcdFx0PC9nPlxuXHRcdDwvZz5cblx0PC9zdmc+XG4nJydcblxuY2xhc3MgQ3RybFxuXHRjb25zdHJ1Y3RvcjogKEBzY29wZSwgQGVsLCBAd2luZG93KS0+XG5cdFx0QENhcnQgPSBDYXJ0XG5cdFx0QG1hciA9IFxuXHRcdFx0bGVmdDogMzBcblx0XHRcdHJpZ2h0OiAxMFxuXHRcdFx0dG9wOiAxMFxuXHRcdFx0Ym90dG9tOiAxOFxuXHRcdEBYID0gZDMuc2NhbGUubGluZWFyKCkuZG9tYWluIFstLjEsM10gXG5cblx0XHRAYXhpc0Z1biA9IGQzLnN2Zy5heGlzKClcblx0XHRcdC5zY2FsZSBAWFxuXHRcdFx0LnRpY2tzIDVcblx0XHRcdC5vcmllbnQgJ2JvdHRvbSdcblxuXHRcdGFuZ3VsYXIuZWxlbWVudCBAd2luZG93XG5cdFx0XHQub24gJ3Jlc2l6ZScgLCAoKT0+QHJlc2l6ZSgpXG5cblx0dHJhbjogKHRyYW4pLT5cblx0XHR0cmFuLmVhc2UgJ2xpbmVhcidcblx0XHRcdC5kdXJhdGlvbiA2MFxuXG5cdEBwcm9wZXJ0eSAnc3ZnX2hlaWdodCcgLCBnZXQ6LT4gQGhlaWdodCArIEBtYXIudG9wICsgQG1hci5ib3R0b21cblxuXHRyZXNpemU6ICgpPT5cblx0XHRAd2lkdGggPSBAZWxbMF0uY2xpZW50V2lkdGggLSBAbWFyLmxlZnQgLSBAbWFyLnJpZ2h0XG5cdFx0QGhlaWdodCA9IEB3aWR0aCouMyAtIEBtYXIudG9wIC0gQG1hci5ib3R0b21cblx0XHRAWC5yYW5nZShbMCwgQHdpZHRoXSlcblx0XHRAc2NvcGUuJGV2YWxBc3luYygpXG5cblxuXG5kZXIgPSAoKS0+XG5cdGRpcmVjdGl2ZSA9IFxuXHRcdHRlbXBsYXRlOiB0ZW1wbGF0ZVxuXHRcdHNjb3BlOiB7fVxuXHRcdHJlc3RyaWN0OiAnQSdcblx0XHRiaW5kVG9Db250cm9sbGVyOiB0cnVlXG5cdFx0dGVtcGxhdGVOYW1lc3BhY2U6ICdzdmcnXG5cdFx0Y29udHJvbGxlcjogWyckc2NvcGUnLCAnJGVsZW1lbnQnLCAnJHdpbmRvdycsIEN0cmxdXG5cdFx0Y29udHJvbGxlckFzOiAndm0nXG5cbm1vZHVsZS5leHBvcnRzID0gZGVyXG4iLCJhbmd1bGFyID0gcmVxdWlyZSAnYW5ndWxhcidcbmQzID0gcmVxdWlyZSAnZDMnXG5yZXF1aXJlICcuLi8uLi9oZWxwZXJzJ1xuXyA9IHJlcXVpcmUgJ2xvZGFzaCdcbkRhdGEgPSByZXF1aXJlICcuL2Rlcml2YXRpdmVEYXRhJ1xuXG50ZW1wbGF0ZSA9ICcnJ1xuXHQ8c3ZnIG5nLWluaXQ9J3ZtLnJlc2l6ZSgpJyB3aWR0aD0nMTAwJScgY2xhc3M9J3RvcENoYXJ0Jz5cblx0XHQ8ZGVmcz5cblx0XHRcdDxjbGlwcGF0aCBpZD0nZGVyQ2xpcCc+XG5cdFx0XHRcdDxyZWN0IGQzLWRlcj0ne3dpZHRoOiB2bS53aWR0aCwgaGVpZ2h0OiB2bS5oZWlnaHR9Jz48L3JlY3Q+XG5cdFx0XHQ8L2NsaXBwYXRoPlxuXHRcdDwvZGVmcz5cblx0XHQ8ZyBjbGFzcz0nYm9pbGVycGxhdGUnIHNoaWZ0ZXI9J1t2bS5tYXIubGVmdCwgdm0ubWFyLnRvcF0nPlxuXHRcdFx0PHJlY3QgY2xhc3M9J2JhY2tncm91bmQnIGQzLWRlcj0ne3dpZHRoOiB2bS53aWR0aCwgaGVpZ2h0OiB2bS5oZWlnaHR9JyBuZy1tb3VzZW1vdmU9J3ZtLm1vdmUoJGV2ZW50KScgLz5cblx0XHRcdDxnIHZlci1heGlzLWRlciB3aWR0aD0ndm0ud2lkdGgnIHNjYWxlPSd2bS5WZXInIGZ1bj0ndm0udmVyQXhGdW4nPjwvZz5cblx0XHRcdDxnIGhvci1heGlzLWRlciBoZWlnaHQ9J3ZtLmhlaWdodCcgc2NhbGU9J3ZtLkhvcicgZnVuPSd2bS5ob3JBeEZ1bicgc2hpZnRlcj0nWzAsdm0uaGVpZ2h0XSc+PC9nPlxuXHRcdFx0PGZvcmVpZ25PYmplY3Qgd2lkdGg9JzMwJyBoZWlnaHQ9JzMwJyB5PScxNycgc2hpZnRlcj0nW3ZtLndpZHRoLzIsIHZtLmhlaWdodF0nPlxuXHRcdFx0XHRcdDx0ZXh0IGNsYXNzPSdsYWJlbCcgPiR0JDwvdGV4dD5cblx0XHRcdDwvZm9yZWlnbk9iamVjdD5cblx0XHQ8L2c+XG5cdFx0PGcgY2xhc3M9J21haW4nIGNsaXAtcGF0aD1cInVybCgjZGVyQ2xpcClcIiBzaGlmdGVyPSdbdm0ubWFyLmxlZnQsIHZtLm1hci50b3BdJz5cblx0XHRcdDxsaW5lIGNsYXNzPSd6ZXJvLWxpbmUgaG9yJyBkMy1kZXI9J3t4MTogMCwgeDI6IHZtLndpZHRoLCB5MTogdm0uVmVyKDApLCB5Mjogdm0uVmVyKDApfScvPlxuXHRcdFx0PHBhdGggbmctYXR0ci1kPSd7e3ZtLmxpbmVGdW4odm0uZGF0YSl9fScgY2xhc3M9J2Z1biB2JyAvPlxuXHRcdFx0PHBhdGggbmctYXR0ci1kPSd7e3ZtLnRyaWFuZ2xlRGF0YX19JyBjbGFzcz0ndHJpJyAvPlxuXHRcdFx0PGxpbmUgY2xhc3M9J3RyaSBkdicgZDMtZGVyPSd7eDE6IHZtLkhvcih2bS5wb2ludC50KS0xLCB4Mjogdm0uSG9yKHZtLnBvaW50LnQpLTEsIHkxOiB2bS5WZXIodm0ucG9pbnQudiksIHkyOiB2bS5WZXIoKHZtLnBvaW50LnYgKyB2bS5wb2ludC5kdikpfScvPlxuXHRcdFx0PGZvcmVpZ25PYmplY3Qgd2lkdGg9JzMwJyBoZWlnaHQ9JzMwJyBzaGlmdGVyPSdbKHZtLkhvcih2bS5wb2ludC50KSAtIDE2KSwgdm0uc3RoaW5nXSc+XG5cdFx0XHRcdFx0PHRleHQgY2xhc3M9J3RyaS1sYWJlbCcgPiRcXFxcZG90e3l9JDwvdGV4dD5cblx0XHRcdDwvZm9yZWlnbk9iamVjdD5cblx0XHRcdDxjaXJjbGUgcj0nM3B4JyAgc2hpZnRlcj0nW3ZtLkhvcih2bS5wb2ludC50KSwgdm0uVmVyKHZtLnBvaW50LnYpXScgY2xhc3M9J3BvaW50IHYnLz5cblx0XHQ8L2c+XG5cdDwvc3ZnPlxuJycnXG5cdFx0XHRcbmNsYXNzIEN0cmxcblx0Y29uc3RydWN0b3I6IChAc2NvcGUsIEBlbCwgQHdpbmRvdyktPlxuXHRcdEBtYXIgPSBcblx0XHRcdGxlZnQ6IDMwXG5cdFx0XHR0b3A6IDIwXG5cdFx0XHRyaWdodDogMjBcblx0XHRcdGJvdHRvbTogMzVcblxuXHRcdEBWZXIgPSBkMy5zY2FsZS5saW5lYXIoKS5kb21haW4gWy0xLjUsMS41XVxuXHRcdEBIb3IgPSBkMy5zY2FsZS5saW5lYXIoKS5kb21haW4gWzAsNl1cblxuXHRcdEBkYXRhID0gRGF0YS5kYXRhXG5cblx0XHRAaG9yQXhGdW4gPSBkMy5zdmcuYXhpcygpXG5cdFx0XHQuc2NhbGUgQEhvclxuXHRcdFx0LnRpY2tzIDVcblx0XHRcdC5vcmllbnQgJ2JvdHRvbSdcblxuXHRcdEB2ZXJBeEZ1biA9IGQzLnN2Zy5heGlzKClcblx0XHRcdC5zY2FsZSBAVmVyXG5cdFx0XHQudGlja0Zvcm1hdCAoZCktPlxuXHRcdFx0XHRpZiBNYXRoLmZsb29yKCBkICkgIT0gZCB0aGVuIHJldHVyblxuXHRcdFx0XHRkXG5cdFx0XHQudGlja3MgNVxuXHRcdFx0Lm9yaWVudCAnbGVmdCdcblxuXHRcdEBsaW5lRnVuID0gZDMuc3ZnLmxpbmUoKVxuXHRcdFx0LnkgKGQpPT4gQFZlciBkLnZcblx0XHRcdC54IChkKT0+IEBIb3IgZC50XG5cblx0XHRhbmd1bGFyLmVsZW1lbnQgQHdpbmRvd1xuXHRcdFx0Lm9uICdyZXNpemUnLCBAcmVzaXplXG5cblx0XHRAbW92ZSA9IChldmVudCkgPT5cblx0XHRcdHQgPSBASG9yLmludmVydCBldmVudC54IC0gZXZlbnQudGFyZ2V0LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLmxlZnRcblx0XHRcdERhdGEubW92ZSB0XG5cdFx0XHRAc2NvcGUuJGV2YWxBc3luYygpXG5cblx0QHByb3BlcnR5ICdzdmdfaGVpZ2h0JywgZ2V0OiAtPiBAaGVpZ2h0ICsgQG1hci50b3AgKyBAbWFyLmJvdHRvbVxuXG5cdEBwcm9wZXJ0eSAnc3RoaW5nJywgZ2V0Oi0+XG5cdFx0QFZlcihAcG9pbnQuZHYvMiArIEBwb2ludC52KSAtIDdcblxuXHRAcHJvcGVydHkgJ3BvaW50JywgZ2V0Oi0+XG5cdFx0RGF0YS5wb2ludFxuXG5cdEBwcm9wZXJ0eSAndHJpYW5nbGVEYXRhJywgZ2V0Oi0+XG5cdFx0QGxpbmVGdW4gW3t2OiBAcG9pbnQudiwgdDogQHBvaW50LnR9LCB7djpAcG9pbnQuZHYgKyBAcG9pbnQudiwgdDogQHBvaW50LnQrMX0sIHt2OiBAcG9pbnQuZHYgKyBAcG9pbnQudiwgdDogQHBvaW50LnR9XVxuXG5cdHJlc2l6ZTogKCk9PlxuXHRcdEB3aWR0aCA9IEBlbFswXS5jbGllbnRXaWR0aCAtIEBtYXIubGVmdCAtIEBtYXIucmlnaHRcblx0XHRAaGVpZ2h0ID0gQGVsWzBdLmNsaWVudEhlaWdodCAtIEBtYXIudG9wIC0gQG1hci5ib3R0b20gLSA4XG5cdFx0QFZlci5yYW5nZSBbQGhlaWdodCwgMF1cblx0XHRASG9yLnJhbmdlIFswLCBAd2lkdGhdXG5cdFx0QHNjb3BlLiRldmFsQXN5bmMoKVxuXG5kZXIgPSAoKS0+XG5cdGRpcmVjdGl2ZSA9IFxuXHRcdGNvbnRyb2xsZXJBczogJ3ZtJ1xuXHRcdHNjb3BlOiB7fVxuXHRcdHRlbXBsYXRlOiB0ZW1wbGF0ZVxuXHRcdHRlbXBsYXRlTmFtZXNwYWNlOiAnc3ZnJ1xuXHRcdGNvbnRyb2xsZXI6IFsnJHNjb3BlJywnJGVsZW1lbnQnLCAnJHdpbmRvdycsIEN0cmxdXG5cbm1vZHVsZS5leHBvcnRzID0gZGVyXG4iLCJhbmd1bGFyID0gcmVxdWlyZSAnYW5ndWxhcidcbmQzID0gcmVxdWlyZSAnZDMnXG5yZXF1aXJlICcuLi8uLi9oZWxwZXJzJ1xuXyA9IHJlcXVpcmUgJ2xvZGFzaCdcbkRhdGEgPSByZXF1aXJlICcuL2Rlcml2YXRpdmVEYXRhJ1xuXG50ZW1wbGF0ZSA9ICcnJ1xuXHQ8c3ZnIG5nLWluaXQ9J3ZtLnJlc2l6ZSgpJyB3aWR0aD0nMTAwJScgIGNsYXNzPSd0b3BDaGFydCc+XG5cdFx0PGRlZnM+XG5cdFx0XHQ8Y2xpcHBhdGggaWQ9J2RlcnZhdGl2ZUInPlxuXHRcdFx0XHQ8cmVjdCBkMy1kZXI9J3t3aWR0aDogdm0ud2lkdGgsIGhlaWdodDogdm0uaGVpZ2h0fScgLz5cblx0XHRcdDwvY2xpcHBhdGg+XG5cdFx0PC9kZWZzPlxuXHRcdDxnIGNsYXNzPSdib2lsZXJwbGF0ZScgc2hpZnRlcj0nW3ZtLm1hci5sZWZ0LCB2bS5tYXIudG9wXSc+XG5cdFx0XHQ8cmVjdCBjbGFzcz0nYmFja2dyb3VuZCcgZDMtZGVyPSd7d2lkdGg6IHZtLndpZHRoLCBoZWlnaHQ6IHZtLmhlaWdodH0nIG5nLW1vdXNlbW92ZT0ndm0ubW92ZSgkZXZlbnQpJyAvPlxuXHRcdFx0PGcgdmVyLWF4aXMtZGVyIHdpZHRoPSd2bS53aWR0aCcgc2NhbGU9J3ZtLlZlcicgZnVuPSd2bS52ZXJBeEZ1bic+PC9nPlxuXHRcdFx0PGcgaG9yLWF4aXMtZGVyIGhlaWdodD0ndm0uaGVpZ2h0JyBzY2FsZT0ndm0uSG9yJyBmdW49J3ZtLmhvckF4RnVuJyBzaGlmdGVyPSdbMCx2bS5oZWlnaHRdJz48L2c+XG5cdFx0XHQ8Zm9yZWlnbk9iamVjdCB3aWR0aD0nMzAnIGhlaWdodD0nMzAnIHk9JzE3JyBzaGlmdGVyPSdbdm0ud2lkdGgvMiwgdm0uaGVpZ2h0XSc+XG5cdFx0XHRcdFx0PHRleHQgY2xhc3M9J2xhYmVsJyA+JHQkPC90ZXh0PlxuXHRcdFx0PC9mb3JlaWduT2JqZWN0PlxuXHRcdDwvZz5cblx0XHQ8ZyBjbGFzcz0nbWFpbicgY2xpcC1wYXRoPVwidXJsKCNkZXJ2YXRpdmVCKVwiIHNoaWZ0ZXI9J1t2bS5tYXIubGVmdCwgdm0ubWFyLnRvcF0nPlxuXHRcdFx0PGxpbmUgY2xhc3M9J3plcm8tbGluZSBob3InIGQzLWRlcj0ne3gxOiAwLCB4Mjogdm0ud2lkdGgsIHkxOiB2bS5WZXIoMCksIHkyOiB2bS5WZXIoMCl9Jy8+XG5cdFx0XHQ8cGF0aCBkMy1kZXI9J3tkOnZtLmxpbmVGdW4odm0uZGF0YSl9JyBjbGFzcz0nZnVuIGR2JyAvPlxuXHRcdFx0PGxpbmUgY2xhc3M9J3RyaSBkdicgZDMtZGVyPSd7eDE6IHZtLkhvcih2bS5wb2ludC50KS0xLCB4Mjogdm0uSG9yKHZtLnBvaW50LnQpLTEsIHkxOiB2bS5WZXIoMCksIHkyOiB2bS5WZXIodm0ucG9pbnQuZHYpfScvPlxuXHRcdFx0PGZvcmVpZ25PYmplY3Qgd2lkdGg9JzMwJyBoZWlnaHQ9JzMwJyBzaGlmdGVyPSdbKHZtLkhvcih2bS5wb2ludC50KSAtIDE2KSwgdm0uVmVyKHZtLnBvaW50LmR2Ki41KS02XSc+XG5cdFx0XHRcdFx0PHRleHQgY2xhc3M9J3RyaS1sYWJlbCc+JFxcXFxkb3R7eX0kPC90ZXh0PlxuXHRcdFx0PC9mb3JlaWduT2JqZWN0PlxuXHRcdFx0PGNpcmNsZSByPSczcHgnICBzaGlmdGVyPSdbdm0uSG9yKHZtLnBvaW50LnQpLCB2bS5WZXIodm0ucG9pbnQuZHYpXScgY2xhc3M9J3BvaW50IGR2Jy8+XG5cdFx0PC9nPlxuXHQ8L3N2Zz5cbicnJ1xuXHRcdFx0XG5jbGFzcyBDdHJsXG5cdGNvbnN0cnVjdG9yOiAoQHNjb3BlLCBAZWwsIEB3aW5kb3cpLT5cblx0XHRAbWFyID0gXG5cdFx0XHRsZWZ0OiAzMFxuXHRcdFx0dG9wOiAyMFxuXHRcdFx0cmlnaHQ6IDIwXG5cdFx0XHRib3R0b206IDM1XG5cblx0XHRAVmVyID0gZDMuc2NhbGUubGluZWFyKCkuZG9tYWluIFstMS41LDEuNV1cblx0XHRASG9yID0gZDMuc2NhbGUubGluZWFyKCkuZG9tYWluIFswLDZdXG5cblx0XHRAZGF0YSA9IERhdGEuZGF0YVxuXG5cdFx0QGhvckF4RnVuID0gZDMuc3ZnLmF4aXMoKVxuXHRcdFx0LnNjYWxlIEBIb3Jcblx0XHRcdC50aWNrcyA1XG5cdFx0XHQub3JpZW50ICdib3R0b20nXG5cblx0XHRAdmVyQXhGdW4gPSBkMy5zdmcuYXhpcygpXG5cdFx0XHQuc2NhbGUgQFZlclxuXHRcdFx0LnRpY2tGb3JtYXQgKGQpLT5cblx0XHRcdFx0aWYgTWF0aC5mbG9vciggZCApICE9IGQgdGhlbiByZXR1cm5cblx0XHRcdFx0ZFxuXHRcdFx0LnRpY2tzIDVcblx0XHRcdC5vcmllbnQgJ2xlZnQnXG5cblx0XHRAbGluZUZ1biA9IGQzLnN2Zy5saW5lKClcblx0XHRcdC55IChkKT0+IEBWZXIgZC5kdlxuXHRcdFx0LnggKGQpPT4gQEhvciBkLnRcblxuXHRcdGFuZ3VsYXIuZWxlbWVudCBAd2luZG93XG5cdFx0XHQub24gJ3Jlc2l6ZScsIEByZXNpemVcblxuXHRcdEBtb3ZlID0gKGV2ZW50KSA9PlxuXHRcdFx0dCA9IEBIb3IuaW52ZXJ0IGV2ZW50LnggLSBldmVudC50YXJnZXQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkubGVmdFxuXHRcdFx0RGF0YS5tb3ZlIHRcblx0XHRcdEBzY29wZS4kZXZhbEFzeW5jKClcblxuXHRAcHJvcGVydHkgJ3N2Z19oZWlnaHQnLCBnZXQ6IC0+IEBoZWlnaHQgKyBAbWFyLnRvcCArIEBtYXIuYm90dG9tXG5cblx0QHByb3BlcnR5ICdwb2ludCcsIGdldDotPlxuXHRcdERhdGEucG9pbnRcblxuXHRyZXNpemU6ICgpPT5cblx0XHRAd2lkdGggPSBAZWxbMF0uY2xpZW50V2lkdGggLSBAbWFyLmxlZnQgLSBAbWFyLnJpZ2h0XG5cdFx0QGhlaWdodCA9IEBlbFswXS5jbGllbnRIZWlnaHQgLSBAbWFyLnRvcCAtIEBtYXIuYm90dG9tXG5cdFx0QFZlci5yYW5nZSBbQGhlaWdodCwgMF1cblx0XHRASG9yLnJhbmdlIFswLCBAd2lkdGhdXG5cdFx0QHNjb3BlLiRldmFsQXN5bmMoKVxuXG5kZXIgPSAoKS0+XG5cdGRpcmVjdGl2ZSA9IFxuXHRcdGNvbnRyb2xsZXJBczogJ3ZtJ1xuXHRcdHNjb3BlOiB7fVxuXHRcdHRlbXBsYXRlOiB0ZW1wbGF0ZVxuXHRcdHRlbXBsYXRlTmFtZXNwYWNlOiAnc3ZnJ1xuXHRcdGNvbnRyb2xsZXI6IFsnJHNjb3BlJywnJGVsZW1lbnQnLCAnJHdpbmRvdycsIEN0cmxdXG5cbm1vZHVsZS5leHBvcnRzID0gZGVyXG4iLCJfID0gcmVxdWlyZSAnbG9kYXNoJ1xudkZ1biA9IE1hdGguc2luXG5kdkZ1biA9IE1hdGguY29zXG5cbmNsYXNzIERhdGFcblx0Y29uc3RydWN0b3I6IC0+XG5cdFx0QGRhdGEgPSBfLnJhbmdlIDAgLCA4ICwgMS81MFxuXHRcdFx0Lm1hcCAodCktPlxuXHRcdFx0XHRyZXMgPSBcblx0XHRcdFx0XHRkdjogZHZGdW4gdFxuXHRcdFx0XHRcdHY6IHZGdW4gdFxuXHRcdFx0XHRcdHQ6IHRcblxuXHRcdEBwb2ludCA9IF8uc2FtcGxlIEBkYXRhXG5cblx0bW92ZTogKHQpLT5cblx0XHRAcG9pbnQgPSBcblx0XHRcdGR2OiBkdkZ1biB0XG5cdFx0XHR2OiB2RnVuIHRcblx0XHRcdHQ6IHRcblxubW9kdWxlLmV4cG9ydHMgPSBuZXcgRGF0YSIsImFuZ3VsYXIgPSByZXF1aXJlICdhbmd1bGFyJ1xuZDMgPSByZXF1aXJlICdkMydcbkRhdGEgPSByZXF1aXJlICcuL2Rlc2lnbkRhdGEnXG5yZXF1aXJlICcuLi8uLi9oZWxwZXJzJ1xudGVtcGxhdGUgPSAnJydcblx0PHN2ZyBuZy1pbml0PSd2bS5yZXNpemUoKScgd2lkdGg9JzEwMCUnIGNsYXNzPSdib3R0b21DaGFydCc+XG5cdFx0PGRlZnM+XG5cdFx0XHQ8Y2xpcHBhdGggaWQ9J3Bsb3RBJz5cblx0XHRcdFx0PHJlY3QgZDMtZGVyPSd7d2lkdGg6IHZtLndpZHRoLCBoZWlnaHQ6IHZtLmhlaWdodH0nPjwvcmVjdD5cblx0XHRcdDwvY2xpcHBhdGg+XG5cdFx0PC9kZWZzPlxuXHRcdDxnIGNsYXNzPSdib2lsZXJwbGF0ZScgc2hpZnRlcj0nW3ZtLm1hci5sZWZ0LCB2bS5tYXIudG9wXSc+XG5cdFx0XHQ8cmVjdCBjbGFzcz0nYmFja2dyb3VuZCcgZDMtZGVyPSd7d2lkdGg6IHZtLndpZHRoLCBoZWlnaHQ6IHZtLmhlaWdodH0nIGJlaGF2aW9yPSd2bS5kcmFnX3JlY3QnIC8+XG5cdFx0XHQ8ZyB2ZXItYXhpcy1kZXIgd2lkdGg9J3ZtLndpZHRoJyBzY2FsZT0ndm0uVmVyJyBmdW49J3ZtLnZlckF4RnVuJz48L2c+XG5cdFx0XHQ8ZyBob3ItYXhpcy1kZXIgaGVpZ2h0PSd2bS5oZWlnaHQnIHNjYWxlPSd2bS5Ib3InIGZ1bj0ndm0uaG9yQXhGdW4nIHNoaWZ0ZXI9J1swLHZtLmhlaWdodF0nPjwvZz5cblx0XHRcdDxmb3JlaWduT2JqZWN0IHdpZHRoPSczMCcgaGVpZ2h0PSczMCcgc2hpZnRlcj0nWy0zMSwgdm0uaGVpZ2h0LzJdJz5cblx0XHRcdFx0XHQ8dGV4dCBjbGFzcz0nbGFiZWwnPiR2JDwvdGV4dD5cblx0XHRcdDwvZm9yZWlnbk9iamVjdD5cblx0XHRcdDxmb3JlaWduT2JqZWN0IHdpZHRoPSczMCcgaGVpZ2h0PSczMCcgc2hpZnRlcj0nW3ZtLndpZHRoLzIsIHZtLmhlaWdodF0nPlxuXHRcdFx0XHRcdDx0ZXh0IGNsYXNzPSdsYWJlbCcgPiR0JDwvdGV4dD5cblx0XHRcdDwvZm9yZWlnbk9iamVjdD5cblx0XHQ8L2c+XG5cdFx0PGcgY2xhc3M9J21haW4nIGNsaXAtcGF0aD1cInVybCgjcGxvdEEpXCIgc2hpZnRlcj0nW3ZtLm1hci5sZWZ0LCB2bS5tYXIudG9wXScgPlxuXHRcdFx0PGxpbmUgY2xhc3M9J3plcm8tbGluZScgZDMtZGVyPSd7eDE6IDAsIHgyOiB2bS53aWR0aCwgeTE6IHZtLlZlcigwKSwgeTI6IHZtLlZlcigwKX0nIC8+XG5cdFx0XHQ8bGluZSBjbGFzcz0nemVyby1saW5lJyBkMy1kZXI9XCJ7eDE6IHZtLkhvcigwKSwgeDI6IHZtLkhvcigwKSwgeTE6IHZtLmhlaWdodCwgeTI6IDB9XCIgLz5cblx0XHRcdDxnIG5nLWNsYXNzPSd7aGlkZTogIXZtLkRhdGEuc2hvd30nID5cblx0XHRcdFx0PGxpbmUgY2xhc3M9J3RyaSB2JyBkMy1kZXI9J3t4MTogdm0uSG9yKHZtLnBvaW50LnQpLTEsIHgyOiB2bS5Ib3Iodm0ucG9pbnQudCktMSwgeTE6IHZtLlZlcigwKSwgeTI6IHZtLlZlcih2bS5wb2ludC52KX0nLz5cblx0XHRcdFx0PHBhdGggbmctYXR0ci1kPSd7e3ZtLnRyaWFuZ2xlRGF0YSgpfX0nIGNsYXNzPSd0cmknIC8+XG5cdFx0XHRcdDxwYXRoIG5nLWF0dHItZD0ne3t2bS5saW5lRnVuKFt2bS5wb2ludCwge3Y6IHZtLnBvaW50LmR2ICsgdm0ucG9pbnQudiwgdDogdm0ucG9pbnQudH1dKX19JyBjbGFzcz0ndHJpIGR2JyAvPlxuXHRcdFx0PC9nPlxuXHRcdFx0PHBhdGggbmctYXR0ci1kPSd7e3ZtLmxpbmVGdW4odm0uRGF0YS5DYXJ0LnRyYWplY3RvcnkpfX0nIGNsYXNzPSdmdW4gdGFyZ2V0JyAvPlxuXHRcdFx0PHBhdGggbmctYXR0ci1kPSd7e3ZtLmxpbmVGdW4odm0uRGF0YS5kb3RzKX19JyBjbGFzcz0nZnVuIHYnIC8+XG5cdFx0XHQ8ZyBuZy1yZXBlYXQ9J2RvdCBpbiB2bS5kb3RzIHRyYWNrIGJ5IGRvdC5pZCcgZGF0dW09ZG90IHNoaWZ0ZXI9J1t2bS5Ib3IoZG90LnQpLHZtLlZlcihkb3QudildJyBiZWhhdmlvcj0ndm0uZHJhZycgZG90LWRlciA+PC9nPlxuXHRcdFx0PGNpcmNsZSBjbGFzcz0nZG90IHNtYWxsJyByPSc0JyBzaGlmdGVyPSdbdm0uSG9yKHZtLkRhdGEuZmlyc3QudCksdm0uVmVyKHZtLkRhdGEuZmlyc3QudildJyAvPlxuXHRcdDwvZz5cblx0PC9zdmc+XG4nJydcblxuXG5jbGFzcyBDdHJsXG5cdGNvbnN0cnVjdG9yOiAoQHNjb3BlLCBAZWwsIEB3aW5kb3cpLT5cblx0XHRAbWFyID0gXG5cdFx0XHRsZWZ0OiAzMFxuXHRcdFx0dG9wOiAxMFxuXHRcdFx0cmlnaHQ6IDIwXG5cdFx0XHRib3R0b206IDM3XG5cblx0XHRAVmVyID0gZDMuc2NhbGUubGluZWFyKCkuZG9tYWluIFstLjEsMi4xXVxuXG5cdFx0QEhvciA9IGQzLnNjYWxlLmxpbmVhcigpLmRvbWFpbiBbLS4xLDVdXG5cblx0XHRARGF0YSA9IERhdGFcblxuXHRcdEBob3JBeEZ1biA9IGQzLnN2Zy5heGlzKClcblx0XHRcdC5zY2FsZSBASG9yXG5cdFx0XHQudGlja3MgNVxuXHRcdFx0Lm9yaWVudCAnYm90dG9tJ1xuXG5cdFx0QHZlckF4RnVuID0gZDMuc3ZnLmF4aXMoKVxuXHRcdFx0LnNjYWxlIEBWZXJcblx0XHRcdC50aWNrcyA1XG5cdFx0XHQub3JpZW50ICdsZWZ0J1xuXHRcdFxuXHRcdEBsaW5lRnVuID0gZDMuc3ZnLmxpbmUoKVxuXHRcdFx0LnkgKGQpPT4gQFZlciBkLnZcblx0XHRcdC54IChkKT0+IEBIb3IgZC50XG5cblx0XHRAZHJhZ19yZWN0ID0gZDMuYmVoYXZpb3IuZHJhZygpXG5cdFx0XHQub24gJ2RyYWdzdGFydCcsICgpPT5cblx0XHRcdFx0RGF0YS5zaG93PSB0cnVlXG5cdFx0XHRcdGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpXG5cdFx0XHRcdGlmIGV2ZW50LndoaWNoIGlzIDNcblx0XHRcdFx0XHRyZXR1cm4gZXZlbnQucHJldmVudERlZmF1bHQoKVxuXHRcdFx0XHRyZWN0ID0gZXZlbnQudG9FbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpXG5cdFx0XHRcdHQgPSBASG9yLmludmVydCBldmVudC54IC0gcmVjdC5sZWZ0XG5cdFx0XHRcdHYgID0gQFZlci5pbnZlcnQgZXZlbnQueSAtIHJlY3QudG9wXG5cdFx0XHRcdERhdGEuYWRkX2RvdCB0ICwgdlxuXHRcdFx0XHRAc2NvcGUuJGV2YWxBc3luYygpXG5cdFx0XHQub24gJ2RyYWcnLCA9PiBAb25fZHJhZyhEYXRhLnNlbGVjdGVkKVxuXHRcdFx0Lm9uICdkcmFnZW5kJywgPT4gXG5cdFx0XHRcdERhdGEuc2hvdyA9IGZhbHNlXG5cdFx0XHRcdEBzY29wZS4kZXZhbEFzeW5jKClcblxuXHRcdEBkcmFnID0gZDMuYmVoYXZpb3IuZHJhZygpXG5cdFx0XHQub24gJ2RyYWdzdGFydCcsIChkb3QpPT5cblx0XHRcdFx0ZXZlbnQuc3RvcFByb3BhZ2F0aW9uKClcblx0XHRcdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKVxuXHRcdFx0XHRpZiBldmVudC53aGljaCBpcyAzXG5cdFx0XHRcdFx0RGF0YS5yZW1vdmVfZG90IGRvdFxuXHRcdFx0XHRcdEBzY29wZS4kZXZhbEFzeW5jKClcblx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdERhdGEuc2hvdyA9IHRydWVcblx0XHRcdC5vbiAnZHJhZycsIEBvbl9kcmFnXG5cdFx0XHQub24gJ2RyYWdlbmQnLCA9PiBcblx0XHRcdFx0IyBEYXRhLnNob3cgPSBmYWxzZVxuXHRcdFx0XHRAc2NvcGUuJGV2YWxBc3luYygpXG5cblx0XHRhbmd1bGFyLmVsZW1lbnQgQHdpbmRvd1xuXHRcdFx0Lm9uICdyZXNpemUnLCBAcmVzaXplXG5cblx0QHByb3BlcnR5ICdzdmdfaGVpZ2h0JywgZ2V0OiAtPiBAaGVpZ2h0ICsgQG1hci50b3AgKyBAbWFyLmJvdHRvbVxuXG5cdEBwcm9wZXJ0eSAnZG90cycsIGdldDotPiBcblx0XHREYXRhLmRvdHMuZmlsdGVyIChkKS0+IChkLmlkICE9J2ZpcnN0JykgYW5kIChkLmlkICE9J2xhc3QnKVxuXG5cdG9uX2RyYWc6IChkb3QpPT4gXG5cdFx0XHRpZiBldmVudC53aGljaCBpcyAzXG5cdFx0XHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KClcblx0XHRcdFx0cmV0dXJuXG5cdFx0XHREYXRhLnVwZGF0ZV9kb3QgZG90LCBASG9yLmludmVydChkMy5ldmVudC54KSwgQFZlci5pbnZlcnQoZDMuZXZlbnQueSlcblx0XHRcdEBzY29wZS4kZXZhbEFzeW5jKClcblxuXHRAcHJvcGVydHkgJ3BvaW50JywgZ2V0OiAtPiBEYXRhLnNlbGVjdGVkXG5cblx0dHJpYW5nbGVEYXRhOi0+XG5cdFx0cG9pbnQgPSBEYXRhLnNlbGVjdGVkXG5cdFx0QGxpbmVGdW4gW3t2OiBwb2ludC52LCB0OiBwb2ludC50fSwge3Y6cG9pbnQuZHYgKyBwb2ludC52LCB0OiBwb2ludC50KzF9LCB7djogcG9pbnQuZHYgKyBwb2ludC52LCB0OiBwb2ludC50fV1cblxuXHRyZXNpemU6ICgpPT5cblx0XHRAd2lkdGggPSBAZWxbMF0uY2xpZW50V2lkdGggLSBAbWFyLmxlZnQgLSBAbWFyLnJpZ2h0XG5cdFx0QGhlaWdodCA9IEBlbFswXS5jbGllbnRIZWlnaHQgLSBAbWFyLnRvcCAtIEBtYXIuYm90dG9tXG5cdFx0QFZlci5yYW5nZSBbQGhlaWdodCwgMF1cblx0XHRASG9yLnJhbmdlIFswLCBAd2lkdGhdXG5cdFx0QHNjb3BlLiRldmFsQXN5bmMoKVxuXG5cbmRlciA9ICgpLT5cblx0ZGlyZWN0aXZlID0gXG5cdFx0Y29udHJvbGxlckFzOiAndm0nXG5cdFx0c2NvcGU6IHt9XG5cdFx0dGVtcGxhdGU6IHRlbXBsYXRlXG5cdFx0dGVtcGxhdGVOYW1lc3BhY2U6ICdzdmcnXG5cdFx0Y29udHJvbGxlcjogWyckc2NvcGUnLCckZWxlbWVudCcsICckd2luZG93JywgQ3RybF1cblxubW9kdWxlLmV4cG9ydHMgPSBkZXJcbiIsIkRhdGEgPSByZXF1aXJlICcuL2Rlc2lnbkRhdGEnXG5hbmd1bGFyID0gcmVxdWlyZSAnYW5ndWxhcidcbmQzID0gcmVxdWlyZSAnZDMnXG5yZXF1aXJlICcuLi8uLi9oZWxwZXJzJ1xuXG50ZW1wbGF0ZSA9ICcnJ1xuXHQ8c3ZnIG5nLWluaXQ9J3ZtLnJlc2l6ZSgpJyAgd2lkdGg9JzEwMCUnIGNsYXNzPSdib3R0b21DaGFydCc+XG5cdFx0PGRlZnM+XG5cdFx0XHQ8Y2xpcHBhdGggaWQ9J3Bsb3RCJz5cblx0XHRcdFx0PHJlY3QgZDMtZGVyPSd7d2lkdGg6IHZtLndpZHRoLCBoZWlnaHQ6IHZtLmhlaWdodH0nIC8+XG5cdFx0XHQ8L2NsaXBwYXRoPlxuXHRcdDwvZGVmcz5cblx0XHQ8ZyBjbGFzcz0nYm9pbGVycGxhdGUnIHNoaWZ0ZXI9J1t2bS5tYXIubGVmdCwgdm0ubWFyLnRvcF0nPlxuXHRcdFx0PHJlY3QgY2xhc3M9J2JhY2tncm91bmQnIGQzLWRlcj0ne3dpZHRoOiB2bS53aWR0aCwgaGVpZ2h0OiB2bS5oZWlnaHR9JyAvPlxuXHRcdFx0PGcgdmVyLWF4aXMtZGVyIHdpZHRoPSd2bS53aWR0aCcgc2NhbGU9J3ZtLlZlcicgZnVuPSd2bS52ZXJBeEZ1bic+PC9nPlxuXHRcdFx0PGcgaG9yLWF4aXMtZGVyIGhlaWdodD0ndm0uaGVpZ2h0JyBzY2FsZT0ndm0uVicgZnVuPSd2bS5ob3JBeEZ1bicgc2hpZnRlcj0nWzAsdm0uaGVpZ2h0XSc+PC9nPlxuXHRcdFx0PGZvcmVpZ25PYmplY3Qgd2lkdGg9JzMwJyBoZWlnaHQ9JzMwJyBzaGlmdGVyPSdbLTMxLCB2bS5oZWlnaHQvMl0nPlxuXHRcdFx0XHRcdDx0ZXh0IGNsYXNzPSdsYWJlbCc+JFxcXFxkb3R7dn0kPC90ZXh0PlxuXHRcdFx0PC9mb3JlaWduT2JqZWN0PlxuXHRcdFx0PGZvcmVpZ25PYmplY3Qgd2lkdGg9JzMwJyBoZWlnaHQ9JzMwJyB5PScyMCcgc2hpZnRlcj0nW3ZtLndpZHRoLzIsIHZtLmhlaWdodF0nPlxuXHRcdFx0XHRcdDx0ZXh0IGNsYXNzPSdsYWJlbCcgPiR2JDwvdGV4dD5cblx0XHRcdDwvZm9yZWlnbk9iamVjdD5cblx0XHQ8L2c+XG5cdFx0PGcgY2xhc3M9J21haW4nIGNsaXAtcGF0aD1cInVybCgjcGxvdEIpXCIgc2hpZnRlcj0nW3ZtLm1hci5sZWZ0LCB2bS5tYXIudG9wXSc+XG5cdFx0XHQ8bGluZSBjbGFzcz0nemVyby1saW5lJyBkMy1kZXI9J3t4MTogMCwgeDI6IHZtLndpZHRoLCB5MTogdm0uVmVyKDApLCB5Mjogdm0uVmVyKDApfScgLz5cblx0XHRcdDxsaW5lIGNsYXNzPSd6ZXJvLWxpbmUnIGQzLWRlcj1cInt4MTogdm0uSG9yKDApLCB4Mjogdm0uSG9yKDApLCB5MTogdm0uaGVpZ2h0LCB5MjogMH1cIiAvPlxuXHRcdFx0PHBhdGggbmctYXR0ci1kPSd7e3ZtLmxpbmVGdW4odm0uRGF0YS50YXJnZXRfZGF0YSl9fScgY2xhc3M9J2Z1biB0YXJnZXQnIC8+XG5cdFx0XHQ8ZyBuZy1jbGFzcz0ne2hpZGU6ICF2bS5EYXRhLnNob3d9JyA+XG5cdFx0XHRcdDxsaW5lIGNsYXNzPSd0cmkgdicgZDMtZGVyPSd7eDE6IHZtLkhvcigwKSwgeDI6IHZtLkhvcih2bS5wb2ludC52KSwgeTE6IHZtLlZlcih2bS5wb2ludC5kdiksIHkyOiB2bS5WZXIodm0ucG9pbnQuZHYpfScvPlxuXHRcdFx0XHQ8bGluZSBjbGFzcz0ndHJpIGR2JyBkMy1kZXI9J3t4MTogdm0uSG9yKHZtLnBvaW50LnYpLCB4Mjogdm0uSG9yKHZtLnBvaW50LnYpLCB5MTogdm0uVmVyKDApLCB5Mjogdm0uVmVyKHZtLnBvaW50LmR2KX0nLz5cblx0XHRcdFx0PHBhdGggZDMtZGVyPSd7ZDp2bS5saW5lRnVuKHZtLkRhdGEudGFyZ2V0X2RhdGEpfScgY2xhc3M9J2Z1biBjb3JyZWN0JyBuZy1jbGFzcz0ne2hpZGU6ICF2bS5EYXRhLmNvcnJlY3R9JyAvPlxuXHRcdFx0PC9nPlxuXHRcdFx0PGcgbmctcmVwZWF0PSdkb3QgaW4gdm0uZG90cyB0cmFjayBieSBkb3QuaWQnIHNoaWZ0ZXI9J1t2bS5Ib3IoZG90LnYpLHZtLlZlcihkb3QuZHYpXScgZG90LWItZGVyPjwvZz5cblx0XHQ8L2c+XG5cdDwvc3ZnPlxuJycnXG5cbmNsYXNzIEN0cmxcblx0Y29uc3RydWN0b3I6IChAc2NvcGUsIEBlbCwgQHdpbmRvdyktPlxuXHRcdEBtYXIgPSBcblx0XHRcdGxlZnQ6IDMwXG5cdFx0XHR0b3A6IDEwXG5cdFx0XHRyaWdodDogMjBcblx0XHRcdGJvdHRvbTogMzdcblxuXHRcdEBWZXIgPSBkMy5zY2FsZS5saW5lYXIoKS5kb21haW4gWy0yLjI1LCAuMV1cblxuXHRcdEBIb3IgPSBkMy5zY2FsZS5saW5lYXIoKS5kb21haW4gWy0uMSwyLjFdXG5cblx0XHRAaG9yQXhGdW4gPSBkMy5zdmcuYXhpcygpXG5cdFx0XHQuc2NhbGUgQEhvclxuXHRcdFx0LnRpY2tzIDVcblx0XHRcdC5vcmllbnQgJ2JvdHRvbSdcblxuXHRcdEB2ZXJBeEZ1biA9IGQzLnN2Zy5heGlzKClcblx0XHRcdC5zY2FsZSBAVmVyXG5cdFx0XHQudGlja3MgNVxuXHRcdFx0Lm9yaWVudCAnbGVmdCdcblxuXHRcdEBEYXRhID0gRGF0YVxuXG5cdFx0QGxpbmVGdW4gPSBkMy5zdmcubGluZSgpXG5cdFx0XHQueSAoZCk9PiBAVmVyIGQuZHZcblx0XHRcdC54IChkKT0+IEBIb3IgZC52XG5cblx0XHRhbmd1bGFyLmVsZW1lbnQgQHdpbmRvd1xuXHRcdFx0Lm9uICdyZXNpemUnLCBAcmVzaXplXG5cblx0QHByb3BlcnR5ICdzdmdfaGVpZ2h0JywgZ2V0OiAtPiBAaGVpZ2h0ICsgQG1hci50b3AgKyBAbWFyLmJvdHRvbVxuXG5cdEBwcm9wZXJ0eSAnZG90cycsIGdldDotPlxuXHRcdERhdGEuZG90c1xuXHRcdFx0LmZpbHRlciAoZCktPiAoZC5pZCAhPSdmaXJzdCcpIGFuZCAoZC5pZCAhPSdsYXN0Jylcblx0XHRcdFxuXHRoaWxpdGU6ICh2KS0+XG5cdFx0ZDMuc2VsZWN0IHRoaXNcblx0XHRcdC50cmFuc2l0aW9uKClcblx0XHRcdC5kdXJhdGlvbiAxMDBcblx0XHRcdC5lYXNlICdjdWJpYydcblx0XHRcdC5hdHRyICdyJyAsIGlmIHYgdGhlbiA2IGVsc2UgNFxuXG5cdEBwcm9wZXJ0eSAncG9pbnQnLCBnZXQ6IC0+IERhdGEuc2VsZWN0ZWRcblxuXG5cdHJlc2l6ZTogKCk9PlxuXHRcdEB3aWR0aCA9IEBlbFswXS5jbGllbnRXaWR0aCAtIEBtYXIubGVmdCAtIEBtYXIucmlnaHRcblx0XHRAaGVpZ2h0ID0gQGVsWzBdLmNsaWVudEhlaWdodCAtIEBtYXIudG9wIC0gQG1hci5ib3R0b21cblx0XHRAVmVyLnJhbmdlIFtAaGVpZ2h0LCAwXVxuXHRcdEBIb3IucmFuZ2UgWzAsIEB3aWR0aF0gXG5cdFx0QHNjb3BlLiRldmFsQXN5bmMoKVxuXG5cbmRlciA9ICgpLT5cblx0ZGlyZWN0aXZlID0gXG5cdFx0Y29udHJvbGxlckFzOiAndm0nXG5cdFx0c2NvcGU6IHt9XG5cdFx0dGVtcGxhdGU6IHRlbXBsYXRlXG5cdFx0dGVtcGxhdGVOYW1lc3BhY2U6ICdzdmcnXG5cdFx0Y29udHJvbGxlcjogWyckc2NvcGUnLCckZWxlbWVudCcsJyR3aW5kb3cnLCBDdHJsXVxuXG5tb2R1bGUuZXhwb3J0cyA9IGRlclxuIiwiYW5ndWxhciA9IHJlcXVpcmUgJ2FuZ3VsYXInXG5kMyA9IHJlcXVpcmUgJ2QzJ1xuRGF0YSA9IHJlcXVpcmUgJy4vZGVzaWduRGF0YSdcbnJlcXVpcmUgJy4uLy4uL2hlbHBlcnMnXG50ZW1wbGF0ZSA9ICcnJ1xuXHQ8bWctYnV0dG9uIG5nLWNsaWNrPSd2bS5jbGljaygpJz57e3ZtLnBhdXNlZCA/ICdQTEFZJyA6ICdQQVVTRSd9fSA8L21kLWJ1dHRvbj5cbicnJ1xuXG5cbmNsYXNzIEN0cmxcblx0Y29uc3RydWN0b3I6IChAc2NvcGUsIEBlbCwgQHdpbmRvdyktPlxuXHRcdEBEYXRhID0gRGF0YVxuXHRcdEBwYXVzZSgpXG5cblx0Y2xpY2s6IC0+XG5cdFx0aWYgQHBhdXNlZCB0aGVuIEBwbGF5KCkgZWxzZSBAcGF1c2UoKVxuXG5cdHBsYXk6IC0+XG5cdFx0QHBhdXNlZCA9IHRydWVcblx0XHRkMy50aW1lci5mbHVzaCgpXG5cdFx0QHBhdXNlZCA9IGZhbHNlXG5cdFx0c2V0VGltZW91dCA9PlxuXHRcdFx0ZDMudGltZXIgKGVsYXBzZWQpPT5cblx0XHRcdFx0RGF0YS50ID0gZWxhcHNlZC8xMDAwXG5cdFx0XHRcdEBzY29wZS4kZXZhbEFzeW5jKClcblx0XHRcdFx0aWYgZWxhcHNlZCA+IDQwMDBcblx0XHRcdFx0XHRAcGF1c2UoKVxuXHRcdFx0XHRcdHNldFRpbWVvdXQgPT5cblx0XHRcdFx0XHRcdEBwbGF5KClcblx0XHRcdFx0QHBhdXNlZFxuXG5cdHBhdXNlOiAtPiBAcGF1c2VkID0gdHJ1ZVxuXG5kZXIgPSAoKS0+XG5cdGRpcmVjdGl2ZSA9IFxuXHRcdGNvbnRyb2xsZXJBczogJ3ZtJ1xuXHRcdHNjb3BlOiB7fVxuXHRcdHRlbXBsYXRlOiB0ZW1wbGF0ZVxuXHRcdHRlbXBsYXRlTmFtZXNwYWNlOiAnc3ZnJ1xuXHRcdGNvbnRyb2xsZXI6IFsnJHNjb3BlJywnJGVsZW1lbnQnLCAnJHdpbmRvdycsIEN0cmxdXG5cbm1vZHVsZS5leHBvcnRzID0gZGVyXG4iLCJfID0gcmVxdWlyZSAnbG9kYXNoJ1xuZDM9IHJlcXVpcmUgJ2QzJ1xue21pbn0gPSBNYXRoXG5yZXF1aXJlICcuLi8uLi9oZWxwZXJzJ1xuQ2FydCA9IHJlcXVpcmUgJy4vZmFrZUNhcnQnXG5cbnRlbXBsYXRlID0gJycnXG5cdDxzdmcgbmctaW5pdD0ndm0ucmVzaXplKCknIHdpZHRoPScxMDAlJyBuZy1hdHRyLWhlaWdodD0ne3t2bS5zdmdfaGVpZ2h0fX0nPlxuXHRcdDxnIHNoaWZ0ZXI9J3t7Ojpbdm0ubWFyLmxlZnQsIHZtLm1hci50b3BdfX0nPlxuXHRcdFx0PHJlY3QgZDMtZGVyPSd7d2lkdGg6IHZtLndpZHRoLCBoZWlnaHQ6IHZtLmhlaWdodH0nIGNsYXNzPSdiYWNrZ3JvdW5kJy8+XG5cdFx0XHQ8ZyBob3ItYXhpcy1kZXIgaGVpZ2h0PSd2bS5oZWlnaHQnIHNjYWxlPSd2bS5YJyBmdW49J3ZtLmF4aXNGdW4nIHNoaWZ0ZXI9J1swLHZtLmhlaWdodF0nPjwvZz5cblx0XHRcdDxnIGNsYXNzPSdnLWNhcnQnIGQzLWRlcj0ne3RyYW5zZm9ybTogXCJ0cmFuc2xhdGUoXCIgKyB2bS5YKHZtLkNhcnQueCkgKyBcIiwwKVwifScgPlxuXHRcdFx0XHQ8cmVjdCBjbGFzcz0nY2FydCcgeD0nLTEyLjUnIHdpZHRoPScyNScgbmctYXR0ci15PSd7ezMwLTEyLjV9fScgaGVpZ2h0PScyNScvPlxuXHRcdFx0PC9nPlxuXHRcdFx0PGcgY2xhc3M9J2ctY2FydCcgbmctcmVwZWF0PSd0IGluIHZtLnNhbXBsZScgZDMtZGVyPSd7dHJhbnNmb3JtOiBcInRyYW5zbGF0ZShcIiArIHZtLlgodm0uQ2FydC5sb2ModCkpICsgXCIsMClcIn0nIHN0eWxlPSdvcGFjaXR5Oi4zOyc+XG5cdFx0XHRcdFx0PHJlY3QgY2xhc3M9J2NhcnQnIHg9Jy0xMi41JyB3aWR0aD0nMjUnIG5nLWF0dHIteT0ne3szMC0xMi41fX0nIGhlaWdodD0nMjUnLz5cblx0XHRcdDwvZz5cblx0XHQ8L2c+XG5cdDwvc3ZnPlxuJycnXG5cbmNsYXNzIEN0cmxcblx0Y29uc3RydWN0b3I6IChAc2NvcGUsIEBlbCwgQHdpbmRvdyktPlxuXHRcdEBtYXIgPSBcblx0XHRcdGxlZnQ6IDEwXG5cdFx0XHRyaWdodDogMTBcblx0XHRcdHRvcDogMFxuXHRcdFx0Ym90dG9tOiAwXG5cdFx0XHRcblx0XHRAWCA9IGQzLnNjYWxlLmxpbmVhcigpLmRvbWFpbiBbLS4xLDNdIFxuXG5cdFx0QHNhbXBsZSA9IF8ucmFuZ2UoIDAsIDUgLCAuNSlcblxuXHRcdEBDYXJ0ID0gQ2FydFxuXG5cdFx0QGF4aXNGdW4gPSBkMy5zdmcuYXhpcygpXG5cdFx0XHQuc2NhbGUgQFhcblx0XHRcdC50aWNrcyA1XG5cdFx0XHQub3JpZW50ICdib3R0b20nXG5cblx0XHRAdHJhbiA9ICh0cmFuKS0+XG5cdFx0XHR0cmFuLmVhc2UgJ2xpbmVhcidcblx0XHRcdFx0LmR1cmF0aW9uIDYwXG5cblx0XHRhbmd1bGFyLmVsZW1lbnQgQHdpbmRvd1xuXHRcdFx0Lm9uICdyZXNpemUnICwgQHJlc2l6ZVxuXG5cdEBwcm9wZXJ0eSAnc3ZnX2hlaWdodCcgLCBnZXQ6LT4gQGhlaWdodCArIEBtYXIudG9wICsgQG1hci5ib3R0b21cblxuXHRyZXNpemU6ICgpPT5cblx0XHRAd2lkdGggPSBAZWxbMF0uY2xpZW50V2lkdGggLSBAbWFyLmxlZnQgLSBAbWFyLnJpZ2h0XG5cdFx0QGhlaWdodCA9IDYwXG5cdFx0QFgucmFuZ2UgWzAsIEB3aWR0aF1cblx0XHRAc2NvcGUuJGV2YWxBc3luYygpXG5cbmRlciA9ICgpLT5cblx0ZGlyZWN0aXZlID0gXG5cdFx0dGVtcGxhdGU6IHRlbXBsYXRlXG5cdFx0c2NvcGU6IHt9XG5cdFx0cmVzdHJpY3Q6ICdBJ1xuXHRcdGJpbmRUb0NvbnRyb2xsZXI6IHRydWVcblx0XHR0ZW1wbGF0ZU5hbWVzcGFjZTogJ3N2Zydcblx0XHRjb250cm9sbGVyOiBbJyRzY29wZScsICckZWxlbWVudCcsICckd2luZG93JywgQ3RybF1cblx0XHRjb250cm9sbGVyQXM6ICd2bSdcblxubW9kdWxlLmV4cG9ydHMgPSBkZXJcbiIsIl8gPSByZXF1aXJlICdsb2Rhc2gnXG5kMz0gcmVxdWlyZSAnZDMnXG57bWlufSA9IE1hdGhcbnJlcXVpcmUgJy4uLy4uL2hlbHBlcnMnXG5DYXJ0ID0gcmVxdWlyZSAnLi90cnVlQ2FydCdcblxudGVtcGxhdGUgPSAnJydcblx0PHN2ZyBuZy1pbml0PSd2bS5yZXNpemUoKScgd2lkdGg9JzEwMCUnIG5nLWF0dHItaGVpZ2h0PSd7e3ZtLnN2Z19oZWlnaHR9fSc+XG5cdFx0PGcgc2hpZnRlcj0ne3s6Olt2bS5tYXIubGVmdCwgdm0ubWFyLnRvcF19fSc+XG5cdFx0XHQ8cmVjdCBkMy1kZXI9J3t3aWR0aDogdm0ud2lkdGgsIGhlaWdodDogdm0uaGVpZ2h0fScgY2xhc3M9J2JhY2tncm91bmQnLz5cblx0XHRcdDxnIGhvci1heGlzLWRlciBoZWlnaHQ9J3ZtLmhlaWdodCcgc2NhbGU9J3ZtLlgnIGZ1bj0ndm0uYXhpc0Z1bicgc2hpZnRlcj0nWzAsdm0uaGVpZ2h0XSc+PC9nPlxuXHRcdFx0PGZvcmVpZ25PYmplY3Qgd2lkdGg9JzMwJyBoZWlnaHQ9JzMwJyB5PScyMCcgc2hpZnRlcj0nW3ZtLndpZHRoLzIsIHZtLmhlaWdodF0nPlxuXHRcdFx0XHRcdDx0ZXh0IGNsYXNzPSdsYWJlbCcgPiR4JDwvdGV4dD5cblx0XHRcdDwvZm9yZWlnbk9iamVjdD5cblx0XHRcdDxnIGNsYXNzPSdnLWNhcnQnIGQzLWRlcj0ne3RyYW5zZm9ybTogXCJ0cmFuc2xhdGUoXCIgKyB2bS5YKHZtLkNhcnQueCkgKyBcIiwwKVwifScgPlxuXHRcdFx0XHQ8cmVjdCBjbGFzcz0nY2FydCcgeD0nLTEyLjUnIHdpZHRoPScyNScgbmctYXR0ci15PSd7ezMwLTEyLjV9fScgaGVpZ2h0PScyNScvPlxuXHRcdFx0PC9nPlxuXHRcdFx0PGcgY2xhc3M9J2ctY2FydCcgbmctcmVwZWF0PSd0IGluIHZtLnNhbXBsZScgZDMtZGVyPSd7dHJhbnNmb3JtOiBcInRyYW5zbGF0ZShcIiArIHZtLlgodm0uQ2FydC5sb2ModCkpICsgXCIsMClcIn0nIHN0eWxlPSdvcGFjaXR5Oi4zOyc+XG5cdFx0XHRcdFx0PHJlY3QgY2xhc3M9J2NhcnQnIHg9Jy0xMi41JyB3aWR0aD0nMjUnIG5nLWF0dHIteT0ne3szMC0xMi41fX0nIGhlaWdodD0nMjUnLz5cblx0XHRcdDwvZz5cblx0XHQ8L2c+XG5cdDwvc3ZnPlxuJycnXG5cbmNsYXNzIEN0cmxcblx0Y29uc3RydWN0b3I6IChAc2NvcGUsIEBlbCwgQHdpbmRvdyktPlxuXHRcdEBtYXIgPSBcblx0XHRcdGxlZnQ6IDEwXG5cdFx0XHRyaWdodDogMTBcblx0XHRcdHRvcDogMTBcblx0XHRcdGJvdHRvbTogMTVcblx0XHRcdFxuXHRcdEBYID0gZDMuc2NhbGUubGluZWFyKCkuZG9tYWluIFstLjEsM10gXG5cblx0XHRAc2FtcGxlID0gXy5yYW5nZSggMCwgNSAsIC41KVxuXG5cdFx0QENhcnQgPSBDYXJ0XG5cblx0XHRAYXhpc0Z1biA9IGQzLnN2Zy5heGlzKClcblx0XHRcdC5zY2FsZSBAWFxuXHRcdFx0LnRpY2tzIDVcblx0XHRcdC5vcmllbnQgJ2JvdHRvbSdcblxuXHRcdEB0cmFuID0gKHRyYW4pLT5cblx0XHRcdHRyYW4uZWFzZSAnbGluZWFyJ1xuXHRcdFx0XHQuZHVyYXRpb24gNjBcblxuXHRcdGFuZ3VsYXIuZWxlbWVudCBAd2luZG93XG5cdFx0XHQub24gJ3Jlc2l6ZScgLCBAcmVzaXplXG5cblx0QHByb3BlcnR5ICdzdmdfaGVpZ2h0JyAsIGdldDotPiBAaGVpZ2h0ICsgQG1hci50b3AgKyBAbWFyLmJvdHRvbVxuXG5cdHJlc2l6ZTogKCk9PlxuXHRcdEB3aWR0aCA9IEBlbFswXS5jbGllbnRXaWR0aCAtIEBtYXIubGVmdCAtIEBtYXIucmlnaHRcblx0XHRAaGVpZ2h0ID0gNjBcblx0XHRAWC5yYW5nZSBbMCwgQHdpZHRoXVxuXHRcdEBzY29wZS4kZXZhbEFzeW5jKClcblxuZGVyID0gKCktPlxuXHRkaXJlY3RpdmUgPSBcblx0XHR0ZW1wbGF0ZTogdGVtcGxhdGVcblx0XHRzY29wZToge31cblx0XHRyZXN0cmljdDogJ0EnXG5cdFx0YmluZFRvQ29udHJvbGxlcjogdHJ1ZVxuXHRcdHRlbXBsYXRlTmFtZXNwYWNlOiAnc3ZnJ1xuXHRcdGNvbnRyb2xsZXI6IFsnJHNjb3BlJywgJyRlbGVtZW50JywgJyR3aW5kb3cnLCBDdHJsXVxuXHRcdGNvbnRyb2xsZXJBczogJ3ZtJ1xuXG5tb2R1bGUuZXhwb3J0cyA9IGRlclxuIiwiXyA9IHJlcXVpcmUgJ2xvZGFzaCdcbnJlcXVpcmUgJy4uLy4uL2hlbHBlcnMnXG5DYXJ0ID0gcmVxdWlyZSAnLi4vY2FydC9jYXJ0RGF0YSdcbmQzID0gcmVxdWlyZSAnZDMnXG57ZXhwLCBtaW4sIG1heH0gPSBNYXRoXG5cbmNsYXNzIERvdFxuXHRjb25zdHJ1Y3RvcjogKEB0LCBAdiktPlxuXHRcdEBpZCA9IF8udW5pcXVlSWQgJ2RvdCdcblx0XHRAaGlsaXRlZCA9IGZhbHNlXG5cbmNsYXNzIERhdGFcblx0Y29uc3RydWN0b3I6IC0+XG5cdFx0QHQgPSBAeCA9IDBcblx0XHRAQ2FydCA9IENhcnRcblx0XHRmaXJzdERvdCA9IG5ldyBEb3QgMCAsIENhcnQudjBcblx0XHRmaXJzdERvdC5pZCA9ICdmaXJzdCdcblx0XHRtaWREb3QgPSBuZXcgRG90IENhcnQudHJhamVjdG9yeVsxMF0udCAsIENhcnQudHJhamVjdG9yeVsxMF0udlxuXHRcdGxhc3REb3QgPSBuZXcgRG90IDYgLCBDYXJ0LnRyYWplY3RvcnlbMTBdLnZcblx0XHRsYXN0RG90LmlkID0gJ2xhc3QnXG5cdFx0QGRvdHMgPSBbIGZpcnN0RG90LCBcblx0XHRcdG1pZERvdCxcblx0XHRcdGxhc3REb3Rcblx0XHRdXG5cdFx0QGNvcnJlY3QgPSBAc2hvdyA9IGZhbHNlXG5cdFx0QGZpcnN0ID0gQHNlbGVjdGVkID0gZmlyc3REb3Rcblx0XHRAdGFyZ2V0X2RhdGEgPSBDYXJ0LnRyYWplY3Rvcnlcblx0XHRcdFx0XG5cdFx0QHVwZGF0ZV9kb3RzKClcblxuXHRhZGRfZG90OiAodCwgdiktPlxuXHRcdEBzZWxlY3RlZCA9IG5ldyBEb3QgdCx2XG5cdFx0QGRvdHMucHVzaCBAc2VsZWN0ZWRcblx0XHRAdXBkYXRlX2RvdCBAc2VsZWN0ZWQsIHQsIHZcblxuXHRyZW1vdmVfZG90OiAoZG90KS0+XG5cdFx0QGRvdHMuc3BsaWNlIEBkb3RzLmluZGV4T2YoZG90KSwgMVxuXHRcdEB1cGRhdGVfZG90cygpXG5cblx0dXBkYXRlX2RvdHM6IC0+IFxuXHRcdEBkb3RzLnNvcnQgKGEsYiktPiBhLnQgLSBiLnRcblx0XHRAZG90cy5mb3JFYWNoIChkb3QsIGksIGspLT5cblx0XHRcdHByZXYgPSBrW2ktMV1cblx0XHRcdGlmIGRvdC5pZCA9PSAnbGFzdCdcblx0XHRcdFx0ZG90LnYgPSBwcmV2LnZcblx0XHRcdFx0cmV0dXJuXG5cdFx0XHRpZiBwcmV2XG5cdFx0XHRcdGR0ID0gZG90LnQgLSBwcmV2LnRcblx0XHRcdFx0ZG90LnggPSBwcmV2LnggKyBkdCAqIChkb3QudiArIHByZXYudikvMlxuXHRcdFx0XHRkb3QuZHYgPSAoZG90LnYgLSBwcmV2LnYpL21heChkdCwgLjAwMDEpXG5cdFx0XHRlbHNlXG5cdFx0XHRcdGRvdC54ID0gMFxuXHRcdFx0XHRkb3QuZHYgPSAwXG5cblx0dXBkYXRlX2RvdDogKGRvdCwgdCwgdiktPlxuXHRcdGlmIGRvdC5pZCA9PSAnZmlyc3QnIHRoZW4gcmV0dXJuXG5cdFx0QHNlbGVjdGVkID0gZG90XG5cdFx0ZG90LnQgPSB0XG5cdFx0ZG90LnYgPSB2XG5cdFx0QHVwZGF0ZV9kb3RzKClcblx0XHRAY29ycmVjdCA9IE1hdGguYWJzKENhcnQuayAqIEBzZWxlY3RlZC52ICsgQHNlbGVjdGVkLmR2KSA8IDAuMDVcblxubW9kdWxlLmV4cG9ydHMgPSBuZXcgRGF0YSIsIkRhdGEgPSByZXF1aXJlICcuL2Rlc2lnbkRhdGEnXG5fID0gcmVxdWlyZSAnbG9kYXNoJ1xuXG5jbGFzcyBDYXJ0XG5cdGNvbnN0cnVjdG9yOiAtPlxuXG5cdGxvYzogKHQpLT5cblx0XHRpID0gXy5maW5kTGFzdEluZGV4IERhdGEuZG90cywgKGQpLT5cblx0XHRcdGQudCA8PSB0XG5cdFx0YSA9IERhdGEuZG90c1tpXVxuXHRcdGR0ID0gdCAtIGEudFxuXHRcdGR2ID0gRGF0YS5kb3RzW2krMV0/LmR2ID8gMFxuXHRcdGEueCArIGEudiAqIGR0ICsgMC41KmR2ICogZHQqKjJcblxuXHRAcHJvcGVydHkgJ3gnLCBnZXQ6LT4gQGxvYyBEYXRhLnRcblxubW9kdWxlLmV4cG9ydHMgPSBuZXcgQ2FydCIsIlJlYWwgPSByZXF1aXJlICcuLi9jYXJ0L2NhcnREYXRhJ1xuRGF0YSA9IHJlcXVpcmUgJy4vZGVzaWduRGF0YSdcbl8gPSByZXF1aXJlICdsb2Rhc2gnXG5yZXF1aXJlICcuLi8uLi9oZWxwZXJzJ1xuXG5jbGFzcyBDYXJ0XG5cdGNvbnN0cnVjdG9yOiAtPlxuXG5cdGxvYzogKHQpLT5cblx0XHR0cmFqID0gXy5maW5kTGFzdCBSZWFsLnRyYWplY3RvcnksIChkKS0+XG5cdFx0XHRcdGQudDw9dFxuXHRcdFx0LnhcblxuXHRAcHJvcGVydHkgJ3gnLCBnZXQ6LT4gQGxvYyBEYXRhLnRcblxubW9kdWxlLmV4cG9ydHMgPSBuZXcgQ2FydCIsImFuZ3VsYXIgPSByZXF1aXJlICdhbmd1bGFyJ1xuZDMgPSByZXF1aXJlICdkMydcbnJlcXVpcmUgJy4uLy4uL2hlbHBlcnMnXG5fID0gcmVxdWlyZSAnbG9kYXNoJ1xudGVtcGxhdGUgPSAnJydcblx0PHN2ZyBuZy1pbml0PSd2bS5yZXNpemUoKScgd2lkdGg9JzEwMCUnIGNsYXNzPSd0b3BDaGFydCc+XG5cdFx0PGRlZnM+XG5cdFx0XHQ8Y2xpcHBhdGggaWQ9J3JlZyc+XG5cdFx0XHRcdDxyZWN0IGQzLWRlcj0ne3dpZHRoOiB2bS53aWR0aCwgaGVpZ2h0OiB2bS5oZWlnaHR9JyAvPlxuXHRcdFx0PC9jbGlwcGF0aD5cblx0XHQ8L2RlZnM+XG5cdFx0PGcgY2xhc3M9J2JvaWxlcnBsYXRlJyBzaGlmdGVyPSdbdm0ubWFyLmxlZnQsIHZtLm1hci50b3BdJz5cblx0XHRcdDxyZWN0IGNsYXNzPSdiYWNrZ3JvdW5kJyBkMy1kZXI9J3t3aWR0aDogdm0ud2lkdGgsIGhlaWdodDogdm0uaGVpZ2h0fScgbmctbW91c2Vtb3ZlPSd2bS5tb3ZlKCRldmVudCknIC8+XG5cdFx0XHQ8ZyB2ZXItYXhpcy1kZXIgd2lkdGg9J3ZtLndpZHRoJyBzY2FsZT0ndm0uVmVyJyBmdW49J3ZtLnZlckF4RnVuJz48L2c+XG5cdFx0XHQ8ZyBob3ItYXhpcy1kZXIgaGVpZ2h0PSd2bS5oZWlnaHQnIHNjYWxlPSd2bS5Ib3InIGZ1bj0ndm0uaG9yQXhGdW4nIHNoaWZ0ZXI9J1swLHZtLmhlaWdodF0nPjwvZz5cblx0XHRcdDxmb3JlaWduT2JqZWN0IHdpZHRoPSczMCcgaGVpZ2h0PSczMCcgeT0nMTcnIHNoaWZ0ZXI9J1t2bS53aWR0aC8yLCB2bS5oZWlnaHRdJz5cblx0XHRcdFx0PHRleHQgY2xhc3M9J2xhYmVsJz4kdCQ8L3RleHQ+XG5cdFx0XHQ8L2ZvcmVpZ25PYmplY3Q+XG5cdFx0PC9nPlxuXHRcdDxnIGNsYXNzPSdtYWluJyBjbGlwLXBhdGg9XCJ1cmwoI3JlZylcIiBzaGlmdGVyPSdbdm0ubWFyLmxlZnQsIHZtLm1hci50b3BdJz5cblx0XHRcdDxsaW5lIGNsYXNzPSd6ZXJvLWxpbmUgaG9yJyBuZy1jbGFzcz0ne1wiY29ycmVjdFwiOiB2bS5jb3JyZWN0fScgZDMtZGVyPSd7eDE6IDAsIHgyOiB2bS53aWR0aCwgeTE6IHZtLlZlcigwKSwgeTI6IHZtLlZlcigwKX0nLz5cblx0XHRcdDxsaW5lIGNsYXNzPSd0cmkgdicgZDMtZGVyPSd7eDE6IHZtLkhvcih2bS5wb2ludC50KSwgeDI6IHZtLkhvcih2bS5wb2ludC50KSwgeTE6IHZtLlZlcigwKSwgeTI6IHZtLlZlcih2bS5wb2ludC52ICl9Jy8+XG5cdFx0XHQ8Y2lyY2xlIHI9JzNweCcgc2hpZnRlcj0nW3ZtLkhvcih2bS5wb2ludC50KSwgdm0uVmVyKHZtLnBvaW50LnYpXScgY2xhc3M9J3BvaW50IHYnLz5cblx0XHRcdDxwYXRoIGQzLWRlcj0ne2Q6dm0ubGluZUZ1bih2bS5kYXRhKX0nIGNsYXNzPSdmdW4gdicgLz5cblx0XHRcdDxmb3JlaWduT2JqZWN0IHdpZHRoPSczMCcgaGVpZ2h0PSczMCcgc2hpZnRlcj0nWyh2bS5Ib3Iodm0ucG9pbnQudCkgLSAxNiksIHZtLlZlcih2bS5wb2ludC52LzIpIC0gN10nPlxuXHRcdFx0XHRcdDx0ZXh0IGNsYXNzPSd0cmktbGFiZWwnIGZvbnQtc2l6ZT0nMTNweCc+JHkkPC90ZXh0PlxuXHRcdFx0PC9mb3JlaWduT2JqZWN0PlxuXHRcdDwvZz5cblx0PC9zdmc+XG4nJydcblxuY2xhc3MgQ3RybFxuXHRjb25zdHJ1Y3RvcjogKEBzY29wZSwgQGVsLCBAd2luZG93KS0+XG5cdFx0QG1hciA9IFxuXHRcdFx0bGVmdDogMzBcblx0XHRcdHRvcDogMjBcblx0XHRcdHJpZ2h0OiAyMFxuXHRcdFx0Ym90dG9tOiAzNVxuXG5cdFx0QFZlciA9IGQzLnNjYWxlLmxpbmVhcigpLmRvbWFpbiBbLTEsMV1cblx0XHRASG9yID0gZDMuc2NhbGUubGluZWFyKCkuZG9tYWluIFswLDIuNV1cblxuXHRcdEBob3JBeEZ1biA9IGQzLnN2Zy5heGlzKClcblx0XHRcdC5zY2FsZSBASG9yXG5cdFx0XHQudGlja0Zvcm1hdChkMy5mb3JtYXQgJ2QnKVxuXHRcdFx0Lm9yaWVudCAnYm90dG9tJ1xuXG5cdFx0QHZlckF4RnVuID0gZDMuc3ZnLmF4aXMoKVxuXHRcdFx0LnNjYWxlIEBWZXJcblx0XHRcdC50aWNrcyA1XG5cdFx0XHQudGlja0Zvcm1hdCAoZCktPlxuXHRcdFx0XHRpZiBNYXRoLmZsb29yKGQpICE9IGQgdGhlbiByZXR1cm5cblx0XHRcdFx0ZFxuXHRcdFx0Lm9yaWVudCAnbGVmdCdcblxuXHRcdEBsaW5lRnVuID0gZDMuc3ZnLmxpbmUoKVxuXHRcdFx0LnkgKGQpPT4gQFZlciBkLnZcblx0XHRcdC54IChkKT0+IEBIb3IgZC50XG5cblx0XHR2RnVuID0gKHQpLT41KiAodC0uNSkgKiAodC0xKSAqICh0LTIpKioyXG5cblx0XHRAZGF0YSA9IF8ucmFuZ2UgMCAsIDMgLCAxLzUwXG5cdFx0XHQubWFwICh0KS0+XG5cdFx0XHRcdHJlcyA9IFxuXHRcdFx0XHRcdHY6IHZGdW4gdFxuXHRcdFx0XHRcdHQ6IHRcblxuXHRcdEBwb2ludCA9IF8uc2FtcGxlIEBkYXRhXG5cblx0XHRAY29ycmVjdCA9IGZhbHNlXG5cblx0XHRhbmd1bGFyLmVsZW1lbnQgQHdpbmRvd1xuXHRcdFx0Lm9uICdyZXNpemUnLCBAcmVzaXplXG5cblx0XHRAbW92ZSA9IChldmVudCkgPT5cblx0XHRcdHJlY3QgPSBldmVudC50YXJnZXQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KClcblx0XHRcdHQgPSBASG9yLmludmVydCBldmVudC54IC0gcmVjdC5sZWZ0XG5cdFx0XHR2ID0gdkZ1biB0XG5cdFx0XHRAcG9pbnQgPSBcblx0XHRcdFx0dDogdFxuXHRcdFx0XHR2OiB2XG5cdFx0XHRAY29ycmVjdCA9IE1hdGguYWJzKEBwb2ludC52KSA8PSAwLjA1IFxuXHRcdFx0QHNjb3BlLiRldmFsQXN5bmMoKVxuXG5cdEBwcm9wZXJ0eSAnc3ZnX2hlaWdodCcsIGdldDogLT4gQGhlaWdodCArIEBtYXIudG9wICsgQG1hci5ib3R0b21cblxuXHRyZXNpemU6ICgpPT5cblx0XHRAd2lkdGggPSBAZWxbMF0uY2xpZW50V2lkdGggLSBAbWFyLmxlZnQgLSBAbWFyLnJpZ2h0XG5cdFx0QGhlaWdodCA9IEBlbFswXS5jbGllbnRIZWlnaHQgLSBAbWFyLmxlZnQgLSBAbWFyLnJpZ2h0XG5cdFx0QFZlci5yYW5nZSBbQGhlaWdodCwgMF1cblx0XHRASG9yLnJhbmdlIFswLCBAd2lkdGhdXG5cdFx0QHNjb3BlLiRldmFsQXN5bmMoKVxuXG5kZXIgPSAoKS0+XG5cdGRpcmVjdGl2ZSA9IFxuXHRcdGNvbnRyb2xsZXJBczogJ3ZtJ1xuXHRcdHNjb3BlOiB7fVxuXHRcdHRlbXBsYXRlOiB0ZW1wbGF0ZVxuXHRcdHRlbXBsYXRlTmFtZXNwYWNlOiAnc3ZnJ1xuXHRcdGNvbnRyb2xsZXI6IFsnJHNjb3BlJywnJGVsZW1lbnQnLCAnJHdpbmRvdycsIEN0cmxdXG5cbm1vZHVsZS5leHBvcnRzID0gZGVyXG4iLCJkcmFnID0gKCRwYXJzZSktPlxuXHRkaXJlY3RpdmUgPSBcblx0XHRsaW5rOiAoc2NvcGUsZWwsYXR0ciktPlxuXHRcdFx0c2VsID0gZDMuc2VsZWN0KGVsWzBdKVxuXHRcdFx0c2VsLmNhbGwoJHBhcnNlKGF0dHIuYmVoYXZpb3IpKHNjb3BlKSlcblxubW9kdWxlLmV4cG9ydHMgPSBkcmFnIiwiZDMgPSByZXF1aXJlICdkMydcbmFuZ3VsYXIgPSByZXF1aXJlICdhbmd1bGFyJ1xuXG5kZXIgPSAoJHBhcnNlKS0+ICNnb2VzIG9uIGEgc3ZnIGVsZW1lbnRcblx0ZGlyZWN0aXZlID0gXG5cdFx0cmVzdHJpY3Q6ICdBJ1xuXHRcdHNjb3BlOiBcblx0XHRcdGQzRGVyOiAnPSdcblx0XHRcdHRyYW46ICc9J1xuXHRcdGxpbms6IChzY29wZSwgZWwsIGF0dHIpLT5cblx0XHRcdHNlbCA9IGQzLnNlbGVjdCBlbFswXVxuXHRcdFx0dSA9ICd0LScgKyBNYXRoLnJhbmRvbSgpXG5cdFx0XHRzY29wZS4kd2F0Y2ggJ2QzRGVyJ1xuXHRcdFx0XHQsICh2KS0+XG5cdFx0XHRcdFx0aWYgc2NvcGUudHJhblxuXHRcdFx0XHRcdFx0c2VsLnRyYW5zaXRpb24gdVxuXHRcdFx0XHRcdFx0XHQuYXR0ciB2XG5cdFx0XHRcdFx0XHRcdC5jYWxsIHNjb3BlLnRyYW5cblx0XHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0XHRzZWwuYXR0ciB2XG5cblx0XHRcdFx0LCB0cnVlXG5tb2R1bGUuZXhwb3J0cyA9IGRlciIsIm1vZHVsZS5leHBvcnRzID0gKCRwYXJzZSktPlxuXHQoc2NvcGUsIGVsLCBhdHRyKS0+XG5cdFx0ZDMuc2VsZWN0KGVsWzBdKS5kYXR1bSAkcGFyc2UoYXR0ci5kYXR1bSkoc2NvcGUpIiwiXG50ZW1wbGF0ZSA9ICcnJ1xuXHQ8Y2lyY2xlIGNsYXNzPSdkb3QgbGFyZ2UnPjwvY2lyY2xlPlxuXHQ8Y2lyY2xlIGNsYXNzPSdkb3Qgc21hbGwnIHI9JzQnPjwvY2lyY2xlPlxuJycnXG5cbmRlciA9ICgpLT5cblx0ZGlyZWN0aXZlID0gXG5cdFx0dGVtcGxhdGU6IHRlbXBsYXRlXG5cdFx0cmVzdHJpY3Q6ICdBJ1xuXHRcdGxpbms6IChzY29wZSxlbCxhdHRyKS0+XG5cdFx0XHRyYWQgPSA3ICN0aGUgcmFkaXVzIG9mIHRoZSBsYXJnZSBjaXJjbGUgbmF0dXJhbGx5XG5cdFx0XHRzZWwgPSBkMy5zZWxlY3QgZWxbMF1cblx0XHRcdGJpZyA9IHNlbC5zZWxlY3QgJ2NpcmNsZS5kb3QubGFyZ2UnXG5cdFx0XHRcdC5hdHRyICdyJywgcmFkXG5cdFx0XHRjaXJjID0gc2VsLnNlbGVjdCAnY2lyY2xlLmRvdC5zbWFsbCdcblxuXHRcdFx0bW91c2VvdmVyID0gKCktPlxuXHRcdFx0XHRzY29wZS5kb3QuaGlsaXRlZCA9IHRydWVcblx0XHRcdFx0c2NvcGUudm0uRGF0YS5zZWxlY3RlZCA9IHNjb3BlLmRvdFxuXHRcdFx0XHRzY29wZS52bS5EYXRhLnNob3cgPSB0cnVlXG5cdFx0XHRcdHNjb3BlLiRldmFsQXN5bmMoKVxuXHRcdFx0XHRiaWcudHJhbnNpdGlvbiAnZ3Jvdydcblx0XHRcdFx0XHQuZHVyYXRpb24gMTUwXG5cdFx0XHRcdFx0LmVhc2UgJ2N1YmljLW91dCdcblx0XHRcdFx0XHQuYXR0ciAncicgLCByYWQgKiAxLjVcblx0XHRcdFx0XHQudHJhbnNpdGlvbigpXG5cdFx0XHRcdFx0LmR1cmF0aW9uIDE1MFxuXHRcdFx0XHRcdC5lYXNlICdjdWJpYy1pbidcblx0XHRcdFx0XHQuYXR0ciAncicgLCByYWQgKiAxLjNcblx0XHRcdFx0XHRcblx0XHRcdGJpZy5vbiAnbW91c2VvdmVyJywgbW91c2VvdmVyXG5cdFx0XHRcdC5vbiAnY29udGV4dG1lbnUnLCAtPiBldmVudC5wcmV2ZW50RGVmYXVsdCgpXG5cdFx0XHRcdC5vbiAnbW91c2Vkb3duJywgLT5cblx0XHRcdFx0XHRiaWcudHJhbnNpdGlvbiAnZ3Jvdydcblx0XHRcdFx0XHRcdC5kdXJhdGlvbiAxNTBcblx0XHRcdFx0XHRcdC5lYXNlICdjdWJpYydcblx0XHRcdFx0XHRcdC5hdHRyICdyJywgcmFkKjEuN1xuXHRcdFx0XHQub24gJ21vdXNldXAnLCAoKS0+XG5cdFx0XHRcdFx0YmlnLnRyYW5zaXRpb24gJ2dyb3cnXG5cdFx0XHRcdFx0XHQuZHVyYXRpb24gMTUwXG5cdFx0XHRcdFx0XHQuZWFzZSAnY3ViaWMtaW4nXG5cdFx0XHRcdFx0XHQuYXR0ciAncicsIHJhZCoxLjNcblx0XHRcdFx0Lm9uICdtb3VzZW91dCcgLCAoKS0+XG5cdFx0XHRcdFx0c2NvcGUuZG90LmhpbGl0ZWQgPSBmYWxzZVxuXHRcdFx0XHRcdHNjb3BlLnZtLkRhdGEuc2hvdyA9IGZhbHNlXG5cdFx0XHRcdFx0c2NvcGUuJGV2YWxBc3luYygpXG5cdFx0XHRcdFx0YmlnLnRyYW5zaXRpb24gJ3Nocmluaydcblx0XHRcdFx0XHRcdC5kdXJhdGlvbiAzNTBcblx0XHRcdFx0XHRcdC5lYXNlICdib3VuY2Utb3V0J1xuXHRcdFx0XHRcdFx0LmF0dHIgJ3InICwgcmFkXG5cblx0XHRcdHNjb3BlLiR3YXRjaCAnZG90LmhpbGl0ZWQnICwgKHYpLT5cblx0XHRcdFx0aWYgdlxuXHRcdFx0XHRcdGNpcmMudHJhbnNpdGlvbigpXG5cdFx0XHRcdFx0XHQuZHVyYXRpb24gMTUwXG5cdFx0XHRcdFx0XHQuZWFzZSAnY3ViaWMtb3V0J1xuXHRcdFx0XHRcdFx0LnN0eWxlXG5cdFx0XHRcdFx0XHRcdCdzdHJva2Utd2lkdGgnOiAyLjVcblx0XHRcdFx0XHRcdFx0IyBzdHJva2U6ICcjNENBRjUwJ1xuXHRcdFx0XHRlbHNlIFxuXHRcdFx0XHRcdGNpcmMudHJhbnNpdGlvbigpXG5cdFx0XHRcdFx0XHQuZHVyYXRpb24gMTAwXG5cdFx0XHRcdFx0XHQuZWFzZSAnY3ViaWMnXG5cdFx0XHRcdFx0XHQuc3R5bGVcblx0XHRcdFx0XHRcdFx0J3N0cm9rZS13aWR0aCc6IDEuNlxuXHRcdFx0XHRcdFx0XHRzdHJva2U6ICd3aGl0ZSdcblxuXG5tb2R1bGUuZXhwb3J0cyA9IGRlclxuIiwidGVtcGxhdGUgPSAnJydcblx0PGNpcmNsZSBjbGFzcz0nZG90IHNtYWxsJyByPSc0Jz48L2NpcmNsZT5cbicnJ1xuXG5kZXIgPSAoKS0+XG5cdGRpcmVjdGl2ZSA9IFxuXHRcdHRlbXBsYXRlOiB0ZW1wbGF0ZVxuXHRcdHJlc3RyaWN0OiAnQSdcblx0XHRsaW5rOiAoc2NvcGUsZWwsYXR0ciktPlxuXHRcdFx0c2VsID0gZDMuc2VsZWN0IGVsWzBdXG5cdFx0XHRjaXJjID0gc2VsLnNlbGVjdCAnY2lyY2xlLmRvdC5zbWFsbCdcblxuXHRcdFx0c2NvcGUuJHdhdGNoICdkb3QuaGlsaXRlZCcgLCAodiktPlxuXHRcdFx0XHRpZiB2XG5cdFx0XHRcdFx0Y2lyYy50cmFuc2l0aW9uKClcblx0XHRcdFx0XHRcdC5kdXJhdGlvbiAxNTBcblx0XHRcdFx0XHRcdC5lYXNlICdjdWJpYy1vdXQnXG5cdFx0XHRcdFx0XHQuc3R5bGVcblx0XHRcdFx0XHRcdFx0J3N0cm9rZS13aWR0aCc6IDIuNVxuXHRcdFx0XHRcdFx0XHQjIHN0cm9rZTogJyM0Q0FGNTAnXG5cdFx0XHRcdGVsc2UgXG5cdFx0XHRcdFx0Y2lyYy50cmFuc2l0aW9uKClcblx0XHRcdFx0XHRcdC5kdXJhdGlvbiAxMDBcblx0XHRcdFx0XHRcdC5lYXNlICdjdWJpYydcblx0XHRcdFx0XHRcdC5zdHlsZVxuXHRcdFx0XHRcdFx0XHQnc3Ryb2tlLXdpZHRoJzogMS42XG5cdFx0XHRcdFx0XHRcdHN0cm9rZTogJ3doaXRlJ1xuXG5tb2R1bGUuZXhwb3J0cyA9IGRlclxuIiwiZDMgPSByZXF1aXJlICdkMydcblxuZGVyID0gKCRwYXJzZSktPlxuXHRkaXJlY3RpdmUgPVxuXHRcdGxpbms6IChzY29wZSwgZWwsIGF0dHIpLT5cblx0XHRcdHJlc2hpZnQgPSAodiktPiBcblx0XHRcdFx0ZDMuc2VsZWN0IGVsWzBdXG5cdFx0XHRcdFx0LmF0dHIgJ3RyYW5zZm9ybScgLCBcInRyYW5zbGF0ZSgje3ZbMF19LCN7dlsxXX0pXCJcblxuXHRcdFx0c2NvcGUuJHdhdGNoIC0+XG5cdFx0XHRcdFx0JHBhcnNlKGF0dHIuc2hpZnRlcikoc2NvcGUpXG5cdFx0XHRcdCwgcmVzaGlmdFxuXHRcdFx0XHQsIHRydWVcblxubW9kdWxlLmV4cG9ydHMgPSBkZXIiLCJhbmd1bGFyID0gcmVxdWlyZSAnYW5ndWxhcidcbmQzID0gcmVxdWlyZSAnZDMnXG50ZXh0dXJlcyA9IHJlcXVpcmUgJ3RleHR1cmVzJ1xuXG5jbGFzcyBDdHJsXG5cdGNvbnN0cnVjdG9yOiAoQHNjb3BlLCBAZWwsIEB3aW5kb3cpLT5cblx0XHR0ID0gdGV4dHVyZXMubGluZXMoKVxuXHRcdFx0Lm9yaWVudGF0aW9uIFwiMy84XCIsIFwiNy84XCJcblx0XHRcdC5zaXplIDVcblx0XHRcdC5zdHJva2UoJyNFNkU2RTYnKVxuXHRcdCAgICAuc3Ryb2tlV2lkdGggLjhcblxuXHRcdHQuaWQgJ215VGV4dHVyZSdcblxuXHRcdGQzLnNlbGVjdCBAZWxbMF1cblx0XHRcdC5zZWxlY3QgJ3N2Zydcblx0XHRcdC5jYWxsIHRcblxuZGVyID0gLT5cblx0ZGlyZWN0aXZlID0gXG5cdFx0Y29udHJvbGxlckFzOiAndm0nXG5cdFx0c2NvcGU6IHt9XG5cdFx0dGVtcGxhdGU6ICc8c3ZnIGhlaWdodD1cIjBweFwiIHN0eWxlPVwicG9zaXRpb246IGFic29sdXRlO1wiIHdpZHRoPVwiMHB4XCI+PC9zdmc+J1xuXHRcdHRlbXBsYXRlTmFtZXNwYWNlOiAnc3ZnJ1xuXHRcdGNvbnRyb2xsZXI6IFsnJHNjb3BlJywnJGVsZW1lbnQnLCAnJHdpbmRvdycsIEN0cmxdXG5cbm1vZHVsZS5leHBvcnRzID0gZGVyXG4iLCJkMyA9IHJlcXVpcmUgJ2QzJ1xuYW5ndWxhciA9IHJlcXVpcmUgJ2FuZ3VsYXInXG5cbmRlciA9ICgkd2luZG93KS0+XG5cdGRpcmVjdGl2ZSA9IFxuXHRcdGNvbnRyb2xsZXI6IGFuZ3VsYXIubm9vcFxuXHRcdGNvbnRyb2xsZXJBczogJ3ZtJ1xuXHRcdGJpbmRUb0NvbnRyb2xsZXI6IHRydWVcblx0XHRyZXN0cmljdDogJ0EnXG5cdFx0dGVtcGxhdGVOYW1lc3BhY2U6ICdzdmcnXG5cdFx0c2NvcGU6IFxuXHRcdFx0c2NhbGU6ICc9J1xuXHRcdFx0aGVpZ2h0OiAnPSdcblx0XHRcdGZ1bjogJz0nXG5cdFx0bGluazogKHNjb3BlLCBlbCwgYXR0ciwgdm0pLT5cblx0XHRcdHhBeGlzRnVuID0gdm0uZnVuID8gKGQzLnN2Zy5heGlzKClcblx0XHRcdFx0XHRcdFx0LnNjYWxlIHZtLnNjYWxlXG5cdFx0XHRcdFx0XHRcdC5vcmllbnQgJ2JvdHRvbScpXG5cblx0XHRcdHNlbCA9IGQzLnNlbGVjdCBlbFswXVxuXHRcdFx0XHQuY2xhc3NlZCAneCBheGlzJywgdHJ1ZVxuXG5cdFx0XHR1cGRhdGUgPSAoKT0+XG5cdFx0XHRcdHhBeGlzRnVuLnRpY2tTaXplIC12bS5oZWlnaHRcblx0XHRcdFx0c2VsLmNhbGwgeEF4aXNGdW5cblx0XHRcdFx0XG5cdFx0XHR1cGRhdGUoKVxuXHRcdFx0XHRcblx0XHRcdHNjb3BlLiR3YXRjaCAndm0uc2NhbGUuZG9tYWluKCknLCB1cGRhdGUgLCB0cnVlXG5cdFx0XHRzY29wZS4kd2F0Y2ggJ3ZtLnNjYWxlLnJhbmdlKCknLCB1cGRhdGUgLCB0cnVlXG5cdFx0XHRzY29wZS4kd2F0Y2ggJ3ZtLmhlaWdodCcsIHVwZGF0ZSAsIHRydWVcblxubW9kdWxlLmV4cG9ydHMgPSBkZXIiLCJkMyA9IHJlcXVpcmUgJ2QzJ1xuYW5ndWxhciA9IHJlcXVpcmUgJ2FuZ3VsYXInXG5cbmRlciA9ICgkd2luZG93KS0+XG5cdGRpcmVjdGl2ZSA9IFxuXHRcdGNvbnRyb2xsZXI6IGFuZ3VsYXIubm9vcFxuXHRcdGNvbnRyb2xsZXJBczogJ3ZtJ1xuXHRcdGJpbmRUb0NvbnRyb2xsZXI6IHRydWVcblx0XHRyZXN0cmljdDogJ0EnXG5cdFx0dGVtcGxhdGVOYW1lc3BhY2U6ICdzdmcnXG5cdFx0c2NvcGU6IFxuXHRcdFx0c2NhbGU6ICc9J1xuXHRcdFx0d2lkdGg6ICc9J1xuXHRcdFx0ZnVuOiAnPSdcblx0XHRsaW5rOiAoc2NvcGUsIGVsLCBhdHRyLCB2bSktPlxuXHRcdFx0eUF4aXNGdW4gPSB2bS5mdW4gPyBkMy5zdmcuYXhpcygpXG5cdFx0XHRcdC5zY2FsZSB2bS5zY2FsZVxuXHRcdFx0XHQub3JpZW50ICdsZWZ0J1xuXG5cdFx0XHRzZWwgPSBkMy5zZWxlY3QoZWxbMF0pLmNsYXNzZWQoJ3kgYXhpcycsIHRydWUpXG5cblx0XHRcdHVwZGF0ZSA9ICgpPT5cblx0XHRcdFx0eUF4aXNGdW4udGlja1NpemUoIC12bS53aWR0aClcblx0XHRcdFx0c2VsLmNhbGwoeUF4aXNGdW4pXG5cblx0XHRcdHVwZGF0ZSgpXG5cdFx0XHRcdFxuXHRcdFx0c2NvcGUuJHdhdGNoICd2bS5zY2FsZS5kb21haW4oKScsIHVwZGF0ZSAsIHRydWVcblx0XHRcdHNjb3BlLiR3YXRjaCAndm0uc2NhbGUucmFuZ2UoKScsIHVwZGF0ZSAsIHRydWVcblx0XHRcdHNjb3BlLiR3YXRjaCAndm0uc2NhbGUudGlja3MoKScsIHVwZGF0ZSAsIHRydWVcblxuXG5tb2R1bGUuZXhwb3J0cyA9IGRlciIsIid1c2Ugc3RyaWN0J1xuXG5tb2R1bGUuZXhwb3J0cy50aW1lb3V0ID0gKGZ1biwgdGltZSktPlxuXHRcdGQzLnRpbWVyKCgpPT5cblx0XHRcdGZ1bigpXG5cdFx0XHR0cnVlXG5cdFx0LHRpbWUpXG5cblxuRnVuY3Rpb246OnByb3BlcnR5ID0gKHByb3AsIGRlc2MpIC0+XG4gIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSBAcHJvdG90eXBlLCBwcm9wLCBkZXNjIl19
