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
    return tran.duration(40).ease('linear');
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

template = '<div class=\'explainer\'>\n  <div>\n    <p>Hover to choose a time.</p>\n  </div>\n</div>\n<svg ng-init=\'vm.resize()\' class=\'topChart\' >\n	<g boilerplate-der width=\'vm.width\' height=\'vm.height\' ver-ax-fun=\'vm.verAxFun\' hor-ax-fun=\'vm.horAxFun\' ver=\'vm.Ver\' hor=\'vm.Hor\' mar=\'vm.mar\' name=\'vm.name\'>\n	</g>\n	<g class=\'main\' ng-attr-clip-path=\'url(#{{vm.name}})\' shifter=\'[vm.mar.left, vm.mar.top]\'>\n		<foreignObject width=\'30\' height=\'30\' x=\'-15\' y=\'-20\' shifter=\'[vm.width, vm.Ver(0)]\'>\n				<text class=\'label\'>$t$</text>\n		</foreignObject>\n		<path ng-attr-d=\'{{vm.lineFun(vm.Data.trajectory)}}\' class=\'fun v\' />\n		<path ng-attr-d=\'{{vm.triangleData}}\' class=\'tri\' />\n		<line class=\'tri dv\' d3-der=\'{x1: vm.Hor(vm.point.t)-1, x2: vm.Hor(vm.point.t)-1, y1: vm.Ver(vm.point.v), y2: vm.Ver((vm.point.v + vm.point.dv))}\'/>\n		<foreignObject width=\'30\' height=\'30\' shifter=\'[(vm.Hor(vm.point.t) - 16), vm.sthing]\'>\n				<text class=\'tri-label\' >$\\dot{y}$</text>\n		</foreignObject>\n		<foreignObject width=\'100\' height=\'30\' shifter=\'[vm.Hor(1.65), vm.Ver(1.38)]\'>\n			<text class=\'tri-label\'>$\\sin(t)$</text>\n		</foreignObject>\n		<circle r=\'3px\'  shifter=\'[vm.Hor(vm.point.t), vm.Ver(vm.point.v)]\' class=\'point v\'/>\n		<rect class=\'experiment\' ng-attr-height=\'{{vm.height}}\' ng-attr-width=\'{{vm.width}}\' />\n	</g>\n</svg>';

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
    this.trajectory = _.range(0, 6, .18).map(function(t) {
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

template = '<div class=\'explainer\'>\n  <div>\n    <p>Left-click to add a point $(v,t)$. <br>\n    	Click-and-drag to move it; <br>\n    	right-click to delete it.\n    </p>\n  </div>\n</div>\n<svg ng-init=\'vm.resize()\' class=\'bottomChart\' >\n	<g boilerplate-der width=\'vm.width\' height=\'vm.height\' ver-ax-fun=\'vm.verAxFun\' hor-ax-fun=\'vm.horAxFun\' ver=\'vm.Ver\' hor=\'vm.Hor\' mar=\'vm.mar\' name=\'"designA"\'>\n		<foreignObject width=\'30\' height=\'30\' y=\'5\' x=\'-8\' shifter=\'[vm.width, vm.height]\'>\n				<text class=\'label\' >$t$</text>\n		</foreignObject>\n		<foreignObject width=\'30\' height=\'30\' y=\'0\' x=\'-15\' shifter=\'[0, 0]\'>\n				<text class=\'label\' >$v$</text>\n		</foreignObject>\n	</g>\n	<g class=\'main\' clip-path="url(#designA)" shifter=\'[vm.mar.left, vm.mar.top]\' >\n		<rect style=\'opacity:0\' ng-attr-height=\'{{vm.height}}\' ng-attr-width=\'{{vm.width}}\' behavior=\'vm.drag_rect\'></rect>\n		<g ng-class=\'{hide: !vm.Data.show}\' >\n			<line class=\'tri v\' d3-der=\'{x1: vm.Hor(vm.selected.t)-1, x2: vm.Hor(vm.selected.t)-1, y1: vm.Ver(0), y2: vm.Ver(vm.selected.v)}\'/>\n			<path ng-attr-d=\'{{vm.triangleData()}}\' class=\'tri\' />\n			<line d3-der=\'{x1: vm.Hor(vm.selected.t)+1, x2: vm.Hor(vm.selected.t)+1, y1: vm.Ver(vm.selected.v), y2: vm.Ver(vm.selected.v + vm.selected.dv)}\' class=\'tri dv\' />\n		</g>\n		<path ng-attr-d=\'{{vm.lineFun(vm.trueCart.trajectory)}}\' class=\'fun target\' />\n		<path ng-attr-d=\'{{vm.lineFun(vm.fakeCart.dots)}}\' class=\'fun v\' />\n		<g ng-repeat=\'dot in vm.dots track by dot.id\' datum=dot shifter=\'[vm.Hor(dot.t),vm.Ver(dot.v)]\' behavior=\'vm.drag\' dot-a-der=dot ></g>\n		<circle class=\'dot small\' r=\'4\' shifter=\'[vm.Hor(0),vm.Ver(2)]\' />\n		<foreignObject width=\'70\' height=\'30\' shifter=\'[vm.Hor(3.7), vm.Ver(.33)]\'>\n				<text class=\'tri-label\' >$2e^{-.8t}$</text>\n		</foreignObject>\n		<circle r=\'4px\'  shifter=\'[vm.Hor(vm.Data.t), vm.Ver(vm.fakeCart.v)]\' class=\'point fake\'/>\n		<circle r=\'4px\'  shifter=\'[vm.Hor(vm.Data.t), vm.Ver(vm.trueCart.v)]\' class=\'point real\'/>\n		<rect class=\'experiment\' ng-attr-height=\'{{vm.height}}\' ng-attr-width=\'{{vm.width}}\' />\n	</g>\n</svg>';

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

template = '<svg ng-init=\'vm.resize()\'  class=\'bottomChart\'>\n	<g boilerplate-der width=\'vm.width\' height=\'vm.height\' ver-ax-fun=\'vm.verAxFun\' hor-ax-fun=\'vm.horAxFun\' ver=\'vm.Ver\' hor=\'vm.Hor\' mar=\'vm.mar\' name=\'"designB"\'>\n		<foreignObject width=\'30\' height=\'30\' y=\'5\' x=\'-8\' shifter=\'[vm.width, vm.height]\'>\n				<text class=\'label\' >$v$</text>\n		</foreignObject>\n		<foreignObject width=\'30\' height=\'30\' y=\'0\' x=\'-15\' shifter=\'[0, 0]\'>\n				<text class=\'label\' >$\\dot{v}$</text>\n		</foreignObject>\n	</g>\n	<g class=\'main\' clip-path="url(#designB)" shifter=\'[vm.mar.left, vm.mar.top]\'>	\n		<path ng-attr-d=\'{{vm.lineFun(vm.trueCart.trajectory)}}\' class=\'fun target\' />\n		<g ng-class=\'{hide: !vm.Data.show}\' >\n			<line class=\'tri v\' d3-der=\'{x1: vm.Hor(0), x2: vm.Hor(vm.selected.v), y1: vm.Ver(vm.selected.dv), y2: vm.Ver(vm.selected.dv)}\'/>\n			<line class=\'tri dv\' d3-der=\'{x1: vm.Hor(vm.selected.v), x2: vm.Hor(vm.selected.v), y1: vm.Ver(0), y2: vm.Ver(vm.selected.dv)}\'/>\n			<path d3-der=\'{d:vm.lineFun(vm.trueCart.trajectory)}\' class=\'fun correct\' ng-class=\'{hide: !vm.Data.correct}\' />\n		</g>\n		<g ng-repeat=\'dot in vm.dots track by dot.id\' shifter=\'[vm.Hor(dot.v),vm.Ver(dot.dv)]\' dot-b-der=dot></g>\n		<foreignObject width=\'70\' height=\'30\' y=\'0\' shifter=\'[vm.Hor(.3), vm.Ver(-.1)]\'>\n				<text class=\'tri-label\' >$v\'=-.8v$</text>\n		</foreignObject>\n		<rect class=\'experiment\' ng-attr-height=\'{{vm.height}}\' ng-attr-width=\'{{vm.width}}\' />\n	</g>\n</svg>';

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

delT = .1;

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

delT = .1;

Service = (function() {
  function Service(Data1) {
    this.Data = Data1;
    this.trajectory = _.range(0, 4.7, delT).map(function(t) {
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

template = '<svg ng-init=\'vm.resize()\' ng-attr-height="{{vm.svgHeight}}">\n	<defs>\n		<clippath id=\'cartSim\'>\n			<rect d3-der=\'{width: vm.width, height: vm.height}\' />\n		</clippath>\n	</defs>\n	<g class=\'boilerplate\' shifter=\'{{::[vm.mar.left, vm.mar.top]}}\' >\n		<rect d3-der=\'{width: vm.width, height: vm.height}\' class=\'background\'/>\n		<g hor-axis-der height=\'vm.height\' fun=\'vm.horAxFun\' shifter=\'[0,vm.height]\'></g>\n		<foreignObject width=\'30\' height=\'30\' y=\'20\' shifter=\'[vm.width/2, vm.height]\'>\n				<text class=\'label\' >$x$</text>\n		</foreignObject>\n	</g>\n	<g shifter=\'{{::[vm.mar.left, vm.mar.top]}}\' clip-path="url(#cartSim)" >\n		<foreignObject width=\'30\' height=\'30\' y=\'20\' shifter=\'[vm.width/2, vm.height]\'>\n				<text class=\'label\' >$t$</text>\n		</foreignObject>\n		<g ng-repeat=\'t in vm.sample\' d3-der=\'{transform: "translate(" + vm.Hor(vm.data.loc(t)) + ",0)"}\'>\n			<line class=\'time-line\' d3-der=\'{x1: 0, x2: 0, y1: 0, y2: vm.height}\' />\n		</g>\n		<g class=\'g-cart\' cart-object-der left=\'vm.Hor(vm.data.x)\' top=\'vm.height\' size=\'vm.size\'></g>\n	</g>\n</svg>';

Ctrl = (function(superClass) {
  extend(Ctrl, superClass);

  function Ctrl(scope, el, window) {
    this.scope = scope;
    this.el = el;
    this.window = window;
    Ctrl.__super__.constructor.call(this, this.scope, this.el, this.window);
    this.mar.top = 5;
    this.mar.bottom = 25;
    this.scope.$watch('vm.max', (function(_this) {
      return function() {
        return _this.Hor.domain([-.1, _this.max]);
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
      left: 20,
      top: 10,
      right: 15,
      bottom: 30
    };
    this.Ver = d3.scale.linear();
    this.Hor = d3.scale.linear();
    this.horAxFun = d3.svg.axis().scale(this.Hor).ticks(5).orient('bottom');
    this.verAxFun = d3.svg.axis().scale(this.Ver).tickFormat(function(d) {
      if (Math.floor(d) !== d) {
        return;
      }
      return d;
    }).ticks(5).orient('left');
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvbGV3aXMvUmVzZWFyY2gvZGlmZkVRX25ldy9hcHAvYXBwLmNvZmZlZSIsIi9Vc2Vycy9sZXdpcy9SZXNlYXJjaC9kaWZmRVFfbmV3L2FwcC9jb21wb25lbnRzL2NhcnQvY2FydERhdGEuY29mZmVlIiwiL1VzZXJzL2xld2lzL1Jlc2VhcmNoL2RpZmZFUV9uZXcvYXBwL2NvbXBvbmVudHMvY2FydC9jYXJ0T2JqZWN0LmNvZmZlZSIsIi9Vc2Vycy9sZXdpcy9SZXNlYXJjaC9kaWZmRVFfbmV3L2FwcC9jb21wb25lbnRzL2NhcnQvY2FydFBsb3QuY29mZmVlIiwiL1VzZXJzL2xld2lzL1Jlc2VhcmNoL2RpZmZFUV9uZXcvYXBwL2NvbXBvbmVudHMvY2FydC9jYXJ0U2ltLmNvZmZlZSIsIi9Vc2Vycy9sZXdpcy9SZXNlYXJjaC9kaWZmRVFfbmV3L2FwcC9jb21wb25lbnRzL2Rlcml2YXRpdmUvZGVyaXZhdGl2ZUEuY29mZmVlIiwiL1VzZXJzL2xld2lzL1Jlc2VhcmNoL2RpZmZFUV9uZXcvYXBwL2NvbXBvbmVudHMvZGVyaXZhdGl2ZS9kZXJpdmF0aXZlQi5jb2ZmZWUiLCIvVXNlcnMvbGV3aXMvUmVzZWFyY2gvZGlmZkVRX25ldy9hcHAvY29tcG9uZW50cy9kZXJpdmF0aXZlL2Rlcml2YXRpdmVEYXRhLmNvZmZlZSIsIi9Vc2Vycy9sZXdpcy9SZXNlYXJjaC9kaWZmRVFfbmV3L2FwcC9jb21wb25lbnRzL2Rlc2lnbi9kZXNpZ25BLmNvZmZlZSIsIi9Vc2Vycy9sZXdpcy9SZXNlYXJjaC9kaWZmRVFfbmV3L2FwcC9jb21wb25lbnRzL2Rlc2lnbi9kZXNpZ25CLmNvZmZlZSIsIi9Vc2Vycy9sZXdpcy9SZXNlYXJjaC9kaWZmRVFfbmV3L2FwcC9jb21wb25lbnRzL2Rlc2lnbi9kZXNpZ25DYXJ0QS5jb2ZmZWUiLCIvVXNlcnMvbGV3aXMvUmVzZWFyY2gvZGlmZkVRX25ldy9hcHAvY29tcG9uZW50cy9kZXNpZ24vZGVzaWduQ2FydEIuY29mZmVlIiwiL1VzZXJzL2xld2lzL1Jlc2VhcmNoL2RpZmZFUV9uZXcvYXBwL2NvbXBvbmVudHMvZGVzaWduL2Rlc2lnbkRhdGEuY29mZmVlIiwiL1VzZXJzL2xld2lzL1Jlc2VhcmNoL2RpZmZFUV9uZXcvYXBwL2NvbXBvbmVudHMvZGVzaWduL2RvdEEuY29mZmVlIiwiL1VzZXJzL2xld2lzL1Jlc2VhcmNoL2RpZmZFUV9uZXcvYXBwL2NvbXBvbmVudHMvZGVzaWduL2RvdEIuY29mZmVlIiwiL1VzZXJzL2xld2lzL1Jlc2VhcmNoL2RpZmZFUV9uZXcvYXBwL2NvbXBvbmVudHMvZGVzaWduL2Zha2VDYXJ0LmNvZmZlZSIsIi9Vc2Vycy9sZXdpcy9SZXNlYXJjaC9kaWZmRVFfbmV3L2FwcC9jb21wb25lbnRzL2Rlc2lnbi90cnVlQ2FydC5jb2ZmZWUiLCIvVXNlcnMvbGV3aXMvUmVzZWFyY2gvZGlmZkVRX25ldy9hcHAvZGlyZWN0aXZlcy9iZWhhdmlvci5jb2ZmZWUiLCIvVXNlcnMvbGV3aXMvUmVzZWFyY2gvZGlmZkVRX25ldy9hcHAvZGlyZWN0aXZlcy9ib2lsZXJwbGF0ZS5jb2ZmZWUiLCIvVXNlcnMvbGV3aXMvUmVzZWFyY2gvZGlmZkVRX25ldy9hcHAvZGlyZWN0aXZlcy9jYXJ0RGVyLmNvZmZlZSIsIi9Vc2Vycy9sZXdpcy9SZXNlYXJjaC9kaWZmRVFfbmV3L2FwcC9kaXJlY3RpdmVzL2QzRGVyLmNvZmZlZSIsIi9Vc2Vycy9sZXdpcy9SZXNlYXJjaC9kaWZmRVFfbmV3L2FwcC9kaXJlY3RpdmVzL2RhdHVtLmNvZmZlZSIsIi9Vc2Vycy9sZXdpcy9SZXNlYXJjaC9kaWZmRVFfbmV3L2FwcC9kaXJlY3RpdmVzL3Bsb3RDdHJsLmNvZmZlZSIsIi9Vc2Vycy9sZXdpcy9SZXNlYXJjaC9kaWZmRVFfbmV3L2FwcC9kaXJlY3RpdmVzL3NoaWZ0ZXIuY29mZmVlIiwiL1VzZXJzL2xld2lzL1Jlc2VhcmNoL2RpZmZFUV9uZXcvYXBwL2RpcmVjdGl2ZXMvdGV4dHVyZS5jb2ZmZWUiLCIvVXNlcnMvbGV3aXMvUmVzZWFyY2gvZGlmZkVRX25ldy9hcHAvZGlyZWN0aXZlcy94QXhpcy5jb2ZmZWUiLCIvVXNlcnMvbGV3aXMvUmVzZWFyY2gvZGlmZkVRX25ldy9hcHAvZGlyZWN0aXZlcy95QXhpcy5jb2ZmZWUiLCIvVXNlcnMvbGV3aXMvUmVzZWFyY2gvZGlmZkVRX25ldy9hcHAvaGVscGVycy5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQSxZQUFBLENBQUE7QUFBQSxJQUFBLHdCQUFBOztBQUFBLE9BQ0EsR0FBVSxPQUFBLENBQVEsU0FBUixDQURWLENBQUE7O0FBQUEsRUFFQSxHQUFLLE9BQUEsQ0FBUSxJQUFSLENBRkwsQ0FBQTs7QUFBQSxHQUdBLEdBQU0sT0FBTyxDQUFDLE1BQVIsQ0FBZSxTQUFmLEVBQTBCLENBQUMsT0FBQSxDQUFRLGtCQUFSLENBQUQsQ0FBMUIsQ0FDTCxDQUFDLFNBREksQ0FDTSxZQUROLEVBQ29CLE9BQUEsQ0FBUSxvQkFBUixDQURwQixDQUVMLENBQUMsU0FGSSxDQUVNLFlBRk4sRUFFb0IsT0FBQSxDQUFRLG9CQUFSLENBRnBCLENBR0wsQ0FBQyxTQUhJLENBR00sWUFITixFQUdvQixPQUFBLENBQVEsMkJBQVIsQ0FIcEIsQ0FJTCxDQUFDLFNBSkksQ0FJTSxlQUpOLEVBSXVCLE9BQUEsQ0FBUSw4QkFBUixDQUp2QixDQU1MLENBQUMsU0FOSSxDQU1NLFNBTk4sRUFNa0IsT0FBQSxDQUFRLHNCQUFSLENBTmxCLENBT0wsQ0FBQyxTQVBJLENBT00sVUFQTixFQU9rQixPQUFBLENBQVEsdUJBQVIsQ0FQbEIsQ0FRTCxDQUFDLFNBUkksQ0FRTSxTQVJOLEVBUWlCLE9BQUEsQ0FBUSwwQkFBUixDQVJqQixDQVNMLENBQUMsU0FUSSxDQVNNLFNBVE4sRUFTaUIsT0FBQSxDQUFRLDBCQUFSLENBVGpCLENBVUwsQ0FBQyxTQVZJLENBVU0sT0FWTixFQVVlLE9B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QSxHQUFBO2VBQUEsU0FBQSxHQUFBO0FBQ1IsVUFBQSxFQUFFLENBQUMsR0FBRyxDQUFDLFFBQVAsQ0FBaUIsQ0FBQSxFQUFHLENBQUMsS0FBckIsQ0FBQSxDQUFBO2lCQUNBLEdBQUcsQ0FBQyxJQUFKLENBQVMsRUFBRSxDQUFDLEdBQVosRUFGUTtRQUFBLEVBQUE7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBSlQsQ0FBQTthQVFBLEtBQUssQ0FBQyxNQUFOLENBQWEsU0FBQSxHQUFBO2VBRVosQ0FBQyxLQUFLLENBQUMsTUFBTixDQUFBLENBQUQsRUFBaUIsS0FBSyxDQUFDLEtBQU4sQ0FBQSxDQUFqQixFQUFnQyxFQUFFLENBQUMsS0FBbkMsRUFGWTtNQUFBLENBQWIsRUFHRSxNQUhGLEVBSUUsSUFKRixFQVRLO0lBQUEsQ0FSTjtJQUZJO0FBQUEsQ0FITixDQUFBOztBQUFBLE1BNEJNLENBQUMsT0FBUCxHQUFpQixHQTVCakIsQ0FBQTs7Ozs7QUNBQSxZQUFBLENBQUE7QUFBQSxNQUVNLENBQUMsT0FBTyxDQUFDLE9BQWYsR0FBeUIsU0FBQyxHQUFELEVBQU0sSUFBTixHQUFBO1NBQ3ZCLEVBQUUsQ0FBQyxLQUFILENBQVMsQ0FBQSxTQUFBLEtBQUEsR0FBQTtXQUFBLFNBQUEsR0FBQTtBQUNSLE1BQUEsR0FBQSxDQUFBLENBQUEsQ0FBQTthQUNBLEtBRlE7SUFBQSxFQUFBO0VBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFULEVBR0MsSUFIRCxFQUR1QjtBQUFBLENBRnpCLENBQUE7O0FBQUEsUUFTUSxDQUFBLFNBQUUsQ0FBQSxRQUFWLEdBQXFCLFNBQUMsSUFBRCxFQUFPLElBQVAsR0FBQTtTQUNuQixNQUFNLENBQUMsY0FBUCxDQUFzQixJQUFDLENBQUEsU0FBdkIsRUFBa0MsSUFBbEMsRUFBd0MsSUFBeEMsRUFEbUI7QUFBQSxDQVRyQixDQUFBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIid1c2Ugc3RyaWN0J1xuYW5ndWxhciA9IHJlcXVpcmUgJ2FuZ3VsYXInXG5kMyA9IHJlcXVpcmUgJ2QzJ1xuYXBwID0gYW5ndWxhci5tb2R1bGUgJ21haW5BcHAnLCBbcmVxdWlyZSAnYW5ndWxhci1tYXRlcmlhbCddXG5cdC5kaXJlY3RpdmUgJ2hvckF4aXNEZXInLCByZXF1aXJlICcuL2RpcmVjdGl2ZXMveEF4aXMnXG5cdC5kaXJlY3RpdmUgJ3ZlckF4aXNEZXInLCByZXF1aXJlICcuL2RpcmVjdGl2ZXMveUF4aXMnXG5cdC5kaXJlY3RpdmUgJ2NhcnRTaW1EZXInLCByZXF1aXJlICcuL2NvbXBvbmVudHMvY2FydC9jYXJ0U2ltJ1xuXHQuZGlyZWN0aXZlICdjYXJ0T2JqZWN0RGVyJywgcmVxdWlyZSAnLi9jb21wb25lbnRzL2NhcnQvY2FydE9iamVjdCdcblx0IyAuZGlyZWN0aXZlICdjYXJ0QnV0dG9uc0RlcicsIHJlcXVpcmUgJy4vY29tcG9uZW50cy9jYXJ0L2NhcnRCdXR0b25zJ1xuXHQuZGlyZWN0aXZlICdzaGlmdGVyJyAsIHJlcXVpcmUgJy4vZGlyZWN0aXZlcy9zaGlmdGVyJ1xuXHQuZGlyZWN0aXZlICdiZWhhdmlvcicsIHJlcXVpcmUgJy4vZGlyZWN0aXZlcy9iZWhhdmlvcidcblx0LmRpcmVjdGl2ZSAnZG90QURlcicsIHJlcXVpcmUgJy4vY29tcG9uZW50cy9kZXNpZ24vZG90QSdcblx0LmRpcmVjdGl2ZSAnZG90QkRlcicsIHJlcXVpcmUgJy4vY29tcG9uZW50cy9kZXNpZ24vZG90Qidcblx0LmRpcmVjdGl2ZSAnZGF0dW0nLCByZXF1aXJlICcuL2RpcmVjdGl2ZXMvZGF0dW0nXG5cdC5kaXJlY3RpdmUgJ2QzRGVyJywgcmVxdWlyZSAnLi9kaXJlY3RpdmVzL2QzRGVyJ1xuXHQuZGlyZWN0aXZlICdkZXNpZ25BRGVyJywgcmVxdWlyZSAnLi9jb21wb25lbnRzL2Rlc2lnbi9kZXNpZ25BJ1xuXHQuZGlyZWN0aXZlICdkZXNpZ25CRGVyJyAsIHJlcXVpcmUgJy4vY29tcG9uZW50cy9kZXNpZ24vZGVzaWduQidcblx0LmRpcmVjdGl2ZSAnZGVyaXZhdGl2ZUFEZXInLCByZXF1aXJlICcuL2NvbXBvbmVudHMvZGVyaXZhdGl2ZS9kZXJpdmF0aXZlQSdcblx0LmRpcmVjdGl2ZSAnZGVyaXZhdGl2ZUJEZXInLCByZXF1aXJlICcuL2NvbXBvbmVudHMvZGVyaXZhdGl2ZS9kZXJpdmF0aXZlQidcblx0LmRpcmVjdGl2ZSAnY2FydFBsb3REZXInLCByZXF1aXJlICcuL2NvbXBvbmVudHMvY2FydC9jYXJ0UGxvdCdcblx0LmRpcmVjdGl2ZSAnZGVzaWduQ2FydEFEZXInLCByZXF1aXJlICcuL2NvbXBvbmVudHMvZGVzaWduL2Rlc2lnbkNhcnRBJ1xuXHQuZGlyZWN0aXZlICdkZXNpZ25DYXJ0QkRlcicsIHJlcXVpcmUgJy4vY29tcG9uZW50cy9kZXNpZ24vZGVzaWduQ2FydEInXG5cdC5kaXJlY3RpdmUgJ3RleHR1cmVEZXInLCByZXF1aXJlICcuL2RpcmVjdGl2ZXMvdGV4dHVyZSdcblx0IyAuZGlyZWN0aXZlICdkZXNpZ25CdXR0b25zRGVyJywgcmVxdWlyZSAnLi9jb21wb25lbnRzL2Rlc2lnbi9kZXNpZ25CdXR0b25zJ1xuXHQuZGlyZWN0aXZlICdib2lsZXJwbGF0ZURlcicsIHJlcXVpcmUgJy4vZGlyZWN0aXZlcy9ib2lsZXJwbGF0ZSdcblx0LmRpcmVjdGl2ZSAnY2FydERlcicgLCByZXF1aXJlICcuL2RpcmVjdGl2ZXMvY2FydERlcidcblx0LnNlcnZpY2UgJ2Rlcml2YXRpdmVEYXRhJywgcmVxdWlyZSAnLi9jb21wb25lbnRzL2Rlcml2YXRpdmUvZGVyaXZhdGl2ZURhdGEnXG5cdC5zZXJ2aWNlICdmYWtlQ2FydCcsIHJlcXVpcmUgJy4vY29tcG9uZW50cy9kZXNpZ24vZmFrZUNhcnQnXG5cdC5zZXJ2aWNlICd0cnVlQ2FydCcsIHJlcXVpcmUgJy4vY29tcG9uZW50cy9kZXNpZ24vdHJ1ZUNhcnQnXG5cdC5zZXJ2aWNlICdkZXNpZ25EYXRhJywgcmVxdWlyZSAnLi9jb21wb25lbnRzL2Rlc2lnbi9kZXNpZ25EYXRhJ1xuXHQuc2VydmljZSAnY2FydERhdGEnLCByZXF1aXJlICcuL2NvbXBvbmVudHMvY2FydC9jYXJ0RGF0YSdcbmxvb3BlciA9IC0+XG4gICAgc2V0VGltZW91dCggKCktPlxuICAgIFx0XHRcdGQzLnNlbGVjdEFsbCAnY2lyY2xlLmRvdC5sYXJnZSdcbiAgICBcdFx0XHRcdC50cmFuc2l0aW9uICdncm93J1xuICAgIFx0XHRcdFx0LmR1cmF0aW9uIDUwMFxuICAgIFx0XHRcdFx0LmVhc2UgJ2N1YmljLW91dCdcbiAgICBcdFx0XHRcdC5hdHRyICd0cmFuc2Zvcm0nLCAnc2NhbGUoIDEuMzQpJ1xuICAgIFx0XHRcdFx0LnRyYW5zaXRpb24gJ3NocmluaydcbiAgICBcdFx0XHRcdC5kdXJhdGlvbiA1MDBcbiAgICBcdFx0XHRcdC5lYXNlICdjdWJpYy1vdXQnXG4gICAgXHRcdFx0XHQuYXR0ciAndHJhbnNmb3JtJywgJ3NjYWxlKCAxLjApJ1xuICAgIFx0XHRcdGxvb3BlcigpXG4gICAgXHRcdCwgMTAwMClcblxubG9vcGVyKClcbiIsIl8gPSByZXF1aXJlICdsb2Rhc2gnXG52RnVuID0gKHQpLT4yKk1hdGguZXhwIC0uOCp0XG5kdkZ1biA9ICh0KS0+IC0uOCAqIDIqTWF0aC5leHAgLS44KnRcbnhGdW4gPSAodCktPiAyLy44KigxLU1hdGguZXhwKC0uOCp0KSlcblxuY2xhc3MgU2VydmljZVxuXHRjb25zdHJ1Y3RvcjogKCRyb290U2NvcGUpLT5cblx0XHRAcm9vdFNjb3BlID0gJHJvb3RTY29wZVxuXHRcdEBzZXRUIDBcblx0XHRAcGF1c2VkID0gIGZhbHNlXG5cdFx0QHRyYWplY3RvcnkgPSBfLnJhbmdlIDAgLCA2ICwgMS8xMFxuXHRcdFx0Lm1hcCAodCktPlxuXHRcdFx0XHRyZXMgPVxuXHRcdFx0XHRcdHg6IHhGdW4gdFxuXHRcdFx0XHRcdGR2OiBkdkZ1biB0XG5cdFx0XHRcdFx0djogdkZ1biB0XG5cdFx0XHRcdFx0dDogdFxuXHRcdEBtb3ZlIDAgXG5cblx0Y2xpY2s6IC0+XG5cdFx0aWYgQHBhdXNlZCB0aGVuIEBwbGF5KCkgZWxzZSBAcGF1c2UoKVxuXG5cdHBhdXNlOiAtPlxuXHRcdEBwYXVzZWQgPSB0cnVlXG5cblx0aW5jcmVtZW50OihkdCkgLT5cblx0XHRAdCArPSBkdFxuXHRcdEBtb3ZlKEB0KVxuXG5cdHNldFQ6ICh0KS0+XG5cdFx0QHQgPSB0XG5cdFx0QG1vdmUgQHRcblxuXHRwbGF5OiAtPlxuXHRcdEBwYXVzZWQgPSB0cnVlXG5cdFx0ZDMudGltZXIuZmx1c2goKVxuXHRcdEBwYXVzZWQgPSBmYWxzZVxuXHRcdGxhc3QgPSAwXG5cdFx0ZDMudGltZXIgKGVsYXBzZWQpPT5cblx0XHRcdFx0ZHQgPSBlbGFwc2VkIC0gbGFzdFxuXHRcdFx0XHRAaW5jcmVtZW50IGR0LzEwMDBcblx0XHRcdFx0bGFzdCA9IGVsYXBzZWRcblx0XHRcdFx0aWYgQHQgPiA2IHRoZW4gQHNldFQgMFxuXHRcdFx0XHRAcm9vdFNjb3BlLiRldmFsQXN5bmMoKVxuXHRcdFx0XHRAcGF1c2VkXG5cdFx0XHQsIDFcblxuXHRtb3ZlOiAodCktPlxuXHRcdEBwb2ludCA9IFxuXHRcdFx0eDogeEZ1biB0XG5cdFx0XHRkdjogZHZGdW4gdFxuXHRcdFx0djogdkZ1biB0XG5cdFx0XHR0OiB0XG5cbm1vZHVsZS5leHBvcnRzID0gU2VydmljZSIsImNsYXNzIEN0cmxcblx0Y29uc3RydWN0b3I6KEBzY29wZSktPlxuXG5cdHRyYW5zOiAodHJhbiktPlxuXHRcdHRyYW5cblx0XHRcdC5kdXJhdGlvbiA0MFxuXHRcdFx0LmVhc2UgJ2xpbmVhcidcblxuZGVyID0gKCktPlxuXHRkaXJlY3RpdmUgPSBcblx0XHRzY29wZTogXG5cdFx0XHRzaXplOiAnPSdcblx0XHRcdGxlZnQ6ICc9J1xuXHRcdFx0dG9wOiAnPSdcblx0XHRjb250cm9sbGVyQXM6ICd2bSdcblx0XHR0ZW1wbGF0ZU5hbWVzcGFjZTogJ3N2Zydcblx0XHRjb250cm9sbGVyOiBbJyRzY29wZScsQ3RybF1cblx0XHR0ZW1wbGF0ZVVybDogJy4vYXBwL2NvbXBvbmVudHMvY2FydC9jYXJ0LnN2Zydcblx0XHRiaW5kVG9Db250cm9sbGVyOiB0cnVlXG5cdFx0cmVzdHJpY3Q6ICdBJ1xuXG5tb2R1bGUuZXhwb3J0cyA9IGRlciIsImFuZ3VsYXIgPSByZXF1aXJlICdhbmd1bGFyJ1xuZDMgPSByZXF1aXJlICdkMydcbnJlcXVpcmUgJy4uLy4uL2hlbHBlcnMnXG5fID0gcmVxdWlyZSAnbG9kYXNoJ1xuUGxvdEN0cmwgPSByZXF1aXJlICcuLi8uLi9kaXJlY3RpdmVzL3Bsb3RDdHJsJ1xuXG50ZW1wbGF0ZSA9ICcnJ1xuXHQ8c3ZnIG5nLWluaXQ9J3ZtLnJlc2l6ZSgpJyBjbGFzcz0nYm90dG9tQ2hhcnQnID5cblx0XHQ8ZyBib2lsZXJwbGF0ZS1kZXIgd2lkdGg9J3ZtLndpZHRoJyBoZWlnaHQ9J3ZtLmhlaWdodCcgdmVyLWF4LWZ1bj0ndm0udmVyQXhGdW4nIGhvci1heC1mdW49J3ZtLmhvckF4RnVuJyB2ZXI9J3ZtLlZlcicgaG9yPSd2bS5Ib3InIG1hcj0ndm0ubWFyJyBuYW1lPSd2bS5uYW1lJz5cblx0XHRcdDxmb3JlaWduT2JqZWN0IHdpZHRoPSczMCcgaGVpZ2h0PSczMCcgeT0nNScgeD0nLTgnIHNoaWZ0ZXI9J1t2bS53aWR0aCwgdm0uaGVpZ2h0XSc+XG5cdFx0XHRcdFx0PHRleHQgY2xhc3M9J2xhYmVsJyA+JHQkPC90ZXh0PlxuXHRcdFx0PC9mb3JlaWduT2JqZWN0PlxuXHRcdFx0PGZvcmVpZ25PYmplY3Qgd2lkdGg9JzMwJyBoZWlnaHQ9JzMwJyB5PScwJyB4PSctMTUnIHNoaWZ0ZXI9J1swLCAwXSc+XG5cdFx0XHRcdFx0PHRleHQgY2xhc3M9J2xhYmVsJyA+JHYkPC90ZXh0PlxuXHRcdFx0PC9mb3JlaWduT2JqZWN0PlxuXHRcdDwvZz5cblx0XHQ8ZyBjbGFzcz0nbWFpbicgbmctYXR0ci1jbGlwLXBhdGg9J3VybCgje3t2bS5uYW1lfX0pJyBzaGlmdGVyPSdbdm0ubWFyLmxlZnQsIHZtLm1hci50b3BdJz5cblxuXHRcdFx0PHBhdGggbmctYXR0ci1kPSd7e3ZtLmxpbmVGdW4odm0uRGF0YS50cmFqZWN0b3J5KX19JyBjbGFzcz0nZnVuIHYnIC8+XG5cdFx0XHQ8bGluZSBjbGFzcz0ndHJpIHYnIGQzLWRlcj0ne3gxOiB2bS5Ib3Iodm0ucG9pbnQudCktMSwgeDI6IHZtLkhvcih2bS5wb2ludC50KS0xLCB5MTogdm0uVmVyKHZtLnBvaW50LnYpLCB5Mjogdm0uVmVyKDApfScvPlxuXHRcdFx0PGZvcmVpZ25PYmplY3Qgd2lkdGg9JzMwJyBoZWlnaHQ9JzMwJyBzaGlmdGVyPSdbKHZtLkhvcih2bS5wb2ludC50KSAtIDE2KSwgdm0uVmVyKHZtLnBvaW50LnYvMildJz5cblx0XHRcdFx0XHQ8dGV4dCBjbGFzcz0ndHJpLWxhYmVsJyA+JHkkPC90ZXh0PlxuXHRcdFx0PC9mb3JlaWduT2JqZWN0PlxuXHRcdFx0PGZvcmVpZ25PYmplY3Qgd2lkdGg9JzEwMCcgaGVpZ2h0PSczMCcgc2hpZnRlcj0nW3ZtLkhvcigzLjUpLCB2bS5WZXIoMC40KV0nPlxuXHRcdFx0XHQ8dGV4dCBjbGFzcz0ndHJpLWxhYmVsJz4kMmVeey0uOHR9JDwvdGV4dD5cblx0XHRcdDwvZm9yZWlnbk9iamVjdD5cblx0XHRcdDxjaXJjbGUgcj0nM3B4JyAgc2hpZnRlcj0nW3ZtLkhvcih2bS5wb2ludC50KSwgdm0uVmVyKHZtLnBvaW50LnYpXScgY2xhc3M9J3BvaW50IHYnLz5cblx0XHRcdDxyZWN0IGNsYXNzPSdleHBlcmltZW50JyBuZy1hdHRyLWhlaWdodD0ne3t2bS5oZWlnaHR9fScgbmctYXR0ci13aWR0aD0ne3t2bS53aWR0aH19JyAvPlxuXHRcdDwvZz5cblx0PC9zdmc+XG4nJydcblxuY2xhc3MgQ3RybCBleHRlbmRzIFBsb3RDdHJsXG5cdGNvbnN0cnVjdG9yOiAoQHNjb3BlLCBAZWwsIEB3aW5kb3csIEBEYXRhKS0+XG5cdFx0c3VwZXIgQHNjb3BlLCBAZWwsIEB3aW5kb3dcblx0XHRAbmFtZSA9ICdjYXJ0UGxvdCdcblx0XHRAVmVyLmRvbWFpbiBbLS4xLDIuM11cblx0XHRASG9yLmRvbWFpbiBbLS4xLDQuNV1cblx0XHRAbGluZUZ1blxuXHRcdFx0LnkgKGQpPT4gQFZlciBkLnZcblx0XHRcdC54IChkKT0+IEBIb3IgZC50XG5cblx0XHRARGF0YS5wbGF5KClcblxuXHRtb3ZlOiA9PlxuXHRcdHQgPSBASG9yLmludmVydCBldmVudC54IC0gZXZlbnQudGFyZ2V0LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLmxlZnRcblx0XHRARGF0YS5zZXRUIHRcblx0XHRAc2NvcGUuJGV2YWxBc3luYygpXG5cblx0QHByb3BlcnR5ICdwb2ludCcsIGdldDotPlxuXHRcdEBEYXRhLnBvaW50XG5cblx0QHByb3BlcnR5ICd0cmlhbmdsZURhdGEnLCBnZXQ6LT5cblx0XHRAbGluZUZ1biBbe3Y6IEBwb2ludC52LCB0OiBAcG9pbnQudH0sIHt2OkBwb2ludC5kdiArIEBwb2ludC52LCB0OiBAcG9pbnQudCsxfSwge3Y6IEBwb2ludC5kdiArIEBwb2ludC52LCB0OiBAcG9pbnQudH1dXG5cblxuZGVyID0gLT5cblx0ZGlyZWN0aXZlID0gXG5cdFx0Y29udHJvbGxlckFzOiAndm0nXG5cdFx0c2NvcGU6IHt9XG5cdFx0bGluazogKHNjb3BlLCBlbCwgYXR0ciwgdm0pLT5cblx0XHRcdGQzLnNlbGVjdCBlbFswXVxuXHRcdFx0XHQuc2VsZWN0ICdyZWN0LmJhY2tncm91bmQnXG5cdFx0XHRcdC5vbiAnbW91c2VvdmVyJywtPlxuXHRcdFx0XHRcdHZtLkRhdGEucGF1c2UoKVxuXHRcdFx0XHQub24gJ21vdXNlbW92ZScsIC0+XG5cdFx0XHRcdFx0dm0ubW92ZSgpXG5cdFx0XHRcdC5vbiAnbW91c2VvdXQnLCAtPlxuXHRcdFx0XHRcdHZtLkRhdGEucGxheSgpXG5cdFx0dGVtcGxhdGU6IHRlbXBsYXRlXG5cdFx0dGVtcGxhdGVOYW1lc3BhY2U6ICdzdmcnXG5cdFx0Y29udHJvbGxlcjogWyckc2NvcGUnLCckZWxlbWVudCcsICckd2luZG93JywnY2FydERhdGEnLCBDdHJsXVxuXG5tb2R1bGUuZXhwb3J0cyA9IGRlciIsIl8gPSByZXF1aXJlICdsb2Rhc2gnXG5yZXF1aXJlICcuLi8uLi9oZWxwZXJzJ1xuXG50ZW1wbGF0ZSA9ICcnJ1xuXHQ8ZGl2IGNhcnQtZGVyIGRhdGE9XCJ2bS5jYXJ0RGF0YS5wb2ludFwiIG1heD1cInZtLm1heFwiIHNhbXBsZT0ndm0uc2FtcGxlJz48L2Rpdj5cbicnJ1xuXG5jbGFzcyBDdHJsXG5cdGNvbnN0cnVjdG9yOiAoQHNjb3BlLCBAY2FydERhdGEpLT5cblx0XHRAc2FtcGxlID0gW11cblx0XHQjIEBjYXJ0ID0gQGNhcnREYXRhLnBvaW50XG5cdFx0QG1heCA9IDNcblxuXHQjIEBwcm9wZXJ0eSAnbWF4JywgZ2V0Oi0+XG5cdCMgXHQzXG5cbmRlciA9IC0+XG5cdGRpcmVjdGl2ZSA9IFxuXHRcdHNjb3BlOiB7fVxuXHRcdHJlc3RyaWN0OiAnQSdcblx0XHRiaW5kVG9Db250cm9sbGVyOiB0cnVlXG5cdFx0dGVtcGxhdGU6IHRlbXBsYXRlXG5cdFx0Y29udHJvbGxlcjogWyckc2NvcGUnLCAnY2FydERhdGEnLCBDdHJsXVxuXHRcdGNvbnRyb2xsZXJBczogJ3ZtJ1xuXG5tb2R1bGUuZXhwb3J0cyA9IGRlclxuIiwiYW5ndWxhciA9IHJlcXVpcmUgJ2FuZ3VsYXInXG5kMyA9IHJlcXVpcmUgJ2QzJ1xucmVxdWlyZSAnLi4vLi4vaGVscGVycydcbl8gPSByZXF1aXJlICdsb2Rhc2gnXG5QbG90Q3RybCA9IHJlcXVpcmUgJy4uLy4uL2RpcmVjdGl2ZXMvcGxvdEN0cmwnXG5cbnRlbXBsYXRlID0gJycnXG5cdDxkaXYgY2xhc3M9J2V4cGxhaW5lcic+XG5cdCAgPGRpdj5cblx0ICAgIDxwPkhvdmVyIHRvIGNob29zZSBhIHRpbWUuPC9wPlxuXHQgIDwvZGl2PlxuXHQ8L2Rpdj5cblx0PHN2ZyBuZy1pbml0PSd2bS5yZXNpemUoKScgY2xhc3M9J3RvcENoYXJ0JyA+XG5cdFx0PGcgYm9pbGVycGxhdGUtZGVyIHdpZHRoPSd2bS53aWR0aCcgaGVpZ2h0PSd2bS5oZWlnaHQnIHZlci1heC1mdW49J3ZtLnZlckF4RnVuJyBob3ItYXgtZnVuPSd2bS5ob3JBeEZ1bicgdmVyPSd2bS5WZXInIGhvcj0ndm0uSG9yJyBtYXI9J3ZtLm1hcicgbmFtZT0ndm0ubmFtZSc+XG5cdFx0PC9nPlxuXHRcdDxnIGNsYXNzPSdtYWluJyBuZy1hdHRyLWNsaXAtcGF0aD0ndXJsKCN7e3ZtLm5hbWV9fSknIHNoaWZ0ZXI9J1t2bS5tYXIubGVmdCwgdm0ubWFyLnRvcF0nPlxuXHRcdFx0PGZvcmVpZ25PYmplY3Qgd2lkdGg9JzMwJyBoZWlnaHQ9JzMwJyB4PSctMTUnIHk9Jy0yMCcgc2hpZnRlcj0nW3ZtLndpZHRoLCB2bS5WZXIoMCldJz5cblx0XHRcdFx0XHQ8dGV4dCBjbGFzcz0nbGFiZWwnPiR0JDwvdGV4dD5cblx0XHRcdDwvZm9yZWlnbk9iamVjdD5cblx0XHRcdDxwYXRoIG5nLWF0dHItZD0ne3t2bS5saW5lRnVuKHZtLkRhdGEudHJhamVjdG9yeSl9fScgY2xhc3M9J2Z1biB2JyAvPlxuXHRcdFx0PHBhdGggbmctYXR0ci1kPSd7e3ZtLnRyaWFuZ2xlRGF0YX19JyBjbGFzcz0ndHJpJyAvPlxuXHRcdFx0PGxpbmUgY2xhc3M9J3RyaSBkdicgZDMtZGVyPSd7eDE6IHZtLkhvcih2bS5wb2ludC50KS0xLCB4Mjogdm0uSG9yKHZtLnBvaW50LnQpLTEsIHkxOiB2bS5WZXIodm0ucG9pbnQudiksIHkyOiB2bS5WZXIoKHZtLnBvaW50LnYgKyB2bS5wb2ludC5kdikpfScvPlxuXHRcdFx0PGZvcmVpZ25PYmplY3Qgd2lkdGg9JzMwJyBoZWlnaHQ9JzMwJyBzaGlmdGVyPSdbKHZtLkhvcih2bS5wb2ludC50KSAtIDE2KSwgdm0uc3RoaW5nXSc+XG5cdFx0XHRcdFx0PHRleHQgY2xhc3M9J3RyaS1sYWJlbCcgPiRcXFxcZG90e3l9JDwvdGV4dD5cblx0XHRcdDwvZm9yZWlnbk9iamVjdD5cblx0XHRcdDxmb3JlaWduT2JqZWN0IHdpZHRoPScxMDAnIGhlaWdodD0nMzAnIHNoaWZ0ZXI9J1t2bS5Ib3IoMS42NSksIHZtLlZlcigxLjM4KV0nPlxuXHRcdFx0XHQ8dGV4dCBjbGFzcz0ndHJpLWxhYmVsJz4kXFxcXHNpbih0KSQ8L3RleHQ+XG5cdFx0XHQ8L2ZvcmVpZ25PYmplY3Q+XG5cdFx0XHQ8Y2lyY2xlIHI9JzNweCcgIHNoaWZ0ZXI9J1t2bS5Ib3Iodm0ucG9pbnQudCksIHZtLlZlcih2bS5wb2ludC52KV0nIGNsYXNzPSdwb2ludCB2Jy8+XG5cdFx0XHQ8cmVjdCBjbGFzcz0nZXhwZXJpbWVudCcgbmctYXR0ci1oZWlnaHQ9J3t7dm0uaGVpZ2h0fX0nIG5nLWF0dHItd2lkdGg9J3t7dm0ud2lkdGh9fScgLz5cblx0XHQ8L2c+XG5cdDwvc3ZnPlxuJycnXG5cbmNsYXNzIEN0cmwgZXh0ZW5kcyBQbG90Q3RybFxuXHRjb25zdHJ1Y3RvcjogKEBzY29wZSwgQGVsLCBAd2luZG93LCBARGF0YSktPlxuXHRcdHN1cGVyIEBzY29wZSwgQGVsLCBAd2luZG93XG5cdFx0QG5hbWUgPSAnZGVyaXZhdGl2ZUEnXG5cdFx0QFZlci5kb21haW4gWy0xLjUsMS41XVxuXHRcdEBIb3IuZG9tYWluIFswLDZdXG5cdFx0QGxpbmVGdW5cblx0XHRcdCMgLmludGVycG9sYXRlICdjYXJkaW5hbCdcblx0XHRcdC55IChkKT0+IEBWZXIgZC52XG5cdFx0XHQueCAoZCk9PiBASG9yIGQudFxuXG5cdFx0c2V0VGltZW91dCA9PlxuXHRcdFx0QERhdGEucGxheSgpXG5cblx0bW92ZTogPT5cblx0XHR0ID0gQEhvci5pbnZlcnQgZXZlbnQueCAtIGV2ZW50LnRhcmdldC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS5sZWZ0XG5cdFx0QERhdGEuc2V0VCB0XG5cdFx0QHNjb3BlLiRldmFsQXN5bmMoKVxuXG5cdEBwcm9wZXJ0eSAnc3RoaW5nJywgZ2V0Oi0+XG5cdFx0QFZlcihAcG9pbnQuZHYvMiArIEBwb2ludC52KSAtIDdcblxuXHRAcHJvcGVydHkgJ3BvaW50JywgZ2V0Oi0+XG5cdFx0QERhdGEucG9pbnRcblxuXHRAcHJvcGVydHkgJ3RyaWFuZ2xlRGF0YScsIGdldDotPlxuXHRcdEBsaW5lRnVuIFt7djogQHBvaW50LnYsIHQ6IEBwb2ludC50fSwge3Y6QHBvaW50LmR2ICsgQHBvaW50LnYsIHQ6IEBwb2ludC50KzF9LCB7djogQHBvaW50LmR2ICsgQHBvaW50LnYsIHQ6IEBwb2ludC50fV1cblxuXG5kZXIgPSAtPlxuXHRkaXJlY3RpdmUgPSBcblx0XHRjb250cm9sbGVyQXM6ICd2bSdcblx0XHRzY29wZToge31cblx0XHRsaW5rOiAoc2NvcGUsIGVsLCBhdHRyLCB2bSktPlxuXHRcdFx0ZDMuc2VsZWN0IGVsWzBdXG5cdFx0XHRcdC5zZWxlY3QgJ3JlY3QuYmFja2dyb3VuZCdcblx0XHRcdFx0Lm9uICdtb3VzZW92ZXInLC0+XG5cdFx0XHRcdFx0dm0uRGF0YS5wYXVzZSgpXG5cdFx0XHRcdC5vbiAnbW91c2Vtb3ZlJywgLT5cblx0XHRcdFx0XHR2bS5tb3ZlKClcblx0XHRcdFx0Lm9uICdtb3VzZW91dCcsIC0+XG5cdFx0XHRcdFx0dm0uRGF0YS5wbGF5KClcblx0XHR0ZW1wbGF0ZTogdGVtcGxhdGVcblx0XHR0ZW1wbGF0ZU5hbWVzcGFjZTogJ3N2Zydcblx0XHRjb250cm9sbGVyOiBbJyRzY29wZScsJyRlbGVtZW50JywgJyR3aW5kb3cnLCdkZXJpdmF0aXZlRGF0YScsIEN0cmxdXG5cbm1vZHVsZS5leHBvcnRzID0gZGVyXG4iLCJhbmd1bGFyID0gcmVxdWlyZSAnYW5ndWxhcidcbmQzID0gcmVxdWlyZSAnZDMnXG5yZXF1aXJlICcuLi8uLi9oZWxwZXJzJ1xuXyA9IHJlcXVpcmUgJ2xvZGFzaCdcbiMgRGF0YSA9IHJlcXVpcmUgJy4vZGVyaXZhdGl2ZURhdGEnXG5QbG90Q3RybCA9IHJlcXVpcmUgJy4uLy4uL2RpcmVjdGl2ZXMvcGxvdEN0cmwnXG5cbnRlbXBsYXRlID0gJycnXG5cdDxzdmcgbmctaW5pdD0ndm0ucmVzaXplKCknIGNsYXNzPSd0b3BDaGFydCc+XG5cdFx0PGcgYm9pbGVycGxhdGUtZGVyIHdpZHRoPSd2bS53aWR0aCcgaGVpZ2h0PSd2bS5oZWlnaHQnIHZlci1heC1mdW49J3ZtLnZlckF4RnVuJyBob3ItYXgtZnVuPSd2bS5ob3JBeEZ1bicgdmVyPSd2bS5WZXInIGhvcj0ndm0uSG9yJyBtYXI9J3ZtLm1hcicgbmFtZT0ndm0ubmFtZSc+PC9nPlxuXHRcdDxnIGNsYXNzPSdtYWluJyBuZy1hdHRyLWNsaXAtcGF0aD1cInVybCgje3t2bS5uYW1lfX0pXCIgc2hpZnRlcj0nW3ZtLm1hci5sZWZ0LCB2bS5tYXIudG9wXSc+XG5cdFx0XHQ8Zm9yZWlnbk9iamVjdCB3aWR0aD0nMzAnIGhlaWdodD0nMzAnIHg9Jy0xNScgeT0nLTIwJyBzaGlmdGVyPSdbdm0ud2lkdGgsIHZtLlZlcigwKV0nPlxuXHRcdFx0XHRcdDx0ZXh0IGNsYXNzPSdsYWJlbCc+JHQkPC90ZXh0PlxuXHRcdFx0PC9mb3JlaWduT2JqZWN0PlxuXHRcdFx0PHBhdGggZDMtZGVyPSd7ZDp2bS5saW5lRnVuKHZtLkRhdGEudHJhamVjdG9yeSl9JyBjbGFzcz0nZnVuIGR2JyAvPlxuXHRcdFx0PGxpbmUgY2xhc3M9J3RyaSBkdicgZDMtZGVyPSd7eDE6IHZtLkhvcih2bS5wb2ludC50KSwgeDI6IHZtLkhvcih2bS5wb2ludC50KSwgeTE6IHZtLlZlcigwKSwgeTI6IHZtLlZlcih2bS5wb2ludC5kdil9Jy8+XG5cdFx0XHQ8Zm9yZWlnbk9iamVjdCB3aWR0aD0nMzAnIGhlaWdodD0nMzAnIHNoaWZ0ZXI9J1sodm0uSG9yKHZtLnBvaW50LnQpIC0gMTYpLCB2bS5WZXIodm0ucG9pbnQuZHYqLjUpLTZdJz5cblx0XHRcdFx0XHQ8dGV4dCBjbGFzcz0ndHJpLWxhYmVsJz4kXFxcXGRvdHt5fSQ8L3RleHQ+XG5cdFx0XHQ8L2ZvcmVpZ25PYmplY3Q+XG5cdFx0XHQ8Zm9yZWlnbk9iamVjdCB3aWR0aD0nMTAwJyBoZWlnaHQ9JzMwJyBzaGlmdGVyPSdbdm0uSG9yKC45KSwgdm0uVmVyKDEpXSc+XG5cdFx0XHRcdDx0ZXh0IGNsYXNzPSd0cmktbGFiZWwnPiRcXFxcY29zKHQpJDwvdGV4dD5cblx0XHRcdDwvZm9yZWlnbk9iamVjdD5cblx0XHRcdDxjaXJjbGUgcj0nNHB4JyAgc2hpZnRlcj0nW3ZtLkhvcih2bS5wb2ludC50KSwgdm0uVmVyKHZtLnBvaW50LmR2KV0nIGNsYXNzPSdwb2ludCBkdicvPlxuXHRcdFx0PHJlY3QgY2xhc3M9J2V4cGVyaW1lbnQnIG5nLWF0dHItaGVpZ2h0PSd7e3ZtLmhlaWdodH19JyBuZy1hdHRyLXdpZHRoPSd7e3ZtLndpZHRofX0nIC8+XG5cdFx0PC9nPlxuXHQ8L3N2Zz5cbicnJ1xuXG5jbGFzcyBDdHJsIGV4dGVuZHMgUGxvdEN0cmxcblx0Y29uc3RydWN0b3I6IChAc2NvcGUsIEBlbCwgQHdpbmRvdywgQERhdGEpLT5cblx0XHRzdXBlciBAc2NvcGUsIEBlbCwgQHdpbmRvd1xuXHRcdEBWZXIuZG9tYWluIFstMS41LDEuNV1cblx0XHRASG9yLmRvbWFpbiBbMCw2XVxuXHRcdEBuYW1lID0gJ2Rlcml2YXRpdmVCJ1xuXHRcdEBsaW5lRnVuXG5cdFx0XHQueSAoZCk9PiBAVmVyIGQuZHZcblx0XHRcdC54IChkKT0+IEBIb3IgZC50XG5cblx0bW92ZTogPT5cblx0XHR0ID0gQEhvci5pbnZlcnQgZXZlbnQueCAtIGV2ZW50LnRhcmdldC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS5sZWZ0XG5cdFx0QERhdGEuc2V0VCB0XG5cdFx0QHNjb3BlLiRldmFsQXN5bmMoKVxuXG5cdEBwcm9wZXJ0eSAncG9pbnQnLCBnZXQ6LT5cblx0XHRARGF0YS5wb2ludFxuXG5kZXIgPSAtPlxuXHRkaXJlY3RpdmUgPSBcblx0XHRjb250cm9sbGVyQXM6ICd2bSdcblx0XHRzY29wZToge31cblx0XHRsaW5rOiAoc2NvcGUsZWwsYXR0ciwgdm0pLT5cblx0XHRcdGQzLnNlbGVjdCBlbFswXVxuXHRcdFx0XHQuc2VsZWN0ICdyZWN0LmJhY2tncm91bmQnXG5cdFx0XHRcdC5vbiAnbW91c2VvdmVyJywtPlxuXHRcdFx0XHRcdHZtLkRhdGEucGF1c2UoKVxuXHRcdFx0XHQub24gJ21vdXNlbW92ZScsIC0+XG5cdFx0XHRcdFx0dm0ubW92ZSgpXG5cdFx0XHRcdC5vbiAnbW91c2VvdXQnLCAtPlxuXHRcdFx0XHRcdHZtLkRhdGEucGxheSgpXG5cdFx0dGVtcGxhdGU6IHRlbXBsYXRlXG5cdFx0dGVtcGxhdGVOYW1lc3BhY2U6ICdzdmcnXG5cdFx0Y29udHJvbGxlcjogWyckc2NvcGUnLCckZWxlbWVudCcsICckd2luZG93JywgJ2Rlcml2YXRpdmVEYXRhJywgQ3RybF1cblxubW9kdWxlLmV4cG9ydHMgPSBkZXJcbiIsIl8gPSByZXF1aXJlICdsb2Rhc2gnXG52RnVuID0gTWF0aC5zaW5cbmR2RnVuID0gTWF0aC5jb3NcblxuY2xhc3MgU2VydmljZVxuXHRjb25zdHJ1Y3RvcjogKCRyb290U2NvcGUpLT5cblx0XHRAcm9vdFNjb3BlID0gJHJvb3RTY29wZVxuXHRcdEBzZXRUIDBcblx0XHRAcGF1c2VkID0gIGZhbHNlXG5cdFx0QHRyYWplY3RvcnkgPSBfLnJhbmdlIDAgLCA2ICwgLjE4XG5cdFx0XHQubWFwICh0KS0+XG5cdFx0XHRcdHJlcyA9IFxuXHRcdFx0XHRcdGR2OiBkdkZ1biB0XG5cdFx0XHRcdFx0djogdkZ1biB0XG5cdFx0XHRcdFx0dDogdFxuXHRcdEBtb3ZlIDBcblxuXHRjbGljazogLT5cblx0XHRpZiBAcGF1c2VkIHRoZW4gQHBsYXkoKSBlbHNlIEBwYXVzZSgpXG5cblx0cGF1c2U6IC0+XG5cdFx0QHBhdXNlZCA9IHRydWVcblxuXHRpbmNyZW1lbnQ6KGR0KSAtPlxuXHRcdEB0ICs9IGR0XG5cdFx0QG1vdmUoQHQpXG5cblx0c2V0VDogKHQpLT5cblx0XHRAdCA9IHRcblx0XHRAbW92ZShAdClcblxuXHRwbGF5OiAtPlxuXHRcdEBwYXVzZWQgPSB0cnVlXG5cdFx0ZDMudGltZXIuZmx1c2goKVxuXHRcdEBwYXVzZWQgPSBmYWxzZVxuXHRcdGxhc3QgPSAwXG5cdFx0ZDMudGltZXIgKGVsYXBzZWQpPT5cblx0XHRcdFx0ZHQgPSBlbGFwc2VkIC0gbGFzdFxuXHRcdFx0XHRAaW5jcmVtZW50IGR0LzEwMDBcblx0XHRcdFx0bGFzdCA9IGVsYXBzZWRcblx0XHRcdFx0aWYgQHQgPiA2IHRoZW4gQHNldFQgMFxuXHRcdFx0XHRAcm9vdFNjb3BlLiRldmFsQXN5bmMoKVxuXHRcdFx0XHRAcGF1c2VkXG5cdFx0XHQsIDFcblxuXHRtb3ZlOiAodCktPlxuXHRcdEBwb2ludCA9IFxuXHRcdFx0ZHY6IGR2RnVuIHRcblx0XHRcdHY6IHZGdW4gdFxuXHRcdFx0dDogdFxuXG5tb2R1bGUuZXhwb3J0cyA9IFNlcnZpY2UiLCJyZXF1aXJlICcuLi8uLi9oZWxwZXJzJ1xuUGxvdEN0cmwgPSByZXF1aXJlICcuLi8uLi9kaXJlY3RpdmVzL3Bsb3RDdHJsJ1xuXG50ZW1wbGF0ZSA9ICcnJ1xuXHQ8ZGl2IGNsYXNzPSdleHBsYWluZXInPlxuXHQgIDxkaXY+XG5cdCAgICA8cD5MZWZ0LWNsaWNrIHRvIGFkZCBhIHBvaW50ICQodix0KSQuIDxicj5cblx0ICAgIFx0Q2xpY2stYW5kLWRyYWcgdG8gbW92ZSBpdDsgPGJyPlxuXHQgICAgXHRyaWdodC1jbGljayB0byBkZWxldGUgaXQuXG5cdCAgICA8L3A+XG5cdCAgPC9kaXY+XG5cdDwvZGl2PlxuXHQ8c3ZnIG5nLWluaXQ9J3ZtLnJlc2l6ZSgpJyBjbGFzcz0nYm90dG9tQ2hhcnQnID5cblx0XHQ8ZyBib2lsZXJwbGF0ZS1kZXIgd2lkdGg9J3ZtLndpZHRoJyBoZWlnaHQ9J3ZtLmhlaWdodCcgdmVyLWF4LWZ1bj0ndm0udmVyQXhGdW4nIGhvci1heC1mdW49J3ZtLmhvckF4RnVuJyB2ZXI9J3ZtLlZlcicgaG9yPSd2bS5Ib3InIG1hcj0ndm0ubWFyJyBuYW1lPSdcImRlc2lnbkFcIic+XG5cdFx0XHQ8Zm9yZWlnbk9iamVjdCB3aWR0aD0nMzAnIGhlaWdodD0nMzAnIHk9JzUnIHg9Jy04JyBzaGlmdGVyPSdbdm0ud2lkdGgsIHZtLmhlaWdodF0nPlxuXHRcdFx0XHRcdDx0ZXh0IGNsYXNzPSdsYWJlbCcgPiR0JDwvdGV4dD5cblx0XHRcdDwvZm9yZWlnbk9iamVjdD5cblx0XHRcdDxmb3JlaWduT2JqZWN0IHdpZHRoPSczMCcgaGVpZ2h0PSczMCcgeT0nMCcgeD0nLTE1JyBzaGlmdGVyPSdbMCwgMF0nPlxuXHRcdFx0XHRcdDx0ZXh0IGNsYXNzPSdsYWJlbCcgPiR2JDwvdGV4dD5cblx0XHRcdDwvZm9yZWlnbk9iamVjdD5cblx0XHQ8L2c+XG5cdFx0PGcgY2xhc3M9J21haW4nIGNsaXAtcGF0aD1cInVybCgjZGVzaWduQSlcIiBzaGlmdGVyPSdbdm0ubWFyLmxlZnQsIHZtLm1hci50b3BdJyA+XG5cdFx0XHQ8cmVjdCBzdHlsZT0nb3BhY2l0eTowJyBuZy1hdHRyLWhlaWdodD0ne3t2bS5oZWlnaHR9fScgbmctYXR0ci13aWR0aD0ne3t2bS53aWR0aH19JyBiZWhhdmlvcj0ndm0uZHJhZ19yZWN0Jz48L3JlY3Q+XG5cdFx0XHQ8ZyBuZy1jbGFzcz0ne2hpZGU6ICF2bS5EYXRhLnNob3d9JyA+XG5cdFx0XHRcdDxsaW5lIGNsYXNzPSd0cmkgdicgZDMtZGVyPSd7eDE6IHZtLkhvcih2bS5zZWxlY3RlZC50KS0xLCB4Mjogdm0uSG9yKHZtLnNlbGVjdGVkLnQpLTEsIHkxOiB2bS5WZXIoMCksIHkyOiB2bS5WZXIodm0uc2VsZWN0ZWQudil9Jy8+XG5cdFx0XHRcdDxwYXRoIG5nLWF0dHItZD0ne3t2bS50cmlhbmdsZURhdGEoKX19JyBjbGFzcz0ndHJpJyAvPlxuXHRcdFx0XHQ8bGluZSBkMy1kZXI9J3t4MTogdm0uSG9yKHZtLnNlbGVjdGVkLnQpKzEsIHgyOiB2bS5Ib3Iodm0uc2VsZWN0ZWQudCkrMSwgeTE6IHZtLlZlcih2bS5zZWxlY3RlZC52KSwgeTI6IHZtLlZlcih2bS5zZWxlY3RlZC52ICsgdm0uc2VsZWN0ZWQuZHYpfScgY2xhc3M9J3RyaSBkdicgLz5cblx0XHRcdDwvZz5cblx0XHRcdDxwYXRoIG5nLWF0dHItZD0ne3t2bS5saW5lRnVuKHZtLnRydWVDYXJ0LnRyYWplY3RvcnkpfX0nIGNsYXNzPSdmdW4gdGFyZ2V0JyAvPlxuXHRcdFx0PHBhdGggbmctYXR0ci1kPSd7e3ZtLmxpbmVGdW4odm0uZmFrZUNhcnQuZG90cyl9fScgY2xhc3M9J2Z1biB2JyAvPlxuXHRcdFx0PGcgbmctcmVwZWF0PSdkb3QgaW4gdm0uZG90cyB0cmFjayBieSBkb3QuaWQnIGRhdHVtPWRvdCBzaGlmdGVyPSdbdm0uSG9yKGRvdC50KSx2bS5WZXIoZG90LnYpXScgYmVoYXZpb3I9J3ZtLmRyYWcnIGRvdC1hLWRlcj1kb3QgPjwvZz5cblx0XHRcdDxjaXJjbGUgY2xhc3M9J2RvdCBzbWFsbCcgcj0nNCcgc2hpZnRlcj0nW3ZtLkhvcigwKSx2bS5WZXIoMildJyAvPlxuXHRcdFx0PGZvcmVpZ25PYmplY3Qgd2lkdGg9JzcwJyBoZWlnaHQ9JzMwJyBzaGlmdGVyPSdbdm0uSG9yKDMuNyksIHZtLlZlciguMzMpXSc+XG5cdFx0XHRcdFx0PHRleHQgY2xhc3M9J3RyaS1sYWJlbCcgPiQyZV57LS44dH0kPC90ZXh0PlxuXHRcdFx0PC9mb3JlaWduT2JqZWN0PlxuXHRcdFx0PGNpcmNsZSByPSc0cHgnICBzaGlmdGVyPSdbdm0uSG9yKHZtLkRhdGEudCksIHZtLlZlcih2bS5mYWtlQ2FydC52KV0nIGNsYXNzPSdwb2ludCBmYWtlJy8+XG5cdFx0XHQ8Y2lyY2xlIHI9JzRweCcgIHNoaWZ0ZXI9J1t2bS5Ib3Iodm0uRGF0YS50KSwgdm0uVmVyKHZtLnRydWVDYXJ0LnYpXScgY2xhc3M9J3BvaW50IHJlYWwnLz5cblx0XHRcdDxyZWN0IGNsYXNzPSdleHBlcmltZW50JyBuZy1hdHRyLWhlaWdodD0ne3t2bS5oZWlnaHR9fScgbmctYXR0ci13aWR0aD0ne3t2bS53aWR0aH19JyAvPlxuXHRcdDwvZz5cblx0PC9zdmc+XG4nJydcblxuY2xhc3MgQ3RybCBleHRlbmRzIFBsb3RDdHJsXG5cdGNvbnN0cnVjdG9yOiAoQHNjb3BlLCBAZWwsIEB3aW5kb3csIEBmYWtlQ2FydCwgQHRydWVDYXJ0LCBARGF0YSktPlxuXHRcdHN1cGVyIEBzY29wZSwgQGVsLCBAd2luZG93XG5cdFx0QFZlci5kb21haW4gWy0uMSwyLjNdXG5cdFx0QEhvci5kb21haW4gWy0uMSw0LjVdXG5cblx0XHRAdHJhbiA9ICh0cmFuKS0+XG5cdFx0XHR0cmFuLmR1cmF0aW9uIDMwXG5cdFx0XHRcdC5lYXNlICdsaW5lYXInXG5cblx0XHRAbGluZUZ1blxuXHRcdFx0LnkgKGQpPT4gQFZlciBkLnZcblx0XHRcdC54IChkKT0+IEBIb3IgZC50XG5cblx0XHRAZHJhZ19yZWN0ID0gZDMuYmVoYXZpb3IuZHJhZygpXG5cdFx0XHQub24gJ2RyYWdzdGFydCcsICgpPT5cblx0XHRcdFx0ZDMuZXZlbnQuc291cmNlRXZlbnQuc3RvcFByb3BhZ2F0aW9uKClcblx0XHRcdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKVxuXHRcdFx0XHRpZiBldmVudC53aGljaCA9PSAzXG5cdFx0XHRcdFx0cmV0dXJuIFxuXHRcdFx0XHRARGF0YS5zZXRfc2hvdyB0cnVlXG5cdFx0XHRcdHJlY3QgPSBldmVudC50b0VsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KClcblx0XHRcdFx0dCA9IEBIb3IuaW52ZXJ0IGV2ZW50LnggLSByZWN0LmxlZnRcblx0XHRcdFx0diAgPSBAVmVyLmludmVydCBldmVudC55IC0gcmVjdC50b3Bcblx0XHRcdFx0QGZha2VDYXJ0LmFkZF9kb3QgdCAsIHZcblx0XHRcdFx0QHNjb3BlLiRldmFsQXN5bmMoKVxuXHRcdFx0Lm9uICdkcmFnJywgPT4gQG9uX2RyYWcgQHNlbGVjdGVkXG5cdFx0XHQub24gJ2RyYWdlbmQnLD0+XG5cdFx0XHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KClcblx0XHRcdFx0QERhdGEuc2V0X3Nob3cgdHJ1ZVxuXHRcdFx0XHRldmVudC5zdG9wUHJvcGFnYXRpb24oKVxuXG5cdFx0QGRyYWcgPSBkMy5iZWhhdmlvci5kcmFnKClcblx0XHRcdC5vbiAnZHJhZ3N0YXJ0JywgKGRvdCk9PlxuXHRcdFx0XHRkMy5ldmVudC5zb3VyY2VFdmVudC5zdG9wUHJvcGFnYXRpb24oKVxuXHRcdFx0XHRpZiBldmVudC53aGljaCA9PSAzXG5cdFx0XHRcdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKVxuXHRcdFx0XHRcdEBmYWtlQ2FydC5yZW1vdmVfZG90IGRvdFxuXHRcdFx0XHRcdEBEYXRhLnNldF9zaG93IGZhbHNlXG5cdFx0XHRcdFx0QHNjb3BlLiRldmFsQXN5bmMoKVxuXHRcdFx0Lm9uICdkcmFnJywgQG9uX2RyYWdcblxuXHRcdEBEYXRhLnBsYXkoKVxuXG5cdEBwcm9wZXJ0eSAnZG90cycsIGdldDotPiBcblx0XHRAZmFrZUNhcnQuZG90cy5maWx0ZXIgKGQpLT4gKGQuaWQgIT0nZmlyc3QnKSBhbmQgKGQuaWQgIT0nbGFzdCcpXG5cblx0QHByb3BlcnR5ICdzZWxlY3RlZCcsIGdldDotPiBAZmFrZUNhcnQuc2VsZWN0ZWRcblxuXHRvbl9kcmFnOiAoZG90KT0+IFxuXHRcdFx0QGZha2VDYXJ0LnVwZGF0ZV9kb3QgZG90LCBASG9yLmludmVydChkMy5ldmVudC54KSwgQFZlci5pbnZlcnQoZDMuZXZlbnQueSlcblx0XHRcdEBzY29wZS4kZXZhbEFzeW5jKClcblxuXHR0cmlhbmdsZURhdGE6LT5cblx0XHRwb2ludCA9IEBzZWxlY3RlZFxuXHRcdEBsaW5lRnVuIFt7djogcG9pbnQudiwgdDogcG9pbnQudH0sIHt2OnBvaW50LmR2ICsgcG9pbnQudiwgdDogcG9pbnQudCsxfSwge3Y6IHBvaW50LmR2ICsgcG9pbnQudiwgdDogcG9pbnQudH1dXG5cbmRlciA9ICgpLT5cblx0ZGlyZWN0aXZlID0gXG5cdFx0Y29udHJvbGxlckFzOiAndm0nXG5cdFx0c2NvcGU6IHt9XG5cdFx0dGVtcGxhdGU6IHRlbXBsYXRlXG5cdFx0dGVtcGxhdGVOYW1lc3BhY2U6ICdzdmcnXG5cdFx0Y29udHJvbGxlcjogWyckc2NvcGUnLCckZWxlbWVudCcsICckd2luZG93JywgJ2Zha2VDYXJ0JywgJ3RydWVDYXJ0JywgJ2Rlc2lnbkRhdGEnLCBDdHJsXVxuXG5tb2R1bGUuZXhwb3J0cyA9IGRlclxuIiwicmVxdWlyZSAnLi4vLi4vaGVscGVycydcblBsb3RDdHJsID0gcmVxdWlyZSAnLi4vLi4vZGlyZWN0aXZlcy9wbG90Q3RybCdcblxudGVtcGxhdGUgPSAnJydcblx0PHN2ZyBuZy1pbml0PSd2bS5yZXNpemUoKScgIGNsYXNzPSdib3R0b21DaGFydCc+XG5cdFx0PGcgYm9pbGVycGxhdGUtZGVyIHdpZHRoPSd2bS53aWR0aCcgaGVpZ2h0PSd2bS5oZWlnaHQnIHZlci1heC1mdW49J3ZtLnZlckF4RnVuJyBob3ItYXgtZnVuPSd2bS5ob3JBeEZ1bicgdmVyPSd2bS5WZXInIGhvcj0ndm0uSG9yJyBtYXI9J3ZtLm1hcicgbmFtZT0nXCJkZXNpZ25CXCInPlxuXHRcdFx0PGZvcmVpZ25PYmplY3Qgd2lkdGg9JzMwJyBoZWlnaHQ9JzMwJyB5PSc1JyB4PSctOCcgc2hpZnRlcj0nW3ZtLndpZHRoLCB2bS5oZWlnaHRdJz5cblx0XHRcdFx0XHQ8dGV4dCBjbGFzcz0nbGFiZWwnID4kdiQ8L3RleHQ+XG5cdFx0XHQ8L2ZvcmVpZ25PYmplY3Q+XG5cdFx0XHQ8Zm9yZWlnbk9iamVjdCB3aWR0aD0nMzAnIGhlaWdodD0nMzAnIHk9JzAnIHg9Jy0xNScgc2hpZnRlcj0nWzAsIDBdJz5cblx0XHRcdFx0XHQ8dGV4dCBjbGFzcz0nbGFiZWwnID4kXFxcXGRvdHt2fSQ8L3RleHQ+XG5cdFx0XHQ8L2ZvcmVpZ25PYmplY3Q+XG5cdFx0PC9nPlxuXHRcdDxnIGNsYXNzPSdtYWluJyBjbGlwLXBhdGg9XCJ1cmwoI2Rlc2lnbkIpXCIgc2hpZnRlcj0nW3ZtLm1hci5sZWZ0LCB2bS5tYXIudG9wXSc+XHRcblx0XHRcdDxwYXRoIG5nLWF0dHItZD0ne3t2bS5saW5lRnVuKHZtLnRydWVDYXJ0LnRyYWplY3RvcnkpfX0nIGNsYXNzPSdmdW4gdGFyZ2V0JyAvPlxuXHRcdFx0PGcgbmctY2xhc3M9J3toaWRlOiAhdm0uRGF0YS5zaG93fScgPlxuXHRcdFx0XHQ8bGluZSBjbGFzcz0ndHJpIHYnIGQzLWRlcj0ne3gxOiB2bS5Ib3IoMCksIHgyOiB2bS5Ib3Iodm0uc2VsZWN0ZWQudiksIHkxOiB2bS5WZXIodm0uc2VsZWN0ZWQuZHYpLCB5Mjogdm0uVmVyKHZtLnNlbGVjdGVkLmR2KX0nLz5cblx0XHRcdFx0PGxpbmUgY2xhc3M9J3RyaSBkdicgZDMtZGVyPSd7eDE6IHZtLkhvcih2bS5zZWxlY3RlZC52KSwgeDI6IHZtLkhvcih2bS5zZWxlY3RlZC52KSwgeTE6IHZtLlZlcigwKSwgeTI6IHZtLlZlcih2bS5zZWxlY3RlZC5kdil9Jy8+XG5cdFx0XHRcdDxwYXRoIGQzLWRlcj0ne2Q6dm0ubGluZUZ1bih2bS50cnVlQ2FydC50cmFqZWN0b3J5KX0nIGNsYXNzPSdmdW4gY29ycmVjdCcgbmctY2xhc3M9J3toaWRlOiAhdm0uRGF0YS5jb3JyZWN0fScgLz5cblx0XHRcdDwvZz5cblx0XHRcdDxnIG5nLXJlcGVhdD0nZG90IGluIHZtLmRvdHMgdHJhY2sgYnkgZG90LmlkJyBzaGlmdGVyPSdbdm0uSG9yKGRvdC52KSx2bS5WZXIoZG90LmR2KV0nIGRvdC1iLWRlcj1kb3Q+PC9nPlxuXHRcdFx0PGZvcmVpZ25PYmplY3Qgd2lkdGg9JzcwJyBoZWlnaHQ9JzMwJyB5PScwJyBzaGlmdGVyPSdbdm0uSG9yKC4zKSwgdm0uVmVyKC0uMSldJz5cblx0XHRcdFx0XHQ8dGV4dCBjbGFzcz0ndHJpLWxhYmVsJyA+JHYnPS0uOHYkPC90ZXh0PlxuXHRcdFx0PC9mb3JlaWduT2JqZWN0PlxuXHRcdFx0PHJlY3QgY2xhc3M9J2V4cGVyaW1lbnQnIG5nLWF0dHItaGVpZ2h0PSd7e3ZtLmhlaWdodH19JyBuZy1hdHRyLXdpZHRoPSd7e3ZtLndpZHRofX0nIC8+XG5cdFx0PC9nPlxuXHQ8L3N2Zz5cbicnJ1xuXG5jbGFzcyBDdHJsIGV4dGVuZHMgUGxvdEN0cmxcblx0Y29uc3RydWN0b3I6IChAc2NvcGUsIEBlbCwgQHdpbmRvdywgQGZha2VDYXJ0LCBAdHJ1ZUNhcnQsIEBEYXRhKS0+XG5cdFx0c3VwZXIgQHNjb3BlLCBAZWwsIEB3aW5kb3dcblxuXHRcdEBWZXIuZG9tYWluIFstMS43LCAuMl1cblx0XHRASG9yLmRvbWFpbiBbLS4xLDIuMTVdXG5cblx0XHRAbGluZUZ1blxuXHRcdFx0LnkgKGQpPT4gQFZlciBkLmR2XG5cdFx0XHQueCAoZCk9PiBASG9yIGQudlxuXG5cdEBwcm9wZXJ0eSAnZG90cycsIGdldDotPlxuXHRcdEBmYWtlQ2FydC5kb3RzLmZpbHRlciAoZCktPiAoZC5pZCAhPSdmaXJzdCcpIGFuZCAoZC5pZCAhPSdsYXN0JylcblxuXHRAcHJvcGVydHkgJ3NlbGVjdGVkJywgZ2V0Oi0+IEBmYWtlQ2FydC5zZWxlY3RlZFxuXHRcdFxuXG5kZXIgPSAoKS0+XG5cdGRpcmVjdGl2ZSA9IFxuXHRcdGNvbnRyb2xsZXJBczogJ3ZtJ1xuXHRcdHNjb3BlOiB7fVxuXHRcdHRlbXBsYXRlOiB0ZW1wbGF0ZVxuXHRcdHRlbXBsYXRlTmFtZXNwYWNlOiAnc3ZnJ1xuXHRcdGNvbnRyb2xsZXI6IFsnJHNjb3BlJywnJGVsZW1lbnQnLCAnJHdpbmRvdycsICdmYWtlQ2FydCcsICd0cnVlQ2FydCcsICdkZXNpZ25EYXRhJywgQ3RybF1cblxubW9kdWxlLmV4cG9ydHMgPSBkZXJcbiIsIl8gPSByZXF1aXJlICdsb2Rhc2gnXG5yZXF1aXJlICcuLi8uLi9oZWxwZXJzJ1xuXG50ZW1wbGF0ZSA9ICcnJ1xuXHQ8ZGl2IGNhcnQtZGVyIGRhdGE9XCJ2bS5mYWtlQ2FydFwiIG1heD1cInZtLm1heFwiIHNhbXBsZT0ndm0uc2FtcGxlJz48L2Rpdj5cbicnJ1xuXG5jbGFzcyBDdHJsXG5cdGNvbnN0cnVjdG9yOiAoQHNjb3BlLCBAZmFrZUNhcnQpLT5cblx0XHRAbWF4ID0gNFxuXHRcdEBzYW1wbGUgPSBfLnJhbmdlIDAsIDUgLCAuNVxuXG5cdEBwcm9wZXJ0eSAnbWF4JywgZ2V0Oi0+XG5cdFx0QGZha2VDYXJ0LmxvYyA0LjVcblxuZGVyID0gLT5cblx0ZGlyZWN0aXZlID0gXG5cdFx0c2NvcGU6IHt9XG5cdFx0cmVzdHJpY3Q6ICdBJ1xuXHRcdGJpbmRUb0NvbnRyb2xsZXI6IHRydWVcblx0XHR0ZW1wbGF0ZTogdGVtcGxhdGVcblx0XHRjb250cm9sbGVyOiBbJyRzY29wZScsICdmYWtlQ2FydCcsIEN0cmxdXG5cdFx0Y29udHJvbGxlckFzOiAndm0nXG5cbm1vZHVsZS5leHBvcnRzID0gZGVyXG4iLCJfID0gcmVxdWlyZSAnbG9kYXNoJ1xucmVxdWlyZSAnLi4vLi4vaGVscGVycydcblxudGVtcGxhdGUgPSAnJydcblx0PGRpdiBjYXJ0LWRlciBkYXRhPVwidm0udHJ1ZUNhcnRcIiBtYXg9XCJ2bS5tYXhcIiBzYW1wbGU9J3ZtLnNhbXBsZSc+PC9kaXY+XG4nJydcblxuY2xhc3MgQ3RybFxuXHRjb25zdHJ1Y3RvcjogKEBzY29wZSwgQHRydWVDYXJ0LCBAZmFrZUNhcnQpLT5cblx0XHRAbWF4ID0gNFxuXHRcdEBzYW1wbGUgPSBfLnJhbmdlIDAsIDUgLCAuNVxuXG5cdEBwcm9wZXJ0eSAnbWF4JywgZ2V0Oi0+XG5cdFx0QGZha2VDYXJ0LmxvYyA0LjVcblxuZGVyID0gLT5cblx0ZGlyZWN0aXZlID0gXG5cdFx0c2NvcGU6IHt9XG5cdFx0cmVzdHJpY3Q6ICdBJ1xuXHRcdGJpbmRUb0NvbnRyb2xsZXI6IHRydWVcblx0XHR0ZW1wbGF0ZTogdGVtcGxhdGVcblx0XHRjb250cm9sbGVyOiBbJyRzY29wZScsICd0cnVlQ2FydCcsICdmYWtlQ2FydCcsIEN0cmxdXG5cdFx0Y29udHJvbGxlckFzOiAndm0nXG5cbm1vZHVsZS5leHBvcnRzID0gZGVyXG4iLCJhbmd1bGFyID0gcmVxdWlyZSAnYW5ndWxhcidcbmQzID0gcmVxdWlyZSAnZDMnXG5yZXF1aXJlICcuLi8uLi9oZWxwZXJzJ1xuXG5jbGFzcyBTZXJ2aWNlXG5cdGNvbnN0cnVjdG9yOiAoQHJvb3RTY29wZSktPlxuXHRcdEB0ID0gMFxuXHRcdEBzaG93ID0gQHBhdXNlZCA9IGZhbHNlXG5cblx0Y2xpY2s6IC0+XG5cdFx0aWYgQHBhdXNlZCB0aGVuIEBwbGF5KCkgZWxzZSBAcGF1c2UoKVxuXG5cdGluY3JlbWVudDogKGR0KS0+XG5cdFx0QHQrPWR0XG5cblx0c2V0VDogKHQpLT5cblx0XHRAdCA9IHRcblxuXHRzZXRfc2hvdzogKHYpLT5cblx0XHRAc2hvdyA9IHZcblxuXHRwbGF5OiAtPlxuXHRcdEBwYXVzZWQgPSB0cnVlXG5cdFx0ZDMudGltZXIuZmx1c2goKVxuXHRcdEBwYXVzZWQgPSBmYWxzZVxuXHRcdGxhc3QgPSAwXG5cdFx0Y29uc29sZS5sb2cgJ2FzZGYnXG5cdFx0ZDMudGltZXIgKGVsYXBzZWQpPT5cblx0XHRcdFx0ZHQgPSBlbGFwc2VkIC0gbGFzdFxuXHRcdFx0XHRAaW5jcmVtZW50IGR0LzEwMDBcblx0XHRcdFx0bGFzdCA9IGVsYXBzZWRcblx0XHRcdFx0aWYgQHQgPiA0LjUgdGhlbiBAc2V0VCAwXG5cdFx0XHRcdEByb290U2NvcGUuJGV2YWxBc3luYygpXG5cdFx0XHRcdEBwYXVzZWRcblx0XHRcdCwgMVxuXG5cdHBhdXNlOiAtPiBAcGF1c2VkID0gdHJ1ZVxuXG5tb2R1bGUuZXhwb3J0cyA9IFsnJHJvb3RTY29wZScsIFNlcnZpY2VdIiwidGVtcGxhdGUgPSAnJydcblx0PGNpcmNsZSBjbGFzcz0nZG90IGxhcmdlJz48L2NpcmNsZT5cblx0PGNpcmNsZSBjbGFzcz0nZG90IHNtYWxsJyByPSc0Jz48L2NpcmNsZT5cbicnJ1xuXG5jbGFzcyBDdHJsXG5cdGNvbnN0cnVjdG9yOiAoQHNjb3BlLCBAZWwsIEBmYWtlQ2FydCwgQERhdGEpLT5cblx0XHRyYWQgPSA3ICN0aGUgcmFkaXVzIG9mIHRoZSBsYXJnZSBjaXJjbGUgbmF0dXJhbGx5XG5cdFx0c2VsID0gZDMuc2VsZWN0IEBlbFswXVxuXHRcdGJpZyA9IHNlbC5zZWxlY3QgJ2NpcmNsZS5kb3QubGFyZ2UnXG5cdFx0XHQuYXR0ciAncicsIHJhZFxuXHRcdGNpcmMgPSBzZWwuc2VsZWN0ICdjaXJjbGUuZG90LnNtYWxsJ1xuXG5cdFx0YmlnLm9uICdtb3VzZW92ZXInLCBAbW91c2VvdmVyXG5cdFx0XHQub24gJ2NvbnRleHRtZW51JywgLT4gXG5cdFx0XHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KClcblx0XHRcdFx0ZXZlbnQuc3RvcFByb3BhZ2F0aW9uKClcblx0XHRcdC5vbiAnbW91c2Vkb3duJywgLT5cblx0XHRcdFx0YmlnLnRyYW5zaXRpb24gJ2dyb3cnXG5cdFx0XHRcdFx0LmR1cmF0aW9uIDE1MFxuXHRcdFx0XHRcdC5lYXNlICdjdWJpYydcblx0XHRcdFx0XHQuYXR0ciAncicsIHJhZCoxLjdcblx0XHRcdC5vbiAnbW91c2V1cCcsIC0+XG5cdFx0XHRcdGJpZy50cmFuc2l0aW9uICdncm93J1xuXHRcdFx0XHRcdC5kdXJhdGlvbiAxNTBcblx0XHRcdFx0XHQuZWFzZSAnY3ViaWMtaW4nXG5cdFx0XHRcdFx0LmF0dHIgJ3InLCByYWQqMS4zXG5cdFx0XHQub24gJ21vdXNlb3V0JyAsIEBtb3VzZW91dFxuXG5cdFx0QHNjb3BlLiR3YXRjaCA9PlxuXHRcdFx0XHQoQGZha2VDYXJ0LnNlbGVjdGVkID09IEBkb3QpIGFuZCAoQERhdGEuc2hvdylcblx0XHRcdCwgKHYsIG9sZCktPlxuXHRcdFx0XHRpZiB2XG5cdFx0XHRcdFx0YmlnLnRyYW5zaXRpb24gJ2dyb3cnXG5cdFx0XHRcdFx0XHQuZHVyYXRpb24gMTUwXG5cdFx0XHRcdFx0XHQuZWFzZSAnY3ViaWMtb3V0J1xuXHRcdFx0XHRcdFx0LmF0dHIgJ3InICwgcmFkICogMS41XG5cdFx0XHRcdFx0XHQudHJhbnNpdGlvbigpXG5cdFx0XHRcdFx0XHQuZHVyYXRpb24gMTUwXG5cdFx0XHRcdFx0XHQuZWFzZSAnY3ViaWMtaW4nXG5cdFx0XHRcdFx0XHQuYXR0ciAncicgLCByYWQgKiAxLjNcblxuXHRcdFx0XHRcdGNpcmMudHJhbnNpdGlvbigpXG5cdFx0XHRcdFx0XHQuZHVyYXRpb24gMTUwXG5cdFx0XHRcdFx0XHQuZWFzZSAnY3ViaWMtb3V0J1xuXHRcdFx0XHRcdFx0LnN0eWxlXG5cdFx0XHRcdFx0XHRcdCdzdHJva2Utd2lkdGgnOiAyLjVcblx0XHRcdFx0ZWxzZSBcblx0XHRcdFx0XHRiaWcudHJhbnNpdGlvbiAnc2hyaW5rJ1xuXHRcdFx0XHRcdFx0LmR1cmF0aW9uIDM1MFxuXHRcdFx0XHRcdFx0LmVhc2UgJ2JvdW5jZS1vdXQnXG5cdFx0XHRcdFx0XHQuYXR0ciAncicgLCByYWRcblxuXHRcdFx0XHRcdGNpcmMudHJhbnNpdGlvbigpXG5cdFx0XHRcdFx0XHQuZHVyYXRpb24gMTAwXG5cdFx0XHRcdFx0XHQuZWFzZSAnY3ViaWMnXG5cdFx0XHRcdFx0XHQuc3R5bGVcblx0XHRcdFx0XHRcdFx0J3N0cm9rZS13aWR0aCc6IDEuNlxuXHRcdFx0XHRcdFx0XHRzdHJva2U6ICd3aGl0ZSdcblx0XHRcdCBcblx0bW91c2VvdXQ6ID0+XG5cdFx0QERhdGEuc2V0X3Nob3cgZmFsc2Vcblx0XHRAc2NvcGUuJGV2YWxBc3luYygpXG5cblx0bW91c2VvdmVyOiA9PlxuXHRcdEBmYWtlQ2FydC5zZWxlY3RfZG90IEBkb3Rcblx0XHRARGF0YS5zZXRfc2hvdyB0cnVlXG5cdFx0QHNjb3BlLiRldmFsQXN5bmMoKVxuXG5kZXIgPSAoKS0+XG5cdGRpcmVjdGl2ZSA9IFxuXHRcdHRlbXBsYXRlOiB0ZW1wbGF0ZVxuXHRcdGNvbnRyb2xsZXJBczogJ3ZtJ1xuXHRcdHNjb3BlOiBcblx0XHRcdGRvdDogJz1kb3RBRGVyJ1xuXHRcdGJpbmRUb0NvbnRyb2xsZXI6IHRydWVcblx0XHRjb250cm9sbGVyOiBbJyRzY29wZScsJyRlbGVtZW50JywgJ2Zha2VDYXJ0JywgJ2Rlc2lnbkRhdGEnLCBDdHJsXVxuXHRcdHJlc3RyaWN0OiAnQSdcblxuXG5tb2R1bGUuZXhwb3J0cyA9IGRlclxuIiwiRGF0YSA9IHJlcXVpcmUgJy4vZGVzaWduRGF0YSdcblxudGVtcGxhdGUgPSAnJydcblx0PGNpcmNsZSBjbGFzcz0nZG90IHNtYWxsJyByPSc0Jz48L2NpcmNsZT5cbicnJ1xuXG5jbGFzcyBDdHJsXG5cdGNvbnN0cnVjdG9yOiAoQHNjb3BlLCBAZWwsIEBmYWtlQ2FydCwgQERhdGEpLT5cblx0XHRjaXJjID0gZDMuc2VsZWN0IEBlbFswXVxuXG5cdFx0Y2lyYy5vbiAnbW91c2VvdmVyJyxAbW91c2VvdmVyXG5cdFx0XHQub24gJ21vdXNlb3V0JyAsIEBtb3VzZW91dFxuXHRcdFx0IyAub24gJ2NvbnRleHRtZW51JywgLT4gXG5cdFx0XHQjIFx0ZXZlbnQucHJldmVudERlZmF1bHQoKVxuXHRcdFx0IyBcdGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpXG5cblx0XHRAc2NvcGUuJHdhdGNoID0+XG5cdFx0XHRcdChEYXRhLnNlbGVjdGVkID09IEBkb3QpIGFuZCAoRGF0YS5zaG93KVxuXHRcdFx0LCAodiwgb2xkKS0+XG5cdFx0XHRcdGlmIHYgPT0gb2xkIHRoZW4gcmV0dXJuXG5cdFx0XHRcdGlmIHZcblx0XHRcdFx0XHRjaXJjLnRyYW5zaXRpb24oKVxuXHRcdFx0XHRcdFx0LmR1cmF0aW9uIDE1MFxuXHRcdFx0XHRcdFx0LmVhc2UgJ2N1YmljLW91dCdcblx0XHRcdFx0XHRcdC5zdHlsZVxuXHRcdFx0XHRcdFx0XHQnc3Ryb2tlLXdpZHRoJzogMi41XG5cdFx0XHRcdGVsc2UgXG5cdFx0XHRcdFx0Y2lyYy50cmFuc2l0aW9uKClcblx0XHRcdFx0XHRcdC5kdXJhdGlvbiAxMDBcblx0XHRcdFx0XHRcdC5lYXNlICdjdWJpYydcblx0XHRcdFx0XHRcdC5zdHlsZVxuXHRcdFx0XHRcdFx0XHQnc3Ryb2tlLXdpZHRoJzogMS42XG5cdFx0XHRcdFx0XHRcdHN0cm9rZTogJ3doaXRlJ1xuXHRcdFx0IFxuXHRtb3VzZW91dDogPT5cblx0XHRARGF0YS5zZXRfc2hvdyBmYWxzZVxuXHRcdEBzY29wZS4kZXZhbEFzeW5jKClcblxuXHRtb3VzZW92ZXI6ID0+XG5cdFx0QGZha2VDYXJ0LnNlbGVjdF9kb3QgQGRvdFxuXHRcdEBEYXRhLnNldF9zaG93IHRydWVcblx0XHRAc2NvcGUuJGV2YWxBc3luYygpXG5cbmRlciA9ICgpLT5cblx0ZGlyZWN0aXZlID0gXG5cdFx0dGVtcGxhdGU6IHRlbXBsYXRlXG5cdFx0Y29udHJvbGxlckFzOiAndm0nXG5cdFx0c2NvcGU6IFxuXHRcdFx0ZG90OiAnPWRvdEJEZXInXG5cdFx0YmluZFRvQ29udHJvbGxlcjogdHJ1ZVxuXHRcdGNvbnRyb2xsZXI6IFsnJHNjb3BlJywnJGVsZW1lbnQnLCAnZmFrZUNhcnQnLCAnZGVzaWduRGF0YScsIEN0cmxdXG5cdFx0cmVzdHJpY3Q6ICdBJ1xuXG5cbm1vZHVsZS5leHBvcnRzID0gZGVyXG4iLCJyZXF1aXJlICcuLi8uLi9oZWxwZXJzJ1xuXyA9IHJlcXVpcmUgJ2xvZGFzaCdcbmQzID0gcmVxdWlyZSAnZDMnXG5kZWxUID0gLjFcblxuY2xhc3MgRG90XG5cdGNvbnN0cnVjdG9yOiAoQHQsIEB2KS0+XG5cdFx0QGlkID0gXy51bmlxdWVJZCAnZG90J1xuXHRcdEBkdiA9IDBcblxuXHR1cGRhdGU6ICh0LHYpLT5cblx0XHRAdCA9IHRcblx0XHRAdiA9IHZcblxuY2xhc3MgU2VydmljZVxuXHRjb25zdHJ1Y3RvcjooQERhdGEpIC0+XG5cdFx0QGNvcnJlY3QgPSBmYWxzZVxuXHRcdGZpcnN0RG90ID0gbmV3IERvdCAwICwgMlxuXHRcdGZpcnN0RG90LmlkID0gJ2ZpcnN0J1xuXHRcdEBkb3RzID0gW2ZpcnN0RG90XVxuXHRcdEB0cmFqZWN0b3J5ID0gXy5yYW5nZSAwLCA1ICwgZGVsVFxuXHRcdFx0Lm1hcCAodCktPlxuXHRcdFx0XHRyZXMgPSBcblx0XHRcdFx0XHR0OiB0XG5cdFx0XHRcdFx0djogMFxuXHRcdFx0XHRcdHg6IDBcblx0XHRfLnJhbmdlIC41LCAyLjUsIC41XG5cdFx0XHQuZm9yRWFjaCAodCk9PlxuXHRcdFx0XHRAZG90cy5wdXNoIG5ldyBEb3QgdCwgMipNYXRoLmV4cCgtLjgqdClcblxuXHRcdGxhc3REb3QgPSBuZXcgRG90IDYgLCBAZG90c1tAZG90cy5sZW5ndGggLSAxXS52XG5cdFx0bGFzdERvdC5pZCA9ICdsYXN0J1xuXHRcdEBkb3RzLnB1c2ggbGFzdERvdFxuXHRcdEBzZWxlY3RfZG90IEBkb3RzWzFdXG5cdFx0QHVwZGF0ZSgpXG5cblx0c2VsZWN0X2RvdDogKGRvdCktPlxuXHRcdEBzZWxlY3RlZCA9IGRvdFxuXG5cdGFkZF9kb3Q6ICh0LCB2KS0+XG5cdFx0bmV3RG90ID0gbmV3IERvdCB0LHZcblx0XHRAZG90cy5wdXNoIG5ld0RvdFxuXHRcdEB1cGRhdGVfZG90IG5ld0RvdCwgdCwgdlxuXG5cdHJlbW92ZV9kb3Q6IChkb3QpLT5cblx0XHRAZG90cy5zcGxpY2UgQGRvdHMuaW5kZXhPZihkb3QpLCAxXG5cdFx0QHVwZGF0ZSgpXG5cblx0bG9jOiAodCktPiBcblx0XHRhID0gTWF0aC5mbG9vciB0L2RlbFRcblx0XHRoID0gKHQgLSBAdHJhamVjdG9yeVthXS50KS9kZWxUXG5cdFx0QHRyYWplY3RvcnlbYV0ueCogKDEtaCkgKyBoKiBAdHJhamVjdG9yeVthKzFdPy54XG5cblx0QHByb3BlcnR5ICd4JywgZ2V0OiAtPiBAbG9jIEBEYXRhLnRcblxuXHRAcHJvcGVydHkgJ3YnLCBnZXQ6IC0+IFxuXHRcdHQgPSBARGF0YS50XG5cdFx0YSA9IE1hdGguZmxvb3IgdC9kZWxUXG5cdFx0aCA9ICh0IC0gQHRyYWplY3RvcnlbYV0udCkvZGVsVFxuXHRcdEB0cmFqZWN0b3J5W2FdLnYqICgxLWgpICsgaCogQHRyYWplY3RvcnlbYSsxXT8udlxuXG5cdEBwcm9wZXJ0eSAnZHYnLCBnZXQ6IC0+IEB0cmFqZWN0b3J5W01hdGguZmxvb3IoQERhdGEudC9kZWxUKV0uZHZcblxuXHR1cGRhdGU6IC0+IFxuXHRcdEBkb3RzLnNvcnQgKGEsYiktPiBhLnQgLSBiLnRcblx0XHRkb21haW4gPSBbXVxuXHRcdHJhbmdlID0gW11cblx0XHRAZG90cy5mb3JFYWNoIChkb3QsIGksIGspLT5cblx0XHRcdHByZXYgPSBrW2ktMV1cblx0XHRcdGlmIGRvdC5pZCA9PSAnbGFzdCdcblx0XHRcdFx0ZG90LnYgPSBwcmV2LnZcblx0XHRcdFx0ZG9tYWluLnB1c2ggZG90LnZcblx0XHRcdFx0cmFuZ2UucHVzaCBkb3QudlxuXHRcdFx0XHRyZXR1cm5cblx0XHRcdGlmIHByZXZcblx0XHRcdFx0ZHQgPSBkb3QudCAtIHByZXYudFxuXHRcdFx0XHRkb3QueCA9IHByZXYueCArIGR0ICogKGRvdC52ICsgcHJldi52KS8yXG5cdFx0XHRcdGRvdC5kdiA9IChkb3QudiAtIHByZXYudikvTWF0aC5tYXgoZHQsIC4wMDEpXG5cdFx0XHRlbHNlXG5cdFx0XHRcdGRvdC54ID0gMFxuXHRcdFx0XHRkb3QuZHYgPSAwXG5cblx0XHRAZG90cy5mb3JFYWNoIChkb3QsaSxrKT0+XG5cdFx0XHRcdGEgPSBAZG90c1tpLTFdXG5cdFx0XHRcdGlmICFhIHRoZW4gcmV0dXJuXG5cdFx0XHRcdGR2ID0gZG90LmR2XG5cdFx0XHRcdEB0cmFqZWN0b3J5XG5cdFx0XHRcdFx0LnNsaWNlKE1hdGguZmxvb3IoYS50L2RlbFQpLCBNYXRoLmZsb29yKGRvdC50L2RlbFQpKVxuXHRcdFx0XHRcdC5mb3JFYWNoIChkKS0+XG5cdFx0XHRcdFx0XHRkdCA9IGQudCAtIGEudFxuXHRcdFx0XHRcdFx0ZC54ID0gYS54ICsgYS52ICogZHQgKyAwLjUqZHYgKiBkdCoqMlxuXHRcdFx0XHRcdFx0ZC52ID0gYS52ICsgZHYgKiBkdFxuXG5cdHVwZGF0ZV9kb3Q6IChkb3QsIHQsIHYpLT5cblx0XHRpZiBkb3QuaWQgPT0gJ2ZpcnN0JyB0aGVuIHJldHVyblxuXHRcdEBzZWxlY3RfZG90IGRvdFxuXHRcdGRvdC51cGRhdGUgdCx2XG5cdFx0QHVwZGF0ZSgpXG5cdFx0QGNvcnJlY3QgPSBNYXRoLmFicyggLS44ICogZG90LnYgKyBkb3QuZHYpIDwgMC4wNVxuXG5cbm1vZHVsZS5leHBvcnRzID0gWydkZXNpZ25EYXRhJyAsIFNlcnZpY2VdIiwiRGF0YSA9IHJlcXVpcmUgJy4vZGVzaWduRGF0YSdcbl8gPSByZXF1aXJlICdsb2Rhc2gnXG5yZXF1aXJlICcuLi8uLi9oZWxwZXJzJ1xuZGVsVCA9IC4xXG5cbmNsYXNzIFNlcnZpY2Vcblx0Y29uc3RydWN0b3I6IChARGF0YSktPlxuXHRcdEB0cmFqZWN0b3J5ID0gXy5yYW5nZSAwLCA0LjcgLCBkZWxUXG5cdFx0XHQubWFwICh0KS0+XG5cdFx0XHRcdHQ6IHRcblx0XHRcdFx0eDogMi8uOCAqICgxLU1hdGguZXhwKC0uOCp0KSlcblx0XHRcdFx0djogMipNYXRoLmV4cCAtLjgqdFxuXHRcdFx0XHRkdjogLS44KjIqTWF0aC5leHAgLS44KnRcblxuXHRsb2M6ICh0KS0+XHQyLy44ICogKDEtTWF0aC5leHAoLS44KnQpKVxuXG5cdEBwcm9wZXJ0eSAneCcsIGdldDotPiBAbG9jIEBEYXRhLnRcblxuXHRAcHJvcGVydHkgJ3YnLCBnZXQ6LT4gMiogTWF0aC5leHAoLS44KkBEYXRhLnQpXG5cblx0QHByb3BlcnR5ICdkdicsIGdldDotPiAtLjgqMiogTWF0aC5leHAoLS44KkBEYXRhLnQpXG5cbm1vZHVsZS5leHBvcnRzID0gWydkZXNpZ25EYXRhJywgU2VydmljZV0iLCJkcmFnID0gKCRwYXJzZSktPlxuXHRkaXJlY3RpdmUgPSBcblx0XHRsaW5rOiAoc2NvcGUsZWwsYXR0ciktPlxuXHRcdFx0c2VsID0gZDMuc2VsZWN0KGVsWzBdKVxuXHRcdFx0c2VsLmNhbGwoJHBhcnNlKGF0dHIuYmVoYXZpb3IpKHNjb3BlKSlcblxubW9kdWxlLmV4cG9ydHMgPSBkcmFnIiwidGVtcGxhdGUgPSAnJydcblx0PGRlZnM+XG5cdFx0PGNsaXBwYXRoIG5nLWF0dHItaWQ9J3t7Ojp2bS5uYW1lfX0nPlxuXHRcdFx0PHJlY3QgbmctYXR0ci13aWR0aD0ne3t2bS53aWR0aH19JyBuZy1hdHRyLWhlaWdodD0ne3t2bS5oZWlnaHR9fScgLz5cblx0XHQ8L2NsaXBwYXRoPlxuXHQ8L2RlZnM+XG5cdDxnIGNsYXNzPSdib2lsZXJwbGF0ZScgc2hpZnRlcj0ne3s6Olt2bS5tYXIubGVmdCwgdm0ubWFyLnRvcF19fSc+XG5cdFx0PHJlY3QgY2xhc3M9J2JhY2tncm91bmQnIG5nLWF0dHItd2lkdGg9J3t7dm0ud2lkdGh9fScgbmctYXR0ci1oZWlnaHQ9J3t7dm0uaGVpZ2h0fX0nIC8+XG5cdFx0PGcgdmVyLWF4aXMtZGVyIHdpZHRoPSd2bS53aWR0aCcgc2NhbGU9J3ZtLnZlcicgZnVuPSd2bS52ZXJBeEZ1bic+PC9nPlxuXHRcdDxnIGhvci1heGlzLWRlciBoZWlnaHQ9J3ZtLmhlaWdodCcgc2NhbGU9J3ZtLmhvcicgZnVuPSd2bS5ob3JBeEZ1bicgc2hpZnRlcj0nWzAsdm0uaGVpZ2h0XSc+PC9nPlxuXHRcdDxsaW5lIGNsYXNzPSd6ZXJvLWxpbmUgaG9yJyBkMy1kZXI9J3t4MTogMCwgeDI6IHZtLndpZHRoLCB5MTogdm0udmVyKDApLCB5Mjogdm0udmVyKDApfScvPlxuXHRcdDxsaW5lIGNsYXNzPSd6ZXJvLWxpbmUgaG9yJyBkMy1kZXI9J3t4MTogdm0uaG9yKDApLCB4Mjogdm0uaG9yKDApLCB5MTowLCB5Mjogdm0uaGVpZ2h0fScvPlxuXHRcdDxnIG5nLXRyYW5zY2x1ZGU+XG5cdFx0PC9nPlxuXHQ8L2c+XG4nJydcblxuZGVyID0gLT5cblx0ZGlyZWN0aXZlID0gXG5cdFx0Y29udHJvbGxlcjogWyckc2NvcGUnLCAoQHNjb3BlKSAtPl1cblx0XHRjb250cm9sbGVyQXM6ICd2bSdcblx0XHRiaW5kVG9Db250cm9sbGVyOiB0cnVlXG5cdFx0c2NvcGU6IFxuXHRcdFx0d2lkdGg6ICc9J1xuXHRcdFx0aGVpZ2h0OiAnPSdcblx0XHRcdHZlckF4RnVuOiAnPSdcblx0XHRcdGhvckF4RnVuOiAnPSdcblx0XHRcdG1hcjogJz0nXG5cdFx0XHR2ZXI6ICc9J1xuXHRcdFx0aG9yOiAnPSdcblx0XHRcdG5hbWU6ICc9J1xuXHRcdHRlbXBsYXRlOiB0ZW1wbGF0ZVxuXHRcdHRyYW5zY2x1ZGU6IHRydWVcblx0XHR0ZW1wbGF0ZU5hbWVzcGFjZTogJ3N2ZydcblxubW9kdWxlLmV4cG9ydHMgPSBkZXIiLCJfID0gcmVxdWlyZSAnbG9kYXNoJ1xuZDM9IHJlcXVpcmUgJ2QzJ1xucmVxdWlyZSAnLi4vaGVscGVycydcblBsb3RDdHJsID0gcmVxdWlyZSAnLi9wbG90Q3RybCdcblxudGVtcGxhdGUgPSAnJydcblx0PHN2ZyBuZy1pbml0PSd2bS5yZXNpemUoKScgbmctYXR0ci1oZWlnaHQ9XCJ7e3ZtLnN2Z0hlaWdodH19XCI+XG5cdFx0PGRlZnM+XG5cdFx0XHQ8Y2xpcHBhdGggaWQ9J2NhcnRTaW0nPlxuXHRcdFx0XHQ8cmVjdCBkMy1kZXI9J3t3aWR0aDogdm0ud2lkdGgsIGhlaWdodDogdm0uaGVpZ2h0fScgLz5cblx0XHRcdDwvY2xpcHBhdGg+XG5cdFx0PC9kZWZzPlxuXHRcdDxnIGNsYXNzPSdib2lsZXJwbGF0ZScgc2hpZnRlcj0ne3s6Olt2bS5tYXIubGVmdCwgdm0ubWFyLnRvcF19fScgPlxuXHRcdFx0PHJlY3QgZDMtZGVyPSd7d2lkdGg6IHZtLndpZHRoLCBoZWlnaHQ6IHZtLmhlaWdodH0nIGNsYXNzPSdiYWNrZ3JvdW5kJy8+XG5cdFx0XHQ8ZyBob3ItYXhpcy1kZXIgaGVpZ2h0PSd2bS5oZWlnaHQnIGZ1bj0ndm0uaG9yQXhGdW4nIHNoaWZ0ZXI9J1swLHZtLmhlaWdodF0nPjwvZz5cblx0XHRcdDxmb3JlaWduT2JqZWN0IHdpZHRoPSczMCcgaGVpZ2h0PSczMCcgeT0nMjAnIHNoaWZ0ZXI9J1t2bS53aWR0aC8yLCB2bS5oZWlnaHRdJz5cblx0XHRcdFx0XHQ8dGV4dCBjbGFzcz0nbGFiZWwnID4keCQ8L3RleHQ+XG5cdFx0XHQ8L2ZvcmVpZ25PYmplY3Q+XG5cdFx0PC9nPlxuXHRcdDxnIHNoaWZ0ZXI9J3t7Ojpbdm0ubWFyLmxlZnQsIHZtLm1hci50b3BdfX0nIGNsaXAtcGF0aD1cInVybCgjY2FydFNpbSlcIiA+XG5cdFx0XHQ8Zm9yZWlnbk9iamVjdCB3aWR0aD0nMzAnIGhlaWdodD0nMzAnIHk9JzIwJyBzaGlmdGVyPSdbdm0ud2lkdGgvMiwgdm0uaGVpZ2h0XSc+XG5cdFx0XHRcdFx0PHRleHQgY2xhc3M9J2xhYmVsJyA+JHQkPC90ZXh0PlxuXHRcdFx0PC9mb3JlaWduT2JqZWN0PlxuXHRcdFx0PGcgbmctcmVwZWF0PSd0IGluIHZtLnNhbXBsZScgZDMtZGVyPSd7dHJhbnNmb3JtOiBcInRyYW5zbGF0ZShcIiArIHZtLkhvcih2bS5kYXRhLmxvYyh0KSkgKyBcIiwwKVwifSc+XG5cdFx0XHRcdDxsaW5lIGNsYXNzPSd0aW1lLWxpbmUnIGQzLWRlcj0ne3gxOiAwLCB4MjogMCwgeTE6IDAsIHkyOiB2bS5oZWlnaHR9JyAvPlxuXHRcdFx0PC9nPlxuXHRcdFx0PGcgY2xhc3M9J2ctY2FydCcgY2FydC1vYmplY3QtZGVyIGxlZnQ9J3ZtLkhvcih2bS5kYXRhLngpJyB0b3A9J3ZtLmhlaWdodCcgc2l6ZT0ndm0uc2l6ZSc+PC9nPlxuXHRcdDwvZz5cblx0PC9zdmc+XG4nJydcblx0XHRcdCMgPHJlY3QgY2xhc3M9J2V4cGVyaW1lbnQnIG5nLWF0dHItaGVpZ2h0PSd7e3ZtLmhlaWdodH19JyBuZy1hdHRyLXdpZHRoPSd7e3ZtLndpZHRofX0nIC8+XG5cbmNsYXNzIEN0cmwgZXh0ZW5kcyBQbG90Q3RybFxuXHRjb25zdHJ1Y3RvcjogKEBzY29wZSwgQGVsLCBAd2luZG93KS0+XG5cdFx0c3VwZXIgQHNjb3BlLCBAZWwsIEB3aW5kb3dcblx0XHQjIEBtYXIubGVmdCA9IEBtYXIucmlnaHQgPSAxMFxuXHRcdEBtYXIudG9wID0gNVxuXHRcdEBtYXIuYm90dG9tID0gMjVcblxuXHRcdEBzY29wZS4kd2F0Y2ggJ3ZtLm1heCcsID0+XG5cdFx0XHRASG9yLmRvbWFpbiBbLS4xLCBAbWF4XVxuXG5cblx0QHByb3BlcnR5ICdzaXplJywgZ2V0OiAtPiAoQEhvcigwLjQpIC0gQEhvcigwKSkvODBcblxuZGVyID0gLT5cblx0ZGlyZWN0aXZlID0gXG5cdFx0dGVtcGxhdGU6IHRlbXBsYXRlXG5cdFx0c2NvcGU6IFxuXHRcdFx0ZGF0YTogJz0nXG5cdFx0XHRtYXg6ICc9J1xuXHRcdFx0c2FtcGxlOiAnPSdcblx0XHRyZXN0cmljdDogJ0EnXG5cdFx0YmluZFRvQ29udHJvbGxlcjogdHJ1ZVxuXHRcdCMgdHJhbnNjbHVkZTogdHJ1ZVxuXHRcdHRlbXBsYXRlTmFtZXNwYWNlOiAnc3ZnJ1xuXHRcdGNvbnRyb2xsZXI6IFsnJHNjb3BlJywgJyRlbGVtZW50JywgJyR3aW5kb3cnLCBDdHJsXVxuXHRcdGNvbnRyb2xsZXJBczogJ3ZtJ1xuXG5tb2R1bGUuZXhwb3J0cyA9IGRlclxuIiwiZDMgPSByZXF1aXJlICdkMydcbmFuZ3VsYXIgPSByZXF1aXJlICdhbmd1bGFyJ1xuXG5kZXIgPSAoJHBhcnNlKS0+ICNnb2VzIG9uIGEgc3ZnIGVsZW1lbnRcblx0ZGlyZWN0aXZlID0gXG5cdFx0cmVzdHJpY3Q6ICdBJ1xuXHRcdHNjb3BlOiBcblx0XHRcdGQzRGVyOiAnPSdcblx0XHRcdHRyYW46ICc9J1xuXHRcdGxpbms6IChzY29wZSwgZWwsIGF0dHIpLT5cblx0XHRcdHNlbCA9IGQzLnNlbGVjdCBlbFswXVxuXHRcdFx0dSA9ICd0LScgKyBNYXRoLnJhbmRvbSgpXG5cdFx0XHRzY29wZS4kd2F0Y2ggJ2QzRGVyJ1xuXHRcdFx0XHQsICh2KS0+XG5cdFx0XHRcdFx0aWYgc2NvcGUudHJhblxuXHRcdFx0XHRcdFx0c2VsLnRyYW5zaXRpb24gdVxuXHRcdFx0XHRcdFx0XHQuYXR0ciB2XG5cdFx0XHRcdFx0XHRcdC5jYWxsIHNjb3BlLnRyYW5cblx0XHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0XHRzZWwuYXR0ciB2XG5cblx0XHRcdFx0LCB0cnVlXG5tb2R1bGUuZXhwb3J0cyA9IGRlciIsIm1vZHVsZS5leHBvcnRzID0gKCRwYXJzZSktPlxuXHQoc2NvcGUsIGVsLCBhdHRyKS0+XG5cdFx0ZDMuc2VsZWN0KGVsWzBdKS5kYXR1bSAkcGFyc2UoYXR0ci5kYXR1bSkoc2NvcGUpIiwiZDMgPSByZXF1aXJlICdkMydcblxuY2xhc3MgQ3RybFxuXHRjb25zdHJ1Y3RvcjogKEBzY29wZSwgQGVsLCBAd2luZG93KS0+XG5cdFx0QG1hciA9IFxuXHRcdFx0bGVmdDogMjBcblx0XHRcdHRvcDogMTBcblx0XHRcdHJpZ2h0OiAxNVxuXHRcdFx0Ym90dG9tOiAzMFxuXG5cdFx0QFZlciA9ZDMuc2NhbGUubGluZWFyKClcblx0XHRcblx0XHRASG9yID0gZDMuc2NhbGUubGluZWFyKClcblxuXHRcdEBob3JBeEZ1biA9IGQzLnN2Zy5heGlzKClcblx0XHRcdC5zY2FsZSBASG9yXG5cdFx0XHQudGlja3MgNVxuXHRcdFx0Lm9yaWVudCAnYm90dG9tJ1xuXG5cdFx0QHZlckF4RnVuID0gZDMuc3ZnLmF4aXMoKVxuXHRcdFx0LnNjYWxlIEBWZXJcblx0XHRcdC50aWNrRm9ybWF0IChkKS0+XG5cdFx0XHRcdGlmIE1hdGguZmxvb3IoIGQgKSAhPSBkIHRoZW4gcmV0dXJuXG5cdFx0XHRcdGRcblx0XHRcdC50aWNrcyA1XG5cdFx0XHQub3JpZW50ICdsZWZ0J1xuXG5cdFx0QGxpbmVGdW4gPSBkMy5zdmcubGluZSgpXG5cblx0XHRhbmd1bGFyLmVsZW1lbnQgQHdpbmRvd1xuXHRcdFx0Lm9uICdyZXNpemUnLCBAcmVzaXplXG5cblx0QHByb3BlcnR5ICdzdmdfaGVpZ2h0JywgZ2V0OiAtPiBAaGVpZ2h0ICsgQG1hci50b3AgKyBAbWFyLmJvdHRvbVxuXG5cdHJlc2l6ZTogPT5cblx0XHRAd2lkdGggPSBAZWxbMF0uY2xpZW50V2lkdGggLSBAbWFyLmxlZnQgLSBAbWFyLnJpZ2h0XG5cdFx0QGhlaWdodCA9IEBlbFswXS5jbGllbnRIZWlnaHQgLSBAbWFyLnRvcCAtIEBtYXIuYm90dG9tXG5cdFx0QFZlci5yYW5nZSBbQGhlaWdodCwgMF1cblx0XHRASG9yLnJhbmdlIFswLCBAd2lkdGhdXG5cdFx0QHNjb3BlLiRldmFsQXN5bmMoKVxuXG5cbm1vZHVsZS5leHBvcnRzID0gQ3RybCIsImQzID0gcmVxdWlyZSAnZDMnXG5cbmRlciA9ICgkcGFyc2UpLT5cblx0ZGlyZWN0aXZlID1cblx0XHRyZXN0cmljdDogJ0EnXG5cdFx0bGluazogKHNjb3BlLCBlbCwgYXR0ciktPlxuXHRcdFx0c2VsID0gZDMuc2VsZWN0IGVsWzBdXG5cdFx0XHR1ID0gJ3QtJyArIE1hdGgucmFuZG9tKClcblx0XHRcdHRyYW4gPSAkcGFyc2UoYXR0ci50cmFuKShzY29wZSlcblx0XHRcdHJlc2hpZnQgPSAodiktPiBcblx0XHRcdFx0aWYgdHJhblxuXHRcdFx0XHRcdHNlbC50cmFuc2l0aW9uIHVcblx0XHRcdFx0XHRcdC5hdHRyICd0cmFuc2Zvcm0nICwgXCJ0cmFuc2xhdGUoI3t2WzBdfSwje3ZbMV19KVwiXG5cdFx0XHRcdFx0XHQuY2FsbCB0cmFuXG5cdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRzZWwuYXR0ciAndHJhbnNmb3JtJyAsIFwidHJhbnNsYXRlKCN7dlswXX0sI3t2WzFdfSlcIlxuXG5cdFx0XHRcdGQzLnNlbGVjdCBlbFswXVxuXHRcdFx0XHRcdFxuXG5cdFx0XHRzY29wZS4kd2F0Y2ggLT5cblx0XHRcdFx0XHQkcGFyc2UoYXR0ci5zaGlmdGVyKShzY29wZSlcblx0XHRcdFx0LCByZXNoaWZ0XG5cdFx0XHRcdCwgdHJ1ZVxuXG5tb2R1bGUuZXhwb3J0cyA9IGRlciIsImFuZ3VsYXIgPSByZXF1aXJlICdhbmd1bGFyJ1xuZDMgPSByZXF1aXJlICdkMydcbnRleHR1cmVzID0gcmVxdWlyZSAndGV4dHVyZXMnXG5cbmNsYXNzIEN0cmxcblx0Y29uc3RydWN0b3I6IChAc2NvcGUsIEBlbCwgQHdpbmRvdyktPlxuXHRcdHQgPSB0ZXh0dXJlcy5saW5lcygpXG5cdFx0XHQub3JpZW50YXRpb24gXCIzLzhcIiwgXCI3LzhcIlxuXHRcdFx0LnNpemUgNFxuXHRcdFx0LnN0cm9rZSgnI0U2RTZFNicpXG5cdFx0ICAgIC5zdHJva2VXaWR0aCAuNlxuXG5cdFx0dC5pZCAnbXlUZXh0dXJlJ1xuXG5cdFx0dDIgPSB0ZXh0dXJlcy5saW5lcygpXG5cdFx0XHQub3JpZW50YXRpb24gXCIzLzhcIiwgXCI3LzhcIlxuXHRcdFx0LnNpemUgNFxuXHRcdFx0LnN0cm9rZSgnd2hpdGUnKVxuXHRcdCAgICAuc3Ryb2tlV2lkdGggLjRcblxuXHRcdHQyLmlkICdteVRleHR1cmUyJ1xuXG5cdFx0ZDMuc2VsZWN0IEBlbFswXVxuXHRcdFx0LnNlbGVjdCAnc3ZnJ1xuXHRcdFx0LmNhbGwgdFxuXHRcdFx0LmNhbGwgdDJcblxuZGVyID0gLT5cblx0ZGlyZWN0aXZlID0gXG5cdFx0Y29udHJvbGxlckFzOiAndm0nXG5cdFx0c2NvcGU6IHt9XG5cdFx0dGVtcGxhdGU6ICc8c3ZnIGhlaWdodD1cIjBweFwiIHN0eWxlPVwicG9zaXRpb246IGFic29sdXRlO1wiIHdpZHRoPVwiMHB4XCI+PC9zdmc+J1xuXHRcdHRlbXBsYXRlTmFtZXNwYWNlOiAnc3ZnJ1xuXHRcdGNvbnRyb2xsZXI6IFsnJHNjb3BlJywnJGVsZW1lbnQnLCAnJHdpbmRvdycsIEN0cmxdXG5cbm1vZHVsZS5leHBvcnRzID0gZGVyXG4iLCJkMyA9IHJlcXVpcmUgJ2QzJ1xuYW5ndWxhciA9IHJlcXVpcmUgJ2FuZ3VsYXInXG5cbmRlciA9ICgkd2luZG93KS0+XG5cdGRpcmVjdGl2ZSA9IFxuXHRcdGNvbnRyb2xsZXI6IGFuZ3VsYXIubm9vcFxuXHRcdGNvbnRyb2xsZXJBczogJ3ZtJ1xuXHRcdGJpbmRUb0NvbnRyb2xsZXI6IHRydWVcblx0XHRyZXN0cmljdDogJ0EnXG5cdFx0dGVtcGxhdGVOYW1lc3BhY2U6ICdzdmcnXG5cdFx0c2NvcGU6IFxuXHRcdFx0aGVpZ2h0OiAnPSdcblx0XHRcdGZ1bjogJz0nXG5cdFx0bGluazogKHNjb3BlLCBlbCwgYXR0ciwgdm0pLT5cblx0XHRcdHNjYWxlID0gdm0uZnVuLnNjYWxlKClcblxuXHRcdFx0c2VsID0gZDMuc2VsZWN0IGVsWzBdXG5cdFx0XHRcdC5jbGFzc2VkICd4IGF4aXMnLCB0cnVlXG5cblx0XHRcdHVwZGF0ZSA9ID0+XG5cdFx0XHRcdHZtLmZ1bi50aWNrU2l6ZSAtdm0uaGVpZ2h0XG5cdFx0XHRcdHNlbC5jYWxsIHZtLmZ1blxuXHRcdFx0XHRcblx0XHRcdHNjb3BlLiR3YXRjaCAtPlxuXHRcdFx0XHRbc2NhbGUuZG9tYWluKCksIHNjYWxlLnJhbmdlKCkgLHZtLmhlaWdodF1cblx0XHRcdCwgdXBkYXRlXG5cdFx0XHQsIHRydWVcblxuXG5tb2R1bGUuZXhwb3J0cyA9IGRlciIsImQzID0gcmVxdWlyZSAnZDMnXG5hbmd1bGFyID0gcmVxdWlyZSAnYW5ndWxhcidcblxuZGVyID0gKCR3aW5kb3cpLT5cblx0ZGlyZWN0aXZlID0gXG5cdFx0Y29udHJvbGxlcjogYW5ndWxhci5ub29wXG5cdFx0Y29udHJvbGxlckFzOiAndm0nXG5cdFx0YmluZFRvQ29udHJvbGxlcjogdHJ1ZVxuXHRcdHJlc3RyaWN0OiAnQSdcblx0XHR0ZW1wbGF0ZU5hbWVzcGFjZTogJ3N2Zydcblx0XHRzY29wZTogXG5cdFx0XHR3aWR0aDogJz0nXG5cdFx0XHRmdW46ICc9J1xuXHRcdGxpbms6IChzY29wZSwgZWwsIGF0dHIsIHZtKS0+XG5cdFx0XHRzY2FsZSA9IHZtLmZ1bi5zY2FsZSgpXG5cblx0XHRcdHNlbCA9IGQzLnNlbGVjdChlbFswXSkuY2xhc3NlZCgneSBheGlzJywgdHJ1ZSlcblxuXHRcdFx0dXBkYXRlID0gPT5cblx0XHRcdFx0dm0uZnVuLnRpY2tTaXplKCAtdm0ud2lkdGgpXG5cdFx0XHRcdHNlbC5jYWxsIHZtLmZ1blxuXG5cdFx0XHRzY29wZS4kd2F0Y2ggLT5cblx0XHRcdFx0IyBjb25zb2xlLmxvZyBzY2FsZS5yYW5nZSgpXG5cdFx0XHRcdFtzY2FsZS5kb21haW4oKSwgc2NhbGUucmFuZ2UoKSAsdm0ud2lkdGhdXG5cdFx0XHQsIHVwZGF0ZVxuXHRcdFx0LCB0cnVlXG5cbm1vZHVsZS5leHBvcnRzID0gZGVyIiwiJ3VzZSBzdHJpY3QnXG5cbm1vZHVsZS5leHBvcnRzLnRpbWVvdXQgPSAoZnVuLCB0aW1lKS0+XG5cdFx0ZDMudGltZXIoKCk9PlxuXHRcdFx0ZnVuKClcblx0XHRcdHRydWVcblx0XHQsdGltZSlcblxuXG5GdW5jdGlvbjo6cHJvcGVydHkgPSAocHJvcCwgZGVzYykgLT5cbiAgT2JqZWN0LmRlZmluZVByb3BlcnR5IEBwcm90b3R5cGUsIHByb3AsIGRlc2MiXX0=
