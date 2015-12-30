(function() {

var expect = chai.expect;

describe("Keyboard", function() {

  describe("handleKeyPress", function() {

    before(function() {
      this.keyboard = new JK.Keyboard({
        container: '#jk-keyboard'
      });
    });

    after(function() {
      this.keyboard.destroy();
    });

    beforeEach(function() {
      this.keyboard.clear();
      this.keyboard.options.onKeyDown = null;
    });

    it("should append number when press numeric key", function() {
      var result;
      result = this.keyboard.handleKeyPress('1');
      expect(result).to.equal('1');

      result = this.keyboard.handleKeyPress('2');
      expect(result).to.equal('12');

      result = this.keyboard.handleKeyPress('8');
      expect(result).to.equal('128');
    });

    it("should append only one dot when press \".\"", function() {
      var result;
      this.keyboard.handleKeyPress('8');
      result = this.keyboard.handleKeyPress('.');
      expect(result).to.equal('8.');

      result = this.keyboard.handleKeyPress('.');
      expect(result).to.equal('8.');

      result = this.keyboard.handleKeyPress('4');
      expect(result).to.equal('8.4');

      result = this.keyboard.handleKeyPress('.');
      expect(result).to.equal('8.4');
    });

    it("should delete number when press backspace key", function() {
      var result, i;
      result = this.keyboard.handleKeyPress('2');
      result = this.keyboard.handleKeyPress('0');
      result = this.keyboard.handleKeyPress('4');
      result = this.keyboard.handleKeyPress('8');
      expect(result).to.equal('2048');
      result = this.keyboard.handleKeyPress('backspace');
      expect(result).to.equal('204');

      var len = result.length + 1;
      for (i = 0; i < len; i++) {
        result = this.keyboard.handleKeyPress('backspace');
      }
      expect(result).to.equal('');
    });

    it("should change to other number if first click is \"0\"", function() {
      var result;
      result = this.keyboard.handleKeyPress('0');
      expect(result).to.equal('0');

      result = this.keyboard.handleKeyPress('3');
      expect(result).to.equal('3');
    });

    it("should auto prepend 0 when first click is \".\"", function() {
      var result = this.keyboard.handleKeyPress('.');
      expect(result).to.equal('0.');
    });

    it("should not change result if onKeyDown callback function returns false", function() {
      var result;

      result = this.keyboard.handleKeyPress('4');
      this.keyboard.options.onKeyDown = function(value) { return true; };
      result = this.keyboard.handleKeyPress('7');
      expect(result).to.equal('47');

      this.keyboard.options.onKeyDown = function(value) { return false; };
      result = this.keyboard.handleKeyPress('3');
      result = this.keyboard.handleKeyPress('5');
      expect(result).to.equal('47');
    });

    it("should have at most 2 decimal numbers by default", function() {
      var result;
      this.keyboard.handleKeyPress('.');
      result = this.keyboard.handleKeyPress('2');
      expect(result).to.equal('0.2');
      result = this.keyboard.handleKeyPress('5');
      expect(result).to.equal('0.25');
      result = this.keyboard.handleKeyPress('9');
      expect(result).to.equal('0.25');
    });

  });

});

})();
