Meteor.publish('point', function () {
    return Point.find();
});

