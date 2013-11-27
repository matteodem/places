var DetailController = RouteController.extend({
    template: 'detail',
    data : function () {
        return Place.findOne(this.params._id);
    }
});

Router.map(function () {
    this.route('detail', {
        path :  '/detail/:_id',
        controller :  DetailController
    });
});

