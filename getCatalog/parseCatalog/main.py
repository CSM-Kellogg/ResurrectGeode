'''
Takes a raw catalog.csv, merges sections, and deletes duplicate CRNS

TODO: Distinguish lecture and distance learning courses either by labelling them correctly
in the section listing or in the class name

It is possible to do it within the section listing due to the "distance/online" or "face to face" field
'''
import csv

HEADERS = [
    "crn", "campus", "schedule type", "instructional method", "section",
    "department", "coursenum", "class name", "credits", "pre-reqs",
    "mutual exclusions", "coursedescription", "linkedCourses", "professor",
    "professor email", "meetingdays", "meetingrange", "timeofday", "roomnum"
]

# Read a CSV file and store it in result
result = []

with open('catalog.csv', mode='r', newline='', encoding='utf-8') as file:
    csv_reader = csv.reader(file)
    for row in csv_reader:
        result.append(row)

"""
NEW HEADERS:
    "department", "coursenum", "class name", "credits", "pre-reqs",
    "mutual exclusions", "coursedescription", "linkedCourses", "campus",
    "schedType", "sectionListing"
"""
converted = []

while len(result) > 0:
    tmp_course = result.pop()
    sections = [[tmp_course[0]] + tmp_course[3:5] + tmp_course[13:]]

    # Add sections and pop them off the list
    i = 0
    while i < len(result):
        # Check if the course name and type of teaching (lecture/lab) matches (exact) and the CRN is unique to the course name
        if result[i][7] == tmp_course[7] and result[i][2] == tmp_course[2]:
            if result[i][0] not in [j[0] for j in sections]:
                sections.append([result[i][0]] + result[i][3:5] + result[i][13:]) # Append as a section
            del result[i] # Pop the course from the list
        else: i += 1
    
    # Using insert to reverse the list and preserve the intial ordering
    converted.insert(0, tmp_course[5:13] + tmp_course[1:3] + [sections])

# Write out using the GOATed library csv
f = open("refactoredCatalog.csv", 'w', encoding='utf-8', newline='')
writer = csv.writer(f)
writer.writerows(converted)