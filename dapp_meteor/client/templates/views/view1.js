/**
Template Controllers
@module Templates
*/

/**
The view1 template
@class [template] views_view1
@constructor
*/

Template['views_view1'].helpers({
    /**
    Get the name
    @method (name)
    */

    'name': function(){
        return this.name || '**no name set in helper?**';
    }
});

// When the template is created
Template['views_view1'].onCreated(function(){
	Meta.setSuffix("dapp.view1.title");
});
