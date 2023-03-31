# Simply DDNS

This is a simple application you can use to update your DNS records at simply.com dynamically.
When it runs it will check if your domain has changed since the last time it ran and then update it if it has changed.

It uses the [simply.com](https://www.simply.com/en/docs/api/) DDNS API to update the records.

## Configuration
Copy config.example.json and name it config.json. Replace account and `apikey` with your account id and API Key which you can find in the administration section in your simply.com control panel.

Then add your records and domains that you want to dynamically update. Each domain is added as a key with a list of records for that domain that is should update.

Example
```json
"domains": {
    "example.com": [
        "foo.example.com",
        "bar.example.com"
    ]
}
```

## Running
Once you have created your configuration you can run the container. You can either run it locally using node js or run it with the prebuilt container.

### Using node
```bash
# Install depencies
npm install --omit-dev
node app.js
```
## Using docker
`docker run -v "$PWD/config.json:/app/config.json" chrisode/simply_ddns:latest`

