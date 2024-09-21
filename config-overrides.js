module.exports = function override(config, env) {
    // New config, e.g. config.plugins.push...

    config.module.rules.push ({
			test: /\.(c|d|t)sv$/, // load all .csv, .dsv, .tsv files with dsv-loader
			use: ['dsv-loader'] // or dsv-loader?delimiter=,
		}
    )

    return config;
}