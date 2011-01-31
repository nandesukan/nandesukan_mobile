

(function() {
  // create tab group
  var tabGroup = Titanium.UI.createTabGroup({id:'tabGroup1'});

  //
  // create base UI tab and root window
  //
  var win1 = Titanium.UI.createWindow({
    id:'win1',
    title:'DrupalCon Chicago',
    backgroundImage:'background.png'
  });

  desc = "<p style='font-size: 12px;'>Something other than a copywrite notice that makes ABSOLUTELY no sense. ";
  desc += 'Ooooooh lookie, a link to my website!!: <a href="http://patrickteglia.com">http://patrickteglia.com</a></p>';

  var wb = Ti.UI.createWebView({
    html:desc,
    height: 150,
    backgroundColor:'transparent'
  });

  win1.add(wb);

  var tab1 = Titanium.UI.createTab({
          id:'tab1',
    icon:'images/tabs/KS_nav_ui.png',
    title:'Schedule',
    window:win1
  });

  //
  // create controls tab and root window
  //
  var win2 = Titanium.UI.createWindow({
      url:'windows/preferences.js',
      title:'Maps'
  });
  var tab2 = Titanium.UI.createTab({
      icon:'images/tabs/KS_nav_mashup.png',
      title:'Maps',
      window:win2
  });


  //
  // create phone tab and root window
  //
  var win3 = Titanium.UI.createWindow({
      url:'windows/twitter.js',
      titleid:'twitter_win_title'
  });
  var tab3 = Titanium.UI.createTab({
      icon:'images/tabs/twitter.png',
      title:'Twitter',
      window:win3
  });

  //
  // create platform tab and root window
  //
  var win4 = Titanium.UI.createWindow({
      url:'windows/preferences.js',
      title:'Starred'
  });
  var tab4 = Titanium.UI.createTab({
      icon:'images/tabs/star.png',
      title:'Starred',
      window:win4
  });

  //
  // create mashup tab and root window
  //
  var win5 = Titanium.UI.createWindow({
      url:'windows/preferences.js',
      title:'More'
  });
  var tab5 = Titanium.UI.createTab({
      icon:'images/tabs/more.png',
      title:'More',
      window:win5
  });

  //
  //  add tabs
  //
  tabGroup.addTab(tab1);
  tabGroup.addTab(tab2);
  tabGroup.addTab(tab3);
  tabGroup.addTab(tab4);
  tabGroup.addTab(tab5);

  tabGroup.addEventListener('open',function()
  {
          // set background color back to white after tab group transition
          Titanium.UI.setBackgroundColor('#fff');
  });

  tabGroup.setActiveTab(0);
  // open tab group with a transition animation
  tabGroup.open({
    transition:Titanium.UI.iPhone.AnimationStyle.FLIP_FROM_LEFT
  });

  //
  //  TAB GROUP EVENTS
  //
  var messageWin = Titanium.UI.createWindow({
    height:30,
    width:250,
    bottom:70,
    borderRadius:10,
    touchEnabled:false,
    orientationModes : [
      Titanium.UI.PORTRAIT,
      Titanium.UI.UPSIDE_PORTRAIT,
      Titanium.UI.LANDSCAPE_LEFT,
      Titanium.UI.LANDSCAPE_RIGHT
    ]
  });
  var messageView = Titanium.UI.createView({
    id:'messageview',
    height:30,
    width:250,
    borderRadius:10,
    backgroundColor:'#000',
    opacity:0.7,
    touchEnabled:false
  });

  var messageLabel = Titanium.UI.createLabel({
    id:'messagelabel',
    text:'',
    color:'#fff',
    width:250,
    height:'auto',
    font:{
      fontFamily:'Helvetica Neue',
      fontSize:13
    },
    textAlign:'center'
  });
  messageWin.add(messageView);
  messageWin.add(messageLabel);

  //
  // TAB EVENTS
  //

  // tab group close event
  tabGroup.addEventListener('close', function(e) {
    messageLabel.text = 'tab group close event';
    messageWin.open();
    setTimeout(function() 	{
      messageWin.close({opacity:0,duration:500});
      tabGroup.open();
    }, 1000);
  });


  // tab group open event
  tabGroup.addEventListener('open', function(e) {
    messageLabel.text = 'tab group open event';
    messageWin.open();
    setTimeout(function() 	{
      messageWin.close({opacity:0,duration:500});
    }, 1000);
  });

  // focus event listener for tracking tab changes
  tabGroup.addEventListener('focus', function(e) {
    //messageLabel.text = 'tab changed to ' + e.index + ' old index ' + e.previousIndex;
    //messageWin.open();
    //setTimeout(function()
    //{
    //	Ti.API.info('tab ' + e.tab.title  + ' prevTab = ' + (e.previousTab ? e.previousTab.title : null));
    //	messageLabel.text = 'active title ' + e.tab.title + ' old title ' + (e.previousTab ? e.previousTab.title : null);
    //},1000);
    //
    //setTimeout(function()
    //{
    //	messageWin.close({opacity:0,duration:500});
    //},2000);

  });

  // blur event listener for tracking tab changes
  tabGroup.addEventListener('blur', function(e) {
    //Titanium.API.info('tab blur - new index ' + e.index + ' old index ' + e.previousIndex);
  });


  // Testing fetching preferences from the preferences.js file
  var checkButton = Titanium.UI.createButton({
    title:'Check user/pass',
    top: 10,
    width:300,
    height: 40
  });
  checkButton.addEventListener('click',function(e) {
    var pass = Titanium.App.Properties.getString("sitePassword");
    var user = Titanium.App.Properties.getString("siteUsername");
    alert("User: " + user + " and Pass: " + pass);
  });
  win1.add(checkButton);

  win1.addEventListener('open', function() {
    function createMenu() {
      // menu.setTiVersion(1.5);
      menu.init({
        win: win1,
        buttons: [
          {
            title: "Update",
            clickevent: function () {
              Ti.fireEvent('drupalcon:update_data');
            }
          },
          {
            title: "Hit sessions",
            clickevent: function () {
              var conn = Drupal.db.getConnection('main');
              var rows = conn.query("SELECT nid, title, changed, start_date, end_date FROM node ORDER BY nid, changed");
              while (rows.isValidRow()) {
                Titanium.API.info('Nid: ' + rows.fieldByName('nid') + ', Start: ' + rows.fieldByName('start_date') + ', End: ' + rows.fieldByName('end_date')  + ', Changed: ' + rows.fieldByName('changed') + ', Title: ' + rows.fieldByName('title'));
                rows.next();
              }
              rows.close();
            }
          },
          {
            title: "Hit presenters",
            clickevent: function () {
              var conn = Drupal.db.getConnection('main');
              var rows = conn.query("SELECT uid, name, full_name FROM user ORDER BY name, uid");
              while (rows.isValidRow()) {
                Titanium.API.info('Uid: ' + rows.fieldByName('uid') + ', Name: ' + rows.fieldByName('name') + ', Full Name: ' + rows.fieldByName('full_name'));
                rows.next();
              }
              rows.close();
            }
          }
        ]
      });
    }
    createMenu();
  });
  

  Ti.addEventListener('drupal:entity:datastore:update_completed', function(e) {
    Drupal.createNoticeDialog('Update completed.').show(3000);
  });

  Ti.addEventListener('drupalcon:update_data', function(e) {
    Drupal.entity.db('main', 'node').fetchUpdates('session');
  });

  Ti.addEventListener('drupalcon:update_data', function(e) {
    Drupal.entity.db('main', 'user').fetchUpdates('user');
  });


})();


