---
layout: page
permalink: /architecture_doc/
title: Architecture document
---

# Architecture Document

#### The Distraction Shield

![image alt text](../images/aikido.png)

* version 2.1.0

* Team: Team Distraction Shield

* Team Contact: [distractionshield.devteam@gmail.com](mailto:distractionshield.devteam@gmail.com)

* The Team:
    * Alex Daffurn-Lewis
    * Pieter Dekker
    * Edser Apperloo
    * Elena Ionescu
    * Erik Voogd
    * Mark Timmerman
    * Rowan van Beckhoven
    * Jeroen Overschie



## Introduction

**The Distraction Shield** is a browser extension designed to help people make better use of their time and learn a new language. It takes advantage of our human nature that we are easily distracted by social media and other entertainment sites and turns the normal procrastination time into a productive language learning experience.

The core functionality of The Distraction Shield is to detect when the user visits a site that is he added on a blacklist, and will open a language exercise instead of the site. Once the user has completed the exercise, they will be free to continue onto the original site. 

The learning experience can be personalized, among other things, by having an account on the Zeeguu platform,  maintaining a blacklist of websites that will redirect to the learning platform and by customizing the time interval between two redirects.

## Architectural overview

In order to provide an overview of the Distraction Shield extension, in the appendix of the attached file there is a map of the modules that the application is using and their dependencies. The image can be viewed at a different scale by following this link : 

[Diagram of the module dependencies ](https://www.draw.io/?lightbox=1&highlight=0000ff&edit=_blank&layers=1&nav=1#G0B-uaz9aO7hIDa3AwUDF2aHdYWnM)

[https://drive.google.com/file/d/0B-uaz9aO7hIDa3AwUDF2aHdYWnM/view?usp=sharing](https://drive.google.com/file/d/0B-uaz9aO7hIDa3AwUDF2aHdYWnM/view?usp=sharing)

A diagram without dependencies is presented below, in order to have an overview of the files and modules of the application. These represent how the application is divided.

 ![image alt text](image_1.png)

## The extension platform

The extension is currently developed only for the Chrome web browser. This means that certain parts of the functionality are dependent on what chrome expects from an extension, and the api that is available to extensions in Chrome.

A Chrome-extension starts with a **manifest **file, where the main structure of the of the extension is defined. Also defined in the manifest are the main properties of the extension and the extensions meta-data such as name, version number, etc. 

In the manifest, one or more **background** **scripts or pages **are defined. Everything defined as **background** is run on the **background page**, invisible to the user and having unlimited access to the chrome extension api. The limitation of the **background page** is that it has no access to the webpages the browser displays.

At this point **content** **scripts** come into play. **Content scripts** are scripts that are injected into web pages and therefore have the ability to interact with the pages the user of the extension visits and extending the reach of the extension to those pages. 

It should be noted that, although content scripts are able to interact with the HTML part of web pages, they do not share resources with the javascript that is run on those pages. This means that interaction with those scripts functions and variables is not possible, and addition of functionality to the pages own functionality needs to be done by programmatically loading scripts in the page. Those scripts, although inserted by a **content script**, run like normal scripts and have access to variables and functions from other scripts on the page.

All this dictates the main structure of the extension’s code.

## The exercise platform

The exercises used to help the user spend their time on learning a new language come from the Zeeguu research project ( [https://zeeguu.unibe.ch](https://zeeguu.unibe.ch) ). Zeeguu is a language learning platform that provides exercises based on your previous reading on different articles written in a foreign language. Currently a simple sample page with one exercise has been set up for the extension to use.

## Visual design 

### **The tooltip page**

In order to make it easy for the user to access the options and statistics page, we made a tooltip page that is accessible by clicking on the extension’s icon.

Here the user can also add the current page into the blacklist, in order for him/her not to have to write the site in the options page.

### **The options page**

In this page the user can customize his/her learning experience by choosing : the sites that should be in the blacklist, the mode, the time interval for intercepts or the option to turn off the extension for a certain time. 

![image alt text](image_2.png)

The user can **define which sites** have to be intercepted by the extension by adding or removing sites from a list (the blacklist). The sites can be temporarily disabled by unticking the box near the name of the site. 

The user can choose the** mode**, Lazy or Pro. 	

The user can set** a time interval between intercepts, **which means that after finishing an exercise ( or after pressing the ‘Skip’ button from the Lazy mode) you can enter on sites that are on the blacklist without being intercepted for that certain amount of time. 

Also, the user can set** the time between redirections, **which means that the extension will not intercept your browsing for that given time.

### The statistics page

The user can access a dashboard with **statistics **based on: the number of times he/she was intercepted from a certain site and how much time was spent on this site. Also, the amount of time spent on exercises is being tracked.![image alt text](image_3.png)

### The feedback form

In order to enable users to provide feedback for the extensions, a form can be accessed from the options page.

In this form users can answer questions related to the :

1. Design of the application

2. How easy it is to use the application

3. New features that they would like

4. How they feel interacting with the application

The form is implemented as a Google form, and can be accessed  through the following link : [https://goo.gl/forms/e1u8uxBeDDezVfPG](https://goo.gl/forms/e1u8uxBeDDezVfPG2)

#### **The interception **

When the user enters a site that is on the list of blocked sites, he/she is redirected to a language exercise. The page where the user is redirected looks like the following image. It should be noticed that in the lower part of the page, the user is presented with information about the reason of redirection and with the option button to Skip. The ‘Skip’ functionality is explained below.

![image alt text](image_4.png)

Here, the flow depends on the mode that the user previously selected:

*  when the extension is in** "lazy" mode**,  the user has the opportunity to skip the exercise by pressing a button - “ Skip”.

*  when the extension is in** "pro" mode**, the user continues with the exercise, and at the end of the exercise they are presented with two possibilities: they can **go back to the original destination** or they ca**n continue to do exercises**. Clicking the “Take me away!” button will take the user to their original destination.

![image alt text](image_5.png)

The redirection url is stored in the actual URL of the Zeeguu exercise. After the exercise is done, the user is redirected to that URL. It was decided to use this approach as the client provided us with the code of the Zeeguu platform. It was possible to change the Zeeguu platform code to make this work.

![image alt text](image_6.png)

### Control  

#### The background page

In our extension the background page relies on a single JavaScript file that takes care of initialization when the extension is first installed, and then puts a message listener for the URLs entered. If a URL is entered, the extension checks if the URL is in the black list. If it is, it is intercepted and the user is redirected to the page with a language exercise. The Chrome API’s greatly encourage the use of event-driven programming, therefore The Distraction Shield also implements this. In the background, the extension also tracks user statistics with respect to distractions and language exercises.

#### Content Scripts

Using content scripts we inject JavaScript code into the Zeeguu exercise. This way, it is possible to inject a panel that tells the user that it was the extension that sent them there. This is currently possible in two modes: "lazy" and “pro”. The general sequence of actions that are taken when the extension is active is shown below (Step1 and Step2 diagrams). 

### Usage flow 

The following diagram describes the user interaction with the extension in two steps.

**In the first step**, it is presented what happens when the user enters an URL in the browser. It is mentioned that the redirection happens if the entered URL is in the user’s blacklist and if the extension is enabled. This means that the extension is not turned off or disabled because the user recently solved an exercise. **In the second step**, it is presented what happens after the user is redirected to the Zeeguu page.

![image alt text](image_7.png)

![image alt text](image_8.png)

### Storage 

The Chrome Extension API provides a possibility to delegate the burden of storage to the browser, and at the same time allow the user to tie the stored data to their google account if they are logged in with one. This part of the Chrome Extension API is used to store statistics and the blacklist of sites.

## First utilization

The flow of the first utilization of the extension is presented below. After the user installs The Distraction Shield, the user is presented with the option of taking a tour that would explain the functionalities of the extension. Together with this all the data that is saved is initialized such that whenever there is a GET-request to the storage, data will not be ‘undefined’ nor will it be ‘NULL’.

Below is an SSD diagram, not of the first install, but of the user starting a new session. The installation is a rather dull SSD where we only initialize values that were not there before. This SSD will occur every time the user starts a new browsing session.

![image alt text](image_9.png)

#### Log in

The login into the Zeeguu platform is handled by the platform itself. When the user is redirected to the language learning exercise, there are two options :

* if the users are not logged in, they are presented with the login page of the Zeeguu platform. After this they will be presented with an exercise.

* If the users are logged in, they are redirected to a Zeeguu exercise

## Technology Stack

Currently, the Chrome Extensions API is used for the functionality of the extension and JQuery UI for the visual aspects.

Languages :

* JavaScript      : for the functionality and control of the extension

    * ECMAScript 6 : for modularization and class functionality

* HTML/ CSS    : for the visual design ( the options pop-up)

Libraries: 

* JQuery

* Bootstrap          

Building tools:

* Node : for module management

* Bower: for package management

* Broccoli: used for fast build

## Team Organization 

In order to merge the work of different groups, we met and explained each other’s code. Followed up by having a session of combining all functionalities so far which and make sure everything works properly. After every iteration, we refactored the code in order to incorporate all the feedback received. 

## Appendix

![image alt text](image_10.png)

## Change Log

|Who|When|Which section|What|
|:---|:---|:---|:---|
|Pieter, Elena|08-03-17|All|Created Doc|
|Pieter, Elena|22-03-17|All|Processed meeting notes, implement feedback|
|Elena|10-04-17|All|Implement feedback|
|Pieter|01-05-2017|Architectural Overview|Updated the intro of 'the extension platform'|
|Pieter|01-05-2017|Visual Design|Removed an obscure reference to the future|
|Pieter|01-05-2017|Architectural|Added to the background part of 'Control'|
|Elena|15-05-2017|Architectural|Added diagram of the module dependencies and two step diagram with user flow|
|Elena|15-05-2017|Visual|Updated images|
|Elena|29-05-2017|Architectural|Updated text based on feedback|
|Edser|10-06-2017|Architectural|Implement feedback on text|
|Edser|11-06-2017|Architectural|Fix diagrams and feedback on these|
|Elena|11-06-2017|Visual|Updated images|
|Elena, Edser|12-06-2017|Visual|Fix diagrams|
{:.mbtablestyle}



