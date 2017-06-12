---
layout: page
permalink: /requirements_doc/
title: Requirements document
---

# Requirements Document

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

## Change Log


|Who|When|Which section|What|
|:---|:---|:---|:---|
|Alex+Pieter|22-02-17|All|Created Doc|
|Pieter|25-02-17|All|Processed meeting notes into Requirements Doc (not complete)|
|Edser, Erik + Elena|25-02-17|All|Editing Doc|
|Alex|07-03-17|All|Updating Doc as per feedback|
|Alex|23-03-17|All|Implementing feedback|
|Elena|10-04-17|All|Implementing feedback|
|Erik, Mark|01-05-17|All|Implementing feedback|
|Pieter|15-05-17|Introduction, Title Page|Moved the logo to the Title Page|
|Pieter|15-05-17|Major Features|Removed floating pieces of text, revised requirements to not refer to current implementation|
|Pieter|15-05-17|Major Features|User requirements are general requirements, moved all the requirements that are out of place to appropriate sections, restructured in general|
|Elena|15-05-17|Weekly progress|Added weekly progress|
|Alex|27-05-17|Weekly progress|Added weekly progress|
|Edser|10-06-17|Target Users|Rewrote the message|
|Edser|10-06-17|Layout|Removed random whitespace|
|Edser|10-06-17|All|Implement feedback of past iterations|
|Elena|12-06-17|Weekly progress|Updated the weekly progress|
{:.mbtablestyle}


## Introduction

This document is intended to guide the development of The Distraction Shield. It contains all of the features that are or will be implemented, their importance to the project, and why they are useful.

## General Information

The Distraction Shield is a browser extension designed to take advantage of our human nature. It is a very common scenario to find ourselves browsing sites such as Facebook or Reddit while we are supposed to be working. The Distraction Shield can help you to do something useful and enriching; a distraction 'Aikido' (NOTE:  Aikido is a modern Japanese martial art that focuses on redirecting the momentum of an opponent’s attack.). 

The main functionality of The Distraction Shield extension is to detect when the user enters a website that they consider a distraction. It then presents a language learning exercise instead. Once the user has completed the exercise, they will be free to continue onto the original site. The user can choose for which sites the redirection should happen, by adding domain names to a blacklist. With the success of language platforms like [Duolingo](https://www.duolingo.com/), this simple exercise-based way of learning languages is merged into another popular area: distraction blocking apps such as [ColdTurkey](https://getcoldturkey.com/).

## Target Users

This project is aimed at a large variety of users. These users can be of nearly all ages and backgrounds There are two main traits that these people have in common though: **they are people that get easily distracted** and **people that would like to learn a new language.** Everyone gets distracted or falls prey to procrastination every now and then. Furthermore there are lots of people that have the desire to learn new languages. One group of people one might think of are foreign students, or in general people living abroad. They most likely use computers on a daily basis and might want to pick up the local language. This extension fits the needs of these people perfectly. 

## Major Features

The main features of the extension are presented in this section. Distinction is made between critical, important, useful and excluded features.

### **Critical**

#### General Requirements:

* The user can choose to restrict him/herself of visiting a website by adding a domain or specific url to their 'blacklist' or ‘BlockedSiteList’. This ‘blacklist’ contains all the sites for which, when the user attempts to enter them, the user is intercepted and instead redirected to a language learning exercise.

#### System Requirements

* The extension is developed for Chrome.

### **Important**

#### General Requirements:

* After installing the extension, the user will be presented with a tour of the extension’s pages: tooltip, options and statistics. How to use these pages and the functionality in general. 

#### Interface Requirements:

* There is an options page on which...

    * ...the user can choose between modes:

        * The pro mode:

            * The user is always intercepted (NOTE:  When attempting to navigate to a blacklisted page and the interception is turned on.). When intercepted, the user has to complete the exercise to be able to go to the website they originally intended to visit.

        * The lazy mode:

            * The user is always intercepted (NOTE:  When attempting to navigate to a blacklisted page and the interception is turned on.). When intercepted, the user can skip the exercise with a link and go to the website they originally intended to visit.

    * ...the user can specify the time in minutes before being intercepted again.

    * ...the user can see their blacklist, and for each individual website on the list...

        * ...the favicon of the corresponding page is shown.

        * ...the tab title of the website is shown.

        * ...a checkbox which enables/disables interception of this blocked website is shown

        * ...a delete button through which the website can be removed from the list.

    * ...the user can add a website to the blacklist.

    * ...the user can en/disable interception of entering a blacklisted site for a customizable period of time.

    * ...the tour can be taken again at any time.

    * ...the user can navigate to a feedback form on which feedback can be given to the development team.

* There is a statistics page on which...

    * ...the user can see how many times they have been intercepted in the last day, week, month, and in total.

    * ...the user can see the blacklist and for each website on the list...

        * ...the favicon.

        * ...the website's tab title.

        * ...how many times their navigation to that site was intercepted. 

        * ...how much time was spent on these sites cumulative.

    * ...the user can see on what day they spent how much time on exercises

* There is a tooltip page on which...

    * ...there is a button that can...

        * ...add the current page to the blacklisted, or if the current page is already on the list;

        * ...disable/enable interception of navigation to the current page

    * ...there is a button that opens the statistics page, unless that page is open already, then it switches to that tab.

    * ...there is a button that opens the options page, unless that page is open already, then it switches to that tab.

#### System Requirements:

* Integrate extension with a third party that provides a platform where the user can make better users can make better use of their time.

    * Zeeguu platform provides language learning exercises for the users

    * The extension should be able to extend to other similar platforms with different learning topics ( ex: programming, hobby, etc)

### **Useful**

#### Interface Requirements: 

* Notifications about user’s behaviour. 

    * The application should track the user behaviour :

        * How many times the user skips the exercise when in lazy mode

        * Which mode is most used 

        * After how much time the user deactivates the extension

    * The users should be notified when they skip too many exercises (NOTE:  Became out of scope before final Iteration of this development team).

### **Excluded Features**

* Extension will not be ported to work in Microsoft Internet Explorer.[ The percentage of IE users is less than 15%.](https://www.netmarketshare.com/browser-market-share.aspx?qprid=2&qpcustomd=0) (NOTE:  https://www.netmarketshare.com/browser-market-share.aspx?qprid=2&qpcustomd=0) It is very difficult and time consuming to port the extension to IE. Therefore the decision was made not to do this.


## Non-functional Requirements

#### Maintainability

* Code is of high quality: modularity, maintainability and brevity are of utmost importance in general.

* Use ECMAScript 6  to enable better management of modules, dependencies and classes in specific.	

* Code should be nicely documented, such that a new team can easily take over with this unknown codebase

#### Usablility

* The extension should not be invasive

    * The user has the option to modify the extension up to such a level where the user is intercepted often enough to make it not bug the user, but still be helpful.

        * This in general leads to the need for a highly customizable user experience in which he/she can pick every setting themselves

    * The user has the option of putting the extension in Lazy mode or to turn off the extension for a certain amount of time.

* User can easily modify how the extension works.

    * In the options page, the users can customize the blacklist, the time they have between intercepts, the turn off time.

* Users should not be intercepted when they want to use sites from the blacklist with a different goal than to browse them, specific example: the "Log in with Facebook" option that is provided by other applications/ sites.

## Deployment of the application

* The extension is ready for deployment under the Chrome Extensions store as a beta-run

* The users have the possibility of giving feedback 

    * A feedback form is available by following the link on the options page


## Weekly progress

Here, the requirements of the customer are shown chronologically.

1. First meeting for SE2 - 24.04.2017:

    * **Remove login**: 
        From the tooltip menu, we had to remove the login button 
        We implemented this by moving the login functionality to the options page until the Zeeguu login functionality with cookies will be deployed.

    * **Time tracking per distraction/blocked site**: 
        Before, the amount of interceptions for each blocked site was being tracked. However, tracking time wasted on each distraction is also being tracked now.
    
    * **Disable blocking this page button**: 
        in the tooltip, there is a ‘Save current page button’. When the user is on  a page that is already in the blacklist, the button will now be ‘Disable blocking this page’ and will disable the current page. The enabling back the page can be done from the same button. This functionality is equivalent of checking / unchecking the website from the list in the options page.
    
    * **Change slider and input minutes**: 
        in the options page, it is now possible to input a certain amount of time instead of just using the slider. Also, the color of the slider is changed. 

2. Second meeting for SE2  - 04.05.2017

    * **Polish application**: 
        implement visual changes as provided in the feedback
    
    * **Remove login**: 
        remove the login module of the Distraction Shield and use only the login provided by the Zeeguu application.
    
    * **Add feedback form**: 
        create a way in which the users can provide feedback to the extension
    
    * **Clean code and modularize application**: 
        create a clean version of the extension using ECMA Script 6 

3. Third meeting for SE2  - 24.05.2017

    * **ES6**: 
        Finish our implementation of ECMA Script 6 
    
    * **Login Injection**: 
        Inject a personalized message into the Zeeguu login page so after first redirect to login, the user knows that it is us that took them there  
    
    * **Tracking**: 
        Implement first iteration of user tracking. Collect user data (Options changes, skips, time spent on exercises and blacklisted websites) so that it can be used for analysis
    
    * **Terms and Conditions**: 
        Add terms and conditions for the user to accept upon installation

