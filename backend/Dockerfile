
FROM python:3.7-slim-buster as base

FROM base as builder

ARG INSTALL_DIR=/install
RUN mkdir $INSTALL_DIR
WORKDIR $INSTALL_DIR

COPY requirements.txt ./

RUN pip3 install \
    --prefix=$INSTALL_DIR \
    --no-warn-script-location \
     -i https://bbpteam.epfl.ch/repository/devpi/simple \
    -r requirements.txt


FROM base

WORKDIR /opt/psp-validation

LABEL maintainer="BlueBrain NSE(Neuroscientific Software Engineering)"

COPY --from=builder /install /usr/local
COPY server.py circuit_helper.py ./

EXPOSE 3000

ENTRYPOINT ["python3", "server.py"]
