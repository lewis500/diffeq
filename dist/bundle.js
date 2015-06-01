(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';
var angular, app, d3, looper;

angular = require('angular');

d3 = require('d3');

app = angular.module('mainApp', [require('angular-material')]).directive('horAxisDer', require('./directives/xAxis')).directive('verAxisDer', require('./directives/yAxis')).directive('cartSimDer', require('./components/cart/cartSim')).directive('cartObjectDer', require('./components/cart/cartObject')).directive('cartButtonsDer', require('./components/cart/cartButtons')).directive('shifter', require('./directives/shifter')).directive('designADer', require('./components/design/designA')).directive('behavior', require('./directives/behavior')).directive('dotDer', require('./components/design/dot')).directive('dotBDer', require('./components/design/dotB')).directive('datum', require('./directives/datum')).directive('d3Der', require('./directives/d3Der')).directive('designBDer', require('./components/design/designB')).directive('regularDer', require('./components/regular/regular')).directive('derivativeDer', require('./components/derivative/derivative')).directive('derivativeBDer', require('./components/derivative/derivativeB')).directive('cartPlotDer', require('./components/cart/cartPlot')).directive('designCartADer', require('./components/design/designCartA')).directive('designCartBDer', require('./components/design/designCartB')).directive('textureDer', require('./directives/texture')).directive('designButtonsDer', require('./components/design/designButtons'));

looper = function() {
  return setTimeout(function() {
    d3.selectAll('circle.dot.large').transition('grow').duration(500).ease('cubic-out').attr('transform', 'scale( 1.34)').transition('shrink').duration(500).ease('cubic-out').attr('transform', 'scale( 1.0)');
    return looper();
  }, 1000);
};

looper();



},{"./components/cart/cartButtons":2,"./components/cart/cartObject":4,"./components/cart/cartPlot":5,"./components/cart/cartSim":6,"./components/derivative/derivative":7,"./components/derivative/derivativeB":8,"./components/design/designA":10,"./components/design/designB":11,"./components/design/designButtons":12,"./components/design/designCartA":13,"./components/design/designCartB":14,"./components/design/dot":16,"./components/design/dotB":17,"./components/regular/regular":20,"./directives/behavior":21,"./directives/d3Der":22,"./directives/datum":23,"./directives/shifter":24,"./directives/texture":25,"./directives/xAxis":26,"./directives/yAxis":27,"angular":undefined,"angular-material":undefined,"d3":undefined}],2:[function(require,module,exports){
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



},{"../../helpers":28,"./cartData":3,"angular":undefined,"d3":undefined,"lodash":undefined}],6:[function(require,module,exports){
var Cart, Ctrl, _, d3, der, min, template,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

_ = require('lodash');

d3 = require('d3');

min = Math.min;

Cart = require('./cartData');

require('../../helpers');

template = '<svg ng-init=\'vm.resize()\' width=\'100%\' ng-attr-height="{{vm.svgHeight}}">\n	<g shifter=\'{{::[vm.mar.left, vm.mar.top]}}\'>\n		<rect class=\'background\' d3-der=\'{width: vm.width, height: vm.height}\' ng-mousemove=\'vm.move($event)\' />\n		<g hor-axis-der height=\'vm.height\' scale=\'vm.X\' fun=\'vm.axisFun\' shifter=\'[0,vm.height]\'></g>\n		<foreignObject width=\'30\' height=\'30\' y=\'20\' shifter=\'[vm.width/2, vm.height]\'>\n				<text class=\'label\' >$t$</text>\n		</foreignObject>\n		<g class=\'g-cart\' cart-object-der left=\'vm.X(vm.Cart.x)\' transform=\'translate(0,25)\'></g>\n	</g>\n</svg>';

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

template = '<svg ng-init=\'vm.resize()\' width=\'100%\'  class=\'topChart\'>\n	<defs>\n		<clippath id=\'dervativeB\'>\n			<rect d3-der=\'{width: vm.width, height: vm.height}\' />\n		</clippath>\n	</defs>\n	<g class=\'boilerplate\' shifter=\'[vm.mar.left, vm.mar.top]\'>\n		<rect class=\'background\' d3-der=\'{width: vm.width, height: vm.height}\' ng-mousemove=\'vm.move($event)\' />\n		<g ver-axis-der width=\'vm.width\' scale=\'vm.Ver\' fun=\'vm.verAxFun\'></g>\n		<g hor-axis-der height=\'vm.height\' scale=\'vm.Hor\' fun=\'vm.horAxFun\' shifter=\'[0,vm.height]\'></g>\n		<foreignObject width=\'30\' height=\'30\' y=\'20\' shifter=\'[vm.width/2, vm.height]\'>\n				<text class=\'label\' >$t$</text>\n		</foreignObject>\n	</g>\n	<g class=\'main\' clip-path="url(#dervativeB)" shifter=\'[vm.mar.left, vm.mar.top]\'>\n		<line class=\'zero-line hor\' d3-der=\'{x1: 0, x2: vm.width, y1: vm.Ver(0), y2: vm.Ver(0)}\'/>\n		<path d3-der=\'{d:vm.lineFun(vm.data)}\' class=\'fun dv\' />\n		<line class=\'tri dv\' d3-der=\'{x1: vm.Hor(vm.point.t)-1, x2: vm.Hor(vm.point.t)-1, y1: vm.Ver(0), y2: vm.Ver(vm.point.dv)}\'/>\n		<foreignObject width=\'30\' height=\'30\' shifter=\'[(vm.Hor(vm.point.t) - 16), vm.Ver(vm.point.dv*.5)-6]\'>\n				<text class=\'tri-label\'>$\\dot{y}$</text>\n		</foreignObject>\n		<foreignObject width=\'100\' height=\'30\' shifter=\'[vm.Hor(.9), vm.Ver(1)]\'>\n			<text class=\'tri-label\'>$\\cos(t)$</text>\n		</foreignObject>\n		<circle r=\'3px\'  shifter=\'[vm.Hor(vm.point.t), vm.Ver(vm.point.dv)]\' class=\'point dv\'/>\n	</g>\n</svg>';

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
var Ctrl, Data, angular, d3, der, template,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

angular = require('angular');

d3 = require('d3');

Data = require('./designData');

require('../../helpers');

template = '<svg ng-init=\'vm.resize()\' width=\'100%\' class=\'bottomChart\'>\n	<defs>\n		<clippath id=\'plotA\'>\n			<rect d3-der=\'{width: vm.width, height: vm.height}\'></rect>\n		</clippath>\n	</defs>\n	<g class=\'boilerplate\' shifter=\'[vm.mar.left, vm.mar.top]\'>\n		<rect class=\'background\' d3-der=\'{width: vm.width, height: vm.height}\' behavior=\'vm.drag_rect\' />\n		<g ver-axis-der width=\'vm.width\' scale=\'vm.Ver\' fun=\'vm.verAxFun\'></g>\n		<g hor-axis-der height=\'vm.height\' scale=\'vm.Hor\' fun=\'vm.horAxFun\' shifter=\'[0,vm.height]\'></g>\n		<foreignObject width=\'30\' height=\'30\' shifter=\'[-38, vm.height/2]\'>\n				<text class=\'label\'>$v$</text>\n		</foreignObject>\n		<foreignObject width=\'30\' height=\'30\' y=\'20\' shifter=\'[vm.width/2, vm.height]\'>\n				<text class=\'label\' >$t$</text>\n		</foreignObject>\n	</g>\n	<g class=\'main\' clip-path="url(#plotA)" shifter=\'[vm.mar.left, vm.mar.top]\' >\n		<line class=\'zero-line\' d3-der=\'{x1: 0, x2: vm.width, y1: vm.Ver(0), y2: vm.Ver(0)}\' />\n		<line class=\'zero-line\' d3-der="{x1: vm.Hor(0), x2: vm.Hor(0), y1: vm.height, y2: 0}" />\n		<g ng-class=\'{hide: !vm.Data.show}\' >\n			<line class=\'tri v\' d3-der=\'{x1: vm.Hor(vm.selected.t)-1, x2: vm.Hor(vm.selected.t)-1, y1: vm.Ver(0), y2: vm.Ver(vm.selected.v)}\'/>\n			<path ng-attr-d=\'{{vm.triangleData()}}\' class=\'tri\' />\n			<line d3-der=\'{x1: vm.Hor(vm.selected.t)+1, x2: vm.Hor(vm.selected.t)+1, y1: vm.Ver(vm.selected.v), y2: vm.Ver(vm.selected.v + vm.selected.dv)}\' class=\'tri dv\' />\n		</g>\n		<path ng-attr-d=\'{{vm.lineFun(vm.Data.Cart.trajectory)}}\' class=\'fun target\' />\n		<path ng-attr-d=\'{{vm.lineFun(vm.Data.dots)}}\' class=\'fun v\' />\n		<g ng-repeat=\'dot in vm.dots track by dot.id\' datum=dot shifter=\'[vm.Hor(dot.t),vm.Ver(dot.v)]\' behavior=\'vm.drag\' dot-der=dot ></g>\n		<circle class=\'dot small\' r=\'4\' shifter=\'[vm.Hor(vm.Data.first.t),vm.Ver(vm.Data.first.v)]\' />\n		<foreignObject width=\'70\' height=\'30\' shifter=\'[vm.Hor(4), vm.Ver(.33)]\'>\n				<text class=\'tri-label\' >$2e^{-.8t}$</text>\n		</foreignObject>\n	</g>\n</svg>';

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



},{"../../helpers":28,"./designData":15,"angular":undefined,"d3":undefined}],11:[function(require,module,exports){
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
        if (Data.t > 4) {
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

template = '<svg ng-init=\'vm.resize()\' width=\'100%\' class=\'cartChart\' ng-attr-height=\'{{::vm.svgHeight}}\'>\n	<g shifter=\'{{::[vm.mar.left, vm.mar.top]}}\'>\n		<rect d3-der=\'{width: vm.width, height: vm.height}\' class=\'background\'/>\n		<g hor-axis-der height=\'vm.height\' scale=\'vm.X\' fun=\'vm.axisFun\' shifter=\'[0,vm.height]\'></g>\n		<g class=\'g-cart\' ng-repeat=\'t in vm.sample\' d3-der=\'{transform: "translate(" + vm.X(vm.Cart.loc(t)) + ",0)"}\' style=\'opacity:.3;\'>\n			<line class=\'time-line\' d3-der=\'{x1: 0, x2: 0, y1: 0, y2: 60}\' />\n		</g>\n		<g class=\'g-cart\' cart-object-der left=\'vm.X(vm.Cart.x)\' transform=\'translate(0,25)\'></g>\n	</g>\n</svg>';

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

template = '<svg ng-init=\'vm.resize()\' width=\'100%\' class=\'cartChart\' ng-attr-height=\'{{::vm.svgHeight}}\'>\n	<g shifter=\'{{::[vm.mar.left, vm.mar.top]}}\'>\n		<rect d3-der=\'{width: vm.width, height: vm.height}\' class=\'background\'/>\n		<g hor-axis-der height=\'vm.height\' scale=\'vm.X\' fun=\'vm.axisFun\' shifter=\'[0,vm.height]\'></g>\n		<foreignObject width=\'30\' height=\'30\' y=\'20\' shifter=\'[vm.width/2, vm.height]\'>\n				<text class=\'label\' >$x$</text>\n		</foreignObject>\n		<g class=\'g-cart\' ng-repeat=\'t in vm.sample\' d3-der=\'{transform: "translate(" + vm.X(vm.Cart.loc(t)) + ",0)"}\' style=\'opacity:.3;\'>\n			<line class=\'time-line\' d3-der=\'{x1: 0, x2: 0, y1: 0, y2: 60}\' />\n		</g>\n		<g class=\'g-cart\' cart-object-der left=\'vm.X(vm.Cart.x)\' transform=\'translate(0,25)\'></g>\n	</g>\n</svg>';

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
      dot: '=dotDer'
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvbGV3aXMvUmVzZWFyY2gvZGlmZkVRX25ldy9hcHAvYXBwLmNvZmZlZSIsIi9Vc2Vycy9sZXdpcy9SZXNlYXJjaC9kaWZmRVFfbmV3L2FwcC9jb21wb25lbnRzL2NhcnQvY2FydEJ1dHRvbnMuY29mZmVlIiwiL1VzZXJzL2xld2lzL1Jlc2VhcmNoL2RpZmZFUV9uZXcvYXBwL2NvbXBvbmVudHMvY2FydC9jYXJ0RGF0YS5jb2ZmZWUiLCIvVXNlcnMvbGV3aXMvUmVzZWFyY2gvZGlmZkVRX25ldy9hcHAvY29tcG9uZW50cy9jYXJ0L2NhcnRPYmplY3QuY29mZmVlIiwiL1VzZXJzL2xld2lzL1Jlc2VhcmNoL2RpZmZFUV9uZXcvYXBwL2NvbXBvbmVudHMvY2FydC9jYXJ0UGxvdC5jb2ZmZWUiLCIvVXNlcnMvbGV3aXMvUmVzZWFyY2gvZGlmZkVRX25ldy9hcHAvY29tcG9uZW50cy9jYXJ0L2NhcnRTaW0uY29mZmVlIiwiL1VzZXJzL2xld2lzL1Jlc2VhcmNoL2RpZmZFUV9uZXcvYXBwL2NvbXBvbmVudHMvZGVyaXZhdGl2ZS9kZXJpdmF0aXZlLmNvZmZlZSIsIi9Vc2Vycy9sZXdpcy9SZXNlYXJjaC9kaWZmRVFfbmV3L2FwcC9jb21wb25lbnRzL2Rlcml2YXRpdmUvZGVyaXZhdGl2ZUIuY29mZmVlIiwiL1VzZXJzL2xld2lzL1Jlc2VhcmNoL2RpZmZFUV9uZXcvYXBwL2NvbXBvbmVudHMvZGVyaXZhdGl2ZS9kZXJpdmF0aXZlRGF0YS5jb2ZmZWUiLCIvVXNlcnMvbGV3aXMvUmVzZWFyY2gvZGlmZkVRX25ldy9hcHAvY29tcG9uZW50cy9kZXNpZ24vZGVzaWduQS5jb2ZmZWUiLCIvVXNlcnMvbGV3aXMvUmVzZWFyY2gvZGlmZkVRX25ldy9hcHAvY29tcG9uZW50cy9kZXNpZ24vZGVzaWduQi5jb2ZmZWUiLCIvVXNlcnMvbGV3aXMvUmVzZWFyY2gvZGlmZkVRX25ldy9hcHAvY29tcG9uZW50cy9kZXNpZ24vZGVzaWduQnV0dG9ucy5jb2ZmZWUiLCIvVXNlcnMvbGV3aXMvUmVzZWFyY2gvZGlmZkVRX25ldy9hcHAvY29tcG9uZW50cy9kZXNpZ24vZGVzaWduQ2FydEEuY29mZmVlIiwiL1VzZXJzL2xld2lzL1Jlc2VhcmNoL2RpZmZFUV9uZXcvYXBwL2NvbXBvbmVudHMvZGVzaWduL2Rlc2lnbkNhcnRCLmNvZmZlZSIsIi9Vc2Vycy9sZXdpcy9SZXNlYXJjaC9kaWZmRVFfbmV3L2FwcC9jb21wb25lbnRzL2Rlc2lnbi9kZXNpZ25EYXRhLmNvZmZlZSIsIi9Vc2Vycy9sZXdpcy9SZXNlYXJjaC9kaWZmRVFfbmV3L2FwcC9jb21wb25lbnRzL2Rlc2lnbi9kb3QuY29mZmVlIiwiL1VzZXJzL2xld2lzL1Jlc2VhcmNoL2RpZmZFUV9uZXcvYXBwL2NvbXBvbmVudHMvZGVzaWduL2RvdEIuY29mZmVlIiwiL1VzZXJzL2xld2lzL1Jlc2VhcmNoL2RpZmZFUV9uZXcvYXBwL2NvbXBvbmVudHMvZGVzaWduL2Zha2VDYXJ0LmNvZmZlZSIsIi9Vc2Vycy9sZXdpcy9SZXNlYXJjaC9kaWZmRVFfbmV3L2FwcC9jb21wb25lbnRzL2Rlc2lnbi90cnVlQ2FydC5jb2ZmZWUiLCIvVXNlcnMvbGV3aXMvUmVzZWFyY2gvZGlmZkVRX25ldy9hcHAvY29tcG9uZW50cy9yZWd1bGFyL3JlZ3VsYXIuY29mZmVlIiwiL1VzZXJzL2xld2lzL1Jlc2VhcmNoL2RpZmZFUV9uZXcvYXBwL2RpcmVjdGl2ZXMvYmVoYXZpb3IuY29mZmVlIiwiL1VzZXJzL2xld2lzL1Jlc2VhcmNoL2RpZmZFUV9uZXcvYXBwL2RpcmVjdGl2ZXMvZDNEZXIuY29mZmVlIiwiL1VzZXJzL2xld2lzL1Jlc2VhcmNoL2RpZmZFUV9uZXcvYXBwL2RpcmVjdGl2ZXMvZGF0dW0uY29mZmVlIiwiL1VzZXJzL2xld2lzL1Jlc2VhcmNoL2RpZmZFUV9uZXcvYXBwL2RpcmVjdGl2ZXMvc2hpZnRlci5jb2ZmZWUiLCIvVXNlcnMvbGV3aXMvUmVzZWFyY2gvZGlmZkVRX25ldy9hcHAvZGlyZWN0aXZlcy90ZXh0dXJlLmNvZmZlZSIsIi9Vc2Vycy9sZXdpcy9SZXNlYXJjaC9kaWZmRVFfbmV3L2FwcC9kaXJlY3RpdmVzL3hBeGlzLmNvZmZlZSIsIi9Vc2Vycy9sZXdpcy9SZXNlYXJjaC9kaWZmRVFfbmV3L2FwcC9kaXJlY3RpdmVzL3lBeGlzLmNvZmZlZSIsIi9Vc2Vycy9sZXdpcy9SZXNlYXJjaC9kaWZmRVFfbmV3L2FwcC9oZWxwZXJzLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBLFlBQUEsQ0FBQTtBQUFBLElBQUEsd0JBQUE7O0FBQUEsT0FDQSxHQUFVLE9BQUEsQ0FBUSxTQUFSLENBRFYsQ0FBQTs7QUFBQSxFQUVBLEdBQUssT0FBQSxDQUFRLElBQVIsQ0FGTCxDQUFBOztBQUFBLEdBR0EsR0FBTSxPQUFPLENBQUMsTUFBUixDQUFlLFNBQWYsRUFBMEIsQ0FBQyxPQUFBLENBQVEsa0JBQVIsQ0FBRCxDQUExQixDQUNMLENBQUMsU0FESSxDQUNNLFlBRE4sRUFDb0IsT0FBQSxDQUFRLG9CQUFSLENBRHBCLENBRUwsQ0FBQyxTQUZJLENBRU0sWUFGTixFQUVvQixPQUFBLENBQVEsb0JBQVIsQ0FGcEIsQ0FHTCxDQUFDLFNBSEksQ0FHTSxZQUhOLEVBR29CLE9BQUEsQ0FBUSwyQkFBUixDQUhwQixDQUlMLENBQUMsU0FKSSxDQUlNLGVBSk4sRUFJdUIsT0FBQSxDQUFRLDhCQUFSLENBSnZCLENBS0wsQ0FBQyxTQUxJLENBS00sZ0JBTE4sRUFLd0IsT0FBQSxDQUFRLCtCQUFSLENBTHhCLENBTUwsQ0FBQyxTQU5JLENBTU0sU0FOTixFQU1rQixPQUFBLENBQVEsc0JBQVIsQ0FObEIsQ0FPTCxDQUFDLFNBUEksQ0FPTSxZQVBOLEVBT29CLE9BQUEsQ0FBUSw2QkFBUixDQVBwQixDQVFMLENBQUMsU0FSSSxDQVFNLFVBUk4sRUFRa0IsT0FBQSxDQUFRLHVCQUFSLENBUmxCLENBU0wsQ0FB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a0JBQWIsRUFBaUMsTUFBakMsRUFBMEMsSUFBMUMsRUFmSztJQUFBLENBVE47SUFGSTtBQUFBLENBSE4sQ0FBQTs7QUFBQSxNQWdDTSxDQUFDLE9BQVAsR0FBaUIsR0FoQ2pCLENBQUE7Ozs7O0FDQUEsWUFBQSxDQUFBO0FBQUEsTUFFTSxDQUFDLE9BQU8sQ0FBQyxPQUFmLEdBQXlCLFNBQUMsR0FBRCxFQUFNLElBQU4sR0FBQTtTQUN2QixFQUFFLENBQUMsS0FBSCxDQUFTLENBQUEsU0FBQSxLQUFBLEdBQUE7V0FBQSxTQUFBLEdBQUE7QUFDUixNQUFBLEdBQUEsQ0FBQSxDQUFBLENBQUE7YUFDQSxLQUZRO0lBQUEsRUFBQTtFQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBVCxFQUdDLElBSEQsRUFEdUI7QUFBQSxDQUZ6QixDQUFBOztBQUFBLFFBU1EsQ0FBQSxTQUFFLENBQUEsUUFBVixHQUFxQixTQUFDLElBQUQsRUFBTyxJQUFQLEdBQUE7U0FDbkIsTUFBTSxDQUFDLGNBQVAsQ0FBc0IsSUFBQyxDQUFBLFNBQXZCLEVBQWtDLElBQWxDLEVBQXdDLElBQXhDLEVBRG1CO0FBQUEsQ0FUckIsQ0FBQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIndXNlIHN0cmljdCdcbmFuZ3VsYXIgPSByZXF1aXJlICdhbmd1bGFyJ1xuZDMgPSByZXF1aXJlICdkMydcbmFwcCA9IGFuZ3VsYXIubW9kdWxlICdtYWluQXBwJywgW3JlcXVpcmUgJ2FuZ3VsYXItbWF0ZXJpYWwnXVxuXHQuZGlyZWN0aXZlICdob3JBeGlzRGVyJywgcmVxdWlyZSAnLi9kaXJlY3RpdmVzL3hBeGlzJ1xuXHQuZGlyZWN0aXZlICd2ZXJBeGlzRGVyJywgcmVxdWlyZSAnLi9kaXJlY3RpdmVzL3lBeGlzJ1xuXHQuZGlyZWN0aXZlICdjYXJ0U2ltRGVyJywgcmVxdWlyZSAnLi9jb21wb25lbnRzL2NhcnQvY2FydFNpbSdcblx0LmRpcmVjdGl2ZSAnY2FydE9iamVjdERlcicsIHJlcXVpcmUgJy4vY29tcG9uZW50cy9jYXJ0L2NhcnRPYmplY3QnXG5cdC5kaXJlY3RpdmUgJ2NhcnRCdXR0b25zRGVyJywgcmVxdWlyZSAnLi9jb21wb25lbnRzL2NhcnQvY2FydEJ1dHRvbnMnXG5cdC5kaXJlY3RpdmUgJ3NoaWZ0ZXInICwgcmVxdWlyZSAnLi9kaXJlY3RpdmVzL3NoaWZ0ZXInXG5cdC5kaXJlY3RpdmUgJ2Rlc2lnbkFEZXInLCByZXF1aXJlICcuL2NvbXBvbmVudHMvZGVzaWduL2Rlc2lnbkEnXG5cdC5kaXJlY3RpdmUgJ2JlaGF2aW9yJywgcmVxdWlyZSAnLi9kaXJlY3RpdmVzL2JlaGF2aW9yJ1xuXHQuZGlyZWN0aXZlICdkb3REZXInLCByZXF1aXJlICcuL2NvbXBvbmVudHMvZGVzaWduL2RvdCdcblx0LmRpcmVjdGl2ZSAnZG90QkRlcicsIHJlcXVpcmUgJy4vY29tcG9uZW50cy9kZXNpZ24vZG90Qidcblx0LmRpcmVjdGl2ZSAnZGF0dW0nLCByZXF1aXJlICcuL2RpcmVjdGl2ZXMvZGF0dW0nXG5cdC5kaXJlY3RpdmUgJ2QzRGVyJywgcmVxdWlyZSAnLi9kaXJlY3RpdmVzL2QzRGVyJ1xuXHQuZGlyZWN0aXZlICdkZXNpZ25CRGVyJyAsIHJlcXVpcmUgJy4vY29tcG9uZW50cy9kZXNpZ24vZGVzaWduQidcblx0LmRpcmVjdGl2ZSAncmVndWxhckRlcicsIHJlcXVpcmUgJy4vY29tcG9uZW50cy9yZWd1bGFyL3JlZ3VsYXInXG5cdC5kaXJlY3RpdmUgJ2Rlcml2YXRpdmVEZXInLCByZXF1aXJlICcuL2NvbXBvbmVudHMvZGVyaXZhdGl2ZS9kZXJpdmF0aXZlJ1xuXHQuZGlyZWN0aXZlICdkZXJpdmF0aXZlQkRlcicsIHJlcXVpcmUgJy4vY29tcG9uZW50cy9kZXJpdmF0aXZlL2Rlcml2YXRpdmVCJ1xuXHQuZGlyZWN0aXZlICdjYXJ0UGxvdERlcicsIHJlcXVpcmUgJy4vY29tcG9uZW50cy9jYXJ0L2NhcnRQbG90J1xuXHQuZGlyZWN0aXZlICdkZXNpZ25DYXJ0QURlcicsIHJlcXVpcmUgJy4vY29tcG9uZW50cy9kZXNpZ24vZGVzaWduQ2FydEEnXG5cdC5kaXJlY3RpdmUgJ2Rlc2lnbkNhcnRCRGVyJywgcmVxdWlyZSAnLi9jb21wb25lbnRzL2Rlc2lnbi9kZXNpZ25DYXJ0Qidcblx0LmRpcmVjdGl2ZSAndGV4dHVyZURlcicsIHJlcXVpcmUgJy4vZGlyZWN0aXZlcy90ZXh0dXJlJ1xuXHQuZGlyZWN0aXZlICdkZXNpZ25CdXR0b25zRGVyJywgcmVxdWlyZSAnLi9jb21wb25lbnRzL2Rlc2lnbi9kZXNpZ25CdXR0b25zJ1xuXG5sb29wZXIgPSAtPlxuICAgIHNldFRpbWVvdXQoICgpLT5cbiAgICBcdFx0XHRkMy5zZWxlY3RBbGwgJ2NpcmNsZS5kb3QubGFyZ2UnXG4gICAgXHRcdFx0XHQudHJhbnNpdGlvbiAnZ3JvdydcbiAgICBcdFx0XHRcdC5kdXJhdGlvbiA1MDBcbiAgICBcdFx0XHRcdC5lYXNlICdjdWJpYy1vdXQnXG4gICAgXHRcdFx0XHQuYXR0ciAndHJhbnNmb3JtJywgJ3NjYWxlKCAxLjM0KSdcbiAgICBcdFx0XHRcdC50cmFuc2l0aW9uICdzaHJpbmsnXG4gICAgXHRcdFx0XHQuZHVyYXRpb24gNTAwXG4gICAgXHRcdFx0XHQuZWFzZSAnY3ViaWMtb3V0J1xuICAgIFx0XHRcdFx0LmF0dHIgJ3RyYW5zZm9ybScsICdzY2FsZSggMS4wKSdcbiAgICBcdFx0XHRsb29wZXIoKVxuICAgIFx0XHQsIDEwMDApXG5cbmxvb3BlcigpXG4iLCJfID0gcmVxdWlyZSAnbG9kYXNoJ1xue2V4cCwgc3FydCwgYXRhbn0gPSBNYXRoXG5DYXJ0ID0gcmVxdWlyZSAnLi9jYXJ0RGF0YSdcblxudGVtcGxhdGUgPSAnJydcblx0PG1kLWJ1dHRvbiBjbGFzcz0nbXlCdXR0b24nIG5nLWNsaWNrPSd2bS5jbGljaygpJyBuZy1pbml0PSd2bS5wbGF5KCknPnt7dm0ucGF1c2VkID8gJ1BMQVknIDogJ1BBVVNFJ319IDwvbWQtYnV0dG9uPlxuJycnXG5cbmNsYXNzIEN0cmxcblx0Y29uc3RydWN0b3I6IChAc2NvcGUpLT5cblxuXHRjbGljazogLT5cblx0XHRpZiBAcGF1c2VkIHRoZW4gQHBsYXkoKSBlbHNlIEBwYXVzZSgpXG5cblx0cGxheTogLT5cblx0XHRAcGF1c2VkID0gdHJ1ZVxuXHRcdGQzLnRpbWVyLmZsdXNoKClcblx0XHRAcGF1c2VkID0gZmFsc2Vcblx0XHRsYXN0ID0gMFxuXHRcdGQzLnRpbWVyIChlbGFwc2VkKT0+XG5cdFx0XHRcdGR0ID0gZWxhcHNlZCAtIGxhc3Rcblx0XHRcdFx0Q2FydC5pbmNyZW1lbnQgZHQvMTAwMFxuXHRcdFx0XHRsYXN0ID0gZWxhcHNlZFxuXHRcdFx0XHRpZiBDYXJ0LnQgPiA0XG5cdFx0XHRcdFx0Q2FydC5zZXRfdCAwXG5cdFx0XHRcdEBzY29wZS4kZXZhbEFzeW5jKClcblx0XHRcdFx0QHBhdXNlZFxuXHRcdFx0LCAxXG5cblx0cGF1c2U6IC0+XG5cdFx0QHBhdXNlZCA9IHRydWVcblxuZGVyID0gKCktPlxuXHRkaXJlY3RpdmUgPSBcblx0XHRjb250cm9sbGVyQXM6ICd2bSdcblx0XHRzY29wZToge31cblx0XHRjb250cm9sbGVyOiBbJyRzY29wZScsIEN0cmxdXG5cdFx0dGVtcGxhdGU6IHRlbXBsYXRlXG5cbm1vZHVsZS5leHBvcnRzID0gZGVyIiwiXyA9IHJlcXVpcmUgJ2xvZGFzaCdcbntleHB9ID0gTWF0aFxuXG5jbGFzcyBDYXJ0XG5cdGNvbnN0cnVjdG9yOiAoQG9wdGlvbnMpLT5cblx0XHR7QHYwLCBAa30gPSBAb3B0aW9uc1xuXHRcdEByZXN0YXJ0KClcblx0cmVzdGFydDogLT5cblx0XHRAdCA9IEB4ID0gMFxuXHRcdEB0cmFqZWN0b3J5ID0gXy5yYW5nZSAwICwgNiAsIDEvNTBcblx0XHRcdC5tYXAgKHQpPT5cblx0XHRcdFx0diA9IEB2MCAqIGV4cCgtQGsgKiB0KVxuXHRcdFx0XHRyZXMgPSBcblx0XHRcdFx0XHR2OiB2XG5cdFx0XHRcdFx0eDogQHYwL0BrICogKDEtZXhwKC1Aayp0KSlcblx0XHRcdFx0XHRkdjogLUBrKnZcblx0XHRcdFx0XHR0OiB0XG5cdFx0QG1vdmUgMFxuXHRcdEBwYXVzZWQgPSB0cnVlXG5cdHNldF90OiAodCktPlxuXHRcdEB0ID0gdFxuXHRcdEBtb3ZlIHRcblx0aW5jcmVtZW50OiAoZHQpLT5cblx0XHRAdCs9ZHRcblx0XHRAbW92ZSBAdFxuXHRtb3ZlOiAodCktPlxuXHRcdEB2ID0gQHYwICogZXhwKCAtQGsgKiB0KVxuXHRcdEB4ID0gQHYwL0BrICogKDEtZXhwKC1Aayp0KSlcblx0XHRAZHYgPSAtQGsqQHZcblxubW9kdWxlLmV4cG9ydHMgPSBuZXcgQ2FydCB7djA6IDIsIGs6IC44fSIsIlxuY2xhc3MgQ3RybFxuXHRjb25zdHJ1Y3RvcjooQHNjb3BlLCBAZWwsIEB3aW5kb3cpLT5cblxuXHR0cmFuczogKHRyYW4pLT5cblx0XHR0cmFuXG5cdFx0XHQuZHVyYXRpb24gNTBcblx0XHRcdC5lYXNlICdsaW5lYXInXG5cbmRlciA9ICgpLT5cblx0ZGlyZWN0aXZlID0gXG5cdFx0c2NvcGU6IFxuXHRcdFx0IyBkYXRhOiAnPUNhcnRPYmplY3REZXInXG5cdFx0XHRsZWZ0OiAnPSdcblx0XHRjb250cm9sbGVyQXM6ICd2bSdcblx0XHR0ZW1wbGF0ZU5hbWVzcGFjZTogJ3N2Zydcblx0XHRjb250cm9sbGVyOiBbJyRzY29wZScsJyRlbGVtZW50JywnJHdpbmRvdycsIEN0cmxdXG5cdFx0dGVtcGxhdGVVcmw6ICcuL2FwcC9jb21wb25lbnRzL2NhcnQvY2FydC5zdmcnXG5cdFx0YmluZFRvQ29udHJvbGxlcjogdHJ1ZVxuXHRcdHJlc3RyaWN0OiAnQSdcblxubW9kdWxlLmV4cG9ydHMgPSBkZXIiLCJhbmd1bGFyID0gcmVxdWlyZSAnYW5ndWxhcidcbmQzID0gcmVxdWlyZSAnZDMnXG5yZXF1aXJlICcuLi8uLi9oZWxwZXJzJ1xuXyA9IHJlcXVpcmUgJ2xvZGFzaCdcbkNhcnQgPSByZXF1aXJlICcuL2NhcnREYXRhJ1xudGVtcGxhdGUgPSAnJydcblx0PHN2ZyBuZy1pbml0PSd2bS5yZXNpemUoKScgd2lkdGg9JzEwMCUnIGNsYXNzPSd0b3BDaGFydCc+XG5cdFx0PGRlZnM+XG5cdFx0XHQ8Y2xpcHBhdGggaWQ9J2NhcnRQbG90Jz5cblx0XHRcdFx0PHJlY3QgZDMtZGVyPSd7d2lkdGg6IHZtLndpZHRoLCBoZWlnaHQ6IHZtLmhlaWdodH0nIC8+XG5cdFx0XHQ8L2NsaXBwYXRoPlxuXHRcdDwvZGVmcz5cblx0XHQ8ZyBjbGFzcz0nYm9pbGVycGxhdGUnIHNoaWZ0ZXI9J1t2bS5tYXIubGVmdCwgdm0ubWFyLnRvcF0nPlxuXHRcdFx0PHJlY3QgY2xhc3M9J2JhY2tncm91bmQnIGQzLWRlcj0ne3dpZHRoOiB2bS53aWR0aCwgaGVpZ2h0OiB2bS5oZWlnaHR9JyAvPlxuXHRcdFx0PGcgdmVyLWF4aXMtZGVyIHdpZHRoPSd2bS53aWR0aCcgc2NhbGU9J3ZtLlYnIGZ1bj0ndm0udmVyQXhGdW4nPjwvZz5cblx0XHRcdDxnIGhvci1heGlzLWRlciBoZWlnaHQ9J3ZtLmhlaWdodCcgc2NhbGU9J3ZtLlQnIGZ1bj0ndm0uaG9yQXhGdW4nIHNoaWZ0ZXI9J1swLHZtLmhlaWdodF0nPjwvZz5cblx0XHRcdDxmb3JlaWduT2JqZWN0IHdpZHRoPSczMCcgaGVpZ2h0PSczMCcgeT0nMTcnIHNoaWZ0ZXI9J1t2bS53aWR0aC8yLCB2bS5oZWlnaHRdJz5cblx0XHRcdFx0PHRleHQgY2xhc3M9J2xhYmVsJyA+JHQkPC90ZXh0PlxuXHRcdFx0PC9mb3JlaWduT2JqZWN0PlxuXHRcdFx0PGZvcmVpZ25PYmplY3Qgd2lkdGg9JzMwJyBoZWlnaHQ9JzMwJyBzaGlmdGVyPSdbLTMxLCB2bS5oZWlnaHQvMi04XSc+XG5cdFx0XHRcdFx0PHRleHQgY2xhc3M9J2xhYmVsJyA+JHYkPC90ZXh0PlxuXHRcdFx0PC9mb3JlaWduT2JqZWN0PlxuXHRcdFx0PGxpbmUgY2xhc3M9J3plcm8tbGluZScgZDMtZGVyPVwie3gxOiAwICwgeDI6IHZtLndpZHRoLCB5MTogdm0uVigwKSwgeTI6IHZtLlYoMCl9XCIgLz4gXG5cdFx0XHQ8bGluZSBjbGFzcz0nemVyby1saW5lJyBkMy1kZXI9XCJ7eDE6IHZtLlQoMCkgLCB4Mjogdm0uVCgwKSwgeTE6IDAsIHkyOiB2bS5oZWlnaHR9XCIgLz4gXG5cdFx0PC9nPlxuXHRcdDxnIGNsYXNzPSdtYWluJyBjbGlwLXBhdGg9XCJ1cmwoI2NhcnRQbG90KVwiIHNoaWZ0ZXI9J1t2bS5tYXIubGVmdCwgdm0ubWFyLnRvcF0nPlxuXHRcdFx0PGZvcmVpZ25PYmplY3Qgd2lkdGg9JzMwJyBoZWlnaHQ9JzMwJyBzaGlmdGVyPSdbKHZtLlQodm0ucG9pbnQudCkgLSAxNiksIHZtLnN0aGluZ10nIHN0eWxlPSdmb250LXNpemU6IDEzcHg7IGZvbnQtd2VpZ2h0OiAxMDA7Jz5cblx0XHRcdFx0XHQ8dGV4dCBjbGFzcz0nbGFiZWwnIGZvbnQtc2l6ZT0nMTNweCc+JHYkPC90ZXh0PlxuXHRcdFx0PC9mb3JlaWduT2JqZWN0PlxuXHRcdFx0PGxpbmUgY2xhc3M9J3RyaSB2JyBkMy1kZXI9J3t4MTogdm0uVCh2bS5wb2ludC50KS0xLCB4Mjogdm0uVCh2bS5wb2ludC50KS0xLCB5MTogdm0uVigwKSwgeTI6IHZtLlYodm0ucG9pbnQudil9Jy8+XG5cdFx0XHQ8cGF0aCBuZy1hdHRyLWQ9J3t7dm0ubGluZUZ1bih2bS50cmFqZWN0b3J5KX19JyBjbGFzcz0nZnVuIHYnIC8+XG5cdFx0XHQ8Y2lyY2xlIHI9JzNweCcgc2hpZnRlcj0nW3ZtLlQodm0ucG9pbnQudCksIHZtLlYodm0ucG9pbnQudildJyBjbGFzcz0ncG9pbnQgdicvPlxuXHRcdFx0PGZvcmVpZ25PYmplY3Qgd2lkdGg9JzcwJyBoZWlnaHQ9JzMwJyBzaGlmdGVyPSdbdm0uVCg0KSwgdm0uViguNCldJz5cblx0XHRcdFx0XHQ8dGV4dCBjbGFzcz0ndHJpLWxhYmVsJyA+JDJlXnstLjh0fSQ8L3RleHQ+XG5cdFx0XHQ8L2ZvcmVpZ25PYmplY3Q+XG5cdFx0PC9nPlxuXHQ8L3N2Zz5cbicnJ1xuXG5jbGFzcyBDdHJsXG5cdGNvbnN0cnVjdG9yOiAoQHNjb3BlLCBAZWwsIEB3aW5kb3cpLT5cblx0XHRAbWFyID0gXG5cdFx0XHRsZWZ0OiAzMFxuXHRcdFx0dG9wOiAyMFxuXHRcdFx0cmlnaHQ6IDIwXG5cdFx0XHRib3R0b206IDM1XG5cblx0XHRAViA9IGQzLnNjYWxlLmxpbmVhcigpLmRvbWFpbiBbLS4xLDIuNV1cblx0XHRAVCA9IGQzLnNjYWxlLmxpbmVhcigpLmRvbWFpbiBbLS4xLDVdXG5cblx0XHRAcG9pbnQgPSBDYXJ0XG5cdFx0QHRyYWplY3RvcnkgPSBDYXJ0LnRyYWplY3RvcnlcblxuXHRcdEBob3JBeEZ1biA9IGQzLnN2Zy5heGlzKClcblx0XHRcdC5zY2FsZSBAVFxuXHRcdFx0LnRpY2tzIDVcblx0XHRcdC5vcmllbnQgJ2JvdHRvbSdcblxuXHRcdEB2ZXJBeEZ1biA9IGQzLnN2Zy5heGlzKClcblx0XHRcdC5zY2FsZSBAVlxuXHRcdFx0LnRpY2tzIDVcblx0XHRcdC5vcmllbnQgJ2xlZnQnXG5cdFx0XG5cdFx0QGxpbmVGdW4gPSBkMy5zdmcubGluZSgpXG5cdFx0XHQueSAoZCk9PiBAViBkLnZcblx0XHRcdC54IChkKT0+IEBUIGQudFxuXG5cdFx0YW5ndWxhci5lbGVtZW50IEB3aW5kb3dcblx0XHRcdC5vbiAncmVzaXplJywgQHJlc2l6ZVxuXG5cdFx0QG1vdmUgPSAoZXZlbnQpID0+XG5cdFx0XHRpZiBub3QgQ2FydC5wYXVzZWQgdGhlbiByZXR1cm5cblx0XHRcdHJlY3QgPSBldmVudC50YXJnZXQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KClcblx0XHRcdHQgPSBAVC5pbnZlcnQgZXZlbnQueCAtIHJlY3QubGVmdFxuXHRcdFx0dCA9IE1hdGgubWF4IDAgLCB0XG5cdFx0XHRDYXJ0LnNldF90IHRcblx0XHRcdEBzY29wZS4kZXZhbEFzeW5jKClcblxuXHRAcHJvcGVydHkgJ3N0aGluZycsIGdldDotPlxuXHRcdEBWKEBwb2ludC52LzIpIC0gN1xuXG5cdEBwcm9wZXJ0eSAnc3ZnX2hlaWdodCcsIGdldDogLT4gQGhlaWdodCArIEBtYXIudG9wICsgQG1hci5ib3R0b21cblxuXHRyZXNpemU6ICgpPT5cblx0XHRAd2lkdGggPSBAZWxbMF0uY2xpZW50V2lkdGggLSBAbWFyLmxlZnQgLSBAbWFyLnJpZ2h0XG5cdFx0QGhlaWdodCA9IEBlbFswXS5jbGllbnRIZWlnaHQgLSBAbWFyLmxlZnQgLSBAbWFyLnJpZ2h0XG5cdFx0QFYucmFuZ2UgW0BoZWlnaHQsIDBdXG5cdFx0QFQucmFuZ2UgWzAsIEB3aWR0aF1cblx0XHRAc2NvcGUuJGV2YWxBc3luYygpXG5cbmRlciA9ICgpLT5cblx0ZGlyZWN0aXZlID0gXG5cdFx0Y29udHJvbGxlckFzOiAndm0nXG5cdFx0c2NvcGU6IHt9XG5cdFx0dGVtcGxhdGU6IHRlbXBsYXRlXG5cdFx0dGVtcGxhdGVOYW1lc3BhY2U6ICdzdmcnXG5cdFx0Y29udHJvbGxlcjogWyckc2NvcGUnLCckZWxlbWVudCcsICckd2luZG93JywgQ3RybF1cblxubW9kdWxlLmV4cG9ydHMgPSBkZXJcbiIsIl8gPSByZXF1aXJlICdsb2Rhc2gnXG5kMz0gcmVxdWlyZSAnZDMnXG57bWlufSA9IE1hdGhcbkNhcnQgPSByZXF1aXJlICcuL2NhcnREYXRhJ1xucmVxdWlyZSAnLi4vLi4vaGVscGVycydcblxudGVtcGxhdGUgPSAnJydcblx0PHN2ZyBuZy1pbml0PSd2bS5yZXNpemUoKScgd2lkdGg9JzEwMCUnIG5nLWF0dHItaGVpZ2h0PVwie3t2bS5zdmdIZWlnaHR9fVwiPlxuXHRcdDxnIHNoaWZ0ZXI9J3t7Ojpbdm0ubWFyLmxlZnQsIHZtLm1hci50b3BdfX0nPlxuXHRcdFx0PHJlY3QgY2xhc3M9J2JhY2tncm91bmQnIGQzLWRlcj0ne3dpZHRoOiB2bS53aWR0aCwgaGVpZ2h0OiB2bS5oZWlnaHR9JyBuZy1tb3VzZW1vdmU9J3ZtLm1vdmUoJGV2ZW50KScgLz5cblx0XHRcdDxnIGhvci1heGlzLWRlciBoZWlnaHQ9J3ZtLmhlaWdodCcgc2NhbGU9J3ZtLlgnIGZ1bj0ndm0uYXhpc0Z1bicgc2hpZnRlcj0nWzAsdm0uaGVpZ2h0XSc+PC9nPlxuXHRcdFx0PGZvcmVpZ25PYmplY3Qgd2lkdGg9JzMwJyBoZWlnaHQ9JzMwJyB5PScyMCcgc2hpZnRlcj0nW3ZtLndpZHRoLzIsIHZtLmhlaWdodF0nPlxuXHRcdFx0XHRcdDx0ZXh0IGNsYXNzPSdsYWJlbCcgPiR0JDwvdGV4dD5cblx0XHRcdDwvZm9yZWlnbk9iamVjdD5cblx0XHRcdDxnIGNsYXNzPSdnLWNhcnQnIGNhcnQtb2JqZWN0LWRlciBsZWZ0PSd2bS5YKHZtLkNhcnQueCknIHRyYW5zZm9ybT0ndHJhbnNsYXRlKDAsMjUpJz48L2c+XG5cdFx0PC9nPlxuXHQ8L3N2Zz5cbicnJ1xuXG5jbGFzcyBDdHJsXG5cdGNvbnN0cnVjdG9yOiAoQHNjb3BlLCBAZWwsIEB3aW5kb3cpLT5cblx0XHRAQ2FydCA9IENhcnRcblx0XHRAbWFyID0gXG5cdFx0XHRsZWZ0OiAzMFxuXHRcdFx0cmlnaHQ6IDEwXG5cdFx0XHR0b3A6IDEwXG5cdFx0XHRib3R0b206IDE4XG5cdFx0QFggPSBkMy5zY2FsZS5saW5lYXIoKS5kb21haW4gWy0uMSwzXSBcblxuXHRcdEBheGlzRnVuID0gZDMuc3ZnLmF4aXMoKVxuXHRcdFx0LnNjYWxlIEBYXG5cdFx0XHQudGlja3MgNVxuXHRcdFx0Lm9yaWVudCAnYm90dG9tJ1xuXG5cdFx0YW5ndWxhci5lbGVtZW50IEB3aW5kb3dcblx0XHRcdC5vbiAncmVzaXplJyAsICgpPT5AcmVzaXplKClcblxuXHR0cmFuOiAodHJhbiktPlxuXHRcdHRyYW4uZWFzZSAnbGluZWFyJ1xuXHRcdFx0LmR1cmF0aW9uIDYwXG5cblx0QHByb3BlcnR5ICdzdmdIZWlnaHQnLCBnZXQ6LT4gQGhlaWdodCArIEBtYXIudG9wK0BtYXIuYm90dG9tXG5cblx0cmVzaXplOiAoKT0+XG5cdFx0QHdpZHRoID0gQGVsWzBdLmNsaWVudFdpZHRoIC0gQG1hci5sZWZ0IC0gQG1hci5yaWdodFxuXHRcdEBoZWlnaHQgPSA2MFxuXHRcdEBYLnJhbmdlKFswLCBAd2lkdGhdKVxuXHRcdEBzY29wZS4kZXZhbEFzeW5jKClcblxuXG5cbmRlciA9ICgpLT5cblx0ZGlyZWN0aXZlID0gXG5cdFx0dGVtcGxhdGU6IHRlbXBsYXRlXG5cdFx0c2NvcGU6IHt9XG5cdFx0cmVzdHJpY3Q6ICdBJ1xuXHRcdGJpbmRUb0NvbnRyb2xsZXI6IHRydWVcblx0XHR0ZW1wbGF0ZU5hbWVzcGFjZTogJ3N2Zydcblx0XHRjb250cm9sbGVyOiBbJyRzY29wZScsICckZWxlbWVudCcsICckd2luZG93JywgQ3RybF1cblx0XHRjb250cm9sbGVyQXM6ICd2bSdcblxubW9kdWxlLmV4cG9ydHMgPSBkZXJcbiIsImFuZ3VsYXIgPSByZXF1aXJlICdhbmd1bGFyJ1xuZDMgPSByZXF1aXJlICdkMydcbnJlcXVpcmUgJy4uLy4uL2hlbHBlcnMnXG5fID0gcmVxdWlyZSAnbG9kYXNoJ1xuRGF0YSA9IHJlcXVpcmUgJy4vZGVyaXZhdGl2ZURhdGEnXG5cbnRlbXBsYXRlID0gJycnXG5cdDxzdmcgbmctaW5pdD0ndm0ucmVzaXplKCknIHdpZHRoPScxMDAlJyBjbGFzcz0ndG9wQ2hhcnQnPlxuXHRcdDxkZWZzPlxuXHRcdFx0PGNsaXBwYXRoIGlkPSdkZXJDbGlwJz5cblx0XHRcdFx0PHJlY3QgZDMtZGVyPSd7d2lkdGg6IHZtLndpZHRoLCBoZWlnaHQ6IHZtLmhlaWdodH0nPjwvcmVjdD5cblx0XHRcdDwvY2xpcHBhdGg+XG5cdFx0PC9kZWZzPlxuXHRcdDxnIGNsYXNzPSdib2lsZXJwbGF0ZScgc2hpZnRlcj0nW3ZtLm1hci5sZWZ0LCB2bS5tYXIudG9wXSc+XG5cdFx0XHQ8cmVjdCBjbGFzcz0nYmFja2dyb3VuZCcgZDMtZGVyPSd7d2lkdGg6IHZtLndpZHRoLCBoZWlnaHQ6IHZtLmhlaWdodH0nIG5nLW1vdXNlbW92ZT0ndm0ubW92ZSgkZXZlbnQpJyAvPlxuXHRcdFx0PGcgdmVyLWF4aXMtZGVyIHdpZHRoPSd2bS53aWR0aCcgc2NhbGU9J3ZtLlZlcicgZnVuPSd2bS52ZXJBeEZ1bic+PC9nPlxuXHRcdFx0PGcgaG9yLWF4aXMtZGVyIGhlaWdodD0ndm0uaGVpZ2h0JyBzY2FsZT0ndm0uSG9yJyBmdW49J3ZtLmhvckF4RnVuJyBzaGlmdGVyPSdbMCx2bS5oZWlnaHRdJz48L2c+XG5cdFx0XHQ8Zm9yZWlnbk9iamVjdCB3aWR0aD0nMzAnIGhlaWdodD0nMzAnIHk9JzIwJyBzaGlmdGVyPSdbdm0ud2lkdGgvMiwgdm0uaGVpZ2h0XSc+XG5cdFx0XHRcdFx0PHRleHQgY2xhc3M9J2xhYmVsJyA+JHQkPC90ZXh0PlxuXHRcdFx0PC9mb3JlaWduT2JqZWN0PlxuXHRcdDwvZz5cblx0XHQ8ZyBjbGFzcz0nbWFpbicgY2xpcC1wYXRoPVwidXJsKCNkZXJDbGlwKVwiIHNoaWZ0ZXI9J1t2bS5tYXIubGVmdCwgdm0ubWFyLnRvcF0nPlxuXHRcdFx0PGxpbmUgY2xhc3M9J3plcm8tbGluZSBob3InIGQzLWRlcj0ne3gxOiAwLCB4Mjogdm0ud2lkdGgsIHkxOiB2bS5WZXIoMCksIHkyOiB2bS5WZXIoMCl9Jy8+XG5cdFx0XHQ8cGF0aCBuZy1hdHRyLWQ9J3t7dm0ubGluZUZ1bih2bS5kYXRhKX19JyBjbGFzcz0nZnVuIHYnIC8+XG5cdFx0XHQ8cGF0aCBuZy1hdHRyLWQ9J3t7dm0udHJpYW5nbGVEYXRhfX0nIGNsYXNzPSd0cmknIC8+XG5cdFx0XHQ8bGluZSBjbGFzcz0ndHJpIGR2JyBkMy1kZXI9J3t4MTogdm0uSG9yKHZtLnBvaW50LnQpLTEsIHgyOiB2bS5Ib3Iodm0ucG9pbnQudCktMSwgeTE6IHZtLlZlcih2bS5wb2ludC52KSwgeTI6IHZtLlZlcigodm0ucG9pbnQudiArIHZtLnBvaW50LmR2KSl9Jy8+XG5cdFx0XHQ8Zm9yZWlnbk9iamVjdCB3aWR0aD0nMzAnIGhlaWdodD0nMzAnIHNoaWZ0ZXI9J1sodm0uSG9yKHZtLnBvaW50LnQpIC0gMTYpLCB2bS5zdGhpbmddJz5cblx0XHRcdFx0XHQ8dGV4dCBjbGFzcz0ndHJpLWxhYmVsJyA+JFxcXFxkb3R7eX0kPC90ZXh0PlxuXHRcdFx0PC9mb3JlaWduT2JqZWN0PlxuXHRcdFx0PGZvcmVpZ25PYmplY3Qgd2lkdGg9JzEwMCcgaGVpZ2h0PSczMCcgc2hpZnRlcj0nW3ZtLkhvcigxLjY1KSwgdm0uVmVyKDEuMzgpXSc+XG5cdFx0XHRcdDx0ZXh0IGNsYXNzPSd0cmktbGFiZWwnPiRcXFxcc2luKHQpJDwvdGV4dD5cblx0XHRcdDwvZm9yZWlnbk9iamVjdD5cblx0XHRcdDxjaXJjbGUgcj0nM3B4JyAgc2hpZnRlcj0nW3ZtLkhvcih2bS5wb2ludC50KSwgdm0uVmVyKHZtLnBvaW50LnYpXScgY2xhc3M9J3BvaW50IHYnLz5cblx0XHQ8L2c+XG5cdDwvc3ZnPlxuJycnXG5cdFx0XHRcbmNsYXNzIEN0cmxcblx0Y29uc3RydWN0b3I6IChAc2NvcGUsIEBlbCwgQHdpbmRvdyktPlxuXHRcdEBtYXIgPSBcblx0XHRcdGxlZnQ6IDMwXG5cdFx0XHR0b3A6IDIwXG5cdFx0XHRyaWdodDogMjBcblx0XHRcdGJvdHRvbTogMzVcblxuXHRcdEBWZXIgPSBkMy5zY2FsZS5saW5lYXIoKS5kb21haW4gWy0xLjUsMS41XVxuXHRcdEBIb3IgPSBkMy5zY2FsZS5saW5lYXIoKS5kb21haW4gWzAsNl1cblxuXHRcdEBkYXRhID0gRGF0YS5kYXRhXG5cblx0XHRAaG9yQXhGdW4gPSBkMy5zdmcuYXhpcygpXG5cdFx0XHQuc2NhbGUgQEhvclxuXHRcdFx0LnRpY2tzIDVcblx0XHRcdC5vcmllbnQgJ2JvdHRvbSdcblxuXHRcdEB2ZXJBeEZ1biA9IGQzLnN2Zy5heGlzKClcblx0XHRcdC5zY2FsZSBAVmVyXG5cdFx0XHQudGlja0Zvcm1hdCAoZCktPlxuXHRcdFx0XHRpZiBNYXRoLmZsb29yKCBkICkgIT0gZCB0aGVuIHJldHVyblxuXHRcdFx0XHRkXG5cdFx0XHQudGlja3MgNVxuXHRcdFx0Lm9yaWVudCAnbGVmdCdcblxuXHRcdEBsaW5lRnVuID0gZDMuc3ZnLmxpbmUoKVxuXHRcdFx0LnkgKGQpPT4gQFZlciBkLnZcblx0XHRcdC54IChkKT0+IEBIb3IgZC50XG5cblx0XHRhbmd1bGFyLmVsZW1lbnQgQHdpbmRvd1xuXHRcdFx0Lm9uICdyZXNpemUnLCBAcmVzaXplXG5cblx0XHRAbW92ZSA9IChldmVudCkgPT5cblx0XHRcdHQgPSBASG9yLmludmVydCBldmVudC54IC0gZXZlbnQudGFyZ2V0LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLmxlZnRcblx0XHRcdERhdGEubW92ZSB0XG5cdFx0XHRAc2NvcGUuJGV2YWxBc3luYygpXG5cblx0QHByb3BlcnR5ICdzdmdfaGVpZ2h0JywgZ2V0OiAtPiBAaGVpZ2h0ICsgQG1hci50b3AgKyBAbWFyLmJvdHRvbVxuXG5cdEBwcm9wZXJ0eSAnc3RoaW5nJywgZ2V0Oi0+XG5cdFx0QFZlcihAcG9pbnQuZHYvMiArIEBwb2ludC52KSAtIDdcblxuXHRAcHJvcGVydHkgJ3BvaW50JywgZ2V0Oi0+XG5cdFx0RGF0YS5wb2ludFxuXG5cdEBwcm9wZXJ0eSAndHJpYW5nbGVEYXRhJywgZ2V0Oi0+XG5cdFx0QGxpbmVGdW4gW3t2OiBAcG9pbnQudiwgdDogQHBvaW50LnR9LCB7djpAcG9pbnQuZHYgKyBAcG9pbnQudiwgdDogQHBvaW50LnQrMX0sIHt2OiBAcG9pbnQuZHYgKyBAcG9pbnQudiwgdDogQHBvaW50LnR9XVxuXG5cdHJlc2l6ZTogKCk9PlxuXHRcdEB3aWR0aCA9IEBlbFswXS5jbGllbnRXaWR0aCAtIEBtYXIubGVmdCAtIEBtYXIucmlnaHRcblx0XHRAaGVpZ2h0ID0gQGVsWzBdLmNsaWVudEhlaWdodCAtIEBtYXIudG9wIC0gQG1hci5ib3R0b20gLSA4XG5cdFx0QFZlci5yYW5nZSBbQGhlaWdodCwgMF1cblx0XHRASG9yLnJhbmdlIFswLCBAd2lkdGhdXG5cdFx0QHNjb3BlLiRldmFsQXN5bmMoKVxuXG5kZXIgPSAoKS0+XG5cdGRpcmVjdGl2ZSA9IFxuXHRcdGNvbnRyb2xsZXJBczogJ3ZtJ1xuXHRcdHNjb3BlOiB7fVxuXHRcdHRlbXBsYXRlOiB0ZW1wbGF0ZVxuXHRcdHRlbXBsYXRlTmFtZXNwYWNlOiAnc3ZnJ1xuXHRcdGNvbnRyb2xsZXI6IFsnJHNjb3BlJywnJGVsZW1lbnQnLCAnJHdpbmRvdycsIEN0cmxdXG5cbm1vZHVsZS5leHBvcnRzID0gZGVyXG4iLCJhbmd1bGFyID0gcmVxdWlyZSAnYW5ndWxhcidcbmQzID0gcmVxdWlyZSAnZDMnXG5yZXF1aXJlICcuLi8uLi9oZWxwZXJzJ1xuXyA9IHJlcXVpcmUgJ2xvZGFzaCdcbkRhdGEgPSByZXF1aXJlICcuL2Rlcml2YXRpdmVEYXRhJ1xuXG50ZW1wbGF0ZSA9ICcnJ1xuXHQ8c3ZnIG5nLWluaXQ9J3ZtLnJlc2l6ZSgpJyB3aWR0aD0nMTAwJScgIGNsYXNzPSd0b3BDaGFydCc+XG5cdFx0PGRlZnM+XG5cdFx0XHQ8Y2xpcHBhdGggaWQ9J2RlcnZhdGl2ZUInPlxuXHRcdFx0XHQ8cmVjdCBkMy1kZXI9J3t3aWR0aDogdm0ud2lkdGgsIGhlaWdodDogdm0uaGVpZ2h0fScgLz5cblx0XHRcdDwvY2xpcHBhdGg+XG5cdFx0PC9kZWZzPlxuXHRcdDxnIGNsYXNzPSdib2lsZXJwbGF0ZScgc2hpZnRlcj0nW3ZtLm1hci5sZWZ0LCB2bS5tYXIudG9wXSc+XG5cdFx0XHQ8cmVjdCBjbGFzcz0nYmFja2dyb3VuZCcgZDMtZGVyPSd7d2lkdGg6IHZtLndpZHRoLCBoZWlnaHQ6IHZtLmhlaWdodH0nIG5nLW1vdXNlbW92ZT0ndm0ubW92ZSgkZXZlbnQpJyAvPlxuXHRcdFx0PGcgdmVyLWF4aXMtZGVyIHdpZHRoPSd2bS53aWR0aCcgc2NhbGU9J3ZtLlZlcicgZnVuPSd2bS52ZXJBeEZ1bic+PC9nPlxuXHRcdFx0PGcgaG9yLWF4aXMtZGVyIGhlaWdodD0ndm0uaGVpZ2h0JyBzY2FsZT0ndm0uSG9yJyBmdW49J3ZtLmhvckF4RnVuJyBzaGlmdGVyPSdbMCx2bS5oZWlnaHRdJz48L2c+XG5cdFx0XHQ8Zm9yZWlnbk9iamVjdCB3aWR0aD0nMzAnIGhlaWdodD0nMzAnIHk9JzIwJyBzaGlmdGVyPSdbdm0ud2lkdGgvMiwgdm0uaGVpZ2h0XSc+XG5cdFx0XHRcdFx0PHRleHQgY2xhc3M9J2xhYmVsJyA+JHQkPC90ZXh0PlxuXHRcdFx0PC9mb3JlaWduT2JqZWN0PlxuXHRcdDwvZz5cblx0XHQ8ZyBjbGFzcz0nbWFpbicgY2xpcC1wYXRoPVwidXJsKCNkZXJ2YXRpdmVCKVwiIHNoaWZ0ZXI9J1t2bS5tYXIubGVmdCwgdm0ubWFyLnRvcF0nPlxuXHRcdFx0PGxpbmUgY2xhc3M9J3plcm8tbGluZSBob3InIGQzLWRlcj0ne3gxOiAwLCB4Mjogdm0ud2lkdGgsIHkxOiB2bS5WZXIoMCksIHkyOiB2bS5WZXIoMCl9Jy8+XG5cdFx0XHQ8cGF0aCBkMy1kZXI9J3tkOnZtLmxpbmVGdW4odm0uZGF0YSl9JyBjbGFzcz0nZnVuIGR2JyAvPlxuXHRcdFx0PGxpbmUgY2xhc3M9J3RyaSBkdicgZDMtZGVyPSd7eDE6IHZtLkhvcih2bS5wb2ludC50KS0xLCB4Mjogdm0uSG9yKHZtLnBvaW50LnQpLTEsIHkxOiB2bS5WZXIoMCksIHkyOiB2bS5WZXIodm0ucG9pbnQuZHYpfScvPlxuXHRcdFx0PGZvcmVpZ25PYmplY3Qgd2lkdGg9JzMwJyBoZWlnaHQ9JzMwJyBzaGlmdGVyPSdbKHZtLkhvcih2bS5wb2ludC50KSAtIDE2KSwgdm0uVmVyKHZtLnBvaW50LmR2Ki41KS02XSc+XG5cdFx0XHRcdFx0PHRleHQgY2xhc3M9J3RyaS1sYWJlbCc+JFxcXFxkb3R7eX0kPC90ZXh0PlxuXHRcdFx0PC9mb3JlaWduT2JqZWN0PlxuXHRcdFx0PGZvcmVpZ25PYmplY3Qgd2lkdGg9JzEwMCcgaGVpZ2h0PSczMCcgc2hpZnRlcj0nW3ZtLkhvciguOSksIHZtLlZlcigxKV0nPlxuXHRcdFx0XHQ8dGV4dCBjbGFzcz0ndHJpLWxhYmVsJz4kXFxcXGNvcyh0KSQ8L3RleHQ+XG5cdFx0XHQ8L2ZvcmVpZ25PYmplY3Q+XG5cdFx0XHQ8Y2lyY2xlIHI9JzNweCcgIHNoaWZ0ZXI9J1t2bS5Ib3Iodm0ucG9pbnQudCksIHZtLlZlcih2bS5wb2ludC5kdildJyBjbGFzcz0ncG9pbnQgZHYnLz5cblx0XHQ8L2c+XG5cdDwvc3ZnPlxuJycnXG5cdFx0XHRcbmNsYXNzIEN0cmxcblx0Y29uc3RydWN0b3I6IChAc2NvcGUsIEBlbCwgQHdpbmRvdyktPlxuXHRcdEBtYXIgPSBcblx0XHRcdGxlZnQ6IDMwXG5cdFx0XHR0b3A6IDIwXG5cdFx0XHRyaWdodDogMjBcblx0XHRcdGJvdHRvbTogNDBcblxuXHRcdEBWZXIgPSBkMy5zY2FsZS5saW5lYXIoKS5kb21haW4gWy0xLjUsMS41XVxuXHRcdEBIb3IgPSBkMy5zY2FsZS5saW5lYXIoKS5kb21haW4gWzAsNl1cblxuXHRcdEBkYXRhID0gRGF0YS5kYXRhXG5cblx0XHRAaG9yQXhGdW4gPSBkMy5zdmcuYXhpcygpXG5cdFx0XHQuc2NhbGUgQEhvclxuXHRcdFx0LnRpY2tzIDVcblx0XHRcdC5vcmllbnQgJ2JvdHRvbSdcblxuXHRcdEB2ZXJBeEZ1biA9IGQzLnN2Zy5heGlzKClcblx0XHRcdC5zY2FsZSBAVmVyXG5cdFx0XHQudGlja0Zvcm1hdCAoZCktPlxuXHRcdFx0XHRpZiBNYXRoLmZsb29yKCBkICkgIT0gZCB0aGVuIHJldHVyblxuXHRcdFx0XHRkXG5cdFx0XHQudGlja3MgNVxuXHRcdFx0Lm9yaWVudCAnbGVmdCdcblxuXHRcdEBsaW5lRnVuID0gZDMuc3ZnLmxpbmUoKVxuXHRcdFx0LnkgKGQpPT4gQFZlciBkLmR2XG5cdFx0XHQueCAoZCk9PiBASG9yIGQudFxuXG5cdFx0YW5ndWxhci5lbGVtZW50IEB3aW5kb3dcblx0XHRcdC5vbiAncmVzaXplJywgQHJlc2l6ZVxuXG5cdFx0QG1vdmUgPSAoZXZlbnQpID0+XG5cdFx0XHR0ID0gQEhvci5pbnZlcnQgZXZlbnQueCAtIGV2ZW50LnRhcmdldC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS5sZWZ0XG5cdFx0XHREYXRhLm1vdmUgdFxuXHRcdFx0QHNjb3BlLiRldmFsQXN5bmMoKVxuXG5cdEBwcm9wZXJ0eSAnc3ZnX2hlaWdodCcsIGdldDogLT4gQGhlaWdodCArIEBtYXIudG9wICsgQG1hci5ib3R0b21cblxuXHRAcHJvcGVydHkgJ3BvaW50JywgZ2V0Oi0+XG5cdFx0RGF0YS5wb2ludFxuXG5cdHJlc2l6ZTogKCk9PlxuXHRcdEB3aWR0aCA9IEBlbFswXS5jbGllbnRXaWR0aCAtIEBtYXIubGVmdCAtIEBtYXIucmlnaHRcblx0XHRAaGVpZ2h0ID0gQGVsWzBdLmNsaWVudEhlaWdodCAtIEBtYXIudG9wIC0gQG1hci5ib3R0b21cblx0XHRAVmVyLnJhbmdlIFtAaGVpZ2h0LCAwXVxuXHRcdEBIb3IucmFuZ2UgWzAsIEB3aWR0aF1cblx0XHRAc2NvcGUuJGV2YWxBc3luYygpXG5cbmRlciA9ICgpLT5cblx0ZGlyZWN0aXZlID0gXG5cdFx0Y29udHJvbGxlckFzOiAndm0nXG5cdFx0c2NvcGU6IHt9XG5cdFx0dGVtcGxhdGU6IHRlbXBsYXRlXG5cdFx0dGVtcGxhdGVOYW1lc3BhY2U6ICdzdmcnXG5cdFx0Y29udHJvbGxlcjogWyckc2NvcGUnLCckZWxlbWVudCcsICckd2luZG93JywgQ3RybF1cblxubW9kdWxlLmV4cG9ydHMgPSBkZXJcbiIsIl8gPSByZXF1aXJlICdsb2Rhc2gnXG52RnVuID0gTWF0aC5zaW5cbmR2RnVuID0gTWF0aC5jb3NcblxuY2xhc3MgRGF0YVxuXHRjb25zdHJ1Y3RvcjogLT5cblx0XHRAZGF0YSA9IF8ucmFuZ2UgMCAsIDggLCAxLzUwXG5cdFx0XHQubWFwICh0KS0+XG5cdFx0XHRcdHJlcyA9IFxuXHRcdFx0XHRcdGR2OiBkdkZ1biB0XG5cdFx0XHRcdFx0djogdkZ1biB0XG5cdFx0XHRcdFx0dDogdFxuXG5cdFx0QHBvaW50ID0gXy5zYW1wbGUgQGRhdGFcblxuXHRtb3ZlOiAodCktPlxuXHRcdEBwb2ludCA9IFxuXHRcdFx0ZHY6IGR2RnVuIHRcblx0XHRcdHY6IHZGdW4gdFxuXHRcdFx0dDogdFxuXG5tb2R1bGUuZXhwb3J0cyA9IG5ldyBEYXRhIiwiYW5ndWxhciA9IHJlcXVpcmUgJ2FuZ3VsYXInXG5kMyA9IHJlcXVpcmUgJ2QzJ1xuRGF0YSA9IHJlcXVpcmUgJy4vZGVzaWduRGF0YSdcbnJlcXVpcmUgJy4uLy4uL2hlbHBlcnMnXG50ZW1wbGF0ZSA9ICcnJ1xuXHQ8c3ZnIG5nLWluaXQ9J3ZtLnJlc2l6ZSgpJyB3aWR0aD0nMTAwJScgY2xhc3M9J2JvdHRvbUNoYXJ0Jz5cblx0XHQ8ZGVmcz5cblx0XHRcdDxjbGlwcGF0aCBpZD0ncGxvdEEnPlxuXHRcdFx0XHQ8cmVjdCBkMy1kZXI9J3t3aWR0aDogdm0ud2lkdGgsIGhlaWdodDogdm0uaGVpZ2h0fSc+PC9yZWN0PlxuXHRcdFx0PC9jbGlwcGF0aD5cblx0XHQ8L2RlZnM+XG5cdFx0PGcgY2xhc3M9J2JvaWxlcnBsYXRlJyBzaGlmdGVyPSdbdm0ubWFyLmxlZnQsIHZtLm1hci50b3BdJz5cblx0XHRcdDxyZWN0IGNsYXNzPSdiYWNrZ3JvdW5kJyBkMy1kZXI9J3t3aWR0aDogdm0ud2lkdGgsIGhlaWdodDogdm0uaGVpZ2h0fScgYmVoYXZpb3I9J3ZtLmRyYWdfcmVjdCcgLz5cblx0XHRcdDxnIHZlci1heGlzLWRlciB3aWR0aD0ndm0ud2lkdGgnIHNjYWxlPSd2bS5WZXInIGZ1bj0ndm0udmVyQXhGdW4nPjwvZz5cblx0XHRcdDxnIGhvci1heGlzLWRlciBoZWlnaHQ9J3ZtLmhlaWdodCcgc2NhbGU9J3ZtLkhvcicgZnVuPSd2bS5ob3JBeEZ1bicgc2hpZnRlcj0nWzAsdm0uaGVpZ2h0XSc+PC9nPlxuXHRcdFx0PGZvcmVpZ25PYmplY3Qgd2lkdGg9JzMwJyBoZWlnaHQ9JzMwJyBzaGlmdGVyPSdbLTM4LCB2bS5oZWlnaHQvMl0nPlxuXHRcdFx0XHRcdDx0ZXh0IGNsYXNzPSdsYWJlbCc+JHYkPC90ZXh0PlxuXHRcdFx0PC9mb3JlaWduT2JqZWN0PlxuXHRcdFx0PGZvcmVpZ25PYmplY3Qgd2lkdGg9JzMwJyBoZWlnaHQ9JzMwJyB5PScyMCcgc2hpZnRlcj0nW3ZtLndpZHRoLzIsIHZtLmhlaWdodF0nPlxuXHRcdFx0XHRcdDx0ZXh0IGNsYXNzPSdsYWJlbCcgPiR0JDwvdGV4dD5cblx0XHRcdDwvZm9yZWlnbk9iamVjdD5cblx0XHQ8L2c+XG5cdFx0PGcgY2xhc3M9J21haW4nIGNsaXAtcGF0aD1cInVybCgjcGxvdEEpXCIgc2hpZnRlcj0nW3ZtLm1hci5sZWZ0LCB2bS5tYXIudG9wXScgPlxuXHRcdFx0PGxpbmUgY2xhc3M9J3plcm8tbGluZScgZDMtZGVyPSd7eDE6IDAsIHgyOiB2bS53aWR0aCwgeTE6IHZtLlZlcigwKSwgeTI6IHZtLlZlcigwKX0nIC8+XG5cdFx0XHQ8bGluZSBjbGFzcz0nemVyby1saW5lJyBkMy1kZXI9XCJ7eDE6IHZtLkhvcigwKSwgeDI6IHZtLkhvcigwKSwgeTE6IHZtLmhlaWdodCwgeTI6IDB9XCIgLz5cblx0XHRcdDxnIG5nLWNsYXNzPSd7aGlkZTogIXZtLkRhdGEuc2hvd30nID5cblx0XHRcdFx0PGxpbmUgY2xhc3M9J3RyaSB2JyBkMy1kZXI9J3t4MTogdm0uSG9yKHZtLnNlbGVjdGVkLnQpLTEsIHgyOiB2bS5Ib3Iodm0uc2VsZWN0ZWQudCktMSwgeTE6IHZtLlZlcigwKSwgeTI6IHZtLlZlcih2bS5zZWxlY3RlZC52KX0nLz5cblx0XHRcdFx0PHBhdGggbmctYXR0ci1kPSd7e3ZtLnRyaWFuZ2xlRGF0YSgpfX0nIGNsYXNzPSd0cmknIC8+XG5cdFx0XHRcdDxsaW5lIGQzLWRlcj0ne3gxOiB2bS5Ib3Iodm0uc2VsZWN0ZWQudCkrMSwgeDI6IHZtLkhvcih2bS5zZWxlY3RlZC50KSsxLCB5MTogdm0uVmVyKHZtLnNlbGVjdGVkLnYpLCB5Mjogdm0uVmVyKHZtLnNlbGVjdGVkLnYgKyB2bS5zZWxlY3RlZC5kdil9JyBjbGFzcz0ndHJpIGR2JyAvPlxuXHRcdFx0PC9nPlxuXHRcdFx0PHBhdGggbmctYXR0ci1kPSd7e3ZtLmxpbmVGdW4odm0uRGF0YS5DYXJ0LnRyYWplY3RvcnkpfX0nIGNsYXNzPSdmdW4gdGFyZ2V0JyAvPlxuXHRcdFx0PHBhdGggbmctYXR0ci1kPSd7e3ZtLmxpbmVGdW4odm0uRGF0YS5kb3RzKX19JyBjbGFzcz0nZnVuIHYnIC8+XG5cdFx0XHQ8ZyBuZy1yZXBlYXQ9J2RvdCBpbiB2bS5kb3RzIHRyYWNrIGJ5IGRvdC5pZCcgZGF0dW09ZG90IHNoaWZ0ZXI9J1t2bS5Ib3IoZG90LnQpLHZtLlZlcihkb3QudildJyBiZWhhdmlvcj0ndm0uZHJhZycgZG90LWRlcj1kb3QgPjwvZz5cblx0XHRcdDxjaXJjbGUgY2xhc3M9J2RvdCBzbWFsbCcgcj0nNCcgc2hpZnRlcj0nW3ZtLkhvcih2bS5EYXRhLmZpcnN0LnQpLHZtLlZlcih2bS5EYXRhLmZpcnN0LnYpXScgLz5cblx0XHRcdDxmb3JlaWduT2JqZWN0IHdpZHRoPSc3MCcgaGVpZ2h0PSczMCcgc2hpZnRlcj0nW3ZtLkhvcig0KSwgdm0uVmVyKC4zMyldJz5cblx0XHRcdFx0XHQ8dGV4dCBjbGFzcz0ndHJpLWxhYmVsJyA+JDJlXnstLjh0fSQ8L3RleHQ+XG5cdFx0XHQ8L2ZvcmVpZ25PYmplY3Q+XG5cdFx0PC9nPlxuXHQ8L3N2Zz5cbicnJ1xuXG5jbGFzcyBDdHJsXG5cdGNvbnN0cnVjdG9yOiAoQHNjb3BlLCBAZWwsIEB3aW5kb3cpLT5cblx0XHRAbWFyID0gXG5cdFx0XHRsZWZ0OiAzOFxuXHRcdFx0dG9wOiAwXG5cdFx0XHRyaWdodDogMTBcblx0XHRcdGJvdHRvbTogMzdcblxuXHRcdEBWZXIgPSBkMy5zY2FsZS5saW5lYXIoKS5kb21haW4gWy0uMSwyLjFdXG5cblx0XHRASG9yID0gZDMuc2NhbGUubGluZWFyKCkuZG9tYWluIFstLjEsNV1cblxuXHRcdEBEYXRhID0gRGF0YVxuXG5cdFx0QGhvckF4RnVuID0gZDMuc3ZnLmF4aXMoKVxuXHRcdFx0LnNjYWxlIEBIb3Jcblx0XHRcdC50aWNrcyA1XG5cdFx0XHQub3JpZW50ICdib3R0b20nXG5cblx0XHRAdmVyQXhGdW4gPSBkMy5zdmcuYXhpcygpXG5cdFx0XHQuc2NhbGUgQFZlclxuXHRcdFx0LnRpY2tzIDVcblx0XHRcdC5vcmllbnQgJ2xlZnQnXG5cdFx0XG5cdFx0QGxpbmVGdW4gPSBkMy5zdmcubGluZSgpXG5cdFx0XHQueSAoZCk9PiBAVmVyIGQudlxuXHRcdFx0LnggKGQpPT4gQEhvciBkLnRcblxuXHRcdEBkcmFnX3JlY3QgPSBkMy5iZWhhdmlvci5kcmFnKClcblx0XHRcdC5vbiAnZHJhZ3N0YXJ0JywgKCk9PlxuXHRcdFx0XHRkMy5ldmVudC5zb3VyY2VFdmVudC5zdG9wUHJvcGFnYXRpb24oKVxuXHRcdFx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpXG5cdFx0XHRcdGlmIGV2ZW50LndoaWNoID09IDNcblx0XHRcdFx0XHRyZXR1cm4gXG5cdFx0XHRcdERhdGEuc2V0X3Nob3cgdHJ1ZVxuXHRcdFx0XHRyZWN0ID0gZXZlbnQudG9FbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpXG5cdFx0XHRcdHQgPSBASG9yLmludmVydCBldmVudC54IC0gcmVjdC5sZWZ0XG5cdFx0XHRcdHYgID0gQFZlci5pbnZlcnQgZXZlbnQueSAtIHJlY3QudG9wXG5cdFx0XHRcdERhdGEuYWRkX2RvdCB0ICwgdlxuXHRcdFx0XHRAc2NvcGUuJGV2YWxBc3luYygpXG5cdFx0XHQub24gJ2RyYWcnLCA9PiBAb25fZHJhZyBAc2VsZWN0ZWRcblx0XHRcdC5vbiAnZHJhZ2VuZCcsPT5cblx0XHRcdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKVxuXHRcdFx0XHREYXRhLnNldF9zaG93IHRydWVcblx0XHRcdFx0ZXZlbnQuc3RvcFByb3BhZ2F0aW9uKClcblxuXHRcdEBkcmFnID0gZDMuYmVoYXZpb3IuZHJhZygpXG5cdFx0XHQub24gJ2RyYWdzdGFydCcsIChkb3QpPT5cblx0XHRcdFx0ZDMuZXZlbnQuc291cmNlRXZlbnQuc3RvcFByb3BhZ2F0aW9uKClcblx0XHRcdFx0aWYgZXZlbnQud2hpY2ggPT0gM1xuXHRcdFx0XHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KClcblx0XHRcdFx0XHREYXRhLnJlbW92ZV9kb3QgZG90XG5cdFx0XHRcdFx0RGF0YS5zZXRfc2hvdyBmYWxzZVxuXHRcdFx0XHRcdEBzY29wZS4kZXZhbEFzeW5jKClcblx0XHRcdC5vbiAnZHJhZycsIEBvbl9kcmFnXG5cblxuXG5cdFx0YW5ndWxhci5lbGVtZW50IEB3aW5kb3dcblx0XHRcdC5vbiAncmVzaXplJywgQHJlc2l6ZVxuXG5cdEBwcm9wZXJ0eSAnZG90cycsIGdldDotPiBcblx0XHREYXRhLmRvdHMuZmlsdGVyIChkKS0+IChkLmlkICE9J2ZpcnN0JykgYW5kIChkLmlkICE9J2xhc3QnKVxuXG5cdEBwcm9wZXJ0eSAnc2VsZWN0ZWQnLCBnZXQ6LT5cblx0XHREYXRhLnNlbGVjdGVkXG5cblx0b25fZHJhZzogKGRvdCk9PiBcblx0XHRcdCMgaWYgZXZlbnQud2hpY2ggaXMgM1xuXHRcdFx0IyBcdGV2ZW50LnByZXZlbnREZWZhdWx0KClcblx0XHRcdCMgXHRyZXR1cm5cblx0XHRcdERhdGEudXBkYXRlX2RvdCBkb3QsIEBIb3IuaW52ZXJ0KGQzLmV2ZW50LngpLCBAVmVyLmludmVydChkMy5ldmVudC55KVxuXHRcdFx0QHNjb3BlLiRldmFsQXN5bmMoKVxuXG5cdHRyaWFuZ2xlRGF0YTotPlxuXHRcdHBvaW50ID0gQHNlbGVjdGVkXG5cdFx0QGxpbmVGdW4gW3t2OiBwb2ludC52LCB0OiBwb2ludC50fSwge3Y6cG9pbnQuZHYgKyBwb2ludC52LCB0OiBwb2ludC50KzF9LCB7djogcG9pbnQuZHYgKyBwb2ludC52LCB0OiBwb2ludC50fV1cblxuXHRyZXNpemU6ICgpPT5cblx0XHRAd2lkdGggPSBAZWxbMF0uY2xpZW50V2lkdGggLSBAbWFyLmxlZnQgLSBAbWFyLnJpZ2h0XG5cdFx0QGhlaWdodCA9IEBlbFswXS5jbGllbnRIZWlnaHQgLSBAbWFyLnRvcCAtIEBtYXIuYm90dG9tXG5cdFx0QFZlci5yYW5nZSBbQGhlaWdodCwgMF1cblx0XHRASG9yLnJhbmdlIFswLCBAd2lkdGhdXG5cdFx0QHNjb3BlLiRldmFsQXN5bmMoKVxuXG5kZXIgPSAoKS0+XG5cdGRpcmVjdGl2ZSA9IFxuXHRcdGNvbnRyb2xsZXJBczogJ3ZtJ1xuXHRcdHNjb3BlOiB7fVxuXHRcdHRlbXBsYXRlOiB0ZW1wbGF0ZVxuXHRcdHRlbXBsYXRlTmFtZXNwYWNlOiAnc3ZnJ1xuXHRcdGNvbnRyb2xsZXI6IFsnJHNjb3BlJywnJGVsZW1lbnQnLCAnJHdpbmRvdycsIEN0cmxdXG5cbm1vZHVsZS5leHBvcnRzID0gZGVyXG4iLCJEYXRhID0gcmVxdWlyZSAnLi9kZXNpZ25EYXRhJ1xuYW5ndWxhciA9IHJlcXVpcmUgJ2FuZ3VsYXInXG5kMyA9IHJlcXVpcmUgJ2QzJ1xucmVxdWlyZSAnLi4vLi4vaGVscGVycydcblxudGVtcGxhdGUgPSAnJydcblx0PHN2ZyBuZy1pbml0PSd2bS5yZXNpemUoKScgIHdpZHRoPScxMDAlJyBjbGFzcz0nYm90dG9tQ2hhcnQnPlxuXHRcdDxkZWZzPlxuXHRcdFx0PGNsaXBwYXRoIGlkPSdwbG90Qic+XG5cdFx0XHRcdDxyZWN0IGQzLWRlcj0ne3dpZHRoOiB2bS53aWR0aCwgaGVpZ2h0OiB2bS5oZWlnaHR9JyAvPlxuXHRcdFx0PC9jbGlwcGF0aD5cblx0XHQ8L2RlZnM+XG5cdFx0PGcgY2xhc3M9J2JvaWxlcnBsYXRlJyBzaGlmdGVyPSdbdm0ubWFyLmxlZnQsIHZtLm1hci50b3BdJz5cblx0XHRcdDxyZWN0IGNsYXNzPSdiYWNrZ3JvdW5kJyBkMy1kZXI9J3t3aWR0aDogdm0ud2lkdGgsIGhlaWdodDogdm0uaGVpZ2h0fScgLz5cblx0XHRcdDxnIHZlci1heGlzLWRlciB3aWR0aD0ndm0ud2lkdGgnIHNjYWxlPSd2bS5WZXInIGZ1bj0ndm0udmVyQXhGdW4nPjwvZz5cblx0XHRcdDxnIGhvci1heGlzLWRlciBoZWlnaHQ9J3ZtLmhlaWdodCcgc2NhbGU9J3ZtLlYnIGZ1bj0ndm0uaG9yQXhGdW4nIHNoaWZ0ZXI9J1swLHZtLmhlaWdodF0nPjwvZz5cblx0XHRcdDxmb3JlaWduT2JqZWN0IHdpZHRoPSczMCcgaGVpZ2h0PSczMCcgc2hpZnRlcj0nWy0zOCwgdm0uaGVpZ2h0LzJdJz5cblx0XHRcdFx0XHQ8dGV4dCBjbGFzcz0nbGFiZWwnPiRcXFxcZG90e3Z9JDwvdGV4dD5cblx0XHRcdDwvZm9yZWlnbk9iamVjdD5cblx0XHRcdDxmb3JlaWduT2JqZWN0IHdpZHRoPSczMCcgaGVpZ2h0PSczMCcgeT0nMjAnIHNoaWZ0ZXI9J1t2bS53aWR0aC8yLCB2bS5oZWlnaHRdJz5cblx0XHRcdFx0XHQ8dGV4dCBjbGFzcz0nbGFiZWwnID4kdiQ8L3RleHQ+XG5cdFx0XHQ8L2ZvcmVpZ25PYmplY3Q+XG5cdFx0PC9nPlxuXHRcdDxnIGNsYXNzPSdtYWluJyBjbGlwLXBhdGg9XCJ1cmwoI3Bsb3RCKVwiIHNoaWZ0ZXI9J1t2bS5tYXIubGVmdCwgdm0ubWFyLnRvcF0nPlxuXHRcdFx0PGxpbmUgY2xhc3M9J3plcm8tbGluZScgZDMtZGVyPSd7eDE6IDAsIHgyOiB2bS53aWR0aCwgeTE6IHZtLlZlcigwKSwgeTI6IHZtLlZlcigwKX0nIC8+XG5cdFx0XHQ8bGluZSBjbGFzcz0nemVyby1saW5lJyBkMy1kZXI9XCJ7eDE6IHZtLkhvcigwKSwgeDI6IHZtLkhvcigwKSwgeTE6IHZtLmhlaWdodCwgeTI6IDB9XCIgLz5cblx0XHRcdDxwYXRoIG5nLWF0dHItZD0ne3t2bS5saW5lRnVuKHZtLkRhdGEudGFyZ2V0X2RhdGEpfX0nIGNsYXNzPSdmdW4gdGFyZ2V0JyAvPlxuXHRcdFx0PGcgbmctY2xhc3M9J3toaWRlOiAhdm0uRGF0YS5zaG93fScgPlxuXHRcdFx0XHQ8bGluZSBjbGFzcz0ndHJpIHYnIGQzLWRlcj0ne3gxOiB2bS5Ib3IoMCksIHgyOiB2bS5Ib3Iodm0uc2VsZWN0ZWQudiksIHkxOiB2bS5WZXIodm0uc2VsZWN0ZWQuZHYpLCB5Mjogdm0uVmVyKHZtLnNlbGVjdGVkLmR2KX0nLz5cblx0XHRcdFx0PGxpbmUgY2xhc3M9J3RyaSBkdicgZDMtZGVyPSd7eDE6IHZtLkhvcih2bS5zZWxlY3RlZC52KSwgeDI6IHZtLkhvcih2bS5zZWxlY3RlZC52KSwgeTE6IHZtLlZlcigwKSwgeTI6IHZtLlZlcih2bS5zZWxlY3RlZC5kdil9Jy8+XG5cdFx0XHRcdDxwYXRoIGQzLWRlcj0ne2Q6dm0ubGluZUZ1bih2bS5EYXRhLnRhcmdldF9kYXRhKX0nIGNsYXNzPSdmdW4gY29ycmVjdCcgbmctY2xhc3M9J3toaWRlOiAhdm0uRGF0YS5jb3JyZWN0fScgLz5cblx0XHRcdDwvZz5cblx0XHRcdDxnIG5nLXJlcGVhdD0nZG90IGluIHZtLmRvdHMgdHJhY2sgYnkgZG90LmlkJyBzaGlmdGVyPSdbdm0uSG9yKGRvdC52KSx2bS5WZXIoZG90LmR2KV0nIGRvdC1iLWRlcj1kb3Q+PC9nPlxuXHRcdFx0PGZvcmVpZ25PYmplY3Qgd2lkdGg9JzcwJyBoZWlnaHQ9JzMwJyB5PScwJyBzaGlmdGVyPSdbdm0uSG9yKDEuNyksIHZtLlZlcigtMS4yKV0nPlxuXHRcdFx0XHRcdDx0ZXh0IGNsYXNzPSd0cmktbGFiZWwnID4kdic9LS44diQ8L3RleHQ+XG5cdFx0XHQ8L2ZvcmVpZ25PYmplY3Q+XG5cdFx0PC9nPlxuXHQ8L3N2Zz5cbicnJ1xuXG5jbGFzcyBDdHJsXG5cdGNvbnN0cnVjdG9yOiAoQHNjb3BlLCBAZWwsIEB3aW5kb3cpLT5cblx0XHRAbWFyID0gXG5cdFx0XHRsZWZ0OiA0MFxuXHRcdFx0dG9wOiAwXG5cdFx0XHRyaWdodDogMTBcblx0XHRcdGJvdHRvbTogMzdcblxuXHRcdEBWZXIgPSBkMy5zY2FsZS5saW5lYXIoKS5kb21haW4gWy0xLjksIC4xXVxuXG5cdFx0QEhvciA9IGQzLnNjYWxlLmxpbmVhcigpLmRvbWFpbiBbLS4xLDIuMTVdXG5cblx0XHRAaG9yQXhGdW4gPSBkMy5zdmcuYXhpcygpXG5cdFx0XHQuc2NhbGUgQEhvclxuXHRcdFx0LnRpY2tzIDVcblx0XHRcdC5vcmllbnQgJ2JvdHRvbSdcblxuXHRcdEB2ZXJBeEZ1biA9IGQzLnN2Zy5heGlzKClcblx0XHRcdC5zY2FsZSBAVmVyXG5cdFx0XHQudGlja3MgNVxuXHRcdFx0Lm9yaWVudCAnbGVmdCdcblxuXHRcdEBEYXRhID0gRGF0YVxuXG5cdFx0QGxpbmVGdW4gPSBkMy5zdmcubGluZSgpXG5cdFx0XHQueSAoZCk9PiBAVmVyIGQuZHZcblx0XHRcdC54IChkKT0+IEBIb3IgZC52XG5cblx0XHRhbmd1bGFyLmVsZW1lbnQgQHdpbmRvd1xuXHRcdFx0Lm9uICdyZXNpemUnLCBAcmVzaXplXG5cblx0QHByb3BlcnR5ICdkb3RzJywgZ2V0Oi0+XG5cdFx0RGF0YS5kb3RzXG5cdFx0XHQuZmlsdGVyIChkKS0+IChkLmlkICE9J2ZpcnN0JykgYW5kIChkLmlkICE9J2xhc3QnKVxuXG5cdEBwcm9wZXJ0eSAnc2VsZWN0ZWQnLCBnZXQ6LT5cblx0XHREYXRhLnNlbGVjdGVkXG5cdFx0XG5cdHJlc2l6ZTogKCk9PlxuXHRcdEB3aWR0aCA9IEBlbFswXS5jbGllbnRXaWR0aCAtIEBtYXIubGVmdCAtIEBtYXIucmlnaHRcblx0XHRAaGVpZ2h0ID0gQGVsWzBdLmNsaWVudEhlaWdodCAtIEBtYXIudG9wIC0gQG1hci5ib3R0b21cblx0XHRAVmVyLnJhbmdlIFtAaGVpZ2h0LCAwXVxuXHRcdEBIb3IucmFuZ2UgWzAsIEB3aWR0aF0gXG5cdFx0QHNjb3BlLiRldmFsQXN5bmMoKVxuXG5cbmRlciA9ICgpLT5cblx0ZGlyZWN0aXZlID0gXG5cdFx0Y29udHJvbGxlckFzOiAndm0nXG5cdFx0c2NvcGU6IHt9XG5cdFx0dGVtcGxhdGU6IHRlbXBsYXRlXG5cdFx0dGVtcGxhdGVOYW1lc3BhY2U6ICdzdmcnXG5cdFx0Y29udHJvbGxlcjogWyckc2NvcGUnLCckZWxlbWVudCcsJyR3aW5kb3cnLCBDdHJsXVxuXG5tb2R1bGUuZXhwb3J0cyA9IGRlclxuIiwiYW5ndWxhciA9IHJlcXVpcmUgJ2FuZ3VsYXInXG5kMyA9IHJlcXVpcmUgJ2QzJ1xuRGF0YSA9IHJlcXVpcmUgJy4vZGVzaWduRGF0YSdcbnJlcXVpcmUgJy4uLy4uL2hlbHBlcnMnXG50ZW1wbGF0ZSA9ICcnJ1xuXHQ8bWQtYnV0dG9uIGNsYXNzPSdteUJ1dHRvbicgbmctY2xpY2s9J3ZtLmNsaWNrKCknIG5nLWluaXQ9J3ZtLnBsYXkoKSc+e3t2bS5wYXVzZWQgPyAnUExBWScgOiAnUEFVU0UnfX08L21kLWJ1dHRvbj5cbicnJ1xuXG5jbGFzcyBDdHJsXG5cdGNvbnN0cnVjdG9yOiAoQHNjb3BlKS0+XG5cblx0Y2xpY2s6IC0+XG5cdFx0aWYgQHBhdXNlZCB0aGVuIEBwbGF5KCkgZWxzZSBAcGF1c2UoKVxuXG5cdHBsYXk6IC0+XG5cdFx0QHBhdXNlZCA9IHRydWVcblx0XHRkMy50aW1lci5mbHVzaCgpXG5cdFx0QHBhdXNlZCA9IGZhbHNlXG5cdFx0bGFzdCA9IDBcblx0XHRkMy50aW1lciAoZWxhcHNlZCk9PlxuXHRcdFx0XHRkdCA9IGVsYXBzZWQgLSBsYXN0XG5cdFx0XHRcdERhdGEuaW5jcmVtZW50IGR0LzEwMDBcblx0XHRcdFx0bGFzdCA9IGVsYXBzZWRcblx0XHRcdFx0aWYgRGF0YS50ID4gNFxuXHRcdFx0XHRcdERhdGEuc2V0X3QgMFxuXHRcdFx0XHRAc2NvcGUuJGV2YWxBc3luYygpXG5cdFx0XHRcdEBwYXVzZWRcblx0XHRcdCwgMVxuXG5cdHBhdXNlOiAtPiBAcGF1c2VkID0gdHJ1ZVxuXG5kZXIgPSAoKS0+XG5cdGRpcmVjdGl2ZSA9IFxuXHRcdGNvbnRyb2xsZXJBczogJ3ZtJ1xuXHRcdHNjb3BlOiB7fVxuXHRcdHRlbXBsYXRlOiB0ZW1wbGF0ZVxuXHRcdHRlbXBsYXRlTmFtZXNwYWNlOiAnc3ZnJ1xuXHRcdGNvbnRyb2xsZXI6IFsnJHNjb3BlJywgQ3RybF1cblxubW9kdWxlLmV4cG9ydHMgPSBkZXIiLCJfID0gcmVxdWlyZSAnbG9kYXNoJ1xuZDM9IHJlcXVpcmUgJ2QzJ1xue21pbn0gPSBNYXRoXG5yZXF1aXJlICcuLi8uLi9oZWxwZXJzJ1xuQ2FydCA9IHJlcXVpcmUgJy4vZmFrZUNhcnQnXG5cbnRlbXBsYXRlID0gJycnXG5cdDxzdmcgbmctaW5pdD0ndm0ucmVzaXplKCknIHdpZHRoPScxMDAlJyBjbGFzcz0nY2FydENoYXJ0JyBuZy1hdHRyLWhlaWdodD0ne3s6OnZtLnN2Z0hlaWdodH19Jz5cblx0XHQ8ZyBzaGlmdGVyPSd7ezo6W3ZtLm1hci5sZWZ0LCB2bS5tYXIudG9wXX19Jz5cblx0XHRcdDxyZWN0IGQzLWRlcj0ne3dpZHRoOiB2bS53aWR0aCwgaGVpZ2h0OiB2bS5oZWlnaHR9JyBjbGFzcz0nYmFja2dyb3VuZCcvPlxuXHRcdFx0PGcgaG9yLWF4aXMtZGVyIGhlaWdodD0ndm0uaGVpZ2h0JyBzY2FsZT0ndm0uWCcgZnVuPSd2bS5heGlzRnVuJyBzaGlmdGVyPSdbMCx2bS5oZWlnaHRdJz48L2c+XG5cdFx0XHQ8ZyBjbGFzcz0nZy1jYXJ0JyBuZy1yZXBlYXQ9J3QgaW4gdm0uc2FtcGxlJyBkMy1kZXI9J3t0cmFuc2Zvcm06IFwidHJhbnNsYXRlKFwiICsgdm0uWCh2bS5DYXJ0LmxvYyh0KSkgKyBcIiwwKVwifScgc3R5bGU9J29wYWNpdHk6LjM7Jz5cblx0XHRcdFx0PGxpbmUgY2xhc3M9J3RpbWUtbGluZScgZDMtZGVyPSd7eDE6IDAsIHgyOiAwLCB5MTogMCwgeTI6IDYwfScgLz5cblx0XHRcdDwvZz5cblx0XHRcdDxnIGNsYXNzPSdnLWNhcnQnIGNhcnQtb2JqZWN0LWRlciBsZWZ0PSd2bS5YKHZtLkNhcnQueCknIHRyYW5zZm9ybT0ndHJhbnNsYXRlKDAsMjUpJz48L2c+XG5cdFx0PC9nPlxuXHQ8L3N2Zz5cbicnJ1xuXG5jbGFzcyBDdHJsXG5cdGNvbnN0cnVjdG9yOiAoQHNjb3BlLCBAZWwsIEB3aW5kb3cpLT5cblx0XHRAbWFyID0gXG5cdFx0XHRsZWZ0OiAxMFxuXHRcdFx0cmlnaHQ6IDEwXG5cdFx0XHR0b3A6IDBcblx0XHRcdGJvdHRvbTogMFxuXHRcdFx0XG5cdFx0QFggPSBkMy5zY2FsZS5saW5lYXIoKS5kb21haW4gWy0uMSwzXSBcblxuXHRcdEBzYW1wbGUgPSBfLnJhbmdlKCAwLCA1ICwgLjUpXG5cblx0XHRAQ2FydCA9IENhcnRcblxuXHRcdEBheGlzRnVuID0gZDMuc3ZnLmF4aXMoKVxuXHRcdFx0LnNjYWxlIEBYXG5cdFx0XHQudGlja3MgNVxuXHRcdFx0Lm9yaWVudCAnYm90dG9tJ1xuXG5cdFx0QHRyYW4gPSAodHJhbiktPlxuXHRcdFx0dHJhbi5lYXNlICdsaW5lYXInXG5cdFx0XHRcdC5kdXJhdGlvbiA2MFxuXG5cdFx0YW5ndWxhci5lbGVtZW50IEB3aW5kb3dcblx0XHRcdC5vbiAncmVzaXplJyAsIEByZXNpemVcblxuXHRAcHJvcGVydHkgJ3N2Z0hlaWdodCcgLCBnZXQ6LT4gQGhlaWdodCArIEBtYXIudG9wICsgQG1hci5ib3R0b21cblxuXHRyZXNpemU6ICgpPT5cblx0XHRAd2lkdGggPSBAZWxbMF0uY2xpZW50V2lkdGggLSBAbWFyLmxlZnQgLSBAbWFyLnJpZ2h0XG5cdFx0QGhlaWdodCA9IDYwXG5cdFx0QFgucmFuZ2UgWzAsIEB3aWR0aF1cblx0XHRAc2NvcGUuJGV2YWxBc3luYygpXG5cbmRlciA9ICgpLT5cblx0ZGlyZWN0aXZlID0gXG5cdFx0dGVtcGxhdGU6IHRlbXBsYXRlXG5cdFx0c2NvcGU6IHt9XG5cdFx0cmVzdHJpY3Q6ICdBJ1xuXHRcdGJpbmRUb0NvbnRyb2xsZXI6IHRydWVcblx0XHR0ZW1wbGF0ZU5hbWVzcGFjZTogJ3N2Zydcblx0XHRjb250cm9sbGVyOiBbJyRzY29wZScsICckZWxlbWVudCcsICckd2luZG93JywgQ3RybF1cblx0XHRjb250cm9sbGVyQXM6ICd2bSdcblxubW9kdWxlLmV4cG9ydHMgPSBkZXJcbiIsIl8gPSByZXF1aXJlICdsb2Rhc2gnXG5kMz0gcmVxdWlyZSAnZDMnXG57bWlufSA9IE1hdGhcbnJlcXVpcmUgJy4uLy4uL2hlbHBlcnMnXG5DYXJ0ID0gcmVxdWlyZSAnLi90cnVlQ2FydCdcblxudGVtcGxhdGUgPSAnJydcblx0PHN2ZyBuZy1pbml0PSd2bS5yZXNpemUoKScgd2lkdGg9JzEwMCUnIGNsYXNzPSdjYXJ0Q2hhcnQnIG5nLWF0dHItaGVpZ2h0PSd7ezo6dm0uc3ZnSGVpZ2h0fX0nPlxuXHRcdDxnIHNoaWZ0ZXI9J3t7Ojpbdm0ubWFyLmxlZnQsIHZtLm1hci50b3BdfX0nPlxuXHRcdFx0PHJlY3QgZDMtZGVyPSd7d2lkdGg6IHZtLndpZHRoLCBoZWlnaHQ6IHZtLmhlaWdodH0nIGNsYXNzPSdiYWNrZ3JvdW5kJy8+XG5cdFx0XHQ8ZyBob3ItYXhpcy1kZXIgaGVpZ2h0PSd2bS5oZWlnaHQnIHNjYWxlPSd2bS5YJyBmdW49J3ZtLmF4aXNGdW4nIHNoaWZ0ZXI9J1swLHZtLmhlaWdodF0nPjwvZz5cblx0XHRcdDxmb3JlaWduT2JqZWN0IHdpZHRoPSczMCcgaGVpZ2h0PSczMCcgeT0nMjAnIHNoaWZ0ZXI9J1t2bS53aWR0aC8yLCB2bS5oZWlnaHRdJz5cblx0XHRcdFx0XHQ8dGV4dCBjbGFzcz0nbGFiZWwnID4keCQ8L3RleHQ+XG5cdFx0XHQ8L2ZvcmVpZ25PYmplY3Q+XG5cdFx0XHQ8ZyBjbGFzcz0nZy1jYXJ0JyBuZy1yZXBlYXQ9J3QgaW4gdm0uc2FtcGxlJyBkMy1kZXI9J3t0cmFuc2Zvcm06IFwidHJhbnNsYXRlKFwiICsgdm0uWCh2bS5DYXJ0LmxvYyh0KSkgKyBcIiwwKVwifScgc3R5bGU9J29wYWNpdHk6LjM7Jz5cblx0XHRcdFx0PGxpbmUgY2xhc3M9J3RpbWUtbGluZScgZDMtZGVyPSd7eDE6IDAsIHgyOiAwLCB5MTogMCwgeTI6IDYwfScgLz5cblx0XHRcdDwvZz5cblx0XHRcdDxnIGNsYXNzPSdnLWNhcnQnIGNhcnQtb2JqZWN0LWRlciBsZWZ0PSd2bS5YKHZtLkNhcnQueCknIHRyYW5zZm9ybT0ndHJhbnNsYXRlKDAsMjUpJz48L2c+XG5cdFx0PC9nPlxuXHQ8L3N2Zz5cbicnJ1xuXG5jbGFzcyBDdHJsXG5cdGNvbnN0cnVjdG9yOiAoQHNjb3BlLCBAZWwsIEB3aW5kb3cpLT5cblx0XHRAbWFyID0gXG5cdFx0XHRsZWZ0OiAxMFxuXHRcdFx0cmlnaHQ6IDEwXG5cdFx0XHR0b3A6IDEwXG5cdFx0XHRib3R0b206IDE1XG5cdFx0XHRcblx0XHRAWCA9IGQzLnNjYWxlLmxpbmVhcigpLmRvbWFpbiBbLS4xLDNdIFxuXG5cdFx0QHNhbXBsZSA9IF8ucmFuZ2UoIDAsIDUgLCAuNSlcblxuXHRcdEBDYXJ0ID0gQ2FydFxuXG5cdFx0QGF4aXNGdW4gPSBkMy5zdmcuYXhpcygpXG5cdFx0XHQuc2NhbGUgQFhcblx0XHRcdC50aWNrcyA1XG5cdFx0XHQub3JpZW50ICdib3R0b20nXG5cblx0XHRAdHJhbiA9ICh0cmFuKS0+XG5cdFx0XHR0cmFuLmVhc2UgJ2xpbmVhcidcblx0XHRcdFx0LmR1cmF0aW9uIDMwXG5cblx0XHRhbmd1bGFyLmVsZW1lbnQgQHdpbmRvd1xuXHRcdFx0Lm9uICdyZXNpemUnICwgQHJlc2l6ZVxuXG5cdHJlc2l6ZTogKCk9PlxuXHRcdEB3aWR0aCA9IEBlbFswXS5jbGllbnRXaWR0aCAtIEBtYXIubGVmdCAtIEBtYXIucmlnaHRcblx0XHRAaGVpZ2h0ID0gNjBcblx0XHRAWC5yYW5nZSBbMCwgQHdpZHRoXVxuXHRcdEBzY29wZS4kZXZhbEFzeW5jKClcblxuXHRAcHJvcGVydHkgJ3N2Z0hlaWdodCcsIGdldDotPiBAaGVpZ2h0ICsgQG1hci50b3ArQG1hci5ib3R0b21cblxuZGVyID0gKCktPlxuXHRkaXJlY3RpdmUgPSBcblx0XHR0ZW1wbGF0ZTogdGVtcGxhdGVcblx0XHRzY29wZToge31cblx0XHRyZXN0cmljdDogJ0EnXG5cdFx0YmluZFRvQ29udHJvbGxlcjogdHJ1ZVxuXHRcdHRlbXBsYXRlTmFtZXNwYWNlOiAnc3ZnJ1xuXHRcdGNvbnRyb2xsZXI6IFsnJHNjb3BlJywgJyRlbGVtZW50JywgJyR3aW5kb3cnLCBDdHJsXVxuXHRcdGNvbnRyb2xsZXJBczogJ3ZtJ1xuXG5tb2R1bGUuZXhwb3J0cyA9IGRlclxuIiwiXyA9IHJlcXVpcmUgJ2xvZGFzaCdcbnJlcXVpcmUgJy4uLy4uL2hlbHBlcnMnXG5DYXJ0ID0gcmVxdWlyZSAnLi4vY2FydC9jYXJ0RGF0YSdcbmQzID0gcmVxdWlyZSAnZDMnXG5cbmNsYXNzIERvdFxuXHRjb25zdHJ1Y3RvcjogKEB0LCBAdiktPlxuXHRcdEBpZCA9IF8udW5pcXVlSWQgJ2RvdCdcblxuY2xhc3MgRGF0YVxuXHRjb25zdHJ1Y3RvcjogLT5cblx0XHRAdCA9IEB4ID0gMFxuXHRcdEBDYXJ0ID0gQ2FydFxuXHRcdGZpcnN0RG90ID0gbmV3IERvdCAwICwgQ2FydC52MFxuXHRcdGZpcnN0RG90LmlkID0gJ2ZpcnN0J1xuXHRcdG1pZERvdCA9IG5ldyBEb3QgQ2FydC50cmFqZWN0b3J5WzEwXS50ICwgQ2FydC50cmFqZWN0b3J5WzEwXS52XG5cdFx0bGFzdERvdCA9IG5ldyBEb3QgNiAsIENhcnQudHJhamVjdG9yeVsxMF0udlxuXHRcdGxhc3REb3QuaWQgPSAnbGFzdCdcblx0XHRAZG90cyA9IFsgZmlyc3REb3QsIFxuXHRcdFx0bWlkRG90LFxuXHRcdFx0bGFzdERvdFxuXHRcdF1cblx0XHRAY29ycmVjdCA9IEBzaG93ID0gZmFsc2Vcblx0XHRAZmlyc3QgPSBmaXJzdERvdFxuXHRcdEB0YXJnZXRfZGF0YSA9IENhcnQudHJhamVjdG9yeVxuXHRcdEB1cGRhdGVfZG90cygpXG5cdFx0QHNlbGVjdF9kb3QgQGRvdHNbMV1cblxuXHRzZXRfc2hvdzogKHYpLT5cblx0XHRAc2hvdyA9IHZcblx0c2V0X3Q6ICh0KS0+XG5cdFx0QHQgPSB0XG5cblx0aW5jcmVtZW50OiAoZHQpLT5cblx0XHRAdCArPSBkdFxuXG5cdHNlbGVjdF9kb3Q6IChkb3QpLT5cblx0XHRAc2VsZWN0ZWQgPSBkb3RcblxuXHRhZGRfZG90OiAodCwgdiktPlxuXHRcdG5ld0RvdCA9IG5ldyBEb3QgdCx2XG5cdFx0QGRvdHMucHVzaCBuZXdEb3Rcblx0XHRAdXBkYXRlX2RvdCBuZXdEb3QsIHQsIHZcblxuXHRyZW1vdmVfZG90OiAoZG90KS0+XG5cdFx0QGRvdHMuc3BsaWNlIEBkb3RzLmluZGV4T2YoZG90KSwgMVxuXHRcdEB1cGRhdGVfZG90cygpXG5cblx0dXBkYXRlX2RvdHM6IC0+IFxuXHRcdEBkb3RzLnNvcnQgKGEsYiktPiBhLnQgLSBiLnRcblx0XHRAZG90cy5mb3JFYWNoIChkb3QsIGksIGspLT5cblx0XHRcdHByZXYgPSBrW2ktMV1cblx0XHRcdGlmIGRvdC5pZCA9PSAnbGFzdCdcblx0XHRcdFx0ZG90LnYgPSBwcmV2LnZcblx0XHRcdFx0cmV0dXJuXG5cdFx0XHRpZiBwcmV2XG5cdFx0XHRcdGR0ID0gZG90LnQgLSBwcmV2LnRcblx0XHRcdFx0ZG90LnggPSBwcmV2LnggKyBkdCAqIChkb3QudiArIHByZXYudikvMlxuXHRcdFx0XHRkb3QuZHYgPSAoZG90LnYgLSBwcmV2LnYpL01hdGgubWF4KGR0LCAuMDAwMSlcblx0XHRcdGVsc2Vcblx0XHRcdFx0ZG90LnggPSAwXG5cdFx0XHRcdGRvdC5kdiA9IDBcblxuXHR1cGRhdGVfZG90OiAoZG90LCB0LCB2KS0+XG5cdFx0aWYgZG90LmlkID09ICdmaXJzdCcgdGhlbiByZXR1cm5cblx0XHRAc2VsZWN0X2RvdCBkb3Rcblx0XHRkb3QudCA9IHRcblx0XHRkb3QudiA9IHZcblx0XHRAdXBkYXRlX2RvdHMoKVxuXHRcdEBjb3JyZWN0ID0gTWF0aC5hYnMoQ2FydC5rICogZG90LnYgKyBkb3QuZHYpIDwgMC4wNVxuXG5tb2R1bGUuZXhwb3J0cyA9IG5ldyBEYXRhIiwiRGF0YSA9IHJlcXVpcmUgJy4vZGVzaWduRGF0YSdcblxudGVtcGxhdGUgPSAnJydcblx0PGNpcmNsZSBjbGFzcz0nZG90IGxhcmdlJz48L2NpcmNsZT5cblx0PGNpcmNsZSBjbGFzcz0nZG90IHNtYWxsJyByPSc0Jz48L2NpcmNsZT5cbicnJ1xuXG5jbGFzcyBDdHJsXG5cdGNvbnN0cnVjdG9yOiAoQHNjb3BlLCBAZWwpLT5cblx0XHRyYWQgPSA3ICN0aGUgcmFkaXVzIG9mIHRoZSBsYXJnZSBjaXJjbGUgbmF0dXJhbGx5XG5cdFx0c2VsID0gZDMuc2VsZWN0IEBlbFswXVxuXHRcdGJpZyA9IHNlbC5zZWxlY3QgJ2NpcmNsZS5kb3QubGFyZ2UnXG5cdFx0XHQuYXR0ciAncicsIHJhZFxuXHRcdGNpcmMgPSBzZWwuc2VsZWN0ICdjaXJjbGUuZG90LnNtYWxsJ1xuXG5cdFx0YmlnLm9uICdtb3VzZW92ZXInLCBAbW91c2VvdmVyXG5cdFx0XHQub24gJ2NvbnRleHRtZW51JywgLT4gXG5cdFx0XHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KClcblx0XHRcdFx0ZXZlbnQuc3RvcFByb3BhZ2F0aW9uKClcblx0XHRcdC5vbiAnbW91c2Vkb3duJywgLT5cblx0XHRcdFx0YmlnLnRyYW5zaXRpb24gJ2dyb3cnXG5cdFx0XHRcdFx0LmR1cmF0aW9uIDE1MFxuXHRcdFx0XHRcdC5lYXNlICdjdWJpYydcblx0XHRcdFx0XHQuYXR0ciAncicsIHJhZCoxLjdcblx0XHRcdC5vbiAnbW91c2V1cCcsIC0+XG5cdFx0XHRcdGJpZy50cmFuc2l0aW9uICdncm93J1xuXHRcdFx0XHRcdC5kdXJhdGlvbiAxNTBcblx0XHRcdFx0XHQuZWFzZSAnY3ViaWMtaW4nXG5cdFx0XHRcdFx0LmF0dHIgJ3InLCByYWQqMS4zXG5cdFx0XHQub24gJ21vdXNlb3V0JyAsIEBtb3VzZW91dFxuXG5cdFx0QHNjb3BlLiR3YXRjaCA9PlxuXHRcdFx0XHQoRGF0YS5zZWxlY3RlZCA9PSBAZG90KSBhbmQgKERhdGEuc2hvdylcblx0XHRcdCwgKHYsIG9sZCktPlxuXHRcdFx0XHRpZiB2XG5cdFx0XHRcdFx0YmlnLnRyYW5zaXRpb24gJ2dyb3cnXG5cdFx0XHRcdFx0XHQuZHVyYXRpb24gMTUwXG5cdFx0XHRcdFx0XHQuZWFzZSAnY3ViaWMtb3V0J1xuXHRcdFx0XHRcdFx0LmF0dHIgJ3InICwgcmFkICogMS41XG5cdFx0XHRcdFx0XHQudHJhbnNpdGlvbigpXG5cdFx0XHRcdFx0XHQuZHVyYXRpb24gMTUwXG5cdFx0XHRcdFx0XHQuZWFzZSAnY3ViaWMtaW4nXG5cdFx0XHRcdFx0XHQuYXR0ciAncicgLCByYWQgKiAxLjNcblxuXHRcdFx0XHRcdGNpcmMudHJhbnNpdGlvbigpXG5cdFx0XHRcdFx0XHQuZHVyYXRpb24gMTUwXG5cdFx0XHRcdFx0XHQuZWFzZSAnY3ViaWMtb3V0J1xuXHRcdFx0XHRcdFx0LnN0eWxlXG5cdFx0XHRcdFx0XHRcdCdzdHJva2Utd2lkdGgnOiAyLjVcblx0XHRcdFx0ZWxzZSBcblx0XHRcdFx0XHRiaWcudHJhbnNpdGlvbiAnc2hyaW5rJ1xuXHRcdFx0XHRcdFx0LmR1cmF0aW9uIDM1MFxuXHRcdFx0XHRcdFx0LmVhc2UgJ2JvdW5jZS1vdXQnXG5cdFx0XHRcdFx0XHQuYXR0ciAncicgLCByYWRcblxuXHRcdFx0XHRcdGNpcmMudHJhbnNpdGlvbigpXG5cdFx0XHRcdFx0XHQuZHVyYXRpb24gMTAwXG5cdFx0XHRcdFx0XHQuZWFzZSAnY3ViaWMnXG5cdFx0XHRcdFx0XHQuc3R5bGVcblx0XHRcdFx0XHRcdFx0J3N0cm9rZS13aWR0aCc6IDEuNlxuXHRcdFx0XHRcdFx0XHRzdHJva2U6ICd3aGl0ZSdcblx0XHRcdCBcblx0bW91c2VvdXQ6ID0+XG5cdFx0RGF0YS5zZXRfc2hvdyBmYWxzZVxuXHRcdEBzY29wZS4kZXZhbEFzeW5jKClcblxuXHRtb3VzZW92ZXI6ID0+XG5cdFx0RGF0YS5zZWxlY3RfZG90IEBkb3Rcblx0XHREYXRhLnNldF9zaG93IHRydWVcblx0XHRAc2NvcGUuJGV2YWxBc3luYygpXG5cbmRlciA9ICgpLT5cblx0ZGlyZWN0aXZlID0gXG5cdFx0dGVtcGxhdGU6IHRlbXBsYXRlXG5cdFx0Y29udHJvbGxlckFzOiAndm0nXG5cdFx0c2NvcGU6IFxuXHRcdFx0ZG90OiAnPWRvdERlcidcblx0XHRiaW5kVG9Db250cm9sbGVyOiB0cnVlXG5cdFx0Y29udHJvbGxlcjogWyckc2NvcGUnLCckZWxlbWVudCcsQ3RybF1cblx0XHRyZXN0cmljdDogJ0EnXG5cblxubW9kdWxlLmV4cG9ydHMgPSBkZXJcbiIsIkRhdGEgPSByZXF1aXJlICcuL2Rlc2lnbkRhdGEnXG5cbnRlbXBsYXRlID0gJycnXG5cdDxjaXJjbGUgY2xhc3M9J2RvdCBzbWFsbCcgcj0nNCc+PC9jaXJjbGU+XG4nJydcblxuY2xhc3MgQ3RybFxuXHRjb25zdHJ1Y3RvcjogKEBzY29wZSwgQGVsKS0+XG5cdFx0Y2lyYyA9IGQzLnNlbGVjdCBAZWxbMF1cblxuXHRcdGNpcmMub24gJ21vdXNlb3ZlcicsQG1vdXNlb3ZlclxuXHRcdFx0Lm9uICdtb3VzZW91dCcgLCBAbW91c2VvdXRcblx0XHRcdCMgLm9uICdjb250ZXh0bWVudScsIC0+IFxuXHRcdFx0IyBcdGV2ZW50LnByZXZlbnREZWZhdWx0KClcblx0XHRcdCMgXHRldmVudC5zdG9wUHJvcGFnYXRpb24oKVxuXG5cdFx0QHNjb3BlLiR3YXRjaCA9PlxuXHRcdFx0XHQoRGF0YS5zZWxlY3RlZCA9PSBAZG90KSBhbmQgKERhdGEuc2hvdylcblx0XHRcdCwgKHYsIG9sZCktPlxuXHRcdFx0XHQjIGlmIHYgPT0gb2xkIHRoZW4gcmV0dXJuXG5cdFx0XHRcdFxuXHRcdFx0XHRpZiB2XG5cdFx0XHRcdFx0Y2lyYy50cmFuc2l0aW9uKClcblx0XHRcdFx0XHRcdC5kdXJhdGlvbiAxNTBcblx0XHRcdFx0XHRcdC5lYXNlICdjdWJpYy1vdXQnXG5cdFx0XHRcdFx0XHQuc3R5bGVcblx0XHRcdFx0XHRcdFx0J3N0cm9rZS13aWR0aCc6IDIuNVxuXHRcdFx0XHRlbHNlIFxuXHRcdFx0XHRcdGNpcmMudHJhbnNpdGlvbigpXG5cdFx0XHRcdFx0XHQuZHVyYXRpb24gMTAwXG5cdFx0XHRcdFx0XHQuZWFzZSAnY3ViaWMnXG5cdFx0XHRcdFx0XHQuc3R5bGVcblx0XHRcdFx0XHRcdFx0J3N0cm9rZS13aWR0aCc6IDEuNlxuXHRcdFx0XHRcdFx0XHRzdHJva2U6ICd3aGl0ZSdcblx0XHRcdCBcblx0bW91c2VvdXQ6ID0+XG5cdFx0RGF0YS5zZXRfc2hvdyBmYWxzZVxuXHRcdEBzY29wZS4kZXZhbEFzeW5jKClcblxuXHRtb3VzZW92ZXI6ID0+XG5cdFx0RGF0YS5zZWxlY3RfZG90IEBkb3Rcblx0XHREYXRhLnNldF9zaG93IHRydWVcblx0XHRAc2NvcGUuJGV2YWxBc3luYygpXG5cbmRlciA9ICgpLT5cblx0ZGlyZWN0aXZlID0gXG5cdFx0dGVtcGxhdGU6IHRlbXBsYXRlXG5cdFx0Y29udHJvbGxlckFzOiAndm0nXG5cdFx0c2NvcGU6IFxuXHRcdFx0ZG90OiAnPWRvdEJEZXInXG5cdFx0YmluZFRvQ29udHJvbGxlcjogdHJ1ZVxuXHRcdGNvbnRyb2xsZXI6IFsnJHNjb3BlJywnJGVsZW1lbnQnLEN0cmxdXG5cdFx0cmVzdHJpY3Q6ICdBJ1xuXG5cbm1vZHVsZS5leHBvcnRzID0gZGVyXG4iLCJEYXRhID0gcmVxdWlyZSAnLi9kZXNpZ25EYXRhJ1xuXyA9IHJlcXVpcmUgJ2xvZGFzaCdcblxuY2xhc3MgQ2FydFxuXHRjb25zdHJ1Y3RvcjogLT5cblxuXHRsb2M6ICh0KS0+XG5cdFx0aSA9IF8uZmluZExhc3RJbmRleCBEYXRhLmRvdHMsIChkKS0+XG5cdFx0XHRkLnQgPD0gdFxuXHRcdGEgPSBEYXRhLmRvdHNbaV1cblx0XHRkdCA9IHQgLSBhLnRcblx0XHRkdiA9IERhdGEuZG90c1tpKzFdPy5kdiA/IDBcblx0XHRhLnggKyBhLnYgKiBkdCArIDAuNSpkdiAqIGR0KioyXG5cblx0QHByb3BlcnR5ICd4JywgZ2V0Oi0+IEBsb2MgRGF0YS50XG5cbm1vZHVsZS5leHBvcnRzID0gbmV3IENhcnQiLCJEYXRhID0gcmVxdWlyZSAnLi9kZXNpZ25EYXRhJ1xuXyA9IHJlcXVpcmUgJ2xvZGFzaCdcbnJlcXVpcmUgJy4uLy4uL2hlbHBlcnMnXG5cbmNsYXNzIENhcnRcblx0Y29uc3RydWN0b3I6IC0+XG5cblx0bG9jOiAodCktPlxuXHRcdDIvLjggKiAoMS1NYXRoLmV4cCgtLjgqdCkpXG5cblx0QHByb3BlcnR5ICd4JywgZ2V0Oi0+IEBsb2MgRGF0YS50XG5cbm1vZHVsZS5leHBvcnRzID0gbmV3IENhcnQiLCJhbmd1bGFyID0gcmVxdWlyZSAnYW5ndWxhcidcbmQzID0gcmVxdWlyZSAnZDMnXG5yZXF1aXJlICcuLi8uLi9oZWxwZXJzJ1xuXyA9IHJlcXVpcmUgJ2xvZGFzaCdcbnRlbXBsYXRlID0gJycnXG5cdDxzdmcgbmctaW5pdD0ndm0ucmVzaXplKCknIHdpZHRoPScxMDAlJyBjbGFzcz0ndG9wQ2hhcnQnPlxuXHRcdDxkZWZzPlxuXHRcdFx0PGNsaXBwYXRoIGlkPSdyZWcnPlxuXHRcdFx0XHQ8cmVjdCBkMy1kZXI9J3t3aWR0aDogdm0ud2lkdGgsIGhlaWdodDogdm0uaGVpZ2h0fScgLz5cblx0XHRcdDwvY2xpcHBhdGg+XG5cdFx0PC9kZWZzPlxuXHRcdDxnIGNsYXNzPSdib2lsZXJwbGF0ZScgc2hpZnRlcj0nW3ZtLm1hci5sZWZ0LCB2bS5tYXIudG9wXSc+XG5cdFx0XHQ8cmVjdCBjbGFzcz0nYmFja2dyb3VuZCcgZDMtZGVyPSd7d2lkdGg6IHZtLndpZHRoLCBoZWlnaHQ6IHZtLmhlaWdodH0nIG5nLW1vdXNlbW92ZT0ndm0ubW92ZSgkZXZlbnQpJyAvPlxuXHRcdFx0PGcgdmVyLWF4aXMtZGVyIHdpZHRoPSd2bS53aWR0aCcgc2NhbGU9J3ZtLlZlcicgZnVuPSd2bS52ZXJBeEZ1bic+PC9nPlxuXHRcdFx0PGcgaG9yLWF4aXMtZGVyIGhlaWdodD0ndm0uaGVpZ2h0JyBzY2FsZT0ndm0uSG9yJyBmdW49J3ZtLmhvckF4RnVuJyBzaGlmdGVyPSdbMCx2bS5oZWlnaHRdJz48L2c+XG5cdFx0XHQ8Zm9yZWlnbk9iamVjdCB3aWR0aD0nMzAnIGhlaWdodD0nMzAnIHk9JzE4JyBzaGlmdGVyPSdbdm0ud2lkdGgvMiwgdm0uaGVpZ2h0XSc+XG5cdFx0XHRcdDx0ZXh0IGNsYXNzPSdsYWJlbCc+JHQkPC90ZXh0PlxuXHRcdFx0PC9mb3JlaWduT2JqZWN0PlxuXG5cdFx0PC9nPlxuXHRcdDxnIGNsYXNzPSdtYWluJyBjbGlwLXBhdGg9XCJ1cmwoI3JlZylcIiBzaGlmdGVyPSdbdm0ubWFyLmxlZnQsIHZtLm1hci50b3BdJz5cblx0XHRcdDxsaW5lIGNsYXNzPSd6ZXJvLWxpbmUgaG9yJyBuZy1jbGFzcz0ne1wiY29ycmVjdFwiOiB2bS5jb3JyZWN0fScgZDMtZGVyPSd7eDE6IDAsIHgyOiB2bS53aWR0aCwgeTE6IHZtLlZlcigwKSwgeTI6IHZtLlZlcigwKX0nLz5cblx0XHRcdDxsaW5lIGNsYXNzPSd0cmkgdicgZDMtZGVyPSd7eDE6IHZtLkhvcih2bS5wb2ludC50KSwgeDI6IHZtLkhvcih2bS5wb2ludC50KSwgeTE6IHZtLlZlcigwKSwgeTI6IHZtLlZlcih2bS5wb2ludC52ICl9Jy8+XG5cdFx0XHQ8Y2lyY2xlIHI9JzNweCcgc2hpZnRlcj0nW3ZtLkhvcih2bS5wb2ludC50KSwgdm0uVmVyKHZtLnBvaW50LnYpXScgY2xhc3M9J3BvaW50IHYnLz5cblx0XHRcdDxwYXRoIGQzLWRlcj0ne2Q6dm0ubGluZUZ1bih2bS5kYXRhKX0nIGNsYXNzPSdmdW4gdicgLz5cblx0XHRcdDxmb3JlaWduT2JqZWN0IHdpZHRoPSczMCcgaGVpZ2h0PSczMCcgc2hpZnRlcj0nWyh2bS5Ib3Iodm0ucG9pbnQudCkgLSAxNiksIHZtLlZlcih2bS5wb2ludC52LzIpIC0gN10nPlxuXHRcdFx0XHRcdDx0ZXh0IGNsYXNzPSd0cmktbGFiZWwnIGZvbnQtc2l6ZT0nMTNweCc+JHkkPC90ZXh0PlxuXHRcdFx0PC9mb3JlaWduT2JqZWN0PlxuXHRcdFx0PGZvcmVpZ25PYmplY3Qgd2lkdGg9JzIwMCcgaGVpZ2h0PSczMCcgc2hpZnRlcj0nW3ZtLkhvcigxKSwgdm0uVmVyKC45KV0nPlxuXHRcdFx0XHQ8dGV4dCBjbGFzcz0ndHJpLWxhYmVsJz4kNSh0LS41KSh0LTEpKHQtMSleMiQ8L3RleHQ+XG5cdFx0XHQ8L2ZvcmVpZ25PYmplY3Q+XG5cdFx0PC9nPlxuXHQ8L3N2Zz5cbicnJ1xuXG5jbGFzcyBDdHJsXG5cdGNvbnN0cnVjdG9yOiAoQHNjb3BlLCBAZWwsIEB3aW5kb3cpLT5cblx0XHRAbWFyID0gXG5cdFx0XHRsZWZ0OiAzMFxuXHRcdFx0dG9wOiAxMFxuXHRcdFx0cmlnaHQ6IDIwXG5cdFx0XHRib3R0b206IDQwXG5cblx0XHRAVmVyID0gZDMuc2NhbGUubGluZWFyKCkuZG9tYWluIFstMSwxXVxuXHRcdEBIb3IgPSBkMy5zY2FsZS5saW5lYXIoKS5kb21haW4gWzAsMi41XVxuXG5cdFx0QGhvckF4RnVuID0gZDMuc3ZnLmF4aXMoKVxuXHRcdFx0LnNjYWxlIEBIb3Jcblx0XHRcdC50aWNrRm9ybWF0KGQzLmZvcm1hdCAnZCcpXG5cdFx0XHQub3JpZW50ICdib3R0b20nXG5cblx0XHRAdmVyQXhGdW4gPSBkMy5zdmcuYXhpcygpXG5cdFx0XHQuc2NhbGUgQFZlclxuXHRcdFx0LnRpY2tzIDVcblx0XHRcdC50aWNrRm9ybWF0IChkKS0+XG5cdFx0XHRcdGlmIE1hdGguZmxvb3IoZCkgIT0gZCB0aGVuIHJldHVyblxuXHRcdFx0XHRkXG5cdFx0XHQub3JpZW50ICdsZWZ0J1xuXG5cdFx0QGxpbmVGdW4gPSBkMy5zdmcubGluZSgpXG5cdFx0XHQueSAoZCk9PiBAVmVyIGQudlxuXHRcdFx0LnggKGQpPT4gQEhvciBkLnRcblxuXHRcdHZGdW4gPSAodCktPjUqICh0LS41KSAqICh0LTEpICogKHQtMikqKjJcblxuXHRcdEBkYXRhID0gXy5yYW5nZSAwICwgMyAsIDEvNTBcblx0XHRcdC5tYXAgKHQpLT5cblx0XHRcdFx0cmVzID0gXG5cdFx0XHRcdFx0djogdkZ1biB0XG5cdFx0XHRcdFx0dDogdFxuXG5cdFx0QHBvaW50ID0gXy5zYW1wbGUgQGRhdGFcblxuXHRcdEBjb3JyZWN0ID0gZmFsc2VcblxuXHRcdGFuZ3VsYXIuZWxlbWVudCBAd2luZG93XG5cdFx0XHQub24gJ3Jlc2l6ZScsIEByZXNpemVcblxuXHRcdEBtb3ZlID0gKGV2ZW50KSA9PlxuXHRcdFx0cmVjdCA9IGV2ZW50LnRhcmdldC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKVxuXHRcdFx0dCA9IEBIb3IuaW52ZXJ0IGV2ZW50LnggLSByZWN0LmxlZnRcblx0XHRcdHYgPSB2RnVuIHRcblx0XHRcdEBwb2ludCA9IFxuXHRcdFx0XHR0OiB0XG5cdFx0XHRcdHY6IHZcblx0XHRcdEBjb3JyZWN0ID0gTWF0aC5hYnMoQHBvaW50LnYpIDw9IDAuMDUgXG5cdFx0XHRAc2NvcGUuJGV2YWxBc3luYygpXG5cblx0QHByb3BlcnR5ICdzdmdfaGVpZ2h0JywgZ2V0OiAtPiBAaGVpZ2h0ICsgQG1hci50b3AgKyBAbWFyLmJvdHRvbVxuXG5cdHJlc2l6ZTogKCk9PlxuXHRcdEB3aWR0aCA9IEBlbFswXS5jbGllbnRXaWR0aCAtIEBtYXIubGVmdCAtIEBtYXIucmlnaHRcblx0XHRAaGVpZ2h0ID0gQGVsWzBdLmNsaWVudEhlaWdodCAtIEBtYXIubGVmdCAtIEBtYXIucmlnaHRcblx0XHRAVmVyLnJhbmdlIFtAaGVpZ2h0LCAwXVxuXHRcdEBIb3IucmFuZ2UgWzAsIEB3aWR0aF1cblx0XHRAc2NvcGUuJGV2YWxBc3luYygpXG5cbmRlciA9ICgpLT5cblx0ZGlyZWN0aXZlID0gXG5cdFx0Y29udHJvbGxlckFzOiAndm0nXG5cdFx0c2NvcGU6IHt9XG5cdFx0dGVtcGxhdGU6IHRlbXBsYXRlXG5cdFx0dGVtcGxhdGVOYW1lc3BhY2U6ICdzdmcnXG5cdFx0Y29udHJvbGxlcjogWyckc2NvcGUnLCckZWxlbWVudCcsICckd2luZG93JywgQ3RybF1cblxubW9kdWxlLmV4cG9ydHMgPSBkZXJcbiIsImRyYWcgPSAoJHBhcnNlKS0+XG5cdGRpcmVjdGl2ZSA9IFxuXHRcdGxpbms6IChzY29wZSxlbCxhdHRyKS0+XG5cdFx0XHRzZWwgPSBkMy5zZWxlY3QoZWxbMF0pXG5cdFx0XHRzZWwuY2FsbCgkcGFyc2UoYXR0ci5iZWhhdmlvcikoc2NvcGUpKVxuXG5tb2R1bGUuZXhwb3J0cyA9IGRyYWciLCJkMyA9IHJlcXVpcmUgJ2QzJ1xuYW5ndWxhciA9IHJlcXVpcmUgJ2FuZ3VsYXInXG5cbmRlciA9ICgkcGFyc2UpLT4gI2dvZXMgb24gYSBzdmcgZWxlbWVudFxuXHRkaXJlY3RpdmUgPSBcblx0XHRyZXN0cmljdDogJ0EnXG5cdFx0c2NvcGU6IFxuXHRcdFx0ZDNEZXI6ICc9J1xuXHRcdFx0dHJhbjogJz0nXG5cdFx0bGluazogKHNjb3BlLCBlbCwgYXR0ciktPlxuXHRcdFx0c2VsID0gZDMuc2VsZWN0IGVsWzBdXG5cdFx0XHR1ID0gJ3QtJyArIE1hdGgucmFuZG9tKClcblx0XHRcdHNjb3BlLiR3YXRjaCAnZDNEZXInXG5cdFx0XHRcdCwgKHYpLT5cblx0XHRcdFx0XHRpZiBzY29wZS50cmFuXG5cdFx0XHRcdFx0XHRzZWwudHJhbnNpdGlvbiB1XG5cdFx0XHRcdFx0XHRcdC5hdHRyIHZcblx0XHRcdFx0XHRcdFx0LmNhbGwgc2NvcGUudHJhblxuXHRcdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRcdHNlbC5hdHRyIHZcblxuXHRcdFx0XHQsIHRydWVcbm1vZHVsZS5leHBvcnRzID0gZGVyIiwibW9kdWxlLmV4cG9ydHMgPSAoJHBhcnNlKS0+XG5cdChzY29wZSwgZWwsIGF0dHIpLT5cblx0XHRkMy5zZWxlY3QoZWxbMF0pLmRhdHVtICRwYXJzZShhdHRyLmRhdHVtKShzY29wZSkiLCJkMyA9IHJlcXVpcmUgJ2QzJ1xuXG5kZXIgPSAoJHBhcnNlKS0+XG5cdGRpcmVjdGl2ZSA9XG5cdFx0bGluazogKHNjb3BlLCBlbCwgYXR0ciktPlxuXHRcdFx0cmVzaGlmdCA9ICh2KS0+IFxuXHRcdFx0XHRkMy5zZWxlY3QgZWxbMF1cblx0XHRcdFx0XHQuYXR0ciAndHJhbnNmb3JtJyAsIFwidHJhbnNsYXRlKCN7dlswXX0sI3t2WzFdfSlcIlxuXG5cdFx0XHRzY29wZS4kd2F0Y2ggLT5cblx0XHRcdFx0XHQkcGFyc2UoYXR0ci5zaGlmdGVyKShzY29wZSlcblx0XHRcdFx0LCByZXNoaWZ0XG5cdFx0XHRcdCwgdHJ1ZVxuXG5tb2R1bGUuZXhwb3J0cyA9IGRlciIsImFuZ3VsYXIgPSByZXF1aXJlICdhbmd1bGFyJ1xuZDMgPSByZXF1aXJlICdkMydcbnRleHR1cmVzID0gcmVxdWlyZSAndGV4dHVyZXMnXG5cbmNsYXNzIEN0cmxcblx0Y29uc3RydWN0b3I6IChAc2NvcGUsIEBlbCwgQHdpbmRvdyktPlxuXHRcdHQgPSB0ZXh0dXJlcy5saW5lcygpXG5cdFx0XHQub3JpZW50YXRpb24gXCIzLzhcIiwgXCI3LzhcIlxuXHRcdFx0LnNpemUgNFxuXHRcdFx0LnN0cm9rZSgnI0U2RTZFNicpXG5cdFx0ICAgIC5zdHJva2VXaWR0aCAuNlxuXG5cdFx0dC5pZCAnbXlUZXh0dXJlJ1xuXG5cdFx0ZDMuc2VsZWN0IEBlbFswXVxuXHRcdFx0LnNlbGVjdCAnc3ZnJ1xuXHRcdFx0LmNhbGwgdFxuXG5kZXIgPSAtPlxuXHRkaXJlY3RpdmUgPSBcblx0XHRjb250cm9sbGVyQXM6ICd2bSdcblx0XHRzY29wZToge31cblx0XHR0ZW1wbGF0ZTogJzxzdmcgaGVpZ2h0PVwiMHB4XCIgc3R5bGU9XCJwb3NpdGlvbjogYWJzb2x1dGU7XCIgd2lkdGg9XCIwcHhcIj48L3N2Zz4nXG5cdFx0dGVtcGxhdGVOYW1lc3BhY2U6ICdzdmcnXG5cdFx0Y29udHJvbGxlcjogWyckc2NvcGUnLCckZWxlbWVudCcsICckd2luZG93JywgQ3RybF1cblxubW9kdWxlLmV4cG9ydHMgPSBkZXJcbiIsImQzID0gcmVxdWlyZSAnZDMnXG5hbmd1bGFyID0gcmVxdWlyZSAnYW5ndWxhcidcblxuZGVyID0gKCR3aW5kb3cpLT5cblx0ZGlyZWN0aXZlID0gXG5cdFx0Y29udHJvbGxlcjogYW5ndWxhci5ub29wXG5cdFx0Y29udHJvbGxlckFzOiAndm0nXG5cdFx0YmluZFRvQ29udHJvbGxlcjogdHJ1ZVxuXHRcdHJlc3RyaWN0OiAnQSdcblx0XHR0ZW1wbGF0ZU5hbWVzcGFjZTogJ3N2Zydcblx0XHRzY29wZTogXG5cdFx0XHRzY2FsZTogJz0nXG5cdFx0XHRoZWlnaHQ6ICc9J1xuXHRcdFx0ZnVuOiAnPSdcblx0XHRsaW5rOiAoc2NvcGUsIGVsLCBhdHRyLCB2bSktPlxuXHRcdFx0eEF4aXNGdW4gPSB2bS5mdW4gPyAoZDMuc3ZnLmF4aXMoKVxuXHRcdFx0XHRcdFx0XHQuc2NhbGUgdm0uc2NhbGVcblx0XHRcdFx0XHRcdFx0Lm9yaWVudCAnYm90dG9tJylcblxuXHRcdFx0c2VsID0gZDMuc2VsZWN0IGVsWzBdXG5cdFx0XHRcdC5jbGFzc2VkICd4IGF4aXMnLCB0cnVlXG5cblx0XHRcdHVwZGF0ZSA9ICgpPT5cblx0XHRcdFx0eEF4aXNGdW4udGlja1NpemUgLXZtLmhlaWdodFxuXHRcdFx0XHRzZWwuY2FsbCB4QXhpc0Z1blxuXHRcdFx0XHRcblx0XHRcdHVwZGF0ZSgpXG5cdFx0XHRcdFxuXHRcdFx0c2NvcGUuJHdhdGNoICd2bS5zY2FsZS5kb21haW4oKScsIHVwZGF0ZSAsIHRydWVcblx0XHRcdHNjb3BlLiR3YXRjaCAndm0uc2NhbGUucmFuZ2UoKScsIHVwZGF0ZSAsIHRydWVcblx0XHRcdHNjb3BlLiR3YXRjaCAndm0uaGVpZ2h0JywgdXBkYXRlICwgdHJ1ZVxuXG5tb2R1bGUuZXhwb3J0cyA9IGRlciIsImQzID0gcmVxdWlyZSAnZDMnXG5hbmd1bGFyID0gcmVxdWlyZSAnYW5ndWxhcidcblxuZGVyID0gKCR3aW5kb3cpLT5cblx0ZGlyZWN0aXZlID0gXG5cdFx0Y29udHJvbGxlcjogYW5ndWxhci5ub29wXG5cdFx0Y29udHJvbGxlckFzOiAndm0nXG5cdFx0YmluZFRvQ29udHJvbGxlcjogdHJ1ZVxuXHRcdHJlc3RyaWN0OiAnQSdcblx0XHR0ZW1wbGF0ZU5hbWVzcGFjZTogJ3N2Zydcblx0XHRzY29wZTogXG5cdFx0XHRzY2FsZTogJz0nXG5cdFx0XHR3aWR0aDogJz0nXG5cdFx0XHRmdW46ICc9J1xuXHRcdGxpbms6IChzY29wZSwgZWwsIGF0dHIsIHZtKS0+XG5cdFx0XHR5QXhpc0Z1biA9IHZtLmZ1biA/IGQzLnN2Zy5heGlzKClcblx0XHRcdFx0LnNjYWxlIHZtLnNjYWxlXG5cdFx0XHRcdC5vcmllbnQgJ2xlZnQnXG5cblx0XHRcdHNlbCA9IGQzLnNlbGVjdChlbFswXSkuY2xhc3NlZCgneSBheGlzJywgdHJ1ZSlcblxuXHRcdFx0dXBkYXRlID0gKCk9PlxuXHRcdFx0XHR5QXhpc0Z1bi50aWNrU2l6ZSggLXZtLndpZHRoKVxuXHRcdFx0XHRzZWwuY2FsbCh5QXhpc0Z1bilcblxuXHRcdFx0dXBkYXRlKClcblx0XHRcdFx0XG5cdFx0XHRzY29wZS4kd2F0Y2ggJ3ZtLnNjYWxlLmRvbWFpbigpJywgdXBkYXRlICwgdHJ1ZVxuXHRcdFx0c2NvcGUuJHdhdGNoICd2bS5zY2FsZS5yYW5nZSgpJywgdXBkYXRlICwgdHJ1ZVxuXHRcdFx0c2NvcGUuJHdhdGNoICd2bS5zY2FsZS50aWNrcygpJywgdXBkYXRlICwgdHJ1ZVxuXG5cbm1vZHVsZS5leHBvcnRzID0gZGVyIiwiJ3VzZSBzdHJpY3QnXG5cbm1vZHVsZS5leHBvcnRzLnRpbWVvdXQgPSAoZnVuLCB0aW1lKS0+XG5cdFx0ZDMudGltZXIoKCk9PlxuXHRcdFx0ZnVuKClcblx0XHRcdHRydWVcblx0XHQsdGltZSlcblxuXG5GdW5jdGlvbjo6cHJvcGVydHkgPSAocHJvcCwgZGVzYykgLT5cbiAgT2JqZWN0LmRlZmluZVByb3BlcnR5IEBwcm90b3R5cGUsIHByb3AsIGRlc2MiXX0=
