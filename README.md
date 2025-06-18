### NPM and interactJS
To save trouble of creating a whole ass js script for draggable UI elements, I have chosen to use interactJS.
This requires installation on my part, but I don't think it's required for anyone else.
I hate installing things like this damn

### Some notes:
Need to redirect people from trailhead to elluciancloud
 --> Or, figure out which is which when uploading a created course load

I would like to do updates on class availability but thats a problem for another day

### TODO - One bit at a time

1. Instead of cycling through generated schedules, allow users to drag and drop existing schedules
   A. I have interactJS setup, should just be a copy-paste of the ".draggable" class on their website with some minor adjustments
      1. Maybe make a visual aid of possible sections the user can select
      
   B. Allow users to click the class within the schedule window to select different professors / sections
      1. When the user clicks the class, a lil popup should appear with a table of "section, professor, ratemyprofessor rating"
      2. Have an option to select section by availability instead
      3. Eventually, availability will be implemented :p
   
2. Retrieve the availability of classes

### OLD TODO

#### 1. Create a CSV of all classes: -- 90% DONE
 A. Fix the visual bug of classes being lecture/online - DONE

##### CSV File format: - DONE
CRN, isOnline, classType, isFacetoFace, section, department, courseNum (301), class name, credits, pre-reqs, mutual exclusions, courseDescription, professor, professor email, meetingDays, meetingRange, timeOfDay, RoomNum

##### In regards to the collected information: - THE FIX DOESN'T WORK, NEED TO HAVE A BETTER METHOD
 A. Some classes error out, and I would also like a safety net if the webpage times out.
 B. Minor parsing issues, such as the optional s in "prerequisites"

#### 2. Searching for courses - 66% DONE
 A. Search for keyword -- searches each row for keyword and returns valid row
 B. search for CRN
 C. Sort the list of courses

#### 3. Generating valid schedules - 66% DONE
 
 B. the algorithm - DONE
    1. For each section in a class, recursively find if the rest of set of classes can be loaded in
    2. Every time I can place all classes in the schedule, add the list of CRNS to the result
 C. Lenience with times being blocked out (a bit more nuanced but whatever)
 D. Linked Courses - DONE

#### 4. The scheduling UI
 A. General display things
    1. Displaying what classes conflict and when
    2. Showing pages of schedules instead of an arrow to go to prev and next
       a. Combine schedules with non-unique time slots
         I.  A notification icon to select a professor
         II. Should show CRN, rateMyProfessor stars professor, and availability
    3. Load the schedule ABOVE the table
    4. Needs the little lines between and time of day - DONE
 B. Ability to block out times
    1. drag-and-click would be good
 C. Enable/disable courses
 D. Warnings (you need these pre-requisites)
    1. Maybe a link to degreeWorks or the unofficial transcript
    2. Is a little yellow warning that can be checked off to resolve
    3. Maybe a setting to disable warnings
 E. A timeline to show when classes are active
    1. Condensed timeline for classes that meet at the same time
    2. More attention to 6 week courses -- Update hasConflict for this

####  RateMyProfessor
 A. Pull data from it when requested
 B. Find stars and a link

#### DEGREE WORKS
 A. select classes not completed from degreeWorks to the schedule
 B. The What-If button functionality