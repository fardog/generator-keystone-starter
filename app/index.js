var util = require('util');
var path = require('path');
var _ = require('lodash');
var utils = require('keystone-utils');
var colors = require('colors');
var yeoman = require('yeoman-generator');


var KeystoneGenerator = module.exports = function KeystoneGenerator(args, options, config) {

	this.messages = [];

	// Apply the Base Generator
	yeoman.generators.Base.apply(this, arguments);

	// Init Messages
	console.log('\nWelcome to KeystoneJS.\n');

	var done = _.bind(function done() {
		console.log(
			'\n------------------------------------------------' +
			'\n' +
			'\nYour KeystoneJS project is ready to go!' +
			'\n' +
			'\nFor help getting started, visit http://keystonejs.com/guide' +

			((this.usingTestMandrillAPI) ?
				'\n' +
				'\nWe\'ve included a test Mandrill API Key, which will simulate email' +
				'\nsending but not actually send emails. Please replace it with your own' +
				'\nwhen you are ready.'
				: '') +

			((this.usingDemoCloudinaryAccount) ?
				'\n' +
				'\nWe\'ve included a demo Cloudinary Account, which is reset daily.' +
				'\nPlease configure your own account or use the LocalImage field instead' +
				'\nbefore sending your site live.'
				: '') +

			'\n\nTo start your new website, run "node keystone".' +
			'\n');

	}, this);

	// Install Dependencies when done
	this.on('end', function () {

		this.installDependencies({
			bower: true,
			skipMessage: true,
			skipInstall: options['skip-install'],
			callback: done
		});

	});

	// Import Package.json
	this.pkg = JSON.parse(this.readFileAsString(path.join(__dirname, '../package.json')));

};

// Extends the Base Generator
util.inherits(KeystoneGenerator, yeoman.generators.Base);

KeystoneGenerator.prototype.prompts = function prompts() {

	var cb = this.async();

	var prompts = {

		project: [
			{
				name: 'projectName',
				message: 'What is the name of your project?',
				default: 'My Site'
			} 
		],

		config: []

	};

	this.prompt(prompts.project, function(props) {

		_.each(props, function(val, key) {
			this[key] = val;
		}, this);

		// Keep an unescaped version of the project name
		this._projectName = this.projectName;
		// ... then escape it for use in strings (most cases)
		this.projectName = utils.escapeString(this.projectName);

		if (!prompts.config.length) {
			return cb();
		}

		this.prompt(prompts.config, function(props) {

			_.each(props, function(val, key) {
				this[key] = val;
			}, this);

			cb();

		}.bind(this));

	}.bind(this));

};

KeystoneGenerator.prototype.project = function project() {

	this.template('_package.json', 'package.json');
	this.template('_bower.json', 'bower.json');
	this.template('_env', '.env');
	this.template('_jshintrc', '.jshintrc');

	this.template('_keystone.js', 'keystone.js');

	this.copy('editorconfig', '.editorconfig');
	this.copy('gitignore', '.gitignore');
	this.copy('Procfile');
	this.copy('bowerrc', '.bowerrc');
	this.copy('Vagrantfile');

	this.copy('gulpfile.js');
};

KeystoneGenerator.prototype.models = function models() {

	var modelFiles = ['User'],
		modelIndex = '';

	this.mkdir('models');

	modelFiles.forEach(function(i) {
		this.template('models/' + i + '.js');
		modelIndex += 'require(\'./' + i + '\');\n';
	}, this);

	// we're now using keystone.import() for loading models, so an index.js
	// file is no longer required. leaving for reference.

	// this.write('models/index.js', modelIndex);

};

KeystoneGenerator.prototype.routes = function routes() {

	this.mkdir('routes');
	this.mkdir('routes/views');

	this.template('routes/_index.js', 'routes/index.js');
	this.template('routes/_middleware.js', 'routes/middleware.js');

	this.copy('routes/views/index.js');

};

KeystoneGenerator.prototype.templates = function templates() {


	this.mkdir('templates');
	this.mkdir('templates/views');
	this.mkdir('vagrant');

	this.directory('templates/layouts', 'templates/layouts');
	this.directory('templates/mixins', 'templates/mixins');
	this.directory('templates/views/errors', 'templates/views/errors');
	this.directory('vagrant', 'vagrant');

	this.copy('templates/views/index.jade', 'templates/views/index.jade');
};

KeystoneGenerator.prototype.udpates = function routes() {

	this.directory('updates');

};

KeystoneGenerator.prototype.files = function files() {

	this.directory('public');

};
