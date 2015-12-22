(function() {

    var Calculon = function(options) {
        this.options = {
            investRatesMap: {
                tech: 23,
                foreign: 25,
                global: 30
            }
        };

        this.options = $.extend(this.options, options);

        this._init();
    };

    var AppViewModel = function(app) {

        this.selectedFund = ko.observable('global');
        this.selectedPeriod = ko.observable('6');
        this.capital = ko.observable(200000)
            .extend({toNumber: null});

        this.rate = ko.computed(function() {
            return app.options.investRatesMap[this.selectedFund()];
        }, this);

        this.profit = ko.computed(function() {
            var capital = parseInt(this.capital());
            var period = parseInt(this.selectedPeriod());

            return capital * period / 12 * this.rate() / 100;

        }, this);

        this.income = ko.computed(function() {
            return this.profit() + this.capital();
        }, this);

        this.incomeFormatted = ko.computed(function() {
            return app.currencyFormat(this.income());
        }, this);

        this.profitFormatted = ko.computed(function() {
            return app.currencyFormat(this.profit());
        }, this);

        this.capitalFormatted = ko.computed(function() {
            return app.currencyFormat(this.capital());
        }, this);

    };

    Calculon.prototype._init = function() {
        this._initViewModel();
    };

    Calculon.prototype._initViewModel = function() {
        this.vm = new AppViewModel(this);

        ko.applyBindings(this.vm);
    };

    Calculon.prototype.currencyFormat = function(value) {
        value = String(value);
        var max = Math.ceil(value.length/3);
        var partials = [];
        var rightBoundary;

        for (var i = 1; i <= max; i++) {
            partials.unshift(value.slice(0 - (3 * i), rightBoundary));
            rightBoundary = 0 - (3 * i);
        }

        return partials.join(' ') + ' Р';
    };

    // todo: вынести вовне
    new Calculon();
})();