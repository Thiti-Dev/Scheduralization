//example with multiple exports
/*module.exports = {
    method: function () { },
    otherMethod: function () { }
}*/

//colorful txt in terminal
const chalk = require('chalk');

const sendDebugLog = (text) => {
	console.log(chalk.yellow(`[DEBUG]: `) + chalk.red(text));
};

const sendDatabaseLog = (text) => {
	console.log(chalk.blue(`[DATABASE]: `) + chalk.yellowBright(text));
};

const sendTestLog = (text) => {
	console.log(chalk.red(`[INSPECT]: `) + chalk.white(text));
};

module.exports = {
	sendDebugLog,
	sendDatabaseLog,
	sendTestLog
};
