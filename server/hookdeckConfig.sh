#!/bin/bash

(./hookdeckService.sh "github" "/services/github/webhook")&
sleep 5
(./hookdeckService.sh "trello" "/services/trello/webhook")&
sleep 5
wait