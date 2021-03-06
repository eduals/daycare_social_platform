(function() {
  var Message, MessageSchema, User, exports, _,
    __indexOf = Array.prototype.indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  User = require("./user");

  _ = require("underscore");

  MessageSchema = new Schema({
    from_id: {
      type: String
    },
    to_id: {
      type: String
    },
    type: {
      type: String,
      "enum": ["default", "sent", "deleted"],
      "default": "default"
    },
    content: {
      type: String,
      "default": ""
    },
    unread: {
      type: Boolean,
      "default": false
    },
    created_at: {
      type: Date,
      "default": Date.now
    },
    updated_at: {
      type: Date,
      "default": Date.now
    },
    from_user: {
      type: {}
    },
    to_user: {
      type: {}
    }
  });

  MessageSchema.statics.send = function(userId, data) {
    var message;
    data.from_id = userId;
    delete data.to_user;
    delete data.from_user;
    delete data.created_at;
    delete data.updated_at;
    message = new this(data);
    message.type = "default";
    message.unread = true;
    message.save(function() {
      var Notification;
      Notification = require("./notification");
      return Notification.triggerNewMessages(data.to_id);
    });
    message = new this(data);
    message.type = "sent";
    return message.save();
  };

  MessageSchema.statics.sendToClass = function(fromUser, toClass, messageData) {
    var fromUserId, receiverIds;
    messageData.to_id = toClass._id;
    fromUserId = fromUser._id;
    Message.send(fromUserId, messageData);
    receiverIds = _.filter(toClass.friends, function(receiverId) {
      return receiverId !== fromUserId;
    });
    return User.find().where("type")["in"](["parent", "staff", "daycare"]).where("_id")["in"](receiverIds).run(function(err, users) {
      var fromId, user, _i, _len, _results;
      if (users == null) users = [];
      fromId = fromUser.type === "daycare" ? toClass._id : fromUserId;
      _results = [];
      for (_i = 0, _len = users.length; _i < _len; _i++) {
        user = users[_i];
        messageData.to_id = user._id;
        _results.push(Message.send(fromId, messageData));
      }
      return _results;
    });
  };

  MessageSchema.statics.findDefault = function(toUserId, onFind) {
    return this.findMessages({
      to_id: toUserId,
      type: "default"
    }, onFind);
  };

  MessageSchema.statics.findSent = function(fromUserId, onFind) {
    return this.findMessages({
      from_id: fromUserId,
      type: "sent"
    }, onFind);
  };

  MessageSchema.statics.findLastMessages = function(toUserId, limit, onFind) {
    return this.findMessages({
      to_id: toUserId,
      type: "default"
    }, onFind, limit);
  };

  MessageSchema.statics.findMessages = function(findOptions, onFind, limit) {
    if (limit == null) limit = false;
    return this.find(findOptions).desc('created_at').limit(limit).run(function(err, messages) {
      var message, usersToFind, _i, _len, _ref, _ref2;
      usersToFind = [];
      if (messages) {
        for (_i = 0, _len = messages.length; _i < _len; _i++) {
          message = messages[_i];
          if (!(_ref = message.to_id, __indexOf.call(usersToFind, _ref) >= 0)) {
            usersToFind.push(message.to_id);
          }
          if (!(_ref2 = message.from_id, __indexOf.call(usersToFind, _ref2) >= 0)) {
            usersToFind.push(message.from_id);
          }
        }
        return User.find().where("_id")["in"](usersToFind).run(function(err, users) {
          var message, user, _j, _k, _len2, _len3;
          if (users) {
            for (_j = 0, _len2 = messages.length; _j < _len2; _j++) {
              message = messages[_j];
              for (_k = 0, _len3 = users.length; _k < _len3; _k++) {
                user = users[_k];
                if (("" + user._id) === ("" + message.to_id)) {
                  message.to_user = user;
                }
                if (("" + user._id) === ("" + message.from_id)) {
                  message.from_user = user;
                }
              }
            }
          }
          return onFind(err, messages);
        });
      } else {
        return onFind(err, messages);
      }
    });
  };

  MessageSchema.statics.findConversations = function(userId, onFind) {
    return Message.find({
      to_id: userId,
      type: "default"
    }).desc('created_at').run(function(err, receivedMessages) {
      var receivedUsersIds;
      if (receivedMessages == null) receivedMessages = [];
      receivedMessages = _.uniq(receivedMessages, false, function(msg) {
        return msg.from_id;
      });
      receivedUsersIds = _.map(receivedMessages, function(message) {
        if (message == null) message = {};
        return message.from_id;
      });
      receivedUsersIds = receivedUsersIds || [];
      return Message.find({
        from_id: userId,
        type: "sent"
      }).where("to_id").nin(receivedUsersIds).desc('created_at').run(function(err, sentMessages) {
        var messages, usersToFind;
        if (sentMessages == null) sentMessages = [];
        sentMessages = _.uniq(sentMessages, false, function(msg) {
          return msg.to_id;
        });
        messages = receivedMessages.concat(sentMessages);
        if (messages) {
          usersToFind = _.map(messages, function(message) {
            if (message == null) message = {};
            if (message.type === "default") {
              return message.from_id;
            } else {
              return message.to_id;
            }
          });
          usersToFind = _.uniq(usersToFind);
          return User.find().where("_id")["in"](usersToFind).run(function(err, users) {
            var message, user, _i, _j, _len, _len2;
            if (users) {
              for (_i = 0, _len = messages.length; _i < _len; _i++) {
                message = messages[_i];
                for (_j = 0, _len2 = users.length; _j < _len2; _j++) {
                  user = users[_j];
                  if (("" + user._id) === ("" + message.to_id)) {
                    message.to_user = user;
                  }
                  if (("" + user._id) === ("" + message.from_id)) {
                    message.from_user = user;
                  }
                }
              }
            }
            return onFind(err, messages);
          });
        } else {
          return onFind(err, messages);
        }
      });
    });
  };

  MessageSchema.statics.findMessagesFromUser = function(userId, fromUserId, onFind) {
    return Message.find().or([
      {
        to_id: userId,
        from_id: fromUserId,
        type: "default"
      }, {
        to_id: fromUserId,
        from_id: userId,
        type: "sent"
      }
    ]).desc('created_at').run(function(err, messages) {
      var usersToFind;
      if (messages) {
        usersToFind = _.map(messages, function(message) {
          if (message == null) message = {};
          if (message.type === "default") {
            return message.from_id;
          } else {
            return message.to_id;
          }
        });
        usersToFind = _.uniq(usersToFind);
        return User.find().where("_id")["in"](usersToFind).run(function(err, users) {
          var message, user, _i, _j, _len, _len2;
          if (users) {
            for (_i = 0, _len = messages.length; _i < _len; _i++) {
              message = messages[_i];
              for (_j = 0, _len2 = users.length; _j < _len2; _j++) {
                user = users[_j];
                if (("" + user._id) === ("" + message.to_id)) {
                  message.to_user = user;
                }
                if (("" + user._id) === ("" + message.from_id)) {
                  message.from_user = user;
                }
              }
            }
          }
          return onFind(err, messages);
        });
      } else {
        return onFind(err, messages);
      }
    });
  };

  Message = mongoose.model("Message", MessageSchema);

  exports = module.exports = Message;

}).call(this);
