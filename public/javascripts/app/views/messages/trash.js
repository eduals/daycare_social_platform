(function() {
  var __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  Kin.Messages.TrashView = (function(_super) {

    __extends(TrashView, _super);

    function TrashView() {
      TrashView.__super__.constructor.apply(this, arguments);
    }

    return TrashView;

  })(Kin.Messages.InboxView);

}).call(this);
