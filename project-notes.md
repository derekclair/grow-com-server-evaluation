In my research on the company prior to receiving the assignment I found a number of Grow employees on GitHub and noticed one thing most all had in common, a repository titled "star-wars-assignment" (or similar). In this case I'm going to refrain from referencing any of those repositories, though if this were for a purposes other than evaluating my own coding abilities, one of the first things I would do would be to look over those repositories.
> What's funny, is I first noted the repo on the profile of a DevMountain graduate, so I had assumed in my conversation with Parker this morning that many of the developers on the team were graduates from the code school and that this was one of the school assignments.  Guess not.

I began with looking over the project requirements/specs.

Started by opening the link to [swapi.co](https://swaps.co), then looking up "ESJ" from the Project description. I have not previously seen/used it. 

Examined the [ExpressJS](https://expressjs.com)  documentation, though I've used Express previously, never before has it been the sole transport method, and I've never previously looked over their docs.

Google: "node express app"

[1st article](https://zellwk.com/blog/crud-express-mongodb/) 

@:30min init repository

@1:30 had some issues with my local `eslint` configuration(s) that took some (a lot) of time to resolve. This is a simpler deployment than I've previously dealt with, which required some homework on the fundamental workings of the babel and it's integration with eslint in my local IDE.

Server is now up and running. I'd like to get this EJS running in the client now, only because I've never worked with it before. With that checked-off, I'll be off to the races.

@2:00 ejs rendering, utilizing an `index.ejs` as a template, and rendering children.

Make some request and map the swapi's.

@4:00 getting the asynchronous response from swapi rendering to the EJS template

I'll pick-up in the morning with the sorting and refine the views.

@+-6:00 I've got all the server end points finished, and tried to get EJS to render children templates with the different responses. Ended up scapping the effort after about >1/hr of no results. Couldn't really justify the investment it seemed to require.

I  questioned wheter or not it would be ok to manipulate the "unknown" height & mass values to a NaN to accurately sort by those properties.