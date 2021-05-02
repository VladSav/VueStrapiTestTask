# Vlad Savilo test task Vue.js + Strapi

## strapi 

In root folder you can find ***data.db*** file. You should paste it into the ***./strapi/.tmp/*** folder

Then you can use comand **docker compose up** to run application

Default admin link is [http://localhost:1337](http://localhost:1337)


> Login:        user@gmail.com

> Password:     dev123DEV

---

## Vue

The simplest way to run the project is: 

1. open ***./ui*** folder 
2. use comand **npm run dev**
3. open [http://localhost:8080](http://localhost:8080) in your browser

If you want compilev files in production mode:

1. open folder ***./ui*** 
2. use comand **npm run build**
3. copy all from ***./ui/dist*** folder to your server or use some program like **Open Server**
4. open it

---

## Vue + Strapi

If you need to change strapi host you can do it in ***./ui/.env*** file. 

Only because it's test task you can see this file in GitHub.
