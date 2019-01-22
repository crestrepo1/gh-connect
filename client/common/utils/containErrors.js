// wrap around export functions to prevent function calls from throwing any errors
// DEV SUGGESTION: use sparingly for code (tracking) you don't want to disrupt app rendering/functionality
export default (fn, quiet = false) => (quiet ?
    (...args) => {
        try { return fn(...args); } catch (err) { return err; } // do not throw error, do not log error (for production env)
    }
    :
    (...args) => {
        try { return fn(...args); } catch (err) { return console.error(err) } // eslint-disable-line
    });
