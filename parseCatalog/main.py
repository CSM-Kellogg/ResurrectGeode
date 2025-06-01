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


