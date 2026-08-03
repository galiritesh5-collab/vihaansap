with open('frontend/src/data.ts', 'r') as f:
    content = f.read()

content = content.replace('DoubtTicket', 'Doubt')
content = content.replace('DoubtResponse', 'DoubtReply')

with open('frontend/src/data.ts', 'w') as f:
    f.write(content)
