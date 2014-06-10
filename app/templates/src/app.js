var ko = require('knockout');

var viewModel = function() {
	var self = this;

	self.test = ko.observable('something');
};

var view = new viewModel();

ko.applyBindings(view);
