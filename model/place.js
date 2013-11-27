Place = new Meteor.Collection('diagram');

Place.allow({
    insert : function () {
        return false;
    },
    update : function () {
        return false;
    },
    remove : function () {
        return false;
    }
});
