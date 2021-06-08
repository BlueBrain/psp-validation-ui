
TAG:=hbp
IMAGE_BACKEND:=psp-validation-backend
REGISTRY:=docker-registry.ebrains.eu/bsp-epfl


define HELPTEXT
Makefile usage
 Targets:
    run_dev        Run development instance of the backend.
    build_latest   Create the backend project
    push_latest    Push the backend image to Harbor
endef
export HELPTEXT

help:
	@echo "$$HELPTEXT"


build_latest:
	@echo 'Building backend...'
	@echo $(IMAGE_BACKEND)
	docker build -t $(IMAGE_BACKEND):$(TAG) .

push_latest: | build_latest
	docker tag $(IMAGE_BACKEND):$(TAG) $(REGISTRY)/$(IMAGE_BACKEND):$(TAG)
	docker push $(REGISTRY)/$(IMAGE_BACKEND):$(TAG)

run_dev: | build_latest
	docker-compose down && docker-compose up

build_dev:
	docker build -t $(IMAGE_BACKEND):dev .

push_dev: | build_dev
	docker tag $(IMAGE_BACKEND):dev $(REGISTRY)/$(IMAGE_BACKEND):dev
	docker push $(REGISTRY)/$(IMAGE_BACKEND):dev
