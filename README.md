## EVcharge

<p align="center">

[![License](https://img.shields.io/badge/license-BSD-green.svg)](https://github.com/Uttam-crypto/EVcharge/blob/main/LICENSE) [![Website](https://img.shields.io/badge/View-Website-blue)](https://funcharge.herokuapp.com/)

<b>EVCharge</b> is an interactive and responsive web application which makes it fun for EV owners to charge their vehicles. The application uses various APIs to provide most efficient route, while listing and ranking options of charging stations and recreational activities that commuters can meanwhile engage in, emergency contacts to keep them safe, etc.

## Contents

1. [Short description](#short-description)
2. [Demo video](#demo-video)
3. [Medium Article](#medium-article)
4. [Architecture](#architecture)
5. [Live demo](#live-demo)
6. [Built with](#built-with)
7. [Authors](#authors)
8. [License](#license)

## Short Description

### What's the problem?

Electrical Vehicles are very good for environment but entails a very annoying problem of charging, rather than wasting time while car is charging you could spend that time in recreational activities which maybe nearby your charging station.

### How can technology help?

With our technology you can optimally decide when you should charge your car along with recommendation of charging stations based on nearby recreational activities or places.

### The idea

funCharge directly traces trajectory and possible charging station you can reach with given charge then compares them based on recreational activities nearby.

## Demo Video

[Video]()


## Architecture

1. IBM Watson provides assitance to the user as funCharge as it helps him/her guide through different features and functionalities 
2. User accesses the domain using Heroku services
3. Heroku executes nodeJS to render the website
4. HERE Map API (funCharge) sends information about distances and routing along with locations nearby which are critical to optimal decisions.
5. Custom Helpline API : implemented using sqlite3, API strictly follows CRUD principles and provides various helplines based on country name.

## Live Demo

You can find a running system to test at [electric-vehicle.herokuapp.com](https://electric-vehicle.herokuapp.com/)

## Built With

* [Postman](https://www.postman.com/) - API Testing
* [IBM Watson](https://www.ibm.com/in-en/watson) - Chat Assistant : funCharge Bot
* [HERE Maps API](https://developer.here.com/) - HERE Map API for Tracking Routes
* [nodeJS](https://nodejs.org/en/) - Server Runtime Environment
* [Github](https://github.com/) - Version control
* [Heroku](https://www.heroku.com/) - Cloud Hosting Service
* [jQuery](https://jquery.com/) - JavaScript Library for handling AJAX
* [PushBot](https://pushbots.com/) - Notifications
* [Semantic UI](https://semantic-ui.com/) - Frontend Components and UI/UX Design
* [sqlite3](https://www.sqlite.org/) - Helpline API design

## Authors

* **Uttam** - [Uttam-crypto](https://github.com/Uttam-crypto)
* **Aamartya Kumar Yadav** 
* **Amartya Sen Yadav** 
* **Shreyash Kumar** 
  

## License

This prject is licensed under the BSD 3 License - see the [LICENSE](LICENSE) file for details.

