with open('frontend/src/services/FirestoreDBService.ts', 'r') as f:
    content = f.read()

content = content.replace(\"'doubts',\", \"'doubts',\n  'doubtReplies',\")

with open('frontend/src/services/FirestoreDBService.ts', 'w') as f:
    f.write(content)
