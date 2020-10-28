
TAG:=ebrains
IMAGE_FRONTEND:=psp-validation-ui
REGISTRY:=antonelepfl

build_frontend_latest:
	@echo 'Building frontend...'
	@echo $(IMAGE_FRONTEND)
	cd frontend && docker build -t $(IMAGE_FRONTEND):$(TAG) .
	docker tag $(IMAGE_FRONTEND):$(TAG) $(REGISTRY)/$(IMAGE_FRONTEND):$(TAG)
	docker push $(REGISTRY)/$(IMAGE_FRONTEND):$(TAG)
