# Aki

Manages DiscordWaifus' Team API Keys

## Setup

### Generating Signing Keys

`openssl genrsa -out jwtRS256.key 2048` generates the private key
`openssl rsa -in jwtRS256.key -outform PEM -pubout -out jwtRS256.key.pub` generates the public key.
