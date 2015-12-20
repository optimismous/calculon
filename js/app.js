(function() {

    var Calculon = function() {
        // todo: передавать при инициализации
        this.form = document.getElementById('invest_form');
        this.slider = document.getElementById('slider');
        this.capitalInput = document.getElementById('capital_input');
        this.fundName = document.querySelector('input[name="fund_name"]:checked');
        this.period = document.querySelector('input[name="period"]:checked');

        if (!this.slider || !this.capitalInput) {
            console.warn('Slider is: ', this.slider);
            console.warn('Input is: ', this.capitalInput);
            return;
        }

        this.options = {
            elems: {
                formId: 'invest_form',
                sliderId: 'slider',
                capitalId: 'capital_input',
                fundName: 'fund_name',
                periodName: 'period'
            },
            investRatesMap: {
                tech: 23,
                foreign: 25,
                global: 30
            }
        };

        this._init();
    };

    Calculon.prototype._init = function() {
        this._initViewModel();
        this._initSlider();
        this._attachHandlers();
    };

    Calculon.prototype._initSlider = function() {
        noUiSlider.create(slider, {
            start: 100,
            connect: 'lower',
            range: {
                // Starting at 500, step the value by 500,
                // until 4000 is reached. From there, step by 1000.
                'min': [ 50, 1 ],
                '25%': [ 100, 10 ],
                '75%': [ 1000, 50 ],
                'max': [ 2000 ]
            },
            pips: {
                mode: 'values',
                values: [50, 100, 500, 1000, 2000],
                density: 2000,
                format: wNumb({
                    postfix: ' т.'
                })
            },
            format: wNumb({
                decimals: 0,
                thousand: ' ',
                postfix: ' 000'
            })
        });
    };

    Calculon.prototype._attachHandlers = function() {
        var self = this;

        //var capitalInput = document.getElementById(this.options.elems.capitalId);
        //var investFundInput = document.querySelector('input[name="' + this.options.elems.fundName + '"]');
        //var periodInput = document.querySelector('input[name="' + this.options.elems.periodName + '"]');
        //
        //self.slider.noUiSlider.on('update', function(values) {
        //    self.capitalInput.value = values[0];
        //    self.getProfit(self.getActualValues());
        //});

        //capitalInput.addEventListener('change', function() {
        //    self.slider.noUiSlider.set([this.value]);
        //    console.log('Профит', self.getProfit(self.getActualValues()));
        //});
        //
        //investFundInput.addEventListener('change', function(val) {
        //    console.log(val);
        //});
        //
        //periodInput.addEventListener('change', function(val) {
        //    console.log(val);
        //});

    };

    Calculon.prototype.getProfit = function(values) {
        return values.capital * (values.period / 12 * values.investRate / 100);
    };

    Calculon.prototype.getActualValues = function() {

        var capitalInput = document.getElementById(this.options.elems.capitalId);
        var investFundInput = document.querySelector('input[name="' + this.options.elems.fundName + '"]' + ':checked');
        var periodInput = document.querySelector('input[name="' + this.options.elems.periodName + '"]' + ':checked');

        var capital = parseInt(capitalInput.value);
        var investRate = this.options.investRatesMap[investFundInput.value];
        var period = parseInt(periodInput.value);

        console.log({capital: capital, investRate: investRate, period: period});

        return {capital: capital, investRate: investRate, period: period};

    };

    Calculon.prototype._initViewModel = function() {
        this.vm = {
            selectedFund: ko.observable('global'),
            selectedPeriod: ko.observable('6'),
            capital: ko.observable(100)
        };

        ko.applyBindings(this.vm, this.form);
    };

    new Calculon();
})();