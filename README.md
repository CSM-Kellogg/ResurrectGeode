### NPM and interactJS
To save trouble of creating a whole ass js script for draggable UI elements, I have chosen to use interactJS.
This requires installation on my part, but I don't think it's required for anyone else.
I hate installing things like this damn


### Some notes:
Need to redirect people from trailhead to elluciancloud
 --> Or, figure out which is which when uploading a created course load

I would like to do updates on class availability but thats a problem for another day

### TODO

#### 1. Create a CSV of all classes: -- 50% DONE

##### CSV File format: - MOSTLY DONE
CRN, isOnline, classType, isFacetoFace, section, department, courseNum (301), class name, credits, pre-reqs, mutual exclusions, courseDescription, professor, professor email, meetingDays, meetingRange, timeOfDay, RoomNum

##### In regards to the collected information:
 A. Some classes error out, and I would also like a safety net if the webpage times out.
 B. Minor parsing issues, such as the optional s in "prerequisites"

##### In regards to parsing the catalog
 A. Need to merge classes that have many sections, such as PRINCIPLES OF CHEMISTRY I
    a. On that note, I need to figure out all these lab/lecture classes and how to combine those
 B. MECHANICAL ENGINEERING => MEGN
    a. Like, for everything
    b. Yikes dude. Maybe Chat can help me

#### 2. Searching for courses - PARTS A, B ARE DONE
 A. I would like to view my saved schedules as a side window or something that can float around
 B. Search for keyword -- searches each row for keyword and returns valid row
 C. search for CRN

#### 3. Generating valid schedules - TODO
 A. The display
    1. Displaying what classes conflict and when
    2. Showing pages of schedules that load in dynamically
    3. 
 B. the algorithm
    1. For each section in a class, recursively find if the rest of set of classes can be loaded in
    2. Every time I can place all classes in the schedule, add the list of CRNS to the result
 C. Lenience with times being blocked out (a bit more nuanced but whatever)

#### 4. The scheduling UI - HELP
 A. Needs the little lines between and time of day (currently has hour blocks, needs 30 min blocks and non-military time)
 B. Ability to block out times
    1. drag-and-click would be good
 C. Enable/disale courses
 D. Warnings (you need these pre-requisites)
    1. Maybe a link to degreeWorks or the unofficial transcript
    2. Is a little yellow warning that can be checked off to resolve
    3. Maybe a setting to disable warnings
 E. Ability to open a link that searches for the professor in rateMyProfessors