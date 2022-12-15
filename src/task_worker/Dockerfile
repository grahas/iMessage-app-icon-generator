FROM python:3.11
# copy contents of project into docker
WORKDIR /usr/src/app

COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

COPY . .
ENTRYPOINT celery -A tasks worker --loglevel=INFO