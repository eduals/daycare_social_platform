(function() {
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child;
  };
  window.Kin.DayCare.ManagePicturesView = (function() {
    __extends(ManagePicturesView, Backbone.View);
    function ManagePicturesView() {
      ManagePicturesView.__super__.constructor.apply(this, arguments);
    }
    ManagePicturesView.prototype.el = null;
    ManagePicturesView.prototype.tplUrl = '/templates/main/day_care/manage_pictures.html';
    ManagePicturesView.prototype.uploader = null;
    ManagePicturesView.prototype.initialize = function(options) {
      if (options == null) {
        options = {};
      }
      this.model && (this.model.view = this);
      this.maps = options.maps;
      return this;
    };
    ManagePicturesView.prototype.render = function() {
      var that;
      that = this;
      $.tmpload({
        url: this.tplUrl,
        onLoad: function(tpl) {
          var $el;
          $el = $(that.el);
          $el.html(tpl({
            dayCare: that.model
          }));
          return that.uploader = new qq.FileUploader({
            element: document.getElementById('picture-uploader'),
            action: 'day-cares/upload',
            debug: false,
            onSubmit: function(id, fileName) {
              return that.uploader.setParams({
                dayCareId: that.model.get('_id'),
                setId: that.$('#picture-set-list option:selected').val()
              });
            }
          });
        }
      });
      return this;
    };
    ManagePicturesView.prototype.remove = function() {
      var $el;
      $el = $(this.el);
      this.unbind();
      $el.unbind().empty();
      return this;
    };
    return ManagePicturesView;
  })();
}).call(this);
