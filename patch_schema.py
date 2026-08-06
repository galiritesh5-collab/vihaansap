import os

# 1. Update student.types.ts
types_path = 'frontend/src/types/student.types.ts'
with open(types_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Add ReviewCampaign
if 'export interface ReviewCampaign' not in content:
    campaign_type = """
export interface ReviewCampaign {
  id: string;
  batchId: string;
  name: string;
  description: string;
  externalLink?: string;
  recipientIds: string[];
  status: 'Active' | 'Closed';
  createdAt: string;
  createdBy: string;
}
"""
    content += campaign_type

# Add campaignId to StudentReview
if 'campaignId?: string;' not in content:
    content = content.replace(
        "status?: 'Pending' | 'Approved' | 'Rejected';", 
        "status?: 'Pending' | 'Approved' | 'Rejected';\n  campaignId?: string;"
    )

with open(types_path, 'w', encoding='utf-8') as f:
    f.write(content)
print('Updated student.types.ts')

# 2. Update schema.ts
schema_path = 'frontend/src/lib/mockdb/schema.ts'
try:
    with open(schema_path, 'r', encoding='utf-8') as f:
        schema_content = f.read()
    
    if 'reviewCampaigns: any[];' not in schema_content and 'reviewCampaigns: ReviewCampaign[];' not in schema_content:
        schema_content = schema_content.replace(
            "reviews: any[];",
            "reviews: any[];\n  reviewCampaigns: any[];"
        )
        with open(schema_path, 'w', encoding='utf-8') as f:
            f.write(schema_content)
        print('Updated schema.ts')
except FileNotFoundError:
    print('schema.ts not found, skipping')

# 3. Update MockDB.ts
mockdb_path = 'frontend/src/services/MockDB.ts'
with open(mockdb_path, 'r', encoding='utf-8') as f:
    mockdb_content = f.read()

if 'reviewCampaigns: [],' not in mockdb_content:
    mockdb_content = mockdb_content.replace(
        "reviews: [],",
        "reviews: [],\n  reviewCampaigns: [],"
    )
    with open(mockdb_path, 'w', encoding='utf-8') as f:
        f.write(mockdb_content)
    print('Updated MockDB.ts')

