(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['jquery'], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory(require('jquery'));
  } else {
    root.JK = factory(root.jQuery);
  }
} (this, function ($) {
  var JK = function() {};

  var Keyboard = function(options) {
    options = options || {};
    if (!options.container) {
      return false;
    }

    options.decimal = options.decimal || 2;
    options.open = options.open || false;
    this.options = options;
    this.data = {};
    this.init();
  };

  Keyboard.prototype.clear = function() {
    this.data.result = 0;
    this.data.number = [];
    this.data.decimal = false;
    this.data.decimalNum = 0;
  };

  Keyboard.prototype.init = function() {
    this.clear();
    var $el = $(this.options.container);
    this.onTouchStart = Keyboard.prototype.onTouchStart.bind(this);
    this.$el = $el;
    this.$keys = $el.find('.jk-key[data-code]');
    this.$keys.on('touchstart', this.onTouchStart);

    if (this.options.open) {
      this.open();
    }

    if (typeof this.options.onStart === 'function') {
      this.options.onStart(this);
    }
  };

  Keyboard.prototype.destroy = function() {
    this.clear();
    this.$keys.off('touchstart', this.onTouchStart);
  };

  Keyboard.prototype.open = function() {
    this.$el.addClass('open');
  };

  Keyboard.prototype.close = function() {
    this.$el.removeClass('open');
  };

  Keyboard.prototype.onTouchStart = function(e) {
    e.preventDefault();
    var $key = $(e.currentTarget);
    var code = $key.data('code');
    var result = this.handleKeyPress(code);

    $key.addClass('down');
    setTimeout(function() {
      $key.removeClass('down');
    }, 100);

    if (typeof this.options.onKeyUp === 'function') {
      this.options.onKeyUp(result);
    }
  };

  Keyboard.prototype.handleKeyPress = function(code) {
    var data = this.data;
    if (code === 'backspace') {
      var tail = data.number.pop();
      if (tail === '.') {
        data.decimal = false;
      } else if (data.decimal) {
        data.decimalNum--;
      }
    } else if (code === '.') {
      if (!data.decimal) {
        data.decimal = true;
        if (!data.number.length) {
          data.number.push(0);
        }
        data.number.push(code);
      }
    } else {
      code = parseInt(code);
      if (data.number.length === 1 && data.number[0] === 0) {
        data.number.pop();
      }
      if (data.decimal) {
        if (data.decimalNum < this.options.decimal) {
          data.decimalNum++;
          data.number.push(code);
        }
      } else {
        data.number.push(code);
      }
    }

    var result = data.number.join('');
    if (typeof this.options.onKeyDown === 'function') {
      var callbackValue = this.options.onKeyDown(result);
      if (callbackValue === false) {
        data.number.pop();
        result = data.number.join('');
      }
    }

    return result;
  };

  JK.Keyboard = Keyboard;
  JK.start = function(options) {
    return new Keyboard(options);
  };

  return JK;
}));
