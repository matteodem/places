Template.home.created = function () {
    EasySearch.createSearchIndex('places', {
        collection : Place,
        field : 'name',
        limit : 50
    })
}

Template.home.rendered = function () {
    var geocoder,
        locInput = $("#name");

    $('.ui.checkbox')
        .checkbox()
    ;

    locInput.autocomplete({
        source: function (request, response) {
            $.getJSON(
                "http://gd.geobytes.com/AutoCompleteCity?callback=?&q="+request.term,
                function (data) {
                    response(data);
                }
            );
        },
        minLength: 3,
        select: function (event, ui) {
            var selectedObj = ui.item;
            locInput.val(selectedObj.value);
            return false;
        },
        open: function () {
            $(this).removeClass("ui-corner-all").addClass("ui-corner-top");
        },
        close: function () {
            $(this).removeClass("ui-corner-top").addClass("ui-corner-all");
        }
    });

    locInput.autocomplete("option", "delay", 100);

    // map with all points
    map = new google.maps.Map(document.getElementById("global_map_canvas"), {
        center: new google.maps.LatLng(40, 20),
        zoom: 3,
        scrollwheel: false,
        navigationControl: false,
        mapTypeControl: false,
        scaleControl: false,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    });

    geocoder = new google.maps.Geocoder();

    _.each(Place.find().fetch(), function (place) {
        var loc,
            marker;

        geocoder.geocode({ 'address' : place.name }, function (results, status) {
            loc = results.shift().geometry.location;

            marker = new google.maps.Marker({
                position: new google.maps.LatLng(loc.ob, loc.pb),
                map: map,
                title: place.name
            });

            google.maps.event.addListener(marker, 'click', function () {
                Router.go("detail", place);
            });
        });
    });
}

Template.home.helpers({
    'ownerName' : function () {
        var user = Meteor.users.findOne(this.owner);

        if (user) {
            return user.username;
        }

        return false;
    }
});

Template.home.events({
    'keyup #placeSearch' : function (e) {
        Session.set('search', $('#placeSearch').val());
    },
    'click #create-diagram' : function (e) {
        var form = $('#create-diagram-form'),
            func = form.is(':visible') ? 'hide' : 'show';

        form[func]();
        e.preventDefault();
    },
    'submit #create-diagram-form' : function (e) {
        var nameInput = $('#name'),
            descInput = $('#description'),
            values = {
            'name' : nameInput.val(),
            'owner' : Meteor.user()._id,
            'description' : descInput.val(),
            'isPubliclyEditable' : $('#isEditable').prop('checked')
        };

        if (values.name.length > 0 && values.description.length > 0) {
            Place.easyInsert(values);
            nameInput.val('');
            descInput.val('');
            $('#create-diagram-form').hide();
        }

        e.preventDefault();
    }
});
