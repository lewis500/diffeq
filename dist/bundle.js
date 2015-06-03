(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';
var angular, app, d3, looper;

angular = require('angular');

d3 = require('d3');

app = angular.module('mainApp', [require('angular-material')]).directive('horAxisDer', require('./directives/xAxis')).directive('verAxisDer', require('./directives/yAxis')).directive('cartSimDer', require('./components/cart/cartSim')).directive('cartObjectDer', require('./components/cart/cartObject')).directive('shifter', require('./directives/shifter')).directive('behavior', require('./directives/behavior')).directive('dotADer', require('./components/design/dotA')).directive('dotBDer', require('./components/design/dotB')).directive('datum', require('./directives/datum')).directive('d3Der', require('./directives/d3Der')).directive('designADer', require('./components/design/designA')).directive('designBDer', require('./components/design/designB')).directive('derivativeADer', require('./components/derivative/derivativeA')).directive('derivativeBDer', require('./components/derivative/derivativeB')).directive('cartPlotDer', require('./components/cart/cartPlot')).directive('designCartADer', require('./components/design/designCartA')).directive('designCartBDer', require('./components/design/designCartB')).directive('textureDer', require('./directives/texture')).directive('boilerplateDer', require('./directives/boilerplate')).directive('cartDer', require('./directives/cartDer')).service('derivativeData', require('./components/derivative/derivativeData')).service('fakeCart', require('./components/design/fakeCart')).service('trueCart', require('./components/design/trueCart')).service('designData', require('./components/design/designData')).service('cartData', require('./components/cart/cartData'));

looper = function() {
  return setTimeout(function() {
    d3.selectAll('circle.dot.large').transition('grow').duration(500).ease('cubic-out').attr('transform', 'scale( 1.34)').transition('shrink').duration(500).ease('cubic-out').attr('transform', 'scale( 1.0)');
    return looper();
  }, 1000);
};

looper();



},{"./components/cart/cartData":2,"./components/cart/cartObject":3,"./components/cart/cartPlot":4,"./components/cart/cartSim":5,"./components/derivative/derivativeA":6,"./components/derivative/derivativeB":7,"./components/derivative/derivativeData":8,"./components/design/designA":9,"./components/design/designB":10,"./components/design/designCartA":11,"./components/design/designCartB":12,"./components/design/designData":13,"./components/design/dotA":14,"./components/design/dotB":15,"./components/design/fakeCart":16,"./components/design/trueCart":17,"./directives/behavior":18,"./directives/boilerplate":19,"./directives/cartDer":20,"./directives/d3Der":21,"./directives/datum":22,"./directives/shifter":24,"./directives/texture":25,"./directives/xAxis":26,"./directives/yAxis":27,"angular":undefined,"angular-material":undefined,"d3":undefined}],2:[function(require,module,exports){
var Service, _, dvFun, vFun, xFun;

_ = require('lodash');

vFun = function(t) {
  return 2 * Math.exp(-.8 * t);
};

dvFun = function(t) {
  return -.8 * 2 * Math.exp(-.8 * t);
};

xFun = function(t) {
  return 2 / .8 * (1 - Math.exp(-.8 * t));
};

Service = (function() {
  function Service($rootScope) {
    this.rootScope = $rootScope;
    this.setT(0);
    this.paused = false;
    this.trajectory = _.range(0, 6, 1 / 10).map(function(t) {
      var res;
      return res = {
        x: xFun(t),
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
      x: xFun(t),
      dv: dvFun(t),
      v: vFun(t),
      t: t
    };
  };

  return Service;

})();

module.exports = Service;



},{"lodash":undefined}],3:[function(require,module,exports){
var Ctrl, der;

Ctrl = (function() {
  function Ctrl(scope) {
    this.scope = scope;
  }

  Ctrl.prototype.trans = function(tran) {
    return tran.duration(200).ease('cubic');
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



},{}],4:[function(require,module,exports){
var Ctrl, PlotCtrl, _, angular, d3, der, template,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

angular = require('angular');

d3 = require('d3');

require('../../helpers');

_ = require('lodash');

PlotCtrl = require('../../directives/plotCtrl');

template = '<svg ng-init=\'vm.resize()\' class=\'bottomChart\' >\n	<g boilerplate-der width=\'vm.width\' height=\'vm.height\' ver-ax-fun=\'vm.verAxFun\' hor-ax-fun=\'vm.horAxFun\' ver=\'vm.Ver\' hor=\'vm.Hor\' mar=\'vm.mar\' name=\'vm.name\'>\n		<foreignObject width=\'30\' height=\'30\' y=\'5\' x=\'-8\' shifter=\'[vm.width, vm.height]\'>\n				<text class=\'label\' >$t$</text>\n		</foreignObject>\n		<foreignObject width=\'30\' height=\'30\' y=\'0\' x=\'-15\' shifter=\'[0, 0]\'>\n				<text class=\'label\' >$v$</text>\n		</foreignObject>\n	</g>\n	<g class=\'main\' ng-attr-clip-path=\'url(#{{vm.name}})\' shifter=\'[vm.mar.left, vm.mar.top]\'>\n\n		<path ng-attr-d=\'{{vm.lineFun(vm.Data.trajectory)}}\' class=\'fun v\' />\n		<line class=\'tri v\' d3-der=\'{x1: vm.Hor(vm.point.t)-1, x2: vm.Hor(vm.point.t)-1, y1: vm.Ver(vm.point.v), y2: vm.Ver(0)}\'/>\n		<foreignObject width=\'30\' height=\'30\' shifter=\'[(vm.Hor(vm.point.t) - 16), vm.Ver(vm.point.v/2)]\'>\n				<text class=\'tri-label\' >$y$</text>\n		</foreignObject>\n		<foreignObject width=\'100\' height=\'30\' shifter=\'[vm.Hor(3.5), vm.Ver(0.4)]\'>\n			<text class=\'tri-label\'>$2e^{-.8t}$</text>\n		</foreignObject>\n		<circle r=\'3px\'  shifter=\'[vm.Hor(vm.point.t), vm.Ver(vm.point.v)]\' class=\'point v\'/>\n		<rect class=\'experiment\' ng-attr-height=\'{{vm.height}}\' ng-attr-width=\'{{vm.width}}\' />\n	</g>\n</svg>';

Ctrl = (function(superClass) {
  extend(Ctrl, superClass);

  function Ctrl(scope1, el1, window, Data) {
    this.scope = scope1;
    this.el = el1;
    this.window = window;
    this.Data = Data;
    this.move = bind(this.move, this);
    Ctrl.__super__.constructor.call(this, this.scope, this.el, this.window);
    this.name = 'cartPlot';
    this.Ver.domain([-.1, 2.3]);
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
    this.Data.play();
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
    controller: ['$scope', '$element', '$window', 'cartData', Ctrl]
  };
};

module.exports = der;



},{"../../directives/plotCtrl":23,"../../helpers":28,"angular":undefined,"d3":undefined,"lodash":undefined}],5:[function(require,module,exports){
var Ctrl, _, der, template;

_ = require('lodash');

require('../../helpers');

template = '<div cart-der data="vm.cartData.point" max="vm.max" sample=\'vm.sample\'></div>';

Ctrl = (function() {
  function Ctrl(scope, cartData) {
    this.scope = scope;
    this.cartData = cartData;
    this.sample = [];
    this.max = 3;
  }

  return Ctrl;

})();

der = function() {
  var directive;
  return directive = {
    scope: {},
    restrict: 'A',
    bindToController: true,
    template: template,
    controller: ['$scope', 'cartData', Ctrl],
    controllerAs: 'vm'
  };
};

module.exports = der;



},{"../../helpers":28,"lodash":undefined}],6:[function(require,module,exports){
var Ctrl, PlotCtrl, _, angular, d3, der, template,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

angular = require('angular');

d3 = require('d3');

require('../../helpers');

_ = require('lodash');

PlotCtrl = require('../../directives/plotCtrl');

template = '<svg ng-init=\'vm.resize()\' class=\'topChart\' >\n	<g boilerplate-der width=\'vm.width\' height=\'vm.height\' ver-ax-fun=\'vm.verAxFun\' hor-ax-fun=\'vm.horAxFun\' ver=\'vm.Ver\' hor=\'vm.Hor\' mar=\'vm.mar\' name=\'vm.name\'>\n	</g>\n	<g class=\'main\' ng-attr-clip-path=\'url(#{{vm.name}})\' shifter=\'[vm.mar.left, vm.mar.top]\'>\n		<foreignObject width=\'30\' height=\'30\' x=\'-15\' y=\'-20\' shifter=\'[vm.width, vm.Ver(0)]\'>\n				<text class=\'label\'>$t$</text>\n		</foreignObject>\n		<path ng-attr-d=\'{{vm.lineFun(vm.Data.trajectory)}}\' class=\'fun v\' />\n		<path ng-attr-d=\'{{vm.triangleData}}\' class=\'tri\' />\n		<line class=\'tri dv\' d3-der=\'{x1: vm.Hor(vm.point.t)-1, x2: vm.Hor(vm.point.t)-1, y1: vm.Ver(vm.point.v), y2: vm.Ver((vm.point.v + vm.point.dv))}\'/>\n		<foreignObject width=\'30\' height=\'30\' shifter=\'[(vm.Hor(vm.point.t) - 16), vm.sthing]\'>\n				<text class=\'tri-label\' >$\\dot{y}$</text>\n		</foreignObject>\n		<foreignObject width=\'100\' height=\'30\' shifter=\'[vm.Hor(1.65), vm.Ver(1.38)]\'>\n			<text class=\'tri-label\'>$\\sin(t)$</text>\n		</foreignObject>\n		<circle r=\'3px\'  shifter=\'[vm.Hor(vm.point.t), vm.Ver(vm.point.v)]\' class=\'point v\'/>\n		<rect class=\'experiment\' ng-attr-height=\'{{vm.height}}\' ng-attr-width=\'{{vm.width}}\' />\n	</g>\n</svg>';

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



},{"../../directives/plotCtrl":23,"../../helpers":28,"angular":undefined,"d3":undefined,"lodash":undefined}],7:[function(require,module,exports){
var Ctrl, PlotCtrl, _, angular, d3, der, template,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

angular = require('angular');

d3 = require('d3');

require('../../helpers');

_ = require('lodash');

PlotCtrl = require('../../directives/plotCtrl');

template = '<svg ng-init=\'vm.resize()\' class=\'topChart\'>\n	<g boilerplate-der width=\'vm.width\' height=\'vm.height\' ver-ax-fun=\'vm.verAxFun\' hor-ax-fun=\'vm.horAxFun\' ver=\'vm.Ver\' hor=\'vm.Hor\' mar=\'vm.mar\' name=\'vm.name\'></g>\n	<g class=\'main\' ng-attr-clip-path="url(#{{vm.name}})" shifter=\'[vm.mar.left, vm.mar.top]\'>\n		<foreignObject width=\'30\' height=\'30\' x=\'-15\' y=\'-20\' shifter=\'[vm.width, vm.Ver(0)]\'>\n				<text class=\'label\'>$t$</text>\n		</foreignObject>\n		<path d3-der=\'{d:vm.lineFun(vm.Data.trajectory)}\' class=\'fun dv\' />\n		<line class=\'tri dv\' d3-der=\'{x1: vm.Hor(vm.point.t), x2: vm.Hor(vm.point.t), y1: vm.Ver(0), y2: vm.Ver(vm.point.dv)}\'/>\n		<foreignObject width=\'30\' height=\'30\' shifter=\'[(vm.Hor(vm.point.t) - 16), vm.Ver(vm.point.dv*.5)-6]\'>\n				<text class=\'tri-label\'>$\\dot{y}$</text>\n		</foreignObject>\n		<foreignObject width=\'100\' height=\'30\' shifter=\'[vm.Hor(.9), vm.Ver(1)]\'>\n			<text class=\'tri-label\'>$\\cos(t)$</text>\n		</foreignObject>\n		<circle r=\'4px\'  shifter=\'[vm.Hor(vm.point.t), vm.Ver(vm.point.dv)]\' class=\'point dv\'/>\n		<rect class=\'experiment\' ng-attr-height=\'{{vm.height}}\' ng-attr-width=\'{{vm.width}}\' />\n	</g>\n</svg>';

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



},{"../../directives/plotCtrl":23,"../../helpers":28,"angular":undefined,"d3":undefined,"lodash":undefined}],8:[function(require,module,exports){
var Service, _, dvFun, vFun;

_ = require('lodash');

vFun = Math.sin;

dvFun = Math.cos;

Service = (function() {
  function Service($rootScope) {
    this.rootScope = $rootScope;
    this.setT(0);
    this.paused = false;
    this.trajectory = _.range(0, 6, 1 / 10).map(function(t) {
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



},{"lodash":undefined}],9:[function(require,module,exports){
var Ctrl, PlotCtrl, der, template,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

require('../../helpers');

PlotCtrl = require('../../directives/plotCtrl');

template = '<svg ng-init=\'vm.resize()\' class=\'bottomChart\' >\n	<g boilerplate-der width=\'vm.width\' height=\'vm.height\' ver-ax-fun=\'vm.verAxFun\' hor-ax-fun=\'vm.horAxFun\' ver=\'vm.Ver\' hor=\'vm.Hor\' mar=\'vm.mar\' name=\'"designA"\'>\n		<foreignObject width=\'30\' height=\'30\' y=\'5\' x=\'-8\' shifter=\'[vm.width, vm.height]\'>\n				<text class=\'label\' >$t$</text>\n		</foreignObject>\n		<foreignObject width=\'30\' height=\'30\' y=\'0\' x=\'-15\' shifter=\'[0, 0]\'>\n				<text class=\'label\' >$v$</text>\n		</foreignObject>\n	</g>\n	<g class=\'main\' clip-path="url(#designA)" shifter=\'[vm.mar.left, vm.mar.top]\' >\n		<rect style=\'opacity:0\' ng-attr-height=\'{{vm.height}}\' ng-attr-width=\'{{vm.width}}\' behavior=\'vm.drag_rect\'></rect>\n		<g ng-class=\'{hide: !vm.Data.show}\' >\n			<line class=\'tri v\' d3-der=\'{x1: vm.Hor(vm.selected.t)-1, x2: vm.Hor(vm.selected.t)-1, y1: vm.Ver(0), y2: vm.Ver(vm.selected.v)}\'/>\n			<path ng-attr-d=\'{{vm.triangleData()}}\' class=\'tri\' />\n			<line d3-der=\'{x1: vm.Hor(vm.selected.t)+1, x2: vm.Hor(vm.selected.t)+1, y1: vm.Ver(vm.selected.v), y2: vm.Ver(vm.selected.v + vm.selected.dv)}\' class=\'tri dv\' />\n		</g>\n		<path ng-attr-d=\'{{vm.lineFun(vm.trueCart.trajectory)}}\' class=\'fun target\' />\n		<path ng-attr-d=\'{{vm.lineFun(vm.fakeCart.dots)}}\' class=\'fun v\' />\n		<g ng-repeat=\'dot in vm.dots track by dot.id\' datum=dot shifter=\'[vm.Hor(dot.t),vm.Ver(dot.v)]\' behavior=\'vm.drag\' dot-a-der=dot ></g>\n		<circle class=\'dot small\' r=\'4\' shifter=\'[vm.Hor(0),vm.Ver(2)]\' />\n		<foreignObject width=\'70\' height=\'30\' shifter=\'[vm.Hor(3.7), vm.Ver(.33)]\'>\n				<text class=\'tri-label\' >$2e^{-.8t}$</text>\n		</foreignObject>\n		<circle r=\'4px\'  shifter=\'[vm.Hor(vm.Data.t), vm.Ver(vm.fakeCart.v)]\' class=\'point fake\'/>\n		<circle r=\'4px\'  shifter=\'[vm.Hor(vm.Data.t), vm.Ver(vm.trueCart.v)]\' class=\'point real\'/>\n		<rect class=\'experiment\' ng-attr-height=\'{{vm.height}}\' ng-attr-width=\'{{vm.width}}\' />\n	</g>\n</svg>';

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
    this.Ver.domain([-.1, 2.3]);
    this.Hor.domain([-.1, 4.5]);
    this.tran = function(tran) {
      return tran.duration(30).ease('linear');
    };
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



},{"../../directives/plotCtrl":23,"../../helpers":28}],10:[function(require,module,exports){
var Ctrl, PlotCtrl, der, template,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

require('../../helpers');

PlotCtrl = require('../../directives/plotCtrl');

template = '<svg ng-init=\'vm.resize()\'  class=\'bottomChart\'>\n	<g boilerplate-der width=\'vm.width\' height=\'vm.height\' ver-ax-fun=\'vm.verAxFun\' hor-ax-fun=\'vm.horAxFun\' ver=\'vm.Ver\' hor=\'vm.Hor\' mar=\'vm.mar\' name=\'"designB"\'>\n		<foreignObject width=\'30\' height=\'30\' y=\'5\' x=\'-8\' shifter=\'[vm.width, vm.height]\'>\n				<text class=\'label\' >$t$</text>\n		</foreignObject>\n		<foreignObject width=\'30\' height=\'30\' y=\'0\' x=\'-15\' shifter=\'[0, 0]\'>\n				<text class=\'label\' >$v$</text>\n		</foreignObject>\n	</g>\n	<g class=\'main\' clip-path="url(#designB)" shifter=\'[vm.mar.left, vm.mar.top]\'>	\n		<path ng-attr-d=\'{{vm.lineFun(vm.trueCart.trajectory)}}\' class=\'fun target\' />\n		<g ng-class=\'{hide: !vm.Data.show}\' >\n			<line class=\'tri v\' d3-der=\'{x1: vm.Hor(0), x2: vm.Hor(vm.selected.v), y1: vm.Ver(vm.selected.dv), y2: vm.Ver(vm.selected.dv)}\'/>\n			<line class=\'tri dv\' d3-der=\'{x1: vm.Hor(vm.selected.v), x2: vm.Hor(vm.selected.v), y1: vm.Ver(0), y2: vm.Ver(vm.selected.dv)}\'/>\n			<path d3-der=\'{d:vm.lineFun(vm.trueCart.trajectory)}\' class=\'fun correct\' ng-class=\'{hide: !vm.Data.correct}\' />\n		</g>\n		<g ng-repeat=\'dot in vm.dots track by dot.id\' shifter=\'[vm.Hor(dot.v),vm.Ver(dot.dv)]\' dot-b-der=dot></g>\n		<foreignObject width=\'70\' height=\'30\' y=\'0\' shifter=\'[vm.Hor(.3), vm.Ver(-.1)]\'>\n				<text class=\'tri-label\' >$v\'=-.8v$</text>\n		</foreignObject>\n		<rect class=\'experiment\' ng-attr-height=\'{{vm.height}}\' ng-attr-width=\'{{vm.width}}\' />\n	</g>\n</svg>';

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
    this.Ver.domain([-1.7, .2]);
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



},{"../../directives/plotCtrl":23,"../../helpers":28}],11:[function(require,module,exports){
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



},{"../../helpers":28,"lodash":undefined}],12:[function(require,module,exports){
var Ctrl, _, der, template;

_ = require('lodash');

require('../../helpers');

template = '<div cart-der data="vm.trueCart" max="vm.max" sample=\'vm.sample\'></div>';

Ctrl = (function() {
  function Ctrl(scope, trueCart, fakeCart) {
    this.scope = scope;
    this.trueCart = trueCart;
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
    controller: ['$scope', 'trueCart', 'fakeCart', Ctrl],
    controllerAs: 'vm'
  };
};

module.exports = der;



},{"../../helpers":28,"lodash":undefined}],13:[function(require,module,exports){
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



},{"../../helpers":28,"angular":undefined,"d3":undefined}],14:[function(require,module,exports){
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



},{}],15:[function(require,module,exports){
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



},{"./designData":13}],16:[function(require,module,exports){
var Dot, Service, _, d3, delT;

require('../../helpers');

_ = require('lodash');

d3 = require('d3');

delT = .05;

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
    var a, h, ref;
    a = Math.floor(t / delT);
    h = (t - this.trajectory[a].t) / delT;
    return this.trajectory[a].x * (1 - h) + h * ((ref = this.trajectory[a + 1]) != null ? ref.x : void 0);
  };

  Service.property('x', {
    get: function() {
      return this.loc(this.Data.t);
    }
  });

  Service.property('v', {
    get: function() {
      var a, h, ref, t;
      t = this.Data.t;
      a = Math.floor(t / delT);
      h = (t - this.trajectory[a].t) / delT;
      return this.trajectory[a].v * (1 - h) + h * ((ref = this.trajectory[a + 1]) != null ? ref.v : void 0);
    }
  });

  Service.property('dv', {
    get: function() {
      return this.trajectory[Math.floor(this.Data.t / delT)].dv;
    }
  });

  Service.prototype.update = function() {
    var domain, range;
    this.dots.sort(function(a, b) {
      return a.t - b.t;
    });
    domain = [];
    range = [];
    this.dots.forEach(function(dot, i, k) {
      var dt, prev;
      prev = k[i - 1];
      if (dot.id === 'last') {
        dot.v = prev.v;
        domain.push(dot.v);
        range.push(dot.v);
        return;
      }
      if (prev) {
        dt = dot.t - prev.t;
        dot.x = prev.x + dt * (dot.v + prev.v) / 2;
        return dot.dv = (dot.v - prev.v) / Math.max(dt, .001);
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



},{"../../helpers":28,"d3":undefined,"lodash":undefined}],17:[function(require,module,exports){
var Data, Service, _, delT;

Data = require('./designData');

_ = require('lodash');

require('../../helpers');

delT = .01;

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



},{"../../helpers":28,"./designData":13,"lodash":undefined}],18:[function(require,module,exports){
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
var der, template;

template = '<defs>\n	<clippath ng-attr-id=\'{{::vm.name}}\'>\n		<rect ng-attr-width=\'{{vm.width}}\' ng-attr-height=\'{{vm.height}}\' />\n	</clippath>\n</defs>\n<g class=\'boilerplate\' shifter=\'{{::[vm.mar.left, vm.mar.top]}}\'>\n	<rect class=\'background\' ng-attr-width=\'{{vm.width}}\' ng-attr-height=\'{{vm.height}}\' />\n	<g ver-axis-der width=\'vm.width\' scale=\'vm.ver\' fun=\'vm.verAxFun\'></g>\n	<g hor-axis-der height=\'vm.height\' scale=\'vm.hor\' fun=\'vm.horAxFun\' shifter=\'[0,vm.height]\'></g>\n	<line class=\'zero-line hor\' d3-der=\'{x1: 0, x2: vm.width, y1: vm.ver(0), y2: vm.ver(0)}\'/>\n	<line class=\'zero-line hor\' d3-der=\'{x1: vm.hor(0), x2: vm.hor(0), y1:0, y2: vm.height}\'/>\n	<g ng-transclude>\n	</g>\n</g>';

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
    transclude: true,
    templateNamespace: 'svg'
  };
};

module.exports = der;



},{}],20:[function(require,module,exports){
var Ctrl, PlotCtrl, _, d3, der, template,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

_ = require('lodash');

d3 = require('d3');

require('../helpers');

PlotCtrl = require('./plotCtrl');

template = '<svg ng-init=\'vm.resize()\' ng-attr-height="{{vm.svgHeight}}">\n	<defs>\n		<clippath id=\'cartSim\'>\n			<rect d3-der=\'{width: vm.width, height: vm.height}\' />\n		</clippath>\n	</defs>\n	<g class=\'boilerplate\' shifter=\'{{::[vm.mar.left, vm.mar.top]}}\' >\n		<rect d3-der=\'{width: vm.width, height: vm.height}\' class=\'background\'/>\n		<g hor-axis-der height=\'vm.height\' fun=\'vm.horAxFun\' shifter=\'[0,vm.height]\'></g>\n		<foreignObject width=\'30\' height=\'30\' y=\'20\' shifter=\'[vm.width/2, vm.height]\'>\n				<text class=\'label\' >$x$</text>\n		</foreignObject>\n	</g>\n	<g shifter=\'{{::[vm.mar.left, vm.mar.top]}}\' clip-path="url(#cartSim)" >\n		<foreignObject width=\'30\' height=\'30\' y=\'20\' shifter=\'[vm.width/2, vm.height]\'>\n				<text class=\'label\' >$t$</text>\n		</foreignObject>\n		<g ng-repeat=\'t in vm.sample\' d3-der=\'{transform: "translate(" + vm.Hor(vm.data.loc(t)) + ",0)"}\'>\n			<line class=\'time-line\' d3-der=\'{x1: 0, x2: 0, y1: 0, y2: vm.height}\' />\n		</g>\n		<g class=\'g-cart\' cart-object-der left=\'vm.Hor(vm.data.x)\' top=\'vm.height\' size=\'vm.size\'></g>\n		<rect class=\'experiment\' ng-attr-height=\'{{vm.height}}\' ng-attr-width=\'{{vm.width}}\' />\n	</g>\n</svg>';

Ctrl = (function(superClass) {
  extend(Ctrl, superClass);

  function Ctrl(scope, el, window) {
    this.scope = scope;
    this.el = el;
    this.window = window;
    Ctrl.__super__.constructor.call(this, this.scope, this.el, this.window);
    this.mar.left = this.mar.right = 5;
    this.mar.top = 5;
    this.mar.bottom = 25;
    this.scope.$watch('vm.max', (function(_this) {
      return function() {
        return _this.Hor.domain([-.4, _this.max]);
      };
    })(this));
  }

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
    templateNamespace: 'svg',
    controller: ['$scope', '$element', '$window', Ctrl],
    controllerAs: 'vm'
  };
};

module.exports = der;



},{"../helpers":28,"./plotCtrl":23,"d3":undefined,"lodash":undefined}],21:[function(require,module,exports){
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



},{"angular":undefined,"d3":undefined}],22:[function(require,module,exports){
module.exports = function($parse) {
  return function(scope, el, attr) {
    return d3.select(el[0]).datum($parse(attr.datum)(scope));
  };
};



},{}],23:[function(require,module,exports){
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



},{"d3":undefined}],24:[function(require,module,exports){
var d3, der;

d3 = require('d3');

der = function($parse) {
  var directive;
  return directive = {
    restrict: 'A',
    link: function(scope, el, attr) {
      var reshift, sel, tran, u;
      sel = d3.select(el[0]);
      u = 't-' + Math.random();
      tran = $parse(attr.tran)(scope);
      reshift = function(v) {
        if (tran) {
          sel.transition(u).attr('transform', "translate(" + v[0] + "," + v[1] + ")").call(tran);
        } else {
          sel.attr('transform', "translate(" + v[0] + "," + v[1] + ")");
        }
        return d3.select(el[0]);
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
    var t, t2;
    this.scope = scope;
    this.el = el;
    this.window = window;
    t = textures.lines().orientation("3/8", "7/8").size(4).stroke('#E6E6E6').strokeWidth(.6);
    t.id('myTexture');
    t2 = textures.lines().orientation("3/8", "7/8").size(4).stroke('white').strokeWidth(.4);
    t2.id('myTexture2');
    d3.select(this.el[0]).select('svg').call(t).call(t2);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvbGV3aXMvUmVzZWFyY2gvZGlmZkVRX25ldy9hcHAvYXBwLmNvZmZlZSIsIi9Vc2Vycy9sZXdpcy9SZXNlYXJjaC9kaWZmRVFfbmV3L2FwcC9jb21wb25lbnRzL2NhcnQvY2FydERhdGEuY29mZmVlIiwiL1VzZXJzL2xld2lzL1Jlc2VhcmNoL2RpZmZFUV9uZXcvYXBwL2NvbXBvbmVudHMvY2FydC9jYXJ0T2JqZWN0LmNvZmZlZSIsIi9Vc2Vycy9sZXdpcy9SZXNlYXJjaC9kaWZmRVFfbmV3L2FwcC9jb21wb25lbnRzL2NhcnQvY2FydFBsb3QuY29mZmVlIiwiL1VzZXJzL2xld2lzL1Jlc2VhcmNoL2RpZmZFUV9uZXcvYXBwL2NvbXBvbmVudHMvY2FydC9jYXJ0U2ltLmNvZmZlZSIsIi9Vc2Vycy9sZXdpcy9SZXNlYXJjaC9kaWZmRVFfbmV3L2FwcC9jb21wb25lbnRzL2Rlcml2YXRpdmUvZGVyaXZhdGl2ZUEuY29mZmVlIiwiL1VzZXJzL2xld2lzL1Jlc2VhcmNoL2RpZmZFUV9uZXcvYXBwL2NvbXBvbmVudHMvZGVyaXZhdGl2ZS9kZXJpdmF0aXZlQi5jb2ZmZWUiLCIvVXNlcnMvbGV3aXMvUmVzZWFyY2gvZGlmZkVRX25ldy9hcHAvY29tcG9uZW50cy9kZXJpdmF0aXZlL2Rlcml2YXRpdmVEYXRhLmNvZmZlZSIsIi9Vc2Vycy9sZXdpcy9SZXNlYXJjaC9kaWZmRVFfbmV3L2FwcC9jb21wb25lbnRzL2Rlc2lnbi9kZXNpZ25BLmNvZmZlZSIsIi9Vc2Vycy9sZXdpcy9SZXNlYXJjaC9kaWZmRVFfbmV3L2FwcC9jb21wb25lbnRzL2Rlc2lnbi9kZXNpZ25CLmNvZmZlZSIsIi9Vc2Vycy9sZXdpcy9SZXNlYXJjaC9kaWZmRVFfbmV3L2FwcC9jb21wb25lbnRzL2Rlc2lnbi9kZXNpZ25DYXJ0QS5jb2ZmZWUiLCIvVXNlcnMvbGV3aXMvUmVzZWFyY2gvZGlmZkVRX25ldy9hcHAvY29tcG9uZW50cy9kZXNpZ24vZGVzaWduQ2FydEIuY29mZmVlIiwiL1VzZXJzL2xld2lzL1Jlc2VhcmNoL2RpZmZFUV9uZXcvYXBwL2NvbXBvbmVudHMvZGVzaWduL2Rlc2lnbkRhdGEuY29mZmVlIiwiL1VzZXJzL2xld2lzL1Jlc2VhcmNoL2RpZmZFUV9uZXcvYXBwL2NvbXBvbmVudHMvZGVzaWduL2RvdEEuY29mZmVlIiwiL1VzZXJzL2xld2lzL1Jlc2VhcmNoL2RpZmZFUV9uZXcvYXBwL2NvbXBvbmVudHMvZGVzaWduL2RvdEIuY29mZmVlIiwiL1VzZXJzL2xld2lzL1Jlc2VhcmNoL2RpZmZFUV9uZXcvYXBwL2NvbXBvbmVudHMvZGVzaWduL2Zha2VDYXJ0LmNvZmZlZSIsIi9Vc2Vycy9sZXdpcy9SZXNlYXJjaC9kaWZmRVFfbmV3L2FwcC9jb21wb25lbnRzL2Rlc2lnbi90cnVlQ2FydC5jb2ZmZWUiLCIvVXNlcnMvbGV3aXMvUmVzZWFyY2gvZGlmZkVRX25ldy9hcHAvZGlyZWN0aXZlcy9iZWhhdmlvci5jb2ZmZWUiLCIvVXNlcnMvbGV3aXMvUmVzZWFyY2gvZGlmZkVRX25ldy9hcHAvZGlyZWN0aXZlcy9ib2lsZXJwbGF0ZS5jb2ZmZWUiLCIvVXNlcnMvbGV3aXMvUmVzZWFyY2gvZGlmZkVRX25ldy9hcHAvZGlyZWN0aXZlcy9jYXJ0RGVyLmNvZmZlZSIsIi9Vc2Vycy9sZXdpcy9SZXNlYXJjaC9kaWZmRVFfbmV3L2FwcC9kaXJlY3RpdmVzL2QzRGVyLmNvZmZlZSIsIi9Vc2Vycy9sZXdpcy9SZXNlYXJjaC9kaWZmRVFfbmV3L2FwcC9kaXJlY3RpdmVzL2RhdHVtLmNvZmZlZSIsIi9Vc2Vycy9sZXdpcy9SZXNlYXJjaC9kaWZmRVFfbmV3L2FwcC9kaXJlY3RpdmVzL3Bsb3RDdHJsLmNvZmZlZSIsIi9Vc2Vycy9sZXdpcy9SZXNlYXJjaC9kaWZmRVFfbmV3L2FwcC9kaXJlY3RpdmVzL3NoaWZ0ZXIuY29mZmVlIiwiL1VzZXJzL2xld2lzL1Jlc2VhcmNoL2RpZmZFUV9uZXcvYXBwL2RpcmVjdGl2ZXMvdGV4dHVyZS5jb2ZmZWUiLCIvVXNlcnMvbGV3aXMvUmVzZWFyY2gvZGlmZkVRX25ldy9hcHAvZGlyZWN0aXZlcy94QXhpcy5jb2ZmZWUiLCIvVXNlcnMvbGV3aXMvUmVzZWFyY2gvZGlmZkVRX25ldy9hcHAvZGlyZWN0aXZlcy95QXhpcy5jb2ZmZWUiLCIvVXNlcnMvbGV3aXMvUmVzZWFyY2gvZGlmZkVRX25ldy9hcHAvaGVscGVycy5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQSxZQUFBLENBQUE7QUFBQSxJQUFBLHdCQUFBOztBQUFBLE9BQ0EsR0FBVSxPQUFBLENBQVEsU0FBUixDQURWLENBQUE7O0FBQUEsRUFFQSxHQUFLLE9BQUEsQ0FBUSxJQUFSLENBRkwsQ0FBQTs7QUFBQSxHQUdBLEdBQU0sT0FBTyxDQUFDLE1BQVIsQ0FBZSxTQUFmLEVBQTBCLENBQUMsT0FBQSxDQUFRLGtCQUFSLENBQUQsQ0FBMUIsQ0FDTCxDQUFDLFNBREksQ0FDTSxZQUROLEVBQ29CLE9BQUEsQ0FBUSxvQkFBUixDQURwQixDQUVMLENBQUMsU0FGSSxDQUVNLFlBRk4sRUFFb0IsT0FBQSxDQUFRLG9CQUFSLENBRnBCLENBR0wsQ0FBQyxTQUhJLENBR00sWUFITixFQUdvQixPQUFBLENBQVEsMkJBQVIsQ0FIcEIsQ0FJTCxDQUFDLFNBSkksQ0FJTSxlQUpOLEVBSXVCLE9BQUEsQ0FBUSw4QkFBUixDQUp2QixDQU1MLENBQUMsU0FOSSxDQU1NLFNBTk4sRUFNa0IsT0FBQSxDQUFRLHNCQUFSLENBTmxCLENBT0wsQ0FBQyxTQVBJLENBT00sVUFQTixFQU9rQixPQUFBLENBQVEsdUJBQVIsQ0FQbEIsQ0FRTCxDQUFDLFNBUkksQ0FRTSxTQVJOLEVBUWlCLE9BQUEsQ0FBUSwwQkFBUixDQVJqQixDQVNMLENBQUMsU0FUSSxDQVNNLFNBVE4sRUFTaUIsT0FBQSxDQUFRLDBCQUFSLENBVGpCLENBVUwsQ0FBQyxTQVZJLENBVU0sT0FWTixFQVVlLE9B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QUFHLENBQUMsUUFBUCxDQUFpQixDQUFBLEVBQUcsQ0FBQyxLQUFyQixDQUFBLENBQUE7aUJBQ0EsR0FBRyxDQUFDLElBQUosQ0FBUyxFQUFFLENBQUMsR0FBWixFQUZRO1FBQUEsRUFBQTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FKVCxDQUFBO2FBUUEsS0FBSyxDQUFDLE1BQU4sQ0FBYSxTQUFBLEdBQUE7ZUFFWixDQUFDLEtBQUssQ0FBQyxNQUFOLENBQUEsQ0FBRCxFQUFpQixLQUFLLENBQUMsS0FBTixDQUFBLENBQWpCLEVBQWdDLEVBQUUsQ0FBQyxLQUFuQyxFQUZZO01BQUEsQ0FBYixFQUdFLE1BSEYsRUFJRSxJQUpGLEVBVEs7SUFBQSxDQVJOO0lBRkk7QUFBQSxDQUhOLENBQUE7O0FBQUEsTUE0Qk0sQ0FBQyxPQUFQLEdBQWlCLEdBNUJqQixDQUFBOzs7OztBQ0FBLFlBQUEsQ0FBQTtBQUFBLE1BRU0sQ0FBQyxPQUFPLENBQUMsT0FBZixHQUF5QixTQUFDLEdBQUQsRUFBTSxJQUFOLEdBQUE7U0FDdkIsRUFBRSxDQUFDLEtBQUgsQ0FBUyxDQUFBLFNBQUEsS0FBQSxHQUFBO1dBQUEsU0FBQSxHQUFBO0FBQ1IsTUFBQSxHQUFBLENBQUEsQ0FBQSxDQUFBO2FBQ0EsS0FGUTtJQUFBLEVBQUE7RUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQVQsRUFHQyxJQUhELEVBRHVCO0FBQUEsQ0FGekIsQ0FBQTs7QUFBQSxRQVNRLENBQUEsU0FBRSxDQUFBLFFBQVYsR0FBcUIsU0FBQyxJQUFELEVBQU8sSUFBUCxHQUFBO1NBQ25CLE1BQU0sQ0FBQyxjQUFQLENBQXNCLElBQUMsQ0FBQSxTQUF2QixFQUFrQyxJQUFsQyxFQUF3QyxJQUF4QyxFQURtQjtBQUFBLENBVHJCLENBQUEiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiJ3VzZSBzdHJpY3QnXG5hbmd1bGFyID0gcmVxdWlyZSAnYW5ndWxhcidcbmQzID0gcmVxdWlyZSAnZDMnXG5hcHAgPSBhbmd1bGFyLm1vZHVsZSAnbWFpbkFwcCcsIFtyZXF1aXJlICdhbmd1bGFyLW1hdGVyaWFsJ11cblx0LmRpcmVjdGl2ZSAnaG9yQXhpc0RlcicsIHJlcXVpcmUgJy4vZGlyZWN0aXZlcy94QXhpcydcblx0LmRpcmVjdGl2ZSAndmVyQXhpc0RlcicsIHJlcXVpcmUgJy4vZGlyZWN0aXZlcy95QXhpcydcblx0LmRpcmVjdGl2ZSAnY2FydFNpbURlcicsIHJlcXVpcmUgJy4vY29tcG9uZW50cy9jYXJ0L2NhcnRTaW0nXG5cdC5kaXJlY3RpdmUgJ2NhcnRPYmplY3REZXInLCByZXF1aXJlICcuL2NvbXBvbmVudHMvY2FydC9jYXJ0T2JqZWN0J1xuXHQjIC5kaXJlY3RpdmUgJ2NhcnRCdXR0b25zRGVyJywgcmVxdWlyZSAnLi9jb21wb25lbnRzL2NhcnQvY2FydEJ1dHRvbnMnXG5cdC5kaXJlY3RpdmUgJ3NoaWZ0ZXInICwgcmVxdWlyZSAnLi9kaXJlY3RpdmVzL3NoaWZ0ZXInXG5cdC5kaXJlY3RpdmUgJ2JlaGF2aW9yJywgcmVxdWlyZSAnLi9kaXJlY3RpdmVzL2JlaGF2aW9yJ1xuXHQuZGlyZWN0aXZlICdkb3RBRGVyJywgcmVxdWlyZSAnLi9jb21wb25lbnRzL2Rlc2lnbi9kb3RBJ1xuXHQuZGlyZWN0aXZlICdkb3RCRGVyJywgcmVxdWlyZSAnLi9jb21wb25lbnRzL2Rlc2lnbi9kb3RCJ1xuXHQuZGlyZWN0aXZlICdkYXR1bScsIHJlcXVpcmUgJy4vZGlyZWN0aXZlcy9kYXR1bSdcblx0LmRpcmVjdGl2ZSAnZDNEZXInLCByZXF1aXJlICcuL2RpcmVjdGl2ZXMvZDNEZXInXG5cdC5kaXJlY3RpdmUgJ2Rlc2lnbkFEZXInLCByZXF1aXJlICcuL2NvbXBvbmVudHMvZGVzaWduL2Rlc2lnbkEnXG5cdC5kaXJlY3RpdmUgJ2Rlc2lnbkJEZXInICwgcmVxdWlyZSAnLi9jb21wb25lbnRzL2Rlc2lnbi9kZXNpZ25CJ1xuXHQuZGlyZWN0aXZlICdkZXJpdmF0aXZlQURlcicsIHJlcXVpcmUgJy4vY29tcG9uZW50cy9kZXJpdmF0aXZlL2Rlcml2YXRpdmVBJ1xuXHQuZGlyZWN0aXZlICdkZXJpdmF0aXZlQkRlcicsIHJlcXVpcmUgJy4vY29tcG9uZW50cy9kZXJpdmF0aXZlL2Rlcml2YXRpdmVCJ1xuXHQuZGlyZWN0aXZlICdjYXJ0UGxvdERlcicsIHJlcXVpcmUgJy4vY29tcG9uZW50cy9jYXJ0L2NhcnRQbG90J1xuXHQuZGlyZWN0aXZlICdkZXNpZ25DYXJ0QURlcicsIHJlcXVpcmUgJy4vY29tcG9uZW50cy9kZXNpZ24vZGVzaWduQ2FydEEnXG5cdC5kaXJlY3RpdmUgJ2Rlc2lnbkNhcnRCRGVyJywgcmVxdWlyZSAnLi9jb21wb25lbnRzL2Rlc2lnbi9kZXNpZ25DYXJ0Qidcblx0LmRpcmVjdGl2ZSAndGV4dHVyZURlcicsIHJlcXVpcmUgJy4vZGlyZWN0aXZlcy90ZXh0dXJlJ1xuXHQjIC5kaXJlY3RpdmUgJ2Rlc2lnbkJ1dHRvbnNEZXInLCByZXF1aXJlICcuL2NvbXBvbmVudHMvZGVzaWduL2Rlc2lnbkJ1dHRvbnMnXG5cdC5kaXJlY3RpdmUgJ2JvaWxlcnBsYXRlRGVyJywgcmVxdWlyZSAnLi9kaXJlY3RpdmVzL2JvaWxlcnBsYXRlJ1xuXHQuZGlyZWN0aXZlICdjYXJ0RGVyJyAsIHJlcXVpcmUgJy4vZGlyZWN0aXZlcy9jYXJ0RGVyJ1xuXHQuc2VydmljZSAnZGVyaXZhdGl2ZURhdGEnLCByZXF1aXJlICcuL2NvbXBvbmVudHMvZGVyaXZhdGl2ZS9kZXJpdmF0aXZlRGF0YSdcblx0LnNlcnZpY2UgJ2Zha2VDYXJ0JywgcmVxdWlyZSAnLi9jb21wb25lbnRzL2Rlc2lnbi9mYWtlQ2FydCdcblx0LnNlcnZpY2UgJ3RydWVDYXJ0JywgcmVxdWlyZSAnLi9jb21wb25lbnRzL2Rlc2lnbi90cnVlQ2FydCdcblx0LnNlcnZpY2UgJ2Rlc2lnbkRhdGEnLCByZXF1aXJlICcuL2NvbXBvbmVudHMvZGVzaWduL2Rlc2lnbkRhdGEnXG5cdC5zZXJ2aWNlICdjYXJ0RGF0YScsIHJlcXVpcmUgJy4vY29tcG9uZW50cy9jYXJ0L2NhcnREYXRhJ1xubG9vcGVyID0gLT5cbiAgICBzZXRUaW1lb3V0KCAoKS0+XG4gICAgXHRcdFx0ZDMuc2VsZWN0QWxsICdjaXJjbGUuZG90LmxhcmdlJ1xuICAgIFx0XHRcdFx0LnRyYW5zaXRpb24gJ2dyb3cnXG4gICAgXHRcdFx0XHQuZHVyYXRpb24gNTAwXG4gICAgXHRcdFx0XHQuZWFzZSAnY3ViaWMtb3V0J1xuICAgIFx0XHRcdFx0LmF0dHIgJ3RyYW5zZm9ybScsICdzY2FsZSggMS4zNCknXG4gICAgXHRcdFx0XHQudHJhbnNpdGlvbiAnc2hyaW5rJ1xuICAgIFx0XHRcdFx0LmR1cmF0aW9uIDUwMFxuICAgIFx0XHRcdFx0LmVhc2UgJ2N1YmljLW91dCdcbiAgICBcdFx0XHRcdC5hdHRyICd0cmFuc2Zvcm0nLCAnc2NhbGUoIDEuMCknXG4gICAgXHRcdFx0bG9vcGVyKClcbiAgICBcdFx0LCAxMDAwKVxuXG5sb29wZXIoKVxuIiwiXyA9IHJlcXVpcmUgJ2xvZGFzaCdcbnZGdW4gPSAodCktPjIqTWF0aC5leHAgLS44KnRcbmR2RnVuID0gKHQpLT4gLS44ICogMipNYXRoLmV4cCAtLjgqdFxueEZ1biA9ICh0KS0+IDIvLjgqKDEtTWF0aC5leHAoLS44KnQpKVxuXG5jbGFzcyBTZXJ2aWNlXG5cdGNvbnN0cnVjdG9yOiAoJHJvb3RTY29wZSktPlxuXHRcdEByb290U2NvcGUgPSAkcm9vdFNjb3BlXG5cdFx0QHNldFQgMFxuXHRcdEBwYXVzZWQgPSAgZmFsc2Vcblx0XHRAdHJhamVjdG9yeSA9IF8ucmFuZ2UgMCAsIDYgLCAxLzEwXG5cdFx0XHQubWFwICh0KS0+XG5cdFx0XHRcdHJlcyA9XG5cdFx0XHRcdFx0eDogeEZ1biB0XG5cdFx0XHRcdFx0ZHY6IGR2RnVuIHRcblx0XHRcdFx0XHR2OiB2RnVuIHRcblx0XHRcdFx0XHR0OiB0XG5cdFx0QG1vdmUgMCBcblxuXHRjbGljazogLT5cblx0XHRpZiBAcGF1c2VkIHRoZW4gQHBsYXkoKSBlbHNlIEBwYXVzZSgpXG5cblx0cGF1c2U6IC0+XG5cdFx0QHBhdXNlZCA9IHRydWVcblxuXHRpbmNyZW1lbnQ6KGR0KSAtPlxuXHRcdEB0ICs9IGR0XG5cdFx0QG1vdmUoQHQpXG5cblx0c2V0VDogKHQpLT5cblx0XHRAdCA9IHRcblx0XHRAbW92ZSBAdFxuXG5cdHBsYXk6IC0+XG5cdFx0QHBhdXNlZCA9IHRydWVcblx0XHRkMy50aW1lci5mbHVzaCgpXG5cdFx0QHBhdXNlZCA9IGZhbHNlXG5cdFx0bGFzdCA9IDBcblx0XHRkMy50aW1lciAoZWxhcHNlZCk9PlxuXHRcdFx0XHRkdCA9IGVsYXBzZWQgLSBsYXN0XG5cdFx0XHRcdEBpbmNyZW1lbnQgZHQvMTAwMFxuXHRcdFx0XHRsYXN0ID0gZWxhcHNlZFxuXHRcdFx0XHRpZiBAdCA+IDYgdGhlbiBAc2V0VCAwXG5cdFx0XHRcdEByb290U2NvcGUuJGV2YWxBc3luYygpXG5cdFx0XHRcdEBwYXVzZWRcblx0XHRcdCwgMVxuXG5cdG1vdmU6ICh0KS0+XG5cdFx0QHBvaW50ID0gXG5cdFx0XHR4OiB4RnVuIHRcblx0XHRcdGR2OiBkdkZ1biB0XG5cdFx0XHR2OiB2RnVuIHRcblx0XHRcdHQ6IHRcblxubW9kdWxlLmV4cG9ydHMgPSBTZXJ2aWNlIiwiY2xhc3MgQ3RybFxuXHRjb25zdHJ1Y3RvcjooQHNjb3BlKS0+XG5cblx0dHJhbnM6ICh0cmFuKS0+XG5cdFx0dHJhblxuXHRcdFx0LmR1cmF0aW9uIDIwMFxuXHRcdFx0LmVhc2UgJ2N1YmljJ1xuXG5kZXIgPSAoKS0+XG5cdGRpcmVjdGl2ZSA9IFxuXHRcdHNjb3BlOiBcblx0XHRcdHNpemU6ICc9J1xuXHRcdFx0bGVmdDogJz0nXG5cdFx0XHR0b3A6ICc9J1xuXHRcdGNvbnRyb2xsZXJBczogJ3ZtJ1xuXHRcdHRlbXBsYXRlTmFtZXNwYWNlOiAnc3ZnJ1xuXHRcdGNvbnRyb2xsZXI6IFsnJHNjb3BlJyxDdHJsXVxuXHRcdHRlbXBsYXRlVXJsOiAnLi9hcHAvY29tcG9uZW50cy9jYXJ0L2NhcnQuc3ZnJ1xuXHRcdGJpbmRUb0NvbnRyb2xsZXI6IHRydWVcblx0XHRyZXN0cmljdDogJ0EnXG5cbm1vZHVsZS5leHBvcnRzID0gZGVyIiwiYW5ndWxhciA9IHJlcXVpcmUgJ2FuZ3VsYXInXG5kMyA9IHJlcXVpcmUgJ2QzJ1xucmVxdWlyZSAnLi4vLi4vaGVscGVycydcbl8gPSByZXF1aXJlICdsb2Rhc2gnXG5QbG90Q3RybCA9IHJlcXVpcmUgJy4uLy4uL2RpcmVjdGl2ZXMvcGxvdEN0cmwnXG5cbnRlbXBsYXRlID0gJycnXG5cdDxzdmcgbmctaW5pdD0ndm0ucmVzaXplKCknIGNsYXNzPSdib3R0b21DaGFydCcgPlxuXHRcdDxnIGJvaWxlcnBsYXRlLWRlciB3aWR0aD0ndm0ud2lkdGgnIGhlaWdodD0ndm0uaGVpZ2h0JyB2ZXItYXgtZnVuPSd2bS52ZXJBeEZ1bicgaG9yLWF4LWZ1bj0ndm0uaG9yQXhGdW4nIHZlcj0ndm0uVmVyJyBob3I9J3ZtLkhvcicgbWFyPSd2bS5tYXInIG5hbWU9J3ZtLm5hbWUnPlxuXHRcdFx0PGZvcmVpZ25PYmplY3Qgd2lkdGg9JzMwJyBoZWlnaHQ9JzMwJyB5PSc1JyB4PSctOCcgc2hpZnRlcj0nW3ZtLndpZHRoLCB2bS5oZWlnaHRdJz5cblx0XHRcdFx0XHQ8dGV4dCBjbGFzcz0nbGFiZWwnID4kdCQ8L3RleHQ+XG5cdFx0XHQ8L2ZvcmVpZ25PYmplY3Q+XG5cdFx0XHQ8Zm9yZWlnbk9iamVjdCB3aWR0aD0nMzAnIGhlaWdodD0nMzAnIHk9JzAnIHg9Jy0xNScgc2hpZnRlcj0nWzAsIDBdJz5cblx0XHRcdFx0XHQ8dGV4dCBjbGFzcz0nbGFiZWwnID4kdiQ8L3RleHQ+XG5cdFx0XHQ8L2ZvcmVpZ25PYmplY3Q+XG5cdFx0PC9nPlxuXHRcdDxnIGNsYXNzPSdtYWluJyBuZy1hdHRyLWNsaXAtcGF0aD0ndXJsKCN7e3ZtLm5hbWV9fSknIHNoaWZ0ZXI9J1t2bS5tYXIubGVmdCwgdm0ubWFyLnRvcF0nPlxuXG5cdFx0XHQ8cGF0aCBuZy1hdHRyLWQ9J3t7dm0ubGluZUZ1bih2bS5EYXRhLnRyYWplY3RvcnkpfX0nIGNsYXNzPSdmdW4gdicgLz5cblx0XHRcdDxsaW5lIGNsYXNzPSd0cmkgdicgZDMtZGVyPSd7eDE6IHZtLkhvcih2bS5wb2ludC50KS0xLCB4Mjogdm0uSG9yKHZtLnBvaW50LnQpLTEsIHkxOiB2bS5WZXIodm0ucG9pbnQudiksIHkyOiB2bS5WZXIoMCl9Jy8+XG5cdFx0XHQ8Zm9yZWlnbk9iamVjdCB3aWR0aD0nMzAnIGhlaWdodD0nMzAnIHNoaWZ0ZXI9J1sodm0uSG9yKHZtLnBvaW50LnQpIC0gMTYpLCB2bS5WZXIodm0ucG9pbnQudi8yKV0nPlxuXHRcdFx0XHRcdDx0ZXh0IGNsYXNzPSd0cmktbGFiZWwnID4keSQ8L3RleHQ+XG5cdFx0XHQ8L2ZvcmVpZ25PYmplY3Q+XG5cdFx0XHQ8Zm9yZWlnbk9iamVjdCB3aWR0aD0nMTAwJyBoZWlnaHQ9JzMwJyBzaGlmdGVyPSdbdm0uSG9yKDMuNSksIHZtLlZlcigwLjQpXSc+XG5cdFx0XHRcdDx0ZXh0IGNsYXNzPSd0cmktbGFiZWwnPiQyZV57LS44dH0kPC90ZXh0PlxuXHRcdFx0PC9mb3JlaWduT2JqZWN0PlxuXHRcdFx0PGNpcmNsZSByPSczcHgnICBzaGlmdGVyPSdbdm0uSG9yKHZtLnBvaW50LnQpLCB2bS5WZXIodm0ucG9pbnQudildJyBjbGFzcz0ncG9pbnQgdicvPlxuXHRcdFx0PHJlY3QgY2xhc3M9J2V4cGVyaW1lbnQnIG5nLWF0dHItaGVpZ2h0PSd7e3ZtLmhlaWdodH19JyBuZy1hdHRyLXdpZHRoPSd7e3ZtLndpZHRofX0nIC8+XG5cdFx0PC9nPlxuXHQ8L3N2Zz5cbicnJ1xuXG5jbGFzcyBDdHJsIGV4dGVuZHMgUGxvdEN0cmxcblx0Y29uc3RydWN0b3I6IChAc2NvcGUsIEBlbCwgQHdpbmRvdywgQERhdGEpLT5cblx0XHRzdXBlciBAc2NvcGUsIEBlbCwgQHdpbmRvd1xuXHRcdEBuYW1lID0gJ2NhcnRQbG90J1xuXHRcdEBWZXIuZG9tYWluIFstLjEsMi4zXVxuXHRcdEBIb3IuZG9tYWluIFstLjEsNC41XVxuXHRcdEBsaW5lRnVuXG5cdFx0XHQueSAoZCk9PiBAVmVyIGQudlxuXHRcdFx0LnggKGQpPT4gQEhvciBkLnRcblxuXHRcdEBEYXRhLnBsYXkoKVxuXG5cdG1vdmU6ID0+XG5cdFx0dCA9IEBIb3IuaW52ZXJ0IGV2ZW50LnggLSBldmVudC50YXJnZXQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkubGVmdFxuXHRcdEBEYXRhLnNldFQgdFxuXHRcdEBzY29wZS4kZXZhbEFzeW5jKClcblxuXHRAcHJvcGVydHkgJ3BvaW50JywgZ2V0Oi0+XG5cdFx0QERhdGEucG9pbnRcblxuXHRAcHJvcGVydHkgJ3RyaWFuZ2xlRGF0YScsIGdldDotPlxuXHRcdEBsaW5lRnVuIFt7djogQHBvaW50LnYsIHQ6IEBwb2ludC50fSwge3Y6QHBvaW50LmR2ICsgQHBvaW50LnYsIHQ6IEBwb2ludC50KzF9LCB7djogQHBvaW50LmR2ICsgQHBvaW50LnYsIHQ6IEBwb2ludC50fV1cblxuXG5kZXIgPSAtPlxuXHRkaXJlY3RpdmUgPSBcblx0XHRjb250cm9sbGVyQXM6ICd2bSdcblx0XHRzY29wZToge31cblx0XHRsaW5rOiAoc2NvcGUsIGVsLCBhdHRyLCB2bSktPlxuXHRcdFx0ZDMuc2VsZWN0IGVsWzBdXG5cdFx0XHRcdC5zZWxlY3QgJ3JlY3QuYmFja2dyb3VuZCdcblx0XHRcdFx0Lm9uICdtb3VzZW92ZXInLC0+XG5cdFx0XHRcdFx0dm0uRGF0YS5wYXVzZSgpXG5cdFx0XHRcdC5vbiAnbW91c2Vtb3ZlJywgLT5cblx0XHRcdFx0XHR2bS5tb3ZlKClcblx0XHRcdFx0Lm9uICdtb3VzZW91dCcsIC0+XG5cdFx0XHRcdFx0dm0uRGF0YS5wbGF5KClcblx0XHR0ZW1wbGF0ZTogdGVtcGxhdGVcblx0XHR0ZW1wbGF0ZU5hbWVzcGFjZTogJ3N2Zydcblx0XHRjb250cm9sbGVyOiBbJyRzY29wZScsJyRlbGVtZW50JywgJyR3aW5kb3cnLCdjYXJ0RGF0YScsIEN0cmxdXG5cbm1vZHVsZS5leHBvcnRzID0gZGVyIiwiXyA9IHJlcXVpcmUgJ2xvZGFzaCdcbnJlcXVpcmUgJy4uLy4uL2hlbHBlcnMnXG5cbnRlbXBsYXRlID0gJycnXG5cdDxkaXYgY2FydC1kZXIgZGF0YT1cInZtLmNhcnREYXRhLnBvaW50XCIgbWF4PVwidm0ubWF4XCIgc2FtcGxlPSd2bS5zYW1wbGUnPjwvZGl2PlxuJycnXG5cbmNsYXNzIEN0cmxcblx0Y29uc3RydWN0b3I6IChAc2NvcGUsIEBjYXJ0RGF0YSktPlxuXHRcdEBzYW1wbGUgPSBbXVxuXHRcdCMgQGNhcnQgPSBAY2FydERhdGEucG9pbnRcblx0XHRAbWF4ID0gM1xuXG5cdCMgQHByb3BlcnR5ICdtYXgnLCBnZXQ6LT5cblx0IyBcdDNcblxuZGVyID0gLT5cblx0ZGlyZWN0aXZlID0gXG5cdFx0c2NvcGU6IHt9XG5cdFx0cmVzdHJpY3Q6ICdBJ1xuXHRcdGJpbmRUb0NvbnRyb2xsZXI6IHRydWVcblx0XHR0ZW1wbGF0ZTogdGVtcGxhdGVcblx0XHRjb250cm9sbGVyOiBbJyRzY29wZScsICdjYXJ0RGF0YScsIEN0cmxdXG5cdFx0Y29udHJvbGxlckFzOiAndm0nXG5cbm1vZHVsZS5leHBvcnRzID0gZGVyXG4iLCJhbmd1bGFyID0gcmVxdWlyZSAnYW5ndWxhcidcbmQzID0gcmVxdWlyZSAnZDMnXG5yZXF1aXJlICcuLi8uLi9oZWxwZXJzJ1xuXyA9IHJlcXVpcmUgJ2xvZGFzaCdcblBsb3RDdHJsID0gcmVxdWlyZSAnLi4vLi4vZGlyZWN0aXZlcy9wbG90Q3RybCdcblxudGVtcGxhdGUgPSAnJydcblx0PHN2ZyBuZy1pbml0PSd2bS5yZXNpemUoKScgY2xhc3M9J3RvcENoYXJ0JyA+XG5cdFx0PGcgYm9pbGVycGxhdGUtZGVyIHdpZHRoPSd2bS53aWR0aCcgaGVpZ2h0PSd2bS5oZWlnaHQnIHZlci1heC1mdW49J3ZtLnZlckF4RnVuJyBob3ItYXgtZnVuPSd2bS5ob3JBeEZ1bicgdmVyPSd2bS5WZXInIGhvcj0ndm0uSG9yJyBtYXI9J3ZtLm1hcicgbmFtZT0ndm0ubmFtZSc+XG5cdFx0PC9nPlxuXHRcdDxnIGNsYXNzPSdtYWluJyBuZy1hdHRyLWNsaXAtcGF0aD0ndXJsKCN7e3ZtLm5hbWV9fSknIHNoaWZ0ZXI9J1t2bS5tYXIubGVmdCwgdm0ubWFyLnRvcF0nPlxuXHRcdFx0PGZvcmVpZ25PYmplY3Qgd2lkdGg9JzMwJyBoZWlnaHQ9JzMwJyB4PSctMTUnIHk9Jy0yMCcgc2hpZnRlcj0nW3ZtLndpZHRoLCB2bS5WZXIoMCldJz5cblx0XHRcdFx0XHQ8dGV4dCBjbGFzcz0nbGFiZWwnPiR0JDwvdGV4dD5cblx0XHRcdDwvZm9yZWlnbk9iamVjdD5cblx0XHRcdDxwYXRoIG5nLWF0dHItZD0ne3t2bS5saW5lRnVuKHZtLkRhdGEudHJhamVjdG9yeSl9fScgY2xhc3M9J2Z1biB2JyAvPlxuXHRcdFx0PHBhdGggbmctYXR0ci1kPSd7e3ZtLnRyaWFuZ2xlRGF0YX19JyBjbGFzcz0ndHJpJyAvPlxuXHRcdFx0PGxpbmUgY2xhc3M9J3RyaSBkdicgZDMtZGVyPSd7eDE6IHZtLkhvcih2bS5wb2ludC50KS0xLCB4Mjogdm0uSG9yKHZtLnBvaW50LnQpLTEsIHkxOiB2bS5WZXIodm0ucG9pbnQudiksIHkyOiB2bS5WZXIoKHZtLnBvaW50LnYgKyB2bS5wb2ludC5kdikpfScvPlxuXHRcdFx0PGZvcmVpZ25PYmplY3Qgd2lkdGg9JzMwJyBoZWlnaHQ9JzMwJyBzaGlmdGVyPSdbKHZtLkhvcih2bS5wb2ludC50KSAtIDE2KSwgdm0uc3RoaW5nXSc+XG5cdFx0XHRcdFx0PHRleHQgY2xhc3M9J3RyaS1sYWJlbCcgPiRcXFxcZG90e3l9JDwvdGV4dD5cblx0XHRcdDwvZm9yZWlnbk9iamVjdD5cblx0XHRcdDxmb3JlaWduT2JqZWN0IHdpZHRoPScxMDAnIGhlaWdodD0nMzAnIHNoaWZ0ZXI9J1t2bS5Ib3IoMS42NSksIHZtLlZlcigxLjM4KV0nPlxuXHRcdFx0XHQ8dGV4dCBjbGFzcz0ndHJpLWxhYmVsJz4kXFxcXHNpbih0KSQ8L3RleHQ+XG5cdFx0XHQ8L2ZvcmVpZ25PYmplY3Q+XG5cdFx0XHQ8Y2lyY2xlIHI9JzNweCcgIHNoaWZ0ZXI9J1t2bS5Ib3Iodm0ucG9pbnQudCksIHZtLlZlcih2bS5wb2ludC52KV0nIGNsYXNzPSdwb2ludCB2Jy8+XG5cdFx0XHQ8cmVjdCBjbGFzcz0nZXhwZXJpbWVudCcgbmctYXR0ci1oZWlnaHQ9J3t7dm0uaGVpZ2h0fX0nIG5nLWF0dHItd2lkdGg9J3t7dm0ud2lkdGh9fScgLz5cblx0XHQ8L2c+XG5cdDwvc3ZnPlxuJycnXG5cbmNsYXNzIEN0cmwgZXh0ZW5kcyBQbG90Q3RybFxuXHRjb25zdHJ1Y3RvcjogKEBzY29wZSwgQGVsLCBAd2luZG93LCBARGF0YSktPlxuXHRcdHN1cGVyIEBzY29wZSwgQGVsLCBAd2luZG93XG5cdFx0QG5hbWUgPSAnZGVyaXZhdGl2ZUEnXG5cdFx0QFZlci5kb21haW4gWy0xLjUsMS41XVxuXHRcdEBIb3IuZG9tYWluIFswLDZdXG5cdFx0QGxpbmVGdW5cblx0XHRcdC55IChkKT0+IEBWZXIgZC52XG5cdFx0XHQueCAoZCk9PiBASG9yIGQudFxuXG5cdFx0c2V0VGltZW91dCA9PlxuXHRcdFx0QERhdGEucGxheSgpXG5cblx0bW92ZTogPT5cblx0XHR0ID0gQEhvci5pbnZlcnQgZXZlbnQueCAtIGV2ZW50LnRhcmdldC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS5sZWZ0XG5cdFx0QERhdGEuc2V0VCB0XG5cdFx0QHNjb3BlLiRldmFsQXN5bmMoKVxuXG5cdEBwcm9wZXJ0eSAnc3RoaW5nJywgZ2V0Oi0+XG5cdFx0QFZlcihAcG9pbnQuZHYvMiArIEBwb2ludC52KSAtIDdcblxuXHRAcHJvcGVydHkgJ3BvaW50JywgZ2V0Oi0+XG5cdFx0QERhdGEucG9pbnRcblxuXHRAcHJvcGVydHkgJ3RyaWFuZ2xlRGF0YScsIGdldDotPlxuXHRcdEBsaW5lRnVuIFt7djogQHBvaW50LnYsIHQ6IEBwb2ludC50fSwge3Y6QHBvaW50LmR2ICsgQHBvaW50LnYsIHQ6IEBwb2ludC50KzF9LCB7djogQHBvaW50LmR2ICsgQHBvaW50LnYsIHQ6IEBwb2ludC50fV1cblxuXG5kZXIgPSAtPlxuXHRkaXJlY3RpdmUgPSBcblx0XHRjb250cm9sbGVyQXM6ICd2bSdcblx0XHRzY29wZToge31cblx0XHRsaW5rOiAoc2NvcGUsIGVsLCBhdHRyLCB2bSktPlxuXHRcdFx0ZDMuc2VsZWN0IGVsWzBdXG5cdFx0XHRcdC5zZWxlY3QgJ3JlY3QuYmFja2dyb3VuZCdcblx0XHRcdFx0Lm9uICdtb3VzZW92ZXInLC0+XG5cdFx0XHRcdFx0dm0uRGF0YS5wYXVzZSgpXG5cdFx0XHRcdC5vbiAnbW91c2Vtb3ZlJywgLT5cblx0XHRcdFx0XHR2bS5tb3ZlKClcblx0XHRcdFx0Lm9uICdtb3VzZW91dCcsIC0+XG5cdFx0XHRcdFx0dm0uRGF0YS5wbGF5KClcblx0XHR0ZW1wbGF0ZTogdGVtcGxhdGVcblx0XHR0ZW1wbGF0ZU5hbWVzcGFjZTogJ3N2Zydcblx0XHRjb250cm9sbGVyOiBbJyRzY29wZScsJyRlbGVtZW50JywgJyR3aW5kb3cnLCdkZXJpdmF0aXZlRGF0YScsIEN0cmxdXG5cbm1vZHVsZS5leHBvcnRzID0gZGVyXG4iLCJhbmd1bGFyID0gcmVxdWlyZSAnYW5ndWxhcidcbmQzID0gcmVxdWlyZSAnZDMnXG5yZXF1aXJlICcuLi8uLi9oZWxwZXJzJ1xuXyA9IHJlcXVpcmUgJ2xvZGFzaCdcbiMgRGF0YSA9IHJlcXVpcmUgJy4vZGVyaXZhdGl2ZURhdGEnXG5QbG90Q3RybCA9IHJlcXVpcmUgJy4uLy4uL2RpcmVjdGl2ZXMvcGxvdEN0cmwnXG5cbnRlbXBsYXRlID0gJycnXG5cdDxzdmcgbmctaW5pdD0ndm0ucmVzaXplKCknIGNsYXNzPSd0b3BDaGFydCc+XG5cdFx0PGcgYm9pbGVycGxhdGUtZGVyIHdpZHRoPSd2bS53aWR0aCcgaGVpZ2h0PSd2bS5oZWlnaHQnIHZlci1heC1mdW49J3ZtLnZlckF4RnVuJyBob3ItYXgtZnVuPSd2bS5ob3JBeEZ1bicgdmVyPSd2bS5WZXInIGhvcj0ndm0uSG9yJyBtYXI9J3ZtLm1hcicgbmFtZT0ndm0ubmFtZSc+PC9nPlxuXHRcdDxnIGNsYXNzPSdtYWluJyBuZy1hdHRyLWNsaXAtcGF0aD1cInVybCgje3t2bS5uYW1lfX0pXCIgc2hpZnRlcj0nW3ZtLm1hci5sZWZ0LCB2bS5tYXIudG9wXSc+XG5cdFx0XHQ8Zm9yZWlnbk9iamVjdCB3aWR0aD0nMzAnIGhlaWdodD0nMzAnIHg9Jy0xNScgeT0nLTIwJyBzaGlmdGVyPSdbdm0ud2lkdGgsIHZtLlZlcigwKV0nPlxuXHRcdFx0XHRcdDx0ZXh0IGNsYXNzPSdsYWJlbCc+JHQkPC90ZXh0PlxuXHRcdFx0PC9mb3JlaWduT2JqZWN0PlxuXHRcdFx0PHBhdGggZDMtZGVyPSd7ZDp2bS5saW5lRnVuKHZtLkRhdGEudHJhamVjdG9yeSl9JyBjbGFzcz0nZnVuIGR2JyAvPlxuXHRcdFx0PGxpbmUgY2xhc3M9J3RyaSBkdicgZDMtZGVyPSd7eDE6IHZtLkhvcih2bS5wb2ludC50KSwgeDI6IHZtLkhvcih2bS5wb2ludC50KSwgeTE6IHZtLlZlcigwKSwgeTI6IHZtLlZlcih2bS5wb2ludC5kdil9Jy8+XG5cdFx0XHQ8Zm9yZWlnbk9iamVjdCB3aWR0aD0nMzAnIGhlaWdodD0nMzAnIHNoaWZ0ZXI9J1sodm0uSG9yKHZtLnBvaW50LnQpIC0gMTYpLCB2bS5WZXIodm0ucG9pbnQuZHYqLjUpLTZdJz5cblx0XHRcdFx0XHQ8dGV4dCBjbGFzcz0ndHJpLWxhYmVsJz4kXFxcXGRvdHt5fSQ8L3RleHQ+XG5cdFx0XHQ8L2ZvcmVpZ25PYmplY3Q+XG5cdFx0XHQ8Zm9yZWlnbk9iamVjdCB3aWR0aD0nMTAwJyBoZWlnaHQ9JzMwJyBzaGlmdGVyPSdbdm0uSG9yKC45KSwgdm0uVmVyKDEpXSc+XG5cdFx0XHRcdDx0ZXh0IGNsYXNzPSd0cmktbGFiZWwnPiRcXFxcY29zKHQpJDwvdGV4dD5cblx0XHRcdDwvZm9yZWlnbk9iamVjdD5cblx0XHRcdDxjaXJjbGUgcj0nNHB4JyAgc2hpZnRlcj0nW3ZtLkhvcih2bS5wb2ludC50KSwgdm0uVmVyKHZtLnBvaW50LmR2KV0nIGNsYXNzPSdwb2ludCBkdicvPlxuXHRcdFx0PHJlY3QgY2xhc3M9J2V4cGVyaW1lbnQnIG5nLWF0dHItaGVpZ2h0PSd7e3ZtLmhlaWdodH19JyBuZy1hdHRyLXdpZHRoPSd7e3ZtLndpZHRofX0nIC8+XG5cdFx0PC9nPlxuXHQ8L3N2Zz5cbicnJ1xuXG5jbGFzcyBDdHJsIGV4dGVuZHMgUGxvdEN0cmxcblx0Y29uc3RydWN0b3I6IChAc2NvcGUsIEBlbCwgQHdpbmRvdywgQERhdGEpLT5cblx0XHRzdXBlciBAc2NvcGUsIEBlbCwgQHdpbmRvd1xuXHRcdEBWZXIuZG9tYWluIFstMS41LDEuNV1cblx0XHRASG9yLmRvbWFpbiBbMCw2XVxuXHRcdEBuYW1lID0gJ2Rlcml2YXRpdmVCJ1xuXHRcdEBsaW5lRnVuXG5cdFx0XHQueSAoZCk9PiBAVmVyIGQuZHZcblx0XHRcdC54IChkKT0+IEBIb3IgZC50XG5cblx0bW92ZTogPT5cblx0XHR0ID0gQEhvci5pbnZlcnQgZXZlbnQueCAtIGV2ZW50LnRhcmdldC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS5sZWZ0XG5cdFx0QERhdGEuc2V0VCB0XG5cdFx0QHNjb3BlLiRldmFsQXN5bmMoKVxuXG5cdEBwcm9wZXJ0eSAncG9pbnQnLCBnZXQ6LT5cblx0XHRARGF0YS5wb2ludFxuXG5kZXIgPSAtPlxuXHRkaXJlY3RpdmUgPSBcblx0XHRjb250cm9sbGVyQXM6ICd2bSdcblx0XHRzY29wZToge31cblx0XHRsaW5rOiAoc2NvcGUsZWwsYXR0ciwgdm0pLT5cblx0XHRcdGQzLnNlbGVjdCBlbFswXVxuXHRcdFx0XHQuc2VsZWN0ICdyZWN0LmJhY2tncm91bmQnXG5cdFx0XHRcdC5vbiAnbW91c2VvdmVyJywtPlxuXHRcdFx0XHRcdHZtLkRhdGEucGF1c2UoKVxuXHRcdFx0XHQub24gJ21vdXNlbW92ZScsIC0+XG5cdFx0XHRcdFx0dm0ubW92ZSgpXG5cdFx0XHRcdC5vbiAnbW91c2VvdXQnLCAtPlxuXHRcdFx0XHRcdHZtLkRhdGEucGxheSgpXG5cdFx0dGVtcGxhdGU6IHRlbXBsYXRlXG5cdFx0dGVtcGxhdGVOYW1lc3BhY2U6ICdzdmcnXG5cdFx0Y29udHJvbGxlcjogWyckc2NvcGUnLCckZWxlbWVudCcsICckd2luZG93JywgJ2Rlcml2YXRpdmVEYXRhJywgQ3RybF1cblxubW9kdWxlLmV4cG9ydHMgPSBkZXJcbiIsIl8gPSByZXF1aXJlICdsb2Rhc2gnXG52RnVuID0gTWF0aC5zaW5cbmR2RnVuID0gTWF0aC5jb3NcblxuY2xhc3MgU2VydmljZVxuXHRjb25zdHJ1Y3RvcjogKCRyb290U2NvcGUpLT5cblx0XHRAcm9vdFNjb3BlID0gJHJvb3RTY29wZVxuXHRcdEBzZXRUIDBcblx0XHRAcGF1c2VkID0gIGZhbHNlXG5cdFx0QHRyYWplY3RvcnkgPSBfLnJhbmdlIDAgLCA2ICwgMS8xMFxuXHRcdFx0Lm1hcCAodCktPlxuXHRcdFx0XHRyZXMgPSBcblx0XHRcdFx0XHRkdjogZHZGdW4gdFxuXHRcdFx0XHRcdHY6IHZGdW4gdFxuXHRcdFx0XHRcdHQ6IHRcblx0XHRAbW92ZSAwIFxuXG5cdGNsaWNrOiAtPlxuXHRcdGlmIEBwYXVzZWQgdGhlbiBAcGxheSgpIGVsc2UgQHBhdXNlKClcblxuXHRwYXVzZTogLT5cblx0XHRAcGF1c2VkID0gdHJ1ZVxuXG5cdGluY3JlbWVudDooZHQpIC0+XG5cdFx0QHQgKz0gZHRcblx0XHRAbW92ZShAdClcblxuXHRzZXRUOiAodCktPlxuXHRcdEB0ID0gdFxuXHRcdEBtb3ZlKEB0KVxuXG5cdHBsYXk6IC0+XG5cdFx0QHBhdXNlZCA9IHRydWVcblx0XHRkMy50aW1lci5mbHVzaCgpXG5cdFx0QHBhdXNlZCA9IGZhbHNlXG5cdFx0bGFzdCA9IDBcblx0XHRkMy50aW1lciAoZWxhcHNlZCk9PlxuXHRcdFx0XHRkdCA9IGVsYXBzZWQgLSBsYXN0XG5cdFx0XHRcdEBpbmNyZW1lbnQgZHQvMTAwMFxuXHRcdFx0XHRsYXN0ID0gZWxhcHNlZFxuXHRcdFx0XHRpZiBAdCA+IDYgdGhlbiBAc2V0VCAwXG5cdFx0XHRcdEByb290U2NvcGUuJGV2YWxBc3luYygpXG5cdFx0XHRcdEBwYXVzZWRcblx0XHRcdCwgMVxuXG5cdG1vdmU6ICh0KS0+XG5cdFx0QHBvaW50ID0gXG5cdFx0XHRkdjogZHZGdW4gdFxuXHRcdFx0djogdkZ1biB0XG5cdFx0XHR0OiB0XG5cbm1vZHVsZS5leHBvcnRzID0gU2VydmljZSIsInJlcXVpcmUgJy4uLy4uL2hlbHBlcnMnXG5QbG90Q3RybCA9IHJlcXVpcmUgJy4uLy4uL2RpcmVjdGl2ZXMvcGxvdEN0cmwnXG5cbnRlbXBsYXRlID0gJycnXG5cdDxzdmcgbmctaW5pdD0ndm0ucmVzaXplKCknIGNsYXNzPSdib3R0b21DaGFydCcgPlxuXHRcdDxnIGJvaWxlcnBsYXRlLWRlciB3aWR0aD0ndm0ud2lkdGgnIGhlaWdodD0ndm0uaGVpZ2h0JyB2ZXItYXgtZnVuPSd2bS52ZXJBeEZ1bicgaG9yLWF4LWZ1bj0ndm0uaG9yQXhGdW4nIHZlcj0ndm0uVmVyJyBob3I9J3ZtLkhvcicgbWFyPSd2bS5tYXInIG5hbWU9J1wiZGVzaWduQVwiJz5cblx0XHRcdDxmb3JlaWduT2JqZWN0IHdpZHRoPSczMCcgaGVpZ2h0PSczMCcgeT0nNScgeD0nLTgnIHNoaWZ0ZXI9J1t2bS53aWR0aCwgdm0uaGVpZ2h0XSc+XG5cdFx0XHRcdFx0PHRleHQgY2xhc3M9J2xhYmVsJyA+JHQkPC90ZXh0PlxuXHRcdFx0PC9mb3JlaWduT2JqZWN0PlxuXHRcdFx0PGZvcmVpZ25PYmplY3Qgd2lkdGg9JzMwJyBoZWlnaHQ9JzMwJyB5PScwJyB4PSctMTUnIHNoaWZ0ZXI9J1swLCAwXSc+XG5cdFx0XHRcdFx0PHRleHQgY2xhc3M9J2xhYmVsJyA+JHYkPC90ZXh0PlxuXHRcdFx0PC9mb3JlaWduT2JqZWN0PlxuXHRcdDwvZz5cblx0XHQ8ZyBjbGFzcz0nbWFpbicgY2xpcC1wYXRoPVwidXJsKCNkZXNpZ25BKVwiIHNoaWZ0ZXI9J1t2bS5tYXIubGVmdCwgdm0ubWFyLnRvcF0nID5cblx0XHRcdDxyZWN0IHN0eWxlPSdvcGFjaXR5OjAnIG5nLWF0dHItaGVpZ2h0PSd7e3ZtLmhlaWdodH19JyBuZy1hdHRyLXdpZHRoPSd7e3ZtLndpZHRofX0nIGJlaGF2aW9yPSd2bS5kcmFnX3JlY3QnPjwvcmVjdD5cblx0XHRcdDxnIG5nLWNsYXNzPSd7aGlkZTogIXZtLkRhdGEuc2hvd30nID5cblx0XHRcdFx0PGxpbmUgY2xhc3M9J3RyaSB2JyBkMy1kZXI9J3t4MTogdm0uSG9yKHZtLnNlbGVjdGVkLnQpLTEsIHgyOiB2bS5Ib3Iodm0uc2VsZWN0ZWQudCktMSwgeTE6IHZtLlZlcigwKSwgeTI6IHZtLlZlcih2bS5zZWxlY3RlZC52KX0nLz5cblx0XHRcdFx0PHBhdGggbmctYXR0ci1kPSd7e3ZtLnRyaWFuZ2xlRGF0YSgpfX0nIGNsYXNzPSd0cmknIC8+XG5cdFx0XHRcdDxsaW5lIGQzLWRlcj0ne3gxOiB2bS5Ib3Iodm0uc2VsZWN0ZWQudCkrMSwgeDI6IHZtLkhvcih2bS5zZWxlY3RlZC50KSsxLCB5MTogdm0uVmVyKHZtLnNlbGVjdGVkLnYpLCB5Mjogdm0uVmVyKHZtLnNlbGVjdGVkLnYgKyB2bS5zZWxlY3RlZC5kdil9JyBjbGFzcz0ndHJpIGR2JyAvPlxuXHRcdFx0PC9nPlxuXHRcdFx0PHBhdGggbmctYXR0ci1kPSd7e3ZtLmxpbmVGdW4odm0udHJ1ZUNhcnQudHJhamVjdG9yeSl9fScgY2xhc3M9J2Z1biB0YXJnZXQnIC8+XG5cdFx0XHQ8cGF0aCBuZy1hdHRyLWQ9J3t7dm0ubGluZUZ1bih2bS5mYWtlQ2FydC5kb3RzKX19JyBjbGFzcz0nZnVuIHYnIC8+XG5cdFx0XHQ8ZyBuZy1yZXBlYXQ9J2RvdCBpbiB2bS5kb3RzIHRyYWNrIGJ5IGRvdC5pZCcgZGF0dW09ZG90IHNoaWZ0ZXI9J1t2bS5Ib3IoZG90LnQpLHZtLlZlcihkb3QudildJyBiZWhhdmlvcj0ndm0uZHJhZycgZG90LWEtZGVyPWRvdCA+PC9nPlxuXHRcdFx0PGNpcmNsZSBjbGFzcz0nZG90IHNtYWxsJyByPSc0JyBzaGlmdGVyPSdbdm0uSG9yKDApLHZtLlZlcigyKV0nIC8+XG5cdFx0XHQ8Zm9yZWlnbk9iamVjdCB3aWR0aD0nNzAnIGhlaWdodD0nMzAnIHNoaWZ0ZXI9J1t2bS5Ib3IoMy43KSwgdm0uVmVyKC4zMyldJz5cblx0XHRcdFx0XHQ8dGV4dCBjbGFzcz0ndHJpLWxhYmVsJyA+JDJlXnstLjh0fSQ8L3RleHQ+XG5cdFx0XHQ8L2ZvcmVpZ25PYmplY3Q+XG5cdFx0XHQ8Y2lyY2xlIHI9JzRweCcgIHNoaWZ0ZXI9J1t2bS5Ib3Iodm0uRGF0YS50KSwgdm0uVmVyKHZtLmZha2VDYXJ0LnYpXScgY2xhc3M9J3BvaW50IGZha2UnLz5cblx0XHRcdDxjaXJjbGUgcj0nNHB4JyAgc2hpZnRlcj0nW3ZtLkhvcih2bS5EYXRhLnQpLCB2bS5WZXIodm0udHJ1ZUNhcnQudildJyBjbGFzcz0ncG9pbnQgcmVhbCcvPlxuXHRcdFx0PHJlY3QgY2xhc3M9J2V4cGVyaW1lbnQnIG5nLWF0dHItaGVpZ2h0PSd7e3ZtLmhlaWdodH19JyBuZy1hdHRyLXdpZHRoPSd7e3ZtLndpZHRofX0nIC8+XG5cdFx0PC9nPlxuXHQ8L3N2Zz5cbicnJ1xuXG5jbGFzcyBDdHJsIGV4dGVuZHMgUGxvdEN0cmxcblx0Y29uc3RydWN0b3I6IChAc2NvcGUsIEBlbCwgQHdpbmRvdywgQGZha2VDYXJ0LCBAdHJ1ZUNhcnQsIEBEYXRhKS0+XG5cdFx0c3VwZXIgQHNjb3BlLCBAZWwsIEB3aW5kb3dcblx0XHRAVmVyLmRvbWFpbiBbLS4xLDIuM11cblx0XHRASG9yLmRvbWFpbiBbLS4xLDQuNV1cblxuXHRcdEB0cmFuID0gKHRyYW4pLT5cblx0XHRcdHRyYW4uZHVyYXRpb24gMzBcblx0XHRcdFx0LmVhc2UgJ2xpbmVhcidcblxuXHRcdEBsaW5lRnVuXG5cdFx0XHQueSAoZCk9PiBAVmVyIGQudlxuXHRcdFx0LnggKGQpPT4gQEhvciBkLnRcblxuXHRcdEBkcmFnX3JlY3QgPSBkMy5iZWhhdmlvci5kcmFnKClcblx0XHRcdC5vbiAnZHJhZ3N0YXJ0JywgKCk9PlxuXHRcdFx0XHRkMy5ldmVudC5zb3VyY2VFdmVudC5zdG9wUHJvcGFnYXRpb24oKVxuXHRcdFx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpXG5cdFx0XHRcdGlmIGV2ZW50LndoaWNoID09IDNcblx0XHRcdFx0XHRyZXR1cm4gXG5cdFx0XHRcdEBEYXRhLnNldF9zaG93IHRydWVcblx0XHRcdFx0cmVjdCA9IGV2ZW50LnRvRWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKVxuXHRcdFx0XHR0ID0gQEhvci5pbnZlcnQgZXZlbnQueCAtIHJlY3QubGVmdFxuXHRcdFx0XHR2ICA9IEBWZXIuaW52ZXJ0IGV2ZW50LnkgLSByZWN0LnRvcFxuXHRcdFx0XHRAZmFrZUNhcnQuYWRkX2RvdCB0ICwgdlxuXHRcdFx0XHRAc2NvcGUuJGV2YWxBc3luYygpXG5cdFx0XHQub24gJ2RyYWcnLCA9PiBAb25fZHJhZyBAc2VsZWN0ZWRcblx0XHRcdC5vbiAnZHJhZ2VuZCcsPT5cblx0XHRcdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKVxuXHRcdFx0XHRARGF0YS5zZXRfc2hvdyB0cnVlXG5cdFx0XHRcdGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpXG5cblx0XHRAZHJhZyA9IGQzLmJlaGF2aW9yLmRyYWcoKVxuXHRcdFx0Lm9uICdkcmFnc3RhcnQnLCAoZG90KT0+XG5cdFx0XHRcdGQzLmV2ZW50LnNvdXJjZUV2ZW50LnN0b3BQcm9wYWdhdGlvbigpXG5cdFx0XHRcdGlmIGV2ZW50LndoaWNoID09IDNcblx0XHRcdFx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpXG5cdFx0XHRcdFx0QGZha2VDYXJ0LnJlbW92ZV9kb3QgZG90XG5cdFx0XHRcdFx0QERhdGEuc2V0X3Nob3cgZmFsc2Vcblx0XHRcdFx0XHRAc2NvcGUuJGV2YWxBc3luYygpXG5cdFx0XHQub24gJ2RyYWcnLCBAb25fZHJhZ1xuXG5cdFx0QERhdGEucGxheSgpXG5cblx0QHByb3BlcnR5ICdkb3RzJywgZ2V0Oi0+IFxuXHRcdEBmYWtlQ2FydC5kb3RzLmZpbHRlciAoZCktPiAoZC5pZCAhPSdmaXJzdCcpIGFuZCAoZC5pZCAhPSdsYXN0JylcblxuXHRAcHJvcGVydHkgJ3NlbGVjdGVkJywgZ2V0Oi0+IEBmYWtlQ2FydC5zZWxlY3RlZFxuXG5cdG9uX2RyYWc6IChkb3QpPT4gXG5cdFx0XHRAZmFrZUNhcnQudXBkYXRlX2RvdCBkb3QsIEBIb3IuaW52ZXJ0KGQzLmV2ZW50LngpLCBAVmVyLmludmVydChkMy5ldmVudC55KVxuXHRcdFx0QHNjb3BlLiRldmFsQXN5bmMoKVxuXG5cdHRyaWFuZ2xlRGF0YTotPlxuXHRcdHBvaW50ID0gQHNlbGVjdGVkXG5cdFx0QGxpbmVGdW4gW3t2OiBwb2ludC52LCB0OiBwb2ludC50fSwge3Y6cG9pbnQuZHYgKyBwb2ludC52LCB0OiBwb2ludC50KzF9LCB7djogcG9pbnQuZHYgKyBwb2ludC52LCB0OiBwb2ludC50fV1cblxuZGVyID0gKCktPlxuXHRkaXJlY3RpdmUgPSBcblx0XHRjb250cm9sbGVyQXM6ICd2bSdcblx0XHRzY29wZToge31cblx0XHR0ZW1wbGF0ZTogdGVtcGxhdGVcblx0XHR0ZW1wbGF0ZU5hbWVzcGFjZTogJ3N2Zydcblx0XHRjb250cm9sbGVyOiBbJyRzY29wZScsJyRlbGVtZW50JywgJyR3aW5kb3cnLCAnZmFrZUNhcnQnLCAndHJ1ZUNhcnQnLCAnZGVzaWduRGF0YScsIEN0cmxdXG5cbm1vZHVsZS5leHBvcnRzID0gZGVyXG4iLCJyZXF1aXJlICcuLi8uLi9oZWxwZXJzJ1xuUGxvdEN0cmwgPSByZXF1aXJlICcuLi8uLi9kaXJlY3RpdmVzL3Bsb3RDdHJsJ1xuXG50ZW1wbGF0ZSA9ICcnJ1xuXHQ8c3ZnIG5nLWluaXQ9J3ZtLnJlc2l6ZSgpJyAgY2xhc3M9J2JvdHRvbUNoYXJ0Jz5cblx0XHQ8ZyBib2lsZXJwbGF0ZS1kZXIgd2lkdGg9J3ZtLndpZHRoJyBoZWlnaHQ9J3ZtLmhlaWdodCcgdmVyLWF4LWZ1bj0ndm0udmVyQXhGdW4nIGhvci1heC1mdW49J3ZtLmhvckF4RnVuJyB2ZXI9J3ZtLlZlcicgaG9yPSd2bS5Ib3InIG1hcj0ndm0ubWFyJyBuYW1lPSdcImRlc2lnbkJcIic+XG5cdFx0XHQ8Zm9yZWlnbk9iamVjdCB3aWR0aD0nMzAnIGhlaWdodD0nMzAnIHk9JzUnIHg9Jy04JyBzaGlmdGVyPSdbdm0ud2lkdGgsIHZtLmhlaWdodF0nPlxuXHRcdFx0XHRcdDx0ZXh0IGNsYXNzPSdsYWJlbCcgPiR0JDwvdGV4dD5cblx0XHRcdDwvZm9yZWlnbk9iamVjdD5cblx0XHRcdDxmb3JlaWduT2JqZWN0IHdpZHRoPSczMCcgaGVpZ2h0PSczMCcgeT0nMCcgeD0nLTE1JyBzaGlmdGVyPSdbMCwgMF0nPlxuXHRcdFx0XHRcdDx0ZXh0IGNsYXNzPSdsYWJlbCcgPiR2JDwvdGV4dD5cblx0XHRcdDwvZm9yZWlnbk9iamVjdD5cblx0XHQ8L2c+XG5cdFx0PGcgY2xhc3M9J21haW4nIGNsaXAtcGF0aD1cInVybCgjZGVzaWduQilcIiBzaGlmdGVyPSdbdm0ubWFyLmxlZnQsIHZtLm1hci50b3BdJz5cdFxuXHRcdFx0PHBhdGggbmctYXR0ci1kPSd7e3ZtLmxpbmVGdW4odm0udHJ1ZUNhcnQudHJhamVjdG9yeSl9fScgY2xhc3M9J2Z1biB0YXJnZXQnIC8+XG5cdFx0XHQ8ZyBuZy1jbGFzcz0ne2hpZGU6ICF2bS5EYXRhLnNob3d9JyA+XG5cdFx0XHRcdDxsaW5lIGNsYXNzPSd0cmkgdicgZDMtZGVyPSd7eDE6IHZtLkhvcigwKSwgeDI6IHZtLkhvcih2bS5zZWxlY3RlZC52KSwgeTE6IHZtLlZlcih2bS5zZWxlY3RlZC5kdiksIHkyOiB2bS5WZXIodm0uc2VsZWN0ZWQuZHYpfScvPlxuXHRcdFx0XHQ8bGluZSBjbGFzcz0ndHJpIGR2JyBkMy1kZXI9J3t4MTogdm0uSG9yKHZtLnNlbGVjdGVkLnYpLCB4Mjogdm0uSG9yKHZtLnNlbGVjdGVkLnYpLCB5MTogdm0uVmVyKDApLCB5Mjogdm0uVmVyKHZtLnNlbGVjdGVkLmR2KX0nLz5cblx0XHRcdFx0PHBhdGggZDMtZGVyPSd7ZDp2bS5saW5lRnVuKHZtLnRydWVDYXJ0LnRyYWplY3RvcnkpfScgY2xhc3M9J2Z1biBjb3JyZWN0JyBuZy1jbGFzcz0ne2hpZGU6ICF2bS5EYXRhLmNvcnJlY3R9JyAvPlxuXHRcdFx0PC9nPlxuXHRcdFx0PGcgbmctcmVwZWF0PSdkb3QgaW4gdm0uZG90cyB0cmFjayBieSBkb3QuaWQnIHNoaWZ0ZXI9J1t2bS5Ib3IoZG90LnYpLHZtLlZlcihkb3QuZHYpXScgZG90LWItZGVyPWRvdD48L2c+XG5cdFx0XHQ8Zm9yZWlnbk9iamVjdCB3aWR0aD0nNzAnIGhlaWdodD0nMzAnIHk9JzAnIHNoaWZ0ZXI9J1t2bS5Ib3IoLjMpLCB2bS5WZXIoLS4xKV0nPlxuXHRcdFx0XHRcdDx0ZXh0IGNsYXNzPSd0cmktbGFiZWwnID4kdic9LS44diQ8L3RleHQ+XG5cdFx0XHQ8L2ZvcmVpZ25PYmplY3Q+XG5cdFx0XHQ8cmVjdCBjbGFzcz0nZXhwZXJpbWVudCcgbmctYXR0ci1oZWlnaHQ9J3t7dm0uaGVpZ2h0fX0nIG5nLWF0dHItd2lkdGg9J3t7dm0ud2lkdGh9fScgLz5cblx0XHQ8L2c+XG5cdDwvc3ZnPlxuJycnXG5cbmNsYXNzIEN0cmwgZXh0ZW5kcyBQbG90Q3RybFxuXHRjb25zdHJ1Y3RvcjogKEBzY29wZSwgQGVsLCBAd2luZG93LCBAZmFrZUNhcnQsIEB0cnVlQ2FydCwgQERhdGEpLT5cblx0XHRzdXBlciBAc2NvcGUsIEBlbCwgQHdpbmRvd1xuXG5cdFx0QFZlci5kb21haW4gWy0xLjcsIC4yXVxuXHRcdEBIb3IuZG9tYWluIFstLjEsMi4xNV1cblxuXHRcdEBsaW5lRnVuXG5cdFx0XHQueSAoZCk9PiBAVmVyIGQuZHZcblx0XHRcdC54IChkKT0+IEBIb3IgZC52XG5cblx0QHByb3BlcnR5ICdkb3RzJywgZ2V0Oi0+XG5cdFx0QGZha2VDYXJ0LmRvdHMuZmlsdGVyIChkKS0+IChkLmlkICE9J2ZpcnN0JykgYW5kIChkLmlkICE9J2xhc3QnKVxuXG5cdEBwcm9wZXJ0eSAnc2VsZWN0ZWQnLCBnZXQ6LT4gQGZha2VDYXJ0LnNlbGVjdGVkXG5cdFx0XG5cbmRlciA9ICgpLT5cblx0ZGlyZWN0aXZlID0gXG5cdFx0Y29udHJvbGxlckFzOiAndm0nXG5cdFx0c2NvcGU6IHt9XG5cdFx0dGVtcGxhdGU6IHRlbXBsYXRlXG5cdFx0dGVtcGxhdGVOYW1lc3BhY2U6ICdzdmcnXG5cdFx0Y29udHJvbGxlcjogWyckc2NvcGUnLCckZWxlbWVudCcsICckd2luZG93JywgJ2Zha2VDYXJ0JywgJ3RydWVDYXJ0JywgJ2Rlc2lnbkRhdGEnLCBDdHJsXVxuXG5tb2R1bGUuZXhwb3J0cyA9IGRlclxuIiwiXyA9IHJlcXVpcmUgJ2xvZGFzaCdcbnJlcXVpcmUgJy4uLy4uL2hlbHBlcnMnXG5cbnRlbXBsYXRlID0gJycnXG5cdDxkaXYgY2FydC1kZXIgZGF0YT1cInZtLmZha2VDYXJ0XCIgbWF4PVwidm0ubWF4XCIgc2FtcGxlPSd2bS5zYW1wbGUnPjwvZGl2PlxuJycnXG5cbmNsYXNzIEN0cmxcblx0Y29uc3RydWN0b3I6IChAc2NvcGUsIEBmYWtlQ2FydCktPlxuXHRcdEBtYXggPSA0XG5cdFx0QHNhbXBsZSA9IF8ucmFuZ2UgMCwgNSAsIC41XG5cblx0QHByb3BlcnR5ICdtYXgnLCBnZXQ6LT5cblx0XHRAZmFrZUNhcnQubG9jIDQuNVxuXG5kZXIgPSAtPlxuXHRkaXJlY3RpdmUgPSBcblx0XHRzY29wZToge31cblx0XHRyZXN0cmljdDogJ0EnXG5cdFx0YmluZFRvQ29udHJvbGxlcjogdHJ1ZVxuXHRcdHRlbXBsYXRlOiB0ZW1wbGF0ZVxuXHRcdGNvbnRyb2xsZXI6IFsnJHNjb3BlJywgJ2Zha2VDYXJ0JywgQ3RybF1cblx0XHRjb250cm9sbGVyQXM6ICd2bSdcblxubW9kdWxlLmV4cG9ydHMgPSBkZXJcbiIsIl8gPSByZXF1aXJlICdsb2Rhc2gnXG5yZXF1aXJlICcuLi8uLi9oZWxwZXJzJ1xuXG50ZW1wbGF0ZSA9ICcnJ1xuXHQ8ZGl2IGNhcnQtZGVyIGRhdGE9XCJ2bS50cnVlQ2FydFwiIG1heD1cInZtLm1heFwiIHNhbXBsZT0ndm0uc2FtcGxlJz48L2Rpdj5cbicnJ1xuXG5jbGFzcyBDdHJsXG5cdGNvbnN0cnVjdG9yOiAoQHNjb3BlLCBAdHJ1ZUNhcnQsIEBmYWtlQ2FydCktPlxuXHRcdEBtYXggPSA0XG5cdFx0QHNhbXBsZSA9IF8ucmFuZ2UgMCwgNSAsIC41XG5cblx0QHByb3BlcnR5ICdtYXgnLCBnZXQ6LT5cblx0XHRAZmFrZUNhcnQubG9jIDQuNVxuXG5kZXIgPSAtPlxuXHRkaXJlY3RpdmUgPSBcblx0XHRzY29wZToge31cblx0XHRyZXN0cmljdDogJ0EnXG5cdFx0YmluZFRvQ29udHJvbGxlcjogdHJ1ZVxuXHRcdHRlbXBsYXRlOiB0ZW1wbGF0ZVxuXHRcdGNvbnRyb2xsZXI6IFsnJHNjb3BlJywgJ3RydWVDYXJ0JywgJ2Zha2VDYXJ0JywgQ3RybF1cblx0XHRjb250cm9sbGVyQXM6ICd2bSdcblxubW9kdWxlLmV4cG9ydHMgPSBkZXJcbiIsImFuZ3VsYXIgPSByZXF1aXJlICdhbmd1bGFyJ1xuZDMgPSByZXF1aXJlICdkMydcbnJlcXVpcmUgJy4uLy4uL2hlbHBlcnMnXG5cbmNsYXNzIFNlcnZpY2Vcblx0Y29uc3RydWN0b3I6IChAcm9vdFNjb3BlKS0+XG5cdFx0QHQgPSAwXG5cdFx0QHNob3cgPSBAcGF1c2VkID0gZmFsc2VcblxuXHRjbGljazogLT5cblx0XHRpZiBAcGF1c2VkIHRoZW4gQHBsYXkoKSBlbHNlIEBwYXVzZSgpXG5cblx0aW5jcmVtZW50OiAoZHQpLT5cblx0XHRAdCs9ZHRcblxuXHRzZXRUOiAodCktPlxuXHRcdEB0ID0gdFxuXG5cdHNldF9zaG93OiAodiktPlxuXHRcdEBzaG93ID0gdlxuXG5cdHBsYXk6IC0+XG5cdFx0QHBhdXNlZCA9IHRydWVcblx0XHRkMy50aW1lci5mbHVzaCgpXG5cdFx0QHBhdXNlZCA9IGZhbHNlXG5cdFx0bGFzdCA9IDBcblx0XHRjb25zb2xlLmxvZyAnYXNkZidcblx0XHRkMy50aW1lciAoZWxhcHNlZCk9PlxuXHRcdFx0XHRkdCA9IGVsYXBzZWQgLSBsYXN0XG5cdFx0XHRcdEBpbmNyZW1lbnQgZHQvMTAwMFxuXHRcdFx0XHRsYXN0ID0gZWxhcHNlZFxuXHRcdFx0XHRpZiBAdCA+IDQuNSB0aGVuIEBzZXRUIDBcblx0XHRcdFx0QHJvb3RTY29wZS4kZXZhbEFzeW5jKClcblx0XHRcdFx0QHBhdXNlZFxuXHRcdFx0LCAxXG5cblx0cGF1c2U6IC0+IEBwYXVzZWQgPSB0cnVlXG5cbm1vZHVsZS5leHBvcnRzID0gWyckcm9vdFNjb3BlJywgU2VydmljZV0iLCJ0ZW1wbGF0ZSA9ICcnJ1xuXHQ8Y2lyY2xlIGNsYXNzPSdkb3QgbGFyZ2UnPjwvY2lyY2xlPlxuXHQ8Y2lyY2xlIGNsYXNzPSdkb3Qgc21hbGwnIHI9JzQnPjwvY2lyY2xlPlxuJycnXG5cbmNsYXNzIEN0cmxcblx0Y29uc3RydWN0b3I6IChAc2NvcGUsIEBlbCwgQGZha2VDYXJ0LCBARGF0YSktPlxuXHRcdHJhZCA9IDcgI3RoZSByYWRpdXMgb2YgdGhlIGxhcmdlIGNpcmNsZSBuYXR1cmFsbHlcblx0XHRzZWwgPSBkMy5zZWxlY3QgQGVsWzBdXG5cdFx0YmlnID0gc2VsLnNlbGVjdCAnY2lyY2xlLmRvdC5sYXJnZSdcblx0XHRcdC5hdHRyICdyJywgcmFkXG5cdFx0Y2lyYyA9IHNlbC5zZWxlY3QgJ2NpcmNsZS5kb3Quc21hbGwnXG5cblx0XHRiaWcub24gJ21vdXNlb3ZlcicsIEBtb3VzZW92ZXJcblx0XHRcdC5vbiAnY29udGV4dG1lbnUnLCAtPiBcblx0XHRcdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKVxuXHRcdFx0XHRldmVudC5zdG9wUHJvcGFnYXRpb24oKVxuXHRcdFx0Lm9uICdtb3VzZWRvd24nLCAtPlxuXHRcdFx0XHRiaWcudHJhbnNpdGlvbiAnZ3Jvdydcblx0XHRcdFx0XHQuZHVyYXRpb24gMTUwXG5cdFx0XHRcdFx0LmVhc2UgJ2N1YmljJ1xuXHRcdFx0XHRcdC5hdHRyICdyJywgcmFkKjEuN1xuXHRcdFx0Lm9uICdtb3VzZXVwJywgLT5cblx0XHRcdFx0YmlnLnRyYW5zaXRpb24gJ2dyb3cnXG5cdFx0XHRcdFx0LmR1cmF0aW9uIDE1MFxuXHRcdFx0XHRcdC5lYXNlICdjdWJpYy1pbidcblx0XHRcdFx0XHQuYXR0ciAncicsIHJhZCoxLjNcblx0XHRcdC5vbiAnbW91c2VvdXQnICwgQG1vdXNlb3V0XG5cblx0XHRAc2NvcGUuJHdhdGNoID0+XG5cdFx0XHRcdChAZmFrZUNhcnQuc2VsZWN0ZWQgPT0gQGRvdCkgYW5kIChARGF0YS5zaG93KVxuXHRcdFx0LCAodiwgb2xkKS0+XG5cdFx0XHRcdGlmIHZcblx0XHRcdFx0XHRiaWcudHJhbnNpdGlvbiAnZ3Jvdydcblx0XHRcdFx0XHRcdC5kdXJhdGlvbiAxNTBcblx0XHRcdFx0XHRcdC5lYXNlICdjdWJpYy1vdXQnXG5cdFx0XHRcdFx0XHQuYXR0ciAncicgLCByYWQgKiAxLjVcblx0XHRcdFx0XHRcdC50cmFuc2l0aW9uKClcblx0XHRcdFx0XHRcdC5kdXJhdGlvbiAxNTBcblx0XHRcdFx0XHRcdC5lYXNlICdjdWJpYy1pbidcblx0XHRcdFx0XHRcdC5hdHRyICdyJyAsIHJhZCAqIDEuM1xuXG5cdFx0XHRcdFx0Y2lyYy50cmFuc2l0aW9uKClcblx0XHRcdFx0XHRcdC5kdXJhdGlvbiAxNTBcblx0XHRcdFx0XHRcdC5lYXNlICdjdWJpYy1vdXQnXG5cdFx0XHRcdFx0XHQuc3R5bGVcblx0XHRcdFx0XHRcdFx0J3N0cm9rZS13aWR0aCc6IDIuNVxuXHRcdFx0XHRlbHNlIFxuXHRcdFx0XHRcdGJpZy50cmFuc2l0aW9uICdzaHJpbmsnXG5cdFx0XHRcdFx0XHQuZHVyYXRpb24gMzUwXG5cdFx0XHRcdFx0XHQuZWFzZSAnYm91bmNlLW91dCdcblx0XHRcdFx0XHRcdC5hdHRyICdyJyAsIHJhZFxuXG5cdFx0XHRcdFx0Y2lyYy50cmFuc2l0aW9uKClcblx0XHRcdFx0XHRcdC5kdXJhdGlvbiAxMDBcblx0XHRcdFx0XHRcdC5lYXNlICdjdWJpYydcblx0XHRcdFx0XHRcdC5zdHlsZVxuXHRcdFx0XHRcdFx0XHQnc3Ryb2tlLXdpZHRoJzogMS42XG5cdFx0XHRcdFx0XHRcdHN0cm9rZTogJ3doaXRlJ1xuXHRcdFx0IFxuXHRtb3VzZW91dDogPT5cblx0XHRARGF0YS5zZXRfc2hvdyBmYWxzZVxuXHRcdEBzY29wZS4kZXZhbEFzeW5jKClcblxuXHRtb3VzZW92ZXI6ID0+XG5cdFx0QGZha2VDYXJ0LnNlbGVjdF9kb3QgQGRvdFxuXHRcdEBEYXRhLnNldF9zaG93IHRydWVcblx0XHRAc2NvcGUuJGV2YWxBc3luYygpXG5cbmRlciA9ICgpLT5cblx0ZGlyZWN0aXZlID0gXG5cdFx0dGVtcGxhdGU6IHRlbXBsYXRlXG5cdFx0Y29udHJvbGxlckFzOiAndm0nXG5cdFx0c2NvcGU6IFxuXHRcdFx0ZG90OiAnPWRvdEFEZXInXG5cdFx0YmluZFRvQ29udHJvbGxlcjogdHJ1ZVxuXHRcdGNvbnRyb2xsZXI6IFsnJHNjb3BlJywnJGVsZW1lbnQnLCAnZmFrZUNhcnQnLCAnZGVzaWduRGF0YScsIEN0cmxdXG5cdFx0cmVzdHJpY3Q6ICdBJ1xuXG5cbm1vZHVsZS5leHBvcnRzID0gZGVyXG4iLCJEYXRhID0gcmVxdWlyZSAnLi9kZXNpZ25EYXRhJ1xuXG50ZW1wbGF0ZSA9ICcnJ1xuXHQ8Y2lyY2xlIGNsYXNzPSdkb3Qgc21hbGwnIHI9JzQnPjwvY2lyY2xlPlxuJycnXG5cbmNsYXNzIEN0cmxcblx0Y29uc3RydWN0b3I6IChAc2NvcGUsIEBlbCwgQGZha2VDYXJ0LCBARGF0YSktPlxuXHRcdGNpcmMgPSBkMy5zZWxlY3QgQGVsWzBdXG5cblx0XHRjaXJjLm9uICdtb3VzZW92ZXInLEBtb3VzZW92ZXJcblx0XHRcdC5vbiAnbW91c2VvdXQnICwgQG1vdXNlb3V0XG5cdFx0XHQjIC5vbiAnY29udGV4dG1lbnUnLCAtPiBcblx0XHRcdCMgXHRldmVudC5wcmV2ZW50RGVmYXVsdCgpXG5cdFx0XHQjIFx0ZXZlbnQuc3RvcFByb3BhZ2F0aW9uKClcblxuXHRcdEBzY29wZS4kd2F0Y2ggPT5cblx0XHRcdFx0KERhdGEuc2VsZWN0ZWQgPT0gQGRvdCkgYW5kIChEYXRhLnNob3cpXG5cdFx0XHQsICh2LCBvbGQpLT5cblx0XHRcdFx0aWYgdiA9PSBvbGQgdGhlbiByZXR1cm5cblx0XHRcdFx0aWYgdlxuXHRcdFx0XHRcdGNpcmMudHJhbnNpdGlvbigpXG5cdFx0XHRcdFx0XHQuZHVyYXRpb24gMTUwXG5cdFx0XHRcdFx0XHQuZWFzZSAnY3ViaWMtb3V0J1xuXHRcdFx0XHRcdFx0LnN0eWxlXG5cdFx0XHRcdFx0XHRcdCdzdHJva2Utd2lkdGgnOiAyLjVcblx0XHRcdFx0ZWxzZSBcblx0XHRcdFx0XHRjaXJjLnRyYW5zaXRpb24oKVxuXHRcdFx0XHRcdFx0LmR1cmF0aW9uIDEwMFxuXHRcdFx0XHRcdFx0LmVhc2UgJ2N1YmljJ1xuXHRcdFx0XHRcdFx0LnN0eWxlXG5cdFx0XHRcdFx0XHRcdCdzdHJva2Utd2lkdGgnOiAxLjZcblx0XHRcdFx0XHRcdFx0c3Ryb2tlOiAnd2hpdGUnXG5cdFx0XHQgXG5cdG1vdXNlb3V0OiA9PlxuXHRcdEBEYXRhLnNldF9zaG93IGZhbHNlXG5cdFx0QHNjb3BlLiRldmFsQXN5bmMoKVxuXG5cdG1vdXNlb3ZlcjogPT5cblx0XHRAZmFrZUNhcnQuc2VsZWN0X2RvdCBAZG90XG5cdFx0QERhdGEuc2V0X3Nob3cgdHJ1ZVxuXHRcdEBzY29wZS4kZXZhbEFzeW5jKClcblxuZGVyID0gKCktPlxuXHRkaXJlY3RpdmUgPSBcblx0XHR0ZW1wbGF0ZTogdGVtcGxhdGVcblx0XHRjb250cm9sbGVyQXM6ICd2bSdcblx0XHRzY29wZTogXG5cdFx0XHRkb3Q6ICc9ZG90QkRlcidcblx0XHRiaW5kVG9Db250cm9sbGVyOiB0cnVlXG5cdFx0Y29udHJvbGxlcjogWyckc2NvcGUnLCckZWxlbWVudCcsICdmYWtlQ2FydCcsICdkZXNpZ25EYXRhJywgQ3RybF1cblx0XHRyZXN0cmljdDogJ0EnXG5cblxubW9kdWxlLmV4cG9ydHMgPSBkZXJcbiIsInJlcXVpcmUgJy4uLy4uL2hlbHBlcnMnXG5fID0gcmVxdWlyZSAnbG9kYXNoJ1xuZDMgPSByZXF1aXJlICdkMydcbmRlbFQgPSAuMDVcblxuY2xhc3MgRG90XG5cdGNvbnN0cnVjdG9yOiAoQHQsIEB2KS0+XG5cdFx0QGlkID0gXy51bmlxdWVJZCAnZG90J1xuXHRcdEBkdiA9IDBcblxuXHR1cGRhdGU6ICh0LHYpLT5cblx0XHRAdCA9IHRcblx0XHRAdiA9IHZcblxuY2xhc3MgU2VydmljZVxuXHRjb25zdHJ1Y3RvcjooQERhdGEpIC0+XG5cdFx0QGNvcnJlY3QgPSBmYWxzZVxuXHRcdGZpcnN0RG90ID0gbmV3IERvdCAwICwgMlxuXHRcdGZpcnN0RG90LmlkID0gJ2ZpcnN0J1xuXHRcdEBkb3RzID0gW2ZpcnN0RG90XVxuXHRcdEB0cmFqZWN0b3J5ID0gXy5yYW5nZSAwLCA1ICwgZGVsVFxuXHRcdFx0Lm1hcCAodCktPlxuXHRcdFx0XHRyZXMgPSBcblx0XHRcdFx0XHR0OiB0XG5cdFx0XHRcdFx0djogMFxuXHRcdFx0XHRcdHg6IDBcblx0XHRfLnJhbmdlIC41LCAyLjUsIC41XG5cdFx0XHQuZm9yRWFjaCAodCk9PlxuXHRcdFx0XHRAZG90cy5wdXNoIG5ldyBEb3QgdCwgMipNYXRoLmV4cCgtLjgqdClcblxuXHRcdGxhc3REb3QgPSBuZXcgRG90IDYgLCBAZG90c1tAZG90cy5sZW5ndGggLSAxXS52XG5cdFx0bGFzdERvdC5pZCA9ICdsYXN0J1xuXHRcdEBkb3RzLnB1c2ggbGFzdERvdFxuXHRcdEBzZWxlY3RfZG90IEBkb3RzWzFdXG5cdFx0QHVwZGF0ZSgpXG5cblx0c2VsZWN0X2RvdDogKGRvdCktPlxuXHRcdEBzZWxlY3RlZCA9IGRvdFxuXG5cdGFkZF9kb3Q6ICh0LCB2KS0+XG5cdFx0bmV3RG90ID0gbmV3IERvdCB0LHZcblx0XHRAZG90cy5wdXNoIG5ld0RvdFxuXHRcdEB1cGRhdGVfZG90IG5ld0RvdCwgdCwgdlxuXG5cdHJlbW92ZV9kb3Q6IChkb3QpLT5cblx0XHRAZG90cy5zcGxpY2UgQGRvdHMuaW5kZXhPZihkb3QpLCAxXG5cdFx0QHVwZGF0ZSgpXG5cblx0bG9jOiAodCktPiBcblx0XHRhID0gTWF0aC5mbG9vciB0L2RlbFRcblx0XHRoID0gKHQgLSBAdHJhamVjdG9yeVthXS50KS9kZWxUXG5cdFx0QHRyYWplY3RvcnlbYV0ueCogKDEtaCkgKyBoKiBAdHJhamVjdG9yeVthKzFdPy54XG5cblx0QHByb3BlcnR5ICd4JywgZ2V0OiAtPiBAbG9jIEBEYXRhLnRcblxuXHRAcHJvcGVydHkgJ3YnLCBnZXQ6IC0+IFxuXHRcdHQgPSBARGF0YS50XG5cdFx0YSA9IE1hdGguZmxvb3IgdC9kZWxUXG5cdFx0aCA9ICh0IC0gQHRyYWplY3RvcnlbYV0udCkvZGVsVFxuXHRcdEB0cmFqZWN0b3J5W2FdLnYqICgxLWgpICsgaCogQHRyYWplY3RvcnlbYSsxXT8udlxuXG5cdEBwcm9wZXJ0eSAnZHYnLCBnZXQ6IC0+IEB0cmFqZWN0b3J5W01hdGguZmxvb3IoQERhdGEudC9kZWxUKV0uZHZcblxuXHR1cGRhdGU6IC0+IFxuXHRcdEBkb3RzLnNvcnQgKGEsYiktPiBhLnQgLSBiLnRcblx0XHRkb21haW4gPSBbXVxuXHRcdHJhbmdlID0gW11cblx0XHRAZG90cy5mb3JFYWNoIChkb3QsIGksIGspLT5cblx0XHRcdHByZXYgPSBrW2ktMV1cblx0XHRcdGlmIGRvdC5pZCA9PSAnbGFzdCdcblx0XHRcdFx0ZG90LnYgPSBwcmV2LnZcblx0XHRcdFx0ZG9tYWluLnB1c2ggZG90LnZcblx0XHRcdFx0cmFuZ2UucHVzaCBkb3QudlxuXHRcdFx0XHRyZXR1cm5cblx0XHRcdGlmIHByZXZcblx0XHRcdFx0ZHQgPSBkb3QudCAtIHByZXYudFxuXHRcdFx0XHRkb3QueCA9IHByZXYueCArIGR0ICogKGRvdC52ICsgcHJldi52KS8yXG5cdFx0XHRcdGRvdC5kdiA9IChkb3QudiAtIHByZXYudikvTWF0aC5tYXgoZHQsIC4wMDEpXG5cdFx0XHRlbHNlXG5cdFx0XHRcdGRvdC54ID0gMFxuXHRcdFx0XHRkb3QuZHYgPSAwXG5cblx0XHRAZG90cy5mb3JFYWNoIChkb3QsaSxrKT0+XG5cdFx0XHRcdGEgPSBAZG90c1tpLTFdXG5cdFx0XHRcdGlmICFhIHRoZW4gcmV0dXJuXG5cdFx0XHRcdGR2ID0gZG90LmR2XG5cdFx0XHRcdEB0cmFqZWN0b3J5XG5cdFx0XHRcdFx0LnNsaWNlKE1hdGguZmxvb3IoYS50L2RlbFQpLCBNYXRoLmZsb29yKGRvdC50L2RlbFQpKVxuXHRcdFx0XHRcdC5mb3JFYWNoIChkKS0+XG5cdFx0XHRcdFx0XHRkdCA9IGQudCAtIGEudFxuXHRcdFx0XHRcdFx0ZC54ID0gYS54ICsgYS52ICogZHQgKyAwLjUqZHYgKiBkdCoqMlxuXHRcdFx0XHRcdFx0ZC52ID0gYS52ICsgZHYgKiBkdFxuXG5cdHVwZGF0ZV9kb3Q6IChkb3QsIHQsIHYpLT5cblx0XHRpZiBkb3QuaWQgPT0gJ2ZpcnN0JyB0aGVuIHJldHVyblxuXHRcdEBzZWxlY3RfZG90IGRvdFxuXHRcdGRvdC51cGRhdGUgdCx2XG5cdFx0QHVwZGF0ZSgpXG5cdFx0QGNvcnJlY3QgPSBNYXRoLmFicyggLS44ICogZG90LnYgKyBkb3QuZHYpIDwgMC4wNVxuXG5cbm1vZHVsZS5leHBvcnRzID0gWydkZXNpZ25EYXRhJyAsIFNlcnZpY2VdIiwiRGF0YSA9IHJlcXVpcmUgJy4vZGVzaWduRGF0YSdcbl8gPSByZXF1aXJlICdsb2Rhc2gnXG5yZXF1aXJlICcuLi8uLi9oZWxwZXJzJ1xuZGVsVCA9IC4wMVxuXG5jbGFzcyBTZXJ2aWNlXG5cdGNvbnN0cnVjdG9yOiAoQERhdGEpLT5cblx0XHRAdHJhamVjdG9yeSA9IF8ucmFuZ2UgMCwgNC41ICwgZGVsVFxuXHRcdFx0Lm1hcCAodCktPlxuXHRcdFx0XHR0OiB0XG5cdFx0XHRcdHg6IDIvLjggKiAoMS1NYXRoLmV4cCgtLjgqdCkpXG5cdFx0XHRcdHY6IDIqTWF0aC5leHAgLS44KnRcblx0XHRcdFx0ZHY6IC0uOCoyKk1hdGguZXhwIC0uOCp0XG5cblx0bG9jOiAodCktPlx0Mi8uOCAqICgxLU1hdGguZXhwKC0uOCp0KSlcblxuXHRAcHJvcGVydHkgJ3gnLCBnZXQ6LT4gQGxvYyBARGF0YS50XG5cblx0QHByb3BlcnR5ICd2JywgZ2V0Oi0+IDIqIE1hdGguZXhwKC0uOCpARGF0YS50KVxuXG5cdEBwcm9wZXJ0eSAnZHYnLCBnZXQ6LT4gLS44KjIqIE1hdGguZXhwKC0uOCpARGF0YS50KVxuXG5tb2R1bGUuZXhwb3J0cyA9IFsnZGVzaWduRGF0YScsIFNlcnZpY2VdIiwiZHJhZyA9ICgkcGFyc2UpLT5cblx0ZGlyZWN0aXZlID0gXG5cdFx0bGluazogKHNjb3BlLGVsLGF0dHIpLT5cblx0XHRcdHNlbCA9IGQzLnNlbGVjdChlbFswXSlcblx0XHRcdHNlbC5jYWxsKCRwYXJzZShhdHRyLmJlaGF2aW9yKShzY29wZSkpXG5cbm1vZHVsZS5leHBvcnRzID0gZHJhZyIsInRlbXBsYXRlID0gJycnXG5cdDxkZWZzPlxuXHRcdDxjbGlwcGF0aCBuZy1hdHRyLWlkPSd7ezo6dm0ubmFtZX19Jz5cblx0XHRcdDxyZWN0IG5nLWF0dHItd2lkdGg9J3t7dm0ud2lkdGh9fScgbmctYXR0ci1oZWlnaHQ9J3t7dm0uaGVpZ2h0fX0nIC8+XG5cdFx0PC9jbGlwcGF0aD5cblx0PC9kZWZzPlxuXHQ8ZyBjbGFzcz0nYm9pbGVycGxhdGUnIHNoaWZ0ZXI9J3t7Ojpbdm0ubWFyLmxlZnQsIHZtLm1hci50b3BdfX0nPlxuXHRcdDxyZWN0IGNsYXNzPSdiYWNrZ3JvdW5kJyBuZy1hdHRyLXdpZHRoPSd7e3ZtLndpZHRofX0nIG5nLWF0dHItaGVpZ2h0PSd7e3ZtLmhlaWdodH19JyAvPlxuXHRcdDxnIHZlci1heGlzLWRlciB3aWR0aD0ndm0ud2lkdGgnIHNjYWxlPSd2bS52ZXInIGZ1bj0ndm0udmVyQXhGdW4nPjwvZz5cblx0XHQ8ZyBob3ItYXhpcy1kZXIgaGVpZ2h0PSd2bS5oZWlnaHQnIHNjYWxlPSd2bS5ob3InIGZ1bj0ndm0uaG9yQXhGdW4nIHNoaWZ0ZXI9J1swLHZtLmhlaWdodF0nPjwvZz5cblx0XHQ8bGluZSBjbGFzcz0nemVyby1saW5lIGhvcicgZDMtZGVyPSd7eDE6IDAsIHgyOiB2bS53aWR0aCwgeTE6IHZtLnZlcigwKSwgeTI6IHZtLnZlcigwKX0nLz5cblx0XHQ8bGluZSBjbGFzcz0nemVyby1saW5lIGhvcicgZDMtZGVyPSd7eDE6IHZtLmhvcigwKSwgeDI6IHZtLmhvcigwKSwgeTE6MCwgeTI6IHZtLmhlaWdodH0nLz5cblx0XHQ8ZyBuZy10cmFuc2NsdWRlPlxuXHRcdDwvZz5cblx0PC9nPlxuJycnXG5cbmRlciA9IC0+XG5cdGRpcmVjdGl2ZSA9IFxuXHRcdGNvbnRyb2xsZXI6IFsnJHNjb3BlJywgKEBzY29wZSkgLT5dXG5cdFx0Y29udHJvbGxlckFzOiAndm0nXG5cdFx0YmluZFRvQ29udHJvbGxlcjogdHJ1ZVxuXHRcdHNjb3BlOiBcblx0XHRcdHdpZHRoOiAnPSdcblx0XHRcdGhlaWdodDogJz0nXG5cdFx0XHR2ZXJBeEZ1bjogJz0nXG5cdFx0XHRob3JBeEZ1bjogJz0nXG5cdFx0XHRtYXI6ICc9J1xuXHRcdFx0dmVyOiAnPSdcblx0XHRcdGhvcjogJz0nXG5cdFx0XHRuYW1lOiAnPSdcblx0XHR0ZW1wbGF0ZTogdGVtcGxhdGVcblx0XHR0cmFuc2NsdWRlOiB0cnVlXG5cdFx0dGVtcGxhdGVOYW1lc3BhY2U6ICdzdmcnXG5cbm1vZHVsZS5leHBvcnRzID0gZGVyIiwiXyA9IHJlcXVpcmUgJ2xvZGFzaCdcbmQzPSByZXF1aXJlICdkMydcbnJlcXVpcmUgJy4uL2hlbHBlcnMnXG5QbG90Q3RybCA9IHJlcXVpcmUgJy4vcGxvdEN0cmwnXG5cbnRlbXBsYXRlID0gJycnXG5cdDxzdmcgbmctaW5pdD0ndm0ucmVzaXplKCknIG5nLWF0dHItaGVpZ2h0PVwie3t2bS5zdmdIZWlnaHR9fVwiPlxuXHRcdDxkZWZzPlxuXHRcdFx0PGNsaXBwYXRoIGlkPSdjYXJ0U2ltJz5cblx0XHRcdFx0PHJlY3QgZDMtZGVyPSd7d2lkdGg6IHZtLndpZHRoLCBoZWlnaHQ6IHZtLmhlaWdodH0nIC8+XG5cdFx0XHQ8L2NsaXBwYXRoPlxuXHRcdDwvZGVmcz5cblx0XHQ8ZyBjbGFzcz0nYm9pbGVycGxhdGUnIHNoaWZ0ZXI9J3t7Ojpbdm0ubWFyLmxlZnQsIHZtLm1hci50b3BdfX0nID5cblx0XHRcdDxyZWN0IGQzLWRlcj0ne3dpZHRoOiB2bS53aWR0aCwgaGVpZ2h0OiB2bS5oZWlnaHR9JyBjbGFzcz0nYmFja2dyb3VuZCcvPlxuXHRcdFx0PGcgaG9yLWF4aXMtZGVyIGhlaWdodD0ndm0uaGVpZ2h0JyBmdW49J3ZtLmhvckF4RnVuJyBzaGlmdGVyPSdbMCx2bS5oZWlnaHRdJz48L2c+XG5cdFx0XHQ8Zm9yZWlnbk9iamVjdCB3aWR0aD0nMzAnIGhlaWdodD0nMzAnIHk9JzIwJyBzaGlmdGVyPSdbdm0ud2lkdGgvMiwgdm0uaGVpZ2h0XSc+XG5cdFx0XHRcdFx0PHRleHQgY2xhc3M9J2xhYmVsJyA+JHgkPC90ZXh0PlxuXHRcdFx0PC9mb3JlaWduT2JqZWN0PlxuXHRcdDwvZz5cblx0XHQ8ZyBzaGlmdGVyPSd7ezo6W3ZtLm1hci5sZWZ0LCB2bS5tYXIudG9wXX19JyBjbGlwLXBhdGg9XCJ1cmwoI2NhcnRTaW0pXCIgPlxuXHRcdFx0PGZvcmVpZ25PYmplY3Qgd2lkdGg9JzMwJyBoZWlnaHQ9JzMwJyB5PScyMCcgc2hpZnRlcj0nW3ZtLndpZHRoLzIsIHZtLmhlaWdodF0nPlxuXHRcdFx0XHRcdDx0ZXh0IGNsYXNzPSdsYWJlbCcgPiR0JDwvdGV4dD5cblx0XHRcdDwvZm9yZWlnbk9iamVjdD5cblx0XHRcdDxnIG5nLXJlcGVhdD0ndCBpbiB2bS5zYW1wbGUnIGQzLWRlcj0ne3RyYW5zZm9ybTogXCJ0cmFuc2xhdGUoXCIgKyB2bS5Ib3Iodm0uZGF0YS5sb2ModCkpICsgXCIsMClcIn0nPlxuXHRcdFx0XHQ8bGluZSBjbGFzcz0ndGltZS1saW5lJyBkMy1kZXI9J3t4MTogMCwgeDI6IDAsIHkxOiAwLCB5Mjogdm0uaGVpZ2h0fScgLz5cblx0XHRcdDwvZz5cblx0XHRcdDxnIGNsYXNzPSdnLWNhcnQnIGNhcnQtb2JqZWN0LWRlciBsZWZ0PSd2bS5Ib3Iodm0uZGF0YS54KScgdG9wPSd2bS5oZWlnaHQnIHNpemU9J3ZtLnNpemUnPjwvZz5cblx0XHRcdDxyZWN0IGNsYXNzPSdleHBlcmltZW50JyBuZy1hdHRyLWhlaWdodD0ne3t2bS5oZWlnaHR9fScgbmctYXR0ci13aWR0aD0ne3t2bS53aWR0aH19JyAvPlxuXHRcdDwvZz5cblx0PC9zdmc+XG4nJydcblxuY2xhc3MgQ3RybCBleHRlbmRzIFBsb3RDdHJsXG5cdGNvbnN0cnVjdG9yOiAoQHNjb3BlLCBAZWwsIEB3aW5kb3cpLT5cblx0XHRzdXBlciBAc2NvcGUsIEBlbCwgQHdpbmRvd1xuXHRcdEBtYXIubGVmdCA9IEBtYXIucmlnaHQgPSA1XG5cdFx0QG1hci50b3AgPSA1XG5cdFx0QG1hci5ib3R0b20gPSAyNVxuXG5cdFx0QHNjb3BlLiR3YXRjaCAndm0ubWF4JywgPT5cblx0XHRcdEBIb3IuZG9tYWluIFstLjQsIEBtYXhdXG5cblxuXHRAcHJvcGVydHkgJ3NpemUnLCBnZXQ6IC0+IChASG9yKDAuNCkgLSBASG9yKDApKS84MFxuXG5kZXIgPSAtPlxuXHRkaXJlY3RpdmUgPSBcblx0XHR0ZW1wbGF0ZTogdGVtcGxhdGVcblx0XHRzY29wZTogXG5cdFx0XHRkYXRhOiAnPSdcblx0XHRcdG1heDogJz0nXG5cdFx0XHRzYW1wbGU6ICc9J1xuXHRcdHJlc3RyaWN0OiAnQSdcblx0XHRiaW5kVG9Db250cm9sbGVyOiB0cnVlXG5cdFx0IyB0cmFuc2NsdWRlOiB0cnVlXG5cdFx0dGVtcGxhdGVOYW1lc3BhY2U6ICdzdmcnXG5cdFx0Y29udHJvbGxlcjogWyckc2NvcGUnLCAnJGVsZW1lbnQnLCAnJHdpbmRvdycsIEN0cmxdXG5cdFx0Y29udHJvbGxlckFzOiAndm0nXG5cbm1vZHVsZS5leHBvcnRzID0gZGVyXG4iLCJkMyA9IHJlcXVpcmUgJ2QzJ1xuYW5ndWxhciA9IHJlcXVpcmUgJ2FuZ3VsYXInXG5cbmRlciA9ICgkcGFyc2UpLT4gI2dvZXMgb24gYSBzdmcgZWxlbWVudFxuXHRkaXJlY3RpdmUgPSBcblx0XHRyZXN0cmljdDogJ0EnXG5cdFx0c2NvcGU6IFxuXHRcdFx0ZDNEZXI6ICc9J1xuXHRcdFx0dHJhbjogJz0nXG5cdFx0bGluazogKHNjb3BlLCBlbCwgYXR0ciktPlxuXHRcdFx0c2VsID0gZDMuc2VsZWN0IGVsWzBdXG5cdFx0XHR1ID0gJ3QtJyArIE1hdGgucmFuZG9tKClcblx0XHRcdHNjb3BlLiR3YXRjaCAnZDNEZXInXG5cdFx0XHRcdCwgKHYpLT5cblx0XHRcdFx0XHRpZiBzY29wZS50cmFuXG5cdFx0XHRcdFx0XHRzZWwudHJhbnNpdGlvbiB1XG5cdFx0XHRcdFx0XHRcdC5hdHRyIHZcblx0XHRcdFx0XHRcdFx0LmNhbGwgc2NvcGUudHJhblxuXHRcdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRcdHNlbC5hdHRyIHZcblxuXHRcdFx0XHQsIHRydWVcbm1vZHVsZS5leHBvcnRzID0gZGVyIiwibW9kdWxlLmV4cG9ydHMgPSAoJHBhcnNlKS0+XG5cdChzY29wZSwgZWwsIGF0dHIpLT5cblx0XHRkMy5zZWxlY3QoZWxbMF0pLmRhdHVtICRwYXJzZShhdHRyLmRhdHVtKShzY29wZSkiLCJkMyA9IHJlcXVpcmUgJ2QzJ1xuXG5jbGFzcyBDdHJsXG5cdGNvbnN0cnVjdG9yOiAoQHNjb3BlLCBAZWwsIEB3aW5kb3cpLT5cblx0XHRAbWFyID0gXG5cdFx0XHRsZWZ0OiAzMFxuXHRcdFx0dG9wOiAyMFxuXHRcdFx0cmlnaHQ6IDIwXG5cdFx0XHRib3R0b206IDM1XG5cblx0XHRAVmVyID1kMy5zY2FsZS5saW5lYXIoKVxuXHRcdFxuXHRcdEBIb3IgPSBkMy5zY2FsZS5saW5lYXIoKVxuXG5cdFx0QGhvckF4RnVuID0gZDMuc3ZnLmF4aXMoKVxuXHRcdFx0LnNjYWxlIEBIb3Jcblx0XHRcdC50aWNrcyA1XG5cdFx0XHQub3JpZW50ICdib3R0b20nXG5cblx0XHRAdmVyQXhGdW4gPSBkMy5zdmcuYXhpcygpXG5cdFx0XHQuc2NhbGUgQFZlclxuXHRcdFx0IyAudGlja0Zvcm1hdCAoZCktPlxuXHRcdFx0IyBcdGlmIE1hdGguZmxvb3IoIGQgKSAhPSBkIHRoZW4gcmV0dXJuXG5cdFx0XHQjIFx0ZFxuXHRcdFx0LnRpY2tzIDVcblx0XHRcdC5vcmllbnQgJ2xlZnQnXG5cblx0XHRAbGluZUZ1biA9IGQzLnN2Zy5saW5lKClcblxuXHRcdGFuZ3VsYXIuZWxlbWVudCBAd2luZG93XG5cdFx0XHQub24gJ3Jlc2l6ZScsIEByZXNpemVcblxuXHRAcHJvcGVydHkgJ3N2Z19oZWlnaHQnLCBnZXQ6IC0+IEBoZWlnaHQgKyBAbWFyLnRvcCArIEBtYXIuYm90dG9tXG5cblx0cmVzaXplOiA9PlxuXHRcdEB3aWR0aCA9IEBlbFswXS5jbGllbnRXaWR0aCAtIEBtYXIubGVmdCAtIEBtYXIucmlnaHRcblx0XHRAaGVpZ2h0ID0gQGVsWzBdLmNsaWVudEhlaWdodCAtIEBtYXIudG9wIC0gQG1hci5ib3R0b21cblx0XHRAVmVyLnJhbmdlIFtAaGVpZ2h0LCAwXVxuXHRcdEBIb3IucmFuZ2UgWzAsIEB3aWR0aF1cblx0XHRAc2NvcGUuJGV2YWxBc3luYygpXG5cblxubW9kdWxlLmV4cG9ydHMgPSBDdHJsIiwiZDMgPSByZXF1aXJlICdkMydcblxuZGVyID0gKCRwYXJzZSktPlxuXHRkaXJlY3RpdmUgPVxuXHRcdHJlc3RyaWN0OiAnQSdcblx0XHRsaW5rOiAoc2NvcGUsIGVsLCBhdHRyKS0+XG5cdFx0XHRzZWwgPSBkMy5zZWxlY3QgZWxbMF1cblx0XHRcdHUgPSAndC0nICsgTWF0aC5yYW5kb20oKVxuXHRcdFx0dHJhbiA9ICRwYXJzZShhdHRyLnRyYW4pKHNjb3BlKVxuXHRcdFx0cmVzaGlmdCA9ICh2KS0+IFxuXHRcdFx0XHRpZiB0cmFuXG5cdFx0XHRcdFx0c2VsLnRyYW5zaXRpb24gdVxuXHRcdFx0XHRcdFx0LmF0dHIgJ3RyYW5zZm9ybScgLCBcInRyYW5zbGF0ZSgje3ZbMF19LCN7dlsxXX0pXCJcblx0XHRcdFx0XHRcdC5jYWxsIHRyYW5cblx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdHNlbC5hdHRyICd0cmFuc2Zvcm0nICwgXCJ0cmFuc2xhdGUoI3t2WzBdfSwje3ZbMV19KVwiXG5cblx0XHRcdFx0ZDMuc2VsZWN0IGVsWzBdXG5cdFx0XHRcdFx0XG5cblx0XHRcdHNjb3BlLiR3YXRjaCAtPlxuXHRcdFx0XHRcdCRwYXJzZShhdHRyLnNoaWZ0ZXIpKHNjb3BlKVxuXHRcdFx0XHQsIHJlc2hpZnRcblx0XHRcdFx0LCB0cnVlXG5cbm1vZHVsZS5leHBvcnRzID0gZGVyIiwiYW5ndWxhciA9IHJlcXVpcmUgJ2FuZ3VsYXInXG5kMyA9IHJlcXVpcmUgJ2QzJ1xudGV4dHVyZXMgPSByZXF1aXJlICd0ZXh0dXJlcydcblxuY2xhc3MgQ3RybFxuXHRjb25zdHJ1Y3RvcjogKEBzY29wZSwgQGVsLCBAd2luZG93KS0+XG5cdFx0dCA9IHRleHR1cmVzLmxpbmVzKClcblx0XHRcdC5vcmllbnRhdGlvbiBcIjMvOFwiLCBcIjcvOFwiXG5cdFx0XHQuc2l6ZSA0XG5cdFx0XHQuc3Ryb2tlKCcjRTZFNkU2Jylcblx0XHQgICAgLnN0cm9rZVdpZHRoIC42XG5cblx0XHR0LmlkICdteVRleHR1cmUnXG5cblx0XHR0MiA9IHRleHR1cmVzLmxpbmVzKClcblx0XHRcdC5vcmllbnRhdGlvbiBcIjMvOFwiLCBcIjcvOFwiXG5cdFx0XHQuc2l6ZSA0XG5cdFx0XHQuc3Ryb2tlKCd3aGl0ZScpXG5cdFx0ICAgIC5zdHJva2VXaWR0aCAuNFxuXG5cdFx0dDIuaWQgJ215VGV4dHVyZTInXG5cblx0XHRkMy5zZWxlY3QgQGVsWzBdXG5cdFx0XHQuc2VsZWN0ICdzdmcnXG5cdFx0XHQuY2FsbCB0XG5cdFx0XHQuY2FsbCB0MlxuXG5kZXIgPSAtPlxuXHRkaXJlY3RpdmUgPSBcblx0XHRjb250cm9sbGVyQXM6ICd2bSdcblx0XHRzY29wZToge31cblx0XHR0ZW1wbGF0ZTogJzxzdmcgaGVpZ2h0PVwiMHB4XCIgc3R5bGU9XCJwb3NpdGlvbjogYWJzb2x1dGU7XCIgd2lkdGg9XCIwcHhcIj48L3N2Zz4nXG5cdFx0dGVtcGxhdGVOYW1lc3BhY2U6ICdzdmcnXG5cdFx0Y29udHJvbGxlcjogWyckc2NvcGUnLCckZWxlbWVudCcsICckd2luZG93JywgQ3RybF1cblxubW9kdWxlLmV4cG9ydHMgPSBkZXJcbiIsImQzID0gcmVxdWlyZSAnZDMnXG5hbmd1bGFyID0gcmVxdWlyZSAnYW5ndWxhcidcblxuZGVyID0gKCR3aW5kb3cpLT5cblx0ZGlyZWN0aXZlID0gXG5cdFx0Y29udHJvbGxlcjogYW5ndWxhci5ub29wXG5cdFx0Y29udHJvbGxlckFzOiAndm0nXG5cdFx0YmluZFRvQ29udHJvbGxlcjogdHJ1ZVxuXHRcdHJlc3RyaWN0OiAnQSdcblx0XHR0ZW1wbGF0ZU5hbWVzcGFjZTogJ3N2Zydcblx0XHRzY29wZTogXG5cdFx0XHRoZWlnaHQ6ICc9J1xuXHRcdFx0ZnVuOiAnPSdcblx0XHRsaW5rOiAoc2NvcGUsIGVsLCBhdHRyLCB2bSktPlxuXHRcdFx0c2NhbGUgPSB2bS5mdW4uc2NhbGUoKVxuXG5cdFx0XHRzZWwgPSBkMy5zZWxlY3QgZWxbMF1cblx0XHRcdFx0LmNsYXNzZWQgJ3ggYXhpcycsIHRydWVcblxuXHRcdFx0dXBkYXRlID0gPT5cblx0XHRcdFx0dm0uZnVuLnRpY2tTaXplIC12bS5oZWlnaHRcblx0XHRcdFx0c2VsLmNhbGwgdm0uZnVuXG5cdFx0XHRcdFxuXHRcdFx0c2NvcGUuJHdhdGNoIC0+XG5cdFx0XHRcdFtzY2FsZS5kb21haW4oKSwgc2NhbGUucmFuZ2UoKSAsdm0uaGVpZ2h0XVxuXHRcdFx0LCB1cGRhdGVcblx0XHRcdCwgdHJ1ZVxuXG5cbm1vZHVsZS5leHBvcnRzID0gZGVyIiwiZDMgPSByZXF1aXJlICdkMydcbmFuZ3VsYXIgPSByZXF1aXJlICdhbmd1bGFyJ1xuXG5kZXIgPSAoJHdpbmRvdyktPlxuXHRkaXJlY3RpdmUgPSBcblx0XHRjb250cm9sbGVyOiBhbmd1bGFyLm5vb3Bcblx0XHRjb250cm9sbGVyQXM6ICd2bSdcblx0XHRiaW5kVG9Db250cm9sbGVyOiB0cnVlXG5cdFx0cmVzdHJpY3Q6ICdBJ1xuXHRcdHRlbXBsYXRlTmFtZXNwYWNlOiAnc3ZnJ1xuXHRcdHNjb3BlOiBcblx0XHRcdHdpZHRoOiAnPSdcblx0XHRcdGZ1bjogJz0nXG5cdFx0bGluazogKHNjb3BlLCBlbCwgYXR0ciwgdm0pLT5cblx0XHRcdHNjYWxlID0gdm0uZnVuLnNjYWxlKClcblxuXHRcdFx0c2VsID0gZDMuc2VsZWN0KGVsWzBdKS5jbGFzc2VkKCd5IGF4aXMnLCB0cnVlKVxuXG5cdFx0XHR1cGRhdGUgPSA9PlxuXHRcdFx0XHR2bS5mdW4udGlja1NpemUoIC12bS53aWR0aClcblx0XHRcdFx0c2VsLmNhbGwgdm0uZnVuXG5cblx0XHRcdHNjb3BlLiR3YXRjaCAtPlxuXHRcdFx0XHQjIGNvbnNvbGUubG9nIHNjYWxlLnJhbmdlKClcblx0XHRcdFx0W3NjYWxlLmRvbWFpbigpLCBzY2FsZS5yYW5nZSgpICx2bS53aWR0aF1cblx0XHRcdCwgdXBkYXRlXG5cdFx0XHQsIHRydWVcblxubW9kdWxlLmV4cG9ydHMgPSBkZXIiLCIndXNlIHN0cmljdCdcblxubW9kdWxlLmV4cG9ydHMudGltZW91dCA9IChmdW4sIHRpbWUpLT5cblx0XHRkMy50aW1lcigoKT0+XG5cdFx0XHRmdW4oKVxuXHRcdFx0dHJ1ZVxuXHRcdCx0aW1lKVxuXG5cbkZ1bmN0aW9uOjpwcm9wZXJ0eSA9IChwcm9wLCBkZXNjKSAtPlxuICBPYmplY3QuZGVmaW5lUHJvcGVydHkgQHByb3RvdHlwZSwgcHJvcCwgZGVzYyJdfQ==
