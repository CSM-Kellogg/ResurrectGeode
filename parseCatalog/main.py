'''
Takes a raw catalog.csv, merges sections, and deletes duplicate CRNS
'''
import csv

HEADERS = [
    "crn", "campus", "schedule type", "instructional method", "section",
    "department", "coursenum", "class name", "credits", "pre-reqs",
    "mutual exclusions", "coursedescription", "professor", "professor email",
    "meetingdays", "meetingrange", "timeofday", "roomnum"
]

# Read a CSV file and store it in result
result = []

with open('catalog.csv', mode='r', newline='', encoding='utf-8') as file:
    csv_reader = csv.reader(file)
    for row in csv_reader:
        result.append(row)

"""
NEW HEADERS:
    "department", "coursenum", "class name", "campus", "credits", "pre-reqs",
    "mutual exclusions", "coursedescription", "sectionListing"
"""
converted = []

while len(result) > 0:
    tmp_course = result.pop()
    sections = [[tmp_course[0]] + tmp_course[2:5] + tmp_course[12:]]

    # Add sections and pop them off the list
    i = 0
    while i < len(result):
        # Check if the course name matches (exact) and the CRN is unique to the course name
        if result[i][7] == tmp_course[7]:
            if result[i][0] not in [j[0] for j in sections]:
                sections.append([result[i][0]] + result[i][2:5] + result[i][12:]) # Append as a section
            del result[i] # Pop the course from the list
        else: i += 1
    
    converted.append(tmp_course[5:12] + [tmp_course[1]] + sections)

# Write out using the GOATed library csv
f = open("mergedSections.csv", 'w', encoding='utf-8', newline='')
writer = csv.writer(f)
writer.writerows(converted)