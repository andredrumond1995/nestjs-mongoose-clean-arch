#!/bin/bash

echo "Waiting for startup.."

until mongo --host test-app-mongo-primary:27017 --eval 'quit(db.runCommand({ ping: 1 }).ok ? 0 : 2)' &>/dev/null; do
  printf '.'
  sleep 1
done

echo "Started.."

mongo --host test-app-mongo-primary:27017 <<EOF
    const cfg = {
        "_id": "rs1",
        "protocolVersion": NumberLong(1),
        "version": 1,
        "members": [
            { "_id": 0, "host": "test-app-mongo-primary:27017" },
            { "_id": 1, "host": "test-app-mongo-secondary:27017", "priority": 0, "secondaryDelaySecs": 10 },
            { "_id": 2, "host": "test-app-mongo-secondary-hidden:27017", "priority": 0, "secondaryDelaySecs": 10, "hidden": true }
        ],
    };
    rs.initiate(cfg, { force: true });
    rs.reconfig(cfg, { force: true });
    rs.slaveOk();
EOF
