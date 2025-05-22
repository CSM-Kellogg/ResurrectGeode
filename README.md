# ResurrectGeode
 
Objectives:

1. Scan all courses offered for the semester
    a. Store in some csv
    b. Create a script to load all the courses
    c. The data:
        i. Department (e.g. MEGN)
        ii. Course number (e.g. 200)
        iii. Sections
            A. Professor
            B. Time and Location
                I. (e.g: [(CK140, 2PM, 3PM), (), (CK140, 2PM, 3PM), (), (BE241, 2PM, 3PM)])

2. Create a search menu for the courses
    a. Some ideas:
        i. Department
        ii. Keyword
        iii. Course Number
        iv. Course ID (individual section)
    b. pre-reqs warning
        i. (Optional) Student loads transcript
        ii. 



Ideas for objective 1: Scan all courses

NOTE: Need to redirect people from trailhead to elluciancloud

1. Search by course number 100 to 1XX, 200 to 2XX
    a. For each course, click it and scan sections

2. CSV file format:
| Course CRN | Course Number | Course Name |   Style  |  Credits | Sec. Num |        Pre Reqs        | 
|------------|---------------|-------------|----------|----------|----------|------------------------|  ...
|   80976    |    501 A      |  Adv. Man   | InPerson |     3    |    'A'   |   [MEGN200, MEGN201]   |

| Instruction Begin | Instruction End |       Time And Location      | Enrollment(used) | Waitlist(used) |
|-------------------|-----------------|------------------------------|------------------|----------------| ...
|     8/25/2025     |    12/19/2025   | [null, null, (1400, BBW375)] |       21/30      |      0/10      |

| Mutual Exclusion | Course Description |
|------------------|--------------------|
|  [(AMFG583, D-)] |   This course...   |

Pre-reqs may be in the course description and not the pre-reqs section
Some regex: /[Prerequisites:].*/

Time and Location is a list of tuples from Sunday to Saturday
The data in the tuple is (military-time, location)

I would like to do updates on class availability but thats a problem for another day