curl --request POST \
  --url 'http://localhost:3000/users/register' \
  --header 'Content-Type: application/json' \
  --data '{
    "name": "newuser",
    "email": "lala@gmail.com",
    "password": "securepassword123"
  }'