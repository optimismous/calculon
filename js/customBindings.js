ko.extenders.toNumber = function(target) {
    var result = ko.pureComputed({
        read: target,
        write: function(newValue) {
            var current = target();
            var normalizedValue = newValue;

            if (newValue === current) {
                return;
            }

            if (typeof newValue === 'string') {
                normalizedValue = parseInt(normalizedValue.replace(/[^0-9]+/g, ''));
            }

            if (isNaN(normalizedValue) ||
                typeof normalizedValue !== 'number') {
                return;
            }

            if (normalizedValue > 2000000) {
                normalizedValue = 2000000;
            }

            if (normalizedValue < 50000) {
                normalizedValue = 50000;
            }

            target(normalizedValue);

            target.notifySubscribers(normalizedValue);
        }
    }).extend({notify: 'always'});

    result(target());

    return result;
};

ko.bindingHandlers.slider = {
    init: function(element, valueAccessor, allBindings, viewModel, bindingContext) {

        noUiSlider.create(element, {
            start: valueAccessor(),
            connect: 'lower',
            range: {
                'min': [50, 1],
                '25%': [100, 10],
                '75%': [1000, 50],
                'max': [2000]
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
                encoder: function(value) {
                    return value * 1000;
                },
                decoder: function(value) {
                    return value / 1000;
                }
            })
        });

        element.noUiSlider.on('update', function(values) {
            if (bindingContext.$data.capital() !== parseInt(values[0])) {
                bindingContext.$data.capital(values[0]);
            }
        });
    },

    update: function(element, valueAccessor, allBindings, viewModel, bindingContext) {
        element.noUiSlider.set(valueAccessor());
    }
};

ko.bindingHandlers.inputmask = {
    init: function (element, valueAccessor, allBindingsAccessor) {

        var mask = valueAccessor();

        var observable = mask.value;

        if (ko.isObservable(observable)) {

            $(element).on('focusout change', function () {

                if ($(element).inputmask('isComplete')) {
                    observable($(element).val());
                } else {
                    observable(null);
                }

            });
        }

        $(element).inputmask({
            alias: 'numeric',
            groupSeparator: ' ',
            autoGroup: true,
            digits: 0,
            digitsOriginal: false,
            suffix: ' Р',
            allowPlus: false,
            allowMinus: false
        });

    },

    update: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
        var mask = valueAccessor();

        var observable = mask.value;

        if (ko.isObservable(observable)) {

            var valuetoWrite = observable();

            $(element).val(valuetoWrite);
        }
    }

};