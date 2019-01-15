import Handler from '../handlers/assets';
import stateConfig from '../config/state'

export default [
    {
        method: 'GET',
        path: '/assets/{p*}',
        config: {
            handler: Handler.assets,
            state: stateConfig
        }
    }
];
