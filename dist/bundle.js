(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';
var angular, app, d3, looper;

angular = require('angular');

d3 = require('d3');

app = angular.module('mainApp', [require('angular-material')]).directive('horAxisDer', require('./directives/xAxis')).directive('verAxisDer', require('./directives/yAxis')).directive('cartSimDer', require('./components/cart/cartSim')).directive('cartObjectDer', require('./components/cart/cartObject')).directive('cartButtonsDer', require('./components/cart/cartButtons')).directive('shifter', require('./directives/shifter')).directive('designADer', require('./components/design/designA')).directive('behavior', require('./directives/behavior')).directive('dotADer', require('./components/design/dotA')).directive('dotBDer', require('./components/design/dotB')).directive('datum', require('./directives/datum')).directive('d3Der', require('./directives/d3Der')).directive('designBDer', require('./components/design/designB')).directive('regularDer', require('./components/regular/regular')).directive('derivativeADer', require('./components/derivative/derivativeA')).directive('derivativeBDer', require('./components/derivative/derivativeB')).directive('cartPlotDer', require('./components/cart/cartPlot')).directive('designCartADer', require('./components/design/designCartA')).directive('designCartBDer', require('./components/design/designCartB')).directive('textureDer', require('./directives/texture')).directive('designButtonsDer', require('./components/design/designButtons')).directive('boilerplateDer', require('./directives/boilerplate'));

looper = function() {
  return setTimeout(function() {
    d3.selectAll('circle.dot.large').transition('grow').duration(500).ease('cubic-out').attr('transform', 'scale( 1.34)').transition('shrink').duration(500).ease('cubic-out').attr('transform', 'scale( 1.0)');
    return looper();
  }, 1000);
};

looper();



},{"./components/cart/cartButtons":2,"./components/cart/cartObject":4,"./components/cart/cartPlot":5,"./components/cart/cartSim":6,"./components/derivative/derivativeA":7,"./components/derivative/derivativeB":8,"./components/design/designA":10,"./components/design/designB":11,"./components/design/designButtons":12,"./components/design/designCartA":13,"./components/design/designCartB":14,"./components/design/dotA":16,"./components/design/dotB":17,"./components/regular/regular":20,"./directives/behavior":21,"./directives/boilerplate":22,"./directives/d3Der":23,"./directives/datum":24,"./directives/shifter":26,"./directives/texture":27,"./directives/xAxis":28,"./directives/yAxis":29,"angular":undefined,"angular-material":undefined,"d3":undefined}],2:[function(require,module,exports){
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
  function Ctrl(scope) {
    this.scope = scope;
  }

  Ctrl.prototype.trans = function(tran) {
    return tran.duration(30).ease('linear');
  };

  return Ctrl;

})();

der = function() {
  var directive;
  return directive = {
    scope: {
      size: '=',
      left: '='
    },
    controllerAs: 'vm',
    templateNamespace: 'svg',
    controller: ['$scope', Ctrl],
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



},{"../../helpers":30,"./cartData":3,"angular":undefined,"d3":undefined,"lodash":undefined}],6:[function(require,module,exports){
var Cart, Ctrl, _, d3, der, min, template,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

_ = require('lodash');

d3 = require('d3');

min = Math.min;

Cart = require('./cartData');

require('../../helpers');

template = '<svg ng-init=\'vm.resize()\' width=\'100%\' ng-attr-height="{{vm.svgHeight}}">\n	<defs>\n		<clippath id=\'cartSim\'>\n			<rect d3-der=\'{width: vm.width, height: vm.height}\' />\n		</clippath>\n	</defs>\n	<g class=\'boilerplate\' shifter=\'{{::[vm.mar.left, vm.mar.top]}}\' >\n		<rect d3-der=\'{width: vm.width, height: vm.height}\' class=\'background\'/>\n		<g hor-axis-der height=\'vm.height\' scale=\'vm.X\' fun=\'vm.axisFun\' shifter=\'[0,vm.height]\'></g>\n		<foreignObject width=\'30\' height=\'30\' y=\'20\' shifter=\'[vm.width/2, vm.height]\'>\n				<text class=\'label\' >$x$</text>\n		</foreignObject>\n	</g>\n	<g shifter=\'{{::[vm.mar.left, vm.mar.top]}}\' clip-path="url(#cartSim)" >\n		<foreignObject width=\'30\' height=\'30\' y=\'20\' shifter=\'[vm.width/2, vm.height]\'>\n				<text class=\'label\' >$t$</text>\n		</foreignObject>\n		<g class=\'g-cart\' cart-object-der left=\'vm.X(vm.Cart.x)\' shifter=\'[0,vm.height]\' size=\'vm.size\'></g>\n	</g>\n</svg>';

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

  Ctrl.property('size', {
    get: function() {
      return (this.X(0.4) - this.X(0)) / 80;
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



},{"../../helpers":30,"./cartData":3,"d3":undefined,"lodash":undefined}],7:[function(require,module,exports){
var Ctrl, Data, PlotCtrl, _, angular, d3, der, template,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

angular = require('angular');

d3 = require('d3');

require('../../helpers');

_ = require('lodash');

Data = require('./derivativeData');

PlotCtrl = require('../../directives/plotCtrl');

template = '<svg ng-init=\'vm.resize()\' class=\'topChart\'>\n	<g boilerplate-der width=\'vm.width\' height=\'vm.height\' ver-ax-fun=\'vm.verAxFun\' hor-ax-fun=\'vm.horAxFun\' ver=\'vm.Ver\' hor=\'vm.Hor\' mar=\'vm.mar\' name=\'vm.name\'></g>\n	<g class=\'main\' ng-attr-clip-path=\'url(#{{vm.name}})\' shifter=\'[vm.mar.left, vm.mar.top]\'>\n		<foreignObject width=\'30\' height=\'30\' y=\'20\' shifter=\'[vm.width/2, vm.height]\'>\n				<text class=\'label\' >$t$</text>\n		</foreignObject>\n		<line class=\'zero-line hor\' d3-der=\'{x1: 0, x2: vm.width, y1: vm.Ver(0), y2: vm.Ver(0)}\'/>\n		<path ng-attr-d=\'{{vm.lineFun(vm.data)}}\' class=\'fun v\' />\n		<path ng-attr-d=\'{{vm.triangleData}}\' class=\'tri\' />\n		<line class=\'tri dv\' d3-der=\'{x1: vm.Hor(vm.point.t)-1, x2: vm.Hor(vm.point.t)-1, y1: vm.Ver(vm.point.v), y2: vm.Ver((vm.point.v + vm.point.dv))}\'/>\n		<foreignObject width=\'30\' height=\'30\' shifter=\'[(vm.Hor(vm.point.t) - 16), vm.sthing]\'>\n				<text class=\'tri-label\' >$\\dot{y}$</text>\n		</foreignObject>\n		<foreignObject width=\'100\' height=\'30\' shifter=\'[vm.Hor(1.65), vm.Ver(1.38)]\'>\n			<text class=\'tri-label\'>$\\sin(t)$</text>\n		</foreignObject>\n		<circle r=\'3px\'  shifter=\'[vm.Hor(vm.point.t), vm.Ver(vm.point.v)]\' class=\'point v\'/>\n	</g>\n</svg>';

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
    this.name = 'derClip';
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

  Ctrl.prototype.Ver = d3.scale.linear().domain([-1.5, 1.5]);

  Ctrl.prototype.Hor = d3.scale.linear().domain([0, 6]);

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



},{"../../directives/plotCtrl":25,"../../helpers":30,"./derivativeData":9,"angular":undefined,"d3":undefined,"lodash":undefined}],8:[function(require,module,exports){
var Ctrl, Data, _, angular, d3, der, template,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

angular = require('angular');

d3 = require('d3');

require('../../helpers');

_ = require('lodash');

Data = require('./derivativeData');

template = '<svg ng-init=\'vm.resize()\' class=\'topChart\'>\n	<g boilerplate-der width=\'vm.width\' height=\'vm.height\' ver-ax-fun=\'vm.verAxFun\' hor-ax-fun=\'vm.horAxFun\' ver=\'vm.Ver\' hor=\'vm.Hor\' mar=\'vm.mar\' name=\'vm.name\'></g>\n	<g class=\'main\' ng-attr-clip-path="url(#{{vm.name}})" shifter=\'[vm.mar.left, vm.mar.top]\'>\n		<foreignObject width=\'30\' height=\'30\' y=\'20\' shifter=\'[vm.width/2, vm.height]\'>\n				<text class=\'label\' >$t$</text>\n		</foreignObject>\n		<line class=\'zero-line hor\' d3-der=\'{x1: 0, x2: vm.width, y1: vm.Ver(0), y2: vm.Ver(0)}\'/>\n		<path d3-der=\'{d:vm.lineFun(vm.data)}\' class=\'fun dv\' />\n		<line class=\'tri dv\' d3-der=\'{x1: vm.Hor(vm.point.t), x2: vm.Hor(vm.point.t), y1: vm.Ver(0), y2: vm.Ver(vm.point.dv)}\'/>\n		<foreignObject width=\'30\' height=\'30\' shifter=\'[(vm.Hor(vm.point.t) - 16), vm.Ver(vm.point.dv*.5)-6]\'>\n				<text class=\'tri-label\'>$\\dot{y}$</text>\n		</foreignObject>\n		<foreignObject width=\'100\' height=\'30\' shifter=\'[vm.Hor(.9), vm.Ver(1)]\'>\n			<text class=\'tri-label\'>$\\cos(t)$</text>\n		</foreignObject>\n		<circle r=\'4px\'  shifter=\'[vm.Hor(vm.point.t), vm.Ver(vm.point.dv)]\' class=\'point dv\'/>\n	</g>\n</svg>';

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
    this.name = 'derivativeB';
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



},{"../../helpers":30,"./derivativeData":9,"angular":undefined,"d3":undefined,"lodash":undefined}],9:[function(require,module,exports){
var Data, _, d3, dvFun, vFun;

_ = require('lodash');

vFun = Math.sin;

dvFun = Math.cos;

require('../../helpers');

d3 = require('d3');

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



},{"../../helpers":30,"d3":undefined,"lodash":undefined}],10:[function(require,module,exports){
var Ctrl, Data, Fake, Real, angular, d3, der, template,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

angular = require('angular');

d3 = require('d3');

Data = require('./designData');

require('../../helpers');

Fake = require('./fakeCart');

Real = require('./trueCart');

template = '<svg ng-init=\'vm.resize()\' class=\'bottomChart\'>\n	<g boilerplate-der width=\'vm.width\' height=\'vm.height\' ver-ax-fun=\'vm.verAxFun\' hor-ax-fun=\'vm.horAxFun\' ver=\'vm.Ver\' hor=\'vm.Hor\' mar=\'vm.mar\' name=\'"designA"\'></g>\n	<g class=\'main\' clip-path="url(#designA)" shifter=\'[vm.mar.left, vm.mar.top]\' >\n		<foreignObject width=\'30\' height=\'30\' shifter=\'[-38, vm.height/2]\'>\n				<text class=\'label\'>$v$</text>\n		</foreignObject>\n		<foreignObject width=\'30\' height=\'30\' y=\'20\' shifter=\'[vm.width/2, vm.height]\'>\n				<text class=\'label\' >$t$</text>\n		</foreignObject>\n		<line class=\'zero-line\' d3-der=\'{x1: 0, x2: vm.width, y1: vm.Ver(0), y2: vm.Ver(0)}\' />\n		<line class=\'zero-line\' d3-der="{x1: vm.Hor(0), x2: vm.Hor(0), y1: vm.height, y2: 0}" />\n		<g ng-class=\'{hide: !vm.Data.show}\' >\n			<line class=\'tri v\' d3-der=\'{x1: vm.Hor(vm.selected.t)-1, x2: vm.Hor(vm.selected.t)-1, y1: vm.Ver(0), y2: vm.Ver(vm.selected.v)}\'/>\n			<path ng-attr-d=\'{{vm.triangleData()}}\' class=\'tri\' />\n			<line d3-der=\'{x1: vm.Hor(vm.selected.t)+1, x2: vm.Hor(vm.selected.t)+1, y1: vm.Ver(vm.selected.v), y2: vm.Ver(vm.selected.v + vm.selected.dv)}\' class=\'tri dv\' />\n		</g>\n		<path ng-attr-d=\'{{vm.lineFun(vm.Data.Cart.trajectory)}}\' class=\'fun target\' />\n		<path ng-attr-d=\'{{vm.lineFun(vm.Data.dots)}}\' class=\'fun v\' />\n		<g ng-repeat=\'dot in vm.dots track by dot.id\' datum=dot shifter=\'[vm.Hor(dot.t),vm.Ver(dot.v)]\' behavior=\'vm.drag\' dot-a-der=dot ></g>\n		<circle class=\'dot small\' r=\'4\' shifter=\'[vm.Hor(vm.Data.first.t),vm.Ver(vm.Data.first.v)]\' />\n		<foreignObject width=\'70\' height=\'30\' shifter=\'[vm.Hor(4), vm.Ver(.33)]\'>\n				<text class=\'tri-label\' >$2e^{-.8t}$</text>\n		</foreignObject>\n		<circle r=\'4px\'  shifter=\'[vm.Hor(vm.Data.t), vm.Ver(vm.Fake.v)]\' class=\'point fake\'/>\n		<circle r=\'4px\'  shifter=\'[vm.Hor(vm.Data.t), vm.Ver(vm.Real.v)]\' class=\'point real\'/>\n	</g>\n</svg>';

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



},{"../../helpers":30,"./designData":15,"./fakeCart":18,"./trueCart":19,"angular":undefined,"d3":undefined}],11:[function(require,module,exports){
var Ctrl, Data, angular, d3, der, template,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

Data = require('./designData');

angular = require('angular');

d3 = require('d3');

require('../../helpers');

template = '<svg ng-init=\'vm.resize()\'  width=\'100%\' class=\'bottomChart\'>\n	<g boilerplate-der width=\'vm.width\' height=\'vm.height\' ver-ax-fun=\'vm.verAxFun\' hor-ax-fun=\'vm.horAxFun\' ver=\'vm.Ver\' hor=\'vm.Hor\' mar=\'vm.mar\' name=\'"designB"\'></g>\n	<g class=\'main\' clip-path="url(#designB)" shifter=\'[vm.mar.left, vm.mar.top]\'>\n		<foreignObject width=\'30\' height=\'30\' shifter=\'[-38, vm.height/2]\'>\n				<text class=\'label\'>$\\dot{v}$</text>\n		</foreignObject>\n		<foreignObject width=\'30\' height=\'30\' y=\'20\' shifter=\'[vm.width/2, vm.height]\'>\n				<text class=\'label\'>$v$</text>\n		</foreignObject>\n		<line class=\'zero-line\' d3-der=\'{x1: 0, x2: vm.width, y1: vm.Ver(0), y2: vm.Ver(0)}\' />\n		<line class=\'zero-line\' d3-der="{x1: vm.Hor(0), x2: vm.Hor(0), y1: vm.height, y2: 0}" />\n		<path ng-attr-d=\'{{vm.lineFun(vm.Data.target_data)}}\' class=\'fun target\' />\n		<g ng-class=\'{hide: !vm.Data.show}\' >\n			<line class=\'tri v\' d3-der=\'{x1: vm.Hor(0), x2: vm.Hor(vm.selected.v), y1: vm.Ver(vm.selected.dv), y2: vm.Ver(vm.selected.dv)}\'/>\n			<line class=\'tri dv\' d3-der=\'{x1: vm.Hor(vm.selected.v), x2: vm.Hor(vm.selected.v), y1: vm.Ver(0), y2: vm.Ver(vm.selected.dv)}\'/>\n			<path d3-der=\'{d:vm.lineFun(vm.Data.target_data)}\' class=\'fun correct\' ng-class=\'{hide: !vm.Data.correct}\' />\n		</g>\n		<g ng-repeat=\'dot in vm.dots track by dot.id\' shifter=\'[vm.Hor(dot.v),vm.Ver(dot.dv)]\' dot-b-der=dot></g>\n		<foreignObject width=\'70\' height=\'30\' y=\'0\' shifter=\'[vm.Hor(1.7), vm.Ver(-1.2)]\'>\n				<text class=\'tri-label\' >$v\'=-.8v$</text>\n		</foreignObject>\n	</g>\n</svg>';

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



},{"../../helpers":30,"./designData":15,"angular":undefined,"d3":undefined}],12:[function(require,module,exports){
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



},{"../../helpers":30,"./designData":15,"angular":undefined,"d3":undefined}],13:[function(require,module,exports){
var Cart, Ctrl, Data, _, d3, der, min, template,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

_ = require('lodash');

d3 = require('d3');

min = Math.min;

require('../../helpers');

Cart = require('./fakeCart');

Data = require('./designData');

template = '<svg ng-init=\'vm.resize()\' width=\'100%\' class=\'cartChart\' ng-attr-height=\'{{::vm.svgHeight}}\'>\n	<defs>\n		<clippath id=\'dCartA\'>\n			<rect d3-der=\'{width: vm.width, height: vm.height}\' />\n		</clippath>\n	</defs>\n	<g class=\'boilerplate\' shifter=\'{{::[vm.mar.left, vm.mar.top]}}\' >\n		<rect d3-der=\'{width: vm.width, height: vm.height}\' class=\'background\'/>\n		<g hor-axis-der height=\'vm.height\' scale=\'vm.X\' fun=\'vm.axisFun\' shifter=\'[0,vm.height]\'></g>\n		<foreignObject width=\'30\' height=\'30\' y=\'20\' shifter=\'[vm.width/2, vm.height]\'>\n				<text class=\'label\' >$x$</text>\n		</foreignObject>\n	</g>\n	<g shifter=\'{{::[vm.mar.left, vm.mar.top]}}\'  clip-path="url(#dCartA)" >\n		<g class=\'g-cart\' ng-repeat=\'t in vm.sample\' d3-der=\'{transform: "translate(" + vm.X(vm.Cart.loc(t)) + ",0)"}\' style=\'opacity:.3;\'>\n			<line class=\'time-line\' d3-der=\'{x1: 0, x2: 0, y1: 0, y2: 60}\' />\n		</g>\n		<g class=\'g-cart\' cart-object-der left=\'vm.X(vm.Cart.x)\' shifter=\'[0,vm.height]\' size=\'vm.size\'></g>\n	</g>\n</svg>';

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
    this.scope.$watch(function() {
      return Data.maxX;
    }, (function(_this) {
      return function(v) {
        return _this.X.domain([-.1, v]);
      };
    })(this));
    this.sample = _.range(0, 6, .5);
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

  Ctrl.property('size', {
    get: function() {
      return (this.X(0.4) - this.X(0)) / 80;
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



},{"../../helpers":30,"./designData":15,"./fakeCart":18,"d3":undefined,"lodash":undefined}],14:[function(require,module,exports){
var Cart, Ctrl, Data, _, d3, der, min, template,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

_ = require('lodash');

d3 = require('d3');

min = Math.min;

require('../../helpers');

Cart = require('./trueCart');

Data = require('./designData');

template = '<svg ng-init=\'vm.resize()\' width=\'100%\' class=\'cartChart\' ng-attr-height=\'{{::vm.svgHeight}}\'>\n	<defs>\n		<clippath id=\'dCartB\'>\n			<rect d3-der=\'{width: vm.width, height: vm.height}\' />\n		</clippath>\n	</defs>\n	<g class=\'boilerplate\' shifter=\'{{::[vm.mar.left, vm.mar.top]}}\' >\n		<rect d3-der=\'{width: vm.width, height: vm.height}\' class=\'background\'/>\n		<g hor-axis-der height=\'vm.height\' scale=\'vm.X\' fun=\'vm.axisFun\' shifter=\'[0,vm.height]\'></g>\n		<foreignObject width=\'30\' height=\'30\' y=\'20\' shifter=\'[vm.width/2, vm.height]\'>\n				<text class=\'label\' >$x$</text>\n		</foreignObject>\n	</g>\n	<g shifter=\'{{::[vm.mar.left, vm.mar.top]}}\' clip-path="url(#dCartB)">\n		<g class=\'g-cart\' ng-repeat=\'t in vm.sample\' d3-der=\'{transform: "translate(" + vm.X(vm.Cart.loc(t)) + ",0)"}\' style=\'opacity:.3;\'>\n			<line class=\'time-line\' d3-der=\'{x1: 0, x2: 0, y1: 0, y2: 60}\' />\n		</g>\n		<g class=\'g-cart\' cart-object-der left=\'vm.X(vm.Cart.x)\' shifter=\'[0,vm.height]\' size=\'vm.size\'></g>\n	</g>\n</svg>';

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
    this.sample = _.range(0, 6, .5);
    this.scope.$watch(function() {
      return Data.maxX;
    }, (function(_this) {
      return function(v) {
        return _this.X.domain([-.1, v]);
      };
    })(this));
    this.Cart = Cart;
    this.axisFun = d3.svg.axis().scale(this.X).ticks(5).orient('bottom');
    this.tran = function(tran) {
      return tran.ease('linear').duration(30);
    };
    angular.element(this.window).on('resize', this.resize);
  }

  Ctrl.property('size', {
    get: function() {
      return (this.X(0.4) - this.X(0)) / 80;
    }
  });

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



},{"../../helpers":30,"./designData":15,"./trueCart":19,"d3":undefined,"lodash":undefined}],15:[function(require,module,exports){
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

  Data.property('maxX', {
    get: function() {
      var a, dt, dv, i, ref, ref1, t;
      t = 4.5;
      i = _.findLastIndex(this.dots, function(d) {
        return d.t <= t;
      });
      a = this.dots[i];
      dt = t - a.t;
      dv = (ref = (ref1 = this.dots[i + 1]) != null ? ref1.dv : void 0) != null ? ref : 0;
      return a.x + a.v * dt + 0.5 * dv * Math.pow(dt, 2);
    }
  });

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



},{"../../helpers":30,"../cart/cartData":3,"d3":undefined,"lodash":undefined}],16:[function(require,module,exports){
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



},{"../../helpers":30,"./designData":15,"lodash":undefined}],20:[function(require,module,exports){
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



},{"../../helpers":30,"angular":undefined,"d3":undefined,"lodash":undefined}],21:[function(require,module,exports){
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
var der, template;

template = '<defs>\n	<clippath ng-attr-id=\'{{::vm.name}}\'>\n		<rect ng-attr-width=\'{{vm.width}}\' ng-attr-height=\'{{vm.height}}\' />\n	</clippath>\n</defs>\n<g class=\'boilerplate\' shifter=\'{{::[vm.mar.left, vm.mar.top]}}\'>\n	<rect class=\'background\' ng-attr-width=\'{{vm.width}}\' ng-attr-height=\'{{vm.height}}\' />\n	<g ver-axis-der width=\'vm.width\' scale=\'vm.ver\' fun=\'vm.verAxFun\'></g>\n	<g hor-axis-der height=\'vm.height\' scale=\'vm.hor\' fun=\'vm.horAxFun\' shifter=\'[0,vm.height]\'></g>\n</g>';

der = function() {
  var directive;
  return directive = {
    controller: [
      '$scope', function(scope) {
        this.scope = scope;
      }
    ],
    controllerAs: 'vm',
    bindToController: true,
    scope: {
      width: '=',
      height: '=',
      verAxFun: '=',
      horAxFun: '=',
      mar: '=',
      ver: '=',
      hor: '=',
      name: '='
    },
    template: template,
    templateNamespace: 'svg'
  };
};

module.exports = der;



},{}],23:[function(require,module,exports){
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



},{"angular":undefined,"d3":undefined}],24:[function(require,module,exports){
module.exports = function($parse) {
  return function(scope, el, attr) {
    return d3.select(el[0]).datum($parse(attr.datum)(scope));
  };
};



},{}],25:[function(require,module,exports){
var Ctrl,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

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
    this.Ver = d3.scale.linear();
    this.Hor = d3.scale.linear();
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
  }

  Ctrl.property('svg_height', {
    get: function() {
      return this.height + this.mar.top + this.mar.bottom;
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

module.exports = Ctrl;



},{}],26:[function(require,module,exports){
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



},{"d3":undefined}],27:[function(require,module,exports){
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



},{"angular":undefined,"d3":undefined,"textures":undefined}],28:[function(require,module,exports){
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
      return scope.$watchCollection(['scale.domain()', 'scale.range()', 'height'], update, true);
    }
  };
};

module.exports = der;



},{"angular":undefined,"d3":undefined}],29:[function(require,module,exports){
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
      return scope.$watchCollection(['scale.domain()', 'scale.range()', 'width'], update, true);
    }
  };
};

module.exports = der;



},{"angular":undefined,"d3":undefined}],30:[function(require,module,exports){
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvbGV3aXMvUmVzZWFyY2gvZGlmZkVRX25ldy9hcHAvYXBwLmNvZmZlZSIsIi9Vc2Vycy9sZXdpcy9SZXNlYXJjaC9kaWZmRVFfbmV3L2FwcC9jb21wb25lbnRzL2NhcnQvY2FydEJ1dHRvbnMuY29mZmVlIiwiL1VzZXJzL2xld2lzL1Jlc2VhcmNoL2RpZmZFUV9uZXcvYXBwL2NvbXBvbmVudHMvY2FydC9jYXJ0RGF0YS5jb2ZmZWUiLCIvVXNlcnMvbGV3aXMvUmVzZWFyY2gvZGlmZkVRX25ldy9hcHAvY29tcG9uZW50cy9jYXJ0L2NhcnRPYmplY3QuY29mZmVlIiwiL1VzZXJzL2xld2lzL1Jlc2VhcmNoL2RpZmZFUV9uZXcvYXBwL2NvbXBvbmVudHMvY2FydC9jYXJ0UGxvdC5jb2ZmZWUiLCIvVXNlcnMvbGV3aXMvUmVzZWFyY2gvZGlmZkVRX25ldy9hcHAvY29tcG9uZW50cy9jYXJ0L2NhcnRTaW0uY29mZmVlIiwiL1VzZXJzL2xld2lzL1Jlc2VhcmNoL2RpZmZFUV9uZXcvYXBwL2NvbXBvbmVudHMvZGVyaXZhdGl2ZS9kZXJpdmF0aXZlQS5jb2ZmZWUiLCIvVXNlcnMvbGV3aXMvUmVzZWFyY2gvZGlmZkVRX25ldy9hcHAvY29tcG9uZW50cy9kZXJpdmF0aXZlL2Rlcml2YXRpdmVCLmNvZmZlZSIsIi9Vc2Vycy9sZXdpcy9SZXNlYXJjaC9kaWZmRVFfbmV3L2FwcC9jb21wb25lbnRzL2Rlcml2YXRpdmUvZGVyaXZhdGl2ZURhdGEuY29mZmVlIiwiL1VzZXJzL2xld2lzL1Jlc2VhcmNoL2RpZmZFUV9uZXcvYXBwL2NvbXBvbmVudHMvZGVzaWduL2Rlc2lnbkEuY29mZmVlIiwiL1VzZXJzL2xld2lzL1Jlc2VhcmNoL2RpZmZFUV9uZXcvYXBwL2NvbXBvbmVudHMvZGVzaWduL2Rlc2lnbkIuY29mZmVlIiwiL1VzZXJzL2xld2lzL1Jlc2VhcmNoL2RpZmZFUV9uZXcvYXBwL2NvbXBvbmVudHMvZGVzaWduL2Rlc2lnbkJ1dHRvbnMuY29mZmVlIiwiL1VzZXJzL2xld2lzL1Jlc2VhcmNoL2RpZmZFUV9uZXcvYXBwL2NvbXBvbmVudHMvZGVzaWduL2Rlc2lnbkNhcnRBLmNvZmZlZSIsIi9Vc2Vycy9sZXdpcy9SZXNlYXJjaC9kaWZmRVFfbmV3L2FwcC9jb21wb25lbnRzL2Rlc2lnbi9kZXNpZ25DYXJ0Qi5jb2ZmZWUiLCIvVXNlcnMvbGV3aXMvUmVzZWFyY2gvZGlmZkVRX25ldy9hcHAvY29tcG9uZW50cy9kZXNpZ24vZGVzaWduRGF0YS5jb2ZmZWUiLCIvVXNlcnMvbGV3aXMvUmVzZWFyY2gvZGlmZkVRX25ldy9hcHAvY29tcG9uZW50cy9kZXNpZ24vZG90QS5jb2ZmZWUiLCIvVXNlcnMvbGV3aXMvUmVzZWFyY2gvZGlmZkVRX25ldy9hcHAvY29tcG9uZW50cy9kZXNpZ24vZG90Qi5jb2ZmZWUiLCIvVXNlcnMvbGV3aXMvUmVzZWFyY2gvZGlmZkVRX25ldy9hcHAvY29tcG9uZW50cy9kZXNpZ24vZmFrZUNhcnQuY29mZmVlIiwiL1VzZXJzL2xld2lzL1Jlc2VhcmNoL2RpZmZFUV9uZXcvYXBwL2NvbXBvbmVudHMvZGVzaWduL3RydWVDYXJ0LmNvZmZlZSIsIi9Vc2Vycy9sZXdpcy9SZXNlYXJjaC9kaWZmRVFfbmV3L2FwcC9jb21wb25lbnRzL3JlZ3VsYXIvcmVndWxhci5jb2ZmZWUiLCIvVXNlcnMvbGV3aXMvUmVzZWFyY2gvZGlmZkVRX25ldy9hcHAvZGlyZWN0aXZlcy9iZWhhdmlvci5jb2ZmZWUiLCIvVXNlcnMvbGV3aXMvUmVzZWFyY2gvZGlmZkVRX25ldy9hcHAvZGlyZWN0aXZlcy9ib2lsZXJwbGF0ZS5jb2ZmZWUiLCIvVXNlcnMvbGV3aXMvUmVzZWFyY2gvZGlmZkVRX25ldy9hcHAvZGlyZWN0aXZlcy9kM0Rlci5jb2ZmZWUiLCIvVXNlcnMvbGV3aXMvUmVzZWFyY2gvZGlmZkVRX25ldy9hcHAvZGlyZWN0aXZlcy9kYXR1bS5jb2ZmZWUiLCIvVXNlcnMvbGV3aXMvUmVzZWFyY2gvZGlmZkVRX25ldy9hcHAvZGlyZWN0aXZlcy9wbG90Q3RybC5jb2ZmZWUiLCIvVXNlcnMvbGV3aXMvUmVzZWFyY2gvZGlmZkVRX25ldy9hcHAvZGlyZWN0aXZlcy9zaGlmdGVyLmNvZmZlZSIsIi9Vc2Vycy9sZXdpcy9SZXNlYXJjaC9kaWZmRVFfbmV3L2FwcC9kaXJlY3RpdmVzL3RleHR1cmUuY29mZmVlIiwiL1VzZXJzL2xld2lzL1Jlc2VhcmNoL2RpZmZFUV9uZXcvYXBwL2RpcmVjdGl2ZXMveEF4aXMuY29mZmVlIiwiL1VzZXJzL2xld2lzL1Jlc2VhcmNoL2RpZmZFUV9uZXcvYXBwL2RpcmVjdGl2ZXMveUF4aXMuY29mZmVlIiwiL1VzZXJzL2xld2lzL1Jlc2VhcmNoL2RpZmZFUV9uZXcvYXBwL2hlbHBlcnMuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUEsWUFBQSxDQUFBO0FBQUEsSUFBQSx3QkFBQTs7QUFBQSxPQUNBLEdBQVUsT0FBQSxDQUFRLFNBQVIsQ0FEVixDQUFBOztBQUFBLEVBRUEsR0FBSyxPQUFBLENBQVEsSUFBUixDQUZMLENBQUE7O0FBQUEsR0FHQSxHQUFNLE9BQU8sQ0FBQyxNQUFSLENBQWUsU0FBZixFQUEwQixDQUFDLE9BQUEsQ0FBUSxrQkFBUixDQUFELENBQTFCLENBQ0wsQ0FBQyxTQURJLENBQ00sWUFETixFQUNvQixPQUFBLENBQVEsb0JBQVIsQ0FEcEIsQ0FFTCxDQUFDLFNBRkksQ0FFTSxZQUZOLEVBRW9CLE9BQUEsQ0FBUSxvQkFBUixDQUZwQixDQUdMLENBQUMsU0FISSxDQUdNLFlBSE4sRUFHb0IsT0FBQSxDQUFRLDJCQUFSLENBSHBCLENBSUwsQ0FBQyxTQUpJLENBSU0sZUFKTixFQUl1QixPQUFBLENBQVEsOEJBQVIsQ0FKdkIsQ0FLTCxDQUFDLFNBTEksQ0FLTSxnQkFMTixFQUt3QixPQUFBLENBQVEsK0JBQVIsQ0FMeEIsQ0FNTCxDQUFDLFNBTkksQ0FNTSxTQU5OLEVBTWtC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Ozs7O0FDQUEsWUFBQSxDQUFBO0FBQUEsTUFFTSxDQUFDLE9BQU8sQ0FBQyxPQUFmLEdBQXlCLFNBQUMsR0FBRCxFQUFNLElBQU4sR0FBQTtTQUN2QixFQUFFLENBQUMsS0FBSCxDQUFTLENBQUEsU0FBQSxLQUFBLEdBQUE7V0FBQSxTQUFBLEdBQUE7QUFDUixNQUFBLEdBQUEsQ0FBQSxDQUFBLENBQUE7YUFDQSxLQUZRO0lBQUEsRUFBQTtFQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBVCxFQUdDLElBSEQsRUFEdUI7QUFBQSxDQUZ6QixDQUFBOztBQUFBLFFBU1EsQ0FBQSxTQUFFLENBQUEsUUFBVixHQUFxQixTQUFDLElBQUQsRUFBTyxJQUFQLEdBQUE7U0FDbkIsTUFBTSxDQUFDLGNBQVAsQ0FBc0IsSUFBQyxDQUFBLFNBQXZCLEVBQWtDLElBQWxDLEVBQXdDLElBQXhDLEVBRG1CO0FBQUEsQ0FUckIsQ0FBQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIndXNlIHN0cmljdCdcbmFuZ3VsYXIgPSByZXF1aXJlICdhbmd1bGFyJ1xuZDMgPSByZXF1aXJlICdkMydcbmFwcCA9IGFuZ3VsYXIubW9kdWxlICdtYWluQXBwJywgW3JlcXVpcmUgJ2FuZ3VsYXItbWF0ZXJpYWwnXVxuXHQuZGlyZWN0aXZlICdob3JBeGlzRGVyJywgcmVxdWlyZSAnLi9kaXJlY3RpdmVzL3hBeGlzJ1xuXHQuZGlyZWN0aXZlICd2ZXJBeGlzRGVyJywgcmVxdWlyZSAnLi9kaXJlY3RpdmVzL3lBeGlzJ1xuXHQuZGlyZWN0aXZlICdjYXJ0U2ltRGVyJywgcmVxdWlyZSAnLi9jb21wb25lbnRzL2NhcnQvY2FydFNpbSdcblx0LmRpcmVjdGl2ZSAnY2FydE9iamVjdERlcicsIHJlcXVpcmUgJy4vY29tcG9uZW50cy9jYXJ0L2NhcnRPYmplY3QnXG5cdC5kaXJlY3RpdmUgJ2NhcnRCdXR0b25zRGVyJywgcmVxdWlyZSAnLi9jb21wb25lbnRzL2NhcnQvY2FydEJ1dHRvbnMnXG5cdC5kaXJlY3RpdmUgJ3NoaWZ0ZXInICwgcmVxdWlyZSAnLi9kaXJlY3RpdmVzL3NoaWZ0ZXInXG5cdC5kaXJlY3RpdmUgJ2Rlc2lnbkFEZXInLCByZXF1aXJlICcuL2NvbXBvbmVudHMvZGVzaWduL2Rlc2lnbkEnXG5cdC5kaXJlY3RpdmUgJ2JlaGF2aW9yJywgcmVxdWlyZSAnLi9kaXJlY3RpdmVzL2JlaGF2aW9yJ1xuXHQuZGlyZWN0aXZlICdkb3RBRGVyJywgcmVxdWlyZSAnLi9jb21wb25lbnRzL2Rlc2lnbi9kb3RBJ1xuXHQuZGlyZWN0aXZlICdkb3RCRGVyJywgcmVxdWlyZSAnLi9jb21wb25lbnRzL2Rlc2lnbi9kb3RCJ1xuXHQuZGlyZWN0aXZlICdkYXR1bScsIHJlcXVpcmUgJy4vZGlyZWN0aXZlcy9kYXR1bSdcblx0LmRpcmVjdGl2ZSAnZDNEZXInLCByZXF1aXJlICcuL2RpcmVjdGl2ZXMvZDNEZXInXG5cdC5kaXJlY3RpdmUgJ2Rlc2lnbkJEZXInICwgcmVxdWlyZSAnLi9jb21wb25lbnRzL2Rlc2lnbi9kZXNpZ25CJ1xuXHQuZGlyZWN0aXZlICdyZWd1bGFyRGVyJywgcmVxdWlyZSAnLi9jb21wb25lbnRzL3JlZ3VsYXIvcmVndWxhcidcblx0LmRpcmVjdGl2ZSAnZGVyaXZhdGl2ZUFEZXInLCByZXF1aXJlICcuL2NvbXBvbmVudHMvZGVyaXZhdGl2ZS9kZXJpdmF0aXZlQSdcblx0LmRpcmVjdGl2ZSAnZGVyaXZhdGl2ZUJEZXInLCByZXF1aXJlICcuL2NvbXBvbmVudHMvZGVyaXZhdGl2ZS9kZXJpdmF0aXZlQidcblx0LmRpcmVjdGl2ZSAnY2FydFBsb3REZXInLCByZXF1aXJlICcuL2NvbXBvbmVudHMvY2FydC9jYXJ0UGxvdCdcblx0LmRpcmVjdGl2ZSAnZGVzaWduQ2FydEFEZXInLCByZXF1aXJlICcuL2NvbXBvbmVudHMvZGVzaWduL2Rlc2lnbkNhcnRBJ1xuXHQuZGlyZWN0aXZlICdkZXNpZ25DYXJ0QkRlcicsIHJlcXVpcmUgJy4vY29tcG9uZW50cy9kZXNpZ24vZGVzaWduQ2FydEInXG5cdC5kaXJlY3RpdmUgJ3RleHR1cmVEZXInLCByZXF1aXJlICcuL2RpcmVjdGl2ZXMvdGV4dHVyZSdcblx0LmRpcmVjdGl2ZSAnZGVzaWduQnV0dG9uc0RlcicsIHJlcXVpcmUgJy4vY29tcG9uZW50cy9kZXNpZ24vZGVzaWduQnV0dG9ucydcblx0LmRpcmVjdGl2ZSAnYm9pbGVycGxhdGVEZXInLCByZXF1aXJlICcuL2RpcmVjdGl2ZXMvYm9pbGVycGxhdGUnXG5cbmxvb3BlciA9IC0+XG4gICAgc2V0VGltZW91dCggKCktPlxuICAgIFx0XHRcdGQzLnNlbGVjdEFsbCAnY2lyY2xlLmRvdC5sYXJnZSdcbiAgICBcdFx0XHRcdC50cmFuc2l0aW9uICdncm93J1xuICAgIFx0XHRcdFx0LmR1cmF0aW9uIDUwMFxuICAgIFx0XHRcdFx0LmVhc2UgJ2N1YmljLW91dCdcbiAgICBcdFx0XHRcdC5hdHRyICd0cmFuc2Zvcm0nLCAnc2NhbGUoIDEuMzQpJ1xuICAgIFx0XHRcdFx0LnRyYW5zaXRpb24gJ3NocmluaydcbiAgICBcdFx0XHRcdC5kdXJhdGlvbiA1MDBcbiAgICBcdFx0XHRcdC5lYXNlICdjdWJpYy1vdXQnXG4gICAgXHRcdFx0XHQuYXR0ciAndHJhbnNmb3JtJywgJ3NjYWxlKCAxLjApJ1xuICAgIFx0XHRcdGxvb3BlcigpXG4gICAgXHRcdCwgMTAwMClcblxubG9vcGVyKClcbiIsIl8gPSByZXF1aXJlICdsb2Rhc2gnXG57ZXhwLCBzcXJ0LCBhdGFufSA9IE1hdGhcbkNhcnQgPSByZXF1aXJlICcuL2NhcnREYXRhJ1xuXG50ZW1wbGF0ZSA9ICcnJ1xuXHQ8bWQtYnV0dG9uIGNsYXNzPSdteUJ1dHRvbicgbmctY2xpY2s9J3ZtLmNsaWNrKCknIG5nLWluaXQ9J3ZtLnBsYXkoKSc+e3t2bS5wYXVzZWQgPyAnUExBWScgOiAnUEFVU0UnfX0gPC9tZC1idXR0b24+XG4nJydcblxuY2xhc3MgQ3RybFxuXHRjb25zdHJ1Y3RvcjogKEBzY29wZSktPlxuXG5cdGNsaWNrOiAtPlxuXHRcdGlmIEBwYXVzZWQgdGhlbiBAcGxheSgpIGVsc2UgQHBhdXNlKClcblxuXHRwbGF5OiAtPlxuXHRcdEBwYXVzZWQgPSB0cnVlXG5cdFx0ZDMudGltZXIuZmx1c2goKVxuXHRcdEBwYXVzZWQgPSBmYWxzZVxuXHRcdGxhc3QgPSAwXG5cdFx0ZDMudGltZXIgKGVsYXBzZWQpPT5cblx0XHRcdFx0ZHQgPSBlbGFwc2VkIC0gbGFzdFxuXHRcdFx0XHRDYXJ0LmluY3JlbWVudCBkdC8xMDAwXG5cdFx0XHRcdGxhc3QgPSBlbGFwc2VkXG5cdFx0XHRcdGlmIENhcnQudCA+IDRcblx0XHRcdFx0XHRDYXJ0LnNldF90IDBcblx0XHRcdFx0QHNjb3BlLiRldmFsQXN5bmMoKVxuXHRcdFx0XHRAcGF1c2VkXG5cdFx0XHQsIDFcblxuXHRwYXVzZTogLT5cblx0XHRAcGF1c2VkID0gdHJ1ZVxuXG5kZXIgPSAoKS0+XG5cdGRpcmVjdGl2ZSA9IFxuXHRcdGNvbnRyb2xsZXJBczogJ3ZtJ1xuXHRcdHNjb3BlOiB7fVxuXHRcdGNvbnRyb2xsZXI6IFsnJHNjb3BlJywgQ3RybF1cblx0XHR0ZW1wbGF0ZTogdGVtcGxhdGVcblxubW9kdWxlLmV4cG9ydHMgPSBkZXIiLCJfID0gcmVxdWlyZSAnbG9kYXNoJ1xue2V4cH0gPSBNYXRoXG5cbmNsYXNzIENhcnRcblx0Y29uc3RydWN0b3I6IChAb3B0aW9ucyktPlxuXHRcdHtAdjAsIEBrfSA9IEBvcHRpb25zXG5cdFx0QHJlc3RhcnQoKVxuXHRyZXN0YXJ0OiAtPlxuXHRcdEB0ID0gQHggPSAwXG5cdFx0QHRyYWplY3RvcnkgPSBfLnJhbmdlIDAgLCA2ICwgMS81MFxuXHRcdFx0Lm1hcCAodCk9PlxuXHRcdFx0XHR2ID0gQHYwICogZXhwKC1AayAqIHQpXG5cdFx0XHRcdHJlcyA9IFxuXHRcdFx0XHRcdHY6IHZcblx0XHRcdFx0XHR4OiBAdjAvQGsgKiAoMS1leHAoLUBrKnQpKVxuXHRcdFx0XHRcdGR2OiAtQGsqdlxuXHRcdFx0XHRcdHQ6IHRcblx0XHRAbW92ZSAwXG5cdFx0QHBhdXNlZCA9IHRydWVcblx0c2V0X3Q6ICh0KS0+XG5cdFx0QHQgPSB0XG5cdFx0QG1vdmUgdFxuXHRpbmNyZW1lbnQ6IChkdCktPlxuXHRcdEB0Kz1kdFxuXHRcdEBtb3ZlIEB0XG5cdG1vdmU6ICh0KS0+XG5cdFx0QHYgPSBAdjAgKiBleHAoIC1AayAqIHQpXG5cdFx0QHggPSBAdjAvQGsgKiAoMS1leHAoLUBrKnQpKVxuXHRcdEBkdiA9IC1AaypAdlxuXG5tb2R1bGUuZXhwb3J0cyA9IG5ldyBDYXJ0IHt2MDogMiwgazogLjh9IiwiXG5jbGFzcyBDdHJsXG5cdGNvbnN0cnVjdG9yOihAc2NvcGUpLT5cblxuXHR0cmFuczogKHRyYW4pLT5cblx0XHR0cmFuXG5cdFx0XHQuZHVyYXRpb24gMzBcblx0XHRcdC5lYXNlICdsaW5lYXInXG5cbmRlciA9ICgpLT5cblx0ZGlyZWN0aXZlID0gXG5cdFx0c2NvcGU6IFxuXHRcdFx0c2l6ZTogJz0nXG5cdFx0XHRsZWZ0OiAnPSdcblx0XHRjb250cm9sbGVyQXM6ICd2bSdcblx0XHR0ZW1wbGF0ZU5hbWVzcGFjZTogJ3N2Zydcblx0XHRjb250cm9sbGVyOiBbJyRzY29wZScsQ3RybF1cblx0XHR0ZW1wbGF0ZVVybDogJy4vYXBwL2NvbXBvbmVudHMvY2FydC9jYXJ0LnN2Zydcblx0XHRiaW5kVG9Db250cm9sbGVyOiB0cnVlXG5cdFx0cmVzdHJpY3Q6ICdBJ1xuXG5tb2R1bGUuZXhwb3J0cyA9IGRlciIsImFuZ3VsYXIgPSByZXF1aXJlICdhbmd1bGFyJ1xuZDMgPSByZXF1aXJlICdkMydcbnJlcXVpcmUgJy4uLy4uL2hlbHBlcnMnXG5fID0gcmVxdWlyZSAnbG9kYXNoJ1xuQ2FydCA9IHJlcXVpcmUgJy4vY2FydERhdGEnXG50ZW1wbGF0ZSA9ICcnJ1xuXHQ8c3ZnIG5nLWluaXQ9J3ZtLnJlc2l6ZSgpJyB3aWR0aD0nMTAwJScgY2xhc3M9J3RvcENoYXJ0Jz5cblx0XHQ8ZGVmcz5cblx0XHRcdDxjbGlwcGF0aCBpZD0nY2FydFBsb3QnPlxuXHRcdFx0XHQ8cmVjdCBkMy1kZXI9J3t3aWR0aDogdm0ud2lkdGgsIGhlaWdodDogdm0uaGVpZ2h0fScgLz5cblx0XHRcdDwvY2xpcHBhdGg+XG5cdFx0PC9kZWZzPlxuXHRcdDxnIGNsYXNzPSdib2lsZXJwbGF0ZScgc2hpZnRlcj0nW3ZtLm1hci5sZWZ0LCB2bS5tYXIudG9wXSc+XG5cdFx0XHQ8cmVjdCBjbGFzcz0nYmFja2dyb3VuZCcgZDMtZGVyPSd7d2lkdGg6IHZtLndpZHRoLCBoZWlnaHQ6IHZtLmhlaWdodH0nIC8+XG5cdFx0XHQ8ZyB2ZXItYXhpcy1kZXIgd2lkdGg9J3ZtLndpZHRoJyBzY2FsZT0ndm0uVicgZnVuPSd2bS52ZXJBeEZ1bic+PC9nPlxuXHRcdFx0PGcgaG9yLWF4aXMtZGVyIGhlaWdodD0ndm0uaGVpZ2h0JyBzY2FsZT0ndm0uVCcgZnVuPSd2bS5ob3JBeEZ1bicgc2hpZnRlcj0nWzAsdm0uaGVpZ2h0XSc+PC9nPlxuXHRcdFx0PGZvcmVpZ25PYmplY3Qgd2lkdGg9JzMwJyBoZWlnaHQ9JzMwJyB5PScxNycgc2hpZnRlcj0nW3ZtLndpZHRoLzIsIHZtLmhlaWdodF0nPlxuXHRcdFx0XHQ8dGV4dCBjbGFzcz0nbGFiZWwnID4kdCQ8L3RleHQ+XG5cdFx0XHQ8L2ZvcmVpZ25PYmplY3Q+XG5cdFx0XHQ8Zm9yZWlnbk9iamVjdCB3aWR0aD0nMzAnIGhlaWdodD0nMzAnIHNoaWZ0ZXI9J1stMzEsIHZtLmhlaWdodC8yLThdJz5cblx0XHRcdFx0XHQ8dGV4dCBjbGFzcz0nbGFiZWwnID4kdiQ8L3RleHQ+XG5cdFx0XHQ8L2ZvcmVpZ25PYmplY3Q+XG5cdFx0XHQ8bGluZSBjbGFzcz0nemVyby1saW5lJyBkMy1kZXI9XCJ7eDE6IDAgLCB4Mjogdm0ud2lkdGgsIHkxOiB2bS5WKDApLCB5Mjogdm0uVigwKX1cIiAvPiBcblx0XHRcdDxsaW5lIGNsYXNzPSd6ZXJvLWxpbmUnIGQzLWRlcj1cInt4MTogdm0uVCgwKSAsIHgyOiB2bS5UKDApLCB5MTogMCwgeTI6IHZtLmhlaWdodH1cIiAvPiBcblx0XHQ8L2c+XG5cdFx0PGcgY2xhc3M9J21haW4nIGNsaXAtcGF0aD1cInVybCgjY2FydFBsb3QpXCIgc2hpZnRlcj0nW3ZtLm1hci5sZWZ0LCB2bS5tYXIudG9wXSc+XG5cdFx0XHQ8Zm9yZWlnbk9iamVjdCB3aWR0aD0nMzAnIGhlaWdodD0nMzAnIHNoaWZ0ZXI9J1sodm0uVCh2bS5wb2ludC50KSAtIDE2KSwgdm0uc3RoaW5nXScgc3R5bGU9J2ZvbnQtc2l6ZTogMTNweDsgZm9udC13ZWlnaHQ6IDEwMDsnPlxuXHRcdFx0XHRcdDx0ZXh0IGNsYXNzPSdsYWJlbCcgZm9udC1zaXplPScxM3B4Jz4kdiQ8L3RleHQ+XG5cdFx0XHQ8L2ZvcmVpZ25PYmplY3Q+XG5cdFx0XHQ8bGluZSBjbGFzcz0ndHJpIHYnIGQzLWRlcj0ne3gxOiB2bS5UKHZtLnBvaW50LnQpLTEsIHgyOiB2bS5UKHZtLnBvaW50LnQpLTEsIHkxOiB2bS5WKDApLCB5Mjogdm0uVih2bS5wb2ludC52KX0nLz5cblx0XHRcdDxwYXRoIG5nLWF0dHItZD0ne3t2bS5saW5lRnVuKHZtLnRyYWplY3RvcnkpfX0nIGNsYXNzPSdmdW4gdicgLz5cblx0XHRcdDxjaXJjbGUgcj0nM3B4JyBzaGlmdGVyPSdbdm0uVCh2bS5wb2ludC50KSwgdm0uVih2bS5wb2ludC52KV0nIGNsYXNzPSdwb2ludCB2Jy8+XG5cdFx0XHQ8Zm9yZWlnbk9iamVjdCB3aWR0aD0nNzAnIGhlaWdodD0nMzAnIHNoaWZ0ZXI9J1t2bS5UKDQpLCB2bS5WKC40KV0nPlxuXHRcdFx0XHRcdDx0ZXh0IGNsYXNzPSd0cmktbGFiZWwnID4kMmVeey0uOHR9JDwvdGV4dD5cblx0XHRcdDwvZm9yZWlnbk9iamVjdD5cblx0XHQ8L2c+XG5cdDwvc3ZnPlxuJycnXG5cbmNsYXNzIEN0cmxcblx0Y29uc3RydWN0b3I6IChAc2NvcGUsIEBlbCwgQHdpbmRvdyktPlxuXHRcdEBtYXIgPSBcblx0XHRcdGxlZnQ6IDMwXG5cdFx0XHR0b3A6IDEwXG5cdFx0XHRyaWdodDogMTBcblx0XHRcdGJvdHRvbTogNDBcblxuXHRcdEBWID0gZDMuc2NhbGUubGluZWFyKCkuZG9tYWluIFstLjEsMi41XVxuXHRcdEBUID0gZDMuc2NhbGUubGluZWFyKCkuZG9tYWluIFstLjEsNV1cblxuXHRcdEBwb2ludCA9IENhcnRcblx0XHRAdHJhamVjdG9yeSA9IENhcnQudHJhamVjdG9yeVxuXG5cdFx0QGhvckF4RnVuID0gZDMuc3ZnLmF4aXMoKVxuXHRcdFx0LnNjYWxlIEBUXG5cdFx0XHQudGlja3MgNVxuXHRcdFx0Lm9yaWVudCAnYm90dG9tJ1xuXG5cdFx0QHZlckF4RnVuID0gZDMuc3ZnLmF4aXMoKVxuXHRcdFx0LnNjYWxlIEBWXG5cdFx0XHQudGlja3MgNVxuXHRcdFx0Lm9yaWVudCAnbGVmdCdcblx0XHRcblx0XHRAbGluZUZ1biA9IGQzLnN2Zy5saW5lKClcblx0XHRcdC55IChkKT0+IEBWIGQudlxuXHRcdFx0LnggKGQpPT4gQFQgZC50XG5cblx0XHRhbmd1bGFyLmVsZW1lbnQgQHdpbmRvd1xuXHRcdFx0Lm9uICdyZXNpemUnLCBAcmVzaXplXG5cblx0XHRAbW92ZSA9IChldmVudCkgPT5cblx0XHRcdGlmIG5vdCBDYXJ0LnBhdXNlZCB0aGVuIHJldHVyblxuXHRcdFx0cmVjdCA9IGV2ZW50LnRhcmdldC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKVxuXHRcdFx0dCA9IEBULmludmVydCBldmVudC54IC0gcmVjdC5sZWZ0XG5cdFx0XHR0ID0gTWF0aC5tYXggMCAsIHRcblx0XHRcdENhcnQuc2V0X3QgdFxuXHRcdFx0QHNjb3BlLiRldmFsQXN5bmMoKVxuXG5cdEBwcm9wZXJ0eSAnc3RoaW5nJywgZ2V0Oi0+XG5cdFx0QFYoQHBvaW50LnYvMikgLSA3XG5cblx0QHByb3BlcnR5ICdzdmdfaGVpZ2h0JywgZ2V0OiAtPiBAaGVpZ2h0ICsgQG1hci50b3AgKyBAbWFyLmJvdHRvbVxuXG5cdHJlc2l6ZTogKCk9PlxuXHRcdEB3aWR0aCA9IEBlbFswXS5jbGllbnRXaWR0aCAtIEBtYXIubGVmdCAtIEBtYXIucmlnaHRcblx0XHRAaGVpZ2h0ID0gQGVsWzBdLmNsaWVudEhlaWdodCAtIEBtYXIubGVmdCAtIEBtYXIucmlnaHRcblx0XHRAVi5yYW5nZSBbQGhlaWdodCwgMF1cblx0XHRAVC5yYW5nZSBbMCwgQHdpZHRoXVxuXHRcdEBzY29wZS4kZXZhbEFzeW5jKClcblxuZGVyID0gKCktPlxuXHRkaXJlY3RpdmUgPSBcblx0XHRjb250cm9sbGVyQXM6ICd2bSdcblx0XHRzY29wZToge31cblx0XHR0ZW1wbGF0ZTogdGVtcGxhdGVcblx0XHR0ZW1wbGF0ZU5hbWVzcGFjZTogJ3N2Zydcblx0XHRjb250cm9sbGVyOiBbJyRzY29wZScsJyRlbGVtZW50JywgJyR3aW5kb3cnLCBDdHJsXVxuXG5tb2R1bGUuZXhwb3J0cyA9IGRlclxuIiwiXyA9IHJlcXVpcmUgJ2xvZGFzaCdcbmQzPSByZXF1aXJlICdkMydcbnttaW59ID0gTWF0aFxuQ2FydCA9IHJlcXVpcmUgJy4vY2FydERhdGEnXG5yZXF1aXJlICcuLi8uLi9oZWxwZXJzJ1xuXG50ZW1wbGF0ZSA9ICcnJ1xuXHQ8c3ZnIG5nLWluaXQ9J3ZtLnJlc2l6ZSgpJyB3aWR0aD0nMTAwJScgbmctYXR0ci1oZWlnaHQ9XCJ7e3ZtLnN2Z0hlaWdodH19XCI+XG5cdFx0PGRlZnM+XG5cdFx0XHQ8Y2xpcHBhdGggaWQ9J2NhcnRTaW0nPlxuXHRcdFx0XHQ8cmVjdCBkMy1kZXI9J3t3aWR0aDogdm0ud2lkdGgsIGhlaWdodDogdm0uaGVpZ2h0fScgLz5cblx0XHRcdDwvY2xpcHBhdGg+XG5cdFx0PC9kZWZzPlxuXHRcdDxnIGNsYXNzPSdib2lsZXJwbGF0ZScgc2hpZnRlcj0ne3s6Olt2bS5tYXIubGVmdCwgdm0ubWFyLnRvcF19fScgPlxuXHRcdFx0PHJlY3QgZDMtZGVyPSd7d2lkdGg6IHZtLndpZHRoLCBoZWlnaHQ6IHZtLmhlaWdodH0nIGNsYXNzPSdiYWNrZ3JvdW5kJy8+XG5cdFx0XHQ8ZyBob3ItYXhpcy1kZXIgaGVpZ2h0PSd2bS5oZWlnaHQnIHNjYWxlPSd2bS5YJyBmdW49J3ZtLmF4aXNGdW4nIHNoaWZ0ZXI9J1swLHZtLmhlaWdodF0nPjwvZz5cblx0XHRcdDxmb3JlaWduT2JqZWN0IHdpZHRoPSczMCcgaGVpZ2h0PSczMCcgeT0nMjAnIHNoaWZ0ZXI9J1t2bS53aWR0aC8yLCB2bS5oZWlnaHRdJz5cblx0XHRcdFx0XHQ8dGV4dCBjbGFzcz0nbGFiZWwnID4keCQ8L3RleHQ+XG5cdFx0XHQ8L2ZvcmVpZ25PYmplY3Q+XG5cdFx0PC9nPlxuXHRcdDxnIHNoaWZ0ZXI9J3t7Ojpbdm0ubWFyLmxlZnQsIHZtLm1hci50b3BdfX0nIGNsaXAtcGF0aD1cInVybCgjY2FydFNpbSlcIiA+XG5cdFx0XHQ8Zm9yZWlnbk9iamVjdCB3aWR0aD0nMzAnIGhlaWdodD0nMzAnIHk9JzIwJyBzaGlmdGVyPSdbdm0ud2lkdGgvMiwgdm0uaGVpZ2h0XSc+XG5cdFx0XHRcdFx0PHRleHQgY2xhc3M9J2xhYmVsJyA+JHQkPC90ZXh0PlxuXHRcdFx0PC9mb3JlaWduT2JqZWN0PlxuXHRcdFx0PGcgY2xhc3M9J2ctY2FydCcgY2FydC1vYmplY3QtZGVyIGxlZnQ9J3ZtLlgodm0uQ2FydC54KScgc2hpZnRlcj0nWzAsdm0uaGVpZ2h0XScgc2l6ZT0ndm0uc2l6ZSc+PC9nPlxuXHRcdDwvZz5cblx0PC9zdmc+XG4nJydcblxuY2xhc3MgQ3RybFxuXHRjb25zdHJ1Y3RvcjogKEBzY29wZSwgQGVsLCBAd2luZG93KS0+XG5cdFx0QENhcnQgPSBDYXJ0XG5cdFx0QG1hciA9IFxuXHRcdFx0bGVmdDogMzBcblx0XHRcdHJpZ2h0OiAxMFxuXHRcdFx0dG9wOiAxMFxuXHRcdFx0Ym90dG9tOiAxOFxuXG5cdFx0QFggPSBkMy5zY2FsZS5saW5lYXIoKS5kb21haW4gWy0uMSwzXSBcblxuXHRcdEBheGlzRnVuID0gZDMuc3ZnLmF4aXMoKVxuXHRcdFx0LnNjYWxlIEBYXG5cdFx0XHQudGlja3MgNVxuXHRcdFx0Lm9yaWVudCAnYm90dG9tJ1xuXG5cdFx0YW5ndWxhci5lbGVtZW50IEB3aW5kb3dcblx0XHRcdC5vbiAncmVzaXplJyAsICgpPT5AcmVzaXplKClcblxuXHR0cmFuOiAodHJhbiktPlxuXHRcdHRyYW4uZWFzZSAnbGluZWFyJ1xuXHRcdFx0LmR1cmF0aW9uIDYwXG5cblx0QHByb3BlcnR5ICdzdmdIZWlnaHQnLCBnZXQ6LT4gQGhlaWdodCArIEBtYXIudG9wK0BtYXIuYm90dG9tXG5cblx0QHByb3BlcnR5ICdzaXplJywgZ2V0OiAtPiAoQFgoIDAuNCkgLSBAWCgwKSkvODBcblxuXHRyZXNpemU6ICgpPT5cblx0XHRAd2lkdGggPSBAZWxbMF0uY2xpZW50V2lkdGggLSBAbWFyLmxlZnQgLSBAbWFyLnJpZ2h0XG5cdFx0QGhlaWdodCA9IDYwXG5cdFx0QFgucmFuZ2UoWzAsIEB3aWR0aF0pXG5cdFx0QHNjb3BlLiRldmFsQXN5bmMoKVxuXG5kZXIgPSAoKS0+XG5cdGRpcmVjdGl2ZSA9IFxuXHRcdHRlbXBsYXRlOiB0ZW1wbGF0ZVxuXHRcdHNjb3BlOiB7fVxuXHRcdHJlc3RyaWN0OiAnQSdcblx0XHRiaW5kVG9Db250cm9sbGVyOiB0cnVlXG5cdFx0dGVtcGxhdGVOYW1lc3BhY2U6ICdzdmcnXG5cdFx0Y29udHJvbGxlcjogWyckc2NvcGUnLCAnJGVsZW1lbnQnLCAnJHdpbmRvdycsIEN0cmxdXG5cdFx0Y29udHJvbGxlckFzOiAndm0nXG5cbm1vZHVsZS5leHBvcnRzID0gZGVyXG4iLCJhbmd1bGFyID0gcmVxdWlyZSAnYW5ndWxhcidcbmQzID0gcmVxdWlyZSAnZDMnXG5yZXF1aXJlICcuLi8uLi9oZWxwZXJzJ1xuXyA9IHJlcXVpcmUgJ2xvZGFzaCdcbkRhdGEgPSByZXF1aXJlICcuL2Rlcml2YXRpdmVEYXRhJ1xuUGxvdEN0cmwgPSByZXF1aXJlICcuLi8uLi9kaXJlY3RpdmVzL3Bsb3RDdHJsJ1xuXG50ZW1wbGF0ZSA9ICcnJ1xuXHQ8c3ZnIG5nLWluaXQ9J3ZtLnJlc2l6ZSgpJyBjbGFzcz0ndG9wQ2hhcnQnPlxuXHRcdDxnIGJvaWxlcnBsYXRlLWRlciB3aWR0aD0ndm0ud2lkdGgnIGhlaWdodD0ndm0uaGVpZ2h0JyB2ZXItYXgtZnVuPSd2bS52ZXJBeEZ1bicgaG9yLWF4LWZ1bj0ndm0uaG9yQXhGdW4nIHZlcj0ndm0uVmVyJyBob3I9J3ZtLkhvcicgbWFyPSd2bS5tYXInIG5hbWU9J3ZtLm5hbWUnPjwvZz5cblx0XHQ8ZyBjbGFzcz0nbWFpbicgbmctYXR0ci1jbGlwLXBhdGg9J3VybCgje3t2bS5uYW1lfX0pJyBzaGlmdGVyPSdbdm0ubWFyLmxlZnQsIHZtLm1hci50b3BdJz5cblx0XHRcdDxmb3JlaWduT2JqZWN0IHdpZHRoPSczMCcgaGVpZ2h0PSczMCcgeT0nMjAnIHNoaWZ0ZXI9J1t2bS53aWR0aC8yLCB2bS5oZWlnaHRdJz5cblx0XHRcdFx0XHQ8dGV4dCBjbGFzcz0nbGFiZWwnID4kdCQ8L3RleHQ+XG5cdFx0XHQ8L2ZvcmVpZ25PYmplY3Q+XG5cdFx0XHQ8bGluZSBjbGFzcz0nemVyby1saW5lIGhvcicgZDMtZGVyPSd7eDE6IDAsIHgyOiB2bS53aWR0aCwgeTE6IHZtLlZlcigwKSwgeTI6IHZtLlZlcigwKX0nLz5cblx0XHRcdDxwYXRoIG5nLWF0dHItZD0ne3t2bS5saW5lRnVuKHZtLmRhdGEpfX0nIGNsYXNzPSdmdW4gdicgLz5cblx0XHRcdDxwYXRoIG5nLWF0dHItZD0ne3t2bS50cmlhbmdsZURhdGF9fScgY2xhc3M9J3RyaScgLz5cblx0XHRcdDxsaW5lIGNsYXNzPSd0cmkgZHYnIGQzLWRlcj0ne3gxOiB2bS5Ib3Iodm0ucG9pbnQudCktMSwgeDI6IHZtLkhvcih2bS5wb2ludC50KS0xLCB5MTogdm0uVmVyKHZtLnBvaW50LnYpLCB5Mjogdm0uVmVyKCh2bS5wb2ludC52ICsgdm0ucG9pbnQuZHYpKX0nLz5cblx0XHRcdDxmb3JlaWduT2JqZWN0IHdpZHRoPSczMCcgaGVpZ2h0PSczMCcgc2hpZnRlcj0nWyh2bS5Ib3Iodm0ucG9pbnQudCkgLSAxNiksIHZtLnN0aGluZ10nPlxuXHRcdFx0XHRcdDx0ZXh0IGNsYXNzPSd0cmktbGFiZWwnID4kXFxcXGRvdHt5fSQ8L3RleHQ+XG5cdFx0XHQ8L2ZvcmVpZ25PYmplY3Q+XG5cdFx0XHQ8Zm9yZWlnbk9iamVjdCB3aWR0aD0nMTAwJyBoZWlnaHQ9JzMwJyBzaGlmdGVyPSdbdm0uSG9yKDEuNjUpLCB2bS5WZXIoMS4zOCldJz5cblx0XHRcdFx0PHRleHQgY2xhc3M9J3RyaS1sYWJlbCc+JFxcXFxzaW4odCkkPC90ZXh0PlxuXHRcdFx0PC9mb3JlaWduT2JqZWN0PlxuXHRcdFx0PGNpcmNsZSByPSczcHgnICBzaGlmdGVyPSdbdm0uSG9yKHZtLnBvaW50LnQpLCB2bS5WZXIodm0ucG9pbnQudildJyBjbGFzcz0ncG9pbnQgdicvPlxuXHRcdDwvZz5cblx0PC9zdmc+XG4nJydcblx0XHRcdFxuY2xhc3MgQ3RybFxuXHRjb25zdHJ1Y3RvcjogKEBzY29wZSwgQGVsLCBAd2luZG93KS0+XG5cdFx0QG1hciA9IFxuXHRcdFx0bGVmdDogMzBcblx0XHRcdHRvcDogMjBcblx0XHRcdHJpZ2h0OiAyMFxuXHRcdFx0Ym90dG9tOiAzNVxuXG5cdFx0QG5hbWUgPSAnZGVyQ2xpcCdcblxuXHRcdEBkYXRhID0gRGF0YS5kYXRhXG5cblx0XHRAaG9yQXhGdW4gPSBkMy5zdmcuYXhpcygpXG5cdFx0XHQuc2NhbGUgQEhvclxuXHRcdFx0LnRpY2tzIDVcblx0XHRcdC5vcmllbnQgJ2JvdHRvbSdcblxuXHRcdEB2ZXJBeEZ1biA9IGQzLnN2Zy5heGlzKClcblx0XHRcdC5zY2FsZSBAVmVyXG5cdFx0XHQudGlja0Zvcm1hdCAoZCktPlxuXHRcdFx0XHRpZiBNYXRoLmZsb29yKCBkICkgIT0gZCB0aGVuIHJldHVyblxuXHRcdFx0XHRkXG5cdFx0XHQudGlja3MgNVxuXHRcdFx0Lm9yaWVudCAnbGVmdCdcblxuXHRcdEBsaW5lRnVuID0gZDMuc3ZnLmxpbmUoKVxuXHRcdFx0LnkgKGQpPT4gQFZlciBkLnZcblx0XHRcdC54IChkKT0+IEBIb3IgZC50XG5cblx0XHRhbmd1bGFyLmVsZW1lbnQgQHdpbmRvd1xuXHRcdFx0Lm9uICdyZXNpemUnLCBAcmVzaXplXG5cblx0XHRAbW92ZSA9IChldmVudCkgPT5cblx0XHRcdHQgPSBASG9yLmludmVydCBldmVudC54IC0gZXZlbnQudGFyZ2V0LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLmxlZnRcblx0XHRcdERhdGEubW92ZSB0XG5cdFx0XHRAc2NvcGUuJGV2YWxBc3luYygpXG5cblx0QHByb3BlcnR5ICdzdmdfaGVpZ2h0JywgZ2V0OiAtPiBAaGVpZ2h0ICsgQG1hci50b3AgKyBAbWFyLmJvdHRvbVxuXG5cdEBwcm9wZXJ0eSAnc3RoaW5nJywgZ2V0Oi0+XG5cdFx0QFZlcihAcG9pbnQuZHYvMiArIEBwb2ludC52KSAtIDdcblxuXHRAcHJvcGVydHkgJ3BvaW50JywgZ2V0Oi0+XG5cdFx0RGF0YS5wb2ludFxuXG5cdEBwcm9wZXJ0eSAndHJpYW5nbGVEYXRhJywgZ2V0Oi0+XG5cdFx0QGxpbmVGdW4gW3t2OiBAcG9pbnQudiwgdDogQHBvaW50LnR9LCB7djpAcG9pbnQuZHYgKyBAcG9pbnQudiwgdDogQHBvaW50LnQrMX0sIHt2OiBAcG9pbnQuZHYgKyBAcG9pbnQudiwgdDogQHBvaW50LnR9XVxuXG5cdFZlcjogZDMuc2NhbGUubGluZWFyKCkuZG9tYWluIFstMS41LDEuNV1cblx0SG9yOiBkMy5zY2FsZS5saW5lYXIoKS5kb21haW4gWzAsNl1cblxuXHRyZXNpemU6ID0+XG5cdFx0QHdpZHRoID0gQGVsWzBdLmNsaWVudFdpZHRoIC0gQG1hci5sZWZ0IC0gQG1hci5yaWdodFxuXHRcdEBoZWlnaHQgPSBAZWxbMF0uY2xpZW50SGVpZ2h0IC0gQG1hci50b3AgLSBAbWFyLmJvdHRvbSAtIDhcblx0XHRAVmVyLnJhbmdlIFtAaGVpZ2h0LCAwXVxuXHRcdEBIb3IucmFuZ2UgWzAsIEB3aWR0aF1cblx0XHRAc2NvcGUuJGV2YWxBc3luYygpXG5cbmRlciA9ICgpLT5cblx0ZGlyZWN0aXZlID0gXG5cdFx0Y29udHJvbGxlckFzOiAndm0nXG5cdFx0c2NvcGU6IHt9XG5cdFx0dGVtcGxhdGU6IHRlbXBsYXRlXG5cdFx0dGVtcGxhdGVOYW1lc3BhY2U6ICdzdmcnXG5cdFx0Y29udHJvbGxlcjogWyckc2NvcGUnLCckZWxlbWVudCcsICckd2luZG93JywgQ3RybF1cblxubW9kdWxlLmV4cG9ydHMgPSBkZXJcbiIsImFuZ3VsYXIgPSByZXF1aXJlICdhbmd1bGFyJ1xuZDMgPSByZXF1aXJlICdkMydcbnJlcXVpcmUgJy4uLy4uL2hlbHBlcnMnXG5fID0gcmVxdWlyZSAnbG9kYXNoJ1xuRGF0YSA9IHJlcXVpcmUgJy4vZGVyaXZhdGl2ZURhdGEnXG5cbnRlbXBsYXRlID0gJycnXG5cdDxzdmcgbmctaW5pdD0ndm0ucmVzaXplKCknIGNsYXNzPSd0b3BDaGFydCc+XG5cdFx0PGcgYm9pbGVycGxhdGUtZGVyIHdpZHRoPSd2bS53aWR0aCcgaGVpZ2h0PSd2bS5oZWlnaHQnIHZlci1heC1mdW49J3ZtLnZlckF4RnVuJyBob3ItYXgtZnVuPSd2bS5ob3JBeEZ1bicgdmVyPSd2bS5WZXInIGhvcj0ndm0uSG9yJyBtYXI9J3ZtLm1hcicgbmFtZT0ndm0ubmFtZSc+PC9nPlxuXHRcdDxnIGNsYXNzPSdtYWluJyBuZy1hdHRyLWNsaXAtcGF0aD1cInVybCgje3t2bS5uYW1lfX0pXCIgc2hpZnRlcj0nW3ZtLm1hci5sZWZ0LCB2bS5tYXIudG9wXSc+XG5cdFx0XHQ8Zm9yZWlnbk9iamVjdCB3aWR0aD0nMzAnIGhlaWdodD0nMzAnIHk9JzIwJyBzaGlmdGVyPSdbdm0ud2lkdGgvMiwgdm0uaGVpZ2h0XSc+XG5cdFx0XHRcdFx0PHRleHQgY2xhc3M9J2xhYmVsJyA+JHQkPC90ZXh0PlxuXHRcdFx0PC9mb3JlaWduT2JqZWN0PlxuXHRcdFx0PGxpbmUgY2xhc3M9J3plcm8tbGluZSBob3InIGQzLWRlcj0ne3gxOiAwLCB4Mjogdm0ud2lkdGgsIHkxOiB2bS5WZXIoMCksIHkyOiB2bS5WZXIoMCl9Jy8+XG5cdFx0XHQ8cGF0aCBkMy1kZXI9J3tkOnZtLmxpbmVGdW4odm0uZGF0YSl9JyBjbGFzcz0nZnVuIGR2JyAvPlxuXHRcdFx0PGxpbmUgY2xhc3M9J3RyaSBkdicgZDMtZGVyPSd7eDE6IHZtLkhvcih2bS5wb2ludC50KSwgeDI6IHZtLkhvcih2bS5wb2ludC50KSwgeTE6IHZtLlZlcigwKSwgeTI6IHZtLlZlcih2bS5wb2ludC5kdil9Jy8+XG5cdFx0XHQ8Zm9yZWlnbk9iamVjdCB3aWR0aD0nMzAnIGhlaWdodD0nMzAnIHNoaWZ0ZXI9J1sodm0uSG9yKHZtLnBvaW50LnQpIC0gMTYpLCB2bS5WZXIodm0ucG9pbnQuZHYqLjUpLTZdJz5cblx0XHRcdFx0XHQ8dGV4dCBjbGFzcz0ndHJpLWxhYmVsJz4kXFxcXGRvdHt5fSQ8L3RleHQ+XG5cdFx0XHQ8L2ZvcmVpZ25PYmplY3Q+XG5cdFx0XHQ8Zm9yZWlnbk9iamVjdCB3aWR0aD0nMTAwJyBoZWlnaHQ9JzMwJyBzaGlmdGVyPSdbdm0uSG9yKC45KSwgdm0uVmVyKDEpXSc+XG5cdFx0XHRcdDx0ZXh0IGNsYXNzPSd0cmktbGFiZWwnPiRcXFxcY29zKHQpJDwvdGV4dD5cblx0XHRcdDwvZm9yZWlnbk9iamVjdD5cblx0XHRcdDxjaXJjbGUgcj0nNHB4JyAgc2hpZnRlcj0nW3ZtLkhvcih2bS5wb2ludC50KSwgdm0uVmVyKHZtLnBvaW50LmR2KV0nIGNsYXNzPSdwb2ludCBkdicvPlxuXHRcdDwvZz5cblx0PC9zdmc+XG4nJydcblx0XHRcdFxuY2xhc3MgQ3RybFxuXHRjb25zdHJ1Y3RvcjogKEBzY29wZSwgQGVsLCBAd2luZG93KS0+XG5cdFx0QG1hciA9IFxuXHRcdFx0bGVmdDogMzBcblx0XHRcdHRvcDogMjBcblx0XHRcdHJpZ2h0OiAyMFxuXHRcdFx0Ym90dG9tOiA0MFxuXG5cdFx0QFZlciA9IGQzLnNjYWxlLmxpbmVhcigpLmRvbWFpbiBbLTEuNSwxLjVdXG5cdFx0QEhvciA9IGQzLnNjYWxlLmxpbmVhcigpLmRvbWFpbiBbMCw2XVxuXG5cdFx0QG5hbWUgPSAnZGVyaXZhdGl2ZUInXG5cblx0XHRAZGF0YSA9IERhdGEuZGF0YVxuXG5cdFx0QGhvckF4RnVuID0gZDMuc3ZnLmF4aXMoKVxuXHRcdFx0LnNjYWxlIEBIb3Jcblx0XHRcdC50aWNrcyA1XG5cdFx0XHQub3JpZW50ICdib3R0b20nXG5cblx0XHRAdmVyQXhGdW4gPSBkMy5zdmcuYXhpcygpXG5cdFx0XHQuc2NhbGUgQFZlclxuXHRcdFx0LnRpY2tGb3JtYXQgKGQpLT5cblx0XHRcdFx0aWYgTWF0aC5mbG9vciggZCApICE9IGQgdGhlbiByZXR1cm5cblx0XHRcdFx0ZFxuXHRcdFx0LnRpY2tzIDVcblx0XHRcdC5vcmllbnQgJ2xlZnQnXG5cblx0XHRAbGluZUZ1biA9IGQzLnN2Zy5saW5lKClcblx0XHRcdC55IChkKT0+IEBWZXIgZC5kdlxuXHRcdFx0LnggKGQpPT4gQEhvciBkLnRcblxuXHRcdGFuZ3VsYXIuZWxlbWVudCBAd2luZG93XG5cdFx0XHQub24gJ3Jlc2l6ZScsIEByZXNpemVcblxuXHRcdEBtb3ZlID0gKGV2ZW50KSA9PlxuXHRcdFx0dCA9IEBIb3IuaW52ZXJ0IGV2ZW50LnggLSBldmVudC50YXJnZXQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkubGVmdFxuXHRcdFx0RGF0YS5tb3ZlIHRcblx0XHRcdEBzY29wZS4kZXZhbEFzeW5jKClcblxuXHRAcHJvcGVydHkgJ3N2Z19oZWlnaHQnLCBnZXQ6IC0+IEBoZWlnaHQgKyBAbWFyLnRvcCArIEBtYXIuYm90dG9tXG5cblx0QHByb3BlcnR5ICdwb2ludCcsIGdldDotPlxuXHRcdERhdGEucG9pbnRcblxuXHRyZXNpemU6ICgpPT5cblx0XHRAd2lkdGggPSBAZWxbMF0uY2xpZW50V2lkdGggLSBAbWFyLmxlZnQgLSBAbWFyLnJpZ2h0XG5cdFx0QGhlaWdodCA9IEBlbFswXS5jbGllbnRIZWlnaHQgLSBAbWFyLnRvcCAtIEBtYXIuYm90dG9tXG5cdFx0QFZlci5yYW5nZSBbQGhlaWdodCwgMF1cblx0XHRASG9yLnJhbmdlIFswLCBAd2lkdGhdXG5cdFx0QHNjb3BlLiRldmFsQXN5bmMoKVxuXG5kZXIgPSAoKS0+XG5cdGRpcmVjdGl2ZSA9IFxuXHRcdGNvbnRyb2xsZXJBczogJ3ZtJ1xuXHRcdHNjb3BlOiB7fVxuXHRcdHRlbXBsYXRlOiB0ZW1wbGF0ZVxuXHRcdHRlbXBsYXRlTmFtZXNwYWNlOiAnc3ZnJ1xuXHRcdGNvbnRyb2xsZXI6IFsnJHNjb3BlJywnJGVsZW1lbnQnLCAnJHdpbmRvdycsIEN0cmxdXG5cbm1vZHVsZS5leHBvcnRzID0gZGVyXG4iLCJfID0gcmVxdWlyZSAnbG9kYXNoJ1xudkZ1biA9IE1hdGguc2luXG5kdkZ1biA9IE1hdGguY29zXG5yZXF1aXJlICcuLi8uLi9oZWxwZXJzJ1xuXG5kMyA9IHJlcXVpcmUgJ2QzJ1xuXG4jIGNsYXNzIEN0cmxcbiMgXHRjb25zdHJ1Y3RvcjogKEBzY29wZSktPlxuXG4jIFx0Y2xpY2s6IC0+XG4jIFx0XHRpZiBAcGF1c2VkIHRoZW4gQHBsYXkoKSBlbHNlIEBwYXVzZSgpXG5cbiMgXHRwbGF5OiAtPlxuIyBcdFx0QHBhdXNlZCA9IHRydWVcbiMgXHRcdGQzLnRpbWVyLmZsdXNoKClcbiMgXHRcdEBwYXVzZWQgPSBmYWxzZVxuIyBcdFx0bGFzdCA9IDBcbiMgXHRcdGQzLnRpbWVyIChlbGFwc2VkKT0+XG4jIFx0XHRcdFx0ZHQgPSBlbGFwc2VkIC0gbGFzdFxuIyBcdFx0XHRcdERhdGEuaW5jcmVtZW50IGR0LzEwMDBcbiMgXHRcdFx0XHRsYXN0ID0gZWxhcHNlZFxuIyBcdFx0XHRcdGlmIERhdGEudCA+IDQuNVxuIyBcdFx0XHRcdFx0RGF0YS5zZXRfdCAwXG4jIFx0XHRcdFx0QHNjb3BlLiRldmFsQXN5bmMoKVxuIyBcdFx0XHRcdEBwYXVzZWRcbiMgXHRcdFx0LCAxXG5cbiMgXHRwYXVzZTogLT4gQHBhdXNlZCA9IHRydWVcblxuY2xhc3MgRGF0YVxuXHRjb25zdHJ1Y3RvcjogLT5cblx0XHRAZGF0YSA9IF8ucmFuZ2UgMCAsIDggLCAxLzUwXG5cdFx0XHQubWFwICh0KS0+XG5cdFx0XHRcdHJlcyA9IFxuXHRcdFx0XHRcdGR2OiBkdkZ1biB0XG5cdFx0XHRcdFx0djogdkZ1biB0XG5cdFx0XHRcdFx0dDogdFxuXG5cdFx0QHBvaW50ID0gXy5zYW1wbGUgQGRhdGFcblxuXHRtb3ZlOiAodCktPlxuXHRcdEBwb2ludCA9IFxuXHRcdFx0ZHY6IGR2RnVuIHRcblx0XHRcdHY6IHZGdW4gdFxuXHRcdFx0dDogdFxuXG5tb2R1bGUuZXhwb3J0cyA9IG5ldyBEYXRhIiwiYW5ndWxhciA9IHJlcXVpcmUgJ2FuZ3VsYXInXG5kMyA9IHJlcXVpcmUgJ2QzJ1xuRGF0YSA9IHJlcXVpcmUgJy4vZGVzaWduRGF0YSdcbnJlcXVpcmUgJy4uLy4uL2hlbHBlcnMnXG5GYWtlID0gcmVxdWlyZSAnLi9mYWtlQ2FydCdcblJlYWwgPSByZXF1aXJlICcuL3RydWVDYXJ0J1xuXG50ZW1wbGF0ZSA9ICcnJ1xuXHQ8c3ZnIG5nLWluaXQ9J3ZtLnJlc2l6ZSgpJyBjbGFzcz0nYm90dG9tQ2hhcnQnPlxuXHRcdDxnIGJvaWxlcnBsYXRlLWRlciB3aWR0aD0ndm0ud2lkdGgnIGhlaWdodD0ndm0uaGVpZ2h0JyB2ZXItYXgtZnVuPSd2bS52ZXJBeEZ1bicgaG9yLWF4LWZ1bj0ndm0uaG9yQXhGdW4nIHZlcj0ndm0uVmVyJyBob3I9J3ZtLkhvcicgbWFyPSd2bS5tYXInIG5hbWU9J1wiZGVzaWduQVwiJz48L2c+XG5cdFx0PGcgY2xhc3M9J21haW4nIGNsaXAtcGF0aD1cInVybCgjZGVzaWduQSlcIiBzaGlmdGVyPSdbdm0ubWFyLmxlZnQsIHZtLm1hci50b3BdJyA+XG5cdFx0XHQ8Zm9yZWlnbk9iamVjdCB3aWR0aD0nMzAnIGhlaWdodD0nMzAnIHNoaWZ0ZXI9J1stMzgsIHZtLmhlaWdodC8yXSc+XG5cdFx0XHRcdFx0PHRleHQgY2xhc3M9J2xhYmVsJz4kdiQ8L3RleHQ+XG5cdFx0XHQ8L2ZvcmVpZ25PYmplY3Q+XG5cdFx0XHQ8Zm9yZWlnbk9iamVjdCB3aWR0aD0nMzAnIGhlaWdodD0nMzAnIHk9JzIwJyBzaGlmdGVyPSdbdm0ud2lkdGgvMiwgdm0uaGVpZ2h0XSc+XG5cdFx0XHRcdFx0PHRleHQgY2xhc3M9J2xhYmVsJyA+JHQkPC90ZXh0PlxuXHRcdFx0PC9mb3JlaWduT2JqZWN0PlxuXHRcdFx0PGxpbmUgY2xhc3M9J3plcm8tbGluZScgZDMtZGVyPSd7eDE6IDAsIHgyOiB2bS53aWR0aCwgeTE6IHZtLlZlcigwKSwgeTI6IHZtLlZlcigwKX0nIC8+XG5cdFx0XHQ8bGluZSBjbGFzcz0nemVyby1saW5lJyBkMy1kZXI9XCJ7eDE6IHZtLkhvcigwKSwgeDI6IHZtLkhvcigwKSwgeTE6IHZtLmhlaWdodCwgeTI6IDB9XCIgLz5cblx0XHRcdDxnIG5nLWNsYXNzPSd7aGlkZTogIXZtLkRhdGEuc2hvd30nID5cblx0XHRcdFx0PGxpbmUgY2xhc3M9J3RyaSB2JyBkMy1kZXI9J3t4MTogdm0uSG9yKHZtLnNlbGVjdGVkLnQpLTEsIHgyOiB2bS5Ib3Iodm0uc2VsZWN0ZWQudCktMSwgeTE6IHZtLlZlcigwKSwgeTI6IHZtLlZlcih2bS5zZWxlY3RlZC52KX0nLz5cblx0XHRcdFx0PHBhdGggbmctYXR0ci1kPSd7e3ZtLnRyaWFuZ2xlRGF0YSgpfX0nIGNsYXNzPSd0cmknIC8+XG5cdFx0XHRcdDxsaW5lIGQzLWRlcj0ne3gxOiB2bS5Ib3Iodm0uc2VsZWN0ZWQudCkrMSwgeDI6IHZtLkhvcih2bS5zZWxlY3RlZC50KSsxLCB5MTogdm0uVmVyKHZtLnNlbGVjdGVkLnYpLCB5Mjogdm0uVmVyKHZtLnNlbGVjdGVkLnYgKyB2bS5zZWxlY3RlZC5kdil9JyBjbGFzcz0ndHJpIGR2JyAvPlxuXHRcdFx0PC9nPlxuXHRcdFx0PHBhdGggbmctYXR0ci1kPSd7e3ZtLmxpbmVGdW4odm0uRGF0YS5DYXJ0LnRyYWplY3RvcnkpfX0nIGNsYXNzPSdmdW4gdGFyZ2V0JyAvPlxuXHRcdFx0PHBhdGggbmctYXR0ci1kPSd7e3ZtLmxpbmVGdW4odm0uRGF0YS5kb3RzKX19JyBjbGFzcz0nZnVuIHYnIC8+XG5cdFx0XHQ8ZyBuZy1yZXBlYXQ9J2RvdCBpbiB2bS5kb3RzIHRyYWNrIGJ5IGRvdC5pZCcgZGF0dW09ZG90IHNoaWZ0ZXI9J1t2bS5Ib3IoZG90LnQpLHZtLlZlcihkb3QudildJyBiZWhhdmlvcj0ndm0uZHJhZycgZG90LWEtZGVyPWRvdCA+PC9nPlxuXHRcdFx0PGNpcmNsZSBjbGFzcz0nZG90IHNtYWxsJyByPSc0JyBzaGlmdGVyPSdbdm0uSG9yKHZtLkRhdGEuZmlyc3QudCksdm0uVmVyKHZtLkRhdGEuZmlyc3QudildJyAvPlxuXHRcdFx0PGZvcmVpZ25PYmplY3Qgd2lkdGg9JzcwJyBoZWlnaHQ9JzMwJyBzaGlmdGVyPSdbdm0uSG9yKDQpLCB2bS5WZXIoLjMzKV0nPlxuXHRcdFx0XHRcdDx0ZXh0IGNsYXNzPSd0cmktbGFiZWwnID4kMmVeey0uOHR9JDwvdGV4dD5cblx0XHRcdDwvZm9yZWlnbk9iamVjdD5cblx0XHRcdDxjaXJjbGUgcj0nNHB4JyAgc2hpZnRlcj0nW3ZtLkhvcih2bS5EYXRhLnQpLCB2bS5WZXIodm0uRmFrZS52KV0nIGNsYXNzPSdwb2ludCBmYWtlJy8+XG5cdFx0XHQ8Y2lyY2xlIHI9JzRweCcgIHNoaWZ0ZXI9J1t2bS5Ib3Iodm0uRGF0YS50KSwgdm0uVmVyKHZtLlJlYWwudildJyBjbGFzcz0ncG9pbnQgcmVhbCcvPlxuXHRcdDwvZz5cblx0PC9zdmc+XG4nJydcblxuY2xhc3MgQ3RybFxuXHRjb25zdHJ1Y3RvcjogKEBzY29wZSwgQGVsLCBAd2luZG93KS0+XG5cdFx0QG1hciA9IFxuXHRcdFx0bGVmdDogMzhcblx0XHRcdHRvcDogMFxuXHRcdFx0cmlnaHQ6IDEwXG5cdFx0XHRib3R0b206IDM3XG5cblx0XHRAVmVyID0gZDMuc2NhbGUubGluZWFyKCkuZG9tYWluIFstLjEsMi4xXVxuXG5cdFx0QEhvciA9IGQzLnNjYWxlLmxpbmVhcigpLmRvbWFpbiBbLS4xLDVdXG5cblx0XHRARGF0YSA9IERhdGFcblxuXHRcdEBGYWtlID0gRmFrZVxuXHRcdEBSZWFsID0gUmVhbFxuXG5cdFx0QGhvckF4RnVuID0gZDMuc3ZnLmF4aXMoKVxuXHRcdFx0LnNjYWxlIEBIb3Jcblx0XHRcdC50aWNrcyA1XG5cdFx0XHQub3JpZW50ICdib3R0b20nXG5cblx0XHRAdmVyQXhGdW4gPSBkMy5zdmcuYXhpcygpXG5cdFx0XHQuc2NhbGUgQFZlclxuXHRcdFx0LnRpY2tzIDVcblx0XHRcdC5vcmllbnQgJ2xlZnQnXG5cdFx0XG5cdFx0QGxpbmVGdW4gPSBkMy5zdmcubGluZSgpXG5cdFx0XHQueSAoZCk9PiBAVmVyIGQudlxuXHRcdFx0LnggKGQpPT4gQEhvciBkLnRcblxuXHRcdEBkcmFnX3JlY3QgPSBkMy5iZWhhdmlvci5kcmFnKClcblx0XHRcdC5vbiAnZHJhZ3N0YXJ0JywgKCk9PlxuXHRcdFx0XHRkMy5ldmVudC5zb3VyY2VFdmVudC5zdG9wUHJvcGFnYXRpb24oKVxuXHRcdFx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpXG5cdFx0XHRcdGlmIGV2ZW50LndoaWNoID09IDNcblx0XHRcdFx0XHRyZXR1cm4gXG5cdFx0XHRcdERhdGEuc2V0X3Nob3cgdHJ1ZVxuXHRcdFx0XHRyZWN0ID0gZXZlbnQudG9FbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpXG5cdFx0XHRcdHQgPSBASG9yLmludmVydCBldmVudC54IC0gcmVjdC5sZWZ0XG5cdFx0XHRcdHYgID0gQFZlci5pbnZlcnQgZXZlbnQueSAtIHJlY3QudG9wXG5cdFx0XHRcdERhdGEuYWRkX2RvdCB0ICwgdlxuXHRcdFx0XHRAc2NvcGUuJGV2YWxBc3luYygpXG5cdFx0XHQub24gJ2RyYWcnLCA9PiBAb25fZHJhZyBAc2VsZWN0ZWRcblx0XHRcdC5vbiAnZHJhZ2VuZCcsPT5cblx0XHRcdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKVxuXHRcdFx0XHREYXRhLnNldF9zaG93IHRydWVcblx0XHRcdFx0ZXZlbnQuc3RvcFByb3BhZ2F0aW9uKClcblxuXHRcdEBkcmFnID0gZDMuYmVoYXZpb3IuZHJhZygpXG5cdFx0XHQub24gJ2RyYWdzdGFydCcsIChkb3QpPT5cblx0XHRcdFx0ZDMuZXZlbnQuc291cmNlRXZlbnQuc3RvcFByb3BhZ2F0aW9uKClcblx0XHRcdFx0aWYgZXZlbnQud2hpY2ggPT0gM1xuXHRcdFx0XHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KClcblx0XHRcdFx0XHREYXRhLnJlbW92ZV9kb3QgZG90XG5cdFx0XHRcdFx0RGF0YS5zZXRfc2hvdyBmYWxzZVxuXHRcdFx0XHRcdEBzY29wZS4kZXZhbEFzeW5jKClcblx0XHRcdC5vbiAnZHJhZycsIEBvbl9kcmFnXG5cblxuXHRcdGFuZ3VsYXIuZWxlbWVudCBAd2luZG93XG5cdFx0XHQub24gJ3Jlc2l6ZScsIEByZXNpemVcblxuXHRAcHJvcGVydHkgJ2RvdHMnLCBnZXQ6LT4gXG5cdFx0RGF0YS5kb3RzLmZpbHRlciAoZCktPiAoZC5pZCAhPSdmaXJzdCcpIGFuZCAoZC5pZCAhPSdsYXN0JylcblxuXHRAcHJvcGVydHkgJ3NlbGVjdGVkJywgZ2V0Oi0+XG5cdFx0RGF0YS5zZWxlY3RlZFxuXG5cdG9uX2RyYWc6IChkb3QpPT4gXG5cdFx0XHQjIGlmIGV2ZW50LndoaWNoIGlzIDNcblx0XHRcdCMgXHRldmVudC5wcmV2ZW50RGVmYXVsdCgpXG5cdFx0XHQjIFx0cmV0dXJuXG5cdFx0XHREYXRhLnVwZGF0ZV9kb3QgZG90LCBASG9yLmludmVydChkMy5ldmVudC54KSwgQFZlci5pbnZlcnQoZDMuZXZlbnQueSlcblx0XHRcdEBzY29wZS4kZXZhbEFzeW5jKClcblxuXHR0cmlhbmdsZURhdGE6LT5cblx0XHRwb2ludCA9IEBzZWxlY3RlZFxuXHRcdEBsaW5lRnVuIFt7djogcG9pbnQudiwgdDogcG9pbnQudH0sIHt2OnBvaW50LmR2ICsgcG9pbnQudiwgdDogcG9pbnQudCsxfSwge3Y6IHBvaW50LmR2ICsgcG9pbnQudiwgdDogcG9pbnQudH1dXG5cblx0cmVzaXplOiAoKT0+XG5cdFx0QHdpZHRoID0gQGVsWzBdLmNsaWVudFdpZHRoIC0gQG1hci5sZWZ0IC0gQG1hci5yaWdodFxuXHRcdEBoZWlnaHQgPSBAZWxbMF0uY2xpZW50SGVpZ2h0IC0gQG1hci50b3AgLSBAbWFyLmJvdHRvbVxuXHRcdEBWZXIucmFuZ2UgW0BoZWlnaHQsIDBdXG5cdFx0QEhvci5yYW5nZSBbMCwgQHdpZHRoXVxuXHRcdEBzY29wZS4kZXZhbEFzeW5jKClcblxuZGVyID0gKCktPlxuXHRkaXJlY3RpdmUgPSBcblx0XHRjb250cm9sbGVyQXM6ICd2bSdcblx0XHRzY29wZToge31cblx0XHR0ZW1wbGF0ZTogdGVtcGxhdGVcblx0XHR0ZW1wbGF0ZU5hbWVzcGFjZTogJ3N2Zydcblx0XHRjb250cm9sbGVyOiBbJyRzY29wZScsJyRlbGVtZW50JywgJyR3aW5kb3cnLCBDdHJsXVxuXG5tb2R1bGUuZXhwb3J0cyA9IGRlclxuIiwiRGF0YSA9IHJlcXVpcmUgJy4vZGVzaWduRGF0YSdcbmFuZ3VsYXIgPSByZXF1aXJlICdhbmd1bGFyJ1xuZDMgPSByZXF1aXJlICdkMydcbnJlcXVpcmUgJy4uLy4uL2hlbHBlcnMnXG5cbnRlbXBsYXRlID0gJycnXG5cdDxzdmcgbmctaW5pdD0ndm0ucmVzaXplKCknICB3aWR0aD0nMTAwJScgY2xhc3M9J2JvdHRvbUNoYXJ0Jz5cblx0XHQ8ZyBib2lsZXJwbGF0ZS1kZXIgd2lkdGg9J3ZtLndpZHRoJyBoZWlnaHQ9J3ZtLmhlaWdodCcgdmVyLWF4LWZ1bj0ndm0udmVyQXhGdW4nIGhvci1heC1mdW49J3ZtLmhvckF4RnVuJyB2ZXI9J3ZtLlZlcicgaG9yPSd2bS5Ib3InIG1hcj0ndm0ubWFyJyBuYW1lPSdcImRlc2lnbkJcIic+PC9nPlxuXHRcdDxnIGNsYXNzPSdtYWluJyBjbGlwLXBhdGg9XCJ1cmwoI2Rlc2lnbkIpXCIgc2hpZnRlcj0nW3ZtLm1hci5sZWZ0LCB2bS5tYXIudG9wXSc+XG5cdFx0XHQ8Zm9yZWlnbk9iamVjdCB3aWR0aD0nMzAnIGhlaWdodD0nMzAnIHNoaWZ0ZXI9J1stMzgsIHZtLmhlaWdodC8yXSc+XG5cdFx0XHRcdFx0PHRleHQgY2xhc3M9J2xhYmVsJz4kXFxcXGRvdHt2fSQ8L3RleHQ+XG5cdFx0XHQ8L2ZvcmVpZ25PYmplY3Q+XG5cdFx0XHQ8Zm9yZWlnbk9iamVjdCB3aWR0aD0nMzAnIGhlaWdodD0nMzAnIHk9JzIwJyBzaGlmdGVyPSdbdm0ud2lkdGgvMiwgdm0uaGVpZ2h0XSc+XG5cdFx0XHRcdFx0PHRleHQgY2xhc3M9J2xhYmVsJz4kdiQ8L3RleHQ+XG5cdFx0XHQ8L2ZvcmVpZ25PYmplY3Q+XG5cdFx0XHQ8bGluZSBjbGFzcz0nemVyby1saW5lJyBkMy1kZXI9J3t4MTogMCwgeDI6IHZtLndpZHRoLCB5MTogdm0uVmVyKDApLCB5Mjogdm0uVmVyKDApfScgLz5cblx0XHRcdDxsaW5lIGNsYXNzPSd6ZXJvLWxpbmUnIGQzLWRlcj1cInt4MTogdm0uSG9yKDApLCB4Mjogdm0uSG9yKDApLCB5MTogdm0uaGVpZ2h0LCB5MjogMH1cIiAvPlxuXHRcdFx0PHBhdGggbmctYXR0ci1kPSd7e3ZtLmxpbmVGdW4odm0uRGF0YS50YXJnZXRfZGF0YSl9fScgY2xhc3M9J2Z1biB0YXJnZXQnIC8+XG5cdFx0XHQ8ZyBuZy1jbGFzcz0ne2hpZGU6ICF2bS5EYXRhLnNob3d9JyA+XG5cdFx0XHRcdDxsaW5lIGNsYXNzPSd0cmkgdicgZDMtZGVyPSd7eDE6IHZtLkhvcigwKSwgeDI6IHZtLkhvcih2bS5zZWxlY3RlZC52KSwgeTE6IHZtLlZlcih2bS5zZWxlY3RlZC5kdiksIHkyOiB2bS5WZXIodm0uc2VsZWN0ZWQuZHYpfScvPlxuXHRcdFx0XHQ8bGluZSBjbGFzcz0ndHJpIGR2JyBkMy1kZXI9J3t4MTogdm0uSG9yKHZtLnNlbGVjdGVkLnYpLCB4Mjogdm0uSG9yKHZtLnNlbGVjdGVkLnYpLCB5MTogdm0uVmVyKDApLCB5Mjogdm0uVmVyKHZtLnNlbGVjdGVkLmR2KX0nLz5cblx0XHRcdFx0PHBhdGggZDMtZGVyPSd7ZDp2bS5saW5lRnVuKHZtLkRhdGEudGFyZ2V0X2RhdGEpfScgY2xhc3M9J2Z1biBjb3JyZWN0JyBuZy1jbGFzcz0ne2hpZGU6ICF2bS5EYXRhLmNvcnJlY3R9JyAvPlxuXHRcdFx0PC9nPlxuXHRcdFx0PGcgbmctcmVwZWF0PSdkb3QgaW4gdm0uZG90cyB0cmFjayBieSBkb3QuaWQnIHNoaWZ0ZXI9J1t2bS5Ib3IoZG90LnYpLHZtLlZlcihkb3QuZHYpXScgZG90LWItZGVyPWRvdD48L2c+XG5cdFx0XHQ8Zm9yZWlnbk9iamVjdCB3aWR0aD0nNzAnIGhlaWdodD0nMzAnIHk9JzAnIHNoaWZ0ZXI9J1t2bS5Ib3IoMS43KSwgdm0uVmVyKC0xLjIpXSc+XG5cdFx0XHRcdFx0PHRleHQgY2xhc3M9J3RyaS1sYWJlbCcgPiR2Jz0tLjh2JDwvdGV4dD5cblx0XHRcdDwvZm9yZWlnbk9iamVjdD5cblx0XHQ8L2c+XG5cdDwvc3ZnPlxuJycnXG5cbmNsYXNzIEN0cmxcblx0Y29uc3RydWN0b3I6IChAc2NvcGUsIEBlbCwgQHdpbmRvdyktPlxuXHRcdEBtYXIgPSBcblx0XHRcdGxlZnQ6IDQwXG5cdFx0XHR0b3A6IDBcblx0XHRcdHJpZ2h0OiAxMFxuXHRcdFx0Ym90dG9tOiAzN1xuXG5cdFx0QFZlciA9IGQzLnNjYWxlLmxpbmVhcigpLmRvbWFpbiBbLTEuOSwgLjFdXG5cblx0XHRASG9yID0gZDMuc2NhbGUubGluZWFyKCkuZG9tYWluIFstLjEsMi4xNV1cblxuXHRcdEBob3JBeEZ1biA9IGQzLnN2Zy5heGlzKClcblx0XHRcdC5zY2FsZSBASG9yXG5cdFx0XHQudGlja3MgNVxuXHRcdFx0Lm9yaWVudCAnYm90dG9tJ1xuXG5cdFx0QHZlckF4RnVuID0gZDMuc3ZnLmF4aXMoKVxuXHRcdFx0LnNjYWxlIEBWZXJcblx0XHRcdC50aWNrcyA1XG5cdFx0XHQub3JpZW50ICdsZWZ0J1xuXG5cdFx0QERhdGEgPSBEYXRhXG5cblx0XHRAbGluZUZ1biA9IGQzLnN2Zy5saW5lKClcblx0XHRcdC55IChkKT0+IEBWZXIgZC5kdlxuXHRcdFx0LnggKGQpPT4gQEhvciBkLnZcblxuXHRcdGFuZ3VsYXIuZWxlbWVudCBAd2luZG93XG5cdFx0XHQub24gJ3Jlc2l6ZScsIEByZXNpemVcblxuXHRAcHJvcGVydHkgJ2RvdHMnLCBnZXQ6LT5cblx0XHREYXRhLmRvdHNcblx0XHRcdC5maWx0ZXIgKGQpLT4gKGQuaWQgIT0nZmlyc3QnKSBhbmQgKGQuaWQgIT0nbGFzdCcpXG5cblx0QHByb3BlcnR5ICdzZWxlY3RlZCcsIGdldDotPlxuXHRcdERhdGEuc2VsZWN0ZWRcblx0XHRcblx0cmVzaXplOiAoKT0+XG5cdFx0QHdpZHRoID0gQGVsWzBdLmNsaWVudFdpZHRoIC0gQG1hci5sZWZ0IC0gQG1hci5yaWdodFxuXHRcdEBoZWlnaHQgPSBAZWxbMF0uY2xpZW50SGVpZ2h0IC0gQG1hci50b3AgLSBAbWFyLmJvdHRvbVxuXHRcdEBWZXIucmFuZ2UgW0BoZWlnaHQsIDBdXG5cdFx0QEhvci5yYW5nZSBbMCwgQHdpZHRoXSBcblx0XHRAc2NvcGUuJGV2YWxBc3luYygpXG5cblxuZGVyID0gKCktPlxuXHRkaXJlY3RpdmUgPSBcblx0XHRjb250cm9sbGVyQXM6ICd2bSdcblx0XHRzY29wZToge31cblx0XHR0ZW1wbGF0ZTogdGVtcGxhdGVcblx0XHR0ZW1wbGF0ZU5hbWVzcGFjZTogJ3N2Zydcblx0XHRjb250cm9sbGVyOiBbJyRzY29wZScsJyRlbGVtZW50JywnJHdpbmRvdycsIEN0cmxdXG5cbm1vZHVsZS5leHBvcnRzID0gZGVyXG4iLCJhbmd1bGFyID0gcmVxdWlyZSAnYW5ndWxhcidcbmQzID0gcmVxdWlyZSAnZDMnXG5EYXRhID0gcmVxdWlyZSAnLi9kZXNpZ25EYXRhJ1xucmVxdWlyZSAnLi4vLi4vaGVscGVycydcbnRlbXBsYXRlID0gJycnXG5cdDxtZC1idXR0b24gY2xhc3M9J215QnV0dG9uJyBuZy1jbGljaz0ndm0uY2xpY2soKScgbmctaW5pdD0ndm0ucGxheSgpJz57e3ZtLnBhdXNlZCA/ICdQTEFZJyA6ICdQQVVTRSd9fTwvbWQtYnV0dG9uPlxuJycnXG5cbmNsYXNzIEN0cmxcblx0Y29uc3RydWN0b3I6IChAc2NvcGUpLT5cblxuXHRjbGljazogLT5cblx0XHRpZiBAcGF1c2VkIHRoZW4gQHBsYXkoKSBlbHNlIEBwYXVzZSgpXG5cblx0cGxheTogLT5cblx0XHRAcGF1c2VkID0gdHJ1ZVxuXHRcdGQzLnRpbWVyLmZsdXNoKClcblx0XHRAcGF1c2VkID0gZmFsc2Vcblx0XHRsYXN0ID0gMFxuXHRcdGQzLnRpbWVyIChlbGFwc2VkKT0+XG5cdFx0XHRcdGR0ID0gZWxhcHNlZCAtIGxhc3Rcblx0XHRcdFx0RGF0YS5pbmNyZW1lbnQgZHQvMTAwMFxuXHRcdFx0XHRsYXN0ID0gZWxhcHNlZFxuXHRcdFx0XHRpZiBEYXRhLnQgPiA0LjVcblx0XHRcdFx0XHREYXRhLnNldF90IDBcblx0XHRcdFx0QHNjb3BlLiRldmFsQXN5bmMoKVxuXHRcdFx0XHRAcGF1c2VkXG5cdFx0XHQsIDFcblxuXHRwYXVzZTogLT4gQHBhdXNlZCA9IHRydWVcblxuZGVyID0gKCktPlxuXHRkaXJlY3RpdmUgPSBcblx0XHRjb250cm9sbGVyQXM6ICd2bSdcblx0XHRzY29wZToge31cblx0XHR0ZW1wbGF0ZTogdGVtcGxhdGVcblx0XHR0ZW1wbGF0ZU5hbWVzcGFjZTogJ3N2Zydcblx0XHRjb250cm9sbGVyOiBbJyRzY29wZScsIEN0cmxdXG5cbm1vZHVsZS5leHBvcnRzID0gZGVyIiwiXyA9IHJlcXVpcmUgJ2xvZGFzaCdcbmQzPSByZXF1aXJlICdkMydcbnttaW59ID0gTWF0aFxucmVxdWlyZSAnLi4vLi4vaGVscGVycydcbkNhcnQgPSByZXF1aXJlICcuL2Zha2VDYXJ0J1xuRGF0YSA9IHJlcXVpcmUgJy4vZGVzaWduRGF0YSdcblxudGVtcGxhdGUgPSAnJydcblx0PHN2ZyBuZy1pbml0PSd2bS5yZXNpemUoKScgd2lkdGg9JzEwMCUnIGNsYXNzPSdjYXJ0Q2hhcnQnIG5nLWF0dHItaGVpZ2h0PSd7ezo6dm0uc3ZnSGVpZ2h0fX0nPlxuXHRcdDxkZWZzPlxuXHRcdFx0PGNsaXBwYXRoIGlkPSdkQ2FydEEnPlxuXHRcdFx0XHQ8cmVjdCBkMy1kZXI9J3t3aWR0aDogdm0ud2lkdGgsIGhlaWdodDogdm0uaGVpZ2h0fScgLz5cblx0XHRcdDwvY2xpcHBhdGg+XG5cdFx0PC9kZWZzPlxuXHRcdDxnIGNsYXNzPSdib2lsZXJwbGF0ZScgc2hpZnRlcj0ne3s6Olt2bS5tYXIubGVmdCwgdm0ubWFyLnRvcF19fScgPlxuXHRcdFx0PHJlY3QgZDMtZGVyPSd7d2lkdGg6IHZtLndpZHRoLCBoZWlnaHQ6IHZtLmhlaWdodH0nIGNsYXNzPSdiYWNrZ3JvdW5kJy8+XG5cdFx0XHQ8ZyBob3ItYXhpcy1kZXIgaGVpZ2h0PSd2bS5oZWlnaHQnIHNjYWxlPSd2bS5YJyBmdW49J3ZtLmF4aXNGdW4nIHNoaWZ0ZXI9J1swLHZtLmhlaWdodF0nPjwvZz5cblx0XHRcdDxmb3JlaWduT2JqZWN0IHdpZHRoPSczMCcgaGVpZ2h0PSczMCcgeT0nMjAnIHNoaWZ0ZXI9J1t2bS53aWR0aC8yLCB2bS5oZWlnaHRdJz5cblx0XHRcdFx0XHQ8dGV4dCBjbGFzcz0nbGFiZWwnID4keCQ8L3RleHQ+XG5cdFx0XHQ8L2ZvcmVpZ25PYmplY3Q+XG5cdFx0PC9nPlxuXHRcdDxnIHNoaWZ0ZXI9J3t7Ojpbdm0ubWFyLmxlZnQsIHZtLm1hci50b3BdfX0nICBjbGlwLXBhdGg9XCJ1cmwoI2RDYXJ0QSlcIiA+XG5cdFx0XHQ8ZyBjbGFzcz0nZy1jYXJ0JyBuZy1yZXBlYXQ9J3QgaW4gdm0uc2FtcGxlJyBkMy1kZXI9J3t0cmFuc2Zvcm06IFwidHJhbnNsYXRlKFwiICsgdm0uWCh2bS5DYXJ0LmxvYyh0KSkgKyBcIiwwKVwifScgc3R5bGU9J29wYWNpdHk6LjM7Jz5cblx0XHRcdFx0PGxpbmUgY2xhc3M9J3RpbWUtbGluZScgZDMtZGVyPSd7eDE6IDAsIHgyOiAwLCB5MTogMCwgeTI6IDYwfScgLz5cblx0XHRcdDwvZz5cblx0XHRcdDxnIGNsYXNzPSdnLWNhcnQnIGNhcnQtb2JqZWN0LWRlciBsZWZ0PSd2bS5YKHZtLkNhcnQueCknIHNoaWZ0ZXI9J1swLHZtLmhlaWdodF0nIHNpemU9J3ZtLnNpemUnPjwvZz5cblx0XHQ8L2c+XG5cdDwvc3ZnPlxuJycnXG5cbmNsYXNzIEN0cmxcblx0Y29uc3RydWN0b3I6IChAc2NvcGUsIEBlbCwgQHdpbmRvdyktPlxuXHRcdEBtYXIgPSBcblx0XHRcdGxlZnQ6IDEwXG5cdFx0XHRyaWdodDogMTBcblx0XHRcdHRvcDogMTBcblx0XHRcdGJvdHRvbTogMjBcblx0XHRcdFxuXHRcdEBYID0gZDMuc2NhbGUubGluZWFyKCkuZG9tYWluIFstLjEsM11cblxuXHRcdEBzY29wZS4kd2F0Y2ggLT5cblx0XHRcdFx0RGF0YS5tYXhYXG5cdFx0XHQsICh2KT0+XG5cdFx0XHRcdEBYLmRvbWFpbiBbLS4xLCB2XVxuXG5cdFx0QHNhbXBsZSA9IF8ucmFuZ2UoIDAsIDYgLCAuNSlcblxuXHRcdEBDYXJ0ID0gQ2FydFxuXG5cdFx0QGF4aXNGdW4gPSBkMy5zdmcuYXhpcygpXG5cdFx0XHQuc2NhbGUgQFhcblx0XHRcdC50aWNrcyA1XG5cdFx0XHQub3JpZW50ICdib3R0b20nXG5cblx0XHRAdHJhbiA9ICh0cmFuKS0+XG5cdFx0XHR0cmFuLmVhc2UgJ2xpbmVhcidcblx0XHRcdFx0LmR1cmF0aW9uIDYwXG5cblx0XHRhbmd1bGFyLmVsZW1lbnQgQHdpbmRvd1xuXHRcdFx0Lm9uICdyZXNpemUnICwgQHJlc2l6ZVxuXG5cdEBwcm9wZXJ0eSAnc3ZnSGVpZ2h0JyAsIGdldDotPiBAaGVpZ2h0ICsgQG1hci50b3AgKyBAbWFyLmJvdHRvbVxuXG5cdEBwcm9wZXJ0eSAnc2l6ZScsIGdldDogLT4gKEBYKCAwLjQpIC0gQFgoMCkpLzgwXG5cblx0cmVzaXplOiAoKT0+XG5cdFx0QHdpZHRoID0gQGVsWzBdLmNsaWVudFdpZHRoIC0gQG1hci5sZWZ0IC0gQG1hci5yaWdodFxuXHRcdEBoZWlnaHQgPSA2MFxuXHRcdEBYLnJhbmdlIFswLCBAd2lkdGhdXG5cdFx0QHNjb3BlLiRldmFsQXN5bmMoKVxuXG5kZXIgPSAoKS0+XG5cdGRpcmVjdGl2ZSA9IFxuXHRcdHRlbXBsYXRlOiB0ZW1wbGF0ZVxuXHRcdHNjb3BlOiB7fVxuXHRcdHJlc3RyaWN0OiAnQSdcblx0XHRiaW5kVG9Db250cm9sbGVyOiB0cnVlXG5cdFx0dGVtcGxhdGVOYW1lc3BhY2U6ICdzdmcnXG5cdFx0Y29udHJvbGxlcjogWyckc2NvcGUnLCAnJGVsZW1lbnQnLCAnJHdpbmRvdycsIEN0cmxdXG5cdFx0Y29udHJvbGxlckFzOiAndm0nXG5cbm1vZHVsZS5leHBvcnRzID0gZGVyXG4iLCJfID0gcmVxdWlyZSAnbG9kYXNoJ1xuZDM9IHJlcXVpcmUgJ2QzJ1xue21pbn0gPSBNYXRoXG5yZXF1aXJlICcuLi8uLi9oZWxwZXJzJ1xuQ2FydCA9IHJlcXVpcmUgJy4vdHJ1ZUNhcnQnXG5EYXRhID0gcmVxdWlyZSAnLi9kZXNpZ25EYXRhJ1xuXG50ZW1wbGF0ZSA9ICcnJ1xuXHQ8c3ZnIG5nLWluaXQ9J3ZtLnJlc2l6ZSgpJyB3aWR0aD0nMTAwJScgY2xhc3M9J2NhcnRDaGFydCcgbmctYXR0ci1oZWlnaHQ9J3t7Ojp2bS5zdmdIZWlnaHR9fSc+XG5cdFx0PGRlZnM+XG5cdFx0XHQ8Y2xpcHBhdGggaWQ9J2RDYXJ0Qic+XG5cdFx0XHRcdDxyZWN0IGQzLWRlcj0ne3dpZHRoOiB2bS53aWR0aCwgaGVpZ2h0OiB2bS5oZWlnaHR9JyAvPlxuXHRcdFx0PC9jbGlwcGF0aD5cblx0XHQ8L2RlZnM+XG5cdFx0PGcgY2xhc3M9J2JvaWxlcnBsYXRlJyBzaGlmdGVyPSd7ezo6W3ZtLm1hci5sZWZ0LCB2bS5tYXIudG9wXX19JyA+XG5cdFx0XHQ8cmVjdCBkMy1kZXI9J3t3aWR0aDogdm0ud2lkdGgsIGhlaWdodDogdm0uaGVpZ2h0fScgY2xhc3M9J2JhY2tncm91bmQnLz5cblx0XHRcdDxnIGhvci1heGlzLWRlciBoZWlnaHQ9J3ZtLmhlaWdodCcgc2NhbGU9J3ZtLlgnIGZ1bj0ndm0uYXhpc0Z1bicgc2hpZnRlcj0nWzAsdm0uaGVpZ2h0XSc+PC9nPlxuXHRcdFx0PGZvcmVpZ25PYmplY3Qgd2lkdGg9JzMwJyBoZWlnaHQ9JzMwJyB5PScyMCcgc2hpZnRlcj0nW3ZtLndpZHRoLzIsIHZtLmhlaWdodF0nPlxuXHRcdFx0XHRcdDx0ZXh0IGNsYXNzPSdsYWJlbCcgPiR4JDwvdGV4dD5cblx0XHRcdDwvZm9yZWlnbk9iamVjdD5cblx0XHQ8L2c+XG5cdFx0PGcgc2hpZnRlcj0ne3s6Olt2bS5tYXIubGVmdCwgdm0ubWFyLnRvcF19fScgY2xpcC1wYXRoPVwidXJsKCNkQ2FydEIpXCI+XG5cdFx0XHQ8ZyBjbGFzcz0nZy1jYXJ0JyBuZy1yZXBlYXQ9J3QgaW4gdm0uc2FtcGxlJyBkMy1kZXI9J3t0cmFuc2Zvcm06IFwidHJhbnNsYXRlKFwiICsgdm0uWCh2bS5DYXJ0LmxvYyh0KSkgKyBcIiwwKVwifScgc3R5bGU9J29wYWNpdHk6LjM7Jz5cblx0XHRcdFx0PGxpbmUgY2xhc3M9J3RpbWUtbGluZScgZDMtZGVyPSd7eDE6IDAsIHgyOiAwLCB5MTogMCwgeTI6IDYwfScgLz5cblx0XHRcdDwvZz5cblx0XHRcdDxnIGNsYXNzPSdnLWNhcnQnIGNhcnQtb2JqZWN0LWRlciBsZWZ0PSd2bS5YKHZtLkNhcnQueCknIHNoaWZ0ZXI9J1swLHZtLmhlaWdodF0nIHNpemU9J3ZtLnNpemUnPjwvZz5cblx0XHQ8L2c+XG5cdDwvc3ZnPlxuJycnXG5cbmNsYXNzIEN0cmxcblx0Y29uc3RydWN0b3I6IChAc2NvcGUsIEBlbCwgQHdpbmRvdyktPlxuXHRcdEBtYXIgPSBcblx0XHRcdGxlZnQ6IDEwXG5cdFx0XHRyaWdodDogMTBcblx0XHRcdHRvcDogMTBcblx0XHRcdGJvdHRvbTogMjBcblx0XHRcdFxuXHRcdEBYID0gZDMuc2NhbGUubGluZWFyKCkuZG9tYWluIFstLjEsM10gXG5cblx0XHRAc2FtcGxlID0gXy5yYW5nZSggMCwgNiAsIC41KVxuXG5cdFx0QHNjb3BlLiR3YXRjaCAtPlxuXHRcdFx0XHREYXRhLm1heFhcblx0XHRcdCwgKHYpPT5cblx0XHRcdFx0QFguZG9tYWluIFstLjEsIHZdXG5cblx0XHRAQ2FydCA9IENhcnRcblxuXHRcdEBheGlzRnVuID0gZDMuc3ZnLmF4aXMoKVxuXHRcdFx0LnNjYWxlIEBYXG5cdFx0XHQudGlja3MgNVxuXHRcdFx0Lm9yaWVudCAnYm90dG9tJ1xuXG5cdFx0QHRyYW4gPSAodHJhbiktPlxuXHRcdFx0dHJhbi5lYXNlICdsaW5lYXInXG5cdFx0XHRcdC5kdXJhdGlvbiAzMFxuXG5cdFx0YW5ndWxhci5lbGVtZW50IEB3aW5kb3dcblx0XHRcdC5vbiAncmVzaXplJyAsIEByZXNpemVcblxuXHRAcHJvcGVydHkgJ3NpemUnLCBnZXQ6IC0+IChAWCggMC40KSAtIEBYKDApKS84MFxuXG5cdHJlc2l6ZTogKCk9PlxuXHRcdEB3aWR0aCA9IEBlbFswXS5jbGllbnRXaWR0aCAtIEBtYXIubGVmdCAtIEBtYXIucmlnaHRcblx0XHRAaGVpZ2h0ID0gNjBcblx0XHRAWC5yYW5nZSBbMCwgQHdpZHRoXVxuXHRcdEBzY29wZS4kZXZhbEFzeW5jKClcblxuXHRAcHJvcGVydHkgJ3N2Z0hlaWdodCcsIGdldDotPiBAaGVpZ2h0ICsgQG1hci50b3ArQG1hci5ib3R0b21cblxuZGVyID0gKCktPlxuXHRkaXJlY3RpdmUgPSBcblx0XHR0ZW1wbGF0ZTogdGVtcGxhdGVcblx0XHRzY29wZToge31cblx0XHRyZXN0cmljdDogJ0EnXG5cdFx0YmluZFRvQ29udHJvbGxlcjogdHJ1ZVxuXHRcdHRlbXBsYXRlTmFtZXNwYWNlOiAnc3ZnJ1xuXHRcdGNvbnRyb2xsZXI6IFsnJHNjb3BlJywgJyRlbGVtZW50JywgJyR3aW5kb3cnLCBDdHJsXVxuXHRcdGNvbnRyb2xsZXJBczogJ3ZtJ1xuXG5tb2R1bGUuZXhwb3J0cyA9IGRlclxuIiwiXyA9IHJlcXVpcmUgJ2xvZGFzaCdcbnJlcXVpcmUgJy4uLy4uL2hlbHBlcnMnXG5DYXJ0ID0gcmVxdWlyZSAnLi4vY2FydC9jYXJ0RGF0YSdcbmQzID0gcmVxdWlyZSAnZDMnXG5cbmNsYXNzIERvdFxuXHRjb25zdHJ1Y3RvcjogKEB0LCBAdiktPlxuXHRcdEBpZCA9IF8udW5pcXVlSWQgJ2RvdCdcblxuY2xhc3MgRGF0YVxuXHRjb25zdHJ1Y3RvcjogLT5cblx0XHRAdCA9IEB4ID0gMFxuXHRcdEBDYXJ0ID0gQ2FydFxuXHRcdGZpcnN0RG90ID0gbmV3IERvdCAwICwgQ2FydC52MFxuXHRcdGZpcnN0RG90LmlkID0gJ2ZpcnN0J1xuXHRcdG1pZERvdCA9IG5ldyBEb3QgQ2FydC50cmFqZWN0b3J5WzEwXS50ICwgQ2FydC50cmFqZWN0b3J5WzEwXS52XG5cdFx0bGFzdERvdCA9IG5ldyBEb3QgNiAsIENhcnQudHJhamVjdG9yeVsxMF0udlxuXHRcdGxhc3REb3QuaWQgPSAnbGFzdCdcblx0XHRAZG90cyA9IFsgZmlyc3REb3QsIFxuXHRcdFx0bWlkRG90LFxuXHRcdFx0bGFzdERvdFxuXHRcdF1cblx0XHRAY29ycmVjdCA9IEBzaG93ID0gZmFsc2Vcblx0XHRAZmlyc3QgPSBmaXJzdERvdFxuXHRcdEB0YXJnZXRfZGF0YSA9IENhcnQudHJhamVjdG9yeVxuXHRcdEB1cGRhdGVfZG90cygpXG5cdFx0QHNlbGVjdF9kb3QgQGRvdHNbMV1cblxuXHRzZXRfc2hvdzogKHYpLT5cblx0XHRAc2hvdyA9IHZcblx0XHRcblx0c2V0X3Q6ICh0KS0+XG5cdFx0QHQgPSB0XG5cblx0aW5jcmVtZW50OiAoZHQpLT5cblx0XHRAdCArPSBkdFxuXG5cdHNlbGVjdF9kb3Q6IChkb3QpLT5cblx0XHRAc2VsZWN0ZWQgPSBkb3RcblxuXHRhZGRfZG90OiAodCwgdiktPlxuXHRcdG5ld0RvdCA9IG5ldyBEb3QgdCx2XG5cdFx0QGRvdHMucHVzaCBuZXdEb3Rcblx0XHRAdXBkYXRlX2RvdCBuZXdEb3QsIHQsIHZcblxuXHRAcHJvcGVydHkgJ21heFgnLCBnZXQ6LT5cblx0XHR0ID0gNC41XG5cdFx0aSA9IF8uZmluZExhc3RJbmRleCBAZG90cywgKGQpLT5cblx0XHRcdGQudCA8PSB0XG5cdFx0YSA9IEBkb3RzW2ldXG5cdFx0ZHQgPSB0IC0gYS50XG5cdFx0ZHYgPSBAZG90c1tpKzFdPy5kdiA/IDBcblx0XHRhLnggKyBhLnYgKiBkdCArIDAuNSpkdiAqIGR0KioyXG5cblx0cmVtb3ZlX2RvdDogKGRvdCktPlxuXHRcdEBkb3RzLnNwbGljZSBAZG90cy5pbmRleE9mKGRvdCksIDFcblx0XHRAdXBkYXRlX2RvdHMoKVxuXG5cdHVwZGF0ZV9kb3RzOiAtPiBcblx0XHRAZG90cy5zb3J0IChhLGIpLT4gYS50IC0gYi50XG5cdFx0QGRvdHMuZm9yRWFjaCAoZG90LCBpLCBrKS0+XG5cdFx0XHRwcmV2ID0ga1tpLTFdXG5cdFx0XHRpZiBkb3QuaWQgPT0gJ2xhc3QnXG5cdFx0XHRcdGRvdC52ID0gcHJldi52XG5cdFx0XHRcdHJldHVyblxuXHRcdFx0aWYgcHJldlxuXHRcdFx0XHRkdCA9IGRvdC50IC0gcHJldi50XG5cdFx0XHRcdGRvdC54ID0gcHJldi54ICsgZHQgKiAoZG90LnYgKyBwcmV2LnYpLzJcblx0XHRcdFx0ZG90LmR2ID0gKGRvdC52IC0gcHJldi52KS9NYXRoLm1heChkdCwgLjAwMDEpXG5cdFx0XHRlbHNlXG5cdFx0XHRcdGRvdC54ID0gMFxuXHRcdFx0XHRkb3QuZHYgPSAwXG5cblx0dXBkYXRlX2RvdDogKGRvdCwgdCwgdiktPlxuXHRcdGlmIGRvdC5pZCA9PSAnZmlyc3QnIHRoZW4gcmV0dXJuXG5cdFx0QHNlbGVjdF9kb3QgZG90XG5cdFx0ZG90LnQgPSB0XG5cdFx0ZG90LnYgPSB2XG5cdFx0QHVwZGF0ZV9kb3RzKClcblx0XHRAY29ycmVjdCA9IE1hdGguYWJzKENhcnQuayAqIGRvdC52ICsgZG90LmR2KSA8IDAuMDVcblxubW9kdWxlLmV4cG9ydHMgPSBuZXcgRGF0YSIsIkRhdGEgPSByZXF1aXJlICcuL2Rlc2lnbkRhdGEnXG5cbnRlbXBsYXRlID0gJycnXG5cdDxjaXJjbGUgY2xhc3M9J2RvdCBsYXJnZSc+PC9jaXJjbGU+XG5cdDxjaXJjbGUgY2xhc3M9J2RvdCBzbWFsbCcgcj0nNCc+PC9jaXJjbGU+XG4nJydcblxuY2xhc3MgQ3RybFxuXHRjb25zdHJ1Y3RvcjogKEBzY29wZSwgQGVsKS0+XG5cdFx0cmFkID0gNyAjdGhlIHJhZGl1cyBvZiB0aGUgbGFyZ2UgY2lyY2xlIG5hdHVyYWxseVxuXHRcdHNlbCA9IGQzLnNlbGVjdCBAZWxbMF1cblx0XHRiaWcgPSBzZWwuc2VsZWN0ICdjaXJjbGUuZG90LmxhcmdlJ1xuXHRcdFx0LmF0dHIgJ3InLCByYWRcblx0XHRjaXJjID0gc2VsLnNlbGVjdCAnY2lyY2xlLmRvdC5zbWFsbCdcblxuXHRcdGJpZy5vbiAnbW91c2VvdmVyJywgQG1vdXNlb3ZlclxuXHRcdFx0Lm9uICdjb250ZXh0bWVudScsIC0+IFxuXHRcdFx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpXG5cdFx0XHRcdGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpXG5cdFx0XHQub24gJ21vdXNlZG93bicsIC0+XG5cdFx0XHRcdGJpZy50cmFuc2l0aW9uICdncm93J1xuXHRcdFx0XHRcdC5kdXJhdGlvbiAxNTBcblx0XHRcdFx0XHQuZWFzZSAnY3ViaWMnXG5cdFx0XHRcdFx0LmF0dHIgJ3InLCByYWQqMS43XG5cdFx0XHQub24gJ21vdXNldXAnLCAtPlxuXHRcdFx0XHRiaWcudHJhbnNpdGlvbiAnZ3Jvdydcblx0XHRcdFx0XHQuZHVyYXRpb24gMTUwXG5cdFx0XHRcdFx0LmVhc2UgJ2N1YmljLWluJ1xuXHRcdFx0XHRcdC5hdHRyICdyJywgcmFkKjEuM1xuXHRcdFx0Lm9uICdtb3VzZW91dCcgLCBAbW91c2VvdXRcblxuXHRcdEBzY29wZS4kd2F0Y2ggPT5cblx0XHRcdFx0KERhdGEuc2VsZWN0ZWQgPT0gQGRvdCkgYW5kIChEYXRhLnNob3cpXG5cdFx0XHQsICh2LCBvbGQpLT5cblx0XHRcdFx0aWYgdlxuXHRcdFx0XHRcdGJpZy50cmFuc2l0aW9uICdncm93J1xuXHRcdFx0XHRcdFx0LmR1cmF0aW9uIDE1MFxuXHRcdFx0XHRcdFx0LmVhc2UgJ2N1YmljLW91dCdcblx0XHRcdFx0XHRcdC5hdHRyICdyJyAsIHJhZCAqIDEuNVxuXHRcdFx0XHRcdFx0LnRyYW5zaXRpb24oKVxuXHRcdFx0XHRcdFx0LmR1cmF0aW9uIDE1MFxuXHRcdFx0XHRcdFx0LmVhc2UgJ2N1YmljLWluJ1xuXHRcdFx0XHRcdFx0LmF0dHIgJ3InICwgcmFkICogMS4zXG5cblx0XHRcdFx0XHRjaXJjLnRyYW5zaXRpb24oKVxuXHRcdFx0XHRcdFx0LmR1cmF0aW9uIDE1MFxuXHRcdFx0XHRcdFx0LmVhc2UgJ2N1YmljLW91dCdcblx0XHRcdFx0XHRcdC5zdHlsZVxuXHRcdFx0XHRcdFx0XHQnc3Ryb2tlLXdpZHRoJzogMi41XG5cdFx0XHRcdGVsc2UgXG5cdFx0XHRcdFx0YmlnLnRyYW5zaXRpb24gJ3Nocmluaydcblx0XHRcdFx0XHRcdC5kdXJhdGlvbiAzNTBcblx0XHRcdFx0XHRcdC5lYXNlICdib3VuY2Utb3V0J1xuXHRcdFx0XHRcdFx0LmF0dHIgJ3InICwgcmFkXG5cblx0XHRcdFx0XHRjaXJjLnRyYW5zaXRpb24oKVxuXHRcdFx0XHRcdFx0LmR1cmF0aW9uIDEwMFxuXHRcdFx0XHRcdFx0LmVhc2UgJ2N1YmljJ1xuXHRcdFx0XHRcdFx0LnN0eWxlXG5cdFx0XHRcdFx0XHRcdCdzdHJva2Utd2lkdGgnOiAxLjZcblx0XHRcdFx0XHRcdFx0c3Ryb2tlOiAnd2hpdGUnXG5cdFx0XHQgXG5cdG1vdXNlb3V0OiA9PlxuXHRcdERhdGEuc2V0X3Nob3cgZmFsc2Vcblx0XHRAc2NvcGUuJGV2YWxBc3luYygpXG5cblx0bW91c2VvdmVyOiA9PlxuXHRcdERhdGEuc2VsZWN0X2RvdCBAZG90XG5cdFx0RGF0YS5zZXRfc2hvdyB0cnVlXG5cdFx0QHNjb3BlLiRldmFsQXN5bmMoKVxuXG5kZXIgPSAoKS0+XG5cdGRpcmVjdGl2ZSA9IFxuXHRcdHRlbXBsYXRlOiB0ZW1wbGF0ZVxuXHRcdGNvbnRyb2xsZXJBczogJ3ZtJ1xuXHRcdHNjb3BlOiBcblx0XHRcdGRvdDogJz1kb3RBRGVyJ1xuXHRcdGJpbmRUb0NvbnRyb2xsZXI6IHRydWVcblx0XHRjb250cm9sbGVyOiBbJyRzY29wZScsJyRlbGVtZW50JyxDdHJsXVxuXHRcdHJlc3RyaWN0OiAnQSdcblxuXG5tb2R1bGUuZXhwb3J0cyA9IGRlclxuIiwiRGF0YSA9IHJlcXVpcmUgJy4vZGVzaWduRGF0YSdcblxudGVtcGxhdGUgPSAnJydcblx0PGNpcmNsZSBjbGFzcz0nZG90IHNtYWxsJyByPSc0Jz48L2NpcmNsZT5cbicnJ1xuXG5jbGFzcyBDdHJsXG5cdGNvbnN0cnVjdG9yOiAoQHNjb3BlLCBAZWwpLT5cblx0XHRjaXJjID0gZDMuc2VsZWN0IEBlbFswXVxuXG5cdFx0Y2lyYy5vbiAnbW91c2VvdmVyJyxAbW91c2VvdmVyXG5cdFx0XHQub24gJ21vdXNlb3V0JyAsIEBtb3VzZW91dFxuXHRcdFx0IyAub24gJ2NvbnRleHRtZW51JywgLT4gXG5cdFx0XHQjIFx0ZXZlbnQucHJldmVudERlZmF1bHQoKVxuXHRcdFx0IyBcdGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpXG5cblx0XHRAc2NvcGUuJHdhdGNoID0+XG5cdFx0XHRcdChEYXRhLnNlbGVjdGVkID09IEBkb3QpIGFuZCAoRGF0YS5zaG93KVxuXHRcdFx0LCAodiwgb2xkKS0+XG5cdFx0XHRcdCMgaWYgdiA9PSBvbGQgdGhlbiByZXR1cm5cblx0XHRcdFx0XG5cdFx0XHRcdGlmIHZcblx0XHRcdFx0XHRjaXJjLnRyYW5zaXRpb24oKVxuXHRcdFx0XHRcdFx0LmR1cmF0aW9uIDE1MFxuXHRcdFx0XHRcdFx0LmVhc2UgJ2N1YmljLW91dCdcblx0XHRcdFx0XHRcdC5zdHlsZVxuXHRcdFx0XHRcdFx0XHQnc3Ryb2tlLXdpZHRoJzogMi41XG5cdFx0XHRcdGVsc2UgXG5cdFx0XHRcdFx0Y2lyYy50cmFuc2l0aW9uKClcblx0XHRcdFx0XHRcdC5kdXJhdGlvbiAxMDBcblx0XHRcdFx0XHRcdC5lYXNlICdjdWJpYydcblx0XHRcdFx0XHRcdC5zdHlsZVxuXHRcdFx0XHRcdFx0XHQnc3Ryb2tlLXdpZHRoJzogMS42XG5cdFx0XHRcdFx0XHRcdHN0cm9rZTogJ3doaXRlJ1xuXHRcdFx0IFxuXHRtb3VzZW91dDogPT5cblx0XHREYXRhLnNldF9zaG93IGZhbHNlXG5cdFx0QHNjb3BlLiRldmFsQXN5bmMoKVxuXG5cdG1vdXNlb3ZlcjogPT5cblx0XHREYXRhLnNlbGVjdF9kb3QgQGRvdFxuXHRcdERhdGEuc2V0X3Nob3cgdHJ1ZVxuXHRcdEBzY29wZS4kZXZhbEFzeW5jKClcblxuZGVyID0gKCktPlxuXHRkaXJlY3RpdmUgPSBcblx0XHR0ZW1wbGF0ZTogdGVtcGxhdGVcblx0XHRjb250cm9sbGVyQXM6ICd2bSdcblx0XHRzY29wZTogXG5cdFx0XHRkb3Q6ICc9ZG90QkRlcidcblx0XHRiaW5kVG9Db250cm9sbGVyOiB0cnVlXG5cdFx0Y29udHJvbGxlcjogWyckc2NvcGUnLCckZWxlbWVudCcsQ3RybF1cblx0XHRyZXN0cmljdDogJ0EnXG5cblxubW9kdWxlLmV4cG9ydHMgPSBkZXJcbiIsIkRhdGEgPSByZXF1aXJlICcuL2Rlc2lnbkRhdGEnXG5fID0gcmVxdWlyZSAnbG9kYXNoJ1xuXG5jbGFzcyBDYXJ0XG5cdGNvbnN0cnVjdG9yOiAtPlxuXG5cdGxvYzogKHQpLT5cblx0XHRpID0gXy5maW5kTGFzdEluZGV4IERhdGEuZG90cywgKGQpLT5cblx0XHRcdGQudCA8PSB0XG5cdFx0YSA9IERhdGEuZG90c1tpXVxuXHRcdGR0ID0gdCAtIGEudFxuXHRcdGR2ID0gRGF0YS5kb3RzW2krMV0/LmR2ID8gMFxuXHRcdGEueCArIGEudiAqIGR0ICsgMC41KmR2ICogZHQqKjJcblxuXHRAcHJvcGVydHkgJ3gnLCBnZXQ6LT4gQGxvYyBEYXRhLnRcblxuXHRAcHJvcGVydHkgJ3YnLCBnZXQ6LT5cblx0XHR0ID0gRGF0YS50XG5cdFx0aSA9IF8uZmluZExhc3RJbmRleCBEYXRhLmRvdHMsIChkKS0+XG5cdFx0XHRkLnQgPD0gdFxuXHRcdGEgPSBEYXRhLmRvdHNbaV1cblx0XHRkdCA9IHQgLSBhLnRcblx0XHRkdiA9IERhdGEuZG90c1tpKzFdPy5kdiA/IDBcblx0XHRhLnYgKyBkdiAqIGR0XG5cbm1vZHVsZS5leHBvcnRzID0gbmV3IENhcnQiLCJEYXRhID0gcmVxdWlyZSAnLi9kZXNpZ25EYXRhJ1xuXyA9IHJlcXVpcmUgJ2xvZGFzaCdcbnJlcXVpcmUgJy4uLy4uL2hlbHBlcnMnXG5cbmNsYXNzIENhcnRcblx0Y29uc3RydWN0b3I6IC0+XG5cblx0bG9jOiAodCktPlxuXHRcdDIvLjggKiAoMS1NYXRoLmV4cCgtLjgqdCkpXG5cblx0QHByb3BlcnR5ICd4JywgZ2V0Oi0+IEBsb2MgRGF0YS50XG5cblx0QHByb3BlcnR5ICd2JywgZ2V0Oi0+XG5cdFx0MiogTWF0aC5leHAoLS44KkRhdGEudClcblxubW9kdWxlLmV4cG9ydHMgPSBuZXcgQ2FydCIsImFuZ3VsYXIgPSByZXF1aXJlICdhbmd1bGFyJ1xuZDMgPSByZXF1aXJlICdkMydcbnJlcXVpcmUgJy4uLy4uL2hlbHBlcnMnXG5fID0gcmVxdWlyZSAnbG9kYXNoJ1xudGVtcGxhdGUgPSAnJydcblx0PHN2ZyBuZy1pbml0PSd2bS5yZXNpemUoKScgd2lkdGg9JzEwMCUnIGNsYXNzPSd0b3BDaGFydCc+XG5cdFx0PGRlZnM+XG5cdFx0XHQ8Y2xpcHBhdGggaWQ9J3JlZyc+XG5cdFx0XHRcdDxyZWN0IGQzLWRlcj0ne3dpZHRoOiB2bS53aWR0aCwgaGVpZ2h0OiB2bS5oZWlnaHR9JyAvPlxuXHRcdFx0PC9jbGlwcGF0aD5cblx0XHQ8L2RlZnM+XG5cdFx0PGcgY2xhc3M9J2JvaWxlcnBsYXRlJyBzaGlmdGVyPSdbdm0ubWFyLmxlZnQsIHZtLm1hci50b3BdJz5cblx0XHRcdDxyZWN0IGNsYXNzPSdiYWNrZ3JvdW5kJyBkMy1kZXI9J3t3aWR0aDogdm0ud2lkdGgsIGhlaWdodDogdm0uaGVpZ2h0fScgbmctbW91c2Vtb3ZlPSd2bS5tb3ZlKCRldmVudCknIC8+XG5cdFx0XHQ8ZyB2ZXItYXhpcy1kZXIgd2lkdGg9J3ZtLndpZHRoJyBzY2FsZT0ndm0uVmVyJyBmdW49J3ZtLnZlckF4RnVuJz48L2c+XG5cdFx0XHQ8ZyBob3ItYXhpcy1kZXIgaGVpZ2h0PSd2bS5oZWlnaHQnIHNjYWxlPSd2bS5Ib3InIGZ1bj0ndm0uaG9yQXhGdW4nIHNoaWZ0ZXI9J1swLHZtLmhlaWdodF0nPjwvZz5cblx0XHRcdDxmb3JlaWduT2JqZWN0IHdpZHRoPSczMCcgaGVpZ2h0PSczMCcgeT0nMTgnIHNoaWZ0ZXI9J1t2bS53aWR0aC8yLCB2bS5oZWlnaHRdJz5cblx0XHRcdFx0PHRleHQgY2xhc3M9J2xhYmVsJz4kdCQ8L3RleHQ+XG5cdFx0XHQ8L2ZvcmVpZ25PYmplY3Q+XG5cblx0XHQ8L2c+XG5cdFx0PGcgY2xhc3M9J21haW4nIGNsaXAtcGF0aD1cInVybCgjcmVnKVwiIHNoaWZ0ZXI9J1t2bS5tYXIubGVmdCwgdm0ubWFyLnRvcF0nPlxuXHRcdFx0PGxpbmUgY2xhc3M9J3plcm8tbGluZSBob3InIG5nLWNsYXNzPSd7XCJjb3JyZWN0XCI6IHZtLmNvcnJlY3R9JyBkMy1kZXI9J3t4MTogMCwgeDI6IHZtLndpZHRoLCB5MTogdm0uVmVyKDApLCB5Mjogdm0uVmVyKDApfScvPlxuXHRcdFx0PGxpbmUgY2xhc3M9J3RyaSB2JyBkMy1kZXI9J3t4MTogdm0uSG9yKHZtLnBvaW50LnQpLCB4Mjogdm0uSG9yKHZtLnBvaW50LnQpLCB5MTogdm0uVmVyKDApLCB5Mjogdm0uVmVyKHZtLnBvaW50LnYgKX0nLz5cblx0XHRcdDxjaXJjbGUgcj0nM3B4JyBzaGlmdGVyPSdbdm0uSG9yKHZtLnBvaW50LnQpLCB2bS5WZXIodm0ucG9pbnQudildJyBjbGFzcz0ncG9pbnQgdicvPlxuXHRcdFx0PHBhdGggZDMtZGVyPSd7ZDp2bS5saW5lRnVuKHZtLmRhdGEpfScgY2xhc3M9J2Z1biB2JyAvPlxuXHRcdFx0PGZvcmVpZ25PYmplY3Qgd2lkdGg9JzMwJyBoZWlnaHQ9JzMwJyBzaGlmdGVyPSdbKHZtLkhvcih2bS5wb2ludC50KSAtIDE2KSwgdm0uVmVyKHZtLnBvaW50LnYvMikgLSA3XSc+XG5cdFx0XHRcdFx0PHRleHQgY2xhc3M9J3RyaS1sYWJlbCcgZm9udC1zaXplPScxM3B4Jz4keSQ8L3RleHQ+XG5cdFx0XHQ8L2ZvcmVpZ25PYmplY3Q+XG5cdFx0XHQ8Zm9yZWlnbk9iamVjdCB3aWR0aD0nMjAwJyBoZWlnaHQ9JzMwJyBzaGlmdGVyPSdbdm0uSG9yKDEpLCB2bS5WZXIoLjkpXSc+XG5cdFx0XHRcdDx0ZXh0IGNsYXNzPSd0cmktbGFiZWwnPiQ1KHQtLjUpKHQtMSkodC0xKV4yJDwvdGV4dD5cblx0XHRcdDwvZm9yZWlnbk9iamVjdD5cblx0XHQ8L2c+XG5cdDwvc3ZnPlxuJycnXG5cbmNsYXNzIEN0cmxcblx0Y29uc3RydWN0b3I6IChAc2NvcGUsIEBlbCwgQHdpbmRvdyktPlxuXHRcdEBtYXIgPSBcblx0XHRcdGxlZnQ6IDMwXG5cdFx0XHR0b3A6IDEwXG5cdFx0XHRyaWdodDogMjBcblx0XHRcdGJvdHRvbTogNDBcblxuXHRcdEBWZXIgPSBkMy5zY2FsZS5saW5lYXIoKS5kb21haW4gWy0xLDFdXG5cdFx0QEhvciA9IGQzLnNjYWxlLmxpbmVhcigpLmRvbWFpbiBbMCwyLjVdXG5cblx0XHRAaG9yQXhGdW4gPSBkMy5zdmcuYXhpcygpXG5cdFx0XHQuc2NhbGUgQEhvclxuXHRcdFx0LnRpY2tGb3JtYXQoZDMuZm9ybWF0ICdkJylcblx0XHRcdC5vcmllbnQgJ2JvdHRvbSdcblxuXHRcdEB2ZXJBeEZ1biA9IGQzLnN2Zy5heGlzKClcblx0XHRcdC5zY2FsZSBAVmVyXG5cdFx0XHQudGlja3MgNVxuXHRcdFx0LnRpY2tGb3JtYXQgKGQpLT5cblx0XHRcdFx0aWYgTWF0aC5mbG9vcihkKSAhPSBkIHRoZW4gcmV0dXJuXG5cdFx0XHRcdGRcblx0XHRcdC5vcmllbnQgJ2xlZnQnXG5cblx0XHRAbGluZUZ1biA9IGQzLnN2Zy5saW5lKClcblx0XHRcdC55IChkKT0+IEBWZXIgZC52XG5cdFx0XHQueCAoZCk9PiBASG9yIGQudFxuXG5cdFx0dkZ1biA9ICh0KS0+NSogKHQtLjUpICogKHQtMSkgKiAodC0yKSoqMlxuXG5cdFx0QGRhdGEgPSBfLnJhbmdlIDAgLCAzICwgMS81MFxuXHRcdFx0Lm1hcCAodCktPlxuXHRcdFx0XHRyZXMgPSBcblx0XHRcdFx0XHR2OiB2RnVuIHRcblx0XHRcdFx0XHR0OiB0XG5cblx0XHRAcG9pbnQgPSBfLnNhbXBsZSBAZGF0YVxuXG5cdFx0QGNvcnJlY3QgPSBmYWxzZVxuXG5cdFx0YW5ndWxhci5lbGVtZW50IEB3aW5kb3dcblx0XHRcdC5vbiAncmVzaXplJywgQHJlc2l6ZVxuXG5cdFx0QG1vdmUgPSAoZXZlbnQpID0+XG5cdFx0XHRyZWN0ID0gZXZlbnQudGFyZ2V0LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpXG5cdFx0XHR0ID0gQEhvci5pbnZlcnQgZXZlbnQueCAtIHJlY3QubGVmdFxuXHRcdFx0diA9IHZGdW4gdFxuXHRcdFx0QHBvaW50ID0gXG5cdFx0XHRcdHQ6IHRcblx0XHRcdFx0djogdlxuXHRcdFx0QGNvcnJlY3QgPSBNYXRoLmFicyhAcG9pbnQudikgPD0gMC4wNSBcblx0XHRcdEBzY29wZS4kZXZhbEFzeW5jKClcblxuXHRAcHJvcGVydHkgJ3N2Z19oZWlnaHQnLCBnZXQ6IC0+IEBoZWlnaHQgKyBAbWFyLnRvcCArIEBtYXIuYm90dG9tXG5cblx0cmVzaXplOiAoKT0+XG5cdFx0QHdpZHRoID0gQGVsWzBdLmNsaWVudFdpZHRoIC0gQG1hci5sZWZ0IC0gQG1hci5yaWdodFxuXHRcdEBoZWlnaHQgPSBAZWxbMF0uY2xpZW50SGVpZ2h0IC0gQG1hci5sZWZ0IC0gQG1hci5yaWdodFxuXHRcdEBWZXIucmFuZ2UgW0BoZWlnaHQsIDBdXG5cdFx0QEhvci5yYW5nZSBbMCwgQHdpZHRoXVxuXHRcdEBzY29wZS4kZXZhbEFzeW5jKClcblxuZGVyID0gKCktPlxuXHRkaXJlY3RpdmUgPSBcblx0XHRjb250cm9sbGVyQXM6ICd2bSdcblx0XHRzY29wZToge31cblx0XHR0ZW1wbGF0ZTogdGVtcGxhdGVcblx0XHR0ZW1wbGF0ZU5hbWVzcGFjZTogJ3N2Zydcblx0XHRjb250cm9sbGVyOiBbJyRzY29wZScsJyRlbGVtZW50JywgJyR3aW5kb3cnLCBDdHJsXVxuXG5tb2R1bGUuZXhwb3J0cyA9IGRlclxuIiwiZHJhZyA9ICgkcGFyc2UpLT5cblx0ZGlyZWN0aXZlID0gXG5cdFx0bGluazogKHNjb3BlLGVsLGF0dHIpLT5cblx0XHRcdHNlbCA9IGQzLnNlbGVjdChlbFswXSlcblx0XHRcdHNlbC5jYWxsKCRwYXJzZShhdHRyLmJlaGF2aW9yKShzY29wZSkpXG5cbm1vZHVsZS5leHBvcnRzID0gZHJhZyIsInRlbXBsYXRlID0gJycnXG5cdDxkZWZzPlxuXHRcdDxjbGlwcGF0aCBuZy1hdHRyLWlkPSd7ezo6dm0ubmFtZX19Jz5cblx0XHRcdDxyZWN0IG5nLWF0dHItd2lkdGg9J3t7dm0ud2lkdGh9fScgbmctYXR0ci1oZWlnaHQ9J3t7dm0uaGVpZ2h0fX0nIC8+XG5cdFx0PC9jbGlwcGF0aD5cblx0PC9kZWZzPlxuXHQ8ZyBjbGFzcz0nYm9pbGVycGxhdGUnIHNoaWZ0ZXI9J3t7Ojpbdm0ubWFyLmxlZnQsIHZtLm1hci50b3BdfX0nPlxuXHRcdDxyZWN0IGNsYXNzPSdiYWNrZ3JvdW5kJyBuZy1hdHRyLXdpZHRoPSd7e3ZtLndpZHRofX0nIG5nLWF0dHItaGVpZ2h0PSd7e3ZtLmhlaWdodH19JyAvPlxuXHRcdDxnIHZlci1heGlzLWRlciB3aWR0aD0ndm0ud2lkdGgnIHNjYWxlPSd2bS52ZXInIGZ1bj0ndm0udmVyQXhGdW4nPjwvZz5cblx0XHQ8ZyBob3ItYXhpcy1kZXIgaGVpZ2h0PSd2bS5oZWlnaHQnIHNjYWxlPSd2bS5ob3InIGZ1bj0ndm0uaG9yQXhGdW4nIHNoaWZ0ZXI9J1swLHZtLmhlaWdodF0nPjwvZz5cblx0PC9nPlxuJycnXG5cbmRlciA9IC0+XG5cdGRpcmVjdGl2ZSA9IFxuXHRcdGNvbnRyb2xsZXI6IFsnJHNjb3BlJywgKEBzY29wZSkgLT5dXG5cdFx0Y29udHJvbGxlckFzOiAndm0nXG5cdFx0YmluZFRvQ29udHJvbGxlcjogdHJ1ZVxuXHRcdHNjb3BlOiBcblx0XHRcdHdpZHRoOiAnPSdcblx0XHRcdGhlaWdodDogJz0nXG5cdFx0XHR2ZXJBeEZ1bjogJz0nXG5cdFx0XHRob3JBeEZ1bjogJz0nXG5cdFx0XHRtYXI6ICc9J1xuXHRcdFx0dmVyOiAnPSdcblx0XHRcdGhvcjogJz0nXG5cdFx0XHRuYW1lOiAnPSdcblx0XHR0ZW1wbGF0ZTogdGVtcGxhdGVcblx0XHR0ZW1wbGF0ZU5hbWVzcGFjZTogJ3N2ZydcblxubW9kdWxlLmV4cG9ydHMgPSBkZXIiLCJkMyA9IHJlcXVpcmUgJ2QzJ1xuYW5ndWxhciA9IHJlcXVpcmUgJ2FuZ3VsYXInXG5cbmRlciA9ICgkcGFyc2UpLT4gI2dvZXMgb24gYSBzdmcgZWxlbWVudFxuXHRkaXJlY3RpdmUgPSBcblx0XHRyZXN0cmljdDogJ0EnXG5cdFx0c2NvcGU6IFxuXHRcdFx0ZDNEZXI6ICc9J1xuXHRcdFx0dHJhbjogJz0nXG5cdFx0bGluazogKHNjb3BlLCBlbCwgYXR0ciktPlxuXHRcdFx0c2VsID0gZDMuc2VsZWN0IGVsWzBdXG5cdFx0XHR1ID0gJ3QtJyArIE1hdGgucmFuZG9tKClcblx0XHRcdHNjb3BlLiR3YXRjaCAnZDNEZXInXG5cdFx0XHRcdCwgKHYpLT5cblx0XHRcdFx0XHRpZiBzY29wZS50cmFuXG5cdFx0XHRcdFx0XHRzZWwudHJhbnNpdGlvbiB1XG5cdFx0XHRcdFx0XHRcdC5hdHRyIHZcblx0XHRcdFx0XHRcdFx0LmNhbGwgc2NvcGUudHJhblxuXHRcdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRcdHNlbC5hdHRyIHZcblxuXHRcdFx0XHQsIHRydWVcbm1vZHVsZS5leHBvcnRzID0gZGVyIiwibW9kdWxlLmV4cG9ydHMgPSAoJHBhcnNlKS0+XG5cdChzY29wZSwgZWwsIGF0dHIpLT5cblx0XHRkMy5zZWxlY3QoZWxbMF0pLmRhdHVtICRwYXJzZShhdHRyLmRhdHVtKShzY29wZSkiLCJcbmNsYXNzIEN0cmxcblx0Y29uc3RydWN0b3I6IChAc2NvcGUsIEBlbCwgQHdpbmRvdyktPlxuXHRcdEBtYXIgPSBcblx0XHRcdGxlZnQ6IDMwXG5cdFx0XHR0b3A6IDIwXG5cdFx0XHRyaWdodDogMjBcblx0XHRcdGJvdHRvbTogMzVcblxuXHRcdEBWZXIgPSBkMy5zY2FsZS5saW5lYXIoKVxuXHRcdEBIb3IgPSBkMy5zY2FsZS5saW5lYXIoKVxuXG5cdFx0QGRhdGEgPSBEYXRhLmRhdGFcblxuXHRcdEBob3JBeEZ1biA9IGQzLnN2Zy5heGlzKClcblx0XHRcdC5zY2FsZSBASG9yXG5cdFx0XHQudGlja3MgNVxuXHRcdFx0Lm9yaWVudCAnYm90dG9tJ1xuXG5cdFx0QHZlckF4RnVuID0gZDMuc3ZnLmF4aXMoKVxuXHRcdFx0LnNjYWxlIEBWZXJcblx0XHRcdC50aWNrRm9ybWF0IChkKS0+XG5cdFx0XHRcdGlmIE1hdGguZmxvb3IoIGQgKSAhPSBkIHRoZW4gcmV0dXJuXG5cdFx0XHRcdGRcblx0XHRcdC50aWNrcyA1XG5cdFx0XHQub3JpZW50ICdsZWZ0J1xuXG5cdFx0QGxpbmVGdW4gPSBkMy5zdmcubGluZSgpXG5cdFx0XHQueSAoZCk9PiBAVmVyIGQudlxuXHRcdFx0LnggKGQpPT4gQEhvciBkLnRcblxuXHRcdGFuZ3VsYXIuZWxlbWVudCBAd2luZG93XG5cdFx0XHQub24gJ3Jlc2l6ZScsIEByZXNpemVcblxuXHRAcHJvcGVydHkgJ3N2Z19oZWlnaHQnLCBnZXQ6IC0+IEBoZWlnaHQgKyBAbWFyLnRvcCArIEBtYXIuYm90dG9tXG5cblx0cmVzaXplOiAoKT0+XG5cdFx0QHdpZHRoID0gQGVsWzBdLmNsaWVudFdpZHRoIC0gQG1hci5sZWZ0IC0gQG1hci5yaWdodFxuXHRcdEBoZWlnaHQgPSBAZWxbMF0uY2xpZW50SGVpZ2h0IC0gQG1hci50b3AgLSBAbWFyLmJvdHRvbVxuXHRcdEBWZXIucmFuZ2UgW0BoZWlnaHQsIDBdXG5cdFx0QEhvci5yYW5nZSBbMCwgQHdpZHRoXVxuXHRcdEBzY29wZS4kZXZhbEFzeW5jKClcblxuXG5tb2R1bGUuZXhwb3J0cyA9IEN0cmwiLCJkMyA9IHJlcXVpcmUgJ2QzJ1xuXG5kZXIgPSAoJHBhcnNlKS0+XG5cdGRpcmVjdGl2ZSA9XG5cdFx0bGluazogKHNjb3BlLCBlbCwgYXR0ciktPlxuXHRcdFx0cmVzaGlmdCA9ICh2KS0+IFxuXHRcdFx0XHRkMy5zZWxlY3QgZWxbMF1cblx0XHRcdFx0XHQuYXR0ciAndHJhbnNmb3JtJyAsIFwidHJhbnNsYXRlKCN7dlswXX0sI3t2WzFdfSlcIlxuXG5cdFx0XHRzY29wZS4kd2F0Y2ggLT5cblx0XHRcdFx0XHQkcGFyc2UoYXR0ci5zaGlmdGVyKShzY29wZSlcblx0XHRcdFx0LCByZXNoaWZ0XG5cdFx0XHRcdCwgdHJ1ZVxuXG5tb2R1bGUuZXhwb3J0cyA9IGRlciIsImFuZ3VsYXIgPSByZXF1aXJlICdhbmd1bGFyJ1xuZDMgPSByZXF1aXJlICdkMydcbnRleHR1cmVzID0gcmVxdWlyZSAndGV4dHVyZXMnXG5cbmNsYXNzIEN0cmxcblx0Y29uc3RydWN0b3I6IChAc2NvcGUsIEBlbCwgQHdpbmRvdyktPlxuXHRcdHQgPSB0ZXh0dXJlcy5saW5lcygpXG5cdFx0XHQub3JpZW50YXRpb24gXCIzLzhcIiwgXCI3LzhcIlxuXHRcdFx0LnNpemUgNFxuXHRcdFx0LnN0cm9rZSgnI0U2RTZFNicpXG5cdFx0ICAgIC5zdHJva2VXaWR0aCAuNlxuXG5cdFx0dC5pZCAnbXlUZXh0dXJlJ1xuXG5cdFx0ZDMuc2VsZWN0IEBlbFswXVxuXHRcdFx0LnNlbGVjdCAnc3ZnJ1xuXHRcdFx0LmNhbGwgdFxuXG5kZXIgPSAtPlxuXHRkaXJlY3RpdmUgPSBcblx0XHRjb250cm9sbGVyQXM6ICd2bSdcblx0XHRzY29wZToge31cblx0XHR0ZW1wbGF0ZTogJzxzdmcgaGVpZ2h0PVwiMHB4XCIgc3R5bGU9XCJwb3NpdGlvbjogYWJzb2x1dGU7XCIgd2lkdGg9XCIwcHhcIj48L3N2Zz4nXG5cdFx0dGVtcGxhdGVOYW1lc3BhY2U6ICdzdmcnXG5cdFx0Y29udHJvbGxlcjogWyckc2NvcGUnLCckZWxlbWVudCcsICckd2luZG93JywgQ3RybF1cblxubW9kdWxlLmV4cG9ydHMgPSBkZXJcbiIsImQzID0gcmVxdWlyZSAnZDMnXG5hbmd1bGFyID0gcmVxdWlyZSAnYW5ndWxhcidcblxuZGVyID0gKCR3aW5kb3cpLT5cblx0ZGlyZWN0aXZlID0gXG5cdFx0Y29udHJvbGxlcjogYW5ndWxhci5ub29wXG5cdFx0Y29udHJvbGxlckFzOiAndm0nXG5cdFx0YmluZFRvQ29udHJvbGxlcjogdHJ1ZVxuXHRcdHJlc3RyaWN0OiAnQSdcblx0XHR0ZW1wbGF0ZU5hbWVzcGFjZTogJ3N2Zydcblx0XHRzY29wZTogXG5cdFx0XHRzY2FsZTogJz0nXG5cdFx0XHRoZWlnaHQ6ICc9J1xuXHRcdFx0ZnVuOiAnPSdcblx0XHRsaW5rOiAoc2NvcGUsIGVsLCBhdHRyLCB2bSktPlxuXHRcdFx0eEF4aXNGdW4gPSB2bS5mdW4gPyAoZDMuc3ZnLmF4aXMoKVxuXHRcdFx0XHRcdFx0XHQuc2NhbGUgdm0uc2NhbGVcblx0XHRcdFx0XHRcdFx0Lm9yaWVudCAnYm90dG9tJylcblxuXHRcdFx0c2VsID0gZDMuc2VsZWN0IGVsWzBdXG5cdFx0XHRcdC5jbGFzc2VkICd4IGF4aXMnLCB0cnVlXG5cblx0XHRcdHVwZGF0ZSA9ID0+XG5cdFx0XHRcdHhBeGlzRnVuLnRpY2tTaXplIC12bS5oZWlnaHRcblx0XHRcdFx0c2VsLmNhbGwgeEF4aXNGdW5cblx0XHRcdFx0XG5cdFx0XHRzY29wZS4kd2F0Y2hDb2xsZWN0aW9uIFsnc2NhbGUuZG9tYWluKCknLCdzY2FsZS5yYW5nZSgpJywnaGVpZ2h0J10sIHVwZGF0ZSwgdHJ1ZVxuXG5cbm1vZHVsZS5leHBvcnRzID0gZGVyIiwiZDMgPSByZXF1aXJlICdkMydcbmFuZ3VsYXIgPSByZXF1aXJlICdhbmd1bGFyJ1xuXG5kZXIgPSAoJHdpbmRvdyktPlxuXHRkaXJlY3RpdmUgPSBcblx0XHRjb250cm9sbGVyOiBhbmd1bGFyLm5vb3Bcblx0XHRjb250cm9sbGVyQXM6ICd2bSdcblx0XHRiaW5kVG9Db250cm9sbGVyOiB0cnVlXG5cdFx0cmVzdHJpY3Q6ICdBJ1xuXHRcdHRlbXBsYXRlTmFtZXNwYWNlOiAnc3ZnJ1xuXHRcdHNjb3BlOiBcblx0XHRcdHNjYWxlOiAnPSdcblx0XHRcdHdpZHRoOiAnPSdcblx0XHRcdGZ1bjogJz0nXG5cdFx0bGluazogKHNjb3BlLCBlbCwgYXR0ciwgdm0pLT5cblx0XHRcdHlBeGlzRnVuID0gdm0uZnVuID8gZDMuc3ZnLmF4aXMoKVxuXHRcdFx0XHQuc2NhbGUgdm0uc2NhbGVcblx0XHRcdFx0Lm9yaWVudCAnbGVmdCdcblxuXHRcdFx0c2VsID0gZDMuc2VsZWN0KGVsWzBdKS5jbGFzc2VkKCd5IGF4aXMnLCB0cnVlKVxuXG5cdFx0XHR1cGRhdGUgPSA9PlxuXHRcdFx0XHR5QXhpc0Z1bi50aWNrU2l6ZSggLXZtLndpZHRoKVxuXHRcdFx0XHRzZWwuY2FsbCh5QXhpc0Z1bilcblxuXHRcdFx0c2NvcGUuJHdhdGNoQ29sbGVjdGlvbiBbJ3NjYWxlLmRvbWFpbigpJywnc2NhbGUucmFuZ2UoKScsJ3dpZHRoJ10sIHVwZGF0ZSwgdHJ1ZVxuXHRcdFx0XHRcblxuXG5tb2R1bGUuZXhwb3J0cyA9IGRlciIsIid1c2Ugc3RyaWN0J1xuXG5tb2R1bGUuZXhwb3J0cy50aW1lb3V0ID0gKGZ1biwgdGltZSktPlxuXHRcdGQzLnRpbWVyKCgpPT5cblx0XHRcdGZ1bigpXG5cdFx0XHR0cnVlXG5cdFx0LHRpbWUpXG5cblxuRnVuY3Rpb246OnByb3BlcnR5ID0gKHByb3AsIGRlc2MpIC0+XG4gIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSBAcHJvdG90eXBlLCBwcm9wLCBkZXNjIl19
