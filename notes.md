

## When upgrading to project based

neeed to update model-provider-api-keys.
Instead of looking for owner_id = some id, look for project id instead. ( not owner id, bcs one project can be multiple peeps)
GET POST PUT need to be updated.

and then update the logic in settings.tsx.
Now need to check if there is a field called project_id field.

udpate the models.tsx also. Now need to check if api key given ( not owner id) and project id exist. \


bsaically everything need to be updated to check if project_id equals to req.body.project_id and not the otherwise


## if you add more models other than openai

change the model checking logic. and the message if there is no open ai key


## migrate to next
polling system, request openai every 5 minutes or so, instead of fetch on demand.