module.exports = {
	start_code: '/*$',
	end_code: '$*/',
	end_paste: '/*@*/',
	dirs: [
		'./'
	]
}

module.exports.match = function(filePath) {
	return filePath.match(/\.cpp|h/) !== null
}