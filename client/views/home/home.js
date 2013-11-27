Template.home.created = function () {
    EasySearch.createSearchIndex('places', {
        collection : Place,
        field : 'name',
        limit : 50
    })
}

Template.home.rendered = function () {
    var locInput = $("#name");

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
}

Template.home.helpers({
    'diagram' : function () {
        if (!Session.get('search')) {
            return Place.find();
        }

        return EasySearch.search('places', Session.get('search'));
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
