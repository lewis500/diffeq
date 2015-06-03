(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';
var angular, app, d3, looper;

angular = require('angular');

d3 = require('d3');

app = angular.module('mainApp', [require('angular-material')]).directive('horAxisDer', require('./directives/xAxis')).directive('verAxisDer', require('./directives/yAxis')).directive('cartSimDer', require('./components/cart/cartSim')).directive('cartObjectDer', require('./components/cart/cartObject')).directive('cartButtonsDer', require('./components/cart/cartButtons')).directive('shifter', require('./directives/shifter')).directive('behavior', require('./directives/behavior')).directive('dotADer', require('./components/design/dotA')).directive('dotBDer', require('./components/design/dotB')).directive('datum', require('./directives/datum')).directive('d3Der', require('./directives/d3Der')).directive('designADer', require('./components/design/designA')).directive('designBDer', require('./components/design/designB')).directive('derivativeADer', require('./components/derivative/derivativeA')).directive('derivativeBDer', require('./components/derivative/derivativeB')).directive('cartPlotDer', require('./components/cart/cartPlot')).directive('designCartADer', require('./components/design/designCartA')).directive('designCartBDer', require('./components/design/designCartB')).directive('textureDer', require('./directives/texture')).directive('boilerplateDer', require('./directives/boilerplate')).directive('cartDer', require('./directives/cartDer')).service('derivativeData', require('./components/derivative/derivativeData')).service('fakeCart', require('./components/design/fakeCart')).service('trueCart', require('./components/design/trueCart')).service('designData', require('./components/design/designData'));

looper = function() {
  return setTimeout(function() {
    d3.selectAll('circle.dot.large').transition('grow').duration(500).ease('cubic-out').attr('transform', 'scale( 1.34)').transition('shrink').duration(500).ease('cubic-out').attr('transform', 'scale( 1.0)');
    return looper();
  }, 1000);
};

looper();



},{"./components/cart/cartButtons":2,"./components/cart/cartObject":4,"./components/cart/cartPlot":5,"./components/cart/cartSim":6,"./components/derivative/derivativeA":7,"./components/derivative/derivativeB":8,"./components/derivative/derivativeData":9,"./components/design/designA":10,"./components/design/designB":11,"./components/design/designCartA":12,"./components/design/designCartB":13,"./components/design/designData":14,"./components/design/dotA":15,"./components/design/dotB":16,"./components/design/fakeCart":17,"./components/design/trueCart":18,"./directives/behavior":19,"./directives/boilerplate":20,"./directives/cartDer":21,"./directives/d3Der":22,"./directives/datum":23,"./directives/shifter":25,"./directives/texture":26,"./directives/xAxis":27,"./directives/yAxis":28,"angular":undefined,"angular-material":undefined,"d3":undefined}],2:[function(require,module,exports){
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
      left: '=',
      top: '='
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



},{"../../helpers":29,"./cartData":3,"angular":undefined,"d3":undefined,"lodash":undefined}],6:[function(require,module,exports){
var Cart, Ctrl, _, d3, der, min;

_ = require('lodash');

d3 = require('d3');

min = Math.min;

Cart = require('./cartData');

require('../../helpers');

Ctrl = (function() {
  function Ctrl(scope, el, window) {
    this.scope = scope;
    this.el = el;
    this.window = window;
    this.Cart = Cart;
    this.max = 4;
    this.sample = [];
  }

  return Ctrl;

})();

der = function() {
  var directive;
  return directive = {
    template: '<div cart-der data="vm.Cart" max="vm.max" sample="vm.sample"></div>',
    scope: {},
    restrict: 'A',
    bindToController: true,
    controller: ['$scope', '$element', '$window', Ctrl],
    controllerAs: 'vm'
  };
};

module.exports = der;



},{"../../helpers":29,"./cartData":3,"d3":undefined,"lodash":undefined}],7:[function(require,module,exports){
var Ctrl, PlotCtrl, _, angular, d3, der, template,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

angular = require('angular');

d3 = require('d3');

require('../../helpers');

_ = require('lodash');

PlotCtrl = require('../../directives/plotCtrl');

template = '<svg ng-init=\'vm.resize()\' class=\'topChart\' >\n	<g boilerplate-der width=\'vm.width\' height=\'vm.height\' ver-ax-fun=\'vm.verAxFun\' hor-ax-fun=\'vm.horAxFun\' ver=\'vm.Ver\' hor=\'vm.Hor\' mar=\'vm.mar\' name=\'vm.name\'></g>\n	<g class=\'main\' ng-attr-clip-path=\'url(#{{vm.name}})\' shifter=\'[vm.mar.left, vm.mar.top]\'>\n		<foreignObject width=\'30\' height=\'30\' y=\'20\' shifter=\'[vm.width/2, vm.height]\'>\n				<text class=\'label\' >$t$</text>\n		</foreignObject>\n		<line class=\'zero-line hor\' d3-der=\'{x1: 0, x2: vm.width, y1: vm.Ver(0), y2: vm.Ver(0)}\'/>\n		<path ng-attr-d=\'{{vm.lineFun(vm.Data.trajectory)}}\' class=\'fun v\' />\n		<path ng-attr-d=\'{{vm.triangleData}}\' class=\'tri\' />\n		<line class=\'tri dv\' d3-der=\'{x1: vm.Hor(vm.point.t)-1, x2: vm.Hor(vm.point.t)-1, y1: vm.Ver(vm.point.v), y2: vm.Ver((vm.point.v + vm.point.dv))}\'/>\n		<foreignObject width=\'30\' height=\'30\' shifter=\'[(vm.Hor(vm.point.t) - 16), vm.sthing]\'>\n				<text class=\'tri-label\' >$\\dot{y}$</text>\n		</foreignObject>\n		<foreignObject width=\'100\' height=\'30\' shifter=\'[vm.Hor(1.65), vm.Ver(1.38)]\'>\n			<text class=\'tri-label\'>$\\sin(t)$</text>\n		</foreignObject>\n		<circle r=\'3px\'  shifter=\'[vm.Hor(vm.point.t), vm.Ver(vm.point.v)]\' class=\'point v\'/>\n	</g>\n</svg>';

Ctrl = (function(superClass) {
  extend(Ctrl, superClass);

  function Ctrl(scope1, el1, window, Data) {
    this.scope = scope1;
    this.el = el1;
    this.window = window;
    this.Data = Data;
    this.move = bind(this.move, this);
    Ctrl.__super__.constructor.call(this, this.scope, this.el, this.window);
    this.name = 'derivativeA';
    this.Ver.domain([-1.5, 1.5]);
    this.Hor.domain([0, 6]);
    this.lineFun.y((function(_this) {
      return function(d) {
        return _this.Ver(d.v);
      };
    })(this)).x((function(_this) {
      return function(d) {
        return _this.Hor(d.t);
      };
    })(this));
    setTimeout((function(_this) {
      return function() {
        return _this.Data.play();
      };
    })(this));
  }

  Ctrl.prototype.move = function() {
    var t;
    t = this.Hor.invert(event.x - event.target.getBoundingClientRect().left);
    this.Data.setT(t);
    return this.scope.$evalAsync();
  };

  Ctrl.property('sthing', {
    get: function() {
      return this.Ver(this.point.dv / 2 + this.point.v) - 7;
    }
  });

  Ctrl.property('point', {
    get: function() {
      return this.Data.point;
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

  return Ctrl;

})(PlotCtrl);

der = function() {
  var directive;
  return directive = {
    controllerAs: 'vm',
    scope: {},
    link: function(scope, el, attr, vm) {
      return d3.select(el[0]).select('rect.background').on('mouseover', function() {
        return vm.Data.pause();
      }).on('mousemove', function() {
        return vm.move();
      }).on('mouseout', function() {
        return vm.Data.play();
      });
    },
    template: template,
    templateNamespace: 'svg',
    controller: ['$scope', '$element', '$window', 'derivativeData', Ctrl]
  };
};

module.exports = der;



},{"../../directives/plotCtrl":24,"../../helpers":29,"angular":undefined,"d3":undefined,"lodash":undefined}],8:[function(require,module,exports){
var Ctrl, PlotCtrl, _, angular, d3, der, template,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

angular = require('angular');

d3 = require('d3');

require('../../helpers');

_ = require('lodash');

PlotCtrl = require('../../directives/plotCtrl');

template = '<svg ng-init=\'vm.resize()\' class=\'topChart\'>\n	<g boilerplate-der width=\'vm.width\' height=\'vm.height\' ver-ax-fun=\'vm.verAxFun\' hor-ax-fun=\'vm.horAxFun\' ver=\'vm.Ver\' hor=\'vm.Hor\' mar=\'vm.mar\' name=\'vm.name\'></g>\n	<g class=\'main\' ng-attr-clip-path="url(#{{vm.name}})" shifter=\'[vm.mar.left, vm.mar.top]\'>\n		<foreignObject width=\'30\' height=\'30\' y=\'20\' shifter=\'[vm.width/2, vm.height]\'>\n				<text class=\'label\' >$t$</text>\n		</foreignObject>\n		<line class=\'zero-line hor\' d3-der=\'{x1: 0, x2: vm.width, y1: vm.Ver(0), y2: vm.Ver(0)}\'/>\n		<path d3-der=\'{d:vm.lineFun(vm.Data.trajectory)}\' class=\'fun dv\' />\n		<line class=\'tri dv\' d3-der=\'{x1: vm.Hor(vm.point.t), x2: vm.Hor(vm.point.t), y1: vm.Ver(0), y2: vm.Ver(vm.point.dv)}\'/>\n		<foreignObject width=\'30\' height=\'30\' shifter=\'[(vm.Hor(vm.point.t) - 16), vm.Ver(vm.point.dv*.5)-6]\'>\n				<text class=\'tri-label\'>$\\dot{y}$</text>\n		</foreignObject>\n		<foreignObject width=\'100\' height=\'30\' shifter=\'[vm.Hor(.9), vm.Ver(1)]\'>\n			<text class=\'tri-label\'>$\\cos(t)$</text>\n		</foreignObject>\n		<circle r=\'4px\'  shifter=\'[vm.Hor(vm.point.t), vm.Ver(vm.point.dv)]\' class=\'point dv\'/>\n	</g>\n</svg>';

Ctrl = (function(superClass) {
  extend(Ctrl, superClass);

  function Ctrl(scope1, el1, window, Data) {
    this.scope = scope1;
    this.el = el1;
    this.window = window;
    this.Data = Data;
    this.move = bind(this.move, this);
    Ctrl.__super__.constructor.call(this, this.scope, this.el, this.window);
    this.Ver.domain([-1.5, 1.5]);
    this.Hor.domain([0, 6]);
    this.name = 'derivativeB';
    this.lineFun.y((function(_this) {
      return function(d) {
        return _this.Ver(d.dv);
      };
    })(this)).x((function(_this) {
      return function(d) {
        return _this.Hor(d.t);
      };
    })(this));
  }

  Ctrl.prototype.move = function() {
    var t;
    t = this.Hor.invert(event.x - event.target.getBoundingClientRect().left);
    this.Data.setT(t);
    return this.scope.$evalAsync();
  };

  Ctrl.property('point', {
    get: function() {
      return this.Data.point;
    }
  });

  return Ctrl;

})(PlotCtrl);

der = function() {
  var directive;
  return directive = {
    controllerAs: 'vm',
    scope: {},
    link: function(scope, el, attr, vm) {
      return d3.select(el[0]).select('rect.background').on('mouseover', function() {
        return vm.Data.pause();
      }).on('mousemove', function() {
        return vm.move();
      }).on('mouseout', function() {
        return vm.Data.play();
      });
    },
    template: template,
    templateNamespace: 'svg',
    controller: ['$scope', '$element', '$window', 'derivativeData', Ctrl]
  };
};

module.exports = der;



},{"../../directives/plotCtrl":24,"../../helpers":29,"angular":undefined,"d3":undefined,"lodash":undefined}],9:[function(require,module,exports){
var Service, _, dvFun, vFun;

_ = require('lodash');

vFun = Math.sin;

dvFun = Math.cos;

Service = (function() {
  function Service($rootScope) {
    this.rootScope = $rootScope;
    this.setT(0);
    this.paused = false;
    this.trajectory = _.range(0, 6, 1 / 25).map(function(t) {
      var res;
      return res = {
        dv: dvFun(t),
        v: vFun(t),
        t: t
      };
    });
    this.move(0);
  }

  Service.prototype.click = function() {
    if (this.paused) {
      return this.play();
    } else {
      return this.pause();
    }
  };

  Service.prototype.pause = function() {
    return this.paused = true;
  };

  Service.prototype.increment = function(dt) {
    this.t += dt;
    return this.move(this.t);
  };

  Service.prototype.setT = function(t) {
    this.t = t;
    return this.move(this.t);
  };

  Service.prototype.play = function() {
    var last;
    this.paused = true;
    d3.timer.flush();
    this.paused = false;
    last = 0;
    return d3.timer((function(_this) {
      return function(elapsed) {
        var dt;
        dt = elapsed - last;
        _this.increment(dt / 1000);
        last = elapsed;
        if (_this.t > 6) {
          _this.setT(0);
        }
        _this.rootScope.$evalAsync();
        return _this.paused;
      };
    })(this), 1);
  };

  Service.prototype.move = function(t) {
    return this.point = {
      dv: dvFun(t),
      v: vFun(t),
      t: t
    };
  };

  return Service;

})();

module.exports = Service;



},{"lodash":undefined}],10:[function(require,module,exports){
var Ctrl, PlotCtrl, der, template,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

require('../../helpers');

PlotCtrl = require('../../directives/plotCtrl');

template = '<svg ng-init=\'vm.resize()\' class=\'bottomChart\' >\n	<g boilerplate-der width=\'vm.width\' height=\'vm.height\' ver-ax-fun=\'vm.verAxFun\' hor-ax-fun=\'vm.horAxFun\' ver=\'vm.Ver\' hor=\'vm.Hor\' mar=\'vm.mar\' name=\'"designA"\'></g>\n	<g class=\'main\' clip-path="url(#designA)" shifter=\'[vm.mar.left, vm.mar.top]\' >\n		<rect style=\'opacity:0\' ng-attr-height=\'{{vm.height}}\' ng-attr-width=\'{{vm.width}}\' behavior=\'vm.drag_rect\'></rect>\n		<foreignObject width=\'30\' height=\'30\' shifter=\'[-38, vm.height/2]\'>\n				<text class=\'label\'>$v$</text>\n		</foreignObject>\n		<foreignObject width=\'30\' height=\'30\' y=\'20\' shifter=\'[vm.width/2, vm.height]\'>\n				<text class=\'label\' >$t$</text>\n		</foreignObject>\n		<line class=\'zero-line\' d3-der=\'{x1: 0, x2: vm.width, y1: vm.Ver(0), y2: vm.Ver(0)}\' />\n		<line class=\'zero-line\' d3-der="{x1: vm.Hor(0), x2: vm.Hor(0), y1: vm.height, y2: 0}" />\n		<g ng-class=\'{hide: !vm.Data.show}\' >\n			<line class=\'tri v\' d3-der=\'{x1: vm.Hor(vm.selected.t)-1, x2: vm.Hor(vm.selected.t)-1, y1: vm.Ver(0), y2: vm.Ver(vm.selected.v)}\'/>\n			<path ng-attr-d=\'{{vm.triangleData()}}\' class=\'tri\' />\n			<line d3-der=\'{x1: vm.Hor(vm.selected.t)+1, x2: vm.Hor(vm.selected.t)+1, y1: vm.Ver(vm.selected.v), y2: vm.Ver(vm.selected.v + vm.selected.dv)}\' class=\'tri dv\' />\n		</g>\n		<path ng-attr-d=\'{{vm.lineFun(vm.trueCart.trajectory)}}\' class=\'fun target\' />\n		<path ng-attr-d=\'{{vm.lineFun(vm.fakeCart.dots)}}\' class=\'fun v\' />\n		<g ng-repeat=\'dot in vm.dots track by dot.id\' datum=dot shifter=\'[vm.Hor(dot.t),vm.Ver(dot.v)]\' behavior=\'vm.drag\' dot-a-der=dot ></g>\n		<circle class=\'dot small\' r=\'4\' shifter=\'[vm.Hor(0),vm.Ver(2)]\' />\n		<foreignObject width=\'70\' height=\'30\' shifter=\'[vm.Hor(4), vm.Ver(.33)]\'>\n				<text class=\'tri-label\' >$2e^{-.8t}$</text>\n		</foreignObject>\n		<circle r=\'4px\'  shifter=\'[vm.Hor(vm.Data.t), vm.Ver(vm.fakeCart.v)]\' class=\'point fake\'/>\n		<circle r=\'4px\'  shifter=\'[vm.Hor(vm.Data.t), vm.Ver(vm.trueCart.v)]\' class=\'point real\'/>\n	</g>\n</svg>';

Ctrl = (function(superClass) {
  extend(Ctrl, superClass);

  function Ctrl(scope, el, window, fakeCart, trueCart, Data) {
    this.scope = scope;
    this.el = el;
    this.window = window;
    this.fakeCart = fakeCart;
    this.trueCart = trueCart;
    this.Data = Data;
    this.on_drag = bind(this.on_drag, this);
    Ctrl.__super__.constructor.call(this, this.scope, this.el, this.window);
    this.Ver.domain([-.1, 2.1]);
    this.Hor.domain([-.1, 4.5]);
    this.lineFun.y((function(_this) {
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
        _this.Data.set_show(true);
        rect = event.toElement.getBoundingClientRect();
        t = _this.Hor.invert(event.x - rect.left);
        v = _this.Ver.invert(event.y - rect.top);
        _this.fakeCart.add_dot(t, v);
        return _this.scope.$evalAsync();
      };
    })(this)).on('drag', (function(_this) {
      return function() {
        return _this.on_drag(_this.selected);
      };
    })(this)).on('dragend', (function(_this) {
      return function() {
        event.preventDefault();
        _this.Data.set_show(true);
        return event.stopPropagation();
      };
    })(this));
    this.drag = d3.behavior.drag().on('dragstart', (function(_this) {
      return function(dot) {
        d3.event.sourceEvent.stopPropagation();
        if (event.which === 3) {
          event.preventDefault();
          _this.fakeCart.remove_dot(dot);
          _this.Data.set_show(false);
          return _this.scope.$evalAsync();
        }
      };
    })(this)).on('drag', this.on_drag);
    this.Data.play();
  }

  Ctrl.property('dots', {
    get: function() {
      return this.fakeCart.dots.filter(function(d) {
        return (d.id !== 'first') && (d.id !== 'last');
      });
    }
  });

  Ctrl.property('selected', {
    get: function() {
      return this.fakeCart.selected;
    }
  });

  Ctrl.prototype.on_drag = function(dot) {
    this.fakeCart.update_dot(dot, this.Hor.invert(d3.event.x), this.Ver.invert(d3.event.y));
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

  return Ctrl;

})(PlotCtrl);

der = function() {
  var directive;
  return directive = {
    controllerAs: 'vm',
    scope: {},
    template: template,
    templateNamespace: 'svg',
    controller: ['$scope', '$element', '$window', 'fakeCart', 'trueCart', 'designData', Ctrl]
  };
};

module.exports = der;



},{"../../directives/plotCtrl":24,"../../helpers":29}],11:[function(require,module,exports){
var Ctrl, PlotCtrl, der, template,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

require('../../helpers');

PlotCtrl = require('../../directives/plotCtrl');

template = '<svg ng-init=\'vm.resize()\'  class=\'bottomChart\'>\n	<g boilerplate-der width=\'vm.width\' height=\'vm.height\' ver-ax-fun=\'vm.verAxFun\' hor-ax-fun=\'vm.horAxFun\' ver=\'vm.Ver\' hor=\'vm.Hor\' mar=\'vm.mar\' name=\'"designB"\'></g>\n	<g class=\'main\' clip-path="url(#designB)" shifter=\'[vm.mar.left, vm.mar.top]\'>\n		<foreignObject width=\'30\' height=\'30\' shifter=\'[-38, vm.height/2]\'>\n				<text class=\'label\'>$\\dot{v}$</text>\n		</foreignObject>\n		<foreignObject width=\'30\' height=\'30\' y=\'20\' shifter=\'[vm.width/2, vm.height]\'>\n				<text class=\'label\'>$v$</text>\n		</foreignObject>\n		<line class=\'zero-line\' d3-der=\'{x1: 0, x2: vm.width, y1: vm.Ver(0), y2: vm.Ver(0)}\' />\n		<line class=\'zero-line\' d3-der="{x1: vm.Hor(0), x2: vm.Hor(0), y1: vm.height, y2: 0}" />\n		<path ng-attr-d=\'{{vm.lineFun(vm.trueCart.trajectory)}}\' class=\'fun target\' />\n		<g ng-class=\'{hide: !vm.Data.show}\' >\n			<line class=\'tri v\' d3-der=\'{x1: vm.Hor(0), x2: vm.Hor(vm.selected.v), y1: vm.Ver(vm.selected.dv), y2: vm.Ver(vm.selected.dv)}\'/>\n			<line class=\'tri dv\' d3-der=\'{x1: vm.Hor(vm.selected.v), x2: vm.Hor(vm.selected.v), y1: vm.Ver(0), y2: vm.Ver(vm.selected.dv)}\'/>\n			<path d3-der=\'{d:vm.lineFun(vm.trueCart.trajectory)}\' class=\'fun correct\' ng-class=\'{hide: !vm.Data.correct}\' />\n		</g>\n		<g ng-repeat=\'dot in vm.dots track by dot.id\' shifter=\'[vm.Hor(dot.v),vm.Ver(dot.dv)]\' dot-b-der=dot></g>\n		<foreignObject width=\'70\' height=\'30\' y=\'0\' shifter=\'[vm.Hor(1.7), vm.Ver(-1.2)]\'>\n				<text class=\'tri-label\' >$v\'=-.8v$</text>\n		</foreignObject>\n	</g>\n</svg>';

Ctrl = (function(superClass) {
  extend(Ctrl, superClass);

  function Ctrl(scope, el, window, fakeCart, trueCart, Data) {
    this.scope = scope;
    this.el = el;
    this.window = window;
    this.fakeCart = fakeCart;
    this.trueCart = trueCart;
    this.Data = Data;
    Ctrl.__super__.constructor.call(this, this.scope, this.el, this.window);
    this.Ver.domain([-1.9, .1]);
    this.Hor.domain([-.1, 2.15]);
    this.lineFun.y((function(_this) {
      return function(d) {
        return _this.Ver(d.dv);
      };
    })(this)).x((function(_this) {
      return function(d) {
        return _this.Hor(d.v);
      };
    })(this));
  }

  Ctrl.property('dots', {
    get: function() {
      return this.fakeCart.dots.filter(function(d) {
        return (d.id !== 'first') && (d.id !== 'last');
      });
    }
  });

  Ctrl.property('selected', {
    get: function() {
      return this.fakeCart.selected;
    }
  });

  return Ctrl;

})(PlotCtrl);

der = function() {
  var directive;
  return directive = {
    controllerAs: 'vm',
    scope: {},
    template: template,
    templateNamespace: 'svg',
    controller: ['$scope', '$element', '$window', 'fakeCart', 'trueCart', 'designData', Ctrl]
  };
};

module.exports = der;



},{"../../directives/plotCtrl":24,"../../helpers":29}],12:[function(require,module,exports){
var Ctrl, _, der, template;

_ = require('lodash');

require('../../helpers');

template = '<div cart-der data="vm.fakeCart" max="vm.max" sample=\'vm.sample\'></div>';

Ctrl = (function() {
  function Ctrl(scope, fakeCart) {
    this.scope = scope;
    this.fakeCart = fakeCart;
    this.max = 4;
    this.sample = _.range(0, 5, .5);
  }

  Ctrl.property('max', {
    get: function() {
      return this.fakeCart.loc(4.5);
    }
  });

  return Ctrl;

})();

der = function() {
  var directive;
  return directive = {
    scope: {},
    restrict: 'A',
    bindToController: true,
    template: template,
    controller: ['$scope', 'fakeCart', Ctrl],
    controllerAs: 'vm'
  };
};

module.exports = der;



},{"../../helpers":29,"lodash":undefined}],13:[function(require,module,exports){
var Ctrl, _, der, template;

_ = require('lodash');

require('../../helpers');

template = '<div cart-der data="vm.trueCart" max="vm.max" sample=\'vm.sample\'></div>';

Ctrl = (function() {
  function Ctrl(scope, trueCart) {
    this.scope = scope;
    this.trueCart = trueCart;
    this.max = 4;
    this.sample = _.range(0, 5, .5);
  }

  Ctrl.property('max', {
    get: function() {
      return this.trueCart.loc(4.5);
    }
  });

  return Ctrl;

})();

der = function() {
  var directive;
  return directive = {
    scope: {},
    restrict: 'A',
    bindToController: true,
    template: template,
    controller: ['$scope', 'trueCart', Ctrl],
    controllerAs: 'vm'
  };
};

module.exports = der;



},{"../../helpers":29,"lodash":undefined}],14:[function(require,module,exports){
var Service, angular, d3;

angular = require('angular');

d3 = require('d3');

require('../../helpers');

Service = (function() {
  function Service(rootScope) {
    this.rootScope = rootScope;
    this.t = 0;
    this.show = this.paused = false;
  }

  Service.prototype.click = function() {
    if (this.paused) {
      return this.play();
    } else {
      return this.pause();
    }
  };

  Service.prototype.increment = function(dt) {
    return this.t += dt;
  };

  Service.prototype.setT = function(t) {
    return this.t = t;
  };

  Service.prototype.set_show = function(v) {
    return this.show = v;
  };

  Service.prototype.play = function() {
    var last;
    this.paused = true;
    d3.timer.flush();
    this.paused = false;
    last = 0;
    console.log('asdf');
    return d3.timer((function(_this) {
      return function(elapsed) {
        var dt;
        dt = elapsed - last;
        _this.increment(dt / 1000);
        last = elapsed;
        if (_this.t > 4.5) {
          _this.setT(0);
        }
        _this.rootScope.$evalAsync();
        return _this.paused;
      };
    })(this), 1);
  };

  Service.prototype.pause = function() {
    return this.paused = true;
  };

  return Service;

})();

module.exports = ['$rootScope', Service];



},{"../../helpers":29,"angular":undefined,"d3":undefined}],15:[function(require,module,exports){
var Ctrl, der, template,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

template = '<circle class=\'dot large\'></circle>\n<circle class=\'dot small\' r=\'4\'></circle>';

Ctrl = (function() {
  function Ctrl(scope, el, fakeCart, Data) {
    var big, circ, rad, sel;
    this.scope = scope;
    this.el = el;
    this.fakeCart = fakeCart;
    this.Data = Data;
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
        return (_this.fakeCart.selected === _this.dot) && _this.Data.show;
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
    this.Data.set_show(false);
    return this.scope.$evalAsync();
  };

  Ctrl.prototype.mouseover = function() {
    this.fakeCart.select_dot(this.dot);
    this.Data.set_show(true);
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
    controller: ['$scope', '$element', 'fakeCart', 'designData', Ctrl],
    restrict: 'A'
  };
};

module.exports = der;



},{}],16:[function(require,module,exports){
var Ctrl, Data, der, template,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

Data = require('./designData');

template = '<circle class=\'dot small\' r=\'4\'></circle>';

Ctrl = (function() {
  function Ctrl(scope, el, fakeCart, Data1) {
    var circ;
    this.scope = scope;
    this.el = el;
    this.fakeCart = fakeCart;
    this.Data = Data1;
    this.mouseover = bind(this.mouseover, this);
    this.mouseout = bind(this.mouseout, this);
    circ = d3.select(this.el[0]);
    circ.on('mouseover', this.mouseover).on('mouseout', this.mouseout);
    this.scope.$watch((function(_this) {
      return function() {
        return (Data.selected === _this.dot) && Data.show;
      };
    })(this), function(v, old) {
      if (v === old) {
        return;
      }
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
    this.Data.set_show(false);
    return this.scope.$evalAsync();
  };

  Ctrl.prototype.mouseover = function() {
    this.fakeCart.select_dot(this.dot);
    this.Data.set_show(true);
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
    controller: ['$scope', '$element', 'fakeCart', 'designData', Ctrl],
    restrict: 'A'
  };
};

module.exports = der;



},{"./designData":14}],17:[function(require,module,exports){
var Dot, Service, _, delT;

require('../../helpers');

_ = require('lodash');

delT = .025;

Dot = (function() {
  function Dot(t1, v1) {
    this.t = t1;
    this.v = v1;
    this.id = _.uniqueId('dot');
    this.dv = 0;
  }

  Dot.prototype.update = function(t, v) {
    this.t = t;
    return this.v = v;
  };

  return Dot;

})();

Service = (function() {
  function Service(Data) {
    var firstDot, lastDot;
    this.Data = Data;
    this.correct = false;
    firstDot = new Dot(0, 2);
    firstDot.id = 'first';
    this.dots = [firstDot];
    this.trajectory = _.range(0, 5, delT).map(function(t) {
      var res;
      return res = {
        t: t,
        v: 0,
        x: 0
      };
    });
    _.range(.5, 2.5, .5).forEach((function(_this) {
      return function(t) {
        return _this.dots.push(new Dot(t, 2 * Math.exp(-.8 * t)));
      };
    })(this));
    lastDot = new Dot(6, this.dots[this.dots.length - 1].v);
    lastDot.id = 'last';
    this.dots.push(lastDot);
    this.select_dot(this.dots[1]);
    this.update();
  }

  Service.prototype.select_dot = function(dot) {
    return this.selected = dot;
  };

  Service.prototype.add_dot = function(t, v) {
    var newDot;
    newDot = new Dot(t, v);
    this.dots.push(newDot);
    return this.update_dot(newDot, t, v);
  };

  Service.prototype.remove_dot = function(dot) {
    this.dots.splice(this.dots.indexOf(dot), 1);
    return this.update();
  };

  Service.prototype.loc = function(t) {
    return this.trajectory[Math.floor(t / delT)].x;
  };

  Service.property('x', {
    get: function() {
      return this.loc(this.Data.t);
    }
  });

  Service.property('v', {
    get: function() {
      return this.trajectory[Math.floor(this.Data.t / delT)].v;
    }
  });

  Service.property('dv', {
    get: function() {
      return this.trajectory[Math.floor(this.Data.t / delT)].dv;
    }
  });

  Service.prototype.update = function() {
    this.dots.sort(function(a, b) {
      return a.t - b.t;
    });
    this.dots.forEach(function(dot, i, k) {
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
    return this.dots.forEach((function(_this) {
      return function(dot, i, k) {
        var a, dv;
        a = _this.dots[i - 1];
        if (!a) {
          return;
        }
        dv = dot.dv;
        return _this.trajectory.slice(Math.floor(a.t / delT), Math.floor(dot.t / delT)).forEach(function(d) {
          var dt;
          dt = d.t - a.t;
          d.x = a.x + a.v * dt + 0.5 * dv * Math.pow(dt, 2);
          return d.v = a.v + dv * dt;
        });
      };
    })(this));
  };

  Service.prototype.update_dot = function(dot, t, v) {
    if (dot.id === 'first') {
      return;
    }
    this.select_dot(dot);
    dot.update(t, v);
    this.update();
    return this.correct = Math.abs(-.8 * dot.v + dot.dv) < 0.05;
  };

  return Service;

})();

module.exports = ['designData', Service];



},{"../../helpers":29,"lodash":undefined}],18:[function(require,module,exports){
var Data, Service, _, delT;

Data = require('./designData');

_ = require('lodash');

require('../../helpers');

delT = .025;

Service = (function() {
  function Service(Data1) {
    this.Data = Data1;
    this.trajectory = _.range(0, 4.5, delT).map(function(t) {
      return {
        t: t,
        x: 2 / .8 * (1 - Math.exp(-.8 * t)),
        v: 2 * Math.exp(-.8 * t),
        dv: -.8 * 2 * Math.exp(-.8 * t)
      };
    });
  }

  Service.prototype.loc = function(t) {
    return 2 / .8 * (1 - Math.exp(-.8 * t));
  };

  Service.property('x', {
    get: function() {
      return this.loc(this.Data.t);
    }
  });

  Service.property('v', {
    get: function() {
      return 2 * Math.exp(-.8 * this.Data.t);
    }
  });

  Service.property('dv', {
    get: function() {
      return -.8 * 2 * Math.exp(-.8 * this.Data.t);
    }
  });

  return Service;

})();

module.exports = ['designData', Service];



},{"../../helpers":29,"./designData":14,"lodash":undefined}],19:[function(require,module,exports){
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



},{}],20:[function(require,module,exports){
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



},{}],21:[function(require,module,exports){
var Ctrl, PlotCtrl, _, d3, der, template,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

_ = require('lodash');

d3 = require('d3');

require('../helpers');

PlotCtrl = require('./plotCtrl');

template = '<svg ng-init=\'vm.resize()\' ng-attr-height="{{vm.svgHeight}}">\n	<defs>\n		<clippath id=\'cartSim\'>\n			<rect d3-der=\'{width: vm.width, height: vm.height}\' />\n		</clippath>\n	</defs>\n	<g class=\'boilerplate\' shifter=\'{{::[vm.mar.left, vm.mar.top]}}\' >\n		<rect d3-der=\'{width: vm.width, height: vm.height}\' class=\'background\'/>\n		<g hor-axis-der height=\'vm.height\' fun=\'vm.horAxFun\' shifter=\'[0,vm.height]\'></g>\n		<foreignObject width=\'30\' height=\'30\' y=\'20\' shifter=\'[vm.width/2, vm.height]\'>\n				<text class=\'label\' >$x$</text>\n		</foreignObject>\n	</g>\n	<g shifter=\'{{::[vm.mar.left, vm.mar.top]}}\' clip-path="url(#cartSim)" >\n		<foreignObject width=\'30\' height=\'30\' y=\'20\' shifter=\'[vm.width/2, vm.height]\'>\n				<text class=\'label\' >$t$</text>\n		</foreignObject>\n		<g ng-repeat=\'t in vm.sample\' d3-der=\'{transform: "translate(" + vm.Hor(vm.data.loc(t)) + ",0)"}\'>\n			<line class=\'time-line\' d3-der=\'{x1: 0, x2: 0, y1: 0, y2: 60}\' />\n		</g>\n		<g class=\'g-cart\' cart-object-der left=\'vm.Hor(vm.data.x)\' top=\'vm.height\' size=\'vm.size\'></g>\n	</g>\n</svg>';

Ctrl = (function(superClass) {
  extend(Ctrl, superClass);

  function Ctrl(scope, el, window) {
    this.scope = scope;
    this.el = el;
    this.window = window;
    Ctrl.__super__.constructor.call(this, this.scope, this.el, this.window);
    this.Hor.domain([-.1, 3]);
    this.scope.$watch('vm.max', (function(_this) {
      return function() {
        return _this.Hor.domain([-.1, _this.max]);
      };
    })(this));
  }

  Ctrl.prototype.tran = function(tran) {
    return tran.ease('linear').duration(60);
  };

  Ctrl.property('size', {
    get: function() {
      return (this.Hor(0.4) - this.Hor(0)) / 80;
    }
  });

  return Ctrl;

})(PlotCtrl);

der = function() {
  var directive;
  return directive = {
    template: template,
    scope: {
      data: '=',
      max: '=',
      sample: '='
    },
    restrict: 'A',
    bindToController: true,
    transclude: true,
    templateNamespace: 'svg',
    controller: ['$scope', '$element', '$window', Ctrl],
    controllerAs: 'vm'
  };
};

module.exports = der;



},{"../helpers":29,"./plotCtrl":24,"d3":undefined,"lodash":undefined}],22:[function(require,module,exports){
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
var Ctrl, d3,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

d3 = require('d3');

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
    this.horAxFun = d3.svg.axis().scale(this.Hor).ticks(5).orient('bottom');
    this.verAxFun = d3.svg.axis().scale(this.Ver).ticks(5).orient('left');
    this.lineFun = d3.svg.line();
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



},{"d3":undefined}],25:[function(require,module,exports){
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



},{"d3":undefined}],26:[function(require,module,exports){
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



},{"angular":undefined,"d3":undefined,"textures":undefined}],27:[function(require,module,exports){
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
      height: '=',
      fun: '='
    },
    link: function(scope, el, attr, vm) {
      var scale, sel, update;
      scale = vm.fun.scale();
      sel = d3.select(el[0]).classed('x axis', true);
      update = (function(_this) {
        return function() {
          vm.fun.tickSize(-vm.height);
          return sel.call(vm.fun);
        };
      })(this);
      return scope.$watch(function() {
        return [scale.domain(), scale.range(), vm.height];
      }, update, true);
    }
  };
};

module.exports = der;



},{"angular":undefined,"d3":undefined}],28:[function(require,module,exports){
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
      width: '=',
      fun: '='
    },
    link: function(scope, el, attr, vm) {
      var scale, sel, update;
      scale = vm.fun.scale();
      sel = d3.select(el[0]).classed('y axis', true);
      update = (function(_this) {
        return function() {
          vm.fun.tickSize(-vm.width);
          return sel.call(vm.fun);
        };
      })(this);
      return scope.$watch(function() {
        return [scale.domain(), scale.range(), vm.width];
      }, update, true);
    }
  };
};

module.exports = der;



},{"angular":undefined,"d3":undefined}],29:[function(require,module,exports){
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvbGV3aXMvUmVzZWFyY2gvZGlmZkVRX25ldy9hcHAvYXBwLmNvZmZlZSIsIi9Vc2Vycy9sZXdpcy9SZXNlYXJjaC9kaWZmRVFfbmV3L2FwcC9jb21wb25lbnRzL2NhcnQvY2FydEJ1dHRvbnMuY29mZmVlIiwiL1VzZXJzL2xld2lzL1Jlc2VhcmNoL2RpZmZFUV9uZXcvYXBwL2NvbXBvbmVudHMvY2FydC9jYXJ0RGF0YS5jb2ZmZWUiLCIvVXNlcnMvbGV3aXMvUmVzZWFyY2gvZGlmZkVRX25ldy9hcHAvY29tcG9uZW50cy9jYXJ0L2NhcnRPYmplY3QuY29mZmVlIiwiL1VzZXJzL2xld2lzL1Jlc2VhcmNoL2RpZmZFUV9uZXcvYXBwL2NvbXBvbmVudHMvY2FydC9jYXJ0UGxvdC5jb2ZmZWUiLCIvVXNlcnMvbGV3aXMvUmVzZWFyY2gvZGlmZkVRX25ldy9hcHAvY29tcG9uZW50cy9jYXJ0L2NhcnRTaW0uY29mZmVlIiwiL1VzZXJzL2xld2lzL1Jlc2VhcmNoL2RpZmZFUV9uZXcvYXBwL2NvbXBvbmVudHMvZGVyaXZhdGl2ZS9kZXJpdmF0aXZlQS5jb2ZmZWUiLCIvVXNlcnMvbGV3aXMvUmVzZWFyY2gvZGlmZkVRX25ldy9hcHAvY29tcG9uZW50cy9kZXJpdmF0aXZlL2Rlcml2YXRpdmVCLmNvZmZlZSIsIi9Vc2Vycy9sZXdpcy9SZXNlYXJjaC9kaWZmRVFfbmV3L2FwcC9jb21wb25lbnRzL2Rlcml2YXRpdmUvZGVyaXZhdGl2ZURhdGEuY29mZmVlIiwiL1VzZXJzL2xld2lzL1Jlc2VhcmNoL2RpZmZFUV9uZXcvYXBwL2NvbXBvbmVudHMvZGVzaWduL2Rlc2lnbkEuY29mZmVlIiwiL1VzZXJzL2xld2lzL1Jlc2VhcmNoL2RpZmZFUV9uZXcvYXBwL2NvbXBvbmVudHMvZGVzaWduL2Rlc2lnbkIuY29mZmVlIiwiL1VzZXJzL2xld2lzL1Jlc2VhcmNoL2RpZmZFUV9uZXcvYXBwL2NvbXBvbmVudHMvZGVzaWduL2Rlc2lnbkNhcnRBLmNvZmZlZSIsIi9Vc2Vycy9sZXdpcy9SZXNlYXJjaC9kaWZmRVFfbmV3L2FwcC9jb21wb25lbnRzL2Rlc2lnbi9kZXNpZ25DYXJ0Qi5jb2ZmZWUiLCIvVXNlcnMvbGV3aXMvUmVzZWFyY2gvZGlmZkVRX25ldy9hcHAvY29tcG9uZW50cy9kZXNpZ24vZGVzaWduRGF0YS5jb2ZmZWUiLCIvVXNlcnMvbGV3aXMvUmVzZWFyY2gvZGlmZkVRX25ldy9hcHAvY29tcG9uZW50cy9kZXNpZ24vZG90QS5jb2ZmZWUiLCIvVXNlcnMvbGV3aXMvUmVzZWFyY2gvZGlmZkVRX25ldy9hcHAvY29tcG9uZW50cy9kZXNpZ24vZG90Qi5jb2ZmZWUiLCIvVXNlcnMvbGV3aXMvUmVzZWFyY2gvZGlmZkVRX25ldy9hcHAvY29tcG9uZW50cy9kZXNpZ24vZmFrZUNhcnQuY29mZmVlIiwiL1VzZXJzL2xld2lzL1Jlc2VhcmNoL2RpZmZFUV9uZXcvYXBwL2NvbXBvbmVudHMvZGVzaWduL3RydWVDYXJ0LmNvZmZlZSIsIi9Vc2Vycy9sZXdpcy9SZXNlYXJjaC9kaWZmRVFfbmV3L2FwcC9kaXJlY3RpdmVzL2JlaGF2aW9yLmNvZmZlZSIsIi9Vc2Vycy9sZXdpcy9SZXNlYXJjaC9kaWZmRVFfbmV3L2FwcC9kaXJlY3RpdmVzL2JvaWxlcnBsYXRlLmNvZmZlZSIsIi9Vc2Vycy9sZXdpcy9SZXNlYXJjaC9kaWZmRVFfbmV3L2FwcC9kaXJlY3RpdmVzL2NhcnREZXIuY29mZmVlIiwiL1VzZXJzL2xld2lzL1Jlc2VhcmNoL2RpZmZFUV9uZXcvYXBwL2RpcmVjdGl2ZXMvZDNEZXIuY29mZmVlIiwiL1VzZXJzL2xld2lzL1Jlc2VhcmNoL2RpZmZFUV9uZXcvYXBwL2RpcmVjdGl2ZXMvZGF0dW0uY29mZmVlIiwiL1VzZXJzL2xld2lzL1Jlc2VhcmNoL2RpZmZFUV9uZXcvYXBwL2RpcmVjdGl2ZXMvcGxvdEN0cmwuY29mZmVlIiwiL1VzZXJzL2xld2lzL1Jlc2VhcmNoL2RpZmZFUV9uZXcvYXBwL2RpcmVjdGl2ZXMvc2hpZnRlci5jb2ZmZWUiLCIvVXNlcnMvbGV3aXMvUmVzZWFyY2gvZGlmZkVRX25ldy9hcHAvZGlyZWN0aXZlcy90ZXh0dXJlLmNvZmZlZSIsIi9Vc2Vycy9sZXdpcy9SZXNlYXJjaC9kaWZmRVFfbmV3L2FwcC9kaXJlY3RpdmVzL3hBeGlzLmNvZmZlZSIsIi9Vc2Vycy9sZXdpcy9SZXNlYXJjaC9kaWZmRVFfbmV3L2FwcC9kaXJlY3RpdmVzL3lBeGlzLmNvZmZlZSIsIi9Vc2Vycy9sZXdpcy9SZXNlYXJjaC9kaWZmRVFfbmV3L2FwcC9oZWxwZXJzLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBLFlBQUEsQ0FBQTtBQUFBLElBQUEsd0JBQUE7O0FBQUEsT0FDQSxHQUFVLE9BQUEsQ0FBUSxTQUFSLENBRFYsQ0FBQTs7QUFBQSxFQUVBLEdBQUssT0FBQSxDQUFRLElBQVIsQ0FGTCxDQUFBOztBQUFBLEdBR0EsR0FBTSxPQUFPLENBQUMsTUFBUixDQUFlLFNBQWYsRUFBMEIsQ0FBQyxPQUFBLENBQVEsa0JBQVIsQ0FBRCxDQUExQixDQUNMLENBQUMsU0FESSxDQUNNLFlBRE4sRUFDb0IsT0FBQSxDQUFRLG9CQUFSLENBRHBCLENBRUwsQ0FBQyxTQUZJLENBRU0sWUFGTixFQUVvQixPQUFBLENBQVEsb0JBQVIsQ0FGcEIsQ0FHTCxDQUFDLFNBSEksQ0FHTSxZQUhOLEVBR29CLE9BQUEsQ0FBUSwyQkFBUixDQUhwQixDQUlMLENBQUMsU0FKSSxDQUlNLGVBSk4sRUFJdUIsT0FBQSxDQUFRLDhCQUFSLENBSnZCLENBS0wsQ0FBQyxTQUxJLENBS00sZ0JBTE4sRUFLd0IsT0FBQSxDQUFRLCtCQUFSLENBTHhCLENBTUwsQ0FBQyxTQU5JLENBTU0sU0FOTixFQU1rQixPQUFBLENBQVEsc0JBQVIsQ0FObEIsQ0FPTCxDQUFDLFNBUEksQ0FPTSxVQVBOLEVBT2tCLE9BQUEsQ0FBUSx1QkFBUixDQVBsQixDQVFMLENBQUMs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QUFBO2VBQUEsU0FBQSxHQUFBO0FBQ1IsVUFBQSxFQUFFLENBQUMsR0FBRyxDQUFDLFFBQVAsQ0FBaUIsQ0FBQSxFQUFHLENBQUMsS0FBckIsQ0FBQSxDQUFBO2lCQUNBLEdBQUcsQ0FBQyxJQUFKLENBQVMsRUFBRSxDQUFDLEdBQVosRUFGUTtRQUFBLEVBQUE7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBSlQsQ0FBQTthQVFBLEtBQUssQ0FBQyxNQUFOLENBQWEsU0FBQSxHQUFBO2VBRVosQ0FBQyxLQUFLLENBQUMsTUFBTixDQUFBLENBQUQsRUFBaUIsS0FBSyxDQUFDLEtBQU4sQ0FBQSxDQUFqQixFQUFnQyxFQUFFLENBQUMsS0FBbkMsRUFGWTtNQUFBLENBQWIsRUFHRSxNQUhGLEVBSUUsSUFKRixFQVRLO0lBQUEsQ0FSTjtJQUZJO0FBQUEsQ0FITixDQUFBOztBQUFBLE1BNEJNLENBQUMsT0FBUCxHQUFpQixHQTVCakIsQ0FBQTs7Ozs7QUNBQSxZQUFBLENBQUE7QUFBQSxNQUVNLENBQUMsT0FBTyxDQUFDLE9BQWYsR0FBeUIsU0FBQyxHQUFELEVBQU0sSUFBTixHQUFBO1NBQ3ZCLEVBQUUsQ0FBQyxLQUFILENBQVMsQ0FBQSxTQUFBLEtBQUEsR0FBQTtXQUFBLFNBQUEsR0FBQTtBQUNSLE1BQUEsR0FBQSxDQUFBLENBQUEsQ0FBQTthQUNBLEtBRlE7SUFBQSxFQUFBO0VBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFULEVBR0MsSUFIRCxFQUR1QjtBQUFBLENBRnpCLENBQUE7O0FBQUEsUUFTUSxDQUFBLFNBQUUsQ0FBQSxRQUFWLEdBQXFCLFNBQUMsSUFBRCxFQUFPLElBQVAsR0FBQTtTQUNuQixNQUFNLENBQUMsY0FBUCxDQUFzQixJQUFDLENBQUEsU0FBdkIsRUFBa0MsSUFBbEMsRUFBd0MsSUFBeEMsRUFEbUI7QUFBQSxDQVRyQixDQUFBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIid1c2Ugc3RyaWN0J1xuYW5ndWxhciA9IHJlcXVpcmUgJ2FuZ3VsYXInXG5kMyA9IHJlcXVpcmUgJ2QzJ1xuYXBwID0gYW5ndWxhci5tb2R1bGUgJ21haW5BcHAnLCBbcmVxdWlyZSAnYW5ndWxhci1tYXRlcmlhbCddXG5cdC5kaXJlY3RpdmUgJ2hvckF4aXNEZXInLCByZXF1aXJlICcuL2RpcmVjdGl2ZXMveEF4aXMnXG5cdC5kaXJlY3RpdmUgJ3ZlckF4aXNEZXInLCByZXF1aXJlICcuL2RpcmVjdGl2ZXMveUF4aXMnXG5cdC5kaXJlY3RpdmUgJ2NhcnRTaW1EZXInLCByZXF1aXJlICcuL2NvbXBvbmVudHMvY2FydC9jYXJ0U2ltJ1xuXHQuZGlyZWN0aXZlICdjYXJ0T2JqZWN0RGVyJywgcmVxdWlyZSAnLi9jb21wb25lbnRzL2NhcnQvY2FydE9iamVjdCdcblx0LmRpcmVjdGl2ZSAnY2FydEJ1dHRvbnNEZXInLCByZXF1aXJlICcuL2NvbXBvbmVudHMvY2FydC9jYXJ0QnV0dG9ucydcblx0LmRpcmVjdGl2ZSAnc2hpZnRlcicgLCByZXF1aXJlICcuL2RpcmVjdGl2ZXMvc2hpZnRlcidcblx0LmRpcmVjdGl2ZSAnYmVoYXZpb3InLCByZXF1aXJlICcuL2RpcmVjdGl2ZXMvYmVoYXZpb3InXG5cdC5kaXJlY3RpdmUgJ2RvdEFEZXInLCByZXF1aXJlICcuL2NvbXBvbmVudHMvZGVzaWduL2RvdEEnXG5cdC5kaXJlY3RpdmUgJ2RvdEJEZXInLCByZXF1aXJlICcuL2NvbXBvbmVudHMvZGVzaWduL2RvdEInXG5cdC5kaXJlY3RpdmUgJ2RhdHVtJywgcmVxdWlyZSAnLi9kaXJlY3RpdmVzL2RhdHVtJ1xuXHQuZGlyZWN0aXZlICdkM0RlcicsIHJlcXVpcmUgJy4vZGlyZWN0aXZlcy9kM0Rlcidcblx0LmRpcmVjdGl2ZSAnZGVzaWduQURlcicsIHJlcXVpcmUgJy4vY29tcG9uZW50cy9kZXNpZ24vZGVzaWduQSdcblx0LmRpcmVjdGl2ZSAnZGVzaWduQkRlcicgLCByZXF1aXJlICcuL2NvbXBvbmVudHMvZGVzaWduL2Rlc2lnbkInXG5cdC5kaXJlY3RpdmUgJ2Rlcml2YXRpdmVBRGVyJywgcmVxdWlyZSAnLi9jb21wb25lbnRzL2Rlcml2YXRpdmUvZGVyaXZhdGl2ZUEnXG5cdC5kaXJlY3RpdmUgJ2Rlcml2YXRpdmVCRGVyJywgcmVxdWlyZSAnLi9jb21wb25lbnRzL2Rlcml2YXRpdmUvZGVyaXZhdGl2ZUInXG5cdC5kaXJlY3RpdmUgJ2NhcnRQbG90RGVyJywgcmVxdWlyZSAnLi9jb21wb25lbnRzL2NhcnQvY2FydFBsb3QnXG5cdC5kaXJlY3RpdmUgJ2Rlc2lnbkNhcnRBRGVyJywgcmVxdWlyZSAnLi9jb21wb25lbnRzL2Rlc2lnbi9kZXNpZ25DYXJ0QSdcblx0LmRpcmVjdGl2ZSAnZGVzaWduQ2FydEJEZXInLCByZXF1aXJlICcuL2NvbXBvbmVudHMvZGVzaWduL2Rlc2lnbkNhcnRCJ1xuXHQuZGlyZWN0aXZlICd0ZXh0dXJlRGVyJywgcmVxdWlyZSAnLi9kaXJlY3RpdmVzL3RleHR1cmUnXG5cdCMgLmRpcmVjdGl2ZSAnZGVzaWduQnV0dG9uc0RlcicsIHJlcXVpcmUgJy4vY29tcG9uZW50cy9kZXNpZ24vZGVzaWduQnV0dG9ucydcblx0LmRpcmVjdGl2ZSAnYm9pbGVycGxhdGVEZXInLCByZXF1aXJlICcuL2RpcmVjdGl2ZXMvYm9pbGVycGxhdGUnXG5cdC5kaXJlY3RpdmUgJ2NhcnREZXInICwgcmVxdWlyZSAnLi9kaXJlY3RpdmVzL2NhcnREZXInXG5cdC5zZXJ2aWNlICdkZXJpdmF0aXZlRGF0YScsIHJlcXVpcmUgJy4vY29tcG9uZW50cy9kZXJpdmF0aXZlL2Rlcml2YXRpdmVEYXRhJ1xuXHQuc2VydmljZSAnZmFrZUNhcnQnLCByZXF1aXJlICcuL2NvbXBvbmVudHMvZGVzaWduL2Zha2VDYXJ0J1xuXHQuc2VydmljZSAndHJ1ZUNhcnQnLCByZXF1aXJlICcuL2NvbXBvbmVudHMvZGVzaWduL3RydWVDYXJ0J1xuXHQuc2VydmljZSAnZGVzaWduRGF0YScsIHJlcXVpcmUgJy4vY29tcG9uZW50cy9kZXNpZ24vZGVzaWduRGF0YSdcbmxvb3BlciA9IC0+XG4gICAgc2V0VGltZW91dCggKCktPlxuICAgIFx0XHRcdGQzLnNlbGVjdEFsbCAnY2lyY2xlLmRvdC5sYXJnZSdcbiAgICBcdFx0XHRcdC50cmFuc2l0aW9uICdncm93J1xuICAgIFx0XHRcdFx0LmR1cmF0aW9uIDUwMFxuICAgIFx0XHRcdFx0LmVhc2UgJ2N1YmljLW91dCdcbiAgICBcdFx0XHRcdC5hdHRyICd0cmFuc2Zvcm0nLCAnc2NhbGUoIDEuMzQpJ1xuICAgIFx0XHRcdFx0LnRyYW5zaXRpb24gJ3NocmluaydcbiAgICBcdFx0XHRcdC5kdXJhdGlvbiA1MDBcbiAgICBcdFx0XHRcdC5lYXNlICdjdWJpYy1vdXQnXG4gICAgXHRcdFx0XHQuYXR0ciAndHJhbnNmb3JtJywgJ3NjYWxlKCAxLjApJ1xuICAgIFx0XHRcdGxvb3BlcigpXG4gICAgXHRcdCwgMTAwMClcblxubG9vcGVyKClcbiIsIl8gPSByZXF1aXJlICdsb2Rhc2gnXG57ZXhwLCBzcXJ0LCBhdGFufSA9IE1hdGhcbkNhcnQgPSByZXF1aXJlICcuL2NhcnREYXRhJ1xuXG50ZW1wbGF0ZSA9ICcnJ1xuXHQ8bWQtYnV0dG9uIGNsYXNzPSdteUJ1dHRvbicgbmctY2xpY2s9J3ZtLmNsaWNrKCknIG5nLWluaXQ9J3ZtLnBsYXkoKSc+e3t2bS5wYXVzZWQgPyAnUExBWScgOiAnUEFVU0UnfX0gPC9tZC1idXR0b24+XG4nJydcblxuY2xhc3MgQ3RybFxuXHRjb25zdHJ1Y3RvcjogKEBzY29wZSktPlxuXG5cdGNsaWNrOiAtPlxuXHRcdGlmIEBwYXVzZWQgdGhlbiBAcGxheSgpIGVsc2UgQHBhdXNlKClcblxuXHRwbGF5OiAtPlxuXHRcdEBwYXVzZWQgPSB0cnVlXG5cdFx0ZDMudGltZXIuZmx1c2goKVxuXHRcdEBwYXVzZWQgPSBmYWxzZVxuXHRcdGxhc3QgPSAwXG5cdFx0ZDMudGltZXIgKGVsYXBzZWQpPT5cblx0XHRcdFx0ZHQgPSBlbGFwc2VkIC0gbGFzdFxuXHRcdFx0XHRDYXJ0LmluY3JlbWVudCBkdC8xMDAwXG5cdFx0XHRcdGxhc3QgPSBlbGFwc2VkXG5cdFx0XHRcdGlmIENhcnQudCA+IDRcblx0XHRcdFx0XHRDYXJ0LnNldF90IDBcblx0XHRcdFx0QHNjb3BlLiRldmFsQXN5bmMoKVxuXHRcdFx0XHRAcGF1c2VkXG5cdFx0XHQsIDFcblxuXHRwYXVzZTogLT5cblx0XHRAcGF1c2VkID0gdHJ1ZVxuXG5kZXIgPSAoKS0+XG5cdGRpcmVjdGl2ZSA9IFxuXHRcdGNvbnRyb2xsZXJBczogJ3ZtJ1xuXHRcdHNjb3BlOiB7fVxuXHRcdGNvbnRyb2xsZXI6IFsnJHNjb3BlJywgQ3RybF1cblx0XHR0ZW1wbGF0ZTogdGVtcGxhdGVcblxubW9kdWxlLmV4cG9ydHMgPSBkZXIiLCJfID0gcmVxdWlyZSAnbG9kYXNoJ1xue2V4cH0gPSBNYXRoXG5cbmNsYXNzIENhcnRcblx0Y29uc3RydWN0b3I6IChAb3B0aW9ucyktPlxuXHRcdHtAdjAsIEBrfSA9IEBvcHRpb25zXG5cdFx0QHJlc3RhcnQoKVxuXHRyZXN0YXJ0OiAtPlxuXHRcdEB0ID0gQHggPSAwXG5cdFx0QHRyYWplY3RvcnkgPSBfLnJhbmdlIDAgLCA2ICwgMS81MFxuXHRcdFx0Lm1hcCAodCk9PlxuXHRcdFx0XHR2ID0gQHYwICogZXhwKC1AayAqIHQpXG5cdFx0XHRcdHJlcyA9IFxuXHRcdFx0XHRcdHY6IHZcblx0XHRcdFx0XHR4OiBAdjAvQGsgKiAoMS1leHAoLUBrKnQpKVxuXHRcdFx0XHRcdGR2OiAtQGsqdlxuXHRcdFx0XHRcdHQ6IHRcblx0XHRAbW92ZSAwXG5cdFx0QHBhdXNlZCA9IHRydWVcblx0c2V0X3Q6ICh0KS0+XG5cdFx0QHQgPSB0XG5cdFx0QG1vdmUgdFxuXHRpbmNyZW1lbnQ6IChkdCktPlxuXHRcdEB0Kz1kdFxuXHRcdEBtb3ZlIEB0XG5cdG1vdmU6ICh0KS0+XG5cdFx0QHYgPSBAdjAgKiBleHAoIC1AayAqIHQpXG5cdFx0QHggPSBAdjAvQGsgKiAoMS1leHAoLUBrKnQpKVxuXHRcdEBkdiA9IC1AaypAdlxuXG5tb2R1bGUuZXhwb3J0cyA9IG5ldyBDYXJ0IHt2MDogMiwgazogLjh9IiwiXG5jbGFzcyBDdHJsXG5cdGNvbnN0cnVjdG9yOihAc2NvcGUpLT5cblxuXHR0cmFuczogKHRyYW4pLT5cblx0XHR0cmFuXG5cdFx0XHQuZHVyYXRpb24gMzBcblx0XHRcdC5lYXNlICdsaW5lYXInXG5cbmRlciA9ICgpLT5cblx0ZGlyZWN0aXZlID0gXG5cdFx0c2NvcGU6IFxuXHRcdFx0c2l6ZTogJz0nXG5cdFx0XHRsZWZ0OiAnPSdcblx0XHRcdHRvcDogJz0nXG5cdFx0Y29udHJvbGxlckFzOiAndm0nXG5cdFx0dGVtcGxhdGVOYW1lc3BhY2U6ICdzdmcnXG5cdFx0Y29udHJvbGxlcjogWyckc2NvcGUnLEN0cmxdXG5cdFx0dGVtcGxhdGVVcmw6ICcuL2FwcC9jb21wb25lbnRzL2NhcnQvY2FydC5zdmcnXG5cdFx0YmluZFRvQ29udHJvbGxlcjogdHJ1ZVxuXHRcdHJlc3RyaWN0OiAnQSdcblxubW9kdWxlLmV4cG9ydHMgPSBkZXIiLCJhbmd1bGFyID0gcmVxdWlyZSAnYW5ndWxhcidcbmQzID0gcmVxdWlyZSAnZDMnXG5yZXF1aXJlICcuLi8uLi9oZWxwZXJzJ1xuXyA9IHJlcXVpcmUgJ2xvZGFzaCdcbkNhcnQgPSByZXF1aXJlICcuL2NhcnREYXRhJ1xudGVtcGxhdGUgPSAnJydcblx0PHN2ZyBuZy1pbml0PSd2bS5yZXNpemUoKScgd2lkdGg9JzEwMCUnIGNsYXNzPSd0b3BDaGFydCc+XG5cdFx0PGRlZnM+XG5cdFx0XHQ8Y2xpcHBhdGggaWQ9J2NhcnRQbG90Jz5cblx0XHRcdFx0PHJlY3QgZDMtZGVyPSd7d2lkdGg6IHZtLndpZHRoLCBoZWlnaHQ6IHZtLmhlaWdodH0nIC8+XG5cdFx0XHQ8L2NsaXBwYXRoPlxuXHRcdDwvZGVmcz5cblx0XHQ8ZyBjbGFzcz0nYm9pbGVycGxhdGUnIHNoaWZ0ZXI9J1t2bS5tYXIubGVmdCwgdm0ubWFyLnRvcF0nPlxuXHRcdFx0PHJlY3QgY2xhc3M9J2JhY2tncm91bmQnIGQzLWRlcj0ne3dpZHRoOiB2bS53aWR0aCwgaGVpZ2h0OiB2bS5oZWlnaHR9JyAvPlxuXHRcdFx0PGcgdmVyLWF4aXMtZGVyIHdpZHRoPSd2bS53aWR0aCcgc2NhbGU9J3ZtLlYnIGZ1bj0ndm0udmVyQXhGdW4nPjwvZz5cblx0XHRcdDxnIGhvci1heGlzLWRlciBoZWlnaHQ9J3ZtLmhlaWdodCcgc2NhbGU9J3ZtLlQnIGZ1bj0ndm0uaG9yQXhGdW4nIHNoaWZ0ZXI9J1swLHZtLmhlaWdodF0nPjwvZz5cblx0XHRcdDxmb3JlaWduT2JqZWN0IHdpZHRoPSczMCcgaGVpZ2h0PSczMCcgeT0nMTcnIHNoaWZ0ZXI9J1t2bS53aWR0aC8yLCB2bS5oZWlnaHRdJz5cblx0XHRcdFx0PHRleHQgY2xhc3M9J2xhYmVsJyA+JHQkPC90ZXh0PlxuXHRcdFx0PC9mb3JlaWduT2JqZWN0PlxuXHRcdFx0PGZvcmVpZ25PYmplY3Qgd2lkdGg9JzMwJyBoZWlnaHQ9JzMwJyBzaGlmdGVyPSdbLTMxLCB2bS5oZWlnaHQvMi04XSc+XG5cdFx0XHRcdFx0PHRleHQgY2xhc3M9J2xhYmVsJyA+JHYkPC90ZXh0PlxuXHRcdFx0PC9mb3JlaWduT2JqZWN0PlxuXHRcdFx0PGxpbmUgY2xhc3M9J3plcm8tbGluZScgZDMtZGVyPVwie3gxOiAwICwgeDI6IHZtLndpZHRoLCB5MTogdm0uVigwKSwgeTI6IHZtLlYoMCl9XCIgLz4gXG5cdFx0XHQ8bGluZSBjbGFzcz0nemVyby1saW5lJyBkMy1kZXI9XCJ7eDE6IHZtLlQoMCkgLCB4Mjogdm0uVCgwKSwgeTE6IDAsIHkyOiB2bS5oZWlnaHR9XCIgLz4gXG5cdFx0PC9nPlxuXHRcdDxnIGNsYXNzPSdtYWluJyBjbGlwLXBhdGg9XCJ1cmwoI2NhcnRQbG90KVwiIHNoaWZ0ZXI9J1t2bS5tYXIubGVmdCwgdm0ubWFyLnRvcF0nPlxuXHRcdFx0PGZvcmVpZ25PYmplY3Qgd2lkdGg9JzMwJyBoZWlnaHQ9JzMwJyBzaGlmdGVyPSdbKHZtLlQodm0ucG9pbnQudCkgLSAxNiksIHZtLnN0aGluZ10nIHN0eWxlPSdmb250LXNpemU6IDEzcHg7IGZvbnQtd2VpZ2h0OiAxMDA7Jz5cblx0XHRcdFx0XHQ8dGV4dCBjbGFzcz0nbGFiZWwnIGZvbnQtc2l6ZT0nMTNweCc+JHYkPC90ZXh0PlxuXHRcdFx0PC9mb3JlaWduT2JqZWN0PlxuXHRcdFx0PGxpbmUgY2xhc3M9J3RyaSB2JyBkMy1kZXI9J3t4MTogdm0uVCh2bS5wb2ludC50KS0xLCB4Mjogdm0uVCh2bS5wb2ludC50KS0xLCB5MTogdm0uVigwKSwgeTI6IHZtLlYodm0ucG9pbnQudil9Jy8+XG5cdFx0XHQ8cGF0aCBuZy1hdHRyLWQ9J3t7dm0ubGluZUZ1bih2bS50cmFqZWN0b3J5KX19JyBjbGFzcz0nZnVuIHYnIC8+XG5cdFx0XHQ8Y2lyY2xlIHI9JzNweCcgc2hpZnRlcj0nW3ZtLlQodm0ucG9pbnQudCksIHZtLlYodm0ucG9pbnQudildJyBjbGFzcz0ncG9pbnQgdicvPlxuXHRcdFx0PGZvcmVpZ25PYmplY3Qgd2lkdGg9JzcwJyBoZWlnaHQ9JzMwJyBzaGlmdGVyPSdbdm0uVCg0KSwgdm0uViguNCldJz5cblx0XHRcdFx0XHQ8dGV4dCBjbGFzcz0ndHJpLWxhYmVsJyA+JDJlXnstLjh0fSQ8L3RleHQ+XG5cdFx0XHQ8L2ZvcmVpZ25PYmplY3Q+XG5cdFx0PC9nPlxuXHQ8L3N2Zz5cbicnJ1xuXG5jbGFzcyBDdHJsXG5cdGNvbnN0cnVjdG9yOiAoQHNjb3BlLCBAZWwsIEB3aW5kb3cpLT5cblx0XHRAbWFyID0gXG5cdFx0XHRsZWZ0OiAzMFxuXHRcdFx0dG9wOiAxMFxuXHRcdFx0cmlnaHQ6IDEwXG5cdFx0XHRib3R0b206IDQwXG5cblx0XHRAViA9IGQzLnNjYWxlLmxpbmVhcigpLmRvbWFpbiBbLS4xLDIuNV1cblx0XHRAVCA9IGQzLnNjYWxlLmxpbmVhcigpLmRvbWFpbiBbLS4xLDVdXG5cblx0XHRAcG9pbnQgPSBDYXJ0XG5cdFx0QHRyYWplY3RvcnkgPSBDYXJ0LnRyYWplY3RvcnlcblxuXHRcdEBob3JBeEZ1biA9IGQzLnN2Zy5heGlzKClcblx0XHRcdC5zY2FsZSBAVFxuXHRcdFx0LnRpY2tzIDVcblx0XHRcdC5vcmllbnQgJ2JvdHRvbSdcblxuXHRcdEB2ZXJBeEZ1biA9IGQzLnN2Zy5heGlzKClcblx0XHRcdC5zY2FsZSBAVlxuXHRcdFx0LnRpY2tzIDVcblx0XHRcdC5vcmllbnQgJ2xlZnQnXG5cdFx0XG5cdFx0QGxpbmVGdW4gPSBkMy5zdmcubGluZSgpXG5cdFx0XHQueSAoZCk9PiBAViBkLnZcblx0XHRcdC54IChkKT0+IEBUIGQudFxuXG5cdFx0YW5ndWxhci5lbGVtZW50IEB3aW5kb3dcblx0XHRcdC5vbiAncmVzaXplJywgQHJlc2l6ZVxuXG5cdFx0QG1vdmUgPSAoZXZlbnQpID0+XG5cdFx0XHRpZiBub3QgQ2FydC5wYXVzZWQgdGhlbiByZXR1cm5cblx0XHRcdHJlY3QgPSBldmVudC50YXJnZXQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KClcblx0XHRcdHQgPSBAVC5pbnZlcnQgZXZlbnQueCAtIHJlY3QubGVmdFxuXHRcdFx0dCA9IE1hdGgubWF4IDAgLCB0XG5cdFx0XHRDYXJ0LnNldF90IHRcblx0XHRcdEBzY29wZS4kZXZhbEFzeW5jKClcblxuXHRAcHJvcGVydHkgJ3N0aGluZycsIGdldDotPlxuXHRcdEBWKEBwb2ludC52LzIpIC0gN1xuXG5cdEBwcm9wZXJ0eSAnc3ZnX2hlaWdodCcsIGdldDogLT4gQGhlaWdodCArIEBtYXIudG9wICsgQG1hci5ib3R0b21cblxuXHRyZXNpemU6ICgpPT5cblx0XHRAd2lkdGggPSBAZWxbMF0uY2xpZW50V2lkdGggLSBAbWFyLmxlZnQgLSBAbWFyLnJpZ2h0XG5cdFx0QGhlaWdodCA9IEBlbFswXS5jbGllbnRIZWlnaHQgLSBAbWFyLmxlZnQgLSBAbWFyLnJpZ2h0XG5cdFx0QFYucmFuZ2UgW0BoZWlnaHQsIDBdXG5cdFx0QFQucmFuZ2UgWzAsIEB3aWR0aF1cblx0XHRAc2NvcGUuJGV2YWxBc3luYygpXG5cbmRlciA9ICgpLT5cblx0ZGlyZWN0aXZlID0gXG5cdFx0Y29udHJvbGxlckFzOiAndm0nXG5cdFx0c2NvcGU6IHt9XG5cdFx0dGVtcGxhdGU6IHRlbXBsYXRlXG5cdFx0dGVtcGxhdGVOYW1lc3BhY2U6ICdzdmcnXG5cdFx0Y29udHJvbGxlcjogWyckc2NvcGUnLCckZWxlbWVudCcsICckd2luZG93JywgQ3RybF1cblxubW9kdWxlLmV4cG9ydHMgPSBkZXJcbiIsIl8gPSByZXF1aXJlICdsb2Rhc2gnXG5kMz0gcmVxdWlyZSAnZDMnXG57bWlufSA9IE1hdGhcbkNhcnQgPSByZXF1aXJlICcuL2NhcnREYXRhJ1xucmVxdWlyZSAnLi4vLi4vaGVscGVycydcblxuIyB0ZW1wbGF0ZSA9ICcnXG5cbiMgdGVtcGxhdGUgPSAnJydcbiMgXHQ8c3ZnIG5nLWluaXQ9J3ZtLnJlc2l6ZSgpJyB3aWR0aD0nMTAwJScgbmctYXR0ci1oZWlnaHQ9XCJ7e3ZtLnN2Z0hlaWdodH19XCI+XG4jIFx0XHQ8ZGVmcz5cbiMgXHRcdFx0PGNsaXBwYXRoIGlkPSdjYXJ0U2ltJz5cbiMgXHRcdFx0XHQ8cmVjdCBkMy1kZXI9J3t3aWR0aDogdm0ud2lkdGgsIGhlaWdodDogdm0uaGVpZ2h0fScgLz5cbiMgXHRcdFx0PC9jbGlwcGF0aD5cbiMgXHRcdDwvZGVmcz5cbiMgXHRcdDxnIGNsYXNzPSdib2lsZXJwbGF0ZScgc2hpZnRlcj0ne3s6Olt2bS5tYXIubGVmdCwgdm0ubWFyLnRvcF19fScgPlxuIyBcdFx0XHQ8cmVjdCBkMy1kZXI9J3t3aWR0aDogdm0ud2lkdGgsIGhlaWdodDogdm0uaGVpZ2h0fScgY2xhc3M9J2JhY2tncm91bmQnLz5cbiMgXHRcdFx0PGcgaG9yLWF4aXMtZGVyIGhlaWdodD0ndm0uaGVpZ2h0JyBzY2FsZT0ndm0uWCcgZnVuPSd2bS5heGlzRnVuJyBzaGlmdGVyPSdbMCx2bS5oZWlnaHRdJz48L2c+XG4jIFx0XHRcdDxmb3JlaWduT2JqZWN0IHdpZHRoPSczMCcgaGVpZ2h0PSczMCcgeT0nMjAnIHNoaWZ0ZXI9J1t2bS53aWR0aC8yLCB2bS5oZWlnaHRdJz5cbiMgXHRcdFx0XHRcdDx0ZXh0IGNsYXNzPSdsYWJlbCcgPiR4JDwvdGV4dD5cbiMgXHRcdFx0PC9mb3JlaWduT2JqZWN0PlxuIyBcdFx0PC9nPlxuIyBcdFx0PGcgc2hpZnRlcj0ne3s6Olt2bS5tYXIubGVmdCwgdm0ubWFyLnRvcF19fScgY2xpcC1wYXRoPVwidXJsKCNjYXJ0U2ltKVwiID5cbiMgXHRcdFx0PGZvcmVpZ25PYmplY3Qgd2lkdGg9JzMwJyBoZWlnaHQ9JzMwJyB5PScyMCcgc2hpZnRlcj0nW3ZtLndpZHRoLzIsIHZtLmhlaWdodF0nPlxuIyBcdFx0XHRcdFx0PHRleHQgY2xhc3M9J2xhYmVsJyA+JHQkPC90ZXh0PlxuIyBcdFx0XHQ8L2ZvcmVpZ25PYmplY3Q+XG4jIFx0XHRcdDxnIGNsYXNzPSdnLWNhcnQnIGNhcnQtb2JqZWN0LWRlciBsZWZ0PSd2bS5YKHZtLkNhcnQueCknIHNoaWZ0ZXI9J1swLHZtLmhlaWdodF0nIHNpemU9J3ZtLnNpemUnPjwvZz5cbiMgXHRcdDwvZz5cbiMgXHQ8L3N2Zz5cbiMgJycnXG5cbmNsYXNzIEN0cmxcblx0Y29uc3RydWN0b3I6IChAc2NvcGUsIEBlbCwgQHdpbmRvdyktPlxuXHRcdEBDYXJ0ID0gQ2FydFxuXHRcdEBtYXggPSA0XG5cdFx0QHNhbXBsZSA9IFtdXG5cbmRlciA9ICgpLT5cblx0ZGlyZWN0aXZlID0gXG5cdFx0dGVtcGxhdGU6ICc8ZGl2IGNhcnQtZGVyIGRhdGE9XCJ2bS5DYXJ0XCIgbWF4PVwidm0ubWF4XCIgc2FtcGxlPVwidm0uc2FtcGxlXCI+PC9kaXY+J1xuXHRcdHNjb3BlOiB7fVxuXHRcdHJlc3RyaWN0OiAnQSdcblx0XHRiaW5kVG9Db250cm9sbGVyOiB0cnVlXG5cdFx0IyB0ZW1wbGF0ZU5hbWVzcGFjZTogJ3N2Zydcblx0XHRjb250cm9sbGVyOiBbJyRzY29wZScsICckZWxlbWVudCcsICckd2luZG93JywgQ3RybF1cblx0XHRjb250cm9sbGVyQXM6ICd2bSdcblxubW9kdWxlLmV4cG9ydHMgPSBkZXJcbiIsImFuZ3VsYXIgPSByZXF1aXJlICdhbmd1bGFyJ1xuZDMgPSByZXF1aXJlICdkMydcbnJlcXVpcmUgJy4uLy4uL2hlbHBlcnMnXG5fID0gcmVxdWlyZSAnbG9kYXNoJ1xuUGxvdEN0cmwgPSByZXF1aXJlICcuLi8uLi9kaXJlY3RpdmVzL3Bsb3RDdHJsJ1xuXG50ZW1wbGF0ZSA9ICcnJ1xuXHQ8c3ZnIG5nLWluaXQ9J3ZtLnJlc2l6ZSgpJyBjbGFzcz0ndG9wQ2hhcnQnID5cblx0XHQ8ZyBib2lsZXJwbGF0ZS1kZXIgd2lkdGg9J3ZtLndpZHRoJyBoZWlnaHQ9J3ZtLmhlaWdodCcgdmVyLWF4LWZ1bj0ndm0udmVyQXhGdW4nIGhvci1heC1mdW49J3ZtLmhvckF4RnVuJyB2ZXI9J3ZtLlZlcicgaG9yPSd2bS5Ib3InIG1hcj0ndm0ubWFyJyBuYW1lPSd2bS5uYW1lJz48L2c+XG5cdFx0PGcgY2xhc3M9J21haW4nIG5nLWF0dHItY2xpcC1wYXRoPSd1cmwoI3t7dm0ubmFtZX19KScgc2hpZnRlcj0nW3ZtLm1hci5sZWZ0LCB2bS5tYXIudG9wXSc+XG5cdFx0XHQ8Zm9yZWlnbk9iamVjdCB3aWR0aD0nMzAnIGhlaWdodD0nMzAnIHk9JzIwJyBzaGlmdGVyPSdbdm0ud2lkdGgvMiwgdm0uaGVpZ2h0XSc+XG5cdFx0XHRcdFx0PHRleHQgY2xhc3M9J2xhYmVsJyA+JHQkPC90ZXh0PlxuXHRcdFx0PC9mb3JlaWduT2JqZWN0PlxuXHRcdFx0PGxpbmUgY2xhc3M9J3plcm8tbGluZSBob3InIGQzLWRlcj0ne3gxOiAwLCB4Mjogdm0ud2lkdGgsIHkxOiB2bS5WZXIoMCksIHkyOiB2bS5WZXIoMCl9Jy8+XG5cdFx0XHQ8cGF0aCBuZy1hdHRyLWQ9J3t7dm0ubGluZUZ1bih2bS5EYXRhLnRyYWplY3RvcnkpfX0nIGNsYXNzPSdmdW4gdicgLz5cblx0XHRcdDxwYXRoIG5nLWF0dHItZD0ne3t2bS50cmlhbmdsZURhdGF9fScgY2xhc3M9J3RyaScgLz5cblx0XHRcdDxsaW5lIGNsYXNzPSd0cmkgZHYnIGQzLWRlcj0ne3gxOiB2bS5Ib3Iodm0ucG9pbnQudCktMSwgeDI6IHZtLkhvcih2bS5wb2ludC50KS0xLCB5MTogdm0uVmVyKHZtLnBvaW50LnYpLCB5Mjogdm0uVmVyKCh2bS5wb2ludC52ICsgdm0ucG9pbnQuZHYpKX0nLz5cblx0XHRcdDxmb3JlaWduT2JqZWN0IHdpZHRoPSczMCcgaGVpZ2h0PSczMCcgc2hpZnRlcj0nWyh2bS5Ib3Iodm0ucG9pbnQudCkgLSAxNiksIHZtLnN0aGluZ10nPlxuXHRcdFx0XHRcdDx0ZXh0IGNsYXNzPSd0cmktbGFiZWwnID4kXFxcXGRvdHt5fSQ8L3RleHQ+XG5cdFx0XHQ8L2ZvcmVpZ25PYmplY3Q+XG5cdFx0XHQ8Zm9yZWlnbk9iamVjdCB3aWR0aD0nMTAwJyBoZWlnaHQ9JzMwJyBzaGlmdGVyPSdbdm0uSG9yKDEuNjUpLCB2bS5WZXIoMS4zOCldJz5cblx0XHRcdFx0PHRleHQgY2xhc3M9J3RyaS1sYWJlbCc+JFxcXFxzaW4odCkkPC90ZXh0PlxuXHRcdFx0PC9mb3JlaWduT2JqZWN0PlxuXHRcdFx0PGNpcmNsZSByPSczcHgnICBzaGlmdGVyPSdbdm0uSG9yKHZtLnBvaW50LnQpLCB2bS5WZXIodm0ucG9pbnQudildJyBjbGFzcz0ncG9pbnQgdicvPlxuXHRcdDwvZz5cblx0PC9zdmc+XG4nJydcblxuY2xhc3MgQ3RybCBleHRlbmRzIFBsb3RDdHJsXG5cdGNvbnN0cnVjdG9yOiAoQHNjb3BlLCBAZWwsIEB3aW5kb3csIEBEYXRhKS0+XG5cdFx0c3VwZXIgQHNjb3BlLCBAZWwsIEB3aW5kb3dcblx0XHRAbmFtZSA9ICdkZXJpdmF0aXZlQSdcblx0XHRAVmVyLmRvbWFpbiBbLTEuNSwxLjVdXG5cdFx0QEhvci5kb21haW4gWzAsNl1cblx0XHRAbGluZUZ1blxuXHRcdFx0LnkgKGQpPT4gQFZlciBkLnZcblx0XHRcdC54IChkKT0+IEBIb3IgZC50XG5cblx0XHRzZXRUaW1lb3V0ID0+XG5cdFx0XHRARGF0YS5wbGF5KClcblxuXHRtb3ZlOiA9PlxuXHRcdHQgPSBASG9yLmludmVydCBldmVudC54IC0gZXZlbnQudGFyZ2V0LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLmxlZnRcblx0XHRARGF0YS5zZXRUIHRcblx0XHRAc2NvcGUuJGV2YWxBc3luYygpXG5cblx0QHByb3BlcnR5ICdzdGhpbmcnLCBnZXQ6LT5cblx0XHRAVmVyKEBwb2ludC5kdi8yICsgQHBvaW50LnYpIC0gN1xuXG5cdEBwcm9wZXJ0eSAncG9pbnQnLCBnZXQ6LT5cblx0XHRARGF0YS5wb2ludFxuXG5cdEBwcm9wZXJ0eSAndHJpYW5nbGVEYXRhJywgZ2V0Oi0+XG5cdFx0QGxpbmVGdW4gW3t2OiBAcG9pbnQudiwgdDogQHBvaW50LnR9LCB7djpAcG9pbnQuZHYgKyBAcG9pbnQudiwgdDogQHBvaW50LnQrMX0sIHt2OiBAcG9pbnQuZHYgKyBAcG9pbnQudiwgdDogQHBvaW50LnR9XVxuXG5cbmRlciA9IC0+XG5cdGRpcmVjdGl2ZSA9IFxuXHRcdGNvbnRyb2xsZXJBczogJ3ZtJ1xuXHRcdHNjb3BlOiB7fVxuXHRcdGxpbms6IChzY29wZSwgZWwsIGF0dHIsIHZtKS0+XG5cdFx0XHRkMy5zZWxlY3QgZWxbMF1cblx0XHRcdFx0LnNlbGVjdCAncmVjdC5iYWNrZ3JvdW5kJ1xuXHRcdFx0XHQub24gJ21vdXNlb3ZlcicsLT5cblx0XHRcdFx0XHR2bS5EYXRhLnBhdXNlKClcblx0XHRcdFx0Lm9uICdtb3VzZW1vdmUnLCAtPlxuXHRcdFx0XHRcdHZtLm1vdmUoKVxuXHRcdFx0XHQub24gJ21vdXNlb3V0JywgLT5cblx0XHRcdFx0XHR2bS5EYXRhLnBsYXkoKVxuXHRcdHRlbXBsYXRlOiB0ZW1wbGF0ZVxuXHRcdHRlbXBsYXRlTmFtZXNwYWNlOiAnc3ZnJ1xuXHRcdGNvbnRyb2xsZXI6IFsnJHNjb3BlJywnJGVsZW1lbnQnLCAnJHdpbmRvdycsJ2Rlcml2YXRpdmVEYXRhJywgQ3RybF1cblxubW9kdWxlLmV4cG9ydHMgPSBkZXJcbiIsImFuZ3VsYXIgPSByZXF1aXJlICdhbmd1bGFyJ1xuZDMgPSByZXF1aXJlICdkMydcbnJlcXVpcmUgJy4uLy4uL2hlbHBlcnMnXG5fID0gcmVxdWlyZSAnbG9kYXNoJ1xuIyBEYXRhID0gcmVxdWlyZSAnLi9kZXJpdmF0aXZlRGF0YSdcblBsb3RDdHJsID0gcmVxdWlyZSAnLi4vLi4vZGlyZWN0aXZlcy9wbG90Q3RybCdcblxudGVtcGxhdGUgPSAnJydcblx0PHN2ZyBuZy1pbml0PSd2bS5yZXNpemUoKScgY2xhc3M9J3RvcENoYXJ0Jz5cblx0XHQ8ZyBib2lsZXJwbGF0ZS1kZXIgd2lkdGg9J3ZtLndpZHRoJyBoZWlnaHQ9J3ZtLmhlaWdodCcgdmVyLWF4LWZ1bj0ndm0udmVyQXhGdW4nIGhvci1heC1mdW49J3ZtLmhvckF4RnVuJyB2ZXI9J3ZtLlZlcicgaG9yPSd2bS5Ib3InIG1hcj0ndm0ubWFyJyBuYW1lPSd2bS5uYW1lJz48L2c+XG5cdFx0PGcgY2xhc3M9J21haW4nIG5nLWF0dHItY2xpcC1wYXRoPVwidXJsKCN7e3ZtLm5hbWV9fSlcIiBzaGlmdGVyPSdbdm0ubWFyLmxlZnQsIHZtLm1hci50b3BdJz5cblx0XHRcdDxmb3JlaWduT2JqZWN0IHdpZHRoPSczMCcgaGVpZ2h0PSczMCcgeT0nMjAnIHNoaWZ0ZXI9J1t2bS53aWR0aC8yLCB2bS5oZWlnaHRdJz5cblx0XHRcdFx0XHQ8dGV4dCBjbGFzcz0nbGFiZWwnID4kdCQ8L3RleHQ+XG5cdFx0XHQ8L2ZvcmVpZ25PYmplY3Q+XG5cdFx0XHQ8bGluZSBjbGFzcz0nemVyby1saW5lIGhvcicgZDMtZGVyPSd7eDE6IDAsIHgyOiB2bS53aWR0aCwgeTE6IHZtLlZlcigwKSwgeTI6IHZtLlZlcigwKX0nLz5cblx0XHRcdDxwYXRoIGQzLWRlcj0ne2Q6dm0ubGluZUZ1bih2bS5EYXRhLnRyYWplY3RvcnkpfScgY2xhc3M9J2Z1biBkdicgLz5cblx0XHRcdDxsaW5lIGNsYXNzPSd0cmkgZHYnIGQzLWRlcj0ne3gxOiB2bS5Ib3Iodm0ucG9pbnQudCksIHgyOiB2bS5Ib3Iodm0ucG9pbnQudCksIHkxOiB2bS5WZXIoMCksIHkyOiB2bS5WZXIodm0ucG9pbnQuZHYpfScvPlxuXHRcdFx0PGZvcmVpZ25PYmplY3Qgd2lkdGg9JzMwJyBoZWlnaHQ9JzMwJyBzaGlmdGVyPSdbKHZtLkhvcih2bS5wb2ludC50KSAtIDE2KSwgdm0uVmVyKHZtLnBvaW50LmR2Ki41KS02XSc+XG5cdFx0XHRcdFx0PHRleHQgY2xhc3M9J3RyaS1sYWJlbCc+JFxcXFxkb3R7eX0kPC90ZXh0PlxuXHRcdFx0PC9mb3JlaWduT2JqZWN0PlxuXHRcdFx0PGZvcmVpZ25PYmplY3Qgd2lkdGg9JzEwMCcgaGVpZ2h0PSczMCcgc2hpZnRlcj0nW3ZtLkhvciguOSksIHZtLlZlcigxKV0nPlxuXHRcdFx0XHQ8dGV4dCBjbGFzcz0ndHJpLWxhYmVsJz4kXFxcXGNvcyh0KSQ8L3RleHQ+XG5cdFx0XHQ8L2ZvcmVpZ25PYmplY3Q+XG5cdFx0XHQ8Y2lyY2xlIHI9JzRweCcgIHNoaWZ0ZXI9J1t2bS5Ib3Iodm0ucG9pbnQudCksIHZtLlZlcih2bS5wb2ludC5kdildJyBjbGFzcz0ncG9pbnQgZHYnLz5cblx0XHQ8L2c+XG5cdDwvc3ZnPlxuJycnXG5cbmNsYXNzIEN0cmwgZXh0ZW5kcyBQbG90Q3RybFxuXHRjb25zdHJ1Y3RvcjogKEBzY29wZSwgQGVsLCBAd2luZG93LCBARGF0YSktPlxuXHRcdHN1cGVyIEBzY29wZSwgQGVsLCBAd2luZG93XG5cdFx0QFZlci5kb21haW4gWy0xLjUsMS41XVxuXHRcdEBIb3IuZG9tYWluIFswLDZdXG5cdFx0QG5hbWUgPSAnZGVyaXZhdGl2ZUInXG5cdFx0QGxpbmVGdW5cblx0XHRcdC55IChkKT0+IEBWZXIgZC5kdlxuXHRcdFx0LnggKGQpPT4gQEhvciBkLnRcblxuXHRtb3ZlOiA9PlxuXHRcdHQgPSBASG9yLmludmVydCBldmVudC54IC0gZXZlbnQudGFyZ2V0LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLmxlZnRcblx0XHRARGF0YS5zZXRUIHRcblx0XHRAc2NvcGUuJGV2YWxBc3luYygpXG5cblx0QHByb3BlcnR5ICdwb2ludCcsIGdldDotPlxuXHRcdEBEYXRhLnBvaW50XG5cbmRlciA9IC0+XG5cdGRpcmVjdGl2ZSA9IFxuXHRcdGNvbnRyb2xsZXJBczogJ3ZtJ1xuXHRcdHNjb3BlOiB7fVxuXHRcdGxpbms6IChzY29wZSxlbCxhdHRyLCB2bSktPlxuXHRcdFx0ZDMuc2VsZWN0IGVsWzBdXG5cdFx0XHRcdC5zZWxlY3QgJ3JlY3QuYmFja2dyb3VuZCdcblx0XHRcdFx0Lm9uICdtb3VzZW92ZXInLC0+XG5cdFx0XHRcdFx0dm0uRGF0YS5wYXVzZSgpXG5cdFx0XHRcdC5vbiAnbW91c2Vtb3ZlJywgLT5cblx0XHRcdFx0XHR2bS5tb3ZlKClcblx0XHRcdFx0Lm9uICdtb3VzZW91dCcsIC0+XG5cdFx0XHRcdFx0dm0uRGF0YS5wbGF5KClcblx0XHR0ZW1wbGF0ZTogdGVtcGxhdGVcblx0XHR0ZW1wbGF0ZU5hbWVzcGFjZTogJ3N2Zydcblx0XHRjb250cm9sbGVyOiBbJyRzY29wZScsJyRlbGVtZW50JywgJyR3aW5kb3cnLCAnZGVyaXZhdGl2ZURhdGEnLCBDdHJsXVxuXG5tb2R1bGUuZXhwb3J0cyA9IGRlclxuIiwiXyA9IHJlcXVpcmUgJ2xvZGFzaCdcbnZGdW4gPSBNYXRoLnNpblxuZHZGdW4gPSBNYXRoLmNvc1xuXG5jbGFzcyBTZXJ2aWNlXG5cdGNvbnN0cnVjdG9yOiAoJHJvb3RTY29wZSktPlxuXHRcdEByb290U2NvcGUgPSAkcm9vdFNjb3BlXG5cdFx0QHNldFQgMFxuXHRcdEBwYXVzZWQgPSAgZmFsc2Vcblx0XHRAdHJhamVjdG9yeSA9IF8ucmFuZ2UgMCAsIDYgLCAxLzI1XG5cdFx0XHQubWFwICh0KS0+XG5cdFx0XHRcdHJlcyA9IFxuXHRcdFx0XHRcdGR2OiBkdkZ1biB0XG5cdFx0XHRcdFx0djogdkZ1biB0XG5cdFx0XHRcdFx0dDogdFxuXHRcdEBtb3ZlIDAgXG5cblx0Y2xpY2s6IC0+XG5cdFx0aWYgQHBhdXNlZCB0aGVuIEBwbGF5KCkgZWxzZSBAcGF1c2UoKVxuXG5cdHBhdXNlOiAtPlxuXHRcdEBwYXVzZWQgPSB0cnVlXG5cblx0aW5jcmVtZW50OihkdCkgLT5cblx0XHRAdCArPSBkdFxuXHRcdEBtb3ZlKEB0KVxuXG5cdHNldFQ6ICh0KS0+XG5cdFx0QHQgPSB0XG5cdFx0QG1vdmUoQHQpXG5cblx0cGxheTogLT5cblx0XHRAcGF1c2VkID0gdHJ1ZVxuXHRcdGQzLnRpbWVyLmZsdXNoKClcblx0XHRAcGF1c2VkID0gZmFsc2Vcblx0XHRsYXN0ID0gMFxuXHRcdGQzLnRpbWVyIChlbGFwc2VkKT0+XG5cdFx0XHRcdGR0ID0gZWxhcHNlZCAtIGxhc3Rcblx0XHRcdFx0QGluY3JlbWVudCBkdC8xMDAwXG5cdFx0XHRcdGxhc3QgPSBlbGFwc2VkXG5cdFx0XHRcdGlmIEB0ID4gNiB0aGVuIEBzZXRUIDBcblx0XHRcdFx0QHJvb3RTY29wZS4kZXZhbEFzeW5jKClcblx0XHRcdFx0QHBhdXNlZFxuXHRcdFx0LCAxXG5cblx0bW92ZTogKHQpLT5cblx0XHRAcG9pbnQgPSBcblx0XHRcdGR2OiBkdkZ1biB0XG5cdFx0XHR2OiB2RnVuIHRcblx0XHRcdHQ6IHRcblxubW9kdWxlLmV4cG9ydHMgPSBTZXJ2aWNlIiwicmVxdWlyZSAnLi4vLi4vaGVscGVycydcblBsb3RDdHJsID0gcmVxdWlyZSAnLi4vLi4vZGlyZWN0aXZlcy9wbG90Q3RybCdcblxudGVtcGxhdGUgPSAnJydcblx0PHN2ZyBuZy1pbml0PSd2bS5yZXNpemUoKScgY2xhc3M9J2JvdHRvbUNoYXJ0JyA+XG5cdFx0PGcgYm9pbGVycGxhdGUtZGVyIHdpZHRoPSd2bS53aWR0aCcgaGVpZ2h0PSd2bS5oZWlnaHQnIHZlci1heC1mdW49J3ZtLnZlckF4RnVuJyBob3ItYXgtZnVuPSd2bS5ob3JBeEZ1bicgdmVyPSd2bS5WZXInIGhvcj0ndm0uSG9yJyBtYXI9J3ZtLm1hcicgbmFtZT0nXCJkZXNpZ25BXCInPjwvZz5cblx0XHQ8ZyBjbGFzcz0nbWFpbicgY2xpcC1wYXRoPVwidXJsKCNkZXNpZ25BKVwiIHNoaWZ0ZXI9J1t2bS5tYXIubGVmdCwgdm0ubWFyLnRvcF0nID5cblx0XHRcdDxyZWN0IHN0eWxlPSdvcGFjaXR5OjAnIG5nLWF0dHItaGVpZ2h0PSd7e3ZtLmhlaWdodH19JyBuZy1hdHRyLXdpZHRoPSd7e3ZtLndpZHRofX0nIGJlaGF2aW9yPSd2bS5kcmFnX3JlY3QnPjwvcmVjdD5cblx0XHRcdDxmb3JlaWduT2JqZWN0IHdpZHRoPSczMCcgaGVpZ2h0PSczMCcgc2hpZnRlcj0nWy0zOCwgdm0uaGVpZ2h0LzJdJz5cblx0XHRcdFx0XHQ8dGV4dCBjbGFzcz0nbGFiZWwnPiR2JDwvdGV4dD5cblx0XHRcdDwvZm9yZWlnbk9iamVjdD5cblx0XHRcdDxmb3JlaWduT2JqZWN0IHdpZHRoPSczMCcgaGVpZ2h0PSczMCcgeT0nMjAnIHNoaWZ0ZXI9J1t2bS53aWR0aC8yLCB2bS5oZWlnaHRdJz5cblx0XHRcdFx0XHQ8dGV4dCBjbGFzcz0nbGFiZWwnID4kdCQ8L3RleHQ+XG5cdFx0XHQ8L2ZvcmVpZ25PYmplY3Q+XG5cdFx0XHQ8bGluZSBjbGFzcz0nemVyby1saW5lJyBkMy1kZXI9J3t4MTogMCwgeDI6IHZtLndpZHRoLCB5MTogdm0uVmVyKDApLCB5Mjogdm0uVmVyKDApfScgLz5cblx0XHRcdDxsaW5lIGNsYXNzPSd6ZXJvLWxpbmUnIGQzLWRlcj1cInt4MTogdm0uSG9yKDApLCB4Mjogdm0uSG9yKDApLCB5MTogdm0uaGVpZ2h0LCB5MjogMH1cIiAvPlxuXHRcdFx0PGcgbmctY2xhc3M9J3toaWRlOiAhdm0uRGF0YS5zaG93fScgPlxuXHRcdFx0XHQ8bGluZSBjbGFzcz0ndHJpIHYnIGQzLWRlcj0ne3gxOiB2bS5Ib3Iodm0uc2VsZWN0ZWQudCktMSwgeDI6IHZtLkhvcih2bS5zZWxlY3RlZC50KS0xLCB5MTogdm0uVmVyKDApLCB5Mjogdm0uVmVyKHZtLnNlbGVjdGVkLnYpfScvPlxuXHRcdFx0XHQ8cGF0aCBuZy1hdHRyLWQ9J3t7dm0udHJpYW5nbGVEYXRhKCl9fScgY2xhc3M9J3RyaScgLz5cblx0XHRcdFx0PGxpbmUgZDMtZGVyPSd7eDE6IHZtLkhvcih2bS5zZWxlY3RlZC50KSsxLCB4Mjogdm0uSG9yKHZtLnNlbGVjdGVkLnQpKzEsIHkxOiB2bS5WZXIodm0uc2VsZWN0ZWQudiksIHkyOiB2bS5WZXIodm0uc2VsZWN0ZWQudiArIHZtLnNlbGVjdGVkLmR2KX0nIGNsYXNzPSd0cmkgZHYnIC8+XG5cdFx0XHQ8L2c+XG5cdFx0XHQ8cGF0aCBuZy1hdHRyLWQ9J3t7dm0ubGluZUZ1bih2bS50cnVlQ2FydC50cmFqZWN0b3J5KX19JyBjbGFzcz0nZnVuIHRhcmdldCcgLz5cblx0XHRcdDxwYXRoIG5nLWF0dHItZD0ne3t2bS5saW5lRnVuKHZtLmZha2VDYXJ0LmRvdHMpfX0nIGNsYXNzPSdmdW4gdicgLz5cblx0XHRcdDxnIG5nLXJlcGVhdD0nZG90IGluIHZtLmRvdHMgdHJhY2sgYnkgZG90LmlkJyBkYXR1bT1kb3Qgc2hpZnRlcj0nW3ZtLkhvcihkb3QudCksdm0uVmVyKGRvdC52KV0nIGJlaGF2aW9yPSd2bS5kcmFnJyBkb3QtYS1kZXI9ZG90ID48L2c+XG5cdFx0XHQ8Y2lyY2xlIGNsYXNzPSdkb3Qgc21hbGwnIHI9JzQnIHNoaWZ0ZXI9J1t2bS5Ib3IoMCksdm0uVmVyKDIpXScgLz5cblx0XHRcdDxmb3JlaWduT2JqZWN0IHdpZHRoPSc3MCcgaGVpZ2h0PSczMCcgc2hpZnRlcj0nW3ZtLkhvcig0KSwgdm0uVmVyKC4zMyldJz5cblx0XHRcdFx0XHQ8dGV4dCBjbGFzcz0ndHJpLWxhYmVsJyA+JDJlXnstLjh0fSQ8L3RleHQ+XG5cdFx0XHQ8L2ZvcmVpZ25PYmplY3Q+XG5cdFx0XHQ8Y2lyY2xlIHI9JzRweCcgIHNoaWZ0ZXI9J1t2bS5Ib3Iodm0uRGF0YS50KSwgdm0uVmVyKHZtLmZha2VDYXJ0LnYpXScgY2xhc3M9J3BvaW50IGZha2UnLz5cblx0XHRcdDxjaXJjbGUgcj0nNHB4JyAgc2hpZnRlcj0nW3ZtLkhvcih2bS5EYXRhLnQpLCB2bS5WZXIodm0udHJ1ZUNhcnQudildJyBjbGFzcz0ncG9pbnQgcmVhbCcvPlxuXHRcdDwvZz5cblx0PC9zdmc+XG4nJydcblxuY2xhc3MgQ3RybCBleHRlbmRzIFBsb3RDdHJsXG5cdGNvbnN0cnVjdG9yOiAoQHNjb3BlLCBAZWwsIEB3aW5kb3csIEBmYWtlQ2FydCwgQHRydWVDYXJ0LCBARGF0YSktPlxuXHRcdHN1cGVyIEBzY29wZSwgQGVsLCBAd2luZG93XG5cdFx0QFZlci5kb21haW4gWy0uMSwyLjFdXG5cdFx0QEhvci5kb21haW4gWy0uMSw0LjVdXG5cblx0XHRAbGluZUZ1blxuXHRcdFx0LnkgKGQpPT4gQFZlciBkLnZcblx0XHRcdC54IChkKT0+IEBIb3IgZC50XG5cblx0XHRAZHJhZ19yZWN0ID0gZDMuYmVoYXZpb3IuZHJhZygpXG5cdFx0XHQub24gJ2RyYWdzdGFydCcsICgpPT5cblx0XHRcdFx0ZDMuZXZlbnQuc291cmNlRXZlbnQuc3RvcFByb3BhZ2F0aW9uKClcblx0XHRcdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKVxuXHRcdFx0XHRpZiBldmVudC53aGljaCA9PSAzXG5cdFx0XHRcdFx0cmV0dXJuIFxuXHRcdFx0XHRARGF0YS5zZXRfc2hvdyB0cnVlXG5cdFx0XHRcdHJlY3QgPSBldmVudC50b0VsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KClcblx0XHRcdFx0dCA9IEBIb3IuaW52ZXJ0IGV2ZW50LnggLSByZWN0LmxlZnRcblx0XHRcdFx0diAgPSBAVmVyLmludmVydCBldmVudC55IC0gcmVjdC50b3Bcblx0XHRcdFx0QGZha2VDYXJ0LmFkZF9kb3QgdCAsIHZcblx0XHRcdFx0QHNjb3BlLiRldmFsQXN5bmMoKVxuXHRcdFx0Lm9uICdkcmFnJywgPT4gQG9uX2RyYWcgQHNlbGVjdGVkXG5cdFx0XHQub24gJ2RyYWdlbmQnLD0+XG5cdFx0XHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KClcblx0XHRcdFx0QERhdGEuc2V0X3Nob3cgdHJ1ZVxuXHRcdFx0XHRldmVudC5zdG9wUHJvcGFnYXRpb24oKVxuXG5cdFx0QGRyYWcgPSBkMy5iZWhhdmlvci5kcmFnKClcblx0XHRcdC5vbiAnZHJhZ3N0YXJ0JywgKGRvdCk9PlxuXHRcdFx0XHRkMy5ldmVudC5zb3VyY2VFdmVudC5zdG9wUHJvcGFnYXRpb24oKVxuXHRcdFx0XHRpZiBldmVudC53aGljaCA9PSAzXG5cdFx0XHRcdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKVxuXHRcdFx0XHRcdEBmYWtlQ2FydC5yZW1vdmVfZG90IGRvdFxuXHRcdFx0XHRcdEBEYXRhLnNldF9zaG93IGZhbHNlXG5cdFx0XHRcdFx0QHNjb3BlLiRldmFsQXN5bmMoKVxuXHRcdFx0Lm9uICdkcmFnJywgQG9uX2RyYWdcblxuXHRcdEBEYXRhLnBsYXkoKVxuXG5cdEBwcm9wZXJ0eSAnZG90cycsIGdldDotPiBcblx0XHRAZmFrZUNhcnQuZG90cy5maWx0ZXIgKGQpLT4gKGQuaWQgIT0nZmlyc3QnKSBhbmQgKGQuaWQgIT0nbGFzdCcpXG5cblx0QHByb3BlcnR5ICdzZWxlY3RlZCcsIGdldDotPiBAZmFrZUNhcnQuc2VsZWN0ZWRcblxuXHRvbl9kcmFnOiAoZG90KT0+IFxuXHRcdFx0QGZha2VDYXJ0LnVwZGF0ZV9kb3QgZG90LCBASG9yLmludmVydChkMy5ldmVudC54KSwgQFZlci5pbnZlcnQoZDMuZXZlbnQueSlcblx0XHRcdEBzY29wZS4kZXZhbEFzeW5jKClcblxuXHR0cmlhbmdsZURhdGE6LT5cblx0XHRwb2ludCA9IEBzZWxlY3RlZFxuXHRcdEBsaW5lRnVuIFt7djogcG9pbnQudiwgdDogcG9pbnQudH0sIHt2OnBvaW50LmR2ICsgcG9pbnQudiwgdDogcG9pbnQudCsxfSwge3Y6IHBvaW50LmR2ICsgcG9pbnQudiwgdDogcG9pbnQudH1dXG5cbmRlciA9ICgpLT5cblx0ZGlyZWN0aXZlID0gXG5cdFx0Y29udHJvbGxlckFzOiAndm0nXG5cdFx0c2NvcGU6IHt9XG5cdFx0dGVtcGxhdGU6IHRlbXBsYXRlXG5cdFx0dGVtcGxhdGVOYW1lc3BhY2U6ICdzdmcnXG5cdFx0Y29udHJvbGxlcjogWyckc2NvcGUnLCckZWxlbWVudCcsICckd2luZG93JywgJ2Zha2VDYXJ0JywgJ3RydWVDYXJ0JywgJ2Rlc2lnbkRhdGEnLCBDdHJsXVxuXG5tb2R1bGUuZXhwb3J0cyA9IGRlclxuIiwicmVxdWlyZSAnLi4vLi4vaGVscGVycydcblBsb3RDdHJsID0gcmVxdWlyZSAnLi4vLi4vZGlyZWN0aXZlcy9wbG90Q3RybCdcblxudGVtcGxhdGUgPSAnJydcblx0PHN2ZyBuZy1pbml0PSd2bS5yZXNpemUoKScgIGNsYXNzPSdib3R0b21DaGFydCc+XG5cdFx0PGcgYm9pbGVycGxhdGUtZGVyIHdpZHRoPSd2bS53aWR0aCcgaGVpZ2h0PSd2bS5oZWlnaHQnIHZlci1heC1mdW49J3ZtLnZlckF4RnVuJyBob3ItYXgtZnVuPSd2bS5ob3JBeEZ1bicgdmVyPSd2bS5WZXInIGhvcj0ndm0uSG9yJyBtYXI9J3ZtLm1hcicgbmFtZT0nXCJkZXNpZ25CXCInPjwvZz5cblx0XHQ8ZyBjbGFzcz0nbWFpbicgY2xpcC1wYXRoPVwidXJsKCNkZXNpZ25CKVwiIHNoaWZ0ZXI9J1t2bS5tYXIubGVmdCwgdm0ubWFyLnRvcF0nPlxuXHRcdFx0PGZvcmVpZ25PYmplY3Qgd2lkdGg9JzMwJyBoZWlnaHQ9JzMwJyBzaGlmdGVyPSdbLTM4LCB2bS5oZWlnaHQvMl0nPlxuXHRcdFx0XHRcdDx0ZXh0IGNsYXNzPSdsYWJlbCc+JFxcXFxkb3R7dn0kPC90ZXh0PlxuXHRcdFx0PC9mb3JlaWduT2JqZWN0PlxuXHRcdFx0PGZvcmVpZ25PYmplY3Qgd2lkdGg9JzMwJyBoZWlnaHQ9JzMwJyB5PScyMCcgc2hpZnRlcj0nW3ZtLndpZHRoLzIsIHZtLmhlaWdodF0nPlxuXHRcdFx0XHRcdDx0ZXh0IGNsYXNzPSdsYWJlbCc+JHYkPC90ZXh0PlxuXHRcdFx0PC9mb3JlaWduT2JqZWN0PlxuXHRcdFx0PGxpbmUgY2xhc3M9J3plcm8tbGluZScgZDMtZGVyPSd7eDE6IDAsIHgyOiB2bS53aWR0aCwgeTE6IHZtLlZlcigwKSwgeTI6IHZtLlZlcigwKX0nIC8+XG5cdFx0XHQ8bGluZSBjbGFzcz0nemVyby1saW5lJyBkMy1kZXI9XCJ7eDE6IHZtLkhvcigwKSwgeDI6IHZtLkhvcigwKSwgeTE6IHZtLmhlaWdodCwgeTI6IDB9XCIgLz5cblx0XHRcdDxwYXRoIG5nLWF0dHItZD0ne3t2bS5saW5lRnVuKHZtLnRydWVDYXJ0LnRyYWplY3RvcnkpfX0nIGNsYXNzPSdmdW4gdGFyZ2V0JyAvPlxuXHRcdFx0PGcgbmctY2xhc3M9J3toaWRlOiAhdm0uRGF0YS5zaG93fScgPlxuXHRcdFx0XHQ8bGluZSBjbGFzcz0ndHJpIHYnIGQzLWRlcj0ne3gxOiB2bS5Ib3IoMCksIHgyOiB2bS5Ib3Iodm0uc2VsZWN0ZWQudiksIHkxOiB2bS5WZXIodm0uc2VsZWN0ZWQuZHYpLCB5Mjogdm0uVmVyKHZtLnNlbGVjdGVkLmR2KX0nLz5cblx0XHRcdFx0PGxpbmUgY2xhc3M9J3RyaSBkdicgZDMtZGVyPSd7eDE6IHZtLkhvcih2bS5zZWxlY3RlZC52KSwgeDI6IHZtLkhvcih2bS5zZWxlY3RlZC52KSwgeTE6IHZtLlZlcigwKSwgeTI6IHZtLlZlcih2bS5zZWxlY3RlZC5kdil9Jy8+XG5cdFx0XHRcdDxwYXRoIGQzLWRlcj0ne2Q6dm0ubGluZUZ1bih2bS50cnVlQ2FydC50cmFqZWN0b3J5KX0nIGNsYXNzPSdmdW4gY29ycmVjdCcgbmctY2xhc3M9J3toaWRlOiAhdm0uRGF0YS5jb3JyZWN0fScgLz5cblx0XHRcdDwvZz5cblx0XHRcdDxnIG5nLXJlcGVhdD0nZG90IGluIHZtLmRvdHMgdHJhY2sgYnkgZG90LmlkJyBzaGlmdGVyPSdbdm0uSG9yKGRvdC52KSx2bS5WZXIoZG90LmR2KV0nIGRvdC1iLWRlcj1kb3Q+PC9nPlxuXHRcdFx0PGZvcmVpZ25PYmplY3Qgd2lkdGg9JzcwJyBoZWlnaHQ9JzMwJyB5PScwJyBzaGlmdGVyPSdbdm0uSG9yKDEuNyksIHZtLlZlcigtMS4yKV0nPlxuXHRcdFx0XHRcdDx0ZXh0IGNsYXNzPSd0cmktbGFiZWwnID4kdic9LS44diQ8L3RleHQ+XG5cdFx0XHQ8L2ZvcmVpZ25PYmplY3Q+XG5cdFx0PC9nPlxuXHQ8L3N2Zz5cbicnJ1xuXG5jbGFzcyBDdHJsIGV4dGVuZHMgUGxvdEN0cmxcblx0Y29uc3RydWN0b3I6IChAc2NvcGUsIEBlbCwgQHdpbmRvdywgQGZha2VDYXJ0LCBAdHJ1ZUNhcnQsIEBEYXRhKS0+XG5cdFx0c3VwZXIgQHNjb3BlLCBAZWwsIEB3aW5kb3dcblxuXHRcdEBWZXIuZG9tYWluIFstMS45LCAuMV1cblx0XHRASG9yLmRvbWFpbiBbLS4xLDIuMTVdXG5cblx0XHRAbGluZUZ1blxuXHRcdFx0LnkgKGQpPT4gQFZlciBkLmR2XG5cdFx0XHQueCAoZCk9PiBASG9yIGQudlxuXG5cdEBwcm9wZXJ0eSAnZG90cycsIGdldDotPlxuXHRcdEBmYWtlQ2FydC5kb3RzLmZpbHRlciAoZCktPiAoZC5pZCAhPSdmaXJzdCcpIGFuZCAoZC5pZCAhPSdsYXN0JylcblxuXHRAcHJvcGVydHkgJ3NlbGVjdGVkJywgZ2V0Oi0+IEBmYWtlQ2FydC5zZWxlY3RlZFxuXHRcdFxuXG5kZXIgPSAoKS0+XG5cdGRpcmVjdGl2ZSA9IFxuXHRcdGNvbnRyb2xsZXJBczogJ3ZtJ1xuXHRcdHNjb3BlOiB7fVxuXHRcdHRlbXBsYXRlOiB0ZW1wbGF0ZVxuXHRcdHRlbXBsYXRlTmFtZXNwYWNlOiAnc3ZnJ1xuXHRcdGNvbnRyb2xsZXI6IFsnJHNjb3BlJywnJGVsZW1lbnQnLCAnJHdpbmRvdycsICdmYWtlQ2FydCcsICd0cnVlQ2FydCcsICdkZXNpZ25EYXRhJywgQ3RybF1cblxubW9kdWxlLmV4cG9ydHMgPSBkZXJcbiIsIl8gPSByZXF1aXJlICdsb2Rhc2gnXG5yZXF1aXJlICcuLi8uLi9oZWxwZXJzJ1xuXG50ZW1wbGF0ZSA9ICcnJ1xuXHQ8ZGl2IGNhcnQtZGVyIGRhdGE9XCJ2bS5mYWtlQ2FydFwiIG1heD1cInZtLm1heFwiIHNhbXBsZT0ndm0uc2FtcGxlJz48L2Rpdj5cbicnJ1xuXG5jbGFzcyBDdHJsXG5cdGNvbnN0cnVjdG9yOiAoQHNjb3BlLCBAZmFrZUNhcnQpLT5cblx0XHRAbWF4ID0gNFxuXHRcdEBzYW1wbGUgPSBfLnJhbmdlIDAsIDUgLCAuNVxuXG5cdEBwcm9wZXJ0eSAnbWF4JywgZ2V0Oi0+XG5cdFx0QGZha2VDYXJ0LmxvYyA0LjVcblxuZGVyID0gLT5cblx0ZGlyZWN0aXZlID0gXG5cdFx0c2NvcGU6IHt9XG5cdFx0cmVzdHJpY3Q6ICdBJ1xuXHRcdGJpbmRUb0NvbnRyb2xsZXI6IHRydWVcblx0XHR0ZW1wbGF0ZTogdGVtcGxhdGVcblx0XHRjb250cm9sbGVyOiBbJyRzY29wZScsICdmYWtlQ2FydCcsIEN0cmxdXG5cdFx0Y29udHJvbGxlckFzOiAndm0nXG5cbm1vZHVsZS5leHBvcnRzID0gZGVyXG4iLCJfID0gcmVxdWlyZSAnbG9kYXNoJ1xucmVxdWlyZSAnLi4vLi4vaGVscGVycydcblxudGVtcGxhdGUgPSAnJydcblx0PGRpdiBjYXJ0LWRlciBkYXRhPVwidm0udHJ1ZUNhcnRcIiBtYXg9XCJ2bS5tYXhcIiBzYW1wbGU9J3ZtLnNhbXBsZSc+PC9kaXY+XG4nJydcblxuY2xhc3MgQ3RybFxuXHRjb25zdHJ1Y3RvcjogKEBzY29wZSwgQHRydWVDYXJ0KS0+XG5cdFx0QG1heCA9IDRcblx0XHRAc2FtcGxlID0gXy5yYW5nZSAwLCA1ICwgLjVcblxuXHRAcHJvcGVydHkgJ21heCcsIGdldDotPlxuXHRcdEB0cnVlQ2FydC5sb2MgNC41XG5cbmRlciA9IC0+XG5cdGRpcmVjdGl2ZSA9IFxuXHRcdHNjb3BlOiB7fVxuXHRcdHJlc3RyaWN0OiAnQSdcblx0XHRiaW5kVG9Db250cm9sbGVyOiB0cnVlXG5cdFx0dGVtcGxhdGU6IHRlbXBsYXRlXG5cdFx0Y29udHJvbGxlcjogWyckc2NvcGUnLCAndHJ1ZUNhcnQnLCBDdHJsXVxuXHRcdGNvbnRyb2xsZXJBczogJ3ZtJ1xuXG5tb2R1bGUuZXhwb3J0cyA9IGRlclxuIiwiYW5ndWxhciA9IHJlcXVpcmUgJ2FuZ3VsYXInXG5kMyA9IHJlcXVpcmUgJ2QzJ1xucmVxdWlyZSAnLi4vLi4vaGVscGVycydcblxuY2xhc3MgU2VydmljZVxuXHRjb25zdHJ1Y3RvcjogKEByb290U2NvcGUpLT5cblx0XHRAdCA9IDBcblx0XHRAc2hvdyA9IEBwYXVzZWQgPSBmYWxzZVxuXG5cdGNsaWNrOiAtPlxuXHRcdGlmIEBwYXVzZWQgdGhlbiBAcGxheSgpIGVsc2UgQHBhdXNlKClcblxuXHRpbmNyZW1lbnQ6IChkdCktPlxuXHRcdEB0Kz1kdFxuXG5cdHNldFQ6ICh0KS0+XG5cdFx0QHQgPSB0XG5cblx0c2V0X3Nob3c6ICh2KS0+XG5cdFx0QHNob3cgPSB2XG5cblx0cGxheTogLT5cblx0XHRAcGF1c2VkID0gdHJ1ZVxuXHRcdGQzLnRpbWVyLmZsdXNoKClcblx0XHRAcGF1c2VkID0gZmFsc2Vcblx0XHRsYXN0ID0gMFxuXHRcdGNvbnNvbGUubG9nICdhc2RmJ1xuXHRcdGQzLnRpbWVyIChlbGFwc2VkKT0+XG5cdFx0XHRcdGR0ID0gZWxhcHNlZCAtIGxhc3Rcblx0XHRcdFx0QGluY3JlbWVudCBkdC8xMDAwXG5cdFx0XHRcdGxhc3QgPSBlbGFwc2VkXG5cdFx0XHRcdGlmIEB0ID4gNC41IHRoZW4gQHNldFQgMFxuXHRcdFx0XHRAcm9vdFNjb3BlLiRldmFsQXN5bmMoKVxuXHRcdFx0XHRAcGF1c2VkXG5cdFx0XHQsIDFcblxuXHRwYXVzZTogLT4gQHBhdXNlZCA9IHRydWVcblxubW9kdWxlLmV4cG9ydHMgPSBbJyRyb290U2NvcGUnLCBTZXJ2aWNlXSIsInRlbXBsYXRlID0gJycnXG5cdDxjaXJjbGUgY2xhc3M9J2RvdCBsYXJnZSc+PC9jaXJjbGU+XG5cdDxjaXJjbGUgY2xhc3M9J2RvdCBzbWFsbCcgcj0nNCc+PC9jaXJjbGU+XG4nJydcblxuY2xhc3MgQ3RybFxuXHRjb25zdHJ1Y3RvcjogKEBzY29wZSwgQGVsLCBAZmFrZUNhcnQsIEBEYXRhKS0+XG5cdFx0cmFkID0gNyAjdGhlIHJhZGl1cyBvZiB0aGUgbGFyZ2UgY2lyY2xlIG5hdHVyYWxseVxuXHRcdHNlbCA9IGQzLnNlbGVjdCBAZWxbMF1cblx0XHRiaWcgPSBzZWwuc2VsZWN0ICdjaXJjbGUuZG90LmxhcmdlJ1xuXHRcdFx0LmF0dHIgJ3InLCByYWRcblx0XHRjaXJjID0gc2VsLnNlbGVjdCAnY2lyY2xlLmRvdC5zbWFsbCdcblxuXHRcdGJpZy5vbiAnbW91c2VvdmVyJywgQG1vdXNlb3ZlclxuXHRcdFx0Lm9uICdjb250ZXh0bWVudScsIC0+IFxuXHRcdFx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpXG5cdFx0XHRcdGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpXG5cdFx0XHQub24gJ21vdXNlZG93bicsIC0+XG5cdFx0XHRcdGJpZy50cmFuc2l0aW9uICdncm93J1xuXHRcdFx0XHRcdC5kdXJhdGlvbiAxNTBcblx0XHRcdFx0XHQuZWFzZSAnY3ViaWMnXG5cdFx0XHRcdFx0LmF0dHIgJ3InLCByYWQqMS43XG5cdFx0XHQub24gJ21vdXNldXAnLCAtPlxuXHRcdFx0XHRiaWcudHJhbnNpdGlvbiAnZ3Jvdydcblx0XHRcdFx0XHQuZHVyYXRpb24gMTUwXG5cdFx0XHRcdFx0LmVhc2UgJ2N1YmljLWluJ1xuXHRcdFx0XHRcdC5hdHRyICdyJywgcmFkKjEuM1xuXHRcdFx0Lm9uICdtb3VzZW91dCcgLCBAbW91c2VvdXRcblxuXHRcdEBzY29wZS4kd2F0Y2ggPT5cblx0XHRcdFx0KEBmYWtlQ2FydC5zZWxlY3RlZCA9PSBAZG90KSBhbmQgKEBEYXRhLnNob3cpXG5cdFx0XHQsICh2LCBvbGQpLT5cblx0XHRcdFx0aWYgdlxuXHRcdFx0XHRcdGJpZy50cmFuc2l0aW9uICdncm93J1xuXHRcdFx0XHRcdFx0LmR1cmF0aW9uIDE1MFxuXHRcdFx0XHRcdFx0LmVhc2UgJ2N1YmljLW91dCdcblx0XHRcdFx0XHRcdC5hdHRyICdyJyAsIHJhZCAqIDEuNVxuXHRcdFx0XHRcdFx0LnRyYW5zaXRpb24oKVxuXHRcdFx0XHRcdFx0LmR1cmF0aW9uIDE1MFxuXHRcdFx0XHRcdFx0LmVhc2UgJ2N1YmljLWluJ1xuXHRcdFx0XHRcdFx0LmF0dHIgJ3InICwgcmFkICogMS4zXG5cblx0XHRcdFx0XHRjaXJjLnRyYW5zaXRpb24oKVxuXHRcdFx0XHRcdFx0LmR1cmF0aW9uIDE1MFxuXHRcdFx0XHRcdFx0LmVhc2UgJ2N1YmljLW91dCdcblx0XHRcdFx0XHRcdC5zdHlsZVxuXHRcdFx0XHRcdFx0XHQnc3Ryb2tlLXdpZHRoJzogMi41XG5cdFx0XHRcdGVsc2UgXG5cdFx0XHRcdFx0YmlnLnRyYW5zaXRpb24gJ3Nocmluaydcblx0XHRcdFx0XHRcdC5kdXJhdGlvbiAzNTBcblx0XHRcdFx0XHRcdC5lYXNlICdib3VuY2Utb3V0J1xuXHRcdFx0XHRcdFx0LmF0dHIgJ3InICwgcmFkXG5cblx0XHRcdFx0XHRjaXJjLnRyYW5zaXRpb24oKVxuXHRcdFx0XHRcdFx0LmR1cmF0aW9uIDEwMFxuXHRcdFx0XHRcdFx0LmVhc2UgJ2N1YmljJ1xuXHRcdFx0XHRcdFx0LnN0eWxlXG5cdFx0XHRcdFx0XHRcdCdzdHJva2Utd2lkdGgnOiAxLjZcblx0XHRcdFx0XHRcdFx0c3Ryb2tlOiAnd2hpdGUnXG5cdFx0XHQgXG5cdG1vdXNlb3V0OiA9PlxuXHRcdEBEYXRhLnNldF9zaG93IGZhbHNlXG5cdFx0QHNjb3BlLiRldmFsQXN5bmMoKVxuXG5cdG1vdXNlb3ZlcjogPT5cblx0XHRAZmFrZUNhcnQuc2VsZWN0X2RvdCBAZG90XG5cdFx0QERhdGEuc2V0X3Nob3cgdHJ1ZVxuXHRcdEBzY29wZS4kZXZhbEFzeW5jKClcblxuZGVyID0gKCktPlxuXHRkaXJlY3RpdmUgPSBcblx0XHR0ZW1wbGF0ZTogdGVtcGxhdGVcblx0XHRjb250cm9sbGVyQXM6ICd2bSdcblx0XHRzY29wZTogXG5cdFx0XHRkb3Q6ICc9ZG90QURlcidcblx0XHRiaW5kVG9Db250cm9sbGVyOiB0cnVlXG5cdFx0Y29udHJvbGxlcjogWyckc2NvcGUnLCckZWxlbWVudCcsICdmYWtlQ2FydCcsICdkZXNpZ25EYXRhJywgQ3RybF1cblx0XHRyZXN0cmljdDogJ0EnXG5cblxubW9kdWxlLmV4cG9ydHMgPSBkZXJcbiIsIkRhdGEgPSByZXF1aXJlICcuL2Rlc2lnbkRhdGEnXG5cbnRlbXBsYXRlID0gJycnXG5cdDxjaXJjbGUgY2xhc3M9J2RvdCBzbWFsbCcgcj0nNCc+PC9jaXJjbGU+XG4nJydcblxuY2xhc3MgQ3RybFxuXHRjb25zdHJ1Y3RvcjogKEBzY29wZSwgQGVsLCBAZmFrZUNhcnQsIEBEYXRhKS0+XG5cdFx0Y2lyYyA9IGQzLnNlbGVjdCBAZWxbMF1cblxuXHRcdGNpcmMub24gJ21vdXNlb3ZlcicsQG1vdXNlb3ZlclxuXHRcdFx0Lm9uICdtb3VzZW91dCcgLCBAbW91c2VvdXRcblx0XHRcdCMgLm9uICdjb250ZXh0bWVudScsIC0+IFxuXHRcdFx0IyBcdGV2ZW50LnByZXZlbnREZWZhdWx0KClcblx0XHRcdCMgXHRldmVudC5zdG9wUHJvcGFnYXRpb24oKVxuXG5cdFx0QHNjb3BlLiR3YXRjaCA9PlxuXHRcdFx0XHQoRGF0YS5zZWxlY3RlZCA9PSBAZG90KSBhbmQgKERhdGEuc2hvdylcblx0XHRcdCwgKHYsIG9sZCktPlxuXHRcdFx0XHRpZiB2ID09IG9sZCB0aGVuIHJldHVyblxuXHRcdFx0XHRpZiB2XG5cdFx0XHRcdFx0Y2lyYy50cmFuc2l0aW9uKClcblx0XHRcdFx0XHRcdC5kdXJhdGlvbiAxNTBcblx0XHRcdFx0XHRcdC5lYXNlICdjdWJpYy1vdXQnXG5cdFx0XHRcdFx0XHQuc3R5bGVcblx0XHRcdFx0XHRcdFx0J3N0cm9rZS13aWR0aCc6IDIuNVxuXHRcdFx0XHRlbHNlIFxuXHRcdFx0XHRcdGNpcmMudHJhbnNpdGlvbigpXG5cdFx0XHRcdFx0XHQuZHVyYXRpb24gMTAwXG5cdFx0XHRcdFx0XHQuZWFzZSAnY3ViaWMnXG5cdFx0XHRcdFx0XHQuc3R5bGVcblx0XHRcdFx0XHRcdFx0J3N0cm9rZS13aWR0aCc6IDEuNlxuXHRcdFx0XHRcdFx0XHRzdHJva2U6ICd3aGl0ZSdcblx0XHRcdCBcblx0bW91c2VvdXQ6ID0+XG5cdFx0QERhdGEuc2V0X3Nob3cgZmFsc2Vcblx0XHRAc2NvcGUuJGV2YWxBc3luYygpXG5cblx0bW91c2VvdmVyOiA9PlxuXHRcdEBmYWtlQ2FydC5zZWxlY3RfZG90IEBkb3Rcblx0XHRARGF0YS5zZXRfc2hvdyB0cnVlXG5cdFx0QHNjb3BlLiRldmFsQXN5bmMoKVxuXG5kZXIgPSAoKS0+XG5cdGRpcmVjdGl2ZSA9IFxuXHRcdHRlbXBsYXRlOiB0ZW1wbGF0ZVxuXHRcdGNvbnRyb2xsZXJBczogJ3ZtJ1xuXHRcdHNjb3BlOiBcblx0XHRcdGRvdDogJz1kb3RCRGVyJ1xuXHRcdGJpbmRUb0NvbnRyb2xsZXI6IHRydWVcblx0XHRjb250cm9sbGVyOiBbJyRzY29wZScsJyRlbGVtZW50JywgJ2Zha2VDYXJ0JywgJ2Rlc2lnbkRhdGEnLCBDdHJsXVxuXHRcdHJlc3RyaWN0OiAnQSdcblxuXG5tb2R1bGUuZXhwb3J0cyA9IGRlclxuIiwicmVxdWlyZSAnLi4vLi4vaGVscGVycydcbl8gPSByZXF1aXJlICdsb2Rhc2gnXG5kZWxUID0gLjAyNVxuY2xhc3MgRG90XG5cdGNvbnN0cnVjdG9yOiAoQHQsIEB2KS0+XG5cdFx0QGlkID0gXy51bmlxdWVJZCAnZG90J1xuXHRcdEBkdiA9IDBcblxuXHR1cGRhdGU6ICh0LHYpLT5cblx0XHRAdCA9IHRcblx0XHRAdiA9IHZcblxuY2xhc3MgU2VydmljZVxuXHRjb25zdHJ1Y3RvcjooQERhdGEpIC0+XG5cdFx0QGNvcnJlY3QgPSBmYWxzZVxuXHRcdGZpcnN0RG90ID0gbmV3IERvdCAwICwgMlxuXHRcdGZpcnN0RG90LmlkID0gJ2ZpcnN0J1xuXHRcdEBkb3RzID0gW2ZpcnN0RG90XVxuXHRcdEB0cmFqZWN0b3J5ID0gXy5yYW5nZSAwLCA1ICwgZGVsVFxuXHRcdFx0Lm1hcCAodCktPlxuXHRcdFx0XHRyZXMgPSBcblx0XHRcdFx0XHR0OiB0XG5cdFx0XHRcdFx0djogMFxuXHRcdFx0XHRcdHg6IDBcblx0XHRfLnJhbmdlIC41LCAyLjUsIC41XG5cdFx0XHQuZm9yRWFjaCAodCk9PlxuXHRcdFx0XHRAZG90cy5wdXNoIG5ldyBEb3QgdCwgMipNYXRoLmV4cCgtLjgqdClcblxuXHRcdGxhc3REb3QgPSBuZXcgRG90IDYgLCBAZG90c1tAZG90cy5sZW5ndGggLSAxXS52XG5cdFx0bGFzdERvdC5pZCA9ICdsYXN0J1xuXHRcdEBkb3RzLnB1c2ggbGFzdERvdFxuXHRcdEBzZWxlY3RfZG90IEBkb3RzWzFdXG5cdFx0QHVwZGF0ZSgpXG5cblx0c2VsZWN0X2RvdDogKGRvdCktPlxuXHRcdEBzZWxlY3RlZCA9IGRvdFxuXG5cdGFkZF9kb3Q6ICh0LCB2KS0+XG5cdFx0bmV3RG90ID0gbmV3IERvdCB0LHZcblx0XHRAZG90cy5wdXNoIG5ld0RvdFxuXHRcdEB1cGRhdGVfZG90IG5ld0RvdCwgdCwgdlxuXG5cdHJlbW92ZV9kb3Q6IChkb3QpLT5cblx0XHRAZG90cy5zcGxpY2UgQGRvdHMuaW5kZXhPZihkb3QpLCAxXG5cdFx0QHVwZGF0ZSgpXG5cblx0bG9jOiAodCktPiBAdHJhamVjdG9yeVtNYXRoLmZsb29yKHQvZGVsVCldLnhcblxuXHRAcHJvcGVydHkgJ3gnLCBnZXQ6IC0+IEBsb2MgQERhdGEudFxuXG5cdEBwcm9wZXJ0eSAndicsIGdldDogLT4gQHRyYWplY3RvcnlbTWF0aC5mbG9vcihARGF0YS50L2RlbFQpXS52XG5cblx0QHByb3BlcnR5ICdkdicsIGdldDogLT4gQHRyYWplY3RvcnlbTWF0aC5mbG9vcihARGF0YS50L2RlbFQpXS5kdlxuXG5cdHVwZGF0ZTogLT4gXG5cdFx0QGRvdHMuc29ydCAoYSxiKS0+IGEudCAtIGIudFxuXHRcdEBkb3RzLmZvckVhY2ggKGRvdCwgaSwgayktPlxuXHRcdFx0cHJldiA9IGtbaS0xXVxuXHRcdFx0aWYgZG90LmlkID09ICdsYXN0J1xuXHRcdFx0XHRkb3QudiA9IHByZXYudlxuXHRcdFx0XHRyZXR1cm5cblx0XHRcdGlmIHByZXZcblx0XHRcdFx0ZHQgPSBkb3QudCAtIHByZXYudFxuXHRcdFx0XHRkb3QueCA9IHByZXYueCArIGR0ICogKGRvdC52ICsgcHJldi52KS8yXG5cdFx0XHRcdGRvdC5kdiA9IChkb3QudiAtIHByZXYudikvTWF0aC5tYXgoZHQsIC4wMDAxKVxuXHRcdFx0ZWxzZVxuXHRcdFx0XHRkb3QueCA9IDBcblx0XHRcdFx0ZG90LmR2ID0gMFxuXG5cdFx0QGRvdHMuZm9yRWFjaCAoZG90LGksayk9PlxuXHRcdFx0XHRhID0gQGRvdHNbaS0xXVxuXHRcdFx0XHRpZiAhYSB0aGVuIHJldHVyblxuXHRcdFx0XHRkdiA9IGRvdC5kdlxuXHRcdFx0XHRAdHJhamVjdG9yeVxuXHRcdFx0XHRcdC5zbGljZShNYXRoLmZsb29yKGEudC9kZWxUKSwgTWF0aC5mbG9vcihkb3QudC9kZWxUKSlcblx0XHRcdFx0XHQuZm9yRWFjaCAoZCktPlxuXHRcdFx0XHRcdFx0ZHQgPSBkLnQgLSBhLnRcblx0XHRcdFx0XHRcdGQueCA9IGEueCArIGEudiAqIGR0ICsgMC41KmR2ICogZHQqKjJcblx0XHRcdFx0XHRcdGQudiA9IGEudiArIGR2ICogZHRcblxuXHR1cGRhdGVfZG90OiAoZG90LCB0LCB2KS0+XG5cdFx0aWYgZG90LmlkID09ICdmaXJzdCcgdGhlbiByZXR1cm5cblx0XHRAc2VsZWN0X2RvdCBkb3Rcblx0XHRkb3QudXBkYXRlIHQsdlxuXHRcdEB1cGRhdGUoKVxuXHRcdEBjb3JyZWN0ID0gTWF0aC5hYnMoIC0uOCAqIGRvdC52ICsgZG90LmR2KSA8IDAuMDVcblxuXG5tb2R1bGUuZXhwb3J0cyA9IFsnZGVzaWduRGF0YScgLCBTZXJ2aWNlXSIsIkRhdGEgPSByZXF1aXJlICcuL2Rlc2lnbkRhdGEnXG5fID0gcmVxdWlyZSAnbG9kYXNoJ1xucmVxdWlyZSAnLi4vLi4vaGVscGVycydcbmRlbFQgPSAuMDI1XG5cbmNsYXNzIFNlcnZpY2Vcblx0Y29uc3RydWN0b3I6IChARGF0YSktPlxuXHRcdEB0cmFqZWN0b3J5ID0gXy5yYW5nZSAwLCA0LjUgLCBkZWxUXG5cdFx0XHQubWFwICh0KS0+XG5cdFx0XHRcdHQ6IHRcblx0XHRcdFx0eDogMi8uOCAqICgxLU1hdGguZXhwKC0uOCp0KSlcblx0XHRcdFx0djogMipNYXRoLmV4cCAtLjgqdFxuXHRcdFx0XHRkdjogLS44KjIqTWF0aC5leHAgLS44KnRcblxuXHRsb2M6ICh0KS0+XHQyLy44ICogKDEtTWF0aC5leHAoLS44KnQpKVxuXG5cdEBwcm9wZXJ0eSAneCcsIGdldDotPiBAbG9jIEBEYXRhLnRcblxuXHRAcHJvcGVydHkgJ3YnLCBnZXQ6LT4gMiogTWF0aC5leHAoLS44KkBEYXRhLnQpXG5cblx0QHByb3BlcnR5ICdkdicsIGdldDotPiAtLjgqMiogTWF0aC5leHAoLS44KkBEYXRhLnQpXG5cbm1vZHVsZS5leHBvcnRzID0gWydkZXNpZ25EYXRhJywgU2VydmljZV0iLCJkcmFnID0gKCRwYXJzZSktPlxuXHRkaXJlY3RpdmUgPSBcblx0XHRsaW5rOiAoc2NvcGUsZWwsYXR0ciktPlxuXHRcdFx0c2VsID0gZDMuc2VsZWN0KGVsWzBdKVxuXHRcdFx0c2VsLmNhbGwoJHBhcnNlKGF0dHIuYmVoYXZpb3IpKHNjb3BlKSlcblxubW9kdWxlLmV4cG9ydHMgPSBkcmFnIiwidGVtcGxhdGUgPSAnJydcblx0PGRlZnM+XG5cdFx0PGNsaXBwYXRoIG5nLWF0dHItaWQ9J3t7Ojp2bS5uYW1lfX0nPlxuXHRcdFx0PHJlY3QgbmctYXR0ci13aWR0aD0ne3t2bS53aWR0aH19JyBuZy1hdHRyLWhlaWdodD0ne3t2bS5oZWlnaHR9fScgLz5cblx0XHQ8L2NsaXBwYXRoPlxuXHQ8L2RlZnM+XG5cdDxnIGNsYXNzPSdib2lsZXJwbGF0ZScgc2hpZnRlcj0ne3s6Olt2bS5tYXIubGVmdCwgdm0ubWFyLnRvcF19fSc+XG5cdFx0PHJlY3QgY2xhc3M9J2JhY2tncm91bmQnIG5nLWF0dHItd2lkdGg9J3t7dm0ud2lkdGh9fScgbmctYXR0ci1oZWlnaHQ9J3t7dm0uaGVpZ2h0fX0nIC8+XG5cdFx0PGcgdmVyLWF4aXMtZGVyIHdpZHRoPSd2bS53aWR0aCcgc2NhbGU9J3ZtLnZlcicgZnVuPSd2bS52ZXJBeEZ1bic+PC9nPlxuXHRcdDxnIGhvci1heGlzLWRlciBoZWlnaHQ9J3ZtLmhlaWdodCcgc2NhbGU9J3ZtLmhvcicgZnVuPSd2bS5ob3JBeEZ1bicgc2hpZnRlcj0nWzAsdm0uaGVpZ2h0XSc+PC9nPlxuXHQ8L2c+XG4nJydcblxuZGVyID0gLT5cblx0ZGlyZWN0aXZlID0gXG5cdFx0Y29udHJvbGxlcjogWyckc2NvcGUnLCAoQHNjb3BlKSAtPl1cblx0XHRjb250cm9sbGVyQXM6ICd2bSdcblx0XHRiaW5kVG9Db250cm9sbGVyOiB0cnVlXG5cdFx0c2NvcGU6IFxuXHRcdFx0d2lkdGg6ICc9J1xuXHRcdFx0aGVpZ2h0OiAnPSdcblx0XHRcdHZlckF4RnVuOiAnPSdcblx0XHRcdGhvckF4RnVuOiAnPSdcblx0XHRcdG1hcjogJz0nXG5cdFx0XHR2ZXI6ICc9J1xuXHRcdFx0aG9yOiAnPSdcblx0XHRcdG5hbWU6ICc9J1xuXHRcdHRlbXBsYXRlOiB0ZW1wbGF0ZVxuXHRcdHRlbXBsYXRlTmFtZXNwYWNlOiAnc3ZnJ1xuXG5tb2R1bGUuZXhwb3J0cyA9IGRlciIsIl8gPSByZXF1aXJlICdsb2Rhc2gnXG5kMz0gcmVxdWlyZSAnZDMnXG5yZXF1aXJlICcuLi9oZWxwZXJzJ1xuUGxvdEN0cmwgPSByZXF1aXJlICcuL3Bsb3RDdHJsJ1xuXG50ZW1wbGF0ZSA9ICcnJ1xuXHQ8c3ZnIG5nLWluaXQ9J3ZtLnJlc2l6ZSgpJyBuZy1hdHRyLWhlaWdodD1cInt7dm0uc3ZnSGVpZ2h0fX1cIj5cblx0XHQ8ZGVmcz5cblx0XHRcdDxjbGlwcGF0aCBpZD0nY2FydFNpbSc+XG5cdFx0XHRcdDxyZWN0IGQzLWRlcj0ne3dpZHRoOiB2bS53aWR0aCwgaGVpZ2h0OiB2bS5oZWlnaHR9JyAvPlxuXHRcdFx0PC9jbGlwcGF0aD5cblx0XHQ8L2RlZnM+XG5cdFx0PGcgY2xhc3M9J2JvaWxlcnBsYXRlJyBzaGlmdGVyPSd7ezo6W3ZtLm1hci5sZWZ0LCB2bS5tYXIudG9wXX19JyA+XG5cdFx0XHQ8cmVjdCBkMy1kZXI9J3t3aWR0aDogdm0ud2lkdGgsIGhlaWdodDogdm0uaGVpZ2h0fScgY2xhc3M9J2JhY2tncm91bmQnLz5cblx0XHRcdDxnIGhvci1heGlzLWRlciBoZWlnaHQ9J3ZtLmhlaWdodCcgZnVuPSd2bS5ob3JBeEZ1bicgc2hpZnRlcj0nWzAsdm0uaGVpZ2h0XSc+PC9nPlxuXHRcdFx0PGZvcmVpZ25PYmplY3Qgd2lkdGg9JzMwJyBoZWlnaHQ9JzMwJyB5PScyMCcgc2hpZnRlcj0nW3ZtLndpZHRoLzIsIHZtLmhlaWdodF0nPlxuXHRcdFx0XHRcdDx0ZXh0IGNsYXNzPSdsYWJlbCcgPiR4JDwvdGV4dD5cblx0XHRcdDwvZm9yZWlnbk9iamVjdD5cblx0XHQ8L2c+XG5cdFx0PGcgc2hpZnRlcj0ne3s6Olt2bS5tYXIubGVmdCwgdm0ubWFyLnRvcF19fScgY2xpcC1wYXRoPVwidXJsKCNjYXJ0U2ltKVwiID5cblx0XHRcdDxmb3JlaWduT2JqZWN0IHdpZHRoPSczMCcgaGVpZ2h0PSczMCcgeT0nMjAnIHNoaWZ0ZXI9J1t2bS53aWR0aC8yLCB2bS5oZWlnaHRdJz5cblx0XHRcdFx0XHQ8dGV4dCBjbGFzcz0nbGFiZWwnID4kdCQ8L3RleHQ+XG5cdFx0XHQ8L2ZvcmVpZ25PYmplY3Q+XG5cdFx0XHQ8ZyBuZy1yZXBlYXQ9J3QgaW4gdm0uc2FtcGxlJyBkMy1kZXI9J3t0cmFuc2Zvcm06IFwidHJhbnNsYXRlKFwiICsgdm0uSG9yKHZtLmRhdGEubG9jKHQpKSArIFwiLDApXCJ9Jz5cblx0XHRcdFx0PGxpbmUgY2xhc3M9J3RpbWUtbGluZScgZDMtZGVyPSd7eDE6IDAsIHgyOiAwLCB5MTogMCwgeTI6IDYwfScgLz5cblx0XHRcdDwvZz5cblx0XHRcdDxnIGNsYXNzPSdnLWNhcnQnIGNhcnQtb2JqZWN0LWRlciBsZWZ0PSd2bS5Ib3Iodm0uZGF0YS54KScgdG9wPSd2bS5oZWlnaHQnIHNpemU9J3ZtLnNpemUnPjwvZz5cblx0XHQ8L2c+XG5cdDwvc3ZnPlxuJycnXG5cbmNsYXNzIEN0cmwgZXh0ZW5kcyBQbG90Q3RybFxuXHRjb25zdHJ1Y3RvcjogKEBzY29wZSwgQGVsLCBAd2luZG93KS0+XG5cdFx0c3VwZXIgQHNjb3BlLCBAZWwsIEB3aW5kb3dcblxuXHRcdEBIb3IuZG9tYWluIFstLjEsM11cblxuXHRcdEBzY29wZS4kd2F0Y2ggJ3ZtLm1heCcsID0+XG5cdFx0XHRASG9yLmRvbWFpbiBbLS4xLCBAbWF4XVxuXG5cdHRyYW46ICh0cmFuKS0+XG5cdFx0dHJhbi5lYXNlICdsaW5lYXInXG5cdFx0XHQuZHVyYXRpb24gNjBcblxuXHRAcHJvcGVydHkgJ3NpemUnLCBnZXQ6IC0+IChASG9yKDAuNCkgLSBASG9yKDApKS84MFxuXG5kZXIgPSAtPlxuXHRkaXJlY3RpdmUgPSBcblx0XHR0ZW1wbGF0ZTogdGVtcGxhdGVcblx0XHRzY29wZTogXG5cdFx0XHRkYXRhOiAnPSdcblx0XHRcdG1heDogJz0nXG5cdFx0XHRzYW1wbGU6ICc9J1xuXHRcdHJlc3RyaWN0OiAnQSdcblx0XHRiaW5kVG9Db250cm9sbGVyOiB0cnVlXG5cdFx0dHJhbnNjbHVkZTogdHJ1ZVxuXHRcdHRlbXBsYXRlTmFtZXNwYWNlOiAnc3ZnJ1xuXHRcdGNvbnRyb2xsZXI6IFsnJHNjb3BlJywgJyRlbGVtZW50JywgJyR3aW5kb3cnLCBDdHJsXVxuXHRcdGNvbnRyb2xsZXJBczogJ3ZtJ1xuXG5tb2R1bGUuZXhwb3J0cyA9IGRlclxuIiwiZDMgPSByZXF1aXJlICdkMydcbmFuZ3VsYXIgPSByZXF1aXJlICdhbmd1bGFyJ1xuXG5kZXIgPSAoJHBhcnNlKS0+ICNnb2VzIG9uIGEgc3ZnIGVsZW1lbnRcblx0ZGlyZWN0aXZlID0gXG5cdFx0cmVzdHJpY3Q6ICdBJ1xuXHRcdHNjb3BlOiBcblx0XHRcdGQzRGVyOiAnPSdcblx0XHRcdHRyYW46ICc9J1xuXHRcdGxpbms6IChzY29wZSwgZWwsIGF0dHIpLT5cblx0XHRcdHNlbCA9IGQzLnNlbGVjdCBlbFswXVxuXHRcdFx0dSA9ICd0LScgKyBNYXRoLnJhbmRvbSgpXG5cdFx0XHRzY29wZS4kd2F0Y2ggJ2QzRGVyJ1xuXHRcdFx0XHQsICh2KS0+XG5cdFx0XHRcdFx0aWYgc2NvcGUudHJhblxuXHRcdFx0XHRcdFx0c2VsLnRyYW5zaXRpb24gdVxuXHRcdFx0XHRcdFx0XHQuYXR0ciB2XG5cdFx0XHRcdFx0XHRcdC5jYWxsIHNjb3BlLnRyYW5cblx0XHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0XHRzZWwuYXR0ciB2XG5cblx0XHRcdFx0LCB0cnVlXG5tb2R1bGUuZXhwb3J0cyA9IGRlciIsIm1vZHVsZS5leHBvcnRzID0gKCRwYXJzZSktPlxuXHQoc2NvcGUsIGVsLCBhdHRyKS0+XG5cdFx0ZDMuc2VsZWN0KGVsWzBdKS5kYXR1bSAkcGFyc2UoYXR0ci5kYXR1bSkoc2NvcGUpIiwiZDMgPSByZXF1aXJlICdkMydcblxuY2xhc3MgQ3RybFxuXHRjb25zdHJ1Y3RvcjogKEBzY29wZSwgQGVsLCBAd2luZG93KS0+XG5cdFx0QG1hciA9IFxuXHRcdFx0bGVmdDogMzBcblx0XHRcdHRvcDogMjBcblx0XHRcdHJpZ2h0OiAyMFxuXHRcdFx0Ym90dG9tOiAzNVxuXG5cdFx0QFZlciA9ZDMuc2NhbGUubGluZWFyKClcblx0XHRcblx0XHRASG9yID0gZDMuc2NhbGUubGluZWFyKClcblxuXHRcdEBob3JBeEZ1biA9IGQzLnN2Zy5heGlzKClcblx0XHRcdC5zY2FsZSBASG9yXG5cdFx0XHQudGlja3MgNVxuXHRcdFx0Lm9yaWVudCAnYm90dG9tJ1xuXG5cdFx0QHZlckF4RnVuID0gZDMuc3ZnLmF4aXMoKVxuXHRcdFx0LnNjYWxlIEBWZXJcblx0XHRcdCMgLnRpY2tGb3JtYXQgKGQpLT5cblx0XHRcdCMgXHRpZiBNYXRoLmZsb29yKCBkICkgIT0gZCB0aGVuIHJldHVyblxuXHRcdFx0IyBcdGRcblx0XHRcdC50aWNrcyA1XG5cdFx0XHQub3JpZW50ICdsZWZ0J1xuXG5cdFx0QGxpbmVGdW4gPSBkMy5zdmcubGluZSgpXG5cblx0XHRhbmd1bGFyLmVsZW1lbnQgQHdpbmRvd1xuXHRcdFx0Lm9uICdyZXNpemUnLCBAcmVzaXplXG5cblx0QHByb3BlcnR5ICdzdmdfaGVpZ2h0JywgZ2V0OiAtPiBAaGVpZ2h0ICsgQG1hci50b3AgKyBAbWFyLmJvdHRvbVxuXG5cdHJlc2l6ZTogPT5cblx0XHRAd2lkdGggPSBAZWxbMF0uY2xpZW50V2lkdGggLSBAbWFyLmxlZnQgLSBAbWFyLnJpZ2h0XG5cdFx0QGhlaWdodCA9IEBlbFswXS5jbGllbnRIZWlnaHQgLSBAbWFyLnRvcCAtIEBtYXIuYm90dG9tXG5cdFx0QFZlci5yYW5nZSBbQGhlaWdodCwgMF1cblx0XHRASG9yLnJhbmdlIFswLCBAd2lkdGhdXG5cdFx0QHNjb3BlLiRldmFsQXN5bmMoKVxuXG5cbm1vZHVsZS5leHBvcnRzID0gQ3RybCIsImQzID0gcmVxdWlyZSAnZDMnXG5cbmRlciA9ICgkcGFyc2UpLT5cblx0ZGlyZWN0aXZlID1cblx0XHRsaW5rOiAoc2NvcGUsIGVsLCBhdHRyKS0+XG5cdFx0XHRyZXNoaWZ0ID0gKHYpLT4gXG5cdFx0XHRcdGQzLnNlbGVjdCBlbFswXVxuXHRcdFx0XHRcdC5hdHRyICd0cmFuc2Zvcm0nICwgXCJ0cmFuc2xhdGUoI3t2WzBdfSwje3ZbMV19KVwiXG5cblx0XHRcdHNjb3BlLiR3YXRjaCAtPlxuXHRcdFx0XHRcdCRwYXJzZShhdHRyLnNoaWZ0ZXIpKHNjb3BlKVxuXHRcdFx0XHQsIHJlc2hpZnRcblx0XHRcdFx0LCB0cnVlXG5cbm1vZHVsZS5leHBvcnRzID0gZGVyIiwiYW5ndWxhciA9IHJlcXVpcmUgJ2FuZ3VsYXInXG5kMyA9IHJlcXVpcmUgJ2QzJ1xudGV4dHVyZXMgPSByZXF1aXJlICd0ZXh0dXJlcydcblxuY2xhc3MgQ3RybFxuXHRjb25zdHJ1Y3RvcjogKEBzY29wZSwgQGVsLCBAd2luZG93KS0+XG5cdFx0dCA9IHRleHR1cmVzLmxpbmVzKClcblx0XHRcdC5vcmllbnRhdGlvbiBcIjMvOFwiLCBcIjcvOFwiXG5cdFx0XHQuc2l6ZSA0XG5cdFx0XHQuc3Ryb2tlKCcjRTZFNkU2Jylcblx0XHQgICAgLnN0cm9rZVdpZHRoIC42XG5cblx0XHR0LmlkICdteVRleHR1cmUnXG5cblx0XHRkMy5zZWxlY3QgQGVsWzBdXG5cdFx0XHQuc2VsZWN0ICdzdmcnXG5cdFx0XHQuY2FsbCB0XG5cbmRlciA9IC0+XG5cdGRpcmVjdGl2ZSA9IFxuXHRcdGNvbnRyb2xsZXJBczogJ3ZtJ1xuXHRcdHNjb3BlOiB7fVxuXHRcdHRlbXBsYXRlOiAnPHN2ZyBoZWlnaHQ9XCIwcHhcIiBzdHlsZT1cInBvc2l0aW9uOiBhYnNvbHV0ZTtcIiB3aWR0aD1cIjBweFwiPjwvc3ZnPidcblx0XHR0ZW1wbGF0ZU5hbWVzcGFjZTogJ3N2Zydcblx0XHRjb250cm9sbGVyOiBbJyRzY29wZScsJyRlbGVtZW50JywgJyR3aW5kb3cnLCBDdHJsXVxuXG5tb2R1bGUuZXhwb3J0cyA9IGRlclxuIiwiZDMgPSByZXF1aXJlICdkMydcbmFuZ3VsYXIgPSByZXF1aXJlICdhbmd1bGFyJ1xuXG5kZXIgPSAoJHdpbmRvdyktPlxuXHRkaXJlY3RpdmUgPSBcblx0XHRjb250cm9sbGVyOiBhbmd1bGFyLm5vb3Bcblx0XHRjb250cm9sbGVyQXM6ICd2bSdcblx0XHRiaW5kVG9Db250cm9sbGVyOiB0cnVlXG5cdFx0cmVzdHJpY3Q6ICdBJ1xuXHRcdHRlbXBsYXRlTmFtZXNwYWNlOiAnc3ZnJ1xuXHRcdHNjb3BlOiBcblx0XHRcdGhlaWdodDogJz0nXG5cdFx0XHRmdW46ICc9J1xuXHRcdGxpbms6IChzY29wZSwgZWwsIGF0dHIsIHZtKS0+XG5cdFx0XHRzY2FsZSA9IHZtLmZ1bi5zY2FsZSgpXG5cblx0XHRcdHNlbCA9IGQzLnNlbGVjdCBlbFswXVxuXHRcdFx0XHQuY2xhc3NlZCAneCBheGlzJywgdHJ1ZVxuXG5cdFx0XHR1cGRhdGUgPSA9PlxuXHRcdFx0XHR2bS5mdW4udGlja1NpemUgLXZtLmhlaWdodFxuXHRcdFx0XHRzZWwuY2FsbCB2bS5mdW5cblx0XHRcdFx0XG5cdFx0XHRzY29wZS4kd2F0Y2ggLT5cblx0XHRcdFx0W3NjYWxlLmRvbWFpbigpLCBzY2FsZS5yYW5nZSgpICx2bS5oZWlnaHRdXG5cdFx0XHQsIHVwZGF0ZVxuXHRcdFx0LCB0cnVlXG5cblxubW9kdWxlLmV4cG9ydHMgPSBkZXIiLCJkMyA9IHJlcXVpcmUgJ2QzJ1xuYW5ndWxhciA9IHJlcXVpcmUgJ2FuZ3VsYXInXG5cbmRlciA9ICgkd2luZG93KS0+XG5cdGRpcmVjdGl2ZSA9IFxuXHRcdGNvbnRyb2xsZXI6IGFuZ3VsYXIubm9vcFxuXHRcdGNvbnRyb2xsZXJBczogJ3ZtJ1xuXHRcdGJpbmRUb0NvbnRyb2xsZXI6IHRydWVcblx0XHRyZXN0cmljdDogJ0EnXG5cdFx0dGVtcGxhdGVOYW1lc3BhY2U6ICdzdmcnXG5cdFx0c2NvcGU6IFxuXHRcdFx0d2lkdGg6ICc9J1xuXHRcdFx0ZnVuOiAnPSdcblx0XHRsaW5rOiAoc2NvcGUsIGVsLCBhdHRyLCB2bSktPlxuXHRcdFx0c2NhbGUgPSB2bS5mdW4uc2NhbGUoKVxuXG5cdFx0XHRzZWwgPSBkMy5zZWxlY3QoZWxbMF0pLmNsYXNzZWQoJ3kgYXhpcycsIHRydWUpXG5cblx0XHRcdHVwZGF0ZSA9ID0+XG5cdFx0XHRcdHZtLmZ1bi50aWNrU2l6ZSggLXZtLndpZHRoKVxuXHRcdFx0XHRzZWwuY2FsbCB2bS5mdW5cblxuXHRcdFx0c2NvcGUuJHdhdGNoIC0+XG5cdFx0XHRcdCMgY29uc29sZS5sb2cgc2NhbGUucmFuZ2UoKVxuXHRcdFx0XHRbc2NhbGUuZG9tYWluKCksIHNjYWxlLnJhbmdlKCkgLHZtLndpZHRoXVxuXHRcdFx0LCB1cGRhdGVcblx0XHRcdCwgdHJ1ZVxuXG5tb2R1bGUuZXhwb3J0cyA9IGRlciIsIid1c2Ugc3RyaWN0J1xuXG5tb2R1bGUuZXhwb3J0cy50aW1lb3V0ID0gKGZ1biwgdGltZSktPlxuXHRcdGQzLnRpbWVyKCgpPT5cblx0XHRcdGZ1bigpXG5cdFx0XHR0cnVlXG5cdFx0LHRpbWUpXG5cblxuRnVuY3Rpb246OnByb3BlcnR5ID0gKHByb3AsIGRlc2MpIC0+XG4gIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSBAcHJvdG90eXBlLCBwcm9wLCBkZXNjIl19
