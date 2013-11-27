Meteor.publish('place', function () {
    return Place.find();
});

