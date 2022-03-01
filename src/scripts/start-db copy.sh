
# https://medium.com/@gausmann.simon/nestjs-typeorm-and-postgresql-full-example-development-and-project-setup-working-with-database-c1a2b1b11b8f
#!/bin/bash
set -e

SERVER="quotes-dev";
PW="root";
DB="quotes-db";
SLEEP="/bin/sleep";

echo "echo stop & remove old docker [$SERVER] and starting new fresh instance of [$SERVER]"
(sudo docker kill $SERVER || :) && \
  (sudo docker rm $SERVER || :) && \
  sudo docker run --name $SERVER -e POSTGRES_PASSWORD=$PW \
  -e PGPASSWORD=$PW \
  -p 5433:5433 \
  -d postgres

# wait for pg to start
echo "sleep wait for pg-server [$SERVER] to start";
$SLEEP 3;

# create the db 
echo "CREATE DATABASE $DB ENCODING 'UTF-8';" | sudo docker exec -i $SERVER psql -U postgres
echo "\l" | sudo docker exec -i $SERVER psql -U postgres