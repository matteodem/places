Template['detail'].helpers({
    'isOwner' : function () {
        var user = Meteor.user();

        if (user) {
            return user._id === this.owner;
        }

        return false;
    }
});

Template['detail'].events({
    'click .remove.button' : function (e) {
        e.preventDefault();
        // do modal stuff
        Place.easyRemove(this._id);
        Router.go('home');
    }
});

Template.detail.rendered = function () {
    var map,
        loc = {},
        geocoder,
        that = this;

    if ("object" === typeof google) {
        geocoder = new google.maps.Geocoder();

        geocoder.geocode( { 'address': that.data.name }, function(results, status) {
            loc = results.shift();

            if (!loc) {
                console.log('Please provide real cities!');
                $('#didntFind').addClass('error');
                return ;
            }

            loc = loc.geometry.location;

            map = new google.maps.Map(document.getElementById("map_canvas"), {
                center: new google.maps.LatLng(loc.ob, loc.pb),
                zoom: 14,
                mapTypeId: google.maps.MapTypeId.ROADMAP
            });
            
            // All points for a place
            _.each(that.data.points, function (pointId) {
                var marker,
                    infowindow,
                    point = Point.findOne(pointId);

                if (_.isObject(point)) {
                    infowindow = new google.maps.InfoWindow({
                        content: Template.popup(point)
                    });

                    marker = new google.maps.Marker({
                        position: new google.maps.LatLng(point.x, point.y),
                        map: map,
                        title: point.name
                    });

                    google.maps.event.addListener(marker, 'click', function () {
                        infowindow.open(map, marker);
                    });
                }
            });

            // Event Listener for clicking onto the map
            google.maps.event.addListener(map, 'click', function (e) {
                var user = Meteor.user();

                if (!_.isObject(user)) {
                    return false;
                }

                if (that.data.owner !== user._id && !that.data.isPubliclyEditable) {
                    return false;
                }

                $('.basic.modal').modal('setting', {
                    onApprove : function() {
                        var name = $('#pointName').val(),
                            id = name + e.latLng.ob.toString() + e.latLng.pb.toString(),
                            obj = {
                            '_id' : id,
                            'x' : e.latLng.ob,
                            'y' : e.latLng.pb,
                            'name' : name,
                            'description' : $('#pointDescription').val(),
                            'owner' : user._id
                        };

                        if (0 >= obj.name.length || 0 >= obj.description.length) {
                            // show error
                            return false;
                        }

                        Point.easyInsert(obj);

                        // Safe the points
                        Place.easyUpdate(
                            that.data._id,
                            { $push : { 'points' : id } }
                        );

                        return true;
                    }
                }).modal('show');

                return true;
            });
        });
    }
}
