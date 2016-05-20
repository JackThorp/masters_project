import './user.html';

Template['views_user'].helpers({

  'userInfo': function() {
    let user = Session.get('user');
    console.log(user);
    return Session.get('user');
  }

});
