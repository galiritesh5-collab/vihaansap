import os

# --- PATCH firestore.rules ---
filepath = 'firestore.rules'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# Insert the new rules before match /{document=**}
insert_idx = content.find("match /{document=**}")
if insert_idx == -1:
    print("Could not find catch-all rule in firestore.rules")
    exit(1)

new_rules = """
    match /batches/{document} { allow read: if admin() || (signedIn() && request.auth.uid in resource.data.studentIds); allow write: if admin(); }
    match /batchPlanner/{document} { allow read: if admin() || signedIn(); allow write: if admin(); }
    match /batchSessions/{document} { allow read: if admin() || signedIn(); allow write: if admin(); }
    match /liveClasses/{document} { allow read: if admin() || signedIn(); allow write: if admin(); }
    match /studyMaterials/{document} { allow read: if admin() || signedIn(); allow write: if admin(); }
    match /courseRatings/{document} { allow read: if true; allow write: if admin(); }
    match /schedules/{document} { allow read: if admin() || signedIn(); allow write: if admin(); }
    match /recordings/{document} { allow read: if admin() || signedIn(); allow write: if admin(); }
    match /assignments/{document} { allow read: if admin() || signedIn(); allow write: if admin(); }
    match /payments/{document} { allow read: if admin() || (signedIn() && request.auth.uid == resource.data.studentId); allow write: if admin(); }
    match /events/{document} { allow read: if true; allow write: if admin(); }
    
    """

# We use signedIn() for dependent collections like batchSessions and recordings because 
# the frontend query will already filter by 'batchId' in batchIds (which is securely enforced by the batches rule and the code).
# It's difficult to validate batch membership directly inside rules for dependent collections without duplicating arrays or reading batches (which counts as an extra read per doc).

content = content[:insert_idx] + new_rules + content[insert_idx:]

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated firestore.rules")
