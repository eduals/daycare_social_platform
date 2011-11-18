(function() {
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child;
  };
  window.Kin.PictureModel = (function() {
    __extends(PictureModel, Backbone.Model);
    function PictureModel() {
      PictureModel.__super__.constructor.apply(this, arguments);
    }
    PictureModel.prototype.defaults = {
      primary: false,
      description: null,
      url: null
    };
    return PictureModel;
  })();
}).call(this);
