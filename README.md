# By Its Cover 
By Its Cover is a Tinder-style app for book recommendations. Book cover images are generated randomly, and you have the option to either swipe/click left to see a new book cover, or, if the image intrigues you, you can swipe/click right to view more information about the book, including title, author, ISBN, page count, average rating, and a short plot description. Account users have the option to save books to their My List for future reference.

#Approach
My approach on this application was very UX-driven. I chose to mimic the Tinder swiping functionality to give users a strictly visual element that they can then judge for themselves whether or not they're interested in more information about the selected book. I also chose to enable browsing of book covers without having a user account because I didn't want people to be required to commit personal info before they're even invested in the application. I did, however want to provide an incentive to create a user account by enabling account holders to save book selections, which is why I included the My List function.

# Technology
HTML
Javascript & jQuery
Express
PostgreSQL
Bootstrap

# Installation Instructions
git clone

# Unsolved Issues
There are several. I used Google Books API, which didn't really return the quality of information that I had hoped for. I also had many async issues because the information I was trying to get required two requests to the API. At this point, I can get about 15 results, but it makes the application really slow and sometimes it just breaks. In continuing to work on this, I'm probably going to try to implement a different API so that I can get better information and maybe be able to avoid the async issues I've been having altogether.
