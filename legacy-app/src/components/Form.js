import React from 'react';

// Form component with error handling issues
function Form() {
  const handleSubmit = (e) => {
    e.preventDefault();
    // ISSUE: No error handling
    // ISSUE: No validation
    // ISSUE: No loading state
    // ISSUE: No success/error feedback
    const data = new FormData(e.target);
    console.log('Form submitted:', data);
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* ISSUE: No label association */}
      {/* ISSUE: No error message display */}
      {/* ISSUE: No required attribute */}
      <input type="text" name="name" placeholder="Name" />
      
      {/* ISSUE: No email validation */}
      {/* ISSUE: No aria-describedby for errors */}
      <input type="email" name="email" placeholder="Email" />
      
      {/* ISSUE: No minlength/maxlength validation */}
      <textarea name="message" placeholder="Message"></textarea>
      
      {/* ISSUE: Button type not specified */}
      {/* ISSUE: No disabled state during submission */}
      <button>Submit</button>
    </form>
  );
}

// Form with async submission - no error handling
export function AsyncForm() {
  const handleSubmit = async (e) => {
    e.preventDefault();
    // ISSUE: No try-catch
    // ISSUE: No loading state
    // ISSUE: No error handling
    const response = await fetch('/api/submit', {
      method: 'POST',
      body: new FormData(e.target)
    });
    const data = await response.json();
    console.log(data);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" name="field" />
      <button type="submit">Submit</button>
    </form>
  );
}

// Form with file upload - security issues
export function FileUploadForm() {
  const handleUpload = (e) => {
    e.preventDefault();
    // ISSUE: No file type validation
    // ISSUE: No file size check
    // ISSUE: No error handling
    const file = e.target.file.files[0];
    const formData = new FormData();
    formData.append('file', file);
    fetch('/api/upload', {
      method: 'POST',
      body: formData
    });
  };

  return (
    <form onSubmit={handleUpload}>
      {/* ISSUE: No accept attribute */}
      {/* ISSUE: No aria-label */}
      <input type="file" name="file" />
      <button>Upload</button>
    </form>
  );
}

// Form with multiple steps - no accessibility
export function MultiStepForm() {
  const [step, setStep] = React.useState(1);
  
  // ISSUE: No aria-live region for step changes
  // ISSUE: No progress indicator
  // ISSUE: No keyboard navigation between steps
  return (
    <div className="multi-step-form">
      {step === 1 && (
        <div>
          <input type="text" placeholder="Step 1" />
          <button onClick={() => setStep(2)}>Next</button>
        </div>
      )}
      {step === 2 && (
        <div>
          <input type="text" placeholder="Step 2" />
          <button onClick={() => setStep(1)}>Back</button>
          <button onClick={() => setStep(3)}>Next</button>
        </div>
      )}
      {step === 3 && (
        <div>
          <input type="text" placeholder="Step 3" />
          <button onClick={() => setStep(2)}>Back</button>
          <button>Submit</button>
        </div>
      )}
    </div>
  );
}

export default Form;