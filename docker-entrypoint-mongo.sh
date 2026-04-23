#!/bin/bash
set -e

# Copy keyfile to a writable location and set permissions
cp /tmp/mongo-keyfile /data/mongo-keyfile
chmod 400 /data/mongo-keyfile
chown 999:999 /data/mongo-keyfile

# Call the original MongoDB entrypoint with replica set and keyfile args
exec /usr/local/bin/docker-entrypoint.sh mongod --replSet rs0 --bind_ip_all --keyFile /data/mongo-keyfile
