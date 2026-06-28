const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

walkDir('./src', function(filePath) {
  if (filePath.endsWith('.tsx') || filePath.endsWith('.ts')) {
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;
    
    // Task 3: 12 Years -> 15+ Years
    content = content.replace(/12\+ Yrs/gi, '15+ Yrs');
    content = content.replace(/12\+ years/gi, '15+ years');
    content = content.replace(/12 Years/gi, '15+ Years');
    
    // Task 4: Week Nights -> Weekends & Weekdays
    content = content.replace(/Week Nights/gi, 'Weekends & Weekdays');
    content = content.replace(/weeknight and weekend/gi, 'weekends and weekdays');
    
    // Task 5: Practice Assignments -> Real-World Scenario Based Assignments
    content = content.replace(/Practical Assignments/gi, 'Real-World Scenario Assignments');
    content = content.replace(/Practice Assignments/gi, 'Real-World Scenario Based Assignments');
    content = content.replace(/Solve rigorous assignments at the end of every chapter on real SAP sandboxes, which are evaluated with direct trainer feedback\./gi, 'Engage with practical exercises designed using real implementation scenarios on actual SAP sandboxes, reflecting genuine business requirements\.');
    
    // Task 6: Remove Resume claims
    content = content.replace(/Resume Polishing/gi, 'Career Guidance');
    content = content.replace(/Resume portion/gi, 'Career Guidance');
    content = content.replace(/Resume Building/gi, 'Interview Prep');
    content = content.replace(/Resume Enhancement/gi, 'Professional Development');
    content = content.replace(/Resume Optimization/gi, 'Industry Readiness');
    content = content.replace(/custom resume polishing \(customized for SAP opportunities\), /gi, '');
    content = content.replace(/Bespoke Custom Resume Grooming/gi, 'Industry Interview Preparation');
    content = content.replace(/Custom keyword resume grooming./gi, 'Advanced interview preparation.');
    content = content.replace(/Make your resume stand out in candidate pools\. We help you reorganize your profile structure, focusing heavily on hands-on project scenarios, system definitions, and mock sandboxes\./gi, 'Prepare for technical interviews with scenario-based mock sessions and direct feedback based on real-world industrial implementation methodologies.');
    content = content.replace(/Send us your background resumes/gi, 'Send us your background profile');
    content = content.replace(/Resume Support/gi, 'Career Support');
    content = content.replace(/Resume Review/gi, 'Career Review');
    
    // Task 7: Replace "Industry Veterans" -> "Real-Time Industry Experts"
    content = content.replace(/Industry Veterans/gi, 'Real-Time Industry Experts');
    content = content.replace(/industry veterans/gi, 'real-time industry experts');
    
    // Task 8: Placement Preparation -> Placement Assistance & Guidance
    content = content.replace(/Placement Preparation/gi, 'Placement Assistance & Guidance');
    content = content.replace(/Placement Guarantee/gi, 'Placement Assistance');
    content = content.replace(/Job Guarantee/gi, 'Job Search Support');
    
    if (content !== original) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log('Updated', filePath);
    }
  }
});
