const fs = require('fs');

let content = fs.readFileSync('src/pages/About.tsx', 'utf8');

// Add isSubmitting state
content = content.replace(
  "const [formError, setFormError] = useState('');",
  "const [formError, setFormError] = useState('');\n  const [isSubmitting, setIsSubmitting] = useState(false);"
);

// Replace handleContactSubmit
const oldSubmit = `  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName || !formEmail || !formPhone) {
      setFormError('Please fill in Name, Email range, and WhatsApp Contact.');
      return;
    }
    setFormError('');
    setFormSuccess(true);
    
    setTimeout(() => {
      setFormName('');
      setFormEmail('');
      setFormPhone('');
      setFormMsg('');
      setFormSuccess(false);
    }, 3000);
  };`;

const newSubmit = `  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formName.trim() || !formEmail.trim() || !formPhone.trim()) {
      setFormError('Please fill in Name, Email, and Phone number.');
      return;
    }
    
    if (!/\\S+@\\S+\\.\\S+/.test(formEmail)) {
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
      formData.append("subject", "New Corporate Training Inquiry");
      formData.append("from_name", "Vihaan SIP Consultancy");
      formData.append("to_email", "info@srivihaanconsulting.com");
      formData.append("Full Name", formName.trim());
      formData.append("Email Address", formEmail.trim());
      formData.append("Phone Number", formPhone.trim());
      formData.append("Preferred SAP Module", formModule);
      formData.append("Message", formMsg.trim());
      formData.append("Date & Time of submission", new Date().toLocaleString());

      console.log("Submitting Corporate Training Inquiry:");
      console.log("Endpoint: https://api.web3forms.com/submit");
      console.log("Payload:", {
        subject: "New Corporate Training Inquiry",
        from_name: "Vihaan SIP Consultancy",
        to_email: "info@srivihaanconsulting.com",
        "Full Name": formName.trim(),
        "Email Address": formEmail.trim(),
        "Phone Number": formPhone.trim(),
        "Preferred SAP Module": formModule,
      });

      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setFormSuccess(true);
        setFormName('');
        setFormEmail('');
        setFormPhone('');
        setFormMsg('');
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

// Disable the submit button when submitting
const oldButton = `<button
                    type="submit"
                    className="w-full bg-[#F4A62A] hover:bg-orange-500 active:bg-orange-600 text-slate-900 font-bold py-3.5 px-6 rounded-lg text-sm shadow-md hover:shadow-lg transition-all cursor-pointer pointer-events-auto flex items-center justify-center gap-2 group"
                    id="btn-submit-contact"
                  >
                    Send Message
                    <Send className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  </button>`;
const newButton = `<button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-[#F4A62A] hover:bg-orange-500 active:bg-orange-600 text-slate-900 font-bold py-3.5 px-6 rounded-lg text-sm shadow-md hover:shadow-lg transition-all cursor-pointer pointer-events-auto flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed"
                    id="btn-submit-contact"
                  >
                    {isSubmitting ? 'Sending...' : 'Send Message'}
                    {!isSubmitting && <Send className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />}
                  </button>`;

content = content.replace(oldButton, newButton);

fs.writeFileSync('src/pages/About.tsx', content);
console.log('About.tsx updated');
