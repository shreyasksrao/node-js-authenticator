FROM node:16.5.0-alpine

RUN groupadd -r authuser && useradd -m -r -g -s /bin/bash authuser authuser
USER authuser

WORKDIR /home/authenticator/app

COPY initDB.sh /docker-entrypoint-initdb.d/
COPY . .

ENV  NODE_ENV production

# Server details
ENV AUTH_SERVER_PORT 5001
ENV AUTH_SERVER_ENV "development"

# Issuer name used in the JWT "iby" field
ENV ISSUER_NAME "authenticator"

# PostgreSQL server details
ENV DB_HOST ""
ENV DB_PORT 5432
ENV DB_NAME "AuthDB_Test"
ENV DB_USER "dbadmin"
ENV DB_PASSWORD ""

# Redis server details
ENV REDIS_HOST ""
ENV REDIS_PORT 6379
ENV REDIS_PASS ""

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