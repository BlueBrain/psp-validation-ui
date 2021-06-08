
TAG:=hbp
IMAGE_FRONTEND:=psp-validation-ui
REGISTRY:=docker-registry.ebrains.eu/bsp-epfl


define HELPTEXT
Makefile usage
 Targets:
    run_dev          Run development instance of the frontend.
    build_latest     Create the frontend project
    push_latest      Push the frontend image to Harbor
    build_dev        Create DEV frontend project
    push_dev         Push DEV frontend image to Harbor
endef
export HELPTEXT

help:
	@echo "$$HELPTEXT"

build_latest:
	@echo 'Building frontend...'
	@echo $(IMAGE_FRONTEND)
	docker build -t $(IMAGE_FRONTEND):$(TAG) \
	--build-arg VUE_APP_BACKEND_URL=https://psp-validation.apps.hbp.eu \
	.

push_latest: | build_latest
	@echo 'Pushing frontend...'
	docker tag $(IMAGE_FRONTEND):$(TAG) $(REGISTRY)/$(IMAGE_FRONTEND):$(TAG)
	docker push $(REGISTRY)/$(IMAGE_FRONTEND):$(TAG)

run_dev:
	VUE_APP_BACKEND_URL='http://localhost:3000' \
	npm run dev

build_dev:
	docker build -t $(IMAGE_FRONTEND):dev \
	--build-arg VUE_APP_BACKEND_URL=https://psp-validation-dev-psp.apps.hbp.eu \
	.

push_dev: | build_dev
	docker tag $(IMAGE_FRONTEND):dev $(REGISTRY)/$(IMAGE_FRONTEND):dev
	docker push $(REGISTRY)/$(IMAGE_FRONTEND):dev
