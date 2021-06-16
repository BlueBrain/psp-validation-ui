
TAG:=mooc-bbp
IMAGE_FRONTEND:=psp-validation-ui
REGISTRY:=docker-registry-default.ocp.bbp.epfl.ch/bbp-ou-nse

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
	docker build -t $(IMAGE_FRONTEND):$(TAG) .

push_latest: | build_latest
	@echo 'Pushing frontend...'
	# oc login
	# docker login -p $(oc whoami -t) -u unused docker-registry-default.ocp.bbp.epfl.ch
	docker tag $(IMAGE_FRONTEND):$(TAG) $(REGISTRY)/$(IMAGE_FRONTEND):$(TAG)
	docker push $(REGISTRY)/$(IMAGE_FRONTEND):$(TAG)

run_dev:
	npm run dev
