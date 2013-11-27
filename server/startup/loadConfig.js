Meteor.startup(function () {
    var config = YAML.eval(Assets.getText('config.yml'));

    ServerSession.set('googleMapsKey', config['google_maps_key'])
});