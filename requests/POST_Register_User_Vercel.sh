curl --request POST \
  --url 'https://backend-express-postgresql-teal.vercel.app//users/register' \
  --header 'Content-Type: application/json' \
  --data '{
    "username": "newuser",
    "email": "lala@gmail.com",
    "password": "securepassword123"
  }'