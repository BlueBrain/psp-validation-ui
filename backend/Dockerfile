
FROM python:3.7-slim-stretch as builder

LABEL maintainer="BlueBrain NSE(Neuroscientific Software Engineering)"
ENV DEBIAN_FRONTEND=noninteractive

RUN pip install --upgrade pip setuptools virtualenv

# Install system dependencies
RUN apt-get update && apt-get install -yq \
    build-essential \
    libreadline-dev \
    jq \
    libz-dev

WORKDIR /opt/psp-validation

COPY requirements.txt ./

RUN pip install \
    --no-cache-dir \
    # -i https://bbpteam.epfl.ch/repository/devpi/simple \
    # -i https://pypi.python.org/simple \
    -r ./requirements.txt

COPY server.py .

EXPOSE 3000

ENTRYPOINT ["python", "server.py"]
