FROM node:16.5.0-alpine

RUN groupadd -r authuser && useradd -m -r -g -s /bin/bash authuser authuser
USER authuser

WORKDIR /home/authenticator/app

COPY . .
ENV  NODE_ENV production

# Server details
ENV AUTH_SERVER_PORT 5001
ENV AUTH_SERVER_ENV "development"

# Issuer name used in the JWT "iby" field
ENV ISSUER_NAME "authenticator"

# PostgreSQL server details
ENV DB_HOST "192.168.1.200"
ENV DB_PORT 5432
ENV DB_NAME "AuthDB_Test"
ENV DB_USER "dbadmin"
ENV DB_PASSWORD "Postgres@Pass123"

# Redis server details
ENV REDIS_HOST "192.168.1.200"
ENV REDIS_PORT 6379
ENV REDIS_PASS "FG0RVs9xv025s7bR/zGmifF9zaByxA2eNN0qUmasW1kuLk14/GEYxml5NrLsMacL+mNPBlUCQzcgSgs"

# Token expiration parameters
ENV ACCESS_TOKEN_EXPIRY_SECONDS 1800
ENV REFRESH_TOKEN_EXPIRY_SECONDS 1800

# Token signing and validating keys
ENV TOKEN_SIGNING_PRIVATE_KEY "rsa_private_key.key"
ENV TOKEN_SIGNING_PUBLIC_KEY "rsa_public_key.key"

# Server logging level
ENV LOG_LEVEL "debug"

RUN npm install --production

EXPOSE ${AUTH_SERVER_PORT}

CMD [“node”, “src/authServer”]