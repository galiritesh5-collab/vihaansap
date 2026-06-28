const fs = require('fs');
let code = fs.readFileSync('src/pages/Courses.tsx', 'utf8');

const t1 = `                        <button
                          onClick={() => onInquireCourse(course.name)}
                          className="w-full text-center bg-[#1763B6] hover:bg-[#277EDC] text-white font-semibold py-2.5 rounded-lg text-xs shadow-xs hover:shadow transition-colors cursor-pointer pointer-events-auto"
                          id={\`btn-courses-inquire-\${course.id}\`}
                        >
                          Inquire Now
                        </button>`;
const r1 = `                        {['sap-hcm', 'sap-basis', 'sap-pp', 'sap-successfactors'].includes(course.id) ? (
                          <button
                            disabled
                            className="w-full text-center bg-slate-200 text-slate-400 font-semibold py-2.5 rounded-lg text-xs cursor-not-allowed"
                            id={\`btn-courses-inquire-\${course.id}\`}
                          >
                            Coming Soon
                          </button>
                        ) : (
                          <button
                            onClick={() => onInquireCourse(course.name)}
                            className="w-full text-center bg-[#1763B6] hover:bg-[#277EDC] text-white font-semibold py-2.5 rounded-lg text-xs shadow-xs hover:shadow transition-colors cursor-pointer pointer-events-auto"
                            id={\`btn-courses-inquire-\${course.id}\`}
                          >
                            Inquire Now
                          </button>
                        )}`;

code = code.split(t1).join(r1);

const t2 = `                        <button
                          onClick={() => onInquireCourse(course.name)}
                          className="bg-[#F4A62A] hover:bg-orange-500 text-slate-900 font-bold px-4 py-2 rounded-lg text-xs shadow-xs hover:shadow transition-all pointer-events-auto shrink-0 cursor-pointer"
                        >
                          Book Saturday Trial Class
                        </button>`;
const r2 = `                        {['sap-hcm', 'sap-basis', 'sap-pp', 'sap-successfactors'].includes(course.id) ? (
                          <button
                            disabled
                            className="bg-slate-200 text-slate-400 font-bold px-4 py-2 rounded-lg text-xs cursor-not-allowed shrink-0"
                          >
                            Coming Soon
                          </button>
                        ) : (
                          <button
                            onClick={() => onInquireCourse(course.name)}
                            className="bg-[#F4A62A] hover:bg-orange-500 text-slate-900 font-bold px-4 py-2 rounded-lg text-xs shadow-xs hover:shadow transition-all pointer-events-auto shrink-0 cursor-pointer"
                          >
                            Book Saturday Trial Class
                          </button>
                        )}`;

code = code.split(t2).join(r2);
fs.writeFileSync('src/pages/Courses.tsx', code);
