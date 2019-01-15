import Good from 'good';

const goodOpts = {
    reporters: {
        myConsoleReporter: [{
            module: 'good-console'
        }, 'stdout']
    }
};

export default { register: Good, options: goodOpts };
