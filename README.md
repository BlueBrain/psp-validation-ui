
## PSP-Validation-UI
### MOOC 2 in BBP

For this psp application, where we have a fixed circuit we do not need the backend.
The only purpose of the backend in the app was to use Snap to fetch the cell types and check the circuit location.

To run this app in development:
```bash
cd frontend
make run_dev
```

For this MOOC, we have a specific branch `mooc-bbp` because this app is different from the original one.
Some of the changes are:
- Remove of backend
- Use VMM - LTI authentication
- Show token expiration page when VMM fails
- Dedicated plan to deploy in Openshift (https://bbpgitlab.epfl.ch/nse/psp-validation-ui/-/jobs/29875)
- Dedicated deployment (https://ocp.bbp.epfl.ch:8443/console/project/bbp-ou-nse/browse/dc/mooc-psp-validation?tab=history)

## Funding & Acknowledgment
 
The development of this software was supported by funding to the Blue Brain Project, a research center of the École polytechnique fédérale de Lausanne (EPFL), from the Swiss government's ETH Board of the Swiss Federal Institutes of Technology.
 
Copyright © 2024 Blue Brain Project/EPFL