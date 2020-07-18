import getLogger from 'webpack-log';

const log = getLogger({
    name: "FIZZ APP - LOGGER",
    timestamp: true,
    level: "debug",     //* <----- LOGGER LEVEL HERE (CHANGE IF NECESSARY)
});

export default log;
