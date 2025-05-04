curl --request POST \
  --url 'https://backend-express-postgresql-teal.vercel.app/users/register' \
  --header 'Content-Type: application/json' \
  --data '{
    "username": "newuser1",
    "email": "lalala@gmail.com",
    "password": "securepassword123"
  }'