(function() {
  var Emailer, email, exports;

  email = require("mailer");

  Emailer = (function() {

    Emailer.prototype.options = {};

    Emailer.prototype.data = {};

    function Emailer(options, data) {
      this.options = options;
      this.data = data;
    }

    Emailer.prototype.send = function(callback) {
      return email.send({
        host: "smtp.gmail.com",
        port: "587",
        ssl: false,
        domain: "localhost",
        to: "'" + this.options.to.name + " " + this.options.to.surname + "' <" + this.options.to.email + ">",
        from: "'Kindzy.com' <no-reply@kindzy.com>",
        subject: this.options.subject,
        template: "./views/emails/" + this.options.template + ".html",
        body: "Please use a newer version of an e-mail manager to read this mail in HTML format.",
        data: this.data,
        authentication: "login",
        username: "no-reply@kindzy.com",
        password: "greatreply#69"
      }, callback);
    };

    return Emailer;

  })();

  exports = module.exports = Emailer;

}).call(this);