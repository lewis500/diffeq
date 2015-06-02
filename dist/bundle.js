(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';
var angular, app, d3, looper;

angular = require('angular');

d3 = require('d3');

app = angular.module('mainApp', [require('angular-material')]).directive('horAxisDer', require('./directives/xAxis')).directive('verAxisDer', require('./directives/yAxis')).directive('cartSimDer', require('./components/cart/cartSim')).directive('cartObjectDer', require('./components/cart/cartObject')).directive('cartButtonsDer', require('./components/cart/cartButtons')).directive('shifter', require('./directives/shifter')).directive('designADer', require('./components/design/designA')).directive('behavior', require('./directives/behavior')).directive('dotADer', require('./components/design/dotA')).directive('dotBDer', require('./components/design/dotB')).directive('datum', require('./directives/datum')).directive('d3Der', require('./directives/d3Der')).directive('designBDer', require('./components/design/designB')).directive('regularDer', require('./components/regular/regular')).directive('derivativeADer', require('./components/derivative/derivative')).directive('derivativeBDer', require('./components/derivative/derivativeB')).directive('cartPlotDer', require('./components/cart/cartPlot')).directive('designCartADer', require('./components/design/designCartA')).directive('designCartBDer', require('./components/design/designCartB')).directive('textureDer', require('./directives/texture')).directive('designButtonsDer', require('./components/design/designButtons'));

looper = function() {
  return setTimeout(function() {
    d3.selectAll('circle.dot.large').transition('grow').duration(500).ease('cubic-out').attr('transform', 'scale( 1.34)').transition('shrink').duration(500).ease('cubic-out').attr('transform', 'scale( 1.0)');
    return looper();
  }, 1000);
};

looper();



},{"./components/cart/cartButtons":2,"./components/cart/cartObject":4,"./components/cart/cartPlot":5,"./components/cart/cartSim":6,"./components/derivative/derivative":7,"./components/derivative/derivativeB":8,"./components/design/designA":10,"./components/design/designB":11,"./components/design/designButtons":12,"./components/design/designCartA":13,"./components/design/designCartB":14,"./components/design/dotA":16,"./components/design/dotB":17,"./components/regular/regular":20,"./directives/behavior":21,"./directives/d3Der":22,"./directives/datum":23,"./directives/shifter":24,"./directives/texture":25,"./directives/xAxis":26,"./directives/yAxis":27,"angular":undefined,"angular-material":undefined,"d3":undefined}],2:[function(require,module,exports){
var Cart, Ctrl, _, atan, der, exp, sqrt, template;

_ = require('lodash');

exp = Math.exp, sqrt = Math.sqrt, atan = Math.atan;

Cart = require('./cartData');

template = '<md-button class=\'myButton\' ng-click=\'vm.click()\' ng-init=\'vm.play()\'>{{vm.paused ? \'PLAY\' : \'PAUSE\'}} </md-button>';

Ctrl = (function() {
  function Ctrl(scope) {
    this.scope = scope;
  }

  Ctrl.prototype.click = function() {
    if (this.paused) {
      return this.play();
    } else {
      return this.pause();
    }
  };

  Ctrl.prototype.play = function() {
    var last;
    this.paused = true;
    d3.timer.flush();
    this.paused = false;
    last = 0;
    return d3.timer((function(_this) {
      return function(elapsed) {
        var dt;
        dt = elapsed - last;
        Cart.increment(dt / 1000);
        last = elapsed;
        if (Cart.t > 4) {
          Cart.set_t(0);
        }
        _this.scope.$evalAsync();
        return _this.paused;
      };
    })(this), 1);
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
var Ctrl, der;

Ctrl = (function() {
  function Ctrl(scope, el, window) {
    this.scope = scope;
    this.el = el;
    this.window = window;
  }

  Ctrl.prototype.trans = function(tran) {
    return tran.duration(50).ease('linear');
  };

  return Ctrl;

})();

der = function() {
  var directive;
  return directive = {
    scope: {
      left: '='
    },
    controllerAs: 'vm',
    templateNamespace: 'svg',
    controller: ['$scope', '$element', '$window', Ctrl],
    templateUrl: './app/components/cart/cart.svg',
    bindToController: true,
    restrict: 'A'
  };
};

module.exports = der;



},{}],5:[function(require,module,exports){
var Cart, Ctrl, _, angular, d3, der, template,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

angular = require('angular');

d3 = require('d3');

require('../../helpers');

_ = require('lodash');

Cart = require('./cartData');

template = '<svg ng-init=\'vm.resize()\' width=\'100%\' class=\'topChart\'>\n	<defs>\n		<clippath id=\'cartPlot\'>\n			<rect d3-der=\'{width: vm.width, height: vm.height}\' />\n		</clippath>\n	</defs>\n	<g class=\'boilerplate\' shifter=\'[vm.mar.left, vm.mar.top]\'>\n		<rect class=\'background\' d3-der=\'{width: vm.width, height: vm.height}\' />\n		<g ver-axis-der width=\'vm.width\' scale=\'vm.V\' fun=\'vm.verAxFun\'></g>\n		<g hor-axis-der height=\'vm.height\' scale=\'vm.T\' fun=\'vm.horAxFun\' shifter=\'[0,vm.height]\'></g>\n		<foreignObject width=\'30\' height=\'30\' y=\'17\' shifter=\'[vm.width/2, vm.height]\'>\n			<text class=\'label\' >$t$</text>\n		</foreignObject>\n		<foreignObject width=\'30\' height=\'30\' shifter=\'[-31, vm.height/2-8]\'>\n				<text class=\'label\' >$v$</text>\n		</foreignObject>\n		<line class=\'zero-line\' d3-der="{x1: 0 , x2: vm.width, y1: vm.V(0), y2: vm.V(0)}" /> \n		<line class=\'zero-line\' d3-der="{x1: vm.T(0) , x2: vm.T(0), y1: 0, y2: vm.height}" /> \n	</g>\n	<g class=\'main\' clip-path="url(#cartPlot)" shifter=\'[vm.mar.left, vm.mar.top]\'>\n		<foreignObject width=\'30\' height=\'30\' shifter=\'[(vm.T(vm.point.t) - 16), vm.sthing]\' style=\'font-size: 13px; font-weight: 100;\'>\n				<text class=\'label\' font-size=\'13px\'>$v$</text>\n		</foreignObject>\n		<line class=\'tri v\' d3-der=\'{x1: vm.T(vm.point.t)-1, x2: vm.T(vm.point.t)-1, y1: vm.V(0), y2: vm.V(vm.point.v)}\'/>\n		<path ng-attr-d=\'{{vm.lineFun(vm.trajectory)}}\' class=\'fun v\' />\n		<circle r=\'3px\' shifter=\'[vm.T(vm.point.t), vm.V(vm.point.v)]\' class=\'point v\'/>\n		<foreignObject width=\'70\' height=\'30\' shifter=\'[vm.T(4), vm.V(.4)]\'>\n				<text class=\'tri-label\' >$2e^{-.8t}$</text>\n		</foreignObject>\n	</g>\n</svg>';

Ctrl = (function() {
  function Ctrl(scope, el, window) {
    this.scope = scope;
    this.el = el;
    this.window = window;
    this.resize = bind(this.resize, this);
    this.mar = {
      left: 30,
      top: 10,
      right: 10,
      bottom: 40
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



},{"../../helpers":28,"./cartData":3,"angular":undefined,"d3":undefined,"lodash":undefined}],6:[function(require,module,exports){
var Cart, Ctrl, _, d3, der, min, template,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

_ = require('lodash');

d3 = require('d3');

min = Math.min;

Cart = require('./cartData');

require('../../helpers');

template = '<svg ng-init=\'vm.resize()\' width=\'100%\' ng-attr-height="{{vm.svgHeight}}">\n	<defs>\n		<clippath id=\'cartSim\'>\n			<rect d3-der=\'{width: vm.width, height: vm.height}\' />\n		</clippath>\n	</defs>\n	<g class=\'boilerplate\' shifter=\'{{::[vm.mar.left, vm.mar.top]}}\' >\n		<rect d3-der=\'{width: vm.width, height: vm.height}\' class=\'background\'/>\n		<g hor-axis-der height=\'vm.height\' scale=\'vm.X\' fun=\'vm.axisFun\' shifter=\'[0,vm.height]\'></g>\n		<foreignObject width=\'30\' height=\'30\' y=\'20\' shifter=\'[vm.width/2, vm.height]\'>\n				<text class=\'label\' >$x$</text>\n		</foreignObject>\n	</g>\n	<g shifter=\'{{::[vm.mar.left, vm.mar.top]}}\' clip-path="url(#cartSim)" >\n		<foreignObject width=\'30\' height=\'30\' y=\'20\' shifter=\'[vm.width/2, vm.height]\'>\n				<text class=\'label\' >$t$</text>\n		</foreignObject>\n		<g class=\'g-cart\' cart-object-der left=\'vm.X(vm.Cart.x)\' transform=\'translate(0,25)\'></g>\n	</g>\n</svg>';

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

  Ctrl.property('svgHeight', {
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



},{"../../helpers":28,"./cartData":3,"d3":undefined,"lodash":undefined}],7:[function(require,module,exports){
var Ctrl, Data, _, angular, d3, der, template,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

angular = require('angular');

d3 = require('d3');

require('../../helpers');

_ = require('lodash');

Data = require('./derivativeData');

template = '<svg ng-init=\'vm.resize()\' width=\'100%\' class=\'topChart\'>\n	<defs>\n		<clippath id=\'derClip\'>\n			<rect d3-der=\'{width: vm.width, height: vm.height}\'></rect>\n		</clippath>\n	</defs>\n	<g class=\'boilerplate\' shifter=\'[vm.mar.left, vm.mar.top]\'>\n		<rect class=\'background\' d3-der=\'{width: vm.width, height: vm.height}\' ng-mousemove=\'vm.move($event)\' />\n		<g ver-axis-der width=\'vm.width\' scale=\'vm.Ver\' fun=\'vm.verAxFun\'></g>\n		<g hor-axis-der height=\'vm.height\' scale=\'vm.Hor\' fun=\'vm.horAxFun\' shifter=\'[0,vm.height]\'></g>\n		<foreignObject width=\'30\' height=\'30\' y=\'20\' shifter=\'[vm.width/2, vm.height]\'>\n				<text class=\'label\' >$t$</text>\n		</foreignObject>\n	</g>\n	<g class=\'main\' clip-path="url(#derClip)" shifter=\'[vm.mar.left, vm.mar.top]\'>\n		<line class=\'zero-line hor\' d3-der=\'{x1: 0, x2: vm.width, y1: vm.Ver(0), y2: vm.Ver(0)}\'/>\n		<path ng-attr-d=\'{{vm.lineFun(vm.data)}}\' class=\'fun v\' />\n		<path ng-attr-d=\'{{vm.triangleData}}\' class=\'tri\' />\n		<line class=\'tri dv\' d3-der=\'{x1: vm.Hor(vm.point.t)-1, x2: vm.Hor(vm.point.t)-1, y1: vm.Ver(vm.point.v), y2: vm.Ver((vm.point.v + vm.point.dv))}\'/>\n		<foreignObject width=\'30\' height=\'30\' shifter=\'[(vm.Hor(vm.point.t) - 16), vm.sthing]\'>\n				<text class=\'tri-label\' >$\\dot{y}$</text>\n		</foreignObject>\n		<foreignObject width=\'100\' height=\'30\' shifter=\'[vm.Hor(1.65), vm.Ver(1.38)]\'>\n			<text class=\'tri-label\'>$\\sin(t)$</text>\n		</foreignObject>\n		<circle r=\'3px\'  shifter=\'[vm.Hor(vm.point.t), vm.Ver(vm.point.v)]\' class=\'point v\'/>\n	</g>\n</svg>';

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



},{"../../helpers":28,"./derivativeData":9,"angular":undefined,"d3":undefined,"lodash":undefined}],8:[function(require,module,exports){
var Ctrl, Data, _, angular, d3, der, template,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

angular = require('angular');

d3 = require('d3');

require('../../helpers');

_ = require('lodash');

Data = require('./derivativeData');

template = '<svg ng-init=\'vm.resize()\' width=\'100%\'  class=\'topChart\'>\n	<defs>\n		<clippath id=\'dervativeB\'>\n			<rect d3-der=\'{width: vm.width, height: vm.height}\' />\n		</clippath>\n	</defs>\n	<g class=\'boilerplate\' shifter=\'[vm.mar.left, vm.mar.top]\'>\n		<rect class=\'background\' d3-der=\'{width: vm.width, height: vm.height}\' ng-mousemove=\'vm.move($event)\' />\n		<g ver-axis-der width=\'vm.width\' scale=\'vm.Ver\' fun=\'vm.verAxFun\'></g>\n		<g hor-axis-der height=\'vm.height\' scale=\'vm.Hor\' fun=\'vm.horAxFun\' shifter=\'[0,vm.height]\'></g>\n		<foreignObject width=\'30\' height=\'30\' y=\'20\' shifter=\'[vm.width/2, vm.height]\'>\n				<text class=\'label\' >$t$</text>\n		</foreignObject>\n	</g>\n	<g class=\'main\' clip-path="url(#dervativeB)" shifter=\'[vm.mar.left, vm.mar.top]\'>\n		<line class=\'zero-line hor\' d3-der=\'{x1: 0, x2: vm.width, y1: vm.Ver(0), y2: vm.Ver(0)}\'/>\n		<path d3-der=\'{d:vm.lineFun(vm.data)}\' class=\'fun dv\' />\n		<line class=\'tri dv\' d3-der=\'{x1: vm.Hor(vm.point.t)-1, x2: vm.Hor(vm.point.t)-1, y1: vm.Ver(0), y2: vm.Ver(vm.point.dv)}\'/>\n		<foreignObject width=\'30\' height=\'30\' shifter=\'[(vm.Hor(vm.point.t) - 16), vm.Ver(vm.point.dv*.5)-6]\'>\n				<text class=\'tri-label\'>$\\dot{y}$</text>\n		</foreignObject>\n		<foreignObject width=\'100\' height=\'30\' shifter=\'[vm.Hor(.9), vm.Ver(1)]\'>\n			<text class=\'tri-label\'>$\\cos(t)$</text>\n		</foreignObject>\n		<circle r=\'4px\'  shifter=\'[vm.Hor(vm.point.t), vm.Ver(vm.point.dv)]\' class=\'point dv\'/>\n	</g>\n</svg>';

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
      bottom: 40
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



},{"../../helpers":28,"./derivativeData":9,"angular":undefined,"d3":undefined,"lodash":undefined}],9:[function(require,module,exports){
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



},{"lodash":undefined}],10:[function(require,module,exports){
var Ctrl, Data, Fake, Real, angular, d3, der, template,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

angular = require('angular');

d3 = require('d3');

Data = require('./designData');

require('../../helpers');

Fake = require('./fakeCart');

Real = require('./trueCart');

template = '<svg ng-init=\'vm.resize()\' width=\'100%\' class=\'bottomChart\'>\n	<defs>\n		<clippath id=\'plotA\'>\n			<rect d3-der=\'{width: vm.width, height: vm.height}\'></rect>\n		</clippath>\n	</defs>\n	<g class=\'boilerplate\' shifter=\'[vm.mar.left, vm.mar.top]\'>\n		<rect class=\'background\' d3-der=\'{width: vm.width, height: vm.height}\' behavior=\'vm.drag_rect\' />\n		<g ver-axis-der width=\'vm.width\' scale=\'vm.Ver\' fun=\'vm.verAxFun\'></g>\n		<g hor-axis-der height=\'vm.height\' scale=\'vm.Hor\' fun=\'vm.horAxFun\' shifter=\'[0,vm.height]\'></g>\n		<foreignObject width=\'30\' height=\'30\' shifter=\'[-38, vm.height/2]\'>\n				<text class=\'label\'>$v$</text>\n		</foreignObject>\n		<foreignObject width=\'30\' height=\'30\' y=\'20\' shifter=\'[vm.width/2, vm.height]\'>\n				<text class=\'label\' >$t$</text>\n		</foreignObject>\n	</g>\n	<g class=\'main\' clip-path="url(#plotA)" shifter=\'[vm.mar.left, vm.mar.top]\' >\n		<line class=\'zero-line\' d3-der=\'{x1: 0, x2: vm.width, y1: vm.Ver(0), y2: vm.Ver(0)}\' />\n		<line class=\'zero-line\' d3-der="{x1: vm.Hor(0), x2: vm.Hor(0), y1: vm.height, y2: 0}" />\n		<g ng-class=\'{hide: !vm.Data.show}\' >\n			<line class=\'tri v\' d3-der=\'{x1: vm.Hor(vm.selected.t)-1, x2: vm.Hor(vm.selected.t)-1, y1: vm.Ver(0), y2: vm.Ver(vm.selected.v)}\'/>\n			<path ng-attr-d=\'{{vm.triangleData()}}\' class=\'tri\' />\n			<line d3-der=\'{x1: vm.Hor(vm.selected.t)+1, x2: vm.Hor(vm.selected.t)+1, y1: vm.Ver(vm.selected.v), y2: vm.Ver(vm.selected.v + vm.selected.dv)}\' class=\'tri dv\' />\n		</g>\n		<path ng-attr-d=\'{{vm.lineFun(vm.Data.Cart.trajectory)}}\' class=\'fun target\' />\n		<path ng-attr-d=\'{{vm.lineFun(vm.Data.dots)}}\' class=\'fun v\' />\n		<g ng-repeat=\'dot in vm.dots track by dot.id\' datum=dot shifter=\'[vm.Hor(dot.t),vm.Ver(dot.v)]\' behavior=\'vm.drag\' dot-a-der=dot ></g>\n		<circle class=\'dot small\' r=\'4\' shifter=\'[vm.Hor(vm.Data.first.t),vm.Ver(vm.Data.first.v)]\' />\n		<foreignObject width=\'70\' height=\'30\' shifter=\'[vm.Hor(4), vm.Ver(.33)]\'>\n				<text class=\'tri-label\' >$2e^{-.8t}$</text>\n		</foreignObject>\n		<circle r=\'4px\'  shifter=\'[vm.Hor(vm.Data.t), vm.Ver(vm.Fake.v)]\' class=\'point fake\'/>\n		<circle r=\'4px\'  shifter=\'[vm.Hor(vm.Data.t), vm.Ver(vm.Real.v)]\' class=\'point real\'/>\n	</g>\n</svg>';

Ctrl = (function() {
  function Ctrl(scope, el, window) {
    this.scope = scope;
    this.el = el;
    this.window = window;
    this.resize = bind(this.resize, this);
    this.on_drag = bind(this.on_drag, this);
    this.mar = {
      left: 38,
      top: 0,
      right: 10,
      bottom: 37
    };
    this.Ver = d3.scale.linear().domain([-.1, 2.1]);
    this.Hor = d3.scale.linear().domain([-.1, 5]);
    this.Data = Data;
    this.Fake = Fake;
    this.Real = Real;
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
        d3.event.sourceEvent.stopPropagation();
        event.preventDefault();
        if (event.which === 3) {
          return;
        }
        Data.set_show(true);
        rect = event.toElement.getBoundingClientRect();
        t = _this.Hor.invert(event.x - rect.left);
        v = _this.Ver.invert(event.y - rect.top);
        Data.add_dot(t, v);
        return _this.scope.$evalAsync();
      };
    })(this)).on('drag', (function(_this) {
      return function() {
        return _this.on_drag(_this.selected);
      };
    })(this)).on('dragend', (function(_this) {
      return function() {
        event.preventDefault();
        Data.set_show(true);
        return event.stopPropagation();
      };
    })(this));
    this.drag = d3.behavior.drag().on('dragstart', (function(_this) {
      return function(dot) {
        d3.event.sourceEvent.stopPropagation();
        if (event.which === 3) {
          event.preventDefault();
          Data.remove_dot(dot);
          Data.set_show(false);
          return _this.scope.$evalAsync();
        }
      };
    })(this)).on('drag', this.on_drag);
    angular.element(this.window).on('resize', this.resize);
  }

  Ctrl.property('dots', {
    get: function() {
      return Data.dots.filter(function(d) {
        return (d.id !== 'first') && (d.id !== 'last');
      });
    }
  });

  Ctrl.property('selected', {
    get: function() {
      return Data.selected;
    }
  });

  Ctrl.prototype.on_drag = function(dot) {
    Data.update_dot(dot, this.Hor.invert(d3.event.x), this.Ver.invert(d3.event.y));
    return this.scope.$evalAsync();
  };

  Ctrl.prototype.triangleData = function() {
    var point;
    point = this.selected;
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



},{"../../helpers":28,"./designData":15,"./fakeCart":18,"./trueCart":19,"angular":undefined,"d3":undefined}],11:[function(require,module,exports){
var Ctrl, Data, angular, d3, der, template,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

Data = require('./designData');

angular = require('angular');

d3 = require('d3');

require('../../helpers');

template = '<svg ng-init=\'vm.resize()\'  width=\'100%\' class=\'bottomChart\'>\n	<defs>\n		<clippath id=\'plotB\'>\n			<rect d3-der=\'{width: vm.width, height: vm.height}\' />\n		</clippath>\n	</defs>\n	<g class=\'boilerplate\' shifter=\'[vm.mar.left, vm.mar.top]\'>\n		<rect class=\'background\' d3-der=\'{width: vm.width, height: vm.height}\' />\n		<g ver-axis-der width=\'vm.width\' scale=\'vm.Ver\' fun=\'vm.verAxFun\'></g>\n		<g hor-axis-der height=\'vm.height\' scale=\'vm.V\' fun=\'vm.horAxFun\' shifter=\'[0,vm.height]\'></g>\n		<foreignObject width=\'30\' height=\'30\' shifter=\'[-38, vm.height/2]\'>\n				<text class=\'label\'>$\\dot{v}$</text>\n		</foreignObject>\n		<foreignObject width=\'30\' height=\'30\' y=\'20\' shifter=\'[vm.width/2, vm.height]\'>\n				<text class=\'label\' >$v$</text>\n		</foreignObject>\n	</g>\n	<g class=\'main\' clip-path="url(#plotB)" shifter=\'[vm.mar.left, vm.mar.top]\'>\n		<line class=\'zero-line\' d3-der=\'{x1: 0, x2: vm.width, y1: vm.Ver(0), y2: vm.Ver(0)}\' />\n		<line class=\'zero-line\' d3-der="{x1: vm.Hor(0), x2: vm.Hor(0), y1: vm.height, y2: 0}" />\n		<path ng-attr-d=\'{{vm.lineFun(vm.Data.target_data)}}\' class=\'fun target\' />\n		<g ng-class=\'{hide: !vm.Data.show}\' >\n			<line class=\'tri v\' d3-der=\'{x1: vm.Hor(0), x2: vm.Hor(vm.selected.v), y1: vm.Ver(vm.selected.dv), y2: vm.Ver(vm.selected.dv)}\'/>\n			<line class=\'tri dv\' d3-der=\'{x1: vm.Hor(vm.selected.v), x2: vm.Hor(vm.selected.v), y1: vm.Ver(0), y2: vm.Ver(vm.selected.dv)}\'/>\n			<path d3-der=\'{d:vm.lineFun(vm.Data.target_data)}\' class=\'fun correct\' ng-class=\'{hide: !vm.Data.correct}\' />\n		</g>\n		<g ng-repeat=\'dot in vm.dots track by dot.id\' shifter=\'[vm.Hor(dot.v),vm.Ver(dot.dv)]\' dot-b-der=dot></g>\n		<foreignObject width=\'70\' height=\'30\' y=\'0\' shifter=\'[vm.Hor(1.7), vm.Ver(-1.2)]\'>\n				<text class=\'tri-label\' >$v\'=-.8v$</text>\n		</foreignObject>\n	</g>\n</svg>';

Ctrl = (function() {
  function Ctrl(scope, el, window) {
    this.scope = scope;
    this.el = el;
    this.window = window;
    this.resize = bind(this.resize, this);
    this.mar = {
      left: 40,
      top: 0,
      right: 10,
      bottom: 37
    };
    this.Ver = d3.scale.linear().domain([-1.9, .1]);
    this.Hor = d3.scale.linear().domain([-.1, 2.15]);
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

  Ctrl.property('dots', {
    get: function() {
      return Data.dots.filter(function(d) {
        return (d.id !== 'first') && (d.id !== 'last');
      });
    }
  });

  Ctrl.property('selected', {
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



},{"../../helpers":28,"./designData":15,"angular":undefined,"d3":undefined}],12:[function(require,module,exports){
var Ctrl, Data, angular, d3, der, template;

angular = require('angular');

d3 = require('d3');

Data = require('./designData');

require('../../helpers');

template = '<md-button class=\'myButton\' ng-click=\'vm.click()\' ng-init=\'vm.play()\'>{{vm.paused ? \'PLAY\' : \'PAUSE\'}}</md-button>';

Ctrl = (function() {
  function Ctrl(scope) {
    this.scope = scope;
  }

  Ctrl.prototype.click = function() {
    if (this.paused) {
      return this.play();
    } else {
      return this.pause();
    }
  };

  Ctrl.prototype.play = function() {
    var last;
    this.paused = true;
    d3.timer.flush();
    this.paused = false;
    last = 0;
    return d3.timer((function(_this) {
      return function(elapsed) {
        var dt;
        dt = elapsed - last;
        Data.increment(dt / 1000);
        last = elapsed;
        if (Data.t > 4.5) {
          Data.set_t(0);
        }
        _this.scope.$evalAsync();
        return _this.paused;
      };
    })(this), 1);
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
    controller: ['$scope', Ctrl]
  };
};

module.exports = der;



},{"../../helpers":28,"./designData":15,"angular":undefined,"d3":undefined}],13:[function(require,module,exports){
var Cart, Ctrl, _, d3, der, min, template,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

_ = require('lodash');

d3 = require('d3');

min = Math.min;

require('../../helpers');

Cart = require('./fakeCart');

template = '<svg ng-init=\'vm.resize()\' width=\'100%\' class=\'cartChart\' ng-attr-height=\'{{::vm.svgHeight}}\'>\n	<defs>\n		<clippath id=\'dCartA\'>\n			<rect d3-der=\'{width: vm.width, height: vm.height}\' />\n		</clippath>\n	</defs>\n	<g shifter=\'{{::[vm.mar.left, vm.mar.top]}}\'  clip-path="url(#dCartA)" >\n		<rect d3-der=\'{width: vm.width, height: vm.height}\' class=\'background\'/>\n		<g hor-axis-der height=\'vm.height\' scale=\'vm.X\' fun=\'vm.axisFun\' shifter=\'[0,vm.height]\'></g>\n		<g class=\'g-cart\' ng-repeat=\'t in vm.sample\' d3-der=\'{transform: "translate(" + vm.X(vm.Cart.loc(t)) + ",0)"}\' style=\'opacity:.3;\'>\n			<line class=\'time-line\' d3-der=\'{x1: 0, x2: 0, y1: 0, y2: 60}\' />\n		</g>\n		<g class=\'g-cart\' cart-object-der left=\'vm.X(vm.Cart.x)\' transform=\'translate(0,25)\'></g>\n	</g>\n</svg>';

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
    this.sample = _.range(0, 6, .5);
    console.log(this.sample);
    this.Cart = Cart;
    this.axisFun = d3.svg.axis().scale(this.X).ticks(5).orient('bottom');
    this.tran = function(tran) {
      return tran.ease('linear').duration(60);
    };
    angular.element(this.window).on('resize', this.resize);
  }

  Ctrl.property('svgHeight', {
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



},{"../../helpers":28,"./fakeCart":18,"d3":undefined,"lodash":undefined}],14:[function(require,module,exports){
var Cart, Ctrl, _, d3, der, min, template,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

_ = require('lodash');

d3 = require('d3');

min = Math.min;

require('../../helpers');

Cart = require('./trueCart');

template = '<svg ng-init=\'vm.resize()\' width=\'100%\' class=\'cartChart\' ng-attr-height=\'{{::vm.svgHeight}}\'>\n	<defs>\n		<clippath id=\'dCartB\'>\n			<rect d3-der=\'{width: vm.width, height: vm.height}\' />\n		</clippath>\n	</defs>\n	<g class=\'boilerplate\' shifter=\'{{::[vm.mar.left, vm.mar.top]}}\' >\n		<rect d3-der=\'{width: vm.width, height: vm.height}\' class=\'background\'/>\n		<g hor-axis-der height=\'vm.height\' scale=\'vm.X\' fun=\'vm.axisFun\' shifter=\'[0,vm.height]\'></g>\n		<foreignObject width=\'30\' height=\'30\' y=\'20\' shifter=\'[vm.width/2, vm.height]\'>\n				<text class=\'label\' >$x$</text>\n		</foreignObject>\n	</g>\n	<g shifter=\'{{::[vm.mar.left, vm.mar.top]}}\' clip-path="url(#dCartB)">\n		<g class=\'g-cart\' ng-repeat=\'t in vm.sample\' d3-der=\'{transform: "translate(" + vm.X(vm.Cart.loc(t)) + ",0)"}\' style=\'opacity:.3;\'>\n			<line class=\'time-line\' d3-der=\'{x1: 0, x2: 0, y1: 0, y2: 60}\' />\n		</g>\n		<g class=\'g-cart\' cart-object-der left=\'vm.X(vm.Cart.x)\' transform=\'translate(0,25)\'></g>\n	</g>\n</svg>';

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
      bottom: 20
    };
    this.X = d3.scale.linear().domain([-.1, 3]);
    this.sample = _.range(0, 5, .5);
    this.Cart = Cart;
    this.axisFun = d3.svg.axis().scale(this.X).ticks(5).orient('bottom');
    this.tran = function(tran) {
      return tran.ease('linear').duration(30);
    };
    angular.element(this.window).on('resize', this.resize);
  }

  Ctrl.prototype.resize = function() {
    this.width = this.el[0].clientWidth - this.mar.left - this.mar.right;
    this.height = 60;
    this.X.range([0, this.width]);
    return this.scope.$evalAsync();
  };

  Ctrl.property('svgHeight', {
    get: function() {
      return this.height + this.mar.top + this.mar.bottom;
    }
  });

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



},{"../../helpers":28,"./trueCart":19,"d3":undefined,"lodash":undefined}],15:[function(require,module,exports){
var Cart, Data, Dot, _, d3;

_ = require('lodash');

require('../../helpers');

Cart = require('../cart/cartData');

d3 = require('d3');

Dot = (function() {
  function Dot(t1, v1) {
    this.t = t1;
    this.v = v1;
    this.id = _.uniqueId('dot');
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
    this.first = firstDot;
    this.target_data = Cart.trajectory;
    this.update_dots();
    this.select_dot(this.dots[1]);
  }

  Data.prototype.set_show = function(v) {
    return this.show = v;
  };

  Data.prototype.set_t = function(t) {
    return this.t = t;
  };

  Data.prototype.increment = function(dt) {
    return this.t += dt;
  };

  Data.prototype.select_dot = function(dot) {
    return this.selected = dot;
  };

  Data.prototype.add_dot = function(t, v) {
    var newDot;
    newDot = new Dot(t, v);
    this.dots.push(newDot);
    return this.update_dot(newDot, t, v);
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
        return dot.dv = (dot.v - prev.v) / Math.max(dt, .0001);
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
    this.select_dot(dot);
    dot.t = t;
    dot.v = v;
    this.update_dots();
    return this.correct = Math.abs(Cart.k * dot.v + dot.dv) < 0.05;
  };

  return Data;

})();

module.exports = new Data;



},{"../../helpers":28,"../cart/cartData":3,"d3":undefined,"lodash":undefined}],16:[function(require,module,exports){
var Ctrl, Data, der, template,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

Data = require('./designData');

template = '<circle class=\'dot large\'></circle>\n<circle class=\'dot small\' r=\'4\'></circle>';

Ctrl = (function() {
  function Ctrl(scope, el) {
    var big, circ, rad, sel;
    this.scope = scope;
    this.el = el;
    this.mouseover = bind(this.mouseover, this);
    this.mouseout = bind(this.mouseout, this);
    rad = 7;
    sel = d3.select(this.el[0]);
    big = sel.select('circle.dot.large').attr('r', rad);
    circ = sel.select('circle.dot.small');
    big.on('mouseover', this.mouseover).on('contextmenu', function() {
      event.preventDefault();
      return event.stopPropagation();
    }).on('mousedown', function() {
      return big.transition('grow').duration(150).ease('cubic').attr('r', rad * 1.7);
    }).on('mouseup', function() {
      return big.transition('grow').duration(150).ease('cubic-in').attr('r', rad * 1.3);
    }).on('mouseout', this.mouseout);
    this.scope.$watch((function(_this) {
      return function() {
        return (Data.selected === _this.dot) && Data.show;
      };
    })(this), function(v, old) {
      if (v) {
        big.transition('grow').duration(150).ease('cubic-out').attr('r', rad * 1.5).transition().duration(150).ease('cubic-in').attr('r', rad * 1.3);
        return circ.transition().duration(150).ease('cubic-out').style({
          'stroke-width': 2.5
        });
      } else {
        big.transition('shrink').duration(350).ease('bounce-out').attr('r', rad);
        return circ.transition().duration(100).ease('cubic').style({
          'stroke-width': 1.6,
          stroke: 'white'
        });
      }
    });
  }

  Ctrl.prototype.mouseout = function() {
    Data.set_show(false);
    return this.scope.$evalAsync();
  };

  Ctrl.prototype.mouseover = function() {
    Data.select_dot(this.dot);
    Data.set_show(true);
    return this.scope.$evalAsync();
  };

  return Ctrl;

})();

der = function() {
  var directive;
  return directive = {
    template: template,
    controllerAs: 'vm',
    scope: {
      dot: '=dotADer'
    },
    bindToController: true,
    controller: ['$scope', '$element', Ctrl],
    restrict: 'A'
  };
};

module.exports = der;



},{"./designData":15}],17:[function(require,module,exports){
var Ctrl, Data, der, template,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

Data = require('./designData');

template = '<circle class=\'dot small\' r=\'4\'></circle>';

Ctrl = (function() {
  function Ctrl(scope, el) {
    var circ;
    this.scope = scope;
    this.el = el;
    this.mouseover = bind(this.mouseover, this);
    this.mouseout = bind(this.mouseout, this);
    circ = d3.select(this.el[0]);
    circ.on('mouseover', this.mouseover).on('mouseout', this.mouseout);
    this.scope.$watch((function(_this) {
      return function() {
        return (Data.selected === _this.dot) && Data.show;
      };
    })(this), function(v, old) {
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

  Ctrl.prototype.mouseout = function() {
    Data.set_show(false);
    return this.scope.$evalAsync();
  };

  Ctrl.prototype.mouseover = function() {
    Data.select_dot(this.dot);
    Data.set_show(true);
    return this.scope.$evalAsync();
  };

  return Ctrl;

})();

der = function() {
  var directive;
  return directive = {
    template: template,
    controllerAs: 'vm',
    scope: {
      dot: '=dotBDer'
    },
    bindToController: true,
    controller: ['$scope', '$element', Ctrl],
    restrict: 'A'
  };
};

module.exports = der;



},{"./designData":15}],18:[function(require,module,exports){
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

  Cart.property('v', {
    get: function() {
      var a, dt, dv, i, ref, ref1, t;
      t = Data.t;
      i = _.findLastIndex(Data.dots, function(d) {
        return d.t <= t;
      });
      a = Data.dots[i];
      dt = t - a.t;
      dv = (ref = (ref1 = Data.dots[i + 1]) != null ? ref1.dv : void 0) != null ? ref : 0;
      return a.v + dv * dt;
    }
  });

  return Cart;

})();

module.exports = new Cart;



},{"./designData":15,"lodash":undefined}],19:[function(require,module,exports){
var Cart, Data, _;

Data = require('./designData');

_ = require('lodash');

require('../../helpers');

Cart = (function() {
  function Cart() {}

  Cart.prototype.loc = function(t) {
    return 2 / .8 * (1 - Math.exp(-.8 * t));
  };

  Cart.property('x', {
    get: function() {
      return this.loc(Data.t);
    }
  });

  Cart.property('v', {
    get: function() {
      return 2 * Math.exp(-.8 * Data.t);
    }
  });

  return Cart;

})();

module.exports = new Cart;



},{"../../helpers":28,"./designData":15,"lodash":undefined}],20:[function(require,module,exports){
var Ctrl, _, angular, d3, der, template,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

angular = require('angular');

d3 = require('d3');

require('../../helpers');

_ = require('lodash');

template = '<svg ng-init=\'vm.resize()\' width=\'100%\' class=\'topChart\'>\n	<defs>\n		<clippath id=\'reg\'>\n			<rect d3-der=\'{width: vm.width, height: vm.height}\' />\n		</clippath>\n	</defs>\n	<g class=\'boilerplate\' shifter=\'[vm.mar.left, vm.mar.top]\'>\n		<rect class=\'background\' d3-der=\'{width: vm.width, height: vm.height}\' ng-mousemove=\'vm.move($event)\' />\n		<g ver-axis-der width=\'vm.width\' scale=\'vm.Ver\' fun=\'vm.verAxFun\'></g>\n		<g hor-axis-der height=\'vm.height\' scale=\'vm.Hor\' fun=\'vm.horAxFun\' shifter=\'[0,vm.height]\'></g>\n		<foreignObject width=\'30\' height=\'30\' y=\'18\' shifter=\'[vm.width/2, vm.height]\'>\n			<text class=\'label\'>$t$</text>\n		</foreignObject>\n\n	</g>\n	<g class=\'main\' clip-path="url(#reg)" shifter=\'[vm.mar.left, vm.mar.top]\'>\n		<line class=\'zero-line hor\' ng-class=\'{"correct": vm.correct}\' d3-der=\'{x1: 0, x2: vm.width, y1: vm.Ver(0), y2: vm.Ver(0)}\'/>\n		<line class=\'tri v\' d3-der=\'{x1: vm.Hor(vm.point.t), x2: vm.Hor(vm.point.t), y1: vm.Ver(0), y2: vm.Ver(vm.point.v )}\'/>\n		<circle r=\'3px\' shifter=\'[vm.Hor(vm.point.t), vm.Ver(vm.point.v)]\' class=\'point v\'/>\n		<path d3-der=\'{d:vm.lineFun(vm.data)}\' class=\'fun v\' />\n		<foreignObject width=\'30\' height=\'30\' shifter=\'[(vm.Hor(vm.point.t) - 16), vm.Ver(vm.point.v/2) - 7]\'>\n				<text class=\'tri-label\' font-size=\'13px\'>$y$</text>\n		</foreignObject>\n		<foreignObject width=\'200\' height=\'30\' shifter=\'[vm.Hor(1), vm.Ver(.9)]\'>\n			<text class=\'tri-label\'>$5(t-.5)(t-1)(t-1)^2$</text>\n		</foreignObject>\n	</g>\n</svg>';

Ctrl = (function() {
  function Ctrl(scope, el, window) {
    var vFun;
    this.scope = scope;
    this.el = el;
    this.window = window;
    this.resize = bind(this.resize, this);
    this.mar = {
      left: 30,
      top: 10,
      right: 20,
      bottom: 40
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



},{"../../helpers":28,"angular":undefined,"d3":undefined,"lodash":undefined}],21:[function(require,module,exports){
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



},{}],22:[function(require,module,exports){
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



},{"angular":undefined,"d3":undefined}],23:[function(require,module,exports){
module.exports = function($parse) {
  return function(scope, el, attr) {
    return d3.select(el[0]).datum($parse(attr.datum)(scope));
  };
};



},{}],24:[function(require,module,exports){
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



},{"d3":undefined}],25:[function(require,module,exports){
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
    t = textures.lines().orientation("3/8", "7/8").size(4).stroke('#E6E6E6').strokeWidth(.6);
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



},{"angular":undefined,"d3":undefined,"textures":undefined}],26:[function(require,module,exports){
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



},{"angular":undefined,"d3":undefined}],27:[function(require,module,exports){
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



},{"angular":undefined,"d3":undefined}],28:[function(require,module,exports){
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvbGV3aXMvUmVzZWFyY2gvZGlmZkVRX25ldy9hcHAvYXBwLmNvZmZlZSIsIi9Vc2Vycy9sZXdpcy9SZXNlYXJjaC9kaWZmRVFfbmV3L2FwcC9jb21wb25lbnRzL2NhcnQvY2FydEJ1dHRvbnMuY29mZmVlIiwiL1VzZXJzL2xld2lzL1Jlc2VhcmNoL2RpZmZFUV9uZXcvYXBwL2NvbXBvbmVudHMvY2FydC9jYXJ0RGF0YS5jb2ZmZWUiLCIvVXNlcnMvbGV3aXMvUmVzZWFyY2gvZGlmZkVRX25ldy9hcHAvY29tcG9uZW50cy9jYXJ0L2NhcnRPYmplY3QuY29mZmVlIiwiL1VzZXJzL2xld2lzL1Jlc2VhcmNoL2RpZmZFUV9uZXcvYXBwL2NvbXBvbmVudHMvY2FydC9jYXJ0UGxvdC5jb2ZmZWUiLCIvVXNlcnMvbGV3aXMvUmVzZWFyY2gvZGlmZkVRX25ldy9hcHAvY29tcG9uZW50cy9jYXJ0L2NhcnRTaW0uY29mZmVlIiwiL1VzZXJzL2xld2lzL1Jlc2VhcmNoL2RpZmZFUV9uZXcvYXBwL2NvbXBvbmVudHMvZGVyaXZhdGl2ZS9kZXJpdmF0aXZlLmNvZmZlZSIsIi9Vc2Vycy9sZXdpcy9SZXNlYXJjaC9kaWZmRVFfbmV3L2FwcC9jb21wb25lbnRzL2Rlcml2YXRpdmUvZGVyaXZhdGl2ZUIuY29mZmVlIiwiL1VzZXJzL2xld2lzL1Jlc2VhcmNoL2RpZmZFUV9uZXcvYXBwL2NvbXBvbmVudHMvZGVyaXZhdGl2ZS9kZXJpdmF0aXZlRGF0YS5jb2ZmZWUiLCIvVXNlcnMvbGV3aXMvUmVzZWFyY2gvZGlmZkVRX25ldy9hcHAvY29tcG9uZW50cy9kZXNpZ24vZGVzaWduQS5jb2ZmZWUiLCIvVXNlcnMvbGV3aXMvUmVzZWFyY2gvZGlmZkVRX25ldy9hcHAvY29tcG9uZW50cy9kZXNpZ24vZGVzaWduQi5jb2ZmZWUiLCIvVXNlcnMvbGV3aXMvUmVzZWFyY2gvZGlmZkVRX25ldy9hcHAvY29tcG9uZW50cy9kZXNpZ24vZGVzaWduQnV0dG9ucy5jb2ZmZWUiLCIvVXNlcnMvbGV3aXMvUmVzZWFyY2gvZGlmZkVRX25ldy9hcHAvY29tcG9uZW50cy9kZXNpZ24vZGVzaWduQ2FydEEuY29mZmVlIiwiL1VzZXJzL2xld2lzL1Jlc2VhcmNoL2RpZmZFUV9uZXcvYXBwL2NvbXBvbmVudHMvZGVzaWduL2Rlc2lnbkNhcnRCLmNvZmZlZSIsIi9Vc2Vycy9sZXdpcy9SZXNlYXJjaC9kaWZmRVFfbmV3L2FwcC9jb21wb25lbnRzL2Rlc2lnbi9kZXNpZ25EYXRhLmNvZmZlZSIsIi9Vc2Vycy9sZXdpcy9SZXNlYXJjaC9kaWZmRVFfbmV3L2FwcC9jb21wb25lbnRzL2Rlc2lnbi9kb3RBLmNvZmZlZSIsIi9Vc2Vycy9sZXdpcy9SZXNlYXJjaC9kaWZmRVFfbmV3L2FwcC9jb21wb25lbnRzL2Rlc2lnbi9kb3RCLmNvZmZlZSIsIi9Vc2Vycy9sZXdpcy9SZXNlYXJjaC9kaWZmRVFfbmV3L2FwcC9jb21wb25lbnRzL2Rlc2lnbi9mYWtlQ2FydC5jb2ZmZWUiLCIvVXNlcnMvbGV3aXMvUmVzZWFyY2gvZGlmZkVRX25ldy9hcHAvY29tcG9uZW50cy9kZXNpZ24vdHJ1ZUNhcnQuY29mZmVlIiwiL1VzZXJzL2xld2lzL1Jlc2VhcmNoL2RpZmZFUV9uZXcvYXBwL2NvbXBvbmVudHMvcmVndWxhci9yZWd1bGFyLmNvZmZlZSIsIi9Vc2Vycy9sZXdpcy9SZXNlYXJjaC9kaWZmRVFfbmV3L2FwcC9kaXJlY3RpdmVzL2JlaGF2aW9yLmNvZmZlZSIsIi9Vc2Vycy9sZXdpcy9SZXNlYXJjaC9kaWZmRVFfbmV3L2FwcC9kaXJlY3RpdmVzL2QzRGVyLmNvZmZlZSIsIi9Vc2Vycy9sZXdpcy9SZXNlYXJjaC9kaWZmRVFfbmV3L2FwcC9kaXJlY3RpdmVzL2RhdHVtLmNvZmZlZSIsIi9Vc2Vycy9sZXdpcy9SZXNlYXJjaC9kaWZmRVFfbmV3L2FwcC9kaXJlY3RpdmVzL3NoaWZ0ZXIuY29mZmVlIiwiL1VzZXJzL2xld2lzL1Jlc2VhcmNoL2RpZmZFUV9uZXcvYXBwL2RpcmVjdGl2ZXMvdGV4dHVyZS5jb2ZmZWUiLCIvVXNlcnMvbGV3aXMvUmVzZWFyY2gvZGlmZkVRX25ldy9hcHAvZGlyZWN0aXZlcy94QXhpcy5jb2ZmZWUiLCIvVXNlcnMvbGV3aXMvUmVzZWFyY2gvZGlmZkVRX25ldy9hcHAvZGlyZWN0aXZlcy95QXhpcy5jb2ZmZWUiLCIvVXNlcnMvbGV3aXMvUmVzZWFyY2gvZGlmZkVRX25ldy9hcHAvaGVscGVycy5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQSxZQUFBLENBQUE7QUFBQSxJQUFBLHdCQUFBOztBQUFBLE9BQ0EsR0FBVSxPQUFBLENBQVEsU0FBUixDQURWLENBQUE7O0FBQUEsRUFFQSxHQUFLLE9BQUEsQ0FBUSxJQUFSLENBRkwsQ0FBQTs7QUFBQSxHQUdBLEdBQU0sT0FBTyxDQUFDLE1BQVIsQ0FBZSxTQUFmLEVBQTBCLENBQUMsT0FBQSxDQUFRLGtCQUFSLENBQUQsQ0FBMUIsQ0FDTCxDQUFDLFNBREksQ0FDTSxZQUROLEVBQ29CLE9BQUEsQ0FBUSxvQkFBUixDQURwQixDQUVMLENBQUMsU0FGSSxDQUVNLFlBRk4sRUFFb0IsT0FBQSxDQUFRLG9CQUFSLENBRnBCLENBR0wsQ0FBQyxTQUhJLENBR00sWUFITixFQUdvQixPQUFBLENBQVEsMkJBQVIsQ0FIcEIsQ0FJTCxDQUFDLFNBSkksQ0FJTSxlQUpOLEVBSXVCLE9BQUEsQ0FBUSw4QkFBUixDQUp2QixDQUtMLENBQUMsU0FMSSxDQUtNLGdCQUxOLEVBS3dCLE9BQUEsQ0FBUSwrQkFBUixDQUx4QixDQU1MLENBQUMsU0FOSSxDQU1NLFNBTk4sRUFNa0IsT0FBQSxDQUFRLHNCQUFSLENBTmxCLENBT0wsQ0FBQyxTQVBJLENBT00sWUFQTixFQU9vQixPQUFBLENBQVEsNkJBQVIsQ0FQcEIsQ0FRTCxDQUFDLFNBUkksQ0FRTSxVQVJOLEVBUWtCLE9BQUEsQ0FBUSx1QkFBUixDQVJsQixDQVNMLENB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QUFBLENBSE4sQ0FBQTs7QUFBQSxNQWdDTSxDQUFDLE9BQVAsR0FBaUIsR0FoQ2pCLENBQUE7Ozs7O0FDQUEsWUFBQSxDQUFBO0FBQUEsTUFFTSxDQUFDLE9BQU8sQ0FBQyxPQUFmLEdBQXlCLFNBQUMsR0FBRCxFQUFNLElBQU4sR0FBQTtTQUN2QixFQUFFLENBQUMsS0FBSCxDQUFTLENBQUEsU0FBQSxLQUFBLEdBQUE7V0FBQSxTQUFBLEdBQUE7QUFDUixNQUFBLEdBQUEsQ0FBQSxDQUFBLENBQUE7YUFDQSxLQUZRO0lBQUEsRUFBQTtFQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBVCxFQUdDLElBSEQsRUFEdUI7QUFBQSxDQUZ6QixDQUFBOztBQUFBLFFBU1EsQ0FBQSxTQUFFLENBQUEsUUFBVixHQUFxQixTQUFDLElBQUQsRUFBTyxJQUFQLEdBQUE7U0FDbkIsTUFBTSxDQUFDLGNBQVAsQ0FBc0IsSUFBQyxDQUFBLFNBQXZCLEVBQWtDLElBQWxDLEVBQXdDLElBQXhDLEVBRG1CO0FBQUEsQ0FUckIsQ0FBQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIndXNlIHN0cmljdCdcbmFuZ3VsYXIgPSByZXF1aXJlICdhbmd1bGFyJ1xuZDMgPSByZXF1aXJlICdkMydcbmFwcCA9IGFuZ3VsYXIubW9kdWxlICdtYWluQXBwJywgW3JlcXVpcmUgJ2FuZ3VsYXItbWF0ZXJpYWwnXVxuXHQuZGlyZWN0aXZlICdob3JBeGlzRGVyJywgcmVxdWlyZSAnLi9kaXJlY3RpdmVzL3hBeGlzJ1xuXHQuZGlyZWN0aXZlICd2ZXJBeGlzRGVyJywgcmVxdWlyZSAnLi9kaXJlY3RpdmVzL3lBeGlzJ1xuXHQuZGlyZWN0aXZlICdjYXJ0U2ltRGVyJywgcmVxdWlyZSAnLi9jb21wb25lbnRzL2NhcnQvY2FydFNpbSdcblx0LmRpcmVjdGl2ZSAnY2FydE9iamVjdERlcicsIHJlcXVpcmUgJy4vY29tcG9uZW50cy9jYXJ0L2NhcnRPYmplY3QnXG5cdC5kaXJlY3RpdmUgJ2NhcnRCdXR0b25zRGVyJywgcmVxdWlyZSAnLi9jb21wb25lbnRzL2NhcnQvY2FydEJ1dHRvbnMnXG5cdC5kaXJlY3RpdmUgJ3NoaWZ0ZXInICwgcmVxdWlyZSAnLi9kaXJlY3RpdmVzL3NoaWZ0ZXInXG5cdC5kaXJlY3RpdmUgJ2Rlc2lnbkFEZXInLCByZXF1aXJlICcuL2NvbXBvbmVudHMvZGVzaWduL2Rlc2lnbkEnXG5cdC5kaXJlY3RpdmUgJ2JlaGF2aW9yJywgcmVxdWlyZSAnLi9kaXJlY3RpdmVzL2JlaGF2aW9yJ1xuXHQuZGlyZWN0aXZlICdkb3RBRGVyJywgcmVxdWlyZSAnLi9jb21wb25lbnRzL2Rlc2lnbi9kb3RBJ1xuXHQuZGlyZWN0aXZlICdkb3RCRGVyJywgcmVxdWlyZSAnLi9jb21wb25lbnRzL2Rlc2lnbi9kb3RCJ1xuXHQuZGlyZWN0aXZlICdkYXR1bScsIHJlcXVpcmUgJy4vZGlyZWN0aXZlcy9kYXR1bSdcblx0LmRpcmVjdGl2ZSAnZDNEZXInLCByZXF1aXJlICcuL2RpcmVjdGl2ZXMvZDNEZXInXG5cdC5kaXJlY3RpdmUgJ2Rlc2lnbkJEZXInICwgcmVxdWlyZSAnLi9jb21wb25lbnRzL2Rlc2lnbi9kZXNpZ25CJ1xuXHQuZGlyZWN0aXZlICdyZWd1bGFyRGVyJywgcmVxdWlyZSAnLi9jb21wb25lbnRzL3JlZ3VsYXIvcmVndWxhcidcblx0LmRpcmVjdGl2ZSAnZGVyaXZhdGl2ZUFEZXInLCByZXF1aXJlICcuL2NvbXBvbmVudHMvZGVyaXZhdGl2ZS9kZXJpdmF0aXZlJ1xuXHQuZGlyZWN0aXZlICdkZXJpdmF0aXZlQkRlcicsIHJlcXVpcmUgJy4vY29tcG9uZW50cy9kZXJpdmF0aXZlL2Rlcml2YXRpdmVCJ1xuXHQuZGlyZWN0aXZlICdjYXJ0UGxvdERlcicsIHJlcXVpcmUgJy4vY29tcG9uZW50cy9jYXJ0L2NhcnRQbG90J1xuXHQuZGlyZWN0aXZlICdkZXNpZ25DYXJ0QURlcicsIHJlcXVpcmUgJy4vY29tcG9uZW50cy9kZXNpZ24vZGVzaWduQ2FydEEnXG5cdC5kaXJlY3RpdmUgJ2Rlc2lnbkNhcnRCRGVyJywgcmVxdWlyZSAnLi9jb21wb25lbnRzL2Rlc2lnbi9kZXNpZ25DYXJ0Qidcblx0LmRpcmVjdGl2ZSAndGV4dHVyZURlcicsIHJlcXVpcmUgJy4vZGlyZWN0aXZlcy90ZXh0dXJlJ1xuXHQuZGlyZWN0aXZlICdkZXNpZ25CdXR0b25zRGVyJywgcmVxdWlyZSAnLi9jb21wb25lbnRzL2Rlc2lnbi9kZXNpZ25CdXR0b25zJ1xuXG5sb29wZXIgPSAtPlxuICAgIHNldFRpbWVvdXQoICgpLT5cbiAgICBcdFx0XHRkMy5zZWxlY3RBbGwgJ2NpcmNsZS5kb3QubGFyZ2UnXG4gICAgXHRcdFx0XHQudHJhbnNpdGlvbiAnZ3JvdydcbiAgICBcdFx0XHRcdC5kdXJhdGlvbiA1MDBcbiAgICBcdFx0XHRcdC5lYXNlICdjdWJpYy1vdXQnXG4gICAgXHRcdFx0XHQuYXR0ciAndHJhbnNmb3JtJywgJ3NjYWxlKCAxLjM0KSdcbiAgICBcdFx0XHRcdC50cmFuc2l0aW9uICdzaHJpbmsnXG4gICAgXHRcdFx0XHQuZHVyYXRpb24gNTAwXG4gICAgXHRcdFx0XHQuZWFzZSAnY3ViaWMtb3V0J1xuICAgIFx0XHRcdFx0LmF0dHIgJ3RyYW5zZm9ybScsICdzY2FsZSggMS4wKSdcbiAgICBcdFx0XHRsb29wZXIoKVxuICAgIFx0XHQsIDEwMDApXG5cbmxvb3BlcigpXG4iLCJfID0gcmVxdWlyZSAnbG9kYXNoJ1xue2V4cCwgc3FydCwgYXRhbn0gPSBNYXRoXG5DYXJ0ID0gcmVxdWlyZSAnLi9jYXJ0RGF0YSdcblxudGVtcGxhdGUgPSAnJydcblx0PG1kLWJ1dHRvbiBjbGFzcz0nbXlCdXR0b24nIG5nLWNsaWNrPSd2bS5jbGljaygpJyBuZy1pbml0PSd2bS5wbGF5KCknPnt7dm0ucGF1c2VkID8gJ1BMQVknIDogJ1BBVVNFJ319IDwvbWQtYnV0dG9uPlxuJycnXG5cbmNsYXNzIEN0cmxcblx0Y29uc3RydWN0b3I6IChAc2NvcGUpLT5cblxuXHRjbGljazogLT5cblx0XHRpZiBAcGF1c2VkIHRoZW4gQHBsYXkoKSBlbHNlIEBwYXVzZSgpXG5cblx0cGxheTogLT5cblx0XHRAcGF1c2VkID0gdHJ1ZVxuXHRcdGQzLnRpbWVyLmZsdXNoKClcblx0XHRAcGF1c2VkID0gZmFsc2Vcblx0XHRsYXN0ID0gMFxuXHRcdGQzLnRpbWVyIChlbGFwc2VkKT0+XG5cdFx0XHRcdGR0ID0gZWxhcHNlZCAtIGxhc3Rcblx0XHRcdFx0Q2FydC5pbmNyZW1lbnQgZHQvMTAwMFxuXHRcdFx0XHRsYXN0ID0gZWxhcHNlZFxuXHRcdFx0XHRpZiBDYXJ0LnQgPiA0XG5cdFx0XHRcdFx0Q2FydC5zZXRfdCAwXG5cdFx0XHRcdEBzY29wZS4kZXZhbEFzeW5jKClcblx0XHRcdFx0QHBhdXNlZFxuXHRcdFx0LCAxXG5cblx0cGF1c2U6IC0+XG5cdFx0QHBhdXNlZCA9IHRydWVcblxuZGVyID0gKCktPlxuXHRkaXJlY3RpdmUgPSBcblx0XHRjb250cm9sbGVyQXM6ICd2bSdcblx0XHRzY29wZToge31cblx0XHRjb250cm9sbGVyOiBbJyRzY29wZScsIEN0cmxdXG5cdFx0dGVtcGxhdGU6IHRlbXBsYXRlXG5cbm1vZHVsZS5leHBvcnRzID0gZGVyIiwiXyA9IHJlcXVpcmUgJ2xvZGFzaCdcbntleHB9ID0gTWF0aFxuXG5jbGFzcyBDYXJ0XG5cdGNvbnN0cnVjdG9yOiAoQG9wdGlvbnMpLT5cblx0XHR7QHYwLCBAa30gPSBAb3B0aW9uc1xuXHRcdEByZXN0YXJ0KClcblx0cmVzdGFydDogLT5cblx0XHRAdCA9IEB4ID0gMFxuXHRcdEB0cmFqZWN0b3J5ID0gXy5yYW5nZSAwICwgNiAsIDEvNTBcblx0XHRcdC5tYXAgKHQpPT5cblx0XHRcdFx0diA9IEB2MCAqIGV4cCgtQGsgKiB0KVxuXHRcdFx0XHRyZXMgPSBcblx0XHRcdFx0XHR2OiB2XG5cdFx0XHRcdFx0eDogQHYwL0BrICogKDEtZXhwKC1Aayp0KSlcblx0XHRcdFx0XHRkdjogLUBrKnZcblx0XHRcdFx0XHR0OiB0XG5cdFx0QG1vdmUgMFxuXHRcdEBwYXVzZWQgPSB0cnVlXG5cdHNldF90OiAodCktPlxuXHRcdEB0ID0gdFxuXHRcdEBtb3ZlIHRcblx0aW5jcmVtZW50OiAoZHQpLT5cblx0XHRAdCs9ZHRcblx0XHRAbW92ZSBAdFxuXHRtb3ZlOiAodCktPlxuXHRcdEB2ID0gQHYwICogZXhwKCAtQGsgKiB0KVxuXHRcdEB4ID0gQHYwL0BrICogKDEtZXhwKC1Aayp0KSlcblx0XHRAZHYgPSAtQGsqQHZcblxubW9kdWxlLmV4cG9ydHMgPSBuZXcgQ2FydCB7djA6IDIsIGs6IC44fSIsIlxuY2xhc3MgQ3RybFxuXHRjb25zdHJ1Y3RvcjooQHNjb3BlLCBAZWwsIEB3aW5kb3cpLT5cblxuXHR0cmFuczogKHRyYW4pLT5cblx0XHR0cmFuXG5cdFx0XHQuZHVyYXRpb24gNTBcblx0XHRcdC5lYXNlICdsaW5lYXInXG5cbmRlciA9ICgpLT5cblx0ZGlyZWN0aXZlID0gXG5cdFx0c2NvcGU6IFxuXHRcdFx0IyBkYXRhOiAnPUNhcnRPYmplY3REZXInXG5cdFx0XHRsZWZ0OiAnPSdcblx0XHRjb250cm9sbGVyQXM6ICd2bSdcblx0XHR0ZW1wbGF0ZU5hbWVzcGFjZTogJ3N2Zydcblx0XHRjb250cm9sbGVyOiBbJyRzY29wZScsJyRlbGVtZW50JywnJHdpbmRvdycsIEN0cmxdXG5cdFx0dGVtcGxhdGVVcmw6ICcuL2FwcC9jb21wb25lbnRzL2NhcnQvY2FydC5zdmcnXG5cdFx0YmluZFRvQ29udHJvbGxlcjogdHJ1ZVxuXHRcdHJlc3RyaWN0OiAnQSdcblxubW9kdWxlLmV4cG9ydHMgPSBkZXIiLCJhbmd1bGFyID0gcmVxdWlyZSAnYW5ndWxhcidcbmQzID0gcmVxdWlyZSAnZDMnXG5yZXF1aXJlICcuLi8uLi9oZWxwZXJzJ1xuXyA9IHJlcXVpcmUgJ2xvZGFzaCdcbkNhcnQgPSByZXF1aXJlICcuL2NhcnREYXRhJ1xudGVtcGxhdGUgPSAnJydcblx0PHN2ZyBuZy1pbml0PSd2bS5yZXNpemUoKScgd2lkdGg9JzEwMCUnIGNsYXNzPSd0b3BDaGFydCc+XG5cdFx0PGRlZnM+XG5cdFx0XHQ8Y2xpcHBhdGggaWQ9J2NhcnRQbG90Jz5cblx0XHRcdFx0PHJlY3QgZDMtZGVyPSd7d2lkdGg6IHZtLndpZHRoLCBoZWlnaHQ6IHZtLmhlaWdodH0nIC8+XG5cdFx0XHQ8L2NsaXBwYXRoPlxuXHRcdDwvZGVmcz5cblx0XHQ8ZyBjbGFzcz0nYm9pbGVycGxhdGUnIHNoaWZ0ZXI9J1t2bS5tYXIubGVmdCwgdm0ubWFyLnRvcF0nPlxuXHRcdFx0PHJlY3QgY2xhc3M9J2JhY2tncm91bmQnIGQzLWRlcj0ne3dpZHRoOiB2bS53aWR0aCwgaGVpZ2h0OiB2bS5oZWlnaHR9JyAvPlxuXHRcdFx0PGcgdmVyLWF4aXMtZGVyIHdpZHRoPSd2bS53aWR0aCcgc2NhbGU9J3ZtLlYnIGZ1bj0ndm0udmVyQXhGdW4nPjwvZz5cblx0XHRcdDxnIGhvci1heGlzLWRlciBoZWlnaHQ9J3ZtLmhlaWdodCcgc2NhbGU9J3ZtLlQnIGZ1bj0ndm0uaG9yQXhGdW4nIHNoaWZ0ZXI9J1swLHZtLmhlaWdodF0nPjwvZz5cblx0XHRcdDxmb3JlaWduT2JqZWN0IHdpZHRoPSczMCcgaGVpZ2h0PSczMCcgeT0nMTcnIHNoaWZ0ZXI9J1t2bS53aWR0aC8yLCB2bS5oZWlnaHRdJz5cblx0XHRcdFx0PHRleHQgY2xhc3M9J2xhYmVsJyA+JHQkPC90ZXh0PlxuXHRcdFx0PC9mb3JlaWduT2JqZWN0PlxuXHRcdFx0PGZvcmVpZ25PYmplY3Qgd2lkdGg9JzMwJyBoZWlnaHQ9JzMwJyBzaGlmdGVyPSdbLTMxLCB2bS5oZWlnaHQvMi04XSc+XG5cdFx0XHRcdFx0PHRleHQgY2xhc3M9J2xhYmVsJyA+JHYkPC90ZXh0PlxuXHRcdFx0PC9mb3JlaWduT2JqZWN0PlxuXHRcdFx0PGxpbmUgY2xhc3M9J3plcm8tbGluZScgZDMtZGVyPVwie3gxOiAwICwgeDI6IHZtLndpZHRoLCB5MTogdm0uVigwKSwgeTI6IHZtLlYoMCl9XCIgLz4gXG5cdFx0XHQ8bGluZSBjbGFzcz0nemVyby1saW5lJyBkMy1kZXI9XCJ7eDE6IHZtLlQoMCkgLCB4Mjogdm0uVCgwKSwgeTE6IDAsIHkyOiB2bS5oZWlnaHR9XCIgLz4gXG5cdFx0PC9nPlxuXHRcdDxnIGNsYXNzPSdtYWluJyBjbGlwLXBhdGg9XCJ1cmwoI2NhcnRQbG90KVwiIHNoaWZ0ZXI9J1t2bS5tYXIubGVmdCwgdm0ubWFyLnRvcF0nPlxuXHRcdFx0PGZvcmVpZ25PYmplY3Qgd2lkdGg9JzMwJyBoZWlnaHQ9JzMwJyBzaGlmdGVyPSdbKHZtLlQodm0ucG9pbnQudCkgLSAxNiksIHZtLnN0aGluZ10nIHN0eWxlPSdmb250LXNpemU6IDEzcHg7IGZvbnQtd2VpZ2h0OiAxMDA7Jz5cblx0XHRcdFx0XHQ8dGV4dCBjbGFzcz0nbGFiZWwnIGZvbnQtc2l6ZT0nMTNweCc+JHYkPC90ZXh0PlxuXHRcdFx0PC9mb3JlaWduT2JqZWN0PlxuXHRcdFx0PGxpbmUgY2xhc3M9J3RyaSB2JyBkMy1kZXI9J3t4MTogdm0uVCh2bS5wb2ludC50KS0xLCB4Mjogdm0uVCh2bS5wb2ludC50KS0xLCB5MTogdm0uVigwKSwgeTI6IHZtLlYodm0ucG9pbnQudil9Jy8+XG5cdFx0XHQ8cGF0aCBuZy1hdHRyLWQ9J3t7dm0ubGluZUZ1bih2bS50cmFqZWN0b3J5KX19JyBjbGFzcz0nZnVuIHYnIC8+XG5cdFx0XHQ8Y2lyY2xlIHI9JzNweCcgc2hpZnRlcj0nW3ZtLlQodm0ucG9pbnQudCksIHZtLlYodm0ucG9pbnQudildJyBjbGFzcz0ncG9pbnQgdicvPlxuXHRcdFx0PGZvcmVpZ25PYmplY3Qgd2lkdGg9JzcwJyBoZWlnaHQ9JzMwJyBzaGlmdGVyPSdbdm0uVCg0KSwgdm0uViguNCldJz5cblx0XHRcdFx0XHQ8dGV4dCBjbGFzcz0ndHJpLWxhYmVsJyA+JDJlXnstLjh0fSQ8L3RleHQ+XG5cdFx0XHQ8L2ZvcmVpZ25PYmplY3Q+XG5cdFx0PC9nPlxuXHQ8L3N2Zz5cbicnJ1xuXG5jbGFzcyBDdHJsXG5cdGNvbnN0cnVjdG9yOiAoQHNjb3BlLCBAZWwsIEB3aW5kb3cpLT5cblx0XHRAbWFyID0gXG5cdFx0XHRsZWZ0OiAzMFxuXHRcdFx0dG9wOiAxMFxuXHRcdFx0cmlnaHQ6IDEwXG5cdFx0XHRib3R0b206IDQwXG5cblx0XHRAViA9IGQzLnNjYWxlLmxpbmVhcigpLmRvbWFpbiBbLS4xLDIuNV1cblx0XHRAVCA9IGQzLnNjYWxlLmxpbmVhcigpLmRvbWFpbiBbLS4xLDVdXG5cblx0XHRAcG9pbnQgPSBDYXJ0XG5cdFx0QHRyYWplY3RvcnkgPSBDYXJ0LnRyYWplY3RvcnlcblxuXHRcdEBob3JBeEZ1biA9IGQzLnN2Zy5heGlzKClcblx0XHRcdC5zY2FsZSBAVFxuXHRcdFx0LnRpY2tzIDVcblx0XHRcdC5vcmllbnQgJ2JvdHRvbSdcblxuXHRcdEB2ZXJBeEZ1biA9IGQzLnN2Zy5heGlzKClcblx0XHRcdC5zY2FsZSBAVlxuXHRcdFx0LnRpY2tzIDVcblx0XHRcdC5vcmllbnQgJ2xlZnQnXG5cdFx0XG5cdFx0QGxpbmVGdW4gPSBkMy5zdmcubGluZSgpXG5cdFx0XHQueSAoZCk9PiBAViBkLnZcblx0XHRcdC54IChkKT0+IEBUIGQudFxuXG5cdFx0YW5ndWxhci5lbGVtZW50IEB3aW5kb3dcblx0XHRcdC5vbiAncmVzaXplJywgQHJlc2l6ZVxuXG5cdFx0QG1vdmUgPSAoZXZlbnQpID0+XG5cdFx0XHRpZiBub3QgQ2FydC5wYXVzZWQgdGhlbiByZXR1cm5cblx0XHRcdHJlY3QgPSBldmVudC50YXJnZXQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KClcblx0XHRcdHQgPSBAVC5pbnZlcnQgZXZlbnQueCAtIHJlY3QubGVmdFxuXHRcdFx0dCA9IE1hdGgubWF4IDAgLCB0XG5cdFx0XHRDYXJ0LnNldF90IHRcblx0XHRcdEBzY29wZS4kZXZhbEFzeW5jKClcblxuXHRAcHJvcGVydHkgJ3N0aGluZycsIGdldDotPlxuXHRcdEBWKEBwb2ludC52LzIpIC0gN1xuXG5cdEBwcm9wZXJ0eSAnc3ZnX2hlaWdodCcsIGdldDogLT4gQGhlaWdodCArIEBtYXIudG9wICsgQG1hci5ib3R0b21cblxuXHRyZXNpemU6ICgpPT5cblx0XHRAd2lkdGggPSBAZWxbMF0uY2xpZW50V2lkdGggLSBAbWFyLmxlZnQgLSBAbWFyLnJpZ2h0XG5cdFx0QGhlaWdodCA9IEBlbFswXS5jbGllbnRIZWlnaHQgLSBAbWFyLmxlZnQgLSBAbWFyLnJpZ2h0XG5cdFx0QFYucmFuZ2UgW0BoZWlnaHQsIDBdXG5cdFx0QFQucmFuZ2UgWzAsIEB3aWR0aF1cblx0XHRAc2NvcGUuJGV2YWxBc3luYygpXG5cbmRlciA9ICgpLT5cblx0ZGlyZWN0aXZlID0gXG5cdFx0Y29udHJvbGxlckFzOiAndm0nXG5cdFx0c2NvcGU6IHt9XG5cdFx0dGVtcGxhdGU6IHRlbXBsYXRlXG5cdFx0dGVtcGxhdGVOYW1lc3BhY2U6ICdzdmcnXG5cdFx0Y29udHJvbGxlcjogWyckc2NvcGUnLCckZWxlbWVudCcsICckd2luZG93JywgQ3RybF1cblxubW9kdWxlLmV4cG9ydHMgPSBkZXJcbiIsIl8gPSByZXF1aXJlICdsb2Rhc2gnXG5kMz0gcmVxdWlyZSAnZDMnXG57bWlufSA9IE1hdGhcbkNhcnQgPSByZXF1aXJlICcuL2NhcnREYXRhJ1xucmVxdWlyZSAnLi4vLi4vaGVscGVycydcblxudGVtcGxhdGUgPSAnJydcblx0PHN2ZyBuZy1pbml0PSd2bS5yZXNpemUoKScgd2lkdGg9JzEwMCUnIG5nLWF0dHItaGVpZ2h0PVwie3t2bS5zdmdIZWlnaHR9fVwiPlxuXHRcdDxkZWZzPlxuXHRcdFx0PGNsaXBwYXRoIGlkPSdjYXJ0U2ltJz5cblx0XHRcdFx0PHJlY3QgZDMtZGVyPSd7d2lkdGg6IHZtLndpZHRoLCBoZWlnaHQ6IHZtLmhlaWdodH0nIC8+XG5cdFx0XHQ8L2NsaXBwYXRoPlxuXHRcdDwvZGVmcz5cblx0XHQ8ZyBjbGFzcz0nYm9pbGVycGxhdGUnIHNoaWZ0ZXI9J3t7Ojpbdm0ubWFyLmxlZnQsIHZtLm1hci50b3BdfX0nID5cblx0XHRcdDxyZWN0IGQzLWRlcj0ne3dpZHRoOiB2bS53aWR0aCwgaGVpZ2h0OiB2bS5oZWlnaHR9JyBjbGFzcz0nYmFja2dyb3VuZCcvPlxuXHRcdFx0PGcgaG9yLWF4aXMtZGVyIGhlaWdodD0ndm0uaGVpZ2h0JyBzY2FsZT0ndm0uWCcgZnVuPSd2bS5heGlzRnVuJyBzaGlmdGVyPSdbMCx2bS5oZWlnaHRdJz48L2c+XG5cdFx0XHQ8Zm9yZWlnbk9iamVjdCB3aWR0aD0nMzAnIGhlaWdodD0nMzAnIHk9JzIwJyBzaGlmdGVyPSdbdm0ud2lkdGgvMiwgdm0uaGVpZ2h0XSc+XG5cdFx0XHRcdFx0PHRleHQgY2xhc3M9J2xhYmVsJyA+JHgkPC90ZXh0PlxuXHRcdFx0PC9mb3JlaWduT2JqZWN0PlxuXHRcdDwvZz5cblx0XHQ8ZyBzaGlmdGVyPSd7ezo6W3ZtLm1hci5sZWZ0LCB2bS5tYXIudG9wXX19JyBjbGlwLXBhdGg9XCJ1cmwoI2NhcnRTaW0pXCIgPlxuXHRcdFx0PGZvcmVpZ25PYmplY3Qgd2lkdGg9JzMwJyBoZWlnaHQ9JzMwJyB5PScyMCcgc2hpZnRlcj0nW3ZtLndpZHRoLzIsIHZtLmhlaWdodF0nPlxuXHRcdFx0XHRcdDx0ZXh0IGNsYXNzPSdsYWJlbCcgPiR0JDwvdGV4dD5cblx0XHRcdDwvZm9yZWlnbk9iamVjdD5cblx0XHRcdDxnIGNsYXNzPSdnLWNhcnQnIGNhcnQtb2JqZWN0LWRlciBsZWZ0PSd2bS5YKHZtLkNhcnQueCknIHRyYW5zZm9ybT0ndHJhbnNsYXRlKDAsMjUpJz48L2c+XG5cdFx0PC9nPlxuXHQ8L3N2Zz5cbicnJ1xuXG5jbGFzcyBDdHJsXG5cdGNvbnN0cnVjdG9yOiAoQHNjb3BlLCBAZWwsIEB3aW5kb3cpLT5cblx0XHRAQ2FydCA9IENhcnRcblx0XHRAbWFyID0gXG5cdFx0XHRsZWZ0OiAzMFxuXHRcdFx0cmlnaHQ6IDEwXG5cdFx0XHR0b3A6IDEwXG5cdFx0XHRib3R0b206IDE4XG5cdFx0QFggPSBkMy5zY2FsZS5saW5lYXIoKS5kb21haW4gWy0uMSwzXSBcblxuXHRcdEBheGlzRnVuID0gZDMuc3ZnLmF4aXMoKVxuXHRcdFx0LnNjYWxlIEBYXG5cdFx0XHQudGlja3MgNVxuXHRcdFx0Lm9yaWVudCAnYm90dG9tJ1xuXG5cdFx0YW5ndWxhci5lbGVtZW50IEB3aW5kb3dcblx0XHRcdC5vbiAncmVzaXplJyAsICgpPT5AcmVzaXplKClcblxuXHR0cmFuOiAodHJhbiktPlxuXHRcdHRyYW4uZWFzZSAnbGluZWFyJ1xuXHRcdFx0LmR1cmF0aW9uIDYwXG5cblx0QHByb3BlcnR5ICdzdmdIZWlnaHQnLCBnZXQ6LT4gQGhlaWdodCArIEBtYXIudG9wK0BtYXIuYm90dG9tXG5cblx0cmVzaXplOiAoKT0+XG5cdFx0QHdpZHRoID0gQGVsWzBdLmNsaWVudFdpZHRoIC0gQG1hci5sZWZ0IC0gQG1hci5yaWdodFxuXHRcdEBoZWlnaHQgPSA2MFxuXHRcdEBYLnJhbmdlKFswLCBAd2lkdGhdKVxuXHRcdEBzY29wZS4kZXZhbEFzeW5jKClcblxuXG5cbmRlciA9ICgpLT5cblx0ZGlyZWN0aXZlID0gXG5cdFx0dGVtcGxhdGU6IHRlbXBsYXRlXG5cdFx0c2NvcGU6IHt9XG5cdFx0cmVzdHJpY3Q6ICdBJ1xuXHRcdGJpbmRUb0NvbnRyb2xsZXI6IHRydWVcblx0XHR0ZW1wbGF0ZU5hbWVzcGFjZTogJ3N2Zydcblx0XHRjb250cm9sbGVyOiBbJyRzY29wZScsICckZWxlbWVudCcsICckd2luZG93JywgQ3RybF1cblx0XHRjb250cm9sbGVyQXM6ICd2bSdcblxubW9kdWxlLmV4cG9ydHMgPSBkZXJcbiIsImFuZ3VsYXIgPSByZXF1aXJlICdhbmd1bGFyJ1xuZDMgPSByZXF1aXJlICdkMydcbnJlcXVpcmUgJy4uLy4uL2hlbHBlcnMnXG5fID0gcmVxdWlyZSAnbG9kYXNoJ1xuRGF0YSA9IHJlcXVpcmUgJy4vZGVyaXZhdGl2ZURhdGEnXG5cbnRlbXBsYXRlID0gJycnXG5cdDxzdmcgbmctaW5pdD0ndm0ucmVzaXplKCknIHdpZHRoPScxMDAlJyBjbGFzcz0ndG9wQ2hhcnQnPlxuXHRcdDxkZWZzPlxuXHRcdFx0PGNsaXBwYXRoIGlkPSdkZXJDbGlwJz5cblx0XHRcdFx0PHJlY3QgZDMtZGVyPSd7d2lkdGg6IHZtLndpZHRoLCBoZWlnaHQ6IHZtLmhlaWdodH0nPjwvcmVjdD5cblx0XHRcdDwvY2xpcHBhdGg+XG5cdFx0PC9kZWZzPlxuXHRcdDxnIGNsYXNzPSdib2lsZXJwbGF0ZScgc2hpZnRlcj0nW3ZtLm1hci5sZWZ0LCB2bS5tYXIudG9wXSc+XG5cdFx0XHQ8cmVjdCBjbGFzcz0nYmFja2dyb3VuZCcgZDMtZGVyPSd7d2lkdGg6IHZtLndpZHRoLCBoZWlnaHQ6IHZtLmhlaWdodH0nIG5nLW1vdXNlbW92ZT0ndm0ubW92ZSgkZXZlbnQpJyAvPlxuXHRcdFx0PGcgdmVyLWF4aXMtZGVyIHdpZHRoPSd2bS53aWR0aCcgc2NhbGU9J3ZtLlZlcicgZnVuPSd2bS52ZXJBeEZ1bic+PC9nPlxuXHRcdFx0PGcgaG9yLWF4aXMtZGVyIGhlaWdodD0ndm0uaGVpZ2h0JyBzY2FsZT0ndm0uSG9yJyBmdW49J3ZtLmhvckF4RnVuJyBzaGlmdGVyPSdbMCx2bS5oZWlnaHRdJz48L2c+XG5cdFx0XHQ8Zm9yZWlnbk9iamVjdCB3aWR0aD0nMzAnIGhlaWdodD0nMzAnIHk9JzIwJyBzaGlmdGVyPSdbdm0ud2lkdGgvMiwgdm0uaGVpZ2h0XSc+XG5cdFx0XHRcdFx0PHRleHQgY2xhc3M9J2xhYmVsJyA+JHQkPC90ZXh0PlxuXHRcdFx0PC9mb3JlaWduT2JqZWN0PlxuXHRcdDwvZz5cblx0XHQ8ZyBjbGFzcz0nbWFpbicgY2xpcC1wYXRoPVwidXJsKCNkZXJDbGlwKVwiIHNoaWZ0ZXI9J1t2bS5tYXIubGVmdCwgdm0ubWFyLnRvcF0nPlxuXHRcdFx0PGxpbmUgY2xhc3M9J3plcm8tbGluZSBob3InIGQzLWRlcj0ne3gxOiAwLCB4Mjogdm0ud2lkdGgsIHkxOiB2bS5WZXIoMCksIHkyOiB2bS5WZXIoMCl9Jy8+XG5cdFx0XHQ8cGF0aCBuZy1hdHRyLWQ9J3t7dm0ubGluZUZ1bih2bS5kYXRhKX19JyBjbGFzcz0nZnVuIHYnIC8+XG5cdFx0XHQ8cGF0aCBuZy1hdHRyLWQ9J3t7dm0udHJpYW5nbGVEYXRhfX0nIGNsYXNzPSd0cmknIC8+XG5cdFx0XHQ8bGluZSBjbGFzcz0ndHJpIGR2JyBkMy1kZXI9J3t4MTogdm0uSG9yKHZtLnBvaW50LnQpLTEsIHgyOiB2bS5Ib3Iodm0ucG9pbnQudCktMSwgeTE6IHZtLlZlcih2bS5wb2ludC52KSwgeTI6IHZtLlZlcigodm0ucG9pbnQudiArIHZtLnBvaW50LmR2KSl9Jy8+XG5cdFx0XHQ8Zm9yZWlnbk9iamVjdCB3aWR0aD0nMzAnIGhlaWdodD0nMzAnIHNoaWZ0ZXI9J1sodm0uSG9yKHZtLnBvaW50LnQpIC0gMTYpLCB2bS5zdGhpbmddJz5cblx0XHRcdFx0XHQ8dGV4dCBjbGFzcz0ndHJpLWxhYmVsJyA+JFxcXFxkb3R7eX0kPC90ZXh0PlxuXHRcdFx0PC9mb3JlaWduT2JqZWN0PlxuXHRcdFx0PGZvcmVpZ25PYmplY3Qgd2lkdGg9JzEwMCcgaGVpZ2h0PSczMCcgc2hpZnRlcj0nW3ZtLkhvcigxLjY1KSwgdm0uVmVyKDEuMzgpXSc+XG5cdFx0XHRcdDx0ZXh0IGNsYXNzPSd0cmktbGFiZWwnPiRcXFxcc2luKHQpJDwvdGV4dD5cblx0XHRcdDwvZm9yZWlnbk9iamVjdD5cblx0XHRcdDxjaXJjbGUgcj0nM3B4JyAgc2hpZnRlcj0nW3ZtLkhvcih2bS5wb2ludC50KSwgdm0uVmVyKHZtLnBvaW50LnYpXScgY2xhc3M9J3BvaW50IHYnLz5cblx0XHQ8L2c+XG5cdDwvc3ZnPlxuJycnXG5cdFx0XHRcbmNsYXNzIEN0cmxcblx0Y29uc3RydWN0b3I6IChAc2NvcGUsIEBlbCwgQHdpbmRvdyktPlxuXHRcdEBtYXIgPSBcblx0XHRcdGxlZnQ6IDMwXG5cdFx0XHR0b3A6IDIwXG5cdFx0XHRyaWdodDogMjBcblx0XHRcdGJvdHRvbTogMzVcblxuXHRcdEBWZXIgPSBkMy5zY2FsZS5saW5lYXIoKS5kb21haW4gWy0xLjUsMS41XVxuXHRcdEBIb3IgPSBkMy5zY2FsZS5saW5lYXIoKS5kb21haW4gWzAsNl1cblxuXHRcdEBkYXRhID0gRGF0YS5kYXRhXG5cblx0XHRAaG9yQXhGdW4gPSBkMy5zdmcuYXhpcygpXG5cdFx0XHQuc2NhbGUgQEhvclxuXHRcdFx0LnRpY2tzIDVcblx0XHRcdC5vcmllbnQgJ2JvdHRvbSdcblxuXHRcdEB2ZXJBeEZ1biA9IGQzLnN2Zy5heGlzKClcblx0XHRcdC5zY2FsZSBAVmVyXG5cdFx0XHQudGlja0Zvcm1hdCAoZCktPlxuXHRcdFx0XHRpZiBNYXRoLmZsb29yKCBkICkgIT0gZCB0aGVuIHJldHVyblxuXHRcdFx0XHRkXG5cdFx0XHQudGlja3MgNVxuXHRcdFx0Lm9yaWVudCAnbGVmdCdcblxuXHRcdEBsaW5lRnVuID0gZDMuc3ZnLmxpbmUoKVxuXHRcdFx0LnkgKGQpPT4gQFZlciBkLnZcblx0XHRcdC54IChkKT0+IEBIb3IgZC50XG5cblx0XHRhbmd1bGFyLmVsZW1lbnQgQHdpbmRvd1xuXHRcdFx0Lm9uICdyZXNpemUnLCBAcmVzaXplXG5cblx0XHRAbW92ZSA9IChldmVudCkgPT5cblx0XHRcdHQgPSBASG9yLmludmVydCBldmVudC54IC0gZXZlbnQudGFyZ2V0LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLmxlZnRcblx0XHRcdERhdGEubW92ZSB0XG5cdFx0XHRAc2NvcGUuJGV2YWxBc3luYygpXG5cblx0QHByb3BlcnR5ICdzdmdfaGVpZ2h0JywgZ2V0OiAtPiBAaGVpZ2h0ICsgQG1hci50b3AgKyBAbWFyLmJvdHRvbVxuXG5cdEBwcm9wZXJ0eSAnc3RoaW5nJywgZ2V0Oi0+XG5cdFx0QFZlcihAcG9pbnQuZHYvMiArIEBwb2ludC52KSAtIDdcblxuXHRAcHJvcGVydHkgJ3BvaW50JywgZ2V0Oi0+XG5cdFx0RGF0YS5wb2ludFxuXG5cdEBwcm9wZXJ0eSAndHJpYW5nbGVEYXRhJywgZ2V0Oi0+XG5cdFx0QGxpbmVGdW4gW3t2OiBAcG9pbnQudiwgdDogQHBvaW50LnR9LCB7djpAcG9pbnQuZHYgKyBAcG9pbnQudiwgdDogQHBvaW50LnQrMX0sIHt2OiBAcG9pbnQuZHYgKyBAcG9pbnQudiwgdDogQHBvaW50LnR9XVxuXG5cdHJlc2l6ZTogKCk9PlxuXHRcdEB3aWR0aCA9IEBlbFswXS5jbGllbnRXaWR0aCAtIEBtYXIubGVmdCAtIEBtYXIucmlnaHRcblx0XHRAaGVpZ2h0ID0gQGVsWzBdLmNsaWVudEhlaWdodCAtIEBtYXIudG9wIC0gQG1hci5ib3R0b20gLSA4XG5cdFx0QFZlci5yYW5nZSBbQGhlaWdodCwgMF1cblx0XHRASG9yLnJhbmdlIFswLCBAd2lkdGhdXG5cdFx0QHNjb3BlLiRldmFsQXN5bmMoKVxuXG5kZXIgPSAoKS0+XG5cdGRpcmVjdGl2ZSA9IFxuXHRcdGNvbnRyb2xsZXJBczogJ3ZtJ1xuXHRcdHNjb3BlOiB7fVxuXHRcdHRlbXBsYXRlOiB0ZW1wbGF0ZVxuXHRcdHRlbXBsYXRlTmFtZXNwYWNlOiAnc3ZnJ1xuXHRcdGNvbnRyb2xsZXI6IFsnJHNjb3BlJywnJGVsZW1lbnQnLCAnJHdpbmRvdycsIEN0cmxdXG5cbm1vZHVsZS5leHBvcnRzID0gZGVyXG4iLCJhbmd1bGFyID0gcmVxdWlyZSAnYW5ndWxhcidcbmQzID0gcmVxdWlyZSAnZDMnXG5yZXF1aXJlICcuLi8uLi9oZWxwZXJzJ1xuXyA9IHJlcXVpcmUgJ2xvZGFzaCdcbkRhdGEgPSByZXF1aXJlICcuL2Rlcml2YXRpdmVEYXRhJ1xuXG50ZW1wbGF0ZSA9ICcnJ1xuXHQ8c3ZnIG5nLWluaXQ9J3ZtLnJlc2l6ZSgpJyB3aWR0aD0nMTAwJScgIGNsYXNzPSd0b3BDaGFydCc+XG5cdFx0PGRlZnM+XG5cdFx0XHQ8Y2xpcHBhdGggaWQ9J2RlcnZhdGl2ZUInPlxuXHRcdFx0XHQ8cmVjdCBkMy1kZXI9J3t3aWR0aDogdm0ud2lkdGgsIGhlaWdodDogdm0uaGVpZ2h0fScgLz5cblx0XHRcdDwvY2xpcHBhdGg+XG5cdFx0PC9kZWZzPlxuXHRcdDxnIGNsYXNzPSdib2lsZXJwbGF0ZScgc2hpZnRlcj0nW3ZtLm1hci5sZWZ0LCB2bS5tYXIudG9wXSc+XG5cdFx0XHQ8cmVjdCBjbGFzcz0nYmFja2dyb3VuZCcgZDMtZGVyPSd7d2lkdGg6IHZtLndpZHRoLCBoZWlnaHQ6IHZtLmhlaWdodH0nIG5nLW1vdXNlbW92ZT0ndm0ubW92ZSgkZXZlbnQpJyAvPlxuXHRcdFx0PGcgdmVyLWF4aXMtZGVyIHdpZHRoPSd2bS53aWR0aCcgc2NhbGU9J3ZtLlZlcicgZnVuPSd2bS52ZXJBeEZ1bic+PC9nPlxuXHRcdFx0PGcgaG9yLWF4aXMtZGVyIGhlaWdodD0ndm0uaGVpZ2h0JyBzY2FsZT0ndm0uSG9yJyBmdW49J3ZtLmhvckF4RnVuJyBzaGlmdGVyPSdbMCx2bS5oZWlnaHRdJz48L2c+XG5cdFx0XHQ8Zm9yZWlnbk9iamVjdCB3aWR0aD0nMzAnIGhlaWdodD0nMzAnIHk9JzIwJyBzaGlmdGVyPSdbdm0ud2lkdGgvMiwgdm0uaGVpZ2h0XSc+XG5cdFx0XHRcdFx0PHRleHQgY2xhc3M9J2xhYmVsJyA+JHQkPC90ZXh0PlxuXHRcdFx0PC9mb3JlaWduT2JqZWN0PlxuXHRcdDwvZz5cblx0XHQ8ZyBjbGFzcz0nbWFpbicgY2xpcC1wYXRoPVwidXJsKCNkZXJ2YXRpdmVCKVwiIHNoaWZ0ZXI9J1t2bS5tYXIubGVmdCwgdm0ubWFyLnRvcF0nPlxuXHRcdFx0PGxpbmUgY2xhc3M9J3plcm8tbGluZSBob3InIGQzLWRlcj0ne3gxOiAwLCB4Mjogdm0ud2lkdGgsIHkxOiB2bS5WZXIoMCksIHkyOiB2bS5WZXIoMCl9Jy8+XG5cdFx0XHQ8cGF0aCBkMy1kZXI9J3tkOnZtLmxpbmVGdW4odm0uZGF0YSl9JyBjbGFzcz0nZnVuIGR2JyAvPlxuXHRcdFx0PGxpbmUgY2xhc3M9J3RyaSBkdicgZDMtZGVyPSd7eDE6IHZtLkhvcih2bS5wb2ludC50KS0xLCB4Mjogdm0uSG9yKHZtLnBvaW50LnQpLTEsIHkxOiB2bS5WZXIoMCksIHkyOiB2bS5WZXIodm0ucG9pbnQuZHYpfScvPlxuXHRcdFx0PGZvcmVpZ25PYmplY3Qgd2lkdGg9JzMwJyBoZWlnaHQ9JzMwJyBzaGlmdGVyPSdbKHZtLkhvcih2bS5wb2ludC50KSAtIDE2KSwgdm0uVmVyKHZtLnBvaW50LmR2Ki41KS02XSc+XG5cdFx0XHRcdFx0PHRleHQgY2xhc3M9J3RyaS1sYWJlbCc+JFxcXFxkb3R7eX0kPC90ZXh0PlxuXHRcdFx0PC9mb3JlaWduT2JqZWN0PlxuXHRcdFx0PGZvcmVpZ25PYmplY3Qgd2lkdGg9JzEwMCcgaGVpZ2h0PSczMCcgc2hpZnRlcj0nW3ZtLkhvciguOSksIHZtLlZlcigxKV0nPlxuXHRcdFx0XHQ8dGV4dCBjbGFzcz0ndHJpLWxhYmVsJz4kXFxcXGNvcyh0KSQ8L3RleHQ+XG5cdFx0XHQ8L2ZvcmVpZ25PYmplY3Q+XG5cdFx0XHQ8Y2lyY2xlIHI9JzRweCcgIHNoaWZ0ZXI9J1t2bS5Ib3Iodm0ucG9pbnQudCksIHZtLlZlcih2bS5wb2ludC5kdildJyBjbGFzcz0ncG9pbnQgZHYnLz5cblx0XHQ8L2c+XG5cdDwvc3ZnPlxuJycnXG5cdFx0XHRcbmNsYXNzIEN0cmxcblx0Y29uc3RydWN0b3I6IChAc2NvcGUsIEBlbCwgQHdpbmRvdyktPlxuXHRcdEBtYXIgPSBcblx0XHRcdGxlZnQ6IDMwXG5cdFx0XHR0b3A6IDIwXG5cdFx0XHRyaWdodDogMjBcblx0XHRcdGJvdHRvbTogNDBcblxuXHRcdEBWZXIgPSBkMy5zY2FsZS5saW5lYXIoKS5kb21haW4gWy0xLjUsMS41XVxuXHRcdEBIb3IgPSBkMy5zY2FsZS5saW5lYXIoKS5kb21haW4gWzAsNl1cblxuXHRcdEBkYXRhID0gRGF0YS5kYXRhXG5cblx0XHRAaG9yQXhGdW4gPSBkMy5zdmcuYXhpcygpXG5cdFx0XHQuc2NhbGUgQEhvclxuXHRcdFx0LnRpY2tzIDVcblx0XHRcdC5vcmllbnQgJ2JvdHRvbSdcblxuXHRcdEB2ZXJBeEZ1biA9IGQzLnN2Zy5heGlzKClcblx0XHRcdC5zY2FsZSBAVmVyXG5cdFx0XHQudGlja0Zvcm1hdCAoZCktPlxuXHRcdFx0XHRpZiBNYXRoLmZsb29yKCBkICkgIT0gZCB0aGVuIHJldHVyblxuXHRcdFx0XHRkXG5cdFx0XHQudGlja3MgNVxuXHRcdFx0Lm9yaWVudCAnbGVmdCdcblxuXHRcdEBsaW5lRnVuID0gZDMuc3ZnLmxpbmUoKVxuXHRcdFx0LnkgKGQpPT4gQFZlciBkLmR2XG5cdFx0XHQueCAoZCk9PiBASG9yIGQudFxuXG5cdFx0YW5ndWxhci5lbGVtZW50IEB3aW5kb3dcblx0XHRcdC5vbiAncmVzaXplJywgQHJlc2l6ZVxuXG5cdFx0QG1vdmUgPSAoZXZlbnQpID0+XG5cdFx0XHR0ID0gQEhvci5pbnZlcnQgZXZlbnQueCAtIGV2ZW50LnRhcmdldC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS5sZWZ0XG5cdFx0XHREYXRhLm1vdmUgdFxuXHRcdFx0QHNjb3BlLiRldmFsQXN5bmMoKVxuXG5cdEBwcm9wZXJ0eSAnc3ZnX2hlaWdodCcsIGdldDogLT4gQGhlaWdodCArIEBtYXIudG9wICsgQG1hci5ib3R0b21cblxuXHRAcHJvcGVydHkgJ3BvaW50JywgZ2V0Oi0+XG5cdFx0RGF0YS5wb2ludFxuXG5cdHJlc2l6ZTogKCk9PlxuXHRcdEB3aWR0aCA9IEBlbFswXS5jbGllbnRXaWR0aCAtIEBtYXIubGVmdCAtIEBtYXIucmlnaHRcblx0XHRAaGVpZ2h0ID0gQGVsWzBdLmNsaWVudEhlaWdodCAtIEBtYXIudG9wIC0gQG1hci5ib3R0b21cblx0XHRAVmVyLnJhbmdlIFtAaGVpZ2h0LCAwXVxuXHRcdEBIb3IucmFuZ2UgWzAsIEB3aWR0aF1cblx0XHRAc2NvcGUuJGV2YWxBc3luYygpXG5cbmRlciA9ICgpLT5cblx0ZGlyZWN0aXZlID0gXG5cdFx0Y29udHJvbGxlckFzOiAndm0nXG5cdFx0c2NvcGU6IHt9XG5cdFx0dGVtcGxhdGU6IHRlbXBsYXRlXG5cdFx0dGVtcGxhdGVOYW1lc3BhY2U6ICdzdmcnXG5cdFx0Y29udHJvbGxlcjogWyckc2NvcGUnLCckZWxlbWVudCcsICckd2luZG93JywgQ3RybF1cblxubW9kdWxlLmV4cG9ydHMgPSBkZXJcbiIsIl8gPSByZXF1aXJlICdsb2Rhc2gnXG52RnVuID0gTWF0aC5zaW5cbmR2RnVuID0gTWF0aC5jb3NcblxuY2xhc3MgRGF0YVxuXHRjb25zdHJ1Y3RvcjogLT5cblx0XHRAZGF0YSA9IF8ucmFuZ2UgMCAsIDggLCAxLzUwXG5cdFx0XHQubWFwICh0KS0+XG5cdFx0XHRcdHJlcyA9IFxuXHRcdFx0XHRcdGR2OiBkdkZ1biB0XG5cdFx0XHRcdFx0djogdkZ1biB0XG5cdFx0XHRcdFx0dDogdFxuXG5cdFx0QHBvaW50ID0gXy5zYW1wbGUgQGRhdGFcblxuXHRtb3ZlOiAodCktPlxuXHRcdEBwb2ludCA9IFxuXHRcdFx0ZHY6IGR2RnVuIHRcblx0XHRcdHY6IHZGdW4gdFxuXHRcdFx0dDogdFxuXG5tb2R1bGUuZXhwb3J0cyA9IG5ldyBEYXRhIiwiYW5ndWxhciA9IHJlcXVpcmUgJ2FuZ3VsYXInXG5kMyA9IHJlcXVpcmUgJ2QzJ1xuRGF0YSA9IHJlcXVpcmUgJy4vZGVzaWduRGF0YSdcbnJlcXVpcmUgJy4uLy4uL2hlbHBlcnMnXG5GYWtlID0gcmVxdWlyZSAnLi9mYWtlQ2FydCdcblJlYWwgPSByZXF1aXJlICcuL3RydWVDYXJ0J1xuXG50ZW1wbGF0ZSA9ICcnJ1xuXHQ8c3ZnIG5nLWluaXQ9J3ZtLnJlc2l6ZSgpJyB3aWR0aD0nMTAwJScgY2xhc3M9J2JvdHRvbUNoYXJ0Jz5cblx0XHQ8ZGVmcz5cblx0XHRcdDxjbGlwcGF0aCBpZD0ncGxvdEEnPlxuXHRcdFx0XHQ8cmVjdCBkMy1kZXI9J3t3aWR0aDogdm0ud2lkdGgsIGhlaWdodDogdm0uaGVpZ2h0fSc+PC9yZWN0PlxuXHRcdFx0PC9jbGlwcGF0aD5cblx0XHQ8L2RlZnM+XG5cdFx0PGcgY2xhc3M9J2JvaWxlcnBsYXRlJyBzaGlmdGVyPSdbdm0ubWFyLmxlZnQsIHZtLm1hci50b3BdJz5cblx0XHRcdDxyZWN0IGNsYXNzPSdiYWNrZ3JvdW5kJyBkMy1kZXI9J3t3aWR0aDogdm0ud2lkdGgsIGhlaWdodDogdm0uaGVpZ2h0fScgYmVoYXZpb3I9J3ZtLmRyYWdfcmVjdCcgLz5cblx0XHRcdDxnIHZlci1heGlzLWRlciB3aWR0aD0ndm0ud2lkdGgnIHNjYWxlPSd2bS5WZXInIGZ1bj0ndm0udmVyQXhGdW4nPjwvZz5cblx0XHRcdDxnIGhvci1heGlzLWRlciBoZWlnaHQ9J3ZtLmhlaWdodCcgc2NhbGU9J3ZtLkhvcicgZnVuPSd2bS5ob3JBeEZ1bicgc2hpZnRlcj0nWzAsdm0uaGVpZ2h0XSc+PC9nPlxuXHRcdFx0PGZvcmVpZ25PYmplY3Qgd2lkdGg9JzMwJyBoZWlnaHQ9JzMwJyBzaGlmdGVyPSdbLTM4LCB2bS5oZWlnaHQvMl0nPlxuXHRcdFx0XHRcdDx0ZXh0IGNsYXNzPSdsYWJlbCc+JHYkPC90ZXh0PlxuXHRcdFx0PC9mb3JlaWduT2JqZWN0PlxuXHRcdFx0PGZvcmVpZ25PYmplY3Qgd2lkdGg9JzMwJyBoZWlnaHQ9JzMwJyB5PScyMCcgc2hpZnRlcj0nW3ZtLndpZHRoLzIsIHZtLmhlaWdodF0nPlxuXHRcdFx0XHRcdDx0ZXh0IGNsYXNzPSdsYWJlbCcgPiR0JDwvdGV4dD5cblx0XHRcdDwvZm9yZWlnbk9iamVjdD5cblx0XHQ8L2c+XG5cdFx0PGcgY2xhc3M9J21haW4nIGNsaXAtcGF0aD1cInVybCgjcGxvdEEpXCIgc2hpZnRlcj0nW3ZtLm1hci5sZWZ0LCB2bS5tYXIudG9wXScgPlxuXHRcdFx0PGxpbmUgY2xhc3M9J3plcm8tbGluZScgZDMtZGVyPSd7eDE6IDAsIHgyOiB2bS53aWR0aCwgeTE6IHZtLlZlcigwKSwgeTI6IHZtLlZlcigwKX0nIC8+XG5cdFx0XHQ8bGluZSBjbGFzcz0nemVyby1saW5lJyBkMy1kZXI9XCJ7eDE6IHZtLkhvcigwKSwgeDI6IHZtLkhvcigwKSwgeTE6IHZtLmhlaWdodCwgeTI6IDB9XCIgLz5cblx0XHRcdDxnIG5nLWNsYXNzPSd7aGlkZTogIXZtLkRhdGEuc2hvd30nID5cblx0XHRcdFx0PGxpbmUgY2xhc3M9J3RyaSB2JyBkMy1kZXI9J3t4MTogdm0uSG9yKHZtLnNlbGVjdGVkLnQpLTEsIHgyOiB2bS5Ib3Iodm0uc2VsZWN0ZWQudCktMSwgeTE6IHZtLlZlcigwKSwgeTI6IHZtLlZlcih2bS5zZWxlY3RlZC52KX0nLz5cblx0XHRcdFx0PHBhdGggbmctYXR0ci1kPSd7e3ZtLnRyaWFuZ2xlRGF0YSgpfX0nIGNsYXNzPSd0cmknIC8+XG5cdFx0XHRcdDxsaW5lIGQzLWRlcj0ne3gxOiB2bS5Ib3Iodm0uc2VsZWN0ZWQudCkrMSwgeDI6IHZtLkhvcih2bS5zZWxlY3RlZC50KSsxLCB5MTogdm0uVmVyKHZtLnNlbGVjdGVkLnYpLCB5Mjogdm0uVmVyKHZtLnNlbGVjdGVkLnYgKyB2bS5zZWxlY3RlZC5kdil9JyBjbGFzcz0ndHJpIGR2JyAvPlxuXHRcdFx0PC9nPlxuXHRcdFx0PHBhdGggbmctYXR0ci1kPSd7e3ZtLmxpbmVGdW4odm0uRGF0YS5DYXJ0LnRyYWplY3RvcnkpfX0nIGNsYXNzPSdmdW4gdGFyZ2V0JyAvPlxuXHRcdFx0PHBhdGggbmctYXR0ci1kPSd7e3ZtLmxpbmVGdW4odm0uRGF0YS5kb3RzKX19JyBjbGFzcz0nZnVuIHYnIC8+XG5cdFx0XHQ8ZyBuZy1yZXBlYXQ9J2RvdCBpbiB2bS5kb3RzIHRyYWNrIGJ5IGRvdC5pZCcgZGF0dW09ZG90IHNoaWZ0ZXI9J1t2bS5Ib3IoZG90LnQpLHZtLlZlcihkb3QudildJyBiZWhhdmlvcj0ndm0uZHJhZycgZG90LWEtZGVyPWRvdCA+PC9nPlxuXHRcdFx0PGNpcmNsZSBjbGFzcz0nZG90IHNtYWxsJyByPSc0JyBzaGlmdGVyPSdbdm0uSG9yKHZtLkRhdGEuZmlyc3QudCksdm0uVmVyKHZtLkRhdGEuZmlyc3QudildJyAvPlxuXHRcdFx0PGZvcmVpZ25PYmplY3Qgd2lkdGg9JzcwJyBoZWlnaHQ9JzMwJyBzaGlmdGVyPSdbdm0uSG9yKDQpLCB2bS5WZXIoLjMzKV0nPlxuXHRcdFx0XHRcdDx0ZXh0IGNsYXNzPSd0cmktbGFiZWwnID4kMmVeey0uOHR9JDwvdGV4dD5cblx0XHRcdDwvZm9yZWlnbk9iamVjdD5cblx0XHRcdDxjaXJjbGUgcj0nNHB4JyAgc2hpZnRlcj0nW3ZtLkhvcih2bS5EYXRhLnQpLCB2bS5WZXIodm0uRmFrZS52KV0nIGNsYXNzPSdwb2ludCBmYWtlJy8+XG5cdFx0XHQ8Y2lyY2xlIHI9JzRweCcgIHNoaWZ0ZXI9J1t2bS5Ib3Iodm0uRGF0YS50KSwgdm0uVmVyKHZtLlJlYWwudildJyBjbGFzcz0ncG9pbnQgcmVhbCcvPlxuXHRcdDwvZz5cblx0PC9zdmc+XG4nJydcblxuY2xhc3MgQ3RybFxuXHRjb25zdHJ1Y3RvcjogKEBzY29wZSwgQGVsLCBAd2luZG93KS0+XG5cdFx0QG1hciA9IFxuXHRcdFx0bGVmdDogMzhcblx0XHRcdHRvcDogMFxuXHRcdFx0cmlnaHQ6IDEwXG5cdFx0XHRib3R0b206IDM3XG5cblx0XHRAVmVyID0gZDMuc2NhbGUubGluZWFyKCkuZG9tYWluIFstLjEsMi4xXVxuXG5cdFx0QEhvciA9IGQzLnNjYWxlLmxpbmVhcigpLmRvbWFpbiBbLS4xLDVdXG5cblx0XHRARGF0YSA9IERhdGFcblxuXHRcdEBGYWtlID0gRmFrZVxuXHRcdEBSZWFsID0gUmVhbFxuXG5cdFx0QGhvckF4RnVuID0gZDMuc3ZnLmF4aXMoKVxuXHRcdFx0LnNjYWxlIEBIb3Jcblx0XHRcdC50aWNrcyA1XG5cdFx0XHQub3JpZW50ICdib3R0b20nXG5cblx0XHRAdmVyQXhGdW4gPSBkMy5zdmcuYXhpcygpXG5cdFx0XHQuc2NhbGUgQFZlclxuXHRcdFx0LnRpY2tzIDVcblx0XHRcdC5vcmllbnQgJ2xlZnQnXG5cdFx0XG5cdFx0QGxpbmVGdW4gPSBkMy5zdmcubGluZSgpXG5cdFx0XHQueSAoZCk9PiBAVmVyIGQudlxuXHRcdFx0LnggKGQpPT4gQEhvciBkLnRcblxuXHRcdEBkcmFnX3JlY3QgPSBkMy5iZWhhdmlvci5kcmFnKClcblx0XHRcdC5vbiAnZHJhZ3N0YXJ0JywgKCk9PlxuXHRcdFx0XHRkMy5ldmVudC5zb3VyY2VFdmVudC5zdG9wUHJvcGFnYXRpb24oKVxuXHRcdFx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpXG5cdFx0XHRcdGlmIGV2ZW50LndoaWNoID09IDNcblx0XHRcdFx0XHRyZXR1cm4gXG5cdFx0XHRcdERhdGEuc2V0X3Nob3cgdHJ1ZVxuXHRcdFx0XHRyZWN0ID0gZXZlbnQudG9FbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpXG5cdFx0XHRcdHQgPSBASG9yLmludmVydCBldmVudC54IC0gcmVjdC5sZWZ0XG5cdFx0XHRcdHYgID0gQFZlci5pbnZlcnQgZXZlbnQueSAtIHJlY3QudG9wXG5cdFx0XHRcdERhdGEuYWRkX2RvdCB0ICwgdlxuXHRcdFx0XHRAc2NvcGUuJGV2YWxBc3luYygpXG5cdFx0XHQub24gJ2RyYWcnLCA9PiBAb25fZHJhZyBAc2VsZWN0ZWRcblx0XHRcdC5vbiAnZHJhZ2VuZCcsPT5cblx0XHRcdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKVxuXHRcdFx0XHREYXRhLnNldF9zaG93IHRydWVcblx0XHRcdFx0ZXZlbnQuc3RvcFByb3BhZ2F0aW9uKClcblxuXHRcdEBkcmFnID0gZDMuYmVoYXZpb3IuZHJhZygpXG5cdFx0XHQub24gJ2RyYWdzdGFydCcsIChkb3QpPT5cblx0XHRcdFx0ZDMuZXZlbnQuc291cmNlRXZlbnQuc3RvcFByb3BhZ2F0aW9uKClcblx0XHRcdFx0aWYgZXZlbnQud2hpY2ggPT0gM1xuXHRcdFx0XHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KClcblx0XHRcdFx0XHREYXRhLnJlbW92ZV9kb3QgZG90XG5cdFx0XHRcdFx0RGF0YS5zZXRfc2hvdyBmYWxzZVxuXHRcdFx0XHRcdEBzY29wZS4kZXZhbEFzeW5jKClcblx0XHRcdC5vbiAnZHJhZycsIEBvbl9kcmFnXG5cblxuXG5cdFx0YW5ndWxhci5lbGVtZW50IEB3aW5kb3dcblx0XHRcdC5vbiAncmVzaXplJywgQHJlc2l6ZVxuXG5cdEBwcm9wZXJ0eSAnZG90cycsIGdldDotPiBcblx0XHREYXRhLmRvdHMuZmlsdGVyIChkKS0+IChkLmlkICE9J2ZpcnN0JykgYW5kIChkLmlkICE9J2xhc3QnKVxuXG5cdEBwcm9wZXJ0eSAnc2VsZWN0ZWQnLCBnZXQ6LT5cblx0XHREYXRhLnNlbGVjdGVkXG5cblx0b25fZHJhZzogKGRvdCk9PiBcblx0XHRcdCMgaWYgZXZlbnQud2hpY2ggaXMgM1xuXHRcdFx0IyBcdGV2ZW50LnByZXZlbnREZWZhdWx0KClcblx0XHRcdCMgXHRyZXR1cm5cblx0XHRcdERhdGEudXBkYXRlX2RvdCBkb3QsIEBIb3IuaW52ZXJ0KGQzLmV2ZW50LngpLCBAVmVyLmludmVydChkMy5ldmVudC55KVxuXHRcdFx0QHNjb3BlLiRldmFsQXN5bmMoKVxuXG5cdHRyaWFuZ2xlRGF0YTotPlxuXHRcdHBvaW50ID0gQHNlbGVjdGVkXG5cdFx0QGxpbmVGdW4gW3t2OiBwb2ludC52LCB0OiBwb2ludC50fSwge3Y6cG9pbnQuZHYgKyBwb2ludC52LCB0OiBwb2ludC50KzF9LCB7djogcG9pbnQuZHYgKyBwb2ludC52LCB0OiBwb2ludC50fV1cblxuXHRyZXNpemU6ICgpPT5cblx0XHRAd2lkdGggPSBAZWxbMF0uY2xpZW50V2lkdGggLSBAbWFyLmxlZnQgLSBAbWFyLnJpZ2h0XG5cdFx0QGhlaWdodCA9IEBlbFswXS5jbGllbnRIZWlnaHQgLSBAbWFyLnRvcCAtIEBtYXIuYm90dG9tXG5cdFx0QFZlci5yYW5nZSBbQGhlaWdodCwgMF1cblx0XHRASG9yLnJhbmdlIFswLCBAd2lkdGhdXG5cdFx0QHNjb3BlLiRldmFsQXN5bmMoKVxuXG5kZXIgPSAoKS0+XG5cdGRpcmVjdGl2ZSA9IFxuXHRcdGNvbnRyb2xsZXJBczogJ3ZtJ1xuXHRcdHNjb3BlOiB7fVxuXHRcdHRlbXBsYXRlOiB0ZW1wbGF0ZVxuXHRcdHRlbXBsYXRlTmFtZXNwYWNlOiAnc3ZnJ1xuXHRcdGNvbnRyb2xsZXI6IFsnJHNjb3BlJywnJGVsZW1lbnQnLCAnJHdpbmRvdycsIEN0cmxdXG5cbm1vZHVsZS5leHBvcnRzID0gZGVyXG4iLCJEYXRhID0gcmVxdWlyZSAnLi9kZXNpZ25EYXRhJ1xuYW5ndWxhciA9IHJlcXVpcmUgJ2FuZ3VsYXInXG5kMyA9IHJlcXVpcmUgJ2QzJ1xucmVxdWlyZSAnLi4vLi4vaGVscGVycydcblxudGVtcGxhdGUgPSAnJydcblx0PHN2ZyBuZy1pbml0PSd2bS5yZXNpemUoKScgIHdpZHRoPScxMDAlJyBjbGFzcz0nYm90dG9tQ2hhcnQnPlxuXHRcdDxkZWZzPlxuXHRcdFx0PGNsaXBwYXRoIGlkPSdwbG90Qic+XG5cdFx0XHRcdDxyZWN0IGQzLWRlcj0ne3dpZHRoOiB2bS53aWR0aCwgaGVpZ2h0OiB2bS5oZWlnaHR9JyAvPlxuXHRcdFx0PC9jbGlwcGF0aD5cblx0XHQ8L2RlZnM+XG5cdFx0PGcgY2xhc3M9J2JvaWxlcnBsYXRlJyBzaGlmdGVyPSdbdm0ubWFyLmxlZnQsIHZtLm1hci50b3BdJz5cblx0XHRcdDxyZWN0IGNsYXNzPSdiYWNrZ3JvdW5kJyBkMy1kZXI9J3t3aWR0aDogdm0ud2lkdGgsIGhlaWdodDogdm0uaGVpZ2h0fScgLz5cblx0XHRcdDxnIHZlci1heGlzLWRlciB3aWR0aD0ndm0ud2lkdGgnIHNjYWxlPSd2bS5WZXInIGZ1bj0ndm0udmVyQXhGdW4nPjwvZz5cblx0XHRcdDxnIGhvci1heGlzLWRlciBoZWlnaHQ9J3ZtLmhlaWdodCcgc2NhbGU9J3ZtLlYnIGZ1bj0ndm0uaG9yQXhGdW4nIHNoaWZ0ZXI9J1swLHZtLmhlaWdodF0nPjwvZz5cblx0XHRcdDxmb3JlaWduT2JqZWN0IHdpZHRoPSczMCcgaGVpZ2h0PSczMCcgc2hpZnRlcj0nWy0zOCwgdm0uaGVpZ2h0LzJdJz5cblx0XHRcdFx0XHQ8dGV4dCBjbGFzcz0nbGFiZWwnPiRcXFxcZG90e3Z9JDwvdGV4dD5cblx0XHRcdDwvZm9yZWlnbk9iamVjdD5cblx0XHRcdDxmb3JlaWduT2JqZWN0IHdpZHRoPSczMCcgaGVpZ2h0PSczMCcgeT0nMjAnIHNoaWZ0ZXI9J1t2bS53aWR0aC8yLCB2bS5oZWlnaHRdJz5cblx0XHRcdFx0XHQ8dGV4dCBjbGFzcz0nbGFiZWwnID4kdiQ8L3RleHQ+XG5cdFx0XHQ8L2ZvcmVpZ25PYmplY3Q+XG5cdFx0PC9nPlxuXHRcdDxnIGNsYXNzPSdtYWluJyBjbGlwLXBhdGg9XCJ1cmwoI3Bsb3RCKVwiIHNoaWZ0ZXI9J1t2bS5tYXIubGVmdCwgdm0ubWFyLnRvcF0nPlxuXHRcdFx0PGxpbmUgY2xhc3M9J3plcm8tbGluZScgZDMtZGVyPSd7eDE6IDAsIHgyOiB2bS53aWR0aCwgeTE6IHZtLlZlcigwKSwgeTI6IHZtLlZlcigwKX0nIC8+XG5cdFx0XHQ8bGluZSBjbGFzcz0nemVyby1saW5lJyBkMy1kZXI9XCJ7eDE6IHZtLkhvcigwKSwgeDI6IHZtLkhvcigwKSwgeTE6IHZtLmhlaWdodCwgeTI6IDB9XCIgLz5cblx0XHRcdDxwYXRoIG5nLWF0dHItZD0ne3t2bS5saW5lRnVuKHZtLkRhdGEudGFyZ2V0X2RhdGEpfX0nIGNsYXNzPSdmdW4gdGFyZ2V0JyAvPlxuXHRcdFx0PGcgbmctY2xhc3M9J3toaWRlOiAhdm0uRGF0YS5zaG93fScgPlxuXHRcdFx0XHQ8bGluZSBjbGFzcz0ndHJpIHYnIGQzLWRlcj0ne3gxOiB2bS5Ib3IoMCksIHgyOiB2bS5Ib3Iodm0uc2VsZWN0ZWQudiksIHkxOiB2bS5WZXIodm0uc2VsZWN0ZWQuZHYpLCB5Mjogdm0uVmVyKHZtLnNlbGVjdGVkLmR2KX0nLz5cblx0XHRcdFx0PGxpbmUgY2xhc3M9J3RyaSBkdicgZDMtZGVyPSd7eDE6IHZtLkhvcih2bS5zZWxlY3RlZC52KSwgeDI6IHZtLkhvcih2bS5zZWxlY3RlZC52KSwgeTE6IHZtLlZlcigwKSwgeTI6IHZtLlZlcih2bS5zZWxlY3RlZC5kdil9Jy8+XG5cdFx0XHRcdDxwYXRoIGQzLWRlcj0ne2Q6dm0ubGluZUZ1bih2bS5EYXRhLnRhcmdldF9kYXRhKX0nIGNsYXNzPSdmdW4gY29ycmVjdCcgbmctY2xhc3M9J3toaWRlOiAhdm0uRGF0YS5jb3JyZWN0fScgLz5cblx0XHRcdDwvZz5cblx0XHRcdDxnIG5nLXJlcGVhdD0nZG90IGluIHZtLmRvdHMgdHJhY2sgYnkgZG90LmlkJyBzaGlmdGVyPSdbdm0uSG9yKGRvdC52KSx2bS5WZXIoZG90LmR2KV0nIGRvdC1iLWRlcj1kb3Q+PC9nPlxuXHRcdFx0PGZvcmVpZ25PYmplY3Qgd2lkdGg9JzcwJyBoZWlnaHQ9JzMwJyB5PScwJyBzaGlmdGVyPSdbdm0uSG9yKDEuNyksIHZtLlZlcigtMS4yKV0nPlxuXHRcdFx0XHRcdDx0ZXh0IGNsYXNzPSd0cmktbGFiZWwnID4kdic9LS44diQ8L3RleHQ+XG5cdFx0XHQ8L2ZvcmVpZ25PYmplY3Q+XG5cdFx0PC9nPlxuXHQ8L3N2Zz5cbicnJ1xuXG5jbGFzcyBDdHJsXG5cdGNvbnN0cnVjdG9yOiAoQHNjb3BlLCBAZWwsIEB3aW5kb3cpLT5cblx0XHRAbWFyID0gXG5cdFx0XHRsZWZ0OiA0MFxuXHRcdFx0dG9wOiAwXG5cdFx0XHRyaWdodDogMTBcblx0XHRcdGJvdHRvbTogMzdcblxuXHRcdEBWZXIgPSBkMy5zY2FsZS5saW5lYXIoKS5kb21haW4gWy0xLjksIC4xXVxuXG5cdFx0QEhvciA9IGQzLnNjYWxlLmxpbmVhcigpLmRvbWFpbiBbLS4xLDIuMTVdXG5cblx0XHRAaG9yQXhGdW4gPSBkMy5zdmcuYXhpcygpXG5cdFx0XHQuc2NhbGUgQEhvclxuXHRcdFx0LnRpY2tzIDVcblx0XHRcdC5vcmllbnQgJ2JvdHRvbSdcblxuXHRcdEB2ZXJBeEZ1biA9IGQzLnN2Zy5heGlzKClcblx0XHRcdC5zY2FsZSBAVmVyXG5cdFx0XHQudGlja3MgNVxuXHRcdFx0Lm9yaWVudCAnbGVmdCdcblxuXHRcdEBEYXRhID0gRGF0YVxuXG5cdFx0QGxpbmVGdW4gPSBkMy5zdmcubGluZSgpXG5cdFx0XHQueSAoZCk9PiBAVmVyIGQuZHZcblx0XHRcdC54IChkKT0+IEBIb3IgZC52XG5cblx0XHRhbmd1bGFyLmVsZW1lbnQgQHdpbmRvd1xuXHRcdFx0Lm9uICdyZXNpemUnLCBAcmVzaXplXG5cblx0QHByb3BlcnR5ICdkb3RzJywgZ2V0Oi0+XG5cdFx0RGF0YS5kb3RzXG5cdFx0XHQuZmlsdGVyIChkKS0+IChkLmlkICE9J2ZpcnN0JykgYW5kIChkLmlkICE9J2xhc3QnKVxuXG5cdEBwcm9wZXJ0eSAnc2VsZWN0ZWQnLCBnZXQ6LT5cblx0XHREYXRhLnNlbGVjdGVkXG5cdFx0XG5cdHJlc2l6ZTogKCk9PlxuXHRcdEB3aWR0aCA9IEBlbFswXS5jbGllbnRXaWR0aCAtIEBtYXIubGVmdCAtIEBtYXIucmlnaHRcblx0XHRAaGVpZ2h0ID0gQGVsWzBdLmNsaWVudEhlaWdodCAtIEBtYXIudG9wIC0gQG1hci5ib3R0b21cblx0XHRAVmVyLnJhbmdlIFtAaGVpZ2h0LCAwXVxuXHRcdEBIb3IucmFuZ2UgWzAsIEB3aWR0aF0gXG5cdFx0QHNjb3BlLiRldmFsQXN5bmMoKVxuXG5cbmRlciA9ICgpLT5cblx0ZGlyZWN0aXZlID0gXG5cdFx0Y29udHJvbGxlckFzOiAndm0nXG5cdFx0c2NvcGU6IHt9XG5cdFx0dGVtcGxhdGU6IHRlbXBsYXRlXG5cdFx0dGVtcGxhdGVOYW1lc3BhY2U6ICdzdmcnXG5cdFx0Y29udHJvbGxlcjogWyckc2NvcGUnLCckZWxlbWVudCcsJyR3aW5kb3cnLCBDdHJsXVxuXG5tb2R1bGUuZXhwb3J0cyA9IGRlclxuIiwiYW5ndWxhciA9IHJlcXVpcmUgJ2FuZ3VsYXInXG5kMyA9IHJlcXVpcmUgJ2QzJ1xuRGF0YSA9IHJlcXVpcmUgJy4vZGVzaWduRGF0YSdcbnJlcXVpcmUgJy4uLy4uL2hlbHBlcnMnXG50ZW1wbGF0ZSA9ICcnJ1xuXHQ8bWQtYnV0dG9uIGNsYXNzPSdteUJ1dHRvbicgbmctY2xpY2s9J3ZtLmNsaWNrKCknIG5nLWluaXQ9J3ZtLnBsYXkoKSc+e3t2bS5wYXVzZWQgPyAnUExBWScgOiAnUEFVU0UnfX08L21kLWJ1dHRvbj5cbicnJ1xuXG5jbGFzcyBDdHJsXG5cdGNvbnN0cnVjdG9yOiAoQHNjb3BlKS0+XG5cblx0Y2xpY2s6IC0+XG5cdFx0aWYgQHBhdXNlZCB0aGVuIEBwbGF5KCkgZWxzZSBAcGF1c2UoKVxuXG5cdHBsYXk6IC0+XG5cdFx0QHBhdXNlZCA9IHRydWVcblx0XHRkMy50aW1lci5mbHVzaCgpXG5cdFx0QHBhdXNlZCA9IGZhbHNlXG5cdFx0bGFzdCA9IDBcblx0XHRkMy50aW1lciAoZWxhcHNlZCk9PlxuXHRcdFx0XHRkdCA9IGVsYXBzZWQgLSBsYXN0XG5cdFx0XHRcdERhdGEuaW5jcmVtZW50IGR0LzEwMDBcblx0XHRcdFx0bGFzdCA9IGVsYXBzZWRcblx0XHRcdFx0aWYgRGF0YS50ID4gNC41XG5cdFx0XHRcdFx0RGF0YS5zZXRfdCAwXG5cdFx0XHRcdEBzY29wZS4kZXZhbEFzeW5jKClcblx0XHRcdFx0QHBhdXNlZFxuXHRcdFx0LCAxXG5cblx0cGF1c2U6IC0+IEBwYXVzZWQgPSB0cnVlXG5cbmRlciA9ICgpLT5cblx0ZGlyZWN0aXZlID0gXG5cdFx0Y29udHJvbGxlckFzOiAndm0nXG5cdFx0c2NvcGU6IHt9XG5cdFx0dGVtcGxhdGU6IHRlbXBsYXRlXG5cdFx0dGVtcGxhdGVOYW1lc3BhY2U6ICdzdmcnXG5cdFx0Y29udHJvbGxlcjogWyckc2NvcGUnLCBDdHJsXVxuXG5tb2R1bGUuZXhwb3J0cyA9IGRlciIsIl8gPSByZXF1aXJlICdsb2Rhc2gnXG5kMz0gcmVxdWlyZSAnZDMnXG57bWlufSA9IE1hdGhcbnJlcXVpcmUgJy4uLy4uL2hlbHBlcnMnXG5DYXJ0ID0gcmVxdWlyZSAnLi9mYWtlQ2FydCdcblxudGVtcGxhdGUgPSAnJydcblx0PHN2ZyBuZy1pbml0PSd2bS5yZXNpemUoKScgd2lkdGg9JzEwMCUnIGNsYXNzPSdjYXJ0Q2hhcnQnIG5nLWF0dHItaGVpZ2h0PSd7ezo6dm0uc3ZnSGVpZ2h0fX0nPlxuXHRcdDxkZWZzPlxuXHRcdFx0PGNsaXBwYXRoIGlkPSdkQ2FydEEnPlxuXHRcdFx0XHQ8cmVjdCBkMy1kZXI9J3t3aWR0aDogdm0ud2lkdGgsIGhlaWdodDogdm0uaGVpZ2h0fScgLz5cblx0XHRcdDwvY2xpcHBhdGg+XG5cdFx0PC9kZWZzPlxuXHRcdDxnIHNoaWZ0ZXI9J3t7Ojpbdm0ubWFyLmxlZnQsIHZtLm1hci50b3BdfX0nICBjbGlwLXBhdGg9XCJ1cmwoI2RDYXJ0QSlcIiA+XG5cdFx0XHQ8cmVjdCBkMy1kZXI9J3t3aWR0aDogdm0ud2lkdGgsIGhlaWdodDogdm0uaGVpZ2h0fScgY2xhc3M9J2JhY2tncm91bmQnLz5cblx0XHRcdDxnIGhvci1heGlzLWRlciBoZWlnaHQ9J3ZtLmhlaWdodCcgc2NhbGU9J3ZtLlgnIGZ1bj0ndm0uYXhpc0Z1bicgc2hpZnRlcj0nWzAsdm0uaGVpZ2h0XSc+PC9nPlxuXHRcdFx0PGcgY2xhc3M9J2ctY2FydCcgbmctcmVwZWF0PSd0IGluIHZtLnNhbXBsZScgZDMtZGVyPSd7dHJhbnNmb3JtOiBcInRyYW5zbGF0ZShcIiArIHZtLlgodm0uQ2FydC5sb2ModCkpICsgXCIsMClcIn0nIHN0eWxlPSdvcGFjaXR5Oi4zOyc+XG5cdFx0XHRcdDxsaW5lIGNsYXNzPSd0aW1lLWxpbmUnIGQzLWRlcj0ne3gxOiAwLCB4MjogMCwgeTE6IDAsIHkyOiA2MH0nIC8+XG5cdFx0XHQ8L2c+XG5cdFx0XHQ8ZyBjbGFzcz0nZy1jYXJ0JyBjYXJ0LW9iamVjdC1kZXIgbGVmdD0ndm0uWCh2bS5DYXJ0LngpJyB0cmFuc2Zvcm09J3RyYW5zbGF0ZSgwLDI1KSc+PC9nPlxuXHRcdDwvZz5cblx0PC9zdmc+XG4nJydcblxuY2xhc3MgQ3RybFxuXHRjb25zdHJ1Y3RvcjogKEBzY29wZSwgQGVsLCBAd2luZG93KS0+XG5cdFx0QG1hciA9IFxuXHRcdFx0bGVmdDogMTBcblx0XHRcdHJpZ2h0OiAxMFxuXHRcdFx0dG9wOiAwXG5cdFx0XHRib3R0b206IDBcblx0XHRcdFxuXHRcdEBYID0gZDMuc2NhbGUubGluZWFyKCkuZG9tYWluIFstLjEsM10gXG5cblx0XHRAc2FtcGxlID0gXy5yYW5nZSggMCwgNiAsIC41KVxuXHRcdGNvbnNvbGUubG9nIEBzYW1wbGVcblxuXHRcdEBDYXJ0ID0gQ2FydFxuXG5cdFx0QGF4aXNGdW4gPSBkMy5zdmcuYXhpcygpXG5cdFx0XHQuc2NhbGUgQFhcblx0XHRcdC50aWNrcyA1XG5cdFx0XHQub3JpZW50ICdib3R0b20nXG5cblx0XHRAdHJhbiA9ICh0cmFuKS0+XG5cdFx0XHR0cmFuLmVhc2UgJ2xpbmVhcidcblx0XHRcdFx0LmR1cmF0aW9uIDYwXG5cblx0XHRhbmd1bGFyLmVsZW1lbnQgQHdpbmRvd1xuXHRcdFx0Lm9uICdyZXNpemUnICwgQHJlc2l6ZVxuXG5cdEBwcm9wZXJ0eSAnc3ZnSGVpZ2h0JyAsIGdldDotPiBAaGVpZ2h0ICsgQG1hci50b3AgKyBAbWFyLmJvdHRvbVxuXG5cdHJlc2l6ZTogKCk9PlxuXHRcdEB3aWR0aCA9IEBlbFswXS5jbGllbnRXaWR0aCAtIEBtYXIubGVmdCAtIEBtYXIucmlnaHRcblx0XHRAaGVpZ2h0ID0gNjBcblx0XHRAWC5yYW5nZSBbMCwgQHdpZHRoXVxuXHRcdEBzY29wZS4kZXZhbEFzeW5jKClcblxuZGVyID0gKCktPlxuXHRkaXJlY3RpdmUgPSBcblx0XHR0ZW1wbGF0ZTogdGVtcGxhdGVcblx0XHRzY29wZToge31cblx0XHRyZXN0cmljdDogJ0EnXG5cdFx0YmluZFRvQ29udHJvbGxlcjogdHJ1ZVxuXHRcdHRlbXBsYXRlTmFtZXNwYWNlOiAnc3ZnJ1xuXHRcdGNvbnRyb2xsZXI6IFsnJHNjb3BlJywgJyRlbGVtZW50JywgJyR3aW5kb3cnLCBDdHJsXVxuXHRcdGNvbnRyb2xsZXJBczogJ3ZtJ1xuXG5tb2R1bGUuZXhwb3J0cyA9IGRlclxuIiwiXyA9IHJlcXVpcmUgJ2xvZGFzaCdcbmQzPSByZXF1aXJlICdkMydcbnttaW59ID0gTWF0aFxucmVxdWlyZSAnLi4vLi4vaGVscGVycydcbkNhcnQgPSByZXF1aXJlICcuL3RydWVDYXJ0J1xuXG50ZW1wbGF0ZSA9ICcnJ1xuXHQ8c3ZnIG5nLWluaXQ9J3ZtLnJlc2l6ZSgpJyB3aWR0aD0nMTAwJScgY2xhc3M9J2NhcnRDaGFydCcgbmctYXR0ci1oZWlnaHQ9J3t7Ojp2bS5zdmdIZWlnaHR9fSc+XG5cdFx0PGRlZnM+XG5cdFx0XHQ8Y2xpcHBhdGggaWQ9J2RDYXJ0Qic+XG5cdFx0XHRcdDxyZWN0IGQzLWRlcj0ne3dpZHRoOiB2bS53aWR0aCwgaGVpZ2h0OiB2bS5oZWlnaHR9JyAvPlxuXHRcdFx0PC9jbGlwcGF0aD5cblx0XHQ8L2RlZnM+XG5cdFx0PGcgY2xhc3M9J2JvaWxlcnBsYXRlJyBzaGlmdGVyPSd7ezo6W3ZtLm1hci5sZWZ0LCB2bS5tYXIudG9wXX19JyA+XG5cdFx0XHQ8cmVjdCBkMy1kZXI9J3t3aWR0aDogdm0ud2lkdGgsIGhlaWdodDogdm0uaGVpZ2h0fScgY2xhc3M9J2JhY2tncm91bmQnLz5cblx0XHRcdDxnIGhvci1heGlzLWRlciBoZWlnaHQ9J3ZtLmhlaWdodCcgc2NhbGU9J3ZtLlgnIGZ1bj0ndm0uYXhpc0Z1bicgc2hpZnRlcj0nWzAsdm0uaGVpZ2h0XSc+PC9nPlxuXHRcdFx0PGZvcmVpZ25PYmplY3Qgd2lkdGg9JzMwJyBoZWlnaHQ9JzMwJyB5PScyMCcgc2hpZnRlcj0nW3ZtLndpZHRoLzIsIHZtLmhlaWdodF0nPlxuXHRcdFx0XHRcdDx0ZXh0IGNsYXNzPSdsYWJlbCcgPiR4JDwvdGV4dD5cblx0XHRcdDwvZm9yZWlnbk9iamVjdD5cblx0XHQ8L2c+XG5cdFx0PGcgc2hpZnRlcj0ne3s6Olt2bS5tYXIubGVmdCwgdm0ubWFyLnRvcF19fScgY2xpcC1wYXRoPVwidXJsKCNkQ2FydEIpXCI+XG5cdFx0XHQ8ZyBjbGFzcz0nZy1jYXJ0JyBuZy1yZXBlYXQ9J3QgaW4gdm0uc2FtcGxlJyBkMy1kZXI9J3t0cmFuc2Zvcm06IFwidHJhbnNsYXRlKFwiICsgdm0uWCh2bS5DYXJ0LmxvYyh0KSkgKyBcIiwwKVwifScgc3R5bGU9J29wYWNpdHk6LjM7Jz5cblx0XHRcdFx0PGxpbmUgY2xhc3M9J3RpbWUtbGluZScgZDMtZGVyPSd7eDE6IDAsIHgyOiAwLCB5MTogMCwgeTI6IDYwfScgLz5cblx0XHRcdDwvZz5cblx0XHRcdDxnIGNsYXNzPSdnLWNhcnQnIGNhcnQtb2JqZWN0LWRlciBsZWZ0PSd2bS5YKHZtLkNhcnQueCknIHRyYW5zZm9ybT0ndHJhbnNsYXRlKDAsMjUpJz48L2c+XG5cdFx0PC9nPlxuXHQ8L3N2Zz5cbicnJ1xuXG5jbGFzcyBDdHJsXG5cdGNvbnN0cnVjdG9yOiAoQHNjb3BlLCBAZWwsIEB3aW5kb3cpLT5cblx0XHRAbWFyID0gXG5cdFx0XHRsZWZ0OiAxMFxuXHRcdFx0cmlnaHQ6IDEwXG5cdFx0XHR0b3A6IDEwXG5cdFx0XHRib3R0b206IDIwXG5cdFx0XHRcblx0XHRAWCA9IGQzLnNjYWxlLmxpbmVhcigpLmRvbWFpbiBbLS4xLDNdIFxuXG5cdFx0QHNhbXBsZSA9IF8ucmFuZ2UoIDAsIDUgLCAuNSlcblxuXHRcdEBDYXJ0ID0gQ2FydFxuXG5cdFx0QGF4aXNGdW4gPSBkMy5zdmcuYXhpcygpXG5cdFx0XHQuc2NhbGUgQFhcblx0XHRcdC50aWNrcyA1XG5cdFx0XHQub3JpZW50ICdib3R0b20nXG5cblx0XHRAdHJhbiA9ICh0cmFuKS0+XG5cdFx0XHR0cmFuLmVhc2UgJ2xpbmVhcidcblx0XHRcdFx0LmR1cmF0aW9uIDMwXG5cblx0XHRhbmd1bGFyLmVsZW1lbnQgQHdpbmRvd1xuXHRcdFx0Lm9uICdyZXNpemUnICwgQHJlc2l6ZVxuXG5cdHJlc2l6ZTogKCk9PlxuXHRcdEB3aWR0aCA9IEBlbFswXS5jbGllbnRXaWR0aCAtIEBtYXIubGVmdCAtIEBtYXIucmlnaHRcblx0XHRAaGVpZ2h0ID0gNjBcblx0XHRAWC5yYW5nZSBbMCwgQHdpZHRoXVxuXHRcdEBzY29wZS4kZXZhbEFzeW5jKClcblxuXHRAcHJvcGVydHkgJ3N2Z0hlaWdodCcsIGdldDotPiBAaGVpZ2h0ICsgQG1hci50b3ArQG1hci5ib3R0b21cblxuZGVyID0gKCktPlxuXHRkaXJlY3RpdmUgPSBcblx0XHR0ZW1wbGF0ZTogdGVtcGxhdGVcblx0XHRzY29wZToge31cblx0XHRyZXN0cmljdDogJ0EnXG5cdFx0YmluZFRvQ29udHJvbGxlcjogdHJ1ZVxuXHRcdHRlbXBsYXRlTmFtZXNwYWNlOiAnc3ZnJ1xuXHRcdGNvbnRyb2xsZXI6IFsnJHNjb3BlJywgJyRlbGVtZW50JywgJyR3aW5kb3cnLCBDdHJsXVxuXHRcdGNvbnRyb2xsZXJBczogJ3ZtJ1xuXG5tb2R1bGUuZXhwb3J0cyA9IGRlclxuIiwiXyA9IHJlcXVpcmUgJ2xvZGFzaCdcbnJlcXVpcmUgJy4uLy4uL2hlbHBlcnMnXG5DYXJ0ID0gcmVxdWlyZSAnLi4vY2FydC9jYXJ0RGF0YSdcbmQzID0gcmVxdWlyZSAnZDMnXG5cbmNsYXNzIERvdFxuXHRjb25zdHJ1Y3RvcjogKEB0LCBAdiktPlxuXHRcdEBpZCA9IF8udW5pcXVlSWQgJ2RvdCdcblxuY2xhc3MgRGF0YVxuXHRjb25zdHJ1Y3RvcjogLT5cblx0XHRAdCA9IEB4ID0gMFxuXHRcdEBDYXJ0ID0gQ2FydFxuXHRcdGZpcnN0RG90ID0gbmV3IERvdCAwICwgQ2FydC52MFxuXHRcdGZpcnN0RG90LmlkID0gJ2ZpcnN0J1xuXHRcdG1pZERvdCA9IG5ldyBEb3QgQ2FydC50cmFqZWN0b3J5WzEwXS50ICwgQ2FydC50cmFqZWN0b3J5WzEwXS52XG5cdFx0bGFzdERvdCA9IG5ldyBEb3QgNiAsIENhcnQudHJhamVjdG9yeVsxMF0udlxuXHRcdGxhc3REb3QuaWQgPSAnbGFzdCdcblx0XHRAZG90cyA9IFsgZmlyc3REb3QsIFxuXHRcdFx0bWlkRG90LFxuXHRcdFx0bGFzdERvdFxuXHRcdF1cblx0XHRAY29ycmVjdCA9IEBzaG93ID0gZmFsc2Vcblx0XHRAZmlyc3QgPSBmaXJzdERvdFxuXHRcdEB0YXJnZXRfZGF0YSA9IENhcnQudHJhamVjdG9yeVxuXHRcdEB1cGRhdGVfZG90cygpXG5cdFx0QHNlbGVjdF9kb3QgQGRvdHNbMV1cblxuXHRzZXRfc2hvdzogKHYpLT5cblx0XHRAc2hvdyA9IHZcblx0XHRcblx0c2V0X3Q6ICh0KS0+XG5cdFx0QHQgPSB0XG5cblx0aW5jcmVtZW50OiAoZHQpLT5cblx0XHRAdCArPSBkdFxuXG5cdHNlbGVjdF9kb3Q6IChkb3QpLT5cblx0XHRAc2VsZWN0ZWQgPSBkb3RcblxuXHRhZGRfZG90OiAodCwgdiktPlxuXHRcdG5ld0RvdCA9IG5ldyBEb3QgdCx2XG5cdFx0QGRvdHMucHVzaCBuZXdEb3Rcblx0XHRAdXBkYXRlX2RvdCBuZXdEb3QsIHQsIHZcblxuXHRyZW1vdmVfZG90OiAoZG90KS0+XG5cdFx0QGRvdHMuc3BsaWNlIEBkb3RzLmluZGV4T2YoZG90KSwgMVxuXHRcdEB1cGRhdGVfZG90cygpXG5cblx0dXBkYXRlX2RvdHM6IC0+IFxuXHRcdEBkb3RzLnNvcnQgKGEsYiktPiBhLnQgLSBiLnRcblx0XHRAZG90cy5mb3JFYWNoIChkb3QsIGksIGspLT5cblx0XHRcdHByZXYgPSBrW2ktMV1cblx0XHRcdGlmIGRvdC5pZCA9PSAnbGFzdCdcblx0XHRcdFx0ZG90LnYgPSBwcmV2LnZcblx0XHRcdFx0cmV0dXJuXG5cdFx0XHRpZiBwcmV2XG5cdFx0XHRcdGR0ID0gZG90LnQgLSBwcmV2LnRcblx0XHRcdFx0ZG90LnggPSBwcmV2LnggKyBkdCAqIChkb3QudiArIHByZXYudikvMlxuXHRcdFx0XHRkb3QuZHYgPSAoZG90LnYgLSBwcmV2LnYpL01hdGgubWF4KGR0LCAuMDAwMSlcblx0XHRcdGVsc2Vcblx0XHRcdFx0ZG90LnggPSAwXG5cdFx0XHRcdGRvdC5kdiA9IDBcblxuXHR1cGRhdGVfZG90OiAoZG90LCB0LCB2KS0+XG5cdFx0aWYgZG90LmlkID09ICdmaXJzdCcgdGhlbiByZXR1cm5cblx0XHRAc2VsZWN0X2RvdCBkb3Rcblx0XHRkb3QudCA9IHRcblx0XHRkb3QudiA9IHZcblx0XHRAdXBkYXRlX2RvdHMoKVxuXHRcdEBjb3JyZWN0ID0gTWF0aC5hYnMoQ2FydC5rICogZG90LnYgKyBkb3QuZHYpIDwgMC4wNVxuXG5tb2R1bGUuZXhwb3J0cyA9IG5ldyBEYXRhIiwiRGF0YSA9IHJlcXVpcmUgJy4vZGVzaWduRGF0YSdcblxudGVtcGxhdGUgPSAnJydcblx0PGNpcmNsZSBjbGFzcz0nZG90IGxhcmdlJz48L2NpcmNsZT5cblx0PGNpcmNsZSBjbGFzcz0nZG90IHNtYWxsJyByPSc0Jz48L2NpcmNsZT5cbicnJ1xuXG5jbGFzcyBDdHJsXG5cdGNvbnN0cnVjdG9yOiAoQHNjb3BlLCBAZWwpLT5cblx0XHRyYWQgPSA3ICN0aGUgcmFkaXVzIG9mIHRoZSBsYXJnZSBjaXJjbGUgbmF0dXJhbGx5XG5cdFx0c2VsID0gZDMuc2VsZWN0IEBlbFswXVxuXHRcdGJpZyA9IHNlbC5zZWxlY3QgJ2NpcmNsZS5kb3QubGFyZ2UnXG5cdFx0XHQuYXR0ciAncicsIHJhZFxuXHRcdGNpcmMgPSBzZWwuc2VsZWN0ICdjaXJjbGUuZG90LnNtYWxsJ1xuXG5cdFx0YmlnLm9uICdtb3VzZW92ZXInLCBAbW91c2VvdmVyXG5cdFx0XHQub24gJ2NvbnRleHRtZW51JywgLT4gXG5cdFx0XHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KClcblx0XHRcdFx0ZXZlbnQuc3RvcFByb3BhZ2F0aW9uKClcblx0XHRcdC5vbiAnbW91c2Vkb3duJywgLT5cblx0XHRcdFx0YmlnLnRyYW5zaXRpb24gJ2dyb3cnXG5cdFx0XHRcdFx0LmR1cmF0aW9uIDE1MFxuXHRcdFx0XHRcdC5lYXNlICdjdWJpYydcblx0XHRcdFx0XHQuYXR0ciAncicsIHJhZCoxLjdcblx0XHRcdC5vbiAnbW91c2V1cCcsIC0+XG5cdFx0XHRcdGJpZy50cmFuc2l0aW9uICdncm93J1xuXHRcdFx0XHRcdC5kdXJhdGlvbiAxNTBcblx0XHRcdFx0XHQuZWFzZSAnY3ViaWMtaW4nXG5cdFx0XHRcdFx0LmF0dHIgJ3InLCByYWQqMS4zXG5cdFx0XHQub24gJ21vdXNlb3V0JyAsIEBtb3VzZW91dFxuXG5cdFx0QHNjb3BlLiR3YXRjaCA9PlxuXHRcdFx0XHQoRGF0YS5zZWxlY3RlZCA9PSBAZG90KSBhbmQgKERhdGEuc2hvdylcblx0XHRcdCwgKHYsIG9sZCktPlxuXHRcdFx0XHRpZiB2XG5cdFx0XHRcdFx0YmlnLnRyYW5zaXRpb24gJ2dyb3cnXG5cdFx0XHRcdFx0XHQuZHVyYXRpb24gMTUwXG5cdFx0XHRcdFx0XHQuZWFzZSAnY3ViaWMtb3V0J1xuXHRcdFx0XHRcdFx0LmF0dHIgJ3InICwgcmFkICogMS41XG5cdFx0XHRcdFx0XHQudHJhbnNpdGlvbigpXG5cdFx0XHRcdFx0XHQuZHVyYXRpb24gMTUwXG5cdFx0XHRcdFx0XHQuZWFzZSAnY3ViaWMtaW4nXG5cdFx0XHRcdFx0XHQuYXR0ciAncicgLCByYWQgKiAxLjNcblxuXHRcdFx0XHRcdGNpcmMudHJhbnNpdGlvbigpXG5cdFx0XHRcdFx0XHQuZHVyYXRpb24gMTUwXG5cdFx0XHRcdFx0XHQuZWFzZSAnY3ViaWMtb3V0J1xuXHRcdFx0XHRcdFx0LnN0eWxlXG5cdFx0XHRcdFx0XHRcdCdzdHJva2Utd2lkdGgnOiAyLjVcblx0XHRcdFx0ZWxzZSBcblx0XHRcdFx0XHRiaWcudHJhbnNpdGlvbiAnc2hyaW5rJ1xuXHRcdFx0XHRcdFx0LmR1cmF0aW9uIDM1MFxuXHRcdFx0XHRcdFx0LmVhc2UgJ2JvdW5jZS1vdXQnXG5cdFx0XHRcdFx0XHQuYXR0ciAncicgLCByYWRcblxuXHRcdFx0XHRcdGNpcmMudHJhbnNpdGlvbigpXG5cdFx0XHRcdFx0XHQuZHVyYXRpb24gMTAwXG5cdFx0XHRcdFx0XHQuZWFzZSAnY3ViaWMnXG5cdFx0XHRcdFx0XHQuc3R5bGVcblx0XHRcdFx0XHRcdFx0J3N0cm9rZS13aWR0aCc6IDEuNlxuXHRcdFx0XHRcdFx0XHRzdHJva2U6ICd3aGl0ZSdcblx0XHRcdCBcblx0bW91c2VvdXQ6ID0+XG5cdFx0RGF0YS5zZXRfc2hvdyBmYWxzZVxuXHRcdEBzY29wZS4kZXZhbEFzeW5jKClcblxuXHRtb3VzZW92ZXI6ID0+XG5cdFx0RGF0YS5zZWxlY3RfZG90IEBkb3Rcblx0XHREYXRhLnNldF9zaG93IHRydWVcblx0XHRAc2NvcGUuJGV2YWxBc3luYygpXG5cbmRlciA9ICgpLT5cblx0ZGlyZWN0aXZlID0gXG5cdFx0dGVtcGxhdGU6IHRlbXBsYXRlXG5cdFx0Y29udHJvbGxlckFzOiAndm0nXG5cdFx0c2NvcGU6IFxuXHRcdFx0ZG90OiAnPWRvdEFEZXInXG5cdFx0YmluZFRvQ29udHJvbGxlcjogdHJ1ZVxuXHRcdGNvbnRyb2xsZXI6IFsnJHNjb3BlJywnJGVsZW1lbnQnLEN0cmxdXG5cdFx0cmVzdHJpY3Q6ICdBJ1xuXG5cbm1vZHVsZS5leHBvcnRzID0gZGVyXG4iLCJEYXRhID0gcmVxdWlyZSAnLi9kZXNpZ25EYXRhJ1xuXG50ZW1wbGF0ZSA9ICcnJ1xuXHQ8Y2lyY2xlIGNsYXNzPSdkb3Qgc21hbGwnIHI9JzQnPjwvY2lyY2xlPlxuJycnXG5cbmNsYXNzIEN0cmxcblx0Y29uc3RydWN0b3I6IChAc2NvcGUsIEBlbCktPlxuXHRcdGNpcmMgPSBkMy5zZWxlY3QgQGVsWzBdXG5cblx0XHRjaXJjLm9uICdtb3VzZW92ZXInLEBtb3VzZW92ZXJcblx0XHRcdC5vbiAnbW91c2VvdXQnICwgQG1vdXNlb3V0XG5cdFx0XHQjIC5vbiAnY29udGV4dG1lbnUnLCAtPiBcblx0XHRcdCMgXHRldmVudC5wcmV2ZW50RGVmYXVsdCgpXG5cdFx0XHQjIFx0ZXZlbnQuc3RvcFByb3BhZ2F0aW9uKClcblxuXHRcdEBzY29wZS4kd2F0Y2ggPT5cblx0XHRcdFx0KERhdGEuc2VsZWN0ZWQgPT0gQGRvdCkgYW5kIChEYXRhLnNob3cpXG5cdFx0XHQsICh2LCBvbGQpLT5cblx0XHRcdFx0IyBpZiB2ID09IG9sZCB0aGVuIHJldHVyblxuXHRcdFx0XHRcblx0XHRcdFx0aWYgdlxuXHRcdFx0XHRcdGNpcmMudHJhbnNpdGlvbigpXG5cdFx0XHRcdFx0XHQuZHVyYXRpb24gMTUwXG5cdFx0XHRcdFx0XHQuZWFzZSAnY3ViaWMtb3V0J1xuXHRcdFx0XHRcdFx0LnN0eWxlXG5cdFx0XHRcdFx0XHRcdCdzdHJva2Utd2lkdGgnOiAyLjVcblx0XHRcdFx0ZWxzZSBcblx0XHRcdFx0XHRjaXJjLnRyYW5zaXRpb24oKVxuXHRcdFx0XHRcdFx0LmR1cmF0aW9uIDEwMFxuXHRcdFx0XHRcdFx0LmVhc2UgJ2N1YmljJ1xuXHRcdFx0XHRcdFx0LnN0eWxlXG5cdFx0XHRcdFx0XHRcdCdzdHJva2Utd2lkdGgnOiAxLjZcblx0XHRcdFx0XHRcdFx0c3Ryb2tlOiAnd2hpdGUnXG5cdFx0XHQgXG5cdG1vdXNlb3V0OiA9PlxuXHRcdERhdGEuc2V0X3Nob3cgZmFsc2Vcblx0XHRAc2NvcGUuJGV2YWxBc3luYygpXG5cblx0bW91c2VvdmVyOiA9PlxuXHRcdERhdGEuc2VsZWN0X2RvdCBAZG90XG5cdFx0RGF0YS5zZXRfc2hvdyB0cnVlXG5cdFx0QHNjb3BlLiRldmFsQXN5bmMoKVxuXG5kZXIgPSAoKS0+XG5cdGRpcmVjdGl2ZSA9IFxuXHRcdHRlbXBsYXRlOiB0ZW1wbGF0ZVxuXHRcdGNvbnRyb2xsZXJBczogJ3ZtJ1xuXHRcdHNjb3BlOiBcblx0XHRcdGRvdDogJz1kb3RCRGVyJ1xuXHRcdGJpbmRUb0NvbnRyb2xsZXI6IHRydWVcblx0XHRjb250cm9sbGVyOiBbJyRzY29wZScsJyRlbGVtZW50JyxDdHJsXVxuXHRcdHJlc3RyaWN0OiAnQSdcblxuXG5tb2R1bGUuZXhwb3J0cyA9IGRlclxuIiwiRGF0YSA9IHJlcXVpcmUgJy4vZGVzaWduRGF0YSdcbl8gPSByZXF1aXJlICdsb2Rhc2gnXG5cbmNsYXNzIENhcnRcblx0Y29uc3RydWN0b3I6IC0+XG5cblx0bG9jOiAodCktPlxuXHRcdGkgPSBfLmZpbmRMYXN0SW5kZXggRGF0YS5kb3RzLCAoZCktPlxuXHRcdFx0ZC50IDw9IHRcblx0XHRhID0gRGF0YS5kb3RzW2ldXG5cdFx0ZHQgPSB0IC0gYS50XG5cdFx0ZHYgPSBEYXRhLmRvdHNbaSsxXT8uZHYgPyAwXG5cdFx0YS54ICsgYS52ICogZHQgKyAwLjUqZHYgKiBkdCoqMlxuXG5cdEBwcm9wZXJ0eSAneCcsIGdldDotPiBAbG9jIERhdGEudFxuXG5cdEBwcm9wZXJ0eSAndicsIGdldDotPlxuXHRcdHQgPSBEYXRhLnRcblx0XHRpID0gXy5maW5kTGFzdEluZGV4IERhdGEuZG90cywgKGQpLT5cblx0XHRcdGQudCA8PSB0XG5cdFx0YSA9IERhdGEuZG90c1tpXVxuXHRcdGR0ID0gdCAtIGEudFxuXHRcdGR2ID0gRGF0YS5kb3RzW2krMV0/LmR2ID8gMFxuXHRcdGEudiArIGR2ICogZHRcblxubW9kdWxlLmV4cG9ydHMgPSBuZXcgQ2FydCIsIkRhdGEgPSByZXF1aXJlICcuL2Rlc2lnbkRhdGEnXG5fID0gcmVxdWlyZSAnbG9kYXNoJ1xucmVxdWlyZSAnLi4vLi4vaGVscGVycydcblxuY2xhc3MgQ2FydFxuXHRjb25zdHJ1Y3RvcjogLT5cblxuXHRsb2M6ICh0KS0+XG5cdFx0Mi8uOCAqICgxLU1hdGguZXhwKC0uOCp0KSlcblxuXHRAcHJvcGVydHkgJ3gnLCBnZXQ6LT4gQGxvYyBEYXRhLnRcblxuXHRAcHJvcGVydHkgJ3YnLCBnZXQ6LT5cblx0XHQyKiBNYXRoLmV4cCgtLjgqRGF0YS50KVxuXG5tb2R1bGUuZXhwb3J0cyA9IG5ldyBDYXJ0IiwiYW5ndWxhciA9IHJlcXVpcmUgJ2FuZ3VsYXInXG5kMyA9IHJlcXVpcmUgJ2QzJ1xucmVxdWlyZSAnLi4vLi4vaGVscGVycydcbl8gPSByZXF1aXJlICdsb2Rhc2gnXG50ZW1wbGF0ZSA9ICcnJ1xuXHQ8c3ZnIG5nLWluaXQ9J3ZtLnJlc2l6ZSgpJyB3aWR0aD0nMTAwJScgY2xhc3M9J3RvcENoYXJ0Jz5cblx0XHQ8ZGVmcz5cblx0XHRcdDxjbGlwcGF0aCBpZD0ncmVnJz5cblx0XHRcdFx0PHJlY3QgZDMtZGVyPSd7d2lkdGg6IHZtLndpZHRoLCBoZWlnaHQ6IHZtLmhlaWdodH0nIC8+XG5cdFx0XHQ8L2NsaXBwYXRoPlxuXHRcdDwvZGVmcz5cblx0XHQ8ZyBjbGFzcz0nYm9pbGVycGxhdGUnIHNoaWZ0ZXI9J1t2bS5tYXIubGVmdCwgdm0ubWFyLnRvcF0nPlxuXHRcdFx0PHJlY3QgY2xhc3M9J2JhY2tncm91bmQnIGQzLWRlcj0ne3dpZHRoOiB2bS53aWR0aCwgaGVpZ2h0OiB2bS5oZWlnaHR9JyBuZy1tb3VzZW1vdmU9J3ZtLm1vdmUoJGV2ZW50KScgLz5cblx0XHRcdDxnIHZlci1heGlzLWRlciB3aWR0aD0ndm0ud2lkdGgnIHNjYWxlPSd2bS5WZXInIGZ1bj0ndm0udmVyQXhGdW4nPjwvZz5cblx0XHRcdDxnIGhvci1heGlzLWRlciBoZWlnaHQ9J3ZtLmhlaWdodCcgc2NhbGU9J3ZtLkhvcicgZnVuPSd2bS5ob3JBeEZ1bicgc2hpZnRlcj0nWzAsdm0uaGVpZ2h0XSc+PC9nPlxuXHRcdFx0PGZvcmVpZ25PYmplY3Qgd2lkdGg9JzMwJyBoZWlnaHQ9JzMwJyB5PScxOCcgc2hpZnRlcj0nW3ZtLndpZHRoLzIsIHZtLmhlaWdodF0nPlxuXHRcdFx0XHQ8dGV4dCBjbGFzcz0nbGFiZWwnPiR0JDwvdGV4dD5cblx0XHRcdDwvZm9yZWlnbk9iamVjdD5cblxuXHRcdDwvZz5cblx0XHQ8ZyBjbGFzcz0nbWFpbicgY2xpcC1wYXRoPVwidXJsKCNyZWcpXCIgc2hpZnRlcj0nW3ZtLm1hci5sZWZ0LCB2bS5tYXIudG9wXSc+XG5cdFx0XHQ8bGluZSBjbGFzcz0nemVyby1saW5lIGhvcicgbmctY2xhc3M9J3tcImNvcnJlY3RcIjogdm0uY29ycmVjdH0nIGQzLWRlcj0ne3gxOiAwLCB4Mjogdm0ud2lkdGgsIHkxOiB2bS5WZXIoMCksIHkyOiB2bS5WZXIoMCl9Jy8+XG5cdFx0XHQ8bGluZSBjbGFzcz0ndHJpIHYnIGQzLWRlcj0ne3gxOiB2bS5Ib3Iodm0ucG9pbnQudCksIHgyOiB2bS5Ib3Iodm0ucG9pbnQudCksIHkxOiB2bS5WZXIoMCksIHkyOiB2bS5WZXIodm0ucG9pbnQudiApfScvPlxuXHRcdFx0PGNpcmNsZSByPSczcHgnIHNoaWZ0ZXI9J1t2bS5Ib3Iodm0ucG9pbnQudCksIHZtLlZlcih2bS5wb2ludC52KV0nIGNsYXNzPSdwb2ludCB2Jy8+XG5cdFx0XHQ8cGF0aCBkMy1kZXI9J3tkOnZtLmxpbmVGdW4odm0uZGF0YSl9JyBjbGFzcz0nZnVuIHYnIC8+XG5cdFx0XHQ8Zm9yZWlnbk9iamVjdCB3aWR0aD0nMzAnIGhlaWdodD0nMzAnIHNoaWZ0ZXI9J1sodm0uSG9yKHZtLnBvaW50LnQpIC0gMTYpLCB2bS5WZXIodm0ucG9pbnQudi8yKSAtIDddJz5cblx0XHRcdFx0XHQ8dGV4dCBjbGFzcz0ndHJpLWxhYmVsJyBmb250LXNpemU9JzEzcHgnPiR5JDwvdGV4dD5cblx0XHRcdDwvZm9yZWlnbk9iamVjdD5cblx0XHRcdDxmb3JlaWduT2JqZWN0IHdpZHRoPScyMDAnIGhlaWdodD0nMzAnIHNoaWZ0ZXI9J1t2bS5Ib3IoMSksIHZtLlZlciguOSldJz5cblx0XHRcdFx0PHRleHQgY2xhc3M9J3RyaS1sYWJlbCc+JDUodC0uNSkodC0xKSh0LTEpXjIkPC90ZXh0PlxuXHRcdFx0PC9mb3JlaWduT2JqZWN0PlxuXHRcdDwvZz5cblx0PC9zdmc+XG4nJydcblxuY2xhc3MgQ3RybFxuXHRjb25zdHJ1Y3RvcjogKEBzY29wZSwgQGVsLCBAd2luZG93KS0+XG5cdFx0QG1hciA9IFxuXHRcdFx0bGVmdDogMzBcblx0XHRcdHRvcDogMTBcblx0XHRcdHJpZ2h0OiAyMFxuXHRcdFx0Ym90dG9tOiA0MFxuXG5cdFx0QFZlciA9IGQzLnNjYWxlLmxpbmVhcigpLmRvbWFpbiBbLTEsMV1cblx0XHRASG9yID0gZDMuc2NhbGUubGluZWFyKCkuZG9tYWluIFswLDIuNV1cblxuXHRcdEBob3JBeEZ1biA9IGQzLnN2Zy5heGlzKClcblx0XHRcdC5zY2FsZSBASG9yXG5cdFx0XHQudGlja0Zvcm1hdChkMy5mb3JtYXQgJ2QnKVxuXHRcdFx0Lm9yaWVudCAnYm90dG9tJ1xuXG5cdFx0QHZlckF4RnVuID0gZDMuc3ZnLmF4aXMoKVxuXHRcdFx0LnNjYWxlIEBWZXJcblx0XHRcdC50aWNrcyA1XG5cdFx0XHQudGlja0Zvcm1hdCAoZCktPlxuXHRcdFx0XHRpZiBNYXRoLmZsb29yKGQpICE9IGQgdGhlbiByZXR1cm5cblx0XHRcdFx0ZFxuXHRcdFx0Lm9yaWVudCAnbGVmdCdcblxuXHRcdEBsaW5lRnVuID0gZDMuc3ZnLmxpbmUoKVxuXHRcdFx0LnkgKGQpPT4gQFZlciBkLnZcblx0XHRcdC54IChkKT0+IEBIb3IgZC50XG5cblx0XHR2RnVuID0gKHQpLT41KiAodC0uNSkgKiAodC0xKSAqICh0LTIpKioyXG5cblx0XHRAZGF0YSA9IF8ucmFuZ2UgMCAsIDMgLCAxLzUwXG5cdFx0XHQubWFwICh0KS0+XG5cdFx0XHRcdHJlcyA9IFxuXHRcdFx0XHRcdHY6IHZGdW4gdFxuXHRcdFx0XHRcdHQ6IHRcblxuXHRcdEBwb2ludCA9IF8uc2FtcGxlIEBkYXRhXG5cblx0XHRAY29ycmVjdCA9IGZhbHNlXG5cblx0XHRhbmd1bGFyLmVsZW1lbnQgQHdpbmRvd1xuXHRcdFx0Lm9uICdyZXNpemUnLCBAcmVzaXplXG5cblx0XHRAbW92ZSA9IChldmVudCkgPT5cblx0XHRcdHJlY3QgPSBldmVudC50YXJnZXQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KClcblx0XHRcdHQgPSBASG9yLmludmVydCBldmVudC54IC0gcmVjdC5sZWZ0XG5cdFx0XHR2ID0gdkZ1biB0XG5cdFx0XHRAcG9pbnQgPSBcblx0XHRcdFx0dDogdFxuXHRcdFx0XHR2OiB2XG5cdFx0XHRAY29ycmVjdCA9IE1hdGguYWJzKEBwb2ludC52KSA8PSAwLjA1IFxuXHRcdFx0QHNjb3BlLiRldmFsQXN5bmMoKVxuXG5cdEBwcm9wZXJ0eSAnc3ZnX2hlaWdodCcsIGdldDogLT4gQGhlaWdodCArIEBtYXIudG9wICsgQG1hci5ib3R0b21cblxuXHRyZXNpemU6ICgpPT5cblx0XHRAd2lkdGggPSBAZWxbMF0uY2xpZW50V2lkdGggLSBAbWFyLmxlZnQgLSBAbWFyLnJpZ2h0XG5cdFx0QGhlaWdodCA9IEBlbFswXS5jbGllbnRIZWlnaHQgLSBAbWFyLmxlZnQgLSBAbWFyLnJpZ2h0XG5cdFx0QFZlci5yYW5nZSBbQGhlaWdodCwgMF1cblx0XHRASG9yLnJhbmdlIFswLCBAd2lkdGhdXG5cdFx0QHNjb3BlLiRldmFsQXN5bmMoKVxuXG5kZXIgPSAoKS0+XG5cdGRpcmVjdGl2ZSA9IFxuXHRcdGNvbnRyb2xsZXJBczogJ3ZtJ1xuXHRcdHNjb3BlOiB7fVxuXHRcdHRlbXBsYXRlOiB0ZW1wbGF0ZVxuXHRcdHRlbXBsYXRlTmFtZXNwYWNlOiAnc3ZnJ1xuXHRcdGNvbnRyb2xsZXI6IFsnJHNjb3BlJywnJGVsZW1lbnQnLCAnJHdpbmRvdycsIEN0cmxdXG5cbm1vZHVsZS5leHBvcnRzID0gZGVyXG4iLCJkcmFnID0gKCRwYXJzZSktPlxuXHRkaXJlY3RpdmUgPSBcblx0XHRsaW5rOiAoc2NvcGUsZWwsYXR0ciktPlxuXHRcdFx0c2VsID0gZDMuc2VsZWN0KGVsWzBdKVxuXHRcdFx0c2VsLmNhbGwoJHBhcnNlKGF0dHIuYmVoYXZpb3IpKHNjb3BlKSlcblxubW9kdWxlLmV4cG9ydHMgPSBkcmFnIiwiZDMgPSByZXF1aXJlICdkMydcbmFuZ3VsYXIgPSByZXF1aXJlICdhbmd1bGFyJ1xuXG5kZXIgPSAoJHBhcnNlKS0+ICNnb2VzIG9uIGEgc3ZnIGVsZW1lbnRcblx0ZGlyZWN0aXZlID0gXG5cdFx0cmVzdHJpY3Q6ICdBJ1xuXHRcdHNjb3BlOiBcblx0XHRcdGQzRGVyOiAnPSdcblx0XHRcdHRyYW46ICc9J1xuXHRcdGxpbms6IChzY29wZSwgZWwsIGF0dHIpLT5cblx0XHRcdHNlbCA9IGQzLnNlbGVjdCBlbFswXVxuXHRcdFx0dSA9ICd0LScgKyBNYXRoLnJhbmRvbSgpXG5cdFx0XHRzY29wZS4kd2F0Y2ggJ2QzRGVyJ1xuXHRcdFx0XHQsICh2KS0+XG5cdFx0XHRcdFx0aWYgc2NvcGUudHJhblxuXHRcdFx0XHRcdFx0c2VsLnRyYW5zaXRpb24gdVxuXHRcdFx0XHRcdFx0XHQuYXR0ciB2XG5cdFx0XHRcdFx0XHRcdC5jYWxsIHNjb3BlLnRyYW5cblx0XHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0XHRzZWwuYXR0ciB2XG5cblx0XHRcdFx0LCB0cnVlXG5tb2R1bGUuZXhwb3J0cyA9IGRlciIsIm1vZHVsZS5leHBvcnRzID0gKCRwYXJzZSktPlxuXHQoc2NvcGUsIGVsLCBhdHRyKS0+XG5cdFx0ZDMuc2VsZWN0KGVsWzBdKS5kYXR1bSAkcGFyc2UoYXR0ci5kYXR1bSkoc2NvcGUpIiwiZDMgPSByZXF1aXJlICdkMydcblxuZGVyID0gKCRwYXJzZSktPlxuXHRkaXJlY3RpdmUgPVxuXHRcdGxpbms6IChzY29wZSwgZWwsIGF0dHIpLT5cblx0XHRcdHJlc2hpZnQgPSAodiktPiBcblx0XHRcdFx0ZDMuc2VsZWN0IGVsWzBdXG5cdFx0XHRcdFx0LmF0dHIgJ3RyYW5zZm9ybScgLCBcInRyYW5zbGF0ZSgje3ZbMF19LCN7dlsxXX0pXCJcblxuXHRcdFx0c2NvcGUuJHdhdGNoIC0+XG5cdFx0XHRcdFx0JHBhcnNlKGF0dHIuc2hpZnRlcikoc2NvcGUpXG5cdFx0XHRcdCwgcmVzaGlmdFxuXHRcdFx0XHQsIHRydWVcblxubW9kdWxlLmV4cG9ydHMgPSBkZXIiLCJhbmd1bGFyID0gcmVxdWlyZSAnYW5ndWxhcidcbmQzID0gcmVxdWlyZSAnZDMnXG50ZXh0dXJlcyA9IHJlcXVpcmUgJ3RleHR1cmVzJ1xuXG5jbGFzcyBDdHJsXG5cdGNvbnN0cnVjdG9yOiAoQHNjb3BlLCBAZWwsIEB3aW5kb3cpLT5cblx0XHR0ID0gdGV4dHVyZXMubGluZXMoKVxuXHRcdFx0Lm9yaWVudGF0aW9uIFwiMy84XCIsIFwiNy84XCJcblx0XHRcdC5zaXplIDRcblx0XHRcdC5zdHJva2UoJyNFNkU2RTYnKVxuXHRcdCAgICAuc3Ryb2tlV2lkdGggLjZcblxuXHRcdHQuaWQgJ215VGV4dHVyZSdcblxuXHRcdGQzLnNlbGVjdCBAZWxbMF1cblx0XHRcdC5zZWxlY3QgJ3N2Zydcblx0XHRcdC5jYWxsIHRcblxuZGVyID0gLT5cblx0ZGlyZWN0aXZlID0gXG5cdFx0Y29udHJvbGxlckFzOiAndm0nXG5cdFx0c2NvcGU6IHt9XG5cdFx0dGVtcGxhdGU6ICc8c3ZnIGhlaWdodD1cIjBweFwiIHN0eWxlPVwicG9zaXRpb246IGFic29sdXRlO1wiIHdpZHRoPVwiMHB4XCI+PC9zdmc+J1xuXHRcdHRlbXBsYXRlTmFtZXNwYWNlOiAnc3ZnJ1xuXHRcdGNvbnRyb2xsZXI6IFsnJHNjb3BlJywnJGVsZW1lbnQnLCAnJHdpbmRvdycsIEN0cmxdXG5cbm1vZHVsZS5leHBvcnRzID0gZGVyXG4iLCJkMyA9IHJlcXVpcmUgJ2QzJ1xuYW5ndWxhciA9IHJlcXVpcmUgJ2FuZ3VsYXInXG5cbmRlciA9ICgkd2luZG93KS0+XG5cdGRpcmVjdGl2ZSA9IFxuXHRcdGNvbnRyb2xsZXI6IGFuZ3VsYXIubm9vcFxuXHRcdGNvbnRyb2xsZXJBczogJ3ZtJ1xuXHRcdGJpbmRUb0NvbnRyb2xsZXI6IHRydWVcblx0XHRyZXN0cmljdDogJ0EnXG5cdFx0dGVtcGxhdGVOYW1lc3BhY2U6ICdzdmcnXG5cdFx0c2NvcGU6IFxuXHRcdFx0c2NhbGU6ICc9J1xuXHRcdFx0aGVpZ2h0OiAnPSdcblx0XHRcdGZ1bjogJz0nXG5cdFx0bGluazogKHNjb3BlLCBlbCwgYXR0ciwgdm0pLT5cblx0XHRcdHhBeGlzRnVuID0gdm0uZnVuID8gKGQzLnN2Zy5heGlzKClcblx0XHRcdFx0XHRcdFx0LnNjYWxlIHZtLnNjYWxlXG5cdFx0XHRcdFx0XHRcdC5vcmllbnQgJ2JvdHRvbScpXG5cblx0XHRcdHNlbCA9IGQzLnNlbGVjdCBlbFswXVxuXHRcdFx0XHQuY2xhc3NlZCAneCBheGlzJywgdHJ1ZVxuXG5cdFx0XHR1cGRhdGUgPSAoKT0+XG5cdFx0XHRcdHhBeGlzRnVuLnRpY2tTaXplIC12bS5oZWlnaHRcblx0XHRcdFx0c2VsLmNhbGwgeEF4aXNGdW5cblx0XHRcdFx0XG5cdFx0XHR1cGRhdGUoKVxuXHRcdFx0XHRcblx0XHRcdHNjb3BlLiR3YXRjaCAndm0uc2NhbGUuZG9tYWluKCknLCB1cGRhdGUgLCB0cnVlXG5cdFx0XHRzY29wZS4kd2F0Y2ggJ3ZtLnNjYWxlLnJhbmdlKCknLCB1cGRhdGUgLCB0cnVlXG5cdFx0XHRzY29wZS4kd2F0Y2ggJ3ZtLmhlaWdodCcsIHVwZGF0ZSAsIHRydWVcblxubW9kdWxlLmV4cG9ydHMgPSBkZXIiLCJkMyA9IHJlcXVpcmUgJ2QzJ1xuYW5ndWxhciA9IHJlcXVpcmUgJ2FuZ3VsYXInXG5cbmRlciA9ICgkd2luZG93KS0+XG5cdGRpcmVjdGl2ZSA9IFxuXHRcdGNvbnRyb2xsZXI6IGFuZ3VsYXIubm9vcFxuXHRcdGNvbnRyb2xsZXJBczogJ3ZtJ1xuXHRcdGJpbmRUb0NvbnRyb2xsZXI6IHRydWVcblx0XHRyZXN0cmljdDogJ0EnXG5cdFx0dGVtcGxhdGVOYW1lc3BhY2U6ICdzdmcnXG5cdFx0c2NvcGU6IFxuXHRcdFx0c2NhbGU6ICc9J1xuXHRcdFx0d2lkdGg6ICc9J1xuXHRcdFx0ZnVuOiAnPSdcblx0XHRsaW5rOiAoc2NvcGUsIGVsLCBhdHRyLCB2bSktPlxuXHRcdFx0eUF4aXNGdW4gPSB2bS5mdW4gPyBkMy5zdmcuYXhpcygpXG5cdFx0XHRcdC5zY2FsZSB2bS5zY2FsZVxuXHRcdFx0XHQub3JpZW50ICdsZWZ0J1xuXG5cdFx0XHRzZWwgPSBkMy5zZWxlY3QoZWxbMF0pLmNsYXNzZWQoJ3kgYXhpcycsIHRydWUpXG5cblx0XHRcdHVwZGF0ZSA9ICgpPT5cblx0XHRcdFx0eUF4aXNGdW4udGlja1NpemUoIC12bS53aWR0aClcblx0XHRcdFx0c2VsLmNhbGwoeUF4aXNGdW4pXG5cblx0XHRcdHVwZGF0ZSgpXG5cdFx0XHRcdFxuXHRcdFx0c2NvcGUuJHdhdGNoICd2bS5zY2FsZS5kb21haW4oKScsIHVwZGF0ZSAsIHRydWVcblx0XHRcdHNjb3BlLiR3YXRjaCAndm0uc2NhbGUucmFuZ2UoKScsIHVwZGF0ZSAsIHRydWVcblx0XHRcdHNjb3BlLiR3YXRjaCAndm0uc2NhbGUudGlja3MoKScsIHVwZGF0ZSAsIHRydWVcblxuXG5tb2R1bGUuZXhwb3J0cyA9IGRlciIsIid1c2Ugc3RyaWN0J1xuXG5tb2R1bGUuZXhwb3J0cy50aW1lb3V0ID0gKGZ1biwgdGltZSktPlxuXHRcdGQzLnRpbWVyKCgpPT5cblx0XHRcdGZ1bigpXG5cdFx0XHR0cnVlXG5cdFx0LHRpbWUpXG5cblxuRnVuY3Rpb246OnByb3BlcnR5ID0gKHByb3AsIGRlc2MpIC0+XG4gIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSBAcHJvdG90eXBlLCBwcm9wLCBkZXNjIl19
