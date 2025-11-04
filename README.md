### What this is
A chrome extension to replace what the GEODE scheduler used to be. Among my peers, this service is sorely missed and some replacement would be very welcome. This is especially true for freshmen and sophomores who have a lot of sections and courses to choose from.


### How this works
The course search and schedule generation is handled by the client with all client data managed by the browser's local storage. It should work on chrome.

#### Where we got the catalog
The csv at `/courseScheduler/refactoredCatalog.csv` contains course data scraped from `elluciancloud.com`. This was collected using the xhr library and is contained in a separate project. The format for some request is shown below:

```
### Set the semester term

POST https://reg-prod.mines.elluciancloud.com:8118/StudentRegistrationSsb/ssb/term/search?mode=search HTTP/1.1
Content-Type: application/x-www-form-urlencoded

term=202610

### For some valid CRN (10001), retrieve its course description

POST https://reg-prod.mines.elluciancloud.com:8118/StudentRegistrationSsb/ssb/searchResults/getClassDetails HTTP/1.1
Content-Type: application/x-www-form-urlencoded

term=202610&courseReferenceNumber=10001&first=first
```

#### Installing
This extension can be loaded and tested by turning developer mode on at `chrome://extensions` and loading an unpacked extension. After the extension is loaded, click the icon to open the web page. Again, this was only tested in chrome.

### keyword search
Example keyword searches (case insensitive):
CHGN 12 -> Returns all General Chemistry classes that start with the CRN '12' or the course number '12'
MEGN Blood -> Returns all MEGN courses with Blood as the last name of the professor or Blood in the course name
mechanics Callan -> Returns all courses with 'mechanics' or 'callan' in the course name taught by professor 'callan' or 'mechanics'

#### Add courses and generate schedules
The upper left box is used to search for courses. Clicking a course adds it to a list of selected courses, and generating a schedule takes all possible permutations of sections within all courses selected to make a list of schedules shown in the right pane.

#### Add a break
Click the right pane to mark a break start, and click again to mark a break end. For example, clicking Monday 8:00 AM and then clicking wednesday at 10:00 AM will add a break from 8:00 AM to 10:00 AM for Monday, Tuesday, and Wednesday. No click-to-drag feature yet.

#### Exporting a schedule
First, go to the sign in page with Okta and create a session (I have only tested this feature with the stay signed in button enabled). The link below should take you there if you don't have an active session. If it doesn't, don't worry about it.
```
https://reg-prod.mines.elluciancloud.com:8118/StudentRegistrationSsb/ssb/plan/selectPlan HTTP/1.1
```
Next, generate your schedule and click 'export schedule to trailhead.' If your courses aren't loaded in (type Ctrl + Alt + C to view it), that's a bug. Please post an issue to the github page or email me (kellogg@mines.edu).

### Help

If you want to help me polish this project, specifically with the front end to make it look pretty, let me know. 




### Personal TODO
Flush out cog menu for selecting sections within courses
Create a toggle for filtering by course availability
Display course availability in tooltip pane per CRN