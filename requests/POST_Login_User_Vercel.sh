curl --request POST \
  --url 'https://backend-express-postgresql-teal.vercel.app/users/login' \
  --header 'Content-Type: application/json' \
  --data '{
    "username": "newuser",
    "email": "lala@gmail.com",
    "password": "securepassword123"
  }'