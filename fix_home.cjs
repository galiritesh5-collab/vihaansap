const fs = require('fs');

let content = fs.readFileSync('src/pages/Home.tsx', 'utf8');

// Add isSubmitting and formError state
content = content.replace(
  "const [formSubmitted, setFormSubmitted] = useState(false);",
  "const [formSubmitted, setFormSubmitted] = useState(false);\n  const [isSubmitting, setIsSubmitting] = useState(false);\n  const [formError, setFormError] = useState('');"
);

// Replace handleMiniSubmit
const oldSubmit = `  const handleMiniSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactName || !contactEmail || !contactPhone) return;
    setFormSubmitted(true);
    setTimeout(() => {
      setContactName('');
      setContactEmail('');
      setContactPhone('');
      setContactMessage('');
    }, 2000);
  };`;

const newSubmit = `  const handleMiniSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!contactName.trim() || !contactEmail.trim() || !contactPhone.trim()) {
      setFormError('Please fill in Name, Email, and Phone number.');
      return;
    }

    if (!/\\S+@\\S+\\.\\S+/.test(contactEmail)) {
      setFormError('Please enter a valid email address.');
      return;
    }

    setFormError('');
    setIsSubmitting(true);

    const accessKey = import.meta.env.VITE_WEB3FORMS_ACCESS_KEY || "5517e9dc-d32d-49db-b800-665bcb388ece";
    if (!accessKey || accessKey.trim() === '' || accessKey === "5517e9dc-d32d-49db-b800-665bcb388ece") {
      console.error("Missing Web3Forms Access Key.");
      setFormError('Configuration error. Please contact the administrator.');
      setIsSubmitting(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append("access_key", accessKey.trim());
      formData.append("subject", "New Quick Support Preview Request");
      formData.append("from_name", "Vihaan SIP Consultancy");
      formData.append("to_email", "info@srivihaanconsulting.com");
      formData.append("Full Name", contactName.trim());
      formData.append("Email Address", contactEmail.trim());
      formData.append("Phone Number", contactPhone.trim());
      formData.append("Selected SAP Module", contactModule);
      formData.append("Message", contactMessage.trim());
      formData.append("Date & Time of submission", new Date().toLocaleString());

      console.log("Submitting Quick Support Preview Request:");
      console.log("Endpoint: https://api.web3forms.com/submit");
      console.log("Payload:", {
        subject: "New Quick Support Preview Request",
        from_name: "Vihaan SIP Consultancy",
        to_email: "info@srivihaanconsulting.com",
        "Full Name": contactName.trim(),
        "Email Address": contactEmail.trim(),
        "Phone Number": contactPhone.trim(),
        "Selected SAP Module": contactModule,
      });

      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setFormSubmitted(true);
        setContactName('');
        setContactEmail('');
        setContactPhone('');
        setContactMessage('');
      } else {
        if (data.message?.toLowerCase().includes("invalid form id") || data.message?.toLowerCase().includes("access key")) {
          setFormError('Configuration error. Please contact the administrator.');
        } else {
          setFormError('Something went wrong. Please try again later.');
        }
      }
    } catch (err) {
      console.error("Form submission error:", err);
      setFormError('Unable to connect. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };`;

content = content.replace(oldSubmit, newSubmit);

// We need to add error message rendering, since it's a new state variable.
// I will insert it after the paragraph description in the form.

const searchString = `                <p className="text-xs text-slate-500">
                  Fill in your academic or professional interest and get strategic guidance regarding sandbox server configurations.
                </p>`;

const replaceString = `                <p className="text-xs text-slate-500">
                  Fill in your academic or professional interest and get strategic guidance regarding sandbox server configurations.
                </p>
                {formError && (
                  <div className="text-xs text-red-600 bg-red-50 p-2 text-center rounded-lg border border-red-100 font-medium">
                    {formError}
                  </div>
                )}`;

content = content.replace(searchString, replaceString);

// Disable the submit button when submitting
const oldButton = `<button
                  type="submit"
                  className="w-full bg-[#1763B6] hover:bg-[#277EDC] text-white font-semibold py-3 rounded-lg text-sm shadow-md hover:shadow-lg transition-all cursor-pointer pointer-events-auto"
                  id="btn-teaser-submit"
                >
                  Send Inquiry
                </button>`;

const newButton = `<button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#1763B6] hover:bg-[#277EDC] text-white font-semibold py-3 rounded-lg text-sm shadow-md hover:shadow-lg transition-all cursor-pointer pointer-events-auto disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  id="btn-teaser-submit"
                >
                  {isSubmitting ? 'Sending...' : 'Send Inquiry'}
                </button>`;

content = content.replace(oldButton, newButton);

fs.writeFileSync('src/pages/Home.tsx', content);
console.log('Home.tsx updated');
