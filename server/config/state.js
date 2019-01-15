// state config for cookie parsing on API calls.

module.exports = {
    parse: false, // parse cookies and store in request.state
    failAction: 'log' // may be 'ignore', 'error' or 'log'
}
