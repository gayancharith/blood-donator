import Waterline from 'waterline';

module.exports = Waterline.Collection.extend({

    identity: 'user',
    connection: 'default',

    attributes: {
        firstName: 'string',
        lastName: 'string'
    },

    sayhi : () => {
    	return Promise.resolve('hi');
    },

    sayhello : (hiIp, helloIP) => {
        let result = hiIp +" "+helloIP;
        return Promise.resolve(result);
    }
});
