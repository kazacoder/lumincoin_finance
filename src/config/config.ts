const host: string = process.env.HOST ? process.env.HOST : 'localhost';

const config: {api: string, host: string} = {
    api: host + '/api',
    host: host,
}

export default config;