# Contributing

## Setup

1. Clone the repository
1. Run `npm install` to install dependencies
1. Run `npm run build` to build the app

## Running locally

Features like GPS often require HTTPS, so I would recommend using Caddy to run a local server that you can connect to your on your phone on the same network.

```
sudo caddy file-server --domain 192.168.1.178
```

## Tests

```
npm test
```

## Linting

```
npm run lint
```

```
npm run lint-fix
```
