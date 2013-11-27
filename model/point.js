Point = new Meteor.Collection('point');

Point.allow({
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

PointChecker = new EasyCheck({
    '_id' : 'string',
    'x' : 'number',
    'y' : 'number',
    'name' : 'string:64',
    'description' : 'string',
    'owner' : 'string:255'
}, Point);

PlaceChecker = new EasyCheck({
    'name' : 'string:64',
    'description' : 'string',
    'isPubliclyEditable' : 'boolean',
    'owner' : 'string:255',
    'points' : {
        'type' : 'array',
        'references' : {
            'collection' : Point
        },
        'contains' : 'string',
        'required' : false
    }
}, Place, {
    'onRemove' : function (id) {
        var user = Meteor.user(),
            doc = Place.findOne(id);

        if (_.isObject(user) && doc.owner === user._id) {
            return true;
        }

        return false;
    }
});

