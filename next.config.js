/** @type {import('next').NextConfig} */

const { parsed: ENV } = require("dotenv").config({
    allowEmptyValues: false,
    path: __dirname + `/src/env/dev.env`,
});
const nextConfig = {
    env: {
        API_URL: ENV.API_URL,
    },
};

module.exports = nextConfig;
