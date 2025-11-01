### What this is
A chrome extension to replace what the GEODE scheduler used to be. Among my peers, this service is sorely missed and some replacement would be very welcome. This is especially true for freshmen and sophomores who have a lot of sections and courses to choose from.


### How this works
The course search and schedule generation is handled by the client with all client data managed by the browser's local storage. This is currently tested on the latest build of chrome.

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
This extension can be loaded and tested by turning developer mode on at `chrome://extensions` and loading an unpacked extension. After the extension is loaded, click the icon to open the web page.

#### Add courses and generate schedules
The upper left box is used to search for courses. Clicking a course adds it to a list of selected courses, and generating a schedule takes all possible permutations of sections within all courses selected to make a list of schedules shown in the right pane.

#### Add a break
Click the right pane to mark a break start, and click again to mark a break end. For example, clicking Monday 8:00 AM and then clicking wednesday at 10:00 AM will add a break from 8:00 AM to 10:00 AM for Monday, Tuesday, and Wednesday

#### Exporting a schedule
This is currently in-progress. When done, it will open a new tab to `elluciancloud` and take over the client to add the selected courses within the extension to a new course plan in `elluciancloud`. As far as I understand it, due to active sessions and a `x-synchronizer-token`, this is the best way. I also could not find an API...