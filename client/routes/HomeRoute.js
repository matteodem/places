var HomeController = RouteController.extend({
    template: 'home',
    data : function () {
        var place = !Session.get('search') ? Place.find() : EasySearch.search('places', Session.get('search'));

        return {
            'place' : place
        }
    }
});

Router.map(function () {
    this.route('home', {
        path :  '/',
        controller :  HomeController,
        menu : 'main-menu',
        weight : 0
    });
});

