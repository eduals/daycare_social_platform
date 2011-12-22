class Kin.AppView extends Backbone.View
    
  mainColumnView: null

  side1ColumnView: null
  
  mainColumnSelector: "#main-column"
  
  side1ColumnSelector: "#side-column1"
  
  router: null
  
  currentUser: null
  
  window: null
  
  initialize: ()->
    @initCurrentUser(@onUserLoad)
  
  onUserLoad: ()=>
    @initWindow()
    @initHeaderMenu()
    @initHeaderNotification()
    @initRouter()
  
  initRouter: ()->
    @router = new Kin.MainRouter
      app: @
    Backbone.history.start
      pushState: false

  initCurrentUser: (onLoad)->
    @currentUser = new Kin.UserModel()
    @currentUser.fetch
      success: (model)->
        if not model.get('_id')
          window.location = '/login'
        else
          onLoad()

  initWindow: ()->
    @window = new Kin.WindowView()

  initHeaderMenu: ()->
    headerSettingsSubmenu = new Kin.Header.SubmenuView
      el: "header #account-bt"
    @window.addEventDelegate(headerSettingsSubmenu)
  
  initHeaderNotification: ()->
    headerNotificationBoard = new Kin.Header.NotificationBoardView
      el: "header #notification-board"
      currentUser: @currentUser
    headerNotificationBoard.watch()
  
  renderDaycares: ()->
    @clearColumns()
    
    @mainColumnView = new Kin.DayCare.ListView
      collection: new Kin.DayCareCollection([], {url: '/day-cares'})
      el: @mainColumnSelector
    @mainColumnView.render()
  
  renderViewDaycare: (id)->
    that = @
    @clearColumns()
    dayCare = new Kin.DayCareModel({_id: id})
    dayCare.fetch
      success: (model, response)->

        model.setPictureSets()

        that.mainColumnView = new Kin.DayCare.ProfileView
          model: model
          el: that.mainColumnSelector
          router: that.router
          currentUser: that.currentUser
        that.mainColumnView.render()

        that.side1ColumnView = new Kin.DayCare.ProfileSide1View
          model: model
          el: that.side1ColumnSelector
          currentUser: that.currentUser
          selectedMenuItem: "wall-menu-item"
        that.side1ColumnView.render()
  
  renderViewDayCareGallery: (id)->
    that = @
    @clearColumns()
    dayCare = new Kin.DayCareModel({_id: id})
    dayCare.fetch
      success: (model, response)->

        model.setPictureSets()

        that.mainColumnView = new Kin.DayCare.ProfileGalleryView
          model: model
          el: that.mainColumnSelector
          router: that.router
          currentUser: that.currentUser
        that.mainColumnView.render()

        that.side1ColumnView = new Kin.DayCare.ProfileSide1View
          model: model
          el: that.side1ColumnSelector
          selectedMenuItem: 'gallery-menu-item'
          currentUser: that.currentUser
        that.side1ColumnView.render()

  renderEditDayCare: (id)->
    that = @
    @clearColumns()
    dayCare = new Kin.DayCareModel({_id: id})
    dayCare.fetch
      success: (model, response)->

        mapCenterLat = model.get('location').lat
        mapCenterLng = model.get('location').lng

        that.mainColumnView = new Kin.DayCare.ProfileEditView
          model: model
          el: that.mainColumnSelector
          maps: new Kin.GoogleMapsView
            id: '#profile-address-maps'
            mapsOptions:
              zoom: 15
              mapTypeId: 'google.maps.MapTypeId.ROADMAP'
              center: "new google.maps.LatLng(#{mapCenterLat}, #{mapCenterLng})"
        that.mainColumnView.render()

        that.side1ColumnView = new Kin.DayCare.ProfileEditSide1View
          model: model
          el: that.side1ColumnSelector
        that.side1ColumnView.render()

  renderViewDayCarePictureSet: (id)->
    that = @
    @clearColumns()
    pictureSet = new Kin.PictureSetModel({_id: id})
    pictureSet.fetch
      success: (model, response)->

        that.mainColumnView = new Kin.DayCare.PictureSetView
          model: model
          el: that.mainColumnSelector
          currentUser: that.currentUser
        that.mainColumnView.render()

        that.side1ColumnView = new Kin.DayCare.PictureSetSide1View
          model: model
          el: that.side1ColumnSelector
          currentUser: that.currentUser
        that.side1ColumnView.render()

  renderWriteMessage: (id)->
    @clearColumns()
    
    usersCollection = new Kin.UsersCollection
    
    if id
      draftMessage = new Kin.MessageModel
        _id: id

    @mainColumnView = new Kin.Messages.WriteView
      el: @mainColumnSelector
      collection: usersCollection
      model: draftMessage
    @mainColumnView.render()

    @side1ColumnView = new Kin.Messages.InboxSide1View
      el: @side1ColumnSelector
      selectedMenuItem: "write-menu-item"
    @side1ColumnView.render()

  renderViewInboxMessages: ()->
    @clearColumns()

    messagesCollection = new Kin.MessagesCollection [],
      url: "/messages/default"

    @mainColumnView = new Kin.Messages.InboxView
      el: @mainColumnSelector
      collection: messagesCollection
    @mainColumnView.render()

    @side1ColumnView = new Kin.Messages.InboxSide1View
      el: @side1ColumnSelector
      selectedMenuItem: "inbox-menu-item"
    @side1ColumnView.render()

  renderViewDraftMessages: ()->
    @clearColumns()

    messagesCollection = new Kin.MessagesCollection [],
      url: "/messages/draft"

    @mainColumnView = new Kin.Messages.DraftView
      el: @mainColumnSelector
      collection: messagesCollection
    @mainColumnView.render()

    @side1ColumnView = new Kin.Messages.DraftSide1View
      el: @side1ColumnSelector
      selectedMenuItem: "draft-menu-item"
    @side1ColumnView.render()

  renderViewSentMessages: ()->
    @clearColumns()

    messagesCollection = new Kin.MessagesCollection [],
      url: "/messages/sent"

    @mainColumnView = new Kin.Messages.SentView
      el: @mainColumnSelector
      collection: messagesCollection
    @mainColumnView.render()

    @side1ColumnView = new Kin.Messages.SentSide1View
      el: @side1ColumnSelector
      selectedMenuItem: "sent-menu-item"
    @side1ColumnView.render()

  renderViewTrashMessages: ()->
    @clearColumns()
    
    messagesCollection = new Kin.MessagesCollection [],
      url: "/messages/deleted"

    @mainColumnView = new Kin.Messages.TrashView
      el: @mainColumnSelector
      collection: messagesCollection
    @mainColumnView.render()

    @side1ColumnView = new Kin.Messages.TrashSide1View
      el: @side1ColumnSelector
      selectedMenuItem: "trash-menu-item"
    @side1ColumnView.render()

  clearColumns: (columns = ['main', 'side1'])->
    (@["#{column}ColumnView"] and @["#{column}ColumnView"].remove()) for column in columns