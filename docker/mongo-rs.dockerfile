FROM mongo:5.0.20

RUN mkdir /scripts

COPY ./tools/scripts /scripts

ENTRYPOINT ["/scripts/setup-replica-set.sh"]
